import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const MfaVerify: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.currentLevel === "aal2") {
        navigate("/intent");
        return;
      }

      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      const totpFactor = factorsData?.totp?.find((f) => f.status === "verified");

      if (!totpFactor) {
        navigate("/mfa-enroll");
        return;
      }

      setFactorId(totpFactor.id);
      setReady(true);
    };

    init();
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

      if (verifyError) throw verifyError;

      navigate("/intent");
    } catch (err: any) {
      toast.error(err.message || t.mfa.invalidCode);
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SEO title="Verify 2FA" description="Enter your authenticator code to log in." path="/mfa-verify" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold text-foreground">
              auto<span className="text-primary">zon</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-display font-bold text-foreground">{t.mfa.verifyTitle}</h1>
          </div>
          <p className="text-muted-foreground mt-2">{t.mfa.verifySubtitle}</p>
        </div>

        <form onSubmit={handleVerify} className="bg-secondary/50 border border-border rounded-2xl p-8 space-y-5">
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t.mfa.enterCode}</Label>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground text-center text-2xl tracking-[0.5em] font-mono"
              placeholder="000000"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl"
          >
            {loading ? "..." : t.mfa.verify}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MfaVerify;
