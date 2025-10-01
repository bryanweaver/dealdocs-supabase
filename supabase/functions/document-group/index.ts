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

    
    // Get Anvil API key
    const anvilApiKey = Deno.env.get('VITE_ANVIL_PROD_API_KEY')
    if (!anvilApiKey) {
      throw new Error('Anvil API key not configured')
    }

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
    

    // For completed document groups, fetch the signed documents
    const documents = []

    if (documentGroup.status === 'completed' || documentGroup.signers?.some(s => s.status === 'completed')) {
      // Check if ALL signers have completed
      const allSignersCompleted = documentGroup.signers?.every(s => s.status === 'completed') || false
      const completedSignersCount = documentGroup.signers?.filter(s => s.status === 'completed').length || 0

      // First, check if we already have the documents stored in Supabase
      // Use the proper path structure: accounts/{accountId}/contracts/{contractId}/etch-packets/{etchPacketEid}/
      const storagePath = accountId && contractId
        ? `accounts/${accountId}/contracts/${contractId}/etch-packets/${etchPacketEid}/`
        : `signed-documents/${etchPacketEid}/`

      try {
        const { data: existingFiles, error: listError } = await supabase.storage
          .from('contracts')
          .list(storagePath)

        // Check if existing files are outdated
        // We need to re-download if any signer completed AFTER the files were created
        let needFreshDownload = true

        if (!listError && existingFiles && existingFiles.length > 0) {
          // Get the creation time of the newest existing file
          const newestFile = existingFiles.reduce((newest, file) => {
            const fileTime = new Date(file.created_at || file.updated_at || 0).getTime()
            const newestTime = new Date(newest.created_at || newest.updated_at || 0).getTime()
            return fileTime > newestTime ? file : newest
          })

          const fileCreatedAt = new Date(newestFile.created_at || newestFile.updated_at || 0).getTime()

          // Check if any signer completed after the files were created
          const latestSignerCompletion = documentGroup.signers?.reduce((latest, signer) => {
            if (!signer.completedAt) return latest
            const signerTime = new Date(signer.completedAt).getTime()
            return signerTime > latest ? signerTime : latest
          }, 0) || 0

          // If files were created AFTER the last signer completed, they're up to date
          needFreshDownload = latestSignerCompletion > fileCreatedAt
        }

        // Only use existing files if they're up to date
        if (!listError && existingFiles && existingFiles.length > 0 && !needFreshDownload) {
          
          // Get signed URLs for existing documents
          for (const file of existingFiles) {
            const filePath = `${storagePath}${file.name}`
            const { data: urlData } = await supabase.storage
              .from('contracts')
              .createSignedUrl(filePath, 60 * 60 * 24 * 30) // 30 days
            
            const originalUrl = urlData?.signedUrl || null
            const fixedUrl = fixSignedUrl(originalUrl)
            
            
            documents.push({
              fileName: file.name,
              signedUrl: fixedUrl,
              storagePath: filePath
            })
          }
        } else {
          
          // Download documents from Anvil using the SDK
          try {
            const anvilClient = new Anvil({ apiKey: anvilApiKey })

            const { statusCode, data } = await anvilClient.downloadDocuments(documentGroup.eid)

            if (statusCode !== 200) {
              throw new Error(`Failed to download documents: ${statusCode}`)
            }
            
            // The response data is a Buffer/Uint8Array containing the ZIP
            const zipBuffer = new Uint8Array(data)
            
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
              

              // Generate timestamp to version the files (so we don't overwrite previous versions)
              const timestamp = Date.now()

              // Upload each PDF to the proper storage path
              for (const file of pdfFiles) {
                // Create versioned filename to preserve all signing stages
                const baseName = file.name.replace('.pdf', '')
                const versionedName = `${baseName}_signed_${timestamp}.pdf`
                const uploadPath = `${storagePath}${versionedName}`

                const { data: uploadData, error: uploadError } = await supabase.storage
                  .from('contracts')
                  .upload(uploadPath, file.content, {
                    contentType: 'application/pdf',
                    upsert: true
                  })
                
                if (uploadError) {
                  console.error(`Failed to upload ${versionedName}:`, uploadError)
                } else {

                  // Get signed URL for the PDF
                  const { data: urlData } = await supabase.storage
                    .from('contracts')
                    .createSignedUrl(uploadPath, 60 * 60 * 24 * 30) // 30 days

                  documents.push({
                    fileName: versionedName,
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

        // Prepare document URLs for storage
        const signedDocumentUrls = documents.map(doc => ({
          type: 'signed',
          path: doc.storagePath,
          url: doc.signedUrl,
          fileName: doc.fileName
        }))

        // Merge with existing document_urls
        // Note: When multiple signers sign sequentially, Anvil updates the same documents
        // with additional signatures, so we replace signed docs with the latest version
        // but keep generated docs (pre-signature versions)
        const existingDocUrls = etchPackets.document_urls || []
        const generatedDocs = existingDocUrls.filter(doc => doc.type === 'generated')

        // Replace signed docs with latest versions (which contain all signatures)
        const allDocUrls = [...generatedDocs, ...signedDocumentUrls]

        await supabase
          .from('etch_packets')
          .update({
            signed_pdf_url: signedPdfUrl,
            document_urls: allDocUrls,
            status: 'completed'
          })
          .eq('id', etchPackets.id)
      }
    }

    
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