import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        {/* Centered title area */}
        <div className="text-center mb-16">
          <motion.span
            className="text-xs font-medium text-primary tracking-wide uppercase mb-6 block"
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
          >
            The fair car market
          </motion.span>

          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-[0.95] tracking-tight mb-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            {t.hero.title}
            <br />
            <span className="text-gradient">{t.hero.titleAccent}</span>
          </motion.h1>
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
              <h2 className="text-xl font-display font-bold text-white mb-3">Selling a Car</h2>
              <p className="text-silver/50 text-sm leading-relaxed mb-5">
                Welcome to the first platform that dynamically scores your car's value and maximizes your sale price. We analyze condition, demand, and market data in real time — then match you with verified buyers ready to pay what it's truly worth.
              </p>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-lg shadow-[0_0_30px_hsl(155_100%_42%/0.2)] hover:shadow-[0_0_50px_hsl(155_100%_42%/0.3)] transition-shadow"
                onClick={() => navigate("/intent")}
              >
                Sell My Car
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Buying a Car */}
          <div className="flex gap-5">
            <div className="w-1 shrink-0 rounded-full bg-primary" />
            <div>
              <h2 className="text-xl font-display font-bold text-white mb-3">Buying a Car</h2>
              <p className="text-silver/50 text-sm leading-relaxed mb-5">
                Set up your profile, tell us what you're looking for, and we'll do the rest. Autozon finds the right car, helps you buy it at a fair price, and delivers it straight to your door — inspected, verified, and hassle-free.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-border text-white hover:bg-secondary hover:text-white font-semibold rounded-lg"
                onClick={() => navigate("/intent")}
              >
                Find My Car
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex justify-center gap-12 mt-16 pt-8 border-t border-border/50"
          initial="hidden" animate="visible" variants={fadeUp} custom={3}
        >
          {[
            { value: "2min", label: "to fair value" },
            { value: "0€", label: "listing fee" },
            { value: "100%", label: "transparent" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-display font-black text-primary">{stat.value}</div>
              <div className="text-xs text-silver/40 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
