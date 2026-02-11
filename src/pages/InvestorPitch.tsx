import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize, Minimize, ArrowLeft } from "lucide-react";
import SlideLayout from "@/components/pitch/SlideLayout";
import { allSlides } from "@/components/pitch/slides";

const InvestorPitch = () => {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();
  const total = allSlides.length;

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "Escape" && isFullscreen) { document.exitFullscreen().catch(() => {}); }
      else if (e.key === "F5") { e.preventDefault(); toggleFullscreen(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, isFullscreen, toggleFullscreen]);

  const SlideComponent = allSlides[current];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-charcoal select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <SlideLayout>
            <SlideComponent />
          </SlideLayout>
        </motion.div>
      </AnimatePresence>

      {/* Controls overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-full px-6 py-3 z-50">
        <button onClick={prev} disabled={current === 0} className="text-white/60 hover:text-white disabled:opacity-30 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="text-white/80 text-sm font-mono min-w-[60px] text-center">
          {current + 1} / {total}
        </span>
        <button onClick={next} disabled={current === total - 1} className="text-white/60 hover:text-white disabled:opacity-30 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Top-left: back */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-50 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Top-right: fullscreen */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-50 text-white/40 hover:text-white transition-colors"
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>
    </div>
  );
};

export default InvestorPitch;
