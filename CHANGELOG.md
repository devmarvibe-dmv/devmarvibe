# Changelog

All notable changes to the DevMarVibe website are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-10-21

Packages and contact pages, a redesigned footer, updated About stats, and more reliable loading of console content.

### Added

- **`/packages` page:** the three web & mobile packages.
  - Package cards for Starter (Launchpad), Growth Studio and Enterprise Suite, with a Website / Mobile app switch that shows each package's app scope.
  - A comparison table that scrolls inside its own box on phones.
  - App packages, plus what's included in every app package.
  - Console access, API charges, add-ons and general terms.
  - Every "Get a quote" button opens `/contact` with that package and platform pre-selected.
- **`/contact` page:**
  - A dedicated contact page with email, phone, "What happens next" (reply → quote with a 50% advance → build and launch) and a link to compare packages.
  - The form adds a package picker, a "Build it as" choice (website, mobile app or both) and an optional company field.
  - It is pre-filled from `?package=` and `?platform=`. The package, platform and project type go to the console in the contact `services` field.
- `data/packages.ts` is the single source for package content, comparison rows, add-ons and terms. Set prices there.
- Shared components: `ContactForm` (used on the home page and `/contact`), `SubpageHeader`, `TrackVisit` and `PackageCards`.
- Links to the new pages from:
  - the home nav and footer (Packages) and a "Compare our web & app packages" link in the home contact section
  - the inner-page footer (Packages, Contact us) and the 404 page
  - the sitemap and `llms.txt`, which now has a packages summary.

### Changed

- **About stats** now read **5** years building, **10+** projects shipped and **5+** teams supported, in a three-column row. They replace 8+ years, 120+ projects, 42 teams and 14 specialists; the "Specialists" stat was removed.
- **Redesigned footer** (`components/site-footer.tsx`), shared by every page. It replaces the old home footer and the inner-page `SubpageFooter`.
  - A "Have a project in mind?" band with **Get a quote** and **Compare packages** (hidden on `/contact`).
  - Four columns: brand (logo, tagline, social links, "Accepting new projects"), **Company**, **Packages** (each linking to its card on `/packages`, plus Mobile apps) and **Get in touch** (email, phone, Contact us, testimonial, security).
  - A bottom bar with copyright, version and a **Back to top** button.
  - Brand grid and orbit rings in the background. The rings are desktop only, kept out of the way of the text.
  - The footer now sits outside `<main>` on every page, so screen readers recognise it as the page footer.
  - The Products and security links follow the console's data and module switches.
- `public/Mainlogo_white.png` is re-framed to exactly 2:1 (1000×500, artwork unchanged in size), so next/image's resized copies keep whole-pixel widths.

### Fixed

- **Products didn't show on some page loads.** The home page fires about 12 console requests at once. Under that burst the console slows to 6–8 s and returns 500s, so the products request sometimes failed or was still pending.
  - The site now sends at most 4 console requests at a time, in page order, and identical requests made at the same time share one response.
  - With this change, products showed on 3 of 3 loads, where they had failed on 1 of 3.
- The dev hydration warning "Extra attributes from the server: data-reveal-seen" is gone. The scroll-reveal now tracks elements in memory and waits until React has hydrated an element before touching it.
- **Products (or the whole site) sometimes didn't show.** When the console cold-starts it can answer slowly or return a 500.
  - A single failed products request hid the Products section for that visit.
  - The connection check gave up after 5 seconds and treated any server error as a firewall block, replacing the whole site with "We couldn't reach our services".
  - GET requests now retry up to twice (after 0.7 s and 2 s) on a network error or 5xx. Form submissions are never retried.
  - The connection check now waits 10 seconds, tries twice, and counts any HTTP response as reachable.
  - Verified by forcing 500s on the first products and connection-check requests: the page and products still load.
- Fixed the dev warning "Image … has either width or height modified" on the logos by adding `width: auto`.
- "Back to DevMarvibe" on inner pages no longer shows a doubled gap between "Back" and "to DevMarvibe".

### Notes

- Internal notes from the packages document are not published: "price to be set", "timeline to be set", "adjust as needed", "open items" and the byline. Prices show as "Price on request" (Starter, Growth Studio) and "Quoted per project" (Enterprise Suite).

## [0.3.0] - 2026-10-18

Performance, SEO and production-readiness pass.

### Performance

- **Smaller JavaScript:** first load is down from 151 kB to 106 kB on the home page, 114 kB to 102 kB on the testimonial form and 111 kB to 99 kB on `/security`.
  - Replaced axios with a small `fetch` client that has the same `{ data }` shape.
  - Below-the-fold home sections and the phone picker load as separate chunks via `next/dynamic`.
- **Images:**
  - `npm run optimize:images` (`scripts/optimize-images.mjs`, uses `sharp`) resizes the served-as-is images. The favicon went from 1.3 MB to 36 KB, `Main_Logo.png` from 138 KB to 34 KB, and `Mainlogo_white.png` from 165 KB to 14 KB.
  - Added `icon-192.png` and `apple-touch-icon.png`.
  - Logos and console-hosted images now go through `next/image` (AVIF/WebP, responsive `srcset`, fixed dimensions, priority for the header logo). Images from other hosts fall back to lazy `<img>`.
- **Country picker:** searchable, with a debounced filter (`useDebouncedValue`) and a virtualized list (`VirtualList`), so only the visible rows and their flags render out of 242 countries. It supports the keyboard (arrows, Enter, Escape) and has combobox/listbox roles.
- **Memoization:** the home page's derived lists, nav items, tracked sections and submit handler, plus the section components and the phone picker.

### Added

- **Site-wide motion:** scroll-reveal for headings, cards and forms on every page (`components/scroll-reveal.tsx`), and a CSS hero entrance. Content stays visible without JavaScript, and all motion is off for `prefers-reduced-motion`.
- **Breadcrumbs** with `BreadcrumbList` structured data on `/testimonials/request` and `/security`.
- **Shared inner-page footer** with links back to Home, Services, Contact, testimonials and security.
- **`/llms.txt`** — site summary, pages, services and products for AI assistants.
- **404 page:** tab title "Page not found", meta description, `noindex`, no canonical tag, and links to popular pages.

### Changed

- `productionBrowserSourceMaps: false` and `poweredByHeader: false` are set explicitly.
- Failed API calls no longer log to the browser console. Headless Chrome showed zero console messages on every page.

### Responsive

- Tested every page at 320, 375, 414, 768, 1024, 1280 and 1440 px in headless Chrome. There was no sideways scrolling, no element past the screen edge, no text under 12px, no broken images and no console errors.
- **Touch targets:** text links are at least 44px tall via a new `.tap-target` utility. That covers the footer and nav links, "Talk to us", "Visit product", case study and project links, the "Back" link, breadcrumbs, inner-page footer links and the 404 page's links.
  - The phone field's flag button is 50×44px, and the number box fills the full field height.
  - The consent checkbox is 20px, inside a label you can tap anywhere on.
- Email and phone in the contact section and footer are now tappable `mailto:` / `tel:` links.
- The "Core capability" badge and the product label went from 10px to 12px, and the product label's grey was darkened to pass contrast.
- **Small screens:** inner-page headers say "Back" instead of "Back to DevMarvibe", and the hero checkmarks wrap neatly.
- The country picker was tested on a 375px screen. It opens to a focused search box, renders 14 of 242 rows, filters as you type, stays on screen, and supports keyboard selection.

### Removed

- The placeholder "Connect with us" link (`href="#"`) on the testimonial page.
- The placeholder LinkedIn social link that pointed at `#contact`.
- Unused `data/testimonials.ts`, which held made-up testimonials.
- `axios` dependency.

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
