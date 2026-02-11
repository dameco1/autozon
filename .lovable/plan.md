

# Add Car Imagery to Homepage

## Approach: Animated Car Image Ticker + Visual Hero

Combine two elements for maximum visual impact without cluttering the design.

---

## Change 1: Hero Section — Split Layout with Car Showcase

Transform the hero from centered text to a split layout:
- **Left side**: Headline, subtitle, and CTA buttons (existing content)
- **Right side**: A stacked/overlapping arrangement of 3 car image cards with slight rotation and shadow, creating a "deck of cards" effect with subtle framer-motion float animation

On mobile, the car images stack below the text.

## Change 2: Auto-Scrolling Car Ticker

Add a horizontal auto-scrolling strip of car images between the Hero and Problem sections:
- Uses the existing Embla carousel (already installed) with auto-scroll
- Shows 4-6 car thumbnails in rounded cards sliding continuously
- Subtle fade-out on edges for a polished look
- No user interaction needed — purely decorative

## Change 3: Placeholder Images

Use 5-6 high-quality car photos. Options:
- Use Unsplash URLs (e.g., `https://images.unsplash.com/photo-xxxxx`) for realistic car photos — free, no setup needed
- Or the user can upload their own images through chat

---

## Technical Details

### Files to Modify

**`src/pages/Index.tsx`**
- Refactor hero section from `text-center` to a `grid grid-cols-1 lg:grid-cols-2` layout
- Left column: existing headline, subtitle, buttons (left-aligned on desktop)
- Right column: new `HeroCarShowcase` component with 3 overlapping car image cards using framer-motion for subtle floating
- Add a new `CarTicker` section between Hero and Problem sections

**`src/components/home/HeroCarShowcase.tsx`** (new file)
- Three car images positioned with absolute positioning, slight rotations (-3deg, 0deg, 3deg)
- Each wrapped in a rounded card with shadow
- framer-motion `animate` for gentle up/down drift on each card (staggered timing)

**`src/components/home/CarTicker.tsx`** (new file)
- Horizontal auto-scrolling strip using CSS animation (`@keyframes scroll`)
- Duplicate the image set for seamless infinite loop
- Gradient fade on left/right edges using `mask-image`
- 6 car images in rounded-xl cards

**`src/components/home/carImages.ts`** (new file)
- Array of placeholder car image URLs (Unsplash) with alt text
- Centralized so both components share the same images

### Dependencies
- No new dependencies — uses framer-motion (already installed) and CSS animations
- Embla carousel is available but pure CSS infinite scroll is simpler for a ticker

### Responsive Behavior
- Desktop: Split hero (text left, cars right) + full-width ticker
- Mobile: Stacked hero (text on top, car cards below, smaller) + ticker with fewer visible cards

