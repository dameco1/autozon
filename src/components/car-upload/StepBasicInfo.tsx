import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MAKES, FUEL_TYPES, TRANSMISSIONS, BODY_TYPES } from "./constants";
import type { CarFormData } from "./types";

interface Props {
  data: CarFormData;
  onChange: (updates: Partial<CarFormData>) => void;
}

const StepBasicInfo: React.FC<Props> = ({ data, onChange }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.make}</Label>
          <Select value={data.make} onValueChange={(v) => onChange({ make: v })}>
            <SelectTrigger className="bg-charcoal border-border text-white mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MAKES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.model}</Label>
          <Input value={data.model} onChange={(e) => onChange({ model: e.target.value })} className="bg-charcoal border-border text-white mt-1" placeholder="e.g. A4, 3 Series" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.year}</Label>
          <Input type="number" value={data.year} onChange={(e) => onChange({ year: Number(e.target.value) })} className="bg-charcoal border-border text-white mt-1" />
        </div>
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.mileage}</Label>
          <Input type="number" value={data.mileage} onChange={(e) => onChange({ mileage: Number(e.target.value) })} className="bg-charcoal border-border text-white mt-1" />
        </div>
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.powerHp}</Label>
          <Input type="number" value={data.powerHp} onChange={(e) => onChange({ powerHp: Number(e.target.value) })} className="bg-charcoal border-border text-white mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.fuelType}</Label>
          <Select value={data.fuelType} onValueChange={(v) => onChange({ fuelType: v })}>
            <SelectTrigger className="bg-charcoal border-border text-white mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.transmission}</Label>
          <Select value={data.transmission} onValueChange={(v) => onChange({ transmission: v })}>
            <SelectTrigger className="bg-charcoal border-border text-white mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TRANSMISSIONS.map((tr) => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.bodyType}</Label>
          <Select value={data.bodyType} onValueChange={(v) => onChange({ bodyType: v })}>
            <SelectTrigger className="bg-charcoal border-border text-white mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {BODY_TYPES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.color}</Label>
          <Input value={data.color} onChange={(e) => onChange({ color: e.target.value })} className="bg-charcoal border-border text-white mt-1" placeholder="e.g. Black, Silver" />
        </div>
        <div>
          <Label className="text-silver/80 text-sm">{t.carUpload.price}</Label>
          <Input type="number" value={data.price} onChange={(e) => onChange({ price: Number(e.target.value) })} className="bg-charcoal border-border text-white mt-1" />
        </div>
      </div>
      <div>
        <Label className="text-silver/80 text-sm">{t.carUpload.vin}</Label>
        <Input value={data.vin} onChange={(e) => onChange({ vin: e.target.value })} className="bg-charcoal border-border text-white mt-1" placeholder="WVWZZZ3CZWE123456" />
      </div>
    </div>
  );
};

export default StepBasicInfo;
