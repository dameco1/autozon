import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Banknote, FileText, Building2, Star, CheckCircle2, ArrowLeft, Send, ShieldCheck, AlertTriangle, TestTube2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  onContinue: (method: string, partnerId?: string) => void;
  onBack?: () => void;
  carId?: string;
  transactionId?: string;
  carTitle?: string;
}

type PaymentTab = "wire" | "card" | "credit" | "leasing";

const StepPayment: React.FC<Props> = ({ agreedPrice, partners, onContinue, onBack }) => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<PaymentTab>("wire");
  const [downPayment, setDownPayment] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(48);
  const [leaseDown, setLeaseDown] = useState(3000);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [testMode, setTestMode] = useState(false);

  const cardEligible = agreedPrice <= 10000;
  const banks = partners.filter((p) => p.type === "bank");
  const leasingCos = partners.filter((p) => p.type === "leasing");

  const calcMonthly = (rate: number) => {
    const principal = agreedPrice - downPayment;
    const r = rate / 100 / 12;
    if (r === 0) return principal / loanTerm;
    return (principal * r * Math.pow(1 + r, loanTerm)) / (Math.pow(1 + r, loanTerm) - 1);
  };

  const calcLeaseMonthly = (rate: number) => {
    const residualPct = Math.max(0.3, 1 - leaseTerm * 0.015);
    const residual = agreedPrice * residualPct;
    const depCost = (agreedPrice - leaseDown - residual) / leaseTerm;
    const financeCost = ((agreedPrice - leaseDown + residual) * (rate / 100)) / 24;
    return { monthly: depCost + financeCost, residual: Math.round(residual) };
  };

  const stripeFee = Math.round(agreedPrice * 0.029 + 0.25);
  const platformFee = Math.round(agreedPrice * 0.02);
  const totalCardCost = agreedPrice + stripeFee + platformFee;
  const sellerReceives = agreedPrice;

  const tabs: { id: PaymentTab; label: string; icon: React.ReactNode; disabled?: boolean; tooltip?: string }[] = [
    { id: "wire", label: t.transaction?.wireTransfer || "Wire Transfer", icon: <Send className="h-4 w-4" /> },
    { id: "card", label: t.transaction?.creditCard || "Credit Card", icon: <CreditCard className="h-4 w-4" />, disabled: !cardEligible, tooltip: !cardEligible ? (t.transaction?.cardMaxLimit || "Credit card only for cars ≤ €10,000") : undefined },
    { id: "credit", label: t.acquisition.creditTab, icon: <Building2 className="h-4 w-4" /> },
    { id: "leasing", label: t.acquisition.leasingTab, icon: <FileText className="h-4 w-4" /> },
  ];

  const handleTestPay = (method: string, partnerId?: string) => {
    toast.success("🧪 Test payment simulated successfully!");
    onContinue(method, partnerId);
  };

  return (
    <div className="space-y-6">
      {/* Test mode toggle */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setTestMode(!testMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            testMode
              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              : "bg-secondary/50 text-muted-foreground border border-border hover:text-muted-foreground"
          }`}
        >
          <TestTube2 className="h-3 w-3" />
          {testMode ? "Test Mode ON" : "Test Mode"}
        </button>
      </div>

      {/* Tab selector */}
      <div className="grid grid-cols-4 bg-secondary/50 border border-border rounded-xl p-1 gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => !t.disabled && setTab(t.id)}
            title={t.tooltip}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              t.disabled
                ? "text-muted-foreground cursor-not-allowed"
                : tab === t.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-muted-foreground"
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Disabled card notice */}
      {!cardEligible && tab !== "card" && (
        <p className="text-xs text-muted-foreground text-center">
          💳 {t.transaction?.cardMaxLimit || "Credit card payment is only available for vehicles priced at €10,000 or below."}
        </p>
      )}

      {/* WIRE TRANSFER */}
      {tab === "wire" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <Send className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-display font-bold text-foreground text-xl text-center mb-1">
              {t.transaction?.wireTitle || "Bank Wire Transfer"}
            </h3>
            <p className="text-3xl font-display font-black text-primary text-center mb-2">€{agreedPrice.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm text-center mb-5">
              {t.transaction?.wireDesc || "Transfer funds directly to the seller's bank account. No additional fees."}
            </p>

            {/* How it works */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {t.transaction?.howItWorks || "How It Works"}
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">1</span>
                  <div>
                    <p className="text-muted-foreground font-medium">{t.transaction?.wireStep1Title || "Contract Signed"}</p>
                    <p className="text-muted-foreground">{t.transaction?.wireStep1Desc || "After both parties sign the digital contract, the seller's bank details are securely shared with you."}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">2</span>
                  <div>
                    <p className="text-muted-foreground font-medium">{t.transaction?.wireStep2Title || "Transfer Funds"}</p>
                    <p className="text-muted-foreground">{t.transaction?.wireStep2Desc || "Use your bank's online transfer. Include the transaction reference. SEPA transfers typically arrive within 1-2 business days."}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">3</span>
                  <div>
                    <p className="text-muted-foreground font-medium">{t.transaction?.wireStep3Title || "Payment Confirmed"}</p>
                    <p className="text-muted-foreground">{t.transaction?.wireStep3Desc || "The seller confirms receipt. Vehicle handover is scheduled. Both parties are notified."}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-primary">💡 {t.transaction?.noFees || "No additional fees"}</strong> — {t.transaction?.wireNoFeesDesc || "Wire transfer has zero platform fees. You pay exactly the agreed price. Your bank may charge a small transfer fee (typically free for SEPA)."}
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6"
            onClick={() => testMode ? handleTestPay("wire") : onContinue("wire")}
          >
            {testMode && <TestTube2 className="mr-2 h-4 w-4" />}
            <CheckCircle2 className="mr-2 h-5 w-5" />
            {t.transaction?.confirmWire || "Confirm Wire Transfer"}
          </Button>
        </motion.div>
      )}

      {/* CREDIT CARD */}
      {tab === "card" && cardEligible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <CreditCard className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-display font-bold text-foreground text-xl text-center mb-1">
              {t.transaction?.cardTitle || "Credit Card Payment"}
            </h3>
            <p className="text-muted-foreground text-sm text-center mb-5">
              {t.transaction?.cardDesc || "Pay instantly with your credit or debit card via our secure payment partner Stripe."}
            </p>

            {/* Fee breakdown */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-3 mb-4">
              <h4 className="text-sm font-semibold text-foreground">{t.transaction?.feeBreakdown || "Fee Breakdown"}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.transaction?.carPrice || "Car Price"}</span>
                  <span className="text-foreground font-semibold">€{agreedPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.transaction?.processingFee || "Processing Fee"} (2.9% + €0.25)</span>
                  <span className="text-muted-foreground">€{stripeFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.transaction?.platformFee || "Platform Fee"} (2%)</span>
                  <span className="text-muted-foreground">€{platformFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-foreground font-semibold">{t.transaction?.youPay || "You Pay"}</span>
                  <span className="text-primary font-bold text-lg">€{totalCardCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* How it works for both parties */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {t.transaction?.howItWorks || "How It Works"}
              </h4>

              {/* Buyer perspective */}
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  👤 {t.transaction?.forBuyer || "For You (Buyer)"}
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• {t.transaction?.cardBuyer1 || "You'll be redirected to a secure Stripe checkout page"}</p>
                  <p>• {t.transaction?.cardBuyer2 || "Enter your card details — Visa, Mastercard, or AMEX accepted"}</p>
                  <p>• {t.transaction?.cardBuyer3 || "Payment is processed instantly and you'll be redirected back"}</p>
                  <p>• {t.transaction?.cardBuyer4 || "Your card statement will show 'AUTOZON' as the merchant"}</p>
                </div>
              </div>

              {/* Seller perspective */}
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  🏪 {t.transaction?.forSeller || "For the Seller"}
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• {t.transaction?.cardSeller1 || "The seller receives the full agreed price (€" + agreedPrice.toLocaleString() + ") — no deductions"}</p>
                  <p>• {t.transaction?.cardSeller2 || "Funds are transferred to the seller's bank account within 2-5 business days"}</p>
                  <p>• {t.transaction?.cardSeller3 || "All processing and platform fees are covered by the buyer"}</p>
                </div>
              </div>

              <div className="mt-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-yellow-400">{t.transaction?.cardNote || "Important"}</strong> — {t.transaction?.cardNoteDesc || "Credit card payment is only available for vehicles priced at €10,000 or below. For higher amounts, please use wire transfer or financing options."}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 {t.transaction?.cardSecure || "Payments are processed by Stripe, a PCI Level 1 certified payment processor. Autozon never sees your card details."}
            </p>
          </div>

          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6"
            onClick={() => testMode ? handleTestPay("card") : onContinue("card")}
          >
            {testMode && <TestTube2 className="mr-2 h-4 w-4" />}
            <CreditCard className="mr-2 h-5 w-5" />
            {testMode ? "Simulate Card Payment" : (t.transaction?.payWithCard || "Pay with Credit Card")}
          </Button>
        </motion.div>
      )}

      {/* CREDIT / FINANCING */}
      {tab === "credit" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-secondary/50 border border-border rounded-2xl p-5">
            <h3 className="font-display font-bold text-foreground mb-4">{t.acquisition.yourParams}</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t.acquisition.downPayment}</span>
                  <span className="text-foreground font-semibold">€{downPayment.toLocaleString()}</span>
                </div>
                <Slider value={[downPayment]} onValueChange={([v]) => setDownPayment(v)} min={0} max={Math.round(agreedPrice * 0.5)} step={500} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t.acquisition.loanTerm}</span>
                  <span className="text-foreground font-semibold">{loanTerm} {t.acquisition.months}</span>
                </div>
                <Slider value={[loanTerm]} onValueChange={([v]) => setLoanTerm(v)} min={12} max={84} step={6} />
              </div>
            </div>
          </div>

          {banks.map((bank, i) => {
            const monthly = calcMonthly(bank.base_rate);
            const totalCost = monthly * loanTerm + downPayment;
            return (
              <motion.div
                key={bank.id}
                className={`bg-secondary/50 border rounded-2xl p-5 ${i === 0 ? "border-primary/40" : "border-border"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {i === 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                    <Star className="h-3 w-3" /> {t.acquisition.recommended}
                  </span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-display font-bold text-foreground">{bank.name}</h4>
                      <p className="text-xs text-muted-foreground">{bank.description}</p>
                    </div>
                  </div>
                  <span className="text-lg font-display font-bold text-primary">{bank.base_rate}%</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div><p className="text-muted-foreground">{t.acquisition.monthly}</p><p className="text-foreground font-semibold">€{Math.round(monthly).toLocaleString()}/mo</p></div>
                  <div><p className="text-muted-foreground">{t.acquisition.totalCost}</p><p className="text-foreground font-semibold">€{Math.round(totalCost).toLocaleString()}</p></div>
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  onClick={() => testMode ? handleTestPay("credit", bank.id) : onContinue("credit", bank.id)}
                >
                  {testMode && <TestTube2 className="mr-2 h-4 w-4" />}
                  {t.transaction.selectFinancing}
                </Button>
              </motion.div>
            );
          })}
          {banks.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-6">{t.transaction.noPartnersYet}</p>
          )}
          <p className="text-xs text-muted-foreground text-center">{t.acquisition.ratesDisclaimer}</p>
        </motion.div>
      )}

      {/* LEASING */}
      {tab === "leasing" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-secondary/50 border border-border rounded-2xl p-5">
            <h3 className="font-display font-bold text-foreground mb-4">{t.acquisition.leaseParams}</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t.acquisition.contractLength}</span>
                  <span className="text-foreground font-semibold">{leaseTerm} {t.acquisition.months}</span>
                </div>
                <Slider value={[leaseTerm]} onValueChange={([v]) => setLeaseTerm(v)} min={12} max={60} step={6} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t.acquisition.downPayment}</span>
                  <span className="text-foreground font-semibold">€{leaseDown.toLocaleString()}</span>
                </div>
                <Slider value={[leaseDown]} onValueChange={([v]) => setLeaseDown(v)} min={0} max={Math.round(agreedPrice * 0.3)} step={500} />
              </div>
            </div>
          </div>

          {leasingCos.map((co, i) => {
            const { monthly, residual } = calcLeaseMonthly(co.base_rate);
            return (
              <motion.div
                key={co.id}
                className={`bg-secondary/50 border rounded-2xl p-5 ${i === 0 ? "border-primary/40" : "border-border"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h4 className="font-display font-bold text-foreground">{co.name}</h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div><p className="text-muted-foreground">{t.acquisition.monthly}</p><p className="text-foreground font-semibold">€{Math.round(monthly).toLocaleString()}/mo</p></div>
                  <div><p className="text-muted-foreground">{t.acquisition.residualValue}</p><p className="text-foreground font-semibold">€{residual.toLocaleString()}</p></div>
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  onClick={() => testMode ? handleTestPay("leasing", co.id) : onContinue("leasing", co.id)}
                >
                  {testMode && <TestTube2 className="mr-2 h-4 w-4" />}
                  {t.transaction.selectFinancing}
                </Button>
              </motion.div>
            );
          })}
          {leasingCos.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-6">{t.transaction.noPartnersYet}</p>
          )}
        </motion.div>
      )}

      {/* Back button */}
      {onBack && (
        <div className="text-center pt-2">
          <Button variant="ghost" className="text-muted-foreground" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.transaction?.backToContract || "Back to Contract"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepPayment;
