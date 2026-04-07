import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, User, Building2 } from "lucide-react";
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

  const plans = pricing.plans || [];

  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-foreground mb-3">
            {pricing.title}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">{pricing.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan: any, idx: number) => {
            const Icon = idx === 0 ? User : Building2;
            return (
              <motion.div
                key={idx}
                className="bg-card rounded-2xl border border-border p-8 shadow-sm flex flex-col"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={idx + 1}
              >
                {/* Plan header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.audience}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl sm:text-5xl font-display font-black text-orange">{plan.price}</div>
                  <div className="text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground mt-1">{plan.label}</div>
                </div>

                {/* Features */}
                <div className="space-y-3 flex-1">
                  {plan.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-orange shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Callout */}
        <motion.div
          className="bg-orange/[0.06] border border-orange/20 rounded-xl p-5 mb-6"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
        >
          <p className="text-foreground/80 text-sm leading-relaxed text-center">{pricing.callout}</p>
        </motion.div>

        {/* Buyer line */}
        <motion.p
          className="text-center text-muted-foreground text-sm"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
        >
          {pricing.buyerLine}
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
