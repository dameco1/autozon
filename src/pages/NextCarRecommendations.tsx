import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Zap, Gauge, Fuel, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarRec {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  price: number;
  fair_value_price: number;
  condition_score: number;
  demand_score: number;
  power_hp: number | null;
  color: string | null;
  description: string | null;
  matchScore: number;
}

const NextCarRecommendations: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarRec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      // Get user preferences if available
      let prefs: any = null;
      if (userId) {
        const { data } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        prefs = data;
      }

      // Get seed cars
      const { data: carsData } = await supabase
        .from("cars")
        .select("id, make, model, year, mileage, fuel_type, transmission, body_type, price, fair_value_price, condition_score, demand_score, power_hp, color, description")
        .eq("is_seed", true)
        .eq("status", "available");

      if (carsData) {
        // Calculate match scores
        const scored = (carsData as any[]).map((car) => {
          let lifestyleScore = 50;
          let financialScore = 50;
          let conditionScore = ((car.condition_score || 50) + (car.demand_score || 50)) / 2;

          if (prefs) {
            // Financial fit
            if (car.price >= (prefs.min_budget || 0) && car.price <= (prefs.max_budget || 999999)) {
              financialScore = 95;
            } else {
              const diff = Math.min(Math.abs(car.price - (prefs.min_budget || 0)), Math.abs(car.price - (prefs.max_budget || 999999)));
              financialScore = Math.max(20, 95 - diff / 500);
            }

            // Lifestyle fit based on family size and usage
            if (prefs.family_size >= 4 && ["SUV", "Wagon", "Van"].includes(car.body_type)) lifestyleScore = 90;
            else if (prefs.family_size <= 2 && ["Sedan", "Coupe", "Hatchback"].includes(car.body_type)) lifestyleScore = 85;
            else lifestyleScore = 60;

            if (prefs.usage_pattern === "daily" && car.fuel_type === "Diesel") lifestyleScore += 5;
            if (prefs.commute_distance === "long" && car.fuel_type === "Diesel") lifestyleScore += 5;
            if (prefs.commute_distance === "short" && car.fuel_type === "Electric") lifestyleScore += 10;
          }

          const matchScore = Math.min(100, Math.round(0.4 * lifestyleScore + 0.4 * financialScore + 0.2 * conditionScore));
          return { ...car, matchScore } as CarRec;
        }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 7);

        setCars(scored);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const scoreBadgeColor = (score: number) => {
    if (score >= 85) return "bg-primary/10 border-primary text-primary";
    if (score >= 70) return "bg-primary/5 border-primary/50 text-primary/80";
    return "bg-muted border-border text-muted-foreground";
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><span className="text-muted-foreground">Loading...</span></div>;
  }

  return (
    <div className="min-h-screen bg-background text-muted-foreground">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Zap className="h-4 w-4" /> {t.nextCar.title}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground">{t.nextCar.title}</h1>
          <p className="text-muted-foreground mt-2">{t.nextCar.subtitle}</p>
        </motion.div>

        {cars.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">{t.nextCar.noResults}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, i) => (
              <motion.div
                key={car.id}
                className="bg-secondary/50 border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/car/${car.id}`)}
              >
                {/* Color banner */}
                <div className="h-32 bg-gradient-to-br from-secondary to-charcoal flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl font-display font-black text-foreground/10">{car.make}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg">{car.make} {car.model}</h3>
                      <p className="text-muted-foreground text-sm">{car.year} · {car.body_type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${scoreBadgeColor(car.matchScore)}`}>
                      {car.matchScore}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1"><Gauge className="h-3 w-3" />{car.mileage.toLocaleString()} km</div>
                    <div className="flex items-center gap-1"><Fuel className="h-3 w-3" />{car.fuel_type}</div>
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{car.year}</div>
                    <div className="flex items-center gap-1"><Zap className="h-3 w-3" />{car.power_hp} HP</div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">{t.nextCar.fairValue}</div>
                      <div className="text-xl font-display font-black text-primary">€{(car.fair_value_price || car.price).toLocaleString()}</div>
                    </div>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                      {t.nextCar.viewDetails} <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NextCarRecommendations;
