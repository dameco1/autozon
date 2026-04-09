import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Car, Shield, TrendingUp, Users, Zap, BarChart3, MessageSquare, CheckCircle, Download, Bot, Sparkles } from "lucide-react";
import { toast } from "sonner";
import zoniAvatar from "@/assets/zoni-avatar.png";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
};

/* ───── Color Swatch ───── */
const Swatch = ({ name, hsl, hex, token, light = true }: { name: string; hsl: string; hex: string; token: string; light?: boolean }) => (
  <div className="flex flex-col gap-2">
    <div
      className="w-full aspect-[3/2] rounded-2xl border border-border shadow-sm flex items-end p-4 cursor-pointer group transition-transform hover:scale-[1.02]"
      style={{ backgroundColor: hex }}
      onClick={() => copyToClipboard(hex)}
    >
      <span className={`text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity ${light ? "text-foreground" : "text-white"}`}>
        Click to copy
      </span>
    </div>
    <div>
      <p className="font-display font-bold text-foreground text-sm">{name}</p>
      <p className="text-muted-foreground text-xs font-mono">{hex}</p>
      <p className="text-muted-foreground text-xs font-mono">HSL {hsl}</p>
      <p className="text-muted-foreground text-xs font-mono">var(--{token})</p>
    </div>
  </div>
);

/* ───── Typography Sample ───── */
const TypeSample = ({ family, weights, sample }: { family: string; weights: { weight: string; className: string }[]; sample: string }) => (
  <div className="space-y-4">
    <h3 className="font-display font-bold text-foreground text-lg">{family}</h3>
    <div className="space-y-3">
      {weights.map(({ weight, className }) => (
        <div key={weight} className="flex items-baseline gap-4">
          <span className="text-muted-foreground text-xs font-mono w-20 shrink-0">{weight}</span>
          <p className={`${className} text-foreground text-2xl`}>{sample}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ───── Section Wrapper ───── */
const Section = ({ title, subtitle, children, id }: { title: string; subtitle?: string; children: React.ReactNode; id?: string }) => (
  <section id={id} className="py-16 border-t border-border">
    <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-2">{title}</h2>
    {subtitle && <p className="text-muted-foreground text-base mb-10 max-w-2xl">{subtitle}</p>}
    <div className="mt-8">{children}</div>
  </section>
);

/* ───── Icon component mapping ───── */
const iconMap: Record<string, React.ReactNode> = {
  Car: <Car className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
  TrendingUp: <TrendingUp className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  BarChart3: <BarChart3 className="h-6 w-6" />,
  MessageSquare: <MessageSquare className="h-6 w-6" />,
  CheckCircle: <CheckCircle className="h-6 w-6" />,
  Bot: <Bot className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
};

const BrandBook = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-display font-bold text-foreground text-lg">
            auto<span className="text-orange">zon</span>
          </span>
          <span className="text-muted-foreground text-sm">Brand Book</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <header className="py-24 md:py-32">
          <p className="text-orange font-display font-bold text-sm tracking-widest uppercase mb-4">Brand Guidelines</p>
          <h1 className="font-display font-black text-5xl md:text-7xl text-foreground leading-[1.1] mb-6">
            auto<span className="text-orange">zon</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-xl leading-relaxed">
            Fair Value. Best Prices. Zero Friction.
          </p>
          <p className="font-display font-black text-2xl md:text-3xl text-orange tracking-widest mt-4">
            BUY.SELL.CARS.
          </p>
          <p className="text-muted-foreground text-sm mt-6 max-w-lg">
            This brand book defines the visual identity, tone, and design language of Autozon — the AI-powered car marketplace built on transparency and trust. Share this with your marketing agency, designers, or content team.
          </p>

          {/* Table of contents */}
          <div className="mt-10 bg-card border border-border rounded-2xl p-6 max-w-md">
            <p className="font-display font-bold text-foreground text-sm mb-3">Contents</p>
            <nav className="space-y-1.5">
              {[
                { label: "Brand Personality", id: "personality" },
                { label: "Logo & Wordmark", id: "logo" },
                { label: "Banner Assets", id: "banner" },
                { label: "Color Palette", id: "colors" },
                { label: "Typography", id: "typography" },
                { label: "Spacing & Radius", id: "spacing" },
                { label: "Zoni — AI Mascot", id: "zoni" },
                { label: "Voice & Tone", id: "voice" },
                { label: "Pricing & Messaging", id: "pricing" },
                { label: "Iconography", id: "icons" },
              ].map(({ label, id }) => (
                <a key={id} href={`#${id}`} className="block text-muted-foreground hover:text-orange text-sm transition-colors">
                  → {label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* ─── Brand Personality ─── */}
        <Section id="personality" title="Brand Personality" subtitle="Autozon is warm, modern, and trustworthy — we make car selling and buying feel effortless, not intimidating.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { trait: "Transparent", desc: "We show real data. No hidden fees, no dealer tricks. Fair value backed by market intelligence." },
              { trait: "Empowering", desc: "Sellers keep more money. Buyers get fair deals. Everyone wins through AI-powered insights." },
              { trait: "Effortless", desc: "Upload photos, get a fair value, match with buyers — in minutes, not weeks." },
            ].map(({ trait, desc }) => (
              <div key={trait} className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-display font-bold text-orange text-xl mb-2">{trait}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── Logo ─── */}
        <Section id="logo" title="Logo & Wordmark" subtitle="The autozon wordmark is set in Montserrat Extra Bold (lowercase). The 'zon' is highlighted in Deep Amber to signal the value-driven part of the brand.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light bg */}
            <div className="bg-card rounded-2xl border border-border p-12 flex flex-col items-center justify-center gap-6">
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-5xl text-foreground">
                  auto<span className="text-orange">zon</span>
                </span>
                <span className="text-[9px] font-display font-bold text-muted-foreground tracking-[0.3em] uppercase leading-none mt-1">BUY.SELL.CARS.</span>
              </div>
              <span className="text-muted-foreground text-xs">Primary — on light background</span>
            </div>
            {/* Dark bg */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-border p-12 flex flex-col items-center justify-center gap-6">
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-5xl text-white">
                  auto<span className="text-orange">zon</span>
                </span>
                <span className="text-[9px] font-display font-bold text-white/40 tracking-[0.3em] uppercase leading-none mt-1">BUY.SELL.CARS.</span>
              </div>
              <span className="text-white/40 text-xs">Primary — on dark background</span>
            </div>
          </div>

          {/* Download buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="400" height="100">
  <style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900');</style>
  <text x="200" y="60" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="900" font-size="64" fill="#1E293B">auto<tspan fill="#D97706">zon</tspan></text>
  <text x="200" y="82" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="700" font-size="11" letter-spacing="4" fill="#64748B">BUY.SELL.CARS.</text>
</svg>`;
                const blob = new Blob([svg], { type: "image/svg+xml" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "autozon-logo-light.svg"; a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-card text-foreground text-sm font-medium px-4 py-2 rounded-lg border border-border hover:border-orange/30 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> SVG (dark on transparent)
            </button>
            <button
              onClick={() => {
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="400" height="100">
  <style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900');</style>
  <text x="200" y="60" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="900" font-size="64" fill="#ffffff">auto<tspan fill="#D97706">zon</tspan></text>
  <text x="200" y="82" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="700" font-size="11" letter-spacing="4" fill="#ffffff66">BUY.SELL.CARS.</text>
</svg>`;
                const blob = new Blob([svg], { type: "image/svg+xml" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "autozon-logo-dark.svg"; a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-card text-foreground text-sm font-medium px-4 py-2 rounded-lg border border-border hover:border-orange/30 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> SVG (white on transparent)
            </button>
          </div>

          <div className="mt-8 bg-card rounded-2xl p-6 border border-border">
            <h4 className="font-display font-bold text-foreground text-sm mb-3">Logo Usage Rules</h4>
            <ul className="text-muted-foreground text-sm leading-relaxed space-y-2">
              <li>• Maintain a minimum clear space equal to the height of the letter "a" around all sides.</li>
              <li>• Never stretch, rotate, or apply drop-shadows/gradients to the wordmark.</li>
              <li>• Always use lowercase — "autozon" not "Autozon" or "AUTOZON" in the wordmark.</li>
              <li>• In running text, capitalize as "Autozon" (sentence case).</li>
              <li>• The accent color on "zon" must always be Deep Amber (#D97706).</li>
            </ul>
          </div>
        </Section>

        {/* ─── Banner ─── */}
        <Section id="banner" title="Banner Assets" subtitle="Ready-to-use banners for social headers, event backdrops, and email headers.">
          <div className="space-y-6">
            {/* Light banner */}
            <div className="rounded-2xl border border-border overflow-hidden shadow-sm" style={{ aspectRatio: "1080/450" }}>
              <div className="w-full h-full bg-background flex flex-col items-center justify-center gap-2">
                <span className="font-display font-black text-5xl md:text-7xl text-foreground">
                  auto<span className="text-orange">zon</span>
                </span>
                <span className="text-[10px] md:text-xs font-display font-bold text-muted-foreground tracking-[0.3em] uppercase leading-none">BUY.SELL.CARS.</span>
              </div>
            </div>
            {/* Dark banner */}
            <div className="rounded-2xl border border-border overflow-hidden shadow-sm" style={{ aspectRatio: "1080/450" }}>
              <div className="w-full h-full bg-[#1a1a2e] flex flex-col items-center justify-center gap-2">
                <span className="font-display font-black text-5xl md:text-7xl text-white">
                  auto<span className="text-orange">zon</span>
                </span>
                <span className="text-[10px] md:text-xs font-display font-bold text-white/40 tracking-[0.3em] uppercase leading-none">BUY.SELL.CARS.</span>
              </div>
            </div>
            <button
              onClick={() => {
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="450" viewBox="0 0 1080 450">
  <rect width="1080" height="450" fill="#FCFAF9"/>
  <style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900');</style>
  <text x="540" y="235" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="900" font-size="96" fill="#1E293B">auto<tspan fill="#D97706">zon</tspan></text>
  <text x="540" y="275" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="700" font-size="16" letter-spacing="6" fill="#64748B">BUY.SELL.CARS.</text>
</svg>`;
                const blob = new Blob([svg], { type: "image/svg+xml" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "autozon-banner-1080x450.svg"; a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-card text-foreground text-sm font-medium px-4 py-2 rounded-lg border border-border hover:border-orange/30 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Download Banner SVG (1080×450)
            </button>
          </div>
        </Section>

        {/* ─── Colors ─── */}
        <Section id="colors" title="Color Palette" subtitle="A warm, premium palette built on cream backgrounds, deep amber accents, and rich foreground tones. All colors use HSL via CSS custom properties.">
          <div className="space-y-10">
            <div>
              <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-4">Core Brand Colors</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Swatch name="Deep Amber (Primary)" hsl="24 85% 48%" hex="#D97706" token="primary" light={false} />
                <Swatch name="Warm White (Background)" hsl="30 25% 98%" hex="#FCFAF9" token="background" />
                <Swatch name="Dark Foreground" hsl="220 20% 14%" hex="#1E293B" token="foreground" light={false} />
                <Swatch name="Trust Green" hsl="155 72% 40%" hex="#1AAE6F" token="green" light={false} />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-4">UI Surface Colors</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Swatch name="Card" hsl="0 0% 100%" hex="#FFFFFF" token="card" />
                <Swatch name="Secondary" hsl="30 15% 93%" hex="#EDE9E3" token="secondary" />
                <Swatch name="Muted" hsl="30 15% 95%" hex="#F2EFEB" token="muted" />
                <Swatch name="Border" hsl="30 10% 88%" hex="#E2DDD6" token="border" />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-4">Status & Accent</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Swatch name="Orange (Accent)" hsl="24 85% 48%" hex="#D97706" token="orange" light={false} />
                <Swatch name="Green (Success)" hsl="155 72% 40%" hex="#1AAE6F" token="green" light={false} />
                <Swatch name="Destructive (Error)" hsl="0 84% 60%" hex="#EF4444" token="destructive" light={false} />
                <Swatch name="Muted Foreground" hsl="220 10% 46%" hex="#6B7280" token="muted-foreground" light={false} />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-4">Warm Radial Glow (Hero Background)</p>
              <div className="h-24 rounded-2xl border border-border overflow-hidden bg-background relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(24_85%_48%/0.08),transparent)]" />
              </div>
              <p className="text-muted-foreground text-xs font-mono mt-2">radial-gradient(ellipse 80% 60% at 50% -10%, hsl(24 85% 48% / 0.08), transparent)</p>
            </div>
          </div>
        </Section>

        {/* ─── Typography ─── */}
        <Section id="typography" title="Typography" subtitle="Montserrat for headlines creates impact and authority. Inter for body text ensures readability at every size.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <TypeSample
              family="Montserrat (Display)"
              sample="Fair Value"
              weights={[
                { weight: "900 Black", className: "font-display font-black" },
                { weight: "800 ExBold", className: "font-display font-extrabold" },
                { weight: "700 Bold", className: "font-display font-bold" },
                { weight: "600 Semi", className: "font-display font-semibold" },
              ]}
            />
            <TypeSample
              family="Inter (Body)"
              sample="Zero Friction"
              weights={[
                { weight: "700 Bold", className: "font-sans font-bold" },
                { weight: "600 Semi", className: "font-sans font-semibold" },
                { weight: "500 Medium", className: "font-sans font-medium" },
                { weight: "400 Regular", className: "font-sans font-normal" },
                { weight: "300 Light", className: "font-sans font-light" },
              ]}
            />
          </div>

          <div className="mt-12 space-y-4">
            <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider">Type Scale</p>
            {[
              { label: "H1", size: "text-5xl md:text-7xl", className: "font-display font-black text-4xl md:text-5xl text-foreground" },
              { label: "H2", size: "text-3xl md:text-4xl", className: "font-display font-black text-3xl text-foreground" },
              { label: "H3", size: "text-xl md:text-2xl", className: "font-display font-bold text-xl text-foreground" },
              { label: "Body", size: "text-base", className: "font-sans text-base text-muted-foreground" },
              { label: "Small", size: "text-sm", className: "font-sans text-sm text-muted-foreground" },
              { label: "Caption", size: "text-xs", className: "font-sans text-xs text-muted-foreground" },
            ].map(({ label, size, className }) => (
              <div key={label} className="flex items-baseline gap-6">
                <span className="text-muted-foreground text-xs font-mono w-16 shrink-0">{label}</span>
                <span className="text-muted-foreground text-xs font-mono w-40 shrink-0 hidden md:block">{size}</span>
                <span className={className}>The future of car trading</span>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-card rounded-2xl p-6 border border-border">
            <h4 className="font-display font-bold text-foreground text-sm mb-3">Font Loading</h4>
            <p className="text-muted-foreground text-sm font-mono leading-relaxed">
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap');
            </p>
          </div>
        </Section>

        {/* ─── Spacing & Radius ─── */}
        <Section id="spacing" title="Spacing & Radius" subtitle="Consistent spacing and a rounded-lg base radius create a modern, approachable feel. All buttons and form controls use rounded-lg.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-4">Border Radius</p>
              <div className="flex items-end gap-4">
                {[
                  { label: "sm", radius: "calc(0.75rem - 4px)", size: "h-16 w-16" },
                  { label: "md", radius: "calc(0.75rem - 2px)", size: "h-20 w-20" },
                  { label: "lg (default)", radius: "0.75rem", size: "h-24 w-24" },
                  { label: "2xl (cards)", radius: "1rem", size: "h-28 w-28" },
                ].map(({ label, radius, size }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className={`${size} bg-orange/20 border-2 border-orange/50`} style={{ borderRadius: radius }} />
                    <span className="text-muted-foreground text-xs font-mono">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-4">Component Examples</p>
              <div className="space-y-3">
                <button className="bg-orange text-orange-foreground font-display font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                  Primary Button
                </button>
                <button className="block bg-card text-foreground font-display font-bold px-6 py-3 rounded-lg border border-border hover:border-orange/30 transition-colors">
                  Secondary Button
                </button>
                <div className="bg-card rounded-2xl border border-border p-6">
                  <p className="font-display font-bold text-foreground text-sm">Card Component</p>
                  <p className="text-muted-foreground text-xs mt-1">With border and card background</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── Zoni ─── */}
        <Section id="zoni" title="Zoni — AI Concierge Mascot" subtitle="Zoni is our AI assistant persona — a friendly, approachable car mascot that guides users through selling, buying, and everything in between.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center gap-6">
              <img src={zoniAvatar} alt="Zoni mascot avatar" className="w-32 h-32 rounded-full border-4 border-orange/20 shadow-lg" />
              <div className="text-center">
                <p className="font-display font-bold text-foreground text-lg">Zoni Avatar</p>
                <p className="text-muted-foreground text-sm mt-1">Used as the floating chat trigger and in chat headers</p>
              </div>
              {/* Callout bubble demo */}
              <div className="relative flex flex-col items-center">
                <div className="relative bg-orange text-orange-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                  It's me, Zoni — ready to help!
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange rotate-45" />
                </div>
                <div className="mt-3 w-14 h-14 rounded-full bg-orange/10 border-2 border-orange/20 flex items-center justify-center">
                  <img src={zoniAvatar} alt="" className="w-10 h-10 rounded-full" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h4 className="font-display font-bold text-foreground text-sm mb-3">Personality</h4>
                <ul className="text-muted-foreground text-sm space-y-2 leading-relaxed">
                  <li>• <strong className="text-foreground">Friendly & warm</strong> — speaks like a knowledgeable friend, not a robot</li>
                  <li>• <strong className="text-foreground">Bilingual</strong> — fluent in English and German (auto-detects)</li>
                  <li>• <strong className="text-foreground">Data-driven</strong> — backs claims with numbers and market data</li>
                  <li>• <strong className="text-foreground">Proactive</strong> — offers next steps and deep-links to relevant pages</li>
                </ul>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h4 className="font-display font-bold text-foreground text-sm mb-3">Localized Callouts</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-8">EN</span>
                    <span className="bg-orange text-orange-foreground text-xs font-semibold px-3 py-1 rounded-full">It's me, Zoni — ready to help!</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-8">DE</span>
                    <span className="bg-orange text-orange-foreground text-xs font-semibold px-3 py-1 rounded-full">Ich bin Zoni — bereit zu helfen!</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h4 className="font-display font-bold text-foreground text-sm mb-3">UI Behavior</h4>
                <ul className="text-muted-foreground text-sm space-y-2 leading-relaxed">
                  <li>• Floating avatar in bottom-right corner with bounce animation</li>
                  <li>• Speech bubble callout appears on page load (0.5s delay)</li>
                  <li>• Wiggle-on-hover interaction for playfulness</li>
                  <li>• Opens a full chat panel with markdown-rendered responses</li>
                  <li>• Available on all pages (homepage + authenticated dashboard)</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── Voice & Tone ─── */}
        <Section id="voice" title="Voice & Tone" subtitle="We speak like a knowledgeable friend — clear, honest, and encouraging. Never salesy or condescending.">
          <div className="space-y-8">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <p className="text-orange font-display font-bold text-sm uppercase tracking-wider mb-3">Tagline</p>
              <p className="font-display font-black text-3xl md:text-4xl text-foreground">
                Fair Value. Best Prices. Zero Friction.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border">
              <p className="text-orange font-display font-bold text-sm uppercase tracking-wider mb-3">Core Message</p>
              <p className="font-display font-bold text-xl text-foreground italic">
                "Your car is worth more than a dealer will ever tell you."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                <h4 className="font-display font-bold text-green text-sm">✓ Do</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>"Your BMW X3 is worth <span className="text-foreground font-medium">€33,500</span> based on market data."</li>
                  <li>"We found <span className="text-foreground font-medium">3 interested buyers</span> in your area."</li>
                  <li>"Here's your fair value — backed by real market intelligence."</li>
                  <li>"List for <span className="text-foreground font-medium">€9.99</span> — one-time, no hidden fees."</li>
                </ul>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                <h4 className="font-display font-bold text-destructive text-sm">✗ Don't</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li className="line-through opacity-60">"BEST DEAL EVER!! Don't miss out!!!"</li>
                  <li className="line-through opacity-60">"Our proprietary AI algorithm leverages synergistic..."</li>
                  <li className="line-through opacity-60">"Trust us, this is the right price."</li>
                  <li className="line-through opacity-60">"Limited time offer — act now!"</li>
                </ul>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h4 className="font-display font-bold text-foreground text-sm mb-3">Brand Voice Attributes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { attr: "Trustworthy", desc: "Data-backed claims, real savings examples, no hype" },
                  { attr: "Direct", desc: "Short, clear copy — no jargon, no corporate speak" },
                  { attr: "Empowering", desc: "'You deserve fair value' — seller-first language" },
                  { attr: "Modern", desc: "Clean design, AI-forward, tech-savvy but approachable" },
                ].map(({ attr, desc }) => (
                  <div key={attr}>
                    <p className="font-display font-bold text-foreground text-sm">{attr}</p>
                    <p className="text-muted-foreground text-xs">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ─── Pricing & Messaging ─── */}
        <Section id="pricing" title="Pricing & Key Messaging" subtitle="Standardized pricing references and message framework for all marketing materials.">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="font-display font-bold text-foreground text-lg mb-1">Private Sellers</p>
                <p className="font-display font-black text-4xl text-orange">€9.99</p>
                <p className="text-muted-foreground text-sm mt-2">One-time listing fee. Ad stays live until sold. No commission, no hidden costs.</p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="font-display font-bold text-foreground text-lg mb-1">Business / Dealers</p>
                <p className="font-display font-black text-4xl text-orange">€19.99</p>
                <p className="text-muted-foreground text-sm mt-2">Per-listing fee for commercial sellers. Priority matching and enhanced visibility.</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h4 className="font-display font-bold text-foreground text-sm mb-4">Message Framework by Audience</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-display font-bold text-foreground">Audience</th>
                      <th className="text-left py-2 pr-4 font-display font-bold text-foreground">Primary Message</th>
                      <th className="text-left py-2 font-display font-bold text-foreground">Proof Point</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-foreground">Frustrated seller</td>
                      <td className="py-3 pr-4">"Stop losing thousands to dealer lowball offers"</td>
                      <td className="py-3">BMW X3: €28,500 dealer vs. €35,000 on Autozon</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-foreground">First-time seller</td>
                      <td className="py-3 pr-4">"Sell your car at fair value — AI does the hard work"</td>
                      <td className="py-3">5-step wizard, AI damage scan, instant valuation</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-foreground">Cautious buyer</td>
                      <td className="py-3 pr-4">"Every car is AI-inspected and fairly priced"</td>
                      <td className="py-3">Transparent condition scoring, no hidden fees</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-foreground">Value-driven buyer</td>
                      <td className="py-3 pr-4">"No dealer markup — buy directly from verified sellers"</td>
                      <td className="py-3">P2P model, structured negotiation, 2.5% vs 15–30%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── Iconography ─── */}
        <Section id="icons" title="Iconography" subtitle="We use Lucide icons throughout the product. Consistent 20–24px sizing with 1.5px stroke weight. Orange accent color for primary icons.">
          <div className="flex flex-wrap gap-4">
            {["Car", "Shield", "TrendingUp", "Users", "Zap", "BarChart3", "MessageSquare", "CheckCircle", "Bot", "Sparkles"].map((name) => (
              <div key={name} className="bg-card rounded-xl border border-border p-4 flex flex-col items-center gap-2 w-24">
                <div className="h-6 w-6 text-orange flex items-center justify-center">
                  {iconMap[name]}
                </div>
                <span className="text-muted-foreground text-[10px] font-mono">{name}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-xs mt-4">
            Library: <span className="font-medium text-foreground">lucide-react</span> · Stroke: <span className="font-medium text-foreground">1.5px</span> · Size: <span className="font-medium text-foreground">20–24px</span> · Accent: <span className="font-medium text-foreground">Deep Amber (#D97706)</span>
          </p>
        </Section>

        {/* ─── Digital Presence ─── */}
        <Section id="digital" title="Digital Presence" subtitle="Key URLs, social handles, and platform information.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h4 className="font-display font-bold text-foreground text-sm">URLs</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Brand domain</span>
                  <span className="font-mono text-foreground">www.autozon.at</span>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h4 className="font-display font-bold text-foreground text-sm">Platform Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Launch market</span>
                  <span className="font-medium text-foreground">Austria</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Languages</span>
                  <span className="font-medium text-foreground">German, English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PWA</span>
                  <span className="font-medium text-foreground">Yes (installable)</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="py-16 border-t border-border text-center">
          <p className="font-display font-black text-2xl text-foreground mb-2">
            auto<span className="text-orange">zon</span>
          </p>
          <p className="text-muted-foreground text-sm">Brand Book v2.0 · 2026</p>
          <p className="text-muted-foreground text-xs mt-2">For internal use and approved agency partners only.</p>
        </footer>
      </div>
    </div>
  );
};

export default BrandBook;
