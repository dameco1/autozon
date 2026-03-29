

# iOS App with Capacitor

## Overview

Wrap the existing Autozon React app in a native iOS shell using Capacitor. This gives you a real App Store app with full device access (camera, push notifications, biometrics) while sharing 100% of the existing codebase.

## What Changes in the Codebase

### 1. Install Capacitor Dependencies

Add to `package.json`:
- `@capacitor/core` (runtime)
- `@capacitor/cli` (dev dependency)
- `@capacitor/ios` (iOS platform)

### 2. Initialize Capacitor

Create `capacitor.config.ts` in project root with:
- **appId**: `app.lovable.f15fd8ef222f40d2907b9cb03e4cbf27`
- **appName**: `autozon`
- **webDir**: `dist` (Vite build output)
- **server.url**: Points to the Lovable sandbox preview for hot-reload during development

### 3. Update Vite Config

No changes needed -- Capacitor reads from the `dist` folder which `vite build` already produces.

### 4. iOS App Icons

The existing 192px and 512px icons need to be supplemented with iOS-specific sizes (20, 29, 40, 60, 76, 83.5, 1024pt @1x/2x/3x). These get placed into the iOS project after `npx cap add ios`.

---

## What You Do Locally (After Export)

This is the part that happens on your Mac -- Lovable sets up the config, but native builds require local tools.

### Prerequisites
- **macOS** with **Xcode 15+** installed (free from Mac App Store)
- **Apple Developer account** ($99/year) for App Store submission
- **CocoaPods** (`sudo gem install cocoapods`)

### Steps

```text
1. Export project to GitHub (Settings → Export to GitHub)
2. git clone <your-repo> && cd autozon
3. npm install
4. npx cap add ios          ← creates the /ios folder
5. npx cap update ios       ← installs native dependencies
6. npm run build            ← builds the dist/ folder
7. npx cap sync             ← copies dist/ into the iOS project
8. npx cap open ios         ← opens Xcode
9. In Xcode: select a simulator or your iPhone → Run
```

### For App Store Submission

```text
1. In Xcode → Signing & Capabilities → select your Apple Developer team
2. Set bundle ID, version, build number
3. Product → Archive → Distribute App → App Store Connect
4. Fill out App Store listing in App Store Connect (screenshots, description)
5. Submit for Apple review (typically 1-3 days)
```

---

## Optional Native Plugins (Future)

Once the base app works, you can add Capacitor plugins for enhanced native features:

| Plugin | Purpose | Effort |
|---|---|---|
| `@capacitor/camera` | Native camera for car photos | ~1 hour |
| `@capacitor/push-notifications` | Real push notifications | ~2 hours |
| `@capacitor/haptics` | Haptic feedback on swipe actions | ~30 min |
| `@capacitor/share` | Native share sheet for listings | ~30 min |
| `@capacitor/app` | Deep linking, back button handling | ~1 hour |

---

## Files Changed

| File | Action |
|---|---|
| `capacitor.config.ts` | Create -- Capacitor configuration |
| `package.json` | Edit -- add Capacitor dependencies |

## Cost & Timeline

| Item | Cost |
|---|---|
| Apple Developer Program | $99/year |
| Development effort | ~3-4 hours (setup + testing) |
| App Store review | Free (1-3 business days) |

