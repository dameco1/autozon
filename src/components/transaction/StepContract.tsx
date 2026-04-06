import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FileText, CheckCircle2, Printer, MapPin, Edit2, Clock, User, Shield,
  ShieldCheck, ShieldX, Car, Scale, Stamp, Lock, AlertTriangle, File
} from "lucide-react";
import autozonLogo from "@/assets/autozon-logo.png";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateContractPdf, ContractData } from "@/lib/generateContractPdf";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PartyType, RoleWorkflow } from "@/lib/roleWorkflow";
import { Badge } from "@/components/ui/badge";

interface Props {
  car: { make: string; model: string; year: number; vin?: string };
  agreedPrice: number;
  sellerCountry: string;
  buyerName: string;
  sellerName: string;
  transactionId: string | null;
  onContinue: (contractType: string) => void;
  role?: "buyer" | "seller";
  contractSignedSeller?: boolean;
  contractSignedBuyer?: boolean;
  onSellerSign?: () => Promise<void>;
  buyerKycVerified?: boolean;
  sellerKycVerified?: boolean;
  sellerType?: PartyType;
  buyerType?: PartyType;
  workflow?: RoleWorkflow;
}

const COUNTRIES = ["Austria", "Germany", "Switzerland", "Italy", "Czech Republic", "Hungary", "Slovakia", "Slovenia"];

const StepContract: React.FC<Props> = ({
  car, agreedPrice, sellerCountry, buyerName, sellerName, transactionId, onContinue,
  role = "buyer", contractSignedSeller = false, contractSignedBuyer = false, onSellerSign,
  buyerKycVerified = false, sellerKycVerified = false,
  sellerType = "private", buyerType = "private", workflow,
}) => {
  const { t, language } = useLanguage();
  const [signed, setSigned] = useState(role === "buyer" ? contractSignedBuyer : contractSignedSeller);
  const [signing, setSigning] = useState(false);
  const [country, setCountry] = useState(sellerCountry || "Austria");
  const [editingCountry, setEditingCountry] = useState(false);
  const [buyerSignedDate] = useState<string | null>(contractSignedBuyer ? new Date().toISOString() : null);
  const [sellerSignedDate] = useState<string | null>(contractSignedSeller ? new Date().toISOString() : null);
  const contractRef = useRef<HTMLDivElement>(null);

  const bothSigned = (contractSignedBuyer || (signed && role === "buyer")) && (contractSignedSeller || (signed && role === "seller"));
  const isLocked = bothSigned;
  const comboLabel = `${sellerType === "business" ? "Business" : "Private"} → ${buyerType === "business" ? "Business" : "Private"}`;
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const refId = (transactionId || "draft").slice(0, 8).toUpperCase();
  const hasVin = car.vin && car.vin.trim().length > 0;

  const handleSign = async () => {
    setSigning(true);
    try {
      if (role === "seller" && onSellerSign) {
        await onSellerSign();
        setSigned(true);
        return;
      }
      const contractData: ContractData = {
        car, agreedPrice, sellerName, buyerName, sellerCountry: country,
        contractDate: new Date().toISOString(), transactionId: transactionId || "draft",
        buyerKycVerified, sellerKycVerified,
        contractSignedBuyer: true, contractSignedSeller,
        buyerSignedDate: new Date().toISOString(),
        sellerType, buyerType,
      };
      const doc = generateContractPdf(contractData);
      const pdfBlob = doc.output("blob");
      if (transactionId) {
        const filePath = `${transactionId}/contract.pdf`;
        const { error: uploadError } = await supabase.storage
          .from("contracts")
          .upload(filePath, pdfBlob, { contentType: "application/pdf", upsert: true });
        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to archive contract");
        } else {
          await supabase.from("transactions").update({ contract_pdf_url: filePath } as any).eq("id", transactionId);
        }
      }
      setSigned(true);
      toast.success(t.transaction.contractSigned || "Contract signed successfully");
    } catch (e) {
      console.error("Signing error:", e);
      toast.error("Failed to generate contract");
    } finally {
      setSigning(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tt = t.transaction as any;

  // Base clauses
  const baseClauses = [
    { en: "The vehicle is sold as inspected and test-driven by the buyer.", de: "Das Fahrzeug wird verkauft wie vom Käufer besichtigt und probegefahren." },
    { en: "The seller warrants legal ownership and confirms no liens, encumbrances, or third-party claims exist.", de: "Der Verkäufer garantiert das rechtliche Eigentum und bestätigt, dass keine Pfandrechte oder Ansprüche Dritter bestehen." },
    { en: "Mileage and accident history are as declared by the seller. Any known defects have been disclosed.", de: "Kilometerstand und Unfallhistorie entsprechen den Angaben des Verkäufers. Bekannte Mängel wurden offengelegt." },
    { en: "Payment is due upon digital signing. Ownership transfers upon confirmed receipt of payment.", de: "Die Zahlung ist bei digitaler Unterzeichnung fällig. Das Eigentum geht bei bestätigtem Zahlungseingang über." },
    { en: "Both parties agree to notify the relevant vehicle registration authority of the ownership transfer within the legally required timeframe.", de: "Beide Parteien verpflichten sich, die zuständige Zulassungsstelle fristgerecht über den Eigentümerwechsel zu informieren." },
    { en: "The buyer assumes responsibility for registration, insurance, and applicable taxes from the date of ownership transfer.", de: "Der Käufer übernimmt ab dem Datum der Eigentumsübertragung die Verantwortung für Anmeldung, Versicherung und Steuern." },
    { en: "This contract is governed by the laws of the seller's country of residence.", de: "Dieser Vertrag unterliegt dem Recht des Wohnsitzlandes des Verkäufers." },
    { en: "Both contracting parties have been digitally identified and verified through Autozon's KYC process.", de: "Beide Vertragsparteien wurden digital identifiziert und über den KYC-Prozess von Autozon verifiziert." },
  ];

  if (!hasVin) {
    baseClauses.push({
      en: "The VIN must be manually entered and must match official vehicle registration documents. Discrepancies void this agreement.",
      de: "Die FIN muss manuell eingetragen werden und muss mit den offiziellen Fahrzeugpapieren übereinstimmen. Abweichungen machen diesen Vertrag ungültig.",
    });
  }

  const allClauses = [...baseClauses, ...(workflow?.extraClauses || [])];

  // Warranty styling
  const warrantyType = workflow?.warrantyConfig?.type || "none";
  const warrantyColors = warrantyType === "statutory_2y"
    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
    : warrantyType === "negotiable"
      ? "bg-amber-50 border-amber-300 text-amber-800"
      : "bg-muted border-border text-muted-foreground";

  return (
    <div className="space-y-0">
      {/* Locked banner */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3 mb-4"
        >
          <Lock className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700 font-medium">
            {language === "de"
              ? "Vertrag von beiden Parteien unterzeichnet. Bearbeitung gesperrt — PDF-Export verfügbar."
              : "Contract signed by both parties. Editing locked — PDF export available."}
          </p>
        </motion.div>
      )}

      {/* ═══════ ONLINE CONTRACT DOCUMENT ═══════ */}
      <motion.div
        ref={contractRef}
        id="contract-printable"
        className="border border-border rounded-2xl overflow-hidden shadow-lg bg-background print:shadow-none print:border-none print:rounded-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* ── Amber top bar ── */}
        <div className="h-1.5 bg-primary w-full" />

        {/* ── Header with Autozon branding ── */}
        <div className="bg-[hsl(30_25%_97%)] border-b border-border px-6 py-6 sm:py-8">
          <div className="flex flex-col items-center text-center gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <img src={autozonLogo} alt="Autozon" className="h-10 w-auto" />
            </div>
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-display font-black text-foreground">
              Kaufvertrag / Purchase Agreement
            </h2>
            {/* Subtitle */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px] font-semibold">{comboLabel}</Badge>
              <span>•</span>
              <span>Ref: {refId}</span>
              <span>•</span>
              <span>{dateStr}</span>
            </div>
            {/* Accent line */}
            <div className="w-16 h-0.5 bg-primary rounded-full mt-1" />
          </div>
        </div>

        {/* ── Contract body ── */}
        <div className="px-4 sm:px-6 py-6 space-y-6">

          {/* §1 — Contracting Parties */}
          <ContractSection number="§1" title="Contracting Parties" titleDe="Vertragsparteien">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PartyCard
                role={language === "de" ? "Verkäufer" : "Seller"}
                name={sellerName}
                partyType={sellerType}
                country={country}
                isCurrentUser={role === "seller"}
                editingCountry={editingCountry}
                onEditCountry={role === "buyer" ? () => setEditingCountry(true) : undefined}
                onCountryChange={(v) => { setCountry(v); setEditingCountry(false); }}
                showCountry
              />
              <PartyCard
                role={language === "de" ? "Käufer" : "Buyer"}
                name={buyerName}
                partyType={buyerType}
                isCurrentUser={role === "buyer"}
              />
            </div>
          </ContractSection>

          {/* §2 — Identity Verification (KYC) */}
          <ContractSection number="§2" title="Identity Verification" titleDe="Identitätsprüfung">
            <p className="text-xs text-muted-foreground mb-4">
              {language === "de"
                ? "Beide Parteien haben eine digitale Identitätsprüfung (KYC) über den zertifizierten Verifizierungspartner von Autozon durchlaufen."
                : "Both parties have undergone digital identity verification (KYC) through Autozon's certified verification partner."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <KycShieldBadge
                name={sellerName}
                role={language === "de" ? "Verkäufer" : "Seller"}
                verified={sellerKycVerified}
              />
              <KycShieldBadge
                name={buyerName}
                role={language === "de" ? "Käufer" : "Buyer"}
                verified={buyerKycVerified}
              />
            </div>
          </ContractSection>

          {/* §3 — Vehicle */}
          <ContractSection number="§3" title="Vehicle" titleDe="Fahrzeug">
            <div className="bg-[hsl(30_25%_97%)] border border-border rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span className="text-lg font-display font-bold text-foreground">
                    {car.year} {car.make} {car.model}
                  </span>
                </div>
                {/* VIN */}
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">VIN / FIN:</span>
                  {hasVin ? (
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                        {car.vin}
                      </code>
                      <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {language === "de" ? "Vom Verkäufer registriert" : "Registered by seller"}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-sm font-mono text-destructive border-b border-dashed border-destructive pb-1 w-64">
                        ______________________________
                      </div>
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {language === "de"
                          ? "FIN muss manuell eingetragen werden und muss mit den Fahrzeugpapieren übereinstimmen."
                          : "VIN must be entered manually and must match the vehicle registration documents."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Price badge */}
              <div className="flex items-center">
                <div className="bg-primary/10 border-2 border-primary rounded-xl px-5 py-3 text-center">
                  <p className="text-[10px] text-primary font-medium uppercase tracking-wider">
                    {language === "de" ? "Kaufpreis" : "Purchase Price"}
                  </p>
                  <p className="text-2xl font-display font-black text-primary">
                    €{agreedPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </ContractSection>

          {/* §4 — Warranty */}
          {workflow && (
            <ContractSection number="§4" title="Warranty" titleDe="Gewährleistung">
              <div className={`border rounded-xl p-4 ${warrantyColors}`}>
                <div className="flex items-start gap-3">
                  <Scale className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">
                      {language === "de" ? workflow.warrantyConfig.label_de : workflow.warrantyConfig.label}
                    </p>
                    <p className="text-xs mt-1 opacity-80">
                      {language === "de" ? workflow.warrantyConfig.description_de : workflow.warrantyConfig.description}
                    </p>
                  </div>
                </div>
              </div>
            </ContractSection>
          )}

          {/* §5 — Terms and Conditions */}
          <ContractSection number="§5" title="Terms and Conditions" titleDe="Vertragsbedingungen">
            <ol className="space-y-3">
              {allClauses.map((clause, i) => (
                <li key={i} className="flex gap-3 text-xs">
                  <span className="flex-shrink-0 w-6 h-6 rounded-md bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground leading-relaxed">
                    {language === "de" ? clause.de : clause.en}
                  </span>
                </li>
              ))}
            </ol>
          </ContractSection>

          {/* §6 — Required Documents */}
          {workflow && (
            <ContractSection number="§6" title="Required Documents" titleDe="Erforderliche Dokumente">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DocumentList
                  title={language === "de" ? "Verkäuferunterlagen" : "Seller Documents"}
                  docs={workflow.sellerDocuments.filter(d => d.required)}
                  language={language}
                />
                <DocumentList
                  title={language === "de" ? "Käuferunterlagen" : "Buyer Documents"}
                  docs={workflow.buyerDocuments.filter(d => d.required)}
                  language={language}
                />
              </div>
            </ContractSection>
          )}

          {/* §7 — Digital Signatures */}
          <ContractSection number="§7" title="Digital Signatures" titleDe="Digitale Unterschriften">
            <p className="text-xs text-muted-foreground mb-4">
              {language === "de"
                ? "Digitale Unterschriften werden über die sichere Autozon-Plattform erfasst. Jeder Stempel bestätigt die rechtsverbindliche digitale Zustimmung."
                : "Digital signatures are recorded through Autozon's secure platform. Each stamp confirms legally binding digital consent."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <NotaryStamp
                name={sellerName}
                role={language === "de" ? "Verkäufer" : "Seller"}
                signed={contractSignedSeller || (signed && role === "seller")}
                signDate={contractSignedSeller ? sellerSignedDate : (signed && role === "seller") ? new Date().toISOString() : undefined}
              />
              <NotaryStamp
                name={buyerName}
                role={language === "de" ? "Käufer" : "Buyer"}
                signed={contractSignedBuyer || (signed && role === "buyer")}
                signDate={contractSignedBuyer ? buyerSignedDate : (signed && role === "buyer") ? new Date().toISOString() : undefined}
              />
            </div>
          </ContractSection>
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-border px-6 py-3 bg-[hsl(30_25%_97%)]">
          <p className="text-[10px] text-muted-foreground text-center">
            {language === "de"
              ? "Dieser Vertrag wurde von Autozon erstellt und vermittelt. Autozon ist nicht Vertragspartei."
              : "This contract was generated and facilitated by Autozon. Autozon is not a party to this agreement."}
            {" • "}© {new Date().getFullYear()} Autozon
          </p>
        </div>

        {/* ── Amber bottom bar ── */}
        <div className="h-1.5 bg-primary w-full" />
      </motion.div>

      {/* ═══════ ACTIONS ═══════ */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 print:hidden">
        {!signed ? (
          <Button
            className="flex-1 font-bold py-6"
            onClick={handleSign}
            disabled={signing}
          >
            {signing ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Stamp className="mr-2 h-5 w-5" />
            )}
            {language === "de" ? "Vertrag digital unterschreiben" : "Sign Contract Digitally"}
          </Button>
        ) : (
          <>
            <Button variant="outline" className="flex-1 print:hidden" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              {language === "de" ? "Vertrag drucken / als PDF speichern" : "Print / Save as PDF"}
            </Button>
            {role === "buyer" && (
              <Button className="flex-1 font-bold py-6" onClick={() => onContinue("autozon")}>
                {t.transaction.continueToPayment}
              </Button>
            )}
            {role === "seller" && (
              <Button variant="ghost" className="flex-1 text-muted-foreground" onClick={() => window.location.href = "/dashboard"}>
                {t.transaction.backToDashboard}
              </Button>
            )}
          </>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground text-center pt-2">{t.transaction.contractDisclaimer}</p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

const ContractSection: React.FC<{
  number: string; title: string; titleDe: string; children: React.ReactNode;
}> = ({ number, title, titleDe, children }) => {
  const { language } = useLanguage();
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h3 className="text-sm font-display font-bold text-foreground">
          {number} — {language === "de" ? titleDe : title}
        </h3>
      </div>
      {children}
    </div>
  );
};

const PartyCard: React.FC<{
  role: string; name: string; partyType: PartyType; country?: string;
  isCurrentUser?: boolean; editingCountry?: boolean;
  onEditCountry?: () => void; onCountryChange?: (v: string) => void; showCountry?: boolean;
}> = ({ role, name, partyType, country, isCurrentUser, editingCountry, onEditCountry, onCountryChange, showCountry }) => (
  <div className={`rounded-xl border p-4 ${isCurrentUser ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"}`}>
    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">{role}</p>
    <p className="text-sm font-bold text-foreground">{name}</p>
    <Badge variant="outline" className="text-[9px] mt-1">
      {partyType === "business" ? "Business / Unternehmen" : "Private / Privatperson"}
    </Badge>
    {showCountry && country && (
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {editingCountry && onCountryChange ? (
          <Select value={country} onValueChange={onCountryChange}>
            <SelectTrigger className="w-36 h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : (
          <span>
            {country}
            {onEditCountry && (
              <button onClick={onEditCountry} className="ml-1.5 text-primary hover:text-primary/80 inline-flex items-center gap-0.5 text-[10px]">
                <Edit2 className="h-2.5 w-2.5" />
              </button>
            )}
          </span>
        )}
      </div>
    )}
  </div>
);

const KycShieldBadge: React.FC<{ name: string; role: string; verified: boolean }> = ({ name, role, verified }) => (
  <div className={`rounded-xl border-2 p-4 flex flex-col items-center gap-2 ${verified ? "border-emerald-300 bg-emerald-50" : "border-border bg-muted/30"}`}>
    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${verified ? "bg-emerald-100" : "bg-muted"}`}>
      {verified ? (
        <ShieldCheck className="h-8 w-8 text-emerald-600" />
      ) : (
        <ShieldX className="h-8 w-8 text-muted-foreground" />
      )}
    </div>
    <Badge className={`text-[10px] ${verified ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted"}`}>
      {verified ? "✓ KYC VERIFIED" : "✗ NOT VERIFIED"}
    </Badge>
    <div className="text-center">
      <p className="text-[10px] text-muted-foreground">{role}</p>
      <p className="text-xs font-semibold text-foreground truncate max-w-[120px]">{name}</p>
    </div>
  </div>
);

const NotaryStamp: React.FC<{ name: string; role: string; signed: boolean; signDate?: string | null }> = ({ name, role, signed, signDate }) => {
  const formattedDate = signDate
    ? new Date(signDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className={`rounded-xl border-2 border-dashed p-4 flex flex-col items-center gap-2 transition-all ${signed ? "border-emerald-400 bg-emerald-50/50" : "border-border bg-muted/20"}`}>
      {/* Stamp circle */}
      <div className={`relative w-20 h-20 rounded-full border-[3px] flex items-center justify-center ${signed ? "border-emerald-500" : "border-muted-foreground/30"}`}>
        {/* Inner ring */}
        <div className={`absolute inset-1.5 rounded-full border ${signed ? "border-emerald-400" : "border-muted-foreground/20"}`} />
        {/* Content */}
        <div className="flex flex-col items-center">
          <span className={`text-[7px] font-bold tracking-widest ${signed ? "text-emerald-600" : "text-muted-foreground"}`}>
            AUTOZON
          </span>
          {signed ? (
            <>
              <span className="text-[8px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-sm mt-0.5">
                SIGNED
              </span>
              <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5" />
            </>
          ) : (
            <>
              <span className="text-[7px] text-muted-foreground mt-0.5">AWAITING</span>
              <Clock className="h-3 w-3 text-muted-foreground mt-0.5" />
            </>
          )}
          <span className={`text-[5px] tracking-wider mt-0.5 ${signed ? "text-emerald-500" : "text-muted-foreground/60"}`}>
            DIGITAL SIGNATURE
          </span>
        </div>
      </div>
      {/* Label */}
      <p className="text-xs font-bold text-foreground">{role}</p>
      <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{name}</p>
      {signed && formattedDate ? (
        <p className="text-[9px] text-emerald-600 font-medium">{formattedDate}</p>
      ) : (
        <p className="text-[9px] text-muted-foreground italic">
          Pending / Ausstehend
        </p>
      )}
    </div>
  );
};

const DocumentList: React.FC<{
  title: string;
  docs: { label: string; label_de: string; required: boolean }[];
  language: string;
}> = ({ title, docs, language }) => (
  <div>
    <p className="text-xs font-bold text-primary mb-2">{title}</p>
    <ul className="space-y-1.5">
      {docs.map((d, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
          <File className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
          <span>{language === "de" ? d.label_de : d.label}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default StepContract;
