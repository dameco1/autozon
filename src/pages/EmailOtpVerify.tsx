import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Car, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const EmailOtpVerify: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      // Check if already verified
      const otpVerified = session.user.app_metadata?.email_otp_verified_at;
      if (otpVerified) {
        navigate("/intent");
        return;
      }
      // Auto-send OTP on page load
      if (!sent) {
        sendOtp();
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendOtp = async () => {
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-email-otp");
      if (error) throw error;
      setSent(true);
      setCooldown(60);
      toast.success(t.mfa.codeSent);
    } catch (err: any) {
      toast.error(err.message || "Failed to send code");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-email-otp", {
        body: { code },
      });
      if (error) throw error;
      if (data?.verified) {
        // Refresh session to pick up updated app_metadata
        await supabase.auth.refreshSession();
        toast.success(t.mfa.verifySuccess);
        navigate("/intent");
      } else {
        toast.error(t.mfa.invalidCode);
        setCode("");
      }
    } catch (err: any) {
      toast.error(err.message || t.mfa.invalidCode);
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SEO title="Verify Your Email" description="Enter the verification code sent to your email." path="/verify-otp" />
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

        <div className="bg-secondary/50 border border-border rounded-2xl p-8 space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerify}
            disabled={loading || code.length !== 6}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl"
          >
            {loading ? "..." : t.mfa.verify}
          </Button>

          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={sendOtp}
              disabled={sending || cooldown > 0}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${sending ? "animate-spin" : ""}`} />
              {cooldown > 0
                ? `${t.mfa.resendIn} ${cooldown}s`
                : t.mfa.resendCode}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailOtpVerify;
