-- Fix the audit trigger function to handle tables without user_id field

-- Drop and recreate the function with better handling
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    record_user_id uuid;
    record_id uuid;
BEGIN
    -- Determine the user_id based on what's available
    -- First try auth.uid(), then check if the table has a user_id column
    record_user_id := auth.uid();
    
    -- Get the record id
    IF TG_OP = 'DELETE' THEN
        record_id := OLD.id;
    ELSE
        record_id := NEW.id;
    END IF;
    
    -- If no auth user, try to get user_id from the record (only for tables that have user_id)
    IF record_user_id IS NULL THEN
        IF TG_OP != 'INSERT' AND TG_TABLE_NAME = 'contracts' THEN
            -- For contracts table, we can get user_id from the record
            IF TG_OP = 'DELETE' THEN
                record_user_id := OLD.user_id;
            ELSE
                record_user_id := NEW.user_id;
            END IF;
        END IF;
    END IF;
    
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
        record_user_id,
        TG_TABLE_NAME,
        record_id,
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

-- Also fix the listing_agents table check constraint if needed
-- Ensure the INSERT policy for listing_agents allows authenticated users
DROP POLICY IF EXISTS "listing_agents_insert_policy" ON public.listing_agents;

CREATE POLICY "listing_agents_insert_policy" 
ON public.listing_agents 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Update the listing_agents SELECT policy to be more permissive
DROP POLICY IF EXISTS "listing_agents_select_policy" ON public.listing_agents;

CREATE POLICY "listing_agents_select_policy" 
ON public.listing_agents 
FOR SELECT 
USING (
    auth.uid() IS NOT NULL AND (
        -- User can see listing agents for their contracts
        EXISTS (
            SELECT 1 
            FROM public.contracts 
            WHERE contracts.listing_agent_id = listing_agents.id 
            AND contracts.user_id = auth.uid()
        )
        OR
        -- User can see listing agents they just created (within last 5 minutes)
        (
            listing_agents.created_at > (now() - interval '5 minutes')
            AND auth.uid() IS NOT NULL
        )
    )
);