import React from "react";
import { motion } from "framer-motion";
import { Brain, Cpu, Search, FileCheck, TrendingDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const icons = [Brain, Cpu, Search, FileCheck, TrendingDown];

const SolutionSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-14 sm:py-18 bg-charcoal relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,hsl(155_100%_42%/0.04),transparent)]" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <span className="text-xs font-semibold tracking-widest uppercase text-primary/80 mb-4 block">{t.solution.badge}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white">{t.solution.title}</h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {t.solution.features.map((feature, i) => {
            const Icon = icons[i];
            const isLarge = i < 2;
            return (
              <motion.div
                key={i}
                className={`group bg-secondary/60 border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 relative overflow-hidden ${
                  isLarge ? "md:col-span-3" : "md:col-span-2"
                }`}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-silver/50 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
