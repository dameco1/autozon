# Database Schema

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   profiles   │     │     cars     │     │   car_models     │
│──────────────│     │──────────────│     │──────────────────│
│ id (PK)      │     │ id (PK)      │     │ id (PK)          │
│ user_id (FK) │     │ owner_id     │     │ make, model      │
│ full_name    │     │ make, model  │     │ variant, year    │
│ phone, city  │     │ year, price  │     │ body_type, fuel  │
│ country      │     │ fair_value   │     │ power_hp         │
│ language     │     │ mileage      │     │ msrp_eur         │
│ avatar_url   │     │ status       │
└──────────────┘     │ body_type    │     ┌──────────────────┐
                     │ fuel_type    │     │     buyers       │
┌──────────────┐     │ equipment[]  │     │──────────────────│
│    offers    │     │ photos[]     │     │ id (PK)          │
│──────────────│     │ condition_*  │     │ name, location   │
│ id (PK)      │◄────│ detected_*   │     │ budget_min/max   │
│ car_id (FK)  │     │ placement_*  │     │ preferred_makes  │
│ buyer_id     │     └──────────────┘     │ preferred_fuel   │
│ seller_id    │            │             │ preferred_body   │
│ amount       │            │             │ intent_level     │
│ counter_amt  │     ┌──────┴───────┐     └──────────────────┘
│ agreed_price │     │   matches    │
│ current_round│     │──────────────│     ┌──────────────────┐
│ status       │     │ id (PK)      │     │ user_preferences │
└──────┬───────┘     │ car_id (FK)  │     │──────────────────│
       │             │ user_id      │     │ id (PK)          │
       │             │ match_score  │     │ user_id           │
┌──────┴───────┐     │ status       │     │ budget range     │
│ acquisition_ │     └──────────────┘     │ preferred_*      │
│ quotes       │                          │ usage_pattern    │
│──────────────│     ┌──────────────┐     │ onboarding_done  │
│ id (PK)      │     │  car_views   │     └──────────────────┘
│ offer_id (FK)│     │──────────────│
│ partner_id   │     │ car_id (FK)  │     ┌──────────────────┐
│ quote_type   │     │ viewer_id    │     │  notifications   │
│ monthly_pmt  │     └──────────────┘     │──────────────────│
│ term_months  │                          │ user_id          │
│ interest_rate│     ┌──────────────┐     │ title, message   │
└──────────────┘     │car_shortlists│     │ type, link       │
                     │──────────────│     │ read (bool)      │
┌──────────────┐     │ car_id (FK)  │     └──────────────────┘
│chat_messages │     │ user_id      │
│──────────────│     └──────────────┘     ┌──────────────────┐
│ user_id      │                          │financing_partners│
│ role         │     ┌──────────────┐     │──────────────────│
│ content      │     │buyer_select. │     │ name, type       │
└──────────────┘     │──────────────│     │ base_rate        │
                     │ car_id (FK)  │     │ is_active        │
                     │ user_id      │     └──────────────────┘
                     │ liked, round │
                     └──────────────┘
```

## Tables Summary

| Table | Rows (approx) | Purpose |
|---|---|---|
| `profiles` | 1 per user | Extended user info (name, phone, city) |
| `cars` | Growing | Car listings with valuation data |
| `car_models` | ~2,700+ | Reference data: 48 European makes, 255+ models, all variants with MSRP (AI-seeded) |
| `offers` | Per negotiation | Multi-round offer/counter-offer tracking |
| `matches` | Auto-generated | Car-to-buyer match scores |
| `buyers` | Seed + real | Buyer profiles (some seeded for demo) |
| `buyer_selections` | Per swipe | Tinder-style like/dislike per round |
| `car_shortlists` | Per save | User's saved/bookmarked cars |
| `car_views` | Per view | View tracking for analytics |
| `notifications` | Per event | In-app notification system |
| `chat_messages` | Per chat | Concierge AI conversation history |
| `user_preferences` | 1 per user | Buyer onboarding preferences |
| `acquisition_quotes` | Per quote | Financing/leasing quote from partners |
| `financing_partners` | Seed | Bank/leasing partner profiles |

## Security (Row-Level Security)

All tables have RLS enabled. Key policies:
- **cars**: Owners can CRUD their own; all authenticated users can SELECT available cars; admins full access
- **profiles**: Users can only read/write their own profile; admins can view/update all
- **offers**: Buyer and seller of the offer can read/update; admins full access
- **notifications**: Users can only see their own notifications; admins can view all
- **chat_messages**: Users can only access their own chat history
- **car_models**: All authenticated users can read; no public write access (seeded via edge function with service role)
