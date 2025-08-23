// fixCSVids.js
// Usage: node fixCSVids.js <input_csv> <output_csv>
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import pkg from "papaparse";
const { parse: parseCSV, unparse: unparseCSV } = pkg;

async function fixCSV(inputPath, outputPath) {
  const content = fs.readFileSync(inputPath, "utf-8");

  return new Promise((resolve, reject) => {
    parseCSV(content, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(`Total rows in CSV: ${results.data.length}`);

        // Check for problem areas around the reported error
        const startRow = Math.max(0, 9300); // Start checking a bit before the error
        const endRow = Math.min(results.data.length, 9500); // Check a bit after the error

        console.log(
          `Examining rows ${startRow} to ${endRow} (around the error area)...`,
        );

        // Track problems found
        let missingIds = 0;
        let regeneratedIds = 0;
        let doubleQuoteIssues = 0;

        // Check and fix each row
        results.data.forEach((row, index) => {
          // Fix missing or empty ID fields
          if (!row.id || row.id.trim() === "") {
            missingIds++;
            row.id = uuidv4();
            regeneratedIds++;
          }

          // Fix potential issues with double quotes in the data that might cause parsing problems
          if (row.id && row.id.includes('"')) {
            doubleQuoteIssues++;
            row.id = row.id.replace(/"/g, "");
          }

          // Output diagnostic info for the problem area
          if (index >= startRow && index <= endRow) {
            if (!row.id || row.id.trim() === "" || row.id.includes('"')) {
              console.log(`Issue at row ${index + 1}: ${JSON.stringify(row)}`);
            }
          }
        });

        console.log(`Found and fixed ${missingIds} rows with missing IDs`);
        console.log(`Regenerated ${regeneratedIds} IDs`);
        console.log(`Fixed ${doubleQuoteIssues} issues with quotes in IDs`);

        // Write fixed CSV
        const csv = unparseCSV(results.data);
        fs.writeFileSync(outputPath, csv);
        console.log(`Fixed CSV written to ${outputPath}`);

        // Additional check for BOM characters which can cause issues
        if (content.charCodeAt(0) === 0xfeff) {
          console.warn(
            "WARNING: Input CSV file has BOM character. Removing from output.",
          );
        }

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
    console.error("Usage: node fixCSVids.js <input_csv> <output_csv>");
    process.exit(1);
  }

  try {
    console.log(`Fixing CSV file: ${inputPath} -> ${outputPath}`);
    await fixCSV(inputPath, outputPath);
    console.log("Done! Upload the fixed CSV to S3 and try the import again.");
  } catch (error) {
    console.error("Error fixing CSV:", error);
    process.exit(1);
  }
}

main();
