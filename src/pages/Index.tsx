import React, { useEffect } from "react"
import CookieConsent from "@/components/CookieConsent"
import ConciergeChat from "@/components/ConciergeChat"
import SEO from "@/components/SEO"
import { HeroModule } from "@/components/homepage/HeroModule"
import { BuyModule } from "@/components/homepage/BuyModule"
import { OnboardingModal } from "@/components/homepage/OnboardingModal"
import { analytics } from "@/lib/analytics"

const Index: React.FC = () => {
  useEffect(() => {
    analytics.homepageViewed()
  }, [])

  return (
    <div className="min-h-screen">
      <SEO
        path="/"
        description="Buy and sell cars at fair prices. AI-powered valuations, swipe discovery, and secure transactions."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Autozon",
          url: "https://autozon.lovable.app",
          description: "AI-powered fair value car marketplace.",
        }}
      />
      <OnboardingModal />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <HeroModule />
          <BuyModule />
        </div>
        <p id="how-it-works" className="sr-only">
          How it works
        </p>
      </section>
      <CookieConsent />
      <ConciergeChat />
    </div>
  )
}

export default Index
