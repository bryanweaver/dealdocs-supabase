# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DealDocs is a Vue 3 + Supabase application for real estate contract management. It enables users to create, manage, and digitally sign real estate contracts with automated PDF generation and email delivery to listing agents.

## Development Commands

### Core Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Testing Commands

- `npm run test` - Run unit tests with Vitest (25 tests, coverage tracking)
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:playwright` - Run end-to-end tests with Playwright (multi-browser, visual regression)
- `npm run bdd` - Run all BDD/Cucumber tests
- `npm run test:login` - Run login-specific BDD tests
- `npm run test:property-search` - Run property search BDD tests
- `npm run test:systematic` - Run systematic testing with 10 real addresses
- `npm run test:systematic:3` - Run with 3 addresses (quick test)
- `npm run test:systematic:all` - Run with up to 50 addresses (comprehensive)

### Specialized Commands

- `npm run tailwind` - Watch and compile Tailwind CSS
- `npm run generate-state` - Generate initial Vuex state
- `npm run compile-gql` - Compile GraphQL schema with Amplify
- `npm run playwright:mcp` - Start Playwright MCP server
- `npm run scrape:addresses` - Run address scraping utility

## Project Architecture

### Frontend Architecture

- **Vue 3 + Composition API**: Modern Vue.js with `<script setup>` syntax
- **Vuex Store**: Centralized state management with persistence
- **Vue Router**: Hash-based routing with authentication guards
- **PrimeVue**: UI component library with Aura theme
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Build tool and development server

### Backend Architecture (Supabase)

- **PostgreSQL Database**: Main database with RLS (Row Level Security)
- **Supabase Auth**: User authentication and authorization
- **Edge Functions**: PDF processing (Anvil API), email delivery, agent search
- **Storage Buckets**: Document storage for contracts and supporting files
- **Realtime Subscriptions**: Live updates for contract status changes
- **Email Service**: Resend API for contract notifications

### State Management Structure

The Vuex store manages complex form data across multiple sections:

- **Property Information**: Address, MLS details, property characteristics
- **Parties**: Buyer/seller information with secondary party support
- **Financial Details**: Loan types, terms, pricing, appraisal info
- **Title & Closing**: Title company, earnest money, option fees
- **Legal Sections**: Leases, addendums, attorney information
- **Progress Tracking**: Section completion status, required fields validation

### Key Data Flow

1. **Contract Creation**: User creates contract → Vuex state → Supabase insert → PostgreSQL
2. **PDF Generation**: Form data → Anvil API → PDF stored in Supabase Storage
3. **E-Signature**: PDF → Anvil Etch → EtchPacket tracking → Status updates
4. **Email Delivery**: Contract package → Resend API → Listing agent notification

## Important Configuration

### File Structure

- `/src/config/TX/` - Texas-specific form configurations and field mappings
- `/src/components/` - Reusable Vue components
- `/src/views/` - Page-level components
- `/src/store/store.ts` - Vuex store with form state management
- `/src/utils/` - Utility functions for validation, date handling, etc.
- `/src/tests/` - BDD tests using Cucumber and Playwright

### Testing Architecture (COMPREHENSIVE)

- **Unit Tests**: Vitest with Vue Test Utils, 25 tests passing, 0.74% coverage baseline
- **BDD Tests**: Cucumber.js with TypeScript step definitions for user workflows
- **E2E Tests**: Playwright with multi-browser support (Chromium, Firefox, WebKit)
- **Systematic Tests**: Advanced property search testing with real Texas addresses
- **Visual Regression**: Screenshot comparison testing across viewports
- **Accessibility Tests**: WCAG compliance verification
- **Real Address Database**: Scraped Texas addresses with quality metrics tracking
- **Test Results Analysis**: Detailed JSON reporting with content quality scoring

### Form Configuration System

The application uses a sophisticated form configuration system in `/src/config/TX/`:

- Each contract section has its own configuration file
- Dynamic field dependencies and validation rules
- Required fields determined by question configuration
- Progress tracking based on completion of required fields

### Supabase Integration

- **Database Schema**: PostgreSQL tables defined in `/supabase/migrations/`
- **Edge Functions**: Serverless functions in `/supabase/functions/`
- **Storage Buckets**: Contract documents and supporting files
- **RLS Policies**: Row-level security for data protection

## Development Best Practices

### Clean Development Practices

- **IMPORTANT**: Always clean up temporary files after completing features or fixes
- Remove any temporary markdown files, analysis documents, or development artifacts
- Do not commit temporary documentation files unless they are permanent project docs
- Keep the repository clean and focused on production code

### State Management

- Use Vuex store for all form data and application state
- Maintain form data persistence with session storage
- Update progress tracking when fields are completed
- Handle marked questions for fields that should be skipped

### Component Development

- Follow Vue 3 Composition API patterns
- Use PrimeVue components for consistency
- Implement proper TypeScript typing
- Handle loading states and error conditions

### Testing Guidelines

- **Unit Tests**: Run `npm run test` for quick feedback (25 tests, ~10s)
- **BDD Tests**: Use `npm run bdd` for user workflow validation
- **E2E Tests**: Run `npm run test:playwright` for cross-browser testing
- **Systematic Tests**: Use `npm run test:systematic:3` for quick property validation
- **Comprehensive Tests**: Use `npm run test:systematic` for quality analysis
- **Visual Tests**: Playwright automatically captures screenshots on failures
- **Test Data**: Systematic tests use real Texas address database with quality metrics
- **Results Analysis**: Check `src/tests/data/test-results.json` for detailed reports

### Supabase Development

- Run `supabase db push` to apply migrations
- Test Edge Functions locally with `supabase functions serve`
- Monitor database usage in Supabase dashboard
- Use RLS policies for secure data access

## Test Infrastructure Status 🎯

### Current Test Health: 8.5/10 ✅

- **Unit Tests**: ✅ 25 tests passing, proper mocking setup
- **Playwright E2E**: ✅ Multi-browser testing with authentication
- **BDD/Cucumber**: ✅ Sophisticated user workflow testing
- **Systematic Testing**: ✅ Real address validation with quality metrics
- **Visual Regression**: ✅ Screenshot comparison across browsers
- **Accessibility**: ✅ WCAG compliance testing

### Test Files Overview

- `src/__tests__/` - Unit test files with fixtures and mocks
- `src/tests/*.feature` - BDD scenario files for user workflows
- `src/tests/*.spec.ts` - Playwright test files for E2E testing
- `src/tests/steps/` - Cucumber step definitions with real address testing
- `src/tests/runners/` - Systematic test automation with quality analysis
- `src/tests/data/` - Real address database and test results storage

### Quick Test Commands for Development

```bash
npm run test                    # Unit tests (fast, 10s)
npm run test:systematic:3       # Quick property validation (3 addresses)
npm run test:playwright         # Cross-browser E2E tests
npm run bdd                     # User workflow validation
```

For comprehensive analysis, see `TEST_INFRASTRUCTURE_ANALYSIS.md` and `TEST_FIXES_SUMMARY.md`.
