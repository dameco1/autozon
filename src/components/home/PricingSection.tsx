import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const PricingSection: React.FC = () => {
  const { t } = useLanguage();
  const pricing = (t as any).pricing;
  if (!pricing) return null;

  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-foreground mb-3">
            {pricing.title}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">{pricing.subtitle}</p>
        </motion.div>

        <motion.div
          className="bg-card rounded-2xl border border-border p-8 sm:p-10 shadow-sm"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
        >
          {/* Price */}
          <div className="text-center mb-8">
            <div className="text-5xl sm:text-6xl font-display font-black text-orange mb-2">{pricing.price}</div>
            <div className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">{pricing.label}</div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {pricing.features.map((feature: string, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-orange shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>

          {/* Callout */}
          <div className="bg-orange/[0.06] border border-orange/20 rounded-xl p-5 mb-6">
            <p className="text-foreground/80 text-sm leading-relaxed">{pricing.callout}</p>
          </div>
        </motion.div>

        {/* Buyer line */}
        <motion.p
          className="text-center text-muted-foreground text-sm mt-6"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
        >
          {pricing.buyerLine}
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
