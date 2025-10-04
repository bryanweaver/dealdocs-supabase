import { supabase } from '@/lib/supabase'

/**
 * Handle authentication flows from email links (password reset, email confirmation)
 * This must be called BEFORE Vue Router initializes to properly handle auth tokens
 */
export async function initializeAuth() {
  // For Supabase v2 with detectSessionInUrl: true,
  // the client should automatically handle the tokens
  // We just need to check what type of auth event occurred

  // Parse the URL to check what type of auth flow this is
  const hashFragment = window.location.hash.substring(1)
  const hashParams = new URLSearchParams(hashFragment)
  const type = hashParams.get('type')
  const error = hashParams.get('error')
  const errorDescription = hashParams.get('error_description')

  // Handle auth errors from Supabase
  if (error) {
    console.error('Auth error from Supabase:', error, errorDescription)
    // Clear the error params from URL
    window.location.hash = '#/auth'
    return { error: errorDescription || error }
  }

  // Handle recovery tokens (password reset)
  if (type === 'recovery') {
    console.log('Password recovery flow detected')

    // Supabase should handle this automatically with detectSessionInUrl: true
    // The recovery session will be available after the auth state changes
    // We don't need to do anything here, just return the type
    return { type: 'recovery' }
  }

  // Handle email confirmation
  if (type === 'signup' || type === 'invite') {
    console.log('Email confirmation detected')
    // Clean up URL and redirect to confirmation page
    window.location.hash = '#/auth/confirm'
    return { type: 'confirmation' }
  }

  return { type: 'none' }
}