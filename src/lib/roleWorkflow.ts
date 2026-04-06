/**
 * Role-based workflow configuration for transactions.
 * Defines document checklists, warranty rules, contract clauses, and offline deadlines
 * based on seller/buyer type combinations.
 */

export type PartyType = "private" | "business";
export type RoleCombo = `${PartyType}_${PartyType}`; // seller_buyer

export interface DocumentRequirement {
  document_type: string;
  label: string;
  label_de: string;
  required: boolean;
  uploader_role: "seller" | "buyer";
}

export interface DeadlineConfig {
  step_type: string;
  label: string;
  label_de: string;
  hours: number; // hours from contract signing
}

export interface WarrantyConfig {
  type: "none" | "statutory_2y" | "negotiable";
  label: string;
  label_de: string;
  description: string;
  description_de: string;
}

export interface RoleWorkflow {
  warrantyConfig: WarrantyConfig;
  sellerDocuments: DocumentRequirement[];
  buyerDocuments: DocumentRequirement[];
  extraClauses: { en: string; de: string }[];
  deadlines: DeadlineConfig[];
}

// ─── Shared document requirements ───

const SELLER_DOCS_PRIVATE: DocumentRequirement[] = [
  { document_type: "zulassungsschein_1", label: "Registration Certificate Part I (Zulassungsschein Teil I)", label_de: "Zulassungsschein Teil I", required: true, uploader_role: "seller" },
  { document_type: "zulassungsschein_2", label: "Registration Certificate Part II (Zulassungsschein Teil II)", label_de: "Zulassungsschein Teil II", required: true, uploader_role: "seller" },
  { document_type: "service_book", label: "Service Book (Serviceheft)", label_de: "Serviceheft", required: false, uploader_role: "seller" },
  { document_type: "pickerl", label: "§57a Inspection Certificate (Pickerl)", label_de: "§57a Gutachten (Pickerl)", required: true, uploader_role: "seller" },
  { document_type: "seller_id", label: "Government-issued ID", label_de: "Amtlicher Lichtbildausweis", required: true, uploader_role: "seller" },
];

const SELLER_DOCS_BUSINESS: DocumentRequirement[] = [
  { document_type: "zulassungsschein_1", label: "Registration Certificate Part I", label_de: "Zulassungsschein Teil I", required: true, uploader_role: "seller" },
  { document_type: "zulassungsschein_2", label: "Registration Certificate Part II", label_de: "Zulassungsschein Teil II", required: true, uploader_role: "seller" },
  { document_type: "gewerbeschein", label: "Trade License (Gewerbeschein)", label_de: "Gewerbeschein", required: true, uploader_role: "seller" },
  { document_type: "invoice", label: "Invoice / Rechnung", label_de: "Rechnung", required: true, uploader_role: "seller" },
  { document_type: "warranty_cert", label: "Warranty Certificate (if applicable)", label_de: "Garantiezertifikat (falls zutreffend)", required: false, uploader_role: "seller" },
  { document_type: "pickerl", label: "§57a Inspection Certificate (Pickerl)", label_de: "§57a Gutachten (Pickerl)", required: true, uploader_role: "seller" },
  { document_type: "service_book", label: "Service Book (Serviceheft)", label_de: "Serviceheft", required: false, uploader_role: "seller" },
];

const BUYER_DOCS_PRIVATE: DocumentRequirement[] = [
  { document_type: "buyer_id", label: "Government-issued ID (verified via KYC)", label_de: "Amtlicher Lichtbildausweis (KYC-verifiziert)", required: true, uploader_role: "buyer" },
  { document_type: "proof_of_payment", label: "Proof of Payment", label_de: "Zahlungsnachweis", required: true, uploader_role: "buyer" },
];

const BUYER_DOCS_BUSINESS: DocumentRequirement[] = [
  { document_type: "firmenbuchauszug", label: "Commercial Register Extract (Firmenbuchauszug)", label_de: "Firmenbuchauszug", required: true, uploader_role: "buyer" },
  { document_type: "uid_confirmation", label: "UID Number Confirmation", label_de: "UID-Nummernbestätigung", required: true, uploader_role: "buyer" },
  { document_type: "representative_auth", label: "Authorized Representative Proof", label_de: "Vollmacht des Vertretungsbefugten", required: true, uploader_role: "buyer" },
  { document_type: "proof_of_payment", label: "Proof of Payment / Bank Transfer", label_de: "Zahlungsnachweis / Überweisung", required: true, uploader_role: "buyer" },
];

// ─── Deadlines (hours from contract signing — all run in parallel) ───

const STANDARD_DEADLINES: DeadlineConfig[] = [
  { step_type: "vehicle_inspection", label: "Vehicle Inspection", label_de: "Fahrzeuginspektion", hours: 72 },
  { step_type: "buyer_insurance", label: "Buyer Insurance (eVB)", label_de: "Käufer-Versicherung (eVB)", hours: 120 },
  { step_type: "deregistration", label: "Seller Deregistration", label_de: "Abmeldung durch Verkäufer", hours: 120 },
  { step_type: "buyer_registration", label: "Buyer Registration", label_de: "Anmeldung durch Käufer", hours: 288 },
  { step_type: "plates_received", label: "Registration Plates Received", label_de: "Kennzeichen erhalten", hours: 312 },
  { step_type: "registration_cert", label: "Registration Certificate I & II", label_de: "Zulassungsschein Teil I & II", hours: 312 },
  { step_type: "vehicle_handover", label: "Vehicle Handover", label_de: "Fahrzeugübergabe", hours: 384 },
];

// ─── Workflow definitions by role combo ───

const WORKFLOWS: Record<RoleCombo, RoleWorkflow> = {
  // Private Seller → Private Buyer
  private_private: {
    warrantyConfig: {
      type: "none",
      label: "No Warranty (Gewährleistungsausschluss)",
      label_de: "Gewährleistungsausschluss",
      description: "Private-to-private sales exclude statutory warranty by mutual agreement.",
      description_de: "Bei Privatverkäufen wird die Gewährleistung einvernehmlich ausgeschlossen.",
    },
    sellerDocuments: SELLER_DOCS_PRIVATE,
    buyerDocuments: BUYER_DOCS_PRIVATE,
    extraClauses: [
      {
        en: "The statutory warranty (Gewährleistung) is excluded by mutual agreement of both private parties, as permitted under §9 KSchG for non-consumer transactions.",
        de: "Die gesetzliche Gewährleistung wird im gegenseitigen Einverständnis beider Privatpersonen ausgeschlossen, wie nach §9 KSchG für nicht-verbraucherrechtliche Geschäfte zulässig.",
      },
      {
        en: "The buyer has had the opportunity to inspect the vehicle and accepts it in its current condition.",
        de: "Der Käufer hatte die Möglichkeit, das Fahrzeug zu besichtigen und akzeptiert es im aktuellen Zustand.",
      },
    ],
    deadlines: STANDARD_DEADLINES,
  },

  // Business Seller → Private Buyer (Consumer protection applies)
  business_private: {
    warrantyConfig: {
      type: "statutory_2y",
      label: "2-Year Statutory Warranty (Gewährleistung)",
      label_de: "2 Jahre gesetzliche Gewährleistung",
      description: "As a business selling to a consumer, the 2-year statutory warranty applies and cannot be excluded.",
      description_de: "Als Unternehmen, das an einen Verbraucher verkauft, gilt die 2-jährige gesetzliche Gewährleistung und kann nicht ausgeschlossen werden.",
    },
    sellerDocuments: SELLER_DOCS_BUSINESS,
    buyerDocuments: BUYER_DOCS_PRIVATE,
    extraClauses: [
      {
        en: "In accordance with the Austrian Consumer Protection Act (Konsumentenschutzgesetz, KSchG), the seller provides a statutory warranty of 24 months from the date of delivery. During the first 12 months, the burden of proof lies with the seller (presumption of defect at time of delivery).",
        de: "Gemäß dem österreichischen Konsumentenschutzgesetz (KSchG) gewährt der Verkäufer eine gesetzliche Gewährleistung von 24 Monaten ab Lieferdatum. Während der ersten 12 Monate liegt die Beweislast beim Verkäufer (Vermutung des Mangels bei Lieferung).",
      },
      {
        en: "The buyer has the right to request repair or replacement for any defect that existed at the time of delivery. If repair and replacement are not possible or disproportionate, the buyer may request a price reduction or rescission of the contract.",
        de: "Der Käufer hat das Recht, bei jedem Mangel, der zum Zeitpunkt der Lieferung bestand, Reparatur oder Austausch zu verlangen. Sind Reparatur und Austausch nicht möglich oder unverhältnismäßig, kann der Käufer eine Preisminderung oder Vertragsauflösung verlangen.",
      },
      {
        en: "The seller must provide a proper invoice (Rechnung) including VAT. The sale is subject to commercial law provisions.",
        de: "Der Verkäufer muss eine ordnungsgemäße Rechnung inkl. USt. ausstellen. Der Verkauf unterliegt den handelsrechtlichen Bestimmungen.",
      },
    ],
    deadlines: STANDARD_DEADLINES,
  },

  // Private Seller → Business Buyer
  private_business: {
    warrantyConfig: {
      type: "none",
      label: "No Warranty (As-Is Sale to Professional Buyer)",
      label_de: "Keine Gewährleistung (Verkauf an gewerblichen Käufer wie besehen)",
      description: "The professional buyer accepts the vehicle as-is. No consumer protection applies.",
      description_de: "Der gewerbliche Käufer akzeptiert das Fahrzeug wie besehen. Kein Verbraucherschutz anwendbar.",
    },
    sellerDocuments: SELLER_DOCS_PRIVATE,
    buyerDocuments: BUYER_DOCS_BUSINESS,
    extraClauses: [
      {
        en: "The buyer is acting in a professional/commercial capacity. Consumer protection laws do not apply to this transaction. The statutory warranty is excluded by mutual agreement.",
        de: "Der Käufer handelt in gewerblicher/beruflicher Eigenschaft. Verbraucherschutzgesetze finden auf diese Transaktion keine Anwendung. Die gesetzliche Gewährleistung wird einvernehmlich ausgeschlossen.",
      },
      {
        en: "The buyer must provide a valid Commercial Register Extract (Firmenbuchauszug) and UID number confirmation as proof of business status.",
        de: "Der Käufer muss einen gültigen Firmenbuchauszug und eine UID-Nummernbestätigung als Nachweis des Unternehmensstatus vorlegen.",
      },
    ],
    deadlines: STANDARD_DEADLINES,
  },

  // Business Seller → Business Buyer (B2B)
  business_business: {
    warrantyConfig: {
      type: "negotiable",
      label: "Negotiable / Limited Warranty (B2B)",
      label_de: "Verhandelbare / Eingeschränkte Gewährleistung (B2B)",
      description: "B2B transactions allow warranty terms to be negotiated. Minimum 12-month warranty unless explicitly excluded.",
      description_de: "Bei B2B-Transaktionen können Gewährleistungsbedingungen verhandelt werden. Mindestens 12 Monate Gewährleistung, sofern nicht ausdrücklich ausgeschlossen.",
    },
    sellerDocuments: SELLER_DOCS_BUSINESS,
    buyerDocuments: BUYER_DOCS_BUSINESS,
    extraClauses: [
      {
        en: "Both parties are acting in a commercial capacity. This transaction is governed by the Austrian Commercial Code (Unternehmensgesetzbuch, UGB). Warranty terms may be modified by mutual agreement.",
        de: "Beide Parteien handeln in gewerblicher Eigenschaft. Diese Transaktion unterliegt dem österreichischen Unternehmensgesetzbuch (UGB). Gewährleistungsbedingungen können einvernehmlich geändert werden.",
      },
      {
        en: "Both parties must present valid commercial registration documents. Proper invoices with VAT must be exchanged.",
        de: "Beide Parteien müssen gültige Gewerberegisterdokumente vorlegen. Ordnungsgemäße Rechnungen mit USt. müssen ausgetauscht werden.",
      },
      {
        en: "The obligation to inspect goods immediately upon delivery (Rügepflicht) according to §377 UGB applies. Defects must be reported within 14 days of discovery.",
        de: "Die Pflicht zur unverzüglichen Prüfung der Ware bei Lieferung (Rügepflicht) gemäß §377 UGB gilt. Mängel müssen innerhalb von 14 Tagen nach Entdeckung gerügt werden.",
      },
    ],
    deadlines: STANDARD_DEADLINES,
  },
};

export function getRoleCombo(sellerType: PartyType, buyerType: PartyType): RoleCombo {
  return `${sellerType}_${buyerType}`;
}

export function getWorkflow(sellerType: PartyType, buyerType: PartyType): RoleWorkflow {
  return WORKFLOWS[getRoleCombo(sellerType, buyerType)];
}

export function getAllDocuments(workflow: RoleWorkflow): DocumentRequirement[] {
  return [...workflow.sellerDocuments, ...workflow.buyerDocuments];
}

export function getDeadlinesFromNow(workflow: RoleWorkflow, contractSignedAt: Date): Array<DeadlineConfig & { deadline_at: Date }> {
  return workflow.deadlines.map((d) => ({
    ...d,
    deadline_at: new Date(contractSignedAt.getTime() + d.hours * 60 * 60 * 1000),
  }));
}
