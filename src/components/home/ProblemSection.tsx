import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const ProblemSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-14 sm:py-18 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(0_84%_60%/0.04),transparent)]" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <span className="text-xs font-semibold tracking-widest uppercase text-destructive/80 mb-4 block">{t.problem.badge}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-[0.95]">
            {t.problem.title}
            <br />
            <span className="text-destructive">{t.problem.titleAccent}</span>
          </h2>
          <p className="text-silver/50 text-lg max-w-2xl mt-6 leading-relaxed">{t.problem.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.problem.stats.map((stat, i) => (
            <motion.div
              key={i}
              className="group relative bg-charcoal border border-border rounded-2xl p-10 overflow-hidden hover:border-destructive/30 transition-all duration-500"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-destructive/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-5xl sm:text-6xl font-display font-black text-destructive mb-3">{stat.value}</div>
              <div className="text-silver/50 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
