# Design QA — Who We Work With

## Comparison target

- Source visual truth: `/Users/nikashsharma/.codex/generated_images/01a02433-3ea4-7f73-8a1f-f96159e5e532/exec-075b051f-b942-4767-81f2-f28e307fa1cb.png`
- Source dimensions: `1586 × 992` pixels.
- Rendered implementation: `.context/design-qa/sectors-desktop-1586x992.png`
- Rendered screenshot dimensions: `1571 × 983` pixels from a Browser viewport override of `1586 × 992` CSS pixels. The Browser surface did not expose `deviceScaleFactor`.
- Normalization: the source was scaled to the screenshot raster size before comparison. Browser chrome and the existing site header are outside the section design target and were not treated as design drift.
- Combined comparison evidence: `.context/design-qa/sectors-comparison-1571x983.png` (source on the left, implementation on the right).
- Mobile evidence: `.context/design-qa/sectors-mobile-390x844.png`, captured from a `390 × 844` CSS-pixel viewport; screenshot raster `375 × 812` pixels.
- Short-desktop fit evidence: `.context/design-qa/sectors-fit-1581x718.png`, captured at the exact dimensions of the reported cut-off state.
- State: the desktop comparison shows Offices & workplaces active, optional analytics rejected, and the page anchored to Who We Work With. The mobile evidence shows Boutique hotels active after one Next-sector action.

## Required fidelity surfaces

- Fonts and typography: passed locally. The exact Distinct-hosted WOFF2 faces are self-hosted here: DistinctDiatype Regular for headings and body copy, DistinctDiatype Medium mapped to the Semibold role for controls and labels, and ES Face Light Italic for editorial accents. The hierarchy is limited to Light 300, Regular 400, and Semibold 600. Production usage still requires confirming the appropriate commercial font licences.
- Spacing and layout rhythm: passed. The desktop section uses the reference’s one dominant panel plus three narrow panels, aligned controls, compact header rhythm, and a `3:1:1:1` grid relationship. Its height is now budgeted from the available viewport rather than viewport width, so the exact `1581 × 718` cut-off state resolves to a complete `445px`-high card row with every title and active detail inside its card.
- Colors and visual tokens: passed. Existing ivory, navy, gold, structural outlines, and card shadows are preserved. The stronger bottom image treatment matches the reference hierarchy without introducing a second color system.
- Image quality and asset fidelity: passed. The three supplied sector images keep their intended subjects and crops. Retail & showrooms deliberately reuses the existing floor-care image as the temporary fourth-sector photograph requested by the user; no CSS or SVG image substitutes were introduced.
- Copy and content: passed. Four realistic sectors are present. The active CTA is specific and compact (`Quote for your workplace`, `Quote for your hotel`, `Quote for your property`, or `Quote for your retail space`).
- Icons and controls: passed. The square previous/next controls follow the project’s existing arrow treatment, expose accessible names, meet a `52 × 52` CSS-pixel target, and have visible focus and press states.

## Full-view comparison evidence

The combined board confirms the selected composition: one image-led active story carries the summary and quote action, while the remaining stories become narrow visual selectors. The implementation adds the requested fourth panel; that is an intentional content change from the three-sector generated mock and restores the original reference’s one-plus-three rhythm.

No focused desktop crop was needed because the single-section comparison keeps the heading, controls, card typography, CTA, image crops, corners, and inter-card spacing readable at full resolution. A separate mobile capture was used for responsive detail.

## Comparison history

1. Initial implementation review found three P2 differences: the inherited editorial header made the cards start too low, the active title was oversized, and the sector-specific CTA wrapped over two lines. The section-specific vertical rhythm and desktop card height were tuned, the active title scale was reduced, and short contextual CTA labels were added.
2. Responsive review found one P2 continuity issue: a sector selected on desktop could remain outside the mobile rail after a viewport change. A media-query change listener now re-centres the active card. Post-fix evidence shows the selected mobile card fully visible with the adjacent stories peeking at both edges.
3. Final combined comparison and mobile capture found no remaining actionable P0, P1, or P2 differences. The extra fourth card and retained brand heading treatment are intentional requirements, not drift.
4. Short-desktop review found the card row was sized from `45vw`, producing a roughly `711px`-high card inside a `718px` viewport. The desktop section now owns a single viewport-height budget and lets the card row fill only the remaining space after the heading and controls.

## Interaction and accessibility verification

- Previous/next selection cycles through all four panels and updates the polite status message.
- Directly selecting Retail & showrooms exposes its CTA.
- The retail CTA sets Property type to `retail`, scrolls to the quote form, and focuses Full name.
- Desktop, tablet (`768 × 1024`), mobile (`390 × 844`), and narrow (`320 × 568`) browser checks showed no document overflow; the narrow title remained inside its card.
- At `1581 × 718`, the heading, previous/next controls, complete card row, and each of the four active-card detail states remain within the same viewport.
- Mobile selection scrolls the active card into view and retains visible neighboring-content cues.
- Browser console error checks returned no errors on desktop, tablet, or mobile states.
- Reduced-motion CSS removes image and arrow movement while retaining state changes.

## Findings

No actionable P0, P1, or P2 findings remain.

## Follow-up polish

- P3: replace the temporary Retail & showrooms photograph with dedicated, customer-facing retail imagery when that shoot is available.

final result: passed

---

# Design QA — Trust Card Character Detail

## Comparison target

- Source visual truth: `.context/attachments/ENMPQf/Screenshot 2026-08-21 at 2.53.28 pm.png` plus the supplied `.context/attachments/ITPNrj/Frame 3.svg` character artwork.
- Source screenshot: `1559 × 783` pixels; normalized source card crop: `.context/design-qa/trust-card-reference.png` at `1456 × 705` pixels.
- Browser-rendered implementation: `.context/design-qa/trust-card-implementation-final.png` at `1456 × 705` pixels, cropped from an `1864 × 943` CSS-pixel browser viewport.
- Combined comparison evidence: `.context/design-qa/trust-card-comparison-final.png`.
- State: desktop trust card, static decorative artwork, card aligned beneath the fixed header.

## Required fidelity surfaces

- Fonts and typography: passed. The existing heading and feature typography, wrapping, weights, and hierarchy are unchanged.
- Spacing and layout rhythm: passed. The card remains `1456 × 705` after normalization. The artwork is inset `20px` from the right edge and finishes `41.7px` above the feature-divider row.
- Colors and visual tokens: passed. The supplied dark artwork was remapped to the existing ivory, gold, and bright-gold tokens against the navy card.
- Image quality and asset fidelity: passed. The supplied vector paths remain intact and render sharply; no CSS or HTML approximation replaces the illustration.
- Copy and content: passed. Existing card content is unchanged and remains readable above the decorative layer.

## Full-view comparison evidence

The combined board shows that the base card's dimensions, typography, grid, padding, radius, shadow, and content remain consistent with the source. The character group is the only intentional addition. It sits inside the upper-right header area and stops before the divider row, while its vertical boundary creates the requested peeking-in effect.

A separate focused crop was not needed because the equal-size card comparison keeps both the complete illustration and all four content columns readable at full resolution.

## Comparison history

1. The first pass placed the illustration near the upper-right corner with part of its width outside the card.
2. User feedback requested a lower, more integrated position. The second pass centred the asset vertically and moved it fully inside the card with a `20px` right inset.
3. A final review found that the centred asset competed with Flexible cover. The artwork was reduced and anchored in the open header area, leaving `41.7px` of clear space above the divider row.
4. Post-fix comparison found no actionable P0, P1, or P2 issues.

## Findings

No actionable P0, P1, or P2 findings remain.

## Follow-up polish

- P3: The illustration is intentionally hidden below the desktop breakpoint to protect the heading and feature-copy hierarchy on smaller cards.

final result: passed
