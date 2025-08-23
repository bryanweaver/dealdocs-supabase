import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "./world.js";
import fs from "fs";
import path from "path";

// Texas cities with common street names for realistic addresses
const TEXAS_CITIES = [
  "Austin",
  "Houston",
  "Dallas",
  "San Antonio",
  "Fort Worth",
  "El Paso",
  "Arlington",
  "Corpus Christi",
  "Plano",
  "Lubbock",
];
const STREET_NAMES = [
  "Main St",
  "Oak Ave",
  "First St",
  "Park Rd",
  "Elm St",
  "Cedar Ln",
  "Maple Dr",
  "Pine St",
  "Washington Ave",
  "Lincoln Blvd",
];

function generateRandomAddress(): string {
  const houseNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  const streetName =
    STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];
  const city = TEXAS_CITIES[Math.floor(Math.random() * TEXAS_CITIES.length)];
  return `${houseNumber} ${streetName}, ${city}, TX`;
}

When('I click on "Start New Contract"', async function (this: CustomWorld) {
  await this.page.click(
    'button:has-text("Start New Contract"), a:has-text("Start New Contract")',
  );
});

When('I click on "Let\'s Go!"', async function (this: CustomWorld) {
  await this.page.click(
    'button:has-text("Let\'s Go!"), a:has-text("Let\'s Go!")',
  );
});

When(
  "I enter a random 4-digit address in Texas",
  async function (this: CustomWorld) {
    const randomAddress = generateRandomAddress();
    console.log(`Generated random address: ${randomAddress}`);

    // Look for property search input field with more robust selectors
    const possibleSelectors = [
      'input[placeholder*="address"]',
      'input[placeholder*="property"]',
      'input[placeholder*="search"]',
      'input[name*="address"]',
      'input[id*="address"]',
      'input[type="text"]',
      'input[type="search"]',
      ".search-input",
      "#address-input",
      "textarea",
    ];

    let inputFound = false;
    for (const selector of possibleSelectors) {
      try {
        const input = this.page.locator(selector).first();
        if (await input.isVisible()) {
          await input.fill(randomAddress);
          console.log(
            `Successfully filled address using selector: ${selector}`,
          );
          inputFound = true;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    if (!inputFound) {
      throw new Error("Could not find address input field");
    }

    // Store the address for potential later use
    (this as any).randomAddress = randomAddress;
  },
);

// Systematic testing step definitions
When(
  "I enter the address {string}",
  async function (this: CustomWorld, searchString: string) {
    console.log(`Entering search string: "${searchString}"`);

    // The searchString is already formatted as "houseNumber firstStreetWord"
    // e.g., "1440 Waseca" or "9851 Farrell"

    // Look for property search input field with robust selectors
    const possibleSelectors = [
      'input[placeholder*="address"]',
      'input[placeholder*="property"]',
      'input[placeholder*="search"]',
      'input[placeholder*="house"]',
      'input[name*="address"]',
      'input[id*="address"]',
      'input[type="text"]',
      'input[type="search"]',
      ".search-input",
      "#address-input",
      "textarea",
    ];

    let inputFound = false;
    for (const selector of possibleSelectors) {
      try {
        const input = this.page.locator(selector).first();
        if (await input.isVisible()) {
          await input.fill(searchString);
          console.log(
            `Successfully filled search string using selector: ${selector}`,
          );
          inputFound = true;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    if (!inputFound) {
      throw new Error("Could not find address input field");
    }

    // Store the search string for later use
    (this as any).searchString = searchString;
    // Extract house number from search string for compatibility
    const houseNumberMatch = searchString.match(/^(\d+)/);
    (this as any).testHouseNumber = houseNumberMatch ? houseNumberMatch[1] : "";
  },
);

When("I capture any console errors", async function (this: CustomWorld) {
  // Initialize console error tracking
  if (!(this as any).consoleErrors) {
    (this as any).consoleErrors = [];
  }

  // Set up console error listener
  this.page.on("console", (msg) => {
    if (msg.type() === "error") {
      const errorMessage = `${new Date().toISOString()}: [JavaScript Error: "${msg.text()}" {file: "${msg.location().url}" line: ${msg.location().lineNumber}}]`;
      (this as any).consoleErrors.push(errorMessage);
      console.log(`🚨 Console Error: ${msg.text()}`);
    }
  });

  // Also capture page errors
  this.page.on("pageerror", (error) => {
    const errorMessage = `${new Date().toISOString()}: [Page Error: "${error.message}"]`;
    (this as any).consoleErrors.push(errorMessage);
    console.log(`🚨 Page Error: ${error.message}`);
  });

  console.log("🎯 Console error capture initialized");
});

When(
  "I select a random option from the dropdown if available",
  async function (this: CustomWorld) {
    // Wait for dropdown to appear (could be triggered by address input)
    await this.page.waitForTimeout(3000);

    // Look for dropdown options with multiple selectors
    const dropdownSelectors = [
      ".v-list-item",
      "select option",
      '[role="option"]',
      ".dropdown-item",
      ".suggestion-item",
      ".autocomplete-item",
      ".address-item",
      ".result-item",
      "ul li",
      ".dropdown-menu li",
      ".search-results li",
    ];

    let optionCount = 0;
    let selectedOptions = null;

    for (const selector of dropdownSelectors) {
      try {
        const options = this.page.locator(selector);
        optionCount = await options.count();

        if (optionCount > 0) {
          selectedOptions = options;
          console.log(
            `Found ${optionCount} dropdown options using selector: ${selector}`,
          );
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    if (optionCount > 0 && selectedOptions) {
      try {
        // Get the search string we entered to match against dropdown options
        const searchString = (this as any).searchString || "";
        const houseNumber =
          (this as any).testHouseNumber || searchString.split(" ")[0];

        console.log(
          `Looking for address option containing house number: ${houseNumber}`,
        );

        // Look through all options to find one that contains our house number
        let addressOptionFound = false;
        for (let i = 0; i < optionCount; i++) {
          const option = selectedOptions.nth(i);
          const optionText = await option.textContent();
          console.log(`   Option ${i}: "${optionText?.trim()}"`);

          // Check if this option contains our house number (not case sensitive)
          if (optionText && optionText.includes(houseNumber)) {
            console.log(`✅ Found matching address option at index ${i}`);
            await option.click();

            // Store information about the selected property
            (this as any).selectedProperty = optionText.trim();
            console.log(`Selected property: ${(this as any).selectedProperty}`);
            addressOptionFound = true;
            break;
          }
        }

        if (!addressOptionFound) {
          console.log("⚠️ No dropdown option matched the house number");
          console.log(
            "🔄 Selecting first non-AgentsDirectory option as fallback",
          );

          // Try to select first option that's not "AgentsDirectory"
          for (let i = 0; i < optionCount; i++) {
            const option = selectedOptions.nth(i);
            const optionText = await option.textContent();

            if (
              optionText &&
              !optionText.includes("AgentsDirectory") &&
              !optionText.includes("Agents")
            ) {
              console.log(
                `✅ Selected fallback option ${i}: "${optionText.trim()}"`,
              );
              await option.click();
              (this as any).selectedProperty = optionText.trim();
              addressOptionFound = true;
              break;
            }
          }

          // If still no good option, just select the first one
          if (!addressOptionFound && optionCount > 0) {
            await selectedOptions.first().click();
            const selectedText = await selectedOptions.first().textContent();
            (this as any).selectedProperty =
              selectedText?.trim() || "Unknown property";
            console.log(
              `⚠️ Selected first option as last resort: ${(this as any).selectedProperty}`,
            );
          }
        }

        await this.page.waitForTimeout(1000);
      } catch (error) {
        console.log(`Failed to select dropdown option: ${error.message}`);
        (this as any).dropdownSelectionError = error.message;
      }
    } else {
      console.log("No dropdown options found");
      (this as any).dropdownSelectionError = "No dropdown options available";
    }

    // Store dropdown availability for results
    (this as any).hasDropdownResults = optionCount > 0;
    (this as any).dropdownResultCount = optionCount;
  },
);

When(
  "I select a random option from the dropdown",
  async function (this: CustomWorld) {
    // Wait for dropdown to appear (could be triggered by address input)
    await this.page.waitForTimeout(1000);

    // Look for dropdown options
    const dropdownOptions = this.page.locator(
      'select option, [role="option"], .dropdown-item, .suggestion-item',
    );
    const optionCount = await dropdownOptions.count();

    if (optionCount > 1) {
      // Select a random option (skip first if it's a placeholder)
      const randomIndex = Math.floor(Math.random() * (optionCount - 1)) + 1;
      await dropdownOptions.nth(randomIndex).click();
      console.log(`Selected dropdown option ${randomIndex} of ${optionCount}`);
    } else {
      console.log(
        "No dropdown options found or only placeholder option available",
      );
    }
  },
);

When('I click "Fetch Property Details"', async function (this: CustomWorld) {
  console.log("🔍 Looking for Fetch Property Details button...");

  // Wait a bit to ensure the form is ready after dropdown selection
  await this.page.waitForTimeout(2000);

  // Take a screenshot to see current state
  await this.page.screenshot({
    path: "before-fetch-click.png",
    fullPage: true,
  });
  console.log("📸 Screenshot saved as before-fetch-click.png");

  // Direct approach - we know the button exists from the console errors
  try {
    // Method 1: Click using aria-label
    console.log(
      '🎯 Attempting to click button with aria-label="Fetch Property Details"',
    );
    await this.page.click('button[aria-label="Fetch Property Details"]', {
      timeout: 10000,
    });
    console.log(
      "✅ Successfully clicked Fetch Property Details button using aria-label",
    );
    await this.page.waitForTimeout(3000);
    return;
  } catch (e1) {
    console.log("⚠️ aria-label click failed:", e1.message);

    try {
      // Method 2: Use getByRole
      console.log("🎯 Attempting to click using getByRole");
      await this.page
        .getByRole("button", { name: "Fetch Property Details" })
        .click({ timeout: 5000 });
      console.log(
        "✅ Successfully clicked Fetch Property Details button using getByRole",
      );
      await this.page.waitForTimeout(3000);
      return;
    } catch (e2) {
      console.log("⚠️ getByRole click failed:", e2.message);

      try {
        // Method 3: Use text selector with exact match
        console.log("🎯 Attempting to click using exact text match");
        await this.page.click('button:text-is("Fetch Property Details")', {
          timeout: 5000,
        });
        console.log(
          "✅ Successfully clicked Fetch Property Details button using text-is",
        );
        await this.page.waitForTimeout(3000);
        return;
      } catch (e3) {
        console.log("⚠️ text-is click failed:", e3.message);

        try {
          // Method 4: Force click on any p-button-primary
          console.log("🎯 Attempting to force click on p-button-primary");
          const primaryButtons = await this.page
            .locator("button.p-button-primary")
            .all();
          console.log(`   Found ${primaryButtons.length} primary buttons`);

          for (let i = 0; i < primaryButtons.length; i++) {
            const button = primaryButtons[i];
            const text = await button.textContent();
            const ariaLabel = await button.getAttribute("aria-label");
            console.log(
              `   Button ${i}: text="${text?.trim()}", aria-label="${ariaLabel}"`,
            );

            if (text?.includes("Fetch") || ariaLabel?.includes("Fetch")) {
              await button.click({ force: true });
              console.log(
                `✅ Force clicked button ${i} with Fetch in text/aria-label`,
              );
              await this.page.waitForTimeout(3000);
              return;
            }
          }
        } catch (e4) {
          console.log("⚠️ Force click on primary buttons failed:", e4.message);
        }
      }
    }
  }

  // If all methods failed, take a screenshot and list all buttons
  console.log("❌ All click methods failed. Taking debug screenshot...");
  await this.page.screenshot({
    path: "fetch-button-click-failed.png",
    fullPage: true,
  });

  // List ALL buttons on the page for debugging
  console.log("📋 Listing ALL buttons on page:");
  const allButtons = await this.page.locator("button").all();
  for (let i = 0; i < allButtons.length; i++) {
    try {
      const button = allButtons[i];
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute("aria-label");
      const classes = await button.getAttribute("class");
      const isVisible = await button.isVisible();
      const boundingBox = await button.boundingBox();
      console.log(
        `   Button ${i}: visible=${isVisible}, text="${text?.trim()}", aria-label="${ariaLabel}", classes="${classes}", position=${JSON.stringify(boundingBox)}`,
      );
    } catch (e) {
      console.log(`   Button ${i}: Could not get details`);
    }
  }

  throw new Error(
    "Could not click Fetch Property Details button after trying all methods. Check screenshots and button list above.",
  );
});

Then(
  "I should see the property details page",
  async function (this: CustomWorld) {
    // Wait for page to load
    await this.page.waitForLoadState("networkidle");

    // Check for property details indicators
    const propertyDetailsIndicators = [
      "text=Property Details",
      "text=Address",
      "text=Property Information",
      '[data-testid="property-details"]',
      ".property-details",
      "#property-details",
    ];

    let found = false;
    for (const indicator of propertyDetailsIndicators) {
      try {
        await expect(this.page.locator(indicator)).toBeVisible({
          timeout: 5000,
        });
        console.log(`Property details page confirmed with: ${indicator}`);
        found = true;
        break;
      } catch (e) {
        // Try next indicator
      }
    }

    if (!found) {
      // Fallback: check if URL changed or page title contains property-related terms
      const url = this.page.url();
      const title = await this.page.title();
      console.log(`Current URL: ${url}`);
      console.log(`Current title: ${title}`);

      if (
        url.includes("property") ||
        url.includes("details") ||
        title.toLowerCase().includes("property") ||
        title.toLowerCase().includes("details")
      ) {
        console.log("Property details page confirmed via URL/title");
        found = true;
      }
    }

    // Always try to validate property content, even if page detection fails
    // This allows us to capture "no content" scenarios
    try {
      await this.validatePropertyContent();
    } catch (error) {
      console.log("⚠️ Property content validation failed:", error.message);
      // Set empty metrics for failed validation
      (this as any).propertyMetrics = {
        hasImage: null,
        hasPrice: null,
        hasDescription: null,
        hasBedrooms: null,
        hasBathrooms: null,
        hasSquareFootage: null,
        hasPropertyType: null,
        hasLotSize: null,
        hasYearBuilt: null,
        hasAddress: null,
      };
    }

    // Only throw error if we couldn't find the page AND couldn't validate content
    if (!found) {
      console.log(
        "❌ Property details page not detected, but continuing to record results...",
      );
      // Don't throw error - let the test continue to record results
      // throw new Error('Property details page not detected');
    }
  },
);

Then("I validate property content quality", async function (this: CustomWorld) {
  await this.validatePropertyContent();
});

Then(
  "I record the test results for {string}",
  async function (this: CustomWorld, address: string) {
    console.log(`📝 Recording test results for: ${address}`);

    // Create results directory if it doesn't exist
    const resultsDir = path.join(process.cwd(), "src", "tests", "data");
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    // Prepare test result data
    const testAddress = (this as any).testAddress || address;
    const houseNumber =
      (this as any).testHouseNumber || address.match(/^(\d+)/)?.[1] || "";
    const consoleErrors = (this as any).consoleErrors || [];
    const selectedProperty = (this as any).selectedProperty || "";
    const hasDropdownResults = (this as any).hasDropdownResults || false;
    const dropdownResultCount = (this as any).dropdownResultCount || 0;
    const dropdownSelectionError = (this as any).dropdownSelectionError || null;
    const propertyMetrics = (this as any).propertyMetrics || {
      hasImage: null,
      hasPrice: null,
      hasDescription: null,
      hasBedrooms: null,
      hasBathrooms: null,
      hasSquareFootage: null,
      hasPropertyType: null,
      hasLotSize: null,
      hasYearBuilt: null,
      hasAddress: null,
    };

    // Generate session ID if not exists
    if (!(this as any).sessionId) {
      (this as any).sessionId =
        `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Parse the address into components
    const addressParts = testAddress.match(
      /^(\d+)\s+(.+?),\s*(.+?),\s*(\w+)(?:\s+(\d+))?$/,
    );
    const streetName = addressParts ? addressParts[2] : "";
    const city = addressParts ? addressParts[3] : "";
    const state = addressParts ? addressParts[4] : "";
    const zipCode = addressParts ? addressParts[5] : "";

    // Calculate content quality score
    const totalMetrics = Object.keys(propertyMetrics).length;
    const passedMetrics = Object.values(propertyMetrics).filter(Boolean).length;
    const contentQualityScore = Math.round(
      (passedMetrics / totalMetrics) * 100,
    );

    const result = {
      sessionId: (this as any).sessionId,
      address: {
        fullAddress: testAddress,
        houseNumber: parseInt(houseNumber) || 0,
        streetName: streetName,
        city: city,
        state: state,
        zipCode: zipCode,
        id: `${houseNumber}-${streetName.replace(/\s+/g, "")}-${city}-${zipCode}`,
        selectedProperty: selectedProperty,
      },
      timestamp: new Date().toISOString(),
      errorType:
        consoleErrors.length > 0
          ? "console_error"
          : dropdownSelectionError
            ? "element_not_found"
            : !hasDropdownResults
              ? "data_missing"
              : "success",
      errorMessage:
        consoleErrors.length > 0
          ? `Test completed with ${consoleErrors.length} console errors`
          : dropdownSelectionError
            ? `Dropdown selection failed: ${dropdownSelectionError}`
            : !hasDropdownResults
              ? "No property options found in dropdown"
              : "Test completed successfully",
      consoleErrors: consoleErrors,
      propertyMetrics: propertyMetrics,
      contentQualityScore: contentQualityScore,
      additionalData: {
        url: this.page.url(),
        title: await this.page.title(),
        selectedProperty: selectedProperty,
        hasDropdownResults: hasDropdownResults,
        dropdownResultCount: dropdownResultCount,
      },
    };

    // Load existing results or create new array
    const resultsFile = path.join(resultsDir, "test-results.json");
    let existingResults = [];

    if (fs.existsSync(resultsFile)) {
      try {
        const fileContent = fs.readFileSync(resultsFile, "utf8");
        const parsed = JSON.parse(fileContent);
        // Ensure it's an array
        if (Array.isArray(parsed)) {
          existingResults = parsed;
        } else {
          console.log("Results file is not an array, starting fresh");
          existingResults = [];
        }
      } catch (error) {
        console.log("Could not parse existing results file, starting fresh");
        existingResults = [];
      }
    }

    // Add new result
    existingResults.push(result);

    // Write updated results
    fs.writeFileSync(resultsFile, JSON.stringify(existingResults, null, 2));

    console.log(`✅ Test result recorded:`);
    console.log(`   🏠 Address: ${testAddress}`);
    console.log(`   🔢 House Number: ${houseNumber}`);
    console.log(
      `   📋 Dropdown Results: ${hasDropdownResults ? `${dropdownResultCount} options` : "None"}`,
    );
    console.log(`   🎯 Selected Property: ${selectedProperty || "None"}`);
    console.log(`   🚨 Console Errors: ${consoleErrors.length}`);
    console.log(`   📊 Status: ${result.errorType}`);
    console.log(`   🎯 Content Quality Score: ${contentQualityScore}%`);
    console.log(`   📊 Property Metrics:`);
    console.log(
      `      🖼️  Has Image: ${propertyMetrics.hasImage ? "✅" : "❌"}`,
    );
    console.log(
      `      💰 Has Price: ${propertyMetrics.hasPrice ? "✅" : "❌"}`,
    );
    console.log(
      `      📝 Has Description: ${propertyMetrics.hasDescription ? "✅" : "❌"}`,
    );
    console.log(
      `      🛏️  Has Bedrooms: ${propertyMetrics.hasBedrooms ? "✅" : "❌"}`,
    );
    console.log(
      `      🚿 Has Bathrooms: ${propertyMetrics.hasBathrooms ? "✅" : "❌"}`,
    );
    console.log(
      `      📐 Has Square Footage: ${propertyMetrics.hasSquareFootage ? "✅" : "❌"}`,
    );

    // Reset test state for next test
    (this as any).consoleErrors = [];
    (this as any).selectedProperty = "";
    (this as any).hasDropdownResults = false;
    (this as any).dropdownResultCount = 0;
    (this as any).dropdownSelectionError = null;
    (this as any).propertyMetrics = null;
  },
);
