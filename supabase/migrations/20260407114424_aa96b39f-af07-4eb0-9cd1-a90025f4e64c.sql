
-- 1. Drop the overly permissive counterparty policy
DROP POLICY IF EXISTS "Transaction participants can view counterparty profile" ON public.profiles;

-- 2. Create a security definer function that returns only safe counterparty fields
CREATE OR REPLACE FUNCTION public.get_counterparty_profile(_user_id uuid)
RETURNS TABLE(
  user_id uuid,
  full_name text,
  country text,
  city text,
  kyc_status text,
  user_type text,
  company_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    p.user_id,
    p.full_name,
    p.country,
    p.city,
    p.kyc_status,
    p.user_type,
    p.company_name
  FROM public.profiles p
  WHERE p.user_id = _user_id
    AND (
      EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE (t.buyer_id = auth.uid() AND t.seller_id = _user_id)
           OR (t.seller_id = auth.uid() AND t.buyer_id = _user_id)
      )
    );
$$;
