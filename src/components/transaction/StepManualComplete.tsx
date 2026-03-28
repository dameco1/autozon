import React from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle2, ArrowRight, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import ValuationFeedback from "./ValuationFeedback";

interface Props {
  car: { make: string; model: string; year: number };
  agreedPrice: number;
  sellerCountry: string;
  carId?: string;
  fairValuePrice?: number | null;
  onDashboard: () => void;
  onDownload: () => void;
}

const StepManualComplete: React.FC<Props> = ({ car, agreedPrice, sellerCountry, carId, fairValuePrice, onDashboard, onDownload }) => {
  const { t } = useLanguage();
  const isAustria = sellerCountry?.toLowerCase().includes("austria") || sellerCountry?.toLowerCase().includes("österreich");

  const contractUrl = isAustria
    ? "https://www.oeamtc.at/thema/autokauf/kaufvertrag/"
    : "https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/kaufvertrag/";

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-display font-black text-foreground mb-2">{t.transaction.manualCompleteTitle}</h2>
      <p className="text-muted-foreground text-sm mb-6">{t.transaction.manualCompleteSubtitle}</p>

      {/* Checklist */}
      <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-left mb-6">
        <h3 className="font-display font-bold text-foreground mb-4 text-sm">{t.transaction.manualChecklist}</h3>
        <div className="space-y-3">
          {[
            t.transaction.manualStep1,
            t.transaction.manualStep2,
            t.transaction.manualStep3,
            t.transaction.manualStep4,
            t.transaction.manualStep5,
            t.transaction.manualStep6,
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Download official contract */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
        <p className="text-sm text-muted-foreground mb-2">{t.transaction.downloadOfficialContract}</p>
        <a
          href={contractUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
        >
          {isAustria ? "ÖAMTC Kaufvertrag" : "ADAC Kaufvertrag"} <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Valuation feedback prompt */}
      {carId && (
        <div className="mb-6">
          <ValuationFeedback carId={carId} agreedPrice={agreedPrice} fairValuePrice={fairValuePrice ?? null} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1 border-border text-muted-foreground hover:bg-secondary font-semibold py-6 rounded-xl"
          onClick={onDownload}
        >
          <Download className="mr-2 h-5 w-5" /> {t.transaction.downloadSummary}
        </Button>
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl"
          onClick={onDashboard}
        >
          {t.transaction.backToDashboard} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default StepManualComplete;
