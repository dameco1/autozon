import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Heart, X, ArrowRight, RefreshCw, Fuel, Gauge, Calendar, ShieldCheck, LayoutDashboard, Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import carPlaceholder from "@/assets/car-placeholder.jpg";
import { computeMatchScore, type ProfileSignals, type PreferenceSignals } from "@/lib/lifestyleMatch";

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
  photos: string[] | null;
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
        // Load existing shortlists so hearts are pre-filled
        supabase.from("car_shortlists").select("car_id").eq("user_id", session.user.id).then(({ data }) => {
          if (data) setLiked(new Set(data.map(d => d.car_id)));
        });
      }
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

    // Fetch profile & preferences in parallel for lifestyle scoring
    let prefs: PreferenceSignals | null = null;
    let profile: ProfileSignals | null = null;

    if (uid) {
      const [prefsRes, profileRes] = await Promise.all([
        supabase.from("user_preferences").select("*").eq("user_id", uid).maybeSingle(),
        supabase.from("profiles").select("relationship_status, has_kids, num_kids, car_purpose, current_car, budget_max").eq("user_id", uid).maybeSingle(),
      ]);
      prefs = prefsRes.data as PreferenceSignals | null;
      profile = profileRes.data as ProfileSignals | null;
    }

    let query = supabase
      .from("cars")
      .select("id, make, model, year, mileage, price, fair_value_price, fuel_type, transmission, body_type, color, power_hp, equipment, condition_score, demand_score, image_url, photos, detected_damages")
      .eq("status", "available")
      .limit(30); // Fetch more so we can score & rank

    if (hasUrlFilters) {
      // Apply URL-based filters from homepage search
      if (urlMake) query = query.eq("make", urlMake);
      if (urlModel) query = query.eq("model", urlModel);
      if (urlMaxPrice) query = query.lte("price", Number(urlMaxPrice));
      if (urlYearFrom) query = query.gte("year", Number(urlYearFrom));
      if (urlFuelType) query = query.eq("fuel_type", urlFuelType);
      if (urlMaxMileage) query = query.lte("mileage", Number(urlMaxMileage));
    } else if (prefs) {
      // Apply broad budget filters to narrow the pool
      if (prefs.min_budget) query = query.gte("price", prefs.min_budget);
      if (prefs.max_budget) query = query.lte("price", prefs.max_budget);
      if (prefs.min_year) query = query.gte("year", prefs.min_year);
      if (prefs.max_year) query = query.lte("year", prefs.max_year);
      if (prefs.max_mileage) query = query.lte("mileage", prefs.max_mileage);
    }

    const { data, error } = await query;
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (!data) {
      setCars([]);
      return;
    }

    // Score and rank by lifestyle match, then take top 10
    if (uid && (profile || prefs)) {
      const scored = data
        .map((car) => ({
          ...car,
          _matchScore: computeMatchScore(car as any, profile, prefs),
        }))
        .sort((a, b) => b._matchScore - a._matchScore)
        .slice(0, 10)
        .map(({ _matchScore, ...car }) => car);
      setCars(scored as CarRow[]);
    } else {
      setCars((data as CarRow[]).slice(0, 10));
    }
  };

  const toggleLike = async (carId: string) => {
    if (!userId) {
      toast.error("Please log in to save favorites");
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    const isLiked = liked.has(carId);
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(carId)) next.delete(carId);
      else next.add(carId);
      return next;
    });

    // Persist to car_shortlists
    if (isLiked) {
      await supabase.from("car_shortlists").delete().eq("user_id", userId).eq("car_id", carId);
    } else {
      await supabase.from("car_shortlists").insert({ user_id: userId, car_id: carId });
    }
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
    const keptCars = cars.filter((c) => liked.has(c.id));

    const keptIds = keptCars.map((c) => c.id);

    setLoading(true);

    let prefs: PreferenceSignals | null = null;
    let profile: ProfileSignals | null = null;

    if (userId) {
      const [prefsRes, profileRes] = await Promise.all([
        supabase.from("user_preferences").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("profiles").select("relationship_status, has_kids, num_kids, car_purpose, current_car, budget_max").eq("user_id", userId).maybeSingle(),
      ]);
      prefs = prefsRes.data as PreferenceSignals | null;
      profile = profileRes.data as ProfileSignals | null;
    }

    let query = supabase
      .from("cars")
      .select("id, make, model, year, mileage, price, fair_value_price, fuel_type, transmission, body_type, color, power_hp, equipment, condition_score, demand_score, image_url, photos, detected_damages")
      .eq("status", "available")
      .limit(30);

    if (keptIds.length > 0) {
      query = query.not("id", "in", `(${keptIds.join(",")})`);
    }

    if (prefs) {
      if (prefs.min_budget) query = query.gte("price", prefs.min_budget);
      if (prefs.max_budget) query = query.lte("price", prefs.max_budget);
      if (prefs.min_year) query = query.gte("year", prefs.min_year);
      if (prefs.max_year) query = query.lte("year", prefs.max_year);
      if (prefs.max_mileage) query = query.lte("mileage", prefs.max_mileage);
    }

    const { data } = await query;
    setLoading(false);

    if (data && data.length > 0) {
      // Score and rank new results
      const scored = data
        .map((car) => ({
          ...car,
          _matchScore: computeMatchScore(car as any, profile, prefs),
        }))
        .sort((a, b) => b._matchScore - a._matchScore)
        .slice(0, 10)
        .map(({ _matchScore, ...car }) => car);

      setCars([...keptCars, ...(scored as CarRow[])]);
      setLiked(new Set());
      setRound((r) => r + 1);
      const removed = cars.length - keptCars.length;
      toast.success(`${removed > 0 ? `${removed} ${t.carSelection.removed}. ` : ""}${scored.length} ${t.carSelection.moreAdded}`);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">{t.carSelection.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">{t.carSelection.title}</h1>
          <p className="text-muted-foreground">
            {t.carSelection.round} {round} — {cars.length} {t.carSelection.carsShown}
            {liked.size > 0 && ` · ${liked.size} ${t.carSelection.selected}`}
          </p>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{t.carSelection.noCars}</p>
            <Button className="mt-4" variant="outline" onClick={() => navigate("/")}>
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
                      className={`bg-secondary/50 border-2 transition-all ${
                        liked.has(car.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <CardContent className="p-0 cursor-pointer" onClick={() => navigate(`/car/${car.id}`)}>
                        {/* Car Image */}
                        <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
                          <img
                            src={
                              (car.photos && car.photos.length > 0 && car.photos[0])
                                ? car.photos[0]
                                : carPlaceholder
                            }
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).src = carPlaceholder; }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(car.id);
                            }}
                            className={`absolute top-2 right-2 p-2 rounded-full transition-colors backdrop-blur-sm ${
                              liked.has(car.id) ? "bg-primary/80 text-foreground" : "bg-muted/80 text-muted-foreground"
                            }`}
                          >
                            {liked.has(car.id) ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />}
                          </button>
                        </div>

                        <div className="p-5">
                          <div className="mb-3">
                            <h3 className="text-foreground font-display font-bold text-lg">
                              {car.make} {car.model}
                            </h3>
                            <p className="text-muted-foreground text-sm">{car.year} · {car.body_type}</p>
                            {Array.isArray(car.detected_damages) && (
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-medium">
                                <ShieldCheck className="h-3 w-3" /> {t.carSelection.aiVerified}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-muted-foreground">
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
                            <p className="text-muted-foreground text-xs mb-3">{car.power_hp} HP · {car.transmission}{car.color ? ` · ${car.color}` : ""}</p>
                          )}

                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-primary font-bold text-xl">€{car.price.toLocaleString()}</p>
                              {car.fair_value_price && car.fair_value_price !== car.price && (
                                <p className="text-muted-foreground text-xs">{t.carSelection.fairValue}: €{car.fair_value_price.toLocaleString()}</p>
                              )}
                            </div>
                            {car.condition_score && (
                              <Badge variant="secondary" className="text-xs">
                                {t.carSelection.condition}: {car.condition_score}/100
                              </Badge>
                            )}
                          </div>

                          {/* View Details + Like buttons */}
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={(e) => { e.stopPropagation(); navigate(`/car/${car.id}`); }}
                            >
                              <Eye className="h-3 w-3 mr-1" /> View Details
                            </Button>
                            <Button
                              variant={liked.has(car.id) ? "default" : "outline"}
                              size="sm"
                              className="text-xs"
                              onClick={(e) => { e.stopPropagation(); toggleLike(car.id); }}
                            >
                              <Heart className={`h-3 w-3 ${liked.has(car.id) ? "fill-current" : ""}`} />
                            </Button>
                          </div>
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
                className="border-border text-muted-foreground hover:text-foreground"
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
