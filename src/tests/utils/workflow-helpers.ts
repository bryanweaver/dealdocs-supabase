/**
 * Comprehensive workflow helpers for e2e tests
 * Handles form filling, file uploads, and contract generation
 */
import { Page, expect } from '@playwright/test';
import path from 'path';

export interface PropertyData {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType?: string;
  bedrooms?: string;
  bathrooms?: string;
  squareFeet?: string;
  lotSize?: string;
  yearBuilt?: string;
  subdivision?: string;
  county?: string;
  mlsNumber?: string;
  legalDescription?: string;
}

export interface PartiesData {
  buyerFirstName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone: string;
  sellerFirstName: string;
  sellerLastName: string;
  sellerEmail: string;
  sellerPhone: string;
  buyerAgent?: string;
  sellerAgent?: string;
}

export interface FinancialData {
  purchasePrice: string;
  earnestMoney: string;
  optionFee: string;
  optionPeriodDays: string;
  downPayment: string;
  loanAmount: string;
  closingDate: string;
  titleCompany?: string;
  escrowAgent?: string;
}

/**
 * Fill property information form
 */
export async function fillPropertyData(page: Page, data: PropertyData): Promise<void> {
  console.log('📝 Filling property data...');
  
  for (const [field, value] of Object.entries(data)) {
    if (value === undefined) continue;
    
    // Try multiple selector strategies
    const selectors = [
      `input[name="${field}"]`,
      `input[id="${field}"]`,
      `input[name*="${field}" i]`,
      `input[placeholder*="${field.replace(/([A-Z])/g, ' $1').trim()}" i]`,
      `textarea[name="${field}"]`,
      `textarea[id="${field}"]`
    ];
    
    for (const selector of selectors) {
      const input = page.locator(selector).first();
      if (await input.count() > 0 && await input.isVisible()) {
        await input.fill(value);
        break;
      }
    }
  }
  
  // Handle dropdowns for property type
  if (data.propertyType) {
    const propertyTypeDropdown = page.locator('select[name*="propertyType" i], [role="combobox"][aria-label*="property type" i]').first();
    if (await propertyTypeDropdown.count() > 0) {
      await propertyTypeDropdown.selectOption({ label: data.propertyType });
    }
  }
}

/**
 * Fill parties (buyer/seller) information
 */
export async function fillPartiesData(page: Page, data: PartiesData): Promise<void> {
  console.log('👥 Filling parties information...');
  
  // Fill buyer information
  await fillFormFields(page, {
    'buyer.firstName': data.buyerFirstName,
    'buyer.lastName': data.buyerLastName,
    'buyer.email': data.buyerEmail,
    'buyer.phone': data.buyerPhone,
    'buyerFirstName': data.buyerFirstName,
    'buyerLastName': data.buyerLastName,
    'buyerEmail': data.buyerEmail,
    'buyerPhone': data.buyerPhone
  });
  
  // Fill seller information
  await fillFormFields(page, {
    'seller.firstName': data.sellerFirstName,
    'seller.lastName': data.sellerLastName,
    'seller.email': data.sellerEmail,
    'seller.phone': data.sellerPhone,
    'sellerFirstName': data.sellerFirstName,
    'sellerLastName': data.sellerLastName,
    'sellerEmail': data.sellerEmail,
    'sellerPhone': data.sellerPhone
  });
  
  // Fill agent information if provided
  if (data.buyerAgent) {
    await fillFormFields(page, {
      'buyerAgent': data.buyerAgent,
      'buyer.agent': data.buyerAgent
    });
  }
  
  if (data.sellerAgent) {
    await fillFormFields(page, {
      'sellerAgent': data.sellerAgent,
      'seller.agent': data.sellerAgent
    });
  }
}

/**
 * Fill financial details
 */
export async function fillFinancialData(page: Page, data: FinancialData): Promise<void> {
  console.log('💰 Filling financial details...');
  
  await fillFormFields(page, {
    'purchasePrice': data.purchasePrice,
    'purchase.price': data.purchasePrice,
    'earnestMoney': data.earnestMoney,
    'earnest.money': data.earnestMoney,
    'optionFee': data.optionFee,
    'option.fee': data.optionFee,
    'optionPeriodDays': data.optionPeriodDays,
    'option.period.days': data.optionPeriodDays,
    'downPayment': data.downPayment,
    'down.payment': data.downPayment,
    'loanAmount': data.loanAmount,
    'loan.amount': data.loanAmount,
    'closingDate': data.closingDate,
    'closing.date': data.closingDate
  });
  
  if (data.titleCompany) {
    await fillFormFields(page, {
      'titleCompany': data.titleCompany,
      'title.company': data.titleCompany
    });
  }
  
  if (data.escrowAgent) {
    await fillFormFields(page, {
      'escrowAgent': data.escrowAgent,
      'escrow.agent': data.escrowAgent
    });
  }
}

/**
 * Generic form field filler
 */
async function fillFormFields(page: Page, fields: Record<string, string>): Promise<void> {
  for (const [fieldName, value] of Object.entries(fields)) {
    if (!value) continue;
    
    // Try multiple selector strategies
    const selectors = [
      `input[name="${fieldName}"]`,
      `input[id="${fieldName}"]`,
      `input[name*="${fieldName}" i]`,
      `textarea[name="${fieldName}"]`,
      `textarea[id="${fieldName}"]`,
      `input[placeholder*="${fieldName.replace(/[._]/g, ' ')}" i]`
    ];
    
    for (const selector of selectors) {
      const input = page.locator(selector).first();
      if (await input.count() > 0 && await input.isVisible()) {
        await input.fill(value);
        break;
      }
    }
  }
}

/**
 * Upload a document
 */
export async function uploadDocument(page: Page, filePath: string): Promise<void> {
  console.log(`📎 Uploading document: ${filePath}`);
  
  // Look for file input
  const fileInput = page.locator('input[type="file"]').first();
  
  if (await fileInput.count() > 0) {
    // Set the file directly on the input
    await fileInput.setInputFiles(filePath);
    
    // Wait for upload to process
    await page.waitForTimeout(2000);
    
    // Check for upload success indicator
    const successIndicators = [
      page.locator('text=/upload.*success/i'),
      page.locator('text=/file.*uploaded/i'),
      page.locator('.p-badge:has-text("Uploaded")'),
      page.locator('[data-pc-name="badge"]:has-text("Uploaded")')
    ];
    
    for (const indicator of successIndicators) {
      if (await indicator.count() > 0) {
        console.log('✅ Document uploaded successfully');
        return;
      }
    }
  } else {
    // Look for upload button to trigger file dialog
    const uploadButton = page.locator('button:has-text("Upload"), button:has-text("Add Document"), button:has-text("Choose File")').first();
    if (await uploadButton.count() > 0) {
      // Use the file chooser event
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        uploadButton.click()
      ]);
      
      await fileChooser.setFiles(filePath);
      await page.waitForTimeout(2000);
      console.log('✅ Document uploaded via file chooser');
    }
  }
}

/**
 * Generate PDF contract
 */
export async function generateContract(page: Page): Promise<boolean> {
  console.log('📄 Generating PDF contract...');
  
  // Look for generate/preview button
  const generateButtons = [
    page.locator('button:has-text("Generate Contract")'),
    page.locator('button:has-text("Generate PDF")'),
    page.locator('button:has-text("Create Contract")'),
    page.locator('button:has-text("Preview Contract")'),
    page.locator('button:has-text("Generate")')
  ];
  
  let buttonClicked = false;
  for (const button of generateButtons) {
    if (await button.count() > 0 && await button.isVisible()) {
      await button.click();
      buttonClicked = true;
      break;
    }
  }
  
  if (!buttonClicked) {
    console.log('⚠️ Could not find generate contract button');
    return false;
  }
  
  // Wait for PDF generation (this might take a while with Anvil API)
  console.log('⏳ Waiting for PDF generation...');
  
  // Look for success indicators
  const successIndicators = [
    page.locator('text=/contract.*generated/i'),
    page.locator('text=/pdf.*ready/i'),
    page.locator('text=/success/i'),
    page.locator('.p-toast-message-success'),
    page.locator('[role="alert"]:has-text("success")')
  ];
  
  // Wait up to 30 seconds for PDF generation
  for (let i = 0; i < 30; i++) {
    for (const indicator of successIndicators) {
      if (await indicator.count() > 0) {
        console.log('✅ Contract PDF generated successfully');
        return true;
      }
    }
    
    // Check for PDF viewer/iframe
    const pdfFrame = page.frameLocator('iframe[src*="pdf"], iframe[src*="anvil"]');
    if (await pdfFrame.locator('canvas').count() > 0) {
      console.log('✅ PDF displayed in viewer');
      return true;
    }
    
    await page.waitForTimeout(1000);
  }
  
  console.log('⚠️ PDF generation may have timed out');
  return false;
}

/**
 * Send contract via email
 */
export async function sendContractEmail(page: Page, recipientEmail: string): Promise<boolean> {
  console.log(`📧 Sending contract to ${recipientEmail}...`);
  
  // Look for send/email button
  const sendButtons = [
    page.locator('button:has-text("Send Contract")'),
    page.locator('button:has-text("Email Contract")'),
    page.locator('button:has-text("Send to Agent")'),
    page.locator('button:has-text("Send Email")'),
    page.locator('button:has-text("Send")')
  ];
  
  let buttonFound = false;
  for (const button of sendButtons) {
    if (await button.count() > 0 && await button.isVisible()) {
      await button.click();
      buttonFound = true;
      break;
    }
  }
  
  if (!buttonFound) {
    console.log('⚠️ Could not find send email button');
    return false;
  }
  
  // Wait for email dialog/form
  await page.waitForTimeout(1000);
  
  // Fill recipient email if there's an input field
  const emailInputs = [
    page.locator('input[name*="email" i][type="email"]'),
    page.locator('input[placeholder*="email" i]'),
    page.locator('input[name="recipientEmail"]'),
    page.locator('input[name="agentEmail"]')
  ];
  
  for (const input of emailInputs) {
    if (await input.count() > 0 && await input.isVisible()) {
      await input.fill(recipientEmail);
      break;
    }
  }
  
  // Look for confirmation send button
  const confirmButtons = [
    page.locator('button:has-text("Confirm Send")'),
    page.locator('button:has-text("Send Now")'),
    page.locator('button[type="submit"]:has-text("Send")'),
    page.locator('.p-dialog button:has-text("Send")')
  ];
  
  for (const button of confirmButtons) {
    if (await button.count() > 0 && await button.isVisible()) {
      await button.click();
      break;
    }
  }
  
  // Wait for success confirmation
  console.log('⏳ Waiting for email confirmation...');
  
  const emailSuccessIndicators = [
    page.locator('text=/email.*sent/i'),
    page.locator('text=/contract.*sent/i'),
    page.locator('text=/successfully.*sent/i'),
    page.locator('.p-toast-message-success:has-text("sent")'),
    page.locator('[role="alert"]:has-text("sent")')
  ];
  
  // Wait up to 10 seconds for email confirmation
  for (let i = 0; i < 10; i++) {
    for (const indicator of emailSuccessIndicators) {
      if (await indicator.count() > 0) {
        console.log('✅ Contract email sent successfully');
        return true;
      }
    }
    await page.waitForTimeout(1000);
  }
  
  console.log('⚠️ Could not confirm email was sent');
  return false;
}

/**
 * Navigate through contract workflow sections
 */
export async function navigateToNextSection(page: Page): Promise<void> {
  const navigationButtons = [
    page.locator('button:has-text("Continue")'),
    page.locator('button:has-text("Next")'),
    page.locator('button:has-text("Save & Continue")'),
    page.locator('button[type="submit"]')
  ];
  
  for (const button of navigationButtons) {
    if (await button.count() > 0 && await button.isVisible() && await button.isEnabled()) {
      await button.click();
      await page.waitForTimeout(1000);
      break;
    }
  }
}

/**
 * Complete the full contract workflow
 */
export async function completeFullWorkflow(
  page: Page,
  propertyData: PropertyData,
  partiesData: PartiesData,
  financialData: FinancialData,
  documentPath?: string,
  recipientEmail?: string
): Promise<boolean> {
  console.log('🚀 Starting complete contract workflow...');
  
  // Fill property data
  await fillPropertyData(page, propertyData);
  await navigateToNextSection(page);
  
  // Fill parties data
  await fillPartiesData(page, partiesData);
  await navigateToNextSection(page);
  
  // Fill financial data
  await fillFinancialData(page, financialData);
  await navigateToNextSection(page);
  
  // Upload document if provided
  if (documentPath) {
    await uploadDocument(page, documentPath);
    await navigateToNextSection(page);
  }
  
  // Generate contract PDF
  const pdfGenerated = await generateContract(page);
  if (!pdfGenerated) {
    console.log('❌ Failed to generate contract PDF');
    return false;
  }
  
  // Send email if recipient provided
  if (recipientEmail) {
    const emailSent = await sendContractEmail(page, recipientEmail);
    if (!emailSent) {
      console.log('❌ Failed to send contract email');
      return false;
    }
  }
  
  console.log('✅ Complete workflow finished successfully');
  return true;
}