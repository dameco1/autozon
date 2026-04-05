import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, ArrowLeft, Building2, TrendingUp, Info, CreditCard, Car } from "lucide-react";
import { motion } from "framer-motion";

const PARTNER_BANKS = [
  { name: "Raiffeisen", status: "coming_soon" },
  { name: "UniCredit Bank Austria", status: "coming_soon" },
  { name: "Arval", status: "coming_soon" },
];

const FinancingCalculator: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const [carPrice, setCarPrice] = useState(25000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [termMonths, setTermMonths] = useState(48);
  const [residualPct, setResidualPct] = useState(0);
  const [interestRate, setInterestRate] = useState(4.9);
  const [processingFee, setProcessingFee] = useState(250);
  const [offerData, setOfferData] = useState<{ agreed_price: number } | null>(null);

  useEffect(() => {
    if (offerId) {
      supabase.from("offers").select("agreed_price").eq("id", offerId).maybeSingle()
        .then(({ data }) => {
          if (data?.agreed_price) {
            setCarPrice(Number(data.agreed_price));
            setOfferData(data as any);
          }
        });
    }
  }, [offerId]);

  const downPayment = (carPrice * downPaymentPct) / 100;
  const residualValue = (carPrice * residualPct) / 100;
  const loanAmount = carPrice - downPayment - residualValue;
  const monthlyRate = interestRate / 100 / 12;

  const calculations = useMemo(() => {
    // Kredit (standard loan)
    const kreditMonthly = monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
      : loanAmount / termMonths;
    const kreditTotal = kreditMonthly * termMonths + downPayment + processingFee;
    const kreditEffective = ((kreditTotal - carPrice) / carPrice) * 100;

    // Leasing (no residual ownership)
    const leasingBase = carPrice - downPayment;
    const leasingMonthlyRate = (interestRate + 0.5) / 100 / 12;
    const leasingMonthly = leasingMonthlyRate > 0
      ? (leasingBase * leasingMonthlyRate * Math.pow(1 + leasingMonthlyRate, termMonths)) / (Math.pow(1 + leasingMonthlyRate, termMonths) - 1)
      : leasingBase / termMonths;
    const leasingTotal = leasingMonthly * termMonths + downPayment + processingFee;

    // 3-Wege-Finanzierung (balloon)
    const threewayResidual = carPrice * 0.3;
    const threewayLoan = carPrice - downPayment - threewayResidual;
    const threewayMonthly = monthlyRate > 0
      ? (threewayLoan * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
      : threewayLoan / termMonths;
    const threewayTotal = threewayMonthly * termMonths + downPayment + threewayResidual + processingFee;

    return {
      kredit: { monthly: kreditMonthly, total: kreditTotal, effective: kreditEffective, residual: 0 },
      leasing: { monthly: leasingMonthly, total: leasingTotal, effective: 0, residual: 0 },
      threeway: { monthly: threewayMonthly, total: threewayTotal, effective: 0, residual: threewayResidual },
    };
  }, [carPrice, downPaymentPct, termMonths, interestRate, processingFee, loanAmount, monthlyRate, downPayment, residualPct]);

  const fmt = (n: number) => `€${Math.round(n).toLocaleString("de-AT")}`;

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Financing Calculator | Autozon" description="Austrian car financing calculator with credit, leasing, and 3-way comparison" />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Button variant="ghost" className="mb-4 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <Calculator className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Finanzierungsrechner</h1>
            <p className="text-muted-foreground">Austrian car financing calculator</p>
          </div>
          {offerData && <Badge className="bg-primary/10 text-primary border-primary/30">Linked to offer</Badge>}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input panel */}
          <Card className="lg:col-span-1 border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" /> Eingaben
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-muted-foreground text-sm">Fahrzeugpreis (€)</Label>
                <Input type="number" value={carPrice} onChange={e => setCarPrice(Number(e.target.value))} className="mt-1 bg-background border-border text-foreground" />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Anzahlung: {downPaymentPct}%</Label>
                <Slider value={[downPaymentPct]} onValueChange={v => setDownPaymentPct(v[0])} min={0} max={40} step={5} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">{fmt(downPayment)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Laufzeit: {termMonths} Monate</Label>
                <Slider value={[termMonths]} onValueChange={v => setTermMonths(v[0])} min={12} max={120} step={6} className="mt-2" />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Zinssatz: {interestRate}%</Label>
                <Slider value={[interestRate * 10]} onValueChange={v => setInterestRate(v[0] / 10)} min={10} max={120} step={1} className="mt-2" />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Bearbeitungsgebühr (€)</Label>
                <Input type="number" value={processingFee} onChange={e => setProcessingFee(Number(e.target.value))} className="mt-1 bg-background border-border text-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Results panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="comparison" className="w-full">
              <TabsList className="bg-secondary border border-border">
                <TabsTrigger value="comparison">Vergleich</TabsTrigger>
                <TabsTrigger value="kredit">Kredit</TabsTrigger>
                <TabsTrigger value="leasing">Leasing</TabsTrigger>
                <TabsTrigger value="threeway">3-Wege</TabsTrigger>
              </TabsList>

              <TabsContent value="comparison">
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {([
                    { key: "kredit", title: "Kredit", icon: CreditCard, desc: "Standard car loan — you own the car" },
                    { key: "leasing", title: "Leasing", icon: TrendingUp, desc: "Operating lease — return at end" },
                    { key: "threeway", title: "3-Wege", icon: Building2, desc: "Balloon payment — low monthly, residual at end" },
                  ] as const).map(({ key, title, icon: Icon, desc }) => {
                    const c = calculations[key];
                    return (
                      <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="border-border h-full">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-foreground text-base flex items-center gap-2">
                              <Icon className="h-4 w-4 text-primary" /> {title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-xs text-muted-foreground">{desc}</p>
                            <div className="bg-primary/5 rounded-lg p-3 text-center">
                              <p className="text-2xl font-display font-bold text-primary">{fmt(c.monthly)}</p>
                              <p className="text-xs text-muted-foreground">/ Monat</p>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span className="text-muted-foreground">Gesamtkosten</span><span className="text-foreground font-medium">{fmt(c.total)}</span></div>
                              {c.residual > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Restwert</span><span className="text-foreground font-medium">{fmt(c.residual)}</span></div>}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {(["kredit", "leasing", "threeway"] as const).map(key => (
                <TabsContent key={key} value={key}>
                  <Card className="border-border mt-4">
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/5 rounded-lg p-4 text-center">
                          <p className="text-3xl font-display font-bold text-primary">{fmt(calculations[key].monthly)}</p>
                          <p className="text-sm text-muted-foreground">Monatliche Rate</p>
                        </div>
                        <div className="bg-secondary rounded-lg p-4 text-center">
                          <p className="text-3xl font-display font-bold text-foreground">{fmt(calculations[key].total)}</p>
                          <p className="text-sm text-muted-foreground">Gesamtkosten</p>
                        </div>
                      </div>
                      {calculations[key].residual > 0 && (
                        <div className="bg-accent/10 rounded-lg p-4 text-center">
                          <p className="text-xl font-bold text-foreground">{fmt(calculations[key].residual)}</p>
                          <p className="text-sm text-muted-foreground">Restwertzahlung am Ende</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Bonitätsindikator */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="font-display font-bold text-foreground">Bonitätsindikator</h3>
                  <Badge variant="outline" className="text-muted-foreground border-border">Simulation</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-destructive via-yellow-500 to-primary rounded-full" style={{ width: "72%" }} />
                  </div>
                  <span className="text-sm font-bold text-primary">72/100</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Geschätzt basierend auf Fahrzeugwert und Finanzierungsstruktur. Keine echte Bonitätsprüfung.</p>
              </CardContent>
            </Card>

            {/* Partner banks */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <h3 className="font-display font-bold text-foreground mb-4">Partnerbanken</h3>
                <div className="grid grid-cols-3 gap-3">
                  {PARTNER_BANKS.map(bank => (
                    <div key={bank.name} className="bg-secondary/50 border border-border rounded-xl p-4 text-center opacity-60">
                      <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">{bank.name}</p>
                      <Badge variant="outline" className="mt-2 text-xs text-muted-foreground border-border">Coming Soon</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancingCalculator;
