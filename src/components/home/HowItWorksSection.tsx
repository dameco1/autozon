import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const HowItWorksSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-navy">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <span className="text-xs font-semibold tracking-widest uppercase text-orange mb-3 block">{t.howItWorks.badge}</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white">{t.howItWorks.title}</h2>
          {(t.howItWorks as any).subtitle && (
            <p className="text-silver/50 text-base sm:text-lg mt-3">{(t.howItWorks as any).subtitle}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
          {t.howItWorks.steps.slice(0, 3).map((step, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
            >
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange/10 border-2 border-orange/20 mb-5">
                <span className="text-lg font-display font-black text-orange">{step.number}</span>
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">{step.title}</h3>
              <p className="text-silver/50 text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {t.howItWorks.steps.length > 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
            {t.howItWorks.steps.slice(3).map((step, i) => (
              <motion.div
                key={i + 3}
                className="text-center"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 4}
              >
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange/10 border-2 border-orange/20 mb-5">
                  <span className="text-lg font-display font-black text-orange">{step.number}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{step.title}</h3>
                <p className="text-silver/50 text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}>
          <Button
            size="lg"
            className="bg-orange text-orange-foreground hover:bg-orange/90 font-bold text-base px-8 py-6 rounded-lg shadow-[0_0_40px_hsl(24_95%_53%/0.2)]"
            onClick={() => navigate("/intent")}
          >
            {t.howItWorks.cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
