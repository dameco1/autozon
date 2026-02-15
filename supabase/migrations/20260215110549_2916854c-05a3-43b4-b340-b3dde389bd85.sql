
-- Add suspension fields to profiles
ALTER TABLE public.profiles ADD COLUMN suspended boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN suspension_type text DEFAULT NULL;

-- Admin can update all profiles (for suspension)
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can update all offers (stop/reset negotiations)
CREATE POLICY "Admins can update all offers"
ON public.offers FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all matches
CREATE POLICY "Admins can view all matches"
ON public.matches FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can insert matches (manual assignment)
CREATE POLICY "Admins can insert matches"
ON public.matches FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete matches
CREATE POLICY "Admins can delete matches"
ON public.matches FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can update matches
CREATE POLICY "Admins can update matches"
ON public.matches FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
