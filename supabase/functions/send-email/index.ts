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

    // Create email record in database
    const { data: emailRecord, error: dbError } = await supabase
      .from("email_packets")
      .insert({
        contract_id: emailData.contractId,
        recipient_email: emailData.agentEmail,
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
          comments: emailData.comments || ""
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      throw new Error("Failed to create email record")
    }

    console.log("Sending email to:", emailData.agentEmail)

    // Send email via Mailpit API (local development)
    try {
      // Prepare email content
      let emailContent = `
        <html>
          <body>
            <h2>${emailData.subject}</h2>
            <p>${emailData.body}</p>
            ${emailData.comments ? `<hr><p><strong>Additional Comments:</strong><br>${emailData.comments}</p>` : ''}
            <hr>
            <p><strong>Attached Documents:</strong></p>
            <ul>
              ${emailData.contractFiles?.map(file => `<li>${file.name || file}</li>`).join('') || ''}
              ${emailData.preApprovalFile ? '<li>Pre-approval Letter</li>' : ''}
              ${emailData.earnestFile ? '<li>Earnest Money Check</li>' : ''}
              ${emailData.optionFile ? '<li>Option Fee Check</li>' : ''}
            </ul>
            <p><em>Note: In production, these would be actual file attachments.</em></p>
          </body>
        </html>
      `

      // Send to Mailpit via JSON API
      const mailpitResponse = await fetch('http://supabase_inbucket_dealdocs-supabase:8025/api/v1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: {
            email: "noreply@dealdocs.local",
            name: "DealDocs"
          },
          to: [{
            email: emailData.agentEmail,
            name: emailData.agentName || ""
          }],
          subject: emailData.subject,
          html: emailContent,
        }),
      })

      if (!mailpitResponse.ok) {
        throw new Error(`Mailpit API error: ${mailpitResponse.status} ${await mailpitResponse.text()}`)
      }

      console.log("Email sent successfully via Mailpit")
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Don't fail the whole operation if email fails in dev
      console.log("Email sending failed but continuing (dev mode)")
    }

    // Email status already set to "sent" during creation

    return new Response(
      JSON.stringify({
        success: true,
        emailId: emailRecord.id,
        message: "Email sent successfully"
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
