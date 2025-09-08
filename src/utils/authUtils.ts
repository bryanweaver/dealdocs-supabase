import { supabase } from "@/lib/supabase";

export async function isUserInAdminGroup(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Check if user has admin role
    // This is a placeholder - you may need to adjust based on your actual admin logic
    const userMetadata = user.user_metadata;
    return userMetadata?.role === 'admin' || userMetadata?.isAdmin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAuthenticated(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}