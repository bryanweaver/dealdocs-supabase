// convertToDynamoDBJson.js
// Usage: node convertToDynamoDBJson.js <input_csv> <output_json>
import fs from "fs";
import pkg from "papaparse";
const { parse: parseCSV } = pkg;

async function convertToJson(inputPath, outputPath) {
  const content = fs.readFileSync(inputPath, "utf-8");

  return new Promise((resolve, reject) => {
    parseCSV(content, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(
          `Converting ${results.data.length} records to DynamoDB JSON format...`,
        );

        // Process each record to DynamoDB JSON format
        const dynamoItems = results.data.map((row) => {
          // Split phone numbers and email addresses by semicolon
          const phoneNumbers = row.phoneNumbers
            ? row.phoneNumbers.split(";").filter((p) => p && p.trim())
            : [];

          const emailAddresses = row.emailAddresses
            ? row.emailAddresses.split(";").filter((e) => e && e.trim())
            : [];

          // Parse metadata from JSON string to object
          let metaData = {};
          try {
            if (row.metaData) {
              metaData = JSON.parse(row.metaData);
            }
          } catch (e) {
            console.warn(
              `Warning: Invalid metaData for record with id ${row.id}`,
            );
          }

          // Format for DynamoDB Import - each attribute needs type annotation
          return {
            Item: {
              id: { S: row.id },
              name: { S: row.name || "" },
              agencyName: { S: row.agencyName || "" },
              profileUrl: { S: row.profileUrl || "" },
              phoneNumbers: {
                L: phoneNumbers.map((p) => ({ S: p })),
              },
              emailAddresses: {
                L: emailAddresses.map((e) => ({ S: e })),
              },
              source: { S: row.source || "" },
              importDate: { S: new Date().toISOString() },
              metaData: { S: JSON.stringify(metaData) },
              createdAt: { S: new Date().toISOString() },
              updatedAt: { S: new Date().toISOString() },
            },
          };
        });

        // Write to output file in DynamoDB JSON format
        // Each item must be on a separate line without commas between items
        const outputContent = dynamoItems
          .map((item) => JSON.stringify(item))
          .join("\n");
        fs.writeFileSync(outputPath, outputContent);

        console.log(`Successfully converted to DynamoDB JSON format.`);
        console.log(`Output written to ${outputPath}`);
        console.log(
          `Upload this file to S3 and use "Amazon DynamoDB JSON" as the import format.`,
        );

        resolve(true);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        reject(error);
      },
    });
  });
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;

  if (!inputPath || !outputPath) {
    console.error(
      "Usage: node convertToDynamoDBJson.js <input_csv> <output_json>",
    );
    process.exit(1);
  }

  try {
    await convertToJson(inputPath, outputPath);
  } catch (error) {
    console.error("Error converting CSV to DynamoDB JSON:", error);
    process.exit(1);
  }
}

main();
