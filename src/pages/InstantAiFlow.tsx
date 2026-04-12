import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Edit3, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const InstantAiFlow: React.FC = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <SEO path="/instant-ai-flow" description="AI-powered car valuation and listing generator." />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.h1
          className="text-3xl sm:text-4xl font-display font-black text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your AI Valuation
        </motion.h1>
        <p className="mt-2 text-black/50">Results generated in seconds.</p>

        {/* AI VALUATION SUMMARY */}
        <motion.div
          className="mt-10 py-8 border-b border-black/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs uppercase tracking-wider text-black/40">Fair Market Value</p>
          <p className="text-5xl font-display font-black text-[#FF6A00] mt-2">€24,500</p>
          <div className="flex gap-8 mt-4">
            <div>
              <p className="text-xs text-black/40">Condition</p>
              <p className="text-sm font-semibold text-black">Very Good</p>
            </div>
            <div>
              <p className="text-xs text-black/40">Damages</p>
              <p className="text-sm font-semibold text-black">Minor scratch (rear bumper)</p>
            </div>
            <div>
              <p className="text-xs text-black/40">Demand</p>
              <p className="text-sm font-semibold text-black">High</p>
            </div>
          </div>
        </motion.div>

        {/* AI DESCRIPTION */}
        <motion.div
          className="mt-8 py-8 border-b border-black/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Edit3 className="h-4 w-4 text-[#FF6A00]" />
            <p className="text-xs uppercase tracking-wider text-black/40">AI-Generated Description</p>
          </div>
          <p className="text-black/70 leading-relaxed">
            2019 BMW 320d in excellent condition with only 45,000 km. Full service history,
            one owner from new. Equipped with LED headlights, navigation, leather seats,
            and parking sensors. Minor cosmetic scratch on rear bumper. A well-maintained
            vehicle at a competitive price.
          </p>
        </motion.div>

        {/* EDITABLE FIELDS */}
        <motion.div
          className="mt-8 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-xs uppercase tracking-wider text-black/40">Listing Details</p>
          {[
            { label: "Make & Model", value: "BMW 320d" },
            { label: "Year", value: "2019" },
            { label: "Mileage", value: "45,000 km" },
            { label: "Price", value: "€24,500" },
          ].map((field) => (
            <div key={field.label} className="flex items-center justify-between py-3 border-b border-black/5">
              <span className="text-sm text-black/50">{field.label}</span>
              <span className="text-sm font-semibold text-black">{field.value}</span>
            </div>
          ))}
        </motion.div>

        {/* EMAIL CONFIRMATION */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-4 w-4 text-[#FF6A00]" />
            <p className="text-xs uppercase tracking-wider text-black/40">
              Confirm &amp; Publish
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-black/10 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-[#FF6A00] transition-colors"
            />
            <Button className="bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white rounded-lg px-6">
              Publish <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-black/30">
            We'll send a confirmation link. No password needed.
          </p>
        </motion.div>

        {/* SUCCESS PLACEHOLDER */}
        <motion.div
          className="mt-16 flex items-center gap-3 text-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <CheckCircle className="h-5 w-5 text-[#FF6A00]" />
          <p className="text-sm">Your listing will be live in under 60 seconds.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default InstantAiFlow;
