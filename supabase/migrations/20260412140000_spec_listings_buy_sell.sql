-- Autozon technical spec v1: listings, shortlists, swipe_events, upload_sessions, listing-photos bucket

CREATE TABLE IF NOT EXISTS public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'removed')),
  title text,
  description text,
  price numeric(10,2),
  year int,
  mileage int,
  make text,
  model text,
  colour text,
  fuel_type text,
  gearbox text,
  condition text,
  location text,
  email_contact text,
  photos text[] NOT NULL DEFAULT '{}',
  valuation_low numeric(10,2),
  valuation_mid numeric(10,2),
  valuation_high numeric(10,2),
  ocr_raw jsonb,
  ai_confidence double precision,
  eurotax_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE INDEX IF NOT EXISTS listings_status_idx ON public.listings (status);
CREATE INDEX IF NOT EXISTS listings_user_id_idx ON public.listings (user_id);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published listings are readable"
  ON public.listings FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Block direct listing writes"
  ON public.listings FOR ALL TO public
  USING (false)
  WITH CHECK (false);

CREATE TABLE IF NOT EXISTS public.shortlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE,
  car_id uuid REFERENCES public.cars(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shortlists_one_target CHECK (
    (listing_id IS NOT NULL AND car_id IS NULL)
    OR (listing_id IS NULL AND car_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS shortlists_user_listing_key
  ON public.shortlists (user_id, listing_id) WHERE listing_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS shortlists_user_car_key
  ON public.shortlists (user_id, car_id) WHERE car_id IS NOT NULL;

ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own shortlist"
  ON public.shortlists FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.swipe_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  car_id uuid REFERENCES public.cars(id) ON DELETE SET NULL,
  direction text NOT NULL CHECK (direction IN ('right', 'left')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT swipe_events_one_target CHECK (
    (listing_id IS NOT NULL AND car_id IS NULL)
    OR (listing_id IS NULL AND car_id IS NOT NULL)
  )
);

ALTER TABLE public.swipe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert swipe events"
  ON public.swipe_events FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.upload_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token text NOT NULL UNIQUE,
  files jsonb NOT NULL DEFAULT '{}'::jsonb,
  ocr_result jsonb,
  valuation_result jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '2 hours')
);

ALTER TABLE public.upload_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Block direct upload_sessions"
  ON public.upload_sessions FOR ALL TO public
  USING (false)
  WITH CHECK (false);

-- RPCs (session secret required for mutating drafts)
CREATE OR REPLACE FUNCTION public.create_listing_session()
RETURNS TABLE (id uuid, session_token text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tok text := encode(gen_random_bytes(24), 'hex');
  new_id uuid;
BEGIN
  INSERT INTO public.listings (session_token) VALUES (tok) RETURNING listings.id INTO new_id;
  RETURN QUERY SELECT new_id, tok;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_listing_for_session(p_id uuid, p_session_token text)
RETURNS SETOF public.listings
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.listings
  WHERE listings.id = p_id AND listings.session_token = p_session_token
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.update_listing_session(p_id uuid, p_session_token text, p_patch jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n int;
  photos_arr text[];
BEGIN
  IF p_patch ? 'photos' THEN
    SELECT ARRAY(SELECT jsonb_array_elements_text(p_patch->'photos')) INTO photos_arr;
  END IF;

  UPDATE public.listings SET
    title = COALESCE(NULLIF(p_patch->>'title', ''), title),
    description = COALESCE(NULLIF(p_patch->>'description', ''), description),
    price = COALESCE((p_patch->>'price')::numeric, price),
    year = COALESCE((p_patch->>'year')::int, year),
    mileage = COALESCE((p_patch->>'mileage')::int, mileage),
    make = COALESCE(NULLIF(p_patch->>'make', ''), make),
    model = COALESCE(NULLIF(p_patch->>'model', ''), model),
    colour = COALESCE(NULLIF(p_patch->>'colour', ''), colour),
    fuel_type = COALESCE(NULLIF(p_patch->>'fuel_type', ''), fuel_type),
    gearbox = COALESCE(NULLIF(p_patch->>'gearbox', ''), gearbox),
    condition = COALESCE(NULLIF(p_patch->>'condition', ''), condition),
    location = COALESCE(NULLIF(p_patch->>'location', ''), location),
    valuation_low = COALESCE((p_patch->>'valuation_low')::numeric, valuation_low),
    valuation_mid = COALESCE((p_patch->>'valuation_mid')::numeric, valuation_mid),
    valuation_high = COALESCE((p_patch->>'valuation_high')::numeric, valuation_high),
    ocr_raw = COALESCE(p_patch->'ocr_raw', ocr_raw),
    ai_confidence = COALESCE((p_patch->>'ai_confidence')::double precision, ai_confidence),
    photos = CASE WHEN p_patch ? 'photos' THEN COALESCE(photos_arr, photos) ELSE photos END,
    status = COALESCE(NULLIF(p_patch->>'status', ''), status)
  WHERE listings.id = p_id AND listings.session_token = p_session_token;

  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.publish_listing_session(
  p_id uuid,
  p_session_token text,
  p_email text,
  p_user_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n int;
BEGIN
  UPDATE public.listings SET
    status = 'published',
    published_at = now(),
    email_contact = COALESCE(NULLIF(p_email, ''), email_contact),
    user_id = COALESCE(p_user_id, user_id)
  WHERE listings.id = p_id AND listings.session_token = p_session_token;

  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.link_listing_to_user(p_id uuid, p_session_token text, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n int;
BEGIN
  UPDATE public.listings SET user_id = p_user_id
  WHERE listings.id = p_id AND listings.session_token = p_session_token;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.create_listing_session() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_listing_for_session(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_listing_session(uuid, text, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.publish_listing_session(uuid, text, text, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.link_listing_to_user(uuid, text, uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_listing_session() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_listing_for_session(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_listing_session(uuid, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.publish_listing_session(uuid, text, text, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.link_listing_to_user(uuid, text, uuid) TO anon, authenticated;

INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Listing photos public read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'listing-photos');

CREATE POLICY "Listing photo uploads under sessions"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (
    bucket_id = 'listing-photos'
    AND (storage.foldername(name))[1] = 'sessions'
  );

CREATE POLICY "Listing photo update under sessions"
  ON storage.objects FOR UPDATE TO public
  USING (bucket_id = 'listing-photos' AND (storage.foldername(name))[1] = 'sessions');

CREATE POLICY "Listing photo delete under sessions"
  ON storage.objects FOR DELETE TO public
  USING (bucket_id = 'listing-photos' AND (storage.foldername(name))[1] = 'sessions');
