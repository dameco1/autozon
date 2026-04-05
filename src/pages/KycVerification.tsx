import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Upload, Camera, CheckCircle2, ArrowLeft, Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const KycVerification: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<string>("none");
  const [step, setStep] = useState(1);
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/login"); return; }
      setUserId(session.user.id);
      supabase.from("profiles").select("kyc_status, city").eq("user_id", session.user.id).maybeSingle()
        .then(({ data }) => {
          if (data) {
            setKycStatus((data as any).kyc_status || "none");
            setCity(data.city || "");
          }
        });
    });
  }, [navigate]);

  const handleFileChange = (setter: (f: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    setter(file);
  };

  const handleSubmit = async () => {
    if (!userId) return;
    if (!idFront || !idBack || !selfie) {
      toast.error("Please upload all required documents.");
      return;
    }
    if (!address.trim() || !city.trim() || !postalCode.trim()) {
      toast.error("Please fill in your address.");
      return;
    }

    setSubmitting(true);

    try {
      // Upload files to storage
      const uploads = [
        { file: idFront, path: `kyc/${userId}/id-front` },
        { file: idBack, path: `kyc/${userId}/id-back` },
        { file: selfie, path: `kyc/${userId}/selfie` },
      ];

      for (const { file, path } of uploads) {
        const ext = file.name.split(".").pop() || "jpg";
        const { error } = await supabase.storage.from("car-images").upload(`${path}.${ext}`, file, { upsert: true });
        if (error) throw error;
      }

      // Update profile KYC status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ kyc_status: "pending", city, country: "Austria" } as any)
        .eq("user_id", userId);

      if (profileError) throw profileError;

      setKycStatus("pending");
      toast.success("KYC documents submitted successfully! Review typically takes 1-2 business days.");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (kycStatus === "verified") {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="KYC Verified | Autozon" />
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Identity Verified</h1>
          <p className="text-muted-foreground mb-6">Your identity has been verified. You can proceed with transactions.</p>
          <Button onClick={() => navigate("/dashboard")} className="bg-primary text-primary-foreground">Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (kycStatus === "pending") {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="KYC Pending | Autozon" />
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Verification In Progress</h1>
          <p className="text-muted-foreground mb-6">Your documents are being reviewed. This usually takes 1-2 business days.</p>
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="border-border text-foreground">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="KYC Verification | Autozon" description="Verify your identity to proceed with car transactions" />
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Button variant="ghost" className="mb-4 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Identity Verification</h1>
            <p className="text-muted-foreground">Required before signing a purchase contract</p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                s === step ? "bg-primary text-primary-foreground" : s < step ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              }`}>{s < step ? "✓" : s}</div>
              {s < 3 && <div className={`flex-1 h-0.5 ${s < step ? "bg-primary" : "bg-border"}`} />}
            </React.Fragment>
          ))}
        </div>

        <Card className="border-border">
          <CardContent className="pt-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <CardTitle className="text-foreground flex items-center gap-2"><Upload className="h-5 w-5 text-primary" /> ID Document</CardTitle>
                <p className="text-sm text-muted-foreground">Upload front and back of your government-issued ID (passport, driver's license, or national ID).</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm mb-2 block">Front Side</Label>
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      idFront ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}>
                      <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">{idFront ? idFront.name : "Click to upload"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange(setIdFront)} />
                    </label>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm mb-2 block">Back Side</Label>
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      idBack ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}>
                      <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">{idBack ? idBack.name : "Click to upload"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange(setIdBack)} />
                    </label>
                  </div>
                </div>

                <Button className="w-full bg-primary text-primary-foreground" onClick={() => setStep(2)} disabled={!idFront || !idBack}>
                  Continue
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <CardTitle className="text-foreground flex items-center gap-2"><Camera className="h-5 w-5 text-primary" /> Selfie Verification</CardTitle>
                <p className="text-sm text-muted-foreground">Upload a clear photo of yourself holding your ID next to your face.</p>

                <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  selfie ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}>
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">{selfie ? selfie.name : "Click to upload selfie"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange(setSelfie)} />
                </label>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-border text-foreground" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1 bg-primary text-primary-foreground" onClick={() => setStep(3)} disabled={!selfie}>Continue</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <CardTitle className="text-foreground flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Address Verification</CardTitle>
                <p className="text-sm text-muted-foreground">Confirm your residential address.</p>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Street Address</Label>
                    <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Hauptstraße 1" className="mt-1 bg-background border-border text-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-muted-foreground text-sm">Postal Code</Label>
                      <Input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="1010" className="mt-1 bg-background border-border text-foreground" />
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">City</Label>
                      <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Wien" className="mt-1 bg-background border-border text-foreground" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-border text-foreground" onClick={() => setStep(2)}>Back</Button>
                  <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Verification"}
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Your documents are encrypted and stored securely. They are only used for identity verification per Austrian AML regulations.
        </p>
      </div>
    </div>
  );
};

export default KycVerification;
