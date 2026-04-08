

# Simplify 2FA: Replace TOTP with Email OTP

## Summary
Replace the current authenticator-app-based TOTP flow with a simpler email-based OTP. After login, users receive a 6-digit code to their email — no app installation or QR code scanning required.

## Why this is better for users
- No need to install Google Authenticator or any app
- No QR code scanning
- Users just check their email — something they already know how to do

## Technical approach

Since the backend doesn't natively support email-based MFA, we'll build a lightweight custom flow:

### 1. New database table: `email_otp`
- `id`, `user_id`, `code` (6-digit), `expires_at` (5 min TTL), `verified` (boolean), `created_at`
- RLS: users can only read/verify their own codes
- Validation trigger for expiry instead of CHECK constraint

### 2. New edge function: `send-email-otp`
- Accepts authenticated user request (JWT)
- Generates a random 6-digit code, stores it in `email_otp` table
- Sends the code to the user's email via Lovable AI (or a simple email function)
- Invalidates any previous unused codes for that user
- Rate-limited to prevent abuse

### 3. New edge function: `verify-email-otp`
- Accepts `{ code }` from authenticated user
- Checks against `email_otp` table (not expired, not already used)
- On success, marks as verified and sets a session flag (custom claim or app_metadata)

### 4. Update existing pages
- **Remove** `MfaEnroll.tsx` and `MfaVerify.tsx` (TOTP pages)
- **Create** new `EmailOtpVerify.tsx` — simple page with a 6-digit input field
- **Update** `Login.tsx` — after successful password login, redirect to `/verify-otp` instead of MFA pages
- **Update** `MfaGuard.tsx` — check the email OTP verification status instead of AAL2 level
- **Update** `App.tsx` — replace `/mfa-enroll` and `/mfa-verify` routes with `/verify-otp`

### 5. Update Signup flow
- After email verification + first login, user goes straight to `/verify-otp` (receives code automatically)
- No enrollment step needed — email OTP works with their existing email

### 6. Translations
- Update `translations.ts` — replace TOTP-related strings with email OTP strings (EN + DE)

## Files changed
- **New**: `supabase/functions/send-email-otp/index.ts`
- **New**: `supabase/functions/verify-email-otp/index.ts`
- **New**: `src/pages/EmailOtpVerify.tsx`
- **Modified**: `src/App.tsx` (routes)
- **Modified**: `src/pages/Login.tsx` (redirect logic)
- **Modified**: `src/components/MfaGuard.tsx` (check OTP instead of AAL2)
- **Modified**: `src/i18n/translations.ts`
- **Removed/unused**: `src/pages/MfaEnroll.tsx`, `src/pages/MfaVerify.tsx`
- **DB migration**: Create `email_otp` table with RLS

