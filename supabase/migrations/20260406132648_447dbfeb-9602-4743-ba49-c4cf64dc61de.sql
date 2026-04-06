-- Allow transaction participants to view cars they're involved in
CREATE POLICY "Transaction participants can view transaction cars"
ON public.cars
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT t.car_id FROM transactions t
    WHERE t.buyer_id = auth.uid() OR t.seller_id = auth.uid()
  )
);