import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, ArrowLeft, Loader2, XCircle, ExternalLink, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

const KycVerification: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const kyc = (t as any).kyc;
  const [userId, setUserId] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<string>("none");
  const [userType, setUserType] = useState<string>("private");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  // Initial load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/login"); return; }
      setUserId(session.user.id);
      supabase.from("profiles").select("kyc_status, user_type").eq("user_id", session.user.id).maybeSingle()
        .then(({ data }) => {
          if (data) {
            setKycStatus((data as any).kyc_status || "none");
            setUserType((data as any).user_type || "private");
          }
          setLoading(false);
        });
    });
  }, [navigate]);

  // Poll for KYC status updates when pending/in_progress
  useEffect(() => {
    if (!userId || !["pending", "in_progress", "pending_review"].includes(kycStatus)) return;

    const pollStatus = async () => {
      try {
        const res = await supabase.functions.invoke("get-kyc-status");
        if (res.data?.status && res.data.status !== kycStatus) {
          setKycStatus(res.data.status);
          if (res.data.status === "approved" || res.data.status === "verified") {
            toast.success(kyc.verified);
          } else if (res.data.status === "declined") {
            toast.error(kyc.declined);
          }
        }
      } catch (e) {
        console.error("KYC poll error:", e);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 8000);
    return () => clearInterval(interval);
  }, [userId, kycStatus, kyc, navigate]);

  const startVerification = async () => {
    if (!userId) return;
    setStarting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }

      const res = await supabase.functions.invoke("kyc-create-session", {
        body: { role: "buyer", transaction_id: null },
      });

      if (res.error) throw new Error(res.error.message);

      const { verification_url } = res.data;
      if (verification_url) {
        window.open(verification_url, "_blank");
        setKycStatus("pending");
        toast.success(kyc.verifyingIdentity);
      } else {
        throw new Error("No verification URL received");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start verification");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Verified state
  if (kycStatus === "verified" || kycStatus === "approved") {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="KYC Verified | Autozon" />
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">{kyc.verified}</h1>
            <p className="text-muted-foreground mb-6">{kyc.verifiedDesc}</p>
            <Button onClick={() => navigate("/dashboard")} className="bg-primary text-primary-foreground">{kyc.goToDashboard}</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Pending / In Review state — poll for updates
  if (kycStatus === "pending" || kycStatus === "in_progress" || kycStatus === "pending_review") {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="KYC Pending | Autozon" />
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">{kyc.pending}</h1>
            <p className="text-muted-foreground mb-6">{kyc.pendingDesc}</p>
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="border-border text-foreground">{kyc.backToDashboard}</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Declined state
  if (kycStatus === "declined") {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="KYC Declined | Autozon" />
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">{kyc.declined}</h1>
            <p className="text-muted-foreground mb-6">{kyc.declinedDesc}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={startVerification} disabled={starting} className="bg-primary text-primary-foreground">
                {starting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {kyc.tryAgain}
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")} className="border-border text-foreground">{kyc.backToDashboard}</Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Default: Not started
  return (
    <div className="min-h-screen bg-background">
      <SEO title="KYC Verification | Autozon" description="Verify your identity to proceed with car transactions" />
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-10">
        <Button variant="ghost" className="mb-4 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.auth.back}
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">{kyc.title}</h1>
          <p className="text-muted-foreground">{kyc.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-8 space-y-6"
        >
          {/* User type badge */}
          <div className="flex items-center justify-center gap-2">
            {userType !== "private" ? (
              <Badge variant="outline" className="gap-1.5 px-3 py-1">
                <Building2 className="h-3.5 w-3.5" />
                {(t.auth as any).businessEntity}
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1.5 px-3 py-1">
                <Shield className="h-3.5 w-3.5" />
                {(t.auth as any).privatePerson}
              </Badge>
            )}
          </div>

          {userType !== "private" && (
            <p className="text-sm text-muted-foreground text-center bg-secondary/50 rounded-xl p-3">
              {kyc.businessNote}
            </p>
          )}

          {/* What happens */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">ID document scan (passport, driver's license, or national ID)</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Selfie verification for liveness check</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Automated review — typically under 5 minutes</span>
            </div>
          </div>

          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-base"
            onClick={startVerification}
            disabled={starting}
          >
            {starting ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {kyc.verifyingIdentity}</>
            ) : (
              <><ExternalLink className="mr-2 h-5 w-5" /> {kyc.startVerification}</>
            )}
          </Button>
        </motion.div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          {kyc.securityNote}
        </p>
      </div>
    </div>
  );
};

export default KycVerification;
