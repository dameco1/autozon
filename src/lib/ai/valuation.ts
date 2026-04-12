export type ValuationResult = {
  low: number
  mid: number
  high: number
  currency: string
  confidence: number
  summary?: string
}

/** Placeholder valuation — swap for `/api/internal/valuation`. */
export async function runValuationPlaceholder(_ctx: {
  imageUrls: string[]
  ocrHints?: Record<string, unknown>
}): Promise<ValuationResult> {
  await new Promise((r) => setTimeout(r, 400))
  const mid = 22000 + Math.round(Math.random() * 6000)
  return {
    low: Math.round(mid * 0.9),
    mid,
    high: Math.round(mid * 1.1),
    currency: "EUR",
    confidence: 0.68,
    summary: "Heuristic range (placeholder). Replace with market comparison.",
  }
}
