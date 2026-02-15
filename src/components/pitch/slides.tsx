import {
  Car, TrendingDown, Lightbulb, Shield, Brain, Clock, DollarSign,
  Users, RefreshCw, Tag, Globe, BarChart3, Swords, Database,
  Rocket, Heart, ChevronRight, Zap, Search, Handshake, FileText,
  CreditCard, Truck, Crown, PieChart, Target, ArrowRight, Check,
  XCircle, Star, Layers, Map, User, Monitor, MessageSquare, CheckCircle
} from "lucide-react";

import damirPhoto from "@/assets/pitch/damir-profile.jpg";
import eminaPhoto from "@/assets/pitch/emina-profile.jpg";
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

// Slide 1: Cover / Investor Intro
export const SlideCover = () => (
  <div className="flex flex-col justify-center h-full px-40 relative">
    <div className="flex items-center gap-6 mb-10">
      <Car className={green} size={72} />
      <div>
        <h1 className="font-display text-[88px] font-black text-white leading-none">
          auto<span className={green}>zon</span>
        </h1>
        <p className="text-[28px] text-silver mt-1 font-light">Fair Value, Best Prices. Zero Friction.</p>
      </div>
    </div>

    <p className={`${body} max-w-[1400px] leading-[1.7]`}>
      I'm building <span className="text-white font-bold">Autozon</span>, the first fair‑value automotive platform that eliminates dealership‑engineered depreciation. Sellers lose <span className={`${green} font-bold`}>10–20% instantly</span> because the system is opaque and designed against them. Autozon fixes this with AI‑powered valuation blended with real market data, intelligent buyer matching, and structured negotiations that maximize seller profit.
    </p>

    <p className={`${body} max-w-[1400px] leading-[1.7] mt-6`}>
      The platform is <span className="text-white font-bold">free for buyers</span>. Sellers pay a success fee because they receive a higher sale price, faster liquidity, and zero friction. The European used‑car market is <span className={`${green} font-bold`}>€300B+</span>, and no dominant fair‑value car platform exists.
    </p>

    <p className={`${body} max-w-[1400px] leading-[1.7] mt-6`}>
      We've built a <span className="text-white font-bold">working product</span> — the fair‑value engine, AI damage detection, market comparison, buyer discovery questionnaire, iterative matching, and structured negotiation system are all live. We're now <span className="text-white font-bold">raising capital</span> to scale across DACH and CEE.
    </p>

    <p className={`text-[26px] ${green} font-semibold mt-10`}>
      If this aligns with your investment strategy and goals in mobility, marketplace, or AI — I'd love to share more.
    </p>

    <div className="absolute bottom-24 left-40 right-40">
      <p className="text-[24px] text-white font-light">
        <span className="font-semibold">Emina Mukic-Buljubasic</span>, CEO &amp; <span className="font-semibold">Damir Buljubasic</span>, CIO — Co-Founders
      </p>
    </div>

    <div className="absolute bottom-8 left-40 right-40 flex items-center gap-3">
      <div className="w-12 h-[2px] bg-green" />
      <span className={`text-[20px] ${dim}`}>Investor Presentation 2026</span>
      <div className="w-12 h-[2px] bg-green" />
    </div>
  </div>
);

// Slide 2: Title
export const SlideTitle = () => (
  <div className="flex flex-col items-center justify-center h-full px-40 text-center">
    <Car className={green} size={80} />
    <h1 className="font-display text-[96px] font-black text-white mt-8 leading-none">
      auto<span className={green}>zon</span>
    </h1>
    <p className="text-[36px] text-silver mt-4 font-light">
      Fair Value. Best Prices. Zero Friction.
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
      Autozon calculates <span className="text-white font-bold">true market value</span> by blending a multi-factor formula (brand, age, mileage, condition, equipment) with <span className="text-white font-bold">live market comparison data</span> — then connects sellers directly with high-intent, pre-qualified buyers.
    </p>
    <div className="grid grid-cols-2 gap-8">
      {[
        { icon: Brain, title: "Blended Fair-Value Engine", desc: "30% formula-based appraisal + 70% real market data — no more guessing" },
        { icon: Users, title: "Smart Buyer Matching", desc: "10-step buyer questionnaire → iterative selection → 2 finalists side-by-side" },
        { icon: Handshake, title: "Structured Negotiation", desc: "Max 3 rounds of offer/counter — transparent, fair, and fast" },
        { icon: Car, title: "Full Lifecycle", desc: "Acquisition options (credit, leasing, trade-in), concierge, and next-car recommendations" },
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

// Slide 5: How It Works — Seller
export const SlideHowItWorksSeller = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-10">
      <Zap className={green} size={48} />
      <h2 className={heading}>How It Works — Seller</h2>
    </div>
    <p className={`${body} mb-10 max-w-[1200px]`}>
      From upload to sale in <span className="text-white font-bold">minutes, not weeks</span>. The seller keeps more money because the system finds the <span className={`${green} font-bold`}>real value</span> — not a dealer's lowball.
    </p>
    <div className="grid grid-cols-4 gap-6">
      {[
        { step: "1", icon: Car, title: "Upload Vehicle", desc: "5-step guided form: specs, photos, condition sliders, equipment checklist" },
        { step: "2", icon: Search, title: "AI Damage Scan", desc: "Upload photos → AI detects scratches, dents, rust — auto-adjusts condition score" },
        { step: "3", icon: Brain, title: "Fair Value Engine", desc: "Multi-factor formula (brand tier, depreciation curve, mileage, equipment) blended 30/70 with live market data" },
        { step: "4", icon: BarChart3, title: "Market Comparison", desc: "Real-time scan of comparable listings — avg price, range, depreciation forecast, market position" },
      ].map(({ step, icon: Icon, title, desc }) => (
        <div key={title} className={cardBg}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`font-display text-[36px] font-black ${green}`}>{step}</span>
            <Icon className={green} size={28} />
          </div>
          <h3 className="text-[22px] text-white font-bold">{title}</h3>
          <p className="text-[18px] text-silver mt-2 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  </div>
);

// Slide 6: How It Works — Buyer & Match
export const SlideHowItWorksBuyer = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-10">
      <Users className={green} size={48} />
      <h2 className={heading}>How It Works — Buyer & Match</h2>
    </div>
    <div className="grid grid-cols-2 gap-12">
      <div>
        <h3 className={subheading + " mb-6"}>Buyer Discovery</h3>
        <div className="space-y-4">
          {[
            "10-step questionnaire: budget, body type, fuel, brand, mileage, power, timing, usage, parking, insurance",
            "AI scores every available car against buyer preferences",
            "Round 1: 10 best matches presented — buyer swipes like/dislike",
            "Round 2: narrowed to 5 → then 3 → final 2 finalists",
            "Side-by-side comparison with acquisition options",
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-4">
              <ChevronRight className={`${green} shrink-0 mt-1`} size={24} />
              <p className="text-[22px] text-silver">{t}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className={subheading + " mb-6"}>Structured Negotiation</h3>
        <div className="space-y-4">
          {[
            "Buyer makes an offer — seller sees it in real-time",
            "Max 3 rounds of offer / counter-offer cards",
            "AI concierge assists with strategy and fair pricing",
            "Once agreed: downloadable PDF deal summary",
            "Acquisition: Credit (amortization), Leasing (residual), Trade-in",
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-4">
              <ChevronRight className={`${green} shrink-0 mt-1`} size={24} />
              <p className="text-[22px] text-silver">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Slide: Concrete Savings Example
export const SlideSavingsExample = () => {
  const examples = [
    { car: "2020 BMW X3 xDrive20d", dealer: 28000, autozon: 33500, mileage: "62,000 km", condition: "Good" },
    { car: "2021 Tesla Model 3 LR", dealer: 31000, autozon: 36200, mileage: "45,000 km", condition: "Excellent" },
    { car: "2019 VW Golf 8 Style", dealer: 16500, autozon: 19800, mileage: "78,000 km", condition: "Good" },
  ];
  return (
    <div className="flex flex-col justify-center h-full px-40 relative">
      <div className="flex items-center gap-4 mb-8">
        <DollarSign className={green} size={48} />
        <h2 className={heading}>Real Savings</h2>
      </div>
      <p className={`${body} mb-10 max-w-[1200px]`}>
        Dealers <span className="text-white font-bold">engineer depreciation</span> to maximize their margin. Autozon finds the <span className={`${green} font-bold`}>real market value</span> — so sellers keep thousands more.
      </p>
      <div className="grid grid-cols-3 gap-8">
        {examples.map(({ car, dealer, autozon, mileage, condition }) => {
          const saved = autozon - dealer;
          const pct = Math.round((saved / dealer) * 100);
          return (
            <div key={car} className={`${cardBg} flex flex-col`}>
              <h3 className="text-[22px] text-white font-bold leading-snug">{car}</h3>
              <p className="text-[16px] text-silver/50 mt-1">{mileage} · {condition}</p>
              <div className="mt-6 space-y-4 flex-1">
                <div>
                  <p className="text-[16px] text-silver/50 mb-1">Dealer offer</p>
                  <div className="flex items-center gap-3">
                    <div className="h-3 bg-destructive/40 rounded-full" style={{ width: `${(dealer / autozon) * 100}%` }} />
                    <span className="text-[24px] text-silver font-display font-bold">€{dealer.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[16px] text-green/80 mb-1">Autozon fair value</p>
                  <div className="flex items-center gap-3">
                    <div className="h-3 bg-green rounded-full w-full" />
                    <span className={`text-[24px] ${green} font-display font-bold`}>€{autozon.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className={`font-display text-[40px] font-black ${green}`}>+€{saved.toLocaleString()}</p>
                <p className="text-[18px] text-silver/60">{pct}% more in the seller's pocket</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className={sourceText}>Based on representative examples comparing dealer trade-in offers vs. Autozon fair-value appraisals (2025–2026)</p>
    </div>
  );
};

// Slide: Live Product Demo
export const SlideProductDemo = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-10">
      <Monitor className={green} size={48} />
      <h2 className={heading}>Live Product</h2>
    </div>
    <div className="grid grid-cols-2 gap-10">
      {/* Fair Value Result Mock */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-green/60" />
          </div>
          <span className="text-[14px] text-silver/40 ml-3">autozon.app/fair-value</span>
        </div>
        <div className="p-8">
          <div className="text-center mb-6">
            <span className="text-[14px] text-green bg-green/10 px-3 py-1 rounded-full">Your Fair-Value Score</span>
            <h3 className="text-[28px] text-white font-display font-bold mt-3">2022 Mercedes-Benz C-Class</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-[14px] text-silver/60">Condition Score</p>
              <p className="text-[36px] font-display font-black text-green">90<span className="text-[16px] text-silver/40">/100</span></p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-[14px] text-silver/60">Demand Score</p>
              <p className="text-[36px] font-display font-black text-green">85<span className="text-[16px] text-silver/40">/100</span></p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex justify-between text-[16px] mb-2">
              <span className="text-silver/60">Your Asking Price</span>
              <span className="text-white font-bold">€38,900</span>
            </div>
            <div className="flex justify-between text-[16px] mb-2">
              <span className="text-green">Value Boosters</span>
              <span className="text-green font-bold">9 factors</span>
            </div>
            <div className="h-px bg-white/10 my-3" />
            <div className="flex justify-between text-[20px]">
              <span className="text-green font-semibold">Fair-Value Result</span>
              <span className="text-green font-display font-black text-[28px]">€35,788</span>
            </div>
          </div>
        </div>
      </div>

      {/* Negotiation Mock */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-green/60" />
          </div>
          <span className="text-[14px] text-silver/40 ml-3">autozon.app/negotiate</span>
        </div>
        <div className="p-8">
          <div className="text-center mb-6">
            <span className="text-[14px] text-green bg-green/10 px-3 py-1 rounded-full">Negotiate</span>
            <h3 className="text-[28px] text-white font-display font-bold mt-3">2023 BMW 3 Series</h3>
          </div>
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <div className="flex justify-between text-[16px] mb-1">
              <span className="text-silver/60">Autozon Fair Value</span>
              <span className="text-green font-bold">€39,100</span>
            </div>
            <div className="flex justify-between text-[16px]">
              <span className="text-silver/60">Asking Price</span>
              <span className="text-white font-bold">€42,500</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full mt-3">
              <div className="h-2 bg-green rounded-full" style={{ width: "92%" }} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ArrowRight className="text-green" size={18} />
                <div>
                  <p className="text-[16px] text-white font-semibold">Buyer offered</p>
                  <p className="text-[13px] text-silver/40 italic">"Love this 3 Series! Happy to close quickly."</p>
                </div>
              </div>
              <span className="text-[24px] text-white font-display font-bold">€38,000</span>
            </div>
            <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-amber-400" size={18} />
                <p className="text-[16px] text-white font-semibold">Seller countered</p>
              </div>
              <span className="text-[24px] text-white font-display font-bold">€37,500</span>
            </div>
            <div className="flex items-center gap-2 text-silver/40 text-[14px] justify-center pt-2">
              <CheckCircle size={16} className="text-green" />
              <span>Round 2/3 · Waiting for buyer response</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p className="text-center text-[20px] text-silver/40 mt-8 italic">Live screenshots from the working Autozon platform</p>
  </div>
);


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
          { phase: "MVP", desc: "Core valuation + matching + negotiation ✅" },
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
      The product is built. We're raising capital to:
    </p>
    <div className="grid grid-cols-3 gap-8 mt-12">
      {[
        { icon: Zap, text: "Scale infrastructure & team" },
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

// Slide 16: Founding Team
const carImages = [
  carCitroenDs5, carBmw5Black, carBmw5Blue, carBmwZ4,
  carBmwX6Red, carBmwX2, carPorsche911, carPorschePanamera,
];

export const SlideFounder = () => (
  <div className="flex h-full px-40 py-16 gap-12">
    {/* Left: Team Bios */}
    <div className="flex flex-col justify-center w-[750px] shrink-0">
      <div className="flex items-center gap-4 mb-8">
        <User className={green} size={48} />
        <h2 className={`font-display text-[48px] font-bold text-white leading-tight`}>The Founding Team</h2>
      </div>

      {/* Emina */}
      <div className="flex items-start gap-6 mb-6">
        <img
          src={eminaPhoto}
          alt="Emina Mukic-Buljubasic"
          className="w-[100px] h-[100px] rounded-xl object-cover border-2 border-green/30 shrink-0"
        />
        <div>
          <h3 className="text-[28px] text-white font-bold">Emina Mukic-Buljubasic</h3>
          <p className={`text-[18px] ${green} font-semibold mt-0.5`}>Co-Founder & CEO</p>
          <p className="text-[17px] text-silver leading-relaxed mt-2">
            Mag. International Business (Uni Vienna). 15+ years in financial management, operations, and partnerships. Managing Director at E2 Partner GmbH — led €2M+ revenue telecom business. EU project management with Soros Foundation, UN, and Swiss Bank.
          </p>
        </div>
      </div>

      {/* Damir */}
      <div className="flex items-start gap-6 mb-6">
        <img
          src={damirPhoto}
          alt="Damir Buljubasic"
          className="w-[100px] h-[100px] rounded-xl object-cover border-2 border-green/30 shrink-0"
        />
        <div>
          <h3 className="text-[28px] text-white font-bold">Damir Buljubasic</h3>
          <p className={`text-[18px] ${green} font-semibold mt-0.5`}>Co-Founder & CIO</p>
          <p className="text-[17px] text-silver leading-relaxed mt-2">
            25+ years enterprise leadership. Founded iLMS Director (1.3M users, merged with Learning Library Inc.). Oracle's Best Sales Director CEE. 3,000% digital transformation at Prevent ASA.
          </p>
        </div>
      </div>

      {/* Nenad */}
      <div>
        <h3 className="text-[28px] text-white font-bold">Nenad Brankovic</h3>
        <p className={`text-[18px] ${green} font-semibold mt-0.5`}>CFO</p>
        <p className="text-[17px] text-silver leading-relaxed mt-2">
          London Business School. Group CFO at MidEuropa Partners companies (€500M revenue). Key role in €1B+ exit to KKR. Led €350M debt refinancing and €475M bond issuance. Board member across FMCG and TMT.
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

// Slide 17: Cap Table / Equity
export const SlideCapTable = () => {
  const segments = [
    { label: "Damir Buljubasic\nCo-Founder & CIO", pct: 60, color: "#00C896" },
    { label: "Emina Mukic-Buljubasic\nCo-Founder & CEO", pct: 10, color: "#00A87A" },
    { label: "Nenad Brankovic\nCFO", pct: 10, color: "#007A5A" },
    { label: "First Investor\n€200K for 20%", pct: 20, color: "#FFD166" },
  ];

  // Build a simple horizontal stacked bar
  return (
    <div className="flex flex-col h-full px-40 py-16 justify-center">
      <div className="flex items-center gap-4 mb-10">
        <PieChart className={green} size={48} />
        <h2 className={`font-display text-[48px] font-bold text-white leading-tight`}>Cap Table & Investment</h2>
      </div>

      {/* Stacked bar */}
      <div className="flex w-full h-[80px] rounded-2xl overflow-hidden mb-10">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ width: `${s.pct}%`, backgroundColor: s.color }}
            className="flex items-center justify-center"
          >
            <span className="text-[24px] font-bold text-charcoal">{s.pct}%</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-4 gap-6 mb-14">
        {segments.map((s) => (
          <div key={s.label} className={cardBg + " flex items-start gap-4"}>
            <div className="w-5 h-5 rounded-full shrink-0 mt-1" style={{ backgroundColor: s.color }} />
            <div>
              <p className="text-[20px] text-white font-bold whitespace-pre-line">{s.label}</p>
              <p className="text-[28px] font-black text-white mt-1">{s.pct}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Investor value proposition */}
      <div className="grid grid-cols-3 gap-8">
        <div className={cardBg + " text-center"}>
          <p className="text-[18px] text-silver mb-2">Investment</p>
          <p className="font-display text-[40px] font-black text-white">€200K</p>
          <p className="text-[16px] text-silver mt-1">for 20% equity</p>
        </div>
        <div className={cardBg + " text-center"}>
          <p className="text-[18px] text-silver mb-2">Implied Valuation</p>
          <p className={`font-display text-[40px] font-black ${green}`}>€1M</p>
          <p className="text-[16px] text-silver mt-1">pre-money</p>
        </div>
        <div className={cardBg + " text-center"}>
          <p className="text-[18px] text-silver mb-2">Projected Return (Y5)</p>
          <p className="font-display text-[40px] font-black text-white">20–80x</p>
          <p className="text-[16px] text-silver mt-1">at €10M–€100M exit</p>
        </div>
      </div>
    </div>
  );
};

// Slide 18: Closing
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
  SlideCover, SlideTitle, SlideProblem, SlideInsight, SlideSolution,
  SlideHowItWorksSeller, SlideHowItWorksBuyer, SlideSavingsExample, SlideProductDemo,
  SlideWhyNow, SlideBusinessModel, SlideRevenueStreams, SlideFlywheel,
  SlidePricing, SlideMarketSize, SlideFinancials, SlideCompetition,
  SlideMoatRoadmap, SlideAsk, SlideFounder, SlideCapTable, SlideClosing,
];
