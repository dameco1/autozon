import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Globe, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export interface MarketData {
  min_price: number;
  max_price: number;
  avg_price: number;
  market_position: "below_market" | "at_market" | "above_market";
  confidence: string;
  sources_note: string;
  depreciation_forecast?: number[];
}

interface Props {
  data: MarketData | null;
  loading: boolean;
  error: boolean;
  askingPrice: number;
  blendedFairValue?: number | null;
}

const MarketComparison: React.FC<Props> = ({ data, loading, error, askingPrice, blendedFairValue }) => {
  const { t } = useLanguage();

  if (error) return null;

  if (loading) {
    return (
      <motion.div
        className="bg-secondary/50 border border-border rounded-2xl p-8 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-display font-bold text-foreground">Market Comparison</h3>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-48 bg-secondary" />
          <Skeleton className="h-10 w-full bg-secondary" />
          <Skeleton className="h-4 w-64 bg-secondary" />
        </div>
      </motion.div>
    );
  }

  if (!data) return null;

  const range = data.max_price - data.min_price;
  const pricePosition = range > 0
    ? Math.max(0, Math.min(100, ((askingPrice - data.min_price) / range) * 100))
    : 50;

  const positionIcon = data.market_position === "below_market"
    ? <TrendingDown className="h-4 w-4" />
    : data.market_position === "above_market"
      ? <TrendingUp className="h-4 w-4" />
      : <Minus className="h-4 w-4" />;

  const positionColor = data.market_position === "below_market"
    ? "text-primary"
    : data.market_position === "above_market"
      ? "text-destructive"
      : "text-yellow-400";

  const positionLabel = data.market_position === "below_market"
    ? "Below Market – Great Deal"
    : data.market_position === "above_market"
      ? "Above Market Average"
      : "At Market Value";

  return (
    <motion.div
      className="bg-secondary/50 border border-border rounded-2xl p-8 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-display font-bold text-foreground">Market Comparison</h3>
      </div>

      {/* Blended fair value callout */}
      {blendedFairValue && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-center">
          <div className="text-xs text-muted-foreground mb-1">Market-Adjusted Fair Value</div>
          <div className="text-2xl font-display font-black text-primary">
            €{blendedFairValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">60% algorithm + 40% market average</div>
        </div>
      )}

      {/* Price range bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>€{data.min_price.toLocaleString()}</span>
          <span className="text-muted-foreground">avg €{data.avg_price.toLocaleString()}</span>
          <span>€{data.max_price.toLocaleString()}</span>
        </div>
        <div className="relative h-4 bg-charcoal/80 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-destructive/20 rounded-full" />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-silver/30"
            style={{ left: `${range > 0 ? ((data.avg_price - data.min_price) / range) * 100 : 50}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg"
            style={{ left: `calc(${pricePosition}% - 8px)` }}
          />
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <span className={`flex items-center gap-1 text-sm font-semibold ${positionColor}`}>
            {positionIcon} {positionLabel}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-muted/80 rounded-xl p-3 text-center">
          <div className="text-[10px] text-muted-foreground mb-1">Lowest</div>
          <div className="text-sm font-bold text-foreground">€{data.min_price.toLocaleString()}</div>
        </div>
        <div className="bg-muted/80 rounded-xl p-3 text-center">
          <div className="text-[10px] text-muted-foreground mb-1">Your Price</div>
          <div className={`text-sm font-bold ${positionColor}`}>€{askingPrice.toLocaleString()}</div>
        </div>
        <div className="bg-muted/80 rounded-xl p-3 text-center">
          <div className="text-[10px] text-muted-foreground mb-1">Highest</div>
          <div className="text-sm font-bold text-foreground">€{data.max_price.toLocaleString()}</div>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        AI-estimated from {data.sources_note} • Confidence: {data.confidence}
      </p>
    </motion.div>
  );
};

export default MarketComparison;
