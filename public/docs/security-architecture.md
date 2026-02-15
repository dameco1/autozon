# Security Architecture

## Overview

Autozon implements a **defense-in-depth** security model across every layer of the stack — from browser to database. This document details the security controls protecting user data, financial transactions, and platform integrity.

---

## Authentication

### Email + Password Authentication

| Component | Implementation |
|---|---|
| **Provider** | Lovable Cloud Auth (Supabase Auth under the hood) |
| **Password hashing** | bcrypt with automatic salt (handled by auth service) |
| **Email verification** | Required before first sign-in — no auto-confirm |
| **Password reset** | Email-based reset flow with time-limited tokens |
| **Session management** | JWT-based with automatic refresh token rotation |
| **Token storage** | `localStorage` via Supabase client SDK |

### JWT Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Browser    │────▶│  Auth Service │────▶│  Database    │
│              │     │              │     │  (RLS)       │
│  JWT token   │     │  Validates   │     │  auth.uid()  │
│  in header   │     │  & refreshes │     │  extraction  │
└─────────────┘     └──────────────┘     └─────────────┘
```

**JWT Claims:**
- `sub` — User UUID (maps to `auth.uid()`)
- `email` — Verified email address
- `role` — Supabase role (`authenticated`, `anon`)
- `aal` — Authenticator Assurance Level (`aal1`, `aal2`)
- `exp` — Expiration timestamp

**Token Lifecycle:**
- Access token TTL: 1 hour (default)
- Refresh token: Rotated on each use, single-use
- Session listener: `onAuthStateChange` registered before `getSession()` to prevent race conditions

---

## Multi-Factor Authentication (MFA)

### Implementation

| Aspect | Detail |
|---|---|
| **Type** | TOTP (Time-based One-Time Password) |
| **Standard** | RFC 6238 |
| **Recommended app** | Microsoft Authenticator (also supports Google Authenticator, Authy) |
| **Assurance level** | AAL2 enforced after enrollment |
| **Enrollment** | User-initiated via `/mfa-enroll` |
| **Verification** | Challenge/verify flow via `/mfa-verify` |

### MFA Guard Component

The `MfaGuard` component wraps protected routes and enforces AAL2:

```
User Request → MfaGuard → Check AAL Level
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                  AAL2      AAL1      No Auth
                (Access)  (→ Verify) (→ Login)
```

**Enforcement rules:**
- All authenticated routes require AAL1 minimum
- Sensitive operations (admin dashboard, negotiations, financial data) require AAL2
- Users who have enrolled MFA are always challenged on new sessions

### TOTP Flow

1. **Enrollment:** App generates QR code → User scans with authenticator → Verifies with first code
2. **Verification:** Auth service issues challenge → User enters 6-digit TOTP → Service verifies → Upgrades session to AAL2
3. **Recovery:** Handled via auth service support flow (no backup codes currently)

---

## Row-Level Security (RLS)

### Philosophy

**Every table has RLS enabled.** No exceptions. The database is the last line of defense — even if application code has bugs, RLS prevents unauthorized data access.

### Policy Architecture

```
API Request → Edge/Client → Supabase PostgREST → RLS Policy Check → Data
                                                        │
                                                  ┌─────┼─────┐
                                                  ▼           ▼
                                              ALLOW        DENY
                                            (return data) (empty set)
```

### Policy Patterns by Table

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| **profiles** | Own profile (users), All (admins) | Auto-created via trigger | Own profile only | Not allowed |
| **cars** | Public (all) | Authenticated users (own) | Owner only | Owner only |
| **offers** | Buyer or seller only | Authenticated (as buyer) | Buyer or seller only | Not allowed |
| **notifications** | Own notifications only | System/trigger only | Own (mark read) | Own only |
| **user_roles** | Admins only | Admins only | Admins only | Admins only |
| **car_views** | Car owner (analytics) | Any authenticated | Not allowed | Not allowed |
| **matches** | Own matches only | System only | Own (status update) | Not allowed |
| **buyer_selections** | Own selections only | Own only | Own only | Own only |
| **chat_messages** | Own messages only | Own only | Not allowed | Not allowed |
| **acquisition_quotes** | Own quotes only | Own only | Own only | Not allowed |

### Recursive Policy Prevention

RLS policies never query the same table they protect. The `has_role()` function uses `SECURITY DEFINER` to bypass RLS when checking roles:

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

This prevents infinite recursion while maintaining strict access control.

---

## Role-Based Access Control (RBAC)

### Role Hierarchy

```
admin
  ├── All permissions
  ├── User management (suspend, role assignment)
  ├── View all data across platform
  └── Access admin dashboard

moderator
  ├── View flagged content
  └── Limited moderation actions

user (default)
  ├── CRUD own cars, preferences
  ├── Participate in negotiations
  └── Access own dashboard
```

### Implementation

| Component | Detail |
|---|---|
| **Storage** | Dedicated `user_roles` table (never on profiles) |
| **Lookup** | `has_role()` security definer function |
| **Client check** | `useAdminAuth` hook for UI gating |
| **Server check** | RLS policies + edge function validation |
| **Default role** | No role assigned (treated as `user`) |

### Why Separate Roles Table?

Storing roles on the `profiles` table would allow privilege escalation:
1. User updates their own profile (allowed by RLS)
2. User includes `role: 'admin'` in the update payload
3. User is now an admin

The separate `user_roles` table has RLS policies that **only allow admins** to modify roles, breaking this attack vector.

---

## Edge Function Security

### Authentication Pattern

All edge functions validate JWTs in code (not via `verify_jwt` config):

```typescript
// 1. Extract Authorization header
const authHeader = req.headers.get('Authorization');

// 2. Validate with getClaims()
const { data, error } = await supabase.auth.getClaims(token);

// 3. Extract user identity
const userId = data.claims.sub;
```

**Why not `verify_jwt = true`?**
The signing-keys system requires in-code validation. Setting `verify_jwt = false` in config and validating manually provides more control and compatibility.

### Edge Function Security Matrix

| Function | Auth Required | Rate Limited | Additional Checks |
|---|---|---|---|
| `concierge-chat` | Yes (JWT) | Via AI provider | User ID scoping |
| `detect-damage` | Yes (JWT) | Via AI provider | File size validation |
| `generate-description` | Yes (JWT) | Via AI provider | Car ownership check |
| `market-comparison` | Yes (JWT) | Via AI provider | — |
| `admin-actions` | Yes (JWT + admin role) | Yes | `has_role()` verification |
| `verify-docs-password` | No (public) | Yes (IP-based) | Password hashing comparison |
| `stripe-webhook` | No (public) | Via Stripe | Signature verification |
| `create-placement-checkout` | Yes (JWT) | Via Stripe | Car ownership check |
| `verify-placement` | No (webhook) | Via Stripe | Stripe signature verification |

### Webhook Security

External webhooks (Stripe) use signature verification instead of JWT:

```typescript
const signature = req.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

---

## Rate Limiting

### Documentation Hub

| Parameter | Value |
|---|---|
| **Mechanism** | IP-based in-memory counter |
| **Window** | 15 minutes |
| **Max attempts** | 5 per window |
| **Response on limit** | HTTP 429 with retry-after hint |
| **Reset** | Automatic after window expiry |

### API Rate Limiting

| Layer | Method |
|---|---|
| **Supabase PostgREST** | Built-in connection pooling and request limits |
| **Edge Functions** | Deno runtime limits + per-function timeouts |
| **AI Providers** | Provider-side rate limits (OpenAI, Google) |
| **Stripe API** | Stripe-side rate limits with automatic retry headers |

### Client-Side Protections

- Form submission debouncing
- Optimistic UI with rollback (prevents rage-clicking)
- React Query deduplication (prevents duplicate API calls)

---

## Data Protection

### In Transit

| Path | Encryption |
|---|---|
| Browser → API | TLS 1.3 (enforced by Lovable Cloud) |
| API → Database | Internal TLS within Supabase infrastructure |
| Browser → Storage | TLS 1.3 for file uploads |

### At Rest

| Data | Protection |
|---|---|
| User passwords | bcrypt hash (auth service managed) |
| MFA secrets | Encrypted in auth service |
| Database | AES-256 encryption at rest (managed by cloud provider) |
| File storage | Encrypted at rest in storage buckets |
| Secrets/API keys | Vault-encrypted environment variables |

### Sensitive Data Handling

- **No PII in logs** — Edge functions never log user emails, names, or financial data
- **No secrets in code** — All API keys stored as encrypted secrets
- **Publishable keys only** — Only Supabase anon key exists in client-side code
- **VIN numbers** — Stored but not publicly queryable (RLS protected)

---

## CORS & Headers

### Edge Function CORS

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Restricted in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

### Security Headers (via Lovable Cloud)

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000`

---

## Suspension System

### User Suspension

| Type | Effect |
|---|---|
| **Soft suspend** | User sees suspension notice, cannot perform actions |
| **Hard suspend (ban)** | Auth token invalidated via Supabase Admin API, user cannot log in |

**Admin flow:**
1. Admin triggers suspension via admin dashboard
2. Edge function `admin-actions` validates admin role
3. Profile `suspended` flag set + optional `suspension_type`
4. For hard bans: Supabase Admin API called to invalidate sessions

---

## Infrastructure Migration Security (Planned)

### Current → AWS Migration Path

Autozon is architected on Lovable Cloud for the MVP and early growth stages (0–5K users). A planned migration to AWS is scheduled when the platform reaches growth-stage thresholds (~5K–100K users), driven by requirements for enterprise-grade security certifications, GPU-based AI inference, and global infrastructure.

### Security Improvements Post-Migration

| Domain | Current (Lovable Cloud) | Post-Migration (AWS) |
|---|---|---|
| **Network isolation** | Shared infrastructure | Dedicated VPC with private subnets |
| **WAF / DDoS** | Basic (platform-level) | AWS WAF + Shield Advanced |
| **Secrets management** | Lovable Cloud secrets (encrypted) | AWS Secrets Manager + KMS rotation |
| **Compliance certs** | GDPR (self-assessed) | SOC2 Type II + ISO 27001 (AWS inherited) |
| **Intrusion detection** | Manual monitoring | Amazon GuardDuty (automated threat detection) |
| **Audit logging** | Edge function logs | AWS CloudTrail (immutable audit trail) |
| **Database encryption** | AES-256 at rest | AWS KMS with customer-managed keys (CMK) |
| **Container security** | N/A | Amazon ECR image scanning + Fargate isolation |
| **Backup & DR** | Platform-managed | Cross-region RDS replicas, S3 versioning, automated snapshots |
| **Rate limiting** | In-code (edge functions) | AWS API Gateway throttling + WAF rate rules |
| **Penetration testing** | External audit (annual) | Continuous via AWS Inspector + external annual audit |

### Migration Security Checklist

| Control | Phase |
|---|---|
| VPC with private/public subnet architecture | Migration planning |
| IAM roles with least-privilege policies | Migration planning |
| KMS encryption for all data stores | Data layer migration |
| Security groups + NACLs configured | Data layer migration |
| CloudTrail enabled for all regions | Day 1 post-migration |
| GuardDuty activated | Day 1 post-migration |
| WAF rules deployed | Functions migration |
| SOC2 Type II audit initiated | Post-migration (Y3 Q1) |
| Zero-downtime auth migration with token bridge | Auth migration |

### Migration Security Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Data exposure during migration | Encrypted transfer channels, migration during low-traffic windows |
| Auth token invalidation | Token bridge: dual-validation period supporting both old and new auth |
| DNS hijacking during cutover | DNSSEC enabled, short TTL pre-migration, monitoring |
| Misconfigured security groups | Infrastructure-as-code (Terraform), peer-reviewed before apply |
| Credential leakage | No hardcoded credentials; AWS Secrets Manager from day 1 |

---

## Security Checklist

| Control | Status |
|---|---|
| RLS enabled on all tables | ✅ |
| MFA available for all users | ✅ |
| JWT validation in all edge functions | ✅ |
| Webhook signature verification | ✅ |
| Password hashing (bcrypt) | ✅ |
| Rate limiting on sensitive endpoints | ✅ |
| Roles in separate table (not profiles) | ✅ |
| No secrets in client code | ✅ |
| TLS encryption in transit | ✅ |
| Encryption at rest | ✅ |
| CORS headers configured | ✅ |
| Auto-confirm email disabled | ✅ |
| Security definer for role checks | ✅ |
| AWS migration security plan | 📋 Planned |
| SOC2 / ISO 27001 certification | 📋 Planned (post-migration) |

---

*Document status: V1.1 — Updated with AWS migration security plan. Reflects current production security posture + planned infrastructure evolution.*
