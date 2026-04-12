export type ListingDraft = {
  title?: string | null
  description?: string | null
  price?: number | null
  year?: number | null
  mileage?: number | null
  make?: string | null
  model?: string | null
  colour?: string | null
  fuel_type?: string | null
  gearbox?: string | null
  condition?: string | null
  location?: string | null
  photos?: string[]
  valuation_low?: number | null
  valuation_mid?: number | null
  valuation_high?: number | null
}
