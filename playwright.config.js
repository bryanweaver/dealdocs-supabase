"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
/**
 * @see https://playwright.dev/docs/test-configuration
 */
exports.default = (0, test_1.defineConfig)({
    testDir: "./src/tests",
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ["html"],
        ["json", { outputFile: "test-results/playwright-report.json" }],
        ["junit", { outputFile: "test-results/playwright-results.xml" }],
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173",
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
        /* Take screenshot on failure */
        screenshot: "only-on-failure",
        /* Record video on failure */
        video: "retain-on-failure",
        /* Global timeout for each action */
        actionTimeout: 10000,
        /* Global timeout for each navigation */
        navigationTimeout: 30000,
    },
    /* Configure projects for major browsers */
    projects: [
        {
            name: "chromium",
            use: { ...test_1.devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...test_1.devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...test_1.devices["Desktop Safari"] },
        },
        /* Test against mobile viewports. */
        {
            name: "Mobile Chrome",
            use: { ...test_1.devices["Pixel 5"] },
        },
        {
            name: "Mobile Safari",
            use: { ...test_1.devices["iPhone 12"] },
        },
        /* Test against branded browsers. */
        {
            name: "Microsoft Edge",
            use: { ...test_1.devices["Desktop Edge"], channel: "msedge" },
        },
        {
            name: "Google Chrome",
            use: { ...test_1.devices["Desktop Chrome"], channel: "chrome" },
        },
    ],
    /* Run your local dev server before starting the tests */
    webServer: {
        command: "npm run dev",
        url: "http://localhost:5173",
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
    /* Global setup */
    globalSetup: "./src/tests/utils/global-setup.ts",
    /* Global teardown */
    globalTeardown: "./src/tests/utils/global-teardown.ts",
    /* Test timeout */
    timeout: 30000,
    /* Expect timeout */
    expect: {
        timeout: 5000,
    },
    /* Output directory for test results */
    outputDir: "test-results/",
    /* Maximum number of test failures for the whole test suite run */
    maxFailures: process.env.CI ? 10 : undefined,
});
