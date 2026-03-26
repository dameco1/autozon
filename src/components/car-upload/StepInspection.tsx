import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { INSPECTION_CATEGORIES, type InspectionChecklist, type ChecklistAnswer } from "./inspectionChecklist";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

interface Props {
  checklist: InspectionChecklist;
  onChange: (checklist: InspectionChecklist) => void;
}

const ANSWER_OPTIONS: { value: ChecklistAnswer; iconYes: boolean }[] = [
  { value: "yes", iconYes: true },
  { value: "no", iconYes: false },
  { value: "unknown", iconYes: false },
];

const StepInspection: React.FC<Props> = ({ checklist, onChange }) => {
  const { language } = useLanguage();
  const isDE = language === "de";

  const setAnswer = (itemId: string, answer: ChecklistAnswer) => {
    onChange({ ...checklist, [itemId]: answer });
  };

  const labelMap: Record<ChecklistAnswer, { en: string; de: string }> = {
    yes: { en: "Yes", de: "Ja" },
    no: { en: "No", de: "Nein" },
    unknown: { en: "Don't know", de: "Weiß nicht" },
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {isDE ? "Fahrzeuginspektion" : "Vehicle Inspection Checklist"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isDE
            ? "Beantworten Sie jede Frage ehrlich — dies hilft Käufern und verbessert Ihre Bewertung."
            : "Answer each question honestly — this helps buyers and improves your valuation."}
        </p>
      </div>

      {INSPECTION_CATEGORIES.map((cat) => (
        <div key={cat.id} className="space-y-3">
          <h4 className="text-sm font-bold text-primary uppercase tracking-wide">
            {isDE ? cat.titleDe : cat.titleEn}
          </h4>
          <div className="space-y-2">
            {cat.items.map((item) => {
              const current = checklist[item.id];
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-muted p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <p className="text-sm text-foreground flex-1">
                    {isDE ? item.labelDe : item.labelEn}
                  </p>
                  <div className="flex gap-2 shrink-0">
                    {(["yes", "no", "unknown"] as ChecklistAnswer[]).map((ans) => {
                      const active = current === ans;
                      let btnClass = "bg-secondary/50 border-border text-muted-foreground hover:border-primary/30";
                      if (active && ans === "yes") btnClass = "bg-primary/15 border-primary text-primary";
                      if (active && ans === "no") btnClass = "bg-destructive/15 border-destructive text-destructive";
                      if (active && ans === "unknown") btnClass = "bg-amber-500/15 border-amber-500 text-amber-400";

                      return (
                        <button
                          key={ans}
                          type="button"
                          onClick={() => setAnswer(item.id, ans)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${btnClass}`}
                        >
                          {ans === "yes" && <CheckCircle2 className="h-3.5 w-3.5" />}
                          {ans === "no" && <XCircle className="h-3.5 w-3.5" />}
                          {ans === "unknown" && <HelpCircle className="h-3.5 w-3.5" />}
                          {isDE ? labelMap[ans].de : labelMap[ans].en}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepInspection;
