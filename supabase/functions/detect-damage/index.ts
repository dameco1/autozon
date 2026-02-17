import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { photoUrls, make, model } = await req.json();
    if (!photoUrls || !Array.isArray(photoUrls) || photoUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: "No photo URLs provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const carMake = make || "unknown";
    const carModel = model || "unknown";

    // Limit number of photos to prevent abuse
    if (photoUrls.length > 20) {
      return new Response(
        JSON.stringify({ error: "Too many photos. Maximum 20 allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build image content parts for vision
    const imageContent = photoUrls.map((url: string) => ({
      type: "image_url" as const,
      image_url: { url },
    }));

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are an expert automotive damage assessor and repair cost estimator. Analyze car photos and detect any visible damage.

The car being inspected is a ${carMake} ${carModel}.

For each damage found, provide:
- type: category of damage (scratch, dent, rust, crack, paint_damage, broken_part, wear, other)
- location: where on the car (e.g. "front bumper", "driver door", "rear quarter panel")
- severity: low, medium, or high
- confidence: your confidence level from 0.0 to 1.0 (use lower values when unsure)
- description: brief description of the damage
- estimated_repair_cost_eur: estimated repair cost in EUR for this specific damage on a ${carMake} ${carModel}. Consider brand-specific labor rates and OEM parts pricing. For example, repainting a door on a Dacia costs ~€300-500 while the same on a Porsche costs ~€1,500-3,000. A dent repair on a standard brand is ~€200-500 vs €800-2,000 on a premium brand.

IMPORTANT RULES:
- Only report actual damage you can clearly see
- If something MIGHT be damage but you're not sure (reflections, shadows, dirt), still report it but with LOW confidence (below 0.6)
- Be thorough — check all visible panels, bumpers, lights, wheels, glass
- If no damage is found, return an empty array
- Repair cost estimates MUST reflect the specific brand (${carMake}) — premium/luxury brands have significantly higher repair costs
- Respond ONLY with the function call, no other text`,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze these car photos for any visible damage. Report every damage instance you find, with appropriate confidence levels.",
                },
                ...imageContent,
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "report_damages",
                description: "Report all detected damages from car photos",
                parameters: {
                  type: "object",
                  properties: {
                    damages: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          type: {
                            type: "string",
                            enum: [
                              "scratch",
                              "dent",
                              "rust",
                              "crack",
                              "paint_damage",
                              "broken_part",
                              "wear",
                              "other",
                            ],
                          },
                          location: { type: "string" },
                          severity: {
                            type: "string",
                            enum: ["low", "medium", "high"],
                          },
                          confidence: { type: "number" },
                          description: { type: "string" },
                          estimated_repair_cost_eur: { type: "number", description: "Estimated repair cost in EUR for this damage on this specific car brand/model" },
                        },
                        required: [
                          "type",
                          "location",
                          "severity",
                          "confidence",
                          "description",
                          "estimated_repair_cost_eur",
                        ],
                        additionalProperties: false,
                      },
                    },
                    overallCondition: {
                      type: "string",
                      enum: ["excellent", "good", "fair", "poor"],
                    },
                    summary: { type: "string" },
                  },
                  required: ["damages", "overallCondition", "summary"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "report_damages" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", response.status);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      return new Response(
        JSON.stringify({ damages: [], overallCondition: "good", summary: "No damage analysis available." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("detect-damage error:", e);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
