-- Owners can view their own cars regardless of status
CREATE POLICY "Owners can view own cars"
  ON public.cars FOR SELECT
  USING (auth.uid() = owner_id);