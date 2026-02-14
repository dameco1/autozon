import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { make, model, year, mileage, fuelType, transmission, bodyType, color, powerHp, equipment, conditionExterior, conditionInterior, accidentHistory, language } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const lang = language === "de" ? "German" : "English";

    const prompt = `You are a professional car listing copywriter. Write a compelling, honest, and detailed car advertisement description in ${lang} for this vehicle:

- Make: ${make}
- Model: ${model}
- Year: ${year}
- Mileage: ${mileage} km
- Fuel Type: ${fuelType}
- Transmission: ${transmission}
- Body Type: ${bodyType}
- Color: ${color || "not specified"}
- Power: ${powerHp || "not specified"} HP
- Exterior Condition: ${conditionExterior}/100
- Interior Condition: ${conditionInterior}/100
- Accident History: ${accidentHistory ? "Yes" : "No"}
- Equipment: ${equipment?.length > 0 ? equipment.join(", ") : "Standard"}

Write 3-4 paragraphs. Be factual and highlight strengths. If condition scores are high, emphasize excellent condition. If there's accident history, be transparent about it. Mention key equipment features. Do NOT use markdown formatting — write plain text only.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: `You are a professional European car listing copywriter. Write in ${lang}. Be factual, compelling, and honest.` },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content?.trim() ?? "";

    return new Response(JSON.stringify({ description }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-description error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
