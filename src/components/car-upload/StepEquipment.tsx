import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EQUIPMENT_LIST } from "./constants";

interface Props {
  equipment: string[];
  onToggle: (item: string) => void;
}

const StepEquipment: React.FC<Props> = ({ equipment, onToggle }) => {
  const { t } = useLanguage();

  return (
    <div>
      <Label className="text-silver/80 text-sm mb-1 block">{t.carUpload.equipment}</Label>
      <p className="text-silver/40 text-xs mb-4">{t.carUpload.equipmentHint}</p>
      <div className="grid grid-cols-2 gap-2">
        {EQUIPMENT_LIST.map((item) => (
          <label
            key={item}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
              equipment.includes(item)
                ? "bg-primary/10 border-primary"
                : "bg-charcoal/50 border-border hover:border-silver/30"
            }`}
          >
            <Checkbox
              checked={equipment.includes(item)}
              onCheckedChange={() => onToggle(item)}
            />
            <span className={`text-sm ${equipment.includes(item) ? "text-primary" : "text-silver/60"}`}>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StepEquipment;
