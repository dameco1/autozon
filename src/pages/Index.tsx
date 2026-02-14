import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Target, Truck, Bell, ChevronRight, CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroProcessCircle from "@/components/home/HeroProcessCircle";
import CarTicker from "@/components/home/CarTicker";
import CookieConsent from "@/components/CookieConsent";
import SEO from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const Index: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const solutionIcons = [Shield, Zap, Target, Truck, Bell];

  return (
    <div className="min-h-screen bg-charcoal text-silver">
      <SEO
        path="/"
        description="Buy and sell cars at fair prices. AI-powered valuations, verified buyer matching, and zero hassle — Autozon is the smarter way to trade cars."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Autozon",
          url: "https://autozon.lovable.app",
          description: "Fair value car trading platform with AI-powered valuations.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://autozon.lovable.app/car-selection?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-secondary" />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{ left: `${15 + i * 18}%`, top: `${25 + (i % 3) * 20}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-items-center">
          <div className="text-center lg:text-left">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white leading-[0.95] tracking-tight mb-8"
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
            >
              {t.hero.title}{" "}<span className="text-gradient">{t.hero.titleAccent}</span>
            </motion.h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <motion.div
                className="bg-secondary/60 border border-border rounded-2xl p-6 hover:border-primary/40 transition-all"
                initial="hidden" animate="visible" variants={fadeUp} custom={2}
              >
                <TrendingUp className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-display font-bold text-white mb-2">{t.hero.sellerHook}</h3>
                <p className="text-silver/60 text-sm leading-relaxed mb-4">{t.hero.sellerBody}</p>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg"
                  onClick={() => navigate("/intent")}
                >
                  {t.hero.sellerCta}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                className="bg-secondary/60 border border-border rounded-2xl p-6 hover:border-primary/40 transition-all"
                initial="hidden" animate="visible" variants={fadeUp} custom={3}
              >
                <ShieldCheck className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-display font-bold text-white mb-2">{t.hero.buyerHook}</h3>
                <p className="text-silver/60 text-sm leading-relaxed mb-4">{t.hero.buyerBody}</p>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg"
                  onClick={() => navigate("/intent")}
                >
                  {t.hero.buyerCta}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <HeroProcessCircle />
          </motion.div>
        </div>
      </section>

      {/* Car Ticker */}
      <CarTicker />

      {/* Problem */}
      <section className="py-24 sm:py-32 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl font-display font-black text-white">
              {t.problem.title} <span className="text-destructive">{t.problem.titleAccent}</span>
            </h2>
            <p className="text-silver/60 text-lg max-w-2xl mx-auto mt-6">{t.problem.description}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.problem.stats.map((stat, i) => (
              <motion.div
                key={i}
                className="bg-charcoal/50 border border-border rounded-2xl p-8 text-center"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              >
                <div className="text-4xl sm:text-5xl font-display font-black text-destructive mb-2">{stat.value}</div>
                <div className="text-silver/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 sm:py-32 bg-charcoal">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl font-display font-black text-white">{t.solution.title}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.solution.features.map((feature, i) => {
              const Icon = solutionIcons[i];
              return (
                <motion.div
                  key={i}
                  className="group bg-secondary/50 border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-silver/60 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl font-display font-black text-white">{t.howItWorks.title}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {t.howItWorks.steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative text-center"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              >
                <div className="text-5xl font-display font-black text-primary/20 mb-3">{step.number}</div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{step.title}</h3>
                <p className="text-silver/60 text-sm">{step.description}</p>
                {i < 4 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-3 h-6 w-6 text-primary/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section id="why-autozon" className="py-24 sm:py-32 bg-charcoal">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl font-display font-black text-white">{t.trust.title}</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {t.trust.pillars.map((pillar, i) => (
              <motion.div
                key={i}
                className="bg-secondary/50 border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-all"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              >
                <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-base font-display font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-silver/60 text-xs leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-secondary to-charcoal">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-4xl sm:text-6xl font-display font-black text-white mb-4">
              {t.cta.title}
              <br />
              <span className="text-gradient">{t.cta.titleAccent}</span>
            </h2>
            <p className="text-silver/60 text-lg mb-10">{t.cta.subtitle}</p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-10 py-7 rounded-xl shadow-[0_0_40px_hsl(155_100%_42%/0.3)]"
              onClick={() => navigate("/signup")}
            >
              {t.cta.button}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-charcoal border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white">auto<span className="text-primary">zon</span></span>
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
              onClick={() => { localStorage.removeItem("autozon-cookie-consent"); window.location.reload(); }}
              className="hover:text-primary transition-colors"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
};

export default Index;
