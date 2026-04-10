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
    <section className="relative flex items-center pt-24 pb-16 overflow-hidden bg-background" style={{ minHeight: "60vh" }}>
      {/* Warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(24_85%_48%/0.08),transparent)]" />

      {/* Male seller — anchored to bottom-left, stretching full section height */}
      <motion.div
        className="hidden lg:block absolute bottom-0 left-0 z-[1]"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 0.95, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <img
          src={heroSellerMale}
          alt={language === "de" ? "Zufriedener Verkäufer" : "Happy seller"}
          className="h-[calc(60vh)] w-auto object-contain object-bottom"
          width={640}
          height={1280}
        />
        {/* Seller bullet points */}
        <div className="absolute top-[4%] left-[40%] w-[280px] z-20 space-y-2.5">
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
      </motion.div>

      {/* Female buyer — anchored to bottom-right, stretching full section height */}
      <motion.div
        className="hidden lg:block absolute bottom-0 right-0 z-[1]"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 0.95, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <img
          src={heroBuyerFemale}
          alt={language === "de" ? "Glückliche Käuferin" : "Happy buyer"}
          className="h-[calc(60vh)] w-auto object-contain object-bottom"
          width={640}
          height={1280}
        />
        {/* Buyer bullet points */}
        <div className="absolute top-[4%] right-[40%] w-[280px] z-20 space-y-2.5">
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
      </motion.div>

      {/* Center text — original layout preserved */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 w-full text-center">
        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-[56px] font-display font-black text-foreground leading-[1.08] tracking-tight mb-2"
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
        >
          {t.hero.headline}
        </motion.h1>
        <motion.span
          className="block text-3xl sm:text-4xl lg:text-[48px] font-display font-black text-orange leading-[1.1] mb-6"
          initial="hidden" animate="visible" variants={fadeUp} custom={0.5}
        >
          {t.hero.headlineAccent}
        </motion.span>

        {/* Subheadline */}
        <motion.p
          className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-[560px] mx-auto leading-relaxed mb-10"
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
        >
          {t.hero.subheadline}
        </motion.p>

        {/* Trust Badges */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
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
    </section>
  );
};

export default HeroSection;
