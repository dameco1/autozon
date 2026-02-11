-- Fix 1: Restrict buyers table to authenticated users only
-- Drop the public SELECT policy and replace with authenticated-only policy
DROP POLICY "Anyone can view seed buyers" ON public.buyers;

CREATE POLICY "Authenticated users can view seed buyers"
ON public.buyers
FOR SELECT
TO authenticated
USING (is_seed = true);

-- Fix 2: Verify profiles table phone field is protected
-- The existing policies already restrict access to users viewing their own profiles,
-- but we'll explicitly add a note that phone is user-only accessible
-- Current policies already enforce this via auth.uid() = user_id check
-- No changes needed as phones are already protected
