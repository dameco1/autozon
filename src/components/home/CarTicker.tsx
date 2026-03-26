import React from "react";
import { carImages } from "./carImages";
import { Megaphone } from "lucide-react";

const AdCard: React.FC = () => (
  <div className="flex-shrink-0 w-[200px] sm:w-[260px] rounded-xl overflow-hidden border border-primary/30 shadow-lg bg-gradient-to-br from-primary/20 via-secondary to-primary/10 flex flex-col items-center justify-center h-[120px] sm:h-[150px] p-4 text-center gap-2 group hover:border-primary/60 transition-all">
    <Megaphone className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
    <span className="text-xs sm:text-sm font-display font-bold text-foreground leading-tight">
      This could be <span className="text-primary">your ad</span> right here
    </span>
    <span className="text-[10px] text-muted-foreground">Reach thousands of car buyers & sellers</span>
  </div>
);

const CarTicker: React.FC = () => {
  // Interleave: car, ad, car, ad, ...
  const interleaved: Array<{ type: "car"; index: number } | { type: "ad" }> = [];
  carImages.forEach((_, i) => {
    interleaved.push({ type: "car", index: i });
    interleaved.push({ type: "ad" });
  });
  const doubled = [...interleaved, ...interleaved];

  return (
    <section className="py-10 bg-secondary overflow-hidden">
      <div
        className="relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="flex gap-6 animate-ticker">
          {doubled.map((item, i) =>
            item.type === "car" ? (
              <div
                key={`car-${i}`}
                className="flex-shrink-0 w-[200px] sm:w-[260px] rounded-xl overflow-hidden border border-border shadow-lg"
              >
                <img
                  src={carImages[item.index].url}
                  alt={carImages[item.index].alt}
                  className="w-full h-[120px] sm:h-[150px] object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <AdCard key={`ad-${i}`} />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default CarTicker;
