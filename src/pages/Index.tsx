import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ArrowRight, HelpCircle, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CookieConsent from "@/components/CookieConsent";
import ConciergeChat from "@/components/ConciergeChat";
import SEO from "@/components/SEO";

const startInstantAIFlow = (files: File[]) => {
  console.log("Starting AI flow with", files.length, "files");
};

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(files);
      startInstantAIFlow(files);
      navigate("/instant-ai-flow");
    },
    [navigate]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(files);
      startInstantAIFlow(files);
      navigate("/instant-ai-flow");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        path="/"
        description="Sell your car in 60 seconds. AI-powered valuations, no account needed."
      />

      {/* HERO */}
      <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 lg:px-0">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-[68px] font-display font-black text-black leading-[1.08] tracking-tight text-center max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Sell Your Car in 60&nbsp;Seconds.
          <br />
          <span className="text-[#FF6A00]">No Account Needed.</span>
        </motion.h1>

        <motion.p
          className="mt-5 text-lg sm:text-xl text-black/60 text-center max-w-lg font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Drop your photos, license, and registration — we do the rest.
        </motion.p>

        {/* DROP ZONE */}
        <motion.div
          className={`mt-12 w-full max-w-xl aspect-[16/9] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-[#FF6A00] bg-[#FF6A00]/5 scale-[1.02]"
              : "border-black/15 hover:border-[#FF6A00]/50"
          }`}
          style={{
            border: "2px dashed",
            borderColor: isDragging ? "#FF6A00" : "rgba(0,0,0,0.15)",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Upload className="h-10 w-10 text-[#FF6A00]" />
          </motion.div>
          <p className="mt-4 text-sm text-black/50 text-center px-6">
            Drag &amp; drop car photos, driving license &amp; registration
          </p>
          <p className="mt-1 text-xs text-black/30">or click to browse files</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
        </motion.div>
      </section>

      {/* BROWSE SECTION */}
      <section className="py-24 px-6 lg:px-0 flex flex-col items-center">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-black text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Browse Cars Like <span className="text-[#FF6A00]">Tinder</span>
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-black/50 text-center max-w-md font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Swipe to find your next car. No login required.
        </motion.p>

        {/* CARD STACK PREVIEW */}
        <div className="relative mt-14 w-72 h-96">
          {[2, 1, 0].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-2xl bg-white flex flex-col items-center justify-end pb-8"
              style={{
                border: "1px solid rgba(0,0,0,0.08)",
                zIndex: 3 - i,
                transform: `translateY(${i * -8}px) scale(${1 - i * 0.04})`,
                opacity: 1 - i * 0.15,
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/5 to-transparent" />
              <div className="absolute top-6 left-6 right-6 text-left z-10">
                <p className="text-xs text-black/40 uppercase tracking-wider">
                  {["BMW 320d", "Audi A4", "Mercedes C200"][i]}
                </p>
                <p className="text-2xl font-display font-bold text-black mt-1">
                  {["€24,500", "€28,900", "€31,200"][i]}
                </p>
              </div>
              {i === 0 && (
                <div className="flex gap-6 z-10">
                  <button className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center hover:border-red-400 hover:text-red-400 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                  <button className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center hover:border-green-500 hover:text-green-500 transition-colors">
                    <Heart className="h-6 w-6" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <Button
          className="mt-10 bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white rounded-full px-8 py-6 text-base font-semibold"
          onClick={() => navigate("/tinder")}
        >
          Start Browsing <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      {/* FLOATING HELP ICONS */}
      <div className="fixed bottom-24 left-6 flex flex-col gap-3 z-40">
        <button
          onClick={() => setShowSellModal(true)}
          className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-black/80 transition-colors"
          title="How selling works"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowMatchModal(true)}
          className="w-11 h-11 rounded-full bg-[#FF6A00] text-white flex items-center justify-center shadow-lg hover:bg-[#FF6A00]/80 transition-colors"
          title="How matching works"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* SELL MODAL */}
      <Dialog open={showSellModal} onOpenChange={setShowSellModal}>
        <DialogContent className="bg-white border-none shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold text-black">
              How Selling Works
            </DialogTitle>
            <DialogDescription className="text-black/50">
              Three steps. No account required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {[
              { step: "01", title: "Drop Your Files", desc: "Upload car photos, license, and registration." },
              { step: "02", title: "AI Does the Work", desc: "We extract data, detect damages, and calculate fair value." },
              { step: "03", title: "Confirm & Go Live", desc: "Review your listing, enter your email, and publish." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <span className="text-[#FF6A00] font-display font-black text-lg w-8">{s.step}</span>
                <div>
                  <p className="font-semibold text-black">{s.title}</p>
                  <p className="text-sm text-black/50">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* MATCH MODAL */}
      <Dialog open={showMatchModal} onOpenChange={setShowMatchModal}>
        <DialogContent className="bg-white border-none shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold text-black">
              How Matching Works
            </DialogTitle>
            <DialogDescription className="text-black/50">
              Like Tinder, but for cars.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {[
              { step: "01", title: "Swipe Cars", desc: "Like or skip cars based on your taste and budget." },
              { step: "02", title: "AI Learns You", desc: "Our engine refines suggestions after every swipe." },
              { step: "03", title: "Make an Offer", desc: "Found the one? Submit an offer — we handle the negotiation." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <span className="text-[#FF6A00] font-display font-black text-lg w-8">{s.step}</span>
                <div>
                  <p className="font-semibold text-black">{s.title}</p>
                  <p className="text-sm text-black/50">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <CookieConsent />
      <ConciergeChat />
    </div>
  );
};

export default Index;
