import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScanSearch } from "lucide-react";
import { EQUIPMENT_LIST } from "./constants";

const EQUIPMENT_CATEGORIES: Record<string, string[]> = {
  "Safety & Assistance": EQUIPMENT_LIST.slice(0, 21),
  "Parking & Cameras": EQUIPMENT_LIST.slice(21, 28),
  "Lighting": EQUIPMENT_LIST.slice(28, 37),
  "Comfort & Seats": EQUIPMENT_LIST.slice(37, 49),
  "Climate & Glass": EQUIPMENT_LIST.slice(49, 58),
  "Infotainment": EQUIPMENT_LIST.slice(58, 74),
  "Convenience": EQUIPMENT_LIST.slice(74, 84),
  "Exterior & Performance": EQUIPMENT_LIST.slice(84, 99),
  "Storage & Practicality": EQUIPMENT_LIST.slice(99, 106),
  "Electric / Hybrid": EQUIPMENT_LIST.slice(106),
};

interface Props {
  equipment: string[];
  onToggle: (item: string) => void;
  vinSuggestedEquipment?: string[];
}

const StepEquipment: React.FC<Props> = ({ equipment, onToggle, vinSuggestedEquipment = [] }) => {
  const { t } = useLanguage();

  const vinSuggestedCount = vinSuggestedEquipment.filter((e) => equipment.includes(e)).length;

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-6">
      <div>
        <Label className="text-muted-foreground text-sm mb-1 block">{t.carUpload.equipment}</Label>
        <p className="text-muted-foreground text-xs mb-2">{t.carUpload.equipmentHint} — {equipment.length} selected</p>
        {vinSuggestedCount > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary gap-1">
              <ScanSearch className="h-3 w-3" /> {vinSuggestedCount} auto-selected from VIN
            </Badge>
            <span className="text-muted-foreground text-xs">— review and adjust as needed</span>
          </div>
        )}
      </div>
      {Object.entries(EQUIPMENT_CATEGORIES).map(([category, items]) => (
        <div key={category}>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{category}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {items.map((item) => {
              const isVinSuggested = vinSuggestedEquipment.includes(item);
              const isSelected = equipment.includes(item);
              return (
                <label
                  key={item}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-xs ${
                    isSelected
                      ? isVinSuggested
                        ? "bg-primary/15 border-primary ring-1 ring-primary/20"
                        : "bg-primary/10 border-primary"
                      : "bg-muted border-border hover:border-primary/30"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(item)}
                    className="h-3.5 w-3.5"
                  />
                  <span className={isSelected ? "text-primary" : "text-muted-foreground"}>{item}</span>
                  {isVinSuggested && isSelected && (
                    <ScanSearch className="h-3 w-3 text-primary/60 ml-auto flex-shrink-0" />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepEquipment;
