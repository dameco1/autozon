import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Car, ArrowRight, ArrowLeft, Check, Wrench, FileText, Camera, ShieldAlert, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "@/components/car-upload/constants";
import { defaultCarFormData, type CarFormData } from "@/components/car-upload/types";
import { calculateFairValue } from "@/components/car-upload/calculateFairValue";
import StepBasicInfo from "@/components/car-upload/StepBasicInfo";
import StepEquipment from "@/components/car-upload/StepEquipment";
import StepCondition from "@/components/car-upload/StepCondition";
import StepPhotos from "@/components/car-upload/StepPhotos";
import StepDamageReview from "@/components/car-upload/StepDamageReview";
import AppraisalDisclaimer from "@/components/car-upload/AppraisalDisclaimer";
import type { DamageReport } from "@/components/car-upload/damageTypes";

const CarUpload: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const initialStep = searchParams.get("step");
  const [step, setStep] = useState(initialStep ? Number(initialStep) : 0);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CarFormData>(defaultCarFormData);
  const [damageReport, setDamageReport] = useState<DamageReport | null>(null);
  const [analyzingDamage, setAnalyzingDamage] = useState(false);

  const updateForm = useCallback((updates: Partial<CarFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleEquipment = useCallback((item: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item],
    }));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else setUserId(session.user.id);
    });
  }, [navigate]);

  useEffect(() => {
    if (!editId) return;
    supabase.from("cars").select("id, make, model, year, vin, mileage, fuel_type, transmission, body_type, color, power_hp, price, equipment, condition_exterior, condition_interior, accident_history, accident_details, description, photos, detected_damages").eq("id", editId).maybeSingle().then(({ data }) => {
      if (!data) return;
      setFormData({
        make: data.make,
        model: data.model,
        variant: (data as any).variant ?? "",
        year: data.year,
        vin: data.vin ?? "",
        mileage: data.mileage,
        fuelType: data.fuel_type,
        transmission: data.transmission,
        bodyType: data.body_type,
        color: data.color ?? "",
        powerHp: data.power_hp ?? 150,
        price: data.price,
        equipment: data.equipment ?? [],
        conditionExterior: data.condition_exterior ?? 80,
        conditionInterior: data.condition_interior ?? 80,
        accidentHistory: data.accident_history ?? false,
        accidentDetails: data.accident_details ?? "",
        description: data.description ?? "",
        photos: (data as any).photos ?? [],
        damageScanned: false,
      });
    });
  }, [editId]);

  const runDamageDetection = useCallback(async () => {
    if (formData.photos.length === 0) return;
    setAnalyzingDamage(true);
    try {
      const { data, error } = await supabase.functions.invoke("detect-damage", {
        body: { photoUrls: formData.photos },
      });
      if (error) throw error;
      // Mark high-confidence damages as auto-confirmed, low-confidence as needing review
      const report = data as DamageReport;
      report.damages = report.damages.map((d) => ({
        ...d,
        confirmed: d.confidence >= 0.6 ? true : undefined,
      }));
      setDamageReport(report);
      updateForm({ damageScanned: true });
    } catch (err: any) {
      toast.error(err.message || "Damage detection failed");
    } finally {
      setAnalyzingDamage(false);
    }
  }, [formData.photos]);

  const confirmDamage = useCallback((index: number) => {
    setDamageReport((prev) => {
      if (!prev) return prev;
      const damages = [...prev.damages];
      damages[index] = { ...damages[index], confirmed: true };
      return { ...prev, damages };
    });
  }, []);

  const dismissDamage = useCallback((index: number) => {
    setDamageReport((prev) => {
      if (!prev) return prev;
      const damages = [...prev.damages];
      damages[index] = { ...damages[index], confirmed: false };
      return { ...prev, damages };
    });
  }, []);

  // Auto-trigger damage detection when entering step 3
  useEffect(() => {
    if (step === 3 && formData.photos.length > 0 && !damageReport && !analyzingDamage) {
      runDamageDetection();
    }
  }, [step, formData.photos.length, damageReport, analyzingDamage, runDamageDetection]);

  const handleSubmit = async () => {
    if (!userId || !formData.make || !formData.model) return;
    setLoading(true);

    const { fairValue, condScore, demandScore } = calculateFairValue(formData);

    // Factor in confirmed damages to adjust condition
    const confirmedDamages = damageReport?.damages.filter((d) => d.confirmed === true) ?? [];
    const damagePenalty = confirmedDamages.reduce((acc, d) => {
      if (d.severity === "high") return acc + 15;
      if (d.severity === "medium") return acc + 8;
      return acc + 3;
    }, 0);
    const adjustedCondScore = Math.max(10, condScore - damagePenalty);

    const confirmedDamageData = confirmedDamages.map(d => ({
      type: d.type,
      location: d.location,
      severity: d.severity,
      confidence: d.confidence,
      description: d.description,
    }));

    const carData = {
      owner_id: userId,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      vin: formData.vin,
      mileage: formData.mileage,
      fuel_type: formData.fuelType,
      transmission: formData.transmission,
      body_type: formData.bodyType,
      color: formData.color,
      power_hp: formData.powerHp,
      price: formData.price,
      equipment: formData.equipment,
      condition_exterior: formData.conditionExterior,
      condition_interior: formData.conditionInterior,
      accident_history: formData.accidentHistory || confirmedDamages.some((d) => d.severity === "high"),
      accident_details: formData.accidentDetails,
      description: formData.description,
      photos: formData.photos,
      image_url: formData.photos[0] ?? null,
      condition_score: adjustedCondScore,
      fair_value_price: fairValue,
      demand_score: demandScore,
      status: "available",
      detected_damages: confirmedDamageData,
    } as any;

    let resultId: string | null = null;

    if (editId) {
      const { error } = await supabase.from("cars").update(carData).eq("id", editId);
      if (error) { toast.error(error.message); setLoading(false); return; }
      resultId = editId;
    } else {
      // Check for duplicate car before inserting
      const dupQuery = supabase.from("cars").select("id").eq("owner_id", userId).eq("make", formData.make).eq("model", formData.model).eq("year", formData.year);
      if (formData.vin && formData.vin.length >= 5) dupQuery.eq("vin", formData.vin);
      const { data: existing } = await dupQuery.maybeSingle();
      if (existing) {
        toast.info("This car already exists in your listings. Redirecting to edit mode.");
        setLoading(false);
        navigate(`/car-upload?edit=${existing.id}`);
        return;
      }

      const { data, error } = await supabase.from("cars").insert(carData).select("id").single();
      if (error) { toast.error(error.message); setLoading(false); return; }
      resultId = data?.id ?? null;
    }

    setLoading(false);
    if (resultId) navigate(`/fair-value/${resultId}`);
  };

  const stepIcons = [FileText, Camera, ShieldAlert, Wrench, Check];
  const stepLabels = [
    t.carUpload.step1,
    t.carUpload.step2,
    t.carUpload.damage.resultTitle,
    t.carUpload.step3,
    t.carUpload.step4,
  ];

  const validateStep = (s: number): string | null => {
    switch (s) {
      case 1:
        if (!formData.make) return "Please select a make";
        if (!formData.model) return "Please select a model";
        if (!formData.color) return "Please select a color";
        if (formData.mileage <= 0) return "Please enter a valid mileage";
        if (formData.price <= 0) return "Please enter a valid price";
        return null;
      case 2:
        if (formData.photos.length === 0) return "Please upload at least one photo";
        return null;
      case 3:
        if (analyzingDamage) return "Please wait for damage analysis to finish";
        return null;
      case 4:
        return null; // equipment is optional
      case 5:
        return null; // condition has defaults
      default:
        return null;
    }
  };

  const handleNext = () => {
    const error = validateStep(step);
    if (error) {
      toast.error(error);
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Back to dashboard button */}
        <Button
          variant="ghost"
          className="text-silver/60 mb-4 -ml-2 hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>

        <div className="text-center mb-8">
          <Car className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-white">
            {editId ? t.carUpload.editTitle : t.carUpload.title}
          </h1>
          <p className="text-silver/60 mt-2">
            {editId ? t.carUpload.editSubtitle : t.carUpload.subtitle}
          </p>
        </div>

        {step === 0 ? (
          <div className="bg-secondary/50 border border-border rounded-2xl p-8">
            <AppraisalDisclaimer onAccept={() => { setDisclaimerAccepted(true); setStep(1); }} />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
              {[1, 2, 3, 4, 5].map((s) => {
                const Icon = stepIcons[s - 1];
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      s === step ? "bg-primary text-primary-foreground" : s < step ? "bg-primary/20 text-primary" : "bg-secondary text-silver/40"
                    }`}>
                      {s < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`text-xs hidden sm:block ${s === step ? "text-white font-medium" : "text-silver/40"}`}>
                      {stepLabels[s - 1]}
                    </span>
                    {s < STEPS && <div className={`w-6 h-0.5 ${s < step ? "bg-primary" : "bg-border"}`} />}
                  </div>
                );
              })}
            </div>

            <div className="bg-secondary/50 border border-border rounded-2xl p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {step === 1 && <StepBasicInfo data={formData} onChange={updateForm} />}
                  {step === 2 && <StepPhotos photos={formData.photos} userId={userId} onPhotosChange={(photos) => updateForm({ photos })} />}
                  {step === 3 && (
                    <StepDamageReview
                      report={damageReport}
                      analyzing={analyzingDamage}
                      onConfirm={confirmDamage}
                      onDismiss={dismissDamage}
                      onRunAnalysis={runDamageDetection}
                      hasPhotos={formData.photos.length > 0}
                    />
                  )}
                  {step === 4 && <StepEquipment equipment={formData.equipment} onToggle={toggleEquipment} />}
                  {step === 5 && <StepCondition data={formData} onChange={updateForm} />}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <Button variant="ghost" className="text-silver/60" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t.carUpload.back}
                  </Button>
                ) : <div />}
                {step < STEPS ? (
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    onClick={handleNext}
                    disabled={step === 3 && analyzingDamage}
                  >
                    {t.carUpload.next} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={handleSubmit} disabled={loading}>
                    {loading ? "..." : t.carUpload.submit} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CarUpload;
