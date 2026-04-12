import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import SEO from "@/components/SEO"
import { supabase } from "@/integrations/supabase/client"
import carPlaceholder from "@/assets/car-placeholder.jpg"

type Row = {
  title: string | null
  description: string | null
  price: number | null
  photos: string[]
  make: string | null
  model: string | null
  year: number | null
}

const ListingPublic: React.FC = () => {
  const { id } = useParams()
  const [row, setRow] = useState<Row | null | undefined>(undefined)

  useEffect(() => {
    if (!id) return
    void supabase
      .from("listings")
      .select("title,description,price,photos,make,model,year")
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle()
      .then(({ data }) => setRow(data ?? null))
  }, [id])

  if (row === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>
    )
  }

  if (row === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">Listing not found.</div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-2xl mx-auto">
      <SEO title={row.title ?? "Listing"} description={row.description ?? ""} path={`/listing/${id}`} />
      <img
        src={row.photos?.[0] || carPlaceholder}
        alt=""
        className="w-full rounded-2xl object-cover aspect-video bg-muted mb-6"
      />
      <h1 className="text-3xl font-display font-bold">{row.title}</h1>
      <p className="text-2xl text-orange font-semibold mt-2">€{row.price?.toLocaleString()}</p>
      <p className="text-muted-foreground mt-4 whitespace-pre-wrap">{row.description}</p>
      <Link to="/buy" className="inline-block mt-8 text-primary underline">
        Back to discover
      </Link>
    </div>
  )
}

export default ListingPublic
