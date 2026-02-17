import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  car: { make: string; model: string; year: number; vin?: string };
  agreedPrice: number;
  sellerCountry: string;
  buyerName: string;
  sellerName: string;
  onContinue: (contractType: string) => void;
}

const StepContract: React.FC<Props> = ({ car, agreedPrice, sellerCountry, buyerName, sellerName, onContinue }) => {
  const { t } = useLanguage();
  const [signed, setSigned] = useState(false);

  // Determine contract type by seller's country
  const isAustria = sellerCountry?.toLowerCase().includes("austria") || sellerCountry?.toLowerCase().includes("österreich");
  const contractType = isAustria ? "oeamtc" : "adac";
  const contractOrg = isAustria ? "ÖAMTC" : "ADAC";
  const contractTitle = isAustria
    ? t.transaction.oeamtcTitle
    : t.transaction.adacTitle;

  const handleSign = () => {
    setSigned(true);
  };

  return (
    <div className="space-y-6">
      {/* Country detection */}
      <motion.div
        className="bg-secondary/50 border border-border rounded-xl p-4 flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-sm text-silver/60">{t.transaction.contractCountry}</p>
          <p className="text-white font-semibold">
            {sellerCountry || "Germany"} → {contractOrg} {t.transaction.contractLabel}
          </p>
        </div>
      </motion.div>

      {/* Contract preview */}
      <motion.div
        className="bg-white/[0.02] border border-border rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-primary/5 border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-display font-bold text-white">{contractTitle}</h3>
              <p className="text-xs text-silver/40">{t.transaction.contractStandard} {contractOrg}</p>
            </div>
          </div>
          {signed && <CheckCircle2 className="h-5 w-5 text-primary" />}
        </div>

        <div className="px-6 py-5 space-y-4 text-sm">
          {/* Contract summary fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-silver/40 text-xs">{t.transaction.seller}</p>
              <p className="text-white font-medium">{sellerName}</p>
            </div>
            <div>
              <p className="text-silver/40 text-xs">{t.transaction.buyer}</p>
              <p className="text-white font-medium">{buyerName}</p>
            </div>
            <div>
              <p className="text-silver/40 text-xs">{t.transaction.vehicle}</p>
              <p className="text-white font-medium">{car.year} {car.make} {car.model}</p>
            </div>
            <div>
              <p className="text-silver/40 text-xs">{t.transaction.vinLabel}</p>
              <p className="text-white font-medium font-mono text-xs">{car.vin || "—"}</p>
            </div>
            <div>
              <p className="text-silver/40 text-xs">{t.transaction.purchasePrice}</p>
              <p className="text-primary font-display font-bold text-lg">€{agreedPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-silver/40 text-xs">{t.transaction.contractType}</p>
              <p className="text-white font-medium">{contractOrg} Kaufvertrag</p>
            </div>
          </div>

          {/* Key clauses */}
          <div className="border-t border-border pt-4">
            <p className="text-silver/40 text-xs mb-2">{t.transaction.keyClauses}</p>
            <ul className="space-y-1.5 text-silver/60 text-xs">
              <li>• {t.transaction.clause1}</li>
              <li>• {t.transaction.clause2}</li>
              <li>• {t.transaction.clause3}</li>
              <li>• {t.transaction.clause4}</li>
              <li>• {t.transaction.clause5}</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!signed ? (
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6"
            onClick={handleSign}
          >
            <CheckCircle2 className="mr-2 h-5 w-5" /> {t.transaction.signContract}
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex-1 border-border text-silver hover:bg-secondary"
              onClick={() => {
                // Placeholder for PDF download
                import("@/lib/generateNegotiationPdf").then(({ generateNegotiationPdf }) => {
                  generateNegotiationPdf({
                    car: { ...car, price: agreedPrice, fair_value_price: null },
                    offer: { amount: agreedPrice, agreed_price: agreedPrice, counter_amount: null, current_round: 1, max_rounds: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as any,
                    sellerName,
                    buyerName,
                  });
                });
              }}
            >
              <Download className="mr-2 h-4 w-4" /> {t.transaction.downloadContract}
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6"
              onClick={() => onContinue(contractType)}
            >
              {t.transaction.continueToPayment}
            </Button>
          </>
        )}
      </div>

      <p className="text-[11px] text-silver/30 text-center">{t.transaction.contractDisclaimer}</p>
    </div>
  );
};

export default StepContract;
