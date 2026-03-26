import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const CtaSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 bg-orange relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,hsl(24_80%_38%/0.3),transparent)]" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-tight mb-3">
            {t.cta.title}
          </h2>
          <p className="text-white/80 text-sm sm:text-base italic mb-2 whitespace-pre-line">{t.cta.aiLine}</p>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">{t.cta.subtitle}</p>
          <Button
            size="lg"
            className="bg-white text-orange hover:bg-white/90 font-bold text-base px-10 py-6 rounded-lg shadow-lg"
            onClick={() => navigate("/signup")}
          >
            {t.cta.button}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
