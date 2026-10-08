/**
 * REGIONAL CONTACT DIRECTORY — a compact list of each operating company's
 * published lines, directly under the location finder. Deliberately not a
 * second Family of Companies showcase: no logos, no stories, just who to
 * call. Server component; data from regionalContacts.ts.
 */

import { Mail, Phone } from "lucide-react";
import { REGIONAL_CONTACTS, type RegionalContact } from "@/components/site/regionalContacts";

const COUNTRIES = [
  { id: "US", label: "United States" },
  { id: "CA", label: "Canada" },
] as const;

function Row({ c }: { c: RegionalContact }) {
  return (
    <li className="grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:gap-6">
      <div>
        <h4 className="font-display text-lg tracking-wide text-black uppercase">{c.brand}</h4>
        <p className="mt-0.5 font-body text-[13px] text-tnt-body">{c.territory}</p>
        <a
          href={c.website.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block font-body text-xs text-tnt-meta underline-offset-2 hover:text-black hover:underline"
        >
          {c.website.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
      <div className="space-y-1.5">
        {c.phones.map((p) => (
          <a
            key={p.display}
            href={p.href}
            className="flex flex-wrap items-baseline gap-x-2 font-mono text-[15px] font-semibold text-black transition-colors hover:text-tnt-maroon"
          >
            <Phone aria-hidden="true" className="h-3.5 w-3.5 translate-y-0.5 text-tnt-amber" />
            {p.display}
            {p.label && <span className="font-body text-xs font-normal text-tnt-meta">{p.label}</span>}
          </a>
        ))}
        {c.email ? (
          <a
            href={`mailto:${c.email}`}
            className="flex items-center gap-2 font-body text-sm break-all text-black/80 transition-colors hover:text-tnt-maroon"
          >
            <Mail aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-tnt-amber" />
            {c.email}
          </a>
        ) : (
          <p className="flex items-center gap-2 font-body text-sm text-tnt-meta">
            <Mail aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-black/30" />
            Email not publicly listed
          </p>
        )}
      </div>
    </li>
  );
}

export default function RegionalDirectory() {
  return (
    <div id="regional-contacts" className="mt-16 scroll-mt-32">
      <h3 className="font-display text-3xl tracking-wide text-black uppercase sm:text-4xl">
        Regional contact directory
      </h3>
      <p className="mt-3 max-w-2xl font-body text-base text-tnt-body">
        Each operating company keeps its own published lines. Call the team that covers your
        project&rsquo;s region.
      </p>
      <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-2">
        {COUNTRIES.map((country) => (
          <div key={country.id}>
            <p className="border-b border-black/15 pb-3 font-body text-[13px] font-bold tracking-[0.18em] text-tnt-amber uppercase">
              {country.label}
            </p>
            <ul className="divide-y divide-black/10">
              {REGIONAL_CONTACTS.filter((c) => c.country === country.id).map((c) => (
                <Row key={c.brand} c={c} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
