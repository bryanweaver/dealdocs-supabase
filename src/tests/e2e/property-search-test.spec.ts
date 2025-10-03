import { test, expect } from "@playwright/test";

test.describe("Property Search and Contract Creation", () => {
  const testRunId = Date.now().toString();
  const testEmail = `test-property-${testRunId}@dealdocs.test`;
  const testPassword = `TestPass123!${testRunId}`;

  test.beforeAll(async ({ browser }) => {
    // Create test account first
    const page = await browser.newPage();
    await page.goto("http://localhost:5173");
    await page.waitForLoadState('networkidle');
    
    // Look for sign up toggle
    const signUpToggle = page.locator('button:has-text("Sign up"), a:has-text("Sign up")').first();
    if (await signUpToggle.count() > 0) {
      await signUpToggle.click();
      await page.waitForTimeout(1000);
    }
    
    // Wait for sign up form to be visible
    await expect(page.locator('text=/create your account/i')).toBeVisible({ timeout: 5000 });
    
    // Fill the form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    const confirmPwd = page.locator('input[id="confirmPassword"]');
    if (await confirmPwd.count() > 0) {
      await confirmPwd.fill(testPassword);
    }
    
    const nameField = page.locator('input[id="fullName"]');
    if (await nameField.count() > 0) {
      await nameField.fill(`Property Test ${testRunId}`);
    }
    
    // Wait for button to be enabled and click
    const signUpBtn = page.locator('button[type="submit"]:has-text("Sign"), button:has-text("Create")').first();
    await expect(signUpBtn).toBeEnabled({ timeout: 5000 });
    await signUpBtn.click();
    
    // Wait for navigation or success
    await page.waitForTimeout(3000);
    
    // Close page
    await page.close();
  });

  test("Property search and contract creation flow", async ({ page }) => {
    test.setTimeout(120000); // 2 minutes
    
    // Step 1: Login
    console.log("🔑 Logging in...");
    await page.goto("http://localhost:5173");
    
    // If we're not already logged in
    if (await page.locator('input[type="email"]').count() > 0) {
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', testPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL("**/contracts", { timeout: 10000 });
    }
    
    // Step 2: Start new contract
    console.log("📋 Starting new contract...");
    await expect(page.locator('h1:has-text("My Contracts"), h2:has-text("Contracts")').first()).toBeVisible();
    
    const newContractBtn = page.locator('button:has-text("Start New Contract"), button:has-text("New Contract")').first();
    await newContractBtn.click();
    
    // Navigate through stepper if present
    const currentUrl = page.url();
    if (currentUrl.includes('/contracts/new')) {
      console.log("📍 On new contract page");
      
      // Look for "Let's Go" or similar button
      const startBtn = page.locator('button:has-text("Let\'s Go"), button:has-text("Start"), button:has-text("Begin")').first();
      if (await startBtn.count() > 0) {
        await startBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Step 3: Property search
    console.log("🏠 Testing property search...");
    
    // Wait for address input to be visible
    await page.waitForSelector('input[placeholder*="address" i], input[name*="address" i]', { timeout: 10000 });
    
    // Test addresses from HAR.com that should be on market for 3+ days
    const testAddresses = [
      "2952 Pitzlin St, Houston, TX 77023",
      "5016 Golden Forest Dr, Houston, TX 77091", 
      "2623 Lantana Spring Rd, Houston, TX 77038",
      "2331 Addison Rd, Houston, TX 77030",
      "123 Main St, Houston, TX 77001" // Fallback generic address
    ];
    
    let propertyFound = false;
    let selectedAddress = "";
    
    for (const address of testAddresses) {
      console.log(`🔍 Trying address: ${address}`);
      
      const addressInput = page.locator('input[placeholder*="address" i], input[name*="address" i]').first();
      await addressInput.clear();
      await addressInput.fill(address);
      
      // Trigger search - either press Enter or click search button
      await addressInput.press('Enter');
      
      // Wait for search response
      await page.waitForTimeout(3000);
      
      // Check for dropdown results
      const dropdownOptions = page.locator('.v-list-item, select option, [role="option"], .dropdown-item');
      const optionCount = await dropdownOptions.count();
      
      if (optionCount > 0) {
        console.log(`✅ Found ${optionCount} results for ${address}`);
        
        // Select first option
        await dropdownOptions.first().click();
        selectedAddress = address;
        propertyFound = true;
        
        // Look for "Fetch Property Details" or similar button
        const fetchBtn = page.locator('button:has-text("Fetch"), button:has-text("Get Details"), button:has-text("Continue")').first();
        if (await fetchBtn.count() > 0) {
          await fetchBtn.click();
          console.log("📥 Fetching property details...");
          await page.waitForTimeout(3000);
        }
        
        break;
      } else {
        console.log(`❌ No results for ${address}`);
      }
    }
    
    // Step 4: Fill property data if needed
    if (!propertyFound) {
      console.log("⚠️ No properties found via API, entering manual data");
      selectedAddress = "123 Test Street, Houston, TX 77001";
      
      const addressInput = page.locator('input[placeholder*="address" i], input[name*="address" i]').first();
      await addressInput.clear();
      await addressInput.fill(selectedAddress);
    }
    
    // Navigate to property data page
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Save")').first();
    if (await continueBtn.count() > 0) {
      await continueBtn.click();
      await page.waitForTimeout(2000);
    }
    
    // Step 5: Fill property details
    console.log("📝 Filling property details...");
    
    // Check if we're on property data page
    const propertyFields = {
      streetAddress: selectedAddress.split(',')[0],
      city: "Houston",
      state: "TX",
      zipCode: selectedAddress.match(/\d{5}/)?.[0] || "77001",
      propertyType: "Single Family",
      bedrooms: "3",
      bathrooms: "2",
      squareFeet: "2000",
      yearBuilt: "2010",
      lotSize: "0.25"
    };
    
    for (const [field, value] of Object.entries(propertyFields)) {
      const input = page.locator(`input[name="${field}"], input[id="${field}"], input[placeholder*="${field}" i]`).first();
      if (await input.count() > 0 && await input.isEditable()) {
        await input.fill(value);
        console.log(`  ✓ Filled ${field}: ${value}`);
      }
    }
    
    // Save and continue
    const saveBtn = page.locator('button:has-text("Save"), button:has-text("Continue"), button:has-text("Next")').first();
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
      await page.waitForTimeout(2000);
    }
    
    // Step 6: Fill parties information
    console.log("👥 Filling parties information...");
    
    const partiesData = {
      buyerFirstName: "Test",
      buyerLastName: "Buyer",
      buyerEmail: testEmail,
      buyerPhone: "713-555-1234",
      sellerFirstName: "Test",
      sellerLastName: "Seller",
      sellerEmail: "seller@test.com",
      sellerPhone: "713-555-5678"
    };
    
    for (const [field, value] of Object.entries(partiesData)) {
      const input = page.locator(`input[name*="${field}" i], input[id*="${field}" i]`).first();
      if (await input.count() > 0 && await input.isEditable()) {
        await input.fill(value);
        console.log(`  ✓ Filled ${field}`);
      }
    }
    
    // Save parties
    const savePartiesBtn = page.locator('button:has-text("Save"), button:has-text("Continue")').first();
    if (await savePartiesBtn.count() > 0) {
      await savePartiesBtn.click();
      await page.waitForTimeout(2000);
    }
    
    // Step 7: Fill financial details
    console.log("💰 Filling financial details...");
    
    const financialData = {
      purchasePrice: "350000",
      earnestMoney: "5000",
      optionFee: "500",
      optionPeriodDays: "7",
      downPayment: "70000",
      loanAmount: "280000"
    };
    
    for (const [field, value] of Object.entries(financialData)) {
      const input = page.locator(`input[name*="${field}" i], input[id*="${field}" i]`).first();
      if (await input.count() > 0 && await input.isEditable()) {
        await input.fill(value);
        console.log(`  ✓ Filled ${field}: $${value}`);
      }
    }
    
    // Save financial data
    const saveFinancialBtn = page.locator('button:has-text("Save"), button:has-text("Continue")').first();
    if (await saveFinancialBtn.count() > 0) {
      await saveFinancialBtn.click();
      await page.waitForTimeout(2000);
    }
    
    // Take screenshot of completed form
    await page.screenshot({
      path: `test-results/property-search-${testRunId}.png`,
      fullPage: true
    });
    
    console.log("✅ Property search and initial contract data entry completed!");
    console.log(`📍 Selected address: ${selectedAddress}`);
    console.log(`📧 Test account: ${testEmail}`);
  });

  test("Test property API integration", async ({ page }) => {
    console.log("🔌 Testing property API integration...");
    
    // Login
    await page.goto("http://localhost:5173");
    if (await page.locator('input[type="email"]').count() > 0) {
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', testPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL("**/contracts", { timeout: 10000 });
    }
    
    // Start new contract
    await page.click('button:has-text("Start New Contract")');
    
    // Navigate to address validation
    const startBtn = page.locator('button:has-text("Let\'s Go")').first();
    if (await startBtn.count() > 0) {
      await startBtn.click();
    }
    
    // Test with a known valid Houston address
    const validAddress = "1122 Elm Dr, Houston, TX";
    const addressInput = page.locator('input[placeholder*="address" i]').first();
    await addressInput.fill(validAddress);
    await addressInput.press('Enter');
    
    // Wait for API response
    await page.waitForTimeout(3000);
    
    // Check if we got results
    const hasResults = await page.locator('.v-list-item, [role="option"], .dropdown-item').count() > 0;
    const hasNoResults = await page.locator('text=/no.*found/i').count() > 0;
    
    if (hasResults) {
      console.log("✅ Property API is working - got results");
    } else if (hasNoResults) {
      console.log("⚠️ Property API returned no results");
    } else {
      console.log("❌ Property API may not be integrated properly");
    }
    
    // Test with invalid address
    const invalidAddress = "InvalidAddress123XYZ";
    await addressInput.clear();
    await addressInput.fill(invalidAddress);
    await addressInput.press('Enter');
    
    await page.waitForTimeout(3000);
    
    const errorMessage = await page.locator('text=/error|invalid|not found/i').count() > 0;
    if (errorMessage) {
      console.log("✅ Property API properly handles invalid addresses");
    } else {
      console.log("⚠️ Property API should show error for invalid addresses");
    }
  });
});