import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Cigarette, BookOpen, FileCheck, Receipt, CircleDot, Luggage, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CarFormData } from "./types";

interface Props {
  data: CarFormData;
  onChange: (updates: Partial<CarFormData>) => void;
}

const StepCondition: React.FC<Props> = ({ data, onChange }) => {
  const { t, language } = useLanguage();
  const [generating, setGenerating] = useState(false);

  const conditionLabel = (val: number) => {
    if (val >= 90) return t.carUpload.conditionScale.excellent;
    if (val >= 70) return t.carUpload.conditionScale.good;
    if (val >= 50) return t.carUpload.conditionScale.fair;
    return t.carUpload.conditionScale.poor;
  };

  const generateDescription = async () => {
    setGenerating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-description", {
        body: {
          make: data.make,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          fuelType: data.fuelType,
          transmission: data.transmission,
          bodyType: data.bodyType,
          color: data.color,
          powerHp: data.powerHp,
          equipment: data.equipment,
          conditionExterior: data.conditionExterior,
          conditionInterior: data.conditionInterior,
          accidentHistory: data.accidentHistory,
          language,
        },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      if (result?.description) {
        onChange({ description: result.description });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate description");
    } finally {
      setGenerating(false);
    }
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

      {/* Documentation & Condition Questions */}
      <div className="border-t border-border pt-6 space-y-4">
        <Label className="text-silver/80 text-sm block mb-2">Vehicle Documentation & History</Label>

        <div className="flex items-center justify-between rounded-xl border border-border bg-charcoal/50 p-4">
          <div className="flex items-center gap-3">
            <Cigarette className="h-4 w-4 text-silver/50" />
            <div>
              <p className="text-sm text-white font-medium">Smoker car?</p>
              <p className="text-[11px] text-silver/40">Non-smoker vehicles retain more value</p>
            </div>
          </div>
          <Switch checked={data.smokerCar} onCheckedChange={(v) => onChange({ smokerCar: v })} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-charcoal/50 p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-silver/50" />
            <div>
              <p className="text-sm text-white font-medium">Service book / records up to date?</p>
              <p className="text-[11px] text-silver/40">Documented maintenance history boosts value</p>
            </div>
          </div>
          <Switch checked={data.serviceBookUpdated} onCheckedChange={(v) => onChange({ serviceBookUpdated: v })} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-charcoal/50 p-4">
          <div className="flex items-center gap-3">
            <FileCheck className="h-4 w-4 text-silver/50" />
            <div>
              <p className="text-sm text-white font-medium">Original documents available?</p>
              <p className="text-[11px] text-silver/40">Registration, manual, spare key, etc.</p>
            </div>
          </div>
          <Switch checked={data.originalDocsAvailable} onCheckedChange={(v) => onChange({ originalDocsAvailable: v })} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-charcoal/50 p-4">
          <div className="flex items-center gap-3">
            <Receipt className="h-4 w-4 text-silver/50" />
            <div>
              <p className="text-sm text-white font-medium">Maintenance receipts available?</p>
              <p className="text-[11px] text-silver/40">Invoices from workshops or dealers</p>
            </div>
          </div>
          <Switch checked={data.maintenanceReceipts} onCheckedChange={(v) => onChange({ maintenanceReceipts: v })} />
        </div>
      </div>

      {/* Accessories */}
      <div className="border-t border-border pt-6 space-y-4">
        <Label className="text-silver/80 text-sm block mb-2">Included Accessories</Label>

        <div className="flex items-center justify-between rounded-xl border border-border bg-charcoal/50 p-4">
          <div className="flex items-center gap-3">
            <CircleDot className="h-4 w-4 text-silver/50" />
            <div>
              <p className="text-sm text-white font-medium">Second set of wheels / tires?</p>
              <p className="text-[11px] text-silver/40">Winter or summer set — adds measurable value</p>
            </div>
          </div>
          <Switch checked={data.secondWheelSet} onCheckedChange={(v) => onChange({ secondWheelSet: v })} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-charcoal/50 p-4">
          <div className="flex items-center gap-3">
            <Luggage className="h-4 w-4 text-silver/50" />
            <div>
              <p className="text-sm text-white font-medium">Roof rack included?</p>
              <p className="text-[11px] text-silver/40">OEM or aftermarket roof rail system</p>
            </div>
          </div>
          <Switch checked={data.hasRoofRack} onCheckedChange={(v) => onChange({ hasRoofRack: v })} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-charcoal/50 p-4">
          <div className="flex items-center gap-3">
            <Package className="h-4 w-4 text-silver/50" />
            <div>
              <p className="text-sm text-white font-medium">Roof box included?</p>
              <p className="text-[11px] text-silver/40">Cargo box for extra storage</p>
            </div>
          </div>
          <Switch checked={data.hasRoofBox} onCheckedChange={(v) => onChange({ hasRoofBox: v })} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label className="text-silver/80 text-sm">{t.carUpload.description}</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 text-xs gap-1.5 h-7"
            onClick={generateDescription}
            disabled={generating || !data.make}
          >
            {generating ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> {t.carUpload.generatingDescription}</>
            ) : (
              <><Sparkles className="h-3 w-3" /> {t.carUpload.generateDescription}</>
            )}
          </Button>
        </div>
        <Textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="bg-charcoal border-border text-white mt-1"
          rows={5}
          placeholder={language === "de" ? "Beschreiben Sie Ihr Fahrzeug oder lassen Sie KI eine Beschreibung generieren..." : "Describe your vehicle or let AI generate a description..."}
        />
      </div>
    </div>
  );
};

export default StepCondition;
