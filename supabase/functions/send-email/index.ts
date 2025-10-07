import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const emailData = await req.json()
    
    // Get the auth token
    const authHeader = req.headers.get("Authorization")!
    const token = authHeader.replace("Bearer ", "")

    // Initialize Supabase client with the user's auth token for RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    )

    // Verify the user is authenticated
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      throw new Error("Unauthorized")
    }

    console.log("Sending email for contract:", emailData.contractId)

    // Check if test email override is enabled
    const sendToTestEmail = Deno.env.get("SEND_TO_TEST_EMAIL") === "true"
    const testEmailAddress = "bryan@docu.deals"

    let actualToEmail = emailData.agentEmail
    let actualCcEmail = emailData.ccEmail

    if (sendToTestEmail) {
      console.log(`[TEST MODE] Overriding email recipients to ${testEmailAddress}`)
      actualToEmail = testEmailAddress
      actualCcEmail = null // Don't CC in test mode
    }

    // Create email record in database (store original recipient info)
    const { data: emailRecord, error: dbError } = await supabase
      .from("email_packets")
      .insert({
        contract_id: emailData.contractId,
        recipient_email: emailData.agentEmail, // Store original recipient
        recipient_name: emailData.agentName,
        email_type: 'listing_agent',
        subject: emailData.subject,
        email_body: emailData.body,
        status: "sent",
        sent_at: new Date().toISOString(),
        // Store file attachments as JSON
        attachments: {
          contractFiles: emailData.contractFiles || [],
          preApprovalFile: emailData.preApprovalFile || "",
          earnestFile: emailData.earnestFile || "",
          optionFile: emailData.optionFile || "",
          comments: emailData.comments || "",
          ccEmail: emailData.ccEmail || "",
          testMode: sendToTestEmail,
          actualRecipient: sendToTestEmail ? testEmailAddress : emailData.agentEmail
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      throw new Error("Failed to create email record")
    }

    console.log("Sending email to:", emailData.agentEmail)

    // Send email via Resend
    try {
      // Get Resend API key from environment
      const resendApiKey = Deno.env.get("RESEND_API_KEY")
      if (!resendApiKey) {
        throw new Error("RESEND_API_KEY not configured")
      }

      // Prepare email content with proper line breaks
      const bodyParagraphs = emailData.body.split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('');

      let emailContent = `
        <html>
          <body>
            ${bodyParagraphs}
            ${emailData.comments ? `<hr><p><strong>Additional Comments:</strong><br>${emailData.comments.replace(/\n/g, '<br>')}</p>` : ''}
            <hr>
            <p><strong>Attached Documents:</strong></p>
            <ul>
              ${emailData.contractFiles?.map(file => `<li>${file.name || file}</li>`).join('') || ''}
              ${emailData.preApprovalFile ? '<li>Pre-approval Letter</li>' : ''}
              ${emailData.earnestFile ? '<li>Earnest Money Check</li>' : ''}
              ${emailData.optionFile ? '<li>Option Fee Check</li>' : ''}
            </ul>
          </body>
        </html>
      `

      // Prepare recipients (use test email if override is enabled)
      const toRecipients = [actualToEmail];
      const ccRecipients = actualCcEmail ? [actualCcEmail] : [];

      // Send to Resend via API
      const resendPayload = {
        from: "DealDocs <noreply@docu.deals>",
        to: toRecipients,
        subject: emailData.subject,
        html: emailContent,
      };

      // Only add CC if present
      if (ccRecipients.length > 0) {
        resendPayload.cc = ccRecipients;
      }

      console.log("Sending email via Resend:", { to: toRecipients, cc: ccRecipients, subject: emailData.subject });

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resendPayload),
      })

      const resendResult = await resendResponse.json()

      if (!resendResponse.ok) {
        console.error("Resend API error:", resendResult)
        throw new Error(`Resend API error: ${resendResult.message || resendResponse.statusText}`)
      }

      console.log("Email sent successfully via Resend:", resendResult.id)

      // Update email record with Resend email ID
      await supabase
        .from("email_packets")
        .update({
          external_email_id: resendResult.id,
          status: "sent"
        })
        .eq("id", emailRecord.id)

    } catch (emailError) {
      console.error("Email sending error:", emailError)

      // Update email record to failed status
      await supabase
        .from("email_packets")
        .update({
          status: "failed",
          error_message: emailError.message
        })
        .eq("id", emailRecord.id)

      throw new Error(`Failed to send email: ${emailError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailId: emailRecord.id,
        message: "Email sent successfully",
        testMode: sendToTestEmail,
        actualRecipient: sendToTestEmail ? testEmailAddress : emailData.agentEmail
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Send email function error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  }
})
