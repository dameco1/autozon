import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(155_100%_42%/0.08),transparent)]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--silver)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--silver)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left — Copy */}
          <div>
            <motion.span
              className="text-xs font-medium text-primary tracking-wide uppercase mb-8 block"
              initial="hidden" animate="visible" variants={fadeUp} custom={0}
            >
              The fair car market
            </motion.span>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-[0.92] tracking-tight mb-6"
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
            >
              {t.hero.title}
              <br />
              <span className="text-gradient">{t.hero.titleAccent}</span>
            </motion.h1>

            <motion.p
              className="text-silver/50 text-lg sm:text-xl max-w-lg leading-relaxed mb-10"
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-8 py-6 rounded-xl shadow-[0_0_40px_hsl(155_100%_42%/0.25)] hover:shadow-[0_0_60px_hsl(155_100%_42%/0.35)] transition-shadow"
                onClick={() => navigate("/intent")}
              >
                {t.hero.sellerCta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-white hover:bg-secondary hover:text-white font-semibold text-base px-8 py-6 rounded-xl"
                onClick={() => navigate("/intent")}
              >
                {t.hero.buyerCta}
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex gap-8 mt-14 pt-8 border-t border-border/50"
              initial="hidden" animate="visible" variants={fadeUp} custom={4}
            >
              {[
                { value: "2min", label: "to fair value" },
                { value: "0€", label: "listing fee" },
                { value: "100%", label: "transparent" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-display font-black text-primary">{stat.value}</div>
                  <div className="text-xs text-silver/40 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Car visual mosaic */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-2 gap-3">
              {/* Main large image */}
              <div className="col-span-2 rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/5">
                <img
                  src={carImages[0].url}
                  alt={carImages[0].alt}
                  className="w-full h-[280px] object-cover"
                />
              </div>
              {/* Two smaller images */}
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-xl">
                <img
                  src={carImages[2].url}
                  alt={carImages[2].alt}
                  className="w-full h-[160px] object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-xl relative">
                <img
                  src={carImages[5].url}
                  alt={carImages[5].alt}
                  className="w-full h-[160px] object-cover"
                />
                {/* Glassmorphism overlay card */}
                <div className="absolute inset-0 flex items-end p-4">
                  <div className="backdrop-blur-md bg-charcoal/60 border border-border/50 rounded-lg px-4 py-3 w-full">
                    <div className="text-xs text-silver/60">Fair Value</div>
                    <div className="text-lg font-display font-bold text-primary">€34,200</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
