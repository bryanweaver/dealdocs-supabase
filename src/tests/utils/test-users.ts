/**
 * Test user management utilities for Supabase
 * Handles creation and cleanup of test users
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Track all test users created during test run
const testUsers: Set<string> = new Set();

// Initialize Supabase admin client for cleanup
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Generate a unique test email
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test-${timestamp}-${random}@dealdocs.test`;
}

/**
 * Generate a secure test password
 */
export function generateTestPassword(): string {
  const timestamp = Date.now();
  return `Test@${timestamp}!Secure`;
}

/**
 * Track a test user for cleanup
 */
export function trackTestUser(email: string): void {
  testUsers.add(email.toLowerCase());
  console.log(`📝 Tracking test user for cleanup: ${email}`);
}

/**
 * Clean up all test users created during the test run
 */
export async function cleanupTestUsers(): Promise<void> {
  if (testUsers.size === 0) {
    console.log('✅ No test users to clean up');
    return;
  }

  console.log(`🧹 Cleaning up ${testUsers.size} test users...`);
  
  for (const email of testUsers) {
    try {
      // First, get the user ID
      const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (fetchError) {
        console.warn(`⚠️ Failed to list users: ${fetchError.message}`);
        continue;
      }

      const user = users?.users?.find(u => u.email?.toLowerCase() === email);
      
      if (user) {
        // Delete the user
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
        
        if (deleteError) {
          console.warn(`⚠️ Failed to delete test user ${email}: ${deleteError.message}`);
        } else {
          console.log(`✅ Deleted test user: ${email}`);
        }
        
        // Also clean up any data associated with this user
        // Delete contracts
        await supabaseAdmin
          .from('contracts')
          .delete()
          .eq('user_id', user.id);
        
        // Delete audit logs
        await supabaseAdmin
          .from('audit_log')
          .delete()
          .eq('user_id', user.id);
          
      } else {
        console.log(`ℹ️ Test user not found (may already be deleted): ${email}`);
      }
    } catch (error) {
      console.warn(`⚠️ Error cleaning up test user ${email}:`, error);
    }
  }
  
  // Clear the set after cleanup
  testUsers.clear();
  console.log('✅ Test user cleanup completed');
}

/**
 * Create a test user via Supabase Auth
 */
export async function createTestUser(email?: string, password?: string) {
  const testEmail = email || generateTestEmail();
  const testPassword = password || generateTestPassword();
  
  // Track for cleanup
  trackTestUser(testEmail);
  
  // Create user via Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true, // Auto-confirm email for testing
    user_metadata: {
      full_name: `Test User ${Date.now()}`,
      is_test_user: true
    }
  });
  
  if (error) {
    throw new Error(`Failed to create test user: ${error.message}`);
  }
  
  console.log(`✅ Created test user: ${testEmail}`);
  
  return {
    email: testEmail,
    password: testPassword,
    userId: data.user?.id
  };
}

/**
 * Get list of all tracked test users
 */
export function getTrackedTestUsers(): string[] {
  return Array.from(testUsers);
}