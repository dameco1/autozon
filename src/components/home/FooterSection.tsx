import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { CreditCard, Instagram } from "lucide-react";

const PaymentSvg: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="bg-white rounded px-2 py-1.5 flex items-center justify-center h-8 min-w-[48px]" title={label}>
    {children}
  </div>
);

const FooterSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-9 bg-foreground border-t border-foreground/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-white">
              auto<span className="text-orange">zon</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/autozon.at/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-orange transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <p className="text-white/40 text-sm">{t.footer.copyright}</p>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mb-6">
          <p className="text-xs text-white/40 text-center mb-3">We accept</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <PaymentSvg label="Visa / Mastercard">
              <CreditCard className="h-4 w-4 text-gray-700" />
            </PaymentSvg>
            <PaymentSvg label="Amazon Pay">
              <svg viewBox="0 0 40 16" className="h-4 w-auto"><text x="0" y="13" fontSize="12" fontWeight="bold" fill="#FF9900" fontFamily="Arial">a</text><text x="9" y="13" fontSize="9" fill="#232F3E" fontFamily="Arial">pay</text></svg>
            </PaymentSvg>
            <PaymentSvg label="Apple Pay">
              <svg viewBox="0 0 40 16" className="h-4 w-auto"><text x="0" y="13" fontSize="11" fontWeight="bold" fill="#000" fontFamily="Arial"></text><text x="12" y="13" fontSize="9" fill="#000" fontFamily="Arial">Pay</text></svg>
            </PaymentSvg>
            <PaymentSvg label="Google Pay">
              <svg viewBox="0 0 44 16" className="h-4 w-auto"><text x="0" y="13" fontSize="11" fontWeight="bold" fill="#4285F4" fontFamily="Arial">G</text><text x="12" y="13" fontSize="9" fill="#5F6368" fontFamily="Arial">Pay</text></svg>
            </PaymentSvg>
            <PaymentSvg label="Link">
              <svg viewBox="0 0 32 16" className="h-4 w-auto"><text x="0" y="13" fontSize="11" fontWeight="bold" fill="#00D66E" fontFamily="Arial">Link</text></svg>
            </PaymentSvg>
            <PaymentSvg label="PayPal">
              <svg viewBox="0 0 40 16" className="h-4 w-auto"><text x="0" y="13" fontSize="10" fontWeight="bold" fill="#003087" fontFamily="Arial">Pay</text><text x="20" y="13" fontSize="10" fontWeight="bold" fill="#009CDE" fontFamily="Arial">Pal</text></svg>
            </PaymentSvg>
            <PaymentSvg label="Bancontact">
              <svg viewBox="0 0 20 16" className="h-4 w-auto"><rect width="20" height="16" rx="2" fill="#005498"/><text x="3" y="12" fontSize="8" fontWeight="bold" fill="#fff" fontFamily="Arial">BC</text></svg>
            </PaymentSvg>
            <PaymentSvg label="EPS">
              <svg viewBox="0 0 24 16" className="h-4 w-auto"><rect width="24" height="16" rx="2" fill="#C8036F"/><text x="3" y="12" fontSize="8" fontWeight="bold" fill="#fff" fontFamily="Arial">eps</text></svg>
            </PaymentSvg>
            <PaymentSvg label="Klarna">
              <svg viewBox="0 0 36 16" className="h-4 w-auto"><rect width="36" height="16" rx="2" fill="#FFB3C7"/><text x="4" y="12" fontSize="9" fontWeight="bold" fill="#0A0B09" fontFamily="Arial">Klarna</text></svg>
            </PaymentSvg>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/40 mb-8">
          <Link to="/privacy-policy" className="hover:text-orange transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-orange transition-colors">Terms & Conditions</Link>
          <span>·</span>
          <Link to="/cookie-policy" className="hover:text-orange transition-colors">Cookie Policy</Link>
          <span>·</span>
          <Link to="/impressum" className="hover:text-orange transition-colors">Impressum</Link>
          <span>·</span>
          <button
            onClick={() => {
              localStorage.removeItem("autozon-cookie-consent");
              window.location.reload();
            }}
            className="hover:text-orange transition-colors"
          >
            Cookie Settings
          </button>
        </div>

        {/* Footnotes / Disclaimers */}
        {t.hero.footnotes && (
          <div className="border-t border-white/10 pt-5 space-y-1.5">
            {t.hero.footnotes.map((note, i) => (
              <p key={i} className="text-[10px] leading-relaxed text-white/30">
                {note}
              </p>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};

export default FooterSection;
