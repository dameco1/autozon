

# Fix Browsing Workflow — Let Users Browse Freely

## Problems Identified

1. **Broken continuity after login**: Clicking a car → redirected to login → after login goes to `/verify-otp` → then intent selection, losing the car the user wanted to see
2. **Car cards in selection only toggle like** — no way to preview individual cars before committing
3. **Comparison page shows limited specs** — no full car details or photos
4. **"No cars found" pushes users to buyer-questionnaire** — wearing down casual browsers
5. **CarSelection requires login for "Show More"** — blocks anonymous browsing

## Plan

### 1. Preserve return URL through login flow
- **Login.tsx**: Accept a `?redirect=` query param. After successful login + OTP, redirect to that URL instead of always going to `/verify-otp` → intent selection.
- **EmailOtpVerify.tsx**: Pass through the `redirect` param; after verification, navigate to the stored redirect URL.
- **CarDetail.tsx** (`handleStartTrade`): When redirecting to login, include `?redirect=/car/${id}` so the user returns to the car they clicked.
- **CarSelection.tsx** (`toggleLike`): Same — include redirect param when sending unauthenticated users to login.

### 2. Add "View Details" button on car cards in CarSelection
- Each car card currently only toggles like on click. Add a **"View" icon/button** (e.g., eye icon) that navigates to `/car/${car.id}` so users can preview the full ad without losing their selection state.
- Keep the heart/like toggle as a separate action on the card.
- Remove the whole-card click = like behavior; make card click navigate to detail instead, and keep heart icon for liking.

### 3. Make CarSelection fully browsable without login
- Remove the login requirement for basic browsing. The `toggleLike` and `handleShowMore` functions currently require auth — keep like behind auth (with redirect), but allow "Show More" for anonymous users by running the query without user preferences.
- Change "no cars found" CTA from "buyer-questionnaire" to just adjusting filters or going back to search.

### 4. Improve CarComparison to show full car details
- Update `CarComparison.tsx` to display full car photos (gallery/carousel), description, equipment, and inspection data for each car side by side — not just the spec rows table.
- Each car column should function as a mini version of the CarDetail page.

### 5. Defer preference collection to serious engagement
- Remove the automatic redirect to intent selection / buyer-questionnaire after login.
- Only prompt for preferences when the user explicitly clicks "Get Personalized Matches" or similar — not as a gate to browsing.
- After login (with redirect param), go straight back to where the user was.

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/Login.tsx` | Accept `redirect` query param, pass it through OTP flow |
| `src/pages/EmailOtpVerify.tsx` | Honor `redirect` param after verification |
| `src/pages/CarSelection.tsx` | Add "View" button on cards; allow anonymous "Show More"; fix "no cars" CTA |
| `src/pages/CarDetail.tsx` | Pass redirect URL when sending to login |
| `src/pages/CarComparison.tsx` | Expand to show full photos, description, equipment per car |
| `src/i18n/translations.ts` | Add any new translation keys (view details, etc.) |

## Technical Notes

- The `redirect` param will be URL-encoded and passed as `?redirect=/car/abc-123` through login → OTP → final destination.
- Anonymous browsing already works for car queries (RLS policy for `anon` role exists). The frontend just needs to stop gating UI on `userId`.
- CarComparison will use a carousel component (already in the project) for photo galleries.

