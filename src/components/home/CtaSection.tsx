import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const CtaSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="py-32 sm:py-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-charcoal to-charcoal" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,hsl(155_100%_42%/0.06),transparent)]" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-5xl sm:text-7xl font-display font-black text-white leading-[0.92] mb-4">
            {t.cta.title}
            <br />
            <span className="text-gradient">{t.cta.titleAccent}</span>
          </h2>
          <p className="text-silver/50 text-lg sm:text-xl mb-12 max-w-xl mx-auto">{t.cta.subtitle}</p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-12 py-7 rounded-xl shadow-[0_0_60px_hsl(155_100%_42%/0.3)] hover:shadow-[0_0_80px_hsl(155_100%_42%/0.4)] transition-shadow"
            onClick={() => navigate("/signup")}
          >
            {t.cta.button}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
