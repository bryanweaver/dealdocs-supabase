-- Add missing columns and fix column names for contract_documents table

-- Add file_path column (alias for storage_path)
ALTER TABLE contract_documents 
ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Copy existing storage_path data to file_path
UPDATE contract_documents 
SET file_path = storage_path 
WHERE file_path IS NULL AND storage_path IS NOT NULL;

-- Add storage_url column for public URLs
ALTER TABLE contract_documents 
ADD COLUMN IF NOT EXISTS storage_url TEXT;

-- Update the document_type check constraint to include the types used by the app
ALTER TABLE contract_documents 
DROP CONSTRAINT IF EXISTS contract_documents_document_type_check;

ALTER TABLE contract_documents 
ADD CONSTRAINT contract_documents_document_type_check 
CHECK (document_type = ANY (ARRAY[
  'contract'::text, 
  'amendment'::text, 
  'disclosure'::text, 
  'inspection'::text, 
  'appraisal'::text,
  'preapproval'::text,      -- Pre-approval letters
  'earnest_check'::text,    -- Earnest money check
  'option_check'::text,     -- Option fee check  
  'other'::text
]));