import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { CreditCard, Instagram } from "lucide-react";

const PaymentIcon: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center gap-1.5 bg-white/10 rounded px-2 py-1" title={label}>
    {children}
    <span className="text-[11px] text-white/60">{label}</span>
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
            <PaymentIcon label="Cards">
              <CreditCard className="h-4 w-4 text-white/70" />
            </PaymentIcon>
            <PaymentIcon label="Amazon Pay">
              <span className="text-sm font-bold text-white/70">a</span>
            </PaymentIcon>
            <PaymentIcon label="Apple Pay">
              <span className="text-sm font-bold text-white/70"></span>
            </PaymentIcon>
            <PaymentIcon label="Google Pay">
              <span className="text-[11px] font-semibold text-white/70">G Pay</span>
            </PaymentIcon>
            <PaymentIcon label="Link">
              <span className="text-sm font-bold text-[#00D66E]">⟶</span>
            </PaymentIcon>
            <PaymentIcon label="PayPal">
              <span className="text-sm font-bold text-[#009cde]">P</span>
            </PaymentIcon>
            <PaymentIcon label="Bancontact">
              <span className="text-[11px] font-bold text-white/70">BC</span>
            </PaymentIcon>
            <PaymentIcon label="EPS">
              <span className="text-[11px] font-bold text-white/70">eps</span>
            </PaymentIcon>
            <PaymentIcon label="Klarna">
              <span className="text-sm font-bold text-[#FFB3C7]">K</span>
            </PaymentIcon>
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
