import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
};

/* ───── Color Swatch ───── */
const Swatch = ({ name, hsl, hex, token, dark = false }: { name: string; hsl: string; hex: string; token: string; dark?: boolean }) => (
  <div className="flex flex-col gap-2">
    <div
      className={`w-full aspect-[3/2] rounded-2xl border border-white/10 shadow-lg flex items-end p-4 cursor-pointer group transition-transform hover:scale-[1.02]`}
      style={{ backgroundColor: hex }}
      onClick={() => copyToClipboard(hex)}
    >
      <span className={`text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity ${dark ? "text-white" : "text-charcoal"}`}>
        Click to copy
      </span>
    </div>
    <div>
      <p className="font-display font-bold text-white text-sm">{name}</p>
      <p className="text-silver/60 text-xs font-mono">{hex}</p>
      <p className="text-silver/40 text-xs font-mono">HSL {hsl}</p>
      <p className="text-silver/40 text-xs font-mono">var(--{token})</p>
    </div>
  </div>
);

/* ───── Typography Sample ───── */
const TypeSample = ({ family, weights, sample }: { family: string; weights: { weight: string; className: string }[]; sample: string }) => (
  <div className="space-y-4">
    <h3 className="font-display font-bold text-white text-lg">{family}</h3>
    <div className="space-y-3">
      {weights.map(({ weight, className }) => (
        <div key={weight} className="flex items-baseline gap-4">
          <span className="text-silver/40 text-xs font-mono w-20 shrink-0">{weight}</span>
          <p className={`${className} text-white text-2xl`}>{sample}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ───── Section Wrapper ───── */
const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <section className="py-16 border-t border-white/10">
    <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-2">{title}</h2>
    {subtitle && <p className="text-silver/60 text-base mb-10 max-w-2xl">{subtitle}</p>}
    <div className="mt-8">{children}</div>
  </section>
);

const BrandBook = () => {
  return (
    <div className="min-h-screen bg-charcoal text-silver">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="text-silver/60 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-display font-bold text-white text-lg">autozon</span>
          <span className="text-silver/40 text-sm">Brand Book</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <header className="py-24 md:py-32">
          <p className="text-primary font-display font-bold text-sm tracking-widest uppercase mb-4">Brand Guidelines</p>
          <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-[1.1] mb-6">
            auto<span className="text-primary">zon</span>
          </h1>
          <p className="text-silver/60 text-xl max-w-xl leading-relaxed">
            Fair Value. Best Prices. Zero Friction.
          </p>
          <p className="font-display font-black text-2xl md:text-3xl text-primary tracking-widest mt-4">
            BUY.SELL.CARS.
          </p>
          <p className="text-silver/40 text-sm mt-6 max-w-lg">
            This brand book defines the visual identity, tone, and design language of Autozon — the AI-powered car marketplace built on transparency and trust.
          </p>
        </header>

        {/* ─── Brand Personality ─── */}
        <Section title="Brand Personality" subtitle="Autozon is friendly & modern — we make car selling and buying feel effortless, not intimidating.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { trait: "Transparent", desc: "We show real data. No hidden fees, no dealer tricks. Fair value backed by market intelligence." },
              { trait: "Empowering", desc: "Sellers keep more money. Buyers get fair deals. Everyone wins through AI-powered insights." },
              { trait: "Effortless", desc: "Upload photos, get a fair value, match with buyers — in minutes, not weeks." },
            ].map(({ trait, desc }) => (
              <div key={trait} className="bg-secondary/50 rounded-2xl p-6 border border-white/5">
                <h3 className="font-display font-bold text-primary text-xl mb-2">{trait}</h3>
                <p className="text-silver/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── Logo ─── */}
        <Section title="Logo" subtitle="The autozon wordmark is set in Montserrat Extra Bold. The 'zon' is highlighted in Electric Green to signal the value-driven part of the brand.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dark bg */}
            <div className="bg-charcoal rounded-2xl border border-white/10 p-12 flex flex-col items-center justify-center gap-6">
              <span className="font-display font-black text-5xl text-white">
                auto<span className="text-primary">zon</span>
              </span>
              <span className="text-silver/40 text-xs">Primary — on dark background</span>
            </div>
            {/* Light bg */}
            <div className="bg-white rounded-2xl border border-white/10 p-12 flex flex-col items-center justify-center gap-6">
              <span className="font-display font-black text-5xl text-charcoal">
                auto<span style={{ color: "hsl(155, 100%, 42%)" }}>zon</span>
              </span>
              <span className="text-charcoal/40 text-xs">Primary — on light background</span>
            </div>
          </div>

          <div className="mt-8 bg-secondary/50 rounded-2xl p-6 border border-white/5">
            <h4 className="font-display font-bold text-white text-sm mb-3">Logo Clear Space</h4>
            <p className="text-silver/50 text-sm leading-relaxed">
              Maintain a minimum clear space equal to the height of the letter "a" around all sides of the wordmark. Never stretch, rotate, or apply effects to the logo.
            </p>
          </div>
        </Section>

        {/* ─── Colors ─── */}
        <Section title="Color Palette" subtitle="Our palette is built on three core colors: deep charcoal for authority, electric green for energy and trust, and silver for clarity.">
          <div className="space-y-10">
            <div>
              <p className="text-silver/40 text-xs font-mono uppercase tracking-wider mb-4">Primary Colors</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <Swatch name="Deep Charcoal" hsl="240 6% 11%" hex="#19191F" token="charcoal" dark />
                <Swatch name="Electric Green" hsl="155 100% 42%" hex="#00D97E" token="green" />
                <Swatch name="Silver" hsl="0 0% 85%" hex="#D9D9D9" token="silver" />
              </div>
            </div>
            <div>
              <p className="text-silver/40 text-xs font-mono uppercase tracking-wider mb-4">Semantic Colors</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Swatch name="Background (Dark)" hsl="240 6% 7%" hex="#101014" token="background" dark />
                <Swatch name="Card" hsl="240 6% 11%" hex="#19191F" token="card" dark />
                <Swatch name="Border" hsl="240 4% 20%" hex="#303036" token="border" dark />
                <Swatch name="Destructive" hsl="0 84% 60%" hex="#EF4444" token="destructive" dark />
              </div>
            </div>
            <div>
              <p className="text-silver/40 text-xs font-mono uppercase tracking-wider mb-4">Gradient</p>
              <div className="h-24 rounded-2xl border border-white/10 overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(155, 100%, 42%), hsl(155, 80%, 55%))" }} />
              <p className="text-silver/40 text-xs font-mono mt-2">text-gradient · 135deg from Electric Green to hsl(155 80% 55%)</p>
            </div>
          </div>
        </Section>

        {/* ─── Typography ─── */}
        <Section title="Typography" subtitle="Montserrat for headlines creates impact and authority. Inter for body text ensures readability at every size.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <TypeSample
              family="Montserrat"
              sample="Fair Value"
              weights={[
                { weight: "900 Black", className: "font-display font-black" },
                { weight: "800 ExBold", className: "font-display font-extrabold" },
                { weight: "700 Bold", className: "font-display font-bold" },
                { weight: "600 Semi", className: "font-display font-semibold" },
              ]}
            />
            <TypeSample
              family="Inter"
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
            <p className="text-silver/40 text-xs font-mono uppercase tracking-wider">Type Scale</p>
            {[
              { label: "H1", size: "text-5xl md:text-7xl", className: "font-display font-black text-5xl md:text-7xl text-white" },
              { label: "H2", size: "text-3xl md:text-4xl", className: "font-display font-black text-3xl md:text-4xl text-white" },
              { label: "H3", size: "text-xl md:text-2xl", className: "font-display font-bold text-xl md:text-2xl text-white" },
              { label: "Body", size: "text-base", className: "font-sans text-base text-silver" },
              { label: "Small", size: "text-sm", className: "font-sans text-sm text-silver/60" },
              { label: "Caption", size: "text-xs", className: "font-sans text-xs text-silver/40" },
            ].map(({ label, size, className }) => (
              <div key={label} className="flex items-baseline gap-6">
                <span className="text-silver/30 text-xs font-mono w-16 shrink-0">{label}</span>
                <span className="text-silver/30 text-xs font-mono w-40 shrink-0 hidden md:block">{size}</span>
                <span className={className}>The future of car trading</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── Spacing & Radius ─── */}
        <Section title="Spacing & Radius" subtitle="Consistent spacing and generous border radius create a modern, approachable feel.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-silver/40 text-xs font-mono uppercase tracking-wider mb-4">Border Radius</p>
              <div className="flex items-end gap-4">
                {[
                  { label: "sm", radius: "calc(0.75rem - 4px)", size: "h-16 w-16" },
                  { label: "md", radius: "calc(0.75rem - 2px)", size: "h-20 w-20" },
                  { label: "lg", radius: "0.75rem", size: "h-24 w-24" },
                  { label: "2xl", radius: "1rem", size: "h-28 w-28" },
                ].map(({ label, radius, size }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className={`${size} bg-primary/20 border-2 border-primary/50`} style={{ borderRadius: radius }} />
                    <span className="text-silver/40 text-xs font-mono">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-silver/40 text-xs font-mono uppercase tracking-wider mb-4">Component Examples</p>
              <div className="space-y-3">
                <button className="bg-primary text-primary-foreground font-display font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                  Primary Button
                </button>
                <button className="block bg-secondary text-secondary-foreground font-display font-bold px-6 py-3 rounded-lg border border-white/10 hover:bg-secondary/80 transition-colors">
                  Secondary Button
                </button>
                <div className="bg-card rounded-2xl border border-border p-6">
                  <p className="font-display font-bold text-white text-sm">Card Component</p>
                  <p className="text-silver/50 text-xs mt-1">With border and card background</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── Tagline & Voice ─── */}
        <Section title="Voice & Tone" subtitle="We speak like a knowledgeable friend — clear, honest, and encouraging. Never salesy or condescending.">
          <div className="space-y-8">
            <div className="bg-secondary/50 rounded-2xl p-8 border border-white/5">
              <p className="text-primary font-display font-bold text-sm uppercase tracking-wider mb-3">Tagline</p>
              <p className="font-display font-black text-3xl md:text-4xl text-white">
                Fair Value. Best Prices. Zero Friction.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-display font-bold text-primary text-sm">✓ Do</h4>
                <ul className="space-y-2 text-silver/60 text-sm">
                  <li>"Your BMW X3 is worth <span className="text-white font-medium">€33,500</span> based on market data."</li>
                  <li>"We found <span className="text-white font-medium">3 interested buyers</span> in your area."</li>
                  <li>"Here's your fair value — backed by real market intelligence."</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-display font-bold text-destructive text-sm">✗ Don't</h4>
                <ul className="space-y-2 text-silver/60 text-sm">
                  <li className="line-through opacity-60">"BEST DEAL EVER!! Don't miss out!!!"</li>
                  <li className="line-through opacity-60">"Our proprietary AI algorithm leverages synergistic..."</li>
                  <li className="line-through opacity-60">"Trust us, this is the right price."</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── Iconography ─── */}
        <Section title="Iconography" subtitle="We use Lucide icons throughout the product. Consistent 20–24px sizing with 1.5px stroke weight.">
          <div className="flex flex-wrap gap-4">
            {["Car", "Shield", "TrendingUp", "Users", "Zap", "BarChart3", "MessageSquare", "CheckCircle"].map((name) => (
              <div key={name} className="bg-secondary/50 rounded-xl border border-white/5 p-4 flex flex-col items-center gap-2 w-24">
                <div className="h-6 w-6 text-primary flex items-center justify-center">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <span className="text-silver/40 text-[10px] font-mono">{name}</span>
              </div>
            ))}
          </div>
          <p className="text-silver/40 text-xs mt-4">Library: <span className="text-silver/60">lucide-react</span> · Stroke: <span className="text-silver/60">1.5px</span> · Size: <span className="text-silver/60">20–24px</span></p>
        </Section>

        {/* Footer */}
        <footer className="py-16 border-t border-white/10 text-center">
          <p className="font-display font-black text-2xl text-white mb-2">
            auto<span className="text-primary">zon</span>
          </p>
          <p className="text-silver/40 text-sm">Brand Book v1.0 · 2026</p>
        </footer>
      </div>
    </div>
  );
};

export default BrandBook;
