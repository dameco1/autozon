import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Car, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const CheckEmail: React.FC = () => {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const email = params.get("email") || "";

  const auth = t.auth as any;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SEO title="Check Your Email" description="Verify your email address to complete registration." path="/check-email" />
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <Car className="h-8 w-8 text-primary" />
          <span className="text-2xl font-display font-bold text-foreground">
            auto<span className="text-primary">zon</span>
          </span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-10 shadow-sm space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-10 w-10 text-primary" />
          </div>

          <h1 className="text-2xl font-display font-bold text-foreground">
            {auth.checkEmailTitle || "Check Your Email"}
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed">
            {auth.checkEmailDesc || "We've sent a verification link to your email address. Please click the link in the email to activate your account."}
          </p>

          {email && (
            <p className="text-foreground font-medium text-lg bg-muted/50 rounded-xl py-3 px-4 break-all">
              {email}
            </p>
          )}

          <div className="space-y-3 pt-2">
            <p className="text-muted-foreground text-sm">
              {auth.checkEmailHint || "Didn't receive the email? Check your spam folder or try signing up again."}
            </p>

            <Link to="/login">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl">
                {auth.checkEmailLogin || "Go to Login"}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/" className="text-muted-foreground/60 text-sm hover:text-muted-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> {t.auth.back}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;