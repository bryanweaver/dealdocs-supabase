import { test, expect } from '@playwright/test';

test.describe('Seller Data Persistence Fix Verification', () => {
  test('seller data should persist when saving contract', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173/');

    // Login if needed
    const authElement = page.locator('[data-testid="auth-container"]');
    if (await authElement.isVisible({ timeout: 5000 }).catch(() => false)) {
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'testPassword123!');
      await page.click('button:has-text("Sign In")');
      await page.waitForURL('**/contracts', { timeout: 10000 });
    }

    // Navigate to form page
    await page.goto('http://localhost:5173/#/form-page');
    await page.waitForLoadState('networkidle');

    // Fill in seller data
    await page.fill('input[name="sellersName"]', 'John Seller');
    await page.fill('input[name="sellersEmail"]', 'john.seller@example.com');
    await page.fill('input[name="sellersPhone"]', '555-0123');

    // Fill in buyer data for comparison
    await page.fill('input[name="buyersName"]', 'Jane Buyer');
    await page.fill('input[name="buyersEmail"]', 'jane.buyer@example.com');

    // Save the contract
    await page.click('button:has-text("Save")');

    // Wait for save to complete
    await page.waitForTimeout(2000);

    // Refresh the page to verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify seller data persisted
    const sellerNameInput = page.locator('input[name="sellersName"]');
    await expect(sellerNameInput).toHaveValue('John Seller');

    const sellerEmailInput = page.locator('input[name="sellersEmail"]');
    await expect(sellerEmailInput).toHaveValue('john.seller@example.com');

    const sellerPhoneInput = page.locator('input[name="sellersPhone"]');
    await expect(sellerPhoneInput).toHaveValue('555-0123');

    // Verify buyer data also persisted (as a control)
    const buyerNameInput = page.locator('input[name="buyersName"]');
    await expect(buyerNameInput).toHaveValue('Jane Buyer');
  });
});