import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { COLORS } from "./constants";
import { useCarMakes, useCarModels, useCarVariants } from "@/hooks/useCarModels";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScanSearch, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import type { CarFormData } from "./types";

interface Props {
  data: CarFormData;
  onChange: (updates: Partial<CarFormData>) => void;
  onVinEquipmentSuggested?: (equipment: string[]) => void;
  onStolenDetected?: (stolen: boolean) => void;
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

const StepBasicInfo: React.FC<Props> = ({ data, onChange, onVinEquipmentSuggested, onStolenDetected }) => {
  const { t } = useLanguage();
  const [vinDecoding, setVinDecoding] = useState(false);
  const [vinDecoded, setVinDecoded] = useState(false);
  const [stolenWarning, setStolenWarning] = useState<{ stolen: boolean; details?: string | null }>({ stolen: false });

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

  const handleVinDecode = async () => {
    if (!data.vin || data.vin.length < 11) {
      toast.error("Please enter a valid VIN (at least 11 characters)");
      return;
    }
    setVinDecoding(true);
    setVinDecoded(false);
    try {
      const { data: result, error } = await supabase.functions.invoke("vin-decode", {
        body: { vin: data.vin },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      // Auto-fill form fields from decoded VIN
      const updates: Partial<CarFormData> = {};
      if (result.make) updates.make = result.make;
      if (result.model) updates.model = result.model;
      if (result.year) updates.year = result.year;
      if (result.body_type) updates.bodyType = result.body_type;
      if (result.fuel_type) updates.fuelType = result.fuel_type;
      if (result.transmission) updates.transmission = result.transmission;
      if (result.power_hp) updates.powerHp = result.power_hp;

      // Merge suggested equipment with existing (don't overwrite user selections)
      if (result.suggested_equipment?.length > 0) {
        const merged = [...new Set([...data.equipment, ...result.suggested_equipment])];
        updates.equipment = merged;
        onVinEquipmentSuggested?.(result.suggested_equipment);
      }

      onChange(updates);
      setVinDecoded(true);

      // Handle stolen check
      if (result.stolen) {
        setStolenWarning({ stolen: true, details: result.stolen_details });
        onStolenDetected?.(true);
        toast.error("⚠️ Stolen Vehicle Alert", {
          description: result.stolen_details || "This VIN has been flagged in a stolen vehicle database.",
          duration: 10000,
        });
        return; // Don't show success toast
      } else {
        setStolenWarning({ stolen: false });
        onStolenDetected?.(false);
      }

      const confidenceMsg = result.confidence === "high"
        ? "High confidence decode"
        : result.confidence === "medium"
          ? "Medium confidence — please verify"
          : "Low confidence — please review all fields";
      
      toast.success(`VIN decoded: ${result.year} ${result.make} ${result.model}`, {
        description: `${confidenceMsg}${result.notes ? ` · ${result.notes}` : ""}`,
        duration: 6000,
      });
    } catch (err: any) {
      toast.error(err.message || "VIN decode failed");
    } finally {
      setVinDecoding(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* VIN Decode Section — prominent placement */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <Label className="text-muted-foreground text-sm flex items-center gap-2 mb-2">
          <ScanSearch className="h-4 w-4 text-primary" />
          {t.carUpload.vin} — Auto-fill from VIN
        </Label>
        <div className="flex gap-2">
          <Input
            value={data.vin}
            onChange={(e) => { onChange({ vin: e.target.value.toUpperCase() }); setVinDecoded(false); }}
            className="bg-background border-border text-foreground font-mono tracking-wider"
            placeholder="WVWZZZ3CZWE123456"
            maxLength={17}
          />
          <Button
            type="button"
            onClick={handleVinDecode}
            disabled={vinDecoding || !data.vin || data.vin.length < 11}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-4 whitespace-nowrap"
          >
            {vinDecoding ? (
              <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Decoding...</>
            ) : vinDecoded ? (
              <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Decoded</>
            ) : (
              <><ScanSearch className="h-4 w-4 mr-1.5" /> Decode VIN</>
            )}
          </Button>
        </div>
        <p className="text-muted-foreground text-xs mt-1.5">
          Enter your 17-character VIN to auto-fill make, model, year, specs, and suggested equipment
        </p>
      </div>

      {/* Make → Model → Variant cascade */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-muted-foreground text-sm">{t.carUpload.make}</Label>
          <Select value={data.make} onValueChange={handleMakeChange}>
            <SelectTrigger className="bg-background border-border text-foreground mt-1">
              <SelectValue placeholder={makesLoading ? "Loading..." : "Select make"} />
            </SelectTrigger>
            <SelectContent>
              {makes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">{t.carUpload.model}</Label>
          <Select value={data.model} onValueChange={handleModelChange} disabled={!data.make}>
            <SelectTrigger className="bg-background border-border text-foreground mt-1">
              <SelectValue placeholder={modelsLoading ? "Loading..." : "Select model"} />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">Variant</Label>
          <Select value={data.variant} onValueChange={(v) => onChange({ variant: v })} disabled={!data.model}>
            <SelectTrigger className="bg-background border-border text-foreground mt-1">
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

      {/* VIN-decoded specs (when no variant selected but VIN was decoded) */}
      {vinDecoded && !selectedVariant && data.powerHp > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">VIN decoded</Badge>
          <Badge variant="secondary" className="text-xs">{data.powerHp} HP</Badge>
          <Badge variant="secondary" className="text-xs">{data.fuelType}</Badge>
          <Badge variant="secondary" className="text-xs">{data.transmission}</Badge>
          <Badge variant="secondary" className="text-xs">{data.bodyType}</Badge>
        </div>
      )}

      {/* Year, Mileage, Color */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-muted-foreground text-sm">{t.carUpload.year}</Label>
          <Select value={String(data.year)} onValueChange={(v) => onChange({ year: Number(v) })}>
            <SelectTrigger className="bg-background border-border text-foreground mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">{t.carUpload.mileage}</Label>
          <Input type="number" value={data.mileage} onChange={(e) => onChange({ mileage: Number(e.target.value) })} className="bg-background border-border text-foreground mt-1" />
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">{t.carUpload.color}</Label>
          <Select value={data.color} onValueChange={(v) => onChange({ color: v })}>
            <SelectTrigger className="bg-background border-border text-foreground mt-1"><SelectValue placeholder="Select color" /></SelectTrigger>
            <SelectContent>
              {COLORS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground text-sm">{t.carUpload.price}</Label>
          <Input type="number" value={data.price} onChange={(e) => onChange({ price: Number(e.target.value) })} className="bg-background border-border text-foreground mt-1" />
        </div>
      </div>
    </div>
  );
};

export default StepBasicInfo;
