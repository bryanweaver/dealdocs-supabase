/**
 * Authentication helper for Playwright tests
 * Provides utilities for signup, login, and logout
 */
import { Page, expect } from '@playwright/test';
import { generateTestEmail, generateTestPassword, trackTestUser } from './test-users';

export interface TestUser {
  email: string;
  password: string;
  fullName?: string;
}

/**
 * Sign up a new test user via the UI
 */
export async function signupTestUser(page: Page, user?: Partial<TestUser>): Promise<TestUser> {
  const email = user?.email || generateTestEmail();
  const password = user?.password || generateTestPassword();
  const fullName = user?.fullName || `Test User ${Date.now()}`;
  
  console.log(`📝 Signing up test user: ${email}`);
  
  // Track for cleanup
  trackTestUser(email);
  
  // Navigate to auth page
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Look for sign up option - try multiple selectors
  const signUpButton = page.locator('button:has-text("Sign up"), a:has-text("Sign up")').first();
  const signUpLink = page.locator('text="Sign up"').first();
  const createAccountLink = page.locator('text=/create.*account/i').first();
  const dontHaveAccountLink = page.locator('text=/don.*t have an account/i').first();
  
  // Try different sign up triggers
  if (await signUpButton.count() > 0) {
    await signUpButton.click();
    await page.waitForTimeout(500);
  } else if (await signUpLink.count() > 0) {
    await signUpLink.click();
    await page.waitForTimeout(500);
  } else if (await createAccountLink.count() > 0) {
    await createAccountLink.click();
    await page.waitForTimeout(500);
  } else if (await dontHaveAccountLink.count() > 0) {
    await dontHaveAccountLink.click();
    await page.waitForTimeout(500);
  }
  
  // Wait for sign up form - look for various indicators
  const signupIndicators = [
    page.locator('text=/create.*account/i'),
    page.locator('text=/sign.*up/i'),
    page.locator('h2:has-text("Sign up")'),
    page.locator('h2:has-text("Create")')
  ];
  
  // Wait for any of these to be visible
  let signupFormVisible = false;
  for (const indicator of signupIndicators) {
    if (await indicator.first().isVisible()) {
      signupFormVisible = true;
      break;
    }
  }
  
  if (!signupFormVisible) {
    // Wait a bit more for the form to appear
    await page.waitForTimeout(2000);
    await expect(signupIndicators[0].first()).toBeVisible({ timeout: 5000 });
  }
  
  // Fill the form
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  // Handle confirm password if present
  const confirmPwd = page.locator('input[placeholder*="confirm" i], input[id="confirmPassword"]');
  if (await confirmPwd.count() > 0) {
    await confirmPwd.fill(password);
  }
  
  // Handle name field if present
  const nameField = page.locator('input[id="fullName"], input[placeholder*="name" i]').first();
  if (await nameField.count() > 0) {
    await nameField.fill(fullName);
  }
  
  // Submit the form
  const submitBtn = page.locator('button[type="submit"], button:has-text("Sign up"), button:has-text("Create")').first();
  await expect(submitBtn).toBeEnabled({ timeout: 5000 });
  await submitBtn.click();
  
  // Wait for navigation or success
  try {
    // Either we get redirected to contracts page (auto-login)
    await page.waitForURL('**/contracts', { timeout: 10000 });
    console.log(`✅ User signed up and auto-logged in: ${email}`);
  } catch {
    // Or we stay on auth page and need to login manually
    console.log(`✅ User signed up, manual login required: ${email}`);
  }
  
  return { email, password, fullName };
}

/**
 * Login with existing credentials via the UI
 */
export async function loginTestUser(page: Page, user: TestUser): Promise<void> {
  console.log(`🔑 Logging in test user: ${user.email}`);
  
  // Navigate to auth page if not already there
  const currentUrl = page.url();
  if (!currentUrl.includes('auth') && !currentUrl.includes('login') && !currentUrl.includes('#/')) {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  }
  
  // Check if we're already on the login form
  const signInHeader = page.locator('text="Sign in to your account"');
  const isOnLoginForm = await signInHeader.isVisible();
  
  if (!isOnLoginForm) {
    // We might be on signup form, need to switch to login
    const loginLink = page.locator('text=/already have an account/i').first();
    const signInLink = page.locator('text="Sign in"').first();
    
    if (await loginLink.count() > 0) {
      await loginLink.click();
      await page.waitForTimeout(500);
    } else if (await signInLink.count() > 0) {
      await signInLink.click();
      await page.waitForTimeout(500);
    }
    
    // Verify we're now on login form
    await expect(signInHeader).toBeVisible({ timeout: 5000 });
  }
  
  // Fill credentials
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  
  // Wait a moment for form validation
  await page.waitForTimeout(500);
  
  // Submit - wait for button to be enabled
  const submitBtn = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")').first();
  await expect(submitBtn).toBeEnabled({ timeout: 5000 });
  await submitBtn.click();
  
  // Wait for successful login
  await page.waitForURL('**/contracts', { timeout: 10000 });
  console.log(`✅ Successfully logged in: ${user.email}`);
}

/**
 * Logout the current user via the UI
 */
export async function logoutUser(page: Page): Promise<void> {
  console.log('🔓 Logging out user...');
  
  // Look for the ellipsis menu button (three dots) in the topbar
  const ellipsisBtn = page.locator('button i.pi-ellipsis-v').first();
  
  if (await ellipsisBtn.count() > 0) {
    await ellipsisBtn.click();
    await page.waitForTimeout(500);
    
    // Click the Log Out button in the drawer
    const logoutBtn = page.locator('button:has-text("Log Out")').first();
    await expect(logoutBtn).toBeVisible({ timeout: 5000 });
    await logoutBtn.click();
    
    // Wait for redirect to auth page
    await page.waitForTimeout(2000);
    const authPageIndicators = [
      page.locator('text="Sign in to your account"'),
      page.locator('text=/sign.*in/i'),
      page.locator('text=/log.*in/i'),
      page.locator('button:has-text("Sign in")')
    ];
    
    // Check if any auth page indicator is visible
    let authPageVisible = false;
    for (const indicator of authPageIndicators) {
      if (await indicator.first().isVisible()) {
        authPageVisible = true;
        break;
      }
    }
    
    if (!authPageVisible) {
      throw new Error('Failed to redirect to auth page after logout');
    }
    
    console.log('✅ Successfully logged out');
  } else {
    console.warn('⚠️ Could not find logout menu');
  }
}

/**
 * Create and login a test user in one flow
 */
export async function setupTestUser(page: Page): Promise<TestUser> {
  const user = await signupTestUser(page);
  
  // Check if we need to login manually after signup
  const currentUrl = page.url();
  if (!currentUrl.includes('contracts')) {
    await loginTestUser(page, user);
  }
  
  return user;
}