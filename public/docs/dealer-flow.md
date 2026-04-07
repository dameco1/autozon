# Dealer / Business Seller Flow — B2P & B2B Transactions

This diagram maps the complete journey for business sellers (dealers, Unternehmen, Haendler) including registration, listing, and role-specific legal frameworks.

```mermaid
flowchart TD
    subgraph REGISTER["Business Registration"]
        D1[Landing Page] --> D2["Sign Up /signup"]
        D2 --> D3["Select: Business Entity\nUnternehmen / Haendler"]
        D3 --> D4["Business Details\n- Company Name\n- UID Number ATU...\n- Commercial Registry Number FN...\n- Authorized Representative\n- Full Name / Email / Password"]
        D4 --> D5[Email Verification]
        D5 --> D6[MFA Enrollment]
        D6 --> D7[Intent Selection]
    end

    subgraph LISTING["Car Listing - Same as Private"]
        D7 -->|Selling| D8[Seller Dashboard]
        D8 --> D9["Car Upload Wizard\n6 Steps identical to Private"]
        D9 --> D10["Fair Value Calculation\nSame 10-Factor Model"]
        D10 --> D11["Pay for Placement\n49 EUR via Stripe"]
        D11 --> D12["Car Listed\nVisible to All Users"]
    end

    subgraph NEGOTIATE["Negotiation"]
        D12 --> N1["Receive Buyer Offers\nor Make Own Offers"]
        N1 --> N2["Standard Negotiation\n1-5 Rounds"]
        N2 -->|Accepted| N3["Proceed to Transaction"]
    end

    subgraph LEGAL["Legal Framework Detection"]
        N3 --> L1{Buyer Type?}

        L1 -->|Private Buyer| L2["Business to Private - B2P\nConsumer Protection Applies"]
        L1 -->|Business Buyer| L3["Business to Business - B2B\nCommercial Law Applies"]

        L2 --> L4["B2P Contract Rules\n- KSchG Consumer Protection\n- 24-Month Warranty Mandatory\n- No Warranty Exclusion Allowed\n- Burden of Proof: 12 months buyer\n  then shifts to seller"]

        L3 --> L5["B2B Contract Rules\n- UGB 377 Inspection Obligation\n- Warranty Excludable by Agreement\n- Immediate Defect Reporting Required\n- Commercial Due Diligence Expected"]
    end

    subgraph TRANSACTION["Transaction Wizard"]
        L4 --> T1["Step 1: Method\nDigital or Manual"]
        L5 --> T1

        T1 --> T2["Step 2: Contract\nRole-Specific Template\n- OEAMTC Austria\n- ADAC Germany"]

        T2 --> T3["Step 3: Payment\n- Wire Transfer\n- Credit Card max 10K\n- Bank Financing\n- Leasing Options"]

        T3 --> T4["Step 4: Insurance\n- Haftpflicht\n- Teilkasko\n- Vollkasko\n- Skip Option"]

        T4 --> T5["Step 5: Ownership Transfer\n11-Step Checklist\nAustrian Legal Order"]
    end

    subgraph KYC["Identity Verification"]
        T2 -.->|Required| K1["KYC for Business\n- ID of Authorized Rep\n- Selfie Verification\n- Company Address Verification"]
        K1 -.-> K2["Status: Verified"]
    end

    subgraph COMPARISON["Private vs Business Comparison"]
        C1["Private Seller P2P"] --> C2["No Warranty\nGewaehrleistungsausschluss"]
        C3["Business Seller B2P"] --> C4["24-Month Warranty\nKSchG Mandatory"]
        C5["Business Seller B2B"] --> C6["Warranty Excludable\nUGB 377 Applies"]
    end

    subgraph DOCUMENTS["Required Documents"]
        DOC1["Business Seller Must Provide:\n- Valid Business Registration\n- UID Number Verification\n- Authorized Representative ID\n- Vehicle Registration Certificate\n- Service Records"]
        DOC2["Business Buyer Must Provide:\n- Company Verification\n- Authorized Representative ID\n- Proof of Insurance"]
    end
```

---

## Legal Framework Summary

| Scenario | Seller | Buyer | Warranty | Key Law |
|----------|--------|-------|----------|---------|
| **P2P** | Private | Private | Excluded (Gewaehrleistungsausschluss) | ABGB |
| **B2P** | Business | Private | 24 months mandatory | KSchG (Consumer Protection) |
| **P2B** | Private | Business | Excluded, no consumer protection | ABGB |
| **B2B** | Business | Business | Excludable by agreement | UGB 377 |

## Business Registration Fields

| Field | Required | Format |
|-------|----------|--------|
| Company Name | Yes | Free text |
| UID Number | Yes | ATU + 8 digits |
| Commercial Registry Number | Yes | FN + number |
| Authorized Representative | Yes | Full name |
