export interface DetectedDamage {
  type: "scratch" | "dent" | "rust" | "crack" | "paint_damage" | "broken_part" | "wear" | "other";
  location: string;
  severity: "low" | "medium" | "high";
  confidence: number;
  description: string;
  confirmed?: boolean; // undefined = not reviewed, true = confirmed, false = dismissed
}

export interface DamageReport {
  damages: DetectedDamage[];
  overallCondition: "excellent" | "good" | "fair" | "poor";
  summary: string;
}
