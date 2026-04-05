import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Calculator, Info } from "lucide-react";

interface Props {
  carPrice?: number;
  powerHp?: number;
  year?: number;
}

const InsuranceCalculator: React.FC<Props> = ({ carPrice = 25000, powerHp = 150, year = 2020 }) => {
  const [vehicleValue, setVehicleValue] = useState(carPrice);
  const [kw, setKw] = useState(Math.round((powerHp || 150) * 0.7457));
  const [firstReg, setFirstReg] = useState(year);
  const [kaskoType, setKaskoType] = useState<"teilkasko" | "vollkasko">("teilkasko");
  const [deductible, setDeductible] = useState(500);
  const [bonusMalus, setBonusMalus] = useState(9);
  const [kmYear, setKmYear] = useState(15000);

  const estimates = useMemo(() => {
    // Austrian motor insurance estimation (simplified formula)
    const age = new Date().getFullYear() - firstReg;
    const powerFactor = Math.max(1, kw / 80);
    const ageFactor = Math.max(0.6, 1 - age * 0.03);
    const bmFactor = Math.max(0.5, bonusMalus / 9);
    const kmFactor = kmYear > 20000 ? 1.15 : kmYear < 8000 ? 0.9 : 1;

    // Haftpflicht (liability)
    const haftpflichtBase = 25 + kw * 0.35;
    const haftpflicht = haftpflichtBase * bmFactor * kmFactor;

    // Kasko
    const kaskoBase = kaskoType === "vollkasko"
      ? vehicleValue * 0.003 + kw * 0.2
      : vehicleValue * 0.0015 + kw * 0.1;
    const kaskoMonthly = kaskoBase * ageFactor * powerFactor * (1 - deductible / 5000);

    // Combined
    const combined = haftpflicht + kaskoMonthly;

    // GAP (optional)
    const gap = vehicleValue > 20000 ? vehicleValue * 0.0008 : 0;

    // Warranty extension (optional)
    const warranty = age <= 5 ? 15 + kw * 0.05 : 25 + kw * 0.08;

    return {
      haftpflicht: Math.max(20, Math.round(haftpflicht)),
      kasko: Math.max(15, Math.round(kaskoMonthly)),
      combined: Math.max(35, Math.round(combined)),
      gap: Math.round(gap),
      warranty: Math.round(warranty),
    };
  }, [vehicleValue, kw, firstReg, kaskoType, deductible, bonusMalus, kmYear]);

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground text-base flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Insurance Estimate
          <Badge variant="outline" className="ml-auto text-xs text-muted-foreground border-border">Austria</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-muted-foreground text-xs">Vehicle Value (€)</Label>
            <Input type="number" value={vehicleValue} onChange={e => setVehicleValue(Number(e.target.value))} className="mt-1 bg-background border-border text-foreground text-sm" />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Power (kW)</Label>
            <Input type="number" value={kw} onChange={e => setKw(Number(e.target.value))} className="mt-1 bg-background border-border text-foreground text-sm" />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">First Registration</Label>
            <Input type="number" value={firstReg} onChange={e => setFirstReg(Number(e.target.value))} className="mt-1 bg-background border-border text-foreground text-sm" />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Bonus-Malus (0-18)</Label>
            <Input type="number" value={bonusMalus} onChange={e => setBonusMalus(Number(e.target.value))} min={0} max={18} className="mt-1 bg-background border-border text-foreground text-sm" />
          </div>
        </div>

        <div>
          <Label className="text-muted-foreground text-xs">Kasko Type</Label>
          <Select value={kaskoType} onValueChange={v => setKaskoType(v as any)}>
            <SelectTrigger className="mt-1 bg-background border-border text-foreground text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="teilkasko">Teilkasko (Partial)</SelectItem>
              <SelectItem value="vollkasko">Vollkasko (Comprehensive)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-muted-foreground text-xs">Selbstbehalt: €{deductible}</Label>
          <Slider value={[deductible]} onValueChange={v => setDeductible(v[0])} min={0} max={2000} step={100} className="mt-2" />
        </div>

        <div>
          <Label className="text-muted-foreground text-xs">km/year: {kmYear.toLocaleString()}</Label>
          <Slider value={[kmYear]} onValueChange={v => setKmYear(v[0])} min={5000} max={40000} step={1000} className="mt-2" />
        </div>

        {/* Results */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Haftpflicht (Liability)</span>
            <span className="text-sm font-bold text-foreground">€{estimates.haftpflicht}/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{kaskoType === "vollkasko" ? "Vollkasko" : "Teilkasko"}</span>
            <span className="text-sm font-bold text-foreground">€{estimates.kasko}/mo</span>
          </div>
          <div className="flex justify-between items-center bg-primary/5 rounded-lg p-2 -mx-1">
            <span className="text-sm font-medium text-primary">Combined Premium</span>
            <span className="text-lg font-display font-bold text-primary">€{estimates.combined}/mo</span>
          </div>
          {estimates.gap > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">GAP Insurance (optional)</span>
              <span className="text-xs text-foreground">+€{estimates.gap}/mo</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Warranty Extension (optional)</span>
            <span className="text-xs text-foreground">+€{estimates.warranty}/mo</span>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-secondary/50 rounded-lg p-3">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[11px] text-muted-foreground">
            Estimates based on Austrian motor insurance formulas. Actual premiums depend on your driving history, region, and insurer.
            Final quotes will be provided by partner insurers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceCalculator;
