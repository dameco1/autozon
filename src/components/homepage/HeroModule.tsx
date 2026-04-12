import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { analytics } from "@/lib/analytics"

export const HeroModule: React.FC = () => (
  <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-muted/80 to-background p-8 md:p-12 flex flex-col justify-center min-h-[280px] md:min-h-[320px]">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange/15 via-transparent to-transparent pointer-events-none" />
    <div className="relative z-10 max-w-lg">
      <div className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-3 py-1 text-xs font-medium text-orange mb-4">
        <Sparkles className="h-3.5 w-3.5" />
        AI valuation in minutes
      </div>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
        Sell your car with confidence
      </h2>
      <p className="mt-3 text-muted-foreground text-base leading-relaxed">
        Upload photos — no account needed until you publish. Fair range, editable listing, you stay in control.
      </p>
      <Link to="/sell" className="inline-block mt-6">
        <Button
          className="bg-orange text-orange-foreground hover:bg-orange/90 font-semibold px-8 py-6 rounded-xl min-h-[48px]"
          onClick={() => analytics.sellCtaClicked()}
        >
          Sell my car
        </Button>
      </Link>
    </div>
  </section>
)
