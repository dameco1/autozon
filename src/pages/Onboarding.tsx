import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Car, ArrowRight, ArrowLeft, Users, DollarSign, Clock, Check } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = 3;

const Onboarding: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Lifestyle
  const [commuteDistance, setCommuteDistance] = useState("medium");
  const [familySize, setFamilySize] = useState(2);
  const [usagePattern, setUsagePattern] = useState("daily");
  const [parkingType, setParkingType] = useState("street");

  // Financial
  const [budgetMin, setBudgetMin] = useState(5000);
  const [budgetMax, setBudgetMax] = useState(30000);
  const [ownershipPref, setOwnershipPref] = useState("buy");
  const [insuranceTolerance, setInsuranceTolerance] = useState("medium");

  // Timing
  const [timingPref, setTimingPref] = useState("planning");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUserId(session.user.id);
      }
    });
  }, [navigate]);

  const handleFinish = async () => {
    if (!userId) return;
    setLoading(true);

    const { error: existsError, data: existing } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    const prefData = {
      user_id: userId,
      commute_distance: commuteDistance,
      family_size: familySize,
      usage_pattern: usagePattern,
      parking_type: parkingType,
      min_budget: budgetMin,
      max_budget: budgetMax,
      ownership_preference: ownershipPref,
      insurance_tolerance: insuranceTolerance,
      timing_preference: timingPref,
      onboarding_completed: true,
    };

    let error;
    if (existing) {
      ({ error } = await supabase
        .from("user_preferences")
        .update(prefData)
        .eq("user_id", userId));
    } else {
      ({ error } = await supabase
        .from("user_preferences")
        .insert(prefData));
    }

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile complete!");
      navigate("/dashboard");
    }
  };

  const stepIcons = [Users, DollarSign, Clock];
  const stepLabels = [t.onboarding.step1, t.onboarding.step2, t.onboarding.step3];

  const RadioOption = ({ value, current, onChange, label }: { value: string; current: string; onChange: (v: string) => void; label: string }) => (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
        current === value
          ? "bg-primary/10 border-primary text-primary"
          : "bg-charcoal/50 border-border text-silver/60 hover:border-silver/30"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Car className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-white">{t.onboarding.title}</h1>
          <p className="text-silver/60 mt-2">{t.onboarding.subtitle}</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[1, 2, 3].map((s) => {
            const Icon = stepIcons[s - 1];
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  s === step ? "bg-primary text-primary-foreground" : s < step ? "bg-primary/20 text-primary" : "bg-secondary text-silver/40"
                }`}>
                  {s < step ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`text-sm hidden sm:block ${s === step ? "text-white font-medium" : "text-silver/40"}`}>
                  {stepLabels[s - 1]}
                </span>
                {s < STEPS && <div className={`w-8 h-0.5 ${s < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div className="bg-secondary/50 border border-border rounded-2xl p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-silver/80 text-sm mb-3 block">{t.onboarding.commuteDistance}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <RadioOption value="short" current={commuteDistance} onChange={setCommuteDistance} label={t.onboarding.commuteOptions.short} />
                      <RadioOption value="medium" current={commuteDistance} onChange={setCommuteDistance} label={t.onboarding.commuteOptions.medium} />
                      <RadioOption value="long" current={commuteDistance} onChange={setCommuteDistance} label={t.onboarding.commuteOptions.long} />
                      <RadioOption value="veryLong" current={commuteDistance} onChange={setCommuteDistance} label={t.onboarding.commuteOptions.veryLong} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-silver/80 text-sm mb-3 block">{t.onboarding.familySize}</Label>
                    <div className="flex items-center gap-4">
                      <Button type="button" variant="outline" size="icon" className="border-border text-silver" onClick={() => setFamilySize(Math.max(1, familySize - 1))}>-</Button>
                      <span className="text-2xl font-display font-bold text-white w-10 text-center">{familySize}</span>
                      <Button type="button" variant="outline" size="icon" className="border-border text-silver" onClick={() => setFamilySize(Math.min(8, familySize + 1))}>+</Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-silver/80 text-sm mb-3 block">{t.onboarding.usagePattern}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <RadioOption value="daily" current={usagePattern} onChange={setUsagePattern} label={t.onboarding.usageOptions.daily} />
                      <RadioOption value="weekend" current={usagePattern} onChange={setUsagePattern} label={t.onboarding.usageOptions.weekend} />
                      <RadioOption value="occasional" current={usagePattern} onChange={setUsagePattern} label={t.onboarding.usageOptions.occasional} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-silver/80 text-sm mb-3 block">{t.onboarding.parkingType}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <RadioOption value="garage" current={parkingType} onChange={setParkingType} label={t.onboarding.parkingOptions.garage} />
                      <RadioOption value="underground" current={parkingType} onChange={setParkingType} label={t.onboarding.parkingOptions.underground} />
                      <RadioOption value="street" current={parkingType} onChange={setParkingType} label={t.onboarding.parkingOptions.street} />
                      <RadioOption value="carport" current={parkingType} onChange={setParkingType} label={t.onboarding.parkingOptions.carport} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-silver/80 text-sm mb-3 block">{t.onboarding.budgetRange}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-silver/40">{t.onboarding.budgetMin}</span>
                        <Input type="number" value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value))} className="bg-charcoal border-border text-white mt-1" />
                      </div>
                      <div>
                        <span className="text-xs text-silver/40">{t.onboarding.budgetMax}</span>
                        <Input type="number" value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} className="bg-charcoal border-border text-white mt-1" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-silver/80 text-sm mb-3 block">{t.onboarding.ownershipPref}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <RadioOption value="buy" current={ownershipPref} onChange={setOwnershipPref} label={t.onboarding.ownershipOptions.buy} />
                      <RadioOption value="finance" current={ownershipPref} onChange={setOwnershipPref} label={t.onboarding.ownershipOptions.finance} />
                      <RadioOption value="lease" current={ownershipPref} onChange={setOwnershipPref} label={t.onboarding.ownershipOptions.lease} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-silver/80 text-sm mb-3 block">{t.onboarding.insuranceTolerance}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <RadioOption value="low" current={insuranceTolerance} onChange={setInsuranceTolerance} label={t.onboarding.insuranceOptions.low} />
                      <RadioOption value="medium" current={insuranceTolerance} onChange={setInsuranceTolerance} label={t.onboarding.insuranceOptions.medium} />
                      <RadioOption value="high" current={insuranceTolerance} onChange={setInsuranceTolerance} label={t.onboarding.insuranceOptions.high} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-silver/80 text-sm mb-3 block">{t.onboarding.timingPref}</Label>
                    <div className="space-y-3">
                      {(["immediate", "soon", "planning"] as const).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setTimingPref(val)}
                          className={`w-full px-5 py-4 rounded-xl border text-left transition-all ${
                            timingPref === val
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-charcoal/50 border-border text-silver/60 hover:border-silver/30"
                          }`}
                        >
                          <span className="font-medium">{t.onboarding.timingOptions[val]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="ghost" className="text-silver/60" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {t.onboarding.back}
              </Button>
            ) : <div />}
            {step < STEPS ? (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={() => setStep(step + 1)}>
                {t.onboarding.next} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={handleFinish} disabled={loading}>
                {loading ? "..." : t.onboarding.finish} <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
