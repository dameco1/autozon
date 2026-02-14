import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Users, MapPin, Target, Clock, Star, Building2, User, Lock, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Buyer {
  id: string;
  name: string;
  type: string;
  location: string;
  budget_min: number;
  budget_max: number;
  intent_level: string;
  timing_preference: string;
}

interface CarInfo {
  make: string;
  model: string;
  year: number;
  price: number;
  body_type: string;
  fuel_type: string;
  placement_paid: boolean;
}

const BuyerMatches: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [buyers, setBuyers] = useState<(Buyer & { matchScore: number })[]>([]);
  const [car, setCar] = useState<CarInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Verify payment on return from Stripe
  useEffect(() => {
    const verifyPayment = async () => {
      if (searchParams.get("placement") === "success" && carId) {
        const { data } = await supabase.functions.invoke("verify-placement", {
          body: { carId },
        });
        if (data?.paid) {
          setIsPaid(true);
          toast.success("Placement activated!");
        }
      }
    };
    verifyPayment();
  }, [searchParams, carId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!carId) return;

      const [carRes, buyersRes] = await Promise.all([
        supabase.from("cars").select("make, model, year, price, body_type, fuel_type, placement_paid").eq("id", carId).single(),
        supabase.from("buyers").select("*").eq("is_seed", true),
      ]);

      if (carRes.data) {
        const carData = carRes.data as CarInfo;
        setCar(carData);
        setIsPaid(carData.placement_paid ?? false);

        const scored = ((buyersRes.data || []) as Buyer[]).map((buyer) => {
          const carPrice = carRes.data.price as number;
          const budgetFit = (carPrice >= buyer.budget_min && carPrice <= buyer.budget_max) ? 100 : Math.max(0, 100 - Math.abs(carPrice - buyer.budget_max) / 500);
          const intentScore = buyer.intent_level === "high" ? 100 : buyer.intent_level === "medium" ? 60 : 30;
          const timingScore = buyer.timing_preference === "immediate" ? 100 : buyer.timing_preference === "soon" ? 70 : 30;
          const matchScore = Math.round(0.4 * budgetFit + 0.3 * 70 + 0.2 * timingScore + 0.1 * intentScore);
          return { ...buyer, matchScore };
        }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 8);

        setBuyers(scored);
      }
      setLoading(false);
    };
    fetchData();
  }, [carId]);

  const handlePayPlacement = async () => {
    setPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-placement-checkout", {
        body: { carId },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const blurName = (name: string) => {
    if (isPaid) return name;
    // Show first letter + blur rest
    return name.charAt(0) + "••••••";
  };

  const scoreBadge = (score: number) => {
    if (score >= 85) return { label: t.buyerMatches.perfect, bg: "bg-primary/10 border-primary text-primary" };
    if (score >= 70) return { label: t.buyerMatches.strong, bg: "bg-primary/5 border-primary/50 text-primary/80" };
    return { label: t.buyerMatches.acceptable, bg: "bg-muted border-border text-silver/60" };
  };

  if (loading) {
    return <div className="min-h-screen bg-charcoal flex items-center justify-center"><span className="text-silver/60">Loading...</span></div>;
  }

  return (
    <div className="min-h-screen bg-charcoal text-silver">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Users className="h-4 w-4" /> {t.buyerMatches.title}
          </span>
          {car && (
            <h1 className="text-4xl sm:text-5xl font-display font-black text-white">
              {car.year} {car.make} {car.model}
            </h1>
          )}
          <p className="text-silver/60 mt-2">{t.buyerMatches.subtitle}</p>
        </motion.div>

        {/* Payment Gate Banner */}
        {!isPaid && buyers.length > 0 && (
          <motion.div
            className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 flex-1">
              <Lock className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-white font-display font-bold">{t.buyerMatches.paywall.title}</h3>
                <p className="text-silver/60 text-sm">{t.buyerMatches.paywall.subtitle}</p>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 rounded-xl whitespace-nowrap"
              onClick={handlePayPlacement}
              disabled={paymentLoading}
            >
              {paymentLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
              {paymentLoading ? "Redirecting..." : t.buyerMatches.paywall.cta}
            </Button>
          </motion.div>
        )}

        {buyers.length === 0 ? (
          <div className="text-center py-20 text-silver/40">{t.buyerMatches.noBuyers}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buyers.map((buyer, i) => {
              const badge = scoreBadge(buyer.matchScore);
              return (
                <motion.div
                  key={buyer.id}
                  className="bg-secondary/50 border border-border rounded-2xl p-6 hover:border-primary/30 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        {buyer.type === "dealer" ? <Building2 className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-silver/60" />}
                      </div>
                      <div>
                        <h3 className={`font-display font-bold text-white ${!isPaid ? "select-none" : ""}`}>
                          {blurName(buyer.name)}
                        </h3>
                        <span className="text-xs text-silver/40">
                          {buyer.type === "dealer" ? t.buyerMatches.types.dealer : t.buyerMatches.types.private}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-xs font-medium ${badge.bg}`}>
                      {buyer.matchScore}% — {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                    <div className="flex items-center gap-2 text-silver/60">
                      <MapPin className="h-4 w-4" /> {buyer.location}
                    </div>
                    <div className="flex items-center gap-2 text-silver/60">
                      <Target className="h-4 w-4" />
                      {t.buyerMatches.intent}: {t.buyerMatches.intentLevels[buyer.intent_level as keyof typeof t.buyerMatches.intentLevels]}
                    </div>
                    <div className="flex items-center gap-2 text-silver/60">
                      <Star className="h-4 w-4" />
                      €{buyer.budget_min.toLocaleString()} – €{buyer.budget_max.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-silver/60">
                      <Clock className="h-4 w-4" /> {buyer.timing_preference}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isPaid ? (
                      <>
                        <Button size="sm" variant="outline" className="flex-1 border-border text-silver/60 hover:border-primary hover:text-primary">
                          {t.buyerMatches.shortlist}
                        </Button>
                        <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                          {t.buyerMatches.accept}
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-border text-silver/40 cursor-not-allowed"
                        disabled
                      >
                        <Lock className="mr-2 h-3 w-3" /> {t.buyerMatches.paywall.badge}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerMatches;
