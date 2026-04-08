import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MfaStatus = "loading" | "unenrolled" | "unverified" | "verified";

export function useMfaStatus() {
  const [status, setStatus] = useState<MfaStatus>("loading");

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus("unenrolled");
        return;
      }

      // Check email OTP verification from app_metadata
      const otpVerifiedAt = session.user.app_metadata?.email_otp_verified_at;
      if (otpVerifiedAt) {
        setStatus("verified");
      } else {
        setStatus("unverified");
      }
    };

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      check();
    });

    return () => subscription.unsubscribe();
  }, []);

  return status;
}
