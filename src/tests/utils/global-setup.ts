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

  // Note: Authentication is handled per-test
  // Each test creates its own test user via the signup flow
  // and cleans up after itself in the teardown
  console.log(
    "ℹ️ Authentication will be handled per-test with dynamic user creation",
  );

  // Setup test database if needed
  if (process.env.SETUP_TEST_DB === "true") {
    console.log("Setting up test database...");
    // Add database setup logic here
  }

  console.log("🚀 Global setup completed successfully");
}

export default globalSetup;
