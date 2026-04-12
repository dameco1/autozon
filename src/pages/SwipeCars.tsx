import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";

const sampleCars = [
  { id: 1, make: "BMW", model: "330i Touring", year: 2021, price: 28400, mileage: "42,000 km", fuel: "Petrol" },
  { id: 2, make: "Audi", model: "A4 Avant 40 TDI", year: 2020, price: 24900, mileage: "68,000 km", fuel: "Diesel" },
  { id: 3, make: "Mercedes", model: "C 200", year: 2022, price: 33500, mileage: "21,000 km", fuel: "Petrol" },
  { id: 4, make: "VW", model: "Golf GTI", year: 2022, price: 31200, mileage: "15,000 km", fuel: "Petrol" },
  { id: 5, make: "Skoda", model: "Octavia RS", year: 2021, price: 26800, mileage: "35,000 km", fuel: "Diesel" },
];

const SwipeCars: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const currentCar = sampleCars[currentIndex];
  const isFinished = currentIndex >= sampleCars.length;

  const handleSwipe = (dir: "left" | "right") => {
    setDirection(dir);
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setDirection(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <SEO path="/swipe" description="Swipe through fairly priced, AI-verified cars." />

      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-muted-foreground text-sm mb-10 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>

        {isFinished ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl font-display font-bold text-foreground">No more cars</p>
            <p className="text-muted-foreground mt-2">Check back soon for new listings.</p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="mt-6 text-orange font-semibold text-sm"
            >
              Start Over
            </button>
          </motion.div>
        ) : (
          <>
            <div className="relative h-[420px]">
              <AnimatePresence>
                <motion.div
                  key={currentCar.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: direction === "left" ? -300 : direction === "right" ? 300 : 0,
                    rotate: direction === "left" ? -8 : direction === "right" ? 8 : 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 rounded-2xl bg-foreground/[0.03] p-8 flex flex-col justify-between"
                >
                  {/* Placeholder image area */}
                  <div className="h-40 rounded-xl bg-foreground/[0.05] flex items-center justify-center">
                    <span className="text-muted-foreground/30 text-sm">Photo</span>
                  </div>

                  <div className="mt-6">
                    <p className="text-2xl font-display font-bold text-foreground">
                      {currentCar.make} {currentCar.model}
                    </p>
                    <p className="text-muted-foreground mt-1">{currentCar.year} · {currentCar.mileage} · {currentCar.fuel}</p>
                  </div>

                  <div className="mt-auto pt-4">
                    <p className="text-3xl font-display font-black text-foreground">
                      €{currentCar.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground/50 mt-1">AI-verified fair price</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <button
                onClick={() => handleSwipe("left")}
                className="w-14 h-14 rounded-full border-2 border-foreground/10 flex items-center justify-center hover:border-destructive hover:bg-destructive/5 transition-all"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
              <button
                onClick={() => handleSwipe("right")}
                className="w-14 h-14 rounded-full border-2 border-foreground/10 flex items-center justify-center hover:border-orange hover:bg-orange/5 transition-all"
              >
                <Heart className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            <p className="text-center text-muted-foreground/40 text-xs mt-6">
              {currentIndex + 1} / {sampleCars.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SwipeCars;
