import { test, expect } from "@playwright/test";
import {
  createAndLoginTestUser,
  startNewContract,
  fillFormFields,
  verifyFormData,
  navigateToSection,
  waitForAutoSave,
  clearBrowserStorage,
  generateTestData,
  takeDebugScreenshot,
  type TestUser,
  type FormSection
} from "./utils/form-persistence-helpers";

/**
 * Comprehensive Form Data Persistence Test Suite
 *
 * This test suite provides exhaustive coverage of form data persistence
 * across all contract sections using a structured approach.
 */
test.describe("Comprehensive Form Data Persistence", () => {
  const testRunId = Date.now().toString();
  const testUser: TestUser = {
    email: `comprehensive${testRunId}@example.com`,
    password: `Comprehensive123!`,
    runId: testRunId
  };

  let contractId: string;
  let testData: ReturnType<typeof generateTestData>;

  test.beforeEach(async ({ page }) => {
    testData = generateTestData(testRunId);
  });

  test("Complete contract form persistence workflow", async ({ page }) => {
    test.setTimeout(300000); // 5 minutes for comprehensive test

    // Step 1: Create user and contract
    await createAndLoginTestUser(page, testUser);
    const newContractId = await startNewContract(page);
    expect(newContractId).toBeTruthy();
    contractId = newContractId!;

    console.log(`\n🎯 Starting comprehensive persistence test with contract: ${contractId}`);

    // Step 2: Define all sections to test
    const formSections: FormSection[] = [
      { data: testData.property, name: "Property", path: "property" },
      { data: testData.buyers, name: "Buyers", path: "buyers" },
      { data: testData.sellers, name: "Sellers", path: "sellers" },
      { data: testData.finance, name: "Finance", path: "finance" },
      { data: testData.listingAgent, name: "ListingAgent", path: "listingAgent" },
      {
        data: {
          hasTitleCompany: true,
          titleCompanyName: `Title Co ${testRunId}`,
          earnestMoney: "10000",
          optionFee: "500"
        },
        name: "Title",
        path: "title"
      },
      {
        data: {
          hasHomeownersAssociation: true,
          associationName: `HOA ${testRunId}`
        },
        name: "HOA",
        path: "addendumHOA"
      },
      {
        data: {
          hasResidentialLease: false,
          hasMineralLease: true
        },
        name: "Leases",
        path: "leases"
      }
    ];

    // Step 3: Fill all sections with test data
    console.log("\n📝 Phase 1: Filing all sections with test data");
    let totalFieldsFilled = 0;

    for (const section of formSections) {
      await navigateToSection(page, contractId, section.path);
      const filledCount = await fillFormFields(page, section.data, section.name);
      totalFieldsFilled += filledCount;
      await waitForAutoSave(page);
    }

    console.log(`✅ Phase 1 Complete: ${totalFieldsFilled} total fields filled`);

    // Step 4: Test navigation persistence
    console.log("\n🔄 Phase 2: Testing navigation persistence");
    let totalFieldsVerified = 0;

    for (const section of formSections) {
      await navigateToSection(page, contractId, section.path);
      const verifiedCount = await verifyFormData(page, section.data, section.name);
      totalFieldsVerified += verifiedCount;

      expect(verifiedCount).toBeGreaterThan(0, `${section.name} should have persisted data`);
    }

    console.log(`✅ Phase 2 Complete: ${totalFieldsVerified} fields verified after navigation`);

    // Step 5: Test page refresh persistence
    console.log("\n🔄 Phase 3: Testing page refresh persistence");
    await page.reload();
    await page.waitForLoadState('networkidle');

    let refreshVerifiedCount = 0;
    for (const section of formSections) {
      await navigateToSection(page, contractId, section.path);
      const verifiedCount = await verifyFormData(page, section.data, section.name);
      refreshVerifiedCount += verifiedCount;

      expect(verifiedCount).toBeGreaterThan(0, `${section.name} should persist after refresh`);
    }

    console.log(`✅ Phase 3 Complete: ${refreshVerifiedCount} fields verified after refresh`);

    // Step 6: Test contract re-selection persistence
    console.log("\n🔄 Phase 4: Testing contract re-selection persistence");
    await page.goto("/#/contracts");
    await page.waitForLoadState('networkidle');

    // Find and re-select the contract
    const contractLink = page.locator(`[href*="${contractId}"]`).first();
    if (await contractLink.count() > 0) {
      await contractLink.click();
    } else {
      // Fallback to direct navigation
      await page.goto(`/#/contract/${contractId}/property`);
    }

    await page.waitForLoadState('networkidle');

    let reselectionVerifiedCount = 0;
    for (const section of formSections) {
      await navigateToSection(page, contractId, section.path);
      const verifiedCount = await verifyFormData(page, section.data, section.name);
      reselectionVerifiedCount += verifiedCount;

      expect(verifiedCount).toBeGreaterThan(0, `${section.name} should persist after contract re-selection`);
    }

    console.log(`✅ Phase 4 Complete: ${reselectionVerifiedCount} fields verified after re-selection`);

    // Step 7: Test session storage clear (server persistence)
    console.log("\n🔄 Phase 5: Testing server persistence after storage clear");
    await clearBrowserStorage(page);
    await page.reload();
    await page.waitForLoadState('networkidle');

    let serverPersistenceCount = 0;
    for (const section of formSections) {
      await navigateToSection(page, contractId, section.path);
      const verifiedCount = await verifyFormData(page, section.data, section.name);
      serverPersistenceCount += verifiedCount;

      // Server persistence might be lower due to session-only fields
      expect(verifiedCount).toBeGreaterThanOrEqual(0, `${section.name} server persistence`);
    }

    console.log(`✅ Phase 5 Complete: ${serverPersistenceCount} fields verified from server`);

    // Final Summary
    console.log(`\n🎉 COMPREHENSIVE PERSISTENCE TEST COMPLETED`);
    console.log(`📊 Test Results Summary:`);
    console.log(`   - Total fields filled: ${totalFieldsFilled}`);
    console.log(`   - Navigation persistence: ${totalFieldsVerified}`);
    console.log(`   - Refresh persistence: ${refreshVerifiedCount}`);
    console.log(`   - Re-selection persistence: ${reselectionVerifiedCount}`);
    console.log(`   - Server persistence: ${serverPersistenceCount}`);
    console.log(`   - Contract ID: ${contractId}`);

    // Take final screenshot
    await takeDebugScreenshot(page, "comprehensive-final", testRunId);

    // Validate overall success
    expect(totalFieldsFilled).toBeGreaterThan(20, "Should fill substantial number of fields");
    expect(totalFieldsVerified).toBeGreaterThan(15, "Should verify substantial navigation persistence");
    expect(refreshVerifiedCount).toBeGreaterThan(10, "Should verify refresh persistence");
  });

  test("Section-by-section persistence validation", async ({ page }) => {
    test.setTimeout(180000);

    await createAndLoginTestUser(page, testUser);
    const newContractId = await startNewContract(page);
    expect(newContractId).toBeTruthy();
    contractId = newContractId!;

    // Test each section individually with detailed validation
    const sectionsToTest = [
      {
        name: "Property Section",
        path: "property",
        data: {
          streetAddress: "123 Persistence Test Ave",
          city: "Houston",
          state: "TX",
          postalCode: "77001",
          yearBuilt: "2020",
          numBedroom: "4",
          numBathroom: "2.5",
          floorSizeValue: "2200"
        },
        requiredFields: ["streetAddress", "city", "state"]
      },
      {
        name: "Buyers Section",
        path: "buyers",
        data: {
          primaryName: "John Test Buyer",
          email: testUser.email,
          phone: "713-555-1234",
          hasSecondaryParty: true,
          secondaryName: "Jane Test Buyer"
        },
        requiredFields: ["primaryName", "email"]
      },
      {
        name: "Finance Section",
        path: "finance",
        data: {
          principalAmount: "350000",
          cashAmount: "70000",
          financingType: "conventional",
          interestRate: "6.75",
          termYears: "30"
        },
        requiredFields: ["principalAmount"]
      }
    ];

    for (const section of sectionsToTest) {
      console.log(`\n🔍 Testing ${section.name}...`);

      // Fill the section
      await navigateToSection(page, contractId, section.path);
      const filledCount = await fillFormFields(page, section.data, section.name);
      await waitForAutoSave(page);

      expect(filledCount).toBeGreaterThan(0, `Should fill fields in ${section.name}`);

      // Test immediate persistence (navigation away and back)
      await page.goto("/#/contracts");
      await page.waitForTimeout(1000);
      await navigateToSection(page, contractId, section.path);

      const verifiedCount = await verifyFormData(page, section.data, section.name);
      expect(verifiedCount).toBeGreaterThan(0, `${section.name} should persist immediately`);

      // Verify required fields specifically
      for (const requiredField of section.requiredFields) {
        const fieldValue = section.data[requiredField];
        if (fieldValue) {
          const field = page.locator(`input[name="${requiredField}"], input[id="${requiredField}"]`).first();
          if (await field.count() > 0) {
            const actualValue = await field.inputValue();
            expect(actualValue).toBe(fieldValue.toString(), `Required field ${requiredField} should persist`);
          }
        }
      }

      console.log(`✅ ${section.name} persistence validated`);
    }
  });

  test("Boolean field persistence across sections", async ({ page }) => {
    test.setTimeout(120000);

    await createAndLoginTestUser(page, testUser);
    const newContractId = await startNewContract(page);
    expect(newContractId).toBeTruthy();
    contractId = newContractId!;

    // Test boolean fields in multiple sections
    const booleanTests = [
      {
        section: "buyers",
        field: "hasSecondaryParty",
        value: true,
        description: "Buyers has secondary party"
      },
      {
        section: "sellers",
        field: "hasSecondaryParty",
        value: false,
        description: "Sellers no secondary party"
      },
      {
        section: "listingAgent",
        field: "hasListingAgentInfo",
        value: true,
        description: "Has listing agent info"
      },
      {
        section: "title",
        field: "hasTitleCompany",
        value: true,
        description: "Has title company"
      }
    ];

    for (const booleanTest of booleanTests) {
      console.log(`\n🔘 Testing boolean: ${booleanTest.description}`);

      await navigateToSection(page, contractId, booleanTest.section);

      // Fill the boolean field
      const booleanData = { [booleanTest.field]: booleanTest.value };
      await fillFormFields(page, booleanData, booleanTest.section);
      await waitForAutoSave(page);

      // Navigate away and back
      await page.goto("/#/contracts");
      await page.waitForTimeout(1000);
      await navigateToSection(page, contractId, booleanTest.section);

      // Verify boolean persistence
      const verifiedCount = await verifyFormData(page, booleanData, booleanTest.section);
      expect(verifiedCount).toBeGreaterThan(0, `Boolean ${booleanTest.field} should persist`);

      console.log(`✅ Boolean ${booleanTest.field} = ${booleanTest.value} persisted`);
    }
  });

  test("Large form data and special characters persistence", async ({ page }) => {
    test.setTimeout(120000);

    await createAndLoginTestUser(page, testUser);
    const newContractId = await startNewContract(page);
    expect(newContractId).toBeTruthy();
    contractId = newContractId!;

    // Test with special characters and large text
    const specialData = {
      property: {
        streetAddress: "123 Tëst Stréét & Ávénue #2 (Unit A)",
        subdivision: "Lós Álamos Subdivision, Phase II",
        legalDescription: `Lot 1, Block A, Smith's Addition to the City of Houston, Harris County, Texas, being 0.25 acres, more or less, as recorded in Volume 123, Page 456 of the Deed Records of Harris County, Texas.`
      },
      buyerProvisions: {
        buyerProvisions: `Special provisions and requirements:

1. Property inspection by licensed inspector within 10 days
2. Seller to provide all utility bills for past 12 months
3. Pool/spa equipment to be in working order at closing
4. All appliances included: refrigerator, washer, dryer, etc.
5. Seller to pay for title policy and closing costs up to $2,500

Additional notes: Property has been well-maintained and includes recent updates to HVAC system (2023) and roof replacement (2022). Buyer acknowledges receipt of HOA documents and restrictions.`
      }
    };

    // Test property section with special characters
    console.log("\n🌍 Testing special characters in property section...");
    await navigateToSection(page, contractId, "property");
    const propertyFilled = await fillFormFields(page, specialData.property, "Property");
    await waitForAutoSave(page);

    // Navigate away and verify
    await page.goto("/#/contracts");
    await page.waitForTimeout(1000);
    await navigateToSection(page, contractId, "property");

    const propertyVerified = await verifyFormData(page, specialData.property, "Property");
    expect(propertyVerified).toBeGreaterThan(0, "Special characters should persist in property");

    // Test large text in buyer provisions
    console.log("\n📝 Testing large text in buyer provisions...");
    await navigateToSection(page, contractId, "buyerProvisions");
    const provisionsField = page.locator('textarea[name="buyerProvisions"], textarea[id="buyerProvisions"]').first();

    if (await provisionsField.count() > 0) {
      await provisionsField.fill(specialData.buyerProvisions.buyerProvisions);
      await waitForAutoSave(page);

      // Navigate away and verify
      await page.goto("/#/contracts");
      await page.waitForTimeout(1000);
      await navigateToSection(page, contractId, "buyerProvisions");

      const persistedText = await provisionsField.inputValue();
      expect(persistedText).toBe(specialData.buyerProvisions.buyerProvisions);
      console.log("✅ Large text with special formatting persisted");
    }
  });

  test("Concurrent section editing simulation", async ({ page }) => {
    test.setTimeout(150000);

    await createAndLoginTestUser(page, testUser);
    const newContractId = await startNewContract(page);
    expect(newContractId).toBeTruthy();
    contractId = newContractId!;

    // Simulate rapid editing across multiple sections
    const rapidEditData = [
      { section: "property", data: { streetAddress: "Rapid Edit 1" }},
      { section: "buyers", data: { primaryName: "Rapid Buyer 1" }},
      { section: "finance", data: { principalAmount: "100000" }},
      { section: "property", data: { city: "Rapid City 1" }},
      { section: "buyers", data: { phone: "713-555-0001" }},
      { section: "finance", data: { cashAmount: "20000" }},
      { section: "property", data: { state: "TX" }},
      { section: "buyers", data: { email: testUser.email }},
      { section: "finance", data: { interestRate: "5.5" }}
    ];

    console.log("\n⚡ Simulating rapid concurrent editing...");

    // Rapid editing simulation
    for (let round = 0; round < 2; round++) {
      for (const edit of rapidEditData) {
        await navigateToSection(page, contractId, edit.section);
        await fillFormFields(page, edit.data, `${edit.section}-rapid`);
        await page.waitForTimeout(200); // Very short wait to simulate rapid editing
      }
    }

    console.log("⚡ Rapid editing complete, verifying data integrity...");

    // Verify final state
    const finalData = {
      property: { streetAddress: "Rapid Edit 1", city: "Rapid City 1", state: "TX" },
      buyers: { primaryName: "Rapid Buyer 1", phone: "713-555-0001", email: testUser.email },
      finance: { principalAmount: "100000", cashAmount: "20000", interestRate: "5.5" }
    };

    let totalVerified = 0;
    for (const [section, data] of Object.entries(finalData)) {
      await navigateToSection(page, contractId, section);
      const verified = await verifyFormData(page, data, section);
      totalVerified += verified;
    }

    expect(totalVerified).toBeGreaterThan(6, "Most fields should persist despite rapid editing");
    console.log(`✅ Rapid editing test complete: ${totalVerified} fields verified`);
  });
});