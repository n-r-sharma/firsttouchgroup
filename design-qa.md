# Design QA — First Touch Group

Compare implementation against the First Touch brand materials and the Distinct *mechanisms* (not Distinct content or assets). This file must pass before handoff.

Live reference inspected on 20 August 2026 at `distinctgroup.com`: opening image frame, sticky white navigation, rounded white transition, oversized mixed-style statement, horizontal photographic services rail, large sector panels, and dark enquiry/footer handoff.

## Visual system

- [x] Edge-to-edge cinematic hero, continuous white editorial field, and a single rounded overlap where the white surface meets the image.
- [x] Gold used as a restrained accent on eyebrows and the final form action, never as low-contrast body copy.
- [x] Instrument Sans for UI; Instrument Serif italic for the promise and hero emphasis.
- [x] First Touch mark in a transparent hero-overlay header that resolves to a full-width white sticky header on scroll.
- [x] Cinematic full-bleed hero, editorial type, horizontal service cards, large sector tiles, standards accordion with image sync, four-step process, persistent quote path.
- [x] No client logos, testimonials, accreditation badges, newsletter, resources, or customer portal.
- [x] SafeContractor described only as an accreditation being worked toward.

## Motion and interface craft

- [x] Exact-property transitions; 0.96 press scale on buttons; pointer-only hover.
- [x] Visible focus rings; native mobile `<dialog>` menu with Escape and focus restoration.
- [x] Hero pause control, hidden-tab pause, reduced-motion static first image.
- [x] Service rail loops automatically, pauses immediately on hover or focus, resumes without a cooldown, hides native scrollbar chrome, and becomes a static snap scroller under reduced motion.

## Content and conversion

- [x] Hero copy matches the plan (eyebrow, H1, London/service-area support, Request a quote / Explore services).
- [x] Service and sector actions prefill the quote form and move focus there. No dead “Read more” links.
- [x] Quote form: name, company/property, work email, optional phone, postcode, property type, services, optional brief, honeypot, idle/submitting/success/error.

## Viewport checklist

Capture the Distinct homepage and this implementation at the same widths, then confirm the *mechanisms* (imagery scale, rounding, scroller, spacing) without copying Distinct assets.

| Viewport | Capture | Pass? | Notes |
| --- | --- | --- | --- |
| 1440×900 | Chrome comparison + Playwright overflow and axe | pass | Full-bleed cinematic hero, single rounded surface overlap, no side gutters or horizontal overflow |
| 768×1024 | Playwright overflow | pass | Service carousel loops horizontally without exposing native scrollbar chrome |
| 390×844 | Chrome comparison + Playwright mobile menu and overflow | pass | Overlay navigation, full-height hero, one rounded white transition, and a single divider before services |
| 320 wide | Playwright overflow | pass | Layout holds; no document overflow |
| 200% zoom | 640px equivalent of 1280 | pass | `tests/responsive.spec.ts` |

Automated overflow checks live in `tests/responsive.spec.ts`. Re-run visual captures in preview before production launch if Distinct-mechanism spacing needs a further pass.

## Imagery

Eight original photographs: three sector/hero scenes plus contract cleaning, deep cleaning, floor care, window cleaning, and washroom/consumables. No third-party branding or text in frame. First hero image is preloaded; everything below is lazy-loaded.

## Handoff gate

- [x] `npm run check` and `npm run build` succeed
- [x] Playwright journeys pass (30 tests)
- [x] `npm run validate:launch` is expected to fail until live IDs, confirmed contacts, and legally reviewed privacy copy are supplied

## Validation boundary

Automated browser journeys, axe, overflow checks, and same-state desktop/mobile visual comparison against the live Distinct reference passed locally. Lighthouse, real-device touch QA, production analytics/consent behavior, live form delivery, and production hosting remain launch checks.
