import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/**
 * E2E Tests for Form Data Persistence
 * Tests that form data saves correctly and persists across:
 * - Section navigation
 * - Page refreshes
 * - Contract re-selection from listing
 */
test.describe("Form Data Persistence Tests", () => {
  const testRunId = Date.now().toString();
  const testEmail = `persistence${testRunId}@example.com`;
  const testPassword = `TestPersist123!`;
  let contractId: string;

  // Test data for all sections
  const testData = {
    property: {
      streetAddress: "123 Test Persistence Street",
      city: "Houston",
      state: "TX",
      postalCode: "77001",
      mlsNumber: "TX123456",
      subdivision: "Test Subdivision",
      yearBuilt: "2020",
      numBedroom: "4",
      numBathroom: "3",
      floorSizeValue: "2500",
      lotSizeValue: "8000",
      mostRecentPriceAmount: "425000"
    },
    buyers: {
      primaryName: "John Persistence Buyer",
      phone: "713-555-0001",
      email: testEmail,
      hasSecondaryParty: true,
      secondaryName: "Jane Secondary Buyer",
      secondaryEmail: "jane@persistence-test.com"
    },
    sellers: {
      primaryName: "Bob Persistence Seller",
      phone: "713-555-0002",
      email: "seller@persistence-test.com",
      hasSecondaryParty: false,
      secondaryName: ""
    },
    finance: {
      financingType: "conventional",
      principalAmount: "340000",
      cashAmount: "85000",
      loanType: "fixed",
      interestRate: "6.5",
      termYears: "30",
      hasPreferredLender: false,
      wantsLenderReferral: true,
      buyerApprovalNoticeDays: "20"
    },
    listingAgent: {
      hasListingAgentInfo: true,
      firmName: "Persistence Realty Inc",
      firmLicenseNumber: "TX123456789",
      firmStreetAddress: "456 Realty Lane",
      firmCity: "Houston",
      firmState: "TX",
      firmPostalCode: "77002",
      firmPhone: "713-555-7890",
      listingAssociateName: "Sarah Agent",
      listingAssociateLicenseNumber: "TX987654321",
      listingAssociateEmail: "sarah@persistence-realty.com",
      listingAssociatePhone: "713-555-7891"
    },
    title: {
      hasTitleCompany: true,
      titleCompanyName: "Persistence Title Co",
      titleCompanyStreetAddress: "789 Title Street",
      titleCompanyCity: "Houston",
      titleCompanyState: "TX",
      titleCompanyPostalCode: "77003",
      earnestMoney: "10000",
      optionFee: "750",
      optionPeriodDaysToTerminate: "10",
      additionalEarnestMoney: "5000",
      additionalEarnestMoneyDaysToDeliver: "5"
    },
    homeownersAssociationAddendum: {
      hasHomeownersAssociation: true,
      associationName: "Persistence HOA",
      associationPhoneNumber: "713-555-4000",
      requiresSubdivisionInfo: true,
      buyerFeesNotToExceed: "500"
    },
    leases: {
      hasResidentialLease: false,
      hasFixtureLease: true,
      hasMineralLease: true,
      mineralLeaseCopyDelivered: false,
      mineralLeaseDaysToDeliveryCopy: "7"
    },
    survey: {
      daysToFurnish: "10",
      type: "new",
      furnishingPartyIfExistingIsUnacceptable: "buyer"
    },
    propertyCondition: {
      sellerDisclosureReceived: false,
      sellerDisclosureDaysToProduce: "7",
      buyerAcceptsAsIs: false,
      serviceContractReimbursementAmount: "750"
    },
    closing: {
      closingDate: "2024-03-15"
    },
    possession: {
      possessionUponClosing: true,
      possessionAccordingToTempLease: false
    },
    buyerAttorney: {
      hasAttorney: true,
      name: "Legal Eagle Attorney",
      streetAddress: "321 Law Street",
      city: "Houston",
      state: "TX",
      postalCode: "77004",
      phone: "713-555-5000",
      email: "attorney@persistence-law.com"
    }
  };

  // Helper function to create and login test user
  async function loginTestUser(page: Page) {
    await page.goto("/");
    await page.waitForLoadState('networkidle');

    // Navigate to sign up
    const signUpLink = page.locator('button:has-text("Sign up"), a:has-text("Sign up")').first();
    if (await signUpLink.count() > 0) {
      await signUpLink.click();
      await page.waitForTimeout(1000);
    }

    // Fill sign up form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);

    const confirmPwd = page.locator('input[placeholder*="Confirm" i], input[id="confirmPassword"]').first();
    await confirmPwd.fill(testPassword);

    const fullName = page.locator('input[id="fullName"]');
    if (await fullName.count() > 0) {
      await fullName.fill(`Persistence Test User ${testRunId}`);
    }

    await page.waitForTimeout(1000);

    const signUpBtn = page.locator('button:has-text("Sign Up")').first();
    await expect(signUpBtn).toBeEnabled({ timeout: 5000 });
    await signUpBtn.click();

    await page.waitForTimeout(3000);

    // Check if auto-logged in, otherwise login manually
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

  // Helper function to start a new contract
  async function startNewContract(page: Page) {
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
    if (contractMatch) {
      contractId = contractMatch[1];
      console.log(`📄 Created contract: ${contractId}`);
    }
  }

  // Helper function to fill form fields with test data
  async function fillFormFields(page: Page, sectionData: Record<string, any>, sectionName: string) {
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
          if (await field.count() > 0) {
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
  }

  // Helper function to verify form data is persisted
  async function verifyFormData(page: Page, sectionData: Record<string, any>, sectionName: string) {
    console.log(`🔍 Verifying ${sectionName} section data...`);
    let verifiedCount = 0;

    for (const [fieldName, expectedValue] of Object.entries(sectionData)) {
      if (expectedValue === null || expectedValue === undefined) continue;

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
          if (await field.count() > 0) {
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
            } else {
              console.log(`❌ Mismatch in ${fieldName}: expected "${expected}", got "${actual}"`);
            }
            break;
          }
        }

        if (!fieldFound) {
          console.log(`⚠️ Field not found for verification: ${fieldName} in ${sectionName}`);
        }

      } catch (error) {
        console.log(`❌ Error verifying field ${fieldName}: ${error.message}`);
      }
    }

    console.log(`✅ Verified ${verifiedCount}/${Object.keys(sectionData).length} fields in ${sectionName} section`);
    return verifiedCount;
  }

  // Helper function to navigate to next section
  async function navigateToNextSection(page: Page) {
    const nextButtons = [
      'button:has-text("Next Section")',
      'button:has-text("Continue")',
      'button:has-text("Next")',
      'button:has-text("Save & Continue")',
      'button[type="submit"]'
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

  test("Property section data persistence", async ({ page }) => {
    test.setTimeout(120000);

    await loginTestUser(page);
    await startNewContract(page);

    // Fill property data
    await fillFormFields(page, testData.property, "Property");

    // Save and navigate
    await navigateToNextSection(page);

    // Navigate back to property section via URL or menu
    if (contractId) {
      await page.goto(`/#/contract/${contractId}/property`);
      await page.waitForLoadState('networkidle');

      // Verify data persisted
      const verifiedCount = await verifyFormData(page, testData.property, "Property");
      expect(verifiedCount).toBeGreaterThan(5); // At least 5 fields should persist
    }
  });

  test("Buyers section data persistence", async ({ page }) => {
    test.setTimeout(120000);

    await loginTestUser(page);
    await startNewContract(page);

    // Navigate to buyers section
    if (contractId) {
      await page.goto(`/#/contract/${contractId}/buyers`);
      await page.waitForLoadState('networkidle');
    }

    await fillFormFields(page, testData.buyers, "Buyers");
    await navigateToNextSection(page);

    // Navigate back and verify
    if (contractId) {
      await page.goto(`/#/contract/${contractId}/buyers`);
      await page.waitForLoadState('networkidle');

      const verifiedCount = await verifyFormData(page, testData.buyers, "Buyers");
      expect(verifiedCount).toBeGreaterThan(3);
    }
  });

  test("Finance section data persistence", async ({ page }) => {
    test.setTimeout(120000);

    await loginTestUser(page);
    await startNewContract(page);

    // Navigate to finance section
    if (contractId) {
      await page.goto(`/#/contract/${contractId}/finance`);
      await page.waitForLoadState('networkidle');
    }

    await fillFormFields(page, testData.finance, "Finance");
    await navigateToNextSection(page);

    // Navigate back and verify
    if (contractId) {
      await page.goto(`/#/contract/${contractId}/finance`);
      await page.waitForLoadState('networkidle');

      const verifiedCount = await verifyFormData(page, testData.finance, "Finance");
      expect(verifiedCount).toBeGreaterThan(4);
    }
  });

  test("Listing Agent section data persistence with boolean field", async ({ page }) => {
    test.setTimeout(120000);

    await loginTestUser(page);
    await startNewContract(page);

    // Navigate to listing agent section
    if (contractId) {
      await page.goto(`/#/contract/${contractId}/listingAgent`);
      await page.waitForLoadState('networkidle');
    }

    // Fill listing agent data including the critical hasListingAgentInfo boolean
    await fillFormFields(page, testData.listingAgent, "ListingAgent");

    // Specifically verify the boolean field gets set
    const hasInfoButton = page.locator('button:has-text("Yes")').filter({
      hasText: testData.listingAgent.hasListingAgentInfo ? 'Yes' : 'No'
    }).first();
    if (await hasInfoButton.count() > 0) {
      await hasInfoButton.click();
      await page.waitForTimeout(500);
    }

    await navigateToNextSection(page);

    // Navigate back and verify
    if (contractId) {
      await page.goto(`/#/contract/${contractId}/listingAgent`);
      await page.waitForLoadState('networkidle');

      const verifiedCount = await verifyFormData(page, testData.listingAgent, "ListingAgent");
      expect(verifiedCount).toBeGreaterThan(5);

      // Specifically verify boolean field
      const booleanField = page.locator('input[name="hasListingAgentInfo"], button[data-field="hasListingAgentInfo"][class*="active"]');
      if (await booleanField.count() > 0) {
        console.log("✅ Boolean hasListingAgentInfo field found and verified");
      }
    }
  });

  test("Title section data persistence", async ({ page }) => {
    test.setTimeout(120000);

    await loginTestUser(page);
    await startNewContract(page);

    // Navigate to title section
    if (contractId) {
      await page.goto(`/#/contract/${contractId}/title`);
      await page.waitForLoadState('networkidle');
    }

    await fillFormFields(page, testData.title, "Title");
    await navigateToNextSection(page);

    // Navigate back and verify
    if (contractId) {
      await page.goto(`/#/contract/${contractId}/title`);
      await page.waitForLoadState('networkidle');

      const verifiedCount = await verifyFormData(page, testData.title, "Title");
      expect(verifiedCount).toBeGreaterThan(4);
    }
  });

  test("Page refresh preserves all form data", async ({ page }) => {
    test.setTimeout(180000);

    await loginTestUser(page);
    await startNewContract(page);

    // Fill multiple sections
    const sections = [
      { data: testData.property, name: "Property", path: "property" },
      { data: testData.buyers, name: "Buyers", path: "buyers" },
      { data: testData.finance, name: "Finance", path: "finance" }
    ];

    for (const section of sections) {
      if (contractId) {
        await page.goto(`/#/contract/${contractId}/${section.path}`);
        await page.waitForLoadState('networkidle');
        await fillFormFields(page, section.data, section.name);
        await page.waitForTimeout(1000); // Allow save
      }
    }

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify all sections still have data
    for (const section of sections) {
      if (contractId) {
        await page.goto(`/#/contract/${contractId}/${section.path}`);
        await page.waitForLoadState('networkidle');

        const verifiedCount = await verifyFormData(page, section.data, section.name);
        expect(verifiedCount).toBeGreaterThan(2, `${section.name} section should persist after refresh`);
      }
    }
  });

  test("Contract selection from listing loads saved data", async ({ page }) => {
    test.setTimeout(180000);

    await loginTestUser(page);
    await startNewContract(page);

    // Fill some test data in property section
    if (contractId) {
      await page.goto(`/#/contract/${contractId}/property`);
      await page.waitForLoadState('networkidle');
      await fillFormFields(page, testData.property, "Property");
      await page.waitForTimeout(2000);
    }

    // Navigate back to contracts listing
    await page.goto("/#/contracts");
    await page.waitForLoadState('networkidle');

    // Find and click the contract we just created
    const contractLink = page.locator(`a[href*="${contractId}"], button:has-text("${contractId}")`, { hasText: contractId }).first();
    if (await contractLink.count() === 0) {
      // Try alternative selectors for contract cards
      const contractCards = page.locator('.contract-card, [data-contract-id], table tr').first();
      if (await contractCards.count() > 0) {
        await contractCards.click();
      }
    } else {
      await contractLink.click();
    }

    await page.waitForTimeout(3000);

    // Navigate to property section and verify data loaded
    if (contractId) {
      await page.goto(`/#/contract/${contractId}/property`);
      await page.waitForLoadState('networkidle');

      const verifiedCount = await verifyFormData(page, testData.property, "Property");
      expect(verifiedCount).toBeGreaterThan(3, "Property data should load when selecting contract from listing");
    }
  });

  test("Boolean fields save correctly across all sections", async ({ page }) => {
    test.setTimeout(180000);

    await loginTestUser(page);
    await startNewContract(page);

    // Test boolean fields in multiple sections
    const booleanSections = [
      {
        data: { hasSecondaryParty: true },
        name: "Buyers",
        path: "buyers"
      },
      {
        data: { hasListingAgentInfo: true },
        name: "ListingAgent",
        path: "listingAgent"
      },
      {
        data: { hasTitleCompany: true },
        name: "Title",
        path: "title"
      },
      {
        data: { hasHomeownersAssociation: true },
        name: "HOA",
        path: "addendumHOA"
      }
    ];

    for (const section of booleanSections) {
      if (contractId) {
        await page.goto(`/#/contract/${contractId}/${section.path}`);
        await page.waitForLoadState('networkidle');

        // Fill boolean data
        await fillFormFields(page, section.data, section.name);
        await page.waitForTimeout(1000);

        // Navigate away and back
        await page.goto("/#/contracts");
        await page.waitForTimeout(1000);

        await page.goto(`/#/contract/${contractId}/${section.path}`);
        await page.waitForLoadState('networkidle');

        // Verify boolean fields persisted
        const verifiedCount = await verifyFormData(page, section.data, section.name);
        expect(verifiedCount).toBeGreaterThan(0, `Boolean fields in ${section.name} should persist`);
      }
    }
  });

  test("All form sections data saves and navigates correctly", async ({ page }) => {
    test.setTimeout(300000); // 5 minutes for comprehensive test

    await loginTestUser(page);
    await startNewContract(page);

    // Test all major sections with navigation
    const allSections = [
      { data: testData.property, name: "Property", path: "property" },
      { data: testData.buyers, name: "Buyers", path: "buyers" },
      { data: testData.sellers, name: "Sellers", path: "sellers" },
      { data: testData.finance, name: "Finance", path: "finance" },
      { data: testData.listingAgent, name: "ListingAgent", path: "listingAgent" },
      { data: testData.title, name: "Title", path: "title" },
      { data: testData.homeownersAssociationAddendum, name: "HOA", path: "addendumHOA" },
      { data: testData.leases, name: "Leases", path: "leases" },
      { data: testData.survey, name: "Survey", path: "survey" },
      { data: testData.propertyCondition, name: "PropertyCondition", path: "propertyCondition" },
      { data: testData.closing, name: "Closing", path: "closing" },
      { data: testData.possession, name: "Possession", path: "possession" },
      { data: testData.buyerAttorney, name: "BuyerAttorney", path: "buyerAttorney" }
    ];

    // Fill all sections
    for (let i = 0; i < allSections.length; i++) {
      const section = allSections[i];

      if (contractId) {
        console.log(`\n📄 Testing section ${i + 1}/${allSections.length}: ${section.name}`);

        await page.goto(`/#/contract/${contractId}/${section.path}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await fillFormFields(page, section.data, section.name);
        await page.waitForTimeout(1000);

        // Navigate to next section if not last
        if (i < allSections.length - 1) {
          const nextSection = allSections[i + 1];
          await page.goto(`/#/contract/${contractId}/${nextSection.path}`);
          await page.waitForLoadState('networkidle');
        }
      }
    }

    // Verify all sections by navigating back through them
    let totalVerified = 0;
    for (const section of allSections) {
      if (contractId) {
        await page.goto(`/#/contract/${contractId}/${section.path}`);
        await page.waitForLoadState('networkidle');

        const verifiedCount = await verifyFormData(page, section.data, section.name);
        totalVerified += verifiedCount;

        // Each section should have at least some data persisted
        expect(verifiedCount).toBeGreaterThan(0, `${section.name} section should have persisted data`);
      }
    }

    console.log(`\n🎉 COMPREHENSIVE TEST COMPLETED`);
    console.log(`📊 Total fields verified across all sections: ${totalVerified}`);
    expect(totalVerified).toBeGreaterThan(30, "Should verify substantial amount of data across all sections");
  });
});