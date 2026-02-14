import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  CreditCard, FileText, Shield, CheckCircle2, Star,
  ArrowLeft, Building2, Banknote, Package,
} from "lucide-react";

interface OfferInfo {
  id: string;
  car_id: string;
  agreed_price: number;
  status: string;
}

interface CarInfo {
  make: string;
  model: string;
  year: number;
  price: number;
  fair_value_price: number | null;
}

interface Partner {
  id: string;
  name: string;
  type: string;
  base_rate: number;
  description: string | null;
}

const AcquisitionOptions: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [offer, setOffer] = useState<OfferInfo | null>(null);
  const [car, setCar] = useState<CarInfo | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Credit params
  const [downPayment, setDownPayment] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(48);

  // Leasing params
  const [leaseDown, setLeaseDown] = useState(3000);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [annualKm, setAnnualKm] = useState(15000);

  // Insurance params
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate("/login"); return; }
      if (!offerId) return;

      const [offerRes, partnersRes] = await Promise.all([
        supabase.from("offers").select("id, car_id, agreed_price, status").eq("id", offerId).single(),
        supabase.from("financing_partners").select("*"),
      ]);

      if (!offerRes.data || (offerRes.data as any).status !== "accepted") {
        toast.error("No accepted deal found");
        navigate("/dashboard");
        return;
      }

      const o = offerRes.data as unknown as OfferInfo;
      setOffer(o);
      if (partnersRes.data) setPartners(partnersRes.data as Partner[]);

      const { data: carData } = await supabase
        .from("cars")
        .select("make, model, year, price, fair_value_price")
        .eq("id", o.car_id)
        .single();

      if (carData) setCar(carData as CarInfo);
      setLoading(false);
    };
    init();
  }, [offerId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!offer || !car) {
    return (
      <div className="min-h-screen bg-charcoal text-silver">
        <Navbar />
        <div className="flex items-center justify-center pt-32 text-silver/50">Deal not found</div>
      </div>
    );
  }

  const agreedPrice = offer.agreed_price;
  const banks = partners.filter((p) => p.type === "bank");
  const leasingCos = partners.filter((p) => p.type === "leasing");
  const insurers = partners.filter((p) => p.type === "insurance");

  // Credit calculator
  const calcMonthly = (rate: number) => {
    const principal = agreedPrice - downPayment;
    const r = rate / 100 / 12;
    if (r === 0) return principal / loanTerm;
    return (principal * r * Math.pow(1 + r, loanTerm)) / (Math.pow(1 + r, loanTerm) - 1);
  };

  // Lease calculator
  const calcLeaseMonthly = (rate: number) => {
    const residualPct = Math.max(0.3, 1 - leaseTerm * 0.015);
    const residual = agreedPrice * residualPct;
    const depCost = (agreedPrice - leaseDown - residual) / leaseTerm;
    const financeCost = ((agreedPrice - leaseDown + residual) * (rate / 100)) / 24;
    return { monthly: depCost + financeCost, residual: Math.round(residual), residualPct: Math.round(residualPct * 100) };
  };

  // Insurance tiers
  const insuranceTiers = [
    { id: "liability", label: t.acquisition.liability, baseMonthly: 38 },
    { id: "partial", label: t.acquisition.partialCover, baseMonthly: 67, recommended: true },
    { id: "comprehensive", label: t.acquisition.comprehensive, baseMonthly: 112 },
  ];

  return (
    <div className="min-h-screen bg-charcoal text-silver">
      <SEO title={`Acquire — ${car.year} ${car.make} ${car.model}`} description="Choose financing" path={`/acquire/${offerId}`} noIndex />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Package className="h-4 w-4" /> {t.acquisition.title}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
            {car.year} {car.make} {car.model}
          </h1>
        </motion.div>

        {/* Deal Summary */}
        <motion.div
          className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-8 grid grid-cols-3 gap-4 text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <div>
            <p className="text-xs text-silver/50">{t.acquisition.askingPrice}</p>
            <p className="text-lg font-display font-bold text-silver/60 line-through">€{car.price.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-silver/50">{t.acquisition.agreedPrice}</p>
            <p className="text-2xl font-display font-black text-primary">€{agreedPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-silver/50">{t.acquisition.saved}</p>
            <p className="text-lg font-display font-bold text-primary">€{(car.price - agreedPrice).toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="credit" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/50 border border-border rounded-xl p-1 mb-6">
              <TabsTrigger value="credit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg font-semibold gap-2">
                <CreditCard className="h-4 w-4" /> {t.acquisition.creditTab}
              </TabsTrigger>
              <TabsTrigger value="leasing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg font-semibold gap-2">
                <FileText className="h-4 w-4" /> {t.acquisition.leasingTab}
              </TabsTrigger>
              <TabsTrigger value="insurance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg font-semibold gap-2">
                <Shield className="h-4 w-4" /> {t.acquisition.insuranceTab}
              </TabsTrigger>
            </TabsList>

            {/* CREDIT TAB */}
            <TabsContent value="credit">
              <div className="bg-secondary/50 border border-border rounded-2xl p-6 mb-6">
                <h3 className="font-display font-bold text-white mb-4">{t.acquisition.yourParams}</h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-silver/60">{t.acquisition.downPayment}</span>
                      <span className="text-white font-semibold">€{downPayment.toLocaleString()}</span>
                    </div>
                    <Slider value={[downPayment]} onValueChange={([v]) => setDownPayment(v)} min={0} max={Math.round(agreedPrice * 0.5)} step={500} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-silver/60">{t.acquisition.loanTerm}</span>
                      <span className="text-white font-semibold">{loanTerm} {t.acquisition.months}</span>
                    </div>
                    <Slider value={[loanTerm]} onValueChange={([v]) => setLoanTerm(v)} min={12} max={84} step={6} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {banks.map((bank, i) => {
                  const monthly = calcMonthly(bank.base_rate);
                  const totalCost = monthly * loanTerm + downPayment;
                  const totalInterest = totalCost - agreedPrice;
                  return (
                    <motion.div
                      key={bank.id}
                      className={`bg-secondary/50 border rounded-2xl p-6 ${i === 0 ? "border-primary/40" : "border-border"}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      {i === 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                          <Star className="h-3 w-3" /> {t.acquisition.recommended}
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-display font-bold text-white">{bank.name}</h4>
                            <p className="text-xs text-silver/40">{bank.description}</p>
                          </div>
                        </div>
                        <span className="text-lg font-display font-bold text-primary">{bank.base_rate}% APR</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-silver/50">{t.acquisition.monthly}</p>
                          <p className="text-white font-semibold">€{Math.round(monthly).toLocaleString()}/mo</p>
                        </div>
                        <div>
                          <p className="text-silver/50">{t.acquisition.totalCost}</p>
                          <p className="text-white font-semibold">€{Math.round(totalCost).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-silver/50">{t.acquisition.totalInterest}</p>
                          <p className="text-white font-semibold">€{Math.round(totalInterest).toLocaleString()}</p>
                        </div>
                      </div>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={() => toast.info(t.acquisition.comingSoon)}>
                        <Banknote className="mr-2 h-4 w-4" /> {t.acquisition.applyNow}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-xs text-silver/30 mt-4 text-center">{t.acquisition.ratesDisclaimer}</p>
            </TabsContent>

            {/* LEASING TAB */}
            <TabsContent value="leasing">
              <div className="bg-secondary/50 border border-border rounded-2xl p-6 mb-6">
                <h3 className="font-display font-bold text-white mb-4">{t.acquisition.leaseParams}</h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-silver/60">{t.acquisition.contractLength}</span>
                      <span className="text-white font-semibold">{leaseTerm} {t.acquisition.months}</span>
                    </div>
                    <Slider value={[leaseTerm]} onValueChange={([v]) => setLeaseTerm(v)} min={12} max={60} step={6} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-silver/60">{t.acquisition.annualMileage}</span>
                      <span className="text-white font-semibold">{annualKm.toLocaleString()} km/yr</span>
                    </div>
                    <Slider value={[annualKm]} onValueChange={([v]) => setAnnualKm(v)} min={5000} max={40000} step={1000} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-silver/60">{t.acquisition.downPayment}</span>
                      <span className="text-white font-semibold">€{leaseDown.toLocaleString()}</span>
                    </div>
                    <Slider value={[leaseDown]} onValueChange={([v]) => setLeaseDown(v)} min={0} max={Math.round(agreedPrice * 0.3)} step={500} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {leasingCos.map((co, i) => {
                  const { monthly, residual, residualPct } = calcLeaseMonthly(co.base_rate);
                  const totalCost = monthly * leaseTerm + leaseDown;
                  return (
                    <motion.div
                      key={co.id}
                      className={`bg-secondary/50 border rounded-2xl p-6 ${i === 0 ? "border-primary/40" : "border-border"}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      {i === 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                          <Star className="h-3 w-3" /> {t.acquisition.bestValue}
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-display font-bold text-white">{co.name}</h4>
                            <p className="text-xs text-silver/40">{co.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-silver/50">{t.acquisition.monthly}</p>
                          <p className="text-white font-semibold">€{Math.round(monthly).toLocaleString()}/mo</p>
                        </div>
                        <div>
                          <p className="text-silver/50">{t.acquisition.residualValue}</p>
                          <p className="text-white font-semibold">€{residual.toLocaleString()} ({residualPct}%)</p>
                        </div>
                        <div>
                          <p className="text-silver/50">{t.acquisition.totalCost}</p>
                          <p className="text-white font-semibold">€{Math.round(totalCost).toLocaleString()}</p>
                        </div>
                      </div>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={() => toast.info(t.acquisition.comingSoon)}>
                        {t.acquisition.startLease}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* INSURANCE TAB */}
            <TabsContent value="insurance">
              <div className="bg-secondary/50 border border-border rounded-2xl p-6 mb-6">
                <h3 className="font-display font-bold text-white mb-4">{t.acquisition.coverageTiers}</h3>
                <div className="space-y-3">
                  {insuranceTiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedTier === tier.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-silver/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {selectedTier === tier.id ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-silver/20" />
                          )}
                          <div>
                            <span className="text-sm font-semibold text-white">{tier.label}</span>
                            {tier.recommended && (
                              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                {t.acquisition.recommended}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-silver/60">{t.acquisition.from} €{tier.baseMonthly}/mo</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedTier && (
                <div className="space-y-4">
                  {insurers.map((ins, i) => {
                    const tierData = insuranceTiers.find((t) => t.id === selectedTier)!;
                    const monthly = tierData.baseMonthly + i * 5 + Math.round(agreedPrice * 0.0001);
                    const deductible = [500, 300, 150][i] ?? 500;
                    return (
                      <motion.div
                        key={ins.id}
                        className={`bg-secondary/50 border rounded-2xl p-6 ${i === 0 ? "border-primary/40" : "border-border"}`}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-primary" />
                            <div>
                              <h4 className="font-display font-bold text-white">{ins.name}</h4>
                              <p className="text-xs text-silver/40">{ins.description}</p>
                            </div>
                          </div>
                          <span className="text-lg font-display font-bold text-primary">€{monthly}/mo</span>
                        </div>
                        <p className="text-sm text-silver/50 mb-4">{t.acquisition.deductible}: €{deductible}</p>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={() => toast.info(t.acquisition.comingSoon)}>
                          {t.acquisition.getQuote}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {!selectedTier && (
                <p className="text-center text-silver/40 text-sm py-8">{t.acquisition.selectTier}</p>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Button variant="ghost" className="text-silver/50" onClick={() => navigate(`/negotiate/${offerId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.acquisition.backToNegotiation}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcquisitionOptions;
