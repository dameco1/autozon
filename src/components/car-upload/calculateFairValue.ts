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

/** Segment-specific annual mileage expectations (km/year) */
function getExpectedAnnualKm(bodyType: string, make: string): number {
  // Sports cars driven less
  const sportsMakes = ["Porsche", "Ferrari", "Lamborghini", "Maserati", "Alfa Romeo"];
  const sportsModels = ["Z4", "911", "Cayman", "Boxster", "TT", "SLC", "SLK"];
  if (sportsMakes.includes(make) || bodyType === "Coupe" || bodyType === "Convertible") return 8000;

  switch (bodyType) {
    case "Hatchback": return 12000;
    case "SUV": return 18000;
    case "Wagon": return 18000;
    case "Van": return 25000;
    case "Pickup": return 20000;
    case "Sedan": return 15000;
    default: return 15000;
  }
}

/**
 * Estimate a new-car reference MSRP from the car's intrinsic attributes.
 * This is intentionally independent of the user's asking price.
 */
function estimateReferenceMSRP(
  make: string,
  bodyType: string,
  powerHp: number,
  fuelType: string
): number {
  // Brand-tier base prices (approximate new-car MSRP in EUR)
  const brandBase: Record<string, number> = {
    Porsche: 85000,
    Tesla: 52000,
    "Mercedes-Benz": 50000,
    BMW: 48000,
    Audi: 45000,
    Volvo: 42000,
    Volkswagen: 32000,
    Toyota: 30000,
    Honda: 28000,
    Mazda: 28000,
    Hyundai: 27000,
    Kia: 26000,
    Skoda: 26000,
    Renault: 25000,
    Peugeot: 25000,
    Citroën: 25000,
    Ford: 28000,
    Opel: 26000,
    Seat: 24000,
    Fiat: 22000,
    Dacia: 18000,
    Nissan: 28000,
    Subaru: 32000,
    Suzuki: 22000,
    "Land Rover": 60000,
    Jaguar: 55000,
    Lexus: 50000,
    Maserati: 80000,
    "Alfa Romeo": 38000,
    Mini: 30000,
  };

  let base = brandBase[make] ?? 30000;

  // Body-type multiplier
  const bodyMultiplier: Record<string, number> = {
    SUV: 1.20,
    Coupe: 1.15,
    Convertible: 1.25,
    Wagon: 1.05,
    Sedan: 1.00,
    Hatchback: 0.90,
    Van: 0.95,
    Pickup: 1.10,
  };
  base *= bodyMultiplier[bodyType] ?? 1.0;

  // Power adjustment: scale linearly around 150 HP baseline
  const powerFactor = 1 + (powerHp - 150) * 0.0015;
  base *= Math.max(0.7, Math.min(powerFactor, 1.8));

  // Fuel-type premium
  const fuelPremium: Record<string, number> = {
    Electric: 1.12,
    "Plug-in Hybrid": 1.08,
    Hybrid: 1.04,
    Petrol: 1.0,
    Diesel: 0.98,
  };
  base *= fuelPremium[fuelType] ?? 1.0;

  return Math.round(base);
}

export function calculateFairValue(data: CarFormData, modelMsrpEur?: number | null): FairValueResult {
  const currentYear = 2026;
  const carAge = currentYear - data.year;

  // 0. Use model-specific MSRP from DB when available, otherwise estimate from attributes
  const referenceMSRP = (modelMsrpEur && modelMsrpEur > 0)
    ? modelMsrpEur
    : estimateReferenceMSRP(data.make, data.bodyType, data.powerHp, data.fuelType);

  // 1. Non-Linear Depreciation Curve (brand-tiered)
  const isPremium = PREMIUM_BRANDS.includes(data.make);
  const isIconic = ICONIC_BRANDS.includes(data.make);
  const depRate = isIconic ? 0.07 : isPremium ? 0.10 : 0.15;
  const depreciationFactor = Math.max(0.25, Math.pow(1 - depRate, carAge * 0.75));

  // 2. Mileage Factor — segment-specific expected km/year
  const avgAnnualKm = getExpectedAnnualKm(data.bodyType, data.make);
  const expectedKm = carAge * avgAnnualKm;
  const mileageRatio = data.mileage / Math.max(expectedKm, 1);
  const mileageFactor = mileageRatio <= 1
    ? 1 + (1 - mileageRatio) * 0.05
    : Math.max(0.55, 1 - Math.pow(mileageRatio - 1, 1.4) * 0.25);

  // 3. Condition Factor
  const condAvg = (data.conditionExterior + data.conditionInterior) / 2;
  const conditionFactor = 0.85 + (condAvg / 100) * 0.17;

  // 4. Damage Cost Deduction (replaces flat accident penalty)
  // Use itemized damage costs from AI detection when available,
  // fall back to flat penalty for self-reported accidents without scan
  let damageCostDeduction = 0;
  if (data.totalDamageCostEur > 0) {
    damageCostDeduction = data.totalDamageCostEur;
  } else if (data.accidentHistory) {
    // Fallback: brand-tier flat estimate when no AI scan was done
    const flatPenaltyRate = isIconic ? 0.20 : isPremium ? 0.15 : 0.10;
    damageCostDeduction = referenceMSRP * depreciationFactor * flatPenaltyRate;
  }

  // 5. Equipment Value Index (capped at 10%)
  let equipWeightedScore = 0;
  data.equipment.forEach((eq) => {
    if (SAFETY_FEATURES.includes(eq)) equipWeightedScore += 2.5;
    else if (TECH_FEATURES.includes(eq)) equipWeightedScore += 1.8;
    else if (COMFORT_FEATURES.includes(eq)) equipWeightedScore += 1.2;
    else equipWeightedScore += 0.8;
  });
  const equipmentIndex = 1 + Math.min(equipWeightedScore * 0.003, 0.10);

  // 6. Market Position Factor
  const highDemandBodies = ["SUV", "Hatchback"];
  const moderateDemandBodies = ["Sedan", "Wagon", "Coupe", "Convertible"];
  const bodyDemand = highDemandBodies.includes(data.bodyType) ? 1.04
    : moderateDemandBodies.includes(data.bodyType) ? 1.01 : 0.97;

  const highDemandMakes = ["Toyota", "Honda", "Porsche", "Tesla"];
  const makeDemand = highDemandMakes.includes(data.make) ? 1.03
    : PREMIUM_BRANDS.includes(data.make) ? 1.01 : 1.0;

  const marketPositionFactor = bodyDemand * makeDemand;

  // 7. Regional Demand Multiplier
  const fuelDemand: Record<string, number> = {
    "Electric": 1.05, "Plug-in Hybrid": 1.03, "Hybrid": 1.02, "Petrol": 1.0, "Diesel": 0.97,
  };
  const regionalDemandMultiplier = fuelDemand[data.fuelType] ?? 1.0;

  // 8. Transparency Score (max 4%)
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

  // Compute 100% attribute-based fair value (NO asking price influence)
  const attributeValue = Math.round(
    referenceMSRP
    * depreciationFactor
    * mileageFactor
    * conditionFactor
    * equipmentIndex
    * marketPositionFactor
    * regionalDemandMultiplier
    * transparencyBonus
  );

  // Subtract itemized damage costs as a EUR deduction
  const fairValue = Math.max(500, attributeValue - Math.round(damageCostDeduction));

  // Condition Score (0-100)
  const damagePenaltyFactor = damageCostDeduction > 0
    ? Math.max(0.5, 1 - damageCostDeduction / attributeValue)
    : 1;
  const condScore = Math.round(
    condAvg * damagePenaltyFactor * (mileageFactor > 0.9 ? 1 : 0.9 + mileageFactor * 0.1)
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
