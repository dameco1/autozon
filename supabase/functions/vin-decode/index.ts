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
    const { vin } = await req.json();
    if (!vin || typeof vin !== "string" || vin.length < 11) {
      return new Response(
        JSON.stringify({ error: "A valid VIN (at least 11 characters) is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
              content: `You are an expert automotive VIN decoder specializing in European vehicles.

A VIN (Vehicle Identification Number) is a 17-character code. Decode it to extract:
- make: The manufacturer name (e.g. "BMW", "Volkswagen", "Mercedes-Benz", "Porsche")
- model: The specific model name (e.g. "3 Series", "Golf", "C-Class")
- year: The model year (decode from position 10 for US-style or infer from WMI/VDS for EU)
- body_type: One of: Sedan, Hatchback, SUV, Wagon, Coupe, Convertible, Van, Pickup
- fuel_type: One of: Petrol, Diesel, Hybrid, Plug-in Hybrid, Electric
- transmission: Manual or Automatic
- power_hp: Estimated horsepower (best guess based on known engine codes in VDS)
- suggested_equipment: Array of likely standard/optional equipment for this specific model and year. Include items like: Navigation, Apple CarPlay, Android Auto, Heated Seats, Leather Interior, Parking Sensors, Backup Camera, LED Headlights, Cruise Control, Keyless Entry, Sunroof, Adaptive Cruise Control, Lane Assist, Blind Spot Monitor, 360° Camera, Heads-Up Display, Seat Memory, Heated Steering Wheel

Key VIN positions:
- Positions 1-3 (WMI): World Manufacturer Identifier
- Positions 4-8 (VDS): Vehicle Descriptor Section (model, engine, body)
- Position 9: Check digit
- Position 10: Model year code
- Position 11: Assembly plant
- Positions 12-17: Sequential number

Common WMI codes:
- WBA, WBS, WBY = BMW
- WDD, WDB, W1K = Mercedes-Benz
- WVW, WVG = Volkswagen
- WAU, WUA = Audi
- WP0, WP1 = Porsche
- YV1, YV4 = Volvo
- TMA, TMB = Škoda
- ZFA = Fiat
- VF1, VF3, VF7 = Renault/Peugeot/Citroën
- SAJ, SAL = Jaguar/Land Rover
- 5YJ, 7SA = Tesla
- SHH = Honda (UK)
- JTD, JTE = Toyota
- UU1 = Dacia

Be thorough in equipment suggestions — include everything that is commonly found on that specific model/year. If you cannot confidently decode a field, provide your best estimate with a note in the confidence field.

Respond ONLY with the function call.`,
            },
            {
              role: "user",
              content: `Decode this VIN: ${vin}`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "decode_vin",
                description: "Return decoded vehicle information from a VIN",
                parameters: {
                  type: "object",
                  properties: {
                    make: { type: "string", description: "Manufacturer name" },
                    model: { type: "string", description: "Model name" },
                    year: { type: "number", description: "Model year" },
                    body_type: {
                      type: "string",
                      enum: ["Sedan", "Hatchback", "SUV", "Wagon", "Coupe", "Convertible", "Van", "Pickup"],
                    },
                    fuel_type: {
                      type: "string",
                      enum: ["Petrol", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric"],
                    },
                    transmission: {
                      type: "string",
                      enum: ["Manual", "Automatic"],
                    },
                    power_hp: { type: "number", description: "Estimated horsepower" },
                    suggested_equipment: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of likely equipment/features for this model",
                    },
                    confidence: {
                      type: "string",
                      enum: ["high", "medium", "low"],
                      description: "Overall confidence in the decode accuracy",
                    },
                    notes: {
                      type: "string",
                      description: "Any caveats or notes about the decode",
                    },
                  },
                  required: [
                    "make",
                    "model",
                    "year",
                    "body_type",
                    "fuel_type",
                    "transmission",
                    "power_hp",
                    "suggested_equipment",
                    "confidence",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "decode_vin" },
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
        JSON.stringify({ error: "VIN decode failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      return new Response(
        JSON.stringify({ error: "Could not decode VIN" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);

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
