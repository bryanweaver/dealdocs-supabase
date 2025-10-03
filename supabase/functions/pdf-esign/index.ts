import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ESignRequest {
  contractId: string
  signerEmail: string
  signerName: string
  pdfUrl?: string
  redirectUrl?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contractId, signerEmail, signerName, pdfUrl, redirectUrl }: ESignRequest = await req.json()
    
    if (!contractId || !signerEmail || !signerName) {
      throw new Error('Contract ID, signer email, and signer name are required')
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get contract data
    const { data: contract, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single()
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Failed to fetch contract: ${error.message}`)
    }
    
    if (!contract) {
      throw new Error('Contract not found')
    }
    
    // Use provided PDF URL or contract's PDF URL
    const documentUrl = pdfUrl || contract.pdf_url
    if (!documentUrl) {
      throw new Error('No PDF URL available. Please generate PDF first.')
    }
    
    // Initialize Anvil API
    const anvilApiKey = Deno.env.get('ANVIL_API_KEY')
    if (!anvilApiKey) {
      throw new Error('Anvil API key not configured')
    }
    
    console.log('Creating Anvil Etch packet...')
    
    // Create Anvil Etch packet for e-signatures
    const etchPayload = {
      name: `Contract Signature - ${contract.property_address || 'Property'}`,
      isDraft: false,
      isTest: Deno.env.get('ENVIRONMENT') !== 'production',
      files: [
        {
          id: 'contract-pdf',
          file: documentUrl
        }
      ],
      signers: [
        {
          id: 'signer-1',
          name: signerName,
          email: signerEmail,
          fields: [
            {
              fileId: 'contract-pdf',
              type: 'signature',
              pageNum: 1,
              rect: {
                x: 100,
                y: 100,
                height: 60,
                width: 200
              }
            },
            {
              fileId: 'contract-pdf',
              type: 'signatureDate',
              pageNum: 1,
              rect: {
                x: 320,
                y: 100,
                height: 20,
                width: 100
              }
            }
          ]
        }
      ],
      webhookURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-etch`,
      redirectURL: redirectUrl || `${Deno.env.get('FRONTEND_URL')}/#/contracts/${contractId}`
    }
    
    // Send request to Anvil
    const anvilResponse = await fetch('https://app.useanvil.com/api/v1/packet', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anvilApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(etchPayload)
    })
    
    if (!anvilResponse.ok) {
      const errorText = await anvilResponse.text()
      console.error('Anvil Etch API error:', errorText)
      throw new Error(`Anvil Etch API error: ${anvilResponse.status} - ${errorText}`)
    }
    
    const etchResult = await anvilResponse.json()
    
    if (etchResult.statusCode === 200 && etchResult.data) {
      const etchData = etchResult.data
      
      // Store etch packet in database
      const { data: etchPacket, error: etchError } = await supabase
        .from('etch_packets')
        .insert({
          contract_id: contractId,
          etch_packet_id: etchData.eid,
          anvil_cast_id: etchData.castEid,
          status: 'sent',
          signer_email: signerEmail,
          signer_name: signerName,
          pdf_url: documentUrl,
          sent_at: new Date().toISOString(),
          expires_at: etchData.expiresAt,
          signer_info: {
            name: signerName,
            email: signerEmail,
            signURL: etchData.signURL
          }
        })
        .select()
        .single()
      
      if (etchError) {
        console.error('Failed to store etch packet:', etchError)
        throw new Error(`Failed to store e-signature packet: ${etchError.message}`)
      }
      
      // Update contract status
      await supabase
        .from('contracts')
        .update({ 
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', contractId)
      
      return new Response(
        JSON.stringify({ 
          success: true,
          etchPacketId: etchData.eid,
          signURL: etchData.signURL,
          expiresAt: etchData.expiresAt,
          contractId: contractId
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      throw new Error(`E-signature packet creation failed: ${JSON.stringify(etchResult)}`)
    }
    
  } catch (error) {
    console.error('E-Sign Error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})