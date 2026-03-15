import React from "react";
import Navbar from "@/components/Navbar";
import CookieConsent from "@/components/CookieConsent";
import SEO from "@/components/SEO";
import HeroSection from "@/components/home/HeroSection";
import AiEngineSection from "@/components/home/AiEngineSection";
import WhyAutozonSection from "@/components/home/WhyAutozonSection";
import StatsBar from "@/components/home/StatsBar";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ComparisonSection from "@/components/home/ComparisonSection";
import CtaSection from "@/components/home/CtaSection";
import FooterSection from "@/components/home/FooterSection";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <SEO
        path="/"
        description="Buy and sell cars at fair prices in Austria. AI-powered valuations, honest pricing, and secure transactions — Autozon is the smarter way to trade cars."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Autozon",
          url: "https://autozon.lovable.app",
          description: "Austria's AI-powered fair value car marketplace with honest pricing.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://autozon.lovable.app/car-selection?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Navbar />
      <HeroSection />
      <AiEngineSection />
      <WhyAutozonSection />
      <StatsBar />
      <HowItWorksSection />
      <ComparisonSection />
      <CtaSection />
      <FooterSection />
      <CookieConsent />
    </div>
  );
};

export default Index;
