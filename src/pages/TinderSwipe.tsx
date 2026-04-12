import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Info } from "lucide-react";
import SEO from "@/components/SEO";

const CARDS = [
  { id: 1, make: "BMW 320d", year: 2019, price: "€24,500", mileage: "45k km", fuel: "Diesel" },
  { id: 2, make: "Audi A4 Avant", year: 2020, price: "€28,900", mileage: "38k km", fuel: "Petrol" },
  { id: 3, make: "Mercedes C200", year: 2021, price: "€31,200", mileage: "22k km", fuel: "Hybrid" },
  { id: 4, make: "VW Golf GTI", year: 2022, price: "€35,000", mileage: "12k km", fuel: "Petrol" },
  { id: 5, make: "Tesla Model 3", year: 2023, price: "€38,500", mileage: "8k km", fuel: "Electric" },
];

const TinderSwipe: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const handleSwipe = (dir: "left" | "right") => {
    setDirection(dir);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
    }, 300);
  };

  const card = CARDS[currentIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <SEO path="/tinder" description="Swipe to find your next car. No login required." />

      <h1 className="text-2xl font-display font-black text-black mb-2">Find Your Car</h1>
      <p className="text-sm text-black/40 mb-10">Swipe right to like, left to skip</p>

      <div className="relative w-80 h-[480px]">
        <AnimatePresence>
          {card && (
            <motion.div
              key={card.id}
              className="absolute inset-0 rounded-2xl bg-white flex flex-col justify-between p-8"
              style={{ border: "1px solid rgba(0,0,0,0.08)" }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
              exit={{
                x: direction === "right" ? 300 : -300,
                rotate: direction === "right" ? 15 : -15,
                opacity: 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Placeholder image area */}
              <div className="w-full h-48 rounded-xl bg-black/[0.03] flex items-center justify-center">
                <span className="text-black/20 text-sm">Photo</span>
              </div>

              <div className="mt-6 flex-1">
                <p className="text-2xl font-display font-bold text-black">{card.make}</p>
                <p className="text-[#FF6A00] text-xl font-bold mt-1">{card.price}</p>
                <div className="flex gap-4 mt-4 text-sm text-black/50">
                  <span>{card.year}</span>
                  <span>·</span>
                  <span>{card.mileage}</span>
                  <span>·</span>
                  <span>{card.fuel}</span>
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-6">
                <button
                  onClick={() => handleSwipe("left")}
                  className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center hover:border-red-400 hover:text-red-400 transition-colors"
                >
                  <X className="h-7 w-7" />
                </button>
                <button
                  onClick={() => handleSwipe("right")}
                  className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center hover:border-green-500 hover:text-green-500 transition-colors"
                >
                  <Heart className="h-7 w-7" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!card && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-black/40 text-lg">No more cars to show</p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="mt-4 text-[#FF6A00] font-semibold text-sm hover:underline"
            >
              Start over
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-black/30">
        {CARDS.length - currentIndex} cars remaining
      </p>
    </div>
  );
};

export default TinderSwipe;
