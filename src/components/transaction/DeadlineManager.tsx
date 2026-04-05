import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import type { DeadlineConfig } from "@/lib/roleWorkflow";

interface DeadlineRecord {
  id: string;
  step_type: string;
  label: string;
  deadline_at: string;
  completed_at: string | null;
  status: string;
}

interface Props {
  transactionId: string;
  deadlines: DeadlineConfig[];
  contractSignedAt: string | null;
}

const DeadlineManager: React.FC<Props> = ({ transactionId, deadlines, contractSignedAt }) => {
  const { language } = useLanguage();
  const [records, setRecords] = useState<DeadlineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  // Tick every minute for countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadDeadlines();
  }, [transactionId]);

  const loadDeadlines = async () => {
    const { data } = await supabase
      .from("transaction_deadlines")
      .select("*")
      .eq("transaction_id", transactionId)
      .order("deadline_at", { ascending: true });
    if (data) setRecords(data as DeadlineRecord[]);
    setLoading(false);
  };

  // Seed deadlines if they don't exist
  useEffect(() => {
    if (loading || records.length > 0 || !contractSignedAt) return;
    const seed = async () => {
      const signedAt = new Date(contractSignedAt);
      const rows = deadlines.map((d) => ({
        transaction_id: transactionId,
        step_type: d.step_type,
        label: language === "de" ? d.label_de : d.label,
        deadline_at: new Date(signedAt.getTime() + d.hours * 60 * 60 * 1000).toISOString(),
        status: "pending",
      }));
      if (rows.length > 0) {
        await supabase.from("transaction_deadlines").insert(rows as any);
        await loadDeadlines();
      }
    };
    seed();
  }, [loading, records.length, deadlines, transactionId, contractSignedAt, language]);

  const markComplete = async (id: string) => {
    setCompleting(id);
    try {
      await supabase
        .from("transaction_deadlines")
        .update({ completed_at: new Date().toISOString(), status: "completed" } as any)
        .eq("id", id);
      toast.success(language === "de" ? "Schritt abgeschlossen" : "Step completed");
      await loadDeadlines();
    } catch {
      toast.error("Failed to update");
    } finally {
      setCompleting(null);
    }
  };

  const formatCountdown = (deadlineAt: string): { text: string; isOverdue: boolean } => {
    const deadline = new Date(deadlineAt);
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) return { text: language === "de" ? "Überfällig" : "Overdue", isOverdue: true };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return { text: `${days}d ${remainingHours}h`, isOverdue: false };
    }
    return { text: `${hours}h`, isOverdue: false };
  };

  if (loading) {
    return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  if (records.length === 0) return null;

  const completedCount = records.filter((r) => r.status === "completed").length;

  return (
    <motion.div
      className="bg-secondary/30 border border-border rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-primary/5 border-b border-border px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="font-display font-bold text-sm text-foreground">
            {language === "de" ? "Offline-Schritte & Fristen" : "Offline Steps & Deadlines"}
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground">
          {completedCount}/{records.length}
        </span>
      </div>

      <div className="p-4 space-y-1">
        {records.map((rec, i) => {
          const { text: countdown, isOverdue } = rec.status === "completed"
            ? { text: "", isOverdue: false }
            : formatCountdown(rec.deadline_at);

          return (
            <div
              key={rec.id}
              className={`flex items-center gap-3 py-3 px-3 rounded-lg transition ${
                rec.status === "completed"
                  ? "bg-emerald-500/5"
                  : isOverdue
                  ? "bg-destructive/5"
                  : "hover:bg-secondary/30"
              }`}
            >
              {/* Step number */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                rec.status === "completed"
                  ? "bg-emerald-500/20 text-emerald-500"
                  : isOverdue
                  ? "bg-destructive/20 text-destructive"
                  : "bg-primary/10 text-primary"
              }`}>
                {rec.status === "completed" ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${rec.status === "completed" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {rec.label}
                </p>
                {rec.completed_at && (
                  <p className="text-[10px] text-muted-foreground">
                    {language === "de" ? "Erledigt am" : "Completed"} {new Date(rec.completed_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Countdown or status */}
              {rec.status !== "completed" && (
                <div className="flex items-center gap-2">
                  {isOverdue ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
                      <AlertTriangle className="h-3 w-3" /> {countdown}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">{countdown}</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-primary gap-1"
                    disabled={completing === rec.id}
                    onClick={() => markComplete(rec.id)}
                  >
                    {completing === rec.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                    {language === "de" ? "Erledigt" : "Done"}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DeadlineManager;
