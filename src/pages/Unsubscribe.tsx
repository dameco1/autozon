import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, MailX } from "lucide-react";
import SEO from "@/components/SEO";

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const validate = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`;
        const res = await fetch(url, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus("invalid");
        } else if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Abmelden – Autozon" description="E-Mail-Benachrichtigungen abbestellen" />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Wird geladen…</p>
              </>
            )}

            {status === "valid" && (
              <>
                <MailX className="h-12 w-12 text-primary mx-auto" />
                <h1 className="text-xl font-bold text-foreground">E-Mails abbestellen?</h1>
                <p className="text-muted-foreground">
                  Du wirst keine App-E-Mails mehr von Autozon erhalten.
                </p>
                <Button onClick={handleUnsubscribe} disabled={submitting} className="w-full rounded-lg">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Abmelden bestätigen
                </Button>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h1 className="text-xl font-bold text-foreground">Erfolgreich abgemeldet</h1>
                <p className="text-muted-foreground">
                  Du wirst keine weiteren E-Mails mehr von uns erhalten.
                </p>
              </>
            )}

            {status === "already" && (
              <>
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                <h1 className="text-xl font-bold text-foreground">Bereits abgemeldet</h1>
                <p className="text-muted-foreground">
                  Du hast dich bereits von unseren E-Mails abgemeldet.
                </p>
              </>
            )}

            {status === "invalid" && (
              <>
                <XCircle className="h-12 w-12 text-destructive mx-auto" />
                <h1 className="text-xl font-bold text-foreground">Ungültiger Link</h1>
                <p className="text-muted-foreground">
                  Dieser Abmeldelink ist ungültig oder abgelaufen.
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 text-destructive mx-auto" />
                <h1 className="text-xl font-bold text-foreground">Fehler</h1>
                <p className="text-muted-foreground">
                  Beim Abmelden ist ein Fehler aufgetreten. Bitte versuche es später erneut.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Unsubscribe;
