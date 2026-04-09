import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Car, Trophy, CreditCard, Building, ArrowLeftRight, CheckCircle, ArrowLeft, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import carPlaceholder from "@/assets/car-placeholder.jpg";

type CarRow = {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fair_value_price: number | null;
  fuel_type: string;
  transmission: string;
  body_type: string;
  color: string | null;
  power_hp: number | null;
  equipment: string[] | null;
  condition_score: number | null;
  demand_score: number | null;
  description: string | null;
  photos: string[] | null;
  image_url: string | null;
};

const CarComparison: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState<CarRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Financing state per car
  const [financing, setFinancing] = useState<{ [key: string]: { downPayment: number; term: number; rate: number } }>({});
  const [leasing, setLeasing] = useState<{ [key: string]: { term: number; residualPct: number } }>({});
  const [activeTab, setActiveTab] = useState<{ [key: string]: string }>({});
  const [activePhoto, setActivePhoto] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const carIds = searchParams.get("cars")?.split(",") || [];
    if (carIds.length < 2) {
      navigate("/car-selection");
      return;
    }

    supabase
      .from("cars")
      .select("*")
      .in("id", carIds)
      .then(({ data, error }) => {
        setLoading(false);
        if (error) {
          toast.error(error.message);
          return;
        }
        if (data) {
          setCars(data);
          const finInit: any = {};
          const leaseInit: any = {};
          const tabInit: any = {};
          data.forEach((c) => {
            finInit[c.id] = { downPayment: Math.round(c.price * 0.2), term: 48, rate: 4.9 };
            leaseInit[c.id] = { term: 36, residualPct: 45 };
            tabInit[c.id] = "purchase";
          });
          setFinancing(finInit);
          setLeasing(leaseInit);
          setActiveTab(tabInit);
        }
      });
  }, [searchParams, navigate]);

  const calcMonthly = (carId: string, price: number) => {
    const f = financing[carId];
    if (!f) return 0;
    const principal = price - f.downPayment;
    const monthlyRate = f.rate / 100 / 12;
    if (monthlyRate === 0) return principal / f.term;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, f.term)) / (Math.pow(1 + monthlyRate, f.term) - 1);
  };

  const calcLease = (carId: string, price: number) => {
    const l = leasing[carId];
    if (!l) return 0;
    const residual = price * (l.residualPct / 100);
    const depreciation = (price - residual) / l.term;
    const financeCharge = (price + residual) * 0.002;
    return depreciation + financeCharge;
  };

  const specRows = [
    { label: t.compare.year, key: "year" },
    { label: t.compare.mileage, key: "mileage", fmt: (v: number) => `${v.toLocaleString()} km` },
    { label: t.compare.fuel, key: "fuel_type" },
    { label: t.compare.transmission, key: "transmission" },
    { label: t.compare.bodyType, key: "body_type" },
    { label: t.compare.power, key: "power_hp", fmt: (v: number) => `${v} HP` },
    { label: t.compare.color, key: "color" },
    { label: t.compare.condition, key: "condition_score", fmt: (v: number) => `${v}/100` },
    { label: t.compare.demand, key: "demand_score", fmt: (v: number) => `${v}/100` },
  ];

  const tabs = [
    { key: "purchase", label: t.compare.purchase, icon: CreditCard },
    { key: "credit", label: t.compare.credit, icon: Building },
    { key: "leasing", label: t.compare.leasing, icon: ArrowLeftRight },
    { key: "tradein", label: t.compare.tradeIn, icon: ArrowLeftRight },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Car className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <Trophy className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">{t.compare.title}</h1>
          <p className="text-muted-foreground">{t.compare.subtitle}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" className="text-muted-foreground" onClick={() => navigate("/car-selection")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.compare.backToSelection}
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </div>

        {/* Spec Comparison Grid */}
        <div className="bg-secondary/50 border border-border rounded-2xl overflow-hidden mb-8">
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${cars.length}, 1fr)` }}>
            {/* Header */}
            <div className="p-4 border-b border-border" />
            {cars.map((car) => (
              <div key={car.id} className="p-4 border-b border-border text-center">
                <h3 className="text-foreground font-display font-bold text-lg">{car.make} {car.model}</h3>
                <p className="text-primary font-bold text-2xl mt-1">€{car.price.toLocaleString()}</p>
                {car.fair_value_price && (
                  <p className="text-muted-foreground text-sm">{t.compare.fairValue}: €{car.fair_value_price.toLocaleString()}</p>
                )}
              </div>
            ))}

            {/* Spec Rows */}
            {specRows.map((spec, idx) => (
              <React.Fragment key={spec.key}>
                <div className={`p-3 text-sm text-muted-foreground ${idx % 2 === 0 ? "bg-muted/60" : ""}`}>
                  {spec.label}
                </div>
                {cars.map((car) => {
                  const val = (car as any)[spec.key];
                  return (
                    <div key={car.id} className={`p-3 text-sm text-foreground text-center ${idx % 2 === 0 ? "bg-muted/60" : ""}`}>
                      {val != null ? (spec.fmt ? spec.fmt(val) : String(val)) : "—"}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Equipment Row */}
            <div className="p-3 text-sm text-muted-foreground bg-muted/60">{t.compare.equipment}</div>
            {cars.map((car) => (
              <div key={car.id} className="p-3 bg-muted/60">
                <div className="flex flex-wrap gap-1 justify-center">
                  {(car.equipment || []).slice(0, 6).map((eq) => (
                    <Badge key={eq} variant="secondary" className="text-xs">{eq}</Badge>
                  ))}
                  {(car.equipment || []).length > 6 && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">+{(car.equipment || []).length - 6}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acquisition Options */}
        <h2 className="text-2xl font-display font-bold text-foreground mb-6">{t.compare.acquisitionTitle}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {cars.map((car) => (
            <motion.div key={car.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-secondary/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-lg">{car.make} {car.model}</CardTitle>
                  {/* Tabs */}
                  <div className="flex gap-1 mt-3">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab((prev) => ({ ...prev, [car.id]: tab.key }))}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          activeTab[car.id] === tab.key
                            ? "bg-primary/10 text-primary border border-primary"
                            : "bg-muted text-muted-foreground border border-transparent"
                        }`}
                      >
                        <tab.icon className="h-3 w-3" /> {tab.label}
                      </button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  {activeTab[car.id] === "purchase" && (
                    <div className="space-y-3">
                      <div className="text-center py-6">
                        <p className="text-muted-foreground text-sm">{t.compare.fullPrice}</p>
                        <p className="text-primary font-bold text-3xl">€{car.price.toLocaleString()}</p>
                        {car.fair_value_price && car.fair_value_price < car.price && (
                          <p className="text-muted-foreground text-sm mt-2">
                            {t.compare.negotiationTip}: €{car.fair_value_price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab[car.id] === "credit" && financing[car.id] && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground text-xs">{t.compare.downPayment}</Label>
                        <Slider
                          value={[financing[car.id].downPayment]}
                          onValueChange={([v]) => setFinancing((p) => ({ ...p, [car.id]: { ...p[car.id], downPayment: v } }))}
                          min={0}
                          max={car.price}
                          step={500}
                          className="mt-2"
                        />
                        <p className="text-primary text-sm mt-1">€{financing[car.id].downPayment.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">{t.compare.loanTerm}</Label>
                        <Slider
                          value={[financing[car.id].term]}
                          onValueChange={([v]) => setFinancing((p) => ({ ...p, [car.id]: { ...p[car.id], term: v } }))}
                          min={12}
                          max={84}
                          step={6}
                          className="mt-2"
                        />
                        <p className="text-primary text-sm mt-1">{financing[car.id].term} {t.compare.months}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">{t.compare.interestRate}</Label>
                        <Slider
                          value={[financing[car.id].rate * 10]}
                          onValueChange={([v]) => setFinancing((p) => ({ ...p, [car.id]: { ...p[car.id], rate: v / 10 } }))}
                          min={10}
                          max={150}
                          step={1}
                          className="mt-2"
                        />
                        <p className="text-primary text-sm mt-1">{financing[car.id].rate.toFixed(1)}%</p>
                      </div>
                      <div className="bg-muted rounded-xl p-4 text-center">
                        <p className="text-muted-foreground text-sm">{t.compare.monthlyPayment}</p>
                        <p className="text-primary font-bold text-2xl">€{Math.round(calcMonthly(car.id, car.price)).toLocaleString()}/mo</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {t.compare.totalCost}: €{Math.round(calcMonthly(car.id, car.price) * financing[car.id].term + financing[car.id].downPayment).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab[car.id] === "leasing" && leasing[car.id] && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground text-xs">{t.compare.leaseTerm}</Label>
                        <Slider
                          value={[leasing[car.id].term]}
                          onValueChange={([v]) => setLeasing((p) => ({ ...p, [car.id]: { ...p[car.id], term: v } }))}
                          min={12}
                          max={60}
                          step={6}
                          className="mt-2"
                        />
                        <p className="text-primary text-sm mt-1">{leasing[car.id].term} {t.compare.months}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">{t.compare.residualValue}</Label>
                        <Slider
                          value={[leasing[car.id].residualPct]}
                          onValueChange={([v]) => setLeasing((p) => ({ ...p, [car.id]: { ...p[car.id], residualPct: v } }))}
                          min={20}
                          max={70}
                          step={5}
                          className="mt-2"
                        />
                        <p className="text-primary text-sm mt-1">{leasing[car.id].residualPct}% (€{Math.round(car.price * leasing[car.id].residualPct / 100).toLocaleString()})</p>
                      </div>
                      <div className="bg-muted rounded-xl p-4 text-center">
                        <p className="text-muted-foreground text-sm">{t.compare.monthlyLease}</p>
                        <p className="text-primary font-bold text-2xl">€{Math.round(calcLease(car.id, car.price)).toLocaleString()}/mo</p>
                      </div>
                    </div>
                  )}

                  {activeTab[car.id] === "tradein" && (
                    <div className="space-y-4 text-center py-6">
                      <ArrowLeftRight className="h-10 w-10 text-primary mx-auto" />
                      <p className="text-muted-foreground text-sm">{t.compare.tradeInDesc}</p>
                      <Button variant="outline" className="border-primary text-primary" onClick={() => navigate("/car-upload")}>
                        {t.compare.listYourCar}
                      </Button>
                    </div>
                  )}

                  {/* Partner Buttons */}
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <Button variant="outline" className="w-full text-muted-foreground border-border text-xs" disabled>
                      <Building className="mr-2 h-3 w-3" /> {t.compare.connectBank}
                    </Button>
                    <Button variant="outline" className="w-full text-muted-foreground border-border text-xs" disabled>
                      <CreditCard className="mr-2 h-3 w-3" /> {t.compare.getInsurance}
                    </Button>
                  </div>

                  {/* CTA */}
                  <Button
                    className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl"
                    onClick={() => navigate(`/car/${car.id}`)}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" /> {t.compare.chooseCar}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarComparison;
