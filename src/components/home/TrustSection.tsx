import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const TrustSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="why-autozon" className="py-28 sm:py-36 bg-charcoal">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div className="mb-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <span className="text-xs font-semibold tracking-widest uppercase text-primary/80 mb-4 block">{t.trust.badge}</span>
          <h2 className="text-5xl sm:text-6xl font-display font-black text-white">{t.trust.title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {t.trust.pillars.map((pillar, i) => (
            <motion.div
              key={i}
              className="group bg-secondary/40 border border-border rounded-2xl p-6 hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
            >
              <CheckCircle2 className="h-7 w-7 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-base font-display font-bold text-white mb-2">{pillar.title}</h3>
              <p className="text-silver/50 text-xs leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
