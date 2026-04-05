import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Handshake, ArrowRight, CheckCircle2, XCircle, RotateCcw,
  MessageSquare, ShieldCheck, AlertTriangle, Download, User,
} from "lucide-react";
import { generateNegotiationPdf } from "@/lib/generateNegotiationPdf";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface OfferRow {
  id: string;
  car_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  counter_amount: number | null;
  agreed_price: number | null;
  current_round: number;
  max_rounds: number;
  status: string;
  message: string | null;
  created_at: string;
  updated_at: string;
}

interface CarInfo {
  make: string;
  model: string;
  year: number;
  price: number;
  fair_value_price: number | null;
}

interface RoundRow {
  id: string;
  offer_id: string;
  round_number: number;
  actor_id: string;
  actor_role: string;
  action: string;
  amount: number;
  message: string | null;
  created_at: string;
}

const Negotiation: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [offer, setOffer] = useState<OfferRow | null>(null);
  const [car, setCar] = useState<CarInfo | null>(null);
  const [rounds, setRounds] = useState<RoundRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMessage, setCounterMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sellerName, setSellerName] = useState("Seller");
  const [buyerName, setBuyerName] = useState("Buyer");

  const fetchData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { navigate("/login"); return; }
    setUser(session.user);

    if (!offerId) return;

    const { data: offerData } = await supabase
      .from("offers")
      .select("*")
      .eq("id", offerId)
      .single();

    if (!offerData) { setLoading(false); return; }
    const o = offerData as unknown as OfferRow;

    // If car is already sold, redirect to transaction summary
    if (o.status === "accepted") {
      const { data: carCheck } = await supabase.from("cars").select("status").eq("id", o.car_id).single();
      if (carCheck && (carCheck as any).status === "sold") {
        navigate(`/acquire/${o.id}`, { replace: true });
        return;
      }
    }

    setOffer(o);

    // Fetch car, rounds, and party names in parallel
    const [carRes, roundsRes, sellerRes, buyerRes] = await Promise.all([
      supabase.from("cars").select("make, model, year, price, fair_value_price").eq("id", o.car_id).single(),
      supabase.from("negotiation_rounds" as any).select("*").eq("offer_id", offerId).order("round_number", { ascending: true }).order("created_at", { ascending: true }),
      supabase.from("profiles").select("full_name").eq("user_id", o.seller_id).maybeSingle(),
      supabase.from("profiles").select("full_name").eq("user_id", o.buyer_id).maybeSingle(),
    ]);

    if (carRes.data) setCar(carRes.data as CarInfo);
    if (roundsRes.data) setRounds(roundsRes.data as unknown as RoundRow[]);
    if (sellerRes.data?.full_name) setSellerName(sellerRes.data.full_name);
    if (buyerRes.data?.full_name) setBuyerName(buyerRes.data.full_name);

    setLoading(false);
  }, [offerId, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Realtime subscription for live offer updates
  useEffect(() => {
    if (!offerId) return;
    const channel = supabase
      .channel(`offer-${offerId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "offers", filter: `id=eq.${offerId}` },
        () => { fetchData(); }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "negotiation_rounds" as any, filter: `offer_id=eq.${offerId}` },
        () => { fetchData(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [offerId, fetchData]);

  // Seed initial round if offer exists but no rounds yet (backward compat)
  useEffect(() => {
    if (!offer || !user || rounds.length > 0) return;
    // Only the buyer who created the offer seeds round 1
    if (user.id !== offer.buyer_id) return;

    const seedRound = async () => {
      await supabase.from("negotiation_rounds" as any).insert({
        offer_id: offer.id,
        round_number: 1,
        actor_id: offer.buyer_id,
        actor_role: "buyer",
        action: "offer",
        amount: offer.amount,
        message: offer.message || null,
      } as any);
      fetchData();
    };
    seedRound();
  }, [offer, user, rounds.length, fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!offer || !car || !user) {
    return (
      <div className="min-h-screen bg-background text-muted-foreground">
        <Navbar />
        <div className="flex items-center justify-center pt-32 text-muted-foreground">Offer not found</div>
      </div>
    );
  }

  const isBuyer = user.id === offer.buyer_id;
  const isSeller = user.id === offer.seller_id;
  const myRole = isBuyer ? "buyer" : "seller";
  const fairValue = car.fair_value_price ?? car.price;

  const isAccepted = offer.status === "accepted";
  const isRejected = offer.status === "rejected";
  const isFinished = isAccepted || isRejected;

  // Determine whose turn it is based on the last round action
  const lastRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
  const lastActorRole = lastRound?.actor_role;
  // After someone makes an offer or counter, it's the OTHER party's turn
  const isMyTurn = !isFinished && lastRound && lastActorRole !== myRole;
  const roundsUsed = offer.current_round;
  const roundsLeft = offer.max_rounds - roundsUsed;
  const latestAmount = lastRound?.amount ?? offer.amount;

  const handleAccept = async () => {
    setSubmitting(true);
    const agreedPrice = latestAmount;

    // Record the accept round
    await supabase.from("negotiation_rounds" as any).insert({
      offer_id: offer.id,
      round_number: offer.current_round,
      actor_id: user.id,
      actor_role: myRole,
      action: "accept",
      amount: agreedPrice,
      message: null,
    } as any);

    const { error } = await supabase
      .from("offers")
      .update({ status: "accepted", agreed_price: agreedPrice } as any)
      .eq("id", offer.id);

    if (error) { toast.error(error.message); setSubmitting(false); return; }
    toast.success(t.negotiation.dealAgreed);
    await fetchData();
    setSubmitting(false);
  };

  const handleReject = async () => {
    setSubmitting(true);

    await supabase.from("negotiation_rounds" as any).insert({
      offer_id: offer.id,
      round_number: offer.current_round,
      actor_id: user.id,
      actor_role: myRole,
      action: "reject",
      amount: latestAmount,
      message: null,
    } as any);

    const { error } = await supabase
      .from("offers")
      .update({ status: "rejected" } as any)
      .eq("id", offer.id);

    if (error) { toast.error(error.message); setSubmitting(false); return; }
    toast.info(t.negotiation.dealRejected);
    await fetchData();
    setSubmitting(false);
  };

  const handleCounter = async () => {
    const amt = parseFloat(counterAmount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    setSubmitting(true);

    const newRound = offer.current_round + 1;

    // Record the counter round
    await supabase.from("negotiation_rounds" as any).insert({
      offer_id: offer.id,
      round_number: newRound,
      actor_id: user.id,
      actor_role: myRole,
      action: "counter",
      amount: amt,
      message: counterMessage || null,
    } as any);

    const updates: Record<string, any> = {
      counter_amount: amt,
      status: "countered",
      current_round: newRound,
    };
    if (counterMessage) updates.message = counterMessage;

    const { error } = await supabase
      .from("offers")
      .update(updates as any)
      .eq("id", offer.id);

    if (error) { toast.error(error.message); setSubmitting(false); return; }
    toast.success(t.negotiation.counterSent);
    setCounterAmount("");
    setCounterMessage("");
    await fetchData();
    setSubmitting(false);
  };

  const actionIcon = (action: string) => {
    if (action === "accept") return <CheckCircle2 className="h-5 w-5 text-primary" />;
    if (action === "reject") return <XCircle className="h-5 w-5 text-destructive" />;
    if (action === "counter") return <RotateCcw className="h-5 w-5 text-amber-400" />;
    return <ArrowRight className="h-5 w-5 text-primary" />;
  };

  const actionLabel = (action: string) => {
    if (action === "offer") return t.negotiation.offered;
    if (action === "counter") return t.negotiation.countered;
    if (action === "accept") return t.negotiation.accepted;
    if (action === "reject") return t.negotiation.rejected;
    return action;
  };

  return (
    <div className="min-h-screen bg-background text-muted-foreground">
      <SEO title={`Negotiate — ${car.year} ${car.make} ${car.model}`} description="Negotiate the price" path={`/negotiate/${offerId}`} noIndex />
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Handshake className="h-4 w-4" /> {t.negotiation.title}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-foreground">
            {car.year} {car.make} {car.model}
          </h1>
          {/* Role indicator */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <User className="h-3 w-3 mr-1" />
              You are the {myRole === "buyer" ? t.negotiation.buyer : t.negotiation.seller}
            </Badge>
          </div>
        </motion.div>

        {/* Fair Value Anchor */}
        <motion.div
          className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t.negotiation.fairValueLabel}</span>
              <span className="text-lg font-display font-bold text-primary">€{fairValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">{t.negotiation.askingPrice}</span>
              <span className="text-lg font-display font-bold text-foreground">€{car.price.toLocaleString()}</span>
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, (fairValue / car.price) * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Parties */}
        <motion.div
          className="flex items-center justify-between bg-secondary/50 border border-border rounded-2xl px-6 py-3 mb-8 text-sm"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t.negotiation.seller}:</span>
            <span className="font-semibold text-foreground">{sellerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t.negotiation.buyer}:</span>
            <span className="font-semibold text-foreground">{buyerName}</span>
          </div>
        </motion.div>

        {/* Negotiation Timeline — built from rounds table */}
        <motion.div
          className="bg-secondary/50 border border-border rounded-2xl overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> {t.negotiation.timeline}
            </h2>
            <span className="text-xs text-muted-foreground">
              {t.negotiation.round} {offer.current_round} / {offer.max_rounds}
            </span>
          </div>

          <div className="divide-y divide-border">
            {rounds.map((r) => (
              <div
                key={r.id}
                className={`px-6 py-5 ${r.action === "accept" ? "bg-primary/5" : r.action === "reject" ? "bg-destructive/5" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {actionIcon(r.action)}
                    <span className="text-sm font-semibold text-foreground">
                      {r.actor_role === "buyer" ? buyerName : sellerName}
                      {" "}
                      <span className="text-muted-foreground font-normal">({r.actor_role === "buyer" ? t.negotiation.buyer : t.negotiation.seller})</span>
                      {" "}
                      {actionLabel(r.action)}
                    </span>
                  </div>
                  <span className="text-2xl font-display font-black text-foreground">€{r.amount.toLocaleString()}</span>
                </div>
                {r.message && (
                  <p className="text-sm text-muted-foreground italic ml-7">"{r.message}"</p>
                )}
                <p className="text-xs text-muted-foreground ml-7 mt-1">
                  Round {r.round_number} · {new Date(r.created_at).toLocaleString()}
                </p>
              </div>
            ))}

            {rounds.length === 0 && !isFinished && (
              <div className="px-6 py-4 text-muted-foreground text-sm">Initializing negotiation…</div>
            )}

            {/* Waiting state */}
            {!isFinished && rounds.length > 0 && (
              <div className="px-6 py-4 flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin" />
                {isMyTurn
                  ? t.negotiation.yourTurn
                  : lastActorRole === "buyer"
                    ? t.negotiation.waitingSeller
                    : t.negotiation.waitingBuyer}
                {roundsLeft > 0 && ` · ${roundsLeft} ${t.negotiation.roundsLeft}`}
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Area — shown to whoever's turn it is */}
        {!isFinished && isMyTurn && (
          <motion.div
            className="bg-secondary/50 border border-border rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            <h3 className="font-display font-bold text-foreground mb-4">{t.negotiation.yourTurn}</h3>

            {roundsLeft === 0 && (
              <div className="flex items-center gap-2 text-amber-400 text-sm mb-4">
                <AlertTriangle className="h-4 w-4" /> {t.negotiation.lastRound}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold flex-1"
                onClick={handleAccept}
                disabled={submitting}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t.negotiation.acceptBtn} €{latestAmount.toLocaleString()}
              </Button>
              <Button
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10 flex-1"
                onClick={handleReject}
                disabled={submitting}
              >
                <XCircle className="mr-2 h-4 w-4" /> {t.negotiation.rejectBtn}
              </Button>
            </div>

            {roundsLeft > 0 && (
              <div className="border-t border-border pt-4 mt-2">
                <p className="text-sm text-muted-foreground mb-3">{t.negotiation.orCounter}</p>
                <div className="flex gap-3 mb-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                    <Input
                      type="number"
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(e.target.value)}
                      placeholder="0"
                      className="pl-7 bg-muted border-border text-foreground"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10 font-semibold"
                    onClick={handleCounter}
                    disabled={submitting || !counterAmount}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> {t.negotiation.counterBtn}
                  </Button>
                </div>
                <Textarea
                  value={counterMessage}
                  onChange={(e) => setCounterMessage(e.target.value)}
                  placeholder={t.negotiation.messagePlaceholder}
                  className="bg-muted border-border text-foreground text-sm h-20"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Deal Accepted → Proceed */}
        {isAccepted && offer.agreed_price && (
          <motion.div
            className="bg-primary/5 border border-primary/30 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          >
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-display font-black text-foreground mb-2">{t.negotiation.dealAgreed}</h3>
            <p className="text-muted-foreground mb-2">
              {t.negotiation.agreedAt} <span className="text-primary font-bold">€{offer.agreed_price.toLocaleString()}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {t.negotiation.youSaved} €{(car.price - offer.agreed_price).toLocaleString()} ({Math.round((1 - offer.agreed_price / car.price) * 100)}%)
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-10 py-6 rounded-xl"
                onClick={() => navigate(`/acquire/${offer.id}`)}
              >
                {t.negotiation.proceedToAcquisition} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-muted-foreground hover:bg-secondary font-semibold px-8 py-6 rounded-xl"
                onClick={() =>
                  generateNegotiationPdf({
                    car,
                    offer: { ...offer, agreed_price: offer.agreed_price! },
                    sellerName,
                    buyerName,
                  })
                }
              >
                <Download className="mr-2 h-5 w-5" /> Download Summary
              </Button>
            </div>
          </motion.div>
        )}

        {/* Deal Rejected */}
        {isRejected && (
          <motion.div
            className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold text-foreground mb-2">{t.negotiation.dealRejected}</h3>
            <p className="text-muted-foreground text-sm mb-6">{t.negotiation.couldNotAgree}</p>
            <Button variant="outline" className="border-border text-muted-foreground" onClick={() => navigate("/recommendations")}>
              {t.negotiation.browseSimilar}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Negotiation;
