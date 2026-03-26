import React from "react";

const commonClass = "w-full h-full text-muted-foreground/15";

const FrontView: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass} {...props}>
    {/* Car front silhouette */}
    <path d="M25 70 L25 45 Q25 35 35 30 L45 22 Q55 16 60 16 Q65 16 75 22 L85 30 Q95 35 95 45 L95 70 Q95 75 90 75 L30 75 Q25 75 25 70Z" fill="currentColor" />
    {/* Headlights */}
    <ellipse cx="38" cy="50" rx="7" ry="5" fill="currentColor" opacity="0.5" />
    <ellipse cx="82" cy="50" rx="7" ry="5" fill="currentColor" opacity="0.5" />
    {/* Grille */}
    <rect x="48" y="48" width="24" height="12" rx="3" fill="currentColor" opacity="0.4" />
    {/* Windshield */}
    <path d="M42 28 Q60 18 78 28 L74 38 Q60 32 46 38Z" fill="currentColor" opacity="0.3" />
  </svg>
);

const RearView: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass} {...props}>
    <path d="M25 70 L25 45 Q25 35 35 30 L45 24 Q55 18 60 18 Q65 18 75 24 L85 30 Q95 35 95 45 L95 70 Q95 75 90 75 L30 75 Q25 75 25 70Z" fill="currentColor" />
    {/* Taillights */}
    <rect x="28" y="48" width="12" height="6" rx="2" fill="currentColor" opacity="0.5" />
    <rect x="80" y="48" width="12" height="6" rx="2" fill="currentColor" opacity="0.5" />
    {/* Rear window */}
    <path d="M44 28 Q60 20 76 28 L72 38 Q60 32 48 38Z" fill="currentColor" opacity="0.3" />
    {/* License plate */}
    <rect x="45" y="58" width="30" height="8" rx="2" fill="currentColor" opacity="0.4" />
  </svg>
);

const SideView: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass} {...props}>
    {/* Car body side profile */}
    <path d="M15 60 L15 50 Q15 45 20 42 L35 38 L50 25 Q55 20 65 20 L80 22 Q90 24 95 30 L105 42 Q110 45 110 50 L110 60 Q110 65 105 65 L15 65 Q12 65 12 60Z" fill="currentColor" />
    {/* Windows */}
    <path d="M52 28 L65 23 L78 25 L85 34 L48 36Z" fill="currentColor" opacity="0.3" />
    {/* Wheels */}
    <circle cx="35" cy="65" r="10" fill="currentColor" opacity="0.6" />
    <circle cx="35" cy="65" r="5" fill="currentColor" opacity="0.3" />
    <circle cx="90" cy="65" r="10" fill="currentColor" opacity="0.6" />
    <circle cx="90" cy="65" r="5" fill="currentColor" opacity="0.3" />
  </svg>
);

const InteriorFrontView: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass} {...props}>
    {/* Windshield frame */}
    <path d="M15 15 L105 15 L110 80 L10 80Z" fill="currentColor" opacity="0.2" />
    {/* Steering wheel */}
    <circle cx="42" cy="55" r="14" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.5" />
    <circle cx="42" cy="55" r="4" fill="currentColor" opacity="0.4" />
    {/* Dashboard screen */}
    <rect x="62" y="42" width="28" height="18" rx="3" fill="currentColor" opacity="0.35" />
    {/* Seats */}
    <rect x="22" y="68" width="22" height="10" rx="4" fill="currentColor" opacity="0.3" />
    <rect x="56" y="68" width="22" height="10" rx="4" fill="currentColor" opacity="0.3" />
  </svg>
);

const InteriorRearView: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass} {...props}>
    {/* Rear window frame */}
    <path d="M20 15 L100 15 L105 80 L15 80Z" fill="currentColor" opacity="0.2" />
    {/* Rear seats */}
    <rect x="22" y="38" width="76" height="16" rx="5" fill="currentColor" opacity="0.35" />
    {/* Headrests */}
    <rect x="30" y="30" width="12" height="10" rx="4" fill="currentColor" opacity="0.3" />
    <rect x="54" y="30" width="12" height="10" rx="4" fill="currentColor" opacity="0.3" />
    <rect x="78" y="30" width="12" height="10" rx="4" fill="currentColor" opacity="0.3" />
    {/* Floor */}
    <rect x="25" y="60" width="70" height="12" rx="3" fill="currentColor" opacity="0.15" />
  </svg>
);

const DashboardView: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass} {...props}>
    {/* Dashboard panel */}
    <rect x="10" y="20" width="100" height="50" rx="6" fill="currentColor" opacity="0.25" />
    {/* Instrument cluster */}
    <circle cx="35" cy="42" r="12" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
    <circle cx="55" cy="42" r="12" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
    {/* Gauge needles */}
    <line x1="35" y1="42" x2="35" y2="33" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    <line x1="55" y1="42" x2="60" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    {/* Infotainment screen */}
    <rect x="72" y="30" width="30" height="20" rx="3" fill="currentColor" opacity="0.35" />
    {/* AC vents */}
    <rect x="25" y="60" width="16" height="5" rx="2" fill="currentColor" opacity="0.2" />
    <rect x="52" y="60" width="16" height="5" rx="2" fill="currentColor" opacity="0.2" />
    <rect x="79" y="60" width="16" height="5" rx="2" fill="currentColor" opacity="0.2" />
  </svg>
);

export const SLOT_PLACEHOLDERS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  front: FrontView,
  rear: RearView,
  left: SideView,
  right: SideView,
  interior_front: InteriorFrontView,
  interior_rear: InteriorRearView,
  dashboard: DashboardView,
};
