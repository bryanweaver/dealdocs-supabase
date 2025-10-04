import { supabase } from '@/lib/supabase'

/**
 * Handle authentication flows from email links (password reset, email confirmation)
 * This must be called BEFORE Vue Router initializes to properly handle auth tokens
 */
export async function initializeAuth() {
  // Store the original URL for processing
  const fullUrl = window.location.href
  console.log('Full URL:', fullUrl)

  // Check if we have tokens in the URL (either as hash or as path)
  let hashFragment = ''

  // Check if tokens are in the hash
  if (window.location.hash && window.location.hash.includes('access_token')) {
    hashFragment = window.location.hash.substring(1)
    // Remove leading slash if present (Vue Router adds it)
    if (hashFragment.startsWith('/')) {
      hashFragment = hashFragment.substring(1)
    }
  }
  // Check if tokens are in the pathname (Vue Router issue)
  else if (window.location.pathname.includes('access_token')) {
    // Extract everything after the first /
    hashFragment = window.location.pathname.substring(1)
  }
  // Check the full URL for tokens
  else if (fullUrl.includes('access_token')) {
    // Extract the token params from wherever they are
    const tokenStart = fullUrl.indexOf('access_token')
    hashFragment = fullUrl.substring(tokenStart)
  }

  console.log('Hash fragment to parse:', hashFragment)

  const hashParams = new URLSearchParams(hashFragment)
  const accessToken = hashParams.get('access_token')
  const refreshToken = hashParams.get('refresh_token')
  const type = hashParams.get('type')
  const error = hashParams.get('error')
  const errorDescription = hashParams.get('error_description')

  console.log('Parsed params:', {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    type: type,
    error: error
  })

  // Handle auth errors from Supabase
  if (error) {
    console.error('Auth error from Supabase:', error, errorDescription)
    // Clear the error params from URL
    window.location.hash = '#/auth'
    return { error: errorDescription || error }
  }

  // Handle recovery tokens (password reset)
  if (type === 'recovery' && accessToken) {
    console.log('Password recovery flow detected')
    console.log('Access token found:', accessToken ? 'Yes' : 'No')
    console.log('Refresh token found:', refreshToken ? 'Yes' : 'No')

    try {
      // Manually set the session with the provided tokens
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '' // Handle missing refresh token
      })

      if (error) {
        console.error('Failed to set recovery session:', error)
        throw error
      }

      if (data?.session) {
        console.log('Recovery session established successfully!')
        // Store the session info
        localStorage.setItem('recovery_session', 'true')
        // Clear the URL and redirect properly
        window.history.replaceState({}, document.title, window.location.origin)
        window.location.hash = '#/reset-password'
        return { type: 'recovery', session: data.session }
      } else {
        console.log('No session returned from setSession')
      }
    } catch (err) {
      console.error('Error establishing recovery session:', err)
      // Clear the broken URL
      window.history.replaceState({}, document.title, window.location.origin)
      window.location.hash = '#/forgot-password'
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