import React, { useEffect } from "react"
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion"
import { SwipeCard } from "@/components/buy/SwipeCard"
import type { FeedCard } from "@/store/buyFlow"
import { Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const SWIPE_THRESHOLD = 80

type Props = {
  cards: FeedCard[]
  currentIndex: number
  onSwipeLeft: (card: FeedCard, index: number) => void
  onSwipeRight: (card: FeedCard, index: number) => void
}

export const SwipeDeck: React.FC<Props> = ({ cards, currentIndex, onSwipeLeft, onSwipeRight }) => {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-12, 12])
  const opacity = useTransform(x, [-200, -80, 0, 80, 200], [0.6, 1, 1, 1, 0.6])
  const card = cards[currentIndex]

  useEffect(() => {
    x.set(0)
  }, [currentIndex, x])

  if (!card) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>No more cars right now.</p>
      </div>
    )
  }

  const complete = (dir: 1 | -1) => {
    const idx = currentIndex
    if (dir === 1) onSwipeRight(card, idx)
    else onSwipeLeft(card, idx)
    x.set(0)
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      void animate(x, 400, { duration: 0.2 }).then(() => complete(1))
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      void animate(x, -400, { duration: 0.2 }).then(() => complete(-1))
    } else {
      void animate(x, 0, { duration: 0.2 })
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="relative h-[min(520px,70vh)] w-full">
        <motion.div
          key={currentIndex}
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={onDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y"
        >
          <SwipeCard card={card} />
        </motion.div>
      </div>
      <div className="flex justify-center gap-6">
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="rounded-full h-14 w-14 p-0 border-destructive text-destructive min-h-[48px] min-w-[48px]"
          aria-label="Skip"
          onClick={() => {
            void animate(x, -400, { duration: 0.2 }).then(() => complete(-1))
          }}
        >
          <X className="h-7 w-7" />
        </Button>
        <Button
          type="button"
          size="lg"
          className="rounded-full h-14 w-14 p-0 bg-orange text-orange-foreground min-h-[48px] min-w-[48px]"
          aria-label="Like"
          onClick={() => {
            void animate(x, 400, { duration: 0.2 }).then(() => complete(1))
          }}
        >
          <Heart className="h-7 w-7" />
        </Button>
      </div>
    </div>
  )
}
