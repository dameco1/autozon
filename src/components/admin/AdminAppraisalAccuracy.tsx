import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingDown, TrendingUp, BarChart3, Car } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

interface FeedbackRow {
  make: string;
  body_type: string;
  blended_value: number | null;
  agreed_sale_price: number | null;
  deviation_pct: number | null;
  formula_value: number | null;
  market_avg_value: number | null;
}

interface BrandMetric {
  name: string;
  count: number;
  avgDeviation: number;
  avgAbsDeviation: number;
}

const AdminAppraisalAccuracy: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-appraisal-accuracy"],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("appraisal_feedback" as any)
        .select("make, body_type, blended_value, agreed_sale_price, deviation_pct, formula_value, market_avg_value")
        .not("agreed_sale_price", "is", null);

      if (error) throw error;
      const feedback = (rows ?? []) as unknown as FeedbackRow[];

      // Overall metrics
      const withDeviation = feedback.filter(r => r.blended_value && r.agreed_sale_price);
      const totalCount = withDeviation.length;

      let avgDeviation = 0;
      let avgAbsDeviation = 0;
      let overvaluedCount = 0;
      let undervaluedCount = 0;
      let accurateCount = 0;

      if (totalCount > 0) {
        const deviations = withDeviation.map(r => {
          const dev = ((r.agreed_sale_price! - r.blended_value!) / r.blended_value!) * 100;
          return dev;
        });

        avgDeviation = deviations.reduce((s, d) => s + d, 0) / totalCount;
        avgAbsDeviation = deviations.reduce((s, d) => s + Math.abs(d), 0) / totalCount;
        overvaluedCount = deviations.filter(d => d < -5).length;
        undervaluedCount = deviations.filter(d => d > 5).length;
        accurateCount = deviations.filter(d => Math.abs(d) <= 5).length;
      }

      // By brand
      const brandMap = new Map<string, { devs: number[]; count: number }>();
      withDeviation.forEach(r => {
        const key = r.make;
        const dev = ((r.agreed_sale_price! - r.blended_value!) / r.blended_value!) * 100;
        if (!brandMap.has(key)) brandMap.set(key, { devs: [], count: 0 });
        const entry = brandMap.get(key)!;
        entry.devs.push(dev);
        entry.count++;
      });

      const byBrand: BrandMetric[] = Array.from(brandMap.entries())
        .map(([name, { devs, count }]) => ({
          name,
          count,
          avgDeviation: devs.reduce((s, d) => s + d, 0) / count,
          avgAbsDeviation: devs.reduce((s, d) => s + Math.abs(d), 0) / count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // By segment (body_type)
      const segmentMap = new Map<string, { devs: number[]; count: number }>();
      withDeviation.forEach(r => {
        const key = r.body_type;
        const dev = ((r.agreed_sale_price! - r.blended_value!) / r.blended_value!) * 100;
        if (!segmentMap.has(key)) segmentMap.set(key, { devs: [], count: 0 });
        const entry = segmentMap.get(key)!;
        entry.devs.push(dev);
        entry.count++;
      });

      const bySegment: BrandMetric[] = Array.from(segmentMap.entries())
        .map(([name, { devs, count }]) => ({
          name,
          count,
          avgDeviation: devs.reduce((s, d) => s + d, 0) / count,
          avgAbsDeviation: devs.reduce((s, d) => s + Math.abs(d), 0) / count,
        }))
        .sort((a, b) => b.count - a.count);

      // Formula vs Market accuracy
      const formulaDeviations = withDeviation
        .filter(r => r.formula_value)
        .map(r => ((r.agreed_sale_price! - r.formula_value!) / r.formula_value!) * 100);
      const marketDeviations = withDeviation
        .filter(r => r.market_avg_value)
        .map(r => ((r.agreed_sale_price! - r.market_avg_value!) / r.market_avg_value!) * 100);

      const avgFormulaDeviation = formulaDeviations.length > 0
        ? formulaDeviations.reduce((s, d) => s + Math.abs(d), 0) / formulaDeviations.length : null;
      const avgMarketDeviation = marketDeviations.length > 0
        ? marketDeviations.reduce((s, d) => s + Math.abs(d), 0) / marketDeviations.length : null;

      return {
        totalCount,
        avgDeviation,
        avgAbsDeviation,
        overvaluedCount,
        undervaluedCount,
        accurateCount,
        byBrand,
        bySegment,
        avgFormulaDeviation,
        avgMarketDeviation,
      };
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6 text-center text-muted-foreground text-sm">
          Loading appraisal metrics…
        </CardContent>
      </Card>
    );
  }

  if (!data || data.totalCount === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">Appraisal Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No completed transactions with appraisal feedback yet. Data will appear here once buyers complete transactions.</p>
        </CardContent>
      </Card>
    );
  }

  const getBarColor = (dev: number) => {
    const abs = Math.abs(dev);
    if (abs <= 5) return "hsl(var(--primary))";
    if (abs <= 15) return "hsl(35, 90%, 50%)";
    return "hsl(0, 70%, 55%)";
  };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Avg Deviation</span>
            </div>
            <div className={`text-xl font-bold ${Math.abs(data.avgDeviation) <= 5 ? "text-primary" : Math.abs(data.avgDeviation) <= 15 ? "text-yellow-500" : "text-red-500"}`}>
              {data.avgDeviation > 0 ? "+" : ""}{data.avgDeviation.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">MAE: {data.avgAbsDeviation.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Transactions</span>
            </div>
            <div className="text-xl font-bold text-foreground">{data.totalCount}</div>
            <p className="text-xs text-muted-foreground mt-0.5">with sale price data</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Accurate (±5%)</span>
            </div>
            <div className="text-xl font-bold text-green-600">{data.accurateCount}</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.totalCount > 0 ? `${Math.round((data.accurateCount / data.totalCount) * 100)}% hit rate` : "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Over / Under</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              <span className="text-red-500">{data.overvaluedCount}</span>
              {" / "}
              <span className="text-yellow-500">{data.undervaluedCount}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">overvalued / undervalued</p>
          </CardContent>
        </Card>
      </div>

      {/* Formula vs Market accuracy comparison */}
      {(data.avgFormulaDeviation !== null || data.avgMarketDeviation !== null) && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Formula vs Market Accuracy (MAE)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              {data.avgFormulaDeviation !== null && (
                <div>
                  <p className="text-xs text-muted-foreground">Formula alone</p>
                  <p className={`text-lg font-bold ${data.avgFormulaDeviation <= 10 ? "text-primary" : "text-red-500"}`}>
                    ±{data.avgFormulaDeviation.toFixed(1)}%
                  </p>
                </div>
              )}
              {data.avgMarketDeviation !== null && (
                <div>
                  <p className="text-xs text-muted-foreground">Market AI alone</p>
                  <p className={`text-lg font-bold ${data.avgMarketDeviation <= 10 ? "text-primary" : "text-red-500"}`}>
                    ±{data.avgMarketDeviation.toFixed(1)}%
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Blended (final)</p>
                <p className={`text-lg font-bold ${data.avgAbsDeviation <= 10 ? "text-primary" : "text-red-500"}`}>
                  ±{data.avgAbsDeviation.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* By Brand chart */}
      {data.byBrand.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              Deviation by Brand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byBrand} layout="vertical" margin={{ left: 70, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(0)}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    width={65}
                  />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 12 }}
                    formatter={(value: number) => [`${value > 0 ? "+" : ""}${value.toFixed(1)}%`, "Avg Deviation"]}
                  />
                  <Bar dataKey="avgDeviation" radius={[0, 4, 4, 0]}>
                    {data.byBrand.map((entry, i) => (
                      <Cell key={i} fill={getBarColor(entry.avgDeviation)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Positive = sold above fair value · Negative = sold below · Green ≤5% · Orange ≤15% · Red &gt;15%
            </p>
          </CardContent>
        </Card>
      )}

      {/* By Segment chart */}
      {data.bySegment.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Deviation by Segment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.bySegment} margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
                  />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 12 }}
                    formatter={(value: number) => [`${value > 0 ? "+" : ""}${value.toFixed(1)}%`, "Avg Deviation"]}
                  />
                  <Bar dataKey="avgDeviation" radius={[4, 4, 0, 0]}>
                    {data.bySegment.map((entry, i) => (
                      <Cell key={i} fill={getBarColor(entry.avgDeviation)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAppraisalAccuracy;
