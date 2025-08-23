import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendEmailRequest {
  contractId: string
  recipientEmail: string
  recipientName?: string
  emailType: 'listing_agent' | 'buyer' | 'seller' | 'title_company' | 'lender'
  customSubject?: string
  customMessage?: string
  includeContract?: boolean
  ccEmails?: string[]
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      contractId, 
      recipientEmail, 
      recipientName,
      emailType, 
      customSubject,
      customMessage,
      includeContract = true,
      ccEmails = []
    }: SendEmailRequest = await req.json()
    
    if (!contractId || !recipientEmail || !emailType) {
      throw new Error('Contract ID, recipient email, and email type are required')
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get contract with related data
    const { data: contract, error } = await supabase
      .from('contracts')
      .select(`
        *,
        etch_packets(*)
      `)
      .eq('id', contractId)
      .single()
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Failed to fetch contract: ${error.message}`)
    }
    
    if (!contract) {
      throw new Error('Contract not found')
    }
    
    // Check for email service configuration
    const emailService = Deno.env.get('EMAIL_SERVICE') || 'resend' // Default to Resend
    
    let emailResult
    if (emailService === 'resend') {
      emailResult = await sendWithResend({
        contract,
        recipientEmail,
        recipientName,
        emailType,
        customSubject,
        customMessage,
        includeContract,
        ccEmails
      })
    } else {
      throw new Error(`Email service '${emailService}' is not supported`)
    }
    
    // Log email in database
    const { data: emailPacket, error: logError } = await supabase
      .from('email_packets')
      .insert({
        contract_id: contractId,
        recipient_email: recipientEmail,
        recipient_name: recipientName || recipientEmail,
        email_type: emailType,
        subject: emailResult.subject,
        email_body: emailResult.htmlContent,
        status: 'sent',
        ses_message_id: emailResult.messageId
      })
      .select()
      .single()
    
    if (logError) {
      console.error('Failed to log email:', logError)
      // Don't throw here as email was sent successfully
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResult.messageId,
        emailPacketId: emailPacket?.id,
        recipientEmail: recipientEmail
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Send Email Error:', error)
    
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

async function sendWithResend(params: any) {
  const { 
    contract, 
    recipientEmail, 
    recipientName,
    emailType, 
    customSubject,
    customMessage,
    includeContract,
    ccEmails
  } = params
  
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (!RESEND_API_KEY) {
    throw new Error('Resend API key not configured')
  }
  
  const propertyInfo = contract.property_info || {}
  const parties = contract.parties || {}
  
  // Generate subject line
  const subject = customSubject || generateEmailSubject(emailType, propertyInfo, parties)
  
  // Generate email content
  const htmlContent = customMessage || generateEmailContent(emailType, contract, includeContract)
  
  // Prepare email payload
  const emailPayload: any = {
    from: Deno.env.get('FROM_EMAIL') || 'contracts@dealdocs.com',
    to: recipientEmail,
    subject: subject,
    html: htmlContent,
  }
  
  // Add CC recipients if provided
  if (ccEmails.length > 0) {
    emailPayload.cc = ccEmails
  }
  
  // Add reply-to if configured
  const replyTo = Deno.env.get('REPLY_TO_EMAIL')
  if (replyTo) {
    emailPayload.reply_to = replyTo
  }
  
  console.log(`Sending email via Resend to ${recipientEmail}`)
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailPayload)
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Resend API error:', errorText)
    throw new Error(`Email sending failed: ${response.status} - ${errorText}`)
  }
  
  const result = await response.json()
  
  return {
    messageId: result.id,
    subject: subject,
    htmlContent: htmlContent
  }
}

function generateEmailSubject(emailType: string, propertyInfo: any, parties: any): string {
  const address = propertyInfo.address || 'Property'
  const mlsNumber = propertyInfo.mlsNumber ? ` (MLS: ${propertyInfo.mlsNumber})` : ''
  
  const subjects = {
    listing_agent: `Real Estate Contract Package - ${address}${mlsNumber}`,
    buyer: `Your Contract Package - ${address}${mlsNumber}`,
    seller: `Contract Package for Your Property - ${address}${mlsNumber}`,
    title_company: `New Contract for Closing - ${address}${mlsNumber}`,
    lender: `Loan Documentation Required - ${address}${mlsNumber}`
  }
  
  return subjects[emailType] || `Contract Package - ${address}${mlsNumber}`
}

function generateEmailContent(emailType: string, contract: any, includeContract: boolean): string {
  const propertyInfo = contract.property_info || {}
  const parties = contract.parties || {}
  const financialDetails = contract.financial_details || {}
  
  const address = propertyInfo.address || 'Property Address Not Available'
  const mlsNumber = propertyInfo.mlsNumber || 'N/A'
  const purchasePrice = formatCurrency(financialDetails.purchasePrice)
  const buyerName = parties.primaryBuyer?.name || parties.buyer?.name || 'Buyer'
  const sellerName = parties.primarySeller?.name || parties.seller?.name || 'Seller'
  
  const baseContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin-bottom: 10px;">DealDocs</h1>
        <p style="color: #6b7280; margin: 0;">Real Estate Contract Management</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin-top: 0;">Contract Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #374151;">Property:</td>
            <td style="padding: 8px 0; color: #6b7280;">${address}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #374151;">MLS Number:</td>
            <td style="padding: 8px 0; color: #6b7280;">${mlsNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #374151;">Purchase Price:</td>
            <td style="padding: 8px 0; color: #6b7280;">${purchasePrice}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #374151;">Buyer:</td>
            <td style="padding: 8px 0; color: #6b7280;">${buyerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #374151;">Seller:</td>
            <td style="padding: 8px 0; color: #6b7280;">${sellerName}</td>
          </tr>
        </table>
      </div>
  `
  
  const typeSpecificContent = {
    listing_agent: `
      <p>Dear Listing Agent,</p>
      <p>A new contract has been submitted for the above property. Please review the contract details and contact the buyer's agent to proceed with the transaction.</p>
      ${includeContract && contract.pdf_url ? `<p><a href="${contract.pdf_url}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">Download Contract PDF</a></p>` : ''}
      <p>If you have any questions or need additional information, please don't hesitate to contact us.</p>
    `,
    buyer: `
      <p>Dear ${buyerName},</p>
      <p>Your contract package for the above property is now ready for review and signature.</p>
      ${contract.etch_packets?.[0]?.signer_info?.signURL ? `<p><a href="${contract.etch_packets[0].signer_info.signURL}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">Sign Contract Electronically</a></p>` : ''}
      ${includeContract && contract.pdf_url ? `<p><a href="${contract.pdf_url}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">Download Contract PDF</a></p>` : ''}
      <p>Please review the contract carefully and complete your signature by the specified deadline.</p>
    `,
    seller: `
      <p>Dear ${sellerName},</p>
      <p>A contract has been received for your property. Please review the terms and contact your agent to proceed.</p>
      ${includeContract && contract.pdf_url ? `<p><a href="${contract.pdf_url}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">Download Contract PDF</a></p>` : ''}
      <p>Your agent will guide you through the next steps in the process.</p>
    `,
    title_company: `
      <p>Dear Title Company,</p>
      <p>Please prepare for closing on the above property. The contract details are provided for your reference.</p>
      ${includeContract && contract.pdf_url ? `<p><a href="${contract.pdf_url}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">Download Contract PDF</a></p>` : ''}
      <p>Please contact us if you need any additional documentation or have questions about the transaction.</p>
    `,
    lender: `
      <p>Dear Lender,</p>
      <p>Loan documentation is required for the above property transaction. Please review the contract terms and begin the loan processing.</p>
      ${includeContract && contract.pdf_url ? `<p><a href="${contract.pdf_url}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">Download Contract PDF</a></p>` : ''}
      <p>Please contact the buyer directly to initiate the loan application process.</p>
    `
  }
  
  const footer = `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
        <p>This email was sent from DealDocs contract management system.</p>
        <p>For technical support, please contact <a href="mailto:support@dealdocs.com" style="color: #2563eb;">support@dealdocs.com</a></p>
      </div>
    </div>
  `
  
  return baseContent + typeSpecificContent[emailType] + footer
}

function formatCurrency(amount: any): string {
  if (!amount) return 'Not specified'
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]/g, '')) : amount
  return isNaN(num) ? 'Not specified' : num.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}