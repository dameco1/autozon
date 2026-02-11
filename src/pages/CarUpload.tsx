import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, ArrowRight, ArrowLeft, Check, Wrench, FileText } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const MAKES = ["Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Porsche", "Opel", "Ford", "Toyota", "Hyundai", "Kia", "Skoda", "SEAT", "Peugeot", "Renault", "Volvo", "Fiat", "Mazda", "Honda", "Nissan", "Tesla"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const TRANSMISSIONS = ["Manual", "Automatic"];
const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Wagon", "Coupe", "Convertible", "Van", "Pickup"];
const EQUIPMENT_LIST = [
  "Navigation", "Heated Seats", "Parking Sensors", "Backup Camera",
  "Sunroof", "Leather Interior", "LED Headlights", "Cruise Control",
  "Adaptive Cruise Control", "Lane Assist", "Blind Spot Monitor",
  "Apple CarPlay", "Android Auto", "Keyless Entry", "360° Camera",
  "Heads-Up Display", "Seat Memory", "Heated Steering Wheel",
];

const STEPS = 3;

const CarUpload: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const initialStep = searchParams.get("step");
  const [step, setStep] = useState(initialStep ? Number(initialStep) : 1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Step 1: Basic Info
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2022);
  const [vin, setVin] = useState("");
  const [mileage, setMileage] = useState(50000);
  const [fuelType, setFuelType] = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [bodyType, setBodyType] = useState("Sedan");
  const [color, setColor] = useState("");
  const [powerHp, setPowerHp] = useState(150);
  const [price, setPrice] = useState(15000);

  // Step 2: Equipment
  const [equipment, setEquipment] = useState<string[]>([]);

  // Step 3: Condition
  const [conditionExterior, setConditionExterior] = useState(80);
  const [conditionInterior, setConditionInterior] = useState(80);
  const [accidentHistory, setAccidentHistory] = useState(false);
  const [accidentDetails, setAccidentDetails] = useState("");
  const [description, setDescription] = useState("");

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
      setMake(data.make);
      setModel(data.model);
      setYear(data.year);
      setVin(data.vin ?? "");
      setMileage(data.mileage);
      setFuelType(data.fuel_type);
      setTransmission(data.transmission);
      setBodyType(data.body_type);
      setColor(data.color ?? "");
      setPowerHp(data.power_hp ?? 150);
      setPrice(data.price);
      setEquipment(data.equipment ?? []);
      setConditionExterior(data.condition_exterior ?? 80);
      setConditionInterior(data.condition_interior ?? 80);
      setAccidentHistory(data.accident_history ?? false);
      setAccidentDetails(data.accident_details ?? "");
      setDescription(data.description ?? "");
    });
  }, [editId]);

  const toggleEquipment = (item: string) => {
    setEquipment((prev) => prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]);
  };

  const calculateFairValue = () => {
    const currentYear = 2026;
    const carAge = currentYear - year;

    // ── 1. Non-Linear Depreciation Curve ──
    // Premium brands hold value better; first year steep, then flattens
    const premiumBrands = ["Porsche", "Mercedes-Benz", "BMW", "Audi", "Tesla", "Volvo"];
    const isPremium = premiumBrands.includes(make);
    // Year 1: -15% (premium) / -22% (standard), then curve flattens
    const depRate = isPremium ? 0.12 : 0.18;
    const depreciationFactor = Math.max(0.25, Math.pow(1 - depRate, Math.sqrt(carAge * 1.8)));

    // Mileage: exponential penalty past 150k
    const avgAnnualKm = 15000;
    const expectedKm = carAge * avgAnnualKm;
    const mileageRatio = mileage / Math.max(expectedKm, 1);
    const mileageFactor = mileageRatio <= 1
      ? 1 + (1 - mileageRatio) * 0.08   // under-mileage bonus
      : Math.max(0.55, 1 - Math.pow(mileageRatio - 1, 1.4) * 0.25);

    // ── 2. Condition Factor ──
    const condAvg = (conditionExterior + conditionInterior) / 2;
    const conditionFactor = 0.6 + (condAvg / 100) * 0.4; // range 0.6–1.0
    const accidentPenalty = accidentHistory ? 0.82 : 1;

    // ── 3. Equipment Value Index ──
    // Safety & tech features weighted higher than cosmetic
    const safetyFeatures = ["Adaptive Cruise Control", "Lane Assist", "Blind Spot Monitor", "360° Camera", "Parking Sensors", "Backup Camera"];
    const techFeatures = ["Navigation", "Apple CarPlay", "Android Auto", "Heads-Up Display", "LED Headlights"];
    const comfortFeatures = ["Heated Seats", "Leather Interior", "Sunroof", "Cruise Control", "Keyless Entry", "Seat Memory", "Heated Steering Wheel"];

    let equipWeightedScore = 0;
    equipment.forEach((eq) => {
      if (safetyFeatures.includes(eq)) equipWeightedScore += 3;
      else if (techFeatures.includes(eq)) equipWeightedScore += 2;
      else if (comfortFeatures.includes(eq)) equipWeightedScore += 1.5;
      else equipWeightedScore += 1;
    });
    // Normalized: max realistic score ~40 (all 18 items), bonus caps at ~12%
    const equipmentIndex = 1 + Math.min(equipWeightedScore * 0.003, 0.15);

    // ── 4. Market Position Factor ──
    // High-demand segments score higher
    const highDemandBodies = ["SUV", "Hatchback"];
    const moderateDemandBodies = ["Sedan", "Wagon"];
    const bodyDemand = highDemandBodies.includes(bodyType) ? 1.06
      : moderateDemandBodies.includes(bodyType) ? 1.02 : 0.97;

    const highDemandMakes = ["Toyota", "Honda", "Porsche", "Tesla"];
    const makeDemand = highDemandMakes.includes(make) ? 1.05
      : premiumBrands.includes(make) ? 1.02 : 1.0;

    const marketPositionFactor = bodyDemand * makeDemand;

    // ── 5. Regional Demand Multiplier ──
    // EVs and hybrids have urban premium; diesel penalized in cities
    const fuelDemand: Record<string, number> = {
      "Electric": 1.08,
      "Plug-in Hybrid": 1.05,
      "Hybrid": 1.04,
      "Petrol": 1.0,
      "Diesel": 0.95,
    };
    const regionalDemandMultiplier = fuelDemand[fuelType] ?? 1.0;

    // ── 6. Transparency Score ──
    // Sellers providing more data get a trust bonus visible to buyers
    let transparencyPoints = 0;
    if (vin.length >= 10) transparencyPoints += 3;
    if (description.length > 50) transparencyPoints += 2;
    if (equipment.length >= 5) transparencyPoints += 1;
    if (color) transparencyPoints += 1;
    if (accidentHistory && accidentDetails.length > 20) transparencyPoints += 2;
    if (!accidentHistory) transparencyPoints += 1;
    // Max 10 points → up to 5% bonus
    const transparencyBonus = 1 + Math.min(transparencyPoints / 10, 1) * 0.05;

    // ── FINAL Fair Value ──
    const fairValue = Math.round(
      price
      * depreciationFactor
      * mileageFactor
      * conditionFactor
      * accidentPenalty
      * equipmentIndex
      * marketPositionFactor
      * regionalDemandMultiplier
      * transparencyBonus
    );

    // Condition Score (0-100)
    const condScore = Math.round(
      condAvg * accidentPenalty * (mileageFactor > 0.9 ? 1 : 0.9 + mileageFactor * 0.1)
    );

    // Demand Score (0-100): composite of market signals
    const demandScore = Math.min(100, Math.round(
      30
      + (marketPositionFactor - 0.95) * 200
      + (regionalDemandMultiplier - 0.95) * 150
      + (year > 2022 ? 12 : year > 2019 ? 6 : 0)
      + (mileage < 60000 ? 10 : mileage < 120000 ? 5 : 0)
      + Math.min(equipWeightedScore * 0.5, 10)
    ));

    return { fairValue, condScore, demandScore };
  };

  const handleSubmit = async () => {
    if (!userId || !make || !model) return;
    setLoading(true);

    const { fairValue, condScore, demandScore } = calculateFairValue();

    const carData = {
      owner_id: userId,
      make,
      model,
      year,
      vin,
      mileage,
      fuel_type: fuelType,
      transmission,
      body_type: bodyType,
      color,
      power_hp: powerHp,
      price,
      equipment,
      condition_exterior: conditionExterior,
      condition_interior: conditionInterior,
      accident_history: accidentHistory,
      accident_details: accidentDetails,
      description,
      condition_score: condScore,
      fair_value_price: fairValue,
      demand_score: demandScore,
      status: "available",
    } as any;

    let resultId: string | null = null;

    if (editId) {
      // Update existing car
      const { error } = await supabase
        .from("cars")
        .update(carData)
        .eq("id", editId);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      resultId = editId;
    } else {
      // Insert new car
      const { data, error } = await supabase
        .from("cars")
        .insert(carData)
        .select("id")
        .single();
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      resultId = data?.id ?? null;
    }

    setLoading(false);
    if (resultId) {
      navigate(`/fair-value/${resultId}`);
    }
  };

  const stepIcons = [FileText, Wrench, Check];
  const stepLabels = [t.carUpload.step1, t.carUpload.step2, t.carUpload.step3];

  const conditionLabel = (val: number) => {
    if (val >= 90) return t.carUpload.conditionScale.excellent;
    if (val >= 70) return t.carUpload.conditionScale.good;
    if (val >= 50) return t.carUpload.conditionScale.fair;
    return t.carUpload.conditionScale.poor;
  };

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

        {/* Steps */}
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
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-silver/80 text-sm">{t.carUpload.make}</Label>
                      <Select value={make} onValueChange={setMake}>
                        <SelectTrigger className="bg-charcoal border-border text-white mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {MAKES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-silver/80 text-sm">{t.carUpload.model}</Label>
                      <Input value={model} onChange={(e) => setModel(e.target.value)} className="bg-charcoal border-border text-white mt-1" placeholder="e.g. A4, 3 Series" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-silver/80 text-sm">{t.carUpload.year}</Label>
                      <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-charcoal border-border text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-silver/80 text-sm">{t.carUpload.mileage}</Label>
                      <Input type="number" value={mileage} onChange={(e) => setMileage(Number(e.target.value))} className="bg-charcoal border-border text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-silver/80 text-sm">{t.carUpload.powerHp}</Label>
                      <Input type="number" value={powerHp} onChange={(e) => setPowerHp(Number(e.target.value))} className="bg-charcoal border-border text-white mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-silver/80 text-sm">{t.carUpload.fuelType}</Label>
                      <Select value={fuelType} onValueChange={setFuelType}>
                        <SelectTrigger className="bg-charcoal border-border text-white mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {FUEL_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-silver/80 text-sm">{t.carUpload.transmission}</Label>
                      <Select value={transmission} onValueChange={setTransmission}>
                        <SelectTrigger className="bg-charcoal border-border text-white mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {TRANSMISSIONS.map((tr) => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-silver/80 text-sm">{t.carUpload.bodyType}</Label>
                      <Select value={bodyType} onValueChange={setBodyType}>
                        <SelectTrigger className="bg-charcoal border-border text-white mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {BODY_TYPES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-silver/80 text-sm">{t.carUpload.color}</Label>
                      <Input value={color} onChange={(e) => setColor(e.target.value)} className="bg-charcoal border-border text-white mt-1" placeholder="e.g. Black, Silver" />
                    </div>
                    <div>
                      <Label className="text-silver/80 text-sm">{t.carUpload.price}</Label>
                      <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="bg-charcoal border-border text-white mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-silver/80 text-sm">{t.carUpload.vin}</Label>
                    <Input value={vin} onChange={(e) => setVin(e.target.value)} className="bg-charcoal border-border text-white mt-1" placeholder="WVWZZZ3CZWE123456" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <Label className="text-silver/80 text-sm mb-1 block">{t.carUpload.equipment}</Label>
                  <p className="text-silver/40 text-xs mb-4">{t.carUpload.equipmentHint}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {EQUIPMENT_LIST.map((item) => (
                      <label
                        key={item}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                          equipment.includes(item)
                            ? "bg-primary/10 border-primary"
                            : "bg-charcoal/50 border-border hover:border-silver/30"
                        }`}
                      >
                        <Checkbox
                          checked={equipment.includes(item)}
                          onCheckedChange={() => toggleEquipment(item)}
                        />
                        <span className={`text-sm ${equipment.includes(item) ? "text-primary" : "text-silver/60"}`}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-silver/80 text-sm mb-3 block">
                      {t.carUpload.conditionExterior}: <span className="text-primary font-bold">{conditionExterior}/100</span> — {conditionLabel(conditionExterior)}
                    </Label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={conditionExterior}
                      onChange={(e) => setConditionExterior(Number(e.target.value))}
                      className="w-full accent-[hsl(155,100%,42%)]"
                    />
                  </div>
                  <div>
                    <Label className="text-silver/80 text-sm mb-3 block">
                      {t.carUpload.conditionInterior}: <span className="text-primary font-bold">{conditionInterior}/100</span> — {conditionLabel(conditionInterior)}
                    </Label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={conditionInterior}
                      onChange={(e) => setConditionInterior(Number(e.target.value))}
                      className="w-full accent-[hsl(155,100%,42%)]"
                    />
                  </div>
                  <div>
                    <Label className="text-silver/80 text-sm mb-3 block">{t.carUpload.accidentHistory}</Label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setAccidentHistory(true)}
                        className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${
                          accidentHistory ? "bg-destructive/10 border-destructive text-destructive" : "bg-charcoal/50 border-border text-silver/60"
                        }`}
                      >
                        {t.carUpload.accidentYes}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAccidentHistory(false); setAccidentDetails(""); }}
                        className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${
                          !accidentHistory ? "bg-primary/10 border-primary text-primary" : "bg-charcoal/50 border-border text-silver/60"
                        }`}
                      >
                        {t.carUpload.accidentNo}
                      </button>
                    </div>
                  </div>
                  {accidentHistory && (
                    <div>
                      <Label className="text-silver/80 text-sm">{t.carUpload.accidentDetails}</Label>
                      <Textarea
                        value={accidentDetails}
                        onChange={(e) => setAccidentDetails(e.target.value)}
                        className="bg-charcoal border-border text-white mt-1"
                        rows={3}
                      />
                    </div>
                  )}
                  <div>
                    <Label className="text-silver/80 text-sm">{t.carUpload.description}</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-charcoal border-border text-white mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="ghost" className="text-silver/60" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {t.carUpload.back}
              </Button>
            ) : <div />}
            {step < STEPS ? (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={() => setStep(step + 1)} disabled={step === 1 && (!make || !model)}>
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
