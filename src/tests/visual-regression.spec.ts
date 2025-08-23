import { test, expect } from "@playwright/test";
import TestHelpers from "./utils/test-helpers";
import testConfig from "./config/test.config";

test.describe("Visual Regression Tests", () => {
  test("should match login page layout", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for any animations to complete
    await page.waitForTimeout(1000);

    // Take screenshot using helper with config
    await TestHelpers.takeScreenshotWithConfig(page, "login-page.png");
  });

  test("should match contracts page layout (authenticated)", async ({
    page,
  }) => {
    // Skip if no credentials
    TestHelpers.skipIfNoCredentials(test);

    // Login using helper
    await TestHelpers.login(page);

    // Wait for stable UI
    await TestHelpers.waitForStableUI(page, 2000);

    // Take screenshot using helper with config
    await TestHelpers.takeScreenshotWithConfig(page, "contracts-page.png", {
      threshold: 0.15, // Allow 15% pixel difference (contracts may have dynamic content)
      maxDiffPixels: 5000, // Allow more different pixels for dynamic content
    });
  });

  test("should match property search form layout", async ({ page }) => {
    // Skip if no credentials
    TestHelpers.skipIfNoCredentials(test);

    // Login and navigate to property search using helpers
    await TestHelpers.login(page);
    await TestHelpers.navigateToPropertySearch(page);

    // Wait for stable UI
    await TestHelpers.waitForStableUI(page, 1000);

    // Take screenshot using helper with config
    await TestHelpers.takeScreenshotWithConfig(
      page,
      "property-search-form.png",
    );
  });

  test("should match mobile login layout", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for mobile layout to adjust
    await page.waitForTimeout(1000);

    // Take screenshot using helper with config
    await TestHelpers.takeScreenshotWithConfig(page, "mobile-login-page.png");
  });

  test("should match tablet login layout", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for tablet layout to adjust
    await page.waitForTimeout(1000);

    // Take screenshot using helper with config
    await TestHelpers.takeScreenshotWithConfig(page, "tablet-login-page.png");
  });
});
