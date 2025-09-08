import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, name, isDraft, isTest, files, data, signers, currentSigner, etchPacket } = await req.json()
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get user from auth token
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabase.auth.getUser(token)

    if (!user.user) {
      throw new Error('Unauthorized')
    }

    console.log('Processing e-sign request for user:', user.user.id)
    
    // Prepare Anvil API request
    const anvilApiKey = Deno.env.get('VITE_ANVIL_PROD_API_KEY')
    if (!anvilApiKey) {
      throw new Error('Anvil API key not configured')
    }

    // Create etch packet with Anvil
    const anvilPayload = {
      name,
      isDraft,
      isTest,
      files,
      data,
      signers
    }

    const anvilResponse = await fetch('https://app.useanvil.com/api/v1/etch', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(anvilApiKey + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(anvilPayload)
    })

    if (!anvilResponse.ok) {
      const errorText = await anvilResponse.text()
      console.error('Anvil API error:', errorText)
      throw new Error(`Anvil API failed: ${anvilResponse.status}`)
    }

    const anvilResult = await anvilResponse.json()
    
    // Store etch packet info in database if it doesn't exist
    if (!etchPacket) {
      const { error: dbError } = await supabase
        .from('etch_packets')
        .insert({
          etch_packet_id: anvilResult.eid,
          contract_id: userId, // Using userId as contract_id for now - this should be the actual contract ID
          document_group: anvilResult.documentGroup,
          status: 'pending',
          created_at: new Date().toISOString()
        })
      
      if (dbError) {
        console.error('Database error:', dbError)
        // Don't throw - continue with Anvil response
      }
    }

    // Get signing URL for current signer
    const signerData = signers.find(s => s.id === currentSigner)
    const signingUrl = anvilResult.documentGroup.signers.find(s => s.email === signerData?.email)?.signingUrl

    return new Response(
      JSON.stringify({
        signingUrl,
        currentSigner,
        createEtchPacket: anvilResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('E-sign function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})