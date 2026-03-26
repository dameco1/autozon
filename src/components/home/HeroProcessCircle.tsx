import React from "react";
import { motion } from "framer-motion";
import { Upload, BarChart3, Users, MousePointerClick, PackageCheck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const steps = [
  { icon: Upload, angle: -90 },
  { icon: BarChart3, angle: -18 },
  { icon: Users, angle: 54 },
  { icon: MousePointerClick, angle: 126 },
  { icon: PackageCheck, angle: 198 },
];

const HeroProcessCircle: React.FC = () => {
  const { t } = useLanguage();
  const radius = 160;
  const center = 200;

  return (
    <div className="relative w-[400px] h-[400px] mx-auto">
      {/* Outer ring */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="hsl(155 100% 42% / 0.15)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        {/* Connecting arcs between nodes */}
        {steps.map((_, i) => {
          const startAngle = steps[i].angle;
          const endAngle = steps[(i + 1) % steps.length].angle;
          const start = {
            x: center + radius * Math.cos((startAngle * Math.PI) / 180),
            y: center + radius * Math.sin((startAngle * Math.PI) / 180),
          };
          const end = {
            x: center + radius * Math.cos((endAngle * Math.PI) / 180),
            y: center + radius * Math.sin((endAngle * Math.PI) / 180),
          };
          return (
            <line
              key={i}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="hsl(155 100% 42% / 0.1)"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      {/* Rotating glow */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute w-3 h-3 rounded-full bg-primary/60 blur-sm"
          style={{
            left: center + radius - 6,
            top: center - 6,
          }}
        />
      </motion.div>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-display font-black text-primary">5</div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Steps</div>
        </div>
      </div>

      {/* Step nodes */}
      {steps.map((step, i) => {
        const angleRad = (step.angle * Math.PI) / 180;
        const x = center + radius * Math.cos(angleRad);
        const y = center + radius * Math.sin(angleRad);
        const Icon = step.icon;
        const stepData = t.howItWorks.steps[i];

        return (
          <motion.div
            key={i}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-secondary border border-primary/30 flex items-center justify-center shadow-[0_0_20px_hsl(155_100%_42%/0.15)]"
              whileHover={{ scale: 1.15, borderColor: "hsl(155 100% 42% / 0.7)" }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="text-[11px] font-display font-bold text-foreground whitespace-nowrap">
              {stepData.title}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default HeroProcessCircle;
