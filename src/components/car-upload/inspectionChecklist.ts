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
      { id: "glass", labelEn: "Is the windshield and all windows free of chips and cracks?", labelDe: "Sind Windschutzscheibe und alle Fenster frei von Rissen und Absplitterungen?" },
      { id: "lights", labelEn: "Are all lights fully functional (headlights, tail lights, turn signals, brake lights)?", labelDe: "Funktionieren alle Lichter einwandfrei (Scheinwerfer, Rücklichter, Blinker, Bremslichter)?" },
      { id: "tires", labelEn: "Do all tires have sufficient tread depth (minimum 3 mm)?", labelDe: "Haben alle Reifen ausreichende Profiltiefe (mind. 3 mm)?" },
      { id: "underbody_rust", labelEn: "Is the body free of rust, especially around wheel wells and the frame?", labelDe: "Ist die Karosserie rostfrei, insbesondere an Radkästen und Rahmen?" },
      { id: "mirrors", labelEn: "Are all mirrors secure, properly adjusted, and undamaged?", labelDe: "Sind alle Spiegel fest, richtig eingestellt und unbeschädigt?" },
      { id: "wrapped", labelEn: "Is the car professionally wrapped?", labelDe: "Ist das Fahrzeug professionell foliert?" },
      { id: "ppf", labelEn: "Is the car covered with PPF (Paint Protection Film)?", labelDe: "Ist das Fahrzeug mit PPF (Lackschutzfolie) versehen?" },
    ],
  },
  {
    id: "interior",
    titleEn: "Interior Inspection",
    titleDe: "Innenrauminspektion",
    items: [
      { id: "upholstery", labelEn: "Are the seats in good condition, free of tears, stains, and excessive wear?", labelDe: "Sind die Sitze in gutem Zustand, frei von Rissen, Flecken und übermäßiger Abnutzung?" },
      { id: "dashboard_controls", labelEn: "Is the dashboard free of warning lights, and do all buttons, switches, and knobs work?", labelDe: "Ist das Armaturenbrett frei von Warnleuchten, und funktionieren alle Tasten, Schalter und Regler?" },
      { id: "electrical", labelEn: "Do power windows, door locks, mirrors, radio, and infotainment all work correctly?", labelDe: "Funktionieren Fensterheber, Türschlösser, Spiegel, Radio und Infotainment einwandfrei?" },
      { id: "ac_heating", labelEn: "Does the AC cool effectively and the heater function correctly?", labelDe: "Kühlt die Klimaanlage gut und funktioniert die Heizung einwandfrei?" },
      { id: "safety_equipment", labelEn: "Are seat belts, airbags (no error lights), and interior lighting all in working order?", labelDe: "Sind Sicherheitsgurte, Airbags (keine Fehlerleuchten) und Innenbeleuchtung funktionstüchtig?" },
      { id: "odometer", labelEn: "Is the odometer reading original and untampered?", labelDe: "Ist der Kilometerstand original und nicht manipuliert?" },
    ],
  },
  {
    id: "mechanical",
    titleEn: "Under the Hood & Mechanical",
    titleDe: "Unter der Haube & Mechanik",
    items: [
      { id: "engine_fluids", labelEn: "Are oil, brake fluid, power steering fluid, and coolant at proper levels and in good condition?", labelDe: "Sind Öl, Bremsflüssigkeit, Servolenkungsflüssigkeit und Kühlmittel auf dem richtigen Stand und in gutem Zustand?" },
      { id: "battery", labelEn: "Are the battery terminals clean and free of corrosion?", labelDe: "Sind die Batteriepole sauber und korrosionsfrei?" },
      { id: "belts_hoses", labelEn: "Are all belts and hoses intact, without cracks, fraying, or leaks?", labelDe: "Sind alle Riemen und Schläuche intakt, ohne Risse, Ausfransungen oder Lecks?" },
      { id: "engine_performance", labelEn: "Does the engine start smoothly and run without unusual noises?", labelDe: "Startet der Motor problemlos und läuft ohne ungewöhnliche Geräusche?" },
      { id: "exhaust", labelEn: "Is the exhaust clean, without excessive smoke?", labelDe: "Ist der Auspuff sauber, ohne übermäßige Rauchentwicklung?" },
    ],
  },
  {
    id: "test_drive",
    titleEn: "Test Drive (Performance Check)",
    titleDe: "Probefahrt (Leistungsprüfung)",
    items: [
      { id: "steering", labelEn: "Does the car track straight without pulling to one side?", labelDe: "Fährt das Fahrzeug geradeaus, ohne zu einer Seite zu ziehen?" },
      { id: "brakes", labelEn: "Do the brakes feel smooth and firm, without noise or vibration?", labelDe: "Bremst das Fahrzeug gleichmäßig und fest, ohne Geräusche oder Vibrationen?" },
      { id: "transmission", labelEn: "Does the transmission shift smoothly through all gears?", labelDe: "Schaltet das Getriebe sanft durch alle Gänge?" },
      { id: "suspension", labelEn: "Does the suspension handle bumps smoothly, without rattling or excessive bouncing?", labelDe: "Federt das Fahrwerk Unebenheiten sanft ab, ohne Klappern oder übermäßiges Federn?" },
    ],
  },
];

export type InspectionChecklist = Record<string, ChecklistAnswer>;

export const defaultInspectionChecklist: InspectionChecklist = {};
