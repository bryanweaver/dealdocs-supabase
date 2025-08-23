/**
 * Test helper utilities
 */
import { Page, expect } from "@playwright/test";
import testConfig from "../config/test.config";

export class TestHelpers {
  static async login(page: Page, username?: string, password?: string) {
    const user = username || testConfig.testUser;
    const pass = password || testConfig.testPassword;

    if (!user || !pass) {
      throw new Error("Test credentials not provided");
    }

    await page.goto("/");
    await page.fill('input[type="email"], input[name="username"]', user);
    await page.fill('input[type="password"], input[name="password"]', pass);
    await page.click('button:has-text("Log in"), button:has-text("Sign In")');

    // Wait for successful login
    await page.waitForURL("**/contracts", {
      timeout: testConfig.navigationTimeout,
    });
  }

  static async navigateToPropertySearch(page: Page) {
    // Ensure we're on contracts page
    await page.waitForURL("**/contracts", {
      timeout: testConfig.navigationTimeout,
    });

    // Start new contract
    await page.click(
      'button:has-text("Start New Contract"), a:has-text("Start New Contract")',
    );
    await page.click('button:has-text("Let\'s Go!"), a:has-text("Let\'s Go!")');

    // Wait for property search form
    await page.waitForSelector(
      'input[placeholder*="address"], input[type="text"]',
      {
        timeout: testConfig.defaultTimeout,
      },
    );
  }

  static async waitForPropertySearchResponse(page: Page) {
    // Wait for either dropdown options or error message
    await Promise.race([
      page
        .waitForSelector('.v-list-item, select option, [role="option"]', {
          timeout: testConfig.apiTimeout,
        })
        .catch(() => null),
      page
        .waitForSelector("text=No matching addresses found", {
          timeout: testConfig.apiTimeout,
        })
        .catch(() => null),
      page.waitForTimeout(testConfig.apiTimeout),
    ]);
  }

  static async checkPropertySearchResults(page: Page) {
    const dropdownOptions = page.locator(
      '.v-list-item, select option, [role="option"]',
    );
    const optionCount = await dropdownOptions.count();

    const noResultsMessage = page.locator("text=No matching addresses found");
    const hasNoResultsMessage = await noResultsMessage.isVisible();

    return {
      hasOptions: optionCount > 0,
      optionCount,
      hasNoResultsMessage,
      dropdownOptions,
    };
  }

  static async takeScreenshotWithConfig(
    page: Page,
    name: string,
    options: {
      threshold?: number;
      maxDiffPixels?: number;
    } = {},
  ) {
    const screenshotOptions = {
      threshold: options.threshold || testConfig.visualThreshold,
      maxDiffPixels: options.maxDiffPixels || testConfig.maxDiffPixels,
    };

    await expect(page).toHaveScreenshot(name, screenshotOptions);
  }

  static async waitForStableUI(page: Page, timeout: number = 1000) {
    // Wait for network idle and any animations
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(timeout);
  }

  static getTestAddress(index: number = 0): string {
    if (
      testConfig.useRealAddresses &&
      testConfig.fallbackAddresses.length > 0
    ) {
      return testConfig.fallbackAddresses[
        index % testConfig.fallbackAddresses.length
      ];
    }
    return "1234 Main St, Austin, TX"; // Default test address
  }

  static async checkAuthRequiredElements(page: Page) {
    // Check for common authentication indicators
    const authIndicators = [
      'input[type="email"], input[name="username"]',
      'input[type="password"], input[name="password"]',
      'button:has-text("Log in"), button:has-text("Sign In")',
    ];

    for (const selector of authIndicators) {
      await expect(page.locator(selector)).toBeVisible();
    }
  }

  static async skipIfNoCredentials(testInstance: any) {
    if (!testConfig.testUser || !testConfig.testPassword) {
      testInstance.skip(true, "No test credentials provided");
    }
  }
}

export default TestHelpers;
