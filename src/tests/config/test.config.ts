/**
 * Test environment configuration
 */

export interface TestConfig {
  // API Configuration
  smartyStreetsApiUrl?: string;
  smartyStreetsApiKey?: string;
  apiTimeout: number;

  // Test Data
  useRealAddresses: boolean;
  fallbackAddresses: string[];

  // UI Configuration
  defaultTimeout: number;
  navigationTimeout: number;

  // Authentication
  testUser?: string;
  testPassword?: string;

  // Visual Regression
  visualThreshold: number;
  maxDiffPixels: number;

  // Environment
  environment: "test" | "staging" | "production";
  baseUrl: string;
}

const testConfig: TestConfig = {
  // API Configuration
  smartyStreetsApiUrl:
    process.env.SMARTY_STREETS_API_URL || "https://api.smartystreets.com",
  smartyStreetsApiKey: process.env.SMARTY_STREETS_API_KEY,
  apiTimeout: 10000,

  // Test Data
  useRealAddresses: process.env.USE_REAL_ADDRESSES === "true",
  fallbackAddresses: [
    "1 Rosedale", // Known working address from systematic tests
    "123 Main St, Houston, TX",
    "456 Oak Ave, Dallas, TX",
  ],

  // UI Configuration
  defaultTimeout: 15000,
  navigationTimeout: 30000,

  // Authentication
  testUser: process.env.VITE_BDD_USER,
  testPassword: process.env.VITE_BDD_PASS,

  // Visual Regression
  visualThreshold: 0.1,
  maxDiffPixels: 1000,

  // Environment
  environment:
    (process.env.NODE_ENV as "test" | "staging" | "production") || "test",
  baseUrl: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173",
};

export default testConfig;
