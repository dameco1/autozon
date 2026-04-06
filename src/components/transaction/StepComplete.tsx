import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, ArrowRight, FileText, CreditCard, Shield, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import ValuationFeedback from "./ValuationFeedback";

interface Props {
  car: { make: string; model: string; year: number };
  agreedPrice: number;
  completionMethod: string;
  contractType: string | null;
  paymentMethod: string | null;
  insuranceTier: string | null;
  carId?: string;
  fairValuePrice?: number | null;
  onDashboard: () => void;
  onDownload: () => void;
}

const StepComplete: React.FC<Props> = ({
  car, agreedPrice, completionMethod, contractType, paymentMethod, insuranceTier, carId, fairValuePrice, onDashboard, onDownload,
}) => {
  const { t } = useLanguage();

  const contractLabel = contractType === "autozon" ? "Autozon" : contractType === "oeamtc" ? "ÖAMTC" : contractType === "adac" ? "ADAC" : "Autozon";
  const paymentLabel = paymentMethod === "cash"
    ? t.transaction.cashPayment
    : paymentMethod === "credit"
    ? t.acquisition.creditTab
    : paymentMethod === "leasing"
    ? t.acquisition.leasingTab
    : "—";
  const insuranceLabel = insuranceTier === "liability"
    ? t.acquisition.liability
    : insuranceTier === "partial"
    ? t.acquisition.partialCover
    : insuranceTier === "comprehensive"
    ? t.acquisition.comprehensive
    : t.transaction.noInsurance;

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <PartyPopper className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-foreground mb-2">{t.transaction.completeTitle}</h2>
        <p className="text-muted-foreground">{t.transaction.completeSubtitle} Scroll down for the full contract and next steps.</p>
      </div>

      {/* Summary */}
      <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-left mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">{t.transaction.vehicle}</span>
          <span className="text-foreground font-bold">{car.year} {car.make} {car.model}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">{t.transaction.purchasePrice}</span>
          <span className="text-primary font-display font-black text-xl">€{agreedPrice.toLocaleString()}</span>
        </div>
        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{t.transaction.contractLabel}:</span>
            <span className="text-foreground font-medium">{contractLabel} Kaufvertrag</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{t.transaction.paymentLabel}:</span>
            <span className="text-foreground font-medium">{paymentLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{t.transaction.insuranceLabel}:</span>
            <span className="text-foreground font-medium">{insuranceLabel}</span>
          </div>
        </div>
      </div>

      {/* Valuation feedback prompt */}
      {carId && (
        <div className="mb-6">
          <ValuationFeedback carId={carId} agreedPrice={agreedPrice} fairValuePrice={fairValuePrice ?? null} />
        </div>
      )}

      {/* Next steps */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-left mb-6">
        <h3 className="font-display font-bold text-foreground mb-3 text-sm">{t.transaction.nextStepsTitle}</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><span className="text-primary font-bold">1.</span> {t.transaction.nextStep1}</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">2.</span> {t.transaction.nextStep2}</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">3.</span> {t.transaction.nextStep3}</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">4.</span> {t.transaction.nextStep4}</li>
        </ol>
      </div>

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

export default StepComplete;
