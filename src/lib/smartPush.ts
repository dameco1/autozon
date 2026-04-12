import { analytics } from "@/lib/analytics"

/** Legacy SmartPush-style hooks — forwards to analytics + window.smartPush. */
export function trackSmartPush(
  event: "AI_VALUATION_COMPLETED" | "LISTING_PUBLISHED" | "BUYER_SWIPE_RIGHT" | "BUYER_SWIPE_LEFT",
  payload?: Record<string, unknown>,
) {
  if (typeof window !== "undefined") {
    try {
      ;(window as unknown as { smartPush?: (e: string, p?: object) => void }).smartPush?.(event, payload)
    } catch {
      /* ignore */
    }
  }

  if (event === "AI_VALUATION_COMPLETED" && payload?.mid != null) {
    analytics.valuationReceived({
      price_low: Number(payload.low ?? payload.mid),
      price_mid: Number(payload.mid),
      price_high: Number(payload.high ?? payload.mid),
      confidence: Number(payload.confidence ?? 0.7),
    })
  }

  if (event === "LISTING_PUBLISHED") {
    const id = String(payload?.listingId ?? payload?.carId ?? "")
    analytics.listingPublished(id, Number(payload?.price ?? 0))
  }

  if (event === "BUYER_SWIPE_RIGHT") {
    analytics.cardSwipedRight(
      (payload?.listingId as string | null) ?? null,
      (payload?.carId as string | null) ?? null,
      Number(payload?.index ?? 0),
    )
  }
  if (event === "BUYER_SWIPE_LEFT") {
    analytics.cardSwipedLeft(
      (payload?.listingId as string | null) ?? null,
      (payload?.carId as string | null) ?? null,
      Number(payload?.index ?? 0),
    )
  }

  if (import.meta.env.DEV) console.debug("[SmartPush]", event, payload)
}
