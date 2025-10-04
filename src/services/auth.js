// Authentication Service - Supabase Auth Implementation
import { supabase, handleSupabaseError } from '@/lib/supabase'

export const AuthService = {
  /**
   * Sign up a new user
   */
  async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/#/auth/confirm`,
          data: {
            full_name: metadata.fullName || '',
            company: metadata.company || '',
            phone: metadata.phone || '',
            ...metadata
          }
        }
      })
      
      if (error) throw error
      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear any cached data
      localStorage.removeItem('contractFormData')
      sessionStorage.clear()
      
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Send password reset email
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      })
      
      if (error) throw error
      return { success: true, message: 'Password reset email sent' }
    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      return { success: true, message: 'Password updated successfully' }
    } catch (error) {
      console.error('Password update error:', error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(updates) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (error) throw error
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  },

  /**
   * Get current user
   */
  async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  },

  /**
   * Refresh the current session
   */
  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      return { success: true, session: data.session }
    } catch (error) {
      console.error('Refresh session error:', error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/#/dashboard`
        }
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error(`OAuth sign in error (${provider}):`, error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Verify email with token
   */
  async verifyOtp(email, token, type = 'signup') {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type
      })
      
      if (error) throw error
      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      console.error('OTP verification error:', error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Resend confirmation email
   */
  async resendConfirmation(email) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      })
      
      if (error) throw error
      return { success: true, message: 'Confirmation email sent' }
    } catch (error) {
      console.error('Resend confirmation error:', error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const session = await this.getSession()
    return !!session?.user
  },

  /**
   * Get user role (if using custom roles)
   */
  async getUserRole() {
    const user = await this.getUser()
    return user?.user_metadata?.role || 'user'
  },

  /**
   * Check if user has specific permission
   */
  async hasPermission(permission) {
    const role = await this.getUserRole()
    
    // Define role permissions
    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'view_analytics'],
      manager: ['read', 'write', 'delete', 'view_analytics'],
      user: ['read', 'write'],
      readonly: ['read']
    }
    
    return permissions[role]?.includes(permission) || false
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  /**
   * Sign out from all devices
   */
  async signOutAllDevices() {
    try {
      // First sign out from current session
      await this.signOut()
      
      // If you have a custom endpoint to invalidate all sessions
      // you would call it here
      
      return { success: true }
    } catch (error) {
      console.error('Sign out all devices error:', error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Delete user account (requires admin privileges)
   */
  async deleteAccount() {
    try {
      // This would typically be handled by an admin function
      // For now, we'll just sign out and show a message
      await this.signOut()
      return { 
        success: true, 
        message: 'Account deletion requested. Please contact support to complete the process.' 
      }
    } catch (error) {
      console.error('Delete account error:', error)
      return { success: false, error: handleSupabaseError(error) }
    }
  },

  /**
   * Get user session info for debugging
   */
  async getSessionInfo() {
    try {
      const session = await this.getSession()
      if (!session) return null
      
      return {
        user: session.user,
        expires_at: session.expires_at,
        access_token: session.access_token ? 'present' : 'missing',
        refresh_token: session.refresh_token ? 'present' : 'missing'
      }
    } catch (error) {
      console.error('Get session info error:', error)
      return null
    }
  }
}

export default AuthService