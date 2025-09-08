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
    const { documentGroupEid } = await req.json()
    
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

    console.log('Fetching document group:', documentGroupEid)
    
    // Get Anvil API key
    const anvilApiKey = Deno.env.get('VITE_ANVIL_PROD_API_KEY')
    if (!anvilApiKey) {
      throw new Error('Anvil API key not configured')
    }

    // Fetch document group from Anvil
    const anvilResponse = await fetch(`https://app.useanvil.com/api/v1/document-group/${documentGroupEid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(anvilApiKey + ':')}`,
        'Content-Type': 'application/json',
      }
    })

    if (!anvilResponse.ok) {
      const errorText = await anvilResponse.text()
      console.error('Anvil API error:', errorText)
      throw new Error(`Anvil API failed: ${anvilResponse.status}`)
    }

    const documentGroupData = await anvilResponse.json()
    
    // Extract documents with file data
    const documents = []
    
    if (documentGroupData.documents && documentGroupData.documents.length > 0) {
      for (const doc of documentGroupData.documents) {
        // Download the PDF from Anvil
        const pdfResponse = await fetch(doc.downloadURL, {
          headers: {
            'Authorization': `Basic ${btoa(anvilApiKey + ':')}`,
          }
        })
        
        if (pdfResponse.ok) {
          const pdfArrayBuffer = await pdfResponse.arrayBuffer()
          const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfArrayBuffer)))
          
          documents.push({
            fileName: doc.filename || `signed_document_${Date.now()}.pdf`,
            fileData: pdfBase64
          })
        }
      }
    }

    return new Response(
      JSON.stringify({ documents }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Document group function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})