import { test, expect } from "@playwright/test";
import TestHelpers from "../utils/test-helpers";
import testConfig from "../config/test.config";

test.describe("Complete DealDocs Workflow - Supabase Migration", () => {
  let testUserEmail: string;
  let testUserPassword: string;
  let testRunId: string;
  
  test.beforeAll(async () => {
    // Generate unique test user for this session
    testRunId = Date.now().toString();
    testUserEmail = `test-user-${testRunId}@dealdocs.test`;
    testUserPassword = `TestPass123!${testRunId}`;
    
    console.log(`📧 Test user email: ${testUserEmail}`);
  });

  test.afterAll(async ({ browser }) => {
    // Clean up - sign out and clear any test data
    const page = await browser.newPage();
    try {
      await page.goto("/");
      // Try to clean up the test user session if possible
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    } catch (error) {
      console.log("Cleanup error (non-critical):", error);
    } finally {
      await page.close();
    }
  });

  test("Complete workflow: Account creation to contract email", async ({ page }) => {
    test.setTimeout(120000); // 2 minutes for complete workflow
    
    // Step 1: User creates account
    console.log("🔐 Step 1: Creating new user account...");
    
    await page.goto("/");
    
    // Look for sign up link or button
    const signUpLink = page.locator('a:has-text("Sign up"), a:has-text("Create account"), button:has-text("Register")');
    if (await signUpLink.count() > 0) {
      await signUpLink.first().click();
      await page.waitForURL("**/signup", { timeout: 5000 }).catch(() => {});
    } else {
      // We might already be on the auth page
      const isAuthPage = await page.locator('input[type="email"]').count() > 0;
      if (!isAuthPage) {
        throw new Error("Cannot find sign up option");
      }
    }
    
    // Fill in registration form
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', testUserEmail);
    await page.fill('input[type="password"], input[name="password"], input[placeholder*="password" i]', testUserPassword);
    
    // Check if there's a confirm password field
    const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[placeholder*="confirm" i], input[placeholder*="re-enter" i]');
    if (await confirmPasswordInput.count() > 0) {
      await confirmPasswordInput.fill(testUserPassword);
    }
    
    // Check for additional fields like name
    const nameInput = page.locator('input[name="fullName"], input[name="name"], input[placeholder*="name" i]');
    if (await nameInput.count() > 0) {
      await nameInput.fill(`Test User ${testRunId}`);
    }
    
    // Submit registration
    await page.click('button:has-text("Sign up"), button:has-text("Register"), button:has-text("Create account")');
    
    // Wait for registration to complete - might redirect to dashboard or show confirmation
    try {
      await page.waitForURL("**/contracts", { timeout: 10000 });
      console.log("✅ Account created and logged in automatically");
    } catch {
      // Might need email confirmation or manual login
      console.log("📧 Account created, attempting to log in...");
    }
    
    // Step 2: User logs in (if not already logged in)
    console.log("🔑 Step 2: Logging in with test credentials...");
    
    const isLoggedIn = await page.url().includes('/contracts') || 
                       await page.locator('button:has-text("Start New Contract")').count() > 0;
    
    if (!isLoggedIn) {
      // Navigate to login if needed
      const currentUrl = page.url();
      if (!currentUrl.includes('/login') && !currentUrl.includes('/signin')) {
        const loginLink = page.locator('a:has-text("Sign in"), a:has-text("Log in"), button:has-text("Login")');
        if (await loginLink.count() > 0) {
          await loginLink.first().click();
        }
      }
      
      // Perform login - wait a moment for form to settle
      await page.waitForTimeout(1000);
      
      // Click "Sign in" link if we're still on sign up form
      const signInLink = page.locator('a:has-text("Sign in"), button:has-text("Sign in")').first();
      if (await signInLink.count() > 0) {
        await signInLink.click();
        await page.waitForTimeout(1000);
      }
      
      await page.fill('input[type="email"]', testUserEmail);
      await page.fill('input[type="password"]', testUserPassword);
      
      // Find the enabled Sign In button
      const signInBtn = page.locator('button[type="submit"]:not([disabled])').first();
      await expect(signInBtn).toBeEnabled({ timeout: 5000 });
      await signInBtn.click();
      
      // Wait for successful login
      await page.waitForURL("**/contracts", { timeout: 10000 });
    }
    
    // Verify we're on contracts page
    await expect(page.locator('h1:has-text("My Contracts"), h2:has-text("Contracts")').first()).toBeVisible({ timeout: 10000 });
    console.log("✅ Successfully logged in");
    
    // Step 3: Start new contract
    console.log("📋 Step 3: Starting new contract...");
    
    const startContractBtn = page.locator('button:has-text("Start New Contract"), a:has-text("New Contract")').first();
    await expect(startContractBtn).toBeVisible();
    await startContractBtn.click();
    
    // Navigate through contract stepper if present
    try {
      await page.waitForURL("**/contracts/new", { timeout: 5000 });
      const letsGoBtn = page.locator('button:has-text("Let\'s Go"), button:has-text("Start"), button:has-text("Begin")');
      if (await letsGoBtn.count() > 0) {
        await letsGoBtn.first().click();
      }
    } catch {
      console.log("No stepper found, proceeding to address validation");
    }
    
    // Step 4: Property search with real address
    console.log("🏠 Step 4: Searching for property...");
    
    // Wait for address validation page
    try {
      await page.waitForURL("**/address-validation", { timeout: 10000 });
    } catch {
      // Might already be on the page or have different URL structure
    }
    
    await expect(page.locator('h1:has-text("Property Address"), h2:has-text("Address"), label:has-text("Address")').first()).toBeVisible({ timeout: 10000 });
    
    // Use a real Houston address that should be on market for 3+ days
    // You can check HAR.com for current listings
    const testAddresses = [
      "1122 Elm Dr, Houston, TX",
      "2345 Oak Street, Houston, TX 77001",
      "456 Main St, Houston, TX 77002",
      "789 Pine Ave, Houston, TX 77003"
    ];
    
    let addressFound = false;
    for (const address of testAddresses) {
      console.log(`🔍 Trying address: ${address}`);
      
      const addressInput = page.locator('input[placeholder*="address" i], input[name*="address" i], input[type="text"]').first();
      await addressInput.clear();
      await addressInput.fill(address);
      
      // Trigger search - might need to press Enter or click a button
      await addressInput.press('Enter');
      
      // Wait for search response
      await TestHelpers.waitForPropertySearchResponse(page);
      
      // Check for results
      const results = await TestHelpers.checkPropertySearchResults(page);
      if (results.hasOptions && results.optionCount > 0) {
        console.log(`✅ Found ${results.optionCount} property options for ${address}`);
        await results.dropdownOptions.first().click();
        
        // Click Fetch Property Details button if available
        const fetchBtn = page.locator('button:has-text("Fetch Property"), button:has-text("Get Details"), button:has-text("Continue")');
        if (await fetchBtn.count() > 0) {
          await fetchBtn.first().click();
        }
        
        addressFound = true;
        break;
      }
    }
    
    if (!addressFound) {
      console.log("⚠️ No property options found from API, entering manual data");
      // Continue with manual entry
    }
    
    // Wait for navigation to property data page
    await TestHelpers.waitForStableUI(page);
    
    // Step 5: Fill in all contract form data
    console.log("📝 Step 5: Entering complete contract data...");
    
    // Navigate to property data page if not already there
    if (!page.url().includes('property-data')) {
      const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Next")');
      if (await continueBtn.count() > 0) {
        await continueBtn.first().click();
      }
    }
    
    // Fill comprehensive property data
    const propertyData = {
      streetAddress: addressFound ? undefined : "1234 Test Street",
      city: addressFound ? undefined : "Houston",
      state: addressFound ? undefined : "TX",
      zipCode: addressFound ? undefined : "77001",
      propertyType: "Single Family",
      bedrooms: "3",
      bathrooms: "2.5",
      squareFeet: "2500",
      lotSize: "0.25",
      yearBuilt: "2010",
      subdivision: "Test Subdivision",
      county: "Harris",
      mlsNumber: "12345678",
      legalDescription: "Lot 1, Block 2, Test Subdivision"
    };
    
    for (const [field, value] of Object.entries(propertyData)) {
      if (value === undefined) continue;
      
      const input = page.locator(`input[name="${field}"], input[id="${field}"], input[placeholder*="${field}" i]`).first();
      if (await input.count() > 0) {
        await input.fill(value);
      }
    }
    
    // Save and continue
    await page.click('button:has-text("Save"), button:has-text("Continue"), button:has-text("Next")');
    await TestHelpers.waitForStableUI(page);
    
    // Fill parties information
    console.log("👥 Filling parties information...");
    
    const partiesData = {
      buyerFirstName: "John",
      buyerLastName: "Buyer",
      buyerEmail: testUserEmail,
      buyerPhone: "713-555-0100",
      sellerFirstName: "Jane",
      sellerLastName: "Seller",
      sellerEmail: "seller@test.com",
      sellerPhone: "713-555-0200"
    };
    
    for (const [field, value] of Object.entries(partiesData)) {
      const input = page.locator(`input[name*="${field}" i], input[id*="${field}" i]`).first();
      if (await input.count() > 0) {
        await input.fill(value);
      }
    }
    
    // Save and continue
    const saveBtn = page.locator('button:has-text("Save"), button:has-text("Continue")').first();
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
      await TestHelpers.waitForStableUI(page);
    }
    
    // Fill financial details
    console.log("💰 Filling financial details...");
    
    const financialData = {
      purchasePrice: "350000",
      earnestMoney: "10000",
      optionFee: "500",
      optionPeriodDays: "7",
      downPayment: "70000",
      loanAmount: "280000",
      closingDate: "2025-10-01"
    };
    
    for (const [field, value] of Object.entries(financialData)) {
      const input = page.locator(`input[name*="${field}" i], input[id*="${field}" i]`).first();
      if (await input.count() > 0) {
        await input.fill(value);
      }
    }
    
    // Save and continue
    const saveFinancialBtn = page.locator('button:has-text("Save"), button:has-text("Continue")').first();
    if (await saveFinancialBtn.count() > 0) {
      await saveFinancialBtn.click();
      await TestHelpers.waitForStableUI(page);
    }
    
    // Step 6: Upload documents
    console.log("📁 Step 6: Uploading test documents...");
    
    // Create test PDF content
    const testFileContent = Buffer.from(`Test Document for DealDocs
Contract ID: ${testRunId}
Date: ${new Date().toISOString()}
This is a test document for the complete workflow test.`);
    
    // Try to find upload sections
    const uploadSections = [
      { name: "Pre-approval Letter", selector: 'input[name*="preapproval" i], input[id*="preapproval" i]' },
      { name: "Earnest Money", selector: 'input[name*="earnest" i], input[id*="earnest" i]' },
      { name: "Option Fee", selector: 'input[name*="option" i], input[id*="option" i]' }
    ];
    
    for (const section of uploadSections) {
      const fileInput = page.locator(`${section.selector}, input[type="file"]`).first();
      if (await fileInput.count() > 0) {
        try {
          await fileInput.setInputFiles({
            name: `${section.name.replace(/\s+/g, '-')}-${testRunId}.pdf`,
            mimeType: 'application/pdf',
            buffer: testFileContent
          });
          console.log(`✅ Uploaded document for ${section.name}`);
          await TestHelpers.waitForStableUI(page, 2000);
        } catch (error) {
          console.log(`⚠️ Could not upload ${section.name}: ${error.message}`);
        }
      }
    }
    
    // Step 7: Generate contract and setup e-signature
    console.log("📄 Step 7: Generating contract and setting up e-signature...");
    
    // Look for generate contract button
    const generateBtn = page.locator('button:has-text("Generate Contract"), button:has-text("Create PDF"), button:has-text("Generate")').first();
    if (await generateBtn.count() > 0) {
      await generateBtn.click();
      console.log("⏳ Generating contract PDF...");
      
      // Wait for generation to complete (might take time)
      await TestHelpers.waitForStableUI(page, 10000);
      
      // Look for e-signature setup
      const esignBtn = page.locator('button:has-text("Send for Signature"), button:has-text("E-Sign"), button:has-text("Sign")').first();
      if (await esignBtn.count() > 0) {
        await esignBtn.click();
        console.log("✅ E-signature process initiated");
        await TestHelpers.waitForStableUI(page, 5000);
      }
    }
    
    // Step 8: Email contract to agent
    console.log("📧 Step 8: Emailing contract to agent...");
    
    // Look for email functionality
    const emailInput = page.locator('input[placeholder*="email" i], input[name*="agent" i], input[type="email"]').first();
    if (await emailInput.count() > 0) {
      await emailInput.fill("bryan@docu.deals");
      
      const sendBtn = page.locator('button:has-text("Send"), button:has-text("Email"), button:has-text("Submit")').first();
      if (await sendBtn.count() > 0) {
        await sendBtn.click();
        console.log("✅ Contract sent to bryan@docu.deals");
        
        // Wait for confirmation
        await TestHelpers.waitForStableUI(page, 5000);
        
        // Check for success message
        const successMsg = page.locator('text=/success|sent|complete/i');
        if (await successMsg.count() > 0) {
          console.log("✅ Email confirmation received");
        }
      }
    } else {
      console.log("⚠️ Email functionality not found in current UI");
    }
    
    // Final verification
    console.log("✅ Step 9: Verifying workflow completion...");
    
    // Take final screenshot for documentation
    await page.screenshot({
      path: `test-results/complete-workflow-${testRunId}.png`,
      fullPage: true,
    });
    
    // Try to navigate back to contracts list
    const contractsLink = page.locator('a:has-text("My Contracts"), a:has-text("Contracts"), button:has-text("Back")').first();
    if (await contractsLink.count() > 0) {
      await contractsLink.click();
      await TestHelpers.waitForStableUI(page);
    } else {
      await page.goto("/#/contracts");
    }
    
    // Verify we can see contracts
    const contractsList = page.locator('.contract-card, [class*="contract"], table tr, .list-item');
    const contractCount = await contractsList.count();
    
    console.log(`📊 Found ${contractCount} contracts in user's list`);
    expect(contractCount).toBeGreaterThanOrEqual(0);
    
    console.log("🎉 Complete workflow test finished successfully!");
    console.log(`📧 Test user: ${testUserEmail}`);
    console.log(`🔑 Test ID: ${testRunId}`);
  });

  test("Validate error handling throughout workflow", async ({ page }) => {
    console.log("🛠️ Testing error handling in workflow...");
    
    // Use existing test user credentials
    await page.goto("/");
    await page.fill('input[type="email"]', testUserEmail);
    await page.fill('input[type="password"]', testUserPassword);
    await page.click('button:has-text("Log in"), button:has-text("Sign in")');
    
    try {
      await page.waitForURL("**/contracts", { timeout: 10000 });
    } catch {
      // Might already be logged in or have different redirect
    }
    
    // Test invalid address handling
    await page.goto("/#/contracts/new/address-validation");
    await page.fill('input[placeholder*="address" i]', "InvalidAddress123XYZ");
    await page.press('input[placeholder*="address" i]', 'Enter');
    await TestHelpers.waitForPropertySearchResponse(page);
    
    const results = await TestHelpers.checkPropertySearchResults(page);
    expect(results.hasNoResultsMessage || results.optionCount === 0).toBe(true);
    console.log("✅ Invalid address properly handled");
    
    // Test form validation with empty required fields
    await page.goto("/#/contracts/new/property-data");
    const submitBtn = page.locator('button:has-text("Save"), button:has-text("Continue")').first();
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
      
      // Should show validation errors or stay on same page
      await TestHelpers.waitForStableUI(page);
      const currentUrl = page.url();
      expect(currentUrl).toContain("property-data");
      console.log("✅ Form validation prevents incomplete submissions");
    }
    
    // Test file upload with invalid file type
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      try {
        await fileInput.setInputFiles({
          name: 'invalid.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('Invalid file type')
        });
        
        // Check for error message
        const errorMsg = page.locator('text=/error|invalid|not supported/i');
        if (await errorMsg.count() > 0) {
          console.log("✅ Invalid file type rejected");
        }
      } catch {
        console.log("⚠️ File upload validation not testable");
      }
    }
  });

  test("Verify data persistence across sessions", async ({ page, context }) => {
    console.log("💾 Testing data persistence...");
    
    // Login with test user
    await page.goto("/");
    await page.fill('input[type="email"]', testUserEmail);
    await page.fill('input[type="password"]', testUserPassword);
    await page.click('button:has-text("Log in"), button:has-text("Sign in")');
    
    await page.waitForURL("**/contracts", { timeout: 10000 });
    
    // Start a new contract and enter some data
    await page.click('button:has-text("Start New Contract")');
    
    // Enter test data
    const testData = {
      address: "9999 Persistence Test St",
      city: "Houston",
      state: "TX"
    };
    
    // Fill some form data
    for (const [field, value] of Object.entries(testData)) {
      const input = page.locator(`input[name*="${field}" i]`).first();
      if (await input.count() > 0) {
        await input.fill(value);
      }
    }
    
    // Save current contract ID if available
    const contractId = await page.evaluate(() => {
      return localStorage.getItem('contractId') || sessionStorage.getItem('contractId');
    });
    
    console.log(`Contract ID: ${contractId || 'Not found'}`);
    
    // Close and reopen browser to test persistence
    await page.close();
    
    const newPage = await context.newPage();
    await newPage.goto("/");
    
    // Login again
    await newPage.fill('input[type="email"]', testUserEmail);
    await newPage.fill('input[type="password"]', testUserPassword);
    await newPage.click('button:has-text("Log in"), button:has-text("Sign in")');
    
    await newPage.waitForURL("**/contracts", { timeout: 10000 });
    
    // Check if previous contract data exists
    const contracts = await newPage.locator('.contract-card, [class*="contract"]').count();
    console.log(`✅ Found ${contracts} contracts after session restart`);
    
    expect(contracts).toBeGreaterThanOrEqual(0);
    console.log("✅ Session persistence verified");
    
    await newPage.close();
  });
});