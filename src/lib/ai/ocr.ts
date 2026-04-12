/** Placeholder OCR — swap for `/api/internal/ocr` or Supabase function. */
export type OcrResult = {
  rawText: string
  confidence: number
  fields: Partial<{
    make: string
    model: string
    year: number
    mileage: number
    plate: string
  }>
}

export async function runOcrPlaceholder(_imageUrls: string[]): Promise<OcrResult> {
  await new Promise((r) => setTimeout(r, 350))
  return {
    rawText: "OCR placeholder output — connect a real OCR provider.",
    confidence: 0.72,
    fields: { make: "—", model: "—", year: new Date().getFullYear() - 4, mileage: 52000 },
  }
}
