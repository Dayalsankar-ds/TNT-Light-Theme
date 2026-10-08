"use client";

/**
 * LOCATION FINDER — /contact's map-first branch finder.
 *
 * Reuses the homepage's MapLibre map (BranchMap, mapcn-map-route.tsx) and
 * the same server-built branch dataset (branchLocatorData.ts) — no second
 * map implementation and no second dataset. What's new is the panel: a
 * company filter, a state/province filter, and a branch card that shows
 * ONLY verified fields:
 *   - street address + directions only where an address is on file (no
 *     coordinate-guessed directions for branches without one);
 *   - the phone labelled for what it is — a branch line, or the operating
 *     company's regional line (phone.source);
 *   - no hours (none verified) and no per-branch service list (navigation.ts
 *     marks that mapping as editorial placeholder, so it isn't repeated here).
 *
 * Layout: panel first in the DOM, so on phones search + results come before
 * the map; from `lg` the map moves left (~65%) and the panel sits right
 * (~35%). The results list is the accessible equivalent of the map — every
 * branch on the map is reachable from it.
 */

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { Building2, Mail, MapPin, Navigation, Phone, Search } from "lucide-react";
import type { Branch } from "@/components/site/branchLocatorData";
import { REGIONAL_CONTACTS, contactFor } from "@/components/site/regionalContacts";

const BranchMap = dynamic(() => import("@/components/ui/mapcn-map-route").then((m) => m.BranchMap), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[22rem] w-full animate-pulse rounded-2xl border border-black/10 bg-[#E9ECED]" />
  ),
});

const selectCls =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2.5 font-body text-sm text-black focus:border-tnt-amber focus:ring-1 focus:ring-tnt-amber focus:outline-none";
const filterLabel = "block font-body text-[11px] font-semibold tracking-[0.16em] text-tnt-meta uppercase";

/** "Austin, TX" → "TX". */
const abbr = (b: Branch) => b.city.split(",").pop()?.trim() ?? "";
/** "Austin, TX" → "Austin". */
const cityName = (b: Branch) => b.city.split(",")[0];

function directionsHref(b: Branch): string | null {
  if (!b.address) return null;
  const dest = `${b.address.street}, ${b.city} ${b.address.zip}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}

export default function LocationFinder({ branches }: { branches: Branch[] }) {
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("all");
  const [region, setRegion] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // States/provinces on offer follow the company filter, grouped by country.
  const regionOptions = useMemo(() => {
    const scope = branches.filter((b) => company === "all" || b.brand === company);
    const group = (c: "US" | "CA") =>
      [...new Set(scope.filter((b) => b.country === c).map((b) => b.state))].sort();
    return { US: group("US"), CA: group("CA") };
  }, [branches, company]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return branches.filter((b) => {
      if (company !== "all" && b.brand !== company) return false;
      if (region !== "all" && b.state !== region) return false;
      if (!q) return true;
      return (
        b.city.toLowerCase().includes(q) ||
        b.state.toLowerCase().includes(q) ||
        abbr(b).toLowerCase() === q ||
        b.region.toLowerCase().includes(q) ||
        b.brand.toLowerCase().includes(q) ||
        (b.address?.zip.startsWith(q) ?? false)
      );
    });
  }, [branches, query, company, region]);

  const visibleIds = useMemo(() => new Set(filtered.map((b) => b.id)), [filtered]);

  // Keep the selection honest: a branch the filters exclude can't stay
  // selected, and a filter that narrows to one branch selects it. Derived
  // during render rather than synced in an effect.
  const effectiveId =
    filtered.length === 1
      ? filtered[0].id
      : selectedId && visibleIds.has(selectedId)
        ? selectedId
        : null;
  const selected = branches.find((b) => b.id === effectiveId) ?? null;

  const onSelect = useCallback((id: string) => setSelectedId(id), []);
  const onHover = useCallback((id: string | null) => setHoveredId(id), []);

  const changeCompany = (next: string) => {
    setCompany(next);
    // Drop a state filter the new company doesn't operate in.
    if (next !== "all" && region !== "all" && !branches.some((b) => b.brand === next && b.state === region)) {
      setRegion("all");
    }
  };

  const reset = () => {
    setQuery("");
    setCompany("all");
    setRegion("all");
    setSelectedId(null);
  };
  const filtering = query !== "" || company !== "all" || region !== "all";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:gap-8">
      {/* ── Panel: search, filters, results, branch card ─────────────── */}
      <div className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1 lg:h-[46rem]">
        <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
          <label htmlFor="loc-search" className={filterLabel}>
            Search locations
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-md border border-black/15 bg-white px-3 py-2.5 focus-within:border-tnt-amber focus-within:ring-1 focus-within:ring-tnt-amber">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-black/50" />
            <input
              id="loc-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="City, state/province, or ZIP"
              aria-describedby="loc-search-hint"
              className="w-full bg-transparent font-body text-sm text-black placeholder:text-black/40 focus:outline-none"
            />
          </div>
          <p id="loc-search-hint" className="mt-1.5 font-body text-xs text-tnt-meta">
            ZIP search covers branches with a published street address.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div>
              <label htmlFor="loc-company" className={filterLabel}>
                Operating company
              </label>
              <select
                id="loc-company"
                value={company}
                onChange={(e) => changeCompany(e.target.value)}
                className={`mt-2 ${selectCls}`}
              >
                <option value="all">All companies</option>
                {REGIONAL_CONTACTS.map((c) => (
                  <option key={c.brand} value={c.brand}>
                    {c.brand}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="loc-region" className={filterLabel}>
                State / Province
              </label>
              <select
                id="loc-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={`mt-2 ${selectCls}`}
              >
                <option value="all">All locations</option>
                {regionOptions.US.length > 0 && (
                  <optgroup label="United States">
                    {regionOptions.US.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </optgroup>
                )}
                {regionOptions.CA.length > 0 && (
                  <optgroup label="Canada">
                    {regionOptions.CA.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p aria-live="polite" className="font-body text-[13px] text-tnt-body">
              {filtered.length === 1 ? "1 location" : `${filtered.length} locations`}
            </p>
            {filtering && (
              <button
                type="button"
                onClick={reset}
                className="rounded-sm font-body text-[13px] font-semibold text-black underline decoration-tnt-amber decoration-2 underline-offset-2 hover:text-tnt-maroon focus-visible:ring-2 focus-visible:ring-tnt-amber focus-visible:outline-none"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results — the accessible list equivalent of the map. */}
        <ul
          data-lenis-prevent
          aria-label="Matching locations"
          className="max-h-72 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain rounded-2xl border border-black/10 bg-white p-2 lg:max-h-none"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-3 font-body text-sm text-tnt-body">
              No locations match. Try a city or state name, or clear the filters.
            </li>
          )}
          {filtered.map((b) => {
            const on = b.id === effectiveId;
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(b.id)}
                  onMouseEnter={() => setHoveredId(b.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  aria-pressed={on}
                  className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-tnt-amber focus-visible:outline-none ${
                    on ? "bg-tnt-amber/20" : "hover:bg-black/[0.04]"
                  }`}
                >
                  <Building2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-tnt-amber" />
                  <span className="min-w-0">
                    <span className="block font-body text-sm font-semibold text-black">
                      {cityName(b)}, {b.state}
                    </span>
                    <span className="block truncate font-body text-xs text-tnt-meta">{b.brand}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <BranchCard branch={selected} />
      </div>

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <div className="h-[22rem] sm:h-[28rem] lg:col-start-1 lg:row-start-1 lg:h-[46rem]">
        <BranchMap
          branches={branches}
          visibleIds={visibleIds}
          selectedId={effectiveId}
          hoveredId={hoveredId}
          onSelect={onSelect}
          onHover={onHover}
          padding={48}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

function BranchCard({ branch: b }: { branch: Branch | null }) {
  if (!b) {
    return (
      <div className="rounded-2xl border border-dashed border-black/20 bg-white p-5">
        <p className="font-body text-sm text-tnt-body">
          Select a location on the map or from the list to see its contact details.
        </p>
      </div>
    );
  }
  const contact = contactFor(b.brand);
  const directions = directionsHref(b);
  const regional = b.phone.source === "regional";
  const phoneLabel = regional
    ? (contact?.phones.find((p) => p.display === b.phone.display)?.label ?? b.brand) + " regional line"
    : "Branch line";

  return (
    <section
      aria-label={`${cityName(b)} location details`}
      className="rounded-2xl border border-black/10 bg-white p-5"
    >
      <p className="font-body text-[11px] font-bold tracking-[0.18em] text-tnt-amber uppercase">{b.region}</p>
      <h3 className="mt-1 font-display text-2xl tracking-wide text-black uppercase">
        {cityName(b)}, {abbr(b)}
      </h3>
      <p className="mt-1 font-body text-[13px] font-semibold text-black/70">Operated by {b.brand}</p>

      <dl className="mt-4 space-y-3 font-body text-sm">
        {b.address && (
          <div className="flex items-start gap-2.5">
            <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-tnt-amber" />
            <div>
              <dt className="sr-only">Address</dt>
              <dd className="text-black/80">
                {b.address.street}
                <br />
                {cityName(b)}, {abbr(b)} {b.address.zip}
              </dd>
            </div>
          </div>
        )}
        <div className="flex items-start gap-2.5">
          <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-tnt-amber" />
          <div>
            <dt className="font-body text-[11px] font-semibold tracking-[0.12em] text-tnt-meta uppercase">
              {phoneLabel}
            </dt>
            <dd>
              <a href={b.phone.href} className="font-mono text-base font-semibold text-black hover:text-tnt-maroon">
                {b.phone.display}
              </a>
            </dd>
          </div>
        </div>
        {contact?.email && (
          <div className="flex items-start gap-2.5">
            <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-tnt-amber" />
            <div>
              <dt className="font-body text-[11px] font-semibold tracking-[0.12em] text-tnt-meta uppercase">
                Company email
              </dt>
              <dd>
                <a href={`mailto:${contact.email}`} className="break-all text-black/80 underline-offset-2 hover:underline">
                  {contact.email}
                </a>
              </dd>
            </div>
          </div>
        )}
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={b.phone.href}
          className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-tnt-navy focus-visible:ring-2 focus-visible:ring-tnt-amber focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Phone aria-hidden="true" className="h-4 w-4 text-tnt-amber" />
          {regional ? "Call Regional Line" : "Call Branch"}
        </a>
        {directions && (
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-black/15 px-4 py-2.5 font-body text-sm font-semibold text-black transition-colors hover:border-black hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-tnt-amber focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Navigation aria-hidden="true" className="h-4 w-4" />
            Get Directions
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        )}
      </div>
      {!directions && (
        <p className="mt-3 font-body text-xs text-tnt-meta">
          Street address not yet verified for this location. Call for directions.
        </p>
      )}
    </section>
  );
}
