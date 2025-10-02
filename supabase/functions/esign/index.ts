import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anvil from 'npm:@anvilco/anvil'

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
    
    const { userId, name, isDraft, isTest, files, data, signers, currentSigner, etchPacket, accountId } = body
    
    console.log('Request body:', {
      userId,
      accountId,
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from auth token
    const authorizationHeader = req.headers.get('Authorization')
    console.log('Authorization header exists:', !!authorizationHeader)

    let userIdFromAuth = null

    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '')
      console.log('Token length:', token?.length)

      const { data: user, error: authError } = await supabase.auth.getUser(token)

      if (authError) {
        console.error('Auth error:', authError)
        // In development, we'll continue without auth if the user doesn't exist
        // This happens when the database is reset but the frontend still has an old token
        if (authError.code === 'user_not_found') {
          console.warn('User not found in database - continuing without auth validation (dev mode)')
        } else {
          throw new Error(`Authentication failed: ${authError.message}`)
        }
      } else if (user?.user) {
        userIdFromAuth = user.user.id
        console.log('Authenticated user:', userIdFromAuth)
      }
    } else {
      console.warn('No authorization header - continuing without auth (dev mode)')
    }

    console.log('Processing e-sign request for contract:', userId)

    // Prepare Anvil API request
    const anvilApiKey = Deno.env.get('ANVIL_API_KEY')
    console.log('Anvil API Key exists:', !!anvilApiKey)
    console.log('Anvil API Key length:', anvilApiKey?.length)
    if (!anvilApiKey) {
      throw new Error('Anvil API key not configured')
    }

    // Check if an etch packet already exists for this contract
    let etchPacketData = null
    let shouldCreateNewPacket = true

    if (etchPacket) {
      console.log('Using existing etch packet:', etchPacket.eid)
      etchPacketData = etchPacket
      shouldCreateNewPacket = false
    }

    // Create etch packet with Anvil GraphQL API only if needed
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

    if (shouldCreateNewPacket) {
      console.log('Creating new etch packet with Anvil...')
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

      etchPacketData = anvilResult.data?.createEtchPacket
      if (!etchPacketData) {
        throw new Error('No etch packet data returned from Anvil')
      }
    } else {
      console.log('Skipping etch packet creation - using existing packet')
    }

    // Download and save the generated documents immediately (only for new packets)
    let documentUrls = []
    if (shouldCreateNewPacket && etchPacketData.eid && etchPacketData.documentGroup?.eid) {
      try {
        console.log('Downloading generated documents from Anvil...')
        const anvilClient = new Anvil({ apiKey: anvilApiKey })

        // Download the generated (unsigned) documents
        const { statusCode, data: documentData } = await anvilClient.downloadDocuments(etchPacketData.documentGroup.eid, { type: 'pdf' })

        if (statusCode === 200) {
          // Store documents in Supabase storage
          const storagePath = accountId && userId
            ? `accounts/${accountId}/contracts/${userId}/generated/${etchPacketData.eid}/`
            : `generated-documents/${etchPacketData.eid}/`

          console.log(`Storing generated documents in: ${storagePath}`)

          // Store the PDF with a meaningful name
          const fileName = `contract_${etchPacketData.eid}_generated.pdf`
          const filePath = `${storagePath}${fileName}`

          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('contracts')
            .upload(filePath, new Uint8Array(documentData), {
              contentType: 'application/pdf',
              upsert: true
            })

          if (!uploadError) {
            // Create a signed URL that's valid for 30 days
            const { data: urlData } = await supabaseAdmin.storage
              .from('contracts')
              .createSignedUrl(filePath, 60 * 60 * 24 * 30)

            if (urlData?.signedUrl) {
              documentUrls.push({
                type: 'generated',
                path: filePath,
                url: urlData.signedUrl
              })
              console.log('Successfully stored generated document:', filePath)
            }
          } else {
            console.error('Error uploading document to storage:', uploadError)
          }
        }
      } catch (downloadError) {
        console.error('Error downloading/storing generated documents:', downloadError)
        // Don't fail the entire operation if document storage fails
      }
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
          pdf_url: documentUrls.find(d => d.type === 'generated')?.url || null, // Store generated PDF URL
          document_urls: documentUrls, // Store all document info in JSONB
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
      // Check if this is an embedded signer
      const isEmbeddedSigner = signerData?.signerType === 'embedded'
      console.log('Anvil signer found:', anvilSigner)
      console.log('Is embedded signer:', isEmbeddedSigner)

      // We need to make another GraphQL call to generate the signing URL
      // For embedded signers, we should use generateEmbedURL mutation
      const generateSignUrlMutation = isEmbeddedSigner ? `
        mutation GenerateEmbedURL($signerEid: String!, $clientUserId: String!) {
          generateEmbedURL(signerEid: $signerEid, clientUserId: $clientUserId)
        }
      ` : `
        mutation GenerateEtchSignURL($signerEid: String!, $clientUserId: String!) {
          generateEtchSignURL(signerEid: $signerEid, clientUserId: $clientUserId)
        }
      `

      const signUrlPayload = {
        query: generateSignUrlMutation,
        variables: {
          signerEid: anvilSigner.eid,
          clientUserId: userIdFromAuth || userId // Use authenticated user ID if available, otherwise use the contract ID
        }
      }

      console.log('Generating sign URL with payload:', JSON.stringify(signUrlPayload, null, 2))
      console.log('Using mutation:', isEmbeddedSigner ? 'generateEmbedURL' : 'generateEtchSignURL')

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

        const urlField = isEmbeddedSigner ? 'generateEmbedURL' : 'generateEtchSignURL'
        if (signUrlResult.data?.[urlField]) {
          signingUrl = signUrlResult.data[urlField]
          console.log(`Generated ${isEmbeddedSigner ? 'embedded' : 'regular'} signing URL:`, signingUrl)
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