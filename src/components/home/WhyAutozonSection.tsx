import React from "react";
import { motion } from "framer-motion";
import { Coins, Zap, RefreshCw } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const icons = [Coins, Zap, RefreshCw];

const WhyAutozonSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-light-bg">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-navy text-center mb-12"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        >
          {t.whyAutozon.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.whyAutozon.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              >
                <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-5">
                  <Icon className="h-6 w-6 text-orange" />
                </div>
                <h3 className="text-lg font-display font-bold text-navy mb-2">{card.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyAutozonSection;
