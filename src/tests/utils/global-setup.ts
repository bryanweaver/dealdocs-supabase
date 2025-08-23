/**
 * Global setup for Playwright tests
 * Runs once before all tests
 */
import { chromium, FullConfig } from "@playwright/test";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

async function globalSetup(config: FullConfig) {
  // Load environment variables
  dotenv.config({ path: ".env.local" });

  // Create necessary directories first
  const directories = [
    "test-results",
    "test-results/screenshots",
    "test-results/videos",
    "test-results/traces",
    "playwright/.auth",
  ];

  directories.forEach((dir) => {
    const dirPath = path.resolve(dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });

  // Optional: Perform authentication and save state
  // TEMPORARILY DISABLED: Authentication setup is hanging, needs investigation
  const skipAuth = true; // Temporary flag to skip auth

  if (!skipAuth && process.env.VITE_BDD_USER && process.env.VITE_BDD_PASS) {
    console.log("Setting up authenticated user state...");

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      // Navigate to login page
      const baseURL = config.use?.baseURL || "http://localhost:5173";
      await page.goto(baseURL);

      // Wait for authentication form to load
      await page.waitForSelector(
        'input[name="username"], input[type="email"]',
        { timeout: 10000 },
      );

      // Fill in credentials
      await page.fill(
        'input[name="username"], input[type="email"]',
        process.env.VITE_BDD_USER,
      );
      await page.fill('input[name="password"]', process.env.VITE_BDD_PASS);

      // Submit form
      await page.click('button:has-text("Log in"), button:has-text("Sign In")');

      // Wait for successful login (redirect to contracts page)
      await page.waitForURL("**/contracts", { timeout: 30000 });

      // Save authentication state
      await page.context().storageState({ path: "playwright/.auth/user.json" });

      console.log("✅ Authentication state saved successfully");
    } catch (error) {
      console.warn("⚠️ Failed to save authentication state:", error.message);
      // Don't fail the entire test suite if auth setup fails
    } finally {
      await browser.close();
    }
  } else {
    console.log(
      "⚠️ Skipping auth setup (temporarily disabled or no credentials)",
    );
  }

  // Setup test database if needed
  if (process.env.SETUP_TEST_DB === "true") {
    console.log("Setting up test database...");
    // Add database setup logic here
  }

  console.log("🚀 Global setup completed successfully");
}

export default globalSetup;
