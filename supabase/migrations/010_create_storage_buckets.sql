-- Create storage buckets for contracts and supporting documents
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES 
  -- Main contracts bucket for all contract-related files (PDFs, pre-approvals, checks, etc.)
  ('contracts', 'contracts', false, false, 52428800, ARRAY[
    'application/pdf',           -- PDF documents (pre-approval letters, signed contracts)
    'image/jpeg',                -- Check photos
    'image/jpg',                 -- Check photos
    'image/png',                 -- Screenshots, check photos
    'image/gif',                 -- Images
    'image/webp',                -- Modern image format
    'application/msword',        -- Legacy Word docs
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' -- Modern Word docs
  ])
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop contracts policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can upload their own contract files') THEN
    DROP POLICY "Authenticated users can upload their own contract files" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can view their own contract files') THEN
    DROP POLICY "Authenticated users can view their own contract files" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can update their own contract files') THEN
    DROP POLICY "Authenticated users can update their own contract files" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can delete their own contract files') THEN
    DROP POLICY "Authenticated users can delete their own contract files" ON storage.objects;
  END IF;
  
END $$;

-- Contracts bucket policies (private, user-specific)
CREATE POLICY "Authenticated users can upload their own contract files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'contracts' 
  AND (storage.foldername(name))[1] = 'accounts'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Authenticated users can view their own contract files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'contracts' 
  AND (storage.foldername(name))[1] = 'accounts'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Authenticated users can update their own contract files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'contracts' 
  AND (storage.foldername(name))[1] = 'accounts'
  AND (storage.foldername(name))[2] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'contracts' 
  AND (storage.foldername(name))[1] = 'accounts'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Authenticated users can delete their own contract files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'contracts' 
  AND (storage.foldername(name))[1] = 'accounts'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

