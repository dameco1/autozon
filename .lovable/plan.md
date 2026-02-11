

# Combined Homepage Redesign

## What's Changing

### 1. Logo and Branding
- Remove the car icon from the logo everywhere (navbar and footer)
- Make the logo text bigger (`text-2xl` in navbar)
- Add "buy. sell. cars." tagline directly under the logo
- Add "Like Amazon, only for cars!" as a secondary line in the navbar

### 2. Hero Section
- New headline: **"Fair Value. Best Prices."** with accent **"Zero Friction."**
- Remove the green pill/badge element above the headline ("Fair value. Zero friction." rounded rectangle)
- Update subtitle to address both buyers AND sellers
- Change buttons: **"Sell My Car"** and **"Find My Next Car"** (both go to `/intent`)
- Replace the blurry background circles with subtle animated floating dots using framer-motion

### 3. Section Badges Removed
- Remove all the colored rounded-rectangle badges ("The Problem", "The Solution", "How It Works", "Why Autozon")
- Replace each with a clean, minimal accent line (a short green horizontal bar) above the section title

### 4. Footer
- Remove car icon, update tagline to "buy. sell. cars."

### 5. Translations
- All copy updates applied to both English and German

---

## Technical Details

### Files Modified

**`src/components/Navbar.tsx`**
- Remove `Car` import from lucide-react
- Increase logo text to `text-2xl`
- Add a flex-col wrapper around the logo with two small tagline lines below:
  - `"buy. sell. cars."` in `text-[10px] text-silver/50 tracking-widest uppercase`
  - `"Like Amazon, only for cars!"` in `text-[10px] text-silver/40 italic`
- Same changes in the mobile menu logo area

**`src/pages/Index.tsx`**
- Remove `Car` icon import
- Hero: delete the pill badge `<motion.div>` (the "Fair value. Zero friction." rounded element)
- Hero: replace the two static blur circles with 5 small animated dots using framer-motion `animate` with infinite looping `y` drift
- Hero: update headline to use new translation keys
- Hero: update CTA buttons -- primary "Sell My Car" navigating to `/intent`, outline "Find My Next Car" navigating to `/intent`
- Problem, Solution, How It Works, Trust sections: replace each `<span className="inline-block px-3 py-1 rounded-full ...">` badge with `<div className="w-12 h-1 bg-primary rounded-full mx-auto mb-4" />`
- Footer: remove `Car` icon, use new tagline key

**`src/i18n/translations.ts`**
- Add to `nav` (EN): `tagline: "buy. sell. cars."`, `amazonTagline: "Like Amazon, only for cars!"`
- Add to `nav` (DE): `tagline: "buy. sell. cars."`, `amazonTagline: "Wie Amazon, nur für Autos!"`
- Update EN `hero`: title "Fair Value. Best Prices.", titleAccent "Zero Friction.", subtitle rewritten for buyers+sellers, cta "Sell My Car", ctaSecondary "Find My Next Car"
- Update DE `hero`: matching German translations
- Update EN/DE `footer.tagline`: "buy. sell. cars."

