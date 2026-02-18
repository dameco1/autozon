import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Car, ShoppingCart, Bookmark, Handshake, ArrowRight, FileCheck,
  CreditCard, Shield, CheckCircle2, Clock, Search, BarChart3,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

type BuyerOffer = {
  id: string;
  car_id: string;
  amount: number;
  status: string;
  current_round: number;
  agreed_price: number | null;
  created_at: string;
};

type ShortlistedCar = {
  id: string;
  car_id: string;
  created_at: string;
  car?: { make: string; model: string; year: number; price: number; image_url: string | null; fair_value_price: number | null };
};

type BuyerTransaction = {
  id: string;
  car_id: string;
  offer_id: string;
  agreed_price: number;
  status: string;
  current_step: number;
  payment_confirmed: boolean;
  contract_signed_buyer: boolean;
  insurance_confirmed: boolean;
  created_at: string;
};

interface Props {
  userId: string;
}

const DashboardBuyerTab: React.FC<Props> = ({ userId }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const dt = (t.dashboard as any);

  const [buyerOffers, setBuyerOffers] = useState<BuyerOffer[]>([]);
  const [shortlists, setShortlists] = useState<ShortlistedCar[]>([]);
  const [buyerTxs, setBuyerTxs] = useState<BuyerTransaction[]>([]);
  const [carCache, setCarCache] = useState<Record<string, { make: string; model: string; year: number; price: number; image_url: string | null; fair_value_price: number | null }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [offersRes, shortlistsRes, txRes] = await Promise.all([
        supabase.from("offers").select("id, car_id, amount, status, current_round, agreed_price, created_at").eq("buyer_id", userId).order("created_at", { ascending: false }),
        supabase.from("car_shortlists").select("id, car_id, created_at").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("transactions").select("id, car_id, offer_id, agreed_price, status, current_step, payment_confirmed, contract_signed_buyer, insurance_confirmed, created_at").eq("buyer_id", userId).order("created_at", { ascending: false }),
      ]);

      const offers = offersRes.data || [];
      const sls = shortlistsRes.data || [];
      const txs = txRes.data || [];

      setBuyerOffers(offers);
      setShortlists(sls);
      setBuyerTxs(txs);

      // Fetch car details for all referenced cars
      const allCarIds = [...new Set([...offers.map(o => o.car_id), ...sls.map(s => s.car_id), ...txs.map(tx => tx.car_id)])];
      if (allCarIds.length > 0) {
        const { data: carsData } = await supabase.from("cars").select("id, make, model, year, price, image_url, fair_value_price").in("id", allCarIds);
        const cache: Record<string, any> = {};
        (carsData || []).forEach(c => { cache[c.id] = c; });
        setCarCache(cache);
      }

      setLoading(false);
    };
    load();
  }, [userId]);

  const carLabel = (carId: string) => {
    const c = carCache[carId];
    return c ? `${c.year} ${c.make} ${c.model}` : "Car";
  };

  const carPrice = (carId: string) => {
    const c = carCache[carId];
    return c ? (c.fair_value_price || c.price) : 0;
  };

  const offerStatusBadge = (status: string) => {
    switch (status) {
      case "accepted": return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Accepted</Badge>;
      case "rejected": return <Badge variant="destructive" className="text-[10px]">Rejected</Badge>;
      case "countered": return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">Countered</Badge>;
      case "pending": return <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">Pending</Badge>;
      default: return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
    }
  };

  const stepLabels = [
    { icon: CreditCard, label: dt.buyerStepMethod || "Method" },
    { icon: FileCheck, label: dt.buyerStepContract || "Contract" },
    { icon: CreditCard, label: dt.buyerStepPayment || "Payment" },
    { icon: Shield, label: dt.buyerStepInsurance || "Insurance" },
    { icon: CheckCircle2, label: dt.buyerStepComplete || "Complete" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeBuyerOffers = buyerOffers.filter(o => !["rejected", "expired"].includes(o.status));
  const activeAcquisitions = buyerTxs.filter(tx => tx.status !== "completed");
  const completedAcquisitions = buyerTxs.filter(tx => tx.status === "completed");

  // Stats
  const stats = [
    { label: dt.buyerShortlisted || "Shortlisted", value: shortlists.length, icon: Bookmark, color: "text-amber-400" },
    { label: dt.buyerActiveOffers || "Active Offers", value: activeBuyerOffers.length, icon: Handshake, color: "text-primary" },
    { label: dt.buyerAcquisitions || "Acquisitions", value: buyerTxs.length, icon: ShoppingCart, color: "text-emerald-400" },
    { label: dt.buyerCompleted || "Completed", value: completedAcquisitions.length, icon: CheckCircle2, color: "text-emerald-400" },
  ];

  return (
    <>
      {/* Buyer Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i + 1}>
            <Card className="bg-secondary/50 border-border p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-charcoal/50 flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-silver/50">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Acquisitions */}
        <motion.div className="lg:col-span-2" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
          <Card className="bg-secondary/50 border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-emerald-400" /> {dt.buyerActiveAcquisitions || "Active Acquisitions"}
              </h2>
            </div>
            {activeAcquisitions.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-silver/20 mx-auto mb-3" />
                <p className="text-silver/50 text-sm">{dt.buyerNoAcquisitions || "No active acquisitions. Make an offer on a car to start!"}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {activeAcquisitions.map(tx => (
                  <div
                    key={tx.id}
                    className="px-6 py-4 hover:bg-charcoal/20 transition-colors cursor-pointer"
                    onClick={() => navigate(`/acquire/${tx.offer_id}`)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{carLabel(tx.car_id)}</p>
                        <p className="text-xs text-primary font-semibold mt-0.5">€{tx.agreed_price.toLocaleString()}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{tx.status}</Badge>
                    </div>
                    {/* Step progress */}
                    <div className="flex items-center gap-1">
                      {stepLabels.map((step, idx) => {
                        const isCompleted = tx.current_step > idx + 1;
                        const isCurrent = tx.current_step === idx + 1;
                        return (
                          <div key={idx} className="flex items-center gap-1 flex-1">
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium w-full justify-center ${
                              isCompleted ? "bg-emerald-500/10 text-emerald-400" :
                              isCurrent ? "bg-primary/10 text-primary ring-1 ring-primary/30" :
                              "bg-charcoal/30 text-silver/30"
                            }`}>
                              <step.icon className="h-3 w-3" />
                              <span className="hidden sm:inline">{step.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* My Offers as Buyer */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5.5}>
            <Card className="bg-secondary/50 border-border">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-primary" /> {dt.buyerMyOffers || "My Offers"}
                  {activeBuyerOffers.length > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                      {activeBuyerOffers.length}
                    </span>
                  )}
                </h2>
              </div>
              {buyerOffers.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-silver/50">{dt.buyerNoOffers || "No offers yet. Browse cars and make an offer!"}</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-primary text-xs" onClick={() => navigate("/cars")}>
                    <Search className="h-3 w-3 mr-1" /> {dt.buyerBrowseCars || "Browse Cars"}
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {buyerOffers.slice(0, 6).map(offer => (
                    <div
                      key={offer.id}
                      className="px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-charcoal/20 transition-colors"
                      onClick={() => navigate(`/negotiate/${offer.id}`)}
                    >
                      <div>
                        <p className="text-sm text-white font-semibold">{carLabel(offer.car_id)}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-silver/40">€{offer.amount.toLocaleString()}</span>
                          {offerStatusBadge(offer.status)}
                          {offer.agreed_price && (
                            <span className="text-[10px] text-emerald-400">→ €{offer.agreed_price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-silver/30" />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Shortlisted Cars */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
            <Card className="bg-secondary/50 border-border">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-amber-400" /> {dt.buyerShortlist || "Shortlisted Cars"}
                  {shortlists.length > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-full bg-amber-400/20 text-amber-400 text-xs font-bold">
                      {shortlists.length}
                    </span>
                  )}
                </h2>
              </div>
              {shortlists.length === 0 ? (
                <p className="p-6 text-sm text-silver/50 text-center">{dt.buyerNoShortlists || "No cars shortlisted yet."}</p>
              ) : (
                <div className="divide-y divide-border">
                  {shortlists.slice(0, 6).map(sl => (
                    <div
                      key={sl.id}
                      className="px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-charcoal/20 transition-colors"
                      onClick={() => navigate(`/car/${sl.car_id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded bg-charcoal/50 overflow-hidden shrink-0">
                          {carCache[sl.car_id]?.image_url ? (
                            <img src={carCache[sl.car_id].image_url!} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Car className="h-3 w-3 text-silver/20" /></div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-white font-semibold">{carLabel(sl.car_id)}</p>
                          <p className="text-xs text-primary font-semibold">€{carPrice(sl.car_id).toLocaleString()}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-silver/30" />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
            <Card className="bg-secondary/50 border-border p-6">
              <h2 className="text-lg font-display font-bold text-white mb-4">{t.dashboard.quickActions}</h2>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-silver/70 hover:text-white" onClick={() => navigate("/cars")}>
                  <Search className="h-4 w-4 mr-3 text-primary" /> {dt.buyerBrowseCars || "Browse Cars"}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-silver/70 hover:text-white" onClick={() => navigate("/recommendations")}>
                  <BarChart3 className="h-4 w-4 mr-3 text-primary" /> {t.dashboard.myRecommendations}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-silver/70 hover:text-white" onClick={() => navigate("/intent")}>
                  <Car className="h-4 w-4 mr-3 text-primary" /> {t.dashboard.buyOrSell}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardBuyerTab;
