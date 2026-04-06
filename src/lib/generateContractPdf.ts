import jsPDF from "jspdf";
import { getWorkflow, type PartyType } from "./roleWorkflow";

export interface ContractData {
  car: {
    make: string;
    model: string;
    year: number;
    vin?: string;
  };
  agreedPrice: number;
  sellerName: string;
  buyerName: string;
  sellerCountry: string;
  contractDate: string; // ISO string
  transactionId: string;
  buyerKycVerified?: boolean;
  sellerKycVerified?: boolean;
  contractSignedBuyer?: boolean;
  contractSignedSeller?: boolean;
  buyerSignedDate?: string;
  sellerSignedDate?: string;
  sellerType?: PartyType;
  buyerType?: PartyType;
}

// ── Brand colors ──
const AMBER = { r: 217, g: 119, b: 6 };       // #D97706
const AMBER_LIGHT = { r: 254, g: 243, b: 199 }; // #FEF3C7
const AMBER_DARK = { r: 146, g: 64, b: 14 };    // #92400E
const DARK = { r: 41, g: 37, b: 36 };            // #292524
const GRAY = { r: 120, g: 113, b: 108 };         // #78716C
const LIGHT_GRAY = { r: 214, g: 211, b: 209 };   // #D6D3D1
const GREEN = { r: 22, g: 163, b: 74 };          // #16A34A
const RED = { r: 220, g: 38, b: 38 };            // #DC2626
const WHITE = { r: 255, g: 255, b: 255 };
const CREAM = { r: 252, g: 250, b: 249 };        // #FCFAF9

export function generateContractPdf(data: ContractData): jsPDF {
  const doc = new jsPDF();
  const {
    car, agreedPrice, sellerName, buyerName, sellerCountry, contractDate, transactionId,
    buyerKycVerified = false, sellerKycVerified = false,
    contractSignedBuyer = false, contractSignedSeller = false,
    buyerSignedDate, sellerSignedDate,
    sellerType = "private", buyerType = "private",
  } = data;

  const workflow = getWorkflow(sellerType, buyerType);
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pw - margin * 2;
  const dateStr = new Date(contractDate).toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });
  let y = 0;

  const checkPageBreak = (needed: number) => {
    if (y + needed > ph - 30) {
      addFooter();
      doc.addPage();
      y = 25;
      addPageHeader();
    }
  };

  const setColor = (c: { r: number; g: number; b: number }) => {
    doc.setTextColor(c.r, c.g, c.b);
  };

  const formatSignDate = (d?: string) => {
    if (!d) return dateStr;
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  // ── Helper: rounded rect ──
  const roundedRect = (x: number, ry: number, w: number, h: number, radius: number, fill: { r: number; g: number; b: number }, stroke?: { r: number; g: number; b: number }) => {
    doc.setFillColor(fill.r, fill.g, fill.b);
    if (stroke) {
      doc.setDrawColor(stroke.r, stroke.g, stroke.b);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, ry, w, h, radius, radius, "FD");
    } else {
      doc.roundedRect(x, ry, w, h, radius, radius, "F");
    }
  };

  // ── Helper: digital stamp circle ──
  const drawDigitalStamp = (cx: number, cy: number, radius: number, label: string, name: string, signed: boolean, signDate?: string) => {
    // Outer circle
    doc.setLineWidth(1.5);
    doc.setDrawColor(signed ? GREEN.r : GRAY.r, signed ? GREEN.g : GRAY.g, signed ? GREEN.b : GRAY.b);
    doc.circle(cx, cy, radius, "S");

    // Inner circle
    doc.setLineWidth(0.5);
    doc.circle(cx, cy, radius - 2.5, "S");

    // Top arc text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    setColor(signed ? GREEN : GRAY);
    doc.text("AUTOZON", cx, cy - radius + 5.5, { align: "center" });

    // Center content
    doc.setFontSize(6);
    setColor(signed ? GREEN : GRAY);
    doc.text(signed ? "DIGITALLY" : "AWAITING", cx, cy - 3, { align: "center" });
    doc.text(signed ? "SIGNED" : "SIGNATURE", cx, cy + 1, { align: "center" });

    // Checkmark or clock icon
    doc.setFontSize(10);
    doc.text(signed ? "✓" : "○", cx, cy + 7, { align: "center" });

    // Bottom arc text
    doc.setFontSize(4.5);
    doc.setFont("helvetica", "normal");
    const shortName = name.length > 18 ? name.slice(0, 16) + "…" : name;
    doc.text(shortName.toUpperCase(), cx, cy + radius - 4, { align: "center" });

    // Label below stamp
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    setColor(DARK);
    doc.text(label, cx, cy + radius + 5, { align: "center" });

    if (signed && signDate) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      setColor(GREEN);
      doc.text(formatSignDate(signDate), cx, cy + radius + 9, { align: "center" });
    } else if (!signed) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      setColor(GRAY);
      doc.text("Pending / Ausstehend", cx, cy + radius + 9, { align: "center" });
    }
  };

  // ── Helper: KYC verification badge ──
  const drawKycBadge = (x: number, by: number, name: string, role: string, verified: boolean) => {
    const badgeW = contentW / 2 - 5;
    const badgeH = 18;
    const bgColor = verified ? { r: 240, g: 253, b: 244 } : { r: 254, g: 242, b: 242 };
    const borderColor = verified ? { r: 187, g: 247, b: 208 } : { r: 254, g: 202, b: 202 };

    roundedRect(x, by, badgeW, badgeH, 2, bgColor, borderColor);

    // Shield icon area
    doc.setFontSize(10);
    setColor(verified ? GREEN : RED);
    doc.text(verified ? "✓" : "✗", x + 6, by + 7, { align: "center" });

    // Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    setColor(verified ? GREEN : RED);
    doc.text(verified ? "KYC VERIFIED" : "NOT VERIFIED", x + 12, by + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    setColor(DARK);
    doc.text(`${role}: ${name}`, x + 12, by + 10);

    doc.setFontSize(5.5);
    setColor(GRAY);
    doc.text(
      verified
        ? "Identity confirmed via Autozon KYC / Identität über Autozon KYC bestätigt"
        : "Identity not yet verified / Identität noch nicht verifiziert",
      x + 12, by + 14
    );
  };

  // ── Page header for subsequent pages ──
  const addPageHeader = () => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    setColor(AMBER);
    doc.text("autozon", margin, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    setColor(GRAY);
    doc.text(`Ref: ${transactionId.slice(0, 8).toUpperCase()}`, pw - margin, 15, { align: "right" });
    doc.setDrawColor(AMBER.r, AMBER.g, AMBER.b);
    doc.setLineWidth(0.3);
    doc.line(margin, 18, pw - margin, 18);
  };

  // ── Footer ──
  const addFooter = () => {
    const fy = ph - 12;
    doc.setDrawColor(LIGHT_GRAY.r, LIGHT_GRAY.g, LIGHT_GRAY.b);
    doc.setLineWidth(0.2);
    doc.line(margin, fy - 3, pw - margin, fy - 3);

    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    setColor(GRAY);
    doc.text(
      "This contract was generated and facilitated by Autozon. Autozon is not a party to this agreement. / Dieser Vertrag wurde von Autozon erstellt und vermittelt. Autozon ist nicht Vertragspartei.",
      margin, fy
    );
    doc.text(`© ${new Date().getFullYear()} Autozon  •  autozon.lovable.app`, pw - margin, fy, { align: "right" });
  };

  // ── Section header ──
  const section = (title: string) => {
    checkPageBreak(20);
    // Amber left bar
    doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
    doc.rect(margin, y - 1, 2, 7, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(DARK);
    doc.text(title, margin + 6, y + 4);
    y += 10;
  };

  // ── Field row ──
  const field = (label: string, value: string) => {
    checkPageBreak(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    setColor(GRAY);
    doc.text(label, margin + 6, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setColor(DARK);
    doc.text(value, margin + 65, y);
    y += 5.5;
  };

  // ════════════════════════════════════════════════════════════════
  // PAGE 1 — HEADER
  // ════════════════════════════════════════════════════════════════

  // Amber top bar
  doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
  doc.rect(0, 0, pw, 4, "F");

  // Header background
  roundedRect(margin, 10, contentW, 42, 3, CREAM, LIGHT_GRAY);

  // Logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  setColor(AMBER);
  doc.text("autozon", pw / 2, 25, { align: "center" });

  // Title
  doc.setFontSize(13);
  setColor(DARK);
  doc.text("Kaufvertrag / Purchase Agreement", pw / 2, 33, { align: "center" });

  // Subtitle info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setColor(GRAY);
  const comboLabel = `${sellerType === "business" ? "Business" : "Private"} → ${buyerType === "business" ? "Business" : "Private"}`;
  doc.text(`${comboLabel}  •  Ref: ${transactionId.slice(0, 8).toUpperCase()}  •  ${dateStr}`, pw / 2, 40, { align: "center" });

  // Thin amber accent line
  doc.setDrawColor(AMBER.r, AMBER.g, AMBER.b);
  doc.setLineWidth(0.5);
  doc.line(pw / 2 - 30, 44, pw / 2 + 30, 44);

  y = 60;

  // ════════════════════════════════════════════════════════════════
  // §1 — CONTRACTING PARTIES
  // ════════════════════════════════════════════════════════════════
  section("§1 — Contracting Parties / Vertragsparteien");
  field("Seller / Verkäufer:", sellerName);
  field("Seller Type / Typ:", sellerType === "business" ? "Business / Unternehmen" : "Private / Privatperson");
  field("Country / Land:", sellerCountry);
  field("Buyer / Käufer:", buyerName);
  field("Buyer Type / Typ:", buyerType === "business" ? "Business / Unternehmen" : "Private / Privatperson");
  y += 4;

  // ════════════════════════════════════════════════════════════════
  // §2 — IDENTITY VERIFICATION (KYC BADGES)
  // ════════════════════════════════════════════════════════════════
  section("§2 — Identity Verification / Identitätsprüfung");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setColor(GRAY);
  const kycIntro = "Both parties have undergone digital identity verification (KYC) through Autozon's certified verification partner. / Beide Parteien haben eine digitale Identitätsprüfung (KYC) über den zertifizierten Verifizierungspartner von Autozon durchlaufen.";
  const kycLines = doc.splitTextToSize(kycIntro, contentW - 12);
  doc.text(kycLines, margin + 6, y);
  y += kycLines.length * 3.5 + 4;

  // KYC Badges side by side
  checkPageBreak(25);
  drawKycBadge(margin, y, sellerName, "Seller / Verkäufer", sellerKycVerified);
  drawKycBadge(margin + contentW / 2 + 5, y, buyerName, "Buyer / Käufer", buyerKycVerified);
  y += 24;

  // ════════════════════════════════════════════════════════════════
  // §3 — VEHICLE
  // ════════════════════════════════════════════════════════════════
  section("§3 — Vehicle / Fahrzeug");

  // Vehicle info card
  checkPageBreak(28);
  roundedRect(margin, y, contentW, 22, 2, { r: 250, g: 250, b: 249 }, LIGHT_GRAY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setColor(DARK);
  doc.text(`${car.year} ${car.make} ${car.model}`, margin + 6, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setColor(GRAY);
  doc.text(`VIN / FIN: ${car.vin || "—"}`, margin + 6, y + 14);

  // Price badge
  const priceText = `€${agreedPrice.toLocaleString()}`;
  const priceW = doc.getTextWidth(priceText) * 1.8 + 10;
  roundedRect(pw - margin - priceW - 4, y + 3, priceW + 4, 16, 2, AMBER_LIGHT, AMBER);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  setColor(AMBER_DARK);
  doc.text(priceText, pw - margin - priceW / 2 - 2, y + 13.5, { align: "center" });

  y += 28;

  // ════════════════════════════════════════════════════════════════
  // §4 — WARRANTY
  // ════════════════════════════════════════════════════════════════
  section("§4 — Warranty / Gewährleistung");

  // Warranty badge
  checkPageBreak(18);
  const warrantyBg = workflow.warrantyConfig.type === "statutory_2y"
    ? { r: 240, g: 253, b: 244 }
    : workflow.warrantyConfig.type === "negotiable"
      ? { r: 254, g: 252, b: 232 }
      : { r: 245, g: 245, b: 244 };
  const warrantyBorder = workflow.warrantyConfig.type === "statutory_2y"
    ? GREEN
    : workflow.warrantyConfig.type === "negotiable"
      ? AMBER
      : GRAY;

  roundedRect(margin, y, contentW, 14, 2, warrantyBg, warrantyBorder);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setColor(warrantyBorder);
  doc.text(workflow.warrantyConfig.label, margin + 6, y + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  setColor(GRAY);
  const wLines = doc.splitTextToSize(workflow.warrantyConfig.description, contentW - 16);
  doc.text(wLines[0] || "", margin + 6, y + 10);
  y += 19;

  // ════════════════════════════════════════════════════════════════
  // §5 — TERMS AND CONDITIONS
  // ════════════════════════════════════════════════════════════════
  section("§5 — Terms and Conditions / Vertragsbedingungen");

  const baseClauses = [
    "The vehicle is sold as inspected and test-driven by the buyer. / Das Fahrzeug wird verkauft wie vom Käufer besichtigt und probegefahren.",
    "The seller warrants legal ownership and confirms no liens, encumbrances, or third-party claims exist on the vehicle. / Der Verkäufer garantiert das rechtliche Eigentum und bestätigt, dass keine Pfandrechte oder Ansprüche Dritter bestehen.",
    "Mileage and accident history are as declared by the seller. Any known defects have been disclosed. / Kilometerstand und Unfallhistorie entsprechen den Angaben des Verkäufers. Bekannte Mängel wurden offengelegt.",
    "Payment is due upon digital signing of this contract. Ownership transfers upon confirmed receipt of payment. / Die Zahlung ist bei digitaler Unterzeichnung dieses Vertrags fällig. Das Eigentum geht bei bestätigtem Zahlungseingang über.",
    "Both parties agree to notify the relevant vehicle registration authority (Zulassungsstelle) of the ownership transfer within the legally required timeframe. / Beide Parteien verpflichten sich, die zuständige Zulassungsstelle fristgerecht über den Eigentümerwechsel zu informieren.",
    "The buyer assumes responsibility for vehicle registration, insurance, and any applicable taxes from the date of ownership transfer. / Der Käufer übernimmt ab dem Datum der Eigentumsübertragung die Verantwortung für Anmeldung, Versicherung und etwaige Steuern.",
    "This contract is governed by the laws of the seller's country of residence. / Dieser Vertrag unterliegt dem Recht des Wohnsitzlandes des Verkäufers.",
    "Both contracting parties have been digitally identified and verified through Autozon's KYC process. / Beide Vertragsparteien wurden digital identifiziert und über den KYC-Prozess von Autozon verifiziert.",
  ];

  const allClauses = [
    ...baseClauses,
    ...workflow.extraClauses.map((c) => `${c.en} / ${c.de}`),
  ];

  doc.setFontSize(7);
  allClauses.forEach((c, i) => {
    checkPageBreak(14);

    // Clause number badge
    doc.setFillColor(AMBER_LIGHT.r, AMBER_LIGHT.g, AMBER_LIGHT.b);
    doc.roundedRect(margin + 2, y - 3, 8, 5, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    setColor(AMBER_DARK);
    doc.text(`${i + 1}`, margin + 6, y, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    setColor(DARK);
    const lines = doc.splitTextToSize(c, contentW - 20);
    doc.text(lines, margin + 14, y);
    y += lines.length * 3.5 + 3;
  });

  y += 4;

  // ════════════════════════════════════════════════════════════════
  // §6 — REQUIRED DOCUMENTS
  // ════════════════════════════════════════════════════════════════
  checkPageBreak(35);
  section("§6 — Required Documents / Erforderliche Dokumente");

  const drawDocList = (title: string, docs: typeof workflow.sellerDocuments) => {
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setColor(AMBER_DARK);
    doc.text(title, margin + 6, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    setColor(DARK);
    docs.filter(d => d.required).forEach((d) => {
      checkPageBreak(5);
      setColor(AMBER);
      doc.text("•", margin + 8, y);
      setColor(DARK);
      doc.text(d.label, margin + 14, y);
      y += 4;
    });
    y += 3;
  };

  drawDocList("Seller Documents / Verkäuferunterlagen:", workflow.sellerDocuments);
  drawDocList("Buyer Documents / Käuferunterlagen:", workflow.buyerDocuments);
  y += 2;

  // ════════════════════════════════════════════════════════════════
  // §7 — DIGITAL SIGNATURES (STAMPS)
  // ════════════════════════════════════════════════════════════════
  checkPageBreak(65);
  section("§7 — Digital Signatures / Digitale Unterschriften");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  setColor(GRAY);
  doc.text(
    "Digital signatures are recorded through Autozon's secure platform. Each stamp below confirms the signing party's digital consent. / Digitale Unterschriften werden über die sichere Autozon-Plattform erfasst.",
    margin + 6, y
  );
  y += 6;

  // Signature stamps area with background
  checkPageBreak(50);
  const stampAreaY = y;
  roundedRect(margin, stampAreaY, contentW, 48, 3, { r: 250, g: 250, b: 249 }, LIGHT_GRAY);

  // Draw two digital stamp circles
  const stampRadius = 16;
  const sellerCx = margin + contentW / 4;
  const buyerCx = margin + (contentW * 3) / 4;
  const stampCy = stampAreaY + 20;

  drawDigitalStamp(sellerCx, stampCy, stampRadius, "Seller / Verkäufer", sellerName, contractSignedSeller, sellerSignedDate);
  drawDigitalStamp(buyerCx, stampCy, stampRadius, "Buyer / Käufer", buyerName, contractSignedBuyer, buyerSignedDate);

  y = stampAreaY + 52;

  // ── Add footer to last page ──
  addFooter();

  // ── Amber bottom bar ──
  doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
  doc.rect(0, ph - 4, pw, 4, "F");

  return doc;
}
