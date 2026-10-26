"use client";

/**
 * REQUEST A QUOTE — the primary conversion action (was entirely missing).
 *
 * Enerblock "tell us about your project" band, in our design system. Front-end
 * only: on submit it shows a success state — there is NO backend yet, so wire
 * the handler to a real endpoint/email service before launch. Services are
 * multi-select chips (reusing the Coverage filter-pill treatment).
 *
 * LIGHT-MODE SHELL IS `bg-tnt-gray` (2026-09-26, on request — same "add grey
 * bg" ask SafetyCulture.tsx got, for the same reason: this section sat right
 * after ContactSection, both `bg-white`, so they ran together with no
 * visible seam. `tnt-gray` (#eeeeee) is globals.css's own token for exactly
 * this — "alternating section backgrounds". The form/success card underneath
 * stays `bg-white` — it now reads as a card floating on the grey band rather
 * than blending into it, same pattern the floating map cards use.
 *
 * REQUIRED FIELDS (2026-09-29, from the desktop comparison review against
 * maximcrane.com): name, email, phone, jobsite ZIP and crane type are
 * required and marked with an asterisk, keyed by a "* Required" note at the
 * top of the form. Phone moved from optional to required — sales calls back.
 * Jobsite ZIP and crane type were added so a rep can route the lead to a
 * branch and a fleet class without a follow-up question. Load and radius are
 * their own optional fields (they used to live only in the description
 * placeholder) — a visitor who knows them saves a call; one who doesn't
 * shouldn't be blocked.
 *
 * FIELDS MATCH THE LIVE SITE (2026-10-26, on request — "bring the same
 * content... no need to show any unnecessary information"): the form now asks
 * exactly what tntcrane.com/contact's "Contact TNT" form asks, in its order:
 * Name, Email, Phone, Company/Organization, Project Name, Project Location
 * (all required); Services Required (optional, the live site's five); Start
 * Date and Estimated Duration (required); File Upload (optional,
 * image/video/audio like the live form); job details (required); and the live
 * SMS-consent wording. Dropped: jobsite ZIP, crane type, load and radius. The
 * CRANE_TYPES / POSTAL_PATTERN / field-style exports stay — /contact's
 * ContactForm still imports them.
 */

import { useState, type FormEvent } from "react";
import { Eyebrow } from "./primitives";
import Button from "./Button";
import RevealText from "./RevealText";

// Exactly the live tntcrane.com form's "Services Required" options, in its
// order (not services.ts's six-item catalog).
const SERVICES = [
  "Crane Rental",
  "Specialized Rigging",
  "Machinery Moving",
  "Industrial Storage",
  "Engineering",
];

// The six classes in the nav's Load Chart menu, so the form and the fleet
// speak the same taxonomy. "Not sure" is a real answer — a rep will recommend.
// Exported (with `field`, `label`, `Req`, `Opt` below) for /contact's
// ContactForm, so both forms share one field style and one crane taxonomy
// (2026-10-08). Export keywords only — nothing here renders differently.
export const CRANE_TYPES = [
  "All-Terrain Crane",
  "Crawler Crane",
  "Hydraulic Truck Crane",
  "Rough-Terrain Crane",
  "Carry Deck Crane",
  "Tower Crane",
  "Not sure — recommend one",
];

// US ZIP (12345 or 12345-6789) or Canadian postal code (A1A 1A1) — TNT
// Canada and Eagle West quote Canadian jobsites.
export const POSTAL_PATTERN = "\\d{5}(-\\d{4})?|[A-Za-z]\\d[A-Za-z] ?\\d[A-Za-z]\\d";

export const field =
  "w-full rounded-md border border-black/15 bg-white px-4 py-3 font-body text-sm text-black placeholder:text-tnt-meta focus:border-tnt-amber focus:ring-1 focus:ring-tnt-amber focus:outline-none";
export const label =
  "block font-body text-[11px] font-semibold tracking-[0.16em] text-tnt-meta uppercase";

/** Visual required marker. aria-hidden: the input's own `required` is what
 *  assistive tech announces, so the star would only be read as "star". */
export function Req() {
  return (
    <span aria-hidden="true" className="ml-1 text-tnt-maroon">
      *
    </span>
  );
}

/** Quiet "optional" tag for the fields a visitor may reasonably not know. */
export function Opt() {
  return (
    <span className="ml-1 font-normal tracking-normal normal-case">(optional)</span>
  );
}

// LARGER TYPE ON THIS FORM ONLY (2026-10-26, on request — "it seems small"):
// labels 11→13px, typed text 14→16px (also stops iOS zooming into a field
// under 16px), boxes a touch taller. The shared `field` / `label` exports
// above stay as they are for /contact's ContactForm.
const qField = field.replace("px-4 py-3", "px-4 py-3.5").replace("text-sm", "text-base");
const qLabel = label.replace("text-[11px]", "text-[13px]");

export default function RequestQuote() {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (s: string) =>
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: POST to a real endpoint / email service.
    setSubmitted(true);
  };

  return (
    <section id="quote" className="scroll-mt-32 bg-[#f7f7f7]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          {/* Left — statement */}
          <div className="lg:sticky lg:top-[var(--chrome-h)] lg:self-start">
            <Eyebrow>Request a Quote</Eyebrow>
            <RevealText
              as="h2"
              text="Request a Job Quote"
              className="mt-3 font-display text-4xl tracking-wide text-black uppercase sm:text-5xl"
            />
            <p className="mt-4 font-body text-base text-tnt-body sm:text-lg">
              Tell us about the lift and a TNT rep will follow up with capacity,
              availability, and pricing. Prefer to talk it through?
            </p>
            <p className="mt-2 font-body text-sm text-tnt-navy">
              Call 1-800-799-2505 — 24/7.
            </p>
          </div>

          {/* Right — form */}
          {submitted ? (
            <div className="flex flex-col items-start justify-center rounded-2xl border border-black/10 bg-white p-8 sm:p-12">
              <span className="font-display text-3xl tracking-wide text-tnt-navy uppercase sm:text-4xl">
                Request received
              </span>
              <p className="mt-3 max-w-md font-body text-base text-tnt-body">
                Thanks — a TNT Sales Representative will be in touch shortly. For
                anything urgent, call{" "}
                <a href="tel:+18007992505" className="font-semibold text-tnt-amber">
                  1-800-799-2505
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8"
            >
              <p className="mb-5 font-body text-sm text-tnt-body">
                <span aria-hidden="true" className="text-tnt-maroon">*</span>{" "}
                Required field
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="q-name" className={qLabel}>
                    Name<Req />
                  </label>
                  <input id="q-name" name="name" required autoComplete="name" className={`mt-2 ${qField}`} />
                </div>
                <div>
                  <label htmlFor="q-email" className={qLabel}>
                    Email<Req />
                  </label>
                  <input id="q-email" name="email" type="email" required autoComplete="email" className={`mt-2 ${qField}`} />
                </div>
                <div>
                  <label htmlFor="q-phone" className={qLabel}>
                    Phone<Req />
                  </label>
                  <input id="q-phone" name="phone" type="tel" required autoComplete="tel" className={`mt-2 ${qField}`} />
                </div>
                <div>
                  <label htmlFor="q-company" className={qLabel}>
                    Company/Organization<Req />
                  </label>
                  <input id="q-company" name="company" required autoComplete="organization" className={`mt-2 ${qField}`} />
                </div>
                <div>
                  <label htmlFor="q-project" className={qLabel}>
                    Project name<Req />
                  </label>
                  <input id="q-project" name="projectName" required className={`mt-2 ${qField}`} />
                </div>
                <div>
                  <label htmlFor="q-location" className={qLabel}>
                    Project location<Req />
                  </label>
                  <input id="q-location" name="projectLocation" required className={`mt-2 ${qField}`} />
                </div>
              </div>

              {/* Services — multi-select chips */}
              <fieldset className="mt-6">
                <legend className={qLabel}>Services required</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SERVICES.map((s) => {
                    const on = selected.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggle(s)}
                        aria-pressed={on}
                        className={`rounded-full border px-4 py-2 font-body text-[15px] font-semibold transition-colors ${
                          on
                            ? "border-tnt-amber bg-tnt-amber text-black"
                            : "border-black/15 text-tnt-body hover:border-black/40 hover:text-black"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="q-start" className={qLabel}>
                    Start date<Req />
                  </label>
                  <input id="q-start" name="start" type="date" required className={`mt-2 ${qField}`} />
                </div>
                <div>
                  <label htmlFor="q-duration" className={qLabel}>
                    Estimated duration<Req />
                  </label>
                  <input id="q-duration" name="duration" required className={`mt-2 ${qField}`} />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="q-file" className={qLabel}>
                  File upload<Opt />
                </label>
                <input
                  id="q-file"
                  name="file"
                  type="file"
                  accept="audio/*,video/*,image/*"
                  className="mt-2 block w-full font-body text-base text-tnt-body file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-tnt-navy"
                />
              </div>

              <div className="mt-6">
                <label htmlFor="q-desc" className={qLabel}>
                  Job details<Req />
                </label>
                <textarea
                  id="q-desc"
                  name="description"
                  rows={4}
                  required
                  placeholder="Please include as many job details as possible"
                  className={`mt-2 ${qField} resize-y`}
                />
              </div>

              <label className="mt-6 flex items-start gap-3 font-body text-sm leading-relaxed text-tnt-body">
                <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-tnt-amber" />
                <span>
                  By checking this box, I agree to receive conversational text
                  messages from TNT Crane and Rigging related services. Reply STOP
                  to opt-out at any time. For assistance, text HELP. Message and
                  data rates may apply. Message frequency varies. Please view our
                  Privacy Policy and Terms &amp; Conditions for more information.
                </span>
              </label>

              <div className="mt-8">
                <Button type="submit" variant="primary" className="text-base!">
                  Contact TNT
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
