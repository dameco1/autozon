import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Car, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const PURPOSES = ["daily", "work", "pleasure", "summer", "winter"] as const;
const RELATIONSHIPS = ["single", "married", "divorced"] as const;
const BUDGET_OPTIONS = [5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000];

const Signup: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [hasKids, setHasKids] = useState("");
  const [numKids, setNumKids] = useState("");
  const [purpose, setPurpose] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [loading, setLoading] = useState(false);

  const ls = t.lifestyle;

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

    // Save lifestyle data to profile after signup
    if (data.user) {
      await supabase.from("profiles").update({
        relationship_status: relationship || null,
        has_kids: hasKids === "yes" ? true : hasKids === "no" ? false : null,
        num_kids: hasKids === "yes" && numKids ? Number(numKids) : null,
        car_purpose: purpose || null,
        budget_max: budgetMax ? Number(budgetMax) : null,
      }).eq("user_id", data.user.id);
    }

    setLoading(false);
    toast.success(t.auth.checkEmail);
  };

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
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
              placeholder="Max Mustermann"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t.auth.email}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t.auth.password}</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
              placeholder="••••••••"
            />
          </div>

          {/* Lifestyle questions divider */}
          <div className="border-t border-border pt-4">
            <p className="text-muted-foreground/70 text-xs uppercase tracking-wider mb-4">{ls.sectionTitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Relationship */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">{ls.relationship}</Label>
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder={ls.selectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIPS.map((r) => (
                    <SelectItem key={r} value={r}>{ls.relationships[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Kids */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">{ls.kids}</Label>
              <Select value={hasKids} onValueChange={setHasKids}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder={ls.selectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {["0", "1", "2", "3", "3+"].map((k) => (
                    <SelectItem key={k} value={k}>{k} {k === "0" ? ls.noKids : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Purpose */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">{ls.purpose}</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder={ls.selectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSES.map((p) => (
                    <SelectItem key={p} value={p}>{ls.purposes[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">{ls.budget}</Label>
              <Select value={budgetMax} onValueChange={setBudgetMax}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder={ls.selectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((b) => (
                    <SelectItem key={b} value={String(b)}>€{b.toLocaleString()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
