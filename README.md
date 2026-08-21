# First Touch Group

Premium commercial cleaning site: one marketing page (`/`) and a supporting privacy notice (`/privacy`). Built with Astro and TypeScript. Content lives in `src/data/site.ts`.

## Local development

```bash
cp .env.example .env
npm install
npm run prepare:assets
npm run dev
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local server |
| `npm run check` | Astro / TypeScript checks |
| `npm run build` | Type-check and production build |
| `npm run preview` | Serve the production build |
| `npm test` | Playwright journeys (builds with test Formspree and GA IDs) |
| `npm run validate:launch` | Fails while launch placeholders remain |

## Launch configuration

Production activation needs real values for:

- `PUBLIC_FORMSPREE_FORM_ID`
- `PUBLIC_GA_MEASUREMENT_ID`
- `PUBLIC_COOKIEBOT_DOMAIN_GROUP_ID`
- Confirmed enquiry email and public phone in `src/data/site.ts` (`detailsConfirmed: true`)
- Legally reviewed privacy copy (`privacyLegallyReviewed: true`)

Until those are supplied, analytics stay unloaded, the quote form keeps email/phone fallbacks, and `npm run validate:launch` exits with an error. In Cookiebot, set Accept and Reject to equal prominence before going live.

## Scope notes

v1 does not include a CMS, blog, service subpages, multilingual content, booking, authentication, newsletter, client logos, or deployment.
