# Public Access Flow — Unauthenticated User Journey

This diagram shows what anonymous visitors can access without creating an account, and when authentication is required.

```mermaid
flowchart TD
    subgraph PUBLIC["Public Access - No Login Required"]
        P1[Landing Page] --> P2[Browse Car Catalog /cars]
        P2 --> P3["Search Filters\n- Make / Model / Year\n- Fuel / Body / Transmission"]
        P3 --> P4["View Available Cars\n- placement_paid = true\n- status = available"]
        P4 --> P4a["View Car Details /car/:id\n- Full photos, specs, equipment\n- Fair value breakdown\n- Market comparison"]
        P4a --> P5{Want to interact?}
    end

    subgraph ZONI["Zoni AI Chat - Guest Mode"]
        P1 --> Z1["Open Zoni Chat"]
        Z1 --> Z2["Guest Mode\nuserId = 'anonymous'"]
        Z2 --> Z3["Available: Car search,\nGeneral questions,\nPlatform info"]
        Z2 --> Z4["Not Available: Lookup offers,\nLookup matches,\nCreate tickets"]
    end

    subgraph AUTH["Login / Sign Up Required"]
        P5 -->|"Shortlist / Make Offer"| L1[Sign Up or Login]
        L1 --> L2[Email Verification]
        L2 --> L3[Email OTP 2FA]
        L3 --> I1[Intent Selection]
    end

    subgraph BUYER["Buyer Path"]
        I1 -->|Buying| B1[Onboarding - 12 Preferences]
        B1 --> B2["Car Selection\n5D Match Scoring"]
        B2 --> B3[Car Detail + Shortlist]
        B3 --> B4[Make Offer]
        B4 --> B5["Negotiation\n1-3 Rounds"]
        B5 -->|Accepted| B6["Transaction Wizard\n5 Steps"]
        B6 --> B7[Car Acquired]
    end

    subgraph SELLER["Seller Path"]
        I1 -->|Selling| S1[Seller Dashboard]
        S1 --> S2["Car Upload Wizard\n6 Steps"]
        S2 --> S3["Fair Value Calculation\n10-Factor Model"]
        S3 --> S4["Pay for Placement\nStripe Checkout"]
        S4 -->|Paid| S5["Car Visible to Public\nand Authenticated Users"]
        S4 -->|Not Paid| S6["Car Hidden\nOnly visible to owner"]
        S5 --> S7[Receive Offers]
        S7 --> S8["Negotiate\nAccept / Counter / Reject"]
        S8 -->|Accepted| S9["Transaction Wizard\nSeller Side"]
        S9 --> S10[Car Sold]
    end

    subgraph VISIBILITY["Data Visibility Rules"]
        V1["Anonymous Users"] -->|Can See| V2["Car Catalog - car_models\nAvailable Cars with Paid Placement\nFull Car Details + Photos\nQ&A Page\nLegal Pages"]
        V1 -->|Cannot See| V3["Profiles / Offers / Negotiations\nShortlists / Transactions\nDashboard / Upload"]
        V4["Authenticated Users"] -->|Can See| V5["Everything Anonymous Can\n+ Own Profile and Preferences\n+ Own Offers and Shortlists\n+ Own Transactions\n+ Full Zoni capabilities"]
        V6["Admins"] -->|Can See| V7["All Data\nAll Users / All Cars\nAll Transactions\nAgent Activity Logs\nSupport Tickets"]
    end
```

---

## Key Visibility Summary

| Resource | Anonymous | Authenticated | Admin |
|----------|-----------|---------------|-------|
| **Car Catalog (car_models)** | Read | Read | Read |
| **Available Cars (placement paid)** | Read | Read | Full |
| **Car Detail Page** | Read | Read | Full |
| **Unpaid / Draft Cars** | Hidden | Owner only | Full |
| **Profiles** | Hidden | Own only | Full |
| **Offers / Negotiations** | Hidden | Participant only | Full |
| **Transactions** | Hidden | Participant only | Full |
| **Shortlists** | Hidden | Own + car owner | Full |
| **Zoni AI Chat** | Guest (search + FAQ only) | Full (all tools) | Full |
| **Support Tickets** | Hidden | Own only | Full |
| **Agent Activity Logs** | Hidden | Hidden | Full |

## RLS Enforcement

Anonymous access is enforced through Row-Level Security policies:
- `cars` table: `anon` role can SELECT where `status = 'available' AND placement_paid = true`
- `car_models` table: `anon` role can SELECT all rows
- `cars_public` view uses `security_invoker = true` to enforce RLS
- Storage: `anon` users can upload to `temp/` prefix in `car-images` bucket (for Sell Wizard pre-auth uploads)

---

*Document status: V2 — Updated April 2026 with anonymous browsing, Zoni guest mode, and storage access rules.*
