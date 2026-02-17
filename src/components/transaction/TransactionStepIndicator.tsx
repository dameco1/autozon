import React from "react";
import { CheckCircle2 } from "lucide-react";

interface Step {
  label: string;
  icon: React.ReactNode;
}

interface Props {
  steps: Step[];
  currentStep: number;
}

const TransactionStepIndicator: React.FC<Props> = ({ steps, currentStep }) => (
  <div className="flex items-center justify-between mb-8">
    {steps.map((step, i) => {
      const stepNum = i + 1;
      const done = currentStep > stepNum;
      const active = currentStep === stepNum;
      return (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1.5 min-w-0">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                  ? "bg-primary/20 border-2 border-primary text-primary"
                  : "bg-secondary border border-border text-silver/40"
              }`}
            >
              {done ? <CheckCircle2 className="h-5 w-5" /> : step.icon}
            </div>
            <span
              className={`text-[11px] font-medium text-center truncate max-w-[80px] ${
                active ? "text-primary" : done ? "text-silver/70" : "text-silver/30"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mt-[-18px] ${
                currentStep > stepNum ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default TransactionStepIndicator;
