import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, Download, MapPin, Edit2, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateContractPdf, ContractData } from "@/lib/generateContractPdf";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  car: { make: string; model: string; year: number; vin?: string };
  agreedPrice: number;
  sellerCountry: string;
  buyerName: string;
  sellerName: string;
  transactionId: string | null;
  onContinue: (contractType: string) => void;
  role?: "buyer" | "seller";
  contractSignedSeller?: boolean;
  contractSignedBuyer?: boolean;
  onSellerSign?: () => Promise<void>;
}

const COUNTRIES = ["Austria", "Germany", "Switzerland", "Italy", "Czech Republic", "Hungary", "Slovakia", "Slovenia"];

const StepContract: React.FC<Props> = ({
  car, agreedPrice, sellerCountry, buyerName, sellerName, transactionId, onContinue,
  role = "buyer", contractSignedSeller = false, contractSignedBuyer = false, onSellerSign,
}) => {
  const { t } = useLanguage();
  const [signed, setSigned] = useState(role === "buyer" ? contractSignedBuyer : contractSignedSeller);
  const [signing, setSigning] = useState(false);
  const [country, setCountry] = useState(sellerCountry || "Austria");
  const [editingCountry, setEditingCountry] = useState(false);

  const handleSign = async () => {
    setSigning(true);
    try {
      if (role === "seller" && onSellerSign) {
        await onSellerSign();
        setSigned(true);
        return;
      }

      // Buyer signing flow — generate PDF
      const contractData: ContractData = {
        car,
        agreedPrice,
        sellerName,
        buyerName,
        sellerCountry: country,
        contractDate: new Date().toISOString(),
        transactionId: transactionId || "draft",
      };
      const doc = generateContractPdf(contractData);
      const pdfBlob = doc.output("blob");

      if (transactionId) {
        const filePath = `${transactionId}/contract.pdf`;
        const { error: uploadError } = await supabase.storage
          .from("contracts")
          .upload(filePath, pdfBlob, { contentType: "application/pdf", upsert: true });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to archive contract");
        } else {
          await supabase
            .from("transactions")
            .update({ contract_pdf_url: filePath } as any)
            .eq("id", transactionId);
        }
      }

      setSigned(true);
      toast.success(t.transaction.contractSigned || "Contract signed successfully");
    } catch (e) {
      console.error("Signing error:", e);
      toast.error("Failed to generate contract");
    } finally {
      setSigning(false);
    }
  };

  const handleDownload = () => {
    const contractData: ContractData = {
      car,
      agreedPrice,
      sellerName,
      buyerName,
      sellerCountry: country,
      contractDate: new Date().toISOString(),
      transactionId: transactionId || "draft",
    };
    const doc = generateContractPdf(contractData);
    doc.save(`autozon-contract-${(transactionId || "draft").slice(0, 8)}.pdf`);
  };

  const tt = t.transaction as any;

  return (
    <div className="space-y-6">
      {/* Signature status badges */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border ${contractSignedBuyer ? "bg-emerald-500/5 border-emerald-500/20" : "bg-secondary/50 border-border"}`}>
          <User className={`h-4 w-4 ${contractSignedBuyer ? "text-emerald-400" : "text-muted-foreground"}`} />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{t.transaction.buyer}</p>
            <p className="text-sm font-semibold text-foreground">{buyerName}</p>
          </div>
          {contractSignedBuyer ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <Clock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border ${contractSignedSeller || signed && role === "seller" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-secondary/50 border-border"}`}>
          <User className={`h-4 w-4 ${contractSignedSeller || (signed && role === "seller") ? "text-emerald-400" : "text-muted-foreground"}`} />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{t.transaction.seller}</p>
            <p className="text-sm font-semibold text-foreground">{sellerName}</p>
          </div>
          {contractSignedSeller || (signed && role === "seller") ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <Clock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </motion.div>

      {/* Country detection with override (only buyer can change) */}
      <motion.div
        className="bg-secondary/50 border border-border rounded-xl p-4 flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{t.transaction.contractCountry}</p>
          {editingCountry && role === "buyer" ? (
            <Select value={country} onValueChange={(v) => { setCountry(v); setEditingCountry(false); }}>
              <SelectTrigger className="w-48 h-8 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-foreground font-semibold">
              {country}
              {role === "buyer" && (
                <button
                  onClick={() => setEditingCountry(true)}
                  className="ml-2 text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs font-normal"
                >
                  <Edit2 className="h-3 w-3" /> {t.transaction.changeCountry || "Change"}
                </button>
              )}
            </p>
          )}
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
              <h3 className="font-display font-bold text-foreground">{t.transaction.autozonContractTitle}</h3>
              <p className="text-xs text-muted-foreground">{t.transaction.autozonContractSub}</p>
            </div>
          </div>
          {signed && <CheckCircle2 className="h-5 w-5 text-primary" />}
        </div>

        <div className="px-6 py-5 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs">{t.transaction.seller}</p>
              <p className="text-foreground font-medium">{sellerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{t.transaction.buyer}</p>
              <p className="text-foreground font-medium">{buyerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{t.transaction.vehicle}</p>
              <p className="text-foreground font-medium">{car.year} {car.make} {car.model}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{t.transaction.vinLabel}</p>
              <p className="text-foreground font-medium font-mono text-xs">{car.vin || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{t.transaction.purchasePrice}</p>
              <p className="text-primary font-display font-bold text-lg">€{agreedPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{t.transaction.contractType}</p>
              <p className="text-foreground font-medium">Autozon Kaufvertrag</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-muted-foreground text-xs mb-2">{t.transaction.keyClauses}</p>
            <ul className="space-y-1.5 text-muted-foreground text-xs">
              <li>• {t.transaction.clause1}</li>
              <li>• {t.transaction.clause2}</li>
              <li>• {t.transaction.clause3}</li>
              <li>• {t.transaction.clause4}</li>
              <li>• {t.transaction.clause5}</li>
              <li>• {t.transaction.clause6}</li>
              <li>• {t.transaction.clause7}</li>
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
            disabled={signing}
          >
            {signing ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <CheckCircle2 className="mr-2 h-5 w-5" />
            )}
            {t.transaction.signContract}
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex-1 border-border text-muted-foreground hover:bg-secondary"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" /> {t.transaction.downloadContract}
            </Button>
            {role === "buyer" && (
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6"
                onClick={() => onContinue("autozon")}
              >
                {t.transaction.continueToPayment}
              </Button>
            )}
            {role === "seller" && (
              <Button
                variant="ghost"
                className="flex-1 text-muted-foreground"
                onClick={() => window.location.href = "/dashboard"}
              >
                {t.transaction.backToDashboard}
              </Button>
            )}
          </>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground text-center">{t.transaction.contractDisclaimer}</p>
    </div>
  );
};

export default StepContract;
