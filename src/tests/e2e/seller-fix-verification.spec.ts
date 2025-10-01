/**
 * Critical Fix Verification Test: Seller Data Persistence
 *
 * This test verifies the fix for the seller data persistence bug where:
 * - Buyer data saves correctly
 * - Seller data was NOT persisting to database
 * - Root cause: Double transformation of data in ContractAPI.update()
 * - Fix: Added isAlreadyTransformed check to prevent double transformation
 */

import { test, expect } from '@playwright/test'

test.describe('Seller Data Persistence Fix', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/')

    // Login if needed (you might need to adjust this based on your auth flow)
    // For now, assuming we can access without auth or test mode
  })

  test('should save and persist seller data correctly', async ({ page }) => {
    console.log('[TEST] Starting seller data persistence test...')

    // Create a new contract
    await page.goto('http://localhost:5173/form/property')

    // Fill minimal property data
    await page.fill('[data-testid="streetAddress"]', '123 Test Street')
    await page.fill('[data-testid="city"]', 'Austin')
    await page.fill('[data-testid="state"]', 'TX')
    await page.fill('[data-testid="postalCode"]', '78701')

    // Save and continue to buyers
    await page.click('button:has-text("Next")')
    await page.waitForURL('**/form/buyers')

    // Fill buyer data
    await page.fill('[data-testid="primaryName"]', 'Jane Buyer')
    await page.fill('[data-testid="email"]', 'jane.buyer@example.com')
    await page.fill('[data-testid="phone"]', '5125551111')

    // Save and continue to sellers
    await page.click('button:has-text("Next")')
    await page.waitForURL('**/form/sellers')

    // Fill seller data
    await page.fill('[data-testid="primaryName"]', 'John Seller')
    await page.fill('[data-testid="email"]', 'john.seller@example.com')
    await page.fill('[data-testid="phone"]', '5125552222')

    // Save the seller data
    await page.click('button:has-text("Next")')

    // Wait for save to complete
    await page.waitForTimeout(2000)

    // Navigate away and back to verify persistence
    await page.goto('http://localhost:5173/contracts')
    await page.waitForTimeout(1000)

    // Go back to the contract
    await page.goto('http://localhost:5173/form/sellers')

    // Verify seller data is still there
    const sellerName = await page.inputValue('[data-testid="primaryName"]')
    const sellerEmail = await page.inputValue('[data-testid="email"]')
    const sellerPhone = await page.inputValue('[data-testid="phone"]')

    expect(sellerName).toBe('John Seller')
    expect(sellerEmail).toBe('john.seller@example.com')
    expect(sellerPhone).toBe('5125552222')

    console.log('[TEST] ✅ Seller data persisted correctly!')

    // Also verify buyer data is still intact
    await page.goto('http://localhost:5173/form/buyers')

    const buyerName = await page.inputValue('[data-testid="primaryName"]')
    const buyerEmail = await page.inputValue('[data-testid="email"]')
    const buyerPhone = await page.inputValue('[data-testid="phone"]')

    expect(buyerName).toBe('Jane Buyer')
    expect(buyerEmail).toBe('jane.buyer@example.com')
    expect(buyerPhone).toBe('5125551111')

    console.log('[TEST] ✅ Buyer data also persisted correctly!')
    console.log('[TEST] ✅ FIX VERIFIED: Both buyers and sellers data persist!')
  })

  test('should handle updating seller data after initial save', async ({ page }) => {
    console.log('[TEST] Starting seller data update test...')

    // Assuming a contract already exists from previous test or setup
    await page.goto('http://localhost:5173/form/sellers')

    // Update seller data
    await page.fill('[data-testid="primaryName"]', 'Jane Updated Seller')
    await page.fill('[data-testid="email"]', 'jane.updated@example.com')

    // Save
    await page.click('button:has-text("Next")')
    await page.waitForTimeout(2000)

    // Navigate away and back
    await page.goto('http://localhost:5173/contracts')
    await page.waitForTimeout(1000)
    await page.goto('http://localhost:5173/form/sellers')

    // Verify updated data persisted
    const sellerName = await page.inputValue('[data-testid="primaryName"]')
    const sellerEmail = await page.inputValue('[data-testid="email"]')

    expect(sellerName).toBe('Jane Updated Seller')
    expect(sellerEmail).toBe('jane.updated@example.com')

    console.log('[TEST] ✅ Seller data updates persist correctly!')
  })
})
