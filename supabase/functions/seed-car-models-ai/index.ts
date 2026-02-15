import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function callAI(apiKey: string, prompt: string): Promise<any[]> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
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
    throw new Error(`AI API ${response.status}: ${errText.substring(0, 200)}`);
  }

  const aiResult = await response.json();
  let content = aiResult.choices?.[0]?.message?.content || "";
  content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  let variants: any[];
  try {
    variants = JSON.parse(content);
  } catch {
    throw new Error(`JSON parse failed. Len=${content.length} Start: ${content.substring(0, 150)}`);
  }

  if (!Array.isArray(variants)) throw new Error("Not an array");
  return variants;
}

function buildPrompt(make: string, models: string): string {
  return `European automotive database. Output a JSON array of ALL variants for "${make}" ONLY these models: ${models}.

Include ALL engine variants (petrol, diesel, hybrid, PHEV, electric), performance trims, wagon/estate/touring variants.

Format: [{"make":"${make}","model":"X","variant":"X","year_from":2020,"year_to":null,"power_hp":150,"fuel_type":"Petrol","transmission":"Automatic","body_type":"SUV"}]
fuel_type: Petrol|Diesel|Electric|Hybrid|PHEV
transmission: Manual|Automatic
body_type: Sedan|Hatchback|SUV|Coupe|Convertible|Wagon|Van|Roadster

ONLY JSON array output, no markdown.`;
}

const validFuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "PHEV"];
const validTransmissions = ["Manual", "Automatic"];
const validBodyTypes = ["Sedan", "Hatchback", "SUV", "Coupe", "Convertible", "Wagon", "Van", "Roadster"];

function cleanVariants(raw: any[]) {
  return raw
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
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Validate user and admin role
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const make: string = body.make;
    const models: string = body.models; // e.g. "X5, X6, X7, XM"
    const deleteFirst: boolean = body.delete_first ?? false;

    if (!make) throw new Error("'make' required");
    if (!models) throw new Error("'models' required — comma-separated model names");

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    console.log(`Fetching ${make}: ${models}`);
    const raw = await callAI(lovableApiKey, buildPrompt(make, models));
    const cleaned = cleanVariants(raw);

    if (cleaned.length === 0) throw new Error(`No variants generated for ${make} [${models}]`);

    if (deleteFirst) {
      await supabaseAdmin.from("car_models").delete().eq("make", make);
    } else {
      // Delete only models we're about to re-insert
      const modelNames = [...new Set(cleaned.map(c => c.model))];
      for (const m of modelNames) {
        await supabaseAdmin.from("car_models").delete().eq("make", make).eq("model", m);
      }
    }

    let inserted = 0;
    for (let j = 0; j < cleaned.length; j += 50) {
      const chunk = cleaned.slice(j, j + 50);
      const { error } = await supabaseAdmin.from("car_models").insert(chunk);
      if (error) {
        for (const item of chunk) {
          const { error: e2 } = await supabaseAdmin.from("car_models").insert(item);
          if (!e2) inserted++;
        }
      } else {
        inserted += chunk.length;
      }
    }

    console.log(`Seeded ${inserted} for ${make} [${models.substring(0, 50)}]`);

    return new Response(
      JSON.stringify({ success: true, make, models: models.split(",").map(s => s.trim()), total: inserted }),
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
