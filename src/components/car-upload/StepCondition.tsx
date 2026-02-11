import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CarFormData } from "./types";

interface Props {
  data: CarFormData;
  onChange: (updates: Partial<CarFormData>) => void;
}

const StepCondition: React.FC<Props> = ({ data, onChange }) => {
  const { t } = useLanguage();

  const conditionLabel = (val: number) => {
    if (val >= 90) return t.carUpload.conditionScale.excellent;
    if (val >= 70) return t.carUpload.conditionScale.good;
    if (val >= 50) return t.carUpload.conditionScale.fair;
    return t.carUpload.conditionScale.poor;
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-silver/80 text-sm mb-3 block">
          {t.carUpload.conditionExterior}: <span className="text-primary font-bold">{data.conditionExterior}/100</span> — {conditionLabel(data.conditionExterior)}
        </Label>
        <input
          type="range"
          min={10}
          max={100}
          value={data.conditionExterior}
          onChange={(e) => onChange({ conditionExterior: Number(e.target.value) })}
          className="w-full accent-[hsl(155,100%,42%)]"
        />
      </div>
      <div>
        <Label className="text-silver/80 text-sm mb-3 block">
          {t.carUpload.conditionInterior}: <span className="text-primary font-bold">{data.conditionInterior}/100</span> — {conditionLabel(data.conditionInterior)}
        </Label>
        <input
          type="range"
          min={10}
          max={100}
          value={data.conditionInterior}
          onChange={(e) => onChange({ conditionInterior: Number(e.target.value) })}
          className="w-full accent-[hsl(155,100%,42%)]"
        />
      </div>
      <div>
        <Label className="text-silver/80 text-sm mb-3 block">{t.carUpload.accidentHistory}</Label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onChange({ accidentHistory: true })}
            className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${
              data.accidentHistory ? "bg-destructive/10 border-destructive text-destructive" : "bg-charcoal/50 border-border text-silver/60"
            }`}
          >
            {t.carUpload.accidentYes}
          </button>
          <button
            type="button"
            onClick={() => onChange({ accidentHistory: false, accidentDetails: "" })}
            className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${
              !data.accidentHistory ? "bg-primary/10 border-primary text-primary" : "bg-charcoal/50 border-border text-silver/60"
            }`}
          >
            {t.carUpload.accidentNo}
          </button>
        </div>
      </div>
      {data.accidentHistory && (
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.accidentDetails}</Label>
          <Textarea
            value={data.accidentDetails}
            onChange={(e) => onChange({ accidentDetails: e.target.value })}
            className="bg-charcoal border-border text-white mt-1"
            rows={3}
          />
        </div>
      )}
      <div>
        <Label className="text-silver/80 text-sm">{t.carUpload.description}</Label>
        <Textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="bg-charcoal border-border text-white mt-1"
          rows={3}
        />
      </div>
    </div>
  );
};

export default StepCondition;
