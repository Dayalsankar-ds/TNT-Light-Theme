/**
 * SHARED SECTION PRIMITIVES
 *
 * Eyebrow + heading enforce the type system across every section:
 *   Eyebrow  — 13px letter-spaced caps in TNT Amber
 *   Heading  — bold condensed all-caps display (Anton), Rich Black by default
 * Icon is a compact inline-SVG set (no icon-font dependency) so glyphs inherit
 * currentColor and stay crisp at any size.
 */

import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-body text-[13px] font-bold tracking-[0.18em] text-tnt-amber uppercase ${className}`}
    >
      {children}
    </p>
  );
}

export function Heading({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={`font-display tracking-wide text-black uppercase ${className}`}
    >
      {children}
    </Tag>
  );
}

export type IconName =
  | "crawler"
  | "allterrain"
  | "tower"
  | "boom"
  | "carrydeck"
  | "rigging"
  | "engineering"
  | "rail"
  | "wind"
  | "heavylift"
  | "rental"
  | "storage"
  | "transport"
  | "refinery"
  | "petrochemical"
  | "power"
  | "infrastructure"
  | "commercial"
  | "agreement"
  | "credit"
  | "payment"
  | "pin"
  | "search"
  | "arrow"
  | "mail"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "instagram"
  | "clock"
  | "person"
  | "trophy"
  | "headset"
  | "chevron-up";

const PATHS: Record<IconName, ReactNode> = {
  crawler: (
    <>
      <path d="M3 17h18M4 17l2-5h9l4 5M8 12V7l9 3" />
      <circle cx="7" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
    </>
  ),
  allterrain: (
    <>
      <path d="M2 15h20M4 15l1-4h11l4 4M9 11V8l8 2.5" />
      <circle cx="7" cy="17" r="1.6" />
      <circle cx="12" cy="17" r="1.6" />
      <circle cx="17" cy="17" r="1.6" />
    </>
  ),
  tower: (
    <>
      <path d="M12 21V5M6 5h12M9 5 12 2l3 3M6 5l6 4 6-4M12 9v3" />
    </>
  ),
  boom: (
    <>
      <path d="M4 20h6M7 20V8l12-3M7 8l10 8M17 5v3" />
    </>
  ),
  carrydeck: (
    <>
      <path d="M2 16h20M3 16v-3h10l3-3h4v6" />
      <circle cx="7" cy="18" r="1.4" />
      <circle cx="16" cy="18" r="1.4" />
    </>
  ),
  rigging: (
    <>
      <path d="M12 3v4M8 7h8l-2 5H10L8 7ZM12 12v4M9 20h6M12 16l-3 4M12 16l3 4" />
    </>
  ),
  engineering: (
    <>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  rail: (
    <>
      <path d="M4 21 8 3M20 21 16 3M6 12h12M7 7h10M5 17h14" />
    </>
  ),
  wind: (
    <>
      <path d="M12 12V21M12 12l6-2M12 12 8 6M12 12l-5 4" />
      <circle cx="12" cy="12" r="1.6" />
    </>
  ),
  heavylift: (
    <>
      <path d="M4 20h16M7 20v-6h10v6M9 14v-3h6v3M11 11V8h2v3" />
    </>
  ),
  rental: (
    <>
      <path d="M4 8h16v11H4zM4 8l3-4h10l3 4M9 12h6" />
    </>
  ),
  storage: (
    <>
      <path d="M3 9l9-5 9 5v10H3zM3 9h18M8 19v-6h8v6" />
    </>
  ),
  transport: (
    <>
      <path d="M2 16h11V7H2zM13 10h4l3 3v3h-7" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  refinery: (
    <>
      <path d="M3 21V10l4-2v3l4-3v13M15 21V6l6 3v12M3 21h18M6 13v4M18 13v4" />
    </>
  ),
  petrochemical: (
    <>
      <path d="M6 21a4 4 0 0 0 8 0c0-3-4-5-4-9 0 4-4 6-4 9ZM16 21a3 3 0 0 0 5-2c0-2-3-3-3-6 0 3-2 4-2 6" />
    </>
  ),
  power: (
    <>
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </>
  ),
  infrastructure: (
    <>
      <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M12 4v3" />
    </>
  ),
  commercial: (
    <>
      <path d="M4 21V4h9v17M13 9h7v12M7 8h3M7 12h3M7 16h3M16 13h1M16 17h1" />
    </>
  ),
  agreement: (
    <>
      <path d="M6 3h9l3 3v15H6zM9 8h6M9 12h6M9 16h3" />
    </>
  ),
  credit: (
    <>
      <path d="M3 6h18v12H3zM3 10h18M6 15h4" />
    </>
  ),
  payment: (
    <>
      <path d="M12 2v20M17 6H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  // Social marks are drawn as outline glyphs inside a shared rounded square so
  // the four read as one set and match the stroke weight of every icon above —
  // solid brand logos would sit apart from this system.
  facebook: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <path d="M15.5 8H14a1.8 1.8 0 0 0-1.8 1.8V12H10m5 0h-2.8m0 0v6" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <path d="M7.5 10.5V17M7.5 7.5v.01M11.5 17v-4a2.2 2.2 0 0 1 4.4 0v4" />
    </>
  ),
  youtube: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <path d="m10.5 9.2 4.6 2.8-4.6 2.8z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.9" cy="7.1" r="0.6" />
    </>
  ),
  // Operational-scale stats (OperationalScale.tsx): years / headcount / rank /
  // 24-7 support. Same outline convention as the set above.
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-4 3.2-6.8 7-6.8s7 2.8 7 6.8" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 3h10v4a5 5 0 0 1-10 0V3Z" />
      <path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4" />
      <path d="M12 12v4M9 20h6" />
    </>
  ),
  headset: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4.5" height="6.5" rx="1.6" />
      <rect x="16.5" y="13" width="4.5" height="6.5" rx="1.6" />
    </>
  ),
  // Bare chevron, no shaft: the hero scroll cue animates the mark upward, so a
  // full arrow would read as two competing motions. Drawn shallow (6→12→18 over
  // a 5px rise) to match the open, wide angle of `arrow`'s head.
  "chevron-up": (
    <>
      <path d="m6 14.5 6-5 6 5" />
    </>
  ),
};

/** FILLED VARIANT (2026-10-26, on request — "use the filled icon... above the
 *  navbar, location and email... Facebook, Instagram, LinkedIn and YouTube...
 *  and the About Us section"). Solid shapes from Phosphor Icons' "Fill"
 *  weight (@phosphor-icons/core 2.1.1, MIT), copied in as path data so the
 *  site takes on no new dependency. 256×256 viewBox, filled with
 *  currentColor. Only the icons that use `variant="filled"` are here; any
 *  other name falls back to its outline. */
const FILLED: Partial<Record<IconName, string[]>> = {
  pin: ["M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"],
  mail: ["M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-8,144H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"],
  payment: ["M160,152a16,16,0,0,1-16,16h-8V136h8A16,16,0,0,1,160,152Zm72-24A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-56,24a32,32,0,0,0-32-32h-8V88h4a16,16,0,0,1,16,16,8,8,0,0,0,16,0,32,32,0,0,0-32-32h-4V64a8,8,0,0,0-16,0v8h-4a32,32,0,0,0,0,64h4v32h-8a16,16,0,0,1-16-16,8,8,0,0,0-16,0,32,32,0,0,0,32,32h8v8a8,8,0,0,0,16,0v-8h8A32,32,0,0,0,176,152Zm-76-48a16,16,0,0,0,16,16h4V88h-4A16,16,0,0,0,100,104Z"],
  facebook: ["M232,128a104.16,104.16,0,0,1-91.55,103.26,4,4,0,0,1-4.45-4V152h24a8,8,0,0,0,8-8.53,8.17,8.17,0,0,0-8.25-7.47H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,8-8.53A8.17,8.17,0,0,0,167.73,80H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0-8,8.53A8.17,8.17,0,0,0,96.27,152H120v75.28a4,4,0,0,1-4.44,4A104.15,104.15,0,0,1,24.07,124.09c2-54,45.74-97.9,99.78-100A104.12,104.12,0,0,1,232,128Z"],
  linkedin: ["M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24ZM96,176a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0ZM88,96a12,12,0,1,1,12-12A12,12,0,0,1,88,96Zm96,80a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140Z"],
  youtube: ["M234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-73.74,65-40,28A8,8,0,0,1,108,156V100a8,8,0,0,1,12.59-6.55l40,28a8,8,0,0,1,0,13.1Z"],
  instagram: ["M176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24ZM128,176a48,48,0,1,1,48-48A48.05,48.05,0,0,1,128,176Zm60-96a12,12,0,1,1,12-12A12,12,0,0,1,188,80Zm-28,48a32,32,0,1,1-32-32A32,32,0,0,1,160,128Z"],
  clock: ["M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"],
  person: ["M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"],
  boom: ["M228.12,17.14a8,8,0,0,0-7.88-.2L102,80H32A16,16,0,0,0,16,96V200a16,16,0,0,0,16,16h88a16,16,0,0,0,16-16V168a7.31,7.31,0,0,0-.08-1.05l0-.24a9.6,9.6,0,0,0-.22-1,.09.09,0,0,0,0-.05v0a.64.64,0,0,1,0-.07L113.54,92,216,37.33V160H200v-8a8,8,0,0,0-16,0v8a16,16,0,0,0,16,16h16a16,16,0,0,0,16-16V24A8,8,0,0,0,228.12,17.14ZM48,96v64H32V96ZM32,200h0V176h88v24Z"],
  trophy: ["M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z"],
  headset: ["M232,128v80a40,40,0,0,1-40,40H136a8,8,0,0,1,0-16h56a24,24,0,0,0,24-24H192a24,24,0,0,1-24-24V144a24,24,0,0,1,24-24h23.65A88,88,0,0,0,66,65.54,87.29,87.29,0,0,0,40.36,120H64a24,24,0,0,1,24,24v40a24,24,0,0,1-24,24H48a24,24,0,0,1-24-24V128A104.11,104.11,0,0,1,201.89,54.66,103.41,103.41,0,0,1,232,128Z"],
};

export function Icon({
  name,
  className = "h-6 w-6",
  strokeWidth = 1.8,
  variant = "outline",
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
  variant?: "outline" | "filled";
}) {
  const filled = variant === "filled" ? FILLED[name] : undefined;
  if (filled) {
    return (
      <svg viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
        {filled.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
