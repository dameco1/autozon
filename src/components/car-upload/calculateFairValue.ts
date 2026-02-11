import type { CarFormData } from "./types";

interface FairValueResult {
  fairValue: number;
  condScore: number;
  demandScore: number;
}

const PREMIUM_BRANDS = ["Porsche", "Mercedes-Benz", "BMW", "Audi", "Tesla", "Volvo"];
const SAFETY_FEATURES = ["Adaptive Cruise Control", "Lane Assist", "Blind Spot Monitor", "360° Camera", "Parking Sensors", "Backup Camera"];
const TECH_FEATURES = ["Navigation", "Apple CarPlay", "Android Auto", "Heads-Up Display", "LED Headlights"];
const COMFORT_FEATURES = ["Heated Seats", "Leather Interior", "Sunroof", "Cruise Control", "Keyless Entry", "Seat Memory", "Heated Steering Wheel"];

export function calculateFairValue(data: CarFormData): FairValueResult {
  const currentYear = 2026;
  const carAge = currentYear - data.year;

  // 1. Non-Linear Depreciation Curve
  const isPremium = PREMIUM_BRANDS.includes(data.make);
  const depRate = isPremium ? 0.12 : 0.18;
  const depreciationFactor = Math.max(0.25, Math.pow(1 - depRate, Math.sqrt(carAge * 1.8)));

  // 2. Mileage Factor
  const avgAnnualKm = 15000;
  const expectedKm = carAge * avgAnnualKm;
  const mileageRatio = data.mileage / Math.max(expectedKm, 1);
  const mileageFactor = mileageRatio <= 1
    ? 1 + (1 - mileageRatio) * 0.08
    : Math.max(0.55, 1 - Math.pow(mileageRatio - 1, 1.4) * 0.25);

  // 3. Condition Factor
  const condAvg = (data.conditionExterior + data.conditionInterior) / 2;
  const conditionFactor = 0.6 + (condAvg / 100) * 0.4;
  const accidentPenalty = data.accidentHistory ? 0.82 : 1;

  // 4. Equipment Value Index
  let equipWeightedScore = 0;
  data.equipment.forEach((eq) => {
    if (SAFETY_FEATURES.includes(eq)) equipWeightedScore += 3;
    else if (TECH_FEATURES.includes(eq)) equipWeightedScore += 2;
    else if (COMFORT_FEATURES.includes(eq)) equipWeightedScore += 1.5;
    else equipWeightedScore += 1;
  });
  const equipmentIndex = 1 + Math.min(equipWeightedScore * 0.003, 0.15);

  // 5. Market Position Factor
  const highDemandBodies = ["SUV", "Hatchback"];
  const moderateDemandBodies = ["Sedan", "Wagon"];
  const bodyDemand = highDemandBodies.includes(data.bodyType) ? 1.06
    : moderateDemandBodies.includes(data.bodyType) ? 1.02 : 0.97;

  const highDemandMakes = ["Toyota", "Honda", "Porsche", "Tesla"];
  const makeDemand = highDemandMakes.includes(data.make) ? 1.05
    : PREMIUM_BRANDS.includes(data.make) ? 1.02 : 1.0;

  const marketPositionFactor = bodyDemand * makeDemand;

  // 6. Regional Demand Multiplier
  const fuelDemand: Record<string, number> = {
    "Electric": 1.08, "Plug-in Hybrid": 1.05, "Hybrid": 1.04, "Petrol": 1.0, "Diesel": 0.95,
  };
  const regionalDemandMultiplier = fuelDemand[data.fuelType] ?? 1.0;

  // 7. Transparency Score
  let transparencyPoints = 0;
  if (data.vin.length >= 10) transparencyPoints += 3;
  if (data.description.length > 50) transparencyPoints += 2;
  if (data.equipment.length >= 5) transparencyPoints += 1;
  if (data.color) transparencyPoints += 1;
  if (data.accidentHistory && data.accidentDetails.length > 20) transparencyPoints += 2;
  if (!data.accidentHistory) transparencyPoints += 1;
  // Photo count bonus: up to 3 points for uploading multiple photos
  const photoCount = data.photos?.length ?? 0;
  if (photoCount >= 8) transparencyPoints += 3;
  else if (photoCount >= 4) transparencyPoints += 2;
  else if (photoCount >= 1) transparencyPoints += 1;
  // Damage scan bonus: cars that completed AI scan get extra trust
  if (data.damageScanned) transparencyPoints += 3;
  const transparencyBonus = 1 + Math.min(transparencyPoints / 15, 1) * 0.07;

  // Final Fair Value
  const fairValue = Math.round(
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
