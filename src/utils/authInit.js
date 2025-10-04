import { supabase } from '@/lib/supabase'

/**
 * Handle authentication flows from email links (password reset, email confirmation)
 * This must be called BEFORE Vue Router initializes to properly handle auth tokens
 */
export async function initializeAuth() {
  // Store the original hash for later processing
  const originalHash = window.location.hash

  // Parse the URL to check what type of auth flow this is
  const hashFragment = window.location.hash.substring(1)
  const hashParams = new URLSearchParams(hashFragment)
  const accessToken = hashParams.get('access_token')
  const refreshToken = hashParams.get('refresh_token')
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
  if (type === 'recovery' && accessToken && refreshToken) {
    console.log('Password recovery flow detected with tokens')

    try {
      // Manually set the session with the provided tokens
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })

      if (error) {
        console.error('Failed to set recovery session:', error)
        throw error
      }

      if (data.session) {
        console.log('Recovery session established successfully!')
        // Store the session info
        localStorage.setItem('recovery_session', 'true')
        // Clear the URL hash of tokens
        window.location.hash = '#/reset-password'
        return { type: 'recovery', session: data.session }
      }
    } catch (err) {
      console.error('Error establishing recovery session:', err)
      // Keep the original URL so user can try again
      return { type: 'recovery', error: err.message }
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