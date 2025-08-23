import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "./world.js";

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
  await this.page.fill('input[name="password"]', PASSWORD);
});

When("I click the login button", async function (this: CustomWorld) {
  await this.page.click('button:has-text("Log in")');
});

Then("I should see the contract listing", async function (this: CustomWorld) {
  await expect(this.page.locator("text=Contracts:")).toBeVisible();
});
