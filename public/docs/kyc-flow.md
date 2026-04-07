# KYC Verification Flow — Identity Verification via Didit SDK

This diagram maps the complete KYC (Know Your Customer) identity verification process, from trigger to verified status, including the Didit SDK integration and webhook synchronization.

```mermaid
flowchart TD
    subgraph TRIGGER["KYC Trigger Points"]
        T1["Price Agreement Reached\nvia Negotiation"] --> T2["Transaction Created\nStatus: initiated"]
        T2 --> T3{KYC Status?}
        T3 -->|Not Started| T4["Redirect to /kyc\nKYC Required Before Contract"]
        T3 -->|Verified| T5["Skip to Contract Signing\nStep 2"]
        T3 -->|Pending / In Progress| T6["Show Status\nPolling Active"]
    end

    subgraph ROLES["Both Parties Required"]
        T4 --> R1{User Role in Transaction?}
        R1 -->|Buyer| R2["buyer_kyc_status\nTracked on Transaction"]
        R1 -->|Seller| R3["seller_kyc_status\nTracked on Transaction"]
        R2 --> S1
        R3 --> S1
    end

    subgraph SESSION["Didit SDK Session"]
        S1["Create KYC Session\nEdge Function: kyc-create-session"] --> S2["Session ID Generated\nStored in kyc_verifications Table"]
        S2 --> S3["Launch Didit SDK\nSDK-Web for Browser\nNative SDKs for Mobile - Planned"]
        S3 --> S4["User Completes Verification"]
    end

    subgraph STEPS["Verification Steps"]
        S4 --> V1["Step 1: Document Upload\n- Government-Issued ID\n- Front Side Photo\n- Back Side Photo"]
        V1 --> V2["Step 2: Selfie Verification\n- Live Selfie Capture\n- Face Match Against ID\n- Liveness Detection"]
        V2 --> V3["Step 3: Address Verification\n- Address Confirmation\n- Country Detection"]
    end

    subgraph PROCESSING["Result Processing"]
        V3 --> P1["Didit Processes Verification"]
        P1 --> P2{Webhook Received?\nEdge Function: kyc-webhook}
        P2 -->|Yes| P3["Webhook Updates Status\nin kyc_verifications Table"]
        P2 -->|Delayed| P4["Client Polls Status\nEdge Function: get-kyc-status"]
        P4 --> P5{Status Updated?}
        P5 -->|Yes| P3
        P5 -->|No| P4
    end

    subgraph RESULTS["Verification Results"]
        P3 --> D1{Decision?}
        D1 -->|Approved| D2["Status: verified\nKYC Passed"]
        D1 -->|Declined| D3["Status: rejected\nVerification Failed"]
        D1 -->|Pending Review| D4["Status: pending\nManual Review by Didit"]
        D4 -->|Eventually| D1
    end

    subgraph IMPACT["Transaction Impact"]
        D2 --> I1["Contract Signing Unlocked\nStep 2 Accessible"]
        D2 --> I2["Financing Applications\nEnabled"]
        D2 --> I3["Insurance Binding\nEnabled"]

        D3 --> I4["Contract Signing Blocked"]
        D3 --> I5["User Can Retry\nNew Session Created"]
        I5 --> S1
    end

    subgraph STORAGE["Data Storage"]
        ST1["kyc_verifications Table\n- user_id\n- transaction_id\n- didit_session_id\n- status\n- role: buyer / seller\n- decision_json\n- created_at / updated_at"]
        ST2["Transaction Table\n- buyer_kyc_status\n- seller_kyc_status\nBoth Must Be verified\nBefore Contract Step"]
    end
```

---

## KYC Status Lifecycle

| Status | Meaning | Next Action |
|--------|---------|-------------|
| **not_started** | User has not begun verification | Redirect to /kyc |
| **pending** | Session created, awaiting completion | User completes SDK flow |
| **in_progress** | Verification submitted, processing | Await webhook / poll |
| **verified** | Identity confirmed by Didit | Proceed to contract |
| **rejected** | Verification failed | Retry with new session |

## Integration Architecture

| Component | Implementation |
|-----------|---------------|
| **SDK** | Didit SDK-Web (browser), native SDKs planned for mobile |
| **Session Creation** | Edge function `kyc-create-session` |
| **Result Delivery** | Webhook via `kyc-webhook` edge function |
| **Fallback Sync** | Client polling via `get-kyc-status` edge function |
| **Storage** | `kyc_verifications` table with RLS (own records only, admin full access) |
| **Blocking** | Contract signing gated on both buyer + seller KYC verified |

## Role-Specific Requirements

| User Type | Documents Required |
|-----------|-------------------|
| **Private Person** | Government ID (front + back) + Selfie + Address |
| **Business Entity** | Authorized representative's ID + Selfie + Company address verification |
