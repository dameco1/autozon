import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SEO from "@/components/SEO"
import { ValuationCard } from "@/components/sell/ValuationCard"
import { useSellFlowStore } from "@/store/sellFlow"
import { loadListing } from "@/lib/api/sell"
import type { Database } from "@/integrations/supabase/types"
import { Skeleton } from "@/components/ui/skeleton"

type ListingRow = Database["public"]["Tables"]["listings"]["Row"]

const SellValuation: React.FC = () => {
  const navigate = useNavigate()
  const { listingId, sessionToken, setStep } = useSellFlowStore()
  const [row, setRow] = useState<ListingRow | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!listingId || !sessionToken) {
        navigate("/sell", { replace: true })
        return
      }
      const l = await loadListing(listingId, sessionToken)
      setRow(l)
    }
    void run()
  }, [listingId, sessionToken, navigate])

  if (!listingId || !sessionToken) return null

  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-lg mx-auto">
      <SEO title="AI valuation" description="Review your AI-generated valuation." path="/sell/valuation" />
      <h1 className="text-2xl font-display font-bold mb-6">Your estimate</h1>
      {!row ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : (
        <ValuationCard
          listing={row}
          onContinue={() => {
            setStep("listing")
            navigate("/sell/listing")
          }}
        />
      )}
    </div>
  )
}

export default SellValuation
