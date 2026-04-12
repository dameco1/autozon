/**
 * Product analytics / PostHog-style events (technical spec §7).
 * Hook `window.smartPush` or `dataLayer` when wired.
 */
export const analytics = {
  homepageViewed: () => emit("homepage_viewed", {}),
  onboardingShown: () => emit("onboarding_shown", {}),
  onboardingDismissed: (stepReached: number) => emit("onboarding_dismissed", { step_reached: stepReached }),
  sellCtaClicked: () => emit("sell_cta_clicked", {}),
  buyCtaClicked: () => emit("buy_cta_clicked", {}),
  sellStarted: (source: string) => emit("sell_started", { source }),
  filesUploaded: (p: { photo_count: number; has_license: boolean; has_registration: boolean }) =>
    emit("files_uploaded", p),
  ocrCompleted: (p: { confidence: number; fields_extracted: number }) => emit("ocr_completed", p),
  valuationReceived: (p: {
    price_low: number
    price_mid: number
    price_high: number
    confidence: number
  }) => emit("valuation_received", p),
  listingEdited: (fieldsChanged: string[]) => emit("listing_edited", { fields_changed: fieldsChanged }),
  emailEntered: () => emit("email_entered", {}),
  listingPublished: (listingId: string, price: number) => emit("listing_published", { listing_id: listingId, price }),
  buyerFeedLoaded: (cardCount: number) => emit("buyer_feed_loaded", { card_count: cardCount }),
  cardSwipedRight: (listingId: string | null, carId: string | null, index: number) =>
    emit("card_swiped_right", { listing_id: listingId, car_id: carId, index_in_feed: index }),
  cardSwipedLeft: (listingId: string | null, carId: string | null, index: number) =>
    emit("card_swiped_left", { listing_id: listingId, car_id: carId, index_in_feed: index }),
  shortlistSaveAttempted: (carId: string | null, isAuthenticated: boolean) =>
    emit("shortlist_save_attempted", { listing_id: null, car_id: carId, is_authenticated: isAuthenticated }),
  authGateOpened: () => emit("auth_gate_opened", { trigger: "shortlist_save" }),
}

function emit(event: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return
  try {
    ;(window as unknown as { smartPush?: (e: string, p?: object) => void }).smartPush?.(event, payload)
    ;(window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event, ...payload })
  } catch {
    /* ignore */
  }
  if (import.meta.env.DEV) console.debug("[analytics]", event, payload)
}
