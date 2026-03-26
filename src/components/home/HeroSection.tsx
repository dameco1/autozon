import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Zap, CreditCard } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import heroCar1 from "@/assets/hero-car-1.png";
import heroCar2 from "@/assets/hero-car-2.png";

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

const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative flex items-center pt-24 pb-16 overflow-hidden bg-background" style={{ minHeight: "60vh" }}>
      {/* Warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(24_85%_48%/0.08),transparent)]" />

      {/* Transparent car images */}
      <motion.img
        src={heroCar1}
        alt=""
        className="absolute bottom-0 left-[-5%] w-[320px] lg:w-[420px] opacity-[0.07] pointer-events-none select-none"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 0.07, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        width={800}
        height={512}
      />
      <motion.img
        src={heroCar2}
        alt=""
        className="absolute bottom-0 right-[-5%] w-[300px] lg:w-[400px] opacity-[0.07] pointer-events-none select-none"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 0.07, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        width={800}
        height={512}
      />

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
              <span className="text-foreground text-xs font-semibold leading-tight">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
