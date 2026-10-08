import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import HashScroll from "@/components/about/HashScroll";
import { ContactTabsProvider, ContactTrigger } from "@/components/contact/ContactTabs";
import ContactForm from "@/components/contact/ContactForm";
import RegionalDirectory from "@/components/contact/RegionalDirectory";

/**
 * /contact — one contact experience for all six TNT websites. Built
 * 2026-10-08 from the Contact Us master brief, then cut to two sections the
 * same day, on request ("our main important thing is form"):
 *
 *   1. Hero = the form. Headline + main contact details on the left, the
 *      tabbed Quote / Enquiry form on the right, so the form is above the
 *      fold. This replaced a photo hero, a "How can we help?" cards section
 *      (its Quote / Enquiry cards only switched the form's tabs) and a
 *      separate form section.
 *   2. Regional contact directory (RegionalDirectory.tsx), with a link to
 *      the homepage branch map in place of a duplicate map here.
 *
 * Server component. Client islands: the tab provider, the form, and the
 * "Regional contacts" scroll link. Footer and nav come from the root layout.
 *
 * FORM: pending integration — see submitContact.ts. Nothing is sent yet and
 * the form says so.
 */

export const metadata: Metadata = {
  title: "Contact Us — TNT Crane & Rigging",
  description:
    "Request a quote, send an enquiry, or reach your TNT Crane & Rigging regional team across the United States and Canada.",
};

const DETAILS = [
  {
    icon: Phone,
    label: "Main line (TNT US)",
    value: "1-800-799-2505",
    href: "tel:+18007992505",
    mono: true,
  },
  { icon: Mail, label: "Email", value: "info@tntcrane.com", href: "mailto:info@tntcrane.com", mono: false },
  { icon: MapPin, label: "Headquarters", value: "Houston, Texas", href: null, mono: false },
];

export default function ContactPage() {
  return (
    <ContactTabsProvider>
      <HashScroll />

      {/* 01 — HERO + FORM */}
      {/* -mt-10 below lg: same local fix as /about — --chrome-h reserves
          120px but the nav is only 80px until the lg utility strip shows. */}
      <section
        id="contact-hero"
        aria-labelledby="contact-hero-heading"
        className="-mt-10 scroll-mt-32 bg-white lg:mt-0"
      >
        {/* Three grid children so phones get intro → form → details (the
            form reaches the first screen), while lg+ stacks intro and
            details in the left column beside a full-height form. */}
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 lg:px-8 lg:py-20">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="flex items-center gap-4 font-body text-[13px] font-bold tracking-[0.18em] text-tnt-amber uppercase">
              <span aria-hidden="true" className="h-px w-9 bg-tnt-amber" />
              Contact TNT Crane &amp; Rigging
            </p>
            <h1
              id="contact-hero-heading"
              className="mt-6 font-display text-5xl leading-[1.02] text-black uppercase sm:text-6xl"
            >
              Let&rsquo;s get your project moving.
            </h1>
            <p className="mt-6 font-body text-base leading-relaxed text-tnt-body sm:text-lg">
              From crane rentals and specialized rigging to engineered lifting solutions, our teams
              are ready to support your next project across North America.
            </p>
          </div>

          {/* `#contact-form` kept as the form's own anchor, so deep links to
              /contact#contact-form still land on it. */}
          <div id="contact-form" className="scroll-mt-32 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <h2 className="sr-only">Contact form</h2>
            <ContactForm />
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <dl className="grid gap-5 border-t border-black/10 pt-8 sm:grid-cols-3 lg:mt-8 lg:grid-cols-1">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-tnt-amber">
                    <d.icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div>
                    <dt className="font-body text-[11px] font-semibold tracking-[0.16em] text-tnt-meta uppercase">
                      {d.label}
                    </dt>
                    <dd className="mt-0.5">
                      {d.href ? (
                        <a
                          href={d.href}
                          className={`inline-block py-1 font-semibold whitespace-nowrap text-black hover:text-tnt-maroon ${
                            d.mono ? "font-mono text-base" : "font-body text-sm"
                          }`}
                        >
                          {d.value}
                        </a>
                      ) : (
                        <span className="inline-block py-1 font-body text-sm font-semibold text-black">
                          {d.value}
                        </span>
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="font-body text-[13px] text-tnt-body">
                Southway, RMS, JMS, Eagle West and TNT Canada each have their own lines.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                <ContactTrigger targetId="regional-contacts" variant="link">
                  Regional contacts
                </ContactTrigger>
                <Link
                  href="/#coverage"
                  className="group inline-flex items-center gap-2 rounded-sm font-body text-sm font-semibold text-tnt-amber transition-colors hover:text-tnt-amber-vivid focus-visible:ring-2 focus-visible:ring-tnt-amber focus-visible:outline-none"
                >
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  Find a branch on the map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — REGIONAL CONTACT DIRECTORY */}
      <RegionalDirectory />
    </ContactTabsProvider>
  );
}
