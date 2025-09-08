/**
 * Comprehensive form filling helpers for contract workflow
 * Fills all inputs on a page and navigates to next section
 */
import { Page, expect } from '@playwright/test';
import { getAnswerForQuestion, getAnswerForFieldId } from './contract-answers';

/**
 * Verify property details were fetched successfully
 */
export async function verifyPropertyDetailsFetched(page: Page): Promise<boolean> {
  console.log('🔍 Verifying property details were fetched...');
  
  // Wait for property data to load
  await page.waitForTimeout(3000);
  
  // Check for property images
  const propertyImages = page.locator('img[src*="property"], img[src*="listing"], img[alt*="property" i], .property-image img');
  const imageCount = await propertyImages.count();
  if (imageCount > 0) {
    console.log(`✅ Found ${imageCount} property image(s)`);
  } else {
    console.log('⚠️ No property images found');
  }
  
  // Check for property price
  const priceElements = page.locator('text=/\\$[0-9,]+/').or(page.locator('input[name*="price" i]'));
  const priceCount = await priceElements.count();
  if (priceCount > 0) {
    const firstPrice = await priceElements.first().textContent() || await priceElements.first().inputValue();
    console.log(`✅ Found property price: ${firstPrice}`);
  } else {
    console.log('⚠️ No property price found');
  }
  
  // Check for property details like bedrooms, bathrooms, square feet
  const detailFields = [
    { name: 'bedrooms', selector: 'input[name*="bedroom" i]' },
    { name: 'bathrooms', selector: 'input[name*="bathroom" i]' },
    { name: 'square feet', selector: 'input[name*="sqft" i], input[name*="square" i]' },
    { name: 'year built', selector: 'input[name*="year" i]' }
  ];
  
  let detailsFound = 0;
  for (const field of detailFields) {
    const element = page.locator(field.selector).first();
    if (await element.count() > 0) {
      const value = await element.textContent() || await element.inputValue();
      if (value) {
        console.log(`✅ Found ${field.name}: ${value}`);
        detailsFound++;
      }
    }
  }
  
  return imageCount > 0 || priceCount > 0 || detailsFound > 0;
}

/**
 * Fill all inputs on the current form page
 */
export async function fillAllFormInputs(page: Page, customValues?: Record<string, string>): Promise<void> {
  console.log('📝 Filling all form inputs on current page...');
  
  // First, try to detect what question we're answering from the page
  const currentQuestion = await identifyCurrentFormPage(page);
  console.log(`  Current question: "${currentQuestion}"`);
  
  // Get the answer for this specific question from our config-based mapping
  let pageAnswer = getAnswerForQuestion(currentQuestion);
  console.log(`  Answer from mapping: "${pageAnswer}"`);
  
  // Get all visible input fields
  const textInputs = page.locator('input[type="text"]:visible, input[type="email"]:visible, input[type="tel"]:visible, input[type="number"]:visible, input:not([type]):visible');
  const textareas = page.locator('textarea:visible');
  const selects = page.locator('select:visible');
  const checkboxes = page.locator('input[type="checkbox"]:visible');
  // Don't require :visible for radios as they might be styled differently
  const radios = page.locator('input[type="radio"]');
  // PrimeVue uses SelectButton with toggle buttons for yes/no questions
  const selectButtons = page.locator('.p-selectbutton');
  
  // Count all inputs
  const inputCount = await textInputs.count();
  const textareaCount = await textareas.count();
  const selectCount = await selects.count();
  const checkboxCount = await checkboxes.count();
  const radioCount = await radios.count();
  const selectButtonCount = await selectButtons.count();
  
  console.log(`Found ${inputCount} text inputs, ${textareaCount} textareas, ${selectCount} selects, ${checkboxCount} checkboxes, ${radioCount} radios, ${selectButtonCount} select buttons`);
  
  // Special handling for buyer/seller info pages with multiple fields
  const isBuyerPage = currentQuestion.toLowerCase().includes('your full name') || 
                      currentQuestion.toLowerCase().includes('buyer');
  const isSellerPage = currentQuestion.toLowerCase().includes('seller');
  
  // Fill text inputs
  for (let i = 0; i < inputCount; i++) {
    const input = textInputs.nth(i);
    
    // Skip if already has value or is disabled/readonly
    const isDisabled = await input.isDisabled();
    const isReadonly = await input.getAttribute('readonly');
    const currentValue = await input.inputValue();
    
    if (isDisabled || isReadonly || (currentValue && currentValue.length > 0)) {
      continue;
    }
    
    // Get input attributes
    const name = await input.getAttribute('name') || await input.getAttribute('id') || '';
    const placeholder = await input.getAttribute('placeholder') || '';
    const type = await input.getAttribute('type') || 'text';
    const inputId = await input.getAttribute('id') || '';
    
    // Try to find the label for this input
    let labelText = '';
    if (inputId) {
      const label = page.locator(`label[for="${inputId}"]`).first();
      if (await label.count() > 0) {
        labelText = await label.textContent() || '';
      }
    }
    
    // Also check for labels that wrap the input
    if (!labelText) {
      const parentLabel = await input.locator('xpath=ancestor::label').first();
      if (await parentLabel.count() > 0) {
        labelText = await parentLabel.textContent() || '';
      }
    }
    
    // Also check for nearby text that might be a label
    if (!labelText) {
      const precedingLabel = await input.locator('xpath=preceding-sibling::label').first();
      if (await precedingLabel.count() > 0) {
        labelText = await precedingLabel.textContent() || '';
      }
    }
    
    // Combine all context to determine field type
    const fieldContext = `${name} ${placeholder} ${labelText} ${type}`.toLowerCase();
    
    // Log what we detected for debugging
    console.log(`    Field context: name="${name}" placeholder="${placeholder}" type="${type}"`);
    if (labelText) {
      console.log(`    Detected label: "${labelText}"`);
    }
    
    // Determine value to fill
    let value = '';
    
    // Check if we have a custom value for this field
    if (customValues && name && customValues[name]) {
      value = customValues[name];
    } else {
      // Special handling for buyer/seller pages - we know the order
      if (isBuyerPage && inputCount === 4) {
        // Buyer page has: name, phone, email, fax
        if (i === 0) value = 'John Michael Smith';
        else if (i === 1) value = '(713) 555-4567';
        else if (i === 2) value = `john.smith.${Date.now()}@example.com`;
        else if (i === 3) value = '(713) 555-4568';
      } else if (isSellerPage && inputCount === 4) {
        // Seller page has: name, phone, email, fax
        if (i === 0) value = 'Robert James Anderson';
        else if (i === 1) value = '(832) 555-7890';
        else if (i === 2) value = `seller.${Date.now()}@example.com`;
        else if (i === 3) value = '(832) 555-7891';
      }
      // Special handling for specific input types
      else if (type === 'tel') {
        value = '(713) 555-' + Math.floor(1000 + Math.random() * 9000);
      } else if (type === 'email') {
        value = `test.${Date.now()}@example.com`;
      } else if (type === 'number') {
        // Check context for what kind of number
        if (fieldContext.includes('year')) value = '30';
        else if (fieldContext.includes('days')) value = '10';
        else if (fieldContext.includes('percent') || fieldContext.includes('rate')) value = '5';
        else value = '100';
      } else if (!value) {
        // Generate appropriate value based on field context and label
        value = await generateSmartValueForField(fieldContext, labelText);
      }
    }
    
    if (value) {
      await input.fill(value);
      console.log(`  Filled "${labelText || placeholder || name || 'input'}": ${value}`);
    }
  }
  
  // Fill textareas
  for (let i = 0; i < textareaCount; i++) {
    const textarea = textareas.nth(i);
    const currentValue = await textarea.inputValue();
    
    if (!currentValue) {
      const name = await textarea.getAttribute('name') || await textarea.getAttribute('id') || '';
      const value = customValues?.[name] || 'This is a test description for the contract workflow.';
      await textarea.fill(value);
      console.log(`  Filled textarea ${name}: ${value.substring(0, 50)}...`);
    }
  }
  
  // Handle selects intelligently
  for (let i = 0; i < selectCount; i++) {
    const select = selects.nth(i);
    const currentValue = await select.inputValue();
    
    if (!currentValue || currentValue === '') {
      // Try to find label for this select
      const selectId = await select.getAttribute('id') || '';
      let labelText = '';
      
      if (selectId) {
        const label = page.locator(`label[for="${selectId}"]`).first();
        if (await label.count() > 0) {
          labelText = await label.textContent() || '';
        }
      }
      
      const labelLower = labelText.toLowerCase();
      const options = await select.locator('option').all();
      
      if (options.length > 1) {
        // Smart selection based on field type
        let selectedIndex = 1; // Default to first real option
        
        // For state fields, select Texas
        if (labelLower.includes('state') || selectId.includes('state')) {
          for (let j = 0; j < options.length; j++) {
            const optText = await options[j].textContent() || '';
            if (optText.includes('TX') || optText.includes('Texas')) {
              selectedIndex = j;
              break;
            }
          }
        }
        // For yes/no selects, prefer "Yes"
        else if (labelLower.includes('?')) {
          for (let j = 0; j < options.length; j++) {
            const optText = await options[j].textContent() || '';
            if (optText.toLowerCase() === 'yes') {
              selectedIndex = j;
              break;
            }
          }
        }
        // For property type, select "Single Family"
        else if (labelLower.includes('property type') || labelLower.includes('type of property')) {
          for (let j = 0; j < options.length; j++) {
            const optText = await options[j].textContent() || '';
            if (optText.includes('Single Family')) {
              selectedIndex = j;
              break;
            }
          }
        }
        // Skip first option if it's empty or placeholder
        else {
          const firstOptionText = await options[0].textContent();
          if (!firstOptionText || firstOptionText.includes('Select') || firstOptionText.includes('Choose')) {
            selectedIndex = 1;
          } else {
            selectedIndex = 0;
          }
        }
        
        if (options[selectedIndex]) {
          const optionValue = await options[selectedIndex].getAttribute('value');
          if (optionValue) {
            await select.selectOption(optionValue);
            console.log(`  Selected "${labelText || 'dropdown'}": ${await options[selectedIndex].textContent()}`);
          }
        }
      }
    }
  }
  
  // Handle checkboxes intelligently
  for (let i = 0; i < checkboxCount; i++) {
    const checkbox = checkboxes.nth(i);
    const isChecked = await checkbox.isChecked();
    
    if (!isChecked) {
      const checkboxId = await checkbox.getAttribute('id') || '';
      let labelText = '';
      
      // Find label for checkbox
      if (checkboxId) {
        const label = page.locator(`label[for="${checkboxId}"]`).first();
        if (await label.count() > 0) {
          labelText = await label.textContent() || '';
        }
      }
      
      const labelLower = labelText.toLowerCase();
      
      // Smart checkbox handling based on label
      let shouldCheck = false;
      
      // Always check: acknowledgments, confirmations, "I understand"
      if (labelLower.includes('acknowledge') || labelLower.includes('confirm') || 
          labelLower.includes('i understand') || labelLower.includes('i have')) {
        shouldCheck = true;
      }
      // Always check: "yes" options
      else if (labelLower.includes('yes')) {
        shouldCheck = true;
      }
      // Don't check: terms, agreements, marketing
      else if (labelLower.includes('agree to terms') || labelLower.includes('marketing') || 
               labelLower.includes('promotional')) {
        shouldCheck = false;
      }
      // Check if it seems like an optional feature
      else if (labelLower.includes('include') || labelLower.includes('add')) {
        shouldCheck = true;
      }
      
      if (shouldCheck) {
        await checkbox.check();
        console.log(`  ✓ Checked: "${labelText}"`);
      }
    }
  }
  
  // Handle PrimeVue SelectButton components (yes/no questions) - ALWAYS select "No"
  if (selectButtonCount > 0) {
    console.log(`  Found ${selectButtonCount} SelectButton components - selecting "No"...`);
    
    for (let i = 0; i < selectButtonCount; i++) {
      const selectButton = selectButtons.nth(i);
      
      // Find all toggle buttons within this SelectButton
      const toggleButtons = selectButton.locator('.p-togglebutton');
      const buttonCount = await toggleButtons.count();
      
      console.log(`    SelectButton ${i + 1} has ${buttonCount} options`);
      
      // Check if any button is already pressed
      let alreadySelected = false;
      for (let j = 0; j < buttonCount; j++) {
        const button = toggleButtons.nth(j);
        const isPressed = await button.getAttribute('aria-pressed');
        if (isPressed === 'true') {
          const buttonText = await button.textContent() || '';
          console.log(`      Already selected: "${buttonText.trim()}"`);
          alreadySelected = true;
          break;
        }
      }
      
      if (!alreadySelected) {
        // Look for the "No" button
        for (let j = 0; j < buttonCount; j++) {
          const button = toggleButtons.nth(j);
          const buttonText = await button.textContent() || '';
          
          console.log(`      Option ${j + 1}: "${buttonText.trim()}"`);
          
          // Click "No" button
          if (buttonText.toLowerCase().includes('no')) {
            await button.click();
            // Wait a moment for the selection to register
            await page.waitForTimeout(100);
            // Verify it was selected
            const isNowPressed = await button.getAttribute('aria-pressed');
            if (isNowPressed === 'true') {
              console.log(`      ✓ Successfully selected "No" button`);
            } else {
              console.log(`      ⚠️ Click may not have registered, trying again...`);
              await button.click({ force: true });
            }
            break;
          }
        }
      }
    }
  }
  
  // Handle traditional radio buttons (yes/no questions) - ALWAYS select "No"
  if (radioCount > 0) {
    console.log(`  Found ${radioCount} radio buttons - handling yes/no questions...`);
    
    // Group radios by name
    const radioGroups: Record<string, any[]> = {};
    
    for (let i = 0; i < radioCount; i++) {
      const radio = radios.nth(i);
      const name = await radio.getAttribute('name') || `group_${i}`;
      
      if (!radioGroups[name]) {
        radioGroups[name] = [];
      }
      radioGroups[name].push(radio);
    }
    
    // For each radio group, select "No" or false option
    for (const [groupName, groupRadios] of Object.entries(radioGroups)) {
      console.log(`  Radio group "${groupName}" with ${groupRadios.length} options`);
      
      // Check if any radio is already selected
      let alreadySelected = false;
      for (const radio of groupRadios) {
        if (await radio.isChecked()) {
          alreadySelected = true;
          const val = await radio.getAttribute('value') || '';
          console.log(`    Already selected: ${val}`);
          break;
        }
      }
      
      if (alreadySelected) continue;
      
      let selected = false;
      
      // Collect info about all options first
      const options = [];
      for (const radio of groupRadios) {
        const radioValue = await radio.getAttribute('value') || '';
        const radioId = await radio.getAttribute('id') || '';
        
        // Get label text
        let labelText = '';
        if (radioId) {
          try {
            const label = page.locator(`label[for="${radioId}"]`).first();
            if (await label.count() > 0) {
              labelText = await label.textContent() || '';
            }
          } catch {}
        }
        
        // Also check if radio is inside a label
        if (!labelText) {
          try {
            const parentLabel = await radio.evaluate(el => {
              const parent = el.closest('label');
              return parent ? parent.textContent?.trim() : '';
            });
            if (parentLabel) labelText = parentLabel;
          } catch {}
        }
        
        options.push({ radio, value: radioValue, label: labelText });
        console.log(`    Option: value="${radioValue}", label="${labelText}"`);
      }
      
      // Try to find and select "No" option
      for (const option of options) {
        const isNoOption = 
          option.label.toLowerCase().includes('no') ||
          option.value.toLowerCase() === 'false' ||
          option.value.toLowerCase() === 'no' ||
          option.value === '0' ||
          option.value === 'False' ||
          option.value === 'No';
        
        if (isNoOption) {
          await option.radio.click(); // Use click instead of check for better compatibility
          console.log(`    ✓ Clicked "No" option (value="${option.value}", label="${option.label}")`);
          selected = true;
          break;
        }
      }
      
      // If we couldn't find "No", this might be a different type of radio group
      // For yes/no questions, often the second option is "No"
      if (!selected && groupRadios.length === 2) {
        // Check if this looks like a yes/no question
        let isYesNo = false;
        for (const radio of groupRadios) {
          const radioValue = await radio.getAttribute('value') || '';
          if (radioValue.toLowerCase() === 'true' || radioValue.toLowerCase() === 'yes') {
            isYesNo = true;
            break;
          }
        }
        
        if (isYesNo) {
          // Select the second option (usually "No")
          await groupRadios[1].check();
          console.log(`    ✓ Selected second option (assumed to be "No")`);
          selected = true;
        }
      }
      
      // If still not selected and it's required, select first option
      if (!selected && groupRadios.length > 0) {
        await groupRadios[0].check();
        console.log(`    ✓ Selected first option (default)`);
      }
    }
  }
  
  console.log('✅ Form inputs filled');
}

/**
 * Generate appropriate value for a field based on its context and label
 */
async function generateSmartValueForField(fieldContext: string, labelText: string): Promise<string> {
  // First try to get answer from our comprehensive mapping
  if (labelText) {
    // Clean up the label text first
    let cleanLabel = labelText.trim();
    cleanLabel = cleanLabel.replace(/I don't know.*$/i, '').trim();
    cleanLabel = cleanLabel.replace(/\s+/g, ' '); // Normalize whitespace
    
    const answer = getAnswerForQuestion(cleanLabel);
    if (answer && answer !== 'Test Entry') {
      return answer;
    }
  }
  
  // Extract fieldId from context if available
  const fieldIdMatch = fieldContext.match(/name="([^"]+)"|id="([^"]+)"/);
  if (fieldIdMatch) {
    const fieldId = fieldIdMatch[1] || fieldIdMatch[2];
    if (fieldId) {
      const answer = getAnswerForFieldId(fieldId);
      if (answer && answer !== 'Test Entry') {
        return answer;
      }
    }
  }
  
  // Fallback to pattern matching
  const context = fieldContext.toLowerCase();
  const label = labelText.toLowerCase();
  
  // Email fields
  if (context.includes('email') || label.includes('email')) {
    return `test${Date.now()}@example.com`;
  }
  
  // Phone fields
  if (context.includes('phone') || context.includes('mobile') || context.includes('cell') || 
      label.includes('phone') || label.includes('mobile')) {
    return '(713) 555-' + Math.floor(1000 + Math.random() * 9000).toString();
  }
  
  // Name fields
  if (label.includes('first name') || context.includes('firstname') || context.includes('first_name')) {
    return 'John';
  }
  if (label.includes('last name') || context.includes('lastname') || context.includes('last_name')) {
    return 'Smith';
  }
  if (label.includes('middle name') || context.includes('middle')) {
    return 'Michael';
  }
  if (label.includes('full name') || (context.includes('name') && !context.includes('first') && !context.includes('last'))) {
    return 'John Michael Smith';
  }
  
  // Address fields
  if (context.includes('address') || context.includes('street') || label.includes('address')) {
    return '123 Test Street';
  }
  if (context.includes('city') || label.includes('city')) {
    return 'Houston';
  }
  if (context.includes('state') || label.includes('state')) {
    return 'TX';
  }
  if (context.includes('zip') || context.includes('postal') || label.includes('zip')) {
    return '77001';
  }
  
  // Financial fields
  if (context.includes('price') || context.includes('amount') || label.includes('price') || label.includes('amount')) {
    if (context.includes('purchase') || label.includes('purchase')) {
      return '425000';
    }
    if (context.includes('earnest') || label.includes('earnest')) {
      return '10000';
    }
    if (context.includes('option') || label.includes('option')) {
      return '500';
    }
    if (context.includes('down') || label.includes('down')) {
      return '85000';
    }
    return Math.floor(10000 + Math.random() * 90000).toString();
  }
  
  // Percentage fields
  if (context.includes('percent') || context.includes('rate') || context.includes('%') || 
      label.includes('percent') || label.includes('rate')) {
    return '3.5';
  }
  
  // Date fields
  if (context.includes('date') || label.includes('date')) {
    if (context.includes('closing') || label.includes('closing')) {
      // Closing date 45 days from now
      return new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    if (context.includes('birth') || label.includes('birth')) {
      return '1985-06-15';
    }
    // Default to 30 days from now
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }
  
  // Time/Days fields
  if (context.includes('days') || label.includes('days')) {
    if (context.includes('option') || label.includes('option')) {
      return '10';
    }
    return '30';
  }
  
  // Year fields
  if (context.includes('year') || label.includes('year')) {
    if (context.includes('built') || label.includes('built')) {
      return '2015';
    }
    return new Date().getFullYear().toString();
  }
  
  // Property specific fields
  if (context.includes('bedroom') || label.includes('bedroom')) {
    return '3';
  }
  if (context.includes('bathroom') || label.includes('bathroom')) {
    return '2';
  }
  if (context.includes('sqft') || context.includes('square') || label.includes('square feet')) {
    return '2500';
  }
  if (context.includes('lot size') || label.includes('lot size')) {
    return '0.25';
  }
  if (context.includes('hoa') || label.includes('hoa')) {
    return '150';
  }
  if (context.includes('mls') || label.includes('mls')) {
    return 'MLS' + Math.floor(10000000 + Math.random() * 90000000);
  }
  
  // Company/Business fields
  if (context.includes('company') || context.includes('business') || label.includes('company')) {
    return 'ABC Realty LLC';
  }
  if (context.includes('agent') || label.includes('agent')) {
    return 'Jane Anderson - Premier Realty';
  }
  if (context.includes('broker') || label.includes('broker')) {
    return 'Texas Premier Brokers';
  }
  
  // Legal fields
  if ((context.includes('legal') && context.includes('description')) || label.includes('legal description')) {
    return 'Lot 15, Block 3, River Oaks Subdivision, Harris County, Texas';
  }
  
  // SSN/Tax ID (use test patterns)
  if (context.includes('ssn') || context.includes('social')) {
    return '123-45-6789';
  }
  if (context.includes('tax') && context.includes('id')) {
    return '12-3456789';
  }
  
  // License numbers
  if (context.includes('license') || label.includes('license')) {
    return 'LIC' + Math.floor(100000 + Math.random() * 900000);
  }
  
  // Yes/No questions (look for question marks)
  if (label.includes('?')) {
    // For yes/no questions, generally answer "No" for safety
    return 'No';
  }
  
  // Number fields
  if (context.includes('number') || context.includes('qty') || context.includes('quantity')) {
    return '1';
  }
  
  // If it contains "name" but we haven't matched it yet
  if (context.includes('name') || label.includes('name')) {
    return 'Test User';
  }
  
  // Default for any other text field
  return 'Test Entry';
}

/**
 * Navigate to the next form section
 */
export async function navigateToNextFormSection(page: Page): Promise<boolean> {
  console.log('➡️ Navigating to next section...');
  
  // Look for Next/Continue button
  const nextButtons = [
    'button:has-text("Next")',
    'button:has-text("Continue")',
    'button:has-text("Save & Continue")',
    'button:has-text("Save and Continue")',
    'button[type="submit"]:has-text("Next")',
    'button[type="submit"]:has-text("Continue")'
  ];
  
  for (const selector of nextButtons) {
    const button = page.locator(selector).first();
    if (await button.count() > 0 && await button.isVisible()) {
      const isEnabled = await button.isEnabled();
      if (isEnabled) {
        await button.click();
        console.log(`✅ Clicked "${await button.textContent()}" button`);
        
        // Wait for navigation
        await page.waitForTimeout(2000);
        return true;
      } else {
        console.log(`⚠️ "${await button.textContent()}" button is disabled`);
      }
    }
  }
  
  console.log('⚠️ No next/continue button found');
  return false;
}

/**
 * Complete an entire form page: fill all inputs and navigate to next
 */
export async function completeFormPage(page: Page, pageName: string, customValues?: Record<string, string>): Promise<void> {
  console.log(`\n📋 Completing form page: ${pageName}`);
  
  // Fill all inputs on this page
  await fillAllFormInputs(page, customValues);
  
  // Wait a moment for any validation
  await page.waitForTimeout(1000);
  
  // Navigate to next section
  const navigated = await navigateToNextFormSection(page);
  
  if (navigated) {
    console.log(`✅ Completed ${pageName} and moved to next section`);
  } else {
    console.log(`⚠️ Could not navigate from ${pageName}`);
  }
}

/**
 * Identify current form page based on visible headings/labels
 */
export async function identifyCurrentFormPage(page: Page): Promise<string> {
  // First, look for question text which is often in larger labels
  const questionSelectors = [
    'label.text-lg:visible',
    'label.text-xl:visible', 
    'p.text-lg:visible',
    'div.text-lg:visible',
    'label:has(span.text-red-500):visible', // Labels with required asterisk
    '.question-text:visible',
    '[class*="question"]:visible'
  ];
  
  for (const selector of questionSelectors) {
    try {
      const question = page.locator(selector).first();
      if (await question.count() > 0) {
        const text = await question.textContent();
        // Clean up the text - remove "I don't know" and other UI elements
        if (text && text.length > 5 && !text.includes('undefined')) {
          let cleanText = text.trim();
          // Remove "I don't know" or similar UI elements
          cleanText = cleanText.replace(/I don't know.*$/i, '').trim();
          cleanText = cleanText.replace(/\s+/g, ' '); // Normalize whitespace
          if (cleanText.length > 5) {
            return cleanText;
          }
        }
      }
    } catch {}
  }
  
  // Look for page headings
  const headings = [
    'h1:visible',
    'h2:visible',
    'h3:visible',
    '.page-title:visible',
    '.form-title:visible'
  ];
  
  for (const selector of headings) {
    const heading = page.locator(selector).first();
    if (await heading.count() > 0) {
      const text = await heading.textContent();
      if (text) {
        return text.trim();
      }
    }
  }
  
  // Look for form labels as fallback
  const labels = await page.locator('label:visible').all();
  if (labels.length > 0) {
    const firstLabel = await labels[0].textContent();
    if (firstLabel) {
      return firstLabel.trim();
    }
  }
  
  return 'Unknown Form Page';
}