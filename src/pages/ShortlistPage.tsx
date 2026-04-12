import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SEO from "@/components/SEO"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import carPlaceholder from "@/assets/car-placeholder.jpg"

const ShortlistPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<{ id: string; title: string; price: number; image: string | null; href: string }[]>(
    [],
  )

  useEffect(() => {
    const run = async () => {
      const { data: session } = await supabase.auth.getSession()
      const uid = session.session?.user?.id
      if (!uid) {
        navigate("/login?redirect=/shortlist")
        return
      }

      const out: typeof rows = []

      const { data: sl } = await supabase
        .from("shortlists")
        .select("id, car_id, listing_id")
        .eq("user_id", uid)

      for (const s of sl ?? []) {
        if (s.car_id) {
          const { data: car } = await supabase
            .from("cars_public")
            .select("id,make,model,year,price,image_url,photos")
            .eq("id", s.car_id)
            .maybeSingle()
          if (car && car.price != null) {
            out.push({
              id: s.id,
              title: `${car.make} ${car.model} (${car.year})`,
              price: car.price,
              image: car.image_url ?? car.photos?.[0] ?? null,
              href: `/car/${car.id}`,
            })
          }
        } else if (s.listing_id) {
          const { data: l } = await supabase
            .from("listings")
            .select("id,title,make,model,year,price,photos")
            .eq("id", s.listing_id)
            .maybeSingle()
          if (l && l.price != null) {
            out.push({
              id: s.id,
              title: l.title ?? `${l.make} ${l.model} (${l.year})`,
              price: Number(l.price),
              image: l.photos?.[0] ?? null,
              href: `/listing/${l.id}`,
            })
          }
        }
      }

      setRows(out)
      setLoading(false)
    }
    void run()
  }, [navigate])

  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-2xl mx-auto">
      <SEO title="Shortlist" description="Cars you saved." path="/shortlist" />
      <h1 className="text-2xl font-display font-bold mb-6">Shortlist</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground">Nothing saved yet. Try the discover feed.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Card>
                <CardContent className="p-4 flex gap-4 items-center">
                  <img
                    src={r.image || carPlaceholder}
                    alt=""
                    className="w-24 h-20 object-cover rounded-lg bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{r.title}</p>
                    <p className="text-orange font-medium">€{r.price.toLocaleString()}</p>
                    <Link to={r.href} className="text-sm text-primary underline">
                      View
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
      <Button asChild variant="outline" className="mt-8">
        <Link to="/buy">Back to discover</Link>
      </Button>
    </div>
  )
}

export default ShortlistPage
