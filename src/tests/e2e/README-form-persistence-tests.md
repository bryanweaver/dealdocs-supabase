# Form Data Persistence E2E Tests

This directory contains comprehensive End-to-End tests for form data persistence in the DealDocs application. These tests ensure that all form data is properly saved, persisted, and retrieved across different scenarios.

## Test Files Overview

### 1. `form-data-persistence.spec.ts`
**Primary comprehensive test suite covering all major form sections**

- ✅ Property section data persistence
- ✅ Buyers section data persistence
- ✅ Finance section data persistence
- ✅ Listing Agent section (including boolean `hasListingAgentInfo` field)
- ✅ Title section data persistence
- ✅ Page refresh data persistence
- ✅ Contract re-selection from listing
- ✅ Boolean fields across all sections
- ✅ Complete workflow with navigation between sections

**Key Features:**
- Tests ALL major form sections
- Validates boolean field handling
- Tests navigation between sections
- Verifies page refresh persistence
- Tests contract listing re-selection
- Comprehensive coverage of form fields

### 2. `data-persistence-edge-cases.spec.ts`
**Specialized tests for edge cases and boundary conditions**

- ✅ Empty string vs null field handling
- ✅ Special characters and Unicode persistence
- ✅ Large text data persistence
- ✅ Numeric field boundary values
- ✅ Date field edge cases
- ✅ Boolean field state transitions
- ✅ Session storage vs server persistence consistency
- ✅ Rapid form navigation data integrity
- ✅ Form validation with persistence

**Key Features:**
- Tests special characters (Unicode, symbols)
- Validates large text blocks
- Tests boundary numeric values
- Verifies date field handling
- Tests rapid navigation scenarios
- Validates session vs server persistence

### 3. `comprehensive-form-persistence.spec.ts`
**Structured comprehensive test suite using helper utilities**

- ✅ Complete contract form persistence workflow
- ✅ Section-by-section persistence validation
- ✅ Boolean field persistence across sections
- ✅ Large form data and special characters
- ✅ Concurrent section editing simulation

**Key Features:**
- Uses shared helper utilities for consistency
- Structured approach to testing
- Comprehensive workflow validation
- Simulates real user behavior patterns
- Detailed logging and reporting

### 4. `utils/form-persistence-helpers.ts`
**Shared utility functions for test consistency**

- 🔧 User creation and login helpers
- 🔧 Contract creation utilities
- 🔧 Form field filling strategies
- 🔧 Data verification functions
- 🔧 Navigation helpers
- 🔧 Test data factories
- 🔧 Debug utilities

## Running the Tests

### Quick Test Commands

```bash
# Run basic form persistence tests
npm run test:persistence

# Run with browser visible (headed mode)
npm run test:persistence:headed

# Run in debug mode (step through tests)
npm run test:persistence:debug

# Run edge case tests
npm run test:persistence:edge-cases

# Run comprehensive structured tests
npm run test:persistence:comprehensive
npm run test:persistence:comprehensive:headed

# Run ALL persistence tests
npm run test:persistence:all
```

### Individual Test Commands

```bash
# Run specific test file
npx playwright test src/tests/e2e/form-data-persistence.spec.ts --project=chromium

# Run with specific browser
npx playwright test src/tests/e2e/form-data-persistence.spec.ts --project=firefox

# Run single test within file
npx playwright test -g "Property section data persistence" --project=chromium

# Run with full browser visibility
npx playwright test src/tests/e2e/form-data-persistence.spec.ts --project=chromium --headed

# Run in debug mode
npx playwright test src/tests/e2e/form-data-persistence.spec.ts --project=chromium --debug
```

### Test Reporting

```bash
# Generate HTML report
npm run test:report:html

# Show interactive report
npm run test:report

# Generate JSON report
npm run test:report:json
```

## What These Tests Validate

### ✅ Core Form Data Persistence

1. **Section Navigation**: Data saves when clicking "Next Section"
2. **Back Navigation**: Data persists when navigating back to previous sections
3. **Page Refresh**: Data persists after browser refresh
4. **Contract Re-selection**: Data loads when selecting contract from listing
5. **Boolean Fields**: Yes/No fields save correctly across all sections
6. **All Form Sections**: Every major contract section is tested

### ✅ Tested Form Sections

- **Property Information**: Address, MLS, property characteristics
- **Buyers**: Primary/secondary buyer information
- **Sellers**: Primary/secondary seller information
- **Finance**: Loan details, amounts, terms
- **Listing Agent**: Agent info (especially `hasListingAgentInfo` boolean)
- **Title & Closing**: Title company, earnest money, option fees
- **HOA**: Homeowners association details
- **Leases**: Residential, fixture, and mineral leases
- **Survey**: Survey requirements and timelines
- **Property Condition**: Disclosures and repairs
- **Closing**: Closing date and details
- **Possession**: Possession terms
- **Legal Sections**: Attorney information, notices

### ✅ Data Types Tested

- **Text Fields**: Short and long text inputs
- **Numeric Fields**: Currency, percentages, integers
- **Boolean Fields**: Yes/No selections, checkboxes
- **Date Fields**: Date inputs and validation
- **Select Fields**: Dropdown selections
- **Special Characters**: Unicode, symbols, formatting

### ✅ Persistence Scenarios

1. **Immediate Persistence**: Data saves immediately after entry
2. **Navigation Persistence**: Data persists when navigating between sections
3. **Session Persistence**: Data persists within user session
4. **Page Refresh**: Data survives browser refresh
5. **Contract Re-selection**: Data loads when re-opening contract
6. **Server Persistence**: Data persists after session storage clear
7. **Rapid Navigation**: Data integrity during quick section changes

## Test Architecture

### User Flow Pattern
```
1. Create test user account
2. Login to application
3. Create new contract
4. Fill form section with test data
5. Navigate to different section
6. Return to original section
7. Verify data persisted
8. Test additional scenarios (refresh, re-selection, etc.)
```

### Data Verification Strategy
```
- Fill fields using multiple selector strategies
- Wait for auto-save mechanisms
- Navigate away from section
- Return to section
- Compare actual vs expected values
- Log results for debugging
- Take screenshots on failures
```

### Test Data Management
```
- Generate unique test data per run
- Use consistent data patterns
- Include edge cases and boundary values
- Test special characters and Unicode
- Validate large text blocks
```

## Development and Debugging

### Test Development Guidelines

1. **Use Helper Utilities**: Leverage shared helpers for consistency
2. **Comprehensive Selectors**: Test multiple ways to find form fields
3. **Wait Strategies**: Allow time for auto-save and navigation
4. **Error Handling**: Gracefully handle missing fields
5. **Logging**: Provide detailed console output for debugging
6. **Screenshots**: Capture debug images for failures

### Common Issues and Solutions

**Field Not Found**
- Add additional selector strategies
- Check for dynamic field generation
- Verify section is fully loaded

**Data Not Persisting**
- Increase wait times for auto-save
- Check session storage vs server persistence
- Verify form validation rules

**Boolean Fields Not Working**
- Test both button and input approaches
- Check for active state indicators
- Verify field naming conventions

### Test Environment Setup

1. **Prerequisites**: Playwright, test environment running
2. **Configuration**: Uses existing `playwright.config.ts`
3. **Auto-setup**: Tests create their own users and data
4. **Cleanup**: Each test uses unique identifiers

## Coverage Statistics

The test suite provides comprehensive coverage:

- **📊 Test Files**: 3 main test files + utilities
- **📊 Form Sections**: 13+ major contract sections tested
- **📊 Field Types**: Text, numeric, boolean, date, select fields
- **📊 Scenarios**: 8+ persistence scenarios per section
- **📊 Edge Cases**: Special characters, large data, rapid navigation
- **📊 Browser Coverage**: Chromium, Firefox, WebKit support

## Integration with CI/CD

These tests are designed to run in automated environments:

- **Headless Mode**: Default for CI/CD pipelines
- **Parallel Execution**: Tests can run in parallel
- **Artifact Collection**: Screenshots and videos on failure
- **Reporting**: JSON/HTML reports for analysis
- **Timeout Handling**: Appropriate timeouts for each scenario

Run in CI with:
```bash
npm run test:persistence:all
```

## Maintenance and Updates

When adding new form sections or fields:

1. **Update Test Data**: Add new fields to `generateTestData()`
2. **Add Selectors**: Include field selectors in helper functions
3. **Update Sections**: Add new sections to comprehensive tests
4. **Verify Coverage**: Ensure new fields are tested
5. **Update Documentation**: Keep this README current