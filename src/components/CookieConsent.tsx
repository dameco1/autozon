import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";

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
    {
      key: "essential" as const,
      label: "Essential Cookies",
      description: "Required for the website to function. These include session management, authentication, and security cookies. Cannot be disabled.",
      locked: true,
    },
    {
      key: "functional" as const,
      label: "Functional Cookies",
      description: "Enable enhanced functionality such as language preferences, saved car searches, and personalized settings.",
      locked: false,
    },
    {
      key: "analytics" as const,
      label: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website by collecting anonymous usage data including page views, session duration, and navigation paths.",
      locked: false,
    },
    {
      key: "marketing" as const,
      label: "Marketing Cookies",
      description: "Used to track visitors across websites to display relevant advertisements. These cookies may share data with third-party advertising partners.",
      locked: false,
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop overlay */}
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
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-display font-bold text-white">Your Privacy Matters</h3>
                    <p className="text-xs text-silver/50">GDPR Compliant</p>
                  </div>
                </div>
                <p className="text-sm text-silver/60 leading-relaxed">
                  We use cookies and similar technologies to provide our services, enhance your experience, and analyze usage.
                  As a car marketplace, we process vehicle data and personal information in accordance with the{" "}
                  <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                  You can customize your preferences below or accept/reject non-essential cookies.
                </p>
              </div>

              {/* Customize panel */}
              <div className="px-6">
                <button
                  onClick={() => setShowCustomize(!showCustomize)}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-3"
                >
                  {showCustomize ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  Customize Cookie Preferences
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
                            className="flex items-start justify-between gap-4 bg-charcoal/50 rounded-xl p-4 border border-border"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white">{category.label}</span>
                                {category.locked && (
                                  <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full font-semibold">
                                    Required
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-silver/50 mt-1 leading-relaxed">{category.description}</p>
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

              {/* Actions */}
              <div className="p-6 pt-3 flex flex-wrap gap-3 border-t border-border">
                <Button
                  onClick={acceptAll}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex-1 sm:flex-none"
                >
                  Accept All
                </Button>
                {showCustomize ? (
                  <Button
                    variant="outline"
                    onClick={saveCustom}
                    className="font-semibold flex-1 sm:flex-none"
                  >
                    Save Preferences
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={acceptNecessary}
                    className="font-semibold flex-1 sm:flex-none"
                  >
                    Necessary Only
                  </Button>
                )}
                <Link
                  to="/privacy-policy"
                  className="text-xs text-silver/40 hover:text-primary transition-colors self-center ml-auto"
                >
                  Privacy Policy
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
