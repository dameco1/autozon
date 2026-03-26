import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type CookiePreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export const getCookiePreferences = (): CookiePreferences => {
  try {
    const stored = localStorage.getItem("autozon-cookie-consent");
    if (stored === "all") return { essential: true, analytics: true, marketing: true, functional: true };
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultPreferences;
};

const CookieConsent: React.FC = () => {
  const { t } = useLanguage();
  const c = t.cookies;
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const consent = localStorage.getItem("autozon-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveAndClose = (prefs: CookiePreferences) => {
    localStorage.setItem("autozon-cookie-consent", JSON.stringify(prefs));
    setVisible(false);
  };

  const acceptAll = () => {
    saveAndClose({ essential: true, analytics: true, marketing: true, functional: true });
  };

  const acceptNecessary = () => {
    saveAndClose(defaultPreferences);
  };

  const saveCustom = () => {
    saveAndClose(preferences);
  };

  const cookieCategories = [
    { key: "essential" as const, label: c.essential, description: c.essentialDesc, locked: true },
    { key: "functional" as const, label: c.functional, description: c.functionalDesc, locked: false },
    { key: "analytics" as const, label: c.analytics, description: c.analyticsDesc, locked: false },
    { key: "marketing" as const, label: c.marketing, description: c.marketingDesc, locked: false },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[59] bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[60] p-4"
          >
            <div className="max-w-2xl mx-auto bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-display font-bold text-foreground">{c.title}</h3>
                    <p className="text-xs text-muted-foreground">{c.gdpr}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {c.description}{" "}
                  <Link to="/privacy-policy" className="text-primary hover:underline">{c.privacyLink}</Link>.{" "}
                  {c.customizeText}
                </p>
              </div>

              <div className="px-6">
                <button
                  onClick={() => setShowCustomize(!showCustomize)}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-3"
                >
                  {showCustomize ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {c.customize}
                </button>

                <AnimatePresence>
                  {showCustomize && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pb-4">
                        {cookieCategories.map((category) => (
                          <div
                            key={category.key}
                            className="flex items-start justify-between gap-4 bg-muted rounded-xl p-4 border border-border"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{category.label}</span>
                                {category.locked && (
                                  <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full font-semibold">
                                    {c.required}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{category.description}</p>
                            </div>
                            <Switch
                              checked={category.locked ? true : preferences[category.key]}
                              onCheckedChange={(checked) => {
                                if (!category.locked) {
                                  setPreferences((prev) => ({ ...prev, [category.key]: checked }));
                                }
                              }}
                              disabled={category.locked}
                              className="mt-1 shrink-0"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-6 pt-3 flex flex-wrap gap-3 border-t border-border">
                <Button
                  onClick={acceptAll}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex-1 sm:flex-none"
                >
                  {c.acceptAll}
                </Button>
                {showCustomize ? (
                  <Button variant="outline" onClick={saveCustom} className="font-semibold flex-1 sm:flex-none">
                    {c.savePreferences}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={acceptNecessary} className="font-semibold flex-1 sm:flex-none">
                    {c.necessaryOnly}
                  </Button>
                )}
                <Link
                  to="/privacy-policy"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors self-center ml-auto"
                >
                  {c.privacyLink}
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
