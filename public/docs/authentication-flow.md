# Authentication Flow — Registration, Login & Security

This diagram maps the complete authentication journey including registration, email verification, Email OTP 2FA, social login, onboarding guard, and role-based access control.

```mermaid
flowchart TD
    subgraph REGISTER["User Registration"]
        R1[Landing Page] --> R2{New or Returning?}
        R2 -->|New| R3["Sign Up Page /signup"]
        R2 -->|Returning| R4["Login Page /login"]
        R3 --> R5["Enter Details\n- Full Name\n- Email\n- Password (with visibility toggle)\n- Account Type (Private / Business)\n- Lifestyle Questions\n- Optional Buyer Preferences"]
        R5 --> R6{User Type?}
        R6 -->|Private Person| R7["Standard Registration\n+ Date of Birth"]
        R6 -->|Business Entity| R8["Business Registration\n- Company Name\n- UID Number\n- Commercial Registry\n- Authorized Representative"]
        R7 --> R9[Email Sent]
        R8 --> R9
    end

    subgraph VERIFY["Email Verification"]
        R9 --> V1["Check Email Inbox"]
        V1 --> V2["Click Verification Link"]
        V2 --> V3["Email Confirmed"]
        V3 --> V4["Redirect to Email OTP Verification"]
    end

    subgraph MFA["Two-Factor Authentication (Email OTP)"]
        V4 --> M1["Email OTP Verification /verify-otp"]
        M1 --> M2["6-digit code sent to email\n(5-minute TTL)"]
        M2 --> M3["Enter 6-Digit Code"]
        M3 -->|Valid| M4["Email OTP Verified\n(persisted in app_metadata)"]
        M3 -->|Invalid/Expired| M5["Try Again or Resend"]
        M5 --> M3
    end

    subgraph LOGIN["Login Flow"]
        R4 --> L0{Login Method?}
        L0 -->|Email + Password| L1["Enter Email + Password"]
        L0 -->|Google OAuth| L_G["Sign in with Google"]
        L0 -->|Apple OAuth| L_A["Sign in with Apple"]
        L1 -->|Valid| L2["Redirect to /verify-otp"]
        L1 -->|Invalid| L3["Error: Invalid Credentials"]
        L3 --> L1
        L_G --> L2
        L_A --> L2
        L2 --> M1
    end

    subgraph PASSWORD["Password Recovery"]
        L1 -.->|Forgot| P1["Reset Password /reset-password"]
        P1 --> P2["Enter Email"]
        P2 --> P3["Reset Link Sent"]
        P3 --> P4["Click Link in Email"]
        P4 --> P5["Set New Password"]
        P5 --> L1
    end

    subgraph ONBOARDING["Onboarding Guard"]
        M4 --> OB1{Onboarding Complete?}
        OB1 -->|No| OB2["Redirect to /onboarding\n(Lifestyle, Financial, Timing)"]
        OB2 --> OB3["Complete Preferences"]
        OB3 --> A1
        OB1 -->|Yes| A1
    end

    subgraph ACCESS["Post-Authentication"]
        A1[Dashboard] -->|Buying| A2[Buyer Onboarding]
        A1 -->|Selling| A3[Seller Dashboard]
    end

    subgraph ROLES["Role-Based Access Control"]
        A1 --> RL1{User Role?}
        RL1 -->|User| RL2["Standard Access\n- Own Cars / Offers\n- Own Transactions"]
        RL1 -->|Admin| RL3["Admin Dashboard\n- All Users / Cars\n- Platform Analytics\n- Moderation Tools"]
    end
```

---

## Authentication Methods

| Method | Page | Details |
|--------|------|---------|
| **Email + Password** | Signup (`/signup`) | Standard registration with password visibility toggle |
| **Email + Password** | Login (`/login`) | Credentials-based login |
| **Google OAuth** | Login (`/login`) | Social sign-in via Google |
| **Apple OAuth** | Login (`/login`) | Social sign-in via Apple |

> **Note:** OAuth buttons (Google, Apple) are only available on the **Login** page. The **Signup** page uses email/password only to ensure users complete lifestyle profiling during registration.

## Onboarding Guard

All users — including those signing in via Google or Apple — must complete the onboarding questionnaire before accessing the dashboard. The guard checks the `user_preferences` table for `onboarding_completed = true`. If not complete, the user is redirected to `/onboarding`.

## Security Features Summary

| Feature | Implementation |
|---------|---------------|
| **Password** | Secure hashing via auth provider; visibility toggle on signup |
| **Email Verification** | Required before first login |
| **2FA (Email OTP)** | 6-digit code via email, 5-minute TTL, rate-limited (5 requests / 10 min) |
| **Session Management** | JWT tokens with refresh; OTP verified status in `app_metadata` |
| **Rate Limiting** | Brute-force protection on login + OTP rate limiting |
| **Password Reset** | Email-based secure reset flow |
| **RBAC** | Separate `user_roles` table, `has_role()` security definer function |
| **Social Auth** | Google + Apple OAuth on login page |
