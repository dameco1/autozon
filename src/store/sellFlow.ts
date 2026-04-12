import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ListingDraft } from "@/types/listing"
import type { OcrResult } from "@/lib/ai/ocr"
import type { ValuationResult } from "@/lib/ai/valuation"

export type SellStep = "upload" | "valuation" | "listing" | "confirm" | "published"

type UploadedFiles = {
  photos: File[]
  license: File | null
  registration: File | null
}

type SellFlowState = {
  step: SellStep
  listingId: string | null
  sessionToken: string | null
  uploadedFiles: UploadedFiles
  photoUrls: string[]
  ocrResult: OcrResult | null
  valuation: ValuationResult | null
  listingDraft: ListingDraft
  email: string
  publishedListingId: string | null
  isLoading: boolean
  error: string | null
  setStep: (s: SellStep) => void
  setSession: (listingId: string, sessionToken: string) => void
  setUploadedFiles: (f: Partial<UploadedFiles>) => void
  setPhotoUrls: (urls: string[]) => void
  setOcr: (o: OcrResult | null) => void
  setValuation: (v: ValuationResult | null) => void
  updateListingDraft: (patch: Partial<ListingDraft>) => void
  setEmail: (e: string) => void
  setPublished: (id: string | null) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  reset: () => void
}

const initial: Omit<
  SellFlowState,
  | "setStep"
  | "setSession"
  | "setUploadedFiles"
  | "setPhotoUrls"
  | "setOcr"
  | "setValuation"
  | "updateListingDraft"
  | "setEmail"
  | "setPublished"
  | "setLoading"
  | "setError"
  | "reset"
> = {
  step: "upload",
  listingId: null,
  sessionToken: null,
  uploadedFiles: { photos: [], license: null, registration: null },
  photoUrls: [],
  ocrResult: null,
  valuation: null,
  listingDraft: {},
  email: "",
  publishedListingId: null,
  isLoading: false,
  error: null,
}

export const useSellFlowStore = create<SellFlowState>()(
  persist(
    (set) => ({
      ...initial,
      setStep: (step) => set({ step }),
      setSession: (listingId, sessionToken) => set({ listingId, sessionToken }),
      setUploadedFiles: (f) =>
        set((s) => ({ uploadedFiles: { ...s.uploadedFiles, ...f } })),
      setPhotoUrls: (photoUrls) => set({ photoUrls }),
      setOcr: (ocrResult) => set({ ocrResult }),
      setValuation: (valuation) => set({ valuation }),
      updateListingDraft: (patch) =>
        set((s) => ({ listingDraft: { ...s.listingDraft, ...patch } })),
      setEmail: (email) => set({ email }),
      setPublished: (publishedListingId) => set({ publishedListingId }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () => set({ ...initial }),
    }),
    {
      name: "autozon-sell-flow",
      partialize: (s) => ({
        listingId: s.listingId,
        sessionToken: s.sessionToken,
        step: s.step,
        email: s.email,
        listingDraft: s.listingDraft,
        photoUrls: s.photoUrls,
      }),
    },
  ),
)
