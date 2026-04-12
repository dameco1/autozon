import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Database } from "@/integrations/supabase/types"

type Listing = Database["public"]["Tables"]["listings"]["Row"]

type Props = {
  listing: Listing
  onContinue: () => void
}

export const ValuationCard: React.FC<Props> = ({ listing, onContinue }) => {
  const low = listing.valuation_low ?? 0
  const mid = listing.valuation_mid ?? 0
  const high = listing.valuation_high ?? 0

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-xl">AI valuation</CardTitle>
        <p className="text-sm text-muted-foreground">Estimated range based on your photos (placeholder pipeline).</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 items-baseline">
          <span className="text-3xl font-bold text-foreground">€{mid.toLocaleString()}</span>
          <Badge variant="secondary">mid</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Range €{low.toLocaleString()} – €{high.toLocaleString()}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Make / model</span>
            <p className="font-medium">
              {listing.make} {listing.model}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Year / km</span>
            <p className="font-medium">
              {listing.year} · {listing.mileage?.toLocaleString()} km
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-3 rounded-xl bg-orange text-orange-foreground font-semibold hover:bg-orange/90"
        >
          Create my listing
        </button>
      </CardContent>
    </Card>
  )
}
