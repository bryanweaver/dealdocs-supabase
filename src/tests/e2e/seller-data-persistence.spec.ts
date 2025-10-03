import { test, expect } from '@playwright/test';

test.describe('Seller Data Saving', () => {
  test('should save seller data successfully', async ({ page }) => {
    // Navigate to the form page
    await page.goto('http://localhost:5173/form/sellers');
    
    // Wait for the form to load
    await page.waitForSelector('[data-testid="primaryName"]', { timeout: 10000 });
    
    // Fill in seller information
    await page.fill('[data-testid="primaryName"]', 'John Smith');
    await page.fill('[data-testid="phone"]', '(555) 123-4567');
    await page.fill('[data-testid="email"]', 'john@example.com');
    
    // Click save/next button
    await page.click('button:has-text("Save")');
    
    // Wait for success message or navigation
    await page.waitForTimeout(2000);
    
    // Check if data was saved by navigating away and back
    await page.goto('http://localhost:5173/form/buyers');
    await page.goto('http://localhost:5173/form/sellers');
    
    // Verify data persisted
    const primaryNameValue = await page.inputValue('[data-testid="primaryName"]');
    expect(primaryNameValue).toBe('John Smith');
  });
  
  test('should handle secondary seller data', async ({ page }) => {
    await page.goto('http://localhost:5173/form/sellers');
    await page.waitForSelector('[data-testid="primaryName"]');
    
    // Fill primary seller
    await page.fill('[data-testid="primaryName"]', 'Jane Doe');
    await page.fill('[data-testid="email"]', 'jane@example.com');
    
    // Enable secondary seller
    await page.check('[data-testid="hasSecondaryParty"]');
    
    // Fill secondary seller
    await page.fill('[data-testid="secondaryName"]', 'Bob Doe');
    await page.fill('[data-testid="secondaryEmail"]', 'bob@example.com');
    
    // Save
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(2000);
    
    // Verify secondary seller data persisted
    await page.goto('http://localhost:5173/form/buyers');
    await page.goto('http://localhost:5173/form/sellers');
    
    await page.waitForSelector('[data-testid="secondaryName"]');
    const secondaryNameValue = await page.inputValue('[data-testid="secondaryName"]');
    expect(secondaryNameValue).toBe('Bob Doe');
  });
});
