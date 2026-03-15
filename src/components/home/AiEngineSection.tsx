import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const AiEngineSection: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const content = language === "de" ? {
    badge: "ANGETRIEBEN VON KI",
    title: "Der smarteste Weg, ein Auto zu kaufen oder verkaufen",
    subtitle: "Wir haben eine KI gebaut, die den Automarkt wirklich versteht. Echtzeit-Preise. Smartes Käufer-Matching. Eine Pauschalgebühr. Kein Ablaufdatum für dein Inserat.",
    seller: {
      badge: "FÜR VERKÄUFER",
      title: "Kenne deinen Preis. Inseriere mit Vertrauen.",
      body: "Lade Fotos und Fahrzeugdaten hoch. Unsere KI scannt echte Marktdaten — Zustand, Kilometerstand, Nachfrage — und gibt dir den wahren Wert deines Autos in Sekunden.\nKein Händler-Tiefpreis. Keine wilde Schätzung.\nDein tatsächlicher Marktpreis.\n\nDann geht dein Inserat live — und bleibt live, bis dein Auto verkauft ist. Keine Zeitlimits. Keine Neu-Einstellungsgebühren.\nEchte Käufer finden dich.",
      cta: "Auto inserieren — €49 Pauschal →",
    },
    buyer: {
      badge: "FÜR KÄUFER",
      title: "Finde das richtige Auto. Überspringe das Scrollen.",
      body: "Sag uns, was du willst — Budget, Typ, Lebensstil. Unsere KI matcht dich mit den richtigen Autos aus echten, verifizierten Inseraten. Kein Lärm. Kein Spam.\nNur die Autos, die wirklich zu dir passen.\n\nDas Richtige gefunden? Verhandle direkt mit dem Verkäufer.\nUnd wenn es unter €10.000 liegt — zahle per Karte, direkt hier.\nKein Überweisungs-Aufwand. Erledigt.",
      cta: "Mein perfektes Auto finden →",
    },
  } : {
    badge: "POWERED BY AI",
    title: "The Smartest Way to Buy or Sell a Car",
    subtitle: "We built AI that actually understands the car market. Real-time pricing. Smart buyer matching. One flat fee. No expiry date on your listing.",
    seller: {
      badge: "FOR SELLERS",
      title: "Know Your Number. List With Confidence.",
      body: "Upload your photos and car details. Our AI scans real market data — condition, mileage, demand — and gives you your car's true value in seconds.\nNot a dealer's lowball. Not a wild guess.\nYour actual market price.\n\nThen your listing goes live — and stays live until your car sells. No time limits. No re-listing fees.\nJust real buyers, finding you.",
      cta: "List My Car — €49 Flat Fee →",
    },
    buyer: {
      badge: "FOR BUYERS",
      title: "Find the Right Car. Skip the Scroll.",
      body: "Tell us what you want — budget, type, lifestyle. Our AI matches you to the right cars from real, verified listings. No noise. No spam.\nJust the cars that actually fit you.\n\nFound the one? Negotiate directly with the seller.\nAnd if it's under €10,000 — pay by card, right here.\nNo bank transfer hassle. Done.",
      cta: "Find My Perfect Car →",
    },
  };

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden" style={{ backgroundColor: "#111827" }}>
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-4 block">{content.badge}</span>
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-display font-black text-white leading-tight mb-5">
            {content.title}
          </h2>
          <p className="text-silver/60 text-base sm:text-lg max-w-[600px] mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seller card */}
          <motion.div
            className="rounded-2xl border border-white/[0.08] bg-navy/60 p-8 transition-all duration-500 hover:border-orange/20 hover:shadow-[inset_0_1px_30px_rgba(249,115,22,0.04)]"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-orange" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase bg-orange/10 text-orange px-3 py-1 rounded-full">
                {content.seller.badge}
              </span>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-3">{content.seller.title}</h3>
            <p className="text-silver/50 text-sm leading-relaxed mb-6">{content.seller.body}</p>
            <button
              onClick={() => navigate("/car-upload")}
              className="text-orange font-semibold text-sm underline underline-offset-4 hover:text-orange/80 transition-colors"
            >
              {content.seller.cta}
            </button>
          </motion.div>

          {/* Buyer card */}
          <motion.div
            className="rounded-2xl border border-white/[0.08] bg-navy/60 p-8 transition-all duration-500 hover:border-orange/20 hover:shadow-[inset_0_1px_30px_rgba(249,115,22,0.04)]"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-orange" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase bg-orange/10 text-orange px-3 py-1 rounded-full">
                {content.buyer.badge}
              </span>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-3">{content.buyer.title}</h3>
            <p className="text-silver/50 text-sm leading-relaxed mb-6">{content.buyer.body}</p>
            <button
              onClick={() => navigate("/onboarding")}
              className="text-orange font-semibold text-sm underline underline-offset-4 hover:text-orange/80 transition-colors"
            >
              {content.buyer.cta}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AiEngineSection;
