/**
 * Lifestyle-aware car matching algorithm.
 *
 * Scores each candidate car against the buyer's profile & preferences.
 * Returns 0-100. Higher = better match.
 *
 * Signal sources:
 *  - Profile: relationship_status, has_kids, num_kids, car_purpose, current_car, budget_max
 *  - Preferences: family_size, usage_pattern, commute_distance, parking_type,
 *                 ownership_preference, insurance_tolerance, budget range,
 *                 preferred_makes/fuel_types/body_types/transmission
 */

// ── Types ──────────────────────────────────────────────────────────

export interface ProfileSignals {
  relationship_status?: string | null;
  has_kids?: boolean | null;
  num_kids?: number | null;
  car_purpose?: string | null;
  current_car?: string | null;
  budget_max?: number | null;
}

export interface PreferenceSignals {
  family_size?: number | null;
  usage_pattern?: string | null;
  commute_distance?: string | null;
  parking_type?: string | null;
  ownership_preference?: string | null;
  insurance_tolerance?: string | null;
  min_budget?: number | null;
  max_budget?: number | null;
  min_year?: number | null;
  max_year?: number | null;
  max_mileage?: number | null;
  min_power_hp?: number | null;
  preferred_makes?: string[] | null;
  preferred_fuel_types?: string[] | null;
  preferred_body_types?: string[] | null;
  preferred_transmission?: string | null;
  sports?: string[] | null;
  needs_towing?: boolean | null;
  towing_weight_kg?: number | null;
}

export interface CarCandidate {
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fair_value_price: number | null;
  fuel_type: string;
  transmission: string;
  body_type: string;
  power_hp: number | null;
  condition_score: number | null;
  demand_score: number | null;
  equipment?: string[] | null;
}

// ── Body-type groupings ────────────────────────────────────────────

const SPORTY_BODIES = ["Coupe", "Convertible", "Roadster"];
const COMPACT_BODIES = ["Hatchback", "Sedan", "Coupe"];
const FAMILY_BODIES = ["SUV", "Wagon", "Sedan", "Hatchback"];
const LARGE_FAMILY_BODIES = ["Van", "SUV", "Wagon", "Pickup"];
// 6/7-seater indicators — body types that commonly come with extra rows
const PEOPLE_CARRIER_BODIES = ["Van", "SUV"];

// Premium / sporty brands for "treat yourself" logic
const SPORTY_MAKES = new Set(["BMW", "Porsche", "Mercedes-Benz", "Audi", "Jaguar", "Alfa Romeo", "Maserati", "MINI"]);
const PRACTICAL_MAKES = new Set(["Toyota", "Honda", "Volkswagen", "Skoda", "Kia", "Hyundai", "Dacia", "Mazda"]);

// ── Main scorer ────────────────────────────────────────────────────

export function computeMatchScore(
  car: CarCandidate,
  profile: ProfileSignals | null,
  prefs: PreferenceSignals | null,
): number {
  let lifestyleScore = 50;
  let financialScore = 50;
  let preferenceScore = 50;
  const conditionScore = ((car.condition_score ?? 50) + (car.demand_score ?? 50)) / 2;

  // ─── 1. Financial fit (from preferences) ─────────────────────
  if (prefs) {
    const minB = prefs.min_budget ?? 0;
    const maxB = prefs.max_budget ?? 999_999;
    if (car.price >= minB && car.price <= maxB) {
      // Sweet-spot bonus: closer to the middle of budget = slightly better
      const midBudget = (minB + maxB) / 2;
      const range = (maxB - minB) / 2 || 1;
      const distFromMid = Math.abs(car.price - midBudget) / range; // 0..1
      financialScore = 85 + Math.round((1 - distFromMid) * 15); // 85-100
    } else {
      const diff = Math.min(
        Math.abs(car.price - minB),
        Math.abs(car.price - maxB),
      );
      financialScore = Math.max(10, 80 - Math.round(diff / 500));
    }
  } else if (profile?.budget_max) {
    // Fall back to profile budget
    if (car.price <= profile.budget_max) {
      financialScore = 90;
    } else {
      const over = car.price - profile.budget_max;
      financialScore = Math.max(10, 90 - Math.round(over / 500));
    }
  }

  // ─── 2. Lifestyle score (from profile signals) ───────────────
  if (profile) {
    let ls = 50;

    // ── Relationship-based body-type affinity ──
    const rel = profile.relationship_status;
    if (rel === "single") {
      // Singles → sporty coupes, convertibles, compact hatchbacks
      if (SPORTY_BODIES.includes(car.body_type)) ls += 25;
      else if (COMPACT_BODIES.includes(car.body_type)) ls += 15;
      else if (LARGE_FAMILY_BODIES.includes(car.body_type)) ls -= 10;
      // Sporty brands bonus
      if (SPORTY_MAKES.has(car.make)) ls += 8;
      // Higher power preference for singles
      if ((car.power_hp ?? 0) >= 200) ls += 5;
    } else if (rel === "married") {
      // Married → practical family cars, SUVs, wagons
      if (FAMILY_BODIES.includes(car.body_type)) ls += 20;
      else if (SPORTY_BODIES.includes(car.body_type)) ls -= 5;
      // Practical brands bonus
      if (PRACTICAL_MAKES.has(car.make)) ls += 5;
      // Prefer newer, safer cars
      if (car.year >= 2020) ls += 5;
    } else if (rel === "divorced") {
      // Divorced → sporty "new chapter" cars, premium brands
      if (SPORTY_BODIES.includes(car.body_type)) ls += 20;
      else if (car.body_type === "SUV") ls += 10; // sporty SUV works too
      if (SPORTY_MAKES.has(car.make)) ls += 12;
      if ((car.power_hp ?? 0) >= 180) ls += 8;
      // Slight penalty for minivans — moving on from family phase
      if (car.body_type === "Van") ls -= 15;
    }

    // ── Kids-based body-type logic ──
    const numKids = profile.num_kids ?? (profile.has_kids ? 1 : 0);
    if (numKids === 0) {
      // No kids: any body type is fine, slight preference for compact
      if (COMPACT_BODIES.includes(car.body_type)) ls += 5;
    } else if (numKids >= 1 && numKids <= 2) {
      // 1-2 kids: need 4-5 door cars
      if (["Sedan", "SUV", "Wagon", "Hatchback"].includes(car.body_type)) ls += 15;
      if (SPORTY_BODIES.includes(car.body_type)) ls -= 15; // 2-door coupes impractical
    } else if (numKids >= 3) {
      // 3+ kids: need 6/7 seaters, minivans, large SUVs
      if (PEOPLE_CARRIER_BODIES.includes(car.body_type)) ls += 30;
      else if (car.body_type === "Wagon") ls += 15;
      // Strong penalty for small cars
      if (SPORTY_BODIES.includes(car.body_type) || car.body_type === "Hatchback") ls -= 20;
    }

    // ── Purpose-based scoring ──
    const purpose = profile.car_purpose;
    if (purpose === "daily") {
      // Daily driver: reliability, fuel efficiency
      if (PRACTICAL_MAKES.has(car.make)) ls += 8;
      if (["Diesel", "Hybrid", "Electric"].includes(car.fuel_type)) ls += 5;
      if (car.year >= 2018) ls += 3;
    } else if (purpose === "work") {
      // Work/commute: comfort, diesel/hybrid efficiency
      if (["Sedan", "SUV", "Wagon"].includes(car.body_type)) ls += 10;
      if (["Diesel", "Hybrid", "Plug-in Hybrid"].includes(car.fuel_type)) ls += 8;
      if (car.transmission === "Automatic") ls += 5;
    } else if (purpose === "pleasure") {
      // Pleasure/weekend: sporty, fun
      if (SPORTY_BODIES.includes(car.body_type)) ls += 20;
      if (SPORTY_MAKES.has(car.make)) ls += 10;
      if ((car.power_hp ?? 0) >= 200) ls += 8;
    } else if (purpose === "summer") {
      // Summer car: convertibles, coupes
      if (car.body_type === "Convertible" || car.body_type === "Roadster") ls += 30;
      else if (car.body_type === "Coupe") ls += 15;
    } else if (purpose === "winter") {
      // Winter car: AWD-friendly SUVs, practical
      if (["SUV", "Wagon"].includes(car.body_type)) ls += 20;
      if (car.fuel_type === "Diesel") ls += 5;
    }

    // ── Current car brand affinity ──
    // If user told us their current car, boost same-brand or similar-segment matches
    if (profile.current_car) {
      const currentLower = profile.current_car.toLowerCase();
      const carMakeLower = car.make.toLowerCase();
      // Brand loyalty: if current car mentions the same make
      if (currentLower.includes(carMakeLower)) {
        ls += 10; // brand loyalty bonus
      }
      // Upgrade detection: if current car is a budget brand, suggest premium upgrade
      const budgetBrands = ["dacia", "fiat", "opel", "renault", "peugeot", "citroen", "seat"];
      const premiumBrands = ["bmw", "mercedes", "audi", "volvo", "lexus"];
      const isCurrentBudget = budgetBrands.some((b) => currentLower.includes(b));
      const isCarPremium = premiumBrands.some((b) => carMakeLower.includes(b));
      if (isCurrentBudget && isCarPremium) {
        ls += 8; // upgrade path bonus
      }
      // Same segment continuity: if current car mentions SUV/wagon keywords
      const suvsKeywords = ["suv", "x3", "x5", "q5", "q7", "tucson", "tiguan", "rav4", "crv"];
      const isSuvUser = suvsKeywords.some((k) => currentLower.includes(k));
      if (isSuvUser && ["SUV", "Wagon"].includes(car.body_type)) {
        ls += 10; // segment continuity bonus
      }
    }

    lifestyleScore = Math.max(0, Math.min(100, ls));
  }

  // ─── 3. Preference match (explicit filters → bonus) ──────────
  if (prefs) {
    let ps = 50;

    // Make preference
    if (prefs.preferred_makes && prefs.preferred_makes.length > 0) {
      ps += prefs.preferred_makes.includes(car.make) ? 20 : -10;
    }
    // Fuel preference
    if (prefs.preferred_fuel_types && prefs.preferred_fuel_types.length > 0) {
      ps += prefs.preferred_fuel_types.includes(car.fuel_type) ? 15 : -5;
    }
    // Body type preference
    if (prefs.preferred_body_types && prefs.preferred_body_types.length > 0) {
      ps += prefs.preferred_body_types.includes(car.body_type) ? 15 : -5;
    }
    // Transmission
    if (prefs.preferred_transmission && prefs.preferred_transmission !== "") {
      ps += prefs.preferred_transmission === car.transmission ? 10 : -5;
    }

    // Family size (from onboarding) — reinforce body type logic
    const famSize = prefs.family_size ?? 1;
    if (famSize >= 5 && PEOPLE_CARRIER_BODIES.includes(car.body_type)) ps += 10;
    if (famSize >= 4 && LARGE_FAMILY_BODIES.includes(car.body_type)) ps += 8;
    if (famSize <= 2 && COMPACT_BODIES.includes(car.body_type)) ps += 5;

    // Usage pattern
    if (prefs.usage_pattern === "daily") {
      if (["Diesel", "Hybrid", "Electric"].includes(car.fuel_type)) ps += 5;
    } else if (prefs.usage_pattern === "weekend") {
      if (SPORTY_BODIES.includes(car.body_type)) ps += 8;
    }

    // Commute distance → fuel efficiency
    if (prefs.commute_distance === "long" || prefs.commute_distance === "veryLong") {
      if (["Diesel", "Hybrid", "Plug-in Hybrid"].includes(car.fuel_type)) ps += 8;
      if (car.transmission === "Automatic") ps += 3;
    } else if (prefs.commute_distance === "short") {
      if (["Electric", "Hybrid"].includes(car.fuel_type)) ps += 10;
    }

    // Parking type → size penalty
    if (prefs.parking_type === "street" || prefs.parking_type === "underground") {
      // Tight parking: smaller cars bonus
      if (["Hatchback", "Sedan"].includes(car.body_type)) ps += 5;
      if (car.body_type === "Van" || car.body_type === "Pickup") ps -= 5;
    }

    // Insurance tolerance → power/brand penalty
    if (prefs.insurance_tolerance === "low") {
      if ((car.power_hp ?? 0) > 200) ps -= 8;
      if (SPORTY_MAKES.has(car.make)) ps -= 5;
    } else if (prefs.insurance_tolerance === "high") {
      if ((car.power_hp ?? 0) > 200) ps += 5;
    }

    preferenceScore = Math.max(0, Math.min(100, ps));
  }

  // ─── 4. Sports & towing lifestyle sub-score ──────────────────
  let sportsScore = -1; // -1 = not applicable (user didn't set sports)
  if (prefs && prefs.sports && prefs.sports.length > 0) {
    let ss = 50;
    const equip = (car.equipment ?? []).map(e => e.toLowerCase());
    const bt = car.body_type;

    // Storage fit (40% weight of sub-score) — bulky sports need cargo space
    const bulkySports = new Set(["Cycling", "Skiing", "Surfing", "Golf", "Camping"]);
    const hasBulky = prefs.sports.some(s => bulkySports.has(s));
    if (hasBulky) {
      if (["SUV", "Wagon", "Van"].includes(bt)) ss += 20;
      else if (["Sedan", "Hatchback"].includes(bt)) ss += 5;
      else if (["Coupe", "Convertible", "Roadster"].includes(bt)) ss -= 15;
    }

    // Roofbox compatibility (20%) — check for roof rails/rack in equipment
    const hasRoofMount = equip.some(e => e.includes("roof rail") || e.includes("roof rack") || e.includes("roof bar"));
    if (hasBulky && hasRoofMount) ss += 15;
    else if (hasBulky && !hasRoofMount && ["Coupe", "Convertible"].includes(bt)) ss -= 10;

    // Towing capability (20%)
    if (prefs.needs_towing) {
      const hasTowbar = equip.some(e => e.includes("trailer hitch") || e.includes("tow bar") || e.includes("towbar") || e.includes("anhängerkupplung"));
      if (hasTowbar) {
        ss += 15;
      } else {
        // Body-type based towing likelihood
        if (["SUV", "Pickup", "Van"].includes(bt)) ss += 5;
        else if (["Coupe", "Convertible", "Hatchback"].includes(bt)) ss -= 10;
      }
      // Weight class penalty: lightweight cars can't tow heavy loads
      const desiredWeight = prefs.towing_weight_kg ?? 750;
      if (desiredWeight >= 2500 && !["SUV", "Pickup", "Van"].includes(bt)) ss -= 10;
    }

    // Body type suitability (20%) — outdoor sports benefit from SUV/Wagon
    const outdoorSports = new Set(["Cycling", "Skiing", "Running", "Hiking", "Surfing", "Camping"]);
    const hasOutdoor = prefs.sports.some(s => outdoorSports.has(s));
    if (hasOutdoor) {
      if (["SUV", "Wagon", "Pickup"].includes(bt)) ss += 10;
      else if (["Coupe", "Convertible"].includes(bt)) ss -= 8;
    }

    // Motorsports → sporty cars
    if (prefs.sports.includes("Motorsports")) {
      if (SPORTY_BODIES.includes(bt) || SPORTY_MAKES.has(car.make)) ss += 12;
      if ((car.power_hp ?? 0) >= 200) ss += 5;
    }

    sportsScore = Math.max(0, Math.min(100, ss));
  }

  // ─── Final weighted blend ────────────────────────────────────
  // If sports scoring is active, adjust weights:
  // 25% lifestyle + 25% financial + 20% preference + 10% condition + 20% sports
  // Otherwise: 30% lifestyle + 30% financial + 25% preference + 15% condition
  let final: number;
  if (sportsScore >= 0) {
    final = Math.min(
      100,
      Math.round(
        0.25 * lifestyleScore +
        0.25 * financialScore +
        0.20 * preferenceScore +
        0.10 * conditionScore +
        0.20 * sportsScore,
      ),
    );
    // Deprioritize cars scoring very low on sports dimension
    if (sportsScore < 30) final = Math.max(5, final - 10);
  } else {
    final = Math.min(
      100,
      Math.round(
        0.30 * lifestyleScore +
        0.30 * financialScore +
        0.25 * preferenceScore +
        0.15 * conditionScore,
      ),
    );
  }

  return final;
}
