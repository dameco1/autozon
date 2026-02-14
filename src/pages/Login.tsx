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
    } else {
      navigate("/intent");
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <SEO title="Log In" description="Log in to your Autozon account to manage your cars, track valuations, and connect with buyers." path="/login" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold text-white">auto<span className="text-primary">zon</span></span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white">{t.auth.loginTitle}</h1>
          <p className="text-silver/60 mt-2">{t.auth.loginSubtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="bg-secondary/50 border border-border rounded-2xl p-8 space-y-5">
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
              className="bg-charcoal border-border text-white placeholder:text-silver/30"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl">
            {loading ? "..." : t.auth.login}
          </Button>
          <p className="text-center text-silver/60 text-sm">
            {t.auth.noAccount}{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">{t.auth.signupLink}</Link>
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

export default Login;
