import type { NavigateFunction } from "react-router-dom"
import { toast } from "sonner"
import { ensureListingSession, uploadPhotosToListing, runSellerPipeline } from "@/lib/api/sell"
import { validateFiles } from "@/lib/utils/validateFiles"

const REF_KEY = "autozon_instant_draft_ref"

export type InstantDraftRef = { draftId: string; key: string }

export function persistInstantDraftRef(ref: InstantDraftRef): void {
  try {
    sessionStorage.setItem(REF_KEY, JSON.stringify(ref))
  } catch {
    /* ignore */
  }
}

export function readInstantDraftRef(): InstantDraftRef | null {
  try {
    const raw = sessionStorage.getItem(REF_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as InstantDraftRef
    return p.draftId && p.key ? p : null
  } catch {
    return null
  }
}

/**
 * AI-first seller entry: upload → OCR (placeholder) → valuation (placeholder) → draft → /instant-ai-flow?draftId=&key=
 */
export async function startInstantAIFlow(files: File[], navigate: NavigateFunction): Promise<void> {
  const v = validateFiles(files)
  if (!v.ok) {
    toast.error(v.error)
    return
  }

  const t = toast.loading("Uploading and analyzing your photos…")
  try {
    const { listingId, sessionToken } = await ensureListingSession()
    const urls = await uploadPhotosToListing(listingId, files)
    await runSellerPipeline(listingId, sessionToken, urls)
    persistInstantDraftRef({ draftId: listingId, key: sessionToken })
    toast.dismiss(t)
    toast.success("Valuation ready — review your listing")
    const q = new URLSearchParams({
      draftId: listingId,
      key: sessionToken,
    })
    navigate(`/instant-ai-flow?${q.toString()}`)
  } catch (e: unknown) {
    toast.dismiss(t)
    toast.error(e instanceof Error ? e.message : "Something went wrong")
  }
}
