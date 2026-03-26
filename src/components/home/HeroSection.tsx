import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Zap, CreditCard } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import heroCar1 from "@/assets/hero-car-1.png";
import heroCar2 from "@/assets/hero-car-2.png";
import heroCar3 from "@/assets/hero-car-3.png";
import heroCar4 from "@/assets/hero-car-4.png";
import heroCar5 from "@/assets/hero-car-5.png";
import heroCar6 from "@/assets/hero-car-6.png";
import heroCar7 from "@/assets/hero-car-7.png";
import heroCar8 from "@/assets/hero-car-8.png";
import heroCar9 from "@/assets/hero-car-9.png";
import heroCar10 from "@/assets/hero-car-10.png";

const heroCars = [
  // Top row – spread across full width
  { src: heroCar3, className: "top-[4%] left-[2%] w-[140px] lg:w-[180px]", from: { x: -40, y: -20 } },
  { src: heroCar9, className: "top-[6%] left-[22%] w-[120px] lg:w-[160px] hidden lg:block", from: { x: -20, y: -15 } },
  { src: heroCar4, className: "top-[3%] right-[22%] w-[125px] lg:w-[165px] hidden lg:block", from: { x: 20, y: -15 } },
  { src: heroCar7, className: "top-[5%] right-[2%] w-[135px] lg:w-[175px]", from: { x: 40, y: -20 } },
  // Middle row – sides only (text is in the center)
  { src: heroCar5, className: "top-[35%] left-[0%] w-[150px] lg:w-[200px] hidden sm:block", from: { x: -35, y: 0 } },
  { src: heroCar6, className: "top-[33%] right-[0%] w-[145px] lg:w-[195px] hidden sm:block", from: { x: 35, y: 0 } },
  // Bottom row – spread across full width
  { src: heroCar1, className: "bottom-[2%] left-[1%] w-[170px] lg:w-[220px]", from: { x: -50, y: 20 } },
  { src: heroCar8, className: "bottom-[5%] left-[25%] w-[130px] lg:w-[170px] hidden md:block", from: { x: -15, y: 25 } },
  { src: heroCar10, className: "bottom-[4%] right-[25%] w-[125px] lg:w-[165px] hidden md:block", from: { x: 15, y: 25 } },
  { src: heroCar2, className: "bottom-[2%] right-[1%] w-[165px] lg:w-[215px]", from: { x: 50, y: 20 } },
];

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

      {/* Scattered transparent car images */}
      {heroCars.map((car, i) => (
        <motion.img
          key={i}
          src={car.src}
          alt=""
          className={`absolute opacity-[0.12] pointer-events-none select-none ${car.className}`}
          initial={{ opacity: 0, x: car.from.x, y: car.from.y }}
          animate={{ opacity: 0.12, x: 0, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: i * 0.15 }}
          width={800}
          height={512}
        />
      ))}

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
      </div>
    </section>
  );
};

export default HeroSection;
