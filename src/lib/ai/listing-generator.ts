import type { ValuationResult } from "@/lib/ai/valuation"
import type { OcrResult } from "@/lib/ai/ocr"

/** Placeholder description — swap for `/api/internal/description`. */
export async function generateListingDescription(input: {
  ocr: OcrResult
  valuation: ValuationResult
}): Promise<string> {
  await new Promise((r) => setTimeout(r, 250))
  const make = input.ocr.fields.make ?? "vehicle"
  const model = input.ocr.fields.model ?? ""
  const km = input.ocr.fields.mileage?.toLocaleString() ?? "—"
  return [
    `Attractive ${make} ${model}`.trim() + ".",
    `Around ${km} km on the clock.`,
    `Guide range €${input.valuation.low.toLocaleString()}–€${input.valuation.high.toLocaleString()} (${input.valuation.currency}).`,
    "(AI-generated placeholder — edit freely before publishing.)",
  ].join(" ")
}
