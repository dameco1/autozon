import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const screens = [
  { file: "01-landing.png", label: "Landing Page", route: "/" },
  { file: "02-login.png", label: "Login", route: "/login" },
  { file: "03-signup.png", label: "Signup", route: "/signup" },
  { file: "04-check-email.png", label: "Check Email", route: "/check-email" },
  { file: "05-verify-otp.png", label: "Email OTP Verification", route: "/verify-otp" },
  { file: "06-reset-password.png", label: "Reset Password", route: "/reset-password" },
  { file: "07-intent.png", label: "Intent Selection", route: "/intent" },
  { file: "08-cars.png", label: "Car Catalog", route: "/cars" },
  { file: "09-about.png", label: "About Us", route: "/about" },
  { file: "10-qa.png", label: "Q&A", route: "/qa" },
  { file: "11-privacy-policy.png", label: "Privacy Policy", route: "/privacy-policy" },
  { file: "12-terms.png", label: "Terms & Conditions", route: "/terms" },
  { file: "13-cookie-policy.png", label: "Cookie Policy", route: "/cookie-policy" },
  { file: "14-impressum.png", label: "Impressum", route: "/impressum" },
  { file: "15-brand.png", label: "Brand Book", route: "/brand" },
  { file: "16-unsubscribe.png", label: "Unsubscribe", route: "/unsubscribe" },
  { file: "17-dashboard.png", label: "Dashboard (Seller)", route: "/dashboard" },
  { file: "18-onboarding.png", label: "Onboarding", route: "/onboarding" },
  { file: "19-car-upload.png", label: "Car Upload Wizard", route: "/car-upload" },
  { file: "20-car-selection.png", label: "Car Selection (Swipe)", route: "/car-selection" },
  { file: "21-buyer-questionnaire.png", label: "Buyer Questionnaire", route: "/buyer-questionnaire" },
  { file: "22-compare.png", label: "Car Comparison", route: "/compare" },
  { file: "23-financing.png", label: "Financing Calculator", route: "/financing" },
  { file: "24-admin.png", label: "Admin Command Center", route: "/admin" },
  { file: "25-pitch.png", label: "Investor Pitch Deck", route: "/pitch" },
  { file: "26-docs.png", label: "Documentation Hub", route: "/docs" },
  { file: "27-car-detail.png", label: "Car Detail", route: "/car/:id" },
  { file: "28-fair-value.png", label: "Fair Value Result", route: "/fair-value/:id" },
  { file: "29-buyer-matches.png", label: "Buyer Matches", route: "/buyer-matches/:carId" },
  { file: "30-recommendations.png", label: "Next Car Recommendations", route: "/recommendations" },
  { file: "31-negotiation.png", label: "Transaction / Negotiation", route: "/negotiate/:offerId" },
  { file: "32-kyc.png", label: "KYC Verification", route: "/kyc" },
  { file: "33-acquisition.png", label: "Acquisition Options", route: "/acquire/:offerId" },
];

const Screenshots = () => {
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = async () => {
    if (!contentRef.current) return;
    setExporting(true);
    toast.info("Generating PDF… this may take a moment.");

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(contentRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        windowWidth: 1400,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.85);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgW = pdfW;
      const imgH = (canvas.height * imgW) / canvas.width;
      const pageH = pdfH;

      let y = 0;
      let page = 0;
      while (y < imgH) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, -y, imgW, imgH);
        y += pageH;
        page++;
      }

      pdf.save("autozon-all-screens.pdf");
      toast.success("PDF downloaded!");
    } catch (e) {
      console.error(e);
      toast.error("PDF export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <SEO title="All Screens | Autozon" description="Complete screenshot gallery of every Autozon screen." />
      <div className="min-h-screen bg-background">
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Autozon — All Screens</h1>
            <p className="text-sm text-muted-foreground">{screens.length} screens captured</p>
          </div>
          <Button onClick={handleExportPdf} disabled={exporting} className="gap-2">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {exporting ? "Exporting…" : "Export to PDF"}
          </Button>
        </div>

        <div ref={contentRef} className="max-w-6xl mx-auto px-6 py-8 space-y-12">
          {screens.map((s, i) => (
            <section key={s.file} className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="text-lg font-semibold text-foreground">{s.label}</h2>
                <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{s.route}</code>
              </div>
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <img
                  src={`/screenshots/${s.file}`}
                  alt={s.label}
                  className="w-full"
                  loading="lazy"
                />
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
};

export default Screenshots;
