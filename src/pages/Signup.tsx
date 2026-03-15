import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const Signup: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/mfa-enroll`,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t.auth.checkEmail);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <SEO title="Sign Up" description="Create your free Autozon account. Start selling your car at fair value or find your perfect next ride." path="/signup" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Car className="h-8 w-8 text-orange" />
            <span className="text-2xl font-display font-bold text-white">auto<span className="text-orange">zon</span></span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white">{t.auth.signupTitle}</h1>
          <p className="text-silver/60 mt-2">{t.auth.signupSubtitle}</p>
        </div>

        <form onSubmit={handleSignup} className="bg-secondary/50 border border-border rounded-2xl p-8 space-y-5">
          <div className="space-y-2">
            <Label className="text-silver/80">{t.auth.fullName}</Label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-charcoal border-border text-white placeholder:text-silver/30"
              placeholder="Max Mustermann"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-silver/80">{t.auth.email}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-charcoal border-border text-white placeholder:text-silver/30"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-silver/80">{t.auth.password}</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-charcoal border-border text-white placeholder:text-silver/30"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl">
            {loading ? "..." : t.auth.signup}
          </Button>
          <p className="text-center text-silver/60 text-sm">
            {t.auth.hasAccount}{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">{t.auth.loginLink}</Link>
          </p>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-silver/40 text-sm hover:text-silver/60 inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> {t.auth.back}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
