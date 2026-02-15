import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const ResetPassword: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Check if this is a password update (user arrived via reset link)
  const [isUpdate, setIsUpdate] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // If the URL contains access_token or type=recovery, user clicked the reset link
    const hash = window.location.hash;
    if (hash.includes("type=recovery") || hash.includes("access_token")) {
      setIsUpdate(true);
    }

    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsUpdate(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success(t.auth.resetSent);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(t.auth.passwordMismatch);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t.auth.passwordUpdated);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <SEO title="Reset Password" description="Reset your Autozon account password." path="/reset-password" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold text-white">auto<span className="text-primary">zon</span></span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white">{t.auth.resetTitle}</h1>
          <p className="text-silver/60 mt-2">{isUpdate ? "" : t.auth.resetSubtitle}</p>
        </div>

        {isUpdate ? (
          <form onSubmit={handleUpdatePassword} className="bg-secondary/50 border border-border rounded-2xl p-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-silver/80">{t.auth.newPassword}</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="bg-charcoal border-border text-white placeholder:text-silver/30"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-silver/80">{t.auth.confirmNewPassword}</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="bg-charcoal border-border text-white placeholder:text-silver/30"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl">
              {loading ? "..." : t.auth.updatePassword}
            </Button>
          </form>
        ) : sent ? (
          <div className="bg-secondary/50 border border-border rounded-2xl p-8 text-center space-y-4">
            <p className="text-silver/80">{t.auth.resetSent}</p>
            <Link to="/login" className="text-primary hover:underline font-medium text-sm">{t.auth.loginLink}</Link>
          </div>
        ) : (
          <form onSubmit={handleSendReset} className="bg-secondary/50 border border-border rounded-2xl p-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-silver/80">{t.auth.email}</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-charcoal border-border text-white placeholder:text-silver/30"
                placeholder="you@example.com"
                autoFocus
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl">
              {loading ? "..." : t.auth.sendReset}
            </Button>
            <p className="text-center text-silver/60 text-sm">
              <Link to="/login" className="text-primary hover:underline font-medium">{t.auth.loginLink}</Link>
            </p>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-silver/40 text-sm hover:text-silver/60 inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> {t.auth.back}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
