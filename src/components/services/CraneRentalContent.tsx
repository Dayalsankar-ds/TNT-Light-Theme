/**
 * CRANE RENTAL — the body of /services/crane-rental (everything above the
 * quote section, which the page itself owns).
 *
 * History: built 2026-10-09 as a hash-switched "focus view" of /services
 * (/services#crane-rental showed only this, hiding the overview). Moved to a
 * real route the same day, on request, after the Maxim Crane comparison:
 * search engines ignore #fragments, so the view couldn't rank or carry its
 * own title. Old /services#crane-rental links redirect here (see
 * services/HashRedirect.tsx).
 *
 * Every fact comes from the existing sources, nothing new is claimed:
 *   - description, crane types, rental options, scope → servicesPageData.ts
 *   - who offers it, per company, with notes          → services.ts
 *   - wind / tower / rail crane work and providers     → servicesPageData.ts
 *
 * Server component apart from the ScrollButton island.
 */

import Image from "next/image";
import Button from "@/components/site/Button";
import { Eyebrow, Heading, Icon } from "@/components/site/primitives";
import ScrollButton from "@/components/about/ScrollButton";
import {
  COMPANIES,
  CONFIRM_FALLBACK,
  availability,
  serviceById,
  serviceHref,
} from "@/components/site/services";
import StatusBadge from "./AvailabilityBadge";
import CraneTypeGrid from "./CraneTypeGrid";
import { CRANE_TYPES, SERVICE_DETAILS, SPECIALIZED } from "./servicesPageData";

const SERVICE = serviceById("crane-rental");
const DETAIL = SERVICE_DETAILS["crane-rental"];

/** Crane types listed for the service but without a card in the grid. */
const MORE_TYPES = DETAIL.items.filter((t) => !CRANE_TYPES.some((c) => c.name === t));

const RENTAL_OPTIONS = [
  {
    title: "Operated crane rental",
    body: "The crane comes with an operator from the TNT team running it on your site.",
  },
  {
    title: "Bare crane rental, where available",
    body: "The crane only, for your own qualified crew. JMS Crane & Rigging lists bare rental directly; confirm availability for other locations and crane types.",
  },
];

const CRANE_SPECIALTIES = SPECIALIZED.filter((s) =>
  ["wind-energy", "tower-cranes", "rail-crane-services"].includes(s.id),
);

const RELATED = (["lift-planning-engineering", "specialized-rigging"] as const).map(serviceById);

export default function CraneRentalContent() {
  return (
    <>
      {/* A — INTRO */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:px-8">
          <div>
            <Eyebrow>Core Service {SERVICE.index}</Eyebrow>
            <Heading as="h1" className="mt-4 text-6xl leading-[0.95] sm:text-7xl">
              {SERVICE.label}
            </Heading>
            <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-black/70">{DETAIL.description}</p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {RENTAL_OPTIONS.map((o) => (
                <li key={o.title} className="border-t-2 border-black pt-4">
                  <h3 className="font-display text-xl tracking-wide text-black uppercase">{o.title}</h3>
                  <p className="mt-2 font-body text-[15px] leading-relaxed text-black/60">{o.body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              {/* The quote form is on this page now (#quote). */}
              <ScrollButton targetId="quote">Request a Crane Rental Quote</ScrollButton>
              <Button href="/#coverage" variant="secondary">
                Find a Branch
              </Button>
            </div>
          </div>
          {DETAIL.photo && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black">
              <Image
                src={DETAIL.photo.src}
                alt={DETAIL.photo.alt}
                fill
                loading="eager"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* B — CRANE TYPES */}
      <section aria-labelledby="crane-focus-types" className="bg-[#f7f7f7]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-2xl">
              <Eyebrow>Crane Types</Eyebrow>
              <h2 id="crane-focus-types" className="mt-4 font-display text-5xl leading-[0.95] tracking-wide text-black uppercase sm:text-6xl">
                Find the right crane
                <br />
                for your project
              </h2>
              <p className="mt-6 font-body text-lg leading-relaxed text-black/70">{DETAIL.scope}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button href="/#fleet-guide" variant="primary">
                Explore the Fleet
              </Button>
              <Button href="/load-chart/all-terrain-cranes" variant="secondary">
                Search Load Charts
              </Button>
            </div>
          </div>

          <CraneTypeGrid tone="light" />

          <div className="mt-10 border-t border-black/10 pt-8">
            <h3 className="font-body text-[11px] font-semibold tracking-[0.16em] text-tnt-meta uppercase">
              Also across the network
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {MORE_TYPES.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-black/10 bg-white px-3 py-1.5 font-body text-[13px] text-black/75"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* C — WHO OFFERS IT */}
      <section aria-labelledby="crane-focus-companies" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-20">
            <div>
              <Eyebrow>TNT Family of Companies</Eyebrow>
              <Heading className="mt-4 text-5xl leading-[0.95] sm:text-6xl">
                <span id="crane-focus-companies">
                  Crane rental
                  <br />
                  across the family
                </span>
              </Heading>
            </div>
            <p className="font-body text-lg leading-relaxed text-black/70">
              Who offers crane rental, and what each company lists. Where a company&rsquo;s own
              services don&rsquo;t say, ask our team. {CONFIRM_FALLBACK}
            </p>
          </div>

          <ul className="mt-12 divide-y divide-black/10 rounded-xl border border-black/10">
            {COMPANIES.map((c) => {
              const cell = availability(c.id, "crane-rental");
              return (
                <li
                  key={c.id}
                  className="grid gap-3 px-6 py-5 sm:px-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] md:items-center md:gap-8"
                >
                  <div>
                    <h3 className="font-display text-xl tracking-wide text-black uppercase">{c.name}</h3>
                    <p className="mt-0.5 font-body text-[13px] text-black/50">
                      {c.country === "CA" ? "Canada" : "United States"} · {c.territory}
                    </p>
                  </div>
                  {/* Empty note keeps the md+ column; on phones it would only
                      leave a gap, so it's hidden there. */}
                  <p className={`font-body text-[14px] text-black/65 ${cell.note ? "" : "hidden md:block"}`}>
                    {cell.note ?? " "}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    <StatusBadge status={cell.status} />
                    <a
                      href="/contact#regional-contacts"
                      className="font-body text-[13px] font-semibold whitespace-nowrap text-tnt-amber hover:text-black focus-visible:ring-2 focus-visible:ring-tnt-amber focus-visible:outline-none"
                    >
                      Contact {c.short}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* D — SPECIALIZED CRANE WORK */}
      <section aria-labelledby="crane-focus-special" className="bg-[#f5f4f0]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow>Specialized Crane Work</Eyebrow>
            <Heading className="mt-4 text-5xl leading-[0.95] sm:text-6xl">
              <span id="crane-focus-special">Regional specialties</span>
            </Heading>
            <p className="mt-6 font-body text-lg leading-relaxed text-black/70">
              Crane work offered by specific companies in the family, not at every location.
            </p>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {CRANE_SPECIALTIES.map((c) => (
              <li key={c.id}>
                <article className="flex h-full flex-col rounded-xl border border-black/10 bg-white p-6 transition-colors duration-300 hover:border-tnt-amber">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-tnt-amber/50 bg-tnt-amber/10 px-3 py-1 font-body text-[11px] font-semibold text-black">
                    <Icon name="pin" className="h-3.5 w-3.5 text-tnt-amber" />
                    {c.provider}
                  </span>
                  <h3 className="mt-5 font-display text-2xl tracking-wide text-black uppercase">{c.title}</h3>
                  <ul className="mt-3 flex-1 space-y-1.5">
                    {c.items.map((i) => (
                      <li key={i} className="flex items-start gap-2 font-body text-[14px] text-black/65">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-tnt-amber" />
                        {i}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button href={c.link.href} variant="link">
                      {c.link.label}
                    </Button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* E — OFTEN PAIRED WITH */}
      <section aria-labelledby="crane-focus-related" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Eyebrow>Related Services</Eyebrow>
          <Heading className="mt-4 text-4xl leading-[0.95] sm:text-5xl">
            <span id="crane-focus-related">Often paired with crane rental</span>
          </Heading>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {RELATED.map((s) => (
              <li key={s.id}>
                <a
                  href={serviceHref(s)}
                  className="group flex h-full items-start gap-5 rounded-xl border border-black/10 bg-black/[0.03] p-6 transition-colors duration-300 hover:border-tnt-amber focus-visible:ring-2 focus-visible:ring-tnt-amber focus-visible:outline-none"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-tnt-amber/10 text-tnt-amber">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block font-display text-2xl tracking-wide text-black uppercase">{s.label}</span>
                    <span className="mt-2 block font-body text-[15px] leading-relaxed text-black/60">{s.short}</span>
                    <span className="mt-4 inline-flex items-center gap-2 font-body text-sm font-semibold text-black group-hover:text-tnt-amber">
                      Learn more
                      <Icon name="arrow" className="h-4 w-4 text-tnt-amber transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
