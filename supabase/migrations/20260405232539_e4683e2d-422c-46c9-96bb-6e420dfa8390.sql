
-- New table for document checklists
CREATE TABLE public.transaction_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  label TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT true,
  uploaded_url TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE,
  verified BOOLEAN NOT NULL DEFAULT false,
  uploader_role TEXT NOT NULL DEFAULT 'buyer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transaction_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view transaction documents"
ON public.transaction_documents FOR SELECT
TO authenticated
USING (
  transaction_id IN (
    SELECT id FROM public.transactions
    WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
  )
);

CREATE POLICY "Participants can insert transaction documents"
ON public.transaction_documents FOR INSERT
TO authenticated
WITH CHECK (
  transaction_id IN (
    SELECT id FROM public.transactions
    WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
  )
);

CREATE POLICY "Participants can update transaction documents"
ON public.transaction_documents FOR UPDATE
TO authenticated
USING (
  transaction_id IN (
    SELECT id FROM public.transactions
    WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all transaction documents"
ON public.transaction_documents FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all transaction documents"
ON public.transaction_documents FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- New table for offline deadlines
CREATE TABLE public.transaction_deadlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  step_type TEXT NOT NULL,
  label TEXT NOT NULL,
  deadline_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transaction_deadlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view transaction deadlines"
ON public.transaction_deadlines FOR SELECT
TO authenticated
USING (
  transaction_id IN (
    SELECT id FROM public.transactions
    WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
  )
);

CREATE POLICY "Participants can update transaction deadlines"
ON public.transaction_deadlines FOR UPDATE
TO authenticated
USING (
  transaction_id IN (
    SELECT id FROM public.transactions
    WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all transaction deadlines"
ON public.transaction_deadlines FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all transaction deadlines"
ON public.transaction_deadlines FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Add seller/buyer type columns to transactions
ALTER TABLE public.transactions
  ADD COLUMN seller_type TEXT NOT NULL DEFAULT 'private',
  ADD COLUMN buyer_type TEXT NOT NULL DEFAULT 'private';
