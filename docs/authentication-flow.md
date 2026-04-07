# Authentication Flow — Registration, Login & Security

This diagram maps the complete authentication journey including registration, email verification, MFA enrollment, and role-based access control.

```mermaid
flowchart TD
    subgraph REGISTER["User Registration"]
        R1[Landing Page] --> R2{New or Returning?}
        R2 -->|New| R3["Sign Up Page /signup"]
        R2 -->|Returning| R4["Login Page /login"]
        R3 --> R5["Enter Details\n- Full Name\n- Email\n- Password\n- Relationship Status\n- Number of Kids\n- Car Purpose\n- Current Car"]
        R5 --> R6{User Type?}
        R6 -->|Private Person| R7["Standard Registration"]
        R6 -->|Business Entity| R8["Business Registration\n- Company Name\n- UID Number\n- Commercial Registry\n- Authorized Representative"]
        R7 --> R9[Email Sent]
        R8 --> R9
    end

    subgraph VERIFY["Email Verification"]
        R9 --> V1["Check Email Inbox"]
        V1 --> V2["Click Verification Link"]
        V2 --> V3["Email Confirmed"]
        V3 --> V4["Redirect to MFA Enrollment"]
    end

    subgraph MFA["Multi-Factor Authentication"]
        V4 --> M1["MFA Enrollment /mfa-enroll"]
        M1 --> M2["Scan QR Code\nwith Authenticator App"]
        M2 --> M3["Enter 6-Digit TOTP Code"]
        M3 -->|Valid| M4["MFA Enrolled Successfully"]
        M3 -->|Invalid| M5["Try Again"]
        M5 --> M3
    end

    subgraph LOGIN["Login Flow"]
        R4 --> L1["Enter Email + Password"]
        L1 -->|Valid| L2{MFA Enrolled?}
        L1 -->|Invalid| L3["Error: Invalid Credentials"]
        L3 --> L1
        L2 -->|Yes| L4["MFA Verify /mfa-verify"]
        L2 -->|No| L5["MFA Enrollment /mfa-enroll"]
        L4 --> L6["Enter TOTP Code"]
        L6 -->|Valid| L7["Authenticated"]
        L6 -->|Invalid| L8["Try Again"]
        L8 --> L6
    end

    subgraph PASSWORD["Password Recovery"]
        L1 -.->|Forgot| P1["Reset Password /reset-password"]
        P1 --> P2["Enter Email"]
        P2 --> P3["Reset Link Sent"]
        P3 --> P4["Click Link in Email"]
        P4 --> P5["Set New Password"]
        P5 --> L1
    end

    subgraph ACCESS["Post-Authentication"]
        M4 --> A1[Intent Selection]
        L7 --> A1
        A1 -->|Buying| A2[Buyer Onboarding]
        A1 -->|Selling| A3[Seller Dashboard]
    end

    subgraph ROLES["Role-Based Access Control"]
        A1 --> RL1{User Role?}
        RL1 -->|User| RL2["Standard Access\n- Own Cars / Offers\n- Own Transactions"]
        RL1 -->|Admin| RL3["Admin Dashboard\n- All Users / Cars\n- Platform Analytics\n- Moderation Tools"]
    end
```

---

## Security Features Summary

| Feature | Implementation |
|---------|---------------|
| **Password** | Secure hashing via auth provider |
| **Email Verification** | Required before first login |
| **MFA (TOTP)** | Required for all users, authenticator app |
| **Session Management** | JWT tokens with refresh |
| **Rate Limiting** | Brute-force protection on login |
| **Password Reset** | Email-based secure reset flow |
| **RBAC** | Separate user_roles table, security definer function |
