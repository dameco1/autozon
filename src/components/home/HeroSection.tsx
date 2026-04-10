import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Zap, CreditCard, Download, ArrowRight, Upload, Brain, MessageSquare, Users, FileCheck, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroSellerMale from "@/assets/hero-seller-male.png";
import heroBuyerFemale from "@/assets/hero-buyer-female.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const badgeIcons: Record<string, React.ReactNode> = {
  check: <CheckCircle2 className="h-4 w-4 text-green shrink-0" />,
  lock: <Lock className="h-4 w-4 text-orange shrink-0" />,
  zap: <Zap className="h-4 w-4 text-orange shrink-0" />,
  card: <CreditCard className="h-4 w-4 text-orange shrink-0" />,
};

const sellerBullets = {
  en: [
    { icon: Upload, title: "Create an Ad in just 3 clicks", desc: "Upload car images and a picture of car registration — Autozon does the rest for you." },
    { icon: Brain, title: "AI-powered fair value estimation", desc: "Instant, data-driven valuation based on market trends and historical transactions." },
    { icon: MessageSquare, title: "Structured negotiation flow", desc: "No more chaotic messages. Clean offer → counteroffer → acceptance, fully transparent." },
  ],
  de: [
    { icon: Upload, title: "Inserat in nur 3 Klicks erstellen", desc: "Lade Fotos und den Zulassungsschein hoch — Autozon erledigt den Rest." },
    { icon: Brain, title: "KI-gestützte Wertermittlung", desc: "Sofortige, datengetriebene Bewertung basierend auf Markttrends und Transaktionen." },
    { icon: MessageSquare, title: "Strukturierter Verhandlungsablauf", desc: "Keine chaotischen Nachrichten. Angebot → Gegenangebot → Einigung, voll transparent." },
  ],
};

const buyerBullets = {
  en: [
    { icon: Users, title: "Lifestyle-based buyer matching", desc: "Matched by use case — family, commuting, business, sport — not just model." },
    { icon: FileCheck, title: "Legally structured handover", desc: "Enforced steps, deadlines, and documentation for a safe vehicle handover." },
    { icon: ShieldCheck, title: "Built to build trust", desc: "Unlike traditional classifieds, Autozon gives buyers confidence and clarity." },
  ],
  de: [
    { icon: Users, title: "Lifestyle-basiertes Matching", desc: "Passend zum Einsatzzweck — Familie, Pendeln, Business, Sport — nicht nur Modell." },
    { icon: FileCheck, title: "Rechtlich strukturierte Übergabe", desc: "Verbindliche Schritte, Fristen und Dokumentation für eine sichere Übergabe." },
    { icon: ShieldCheck, title: "Vertrauen als Grundprinzip", desc: "Anders als klassische Inserate — Autozon gibt Käufern Sicherheit und Klarheit." },
  ],
};

const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { canInstall, promptInstall } = usePwaInstall();
  const navigate = useNavigate();

  const sBullets = sellerBullets[language];
  const bBullets = buyerBullets[language];

  return (
    <section className="relative flex items-center pt-24 pb-16 overflow-hidden bg-background" style={{ minHeight: "85vh" }}>
      {/* Warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(24_85%_48%/0.08),transparent)]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-stretch gap-0 lg:gap-4">

          {/* LEFT — Seller (male) */}
          <motion.div
            className="hidden lg:flex flex-col items-center relative"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative h-full flex flex-col items-center justify-end">
              {/* Bullet points overlaid on left side */}
              <div className="absolute top-[8%] left-0 right-[10%] z-20 space-y-3 pr-2">
                {sBullets.map((b, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-3 py-2 shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                  >
                    <b.icon className="h-4 w-4 text-orange shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground text-xs font-bold leading-tight">{b.title}</p>
                      <p className="text-muted-foreground text-[10px] leading-snug mt-0.5">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <img
                src={heroSellerMale}
                alt={language === "de" ? "Zufriedener Verkäufer" : "Happy seller"}
                className="h-[520px] w-auto object-contain drop-shadow-lg"
                width={640}
                height={1280}
              />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-orange mt-2">
                {language === "de" ? "Verkäufer" : "Seller"}
              </span>
            </div>
          </motion.div>

          {/* CENTER — Text content */}
          <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto lg:mx-0 py-8">
            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-[52px] font-display font-black text-foreground leading-[1.08] tracking-tight mb-2"
              initial="hidden" animate="visible" variants={fadeUp} custom={0}
            >
              {t.hero.headline}
            </motion.h1>
            <motion.span
              className="block text-3xl sm:text-4xl lg:text-[44px] font-display font-black text-orange leading-[1.1] mb-6"
              initial="hidden" animate="visible" variants={fadeUp} custom={0.5}
            >
              {t.hero.headlineAccent}
            </motion.span>

            {/* Subheadline */}
            <motion.p
              className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-[520px] mx-auto leading-relaxed mb-10"
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
            >
              {t.hero.subheadline}
            </motion.p>

            {/* Trust Badges */}
            <motion.div
              className="grid grid-cols-2 gap-3 max-w-md mx-auto"
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
            >
              {t.hero.trustBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5 shadow-sm hover:border-orange/30 transition-colors"
                >
                  {badgeIcons[badge.icon]}
                  <span className="text-foreground text-xs font-semibold leading-tight">
                    {badge.text}<sup className="text-orange ml-0.5">{badge.note}</sup>
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
            >
              {canInstall && (
                <Button onClick={promptInstall} size="lg" className="gap-2 text-base px-6">
                  <Download className="h-5 w-5" />
                  {t.hero.installApp}
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-base px-6"
                onClick={() => navigate("/onboarding")}
              >
                {t.hero.getStarted}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Mobile-only bullet cards */}
            <div className="lg:hidden mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {[...sBullets, ...bBullets].map((b, i) => (
                <div key={i} className="flex items-start gap-2 bg-card border border-border rounded-xl px-3 py-2.5 shadow-sm">
                  <b.icon className="h-4 w-4 text-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground text-xs font-bold leading-tight">{b.title}</p>
                    <p className="text-muted-foreground text-[10px] leading-snug mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Buyer (female) */}
          <motion.div
            className="hidden lg:flex flex-col items-center relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative h-full flex flex-col items-center justify-end">
              {/* Bullet points overlaid on right side */}
              <div className="absolute top-[8%] left-[10%] right-0 z-20 space-y-3 pl-2">
                {bBullets.map((b, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-3 py-2 shadow-sm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                  >
                    <b.icon className="h-4 w-4 text-orange shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground text-xs font-bold leading-tight">{b.title}</p>
                      <p className="text-muted-foreground text-[10px] leading-snug mt-0.5">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <img
                src={heroBuyerFemale}
                alt={language === "de" ? "Glückliche Käuferin" : "Happy buyer"}
                className="h-[520px] w-auto object-contain drop-shadow-lg"
                width={640}
                height={1280}
              />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-orange mt-2">
                {language === "de" ? "Käuferin" : "Buyer"}
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
