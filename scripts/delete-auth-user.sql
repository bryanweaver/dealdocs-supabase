-- Delete a specific auth user by email
-- Run this in Supabase Studio SQL Editor

-- First, find the user
SELECT id, email, created_at
FROM auth.users
WHERE email = 'your-email@example.com';

-- Then delete the user (replace the UUID with the actual user ID)
-- DELETE FROM auth.users WHERE id = 'user-uuid-here';

-- Or delete by email directly
-- DELETE FROM auth.users WHERE email = 'your-email@example.com';