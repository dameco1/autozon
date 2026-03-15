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
    title: "Der smarteste Weg, ein Auto in Österreich zu kaufen oder verkaufen",
    subtitle: "Wir haben eine KI gebaut, die den europäischen Automarkt wirklich versteht — kein generischer Preisführer, sondern eine Echtzeit-Engine, die Live-Deals, lokale Nachfrage und Fahrzeughistorie liest.",
    seller: {
      badge: "FÜR VERKÄUFER",
      title: "Kenne deinen Preis, bevor du inserierst",
      body: "Sag uns Marke, Modell, Kilometerstand und Zustand deines Autos. Unsere KI prüft tausende europäische Verkäufe und gibt dir in Sekunden eine echte Bewertung — keine wilde Schätzung, kein Händler-Tiefpreis. Dein tatsächlicher Marktpreis.",
      cta: "Kostenlose Bewertung erhalten →",
    },
    buyer: {
      badge: "FÜR KÄUFER",
      title: "Sag uns, was du willst. Wir finden es.",
      body: "Nicht sicher, welches Auto zu deinem Leben passt? Unsere KI stellt dir ein paar einfache Fragen — Budget, Lebensstil, Bedürfnisse — und matcht dich mit den richtigen Optionen aus echten Inseraten. Wie ein Auto-Experte in deiner Tasche, kostenlos.",
      cta: "Mein Match finden →",
    },
  } : {
    badge: "POWERED BY AI",
    title: "The Smartest Way to Buy or Sell a Car in Austria",
    subtitle: "We've built AI that actually understands the European car market — not just a generic price guide, but a real-time engine that reads live deals, local demand, and vehicle history.",
    seller: {
      badge: "FOR SELLERS",
      title: "Know Your Number Before You List",
      body: "Tell us your car's make, model, mileage and condition. Our AI checks thousands of recent European sales and gives you a real valuation in seconds — not a wild guess, not a dealer's lowball. Your actual market price.",
      cta: "Get My Free Valuation →",
    },
    buyer: {
      badge: "FOR BUYERS",
      title: "Tell Us What You Want. We'll Find It.",
      body: "Not sure which car fits your life? Our AI asks you a few simple questions — budget, lifestyle, needs — and matches you to the right options from real listings. Like having a car expert in your pocket, for free.",
      cta: "Find My Match →",
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
