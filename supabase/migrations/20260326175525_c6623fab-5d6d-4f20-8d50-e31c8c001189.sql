-- Drop the existing policy and re-create with explicit seed-only restriction
DROP POLICY IF EXISTS "Authenticated users can view seed buyers" ON public.buyers;

CREATE POLICY "Only seed buyers are readable"
ON public.buyers
FOR SELECT
TO authenticated
USING (is_seed = true);