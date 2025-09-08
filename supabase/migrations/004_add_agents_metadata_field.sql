-- Add metadata field to agents table for storing rich agent data
-- This supports the CSV import with additional agent information

ALTER TABLE agents ADD COLUMN metadata JSONB;

-- Create index on metadata for efficient queries
CREATE INDEX idx_agents_metadata ON agents USING GIN(metadata);

-- Update the search vector to include searchable metadata fields
-- First drop the existing generated column
ALTER TABLE agents DROP COLUMN search_vector;

-- Recreate with metadata support
ALTER TABLE agents ADD COLUMN search_vector tsvector 
  GENERATED ALWAYS AS (
    to_tsvector('english', 
      coalesce(name, '') || ' ' || 
      coalesce(email, '') || ' ' || 
      coalesce(brokerage, '') || ' ' ||
      coalesce(mls_id, '') || ' ' ||
      coalesce(city, '') || ' ' ||
      coalesce(license_number, '') || ' ' ||
      coalesce((metadata->>'agency_name'), '') || ' ' ||
      coalesce((metadata->>'mls_number'), '') || ' ' ||
      coalesce((metadata->>'agent_lisence'), '') || ' ' ||
      coalesce((metadata->>'home_types'), '')
    )
  ) STORED;

-- Recreate the search index
CREATE INDEX idx_agents_search ON agents USING GIN(search_vector);

COMMENT ON COLUMN agents.metadata IS 'Rich metadata from agent sources including MLS info, experience, social media, etc.';