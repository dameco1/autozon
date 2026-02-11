import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Car, TrendingDown, Users, ArrowRight, Plus, BarChart3, Shield, Zap, Gauge, Wrench, Globe, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
}

interface FactorBreakdown {
  label: string;
  desc: string;
  value: number; // 0-100 normalized
  impact: string; // e.g. "+5%" or "-12%"
  positive: boolean;
  icon: React.ReactNode;
}

function computeBreakdown(car: CarData, t: any): FactorBreakdown[] {
  const currentYear = 2026;
  const carAge = currentYear - car.year;
  const premiumBrands = ["Porsche", "Mercedes-Benz", "BMW", "Audi", "Tesla", "Volvo"];
  const isPremium = premiumBrands.includes(car.make);

  // 1. Depreciation
  const depRate = isPremium ? 0.12 : 0.18;
  const depreciationFactor = Math.max(0.25, Math.pow(1 - depRate, Math.sqrt(carAge * 1.8)));
  const depPct = (depreciationFactor - 1) * 100;

  // 2. Mileage
  const avgAnnualKm = 15000;
  const expectedKm = carAge * avgAnnualKm;
  const mileageRatio = car.mileage / Math.max(expectedKm, 1);
  const mileageFactor = mileageRatio <= 1
    ? 1 + (1 - mileageRatio) * 0.08
    : Math.max(0.55, 1 - Math.pow(mileageRatio - 1, 1.4) * 0.25);
  const milePct = (mileageFactor - 1) * 100;

  // 3. Condition
  const condExt = car.condition_exterior ?? 80;
  const condInt = car.condition_interior ?? 80;
  const condAvg = (condExt + condInt) / 2;
  const conditionFactor = 0.6 + (condAvg / 100) * 0.4;
  const accidentPenalty = car.accident_history ? 0.82 : 1;
  const condCombined = conditionFactor * accidentPenalty;
  const condPct = (condCombined - 1) * 100;

  // 4. Equipment
  const safetyFeatures = ["Adaptive Cruise Control", "Lane Assist", "Blind Spot Monitor", "360° Camera", "Parking Sensors", "Backup Camera"];
  const techFeatures = ["Navigation", "Apple CarPlay", "Android Auto", "Heads-Up Display", "LED Headlights"];
  const comfortFeatures = ["Heated Seats", "Leather Interior", "Sunroof", "Cruise Control", "Keyless Entry", "Seat Memory", "Heated Steering Wheel"];
  const equip = car.equipment ?? [];
  let equipWeightedScore = 0;
  equip.forEach((eq) => {
    if (safetyFeatures.includes(eq)) equipWeightedScore += 3;
    else if (techFeatures.includes(eq)) equipWeightedScore += 2;
    else if (comfortFeatures.includes(eq)) equipWeightedScore += 1.5;
    else equipWeightedScore += 1;
  });
  const equipmentIndex = 1 + Math.min(equipWeightedScore * 0.003, 0.15);
  const equipPct = (equipmentIndex - 1) * 100;

  // 5. Market Position
  const highDemandBodies = ["SUV", "Hatchback"];
  const moderateDemandBodies = ["Sedan", "Wagon"];
  const bodyDemand = highDemandBodies.includes(car.body_type) ? 1.06
    : moderateDemandBodies.includes(car.body_type) ? 1.02 : 0.97;
  const highDemandMakes = ["Toyota", "Honda", "Porsche", "Tesla"];
  const makeDemand = highDemandMakes.includes(car.make) ? 1.05
    : premiumBrands.includes(car.make) ? 1.02 : 1.0;
  const marketPositionFactor = bodyDemand * makeDemand;
  const marketPct = (marketPositionFactor - 1) * 100;

  // 6. Regional Demand
  const fuelDemand: Record<string, number> = {
    "Electric": 1.08, "Plug-in Hybrid": 1.05, "Hybrid": 1.04, "Petrol": 1.0, "Diesel": 0.95,
  };
  const regionalDemandMultiplier = fuelDemand[car.fuel_type] ?? 1.0;
  const regionalPct = (regionalDemandMultiplier - 1) * 100;

  // 7. Transparency
  let transparencyPoints = 0;
  if ((car.vin ?? "").length >= 10) transparencyPoints += 3;
  if ((car.description ?? "").length > 50) transparencyPoints += 2;
  if (equip.length >= 5) transparencyPoints += 1;
  if (car.color) transparencyPoints += 1;
  if (car.accident_history && (car.accident_details ?? "").length > 20) transparencyPoints += 2;
  if (!car.accident_history) transparencyPoints += 1;
  const transparencyBonus = 1 + Math.min(transparencyPoints / 10, 1) * 0.05;
  const transPct = (transparencyBonus - 1) * 100;

  const b = t.fairValue.breakdown;

  // Normalize to 0-100 bar: map factor range to visual percentage
  const normalize = (factor: number, min: number, max: number) =>
    Math.round(Math.max(0, Math.min(100, ((factor - min) / (max - min)) * 100)));

  return [
    {
      label: b.depreciation, desc: b.depreciationDesc,
      value: normalize(depreciationFactor, 0.25, 1),
      impact: `${depPct >= 0 ? "+" : ""}${depPct.toFixed(1)}%`,
      positive: depPct >= 0,
      icon: <TrendingDown className="h-4 w-4" />,
    },
    {
      label: b.mileage, desc: b.mileageDesc,
      value: normalize(mileageFactor, 0.55, 1.08),
      impact: `${milePct >= 0 ? "+" : ""}${milePct.toFixed(1)}%`,
      positive: milePct >= 0,
      icon: <Gauge className="h-4 w-4" />,
    },
    {
      label: b.condition, desc: b.conditionDesc,
      value: normalize(condCombined, 0.49, 1),
      impact: `${condPct >= 0 ? "+" : ""}${condPct.toFixed(1)}%`,
      positive: condPct >= -5,
      icon: <Shield className="h-4 w-4" />,
    },
    {
      label: b.equipment, desc: b.equipmentDesc,
      value: normalize(equipmentIndex, 1, 1.15),
      impact: `+${equipPct.toFixed(1)}%`,
      positive: true,
      icon: <Wrench className="h-4 w-4" />,
    },
    {
      label: b.marketPosition, desc: b.marketPositionDesc,
      value: normalize(marketPositionFactor, 0.94, 1.12),
      impact: `${marketPct >= 0 ? "+" : ""}${marketPct.toFixed(1)}%`,
      positive: marketPct >= 0,
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: b.regionalDemand, desc: b.regionalDemandDesc,
      value: normalize(regionalDemandMultiplier, 0.92, 1.1),
      impact: `${regionalPct >= 0 ? "+" : ""}${regionalPct.toFixed(1)}%`,
      positive: regionalPct >= 0,
      icon: <Globe className="h-4 w-4" />,
    },
    {
      label: b.transparency, desc: b.transparencyDesc,
      value: normalize(transparencyBonus, 1, 1.05),
      impact: `+${transPct.toFixed(1)}%`,
      positive: true,
      icon: <Eye className="h-4 w-4" />,
    },
  ];
}

const FairValueResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("cars")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setCar(data as CarData);
        setLoading(false);
      });
  }, [id]);

  const breakdown = useMemo(() => {
    if (!car) return [];
    return computeBreakdown(car, t);
  }, [car, t]);

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

  const depreciationData = Array.from({ length: 13 }, (_, i) => ({
    month: `M${i}`,
    value: Math.round(car.fair_value_price * Math.pow(0.993, i)),
  }));

  const scoreBadge = (score: number) => {
    if (score >= 85) return { label: "Excellent", color: "text-primary" };
    if (score >= 70) return { label: "Good", color: "text-primary/80" };
    if (score >= 50) return { label: "Fair", color: "text-yellow-400" };
    return { label: "Below Average", color: "text-destructive" };
  };

  const condBadge = scoreBadge(car.condition_score);
  const demandBadge = scoreBadge(car.demand_score);
  const priceDiff = car.fair_value_price - car.price;

  return (
    <div className="min-h-screen bg-charcoal text-silver">
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

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            className="bg-secondary/50 border border-primary/30 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-sm text-silver/60 mb-2">{t.fairValue.fairValuePrice}</div>
            <div className="text-4xl font-display font-black text-primary">
              €{car.fair_value_price.toLocaleString()}
            </div>
            {priceDiff !== 0 && (
              <div className={`text-sm mt-2 ${priceDiff > 0 ? "text-primary" : "text-destructive"}`}>
                {priceDiff > 0 ? "+" : ""}€{priceDiff.toLocaleString()} vs. asking price
              </div>
            )}
          </motion.div>

          <motion.div
            className="bg-secondary/50 border border-border rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
            transition={{ delay: 0.3 }}
          >
            <div className="text-sm text-silver/60 mb-2">{t.fairValue.demandScore}</div>
            <div className={`text-4xl font-display font-black ${demandBadge.color}`}>
              {car.demand_score}<span className="text-lg text-silver/40">/100</span>
            </div>
            <div className={`text-sm mt-2 ${demandBadge.color}`}>{demandBadge.label}</div>
          </motion.div>
        </div>

        {/* Factor Breakdown */}
        <motion.div
          className="bg-secondary/50 border border-border rounded-2xl p-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="text-lg font-display font-bold text-white mb-1 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> {t.fairValue.breakdown.title}
          </h3>
          <p className="text-silver/40 text-sm mb-6">{t.fairValue.breakdown.subtitle}</p>

          <div className="space-y-5">
            {breakdown.map((factor, i) => (
              <motion.div
                key={factor.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">{factor.icon}</span>
                    <span className="text-white text-sm font-medium">{factor.label}</span>
                    <span className="text-silver/40 text-xs hidden sm:inline">— {factor.desc}</span>
                  </div>
                  <span className={`text-sm font-bold ${factor.positive ? "text-primary" : "text-destructive"}`}>
                    {factor.impact}
                  </span>
                </div>
                <Progress value={factor.value} className="h-2.5 bg-charcoal" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Depreciation Chart */}
        <motion.div
          className="bg-secondary/50 border border-border rounded-2xl p-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" /> {t.fairValue.depreciationTitle}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={depreciationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
                <XAxis dataKey="month" stroke="hsl(0 0% 85% / 0.4)" fontSize={12} />
                <YAxis stroke="hsl(0 0% 85% / 0.4)" fontSize={12} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "hsl(240 6% 11%)", border: "1px solid hsl(240 4% 20%)", borderRadius: "12px", color: "white" }}
                  formatter={(value: number) => [`€${value.toLocaleString()}`, "Value"]}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(155, 100%, 42%)" strokeWidth={3} dot={false} />
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
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-6 rounded-xl"
            onClick={() => navigate(`/buyer-matches/${car.id}`)}
          >
            <Users className="mr-2 h-5 w-5" /> {t.fairValue.seebuyers}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-silver/20 text-silver hover:bg-silver/5 font-semibold px-8 py-6 rounded-xl"
            onClick={() => navigate("/recommendations")}
          >
            <Zap className="mr-2 h-5 w-5" /> {t.fairValue.findNext}
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-silver/60 font-semibold px-8 py-6 rounded-xl"
            onClick={() => navigate("/car-upload")}
          >
            <Plus className="mr-2 h-5 w-5" /> {t.fairValue.uploadAnother}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default FairValueResult;
