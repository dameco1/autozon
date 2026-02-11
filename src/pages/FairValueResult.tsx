import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Car, TrendingDown, Users, ArrowRight, Plus, BarChart3, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AppraisalBreakdown from "@/components/AppraisalBreakdown";
import MarketComparison from "@/components/MarketComparison";

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

        {/* Full Appraisal Breakdown */}
        <AppraisalBreakdown car={car} />

        {/* Market Comparison */}
        <MarketComparison car={{
          make: car.make,
          model: car.model,
          year: car.year,
          mileage: car.mileage,
          condition_score: car.condition_score,
          price: car.price,
          fuel_type: car.fuel_type,
          body_type: car.body_type,
          transmission: car.transmission,
        }} />
        <motion.div
          className="bg-secondary/50 border border-border rounded-2xl p-8 mt-10 mb-10"
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
