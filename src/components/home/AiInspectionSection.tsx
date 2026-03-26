import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Search, ShieldCheck, Sparkles, Crosshair } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const pulseRing = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: 0.6 + i * 0.18, duration: 0.5, ease: "easeOut" as const },
  }),
};

interface DamagePin {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
  detail: string;
  top: string;
  left: string;
  anchorSide: "left" | "right";
}

const damagePins: DamagePin[] = [
  { id: "scratch", label: "Scratch Detected", severity: "low", detail: "Minor surface scratch — €80 repair estimate", top: "28%", left: "18%", anchorSide: "left" },
  { id: "dent", label: "Dent Detected", severity: "medium", detail: "Door panel dent — €320 repair estimate", top: "52%", left: "35%", anchorSide: "left" },
  { id: "crack", label: "Windshield Crack", severity: "high", detail: "12cm crack — €450 replacement estimate", top: "22%", left: "55%", anchorSide: "right" },
  { id: "paint", label: "Paint Chip", severity: "low", detail: "Small paint chip on bumper — €60 touch-up", top: "62%", left: "72%", anchorSide: "right" },
  { id: "tire", label: "Tire Wear", severity: "medium", detail: "Uneven tread wear — replacement advised", top: "75%", left: "25%", anchorSide: "left" },
];

const severityColor: Record<string, string> = {
  low: "border-green bg-green/10 text-green",
  medium: "border-orange bg-orange/10 text-orange",
  high: "border-destructive bg-destructive/10 text-destructive",
};

const severityDot: Record<string, string> = {
  low: "bg-green",
  medium: "bg-orange",
  high: "bg-destructive",
};

const AiInspectionSection: React.FC = () => {
  const { language } = useLanguage();

  const [activePin, setActivePin] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePin(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const subtitle = language === "de"
    ? "Unsere KI scannt jedes Foto auf Kratzer, Dellen, Risse und Verschleiß — und berechnet den Reparaturkostenfaktor direkt in den fairen Preis ein."
    : "Our AI scans every photo for scratches, dents, cracks, and wear — then factors repair costs directly into the fair price.";

  const badge = language === "de" ? "KI-Schadenserkennung" : "AI Damage Detection";

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,hsl(var(--orange)/0.05),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-orange/80 mb-4">
            <Crosshair className="h-3.5 w-3.5" />
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-foreground leading-tight">
            {language === "de" ? "KI-Inspektion für" : "AI Inspection for"}
            <br />
            <span className="text-orange">
              {language === "de" ? "Faire Bewertung" : "Fair Valuation"}
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Car with annotations */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
        >
          <div ref={containerRef} className="relative rounded-2xl overflow-hidden border border-border bg-foreground/5 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
              alt="BMW vehicle undergoing AI inspection"
              className="w-full h-auto object-cover"
              loading="lazy"
            />

            {/* Scan overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />

            {/* Scan line animation */}
            <motion.div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/60 to-transparent"
              initial={{ top: "0%" }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />

            {/* Damage pins */}
            {damagePins.map((pin, i) => {
              const isActive = activePin === pin.id;
              return (
                <motion.div
                  key={pin.id}
                  className="absolute group"
                  style={{ top: pin.top, left: pin.left }}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={pulseRing} custom={i}
                >
                  <span className={`absolute inset-0 w-6 h-6 -ml-3 -mt-3 rounded-full ${severityDot[pin.severity]} opacity-30 animate-ping`} />
                  <button
                    type="button"
                    className={`relative block w-5 h-5 -ml-2.5 -mt-2.5 rounded-full ${severityDot[pin.severity]} border-2 border-white/50 shadow-lg cursor-pointer focus:outline-none`}
                    onClick={(e) => { e.stopPropagation(); setActivePin(isActive ? null : pin.id); }}
                    aria-label={pin.label}
                  />

                  <div
                    className={`absolute z-20 w-56 transition-opacity duration-200 ${
                      isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                    } ${pin.anchorSide === "left" ? "left-5 top-1/2 -translate-y-1/2" : "right-5 top-1/2 -translate-y-1/2"}`}
                  >
                    <div className={`rounded-xl border p-3 backdrop-blur-md bg-card/95 shadow-lg ${severityColor[pin.severity].split(" ")[0]}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`h-3.5 w-3.5 ${
                          pin.severity === "high" ? "text-destructive" : pin.severity === "medium" ? "text-orange" : "text-green"
                        }`} />
                        <span className="text-xs font-bold text-foreground">{pin.label}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">{pin.detail}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Bottom overlay stats bar */}
            <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange/15 flex items-center justify-center">
                  <Search className="h-4 w-4 text-orange" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">5 {language === "de" ? "Befunde erkannt" : "Issues Detected"}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {language === "de" ? "Geschätzte Reparaturkosten" : "Est. repair cost"}: <span className="text-primary font-semibold">€910</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green/10 border border-green/20 rounded-full px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-green" />
                <span className="text-[11px] font-bold text-green">
                  {language === "de" ? "KI-Verifiziert" : "AI Verified"}
                </span>
              </div>
            </div>
          </div>

          {/* Fair Value Comparison Card */}
          <motion.div
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
          >
            {/* Without Autozon */}
            <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-destructive/40" />
              <p className="text-xs font-semibold uppercase tracking-widest text-destructive/70 mb-4">
                {language === "de" ? "Ohne Autozon" : "Without Autozon"}
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{language === "de" ? "Händler-Angebot" : "Dealer Offer"}</span>
                  <span className="text-lg font-display font-bold text-muted-foreground">€28,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 bg-destructive/30 rounded-full flex-1" />
                </div>
                <div className="bg-destructive/5 border border-destructive/10 rounded-xl p-4 mt-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === "de"
                      ? "Händler nutzen fehlende Transparenz — Schäden werden pauschal abgezogen, oft €2.000+ über den tatsächlichen Reparaturkosten."
                      : "Dealers exploit lack of transparency — damages are deducted as flat penalties, often €2,000+ above actual repair costs."}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                    <span className="text-xs font-semibold text-destructive">
                      {language === "de" ? "–€5.500 pauschaler Abzug" : "–€5,500 flat deduction"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* With Autozon */}
            <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 relative overflow-hidden shadow-md">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {language === "de" ? "Mit Autozon KI" : "With Autozon AI"}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{language === "de" ? "Fairer Marktwert" : "Fair Market Value"}</span>
                  <span className="text-lg font-display font-bold text-primary">€33,500</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 bg-primary rounded-full flex-1" />
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mt-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === "de"
                      ? "KI erkennt 5 Schäden und berechnet exakte Reparaturkosten von €910 — nur das wird abgezogen, nicht mehr."
                      : "AI detects 5 damages and calculates exact repair costs of €910 — only that is deducted, nothing more."}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">
                      {language === "de" ? "–€910 exakte Reparaturkosten" : "–€910 exact repair costs"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Savings callout */}
              <div className="mt-4 pt-4 border-t border-primary/10 text-center">
                <p className="font-display text-2xl sm:text-3xl font-black text-primary">+€5,500</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "de" ? "mehr in der Tasche des Verkäufers" : "more in the seller's pocket"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature pills below */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
          >
            {[
              { icon: Search, title: language === "de" ? "Foto-Analyse" : "Photo Analysis", desc: language === "de" ? "KI scannt jedes hochgeladene Bild" : "AI scans every uploaded image" },
              { icon: AlertTriangle, title: language === "de" ? "Schadensbericht" : "Damage Report", desc: language === "de" ? "Kratzer, Dellen und Risse erkannt" : "Scratches, dents & cracks detected" },
              { icon: Sparkles, title: language === "de" ? "Fairer Preis" : "Fair Price Impact", desc: language === "de" ? "Reparaturkosten fließen in den Preis ein" : "Repair costs factored into valuation" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 shadow-sm hover:border-orange/20 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-orange" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AiInspectionSection;
