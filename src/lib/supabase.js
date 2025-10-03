import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper functions for common operations
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  return session
}

// Storage helpers
export const uploadFile = async (bucket, path, file, options = {}) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        ...options
      })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

export const downloadFile = async (bucket, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}

// Database helpers with error handling
export const dbQuery = async (query) => {
  try {
    const { data, error } = await query
    if (error) throw error
    return data
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Realtime subscription helper
export const subscribeToTable = (table, callback, filters = {}) => {
  let subscription = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table,
        ...filters
      }, 
      callback
    )
    .subscribe()
  
  return subscription
}

// Batch operations helper
export const batchInsert = async (table, records, batchSize = 100) => {
  const results = []
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)
    
    try {
      const { data, error } = await supabase
        .from(table)
        .insert(batch)
        .select()
      
      if (error) throw error
      results.push(...data)
    } catch (error) {
      console.error(`Error inserting batch ${i}-${i + batchSize}:`, error)
      throw error
    }
  }
  
  return results
}

// Auth state listener
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Error handling helper
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error)
  
  // Map common Supabase errors to user-friendly messages
  const errorMessages = {
    'Invalid login credentials': 'Invalid email or password',
    'User already registered': 'An account with this email already exists',
    'Email not confirmed': 'Please check your email and confirm your account',
    'Invalid email format': 'Please enter a valid email address',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long',
    'Row Level Security': 'You do not have permission to access this data'
  }
  
  return errorMessages[error.message] || error.message || 'An unexpected error occurred'
}

export default supabase