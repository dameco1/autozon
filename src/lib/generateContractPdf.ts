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
  const dateStr = new Date(contractDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  let y = 20;

  const checkPageBreak = (needed: number) => {
    if (y + needed > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // ── Header ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(30);
  doc.text("AUTOZON", pw / 2, y, { align: "center" });
  y += 8;
  doc.setFontSize(14);
  doc.text("Vehicle Purchase Contract", pw / 2, y, { align: "center" });
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Kaufvertrag / Purchase Agreement`, pw / 2, y, { align: "center" });
  y += 5;

  // Role combo badge
  const comboLabel = `${sellerType === "business" ? "Business" : "Private"} → ${buyerType === "business" ? "Business" : "Private"}`;
  doc.text(`${comboLabel}  •  Ref: ${transactionId.slice(0, 8).toUpperCase()}  •  ${dateStr}`, pw / 2, y, { align: "center" });
  y += 3;
  doc.setDrawColor(200);
  doc.line(20, y, pw - 20, y);
  y += 10;

  const section = (title: string) => {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30);
    doc.text(title, 20, y);
    y += 2;
    doc.setDrawColor(220);
    doc.line(20, y, pw - 20, y);
    y += 7;
  };

  const field = (label: string, value: string) => {
    checkPageBreak(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(label, 24, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30);
    doc.text(value, 90, y);
    y += 6;
  };

  // ── 1. Parties ──
  section("§1 — Contracting Parties / Vertragsparteien");
  field("Seller / Verkäufer:", sellerName);
  field("Seller Type / Typ:", sellerType === "business" ? "Business / Unternehmen" : "Private / Privatperson");
  field("Country / Land:", sellerCountry);
  field("Buyer / Käufer:", buyerName);
  field("Buyer Type / Typ:", buyerType === "business" ? "Business / Unternehmen" : "Private / Privatperson");
  y += 3;

  // ── 2. Identity Verification ──
  section("§2 — Identity Verification / Identitätsprüfung");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60);
  const kycIntro = "Both parties have undergone digital identity verification (KYC) through Autozon's certified verification partner. / Beide Parteien haben eine digitale Identitätsprüfung (KYC) über den zertifizierten Verifizierungspartner von Autozon durchlaufen.";
  const kycLines = doc.splitTextToSize(kycIntro, pw - 50);
  doc.text(kycLines, 24, y);
  y += kycLines.length * 4 + 4;

  // KYC badges
  const kycBadge = (label: string, name: string, verified: boolean, xPos: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(verified ? 22 : 180, verified ? 163 : 50, verified ? 74 : 50);
    doc.text(`${label}: ${name}`, xPos, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(verified ? "✓ Identity Verified / Identität verifiziert" : "✗ Not Verified / Nicht verifiziert", xPos, y);
  };

  const savedY = y;
  kycBadge("Seller / Verkäufer", sellerName, sellerKycVerified, 24);
  y = savedY;
  kycBadge("Buyer / Käufer", buyerName, buyerKycVerified, pw / 2 + 10);
  y += 8;

  // ── 3. Vehicle ──
  section("§3 — Vehicle / Fahrzeug");
  field("Make / Marke:", car.make);
  field("Model / Modell:", car.model);
  field("Year / Baujahr:", String(car.year));
  field("VIN / FIN:", car.vin || "—");
  y += 3;

  // ── 4. Purchase Price ──
  section("§4 — Purchase Price / Kaufpreis");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(22, 163, 74);
  doc.text(`€${agreedPrice.toLocaleString()}`, 24, y);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("(agreed purchase price / vereinbarter Kaufpreis)", 80, y);
  y += 10;

  // ── 5. Warranty / Gewährleistung ──
  section("§5 — Warranty / Gewährleistung");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30);
  doc.text(workflow.warrantyConfig.label, 24, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60);
  const warrantyLines = doc.splitTextToSize(
    `${workflow.warrantyConfig.description}\n${workflow.warrantyConfig.description_de}`,
    pw - 50
  );
  doc.text(warrantyLines, 24, y);
  y += warrantyLines.length * 4 + 5;

  // ── 6. Terms and Conditions ──
  section("§6 — Terms and Conditions / Vertragsbedingungen");

  // Base clauses
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

  // Add role-specific extra clauses
  const allClauses = [
    ...baseClauses,
    ...workflow.extraClauses.map((c) => `${c.en} / ${c.de}`),
  ];

  doc.setFontSize(8);
  doc.setTextColor(60);
  allClauses.forEach((c, i) => {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}.`, 24, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(c, pw - 60);
    doc.text(lines, 30, y);
    y += lines.length * 4 + 3;
  });

  y += 5;

  // ── 7. Required Documents ──
  checkPageBreak(30);
  section("§7 — Required Documents / Erforderliche Dokumente");
  doc.setFontSize(8);
  doc.setTextColor(60);

  doc.setFont("helvetica", "bold");
  doc.text("Seller Documents / Verkäuferunterlagen:", 24, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  workflow.sellerDocuments.filter(d => d.required).forEach((d) => {
    checkPageBreak(6);
    doc.text(`• ${d.label}`, 28, y);
    y += 4;
  });
  y += 3;

  doc.setFont("helvetica", "bold");
  doc.text("Buyer Documents / Käuferunterlagen:", 24, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  workflow.buyerDocuments.filter(d => d.required).forEach((d) => {
    checkPageBreak(6);
    doc.text(`• ${d.label}`, 28, y);
    y += 4;
  });
  y += 5;

  // ── 8. Signatures ──
  checkPageBreak(40);
  section("§8 — Digital Signatures / Digitale Unterschriften");
  doc.setFontSize(9);
  doc.setTextColor(60);

  const formatSignDate = (d?: string) => {
    if (!d) return dateStr;
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  // Seller
  doc.setFont("helvetica", "normal");
  doc.text("Seller / Verkäufer:", 24, y);
  y += 5;
  doc.setDrawColor(180);
  doc.line(24, y, 90, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.text(sellerName, 24, y + 5);
  doc.setFont("helvetica", "normal");
  if (contractSignedSeller) {
    doc.setTextColor(22, 163, 74);
    doc.text("Signed digitally / Digital unterzeichnet", 24, y + 10);
    doc.setTextColor(100);
    doc.text(formatSignDate(sellerSignedDate), 24, y + 15);
  } else {
    doc.setTextColor(200, 100, 0);
    doc.text("Pending / Ausstehend", 24, y + 10);
  }

  // Buyer
  const bx = pw / 2 + 10;
  doc.setTextColor(60);
  doc.text("Buyer / Käufer:", bx, y - 5);
  doc.line(bx, y, bx + 66, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.text(buyerName, bx, y + 5);
  doc.setFont("helvetica", "normal");
  if (contractSignedBuyer) {
    doc.setTextColor(22, 163, 74);
    doc.text("Signed digitally / Digital unterzeichnet", bx, y + 10);
    doc.setTextColor(100);
    doc.text(formatSignDate(buyerSignedDate), bx, y + 15);
  } else {
    doc.setTextColor(200, 100, 0);
    doc.text("Pending / Ausstehend", bx, y + 10);
  }

  y += 25;

  // ── Footer ──
  const fy = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(7);
  doc.setTextColor(160);
  doc.text(
    "This contract was generated and facilitated by Autozon. Autozon is not a party to this agreement.",
    20,
    fy
  );
  doc.text(
    "Dieser Vertrag wurde von Autozon erstellt und vermittelt. Autozon ist nicht Vertragspartei.",
    20,
    fy + 4
  );
  doc.text(`© ${new Date().getFullYear()} Autozon`, pw - 20, fy, { align: "right" });

  return doc;
}
