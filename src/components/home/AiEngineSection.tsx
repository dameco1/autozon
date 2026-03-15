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
    badge: "SO FUNKTIONIERT'S",
    title: "Deine Fotos. Deine Daten. Dein fairer Preis.",
    subtitle: "Lade dein Auto hoch. Unsere KI analysiert deine Fotos, Ausstattung und Zustand — vergleicht es mit aktuellen Marktdaten und berechnet den fairsten Preis, zu dem du verkaufen kannst. Du behältst die Marge. Nicht der Händler.",
    seller: {
      badge: "FÜR VERKÄUFER",
      title: "Hochladen. Echten Preis erhalten. Verkaufen.",
      body: "Mach ein paar Fotos. Gib die Fahrzeugdaten ein. Unsere KI scannt die Bilder auf Zustand und Schäden, vergleicht Kilometerstand, Ausstattung und Spezifikationen mit Tausenden aktueller Marktangebote — und liefert den wahren Marktwert deines Autos.\n\nKein Händler-Abschlag. Kein Raten. Der Preis spiegelt wider, was echte Käufer gerade zahlen.\n\nInseriere für €49. Dein Inserat bleibt online, bis es verkauft ist.",
      cta: "Auto inserieren — €49 Pauschal →",
    },
    buyer: {
      badge: "FÜR KÄUFER",
      title: "Schluss mit Überzahlen. Anfangen zu finden.",
      body: "Sag uns dein Budget, deine Vorlieben und deinen Lebensstil. Unsere KI matcht dich mit fair bepreisten, verifizierten Autos — nicht mit zufälligen Inseraten voller Händlermargen.\n\nJedes Auto ist KI-bewertet. Jeder Preis ist marktverifiziert.\n\nDas Richtige gefunden? Verhandle direkt. Zahle per Karte bis €10.000. Erledigt.",
      cta: "Mein perfektes Auto finden →",
    },
  } : {
    badge: "HOW IT WORKS",
    title: "Your Photos. Your Data. Your Fair Price.",
    subtitle: "Upload your car. Our AI analyzes your photos, specs, and condition — then compares it against live market data to calculate the fairest price you can sell for. You keep the margin. Not the dealer.",
    seller: {
      badge: "FOR SELLERS",
      title: "Upload. Get Your Real Price. Sell.",
      body: "Take a few photos. Enter your car's details. Our AI scans the images for condition and damage, cross-references mileage, specs, and equipment against thousands of live market listings — and returns your car's true market value.\n\nNo dealer markdown. No guesswork. The price reflects what real buyers are paying right now.\n\nList it for €49. Your ad stays live until it sells.",
      cta: "List My Car — €49 Flat Fee →",
    },
    buyer: {
      badge: "FOR BUYERS",
      title: "Stop Overpaying. Start Finding.",
      body: "Tell us your budget, preferences, and lifestyle. Our AI matches you with fairly priced, verified cars — not random listings padded with dealer margins.\n\nEvery car is AI-appraised. Every price is market-verified.\n\nFound the one? Negotiate directly. Pay by card up to €10,000. Done.",
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
