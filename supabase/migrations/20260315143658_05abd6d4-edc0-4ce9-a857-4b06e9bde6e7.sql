DROP POLICY "Sellers can create offers" ON public.offers;

CREATE POLICY "Sellers can create offers" ON public.offers
FOR INSERT TO public
WITH CHECK (
  auth.uid() = seller_id
  AND car_id IN (SELECT id FROM public.cars WHERE owner_id = auth.uid())
);