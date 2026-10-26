/**
 * POSTAL CODE → LOCATION (2026-10-26, on request — "user has to search by zip
 * code... bring all the zip code"). Lets the branch locator sort branches by
 * distance from ANY US ZIP or Canadian postal code the visitor types, not just
 * a branch's own ZIP.
 *
 *   GET /api/postal?code=77029     → { country: "US", code: "77029", lat, lng }
 *   GET /api/postal?code=T2P 1J9   → { country: "CA", code: "T2P", lat, lng }
 *   unknown / malformed            → 404 { error }
 *
 * Data (src/lib/geo/postalCentroids.json, ~1MB — server-only, never shipped
 * to the browser):
 *   - US: every ZIP Code Tabulation Area's internal point, from the US Census
 *     Bureau 2024 Gazetteer (2024_Gaz_zcta_national) — public domain. 33,791
 *     ZIPs, preferred wherever a ZIP is in both sources.
 *   - US extras (`usExtra`, added 2026-10-26, on request — "bring all the zip
 *     codes... don't miss any"): the 7,846 ZIPs the Census list leaves out —
 *     PO-Box-only and "unique" single-organization ZIPs (e.g. 10008, 20500,
 *     77001) — from GeoNames' US postal codes
 *     (download.geonames.org/export/zip/US.zip), CC BY 4.0. 41,637 US ZIPs in
 *     total. Military APO/FPO codes have no location in either source and
 *     stay unmatched.
 *     US territories (PR, VI, GU, AS, MP) and military APO/FPO codes with a
 *     GeoNames location are included too — 41,706 US codes in all.
 *   - Canada, full postal codes (added 2026-10-26, on request — "collect end
 *     to end every zip code"): all 899,779 six-character codes from GeoNames
 *     (download.geonames.org/export/zip/CA_full.csv.zip), CC BY 4.0, stored
 *     gzipped (src/lib/geo/ca-postal-full.json.gz, 3.7MB, ~16MB unpacked) as
 *     { FSA: "LDU,lat,lng;LDU,lat,lng;…" } and only read the first time a full
 *     Canadian code is looked up. next.config.ts's outputFileTracingIncludes
 *     ships the file with this route.
 *   - Canada, fallback: forward sortation areas (the first 3 characters of a
 *     postal code) from GeoNames (download.geonames.org/export/zip/CA.zip),
 *     CC BY 4.0 — used for a 3-character query or a full code that isn't in
 *     the full list.
 *   GeoNames data is attribution-required; credited in BranchLocator.tsx's UI.
 * A ZIP+4 ("77029-1234") uses its first 5 digits. Coordinates are rounded to 3
 * decimals (~100m).
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import centroids from "@/lib/geo/postalCentroids.json";

type LatLng = [number, number];
// JSON arrays infer as number[], not a [lat, lng] tuple — the file is
// generated with exactly two numbers per entry, so assert the shape.
const { us: US, usExtra: US_EXTRA, ca: CA } = centroids as unknown as {
  us: Record<string, LatLng>;
  usExtra: Record<string, LatLng>;
  ca: Record<string, LatLng>;
};

// Full Canadian codes, loaded once per server instance on first use. Each
// FSA's packed string is split into a Map only when that FSA is asked for.
let caFull: Record<string, string> | null = null;
const caFullParsed = new Map<string, Map<string, LatLng>>();

function lookupCanadaFull(fsa: string, ldu: string): LatLng | null {
  if (!caFull) {
    const file = path.join(process.cwd(), "src/lib/geo/ca-postal-full.json.gz");
    caFull = JSON.parse(gunzipSync(readFileSync(file)).toString("utf8")) as Record<string, string>;
  }
  let codes = caFullParsed.get(fsa);
  if (!codes) {
    codes = new Map();
    for (const entry of (caFull[fsa] ?? "").split(";")) {
      const [l, lat, lng] = entry.split(",");
      if (l) codes.set(l, [Number(lat), Number(lng)]);
    }
    caFullParsed.set(fsa, codes);
  }
  return codes.get(ldu) ?? null;
}

export function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("code") ?? "";
  const code = raw.trim().toUpperCase().replace(/\s+/g, "");

  // `source` tells the UI which dataset answered, so it can credit GeoNames
  // (CC BY) exactly when GeoNames data is shown.
  const us = code.match(/^(\d{5})(-?\d{4})?$/);
  if (us && US[us[1]]) {
    const [lat, lng] = US[us[1]];
    return Response.json({ country: "US", code: us[1], lat, lng, source: "census" });
  }
  if (us && US_EXTRA[us[1]]) {
    const [lat, lng] = US_EXTRA[us[1]];
    return Response.json({ country: "US", code: us[1], lat, lng, source: "geonames" });
  }

  const ca = code.match(/^([A-Z]\d[A-Z])(\d[A-Z]\d)?$/);
  if (ca && ca[2]) {
    const hit = lookupCanadaFull(ca[1], ca[2]);
    if (hit) {
      const [lat, lng] = hit;
      return Response.json({ country: "CA", code: `${ca[1]} ${ca[2]}`, lat, lng, source: "geonames" });
    }
  }
  if (ca && CA[ca[1]]) {
    const [lat, lng] = CA[ca[1]];
    return Response.json({ country: "CA", code: ca[1], lat, lng, source: "geonames" });
  }

  return Response.json({ error: "Unknown ZIP or postal code" }, { status: 404 });
}
