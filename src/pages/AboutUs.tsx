import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Cpu, Search, FileCheck, TrendingDown, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/home/FooterSection";
import CookieConsent from "@/components/CookieConsent";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const solutionIcons = [Brain, Cpu, Search, FileCheck, TrendingDown];

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const solutions = t.solution.features;

  const aboutUs = (t as any).aboutUs;
  const steps = aboutUs?.steps ?? [
    { number: "01", title: "Upload", description: "Upload photos and car details — our AI starts analyzing instantly." },
    { number: "02", title: "Price", description: "AI cross-references your photos, specs, and condition against live market data." },
    { number: "03", title: "List", description: "Your ad goes live for €49. It stays online until your car is sold." },
    { number: "04", title: "Match", description: "AI connects you with verified buyers looking for a car like yours." },
    { number: "05", title: "Close", description: "Negotiate directly. Pay by card up to €10K. Done." },
  ];

  const trustPillars = t.trust.pillars;

  return (
    <div className="min-h-screen bg-background">
      <SEO path="/about" description="Learn about Autozon — the AI-powered car platform that shows you your car's real market value. Fair prices, verified matches, zero dealer margin." />
      <Navbar />

      {/* Hero / Manifesto */}
      <section className="pt-28 pb-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(24_85%_48%/0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.span
            className="text-xs font-medium text-orange tracking-wide uppercase mb-6 block"
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
          >
            <Sparkles className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
            {aboutUs?.badge ?? "AI-Powered Fair Value"}
          </motion.span>

          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-foreground leading-tight tracking-tight mb-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            {aboutUs?.heroTitle ?? "Your Photos. Your Data."}
            <br />
            <span className="text-orange">{aboutUs?.heroTitleAccent ?? "Your Fair Price."}</span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mt-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            {aboutUs?.heroDescription ?? "Autozon's AI analyzes your car photos, condition, mileage, and specs — then compares it against live market data to calculate the fairest price you can sell for. You keep the margin. Not the dealer."}
          </motion.p>
        </div>
      </section>

      {/* Selling & Buying */}
      <section className="py-16 bg-muted">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          >
            <div className="flex gap-5">
              <div className="w-1 shrink-0 rounded-full bg-orange" />
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-1">{t.hero.sellingTitle}</h2>
                <p className="text-orange text-xs font-bold tracking-wider uppercase mb-3">{t.hero.sellingTagline}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {aboutUs?.sellingDescription ?? "Upload your car. Our AI scans photos for condition and damage, cross-references mileage, specs, and equipment against thousands of live market listings — and returns your car's true market value. List for €49. Your ad stays live until it sells."}
                </p>
                <Button size="sm" className="bg-orange text-orange-foreground hover:bg-orange/90 font-bold rounded-lg" onClick={() => navigate("/intent")}>
                  {t.hero.sellerCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-1 shrink-0 rounded-full bg-orange" />
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-1">{t.hero.buyingTitle}</h2>
                <p className="text-orange text-xs font-bold tracking-wider uppercase mb-3">{t.hero.buyingTagline}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {aboutUs?.buyingDescription ?? "Tell us your budget, preferences, and lifestyle. Our AI matches you with fairly priced, verified cars — not random listings padded with dealer margins. Every car is AI-appraised. Every price is market-verified."}
                </p>
                <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-muted font-semibold rounded-lg" onClick={() => navigate("/intent")}>
                  {t.hero.buyerCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-xs font-semibold tracking-widest uppercase text-destructive/80 mb-4 block">{t.problem.badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-foreground leading-tight">
              {t.problem.title}<br /><span className="text-destructive">{t.problem.titleAccent}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mt-6 leading-relaxed">{t.problem.description}</p>
            {t.problem.italicLine && (
              <p className="text-orange text-base sm:text-lg italic mt-4 whitespace-pre-line max-w-2xl">{t.problem.italicLine}</p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.problem.stats.map((stat, i) => (
              <motion.div
                key={i}
                className="group relative bg-card border border-border rounded-2xl p-10 overflow-hidden hover:border-destructive/30 transition-all duration-500 shadow-sm"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              >
                <div className="text-5xl sm:text-6xl font-display font-black text-destructive mb-3">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Solution */}
      <section className="py-16 bg-muted relative">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-xs font-semibold tracking-widest uppercase text-orange/80 mb-4 block">{t.solution.badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-foreground">{t.solution.title}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {solutions.map((feature, i) => {
              const Icon = solutionIcons[i];
              const isLarge = i < 2;
              return (
                <motion.div
                  key={i}
                  className={`group bg-card border border-border rounded-2xl p-8 hover:border-orange/30 transition-all duration-500 relative overflow-hidden shadow-sm ${isLarge ? "md:col-span-3" : "md:col-span-2"}`}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
                >
                  <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center mb-5 group-hover:bg-orange/15 transition-colors">
                    <Icon className="h-5 w-5 text-orange" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-xs font-semibold tracking-widest uppercase text-orange/80 mb-4 block">{t.howItWorks.badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-foreground">{t.howItWorks.title}</h2>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/20 to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {steps.map((step: any, i: number) => (
                <motion.div
                  key={i}
                  className="relative text-center md:text-left"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
                >
                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full border border-orange/20 bg-card mb-4 shadow-sm">
                    <span className="text-sm font-display font-black text-orange">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-xs font-semibold tracking-widest uppercase text-orange/80 mb-4 block">{t.trust.badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-foreground">{t.trust.title}</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {trustPillars.map((pillar, i) => (
              <motion.div
                key={i}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-orange/20 transition-all duration-500 shadow-sm"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              >
                <CheckCircle2 className="h-7 w-7 text-orange mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-display font-bold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,hsl(24_80%_38%/0.3),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-tight mb-4">
              {t.cta.title}
            </h2>
            <p className="text-white/80 text-sm sm:text-base italic mb-2 whitespace-pre-line">{t.cta.aiLine}</p>
            <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">{t.cta.subtitle}</p>
            <Button
              size="lg"
              className="bg-white text-orange hover:bg-white/90 font-bold text-base px-10 py-6 rounded-full shadow-lg"
              onClick={() => navigate("/signup")}
            >
              {t.cta.button}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <FooterSection />
      <CookieConsent />
    </div>
  );
};

export default AboutUs;
