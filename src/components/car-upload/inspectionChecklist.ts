export type ChecklistAnswer = "yes" | "no" | "unknown";

export interface ChecklistItem {
  id: string;
  labelEn: string;
  labelDe: string;
}

export interface ChecklistCategory {
  id: string;
  titleEn: string;
  titleDe: string;
  items: ChecklistItem[];
}

export const INSPECTION_CATEGORIES: ChecklistCategory[] = [
  {
    id: "exterior",
    titleEn: "Exterior Inspection (Body & Structure)",
    titleDe: "Außeninspektion (Karosserie & Struktur)",
    items: [
      { id: "glass", labelEn: "Any windshield or window chips / cracks?", labelDe: "Windschutzscheibe oder Fenster mit Rissen / Absplitterungen?" },
      { id: "lights", labelEn: "All lights working (headlights, tail lights, turn signals, brake lights)?", labelDe: "Alle Lichter funktionsfähig (Scheinwerfer, Rücklichter, Blinker, Bremslichter)?" },
      { id: "tires", labelEn: "Sufficient tread depth (minimum 1/8 inch)?", labelDe: "Ausreichende Profiltiefe (mind. 3 mm)?" },
      { id: "underbody_rust", labelEn: "Any rust, particularly around wheel wells and the frame?", labelDe: "Rost vorhanden, insbesondere an Radkästen und Rahmen?" },
      { id: "mirrors", labelEn: "Mirrors properly adjusted, secure, and undamaged?", labelDe: "Spiegel richtig eingestellt, fest und unbeschädigt?" },
    ],
  },
  {
    id: "interior",
    titleEn: "Interior Inspection",
    titleDe: "Innenrauminspektion",
    items: [
      { id: "upholstery", labelEn: "Seats show signs of tears, stains, or worn fabric?", labelDe: "Sitze zeigen Risse, Flecken oder abgenutzte Polster?" },
      { id: "dashboard_controls", labelEn: "Any warning lights? All buttons, switches, and knobs working?", labelDe: "Warnleuchten aktiv? Alle Tasten, Schalter und Regler funktionsfähig?" },
      { id: "electrical", labelEn: "Power windows, door locks, mirrors, radio, and infotainment all working?", labelDe: "Fensterheber, Türschlösser, Spiegel, Radio und Infotainment funktionsfähig?" },
      { id: "ac_heating", labelEn: "AC cools quickly and heater functions correctly?", labelDe: "Klimaanlage kühlt schnell und Heizung funktioniert korrekt?" },
      { id: "safety_equipment", labelEn: "Seat belts, SRS airbags (no error lights), and interior lighting OK?", labelDe: "Sicherheitsgurte, SRS-Airbags (keine Fehlerleuchten) und Innenbeleuchtung OK?" },
      { id: "odometer", labelEn: "Original kilometers, no tampering?", labelDe: "Originalkilometerstand, keine Manipulation?" },
    ],
  },
  {
    id: "mechanical",
    titleEn: "Under the Hood & Mechanical",
    titleDe: "Unter der Haube & Mechanik",
    items: [
      { id: "engine_fluids", labelEn: "Oil levels/color, brake fluid, power steering fluid, and coolant levels all good?", labelDe: "Ölstand/-farbe, Bremsflüssigkeit, Servolenkungsflüssigkeit und Kühlmittel OK?" },
      { id: "battery", labelEn: "Any corrosion on battery terminals?", labelDe: "Korrosion an den Batteriepolen?" },
      { id: "belts_hoses", labelEn: "Any cracks, frays, or leaks on belts and hoses?", labelDe: "Risse, Ausfransungen oder Lecks an Riemen und Schläuchen?" },
      { id: "engine_performance", labelEn: "Engine starts well, no unusual noises (squealing, grinding)?", labelDe: "Motor startet gut, keine ungewöhnlichen Geräusche (Quietschen, Schleifen)?" },
      { id: "exhaust", labelEn: "Exhaust does not emit excessive smoke?", labelDe: "Auspuff ohne übermäßige Rauchentwicklung?" },
    ],
  },
  {
    id: "test_drive",
    titleEn: "Test Drive (Performance Check)",
    titleDe: "Probefahrt (Leistungsprüfung)",
    items: [
      { id: "steering", labelEn: "Car tracks straight, does not pull to one side?", labelDe: "Fahrzeug fährt geradeaus, zieht nicht zu einer Seite?" },
      { id: "brakes", labelEn: "Smooth, firm braking without noise or vibration?", labelDe: "Gleichmäßiges, festes Bremsen ohne Geräusche oder Vibrationen?" },
      { id: "transmission", labelEn: "Smooth shifting (automatic and manual)?", labelDe: "Sanftes Schalten (Automatik und Schaltgetriebe)?" },
      { id: "suspension", labelEn: "No rattling or excessive bouncing over bumps?", labelDe: "Kein Klappern oder übermäßiges Federn bei Unebenheiten?" },
    ],
  },
];

export type InspectionChecklist = Record<string, ChecklistAnswer>;

export const defaultInspectionChecklist: InspectionChecklist = {};
