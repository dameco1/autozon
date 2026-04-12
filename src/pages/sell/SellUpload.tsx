import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SEO from "@/components/SEO"
import { UploadZone } from "@/components/sell/UploadZone"
import { Button } from "@/components/ui/button"
import { useSellFlowStore } from "@/store/sellFlow"
import { ensureListingSession, uploadPhotosToListing, runSellerPipeline } from "@/lib/api/sell"
import { validateFiles } from "@/lib/utils/validateFiles"
import { analytics } from "@/lib/analytics"
import { toast } from "sonner"

const SellUpload: React.FC = () => {
  const navigate = useNavigate()
  const { listingId, sessionToken, setSession, setPhotoUrls, setOcr, setValuation, setStep, setLoading, setError } =
    useSellFlowStore()
  const [photos, setPhotos] = useState<File[]>([])

  useEffect(() => {
    analytics.sellStarted("sell_page")
    const init = async () => {
      if (listingId && sessionToken) return
      try {
        const s = await ensureListingSession()
        setSession(s.listingId, s.sessionToken)
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Could not start session")
      }
    }
    void init()
  }, [listingId, sessionToken, setSession])

  const onContinue = async () => {
    const v = validateFiles(photos)
    if (!v.ok) {
      toast.error(v.error)
      return
    }
    if (!listingId || !sessionToken) {
      toast.error("Session not ready — try again.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const urls = await uploadPhotosToListing(listingId, photos)
      setPhotoUrls(urls)
      analytics.filesUploaded({
        photo_count: photos.length,
        has_license: false,
        has_registration: false,
      })
      const { ocr, valuation } = await runSellerPipeline(listingId, sessionToken, urls)
      analytics.ocrCompleted({ confidence: ocr.confidence, fields_extracted: Object.keys(ocr.fields).length })
      setOcr(ocr)
      setValuation(valuation)
      setStep("valuation")
      navigate("/sell/valuation")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed"
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const loading = useSellFlowStore((s) => s.isLoading)

  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-3xl mx-auto">
      <SEO title="Sell your car" description="Upload photos for an AI-powered valuation and listing." path="/sell" />
      <h1 className="text-3xl font-display font-bold text-foreground mb-2">Sell with AI</h1>
      <p className="text-muted-foreground mb-8">Add photos — no account required until you publish.</p>
      <UploadZone photos={photos} onPhotosChange={setPhotos} disabled={loading} />
      <Button
        className="w-full mt-6 bg-orange text-orange-foreground py-6 rounded-xl"
        disabled={loading || !photos.length}
        onClick={() => void onContinue()}
      >
        {loading ? "Working…" : "Continue"}
      </Button>
    </div>
  )
}

export default SellUpload
