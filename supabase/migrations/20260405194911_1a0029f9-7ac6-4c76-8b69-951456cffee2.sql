
CREATE OR REPLACE FUNCTION public.lock_fair_value(
  _car_id uuid,
  _fair_value_price numeric,
  _market_blended boolean DEFAULT true
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only the car owner may lock the fair value
  IF NOT EXISTS (
    SELECT 1 FROM cars WHERE id = _car_id AND owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE cars
  SET fair_value_price = _fair_value_price,
      market_blended = _market_blended
  WHERE id = _car_id;
END;
$$;
