import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronDown, PartyPopper, ClipboardCheck, Lock, AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import congratsImage from "@/assets/congratulations-vehicle.jpg";

interface Props {
  car: { make: string; model: string; year: number };
  agreedPrice: number;
  completionMethod: string;
  contractType: string | null;
  paymentMethod: string | null;
  insuranceTier: string | null;
  carId?: string;
  fairValuePrice?: number | null;
  transactionId?: string | null;
  onDashboard: () => void;
  onDownload: () => void;
}

type OwnershipStep = {
  key: string;
  label: string;
  description: string;
  digital: boolean;
  deadlineKey?: string; // maps to a deadline step_type for countdown
};

// Deadline config embedded (matching roleWorkflow STANDARD_DEADLINES minus NoVA)
const DEADLINE_MAP: Record<string, number> = {
  vehicle_inspection: 72,       // 3 days
  vehicle_handover: 336,        // 14 days
  buyer_registration: 168,      // 7 days
};

const StepComplete: React.FC<Props> = ({
  car, agreedPrice, completionMethod, contractType, paymentMethod, insuranceTier,
  carId, fairValuePrice, transactionId, onDashboard, onDownload,
}) => {
  const { t } = useLanguage();

  const contractLabel = contractType === "autozon" ? "Autozon" : contractType === "oeamtc" ? "ÖAMTC" : contractType === "adac" ? "ADAC" : "Autozon";
  const paymentLabel = paymentMethod === "cash"
    ? t.transaction.cashPayment
    : paymentMethod === "credit"
    ? t.acquisition.creditTab
    : paymentMethod === "leasing"
    ? t.acquisition.leasingTab
    : paymentMethod === "card"
    ? "Card Payment"
    : "—";
  const insuranceLabel = insuranceTier === "liability"
    ? t.acquisition.liability
    : insuranceTier === "partial"
    ? t.acquisition.partialCover
    : insuranceTier === "comprehensive"
    ? t.acquisition.comprehensive
    : t.transaction.noInsurance;

  // Ownership transfer steps — everything in one checklist
  const ownershipSteps: OwnershipStep[] = [
    { key: "kyc_verified", label: "Government-issued ID (verified via KYC)", description: "Identity verified through KYC process", digital: true },
    { key: "contract_signed", label: `Purchase Contract Signed — ${contractLabel}`, description: `${contractLabel} Kaufvertrag`, digital: true },
    { key: "countersigned", label: "Countersigned Contract Issued", description: "Both parties have signed", digital: true },
    { key: "payment_done", label: `Payment Completed (${paymentLabel} — €${agreedPrice.toLocaleString()})`, description: paymentMethod === "card" ? "Stripe payment confirmed" : paymentMethod === "credit" ? "Financing partner confirmed" : paymentMethod === "leasing" ? "Leasing partner confirmed" : "Bank transfer confirmed", digital: paymentMethod === "card" },
    { key: "insurance_arranged", label: `Insurance: ${insuranceLabel}`, description: insuranceTier ? "Insurance coverage active" : "Buyer arranging independently", digital: !!insuranceTier },
    { key: "vehicle_inspection", label: "Vehicle Inspection Completed", description: "Buyer has inspected the vehicle", digital: false, deadlineKey: "vehicle_inspection" },
    { key: "vehicle_handover", label: "Vehicle Handover", description: "Keys, documents, and vehicle handed over", digital: false, deadlineKey: "vehicle_handover" },
    { key: "deregistration", label: "Seller Deregistration (Abmeldung)", description: "Seller deregistered vehicle at Zulassungsstelle", digital: false },
    { key: "buyer_registration", label: "Buyer Registration (Anmeldung)", description: "New registration at Zulassungsstelle", digital: false, deadlineKey: "buyer_registration" },
    { key: "plates_received", label: "Registration Plates Received", description: "New plates mounted on vehicle", digital: false },
    { key: "registration_cert", label: "Registration Certificate Part I & II", description: "Zulassungsschein Teil I & II in buyer's name", digital: false },
  ];

  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [deadlines, setDeadlines] = useState<Record<string, { deadline_at: string; id: string }>>({});
  const [saving, setSaving] = useState(false);
  const [now, setNow] = useState(new Date());

  // Tick every minute for countdowns
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Load saved progress and deadlines
  useEffect(() => {
    if (!transactionId) return;
    const load = async () => {
      const { data } = await supabase
        .from("transaction_deadlines")
        .select("step_type, status, deadline_at, id")
        .eq("transaction_id", transactionId);
      if (data) {
        const map: Record<string, boolean> = {};
        const dlMap: Record<string, { deadline_at: string; id: string }> = {};
        data.forEach(d => {
          map[d.step_type] = d.status === "completed";
          dlMap[d.step_type] = { deadline_at: d.deadline_at, id: d.id };
        });
        setCheckedSteps(map);
        setDeadlines(dlMap);
      }
    };
    load();
  }, [transactionId]);

  const isStepChecked = (step: OwnershipStep) => {
    if (step.digital) return true;
    return !!checkedSteps[step.key];
  };

  const ownershipComplete = ownershipSteps.every(s => isStepChecked(s));

  const formatCountdown = (deadlineAt: string): { text: string; isOverdue: boolean } => {
    const diff = new Date(deadlineAt).getTime() - now.getTime();
    if (diff <= 0) return { text: "Overdue", isOverdue: true };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const rem = hours % 24;
    return { text: days > 0 ? `${days}d ${rem}h` : `${hours}h`, isOverdue: false };
  };

  const handleCheckStep = async (stepKey: string) => {
    if (!transactionId) return;
    if (checkedSteps[stepKey]) return;

    setSaving(true);
    const { data: existing } = await supabase
      .from("transaction_deadlines")
      .select("id")
      .eq("transaction_id", transactionId)
      .eq("step_type", stepKey)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("transaction_deadlines")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("transaction_deadlines")
        .insert({
          transaction_id: transactionId,
          step_type: stepKey,
          label: ownershipSteps.find(s => s.key === stepKey)?.label || stepKey,
          deadline_at: new Date(Date.now() + (DEADLINE_MAP[stepKey] || 336) * 60 * 60 * 1000).toISOString(),
          status: "completed",
          completed_at: new Date().toISOString(),
        } as any);
    }

    setCheckedSteps(prev => ({ ...prev, [stepKey]: true }));
    setSaving(false);
    toast.success("Step marked as completed");
  };

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Header */}
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

      {/* Summary — Vehicle + Price only */}
      <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-left mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">{t.transaction.vehicle}</span>
          <span className="text-foreground font-bold">{car.year} {car.make} {car.model}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">{t.transaction.purchasePrice}</span>
          <span className="text-primary font-display font-black text-xl">€{agreedPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Ownership Transfer Checklist — everything consolidated */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-left mb-6">
        <h3 className="font-display font-bold text-foreground mb-2 text-lg flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" /> Ownership Transfer Checklist
        </h3>
        <p className="text-muted-foreground text-sm mb-5">
          Complete all steps to finalize the ownership transfer. Digital steps are managed automatically. Manual steps require buyer confirmation and cannot be reversed.
        </p>

        <div className="space-y-3">
          {ownershipSteps.map((step) => {
            const checked = isStepChecked(step);
            const dl = step.deadlineKey ? deadlines[step.deadlineKey] || deadlines[step.key] : null;
            const countdown = dl && !checked ? formatCountdown(dl.deadline_at) : null;

            return (
              <div
                key={step.key}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                  checked
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : countdown?.isOverdue
                    ? "bg-destructive/5 border-destructive/20"
                    : "bg-background/50 border-border/50"
                }`}
              >
                {step.digital ? (
                  <div className="mt-0.5 flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      {step.key === "kyc_verified" ? (
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-0.5 flex-shrink-0">
                    <Checkbox
                      checked={checked}
                      disabled={checked || saving}
                      onCheckedChange={() => handleCheckStep(step.key)}
                      className={checked ? "border-emerald-500 bg-emerald-500 text-white" : ""}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium ${checked ? "text-emerald-600 line-through" : "text-foreground"}`}>
                      {step.label}
                    </span>
                    {step.digital && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                        <Lock className="h-2.5 w-2.5" /> Auto
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
                {/* Countdown timer or completed check */}
                <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                  {checked ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : countdown ? (
                    countdown.isOverdue ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
                        <AlertTriangle className="h-3 w-3" /> {countdown.text}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                        <Clock className="h-3 w-3" /> {countdown.text}
                      </span>
                    )
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="mt-5 pt-4 border-t border-primary/10">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">
              {ownershipSteps.filter(s => isStepChecked(s)).length}/{ownershipSteps.length} completed
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
              style={{ width: `${(ownershipSteps.filter(s => isStepChecked(s)).length / ownershipSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Congratulations image — shown only when ownership transfer is complete */}
      {ownershipComplete && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-br from-primary/10 via-amber-50/50 to-emerald-50/50 border border-primary/20 rounded-2xl p-6 text-center">
            <img
              src={congratsImage}
              alt="Congratulations on your new vehicle purchase"
              className="w-full max-w-md mx-auto rounded-xl mb-4"
              loading="lazy"
              width={1024}
              height={512}
            />
            <h3 className="text-2xl font-display font-black text-foreground mb-2">
              🎉 Congratulations on Your New {car.make} {car.model}!
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Ownership transfer is complete. This vehicle is now officially yours. Enjoy the ride!
            </p>
            <CompleteBadge />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const CompleteBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
    <CheckCircle2 className="h-3.5 w-3.5" /> Ownership Transfer Completed
  </span>
);

export default StepComplete;
