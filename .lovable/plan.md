

## Remove the badge box around "The Fair Car Market"

**What changes:**
- In `src/components/home/HeroSection.tsx` (lines 41-47), replace the styled pill/badge container (`rounded-full border border-primary/20 bg-primary/5`) with a simple text element
- Remove the green pulsing dot (`w-1.5 h-1.5 rounded-full bg-primary animate-pulse`)
- Keep the animated text "The fair car market" with the same uppercase styling and primary color

**Result:** The text "THE FAIR CAR MARKET" will appear as standalone styled text above the headline, without any border, background, or dot indicator.

---

### Technical Details

**File:** `src/components/home/HeroSection.tsx`

Replace the `motion.div` badge (lines 41-47) with a simpler element:
```tsx
<motion.span
  className="text-xs font-medium text-primary tracking-wide uppercase mb-8 block"
  initial="hidden" animate="visible" variants={fadeUp} custom={0}
>
  The fair car market
</motion.span>
```

This removes the `inline-flex`, `border`, `bg-primary/5`, `rounded-full`, padding, and the pulsing dot while keeping the animation and text styling intact.

