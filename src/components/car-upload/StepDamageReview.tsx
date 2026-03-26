import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, XCircle, HelpCircle, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import type { DetectedDamage, DamageReport } from "./damageTypes";

interface Props {
  report: DamageReport | null;
  analyzing: boolean;
  onConfirm: (index: number) => void;
  onDismiss: (index: number) => void;
  onRunAnalysis: () => void;
  hasPhotos: boolean;
}

const severityColor: Record<string, string> = {
  low: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  medium: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  high: "bg-destructive/10 text-destructive border-destructive/30",
};

const typeIcons: Record<string, string> = {
  scratch: "🔧",
  dent: "💥",
  rust: "🟤",
  crack: "⚡",
  paint_damage: "🎨",
  broken_part: "🔨",
  wear: "⏳",
  other: "❓",
};

const StepDamageReview: React.FC<Props> = ({
  report,
  analyzing,
  onConfirm,
  onDismiss,
  onRunAnalysis,
  hasPhotos,
}) => {
  const { t } = useLanguage();

  if (!hasPhotos) {
    return (
      <div className="text-center py-8">
        <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">{t.carUpload.damage.noPhotos}</p>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-10 w-10 text-primary mx-auto mb-4 animate-spin" />
        <p className="text-foreground font-medium">{t.carUpload.damage.analyzing}</p>
        <p className="text-muted-foreground text-sm mt-2">{t.carUpload.damage.analyzingHint}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-8">
        <ShieldAlert className="h-12 w-12 text-primary/40 mx-auto mb-4" />
        <p className="text-muted-foreground text-sm mb-4">{t.carUpload.damage.readyToScan}</p>
        <Button onClick={onRunAnalysis} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <ShieldAlert className="mr-2 h-4 w-4" />
          {t.carUpload.damage.scanButton}
        </Button>
      </div>
    );
  }

  const confirmed = report.damages.filter((d) => d.confirmed === true).length;
  const dismissed = report.damages.filter((d) => d.confirmed === false).length;
  const needsReview = report.damages.filter((d) => d.confirmed === undefined && d.confidence < 0.6).length;

  return (
    <div className="space-y-5">
      {/* Summary card */}
      <div className="bg-muted rounded-xl border border-border p-4">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-foreground font-medium">{t.carUpload.damage.resultTitle}</span>
        </div>
        <p className="text-muted-foreground text-sm">{report.summary}</p>
        <div className="flex gap-3 mt-3">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            {report.damages.length} {t.carUpload.damage.found}
          </Badge>
          {confirmed > 0 && (
            <Badge variant="outline" className="text-xs border-destructive/30 text-destructive">
              {confirmed} {t.carUpload.damage.confirmed}
            </Badge>
          )}
          {dismissed > 0 && (
            <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
              {dismissed} {t.carUpload.damage.dismissed}
            </Badge>
          )}
        </div>
      </div>

      {/* Damage list */}
      {report.damages.length === 0 ? (
        <div className="text-center py-6">
          <ShieldCheck className="h-10 w-10 text-green-400 mx-auto mb-3" />
          <p className="text-green-400 font-medium">{t.carUpload.damage.noDamage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {report.damages.map((damage, i) => {
            const needsConfirm = damage.confidence < 0.6 && damage.confirmed === undefined;
            return (
              <div
                key={i}
                className={`rounded-xl border p-4 transition-all ${
                  damage.confirmed === false
                    ? "border-green-500/20 bg-green-500/5 opacity-60"
                    : damage.confirmed === true
                    ? "border-destructive/20 bg-destructive/5"
                    : needsConfirm
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "border-border bg-muted/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{typeIcons[damage.type] ?? "❓"}</span>
                      <span className="text-foreground font-medium text-sm capitalize">
                        {damage.type.replace("_", " ")}
                      </span>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${severityColor[damage.severity]}`}>
                        {damage.severity}
                      </Badge>
                      {needsConfirm && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-yellow-500/30 text-yellow-400">
                          <HelpCircle className="h-2.5 w-2.5 mr-0.5" />
                          {t.carUpload.damage.needsReview}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs mb-1">{damage.location}</p>
                    <p className="text-muted-foreground text-sm">{damage.description}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-muted-foreground text-[10px]">{t.carUpload.damage.confidence}:</span>
                      <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            damage.confidence >= 0.8 ? "bg-primary" : damage.confidence >= 0.6 ? "bg-yellow-400" : "bg-orange-400"
                          }`}
                          style={{ width: `${damage.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground text-[10px]">{Math.round(damage.confidence * 100)}%</span>
                    </div>
                  </div>

                  {/* Confirm / Dismiss buttons */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {damage.confirmed === undefined ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onConfirm(i)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs hover:bg-destructive/10 transition-colors"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          {t.carUpload.damage.yesItsDamage}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDismiss(i)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 text-xs hover:bg-green-500/10 transition-colors"
                        >
                          <XCircle className="h-3 w-3" />
                          {t.carUpload.damage.notDamage}
                        </button>
                      </>
                    ) : damage.confirmed ? (
                      <span className="flex items-center gap-1 text-destructive text-xs">
                        <AlertTriangle className="h-3 w-3" /> {t.carUpload.damage.confirmed}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-400 text-xs">
                        <CheckCircle2 className="h-3 w-3" /> {t.carUpload.damage.dismissed}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Re-scan button */}
      <div className="text-center pt-2">
        <Button variant="ghost" size="sm" onClick={onRunAnalysis} className="text-muted-foreground text-xs">
          {t.carUpload.damage.rescan}
        </Button>
      </div>
    </div>
  );
};

export default StepDamageReview;
