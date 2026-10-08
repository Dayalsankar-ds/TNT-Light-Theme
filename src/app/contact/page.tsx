import type { Metadata } from "next";
import Image from "next/image";
import { ClipboardList, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { Eyebrow } from "@/components/site/primitives";
import HashScroll from "@/components/about/HashScroll";
import { ContactTabsProvider, ContactTrigger, TAB_ID } from "@/components/contact/ContactTabs";
import ContactForm from "@/components/contact/ContactForm";
import LocationFinder from "@/components/contact/LocationFinder";
import RegionalDirectory from "@/components/contact/RegionalDirectory";
import { buildBranchLocator } from "@/components/site/branchLocatorData";

/**
 * /contact — one contact experience for all six TNT websites. Built
 * 2026-10-08 from the Contact Us master brief.
 *
 * Four sections, in the brief's order: hero → "How can we help?" → the
 * tabbed Quote / Enquiry form → map-first location finder with the regional
 * contact directory. Footer and nav come from the root layout, unchanged.
 *
 * Server component. Client islands: the tab provider + CTA triggers, the
 * form, and the location finder (which lazy-loads the homepage's MapLibre
 * map). Branch data is built here on the server from the same dataset the
 * homepage map and chatbot use.
 *
 * Section rhythm: white hero → grey cards → white form → grey locations.
 *
 * HERO IMAGE: /photos/fleet/all-terrain-crane.jpg — real tntcrane.com
 * photography (AT-Crane_TNT-Crane-2; provenance in photos.ts), a TNT
 * all-terrain crane picking in downtown Houston. Chosen 2026-10-08.
 *
 * FORM: pending integration — see submitContact.ts. Nothing is sent yet and
 * the form says so.
 */

export const metadata: Metadata = {
  title: "Contact Us — TNT Crane & Rigging",
  description:
    "Request a quote, send an enquiry, or find your nearest TNT Crane & Rigging location and regional team across the United States and Canada.",
};

const HELP_CARDS = [
  {
    no: "01",
    icon: ClipboardList,
    title: "Request a Quote",
    body: "Planning a crane rental, lift, rigging, or industrial project?",
    cta: "Get a Quote",
    target: "contact-form",
    tab: "quote" as const,
  },
  {
    no: "02",
    icon: MessageSquare,
    title: "General Enquiries",
    body: "Questions about our services, equipment, or existing projects?",
    cta: "Send an Enquiry",
    target: "contact-form",
    tab: "enquiry" as const,
  },
  {
    no: "03",
    icon: MapPin,
    title: "Find a Location",
    body: "Connect directly with the nearest TNT regional operating team.",
    cta: "Find a Branch",
    target: "find-a-location",
    tab: undefined,
  },
];

export default function ContactPage() {
  const { branches } = buildBranchLocator();

  return (
    <ContactTabsProvider>
      <HashScroll />

      {/* 01 — HERO */}
      {/* -mt-10 below lg: same local fix as /about — --chrome-h reserves
          120px but the nav is only 80px until the lg utility strip shows. */}
      <section id="contact-hero" aria-labelledby="contact-hero-heading" className="-mt-10 scroll-mt-32 bg-white lg:mt-0">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <p className="flex items-center gap-4 font-body text-[13px] font-bold tracking-[0.18em] text-tnt-amber uppercase">
              <span aria-hidden="true" className="h-px w-9 bg-tnt-amber" />
              Contact TNT Crane &amp; Rigging
            </p>
            <h1
              id="contact-hero-heading"
              className="mt-6 font-display text-5xl leading-[1.02] text-black uppercase sm:text-6xl xl:text-7xl"
            >
              Let&rsquo;s get your project moving.
            </h1>
            <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-tnt-body sm:text-lg">
              From crane rentals and specialized rigging to engineered lifting solutions, our teams
              are ready to support your next project across North America.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ContactTrigger targetId="contact-form" tab="quote">
                Request a Quote
              </ContactTrigger>
              <ContactTrigger targetId="find-a-location" focusId="loc-search" variant="secondary">
                Find a Location
              </ContactTrigger>
            </div>

            <dl className="mt-10 grid gap-6 border-t border-black/10 pt-8 sm:grid-cols-2 xl:grid-cols-3">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-tnt-amber">
                  <Phone aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <dt className="font-body text-[11px] font-semibold tracking-[0.16em] text-tnt-meta uppercase">
                    Main line (TNT US)
                  </dt>
                  <dd className="mt-0.5">
                    <a href="tel:+18007992505" className="inline-block py-1 font-mono text-base font-semibold whitespace-nowrap text-black hover:text-tnt-maroon">
                      1-800-799-2505
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-tnt-amber">
                  <Mail aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <dt className="font-body text-[11px] font-semibold tracking-[0.16em] text-tnt-meta uppercase">
                    Email
                  </dt>
                  <dd className="mt-0.5">
                    <a href="mailto:info@tntcrane.com" className="inline-block py-1 font-body text-sm font-semibold whitespace-nowrap text-black hover:text-tnt-maroon">
                      info@tntcrane.com
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-tnt-amber">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <dt className="font-body text-[11px] font-semibold tracking-[0.16em] text-tnt-meta uppercase">
                    Headquarters
                  </dt>
                  <dd className="mt-0.5 font-body text-sm font-semibold text-black">Houston, Texas</dd>
                </div>
              </div>
            </dl>
            <p className="mt-5 font-body text-[13px] text-tnt-body">
              Southway, RMS, JMS, Eagle West and TNT Canada each have their own lines.{" "}
              <ContactTrigger targetId="regional-contacts" variant="link">
                Regional contacts
              </ContactTrigger>
            </p>
          </div>

          <div className="relative h-[22rem] overflow-hidden rounded-2xl bg-tnt-paper sm:h-[28rem] lg:h-[36rem]">
            <Image
              src="/photos/fleet/all-terrain-crane.jpg"
              alt="TNT Crane & Rigging all-terrain crane, boom fully extended, lifting between high-rise towers on a closed downtown Houston street"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
        </div>
      </section>

      {/* 02 — HOW CAN WE HELP? */}
      <section id="how-can-we-help" aria-labelledby="help-heading" className="scroll-mt-32 bg-tnt-gray">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow>Get in Touch</Eyebrow>
            <h2 id="help-heading" className="mt-3 font-display text-4xl tracking-wide text-black uppercase sm:text-5xl">
              How can we help you?
            </h2>
            <p className="mt-4 font-body text-base text-tnt-body sm:text-lg">
              Choose the option that best matches your needs, and we&rsquo;ll help you take the next step.
            </p>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-3 lg:gap-6">
            {HELP_CARDS.map((c) => (
              <li
                key={c.no}
                className="flex flex-col rounded-2xl border border-black/10 bg-white p-6 transition-colors hover:border-black/25 lg:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-black text-tnt-amber">
                    <c.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span aria-hidden="true" className="font-mono text-xs text-black/35">
                    {c.no}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl tracking-wide text-black uppercase">{c.title}</h3>
                <p className="mt-2 mb-8 font-body text-[15px] leading-relaxed text-tnt-body">{c.body}</p>
                <div className="mt-auto">
                  <ContactTrigger
                    targetId={c.target}
                    tab={c.tab}
                    focusId={c.tab ? TAB_ID[c.tab] : "loc-search"}
                    variant="secondary"
                  >
                    {c.cta}
                  </ContactTrigger>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 — CONTACT & QUOTE FORM */}
      <section id="contact-form" aria-labelledby="form-heading" className="scroll-mt-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-[calc(var(--chrome-h)+2rem)] lg:self-start">
              <Eyebrow>Start a Conversation</Eyebrow>
              <h2 id="form-heading" className="mt-3 font-display text-4xl tracking-wide text-black uppercase sm:text-5xl">
                Tell us how we can help.
              </h2>
              <p className="mt-4 font-body text-base text-tnt-body sm:text-lg">
                Share your project requirements or general enquiry, and we&rsquo;ll help connect you
                with the appropriate team.
              </p>
              <div className="mt-8 border-t border-black/10 pt-6">
                <p className="font-body text-[11px] font-semibold tracking-[0.16em] text-tnt-meta uppercase">
                  Prefer to talk?
                </p>
                <p className="mt-2 font-body text-sm text-tnt-body">
                  Call the TNT US main line at{" "}
                  <a href="tel:+18007992505" className="font-mono font-semibold whitespace-nowrap text-black hover:text-tnt-maroon">
                    1-800-799-2505
                  </a>
                  , or reach your region&rsquo;s team directly.
                </p>
                <div className="mt-3">
                  <ContactTrigger targetId="regional-contacts" variant="link">
                    Regional contacts
                  </ContactTrigger>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 04 — FIND A LOCATION + REGIONAL DIRECTORY */}
      <section id="find-a-location" aria-labelledby="locations-heading" className="scroll-mt-32 bg-tnt-gray">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow>Our Locations</Eyebrow>
            <h2 id="locations-heading" className="mt-3 font-display text-4xl tracking-wide text-black uppercase sm:text-5xl">
              Local expertise.
              <br />
              North American reach.
            </h2>
            <p className="mt-4 font-body text-base text-tnt-body sm:text-lg">
              Find TNT Crane &amp; Rigging locations and regional operating companies across the
              United States and Canada.
            </p>
          </div>
          <div className="mt-10">
            <LocationFinder branches={branches} />
          </div>
          <RegionalDirectory />
        </div>
      </section>
    </ContactTabsProvider>
  );
}
