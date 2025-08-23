// checkTable.js
// Usage: node checkTable.js [region] [profile]
import {
  DynamoDBClient,
  ListTablesCommand,
  DescribeTableCommand,
} from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";

async function checkDynamoDBTables(region = "us-east-1", profile = null) {
  console.log(
    `Checking DynamoDB tables in region ${region}${profile ? ` with profile ${profile}` : ""}...`,
  );

  // Set up client with credentials
  const clientConfig = { region };

  if (profile) {
    process.env.AWS_PROFILE = profile;
    console.log(`Using AWS profile: ${profile}`);
  }

  // Create client with credentials from environment
  const client = new DynamoDBClient(clientConfig);

  try {
    // List all tables
    const listResult = await client.send(new ListTablesCommand({}));

    if (listResult.TableNames && listResult.TableNames.length > 0) {
      console.log(`Found ${listResult.TableNames.length} tables:`);

      // Display all tables
      for (const tableName of listResult.TableNames) {
        console.log(` - ${tableName}`);

        // Check if the table name looks like our target (ListingAgentContactInfo)
        if (tableName.includes("ListingAgentContactInfo")) {
          console.log(`   This looks like your target table!`);

          // Get detailed table info
          try {
            const tableDetails = await client.send(
              new DescribeTableCommand({ TableName: tableName }),
            );
            console.log(`   Status: ${tableDetails.Table.TableStatus}`);
            console.log(
              `   Partition key: ${tableDetails.Table.KeySchema[0].AttributeName}`,
            );
            console.log(`   Item count: ${tableDetails.Table.ItemCount}`);
            console.log(
              `   For import, use EXACTLY this table name: ${tableName}`,
            );
          } catch (describeErr) {
            console.log(`   Error getting details: ${describeErr.message}`);
          }
        }
      }
    } else {
      console.log("No tables found in this region with these credentials.");
      console.log(
        "This suggests you may need to use a different profile or region.",
      );
    }

    console.log("\nIf you don't see your table above, try:");
    console.log(
      "1. Different AWS profile: node checkTable.js us-east-1 your-profile-name",
    );
    console.log("2. Different region: node checkTable.js us-west-2");
    console.log(
      "3. Check AWS credentials in ~/.aws/credentials or AWS_ACCESS_KEY_ID environment variable",
    );
  } catch (error) {
    console.error("Error listing tables:", error);
    console.error(
      "This typically means your AWS credentials are invalid or expired.",
    );
    console.error(
      "Check ~/.aws/credentials file or your environment variables.",
    );
  }
}

async function main() {
  const region = process.argv[2] || "us-east-1";
  const profile = process.argv[3] || null;
  await checkDynamoDBTables(region, profile);
}

main();
