import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Target, Truck, Bell, ChevronRight, CheckCircle2, Car } from "lucide-react";
import Navbar from "@/components/Navbar";

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
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-secondary" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Car className="h-4 w-4" /> Fair value. Zero friction.
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-black text-white leading-[0.95] tracking-tight mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            {t.hero.title}
            <br />
            <span className="text-gradient">{t.hero.titleAccent}</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-silver/70 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-8 py-6 rounded-xl shadow-[0_0_30px_hsl(155_100%_42%/0.3)]"
              onClick={() => navigate("/signup")}
            >
              {t.hero.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-silver/20 text-silver hover:bg-silver/5 font-semibold text-base px-8 py-6 rounded-xl"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.hero.ctaSecondary}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 sm:py-32 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium mb-4">
              {t.problem.badge}
            </span>
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
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              {t.solution.badge}
            </span>
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
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              {t.howItWorks.badge}
            </span>
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
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              {t.trust.badge}
            </span>
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
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-white">auto<span className="text-primary">zon</span></span>
            <span className="text-silver/40 text-sm ml-2">{t.footer.tagline}</span>
          </div>
          <p className="text-silver/40 text-sm">{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
