-- Update email_packets table for Resend integration
-- Rename ses_message_id to external_email_id (generic for any provider)
ALTER TABLE email_packets RENAME COLUMN ses_message_id TO external_email_id;

-- Add error_message column for tracking email failures
ALTER TABLE email_packets ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Update comment to reflect Resend integration
COMMENT ON TABLE email_packets IS 'Email delivery tracking table for Resend integration';
COMMENT ON COLUMN email_packets.external_email_id IS 'External email service message ID (e.g., Resend email ID)';
COMMENT ON COLUMN email_packets.error_message IS 'Error message if email sending failed';
