# Security Audit Report - DealDocs

Date: 2025-07-21

## Executive Summary

This security audit identified several critical vulnerabilities in the DealDocs codebase that require immediate attention. The most severe issues include exposed API keys, hardcoded credentials, insufficient access controls, and overly permissive CORS policies.

## Critical Vulnerabilities (High Priority)

### 1. Exposed API Keys and Secrets in .env.local

**Severity: CRITICAL**
**File:** `.env.local`

Multiple API keys and sensitive credentials are exposed:

- `VITE_SMARTY_EMBEDDED_KEY=240534745557954995` (Line 32)
- `VITE_DATAFINITY_API_KEY=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...` (Line 46) - Full JWT token exposed
- `VITE_BDD_USER="bryan@turbotracts.com"` (Line 53)
- `VITE_BDD_PASS="password"` (Line 54) - Hardcoded plaintext password

**Risk:** These credentials can be used by attackers to access third-party services, incur costs, and access test accounts.

**Recommendation:**

- Remove all sensitive values from `.env.local`
- Use environment variables at runtime
- Rotate all exposed API keys immediately
- Never commit credentials to version control

### 2. Hardcoded Admin User ID

**Severity: HIGH**
**File:** `src/utils/authUtils.js`

```javascript
const ADMIN_USER_ID = "79ff44e1-9e1b-47cd-9bbd-f848415a4883";
```

**Risk:** Hardcoded admin IDs can be exploited if discovered. No role-based access control (RBAC) system is implemented.

**Recommendation:**

- Implement proper RBAC using AWS Cognito groups
- Remove hardcoded user IDs
- Use dynamic role checking based on JWT claims

### 3. Overly Permissive CORS Configuration

**Severity: HIGH**
**Files:** Multiple Lambda functions in `amplify/backend/function/`

All Lambda functions have:

```javascript
"Access-Control-Allow-Origin": "*",
```

**Risk:** Allows any domain to make requests to your APIs, enabling potential CSRF attacks and data theft.

**Recommendation:**

- Configure specific allowed origins
- Implement proper CORS validation
- Use environment-specific CORS policies

### 4. Client-Side API Key Usage

**Severity: MEDIUM-HIGH**
**Files:** `src/views/PropertyData.vue`, `src/views/AddressValidation.vue`

API keys are directly used in client-side code:

```javascript
const apikey = import.meta.env.VITE_DATAFINITY_API_KEY;
```

**Risk:** API keys exposed in browser can be extracted and abused.

**Recommendation:**

- Move all API calls to backend Lambda functions
- Never expose API keys to client-side code
- Implement proxy endpoints with proper authentication

## Medium Severity Issues

### 5. No Input Validation or Sanitization

**Severity: MEDIUM**
**Finding:** No comprehensive input validation found across the application

**Risk:** Potential for XSS, injection attacks, and data integrity issues.

**Recommendation:**

- Implement input validation on both client and server
- Use libraries like DOMPurify for XSS prevention
- Validate all GraphQL inputs

### 6. Missing Security Headers

**Severity: MEDIUM**
**Finding:** No Content-Security-Policy, X-Frame-Options, or other security headers configured

**Risk:** Vulnerable to clickjacking, XSS, and other client-side attacks.

**Recommendation:**

- Implement CSP headers
- Add X-Frame-Options: DENY
- Configure other security headers (HSTS, X-Content-Type-Options, etc.)

### 7. Insufficient Error Handling

**Severity: MEDIUM**
**Files:** Various Vue components and Lambda functions

Error messages may leak sensitive information.

**Recommendation:**

- Implement generic error messages for users
- Log detailed errors server-side only
- Never expose stack traces to clients

## Low Severity Issues

### 8. AWS Credentials in Code

**Severity: LOW (if using IAM roles properly)**
**File:** `agent-tools/importAgentsToDynamoDB.js`

```javascript
accessKeyId: process.env.AWS_ACCESS_KEY_ID,
secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
```

**Recommendation:**

- Use IAM roles instead of explicit credentials
- Implement AWS SDK credential chain

### 9. Unencrypted Local Storage

**Severity: LOW**
**Finding:** Vuex store persists to sessionStorage without encryption

**Risk:** Sensitive data in browser storage can be accessed by XSS attacks.

**Recommendation:**

- Encrypt sensitive data before storage
- Minimize data stored client-side
- Clear storage on logout

## Security Best Practices Not Implemented

1. **No Rate Limiting**: APIs lack rate limiting, vulnerable to DoS attacks
2. **No API Versioning**: Makes security updates difficult
3. **No Security Logging**: Insufficient audit trails for security events
4. **No Dependency Scanning**: No automated vulnerability scanning for npm packages
5. **No Secret Rotation**: No process for rotating credentials

## Immediate Action Items

1. **CRITICAL**: Remove all API keys from `.env.local` and rotate them
2. **CRITICAL**: Implement proper CORS policies
3. **HIGH**: Remove hardcoded admin user ID
4. **HIGH**: Move API keys to backend services
5. **MEDIUM**: Implement input validation across all forms
6. **MEDIUM**: Add security headers to all responses

## Recommended Security Tools

1. **npm audit**: Run regularly to check for vulnerable dependencies
2. **ESLint Security Plugin**: Add security linting rules
3. **OWASP ZAP**: For penetration testing
4. **AWS Security Hub**: For AWS resource security monitoring
5. **Snyk**: For continuous vulnerability monitoring

## Conclusion

The application has several critical security vulnerabilities that need immediate attention. The most pressing issues are the exposed API keys and lack of proper access controls. Implementing the recommended fixes will significantly improve the security posture of the application.

Priority should be given to:

1. Removing and rotating exposed credentials
2. Implementing proper authentication and authorization
3. Adding input validation and output encoding
4. Configuring security headers and CORS policies

Regular security audits and automated scanning should be implemented as part of the development process.
