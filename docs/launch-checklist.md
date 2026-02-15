# Launch Checklist

Pre-launch checklist for autozon — to be completed before marketing campaigns begin.

## 🔐 Security & Auth

- [ ] **Disable auto-confirm email signups** — re-enable email verification so users must confirm their address before logging in
- [ ] **Set up custom SMTP provider** (Resend / SendGrid) — ensures reliable email delivery for verification, password resets, and notifications
- [ ] **Test password reset flow** end-to-end with the new SMTP provider
- [ ] **Test MFA enrollment + verification** on both desktop and mobile
- [ ] **Run security scan** and resolve all error-level findings
- [ ] **Review RLS policies** — confirm all tables enforce proper row-level access

## 🌐 Domain & DNS

- [ ] **Connect custom domain** (`autozon.at`) in Project Settings → Domains
- [ ] **Configure SSL certificate** (automatic via Lovable)
- [ ] **Update `emailRedirectTo`** URLs in signup/reset flows to use production domain
- [ ] **Update Stripe webhook endpoint** to production domain
- [ ] **Update `robots.txt`** sitemap URL to production domain
- [ ] **Submit sitemap** to Google Search Console

## 💳 Payments

- [ ] **Switch Stripe to live mode** — replace test keys with production keys
- [ ] **Update `STRIPE_SECRET_KEY`** and `STRIPE_WEBHOOK_SECRET` secrets with live values
- [ ] **Test placement checkout** end-to-end with a real payment
- [ ] **Verify webhook** processes `checkout.session.completed` correctly in production

## 📧 Transactional Emails

- [ ] **Set up SMTP integration** for auth emails (confirmation, password reset)
- [ ] **Customize email templates** with autozon branding
- [ ] **Test email deliverability** — check inbox placement, not just spam

## 📝 Legal & Compliance

- [ ] **Review Privacy Policy** (`/privacy`) — ensure GDPR compliance for production use
- [ ] **Review Terms & Conditions** (`/terms`) — confirm legal jurisdiction (Cyprus / BowTie Sales Corp Limited)
- [ ] **Review Cookie Policy** (`/cookies`) — verify consent flow works
- [ ] **Review Impressum** (`/impressum`) — confirm all company details are current
- [ ] **Cookie consent banner** tested and functional

## 🧪 QA & Testing

- [ ] **Test full seller flow**: signup → MFA → upload car → valuation → matches → negotiate
- [ ] **Test full buyer flow**: signup → MFA → onboarding → car selection → negotiate → acquisition
- [ ] **Test admin flow**: login → MFA → dashboard → user management → car management
- [ ] **Test on mobile** (iOS Safari + Android Chrome)
- [ ] **Test bilingual support** (EN ↔ DE switching)
- [ ] **AI Concierge chat** responds correctly in both languages
- [ ] **Verify OG meta tags** render correctly when sharing links on social media

## 📊 Analytics & Monitoring

- [ ] **Set up error tracking** (e.g. Sentry or similar)
- [ ] **Set up uptime monitoring** for production URL
- [ ] **Configure Google Analytics** or privacy-friendly alternative (e.g. Plausible)
- [ ] **Verify admin dashboard** KPIs load correctly with real data

## 🚀 Go-Live

- [ ] **Publish latest frontend** via Lovable publish button
- [ ] **Seed production database** with any required initial data (car models, financing partners)
- [ ] **Create admin account** in production and assign `admin` role
- [ ] **Smoke test** all critical paths one final time on the live URL
- [ ] **Announce launch** 🎉

---

*Target markets: Austria → Germany → DACH → CEE*
*Legal entity: BowTie Sales Corp Limited (Cyprus)*
