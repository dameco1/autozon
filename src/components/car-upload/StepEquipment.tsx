import React, { useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EQUIPMENT_LIST } from "./constants";

const EQUIPMENT_CATEGORIES: Record<string, string[]> = {
  "Safety & Assistance": EQUIPMENT_LIST.slice(0, 21),
  "Parking & Cameras": EQUIPMENT_LIST.slice(21, 28),
  "Lighting": EQUIPMENT_LIST.slice(28, 36),
  "Comfort & Seats": EQUIPMENT_LIST.slice(36, 48),
  "Climate & Glass": EQUIPMENT_LIST.slice(48, 57),
  "Infotainment": EQUIPMENT_LIST.slice(57, 73),
  "Convenience": EQUIPMENT_LIST.slice(73, 83),
  "Exterior & Performance": EQUIPMENT_LIST.slice(83, 98),
  "Storage & Practicality": EQUIPMENT_LIST.slice(98, 105),
  "Electric / Hybrid": EQUIPMENT_LIST.slice(105),
};

interface Props {
  equipment: string[];
  onToggle: (item: string) => void;
}

const StepEquipment: React.FC<Props> = ({ equipment, onToggle }) => {
  const { t } = useLanguage();

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-6">
      <div>
        <Label className="text-silver/80 text-sm mb-1 block">{t.carUpload.equipment}</Label>
        <p className="text-silver/40 text-xs mb-4">{t.carUpload.equipmentHint} — {equipment.length} selected</p>
      </div>
      {Object.entries(EQUIPMENT_CATEGORIES).map(([category, items]) => (
        <div key={category}>
          <h4 className="text-xs font-semibold text-silver/50 uppercase tracking-wider mb-2">{category}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {items.map((item) => (
              <label
                key={item}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-xs ${
                  equipment.includes(item)
                    ? "bg-primary/10 border-primary"
                    : "bg-charcoal/50 border-border hover:border-silver/30"
                }`}
              >
                <Checkbox
                  checked={equipment.includes(item)}
                  onCheckedChange={() => onToggle(item)}
                  className="h-3.5 w-3.5"
                />
                <span className={equipment.includes(item) ? "text-primary" : "text-silver/60"}>{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepEquipment;
