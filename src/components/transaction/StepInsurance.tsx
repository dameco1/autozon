import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Star, Info, Compass, Link2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";
import InsuranceCalculator from "@/components/InsuranceCalculator";

interface Partner {
  id: string;
  name: string;
  type: string;
  base_rate: number;
  description: string | null;
}

interface Props {
  agreedPrice: number;
  partners: Partner[];
  onContinue: (tier: string, partnerId?: string) => void;
  onSkip: () => void;
}

const StepInsurance: React.FC<Props> = ({ agreedPrice, partners, onContinue, onSkip }) => {
  const { t } = useLanguage();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const insurers = partners.filter((p) => p.type === "insurance");

  const tiers = [
    { id: "liability", label: t.acquisition.liability, baseMonthly: 38, desc: t.transaction.liabilityDesc },
    { id: "partial", label: t.acquisition.partialCover, baseMonthly: 67, recommended: true, desc: t.transaction.partialDesc },
    { id: "comprehensive", label: t.acquisition.comprehensive, baseMonthly: 112, desc: t.transaction.comprehensiveDesc },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm text-center">{t.transaction.insuranceSubtitle}</p>

      {/* Tier selection */}
      <div className="space-y-3">
        {tiers.map((tier) => (
          <motion.button
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className={`w-full text-left p-5 rounded-xl border transition-all ${
              selectedTier === tier.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30 bg-secondary/50"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                {selectedTier === tier.id ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border" />
                )}
                <div>
                  <span className="text-sm font-bold text-foreground">{tier.label}</span>
                  {tier.recommended && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      <Star className="h-2.5 w-2.5 inline mr-0.5" />{t.acquisition.recommended}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{t.acquisition.from} €{tier.baseMonthly}/mo</span>
            </div>
            <p className="text-xs text-muted-foreground ml-8">{tier.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Provider quotes */}
      {selectedTier && insurers.length > 0 && (
        <div className="space-y-3">
          {insurers.map((ins, i) => {
            const tierData = tiers.find((t) => t.id === selectedTier)!;
            const monthly = tierData.baseMonthly + i * 5 + Math.round(agreedPrice * 0.0001);
            const deductible = [500, 300, 150][i] ?? 500;
            return (
              <motion.div
                key={ins.id}
                className={`bg-secondary/50 border rounded-xl p-5 ${i === 0 ? "border-primary/40" : "border-border"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h4 className="font-display font-bold text-foreground">{ins.name}</h4>
                  </div>
                  <span className="text-lg font-display font-bold text-primary">€{monthly}/mo</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{t.acquisition.deductible}: €{deductible}</p>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  onClick={() => onContinue(selectedTier, ins.id)}
                >
                  <Shield className="mr-2 h-4 w-4" /> {t.transaction.selectInsurance}
                </Button>
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedTier && insurers.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground text-sm mb-3">{t.transaction.noInsurersYet}</p>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            onClick={() => onContinue(selectedTier)}
          >
            {t.transaction.continueWithTier}
          </Button>
        </div>
      )}

      {/* Insurance Calculator */}
      <InsuranceCalculator carPrice={agreedPrice} />

      {/* Insurance Roadmap */}
      <div className="bg-secondary/50 border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          <h4 className="font-display font-bold text-foreground text-sm">Insurance Integration Roadmap</h4>
        </div>
        <div className="space-y-2">
          {[
            { label: "Durchblicker API", desc: "Price comparison across Austrian insurers", status: "Q3 2026" },
            { label: "Direct Insurer Integration", desc: "Instant binding quotes from partner insurers", status: "Q4 2026" },
            { label: "Broker-as-a-Service", desc: "Full insurance brokerage within the platform", status: "2027" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between bg-background rounded-lg p-3 border border-border">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs text-muted-foreground border-border shrink-0">{item.status}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Skip option */}
      <div className="text-center">
        <button onClick={onSkip} className="text-muted-foreground hover:text-muted-foreground text-sm underline underline-offset-4">
          {t.transaction.skipInsurance}
        </button>
      </div>
    </div>
  );
};

export default StepInsurance;
