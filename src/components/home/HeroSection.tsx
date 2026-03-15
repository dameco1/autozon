import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

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

/* ── SVG car silhouette paths (side profile, stroke-only) ── */
// Sedan
const sedanPath = "M60,120 Q60,100 80,95 L120,85 Q140,75 160,75 L280,75 Q310,75 330,85 L370,95 Q400,100 420,105 L440,110 Q460,115 460,130 L460,140 Q460,150 450,150 L420,150 Q420,130 400,130 Q380,130 380,150 L140,150 Q140,130 120,130 Q100,130 100,150 L70,150 Q60,150 60,140 Z";
// SUV
const suvPath = "M50,130 Q50,110 70,105 L100,95 Q110,70 130,60 L170,55 Q190,50 220,50 L300,50 Q330,50 350,55 L380,65 Q400,75 410,95 L430,105 Q450,110 450,130 L450,145 Q450,155 440,155 L415,155 Q415,135 395,135 Q375,135 375,155 L125,155 Q125,135 105,135 Q85,135 85,155 L60,155 Q50,155 50,145 Z";
// Coupe
const coupePath = "M55,125 Q55,108 75,100 L115,90 Q135,70 165,65 L220,60 Q250,58 270,60 L340,70 Q370,78 390,90 L420,100 Q445,108 450,120 L455,130 Q458,140 448,145 L425,145 Q425,125 405,125 Q385,125 385,145 L130,145 Q130,125 110,125 Q90,125 90,145 L65,145 Q55,145 55,135 Z";
// Sports car
const sportsPath = "M45,128 Q45,115 65,108 L105,98 Q120,78 150,70 L200,62 Q230,58 260,60 L330,68 Q365,75 385,88 L425,100 Q448,108 452,122 L455,132 Q455,142 445,145 L422,145 Q420,125 400,125 Q380,125 378,145 L128,145 Q126,125 106,125 Q86,125 84,145 L58,145 Q45,145 45,138 Z";
// Wagon
const wagonPath = "M55,125 Q55,105 75,98 L110,88 Q120,65 145,55 L180,50 Q200,48 230,48 L320,48 Q345,48 355,50 L380,55 Q395,60 400,75 L410,88 Q430,95 440,105 L448,115 Q455,125 455,135 L455,148 Q455,155 445,155 L420,155 Q420,135 400,135 Q380,135 380,155 L125,155 Q125,135 105,135 Q85,135 85,155 L65,155 Q55,155 55,148 Z";

const silhouettes = [
  { path: sedanPath, width: 500, height: 200, viewBox: "0 0 500 200", className: "absolute bottom-[5%] left-[-4%] w-[580px] lg:w-[700px]", delay: 0, driftDir: 1 },
  { path: suvPath, width: 500, height: 200, viewBox: "0 0 500 200", className: "absolute bottom-[8%] right-[-6%] w-[520px] lg:w-[650px]", delay: 0.3, driftDir: -1 },
  { path: coupePath, width: 500, height: 200, viewBox: "0 0 500 200", className: "absolute top-[8%] right-[-8%] w-[420px] lg:w-[520px]", delay: 0.6, driftDir: 1 },
  { path: sportsPath, width: 500, height: 200, viewBox: "0 0 500 200", className: "absolute top-[15%] left-[-6%] w-[380px] lg:w-[480px]", delay: 0.9, driftDir: -1 },
  { path: wagonPath, width: 500, height: 200, viewBox: "0 0 500 200", className: "absolute bottom-[30%] right-[10%] w-[340px] lg:w-[420px]", delay: 1.2, driftDir: 1 },
];

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-navy">
      {/* Subtle center radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

      {/* Accent gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(24_95%_53%/0.06),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,hsl(210_60%_20%/0.3),transparent)]" />

      {/* Car silhouette SVGs */}
      {silhouettes.map((car, i) => (
        <motion.div
          key={i}
          className={`${car.className} pointer-events-none z-0`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + car.delay, duration: 1.5, ease: "easeOut" }}
        >
          <motion.svg
            viewBox={car.viewBox}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            animate={{ x: [0, 12 * car.driftDir, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d={car.path}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1.5"
              fill="none"
            />
          </motion.svg>
        </motion.div>
      ))}

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
