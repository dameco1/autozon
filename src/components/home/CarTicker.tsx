import React from "react";
import { carImages } from "./carImages";

const CarTicker: React.FC = () => {
  const doubled = [...carImages, ...carImages];

  return (
    <section className="py-10 bg-charcoal overflow-hidden">
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
          {doubled.map((car, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[200px] sm:w-[260px] rounded-xl overflow-hidden border border-border shadow-lg"
            >
              <img
                src={car.url}
                alt={car.alt}
                className="w-full h-[120px] sm:h-[150px] object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarTicker;
