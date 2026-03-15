import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Car, TrendingDown, Users, ArrowRight, Plus, BarChart3, Shield, Zap, LayoutDashboard, Megaphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AppraisalBreakdown from "@/components/AppraisalBreakdown";
import MarketComparison, { type MarketData } from "@/components/MarketComparison";

interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fair_value_price: number;
  condition_score: number;
  demand_score: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  color: string | null;
  power_hp: number | null;
  equipment: string[] | null;
  condition_exterior: number | null;
  condition_interior: number | null;
  accident_history: boolean | null;
  accident_details: string | null;
  vin: string | null;
  description: string | null;
  detected_damages?: any[] | null;
}

const FairValueResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [placementLoading, setPlacementLoading] = useState(false);

  // Market comparison state (lifted from MarketComparison)
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [marketLoading, setMarketLoading] = useState(true);
  const [marketError, setMarketError] = useState(false);
  const [blendedValue, setBlendedValue] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("cars")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setCar(data as CarData);
        setLoading(false);
      });
  }, [id]);

  // Fetch market comparison and blend with formula value — only if not already blended
  const fetchAndBlend = useCallback(async (carData: CarData) => {
    if ((carData as any).market_blended) {
      setMarketLoading(false);
      return;
    }
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke("market-comparison", {
        body: {
          make: carData.make,
          model: carData.model,
          year: carData.year,
          mileage: carData.mileage,
          condition_score: carData.condition_score,
          price: carData.price,
          fuel_type: carData.fuel_type,
          body_type: carData.body_type,
          transmission: carData.transmission,
        },
      });
      if (fnError) throw fnError;
      if (result?.error) throw new Error(result.error);

      const md = result as MarketData;
      setMarketData(md);

      // Blend: 40% formula-based + 60% market average — market insists on fair value
      // No asking price influence: fair value is 100% attribute-based, market data provides real price signal
      const blended = Math.round(carData.fair_value_price * 0.4 + md.avg_price * 0.6);
      setBlendedValue(blended);

      // Update the car record with the blended fair value
      await supabase.from("cars").update({ fair_value_price: blended, market_blended: true } as any).eq("id", carData.id);
      setCar((prev) => prev ? { ...prev, fair_value_price: blended } : prev);
    } catch (e) {
      console.error("Market comparison error:", e);
      setMarketError(true);
    } finally {
      setMarketLoading(false);
    }
  }, []);

  useEffect(() => {
    if (car && marketLoading && !marketData) {
      fetchAndBlend(car);
    }
  }, [car, marketLoading, marketData, fetchAndBlend]);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-silver/60">Loading...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-silver/60">Car not found</div>
      </div>
    );
  }

  const displayFairValue = blendedValue ?? car.fair_value_price;

  // Use AI market depreciation forecast if available, otherwise fall back to formula
  const aiForecast = marketData?.depreciation_forecast;
  const hasAiForecast = aiForecast && Array.isArray(aiForecast) && aiForecast.length === 13;

  const depreciationData = hasAiForecast
    ? aiForecast.map((value: number, i: number) => ({
        month: i === 0 ? "Now" : `M${i}`,
        value: Math.round(value),
      }))
    : (() => {
        // Enhanced fallback: brand/segment-specific monthly depreciation
        const brandRates: Record<string, number> = {
          Porsche: 0.002, Tesla: 0.004, "Mercedes-Benz": 0.005, BMW: 0.006,
          Audi: 0.006, Volvo: 0.006, "Land Rover": 0.007, Lexus: 0.004,
          Toyota: 0.004, Honda: 0.005, Volkswagen: 0.006, Ford: 0.008,
          Opel: 0.009, Renault: 0.009, Peugeot: 0.009, Fiat: 0.010,
          Citroen: 0.009, Hyundai: 0.007, Kia: 0.007, Skoda: 0.007,
          MINI: 0.006, Mazda: 0.006, Subaru: 0.005, Jaguar: 0.008,
        };
        const bodyRates: Record<string, number> = {
          SUV: 0.95, Sedan: 1.0, Hatchback: 1.05, Wagon: 1.0,
          Coupe: 0.90, Convertible: 0.88, Van: 1.1, Pickup: 0.92,
        };
        const fuelRates: Record<string, number> = {
          Electric: 0.80, Hybrid: 0.88, "Plug-in Hybrid": 0.85,
          Petrol: 1.0, Diesel: 1.15, LPG: 1.2, CNG: 1.1,
        };
        const baseDep = brandRates[car.make] ?? 0.007;
        const bodyMult = bodyRates[car.body_type] ?? 1.0;
        const fuelMult = fuelRates[car.fuel_type] ?? 1.0;
        const carAge = 2026 - car.year;
        const ageMult = carAge > 8 ? 0.4 : carAge > 5 ? 0.6 : carAge > 3 ? 0.8 : 1.0;
        const monthlyDep = baseDep * bodyMult * fuelMult * ageMult;
        return Array.from({ length: 13 }, (_, i) => ({
          month: i === 0 ? "Now" : `M${i}`,
          value: Math.round(displayFairValue * Math.pow(1 - monthlyDep, i)),
        }));
      })();

  // Segment average depreciation (body-type average rate, no brand premium)
  const segmentAvgRates: Record<string, number> = {
    SUV: 0.006, Sedan: 0.007, Hatchback: 0.008, Wagon: 0.007,
    Coupe: 0.006, Convertible: 0.005, Van: 0.009, Pickup: 0.006,
  };
  const segmentRate = segmentAvgRates[car.body_type] ?? 0.007;
  const carAgeForSeg = 2026 - car.year;
  const segAgeMult = carAgeForSeg > 8 ? 0.4 : carAgeForSeg > 5 ? 0.6 : carAgeForSeg > 3 ? 0.8 : 1.0;
  const segMonthlyDep = segmentRate * segAgeMult;
  const startValue = depreciationData[0]?.value ?? displayFairValue;

  const chartData = depreciationData.map((d, i) => ({
    ...d,
    segment: Math.round(startValue * Math.pow(1 - segMonthlyDep, i)),
  }));

  const totalDepPercent = chartData.length >= 2
    ? ((chartData[0].value - chartData[chartData.length - 1].value) / chartData[0].value * 100).toFixed(1)
    : "0";
  const segDepPercent = chartData.length >= 2
    ? ((chartData[0].segment - chartData[chartData.length - 1].segment) / chartData[0].segment * 100).toFixed(1)
    : "0";

  const scoreBadge = (score: number) => {
    if (score >= 85) return { label: "Excellent", color: "text-primary" };
    if (score >= 70) return { label: "Good", color: "text-primary/80" };
    if (score >= 50) return { label: "Fair", color: "text-yellow-400" };
    return { label: "Below Average", color: "text-destructive" };
  };

  const condBadge = scoreBadge(car.condition_score);
  const demandBadge = scoreBadge(car.demand_score);

  return (
    <div className="min-h-screen bg-charcoal text-silver">
      <SEO 
        title={`${car.year} ${car.make} ${car.model} - Fair Value: €${displayFairValue.toLocaleString()}`}
        description={`Fair value appraisal for ${car.year} ${car.make} ${car.model} (${car.mileage.toLocaleString()} km). Condition: ${car.condition_score}/100. Market value: €${displayFairValue.toLocaleString()}.`}
        path={`/fair-value/${id}`}
      />
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <BarChart3 className="h-4 w-4" /> {t.fairValue.title}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white">
            {car.year} {car.make} {car.model}
          </h1>
          <p className="text-silver/60 mt-2">{t.fairValue.subtitle}</p>
        </motion.div>

        {/* Quick Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div
            className="bg-secondary/50 border border-border rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-sm text-silver/60 mb-2">{t.fairValue.conditionScore}</div>
            <div className={`text-4xl font-display font-black ${condBadge.color}`}>
              {car.condition_score}<span className="text-lg text-silver/40">/100</span>
            </div>
            <div className={`text-sm mt-2 ${condBadge.color}`}>{condBadge.label}</div>
          </motion.div>

          <motion.div
            className="bg-secondary/50 border border-border rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-sm text-silver/60 mb-2">{t.fairValue.demandScore}</div>
            <div className={`text-4xl font-display font-black ${demandBadge.color}`}>
              {car.demand_score}<span className="text-lg text-silver/40">/100</span>
            </div>
            <div className={`text-sm mt-2 ${demandBadge.color}`}>{demandBadge.label}</div>
          </motion.div>
        </div>

        {/* Full Appraisal Breakdown — uses displayFairValue */}
        <AppraisalBreakdown car={{ ...car, fair_value_price: displayFairValue }} />

        {/* Market Comparison — with blended value */}
        <MarketComparison
          data={marketData}
          loading={marketLoading}
          error={marketError}
          askingPrice={car.price}
          blendedFairValue={blendedValue}
        />

        <motion.div
          className="bg-secondary/50 border border-border rounded-2xl p-8 mt-10 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-display font-bold text-white mb-1 flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-primary" /> {t.fairValue.depreciationTitle}
              </h3>
              <p className="text-silver/40 text-xs">
                {hasAiForecast
                  ? `AI-powered forecast for ${car.year} ${car.make} ${car.model} (${car.fuel_type}, ${car.body_type})`
                  : `Estimated for ${car.make} ${car.model} (${car.fuel_type}, ${car.body_type}) — formula-based`}
              </p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-2xl font-display font-black text-destructive">-{totalDepPercent}%</span>
                  <p className="text-silver/40 text-[10px]">this car</p>
                </div>
                <div className="border-l border-border pl-3">
                  <span className="text-lg font-display font-bold text-silver/50">-{segDepPercent}%</span>
                  <p className="text-silver/40 text-[10px]">{car.body_type} avg</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mb-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-primary inline-block" /> {car.make} {car.model}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-silver/30 inline-block border border-dashed border-silver/30" /> {car.body_type} segment avg
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
                <XAxis dataKey="month" stroke="hsl(0 0% 85% / 0.4)" fontSize={12} />
                <YAxis stroke="hsl(0 0% 85% / 0.4)" fontSize={12} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "hsl(240 6% 11%)", border: "1px solid hsl(240 4% 20%)", borderRadius: "12px", color: "white" }}
                  formatter={(value: number, name: string) => [
                    `€${value.toLocaleString()}`,
                    name === "value" ? `${car.make} ${car.model}` : `${car.body_type} Avg`,
                  ]}
                />
                <Line type="monotone" dataKey="segment" stroke="hsl(0 0% 60%)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                <Line type="monotone" dataKey="value" stroke="hsl(24, 95%, 53%)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Insight */}
        <motion.div
          className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-10 flex items-start gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white font-display font-bold mb-1">{t.fairValue.insight}</h4>
            <p className="text-silver/60 text-sm">{t.fairValue.insightText}</p>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl"
            disabled={placementLoading}
            onClick={async () => {
              setPlacementLoading(true);
              try {
                const { data, error } = await supabase.functions.invoke("create-placement-checkout", {
                  body: { carId: car.id },
                });
                if (error) throw error;
                if (data?.url) window.location.href = data.url;
                else throw new Error("No checkout URL returned");
              } catch (err: any) {
                toast.error(err.message || "Failed to start checkout");
              } finally {
                setPlacementLoading(false);
              }
            }}
          >
            {placementLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Megaphone className="mr-2 h-5 w-5" />} Ad Placement
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 font-semibold py-6 rounded-xl"
            onClick={() => navigate(`/buyer-matches/${car.id}`)}
          >
            <Users className="mr-2 h-5 w-5" /> {t.fairValue.seebuyers}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-silver/20 text-silver hover:bg-silver/5 font-semibold py-6 rounded-xl"
            onClick={() => navigate("/car-upload")}
          >
            <Plus className="mr-2 h-5 w-5" /> {t.fairValue.uploadAnother}
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-silver/60 font-semibold py-6 rounded-xl"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard className="mr-2 h-5 w-5" /> Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default FairValueResult;
