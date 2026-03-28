import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useCarMakes } from "@/hooks/useCarModels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Car, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const PURPOSES = ["daily", "work", "pleasure", "summer", "winter"] as const;
const RELATIONSHIPS = ["single", "married", "divorced"] as const;
const BUDGET_OPTIONS = [5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000, 200000, -1];
const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Wagon", "Coupe", "Convertible", "Van", "Pickup"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const TRANSMISSIONS = ["Manual", "Automatic"];
const FEATURES = ["Navigation", "Heated Seats", "Parking Sensors", "Backup Camera", "Sunroof", "Leather Interior", "LED Headlights", "Adaptive Cruise Control", "Lane Assist", "Apple CarPlay"];
const COLORS = ["Black", "White", "Silver", "Grey", "Blue", "Red", "Green", "Brown", "Beige", "Orange"];
const TIMING_OPTIONS = ["immediately", "1-3months", "browsing"] as const;

const Signup: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: dbMakes } = useCarMakes();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [hasKids, setHasKids] = useState("");
  const [numKids, setNumKids] = useState("");
  const [purpose, setPurpose] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [currentCar, setCurrentCar] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);

  // Buyer preferences (all optional)
  const [prefBrands, setPrefBrands] = useState<string[]>([]);
  const [prefBodyTypes, setPrefBodyTypes] = useState<string[]>([]);
  const [prefFuelTypes, setPrefFuelTypes] = useState<string[]>([]);
  const [prefTransmission, setPrefTransmission] = useState("");
  const [prefBudgetMin, setPrefBudgetMin] = useState(5000);
  const [prefBudgetMax, setPrefBudgetMax] = useState(50000);
  const [prefYearMin, setPrefYearMin] = useState(2018);
  const [prefYearMax, setPrefYearMax] = useState(2026);
  const [prefFeatures, setPrefFeatures] = useState<string[]>([]);
  const [prefColors, setPrefColors] = useState<string[]>([]);
  const [prefTiming, setPrefTiming] = useState("");

  const ls = t.lifestyle;

  const toggleArray = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/mfa-enroll`,
        data: { full_name: fullName },
      },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (data.user) {
      // Save lifestyle data to profile
      await supabase.from("profiles").update({
        relationship_status: relationship || null,
        has_kids: hasKids === "yes" ? true : hasKids === "no" ? false : null,
        num_kids: hasKids === "yes" && numKids ? Number(numKids) : null,
        car_purpose: purpose || null,
        budget_max: budgetMax && Number(budgetMax) > 0 ? Number(budgetMax) : null,
        current_car: currentCar || null,
      }).eq("user_id", data.user.id);

      // Save buyer preferences if any were filled
      const hasAnyPref = prefBrands.length > 0 || prefBodyTypes.length > 0 || prefFuelTypes.length > 0 ||
        prefTransmission || prefFeatures.length > 0 || prefColors.length > 0 || prefTiming;

      if (hasAnyPref) {
        await supabase.from("user_preferences").upsert({
          user_id: data.user.id,
          preferred_makes: prefBrands,
          preferred_body_types: prefBodyTypes,
          preferred_fuel_types: prefFuelTypes,
          preferred_transmission: prefTransmission || null,
          min_budget: prefBudgetMin,
          max_budget: prefBudgetMax,
          min_year: prefYearMin,
          max_year: prefYearMax,
          preferred_colors: prefColors,
          timing_preference: prefTiming || null,
        } as any, { onConflict: "user_id" });
      }
    }

    setLoading(false);
    toast.success(t.auth.checkEmail);
  };

  const renderChipSelect = (options: string[], selected: string[], setter: (v: string[]) => void) => (
    <div className="flex flex-wrap gap-1.5">
      {options.map((item) => (
        <label
          key={item}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs transition-all ${
            selected.includes(item) ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground hover:border-primary/30"
          }`}
        >
          <Checkbox checked={selected.includes(item)} onCheckedChange={() => toggleArray(selected, item, setter)} className="h-3 w-3" />
          {item}
        </label>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <SEO title="Sign Up" description="Create your free Autozon account. Start selling your car at fair value or find your perfect next ride." path="/signup" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Car className="h-8 w-8 text-orange" />
            <span className="text-2xl font-display font-bold text-foreground">auto<span className="text-orange">zon</span></span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-foreground">{t.auth.signupTitle}</h1>
          <p className="text-muted-foreground mt-2">{t.auth.signupSubtitle}</p>
        </div>

        <form onSubmit={handleSignup} className="bg-card border border-border rounded-2xl p-8 space-y-5 shadow-sm">
          {/* Account fields */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t.auth.fullName}</Label>
            <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="bg-background border-border text-foreground placeholder:text-muted-foreground/50" placeholder="Max Mustermann" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t.auth.email}</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background border-border text-foreground placeholder:text-muted-foreground/50" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t.auth.password}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="bg-background border-border text-foreground placeholder:text-muted-foreground/50" placeholder="••••••••" />
          </div>

          {/* Lifestyle questions divider */}
          <div className="border-t border-border pt-4">
            <p className="text-muted-foreground/70 text-xs uppercase tracking-wider mb-4">{ls.sectionTitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">{ls.relationship}</Label>
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger className="bg-background border-border text-foreground"><SelectValue placeholder={ls.selectPlaceholder} /></SelectTrigger>
                <SelectContent>{RELATIONSHIPS.map((r) => <SelectItem key={r} value={r}>{ls.relationships[r]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">{ls.kids}</Label>
              <Select value={hasKids} onValueChange={setHasKids}>
                <SelectTrigger className="bg-background border-border text-foreground"><SelectValue placeholder={ls.selectPlaceholder} /></SelectTrigger>
                <SelectContent>{["0", "1", "2", "3", "3+"].map((k) => <SelectItem key={k} value={k}>{k} {k === "0" ? ls.noKids : ""}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">{ls.purpose}</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger className="bg-background border-border text-foreground"><SelectValue placeholder={ls.selectPlaceholder} /></SelectTrigger>
                <SelectContent>{PURPOSES.map((p) => <SelectItem key={p} value={p}>{ls.purposes[p]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">{ls.budget}</Label>
              <Select value={budgetMax} onValueChange={setBudgetMax}>
                <SelectTrigger className="bg-background border-border text-foreground"><SelectValue placeholder={ls.selectPlaceholder} /></SelectTrigger>
                <SelectContent>{BUDGET_OPTIONS.map((b) => <SelectItem key={b} value={String(b)}>{b === -1 ? "Unlimited" : `€${b.toLocaleString()}`}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">{ls.currentCar}</Label>
            <Input type="text" value={currentCar} onChange={(e) => setCurrentCar(e.target.value)} className="bg-background border-border text-foreground placeholder:text-muted-foreground/50" placeholder={ls.currentCarPlaceholder} />
          </div>

          {/* Buyer Preferences — collapsible */}
          <div className="border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setShowPrefs(!showPrefs)}
              className="w-full flex items-center justify-between text-left"
            >
              <div>
                <p className="text-muted-foreground/70 text-xs uppercase tracking-wider">{ls.buyerPrefsTitle}</p>
                <p className="text-muted-foreground/50 text-[11px] mt-0.5">{ls.buyerPrefsHint}</p>
              </div>
              {showPrefs ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
          </div>

          {showPrefs && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Preferred Brands */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">{ls.brandPref}</Label>
                {renderChipSelect(dbMakes || [], prefBrands, setPrefBrands)}
              </div>

              {/* Body Type */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">{ls.bodyTypePref}</Label>
                {renderChipSelect(BODY_TYPES, prefBodyTypes, setPrefBodyTypes)}
              </div>

              {/* Fuel & Transmission */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">{ls.fuelPref}</Label>
                  {renderChipSelect(FUEL_TYPES, prefFuelTypes, setPrefFuelTypes)}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">{ls.transmissionPref}</Label>
                  <div className="flex gap-2">
                    {TRANSMISSIONS.map((tr) => (
                      <button
                        key={tr}
                        type="button"
                        onClick={() => setPrefTransmission(prefTransmission === tr ? "" : tr)}
                        className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                          prefTransmission === tr ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground"
                        }`}
                      >
                        {tr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">{ls.budgetRange}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted-foreground/60 text-[11px]">{ls.budgetMin}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-primary font-bold text-sm">€{prefBudgetMin.toLocaleString()}</span>
                    </div>
                    <input type="range" min={0} max={200000} step={1000} value={prefBudgetMin} onChange={(e) => setPrefBudgetMin(Number(e.target.value))} className="w-full accent-[hsl(155,100%,42%)]" />
                  </div>
                  <div>
                    <span className="text-muted-foreground/60 text-[11px]">{ls.budgetMax}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-primary font-bold text-sm">€{prefBudgetMax.toLocaleString()}</span>
                    </div>
                    <input type="range" min={0} max={300000} step={1000} value={prefBudgetMax} onChange={(e) => setPrefBudgetMax(Number(e.target.value))} className="w-full accent-[hsl(155,100%,42%)]" />
                  </div>
                </div>
              </div>

              {/* Year Range */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">{ls.yearRange}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted-foreground/60 text-[11px]">{ls.yearMin}</span>
                    <span className="text-primary font-bold text-sm ml-2">{prefYearMin}</span>
                    <input type="range" min={2000} max={2026} value={prefYearMin} onChange={(e) => setPrefYearMin(Number(e.target.value))} className="w-full accent-[hsl(155,100%,42%)]" />
                  </div>
                  <div>
                    <span className="text-muted-foreground/60 text-[11px]">{ls.yearMax}</span>
                    <span className="text-primary font-bold text-sm ml-2">{prefYearMax}</span>
                    <input type="range" min={2000} max={2026} value={prefYearMax} onChange={(e) => setPrefYearMax(Number(e.target.value))} className="w-full accent-[hsl(155,100%,42%)]" />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">{ls.featuresPref}</Label>
                {renderChipSelect(FEATURES, prefFeatures, setPrefFeatures)}
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">{ls.colorPref}</Label>
                {renderChipSelect(COLORS, prefColors, setPrefColors)}
              </div>

              {/* Timing */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">{ls.timingPref}</Label>
                <div className="flex gap-2">
                  {TIMING_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPrefTiming(prefTiming === opt ? "" : opt)}
                      className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        prefTiming === opt ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      {ls.timingOptions[opt]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-orange text-orange-foreground hover:bg-orange/90 font-bold py-6 rounded-xl">
            {loading ? "..." : t.auth.signup}
          </Button>
          <p className="text-center text-muted-foreground text-sm">
            {t.auth.hasAccount}{" "}
            <Link to="/login" className="text-orange hover:underline font-medium">{t.auth.loginLink}</Link>
          </p>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-muted-foreground/60 text-sm hover:text-muted-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> {t.auth.back}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
