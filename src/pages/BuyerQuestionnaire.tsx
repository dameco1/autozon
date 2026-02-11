import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Car, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const BRANDS = ["Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Porsche", "Opel", "Ford", "Toyota", "Hyundai", "Kia", "Skoda", "SEAT", "Peugeot", "Renault", "Volvo", "Fiat", "Mazda", "Honda", "Nissan", "Tesla"];
const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Wagon", "Coupe", "Convertible", "Van", "Pickup"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const TRANSMISSIONS = ["Manual", "Automatic"];
const FEATURES = ["Navigation", "Heated Seats", "Parking Sensors", "Backup Camera", "Sunroof", "Leather Interior", "LED Headlights", "Adaptive Cruise Control", "Lane Assist", "Apple CarPlay"];
const COLORS = ["Black", "White", "Silver", "Grey", "Blue", "Red", "Green", "Brown", "Beige", "Orange"];
const TIMING_OPTIONS = ["immediately", "1-3months", "browsing"];

const TOTAL_STEPS = 10;

const BuyerQuestionnaire: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Answers
  const [brands, setBrands] = useState<string[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [transmission, setTransmission] = useState("");
  const [budgetMin, setBudgetMin] = useState(5000);
  const [budgetMax, setBudgetMax] = useState(50000);
  const [yearMin, setYearMin] = useState(2018);
  const [yearMax, setYearMax] = useState(2026);
  const [maxMileage, setMaxMileage] = useState(100000);
  const [features, setFeatures] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [timing, setTiming] = useState("browsing");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else setUserId(session.user.id);
    });
  }, [navigate]);

  const toggleArray = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const handleFinish = async () => {
    if (!userId) return;
    setLoading(true);

    const { error } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: userId,
          user_intent: "buying",
          preferred_makes: brands,
          preferred_body_types: bodyTypes,
          preferred_fuel_types: fuelTypes,
          preferred_transmission: transmission,
          min_budget: budgetMin,
          max_budget: budgetMax,
          min_year: yearMin,
          max_year: yearMax,
          max_mileage: maxMileage,
          preferred_colors: colors,
          timing_preference: timing,
          onboarding_completed: true,
        } as any,
        { onConflict: "user_id" }
      );

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/car-selection");
    }
  };

  const renderMultiSelect = (options: string[], selected: string[], setter: (v: string[]) => void, columns = 2) => (
    <div className={`grid grid-cols-${columns} gap-2`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {options.map((item) => (
        <label
          key={item}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
            selected.includes(item) ? "bg-primary/10 border-primary" : "bg-charcoal/50 border-border hover:border-silver/30"
          }`}
        >
          <Checkbox checked={selected.includes(item)} onCheckedChange={() => toggleArray(selected, item, setter)} />
          <span className={`text-sm ${selected.includes(item) ? "text-primary" : "text-silver/60"}`}>{item}</span>
        </label>
      ))}
    </div>
  );

  const renderSlider = (label: string, value: number, onChange: (v: number) => void, min: number, max: number, suffix = "") => (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-silver/80 text-sm">{label}</span>
        <span className="text-primary font-bold text-sm">{value.toLocaleString()}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[hsl(155,100%,42%)]"
      />
    </div>
  );

  const stepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-4">{t.buyerQ.q1}</h2>
            {renderMultiSelect(BRANDS, brands, setBrands, 3)}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-4">{t.buyerQ.q2}</h2>
            {renderMultiSelect(BODY_TYPES, bodyTypes, setBodyTypes, 2)}
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-4">{t.buyerQ.q3}</h2>
            {renderMultiSelect(FUEL_TYPES, fuelTypes, setFuelTypes, 2)}
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-4">{t.buyerQ.q4}</h2>
            <div className="flex gap-3">
              {TRANSMISSIONS.map((tr) => (
                <button
                  key={tr}
                  onClick={() => setTransmission(tr)}
                  className={`flex-1 px-6 py-4 rounded-xl border text-sm font-medium transition-all ${
                    transmission === tr ? "bg-primary/10 border-primary text-primary" : "bg-charcoal/50 border-border text-silver/60"
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-display font-bold text-white mb-4">{t.buyerQ.q5}</h2>
            {renderSlider(t.buyerQ.minBudget, budgetMin, setBudgetMin, 0, 200000, " €")}
            {renderSlider(t.buyerQ.maxBudget, budgetMax, setBudgetMax, 0, 300000, " €")}
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-display font-bold text-white mb-4">{t.buyerQ.q6}</h2>
            {renderSlider(t.buyerQ.minYear, yearMin, setYearMin, 2000, 2026)}
            {renderSlider(t.buyerQ.maxYear, yearMax, setYearMax, 2000, 2026)}
          </div>
        );
      case 7:
        return (
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-4">{t.buyerQ.q7}</h2>
            {renderSlider(t.buyerQ.maxMileage, maxMileage, setMaxMileage, 0, 300000, " km")}
          </div>
        );
      case 8:
        return (
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-4">{t.buyerQ.q8}</h2>
            {renderMultiSelect(FEATURES, features, setFeatures, 2)}
          </div>
        );
      case 9:
        return (
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-4">{t.buyerQ.q9}</h2>
            {renderMultiSelect(COLORS, colors, setColors, 3)}
          </div>
        );
      case 10:
        return (
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-4">{t.buyerQ.q10}</h2>
            <div className="space-y-3">
              {TIMING_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setTiming(opt)}
                  className={`w-full px-6 py-4 rounded-xl border text-left text-sm font-medium transition-all ${
                    timing === opt ? "bg-primary/10 border-primary text-primary" : "bg-charcoal/50 border-border text-silver/60"
                  }`}
                >
                  {t.buyerQ.timingOptions[opt as keyof typeof t.buyerQ.timingOptions]}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <Car className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-white">{t.buyerQ.title}</h1>
          <p className="text-silver/60 mt-2">{t.buyerQ.subtitle}</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-xs text-silver/40 mb-2">
            <span>{t.buyerQ.step} {step}/{TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
        </div>

        <div className="bg-secondary/50 border border-border rounded-2xl p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {stepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="ghost" className="text-silver/60" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {t.buyerQ.back}
              </Button>
            ) : (
              <div />
            )}
            {step < TOTAL_STEPS ? (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={() => setStep(step + 1)}>
                {t.buyerQ.next} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={handleFinish} disabled={loading}>
                {loading ? "..." : t.buyerQ.finish} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerQuestionnaire;
