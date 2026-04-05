import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { COLORS, TRANSMISSIONS } from "./constants";
import { useCarMakes, useCarModels, useCarVariants } from "@/hooks/useCarModels";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScanSearch, Loader2, CheckCircle2, ShieldAlert, Lock, Pencil } from "lucide-react";
import type { CarFormData } from "./types";

interface Props {
  data: CarFormData;
  onChange: (updates: Partial<CarFormData>) => void;
  onVinEquipmentSuggested?: (equipment: string[]) => void;
  onStolenDetected?: (stolen: boolean) => void;
  isEdit?: boolean;
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

/** Fields that VIN decode can auto-fill */
type VinField = "make" | "model" | "variant" | "year" | "fuelType" | "bodyType" | "transmission" | "powerHp" | "color";

const StepBasicInfo: React.FC<Props> = ({ data, onChange, onVinEquipmentSuggested, onStolenDetected, isEdit }) => {
  const { t } = useLanguage();
  const [vinDecoding, setVinDecoding] = useState(false);
  const [vinDecoded, setVinDecoded] = useState(false);
  const [stolenWarning, setStolenWarning] = useState<{ stolen: boolean; details?: string | null }>({ stolen: false });
  /** Track which fields were populated by VIN decode */
  const [vinFields, setVinFields] = useState<Set<VinField>>(new Set());
  /** Track fields the user chose to manually override */
  const [overriddenFields, setOverriddenFields] = useState<Set<VinField>>(new Set());

  const { data: makes = [], isLoading: makesLoading } = useCarMakes();
  const { data: models = [], isLoading: modelsLoading } = useCarModels(data.make);
  const { data: variants = [], isLoading: variantsLoading } = useCarVariants(data.make, data.model);

  // Auto-fill specs when variant is selected (only in manual mode)
  const selectedVariant = useMemo(
    () => variants.find((v) => v.variant === data.variant),
    [variants, data.variant]
  );

  useEffect(() => {
    if (selectedVariant && !vinDecoded) {
      onChange({
        powerHp: selectedVariant.power_hp,
        fuelType: selectedVariant.fuel_type,
        transmission: selectedVariant.transmission,
        bodyType: selectedVariant.body_type,
      });
    }
  }, [selectedVariant]);

  // Reset dependent fields on parent change (only in manual mode)
  const handleMakeChange = (make: string) => {
    onChange({ make, model: "", variant: "", powerHp: 0, fuelType: "Petrol", transmission: "Manual", bodyType: "Sedan" });
  };

  const handleModelChange = (model: string) => {
    onChange({ model, variant: "", powerHp: 0, fuelType: "Petrol", transmission: "Manual", bodyType: "Sedan" });
  };

  /** Check if a field is locked (VIN-decoded and not overridden) */
  const isFieldLocked = (field: VinField) => vinDecoded && vinFields.has(field) && !overriddenFields.has(field);

  /** Unlock a VIN-decoded field for manual editing */
  const unlockField = (field: VinField) => {
    setOverriddenFields((prev) => new Set([...prev, field]));
  };

  const handleVinDecode = async () => {
    if (!data.vin || data.vin.length < 11) {
      toast.error("Please enter a valid VIN (at least 11 characters)");
      return;
    }
    setVinDecoding(true);
    setVinDecoded(false);
    setVinFields(new Set());
    setOverriddenFields(new Set());

    try {
      const { data: result, error } = await supabase.functions.invoke("vin-decode", {
        body: { vin: data.vin },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      // Auto-fill form fields from decoded VIN
      const updates: Partial<CarFormData> = {};
      const decoded = new Set<VinField>();

      if (result.make) { updates.make = result.make; decoded.add("make"); }
      if (result.model) { updates.model = result.model; decoded.add("model"); }
      if (result.variant) { updates.variant = result.variant; decoded.add("variant"); }
      if (result.year) { updates.year = result.year; decoded.add("year"); }
      if (result.body_type) { updates.bodyType = result.body_type; decoded.add("bodyType"); }
      if (result.fuel_type) { updates.fuelType = result.fuel_type; decoded.add("fuelType"); }
      if (result.transmission) { updates.transmission = result.transmission; decoded.add("transmission"); }
      if (result.power_hp) { updates.powerHp = result.power_hp; decoded.add("powerHp"); }
      if (result.color) { updates.color = result.color; decoded.add("color"); }

      // Merge suggested equipment with existing (don't overwrite user selections)
      if (result.suggested_equipment?.length > 0) {
        const merged = [...new Set([...data.equipment, ...result.suggested_equipment])];
        updates.equipment = merged;
        onVinEquipmentSuggested?.(result.suggested_equipment);
      }

      onChange(updates);
      setVinDecoded(true);
      setVinFields(decoded);

      // Handle stolen check
      if (result.stolen) {
        setStolenWarning({ stolen: true, details: result.stolen_details });
        onStolenDetected?.(true);
        toast.error("⚠️ Stolen Vehicle Alert", {
          description: result.stolen_details || "This VIN has been flagged in a stolen vehicle database.",
          duration: 10000,
        });
        return;
      } else {
        setStolenWarning({ stolen: false });
        onStolenDetected?.(false);
      }

      const decodedCount = decoded.size;
      const confidenceMsg = result.confidence === "high"
        ? `High confidence — ${decodedCount} fields auto-filled`
        : result.confidence === "medium"
          ? `Medium confidence — ${decodedCount} fields filled, please verify`
          : `Low confidence — please review all fields`;

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

  /** Render a VIN lock badge or unlock button */
  const VinLockIndicator = ({ field, label }: { field: VinField; label: string }) => {
    if (!vinDecoded || !vinFields.has(field)) return null;
    if (overriddenFields.has(field)) {
      return (
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-muted-foreground/30 text-muted-foreground font-normal ml-1">
          <Pencil className="h-2.5 w-2.5 mr-0.5" /> edited
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="text-[10px] px-1.5 py-0 border-primary/40 text-primary font-normal ml-1 cursor-pointer hover:bg-primary/10 transition-colors"
        onClick={() => unlockField(field)}
        title={`Auto-filled from VIN. Click to edit ${label}.`}
      >
        <Lock className="h-2.5 w-2.5 mr-0.5" /> VIN
      </Badge>
    );
  };

  const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
  const REG_YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-5">
      {/* VIN Decode Section — prominent placement */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <Label className="text-muted-foreground text-sm flex items-center gap-2 mb-2">
          <ScanSearch className="h-4 w-4 text-primary" />
          {t.carUpload.vin} — Auto-fill from VIN
        </Label>
        {isEdit && data.vin ? (
          <div>
            <div className="bg-muted/50 border border-border rounded-md px-3 py-2 text-sm text-foreground font-mono tracking-wider flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              {data.vin}
            </div>
            <p className="text-muted-foreground text-xs mt-1.5">
              {(t.carUpload as any).vinImmutableHint}
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <Input
                value={data.vin}
                onChange={(e) => {
                  onChange({ vin: e.target.value.toUpperCase() });
                  setVinDecoded(false);
                  setVinFields(new Set());
                  setOverriddenFields(new Set());
                }}
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
              Enter your 17-character VIN to auto-fill make, model, year, specs, color, and suggested equipment
            </p>
          </>
        )}
      </div>

      {/* Stolen vehicle warning */}
      {stolenWarning.stolen && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="font-bold">Stolen Vehicle Alert</AlertTitle>
          <AlertDescription>
            {stolenWarning.details || "This VIN has been flagged in a stolen vehicle database."}
            <span className="block mt-1 text-xs font-medium">This vehicle cannot be listed on Autozon. If you believe this is an error, please contact support.</span>
          </AlertDescription>
        </Alert>
      )}

      {/* VIN decoded summary banner */}
      {vinDecoded && vinFields.size > 0 && (
        <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">{vinFields.size} fields</span> auto-filled from VIN.
            Fields marked with <Lock className="h-3 w-3 inline text-primary mx-0.5" /> are VIN-decoded — click to override.
          </p>
        </div>
      )}

      {/* Make → Model → Variant cascade */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-muted-foreground text-sm flex items-center">
            {t.carUpload.make}
            <VinLockIndicator field="make" label="make" />
          </Label>
          {isFieldLocked("make") ? (
            <div className="mt-1 bg-muted/50 border border-border rounded-md px-3 py-2 text-sm text-foreground font-medium">
              {data.make}
            </div>
          ) : (
            <Select value={data.make} onValueChange={handleMakeChange}>
              <SelectTrigger className="bg-background border-border text-foreground mt-1">
                <SelectValue placeholder={makesLoading ? "Loading..." : "Select make"} />
              </SelectTrigger>
              <SelectContent>
                {makes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <Label className="text-muted-foreground text-sm flex items-center">
            {t.carUpload.model}
            <VinLockIndicator field="model" label="model" />
          </Label>
          {isFieldLocked("model") ? (
            <div className="mt-1 bg-muted/50 border border-border rounded-md px-3 py-2 text-sm text-foreground font-medium">
              {data.model}
            </div>
          ) : (
            <Select value={data.model} onValueChange={handleModelChange} disabled={!data.make}>
              <SelectTrigger className="bg-background border-border text-foreground mt-1">
                <SelectValue placeholder={modelsLoading ? "Loading..." : "Select model"} />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <Label className="text-muted-foreground text-sm flex items-center">
            Variant
            <VinLockIndicator field="variant" label="variant" />
          </Label>
          {isFieldLocked("variant") ? (
            <div className="mt-1 bg-muted/50 border border-border rounded-md px-3 py-2 text-sm text-foreground font-medium">
              {data.variant || "—"}
            </div>
          ) : (
            <Select value={data.variant} onValueChange={(v) => onChange({ variant: v })} disabled={!data.model}>
              <SelectTrigger className="bg-background border-border text-foreground mt-1">
                <SelectValue placeholder={variantsLoading ? "Loading..." : "Select variant"} />
              </SelectTrigger>
              <SelectContent>
                {variants.map((v) => <SelectItem key={v.id} value={v.variant}>{v.variant} ({v.power_hp} HP)</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Auto-filled specs badges */}
      {vinDecoded && (data.powerHp > 0 || data.fuelType || data.transmission || data.bodyType) && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">VIN decoded</Badge>
          {data.powerHp > 0 && <Badge variant="secondary" className="text-xs">{data.powerHp} HP</Badge>}
          {data.fuelType && <Badge variant="secondary" className="text-xs">{data.fuelType}</Badge>}
          {data.transmission && <Badge variant="secondary" className="text-xs">{data.transmission}</Badge>}
          {data.bodyType && <Badge variant="secondary" className="text-xs">{data.bodyType}</Badge>}
        </div>
      )}

      {/* Non-VIN variant specs (manual flow) */}
      {!vinDecoded && data.variant && selectedVariant && (
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
          <Label className="text-muted-foreground text-sm flex items-center">
            {t.carUpload.year}
            <VinLockIndicator field="year" label="year" />
          </Label>
          {isFieldLocked("year") ? (
            <div className="mt-1 bg-muted/50 border border-border rounded-md px-3 py-2 text-sm text-foreground font-medium">
              {data.year}
            </div>
          ) : (
            <Select value={String(data.year)} onValueChange={(v) => onChange({ year: Number(v) })}>
              <SelectTrigger className="bg-background border-border text-foreground mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">{t.carUpload.mileage}</Label>
          <Input type="number" value={data.mileage} onChange={(e) => onChange({ mileage: Number(e.target.value) })} className="bg-background border-border text-foreground mt-1" />
        </div>
        <div>
          <Label className="text-muted-foreground text-sm flex items-center">
            {t.carUpload.color}
            <VinLockIndicator field="color" label="color" />
          </Label>
          {isFieldLocked("color") ? (
            <div className="mt-1 bg-muted/50 border border-border rounded-md px-3 py-2 text-sm text-foreground font-medium">
              {data.color}
            </div>
          ) : (
            <Select value={data.color} onValueChange={(v) => onChange({ color: v })}>
              <SelectTrigger className="bg-background border-border text-foreground mt-1"><SelectValue placeholder="Select color" /></SelectTrigger>
              <SelectContent>
                {COLORS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Transmission + Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground text-sm flex items-center">
            {t.carUpload.transmission || "Transmission"}
            <VinLockIndicator field="transmission" label="transmission" />
          </Label>
          {isFieldLocked("transmission") ? (
            <div className="mt-1 bg-muted/50 border border-border rounded-md px-3 py-2 text-sm text-foreground font-medium">
              {data.transmission}
            </div>
          ) : (
            <Select value={data.transmission} onValueChange={(v) => onChange({ transmission: v })}>
              <SelectTrigger className="bg-background border-border text-foreground mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TRANSMISSIONS.map((tr) => <SelectItem key={tr} value={tr}>{tr}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">{t.carUpload.price}</Label>
          <Input type="number" value={data.price} onChange={(e) => onChange({ price: Number(e.target.value) })} className="bg-background border-border text-foreground mt-1" />
        </div>
      </div>
    </div>
  );
};

export default StepBasicInfo;
