CREATE OR REPLACE FUNCTION public.prevent_car_system_field_tampering()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Allow service_role (edge functions, admin) to modify any field
  IF current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Allow admins to modify system fields
  IF has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- For regular users, silently revert system-controlled fields
  NEW.placement_paid := OLD.placement_paid;
  NEW.demand_score := OLD.demand_score;
  NEW.condition_score := OLD.condition_score;
  NEW.fair_value_price := OLD.fair_value_price;
  NEW.is_seed := OLD.is_seed;
  NEW.market_blended := OLD.market_blended;
  NEW.detected_damages := OLD.detected_damages;
  NEW.status := OLD.status;

  RETURN NEW;
END;
$function$;