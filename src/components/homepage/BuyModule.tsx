import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { analytics } from "@/lib/analytics"

export const BuyModule: React.FC = () => (
  <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background to-muted/50 p-8 md:p-12 flex flex-col justify-center min-h-[280px] md:min-h-[320px]">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange/10 via-transparent to-transparent pointer-events-none" />
    <div className="relative z-10 max-w-lg ml-auto text-right">
      <div className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-3 py-1 text-xs font-medium text-orange mb-4">
        <Heart className="h-3.5 w-3.5" />
        Swipe to match
      </div>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
        Find your next car
      </h2>
      <p className="mt-3 text-muted-foreground text-base leading-relaxed">
        Browse with a Tinder-style feed. Like, skip, and save when you are ready — we will ask you to sign in only then.
      </p>
      <Link to="/buy" className="inline-block mt-6">
        <Button
          variant="outline"
          className="font-semibold px-8 py-6 rounded-xl border-orange text-orange hover:bg-orange/10 min-h-[48px]"
          onClick={() => analytics.buyCtaClicked()}
        >
          Browse cars
        </Button>
      </Link>
    </div>
  </section>
)
