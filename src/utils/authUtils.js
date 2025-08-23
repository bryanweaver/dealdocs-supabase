/**
 * Utilities for authentication and authorization - Supabase version
 */
// AuthService import removed - not used in this file
import { getUser } from "@/lib/supabase.js";

// Hardcoded admin user ID (update this to match Supabase user ID)
const ADMIN_USER_ID = "79ff44e1-9e1b-47cd-9bbd-f848415a4883";

/**
 * Check if the current user is an admin based on hardcoded user ID
 * @returns {Promise<boolean>} True if user is an admin, false otherwise
 */
export const isUserInAdminGroup = async () => {
  try {
    // Get the current user from Supabase
    const user = await getUser();

    if (!user) {
      console.warn("No valid user session available");
      return false;
    }

    // Check if user's ID matches the admin ID
    return user.id === ADMIN_USER_ID;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Get user ID of current user
 * @returns {Promise<string|null>} User ID or null if not available
 */
export const getUserSub = async () => {
  try {
    const user = await getUser();
    return user?.id || null;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};

/**
 * Get user role from user metadata
 * @returns {Promise<string>} User role (admin, manager, user, readonly)
 */
export const getUserRole = async () => {
  try {
    const user = await getUser();
    return user?.user_metadata?.role || 'user';
  } catch (error) {
    console.error("Error fetching user role:", error);
    return 'user';
  }
};

/**
 * Check if user has specific permission based on role
 * @returns {Promise<boolean>} True if user has permission
 */
export const hasPermission = async (permission) => {
  try {
    const role = await getUserRole();
    
    // Define role permissions
    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'view_analytics'],
      manager: ['read', 'write', 'delete', 'view_analytics'],
      user: ['read', 'write'],
      readonly: ['read']
    };
    
    return permissions[role]?.includes(permission) || false;
  } catch (error) {
    console.error("Error checking user permission:", error);
    return false;
  }
};

/**
 * Get user groups/roles (compatibility function)
 * @returns {Promise<string[]>} Array of role names
 */
export const getUserGroups = async () => {
  try {
    const role = await getUserRole();
    return role === 'admin' ? ['admin'] : ['user'];
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }
};
