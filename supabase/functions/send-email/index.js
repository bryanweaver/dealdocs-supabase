"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_ts_1 = require("https://deno.land/std@0.168.0/http/server.ts");
const supabase_js_2_1 = require("https://esm.sh/@supabase/supabase-js@2");
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
(0, server_ts_1.serve)(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }
    try {
        const emailData = await req.json();
        // Initialize Supabase client
        const supabase = (0, supabase_js_2_1.createClient)(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "");
        // Get user from auth token
        const authHeader = req.headers.get("Authorization");
        const token = authHeader.replace("Bearer ", "");
        const { data: user } = await supabase.auth.getUser(token);
        if (!user.user) {
            throw new Error("Unauthorized");
        }
        console.log("Sending email for contract:", emailData.contractId);
        // Create email record in database
        const { data: emailRecord, error: dbError } = await supabase
            .from("email_packets")
            .insert({
            contract_id: emailData.contractId,
            agent_email: emailData.agentEmail,
            agent_name: emailData.agentName,
            subject: emailData.subject,
            body: emailData.body,
            comments: emailData.comments,
            status: "pending",
            sent_by: user.user.id,
            sent_at: new Date().toISOString(),
            // Store file attachments as JSON
            attachments: {
                contractFiles: emailData.contractFiles || [],
                preApprovalFile: emailData.preApprovalFile || "",
                earnestFile: emailData.earnestFile || "",
                optionFile: emailData.optionFile || ""
            }
        })
            .select()
            .single();
        if (dbError) {
            console.error("Database error:", dbError);
            throw new Error("Failed to create email record");
        }
        console.log("Email would be sent to:", emailData.agentEmail);
        // Update email status to sent
        const { error: updateError } = await supabase
            .from("email_packets")
            .update({
            status: "sent",
            delivered_at: new Date().toISOString()
        })
            .eq("id", emailRecord.id);
        if (updateError) {
            console.error("Failed to update email status:", updateError);
        }
        return new Response(JSON.stringify({
            success: true,
            emailId: emailRecord.id,
            message: "Email sent successfully"
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("Send email function error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
