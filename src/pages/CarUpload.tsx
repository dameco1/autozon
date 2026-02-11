import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Car, ArrowRight, ArrowLeft, Check, Wrench, FileText, Camera } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "@/components/car-upload/constants";
import { defaultCarFormData, type CarFormData } from "@/components/car-upload/types";
import { calculateFairValue } from "@/components/car-upload/calculateFairValue";
import StepBasicInfo from "@/components/car-upload/StepBasicInfo";
import StepEquipment from "@/components/car-upload/StepEquipment";
import StepCondition from "@/components/car-upload/StepCondition";
import StepPhotos from "@/components/car-upload/StepPhotos";

const CarUpload: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const initialStep = searchParams.get("step");
  const [step, setStep] = useState(initialStep ? Number(initialStep) : 1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CarFormData>(defaultCarFormData);

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

  // Load existing car data in edit mode
  useEffect(() => {
    if (!editId) return;
    supabase.from("cars").select("*").eq("id", editId).maybeSingle().then(({ data }) => {
      if (!data) return;
      setFormData({
        make: data.make,
        model: data.model,
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
      });
    });
  }, [editId]);

  const handleSubmit = async () => {
    if (!userId || !formData.make || !formData.model) return;
    setLoading(true);

    const { fairValue, condScore, demandScore } = calculateFairValue(formData);

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
      accident_history: formData.accidentHistory,
      accident_details: formData.accidentDetails,
      description: formData.description,
      photos: formData.photos,
      image_url: formData.photos[0] ?? null,
      condition_score: condScore,
      fair_value_price: fairValue,
      demand_score: demandScore,
      status: "available",
    } as any;

    let resultId: string | null = null;

    if (editId) {
      const { error } = await supabase.from("cars").update(carData).eq("id", editId);
      if (error) { toast.error(error.message); setLoading(false); return; }
      resultId = editId;
    } else {
      const { data, error } = await supabase.from("cars").insert(carData).select("id").single();
      if (error) { toast.error(error.message); setLoading(false); return; }
      resultId = data?.id ?? null;
    }

    setLoading(false);
    if (resultId) navigate(`/fair-value/${resultId}`);
  };

  const stepIcons = [FileText, Camera, Wrench, Check];
  const stepLabels = [t.carUpload.step1, t.carUpload.step2, t.carUpload.step3, t.carUpload.step4];

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Car className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-white">
            {editId ? t.carUpload.editTitle : t.carUpload.title}
          </h1>
          <p className="text-silver/60 mt-2">
            {editId ? t.carUpload.editSubtitle : t.carUpload.subtitle}
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[1, 2, 3, 4].map((s) => {
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
              {step === 3 && <StepEquipment equipment={formData.equipment} onToggle={toggleEquipment} />}
              {step === 4 && <StepCondition data={formData} onChange={updateForm} />}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="ghost" className="text-silver/60" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {t.carUpload.back}
              </Button>
            ) : <div />}
            {step < STEPS ? (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={() => setStep(step + 1)} disabled={step === 1 && (!formData.make || !formData.model)}>
                {t.carUpload.next} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={handleSubmit} disabled={loading}>
                {loading ? "..." : t.carUpload.submit} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarUpload;
