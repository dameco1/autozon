import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  TrendingDown, Gauge, Shield, Wrench, BarChart3, Globe, Eye,
  AlertTriangle, Sparkles, ArrowUpRight, Pencil, Star, Car, Gem,
  ScanSearch, CircleAlert, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

interface DetectedDamageEntry {
  type: string;
  location: string;
  severity: "low" | "medium" | "high";
  confidence: number;
  description: string;
  estimated_repair_cost_eur?: number;
}

interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fair_value_price: number;
  condition_score: number;
  demand_score: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  color: string | null;
  power_hp: number | null;
  equipment: string[] | null;
  condition_exterior: number | null;
  condition_interior: number | null;
  accident_history: boolean | null;
  accident_details: string | null;
  vin: string | null;
  description: string | null;
  detected_damages?: DetectedDamageEntry[] | null;
}

type FactorType = "booster" | "reducer" | "neutral";

interface AppraisalFactor {
  id: string;
  label: string;
  explanation: string;
  euroImpact: number;
  percentImpact: number;
  barValue: number; // 0-100
  type: FactorType;
  icon: React.ReactNode;
  actionable: boolean;
  actionLabel?: string;
  actionStep?: number;
  formulaTooltip: string;
}

function computeAppraisalFactors(car: CarData, t: any): AppraisalFactor[] {
  const a = t.appraisal;
  const basePrice = car.price;
  const currentYear = 2026;
  const carAge = currentYear - car.year;
  const iconicBrands = ["Porsche", "Tesla"];
  const premiumBrands = ["Porsche", "Mercedes-Benz", "BMW", "Audi", "Tesla", "Volvo"];
  const isPremium = premiumBrands.includes(car.make);
  const isIconic = iconicBrands.includes(car.make);

  const factors: AppraisalFactor[] = [];
  const normalize = (factor: number, min: number, max: number) =>
    Math.round(Math.max(0, Math.min(100, ((factor - min) / (max - min)) * 100)));

  // 1. DEPRECIATION (age-based, brand-tiered)
  const depRate = isIconic ? 0.07 : isPremium ? 0.10 : 0.15;
  const depreciationFactor = Math.max(0.25, Math.pow(1 - depRate, carAge * 0.75));
  const depEuro = Math.round(basePrice * (depreciationFactor - 1));
  const depPct = (depreciationFactor - 1) * 100;
  factors.push({
    id: "depreciation",
    label: a.depreciation.label,
    explanation: carAge <= 1
      ? a.depreciation.explainNew
      : carAge <= 3
        ? a.depreciation.explainYoung.replace("{age}", String(carAge)).replace("{brand}", car.make)
        : a.depreciation.explainOld.replace("{age}", String(carAge)),
    euroImpact: depEuro,
    percentImpact: depPct,
    barValue: normalize(depreciationFactor, 0.25, 1),
    type: "reducer",
    icon: <TrendingDown className="h-5 w-5" />,
    actionable: false,
    formulaTooltip: `Age: ${carAge}y · Rate: ${(depRate * 100).toFixed(0)}%/y (${isIconic ? "iconic" : isPremium ? "premium" : "standard"}) · Factor: (1-${depRate})^(${carAge}×0.75) = ${depreciationFactor.toFixed(3)}`,
  });

  // 2. MILEAGE — segment-specific expected km/year
  const avgAnnualKm = (() => {
    const sportsMakes = ["Porsche", "Ferrari", "Lamborghini", "Maserati", "Alfa Romeo"];
    if (sportsMakes.includes(car.make) || car.body_type === "Coupe" || car.body_type === "Convertible") return 8000;
    switch (car.body_type) {
      case "Hatchback": return 12000;
      case "SUV": case "Wagon": return 18000;
      case "Van": return 25000;
      case "Pickup": return 20000;
      default: return 15000;
    }
  })();
  const expectedKm = carAge * avgAnnualKm;
  const mileageRatio = car.mileage / Math.max(expectedKm, 1);
  const mileageFactor = mileageRatio <= 1
    ? 1 + (1 - mileageRatio) * 0.08
    : Math.max(0.55, 1 - Math.pow(mileageRatio - 1, 1.4) * 0.25);
  const mileEuro = Math.round(basePrice * depreciationFactor * (mileageFactor - 1));
  const milePct = (mileageFactor - 1) * 100;
  factors.push({
    id: "mileage",
    label: a.mileage.label,
    explanation: mileageRatio <= 1
      ? a.mileage.explainLow.replace("{km}", car.mileage.toLocaleString()).replace("{expected}", expectedKm.toLocaleString())
      : a.mileage.explainHigh.replace("{km}", car.mileage.toLocaleString()).replace("{expected}", expectedKm.toLocaleString()),
    euroImpact: mileEuro,
    percentImpact: milePct,
    barValue: normalize(mileageFactor, 0.55, 1.08),
    type: milePct >= 0 ? "booster" : "reducer",
    icon: <Gauge className="h-5 w-5" />,
    actionable: false,
    formulaTooltip: `${car.mileage.toLocaleString()} km vs expected ${expectedKm.toLocaleString()} km · Ratio: ${mileageRatio.toFixed(2)} · Factor: ${mileageFactor.toFixed(3)}`,
  });

  // 3. EXTERIOR CONDITION (recentered: avg 75 = ~1.0)
  // Cross-reference with AI damage scan to avoid contradictory messaging
  const condExt = car.condition_exterior ?? 80;
  const damages = car.detected_damages ?? [];
  const aiFoundNoDamages = Array.isArray(damages) && damages.length === 0;
  const condExtFactor = 0.85 + (condExt / 100) * 0.17;
  const extEuro = Math.round(basePrice * depreciationFactor * mileageFactor * (condExtFactor - 1) * 0.5);

  // If AI scan passed clean but user rated low, nudge them to re-evaluate
  let extExplanation: string;
  if (condExt >= 90) {
    extExplanation = a.exterior.explainExcellent;
  } else if (condExt >= 70) {
    extExplanation = a.exterior.explainGood;
  } else if (aiFoundNoDamages && condExt < 70) {
    // AI found no damage but user self-rated low — highlight mismatch
    extExplanation = a.exterior.explainAiMismatch ?? `You rated the exterior at ${condExt}/100, but the AI damage scan found no visible defects. Consider re-evaluating your rating to better reflect the car's actual condition.`;
  } else if (condExt >= 50) {
    extExplanation = a.exterior.explainFair;
  } else {
    extExplanation = a.exterior.explainPoor;
  }

  factors.push({
    id: "exterior",
    label: a.exterior.label,
    explanation: extExplanation,
    euroImpact: extEuro,
    percentImpact: (condExtFactor - 1) * 100 * 0.5,
    barValue: condExt,
    type: condExt >= 70 ? "booster" : "reducer",
    icon: <Car className="h-5 w-5" />,
    actionable: condExt < 85,
    actionLabel: a.exterior.action,
    actionStep: 3,
    formulaTooltip: `Score: ${condExt}/100 · Factor: 0.85 + (${condExt}/100)×0.17 = ${condExtFactor.toFixed(3)} · Weight: 50%${aiFoundNoDamages ? " · AI scan: no damage" : ""}`,
  });

  // 4. INTERIOR CONDITION (recentered: avg 75 = ~1.0)
  // Cross-reference with AI damage scan (interior damages would show in scan too)
  const condInt = car.condition_interior ?? 80;
  const condIntFactor = 0.85 + (condInt / 100) * 0.17;
  const intEuro = Math.round(basePrice * depreciationFactor * mileageFactor * (condIntFactor - 1) * 0.5);

  let intExplanation: string;
  if (condInt >= 90) {
    intExplanation = a.interior.explainExcellent;
  } else if (condInt >= 70) {
    intExplanation = a.interior.explainGood;
  } else if (aiFoundNoDamages && condInt < 70) {
    intExplanation = a.interior.explainAiMismatch ?? `You rated the interior at ${condInt}/100, but the AI damage scan found no visible defects. Consider re-evaluating your rating to better reflect the car's actual condition.`;
  } else if (condInt >= 50) {
    intExplanation = a.interior.explainFair;
  } else {
    intExplanation = a.interior.explainPoor;
  }

  factors.push({
    id: "interior",
    label: a.interior.label,
    explanation: intExplanation,
    euroImpact: intEuro,
    percentImpact: (condIntFactor - 1) * 100 * 0.5,
    barValue: condInt,
    type: condInt >= 70 ? "booster" : "reducer",
    icon: <Shield className="h-5 w-5" />,
    actionable: condInt < 85,
    actionLabel: a.interior.action,
    actionStep: 3,
    formulaTooltip: `Score: ${condInt}/100 · Factor: 0.85 + (${condInt}/100)×0.17 = ${condIntFactor.toFixed(3)} · Weight: 50%${aiFoundNoDamages ? " · AI scan: no damage" : ""}`,
  });

  // 5. ACCIDENT / DAMAGE HISTORY — now uses itemized damage costs when available
  const totalDamageCost = damages.reduce((sum, d) => sum + (d.estimated_repair_cost_eur ?? 0), 0);
  const hasDamageCosts = totalDamageCost > 0;
  const accidentPenalty = hasDamageCosts ? 1 : (car.accident_history ? 0.82 : 1);
  const accEuro = hasDamageCosts ? -totalDamageCost : Math.round(basePrice * depreciationFactor * (accidentPenalty - 1));
  const accPct = hasDamageCosts ? -(totalDamageCost / Math.max(basePrice, 1)) * 100 : (accidentPenalty - 1) * 100;
  factors.push({
    id: "damage",
    label: a.damage.label,
    explanation: hasDamageCosts
      ? `${damages.length} confirmed damage(s) with estimated repair cost of €${totalDamageCost.toLocaleString()}. This is deducted directly from the fair value.`
      : car.accident_history
        ? (car.accident_details && car.accident_details.length > 20
            ? a.damage.explainYesDetailed
            : a.damage.explainYes)
        : a.damage.explainNo,
    euroImpact: accEuro,
    percentImpact: accPct,
    barValue: hasDamageCosts ? Math.max(5, 100 - Math.round(totalDamageCost / 50)) : (car.accident_history ? 20 : 95),
    type: (hasDamageCosts || car.accident_history) ? "reducer" : "booster",
    icon: <AlertTriangle className="h-5 w-5" />,
    actionable: car.accident_history === true || hasDamageCosts,
    actionLabel: a.damage.action,
    actionStep: 3,
    formulaTooltip: hasDamageCosts
      ? `${damages.length} damages · Total repair cost: €${totalDamageCost.toLocaleString()} (deducted from value)`
      : `Accident: ${car.accident_history ? "yes → ×0.82 penalty" : "none → ×1.0 (no penalty)"}`,
  });

  // 6. EQUIPMENT VALUE (actionable — add more features)
  const safetyFeatures = ["Adaptive Cruise Control", "Lane Assist", "Blind Spot Monitor", "360° Camera", "Parking Sensors", "Backup Camera"];
  const techFeatures = ["Navigation", "Apple CarPlay", "Android Auto", "Heads-Up Display", "LED Headlights"];
  const comfortFeatures = ["Heated Seats", "Leather Interior", "Sunroof", "Cruise Control", "Keyless Entry", "Seat Memory", "Heated Steering Wheel"];
  const equip = car.equipment ?? [];
  let equipWeightedScore = 0;
  equip.forEach((eq) => {
    if (safetyFeatures.includes(eq)) equipWeightedScore += 2.5;
    else if (techFeatures.includes(eq)) equipWeightedScore += 1.8;
    else if (comfortFeatures.includes(eq)) equipWeightedScore += 1.2;
    else equipWeightedScore += 0.8;
  });
  const equipmentIndex = 1 + Math.min(equipWeightedScore * 0.003, 0.10);
  const equipEuro = Math.round(basePrice * depreciationFactor * (equipmentIndex - 1));
  factors.push({
    id: "equipment",
    label: a.equipment.label,
    explanation: equip.length >= 10
      ? a.equipment.explainHigh.replace("{count}", String(equip.length))
      : equip.length >= 5
        ? a.equipment.explainMedium.replace("{count}", String(equip.length))
        : a.equipment.explainLow,
    euroImpact: equipEuro,
    percentImpact: (equipmentIndex - 1) * 100,
    barValue: normalize(equipmentIndex, 1, 1.15),
    type: "booster",
    icon: <Wrench className="h-5 w-5" />,
    actionable: equip.length < 10,
    actionLabel: a.equipment.action,
    actionStep: 2,
    formulaTooltip: `${equip.length} features · Weighted score: ${equipWeightedScore.toFixed(1)} · Bonus: min(${equipWeightedScore.toFixed(1)}×0.3%, 10%) = +${((equipmentIndex - 1) * 100).toFixed(1)}%`,
  });

  // 7. BRAND & MARKET DEMAND
  const highDemandBodies = ["SUV", "Hatchback"];
  const moderateDemandBodies = ["Sedan", "Wagon", "Coupe", "Convertible"];
  const bodyDemand = highDemandBodies.includes(car.body_type) ? 1.04
    : moderateDemandBodies.includes(car.body_type) ? 1.01 : 0.97;
  const highDemandMakes = ["Toyota", "Honda", "Porsche", "Tesla"];
  const makeDemand = highDemandMakes.includes(car.make) ? 1.03
    : premiumBrands.includes(car.make) ? 1.01 : 1.0;
  const marketPositionFactor = bodyDemand * makeDemand;
  const marketEuro = Math.round(basePrice * depreciationFactor * (marketPositionFactor - 1));
  factors.push({
    id: "market",
    label: a.market.label,
    explanation: a.market.explain
      .replace("{make}", car.make)
      .replace("{bodyType}", car.body_type)
      .replace("{demand}", marketPositionFactor > 1.04 ? a.market.high : marketPositionFactor > 1.0 ? a.market.moderate : a.market.low),
    euroImpact: marketEuro,
    percentImpact: (marketPositionFactor - 1) * 100,
    barValue: normalize(marketPositionFactor, 0.94, 1.12),
    type: marketPositionFactor >= 1.0 ? "booster" : "reducer",
    icon: <BarChart3 className="h-5 w-5" />,
    actionable: false,
    formulaTooltip: `Body (${car.body_type}): ×${bodyDemand.toFixed(2)} · Make (${car.make}): ×${makeDemand.toFixed(2)} · Combined: ${marketPositionFactor.toFixed(3)}`,
  });

  // 8. UNIQUENESS / RARITY
  const rarityScorecardBase = isPremium ? 1.03 : 1.0;
  const colorBonus = (car.color && ["White", "Black", "Silver", "Grey"].includes(car.color)) ? 0 : 0.01;
  const rarityFactor = rarityScorecardBase + colorBonus;
  const rarityEuro = Math.round(basePrice * depreciationFactor * (rarityFactor - 1));
  factors.push({
    id: "rarity",
    label: a.rarity.label,
    explanation: isPremium
      ? a.rarity.explainPremium.replace("{make}", car.make)
      : a.rarity.explainStandard,
    euroImpact: rarityEuro,
    percentImpact: (rarityFactor - 1) * 100,
    barValue: normalize(rarityFactor, 0.98, 1.06),
    type: rarityFactor > 1.0 ? "booster" : "neutral",
    icon: <Gem className="h-5 w-5" />,
    actionable: false,
    formulaTooltip: `Brand tier: ${isPremium ? "premium +3%" : "standard +0%"} · Color (${car.color || "unknown"}): ${colorBonus > 0 ? "+1% unique" : "+0% common"} · Factor: ${rarityFactor.toFixed(3)}`,
  });

  // 9. FUEL TYPE / REGIONAL DEMAND
  const fuelDemand: Record<string, number> = {
    "Electric": 1.08, "Plug-in Hybrid": 1.05, "Hybrid": 1.04, "Petrol": 1.0, "Diesel": 0.95,
  };
  const regionalDemandMultiplier = fuelDemand[car.fuel_type] ?? 1.0;
  const regEuro = Math.round(basePrice * depreciationFactor * (regionalDemandMultiplier - 1));
  factors.push({
    id: "fuelDemand",
    label: a.fuelDemand.label,
    explanation: a.fuelDemand.explain.replace("{fuelType}", car.fuel_type),
    euroImpact: regEuro,
    percentImpact: (regionalDemandMultiplier - 1) * 100,
    barValue: normalize(regionalDemandMultiplier, 0.92, 1.1),
    type: regionalDemandMultiplier >= 1.0 ? "booster" : "reducer",
    icon: <Globe className="h-5 w-5" />,
    actionable: false,
    formulaTooltip: `Fuel: ${car.fuel_type} · Demand multiplier: ×${regionalDemandMultiplier.toFixed(2)}`,
  });

  // 10. DATA TRANSPARENCY (actionable — add more info)
  let transparencyPoints = 0;
  if ((car.vin ?? "").length >= 10) transparencyPoints += 3;
  if ((car.description ?? "").length > 50) transparencyPoints += 2;
  if (equip.length >= 5) transparencyPoints += 1;
  if (car.color) transparencyPoints += 1;
  if (car.accident_history && (car.accident_details ?? "").length > 20) transparencyPoints += 2;
  if (!car.accident_history) transparencyPoints += 1;
  const transparencyBonus = 1 + Math.min(transparencyPoints / 10, 1) * 0.04;
  const transEuro = Math.round(basePrice * depreciationFactor * (transparencyBonus - 1));
  const missingItems: string[] = [];
  if ((car.vin ?? "").length < 10) missingItems.push("VIN");
  if ((car.description ?? "").length <= 50) missingItems.push(a.transparency.descItem);
  if (!car.color) missingItems.push(a.transparency.colorItem);
  factors.push({
    id: "transparency",
    label: a.transparency.label,
    explanation: missingItems.length > 0
      ? a.transparency.explainMissing.replace("{items}", missingItems.join(", "))
      : a.transparency.explainComplete,
    euroImpact: transEuro,
    percentImpact: (transparencyBonus - 1) * 100,
    barValue: normalize(transparencyBonus, 1, 1.05),
    type: "booster",
    icon: <Eye className="h-5 w-5" />,
    actionable: missingItems.length > 0,
    actionLabel: a.transparency.action,
    actionStep: 1,
    formulaTooltip: `Points: ${transparencyPoints}/10 · Bonus: min(${transparencyPoints}/10, 1) × 4% = +${((transparencyBonus - 1) * 100).toFixed(1)}%`,
  });

  return factors;
}

interface Props {
  car: CarData;
}

const AppraisalBreakdown: React.FC<Props> = ({ car }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const factors = computeAppraisalFactors(car, t);
  const a = t.appraisal;

  const boosters = factors.filter(f => f.type === "booster" || (f.type === "neutral" && f.euroImpact >= 0));
  const reducers = factors.filter(f => f.type === "reducer" || (f.type === "neutral" && f.euroImpact < 0));
  const actionable = factors.filter(f => f.actionable);

  const totalBoost = boosters.reduce((sum, f) => sum + Math.max(0, f.euroImpact), 0);
  const totalReduction = reducers.reduce((sum, f) => sum + Math.min(0, f.euroImpact), 0);

  const handleEdit = (step?: number) => {
    navigate(`/car-upload?edit=${car.id}${step ? `&step=${step}` : ""}`);
  };

  const renderFactor = (factor: AppraisalFactor, index: number) => (
    <motion.div
      key={factor.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.04 }}
      className={`rounded-xl border p-4 transition-all ${
        factor.type === "booster"
          ? "bg-primary/5 border-primary/20"
          : factor.type === "reducer"
            ? "bg-destructive/5 border-destructive/20"
            : "bg-secondary/50 border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`mt-0.5 ${
            factor.type === "booster" ? "text-primary" : factor.type === "reducer" ? "text-destructive" : "text-silver/60"
          }`}>
            {factor.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium text-sm">{factor.label}</span>
              {factor.actionable && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-medium">
                  {a.improvable}
                </span>
              )}
            </div>
            <p className="text-silver/50 text-xs leading-relaxed">{factor.explanation}</p>
            <div className="mt-2">
              <Progress
                value={factor.barValue}
                className={`h-2 ${
                  factor.type === "reducer" ? "[&>div]:bg-destructive" : ""
                }`}
              />
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0 min-w-[60px]">
          <Popover>
            <PopoverTrigger asChild>
              <button className={`text-sm font-bold cursor-help ${
                factor.percentImpact >= 0 ? "text-primary" : "text-destructive"
              }`}>
                {factor.percentImpact >= 0 ? "+" : ""}{factor.percentImpact.toFixed(1)}%
              </button>
            </PopoverTrigger>
            <PopoverContent side="left" className="max-w-xs text-xs bg-charcoal border-border text-silver p-3">
              <p className="font-mono text-[11px] leading-relaxed">{factor.formulaTooltip}</p>
            </PopoverContent>
          </Popover>
          {factor.actionable && (
            <Button
              size="sm"
              variant="ghost"
              className="mt-1 h-7 px-2 text-xs text-primary hover:bg-primary/10"
              onClick={() => handleEdit(factor.actionStep)}
            >
              <Pencil className="h-3 w-3 mr-1" />
              {factor.actionLabel}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Summary Banner */}
      <motion.div
        className="bg-secondary/50 border border-border rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-display font-bold text-white">{a.title}</h3>
        </div>
        <p className="text-silver/50 text-sm mb-5">{a.subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-charcoal/80 rounded-xl p-4 text-center">
            <div className="text-xs text-silver/40 mb-1">{a.askingPrice}</div>
            <div className="text-xl font-bold text-white">€{car.price.toLocaleString()}</div>
          </div>
          <div className="bg-charcoal/80 rounded-xl p-4 text-center">
            <div className="text-xs text-primary/70 mb-1 flex items-center justify-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> {a.totalBoost}
            </div>
            <div className="text-xl font-bold text-primary">{boosters.length} {a.factors}</div>
          </div>
          <div className="bg-charcoal/80 rounded-xl p-4 text-center">
            <div className="text-xs text-destructive/70 mb-1 flex items-center justify-center gap-1">
              <TrendingDown className="h-3 w-3" /> {a.totalReduction}
            </div>
            <div className="text-xl font-bold text-destructive">{reducers.length} {a.factors}</div>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
          <div className="text-xs text-primary/70 mb-1">{a.resultLabel}</div>
          <div className="text-3xl font-display font-black text-primary">
            €{car.fair_value_price.toLocaleString()}
          </div>
        </div>
      </motion.div>

      {/* Actionable Items Alert */}
      {actionable.length > 0 && (
        <motion.div
          className="bg-accent/5 border border-accent/20 rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-display font-bold text-sm mb-1">
                {a.improvableTitle.replace("{count}", String(actionable.length))}
              </h4>
              <p className="text-silver/50 text-xs mb-3">{a.improvableSubtitle}</p>
              <div className="flex flex-wrap gap-2">
                {actionable.map(f => (
                  <Button
                    key={f.id}
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => handleEdit(f.actionStep)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Value Boosters */}
      {boosters.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-bold text-primary">{a.boostersTitle}</h4>
            <span className="text-xs text-silver/40">({boosters.length} {a.factors})</span>
          </div>
          <div className="space-y-3">
            {boosters.map((f, i) => renderFactor(f, i))}
          </div>
        </div>
      )}

      {/* Value Reducers */}
      {reducers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h4 className="text-sm font-bold text-destructive">{a.reducersTitle}</h4>
            <span className="text-xs text-silver/40">({reducers.length} {a.factors})</span>
          </div>
          <div className="space-y-3">
            {reducers.map((f, i) => renderFactor(f, i))}
          </div>
        </div>
      )}

      {/* AI-Detected Damages Section */}
      {(() => {
        const damages = car.detected_damages ?? [];
        const ad = a.aiDamages;
        const severityColors: Record<string, string> = {
          high: "text-destructive bg-destructive/10 border-destructive/20",
          medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
          low: "text-silver/70 bg-silver/5 border-silver/10",
        };
        const severityLabels: Record<string, string> = {
          high: ad.severityHigh,
          medium: ad.severityMedium,
          low: ad.severityLow,
        };
        const totalRepairCost = damages.reduce((sum, d) => sum + (d.estimated_repair_cost_eur ?? 0), 0);

        return (
          <motion.div
            className="bg-secondary/50 border border-border rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <ScanSearch className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-display font-bold text-white">{ad.title}</h3>
            </div>
            <p className="text-silver/50 text-xs mb-4">{ad.subtitle}</p>

            {damages.length === 0 ? (
              <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-primary">{ad.noDamages}</span>
              </div>
            ) : (
              <div className="space-y-3">
                {damages.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.05 }}
                    className="flex items-start gap-3 bg-charcoal/50 rounded-xl p-4 border border-border"
                  >
                    <CircleAlert className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      d.severity === "high" ? "text-destructive" : d.severity === "medium" ? "text-yellow-400" : "text-silver/50"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white text-sm font-medium capitalize">{d.type.replace("_", " ")}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${severityColors[d.severity]}`}>
                          {severityLabels[d.severity]}
                        </span>
                        <span className="text-silver/40 text-[10px]">📍 {d.location}</span>
                      </div>
                      <p className="text-silver/50 text-xs">{d.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {d.estimated_repair_cost_eur ? (
                        <>
                          <div className="text-destructive text-sm font-bold">-€{d.estimated_repair_cost_eur.toLocaleString()}</div>
                          <div className="text-destructive/60 text-[10px]">repair cost</div>
                        </>
                      ) : (
                        <>
                          <div className="text-destructive text-sm font-bold">-{d.severity === "high" ? 15 : d.severity === "medium" ? 8 : 3}</div>
                          <div className="text-destructive/60 text-[10px]">{ad.penalty}</div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Total impact */}
                <div className="flex items-center justify-between bg-destructive/5 border border-destructive/20 rounded-xl p-4 mt-2">
                  <span className="text-sm text-white font-medium">{ad.totalImpact}</span>
                  {totalRepairCost > 0 ? (
                    <span className="text-destructive font-bold">-€{totalRepairCost.toLocaleString()}</span>
                  ) : (
                    <span className="text-destructive font-bold">-{damages.reduce((sum, d) => sum + (d.severity === "high" ? 15 : d.severity === "medium" ? 8 : 3), 0)} pts</span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        );
      })()}

      {/* Resubmit CTA */}
      <motion.div
        className="text-center pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          size="lg"
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10 font-semibold px-8 py-6 rounded-xl"
          onClick={() => handleEdit()}
        >
          <Pencil className="mr-2 h-5 w-5" />
          {a.resubmitCta}
        </Button>
        <p className="text-silver/40 text-xs mt-2">{a.resubmitHint}</p>
      </motion.div>
    </div>
  );
};

export default AppraisalBreakdown;
