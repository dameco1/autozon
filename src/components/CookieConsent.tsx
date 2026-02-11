import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("autozon-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (type: "all" | "necessary") => {
    localStorage.setItem("autozon-cookie-consent", type);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4"
        >
          <div className="max-w-4xl mx-auto bg-secondary border border-border rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-display font-bold text-white mb-2">We value your privacy</h3>
            <p className="text-sm text-silver/60 mb-4">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
              By clicking "Accept All", you consent to our use of cookies.{" "}
              <Link to="/cookie-policy" className="text-primary hover:underline">Learn more</Link>
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => accept("all")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                Accept All
              </Button>
              <Button
                variant="outline"
                onClick={() => accept("necessary")}
                className="font-semibold"
              >
                Necessary Only
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
