import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Brain, TrendingUp, FileCheck, Rocket, ArrowLeft, ArrowRight, X, FileText, Image, AlertCircle, Check, Loader2, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import browserImageCompression from "browser-image-compression";
import { PHOTO_SLOTS } from "@/components/car-upload/photoSlots";

/** Sort photos by the canonical slot order: front, rear, left, right, interior, dashboard, extras */
function sortPhotosBySlotOrder(photos: string[]): string[] {
  if (!photos || photos.length === 0) return [];
  const slotOrder = PHOTO_SLOTS.map(s => s.id);
  // Keywords map to slot positions
  const keywords: Record<string, string[]> = {
    front: ["front", "vorne", "vorn"],
    rear: ["rear", "back", "hinten", "heck"],
    left: ["left", "links"],
    right: ["right", "rechts"],
    interior_front: ["interior", "innen", "cabin", "cockpit"],
    interior_rear: ["rear_interior", "rücksitz", "backseat"],
    dashboard: ["dashboard", "armatur", "tacho", "instrument"],
  };

  function getSlotIndex(url: string): number {
    const lower = url.toLowerCase();
    for (const [slot, words] of Object.entries(keywords)) {
      if (words.some(w => lower.includes(w))) {
        const idx = slotOrder.indexOf(slot);
        return idx >= 0 ? idx : 99;
      }
    }
    return 99;
  }

  return [...photos].sort((a, b) => getSlotIndex(a) - getSlotIndex(b));
}

interface ExtractedField {
  value: any;
  source: "extracted" | "uncertain" | "not_found";
}

interface AnalysisResult {
  vehicle: Record<string, ExtractedField>;
  damages: any[];
  overallCondition: string;
  conditionExterior: number;
  conditionInterior: number;
  conditionSummary: string;
  equipment: string[];
  fairValue: number;
  priceRange: { min: number; max: number };
  description: string;
  missingFields: string[];
  uncertainFields: string[];
  totalDamageCost: number;
  photos: string[];
}

const STEPS = [
  { icon: Upload, label: "Upload" },
  { icon: Brain, label: "AI Analysis" },
  { icon: TrendingUp, label: "Fair Value" },
  { icon: FileCheck, label: "Ad Preview" },
  { icon: Rocket, label: "Publish" },
];

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const SellWizard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [userOverrides, setUserOverrides] = useState<Record<string, any>>({});
  const [askingPrice, setAskingPrice] = useState<number>(0);
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...dropped].slice(0, 30));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selected].slice(0, 30));
    }
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const isImage = (f: File) => f.type.startsWith("image/");

  const uploadAndAnalyze = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    setStep(1);
    setUploading(true);
    setAnalyzing(true);
    setAnalysisProgress(10);

    try {
      // Upload files to storage
      const imageUrls: string[] = [];
      const documentUrls: string[] = [];
      const tempId = crypto.randomUUID();
      // Use user folder if logged in, temp/ folder for anonymous users
      const folderPrefix = userId ? `${userId}/${tempId}` : `temp/${tempId}`;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let uploadFile = file;

        // Compress images
        if (isImage(file) && file.size > 1024 * 1024) {
          uploadFile = await browserImageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
        }

        const ext = file.name.split(".").pop() || "jpg";
        const path = `${folderPrefix}/${i}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("car-images").upload(path, uploadFile);
        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage.from("car-images").getPublicUrl(path);
        if (isImage(file)) imageUrls.push(urlData.publicUrl);
        else documentUrls.push(urlData.publicUrl);

        setAnalysisProgress(10 + Math.round((i / files.length) * 30));
      }

      setUploading(false);
      setAnalysisProgress(45);

      // Call AI analysis
      const { data, error } = await supabase.functions.invoke("analyze-car-listing", {
        body: { imageUrls, documentUrls, language },
      });

      if (error) throw new Error(error.message || "Analysis failed");
      if (data?.error) throw new Error(data.error);

      // Delete sensitive documents (driver's license, registration) from storage after analysis
      if (documentUrls.length > 0) {
        const docPaths = documentUrls.map((url: string) => {
          const parts = url.split("/car-images/");
          return parts[1] ? decodeURIComponent(parts[1]) : null;
        }).filter(Boolean);
        if (docPaths.length > 0) {
          await supabase.storage.from("car-images").remove(docPaths as string[]);
        }
      }

      // Sort photos according to slot order: front, rear, sides, interior, dashboard, extras
      const sortedPhotos = sortPhotosBySlotOrder(data.photos || imageUrls);

      setAnalysisProgress(100);
      setAnalysis({ ...data, photos: sortedPhotos });
      setAskingPrice(data.fairValue || 0);
      setEditDescription(data.description || "");

      // Move to fair value step
      setTimeout(() => {
        setAnalyzing(false);
        setStep(2);
      }, 800);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Analysis failed");
      setStep(0);
      setAnalyzing(false);
      setUploading(false);
    }
  };

  const getFieldValue = (key: string) => {
    if (userOverrides[key] !== undefined) return userOverrides[key];
    return analysis?.vehicle?.[key]?.value ?? null;
  };

  const setOverride = (key: string, value: any) => {
    setUserOverrides(prev => ({ ...prev, [key]: value }));
  };

  const saveCar = async (publish: boolean) => {
    if (!userId) {
      navigate(`/login?redirect=/sell`);
      return;
    }

    setSaving(true);
    try {
      const carData = {
        owner_id: userId,
        make: getFieldValue("make") || "Unknown",
        model: getFieldValue("model") || "Unknown",
        year: getFieldValue("year") || new Date().getFullYear(),
        mileage: getFieldValue("mileage") || 0,
        fuel_type: getFieldValue("fuel_type") || "Petrol",
        transmission: getFieldValue("transmission") || "Manual",
        body_type: getFieldValue("body_type") || "Sedan",
        color: getFieldValue("color") || "",
        power_hp: getFieldValue("power_hp") || 0,
        vin: getFieldValue("vin") || "",
        price: askingPrice,
        description: editDescription,
        equipment: analysis?.equipment || [],
        photos: analysis?.photos || [],
        image_url: analysis?.photos?.[0] || "",
        condition_exterior: analysis?.conditionExterior || 80,
        condition_interior: analysis?.conditionInterior || 80,
        detected_damages: analysis?.damages || [],
        first_registration_month: getFieldValue("first_registration_month"),
        first_registration_year: getFieldValue("first_registration_year"),
        smoker_car: userOverrides.smoker_car ?? false,
        service_book_updated: userOverrides.service_book_updated ?? false,
        accident_history: userOverrides.accident_history ?? false,
        warranty_type: userOverrides.warranty_type ?? "none",
        status: publish ? "available" : "draft",
      };

      const { data: car, error } = await supabase.from("cars").insert(carData as any).select("id").single();
      if (error) throw error;

      if (publish) {
        toast.success(language === "de" ? "Inserat veröffentlicht!" : "Ad published!");
        navigate(`/fair-value/${car.id}`);
      } else {
        toast.success(language === "de" ? "Entwurf gespeichert!" : "Draft saved!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const sw = language === "de" ? {
    title: "Auto verkaufen",
    subtitle: "KI analysiert Ihre Fotos und erstellt Ihr Inserat",
    uploadTitle: "Alles hochladen",
    uploadDesc: "Ziehen Sie alle Fahrzeugfotos, Zulassungsscheine und Dokumente hierher",
    uploadHint: "Fotos, Zulassungsschein, Führerschein, Serviceheft — alles auf einmal",
    analyzing: "Autozon AI analysiert Ihr Fahrzeug…",
    scanPhotos: "Fotos scannen…",
    readDocs: "Dokumente lesen…",
    detectDamage: "Dein Auto wird komplett überprüft…",
    estimateValue: "Wert schätzen…",
    fairValueTitle: "Fair-Value-Analyse",
    damagesDetected: "Erkannte Schäden",
    noDamages: "Keine Schäden erkannt",
    recommendedPrice: "Empfohlener Preis",
    yourPrice: "Ihr Preis",
    adPreview: "Inserat-Vorschau",
    missingInfo: "Fehlende Informationen",
    confirmField: "Bestätigen",
    saveAd: "Entwurf speichern",
    placeAd: "Inserat veröffentlichen",
    needsLogin: "Anmeldung erforderlich",
    next: "Weiter",
    back: "Zurück",
    photos: "Fotos",
    documents: "Dokumente",
  } : {
    title: "Sell Your Car",
    subtitle: "AI analyzes your photos and creates your listing",
    uploadTitle: "Upload Everything",
    uploadDesc: "Drag & drop all your car photos, registration documents, and other files",
    uploadHint: "Photos, registration document, driver's license, service book — all at once",
    analyzing: "Autozon AI Analyzing Your Vehicle…",
    scanPhotos: "Scanning photos…",
    readDocs: "Reading documents…",
    detectDamage: "Checking your car for everything…",
    estimateValue: "Estimating value…",
    fairValueTitle: "Fair Value Analysis",
    damagesDetected: "Damages Detected",
    noDamages: "No damages detected",
    recommendedPrice: "Recommended Price",
    yourPrice: "Your Asking Price",
    adPreview: "Ad Preview",
    missingInfo: "Missing Information",
    confirmField: "Confirm",
    saveAd: "Save as Draft",
    placeAd: "Place Ad — Go Live",
    needsLogin: "Login required",
    next: "Next",
    back: "Back",
    photos: "Photos",
    documents: "Documents",
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO path="/sell" title="Sell Your Car — AI-Powered | Autozon" />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                i === step ? "bg-orange text-orange-foreground" :
                i < step ? "bg-orange/20 text-orange" : "bg-muted text-muted-foreground"
              }`}>
                <s.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-6 h-0.5 ${i < step ? "bg-orange" : "bg-border"}`} />}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Upload */}
          {step === 0 && (
            <motion.div key="upload" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-center mb-2">{sw.uploadTitle}</h1>
              <p className="text-muted-foreground text-center mb-8">{sw.uploadDesc}</p>

              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-orange/40 rounded-2xl p-10 sm:p-16 text-center hover:border-orange/70 transition-colors cursor-pointer bg-orange/5"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="h-12 w-12 text-orange mx-auto mb-4" />
                <p className="text-foreground font-semibold text-lg mb-1">{sw.uploadHint}</p>
                <p className="text-muted-foreground text-sm">
                  {language === "de" ? "Klicken oder Dateien hierher ziehen" : "Click or drag files here"}
                </p>
                <input id="file-input" type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileSelect} />
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <div className="flex gap-6 mb-4">
                    <span className="text-sm font-medium text-foreground">
                      <Image className="h-4 w-4 inline mr-1" />{sw.photos}: {files.filter(isImage).length}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      <FileText className="h-4 w-4 inline mr-1" />{sw.documents}: {files.filter(f => !isImage(f)).length}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {files.map((f, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-border bg-muted aspect-square">
                        {isImage(f) ? (
                          <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full"><FileText className="h-8 w-8 text-muted-foreground" /></div>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                          className="absolute top-1 right-1 bg-destructive/80 text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button size="lg" className="bg-orange text-orange-foreground hover:bg-orange/90 font-bold px-8" onClick={uploadAndAnalyze}>
                      <Brain className="h-5 w-5 mr-2" />
                      {language === "de" ? "KI-Analyse starten" : "Start AI Analysis"}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 1: AI Analysis Animation */}
          {step === 1 && (
            <motion.div key="analyzing" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <div className="text-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mx-auto w-20 h-20 mb-8"
                >
                  <Brain className="h-20 w-20 text-orange" />
                </motion.div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">{sw.analyzing}</h2>
                <div className="max-w-md mx-auto space-y-3">
                  {[sw.scanPhotos, sw.readDocs, sw.detectDamage, sw.estimateValue].map((label, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {analysisProgress > (i + 1) * 22 ? (
                        <Check className="h-5 w-5 text-green shrink-0" />
                      ) : analysisProgress > i * 22 ? (
                        <Loader2 className="h-5 w-5 text-orange animate-spin shrink-0" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-border shrink-0" />
                      )}
                      <span className={`text-sm ${analysisProgress > i * 22 ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 max-w-md mx-auto">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-orange rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${analysisProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Fair Value Analysis */}
          {step === 2 && analysis && (
            <motion.div key="fairvalue" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-display font-bold text-foreground text-center mb-6">{sw.fairValueTitle}</h2>

              {/* Detected Vehicle */}
              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Car className="h-6 w-6 text-orange" />
                  <h3 className="text-lg font-bold text-foreground">
                    {getFieldValue("make")} {getFieldValue("model")} {getFieldValue("year")}
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Mileage:</span> <span className="font-medium">{getFieldValue("mileage")?.toLocaleString()} km</span></div>
                  <div><span className="text-muted-foreground">Fuel:</span> <span className="font-medium">{getFieldValue("fuel_type")}</span></div>
                  <div><span className="text-muted-foreground">Power:</span> <span className="font-medium">{getFieldValue("power_hp")} HP</span></div>
                  <div><span className="text-muted-foreground">Color:</span> <span className="font-medium">{getFieldValue("color") || "—"}</span></div>
                </div>
              </div>

              {/* Damages */}
              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <h3 className="text-base font-bold text-foreground mb-3">{sw.damagesDetected}</h3>
                {analysis.damages.length === 0 ? (
                  <p className="text-green text-sm font-medium">✓ {sw.noDamages}</p>
                ) : (
                  <div className="space-y-2">
                    {analysis.damages.map((d, i) => (
                      <div key={i} className="flex items-center justify-between bg-muted rounded-lg px-4 py-2">
                        <div>
                          <span className="font-medium text-sm text-foreground">{d.description}</span>
                          <span className="text-xs text-muted-foreground ml-2">({d.location})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={d.severity === "high" ? "destructive" : d.severity === "medium" ? "secondary" : "outline"}>
                            {d.severity}
                          </Badge>
                          <span className="text-sm font-mono text-foreground">€{d.estimated_repair_cost_eur}</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-sm text-muted-foreground mt-2">
                      {language === "de" ? "Geschätzte Reparaturkosten gesamt:" : "Total estimated repair cost:"} <strong>€{analysis.totalDamageCost.toLocaleString()}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Fair Value */}
              <div className="bg-orange/10 border border-orange/30 rounded-xl p-6 mb-6 text-center">
                <p className="text-sm text-orange font-bold uppercase tracking-wider mb-1">{sw.recommendedPrice}</p>
                <p className="text-4xl font-display font-black text-foreground">
                  €{analysis.fairValue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === "de" ? "Preisspanne:" : "Price range:"} €{analysis.priceRange.min.toLocaleString()} – €{analysis.priceRange.max.toLocaleString()}
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)}><ArrowLeft className="h-4 w-4 mr-2" />{sw.back}</Button>
                <Button className="bg-orange text-orange-foreground hover:bg-orange/90" onClick={() => setStep(3)}>
                  {sw.next}<ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Ad Preview */}
          {step === 3 && analysis && (
            <motion.div key="preview" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-display font-bold text-foreground text-center mb-6">{sw.adPreview}</h2>

              {/* Missing fields */}
              {analysis.missingFields.length > 0 && (
                <div className="bg-orange/10 border border-orange/30 rounded-xl p-5 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-orange" />
                    <h3 className="font-bold text-foreground">{sw.missingInfo}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysis.missingFields.includes("smoker_car") && (
                      <div className="flex items-center justify-between bg-card rounded-lg px-4 py-2">
                        <span className="text-sm">{language === "de" ? "Raucherauto" : "Smoker car"}</span>
                        <Switch checked={userOverrides.smoker_car ?? false} onCheckedChange={v => setOverride("smoker_car", v)} />
                      </div>
                    )}
                    {analysis.missingFields.includes("service_book_updated") && (
                      <div className="flex items-center justify-between bg-card rounded-lg px-4 py-2">
                        <span className="text-sm">{language === "de" ? "Serviceheft gepflegt" : "Service book updated"}</span>
                        <Switch checked={userOverrides.service_book_updated ?? false} onCheckedChange={v => setOverride("service_book_updated", v)} />
                      </div>
                    )}
                    {analysis.missingFields.includes("accident_history") && (
                      <div className="flex items-center justify-between bg-card rounded-lg px-4 py-2">
                        <span className="text-sm">{language === "de" ? "Unfallhistorie" : "Accident history"}</span>
                        <Switch checked={userOverrides.accident_history ?? false} onCheckedChange={v => setOverride("accident_history", v)} />
                      </div>
                    )}
                    {analysis.missingFields.includes("warranty_type") && (
                      <div className="bg-card rounded-lg px-4 py-2">
                        <span className="text-sm block mb-1">{language === "de" ? "Garantie" : "Warranty"}</span>
                        <Select value={userOverrides.warranty_type ?? "none"} onValueChange={v => setOverride("warranty_type", v)}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{language === "de" ? "Keine" : "None"}</SelectItem>
                            <SelectItem value="manufacturer">{language === "de" ? "Herstellergarantie" : "Manufacturer"}</SelectItem>
                            <SelectItem value="thirdParty">{language === "de" ? "Drittanbieter" : "Third-party"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {analysis.missingFields.filter(f => !["smoker_car", "service_book_updated", "accident_history", "warranty_type"].includes(f)).map(field => (
                      <div key={field} className="bg-card rounded-lg px-4 py-2">
                        <span className="text-sm block mb-1 capitalize">{field.replace(/_/g, " ")}</span>
                        <Input
                          className="h-8 text-sm"
                          value={userOverrides[field] ?? ""}
                          onChange={e => setOverride(field, e.target.value)}
                          placeholder={language === "de" ? "Eingeben…" : "Enter…"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="bg-card border border-border rounded-xl p-5 mb-6">
                <label className="text-sm font-bold text-foreground block mb-2">{sw.yourPrice}</label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">€</span>
                  <Input
                    type="number"
                    value={askingPrice}
                    onChange={e => setAskingPrice(Number(e.target.value))}
                    className="text-lg font-bold max-w-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="bg-card border border-border rounded-xl p-5 mb-6">
                <label className="text-sm font-bold text-foreground block mb-2">
                  {language === "de" ? "Beschreibung" : "Description"}
                </label>
                <Textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  rows={6}
                  className="text-sm"
                />
              </div>

              {/* Photos preview */}
              {analysis.photos.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-bold text-foreground mb-2">{sw.photos}</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {analysis.photos.map((url, i) => (
                      <img key={i} src={url} alt="" className="rounded-lg aspect-square object-cover border border-border" />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4 mr-2" />{sw.back}</Button>
                <Button className="bg-orange text-orange-foreground hover:bg-orange/90" onClick={() => setStep(4)}>
                  {sw.next}<ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Save or Publish */}
          {step === 4 && (
            <motion.div key="publish" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <div className="text-center py-8">
                <Rocket className="h-16 w-16 text-orange mx-auto mb-4" />
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  {language === "de" ? "Bereit zum Veröffentlichen!" : "Ready to Go Live!"}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {language === "de"
                    ? "Speichern Sie als Entwurf oder veröffentlichen Sie Ihr Inserat sofort."
                    : "Save as a draft or publish your listing immediately."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 font-bold"
                    disabled={saving}
                    onClick={() => saveCar(false)}
                  >
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {sw.saveAd}
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 bg-orange text-orange-foreground hover:bg-orange/90 font-bold"
                    disabled={saving}
                    onClick={() => saveCar(true)}
                  >
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {sw.placeAd}
                  </Button>
                </div>

                {!userId && (
                  <p className="text-sm text-orange mt-4">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    {sw.needsLogin}
                  </p>
                )}
              </div>

              <div className="flex justify-start mt-4">
                <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="h-4 w-4 mr-2" />{sw.back}</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SellWizard;
