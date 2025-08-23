// reduceAgents.js
// Usage: node reduceAgents.js <input_folder> <output_folder>
import fs from "fs";
import path from "path";
import pkg from "papaparse";
import { v4 as uuidv4 } from "uuid"; // Add UUID import
const { parse: parseCSV, unparse: unparseCSV } = pkg;
import xlsx from "xlsx";

const MAX_RECORDS_PER_FILE = 20000;
const REQUIRED_FIELDS = [
  "id", // Add id field as the first field
  "name",
  "agencyName",
  "profileUrl",
  "phoneNumbers",
  "emailAddresses",
  "source",
  "metaData",
];

function isCSV(file) {
  return file.toLowerCase().endsWith(".csv");
}
function isXLSX(file) {
  return file.toLowerCase().endsWith(".xlsx");
}

function inferSourceFromFilename(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes("homes.com")) return "homes.com";
  if (lower.includes("realtor.com")) return "realtor.com";
  if (lower.includes("remax.com")) return "remax.com";
  if (lower.includes("data2") && lower.includes("part1")) return "data2part1";
  if (lower.includes("data2") && lower.includes("part2")) return "data2part2";
  return "other";
}

// Map data according to source format (copied/adapted from AgentImport.vue)
function mapDataBySource(data, source) {
  return data
    .map((item) => {
      switch (source) {
        case "homes.com":
          return {
            name: item.agent_full_name || "",
            agencyName: item.agency_name || "",
            emailAddresses: item.emails ? [item.emails] : [],
            phoneNumbers: item.agent_phone_number
              ? [item.agent_phone_number]
              : [],
            profileUrl: item.agent_profile_link || "",
            source: "homes.com",
            metaData: JSON.stringify({
              ...item,
              license_number: item.licence_number,
              agent_license: item.agent_licence,
              mls_number: item.mls_number,
            }),
          };
        case "realtor.com":
          return {
            name: item["Full Name"] || "",
            agencyName: "realtor.com",
            emailAddresses: item.Email ? [item.Email] : [],
            phoneNumbers: item.Office ? [item.Office] : [],
            profileUrl: item["Profile Url"] || "",
            source: "realtor.com",
            metaData: JSON.stringify(item),
          };
        case "remax.com": {
          let remaxEmails = [];
          if (item["Email 1"]) {
            remaxEmails.push(
              ...item["Email 1"]
                .split(",")
                .map((email) => email.trim())
                .filter(Boolean),
            );
          }
          if (item["Email 2"]) {
            remaxEmails.push(
              ...item["Email 2"]
                .split(",")
                .map((email) => email.trim())
                .filter(Boolean),
            );
          }
          let phoneNumbers = [];
          if (item["Phone Number"]) {
            const phoneMatches = item["Phone Number"].match(
              /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
            );
            if (phoneMatches) {
              phoneNumbers.push(...phoneMatches);
            } else {
              phoneNumbers.push(
                ...item["Phone Number"]
                  .split(",")
                  .map((phone) => phone.trim())
                  .filter(Boolean),
              );
            }
          }
          ["Cell Phone", "Office Phone", "Direct Line", "Fax"].forEach(
            (fieldName) => {
              if (item[fieldName]) {
                phoneNumbers.push(
                  ...item[fieldName]
                    .split(",")
                    .map((phone) => phone.trim())
                    .filter(Boolean),
                );
              }
            },
          );
          return {
            name: item["Full Name"] || "",
            agencyName: "RE/MAX",
            emailAddresses: remaxEmails,
            phoneNumbers: phoneNumbers,
            profileUrl: item["Profile URL on RE/MAX"] || "",
            source: "remax.com",
            metaData: JSON.stringify(item),
          };
        }
        case "data2part1":
          return {
            name: item["Full Name"] || "",
            agencyName: item.Association || "",
            emailAddresses: item.Email ? [item.Email] : [],
            phoneNumbers: [item["Office Phone"], item["Cell Phone"]].filter(
              Boolean,
            ),
            profileUrl: "",
            source: "data2_part1",
            metaData: JSON.stringify(item),
          };
        case "data2part2":
          return {
            name: item.Full_Name || "",
            agencyName: item.Agency_Name || "",
            emailAddresses: item.email_address ? [item.email_address] : [],
            phoneNumbers: item.Phone_Number ? [item.Phone_Number] : [],
            profileUrl: "",
            source: "data2_part2",
            metaData: JSON.stringify(item),
          };
        case "other":
          return {
            name:
              item["name"] ||
              item["Full Name"] ||
              item["agent_name"] ||
              item["Agent Name"] ||
              "",
            agencyName:
              item["agency"] ||
              item["Agency"] ||
              item["agencyName"] ||
              item["Agency Name"] ||
              "",
            emailAddresses: [
              item["email"] ||
                item["Email"] ||
                item["emailAddress"] ||
                item["email_address"] ||
                "",
            ].filter(Boolean),
            phoneNumbers: [
              item["phone"] ||
                item["Phone"] ||
                item["phoneNumber"] ||
                item["phone_number"] ||
                "",
            ].filter(Boolean),
            profileUrl:
              item["profileUrl"] ||
              item["Profile"] ||
              item["profile_url"] ||
              "",
            source: "other",
            metaData: JSON.stringify(item),
          };
        default:
          return {
            name: "",
            agencyName: "",
            emailAddresses: [],
            phoneNumbers: [],
            profileUrl: "",
            source: source,
            metaData: JSON.stringify(item),
          };
      }
    })
    .filter((item) => {
      // Only include items with a name and at least one email address
      return item.name && item.emailAddresses && item.emailAddresses.length > 0;
    });
}

async function processCSV(filePath, source) {
  const content = fs.readFileSync(filePath, "utf8");
  return new Promise((resolve, reject) => {
    parseCSV(content, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(mapDataBySource(results.data, source));
      },
      error: (err) => reject(err),
    });
  });
}

function processXLSX(filePath, source) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "",
  });
  return mapDataBySource(data, source);
}

async function main() {
  const [, , inputDir, outputDir] = process.argv;
  if (!inputDir || !outputDir) {
    console.error("Usage: node reduceAgents.js <input_folder> <output_folder>");
    process.exit(1);
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const files = fs.readdirSync(inputDir);
  let allRecords = [];
  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const source = inferSourceFromFilename(file);
    if (isCSV(file)) {
      console.log(`Processing CSV: ${file} (source: ${source})`);
      const records = await processCSV(filePath, source);
      allRecords = allRecords.concat(records);
    } else if (isXLSX(file)) {
      console.log(`Processing XLSX: ${file} (source: ${source})`);
      const records = processXLSX(filePath, source);
      allRecords = allRecords.concat(records);
    } else {
      console.log(`Skipping unsupported file: ${file}`);
    }
  }

  // Deduplicate by (name + agencyName), merging phoneNumbers and emailAddresses
  const dedupedMap = new Map();
  for (const rec of allRecords) {
    const key = `${rec.name.trim().toLowerCase()}|${rec.agencyName.trim().toLowerCase()}`;
    if (!dedupedMap.has(key)) {
      // Start with this record, but keep a list of all merged metaData
      dedupedMap.set(key, {
        ...rec,
        phoneNumbers: Array.isArray(rec.phoneNumbers)
          ? [...rec.phoneNumbers]
          : [],
        emailAddresses: Array.isArray(rec.emailAddresses)
          ? [...rec.emailAddresses]
          : [],
        _metaList: [rec.metaData],
      });
    } else {
      const existing = dedupedMap.get(key);
      // Merge phone numbers and emails (deduped)
      existing.phoneNumbers = Array.from(
        new Set([...existing.phoneNumbers, ...(rec.phoneNumbers || [])]),
      );
      existing.emailAddresses = Array.from(
        new Set([...existing.emailAddresses, ...(rec.emailAddresses || [])]),
      );
      existing._metaList.push(rec.metaData);
    }
  }

  // Prepare for CSV output
  const dedupedRecords = Array.from(dedupedMap.values()).map((r) => ({
    id: uuidv4(), // Generate a UUID for each record
    name: r.name,
    agencyName: r.agencyName,
    profileUrl: r.profileUrl,
    phoneNumbers: r.phoneNumbers.join("; "),
    emailAddresses: r.emailAddresses.join("; "),
    source: r.source,
    metaData: JSON.stringify(r._metaList),
  }));

  // Write a single CSV file
  const outPath = path.join(outputDir, "agents_deduped.csv");
  const csv = unparseCSV(dedupedRecords, { columns: REQUIRED_FIELDS });
  fs.writeFileSync(outPath, csv);
  console.log(
    `Wrote deduplicated CSV to ${outPath} with ${dedupedRecords.length} records.`,
  );
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
