import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encode } from 'https://deno.land/std@0.168.0/encoding/hex.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnvilWebhookPayload {
  event: string
  data: {
    eid: string
    castEid?: string
    status?: string
    signedPDFURL?: string
    downloadURL?: string
    completedAt?: string
    signers?: Array<{
      id: string
      email: string
      name: string
      status: string
      signedAt?: string
    }>
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Received Anvil webhook:', req.method, req.url)
    
    // Verify webhook signature if configured
    const webhookSecret = Deno.env.get('ANVIL_WEBHOOK_SECRET')
    let body: string = ''
    
    if (webhookSecret) {
      const signature = req.headers.get('x-anvil-signature')
      if (!signature) {
        console.warn('No Anvil signature provided')
        return new Response('Unauthorized', { status: 401 })
      }
      
      // Get the raw body for signature verification
      body = await req.text()
      
      // Verify signature using HMAC-SHA256
      const expectedSignature = await generateSignature(body, webhookSecret)
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature')
        return new Response('Invalid signature', { status: 401 })
      }
      console.log('Webhook signature verified successfully')
    }
    
    const payload: AnvilWebhookPayload = body ? JSON.parse(body) : await req.json()
    console.log('Webhook payload:', JSON.stringify(payload, null, 2))
    
    if (!payload.event || !payload.data?.eid) {
      throw new Error('Invalid webhook payload')
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Find the etch packet
    const { data: etchPacket, error: findError } = await supabase
      .from('etch_packets')
      .select('*, contracts(*)')
      .eq('etch_packet_id', payload.data.eid)
      .single()
    
    if (findError) {
      console.error('Error finding etch packet:', findError)
      throw new Error(`Etch packet not found: ${payload.data.eid}`)
    }
    
    if (!etchPacket) {
      throw new Error(`No etch packet found with ID: ${payload.data.eid}`)
    }
    
    console.log(`Processing ${payload.event} for etch packet ${etchPacket.id}`)
    
    // Process different webhook events
    let updateData: any = {
      webhook_payload: payload,
      updated_at: new Date().toISOString()
    }
    
    switch (payload.event) {
      case 'packet.sent':
        updateData.status = 'sent'
        updateData.sent_at = new Date().toISOString()
        break
      
      case 'packet.viewed':
        updateData.status = 'viewed'
        updateData.viewed_at = new Date().toISOString()
        break
      
      case 'packet.signed':
        updateData.status = 'signed'
        if (payload.data.signedPDFURL) {
          updateData.signed_pdf_url = payload.data.signedPDFURL
        }
        
        // Update signer info with signed timestamp
        if (payload.data.signers && payload.data.signers.length > 0) {
          const signer = payload.data.signers[0]
          updateData.signer_info = {
            ...etchPacket.signer_info,
            signedAt: signer.signedAt || new Date().toISOString(),
            status: signer.status
          }
        }
        break
      
      case 'packet.completed':
        updateData.status = 'completed'
        updateData.completed_at = payload.data.completedAt || new Date().toISOString()
        
        if (payload.data.signedPDFURL || payload.data.downloadURL) {
          updateData.signed_pdf_url = payload.data.signedPDFURL || payload.data.downloadURL
        }
        
        // Update contract status and signed PDF URL
        if (etchPacket.contracts) {
          const { error: contractUpdateError } = await supabase
            .from('contracts')
            .update({
              status: 'completed',
              signed_pdf_url: updateData.signed_pdf_url,
              signed_at: updateData.completed_at,
              updated_at: new Date().toISOString()
            })
            .eq('id', etchPacket.contract_id)
          
          if (contractUpdateError) {
            console.error('Error updating contract status:', contractUpdateError)
          } else {
            console.log(`Contract ${etchPacket.contract_id} marked as completed`)
          }
        }
        break
      
      case 'packet.cancelled':
        updateData.status = 'cancelled'
        
        // Update contract status to cancelled
        await supabase
          .from('contracts')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', etchPacket.contract_id)
        break
      
      case 'packet.expired':
        updateData.status = 'expired'
        break
      
      default:
        console.warn(`Unhandled webhook event: ${payload.event}`)
        updateData.status = payload.data.status || etchPacket.status
    }
    
    // Update the etch packet
    const { data: updatedEtchPacket, error: updateError } = await supabase
      .from('etch_packets')
      .update(updateData)
      .eq('id', etchPacket.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error updating etch packet:', updateError)
      throw new Error(`Failed to update etch packet: ${updateError.message}`)
    }
    
    console.log(`Successfully processed ${payload.event} for etch packet ${etchPacket.id}`)
    
    // Send notification emails for important events
    if (['packet.completed', 'packet.signed', 'packet.expired'].includes(payload.event)) {
      try {
        await sendStatusNotification(supabase, etchPacket, payload.event, updateData)
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError)
        // Don't fail the webhook because of notification issues
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Processed ${payload.event}`,
        etchPacketId: etchPacket.id,
        contractId: etchPacket.contract_id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error) {
    console.error('Webhook Error:', error)
    
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

async function sendStatusNotification(
  supabase: any, 
  etchPacket: any, 
  event: string, 
  updateData: any
) {
  // Get contract owner's email
  const { data: user } = await supabase.auth.admin.getUserById(etchPacket.contracts.user_id)
  
  if (!user?.user?.email) {
    console.log('No user email found for notification')
    return
  }
  
  const emailService = Deno.env.get('EMAIL_SERVICE')
  if (emailService !== 'resend') {
    console.log('Email notifications not configured')
    return
  }
  
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (!RESEND_API_KEY) {
    console.log('Resend API key not configured')
    return
  }
  
  const propertyAddress = etchPacket.contracts.property_address || 'Property'
  const signerName = etchPacket.signer_name || 'Signer'
  
  let subject: string
  let htmlContent: string
  
  switch (event) {
    case 'packet.completed':
      subject = `Contract Signed Successfully - ${propertyAddress}`
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a;">✅ Contract Completed Successfully!</h2>
          <p><strong>Property:</strong> ${propertyAddress}</p>
          <p><strong>Signer:</strong> ${signerName}</p>
          <p><strong>Signed At:</strong> ${new Date(updateData.completed_at).toLocaleString()}</p>
          ${updateData.signed_pdf_url ? `<p><a href="${updateData.signed_pdf_url}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Download Signed Contract</a></p>` : ''}
          <p>The contract has been successfully signed and is now complete.</p>
        </div>
      `
      break
    
    case 'packet.expired':
      subject = `Contract Signature Expired - ${propertyAddress}`
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626;">⏰ Contract Signature Expired</h2>
          <p><strong>Property:</strong> ${propertyAddress}</p>
          <p><strong>Signer:</strong> ${signerName}</p>
          <p>The signature request has expired. You may need to resend the contract for signature.</p>
        </div>
      `
      break
    
    default:
      return // Don't send notification for other events
  }
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: Deno.env.get('FROM_EMAIL') || 'contracts@dealdocs.com',
      to: user.user.email,
      subject: subject,
      html: htmlContent
    })
  })
  
  if (response.ok) {
    console.log(`Notification sent to ${user.user.email}`)
  } else {
    console.error('Failed to send notification:', await response.text())
  }
}

/**
 * Generate HMAC-SHA256 signature for webhook verification
 * @param payload - The raw request body as string
 * @param secret - The webhook secret
 * @returns Promise<string> - The hexadecimal signature
 */
async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(payload)
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  return encode(new Uint8Array(signature))
}