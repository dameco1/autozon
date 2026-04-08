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

const Login: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    // After login, always go to verify-otp (the guard/page will check if already verified)
    navigate("/verify-otp");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SEO title="Log In" description="Log in to your Autozon account to manage your cars, track valuations, and connect with buyers." path="/login" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Car className="h-8 w-8 text-orange" />
            <span className="text-2xl font-display font-bold text-foreground">auto<span className="text-orange">zon</span></span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-foreground">{t.auth.loginTitle}</h1>
          <p className="text-muted-foreground mt-2">{t.auth.loginSubtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card border border-border rounded-2xl p-8 space-y-5 shadow-sm">
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
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">{t.auth.password}</Label>
              <Link to="/reset-password" className="text-xs text-orange hover:underline">{t.auth.forgotPassword}</Link>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-orange text-orange-foreground hover:bg-orange/90 font-bold py-6 rounded-xl">
            {loading ? "..." : t.auth.login}
          </Button>
          <p className="text-center text-muted-foreground text-sm">
            {t.auth.noAccount}{" "}
            <Link to="/signup" className="text-orange hover:underline font-medium">{t.auth.signupLink}</Link>
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

export default Login;
