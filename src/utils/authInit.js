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
  if (accessToken && type === 'recovery') {
    console.log('Password recovery token detected, establishing session...')

    // Let Supabase process the recovery token
    // The detectSessionInUrl setting will handle this automatically
    // We just need to wait for it to complete
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if the session was established
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (session) {
      console.log('Recovery session established successfully')
      // Clean up URL and redirect to reset password page
      window.location.hash = '#/reset-password'
      return { type: 'recovery', session }
    } else {
      console.error('Failed to establish recovery session:', sessionError)
      window.location.hash = '#/auth'
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