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

const HowItWorksSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="py-28 sm:py-36 bg-secondary relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div className="mb-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <span className="text-xs font-semibold tracking-widest uppercase text-primary/80 mb-4 block">{t.howItWorks.badge}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white">{t.howItWorks.title}</h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {t.howItWorks.steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative text-center md:text-left"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              >
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full border border-primary/20 bg-charcoal mb-4">
                  <span className="text-sm font-display font-black text-primary">{step.number}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{step.title}</h3>
                <p className="text-silver/50 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
