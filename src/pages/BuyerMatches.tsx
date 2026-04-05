import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Users, MapPin, Target, Clock, Star, Building2, User, Lock, CreditCard, Loader2, Handshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { User as AuthUser } from "@supabase/supabase-js";

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
  fair_value_price: number | null;
  body_type: string;
  fuel_type: string;
  placement_paid: boolean;
}

interface OfferRow {
  id: string;
  buyer_id: string;
  amount: number;
  status: string;
  current_round: number;
  created_at: string;
}

const BuyerMatches: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [buyers, setBuyers] = useState<(Buyer & { matchScore: number })[]>([]);
  const [car, setCar] = useState<CarInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeOffers, setActiveOffers] = useState<(OfferRow & { buyerName: string })[]>([]);

  // Offer dialog
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [creatingOffer, setCreatingOffer] = useState(false);

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

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate("/login"); return; }
      setAuthUser(session.user);

      const [carRes, buyersRes, offersRes] = await Promise.all([
        supabase.from("cars").select("make, model, year, price, fair_value_price, body_type, fuel_type, placement_paid").eq("id", carId).single(),
        supabase.from("buyers").select("id, name, type, location, budget_min, budget_max, intent_level, timing_preference").eq("is_seed", true),
        supabase.from("offers").select("id, buyer_id, amount, status, current_round, created_at").eq("car_id", carId).eq("seller_id", session.user.id),
      ]);

      if (carRes.data) {
        const carData = carRes.data as CarInfo;
        setCar(carData);
        setIsPaid(carData.placement_paid ?? false);

        const allBuyers = (buyersRes.data || []) as Buyer[];

        // Map existing offers to buyer names
        const existingOffers = (offersRes.data || []) as OfferRow[];
        const offersWithNames = existingOffers.map((o) => {
          const buyer = allBuyers.find((b) => b.id === o.buyer_id);
          return { ...o, buyerName: buyer?.name ?? "Unknown" };
        });
        setActiveOffers(offersWithNames);

        // Buyers with existing offers
        const offerBuyerIds = new Set(existingOffers.map((o) => o.buyer_id));

        const scored = allBuyers.map((buyer) => {
          const carPrice = carRes.data.price as number;
          const budgetFit = (carPrice >= buyer.budget_min && carPrice <= buyer.budget_max) ? 100 : Math.max(0, 100 - Math.abs(carPrice - buyer.budget_max) / 500);
          const intentScore = buyer.intent_level === "high" ? 100 : buyer.intent_level === "medium" ? 60 : 30;
          const timingScore = buyer.timing_preference === "immediate" ? 100 : buyer.timing_preference === "soon" ? 70 : 30;
          const matchScore = Math.round(0.4 * budgetFit + 0.3 * 70 + 0.2 * timingScore + 0.1 * intentScore);
          return { ...buyer, matchScore, hasOffer: offerBuyerIds.has(buyer.id) };
        }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 8);

        setBuyers(scored);
      }
      setLoading(false);
    };
    fetchData();
  }, [carId, navigate]);

  const handlePayPlacement = async () => {
    setPaymentLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        toast.error("Session expired. Redirecting to login…");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-placement-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ carId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");
      if (data?.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to start checkout. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const openOfferDialog = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setOfferAmount(car?.fair_value_price?.toString() || car?.price?.toString() || "");
    setOfferMessage("");
    setOfferDialogOpen(true);
  };

   const handleCreateOffer = async () => {
     if (!selectedBuyer || !carId || !authUser || !car) return;
     // Prevent self-dealing
     if (selectedBuyer.id === authUser.id) { toast.error("You cannot make an offer on your own car."); return; }
     const amt = parseFloat(offerAmount);
     if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }

    setCreatingOffer(true);
    const { data, error } = await supabase.from("offers").insert({
      car_id: carId,
      seller_id: authUser.id,
      buyer_id: selectedBuyer.id,
      amount: amt,
      message: offerMessage || null,
      status: "pending",
      current_round: 1,
      max_rounds: 3,
    } as any).select("id").single();

    if (error) {
      toast.error(error.message);
      setCreatingOffer(false);
      return;
    }

    toast.success("Offer sent!");
    setCreatingOffer(false);
    setOfferDialogOpen(false);

    if (data?.id) {
      navigate(`/negotiate/${data.id}`);
    }
  };

  const blurName = (name: string) => {
    if (isPaid) return name;
    return name.charAt(0) + "••••••";
  };

  const scoreBadge = (score: number) => {
    if (score >= 85) return { label: t.buyerMatches.perfect, bg: "bg-primary/10 border-primary text-primary" };
    if (score >= 70) return { label: t.buyerMatches.strong, bg: "bg-primary/5 border-primary/50 text-primary/80" };
    return { label: t.buyerMatches.acceptable, bg: "bg-muted border-border text-muted-foreground" };
  };

  const statusColor = (status: string) => {
    if (status === "accepted") return "text-primary";
    if (status === "rejected") return "text-destructive";
    if (status === "countered") return "text-amber-400";
    return "text-muted-foreground";
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><span className="text-muted-foreground">Loading...</span></div>;
  }

  const offerDialog = (t.buyerMatches as any).offerDialog;

  return (
    <div className="min-h-screen bg-background text-muted-foreground">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Users className="h-4 w-4" /> {t.buyerMatches.title}
          </span>
          {car && (
            <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground">
              {car.year} {car.make} {car.model}
            </h1>
          )}
          <p className="text-muted-foreground mt-2">{t.buyerMatches.subtitle}</p>
        </motion.div>

        {/* Payment Gate Banner */}
        {!isPaid && buyers.length > 0 && (
          <motion.div
            className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 flex-1">
              <Lock className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-foreground font-display font-bold">{t.buyerMatches.paywall.title}</h3>
                <p className="text-muted-foreground text-sm">{t.buyerMatches.paywall.subtitle}</p>
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

        {/* Active Negotiations */}
        {activeOffers.length > 0 && (
          <motion.div
            className="bg-secondary/50 border border-border rounded-2xl mb-8 overflow-hidden"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          >
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-foreground flex items-center gap-2">
                <Handshake className="h-5 w-5 text-primary" /> {(t.buyerMatches as any).activeNegotiations}
              </h2>
            </div>
            <div className="divide-y divide-border">
              {activeOffers.map((offer) => (
                <div key={offer.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{isPaid ? offer.buyerName : offer.buyerName.charAt(0) + "••••••"}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">€{offer.amount.toLocaleString()}</span>
                      <span className={`text-xs font-medium capitalize ${statusColor(offer.status)}`}>{offer.status}</span>
                      <span className="text-xs text-muted-foreground">Round {offer.current_round}/3</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => navigate(`/negotiate/${offer.id}`)}
                  >
                    {(t.buyerMatches as any).viewNegotiation} <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {buyers.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">{t.buyerMatches.noBuyers}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buyers.map((buyer, i) => {
              const badge = scoreBadge(buyer.matchScore);
              const hasExistingOffer = activeOffers.some((o) => o.buyer_id === buyer.id);
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
                        {buyer.type === "dealer" ? <Building2 className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div>
                        <h3 className={`font-display font-bold text-foreground ${!isPaid ? "select-none" : ""}`}>
                          {blurName(buyer.name)}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {buyer.type === "dealer" ? t.buyerMatches.types.dealer : t.buyerMatches.types.private}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-xs font-medium ${badge.bg}`}>
                      {buyer.matchScore}% — {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {buyer.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      {t.buyerMatches.intent}: {t.buyerMatches.intentLevels[buyer.intent_level as keyof typeof t.buyerMatches.intentLevels]}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star className="h-4 w-4" />
                      €{buyer.budget_min.toLocaleString()} – €{buyer.budget_max.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" /> {buyer.timing_preference}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isPaid ? (
                      hasExistingOffer ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-primary/30 text-primary"
                          onClick={() => {
                            const existing = activeOffers.find((o) => o.buyer_id === buyer.id);
                            if (existing) navigate(`/negotiate/${existing.id}`);
                          }}
                        >
                          <Handshake className="mr-2 h-3.5 w-3.5" /> {(t.buyerMatches as any).viewNegotiation}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                          onClick={() => openOfferDialog(buyer)}
                        >
                          <Handshake className="mr-2 h-3.5 w-3.5" /> {t.buyerMatches.accept}
                        </Button>
                      )
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-border text-muted-foreground cursor-not-allowed"
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

      {/* Offer Dialog */}
      <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <DialogContent className="bg-secondary border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">{offerDialog?.title}</DialogTitle>
            <DialogDescription>{offerDialog?.subtitle}</DialogDescription>
          </DialogHeader>

          {selectedBuyer && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl mb-2">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                {selectedBuyer.type === "dealer" ? <Building2 className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{selectedBuyer.name}</p>
                <p className="text-xs text-muted-foreground">
                  Budget: €{selectedBuyer.budget_min.toLocaleString()} – €{selectedBuyer.budget_max.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {car?.fair_value_price && (
            <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm">
              <span className="text-muted-foreground">{t.negotiation.fairValueLabel}</span>
              <span className="text-primary font-display font-bold">€{car.fair_value_price.toLocaleString()}</span>
            </div>
          )}

          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-muted-foreground text-sm">{offerDialog?.amountLabel}</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="pl-7 bg-background border-border text-foreground"
                />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">{offerDialog?.messageLabel}</Label>
              <Textarea
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder={offerDialog?.messagePlaceholder}
                className="bg-background border-border text-foreground text-sm h-20 mt-1"
              />
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              onClick={handleCreateOffer}
              disabled={creatingOffer || !offerAmount}
            >
              {creatingOffer ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {offerDialog?.sending}</>
              ) : (
                <><Handshake className="mr-2 h-4 w-4" /> {offerDialog?.submit}</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyerMatches;
