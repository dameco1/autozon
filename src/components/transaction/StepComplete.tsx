import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, ArrowRight, FileText, CreditCard, Shield, PartyPopper, ChevronDown, Banknote, Building2, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

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
        <p className="text-muted-foreground mb-4">{t.transaction.completeSubtitle}</p>
        <Button
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/5 font-semibold py-3 px-6 rounded-xl"
          onClick={() => {
            const contractEl = document.getElementById("contract-printable");
            if (contractEl) contractEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <ChevronDown className="mr-2 h-5 w-5 animate-bounce" /> View Contract & Next Steps
        </Button>
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

      {/* Payment details section */}
      <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-left mb-6">
        <h3 className="font-display font-bold text-foreground mb-4 text-sm flex items-center gap-2">
          <Banknote className="h-4 w-4 text-primary" /> Payment Details
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Method</span>
            <span className="text-foreground font-medium">{paymentLabel}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Amount Due</span>
            <span className="text-primary font-display font-bold">€{agreedPrice.toLocaleString()}</span>
          </div>
          {paymentMethod === "cash" && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground space-y-1.5">
              <p className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary flex-shrink-0" /> Transfer to the seller's bank account provided in the contract.</p>
              <p className="text-xs">Reference your transaction ID in the payment description.</p>
            </div>
          )}
          {paymentMethod === "credit" && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground space-y-1.5">
              <p className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary flex-shrink-0" /> Your financing partner will contact you to finalize the loan agreement.</p>
              <p className="text-xs">Monthly payments begin after the vehicle handover.</p>
            </div>
          )}
          {paymentMethod === "leasing" && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground space-y-1.5">
              <p className="flex items-center gap-2"><Car className="h-4 w-4 text-primary flex-shrink-0" /> Your leasing partner will send you the leasing contract for signature.</p>
              <p className="text-xs">First monthly payment due after vehicle registration.</p>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>Payment confirmation will be recorded once completed.</span>
          </div>
        </div>
      </div>

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


    </motion.div>
  );
};

export default StepComplete;
