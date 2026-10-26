import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import ChatWidget from "@/components/site/ChatWidget";

// TYPOGRAPHY FORMAT (2026-10-26, on request — "this is the format we are going
// to follow on this entire website... follow this strictly"): Poppins for body
// text (400/500/600/700), Impact for h1–h3. See globals.css for the scale and
// element rules. Poppins comes through next/font (self-hosted) rather than
// the spec's Google Fonts @import — same family and weights. Replaces Open
// Sans (body), Poppins-as-display, and the Anton test on the Family heading.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Impact, self-hosted from fonts/Impact.ttf (commercially licensed;
// webfont-license coverage confirmed with the user 2026-07-30). Single
// static weight — the spec's display weight is 400, so no faux-bold.
const impact = localFont({
  src: "./fonts/Impact.ttf",
  variable: "--font-impact",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TNT Crane & Rigging — Crane Rental, Rigging & Lift Engineering",
  description:
    "Crane rental, specialty rigging, and lift engineering unified across North America. Find equipment by capacity, locate your nearest branch, and request a lift plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${impact.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Inertial smooth scroll + single GSAP rAF loop for all scroll motion */}
        <SmoothScroll />
        {/* Fixed nav + shared footer wrap every route */}
        <SiteNav />
        {/* The nav is fixed, so it overlays page content. Inner routes used to
            clear it only by accident — their first section's `py-20` happened
            to exceed the old 102px chrome. Raising the bar to 122px put the
            first eyebrow 10px UNDER it. This reserves the space explicitly.
            The homepage cancels it (see page.tsx) because its hero is meant to
            run full-bleed beneath the bar. */}
        <main className="pt-[var(--chrome-h)]">{children}</main>
        <SiteFooter />
        {/* AI site assistant — floating "Ask TNT" button, bottom-right.
            Needs ANTHROPIC_API_KEY; see src/app/api/chat/route.ts. */}
        <ChatWidget />
      </body>
    </html>
  );
}
