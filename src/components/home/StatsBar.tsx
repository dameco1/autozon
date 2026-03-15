import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const StatsBar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10 bg-navy">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {t.statsBar.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white mb-1">
                {item.value}
              </div>
              <div className="text-silver/50 text-xs sm:text-sm">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
