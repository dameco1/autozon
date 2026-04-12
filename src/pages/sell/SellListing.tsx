import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SEO from "@/components/SEO"
import { ListingEditor } from "@/components/sell/ListingEditor"
import { Button } from "@/components/ui/button"
import { useSellFlowStore } from "@/store/sellFlow"
import { loadListing, saveListingPatch } from "@/lib/api/sell"
import type { ListingDraft } from "@/types/listing"
import { analytics } from "@/lib/analytics"
import { toast } from "sonner"

function rowToDraft(row: Record<string, unknown>): ListingDraft {
  return {
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    price: row.price != null ? Number(row.price) : undefined,
    year: row.year != null ? Number(row.year) : undefined,
    mileage: row.mileage != null ? Number(row.mileage) : undefined,
    make: (row.make as string) ?? "",
    model: (row.model as string) ?? "",
    colour: (row.colour as string) ?? "",
    fuel_type: (row.fuel_type as string) ?? "",
    gearbox: (row.gearbox as string) ?? "",
    condition: (row.condition as string) ?? "",
    location: (row.location as string) ?? "",
    photos: (row.photos as string[]) ?? [],
    valuation_low: row.valuation_low != null ? Number(row.valuation_low) : undefined,
    valuation_mid: row.valuation_mid != null ? Number(row.valuation_mid) : undefined,
    valuation_high: row.valuation_high != null ? Number(row.valuation_high) : undefined,
  }
}

const SellListing: React.FC = () => {
  const navigate = useNavigate()
  const { listingId, sessionToken, setStep, updateListingDraft } = useSellFlowStore()
  const [draft, setDraft] = useState<ListingDraft>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const run = async () => {
      if (!listingId || !sessionToken) {
        navigate("/sell", { replace: true })
        return
      }
      const row = await loadListing(listingId, sessionToken)
      if (row) {
        const d = rowToDraft(row as unknown as Record<string, unknown>)
        setDraft(d)
        updateListingDraft(d)
      }
    }
    void run()
  }, [listingId, sessionToken, navigate, updateListingDraft])

  const onPatch = (patch: Partial<ListingDraft>) => {
    setDraft((d) => ({ ...d, ...patch }))
    analytics.listingEdited(Object.keys(patch))
  }

  const onContinue = async () => {
    if (!listingId || !sessionToken) return
    setSaving(true)
    try {
      await saveListingPatch(listingId, sessionToken, {
        ...draft,
        price: draft.price,
        photos: draft.photos,
      } as Record<string, unknown>)
      updateListingDraft(draft)
      setStep("confirm")
      navigate("/sell/confirm")
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (!listingId) return null

  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-3xl mx-auto">
      <SEO title="Edit listing" description="Review and edit your AI-generated listing." path="/sell/listing" />
      <h1 className="text-2xl font-display font-bold mb-6">Edit your listing</h1>
      <ListingEditor value={draft} onChange={onPatch} />
      <Button
        className="w-full mt-8 bg-orange text-orange-foreground py-6 rounded-xl"
        disabled={saving}
        onClick={() => void onContinue()}
      >
        {saving ? "Saving…" : "Continue to publish"}
      </Button>
    </div>
  )
}

export default SellListing
