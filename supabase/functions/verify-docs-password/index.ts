import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory rate limiter: max 5 attempts per IP per 15-minute window
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("cf-connecting-ip")
    || "unknown";
}

function isRateLimited(ip: string): { limited: boolean; retryAfterSecs: number } {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfterSecs: 0 };
  }

  record.count++;
  if (record.count > MAX_ATTEMPTS) {
    const retryAfterSecs = Math.ceil((record.resetAt - now) / 1000);
    return { limited: true, retryAfterSecs };
  }

  return { limited: false, retryAfterSecs: 0 };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = getClientIp(req);
    const { limited, retryAfterSecs } = isRateLimited(ip);

    if (limited) {
      return new Response(
        JSON.stringify({ error: "Too many attempts. Try again later.", retryAfterSecs }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": String(retryAfterSecs) },
        }
      );
    }

    const { password } = await req.json();
    const correct = Deno.env.get("DOCS_PASSWORD");

    if (!correct) {
      return new Response(JSON.stringify({ error: "Password not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const valid = password === correct;

    // Reset counter on successful auth
    if (valid) {
      attempts.delete(ip);
    }

    return new Response(JSON.stringify({ valid }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
