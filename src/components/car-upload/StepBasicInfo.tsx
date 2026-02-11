import React, { useEffect, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { COLORS } from "./constants";
import { useCarMakes, useCarModels, useCarVariants } from "@/hooks/useCarModels";
import type { CarFormData } from "./types";

interface Props {
  data: CarFormData;
  onChange: (updates: Partial<CarFormData>) => void;
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

const StepBasicInfo: React.FC<Props> = ({ data, onChange }) => {
  const { t } = useLanguage();

  const { data: makes = [], isLoading: makesLoading } = useCarMakes();
  const { data: models = [], isLoading: modelsLoading } = useCarModels(data.make);
  const { data: variants = [], isLoading: variantsLoading } = useCarVariants(data.make, data.model);

  // Auto-fill specs when variant is selected
  const selectedVariant = useMemo(
    () => variants.find((v) => v.variant === data.variant),
    [variants, data.variant]
  );

  useEffect(() => {
    if (selectedVariant) {
      onChange({
        powerHp: selectedVariant.power_hp,
        fuelType: selectedVariant.fuel_type,
        transmission: selectedVariant.transmission,
        bodyType: selectedVariant.body_type,
      });
    }
  }, [selectedVariant]);

  // Reset dependent fields on parent change
  const handleMakeChange = (make: string) => {
    onChange({ make, model: "", variant: "", powerHp: 0, fuelType: "Petrol", transmission: "Manual", bodyType: "Sedan" });
  };

  const handleModelChange = (model: string) => {
    onChange({ model, variant: "", powerHp: 0, fuelType: "Petrol", transmission: "Manual", bodyType: "Sedan" });
  };

  return (
    <div className="space-y-5">
      {/* Make → Model → Variant cascade */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.make}</Label>
          <Select value={data.make} onValueChange={handleMakeChange}>
            <SelectTrigger className="bg-charcoal border-border text-white mt-1">
              <SelectValue placeholder={makesLoading ? "Loading..." : "Select make"} />
            </SelectTrigger>
            <SelectContent>
              {makes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.model}</Label>
          <Select value={data.model} onValueChange={handleModelChange} disabled={!data.make}>
            <SelectTrigger className="bg-charcoal border-border text-white mt-1">
              <SelectValue placeholder={modelsLoading ? "Loading..." : "Select model"} />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-silver/80 text-sm">Variant</Label>
          <Select value={data.variant} onValueChange={(v) => onChange({ variant: v })} disabled={!data.model}>
            <SelectTrigger className="bg-charcoal border-border text-white mt-1">
              <SelectValue placeholder={variantsLoading ? "Loading..." : "Select variant"} />
            </SelectTrigger>
            <SelectContent>
              {variants.map((v) => <SelectItem key={v.id} value={v.variant}>{v.variant} ({v.power_hp} HP)</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Auto-filled specs */}
      {data.variant && selectedVariant && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">{selectedVariant.power_hp} HP</Badge>
          <Badge variant="secondary" className="text-xs">{selectedVariant.fuel_type}</Badge>
          <Badge variant="secondary" className="text-xs">{selectedVariant.transmission}</Badge>
          <Badge variant="secondary" className="text-xs">{selectedVariant.body_type}</Badge>
        </div>
      )}

      {/* Year, Mileage, Color */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.year}</Label>
          <Select value={String(data.year)} onValueChange={(v) => onChange({ year: Number(v) })}>
            <SelectTrigger className="bg-charcoal border-border text-white mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.mileage}</Label>
          <Input type="number" value={data.mileage} onChange={(e) => onChange({ mileage: Number(e.target.value) })} className="bg-charcoal border-border text-white mt-1" />
        </div>
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.color}</Label>
          <Select value={data.color} onValueChange={(v) => onChange({ color: v })}>
            <SelectTrigger className="bg-charcoal border-border text-white mt-1"><SelectValue placeholder="Select color" /></SelectTrigger>
            <SelectContent>
              {COLORS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price + VIN */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.price}</Label>
          <Input type="number" value={data.price} onChange={(e) => onChange({ price: Number(e.target.value) })} className="bg-charcoal border-border text-white mt-1" />
        </div>
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.vin}</Label>
          <Input value={data.vin} onChange={(e) => onChange({ vin: e.target.value })} className="bg-charcoal border-border text-white mt-1" placeholder="WVWZZZ3CZWE123456" />
        </div>
      </div>
    </div>
  );
};

export default StepBasicInfo;
