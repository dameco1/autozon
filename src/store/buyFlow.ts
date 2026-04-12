import { create } from "zustand"

export type FeedCard =
  | { kind: "car"; id: string; make: string; model: string; year: number; price: number; mileage: number; image: string | null }
  | { kind: "listing"; id: string; make: string; model: string; year: number; price: number; mileage: number; image: string | null }

type BuyFlowState = {
  feed: FeedCard[]
  currentIndex: number
  isLoading: boolean
  setFeed: (cards: FeedCard[]) => void
  setIndex: (i: number) => void
  setLoading: (v: boolean) => void
  advance: () => void
  reset: () => void
}

export const useBuyFlowStore = create<BuyFlowState>((set) => ({
  feed: [],
  currentIndex: 0,
  isLoading: false,
  setFeed: (feed) => set({ feed, currentIndex: 0 }),
  setIndex: (currentIndex) => set({ currentIndex }),
  setLoading: (isLoading) => set({ isLoading }),
  advance: () => set((s) => ({ currentIndex: s.currentIndex + 1 })),
  reset: () => set({ feed: [], currentIndex: 0, isLoading: false }),
}))
