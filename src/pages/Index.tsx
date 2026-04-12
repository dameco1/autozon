import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Info, ArrowRight, Car, Camera, FileText, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CookieConsent from "@/components/CookieConsent";
import SEO from "@/components/SEO";

const startInstantAIFlow = (files: File[]) => {
  console.log("Starting AI flow with", files.length, "files");
};

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setDroppedFiles(files);
      startInstantAIFlow(files);
      navigate("/instant-ai-flow", { state: { fileCount: files.length } });
    }
  }, [navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setDroppedFiles(files);
      startInstantAIFlow(files);
      navigate("/instant-ai-flow", { state: { fileCount: files.length } });
    }
  };

  const previewCars = [
    { make: "BMW", model: "330i", year: 2021, price: "€28,400", color: "bg-foreground/5" },
    { make: "Audi", model: "A4 Avant", year: 2020, price: "€24,900", color: "bg-foreground/[0.03]" },
    { make: "VW", model: "Golf GTI", year: 2022, price: "€31,200", color: "bg-foreground/[0.02]" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        path="/"
        description="Sell your car in 60 seconds with AI-powered valuations. Or swipe to find your next car — no login required."
      />

      {/* Hero */}
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">
        {/* Left — Sell */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 lg:py-0">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-medium tracking-[0.15em] uppercase text-orange mb-6"
          >
            Sell
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[56px] font-display font-black leading-[1.08] tracking-tight text-foreground max-w-[560px]"
          >
            Start Selling Your Car in 60&nbsp;Seconds
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-lg text-muted-foreground max-w-[440px] leading-relaxed"
          >
            Drop your photos, license, and registration — we do the rest.
          </motion.p>

          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 max-w-[520px]"
          >
            <div
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300
                ${isDragging
                  ? "border-orange bg-orange/[0.04] scale-[1.01]"
                  : "border-foreground/15 hover:border-orange/50 hover:bg-foreground/[0.01]"
                }
                px-8 py-14 text-center group
              `}
            >
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-2xl animate-[pulse_3s_ease-in-out_infinite] border border-orange/10 pointer-events-none" />

              <div className="flex items-center justify-center gap-4 mb-5">
                <Camera className="w-5 h-5 text-muted-foreground group-hover:text-orange transition-colors" />
                <FileText className="w-5 h-5 text-muted-foreground group-hover:text-orange transition-colors" />
                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-orange transition-colors" />
              </div>

              <p className="text-foreground font-semibold text-base">
                Drag photos & documents here
              </p>
              <p className="text-muted-foreground text-sm mt-1.5">
                or click to browse
              </p>
              <p className="text-muted-foreground/60 text-xs mt-4">
                Car photos · Driving license · Registration
              </p>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-foreground/[0.06] my-24" />

        {/* Right — Browse */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 lg:py-0">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm font-medium tracking-[0.15em] uppercase text-orange mb-6"
          >
            Browse
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-[44px] font-display font-black leading-[1.1] tracking-tight text-foreground max-w-[480px]"
          >
            Swipe to Find Your Next Car
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-5 text-lg text-muted-foreground max-w-[400px] leading-relaxed"
          >
            Browse instantly. No login required.
          </motion.p>

          {/* Preview stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 max-w-[400px]"
          >
            <div className="relative">
              {previewCars.map((car, i) => (
                <div
                  key={i}
                  className="relative rounded-xl bg-foreground/[0.03] px-6 py-5 mb-2 last:mb-0 flex items-center justify-between group hover:bg-foreground/[0.05] transition-colors cursor-pointer"
                  style={{ transform: `translateX(${i * 4}px)` }}
                >
                  <div>
                    <p className="font-semibold text-foreground text-[15px]">
                      {car.make} {car.model}
                    </p>
                    <p className="text-muted-foreground text-sm mt-0.5">{car.year}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-foreground font-bold text-[15px]">{car.price}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-orange transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/swipe")}
              className="mt-6 inline-flex items-center gap-2 text-orange font-semibold text-[15px] hover:gap-3 transition-all duration-300"
            >
              Start Browsing <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Floating info icons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-11 h-11 rounded-full bg-foreground text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform" aria-label="How selling works">
              <Car className="w-5 h-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">How Selling Works</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              {[
                { step: "1", title: "Upload", desc: "Drop photos of your car plus your license and registration." },
                { step: "2", title: "AI Valuation", desc: "Our AI analyzes condition, specs, and market data in seconds." },
                { step: "3", title: "Go Live", desc: "Review the draft listing and publish — €49 flat fee, live until sold." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange text-white font-bold text-sm flex items-center justify-center">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{s.title}</p>
                    <p className="text-muted-foreground text-sm mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <button className="w-11 h-11 rounded-full bg-foreground text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform" aria-label="How matching works">
              <Info className="w-5 h-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">How Matching Works</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              {[
                { step: "1", title: "Browse", desc: "Swipe through AI-verified, fairly priced cars — no account needed." },
                { step: "2", title: "Shortlist", desc: "Save the ones you love. Compare specs, price, and condition side by side." },
                { step: "3", title: "Connect", desc: "Make an offer directly to the seller. Negotiate, pay, done." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange text-white font-bold text-sm flex items-center justify-center">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{s.title}</p>
                    <p className="text-muted-foreground text-sm mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CookieConsent />
    </div>
  );
};

export default Index;
