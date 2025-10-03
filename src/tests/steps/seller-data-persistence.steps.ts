import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "./world";

Given("I am on the form page for a new contract", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Page not initialized");

  // Navigate to contracts page first
  await this.page.goto("http://localhost:5173/#/contracts");
  await this.page.waitForLoadState("networkidle");

  // Click "New Contract" button
  const newContractButton = this.page.locator('button:has-text("New Contract")');
  await newContractButton.click();
  await this.page.waitForLoadState("networkidle");

  console.log("✅ Navigated to form page for new contract");
});

When("I fill in the seller information:", async function (this: CustomWorld, dataTable) {
  if (!this.page) throw new Error("Page not initialized");

  const data = dataTable.rowsHash();

  // Navigate to Parties section if not already there
  const partiesTab = this.page.locator('button:has-text("Parties")');
  if (await partiesTab.isVisible()) {
    await partiesTab.click();
    await this.page.waitForTimeout(500);
  }

  // Fill in seller information
  for (const [field, value] of Object.entries(data)) {
    console.log(`Filling ${field} with "${value}"`);

    let selector: string;
    switch (field) {
      case "sellerFirstName":
        selector = 'input[id*="seller"][id*="first" i], input[name*="seller"][name*="first" i], input[placeholder*="First Name"]';
        break;
      case "sellerLastName":
        selector = 'input[id*="seller"][id*="last" i], input[name*="seller"][name*="last" i], input[placeholder*="Last Name"]';
        break;
      case "sellerEmail":
        selector = 'input[id*="seller"][id*="email" i], input[name*="seller"][name*="email" i], input[type="email"]';
        break;
      case "sellerPhone":
        selector = 'input[id*="seller"][id*="phone" i], input[name*="seller"][name*="phone" i], input[type="tel"]';
        break;
      default:
        selector = `input[name="${field}"], input[id="${field}"]`;
    }

    const input = this.page.locator(selector).first();
    await input.waitFor({ state: "visible", timeout: 5000 });
    await input.clear();
    await input.fill(value as string);

    console.log(`✅ Filled ${field}`);
  }

  // Store the data for later verification
  (this as any).sellerData = data;

  console.log("✅ Seller information filled");
});

When("I save the form", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Page not initialized");

  // Look for save button
  const saveButton = this.page.locator('button:has-text("Save"), button:has-text("Save Contract")').first();

  if (await saveButton.isVisible()) {
    await saveButton.click();
    await this.page.waitForTimeout(2000); // Wait for save to complete
    console.log("✅ Clicked save button");
  } else {
    console.log("⚠️ No explicit save button found, data should auto-save");
  }
});

When("I navigate to the contracts page", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Page not initialized");

  await this.page.goto("http://localhost:5173/#/contracts");
  await this.page.waitForLoadState("networkidle");

  console.log("✅ Navigated to contracts page");
});

When("I navigate back to the form page", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Page not initialized");

  // Click on the first contract in the list to open it
  const firstContract = this.page.locator('tr[role="row"]').first();
  await firstContract.click();
  await this.page.waitForLoadState("networkidle");

  // Navigate to Parties section
  const partiesTab = this.page.locator('button:has-text("Parties")');
  if (await partiesTab.isVisible()) {
    await partiesTab.click();
    await this.page.waitForTimeout(500);
  }

  console.log("✅ Navigated back to form page");
});

Then("the seller information should be preserved:", async function (this: CustomWorld, dataTable) {
  if (!this.page) throw new Error("Page not initialized");

  const expectedData = dataTable.rowsHash();

  // Wait for form to load
  await this.page.waitForTimeout(1000);

  // Verify each field
  for (const [field, expectedValue] of Object.entries(expectedData)) {
    console.log(`Verifying ${field} = "${expectedValue}"`);

    let selector: string;
    switch (field) {
      case "sellerFirstName":
        selector = 'input[id*="seller"][id*="first" i], input[name*="seller"][name*="first" i], input[placeholder*="First Name"]';
        break;
      case "sellerLastName":
        selector = 'input[id*="seller"][id*="last" i], input[name*="seller"][name*="last" i], input[placeholder*="Last Name"]';
        break;
      case "sellerEmail":
        selector = 'input[id*="seller"][id*="email" i], input[name*="seller"][name*="email" i], input[type="email"]';
        break;
      case "sellerPhone":
        selector = 'input[id*="seller"][id*="phone" i], input[name*="seller"][name*="phone" i], input[type="tel"]';
        break;
      default:
        selector = `input[name="${field}"], input[id="${field}"]`;
    }

    const input = this.page.locator(selector).first();
    await input.waitFor({ state: "visible", timeout: 5000 });

    const actualValue = await input.inputValue();

    expect(actualValue).toBe(expectedValue);
    console.log(`✅ ${field} preserved: "${actualValue}"`);
  }

  console.log("✅ All seller information preserved correctly");
});
