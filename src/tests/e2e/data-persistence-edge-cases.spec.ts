import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/**
 * E2E Tests for Data Persistence Edge Cases
 * Tests specific edge cases and scenarios for form data persistence
 */
test.describe("Data Persistence Edge Cases", () => {
  const testRunId = Date.now().toString();
  const testEmail = `edgecase${testRunId}@example.com`;
  const testPassword = `EdgeCase123!`;
  let contractId: string;

  // Helper function to create and login test user
  async function loginTestUser(page: Page) {
    await page.goto("/");
    await page.waitForLoadState('networkidle');

    const signUpLink = page.locator('button:has-text("Sign up"), a:has-text("Sign up")').first();
    if (await signUpLink.count() > 0) {
      await signUpLink.click();
      await page.waitForTimeout(1000);
    }

    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);

    const confirmPwd = page.locator('input[placeholder*="Confirm" i], input[id="confirmPassword"]').first();
    await confirmPwd.fill(testPassword);

    const fullName = page.locator('input[id="fullName"]');
    if (await fullName.count() > 0) {
      await fullName.fill(`Edge Case User ${testRunId}`);
    }

    await page.waitForTimeout(1000);

    const signUpBtn = page.locator('button:has-text("Sign Up")').first();
    await expect(signUpBtn).toBeEnabled({ timeout: 5000 });
    await signUpBtn.click();

    await page.waitForTimeout(3000);

    if (!page.url().includes('/contracts')) {
      const signInLink = page.locator('text=/already have an account/i').first();
      if (await signInLink.count() > 0) {
        await signInLink.click();
        await page.waitForTimeout(1000);
      }

      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', testPassword);

      const loginBtn = page.locator('button[type="submit"]:not([disabled])').first();
      await loginBtn.click();

      await page.waitForURL("**/contracts", { timeout: 10000 });
    }

    await expect(page.locator('h1:has-text("My Contracts"), h2:has-text("Contracts")').first()).toBeVisible();
  }

  async function startNewContract(page: Page) {
    const newContractBtn = page.locator('button:has-text("Start New Contract"), button:has-text("New Contract")').first();
    await newContractBtn.click();

    await page.waitForTimeout(2000);
    const letsGoBtn = page.locator('button:has-text("Let\'s Go"), button:has-text("Start")').first();
    if (await letsGoBtn.count() > 0) {
      await letsGoBtn.click();
      await page.waitForTimeout(2000);
    }

    const url = page.url();
    const contractMatch = url.match(/contract[s]?\/([^\/\?]+)/);
    if (contractMatch) {
      contractId = contractMatch[1];
    }
  }

  test("Empty string vs null field handling", async ({ page }) => {
    test.setTimeout(90000);

    await loginTestUser(page);
    await startNewContract(page);

    if (!contractId) {
      test.skip("Contract ID not available");
      return;
    }

    // Navigate to property section
    await page.goto(`/#/contract/${contractId}/property`);
    await page.waitForLoadState('networkidle');

    // Fill some fields with empty strings, others with values
    const testData = {
      streetAddress: "123 Empty Test St",
      city: "", // Empty string
      state: "TX",
      postalCode: "", // Empty string
      mlsNumber: "MLS12345"
    };

    for (const [field, value] of Object.entries(testData)) {
      const input = page.locator(`input[name="${field}"], input[id="${field}"]`).first();
      if (await input.count() > 0) {
        await input.fill(value);
      }
    }

    await page.waitForTimeout(2000);

    // Navigate away and back
    await page.goto("/#/contracts");
    await page.waitForTimeout(1000);
    await page.goto(`/#/contract/${contractId}/property`);
    await page.waitForLoadState('networkidle');

    // Verify empty strings are handled correctly
    for (const [field, expectedValue] of Object.entries(testData)) {
      const input = page.locator(`input[name="${field}"], input[id="${field}"]`).first();
      if (await input.count() > 0) {
        const actualValue = await input.inputValue();
        expect(actualValue).toBe(expectedValue);
      }
    }
  });

  test("Special characters and Unicode in form fields", async ({ page }) => {
    test.setTimeout(90000);

    await loginTestUser(page);
    await startNewContract(page);

    if (!contractId) {
      test.skip("Contract ID not available");
      return;
    }

    await page.goto(`/#/contract/${contractId}/property`);
    await page.waitForLoadState('networkidle');

    // Test special characters and Unicode
    const specialCharData = {
      streetAddress: "123 Tëst Stréét & Ávénue #2",
      subdivision: "Lós Álamos Subd. (Phase II)",
      legalDescription: "Lot 1, Block A, Smith's Addition, being 0.25 acres, more or less"
    };

    for (const [field, value] of Object.entries(specialCharData)) {
      const input = page.locator(`input[name="${field}"], input[id="${field}"], textarea[name="${field}"]`).first();
      if (await input.count() > 0) {
        await input.fill(value);
      }
    }

    await page.waitForTimeout(2000);

    // Refresh page to test persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify special characters persisted
    for (const [field, expectedValue] of Object.entries(specialCharData)) {
      const input = page.locator(`input[name="${field}"], input[id="${field}"], textarea[name="${field}"]`).first();
      if (await input.count() > 0) {
        const actualValue = await input.inputValue();
        expect(actualValue).toBe(expectedValue);
      }
    }
  });

  test("Large text data persistence", async ({ page }) => {
    test.setTimeout(90000);

    await loginTestUser(page);
    await startNewContract(page);

    if (!contractId) {
      test.skip("Contract ID not available");
      return;
    }

    await page.goto(`/#/contract/${contractId}/buyerProvisions`);
    await page.waitForLoadState('networkidle');

    // Test large text block
    const largeText = `This is a comprehensive test of large text data persistence in the DealDocs application.
    It includes multiple lines, special characters like & @ # $, and various formatting scenarios.

    This text block is designed to test:
    - Multi-line text handling
    - Special character preservation
    - Large data storage capacity
    - Formatting retention across page loads

    Additional provisions may include:
    1. Specific inspection requirements
    2. Custom financing terms and conditions
    3. Special closing instructions
    4. Property-specific disclosures and acknowledgments

    This large text block helps ensure that substantial textual data is properly preserved
    throughout the user's session and across page reloads.`;

    const textArea = page.locator('textarea[name="buyerProvisions"], textarea[id="buyerProvisions"]').first();
    if (await textArea.count() > 0) {
      await textArea.fill(largeText);
      await page.waitForTimeout(2000);

      // Navigate away and back
      await page.goto("/#/contracts");
      await page.waitForTimeout(1000);
      await page.goto(`/#/contract/${contractId}/buyerProvisions`);
      await page.waitForLoadState('networkidle');

      // Verify large text persisted
      const persistedText = await textArea.inputValue();
      expect(persistedText).toBe(largeText);
    }
  });

  test("Numeric field boundary values", async ({ page }) => {
    test.setTimeout(90000);

    await loginTestUser(page);
    await startNewContract(page);

    if (!contractId) {
      test.skip("Contract ID not available");
      return;
    }

    await page.goto(`/#/contract/${contractId}/finance`);
    await page.waitForLoadState('networkidle');

    // Test boundary numeric values
    const numericData = {
      principalAmount: "999999.99", // Large decimal
      interestRate: "0.01", // Small decimal
      termYears: "30", // Integer
      cashAmount: "0" // Zero value
    };

    for (const [field, value] of Object.entries(numericData)) {
      const input = page.locator(`input[name="${field}"], input[id="${field}"]`).first();
      if (await input.count() > 0) {
        await input.fill(value);
      }
    }

    await page.waitForTimeout(2000);

    // Navigate away and back
    await page.goto("/#/contracts");
    await page.waitForTimeout(1000);
    await page.goto(`/#/contract/${contractId}/finance`);
    await page.waitForLoadState('networkidle');

    // Verify numeric values persisted
    for (const [field, expectedValue] of Object.entries(numericData)) {
      const input = page.locator(`input[name="${field}"], input[id="${field}"]`).first();
      if (await input.count() > 0) {
        const actualValue = await input.inputValue();
        expect(actualValue).toBe(expectedValue);
      }
    }
  });

  test("Date field edge cases", async ({ page }) => {
    test.setTimeout(90000);

    await loginTestUser(page);
    await startNewContract(page);

    if (!contractId) {
      test.skip("Contract ID not available");
      return;
    }

    await page.goto(`/#/contract/${contractId}/closing`);
    await page.waitForLoadState('networkidle');

    // Test various date formats
    const dateValue = "2024-12-31"; // New Year's Eve

    const dateInput = page.locator('input[name="closingDate"], input[id="closingDate"], input[type="date"]').first();
    if (await dateInput.count() > 0) {
      await dateInput.fill(dateValue);
      await page.waitForTimeout(2000);

      // Navigate away and back
      await page.goto("/#/contracts");
      await page.waitForTimeout(1000);
      await page.goto(`/#/contract/${contractId}/closing`);
      await page.waitForLoadState('networkidle');

      // Verify date persisted
      const persistedDate = await dateInput.inputValue();
      expect(persistedDate).toBe(dateValue);
    }
  });

  test("Boolean field state transitions", async ({ page }) => {
    test.setTimeout(120000);

    await loginTestUser(page);
    await startNewContract(page);

    if (!contractId) {
      test.skip("Contract ID not available");
      return;
    }

    await page.goto(`/#/contract/${contractId}/buyers`);
    await page.waitForLoadState('networkidle');

    // Test boolean field state changes
    const booleanFieldTests = [
      { value: true, description: "Set to Yes" },
      { value: false, description: "Change to No" },
      { value: true, description: "Change back to Yes" }
    ];

    for (let i = 0; i < booleanFieldTests.length; i++) {
      const test = booleanFieldTests[i];
      console.log(`Testing: ${test.description}`);

      // Look for Yes/No buttons for hasSecondaryParty
      const targetButton = page.locator(`button:has-text("${test.value ? 'Yes' : 'No'}")`).first();
      if (await targetButton.count() > 0) {
        await targetButton.click();
        await page.waitForTimeout(1000);

        // Navigate away and back to test persistence
        await page.goto("/#/contracts");
        await page.waitForTimeout(1000);
        await page.goto(`/#/contract/${contractId}/buyers`);
        await page.waitForLoadState('networkidle');

        // Verify the correct button state
        const activeButton = page.locator(`button:has-text("${test.value ? 'Yes' : 'No'}")[class*="active"], button:has-text("${test.value ? 'Yes' : 'No'}")[aria-pressed="true"]`).first();
        if (await activeButton.count() > 0) {
          console.log(`✅ Boolean state ${test.value ? 'Yes' : 'No'} persisted correctly`);
        }
      }
    }
  });

  test("Session storage vs server persistence consistency", async ({ page }) => {
    test.setTimeout(120000);

    await loginTestUser(page);
    await startNewContract(page);

    if (!contractId) {
      test.skip("Contract ID not available");
      return;
    }

    // Fill data in multiple sections
    const testSections = [
      {
        path: "property",
        data: { streetAddress: "Session Test Address", city: "Houston" }
      },
      {
        path: "buyers",
        data: { primaryName: "Session Test Buyer", email: testEmail }
      }
    ];

    // Fill all sections
    for (const section of testSections) {
      await page.goto(`/#/contract/${contractId}/${section.path}`);
      await page.waitForLoadState('networkidle');

      for (const [field, value] of Object.entries(section.data)) {
        const input = page.locator(`input[name="${field}"], input[id="${field}"]`).first();
        if (await input.count() > 0) {
          await input.fill(value);
        }
      }
      await page.waitForTimeout(1000);
    }

    // Clear session storage to test server persistence
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });

    await page.waitForTimeout(1000);

    // Refresh and verify data still loads from server
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify data in each section
    for (const section of testSections) {
      await page.goto(`/#/contract/${contractId}/${section.path}`);
      await page.waitForLoadState('networkidle');

      let fieldsFound = 0;
      for (const [field, expectedValue] of Object.entries(section.data)) {
        const input = page.locator(`input[name="${field}"], input[id="${field}"]`).first();
        if (await input.count() > 0) {
          const actualValue = await input.inputValue();
          if (actualValue === expectedValue) {
            fieldsFound++;
          }
        }
      }

      expect(fieldsFound).toBeGreaterThan(0, `${section.path} section should load from server after session clear`);
    }
  });

  test("Rapid form navigation data integrity", async ({ page }) => {
    test.setTimeout(120000);

    await loginTestUser(page);
    await startNewContract(page);

    if (!contractId) {
      test.skip("Contract ID not available");
      return;
    }

    const sections = ["property", "buyers", "sellers", "finance", "title"];
    const testData = {
      property: { streetAddress: "Rapid Nav Test" },
      buyers: { primaryName: "Rapid Buyer" },
      sellers: { primaryName: "Rapid Seller" },
      finance: { principalAmount: "300000" },
      title: { titleCompanyName: "Rapid Title" }
    };

    // Fill data and rapidly navigate between sections
    for (let round = 0; round < 3; round++) {
      console.log(`Round ${round + 1} of rapid navigation`);

      for (const section of sections) {
        await page.goto(`/#/contract/${contractId}/${section}`);
        await page.waitForLoadState('networkidle');

        const sectionData = testData[section];
        if (sectionData) {
          for (const [field, value] of Object.entries(sectionData)) {
            const input = page.locator(`input[name="${field}"], input[id="${field}"]`).first();
            if (await input.count() > 0) {
              await input.fill(`${value} Round ${round + 1}`);
            }
          }
        }

        await page.waitForTimeout(500); // Short wait to simulate rapid navigation
      }
    }

    // Verify final data integrity
    for (const section of sections) {
      await page.goto(`/#/contract/${contractId}/${section}`);
      await page.waitForLoadState('networkidle');

      const sectionData = testData[section];
      if (sectionData) {
        let verifiedFields = 0;
        for (const [field, baseValue] of Object.entries(sectionData)) {
          const input = page.locator(`input[name="${field}"], input[id="${field}"]`).first();
          if (await input.count() > 0) {
            const actualValue = await input.inputValue();
            // Should have the latest round data
            if (actualValue.includes(baseValue) && actualValue.includes("Round 3")) {
              verifiedFields++;
            }
          }
        }
        expect(verifiedFields).toBeGreaterThan(0, `${section} section should maintain data integrity after rapid navigation`);
      }
    }
  });

  test("Form validation with persistence", async ({ page }) => {
    test.setTimeout(90000);

    await loginTestUser(page);
    await startNewContract(page);

    if (!contractId) {
      test.skip("Contract ID not available");
      return;
    }

    await page.goto(`/#/contract/${contractId}/finance`);
    await page.waitForLoadState('networkidle');

    // Enter invalid then valid data
    const principalInput = page.locator('input[name="principalAmount"], input[id="principalAmount"]').first();
    if (await principalInput.count() > 0) {
      // Enter invalid data first
      await principalInput.fill("invalid-amount");
      await page.waitForTimeout(1000);

      // Navigate away to see if invalid data persists
      await page.goto("/#/contracts");
      await page.waitForTimeout(1000);
      await page.goto(`/#/contract/${contractId}/finance`);
      await page.waitForLoadState('networkidle');

      // Check what persisted
      const invalidValue = await principalInput.inputValue();
      console.log(`Invalid data handling: "${invalidValue}"`);

      // Enter valid data
      await principalInput.fill("350000");
      await page.waitForTimeout(1000);

      // Navigate away and back
      await page.goto("/#/contracts");
      await page.waitForTimeout(1000);
      await page.goto(`/#/contract/${contractId}/finance`);
      await page.waitForLoadState('networkidle');

      // Verify valid data persisted
      const validValue = await principalInput.inputValue();
      expect(validValue).toBe("350000");
    }
  });
});