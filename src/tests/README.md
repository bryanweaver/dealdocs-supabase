# BDD Testing Framework

This directory contains the Behavior-Driven Development (BDD) tests for the DealDocs application.

## Structure

- **Feature files** (in this directory) - BDD feature files written in Gherkin syntax
  - `login.feature` - Basic login functionality
  - `property-search.feature` - Simple property search test
  - `systematic-property-search.feature` - Template for systematic testing
  - `systematic-generated.feature` - Auto-generated feature file for systematic testing
- `steps/` - Step definitions implementing the feature scenarios
  - `login.steps.ts` - Login step implementations
  - `property-search.steps.ts` - Property search and systematic testing steps
  - `hooks.ts` - Before/After hooks for test setup/teardown
  - `world.ts` - Custom world context for sharing state between steps
- `runners/` - Test runners and utilities
  - `systematic-test-runner.js` - Generates and runs systematic tests with real addresses
- `utils/` - Testing utilities
  - `address-manager.js` - Manages real address scraping and storage
  - `redfin-scraper.js` - Scrapes real addresses from Redfin
- `data/` - Test data and results
  - `real-addresses-db.json` - Database of scraped real addresses
  - `test-results.json` - Test execution results

## Running Tests

### Basic BDD Tests

```bash
# Run all BDD tests
npm run bdd

# Run specific feature tests
npm run test:login
npm run test:property-search
```

### Systematic Testing with Real Addresses

The systematic testing framework uses real addresses scraped from Redfin to test the property search functionality.

```bash
# Scrape new addresses (if needed)
npm run scrape:addresses

# Run systematic tests
npm run test:systematic:3    # Test with 3 addresses
npm run test:systematic:10   # Test with 10 addresses
npm run test:systematic:all  # Test with up to 50 addresses
npm run test:systematic      # Default: 10 addresses
```

### How Systematic Testing Works

1. **Address Input**: Uses house number + first word of street name (e.g., "1440 Waseca")
2. **Dropdown Selection**: Automatically finds and selects the matching address from dropdown
3. **Navigation**: Clicks "Fetch Property Details" button to proceed
4. **Validation**: Confirms reaching the Property Details page
5. **Results**: Records test results including any errors or issues

### Test Data

Real addresses are stored in `data/real-addresses-db.json` with the following structure:

```json
{
  "addresses": [
    {
      "id": "1440-1750116659887-0",
      "address": "1440 Waseca St, Houston",
      "houseNumber": "1440",
      "source": "Redfin",
      "tested": false,
      "testResults": []
    }
  ]
}
```

The systematic test runner tracks which addresses have been tested to avoid duplicates.
