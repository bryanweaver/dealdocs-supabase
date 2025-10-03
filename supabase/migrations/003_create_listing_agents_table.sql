-- Migration: Create listing_agents table and update contracts table
-- This migration creates a normalized listing_agents table based on the ListingAgent type from the schema

-- Create listing_agents table based on the original ListingAgent type
CREATE TABLE listing_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Basic listing agent info
  has_listing_agent_info BOOLEAN DEFAULT FALSE,
  
  -- Firm information
  firm_name TEXT,
  firm_license_number TEXT,
  firm_street_address TEXT,
  firm_city TEXT,
  firm_state TEXT,
  firm_postal_code TEXT,
  firm_phone TEXT,
  
  -- Listing Associate
  listing_associate_name TEXT,
  listing_associate_license_number TEXT,
  listing_associate_team_name TEXT,
  listing_associate_email TEXT,
  listing_associate_phone TEXT,
  listing_associate_supervisor_name TEXT,
  listing_associate_supervisor_license_number TEXT,
  
  -- Selling Associate
  selling_associate_name TEXT,
  selling_associate_license_number TEXT,
  selling_associate_team_name TEXT,
  selling_associate_email TEXT,
  selling_associate_phone TEXT,
  selling_associate_supervisor_name TEXT,
  selling_associate_supervisor_license_number TEXT,
  selling_associate_street_address TEXT,
  selling_associate_city TEXT,
  selling_associate_state TEXT,
  selling_associate_postal_code TEXT
);

-- Add listing_agent_id foreign key to contracts table
ALTER TABLE contracts ADD COLUMN listing_agent_id UUID REFERENCES listing_agents(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX idx_contracts_listing_agent_id ON contracts(listing_agent_id) WHERE listing_agent_id IS NOT NULL;
CREATE INDEX idx_listing_agents_firm_name ON listing_agents(firm_name) WHERE firm_name IS NOT NULL;
CREATE INDEX idx_listing_agents_listing_associate_name ON listing_agents(listing_associate_name) WHERE listing_associate_name IS NOT NULL;
CREATE INDEX idx_listing_agents_listing_associate_email ON listing_agents(listing_associate_email) WHERE listing_associate_email IS NOT NULL;

-- Create function to update updated_at column if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger for listing_agents table
CREATE TRIGGER update_listing_agents_updated_at
  BEFORE UPDATE ON listing_agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on listing_agents table
ALTER TABLE listing_agents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for listing_agents table
-- Allow users to read all listing agents (they're generally public information)
CREATE POLICY "listing_agents_select_policy" ON listing_agents
  FOR SELECT USING (true);

-- Allow authenticated users to insert listing agents
CREATE POLICY "listing_agents_insert_policy" ON listing_agents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update listing agents they have access to via contracts
CREATE POLICY "listing_agents_update_policy" ON listing_agents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.listing_agent_id = listing_agents.id 
      AND contracts.user_id = auth.uid()
    )
  );

-- Allow users to delete listing agents they have access to via contracts
CREATE POLICY "listing_agents_delete_policy" ON listing_agents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.listing_agent_id = listing_agents.id 
      AND contracts.user_id = auth.uid()
    )
  );

-- Update the contract_summaries view if it exists
DROP VIEW IF EXISTS contract_summaries;
CREATE VIEW contract_summaries AS
SELECT 
  c.id,
  c.status,
  c.created_at,
  c.updated_at,
  c.user_id,
  c.property_info,
  c.parties,
  c.financial_details,
  c.listing_agent_id,
  la.listing_associate_name as listing_agent_name,
  la.listing_associate_email as listing_agent_email,
  la.firm_name as listing_agent_firm_name,
  (c.property_info->>'streetAddress') as property_address,
  (c.property_info->>'city') as property_city,
  (c.property_info->>'state') as property_state,
  (c.parties->'buyers'->>'primaryName') as buyer_name,
  (c.parties->'sellers'->>'primaryName') as seller_name
FROM contracts c
LEFT JOIN listing_agents la ON c.listing_agent_id = la.id;

-- Enable RLS on the view
ALTER VIEW contract_summaries SET (security_barrier = true);