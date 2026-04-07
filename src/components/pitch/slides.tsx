import {
  Car, TrendingDown, Lightbulb, Shield, Brain, Clock, DollarSign,
  Users, RefreshCw, Tag, Globe, BarChart3, Swords, Database,
  Rocket, Heart, ChevronRight, Zap, Search, Handshake, FileText,
  CreditCard, Truck, Crown, PieChart, Target, ArrowRight, Check,
  XCircle, Star, Layers, Map, User, Monitor, MessageSquare, CheckCircle,
  ScanSearch, ShieldAlert, ClipboardCheck, TrendingUp, Scale, Lock,
  Megaphone, AlertTriangle, Briefcase
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

// ─── Slide 1: Cover ───
export const SlideCover = () => (
  <div className="flex flex-col justify-between h-full px-40 py-16 relative">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <Car className={accent} size={56} />
        <div>
          <h1 className="font-display text-[64px] font-black text-foreground leading-none">
            auto<span className="text-primary">zon</span>
          </h1>
          <p className="text-[22px] text-muted-foreground mt-1 font-light">Sell Fair. Buy Smart.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-[2px] bg-primary" />
        <span className="text-[18px] text-muted-foreground/50">Investor Presentation 2026</span>
      </div>
    </div>

    {/* Main headline */}
    <div className="flex-1 flex flex-col justify-center max-w-[1400px]">
      <h2 className={heading}>
        Fair Value. Full Transaction.
      </h2>
      <div className="w-32 h-1 bg-primary my-8 rounded-full" />

      <div className="space-y-5">
        {[
          { icon: Globe, text: "First fully digitized end‑to‑end marketplace for used cars, parts & merchandise." },
          { icon: Brain, text: "AI fair‑value engine that returns thousands more to sellers." },
          { icon: Handshake, text: "Structured online negotiation and legally enforced transaction orchestration." },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-4">
            <Icon className={`${accent} shrink-0 mt-1`} size={28} />
            <p className={body}>{text}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom stats */}
    <div className="grid grid-cols-4 gap-6">
      {[
        { value: "€300B+", label: "EU used-car market" },
        { value: "~30%", label: "Lost to dealer margins" },
        { value: "€49", label: "Flat listing fee" },
        { value: "10 days", label: "Avg. time to sale target" },
      ].map(({ value, label }) => (
        <div key={label} className="text-center">
          <p className={`font-display text-[40px] font-black ${accent}`}>{value}</p>
          <p className="text-[18px] text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─── Slide 2: Executive Summary ───
export const SlideExecutiveSummary = () => (
  <div className="flex flex-col h-full px-40 py-16 justify-center">
    <div className="flex items-center gap-4 mb-10">
      <Lightbulb className={accent} size={48} />
      <h2 className={subheading}>One platform that turns used‑car friction into predictable, high‑margin transactions.</h2>
    </div>

    <div className="grid grid-cols-3 gap-8">
      {[
        { icon: Layers, title: "Product", text: "Valuation → Match → Negotiate → Execute, all in one flow." },
        { icon: Shield, title: "Moat", text: "Proprietary AI + VINCARIO data + transaction orchestration = defensible flywheel." },
        { icon: Globe, title: "Opportunity", text: "€300B EU market; 1% penetration = multi‑billion revenue potential." },
      ].map(({ icon: Icon, title, text }) => (
        <div key={title} className={cardBg}>
          <Icon className={`${accent} mb-4`} size={36} />
          <h3 className="text-[28px] text-foreground font-bold mb-3">{title}</h3>
          <p className="text-[22px] text-muted-foreground leading-relaxed">{text}</p>
        </div>
      ))}
    </div>

    <p className={sourceText}>
      Autozon is the trust layer the market lacks — buyers get certainty, sellers keep margin, partners get high‑quality leads.
    </p>
  </div>
);

// ─── Slide 3: Why Now ───
export const SlideWhyNow = () => (
  <div className="flex flex-col h-full px-40 py-16 justify-center">
    <div className="flex items-center gap-4 mb-10">
      <Clock className={accent} size={48} />
      <h2 className={subheading}>Market forces and regulation create a rare window to capture massive share.</h2>
    </div>

    <div className="grid grid-cols-3 gap-8">
      {[
        { icon: TrendingDown, title: "Consumer Demand", text: "Dealers still capture ~30% of value; consumers demand transparency and higher returns." },
        { icon: FileText, title: "Regulatory Tailwinds", text: "EU consumer protection and digital adoption accelerate platformization of transactions." },
        { icon: Brain, title: "AI Maturity", text: "Data and AI maturity now allow accurate, scalable fair‑value pricing." },
      ].map(({ icon: Icon, title, text }) => (
        <div key={title} className={cardBg}>
          <Icon className={`${accent} mb-4`} size={36} />
          <h3 className="text-[28px] text-foreground font-bold mb-3">{title}</h3>
          <p className="text-[22px] text-muted-foreground leading-relaxed">{text}</p>
        </div>
      ))}
    </div>

    <p className={sourceText}>
      Timing matters: incumbents are slow; a focused product can win category leadership now.
    </p>
  </div>
);

// ─── Slide 4: Problem ───
export const SlideProblem = () => (
  <div className="flex flex-col h-full px-40 py-16 justify-center">
    <div className="flex items-center gap-4 mb-10">
      <XCircle className={accent} size={48} />
      <h2 className={subheading}>Sellers lose thousands; buyers face friction; platforms capture little of the transaction value.</h2>
    </div>

    <div className="grid grid-cols-3 gap-8 mb-12">
      {[
        { icon: TrendingDown, title: "Hidden Dealer Margins", text: "Sellers routinely accept offers far below market — average hidden dealer margin ~€4,200." },
        { icon: RefreshCw, title: "Fragmented Process", text: "Valuation, negotiation, paperwork are disconnected and slow — increasing time to sale." },
        { icon: Tag, title: "Listings, Not Transactions", text: "Existing marketplaces monetize listings, not transactions — limited upside per deal." },
      ].map(({ icon: Icon, title, text }) => (
        <div key={title} className={cardBg}>
          <Icon className={`${accent} mb-4`} size={36} />
          <h3 className="text-[28px] text-foreground font-bold mb-3">{title}</h3>
          <p className="text-[22px] text-muted-foreground leading-relaxed">{text}</p>
        </div>
      ))}
    </div>

    <div className="bg-primary/10 border border-primary/20 rounded-2xl px-8 py-6 text-center">
      <p className="text-[24px] text-foreground leading-relaxed">
        Solving execution unlocks <span className={`${accent} font-bold`}>much larger revenue per transaction</span> than listings alone.
      </p>
    </div>
  </div>
);

// ─── Slide 5: Product (Demo-Ready) ───
export const SlideProduct = () => (
  <div className="flex flex-col h-full px-40 py-16 justify-center">
    <div className="flex items-center gap-4 mb-10">
      <Monitor className={accent} size={48} />
      <h2 className={subheading}>Live product: AI valuation, VIN intelligence, structured negotiation, and transaction orchestration.</h2>
    </div>

    <div className="grid grid-cols-3 gap-8 mb-10">
      {[
        { icon: ScanSearch, title: "Valuation", text: "Photo + 20‑pt inspection + VINCARIO + live market = instant fair value." },
        { icon: MessageSquare, title: "Negotiation", text: "3‑round structured offers with AI guidance; higher close rates, faster cycles." },
        { icon: ClipboardCheck, title: "Execution", text: "KYC, contract generation, insurance, registration orchestration, deadline enforcement." },
      ].map(({ icon: Icon, title, text }) => (
        <div key={title} className={cardBg}>
          <Icon className={`${accent} mb-4`} size={36} />
          <h3 className="text-[28px] text-foreground font-bold mb-3">{title}</h3>
          <p className="text-[22px] text-muted-foreground leading-relaxed">{text}</p>
        </div>
      ))}
    </div>

    {/* Flow diagram */}
    <div className="flex items-center justify-center gap-3">
      {["Upload", "Fair Value", "List", "Negotiate", "Close", "Handover"].map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div className={`px-6 py-3 rounded-xl ${i === 0 || i === 5 ? "bg-primary text-primary-foreground" : "bg-secondary/80 text-foreground"} text-[20px] font-semibold`}>
            {step}
          </div>
          {i < 5 && <ArrowRight className="text-muted-foreground/40" size={20} />}
        </div>
      ))}
    </div>
  </div>
);

// ─── Slide 6: Return Drivers ───
export const SlideReturnDrivers = () => (
  <div className="flex flex-col h-full px-40 py-16 justify-center">
    <div className="flex items-center gap-4 mb-10">
      <TrendingUp className={accent} size={48} />
      <h2 className={subheading}>Multiple, compounding revenue streams and clear scale economics.</h2>
    </div>

    <div className="grid grid-cols-3 gap-8 mb-10">
      {[
        { icon: DollarSign, title: "High-Margin Core", text: "Flat listing fees with >80% gross margin." },
        { icon: CreditCard, title: "Upsell & Referrals", text: "Financing, insurance, logistics and parts drive 3–5× ARPU." },
        { icon: Database, title: "Data Monetization", text: "Valuation and market intelligence for OEMs, insurers, fleets." },
      ].map(({ icon: Icon, title, text }) => (
        <div key={title} className={cardBg}>
          <Icon className={`${accent} mb-4`} size={36} />
          <h3 className="text-[28px] text-foreground font-bold mb-3">{title}</h3>
          <p className="text-[22px] text-muted-foreground leading-relaxed">{text}</p>
        </div>
      ))}
    </div>

    <div className="bg-primary/10 border border-primary/20 rounded-2xl px-8 py-6 text-center">
      <p className="text-[24px] text-foreground leading-relaxed">
        Transaction control increases take rates vs. pure listing models — <span className={`${accent} font-bold`}>add‑ons accelerate CAC payback</span>.
      </p>
    </div>
  </div>
);

// ─── Slide 7: Moat & Defensibility ───
export const SlideMoat = () => (
  <div className="flex flex-col h-full px-40 py-16 justify-center">
    <div className="flex items-center gap-4 mb-10">
      <Lock className={accent} size={48} />
      <h2 className={subheading}>Data, integrations, and execution create a durable competitive advantage.</h2>
    </div>

    <div className="grid grid-cols-3 gap-8 mb-10">
      {[
        { icon: Brain, title: "Proprietary Valuation", text: "AI model trained on photos, inspections and market signals — improves with every listing." },
        { icon: Database, title: "VINCARIO Partnership", text: "Manufacturer‑grade specs and stolen‑vehicle blocking — hard to replicate data feed." },
        { icon: Shield, title: "Operational Moat", text: "Legal workflow + deadline enforcement that incumbents don't have." },
      ].map(({ icon: Icon, title, text }) => (
        <div key={title} className={cardBg}>
          <Icon className={`${accent} mb-4`} size={36} />
          <h3 className="text-[28px] text-foreground font-bold mb-3">{title}</h3>
          <p className="text-[22px] text-muted-foreground leading-relaxed">{text}</p>
        </div>
      ))}
    </div>

    {/* Flywheel */}
    <div className="flex items-center justify-center gap-4">
      {["Better Valuations", "More Sellers", "More Listings", "Better Models", "More Buyers"].map((step, i) => (
        <div key={step} className="flex items-center gap-4">
          <span className="text-[20px] text-foreground font-semibold bg-secondary/80 px-5 py-3 rounded-xl">{step}</span>
          {i < 4 && <ArrowRight className={accent} size={20} />}
        </div>
      ))}
    </div>
  </div>
);

// ─── Slide 8: Go‑to‑Market ───
export const SlideGTM = () => (
  <div className="flex flex-col h-full px-40 py-16 justify-center">
    <div className="flex items-center gap-4 mb-10">
      <Megaphone className={accent} size={48} />
      <h2 className={subheading}>A repeatable funnel to seed liquidity and scale across DACH → Europe.</h2>
    </div>

    <div className="grid grid-cols-3 gap-8 mb-10">
      {[
        { icon: Target, title: "Acquisition", text: "Performance marketing for sellers, SEO for valuation queries, partnerships with inspection networks." },
        { icon: Handshake, title: "Distribution", text: "Insurers, OEM finance, and inspection partners for embedded flows and lead generation." },
        { icon: Truck, title: "Supply Growth", text: "Targeted dealer/fleet pilots to accelerate inventory and trust." },
      ].map(({ icon: Icon, title, text }) => (
        <div key={title} className={cardBg}>
          <Icon className={`${accent} mb-4`} size={36} />
          <h3 className="text-[28px] text-foreground font-bold mb-3">{title}</h3>
          <p className="text-[22px] text-muted-foreground leading-relaxed">{text}</p>
        </div>
      ))}
    </div>

    {/* Funnel */}
    <div className="flex items-center justify-center gap-3">
      {["Valuation Ad", "Listing", "Buyer Match", "Negotiation", "Transaction"].map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <span className="text-[18px] text-foreground font-semibold bg-secondary/80 px-5 py-3 rounded-xl">{step}</span>
          {i < 4 && <ChevronRight className="text-muted-foreground/40" size={20} />}
        </div>
      ))}
    </div>
  </div>
);

// ─── Slide 9: Traction & Proof Points ───
export const SlideTraction = () => (
  <div className="flex flex-col h-full px-40 py-16 justify-center">
    <div className="flex items-center gap-4 mb-10">
      <Rocket className={accent} size={48} />
      <h2 className={subheading}>Live MVP with measurable seller uplift and transaction flow validation.</h2>
    </div>

    <div className="grid grid-cols-3 gap-8 mb-10">
      {[
        { icon: Monitor, title: "Production Product", text: "Working fair‑value and transaction pages live in production." },
        { icon: TrendingUp, title: "Seller Uplift", text: "Representative uplifts: +€3K–€5.5K vs. dealer trade‑in in pilot cases." },
        { icon: BarChart3, title: "Early KPIs", text: "Listings growth, conversion rate, and time‑to‑sale improvements tracked." },
      ].map(({ icon: Icon, title, text }) => (
        <div key={title} className={cardBg}>
          <Icon className={`${accent} mb-4`} size={36} />
          <h3 className="text-[28px] text-foreground font-bold mb-3">{title}</h3>
          <p className="text-[22px] text-muted-foreground leading-relaxed">{text}</p>
        </div>
      ))}
    </div>

    <div className="bg-primary/10 border border-primary/20 rounded-2xl px-8 py-6 text-center">
      <p className="text-[24px] text-foreground leading-relaxed">
        Conservative, repeatable outcomes — <span className={`${accent} font-bold`}>real economic impact validated in pilot</span>.
      </p>
    </div>
  </div>
);

// ─── Slide 10: Financials & Unit Economics ───
export const SlideFinancials = () => (
  <div className="flex flex-col h-full px-40 py-16 justify-center">
    <div className="flex items-center gap-4 mb-10">
      <BarChart3 className={accent} size={48} />
      <h2 className={subheading}>Conservative projections with clear scaling levers and high gross margins.</h2>
    </div>

    {/* Y1-Y3 projection cards */}
    <div className="grid grid-cols-3 gap-8 mb-10">
      {[
        { year: "Year 1", revenue: "€40–80K", listings: "~800", margin: "~75%", note: "Austria launch, prove unit economics" },
        { year: "Year 2", revenue: "€200–400K", listings: "~3,000", margin: "~80%", note: "DACH expansion, add‑on revenue" },
        { year: "Year 3", revenue: "€800K–1.5M", listings: "~8,000", margin: "~85%", note: "European scale, data products" },
      ].map(({ year, revenue, listings, margin, note }) => (
        <div key={year} className={cardBg}>
          <h3 className={`text-[28px] font-bold ${accent} mb-4`}>{year}</h3>
          <div className="space-y-3">
            <div>
              <p className="text-[18px] text-muted-foreground">Revenue</p>
              <p className="text-[32px] font-black text-foreground">{revenue}</p>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-[16px] text-muted-foreground">Listings</p>
                <p className="text-[22px] font-bold text-foreground">{listings}</p>
              </div>
              <div>
                <p className="text-[16px] text-muted-foreground">Gross Margin</p>
                <p className="text-[22px] font-bold text-foreground">{margin}</p>
              </div>
            </div>
            <p className="text-[18px] text-muted-foreground/80 italic">{note}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-3 gap-8">
      {[
        { label: "Break-Even", value: "Month 5–6" },
        { label: "High gross margin", value: ">80%" },
        { label: "ARPU expansion", value: "3–5× via add‑ons" },
      ].map(({ label, value }) => (
        <div key={label} className="bg-primary/10 border border-primary/20 rounded-xl px-6 py-4 text-center">
          <p className="text-[18px] text-muted-foreground">{label}</p>
          <p className={`text-[28px] font-black ${accent}`}>{value}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─── Slide 11: Team ───
const carImages = [
  carCitroenDs5, carBmw5Black, carBmw5Blue, carBmwZ4,
  carBmwX6Red, carBmwX2, carPorsche911, carPorschePanamera,
];

export const SlideTeam = () => (
  <div className="flex flex-col h-full px-28 justify-center">
    <div className="flex items-center gap-4 mb-6">
      <Users className={accent} size={44} />
      <h2 className={subheading}>Founders with deep domain experience and execution track record.</h2>
    </div>

    <div className="grid grid-cols-3 gap-5">
      {/* Emina */}
      <div className="bg-secondary/60 border border-border rounded-2xl p-6 flex flex-col">
        <div className="flex flex-col items-center text-center mb-3">
          <img src={eminaPhoto} alt="Emina Mukic-Buljubasic" className="w-[88px] h-[88px] rounded-full object-cover border-2 border-primary/40 mb-2" />
          <h3 className="text-[22px] text-foreground font-bold leading-tight">Emina Mukic-Buljubasic</h3>
          <p className={`text-[16px] ${accent} font-semibold`}>Co-Founder & CEO</p>
        </div>
        <p className="text-[20px] text-muted-foreground leading-relaxed mb-3">Operations, finance, partnerships. Mag. International Business, University of Vienna. 15+ years in financial management and strategic operations.</p>
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
        <p className="text-[20px] text-muted-foreground leading-relaxed mb-3">Product, automotive partnerships, enterprise sales. 20+ years across automotive, tech, and financial services.</p>
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
        <p className="text-[20px] text-muted-foreground leading-relaxed mb-3">Capital markets, M&A, financial structuring. 15+ years in private equity and portfolio management.</p>
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

// ─── Slide 12: Risk Mitigation & Regulatory Readiness ───
export const SlideRisk = () => (
  <div className="flex flex-col h-full px-40 py-16 justify-center">
    <div className="flex items-center gap-4 mb-10">
      <ShieldAlert className={accent} size={48} />
      <h2 className={subheading}>Practical approach to legal, compliance and operational risks.</h2>
    </div>

    <div className="grid grid-cols-3 gap-8 mb-10">
      {[
        { icon: ClipboardCheck, title: "Legal Workflow", text: "Built‑in legal workflow and deadline enforcement to reduce fraud and disputes." },
        { icon: Shield, title: "KYC & Partners", text: "KYC integration plan (Didit) and insurance/financing partner roadmap." },
        { icon: Lock, title: "GDPR & Privacy", text: "Data privacy and GDPR compliance baked into architecture and processes." },
      ].map(({ icon: Icon, title, text }) => (
        <div key={title} className={cardBg}>
          <Icon className={`${accent} mb-4`} size={36} />
          <h3 className="text-[28px] text-foreground font-bold mb-3">{title}</h3>
          <p className="text-[22px] text-muted-foreground leading-relaxed">{text}</p>
        </div>
      ))}
    </div>

    <div className="bg-primary/10 border border-primary/20 rounded-2xl px-8 py-6 text-center">
      <p className="text-[24px] text-foreground leading-relaxed">
        Transaction orchestration reduces counterparty risk — <span className={`${accent} font-bold`}>partnerships and legal templates reduce time to scale</span>.
      </p>
    </div>
  </div>
);

// ─── Slide 13: The Ask & Use of Funds ───
export const SlideAsk = () => {
  const segments = [
    { label: "Damir Buljubasic\nCo-Founder & CIO", pct: 57.69, color: "hsl(24 95% 53%)" },
    { label: "Emina Mukic-Buljubasic\nCo-Founder & CEO", pct: 9.62, color: "hsl(24 80% 45%)" },
    { label: "Nenad Brankovic\nCFO", pct: 9.62, color: "hsl(24 65% 38%)" },
    { label: "First Investor\n€300K for 23.08%", pct: 23.08, color: "hsl(155 100% 42%)" },
  ];

  return (
    <div className="flex flex-col h-full px-40 py-12 justify-center">
      <div className="flex items-center gap-4 mb-6">
        <Target className={accent} size={48} />
        <h2 className={subheading}>Seed raise to scale product, liquidity, and DACH expansion.</h2>
      </div>

      {/* Cap table bar */}
      <div className="flex w-full h-[60px] rounded-2xl overflow-hidden mb-6 shadow-md">
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${s.pct}%`, backgroundColor: s.color }} className="flex items-center justify-center">
            <span className="text-[20px] font-bold text-primary-foreground">{s.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {segments.map((s) => (
          <div key={s.label} className="bg-secondary/60 border border-border rounded-xl p-4 flex items-start gap-3">
            <div className="w-4 h-4 rounded-full shrink-0 mt-1" style={{ backgroundColor: s.color }} />
            <div>
              <p className="text-[16px] text-foreground font-bold whitespace-pre-line leading-tight">{s.label}</p>
              <p className="text-[22px] font-black text-foreground">{s.pct.toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className={cardBg + " text-center !p-5"}>
          <p className="text-[16px] text-muted-foreground mb-1">Investment</p>
          <p className="font-display text-[36px] font-black text-foreground">€300K</p>
          <p className="text-[14px] text-muted-foreground">for 23.08% equity</p>
        </div>
        <div className={cardBg + " text-center !p-5"}>
          <p className="text-[16px] text-muted-foreground mb-1">Post-Money Valuation</p>
          <p className={`font-display text-[36px] font-black ${accent}`}>€1.3M</p>
          <p className="text-[14px] text-muted-foreground">pre-money €1M</p>
        </div>
        <div className={cardBg + " text-center !p-5"}>
          <p className="text-[16px] text-muted-foreground mb-1">Projected Return (Y5)</p>
          <p className="font-display text-[36px] font-black text-foreground">20–80×</p>
          <p className="text-[14px] text-muted-foreground">at €10M–€100M exit</p>
        </div>
      </div>

      {/* Use of funds */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { pct: "40%", label: "Tech & Infra" },
          { pct: "30%", label: "Liquidity / Marketing" },
          { pct: "20%", label: "Hires" },
          { pct: "10%", label: "Partnerships / Legal" },
        ].map(({ pct, label }) => (
          <div key={label} className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-center">
            <p className={`text-[28px] font-black ${accent}`}>{pct}</p>
            <p className="text-[16px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Slide 14: Appendix / Data Room ───
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

export const SlideAppendix = () => (
  <div className="flex flex-col h-full px-40 justify-center">
    <div className="flex items-center gap-4 mb-4">
      <Shield className={accent} size={48} />
      <h2 className={subheading}>Full diligence materials and live demo access.</h2>
    </div>

    <p className="text-[24px] text-muted-foreground leading-relaxed mb-8 max-w-[1200px]">
      A <span className="text-foreground font-semibold">comprehensive, password-protected data room</span> is ready for your due diligence — accessible online at{" "}
      <span className={`${accent} font-bold`}>autozon.lovable.app/docs</span>.
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
        <span className="text-foreground font-semibold">ready for investor review today</span>.
        {" "}Live demo and follow‑up available on request.
      </p>
    </div>
  </div>
);

// ── Export all slides in order ──
export const allSlides = [
  SlideCover,
  SlideExecutiveSummary,
  SlideWhyNow,
  SlideProblem,
  SlideProduct,
  SlideReturnDrivers,
  SlideMoat,
  SlideGTM,
  SlideTraction,
  SlideFinancials,
  SlideTeam,
  SlideRisk,
  SlideAsk,
  SlideAppendix,
];
