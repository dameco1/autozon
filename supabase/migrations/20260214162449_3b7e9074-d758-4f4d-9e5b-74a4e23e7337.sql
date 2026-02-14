
-- Track car page views
CREATE TABLE public.car_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id uuid NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  viewer_id uuid NULL, -- nullable for anonymous views
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.car_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a view (including anon for public listings)
CREATE POLICY "Anyone can record a view"
  ON public.car_views FOR INSERT
  WITH CHECK (true);

-- Car owners can see views on their cars
CREATE POLICY "Owners can view stats on their cars"
  ON public.car_views FOR SELECT
  USING (
    car_id IN (SELECT id FROM public.cars WHERE owner_id = auth.uid())
  );

-- Track car shortlists (buyer saves a car)
CREATE TABLE public.car_shortlists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id uuid NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(car_id, user_id)
);

ALTER TABLE public.car_shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own shortlists"
  ON public.car_shortlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own shortlists"
  ON public.car_shortlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shortlists"
  ON public.car_shortlists FOR DELETE
  USING (auth.uid() = user_id);

-- Owners can see shortlist counts on their cars
CREATE POLICY "Owners can view shortlists on their cars"
  ON public.car_shortlists FOR SELECT
  USING (
    car_id IN (SELECT id FROM public.cars WHERE owner_id = auth.uid())
  );

-- Create an index for fast count queries
CREATE INDEX idx_car_views_car_id ON public.car_views(car_id);
CREATE INDEX idx_car_shortlists_car_id ON public.car_shortlists(car_id);
CREATE INDEX idx_offers_car_id ON public.offers(car_id);
