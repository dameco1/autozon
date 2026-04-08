import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface MfaGuardProps {
  children: React.ReactNode;
}

/**
 * Wraps protected routes to enforce email OTP verification.
 * Redirects unauthenticated users to /login and unverified users to /verify-otp.
 */
const MfaGuard: React.FC<MfaGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // Check if email OTP has been verified (stored in app_metadata by the verify edge function)
      const otpVerifiedAt = session.user.app_metadata?.email_otp_verified_at;
      if (otpVerifiedAt) {
        setReady(true);
        return;
      }

      // Not verified yet — redirect to OTP page
      navigate("/verify-otp");
    };

    check();
  }, [navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Verifying security…</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MfaGuard;
