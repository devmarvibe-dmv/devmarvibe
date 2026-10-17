# DevMarVibe — API documentation

The APIs your website or app calls to show content from the DMV Console and send data back to it. Covers the modules enabled for DevMarVibe.

17 endpoints in 12 sections. Generated 2026-10-17 from the DMV Console API catalogue.

## Getting started

- **Base URL:** `https://console.devmarvibe.com/api` — every path below is relative to it.
- **Account code (accode):** `DMV` identifies your account on open endpoints.
- **Access:**
  - *Open* — no login; call it straight from your site.
  - *Customer token* — store / customer calls: send `Authorization: Bearer <accessToken>` from the customer's Register / Sign in response. Valid 30 days; a 401 means sign in again.
  - *Token in request* — a token from an earlier response (reschedule, tracking) is the credential.
- **CORS:** every endpoint accepts calls from any website. Never put a console (staff) login token in a website.
- **Response format** — every response is the same envelope; `respcode` matches the HTTP status:

```json
{ "success": true, "respcode": 200, "respdesc": "Message you can show", "data": { } }
```

  On a validation error (400), `data` lists the problems per field. IDs are strings; amounts are in rupees unless a currency is given; dates are ISO 8601 UTC.

## Contents

- [Site profile & shared](#site-profile-shared) (4)
- [Projects](#projects) (1)
- [Products](#products) (1)
- [Case Studies](#case-studies) (1)
- [Clients](#clients) (1)
- [Page banners](#page-banners) (1)
- [Services](#services) (1)
- [My Journey](#my-journey) (1)
- [Contact form](#contact-form) (1)
- [Testimonials](#testimonials) (2)
- [Visitor analytics](#visitor-analytics) (2)
- [Security reports](#security-reports) (1)

---

## Site profile & shared

Your name, logo and social links for your site header, plus helpers any module can use.

### Site profile

`GET /tenants/{accode}/config`

Your public profile from Settings — name, logo, professional picture, social links, support email, timezone and contact-form fields — plus flags: every switch set for your account (company type, modules on/off, customer accounts, delivery partner, online payments, whether email is set up, trial/demo dates). Use the flags to show only what your business offers.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/tenants/DMV/config`

**Path parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/tenants/DMV/config"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/tenants/DMV/config', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": {
    "accode": "DMV",
    "settings": {
      "name": "Your Business",
      "logo": "/api/files/F-001",
      "supportEmail": "hello@yourbusiness.com",
      "timezone": "Asia/Kolkata",
      "socialLinks": [
        {
          "platform": "instagram",
          "url": "https://instagram.com/yourbusiness"
        }
      ],
      "contactFormFields": []
    },
    "flags": {
      "tenantType": "Company",
      "companyType": "Ecommerce",
      "status": "active",
      "clientsEnabled": false,
      "customerAccountsEnabled": true,
      "deliveryPartnerAvailable": true,
      "showOnLandingPage": false,
      "paymentGateway": "razorpay",
      "onlinePaymentsEnabled": true,
      "emailConfigured": true,
      "isTrial": false,
      "trialEndsAt": null,
      "isDemo": false,
      "demoEndsAt": null,
      "requiresAgreement": false,
      "features": {
        "ecomCatalog": true,
        "ecomOrders": true,
        "ecomCoupons": true,
        "pageBanners": true,
        "blog": false
      }
    }
  }
}
```

**Errors**

- 404 Tenant config not found.

**Notes**

- Image paths like /api/files/… are relative to the API host: prefix them with the base URL.

### Countries

`GET /public/countries`

Active countries with ISO codes, dial codes, currency and conversion rate. Use it for country pickers and for `countryIso2` on price endpoints.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/public/countries`

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/public/countries"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/public/countries', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": [
    {
      "country": "India",
      "iso2": "IN",
      "iso3": "IND",
      "phonecode": "91",
      "flag": "🇮🇳",
      "currency": "INR",
      "currencyName": "Indian rupee",
      "taxRatePercent": 18,
      "inrConversionRate": 1
    }
  ]
}
```

### Dropdown options

`GET /master-options`

Lists of allowed values used by the forms below (for example testimonial relationship types).

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/master-options?category=testimonials&isActive=true`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `category` | string | No | Option category, e.g. testimonials. |
| `isActive` | boolean | No | true to return only active options. |
| `page` | number | No | Page number, from 1. Omit both page and pageSize to get every record. |
| `pageSize` | number | No | Records per page (default 20). |

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/master-options?category=testimonials&isActive=true"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/master-options?category=testimonials&isActive=true', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": {
    "items": [
      {
        "id": "3",
        "category": "testimonials",
        "key": "client",
        "label": "Client",
        "value": "client",
        "subOptions": [],
        "sortOrder": 1,
        "isActive": true
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 1
  }
}
```

### Upload an image

`POST /public/upload/image`

Uploads an image (for example a testimonial author photo) and returns its URL to send in another call.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/public/upload/image`
- **Body:** multipart/form-data

**Body fields**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |
| `file` | file | Yes | JPG, PNG, WebP, GIF or SVG, up to 2 MB. |
| `name` | string | No | Optional file name. |

**Example — cURL**

```bash
curl -X POST "https://console.devmarvibe.com/api/public/upload/image" \
  -F "accode=DMV" \
  -F "file=@photo.jpg"
```

**Example — JavaScript**

```js
const form = new FormData();
form.append("accode", "DMV");
form.append("file", fileInput.files[0]); // photo.jpg

const res = await fetch('https://console.devmarvibe.com/api/public/upload/image', {
  method: 'POST',
  body: form,
});
const { success, respdesc, data } = await res.json();
```

**Response** (201)

```json
{
  "success": true,
  "respcode": 201,
  "respdesc": "…",
  "data": {
    "fileId": "F-123",
    "url": "/api/files/F-123",
    "fileName": "photo.jpg",
    "mimeType": "image/jpeg",
    "size": 48213
  }
}
```

**Errors**

- 400 accode is required. / A file is required.
- 404 Tenant not found.
- 429 Too many uploads. Please try again later.

---

## Projects

Show your projects on your site.

### List projects

`GET /projects`

Your projects, newest first.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/projects?accode=DMV`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |
| `page` | number | No | Page number, from 1. Omit both page and pageSize to get every record. |
| `pageSize` | number | No | Records per page (default 20). |

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/projects?accode=DMV"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/projects?accode=DMV', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": {
    "items": [
      {
        "id": "12",
        "projectName": "Farm Fresh App",
        "tagline": "Groceries in 30 minutes",
        "description": "Mobile ordering for a dairy farm.",
        "skills": [
          "React Native",
          "Node.js"
        ],
        "associatedWith": "Freelance",
        "organizationName": "Rowth Farms",
        "projectUrl": "https://example.com",
        "createdAt": "2026-08-01T10:00:00.000Z"
      }
    ],
    "page": 1,
    "pageSize": 1,
    "total": 1
  }
}
```

---

## Products

Show the products you offer (portfolio products, not the online store).

### List products

`GET /products`

Your products, newest first.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/products?accode=DMV`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |
| `page` | number | No | Page number, from 1. Omit both page and pageSize to get every record. |
| `pageSize` | number | No | Records per page (default 20). |

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/products?accode=DMV"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/products?accode=DMV', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": {
    "items": [
      {
        "id": "4",
        "productName": "Smart Billing",
        "tagline": "GST invoices in one click",
        "description": "Billing software for small shops.",
        "productUrl": "https://example.com",
        "createdAt": "2026-08-01T10:00:00.000Z"
      }
    ],
    "page": 1,
    "pageSize": 1,
    "total": 1
  }
}
```

---

## Case Studies

Published case studies only; drafts never appear.

### List case studies

`GET /public/case-studies`

Published case studies in your display order.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/public/case-studies?accode=DMV`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/public/case-studies?accode=DMV"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/public/case-studies?accode=DMV', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": [
    {
      "id": "2",
      "title": "Doubling online orders",
      "clientName": "Rowth Farms",
      "industry": "Agriculture",
      "summary": "A storefront and delivery app.",
      "challenge": "…",
      "solution": "…",
      "results": "…",
      "coverImageUrl": "/api/files/F-9",
      "images": [],
      "tags": [
        "ecommerce"
      ],
      "caseStudyUrl": "",
      "displayOrder": 1
    }
  ]
}
```

**Errors**

- 400 accode is required.
- 404 Tenant not found.

---

## Clients

Clients marked Show on website, for an "Our Clients" section. Hidden clients never appear. Logo and image links are full URLs.

### List clients

`GET /public/clients`

Shown clients in your display order (lower first).

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/public/clients?accode=DMV`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/public/clients?accode=DMV"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/public/clients?accode=DMV', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": [
    {
      "id": "5",
      "name": "Rowth Farms",
      "logoUrl": "https://console.devmarvibe.com/api/files/F-31",
      "industry": "Agriculture",
      "websiteUrl": "https://rowthfarms.com",
      "description": "Online store and delivery app.",
      "images": [
        "https://console.devmarvibe.com/api/files/F-32"
      ],
      "displayOrder": 1
    }
  ]
}
```

**Errors**

- 400 accode is required.
- 404 Tenant not found.

---

## Page banners

The banner carousel for each page of your website, managed under Page Banners. Each slide is an image (with alt text and size) and an optional title, subtitle and link. Only active slides are returned, in your order.

### Get a page’s banner carousel

`GET /public/page-banners`

With page: that page’s slides (slides is [] when it has none, so you can hide the carousel). Without page: every page’s carousel as a list.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/public/page-banners?accode=DMV&page=Home`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |
| `page` | string | No | Page name as entered in the console, e.g. Home or About Us (capitals and spaces don’t matter: about-us works too). |

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/public/page-banners?accode=DMV&page=Home"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/public/page-banners?accode=DMV&page=Home', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": {
    "page": "Home",
    "pageKey": "home",
    "slides": [
      {
        "image": {
          "src": "https://console.devmarvibe.com/api/files/F-21",
          "alt": "Houseboats on Dal Lake at sunrise",
          "width": 1920,
          "height": 720
        },
        "title": "Kashmir this winter",
        "subtitle": "5 days from ₹7,000",
        "linkUrl": "/destinations/jammu-kashmir"
      },
      {
        "image": {
          "src": "https://images.pexels.com/photos/…/kerala.jpeg",
          "alt": "Kerala backwaters",
          "width": 1920,
          "height": 720
        }
      }
    ]
  }
}
```

**Errors**

- 400 accode is required.
- 404 Tenant not found.

---

## Services

Your services with their sub-services and prices.

### List services

`GET /services`

Services in display order, each with sub-categories and a price. Prices are in rupees unless countryIso2 is sent: then a price set for that country is used, otherwise the rupee price is converted.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/services?accode=DMV&countryIso2=IN`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |
| `countryIso2` | string | No | Two-letter country code to price in that country’s currency (see Countries). |
| `page` | number | No | Page number, from 1. Omit both page and pageSize to get every record. |
| `pageSize` | number | No | Records per page (default 20). |

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/services?accode=DMV&countryIso2=IN"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/services?accode=DMV&countryIso2=IN', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": {
    "items": [
      {
        "id": "3",
        "title": "Web Development",
        "description": "Websites and web apps.",
        "displayOrder": 1,
        "subCategories": [
          {
            "id": "8",
            "serviceId": "3",
            "name": "Landing page",
            "description": "",
            "displayOrder": 1,
            "rate": {
              "amount": 15000,
              "currency": "INR"
            }
          }
        ]
      }
    ],
    "page": 1,
    "pageSize": 1,
    "total": 1
  }
}
```

---

## My Journey

Your experience and education timeline.

### List journey entries

`GET /journeys`

Experience and education entries.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/journeys?accode=DMV&type=experience`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |
| `type` | string | No | experience or education. Omit for both. |
| `page` | number | No | Page number, from 1. Omit both page and pageSize to get every record. |
| `pageSize` | number | No | Records per page (default 20). |

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/journeys?accode=DMV&type=experience"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/journeys?accode=DMV&type=experience', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": {
    "items": [
      {
        "id": "5",
        "type": "experience",
        "role": "Senior Developer",
        "companyName": "Tech Corp",
        "durationFrom": "2020-01",
        "durationTo": "2024-06",
        "current": false,
        "location": "Hyderabad",
        "mode": "remote",
        "description": [
          "Led the frontend team"
        ],
        "skills": [
          "React",
          "Node.js"
        ]
      }
    ],
    "page": 1,
    "pageSize": 1,
    "total": 1
  }
}
```

---

## Contact form

Send your website’s contact form to your Contact Us inbox.

### Submit the contact form

`POST /contact`

Creates a contact request and notifies you by email.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/contact`
- **Body:** JSON

**Body fields**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |
| `name` | string | Yes | Visitor name. |
| `email` | string | No | Valid email. Send email, mobile or both. |
| `mobile` | string | No | Phone number. Send email, mobile or both. |
| `company` | string | No | Visitor’s company. |
| `services` | string | No | What they’re interested in. |
| `description` | string | No | Their message. |
| `customFieldValues` | object | No | Answers to custom fields, if you add any in Contact Us → Custom Fields. |
| `city` | string | No | Visitor city, from a browser-side IP lookup. |
| `state` | string | No | Visitor state. |
| `country` | string | No | Visitor country, ISO 3166-1 alpha-2 (e.g. IN). |
| `timeZone` | string | No | IANA timezone: Intl.DateTimeFormat().resolvedOptions().timeZone. |

**Example — cURL**

```bash
curl -X POST "https://console.devmarvibe.com/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
  "accode": "DMV",
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+91 9876543210",
  "company": "ABC Ltd",
  "services": "Web Development",
  "description": "I need a website for my farm store.",
  "city": "Hyderabad",
  "state": "Telangana",
  "country": "IN",
  "timeZone": "Asia/Kolkata"
}'
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    "accode": "DMV",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+91 9876543210",
    "company": "ABC Ltd",
    "services": "Web Development",
    "description": "I need a website for my farm store.",
    "city": "Hyderabad",
    "state": "Telangana",
    "country": "IN",
    "timeZone": "Asia/Kolkata"
  }),
});
const { success, respdesc, data } = await res.json();
```

**Response** (201)

```json
{
  "success": true,
  "respcode": 201,
  "respdesc": "…",
  "data": {
    "id": "57",
    "trackId": "CR-0057",
    "name": "John Doe",
    "status": "new"
  }
}
```

**Errors**

- 400 Validation failed. (including "Provide at least an email or a mobile number.")
- 404 Tenant not found.

---

## Testimonials

Show approved testimonials and collect new ones from your site.

### List testimonials

`GET /public/testimonials`

Approved and featured testimonials only.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/public/testimonials?accode=DMV`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/public/testimonials?accode=DMV"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/public/testimonials?accode=DMV', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": [
    {
      "id": "9",
      "testimonialType": "testimonial",
      "authorName": "Priya Sharma",
      "authorTitle": "Owner",
      "authorCompany": "Sharma Stores",
      "authorAvatarUrl": "/api/files/F-3",
      "headline": "Fast and reliable",
      "content": "Our orders doubled in two months.",
      "status": "featured",
      "displayOrder": 1
    }
  ]
}
```

**Errors**

- 400 accode is required.
- 404 Tenant not found.

### Submit a testimonial

`POST /public/testimonials`

Saved for your review; it appears in List testimonials only after you approve it in the console.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/public/testimonials`
- **Body:** JSON

**Body fields**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |
| `authorName` | string | Yes | Up to 200 characters. |
| `authorType` | string | Yes | Who they are, e.g. client (see Dropdown options). |
| `content` | string | Yes | The testimonial, up to 500 characters. |
| `consentToPublish` | boolean | Yes | Must be true. |
| `testimonialType` | string | No | testimonial (default) or recommendation. |
| `subjectType` | string | No | What it’s about, e.g. service. Required unless testimonialType is recommendation. |
| `subjectLabel` | string | No | Name of the service/product, up to 200. |
| `headline` | string | No | Up to 200. |
| `authorTitle` | string | No | Up to 200. |
| `authorCompany` | string | No | Up to 200. |
| `authorEmail` | string | No | Valid email. |
| `authorLinkedInUrl` | string | No | Full URL. |
| `authorAvatarUrl` | string | No | url from Upload an image. |
| `relationshipType` | string | No | Up to 50. |
| `relationshipNote` | string | No | Up to 2000. |

**Example — cURL**

```bash
curl -X POST "https://console.devmarvibe.com/api/public/testimonials" \
  -H "Content-Type: application/json" \
  -d '{
  "accode": "DMV",
  "authorName": "Priya Sharma",
  "authorType": "client",
  "subjectType": "service",
  "subjectLabel": "Website",
  "headline": "Fast and reliable",
  "content": "Our orders doubled in two months.",
  "authorCompany": "Sharma Stores",
  "consentToPublish": true
}'
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/public/testimonials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    "accode": "DMV",
    "authorName": "Priya Sharma",
    "authorType": "client",
    "subjectType": "service",
    "subjectLabel": "Website",
    "headline": "Fast and reliable",
    "content": "Our orders doubled in two months.",
    "authorCompany": "Sharma Stores",
    "consentToPublish": true
  }),
});
const { success, respdesc, data } = await res.json();
```

**Response** (201)

```json
{
  "success": true,
  "respcode": 201,
  "respdesc": "…",
  "data": {
    "trackId": "TS-0009"
  }
}
```

**Errors**

- 400 Validation failed.
- 404 Tenant not found.

---

## Visitor analytics

Count visits to your site in your Analytics dashboard.

### Record a visit

`POST /visitors/post`

Call once per page view.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/visitors/post`
- **Body:** JSON

**Body fields**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |
| `page` | string | No | Page name, up to 255, e.g. home. |
| `url` | string | No | Full page URL, up to 500. |
| `deviceType` | string | No | desktop, mobile or tablet. |
| `city` | string | No | Visitor city, from a browser-side IP lookup. |
| `state` | string | No | Visitor state. |
| `country` | string | No | Visitor country, ISO 3166-1 alpha-2 (e.g. IN). |
| `timeZone` | string | No | IANA timezone: Intl.DateTimeFormat().resolvedOptions().timeZone. |

**Example — cURL**

```bash
curl -X POST "https://console.devmarvibe.com/api/visitors/post" \
  -H "Content-Type: application/json" \
  -d '{
  "accode": "DMV",
  "page": "home",
  "url": "https://yourbusiness.com/",
  "deviceType": "desktop",
  "city": "Hyderabad",
  "state": "Telangana",
  "country": "IN",
  "timeZone": "Asia/Kolkata"
}'
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/visitors/post', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    "accode": "DMV",
    "page": "home",
    "url": "https://yourbusiness.com/",
    "deviceType": "desktop",
    "city": "Hyderabad",
    "state": "Telangana",
    "country": "IN",
    "timeZone": "Asia/Kolkata"
  }),
});
const { success, respdesc, data } = await res.json();
```

**Response** (201)

```json
{
  "success": true,
  "respcode": 201,
  "respdesc": "…",
  "data": {
    "id": "1024",
    "accode": "DMV",
    "page": "home",
    "pages": [
      "home",
      "services"
    ],
    "visitDate": "2026-10-02"
  }
}
```

**Errors**

- 400 Validation failed.

**Notes**

- Page views from the same visitor (IP) on the same day are combined into one entry listing every page they opened: the first returns 201, later ones 200 "Visit updated." with the full pages list.

### Visit count

`GET /visitors/count`

Total visits (one per visitor per day), for a "visitors" counter on your site.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/visitors/count?accode=DMV`

**Query parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |
| `page` | string | No | Count only the visits that opened this page. |

**Example — cURL**

```bash
curl -X GET "https://console.devmarvibe.com/api/visitors/count?accode=DMV"
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/visitors/count?accode=DMV', {
  method: 'GET',
});
const { success, respdesc, data } = await res.json();
```

**Response** (200)

```json
{
  "success": true,
  "respcode": 200,
  "respdesc": "…",
  "data": {
    "accode": "DMV",
    "page": null,
    "total": 1532
  }
}
```

---

## Security reports

Let researchers report security issues in your site (for a /security page).

### Submit a report

`POST /vulnerability-reports`

Creates a report in Vulnerability Reports and notifies you.

- **Access:** Open — no login
- **Example URL:** `https://console.devmarvibe.com/api/vulnerability-reports`
- **Body:** JSON

**Body fields**

| Name | Type | Required | Description |
|---|---|---|---|
| `accode` | string | Yes | Your account code. |
| `title` | string | Yes | Short summary. |
| `description` | string | Yes | Details of the issue. |
| `severity` | string | No | low, medium, high or critical. |
| `vulnerabilityType` | string | No | e.g. XSS. |
| `affectedUrl` | string | No | Up to 1000. |
| `stepsToReproduce` | string | No |  |
| `impact` | string | No |  |
| `reporterName` | string | No |  |
| `reporterEmail` | string | No | Valid email. |
| `city` | string | No | Visitor city, from a browser-side IP lookup. |
| `state` | string | No | Visitor state. |
| `country` | string | No | Visitor country, ISO 3166-1 alpha-2 (e.g. IN). |
| `timeZone` | string | No | IANA timezone: Intl.DateTimeFormat().resolvedOptions().timeZone. |

**Example — cURL**

```bash
curl -X POST "https://console.devmarvibe.com/api/vulnerability-reports" \
  -H "Content-Type: application/json" \
  -d '{
  "accode": "DMV",
  "title": "Reflected XSS on search",
  "severity": "high",
  "vulnerabilityType": "XSS",
  "affectedUrl": "https://yourbusiness.com/search?q=",
  "description": "The q parameter is echoed without escaping.",
  "stepsToReproduce": "Open /search?q=<script>alert(1)</script>",
  "reporterName": "A. Researcher",
  "reporterEmail": "researcher@example.com"
}'
```

**Example — JavaScript**

```js
const res = await fetch('https://console.devmarvibe.com/api/vulnerability-reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    "accode": "DMV",
    "title": "Reflected XSS on search",
    "severity": "high",
    "vulnerabilityType": "XSS",
    "affectedUrl": "https://yourbusiness.com/search?q=",
    "description": "The q parameter is echoed without escaping.",
    "stepsToReproduce": "Open /search?q=<script>alert(1)</script>",
    "reporterName": "A. Researcher",
    "reporterEmail": "researcher@example.com"
  }),
});
const { success, respdesc, data } = await res.json();
```

**Response** (201)

```json
{
  "success": true,
  "respcode": 201,
  "respdesc": "…",
  "data": {
    "id": "14",
    "title": "Reflected XSS on search",
    "severity": "high",
    "status": "new"
  }
}
```

**Errors**

- 400 Validation failed.
- 404 Tenant not found.
