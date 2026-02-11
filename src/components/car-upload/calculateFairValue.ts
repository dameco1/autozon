import type { CarFormData } from "./types";

interface FairValueResult {
  fairValue: number;
  condScore: number;
  demandScore: number;
}

const ICONIC_BRANDS = ["Porsche", "Tesla"];
const PREMIUM_BRANDS = ["Porsche", "Mercedes-Benz", "BMW", "Audi", "Tesla", "Volvo"];
const SAFETY_FEATURES = ["Adaptive Cruise Control", "Lane Assist", "Blind Spot Monitor", "360° Camera", "Parking Sensors", "Backup Camera"];
const TECH_FEATURES = ["Navigation", "Apple CarPlay", "Android Auto", "Heads-Up Display", "LED Headlights"];
const COMFORT_FEATURES = ["Heated Seats", "Leather Interior", "Sunroof", "Cruise Control", "Keyless Entry", "Seat Memory", "Heated Steering Wheel"];

export function calculateFairValue(data: CarFormData): FairValueResult {
  const currentYear = 2026;
  const carAge = currentYear - data.year;

  // 1. Non-Linear Depreciation Curve (brand-tiered)
  const isPremium = PREMIUM_BRANDS.includes(data.make);
  const isIconic = ICONIC_BRANDS.includes(data.make);
  const depRate = isIconic ? 0.07 : isPremium ? 0.10 : 0.15;
  const depreciationFactor = Math.max(0.25, Math.pow(1 - depRate, carAge * 0.75));

  // 2. Mileage Factor
  const avgAnnualKm = 15000;
  const expectedKm = carAge * avgAnnualKm;
  const mileageRatio = data.mileage / Math.max(expectedKm, 1);
  const mileageFactor = mileageRatio <= 1
    ? 1 + (1 - mileageRatio) * 0.05
    : Math.max(0.55, 1 - Math.pow(mileageRatio - 1, 1.4) * 0.25);

  // 3. Condition Factor (recentered: avg 75 = ~1.0 neutral)
  const condAvg = (data.conditionExterior + data.conditionInterior) / 2;
  const conditionFactor = 0.85 + (condAvg / 100) * 0.17;
  // At 50: 0.935, At 75: 0.9775, At 90: 1.003, At 100: 1.02
  const accidentPenalty = data.accidentHistory ? 0.82 : 1;

  // 4. Equipment Value Index (reduced cap: 10%)
  let equipWeightedScore = 0;
  data.equipment.forEach((eq) => {
    if (SAFETY_FEATURES.includes(eq)) equipWeightedScore += 2.5;
    else if (TECH_FEATURES.includes(eq)) equipWeightedScore += 1.8;
    else if (COMFORT_FEATURES.includes(eq)) equipWeightedScore += 1.2;
    else equipWeightedScore += 0.8;
  });
  const equipmentIndex = 1 + Math.min(equipWeightedScore * 0.003, 0.10);

  // 5. Market Position Factor (dampened)
  const highDemandBodies = ["SUV", "Hatchback"];
  const moderateDemandBodies = ["Sedan", "Wagon", "Coupe", "Convertible"];
  const bodyDemand = highDemandBodies.includes(data.bodyType) ? 1.04
    : moderateDemandBodies.includes(data.bodyType) ? 1.01 : 0.97;

  const highDemandMakes = ["Toyota", "Honda", "Porsche", "Tesla"];
  const makeDemand = highDemandMakes.includes(data.make) ? 1.03
    : PREMIUM_BRANDS.includes(data.make) ? 1.01 : 1.0;

  const marketPositionFactor = bodyDemand * makeDemand;

  // 6. Regional Demand Multiplier
  const fuelDemand: Record<string, number> = {
    "Electric": 1.05, "Plug-in Hybrid": 1.03, "Hybrid": 1.02, "Petrol": 1.0, "Diesel": 0.97,
  };
  const regionalDemandMultiplier = fuelDemand[data.fuelType] ?? 1.0;

  // 7. Transparency Score (reduced: max 4%)
  let transparencyPoints = 0;
  if (data.vin.length >= 10) transparencyPoints += 3;
  if (data.description.length > 50) transparencyPoints += 2;
  if (data.equipment.length >= 5) transparencyPoints += 1;
  if (data.color) transparencyPoints += 1;
  if (data.accidentHistory && data.accidentDetails.length > 20) transparencyPoints += 2;
  if (!data.accidentHistory) transparencyPoints += 1;
  const photoCount = data.photos?.length ?? 0;
  if (photoCount >= 8) transparencyPoints += 3;
  else if (photoCount >= 4) transparencyPoints += 2;
  else if (photoCount >= 1) transparencyPoints += 1;
  if (data.damageScanned) transparencyPoints += 3;
  const transparencyBonus = 1 + Math.min(transparencyPoints / 15, 1) * 0.04;

  // Compute raw fair value
  const computedValue = Math.round(
    data.price
    * depreciationFactor
    * mileageFactor
    * conditionFactor
    * accidentPenalty
    * equipmentIndex
    * marketPositionFactor
    * regionalDemandMultiplier
    * transparencyBonus
  );

  // Hard cap: fair value cannot exceed 105% of asking price
  const fairValue = Math.min(computedValue, Math.round(data.price * 1.05));

  // Condition Score (0-100)
  const condScore = Math.round(
    condAvg * accidentPenalty * (mileageFactor > 0.9 ? 1 : 0.9 + mileageFactor * 0.1)
  );

  // Demand Score (0-100)
  const demandScore = Math.min(100, Math.round(
    30
    + (marketPositionFactor - 0.95) * 200
    + (regionalDemandMultiplier - 0.95) * 150
    + (data.year > 2022 ? 12 : data.year > 2019 ? 6 : 0)
    + (data.mileage < 60000 ? 10 : data.mileage < 120000 ? 5 : 0)
    + Math.min(equipWeightedScore * 0.5, 10)
  ));

  return { fairValue, condScore, demandScore };
}
