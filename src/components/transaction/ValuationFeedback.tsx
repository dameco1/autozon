import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  carId: string;
  agreedPrice: number;
  fairValuePrice: number | null;
}

const ValuationFeedback: React.FC<Props> = ({ carId, agreedPrice, fairValuePrice }) => {
  const { t } = useLanguage();
  const [rating, setRating] = useState<"accurate" | "too_high" | "too_low" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [loading, setLoading] = useState(true);

  const fb = (t as any).transaction?.valuationFeedback ?? {
    title: "Was our valuation accurate?",
    subtitle: "Your feedback helps us improve future estimates.",
    accurate: "Spot on",
    tooHigh: "Too high",
    tooLow: "Too low",
    commentPlaceholder: "Any additional thoughts? (optional)",
    submit: "Submit Feedback",
    thanks: "Thank you for your feedback!",
    thanksDetail: "This helps us calibrate future valuations.",
  };

  const deviation = fairValuePrice && fairValuePrice > 0
    ? Math.round(((agreedPrice - fairValuePrice) / fairValuePrice) * 100)
    : null;

  // Check if feedback was already submitted
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const { data } = await supabase
          .from("appraisal_feedback" as any)
          .select("id, agreed_sale_price, deviation_pct")
          .eq("car_id", carId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && (data as any).agreed_sale_price != null) {
          // Already submitted
          setSubmitted(true);
        }
      } catch (e) {
        console.error("Failed to check existing feedback:", e);
      } finally {
        setLoading(false);
      }
    };
    checkExisting();
  }, [carId]);

  const handleSubmit = async () => {
    try {
      const { data: existing } = await supabase
        .from("appraisal_feedback" as any)
        .select("id")
        .eq("car_id", carId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("appraisal_feedback" as any)
          .update({
            agreed_sale_price: agreedPrice,
            deviation_pct: deviation,
          } as any)
          .eq("id", (existing as any).id);
      }

      setSubmitted(true);
    } catch (e) {
      console.error("Failed to submit feedback:", e);
      setSubmitted(true);
    }
  };

  if (loading) return null;

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center"
      >
        <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
        <p className="font-display font-bold text-foreground text-sm">{fb.thanks}</p>
        <p className="text-muted-foreground text-xs mt-1">{fb.thanksDetail}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary/50 border border-border rounded-2xl p-5"
    >
      <div className="text-center mb-4">
        <h4 className="font-display font-bold text-foreground text-sm flex items-center justify-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          {fb.title}
        </h4>
        <p className="text-muted-foreground text-xs mt-1">{fb.subtitle}</p>
        {deviation !== null && (
          <p className="text-xs text-muted-foreground mt-1">
            Fair value: €{fairValuePrice?.toLocaleString()} → Sold at: €{agreedPrice.toLocaleString()}
            <span className={`ml-1 font-semibold ${deviation > 0 ? "text-green-600" : deviation < 0 ? "text-red-500" : "text-primary"}`}>
              ({deviation > 0 ? "+" : ""}{deviation}%)
            </span>
          </p>
        )}
      </div>

      <div className="flex gap-2 justify-center mb-3">
        {([
          { key: "too_low" as const, label: fb.tooLow, icon: <ThumbsDown className="h-4 w-4 rotate-180" /> },
          { key: "accurate" as const, label: fb.accurate, icon: <ThumbsUp className="h-4 w-4" /> },
          { key: "too_high" as const, label: fb.tooHigh, icon: <ThumbsDown className="h-4 w-4" /> },
        ]).map(({ key, label, icon }) => (
          <Button
            key={key}
            variant={rating === key ? "default" : "outline"}
            size="sm"
            className={`rounded-xl text-xs gap-1.5 ${rating === key ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => { setRating(key); setShowComment(true); }}
          >
            {icon} {label}
          </Button>
        ))}
      </div>

      <AnimatePresence>
        {showComment && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Textarea
              placeholder={fb.commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-3 text-sm rounded-xl resize-none"
              rows={2}
            />
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl"
              size="sm"
              onClick={handleSubmit}
              disabled={!rating}
            >
              {fb.submit}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ValuationFeedback;
