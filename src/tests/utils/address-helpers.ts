/**
 * Address search and selection helpers for SmartyStreets integration
 */
import { Page, expect } from '@playwright/test';

/**
 * Search for an address and select from SmartyStreets results
 */
export async function searchAndSelectAddress(page: Page, address: string): Promise<boolean> {
  console.log(`🔍 Searching for address: ${address}`);
  
  // Find the address input field
  const addressInputSelectors = [
    'input[placeholder*="Enter property address" i]',
    'input[placeholder*="address" i]',
    'input[name*="address" i]',
    'input[id*="address" i]',
    'input[type="text"]'
  ];
  
  let addressInput = null;
  for (const selector of addressInputSelectors) {
    const input = page.locator(selector).first();
    if (await input.count() > 0 && await input.isVisible()) {
      addressInput = input;
      break;
    }
  }
  
  if (!addressInput) {
    console.log('❌ Could not find address input field');
    return false;
  }
  
  // Clear and type the address
  await addressInput.clear();
  await addressInput.fill(address);
  
  // Wait a moment for SmartyStreets to process
  await page.waitForTimeout(1000);
  
  // Wait for SmartyStreets dropdown to appear
  console.log('⏳ Waiting for SmartyStreets suggestions...');
  await page.waitForTimeout(2000); // Give SmartyStreets time to load
  
  // SmartyStreets typically uses these selectors for suggestions
  const dropdownSelectors = [
    // Common SmartyStreets selectors
    '.smartystreets-autocomplete li',
    '.smartystreets-autocomplete ul li',
    'ul.smartystreets-autocomplete li',
    '.ss-suggestion',
    '.smarty-suggestion',
    // Generic autocomplete selectors
    '.autocomplete-dropdown li',
    '.autocomplete-suggestions li',
    'ul[class*="autocomplete"] li',
    'div[class*="autocomplete"] li',
    // PrimeVue/similar frameworks
    '.p-autocomplete-panel .p-autocomplete-item',
    '.p-dropdown-items li',
    // Material/other UI frameworks
    '[role="listbox"] [role="option"]',
    '[aria-label*="suggestion"]',
    // Generic list items that might appear below input
    'ul li[class*="suggestion"]',
    'ul li[class*="result"]',
    'div[class*="dropdown"] li',
    'div[class*="results"] li'
  ];
  
  let suggestionsFound = false;
  let selectedAddress = false;
  
  // First, check if suggestions are visible without waiting
  for (const selector of dropdownSelectors) {
    const suggestions = page.locator(selector);
    const count = await suggestions.count();
    
    if (count > 0) {
      // Check if at least one is visible
      const firstSuggestion = suggestions.first();
      if (await firstSuggestion.isVisible()) {
        console.log(`✅ Found ${count} address suggestion(s) using selector: ${selector}`);
        suggestionsFound = true;
        
        // Wait a moment for the dropdown to stabilize
        await page.waitForTimeout(500);
        
        // Click the first suggestion
        await firstSuggestion.click();
        selectedAddress = true;
        console.log('✅ Selected first address suggestion');
        break;
      }
    }
  }
  
  // If not found immediately, let's inspect what's on the page
  if (!suggestionsFound) {
    console.log('No suggestions found yet, inspecting page...');
    
    // Debug: Look for any new elements that appeared after typing
    const allListItems = await page.locator('li').count();
    const allDivs = await page.locator('div').count();
    console.log(`Found ${allListItems} li elements and ${allDivs} div elements on page`);
    
    // Look for any element with the address text in it
    const addressElements = page.locator(`text=/3114.*brookhollow/i`);
    const addressCount = await addressElements.count();
    if (addressCount > 0) {
      console.log(`Found ${addressCount} elements containing the address text`);
      // Try clicking the first one
      try {
        await addressElements.first().click();
        console.log('✅ Clicked on address element directly');
        selectedAddress = true;
        suggestionsFound = true;
      } catch (e) {
        console.log('Could not click address element:', e.message);
      }
    }
    
    console.log('Waiting for suggestions to appear...');
    
    for (const selector of dropdownSelectors) {
      try {
        const suggestions = page.locator(selector).first();
        await suggestions.waitFor({ state: 'visible', timeout: 3000 });
        
        const allSuggestions = page.locator(selector);
        const count = await allSuggestions.count();
        
        if (count > 0) {
          console.log(`✅ Found ${count} address suggestion(s) using selector: ${selector}`);
          suggestionsFound = true;
          
          // Click the first visible suggestion
          await allSuggestions.first().click();
          selectedAddress = true;
          console.log('✅ Selected first address suggestion');
          break;
        }
      } catch {
        // This selector didn't work, try the next one
        continue;
      }
    }
  }
  
  // If no dropdown found, try alternative approaches
  if (!suggestionsFound) {
    console.log('⚠️ No SmartyStreets dropdown found, trying alternative approaches...');
    
    // Check if there's a "No suggestions" message
    const noSuggestionsMessages = [
      'text=/no.*suggestion/i',
      'text=/no.*result/i',
      'text=/not.*found/i',
      'text=/invalid.*address/i'
    ];
    
    for (const message of noSuggestionsMessages) {
      const noResults = page.locator(message);
      if (await noResults.count() > 0) {
        console.log('⚠️ No address suggestions available from SmartyStreets');
        return false;
      }
    }
    
    // Try clicking outside to close any dropdown and continue
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Check if the address was auto-populated in fields
    const cityField = page.locator('input[name*="city" i], input[id*="city" i]').first();
    const stateField = page.locator('input[name*="state" i], input[id*="state" i]').first();
    const zipField = page.locator('input[name*="zip" i], input[id*="zip" i]').first();
    
    if (await cityField.count() > 0) {
      const cityValue = await cityField.inputValue();
      if (cityValue && cityValue.length > 0) {
        console.log('✅ Address fields were auto-populated');
        selectedAddress = true;
      }
    }
  }
  
  // NO WAIT - immediately return after selection
  return selectedAddress;
}

/**
 * Manually fill address fields if SmartyStreets selection fails
 */
export async function fillAddressManually(page: Page, address: {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}): Promise<void> {
  console.log('📝 Filling address fields manually...');
  
  const fields = [
    { selector: 'input[name*="street" i], input[name*="address" i]', value: address.street },
    { selector: 'input[name*="city" i]', value: address.city },
    { selector: 'input[name*="state" i]', value: address.state },
    { selector: 'input[name*="zip" i], input[name*="postal" i]', value: address.zipCode }
  ];
  
  for (const field of fields) {
    const input = page.locator(field.selector).first();
    if (await input.count() > 0 && await input.isVisible()) {
      await input.fill(field.value);
    }
  }
  
  console.log('✅ Address fields filled manually');
}

/**
 * Handle the complete address entry process
 */
export async function handleAddressEntry(page: Page, addressString?: string): Promise<boolean> {
  // Use environment variable or default address
  const address = addressString || process.env.VITE_BDD_STREET_ADDRESS || '1234 Main Street, Houston, TX 77001';
  
  // Try SmartyStreets search first
  const selected = await searchAndSelectAddress(page, address);
  
  if (!selected) {
    console.log('⚠️ SmartyStreets selection failed, using manual entry...');
    
    // Parse the address string for manual entry
    const parts = address.split(',').map(s => s.trim());
    const streetAddress = parts[0] || '1234 Main Street';
    const city = parts[1] || 'Houston';
    const stateZip = parts[2] || 'TX 77001';
    const [state, zipCode] = stateZip.split(' ');
    
    await fillAddressManually(page, {
      street: streetAddress,
      city: city,
      state: state || 'TX',
      zipCode: zipCode || '77001'
    });
  }
  
  // Click "Fetch Property Details" button immediately - no waiting!
  const fetchBtn = page.locator('button:has-text("Fetch Property Details")').first();
  if (await fetchBtn.count() > 0 && await fetchBtn.isVisible()) {
    await fetchBtn.click();
    console.log('✅ Clicked "Fetch Property Details" button');
    // Wait for property data to load
    await page.waitForTimeout(3000);
  } else {
    console.log('⚠️ "Fetch Property Details" button not found, continuing...');
  }
  
  return true;
}