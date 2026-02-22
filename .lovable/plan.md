

## Revamp Homepage Messaging: AI-Powered Identity

### Problem
The current homepage copy mentions AI only once ("AI-powered matching" in Trust section). For an AI-driven platform with AI valuation, AI damage detection, AI matching, and AI concierge, the messaging severely undersells the core differentiator.

### Strategy
Infuse "AI" into every section without making it feel forced. The narrative arc becomes:

**Hero** -> AI engine that knows your car's true worth
**Problem** -> Dealers use gut feeling; you deserve data + AI
**Solution** -> 5 AI-powered features (each explicitly names the AI capability)
**How It Works** -> AI scores, AI matches, AI handles
**Trust** -> AI-transparent, AI-fair, AI-fast
**CTA** -> Get your AI valuation in 2 minutes

### Proposed Copy Changes (EN + DE)

#### 1. Hero Section
- Badge: "The fair car market" -> **"AI-Powered Car Trading"**
- Title: "Fair Value. Best Prices." -> **"AI Knows Your Car's True Worth."**
- Title accent: "Zero Friction." -> **"You Keep the Profit."**
- Selling desc: Emphasize "AI Fair Value Engine analyzes 50+ data points in real time"
- Buying desc: Emphasize "AI matching algorithm finds your ideal car"
- Subtitle: Add "Powered by AI that analyzes thousands of market signals"

#### 2. Problem Section
- Description: Add contrast -- "Dealers use gut feeling. You deserve an AI that knows the real number."

#### 3. Solution Section
- Badge: "The Solution" -> **"AI-Powered Solution"**
- Feature titles rewritten:
  - "Fair-Value Pricing" -> **"AI Fair Value Engine"**
  - "Instant Buyer Matching" -> **"AI Smart Matching"**
  - "Next-Car Curation" -> **"AI Car Discovery"**
  - "Full Transaction Handling" -> **"AI-Assisted Transactions"**
  - "Depreciation Alerts" -> **"AI Depreciation Radar"**
- Descriptions updated to name specific AI capabilities (computer vision, market analysis, predictive modeling)

#### 4. How It Works
- Step descriptions updated:
  - "Enter your car details" -> **"Upload photos -- our AI analyzes them instantly"**
  - "Get your fair-value score instantly" -> **"AI calculates fair value from 50+ signals"**
  - "See matched buyers" -> **"AI matches you with verified buyers"**

#### 5. Trust Section
- Title: "Built on transparency." -> **"AI You Can Trust."**
- Pillars updated to reference AI:
  - "Intelligent" -> **"AI-Native"** with "Built from day one on machine learning..."
  - Others get AI context where natural

#### 6. CTA Section
- Title: "Your car's true value," -> **"Your AI-powered advantage,"**
- Subtitle: "Get your AI fair-value score in under 2 minutes."

#### 7. Hero Component Enhancement
- Add a subtle animated "AI-powered" chip/badge near the hero title (small green pill with a sparkle icon)
- The badge text: "Powered by AI" with a Brain/Sparkles icon

### Technical Changes

| File | Change |
|---|---|
| `src/i18n/translations.ts` | Update all EN + DE strings for hero, problem, solution, howItWorks, trust, cta sections |
| `src/components/home/HeroSection.tsx` | Change badge text from hardcoded "The fair car market" to use translation key; add AI badge with Sparkles icon |
| `src/components/home/SolutionSection.tsx` | Update icons array: Shield->Brain, Zap->Cpu, Target->Search, Truck->FileCheck, Bell->TrendingDown (more AI-relevant) |

### What Stays the Same
- Layout, animations, spacing, colors -- no structural changes
- German translations updated in parallel
- All other pages unaffected

