-- Prevent buyers from making offers on their own cars (RLS)
-- Drop and recreate the insert policy for offers to add owner check
DROP POLICY IF EXISTS "Buyers can create offers" ON public.offers;
CREATE POLICY "Buyers can create offers" ON public.offers
FOR INSERT
WITH CHECK (
  auth.uid() = buyer_id
  AND buyer_id != seller_id
  AND NOT EXISTS (
    SELECT 1 FROM public.cars WHERE id = car_id AND owner_id = auth.uid()
  )
);

-- Prevent users from shortlisting their own cars
DROP POLICY IF EXISTS "Users can insert own shortlists" ON public.car_shortlists;
CREATE POLICY "Users can insert own shortlists" ON public.car_shortlists
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (
    SELECT 1 FROM public.cars WHERE id = car_id AND owner_id = auth.uid()
  )
);

-- Prevent users from creating transactions on their own cars
DROP POLICY IF EXISTS "Buyers can insert own transactions" ON public.transactions;
CREATE POLICY "Buyers can insert own transactions" ON public.transactions
FOR INSERT
WITH CHECK (
  auth.uid() = buyer_id
  AND buyer_id != seller_id
);