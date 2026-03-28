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
│ avatar_url   │     │ status       │     └──────────────────┘
│ relationship │     │ body_type    │
│ has_kids     │     │ fuel_type    │     ┌──────────────────┐
│ num_kids     │     │ equipment[]  │     │     buyers       │
│ car_purpose  │     │ photos[]     │     │──────────────────│
│ current_car  │     │ condition_*  │     │ id (PK)          │
│ budget_max   │     │ detected_*   │     │ name, location   │
└──────────────┘     │ placement_*  │     │ budget_min/max   │
                     └──────────────┘     │ preferred_makes  │
┌──────────────┐            │             │ preferred_fuel   │
│    offers    │            │             │ preferred_body   │
│──────────────│     ┌──────┴───────┐     │ intent_level     │
│ id (PK)      │     │   matches    │     └──────────────────┘
│ car_id (FK)  │     │──────────────│
│ buyer_id     │     │ id (PK)      │     ┌──────────────────┐
│ seller_id    │     │ car_id (FK)  │     │ user_preferences │
│ amount       │     │ user_id      │     │──────────────────│
│ counter_amt  │     │ match_score  │     │ id (PK)          │
│ agreed_price │     │ status       │     │ user_id          │
│ current_round│     └──────────────┘     │ budget range     │
│ status       │                          │ preferred_*      │
└──────┬───────┘     ┌──────────────┐     │ usage_pattern    │
       │             │  car_views   │     │ commute_distance │
┌──────┴───────┐     │──────────────│     │ parking_type     │
│ acquisition_ │     │ car_id (FK)  │     │ family_size      │
│ quotes       │     │ viewer_id    │     │ ownership_pref   │
│──────────────│     └──────────────┘     │ insurance_tol.   │
│ id (PK)      │                          │ onboarding_done  │
│ offer_id (FK)│     ┌──────────────┐     └──────────────────┘
│ partner_id   │     │car_shortlists│
│ quote_type   │     │──────────────│     ┌──────────────────┐
│ monthly_pmt  │     │ car_id (FK)  │     │  notifications   │
│ term_months  │     │ user_id      │     │──────────────────│
│ interest_rate│     └──────────────┘     │ user_id          │
└──────────────┘                          │ title, message   │
                     ┌──────────────┐     │ type, link       │
┌──────────────┐     │buyer_select. │     │ read (bool)      │
│chat_messages │     │──────────────│     └──────────────────┘
│──────────────│     │ car_id (FK)  │
│ user_id      │     │ user_id      │     ┌──────────────────┐
│ role         │     │ liked, round │     │financing_partners│
│ content      │     └──────────────┘     │──────────────────│
└──────────────┘                          │ name, type       │
                     ┌──────────────┐     │ base_rate        │
                     │ transactions │     │ is_active        │
                     │──────────────│     └──────────────────┘
                     │ offer_id (FK)│
                     │ car_id (FK)  │     ┌──────────────────┐
                     │ buyer/seller │     │   user_roles     │
                     │ agreed_price │     │──────────────────│
                     │ current_step │     │ user_id (FK)     │
                     │ contract_*   │     │ role (enum)      │
                     │ payment_*    │     │ admin/mod/user   │
                     │ insurance_*  │     └──────────────────┘
                     │ status       │
                     └──────────────┘
```

## Tables Summary

| Table | Rows (approx) | Purpose |
|---|---|---|
| `profiles` | 1 per user | Extended user info (name, phone, city, **relationship status, kids, car purpose, current car, budget**) — feeds lifestyle matching |
| `cars` | Growing | Car listings with valuation data |
| `car_models` | ~2,700+ | Reference data: 48 European makes, 255+ models, all variants with MSRP (AI-seeded) |
| `offers` | Per negotiation | Multi-round offer/counter-offer tracking |
| `transactions` | Per deal | Full transaction lifecycle (method → contract → payment → insurance → complete) |
| `matches` | Auto-generated | Car-to-buyer match scores |
| `buyers` | Seed + real | Buyer profiles (some seeded for demo) |
| `buyer_selections` | Per swipe | Tinder-style like/dislike per round |
| `car_shortlists` | Per save | User's saved/bookmarked cars |
| `car_views` | Per view | View tracking for analytics |
| `notifications` | Per event | In-app notification system (with trigger on offer status changes) |
| `chat_messages` | Per chat | Concierge AI conversation history |
| `user_preferences` | 1 per user | Buyer onboarding preferences (budget, body types, fuel, transmission, commute, parking, family size, insurance tolerance, **preferred colors, timing**) — also populated optionally at signup |
| `acquisition_quotes` | Per quote | Financing/leasing quote from partners |
| `financing_partners` | Seed | Bank/leasing partner profiles |
| `user_roles` | Per role assignment | Role-based access control (admin, moderator, user) — separate from profiles for security |

## Profiles Table — Lifestyle Fields

The `profiles` table stores lifestyle data collected during registration for use in the matching algorithm:

| Column | Type | Purpose |
|---|---|---|
| `relationship_status` | text | Single, married, divorced → body type affinity |
| `has_kids` | boolean | Whether user has children |
| `num_kids` | integer | Number of children → seating requirements |
| `car_purpose` | text | Daily, work, pleasure, summer, winter → feature affinity |
| `current_car` | text | Free text (e.g. "BMW 3 Series 2019") → brand loyalty, upgrade path, segment continuity |
| `budget_max` | numeric | Fallback budget if preferences not set |

## Security (Row-Level Security)

All tables have RLS enabled. Key policies:
- **cars**: Owners can CRUD their own; all authenticated users can SELECT available cars; admins full access
- **profiles**: Users can only read/write their own profile; admins can view/update all
- **offers**: Buyer and seller of the offer can read/update; buyers cannot create offers on own cars (`buyer_id != seller_id`); admins full access
- **car_shortlists**: Users can CRUD own; cannot shortlist own cars; car owners can view shortlists on their cars
- **transactions**: Buyers and sellers can view/update own; buyers cannot create transactions on own cars (`buyer_id != seller_id`); admins full access; secure RPC functions for step transitions
- **notifications**: Users can only see their own notifications; admins can view all; trigger auto-generates notifications on offer status changes
- **chat_messages**: Users can only access their own chat history
- **car_models**: All authenticated users can read; no public write access (seeded via edge function with service role)
- **user_roles**: Users can only view their own roles; `has_role()` security-definer function prevents RLS recursion
