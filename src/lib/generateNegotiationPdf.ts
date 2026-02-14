import jsPDF from "jspdf";

interface PdfData {
  car: { make: string; model: string; year: number; price: number; fair_value_price: number | null };
  offer: {
    id: string;
    amount: number;
    counter_amount: number | null;
    agreed_price: number;
    current_round: number;
    max_rounds: number;
    created_at: string;
    updated_at: string;
    message: string | null;
  };
  sellerName: string;
  buyerName: string;
}

export function generateNegotiationPdf(data: PdfData) {
  const doc = new jsPDF();
  const { car, offer, sellerName, buyerName } = data;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const addLine = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(label, 20, y);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(30);
    doc.text(value, 90, y);
    y += 7;
  };

  const addSection = (title: string) => {
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30);
    doc.text(title, 20, y);
    y += 2;
    doc.setDrawColor(200);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;
  };

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30);
  doc.text("Negotiation Summary", pageWidth / 2, y, { align: "center" });
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Generated ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`, pageWidth / 2, y, { align: "center" });
  y += 4;
  doc.text(`Reference: ${offer.id.slice(0, 8).toUpperCase()}`, pageWidth / 2, y, { align: "center" });
  y += 10;

  // Vehicle
  addSection("Vehicle Details");
  addLine("Vehicle", `${car.year} ${car.make} ${car.model}`);
  addLine("Listed Price", `€${car.price.toLocaleString()}`);
  if (car.fair_value_price) addLine("Fair Value", `€${car.fair_value_price.toLocaleString()}`);

  // Parties
  addSection("Parties");
  addLine("Seller", sellerName);
  addLine("Buyer", buyerName);

  // Negotiation
  addSection("Negotiation Details");
  addLine("Initial Offer", `€${offer.amount.toLocaleString()}`);
  if (offer.counter_amount) addLine("Counter-Offer", `€${offer.counter_amount.toLocaleString()}`);
  addLine("Rounds Used", `${offer.current_round} / ${offer.max_rounds}`);
  addLine("Started", new Date(offer.created_at).toLocaleDateString("en-GB"));
  addLine("Concluded", new Date(offer.updated_at).toLocaleDateString("en-GB"));
  if (offer.message) addLine("Message", offer.message);

  // Agreed Price (highlighted)
  y += 4;
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(20, y - 4, pageWidth - 40, 18, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(22, 163, 74);
  doc.text("Agreed Price", 28, y + 6);
  doc.text(`€${offer.agreed_price.toLocaleString()}`, pageWidth - 28, y + 6, { align: "right" });
  y += 22;

  const savings = car.price - offer.agreed_price;
  if (savings > 0) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Savings vs. listed price: €${savings.toLocaleString()} (${Math.round((savings / car.price) * 100)}%)`, 20, y);
    y += 14;
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(160);
  doc.text("This document is an informational summary and does not constitute a binding contract.", 20, 280);
  doc.text("© Autozon", pageWidth - 20, 280, { align: "right" });

  doc.save(`negotiation-${offer.id.slice(0, 8)}.pdf`);
}
