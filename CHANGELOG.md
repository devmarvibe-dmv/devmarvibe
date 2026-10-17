# Changelog

All notable changes to the DevMarVibe website are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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
