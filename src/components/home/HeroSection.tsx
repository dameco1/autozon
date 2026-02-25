import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { carImages } from "./carImages";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const bgImages = carImages.slice(0, 6);

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(155_100%_42%/0.08),transparent)]" />

      {/* Subtle car images grid in background */}
      <div className="absolute inset-0 grid grid-cols-3 gap-2 p-4 opacity-[0.12]">
        {bgImages.map((car, i) => (
          <img
            key={i}
            src={car.url}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover rounded-lg"
          />
        ))}
      </div>
      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0 bg-charcoal/60" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--silver)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--silver)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        {/* Centered title area */}
        <div className="text-center mb-16">
          <motion.span
            className="text-xs font-medium text-primary tracking-wide uppercase mb-6 block"
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
          >
            <Sparkles className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
            {t.hero.badge}
          </motion.span>

          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-[0.95] tracking-tight mb-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            {t.hero.title}
            <br />
            <span className="text-gradient">
              {(() => {
                const text = t.hero.titleAccent;
                const match = text.match(/^(.*?)(AI|KI)(.*)/);
                if (!match) return text;
                const [, before, tag, after] = match;
                return <>{before}<span className="text-white bg-primary/20 px-1 rounded">{tag}</span>{after}</>;
              })()}
            </span>
          </motion.h1>

          <motion.p
            className="text-silver/50 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            initial="hidden" animate="visible" variants={fadeUp} custom={1.5}
          >
            {t.hero.manifesto}
          </motion.p>
        </div>

        {/* Two-column Selling / Buying grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16"
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
        >
          {/* Selling a Car */}
          <div className="flex gap-5">
            <div className="w-1 shrink-0 rounded-full bg-primary" />
            <div>
              <h2 className="text-xl font-display font-bold text-white mb-1">{t.hero.sellingTitle}</h2>
              <p className="text-primary text-xs font-bold tracking-wider uppercase mb-3">{t.hero.sellingTagline}</p>
              <p className="text-silver/50 text-sm leading-relaxed mb-5">
                {t.hero.sellingDesc}
              </p>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-lg shadow-[0_0_30px_hsl(155_100%_42%/0.2)] hover:shadow-[0_0_50px_hsl(155_100%_42%/0.3)] transition-shadow"
                onClick={() => navigate("/intent")}
              >
                {t.hero.sellerCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Buying a Car */}
          <div className="flex gap-5">
            <div className="w-1 shrink-0 rounded-full bg-primary" />
            <div>
              <h2 className="text-xl font-display font-bold text-white mb-1">{t.hero.buyingTitle}</h2>
              <p className="text-primary text-xs font-bold tracking-wider uppercase mb-3">{t.hero.buyingTagline}</p>
              <p className="text-silver/50 text-sm leading-relaxed mb-5">
                {t.hero.buyingDesc}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-border text-white hover:bg-secondary hover:text-white font-semibold rounded-lg"
                onClick={() => navigate("/intent")}
              >
                {t.hero.buyerCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Divider + tagline */}
        <motion.div
          className="mt-16 pt-8 border-t border-border/50 text-center"
          initial="hidden" animate="visible" variants={fadeUp} custom={3}
        >
          <p className="text-silver/50 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
