import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const ComparisonSection: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <section className="py-12 sm:py-16 bg-charcoal">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white text-center mb-12"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            {t.comparison.title}
          </motion.h2>

          <motion.div
            className="bg-navy rounded-2xl border border-border overflow-hidden"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-display font-bold text-silver/70">Feature</th>
                  <th className="p-4 font-display font-bold text-orange text-center">Autozon ✅</th>
                  {t.comparison.competitors.map((c, i) => (
                    <th key={i} className="p-4 font-display font-semibold text-silver/40 text-center">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.comparison.features.map((feature, fi) => (
                  <tr key={fi} className="border-b border-border/30 last:border-0">
                    <td className="p-4 text-silver/70">{feature}</td>
                    <td className="p-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-orange mx-auto" />
                    </td>
                    {t.comparison.competitorData[fi].map((has, ci) => (
                      <td key={ci} className="p-4 text-center">
                        {has ? (
                          <CheckCircle2 className="h-5 w-5 text-silver/30 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-silver/20 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-charcoal">
      <div className="max-w-lg mx-auto px-4">
        <h2 className="text-2xl font-display font-black text-white text-center mb-8">
          {t.comparison.title}
        </h2>

        <div className="space-y-3">
          {t.comparison.features.map((feature, fi) => (
            <ComparisonAccordionItem
              key={fi}
              feature={feature}
              competitorData={t.comparison.competitorData[fi]}
              competitors={t.comparison.competitors}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ComparisonAccordionItem: React.FC<{
  feature: string;
  competitorData: readonly boolean[];
  competitors: readonly string[];
}> = ({ feature, competitorData, competitors }) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full bg-navy rounded-xl p-4 border border-border text-left">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-orange shrink-0" />
          <span className="text-sm font-medium text-white">{feature}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-silver/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-navy rounded-b-xl border-x border-b border-border px-4 pb-3">
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-orange">Autozon</span>
            <CheckCircle2 className="h-4 w-4 text-orange" />
          </div>
          {competitors.map((c, ci) => (
            <div key={ci} className="flex items-center justify-between text-sm">
              <span className="text-silver/50">{c}</span>
              {competitorData[ci] ? (
                <CheckCircle2 className="h-4 w-4 text-silver/30" />
              ) : (
                <XCircle className="h-4 w-4 text-silver/20" />
              )}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ComparisonSection;
