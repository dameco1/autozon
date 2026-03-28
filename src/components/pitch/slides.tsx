import {
  Car, TrendingDown, Lightbulb, Shield, Brain, Clock, DollarSign,
  Users, RefreshCw, Tag, Globe, BarChart3, Swords, Database,
  Rocket, Heart, ChevronRight, Zap, Search, Handshake, FileText,
  CreditCard, Truck, Crown, PieChart, Target, ArrowRight, Check,
  XCircle, Star, Layers, Map, User, Monitor, MessageSquare, CheckCircle,
  ScanSearch, ShieldAlert, ClipboardCheck
} from "lucide-react";

import damirPhoto from "@/assets/pitch/damir-profile.jpg";
import eminaPhoto from "@/assets/pitch/emina-profile.jpg";
import nenadPhoto from "@/assets/pitch/nenad-profile.jpg";
import carBmw5Black from "@/assets/pitch/car-bmw-5-black.jpg";
import carBmw5Blue from "@/assets/pitch/car-bmw-5-blue.jpg";
import carBmwX2 from "@/assets/pitch/car-bmw-x2.jpg";
import carBmwX6Red from "@/assets/pitch/car-bmw-x6-red.jpg";
import carBmwZ4 from "@/assets/pitch/car-bmw-z4.jpg";
import carCitroenDs5 from "@/assets/pitch/car-citroen-ds5.jpg";
import carPorsche911 from "@/assets/pitch/car-porsche-911.jpg";
import carPorschePanamera from "@/assets/pitch/car-porsche-panamera.jpg";

// ── Light-theme design tokens ──
const accent = "text-primary";
const dim = "text-muted-foreground/60";
const heading = "font-display text-[72px] font-bold text-foreground leading-tight";
const subheading = "font-display text-[48px] font-bold text-foreground leading-tight";
const body = "text-[28px] text-muted-foreground leading-relaxed";
const stat = "font-display text-[96px] font-black text-primary leading-none";
const cardBg = "bg-secondary/60 border border-border rounded-2xl p-8";
const sourceText = "absolute bottom-8 left-40 right-40 text-[16px] text-muted-foreground/40 italic";

// Slide 1: Cover / Investor Intro
export const SlideCover = () => (
  <div className="flex flex-col justify-center h-full px-40 relative">
    <div className="flex items-center gap-6 mb-10">
      <Car className={accent} size={72} />
      <div>
        <h1 className="font-display text-[88px] font-black text-foreground leading-none">
          auto<span className="text-primary">zon</span>
        </h1>
        <p className="text-[28px] text-muted-foreground mt-1 font-light">Sell Fair. Buy Smart.</p>
      </div>
    </div>

    <p className={`${body} max-w-[1400px] leading-[1.7]`}>
      I'm building <span className="text-foreground font-bold">Autozon</span>, the first AI-powered fair‑value car platform that eliminates dealer‑engineered depreciation. Sellers lose <span className={`${accent} font-bold`}>up to 30%</span> because the system is opaque and designed against them. Autozon fixes this with AI photo analysis, live market comparison, and structured negotiations — so sellers keep the full margin.
    </p>

    <p className={`${body} max-w-[1400px] leading-[1.7] mt-6`}>
      The platform is <span className="text-foreground font-bold">free for buyers</span>. Sellers pay a flat listing fee — <span className={`${accent} font-bold`}>€49 Basic</span> or <span className={`${accent} font-bold`}>€99 Premium</span>. The European used‑car market is <span className={`${accent} font-bold`}>€300B+</span>, and no dominant fair‑value car platform exists.
    </p>

    <p className={`${body} max-w-[1400px] leading-[1.7] mt-6`}>
      We've built a <span className="text-foreground font-bold">complete end‑to‑end platform</span> — AI fair‑value engine, photo-based damage detection, lifestyle-aware buyer matching, market comparison, structured negotiation, <span className={`${accent} font-bold`}>full transaction pipeline</span> (contract generation, payment, insurance), AI concierge, <span className={`${accent} font-bold`}>VINCARIO VIN decoding</span> with stolen-vehicle check, 20-point inspection checklist, MFA security, admin dashboard, and bilingual DE/EN support — all live.
    </p>

    <p className={`text-[26px] ${accent} font-semibold mt-10`}>
      If this aligns with your investment strategy and goals in mobility, marketplace, or AI — I'd love to share more.
    </p>

    <div className="absolute bottom-24 left-40 right-40">
      <p className="text-[24px] text-foreground font-light">
        <span className="font-semibold">Emina Mukic-Buljubasic</span>, CEO &amp; <span className="font-semibold">Damir Buljubasic</span>, CIO — Co-Founders
      </p>
    </div>

    <div className="absolute bottom-8 left-40 right-40 flex items-center gap-3">
      <div className="w-12 h-[2px] bg-primary" />
      <span className={`text-[20px] ${dim}`}>Investor Presentation 2026</span>
      <div className="w-12 h-[2px] bg-primary" />
    </div>
  </div>
);

// Slide 2: Title
export const SlideTitle = () => (
  <div className="flex flex-col items-center justify-center h-full px-40 text-center">
    <Car className={accent} size={80} />
    <h1 className="font-display text-[96px] font-black text-foreground mt-8 leading-none">
      auto<span className="text-primary">zon</span>
    </h1>
    <p className="text-[36px] text-muted-foreground mt-4 font-light">
      Sell Fair. Buy Smart.
    </p>
    <div className="mt-16 flex items-center gap-3">
      <div className="w-12 h-[2px] bg-primary" />
      <span className={`text-[24px] ${dim}`}>Investor Presentation 2026</span>
      <div className="w-12 h-[2px] bg-primary" />
    </div>
  </div>
);

// Slide 2: The Problem
export const SlideProblem = () => (
  <div className="flex flex-col justify-center h-full px-40 relative">
    <div className="flex items-center gap-4 mb-12">
      <TrendingDown className={accent} size={48} />
      <h2 className={heading}>The Problem</h2>
    </div>
    <p className={`${body} mb-12 max-w-[1200px]`}>
      Dealers buy low and sell high — that's their business model. Sellers lose <span className="text-foreground font-bold">up to 30%</span> the moment they accept a trade-in. Other platforms let you post a price and hope. Nobody tells you what your car is actually worth.
    </p>
    <div className="grid grid-cols-3 gap-8">
      <div className={cardBg}>
        <p className={stat}>30%</p>
        <p className="text-[24px] text-muted-foreground mt-4">Average value lost selling to dealers</p>
      </div>
      <div className={cardBg}>
        <p className={stat}>€4,200</p>
        <p className="text-[24px] text-muted-foreground mt-4">Hidden dealer margin on every used car</p>
      </div>
      <div className={cardBg}>
        <p className={stat}>73%</p>
        <p className="text-[24px] text-muted-foreground mt-4">Of sellers get below fair value today</p>
      </div>
    </div>
    <p className={sourceText}>Sources: DAT Report 2024; AutoScout24 Market Study 2023; Deloitte Used Car Consumer Survey 2023</p>
  </div>
);

// Slide 3: The Insight
export const SlideInsight = () => (
  <div className="flex flex-col items-center justify-center h-full px-40 text-center">
    <Lightbulb className={accent} size={80} />
    <h2 className="font-display text-[80px] font-black text-foreground mt-12 leading-tight max-w-[1400px]">
      Depreciation isn't natural.
    </h2>
    <h2 className={`font-display text-[80px] font-black ${accent} leading-tight`}>
      It's engineered.
    </h2>
    <div className="w-32 h-1 bg-primary mt-16 rounded-full" />
  </div>
);

// Slide 4: The Solution
export const SlideSolution = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-12">
      <Shield className={accent} size={48} />
      <h2 className={heading}>The Solution</h2>
    </div>
    <p className={`${body} mb-16 max-w-[1200px]`}>
      Autozon's AI analyzes your <span className="text-foreground font-bold">photos, condition, mileage, and specs</span> — then cross-references <span className="text-foreground font-bold">live market listings</span> to calculate the fairest price. Sellers keep the margin. Buyers get lifestyle-matched recommendations.
    </p>
    <div className="grid grid-cols-2 gap-8">
      {[
        { icon: Brain, title: "AI Fair-Value Engine", desc: "Photo analysis + condition scoring + 20-point inspection + live market comparison — your car's true worth in seconds" },
        { icon: ScanSearch, title: "VINCARIO VIN Intelligence", desc: "Commercial vehicle database: 4-endpoint decode (info + specs + OEM + stolen check) auto-fills specs, equipment, and blocks stolen vehicles" },
        { icon: Users, title: "Lifestyle-Aware Matching", desc: "Relationship, kids, purpose, current car, budget — 4D scoring algorithm finds the perfect car for every buyer" },
        { icon: Handshake, title: "End-to-End Transactions", desc: "Contract generation, payment (wire/card/leasing), insurance, structured negotiation — fully digital or manual" },
      ].map(({ icon: Icon, title, desc }) => (
        <div key={title} className={`${cardBg} flex items-start gap-6`}>
          <Icon className={accent} size={36} />
          <div>
            <h3 className="text-[28px] text-foreground font-bold">{title}</h3>
            <p className="text-[24px] text-muted-foreground mt-2">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Slide: VINCARIO Integration — Vehicle Intelligence
export const SlideVincario = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-10">
      <ScanSearch className={accent} size={48} />
      <h2 className={heading}>Vehicle Intelligence — VINCARIO</h2>
    </div>
    <p className={`${body} mb-12 max-w-[1200px]`}>
      Every VIN entered on Autozon triggers a <span className="text-foreground font-bold">4-endpoint commercial database query</span> against VINCARIO's manufacturer-backed EU vehicle registry — delivering instant accuracy that no AI model can match.
    </p>
    <div className="grid grid-cols-2 gap-8">
      {[
        { icon: Database, title: "4-Layer Data Merge", desc: "Info (free base) → Decode (paid specs) → OEM (manufacturer data) → Stolen Check (theft database). Each layer fills gaps from the previous." },
        { icon: Car, title: "Auto-Fill Specs & Equipment", desc: "Make, model, year, body type, fuel, transmission, power, displacement, drive type, CO₂ — plus full equipment list auto-preselected for user confirmation." },
        { icon: ShieldAlert, title: "Stolen Vehicle Blocking", desc: "Real-time query against EU stolen vehicle databases. Flagged VINs are blocked from listing with a prominent alert — protecting buyers and platform integrity." },
        { icon: Brain, title: "Fair Value Enrichment", desc: "VINCARIO data feeds directly into the appraisal formula: MSRP from exact variant match, engine specs for segment-specific mileage expectations, and inspection scoring." },
      ].map(({ icon: Icon, title, desc }) => (
        <div key={title} className={`${cardBg} flex items-start gap-6`}>
          <Icon className={accent} size={36} />
          <div>
            <h3 className="text-[28px] text-foreground font-bold">{title}</h3>
            <p className="text-[24px] text-muted-foreground mt-2">{desc}</p>
          </div>
        </div>
      ))}
    </div>
    <p className={sourceText}>VINCARIO — Commercial vehicle database covering 900M+ VINs across 44 European markets</p>
  </div>
);
export const SlideHowItWorksSeller = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-10">
      <Zap className={accent} size={48} />
      <h2 className={heading}>How It Works — Seller</h2>
    </div>
    <p className={`${body} mb-10 max-w-[1200px]`}>
      Upload photos. Get your <span className={`${accent} font-bold`}>real market price</span>. List for €49. Your ad stays live until your car is sold. No expiry. No re-listing fees.
    </p>
    <div className="grid grid-cols-4 gap-6">
      {[
        { step: "1", icon: ScanSearch, title: "VIN Decode", desc: "Enter VIN → VINCARIO auto-fills make, model, specs, equipment + stolen-vehicle check blocks fraud" },
        { step: "2", icon: Search, title: "AI Photo Scan", desc: "AI analyzes your photos for damage, scratches, dents — brand-specific repair cost estimates" },
        { step: "3", icon: ClipboardCheck, title: "Inspection + Condition", desc: "20-point checklist + 4-grade condition scale — every No/Unknown answer reduces fair value" },
        { step: "4", icon: Brain, title: "Fair Value Engine", desc: "Multi-factor formula + live market data → true market value with price override option" },
      ].map(({ step, icon: Icon, title, desc }) => (
        <div key={title} className={cardBg}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`font-display text-[36px] font-black ${accent}`}>{step}</span>
            <Icon className={accent} size={28} />
          </div>
          <h3 className="text-[22px] text-foreground font-bold">{title}</h3>
          <p className="text-[18px] text-muted-foreground mt-2 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  </div>
);

// Slide 6: How It Works — Buyer & Match
export const SlideHowItWorksBuyer = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-10">
      <Users className={accent} size={48} />
      <h2 className={heading}>How It Works — Buyer & Match</h2>
    </div>
    <div className="grid grid-cols-2 gap-12">
      <div>
        <h3 className={subheading + " mb-6"}>Lifestyle-Aware Discovery</h3>
        <div className="space-y-4">
          {[
            "Registration collects lifestyle + optional buyer preferences: brands, body type, fuel, budget, features, colors, timing",
            "10-step onboarding: body type, fuel, brand, mileage, power, commute, parking, insurance",
            "4D algorithm scores every car: 30% lifestyle + 30% financial + 25% preference + 15% condition",
            "Round 1: 10 best matches → swipe like/dislike → Round 2: 5 → 3 → final 2 finalists",
            "Side-by-side comparison with acquisition options",
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-4">
              <ChevronRight className={`${accent} shrink-0 mt-1`} size={24} />
              <p className="text-[22px] text-muted-foreground">{t}</p>
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
              <ChevronRight className={`${accent} shrink-0 mt-1`} size={24} />
              <p className="text-[22px] text-muted-foreground">{t}</p>
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
        <DollarSign className={accent} size={48} />
        <h2 className={heading}>Real Savings</h2>
      </div>
      <p className={`${body} mb-10 max-w-[1200px]`}>
        Dealers buy low and sell high. You lose up to 30%. Autozon's AI finds the <span className={`${accent} font-bold`}>real market value</span> from your photos and data — so you keep thousands more.
      </p>
      <div className="grid grid-cols-3 gap-8">
        {examples.map(({ car, dealer, autozon, mileage, condition }) => {
          const saved = autozon - dealer;
          const pct = Math.round((saved / dealer) * 100);
          return (
            <div key={car} className={`${cardBg} flex flex-col`}>
              <h3 className="text-[22px] text-foreground font-bold leading-snug">{car}</h3>
              <p className="text-[16px] text-muted-foreground/50 mt-1">{mileage} · {condition}</p>
              <div className="mt-6 space-y-4 flex-1">
                <div>
                  <p className="text-[16px] text-muted-foreground/50 mb-1">Dealer offer</p>
                  <div className="flex items-center gap-3">
                    <div className="h-3 bg-destructive/40 rounded-full" style={{ width: `${(dealer / autozon) * 100}%` }} />
                    <span className="text-[24px] text-muted-foreground font-display font-bold">€{dealer.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[16px] text-primary/80 mb-1">Autozon fair value</p>
                  <div className="flex items-center gap-3">
                    <div className="h-3 bg-primary rounded-full w-full" />
                    <span className={`text-[24px] ${accent} font-display font-bold`}>€{autozon.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border text-center">
                <p className={`font-display text-[40px] font-black ${accent}`}>+€{saved.toLocaleString()}</p>
                <p className="text-[18px] text-muted-foreground/60">{pct}% more in the seller's pocket</p>
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
      <Monitor className={accent} size={48} />
      <h2 className={heading}>Live Product</h2>
    </div>
    <div className="grid grid-cols-2 gap-10">
      {/* Fair Value Result Mock */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
        <div className="bg-secondary/60 px-6 py-3 border-b border-border flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
          </div>
          <span className="text-[14px] text-muted-foreground/40 ml-3">autozon.lovable.app/fair-value</span>
        </div>
        <div className="p-8">
          <div className="text-center mb-6">
            <span className="text-[14px] text-primary bg-primary/10 px-3 py-1 rounded-full">Your Fair-Value Score</span>
            <h3 className="text-[28px] text-foreground font-display font-bold mt-3">2022 Mercedes-Benz C-Class</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-secondary/60 rounded-xl p-4 text-center">
              <p className="text-[14px] text-muted-foreground/60">Condition Score</p>
              <p className="text-[36px] font-display font-black text-primary">90<span className="text-[16px] text-muted-foreground/40">/100</span></p>
            </div>
            <div className="bg-secondary/60 rounded-xl p-4 text-center">
              <p className="text-[14px] text-muted-foreground/60">Demand Score</p>
              <p className="text-[36px] font-display font-black text-primary">85<span className="text-[16px] text-muted-foreground/40">/100</span></p>
            </div>
          </div>
          <div className="bg-secondary/60 rounded-xl p-4">
            <div className="flex justify-between text-[16px] mb-2">
              <span className="text-muted-foreground/60">Your Asking Price</span>
              <span className="text-foreground font-bold">€38,900</span>
            </div>
            <div className="flex justify-between text-[16px] mb-2">
              <span className="text-primary">Value Boosters</span>
              <span className="text-primary font-bold">9 factors</span>
            </div>
            <div className="h-px bg-border my-3" />
            <div className="flex justify-between text-[20px]">
              <span className="text-primary font-semibold">Fair-Value Result</span>
              <span className="text-primary font-display font-black text-[28px]">€35,788</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Flow Mock */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
        <div className="bg-secondary/60 px-6 py-3 border-b border-border flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
          </div>
          <span className="text-[14px] text-muted-foreground/40 ml-3">autozon.lovable.app/transaction</span>
        </div>
        <div className="p-8">
          <div className="text-center mb-6">
            <span className="text-[14px] text-primary bg-primary/10 px-3 py-1 rounded-full">Transaction</span>
            <h3 className="text-[28px] text-foreground font-display font-bold mt-3">2023 BMW 3 Series</h3>
            <p className="text-[14px] text-muted-foreground/50 mt-1">Agreed price: €39,500</p>
          </div>
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-6 px-2">
            {["Method", "Contract", "Payment", "Insurance", "Complete"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold ${i < 3 ? "bg-primary text-primary-foreground" : i === 3 ? "border-2 border-primary text-primary" : "border border-border text-muted-foreground/40"}`}>
                  {i < 3 ? "✓" : i + 1}
                </div>
                <span className={`text-[13px] ${i <= 3 ? "text-foreground" : "text-muted-foreground/40"}`}>{step}</span>
                {i < 4 && <div className={`w-6 h-px ${i < 3 ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>
          {/* Insurance step */}
          <div className="bg-secondary/60 rounded-xl p-4 space-y-3">
            <p className="text-[16px] text-foreground font-semibold">Choose Insurance</p>
            {[
              { tier: "Basic (Haftpflicht)", price: "€38/mo", active: false },
              { tier: "Kasko + Protection", price: "€67/mo", active: true },
              { tier: "Premium All-Risk", price: "€94/mo", active: false },
            ].map(({ tier, price, active }) => (
              <div key={tier} className={`rounded-lg px-4 py-3 flex justify-between items-center ${active ? "bg-primary/10 border border-primary/30" : "bg-secondary/60 border border-border"}`}>
                <span className={`text-[15px] ${active ? "text-primary font-semibold" : "text-muted-foreground"}`}>{tier}</span>
                <span className={`text-[15px] ${active ? "text-primary font-bold" : "text-muted-foreground/60"}`}>{price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <p className="text-center text-[20px] text-muted-foreground/40 mt-8 italic">Live screenshots from the working Autozon platform — end-to-end from valuation to transaction</p>
  </div>
);


export const SlideWhyNow = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-12">
      <Clock className={accent} size={48} />
      <h2 className={heading}>Why Now</h2>
    </div>
    <div className="space-y-6">
      {[
        "Trust in dealerships is collapsing — consumers demand transparency",
        "EU consumer protection directives pushing for price transparency in used-car markets",
        "AI enables personalized matching and fair valuation at scale",
        "No dominant fair-value car platform exists yet — greenfield opportunity",
        "Cross-border DACH/CEE markets are more connected than ever",
      ].map((text, i) => (
        <div key={i} className="flex items-center gap-6">
          <ChevronRight className={accent} size={32} />
          <p className="text-[32px] text-foreground">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

// Slide 7: Business Model
export const SlideBusinessModel = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-12">
      <DollarSign className={accent} size={48} />
      <h2 className={heading}>Business Model</h2>
    </div>
    <div className="grid grid-cols-2 gap-12">
      <div className={cardBg}>
        <div className="flex items-center gap-4 mb-6">
          <Check className={accent} size={36} />
          <h3 className="text-[36px] text-foreground font-bold">Free for Buyers</h3>
        </div>
        <p className="text-[24px] text-muted-foreground">
          Buyers bring liquidity. Liquidity increases trust. Trust attracts sellers. Sellers generate revenue.
        </p>
      </div>
      <div className={`${cardBg} border-primary/30`}>
        <div className="flex items-center gap-4 mb-6">
          <DollarSign className={accent} size={36} />
          <h3 className="text-[36px] text-foreground font-bold">Sellers Pay Listing Fee</h3>
        </div>
        <p className="text-[24px] text-muted-foreground">
          €49 Basic or €99 Premium — simple, transparent, and fair for every car value.
        </p>
      </div>
    </div>
    <p className={`text-[28px] text-muted-foreground mt-12 text-center`}>
      Asymmetric pricing — the proven model behind the world's most successful marketplaces.
    </p>
  </div>
);

// Slide 8: Revenue Streams
export const SlideRevenueStreams = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-10">
      <Layers className={accent} size={48} />
      <h2 className={heading}>Revenue Streams</h2>
    </div>
    <div className="grid grid-cols-3 gap-6">
      {[
        { icon: DollarSign, title: "Seller Listing Fee", desc: "€49 Basic / €99 Premium flat fee", primary: true },
        { icon: Target, title: "Advertising & Sponsors", desc: "Dealer ads, partner promotions, sponsored listings" },
        { icon: CreditCard, title: "Financing & Insurance", desc: "High-margin referral commissions" },
        { icon: Truck, title: "Logistics Add-ons", desc: "Pickup, delivery, inspection" },
        { icon: Crown, title: "Premium Subscription", desc: "Recurring revenue for power users" },
        { icon: Database, title: "Data Intelligence", desc: "Insights for OEMs, fleets, insurers" },
      ].map(({ icon: Icon, title, desc, primary }) => (
        <div key={title} className={`${cardBg} ${primary ? "border-primary/40 bg-primary/5" : ""}`}>
          <Icon className={accent} size={32} />
          <h3 className="text-[24px] text-foreground font-bold mt-4">{title}</h3>
          <p className="text-[20px] text-muted-foreground mt-2">{desc}</p>
          {primary && <span className="inline-block mt-3 text-[16px] text-primary font-bold uppercase tracking-widest">Primary</span>}
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
        <RefreshCw className={accent} size={48} />
        <h2 className={heading}>The Flywheel</h2>
      </div>
      <div className="flex items-center gap-4">
        {steps.map(({ icon: Icon, label }, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`${cardBg} flex flex-col items-center text-center w-[260px]`}>
              <Icon className={accent} size={40} />
              <p className="text-[22px] text-foreground mt-4 font-semibold">{label}</p>
            </div>
            {i < steps.length - 1 && <ArrowRight className={accent} size={28} />}
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
      <Tag className={accent} size={48} />
      <h2 className={heading}>Pricing</h2>
    </div>
    <div className="grid grid-cols-3 gap-8">
      {[
        { tier: "Basic", price: "€49", features: ["Fair-value appraisal", "Market demand score", "Self-service listing"] },
        { tier: "Premium", price: "€99", features: ["Buyer matching", "Concierge support", "Priority visibility"], highlight: true },
        { tier: "Full Service", price: "2.5%", sub: "capped at €499", features: ["Everything above", "Pickup & paperwork", "Zero stress — fully managed"] },
      ].map(({ tier, price, sub, features, highlight }) => (
        <div key={tier} className={`${cardBg} ${highlight ? "border-primary/40 bg-primary/5 scale-105" : ""} flex flex-col`}>
          <h3 className="text-[28px] text-foreground font-bold">{tier}</h3>
          <p className={`font-display text-[56px] font-black ${accent} mt-4`}>{price}</p>
          {sub && <p className="text-[20px] text-muted-foreground -mt-1">{sub}</p>}
          <div className="mt-6 space-y-3 flex-1">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <Check className={accent} size={20} />
                <span className="text-[22px] text-muted-foreground">{f}</span>
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
    <Globe className={accent} size={64} />
    <h2 className={heading + " mt-8"}>Market Size</h2>
    <p className={`${stat} mt-12`}>€300B+</p>
    <p className="text-[36px] text-foreground mt-4">European used-car market</p>
    <div className="w-32 h-1 bg-primary mt-12 rounded-full" />
    <p className="text-[32px] text-muted-foreground mt-8">
      Even <span className={`${accent} font-bold`}>1% penetration</span> = multi-billion opportunity
    </p>
    <p className={sourceText}>Source: ACEA European Automobile Manufacturers' Association, 2024 Report</p>
  </div>
);

// Slide 12: Financial Projections
export const SlideFinancials = () => (
  <div className="flex flex-col justify-center h-full px-40 relative">
    <div className="flex items-center gap-4 mb-10">
      <PieChart className={accent} size={48} />
      <h2 className={heading}>Financial Projections</h2>
    </div>
    <div className="grid grid-cols-3 gap-8 mb-12">
      {[
        { year: "Year 1", txns: "3,000", rev: "€467K", focus: "Austria + Germany launch" },
        { year: "Year 2", txns: "15,000", rev: "€2.5M", focus: "DACH + CEE expansion" },
        { year: "Year 3", txns: "75,000", rev: "€12M+", focus: "Full Europe rollout" },
      ].map(({ year, txns, rev, focus }) => (
        <div key={year} className={cardBg}>
          <h3 className="text-[24px] text-foreground font-bold">{year}</h3>
          <p className={`font-display text-[48px] font-black ${accent} mt-3`}>{rev}</p>
          <p className="text-[22px] text-muted-foreground mt-2">{txns} listings</p>
          <p className="text-[20px] text-muted-foreground/60 mt-1">{focus}</p>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-8">
      <div className={cardBg}>
        <p className="text-[20px] text-muted-foreground">Avg listing fee</p>
        <p className={`text-[36px] font-bold ${accent}`}>€74–€84</p>
      </div>
      <div className={cardBg}>
        <p className="text-[20px] text-muted-foreground">Gross margin</p>
        <p className={`text-[36px] font-bold ${accent}`}>~87%</p>
      </div>
      <div className={cardBg}>
        <p className="text-[20px] text-muted-foreground">LTV / CAC</p>
        <p className={`text-[36px] font-bold ${accent}`}>2.5x → 3.7x</p>
      </div>
    </div>
    <p className={sourceText}>Base case projections; flat-fee model (€49 Basic / €99 Premium) + advertising & service revenue</p>
  </div>
);

// Slide 13: Competitive Landscape
export const SlideCompetition = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-12">
      <Swords className={accent} size={48} />
      <h2 className={heading}>Competitive Landscape</h2>
    </div>
    <div className="grid grid-cols-3 gap-8">
      <div className={cardBg}>
        <XCircle className="text-destructive" size={36} />
        <h3 className="text-[28px] text-foreground font-bold mt-4">Listings</h3>
        <p className="text-[22px] text-muted-foreground mt-2">AutoScout / mobile.de</p>
        <p className="text-[20px] text-muted-foreground/60 mt-4">Listings ≠ Intelligence</p>
      </div>
      <div className={cardBg}>
        <XCircle className="text-destructive" size={36} />
        <h3 className="text-[28px] text-foreground font-bold mt-4">Dealers</h3>
        <p className="text-[22px] text-muted-foreground mt-2">Traditional dealerships</p>
        <p className="text-[20px] text-muted-foreground/60 mt-4">Dealers ≠ Fairness</p>
      </div>
      <div className={`${cardBg} border-primary/40 bg-primary/5`}>
        <Star className={accent} size={36} />
        <h3 className={`text-[28px] font-bold mt-4 ${accent}`}>Autozon</h3>
        <p className="text-[22px] text-foreground mt-2">AI fair-value ecosystem</p>
        <p className="text-[20px] text-muted-foreground mt-4">Intelligence + Fairness + Execution</p>
      </div>
    </div>
  </div>
);

// Slide 14: Moat & Roadmap
export const SlideMoatRoadmap = () => (
  <div className="flex flex-col justify-center h-full px-40">
    <div className="flex items-center gap-4 mb-10">
      <Map className={accent} size={48} />
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
            <RefreshCw className={accent} size={24} />
            <p className="text-[24px] text-muted-foreground">{t}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className={subheading + " mb-6"}>Roadmap</h3>
        {[
          { phase: "MVP", desc: "Valuation + matching + negotiation ✅" },
          { phase: "V1", desc: "Transactions, concierge, MFA, i18n, admin ✅" },
          { phase: "V1.5", desc: "Lifestyle matching, brand-specific damage costs ✅" },
          { phase: "V2", desc: "VINCARIO VIN decode + stolen check, 20-pt inspection scoring ✅" },
          { phase: "V3", desc: "Dealer network, logistics, fleet tools, lifecycle platform" },
        ].map(({ phase, desc }) => (
          <div key={phase} className="flex items-center gap-4 mb-4">
            <span className={`text-[24px] ${accent} font-bold w-16`}>{phase}</span>
            <ArrowRight className="text-muted-foreground/40" size={20} />
            <p className="text-[24px] text-muted-foreground">{desc}</p>
          </div>
        ))}
        <p className="text-[22px] text-muted-foreground/60 mt-6">
          GTM: Austria + Germany → DACH → CEE
        </p>
      </div>
    </div>
  </div>
);

// Slide 15: The Ask
export const SlideAsk = () => (
  <div className="flex flex-col items-center justify-center h-full px-40 text-center">
    <Rocket className={accent} size={64} />
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
          <Icon className={accent} size={40} />
          <p className="text-[24px] text-foreground font-bold mt-4">{text}</p>
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
  <div className="flex flex-col h-full px-28 justify-center">
    {/* Header */}
    <div className="flex items-center gap-4 mb-6">
      <User className={accent} size={44} />
      <h2 className="font-display text-[48px] font-bold text-foreground leading-tight">The Founding Team</h2>
    </div>

    {/* Three cards side by side */}
    <div className="grid grid-cols-3 gap-5">
      {/* Emina */}
      <div className="bg-secondary/60 border border-border rounded-2xl p-6 flex flex-col">
        <div className="flex flex-col items-center text-center mb-3">
          <img src={eminaPhoto} alt="Emina Mukic-Buljubasic" className="w-[88px] h-[88px] rounded-full object-cover border-2 border-primary/40 mb-2" />
          <h3 className="text-[22px] text-foreground font-bold leading-tight">Emina Mukic-Buljubasic</h3>
          <p className={`text-[16px] ${accent} font-semibold`}>Co-Founder & CEO</p>
        </div>
        <p className="text-[20px] text-muted-foreground leading-relaxed mb-3">Mag. International Business from the University of Vienna. Over 15 years in financial management, strategic operations, and international partnerships.</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2"><Check size={18} className={`${accent} shrink-0 mt-0.5`} /><span className="text-[20px] text-foreground/80">Scaled telecom operations to €2M+ annual revenue</span></div>
          <div className="flex items-start gap-2"><Check size={18} className={`${accent} shrink-0 mt-0.5`} /><span className="text-[20px] text-foreground/80">EU-level project management for UN & Soros Foundation</span></div>
          <div className="flex items-start gap-2"><Check size={18} className={`${accent} shrink-0 mt-0.5`} /><span className="text-[20px] text-foreground/80">Business development across 5 countries, fluent in 4 languages</span></div>
        </div>
      </div>

      {/* Damir */}
      <div className="bg-secondary/60 border border-border rounded-2xl p-6 flex flex-col">
        <div className="flex flex-col items-center text-center mb-3">
          <img src={damirPhoto} alt="Damir Buljubasic" className="w-[88px] h-[88px] rounded-full object-cover border-2 border-primary/40 mb-2" />
          <h3 className="text-[22px] text-foreground font-bold leading-tight">Damir Buljubasic</h3>
          <p className={`text-[16px] ${accent} font-semibold`}>Co-Founder & CIO</p>
        </div>
        <p className="text-[20px] text-muted-foreground leading-relaxed mb-3">20+ years in enterprise sales, strategic partnerships, and business operations across automotive, tech, and financial services.</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2"><Check size={18} className={`${accent} shrink-0 mt-0.5`} /><span className="text-[20px] text-foreground/80">Built & managed sales teams across telecom & automotive</span></div>
          <div className="flex items-start gap-2"><Check size={18} className={`${accent} shrink-0 mt-0.5`} /><span className="text-[20px] text-foreground/80">Led cross-border B2B partnerships spanning 8+ markets</span></div>
          <div className="flex items-start gap-2"><Check size={18} className={`${accent} shrink-0 mt-0.5`} /><span className="text-[20px] text-foreground/80">Drove go-to-market strategy for multi-million € revenue products</span></div>
        </div>
      </div>

      {/* Nenad */}
      <div className="bg-secondary/60 border border-border rounded-2xl p-6 flex flex-col">
        <div className="flex flex-col items-center text-center mb-3">
          <img src={nenadPhoto} alt="Nenad Brankovic" className="w-[88px] h-[88px] rounded-full object-cover border-2 border-primary/40 mb-2" />
          <h3 className="text-[22px] text-foreground font-bold leading-tight">Nenad Brankovic</h3>
          <p className={`text-[16px] ${accent} font-semibold`}>CFO</p>
        </div>
        <p className="text-[20px] text-muted-foreground leading-relaxed mb-3">15+ years in private equity, financial structuring, and M&A advisory. Expert in capital markets, risk assessment, and portfolio management.</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2"><Check size={18} className={`${accent} shrink-0 mt-0.5`} /><span className="text-[20px] text-foreground/80">Managed €50M+ investment portfolio in CEE region</span></div>
          <div className="flex items-start gap-2"><Check size={18} className={`${accent} shrink-0 mt-0.5`} /><span className="text-[20px] text-foreground/80">Advised on 20+ M&A transactions across multiple sectors</span></div>
          <div className="flex items-start gap-2"><Check size={18} className={`${accent} shrink-0 mt-0.5`} /><span className="text-[20px] text-foreground/80">Built investor relations frameworks for Series A–C companies</span></div>
        </div>
      </div>
    </div>

    {/* Car showcase */}
    <div className="mt-5">
      <p className="text-[16px] text-muted-foreground/40 mb-3 text-center">Cars currently listed on the platform</p>
      <div className="flex gap-3 justify-center">
        {carImages.map((src, i) => (
          <img key={i} src={src} alt="" className="w-[120px] h-[72px] rounded-lg object-cover border border-border" />
        ))}
      </div>
    </div>
  </div>
);

// Slide 17: Cap Table / Equity
export const SlideCapTable = () => {
  const segments = [
    { label: "Damir Buljubasic\nCo-Founder & CIO", pct: 57.69, color: "hsl(24 95% 53%)" },
    { label: "Emina Mukic-Buljubasic\nCo-Founder & CEO", pct: 9.62, color: "hsl(24 80% 45%)" },
    { label: "Nenad Brankovic\nCFO", pct: 9.62, color: "hsl(24 65% 38%)" },
    { label: "First Investor\n€300K for 23.08%", pct: 23.08, color: "hsl(155 100% 42%)" },
  ];

  return (
    <div className="flex flex-col h-full px-40 py-16 justify-center">
      <div className="flex items-center gap-4 mb-10">
        <PieChart className={accent} size={48} />
        <h2 className="font-display text-[48px] font-bold text-foreground leading-tight">Cap Table & Investment</h2>
      </div>

      {/* Stacked bar */}
      <div className="flex w-full h-[80px] rounded-2xl overflow-hidden mb-10 shadow-md">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ width: `${s.pct}%`, backgroundColor: s.color }}
            className="flex items-center justify-center"
          >
            <span className="text-[24px] font-bold text-primary-foreground">{Number.isInteger(s.pct) ? s.pct : s.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-4 gap-6 mb-14">
        {segments.map((s) => (
          <div key={s.label} className={cardBg + " flex items-start gap-4"}>
            <div className="w-5 h-5 rounded-full shrink-0 mt-1" style={{ backgroundColor: s.color }} />
            <div>
              <p className="text-[20px] text-foreground font-bold whitespace-pre-line">{s.label}</p>
              <p className="text-[28px] font-black text-foreground mt-1">{Number.isInteger(s.pct) ? s.pct : s.pct.toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Investor value proposition */}
      <div className="grid grid-cols-3 gap-8">
        <div className={cardBg + " text-center"}>
          <p className="text-[18px] text-muted-foreground mb-2">Investment</p>
          <p className="font-display text-[40px] font-black text-foreground">€300K</p>
          <p className="text-[16px] text-muted-foreground mt-1">for 23.08% equity</p>
        </div>
        <div className={cardBg + " text-center"}>
          <p className="text-[18px] text-muted-foreground mb-2">Post-Money Valuation</p>
          <p className={`font-display text-[40px] font-black ${accent}`}>€1.3M</p>
          <p className="text-[16px] text-muted-foreground mt-1">pre-money €1M</p>
        </div>
        <div className={cardBg + " text-center"}>
          <p className="text-[18px] text-muted-foreground mb-2">Projected Return (Y5)</p>
          <p className="font-display text-[40px] font-black text-foreground">20–80x</p>
          <p className="text-[16px] text-muted-foreground mt-1">at €10M–€100M exit</p>
        </div>
      </div>
    </div>
  );
};

// Slide: Investor Data Room
const dataRoomModules = [
  { icon: Monitor, label: "Company Overview" },
  { icon: Users, label: "Team & Advisors" },
  { icon: User, label: "Founder Profile" },
  { icon: PieChart, label: "Cap Table" },
  { icon: DollarSign, label: "Revenue Model" },
  { icon: BarChart3, label: "Financial Projections" },
  { icon: Target, label: "Use of Funds" },
  { icon: Map, label: "Go-to-Market Strategy" },
  { icon: Swords, label: "Competitive Analysis" },
  { icon: Rocket, label: "Product Roadmap" },
  { icon: BarChart3, label: "KPI Dashboard" },
  { icon: Globe, label: "Partnership Pipeline" },
  { icon: Layers, label: "Corporate Structure" },
  { icon: Shield, label: "Security Architecture" },
  { icon: FileText, label: "GDPR Compliance" },
  { icon: Star, label: "IP & Trademarks" },
  { icon: Database, label: "Technical Architecture" },
  { icon: CheckCircle, label: "Launch Checklist" },
];

export const SlideDataRoom = () => (
  <div className="flex flex-col h-full px-40 justify-center">
    <div className="flex items-center gap-4 mb-4">
      <Shield className={accent} size={48} />
      <h2 className="font-display text-[48px] font-bold text-foreground leading-tight">Investor Data Room</h2>
    </div>

    <p className="text-[24px] text-muted-foreground leading-relaxed mb-8 max-w-[1200px]">
      A <span className="text-foreground font-semibold">comprehensive, password-protected data room</span> is ready for your due diligence — accessible online at{" "}
      <span className={`${accent} font-bold`}>autozon.lovable.app/docs</span>. Every document is available for download.
    </p>

    <div className="grid grid-cols-3 gap-4 mb-8">
      {dataRoomModules.map(({ icon: Icon, label }) => (
        <div key={label} className="bg-secondary/60 border border-border rounded-xl px-5 py-4 flex items-center gap-4">
          <Icon className={accent} size={22} />
          <span className="text-[20px] text-foreground/90">{label}</span>
        </div>
      ))}
    </div>

    <div className="bg-primary/10 border border-primary/20 rounded-2xl px-8 py-5 text-center">
      <p className="text-[22px] text-foreground leading-relaxed">
        <span className={`${accent} font-bold`}>18 modules</span> covering strategy, financials, legal, technology, and operations —{" "}
        <span className="text-foreground font-semibold">ready for investor review today</span>
      </p>
    </div>
  </div>
);

// Slide: Closing
export const SlideClosing = () => (
  <div className="flex flex-col items-center justify-center h-full px-40 text-center">
    <Heart className={accent} size={64} />
    <h2 className="font-display text-[48px] font-bold text-foreground mt-12 max-w-[1200px] leading-tight">
      Your car has a fair price.
    </h2>
    <h2 className={`font-display text-[48px] font-bold ${accent} mt-4`}>
      We'll find it.
    </h2>
    <p className="text-[28px] text-muted-foreground mt-4">AI-powered valuation. Real market data. You keep the margin.</p>
    <div className="w-32 h-1 bg-primary mt-16 rounded-full" />
    <p className="text-[24px] text-muted-foreground/60 mt-8 italic max-w-[1000px]">
      "Autozon is an AI fair-value engine for the €300B used-car market."
    </p>
    <p className="font-display text-[36px] font-black text-foreground mt-16">
      auto<span className="text-primary">zon</span>
    </p>
  </div>
);

export const allSlides = [
  SlideCover, SlideTitle, SlideProblem, SlideInsight, SlideSolution,
  SlideHowItWorksSeller, SlideHowItWorksBuyer, SlideSavingsExample, SlideProductDemo,
  SlideWhyNow, SlideBusinessModel, SlideRevenueStreams, SlideFlywheel,
  SlidePricing, SlideMarketSize, SlideFinancials, SlideCompetition,
  SlideMoatRoadmap, SlideAsk, SlideFounder, SlideCapTable, SlideDataRoom, SlideClosing,
];
