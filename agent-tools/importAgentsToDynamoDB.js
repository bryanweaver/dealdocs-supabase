// importAgentsToDynamoDB.js
// Usage: node importAgentsToDynamoDB.js <csv_file_path> <table_name> [<region>]
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import pkg from "papaparse";
const { parse: parseCSV } = pkg;

// Constants
const BATCH_SIZE = 25; // DynamoDB BatchWrite limit
const RETRY_DELAY_BASE = 50; // base milliseconds to delay for exponential backoff
const MAX_RETRIES = 10;

// Create DynamoDB clients
const createDynamoDBClient = (region = "us-east-1") => {
  console.log(`Creating DynamoDB client for region: ${region}`);

  // Initialize the DynamoDB client with more explicit configuration
  const client = new DynamoDBClient({
    region,
    // Force the SDK to use environment credentials
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    },
  });

  return DynamoDBDocumentClient.from(client);
};

// Parse CSV data
async function readCSVFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return new Promise((resolve, reject) => {
    parseCSV(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

// Transform CSV record to DynamoDB item
function transformRecordToDynamoItem(record) {
  // Generate UUID for id
  const id = uuidv4();
  const timestamp = new Date().toISOString();

  // Parse phoneNumbers and emailAddresses from semicolon-separated strings to arrays
  const phoneNumbers = record.phoneNumbers
    ? record.phoneNumbers
        .split(";")
        .map((p) => p.trim())
        .filter(Boolean)
    : [];
  const emailAddresses = record.emailAddresses
    ? record.emailAddresses
        .split(";")
        .map((e) => e.trim())
        .filter(Boolean)
    : [];

  // Ensure metaData is valid JSON
  let metaData;
  try {
    metaData = JSON.parse(record.metaData);
  } catch (err) {
    console.warn(`Invalid metaData, using empty object for record`, record);
    metaData = {};
  }

  return {
    id,
    name: record.name || "",
    agencyName: record.agencyName || "",
    profileUrl: record.profileUrl || "",
    phoneNumbers,
    emailAddresses,
    source: record.source || "",
    importDate: timestamp,
    metaData: JSON.stringify(metaData),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

// Batch write items with automatic retries on throttling
async function batchWriteItemsWithRetry(
  client,
  tableName,
  items,
  retryCount = 0,
) {
  const putRequests = items.map((item) => ({
    PutRequest: {
      Item: item,
    },
  }));

  const params = {
    RequestItems: {
      [tableName]: putRequests,
    },
  };

  try {
    const result = await client.send(new BatchWriteCommand(params));

    // Check for unprocessed items
    if (
      result.UnprocessedItems &&
      Object.keys(result.UnprocessedItems).length > 0
    ) {
      const unprocessedItems = result.UnprocessedItems[tableName] || [];
      if (unprocessedItems.length > 0) {
        console.log(`Retrying ${unprocessedItems.length} unprocessed items...`);

        // Exponential backoff
        const delay = Math.min(
          RETRY_DELAY_BASE * Math.pow(2, retryCount),
          1000,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Extract the items from the unprocessed requests
        const unprocessedPutItems = unprocessedItems.map(
          (req) => req.PutRequest.Item,
        );

        // Retry with the unprocessed items
        return batchWriteItemsWithRetry(
          client,
          tableName,
          unprocessedPutItems,
          retryCount + 1,
        );
      }
    }

    return { success: true };
  } catch (error) {
    if (
      error.name === "ProvisionedThroughputExceededException" &&
      retryCount < MAX_RETRIES
    ) {
      console.log(
        `Throughput exceeded, retrying batch (${retryCount + 1}/${MAX_RETRIES})...`,
      );
      const delay = Math.min(RETRY_DELAY_BASE * Math.pow(2, retryCount), 2000);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return batchWriteItemsWithRetry(client, tableName, items, retryCount + 1);
    }

    throw error;
  }
}

// Main function
async function main() {
  const [, , csvFilePath, tableName, region = "us-east-1"] = process.argv;

  if (!csvFilePath || !tableName) {
    console.error(
      "Usage: node importAgentsToDynamoDB.js <csv_file_path> <table_name> [<region>]",
    );
    process.exit(1);
  }

  try {
    console.log(`Reading CSV file: ${csvFilePath}`);
    console.log(`Target table: ${tableName} in region ${region}`);
    console.log(
      `Using AWS credentials from environment: ${process.env.AWS_PROFILE || "(default)"}`,
    );

    const records = await readCSVFile(csvFilePath);
    console.log(`Found ${records.length} records in CSV file`);

    const dynamoClient = createDynamoDBClient(region);
    const dynamoItems = records.map(transformRecordToDynamoItem);

    // Process in batches
    const batches = [];
    for (let i = 0; i < dynamoItems.length; i += BATCH_SIZE) {
      batches.push(dynamoItems.slice(i, i + BATCH_SIZE));
    }

    console.log(
      `Processing ${dynamoItems.length} items in ${batches.length} batches...`,
    );

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      try {
        await batchWriteItemsWithRetry(dynamoClient, tableName, batch);
        successCount += batch.length;
        console.log(
          `Progress: ${i + 1}/${batches.length} batches processed (${successCount}/${dynamoItems.length} items)`,
        );
      } catch (error) {
        console.error(`Error processing batch ${i + 1}:`, error);
        failureCount += batch.length;
      }
    }

    console.log("Import completed:");
    console.log(`Successfully imported: ${successCount} items`);
    console.log(`Failed to import: ${failureCount} items`);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
}

main();
