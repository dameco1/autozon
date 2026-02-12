import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Car, ShoppingCart, Tag, ArrowRight, RotateCcw, Play, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const IntentSelection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previousIntent, setPreviousIntent] = useState<string | null>(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [checkingIntent, setCheckingIntent] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUserId(session.user.id);
        supabase
          .from("user_preferences")
          .select("user_intent")
          .eq("user_id", session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.user_intent === "selling" || data?.user_intent === "buying") {
              setPreviousIntent(data.user_intent);
              setShowWelcomeBack(true);
            }
            setCheckingIntent(false);
          });
      }
    });
  }, [navigate]);

  const handleContinue = () => {
    if (previousIntent === "selling") navigate("/car-upload");
    else if (previousIntent === "buying") navigate("/buyer-questionnaire");
  };

  const handleStartFresh = async () => {
    if (!userId) return;
    setLoading(true);
    await supabase
      .from("user_preferences")
      .upsert(
        { user_id: userId, user_intent: null } as any,
        { onConflict: "user_id" }
      );
    setLoading(false);
    setPreviousIntent(null);
    setShowWelcomeBack(false);
  };

  const handleChoice = async (intent: "selling" | "buying") => {
    if (!userId) return;
    setLoading(true);

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

  if (checkingIntent) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="animate-pulse text-silver/40">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <Button
        variant="ghost"
        className="absolute top-6 right-6 text-silver/50 hover:text-white"
        onClick={() => navigate("/dashboard")}
      >
        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
      </Button>
      <AnimatePresence mode="wait">
        {showWelcomeBack ? (
          <motion.div
            key="welcome-back"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg"
          >
            <div className="text-center mb-8">
              <Car className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-display font-bold text-white mb-3">
                {t.intent.welcomeBack}
              </h1>
              <p className="text-silver/60 text-lg">
                {t.intent.welcomeBackDesc.replace(
                  "{intent}",
                  previousIntent === "selling" ? t.intent.selling : t.intent.buying
                )}
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleContinue}
                className="w-full group bg-primary/10 border-2 border-primary hover:bg-primary/20 rounded-2xl p-6 text-left transition-all duration-300 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-bold text-white">
                    {t.intent.continueSession}
                  </h3>
                  <p className="text-silver/50 text-sm">{t.intent.continueDesc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleStartFresh}
                disabled={loading}
                className="w-full group bg-secondary/50 border-2 border-border hover:border-silver/30 rounded-2xl p-6 text-left transition-all duration-300 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <RotateCcw className="h-6 w-6 text-silver/60" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-bold text-white">
                    {t.intent.startFresh}
                  </h3>
                  <p className="text-silver/50 text-sm">{t.intent.startFreshDesc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-silver/40 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="intent-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-3xl"
          >
            <div className="text-center mb-12">
              <Car className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-display font-bold text-white mb-3">
                {t.intent.title}
              </h1>
              <p className="text-silver/60 text-lg">{t.intent.subtitle}</p>
            </div>

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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntentSelection;
