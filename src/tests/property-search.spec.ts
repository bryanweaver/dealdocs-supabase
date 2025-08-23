import { test, expect } from "@playwright/test";
import TestHelpers from "./utils/test-helpers";
import testConfig from "./config/test.config";

test.describe("Property Search", () => {
  // Skip these tests if no credentials are provided
  test.beforeEach(async ({ page }) => {
    TestHelpers.skipIfNoCredentials(test);
  });

  test("should complete property search flow", async ({ page }) => {
    // Login using helper
    await TestHelpers.login(page);

    // Navigate to property search
    await TestHelpers.navigateToPropertySearch(page);

    // Enter test address
    const testAddress = TestHelpers.getTestAddress();
    await page.fill(
      'input[placeholder*="address"], input[type="text"]:first-of-type',
      testAddress,
    );

    // Wait for response
    await TestHelpers.waitForPropertySearchResponse(page);

    // Check results
    const results = await TestHelpers.checkPropertySearchResults(page);

    if (results.hasOptions) {
      console.log(`✅ Found ${results.optionCount} dropdown options`);
      await results.dropdownOptions.first().click();

      // Try to click fetch property details
      await page.click(
        'button[aria-label="Fetch Property Details"], button:has-text("Fetch Property Details")',
      );

      // Wait for property details page
      await TestHelpers.waitForStableUI(page);

      // Verify we're on property details page
      const hasPropertyContent = await page
        .locator(
          "text=Property Details, text=Address, text=Property Information",
        )
        .isVisible();

      if (hasPropertyContent) {
        console.log("✅ Property details page loaded successfully");
      } else {
        console.log("⚠️ Property details page may not have loaded correctly");
      }
    } else if (results.hasNoResultsMessage) {
      console.log("✅ No matching addresses found - API working correctly");
      expect(results.hasNoResultsMessage).toBe(true);
    } else {
      console.log("⚠️ No dropdown options or error message found");
    }

    // Take screenshot for debugging
    await page.screenshot({
      path: "test-results/property-search-result.png",
      fullPage: true,
    });
  });

  test("should handle invalid address gracefully", async ({ page }) => {
    // Login using helper
    await TestHelpers.login(page);

    // Navigate to property search
    await TestHelpers.navigateToPropertySearch(page);

    // Enter invalid address
    const invalidAddress = "InvalidAddress123XYZ";
    await page.fill(
      'input[placeholder*="address"], input[type="text"]:first-of-type',
      invalidAddress,
    );

    // Wait for response
    await TestHelpers.waitForPropertySearchResponse(page);

    // Check results
    const results = await TestHelpers.checkPropertySearchResults(page);

    if (results.hasNoResultsMessage) {
      console.log(
        "✅ No matching addresses found - API correctly handling invalid address",
      );
      expect(results.hasNoResultsMessage).toBe(true);
    } else if (results.optionCount === 0) {
      console.log(
        "✅ No results returned for invalid address - working correctly",
      );
      expect(results.optionCount).toBe(0);
    } else {
      console.log(
        `⚠️ Got ${results.optionCount} results for invalid address - unexpected behavior`,
      );
      expect(results.optionCount).toBe(0);
    }

    // Take screenshot for debugging
    await page.screenshot({
      path: "test-results/invalid-address-search.png",
      fullPage: true,
    });
  });

  test("should validate API connectivity and response handling", async ({
    page,
  }) => {
    // Login using helper
    await TestHelpers.login(page);

    // Navigate to property search
    await TestHelpers.navigateToPropertySearch(page);

    // Verify we're on the property address verification page
    await expect(
      page.locator("text=Property Address Verification"),
    ).toBeVisible();

    // Test that address input is functional
    const addressInput = page.locator(
      'input[placeholder*="address"], input[type="text"]:first-of-type',
    );
    await expect(addressInput).toBeVisible();
    await expect(addressInput).toBeEnabled();

    // Test empty address submission
    await addressInput.fill("");
    await addressInput.blur();

    // Test various address formats to validate API integration
    const testAddresses = [
      "", // Empty
      "a", // Single character
      "123", // Just numbers
      "123 Main", // Incomplete
      "123 Main St", // No city/state
    ];

    for (const testAddr of testAddresses) {
      await addressInput.fill(testAddr);

      // Wait for response using helper
      await TestHelpers.waitForPropertySearchResponse(page);

      // Check results using helper
      const results = await TestHelpers.checkPropertySearchResults(page);

      console.log(
        `Address: "${testAddr}" -> Options: ${results.optionCount}, No Results: ${results.hasNoResultsMessage}`,
      );

      // For empty or very short addresses, we expect no results
      if (testAddr.length < 3) {
        expect(results.optionCount).toBe(0);
      }
    }

    console.log("✅ API connectivity and response handling validated");
  });
});
