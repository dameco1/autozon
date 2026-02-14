import React from "react";
import Navbar from "@/components/Navbar";
import CookieConsent from "@/components/CookieConsent";
import SEO from "@/components/SEO";
import HeroSection from "@/components/home/HeroSection";
import CarTicker from "@/components/home/CarTicker";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionSection from "@/components/home/SolutionSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TrustSection from "@/components/home/TrustSection";
import CtaSection from "@/components/home/CtaSection";
import FooterSection from "@/components/home/FooterSection";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-charcoal text-silver">
      <SEO
        path="/"
        description="Buy and sell cars at fair prices. AI-powered valuations, verified buyer matching, and zero hassle — Autozon is the smarter way to trade cars."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Autozon",
          url: "https://autozon.lovable.app",
          description: "Fair value car trading platform with AI-powered valuations.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://autozon.lovable.app/car-selection?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Navbar />
      <HeroSection />
      <CarTicker />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <TrustSection />
      <CtaSection />
      <FooterSection />
      <CookieConsent />
    </div>
  );
};

export default Index;
