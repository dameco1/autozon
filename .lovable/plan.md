

# PWA Setup + Install Button in Hero Section

## What We're Building
1. A basic PWA manifest so the app is installable from browsers (no service workers — keeps things simple and avoids preview issues)
2. An "Install App" button row below the trust badges in the hero section

## Plan

### 1. Create `public/manifest.json`
- App name: "Autozon", short name: "Autozon"
- `display: "standalone"`, theme color `#FAF8F5`, background color `#FAF8F5`
- Icons: reuse `favicon.png` at 192x192 and 512x512 sizes (we'll generate a simple set from the existing favicon)
- Start URL: `/`

### 2. Update `index.html`
- Add `<link rel="manifest" href="/manifest.json">`
- Add `<meta name="apple-mobile-web-app-capable" content="yes">`
- Add `<meta name="apple-mobile-web-app-status-bar-style" content="default">`

### 3. Create `src/hooks/usePwaInstall.ts`
- Listen for the `beforeinstallprompt` event and store it
- Expose `canInstall` boolean and `promptInstall()` function
- Track whether app is already installed via `display-mode: standalone` media query

### 4. Update `src/components/home/HeroSection.tsx`
- Import the `usePwaInstall` hook
- Below the trust badges grid, add two side-by-side buttons:
  - **"Install App"** — calls `promptInstall()`, shown only when `canInstall` is true
  - **"Get Started"** — navigates to `/onboarding` (always visible)
- Styled to match the warm/premium theme: orange primary button + outline secondary
- Animated with the existing `fadeUp` variant

### Important Notes
- **No service workers** — this is installability-only (Add to Home Screen). No `vite-plugin-pwa` needed.
- PWA install prompt only works on published site, not in Lovable preview (will mention this to user).
- On iOS Safari, there's no `beforeinstallprompt` event — the install button will be hidden and users use the native Share → Add to Home Screen flow.

