import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get client IP from headers (Supabase/Deno Deploy forwards this)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "";

    console.log("Client IP:", clientIp);

    // Use ipapi.co free tier (no key needed, 1000 req/day)
    const geoUrl = clientIp
      ? `https://ipapi.co/${clientIp}/json/`
      : `https://ipapi.co/json/`;

    const geoRes = await fetch(geoUrl, {
      headers: { "User-Agent": "Autozon/1.0" },
    });

    if (!geoRes.ok) {
      throw new Error(`Geo API returned ${geoRes.status}`);
    }

    const geo = await geoRes.json();

    return new Response(
      JSON.stringify({
        country: geo.country_name || "Germany",
        country_code: geo.country_code || "DE",
        city: geo.city || "",
        region: geo.region || "",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Geolocation error:", error);
    // Fallback to Germany if anything fails
    return new Response(
      JSON.stringify({
        country: "Germany",
        country_code: "DE",
        city: "",
        region: "",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
