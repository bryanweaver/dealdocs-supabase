-- Fix RLS policies for audit_log table
-- Allow authenticated users to insert their own audit records

-- Enable RLS on audit_log if not already enabled
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them
DROP POLICY IF EXISTS "Users can view own audit records" ON public.audit_log;
DROP POLICY IF EXISTS "System can insert audit records" ON public.audit_log;
DROP POLICY IF EXISTS "Users can insert own audit records" ON public.audit_log;

-- Create comprehensive policies for audit_log
-- Allow users to view their own audit records
CREATE POLICY "Users can view own audit records" 
ON public.audit_log 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow authenticated users to insert audit records for their own actions
CREATE POLICY "Users can insert own audit records" 
ON public.audit_log 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow system/service role to manage all audit records (for triggers)
CREATE POLICY "Service role full access" 
ON public.audit_log 
FOR ALL 
USING (auth.jwt()->>'role' = 'service_role')
WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Create or replace the audit trigger function to handle user_id properly
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_log (
        user_id,
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        changed_fields,
        ip_address
    ) VALUES (
        COALESCE(auth.uid(), NEW.user_id, OLD.user_id), -- Try to get user_id from auth, then from record
        TG_TABLE_NAME,
        CASE
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        TG_OP,
        CASE
            WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD)
            ELSE NULL
        END,
        CASE
            WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW)
            ELSE NULL
        END,
        CASE
            WHEN TG_OP = 'UPDATE' THEN
                ARRAY(
                    SELECT jsonb_object_keys(to_jsonb(NEW)) 
                    WHERE to_jsonb(NEW) != to_jsonb(OLD)
                )
            ELSE NULL
        END,
        inet_client_addr()
    );
    
    -- Return the appropriate value
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure audit triggers exist on important tables
DROP TRIGGER IF EXISTS audit_contracts_trigger ON public.contracts;
CREATE TRIGGER audit_contracts_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

DROP TRIGGER IF EXISTS audit_listing_agents_trigger ON public.listing_agents;
CREATE TRIGGER audit_listing_agents_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.listing_agents
FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

DROP TRIGGER IF EXISTS audit_etch_packets_trigger ON public.etch_packets;
CREATE TRIGGER audit_etch_packets_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.etch_packets
FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();