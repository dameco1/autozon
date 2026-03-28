import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * VINCARIO control-sum = first 10 chars of SHA-1( VIN|id|apiKey|secretKey )
 * VIN must be UPPER CASE. id = "info" | "decode" | "stolen-check" etc.
 */
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

    const upperVin = vin.toUpperCase();

    // --- 1. Call VINCARIO "decode/info" endpoint (free, basic decoded attributes) ---
    const infoCs = await controlSum(upperVin, "info", VINCARIO_API_KEY, VINCARIO_SECRET_KEY);
    const infoUrl = `https://api.vincario.com/3.2/${VINCARIO_API_KEY}/${infoCs}/decode/info/${upperVin}.json`;

    console.log("VINCARIO info URL:", infoUrl);
    const infoRes = await fetch(infoUrl);
    const infoText = await infoRes.text();

    if (!infoRes.ok) {
      console.error("VINCARIO info error:", infoRes.status, infoText.substring(0, 500));
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

    let infoData: Record<string, unknown>;
    try {
      infoData = JSON.parse(infoText);
    } catch {
      console.error("VINCARIO info parse error:", infoText.substring(0, 500));
      return new Response(
        JSON.stringify({ error: "Invalid response from VIN database" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- 2. Call VINCARIO "decode" endpoint (paid, full specs + equipment) ---
    const decodeCs = await controlSum(upperVin, "decode", VINCARIO_API_KEY, VINCARIO_SECRET_KEY);
    const decodeUrl = `https://api.vincario.com/3.2/${VINCARIO_API_KEY}/${decodeCs}/decode/${upperVin}.json`;

    console.log("VINCARIO decode URL:", decodeUrl);
    const decodeRes = await fetch(decodeUrl);
    const decodeText = await decodeRes.text();

    let decodeData: Record<string, unknown> | null = null;
    if (decodeRes.ok) {
      try {
        decodeData = JSON.parse(decodeText);
      } catch {
        console.warn("VINCARIO decode parse error, using info-only");
      }
    } else {
      console.warn("VINCARIO decode call failed:", decodeRes.status, decodeText.substring(0, 300));
    }

    // --- 3. Merge & normalize into our schema ---
    // VINCARIO returns data as array of {label, value} or flat object depending on version
    // Handle both formats
    let merged: Record<string, unknown> = {};

    // If infoData has a "decode" array, flatten it
    const infoArr = (infoData as Record<string, unknown>)["decode"];
    if (Array.isArray(infoArr)) {
      for (const item of infoArr) {
        if (item && typeof item === "object" && "label" in item && "value" in item) {
          merged[(item as Record<string, unknown>).label as string] = (item as Record<string, unknown>).value;
        }
      }
    } else {
      merged = { ...infoData };
    }

    // Overlay decode data
    if (decodeData) {
      const decodeArr = (decodeData as Record<string, unknown>)["decode"];
      if (Array.isArray(decodeArr)) {
        for (const item of decodeArr) {
          if (item && typeof item === "object" && "label" in item && "value" in item) {
            merged[(item as Record<string, unknown>).label as string] = (item as Record<string, unknown>).value;
          }
        }
      } else {
        merged = { ...merged, ...decodeData };
      }
    }

    console.log("VINCARIO merged keys:", Object.keys(merged).join(", "));

    const make = String(merged["Make"] || merged["make"] || "");
    const model = String(merged["Model"] || merged["model"] || "");
    const year = Number(merged["Model Year"] || merged["model_year"] || merged["Production Year"] || merged["year"] || 0);
    const bodyType = normalizeBodyType(String(merged["Body"] || merged["Body Type"] || merged["body_type"] || merged["Body Style"] || ""));
    const fuelType = normalizeFuelType(String(merged["Fuel Type - Primary"] || merged["Fuel Type"] || merged["fuel_type"] || ""));
    const transmission = normalizeTransmission(String(merged["Transmission"] || merged["transmission"] || ""));

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
    const equip = merged["Equipment"] || merged["equipment"] || merged["Standard Equipment"] || [];
    if (Array.isArray(equip)) {
      suggestedEquipment.push(...equip.map((e: unknown) => typeof e === "string" ? e : String(e)));
    } else if (typeof equip === "string" && equip.length > 0) {
      suggestedEquipment.push(...equip.split(",").map((s: string) => s.trim()).filter(Boolean));
    } else if (typeof equip === "object" && equip !== null) {
      suggestedEquipment.push(...Object.values(equip as Record<string, unknown>).map((e) => String(e)));
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
