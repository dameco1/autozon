-- Allow sellers to create offers (seller initiates negotiation with matched buyers)
CREATE POLICY "Sellers can create offers"
ON public.offers
FOR INSERT
WITH CHECK (auth.uid() = seller_id);