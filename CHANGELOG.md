# Changelog

All notable changes to the DevMarVibe website are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-10-18

Integrates the DMV Console public API as described in `DMV-api-documentation.md` (console v1.66.0).

### Added

- **Version in the footer** — every footer shows `Website v<package.json version> · Console v<API version>`. The console version is read from the `version` field of API responses.
- **`NEXT_PUBLIC_BACKEND_URL`** — sets the DMV Console host the site calls, without `/api` (defaults to `https://console.devmarvibe.com`). It's read at build time, so redeploy after changing it.
- **New home page sections** fed by the console, each hidden when it has no content or its module is switched off in the console:
  - Page banner carousel (Page Banners, page "Home").
  - "Our work" — case studies and projects.
  - "Our clients" logo wall.
  - "Our journey" timeline (My Journey).
- **`/security` page** for reporting vulnerabilities (Security reports API), linked from the footer and listed in the sitemap.
- **Testimonial form**
  - Photo upload through the image upload API (JPG, PNG, WebP, GIF or SVG, up to 2 MB).
  - Author type and relationship options loaded from the console's dropdown options.
  - Service and product choices loaded from the console.
- Typed API client for all 17 documented endpoints, with shared response types, `resolveFileUrl()` for console file paths, and visitor device type on page views.

### Changed

- **Testimonials** on the home page now show the author's photo, job title, company and headline, in the console's display order.
- Sections and nav links follow the console's module switches (`flags.features`).
- **Contact form** no longer sends empty fields.

### Fixed

- **Testimonial form:** email, job title and company were collected but never sent. They're now sent as `authorEmail`, `authorTitle` and `authorCompany`.
- **Testimonial form:** the chosen service or product was prefixed onto the message, which could push it past the API's 500-character limit and make submissions fail. It's now sent as `subjectLabel`.
- **Testimonial form:** the "Employee" author type was not a value the console accepts.
- Testimonial and form errors now show the console's own message instead of a generic one.
- **Visitor count** read `count` instead of `data.total`, so it always returned nothing.
- Search engines only index the production deploy, on both Netlify (`CONTEXT`) and Vercel (`VERCEL_ENV`); preview, UAT and branch deploys serve `Disallow: /` and `noindex`.
- The testimonial page has its own canonical URL instead of pointing at the home page.

### Assets (not yet wired into pages)

- **404 background** — `public/not-found-bg.svg` (with a `not-found-bg.png` preview): white grid, brand-coloured orbit rings, a faint outlined "404" and dead-end route lines, with the centre kept clear for the page copy. Not yet wired into `app/not-found.tsx`.
- **Home section backgrounds** in `public/backgrounds/`, each as SVG plus a PNG preview. Not yet wired into `app/page.tsx`.
  - `hero-bg.svg` — grid, orbit rings behind the hero card and a rising growth line; left side kept light for the headline.
  - `services-bg.svg` — dot pattern on the surface colour with circuit traces at the edges; centre kept quiet for the cards.
  - `testimonials-bg.svg` — navy grid with cyan orbit rings and an oversized quote mark, for the dark "Client stories" section.
  - `contact-bg.svg` — orbit rings on the left and a dotted route ending at a location pin.
- **Print theme** (design canvas, outside the repo): theme sheet (colour, type, motifs), two-sided A4 flyer and 3.5 × 2 in business card, using the site's brand colours and real services, stats and contact details.

### Notes

- To use the hero background, remove or replace the `.hero-grid` background in `app/globals.css` and drop the two `hero-orbit` divs, since the image already includes them.
- The business card and flyer still have placeholders to fill in: `[Your Name]`, `[Job Title]`, `[name]@devmarvibe.com` and `[QR CODE]`.

## [0.1.0]

### Added

- Initial Next.js site: home page (hero, about, services, products, testimonials, contact), testimonials page, custom 404 page, SEO (`robots.ts`, `sitemap.ts`) and Netlify deployment config.
