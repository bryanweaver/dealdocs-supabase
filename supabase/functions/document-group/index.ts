import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anvil from 'npm:@anvilco/anvil'
import JSZip from 'https://esm.sh/jszip@3.10.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to fix internal Docker URLs
function fixSignedUrl(url: string | null): string | null {
  if (!url) return null
  
  // Replace internal Docker hostname with public Supabase URL
  if (url.includes('://kong:8000')) {
    // Get the public URL from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    if (!supabaseUrl || supabaseUrl === 'http://kong:8000') {
      // Fallback to localhost for local development
      const publicUrl = 'http://localhost:54321'
      console.log(`Fixing URL: replacing kong:8000 with ${publicUrl} (fallback)`)
      return url.replace(/https?:\/\/kong:8000/g, publicUrl)
    }
    console.log(`Fixing URL: replacing kong:8000 with ${supabaseUrl}`)
    // Handle both http and https
    return url.replace(/https?:\/\/kong:8000/g, supabaseUrl)
  }
  
  return url
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { documentGroupEid, etchPacketEid, accountId, contractId } = await req.json()
    
    // Initialize Supabase client with service role for storage operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    
    // Use anon key for auth verification, service key for storage
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from auth token
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabase.auth.getUser(token)

    if (!user.user) {
      throw new Error('Unauthorized')
    }

    // We need the etchPacketEid to query Anvil
    if (!etchPacketEid) {
      throw new Error('Etch packet EID is required')
    }

    console.log('Fetching document group for etch packet:', etchPacketEid)
    
    // Get Anvil API key
    const anvilApiKey = Deno.env.get('VITE_ANVIL_PROD_API_KEY')
    if (!anvilApiKey) {
      throw new Error('Anvil API key not configured')
    }
    
    console.log('Using Anvil API endpoint: https://app.useanvil.com/graphql')

    // First, get the etch packet and document group info
    const query = `
      query GetEtchPacket($eid: String!) {
        etchPacket(eid: $eid) {
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
              completedAt
            }
          }
        }
      }
    `

    const anvilResponse = await fetch('https://app.useanvil.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(anvilApiKey + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { eid: etchPacketEid }
      })
    })

    if (!anvilResponse.ok) {
      const errorText = await anvilResponse.text()
      console.error('Anvil API error:', errorText)
      throw new Error(`Anvil API failed: ${anvilResponse.status}`)
    }

    const { data, errors } = await anvilResponse.json()
    
    if (errors) {
      console.error('GraphQL errors:', errors)
      throw new Error('Failed to fetch document group')
    }

    // Extract etchPacket and documentGroup from response
    const etchPacketData = data?.etchPacket
    const documentGroup = etchPacketData?.documentGroup
    
    if (!documentGroup) {
      throw new Error('Document group not found')
    }
    
    console.log('Document group found:', {
      eid: documentGroup.eid,
      status: documentGroup.status,
      signersCount: documentGroup.signers?.length
    })

    // For completed document groups, fetch the signed documents
    const documents = []
    
    if (documentGroup.status === 'completed' || documentGroup.signers?.some(s => s.status === 'completed')) {
      console.log('Document group has completed signers, checking for signed documents')
      
      // First, check if we already have the documents stored in Supabase
      // Use the proper path structure: accounts/{accountId}/contracts/{contractId}/etch-packets/{etchPacketEid}/
      const storagePath = accountId && contractId 
        ? `accounts/${accountId}/contracts/${contractId}/etch-packets/${etchPacketEid}/`
        : `signed-documents/${etchPacketEid}/`
      console.log(`Checking for existing documents in: ${storagePath}`)
      
      try {
        const { data: existingFiles, error: listError } = await supabase.storage
          .from('contracts')
          .list(storagePath)
        
        if (!listError && existingFiles && existingFiles.length > 0) {
          console.log(`Found ${existingFiles.length} existing documents in storage`)
          
          // Get signed URLs for existing documents
          for (const file of existingFiles) {
            const filePath = `${storagePath}${file.name}`
            const { data: urlData } = await supabase.storage
              .from('contracts')
              .createSignedUrl(filePath, 60 * 60 * 24 * 30) // 30 days
            
            const originalUrl = urlData?.signedUrl || null
            const fixedUrl = fixSignedUrl(originalUrl)
            
            if (originalUrl !== fixedUrl) {
              console.log(`Fixed URL from ${originalUrl?.substring(0, 50)}... to ${fixedUrl?.substring(0, 50)}...`)
            }
            
            documents.push({
              fileName: file.name,
              signedUrl: fixedUrl,
              storagePath: filePath
            })
          }
          
          console.log('Returning existing documents from storage')
        } else {
          console.log('No existing documents found, attempting to fetch from Anvil')
          
          // Download documents from Anvil using the SDK
          try {
            const anvilClient = new Anvil({ apiKey: anvilApiKey })
            console.log(`Downloading documents for documentGroupEid: ${documentGroup.eid}`)
            
            const { statusCode, data } = await anvilClient.downloadDocuments(documentGroup.eid)
            
            if (statusCode !== 200) {
              throw new Error(`Failed to download documents: ${statusCode}`)
            }
            
            console.log('Successfully downloaded documents from Anvil')
            
            // The response data is a Buffer/Uint8Array containing the ZIP
            const zipBuffer = new Uint8Array(data)
            
            console.log('Extracting PDF files from ZIP...')
            
            try {
              // Load the ZIP file using JSZip
              const zip = new JSZip()
              await zip.loadAsync(zipBuffer)
              
              // Extract all PDF files
              const pdfFiles = []
              
              for (const [fileName, zipEntry] of Object.entries(zip.files)) {
                if (!zipEntry.dir && fileName.toLowerCase().endsWith('.pdf')) {
                  const content = await zipEntry.async('uint8array')
                  pdfFiles.push({
                    name: fileName.split('/').pop(), // Get just the filename without path
                    content
                  })
                }
              }
              
              console.log(`Found ${pdfFiles.length} PDF files in ZIP`)
              
              // Upload each PDF to the proper storage path
              for (const file of pdfFiles) {
                const uploadPath = `${storagePath}${file.name}`
                console.log(`Uploading PDF: ${uploadPath}`)
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                  .from('contracts')
                  .upload(uploadPath, file.content, {
                    contentType: 'application/pdf',
                    upsert: true
                  })
                
                if (uploadError) {
                  console.error(`Failed to upload ${file.name}:`, uploadError)
                } else {
                  console.log(`Successfully uploaded: ${file.name}`)
                  
                  // Get signed URL for the PDF
                  const { data: urlData } = await supabase.storage
                    .from('contracts')
                    .createSignedUrl(uploadPath, 60 * 60 * 24 * 30) // 30 days
                  
                  documents.push({
                    fileName: file.name,
                    signedUrl: fixSignedUrl(urlData?.signedUrl || null),
                    storagePath: uploadPath
                  })
                }
              }
              
            } catch (extractError) {
              console.error('Error extracting ZIP:', extractError)
              // Fallback: store the ZIP file itself
              const fileName = `signed_documents_${etchPacketEid}.zip`
              const filePath = `${storagePath}${fileName}`
              
              console.log(`Storing ZIP file as fallback: ${filePath}`)
              
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('contracts')
                .upload(filePath, zipBuffer, {
                  contentType: 'application/zip',
                  upsert: true
                })
              
              if (!uploadError) {
                const { data: urlData } = await supabase.storage
                  .from('contracts')
                  .createSignedUrl(filePath, 60 * 60 * 24 * 30)
                
                documents.push({
                  fileName,
                  signedUrl: fixSignedUrl(urlData?.signedUrl || null),
                  storagePath: filePath
                })
              }
            }
          } catch (downloadError) {
            console.error('Error downloading from Anvil:', downloadError)
            throw new Error(`Failed to download documents: ${downloadError.message}`)
          }
        }
      } catch (error) {
        console.error('Error processing signed documents:', error)
      }
    } else {
      console.log('Document group not yet completed - no signed documents available')
    }

    // Update etch packet with signed PDF URLs if we have them
    if (documents.length > 0 && etchPacketEid) {
      const { data: etchPackets } = await supabase
        .from('etch_packets')
        .select('*')
        .eq('etch_packet_id', etchPacketEid)
        .single()
      
      if (etchPackets) {
        const signedPdfUrl = documents[0]?.signedUrl
        
        await supabase
          .from('etch_packets')
          .update({
            signed_pdf_url: signedPdfUrl,
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', etchPackets.id)
      }
    }

    console.log(`Returning ${documents.length} documents to client`)
    documents.forEach((doc, idx) => {
      console.log(`  ${idx + 1}. ${doc.fileName}: ${doc.signedUrl?.substring(0, 60)}...`)
    })
    
    return new Response(
      JSON.stringify({ 
        documents,
        documentGroup: {
          ...documentGroup,
          documents: undefined // Remove raw document data to reduce payload
        }
      }),
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