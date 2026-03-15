import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

import carBmw5 from "@/assets/pitch/car-bmw-5-blue.jpg";
import carBmw5Black from "@/assets/pitch/car-bmw-5-black.jpg";
import carPorsche911 from "@/assets/pitch/car-porsche-911.jpg";
import carPorschePanamera from "@/assets/pitch/car-porsche-panamera.jpg";
import carBmwX6 from "@/assets/pitch/car-bmw-x6-red.jpg";
import carBmwX2 from "@/assets/pitch/car-bmw-x2.jpg";
import carBmwZ4 from "@/assets/pitch/car-bmw-z4.jpg";
import carCitroen from "@/assets/pitch/car-citroen-ds5.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.14, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const badgeIcons: Record<string, React.ReactNode> = {
  check: <CheckCircle2 className="h-4 w-4 text-green" />,
  lock: <Lock className="h-4 w-4 text-silver/60" />,
  zap: <Zap className="h-4 w-4 text-orange" />,
};

const leftColumn = [carBmw5, carPorsche911, carBmwX2, carCitroen];
const rightColumn = [carBmwZ4, carBmwX6, carPorschePanamera, carBmw5Black];

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-navy">
      {/* Left column of car cards */}
      <div className="absolute left-0 top-0 bottom-0 w-[220px] lg:w-[280px] hidden md:flex flex-col justify-center gap-4 pl-4 -translate-x-[30%]">
        {leftColumn.map((src, i) => (
          <motion.div
            key={i}
            className="relative rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.9, ease: "easeOut" }}
          >
            <img src={src} alt="" aria-hidden="true" className="w-full h-[120px] lg:h-[140px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy/90" />
          </motion.div>
        ))}
      </div>

      {/* Right column of car cards */}
      <div className="absolute right-0 top-0 bottom-0 w-[220px] lg:w-[280px] hidden md:flex flex-col justify-center gap-4 pr-4 translate-x-[30%]">
        {rightColumn.map((src, i) => (
          <motion.div
            key={i}
            className="relative rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.15, duration: 0.9, ease: "easeOut" }}
          >
            <img src={src} alt="" aria-hidden="true" className="w-full h-[120px] lg:h-[140px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-navy/90" />
          </motion.div>
        ))}
      </div>

      {/* Center vignette to keep text readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,hsl(var(--navy))_40%,transparent_100%)]" />

      {/* Accent gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(24_95%_53%/0.06),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,hsl(210_60%_20%/0.3),transparent)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 w-full text-center">
        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-[56px] font-display font-black text-white leading-[1.08] tracking-tight mb-2"
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
          className="text-silver/70 text-base sm:text-lg lg:text-xl max-w-[560px] mx-auto leading-relaxed mb-10 whitespace-pre-line"
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
        >
          {t.hero.subheadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          initial="hidden" animate="visible" variants={fadeUp} custom={1.5}
        >
          <Button
            size="lg"
            className="w-full sm:w-auto bg-orange text-orange-foreground hover:bg-orange/90 font-bold text-base px-8 py-6 rounded-full shadow-[0_0_40px_hsl(24_95%_53%/0.3)] hover:shadow-[0_0_60px_hsl(24_95%_53%/0.4)] transition-all"
            onClick={() => navigate("/intent")}
          >
            {t.hero.primaryCta}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-silver/30 text-white hover:bg-white/5 font-semibold text-base px-8 py-6 rounded-full"
            onClick={() => navigate("/car-selection")}
          >
            {t.hero.secondaryCta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 text-silver/50 text-sm"
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
        >
          {t.hero.trustBadges.map((badge, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {badgeIcons[badge.icon]}
              {badge.text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
