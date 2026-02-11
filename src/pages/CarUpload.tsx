import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [step, setStep] = useState(1);
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

  const toggleEquipment = (item: string) => {
    setEquipment((prev) => prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]);
  };

  const calculateFairValue = () => {
    // Demo fair-value algorithm
    let basePrice = price;
    const ageFactor = Math.max(0.5, 1 - (2026 - year) * 0.05);
    const mileageFactor = Math.max(0.5, 1 - (mileage / 300000));
    const conditionFactor = ((conditionExterior + conditionInterior) / 2) / 100;
    const equipmentBonus = 1 + (equipment.length * 0.008);
    const accidentPenalty = accidentHistory ? 0.85 : 1;

    const fairValue = Math.round(basePrice * ageFactor * mileageFactor * conditionFactor * equipmentBonus * accidentPenalty);
    const condScore = Math.round(((conditionExterior + conditionInterior) / 2) * (accidentHistory ? 0.8 : 1));
    const demandScore = Math.min(100, Math.round(50 + (equipment.length * 2) + (year > 2020 ? 15 : 0) + (mileage < 80000 ? 10 : 0)));

    return { fairValue, condScore, demandScore };
  };

  const handleSubmit = async () => {
    if (!userId || !make || !model) return;
    setLoading(true);

    const { fairValue, condScore, demandScore } = calculateFairValue();

    const { data, error } = await supabase
      .from("cars")
      .insert({
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
      } as any)
      .select("id")
      .single();

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else if (data) {
      navigate(`/fair-value/${data.id}`);
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
          <h1 className="text-3xl font-display font-bold text-white">{t.carUpload.title}</h1>
          <p className="text-silver/60 mt-2">{t.carUpload.subtitle}</p>
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
