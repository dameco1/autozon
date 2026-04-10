import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Instagram } from "lucide-react";

import amazonImg from "@/assets/payments/amazon.png";
import applepayImg from "@/assets/payments/applepay.png";
import googlepayImg from "@/assets/payments/googlepay.png";
import paypalImg from "@/assets/payments/paypal.png";
import klarnaImg from "@/assets/payments/klarna.png";

const PaymentCard: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="bg-white rounded-lg border border-white/20 shadow-sm px-3 py-2 flex items-center justify-center h-10 min-w-[56px]" title={label}>
    {children}
  </div>
);

const paymentImages = [
  { label: "Amazon Pay", src: amazonImg },
  { label: "Apple Pay", src: applepayImg },
  { label: "Google Pay", src: googlepayImg },
  { label: "PayPal", src: paypalImg },
  { label: "Klarna", src: klarnaImg },
];

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
            {/* SVG-based icons */}
            <PaymentCard label="Stripe">
              <svg viewBox="0 0 60 25" className="h-5 w-auto"><text x="0" y="20" fontSize="20" fontWeight="bold" fill="#635BFF" fontFamily="Arial, sans-serif">stripe</text></svg>
            </PaymentCard>
            <PaymentCard label="Visa">
              <svg viewBox="0 0 48 16" className="h-4 w-auto"><text x="0" y="15" fontSize="18" fontWeight="bold" fontStyle="italic" fill="#1A1F71" fontFamily="Arial, sans-serif">VISA</text></svg>
            </PaymentCard>
            <PaymentCard label="Mastercard">
              <svg viewBox="0 0 36 22" className="h-5 w-auto"><circle cx="12" cy="11" r="10" fill="#EB001B"/><circle cx="24" cy="11" r="10" fill="#F79E1B"/><path d="M18 3.3a10 10 0 010 15.4 10 10 0 010-15.4z" fill="#FF5F00"/></svg>
            </PaymentCard>
            <PaymentCard label="AMEX">
              <svg viewBox="0 0 52 16" className="h-4 w-auto"><rect width="52" height="16" rx="2" fill="#006FCF"/><text x="4" y="12.5" fontSize="11" fontWeight="bold" fill="#fff" fontFamily="Arial, sans-serif">AMEX</text></svg>
            </PaymentCard>
            <PaymentCard label="Discover">
              <svg viewBox="0 0 70 18" className="h-4 w-auto"><text x="0" y="14" fontSize="13" fontWeight="bold" fill="#231F20" fontFamily="Arial, sans-serif">DISC</text><circle cx="42" cy="9" r="7" fill="#F47216"/><text x="47" y="14" fontSize="13" fontWeight="bold" fill="#231F20" fontFamily="Arial, sans-serif">VER</text></svg>
            </PaymentCard>
            <PaymentCard label="Diners Club">
              <svg viewBox="0 0 24 24" className="h-5 w-auto"><circle cx="12" cy="12" r="11" fill="none" stroke="#0079BE" strokeWidth="1.5"/><circle cx="12" cy="12" r="8" fill="none" stroke="#0079BE" strokeWidth="1.5"/><line x1="4" y1="12" x2="20" y2="12" stroke="#0079BE" strokeWidth="1.5"/></svg>
            </PaymentCard>
            {/* Image-based icons */}
            {paymentImages.map((pm) => (
              <PaymentCard key={pm.label} label={pm.label}>
                <img src={pm.src} alt={pm.label} className="h-5 w-auto object-contain" />
              </PaymentCard>
            ))}
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
