Rebuild the Services pages from TNT Light in this project (TNT Dark), with exactly the same design, layout, content, data and behaviour. The ONLY change is the theme: TNT Light is a light theme; TNT Dark is a dark theme. Do not redesign, rewrite copy, add or remove sections, or change interactions.

SOURCE (read-only, same machine): /Users/dayalsankark/TNT/TNT Light
TARGET (where you work): /Users/dayalsankark/TNT/TNT Dark

PAGES TO REPRODUCE
- /services                (src/app/services/page.tsx)
- /services/crane-rental   (src/app/services/crane-rental/page.tsx)

FILES TO COPY FROM LIGHT (read each in full first; keep their logic and content identical)
- src/components/site/services.ts (Dark has an older copy; make it match Light)
- src/components/services/servicesPageData.ts
- src/components/services/AvailabilityBadge.tsx
- src/components/services/RegionalAvailability.tsx
- src/components/services/CraneTypeGrid.tsx
- src/components/services/CraneRentalContent.tsx
- src/components/services/HashRedirect.tsx
- src/app/services/page.tsx
- src/app/services/crane-rental/page.tsx
- Dependencies these import that Dark doesn't have yet. Check every import. Dark has no /contact page or src/components/contact/*, and the Services pages link to /contact and embed ContactForm, so copy Light's /contact page and contact components too.
- Any image in Light's public/ that these pages use and Dark lacks.

LINKS THAT MUST MATCH LIGHT
Make the same link changes Light made so the pages are reachable the same way:
- The nav Services item and its items (navigation.ts, SiteNav.tsx, LocationSelect.tsx)
- The homepage Full-Scope Capability cards (CoreServices.tsx)
- Footer service links (SiteFooter.tsx)
- The branch map service lists (branchLocatorData.ts, BranchLocator.tsx)
- About's capability list and "Explore Our Services" button (aboutData.ts, CapabilityExplorer.tsx, about/page.tsx)
- The quote form's service list (RequestQuote.tsx)
- The chat assistant's service facts (src/lib/chat/knowledge.ts)

Port only the services-related logic in those files. Keep Dark's existing styling wherever Dark's version already differs from Light's.

THE THEME CHANGE (the only visual difference)
Use Dark's existing tokens and conventions. Read Dark's src/app/about/page.tsx, RequestQuote.tsx, Button.tsx and globals.css first and match them.

Section backgrounds (no two neighbouring sections the same):

/services
  Hero: bg-black
  Introduction: bg-tnt-slate
  Core services: bg-black
  Specialized: bg-tnt-graphite
  Crane preview: bg-black, CraneTypeGrid tone="dark"
  How we work: bg-tnt-slate
  Regional availability: bg-black
  Projects: bg-tnt-graphite
  Safety & Engineering: bg-tnt-slate
  Quote band: bg-tnt-amber (unchanged)

/services/crane-rental
  Intro: bg-black
  Crane types: bg-tnt-slate, CraneTypeGrid tone="dark"
  Across the family: bg-black
  Specialized crane work: bg-tnt-graphite
  Related services: bg-tnt-slate
  Quote: bg-tnt-amber, with the form card bg-black like Dark's RequestQuote

/contact (if copied)
  Same idea: light bands become black, slate or graphite.

Colour swaps:
- Headings: text-black → text-white. The Heading primitive hard-codes text-black; override it, or use plain h1/h2 with the same classes, as Dark's /about does.
- Body text: text-black/70 → text-white/70
- Meta text: text-black/50 or text-tnt-meta → text-white/60
- Eyebrows: stay text-tnt-amber
- Cards on black bands: bg-tnt-slate border-white/10
- Cards on slate or graphite bands: bg-black border-white/10
- Card hover: hover:border-tnt-amber (unchanged)
- Chips: border-white/12 bg-white/[0.05] text-white/75
- Hairlines: border-black/10 → border-white/10
- Step rules: border-black → border-white/80
- Buttons: add onDark on dark bands. Keep the light style on the gold bands.
- Focus rings: ring-tnt-amber with ring-offset-black

Component details:
- AvailabilityBadge: add a tone prop, like CraneTypeGrid's.
  - direct: bg-tnt-amber text-black
  - network: bg-white text-black
  - unconfirmed: border-white/25 text-white/70
  - not_offered: bg-white/5 text-white/45
- RegionalAvailability tabs:
  - selected: bg-tnt-amber text-black
  - others: border-white/12 bg-white/[0.04] text-white
  - panel: bg-tnt-slate, rows divide-white/10
- Form fields: copy Dark's RequestQuote field styling (dark fields, white text, amber focus).
- iCARE badge: keep it on a white tile, as Dark's /about does.

Prefer tone props over duplicated components.

RULES
- Read Dark's CLAUDE.md and AGENTS.md first and follow them.
- Git targets the home-directory repo, not this project. Never run git add -A, git add ., git commit -a or git mv; use cp/mv. Don't commit.
- Never run npm audit fix --force.
- Don't invent any content. Everything comes from Light's files as they are.

VERIFY BEFORE REPORTING DONE
1. npm run build and npm run lint both pass.
2. Run the dev server (from .claude/launch.json, on a port other than 3003, which Light uses).
3. Open both pages side by side with Light (http://localhost:3003/services and /services/crane-rental) at 1440px and 375px. They must be identical apart from colour.
4. Check:
   - every link: homepage card, nav, footer → /services/crane-rental
   - /services#crane-rental redirects there
   - the nav company filter
   - Regional Availability tabs, with mouse and arrow keys
   - the crane page "Request a Crane Rental Quote" scrolls to the form, with Crane Rental preselected
   - text is readable on every band
   - no horizontal overflow
   - no console errors

Then list the files you created and changed, and anything you couldn't make identical.
