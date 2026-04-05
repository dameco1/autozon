import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Car, Shield, AlertTriangle, CheckCircle2, Loader2, FileText, Search } from "lucide-react";

interface Props {
  vin?: string | null;
  carId?: string;
}

interface VinData {
  make?: string;
  model?: string;
  year?: number;
  body_type?: string;
  fuel_type?: string;
  engine_displacement?: number;
  power_hp?: number;
  transmission?: string;
  drive_type?: string;
  doors?: number;
  stolen_check?: string;
  market_value?: { average?: number; below?: number; above?: number };
  recalls?: string[];
  [key: string]: any;
}

const VincarioDataCard: React.FC<Props> = ({ vin, carId }) => {
  const [vinInput, setVinInput] = useState(vin || "");
  const [data, setData] = useState<VinData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    const v = vinInput.trim();
    if (v.length < 11) {
      setError("VIN must be at least 11 characters");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke("vin-decode", {
        body: { vin: v },
      });
      if (fnError) throw fnError;
      setData(result);
    } catch (err: any) {
      setError(err.message || "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground text-base flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Vehicle History Report
          <Badge variant="outline" className="text-xs text-muted-foreground border-border ml-auto">Powered by Vincario</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!data && (
          <>
            {!vin && (
              <div className="flex gap-2">
                <Input
                  value={vinInput}
                  onChange={e => setVinInput(e.target.value.toUpperCase())}
                  placeholder="Enter VIN (e.g. WVWZZZ3CZWE123456)"
                  maxLength={17}
                  className="bg-background border-border text-foreground font-mono"
                />
                <Button onClick={handleLookup} disabled={loading} className="bg-primary text-primary-foreground shrink-0">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            )}
            {vin && (
              <Button onClick={handleLookup} disabled={loading} className="w-full bg-primary text-primary-foreground">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</> : <><Search className="mr-2 h-4 w-4" /> Check VIN: {vin}</>}
              </Button>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">Checks include: vehicle specs, stolen status, market value estimate, and recall notices.</p>
          </>
        )}

        {data && (
          <div className="space-y-4">
            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Make", value: data.make },
                { label: "Model", value: data.model },
                { label: "Year", value: data.year },
                { label: "Body", value: data.body_type },
                { label: "Fuel", value: data.fuel_type },
                { label: "Power", value: data.power_hp ? `${data.power_hp} HP` : undefined },
                { label: "Transmission", value: data.transmission },
                { label: "Drive", value: data.drive_type },
              ].filter(r => r.value).map(r => (
                <div key={r.label} className="bg-secondary/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">{r.label}</p>
                  <p className="text-sm font-medium text-foreground">{String(r.value)}</p>
                </div>
              ))}
            </div>

            {/* Stolen check */}
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              data.stolen_check === "clear" || !data.stolen_check
                ? "bg-primary/5 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}>
              {data.stolen_check === "clear" || !data.stolen_check ? (
                <><CheckCircle2 className="h-5 w-5" /> <span className="text-sm font-medium">No stolen records found</span></>
              ) : (
                <><AlertTriangle className="h-5 w-5" /> <span className="text-sm font-medium">Alert: {data.stolen_check}</span></>
              )}
            </div>

            {/* Market value */}
            {data.market_value && (
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-2">Market Value Estimate</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Below avg</span>
                  <span className="font-medium text-foreground">€{data.market_value.below?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Average</span>
                  <span className="font-bold text-primary">€{data.market_value.average?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Above avg</span>
                  <span className="font-medium text-foreground">€{data.market_value.above?.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Recalls */}
            {data.recalls && data.recalls.length > 0 && (
              <div className="bg-destructive/5 rounded-lg p-3">
                <p className="text-xs text-destructive font-medium mb-1">Recall Notices ({data.recalls.length})</p>
                {data.recalls.map((r, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {r}</p>
                ))}
              </div>
            )}

            <Button variant="outline" className="w-full border-border text-foreground" onClick={() => setData(null)}>
              Reset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VincarioDataCard;
