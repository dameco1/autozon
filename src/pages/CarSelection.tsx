import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Heart, X, ArrowRight, RefreshCw, Fuel, Gauge, Calendar, ShieldCheck, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type CarRow = {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fair_value_price: number | null;
  fuel_type: string;
  transmission: string;
  body_type: string;
  color: string | null;
  power_hp: number | null;
  equipment: string[] | null;
  condition_score: number | null;
  demand_score: number | null;
  image_url: string | null;
  detected_damages: unknown;
};

const CarSelection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [cars, setCars] = useState<CarRow[]>([]);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [narrowedDown, setNarrowedDown] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
      }
      // Load cars regardless of auth status
      loadMatchingCars(session?.user?.id ?? null);
    });
  }, [navigate]);

  const loadMatchingCars = async (uid: string | null) => {
    setLoading(true);

    // Check for URL search params first (from homepage search)
    const urlMake = searchParams.get("make");
    const urlModel = searchParams.get("model");
    const urlMaxPrice = searchParams.get("maxPrice");
    const urlYearFrom = searchParams.get("yearFrom");
    const urlFuelType = searchParams.get("fuelType");
    const urlMaxMileage = searchParams.get("maxMileage");

    const hasUrlFilters = urlMake || urlModel || urlMaxPrice || urlYearFrom || urlFuelType || urlMaxMileage;

    let query = supabase
      .from("cars")
      .select("id, make, model, year, mileage, price, fair_value_price, fuel_type, transmission, body_type, color, power_hp, equipment, condition_score, demand_score, image_url, detected_damages")
      .eq("status", "available")
      .limit(10);

    if (hasUrlFilters) {
      // Apply URL-based filters from homepage search
      if (urlMake) query = query.eq("make", urlMake);
      if (urlModel) query = query.eq("model", urlModel);
      if (urlMaxPrice) query = query.lte("price", Number(urlMaxPrice));
      if (urlYearFrom) query = query.gte("year", Number(urlYearFrom));
      if (urlFuelType) query = query.eq("fuel_type", urlFuelType);
      if (urlMaxMileage) query = query.lte("mileage", Number(urlMaxMileage));
    } else if (uid) {
      // Fall back to user preferences if logged in and no URL filters
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", uid)
        .maybeSingle();

      if (prefs) {
        if (prefs.min_budget) query = query.gte("price", prefs.min_budget);
        if (prefs.max_budget) query = query.lte("price", prefs.max_budget);
        if (prefs.min_year) query = query.gte("year", prefs.min_year);
        if (prefs.max_year) query = query.lte("year", prefs.max_year);
        if (prefs.max_mileage) query = query.lte("mileage", prefs.max_mileage);
        if (prefs.preferred_makes && prefs.preferred_makes.length > 0) {
          query = query.in("make", prefs.preferred_makes);
        }
        if (prefs.preferred_fuel_types && prefs.preferred_fuel_types.length > 0) {
          query = query.in("fuel_type", prefs.preferred_fuel_types);
        }
        if (prefs.preferred_body_types && prefs.preferred_body_types.length > 0) {
          query = query.in("body_type", prefs.preferred_body_types);
        }
        if (prefs.preferred_transmission) {
          query = query.eq("transmission", prefs.preferred_transmission);
        }
      }
    }

    const { data, error } = await query;
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setCars(data || []);
  };

  const toggleLike = (carId: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(carId)) next.delete(carId);
      else next.add(carId);
      return next;
    });
  };

  const handleNarrowDown = () => {
    if (liked.size === 0) {
      toast.error(t.carSelection.selectAtLeastOne);
      return;
    }

    const likedCars = cars.filter((c) => liked.has(c.id));

    if (likedCars.length <= 2) {
      // Navigate to comparison
      const ids = likedCars.map((c) => c.id).join(",");
      navigate(`/compare?cars=${ids}`);
      return;
    }

    setCars(likedCars);
    setLiked(new Set());
    setRound((r) => r + 1);
    setNarrowedDown(true);
  };

  const handleShowMore = async () => {
    if (!userId) return;

    // Remove unselected cars first, keep only liked ones
    const keptCars = cars.filter((c) => liked.has(c.id));
    const keptIds = keptCars.map((c) => c.id);

    setLoading(true);

    const { data: prefs } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    let query = supabase
      .from("cars")
      .select("id, make, model, year, mileage, price, fair_value_price, fuel_type, transmission, body_type, color, power_hp, equipment, condition_score, demand_score, image_url, detected_damages")
      .eq("status", "available")
      .limit(10);

    if (keptIds.length > 0) {
      query = query.not("id", "in", `(${keptIds.join(",")})`);
    }

    if (prefs) {
      if (prefs.min_budget) query = query.gte("price", prefs.min_budget);
      if (prefs.max_budget) query = query.lte("price", prefs.max_budget);
      if (prefs.min_year) query = query.gte("year", prefs.min_year);
      if (prefs.max_year) query = query.lte("year", prefs.max_year);
      if (prefs.max_mileage) query = query.lte("mileage", prefs.max_mileage);
      if (prefs.preferred_makes && prefs.preferred_makes.length > 0) {
        query = query.in("make", prefs.preferred_makes);
      }
      if (prefs.preferred_fuel_types && prefs.preferred_fuel_types.length > 0) {
        query = query.in("fuel_type", prefs.preferred_fuel_types);
      }
      if (prefs.preferred_body_types && prefs.preferred_body_types.length > 0) {
        query = query.in("body_type", prefs.preferred_body_types);
      }
      if (prefs.preferred_transmission) {
        query = query.eq("transmission", prefs.preferred_transmission);
      }
    }

    const { data } = await query;
    setLoading(false);

    if (data && data.length > 0) {
      setCars([...keptCars, ...data]);
      setLiked(new Set());
      setRound((r) => r + 1);
      const removed = cars.length - keptCars.length;
      toast.success(`${removed > 0 ? `${removed} ${t.carSelection.removed}. ` : ""}${data.length} ${t.carSelection.moreAdded}`);
    } else if (keptCars.length > 0) {
      setCars(keptCars);
      setLiked(new Set());
      setRound((r) => r + 1);
      toast.info(t.carSelection.noMore);
    } else {
      toast.info(t.carSelection.noMore);
    }
  };

  if (loading && cars.length === 0) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-silver/60">{t.carSelection.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" className="text-silver/50 hover:text-white" onClick={() => navigate("/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-white mb-2">{t.carSelection.title}</h1>
          <p className="text-silver/60">
            {t.carSelection.round} {round} — {cars.length} {t.carSelection.carsShown}
            {liked.size > 0 && ` · ${liked.size} ${t.carSelection.selected}`}
          </p>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-silver/60 text-lg">{t.carSelection.noCars}</p>
            <Button className="mt-4" onClick={() => navigate("/buyer-questionnaire")}>
              {t.carSelection.adjustCriteria}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <AnimatePresence>
                {cars.map((car) => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={`bg-secondary/50 border-2 transition-all cursor-pointer ${
                        liked.has(car.id) ? "border-primary bg-primary/5" : "border-border hover:border-silver/30"
                      }`}
                      onClick={() => toggleLike(car.id)}
                    >
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-white font-display font-bold text-lg">
                              {car.make} {car.model}
                            </h3>
                            <p className="text-silver/40 text-sm">{car.year} · {car.body_type}</p>
                            {Array.isArray(car.detected_damages) && (
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-medium">
                                <ShieldCheck className="h-3 w-3" /> {t.carSelection.aiVerified}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(car.id);
                            }}
                            className={`p-2 rounded-full transition-colors ${
                              liked.has(car.id) ? "bg-primary/20 text-primary" : "bg-charcoal/50 text-silver/40"
                            }`}
                          >
                            {liked.has(car.id) ? <Heart className="h-5 w-5 fill-current" /> : <Heart className="h-5 w-5" />}
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-silver/60">
                          <div className="flex items-center gap-1">
                            <Gauge className="h-3 w-3" /> {car.mileage.toLocaleString()} km
                          </div>
                          <div className="flex items-center gap-1">
                            <Fuel className="h-3 w-3" /> {car.fuel_type}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {car.year}
                          </div>
                        </div>

                        {car.power_hp && (
                          <p className="text-silver/40 text-xs mb-3">{car.power_hp} HP · {car.transmission}{car.color ? ` · ${car.color}` : ""}</p>
                        )}

                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-primary font-bold text-xl">€{car.price.toLocaleString()}</p>
                            {car.fair_value_price && car.fair_value_price !== car.price && (
                              <p className="text-silver/40 text-xs">{t.carSelection.fairValue}: €{car.fair_value_price.toLocaleString()}</p>
                            )}
                          </div>
                          {car.condition_score && (
                            <Badge variant="secondary" className="text-xs">
                              {t.carSelection.condition}: {car.condition_score}/100
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-border text-silver/60 hover:text-white"
                onClick={handleShowMore}
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> {t.carSelection.showMore}
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                onClick={handleNarrowDown}
                disabled={liked.size === 0}
              >
                {liked.size <= 2 && liked.size > 0
                  ? t.carSelection.compare
                  : t.carSelection.narrowDown
                }{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CarSelection;
