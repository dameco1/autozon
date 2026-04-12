import { supabase } from "@/integrations/supabase/client"
import { runOcrPlaceholder } from "@/lib/ai/ocr"
import { runValuationPlaceholder } from "@/lib/ai/valuation"
import { generateListingDescription } from "@/lib/ai/listing-generator"
import { trackSmartPush } from "@/lib/smartPush"

export async function ensureListingSession(): Promise<{ listingId: string; sessionToken: string }> {
  const { data, error } = await supabase.rpc("create_listing_session", {})
  if (error || !data?.length) throw new Error(error?.message ?? "Could not start listing session")
  const row = data[0]
  return { listingId: row.id, sessionToken: row.session_token }
}

export async function uploadPhotosToListing(listingId: string, files: File[]): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg"
    const path = `sessions/${listingId}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from("listing-photos").upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    })
    if (error) throw new Error(error.message)
    const { data: pub } = supabase.storage.from("listing-photos").getPublicUrl(path)
    urls.push(pub.publicUrl)
  }
  return urls
}

export async function runSellerPipeline(listingId: string, sessionToken: string, imageUrls: string[]) {
  const ocr = await runOcrPlaceholder(imageUrls)
  const valuation = await runValuationPlaceholder({ imageUrls, ocrHints: ocr.fields })
  trackSmartPush("AI_VALUATION_COMPLETED", {
    draftId: listingId,
    low: valuation.low,
    mid: valuation.mid,
    high: valuation.high,
    currency: valuation.currency,
    confidence: valuation.confidence,
  })
  const description = await generateListingDescription({ ocr, valuation })
  const title = [ocr.fields.make, ocr.fields.model].filter(Boolean).join(" ").trim() || "Your vehicle"

  const patch = {
    title,
    description,
    make: ocr.fields.make ?? "Unknown",
    model: ocr.fields.model ?? "—",
    year: ocr.fields.year ?? new Date().getFullYear() - 5,
    mileage: ocr.fields.mileage ?? 45000,
    colour: "—",
    fuel_type: "Petrol",
    gearbox: "Automatic",
    condition: "Good",
    location: "—",
    photos: imageUrls,
    valuation_low: valuation.low,
    valuation_mid: valuation.mid,
    valuation_high: valuation.high,
    ocr_raw: ocr as unknown as Record<string, unknown>,
    ai_confidence: ocr.confidence,
    status: "draft",
  }

  const { error } = await supabase.rpc("update_listing_session", {
    p_id: listingId,
    p_session_token: sessionToken,
    p_patch: patch as never,
  })
  if (error) throw new Error(error.message)
  return { ocr, valuation, patch }
}

export async function loadListing(listingId: string, sessionToken: string) {
  const { data, error } = await supabase.rpc("get_listing_for_session", {
    p_id: listingId,
    p_session_token: sessionToken,
  })
  if (error || !data?.length) return null
  return data[0]
}

export async function saveListingPatch(listingId: string, sessionToken: string, patch: Record<string, unknown>) {
  const { error } = await supabase.rpc("update_listing_session", {
    p_id: listingId,
    p_session_token: sessionToken,
    p_patch: patch as never,
  })
  if (error) throw new Error(error.message)
}

export async function publishListing(
  listingId: string,
  sessionToken: string,
  email: string,
  userId: string | null,
  price: number,
) {
  const { data, error } = await supabase.rpc("publish_listing_session", {
    p_id: listingId,
    p_session_token: sessionToken,
    p_email: email,
    p_user_id: userId,
  })
  if (error) throw new Error(error.message)
  if (!data) throw new Error("Publish failed")
  trackSmartPush("LISTING_PUBLISHED", { listingId, price })
}

export async function linkListingToUser(listingId: string, sessionToken: string, userId: string) {
  const { error } = await supabase.rpc("link_listing_to_user", {
    p_id: listingId,
    p_session_token: sessionToken,
    p_user_id: userId,
  })
  if (error) throw new Error(error.message)
}
