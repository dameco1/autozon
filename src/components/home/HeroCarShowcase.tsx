import React from "react";
import { motion } from "framer-motion";
import { carImages } from "./carImages";

const cards = [
  { index: 0, rotate: -6, x: -20, y: 20 },
  { index: 1, rotate: 0, x: 0, y: 0 },
  { index: 2, rotate: 5, x: 20, y: 15 },
];

const HeroCarShowcase: React.FC = () => {
  return (
    <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[480px] flex items-center justify-center">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          className="absolute w-[240px] sm:w-[280px] lg:w-[320px] rounded-2xl overflow-hidden shadow-2xl border border-border"
          style={{
            rotate: card.rotate,
            x: card.x,
            y: card.y,
            zIndex: i,
          }}
          animate={{
            y: [card.y, card.y - 12, card.y],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
          whileHover={{ scale: 1.05, zIndex: 10 }}
        >
          <img
            src={carImages[card.index].url}
            alt={carImages[card.index].alt}
            className="w-full h-[160px] sm:h-[190px] lg:h-[220px] object-cover"
            loading="lazy"
          />
          <div className="bg-secondary p-3">
            <div className="h-2 w-3/4 bg-muted rounded-full mb-2" />
            <div className="h-2 w-1/2 bg-muted rounded-full" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HeroCarShowcase;
