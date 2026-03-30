

# Redesign Investor Pitch Cover Slide

## Goal
Replace the text-heavy cover with a visually striking, investment-grade opener featuring seller matching, 10-day sales cycle, and a warm investor welcome.

## Layout

```text
┌─────────────────────────────────────────────────────────┐
│  [Car icon]  autozon              Investor Deck 2026    │
│              Sell Fair. Buy Smart.                       │
│                                                         │
│  The AI-Powered Marketplace                             │
│  Giving Car Sellers Their Margin Back                   │
│                                                         │
│  "Welcome — we're building the trust layer the €300B    │
│   European used-car market has never had. Here's why    │
│   now is the time to join us."                          │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  €300B+  │ │   30%    │ │   €49    │ │ 10 Days  │   │
│  │ EU Mkt   │ │ Lost to  │ │ Flat Fee │ │ Avg Sale │   │
│  │          │ │ Dealers  │ │ to List  │ │  Cycle   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│  AI photo analysis · live market pricing ·              │
│  lifestyle-aware seller matching ·                      │
│  structured negotiation · full transaction pipeline     │
│                                                         │
│  [4 car images in rounded frames]                       │
│                                                         │
│  Emina Mukic-Buljubasic, CEO · Damir Buljubasic, CIO   │
└─────────────────────────────────────────────────────────┘
```

## Changes from Current SlideCover

1. **Replace 4 dense paragraphs** with bold two-line headline
2. **Add 1-2 sentence investor welcome** — warm, confident tone bridging the headline to the stats
3. **Four stat cards** — €300B+ market, 30% dealer margin gap, €49 flat fee, 10-day avg sale cycle
4. **Seller matching callout** in capabilities row
5. **Car image strip** using existing `carImg1`–`carImg4`
6. **Clean founder footer**

## File Changed

| File | Action |
|---|---|
| `src/components/pitch/slides.tsx` | Rewrite `SlideCover` component (~lines 33-73) |

No new files or dependencies.

