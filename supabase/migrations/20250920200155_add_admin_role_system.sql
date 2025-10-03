-- Add admin role system to DealDocs

-- Create user_roles table to track admin status
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for performance
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_admin ON user_roles(is_admin) WHERE is_admin = true;

-- Function to automatically create user_roles entry for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  admin_emails TEXT[] := ARRAY[
    'bryan@turbotracts.com',
    'admin@dealdocs.com',
    'test@test.com'  -- Add your email here
  ];
  user_count INTEGER;
BEGIN
  -- Count existing users (excluding the new one)
  SELECT COUNT(*) INTO user_count
  FROM auth.users
  WHERE id != NEW.id;

  -- Insert user_roles entry (explicitly use public schema)
  INSERT INTO public.user_roles (user_id, is_admin)
  VALUES (
    NEW.id,
    -- Make admin if: first user OR email is in admin list
    CASE
      WHEN user_count = 0 THEN true  -- First user becomes admin
      WHEN NEW.email = ANY(admin_emails) THEN true  -- Predefined admins
      ELSE false
    END
  );

  -- Log admin creation (optional)
  IF (user_count = 0 OR NEW.email = ANY(admin_emails)) THEN
    RAISE NOTICE 'Admin user created: %', NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to check if a user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE public.user_roles.user_id = is_admin.user_id
    AND public.user_roles.is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to make a user admin (can be called manually)
CREATE OR REPLACE FUNCTION make_admin(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, is_admin)
  VALUES (target_user_id, true)
  ON CONFLICT (user_id)
  DO UPDATE SET is_admin = true, updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove admin privileges
CREATE OR REPLACE FUNCTION remove_admin(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_roles
  SET is_admin = false, updated_at = NOW()
  WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies for user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own role
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only admins can view all roles
CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Only admins can update roles
CREATE POLICY "Only admins can update roles" ON user_roles
  FOR UPDATE
  USING (is_admin(auth.uid()));

-- Process existing users (if any)
-- This will create user_roles entries for existing users
INSERT INTO user_roles (user_id, is_admin)
SELECT
  id,
  CASE
    WHEN email IN ('bryan@turbotracts.com', 'admin@dealdocs.com', 'test@test.com') THEN true
    WHEN NOT EXISTS (SELECT 1 FROM user_roles LIMIT 1) THEN true -- First user
    ELSE false
  END
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE user_roles IS 'Tracks admin status for users. First user and predefined emails automatically become admins.';
COMMENT ON FUNCTION is_admin IS 'Check if a user has admin privileges';
COMMENT ON FUNCTION make_admin IS 'Grant admin privileges to a user';
COMMENT ON FUNCTION remove_admin IS 'Revoke admin privileges from a user';