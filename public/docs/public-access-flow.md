# Public Access Flow — Unauthenticated User Journey

This diagram shows what anonymous visitors can access without creating an account, and when authentication is required.

```mermaid
flowchart TD
    subgraph PUBLIC["Public Access - No Login Required"]
        P1[Landing Page] --> P2[Browse Car Catalog]
        P2 --> P3["Search Filters\n- Make / Model / Year\n- Fuel / Body / Transmission"]
        P3 --> P4["View Available Cars\n- placement_paid = true\n- status = available"]
        P4 --> P5{Want to interact?}
    end

    subgraph AUTH["Login / Sign Up Required"]
        P5 -->|Yes| L1[Sign Up or Login]
        L1 --> L2[Email Verification]
        L2 --> L3[MFA Enrollment]
        L3 --> I1[Intent Selection]
    end

    subgraph BUYER["Buyer Path"]
        I1 -->|Buying| B1[Onboarding - 12 Preferences]
        B1 --> B2["Car Selection\n5D Match Scoring"]
        B2 --> B3[Car Detail + Shortlist]
        B3 --> B4[Make Offer]
        B4 --> B5["Negotiation\n1-5 Rounds"]
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
        V1["Anonymous Users"] -->|Can See| V2["Car Catalog - car_models\nAvailable Cars with Paid Placement"]
        V1 -->|Cannot See| V3["Prices / Offers / Profiles\nShortlists / Negotiations\nTransaction Details"]
        V4["Authenticated Users"] -->|Can See| V5["Everything Anonymous Can\n+ Own Profile and Preferences\n+ Own Offers and Shortlists\n+ Own Transactions"]
        V6["Admins"] -->|Can See| V7["All Data\nAll Users / All Cars\nAll Transactions"]
    end
```

---

## Key Visibility Summary

| Resource | Anonymous | Authenticated | Admin |
|----------|-----------|---------------|-------|
| **Car Catalog (car_models)** | Read | Read | Read |
| **Available Cars (placement paid)** | Read | Read | Full |
| **Unpaid / Draft Cars** | Hidden | Owner only | Full |
| **Profiles** | Hidden | Own only | Full |
| **Offers / Negotiations** | Hidden | Participant only | Full |
| **Transactions** | Hidden | Participant only | Full |
| **Shortlists** | Hidden | Own + car owner | Full |
