import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Instagram } from "lucide-react";

import cardsImg from "@/assets/payments/cards.png";
import amazonImg from "@/assets/payments/amazon.png";
import applepayImg from "@/assets/payments/applepay.png";
import googlepayImg from "@/assets/payments/googlepay.png";
import linkImg from "@/assets/payments/link.png";
import paypalImg from "@/assets/payments/paypal.png";
import bancontactImg from "@/assets/payments/bancontact.png";
import epsImg from "@/assets/payments/eps.png";
import klarnaImg from "@/assets/payments/klarna.png";

const paymentMethods = [
  { label: "Cards", src: cardsImg },
  { label: "Amazon Pay", src: amazonImg },
  { label: "Apple Pay", src: applepayImg },
  { label: "Google Pay", src: googlepayImg },
  { label: "Link", src: linkImg },
  { label: "PayPal", src: paypalImg },
  { label: "Bancontact", src: bancontactImg },
  { label: "EPS", src: epsImg },
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
          <div className="flex flex-wrap items-center justify-center gap-3">
            {paymentMethods.map((pm) => (
              <img key={pm.label} src={pm.src} alt={pm.label} title={pm.label} className="h-6 w-auto object-contain" />
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
