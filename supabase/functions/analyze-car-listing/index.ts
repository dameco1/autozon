import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { imageUrls, documentUrls, language } = await req.json();

    if ((!imageUrls || imageUrls.length === 0) && (!documentUrls || documentUrls.length === 0)) {
      return new Response(JSON.stringify({ error: "No files provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allUrls = [...(imageUrls || []), ...(documentUrls || [])];
    if (allUrls.length > 30) {
      return new Response(JSON.stringify({ error: "Too many files. Maximum 30 allowed." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lang = language === "de" ? "German" : "English";

    // Build image content parts for all uploaded files
    const imageContent = allUrls.map((url: string) => ({
      type: "image_url" as const,
      image_url: { url },
    }));

    // Step 1: Extract vehicle data from all images/documents using tool calling
    const extractionResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are an expert automotive data extraction system. Analyze uploaded car photos and registration documents to extract ALL vehicle information.

RULES:
- Extract data ONLY from what you can clearly see or read in the images/documents
- If a field is not visible or readable, set its value to null and source to "not_found"
- If a field is partially visible or you're not confident, set source to "uncertain"
- If clearly readable, set source to "extracted"
- NEVER guess or hallucinate data
- For registration documents (Zulassungsschein/Fahrzeugschein), read all fields carefully
- For photos, identify make/model from badges, color from body, assess condition visually
- Detect ALL visible damages from the photos
- Respond ONLY with the function call`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze these car photos and documents. Extract all vehicle data, detect any damages, and assess overall condition.",
              },
              ...imageContent,
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_vehicle_data",
              description: "Extract all vehicle data from photos and documents",
              parameters: {
                type: "object",
                properties: {
                  vehicle: {
                    type: "object",
                    properties: {
                      make: { type: "object", properties: { value: { type: "string" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      model: { type: "object", properties: { value: { type: "string" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      year: { type: "object", properties: { value: { type: "number" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      vin: { type: "object", properties: { value: { type: "string" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      mileage: { type: "object", properties: { value: { type: "number" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      fuel_type: { type: "object", properties: { value: { type: "string" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      transmission: { type: "object", properties: { value: { type: "string" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      body_type: { type: "object", properties: { value: { type: "string" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      color: { type: "object", properties: { value: { type: "string" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      power_hp: { type: "object", properties: { value: { type: "number" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      first_registration_month: { type: "object", properties: { value: { type: "number" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      first_registration_year: { type: "object", properties: { value: { type: "number" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                      num_owners: { type: "object", properties: { value: { type: "number" }, source: { type: "string", enum: ["extracted", "uncertain", "not_found"] } }, required: ["value", "source"] },
                    },
                    required: ["make", "model", "year", "vin", "mileage", "fuel_type", "transmission", "body_type", "color", "power_hp"],
                  },
                  damages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["scratch", "dent", "rust", "crack", "paint_damage", "broken_part", "wear", "other"] },
                        location: { type: "string" },
                        severity: { type: "string", enum: ["low", "medium", "high"] },
                        confidence: { type: "number" },
                        description: { type: "string" },
                        estimated_repair_cost_eur: { type: "number" },
                      },
                      required: ["type", "location", "severity", "confidence", "description", "estimated_repair_cost_eur"],
                    },
                  },
                  overall_condition: { type: "string", enum: ["excellent", "good", "fair", "poor"] },
                  condition_exterior: { type: "number", description: "Exterior condition score 0-100" },
                  condition_interior: { type: "number", description: "Interior condition score 0-100" },
                  condition_summary: { type: "string" },
                  detected_equipment: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of equipment/features visible in photos",
                  },
                },
                required: ["vehicle", "damages", "overall_condition", "condition_exterior", "condition_interior", "condition_summary", "detected_equipment"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_vehicle_data" } },
      }),
    });

    if (!extractionResponse.ok) {
      if (extractionResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (extractionResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI extraction error:", extractionResponse.status);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const extractionData = await extractionResponse.json();
    const toolCall = extractionData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      return new Response(JSON.stringify({ error: "AI could not extract vehicle data" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const extraction = JSON.parse(toolCall.function.arguments);

    // Compute fair value using extracted data
    const v = extraction.vehicle;
    const make = v.make?.value || "Unknown";
    const model = v.model?.value || "Unknown";
    const year = v.year?.value || new Date().getFullYear();
    const mileage = v.mileage?.value || 0;
    const fuelType = v.fuel_type?.value || "Petrol";
    const bodyType = v.body_type?.value || "Sedan";
    const powerHp = v.power_hp?.value || 100;
    const condExterior = extraction.condition_exterior || 80;
    const condInterior = extraction.condition_interior || 80;
    const totalDamageCost = (extraction.damages || []).reduce((sum: number, d: any) => sum + (d.estimated_repair_cost_eur || 0), 0);

    // Simplified fair value calculation (mirrors client-side logic)
    const PREMIUM_BRANDS = ["Porsche", "Mercedes-Benz", "BMW", "Audi", "Tesla", "Volvo"];
    const ICONIC_BRANDS = ["Porsche", "Tesla"];
    const isPremium = PREMIUM_BRANDS.includes(make);
    const isIconic = ICONIC_BRANDS.includes(make);

    // Brand base MSRP estimation
    const brandBase: Record<string, number> = {
      Porsche: 85000, Tesla: 52000, "Mercedes-Benz": 50000, BMW: 48000, Audi: 45000,
      Volvo: 42000, Volkswagen: 32000, Toyota: 30000, Honda: 28000, Mazda: 28000,
      Hyundai: 27000, Kia: 26000, Skoda: 26000, Ford: 28000, Opel: 26000,
      Dacia: 18000, Nissan: 28000, "Land Rover": 60000, Mini: 30000,
    };
    let baseMSRP = brandBase[make] ?? 30000;
    const bodyMult: Record<string, number> = { SUV: 1.20, Coupe: 1.15, Convertible: 1.25, Wagon: 1.05, Sedan: 1.0, Hatchback: 0.9 };
    baseMSRP *= bodyMult[bodyType] ?? 1.0;
    baseMSRP *= Math.max(0.7, Math.min(1 + (powerHp - 150) * 0.0015, 1.8));

    const carAge = 2026 - year;
    const depRate = isIconic ? 0.07 : isPremium ? 0.10 : 0.15;
    let depFactor = Math.max(0.25, Math.pow(1 - depRate, carAge * 0.75));
    if (carAge > 10) depFactor *= Math.max(0.60, 1 - (carAge - 10) * 0.04);

    const expectedKm = carAge * 15000;
    const mileageRatio = mileage / Math.max(expectedKm, 1);
    let mileageFactor = mileageRatio <= 1 ? 1 + (1 - mileageRatio) * 0.05 : Math.max(0.55, 1 - Math.pow(mileageRatio - 1, 1.4) * 0.25);
    if (mileage > 300000) mileageFactor *= 0.75;
    else if (mileage > 200000) mileageFactor *= 0.90;

    const condAvg = (condExterior + condInterior) / 2;
    const condFactor = 0.70 + (condAvg / 100) * 0.32;

    const attributeValue = Math.round(baseMSRP * depFactor * mileageFactor * condFactor);
    const fairValue = Math.max(500, attributeValue - totalDamageCost);
    const priceMin = Math.round(fairValue * 0.92);
    const priceMax = Math.round(fairValue * 1.08);

    // Step 2: Generate ad description
    let description = "";
    try {
      const descResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: `You are a professional car listing copywriter. Write in ${lang}. Be factual and compelling.` },
            { role: "user", content: `Write a 3-4 paragraph car ad description for: ${make} ${model} ${year}, ${mileage} km, ${fuelType}, ${bodyType}, ${v.color?.value || "unknown"} color, ${powerHp} HP. Condition: exterior ${condExterior}/100, interior ${condInterior}/100. Equipment: ${(extraction.detected_equipment || []).join(", ") || "Standard"}. ${extraction.damages?.length > 0 ? `Known damages: ${extraction.damages.map((d: any) => d.description).join("; ")}` : "No visible damages."}. Write plain text only, no markdown.` },
          ],
        }),
      });
      if (descResponse.ok) {
        const descData = await descResponse.json();
        description = descData.choices?.[0]?.message?.content?.trim() ?? "";
      }
    } catch (e) {
      console.error("Description generation failed:", e);
    }

    // Identify missing/uncertain fields
    const missingFields: string[] = [];
    const uncertainFields: string[] = [];
    for (const [key, field] of Object.entries(extraction.vehicle)) {
      const f = field as { value: any; source: string };
      if (f.source === "not_found" || f.value === null) missingFields.push(key);
      else if (f.source === "uncertain") uncertainFields.push(key);
    }

    // Always-missing fields that can't be detected from photos
    const alwaysMissing = ["smoker_car", "service_book_updated", "warranty_type", "accident_history"];
    missingFields.push(...alwaysMissing);

    return new Response(JSON.stringify({
      vehicle: extraction.vehicle,
      damages: extraction.damages || [],
      overallCondition: extraction.overall_condition,
      conditionExterior: extraction.condition_exterior,
      conditionInterior: extraction.condition_interior,
      conditionSummary: extraction.condition_summary,
      equipment: extraction.detected_equipment || [],
      fairValue,
      priceRange: { min: priceMin, max: priceMax },
      description,
      missingFields,
      uncertainFields,
      totalDamageCost,
      photos: imageUrls || [],
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-car-listing error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
