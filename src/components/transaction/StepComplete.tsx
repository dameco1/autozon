import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronDown, PartyPopper, ClipboardCheck, Lock, AlertTriangle, Clock, ShieldCheck, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  deadlineKey?: string;
};

// Hours from contract signing (Step 5 entry) — all timers run in parallel
const DEADLINE_HOURS: Record<string, number> = {
  vehicle_inspection: 72,        // 3 days
  buyer_insurance: 120,          // 5 days
  deregistration: 120,           // 5 days
  buyer_registration: 288,       // 12 days
  plates_received: 312,          // 13 days
  registration_cert: 312,        // 13 days (issued at registration)
  vehicle_handover: 384,         // 16 days
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
    ? t.transaction.cardPayment
    : "—";
  const insuranceLabel = insuranceTier === "liability"
    ? t.acquisition.liability
    : insuranceTier === "partial"
    ? t.acquisition.partialCover
    : insuranceTier === "comprehensive"
    ? t.acquisition.comprehensive
    : t.transaction.noInsurance;

  const paymentDesc = paymentMethod === "card"
    ? t.transaction.stepPaymentStripe
    : paymentMethod === "credit"
    ? t.transaction.stepPaymentCredit
    : paymentMethod === "leasing"
    ? t.transaction.stepPaymentLeasing
    : t.transaction.stepPaymentBank;

  const ownershipSteps: OwnershipStep[] = [
    // Digital steps (auto-completed)
    { key: "kyc_verified", label: t.transaction.stepKycVerified, description: t.transaction.stepKycVerifiedDesc, digital: true },
    { key: "contract_signed", label: `${t.transaction.stepContractSigned} — ${contractLabel}`, description: `${contractLabel} Kaufvertrag`, digital: true },
    { key: "countersigned", label: t.transaction.stepCountersigned, description: t.transaction.stepCountersignedDesc, digital: true },
    { key: "payment_done", label: `${t.transaction.stepPaymentDone} (${paymentLabel} — €${agreedPrice.toLocaleString()})`, description: paymentDesc, digital: paymentMethod === "card" },
    // Manual steps in Austrian legal order
    { key: "vehicle_inspection", label: t.transaction.stepVehicleInspection, description: t.transaction.stepVehicleInspectionDesc, digital: false, deadlineKey: "vehicle_inspection" },
    { key: "buyer_insurance", label: t.transaction.stepBuyerInsurance, description: t.transaction.stepBuyerInsuranceDesc, digital: false, deadlineKey: "buyer_insurance" },
    { key: "deregistration", label: t.transaction.stepDeregistration, description: t.transaction.stepDeregistrationDesc, digital: false, deadlineKey: "deregistration" },
    { key: "buyer_registration", label: t.transaction.stepBuyerRegistration, description: t.transaction.stepBuyerRegistrationDesc, digital: false, deadlineKey: "buyer_registration" },
    { key: "plates_received", label: t.transaction.stepPlatesReceived, description: t.transaction.stepPlatesReceivedDesc, digital: false, deadlineKey: "plates_received" },
    { key: "registration_cert", label: t.transaction.stepRegistrationCert, description: t.transaction.stepRegistrationCertDesc, digital: false, deadlineKey: "registration_cert" },
    { key: "vehicle_handover", label: t.transaction.stepVehicleHandover, description: t.transaction.stepVehicleHandoverDesc, digital: false, deadlineKey: "vehicle_handover" },
  ];

  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [deadlines, setDeadlines] = useState<Record<string, { deadline_at: string; id: string }>>({});
  const [saving, setSaving] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!transactionId) return;
    const load = async () => {
      const { data } = await supabase
        .from("transaction_deadlines")
        .select("step_type, status, deadline_at, id")
        .eq("transaction_id", transactionId);
      const map: Record<string, boolean> = {};
      const dlMap: Record<string, { deadline_at: string; id: string }> = {};
      if (data) {
        data.forEach(d => {
          map[d.step_type] = d.status === "completed";
          dlMap[d.step_type] = { deadline_at: d.deadline_at, id: d.id };
        });
      }
      setCheckedSteps(map);
      setDeadlines(dlMap);

      // Seed missing deadlines — all timers start from now (Step 5 entry / contract signing)
      const manualWithDeadline = ownershipSteps.filter(s => !s.digital && s.deadlineKey);
      const missingDeadlines = manualWithDeadline.filter(s => !data?.find(d => d.step_type === s.key));
      if (missingDeadlines.length > 0) {
        const baseTime = Date.now();
        const rows = missingDeadlines.map(s => ({
          transaction_id: transactionId,
          step_type: s.key,
          label: s.label,
          deadline_at: new Date(baseTime + (DEADLINE_HOURS[s.key] || 72) * 60 * 60 * 1000).toISOString(),
          status: "pending",
        }));
        const { data: inserted } = await supabase.from("transaction_deadlines").insert(rows as any).select("step_type, deadline_at, id");
        if (inserted) {
          const newDlMap = { ...dlMap };
          inserted.forEach((d: any) => { newDlMap[d.step_type] = { deadline_at: d.deadline_at, id: d.id }; });
          setDeadlines(newDlMap);
        }
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
    if (diff <= 0) return { text: t.transaction.overdue, isOverdue: true };
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
          deadline_at: new Date(Date.now() + (DEADLINE_HOURS[stepKey] || 72) * 60 * 60 * 1000).toISOString(),
          status: "completed",
          completed_at: new Date().toISOString(),
        } as any);
    }

    setCheckedSteps(prev => ({ ...prev, [stepKey]: true }));
    setSaving(false);
    toast.success(t.transaction.stepMarkedComplete);
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
          <ChevronDown className="mr-2 h-5 w-5 animate-bounce" /> {t.transaction.viewContractNextSteps}
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

      {/* Ownership Transfer Checklist */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-left mb-6">
        <h3 className="font-display font-bold text-foreground mb-2 text-lg flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" /> {t.transaction.ownershipChecklistTitle}
        </h3>
        <p className="text-muted-foreground text-sm mb-5">
          {t.transaction.ownershipChecklistDesc}
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
                        <Lock className="h-2.5 w-2.5" /> {t.transaction.autoLabel}
                      </span>
                    )}
                    {checked && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  {!checked && countdown && (
                    <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 space-y-1">
                      <div className="flex items-center gap-2">
                        {countdown.isOverdue ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
                            <AlertTriangle className="h-3.5 w-3.5" /> {countdown.text}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                            <Clock className="h-3.5 w-3.5" /> {countdown.text}
                          </span>
                        )}
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted hover:bg-muted-foreground/10 transition-colors" aria-label={t.transaction.deadlineInfoTitle}>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 text-left" side="top" align="start">
                            <h4 className="font-semibold text-sm text-foreground mb-1">{t.transaction.deadlineInfoTitle}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{t.transaction.deadlineInfoBody}</p>
                            <h5 className="font-semibold text-xs text-foreground mb-1">{t.transaction.deadlineInfoCostTitle}</h5>
                            <p className="text-xs text-muted-foreground">
                              {paymentMethod === "card" ? t.transaction.deadlineInfoCostCard : t.transaction.deadlineInfoCostOther}
                            </p>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <p className="text-[11px] leading-tight text-muted-foreground">
                        {countdown.isOverdue
                          ? t.transaction.deadlineOverdueWarning
                          : t.transaction.deadlineWarning.replace("{countdown}", countdown.text)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="mt-5 pt-4 border-t border-primary/10">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">{t.transaction.ownershipProgress}</span>
            <span className="font-semibold text-foreground">
              {ownershipSteps.filter(s => isStepChecked(s)).length}/{ownershipSteps.length} {t.transaction.ownershipCompleted}
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

      {/* Congratulations — shown only when ownership transfer is complete */}
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
              🎉 {t.transaction.congratsTitle} {car.make} {car.model}!
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t.transaction.congratsSubtitle}
            </p>
            <CompleteBadge label={t.transaction.ownershipTransferCompleted} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const CompleteBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
    <CheckCircle2 className="h-3.5 w-3.5" /> {label}
  </span>
);

export default StepComplete;
