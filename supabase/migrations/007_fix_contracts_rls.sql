-- Fix RLS policies for contracts table to be more explicit

-- Drop existing policy to recreate with better permissions
DROP POLICY IF EXISTS "Users can CRUD own contracts" ON public.contracts;

-- Create separate policies for each operation
CREATE POLICY "Users can view own contracts" 
ON public.contracts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create contracts" 
ON public.contracts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contracts" 
ON public.contracts 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contracts" 
ON public.contracts 
FOR DELETE 
USING (auth.uid() = user_id);

-- The listing_agents policies are already properly configured
-- Just ensure the existing ones are correct
-- No changes needed as policies already exist and work correctly