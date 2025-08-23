// validateCSVids.js
// Usage: node validateCSVids.js <csv_file_path>
import fs from "fs";
import pkg from "papaparse";
const { parse: parseCSV } = pkg;

async function validateCSV(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  return new Promise((resolve, reject) => {
    parseCSV(content, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(`Total rows in CSV: ${results.data.length}`);

        // Check if 'id' column exists
        if (!results.meta.fields.includes("id")) {
          console.error('ERROR: CSV file does not have an "id" column!');
          console.log("Available columns:", results.meta.fields.join(", "));
          resolve(false);
          return;
        }

        console.log("ID column found. Checking for missing or invalid IDs...");

        // Check each row for valid ID
        const rowsWithMissingIds = results.data.filter(
          (row) => !row.id || row.id.trim() === "",
        );
        const rowsWithShortIds = results.data.filter(
          (row) => row.id && row.id.length < 10,
        ); // UUIDs should be much longer

        // Check for duplicate UUIDs
        const idMap = new Map();
        const duplicateIds = [];

        results.data.forEach((row, index) => {
          if (row.id && row.id.trim() !== "") {
            if (idMap.has(row.id)) {
              duplicateIds.push({
                id: row.id,
                firstOccurrence: idMap.get(row.id),
                secondOccurrence: index,
                row,
              });
            } else {
              idMap.set(row.id, index);
            }
          }
        });

        let isValid = true;

        if (rowsWithMissingIds.length > 0) {
          console.error(
            `ERROR: ${rowsWithMissingIds.length} rows have missing IDs.`,
          );
          console.log(
            "First 5 rows with missing IDs:",
            rowsWithMissingIds.slice(0, 5),
          );
          isValid = false;
        }

        if (rowsWithShortIds.length > 0) {
          console.warn(
            `WARNING: ${rowsWithShortIds.length} rows have suspiciously short IDs.`,
          );
          console.log(
            "First 5 rows with short IDs:",
            rowsWithShortIds.slice(0, 5),
          );
        }

        if (duplicateIds.length > 0) {
          console.error(
            `ERROR: ${duplicateIds.length} duplicate UUIDs found in the CSV!`,
          );
          console.log("First 5 duplicate ID instances:");
          duplicateIds.slice(0, 5).forEach((dupe) => {
            console.log(
              `  UUID "${dupe.id}" appears at rows ${dupe.firstOccurrence + 1} and ${dupe.secondOccurrence + 1}`,
            );
          });
          isValid = false;
        } else {
          console.log("SUCCESS: No duplicate IDs found.");
        }

        if (isValid) {
          console.log("SUCCESS: All rows have unique valid ID values.");

          // Show sample data for verification
          console.log("\nSample first 3 rows:");
          results.data.slice(0, 3).forEach((row, i) => {
            console.log(`Row ${i + 1}:`, row);
          });
        }

        resolve(isValid);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        reject(error);
      },
    });
  });
}

async function main() {
  const [, , csvFilePath] = process.argv;

  if (!csvFilePath) {
    console.error("Usage: node validateCSVids.js <csv_file_path>");
    process.exit(1);
  }

  try {
    console.log(`Validating CSV file: ${csvFilePath}`);
    const isValid = await validateCSV(csvFilePath);

    if (!isValid) {
      console.error(
        "\nCSV validation FAILED. Please fix the issues before importing.",
      );
      process.exit(1);
    } else {
      console.log(
        "\nCSV validation PASSED. The file should be ready for import.",
      );
    }
  } catch (error) {
    console.error("Error validating CSV:", error);
    process.exit(1);
  }
}

main();
