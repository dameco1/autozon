
-- Create buyers table
CREATE TABLE public.buyers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL DEFAULT 'private',
  name text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  budget_min numeric DEFAULT 0,
  budget_max numeric DEFAULT 100000,
  intent_level text NOT NULL DEFAULT 'medium',
  timing_preference text DEFAULT 'soon',
  preferred_makes text[] DEFAULT '{}',
  preferred_body_types text[] DEFAULT '{}',
  preferred_fuel_types text[] DEFAULT '{}',
  is_seed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;

-- Anyone can view seed buyers (demo data)
CREATE POLICY "Anyone can view seed buyers"
  ON public.buyers FOR SELECT
  USING (is_seed = true);

-- Add trigger for updated_at
CREATE TRIGGER update_buyers_updated_at
  BEFORE UPDATE ON public.buyers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
