import { supabase } from '@/lib/supabase'

/**
 * Handle authentication flows from email links (password reset, email confirmation)
 * This must be called BEFORE Vue Router initializes to properly handle auth tokens
 */
export async function initializeAuth() {
  // Check if we have auth params in the URL
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const accessToken = hashParams.get('access_token')
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
    console.log('Password recovery token detected')

    // For recovery tokens, Supabase should auto-detect and establish session
    // since we have detectSessionInUrl: true in our config
    // We need to give it time to process
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      // Check if the recovery session was established
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
        throw error
      }

      if (session) {
        console.log('Recovery session established successfully')
        // Keep the URL params for now, the Auth component will handle cleanup
        // Just navigate to reset password with the params intact
        return { type: 'recovery', session }
      } else {
        // Session not established, but we have recovery token
        // This might happen if Supabase hasn't processed it yet
        console.log('Session not yet established, will retry in component')
        return { type: 'recovery', pending: true }
      }
    } catch (err) {
      console.error('Failed to establish recovery session:', err)
      window.location.hash = '#/forgot-password'
      return { error: 'Failed to establish recovery session. Please request a new password reset link.' }
    }
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