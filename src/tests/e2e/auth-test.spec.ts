import { test, expect } from "@playwright/test";
import { signupTestUser, loginTestUser, logoutUser } from "../utils/auth-helper";
import { trackTestUser } from "../utils/test-users";

test.describe("Authentication Flow", () => {

  test("Sign up and login flow", async ({ page }) => {
    // Create a new test user via signup
    const testUser = await signupTestUser(page);
    console.log(`✅ Created test user: ${testUser.email}`);
    
    // Verify we're on contracts page
    await expect(page).toHaveURL(/.*contracts/);
    await expect(page.locator('h1:has-text("My Contracts"), h2:has-text("Contracts")').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Start New Contract"), button:has-text("New Contract")').first()).toBeVisible();
    
    // Test logout
    await logoutUser(page);
    // Verify we're back on the auth page
    await expect(page.locator('text="Sign in to your account"')).toBeVisible({ timeout: 10000 });
    
    // Test login with existing account
    await loginTestUser(page, testUser);
    
    // Verify we're logged in
    await expect(page).toHaveURL(/.*contracts/);
    await expect(page.locator('h1:has-text("My Contracts"), h2:has-text("Contracts")').first()).toBeVisible();
    
    console.log("✅ All authentication tests passed!");
  });
});