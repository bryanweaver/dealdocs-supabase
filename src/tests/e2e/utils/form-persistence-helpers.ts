import type { Page, expect } from "@playwright/test";

/**
 * Shared utilities for form data persistence tests
 */

export interface TestUser {
  email: string;
  password: string;
  runId: string;
}

export interface FormSection {
  data: Record<string, any>;
  name: string;
  path: string;
}

/**
 * Create and login a test user
 */
export async function createAndLoginTestUser(page: Page, testUser: TestUser): Promise<void> {
  await page.goto("/");
  await page.waitForLoadState('networkidle');

  // Navigate to sign up
  const signUpLink = page.locator('button:has-text("Sign up"), a:has-text("Sign up")').first();
  if (await signUpLink.count() > 0) {
    await signUpLink.click();
    await page.waitForTimeout(1000);
  }

  // Fill sign up form
  await page.fill('input[type="email"]', testUser.email);
  await page.fill('input[type="password"]', testUser.password);

  const confirmPwd = page.locator('input[placeholder*="Confirm" i], input[id="confirmPassword"]').first();
  await confirmPwd.fill(testUser.password);

  const fullName = page.locator('input[id="fullName"]');
  if (await fullName.count() > 0) {
    await fullName.fill(`Test User ${testUser.runId}`);
  }

  await page.waitForTimeout(1000);

  const signUpBtn = page.locator('button:has-text("Sign Up")').first();
  await signUpBtn.click();

  await page.waitForTimeout(3000);

  // Check if auto-logged in, otherwise login manually
  if (!page.url().includes('/contracts')) {
    const signInLink = page.locator('text=/already have an account/i').first();
    if (await signInLink.count() > 0) {
      await signInLink.click();
      await page.waitForTimeout(1000);
    }

    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);

    const loginBtn = page.locator('button[type="submit"]:not([disabled])').first();
    await loginBtn.click();

    await page.waitForURL("**/contracts", { timeout: 10000 });
  }
}

/**
 * Start a new contract and return the contract ID
 */
export async function startNewContract(page: Page): Promise<string | null> {
  const newContractBtn = page.locator('button:has-text("Start New Contract"), button:has-text("New Contract")').first();
  await newContractBtn.click();

  await page.waitForTimeout(2000);
  const letsGoBtn = page.locator('button:has-text("Let\'s Go"), button:has-text("Start")').first();
  if (await letsGoBtn.count() > 0) {
    await letsGoBtn.click();
    await page.waitForTimeout(2000);
  }

  // Extract contract ID from URL
  await page.waitForTimeout(1000);
  const url = page.url();
  const contractMatch = url.match(/contract[s]?\/([^\/\?]+)/);
  return contractMatch ? contractMatch[1] : null;
}

/**
 * Fill form fields with test data using multiple selector strategies
 */
export async function fillFormFields(page: Page, sectionData: Record<string, any>, sectionName: string): Promise<number> {
  console.log(`📝 Filling ${sectionName} section...`);
  let filledCount = 0;

  for (const [fieldName, value] of Object.entries(sectionData)) {
    if (value === null || value === undefined) continue;

    try {
      // Try different selector strategies for the field
      const selectors = [
        `input[name="${fieldName}"]`,
        `input[id="${fieldName}"]`,
        `select[name="${fieldName}"]`,
        `select[id="${fieldName}"]`,
        `textarea[name="${fieldName}"]`,
        `textarea[id="${fieldName}"]`,
        `input[name*="${fieldName}" i]`,
        `input[id*="${fieldName}" i]`,
      ];

      let fieldFound = false;
      for (const selector of selectors) {
        const field = page.locator(selector).first();
        if (await field.count() > 0 && await field.isVisible()) {
          const tagName = await field.evaluate(el => el.tagName.toLowerCase());
          const inputType = await field.evaluate(el => el.getAttribute('type'));

          if (tagName === 'select') {
            await field.selectOption(value.toString());
            fieldFound = true;
            filledCount++;
            break;
          } else if (inputType === 'checkbox' || inputType === 'radio') {
            if (typeof value === 'boolean') {
              if (value) {
                await field.check();
              } else {
                await field.uncheck();
              }
              fieldFound = true;
              filledCount++;
              break;
            }
          } else if (inputType === 'date') {
            await field.fill(value.toString());
            fieldFound = true;
            filledCount++;
            break;
          } else {
            await field.clear();
            await field.fill(value.toString());
            fieldFound = true;
            filledCount++;
            break;
          }
        }
      }

      // Handle boolean fields with special Yes/No buttons
      if (!fieldFound && typeof value === 'boolean') {
        const yesNoButtons = page.locator(`button[data-field="${fieldName}"], button[data-fieldid="${fieldName}"]`);
        if (await yesNoButtons.count() > 0) {
          const targetButton = yesNoButtons.filter({ hasText: value ? 'Yes' : 'No' }).first();
          if (await targetButton.count() > 0) {
            await targetButton.click();
            fieldFound = true;
            filledCount++;
          }
        } else {
          // Try general Yes/No buttons near the field
          const fieldArea = page.locator(`[data-fieldid="${fieldName}"], .question-item:has([name="${fieldName}"])`).first();
          if (await fieldArea.count() > 0) {
            const yesNoBtn = fieldArea.locator(`button:has-text("${value ? 'Yes' : 'No'}")`).first();
            if (await yesNoBtn.count() > 0) {
              await yesNoBtn.click();
              fieldFound = true;
              filledCount++;
            }
          }
        }
      }

      if (!fieldFound) {
        console.log(`⚠️ Field not found: ${fieldName} in ${sectionName}`);
      }

    } catch (error) {
      console.log(`❌ Error filling field ${fieldName}: ${error.message}`);
    }
  }

  console.log(`✅ Filled ${filledCount}/${Object.keys(sectionData).length} fields in ${sectionName} section`);
  return filledCount;
}

/**
 * Verify form data is persisted correctly
 */
export async function verifyFormData(page: Page, sectionData: Record<string, any>, sectionName: string): Promise<number> {
  console.log(`🔍 Verifying ${sectionName} section data...`);
  let verifiedCount = 0;
  let totalChecked = 0;

  for (const [fieldName, expectedValue] of Object.entries(sectionData)) {
    if (expectedValue === null || expectedValue === undefined) continue;

    totalChecked++;

    try {
      const selectors = [
        `input[name="${fieldName}"]`,
        `input[id="${fieldName}"]`,
        `select[name="${fieldName}"]`,
        `select[id="${fieldName}"]`,
        `textarea[name="${fieldName}"]`,
        `textarea[id="${fieldName}"]`,
        `input[name*="${fieldName}" i]`,
        `input[id*="${fieldName}" i]`,
      ];

      let fieldFound = false;
      for (const selector of selectors) {
        const field = page.locator(selector).first();
        if (await field.count() > 0 && await field.isVisible()) {
          const tagName = await field.evaluate(el => el.tagName.toLowerCase());
          const inputType = await field.evaluate(el => el.getAttribute('type'));

          let actualValue: any;

          if (tagName === 'select') {
            actualValue = await field.inputValue();
          } else if (inputType === 'checkbox') {
            actualValue = await field.isChecked();
          } else if (inputType === 'radio') {
            actualValue = await field.isChecked();
          } else {
            actualValue = await field.inputValue();
          }

          // Convert for comparison
          const expected = expectedValue.toString();
          const actual = actualValue.toString();

          if (expected === actual || (typeof expectedValue === 'boolean' && expectedValue === actualValue)) {
            verifiedCount++;
            fieldFound = true;
            console.log(`✅ ${fieldName}: "${actual}"`);
          } else {
            console.log(`❌ Mismatch in ${fieldName}: expected "${expected}", got "${actual}"`);
          }
          break;
        }
      }

      // Check boolean buttons if field not found via input
      if (!fieldFound && typeof expectedValue === 'boolean') {
        const activeButton = page.locator(`button[data-field="${fieldName}"][class*="active"], button[data-fieldid="${fieldName}"][class*="active"]`).first();
        if (await activeButton.count() > 0) {
          const buttonText = await activeButton.textContent();
          const isYesActive = buttonText?.includes('Yes') || false;
          if (isYesActive === expectedValue) {
            verifiedCount++;
            fieldFound = true;
            console.log(`✅ ${fieldName}: ${expectedValue ? 'Yes' : 'No'} button active`);
          }
        }
      }

      if (!fieldFound) {
        console.log(`⚠️ Field not found for verification: ${fieldName} in ${sectionName}`);
      }

    } catch (error) {
      console.log(`❌ Error verifying field ${fieldName}: ${error.message}`);
    }
  }

  console.log(`✅ Verified ${verifiedCount}/${totalChecked} fields in ${sectionName} section`);
  return verifiedCount;
}

/**
 * Navigate to the next section using available buttons
 */
export async function navigateToNextSection(page: Page): Promise<boolean> {
  const nextButtons = [
    'button:has-text("Next Section")',
    'button:has-text("Continue")',
    'button:has-text("Next")',
    'button:has-text("Save & Continue")',
    'button[type="submit"]:not([disabled])'
  ];

  for (const selector of nextButtons) {
    const button = page.locator(selector).first();
    if (await button.count() > 0 && await button.isEnabled()) {
      await button.click();
      await page.waitForTimeout(2000);
      return true;
    }
  }

  console.log("⚠️ No next button found");
  return false;
}

/**
 * Navigate to a specific contract section
 */
export async function navigateToSection(page: Page, contractId: string, sectionPath: string): Promise<void> {
  await page.goto(`/#/contract/${contractId}/${sectionPath}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Allow section to fully load
}

/**
 * Wait for form auto-save (simulated wait)
 */
export async function waitForAutoSave(page: Page, delay: number = 2000): Promise<void> {
  await page.waitForTimeout(delay);

  // Look for save indicators if they exist
  const saveIndicators = page.locator('.saving, .saved, [class*="save-status"]');
  if (await saveIndicators.count() > 0) {
    await page.waitForTimeout(500);
  }
}

/**
 * Clear browser storage to test server persistence
 */
export async function clearBrowserStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
}

/**
 * Test data factory for generating consistent test data
 */
export function generateTestData(testRunId: string) {
  return {
    property: {
      streetAddress: `${testRunId} Test Street`,
      city: "Houston",
      state: "TX",
      postalCode: "77001",
      mlsNumber: `MLS${testRunId}`,
      subdivision: `Test Subdivision ${testRunId}`,
      yearBuilt: "2020",
      numBedroom: "4",
      numBathroom: "3",
      floorSizeValue: "2500",
      lotSizeValue: "8000",
      mostRecentPriceAmount: "425000"
    },
    buyers: {
      primaryName: `Buyer ${testRunId}`,
      phone: "713-555-0001",
      email: `buyer${testRunId}@test.com`,
      hasSecondaryParty: true,
      secondaryName: `Secondary Buyer ${testRunId}`,
      secondaryEmail: `secondary${testRunId}@test.com`
    },
    sellers: {
      primaryName: `Seller ${testRunId}`,
      phone: "713-555-0002",
      email: `seller${testRunId}@test.com`,
      hasSecondaryParty: false
    },
    finance: {
      financingType: "conventional",
      principalAmount: "340000",
      cashAmount: "85000",
      loanType: "fixed",
      interestRate: "6.5",
      termYears: "30",
      hasPreferredLender: false,
      wantsLenderReferral: true
    },
    listingAgent: {
      hasListingAgentInfo: true,
      firmName: `Test Realty ${testRunId}`,
      firmLicenseNumber: `TX${testRunId}`,
      listingAssociateName: `Agent ${testRunId}`,
      listingAssociateEmail: `agent${testRunId}@test.com`
    }
  };
}

/**
 * Take screenshot for debugging
 */
export async function takeDebugScreenshot(page: Page, name: string, testRunId: string): Promise<void> {
  await page.screenshot({
    path: `test-results/debug-${name}-${testRunId}.png`,
    fullPage: true
  });
  console.log(`📸 Debug screenshot taken: debug-${name}-${testRunId}.png`);
}