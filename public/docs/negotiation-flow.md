# Negotiation Flow — Offer to Agreement

This diagram maps the complete negotiation engine from initial offer through multi-round countering to final agreement or rejection.

```mermaid
flowchart TD
    subgraph INITIATE["Offer Initiation"]
        I1["Buyer Views Car Detail"] --> I2{Existing Offer?}
        I2 -->|Accepted Offer Exists| I3["Redirect to\nAcquisition Wizard"]
        I2 -->|Active Negotiation| I4["Resume Negotiation\n/negotiate/:id"]
        I2 -->|No Offer| I5["Create New Offer"]
        I5 --> I6["Offer Dialog\n- Enter Amount EUR\n- Optional Message"]
        I6 --> I7["Offer Saved to DB\nStatus: pending\nRound: 1"]
    end

    subgraph MATCHING["Buyer-Seller Matching"]
        M1["Seller Dashboard"] --> M2["View Buyer Matches"]
        M2 --> M3["Match Score Badge\n- Budget Fit\n- Intent Level\n- Timing"]
        M3 --> M4["Names Blurred\nuntil Placement Paid"]
        M4 -->|Seller Makes Offer| I5
    end

    subgraph NEGOTIATE["Multi-Round Negotiation"]
        I7 --> N1["Negotiation Page\n/negotiate/:offerId"]
        N1 --> N2{Current Actor?}

        N2 -->|Buyer Turn| N3["Buyer Options:\n- Accept Seller Price\n- Counter-Offer\n- Reject Deal"]
        N2 -->|Seller Turn| N4["Seller Options:\n- Accept Buyer Price\n- Counter-Offer\n- Reject Deal"]

        N3 -->|Counter| N5["Submit Counter\n- New Amount\n- Optional Message\n- Round +1"]
        N4 -->|Counter| N5

        N5 --> N6{Max Rounds Reached?}
        N6 -->|No, Max 5| N1
        N6 -->|Yes| N7["Final Round\nAccept or Reject Only"]
    end

    subgraph ACCEPT["Deal Accepted"]
        N3 -->|Accept| A1["Status: accepted\nagreed_price Set"]
        N4 -->|Accept| A1
        N7 -->|Accept| A1

        A1 --> A2["Negotiation PDF\nGenerated"]
        A2 --> A3["Both Parties Notified"]
        A3 --> A4["Proceed to Transaction\n/acquire/:offerId"]
    end

    subgraph REJECT["Deal Rejected"]
        N3 -->|Reject| R1["Status: rejected"]
        N4 -->|Reject| R1
        N7 -->|Reject| R1

        R1 --> R2["Deal Ended\nBrowse Other Cars"]
    end

    subgraph REFERENCE["Fair Value Reference"]
        FV1["Fair Value Price\nfrom 10-Factor Model"] -.->|Guidance| N1
        FV2["Market Comparison\nAI-powered"] -.->|Context| N1
        FV3["Blended Value\n40% Formula / 60% Market"] -.->|Benchmark| N1
    end
```

---

## Negotiation Rules

| Rule | Value |
|------|-------|
| **Max Rounds** | 5 (configurable per offer, default 3) |
| **Fair Value Reference** | Always visible during negotiation |
| **Offer Validation** | Buyer cannot offer on own car |
| **Round Tracking** | Each action logged with actor, role, amount, message |
| **Status Transitions** | pending → countered → accepted / rejected |
| **PDF Export** | Available after acceptance |
| **Realtime Updates** | Both parties see live status changes |
