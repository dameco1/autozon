

# Partnership Integration: Qover, finAPI, Local Banks

## What We're Building

Integrate real partnership APIs into the platform and document the full cost/revenue analysis in both the data room and roadmap.

## Plan

### 1. Create Partnership Cost & Revenue Analysis Document

New file: `public/docs/partnership-costs.md` (+ `docs/` mirror)

Content:
- **Qover (Embedded Insurance)**: Setup cost (€0), revenue model (15-25% commission), per-policy revenue (€120-300), Y1-Y3 projections, API integration effort, technical requirements
- **finAPI (Open Banking)**: Pricing tiers (€200-500/mo base + per-call), SEPA vs Stripe savings, identity verification costs, PSD2 compliance notes
- **Local Banking Partners (BAWAG, Santander)**: Referral model (€150-200/funded deal), integration effort (tracking links vs API), projected Y1-Y3 revenue
- **Nordea**: Why deprioritized (no AT market coverage)
- **Consolidated ROI table**: Cost vs. revenue per integration, break-even timeline, priority ranking

### 2. Update Partnership Pipeline Document

Edit `docs/partnership-pipeline.md` and `public/docs/partnership-pipeline.md`:
- Add **Qover** to Insurance Partners table (API-first, pan-EU, High priority, "Evaluate" status)
- Add **finAPI** to Technology & Data Partners table (PSD2 open banking, AT/DE, Medium priority)
- Update Partnership Outreach Tracker with Qover and finAPI rows
- Add new section: **7. API Integration Cost Analysis** summarizing setup costs, ongoing costs, and expected ROI per partner

### 3. Update Roadmap

Edit `docs/roadmap.md` and `public/docs/roadmap.md`:
- Add to **V1.5**: `Qover embedded insurance API — real-time motor insurance quotes in transaction flow`
- Add to **V1.5**: `finAPI open banking — SEPA payments, identity verification (PSD2)`
- Add to **V1.5**: `Bank referral tracking — BAWAG/Santander click-through attribution and conversion tracking`
- Add to **V2**: `Qover policy binding — full embedded insurance purchase flow`
- Add to **V2**: `finAPI credit checks — automated affordability scoring for financing`
- Update Revenue Model section to reflect partnership revenue streams

### 4. Register in Data Room Index

Edit `src/pages/Documentation.tsx`:
- Add "Partnership Costs & ROI" entry to Section 6.0 (Operations & Launch) with status "ready"

### 5. Update Revenue Model Document

Edit `docs/revenue-model.md` and `public/docs/revenue-model.md`:
- Add partnership revenue projections section with Qover, finAPI, and bank referral numbers
- Update Y1-Y3 revenue scenarios to include partnership income

## Files Changed

| File | Action |
|---|---|
| `public/docs/partnership-costs.md` | Create |
| `docs/partnership-costs.md` | Create |
| `docs/partnership-pipeline.md` | Edit — add Qover, finAPI |
| `public/docs/partnership-pipeline.md` | Edit — add Qover, finAPI |
| `docs/roadmap.md` | Edit — add V1.5/V2 items |
| `public/docs/roadmap.md` | Edit — add V1.5/V2 items |
| `docs/revenue-model.md` | Edit — add partnership revenue |
| `public/docs/revenue-model.md` | Edit — add partnership revenue |
| `src/pages/Documentation.tsx` | Edit — add new doc entry |

