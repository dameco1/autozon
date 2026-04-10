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

    const { query } = await req.json();
    if (!query || typeof query !== "string" || query.trim().length < 5) {
      return new Response(JSON.stringify({ error: "Please provide a search description" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Extract structured requirements from natural language
    const extractResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You extract structured car search criteria from natural language. Only extract what the user explicitly mentions. Set fields to null if not mentioned. Be precise.`,
          },
          { role: "user", content: query },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_search_criteria",
              description: "Extract structured car search criteria from user's description",
              parameters: {
                type: "object",
                properties: {
                  makes: { type: "array", items: { type: "string" }, description: "Preferred car brands" },
                  body_types: { type: "array", items: { type: "string" }, description: "Preferred body types (SUV, Sedan, Hatchback, Wagon, Coupe, Convertible, Van, Pickup)" },
                  max_price: { type: "number", description: "Maximum budget in EUR" },
                  min_year: { type: "number", description: "Minimum year" },
                  max_mileage: { type: "number", description: "Maximum mileage in km" },
                  fuel_types: { type: "array", items: { type: "string" }, description: "Preferred fuel types" },
                  transmission: { type: "string", description: "Preferred transmission (Manual/Automatic)" },
                  color: { type: "string", description: "Preferred color" },
                  min_seats: { type: "number", description: "Minimum number of seats" },
                  non_smoker: { type: "boolean", description: "Prefers non-smoker car" },
                  has_kids: { type: "boolean" },
                  location: { type: "string" },
                  purpose: { type: "string", enum: ["daily", "work", "pleasure", "summer", "winter"] },
                  summary: { type: "string", description: "Brief summary of what the user is looking for" },
                },
                required: ["summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_search_criteria" } },
      }),
    });

    if (!extractResponse.ok) {
      if (extractResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (extractResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI extraction failed");
    }

    const extractData = await extractResponse.json();
    const toolCall = extractData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No extraction result");

    const criteria = JSON.parse(toolCall.function.arguments);

    // Step 2: Query cars with extracted filters
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    let q = supabaseAdmin
      .from("cars")
      .select("*")
      .eq("status", "available")
      .eq("placement_paid", true);

    if (criteria.makes?.length) q = q.in("make", criteria.makes);
    if (criteria.body_types?.length) q = q.in("body_type", criteria.body_types);
    if (criteria.max_price) q = q.lte("price", criteria.max_price);
    if (criteria.min_year) q = q.gte("year", criteria.min_year);
    if (criteria.max_mileage) q = q.lte("mileage", criteria.max_mileage);
    if (criteria.fuel_types?.length) q = q.in("fuel_type", criteria.fuel_types);
    if (criteria.transmission) q = q.eq("transmission", criteria.transmission);
    if (criteria.non_smoker) q = q.eq("smoker_car", false);

    q = q.limit(50);

    const { data: cars, error: dbError } = await q;
    if (dbError) throw new Error(dbError.message);

    // Step 3: Score and rank matches
    const scored = (cars || []).map((car: any) => {
      let score = 50; // base score
      let penalties = 0;
      let bonuses = 0;

      // Make match
      if (criteria.makes?.length) {
        if (criteria.makes.includes(car.make)) bonuses += 15;
        else penalties += 10;
      }

      // Body type match
      if (criteria.body_types?.length) {
        if (criteria.body_types.includes(car.body_type)) bonuses += 12;
        else penalties += 8;
      }

      // Price match (closer to budget = better)
      if (criteria.max_price) {
        const priceRatio = car.price / criteria.max_price;
        if (priceRatio <= 1) bonuses += Math.round((1 - priceRatio) * 10 + 5);
        else penalties += Math.round((priceRatio - 1) * 20);
      }

      // Year match
      if (criteria.min_year) {
        if (car.year >= criteria.min_year) bonuses += 8;
        else penalties += Math.min(15, (criteria.min_year - car.year) * 3);
      }

      // Mileage match
      if (criteria.max_mileage) {
        if (car.mileage <= criteria.max_mileage) bonuses += 8;
        else penalties += Math.min(15, Math.round((car.mileage - criteria.max_mileage) / 10000) * 2);
      }

      // Color match
      if (criteria.color && car.color) {
        if (car.color.toLowerCase().includes(criteria.color.toLowerCase())) bonuses += 5;
      }

      // Fuel type match
      if (criteria.fuel_types?.length) {
        if (criteria.fuel_types.includes(car.fuel_type)) bonuses += 8;
        else penalties += 5;
      }

      // Condition bonus
      if (car.condition_score && car.condition_score > 70) bonuses += 5;

      // Non-smoker
      if (criteria.non_smoker && car.smoker_car === false) bonuses += 3;

      // Family-friendly bonus for SUV/Wagon if kids mentioned
      if (criteria.has_kids && ["SUV", "Wagon", "Van"].includes(car.body_type)) bonuses += 5;

      const matchScore = Math.min(100, Math.max(0, score + bonuses - penalties));

      return { ...car, matchScore };
    });

    // Sort by score descending, take top 5
    scored.sort((a: any, b: any) => b.matchScore - a.matchScore);
    const top5 = scored.slice(0, 5);

    return new Response(JSON.stringify({
      criteria,
      results: top5,
      totalMatched: scored.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("hyper-search error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
