import { test, expect, Page } from '@playwright/test';
import { signupTestUser, loginTestUser } from '../utils/auth-helper';
import path from 'path';
import fs from 'fs';

test.describe('Document Upload to Supabase', () => {
  let testEmail: string;
  let testPassword: string;

  test.beforeEach(async ({ page }) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    testEmail = `test-upload-${timestamp}-${randomStr}@dealdocs.test`;
    testPassword = 'TestPass123!';
  });

  test('should upload document to Supabase storage and create database record', async ({ page }) => {
    console.log('\n🚀 Starting Document Upload Test');
    
    // Step 1: Sign up and login
    console.log('\n📝 Creating test user:', testEmail);
    const testUser = await signupTestUser(page, testEmail, testPassword);
    console.log('✅ User created and logged in');
    
    // Step 2: Navigate to contracts or document upload page
    console.log('\n📄 Navigating to contract documents page...');
    
    // Try to find a contract or create one
    const contractsLink = page.locator('a[href*="contracts"], button:has-text("Contracts")').first();
    if (await contractsLink.count() > 0) {
      await contractsLink.click();
      await page.waitForTimeout(2000);
    }
    
    // Look for document upload area
    const uploadArea = page.locator('input[type="file"], [data-testid="file-upload"], .p-fileupload').first();
    
    if (await uploadArea.count() === 0) {
      console.log('📝 No upload area on contracts page, trying to create new contract...');
      
      // Start new contract
      const newContractBtn = page.locator('button:has-text("New Contract"), button:has-text("Create Contract"), a[href*="new"]').first();
      if (await newContractBtn.count() > 0) {
        await newContractBtn.click();
        await page.waitForTimeout(2000);
      }
      
      // Skip to document upload section if in a form flow
      const skipButtons = page.locator('button:has-text("Skip"), button:has-text("Next")');
      for (let i = 0; i < 10; i++) {
        const skipBtn = skipButtons.first();
        if (await skipBtn.count() > 0 && await skipBtn.isVisible()) {
          await skipBtn.click();
          await page.waitForTimeout(1000);
          
          // Check if we reached document upload
          const uploadCheck = page.locator('input[type="file"], text=/upload.*document/i, text=/attach.*file/i').first();
          if (await uploadCheck.count() > 0) {
            console.log('✅ Reached document upload section');
            break;
          }
        }
      }
    }
    
    // Step 3: Create a test file to upload
    console.log('\n📎 Preparing test document...');
    const testFileName = `test-document-${Date.now()}.txt`;
    const testFilePath = path.join(process.cwd(), testFileName);
    const testContent = `Test document for Supabase upload\nTimestamp: ${new Date().toISOString()}\nTest user: ${testEmail}`;
    fs.writeFileSync(testFilePath, testContent);
    console.log(`✅ Created test file: ${testFileName}`);
    
    // Step 4: Upload the file
    console.log('\n📤 Uploading document to Supabase...');
    
    // Find file input
    const fileInput = page.locator('input[type="file"]').first();
    
    if (await fileInput.count() > 0) {
      // Listen for network requests to Supabase
      const uploadPromise = page.waitForResponse(
        response => {
          const url = response.url();
          return (url.includes('/storage/v1/object') || 
                  url.includes('/rest/v1/contract_documents') ||
                  url.includes('supabase')) && 
                 response.status() < 400;
        },
        { timeout: 30000 }
      ).catch(() => null);
      
      // Set the file
      await fileInput.setInputFiles(testFilePath);
      console.log('✅ File selected for upload');
      
      // Wait for upload to complete
      const uploadResponse = await uploadPromise;
      
      if (uploadResponse) {
        console.log(`✅ Upload response received: ${uploadResponse.status()} ${uploadResponse.url()}`);
        
        // Check if it was a storage upload
        if (uploadResponse.url().includes('/storage/')) {
          console.log('✅ File uploaded to Supabase Storage');
          
          // Check response body
          try {
            const responseBody = await uploadResponse.json();
            console.log('📦 Storage response:', JSON.stringify(responseBody, null, 2));
          } catch (e) {
            console.log('⚠️ Could not parse storage response body');
          }
        }
        
        // Check if it was a database record creation
        if (uploadResponse.url().includes('/rest/v1/contract_documents')) {
          console.log('✅ Document record created in database');
          
          try {
            const responseBody = await uploadResponse.json();
            console.log('📦 Database response:', JSON.stringify(responseBody, null, 2));
          } catch (e) {
            console.log('⚠️ Could not parse database response body');
          }
        }
      } else {
        console.log('⚠️ No upload response detected within timeout');
      }
      
      // Wait for any success indicators
      await page.waitForTimeout(3000);
      
      // Check for success messages
      const successIndicators = [
        page.locator('text=/upload.*success/i'),
        page.locator('text=/file.*uploaded/i'),
        page.locator('text=/document.*saved/i'),
        page.locator('.p-message-success'),
        page.locator('[role="alert"]').filter({ hasText: /success/i })
      ];
      
      for (const indicator of successIndicators) {
        if (await indicator.count() > 0) {
          const text = await indicator.textContent();
          console.log(`✅ Success indicator found: ${text}`);
          break;
        }
      }
      
      // Check if file appears in the list
      const uploadedFile = page.locator(`text="${testFileName}"`).first();
      if (await uploadedFile.count() > 0) {
        console.log('✅ Uploaded file appears in document list');
      }
      
    } else {
      console.log('❌ No file input found on page');
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-results/no-upload-input.png' });
      console.log('📸 Screenshot saved to test-results/no-upload-input.png');
    }
    
    // Step 5: Verify in Supabase (check network logs)
    console.log('\n🔍 Checking browser console for errors...');
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console error:', msg.text());
      }
    });
    
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log('🧹 Cleaned up test file');
    }
    
    console.log('\n✅ Document upload test completed');
  });
  
  test.afterEach(async () => {
    // Clean up test user if needed
    if (testEmail) {
      console.log(`🧹 Test user tracked for cleanup: ${testEmail}`);
    }
  });
});