-- DealDocs Initial Database Schema Migration
-- This migration creates the complete database schema for the DealDocs application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full text search extension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Contracts table (main table)
CREATE TABLE contracts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  legacy_id TEXT UNIQUE, -- Store original Amplify ID for reference
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Status fields
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Form sections (matching Vuex store structure exactly)
  property_info JSONB DEFAULT '{}'::JSONB,
  parties JSONB DEFAULT '{}'::JSONB,
  financial_details JSONB DEFAULT '{}'::JSONB,
  title_closing JSONB DEFAULT '{}'::JSONB,
  legal_sections JSONB DEFAULT '{}'::JSONB,
  additional_info JSONB DEFAULT '{}'::JSONB,
  
  -- Progress tracking
  progress JSONB DEFAULT '{}'::JSONB,
  marked_questions TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Searchable fields (extracted for indexing)
  mls_number TEXT,
  property_address TEXT,
  buyer_name TEXT,
  seller_name TEXT,
  contract_date DATE,
  
  -- PDF and document tracking
  pdf_url TEXT,
  pdf_generated_at TIMESTAMPTZ,
  signed_pdf_url TEXT,
  signed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_contracts_user ON contracts(user_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_mls ON contracts(mls_number);
CREATE INDEX idx_contracts_created ON contracts(created_at DESC);
CREATE INDEX idx_contracts_property_gin ON contracts USING GIN (property_info);
CREATE INDEX idx_contracts_parties_gin ON contracts USING GIN (parties);
CREATE INDEX idx_contracts_financial_gin ON contracts USING GIN (financial_details);

-- Full text search index for property addresses
CREATE INDEX idx_contracts_property_address_fulltext ON contracts USING GIN (to_tsvector('english', property_address));

-- Etch Packets (e-signature tracking)
CREATE TABLE etch_packets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  etch_packet_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'viewed', 'signed', 'completed', 'cancelled', 'expired')),
  signer_info JSONB DEFAULT '{}'::JSONB,
  pdf_url TEXT,
  signed_pdf_url TEXT,
  anvil_cast_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Tracking details
  signer_email TEXT,
  signer_name TEXT,
  webhook_payload JSONB DEFAULT '{}'::JSONB
);

-- Indexes for etch packets
CREATE INDEX idx_etch_packets_contract ON etch_packets(contract_id);
CREATE INDEX idx_etch_packets_status ON etch_packets(status);
CREATE INDEX idx_etch_packets_etch_id ON etch_packets(etch_packet_id);
CREATE INDEX idx_etch_packets_signer_email ON etch_packets(signer_email);

-- Email Packets (email tracking)
CREATE TABLE email_packets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  email_type TEXT CHECK (email_type IN ('listing_agent', 'buyer', 'seller', 'title_company', 'lender')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'failed')),
  ses_message_id TEXT,
  
  -- Email content tracking
  subject TEXT,
  email_body TEXT,
  attachments JSONB DEFAULT '[]'::JSONB,
  
  -- Tracking metadata
  tracking_pixel_viewed BOOLEAN DEFAULT FALSE,
  user_agent TEXT,
  ip_address INET
);

-- Indexes for email packets
CREATE INDEX idx_email_packets_contract ON email_packets(contract_id);
CREATE INDEX idx_email_packets_recipient ON email_packets(recipient_email);
CREATE INDEX idx_email_packets_type ON email_packets(email_type);
CREATE INDEX idx_email_packets_status ON email_packets(status);
CREATE INDEX idx_email_packets_sent ON email_packets(sent_at DESC);

-- Agents table (listing agents database)
CREATE TABLE agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  mls_id TEXT UNIQUE,
  brokerage TEXT,
  license_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'TX',
  zip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Additional contact information
  website TEXT,
  bio TEXT,
  specialties TEXT[],
  
  -- Status and validation
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  last_contacted TIMESTAMPTZ,
  
  -- Social media and professional links
  linkedin_url TEXT,
  facebook_url TEXT,
  twitter_url TEXT
);

-- Full text search for agents
ALTER TABLE agents ADD COLUMN search_vector tsvector 
  GENERATED ALWAYS AS (
    to_tsvector('english', 
      coalesce(name, '') || ' ' || 
      coalesce(email, '') || ' ' || 
      coalesce(brokerage, '') || ' ' ||
      coalesce(mls_id, '') || ' ' ||
      coalesce(city, '') || ' ' ||
      coalesce(license_number, '')
    )
  ) STORED;

-- Indexes for agents
CREATE INDEX idx_agents_search ON agents USING GIN(search_vector);
CREATE INDEX idx_agents_mls_id ON agents(mls_id);
CREATE INDEX idx_agents_email ON agents(email);
CREATE INDEX idx_agents_name_trgm ON agents USING GIN (name gin_trgm_ops);
CREATE INDEX idx_agents_brokerage_trgm ON agents USING GIN (brokerage gin_trgm_ops);
CREATE INDEX idx_agents_city ON agents(city);
CREATE INDEX idx_agents_state ON agents(state);
CREATE INDEX idx_agents_active ON agents(is_active) WHERE is_active = TRUE;

-- Contract documents/files
CREATE TABLE contract_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  storage_bucket TEXT DEFAULT 'contracts',
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id),
  
  -- Document categorization
  document_type TEXT CHECK (document_type IN ('contract', 'amendment', 'disclosure', 'inspection', 'appraisal', 'other')),
  description TEXT,
  
  -- Version control
  version INTEGER DEFAULT 1,
  is_current_version BOOLEAN DEFAULT TRUE,
  replaced_by UUID REFERENCES contract_documents(id),
  
  -- Access control
  is_public BOOLEAN DEFAULT FALSE,
  access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'shared', 'public'))
);

-- Indexes for contract documents
CREATE INDEX idx_contract_documents_contract ON contract_documents(contract_id);
CREATE INDEX idx_contract_documents_type ON contract_documents(document_type);
CREATE INDEX idx_contract_documents_uploaded ON contract_documents(uploaded_at DESC);
CREATE INDEX idx_contract_documents_current ON contract_documents(is_current_version) WHERE is_current_version = TRUE;

-- Audit log table for tracking changes
CREATE TABLE audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Index for audit log
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp DESC);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create audit triggers
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log(table_name, record_id, action, new_values)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log(table_name, record_id, action, old_values, new_values)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log(table_name, record_id, action, old_values)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers to main tables
CREATE TRIGGER contracts_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON contracts
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER agents_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON agents
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- Enable Row Level Security
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE etch_packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contracts
CREATE POLICY "Users can CRUD own contracts" ON contracts
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for etch packets
CREATE POLICY "Users can view own etch packets" ON etch_packets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = etch_packets.contract_id 
      AND contracts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert etch packets for own contracts" ON etch_packets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = etch_packets.contract_id 
      AND contracts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own etch packets" ON etch_packets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = etch_packets.contract_id 
      AND contracts.user_id = auth.uid()
    )
  );

-- RLS Policies for email packets
CREATE POLICY "Users can view own email packets" ON email_packets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = email_packets.contract_id 
      AND contracts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert email packets for own contracts" ON email_packets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = email_packets.contract_id 
      AND contracts.user_id = auth.uid()
    )
  );

-- RLS Policies for contract documents
CREATE POLICY "Users can manage own documents" ON contract_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = contract_documents.contract_id 
      AND contracts.user_id = auth.uid()
    )
  );

-- RLS Policies for agents (public read access)
CREATE POLICY "Anyone can read active agents" ON agents
  FOR SELECT USING (is_active = TRUE);

-- Only authenticated users can see inactive agents (for admin purposes)
CREATE POLICY "Auth users can read all agents" ON agents
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for audit log
CREATE POLICY "Users can view own audit records" ON audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- Create a view for contract summaries (optimized for list views)
CREATE VIEW contract_summaries AS
SELECT 
  c.id,
  c.status,
  c.created_at,
  c.updated_at,
  c.mls_number,
  c.property_address,
  c.buyer_name,
  c.seller_name,
  c.contract_date,
  (c.property_info->>'city') as property_city,
  (c.property_info->>'state') as property_state,
  (c.financial_details->>'purchasePrice')::numeric as purchase_price,
  COUNT(ep.id) as etch_packet_count,
  COUNT(emp.id) as email_packet_count,
  COUNT(cd.id) as document_count,
  MAX(ep.status) as latest_etch_status
FROM contracts c
LEFT JOIN etch_packets ep ON c.id = ep.contract_id
LEFT JOIN email_packets emp ON c.id = emp.contract_id
LEFT JOIN contract_documents cd ON c.id = cd.contract_id AND cd.is_current_version = TRUE
GROUP BY c.id, c.status, c.created_at, c.updated_at, c.mls_number, 
         c.property_address, c.buyer_name, c.seller_name, c.contract_date,
         c.property_info, c.financial_details;

-- Add RLS to the view
ALTER VIEW contract_summaries SET (security_barrier = true);

-- Create a function for agent search with ranking
CREATE OR REPLACE FUNCTION search_agents(search_term TEXT, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  mls_id TEXT,
  brokerage TEXT,
  city TEXT,
  state TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.email,
    a.phone,
    a.mls_id,
    a.brokerage,
    a.city,
    a.state,
    ts_rank_cd(a.search_vector, plainto_tsquery('english', search_term)) +
    CASE 
      WHEN a.name ILIKE '%' || search_term || '%' THEN 0.5
      WHEN a.mls_id ILIKE '%' || search_term || '%' THEN 0.3
      ELSE 0
    END as rank
  FROM agents a
  WHERE a.is_active = TRUE
    AND (
      a.search_vector @@ plainto_tsquery('english', search_term)
      OR a.name ILIKE '%' || search_term || '%'
      OR a.mls_id ILIKE '%' || search_term || '%'
      OR a.brokerage ILIKE '%' || search_term || '%'
    )
  ORDER BY rank DESC, a.name ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get contract progress percentage
CREATE OR REPLACE FUNCTION calculate_contract_progress(contract_row contracts)
RETURNS INTEGER AS $$
DECLARE
  total_sections INTEGER := 6; -- property_info, parties, financial_details, title_closing, legal_sections, additional_info
  completed_sections INTEGER := 0;
BEGIN
  -- Count non-empty sections
  IF (contract_row.property_info != '{}'::JSONB AND contract_row.property_info != 'null'::JSONB) THEN
    completed_sections := completed_sections + 1;
  END IF;
  
  IF (contract_row.parties != '{}'::JSONB AND contract_row.parties != 'null'::JSONB) THEN
    completed_sections := completed_sections + 1;
  END IF;
  
  IF (contract_row.financial_details != '{}'::JSONB AND contract_row.financial_details != 'null'::JSONB) THEN
    completed_sections := completed_sections + 1;
  END IF;
  
  IF (contract_row.title_closing != '{}'::JSONB AND contract_row.title_closing != 'null'::JSONB) THEN
    completed_sections := completed_sections + 1;
  END IF;
  
  IF (contract_row.legal_sections != '{}'::JSONB AND contract_row.legal_sections != 'null'::JSONB) THEN
    completed_sections := completed_sections + 1;
  END IF;
  
  IF (contract_row.additional_info != '{}'::JSONB AND contract_row.additional_info != 'null'::JSONB) THEN
    completed_sections := completed_sections + 1;
  END IF;
  
  RETURN (completed_sections * 100 / total_sections);
END;
$$ LANGUAGE plpgsql;

-- Insert some sample agents data for testing
INSERT INTO agents (name, email, phone, mls_id, brokerage, city, state, is_active, is_verified) VALUES
('Jane Smith', 'jane.smith@realty.com', '(555) 123-4567', 'TX001234', 'Premium Realty Group', 'Austin', 'TX', true, true),
('Bob Johnson', 'bob.johnson@homes.com', '(555) 234-5678', 'TX002345', 'Johnson & Associates', 'Dallas', 'TX', true, true),
('Sarah Wilson', 'sarah.wilson@properties.com', '(555) 345-6789', 'TX003456', 'Wilson Properties', 'Houston', 'TX', true, false),
('Mike Davis', 'mike.davis@realestate.com', '(555) 456-7890', 'TX004567', 'Davis Real Estate', 'San Antonio', 'TX', true, true),
('Lisa Brown', 'lisa.brown@homes.net', '(555) 567-8901', 'TX005678', 'Brown Homes LLC', 'Fort Worth', 'TX', true, true);

-- Create storage buckets (this needs to be done via Supabase dashboard or API)
-- For reference, we need these buckets:
-- - contracts (for PDF files and documents)
-- - signatures (for signed documents)
-- - attachments (for email attachments)

COMMENT ON TABLE contracts IS 'Main contracts table storing all real estate contract data with JSONB sections matching Vuex store structure';
COMMENT ON TABLE etch_packets IS 'E-signature tracking table for Anvil Etch integration';
COMMENT ON TABLE email_packets IS 'Email delivery tracking table for SES integration';
COMMENT ON TABLE agents IS 'Real estate agents database with full-text search capabilities';
COMMENT ON TABLE contract_documents IS 'File storage tracking for contract-related documents';
COMMENT ON TABLE audit_log IS 'Comprehensive audit trail for all data changes';