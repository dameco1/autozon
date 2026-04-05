
CREATE TABLE public.negotiation_rounds (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id uuid NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  round_number integer NOT NULL DEFAULT 1,
  actor_id uuid NOT NULL,
  actor_role text NOT NULL CHECK (actor_role IN ('buyer', 'seller')),
  action text NOT NULL CHECK (action IN ('offer', 'counter', 'accept', 'reject')),
  amount numeric NOT NULL,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.negotiation_rounds ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_negotiation_rounds_offer_id ON public.negotiation_rounds(offer_id);

-- Buyers can view rounds on their offers
CREATE POLICY "Buyers can view rounds on own offers"
ON public.negotiation_rounds
FOR SELECT
TO authenticated
USING (
  offer_id IN (SELECT id FROM public.offers WHERE buyer_id = auth.uid())
);

-- Sellers can view rounds on their offers
CREATE POLICY "Sellers can view rounds on own offers"
ON public.negotiation_rounds
FOR SELECT
TO authenticated
USING (
  offer_id IN (SELECT id FROM public.offers WHERE seller_id = auth.uid())
);

-- Admins can view all rounds
CREATE POLICY "Admins can view all rounds"
ON public.negotiation_rounds
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Participants can insert rounds
CREATE POLICY "Participants can insert rounds"
ON public.negotiation_rounds
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = actor_id
  AND offer_id IN (
    SELECT id FROM public.offers WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
  )
);
