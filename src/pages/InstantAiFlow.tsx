import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";

const InstantAiFlow: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileCount = (location.state as any)?.fileCount || 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <SEO path="/instant-ai-flow" description="AI-powered car valuation and listing draft." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center mx-auto mb-8">
          <Loader2 className="w-7 h-7 text-orange animate-spin" />
        </div>

        <h1 className="text-3xl font-display font-black text-foreground">
          Analyzing Your Car
        </h1>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          {fileCount > 0
            ? `Processing ${fileCount} file${fileCount > 1 ? "s" : ""}. Our AI is extracting vehicle data, detecting condition, and calculating fair market value.`
            : "Upload your car photos and documents to get started."}
        </p>

        <p className="text-muted-foreground/50 text-sm mt-8">
          This is a placeholder — full AI pipeline coming soon.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 inline-flex items-center gap-2 text-orange font-semibold text-sm hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default InstantAiFlow;
