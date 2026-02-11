import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Car, ShoppingCart, Tag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const IntentSelection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUserId(session.user.id);
        // Check if user already has an intent set
        supabase
          .from("user_preferences")
          .select("user_intent")
          .eq("user_id", session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.user_intent === "selling") navigate("/car-upload");
            else if (data?.user_intent === "buying") navigate("/buyer-questionnaire");
          });
      }
    });
  }, [navigate]);

  const handleChoice = async (intent: "selling" | "buying") => {
    if (!userId) return;
    setLoading(true);

    // Upsert user_preferences with intent
    const { error } = await supabase
      .from("user_preferences")
      .upsert(
        { user_id: userId, user_intent: intent } as any,
        { onConflict: "user_id" }
      );

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    if (intent === "selling") navigate("/car-upload");
    else navigate("/buyer-questionnaire");
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Car className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-display font-bold text-white mb-3">
            {t.intent.title}
          </h1>
          <p className="text-silver/60 text-lg">{t.intent.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => handleChoice("selling")}
            disabled={loading}
            className="group relative bg-secondary/50 border-2 border-border hover:border-primary rounded-2xl p-8 text-left transition-all duration-300 hover:bg-secondary/80"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Tag className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              {t.intent.selling}
            </h2>
            <p className="text-silver/60 mb-6">{t.intent.sellingDesc}</p>
            <div className="flex items-center text-primary font-medium text-sm">
              {t.intent.sellingCta} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => handleChoice("buying")}
            disabled={loading}
            className="group relative bg-secondary/50 border-2 border-border hover:border-primary rounded-2xl p-8 text-left transition-all duration-300 hover:bg-secondary/80"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              {t.intent.buying}
            </h2>
            <p className="text-silver/60 mb-6">{t.intent.buyingDesc}</p>
            <div className="flex items-center text-primary font-medium text-sm">
              {t.intent.buyingCta} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default IntentSelection;
