# PROMPT — TNT Services Pages (Phase 2)

> Paste everything below the line into a new Claude Code session opened in
> `/Users/dayalsankark/TNT/TNT Light`. Fill in the `[[ … ]]` blocks first if you
> have the content; leave them as-is and the agent will mark those parts pending.

---

You are a senior product designer and frontend engineer working in an existing
Next.js codebase. Your job is to finish the TNT Crane & Rigging **Services**
experience: give the five remaining core services their own pages, modelled on
the approved Crane Rental page, and tighten the `/services` overview.

Quality bar: every page should look like it was designed alongside the
homepage, About and Contact pages, contain **only verified facts**, and make
it easy to get from "what do you offer?" to "request a quote".

## 1. Read these before doing anything

1. `CLAUDE.md` and `AGENTS.md`. Two rules there are critical:
   - This folder is **not** its own git repo. Git commands hit the user's whole
     home directory. Do **not** run `git add`, `git mv`, `git commit` or any
     other git command that changes things.
   - Next.js 16 differs from your training data. Check
     `node_modules/next/dist/docs/` before writing routing or metadata code.
2. The approved reference implementation. Copy its structure and conventions:
   - `src/app/services/crane-rental/page.tsx`: route, metadata, quote section
     with the form embedded.
   - `src/components/services/CraneRentalContent.tsx`: page body.
3. The single source of truth for services and who offers them:
   `src/components/site/services.ts`. Use `SERVICES`, `serviceHref()`,
   `availability()`, `confirmedServices()` and `COMPANIES`.
   - Its `page` field plus `serviceHref()` already route every link (nav,
     footer, homepage cards, `/services` cards, regional table) to a dedicated
     page once one exists.
   - `HashRedirect.tsx` already forwards old `/services#<id>` links to that page.
4. Page content: `src/components/services/servicesPageData.ts`
   (`SERVICE_DETAILS`, `SPECIALIZED`, `PROJECTS`, `STEPS`).
5. Reusable parts: `Button`, `Eyebrow`, `Heading`, `Icon`
   (`src/components/site/`), `ScrollButton` and `HashScroll`
   (`src/components/about/`), `StatusBadge` (`AvailabilityBadge.tsx`),
   `CraneTypeGrid` (`tone="light" | "dark"`), and `ContactForm`
   (`src/components/contact/`; it takes `service="<id>"`).
6. Design tokens: `src/app/globals.css` (`@theme inline`).
   - Gold `tnt-amber` (#f8ae1c), black, white, `tnt-gray`, `#f5f4f0`.
   - No navy. No red accents. No card shadows.
   - Display font Impact (`font-display`), body Open Sans (`font-body`).

## 2. What to build

### A. Five dedicated service pages

| Route | Service id |
|---|---|
| `/services/specialized-rigging` | `specialized-rigging` |
| `/services/machinery-moving` | `machinery-moving` |
| `/services/heavy-haul-transport` | `heavy-haul-transport` |
| `/services/lift-planning-engineering` | `lift-planning-engineering` |
| `/services/industrial-storage` | `industrial-storage` |

Each page uses the Crane Rental layout. Sections that have no real content
for a service are **dropped**, not filled with filler:

1. **Intro.** Eyebrow "Core Service 0N", the service name as the page's only
   H1, the description, the key options or applications, and a real photo
   from `SERVICE_DETAILS`. Buttons: "Request a … Quote" (scrolls to `#quote`)
   and "Find a Branch" (`/#coverage`). If there is no photo, use the
   established "Photo pending" treatment.
2. **Capabilities.** The `SERVICE_DETAILS` items, plus the `extra` list where
   one exists, plus the `scope` caveat. Use a light background. Use real
   equipment photos where `public/photos/rigging/` has them:
   - `hydraulic-gantry.jpg`
   - `jack-and-slide.jpg`
   - `spmt-modular-transport.jpg`
   - `cantilever-spreader-bar.jpg`
   - `versa-lift-machinery-moving.jpg`
3. **Across the family.** A table of all six companies with `StatusBadge`,
   note, territory and a contact link, driven by `availability()`, exactly as
   on Crane Rental. Never show "not offered" for missing data; that is
   "Contact us to confirm".
4. **Regional specialties**, only where they genuinely relate:
   - Heavy Haul → RMS heavy-haul trucking, JMS heavy haul and on-site transport
   - Lift Planning & Engineering → JMS custom fabrication
   - Industrial Storage → the storage locations list
5. **FAQs.** An accessible accordion using native `<details>`/`<summary>` with
   visible focus, plus `FAQPage` JSON-LD that matches the visible text exactly.
   Use only the answers supplied in §6. If none are supplied, omit the section
   and its schema.
6. **Often paired with.** Two related services, linked with `serviceHref()`.
7. **Quote.** A gold band containing `ContactForm service="<id>"`, a
   "Call {main line}" button (from `contactFor("TNT Crane & Rigging")`) and a
   "Regional contacts" link.

Per page:
- Set `page:` in `services.ts`.
- Add the route to `EXTRA_ROUTES` in `navigation.ts` so the nav's Services item
  stays highlighted.
- Export `metadata` with a distinct title, a ~150-character description and a
  canonical URL.
- Prefer one generic `ServicePage` body driven by data over five copy-pasted
  components. Only split out a component where a service genuinely differs.
  If you generalize, migrate Crane Rental onto the shared body without
  changing how it looks or behaves.

### B. Tighten `/services` (the overview)

Once every service has its own page, the overview no longer needs to carry
every detail.

- Make the six core-service cards shorter: photo, name, one-line description,
  "Offered directly by…", and "Explore {service}". The full capability lists
  move to the service pages.
- Keep: the hero, the introduction, Specialized Capabilities, the crane-type
  preview, How We Work, Regional Availability, Projects, Safety & Engineering,
  and the quote band.
- Do not shorten anything else without asking first.

### C. Content gaps from the Maxim Crane benchmark

Close these gaps only where content is supplied in §6:
- per-service FAQs
- testimonials
- per-service case studies

Otherwise leave a clearly labelled "pending content" note in code comments.
Do **not** add visible placeholder copy that pretends to be real.

## 3. Content accuracy (non-negotiable)

- Do not invent any of the following: capacities, tonnages, fleet counts,
  certifications, safety statistics, customer names, project outcomes,
  testimonials, branch locations, response times, or "engineer-stamped"
  guarantees.
- Every factual statement must come from `services.ts`, `servicesPageData.ts`,
  `aboutData.ts`, `regionalContacts.ts`, `branchLocatorData.ts`, or §6 below.
- Scope words stay in: "where available", "selected facilities", "confirm for
  your location".
- Specialized capabilities keep their provider attribution. Precast is a
  product and installation offering, not crane rental.
- If something important is missing, mark it pending and list it in your
  report. Do not fill the gap with plausible-sounding text.

## 4. Engineering rules

- Use the existing stack only. Add no new dependencies (no shadcn, no
  animation libraries).
- Tailwind v4 is configured in CSS. There is no `tailwind.config`.
- Pages are server components. Use client islands only where state is
  required.
- Do not render `<script>` elements in components; React warns about them on
  client navigation. JSON-LD is the exception: follow the Next.js 16 docs in
  `node_modules/next/dist/docs/` for the supported way.
- Use `next/image` for local photos. Remote Unsplash stock photos use a plain
  `<img>` with the existing eslint-disable comment and a "Stock photo" tag.
- Smooth scrolling is handled by Lenis (`SmoothScroll.tsx`). For in-page
  jumps use `ScrollButton`/`scrollToElement`. Do not add scroll locking,
  scroll hijacking or new scroll listeners.
  - Anchor-navigation freezes and blinking have happened on this site before.
    Test for them.
- Accessibility:
  - one H1 per page and a logical heading order
  - visible focus states
  - keyboard-operable accordions
  - meaningful alt text
  - `motion-reduce:` variants on hover animations
  - no horizontal scroll at 375px
- Match the house comment style. Write a short docblock on each new file
  saying what it is, why it exists, and where its data comes from.
- Do not modify unrelated homepage sections, the global nav design or the
  footer layout. Data-driven link updates are fine.

## 5. Workflow

1. **Inspect.** Read the files in §1 and open the Crane Rental page in the
   browser preview. Use launch config `tnt-light` on port 3003.
2. **Plan, then stop.** Reply with:
   - the component plan (the generic body vs. any per-service differences)
   - the section list for each of the five pages, marking which sections are
     dropped for lack of content
   - the overview card changes
   - any data conflicts you found
   - your questions

   Wait for my approval before you write code.
3. **Build** in small steps. Run `npm run build` (this is the typecheck) and
   `npm run lint` after each page.
4. **Verify in the browser preview**, not by reasoning:
   - each route loads with the right title, canonical URL and H1
   - the nav's Services item is highlighted on each page
   - old `/services#<id>` links redirect to the new page
   - the quote form opens with the right service preselected
   - the FAQ accordion works with the keyboard
   - wheel scrolling runs top to bottom without getting stuck
   - layout works at 1440px and 375px
   - no console errors

   Screenshots taken while the preview pane is hidden can be stale. Confirm
   state with JavaScript checks, not screenshots alone.
5. **Report.** List:
   - files created and changed
   - routes added
   - what you verified and how
   - content still pending, as a checklist for the TNT team
   - anything you could not verify

   Separate *done*, *pending content* and *not done*.

## 6. Content supplied by TNT (fill in or leave as-is)

```
FAQS (per service — question + approved answer):
[[ e.g. Specialized Rigging
   Q: Can you move equipment where a crane can't reach?
   A: … ]]

TESTIMONIALS (quote, name, title, company, permission confirmed Y/N):
[[ none yet ]]

CASE STUDIES (title, service, location, approved description, photo file):
[[ none yet ]]

CONFIRMATIONS:
[[ TNT Canada service list:                    ]]
[[ Eagle West crane rental status (direct?):   ]]
[[ Storage facilities + climate control:       ]]
[[ Bare rental coverage beyond JMS:            ]]
[[ Storage photo available? (file):            ]]
```

## 7. Questions to ask me before building

Ask only questions the codebase can't answer. At minimum:

1. Should the overview cards really be shortened, or kept as they are?
2. Should any service get a section the others don't?
3. Do you want FAQs shown as "pending" in the layout before the answers
   arrive, or omitted until then?
