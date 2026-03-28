# SEO & Social Sharing

## Overview

Autozon implements comprehensive SEO across the SPA using a combination of static HTML meta tags (for crawlers that don't execute JS) and a dynamic React-based `SEO` component powered by `react-helmet-async`.

---

## SEO Component (`src/components/SEO.tsx`)

A reusable component used on every page to set dynamic meta tags.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string?` | — | Page title (appended with `| Autozon`) |
| `description` | `string?` | Default brand description | Meta description (< 160 chars) |
| `path` | `string?` | `/` | Canonical path (appended to base URL) |
| `type` | `string?` | `website` | Open Graph type (`website`, `article`, `product`) |
| `jsonLd` | `Record<string, unknown>?` | — | JSON-LD structured data object |
| `noIndex` | `boolean?` | `false` | Set `noindex,nofollow` for non-public pages |

### Usage

```tsx
import SEO from "@/components/SEO";

<SEO
  title="Sell Your Car"
  description="List your car and get a fair AI-powered valuation."
  path="/car-upload"
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sell Your Car",
  }}
/>
```

### What it renders

- `<title>` — e.g. `Sell Your Car | Autozon`
- `<meta name="description">` — page-specific description
- `<link rel="canonical">` — full canonical URL
- `<meta property="og:*">` — Open Graph tags (title, description, type, url, image, site_name)
- `<meta name="twitter:*">` — Twitter Card tags (summary_large_image)
- `<script type="application/ld+json">` — JSON-LD structured data (when provided)
- `<meta name="robots">` — noindex/nofollow (when `noIndex` is true)

---

## Static HTML Fallback (`index.html`)

For crawlers that don't execute JavaScript, `index.html` includes pre-rendered:

- **Title**: `Autozon — Fair Value Car Trading`
- **Meta description**: Brand-level description
- **Open Graph tags**: Full OG set (title, description, image, url, type, site_name)
- **Twitter Card tags**: `summary_large_image` with image
- **JSON-LD Organization**: Schema.org `Organization` block with name, URL, logo, description
- **Theme color**: `#FAF8F5` (warm cream, matches the design system)
- **Sitemap link**: `<link rel="sitemap" href="/sitemap.xml">`
- **Favicon**: `/favicon.png`

---

## Open Graph Image

| Property | Value |
|---|---|
| **File** | `/og-image.png` |
| **Dimensions** | 1200 × 630 px |
| **URL** | `https://autozon.lovable.app/og-image.png` |
| **Used in** | `index.html` (static) + `SEO` component (dynamic) |

---

## JSON-LD Structured Data

### Organization (global — `index.html`)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Autozon",
  "url": "https://autozon.lovable.app",
  "logo": "https://autozon.lovable.app/favicon.png",
  "description": "AI-powered fair value car marketplace. Sell fair, buy smart."
}
```

### Per-Page (via `SEO` component)

Pages like **Car Detail**, **About Us**, and **Landing** pass custom JSON-LD objects via the `jsonLd` prop — for example `Product`, `WebPage`, or `FAQPage` schemas.

---

## Sitemap (`public/sitemap.xml`)

A static XML sitemap listing all public-facing routes. Referenced in:
- `index.html` via `<link rel="sitemap">`
- `robots.txt` via `Sitemap:` directive

### Included Routes

| Route | Priority | Change Freq |
|---|---|---|
| `/` | 1.0 | weekly |
| `/about` | 0.8 | monthly |
| `/qa` | 0.7 | monthly |
| `/login`, `/signup` | 0.5 | monthly |
| `/privacy`, `/terms`, `/cookies`, `/impressum` | 0.3 | yearly |

---

## Robots.txt (`public/robots.txt`)

```
User-agent: *
Allow: /
Sitemap: https://autozon.lovable.app/sitemap.xml
```

---

## SEO Best Practices Enforced

| Practice | Implementation |
|---|---|
| **Single H1 per page** | Each page has one `<h1>` |
| **Semantic HTML** | `<main>`, `<section>`, `<nav>`, `<footer>` used throughout |
| **Alt text on images** | All `<img>` tags include descriptive `alt` attributes |
| **Canonical tags** | Set via `SEO` component on every page |
| **Responsive viewport** | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| **Lazy loading** | Images use `loading="lazy"` where appropriate |
| **Title < 60 chars** | Page titles kept concise with keyword |
| **Meta desc < 160 chars** | Descriptions are actionable and keyword-rich |
| **noIndex on private pages** | Admin, MFA, and internal pages use `noIndex={true}` |

---

## Pages Using `noIndex`

| Page | Reason |
|---|---|
| `/admin` | Internal admin dashboard |
| `/mfa-enroll`, `/mfa-verify` | Authentication flow |
| `/docs/*` | Password-protected investor data room |
| `/pitch` | Internal investor pitch deck |

---

*Document status: V1 — Reflects current SEO implementation as of March 2026.*
