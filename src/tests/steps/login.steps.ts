import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "./world";

const LOGIN_URL = process.env.VITE_LOGIN_URL || "http://localhost:5173/login";
const USERNAME = process.env.VITE_BDD_USER;
const PASSWORD = process.env.VITE_BDD_PASS;

if (!USERNAME || !PASSWORD) {
  throw new Error("VITE_BDD_USER or VITE_BDD_PASS is not set in .env.local");
}

Given("I navigate to the login page", async function (this: CustomWorld) {
  await this.page.goto(LOGIN_URL);
});

When("I enter my username", async function (this: CustomWorld) {
  await this.page.fill('input[name="username"], input[type="email"]', USERNAME);
});

When("I enter my password", async function (this: CustomWorld) {
  await this.page.fill('input[id="password"], input[type="password"]', PASSWORD);
});

When("I click the login button", async function (this: CustomWorld) {
  // Enable console logging
  this.page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  await this.page.click('button:has-text("Sign In"), button[type="submit"]');

  // Give time for login to process and check for errors
  await this.page.waitForTimeout(5000);

  // Check if there's an error message
  const errorMessage = await this.page.locator('.p-message-error, [severity="error"]').textContent().catch(() => null);
  if (errorMessage) {
    console.log('Login error message:', errorMessage);
  }
});

Then("I should see the contract listing", async function (this: CustomWorld) {
  // Wait for My Contracts heading or error message
  try {
    await this.page.waitForSelector("h1:has-text('My Contracts')", { timeout: 30000 });
  } catch (e) {
    // Log current URL and page content for debugging
    console.log(`Current URL: ${this.page.url()}`);
    console.log(`Page title: ${await this.page.title()}`);
    throw e;
  }
  await expect(this.page.locator("h1:has-text('My Contracts')")).toBeVisible();
});
