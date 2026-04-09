import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Authentication is optional — market data is not user-specific
    // If auth header is present, validate it; otherwise allow anonymous access
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const token = authHeader.replace("Bearer ", "");
      const { error: claimsError } = await supabaseClient.auth.getClaims(token);
      if (claimsError) {
        console.warn("Invalid token provided, proceeding as anonymous");
      }
    }

    const { make, model, year, mileage, condition_score, price, fuel_type, body_type, transmission } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are a European used car market expert. Given this car:
- Make: ${make}
- Model: ${model}
- Year: ${year}
- Mileage: ${mileage} km
- Condition Score: ${condition_score}/100
- Asking Price: €${price}
- Fuel Type: ${fuel_type}
- Body Type: ${body_type}
- Transmission: ${transmission}

1. Estimate the current market price range in EUR for this car on major European car marketplaces (mobile.de, AutoScout24, etc.).
2. Provide a realistic 12-month depreciation forecast (monthly values) starting from the estimated average market price. Consider:
   - The car's age (${year}) and how depreciation flattens for older vehicles
   - ${fuel_type} demand trends in Europe (EVs hold value better, diesel drops faster)
   - ${make} ${model} brand-specific resale patterns
   - Seasonal fluctuations (spring/summer demand is higher for convertibles/SUVs)
   - Current mileage of ${mileage} km
Return your estimates using the provided function.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a European used car pricing expert with deep knowledge of mobile.de, AutoScout24, and other major European car listing platforms. You understand seasonal trends, brand depreciation curves, and fuel-type demand shifts." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "market_estimate",
              description: "Return the estimated market price range, comparison data, and 12-month depreciation forecast",
              parameters: {
                type: "object",
                properties: {
                  min_price: { type: "number", description: "Lower end of market price range in EUR" },
                  max_price: { type: "number", description: "Upper end of market price range in EUR" },
                  avg_price: { type: "number", description: "Average market price in EUR" },
                  market_position: { type: "string", enum: ["below_market", "at_market", "above_market"], description: "How the asking price compares to market average" },
                  confidence: { type: "string", enum: ["low", "medium", "high"], description: "Confidence level of the estimate" },
                  sources_note: { type: "string", description: "Brief note about which marketplaces this estimate is based on (e.g. mobile.de, AutoScout24)" },
                  depreciation_forecast: {
                    type: "array",
                    description: "Array of 13 monthly projected values (M0 = current, M1-M12 = next 12 months) in EUR, reflecting realistic brand/fuel/age depreciation",
                    items: { type: "number" },
                    minItems: 13,
                    maxItems: 13,
                  },
                },
                required: ["min_price", "max_price", "avg_price", "market_position", "confidence", "sources_note", "depreciation_forecast"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "market_estimate" } },
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
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("market-comparison error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
