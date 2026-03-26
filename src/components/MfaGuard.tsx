import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface MfaGuardProps {
  children: React.ReactNode;
}

/**
 * Wraps protected routes to enforce MFA.
 * Redirects unenrolled users to /mfa-enroll and unverified users to /mfa-verify.
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

      const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (data?.currentLevel === "aal2") {
        setReady(true);
        return;
      }

      if (data?.nextLevel === "aal2") {
        // Has factor but needs verification this session
        navigate("/mfa-verify");
        return;
      }

      // No factor enrolled yet
      navigate("/mfa-enroll");
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
