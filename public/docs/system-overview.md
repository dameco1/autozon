# System Architecture Overview

This diagram provides a high-level view of Autozon's backend services, security layer, admin capabilities, and cross-cutting features.

```mermaid
flowchart TD
    subgraph SECURITY["Security Layer"]
        SEC1["Self-Dealing Prevention\n- RLS: buyer != seller\n- Frontend Guards\n- Shortlist Blocks"]
        SEC2["Re-Purchase Guard\n- Sold Car Redirect\n- to Transaction Summary"]
        SEC3["MFA Required\n- TOTP Enrollment\n- All Authenticated Routes"]
    end

    subgraph BACKEND["Backend Services"]
        BE1["Edge Functions:\n- concierge-chat AI Assistant\n- detect-damage AI Scan\n- generate-description AI\n- market-comparison\n- vin-decode VINCARIO\n- seed-car-models\n- create-placement-checkout\n- stripe-webhook\n- verify-placement\n- admin-actions"]
        BE2["Database Tables:\n- cars / car_models\n- profiles (+ kyc_status)\n- user_preferences (+ sports, towing)\n- offers / transactions\n- matches / car_shortlists\n- buyer_selections / car_views\n- financing_partners\n- acquisition_quotes\n- notifications\n- chat_messages\n- appraisal_feedback\n- user_roles"]
        BE3["External APIs:\n- Stripe Payments\n- Lovable AI Models\n- VINCARIO VIN Decode"]
    end

    subgraph ADMIN["Admin Dashboard"]
        AD1["Overview Stats\n- Users / Cars / Revenue"]
        AD2["Cars Management\n- All Listings Table"]
        AD3["Users Management\n- Profiles / Suspend"]
        AD4["Negotiations Monitor\n- All Active Offers"]
        AD5["Activity Feed\n- Recent Actions"]
        AD6["Appraisal Accuracy\n- Formula vs Market"]
        AD7["Transactions Overview\n- All Deals"]
    end

    subgraph FEATURES["Cross-Cutting Features"]
        F1["AI Concierge Chat\n- SSE Streaming\n- Per-User History\n- Market Insights"]
        F2["Notifications Bell\n- Real-time Updates\n- Offer / Match Alerts"]
        F3["i18n EN / DE\n- Full Localization\n- All User Flows"]
        F4["PWA Support\n- Offline Capable\n- Install Prompt\n- App Icons"]
        F5["SEO\n- Meta Tags\n- Sitemap\n- robots.txt\n- JSON-LD"]
        F6["Cookie Consent\n- GDPR Compliant"]
    end
```

---

## Edge Functions Detail

| Function | Purpose | Integration |
|----------|---------|-------------|
| `concierge-chat` | AI assistant for user support | Lovable AI (Gemini) |
| `detect-damage` | Photo-based damage detection | Lovable AI (Gemini Vision) |
| `generate-description` | Auto-generate car listing text | Lovable AI |
| `market-comparison` | Fetch comparable market data | Lovable AI |
| `vin-decode` | Decode VIN for auto-fill | VINCARIO API |
| `seed-car-models` | Populate car model database | Lovable AI |
| `create-placement-checkout` | Premium listing payment | Stripe |
| `stripe-webhook` | Handle payment confirmations | Stripe |
| `verify-placement` | Check placement payment status | Stripe |
| `admin-actions` | Admin CRUD operations | Internal |

## Database Tables (13 Total)

| Table | Purpose |
|-------|---------|
| `cars` | Vehicle listings with all attributes |
| `car_models` | Reference model data with MSRP |
| `profiles` | User profiles with lifestyle data |
| `user_preferences` | Buyer onboarding preferences |
| `offers` | Negotiation offers between buyer/seller |
| `transactions` | Full transaction journey tracking |
| `matches` | Buyer-car match scores |
| `car_shortlists` | Buyer saved cars |
| `buyer_selections` | Like/skip decisions |
| `car_views` | View tracking analytics |
| `financing_partners` | Bank/insurance partner data |
| `acquisition_quotes` | Financing/leasing quotes |
| `notifications` | In-app notification system |
| `chat_messages` | AI concierge conversation history |
| `appraisal_feedback` | Valuation accuracy tracking |
| `user_roles` | RBAC role assignments |
