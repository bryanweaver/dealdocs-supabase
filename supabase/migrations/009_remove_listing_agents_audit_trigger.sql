-- Remove audit trigger from listing_agents table
-- This table doesn't have a user_id field and the relationship is tracked through contracts table

DROP TRIGGER IF EXISTS audit_listing_agents_trigger ON public.listing_agents;

-- Keep audit triggers only on tables with user_id field
-- The contracts table already tracks the relationship to listing_agents