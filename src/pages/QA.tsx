import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const qaContentEN = [
  {
    q: "How does Autozon solve the trade-off between selling fast (dealer) and selling for more (private)?",
    a: `Today, sellers must choose between speed (dealers) and price (private sale). Autozon removes that forced choice by creating a verified, cross-border buyer network that delivers both:

• Dealer-level speed through instant matching
• Private-sale pricing through broader liquidity and competition
• Zero hassle because Autozon handles verification, documentation, and buyer qualification

Autozon is not a listing site. It is a matching engine that compresses the entire selling process into a guided, trusted, and fast transaction.`,
  },
  {
    q: "How is Autozon different from existing platforms like Autotrader or Mobile.de?",
    a: `Traditional platforms like Autotrader or Mobile.de are classified ad marketplaces. They rely on sellers posting ads and waiting for random buyers to contact them. Autozon is fundamentally different:

• No listings, no waiting, no negotiation chaos
• AI-driven matching between verified sellers and pre-qualified buyers
• Cross-border liquidity, not just local demand
• End-to-end transaction support (documents, deregistration, export, delivery)
• Fraud-reduction and trust layer built into the process

Autozon is not another marketplace — it's a transactional infrastructure that replaces the outdated "post and pray" model with a fast, curated, and secure deal flow.`,
  },
  {
    q: "In some markets, trade-ins offer tax benefits. How does Autozon compete?",
    a: `In many markets worldwide, tax credits make trade-ins financially attractive despite lower prices. In other regions, this mechanism does not exist, so sellers receive no tax advantage for trading in. This means:

• Sellers lose money with trade-ins
• Private selling is more attractive but extremely time-consuming
• Dealers dominate because they offer convenience, not value

Autozon fills this gap by offering dealer-level convenience without the financial penalty, giving sellers a better net outcome than both trade-ins and private listings.`,
  },
  {
    q: "There are many websites where you post photos and wait for buyers. What's different?",
    a: `That model — posting photos and waiting for buyers — is exactly what Autozon replaces. It is slow, inefficient, and full of friction. Autozon eliminates the entire listing process:

• Sellers don't just post ads
• Buyers don't just browse thousands of listings
• The system matches both sides based on verified data
• The transaction is guided, structured, and secure

Autozon is a curated marketplace, not a public listing board. Think of it as "Tinder for cars" — but with verification, documentation, and logistics built in.`,
  },
  {
    q: "People already post free or paid ads to sell privately. Why use Autozon?",
    a: `This is the core problem with the current ecosystem. Free or paid ads still require:

• Taking photos
• Writing descriptions
• Handling calls and messages
• Negotiating with strangers
• Managing test drives
• Dealing with fraud risks
• Handling paperwork alone

Autozon removes all of this. The seller provides vehicle details once, and Autozon handles verification, pricing guidance, buyer qualification, matching, documentation, and the full transaction flow. It is private selling without the burden of private selling.`,
  },
  {
    q: "Valuation tools already tell you retail value. What more does Autozon offer?",
    a: `Valuation tools give a number, but they do not create a transaction. Autozon goes further:

• Dynamic pricing based on real cross-border demand
• Instant buyer matching instead of passive listing
• Real offers, not theoretical values
• Transaction execution, not just price guidance

Autozon transforms valuation into actionable liquidity — something traditional platforms cannot do.`,
  },
  {
    q: "How is Autozon different from the many car apps available worldwide?",
    a: `Most car apps are catalogues — digital versions of classified ads. They show inventory, but they do not solve the core problems:

• Trust
• Speed
• Documentation
• Cross-border access
• Fraud prevention
• Transaction execution

Autozon is not a browsing tool. It is a transaction engine that matches, verifies, facilitates, and executes. For buyers, it means curated cars that fit their exact criteria. For sellers, it means fast liquidity without the noise of traditional platforms.`,
  },
];

const qaContentDE = [
  {
    q: "Wie löst Autozon den Kompromiss zwischen schnellem Verkauf (Händler) und besserem Preis (privat)?",
    a: `Heute müssen Verkäufer zwischen Geschwindigkeit (Händler) und Preis (Privatverkauf) wählen. Autozon beseitigt diesen Zwang, indem es ein verifiziertes, grenzüberschreitendes Käufernetzwerk schafft, das beides bietet:

• Händler-Geschwindigkeit durch sofortiges Matching
• Privatverkaufs-Preise durch breitere Liquidität und Wettbewerb
• Null Aufwand, da Autozon Verifizierung, Dokumentation und Käuferqualifizierung übernimmt

Autozon ist keine Inserats-Seite. Es ist eine Matching-Engine, die den gesamten Verkaufsprozess in eine geführte, vertrauenswürdige und schnelle Transaktion komprimiert.`,
  },
  {
    q: "Wie unterscheidet sich Autozon von bestehenden Plattformen wie Autotrader oder Mobile.de?",
    a: `Traditionelle Plattformen wie Autotrader oder Mobile.de sind Kleinanzeigen-Marktplätze. Verkäufer schalten Anzeigen und warten darauf, dass zufällige Käufer sie kontaktieren. Autozon ist grundlegend anders:

• Keine Inserate, kein Warten, kein Verhandlungschaos
• KI-gesteuertes Matching zwischen verifizierten Verkäufern und vorqualifizierten Käufern
• Grenzüberschreitende Liquidität, nicht nur lokale Nachfrage
• End-to-End-Transaktionsunterstützung (Dokumente, Abmeldung, Export, Lieferung)
• Betrugsreduzierung und Vertrauensschicht im Prozess integriert

Autozon ist kein weiterer Marktplatz — es ist eine Transaktionsinfrastruktur, die das veraltete „Einstellen und Hoffen"-Modell durch einen schnellen, kuratierten und sicheren Deal-Flow ersetzt.`,
  },
  {
    q: "In manchen Märkten bieten Inzahlungnahmen Steuervorteile. Wie konkurriert Autozon?",
    a: `In vielen Märkten weltweit machen Steuergutschriften Inzahlungnahmen finanziell attraktiv — trotz niedrigerer Preise. In anderen Regionen existiert dieser Mechanismus nicht, sodass Verkäufer keinen Steuervorteil für die Inzahlungnahme erhalten. Das bedeutet:

• Verkäufer verlieren Geld bei Inzahlungnahmen
• Privatverkauf ist attraktiver, aber extrem zeitaufwändig
• Händler dominieren, weil sie Bequemlichkeit bieten, nicht Wert

Autozon füllt diese Lücke, indem es Händler-Komfort ohne den finanziellen Nachteil bietet und Verkäufern ein besseres Nettoergebnis als Inzahlungnahmen und private Inserate liefert.`,
  },
  {
    q: "Es gibt viele Websites, auf denen man Fotos hochlädt und auf Käufer wartet. Was ist anders?",
    a: `Genau dieses Modell — Fotos hochladen und auf Käufer warten — ersetzt Autozon. Es ist langsam, ineffizient und voller Reibung. Autozon eliminiert den gesamten Inseratsprozess:

• Verkäufer schalten nicht einfach Anzeigen
• Käufer durchsuchen nicht tausende Inserate
• Das System matcht beide Seiten auf Basis verifizierter Daten
• Die Transaktion ist geführt, strukturiert und sicher

Autozon ist ein kuratierter Marktplatz, kein öffentliches Inserats-Board. Denken Sie an „Tinder für Autos" — aber mit Verifizierung, Dokumentation und Logistik.`,
  },
  {
    q: "Menschen schalten bereits kostenlose oder bezahlte Anzeigen für den Privatverkauf. Warum Autozon nutzen?",
    a: `Das ist das Kernproblem des aktuellen Ökosystems. Kostenlose oder bezahlte Anzeigen erfordern immer noch:

• Fotos machen
• Beschreibungen schreiben
• Anrufe und Nachrichten bearbeiten
• Mit Fremden verhandeln
• Probefahrten organisieren
• Betrugsrisiken bewältigen
• Papierkram alleine erledigen

Autozon entfernt all das. Der Verkäufer gibt die Fahrzeugdaten einmal ein, und Autozon übernimmt Verifizierung, Preisberatung, Käuferqualifizierung, Matching, Dokumentation und den gesamten Transaktionsablauf. Es ist Privatverkauf ohne die Last des Privatverkaufs.`,
  },
  {
    q: "Bewertungstools zeigen bereits den Marktwert. Was bietet Autozon mehr?",
    a: `Bewertungstools liefern eine Zahl, schaffen aber keine Transaktion. Autozon geht weiter:

• Dynamische Preisgestaltung basierend auf realer grenzüberschreitender Nachfrage
• Sofortiges Käufer-Matching statt passiver Inserate
• Echte Angebote, keine theoretischen Werte
• Transaktionsausführung, nicht nur Preisberatung

Autozon verwandelt Bewertung in umsetzbare Liquidität — etwas, das traditionelle Plattformen nicht können.`,
  },
  {
    q: "Wie unterscheidet sich Autozon von den vielen Auto-Apps weltweit?",
    a: `Die meisten Auto-Apps sind Kataloge — digitale Versionen von Kleinanzeigen. Sie zeigen Bestand, lösen aber nicht die Kernprobleme:

• Vertrauen
• Geschwindigkeit
• Dokumentation
• Grenzüberschreitender Zugang
• Betrugsprävention
• Transaktionsausführung

Autozon ist kein Browsing-Tool. Es ist eine Transaktions-Engine, die matcht, verifiziert, vermittelt und ausführt. Für Käufer bedeutet es kuratierte Autos, die genau ihren Kriterien entsprechen. Für Verkäufer bedeutet es schnelle Liquidität ohne den Lärm traditioneller Plattformen.`,
  },
];

const QA = () => {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const qaContent = language === "de" ? qaContentDE : qaContentEN;
  const filtered = qaContent.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );
  const title = language === "de" ? "Häufige Fragen" : "Questions & Answers";
  const subtitle = language === "de"
    ? "Antworten auf die wichtigsten Fragen rund um Autozon."
    : "Answers to the most important questions about Autozon.";
  const backLabel = language === "de" ? "← Zurück zur Startseite" : "← Back to Home";
  const searchPlaceholder = language === "de" ? "Fragen durchsuchen…" : "Search questions…";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Q&A"
        description="Frequently asked questions about Autozon — how it works, what makes it different, and why it's the smarter way to buy and sell cars."
        path="/qa"
      />
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-orange mb-8">
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">{title}</h1>
        <p className="text-muted-foreground mb-6">{subtitle}</p>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-muted/80 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange/50"
          />
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {filtered.map((item, i) => (
            <AccordionItem
              key={i}
              value={`q-${i}`}
              className="border border-border rounded-lg px-5 bg-muted/40"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default QA;
