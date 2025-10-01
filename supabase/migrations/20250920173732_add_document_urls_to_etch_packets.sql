-- Add document_urls column to store document information
ALTER TABLE etch_packets
ADD COLUMN IF NOT EXISTS document_urls JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN etch_packets.document_urls IS 'Array of document objects with type, path, and url';