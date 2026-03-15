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

const bgCars = [
  { src: carBmw5, className: "top-[6%] left-[-6%] w-[300px] rotate-[-8deg]" },
  { src: carPorsche911, className: "top-[8%] right-[-4%] w-[280px] rotate-[6deg]" },
  { src: carBmwX6, className: "bottom-[6%] left-[-3%] w-[280px] rotate-[4deg]" },
  { src: carBmwZ4, className: "bottom-[10%] right-[-6%] w-[260px] rotate-[-5deg]" },
  { src: carBmw5Black, className: "top-[42%] left-[-10%] w-[260px] rotate-[-3deg]" },
  { src: carPorschePanamera, className: "top-[38%] right-[-10%] w-[270px] rotate-[3deg]" },
  { src: carBmwX2, className: "top-[68%] left-[2%] w-[240px] rotate-[6deg]" },
  { src: carCitroen, className: "top-[65%] right-[0%] w-[250px] rotate-[-4deg]" },
];

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-navy">
      {/* Background car images */}
      {bgCars.map((car, i) => (
        <motion.img
          key={i}
          src={car.src}
          alt=""
          aria-hidden="true"
          className={`absolute ${car.className} opacity-[0.07] pointer-events-none select-none object-cover rounded-2xl blur-[1px]`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.07, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.2, duration: 1.2, ease: "easeOut" }}
        />
      ))}

      {/* Gradient overlay */}
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
