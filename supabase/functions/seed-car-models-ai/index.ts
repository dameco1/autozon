import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.json().catch(() => ({}));
    const make: string = body.make;
    if (!make) throw new Error("'make' parameter is required");

    const prompt = `You are a European automotive database expert. Generate a COMPLETE JSON array of ALL car models and variants for "${make}" currently sold or recently sold (since 2015) in Europe.

Include ALL models and for EACH model include ALL common variants:
- All petrol engine sizes (e.g. 118i, 120i, 125i, 128ti, M135i for 1 Series)
- All diesel engine sizes
- All hybrid/PHEV variants
- All electric variants
- All performance variants (M, AMG, RS, etc.)
- Wagon/Estate/Touring variants as separate entries where applicable
- Gran Coupe, Active Tourer, Gran Tourer variants where applicable

For BMW specifically make sure to include: 1 Series, 2 Series, 2 Series Active Tourer, 2 Series Gran Coupe, 3 Series, 3 Series Touring, 4 Series, 4 Series Gran Coupe, 5 Series, 5 Series Touring, 6 Series GT, 7 Series, 8 Series, X1, X2, X3, X4, X5, X6, X7, XM, Z4, i4, i5, i7, iX, iX1, iX2, iX3, M2, M3, M4, M5, M8 and ALL their engine variants.

Return ONLY a valid JSON array. Each object must have:
{"make":"${make}","model":"...","variant":"...","year_from":2020,"year_to":null,"power_hp":150,"fuel_type":"Petrol","transmission":"Automatic","body_type":"SUV"}

fuel_type: "Petrol"|"Diesel"|"Electric"|"Hybrid"|"PHEV"
transmission: "Manual"|"Automatic"
body_type: "Sedan"|"Hatchback"|"SUV"|"Coupe"|"Convertible"|"Wagon"|"Van"|"Roadster"

NO markdown fences, NO explanation, ONLY the JSON array.`;

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 30000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API error: ${response.status} ${errText.substring(0, 200)}`);
    }

    const aiResult = await response.json();
    let content = aiResult.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let variants: any[];
    try {
      variants = JSON.parse(content);
    } catch {
      throw new Error(`JSON parse failed. Content starts: ${content.substring(0, 300)}`);
    }

    if (!Array.isArray(variants)) throw new Error("Response is not an array");

    const validFuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "PHEV"];
    const validTransmissions = ["Manual", "Automatic"];
    const validBodyTypes = ["Sedan", "Hatchback", "SUV", "Coupe", "Convertible", "Wagon", "Van", "Roadster"];

    const cleaned = variants
      .filter((v: any) => v.make && v.model && v.variant && v.year_from)
      .map((v: any) => ({
        make: String(v.make).trim(),
        model: String(v.model).trim(),
        variant: String(v.variant).trim(),
        year_from: Number(v.year_from) || 2020,
        year_to: v.year_to ? Number(v.year_to) : null,
        power_hp: Number(v.power_hp) || 0,
        fuel_type: validFuelTypes.includes(v.fuel_type) ? v.fuel_type : "Petrol",
        transmission: validTransmissions.includes(v.transmission) ? v.transmission : "Automatic",
        body_type: validBodyTypes.includes(v.body_type) ? v.body_type : "Sedan",
      }));

    // Delete existing entries for this make first
    await supabaseAdmin.from("car_models").delete().eq("make", make);

    // Insert in chunks
    let inserted = 0;
    for (let j = 0; j < cleaned.length; j += 50) {
      const chunk = cleaned.slice(j, j + 50);
      const { error } = await supabaseAdmin.from("car_models").insert(chunk);
      if (error) {
        console.error(`Insert error: ${error.message}`);
        // Try one by one
        for (const item of chunk) {
          const { error: e2 } = await supabaseAdmin.from("car_models").insert(item);
          if (!e2) inserted++;
        }
      } else {
        inserted += chunk.length;
      }
    }

    console.log(`Seeded ${inserted} variants for ${make}`);

    return new Response(
      JSON.stringify({ success: true, make, total: inserted, generated: cleaned.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Seed error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
