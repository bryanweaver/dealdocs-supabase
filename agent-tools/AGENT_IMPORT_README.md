# Agent Import Workflow

This document describes the workflow for importing agent data into the DynamoDB database using our custom scripts.

**Note: All agent import tools are located in the `agent-tools/` directory.**

## Available Scripts

- `reduceAgents.js` - Processes CSV/Excel files, maps fields, deduplicates records, and generates a CSV with UUIDs
- `validateCSVids.js` - Validates a CSV file to ensure all records have valid UUIDs
- `fixCSVids.js` - Repairs CSV files with missing or malformed IDs
- `convertToDynamoDBJson.js` - Converts a CSV file to DynamoDB JSON format for S3 import
- `importAgentsToDynamoDB.js` - Directly imports records from CSV to DynamoDB using AWS SDK
- `checkTable.js` - Lists DynamoDB tables and verifies credentials/access

## Workflow Steps

### 1. Process Raw Data Files

Process your raw agent data files (CSV/XLSX) to create a deduplicated CSV:

```bash
cd agent-tools
node reduceAgents.js ./input_folder ./reduced
```

This script:

- Reads all CSV/XLSX files in the input folder
- Maps the data according to source format
- Deduplicates records by (name + agency), merging phone numbers and emails
- Generates UUIDs for each record
- Outputs a single CSV file with all processed records

### 2. Validate the CSV (Optional)

Check if the CSV has valid UUIDs:

```bash
node validateCSVids.js ./reduced/agents_deduped.csv
```

### 3. Import the Data

Choose one of these methods:

#### Option A: Direct Import (Recommended)

This is the most reliable method:

```bash
node importAgentsToDynamoDB.js ./reduced/agents_deduped.csv ListingAgentContactInfo-[suffix]-dev [region]
```

Replace `[suffix]` with your actual table suffix and `[region]` with your AWS region (e.g., us-east-1).

#### Option B: S3 Import with DynamoDB JSON

If you prefer using the S3 import method:

1. Convert CSV to DynamoDB JSON format:

```bash
node convertToDynamoDBJson.js ./reduced/agents_deduped.csv ./reduced/agents_dynamo.json
```

2. Upload the JSON file to S3
3. In the DynamoDB console, use the "Import from S3" feature
4. Select "Amazon DynamoDB JSON" as the import format
5. Follow the import wizard to complete the process

## Troubleshooting

If you encounter issues:

1. Check your AWS credentials:

```bash
node checkTable.js [region] [profile]
```

2. Verify the exact table name to use
3. For CSV errors, try the repair tool:

```bash
node fixCSVids.js ./reduced/agents_deduped.csv ./reduced/agents_fixed.csv
```

## Notes

- The scripts handle deduplication and generate proper UUIDs
- All semi-colon separated fields (phoneNumbers, emailAddresses) are properly converted to arrays
- The metaData field preserves all original data from the source files
