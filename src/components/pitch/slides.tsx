import {
  Car, TrendingDown, Lightbulb, Shield, Brain, Clock, DollarSign,
  Users, RefreshCw, Tag, Globe, BarChart3, Swords, Database,
  Rocket, Heart, ChevronRight, Zap, Search, Handshake, FileText,
  CreditCard, Truck, Crown, PieChart, Target, ArrowRight, Check,
  XCircle, Star, Layers, Map, User
} from "lucide-react";

import damirPhoto from "@/assets/pitch/damir-profile.jpg";
import carBmw5Black from "@/assets/pitch/car-bmw-5-black.jpg";
import carBmw5Blue from "@/assets/pitch/car-bmw-5-blue.jpg";
import carBmwX2 from "@/assets/pitch/car-bmw-x2.jpg";
import carBmwX6Red from "@/assets/pitch/car-bmw-x6-red.jpg";
import carBmwZ4 from "@/assets/pitch/car-bmw-z4.jpg";
import carCitroenDs5 from "@/assets/pitch/car-citroen-ds5.jpg";
import carPorsche911 from "@/assets/pitch/car-porsche-911.jpg";
import carPorschePanamera from "@/assets/pitch/car-porsche-panamera.jpg";

const green = "text-green";
const dim = "text-silver/60";
const heading = "font-display text-[72px] font-bold text-white leading-tight";
const subheading = "font-display text-[48px] font-bold text-white leading-tight";
const body = "text-[28px] text-silver leading-relaxed";
const stat = "font-display text-[96px] font-black text-green leading-none";
const cardBg = "bg-white/5 border border-white/10 rounded-2xl p-8";
const sourceText = "absolute bottom-8 left-40 right-40 text-[16px] text-silver/40 italic";

// Slide 1: Title
export const SlideTitle = () => (
  <div className="flex flex-col items-center justify-center h-full px-40 text-center">
    <Car className={green} size={80} />
    <h1 className="font-display text-[96px] font-black text-white mt-8 leading-none">
      auto<span className={green}>zon</span>
    </h1>
    <p className="text-[36px] text-silver mt-4 font-light">
      Fair Value, Best Prices. Zero Friction.
    </p>
    <div className="mt-16 flex items-center gap-3">
      <div className="w-12 h-[2px] bg-green" />
      <span className={`text-[24px] ${dim}`}>Investor Presentation 2026</span>
      <div className="w-12 h-[2px] bg-green" />
    </div>
  </div>
);

// Slide 2: The Problem
export const SlideProblem = () => (
  <div className="flex flex-col justify-center h-full px-40 relative">
    <div className="flex items-center gap-4 mb-12">
      <TrendingDown className={green} size={48} />
      <h2 className={heading}>The Problem</h2>
    </div>
    <p className={`${body} mb-12 max-w-[1200px]`}>
      Car depreciation is <span className="text-white font-bold">artificially inflated</span>. Dealerships control information, pricing, and margins. Sellers lose instantly — even when their car is pristine.
    </p>
    <div className="grid grid-cols-3 gap-8">
      <div className={cardBg}>
        <p className={stat}>10–20%</p>
        <p className="text-[24px] text-silver mt-4">Value lost instantly when selling through dealers</p>
      </div>
      <div className={cardBg}>
        <p className={stat}>45</p>
        <p className="text-[24px] text-silver mt-4">Average days to sell a car privately</p>
      </div>
      <div className={cardBg}>
        <p className={stat}>67%</p>
        <p className="text-[24px] text-silver mt-4">Of sellers feel cheated after their sale</p>
      </div>
    </div>
    <p className={sourceText}>Sources: DAT Report 2024; AutoScout24 Market Study 2023; Deloitte Used Car Consumer Survey 2023</p>
  </div>
);

// Slide 3: The Insight
export const SlideInsight = () => (
  <div className="flex flex-col items-center justify-center h-full px-40 text-center">
    <Lightbulb className={green} size={80} />
    <h2 className="font-display text-[80px] font-black text-white mt-12 leading-tight max-w-[1400px]">
      Depreciation isn't natural.
    </h2>
    <h2 className={`font-display text-[80px] font-black ${green} leading-tight`}>
      It's engineered.
    </h2>
    <div className="w-32 h-1 bg-green mt-16 rounded-full" />
  </div>
);

// Slide 4: The Solution
export const SlideSolution = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-12">
      <Shield className={green} size={48} />
      <h2 className={heading}>The Solution</h2>
    </div>
    <p className={`${body} mb-16 max-w-[1200px]`}>
      Autozon calculates <span className="text-white font-bold">real value</span>, matches sellers with the best buyers instantly, and manages the entire transaction with transparency and intelligence.
    </p>
    <div className="grid grid-cols-2 gap-8">
      {[
        { icon: Brain, title: "Fair-Value Engine", desc: "AI-powered appraisal based on real market data" },
        { icon: Users, title: "Intelligent Matching", desc: "Connect sellers with pre-qualified, high-intent buyers" },
        { icon: Car, title: "Next-Car Recommendations", desc: "Curated suggestions for the perfect upgrade" },
        { icon: Handshake, title: "Full Concierge Execution", desc: "Pickup, paperwork, delivery — all handled" },
      ].map(({ icon: Icon, title, desc }) => (
        <div key={title} className={`${cardBg} flex items-start gap-6`}>
          <Icon className={green} size={36} />
          <div>
            <h3 className="text-[28px] text-white font-bold">{title}</h3>
            <p className="text-[24px] text-silver mt-2">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Slide 5: Product
export const SlideProduct = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-12">
      <Zap className={green} size={48} />
      <h2 className={heading}>Product</h2>
    </div>
    <div className="grid grid-cols-5 gap-6">
      {[
        { icon: Brain, title: "AI Appraisal", desc: "Market-adjusted fair value in seconds" },
        { icon: Users, title: "Buyer Matching", desc: "Intelligent pairing based on preferences" },
        { icon: Handshake, title: "Concierge", desc: "End-to-end transaction handling" },
        { icon: Search, title: "Damage Detection", desc: "AI-powered condition analysis" },
        { icon: BarChart3, title: "Market Comparison", desc: "Real-time competitive pricing" },
      ].map(({ icon: Icon, title, desc }) => (
        <div key={title} className={`${cardBg} flex flex-col items-center text-center`}>
          <Icon className={green} size={48} />
          <h3 className="text-[24px] text-white font-bold mt-6">{title}</h3>
          <p className="text-[20px] text-silver mt-3">{desc}</p>
        </div>
      ))}
    </div>
  </div>
);

// Slide 6: Why Now
export const SlideWhyNow = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-12">
      <Clock className={green} size={48} />
      <h2 className={heading}>Why Now</h2>
    </div>
    <div className="space-y-6">
      {[
        "Trust in dealerships is collapsing",
        "Consumers demand transparency",
        "AI enables personalized matching at scale",
        "No dominant fair-value car platform exists yet",
        "Cross-border markets are more connected than ever",
      ].map((text, i) => (
        <div key={i} className="flex items-center gap-6">
          <ChevronRight className={green} size={32} />
          <p className="text-[32px] text-white">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

// Slide 7: Business Model
export const SlideBusinessModel = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-12">
      <DollarSign className={green} size={48} />
      <h2 className={heading}>Business Model</h2>
    </div>
    <div className="grid grid-cols-2 gap-12">
      <div className={cardBg}>
        <div className="flex items-center gap-4 mb-6">
          <Check className={green} size={36} />
          <h3 className="text-[36px] text-white font-bold">Free for Buyers</h3>
        </div>
        <p className="text-[24px] text-silver">
          Buyers bring liquidity. Liquidity increases trust. Trust attracts sellers. Sellers generate revenue.
        </p>
      </div>
      <div className={`${cardBg} border-green/30`}>
        <div className="flex items-center gap-4 mb-6">
          <DollarSign className={green} size={36} />
          <h3 className="text-[36px] text-white font-bold">Sellers Pay Success Fee</h3>
        </div>
        <p className="text-[24px] text-silver">
          Because they receive fair-value appraisal, instant matching, and a frictionless sale.
        </p>
      </div>
    </div>
    <p className={`text-[28px] text-silver mt-12 text-center`}>
      Asymmetric pricing — the proven model behind the world's most successful marketplaces.
    </p>
  </div>
);

// Slide 8: Revenue Streams
export const SlideRevenueStreams = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-10">
      <Layers className={green} size={48} />
      <h2 className={heading}>Revenue Streams</h2>
    </div>
    <div className="grid grid-cols-3 gap-6">
      {[
        { icon: DollarSign, title: "Seller Success Fee", desc: "2.5% capped at €499 or flat fee", primary: true },
        { icon: Target, title: "Dealer Lead Fees", desc: "Pay-per-lead or subscription access" },
        { icon: CreditCard, title: "Financing & Insurance", desc: "High-margin referral commissions" },
        { icon: Truck, title: "Logistics Add-ons", desc: "Pickup, delivery, inspection" },
        { icon: Crown, title: "Premium Subscription", desc: "Recurring revenue for power users" },
        { icon: Database, title: "Data Intelligence", desc: "Insights for OEMs, fleets, insurers" },
      ].map(({ icon: Icon, title, desc, primary }) => (
        <div key={title} className={`${cardBg} ${primary ? "border-green/40 bg-green/5" : ""}`}>
          <Icon className={green} size={32} />
          <h3 className="text-[24px] text-white font-bold mt-4">{title}</h3>
          <p className="text-[20px] text-silver mt-2">{desc}</p>
          {primary && <span className="inline-block mt-3 text-[16px] text-green font-bold uppercase tracking-widest">Primary</span>}
        </div>
      ))}
    </div>
  </div>
);

// Slide 9: The Flywheel
export const SlideFlywheel = () => {
  const steps = [
    { icon: Users, label: "Buyers create liquidity" },
    { icon: Shield, label: "Liquidity builds trust" },
    { icon: Car, label: "Trust attracts sellers" },
    { icon: DollarSign, label: "Sellers generate revenue" },
    { icon: Database, label: "Data improves everything" },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full px-40">
      <div className="flex items-center gap-4 mb-16">
        <RefreshCw className={green} size={48} />
        <h2 className={heading}>The Flywheel</h2>
      </div>
      <div className="flex items-center gap-4">
        {steps.map(({ icon: Icon, label }, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`${cardBg} flex flex-col items-center text-center w-[260px]`}>
              <Icon className={green} size={40} />
              <p className="text-[22px] text-white mt-4 font-semibold">{label}</p>
            </div>
            {i < steps.length - 1 && <ArrowRight className={green} size={28} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// Slide 10: Pricing
export const SlidePricing = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-12">
      <Tag className={green} size={48} />
      <h2 className={heading}>Pricing</h2>
    </div>
    <div className="grid grid-cols-3 gap-8">
      {[
        { tier: "Basic", price: "€99", features: ["Fair-value appraisal", "Market demand score", "Self-service listing"] },
        { tier: "Premium", price: "€199", features: ["Buyer matching", "Concierge support", "Priority visibility"], highlight: true },
        { tier: "Full Service", price: "2.5%", sub: "capped at €499", features: ["Everything above", "Pickup & paperwork", "Zero stress — fully managed"] },
      ].map(({ tier, price, sub, features, highlight }) => (
        <div key={tier} className={`${cardBg} ${highlight ? "border-green/40 bg-green/5 scale-105" : ""} flex flex-col`}>
          <h3 className="text-[28px] text-white font-bold">{tier}</h3>
          <p className={`font-display text-[56px] font-black ${green} mt-4`}>{price}</p>
          {sub && <p className="text-[20px] text-silver -mt-1">{sub}</p>}
          <div className="mt-6 space-y-3 flex-1">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <Check className={green} size={20} />
                <span className="text-[22px] text-silver">{f}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Slide 11: Market Size
export const SlideMarketSize = () => (
  <div className="flex flex-col items-center justify-center h-full px-40 text-center relative">
    <Globe className={green} size={64} />
    <h2 className={heading + " mt-8"}>Market Size</h2>
    <p className={`${stat} mt-12`}>€300B+</p>
    <p className="text-[36px] text-white mt-4">European used-car market</p>
    <div className="w-32 h-1 bg-green mt-12 rounded-full" />
    <p className="text-[32px] text-silver mt-8">
      Even <span className={`${green} font-bold`}>1% penetration</span> = multi-billion opportunity
    </p>
    <p className={sourceText}>Source: ACEA European Automobile Manufacturers' Association, 2024 Report</p>
  </div>
);

// Slide 12: Financial Projections
export const SlideFinancials = () => (
  <div className="flex flex-col justify-center h-full px-40 relative">
    <div className="flex items-center gap-4 mb-10">
      <PieChart className={green} size={48} />
      <h2 className={heading}>Financial Projections</h2>
    </div>
    <div className="grid grid-cols-3 gap-8 mb-12">
      {[
        { year: "Year 1", txns: "2,000", rev: "€1M", focus: "Product-market fit" },
        { year: "Year 2", txns: "10,000", rev: "€5–6M", focus: "Dealer + finance revenue" },
        { year: "Year 3", txns: "40,000", rev: "€25M+", focus: "Strong network effects" },
      ].map(({ year, txns, rev, focus }) => (
        <div key={year} className={cardBg}>
          <h3 className="text-[24px] text-white font-bold">{year}</h3>
          <p className={`font-display text-[48px] font-black ${green} mt-3`}>{rev}</p>
          <p className="text-[22px] text-silver mt-2">{txns} transactions</p>
          <p className="text-[20px] text-silver/60 mt-1">{focus}</p>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-8">
      <div className={cardBg}>
        <p className="text-[20px] text-silver">Avg fee</p>
        <p className={`text-[36px] font-bold ${green}`}>€500</p>
      </div>
      <div className={cardBg}>
        <p className="text-[20px] text-silver">Gross margin</p>
        <p className={`text-[36px] font-bold ${green}`}>~70%</p>
      </div>
      <div className={cardBg}>
        <p className="text-[20px] text-silver">LTV / CAC</p>
        <p className={`text-[36px] font-bold ${green}`}>&gt; 5x</p>
      </div>
    </div>
    <p className={sourceText}>Based on internal projections; avg fee derived from 2.5% on €20K avg transaction price</p>
  </div>
);

// Slide 13: Competitive Landscape
export const SlideCompetition = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-12">
      <Swords className={green} size={48} />
      <h2 className={heading}>Competitive Landscape</h2>
    </div>
    <div className="grid grid-cols-3 gap-8">
      <div className={cardBg}>
        <XCircle className="text-destructive" size={36} />
        <h3 className="text-[28px] text-white font-bold mt-4">Listings</h3>
        <p className="text-[22px] text-silver mt-2">AutoScout / mobile.de</p>
        <p className="text-[20px] text-silver/60 mt-4">Listings ≠ Intelligence</p>
      </div>
      <div className={cardBg}>
        <XCircle className="text-destructive" size={36} />
        <h3 className="text-[28px] text-white font-bold mt-4">Dealers</h3>
        <p className="text-[22px] text-silver mt-2">Traditional dealerships</p>
        <p className="text-[20px] text-silver/60 mt-4">Dealers ≠ Fairness</p>
      </div>
      <div className={`${cardBg} border-green/40 bg-green/5`}>
        <Star className={green} size={36} />
        <h3 className={`text-[28px] font-bold mt-4 ${green}`}>Autozon</h3>
        <p className="text-[22px] text-white mt-2">Value preservation ecosystem</p>
        <p className="text-[20px] text-silver mt-4">Intelligence + Fairness + Execution</p>
      </div>
    </div>
  </div>
);

// Slide 14: Moat & Roadmap
export const SlideMoatRoadmap = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-10">
      <Map className={green} size={48} />
      <h2 className={heading}>Moat & Roadmap</h2>
    </div>
    <div className="grid grid-cols-2 gap-12">
      <div>
        <h3 className={subheading + " mb-6"}>Data Flywheel</h3>
        {[
          "Every valuation improves pricing",
          "Every match improves liquidity",
          "Every transaction improves prediction",
        ].map((t) => (
          <div key={t} className="flex items-center gap-4 mb-4">
            <RefreshCw className={green} size={24} />
            <p className="text-[24px] text-silver">{t}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className={subheading + " mb-6"}>Roadmap</h3>
        {[
          { phase: "MVP", desc: "Core valuation + matching" },
          { phase: "V1", desc: "Concierge + dealer network" },
          { phase: "V1.5", desc: "Seller KYC — ownership verification + financing automation" },
          { phase: "V2", desc: "Financing, insurance, logistics" },
          { phase: "V3", desc: "Lifecycle platform + data insights" },
        ].map(({ phase, desc }) => (
          <div key={phase} className="flex items-center gap-4 mb-4">
            <span className={`text-[24px] ${green} font-bold w-16`}>{phase}</span>
            <ArrowRight className="text-silver/40" size={20} />
            <p className="text-[24px] text-silver">{desc}</p>
          </div>
        ))}
        <p className="text-[22px] text-silver/60 mt-6">
          GTM: Austria + Germany → DACH → CEE
        </p>
      </div>
    </div>
  </div>
);

// Slide 15: The Ask
export const SlideAsk = () => (
  <div className="flex flex-col items-center justify-center h-full px-40 text-center">
    <Rocket className={green} size={64} />
    <h2 className={heading + " mt-8"}>The Ask</h2>
    <p className={`${body} mt-8 max-w-[1000px]`}>
      We're raising capital to:
    </p>
    <div className="grid grid-cols-3 gap-8 mt-12">
      {[
        { icon: Zap, text: "Build the MVP" },
        { icon: Users, text: "Seed initial liquidity" },
        { icon: Globe, text: "Expand DACH → CEE" },
      ].map(({ icon: Icon, text }) => (
        <div key={text} className={cardBg + " flex flex-col items-center"}>
          <Icon className={green} size={40} />
          <p className="text-[24px] text-white font-bold mt-4">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

// Slide 16: Founder
const carImages = [
  carCitroenDs5, carBmw5Black, carBmw5Blue, carBmwZ4,
  carBmwX6Red, carBmwX2, carPorsche911, carPorschePanamera,
];

export const SlideFounder = () => (
  <div className="flex h-full px-40 py-16 gap-12">
    {/* Left: Photo + Bio */}
    <div className="flex flex-col justify-center w-[700px] shrink-0">
      <div className="flex items-center gap-4 mb-8">
        <User className={green} size={48} />
        <h2 className={heading}>The Founder</h2>
      </div>
      <div className="flex items-start gap-8 mb-8">
        <img
          src={damirPhoto}
          alt="Damir Buljubasic"
          className="w-[200px] h-[200px] rounded-2xl object-cover border-2 border-green/30 shrink-0"
        />
        <div>
          <h3 className="text-[36px] text-white font-bold">Damir Buljubasic</h3>
          <p className={`text-[20px] ${green} font-semibold mt-1`}>Founder & CEO</p>
        </div>
      </div>
      <div className="space-y-4 text-[20px] text-silver leading-relaxed">
        <p>
          At age 18, founded <span className="text-white font-semibold">Dameco Internet Services</span> and developed one of the most unique and widely used Learning Management Systems — sold to <span className="text-white font-semibold">Learning Library Inc.</span> in 2009.
        </p>
        <p>
          Since then, held key roles at <span className="text-white font-semibold">Oracle, ATOS, ASA Prevent Holding</span>, and <span className="text-white font-semibold">Planetsoft</span>.
        </p>
        <p>
          In 2025, a personal realization: despite investing heavily in maintenance and condition preservation, <span className={`${green} font-semibold`}>the system always depreciated the car without sense</span>. That frustration became Autozon.
        </p>
        <p className="text-silver/60 italic">
          An avid car enthusiast who has owned and cared for every vehicle with passion →
        </p>
      </div>
    </div>

    {/* Right: Car Collage */}
    <div className="flex-1 grid grid-cols-4 grid-rows-2 gap-3 my-auto">
      {carImages.map((src, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-white/10">
          <img
            src={src}
            alt={`Car ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  </div>
);

// Slide 17: Closing
export const SlideClosing = () => (
  <div className="flex flex-col items-center justify-center h-full px-40 text-center">
    <Heart className={green} size={64} />
    <h2 className="font-display text-[48px] font-bold text-white mt-12 max-w-[1200px] leading-tight">
      Cars shouldn't lose value because the system is broken.
    </h2>
    <h2 className={`font-display text-[48px] font-bold ${green} mt-4`}>
      Autozon fixes the system.
    </h2>
    <p className="text-[28px] text-silver mt-4">With fairness, intelligence, and trust.</p>
    <div className="w-32 h-1 bg-green mt-16 rounded-full" />
    <p className="text-[24px] text-silver/60 mt-8 italic max-w-[1000px]">
      "Autozon is not a marketplace. It's a value-preservation engine for the €300B used-car market."
    </p>
    <p className="font-display text-[36px] font-black text-white mt-16">
      auto<span className={green}>zon</span>
    </p>
  </div>
);

export const allSlides = [
  SlideTitle, SlideProblem, SlideInsight, SlideSolution, SlideProduct,
  SlideWhyNow, SlideBusinessModel, SlideRevenueStreams, SlideFlywheel,
  SlidePricing, SlideMarketSize, SlideFinancials, SlideCompetition,
  SlideMoatRoadmap, SlideAsk, SlideFounder, SlideClosing,
];
