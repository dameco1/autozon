import React from "react";
import { motion } from "framer-motion";
import { FileText, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  onSelect: (method: "digital" | "manual") => void;
}

const StepMethod: React.FC<Props> = ({ onSelect }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm text-center mb-6">{t.transaction.methodSubtitle}</p>

      <motion.button
        className="w-full text-left bg-primary/5 border-2 border-primary/30 hover:border-primary rounded-2xl p-6 transition-all group"
        onClick={() => onSelect("digital")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-bold text-foreground text-lg">{t.transaction.digitalTitle}</h3>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                {t.transaction.digitalBadge}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-3">{t.transaction.digitalDesc}</p>
            <div className="flex flex-wrap gap-2">
              {[t.transaction.featureContract, t.transaction.featurePayment, t.transaction.featureInsurance].map((f) => (
                <span key={f} className="inline-flex items-center gap-1 text-[11px] text-primary/80 bg-primary/5 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="h-3 w-3" /> {f}
                </span>
              ))}
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-3" />
        </div>
      </motion.button>

      <motion.button
        className="w-full text-left bg-secondary/50 border border-border hover:border-primary/30 rounded-2xl p-6 transition-all group"
        onClick={() => onSelect("manual")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-foreground text-lg">{t.transaction.manualTitle}</h3>
            <p className="text-muted-foreground text-sm">{t.transaction.manualDesc}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-3" />
        </div>
      </motion.button>
    </div>
  );
};

export default StepMethod;
