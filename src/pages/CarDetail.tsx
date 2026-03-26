import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, Gauge, Fuel, Calendar, Cog, Palette, Zap, BarChart3, Star, Calculator, Umbrella, Check, ChevronLeft, ChevronRight, X, Maximize2, CheckCircle2, XCircle, HelpCircle, ClipboardCheck, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { INSPECTION_CATEGORIES, type InspectionChecklist } from "@/components/car-upload/inspectionChecklist";

interface CarFull {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  color: string | null;
  power_hp: number | null;
  price: number;
  fair_value_price: number;
  condition_score: number;
  demand_score: number;
  equipment: string[] | null;
  description: string | null;
  photos: string[] | null;
  inspection_checklist: InspectionChecklist | null;
  owner_id: string | null;
}

const CarDetail: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const { t, language } = useLanguage();
   const navigate = useNavigate();
   const [car, setCar] = useState<CarFull | null>(null);
   const [loading, setLoading] = useState(true);
   const [activePhoto, setActivePhoto] = useState(0);
   const [lightboxOpen, setLightboxOpen] = useState(false);
   const [userId, setUserId] = useState<string | null>(null);
   const [shortlisted, setShortlisted] = useState(false);
   const [shortlistLoading, setShortlistLoading] = useState(false);

   const openLightbox = useCallback((index: number) => {
     setActivePhoto(index);
     setLightboxOpen(true);
   }, []);

   useEffect(() => {
     if (!lightboxOpen) return;
     const handleKey = (e: KeyboardEvent) => {
       if (e.key === "Escape") setLightboxOpen(false);
       if (e.key === "ArrowRight") setActivePhoto((p) => (p + 1) % (car?.photos?.length || 1));
       if (e.key === "ArrowLeft") setActivePhoto((p) => (p - 1 + (car?.photos?.length || 1)) % (car?.photos?.length || 1));
     };
     document.body.style.overflow = "hidden";
     window.addEventListener("keydown", handleKey);
     return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
   }, [lightboxOpen, car?.photos?.length]);

   // Get user & check shortlist
   useEffect(() => {
     supabase.auth.getSession().then(({ data: { session } }) => {
       if (session?.user) {
         setUserId(session.user.id);
         if (id) {
           supabase.from("car_shortlists").select("id").eq("user_id", session.user.id).eq("car_id", id).maybeSingle().then(({ data }) => {
             setShortlisted(!!data);
           });
         }
       }
     });
   }, [id]);
    
   const pageTitle = car ? `${car.year} ${car.make} ${car.model} - Fair Value & Details` : "Car Details";
   const pageDescription = car 
     ? `Detailed appraisal for ${car.year} ${car.make} ${car.model}. Fair value: €${car.fair_value_price?.toLocaleString()}. Condition score: ${car.condition_score}/100.`
     : "Explore detailed car appraisals, fair value pricing, and condition analysis on Autozon.";

  // Financing calculator
  const [downPayment, setDownPayment] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(48);
  const [interestRate, setInterestRate] = useState(4.9);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("cars")
      .select("id, make, model, year, mileage, fuel_type, transmission, body_type, color, power_hp, price, fair_value_price, condition_score, demand_score, equipment, description, photos, inspection_checklist, owner_id")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setCar(data as unknown as CarFull);
          setDownPayment(Math.round((data as any).price * 0.2));
        }
        setLoading(false);
      });
  }, [id]);

   const isOwner = car?.owner_id === userId;

   const handleToggleShortlist = async () => {
     if (!userId || !id) return;
     if (isOwner) { toast.error("You cannot shortlist your own car."); return; }
     setShortlistLoading(true);
     if (shortlisted) {
       await supabase.from("car_shortlists").delete().eq("user_id", userId).eq("car_id", id);
       setShortlisted(false);
       toast.success(t.carDetail.removedFromShortlist);
     } else {
       const { error } = await supabase.from("car_shortlists").insert({ user_id: userId, car_id: id });
       if (error) toast.error(error.message);
       else { setShortlisted(true); toast.success(t.carDetail.addedToShortlist); }
     }
     setShortlistLoading(false);
   };

  const handleStartTrade = () => {
    if (!userId) { navigate("/login"); return; }
    // If user is the owner, redirect to fair value
    if (car?.owner_id === userId) { navigate(`/fair-value/${id}`); return; }
    // Otherwise navigate to buyer matches or create an offer flow
    navigate(`/buyer-matches/${id}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><span className="text-muted-foreground">Loading...</span></div>;
  }
  if (!car) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><span className="text-muted-foreground">Car not found</span></div>;
  }

  const photos = car.photos && car.photos.length > 0 ? car.photos : [];

  // Financing calculations
  const loanAmount = Math.max(0, car.price - downPayment);
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = monthlyRate > 0
    ? Math.round(loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1))
    : Math.round(loanAmount / loanTerm);
  const totalCost = monthlyPayment * loanTerm + downPayment;

  // Insurance estimate (demo formula)
  const basePremium = car.power_hp ? car.power_hp * 3.5 : 500;
  const ageFactor = Math.max(0.8, 1 - (2026 - car.year) * 0.03);
  const fuelFactor = car.fuel_type === "Electric" ? 0.85 : car.fuel_type === "Diesel" ? 1.1 : 1.0;
  const annualPremium = Math.round(basePremium * ageFactor * fuelFactor);

  const scoreBadge = (score: number) => {
    if (score >= 85) return "text-primary";
    if (score >= 70) return "text-primary/80";
    if (score >= 50) return "text-yellow-400";
    return "text-destructive";
  };

  const specs = [
    { icon: Calendar, label: t.carDetail.year, value: car.year },
    { icon: Gauge, label: t.carDetail.mileage, value: `${car.mileage.toLocaleString()} km` },
    { icon: Fuel, label: t.carDetail.fuel, value: car.fuel_type },
    { icon: Cog, label: t.carDetail.transmission, value: car.transmission },
    { icon: Shield, label: t.carDetail.bodyType, value: car.body_type },
    { icon: Palette, label: t.carDetail.color, value: car.color || "—" },
    { icon: Zap, label: t.carDetail.power, value: car.power_hp ? `${car.power_hp} HP` : "—" },
  ];

  const isDE = language === "de";
  const inspectionChecklist = car.inspection_checklist;
  const hasInspection = inspectionChecklist && Object.keys(inspectionChecklist).length > 0;

  return (
    <div className="min-h-screen bg-background text-muted-foreground">
      <SEO 
        title={pageTitle}
        description={pageDescription}
        path={`/car/${id}`}
      />
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        {/* Back */}
        <Button variant="ghost" className="text-muted-foreground mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.carDetail.back}
        </Button>

        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground">
            {car.year} {car.make} {car.model}
          </h1>

          {/* Price row */}
          <div className="flex items-center gap-6 mt-4">
            <div>
              <div className="text-xs text-muted-foreground">{t.carDetail.price}</div>
              <div className="text-3xl font-display font-black text-foreground">€{car.price.toLocaleString()}</div>
            </div>
            {car.fair_value_price > 0 && (
              <div>
                <div className="text-xs text-muted-foreground">{t.carDetail.fairValue}</div>
                <div className="text-3xl font-display font-black text-primary">€{car.fair_value_price.toLocaleString()}</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <motion.div
            className="mb-8 rounded-2xl overflow-hidden border border-border"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          >
            <div className="relative aspect-[16/9] bg-muted cursor-pointer group" onClick={() => openLightbox(activePhoto)}>
              <img
                src={photos[activePhoto]}
                alt={`${car.make} ${car.model} photo ${activePhoto + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-muted/90 border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="h-4 w-4" />
              </div>
              {photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActivePhoto((p) => (p - 1 + photos.length) % photos.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-muted/90 border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActivePhoto((p) => (p + 1) % photos.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-muted/90 border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setActivePhoto(i); }}
                        className={`w-2 h-2 rounded-full transition-all ${i === activePhoto ? "bg-primary w-5" : "bg-white/40 hover:bg-white/60"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Thumbnail strip */}
            {photos.length > 1 && (
              <div className="flex gap-1 p-2 bg-secondary/50 overflow-x-auto">
                {photos.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === activePhoto ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Description */}
        {car.description && (
          <motion.div
            className="bg-secondary/50 border border-border rounded-2xl p-6 mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          >
            <h3 className="font-display font-bold text-foreground text-lg mb-3">{t.carDetail.description}</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{car.description}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Specs + Equipment + Inspection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Specs */}
            <motion.div
              className="bg-secondary/50 border border-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
              <h3 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" /> {t.carDetail.specs}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <spec.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{spec.label}</div>
                      <div className="text-sm text-foreground font-medium">{spec.value}</div>
                    </div>
                  </div>
                ))}
                {/* Condition & Demand */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{t.carDetail.condition}</div>
                    <div className={`text-sm font-bold ${scoreBadge(car.condition_score)}`}>{car.condition_score}/100</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{t.carDetail.demand}</div>
                    <div className={`text-sm font-bold ${scoreBadge(car.demand_score)}`}>{car.demand_score}/100</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Equipment */}
            {car.equipment && car.equipment.length > 0 && (
              <motion.div
                className="bg-secondary/50 border border-border rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              >
                <h3 className="font-display font-bold text-foreground text-lg mb-5">{t.carDetail.equipment}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {car.equipment.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Inspection Checklist */}
            {hasInspection && (
              <motion.div
                className="bg-secondary/50 border border-border rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              >
                <h3 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" /> {t.carDetail.inspectionChecklist}
                </h3>
                <div className="space-y-5">
                  {INSPECTION_CATEGORIES.map((cat) => {
                    const catItems = cat.items.filter((item) => inspectionChecklist![item.id] != null);
                    if (catItems.length === 0) return null;
                    return (
                      <div key={cat.id}>
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wide mb-2">
                          {isDE ? cat.titleDe : cat.titleEn}
                        </h4>
                        <div className="space-y-1.5">
                          {catItems.map((item) => {
                            const answer = inspectionChecklist![item.id];
                            return (
                              <div key={item.id} className="flex items-center justify-between gap-3 py-1.5 px-3 rounded-lg bg-muted/60">
                                <span className="text-sm text-muted-foreground flex-1">
                                  {isDE ? item.labelDe : item.labelEn}
                                </span>
                                <span className={`flex items-center gap-1 text-xs font-medium shrink-0 ${
                                  answer === "yes" ? "text-primary" : answer === "no" ? "text-destructive" : "text-amber-400"
                                }`}>
                                  {answer === "yes" && <CheckCircle2 className="h-3.5 w-3.5" />}
                                  {answer === "no" && <XCircle className="h-3.5 w-3.5" />}
                                  {answer === "unknown" && <HelpCircle className="h-3.5 w-3.5" />}
                                  {answer === "yes" ? t.carDetail.inspectionYes : answer === "no" ? t.carDetail.inspectionNo : t.carDetail.inspectionUnknown}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Calculators */}
          <div className="space-y-6">
            {/* Financing Calculator */}
            <motion.div
              className="bg-secondary/50 border border-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
              <h3 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" /> {t.carDetail.financing}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-xs">{t.carDetail.downPayment}</Label>
                  <Input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="bg-background border-border text-foreground mt-1" />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">{t.carDetail.loanTerm}</Label>
                  <Input type="number" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="bg-background border-border text-foreground mt-1" />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">{t.carDetail.interestRate}</Label>
                  <Input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="bg-background border-border text-foreground mt-1" />
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">{t.carDetail.monthlyPayment}</span>
                    <span className="text-foreground font-display font-bold text-lg">€{monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">{t.carDetail.totalCost}</span>
                    <span className="text-muted-foreground font-medium">€{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Insurance Estimate */}
            <motion.div
              className="bg-secondary/50 border border-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            >
              <h3 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
                <Umbrella className="h-5 w-5 text-primary" /> {t.carDetail.insurance}
              </h3>
              <div className="text-center py-4">
                <div className="text-xs text-muted-foreground mb-1">{t.carDetail.annualPremium}</div>
                <div className="text-3xl font-display font-black text-foreground">€{annualPremium.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-2">≈ €{Math.round(annualPremium / 12).toLocaleString()}/mo</div>
              </div>
            </motion.div>

            {/* CTAs */}
            <div className="space-y-3">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl"
                onClick={handleStartTrade}
              >
                {t.carDetail.startTrade}
              </Button>
              <Button
                variant="outline"
                className={`w-full border-border py-6 rounded-xl ${shortlisted ? "text-primary border-primary" : "text-muted-foreground hover:border-primary hover:text-primary"}`}
                onClick={handleToggleShortlist}
                disabled={shortlistLoading}
              >
                {shortlisted ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
                {shortlisted ? t.carDetail.removeFromShortlist : t.carDetail.addToShortlist}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && photos.length > 0 && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between p-4">
              <span className="text-foreground/60 text-sm">{activePhoto + 1} / {photos.length}</span>
              <button onClick={() => setLightboxOpen(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-foreground hover:bg-white/20 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main image */}
            <div className="flex-1 flex items-center justify-center px-16 pb-4 relative" onClick={(e) => e.stopPropagation()}>
              {photos.length > 1 && (
                <button
                  onClick={() => setActivePhoto((p) => (p - 1 + photos.length) % photos.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-foreground hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              <motion.img
                key={activePhoto}
                src={photos[activePhoto]}
                alt={`${car.make} ${car.model} photo ${activePhoto + 1}`}
                className="max-h-full max-w-full object-contain rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
              />
              {photos.length > 1 && (
                <button
                  onClick={() => setActivePhoto((p) => (p + 1) % photos.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-foreground hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Thumbnail strip */}
            {photos.length > 1 && (
              <div className="flex gap-2 justify-center p-4 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
                {photos.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === activePhoto ? "border-primary" : "border-transparent opacity-50 hover:opacity-100"}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarDetail;
