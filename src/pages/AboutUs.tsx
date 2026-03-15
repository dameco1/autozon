import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Cpu, Search, FileCheck, TrendingDown, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
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

  const solutions = [
    { title: "AI Fair Value Engine", description: "Machine learning analyzes 50+ signals — condition, demand, market liquidity — to calculate your car's true worth in seconds." },
    { title: "AI Smart Matching", description: "Our matching algorithm connects you with verified buyers who actually want your car, at the right price." },
    { title: "AI Car Discovery", description: "Predictive modeling curates 3–7 handpicked recommendations based on your lifestyle, not random listings." },
    { title: "AI-Assisted Transactions", description: "AI coordinates inspection, pickup, paperwork, and payment — managing the entire process end-to-end." },
    { title: "AI Depreciation Radar", description: "Predictive analytics monitor market shifts and alert you when to sell — before your car loses value." },
  ];

  const steps = [
    { number: "01", title: "Upload", description: "Upload photos — our AI analyzes them instantly." },
    { number: "02", title: "Score", description: "AI calculates fair value from 50+ market signals." },
    { number: "03", title: "Match", description: "AI matches you with verified buyers." },
    { number: "04", title: "Choose", description: "Pick the best deal or swap." },
    { number: "05", title: "Done", description: "AI coordinates inspection, pickup & payment." },
  ];

  const trustPillars = [
    { title: "AI-Transparent", description: "Every AI decision is explained. See exactly how your price was calculated." },
    { title: "AI-Fast", description: "AI matches in minutes, not weeks of listing and waiting." },
    { title: "AI-Fair", description: "Machine learning pricing that protects both buyers and sellers equally." },
    { title: "AI-Native", description: "Built from day one on machine learning — not bolted on as an afterthought." },
    { title: "AI-Premium", description: "AI concierge handles inspection, logistics, and paperwork end-to-end." },
  ];

  return (
    <div className="min-h-screen bg-navy">
      <SEO path="/about" description="Learn about Autozon — Austria's AI-powered car marketplace. Fair prices, verified matches, zero hassle." />
      <Navbar />

      {/* Hero / Manifesto */}
      <section className="pt-28 pb-16 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(24_95%_53%/0.06),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.span
            className="text-xs font-medium text-orange tracking-wide uppercase mb-6 block"
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
          >
            <Sparkles className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
            AI-Powered Car Trading
          </motion.span>

          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-tight tracking-tight mb-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            No more Post &amp; Pray.
            <br />
            <span className="text-orange">
              <span className="text-white bg-orange/20 px-1 rounded">AI</span>ntelligent way to buy or sell your car.
            </span>
          </motion.h1>
          <motion.p
            className="text-lg text-orange font-bold tracking-wide mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={1.5}
          >
            More Speed, More Value!
          </motion.p>

          <motion.p
            className="text-silver/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            We are not a listing site nor marketplace. We are an AI-driven matching engine that compresses the entire selling process into a guided, trusted, and fast transaction.
          </motion.p>
        </div>
      </section>

      {/* Selling & Buying */}
      <section className="py-16 bg-navy">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          >
            {/* Selling */}
            <div className="flex gap-5">
              <div className="w-1 shrink-0 rounded-full bg-orange" />
              <div>
                <h2 className="text-xl font-display font-bold text-white mb-1">Selling a Car</h2>
                <p className="text-orange text-xs font-bold tracking-wider uppercase mb-3">YOU KEEP THE PROFIT.</p>
                <p className="text-silver/50 text-sm leading-relaxed mb-5">
                  Our AI Fair Value Engine analyzes 50+ data points in real time — condition, demand, market trends, and computer vision damage detection — then matches you with verified buyers ready to pay what your car is truly worth.
                </p>
                <Button
                  size="sm"
                  className="bg-orange text-orange-foreground hover:bg-orange/90 font-bold rounded-lg"
                  onClick={() => navigate("/intent")}
                >
                  Sell My Car
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Buying */}
            <div className="flex gap-5">
              <div className="w-1 shrink-0 rounded-full bg-orange" />
              <div>
                <h2 className="text-xl font-display font-bold text-white mb-1">Buying a Car</h2>
                <p className="text-orange text-xs font-bold tracking-wider uppercase mb-3">PERFECT CAR IS YOUR NEXT CAR.</p>
                <p className="text-silver/50 text-sm leading-relaxed mb-5">
                  Tell us what you're looking for and our AI matching algorithm finds your ideal car from thousands of listings. Fair price, delivered to your door — inspected, verified, and hassle-free.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-silver/30 text-white hover:bg-white/5 font-semibold rounded-lg"
                  onClick={() => navigate("/intent")}
                >
                  Find My Next Car
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="mt-12 text-center text-silver/50 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          >
            Powered by AI that analyzes thousands of market signals — Autozon gives you fair prices, verified matches, and zero hassle.
          </motion.p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(0_84%_60%/0.04),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-xs font-semibold tracking-widest uppercase text-destructive/80 mb-4 block">The Problem</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-tight">
              Car depreciation is<br /><span className="text-destructive">broken.</span>
            </h2>
            <p className="text-silver/50 text-lg max-w-2xl mt-6 leading-relaxed">
              Dealers use gut feeling. You deserve an AI that knows the real number. The moment you drive off the lot, they pocket up to 30% — not because the car changed, but because the system is designed against you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: "30%", label: "Average value lost at dealerships" },
              { value: "€4,200", label: "Hidden dealer margin per car" },
              { value: "73%", label: "Sellers get below fair value" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="group relative bg-navy border border-border rounded-2xl p-10 overflow-hidden hover:border-destructive/30 transition-all duration-500"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              >
                <div className="text-5xl sm:text-6xl font-display font-black text-destructive mb-3">{stat.value}</div>
                <div className="text-silver/50 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Solution */}
      <section className="py-16 bg-navy relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,hsl(24_95%_53%/0.04),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-xs font-semibold tracking-widest uppercase text-orange/80 mb-4 block">AI-Powered Solution</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white">Autozon fixes this.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {solutions.map((feature, i) => {
              const Icon = solutionIcons[i];
              const isLarge = i < 2;
              return (
                <motion.div
                  key={i}
                  className={`group bg-charcoal/60 border border-border rounded-2xl p-8 hover:border-orange/30 transition-all duration-500 relative overflow-hidden ${isLarge ? "md:col-span-3" : "md:col-span-2"}`}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
                >
                  <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center mb-5 group-hover:bg-orange/15 transition-colors">
                    <Icon className="h-5 w-5 text-orange" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-silver/50 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-charcoal relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-xs font-semibold tracking-widest uppercase text-orange/80 mb-4 block">How It Works</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white">5 steps to fair value.</h2>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/20 to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="relative text-center md:text-left"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
                >
                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full border border-orange/20 bg-navy mb-4">
                    <span className="text-sm font-display font-black text-orange">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-silver/50 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-16 bg-navy">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-xs font-semibold tracking-widest uppercase text-orange/80 mb-4 block">Why Autozon</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white">AI You Can Trust.</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {trustPillars.map((pillar, i) => (
              <motion.div
                key={i}
                className="group bg-charcoal/40 border border-border rounded-2xl p-6 hover:border-orange/20 transition-all duration-500"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              >
                <CheckCircle2 className="h-7 w-7 text-orange mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-display font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-silver/50 text-xs leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,hsl(24_80%_45%/0.3),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-tight mb-4">
              Your AI-powered advantage starts now.
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Get your AI fair-value score in under 2 minutes. No dealers, no guesswork — just data.
            </p>
            <Button
              size="lg"
              className="bg-white text-orange hover:bg-white/90 font-bold text-base px-10 py-6 rounded-full shadow-lg"
              onClick={() => navigate("/signup")}
            >
              Get Started — It's Free
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
