-- Fix storage bucket configuration and RLS policies for signed URL access
-- This migration ensures private buckets work correctly with signed URLs

-- Drop existing policies (they should exist from migration 010)
DROP POLICY IF EXISTS "Authenticated users can upload their own contract files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view their own contract files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own contract files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their own contract files" ON storage.objects;

-- Create optimized policies for signed URL access
-- These policies will work correctly with both direct access and signed URLs

-- Upload policy - users can upload to their own folders
CREATE POLICY "contracts_upload_policy"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'contracts' 
  AND (storage.foldername(name))[1] = 'accounts'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Select policy - users can view their own files (required for signed URLs)
CREATE POLICY "contracts_select_policy"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'contracts' 
  AND (storage.foldername(name))[1] = 'accounts'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Update policy - users can update their own files
CREATE POLICY "contracts_update_policy"
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

-- Delete policy - users can delete their own files
CREATE POLICY "contracts_delete_policy"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'contracts' 
  AND (storage.foldername(name))[1] = 'accounts'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Ensure the contracts bucket exists and is properly configured
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES 
  ('contracts', 'contracts', false, false, 52428800, ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ])
ON CONFLICT (id) DO UPDATE SET
  public = false, -- Ensure bucket remains private
  file_size_limit = 52428800, -- 50MB limit
  allowed_mime_types = ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

-- Create a helper function to generate signed URLs (for reference)
-- This function can be called from the application to get proper signed URLs
CREATE OR REPLACE FUNCTION get_contract_file_url(
  file_path TEXT,
  expires_in INTEGER DEFAULT 3600
) 
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_folder TEXT;
  result TEXT;
BEGIN
  -- Extract user folder from path
  user_folder := split_part(file_path, '/', 3);
  
  -- Check if the user has access to this file
  IF user_folder != auth.uid()::text THEN
    RAISE EXCEPTION 'Access denied to file: %', file_path;
  END IF;
  
  -- Note: This function serves as documentation
  -- The actual signed URL generation must be done client-side
  -- using supabase.storage.from('contracts').createSignedUrl()
  
  RETURN 'Use supabase.storage.from(''contracts'').createSignedUrl(''' || file_path || ''', ' || expires_in || ')';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_contract_file_url TO authenticated;