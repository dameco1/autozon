import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** VINCARIO control-sum = first 10 chars of SHA-1( VIN|id|apiKey|secretKey ) */
async function controlSum(vin: string, id: string, apiKey: string, secretKey: string): Promise<string> {
  const raw = `${vin.toUpperCase()}|${id}|${apiKey}|${secretKey}`;
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(raw));
  const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex.substring(0, 10);
}

/** Map VINCARIO body_type strings to our canonical set */
function normalizeBodyType(raw: string | undefined): string {
  if (!raw) return "Sedan";
  const lower = raw.toLowerCase();
  if (lower.includes("suv") || lower.includes("sport utility")) return "SUV";
  if (lower.includes("hatch")) return "Hatchback";
  if (lower.includes("wagon") || lower.includes("estate") || lower.includes("touring") || lower.includes("avant") || lower.includes("kombi")) return "Wagon";
  if (lower.includes("coupe") || lower.includes("coupé")) return "Coupe";
  if (lower.includes("convert") || lower.includes("cabrio") || lower.includes("roadster") || lower.includes("spider") || lower.includes("spyder")) return "Convertible";
  if (lower.includes("van") || lower.includes("mpv") || lower.includes("minivan")) return "Van";
  if (lower.includes("pickup") || lower.includes("truck")) return "Pickup";
  if (lower.includes("sedan") || lower.includes("saloon") || lower.includes("limousine")) return "Sedan";
  return "Sedan";
}

/** Map VINCARIO fuel strings to our canonical set */
function normalizeFuelType(raw: string | undefined): string {
  if (!raw) return "Petrol";
  const lower = raw.toLowerCase();
  if (lower.includes("electric") && !lower.includes("hybrid")) return "Electric";
  if (lower.includes("plug-in") || lower.includes("phev")) return "Plug-in Hybrid";
  if (lower.includes("hybrid")) return "Hybrid";
  if (lower.includes("diesel")) return "Diesel";
  return "Petrol";
}

/** Map VINCARIO transmission strings to our canonical set */
function normalizeTransmission(raw: string | undefined): string {
  if (!raw) return "Manual";
  const lower = raw.toLowerCase();
  if (lower.includes("auto") || lower.includes("dct") || lower.includes("cvt") || lower.includes("dsg") || lower.includes("tiptronic") || lower.includes("s-tronic") || lower.includes("steptronic") || lower.includes("pdk")) return "Automatic";
  return "Manual";
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { vin } = await req.json();
    if (!vin || typeof vin !== "string" || vin.length < 11) {
      return new Response(
        JSON.stringify({ error: "A valid VIN (at least 11 characters) is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const VINCARIO_API_KEY = Deno.env.get("VINCARIO_API_KEY");
    const VINCARIO_SECRET_KEY = Deno.env.get("VINCARIO_SECRET_KEY");
    if (!VINCARIO_API_KEY || !VINCARIO_SECRET_KEY) {
      throw new Error("VINCARIO credentials are not configured");
    }

    // --- 1. Call VINCARIO "info" endpoint (free, returns basic decoded attributes) ---
    const infoId = "info";
    const infoCs = await controlSum(vin, infoId, VINCARIO_API_KEY, VINCARIO_SECRET_KEY);
    const infoUrl = `https://api.vincario.com/3.2/${infoId}/${VINCARIO_API_KEY}/${infoCs}/${vin.toUpperCase()}`;

    const infoRes = await fetch(infoUrl);
    if (!infoRes.ok) {
      const errText = await infoRes.text();
      console.error("VINCARIO info error:", infoRes.status, errText);
      if (infoRes.status === 403 || infoRes.status === 401) {
        return new Response(
          JSON.stringify({ error: "VINCARIO authentication failed. Check API credentials." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "VIN decode failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const infoData = await infoRes.json();

    // --- 2. Call VINCARIO "decode" endpoint (paid, returns full specs + equipment) ---
    const decodeId = "decode";
    const decodeCs = await controlSum(vin, decodeId, VINCARIO_API_KEY, VINCARIO_SECRET_KEY);
    const decodeUrl = `https://api.vincario.com/3.2/${decodeId}/${VINCARIO_API_KEY}/${decodeCs}/${vin.toUpperCase()}`;

    const decodeRes = await fetch(decodeUrl);
    let decodeData: Record<string, unknown> | null = null;
    if (decodeRes.ok) {
      decodeData = await decodeRes.json();
    } else {
      // Consume body to prevent leak, continue with info-only data
      await decodeRes.text();
      console.warn("VINCARIO decode call failed, using info-only data:", decodeRes.status);
    }

    // --- 3. Merge & normalize into our schema ---
    const merged = { ...infoData, ...(decodeData || {}) };

    const make = (merged.Make || merged.make || "") as string;
    const model = (merged.Model || merged.model || "") as string;
    const year = Number(merged["Model Year"] || merged.model_year || merged["Production Year"] || merged.year || 0);
    const bodyType = normalizeBodyType((merged["Body Type"] || merged.body_type || merged["Body Style"] || "") as string);
    const fuelType = normalizeFuelType((merged["Fuel Type"] || merged.fuel_type || merged["Fuel Type - Primary"] || "") as string);
    const transmission = normalizeTransmission((merged["Transmission"] || merged.transmission || "") as string);
    
    // Power: try multiple fields
    let powerHp = 0;
    const powerKw = Number(merged["Engine Power (kW)"] || merged["Power (kW)"] || 0);
    const powerHpRaw = Number(merged["Engine Power (HP)"] || merged["Power (HP)"] || merged["Horsepower"] || 0);
    if (powerHpRaw > 0) {
      powerHp = powerHpRaw;
    } else if (powerKw > 0) {
      powerHp = Math.round(powerKw * 1.341);
    }

    // Equipment: extract from decode data
    const suggestedEquipment: string[] = [];
    if (decodeData) {
      // VINCARIO returns equipment as an array or object
      const equip = decodeData["Equipment"] || decodeData["equipment"] || decodeData["Standard Equipment"] || [];
      if (Array.isArray(equip)) {
        suggestedEquipment.push(...equip.map((e: unknown) => typeof e === "string" ? e : String(e)));
      } else if (typeof equip === "object" && equip !== null) {
        suggestedEquipment.push(...Object.values(equip).map((e) => String(e)));
      }
    }

    const result = {
      make,
      model,
      year,
      body_type: bodyType,
      fuel_type: fuelType,
      transmission,
      power_hp: powerHp,
      suggested_equipment: suggestedEquipment,
      confidence: (make && model && year) ? "high" : "medium",
      notes: decodeData
        ? "Data sourced from VINCARIO vehicle database."
        : "Partial data from VINCARIO info endpoint. Full decode unavailable.",
      source: "vincario",
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("vin-decode error:", e);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
