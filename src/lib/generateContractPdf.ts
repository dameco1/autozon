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
  contractDate: string;
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
const AMBER = { r: 217, g: 119, b: 6 };
const AMBER_LIGHT = { r: 254, g: 243, b: 199 };
const AMBER_DARK = { r: 146, g: 64, b: 14 };
const DARK = { r: 41, g: 37, b: 36 };
const GRAY = { r: 120, g: 113, b: 108 };
const LIGHT_GRAY = { r: 214, g: 211, b: 209 };
const GREEN = { r: 22, g: 163, b: 74 };
const GREEN_DARK = { r: 21, g: 128, b: 61 };
const RED = { r: 220, g: 38, b: 38 };
const WHITE = { r: 255, g: 255, b: 255 };
const CREAM = { r: 252, g: 250, b: 249 };

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
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

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

  // ── Autozon Logo ──
  const drawAutozonLogo = (cx: number, ly: number, size: number) => {
    // Orange circle emblem
    const circR = size * 0.38;
    doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
    doc.circle(cx - size * 0.55, ly, circR, "F");

    // White "A" inside circle
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size * 0.6);
    doc.setTextColor(255, 255, 255);
    doc.text("A", cx - size * 0.55, ly + size * 0.08, { align: "center" });

    // "autozon" wordmark
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    setColor(DARK);
    doc.text("autozon", cx + size * 0.05, ly + size * 0.12, { align: "center" });
  };

  // ── KYC Shield Stamp (inspired by uploaded green shield images) ──
  const drawKycShieldStamp = (cx: number, cy: number, name: string, role: string, verified: boolean) => {
    const shieldW = 28;
    const shieldH = 32;
    const left = cx - shieldW / 2;

    // Shield background
    const bgCol = verified ? { r: 34, g: 139, b: 34 } : { r: 180, g: 180, b: 180 };
    const lightBg = verified ? { r: 220, g: 252, b: 231 } : { r: 240, g: 240, b: 240 };

    // Shield body (rounded rect top, pointed bottom)
    doc.setFillColor(bgCol.r, bgCol.g, bgCol.b);
    doc.roundedRect(left, cy, shieldW, shieldH * 0.65, 3, 3, "F");

    // Triangle bottom of shield
    doc.triangle(
      left, cy + shieldH * 0.6,
      left + shieldW, cy + shieldH * 0.6,
      cx, cy + shieldH,
      "F"
    );

    // Inner shield
    const inset = 2.5;
    doc.setFillColor(lightBg.r, lightBg.g, lightBg.b);
    doc.roundedRect(left + inset, cy + inset, shieldW - inset * 2, shieldH * 0.65 - inset * 1.5, 2, 2, "F");

    // Checkmark or X
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    setColor(verified ? GREEN_DARK : RED);
    doc.text(verified ? "✓" : "✗", cx, cy + shieldH * 0.38, { align: "center" });

    // KYC text on shield
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("KYC", cx, cy + shieldH * 0.57, { align: "center" });

    // Label below shield
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    setColor(verified ? GREEN_DARK : RED);
    doc.text(verified ? "VERIFIED" : "NOT VERIFIED", cx, cy + shieldH + 5, { align: "center" });

    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    setColor(DARK);
    doc.text(role, cx, cy + shieldH + 9, { align: "center" });

    const shortName = name.length > 22 ? name.slice(0, 20) + "…" : name;
    doc.setFontSize(5);
    setColor(GRAY);
    doc.text(shortName, cx, cy + shieldH + 12.5, { align: "center" });
  };

  // ── Notary-style Digital Signature Stamp (serrated edge like image-3) ──
  const drawNotaryStamp = (cx: number, cy: number, radius: number, name: string, role: string, signed: boolean, signDate?: string) => {
    const teeth = 24;
    const outerR = radius;
    const innerR = radius - 2;

    // Serrated edge
    doc.setLineWidth(0.4);
    doc.setDrawColor(signed ? GREEN.r : GRAY.r, signed ? GREEN.g : GRAY.g, signed ? GREEN.b : GRAY.b);

    // Draw serrated circle using small line segments
    const points: [number, number][] = [];
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (i * Math.PI) / teeth;
      const r = i % 2 === 0 ? outerR : innerR;
      points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }

    for (let i = 0; i < points.length; i++) {
      const next = (i + 1) % points.length;
      doc.line(points[i][0], points[i][1], points[next][0], points[next][1]);
    }

    // Inner double circle
    doc.setLineWidth(0.8);
    doc.circle(cx, cy, radius - 4, "S");
    doc.setLineWidth(0.3);
    doc.circle(cx, cy, radius - 5.5, "S");

    // Small stars around inner ring
    doc.setFontSize(3.5);
    setColor(signed ? GREEN : GRAY);
    const starPositions = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    starPositions.forEach((angle) => {
      const sr = radius - 4.75;
      const sx = cx + sr * Math.cos(angle);
      const sy = cy + sr * Math.sin(angle);
      doc.text("★", sx, sy + 0.7, { align: "center" });
    });

    // Top arc text: "AUTOZON"
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.text("AUTOZON", cx, cy - radius + 9, { align: "center" });

    // Bottom arc text: "DIGITAL SIGNATURE"
    doc.setFontSize(3.8);
    doc.text("DIGITAL SIGNATURE", cx, cy + radius - 8, { align: "center" });

    // Center content
    if (signed) {
      // Ribbon-style banner across center
      const bannerH = 6;
      const bannerW = radius * 1.6;
      doc.setFillColor(signed ? GREEN.r : GRAY.r, signed ? GREEN.g : GRAY.g, signed ? GREEN.b : GRAY.b);
      doc.rect(cx - bannerW / 2, cy - bannerH / 2 - 1, bannerW, bannerH, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.setTextColor(255, 255, 255);
      doc.text("SIGNED", cx, cy + 1, { align: "center" });

      // Checkmark below banner
      setColor(signed ? GREEN : GRAY);
      doc.setFontSize(8);
      doc.text("✓", cx, cy + 7, { align: "center" });
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.5);
      setColor(GRAY);
      doc.text("AWAITING", cx, cy - 1, { align: "center" });
      doc.text("SIGNATURE", cx, cy + 3, { align: "center" });
      doc.setFontSize(7);
      doc.text("○", cx, cy + 8, { align: "center" });
    }

    // Role label below stamp
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    setColor(DARK);
    doc.text(role, cx, cy + radius + 5, { align: "center" });

    // Name
    const shortName = name.length > 22 ? name.slice(0, 20) + "…" : name;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    setColor(DARK);
    doc.text(shortName, cx, cy + radius + 9, { align: "center" });

    // Date
    if (signed && signDate) {
      doc.setFontSize(5.5);
      setColor(GREEN);
      doc.text(formatSignDate(signDate), cx, cy + radius + 13, { align: "center" });
    } else {
      doc.setFontSize(5.5);
      setColor(GRAY);
      doc.text("Pending / Ausstehend", cx, cy + radius + 13, { align: "center" });
    }
  };

  // ── Page header for subsequent pages ──
  const addPageHeader = () => {
    // Small logo
    doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
    doc.circle(margin + 3.5, 13, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.setTextColor(255, 255, 255);
    doc.text("A", margin + 3.5, 13.8, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    setColor(DARK);
    doc.text("autozon", margin + 9, 14.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    setColor(GRAY);
    doc.text(`Ref: ${transactionId.slice(0, 8).toUpperCase()}`, pw - margin, 14.5, { align: "right" });
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
  // PAGE 1 — HEADER WITH LOGO
  // ════════════════════════════════════════════════════════════════

  // Amber top bar
  doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
  doc.rect(0, 0, pw, 4, "F");

  // Header background
  roundedRect(margin, 10, contentW, 46, 3, CREAM, LIGHT_GRAY);

  // Autozon Logo (circle + wordmark)
  drawAutozonLogo(pw / 2, 23, 18);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  setColor(DARK);
  doc.text("Kaufvertrag / Purchase Agreement", pw / 2, 37, { align: "center" });

  // Subtitle info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setColor(GRAY);
  const comboLabel = `${sellerType === "business" ? "Business" : "Private"} → ${buyerType === "business" ? "Business" : "Private"}`;
  doc.text(`${comboLabel}  •  Ref: ${transactionId.slice(0, 8).toUpperCase()}  •  ${dateStr}`, pw / 2, 44, { align: "center" });

  // Thin amber accent line
  doc.setDrawColor(AMBER.r, AMBER.g, AMBER.b);
  doc.setLineWidth(0.5);
  doc.line(pw / 2 - 30, 48, pw / 2 + 30, 48);

  y = 64;

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
  // §2 — IDENTITY VERIFICATION (KYC SHIELD STAMPS)
  // ════════════════════════════════════════════════════════════════
  section("§2 — Identity Verification / Identitätsprüfung");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setColor(GRAY);
  const kycIntro = "Both parties have undergone digital identity verification (KYC) through Autozon's certified verification partner. / Beide Parteien haben eine digitale Identitätsprüfung (KYC) über den zertifizierten Verifizierungspartner von Autozon durchlaufen.";
  const kycLines = doc.splitTextToSize(kycIntro, contentW - 12);
  doc.text(kycLines, margin + 6, y);
  y += kycLines.length * 3.5 + 6;

  // KYC Shield stamps side by side
  checkPageBreak(55);
  const kycAreaY = y;
  roundedRect(margin, kycAreaY, contentW, 52, 3, { r: 250, g: 250, b: 249 }, LIGHT_GRAY);

  const sellerShieldCx = margin + contentW / 4;
  const buyerShieldCx = margin + (contentW * 3) / 4;
  drawKycShieldStamp(sellerShieldCx, kycAreaY + 5, sellerName, "Seller / Verkäufer", sellerKycVerified);
  drawKycShieldStamp(buyerShieldCx, kycAreaY + 5, buyerName, "Buyer / Käufer", buyerKycVerified);

  y = kycAreaY + 57;

  // ════════════════════════════════════════════════════════════════
  // §3 — VEHICLE (with VIN logic)
  // ════════════════════════════════════════════════════════════════
  section("§3 — Vehicle / Fahrzeug");

  checkPageBreak(38);
  roundedRect(margin, y, contentW, 30, 2, { r: 250, g: 250, b: 249 }, LIGHT_GRAY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setColor(DARK);
  doc.text(`${car.year} ${car.make} ${car.model}`, margin + 6, y + 8);

  // VIN handling
  const hasVin = car.vin && car.vin.trim().length > 0;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  if (hasVin) {
    setColor(GRAY);
    doc.text("VIN / FIN:", margin + 6, y + 14);
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    setColor(DARK);
    doc.text(car.vin!, margin + 30, y + 14);

    // Verified indicator
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    setColor(GREEN);
    doc.text("✓ Registered by seller / Vom Verkäufer registriert", margin + 6, y + 19);
  } else {
    setColor(RED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("VIN / FIN: ______________________________", margin + 6, y + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.text(
      "⚠ VIN must be entered manually and must match the vehicle registration documents.",
      margin + 6, y + 19
    );
    doc.text(
      "⚠ FIN muss manuell eingetragen werden und muss mit den Fahrzeugpapieren übereinstimmen.",
      margin + 6, y + 23
    );
  }

  // Price badge
  const priceText = `€${agreedPrice.toLocaleString()}`;
  const priceW = doc.getTextWidth(priceText) * 1.8 + 10;
  roundedRect(pw - margin - priceW - 4, y + 3, priceW + 4, 16, 2, AMBER_LIGHT, AMBER);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  setColor(AMBER_DARK);
  doc.text(priceText, pw - margin - priceW / 2 - 2, y + 13.5, { align: "center" });

  y += 35;

  // ════════════════════════════════════════════════════════════════
  // §4 — WARRANTY
  // ════════════════════════════════════════════════════════════════
  section("§4 — Warranty / Gewährleistung");

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

  // Add VIN-specific clause
  if (!hasVin) {
    baseClauses.push(
      "The VIN (Vehicle Identification Number) must be manually entered into this contract and must match the official vehicle registration documents. Discrepancies void this agreement. / Die FIN (Fahrzeug-Identifizierungsnummer) muss manuell in diesen Vertrag eingetragen werden und muss mit den offiziellen Fahrzeugpapieren übereinstimmen. Abweichungen machen diesen Vertrag ungültig."
    );
  }

  const allClauses = [
    ...baseClauses,
    ...workflow.extraClauses.map((c) => `${c.en} / ${c.de}`),
  ];

  doc.setFontSize(7);
  allClauses.forEach((c, i) => {
    checkPageBreak(14);

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
  // §7 — DIGITAL SIGNATURES (NOTARY STAMPS)
  // ════════════════════════════════════════════════════════════════
  checkPageBreak(75);
  section("§7 — Digital Signatures / Digitale Unterschriften");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  setColor(GRAY);
  const sigIntro = "Digital signatures are recorded through Autozon's secure platform. Each notary-style stamp below confirms the signing party's legally binding digital consent. / Digitale Unterschriften werden über die sichere Autozon-Plattform erfasst. Jeder Stempel bestätigt die rechtsverbindliche digitale Zustimmung.";
  const sigLines = doc.splitTextToSize(sigIntro, contentW - 12);
  doc.text(sigLines, margin + 6, y);
  y += sigLines.length * 3.5 + 6;

  // Signature stamps area
  checkPageBreak(60);
  const stampAreaY = y;
  roundedRect(margin, stampAreaY, contentW, 56, 3, { r: 250, g: 250, b: 249 }, LIGHT_GRAY);

  const stampRadius = 18;
  const sellerCx = margin + contentW / 4;
  const buyerCx = margin + (contentW * 3) / 4;
  const stampCy = stampAreaY + 22;

  drawNotaryStamp(sellerCx, stampCy, stampRadius, sellerName, "Seller / Verkäufer", contractSignedSeller, sellerSignedDate);
  drawNotaryStamp(buyerCx, stampCy, stampRadius, buyerName, "Buyer / Käufer", contractSignedBuyer, buyerSignedDate);

  y = stampAreaY + 60;

  // ── Add footer to last page ──
  addFooter();

  // ── Amber bottom bar ──
  doc.setFillColor(AMBER.r, AMBER.g, AMBER.b);
  doc.rect(0, ph - 4, pw, 4, "F");

  return doc;
}
