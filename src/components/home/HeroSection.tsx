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

const sellerPoints = {
  en: [
    { icon: Upload, title: "Ad in 3 clicks", desc: "Upload photos + registration — we handle the rest." },
    { icon: Brain, title: "AI fair value", desc: "Data-driven pricing from market trends." },
    { icon: MessageSquare, title: "Smart negotiation", desc: "Structured offer → counteroffer → done." },
  ],
  de: [
    { icon: Upload, title: "Inserat in 3 Klicks", desc: "Fotos + Zulassung hochladen — wir erledigen den Rest." },
    { icon: Brain, title: "KI-Wertermittlung", desc: "Datengetriebene Preise aus Markttrends." },
    { icon: MessageSquare, title: "Smarte Verhandlung", desc: "Angebot → Gegenangebot → erledigt." },
  ],
};

const buyerPoints = {
  en: [
    { icon: Users, title: "Lifestyle matching", desc: "Matched by use case, not just model." },
    { icon: FileCheck, title: "Safe handover", desc: "Enforced steps, deadlines & documentation." },
    { icon: ShieldCheck, title: "Built for trust", desc: "Confidence and clarity, unlike classifieds." },
  ],
  de: [
    { icon: Users, title: "Lifestyle-Matching", desc: "Passend zum Einsatzzweck, nicht nur Modell." },
    { icon: FileCheck, title: "Sichere Übergabe", desc: "Verbindliche Schritte, Fristen & Dokumente." },
    { icon: ShieldCheck, title: "Vertrauen first", desc: "Sicherheit und Klarheit, anders als Kleinanzeigen." },
  ],
};

const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { canInstall, promptInstall } = usePwaInstall();
  const navigate = useNavigate();

  const sPoints = sellerPoints[language];
  const bPoints = buyerPoints[language];

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(24_85%_48%/0.08),transparent)]" />

      {/* Mobile background — female silhouette */}
      <div className="xl:hidden absolute inset-0 z-[0] flex justify-center items-end overflow-hidden pointer-events-none">
        <img src={heroBuyerFemale} alt="" className="h-[70%] w-auto object-contain object-bottom opacity-[0.06]" width={640} height={1280} />
      </div>

      {/* ── Top hero area with people flanking the headline ── */}
      <div className="relative z-10 pt-24 pb-10" style={{ minHeight: "55vh" }}>
        {/* Male — left decorative */}
        <motion.img
          src={heroSellerMale}
          alt=""
          className="hidden xl:block absolute -bottom-4 left-[22%] h-[58vh] w-auto object-contain object-bottom z-[1] pointer-events-none"
          width={640} height={1280}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 0.85, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        {/* Female — right decorative */}
        <motion.img
          src={heroBuyerFemale}
          alt=""
          className="hidden xl:block absolute -bottom-4 right-[22%] h-[55vh] w-auto object-contain object-bottom z-[1] pointer-events-none"
          width={640} height={1280}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 0.85, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        {/* Center content */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-[68px] font-display font-black text-foreground leading-[1.05] tracking-tight mb-3"
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
          >
            {t.hero.headline}
          </motion.h1>
          <motion.span
            className="block text-4xl sm:text-5xl lg:text-[60px] font-display font-black text-orange leading-[1.08] mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={0.5}
          >
            {t.hero.headlineAccent}
          </motion.span>

          <motion.p
            className="text-muted-foreground text-lg sm:text-xl lg:text-2xl max-w-[560px] mx-auto leading-relaxed mb-8 whitespace-pre-line"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            {t.hero.subheadline}
          </motion.p>

          {/* Trust badges — 2x2 on mobile, 4 cols on sm+ */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            {t.hero.trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5 shadow-sm hover:border-orange/30 transition-colors">
                {badgeIcons[badge.icon]}
                <span className="text-foreground text-xs font-semibold leading-tight">
                  {badge.text}<sup className="text-orange ml-0.5">{badge.note}</sup>
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            {canInstall && (
              <Button onClick={promptInstall} size="lg" className="gap-2 text-base px-6">
                <Download className="h-5 w-5" />
                {t.hero.installApp}
              </Button>
            )}
            <Button variant="outline" size="lg" className="gap-2 text-base px-6" onClick={() => navigate("/onboarding")}>
              {t.hero.getStarted}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ── Value propositions — clean 2-column grid below ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        >
          {/* Seller column */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <h3 className="text-sm font-bold tracking-widest uppercase text-orange mb-5">
              {language === "de" ? "Für Verkäufer" : "For Sellers"}
            </h3>
            <div className="space-y-5">
              {sPoints.map((p, i) => (
                <motion.div key={i} className="flex items-start gap-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                  <div className="w-9 h-9 rounded-lg bg-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                    <p.icon className="h-5 w-5 text-orange" />
                  </div>
                  <div>
                    <p className="text-foreground text-base font-bold leading-snug">{p.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-0.5">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Buyer column */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <h3 className="text-sm font-bold tracking-widest uppercase text-orange mb-5">
              {language === "de" ? "Für Käufer" : "For Buyers"}
            </h3>
            <div className="space-y-5">
              {bPoints.map((p, i) => (
                <motion.div key={i} className="flex items-start gap-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                  <div className="w-9 h-9 rounded-lg bg-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                    <p.icon className="h-5 w-5 text-orange" />
                  </div>
                  <div>
                    <p className="text-foreground text-base font-bold leading-snug">{p.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-0.5">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
