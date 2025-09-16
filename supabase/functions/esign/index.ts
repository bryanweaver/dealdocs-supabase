import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Always handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log(`[${new Date().toISOString()}] ${req.method} request received`)
    
    // Parse request body
    let body;
    try {
      body = await req.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }
    
    const { userId, name, isDraft, isTest, files, data, signers, currentSigner, etchPacket } = body
    
    console.log('Request body:', {
      userId,
      name,
      isDraft,
      isTest,
      filesCount: files?.length,
      hasData: !!data,
      signersCount: signers?.length,
      currentSigner,
      hasEtchPacket: !!etchPacket
    })
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get user from auth token
    const authorizationHeader = req.headers.get('Authorization')!
    const token = authorizationHeader.replace('Bearer ', '')
    const { data: user } = await supabase.auth.getUser(token)

    if (!user.user) {
      throw new Error('Unauthorized')
    }

    console.log('Processing e-sign request for user:', user.user.id)
    
    // Prepare Anvil API request
    const anvilApiKey = Deno.env.get('ANVIL_API_KEY')
    console.log('Anvil API Key exists:', !!anvilApiKey)
    console.log('Anvil API Key length:', anvilApiKey?.length)
    if (!anvilApiKey) {
      throw new Error('Anvil API key not configured')
    }

    // Create etch packet with Anvil GraphQL API
    const graphqlMutation = `
      mutation CreateEtchPacket(
        $name: String!,
        $isDraft: Boolean,
        $isTest: Boolean,
        $files: [EtchFile!],
        $data: JSON,
        $signers: [JSON!]
      ) {
        createEtchPacket(
          name: $name,
          isDraft: $isDraft,
          isTest: $isTest,
          files: $files,
          data: $data,
          signers: $signers
        ) {
          eid
          name
          documentGroup {
            eid
            status
            signers {
              eid
              name
              email
              status
              signerTokens {
                type
              }
            }
          }
        }
      }
    `

    // Log the actual structure of files and signers
    console.log('Files structure:', JSON.stringify(files, null, 2))
    console.log('Signers structure:', JSON.stringify(signers, null, 2))
    console.log('Data structure:', JSON.stringify(data, null, 2))
    
    const anvilPayload = {
      query: graphqlMutation,
      variables: {
        name,
        isDraft: isDraft || false,
        isTest: isTest || true,
        files,
        data,
        signers
      }
    }

    console.log('Sending to Anvil - Full payload:', JSON.stringify(anvilPayload, null, 2))
    
    const anvilAuthHeader = `Basic ${btoa(anvilApiKey + ':')}`
    console.log('Auth header format check:', anvilAuthHeader.substring(0, 20) + '...')

    const anvilResponse = await fetch('https://graphql.useanvil.com', {
      method: 'POST',
      headers: {
        'Authorization': anvilAuthHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(anvilPayload)
    })

    if (!anvilResponse.ok) {
      const errorText = await anvilResponse.text()
      console.error('Anvil API error response:', {
        status: anvilResponse.status,
        statusText: anvilResponse.statusText,
        body: errorText
      })
      throw new Error(`Anvil API failed: ${anvilResponse.status} - ${errorText}`)
    }

    const anvilResult = await anvilResponse.json()
    console.log('Anvil response:', JSON.stringify(anvilResult, null, 2))
    
    // Check for GraphQL errors
    if (anvilResult.errors) {
      console.error('GraphQL errors:', anvilResult.errors)
      throw new Error(`GraphQL error: ${anvilResult.errors[0]?.message || 'Unknown error'}`)
    }
    
    const etchPacketData = anvilResult.data?.createEtchPacket
    if (!etchPacketData) {
      throw new Error('No etch packet data returned from Anvil')
    }
    
    // Store etch packet info in database if it doesn't exist
    if (!etchPacket && etchPacketData.eid) {
      console.log('Storing etch packet in database:', {
        etch_packet_id: etchPacketData.eid,
        contract_id: userId
      })
      
      // Extract signer emails for database
      const signerEmails = etchPacketData.documentGroup?.signers?.map(s => s.email) || []
      const primarySignerEmail = signerEmails[0] || null
      
      const { data: insertedData, error: dbError } = await supabase
        .from('etch_packets')
        .insert({
          etch_packet_id: etchPacketData.eid,
          contract_id: userId, // This is actually the contract ID from the frontend
          signer_info: etchPacketData.documentGroup, // Store document group in signer_info JSONB column
          signer_email: primarySignerEmail, // Store primary signer email for indexing
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (dbError) {
        console.error('Database error inserting etch packet:', dbError)
        // Don't throw - continue with Anvil response
      } else {
        console.log('Etch packet stored successfully:', insertedData)
      }
    }

    // Get signing URL - for embedded signers, we need to generate it
    const signerData = signers.find(s => s.id === currentSigner)
    const anvilSigner = etchPacketData.documentGroup?.signers?.find(s => s.email === signerData?.email)
    
    let signingUrl = null
    if (anvilSigner) {
      // For embedded signers, we need to generate a signing URL
      console.log('Anvil signer found:', anvilSigner)
      
      // We need to make another GraphQL call to generate the signing URL
      const generateSignUrlMutation = `
        mutation GenerateEtchSignURL($signerEid: String!, $clientUserId: String!) {
          generateEtchSignURL(signerEid: $signerEid, clientUserId: $clientUserId)
        }
      `
      
      const signUrlPayload = {
        query: generateSignUrlMutation,
        variables: {
          signerEid: anvilSigner.eid,
          clientUserId: user.user.id
        }
      }
      
      console.log('Generating sign URL with payload:', JSON.stringify(signUrlPayload, null, 2))
      
      const signUrlResponse = await fetch('https://graphql.useanvil.com', {
        method: 'POST',
        headers: {
          'Authorization': anvilAuthHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUrlPayload)
      })
      
      if (signUrlResponse.ok) {
        const signUrlResult = await signUrlResponse.json()
        console.log('Sign URL response:', JSON.stringify(signUrlResult, null, 2))
        
        if (signUrlResult.data?.generateEtchSignURL) {
          signingUrl = signUrlResult.data.generateEtchSignURL
          console.log('Generated signing URL:', signingUrl)
        }
      } else {
        console.error('Failed to generate sign URL:', await signUrlResponse.text())
      }
    }

    return new Response(
      JSON.stringify({
        signingUrl,
        currentSigner,
        createEtchPacket: etchPacketData
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