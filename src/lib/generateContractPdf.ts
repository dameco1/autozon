import jsPDF from "jspdf";

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
}

export function generateContractPdf(data: ContractData): jsPDF {
  const doc = new jsPDF();
  const { car, agreedPrice, sellerName, buyerName, sellerCountry, contractDate, transactionId } = data;
  const pw = doc.internal.pageSize.getWidth();
  const dateStr = new Date(contractDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  let y = 20;

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
  doc.text(`Ref: ${transactionId.slice(0, 8).toUpperCase()}  •  ${dateStr}`, pw / 2, y, { align: "center" });
  y += 3;
  doc.setDrawColor(200);
  doc.line(20, y, pw - 20, y);
  y += 10;

  const section = (title: string) => {
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
  field("Country / Land:", sellerCountry);
  field("Buyer / Käufer:", buyerName);
  y += 3;

  // ── 2. Vehicle ──
  section("§2 — Vehicle / Fahrzeug");
  field("Make / Marke:", car.make);
  field("Model / Modell:", car.model);
  field("Year / Baujahr:", String(car.year));
  field("VIN / FIN:", car.vin || "—");
  y += 3;

  // ── 3. Purchase Price ──
  section("§3 — Purchase Price / Kaufpreis");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(22, 163, 74);
  doc.text(`€${agreedPrice.toLocaleString()}`, 24, y);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("(agreed purchase price / vereinbarter Kaufpreis)", 80, y);
  y += 10;

  // ── 4. Clauses ──
  section("§4 — Terms and Conditions / Vertragsbedingungen");
  const clauses = [
    "The vehicle is sold as inspected and test-driven by the buyer. / Das Fahrzeug wird verkauft wie vom Käufer besichtigt und probegefahren.",
    "The seller warrants legal ownership and confirms no liens, encumbrances, or third-party claims exist on the vehicle. / Der Verkäufer garantiert das rechtliche Eigentum und bestätigt, dass keine Pfandrechte oder Ansprüche Dritter bestehen.",
    "Mileage and accident history are as declared by the seller. Any known defects have been disclosed. / Kilometerstand und Unfallhistorie entsprechen den Angaben des Verkäufers. Bekannte Mängel wurden offengelegt.",
    "Payment is due upon digital signing of this contract. Ownership transfers upon confirmed receipt of payment. / Die Zahlung ist bei digitaler Unterzeichnung dieses Vertrags fällig. Das Eigentum geht bei bestätigtem Zahlungseingang über.",
    "Both parties agree to notify the relevant vehicle registration authority (Zulassungsstelle) of the ownership transfer within the legally required timeframe. / Beide Parteien verpflichten sich, die zuständige Zulassungsstelle fristgerecht über den Eigentümerwechsel zu informieren.",
    "The buyer assumes responsibility for vehicle registration, insurance, and any applicable taxes from the date of ownership transfer. / Der Käufer übernimmt ab dem Datum der Eigentumsübertragung die Verantwortung für Anmeldung, Versicherung und etwaige Steuern.",
    "This contract is governed by the laws of the seller's country of residence. / Dieser Vertrag unterliegt dem Recht des Wohnsitzlandes des Verkäufers.",
  ];

  doc.setFontSize(8);
  doc.setTextColor(60);
  clauses.forEach((c, i) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}.`, 24, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(c, pw - 60);
    doc.text(lines, 30, y);
    y += lines.length * 4 + 3;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });

  y += 5;

  // ── 5. Signatures ──
  section("§5 — Digital Signatures / Digitale Unterschriften");
  doc.setFontSize(9);
  doc.setTextColor(60);

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
  doc.setTextColor(100);
  doc.text("Pending / Ausstehend", 24, y + 10);

  // Buyer
  const bx = pw / 2 + 10;
  doc.setTextColor(60);
  doc.text("Buyer / Käufer:", bx, y - 5);
  doc.line(bx, y, bx + 66, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.text(buyerName, bx, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(22, 163, 74);
  doc.text("Signed digitally / Digital unterzeichnet", bx, y + 10);
  doc.setTextColor(100);
  doc.text(dateStr, bx, y + 15);

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
