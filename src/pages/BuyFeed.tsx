import React, { useEffect, useMemo, useState } from "react"
import SEO from "@/components/SEO"
import { SwipeDeck } from "@/components/buy/SwipeDeck"
import { AuthGateModal } from "@/components/buy/AuthGateModal"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useBuyFlowStore, type FeedCard } from "@/store/buyFlow"
import { analytics } from "@/lib/analytics"
import { trackSmartPush } from "@/lib/smartPush"
import { Bookmark } from "lucide-react"
import { toast } from "sonner"

function sessionKey() {
  let id = sessionStorage.getItem("buy_session_id")
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem("buy_session_id", id)
  }
  return id
}

const BuyFeed: React.FC = () => {
  const navigate = useNavigate()
  const { feed, currentIndex, setFeed, advance, setLoading } = useBuyFlowStore()
  const [userId, setUserId] = useState<string | null>(null)
  const [authOpen, setAuthOpen] = useState(false)

  const current = feed[currentIndex]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUserId(session?.user?.id ?? null))
    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null)
    })
    return () => sub.data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const cards: FeedCard[] = []

      let pubListings: {
        id: string
        make: string | null
        model: string | null
        year: number | null
        mileage: number | null
        price: number | null
        photos: string[] | null
        status: string | null
      }[] = []
      try {
        const { data } = await supabase
          .from("listings")
          .select("id,make,model,year,mileage,price,photos,status")
          .eq("status", "published")
          .limit(15)
        pubListings = data ?? []
      } catch {
        pubListings = []
      }
      for (const row of pubListings) {
        if (row.price == null || row.year == null || row.mileage == null) continue
        cards.push({
          kind: "listing",
          id: row.id,
          make: row.make ?? "—",
          model: row.model ?? "",
          year: row.year,
          price: Number(row.price),
          mileage: row.mileage,
          image: row.photos?.[0] ?? null,
        })
      }

      const { data: cars } = await supabase
        .from("cars_public")
        .select("id,make,model,year,mileage,price,image_url,photos,is_seed")
        .order("created_at", { ascending: false })
        .limit(30)

      for (const row of cars ?? []) {
        if (!row.id || row.price == null || row.year == null || row.mileage == null) continue
        const img = row.image_url ?? row.photos?.[0] ?? null
        cards.push({
          kind: "car",
          id: row.id,
          make: row.make ?? "—",
          model: row.model ?? "",
          year: row.year,
          price: row.price,
          mileage: row.mileage,
          image: img,
        })
      }

      setFeed(cards)
      analytics.buyerFeedLoaded(cards.length)
      setLoading(false)
    }
    void load()
  }, [setFeed, setLoading])

  const sid = useMemo(() => sessionKey(), [])

  const recordSwipe = async (card: FeedCard, direction: "left" | "right", index: number) => {
    const payload =
      card.kind === "car"
        ? { car_id: card.id, listing_id: null }
        : { listing_id: card.id, car_id: null }
    await supabase.from("swipe_events").insert({
      session_id: sid,
      direction,
      ...payload,
    })
    const trackPayload = {
      carId: card.kind === "car" ? card.id : undefined,
      listingId: card.kind === "listing" ? card.id : undefined,
      index,
    }
    if (direction === "right") {
      trackSmartPush("BUYER_SWIPE_RIGHT", trackPayload)
    } else {
      trackSmartPush("BUYER_SWIPE_LEFT", trackPayload)
    }
  }

  const onSwipeLeft = async (card: FeedCard, index: number) => {
    await recordSwipe(card, "left", index)
    advance()
  }

  const onSwipeRight = async (card: FeedCard, index: number) => {
    await recordSwipe(card, "right", index)
    advance()
  }

  const saveShortlist = async () => {
    if (!current) return
    analytics.shortlistSaveAttempted(current.kind === "car" ? current.id : null, Boolean(userId))
    if (!userId) {
      analytics.authGateOpened()
      setAuthOpen(true)
      return
    }
    try {
      if (current.kind === "car") {
        const { error } = await supabase.from("shortlists").insert({ user_id: userId, car_id: current.id })
        if (error) throw error
      } else {
        const { error } = await supabase.from("shortlists").insert({ user_id: userId, listing_id: current.id })
        if (error) throw error
      }
      toast.success("Saved to your shortlist")
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not save")
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 pb-24">
      <SEO title="Discover cars" description="Swipe through cars tailored for you." path="/buy" />
      <div className="max-w-xl mx-auto text-center mb-6">
        <h1 className="text-3xl font-display font-bold">Discover</h1>
        <p className="text-muted-foreground text-sm mt-1">Swipe right if you like a car, left to skip.</p>
      </div>
      <SwipeDeck
        cards={feed}
        currentIndex={currentIndex}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />
      <div className="max-w-md mx-auto mt-8">
        <Button
          type="button"
          variant="secondary"
          className="w-full py-6 gap-2"
          onClick={() => void saveShortlist()}
          disabled={!current}
        >
          <Bookmark className="h-5 w-5" />
          Save to shortlist
        </Button>
      </div>
      <AuthGateModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  )
}

export default BuyFeed
