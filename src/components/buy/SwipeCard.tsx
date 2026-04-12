import React from "react"
import type { FeedCard } from "@/store/buyFlow"
import carPlaceholder from "@/assets/car-placeholder.jpg"

type Props = {
  card: FeedCard
  style?: React.CSSProperties
}

export const SwipeCard: React.FC<Props> = ({ card, style }) => {
  const img = card.image || carPlaceholder
  return (
    <article
      className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl border border-border bg-card select-none touch-pan-y"
      style={style}
    >
      <div className="aspect-[4/5] sm:aspect-[3/4] md:h-[420px] w-full bg-muted">
        <img src={img} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
      </div>
      <div className="p-4 space-y-1">
        <h2 className="text-xl font-bold font-display">
          {card.make} {card.model}
        </h2>
        <p className="text-muted-foreground text-sm">
          {card.year} · {card.mileage.toLocaleString()} km
        </p>
        <p className="text-lg font-semibold text-orange">€{card.price.toLocaleString()}</p>
      </div>
    </article>
  )
}
