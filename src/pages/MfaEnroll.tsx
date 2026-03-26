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

const MfaEnroll: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(true);

  useEffect(() => {
    const enroll = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // Check if already enrolled
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.currentLevel === "aal2") {
        navigate("/intent");
        return;
      }
      if (aalData?.nextLevel === "aal2") {
        navigate("/mfa-verify");
        return;
      }

      // Check existing factors
      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      if (factorsData?.totp && factorsData.totp.length > 0) {
        // Already has a TOTP factor, go to verify
        navigate("/mfa-verify");
        return;
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        issuer: "Autozon",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
      setEnrolling(false);
    };

    enroll();
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

      toast.success(t.mfa.setupSuccess);
      navigate("/intent");
    } catch (err: any) {
      toast.error(err.message || t.mfa.invalidCode);
    } finally {
      setLoading(false);
    }
  };

  if (enrolling) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Setting up 2FA…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SEO title="Set Up 2FA" description="Set up two-factor authentication for your Autozon account." path="/mfa-enroll" />
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
            <h1 className="text-3xl font-display font-bold text-foreground">{t.mfa.setupTitle}</h1>
          </div>
          <p className="text-muted-foreground mt-2">{t.mfa.setupSubtitle}</p>
        </div>

          <div className="bg-secondary/50 border border-border rounded-2xl p-8 space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{t.mfa.step1}</p>
            <p className="text-xs text-primary/80">{t.mfa.step1hint}</p>
            <div className="flex justify-center bg-white rounded-xl p-4">
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{t.mfa.manualEntry}</p>
            <code className="block bg-background border border-border rounded-lg p-3 text-xs text-primary break-all font-mono">
              {secret}
            </code>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">{t.mfa.step2}</Label>
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
              {loading ? "..." : t.mfa.verifyAndActivate}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MfaEnroll;
