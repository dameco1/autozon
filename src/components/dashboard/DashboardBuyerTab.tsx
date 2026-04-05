import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Car, ShoppingCart, Bookmark, Handshake, ArrowRight, FileCheck,
  CreditCard, Shield, CheckCircle2, Clock, Search, BarChart3,
  Settings2, Pencil, Save, X,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

// ... keep existing code (types BuyerOffer, ShortlistedCar, BuyerTransaction, Props)
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

type UserPrefs = {
  preferred_makes: string[] | null;
  preferred_body_types: string[] | null;
  preferred_fuel_types: string[] | null;
  preferred_transmission: string | null;
  min_budget: number | null;
  max_budget: number | null;
  min_year: number | null;
  max_year: number | null;
  max_mileage: number | null;
  preferred_colors: string[] | null;
  timing_preference: string | null;
};

interface Props {
  userId: string;
}

const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Wagon", "Coupe", "Convertible", "Van", "Pickup"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];

const DashboardBuyerTab: React.FC<Props> = ({ userId }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const dt = (t.dashboard as any);

  const [buyerOffers, setBuyerOffers] = useState<BuyerOffer[]>([]);
  const [shortlists, setShortlists] = useState<ShortlistedCar[]>([]);
  const [buyerTxs, setBuyerTxs] = useState<BuyerTransaction[]>([]);
  const [carCache, setCarCache] = useState<Record<string, { make: string; model: string; year: number; price: number; image_url: string | null; fair_value_price: number | null }>>({});
  const [prefs, setPrefs] = useState<UserPrefs | null>(null);
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [editPrefs, setEditPrefs] = useState<UserPrefs | null>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [offersRes, shortlistsRes, txRes, prefsRes] = await Promise.all([
        supabase.from("offers").select("id, car_id, amount, status, current_round, agreed_price, created_at").eq("buyer_id", userId).order("created_at", { ascending: false }),
        supabase.from("car_shortlists").select("id, car_id, created_at").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("transactions").select("id, car_id, offer_id, agreed_price, status, current_step, payment_confirmed, contract_signed_buyer, insurance_confirmed, created_at").eq("buyer_id", userId).order("created_at", { ascending: false }),
        supabase.from("user_preferences").select("preferred_makes, preferred_body_types, preferred_fuel_types, preferred_transmission, min_budget, max_budget, min_year, max_year, max_mileage, preferred_colors, timing_preference").eq("user_id", userId).maybeSingle(),
      ]);

      setBuyerOffers(offersRes.data || []);
      setShortlists(shortlistsRes.data || []);
      setBuyerTxs(txRes.data || []);
      if (prefsRes.data) setPrefs(prefsRes.data as UserPrefs);

      const allCarIds = [...new Set([...(offersRes.data || []).map(o => o.car_id), ...(shortlistsRes.data || []).map(s => s.car_id), ...(txRes.data || []).map(tx => tx.car_id)])];
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

  const handleStartEditPrefs = () => {
    setEditPrefs(prefs ? { ...prefs } : {
      preferred_makes: [], preferred_body_types: [], preferred_fuel_types: [],
      preferred_transmission: null, min_budget: 5000, max_budget: 50000,
      min_year: 2018, max_year: 2026, max_mileage: 100000,
      preferred_colors: [], timing_preference: "browsing",
    });
    setEditingPrefs(true);
  };

  const handleSavePrefs = async () => {
    if (!editPrefs) return;
    setSavingPrefs(true);
    const { error } = await supabase.from("user_preferences").upsert({
      user_id: userId,
      ...editPrefs,
      onboarding_completed: true,
    } as any, { onConflict: "user_id" });
    setSavingPrefs(false);
    if (error) { toast.error(error.message); return; }
    setPrefs(editPrefs);
    setEditingPrefs(false);
    toast.success("Preferences saved");
  };

  const togglePrefArray = (field: keyof UserPrefs, value: string) => {
    if (!editPrefs) return;
    const arr = (editPrefs[field] as string[] | null) || [];
    const updated = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    setEditPrefs({ ...editPrefs, [field]: updated });
  };

  const prefChips = (arr: string[] | null, fallback: string) => {
    if (!arr || arr.length === 0) return <span className="text-muted-foreground text-xs">{fallback}</span>;
    return arr.map(v => <Badge key={v} variant="secondary" className="text-[10px] mr-1 mb-1">{v}</Badge>);
  };

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
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search Preferences Card */}
      <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp} custom={4.5}>
        <Card className="bg-secondary/50 border-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" /> {dt.buyerPreferences || "Search Preferences"}
            </h2>
            {!editingPrefs ? (
              <Button variant="ghost" size="sm" className="text-primary text-xs gap-1" onClick={handleStartEditPrefs}>
                <Pencil className="h-3 w-3" /> {prefs ? (dt.buyerEditPreferences || "Edit") : (dt.buyerSetPreferences || "Set Preferences")}
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="text-muted-foreground text-xs" onClick={() => setEditingPrefs(false)}>
                  <X className="h-3 w-3" />
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground text-xs gap-1" onClick={handleSavePrefs} disabled={savingPrefs}>
                  <Save className="h-3 w-3" /> {dt.buyerSavePreferences || "Save"}
                </Button>
              </div>
            )}
          </div>

          {!editingPrefs ? (
            /* Read-only view */
            prefs ? (
              <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{dt.prefBudget || "Budget"}</p>
                  <p className="text-sm text-foreground font-semibold">€{(prefs.min_budget || 0).toLocaleString()} – €{(prefs.max_budget || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{dt.prefYearRange || "Year Range"}</p>
                  <p className="text-sm text-foreground font-semibold">{prefs.min_year || "—"} – {prefs.max_year || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{dt.prefMaxMileage || "Max Mileage"}</p>
                  <p className="text-sm text-foreground font-semibold">{prefs.max_mileage ? `${prefs.max_mileage.toLocaleString()} km` : "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{dt.prefBrands || "Brands"}</p>
                  <div className="flex flex-wrap">{prefChips(prefs.preferred_makes, dt.prefAny || "Any")}</div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{dt.prefBodyTypes || "Body Types"}</p>
                  <div className="flex flex-wrap">{prefChips(prefs.preferred_body_types, dt.prefAny || "Any")}</div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{dt.prefFuelTypes || "Fuel Types"}</p>
                  <div className="flex flex-wrap">{prefChips(prefs.preferred_fuel_types, dt.prefAny || "Any")}</div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{dt.prefTransmission || "Transmission"}</p>
                  <p className="text-sm text-foreground font-semibold">{prefs.preferred_transmission || (dt.prefAny || "Any")}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{dt.prefTiming || "Timing"}</p>
                  <p className="text-sm text-foreground font-semibold capitalize">{prefs.timing_preference || "—"}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Settings2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-3">{dt.buyerNoPreferences || "No preferences set yet."}</p>
                <Button size="sm" className="bg-primary text-primary-foreground" onClick={handleStartEditPrefs}>
                  {dt.buyerSetPreferences || "Set Preferences"}
                </Button>
              </div>
            )
          ) : (
            /* Edit mode */
            <div className="px-6 py-4 space-y-5">
              {/* Budget */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">{dt.prefBudget || "Budget"}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">€</span>
                  <Input type="number" className="h-8 w-28 bg-muted border-border text-sm" value={editPrefs?.min_budget || 0} onChange={e => setEditPrefs(p => p ? { ...p, min_budget: +e.target.value } : p)} />
                  <span className="text-xs text-muted-foreground">–</span>
                  <span className="text-xs text-muted-foreground">€</span>
                  <Input type="number" className="h-8 w-28 bg-muted border-border text-sm" value={editPrefs?.max_budget || 0} onChange={e => setEditPrefs(p => p ? { ...p, max_budget: +e.target.value } : p)} />
                </div>
              </div>
              {/* Year & Mileage */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">{dt.prefYearRange || "Year Range"}</p>
                  <div className="flex items-center gap-2">
                    <Input type="number" className="h-8 bg-muted border-border text-sm" value={editPrefs?.min_year || 2018} onChange={e => setEditPrefs(p => p ? { ...p, min_year: +e.target.value } : p)} />
                    <span className="text-xs text-muted-foreground">–</span>
                    <Input type="number" className="h-8 bg-muted border-border text-sm" value={editPrefs?.max_year || 2026} onChange={e => setEditPrefs(p => p ? { ...p, max_year: +e.target.value } : p)} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">{dt.prefMaxMileage || "Max Mileage"}</p>
                  <Input type="number" className="h-8 bg-muted border-border text-sm" value={editPrefs?.max_mileage || 100000} onChange={e => setEditPrefs(p => p ? { ...p, max_mileage: +e.target.value } : p)} />
                </div>
              </div>
              {/* Body Types */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">{dt.prefBodyTypes || "Body Types"}</p>
                <div className="flex flex-wrap gap-1.5">
                  {BODY_TYPES.map(bt => (
                    <button key={bt} onClick={() => togglePrefArray("preferred_body_types", bt)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        (editPrefs?.preferred_body_types || []).includes(bt)
                          ? "bg-primary/10 border-primary/30 text-primary"
                           : "bg-muted/60 border-border text-muted-foreground hover:border-primary/30"
                      }`}>{bt}</button>
                  ))}
                </div>
              </div>
              {/* Fuel Types */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">{dt.prefFuelTypes || "Fuel Types"}</p>
                <div className="flex flex-wrap gap-1.5">
                  {FUEL_TYPES.map(ft => (
                    <button key={ft} onClick={() => togglePrefArray("preferred_fuel_types", ft)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        (editPrefs?.preferred_fuel_types || []).includes(ft)
                          ? "bg-primary/10 border-primary/30 text-primary"
                           : "bg-muted/60 border-border text-muted-foreground hover:border-primary/30"
                      }`}>{ft}</button>
                  ))}
                </div>
              </div>
              {/* Transmission */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">{dt.prefTransmission || "Transmission"}</p>
                <div className="flex gap-1.5">
                  {["Any", "Manual", "Automatic"].map(tr => (
                    <button key={tr} onClick={() => setEditPrefs(p => p ? { ...p, preferred_transmission: tr === "Any" ? null : (p.preferred_transmission === tr ? null : tr) } : p)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        (tr === "Any" && !editPrefs?.preferred_transmission) || editPrefs?.preferred_transmission === tr
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-muted/60 border-border text-muted-foreground hover:border-primary/30"
                      }`}>{tr}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Acquisitions */}
        <motion.div className="lg:col-span-2" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
          <Card className="bg-secondary/50 border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-emerald-400" /> {dt.buyerActiveAcquisitions || "Active Acquisitions"}
              </h2>
            </div>
            {activeAcquisitions.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">{dt.buyerNoAcquisitions || "No active acquisitions. Make an offer on a car to start!"}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {activeAcquisitions.map(tx => (
                  <div
                    key={tx.id}
                    className="px-6 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
                    onClick={() => navigate(`/acquire/${tx.offer_id}`)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{carLabel(tx.car_id)}</p>
                        <p className="text-xs text-primary font-semibold mt-0.5">€{tx.agreed_price.toLocaleString()}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{tx.status}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {stepLabels.map((step, idx) => {
                        const isCompleted = tx.current_step > idx + 1;
                        const isCurrent = tx.current_step === idx + 1;
                        return (
                          <div key={idx} className="flex items-center gap-1 flex-1">
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium w-full justify-center ${
                              isCompleted ? "bg-emerald-500/10 text-emerald-400" :
                              isCurrent ? "bg-primary/10 text-primary ring-1 ring-primary/30" :
                              "bg-muted/60 text-muted-foreground"
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

          {/* Completed Acquisitions */}
          {completedAcquisitions.length > 0 && (
            <Card className="bg-secondary/50 border-border mt-6">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> {dt.buyerCompletedAcquisitions || "Completed Acquisitions"}
                </h2>
              </div>
              <div className="divide-y divide-border">
                {completedAcquisitions.map(tx => (
                  <div
                    key={tx.id}
                    className="px-6 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
                    onClick={() => navigate(`/acquire/${tx.offer_id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{carLabel(tx.car_id)}</p>
                        <p className="text-xs text-primary font-semibold mt-0.5">€{tx.agreed_price.toLocaleString()}</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                        {dt.buyerCompleted || "Completed"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* My Offers as Buyer */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5.5}>
            <Card className="bg-secondary/50 border-border">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
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
                  <p className="text-sm text-muted-foreground">{dt.buyerNoOffers || "No offers yet. Browse cars and make an offer!"}</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-primary text-xs" onClick={() => navigate("/car-selection")}>
                    <Search className="h-3 w-3 mr-1" /> {dt.buyerBrowseCars || "Browse Cars"}
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {buyerOffers.slice(0, 6).map(offer => (
                    <div
                      key={offer.id}
                      className="px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => navigate(`/negotiate/${offer.id}`)}
                    >
                      <div>
                        <p className="text-sm text-foreground font-semibold">{carLabel(offer.car_id)}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">€{offer.amount.toLocaleString()}</span>
                          {offerStatusBadge(offer.status)}
                          {offer.agreed_price && (
                            <span className="text-[10px] text-emerald-400">→ €{offer.agreed_price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
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
                <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-amber-400" /> {dt.buyerShortlist || "Shortlisted Cars"}
                  {shortlists.length > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-full bg-amber-400/20 text-amber-400 text-xs font-bold">
                      {shortlists.length}
                    </span>
                  )}
                </h2>
              </div>
              {shortlists.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground text-center">{dt.buyerNoShortlists || "No cars shortlisted yet."}</p>
              ) : (
                <div className="divide-y divide-border">
                  {shortlists.slice(0, 6).map(sl => (
                    <div
                      key={sl.id}
                      className="px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => navigate(`/car/${sl.car_id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded bg-muted overflow-hidden shrink-0">
                          {carCache[sl.car_id]?.image_url ? (
                            <img src={carCache[sl.car_id].image_url!} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Car className="h-3 w-3 text-muted-foreground" /></div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-foreground font-semibold">{carLabel(sl.car_id)}</p>
                          <p className="text-xs text-primary font-semibold">€{carPrice(sl.car_id).toLocaleString()}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
            <Card className="bg-secondary/50 border-border p-6">
              <h2 className="text-lg font-display font-bold text-foreground mb-4">{t.dashboard.quickActions}</h2>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={() => navigate("/car-selection")}>
                  <Search className="h-4 w-4 mr-3 text-primary" /> {dt.buyerBrowseCars || "Browse Cars"}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={() => navigate("/recommendations")}>
                  <BarChart3 className="h-4 w-4 mr-3 text-primary" /> {t.dashboard.myRecommendations}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={() => navigate("/intent")}>
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
