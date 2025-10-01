import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, userEmail } = await req.json()

    if (!userId && !userEmail) {
      throw new Error('Either userId or userEmail is required')
    }

    // Initialize Supabase Admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Delete the user using admin privileges
    let result
    if (userId) {
      result = await supabaseAdmin.auth.admin.deleteUser(userId)
    } else {
      // First get user by email
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
      const user = users.find(u => u.email === userEmail)

      if (!user) {
        throw new Error(`User with email ${userEmail} not found`)
      }

      result = await supabaseAdmin.auth.admin.deleteUser(user.id)
    }

    if (result.error) {
      throw result.error
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User deleted successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Delete user error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})