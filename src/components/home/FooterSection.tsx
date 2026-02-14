import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const FooterSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-12 bg-charcoal border-t border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white">
              auto<span className="text-primary">zon</span>
            </span>
            <span className="text-silver/40 text-sm ml-2">{t.footer.tagline}</span>
          </div>
          <p className="text-silver/40 text-sm">{t.footer.copyright}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-silver/40">
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          <span>·</span>
          <Link to="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link>
          <span>·</span>
          <Link to="/impressum" className="hover:text-primary transition-colors">Impressum</Link>
          <span>·</span>
          <button
            onClick={() => {
              localStorage.removeItem("autozon-cookie-consent");
              window.location.reload();
            }}
            className="hover:text-primary transition-colors"
          >
            Cookie Settings
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
