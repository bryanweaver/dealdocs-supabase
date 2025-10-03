/**
 * Global teardown for Playwright tests
 * Runs once after all tests complete
 */
import { FullConfig } from "@playwright/test";
import fs from "fs";
import path from "path";
import { cleanupTestUsers } from "./test-users";

async function globalTeardown(config: FullConfig) {
  console.log("🧹 Running global teardown...");

  // Clean up all test users created during the test run
  try {
    await cleanupTestUsers();
  } catch (error) {
    console.warn("⚠️ Failed to clean up test users:", error.message);
  }

  // Clean up authentication files if they exist
  const authFile = "playwright/.auth/user.json";
  if (fs.existsSync(authFile)) {
    try {
      fs.unlinkSync(authFile);
      console.log("✅ Cleaned up authentication state");
    } catch (error) {
      console.warn(
        "⚠️ Failed to clean up authentication state:",
        error.message,
      );
    }
  }

  // Generate test summary
  try {
    await generateTestSummary();
  } catch (error) {
    console.warn("⚠️ Failed to generate test summary:", error.message);
  }

  // Clean up temporary test data if needed
  if (process.env.CLEANUP_TEST_DATA === "true") {
    console.log("🗑️ Cleaning up test data...");
    // Add cleanup logic here
  }

  // Archive old test results if configured
  if (process.env.ARCHIVE_TEST_RESULTS === "true") {
    try {
      await archiveTestResults();
    } catch (error) {
      console.warn("⚠️ Failed to archive test results:", error.message);
    }
  }

  console.log("✅ Global teardown completed");
}

async function generateTestSummary() {
  const resultsDir = "test-results";
  if (!fs.existsSync(resultsDir)) {
    return;
  }

  const summary = {
    timestamp: new Date().toISOString(),
    testRun: {
      startTime: process.env.TEST_START_TIME || new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration:
        Date.now() -
        (parseInt(process.env.TEST_START_TIME_MS || "0") || Date.now()),
    },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      ci: !!process.env.CI,
      baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173",
    },
    files: [],
  };

  // List all files in test results directory
  try {
    const files = fs.readdirSync(resultsDir, { recursive: true });
    summary.files = files.filter(
      (file) =>
        typeof file === "string" &&
        (file.endsWith(".json") ||
          file.endsWith(".xml") ||
          file.endsWith(".html")),
    );
  } catch (error) {
    console.warn("Failed to read test results directory:", error.message);
  }

  // Write summary file
  const summaryPath = path.join(resultsDir, "test-summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`📊 Test summary written to ${summaryPath}`);
}

async function archiveTestResults() {
  const resultsDir = "test-results";
  const archiveDir = "test-archive";
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const archivePath = path.join(archiveDir, `test-results-${timestamp}`);

  if (!fs.existsSync(resultsDir)) {
    return;
  }

  // Create archive directory
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  // Copy results to archive
  try {
    const copyRecursive = (src: string, dest: string) => {
      if (fs.statSync(src).isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach((item) => {
          copyRecursive(path.join(src, item), path.join(dest, item));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    };

    copyRecursive(resultsDir, archivePath);
    console.log(`📦 Test results archived to ${archivePath}`);

    // Keep only the last 10 archives
    const archives = fs
      .readdirSync(archiveDir)
      .filter((name) => name.startsWith("test-results-"))
      .sort()
      .reverse();

    if (archives.length > 10) {
      const oldArchives = archives.slice(10);
      oldArchives.forEach((archive) => {
        const archivePath = path.join(archiveDir, archive);
        fs.rmSync(archivePath, { recursive: true, force: true });
        console.log(`🗑️ Removed old archive: ${archive}`);
      });
    }
  } catch (error) {
    console.warn("Failed to archive test results:", error.message);
  }
}

export default globalTeardown;
