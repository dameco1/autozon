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

      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error) {
        setStatus("unenrolled");
        return;
      }

      if (data.currentLevel === "aal2") {
        setStatus("verified");
      } else if (data.nextLevel === "aal2") {
        // Has enrolled factor but hasn't verified this session
        setStatus("unverified");
      } else {
        setStatus("unenrolled");
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
