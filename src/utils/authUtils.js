/**
 * Utilities for authentication and authorization
 */
import { fetchAuthSession } from "aws-amplify/auth";

// Hardcoded admin user ID
const ADMIN_USER_ID = "79ff44e1-9e1b-47cd-9bbd-f848415a4883";

/**
 * Check if the current user is an admin based on hardcoded user ID
 * @returns {Promise<boolean>} True if user is an admin, false otherwise
 */
export const isUserInAdminGroup = async () => {
  try {
    // Get the current auth session
    const session = await fetchAuthSession();

    if (!session || !session.tokens || !session.tokens.accessToken) {
      console.warn("No valid auth session available");
      return false;
    }

    // Check if user's sub matches the admin ID by looking at the sub claim in the token payload
    const userSub = session.tokens.accessToken.payload["sub"];
    return userSub === ADMIN_USER_ID;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Get user sub (ID) of current user from JWT token
 * @returns {Promise<string|null>} User sub or null if not available
 */
export const getUserSub = async () => {
  try {
    const session = await fetchAuthSession();
    return session?.tokens?.accessToken?.payload["sub"] || null;
  } catch (error) {
    console.error("Error fetching user sub:", error);
    return null;
  }
};

/**
 * Get all Cognito groups for the current user
 * @returns {Promise<string[]>} Array of group names
 */
export const getUserGroups = async () => {
  try {
    // Get the current auth session
    const session = await fetchAuthSession();

    if (!session || !session.tokens || !session.tokens.accessToken) {
      console.warn("No valid auth session available");
      return [];
    }

    // Return the groups from the accessToken payload
    return session.tokens.accessToken.payload["cognito:groups"] || [];
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }
};
