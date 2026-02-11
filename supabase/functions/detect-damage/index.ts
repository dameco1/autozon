import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { photoUrls } = await req.json();
    if (!photoUrls || !Array.isArray(photoUrls) || photoUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: "No photo URLs provided" }),
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
              content: `You are an expert automotive damage assessor. Analyze car photos and detect any visible damage.

For each damage found, provide:
- type: category of damage (scratch, dent, rust, crack, paint_damage, broken_part, wear, other)
- location: where on the car (e.g. "front bumper", "driver door", "rear quarter panel")
- severity: low, medium, or high
- confidence: your confidence level from 0.0 to 1.0 (use lower values when unsure)
- description: brief description of the damage

IMPORTANT RULES:
- Only report actual damage you can clearly see
- If something MIGHT be damage but you're not sure (reflections, shadows, dirt), still report it but with LOW confidence (below 0.6)
- Be thorough — check all visible panels, bumpers, lights, wheels, glass
- If no damage is found, return an empty array
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
                        },
                        required: [
                          "type",
                          "location",
                          "severity",
                          "confidence",
                          "description",
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
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
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
