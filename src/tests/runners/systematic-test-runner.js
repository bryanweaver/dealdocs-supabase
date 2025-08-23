#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

function loadRealAddresses() {
  const addressDbPath = path.join(
    process.cwd(),
    "src",
    "tests",
    "data",
    "real-addresses-db.json",
  );

  if (!fs.existsSync(addressDbPath)) {
    console.log("❌ No real addresses database found at:", addressDbPath);
    console.log(
      "💡 Please run address scraping first to populate the database",
    );
    process.exit(1);
  }

  try {
    const dbContent = fs.readFileSync(addressDbPath, "utf8");
    const db = JSON.parse(dbContent);

    if (!db.addresses || db.addresses.length === 0) {
      console.log("❌ Address database is empty");
      console.log("💡 Please run address scraping to populate the database");
      process.exit(1);
    }

    return db.addresses;
  } catch (error) {
    console.log("❌ Error reading address database:", error.message);
    process.exit(1);
  }
}

function selectTestAddresses(allAddresses, count = 10) {
  // Filter untested addresses first
  const untestedAddresses = allAddresses.filter((addr) => !addr.tested);

  if (untestedAddresses.length === 0) {
    console.log("⚠️ All addresses have been tested. Using all addresses...");
    return allAddresses.slice(0, count);
  }

  // Select up to 'count' untested addresses
  const selectedCount = Math.min(count, untestedAddresses.length);
  return untestedAddresses.slice(0, selectedCount);
}

function formatAddressForTest(address) {
  // Extract house number and street name parts
  const houseNumber = address.houseNumber;
  const fullAddress = address.address;

  // Extract street name from the address
  // Pattern: "1440 Waseca St, Houston" -> extract "Waseca St"
  const streetMatch = fullAddress.match(/^\d+\s+(.+?),/);
  const streetName = streetMatch ? streetMatch[1].trim() : "";

  // Get first word of street name
  const firstStreetWord = streetName.split(" ")[0];

  // Create the search string: house number + first word of street
  const searchString = `${houseNumber} ${firstStreetWord}`;

  return {
    fullAddress: fullAddress + ", TX", // Add TX for consistency
    searchString: searchString,
    houseNumber: houseNumber,
    streetName: streetName,
    id: address.id,
  };
}

function generateFeatureFile(addresses, testCount) {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const featureContent = `Feature: Systematic Property Search Testing - Session ${sessionId}
  As a quality assurance engineer
  I want to systematically test property searches with ${testCount} real Texas addresses
  So that I can identify data inconsistencies and API issues

  @systematic
  Scenario Outline: Property Search with Address "<address>" using "<searchString>"
    Given I navigate to the login page
    When I enter my username
    And I enter my password
    And I click the login button
    Then I should see the contract listing
    When I click on "Start New Contract"
    And I click on "Let's Go!"
    And I enter the address "<searchString>"
    And I capture any console errors
    And I select a random option from the dropdown if available
    And I click "Fetch Property Details"
    Then I should see the property details page
    And I record the test results for "<address>"

    Examples:
      | address | searchString |
${addresses.map((addr) => `      | ${addr.fullAddress} | ${addr.searchString} |`).join("\n")}
`;

  return featureContent;
}

async function runSystematicTests(addressCount = 10) {
  console.log("🚀 Starting Systematic Property Search Testing");
  console.log(`📊 Loading real addresses from database...`);

  // Load real addresses from database
  const allAddresses = loadRealAddresses();
  console.log(`✅ Found ${allAddresses.length} addresses in database`);

  // Select addresses for testing
  const selectedAddresses = selectTestAddresses(allAddresses, addressCount);
  console.log(`📝 Selected ${selectedAddresses.length} addresses for testing`);

  // Format addresses for test
  const testAddresses = selectedAddresses.map((addr) =>
    formatAddressForTest(addr),
  );

  console.log("\n🏠 Test addresses:");
  testAddresses.forEach((addr, i) => {
    console.log(`   ${i + 1}. ${addr.fullAddress}`);
    console.log(`      Search: "${addr.searchString}"`);
  });

  // Create feature file
  const featureContent = generateFeatureFile(testAddresses, addressCount);
  const featureFilePath = path.join(
    process.cwd(),
    "src",
    "tests",
    "systematic-generated.feature",
  );

  console.log("\n📄 Creating test feature file...");
  fs.writeFileSync(featureFilePath, featureContent);
  console.log(`✅ Feature file created: ${featureFilePath}`);

  // Check if we need to build
  console.log("\n🔧 Running build to ensure latest code...");
  try {
    await execAsync("npm run build");
    console.log("✅ Build completed successfully");
  } catch (error) {
    console.log("⚠️ Build had issues, continuing with tests...");
    console.log(error.stdout || error.stderr);
  }

  // Run the BDD tests
  console.log("\n🧪 Running systematic BDD tests...");
  try {
    const testCommand = `node --loader ts-node/esm node_modules/.bin/cucumber-js src/tests/systematic-generated.feature --import 'src/tests/steps/*.ts' --format @cucumber/pretty-formatter`;
    console.log(`Executing: ${testCommand}`);

    const { stdout, stderr } = await execAsync(testCommand);

    console.log("\n📈 Test execution completed!");
    if (stdout) {
      console.log("STDOUT:", stdout);
    }
    if (stderr) {
      console.log("STDERR:", stderr);
    }
  } catch (error) {
    console.log("\n⚠️ Test execution encountered issues:");
    if (error.stdout) {
      console.log("STDOUT:", error.stdout);
    }
    if (error.stderr) {
      console.log("STDERR:", error.stderr);
    }
    console.log("Error:", error.message);
  }

  // Check results
  console.log("\n📊 Checking test results...");
  const resultsPath = path.join(
    process.cwd(),
    "src",
    "tests",
    "data",
    "test-results.json",
  );

  if (fs.existsSync(resultsPath)) {
    try {
      const fileContent = fs.readFileSync(resultsPath, "utf8");
      const results = JSON.parse(fileContent);

      // Ensure results is an array
      const resultsArray = Array.isArray(results) ? results : [];

      // Filter to ONLY current test run - use a shorter window since we just ran the tests
      const currentTestStart = Date.now() - 3 * 60 * 1000; // Last 3 minutes (tests just completed)
      recentResults = resultsArray.filter((r) => {
        const resultTime = new Date(r.timestamp).getTime();
        return resultTime > currentTestStart;
      });

      console.log(
        `✅ Found ${recentResults.length} results from current test session`,
      );

      if (recentResults.length === 0) {
        console.log(
          "⚠️ No results from current test session found. Tests may not have run properly.",
        );
        return;
      }

      // Make sure we only have results equal to the number of addresses we tested
      const currentSessionResults = recentResults.slice(-addressCount); // Take the last N results

      console.log(
        `🎯 Analyzing ${currentSessionResults.length} addresses from this test run`,
      );

      // Analyze property content quality
      const addressResults = currentSessionResults.map((result) => {
        const metrics = result.propertyMetrics || {};
        const contentScore = result.contentQualityScore || 0;

        // Determine if this address has any property content at all
        const hasAnyContent = Object.values(metrics).some(
          (val) => val === true,
        );
        const meaningfulContent = [
          metrics.hasPrice,
          metrics.hasBedrooms,
          metrics.hasBathrooms,
          metrics.hasSquareFootage,
        ].some((val) => val === true);
        const isNoDataCase = contentScore <= 15 && !meaningfulContent; // Low score + no meaningful property data = no data case

        return {
          address: result.address.fullAddress,
          selectedProperty: result.address.selectedProperty,
          hasDropdownResults:
            result.additionalData?.hasDropdownResults || false,
          dropdownCount: result.additionalData?.dropdownResultCount || 0,
          contentScore: contentScore,
          hasImage: metrics.hasImage,
          hasPrice: metrics.hasPrice,
          hasDescription: metrics.hasDescription,
          hasBedrooms: metrics.hasBedrooms,
          hasBathrooms: metrics.hasBathrooms,
          hasSquareFootage: metrics.hasSquareFootage,
          hasAddress: metrics.hasAddress,
          errorType: result.errorType,
          errorMessage: result.errorMessage,
          hasAnyContent: hasAnyContent,
          hasMeaningfulContent: meaningfulContent,
          noPropertyData: isNoDataCase,
        };
      });

      // Categorize results
      const workingResults = addressResults.filter((r) => r.hasDropdownResults);
      const noDataResults = addressResults.filter((r) => !r.hasDropdownResults);
      const successfulFetches = workingResults.filter(
        (r) => r.hasMeaningfulContent,
      );
      const failedFetches = workingResults.filter(
        (r) => !r.hasMeaningfulContent,
      );

      console.log("\n📈 Property Search Results Summary:");
      console.log(`   🎯 Total Addresses Tested: ${addressResults.length}`);
      console.log(`   ✅ Found Dropdown Results: ${workingResults.length}`);
      console.log(`   📭 No Dropdown Results: ${noDataResults.length}`);
      console.log(
        `   🏠 Successfully Fetched Property Data: ${successfulFetches.length}`,
      );
      console.log(
        `   ❌ Failed to Fetch Property Data: ${failedFetches.length}`,
      );

      // Show detailed property content analysis
      console.log("\n🔍 Property Content Quality Analysis:");

      if (successfulFetches.length > 0) {
        const avgScore = Math.round(
          successfulFetches.reduce((sum, r) => sum + r.contentScore, 0) /
            successfulFetches.length,
        );
        console.log(`   📊 Average Content Quality Score: ${avgScore}%`);

        // Count specific metrics (only for addresses with content)
        const imageCount = successfulFetches.filter((r) => r.hasImage).length;
        const priceCount = successfulFetches.filter((r) => r.hasPrice).length;
        const descCount = successfulFetches.filter(
          (r) => r.hasDescription,
        ).length;
        const bedroomCount = successfulFetches.filter(
          (r) => r.hasBedrooms,
        ).length;
        const bathroomCount = successfulFetches.filter(
          (r) => r.hasBathrooms,
        ).length;
        const sqftCount = successfulFetches.filter(
          (r) => r.hasSquareFootage,
        ).length;

        console.log(
          `   🖼️  Properties with Images: ${imageCount}/${successfulFetches.length} (${Math.round((imageCount / successfulFetches.length) * 100)}%)`,
        );
        console.log(
          `   💰 Properties with Prices: ${priceCount}/${successfulFetches.length} (${Math.round((priceCount / successfulFetches.length) * 100)}%)`,
        );
        console.log(
          `   📝 Properties with Descriptions: ${descCount}/${successfulFetches.length} (${Math.round((descCount / successfulFetches.length) * 100)}%)`,
        );
        console.log(
          `   🛏️  Properties with Bedroom Info: ${bedroomCount}/${successfulFetches.length} (${Math.round((bedroomCount / successfulFetches.length) * 100)}%)`,
        );
        console.log(
          `   🚿 Properties with Bathroom Info: ${bathroomCount}/${successfulFetches.length} (${Math.round((bathroomCount / successfulFetches.length) * 100)}%)`,
        );
        console.log(
          `   📐 Properties with Square Footage: ${sqftCount}/${successfulFetches.length} (${Math.round((sqftCount / successfulFetches.length) * 100)}%)`,
        );
      } else {
        console.log("   ⚠️ No successful property data fetches to analyze.");
      }

      // Show individual results
      console.log("\n📋 Individual Test Results:");
      addressResults.forEach((result, index) => {
        console.log(`\n   ${index + 1}. ${result.address}`);

        if (!result.hasDropdownResults) {
          console.log(`      ❌ No dropdown results found`);
        } else {
          console.log(
            `      ✅ Found ${result.dropdownCount} dropdown options`,
          );
          console.log(
            `      🎯 Selected: ${result.selectedProperty || "None"}`,
          );

          if (result.noPropertyData) {
            console.log(`      📊 Content Quality: ${result.contentScore}%`);
            console.log(`      ❌ No property data available for this address`);
          } else {
            console.log(`      📊 Content Quality: ${result.contentScore}%`);
            console.log(`         🖼️  Image: ${result.hasImage ? "✅" : "❌"}`);
            console.log(`         💰 Price: ${result.hasPrice ? "✅" : "❌"}`);
            console.log(
              `         📝 Description: ${result.hasDescription ? "✅" : "❌"}`,
            );
            console.log(
              `         🛏️  Bedrooms: ${result.hasBedrooms ? "✅" : "❌"}`,
            );
            console.log(
              `         🚿 Bathrooms: ${result.hasBathrooms ? "✅" : "❌"}`,
            );
            console.log(
              `         📐 Sq Ft: ${result.hasSquareFootage ? "✅" : "❌"}`,
            );
          }

          if (result.errorType === "console_error") {
            console.log(`      ⚠️  Console errors detected`);
          }
        }
      });
    } catch (error) {
      console.log("❌ Could not parse results file:", error.message);
    }
  } else {
    console.log(
      "⚠️ No results file found. Tests may not have completed properly.",
    );
  }

  // Update the address database to mark addresses as tested and move them to master file
  console.log("\n📝 Updating address database...");
  const addressDbPath = path.join(
    process.cwd(),
    "src",
    "tests",
    "data",
    "real-addresses-db.json",
  );
  const masterFilePath = path.join(
    process.cwd(),
    "src",
    "tests",
    "data",
    "tested-addresses",
    "master-tested-addresses.json",
  );

  // Initialize recentResults from earlier in the function
  let recentResults = [];

  try {
    // Load current database
    const dbContent = fs.readFileSync(addressDbPath, "utf8");
    const db = JSON.parse(dbContent);

    // Load master tested addresses file
    let masterData = {
      addresses: [],
      summary: { totalAddresses: 0, lastUpdated: new Date().toISOString() },
    };
    if (fs.existsSync(masterFilePath)) {
      const masterContent = fs.readFileSync(masterFilePath, "utf8");
      masterData = JSON.parse(masterContent);
    }

    // Process each tested address
    const testedAddresses = [];
    const remainingAddresses = [];

    db.addresses.forEach((addr) => {
      const wasTestedThisRun = testAddresses.find((ta) => ta.id === addr.id);

      if (wasTestedThisRun) {
        // Move to tested addresses with results from this run
        const addressWithResults = {
          id: addr.id,
          address: addr.address,
          houseNumber: addr.houseNumber,
          source: addr.source,
          scrapedAt: addr.scrapedAt,
          method: addr.method,
          firstTestedAt: addr.lastTestedAt || new Date().toISOString(),
          lastTestedAt: new Date().toISOString(),
          totalTests: 1,
          metrics: {
            hasDropdownResults: false,
            dropdownResultCount: 0,
            reachedPropertyDetails: false,
            hasImage: null,
            hasPrice: null,
            hasDescription: null,
            hasBedrooms: null,
            hasBathrooms: null,
            hasSquareFootage: null,
            hasAddress: null,
            overallSuccess: false,
            contentQualityScore: 0,
            lastContentCheck: new Date().toISOString(),
          },
          testSessions: [],
        };

        // Try to find the actual test results for this address
        if (recentResults.length > 0) {
          const addressResult = recentResults.find(
            (r) =>
              r.address.fullAddress.includes(addr.houseNumber) ||
              r.address.fullAddress.includes(addr.address.split(",")[0]),
          );

          if (addressResult) {
            const metrics = addressResult.propertyMetrics || {};
            addressWithResults.metrics = {
              hasDropdownResults:
                addressResult.additionalData?.hasDropdownResults || false,
              dropdownResultCount:
                addressResult.additionalData?.dropdownResultCount || 0,
              reachedPropertyDetails: true,
              hasImage: metrics.hasImage,
              hasPrice: metrics.hasPrice,
              hasDescription: metrics.hasDescription,
              hasBedrooms: metrics.hasBedrooms,
              hasBathrooms: metrics.hasBathrooms,
              hasSquareFootage: metrics.hasSquareFootage,
              hasAddress: metrics.hasAddress,
              overallSuccess: (addressResult.contentQualityScore || 0) > 0,
              contentQualityScore: addressResult.contentQualityScore || 0,
              lastContentCheck: addressResult.timestamp,
            };

            addressWithResults.testSessions.push({
              sessionId: addressResult.sessionId,
              timestamp: addressResult.timestamp,
              status:
                addressResult.errorType === "success" ? "SUCCESS" : "FAILED",
              errorType: addressResult.errorType,
              contentQualityScore: addressResult.contentQualityScore || 0,
              details: addressResult.propertyMetrics || {},
            });
          }
        }

        testedAddresses.push(addressWithResults);
      } else {
        // Keep in buffer (not tested this run)
        remainingAddresses.push(addr);
      }
    });

    // Add tested addresses to master file
    if (!masterData.addresses) masterData.addresses = [];
    masterData.addresses.push(...testedAddresses);

    // Update master file summary
    masterData.summary = {
      totalAddresses: masterData.addresses.length,
      totalTestSessions: masterData.addresses.reduce(
        (sum, addr) => sum + addr.testSessions.length,
        0,
      ),
      successfulAddresses: masterData.addresses.filter(
        (addr) => addr.metrics.overallSuccess,
      ).length,
      addressesWithDropdownResults: masterData.addresses.filter(
        (addr) => addr.metrics.hasDropdownResults,
      ).length,
      addressesWithPropertyDetails: masterData.addresses.filter(
        (addr) => addr.metrics.reachedPropertyDetails,
      ).length,
      addressesWithImages: masterData.addresses.filter(
        (addr) => addr.metrics.hasImage,
      ).length,
      addressesWithPrices: masterData.addresses.filter(
        (addr) => addr.metrics.hasPrice,
      ).length,
      addressesWithDescriptions: masterData.addresses.filter(
        (addr) => addr.metrics.hasDescription,
      ).length,
      averageContentQualityScore:
        masterData.addresses.length > 0
          ? Math.round(
              masterData.addresses.reduce(
                (sum, addr) => sum + (addr.metrics.contentQualityScore || 0),
                0,
              ) / masterData.addresses.length,
            )
          : 0,
      overallSuccessRate: `${Math.round((masterData.addresses.filter((addr) => addr.metrics.overallSuccess).length / masterData.addresses.length) * 100)}%`,
      lastUpdated: new Date().toISOString(),
    };

    // Update buffer database (remove tested addresses)
    db.addresses = remainingAddresses;
    db.metadata = {
      totalUntestedAddresses: remainingAddresses.length,
      lastScrapingSession:
        db.metadata?.lastScrapingSession || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      nextAvailableForTesting: remainingAddresses.length,
    };

    // Save both files
    fs.writeFileSync(addressDbPath, JSON.stringify(db, null, 2));
    fs.writeFileSync(masterFilePath, JSON.stringify(masterData, null, 2));

    console.log("✅ Address database updated");
    console.log(
      `   📤 Moved ${testedAddresses.length} tested addresses to master file`,
    );
    console.log(
      `   📋 ${remainingAddresses.length} untested addresses remaining in buffer`,
    );
  } catch (error) {
    console.log("⚠️ Could not update address database:", error.message);
  }

  console.log("\n🎯 Systematic testing completed!");
  console.log(`📄 Feature file: ${featureFilePath}`);
  console.log(`📊 Results file: ${resultsPath}`);
}

// Command line interface
const args = process.argv.slice(2);
const addressCount = args[0] ? parseInt(args[0]) : 10;

if (isNaN(addressCount) || addressCount < 1 || addressCount > 50) {
  console.log("Usage: node systematic-test-runner.js [number_of_addresses]");
  console.log("Number of addresses must be between 1 and 50");
  process.exit(1);
}

runSystematicTests(addressCount).catch(console.error);
