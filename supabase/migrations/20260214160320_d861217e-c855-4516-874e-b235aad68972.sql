
-- Add market_blended flag to prevent re-blending on refresh
ALTER TABLE public.cars ADD COLUMN market_blended boolean NOT NULL DEFAULT false;

-- Add placement_paid flag for seller payment gate
ALTER TABLE public.cars ADD COLUMN placement_paid boolean NOT NULL DEFAULT false;
