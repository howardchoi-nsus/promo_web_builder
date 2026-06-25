-- Generated seed chunk 01
-- Run 000_prepare.sql once before running these chunks.
-- Documents: 10


-- Airbnb
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Airbnb', 'airbnb', 'design-reference', null, now())
  on conflict (slug) do update
    set name = excluded.name,
        category = excluded.category,
        updated_at = now()
  returning id
),
d as (
  insert into design_documents (
    brand_id,
    source_type,
    original_filename,
    original_blob_url,
    status,
    raw_markdown,
    updated_at
  )
  select id, 'markdown_seed', 'docs/design-md/airbnb/DESIGN.md', null, 'seeded', '---
version: alpha
name: Airbnb-design-analysis
description: A warm, generous consumer marketplace anchored on a clean white canvas and Airbnb Rausch (#ff385c), the single brand voltage that carries every primary CTA, search-button orb, and rating dot. Type runs Airbnb Cereal VF at modest weights — display sits at 22–28px in weight 500/600 rather than the heavy 700+ that fintech and enterprise systems use; the brand trusts photography and generous whitespace over typographic muscle. Three product entries (Homes, Experiences, Services) sit in the top nav with hand-illustrated 32-icon glyphs and "NEW" badges, signaling a marketplace expansion rather than a feature dump. Pill-shaped search bars (`{rounded.full}`), softly rounded property cards (`{rounded.lg}` ~14px), and 32px button radii read as friendly and human — there is no hard corner anywhere except the body grid.

colors:
  primary: "#ff385c"
  primary-active: "#e00b41"
  primary-disabled: "#ffd1da"
  primary-error-text: "#c13515"
  primary-error-text-hover: "#b32505"
  luxe: "#460479"
  plus: "#92174d"
  ink: "#222222"
  body: "#3f3f3f"
  muted: "#6a6a6a"
  muted-soft: "#929292"
  hairline: "#dddddd"
  hairline-soft: "#ebebeb"
  border-strong: "#c1c1c1"
  canvas: "#ffffff"
  surface-soft: "#f7f7f7"
  surface-card: "#ffffff"
  surface-strong: "#f2f2f2"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  legal-link: "#428bff"
  star-rating: "#222222"
  scrim: "#000000"

typography:
  display-xl:
    fontFamily: "''Airbnb Cereal VF'', Circular, -apple-system, system-ui, Roboto, ''Helvetica Neue'', sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.43
    letterSpacing: 0
  display-lg:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: -0.44px
  display-md:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 21px
    fontWeight: 700
    lineHeight: 1.43
    letterSpacing: 0
  display-sm:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.18px
  title-md:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  title-sm:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0
  rating-display:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -1px
  body-md:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  caption:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.29
    letterSpacing: 0
  caption-sm:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.23
    letterSpacing: 0
  badge:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: 0
  micro-label:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: 0
  uppercase-tag:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 8px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0.32px
    textTransform: uppercase
  button-md:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0
  button-sm:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.29
    letterSpacing: 0
  link:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  nav-link:
    fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 14px
  lg: 20px
  xl: 32px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 14px 24px
    height: 48px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 13px 23px
    height: 48px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
  button-pill-rausch:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 10px 20px
  search-orb:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    height: 48px
  icon-button-circle:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: 32px
  icon-button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: 40px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 80px
  product-tab-active:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
  product-tab-inactive:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.nav-link}"
  search-bar-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: 14px 24px
    height: 64px
  search-field-segment:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    padding: 8px 24px
  category-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.button-sm}"
  category-tab-active:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.none}"
  property-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
  property-card-photo:
    rounded: "{rounded.md}"
  experience-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.md}"
  city-link-block:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
  rating-display-card:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.rating-display}"
  guest-favorite-badge:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  new-tag:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.uppercase-tag}"
    rounded: "{rounded.full}"
    padding: 2px 6px
  amenity-row:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 12px 0
  reviews-card:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
  host-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 24px
  reservation-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 24px
  date-picker-day:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
  date-picker-day-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 14px 12px
    height: 56px
  footer-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: 48px 80px
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
  legal-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.caption-sm}"
---

## Overview

Airbnb is the canonical example of a generous, photography-led consumer marketplace. The base canvas is **pure white** (`{colors.canvas}` — #ffffff) with deep near-black ink (`{colors.ink}` — #222222) for headlines and body, and a single voltage of **Rausch** (`{colors.primary}` — #ff385c) carrying every primary CTA, the search-button orb, the heart save state, and inline brand links. There is no secondary brand color in mainline marketing — the **Luxe purple** (`{colors.luxe}` — #460479) and **Plus magenta** (`{colors.plus}` — #92174d) tokens are sub-brand accents that only appear inside Airbnb Luxe / Plus contexts.

Type runs **Airbnb Cereal VF** (a custom variable font Airbnb licenses), with **Circular** as the historic in-house fallback and a system stack underneath. Cereal sits at modest weights — display headlines render at 22–28px in weight 500–600, not the heavy 700+ weights that financial or enterprise systems lean on. The hero h1 ("Inspiration for future getaways") on the homepage is just 28px / 700, which would feel small on a typical SaaS page; here it works because the layout leans on photography (city collage, property cards) for visual weight rather than typographic muscle.

The shape language is **soft**. Buttons are 8px radius (`{rounded.sm}`), property cards are ~14px (`{rounded.md}`), the search bar is fully pill-shaped (`{rounded.full}`), wishlist hearts and search orbs are circles (`{rounded.full}`), and category strip rounded corners run at 32px (`{rounded.xl}`). There is essentially no hard corner anywhere except the body grid itself — every interactive element is rounded.

**Key Characteristics:**
- Single accent color: `{colors.primary}` (#ff385c — "Rausch") carries every primary CTA, the search orb, the heart save state, and the brand wordmark. Used scarcely — most pages are 90% white + ink with one or two Rausch moments.
- Custom variable type: `Airbnb Cereal VF`. Display weights sit at 500–700, body at 400. Modest weight is intentional — the system trusts photography for visual heft.
- Three-product top nav: Homes, Experiences, Services — each with a hand-illustrated 32px icon and "NEW" badges (`{component.new-tag}`) on the two newer products. Active tab uses an underline rule (`{component.product-tab-active}`).
- Pill-shaped global search bar: white surface, fully rounded (`{rounded.full}`), divided by 1px hairlines into Where / When / Who segments, terminated by a circular Rausch search orb (`{component.search-orb}`).
- Property cards are photo-first: aspect-ratio rectangles with `{rounded.md}` corner clipping, swipeable image carousel, "Guest favorite" floating badge top-left, heart icon top-right, then 4–5 lines of meta beneath.
- Editorial dropdowns (footer, language picker) are clean text columns over the white canvas — no card surface, no shadow.
- The design system caps elevation at one shadow tier (`box-shadow: rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px, rgba(0,0,0,0.1) 0 4px 8px`) — used on hover-floated cards and search/account dropdowns.
- 8px base spacing system, with major sections at `{spacing.section}` (64px) — generous but not airy enough to feel editorial-magazine; the marketplace density wants more cards per scroll.

## Colors

### Brand & Accent
- **Rausch** (`{colors.primary}` — #ff385c): The single brand color. Used for primary CTA backgrounds (Reserve, Continue), the search orb, the heart save state on property cards, and inline brand links. The most recognizable color in consumer travel.
- **Rausch Active** (`{colors.primary-active}` — #e00b41): The press / pointer-down variant — slightly more saturated. Used on `{component.button-primary-active}`.
- **Rausch Disabled** (`{colors.primary-disabled}` — #ffd1da): A pale tint used on disabled CTAs.
- **Luxe Purple** (`{colors.luxe}` — #460479): Sub-brand accent for Airbnb Luxe. Only appears inside Luxe-branded surfaces — never in mainline marketing.
- **Plus Magenta** (`{colors.plus}` — #92174d): Sub-brand accent for Airbnb Plus. Same scoping as Luxe — sub-product only.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default page floor for every public page. Airbnb does not have a dark mode on the public web.
- **Surface Soft** (`{colors.surface-soft}` — #f7f7f7): The lightest fill — used on disabled fields, sub-nav hover backgrounds, and the inline search filter band.
- **Surface Strong** (`{colors.surface-strong}` — #f2f2f2): Slightly heavier fill — circular icon-button surface (e.g., the breadcrumb back-arrow and listing toolbar buttons).

### Hairlines & Borders
- **Hairline** (`{colors.hairline}` — #dddddd): The default 1px border tone — search bar dividers, table separators, footer column splitters, card 1px borders.
- **Hairline Soft** (`{colors.hairline-soft}` — #ebebeb): A lighter divider used on long-scrolling editorial body separators.
- **Border Strong** (`{colors.border-strong}` — #c1c1c1): A heavier stroke used on disabled outline buttons and form input outlines after focus.

### Text
- **Ink** (`{colors.ink}` — #222222): The dominant text color on light surfaces. Display headlines, body paragraphs, primary nav links, and most inline link text. Never pure black.
- **Body** (`{colors.body}` — #3f3f3f): A secondary running-text color used inside long-form review and amenity copy where ink would feel too heavy.
- **Muted** (`{colors.muted}` — #6a6a6a): Sub-titles inside city link blocks ("Cottage rentals", "Villa rentals"), inactive product-tab labels, footer category sub-labels, "View all" links.
- **Muted Soft** (`{colors.muted-soft}` — #929292): Disabled link text. Used very sparingly.
- **Star Rating** (`{colors.star-rating}` — #222222): The same ink token — Airbnb''s star icon and "4.81" rating numbers all render in ink rather than a yellow/gold color, which is a deliberate brand choice (yellow stars feel cheap in travel context).
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on Rausch CTAs.

### Semantic
- **Error** (`{colors.primary-error-text}` — #c13515): Inline error text for form validation. Distinct from Rausch — slightly darker, more saturated red.
- **Error Hover** (`{colors.primary-error-text-hover}` — #b32505): Darkens on link hover.
- **Legal Link Blue** (`{colors.legal-link}` — #428bff): Inline links inside legal copy (Privacy, Terms). Only used inside the legal sub-band.

### Scrim
- **Scrim** (`{colors.scrim}` — #000000 at 50% opacity): The global modal backdrop tone — date picker, login dialog, language picker. Stored as the base hex; opacity is applied at render time.

## Typography

### Font Family
The system runs **Airbnb Cereal VF** for everything — display, body, navigation, captions, microcopy. Fallbacks walk `Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif`. **Circular** is the historic in-house typeface still kept as the first non-variable fallback; system stacks back it up.

There is no separate display family. The variable font carries the entire scale.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.rating-display}` | 64px | 700 | 1.1 | -1px | Listing detail rating display ("4.81") |
| `{typography.display-xl}` | 28px | 700 | 1.43 | 0 | Homepage h1 ("Inspiration for future getaways") |
| `{typography.display-lg}` | 22px | 500 | 1.18 | -0.44px | Listing detail h1 ("Close to Fethiye Aliyah Bali Beach…") |
| `{typography.display-md}` | 21px | 700 | 1.43 | 0 | Section heads inside listing detail ("What this place offers") |
| `{typography.display-sm}` | 20px | 600 | 1.20 | -0.18px | Sub-section titles ("Things to know") |
| `{typography.title-md}` | 16px | 600 | 1.25 | 0 | City link block titles ("Wilmington", "Athens") |
| `{typography.title-sm}` | 16px | 500 | 1.25 | 0 | Footer column heads ("Support", "Hosting", "Airbnb") |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default running-text inside listing copy |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Card meta lines, dates, prices, distance text |
| `{typography.caption}` | 14px | 500 | 1.29 | 0 | Search field segment labels ("Where", "When", "Who") |
| `{typography.caption-sm}` | 13px | 400 | 1.23 | 0 | Footer legal line ("© 2026 Airbnb, Inc.") |
| `{typography.badge}` | 11px | 600 | 1.18 | 0 | "Guest favorite" floating badge text |
| `{typography.micro-label}` | 12px | 700 | 1.33 | 0 | Card amenity micro-labels ("Inline 6") |
| `{typography.uppercase-tag}` | 8px | 700 | 1.25 | 0.32px (uppercase) | "NEW" badge on product nav tabs |
| `{typography.button-md}` | 16px | 500 | 1.25 | 0 | Primary CTA button labels |
| `{typography.button-sm}` | 14px | 500 | 1.29 | 0 | Pill button labels (category strip) |
| `{typography.link}` | 14px | 400 | 1.43 | 0 | Inline body links |
| `{typography.nav-link}` | 16px | 600 | 1.25 | 0 | Top product-nav labels (Homes, Experiences, Services) |

### Principles
Display weights stay modest. The homepage h1 at 28px / 700 is deliberately small — it tucks under the search bar so photography and the city-link grid carry visual hierarchy. The listing-detail h1 at 22px / 500 is even quieter; the listing photo banner does the work above it.

The single typographically loud moment in the entire system is the **rating display** (`{typography.rating-display}` — 64px / 700) on listing pages. That is the only place the system trusts type alone to carry hierarchy — rating numbers are a peak trust signal, so they get the loudest treatment.

### Note on Font Substitutes
If Airbnb Cereal VF and Circular are unavailable, **Inter** is the closest open-source substitute. Adjust display headlines down by ~2% in line-height to match Cereal''s slightly tighter cap height; otherwise the proportions transfer cleanly.

## Layout

### Spacing System
- **Base unit:** 4px (with 2px micro-step).
- **Tokens:** `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 64px.
- **Section padding (vertical):** `{spacing.section}` (64px) for major page bands; tighter than typical SaaS marketing (80–96px) because marketplace pages need higher card density per scroll.
- **Card internal padding:** `{spacing.lg}` (24px) for `{component.host-card}` and `{component.reservation-card}`; `{spacing.base}` (16px) for property-card meta block; `{spacing.sm}` (8px) for caption / date-row gutters.
- **Gutters:** `{spacing.base}` (16px) between cards in the homepage city grid; `{spacing.lg}` (24px) inside footer column gutters; `{spacing.xs}` (4px) on dense category-strip dividers.

### Grid & Container
- **Max content width:** ~1280px centered on the homepage and editorial pages. Listing detail pages cap closer to 1080px to keep the photo banner and reservation rail readable.
- **City link grid (homepage footer):** 6-column grid at desktop with each cell housing a city name in `{typography.title-md}` and a category sub-label in `{typography.body-sm}` muted.
- **Listing detail:** 2-column with photo / amenity body on the left (~64% width) and a sticky reservation card (`{component.reservation-card}`) on the right (~32%).
- **Footer:** 3-column link list (Support / Hosting / Airbnb) at desktop, collapsing to 1-column on mobile.

### Whitespace Philosophy
The system gives editorial bands 64px of vertical breathing room but compresses card grids — property and city-link cards sit just 16px apart. The contrast is intentional: the page reads as "open hero, dense marketplace below," reinforcing the marketplace nature without overwhelming the visitor at the fold.

## Elevation

The system has essentially **one shadow tier** plus the flat baseline.

- **Flat (no shadow):** Body, hero, footer, all editorial bands — 95% of surfaces.
- **Card hover float:** `box-shadow: rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0` — applied to property cards on pointer hover, the search bar at rest, and the dropdown menus (account menu, language picker, date picker). This is the single shadow definition in the entire system.
- **Modal scrim:** `{colors.scrim}` rendered at 50% opacity — the global modal backdrop. Used on date pickers, login dialogs, language picker.

There are no progressive elevation tiers — the system either has the one shadow or none. Depth comes from photography, the white-on-white surface separation, and rounded-corner clipping rather than from layered shadows.

## Components

### Buttons

**`button-primary`** — Rausch fill, white text, 8px radius, 14×24px padding, 48px height, weight 500. The most common CTA across the system: "Reserve", "Continue", "Search", account-flow primaries.

**`button-primary-active`** — The press state. Background flips to `{colors.primary-active}`. No transform, no shadow change.

**`button-primary-disabled`** — Pale Rausch tint at #ffd1da with white text. Cursor not-allowed.

**`button-secondary`** — White fill with ink text and a 1px ink outline. 8px radius. Used for "Save", "Cancel", and inverse CTAs over Rausch surfaces.

**`button-tertiary-text`** — Plain ink text, no surface, no border. Underlined on hover. Used for "Show more" type links and modal close labels.

**`button-pill-rausch`** — A pill-shaped Rausch CTA used on featured cells (e.g., "Become a host" sub-CTA) — 9999px radius, 10×20px padding, 14px label.

### Search Surface

**`search-bar-pill`** — The signature global search bar. White fill, 9999px radius, 64px height, 1px hairline 1px-shadow border. Internally divided by vertical hairline rules into `{component.search-field-segment}` cells (Where / When / Who). Each segment holds an uppercase caption label above a placeholder line in `{typography.caption}`.

**`search-orb`** — The circular Rausch orb terminating the right edge of the search bar. 48×48px, fully rounded, white magnifying-glass icon centered. The hottest single color moment on the homepage.

### Top Navigation

**`top-nav`** — White surface, 80px height, 1px bottom hairline. The Airbnb wordmark sits flush left, the three product tabs (Homes / Experiences / Services) sit in the dead center, and account utilities (host link, language globe, account menu) sit flush right.

**`product-tab-active`** — Ink label in `{typography.nav-link}`, 32px hand-illustrated icon, 2px ink underline rule beneath the icon-label pair.

**`product-tab-inactive`** — Muted label, illustrated icon, no underline. Becomes active on click.

**`new-tag`** — A tiny rounded-pill badge (`{rounded.full}`) anchored top-right of an icon, carrying the uppercase "NEW" label in `{typography.uppercase-tag}` (8px / 700 with 0.32px tracking, uppercase). Used on Experiences and Services to signal recency.

### Listing Cards

**`property-card`** — A photo-first card. 1:1 aspect-ratio image with `{rounded.md}` corner clipping, image carousel dots overlay, "Guest favorite" floating badge top-left (`{component.guest-favorite-badge}`), and a heart icon top-right (`{component.icon-button-circle}` in default outlined state, Rausch-filled when saved). Beneath the image: 4–5 lines of meta — title (`{typography.title-md}`), distance / dates (`{typography.body-sm}` muted), and price ("$X night") right-aligned.

**`property-card-photo`** — The photo plate itself, separated as a token because some surfaces (wishlist, search results) reuse just the photo without the meta block.

**`experience-card`** — A taller-aspect card (4:5) for experience listings. Same `{rounded.md}` clipping, floating "NEW" badge top-left, heart top-right, and a single-line title beneath.

**`guest-favorite-badge`** — White rounded pill (`{rounded.full}`) at 11px / 600 weight. Sits over the photo with the system''s only shadow tier applied for elevation.

### Listing Detail

**`rating-display-card`** — The signature listing-detail moment. A 64px / 700 rating number ("4.81") flanked left and right by tiny laurel-wreath SVG ornaments. Beneath the rating: "Guest favorite" tagline and a row of ink stat columns. The largest typographic weight in the whole system.

**`amenity-row`** — A 1-column list of amenity icons + ink labels in `{typography.body-md}`. 12px row padding, no border between rows; section is closed by a 1px hairline divider above and below.

**`reviews-card`** — A 2-column grid of review excerpts. Each column holds an author row (avatar, name, date) above a 3-line excerpt with "Show more" tertiary link.

**`host-card`** — A white card with `{rounded.md}` rounding and 24px padding holding a host avatar, name, "Superhost" badge, response-rate stat, and a "Contact host" `{component.button-secondary}`.

**`reservation-card`** — The sticky right-rail card on listing detail pages. White surface, `{rounded.md}` rounding, 1px hairline border, 1px shadow tier elevation, 24px padding. Contains: nightly price (`{typography.display-md}` ink), date-range selector, guest-count stepper, "Reserve" primary CTA full-width, and a fee breakdown stack beneath in `{typography.body-sm}`.

### Date Picker

**`date-picker-day`** — A 40×40px circular cell carrying the day number in `{typography.body-sm}`. Default state is transparent fill, ink text.

**`date-picker-day-selected`** — Ink fill, white text, full circle (`{rounded.full}`). Range states between two selected days carry a `{colors.surface-soft}` lozenge background that connects them.

### Forms

**`text-input`** — White surface, 1px hairline outline, `{rounded.sm}` 8px radius, 56px height, 14×12px padding. Stacked label above (in `{typography.caption}` muted), placeholder text in `{typography.body-md}` muted. On focus, the border thickens to 2px ink and the border color flips to `{colors.ink}` — no glow, no ring.

### Footer

**`footer-light`** — White surface (matches the page canvas — Airbnb has no contrast footer), 48×80px padding. Three columns of link blocks (Support / Hosting / Airbnb), separated by generous 24px gutters. Each column heads with a `{typography.title-sm}` ink label and stacks `{component.footer-link}` rows in `{typography.body-sm}` ink.

**`legal-band`** — A bottom strip beneath the footer columns carrying the copyright line, language picker (globe icon + "English (US)" link), currency picker, and social icons (Facebook, X, Instagram). All text in muted `{colors.muted}` at `{typography.caption-sm}`.

## Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 744px | Top nav collapses to logo + hamburger; product tabs hide behind a sheet; search bar collapses to a single tappable pill; property cards stack 1-up; city grid 1-column; listing detail collapses reservation card to a sticky bottom bar. |
| Tablet | 744–1128px | Top nav keeps product tabs but search bar narrows; property cards 2-up; city grid 2–3 column; reservation card stays sticky right-rail at narrower width. |
| Desktop | 1128–1440px | Full top nav with three product tabs centered; search bar at full pill width with all 3 segments visible; property cards 4-up; city grid 6-column; listing detail 2-column with reservation rail. |
| Wide | > 1440px | Content width caps at 1440px on listing/search pages and ~1280px on editorial; gutters absorb the rest. |

### Touch Targets
- Primary CTAs at minimum 48×48px (above WCAG AAA).
- Search orb is 48×48px circular — the most-tapped element on the page.
- Heart save button is 32×32px circular — borderline for AAA but compensated by a generous 12px padding inside the photo card.
- Date-picker day cells are 40×40px circular.

### Collapsing Strategy
- Top product tabs collapse into a hamburger sheet below 744px.
- Search bar''s 3 segments collapse into a single-tap entry that opens a full-screen search overlay on mobile.
- Property and city-link grids drop column counts cleanly at each breakpoint — never reflow rows; always reduce columns.
- Reservation card on listing detail switches from sticky right-rail to a sticky bottom bar on mobile, carrying just the "Reserve" CTA + nightly price summary.

## Known Gaps

- **Hover state colors:** intentionally not documented per the global no-hover policy — Airbnb''s actual `:hover` styling for property cards is a subtle elevation lift, but precise extraction is unreliable.
- **Loading states / skeleton screens:** not visible on the extracted surfaces.
- **Map view styling:** the search-results map uses Mapbox-tinted tiles with custom Rausch markers; not captured here.
- **Form input error states:** error text color (`{colors.primary-error-text}`) is documented, but the full input outline + helper-text combination on validation failure was not visible in the captured surfaces.
- **Sub-brand palettes:** Luxe (`{colors.luxe}`) and Plus (`{colors.plus}`) are documented as tokens, but their full sub-system (typography overrides, surface treatment) lives on separate sub-domains and is not captured here.
', now()
  from b
  on conflict (brand_id, original_filename) do update
    set status = 'seeded',
        raw_markdown = excluded.raw_markdown,
        updated_at = now()
  returning id
),
deleted_sections as (
  delete from design_sections where document_id = (select id from d)
),
deleted_tokens as (
  delete from design_tokens where document_id = (select id from d)
)
insert into design_sections (document_id, category, original_title, normalized_title, content_markdown, content_json, confidence, sort_order)
values
((select id from d), 'overview', 'Overview', 'overview', '## Overview

Airbnb is the canonical example of a generous, photography-led consumer marketplace. The base canvas is **pure white** (`{colors.canvas}` — #ffffff) with deep near-black ink (`{colors.ink}` — #222222) for headlines and body, and a single voltage of **Rausch** (`{colors.primary}` — #ff385c) carrying every primary CTA, the search-button orb, the heart save state, and inline brand links. There is no secondary brand color in mainline marketing — the **Luxe purple** (`{colors.luxe}` — #460479) and **Plus magenta** (`{colors.plus}` — #92174d) tokens are sub-brand accents that only appear inside Airbnb Luxe / Plus contexts.

Type runs **Airbnb Cereal VF** (a custom variable font Airbnb licenses), with **Circular** as the historic in-house fallback and a system stack underneath. Cereal sits at modest weights — display headlines render at 22–28px in weight 500–600, not the heavy 700+ weights that financial or enterprise systems lean on. The hero h1 ("Inspiration for future getaways") on the homepage is just 28px / 700, which would feel small on a typical SaaS page; here it works because the layout leans on photography (city collage, property cards) for visual weight rather than typographic muscle.

The shape language is **soft**. Buttons are 8px radius (`{rounded.sm}`), property cards are ~14px (`{rounded.md}`), the search bar is fully pill-shaped (`{rounded.full}`), wishlist hearts and search orbs are circles (`{rounded.full}`), and category strip rounded corners run at 32px (`{rounded.xl}`). There is essentially no hard corner anywhere except the body grid itself — every interactive element is rounded.

**Key Characteristics:**
- Single accent color: `{colors.primary}` (#ff385c — "Rausch") carries every primary CTA, the search orb, the heart save state, and the brand wordmark. Used scarcely — most pages are 90% white + ink with one or two Rausch moments.
- Custom variable type: `Airbnb Cereal VF`. Display weights sit at 500–700, body at 400. Modest weight is intentional — the system trusts photography for visual heft.
- Three-product top nav: Homes, Experiences, Services — each with a hand-illustrated 32px icon and "NEW" badges (`{component.new-tag}`) on the two newer products. Active tab uses an underline rule (`{component.product-tab-active}`).
- Pill-shaped global search bar: white surface, fully rounded (`{rounded.full}`), divided by 1px hairlines into Where / When / Who segments, terminated by a circular Rausch search orb (`{component.search-orb}`).
- Property cards are photo-first: aspect-ratio rectangles with `{rounded.md}` corner clipping, swipeable image carousel, "Guest favorite" floating badge top-left, heart icon top-right, then 4–5 lines of meta beneath.
- Editorial dropdowns (footer, language picker) are clean text columns over the white canvas — no card surface, no shadow.
- The design system caps elevation at one shadow tier (`box-shadow: rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px, rgba(0,0,0,0.1) 0 4px 8px`) — used on hover-floated cards and search/account dropdowns.
- 8px base spacing system, with major sections at `{spacing.section}` (64px) — generous but not airy enough to feel editorial-magazine; the marketplace density wants more cards per scroll.', '{"sourcePath":"docs/design-md/airbnb/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Rausch** (`{colors.primary}` — #ff385c): The single brand color. Used for primary CTA backgrounds (Reserve, Continue), the search orb, the heart save state on property cards, and inline brand links. The most recognizable color in consumer travel.
- **Rausch Active** (`{colors.primary-active}` — #e00b41): The press / pointer-down variant — slightly more saturated. Used on `{component.button-primary-active}`.
- **Rausch Disabled** (`{colors.primary-disabled}` — #ffd1da): A pale tint used on disabled CTAs.
- **Luxe Purple** (`{colors.luxe}` — #460479): Sub-brand accent for Airbnb Luxe. Only appears inside Luxe-branded surfaces — never in mainline marketing.
- **Plus Magenta** (`{colors.plus}` — #92174d): Sub-brand accent for Airbnb Plus. Same scoping as Luxe — sub-product only.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default page floor for every public page. Airbnb does not have a dark mode on the public web.
- **Surface Soft** (`{colors.surface-soft}` — #f7f7f7): The lightest fill — used on disabled fields, sub-nav hover backgrounds, and the inline search filter band.
- **Surface Strong** (`{colors.surface-strong}` — #f2f2f2): Slightly heavier fill — circular icon-button surface (e.g., the breadcrumb back-arrow and listing toolbar buttons).

### Hairlines & Borders
- **Hairline** (`{colors.hairline}` — #dddddd): The default 1px border tone — search bar dividers, table separators, footer column splitters, card 1px borders.
- **Hairline Soft** (`{colors.hairline-soft}` — #ebebeb): A lighter divider used on long-scrolling editorial body separators.
- **Border Strong** (`{colors.border-strong}` — #c1c1c1): A heavier stroke used on disabled outline buttons and form input outlines after focus.

### Text
- **Ink** (`{colors.ink}` — #222222): The dominant text color on light surfaces. Display headlines, body paragraphs, primary nav links, and most inline link text. Never pure black.
- **Body** (`{colors.body}` — #3f3f3f): A secondary running-text color used inside long-form review and amenity copy where ink would feel too heavy.
- **Muted** (`{colors.muted}` — #6a6a6a): Sub-titles inside city link blocks ("Cottage rentals", "Villa rentals"), inactive product-tab labels, footer category sub-labels, "View all" links.
- **Muted Soft** (`{colors.muted-soft}` — #929292): Disabled link text. Used very sparingly.
- **Star Rating** (`{colors.star-rating}` — #222222): The same ink token — Airbnb''s star icon and "4.81" rating numbers all render in ink rather than a yellow/gold color, which is a deliberate brand choice (yellow stars feel cheap in travel context).
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on Rausch CTAs.

### Semantic
- **Error** (`{colors.primary-error-text}` — #c13515): Inline error text for form validation. Distinct from Rausch — slightly darker, more saturated red.
- **Error Hover** (`{colors.primary-error-text-hover}` — #b32505): Darkens on link hover.
- **Legal Link Blue** (`{colors.legal-link}` — #428bff): Inline links inside legal copy (Privacy, Terms). Only used inside the legal sub-band.

### Scrim
- **Scrim** (`{colors.scrim}` — #000000 at 50% opacity): The global modal backdrop tone — date picker, login dialog, language picker. Stored as the base hex; opacity is applied at render time.', '{"sourcePath":"docs/design-md/airbnb/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The system runs **Airbnb Cereal VF** for everything — display, body, navigation, captions, microcopy. Fallbacks walk `Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif`. **Circular** is the historic in-house typeface still kept as the first non-variable fallback; system stacks back it up.

There is no separate display family. The variable font carries the entire scale.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.rating-display}` | 64px | 700 | 1.1 | -1px | Listing detail rating display ("4.81") |
| `{typography.display-xl}` | 28px | 700 | 1.43 | 0 | Homepage h1 ("Inspiration for future getaways") |
| `{typography.display-lg}` | 22px | 500 | 1.18 | -0.44px | Listing detail h1 ("Close to Fethiye Aliyah Bali Beach…") |
| `{typography.display-md}` | 21px | 700 | 1.43 | 0 | Section heads inside listing detail ("What this place offers") |
| `{typography.display-sm}` | 20px | 600 | 1.20 | -0.18px | Sub-section titles ("Things to know") |
| `{typography.title-md}` | 16px | 600 | 1.25 | 0 | City link block titles ("Wilmington", "Athens") |
| `{typography.title-sm}` | 16px | 500 | 1.25 | 0 | Footer column heads ("Support", "Hosting", "Airbnb") |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default running-text inside listing copy |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Card meta lines, dates, prices, distance text |
| `{typography.caption}` | 14px | 500 | 1.29 | 0 | Search field segment labels ("Where", "When", "Who") |
| `{typography.caption-sm}` | 13px | 400 | 1.23 | 0 | Footer legal line ("© 2026 Airbnb, Inc.") |
| `{typography.badge}` | 11px | 600 | 1.18 | 0 | "Guest favorite" floating badge text |
| `{typography.micro-label}` | 12px | 700 | 1.33 | 0 | Card amenity micro-labels ("Inline 6") |
| `{typography.uppercase-tag}` | 8px | 700 | 1.25 | 0.32px (uppercase) | "NEW" badge on product nav tabs |
| `{typography.button-md}` | 16px | 500 | 1.25 | 0 | Primary CTA button labels |
| `{typography.button-sm}` | 14px | 500 | 1.29 | 0 | Pill button labels (category strip) |
| `{typography.link}` | 14px | 400 | 1.43 | 0 | Inline body links |
| `{typography.nav-link}` | 16px | 600 | 1.25 | 0 | Top product-nav labels (Homes, Experiences, Services) |

### Principles
Display weights stay modest. The homepage h1 at 28px / 700 is deliberately small — it tucks under the search bar so photography and the city-link grid carry visual hierarchy. The listing-detail h1 at 22px / 500 is even quieter; the listing photo banner does the work above it.

The single typographically loud moment in the entire system is the **rating display** (`{typography.rating-display}` — 64px / 700) on listing pages. That is the only place the system trusts type alone to carry hierarchy — rating numbers are a peak trust signal, so they get the loudest treatment.

### Note on Font Substitutes
If Airbnb Cereal VF and Circular are unavailable, **Inter** is the closest open-source substitute. Adjust display headlines down by ~2% in line-height to match Cereal''s slightly tighter cap height; otherwise the proportions transfer cleanly.', '{"sourcePath":"docs/design-md/airbnb/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px (with 2px micro-step).
- **Tokens:** `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 64px.
- **Section padding (vertical):** `{spacing.section}` (64px) for major page bands; tighter than typical SaaS marketing (80–96px) because marketplace pages need higher card density per scroll.
- **Card internal padding:** `{spacing.lg}` (24px) for `{component.host-card}` and `{component.reservation-card}`; `{spacing.base}` (16px) for property-card meta block; `{spacing.sm}` (8px) for caption / date-row gutters.
- **Gutters:** `{spacing.base}` (16px) between cards in the homepage city grid; `{spacing.lg}` (24px) inside footer column gutters; `{spacing.xs}` (4px) on dense category-strip dividers.

### Grid & Container
- **Max content width:** ~1280px centered on the homepage and editorial pages. Listing detail pages cap closer to 1080px to keep the photo banner and reservation rail readable.
- **City link grid (homepage footer):** 6-column grid at desktop with each cell housing a city name in `{typography.title-md}` and a category sub-label in `{typography.body-sm}` muted.
- **Listing detail:** 2-column with photo / amenity body on the left (~64% width) and a sticky reservation card (`{component.reservation-card}`) on the right (~32%).
- **Footer:** 3-column link list (Support / Hosting / Airbnb) at desktop, collapsing to 1-column on mobile.

### Whitespace Philosophy
The system gives editorial bands 64px of vertical breathing room but compresses card grids — property and city-link cards sit just 16px apart. The contrast is intentional: the page reads as "open hero, dense marketplace below," reinforcing the marketplace nature without overwhelming the visitor at the fold.', '{"sourcePath":"docs/design-md/airbnb/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation', 'elevation', '## Elevation

The system has essentially **one shadow tier** plus the flat baseline.

- **Flat (no shadow):** Body, hero, footer, all editorial bands — 95% of surfaces.
- **Card hover float:** `box-shadow: rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0` — applied to property cards on pointer hover, the search bar at rest, and the dropdown menus (account menu, language picker, date picker). This is the single shadow definition in the entire system.
- **Modal scrim:** `{colors.scrim}` rendered at 50% opacity — the global modal backdrop. Used on date pickers, login dialogs, language picker.

There are no progressive elevation tiers — the system either has the one shadow or none. Depth comes from photography, the white-on-white surface separation, and rounded-corner clipping rather than from layered shadows.', '{"sourcePath":"docs/design-md/airbnb/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — Rausch fill, white text, 8px radius, 14×24px padding, 48px height, weight 500. The most common CTA across the system: "Reserve", "Continue", "Search", account-flow primaries.

**`button-primary-active`** — The press state. Background flips to `{colors.primary-active}`. No transform, no shadow change.

**`button-primary-disabled`** — Pale Rausch tint at #ffd1da with white text. Cursor not-allowed.

**`button-secondary`** — White fill with ink text and a 1px ink outline. 8px radius. Used for "Save", "Cancel", and inverse CTAs over Rausch surfaces.

**`button-tertiary-text`** — Plain ink text, no surface, no border. Underlined on hover. Used for "Show more" type links and modal close labels.

**`button-pill-rausch`** — A pill-shaped Rausch CTA used on featured cells (e.g., "Become a host" sub-CTA) — 9999px radius, 10×20px padding, 14px label.

### Search Surface

**`search-bar-pill`** — The signature global search bar. White fill, 9999px radius, 64px height, 1px hairline 1px-shadow border. Internally divided by vertical hairline rules into `{component.search-field-segment}` cells (Where / When / Who). Each segment holds an uppercase caption label above a placeholder line in `{typography.caption}`.

**`search-orb`** — The circular Rausch orb terminating the right edge of the search bar. 48×48px, fully rounded, white magnifying-glass icon centered. The hottest single color moment on the homepage.

### Top Navigation

**`top-nav`** — White surface, 80px height, 1px bottom hairline. The Airbnb wordmark sits flush left, the three product tabs (Homes / Experiences / Services) sit in the dead center, and account utilities (host link, language globe, account menu) sit flush right.

**`product-tab-active`** — Ink label in `{typography.nav-link}`, 32px hand-illustrated icon, 2px ink underline rule beneath the icon-label pair.

**`product-tab-inactive`** — Muted label, illustrated icon, no underline. Becomes active on click.

**`new-tag`** — A tiny rounded-pill badge (`{rounded.full}`) anchored top-right of an icon, carrying the uppercase "NEW" label in `{typography.uppercase-tag}` (8px / 700 with 0.32px tracking, uppercase). Used on Experiences and Services to signal recency.

### Listing Cards

**`property-card`** — A photo-first card. 1:1 aspect-ratio image with `{rounded.md}` corner clipping, image carousel dots overlay, "Guest favorite" floating badge top-left (`{component.guest-favorite-badge}`), and a heart icon top-right (`{component.icon-button-circle}` in default outlined state, Rausch-filled when saved). Beneath the image: 4–5 lines of meta — title (`{typography.title-md}`), distance / dates (`{typography.body-sm}` muted), and price ("$X night") right-aligned.

**`property-card-photo`** — The photo plate itself, separated as a token because some surfaces (wishlist, search results) reuse just the photo without the meta block.

**`experience-card`** — A taller-aspect card (4:5) for experience listings. Same `{rounded.md}` clipping, floating "NEW" badge top-left, heart top-right, and a single-line title beneath.

**`guest-favorite-badge`** — White rounded pill (`{rounded.full}`) at 11px / 600 weight. Sits over the photo with the system''s only shadow tier applied for elevation.

### Listing Detail

**`rating-display-card`** — The signature listing-detail moment. A 64px / 700 rating number ("4.81") flanked left and right by tiny laurel-wreath SVG ornaments. Beneath the rating: "Guest favorite" tagline and a row of ink stat columns. The largest typographic weight in the whole system.

**`amenity-row`** — A 1-column list of amenity icons + ink labels in `{typography.body-md}`. 12px row padding, no border between rows; section is closed by a 1px hairline divider above and below.

**`reviews-card`** — A 2-column grid of review excerpts. Each column holds an author row (avatar, name, date) above a 3-line excerpt with "Show more" tertiary link.

**`host-card`** — A white card with `{rounded.md}` rounding and 24px padding holding a host avatar, name, "Superhost" badge, response-rate stat, and a "Contact host" `{component.button-secondary}`.

**`reservation-card`** — The sticky right-rail card on listing detail pages. White surface, `{rounded.md}` rounding, 1px hairline border, 1px shadow tier elevation, 24px padding. Contains: nightly price (`{typography.display-md}` ink), date-range selector, guest-count stepper, "Reserve" primary CTA full-width, and a fee breakdown stack beneath in `{typography.body-sm}`.

### Date Picker

**`date-picker-day`** — A 40×40px circular cell carrying the day number in `{typography.body-sm}`. Default state is transparent fill, ink text.

**`date-picker-day-selected`** — Ink fill, white text, full circle (`{rounded.full}`). Range states between two selected days carry a `{colors.surface-soft}` lozenge background that connects them.

### Forms

**`text-input`** — White surface, 1px hairline outline, `{rounded.sm}` 8px radius, 56px height, 14×12px padding. Stacked label above (in `{typography.caption}` muted), placeholder text in `{typography.body-md}` muted. On focus, the border thickens to 2px ink and the border color flips to `{colors.ink}` — no glow, no ring.

### Footer

**`footer-light`** — White surface (matches the page canvas — Airbnb has no contrast footer), 48×80px padding. Three columns of link blocks (Support / Hosting / Airbnb), separated by generous 24px gutters. Each column heads with a `{typography.title-sm}` ink label and stacks `{component.footer-link}` rows in `{typography.body-sm}` ink.

**`legal-band`** — A bottom strip beneath the footer columns carrying the copyright line, language picker (globe icon + "English (US)" link), currency picker, and social icons (Facebook, X, Instagram). All text in muted `{colors.muted}` at `{typography.caption-sm}`.', '{"sourcePath":"docs/design-md/airbnb/DESIGN.md","category":"components"}'::jsonb, 0.75, 6),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 744px | Top nav collapses to logo + hamburger; product tabs hide behind a sheet; search bar collapses to a single tappable pill; property cards stack 1-up; city grid 1-column; listing detail collapses reservation card to a sticky bottom bar. |
| Tablet | 744–1128px | Top nav keeps product tabs but search bar narrows; property cards 2-up; city grid 2–3 column; reservation card stays sticky right-rail at narrower width. |
| Desktop | 1128–1440px | Full top nav with three product tabs centered; search bar at full pill width with all 3 segments visible; property cards 4-up; city grid 6-column; listing detail 2-column with reservation rail. |
| Wide | > 1440px | Content width caps at 1440px on listing/search pages and ~1280px on editorial; gutters absorb the rest. |

### Touch Targets
- Primary CTAs at minimum 48×48px (above WCAG AAA).
- Search orb is 48×48px circular — the most-tapped element on the page.
- Heart save button is 32×32px circular — borderline for AAA but compensated by a generous 12px padding inside the photo card.
- Date-picker day cells are 40×40px circular.

### Collapsing Strategy
- Top product tabs collapse into a hamburger sheet below 744px.
- Search bar''s 3 segments collapse into a single-tap entry that opens a full-screen search overlay on mobile.
- Property and city-link grids drop column counts cleanly at each breakpoint — never reflow rows; always reduce columns.
- Reservation card on listing detail switches from sticky right-rail to a sticky bottom bar on mobile, carrying just the "Reserve" CTA + nightly price summary.', '{"sourcePath":"docs/design-md/airbnb/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 7),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- **Hover state colors:** intentionally not documented per the global no-hover policy — Airbnb''s actual `:hover` styling for property cards is a subtle elevation lift, but precise extraction is unreliable.
- **Loading states / skeleton screens:** not visible on the extracted surfaces.
- **Map view styling:** the search-results map uses Mapbox-tinted tiles with custom Rausch markers; not captured here.
- **Form input error states:** error text color (`{colors.primary-error-text}`) is documented, but the full input outline + helper-text combination on validation failure was not visible in the captured surfaces.
- **Sub-brand palettes:** Luxe (`{colors.luxe}`) and Plus (`{colors.plus}`) are documented as tokens, but their full sub-system (typography overrides, surface treatment) lives on separate sub-domains and is not captured here.', '{"sourcePath":"docs/design-md/airbnb/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 8);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_1', '#ff385c', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_2', '#e00b41', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_3', '#ffd1da', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_4', '#c13515', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_5', '#b32505', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_6', '#460479', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_7', '#92174d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_8', '#222222', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_9', '#3f3f3f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_10', '#6a6a6a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_11', '#929292', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_12', '#dddddd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_13', '#ebebeb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_14', '#c1c1c1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_15', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_16', '#f7f7f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_17', '#f2f2f2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_18', '#428bff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'color', 'color_19', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md'), 'typography', 'font_1', 'fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif', 'primary_detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/airbnb/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/airbnb/DESIGN.md';


-- Airtable
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Airtable', 'airtable', 'design-reference', null, now())
  on conflict (slug) do update
    set name = excluded.name,
        category = excluded.category,
        updated_at = now()
  returning id
),
d as (
  insert into design_documents (
    brand_id,
    source_type,
    original_filename,
    original_blob_url,
    status,
    raw_markdown,
    updated_at
  )
  select id, 'markdown_seed', 'docs/design-md/airtable/DESIGN.md', null, 'seeded', '---
version: alpha
name: Airtable-design-analysis
description: A sober, editorial workflow-software interface anchored on white canvas and dark-ink type, where brand voltage comes from full-bleed signature cards in coral, dark green, peach, and dark navy that punctuate long-scroll explainer pages. Primary actions use a near-black pill CTA; secondary actions sit in a white outlined button. Type runs Haas Grotesk in modest weights — never bold for its own sake.

colors:
  primary: "#181d26"
  primary-active: "#0d1218"
  ink: "#181d26"
  body: "#333840"
  muted: "#41454d"
  hairline: "#dddddd"
  border-strong: "#9297a0"
  canvas: "#ffffff"
  surface-soft: "#f8fafc"
  surface-strong: "#e0e2e6"
  surface-dark: "#181d26"
  surface-dark-elevated: "#1d1f25"
  signature-coral: "#aa2d00"
  signature-forest: "#0a2e0e"
  signature-cream: "#f5e9d4"
  signature-peach: "#fcab79"
  signature-mint: "#a8d8c4"
  signature-yellow: "#f4d35e"
  signature-mustard: "#d9a441"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  link: "#1b61c9"
  link-active: "#1a3866"
  info: "#254fad"
  info-border: "#458fff"
  success: "#006400"
  success-border: "#39bf45"
  pricing-ink: "#1d1f25"

typography:
  display-xl:
    fontFamily: "Haas Groot Disp, Haas, sans-serif"
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0
  display-lg:
    fontFamily: "Haas Groot Disp, Haas, sans-serif"
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0
  display-md:
    fontFamily: "Haas Groot Disp, Haas, sans-serif"
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0
  title-lg:
    fontFamily: "Haas, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: 0.12px
  title-md:
    fontFamily: "Haas Groot Disp, Haas, sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  title-sm:
    fontFamily: "Haas, sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  label-md:
    fontFamily: "Haas, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  button:
    fontFamily: "Haas, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Haas, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: 0
  caption:
    fontFamily: "Haas, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0.16px
  legal:
    fontFamily: "Haas, sans-serif"
    fontSize: 13.12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  pricing-display:
    fontFamily: "Inter Display, system-ui, sans-serif"
    fontSize: 44.8px
    fontWeight: 475
    lineHeight: 1.1
    letterSpacing: 0
  pricing-section:
    fontFamily: "Inter Display, system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 475
    lineHeight: 1.2
    letterSpacing: 0
  pricing-card-title:
    fontFamily: "Inter Display, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 475
    lineHeight: 1.3
    letterSpacing: 0

rounded:
  xs: 2px
  sm: 6px
  md: 10px
  lg: 12px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 16px 24px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 16px 24px
  button-secondary-on-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 16px 24px
  button-legal:
    backgroundColor: "{colors.link}"
    textColor: "{colors.on-primary}"
    typography: "{typography.legal}"
    rounded: "{rounded.xs}"
    padding: 12px 10px
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 40px
  button-pricing-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.pricing-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.link}"
    typography: "{typography.body-md}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    height: 64px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: 96px
  signature-coral-card:
    backgroundColor: "{colors.signature-coral}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-md}"
    rounded: "{rounded.lg}"
    padding: 48px
  signature-forest-card:
    backgroundColor: "{colors.signature-forest}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-md}"
    rounded: "{rounded.lg}"
    padding: 48px
  hero-card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-md}"
    rounded: "{rounded.lg}"
    padding: 48px
  feature-card-tabbed:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  cream-callout-card:
    backgroundColor: "{colors.signature-cream}"
    textColor: "{colors.ink}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.md}"
    padding: 24px
  demo-grid-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 16px
  logo-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.body-md}"
    padding: 32px
  article-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  topic-filter-rail:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    width: 240px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
    height: 44px
  text-input-focus:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  pricing-tier-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.pricing-ink}"
    typography: "{typography.pricing-card-title}"
    rounded: "{rounded.md}"
    padding: 32px
  pricing-tier-card-featured:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.pricing-ink}"
    typography: "{typography.pricing-card-title}"
    rounded: "{rounded.md}"
    padding: 32px
  pricing-comparison-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    padding: 12px
  cta-band-light:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    rounded: "{rounded.lg}"
    padding: 48px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    padding: 64px
---

## Overview

Airtable''s marketing surfaces are quietly editorial. The base atmosphere is white canvas, dark ink type, generous whitespace, and a near-black pill CTA — nothing is fighting for attention until a section needs to. The brand voltage doesn''t come from gradient washes or accent walls; it comes from **full-bleed signature cards** in `{colors.signature-coral}`, `{colors.signature-forest}`, and `{colors.surface-dark}` that punctuate long-scroll explainer pages every two or three screens. Between those signature bands, the page reads like a print magazine: a headline, supporting copy, a small image cluster, then breathing room.

Type voice is Haas Grotesk at modest weights (400 for display, 500 for sub-titles and buttons). Display headlines never go bolder than 500 — emphasis comes from size and color contrast, not from weight. Body copy stays at 14px / 400 throughout. The pricing surface runs its own dialect: **Inter Display** at unusual mid-weights (475 / 575) and **pill-shaped buttons** (`{rounded.pill}`) that don''t appear on any other page — a deliberate sub-system signaling "this page is about commercial precision."

**Key Characteristics:**
- Primary CTA is `{colors.primary}` (near-black ink) with white text and a `{rounded.lg}` (12px) corner — it reads as confident and final, never decorative.
- Secondary CTA is a `{colors.canvas}` button with `{colors.ink}` text and a hairline outline. The two together form Airtable''s signature button pair.
- Hero is white canvas. There is no atmospheric gradient, no mesh, no background flourish. The brand strength comes from the type and the buttons sitting in clean whitespace.
- Brand voltage lives in **signature surface cards**: `{colors.signature-coral}`, `{colors.signature-forest}`, and `{colors.surface-dark}` carry full-bleed product callouts every few screens.
- Demo-card grids carry product UI fragments on `{colors.signature-peach}`, `{colors.signature-mint}`, `{colors.signature-cream}` and other warm pastel surfaces.
- Section rhythm: white canvas → coral signature card → white body → cream callout band → dark navy CTA → light gray CTA banner → footer. The canvas resets between every signature surface.
- Border radius is hierarchical: `{rounded.lg}` (12px) for primary CTAs and large signature cards, `{rounded.md}` (10px) for content cards and demo grids, `{rounded.sm}` (6px) for inputs, `{rounded.full}` for icon buttons. Pricing buttons jump to `{rounded.pill}` to mark themselves as a separate dialect.
- Vertical rhythm is `{spacing.section}` (96px) between major bands — universal across every page.

## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #181d26): The dominant brand color. Used for the primary CTA background, h1/h2 display type, and the `{component.surface-dark}` band. Not "blue, then black" — black IS the primary throughout the marketing system.
- **Primary Active** (`{colors.primary-active}` — #0d1218): The press state on primary buttons.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default page surface; the floor of every editorial body.
- **Surface Soft** (`{colors.surface-soft}` — #f8fafc): Tabbed feature cards and the featured pricing tier.
- **Surface Strong** (`{colors.surface-strong}` — #e0e2e6): The light gray "Start building with Airtable" CTA banner near the footer.
- **Surface Dark** (`{colors.surface-dark}` — #181d26): The dark navy CTA cards used mid-page (for example "The path to 10× every person in your organization").
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #1d1f25): The articles-page hero base behind the rainbow-stripe overlay.
- **Hairline** (`{colors.hairline}` — #dddddd): The 1px border tone for input outlines, table dividers, secondary-button outlines.

### Text
- **Ink** (`{colors.ink}` — #181d26): The strongest text — h1/h2 display type and primary button text-on-light. Same hex as `{colors.primary}` because they are the same role expressed at type and button layers.
- **Body** (`{colors.body}` — #333840): The default running-text color.
- **Muted** (`{colors.muted}` — #41454d): Footer links, breadcrumbs, captions.
- **Border Strong** (`{colors.border-strong}` — #9297a0): The 1px outline color on disabled secondary buttons.
- **On Primary / On Dark** (`{colors.on-primary}` — #ffffff): The text color on primary buttons and dark surfaces.

### Signature Card Surfaces
These are the colors that carry Airtable''s brand voltage. They appear as full-bleed, full-card surfaces — never as accents on a small element.
- **Coral** (`{colors.signature-coral}` — #aa2d00): The largest signature card on the homepage ("Production apps in prototype speed"). Full-bleed dark coral with white type.
- **Forest** (`{colors.signature-forest}` — #0a2e0e): A deep-green signature card used in the homepage demo-grid cluster.
- **Cream** (`{colors.signature-cream}` — #f5e9d4): The cream callout band ("The path to 10× every person in your organization") — a soft beige surface holding dark type and product UI fragments.
- **Peach** (`{colors.signature-peach}` — #fcab79), **Mint** (`{colors.signature-mint}` — #a8d8c4), **Yellow** (`{colors.signature-yellow}` — #f4d35e), **Mustard** (`{colors.signature-mustard}` — #d9a441): Demo-card surfaces that carry small product UI fragments inside the multi-card grid sections.

### Semantic
- **Link** (`{colors.link}` — #1b61c9): Inline body links and anchor text. Darker on press to `{colors.link-active}` (#1a3866). Despite the `--theme_button-background-primary` CSS-variable name, this color is **not** the primary button color — it is the link color.
- **Info** (`{colors.info}` — #254fad) and **Info Border** (`{colors.info-border}` — #458fff): Inline info badges and focused-input outline.
- **Success** (`{colors.success}` — #006400) and **Success Border** (`{colors.success-border}` — #39bf45): Confirmation states.

## Typography

### Font Family
The system runs **Haas / Haas Groot Disp** (Airtable''s licensed display + text type). Haas Groot Disp covers display sizes (h1 / h2); Haas Grotesk covers everything 24px and below. The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`.

The pricing surface runs a separate **Inter Display** stack at mid-weights (475 / 575) — a deliberate sub-system signaling commercial precision.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 48px | 500 | 1.1 | 0 | Articles page h2 — second-tier editorial headline |
| `{typography.display-lg}` | 40px | 400 | 1.2 | 0 | Homepage h1 hero |
| `{typography.display-md}` | 32px | 400 | 1.2 | 0 | Platform-page h2 — feature-section headlines |
| `{typography.title-lg}` | 24px | 400 | 1.35 | 0.12px | Section titles |
| `{typography.title-md}` | 20px | 400 | 1.5 | 0 | Sub-section titles in tabbed feature cards |
| `{typography.title-sm}` | 18px | 500 | 1.4 | 0 | Article-card titles |
| `{typography.label-md}` | 16px | 500 | 1.4 | 0 | Demo-card titles, list labels |
| `{typography.button}` | 16px | 500 | 1.4 | 0 | Standard CTA button labels |
| `{typography.body-md}` | 14px | 400 | 1.25 | 0 | Body copy, footer links, top-nav items |
| `{typography.caption}` | 14px | 500 | 1.35 | 0.16px | Light captions and meta text |
| `{typography.legal}` | 13.12px | 600 | 1.2 | 0 | Cookie/legal CTA buttons |
| `{typography.pricing-display}` | 44.8px | 475 | 1.1 | 0 | Pricing-page h1 |
| `{typography.pricing-section}` | 28px | 475 | 1.2 | 0 | Pricing-page section heads |
| `{typography.pricing-card-title}` | 20px | 475 | 1.3 | 0 | Pricing tier card plan name |

### Principles
The Haas system prefers weight 400 for display sizes — a 40px h1 is **not** bold. Visual emphasis is delegated to size, color contrast, and the signature surface cards. Where the system does want weight, it pivots to 500 (sub-titles, buttons, article titles), never 600 or 700 in the editorial body. The only true bold (600) lives in `{typography.legal}` — a sign that boldness is reserved for terms-of-service surfaces, not marketing.

The pricing-page sub-system uses Inter Display at `font-weight: 475` — a custom mid-weight between regular (400) and medium (500), shipped as a variable font.

### Note on Font Substitutes
If Haas Groot Disp and Haas Grotesk are unavailable, **Inter Display** (variable) is the closest open-source substitute for both — adjust line-height down by ~5% to match Haas''s tighter cap-height. For the pricing sub-system, use Inter Display directly. On macOS / iOS, **system-ui** is sufficient; on Windows, the chain falls through to Segoe UI, which is a usable but slightly cooler substitute.

## Layout

### Spacing System
- **Base unit:** 4px (all spacing snaps to 4-multiples).
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding (vertical):** `{spacing.section}` (96px) is the universal vertical rhythm constant — every major editorial band on every page uses 96px top + 96px bottom internal padding.
- **Card internal padding:** `{spacing.xl}` (32px) for tabbed feature cards and pricing tier cards; `{spacing.xxl}` (48px) inside signature coral / forest / dark cards; `{spacing.lg}` (24px) for cream callouts and demo-grid cards.
- **Gutters:** `{spacing.lg}` (24px) between cards in 3-up grids; `{spacing.md}` (16px) inside denser logo strips and footer column gutters.

### Grid & Container
- **Max content width:** ~1280px centered, with `{spacing.xxl}` (48px) horizontal breathing room.
- **Editorial body:** Single 8/12-column at large breakpoints, collapsing to single-column on mobile.
- **Demo-card grids:** 3 or 4 columns at desktop, 2 at tablet, 1 at mobile. Card sizes are deliberately uneven within the grid to dodge a uniform "spec sheet" feel.
- **Logo strip:** 6 monochrome partner logos in a single row at desktop; wraps to 3-up on mobile.

### Whitespace Philosophy
Airtable uses whitespace as the dominant atmospheric tool. Hero sections sit in 96px+ of pure whitespace above and below the headline + sub-headline pair, with no decoration in that whitespace. The hero is intentionally calm — there is no gradient, no aurora, no atmospheric mesh behind the type. The system trusts whitespace alone to do the framing.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, footer |
| Soft hairline | 1px `{colors.hairline}` border | Inputs, sub-nav rails, comparison-table dividers, secondary buttons |
| Button rest | Soft drop with subtle blue-tinted glow at low alpha | Primary CTA buttons (the blue tint is a holdover from the link color and reads as a faint accent under the dark button) |
| Button focus | Outer 2px blue ring at higher alpha | Keyboard focus state on primary buttons |
| Card flat | No shadow; relies on color contrast against the surface band | Signature coral / forest / dark cards, cream callouts, demo-grid cards |

The elevation philosophy is **color-block first, shadow second**. Shadows are minimal; depth is delegated to the contrast between white canvas and signature surface cards. There is no soft-glow / atmospheric-shadow / heavy-elevation language anywhere in the marketing system.

### Decorative Depth
- **Vertical rainbow stripes** appear on the articles hero only — multi-color vertical bands sitting on `{colors.surface-dark-elevated}`. This is a single-page treatment, not a system-wide signature.
- **Photography-as-depth** in the demo-card grid: every card carries a real product UI screenshot or mockup, contributing depth through legible artifact density rather than decorative effects.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 2px | Cookie-consent and legal CTA buttons — system-required surfaces |
| `{rounded.sm}` | 6px | Text inputs, small inline buttons |
| `{rounded.md}` | 10px | Secondary content cards, article cards, cream callouts |
| `{rounded.lg}` | 12px | Primary CTA buttons, signature surface cards, tabbed feature cards |
| `{rounded.pill}` | 9999px | Pricing-page CTA buttons (sub-system only) |
| `{rounded.full}` | 9999px / 50% | Circular icon buttons, avatar surfaces |

### Photography Geometry
Product UI screenshots inside demo-card grids retain native aspect ratios (typically 4:3 or 16:10) and crop into `{rounded.md}` containers. Hero illustrations bleed full-width with no rounding. Article-card thumbnails use 16:9 with `{rounded.md}` corners. Avatars in testimonials use `{rounded.full}` (perfect circles). Pricing comparison table images stay rectangular with no rounding.

## Components

> **No hover states documented.** Per the global no-hover policy (Step 6), every component spec below documents only Default and Active/Pressed states. Variants live as separate entries in the `components:` front matter.

**`top-nav`** — A 64px-tall white bar pinned to the top of every page. Airtable wordmark sits at left; primary horizontal menu (Platform, Solutions, Resources, Enterprise, Pricing) sits center-left in `{typography.body-md}`; the right cluster carries a "Book Demo" outline link, "Sign up for free" `{component.button-primary}`, and "Log In" text link. The nav stays light on every page — Airtable does not invert the nav over dark sections.

### Buttons

**`button-primary`** — The signature primary CTA. Background `{colors.primary}` (near-black), text `{colors.on-primary}`, type `{typography.button}`, padding 16px × 24px, rounded `{rounded.lg}` (12px). This is the "Get started for free" / "Sign up for free" button visible on every hero. It reads as confident and final — not decorative — which is why the system uses it sparingly (one per viewport).
- Active state: `button-primary-active` darkens to `{colors.primary-active}` (#0d1218).

**`button-secondary`** — White outline button (e.g. "Book demo"). Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.lg}` (12px), 1px hairline outline. Sits next to `{component.button-primary}` as the "less-committed" choice.

**`button-secondary-on-dark`** — Same shape as `{component.button-secondary}` but used on signature coral / forest / dark surfaces. Background `{colors.canvas}`, text `{colors.ink}` — the white button stays white over dark surfaces because the system never inverts to a translucent on-dark style on the marketing site.

**`button-pricing-pill`** — The pricing-page CTA family. Background `{colors.canvas}`, text `{colors.pricing-ink}`, rounded `{rounded.pill}` (9999px), padding 12px × 24px. The only place pill-shape appears in the marketing system. Treat it as part of the pricing sub-system signaling.

**`button-legal`** — Cookie-consent and legal-banner CTAs. Background `{colors.link}`, text `{colors.on-primary}`, type `{typography.legal}` (13.12px / 600), rounded `{rounded.xs}` (2px), padding 12px × 10px. The 2px corner radius and 600 weight signal "this is a required system surface," not a designed brand surface.

**`button-icon-circular`** — 40px × 40px circular button with `{colors.canvas}` background, hairline border, and `{colors.ink}` icon. Used for carousel controls, "share", and "back" affordances.

**`text-link`** — Inline body links in `{colors.link}` (#1b61c9, the actual link blue). No underline by default. Type inherits `{typography.body-md}`.

### Cards & Containers

**`hero-band`** — The full-page-width white-canvas hero. No surface card, no border, no shadow, no atmospheric gradient — just the headline, sub-headline, and primary + secondary button pair sitting in 96px of whitespace. Vertical padding `{spacing.section}` (96px).

**`signature-coral-card`** — The large full-bleed coral card on the homepage ("Production apps in prototype speed"). Background `{colors.signature-coral}` (#aa2d00, a dark coral / oxide red), text `{colors.on-primary}`, rounded `{rounded.lg}` (12px), internal padding `{spacing.xxl}` (48px). Carries an h2 in `{typography.display-md}`, supporting copy in `{typography.body-md}`, and `{component.button-secondary-on-dark}` as the CTA.

**`signature-forest-card`** — A deep green signature card (`{colors.signature-forest}` — #0a2e0e) used as a demo-grid sibling to the coral card on the homepage.

**`hero-card-dark`** — The dark navy mid-page CTA card (e.g. "The path to 10× every person in your organization"). Background `{colors.surface-dark}` (#181d26), text `{colors.on-dark}`, rounded `{rounded.lg}` (12px), internal padding `{spacing.xxl}` (48px). The same color as `{colors.primary}` because the system uses ink as both type color and signature dark surface.

**`feature-card-tabbed`** — Light-cream cards (e.g. the "Coke / Pelosi / Conde Nast / Time Inc" tabbed feature card on the homepage). Background `{colors.surface-soft}`, rounded `{rounded.lg}` (12px), internal padding `{spacing.xl}` (32px). Left rail carries vertically-stacked tab labels in `{typography.title-md}`; right pane shows the active tab''s content (illustration + body copy + small CTA).

**`cream-callout-card`** — Beige callout cards (`{colors.signature-cream}`). Rounded `{rounded.md}` (10px), internal padding `{spacing.lg}` (24px). Carry product UI fragments or stat callouts — softer than the dark/coral signature cards but still a deliberate brand surface.

**`demo-grid-card`** — Used in multi-card grids that punctuate every page. Background `{colors.canvas}` or one of the demo-grid surfaces (`{colors.signature-peach}`, `{colors.signature-mint}`, `{colors.signature-yellow}`, `{colors.signature-mustard}`), rounded `{rounded.md}` (10px), internal padding `{spacing.md}` (16px). Each card frames a product UI fragment. Card heights vary deliberately to dodge a uniform "spec sheet" feel.

**`logo-strip`** — Horizontal monochrome partner-logo row (HBO, Netflix, Amazon, Time, Conde Nast). Logos render in `{colors.muted}`, surface is `{colors.canvas}`, vertical padding `{spacing.xl}` (32px). 6 logos at desktop, 3 at mobile.

**`article-card`** — The trending-stories grid on the articles page. Background `{colors.canvas}`, rounded `{rounded.md}` (10px), internal padding `{spacing.md}` (16px). Each card carries a colorful illustrated thumbnail (16:9), a small uppercase category tag, an `{typography.title-sm}` title, and a meta line. 3-up at desktop.

**`topic-filter-rail`** — The left rail on the articles page. 240px wide, `{colors.canvas}` background, `{typography.body-md}`, vertically grouped category headings ("Marketing", "Product", "Project management", "Operations") with sub-bullets. Active item carries a small numeric count badge.

### Inputs & Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.sm}` (6px), padding 12px × 16px, height 44px. 1px hairline border in `{colors.hairline}`.

**`text-input-focus`** — Focus state. Border thickens or recolors to `{colors.info-border}`.

### Pricing Sub-System

**`pricing-tier-card`** — Standard tier card. Background `{colors.canvas}`, text `{colors.pricing-ink}`, type `{typography.pricing-card-title}` for the plan name, rounded `{rounded.md}` (10px), internal padding `{spacing.xl}` (32px). Carries the plan name, a price block in `{typography.pricing-display}` (44.8px / 475), feature checklist, and a `{component.button-pricing-pill}` at the bottom.

**`pricing-tier-card-featured`** — The featured tier (typically "Team" or "Business"). Background shifts to `{colors.surface-soft}`. No accent border, no badge — the background tone shift is the only signal.

**`pricing-comparison-row`** — Each row of the long comparison table at the bottom of the pricing page. Labels in the left column; checkmarks or values across 4 plan columns. 12px vertical padding per row, hairline divider between rows.

### Navigation Variants

**`footer`** — Light surface (`{colors.canvas}`), 6-column link list at desktop covering Platform / Solutions / Resources / Learn / Company sub-trees. Vertical padding `{spacing.section}` divided across upper link block and lower legal row. Type `{typography.body-md}`.

**`cta-band-light`** — The light gray "Start building with Airtable" CTA strip near the footer. Background `{colors.surface-strong}` (#e0e2e6), text `{colors.ink}`, rounded `{rounded.lg}` (12px), padding `{spacing.xxl}` (48px). Carries an h2 in `{typography.display-md}` and a `{component.button-primary}`.

### Signature Components

**Articles Vertical Rainbow Stripe Hero** — The articles-page hero treatment. Multi-color vertical bands at varying widths sitting on `{colors.surface-dark-elevated}`. The h1 + sub-head + CTA cluster sits center-left on top of the stripes. This is a single-page hero treatment, not a system-wide signature — do not promote it to a multi-page pattern.

## Do''s and Don''ts

### Do
- Keep `{component.button-primary}` near-black. The brand''s primary CTA is `{colors.primary}`, not the link blue. Mixing them up turns a confident hero into a confused one.
- Reserve `{component.button-primary}` for one primary action per viewport. The system is designed for scarcity at the brand-action layer.
- Use `{component.button-secondary}` (white with hairline outline) as the natural pair with `{component.button-primary}`. The two together form Airtable''s signature button row.
- Trust whitespace as the hero atmosphere. Hero bands are intentionally calm — no gradient, no mesh, no atmospheric backdrop. Going against this reads as off-brand.
- Use `{component.signature-coral-card}`, `{component.signature-forest-card}`, and `{component.hero-card-dark}` to break editorial monotony. These are the brand''s voltage moments.
- Keep `{component.demo-grid-card}` heights uneven within a grid. Uniform heights feel like a spec sheet.
- Treat the pricing surface as its own dialect: keep `{typography.pricing-display}`, `{typography.pricing-card-title}`, and `{component.button-pricing-pill}` together. Mixing them with Haas Grotesk button type breaks the sub-system''s voice.
- Anchor every editorial band with `{spacing.section}` (96px) vertical padding.

### Don''t
- Don''t make `{colors.link}` (#1b61c9) the primary button color. It is the link color. The primary button is `{colors.primary}` (#181d26, near-black). Treating link-blue as the brand action is the most common mistake when reading Airtable''s CSS variables.
- Don''t add a gradient backdrop to the hero. Airtable''s hero is white, full stop. Mesh, aurora, spotlight gradients all read as "another SaaS template" — not Airtable.
- Don''t bold display-weight type. `{typography.display-xl}` and `{typography.display-lg}` are intentionally weight 400 / 500 — going to 700 reads as marketing-page-template.
- Don''t use `{rounded.pill}` outside the pricing surface. It''s a sub-system signal, not a general radius option.
- Don''t repeat the same surface mode in two consecutive bands. The editorial pacing depends on rhythm: white → signature card → white → cream → dark → white. Two whites in a row read as a typography blog.
- Don''t add hover state styling beyond what the system already encodes. The system documents Default and Active/Pressed only.
- Don''t introduce additional accent colors beyond the documented signature card palette. The system''s voltage already uses coral, forest, dark navy, cream, peach, mint, yellow, and mustard.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Single-column body; top nav collapses to hamburger; demo-grid drops to 1-up; signature cards stay full-bleed; logo strip wraps to 2 rows; footer collapses to single-column |
| Tablet | 768–1024px | 2-up demo-grid; top nav stays horizontal but tightens; cream-callout cards stack 2-up; pricing comparison table becomes horizontally scrollable |
| Desktop | 1024–1440px | 3-up demo-grid (and 4-up for tighter content); full top-nav with all menu items visible; pricing tier cards render 4-across |
| Wide | > 1440px | Same as Desktop with more outer breathing room; max content width caps at ~1280px and the page adds outer margin rather than scaling type up |

### Touch Targets
- `{component.button-primary}` and siblings render at 48 × 48px minimum (16px vertical padding + 16px line-height) — comfortably above WCAG AAA''s 44 × 44.
- `{component.button-icon-circular}` is exactly 40 × 40px — slightly under WCAG''s recommended 44, but the centered icon and dot-radius compensate visually.
- `{component.text-input}` height is 44px.

### Collapsing Strategy
- Top nav collapses to a hamburger at < 768px; the menu opens as a full-screen sheet rather than a dropdown.
- Card grids reduce columns rather than scaling cards down.
- The `{component.feature-card-tabbed}` re-stacks the tab rail above the content pane on mobile.
- The pricing comparison table converts to horizontally-scrollable swipe at < 1024px; the four plan headers stay visible while body rows scroll.

### Image Behavior
- Demo-card UI screenshots crop to fit their container rather than scaling up.
- Hero illustrations bleed full-width on mobile, losing horizontal margin.
- Signature card images (inside coral / forest / dark cards) compress to their card width without cropping.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.button-primary}`, `{component.signature-coral-card}`).
2. When adding a new component, decide first which sub-system it belongs to: the main editorial system (Haas, `{rounded.lg}`/`{rounded.md}`) or the pricing sub-system (Inter Display, `{rounded.pill}`).
3. Variants of an existing component (`-active`, `-disabled`, `-focus`) live as separate entries in `components:` — never as nested state objects.
4. Use `{token.refs}` everywhere prose mentions a color, a radius, a typography role, or a spacing value. Hex codes appear at most once next to the reference.
5. Never document hover. The system documents Default and Active/Pressed states only.
6. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
7. When in doubt about emphasis: bigger type before bolder type, signature surface card before solid accent.

## Known Gaps

- The exact hex values of pastel demo-grid surfaces (`{colors.signature-peach}`, `{colors.signature-mint}`, `{colors.signature-yellow}`, `{colors.signature-mustard}`) are inferred from screenshot pixel sampling. Some product launches may swap these surfaces seasonally.
- Hover behavior across all components is not documented (per global no-hover policy).
- Animation and transition timings are not in scope.
- Form validation states beyond `text-input-focus` are not extracted — error and success states for inputs would need a dedicated form page to confirm.
- The pricing comparison table''s checkmark glyph and column-divider widths are described structurally but not formalized as tokens.
- The CSS variable `--theme_button-background-primary: #1b61c9` exists at `:root` but is not used as the primary CTA color anywhere on the marketing site. It maps to the link/info color role instead. Documented here so future extractions don''t re-trip over the misleading variable name.
', now()
  from b
  on conflict (brand_id, original_filename) do update
    set status = 'seeded',
        raw_markdown = excluded.raw_markdown,
        updated_at = now()
  returning id
),
deleted_sections as (
  delete from design_sections where document_id = (select id from d)
),
deleted_tokens as (
  delete from design_tokens where document_id = (select id from d)
)
insert into design_sections (document_id, category, original_title, normalized_title, content_markdown, content_json, confidence, sort_order)
values
((select id from d), 'overview', 'Overview', 'overview', '## Overview

Airtable''s marketing surfaces are quietly editorial. The base atmosphere is white canvas, dark ink type, generous whitespace, and a near-black pill CTA — nothing is fighting for attention until a section needs to. The brand voltage doesn''t come from gradient washes or accent walls; it comes from **full-bleed signature cards** in `{colors.signature-coral}`, `{colors.signature-forest}`, and `{colors.surface-dark}` that punctuate long-scroll explainer pages every two or three screens. Between those signature bands, the page reads like a print magazine: a headline, supporting copy, a small image cluster, then breathing room.

Type voice is Haas Grotesk at modest weights (400 for display, 500 for sub-titles and buttons). Display headlines never go bolder than 500 — emphasis comes from size and color contrast, not from weight. Body copy stays at 14px / 400 throughout. The pricing surface runs its own dialect: **Inter Display** at unusual mid-weights (475 / 575) and **pill-shaped buttons** (`{rounded.pill}`) that don''t appear on any other page — a deliberate sub-system signaling "this page is about commercial precision."

**Key Characteristics:**
- Primary CTA is `{colors.primary}` (near-black ink) with white text and a `{rounded.lg}` (12px) corner — it reads as confident and final, never decorative.
- Secondary CTA is a `{colors.canvas}` button with `{colors.ink}` text and a hairline outline. The two together form Airtable''s signature button pair.
- Hero is white canvas. There is no atmospheric gradient, no mesh, no background flourish. The brand strength comes from the type and the buttons sitting in clean whitespace.
- Brand voltage lives in **signature surface cards**: `{colors.signature-coral}`, `{colors.signature-forest}`, and `{colors.surface-dark}` carry full-bleed product callouts every few screens.
- Demo-card grids carry product UI fragments on `{colors.signature-peach}`, `{colors.signature-mint}`, `{colors.signature-cream}` and other warm pastel surfaces.
- Section rhythm: white canvas → coral signature card → white body → cream callout band → dark navy CTA → light gray CTA banner → footer. The canvas resets between every signature surface.
- Border radius is hierarchical: `{rounded.lg}` (12px) for primary CTAs and large signature cards, `{rounded.md}` (10px) for content cards and demo grids, `{rounded.sm}` (6px) for inputs, `{rounded.full}` for icon buttons. Pricing buttons jump to `{rounded.pill}` to mark themselves as a separate dialect.
- Vertical rhythm is `{spacing.section}` (96px) between major bands — universal across every page.', '{"sourcePath":"docs/design-md/airtable/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #181d26): The dominant brand color. Used for the primary CTA background, h1/h2 display type, and the `{component.surface-dark}` band. Not "blue, then black" — black IS the primary throughout the marketing system.
- **Primary Active** (`{colors.primary-active}` — #0d1218): The press state on primary buttons.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default page surface; the floor of every editorial body.
- **Surface Soft** (`{colors.surface-soft}` — #f8fafc): Tabbed feature cards and the featured pricing tier.
- **Surface Strong** (`{colors.surface-strong}` — #e0e2e6): The light gray "Start building with Airtable" CTA banner near the footer.
- **Surface Dark** (`{colors.surface-dark}` — #181d26): The dark navy CTA cards used mid-page (for example "The path to 10× every person in your organization").
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #1d1f25): The articles-page hero base behind the rainbow-stripe overlay.
- **Hairline** (`{colors.hairline}` — #dddddd): The 1px border tone for input outlines, table dividers, secondary-button outlines.

### Text
- **Ink** (`{colors.ink}` — #181d26): The strongest text — h1/h2 display type and primary button text-on-light. Same hex as `{colors.primary}` because they are the same role expressed at type and button layers.
- **Body** (`{colors.body}` — #333840): The default running-text color.
- **Muted** (`{colors.muted}` — #41454d): Footer links, breadcrumbs, captions.
- **Border Strong** (`{colors.border-strong}` — #9297a0): The 1px outline color on disabled secondary buttons.
- **On Primary / On Dark** (`{colors.on-primary}` — #ffffff): The text color on primary buttons and dark surfaces.

### Signature Card Surfaces
These are the colors that carry Airtable''s brand voltage. They appear as full-bleed, full-card surfaces — never as accents on a small element.
- **Coral** (`{colors.signature-coral}` — #aa2d00): The largest signature card on the homepage ("Production apps in prototype speed"). Full-bleed dark coral with white type.
- **Forest** (`{colors.signature-forest}` — #0a2e0e): A deep-green signature card used in the homepage demo-grid cluster.
- **Cream** (`{colors.signature-cream}` — #f5e9d4): The cream callout band ("The path to 10× every person in your organization") — a soft beige surface holding dark type and product UI fragments.
- **Peach** (`{colors.signature-peach}` — #fcab79), **Mint** (`{colors.signature-mint}` — #a8d8c4), **Yellow** (`{colors.signature-yellow}` — #f4d35e), **Mustard** (`{colors.signature-mustard}` — #d9a441): Demo-card surfaces that carry small product UI fragments inside the multi-card grid sections.

### Semantic
- **Link** (`{colors.link}` — #1b61c9): Inline body links and anchor text. Darker on press to `{colors.link-active}` (#1a3866). Despite the `--theme_button-background-primary` CSS-variable name, this color is **not** the primary button color — it is the link color.
- **Info** (`{colors.info}` — #254fad) and **Info Border** (`{colors.info-border}` — #458fff): Inline info badges and focused-input outline.
- **Success** (`{colors.success}` — #006400) and **Success Border** (`{colors.success-border}` — #39bf45): Confirmation states.', '{"sourcePath":"docs/design-md/airtable/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The system runs **Haas / Haas Groot Disp** (Airtable''s licensed display + text type). Haas Groot Disp covers display sizes (h1 / h2); Haas Grotesk covers everything 24px and below. The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`.

The pricing surface runs a separate **Inter Display** stack at mid-weights (475 / 575) — a deliberate sub-system signaling commercial precision.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 48px | 500 | 1.1 | 0 | Articles page h2 — second-tier editorial headline |
| `{typography.display-lg}` | 40px | 400 | 1.2 | 0 | Homepage h1 hero |
| `{typography.display-md}` | 32px | 400 | 1.2 | 0 | Platform-page h2 — feature-section headlines |
| `{typography.title-lg}` | 24px | 400 | 1.35 | 0.12px | Section titles |
| `{typography.title-md}` | 20px | 400 | 1.5 | 0 | Sub-section titles in tabbed feature cards |
| `{typography.title-sm}` | 18px | 500 | 1.4 | 0 | Article-card titles |
| `{typography.label-md}` | 16px | 500 | 1.4 | 0 | Demo-card titles, list labels |
| `{typography.button}` | 16px | 500 | 1.4 | 0 | Standard CTA button labels |
| `{typography.body-md}` | 14px | 400 | 1.25 | 0 | Body copy, footer links, top-nav items |
| `{typography.caption}` | 14px | 500 | 1.35 | 0.16px | Light captions and meta text |
| `{typography.legal}` | 13.12px | 600 | 1.2 | 0 | Cookie/legal CTA buttons |
| `{typography.pricing-display}` | 44.8px | 475 | 1.1 | 0 | Pricing-page h1 |
| `{typography.pricing-section}` | 28px | 475 | 1.2 | 0 | Pricing-page section heads |
| `{typography.pricing-card-title}` | 20px | 475 | 1.3 | 0 | Pricing tier card plan name |

### Principles
The Haas system prefers weight 400 for display sizes — a 40px h1 is **not** bold. Visual emphasis is delegated to size, color contrast, and the signature surface cards. Where the system does want weight, it pivots to 500 (sub-titles, buttons, article titles), never 600 or 700 in the editorial body. The only true bold (600) lives in `{typography.legal}` — a sign that boldness is reserved for terms-of-service surfaces, not marketing.

The pricing-page sub-system uses Inter Display at `font-weight: 475` — a custom mid-weight between regular (400) and medium (500), shipped as a variable font.

### Note on Font Substitutes
If Haas Groot Disp and Haas Grotesk are unavailable, **Inter Display** (variable) is the closest open-source substitute for both — adjust line-height down by ~5% to match Haas''s tighter cap-height. For the pricing sub-system, use Inter Display directly. On macOS / iOS, **system-ui** is sufficient; on Windows, the chain falls through to Segoe UI, which is a usable but slightly cooler substitute.', '{"sourcePath":"docs/design-md/airtable/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px (all spacing snaps to 4-multiples).
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding (vertical):** `{spacing.section}` (96px) is the universal vertical rhythm constant — every major editorial band on every page uses 96px top + 96px bottom internal padding.
- **Card internal padding:** `{spacing.xl}` (32px) for tabbed feature cards and pricing tier cards; `{spacing.xxl}` (48px) inside signature coral / forest / dark cards; `{spacing.lg}` (24px) for cream callouts and demo-grid cards.
- **Gutters:** `{spacing.lg}` (24px) between cards in 3-up grids; `{spacing.md}` (16px) inside denser logo strips and footer column gutters.

### Grid & Container
- **Max content width:** ~1280px centered, with `{spacing.xxl}` (48px) horizontal breathing room.
- **Editorial body:** Single 8/12-column at large breakpoints, collapsing to single-column on mobile.
- **Demo-card grids:** 3 or 4 columns at desktop, 2 at tablet, 1 at mobile. Card sizes are deliberately uneven within the grid to dodge a uniform "spec sheet" feel.
- **Logo strip:** 6 monochrome partner logos in a single row at desktop; wraps to 3-up on mobile.

### Whitespace Philosophy
Airtable uses whitespace as the dominant atmospheric tool. Hero sections sit in 96px+ of pure whitespace above and below the headline + sub-headline pair, with no decoration in that whitespace. The hero is intentionally calm — there is no gradient, no aurora, no atmospheric mesh behind the type. The system trusts whitespace alone to do the framing.', '{"sourcePath":"docs/design-md/airtable/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, footer |
| Soft hairline | 1px `{colors.hairline}` border | Inputs, sub-nav rails, comparison-table dividers, secondary buttons |
| Button rest | Soft drop with subtle blue-tinted glow at low alpha | Primary CTA buttons (the blue tint is a holdover from the link color and reads as a faint accent under the dark button) |
| Button focus | Outer 2px blue ring at higher alpha | Keyboard focus state on primary buttons |
| Card flat | No shadow; relies on color contrast against the surface band | Signature coral / forest / dark cards, cream callouts, demo-grid cards |

The elevation philosophy is **color-block first, shadow second**. Shadows are minimal; depth is delegated to the contrast between white canvas and signature surface cards. There is no soft-glow / atmospheric-shadow / heavy-elevation language anywhere in the marketing system.

### Decorative Depth
- **Vertical rainbow stripes** appear on the articles hero only — multi-color vertical bands sitting on `{colors.surface-dark-elevated}`. This is a single-page treatment, not a system-wide signature.
- **Photography-as-depth** in the demo-card grid: every card carries a real product UI screenshot or mockup, contributing depth through legible artifact density rather than decorative effects.', '{"sourcePath":"docs/design-md/airtable/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 2px | Cookie-consent and legal CTA buttons — system-required surfaces |
| `{rounded.sm}` | 6px | Text inputs, small inline buttons |
| `{rounded.md}` | 10px | Secondary content cards, article cards, cream callouts |
| `{rounded.lg}` | 12px | Primary CTA buttons, signature surface cards, tabbed feature cards |
| `{rounded.pill}` | 9999px | Pricing-page CTA buttons (sub-system only) |
| `{rounded.full}` | 9999px / 50% | Circular icon buttons, avatar surfaces |

### Photography Geometry
Product UI screenshots inside demo-card grids retain native aspect ratios (typically 4:3 or 16:10) and crop into `{rounded.md}` containers. Hero illustrations bleed full-width with no rounding. Article-card thumbnails use 16:9 with `{rounded.md}` corners. Avatars in testimonials use `{rounded.full}` (perfect circles). Pricing comparison table images stay rectangular with no rounding.', '{"sourcePath":"docs/design-md/airtable/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> **No hover states documented.** Per the global no-hover policy (Step 6), every component spec below documents only Default and Active/Pressed states. Variants live as separate entries in the `components:` front matter.

**`top-nav`** — A 64px-tall white bar pinned to the top of every page. Airtable wordmark sits at left; primary horizontal menu (Platform, Solutions, Resources, Enterprise, Pricing) sits center-left in `{typography.body-md}`; the right cluster carries a "Book Demo" outline link, "Sign up for free" `{component.button-primary}`, and "Log In" text link. The nav stays light on every page — Airtable does not invert the nav over dark sections.

### Buttons

**`button-primary`** — The signature primary CTA. Background `{colors.primary}` (near-black), text `{colors.on-primary}`, type `{typography.button}`, padding 16px × 24px, rounded `{rounded.lg}` (12px). This is the "Get started for free" / "Sign up for free" button visible on every hero. It reads as confident and final — not decorative — which is why the system uses it sparingly (one per viewport).
- Active state: `button-primary-active` darkens to `{colors.primary-active}` (#0d1218).

**`button-secondary`** — White outline button (e.g. "Book demo"). Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.lg}` (12px), 1px hairline outline. Sits next to `{component.button-primary}` as the "less-committed" choice.

**`button-secondary-on-dark`** — Same shape as `{component.button-secondary}` but used on signature coral / forest / dark surfaces. Background `{colors.canvas}`, text `{colors.ink}` — the white button stays white over dark surfaces because the system never inverts to a translucent on-dark style on the marketing site.

**`button-pricing-pill`** — The pricing-page CTA family. Background `{colors.canvas}`, text `{colors.pricing-ink}`, rounded `{rounded.pill}` (9999px), padding 12px × 24px. The only place pill-shape appears in the marketing system. Treat it as part of the pricing sub-system signaling.

**`button-legal`** — Cookie-consent and legal-banner CTAs. Background `{colors.link}`, text `{colors.on-primary}`, type `{typography.legal}` (13.12px / 600), rounded `{rounded.xs}` (2px), padding 12px × 10px. The 2px corner radius and 600 weight signal "this is a required system surface," not a designed brand surface.

**`button-icon-circular`** — 40px × 40px circular button with `{colors.canvas}` background, hairline border, and `{colors.ink}` icon. Used for carousel controls, "share", and "back" affordances.

**`text-link`** — Inline body links in `{colors.link}` (#1b61c9, the actual link blue). No underline by default. Type inherits `{typography.body-md}`.

### Cards & Containers

**`hero-band`** — The full-page-width white-canvas hero. No surface card, no border, no shadow, no atmospheric gradient — just the headline, sub-headline, and primary + secondary button pair sitting in 96px of whitespace. Vertical padding `{spacing.section}` (96px).

**`signature-coral-card`** — The large full-bleed coral card on the homepage ("Production apps in prototype speed"). Background `{colors.signature-coral}` (#aa2d00, a dark coral / oxide red), text `{colors.on-primary}`, rounded `{rounded.lg}` (12px), internal padding `{spacing.xxl}` (48px). Carries an h2 in `{typography.display-md}`, supporting copy in `{typography.body-md}`, and `{component.button-secondary-on-dark}` as the CTA.

**`signature-forest-card`** — A deep green signature card (`{colors.signature-forest}` — #0a2e0e) used as a demo-grid sibling to the coral card on the homepage.

**`hero-card-dark`** — The dark navy mid-page CTA card (e.g. "The path to 10× every person in your organization"). Background `{colors.surface-dark}` (#181d26), text `{colors.on-dark}`, rounded `{rounded.lg}` (12px), internal padding `{spacing.xxl}` (48px). The same color as `{colors.primary}` because the system uses ink as both type color and signature dark surface.

**`feature-card-tabbed`** — Light-cream cards (e.g. the "Coke / Pelosi / Conde Nast / Time Inc" tabbed feature card on the homepage). Background `{colors.surface-soft}`, rounded `{rounded.lg}` (12px), internal padding `{spacing.xl}` (32px). Left rail carries vertically-stacked tab labels in `{typography.title-md}`; right pane shows the active tab''s content (illustration + body copy + small CTA).

**`cream-callout-card`** — Beige callout cards (`{colors.signature-cream}`). Rounded `{rounded.md}` (10px), internal padding `{spacing.lg}` (24px). Carry product UI fragments or stat callouts — softer than the dark/coral signature cards but still a deliberate brand surface.

**`demo-grid-card`** — Used in multi-card grids that punctuate every page. Background `{colors.canvas}` or one of the demo-grid surfaces (`{colors.signature-peach}`, `{colors.signature-mint}`, `{colors.signature-yellow}`, `{colors.signature-mustard}`), rounded `{rounded.md}` (10px), internal padding `{spacing.md}` (16px). Each card frames a product UI fragment. Card heights vary deliberately to dodge a uniform "spec sheet" feel.

**`logo-strip`** — Horizontal monochrome partner-logo row (HBO, Netflix, Amazon, Time, Conde Nast). Logos render in `{colors.muted}`, surface is `{colors.canvas}`, vertical padding `{spacing.xl}` (32px). 6 logos at desktop, 3 at mobile.

**`article-card`** — The trending-stories grid on the articles page. Background `{colors.canvas}`, rounded `{rounded.md}` (10px), internal padding `{spacing.md}` (16px). Each card carries a colorful illustrated thumbnail (16:9), a small uppercase category tag, an `{typography.title-sm}` title, and a meta line. 3-up at desktop.

**`topic-filter-rail`** — The left rail on the articles page. 240px wide, `{colors.canvas}` background, `{typography.body-md}`, vertically grouped category headings ("Marketing", "Product", "Project management", "Operations") with sub-bullets. Active item carries a small numeric count badge.

### Inputs & Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.sm}` (6px), padding 12px × 16px, height 44px. 1px hairline border in `{colors.hairline}`.

**`text-input-focus`** — Focus state. Border thickens or recolors to `{colors.info-border}`.

### Pricing Sub-System

**`pricing-tier-card`** — Standard tier card. Background `{colors.canvas}`, text `{colors.pricing-ink}`, type `{typography.pricing-card-title}` for the plan name, rounded `{rounded.md}` (10px), internal padding `{spacing.xl}` (32px). Carries the plan name, a price block in `{typography.pricing-display}` (44.8px / 475), feature checklist, and a `{component.button-pricing-pill}` at the bottom.

**`pricing-tier-card-featured`** — The featured tier (typically "Team" or "Business"). Background shifts to `{colors.surface-soft}`. No accent border, no badge — the background tone shift is the only signal.

**`pricing-comparison-row`** — Each row of the long comparison table at the bottom of the pricing page. Labels in the left column; checkmarks or values across 4 plan columns. 12px vertical padding per row, hairline divider between rows.

### Navigation Variants

**`footer`** — Light surface (`{colors.canvas}`), 6-column link list at desktop covering Platform / Solutions / Resources / Learn / Company sub-trees. Vertical padding `{spacing.section}` divided across upper link block and lower legal row. Type `{typography.body-md}`.

**`cta-band-light`** — The light gray "Start building with Airtable" CTA strip near the footer. Background `{colors.surface-strong}` (#e0e2e6), text `{colors.ink}`, rounded `{rounded.lg}` (12px), padding `{spacing.xxl}` (48px). Carries an h2 in `{typography.display-md}` and a `{component.button-primary}`.

### Signature Components

**Articles Vertical Rainbow Stripe Hero** — The articles-page hero treatment. Multi-color vertical bands at varying widths sitting on `{colors.surface-dark-elevated}`. The h1 + sub-head + CTA cluster sits center-left on top of the stripes. This is a single-page hero treatment, not a system-wide signature — do not promote it to a multi-page pattern.', '{"sourcePath":"docs/design-md/airtable/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Keep `{component.button-primary}` near-black. The brand''s primary CTA is `{colors.primary}`, not the link blue. Mixing them up turns a confident hero into a confused one.
- Reserve `{component.button-primary}` for one primary action per viewport. The system is designed for scarcity at the brand-action layer.
- Use `{component.button-secondary}` (white with hairline outline) as the natural pair with `{component.button-primary}`. The two together form Airtable''s signature button row.
- Trust whitespace as the hero atmosphere. Hero bands are intentionally calm — no gradient, no mesh, no atmospheric backdrop. Going against this reads as off-brand.
- Use `{component.signature-coral-card}`, `{component.signature-forest-card}`, and `{component.hero-card-dark}` to break editorial monotony. These are the brand''s voltage moments.
- Keep `{component.demo-grid-card}` heights uneven within a grid. Uniform heights feel like a spec sheet.
- Treat the pricing surface as its own dialect: keep `{typography.pricing-display}`, `{typography.pricing-card-title}`, and `{component.button-pricing-pill}` together. Mixing them with Haas Grotesk button type breaks the sub-system''s voice.
- Anchor every editorial band with `{spacing.section}` (96px) vertical padding.

### Don''t
- Don''t make `{colors.link}` (#1b61c9) the primary button color. It is the link color. The primary button is `{colors.primary}` (#181d26, near-black). Treating link-blue as the brand action is the most common mistake when reading Airtable''s CSS variables.
- Don''t add a gradient backdrop to the hero. Airtable''s hero is white, full stop. Mesh, aurora, spotlight gradients all read as "another SaaS template" — not Airtable.
- Don''t bold display-weight type. `{typography.display-xl}` and `{typography.display-lg}` are intentionally weight 400 / 500 — going to 700 reads as marketing-page-template.
- Don''t use `{rounded.pill}` outside the pricing surface. It''s a sub-system signal, not a general radius option.
- Don''t repeat the same surface mode in two consecutive bands. The editorial pacing depends on rhythm: white → signature card → white → cream → dark → white. Two whites in a row read as a typography blog.
- Don''t add hover state styling beyond what the system already encodes. The system documents Default and Active/Pressed only.
- Don''t introduce additional accent colors beyond the documented signature card palette. The system''s voltage already uses coral, forest, dark navy, cream, peach, mint, yellow, and mustard.', '{"sourcePath":"docs/design-md/airtable/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Single-column body; top nav collapses to hamburger; demo-grid drops to 1-up; signature cards stay full-bleed; logo strip wraps to 2 rows; footer collapses to single-column |
| Tablet | 768–1024px | 2-up demo-grid; top nav stays horizontal but tightens; cream-callout cards stack 2-up; pricing comparison table becomes horizontally scrollable |
| Desktop | 1024–1440px | 3-up demo-grid (and 4-up for tighter content); full top-nav with all menu items visible; pricing tier cards render 4-across |
| Wide | > 1440px | Same as Desktop with more outer breathing room; max content width caps at ~1280px and the page adds outer margin rather than scaling type up |

### Touch Targets
- `{component.button-primary}` and siblings render at 48 × 48px minimum (16px vertical padding + 16px line-height) — comfortably above WCAG AAA''s 44 × 44.
- `{component.button-icon-circular}` is exactly 40 × 40px — slightly under WCAG''s recommended 44, but the centered icon and dot-radius compensate visually.
- `{component.text-input}` height is 44px.

### Collapsing Strategy
- Top nav collapses to a hamburger at < 768px; the menu opens as a full-screen sheet rather than a dropdown.
- Card grids reduce columns rather than scaling cards down.
- The `{component.feature-card-tabbed}` re-stacks the tab rail above the content pane on mobile.
- The pricing comparison table converts to horizontally-scrollable swipe at < 1024px; the four plan headers stay visible while body rows scroll.

### Image Behavior
- Demo-card UI screenshots crop to fit their container rather than scaling up.
- Hero illustrations bleed full-width on mobile, losing horizontal margin.
- Signature card images (inside coral / forest / dark cards) compress to their card width without cropping.', '{"sourcePath":"docs/design-md/airtable/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.button-primary}`, `{component.signature-coral-card}`).
2. When adding a new component, decide first which sub-system it belongs to: the main editorial system (Haas, `{rounded.lg}`/`{rounded.md}`) or the pricing sub-system (Inter Display, `{rounded.pill}`).
3. Variants of an existing component (`-active`, `-disabled`, `-focus`) live as separate entries in `components:` — never as nested state objects.
4. Use `{token.refs}` everywhere prose mentions a color, a radius, a typography role, or a spacing value. Hex codes appear at most once next to the reference.
5. Never document hover. The system documents Default and Active/Pressed states only.
6. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
7. When in doubt about emphasis: bigger type before bolder type, signature surface card before solid accent.', '{"sourcePath":"docs/design-md/airtable/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- The exact hex values of pastel demo-grid surfaces (`{colors.signature-peach}`, `{colors.signature-mint}`, `{colors.signature-yellow}`, `{colors.signature-mustard}`) are inferred from screenshot pixel sampling. Some product launches may swap these surfaces seasonally.
- Hover behavior across all components is not documented (per global no-hover policy).
- Animation and transition timings are not in scope.
- Form validation states beyond `text-input-focus` are not extracted — error and success states for inputs would need a dedicated form page to confirm.
- The pricing comparison table''s checkmark glyph and column-divider widths are described structurally but not formalized as tokens.
- The CSS variable `--theme_button-background-primary: #1b61c9` exists at `:root` but is not used as the primary CTA color anywhere on the marketing site. It maps to the link/info color role instead. Documented here so future extractions don''t re-trip over the misleading variable name.', '{"sourcePath":"docs/design-md/airtable/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_1', '#181d26', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_2', '#0d1218', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_3', '#333840', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_4', '#41454d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_5', '#dddddd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_6', '#9297a0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_7', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_8', '#f8fafc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_9', '#e0e2e6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_10', '#1d1f25', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_11', '#aa2d00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_12', '#0a2e0e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_13', '#f5e9d4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_14', '#fcab79', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_15', '#a8d8c4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_16', '#f4d35e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_17', '#d9a441', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_18', '#1b61c9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_19', '#1a3866', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_20', '#254fad', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_21', '#458fff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_22', '#006400', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'color', 'color_23', '#39bf45', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'typography', 'font_1', 'Haas Groot Disp, Haas, sans-serif', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'typography', 'font_2', 'Haas, sans-serif', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'typography', 'font_3', 'Inter Display, system-ui, sans-serif', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md'), 'typography', 'font_4', 'fontFamily: "Inter Display, system-ui, sans-serif', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/airtable/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/airtable/DESIGN.md';


-- Apple
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Apple', 'apple', 'design-reference', null, now())
  on conflict (slug) do update
    set name = excluded.name,
        category = excluded.category,
        updated_at = now()
  returning id
),
d as (
  insert into design_documents (
    brand_id,
    source_type,
    original_filename,
    original_blob_url,
    status,
    raw_markdown,
    updated_at
  )
  select id, 'markdown_seed', 'docs/design-md/apple/DESIGN.md', null, 'seeded', '---
version: alpha
name: Apple-design-analysis
description: A photography-first interface that turns marketing into a museum gallery. Edge-to-edge product tiles alternate light and dark canvases, framed by SF Pro Display headlines with negative letter-spacing and a single Action Blue (#0066cc) interactive color. UI chrome recedes so the product can speak — no decorative gradients, no shadows on chrome, only the one signature drop-shadow under product imagery resting on a surface.

colors:
  primary: "#0066cc"
  primary-focus: "#0071e3"
  primary-on-dark: "#2997ff"
  ink: "#1d1d1f"
  body: "#1d1d1f"
  body-on-dark: "#ffffff"
  body-muted: "#cccccc"
  ink-muted-80: "#333333"
  ink-muted-48: "#7a7a7a"
  divider-soft: "#f0f0f0"
  hairline: "#e0e0e0"
  canvas: "#ffffff"
  canvas-parchment: "#f5f5f7"
  surface-pearl: "#fafafc"
  surface-tile-1: "#272729"
  surface-tile-2: "#2a2a2c"
  surface-tile-3: "#252527"
  surface-black: "#000000"
  surface-chip-translucent: "#d2d2d7"
  on-primary: "#ffffff"
  on-dark: "#ffffff"

typography:
  hero-display:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: -0.28px
  display-lg:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0
  display-md:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.47
    letterSpacing: -0.374px
  lead:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: 0.196px
  lead-airy:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 24px
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: 0
  tagline:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.19
    letterSpacing: 0.231px
  body-strong:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.24
    letterSpacing: -0.374px
  body:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: -0.374px
  dense-link:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 2.41
    letterSpacing: 0
  caption:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: -0.224px
  caption-strong:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: -0.224px
  button-large:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.0
    letterSpacing: 0
  button-utility:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: -0.224px
  fine-print:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.12px
  micro-legal:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.08px
  nav-link:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.12px

rounded:
  none: 0px
  xs: 5px
  sm: 8px
  md: 11px
  lg: 18px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 17px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 11px 22px
  button-primary-focus:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-primary-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-secondary-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 11px 22px
  button-dark-utility:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-utility}"
    rounded: "{rounded.sm}"
    padding: 8px 15px
  button-pearl-capsule:
    backgroundColor: "{colors.surface-pearl}"
    textColor: "{colors.ink-muted-80}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-store-hero:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-large}"
    rounded: "{rounded.pill}"
    padding: 14px 28px
  button-icon-circular:
    backgroundColor: "{colors.surface-chip-translucent}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 44px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body}"
  text-link-on-dark:
    backgroundColor: transparent
    textColor: "{colors.primary-on-dark}"
    typography: "{typography.body}"
  global-nav:
    backgroundColor: "{colors.surface-black}"
    textColor: "{colors.on-dark}"
    typography: "{typography.nav-link}"
    height: 44px
  sub-nav-frosted:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.tagline}"
    height: 52px
  product-tile-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-parchment:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-dark:
    backgroundColor: "{colors.surface-tile-1}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-dark-2:
    backgroundColor: "{colors.surface-tile-2}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
  product-tile-dark-3:
    backgroundColor: "{colors.surface-tile-3}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
  store-utility-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.lg}"
    padding: 24px
  configurator-option-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 12px 16px
  configurator-option-chip-selected:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  search-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 12px 20px
    height: 44px
  floating-sticky-bar:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: 64px
    padding: 12px 32px
  environment-quote-card:
    backgroundColor: "{colors.surface-tile-1}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  footer:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink-muted-80}"
    typography: "{typography.fine-print}"
    padding: 64px
---

## Overview

Apple''s web presence is a masterclass in **reverent product photography framed by near-invisible UI**. Every page is a stack of edge-to-edge product "tiles" — alternating light and dark canvases, each centered on a hero headline, a one-line tagline, two tiny blue pill CTAs, and an impossibly crisp product render. Nothing competes with the product. Typography is confident but quiet; color is either pure white, an off-white parchment, or a near-black tile; interactive elements are a single, quiet blue.

Density is unusually low even by contemporary SaaS standards. Each tile occupies roughly one viewport, and there is no decorative chrome — no borders, no gradients, no decorative frames, no shadows on headlines. Elevation appears only when a product image rests on a surface (a single soft `rgba(0, 0, 0, 0.22) 3px 5px 30px` drop for visual weight). The result is a catalog that feels more like a museum gallery: the wall disappears and the artifact takes over.

Store and shop surfaces retain the same chassis but switch modes. The product configurator (iPhone 17 Pro, accessories grid) introduces a tight grid of white utility cards at `{rounded.lg}` (18px) radius with a thin border, paired with a persistent thin sub-nav strip. The environment page leans darker and more editorial. Across all five surfaces the typographic system, spacing rhythm, and the single blue accent are consistent — this is one design language expressed at different volumes.

**Key Characteristics:**
- Photography-first presentation; UI recedes so the product can speak.
- Alternating full-bleed tile sections: white/parchment ↔ near-black, with the color change itself acting as the section divider.
- Single blue accent (`{colors.primary}` — #0066cc) carries every interactive element. No second brand color exists.
- Two button grammars: tiny blue pill CTAs (`{rounded.pill}`) and compact utility rects (`{rounded.sm}`).
- SF Pro Display + SF Pro Text — negative letter-spacing at display sizes for the signature "Apple tight" headline feel.
- Whisper-soft elevation used only when a product image needs to breathe — exactly one drop-shadow in the entire system.
- Tight two-row nav: slim `{component.global-nav}` + product-specific `{component.sub-nav-frosted}` with persistent right-aligned primary CTA.
- Section rhythm across multiple pages: light hero → dark product tile → light utility tile → dark tile → parchment footer — a predictable pulse.

## Colors

> **Source pages analyzed:** homepage, environment, store, iPhone 17 Pro buy page, accessories index. The color system is identical across all five surfaces; only the surface-mode mix differs.

### Brand & Accent
- **Action Blue** (`{colors.primary}` — #0066cc): The single brand-level interactive color. All text links, all blue pill CTAs ("Learn more", "Buy"), and the focus ring root. This is Apple''s quiet but universal "click me" signal. Press state shifts to a slightly darker variant via the active scale transform rather than a hex change.
- **Focus Blue** (`{colors.primary-focus}` — #0071e3): A marginally brighter sibling of Action Blue, reserved for the keyboard focus ring on buttons (`outline: 2px solid`).
- **Sky Link Blue** (`{colors.primary-on-dark}` — #2997ff): A brighter blue used on dark surfaces for in-copy links and inline callouts, where Action Blue would disappear against the tile background.

### Surface
- **Pure White** (`{colors.canvas}` — #ffffff): The dominant canvas. Content, utility cards, store tiles, configurator grids.
- **Parchment** (`{colors.canvas-parchment}` — #f5f5f7): The signature Apple off-white. Used for alternating light tiles, footer region, and the default page canvas in store utility sections. Just different enough from white to create rhythm.
- **Pearl Button** (`{colors.surface-pearl}` — #fafafc): A near-white used as the fill for secondary "ghost" buttons — lighter than the parchment canvas so the button still reads as a button against `{colors.canvas-parchment}`.
- **Near-Black Tile 1** (`{colors.surface-tile-1}` — #272729): The primary dark-tile surface on the homepage product grid.
- **Near-Black Tile 2** (`{colors.surface-tile-2}` — #2a2a2c): A micro-step lighter — used where a dark tile sits directly above or below Tile 1 to create the faintest separation.
- **Near-Black Tile 3** (`{colors.surface-tile-3}` — #252527): A micro-step darker — used at the bottom of the stack and in embedded video/player frames.
- **Pure Black** (`{colors.surface-black}` — #000000): Reserved for true void — video player backgrounds, edge-to-edge photographic overlays, the global nav bar background.
- **Translucent Chip Gray** (`{colors.surface-chip-translucent}` — #d2d2d7): The base hex of the translucent gray chip used over photography for circular control buttons. In production, applied at ~64% alpha as `rgba(210, 210, 215, 0.64)`.

### Text
- **Near-Black Ink** (`{colors.ink}` — #1d1d1f): The voice of every headline, every body paragraph, and the dark utility button''s fill. Chosen instead of pure black to keep the page feeling photographic rather than printed.
- **Body** (`{colors.body}` — #1d1d1f): Same hex as ink — Apple uses one near-black tone for all text on light surfaces.
- **Body On Dark** (`{colors.body-on-dark}` — #ffffff): All text on dark tiles and on the global nav bar.
- **Body Muted** (`{colors.body-muted}` — #cccccc): Secondary copy on dark tiles where pure white would be too loud.
- **Ink Muted 80** (`{colors.ink-muted-80}` — #333333): Body text on the white Pearl Button surface — slightly softer than pure black.
- **Ink Muted 48** (`{colors.ink-muted-48}` — #7a7a7a): Disabled button text and legal fine-print.

### Hairlines & Borders
- **Divider Soft** (`{colors.divider-soft}` — #f0f0f0): The "border" tone on secondary buttons — functions as a ring shadow rather than a hard line. In production, often applied as `rgba(0, 0, 0, 0.04)`.
- **Hairline** (`{colors.hairline}` — #e0e0e0): The 1px hairline border on store utility cards and configurator chips.

### Brand Gradient
**No decorative gradients.** Atmospheric depth on product photography (the iPhone 17 Pro camera plate, the Apple Watch bands, AirPods reflections) is inherent to the imagery, not a CSS gradient overlay. The environment page''s hero uses photographic atmosphere (mountain vista at dawn) but no gradient tokens are defined. Apple is the rare luxury-brand site with zero gradient-based design tokens.

## Typography

### Font Family
- **Display**: `SF Pro Display, system-ui, -apple-system, sans-serif` — Apple''s proprietary display face, optimized for sizes ≥ 19px. Defines the voice of every headline.
- **Body / UI**: `SF Pro Text, system-ui, -apple-system, sans-serif` — the text-optimized variant used for body copy, captions, buttons, and links below 20px.
- **OpenType features**: `font-variant-numeric: numerator` is enabled on numeric links (pricing tables, spec sheets). Display sizes rely on tight tracking rather than contextual ligatures.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 56px | 600 | 1.07 | -0.28px | Hero headline; the signature "Apple tight" tracking |
| `{typography.display-lg}` | 40px | 600 | 1.10 | 0 | Tile headlines atop every product tile |
| `{typography.display-md}` | 34px | 600 | 1.47 | -0.374px | Section heads (SF Pro Text at display proportions) |
| `{typography.lead}` | 28px | 400 | 1.14 | 0.196px | Product tile subcopy |
| `{typography.lead-airy}` | 24px | 300 | 1.5 | 0 | Environment-page lead paragraphs (the rare weight 300) |
| `{typography.tagline}` | 21px | 600 | 1.19 | 0.231px | Sub-tile tagline; sub-nav category name |
| `{typography.body-strong}` | 17px | 600 | 1.24 | -0.374px | Inline strong emphasis |
| `{typography.body}` | 17px | 400 | 1.47 | -0.374px | Default paragraph |
| `{typography.dense-link}` | 17px | 400 | 2.41 | 0 | Footer / store utility link lists (relaxed leading) |
| `{typography.caption}` | 14px | 400 | 1.43 | -0.224px | Secondary captions, button text |
| `{typography.caption-strong}` | 14px | 600 | 1.29 | -0.224px | Emphasized captions |
| `{typography.button-large}` | 18px | 300 | 1.0 | 0 | Store hero CTAs (the rare weight 300) |
| `{typography.button-utility}` | 14px | 400 | 1.29 | -0.224px | Utility/nav button labels |
| `{typography.fine-print}` | 12px | 400 | 1.0 | -0.12px | Fine-print, footer body |
| `{typography.micro-legal}` | 10px | 400 | 1.3 | -0.08px | Micro legal disclaimers |
| `{typography.nav-link}` | 12px | 400 | 1.0 | -0.12px | Global nav menu items |

### Principles

- **Negative letter-spacing at display sizes.** Every headline at 17px and up carries a slight tracking tighten (`-0.12 → -0.374px`). This produces the iconic "Apple tight" headline cadence. Never used at 12px or below.
- **Body copy at 17px, not 16px.** Apple breaks the SaaS convention and runs paragraph text at 17px. The extra pixel gives the page an unmistakable "reading, not scanning" pace.
- **Weight 300 is real and rare.** Used deliberately on a handful of large-size reads (`{typography.button-large}` at 18px/300 and `{typography.lead-airy}` at 24px/300). It''s not an accident — it''s a light-atmosphere cue reserved for moments where the content should feel airy.
- **Weight 600, not 700, for headlines.** Apple''s headlines sit at weight 600. Weight 700 is used sparingly for `{typography.tagline}` (21px) when a touch more assertion is needed.
- **Line-height is context-specific.** Display sizes use 1.07–1.19 (tight). Body uses 1.47. Utility link stacks in the footer/store use an unusually relaxed 2.41 (`{typography.dense-link}`). The 2.41 is not a bug — it''s how the footer''s dense link columns breathe.
- **Weight 500 is deliberately absent.** The ladder is 300 / 400 / 600 / 700. Mid-weight readings always use 600.

### Note on Font Substitutes
SF Pro is Apple''s proprietary system font. When building off-system:

- Use `system-ui, -apple-system, BlinkMacSystemFont` as the first stack entry — on macOS/iOS/Safari this resolves to the real SF Pro.
- For non-Apple platforms, **Inter** (Google Fonts, variable) is the closest open-source equivalent. Inter at weight 600 with `font-feature-settings: "ss03"` approximates SF Pro''s rounded "a" character.
- Nudge `letter-spacing` down by `-0.01em` on display sizes to re-create the Apple tight feel; Inter''s default tracking runs slightly wider than SF Pro.
- For body text, tighten line-height by `0.03` (from 1.47 → 1.44) when substituting Inter — Inter''s taller x-height needs less leading.

## Layout

### Spacing System
- **Base unit:** 8px. Sub-base values (2, 4, 5, 6, 7) are used for tight typographic adjustments; structural layout snaps to 8/12/16/20/24.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 17px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px.
- **Section vertical padding:** `{spacing.section}` (80px) inside a product tile; tiles stack edge-to-edge with 0 gap (the color change provides the break).
- **Card padding:** `{spacing.lg}` (24px) inside utility grid cards.
- **Button padding:** 8–11px vertical, 15–22px horizontal.
- **Universal rhythm constants:** the 17px body line-height multiplier (~25px line) and 21px tagline size show up on every analyzed page.

### Grid & Container
- **Max content width:** ~980px on text-heavy sections (environment), ~1440px on product grids (store, accessories), full-bleed for product tiles (homepage).
- **Column patterns:** 3 to 5 column utility card grid on store/accessories; 2-column side-by-side tiles on homepage occasional sections; single-column centered stack on product tile heroes.
- **Gutters:** 20–24px between cards in a utility grid.

### Whitespace Philosophy
Apple''s whitespace is the product''s pedestal. Every tile begins with at least 64px of air above its headline and 48–64px below. Product renders are never crowded; the nearest content to a product image is at least 40px away. The footer is the only area that breaks this — there, Apple goes deliberately dense to make the full information architecture visible at a glance.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Full-bleed tiles, global nav, footer, body sections |
| Soft hairline | 1px `rgba(0, 0, 0, 0.08)` border | Utility cards, sub-nav frosted-glass separator |
| Backdrop blur | `backdrop-filter: blur(N)` on Parchment 80% | Sub-nav and the iPhone buy floating sticky bar |
| Product shadow | `rgba(0, 0, 0, 0.22) 3px 5px 30px 0` | Product renders resting on a surface (the only true "shadow" in the system) |

**Shadow philosophy.** Apple uses **exactly one** drop-shadow, and it is applied to photographic product imagery — never to cards, never to buttons, never to text. Elevation in the UI comes from (a) surface-color change (light tile ↔ dark tile) and (b) backdrop-blur on sticky bars. The single shadow is about giving the product weight, not about UI hierarchy.

### Decorative Depth
- **Atmospheric imagery** on the environment page (photographic vista) supplies mood; no CSS gradient involved.
- **Edge-to-edge tile alternation** creates rhythm without borders or shadows — the color change itself is the divider.
- **Backdrop-filter blur** on `{component.sub-nav-frosted}` and `{component.floating-sticky-bar}` creates a "floating over content" effect that''s functional, not decorative.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed product tiles (no corner rounding) |
| `{rounded.xs}` | 5px | Inline links when styled as subtle chips (rare) |
| `{rounded.sm}` | 8px | Dark utility buttons (Sign In, Bag), inline card imagery |
| `{rounded.md}` | 11px | White Pearl Button capsules |
| `{rounded.lg}` | 18px | Store utility cards, accessories grid cards |
| `{rounded.pill}` | 9999px | Primary blue pill CTAs, sub-nav buy button, configurator option chips, search input — the signature Apple pill |
| `{rounded.full}` | 9999px / 50% | Circular control chips floating over photography |

### Photography Geometry
- **Hero imagery**: full-bleed, 21:9 or taller on the homepage; 16:9 on environment and shop pages. Product renders are photographic-realistic, often shot on a tinted surface that becomes the tile background.
- **Product renders**: PNG/WebP with transparency; rest on a surface tile and pick up the system shadow.
- **Accessory grid**: square 1:1 crops at `{rounded.lg}` (18px) radius, light neutral backgrounds, product centered with 20–40px internal padding.
- **No rounded imagery in hero tiles** — images are full-bleed rectangular. Rounding (`{rounded.sm}`, `{rounded.lg}`) appears only on inline card imagery.
- Lazy-loading via responsive `srcset` and `sizes` across all breakpoints; CDN-optimized WebP.

## Components

### Top Navigation

**`global-nav`** — Persistent, ultra-thin black nav bar pinned to the top of every page. Background `{colors.surface-black}`, height 44px, text `{colors.on-dark}` in `{typography.nav-link}` (12px / 400 / -0.12px tracking). Links are quiet, spaced ~20px apart, running edge-to-edge across the top. Right-aligned cluster: Search, Bag icons — always visible. On mobile, collapses to hamburger at ~834px and the Apple logo centers.

**`sub-nav-frosted`** — Surface-specific nav that sticks below the global nav. Background `{colors.canvas-parchment}` at 80% opacity with backdrop-filter blur, creating a frosted-glass effect. Height 52px. Content on left: product category name ("iPhone", "Store", "Accessories") in `{typography.tagline}` (21px / 600). Content right: inline nav links in `{typography.button-utility}` (14px), ending in a persistent `{component.button-primary}` ("Buy") or a utility link.

### Buttons

**`button-primary`** — The signature Apple action. Background `{colors.primary}` (Action Blue #0066cc), text `{colors.on-primary}` in `{typography.body}` (SF Pro Text 17px / 400), rounded `{rounded.pill}` (full pill — capsule-shaped), padding 11px × 22px. The full-pill radius IS the brand action signal.
- Active state: `{component.button-primary-active}` — `transform: scale(0.95)` (the system-wide micro-interaction).
- Focus state: `{component.button-primary-focus}` — 2px solid `{colors.primary-focus}` outline.

**`button-secondary-pill`** — Used as the second CTA when two blue pills appear together ("Learn more" / "Buy"). Background transparent, text `{colors.primary}`, 1px solid `{colors.primary}` border, rounded `{rounded.pill}`, padding 11px × 22px. Reads as a "ghost pill."

**`button-dark-utility`** — Global nav actions (Sign In, Bag, language selector). Background `{colors.ink}` (#1d1d1f), text `{colors.on-dark}` in `{typography.button-utility}` (14px / 400 / -0.224px tracking), rounded `{rounded.sm}` (8px), padding 8px × 15px. Active state shrinks via `transform: scale(0.95)`.

**`button-pearl-capsule`** — Product-card secondary button. Background `{colors.surface-pearl}` (#fafafc), text `{colors.ink-muted-80}` in `{typography.caption}` (14px), 3px solid `{colors.divider-soft}` border (functions as a soft ring rather than a visible line), rounded `{rounded.md}` (11px), padding 8px × 14px.

**`button-store-hero`** — A larger primary CTA used on store hero surfaces. Same Action Blue + Paper White as `{component.button-primary}`, but with `{typography.button-large}` (18px / 300 — note the rare weight 300) and slightly more padding (14px × 28px). Used sparingly on the store landing.

**`button-icon-circular`** — Floats over photography. 44 × 44px, background `{colors.surface-chip-translucent}` at ~64% alpha, icon in `{colors.ink}`, rounded `{rounded.full}`. Used for carousel controls, close buttons, and in-image controls (product image thumbnails on the iPhone buy page).

**`text-link`** — Inline body links in `{colors.primary}` (Action Blue). Underlined or non-underlined per context.

**`text-link-on-dark`** — Inline body links on dark tiles in `{colors.primary-on-dark}` (Sky Link Blue #2997ff) — Action Blue would disappear against `{colors.surface-tile-1}`.

### Cards & Containers

**`product-tile-light`** — Full-bleed light tile. Background `{colors.canvas}` (white), text `{colors.ink}`, rounded `{rounded.none}` (0 — tiles touch edges), vertical padding `{spacing.section}` (80px). Centered stack: product name in `{typography.display-lg}` (40px / 600) → one-line tagline in `{typography.lead}` (28px / 400) → two `{component.button-primary}` CTAs ("Learn more" / "Buy") → product render resting on the surface with the system shadow.

**`product-tile-parchment`** — Same as `{component.product-tile-light}` but on `{colors.canvas-parchment}` (#f5f5f7). Used to break two consecutive white tiles.

**`product-tile-dark`** — Full-bleed dark tile. Background `{colors.surface-tile-1}` (#272729), text `{colors.on-dark}`, rounded `{rounded.none}`, vertical padding `{spacing.section}` (80px). Same content stack as the light tile but with `{component.text-link-on-dark}` for inline copy and `{component.button-primary}` (Action Blue still works on the dark surface). Used on the homepage product grid as the alternating dark band.

**`product-tile-dark-2`** — Variant on `{colors.surface-tile-2}` (#2a2a2c). Used where a dark tile sits directly above or below `{component.product-tile-dark}` to create the faintest separation through micro-step lightness change.

**`product-tile-dark-3`** — Variant on `{colors.surface-tile-3}` (#252527). Used at the bottom of the stack and in embedded video/player frames.

**`store-utility-card`** — Used in store grid and accessories grid. Background `{colors.canvas}` (white), 1px solid `{colors.hairline}` border, rounded `{rounded.lg}` (18px), padding `{spacing.lg}` (24px). Top: product image (1:1 crop with `{rounded.sm}` (8px) inner image radius). Below: product name in `{typography.body-strong}` (17px / 600), price in `{typography.body}` (17px / 400), and a `{component.text-link}` ("Buy" or "Learn more"). No shadow by default; product render itself carries the system product-shadow.

**`configurator-option-chip`** — Pill-shaped tappable cell used in the iPhone 17 Pro buy page. Background `{colors.canvas}`, text `{colors.ink}` in `{typography.caption}`, rounded `{rounded.pill}`, padding 12px × 16px. Contains a small product thumbnail + label + price delta. Arranged in a grid of 4–5 options per row.

**`configurator-option-chip-selected`** — Selected state. Border upgrades to 2px solid `{colors.primary-focus}`. Same shape, same content.

**`environment-quote-card`** — A photographic-canvas hero specific to the environment page. Dark photographic backdrop (mountain vista at dawn) with `{colors.surface-tile-1}` as the fallback color, centered white-text headline in `{typography.display-lg}` (40px), small green "Apple 2030" pictographic logo above the headline, single `{component.button-primary}` below. Padding `{spacing.section}` (80px).

**`floating-sticky-bar`** — Floats at the bottom of the viewport on the iPhone 17 Pro buy page during scroll. Background `{colors.canvas-parchment}` at 80% opacity with `backdrop-filter: blur(N)`, height 64px, padding 12px × 32px. Left: running price total in `{typography.body}`. Right: `{component.button-primary}` ("Add to Bag").

### Inputs & Forms

**`search-input`** — The accessories search input. Background `{colors.canvas}`, text `{colors.ink}` in `{typography.body}` (17px), 1px solid `rgba(0, 0, 0, 0.08)` border, rounded `{rounded.pill}` (full pill — search is also pill-shaped, matching the CTA grammar), padding 12px × 20px, height 44px. Leading icon: search glyph at 14px, muted tint.

Error and validation states were not surfaced in the analyzed pages.

### Footer

**`footer`** — Background `{colors.canvas-parchment}` (#f5f5f7), text `{colors.ink-muted-80}`. Link columns in `{typography.dense-link}` (17px / 400 / 2.41 line-height — the relaxed leading is what makes the dense columns scannable). Column headings in `{typography.caption-strong}` (14px / 600). Legal row at the very bottom in `{typography.fine-print}` (12px / 400) with `{colors.ink-muted-48}` text. Vertical padding 64px.

## Do''s and Don''ts

### Do
- Use `{colors.primary}` (Action Blue #0066cc) for every interactive element — links, pill CTAs, focus signals — and nothing else. The single accent is non-negotiable.
- Set headlines in `{typography.hero-display}` or `{typography.display-lg}` with negative letter-spacing (`-0.28 → -0.374px`) to get the signature "Apple tight" cadence.
- Run body copy at `{typography.body}` (17px / 400 / 1.47 / -0.374px) — not 16px. The extra pixel defines the brand''s reading pace.
- Alternate `{component.product-tile-light}` (or parchment) and `{component.product-tile-dark}` for full-bleed section rhythm. The color change IS the divider.
- Reserve `{rounded.pill}` for the primary blue CTA and any other element that should read as an "action" (configurator chips, search input, sticky bar CTA).
- Apply the single product-shadow (`rgba(0, 0, 0, 0.22) 3px 5px 30px`) only to product renders resting on a surface — never on cards, buttons, or text.
- Use `transform: scale(0.95)` as the active/press state on every button — it''s the system-wide micro-interaction.
- Keep the global nav `{colors.surface-black}` (true black) — it''s the only place pure black appears on most pages.

### Don''t
- Don''t introduce a second accent color; every "click me" signal is `{colors.primary}` (Action Blue).
- Don''t add shadows to cards, buttons, or text — shadow is reserved for product imagery.
- Don''t use gradients as decorative backgrounds; atmosphere comes from photography.
- Don''t set body copy at weight 500 — Apple''s ladder is 300 / 400 / 600 / 700, with 500 deliberately absent. Body is always 400; strong inline is 600; display is 600.
- Don''t round full-bleed tiles — tiles are rectangular and edge-to-edge; the color change is the divider.
- Don''t tighten line-height below 1.47 for body copy — the editorial leading is part of the brand.
- Don''t mix radii grammars — use `{rounded.sm}` for compact utility, `{rounded.lg}` for utility cards, `{rounded.pill}` for pills, and nothing in between (except the rare `{rounded.md}` Pearl Button).
- Don''t use `{colors.primary-on-dark}` (Sky Link Blue) on light surfaces — it''s the dark-tile-only variant. Action Blue is for light surfaces.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small phone | ≤ 419px | Single-column tiles; sub-nav collapses to category name + primary CTA only; hero typography drops to 28px |
| Phone | 420–640px | Single-column stack; product renders scale to 80% of tile width; hero h1 drops to 34px |
| Large phone | 641–735px | Tiles transition to tighter padding (48px vertical vs 80px); fine-print wraps |
| Tablet portrait | 736–833px | Global nav collapses to hamburger; sub-nav hides category chips, keeps primary CTA |
| Tablet landscape | 834–1023px | Global nav returns fully expanded; 3-column utility grids become 2-column |
| Small desktop | 1024–1068px | Product tiles use 2/3 width with margin gutters; hero h1 stays at 40px |
| Desktop | 1069–1440px | Full layout; 4–5 column store grids; 1440px content max |
| Wide desktop | ≥ 1441px | Content locks at 1440px, margins absorb extra width |

The structural breakpoints that matter for agents: 1440px (content lock), 1068px (small-desktop), 833px (tablet landscape switch), 734px (tablet portrait), 640px (phone), 480px (small phone).

### Touch Targets
- Minimum 44 × 44px. `{component.button-primary}` lands at ~44 × 100px (with the full-pill radius making the visible hit area more generous than the label suggests).
- `{component.button-icon-circular}` is exactly 44 × 44px.
- Global nav utility links are smaller (~32 × 80px) — they deliberately sit at a tighter target because they''re precision desktop actions, and the mobile hamburger replaces them at ≤ 833px.

### Collapsing Strategy
- **Global nav**: full horizontal link row on desktop → collapses to Apple logo + hamburger + bag icon at 834px and below.
- **Sub-nav**: category name + inline links + primary CTA → category name + primary CTA only at mobile; inline links move into a hamburger tray.
- **Product tiles**: stack from 2-column to 1-column at 834px; vertical padding tightens from 80px → 48px at small-phone.
- **Utility grids** (store, accessories): 5-col → 4-col (1440px) → 3-col (1068px) → 2-col (834px) → 1-col (640px).
- **Hero typography**: `{typography.hero-display}` (56px) → `{typography.display-lg}` (40px) at 1068px → 34px at 640px → 28px at 419px.

### Image Behavior
- All product imagery uses responsive `srcset` with breakpoint-matched crops.
- Hero photography may switch art direction at mobile (e.g., the environment page''s vista crops to a taller aspect ratio on mobile, framing the subject differently).
- Product renders maintain their 1:1 or 4:3 aspect ratios across breakpoints; only scale changes.
- Lazy-loading is default; the above-fold hero loads eagerly.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.product-tile-dark}`, `{component.search-input}`).
2. Variants of an existing component (`-active`, `-focus`, `-2`, `-3`) live as separate entries in `components:`.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay SF Pro Display 600 with negative letter-spacing. Body stays SF Pro Text 400 at 17px. The boundary is unbreakable.
6. The single drop-shadow (`rgba(0, 0, 0, 0.22) 3px 5px 30px`) is reserved for product photography only.
7. When in doubt about emphasis: alternate surface (light → dark tile) before adding chrome.

## Known Gaps

- Form validation and error states were not surfaced on the analyzed pages; only the neutral search input is documented.
- The homepage''s embedded video/player frame uses `{colors.surface-black}`; interior player controls are not documented (they''re a platform widget, not a web-design token).
- Some component imagery is dynamic (rotating product hero) and its specific copy varies per surface — component specs name the structure, not the rotating content.
- Dark-mode counterparts for store and accessories utility cards were not surfaced on the analyzed pages; the system documented is the daytime/light-dominant variant Apple ships by default.
- Atmospheric photography (environment page mountain vista) is a content asset, not a design token; the documented `{component.environment-quote-card}` describes the structural surface only.
- The exact backdrop-filter blur radius on `{component.sub-nav-frosted}` and `{component.floating-sticky-bar}` is platform-dependent; production CSS uses `saturate(180%) blur(20px)` as a typical baseline but the value isn''t formalized as a token.
', now()
  from b
  on conflict (brand_id, original_filename) do update
    set status = 'seeded',
        raw_markdown = excluded.raw_markdown,
        updated_at = now()
  returning id
),
deleted_sections as (
  delete from design_sections where document_id = (select id from d)
),
deleted_tokens as (
  delete from design_tokens where document_id = (select id from d)
)
insert into design_sections (document_id, category, original_title, normalized_title, content_markdown, content_json, confidence, sort_order)
values
((select id from d), 'overview', 'Overview', 'overview', '## Overview

Apple''s web presence is a masterclass in **reverent product photography framed by near-invisible UI**. Every page is a stack of edge-to-edge product "tiles" — alternating light and dark canvases, each centered on a hero headline, a one-line tagline, two tiny blue pill CTAs, and an impossibly crisp product render. Nothing competes with the product. Typography is confident but quiet; color is either pure white, an off-white parchment, or a near-black tile; interactive elements are a single, quiet blue.

Density is unusually low even by contemporary SaaS standards. Each tile occupies roughly one viewport, and there is no decorative chrome — no borders, no gradients, no decorative frames, no shadows on headlines. Elevation appears only when a product image rests on a surface (a single soft `rgba(0, 0, 0, 0.22) 3px 5px 30px` drop for visual weight). The result is a catalog that feels more like a museum gallery: the wall disappears and the artifact takes over.

Store and shop surfaces retain the same chassis but switch modes. The product configurator (iPhone 17 Pro, accessories grid) introduces a tight grid of white utility cards at `{rounded.lg}` (18px) radius with a thin border, paired with a persistent thin sub-nav strip. The environment page leans darker and more editorial. Across all five surfaces the typographic system, spacing rhythm, and the single blue accent are consistent — this is one design language expressed at different volumes.

**Key Characteristics:**
- Photography-first presentation; UI recedes so the product can speak.
- Alternating full-bleed tile sections: white/parchment ↔ near-black, with the color change itself acting as the section divider.
- Single blue accent (`{colors.primary}` — #0066cc) carries every interactive element. No second brand color exists.
- Two button grammars: tiny blue pill CTAs (`{rounded.pill}`) and compact utility rects (`{rounded.sm}`).
- SF Pro Display + SF Pro Text — negative letter-spacing at display sizes for the signature "Apple tight" headline feel.
- Whisper-soft elevation used only when a product image needs to breathe — exactly one drop-shadow in the entire system.
- Tight two-row nav: slim `{component.global-nav}` + product-specific `{component.sub-nav-frosted}` with persistent right-aligned primary CTA.
- Section rhythm across multiple pages: light hero → dark product tile → light utility tile → dark tile → parchment footer — a predictable pulse.', '{"sourcePath":"docs/design-md/apple/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> **Source pages analyzed:** homepage, environment, store, iPhone 17 Pro buy page, accessories index. The color system is identical across all five surfaces; only the surface-mode mix differs.

### Brand & Accent
- **Action Blue** (`{colors.primary}` — #0066cc): The single brand-level interactive color. All text links, all blue pill CTAs ("Learn more", "Buy"), and the focus ring root. This is Apple''s quiet but universal "click me" signal. Press state shifts to a slightly darker variant via the active scale transform rather than a hex change.
- **Focus Blue** (`{colors.primary-focus}` — #0071e3): A marginally brighter sibling of Action Blue, reserved for the keyboard focus ring on buttons (`outline: 2px solid`).
- **Sky Link Blue** (`{colors.primary-on-dark}` — #2997ff): A brighter blue used on dark surfaces for in-copy links and inline callouts, where Action Blue would disappear against the tile background.

### Surface
- **Pure White** (`{colors.canvas}` — #ffffff): The dominant canvas. Content, utility cards, store tiles, configurator grids.
- **Parchment** (`{colors.canvas-parchment}` — #f5f5f7): The signature Apple off-white. Used for alternating light tiles, footer region, and the default page canvas in store utility sections. Just different enough from white to create rhythm.
- **Pearl Button** (`{colors.surface-pearl}` — #fafafc): A near-white used as the fill for secondary "ghost" buttons — lighter than the parchment canvas so the button still reads as a button against `{colors.canvas-parchment}`.
- **Near-Black Tile 1** (`{colors.surface-tile-1}` — #272729): The primary dark-tile surface on the homepage product grid.
- **Near-Black Tile 2** (`{colors.surface-tile-2}` — #2a2a2c): A micro-step lighter — used where a dark tile sits directly above or below Tile 1 to create the faintest separation.
- **Near-Black Tile 3** (`{colors.surface-tile-3}` — #252527): A micro-step darker — used at the bottom of the stack and in embedded video/player frames.
- **Pure Black** (`{colors.surface-black}` — #000000): Reserved for true void — video player backgrounds, edge-to-edge photographic overlays, the global nav bar background.
- **Translucent Chip Gray** (`{colors.surface-chip-translucent}` — #d2d2d7): The base hex of the translucent gray chip used over photography for circular control buttons. In production, applied at ~64% alpha as `rgba(210, 210, 215, 0.64)`.

### Text
- **Near-Black Ink** (`{colors.ink}` — #1d1d1f): The voice of every headline, every body paragraph, and the dark utility button''s fill. Chosen instead of pure black to keep the page feeling photographic rather than printed.
- **Body** (`{colors.body}` — #1d1d1f): Same hex as ink — Apple uses one near-black tone for all text on light surfaces.
- **Body On Dark** (`{colors.body-on-dark}` — #ffffff): All text on dark tiles and on the global nav bar.
- **Body Muted** (`{colors.body-muted}` — #cccccc): Secondary copy on dark tiles where pure white would be too loud.
- **Ink Muted 80** (`{colors.ink-muted-80}` — #333333): Body text on the white Pearl Button surface — slightly softer than pure black.
- **Ink Muted 48** (`{colors.ink-muted-48}` — #7a7a7a): Disabled button text and legal fine-print.

### Hairlines & Borders
- **Divider Soft** (`{colors.divider-soft}` — #f0f0f0): The "border" tone on secondary buttons — functions as a ring shadow rather than a hard line. In production, often applied as `rgba(0, 0, 0, 0.04)`.
- **Hairline** (`{colors.hairline}` — #e0e0e0): The 1px hairline border on store utility cards and configurator chips.

### Brand Gradient
**No decorative gradients.** Atmospheric depth on product photography (the iPhone 17 Pro camera plate, the Apple Watch bands, AirPods reflections) is inherent to the imagery, not a CSS gradient overlay. The environment page''s hero uses photographic atmosphere (mountain vista at dawn) but no gradient tokens are defined. Apple is the rare luxury-brand site with zero gradient-based design tokens.', '{"sourcePath":"docs/design-md/apple/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
- **Display**: `SF Pro Display, system-ui, -apple-system, sans-serif` — Apple''s proprietary display face, optimized for sizes ≥ 19px. Defines the voice of every headline.
- **Body / UI**: `SF Pro Text, system-ui, -apple-system, sans-serif` — the text-optimized variant used for body copy, captions, buttons, and links below 20px.
- **OpenType features**: `font-variant-numeric: numerator` is enabled on numeric links (pricing tables, spec sheets). Display sizes rely on tight tracking rather than contextual ligatures.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 56px | 600 | 1.07 | -0.28px | Hero headline; the signature "Apple tight" tracking |
| `{typography.display-lg}` | 40px | 600 | 1.10 | 0 | Tile headlines atop every product tile |
| `{typography.display-md}` | 34px | 600 | 1.47 | -0.374px | Section heads (SF Pro Text at display proportions) |
| `{typography.lead}` | 28px | 400 | 1.14 | 0.196px | Product tile subcopy |
| `{typography.lead-airy}` | 24px | 300 | 1.5 | 0 | Environment-page lead paragraphs (the rare weight 300) |
| `{typography.tagline}` | 21px | 600 | 1.19 | 0.231px | Sub-tile tagline; sub-nav category name |
| `{typography.body-strong}` | 17px | 600 | 1.24 | -0.374px | Inline strong emphasis |
| `{typography.body}` | 17px | 400 | 1.47 | -0.374px | Default paragraph |
| `{typography.dense-link}` | 17px | 400 | 2.41 | 0 | Footer / store utility link lists (relaxed leading) |
| `{typography.caption}` | 14px | 400 | 1.43 | -0.224px | Secondary captions, button text |
| `{typography.caption-strong}` | 14px | 600 | 1.29 | -0.224px | Emphasized captions |
| `{typography.button-large}` | 18px | 300 | 1.0 | 0 | Store hero CTAs (the rare weight 300) |
| `{typography.button-utility}` | 14px | 400 | 1.29 | -0.224px | Utility/nav button labels |
| `{typography.fine-print}` | 12px | 400 | 1.0 | -0.12px | Fine-print, footer body |
| `{typography.micro-legal}` | 10px | 400 | 1.3 | -0.08px | Micro legal disclaimers |
| `{typography.nav-link}` | 12px | 400 | 1.0 | -0.12px | Global nav menu items |

### Principles

- **Negative letter-spacing at display sizes.** Every headline at 17px and up carries a slight tracking tighten (`-0.12 → -0.374px`). This produces the iconic "Apple tight" headline cadence. Never used at 12px or below.
- **Body copy at 17px, not 16px.** Apple breaks the SaaS convention and runs paragraph text at 17px. The extra pixel gives the page an unmistakable "reading, not scanning" pace.
- **Weight 300 is real and rare.** Used deliberately on a handful of large-size reads (`{typography.button-large}` at 18px/300 and `{typography.lead-airy}` at 24px/300). It''s not an accident — it''s a light-atmosphere cue reserved for moments where the content should feel airy.
- **Weight 600, not 700, for headlines.** Apple''s headlines sit at weight 600. Weight 700 is used sparingly for `{typography.tagline}` (21px) when a touch more assertion is needed.
- **Line-height is context-specific.** Display sizes use 1.07–1.19 (tight). Body uses 1.47. Utility link stacks in the footer/store use an unusually relaxed 2.41 (`{typography.dense-link}`). The 2.41 is not a bug — it''s how the footer''s dense link columns breathe.
- **Weight 500 is deliberately absent.** The ladder is 300 / 400 / 600 / 700. Mid-weight readings always use 600.

### Note on Font Substitutes
SF Pro is Apple''s proprietary system font. When building off-system:

- Use `system-ui, -apple-system, BlinkMacSystemFont` as the first stack entry — on macOS/iOS/Safari this resolves to the real SF Pro.
- For non-Apple platforms, **Inter** (Google Fonts, variable) is the closest open-source equivalent. Inter at weight 600 with `font-feature-settings: "ss03"` approximates SF Pro''s rounded "a" character.
- Nudge `letter-spacing` down by `-0.01em` on display sizes to re-create the Apple tight feel; Inter''s default tracking runs slightly wider than SF Pro.
- For body text, tighten line-height by `0.03` (from 1.47 → 1.44) when substituting Inter — Inter''s taller x-height needs less leading.', '{"sourcePath":"docs/design-md/apple/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 8px. Sub-base values (2, 4, 5, 6, 7) are used for tight typographic adjustments; structural layout snaps to 8/12/16/20/24.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 17px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px.
- **Section vertical padding:** `{spacing.section}` (80px) inside a product tile; tiles stack edge-to-edge with 0 gap (the color change provides the break).
- **Card padding:** `{spacing.lg}` (24px) inside utility grid cards.
- **Button padding:** 8–11px vertical, 15–22px horizontal.
- **Universal rhythm constants:** the 17px body line-height multiplier (~25px line) and 21px tagline size show up on every analyzed page.

### Grid & Container
- **Max content width:** ~980px on text-heavy sections (environment), ~1440px on product grids (store, accessories), full-bleed for product tiles (homepage).
- **Column patterns:** 3 to 5 column utility card grid on store/accessories; 2-column side-by-side tiles on homepage occasional sections; single-column centered stack on product tile heroes.
- **Gutters:** 20–24px between cards in a utility grid.

### Whitespace Philosophy
Apple''s whitespace is the product''s pedestal. Every tile begins with at least 64px of air above its headline and 48–64px below. Product renders are never crowded; the nearest content to a product image is at least 40px away. The footer is the only area that breaks this — there, Apple goes deliberately dense to make the full information architecture visible at a glance.', '{"sourcePath":"docs/design-md/apple/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Full-bleed tiles, global nav, footer, body sections |
| Soft hairline | 1px `rgba(0, 0, 0, 0.08)` border | Utility cards, sub-nav frosted-glass separator |
| Backdrop blur | `backdrop-filter: blur(N)` on Parchment 80% | Sub-nav and the iPhone buy floating sticky bar |
| Product shadow | `rgba(0, 0, 0, 0.22) 3px 5px 30px 0` | Product renders resting on a surface (the only true "shadow" in the system) |

**Shadow philosophy.** Apple uses **exactly one** drop-shadow, and it is applied to photographic product imagery — never to cards, never to buttons, never to text. Elevation in the UI comes from (a) surface-color change (light tile ↔ dark tile) and (b) backdrop-blur on sticky bars. The single shadow is about giving the product weight, not about UI hierarchy.

### Decorative Depth
- **Atmospheric imagery** on the environment page (photographic vista) supplies mood; no CSS gradient involved.
- **Edge-to-edge tile alternation** creates rhythm without borders or shadows — the color change itself is the divider.
- **Backdrop-filter blur** on `{component.sub-nav-frosted}` and `{component.floating-sticky-bar}` creates a "floating over content" effect that''s functional, not decorative.', '{"sourcePath":"docs/design-md/apple/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed product tiles (no corner rounding) |
| `{rounded.xs}` | 5px | Inline links when styled as subtle chips (rare) |
| `{rounded.sm}` | 8px | Dark utility buttons (Sign In, Bag), inline card imagery |
| `{rounded.md}` | 11px | White Pearl Button capsules |
| `{rounded.lg}` | 18px | Store utility cards, accessories grid cards |
| `{rounded.pill}` | 9999px | Primary blue pill CTAs, sub-nav buy button, configurator option chips, search input — the signature Apple pill |
| `{rounded.full}` | 9999px / 50% | Circular control chips floating over photography |

### Photography Geometry
- **Hero imagery**: full-bleed, 21:9 or taller on the homepage; 16:9 on environment and shop pages. Product renders are photographic-realistic, often shot on a tinted surface that becomes the tile background.
- **Product renders**: PNG/WebP with transparency; rest on a surface tile and pick up the system shadow.
- **Accessory grid**: square 1:1 crops at `{rounded.lg}` (18px) radius, light neutral backgrounds, product centered with 20–40px internal padding.
- **No rounded imagery in hero tiles** — images are full-bleed rectangular. Rounding (`{rounded.sm}`, `{rounded.lg}`) appears only on inline card imagery.
- Lazy-loading via responsive `srcset` and `sizes` across all breakpoints; CDN-optimized WebP.', '{"sourcePath":"docs/design-md/apple/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`global-nav`** — Persistent, ultra-thin black nav bar pinned to the top of every page. Background `{colors.surface-black}`, height 44px, text `{colors.on-dark}` in `{typography.nav-link}` (12px / 400 / -0.12px tracking). Links are quiet, spaced ~20px apart, running edge-to-edge across the top. Right-aligned cluster: Search, Bag icons — always visible. On mobile, collapses to hamburger at ~834px and the Apple logo centers.

**`sub-nav-frosted`** — Surface-specific nav that sticks below the global nav. Background `{colors.canvas-parchment}` at 80% opacity with backdrop-filter blur, creating a frosted-glass effect. Height 52px. Content on left: product category name ("iPhone", "Store", "Accessories") in `{typography.tagline}` (21px / 600). Content right: inline nav links in `{typography.button-utility}` (14px), ending in a persistent `{component.button-primary}` ("Buy") or a utility link.

### Buttons

**`button-primary`** — The signature Apple action. Background `{colors.primary}` (Action Blue #0066cc), text `{colors.on-primary}` in `{typography.body}` (SF Pro Text 17px / 400), rounded `{rounded.pill}` (full pill — capsule-shaped), padding 11px × 22px. The full-pill radius IS the brand action signal.
- Active state: `{component.button-primary-active}` — `transform: scale(0.95)` (the system-wide micro-interaction).
- Focus state: `{component.button-primary-focus}` — 2px solid `{colors.primary-focus}` outline.

**`button-secondary-pill`** — Used as the second CTA when two blue pills appear together ("Learn more" / "Buy"). Background transparent, text `{colors.primary}`, 1px solid `{colors.primary}` border, rounded `{rounded.pill}`, padding 11px × 22px. Reads as a "ghost pill."

**`button-dark-utility`** — Global nav actions (Sign In, Bag, language selector). Background `{colors.ink}` (#1d1d1f), text `{colors.on-dark}` in `{typography.button-utility}` (14px / 400 / -0.224px tracking), rounded `{rounded.sm}` (8px), padding 8px × 15px. Active state shrinks via `transform: scale(0.95)`.

**`button-pearl-capsule`** — Product-card secondary button. Background `{colors.surface-pearl}` (#fafafc), text `{colors.ink-muted-80}` in `{typography.caption}` (14px), 3px solid `{colors.divider-soft}` border (functions as a soft ring rather than a visible line), rounded `{rounded.md}` (11px), padding 8px × 14px.

**`button-store-hero`** — A larger primary CTA used on store hero surfaces. Same Action Blue + Paper White as `{component.button-primary}`, but with `{typography.button-large}` (18px / 300 — note the rare weight 300) and slightly more padding (14px × 28px). Used sparingly on the store landing.

**`button-icon-circular`** — Floats over photography. 44 × 44px, background `{colors.surface-chip-translucent}` at ~64% alpha, icon in `{colors.ink}`, rounded `{rounded.full}`. Used for carousel controls, close buttons, and in-image controls (product image thumbnails on the iPhone buy page).

**`text-link`** — Inline body links in `{colors.primary}` (Action Blue). Underlined or non-underlined per context.

**`text-link-on-dark`** — Inline body links on dark tiles in `{colors.primary-on-dark}` (Sky Link Blue #2997ff) — Action Blue would disappear against `{colors.surface-tile-1}`.

### Cards & Containers

**`product-tile-light`** — Full-bleed light tile. Background `{colors.canvas}` (white), text `{colors.ink}`, rounded `{rounded.none}` (0 — tiles touch edges), vertical padding `{spacing.section}` (80px). Centered stack: product name in `{typography.display-lg}` (40px / 600) → one-line tagline in `{typography.lead}` (28px / 400) → two `{component.button-primary}` CTAs ("Learn more" / "Buy") → product render resting on the surface with the system shadow.

**`product-tile-parchment`** — Same as `{component.product-tile-light}` but on `{colors.canvas-parchment}` (#f5f5f7). Used to break two consecutive white tiles.

**`product-tile-dark`** — Full-bleed dark tile. Background `{colors.surface-tile-1}` (#272729), text `{colors.on-dark}`, rounded `{rounded.none}`, vertical padding `{spacing.section}` (80px). Same content stack as the light tile but with `{component.text-link-on-dark}` for inline copy and `{component.button-primary}` (Action Blue still works on the dark surface). Used on the homepage product grid as the alternating dark band.

**`product-tile-dark-2`** — Variant on `{colors.surface-tile-2}` (#2a2a2c). Used where a dark tile sits directly above or below `{component.product-tile-dark}` to create the faintest separation through micro-step lightness change.

**`product-tile-dark-3`** — Variant on `{colors.surface-tile-3}` (#252527). Used at the bottom of the stack and in embedded video/player frames.

**`store-utility-card`** — Used in store grid and accessories grid. Background `{colors.canvas}` (white), 1px solid `{colors.hairline}` border, rounded `{rounded.lg}` (18px), padding `{spacing.lg}` (24px). Top: product image (1:1 crop with `{rounded.sm}` (8px) inner image radius). Below: product name in `{typography.body-strong}` (17px / 600), price in `{typography.body}` (17px / 400), and a `{component.text-link}` ("Buy" or "Learn more"). No shadow by default; product render itself carries the system product-shadow.

**`configurator-option-chip`** — Pill-shaped tappable cell used in the iPhone 17 Pro buy page. Background `{colors.canvas}`, text `{colors.ink}` in `{typography.caption}`, rounded `{rounded.pill}`, padding 12px × 16px. Contains a small product thumbnail + label + price delta. Arranged in a grid of 4–5 options per row.

**`configurator-option-chip-selected`** — Selected state. Border upgrades to 2px solid `{colors.primary-focus}`. Same shape, same content.

**`environment-quote-card`** — A photographic-canvas hero specific to the environment page. Dark photographic backdrop (mountain vista at dawn) with `{colors.surface-tile-1}` as the fallback color, centered white-text headline in `{typography.display-lg}` (40px), small green "Apple 2030" pictographic logo above the headline, single `{component.button-primary}` below. Padding `{spacing.section}` (80px).

**`floating-sticky-bar`** — Floats at the bottom of the viewport on the iPhone 17 Pro buy page during scroll. Background `{colors.canvas-parchment}` at 80% opacity with `backdrop-filter: blur(N)`, height 64px, padding 12px × 32px. Left: running price total in `{typography.body}`. Right: `{component.button-primary}` ("Add to Bag").

### Inputs & Forms

**`search-input`** — The accessories search input. Background `{colors.canvas}`, text `{colors.ink}` in `{typography.body}` (17px), 1px solid `rgba(0, 0, 0, 0.08)` border, rounded `{rounded.pill}` (full pill — search is also pill-shaped, matching the CTA grammar), padding 12px × 20px, height 44px. Leading icon: search glyph at 14px, muted tint.

Error and validation states were not surfaced in the analyzed pages.

### Footer

**`footer`** — Background `{colors.canvas-parchment}` (#f5f5f7), text `{colors.ink-muted-80}`. Link columns in `{typography.dense-link}` (17px / 400 / 2.41 line-height — the relaxed leading is what makes the dense columns scannable). Column headings in `{typography.caption-strong}` (14px / 600). Legal row at the very bottom in `{typography.fine-print}` (12px / 400) with `{colors.ink-muted-48}` text. Vertical padding 64px.', '{"sourcePath":"docs/design-md/apple/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Use `{colors.primary}` (Action Blue #0066cc) for every interactive element — links, pill CTAs, focus signals — and nothing else. The single accent is non-negotiable.
- Set headlines in `{typography.hero-display}` or `{typography.display-lg}` with negative letter-spacing (`-0.28 → -0.374px`) to get the signature "Apple tight" cadence.
- Run body copy at `{typography.body}` (17px / 400 / 1.47 / -0.374px) — not 16px. The extra pixel defines the brand''s reading pace.
- Alternate `{component.product-tile-light}` (or parchment) and `{component.product-tile-dark}` for full-bleed section rhythm. The color change IS the divider.
- Reserve `{rounded.pill}` for the primary blue CTA and any other element that should read as an "action" (configurator chips, search input, sticky bar CTA).
- Apply the single product-shadow (`rgba(0, 0, 0, 0.22) 3px 5px 30px`) only to product renders resting on a surface — never on cards, buttons, or text.
- Use `transform: scale(0.95)` as the active/press state on every button — it''s the system-wide micro-interaction.
- Keep the global nav `{colors.surface-black}` (true black) — it''s the only place pure black appears on most pages.

### Don''t
- Don''t introduce a second accent color; every "click me" signal is `{colors.primary}` (Action Blue).
- Don''t add shadows to cards, buttons, or text — shadow is reserved for product imagery.
- Don''t use gradients as decorative backgrounds; atmosphere comes from photography.
- Don''t set body copy at weight 500 — Apple''s ladder is 300 / 400 / 600 / 700, with 500 deliberately absent. Body is always 400; strong inline is 600; display is 600.
- Don''t round full-bleed tiles — tiles are rectangular and edge-to-edge; the color change is the divider.
- Don''t tighten line-height below 1.47 for body copy — the editorial leading is part of the brand.
- Don''t mix radii grammars — use `{rounded.sm}` for compact utility, `{rounded.lg}` for utility cards, `{rounded.pill}` for pills, and nothing in between (except the rare `{rounded.md}` Pearl Button).
- Don''t use `{colors.primary-on-dark}` (Sky Link Blue) on light surfaces — it''s the dark-tile-only variant. Action Blue is for light surfaces.', '{"sourcePath":"docs/design-md/apple/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small phone | ≤ 419px | Single-column tiles; sub-nav collapses to category name + primary CTA only; hero typography drops to 28px |
| Phone | 420–640px | Single-column stack; product renders scale to 80% of tile width; hero h1 drops to 34px |
| Large phone | 641–735px | Tiles transition to tighter padding (48px vertical vs 80px); fine-print wraps |
| Tablet portrait | 736–833px | Global nav collapses to hamburger; sub-nav hides category chips, keeps primary CTA |
| Tablet landscape | 834–1023px | Global nav returns fully expanded; 3-column utility grids become 2-column |
| Small desktop | 1024–1068px | Product tiles use 2/3 width with margin gutters; hero h1 stays at 40px |
| Desktop | 1069–1440px | Full layout; 4–5 column store grids; 1440px content max |
| Wide desktop | ≥ 1441px | Content locks at 1440px, margins absorb extra width |

The structural breakpoints that matter for agents: 1440px (content lock), 1068px (small-desktop), 833px (tablet landscape switch), 734px (tablet portrait), 640px (phone), 480px (small phone).

### Touch Targets
- Minimum 44 × 44px. `{component.button-primary}` lands at ~44 × 100px (with the full-pill radius making the visible hit area more generous than the label suggests).
- `{component.button-icon-circular}` is exactly 44 × 44px.
- Global nav utility links are smaller (~32 × 80px) — they deliberately sit at a tighter target because they''re precision desktop actions, and the mobile hamburger replaces them at ≤ 833px.

### Collapsing Strategy
- **Global nav**: full horizontal link row on desktop → collapses to Apple logo + hamburger + bag icon at 834px and below.
- **Sub-nav**: category name + inline links + primary CTA → category name + primary CTA only at mobile; inline links move into a hamburger tray.
- **Product tiles**: stack from 2-column to 1-column at 834px; vertical padding tightens from 80px → 48px at small-phone.
- **Utility grids** (store, accessories): 5-col → 4-col (1440px) → 3-col (1068px) → 2-col (834px) → 1-col (640px).
- **Hero typography**: `{typography.hero-display}` (56px) → `{typography.display-lg}` (40px) at 1068px → 34px at 640px → 28px at 419px.

### Image Behavior
- All product imagery uses responsive `srcset` with breakpoint-matched crops.
- Hero photography may switch art direction at mobile (e.g., the environment page''s vista crops to a taller aspect ratio on mobile, framing the subject differently).
- Product renders maintain their 1:1 or 4:3 aspect ratios across breakpoints; only scale changes.
- Lazy-loading is default; the above-fold hero loads eagerly.', '{"sourcePath":"docs/design-md/apple/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.product-tile-dark}`, `{component.search-input}`).
2. Variants of an existing component (`-active`, `-focus`, `-2`, `-3`) live as separate entries in `components:`.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay SF Pro Display 600 with negative letter-spacing. Body stays SF Pro Text 400 at 17px. The boundary is unbreakable.
6. The single drop-shadow (`rgba(0, 0, 0, 0.22) 3px 5px 30px`) is reserved for product photography only.
7. When in doubt about emphasis: alternate surface (light → dark tile) before adding chrome.', '{"sourcePath":"docs/design-md/apple/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Form validation and error states were not surfaced on the analyzed pages; only the neutral search input is documented.
- The homepage''s embedded video/player frame uses `{colors.surface-black}`; interior player controls are not documented (they''re a platform widget, not a web-design token).
- Some component imagery is dynamic (rotating product hero) and its specific copy varies per surface — component specs name the structure, not the rotating content.
- Dark-mode counterparts for store and accessories utility cards were not surfaced on the analyzed pages; the system documented is the daytime/light-dominant variant Apple ships by default.
- Atmospheric photography (environment page mountain vista) is a content asset, not a design token; the documented `{component.environment-quote-card}` describes the structural surface only.
- The exact backdrop-filter blur radius on `{component.sub-nav-frosted}` and `{component.floating-sticky-bar}` is platform-dependent; production CSS uses `saturate(180%) blur(20px)` as a typical baseline but the value isn''t formalized as a token.', '{"sourcePath":"docs/design-md/apple/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_1', '#0066cc', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_2', '#0071e3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_3', '#2997ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_4', '#1d1d1f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_5', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_6', '#cccccc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_7', '#333333', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_8', '#7a7a7a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_9', '#f0f0f0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_10', '#e0e0e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_11', '#f5f5f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_12', '#fafafc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_13', '#272729', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_14', '#2a2a2c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_15', '#252527', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_16', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'color', 'color_17', '#d2d2d7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'typography', 'font_1', 'SF Pro Display, system-ui, -apple-system, sans-serif', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'typography', 'font_2', 'SF Pro Text, system-ui, -apple-system, sans-serif', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'typography', 'font_3', 'fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md'), 'typography', 'font_4', 'fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/apple/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/apple/DESIGN.md';


-- Binance
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Binance', 'binance', 'design-reference', null, now())
  on conflict (slug) do update
    set name = excluded.name,
        category = excluded.category,
        updated_at = now()
  returning id
),
d as (
  insert into design_documents (
    brand_id,
    source_type,
    original_filename,
    original_blob_url,
    status,
    raw_markdown,
    updated_at
  )
  select id, 'markdown_seed', 'docs/design-md/binance/DESIGN.md', null, 'seeded', '---
version: alpha
name: Binance-design-analysis
description: A confident financial-platform interface anchored on a deep near-black canvas, where Binance''s iconic yellow (#FCD535) carries every primary CTA, brand accent, and value-claim moment. Type runs Binance''s custom BinanceNova / BinancePlex stack at modest weights — the system trusts size and yellow voltage over bold weight. Marketing and product surfaces default to the dark theme; transactional surfaces (buy crypto, deposit, exchange) flip to a light theme that shares the same yellow CTAs and gray-blue hairlines. Trading green (up) and red (down) accents thread through both modes for price-direction signals.

colors:
  primary: "#fcd535"
  primary-active: "#f0b90b"
  primary-disabled: "#3a3a1f"
  ink: "#181a20"
  body: "#eaecef"
  body-on-light: "#181a20"
  muted: "#707a8a"
  muted-strong: "#929aa5"
  hairline-on-light: "#eaecef"
  hairline-on-dark: "#2b3139"
  border-strong: "#cdd1d6"
  canvas-light: "#ffffff"
  canvas-dark: "#0b0e11"
  surface-card-dark: "#1e2329"
  surface-elevated-dark: "#2b3139"
  surface-soft-light: "#fafafa"
  surface-strong-light: "#f5f5f5"
  on-primary: "#181a20"
  on-dark: "#ffffff"
  trading-up: "#0ecb81"
  trading-down: "#f6465d"
  accent-turquoise: "#2dbdb6"
  info: "#3b82f6"
  info-ring: "#3b82f6"

typography:
  hero-display:
    fontFamily: "BinanceNova, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -1px
  display-lg:
    fontFamily: "BinanceNova, sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.5px
  display-md:
    fontFamily: "BinanceNova, sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.3px
  display-sm:
    fontFamily: "BinanceNova, sans-serif"
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  title-lg:
    fontFamily: "BinanceNova, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  title-md:
    fontFamily: "BinanceNova, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
  title-sm:
    fontFamily: "BinanceNova, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  number-display:
    fontFamily: "BinancePlex, BinanceNova, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.3px
  number-md:
    fontFamily: "BinancePlex, BinanceNova, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  number-sm:
    fontFamily: "BinancePlex, BinanceNova, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "BinanceNova, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "BinanceNova, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "BinanceNova, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  button:
    fontFamily: "BinanceNova, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  nav-link:
    fontFamily: "BinanceNova, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 24px
    height: 40px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
  button-primary-pill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 14px 32px
  button-secondary-on-dark:
    backgroundColor: "{colors.surface-card-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-secondary-on-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.button}"
  button-trading-up:
    backgroundColor: "{colors.trading-up}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 8px 20px
  button-trading-down:
    backgroundColor: "{colors.trading-down}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 8px 20px
  button-subscribe:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 6px 16px
    height: 28px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
  top-nav-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.nav-link}"
    height: 64px
  top-nav-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 64px
  hero-band-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.hero-display}"
    padding: 80px
  stat-callout-card:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.number-display}"
  trust-badge:
    backgroundColor: "{colors.surface-card-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.lg}"
    padding: 16px 20px
  markets-table-card:
    backgroundColor: "{colors.surface-card-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 24px
  markets-row:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.number-md}"
    padding: 12px 0
  price-up-cell:
    backgroundColor: transparent
    textColor: "{colors.trading-up}"
    typography: "{typography.number-md}"
  price-down-cell:
    backgroundColor: transparent
    textColor: "{colors.trading-down}"
    typography: "{typography.number-md}"
  search-input-on-dark:
    backgroundColor: "{colors.surface-card-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 10px 16px
    height: 40px
  text-input-on-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    height: 40px
  funds-safu-band:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.primary}"
    typography: "{typography.display-lg}"
    padding: 80px
  feature-photo-card:
    backgroundColor: "{colors.surface-card-dark}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.xl}"
  qr-promo-card:
    backgroundColor: "{colors.surface-card-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  faq-row:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.md}"
    padding: 20px 0
  cta-band-dark:
    backgroundColor: "{colors.surface-card-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-sm}"
    rounded: "{rounded.xl}"
    padding: 48px
  arena-hero-gradient:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.primary}"
    typography: "{typography.display-lg}"
    padding: 80px
  cookie-consent-card:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 16px
  buy-crypto-amount-card:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.number-display}"
    rounded: "{rounded.lg}"
    padding: 24px
  steps-card:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.lg}"
    padding: 24px
  price-chart-card:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  conversion-cell:
    backgroundColor: transparent
    textColor: "{colors.body-on-light}"
    typography: "{typography.body-md}"
  trader-row:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    padding: 12px 0
  footer-light:
    backgroundColor: "{colors.surface-soft-light}"
    textColor: "{colors.body-on-light}"
    typography: "{typography.body-md}"
    padding: 64px
---

## Overview

Binance reads like a financial trading platform that wants to feel both authoritative and energetic. The base atmosphere is **deep near-black canvas** (`{colors.canvas-dark}` — #0b0e11) holding white type and a single, ubiquitous accent: **Binance Yellow** (`{colors.primary}` — #FCD535). That yellow does almost all of the brand''s heavy lifting — it carries every primary CTA, every value-claim headline ("FUNDS ARE SAFU"), every "Sign Up" pill, every featured tier indicator, and the wordmark itself. There is no secondary brand color. The system trusts the yellow voltage to do the brand work, and it carries it.

Type runs Binance''s custom **BinanceNova** (display + body) and **BinancePlex** (numerical / financial display) stack. BinanceNova carries display headlines, section titles, and body copy. BinancePlex appears on price tickers, large stat numbers (transaction volumes, user counts, prize pools) — anywhere a number wants to feel "tabular and reliable." Both run at modest weights — display sizes use weight 600-700 (bolder than typical marketing because trading platforms need numbers to read at a glance), body stays at 400.

The product is **multi-theme**: marketing surfaces (homepage, smart-money, futures arena) default to dark, while transactional surfaces (buy crypto, deposit, withdraw) flip to a light theme. The same yellow CTAs and gray-blue hairlines (`{colors.hairline-on-light}` — #eaecef) thread through both — only canvas, surface, and text tones flip. Trading **green** (`{colors.trading-up}` — #0ecb81) and **red** (`{colors.trading-down}` — #f6465d) signal price direction in tables, charts, and price tickers across both modes.

**Key Characteristics:**
- Single accent color: `{colors.primary}` (#FCD535) does all brand voltage — primary CTAs, hero headlines, brand mark, badges. Used scarcely on dark for emphasis, ubiquitously on transactional dialogs.
- Custom type stack: `BinanceNova` (display + body) and `BinancePlex` (numbers, prices, financial data). Big stat numbers always render in BinancePlex for tabular consistency.
- Multi-theme: marketing pages default dark (`{colors.canvas-dark}`); transactional pages flip light (`{colors.canvas-light}`). Yellow CTAs and trading green/red are shared across both.
- Light footer on dark body: the homepage uses `{colors.surface-soft-light}` (#fafafa) for the footer even when the body above it is dark — a deliberate inversion that visually closes the page.
- Trading semantics: green up / red down (`{colors.trading-up}` / `{colors.trading-down}`) for price changes, applied as text color rather than badge background.
- Card surfaces: `{colors.surface-card-dark}` (#1e2329) for elevated cards on dark; `{colors.canvas-light}` for cards on light. No gradient surfaces, no atmospheric backdrops — flat color blocks throughout.
- Border radius is small to medium: `{rounded.md}` (6px) for primary buttons, `{rounded.lg}` (8px) for inputs and content cards, `{rounded.xl}` (12px) for elevated card containers, `{rounded.pill}` for prominent feature CTAs.
- Spacing follows a 4-multiple scale; major editorial bands sit at `{spacing.section}` (80px) — slightly tighter than typical marketing-only sites because product pages need denser layouts.

## Colors

### Brand & Accent
- **Binance Yellow** (`{colors.primary}` — #FCD535): The single brand color. Used for primary CTA backgrounds, the wordmark, brand-claim headlines ("FUNDS ARE SAFU"), trust badges ("No.1 Trading Volume"), large stat numbers in `{component.stat-callout-card}`, and inline links.
- **Binance Yellow Active** (`{colors.primary-active}` — #f0b90b): The press / hover-darker variant. Slightly more saturated yellow.
- **Binance Yellow Disabled** (`{colors.primary-disabled}` — #3a3a1f): A desaturated dark-yellow used on disabled CTAs over dark canvas.
- **Accent Turquoise** (`{colors.accent-turquoise}` — #2dbdb6): A small secondary accent used very sparingly on Smart Money''s "Check Now" CTA over dark surfaces. Treat as a single-product accent, not a system color.

### Surface

The system has two canvas modes that map to product context:

**Dark mode (marketing default):**
- **Canvas Dark** (`{colors.canvas-dark}` — #0b0e11): The primary page floor. Near-black with a slight warm tint — never pure black.
- **Surface Card Dark** (`{colors.surface-card-dark}` — #1e2329): Cards, navigation dropdowns, secondary buttons over dark canvas, markets table.
- **Surface Elevated Dark** (`{colors.surface-elevated-dark}` — #2b3139): One step lighter, used for nested cards, hovered nav items, and chart background panels.

**Light mode (transactional):**
- **Canvas Light** (`{colors.canvas-light}` — #ffffff): The page floor on transactional pages (buy crypto, deposit forms, account dialogs).
- **Surface Soft Light** (`{colors.surface-soft-light}` — #fafafa): Footer surface and disabled states.
- **Surface Strong Light** (`{colors.surface-strong-light}` — #f5f5f5): Form input backgrounds in muted contexts.

### Hairlines & Borders
- **Hairline on Light** (`{colors.hairline-on-light}` — #eaecef): The 1px border tone on light surfaces. Dembrandt''s frequency analysis confirms this as the highest-count token (1022 occurrences) — Binance uses hairlines liberally.
- **Hairline on Dark** (`{colors.hairline-on-dark}` — #2b3139): The 1px border tone on dark surfaces. Same hex as `{colors.surface-elevated-dark}` — borders feel like surface steps, not ink lines.
- **Border Strong** (`{colors.border-strong}` — #cdd1d6): A heavier border tone used on disabled secondary buttons.

### Text
- **Ink** (`{colors.ink}` — #181a20): The strongest text on light surfaces. Display headlines on transactional pages.
- **Body on Dark** (`{colors.body}` — #eaecef): Default running-text on dark canvas — deliberately not pure white, slightly cooler.
- **Body on Light** (`{colors.body-on-light}` — #181a20): Same as ink — light-mode body text reuses the ink token.
- **Muted** (`{colors.muted}` — #707a8a): Footer links, breadcrumbs, captions, table column headers. Works on both light and dark canvas.
- **Muted Strong** (`{colors.muted-strong}` — #929aa5): A second-tier muted for emphasized labels.
- **On Primary** (`{colors.on-primary}` — #181a20): Black text on yellow primary CTAs.
- **On Dark** (`{colors.on-dark}` — #ffffff): Pure white for high-contrast headlines on dark canvas.

### Trading Semantics
- **Trading Up** (`{colors.trading-up}` — #0ecb81): Price-up green, used as text color in tables, charts, and inline ticker arrows. Never as a button background.
- **Trading Down** (`{colors.trading-down}` — #f6465d): Price-down red. Same usage rules as trading-up.

### Info / Focus
- **Info** (`{colors.info}` — #3b82f6): Inline info badges and the focus-ring base. The Tailwind `--tw-ring-color` token surfaced by dembrandt — used on input focus.

## Typography

### Font Family
The system runs **BinanceNova** for display and body, and **BinancePlex** for numerical / financial data. Both are licensed Binance custom typefaces. The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

The split is functional, not decorative:
- BinanceNova → editorial type (headlines, paragraphs, button labels, nav)
- BinancePlex → tabular numerical type (prices, volumes, percentages, stat counters, prize pools)

Mixing them is not optional — BinanceNova on a price ticker would lose the trading-platform character; BinancePlex on a paragraph would feel monospace-cold.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 64px | 700 | 1.1 | -1px | Homepage h1 ("316,258,026 USERS TRUST US") |
| `{typography.display-lg}` | 48px | 700 | 1.1 | -0.5px | Brand-claim headlines ("FUNDS ARE SAFU"), prize-pool hero ("Futures Masters Arena") |
| `{typography.display-md}` | 40px | 600 | 1.15 | -0.3px | Section heads on long-scroll pages |
| `{typography.display-sm}` | 32px | 600 | 1.2 | 0 | CTA band headlines ("Secure, Low-Fee Trading on Binance") |
| `{typography.title-lg}` | 24px | 600 | 1.3 | 0 | Sub-section titles |
| `{typography.title-md}` | 20px | 600 | 1.35 | 0 | QR-promo cards, feature card titles |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Trust badges, FAQ rows, step labels |
| `{typography.number-display}` | 40px | 700 | 1.1 | -0.3px | Big stat numbers (15,000 BTC, $429,423,449) — BinancePlex |
| `{typography.number-md}` | 16px | 500 | 1.4 | 0 | Markets table prices, table cells — BinancePlex |
| `{typography.number-sm}` | 14px | 500 | 1.4 | 0 | Inline prices, %  changes — BinancePlex |
| `{typography.body-md}` | 14px | 400 | 1.5 | 0 | Default running-text — BinanceNova |
| `{typography.body-sm}` | 13px | 400 | 1.5 | 0 | Cookie consent text, footer body |
| `{typography.caption}` | 12px | 500 | 1.4 | 0 | Small meta labels |
| `{typography.button}` | 14px | 600 | 1 | 0 | Standard CTA button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top nav menu items |

### Principles
Display sizes use weight 700 — heavier than most marketing systems. This makes sense for a trading platform: numbers need to read at a glance, headlines need to compete with chart visualizations and dense data tables. The system will not soften display weight to 400 the way Airtable or Stripe does.

`{typography.number-display}` and the smaller number variants always use **BinancePlex**, even when surrounding body type uses BinanceNova. Prices, volumes, and stat counters render in BinancePlex regardless of context — it is the system''s "trustworthy number" voice.

### Note on Font Substitutes
If BinanceNova and BinancePlex are unavailable, **Inter** is the closest open-source substitute for BinanceNova and **JetBrains Mono** or **IBM Plex Sans** is the closest substitute for BinancePlex (depending on whether tabular monospace fidelity matters more than humanist proportions). Adjust display headlines down by ~3% in line-height to match BinanceNova''s tighter cap height.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px.
- **Section padding (vertical):** `{spacing.section}` (80px) — slightly tighter than airy marketing sites (96px) because Binance pages mix marketing bands with dense product surfaces (markets tables, FAQ accordions).
- **Card internal padding:** `{spacing.lg}` (24px) for content cards and markets tables; `{spacing.xl}` (32px) for QR-promo cards and CTA bands; `{spacing.md}` (16px) for trust badges and table rows.
- **Gutters:** `{spacing.lg}` (24px) between cards in 3-up grids; `{spacing.md}` (16px) inside footer column gutters and dense FAQ lists.

### Grid & Container
- **Max content width:** ~1280px centered on marketing pages; ~1440px on product surfaces (markets, smart-money tables) where horizontal density matters.
- **Editorial body:** Single 12-column grid; product pages often use 8/4 split (main panel + side rail).
- **Markets table:** 5-column header (Pair / Last Price / 24h Change / 24h Volume / Action), with the first column carrying coin icon + symbol pair.
- **Footer:** 6-column link list at desktop, wrapping to 2-up at tablet and 1-up on mobile.

### Whitespace Philosophy
Binance is denser than typical marketing sites — long-scroll pages mix hero bands with markets tables, FAQ accordions, and feature grids without much breathing room between them. The system trusts contrast (yellow vs. dark canvas, green vs. red price cells) to do the visual separation work, not whitespace. Where whitespace appears, it''s always uniform — `{spacing.section}` between every major band.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero bands, footer |
| Soft hairline | 1px `{colors.hairline-on-dark}` or `{colors.hairline-on-light}` | Inputs, table dividers, FAQ row separators, secondary buttons |
| Card surface | `{colors.surface-card-dark}` background on dark canvas, `{colors.canvas-light}` on light context — no shadow | All elevated cards (markets-table-card, QR-promo-card, feature-photo-card, trust-badges) |
| Subtle drop shadow | Faint shadow visible only when a card sits over imagery | Used sparingly on the buy-crypto-amount-card on transactional pages |
| Focus ring | `0 0 0 2px {colors.info-ring}` at 50% alpha | Input + button keyboard focus state |

The elevation philosophy is **flat surfaces with color-block separation**. Binance does not use heavy drop shadows or glassmorphism — depth comes from the contrast between `{colors.canvas-dark}` and `{colors.surface-card-dark}` (a 12-step lightness jump that reads as a clear elevation boundary).

### Decorative Depth
- **Yellow → dark vertical gradient backdrop** on the Futures Arena hero: `{colors.primary}` fading down to `{colors.canvas-dark}`. This is a single-page treatment used for product-launch / event hero surfaces, not a system-wide signature.
- **Coin-stack illustrations** flanking large stat blocks (3D rendered crypto coins, trophy icons). These are illustrations, not tokens — treat as content rather than design system surface.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 2px | Almost no use — reserved for very small badges |
| `{rounded.sm}` | 4px | Small inline buttons (subscribe, trading-up / trading-down inline) |
| `{rounded.md}` | 6px | Standard CTA buttons, primary buttons, primary input fields |
| `{rounded.lg}` | 8px | Search input, content cards, trust badges, sub-cards |
| `{rounded.xl}` | 12px | Elevated card containers (markets-table-card, QR-promo-card, CTA bands) |
| `{rounded.pill}` | 9999px | Prominent feature CTAs ("Sign Up" pill on dark, futures-arena "Join Now") |
| `{rounded.full}` | 9999px / 50% | Coin icons, avatars |

Binance''s radius hierarchy is tighter than typical marketing systems — most surfaces sit at 6-12px. The pill radius is a deliberate exception used to signal "this is a top-of-page action."

### Photography & Iconography
- Coin icons render as 24×24 or 32×32 rounded glyphs (often 50% radius on circular outline + the coin''s brand color inside).
- 3D rendered coin stacks and trophy illustrations are full-color illustrations with a slight floor shadow — not flat icons.
- Photographic content (people-using-the-app section) crops to `{rounded.xl}` (12px) corners, full-bleed on mobile.

## Components

### Top Navigation

**`top-nav-dark`** — The marketing top nav on dark canvas. 64px tall, `{colors.canvas-dark}` background. Carries the yellow Binance wordmark at left, primary horizontal menu (Buy Crypto, Markets, Trade, Futures, Earn, Square, Smart Money, Campaigns), right-side cluster with language selector, light/dark toggle, "Log In" text link, "Sign Up" `{component.button-primary}`. The wordmark uses `{colors.primary}` for "BINANCE" type.

**`top-nav-light`** — The transactional top nav on light canvas (buy crypto, deposit pages). Same layout but `{colors.canvas-light}` background and `{colors.ink}` menu items.

### Buttons

**`button-primary`** — The signature primary CTA. Background `{colors.primary}`, text `{colors.on-primary}` (black on yellow — the system''s iconic combination), type `{typography.button}`, padding 12px × 24px, height 40px, rounded `{rounded.md}` (6px). Press state: `button-primary-active` darkens to `{colors.primary-active}` (#f0b90b). Disabled state: `button-primary-disabled` desaturates to `{colors.primary-disabled}`.

**`button-primary-pill`** — A larger pill variant of the primary CTA used for top-of-page sign-up moments and product-launch heroes (Futures Arena "Join Now"). Same yellow + black combination, padding 14px × 32px, rounded `{rounded.pill}` (9999px). Use sparingly — the pill is a "this is THE action" signal.

**`button-secondary-on-dark`** — Used over `{colors.canvas-dark}` for less-emphasized actions. Background `{colors.surface-card-dark}`, text `{colors.on-dark}`, rounded `{rounded.md}`.

**`button-secondary-on-light`** — Light-canvas equivalent. Background `{colors.canvas-light}` with `{colors.hairline-on-light}` 1px border, text `{colors.ink}`.

**`button-tertiary-text`** — Inline text button with no background. Used for "Log In" in the top nav and inline "Read More" links.

**`button-trading-up`** — A solid green button used on price-up signals (Buy / Long actions). Background `{colors.trading-up}`, text `{colors.on-dark}`, rounded `{rounded.sm}` (4px), padding 8px × 20px. Smaller and tighter than `{component.button-primary}` because it appears in dense trading interfaces.

**`button-trading-down`** — Symmetric red variant for Sell / Short actions. Same shape, background `{colors.trading-down}`.

**`button-subscribe`** — Compact yellow CTA used in the Smart Money traders table to subscribe to a top trader. Smaller height (28px) and tighter padding than the primary CTA — fits inside dense table rows. Same yellow + black combination.

**`text-link`** — Inline body links in `{colors.primary}` (yellow on dark, also yellow on light). No underline by default. Type inherits `{typography.body-md}`.

### Cards & Containers

**`hero-band-dark`** — Full-width dark band carrying the homepage h1 + sub-headline + dual CTA pair. Background `{colors.canvas-dark}`, padding `{spacing.section}` (80px). The h1 ("316,258,026 USERS TRUST US") uses `{typography.hero-display}` at 64px / 700 — the system''s largest type role.

**`stat-callout-card`** — Inline yellow stat numbers (15,000 BTC, 7,488,223, $429,423,449). Transparent background, text `{colors.primary}`, type `{typography.number-display}` in BinancePlex. Used as a flat layout block, not a card with surface — the yellow text alone carries the visual weight.

**`trust-badge`** — Small dark cards holding "No.1 Customer Service" / "No.1 Trading Volume" claims. Background `{colors.surface-card-dark}`, rounded `{rounded.lg}` (8px), padding 16px × 20px. Yellow numeric or word badge ("No.1") sits next to a short label.

**`markets-table-card`** — The right-side markets table on the homepage. Background `{colors.surface-card-dark}`, rounded `{rounded.xl}` (12px), padding `{spacing.lg}` (24px). Carries a tab row (Popular / New listing / Top gainers), then a 5-column row of coin pairs with last price, 24h change %, action button. Each row uses `{component.markets-row}`.

**`markets-row`** — A single row inside the markets table. Transparent background, 12px vertical padding, hairline divider between rows. Coin icon (32×32) + symbol on left; last price in `{typography.number-md}` (BinancePlex); 24h change cell colored by direction (`{component.price-up-cell}` or `{component.price-down-cell}`); right-aligned chevron icon for "view detail."

**`price-up-cell`** / **`price-down-cell`** — Colored text cells for price changes. Transparent background, text `{colors.trading-up}` or `{colors.trading-down}`, type `{typography.number-md}` in BinancePlex. Always paired with a small triangle arrow indicating direction.

**`feature-photo-card`** — The "Trade on the go" section''s photo strip — 3 lifestyle photos showing people using the Binance app. Background `{colors.surface-card-dark}`, rounded `{rounded.xl}`. Photos crop edge-to-edge, no internal padding around the image.

**`qr-promo-card`** — The "Trade on the go. Anywhere, anytime." card with QR code. Background `{colors.surface-card-dark}`, rounded `{rounded.xl}`, padding `{spacing.xl}` (32px). Contains an h2 in `{typography.title-md}`, a body paragraph, app store badges (iOS / Android), and a centered QR code.

**`funds-safu-band`** — The yellow-headlined "FUNDS ARE SAFU" band. Background stays `{colors.canvas-dark}`, but the headline uses `{colors.primary}` at `{typography.display-lg}`. Below the headline, three large `{component.stat-callout-card}` numbers anchor the band: total BTC reserves, users helped, funds recovered.

**`faq-row`** — A single FAQ accordion row. Transparent background, padding 20px vertical, hairline divider between rows. Closed state: question in `{typography.title-sm}` + chevron icon at right. Open state: question + answer body in `{typography.body-md}`.

**`cta-band-dark`** — The "Secure, Low-Fee Trading on Binance" pre-footer CTA band. Background `{colors.surface-card-dark}` (one step elevated from canvas), rounded `{rounded.xl}`, padding `{spacing.xxl}` (48px). Carries an h2 in `{typography.display-sm}` and a `{component.button-primary}` aligned right.

### Light-Mode Transactional Components

**`buy-crypto-amount-card`** — The right-rail card on the Buy BTC page. Background `{colors.canvas-light}`, rounded `{rounded.lg}` (8px), padding `{spacing.lg}` (24px). Carries an editable amount input in `{typography.number-display}` (BinancePlex), a currency selector, and a yellow `{component.button-primary}` for "Continue" / "Confirm Order."

**`steps-card`** — The "How to Buy Crypto" 3-up cards (Enter Amount → Confirm Order → Receive Crypto). Background `{colors.canvas-light}`, rounded `{rounded.lg}`, padding `{spacing.lg}`. Each card has a small numbered icon, a `{typography.title-sm}` step name, and a body description.

**`price-chart-card`** — The "Bitcoin Markets" card carrying the BTC price chart. Background `{colors.canvas-light}`, rounded `{rounded.lg}`. Top row carries pair selector ($79,065.04, +0.45%); main area is a candlestick / line chart in `{colors.trading-up}` and `{colors.trading-down}`; bottom row carries timeframe selector (24H / 1W / 1M / 3M / 1Y / ALL).

**`conversion-cell`** — A single row in the BTC ↔ USD conversion table. Transparent background, text `{colors.body-on-light}`, type `{typography.body-md}`. Pair label on left (BTC, USDT, etc.); USD equivalent on right.

### Inputs & Forms

**`search-input-on-dark`** — The "Search currencies" input on the homepage hero. Background `{colors.surface-card-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}` (8px), padding 10px × 16px, height 40px. Carries a yellow `{component.button-primary-pill}` on the right side ("Sign Up").

**`text-input-on-light`** — Standard input on transactional pages. Background `{colors.canvas-light}`, 1px `{colors.hairline-on-light}` border, rounded `{rounded.md}` (6px), padding 10px × 16px, height 40px. Focus state inherits the focus-ring shadow.

**`cookie-consent-card`** — The cookie banner card visible on the homepage. Background `{colors.canvas-light}`, rounded `{rounded.lg}`, padding `{spacing.md}` (16px). Body text in `{typography.body-sm}` (13px / 400) with three stacked button options (Accept Cookies & Continue / Reject Additional Cookies / Manage Cookies).

### Smart Money Sub-System

**`trader-row`** — A single row in the top-traders table on /smart-money. Transparent background, padding 12px vertical, hairline divider between rows. Avatar + trader name + private/public badge on left; ROI %, AUM, mint date columns; yellow `{component.button-subscribe}` on right.

### Signature Components

**`arena-hero-gradient`** — The Futures Arena product-launch hero. A vertical gradient from `{colors.primary}` at top to `{colors.canvas-dark}` at bottom, with the prize-pool headline (4,000,000 USDT) in `{typography.display-lg}` centered. A `{component.button-primary-pill}` ("Join Now") sits below the headline. Used only on product-launch event surfaces — do not generalize to other heroes.

### Footer

**`footer-light`** — The light-gray footer that closes every page (including dark-canvas pages). Background `{colors.surface-soft-light}` (#fafafa), text `{colors.body-on-light}`. 6-column link list at desktop covering Community / About Us / Products / Business / Service / Learn columns. Vertical padding 64px. The deliberate light footer on a dark page is one of Binance''s most distinctive layout choices — it visually closes the page with a "marketing reset" surface.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (Binance Yellow) for primary actions, brand-claim headlines, and the wordmark. Never use it for secondary or decorative purposes — yellow''s scarcity is what makes it powerful.
- Keep `{component.button-primary}` (yellow with black text) as the universal primary CTA across both dark and light modes. The same button appears identically on `{colors.canvas-dark}` and `{colors.canvas-light}`.
- Use `{component.button-trading-up}` (green) and `{component.button-trading-down}` (red) only for explicit Buy/Sell or Long/Short actions. Never use them for general "confirm" or "cancel" because they carry semantic price-direction meaning.
- Use BinancePlex for every number. Prices, volumes, percentages, stat counters — all BinancePlex. Mixing BinanceNova into a number ticker breaks the trading-platform character.
- Choose canvas mode by surface intent: dark for marketing / product showcase / trading dashboards; light for transactional dialogs (buy / deposit / withdraw / form submission).
- Anchor every editorial band with `{spacing.section}` (80px). Binance is denser than airy marketing sites — 80px is the right rhythm.

### Don''t
- Don''t introduce a second brand color. The system has exactly one accent (`{colors.primary}`) and any expansion dilutes the brand identity. The turquoise on Smart Money is a single-product experiment, not a system token.
- Don''t use yellow for body text or large surface fills. It is for focal-point CTAs and headlines only.
- Don''t use `{colors.trading-up}` / `{colors.trading-down}` as background fills on cards. They are price-direction signals, expressed as text color or small badge fill — never as a card surface.
- Don''t soften display weight. `{typography.hero-display}` and `{typography.display-lg}` are intentionally weight 700 — going to 400 reads as design-portfolio, not trading platform.
- Don''t add atmospheric gradients to the canvas (mesh, aurora, glow effects). Binance trusts color-block contrast — adding atmospheric depth muddies the trading-platform feel.
- Don''t invert `{component.button-primary}`''s text color. Black on yellow is the system''s signature — white text on yellow loses contrast and brand recognition.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Top nav collapses to hamburger; hero h1 drops from 64px to ~36px; markets table converts to a horizontally-scrollable card list; demo grids drop to 1-up; footer 6 columns wrap to 2 |
| Tablet | 768–1024px | Top nav stays horizontal but tightens, secondary menu items hide behind a "More" dropdown; markets table 2-up; pricing/feature grids 2-up |
| Desktop | 1024–1440px | Full top-nav with all primary menu items; 5-column markets table; trading dashboards in 8/4 split (chart + side rail) |
| Wide | > 1440px | Same as desktop with more outer breathing room; max content width caps at 1280-1440px depending on surface |

### Touch Targets
- Primary CTAs render at minimum 40 × 40px (`{component.button-primary}` height + padding) — meets WCAG AAA''s 44 × 44 with surrounding spacing.
- Subscribe / inline action buttons are 28 × 28 — denser than ideal but matches industry trading platform norms.
- Coin icons in markets tables are 32 × 32px, with the entire row tappable for 44px+ effective target.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px; the menu opens as a full-screen sheet with the same yellow accent CTAs anchored to the bottom of the sheet.
- Markets table reflows to a horizontally-scrollable single card per coin pair on mobile.
- The hero stat numbers ("316M USERS") shrink proportionally rather than wrapping — Binance''s biggest claim must always read as a single block.
- Trading dashboards switch from chart + side-rail to chart-only with a separate "Trade" tab on mobile.
- The light footer stays full-bleed at every breakpoint — it does not collapse to a separate dark variant.

### Image Behavior
- Coin icons stay at fixed 24/32px sizes regardless of breakpoint.
- Lifestyle photos in the "Trade on the go" section crop responsively — wider at desktop, taller (vertical) at mobile.
- 3D coin-stack illustrations are fixed-aspect-ratio assets that scale uniformly without cropping.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.button-primary}`, `{component.markets-row}`).
2. When adding a new component, decide first whether it lives in dark mode (marketing / product) or light mode (transactional). The same component appears in both with surface tone flipped.
3. Variants of an existing component (`-active`, `-disabled`) live as separate entries in `components:` — never as nested state objects.
4. Use `{token.refs}` everywhere prose mentions a color, a radius, a typography role, or a spacing value.
5. Never document hover. The system documents Default and Active/Pressed states only.
6. Numbers always use BinancePlex; copy always uses BinanceNova. Mixing them is a system violation.
7. Trading green / red are semantic price tokens — never repurpose them for "success" or "error" generic states.

## Known Gaps

- The dembrandt frequency analyzer captured `#eaecef` (light hairline, count 1022) as the highest-frequency token. The brand-defining `{colors.primary}` (#FCD535) appears far less frequently because it''s used scarcely as accent — its system role had to be confirmed from screenshots.
- BinanceNova and BinancePlex weight-axis values are not formalized as variable-font tokens — only the static weights observed in screenshots are documented.
- Animation and transition timings (chart redraws, price-change flashes) are not in scope.
- Form validation states beyond `{component.text-input-on-light}` defaults are not extracted — error / success input variants would need a sign-up or order-confirmation flow to confirm.
- The trading dashboard surfaces (Spot / Futures / Margin) were not in the analyzed URL set; their order book, candlestick chart configuration, and position-management cards are not documented here.
- The light/dark theme toggle behavior (whether transactional pages can be forced dark by user preference) is product behavior, not extracted from the marketing surfaces.
', now()
  from b
  on conflict (brand_id, original_filename) do update
    set status = 'seeded',
        raw_markdown = excluded.raw_markdown,
        updated_at = now()
  returning id
),
deleted_sections as (
  delete from design_sections where document_id = (select id from d)
),
deleted_tokens as (
  delete from design_tokens where document_id = (select id from d)
)
insert into design_sections (document_id, category, original_title, normalized_title, content_markdown, content_json, confidence, sort_order)
values
((select id from d), 'overview', 'Overview', 'overview', '## Overview

Binance reads like a financial trading platform that wants to feel both authoritative and energetic. The base atmosphere is **deep near-black canvas** (`{colors.canvas-dark}` — #0b0e11) holding white type and a single, ubiquitous accent: **Binance Yellow** (`{colors.primary}` — #FCD535). That yellow does almost all of the brand''s heavy lifting — it carries every primary CTA, every value-claim headline ("FUNDS ARE SAFU"), every "Sign Up" pill, every featured tier indicator, and the wordmark itself. There is no secondary brand color. The system trusts the yellow voltage to do the brand work, and it carries it.

Type runs Binance''s custom **BinanceNova** (display + body) and **BinancePlex** (numerical / financial display) stack. BinanceNova carries display headlines, section titles, and body copy. BinancePlex appears on price tickers, large stat numbers (transaction volumes, user counts, prize pools) — anywhere a number wants to feel "tabular and reliable." Both run at modest weights — display sizes use weight 600-700 (bolder than typical marketing because trading platforms need numbers to read at a glance), body stays at 400.

The product is **multi-theme**: marketing surfaces (homepage, smart-money, futures arena) default to dark, while transactional surfaces (buy crypto, deposit, withdraw) flip to a light theme. The same yellow CTAs and gray-blue hairlines (`{colors.hairline-on-light}` — #eaecef) thread through both — only canvas, surface, and text tones flip. Trading **green** (`{colors.trading-up}` — #0ecb81) and **red** (`{colors.trading-down}` — #f6465d) signal price direction in tables, charts, and price tickers across both modes.

**Key Characteristics:**
- Single accent color: `{colors.primary}` (#FCD535) does all brand voltage — primary CTAs, hero headlines, brand mark, badges. Used scarcely on dark for emphasis, ubiquitously on transactional dialogs.
- Custom type stack: `BinanceNova` (display + body) and `BinancePlex` (numbers, prices, financial data). Big stat numbers always render in BinancePlex for tabular consistency.
- Multi-theme: marketing pages default dark (`{colors.canvas-dark}`); transactional pages flip light (`{colors.canvas-light}`). Yellow CTAs and trading green/red are shared across both.
- Light footer on dark body: the homepage uses `{colors.surface-soft-light}` (#fafafa) for the footer even when the body above it is dark — a deliberate inversion that visually closes the page.
- Trading semantics: green up / red down (`{colors.trading-up}` / `{colors.trading-down}`) for price changes, applied as text color rather than badge background.
- Card surfaces: `{colors.surface-card-dark}` (#1e2329) for elevated cards on dark; `{colors.canvas-light}` for cards on light. No gradient surfaces, no atmospheric backdrops — flat color blocks throughout.
- Border radius is small to medium: `{rounded.md}` (6px) for primary buttons, `{rounded.lg}` (8px) for inputs and content cards, `{rounded.xl}` (12px) for elevated card containers, `{rounded.pill}` for prominent feature CTAs.
- Spacing follows a 4-multiple scale; major editorial bands sit at `{spacing.section}` (80px) — slightly tighter than typical marketing-only sites because product pages need denser layouts.', '{"sourcePath":"docs/design-md/binance/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Binance Yellow** (`{colors.primary}` — #FCD535): The single brand color. Used for primary CTA backgrounds, the wordmark, brand-claim headlines ("FUNDS ARE SAFU"), trust badges ("No.1 Trading Volume"), large stat numbers in `{component.stat-callout-card}`, and inline links.
- **Binance Yellow Active** (`{colors.primary-active}` — #f0b90b): The press / hover-darker variant. Slightly more saturated yellow.
- **Binance Yellow Disabled** (`{colors.primary-disabled}` — #3a3a1f): A desaturated dark-yellow used on disabled CTAs over dark canvas.
- **Accent Turquoise** (`{colors.accent-turquoise}` — #2dbdb6): A small secondary accent used very sparingly on Smart Money''s "Check Now" CTA over dark surfaces. Treat as a single-product accent, not a system color.

### Surface

The system has two canvas modes that map to product context:

**Dark mode (marketing default):**
- **Canvas Dark** (`{colors.canvas-dark}` — #0b0e11): The primary page floor. Near-black with a slight warm tint — never pure black.
- **Surface Card Dark** (`{colors.surface-card-dark}` — #1e2329): Cards, navigation dropdowns, secondary buttons over dark canvas, markets table.
- **Surface Elevated Dark** (`{colors.surface-elevated-dark}` — #2b3139): One step lighter, used for nested cards, hovered nav items, and chart background panels.

**Light mode (transactional):**
- **Canvas Light** (`{colors.canvas-light}` — #ffffff): The page floor on transactional pages (buy crypto, deposit forms, account dialogs).
- **Surface Soft Light** (`{colors.surface-soft-light}` — #fafafa): Footer surface and disabled states.
- **Surface Strong Light** (`{colors.surface-strong-light}` — #f5f5f5): Form input backgrounds in muted contexts.

### Hairlines & Borders
- **Hairline on Light** (`{colors.hairline-on-light}` — #eaecef): The 1px border tone on light surfaces. Dembrandt''s frequency analysis confirms this as the highest-count token (1022 occurrences) — Binance uses hairlines liberally.
- **Hairline on Dark** (`{colors.hairline-on-dark}` — #2b3139): The 1px border tone on dark surfaces. Same hex as `{colors.surface-elevated-dark}` — borders feel like surface steps, not ink lines.
- **Border Strong** (`{colors.border-strong}` — #cdd1d6): A heavier border tone used on disabled secondary buttons.

### Text
- **Ink** (`{colors.ink}` — #181a20): The strongest text on light surfaces. Display headlines on transactional pages.
- **Body on Dark** (`{colors.body}` — #eaecef): Default running-text on dark canvas — deliberately not pure white, slightly cooler.
- **Body on Light** (`{colors.body-on-light}` — #181a20): Same as ink — light-mode body text reuses the ink token.
- **Muted** (`{colors.muted}` — #707a8a): Footer links, breadcrumbs, captions, table column headers. Works on both light and dark canvas.
- **Muted Strong** (`{colors.muted-strong}` — #929aa5): A second-tier muted for emphasized labels.
- **On Primary** (`{colors.on-primary}` — #181a20): Black text on yellow primary CTAs.
- **On Dark** (`{colors.on-dark}` — #ffffff): Pure white for high-contrast headlines on dark canvas.

### Trading Semantics
- **Trading Up** (`{colors.trading-up}` — #0ecb81): Price-up green, used as text color in tables, charts, and inline ticker arrows. Never as a button background.
- **Trading Down** (`{colors.trading-down}` — #f6465d): Price-down red. Same usage rules as trading-up.

### Info / Focus
- **Info** (`{colors.info}` — #3b82f6): Inline info badges and the focus-ring base. The Tailwind `--tw-ring-color` token surfaced by dembrandt — used on input focus.', '{"sourcePath":"docs/design-md/binance/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The system runs **BinanceNova** for display and body, and **BinancePlex** for numerical / financial data. Both are licensed Binance custom typefaces. The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

The split is functional, not decorative:
- BinanceNova → editorial type (headlines, paragraphs, button labels, nav)
- BinancePlex → tabular numerical type (prices, volumes, percentages, stat counters, prize pools)

Mixing them is not optional — BinanceNova on a price ticker would lose the trading-platform character; BinancePlex on a paragraph would feel monospace-cold.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 64px | 700 | 1.1 | -1px | Homepage h1 ("316,258,026 USERS TRUST US") |
| `{typography.display-lg}` | 48px | 700 | 1.1 | -0.5px | Brand-claim headlines ("FUNDS ARE SAFU"), prize-pool hero ("Futures Masters Arena") |
| `{typography.display-md}` | 40px | 600 | 1.15 | -0.3px | Section heads on long-scroll pages |
| `{typography.display-sm}` | 32px | 600 | 1.2 | 0 | CTA band headlines ("Secure, Low-Fee Trading on Binance") |
| `{typography.title-lg}` | 24px | 600 | 1.3 | 0 | Sub-section titles |
| `{typography.title-md}` | 20px | 600 | 1.35 | 0 | QR-promo cards, feature card titles |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Trust badges, FAQ rows, step labels |
| `{typography.number-display}` | 40px | 700 | 1.1 | -0.3px | Big stat numbers (15,000 BTC, $429,423,449) — BinancePlex |
| `{typography.number-md}` | 16px | 500 | 1.4 | 0 | Markets table prices, table cells — BinancePlex |
| `{typography.number-sm}` | 14px | 500 | 1.4 | 0 | Inline prices, %  changes — BinancePlex |
| `{typography.body-md}` | 14px | 400 | 1.5 | 0 | Default running-text — BinanceNova |
| `{typography.body-sm}` | 13px | 400 | 1.5 | 0 | Cookie consent text, footer body |
| `{typography.caption}` | 12px | 500 | 1.4 | 0 | Small meta labels |
| `{typography.button}` | 14px | 600 | 1 | 0 | Standard CTA button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top nav menu items |

### Principles
Display sizes use weight 700 — heavier than most marketing systems. This makes sense for a trading platform: numbers need to read at a glance, headlines need to compete with chart visualizations and dense data tables. The system will not soften display weight to 400 the way Airtable or Stripe does.

`{typography.number-display}` and the smaller number variants always use **BinancePlex**, even when surrounding body type uses BinanceNova. Prices, volumes, and stat counters render in BinancePlex regardless of context — it is the system''s "trustworthy number" voice.

### Note on Font Substitutes
If BinanceNova and BinancePlex are unavailable, **Inter** is the closest open-source substitute for BinanceNova and **JetBrains Mono** or **IBM Plex Sans** is the closest substitute for BinancePlex (depending on whether tabular monospace fidelity matters more than humanist proportions). Adjust display headlines down by ~3% in line-height to match BinanceNova''s tighter cap height.', '{"sourcePath":"docs/design-md/binance/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px.
- **Section padding (vertical):** `{spacing.section}` (80px) — slightly tighter than airy marketing sites (96px) because Binance pages mix marketing bands with dense product surfaces (markets tables, FAQ accordions).
- **Card internal padding:** `{spacing.lg}` (24px) for content cards and markets tables; `{spacing.xl}` (32px) for QR-promo cards and CTA bands; `{spacing.md}` (16px) for trust badges and table rows.
- **Gutters:** `{spacing.lg}` (24px) between cards in 3-up grids; `{spacing.md}` (16px) inside footer column gutters and dense FAQ lists.

### Grid & Container
- **Max content width:** ~1280px centered on marketing pages; ~1440px on product surfaces (markets, smart-money tables) where horizontal density matters.
- **Editorial body:** Single 12-column grid; product pages often use 8/4 split (main panel + side rail).
- **Markets table:** 5-column header (Pair / Last Price / 24h Change / 24h Volume / Action), with the first column carrying coin icon + symbol pair.
- **Footer:** 6-column link list at desktop, wrapping to 2-up at tablet and 1-up on mobile.

### Whitespace Philosophy
Binance is denser than typical marketing sites — long-scroll pages mix hero bands with markets tables, FAQ accordions, and feature grids without much breathing room between them. The system trusts contrast (yellow vs. dark canvas, green vs. red price cells) to do the visual separation work, not whitespace. Where whitespace appears, it''s always uniform — `{spacing.section}` between every major band.', '{"sourcePath":"docs/design-md/binance/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero bands, footer |
| Soft hairline | 1px `{colors.hairline-on-dark}` or `{colors.hairline-on-light}` | Inputs, table dividers, FAQ row separators, secondary buttons |
| Card surface | `{colors.surface-card-dark}` background on dark canvas, `{colors.canvas-light}` on light context — no shadow | All elevated cards (markets-table-card, QR-promo-card, feature-photo-card, trust-badges) |
| Subtle drop shadow | Faint shadow visible only when a card sits over imagery | Used sparingly on the buy-crypto-amount-card on transactional pages |
| Focus ring | `0 0 0 2px {colors.info-ring}` at 50% alpha | Input + button keyboard focus state |

The elevation philosophy is **flat surfaces with color-block separation**. Binance does not use heavy drop shadows or glassmorphism — depth comes from the contrast between `{colors.canvas-dark}` and `{colors.surface-card-dark}` (a 12-step lightness jump that reads as a clear elevation boundary).

### Decorative Depth
- **Yellow → dark vertical gradient backdrop** on the Futures Arena hero: `{colors.primary}` fading down to `{colors.canvas-dark}`. This is a single-page treatment used for product-launch / event hero surfaces, not a system-wide signature.
- **Coin-stack illustrations** flanking large stat blocks (3D rendered crypto coins, trophy icons). These are illustrations, not tokens — treat as content rather than design system surface.', '{"sourcePath":"docs/design-md/binance/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 2px | Almost no use — reserved for very small badges |
| `{rounded.sm}` | 4px | Small inline buttons (subscribe, trading-up / trading-down inline) |
| `{rounded.md}` | 6px | Standard CTA buttons, primary buttons, primary input fields |
| `{rounded.lg}` | 8px | Search input, content cards, trust badges, sub-cards |
| `{rounded.xl}` | 12px | Elevated card containers (markets-table-card, QR-promo-card, CTA bands) |
| `{rounded.pill}` | 9999px | Prominent feature CTAs ("Sign Up" pill on dark, futures-arena "Join Now") |
| `{rounded.full}` | 9999px / 50% | Coin icons, avatars |

Binance''s radius hierarchy is tighter than typical marketing systems — most surfaces sit at 6-12px. The pill radius is a deliberate exception used to signal "this is a top-of-page action."

### Photography & Iconography
- Coin icons render as 24×24 or 32×32 rounded glyphs (often 50% radius on circular outline + the coin''s brand color inside).
- 3D rendered coin stacks and trophy illustrations are full-color illustrations with a slight floor shadow — not flat icons.
- Photographic content (people-using-the-app section) crops to `{rounded.xl}` (12px) corners, full-bleed on mobile.', '{"sourcePath":"docs/design-md/binance/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav-dark`** — The marketing top nav on dark canvas. 64px tall, `{colors.canvas-dark}` background. Carries the yellow Binance wordmark at left, primary horizontal menu (Buy Crypto, Markets, Trade, Futures, Earn, Square, Smart Money, Campaigns), right-side cluster with language selector, light/dark toggle, "Log In" text link, "Sign Up" `{component.button-primary}`. The wordmark uses `{colors.primary}` for "BINANCE" type.

**`top-nav-light`** — The transactional top nav on light canvas (buy crypto, deposit pages). Same layout but `{colors.canvas-light}` background and `{colors.ink}` menu items.

### Buttons

**`button-primary`** — The signature primary CTA. Background `{colors.primary}`, text `{colors.on-primary}` (black on yellow — the system''s iconic combination), type `{typography.button}`, padding 12px × 24px, height 40px, rounded `{rounded.md}` (6px). Press state: `button-primary-active` darkens to `{colors.primary-active}` (#f0b90b). Disabled state: `button-primary-disabled` desaturates to `{colors.primary-disabled}`.

**`button-primary-pill`** — A larger pill variant of the primary CTA used for top-of-page sign-up moments and product-launch heroes (Futures Arena "Join Now"). Same yellow + black combination, padding 14px × 32px, rounded `{rounded.pill}` (9999px). Use sparingly — the pill is a "this is THE action" signal.

**`button-secondary-on-dark`** — Used over `{colors.canvas-dark}` for less-emphasized actions. Background `{colors.surface-card-dark}`, text `{colors.on-dark}`, rounded `{rounded.md}`.

**`button-secondary-on-light`** — Light-canvas equivalent. Background `{colors.canvas-light}` with `{colors.hairline-on-light}` 1px border, text `{colors.ink}`.

**`button-tertiary-text`** — Inline text button with no background. Used for "Log In" in the top nav and inline "Read More" links.

**`button-trading-up`** — A solid green button used on price-up signals (Buy / Long actions). Background `{colors.trading-up}`, text `{colors.on-dark}`, rounded `{rounded.sm}` (4px), padding 8px × 20px. Smaller and tighter than `{component.button-primary}` because it appears in dense trading interfaces.

**`button-trading-down`** — Symmetric red variant for Sell / Short actions. Same shape, background `{colors.trading-down}`.

**`button-subscribe`** — Compact yellow CTA used in the Smart Money traders table to subscribe to a top trader. Smaller height (28px) and tighter padding than the primary CTA — fits inside dense table rows. Same yellow + black combination.

**`text-link`** — Inline body links in `{colors.primary}` (yellow on dark, also yellow on light). No underline by default. Type inherits `{typography.body-md}`.

### Cards & Containers

**`hero-band-dark`** — Full-width dark band carrying the homepage h1 + sub-headline + dual CTA pair. Background `{colors.canvas-dark}`, padding `{spacing.section}` (80px). The h1 ("316,258,026 USERS TRUST US") uses `{typography.hero-display}` at 64px / 700 — the system''s largest type role.

**`stat-callout-card`** — Inline yellow stat numbers (15,000 BTC, 7,488,223, $429,423,449). Transparent background, text `{colors.primary}`, type `{typography.number-display}` in BinancePlex. Used as a flat layout block, not a card with surface — the yellow text alone carries the visual weight.

**`trust-badge`** — Small dark cards holding "No.1 Customer Service" / "No.1 Trading Volume" claims. Background `{colors.surface-card-dark}`, rounded `{rounded.lg}` (8px), padding 16px × 20px. Yellow numeric or word badge ("No.1") sits next to a short label.

**`markets-table-card`** — The right-side markets table on the homepage. Background `{colors.surface-card-dark}`, rounded `{rounded.xl}` (12px), padding `{spacing.lg}` (24px). Carries a tab row (Popular / New listing / Top gainers), then a 5-column row of coin pairs with last price, 24h change %, action button. Each row uses `{component.markets-row}`.

**`markets-row`** — A single row inside the markets table. Transparent background, 12px vertical padding, hairline divider between rows. Coin icon (32×32) + symbol on left; last price in `{typography.number-md}` (BinancePlex); 24h change cell colored by direction (`{component.price-up-cell}` or `{component.price-down-cell}`); right-aligned chevron icon for "view detail."

**`price-up-cell`** / **`price-down-cell`** — Colored text cells for price changes. Transparent background, text `{colors.trading-up}` or `{colors.trading-down}`, type `{typography.number-md}` in BinancePlex. Always paired with a small triangle arrow indicating direction.

**`feature-photo-card`** — The "Trade on the go" section''s photo strip — 3 lifestyle photos showing people using the Binance app. Background `{colors.surface-card-dark}`, rounded `{rounded.xl}`. Photos crop edge-to-edge, no internal padding around the image.

**`qr-promo-card`** — The "Trade on the go. Anywhere, anytime." card with QR code. Background `{colors.surface-card-dark}`, rounded `{rounded.xl}`, padding `{spacing.xl}` (32px). Contains an h2 in `{typography.title-md}`, a body paragraph, app store badges (iOS / Android), and a centered QR code.

**`funds-safu-band`** — The yellow-headlined "FUNDS ARE SAFU" band. Background stays `{colors.canvas-dark}`, but the headline uses `{colors.primary}` at `{typography.display-lg}`. Below the headline, three large `{component.stat-callout-card}` numbers anchor the band: total BTC reserves, users helped, funds recovered.

**`faq-row`** — A single FAQ accordion row. Transparent background, padding 20px vertical, hairline divider between rows. Closed state: question in `{typography.title-sm}` + chevron icon at right. Open state: question + answer body in `{typography.body-md}`.

**`cta-band-dark`** — The "Secure, Low-Fee Trading on Binance" pre-footer CTA band. Background `{colors.surface-card-dark}` (one step elevated from canvas), rounded `{rounded.xl}`, padding `{spacing.xxl}` (48px). Carries an h2 in `{typography.display-sm}` and a `{component.button-primary}` aligned right.

### Light-Mode Transactional Components

**`buy-crypto-amount-card`** — The right-rail card on the Buy BTC page. Background `{colors.canvas-light}`, rounded `{rounded.lg}` (8px), padding `{spacing.lg}` (24px). Carries an editable amount input in `{typography.number-display}` (BinancePlex), a currency selector, and a yellow `{component.button-primary}` for "Continue" / "Confirm Order."

**`steps-card`** — The "How to Buy Crypto" 3-up cards (Enter Amount → Confirm Order → Receive Crypto). Background `{colors.canvas-light}`, rounded `{rounded.lg}`, padding `{spacing.lg}`. Each card has a small numbered icon, a `{typography.title-sm}` step name, and a body description.

**`price-chart-card`** — The "Bitcoin Markets" card carrying the BTC price chart. Background `{colors.canvas-light}`, rounded `{rounded.lg}`. Top row carries pair selector ($79,065.04, +0.45%); main area is a candlestick / line chart in `{colors.trading-up}` and `{colors.trading-down}`; bottom row carries timeframe selector (24H / 1W / 1M / 3M / 1Y / ALL).

**`conversion-cell`** — A single row in the BTC ↔ USD conversion table. Transparent background, text `{colors.body-on-light}`, type `{typography.body-md}`. Pair label on left (BTC, USDT, etc.); USD equivalent on right.

### Inputs & Forms

**`search-input-on-dark`** — The "Search currencies" input on the homepage hero. Background `{colors.surface-card-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}` (8px), padding 10px × 16px, height 40px. Carries a yellow `{component.button-primary-pill}` on the right side ("Sign Up").

**`text-input-on-light`** — Standard input on transactional pages. Background `{colors.canvas-light}`, 1px `{colors.hairline-on-light}` border, rounded `{rounded.md}` (6px), padding 10px × 16px, height 40px. Focus state inherits the focus-ring shadow.

**`cookie-consent-card`** — The cookie banner card visible on the homepage. Background `{colors.canvas-light}`, rounded `{rounded.lg}`, padding `{spacing.md}` (16px). Body text in `{typography.body-sm}` (13px / 400) with three stacked button options (Accept Cookies & Continue / Reject Additional Cookies / Manage Cookies).

### Smart Money Sub-System

**`trader-row`** — A single row in the top-traders table on /smart-money. Transparent background, padding 12px vertical, hairline divider between rows. Avatar + trader name + private/public badge on left; ROI %, AUM, mint date columns; yellow `{component.button-subscribe}` on right.

### Signature Components

**`arena-hero-gradient`** — The Futures Arena product-launch hero. A vertical gradient from `{colors.primary}` at top to `{colors.canvas-dark}` at bottom, with the prize-pool headline (4,000,000 USDT) in `{typography.display-lg}` centered. A `{component.button-primary-pill}` ("Join Now") sits below the headline. Used only on product-launch event surfaces — do not generalize to other heroes.

### Footer

**`footer-light`** — The light-gray footer that closes every page (including dark-canvas pages). Background `{colors.surface-soft-light}` (#fafafa), text `{colors.body-on-light}`. 6-column link list at desktop covering Community / About Us / Products / Business / Service / Learn columns. Vertical padding 64px. The deliberate light footer on a dark page is one of Binance''s most distinctive layout choices — it visually closes the page with a "marketing reset" surface.', '{"sourcePath":"docs/design-md/binance/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (Binance Yellow) for primary actions, brand-claim headlines, and the wordmark. Never use it for secondary or decorative purposes — yellow''s scarcity is what makes it powerful.
- Keep `{component.button-primary}` (yellow with black text) as the universal primary CTA across both dark and light modes. The same button appears identically on `{colors.canvas-dark}` and `{colors.canvas-light}`.
- Use `{component.button-trading-up}` (green) and `{component.button-trading-down}` (red) only for explicit Buy/Sell or Long/Short actions. Never use them for general "confirm" or "cancel" because they carry semantic price-direction meaning.
- Use BinancePlex for every number. Prices, volumes, percentages, stat counters — all BinancePlex. Mixing BinanceNova into a number ticker breaks the trading-platform character.
- Choose canvas mode by surface intent: dark for marketing / product showcase / trading dashboards; light for transactional dialogs (buy / deposit / withdraw / form submission).
- Anchor every editorial band with `{spacing.section}` (80px). Binance is denser than airy marketing sites — 80px is the right rhythm.

### Don''t
- Don''t introduce a second brand color. The system has exactly one accent (`{colors.primary}`) and any expansion dilutes the brand identity. The turquoise on Smart Money is a single-product experiment, not a system token.
- Don''t use yellow for body text or large surface fills. It is for focal-point CTAs and headlines only.
- Don''t use `{colors.trading-up}` / `{colors.trading-down}` as background fills on cards. They are price-direction signals, expressed as text color or small badge fill — never as a card surface.
- Don''t soften display weight. `{typography.hero-display}` and `{typography.display-lg}` are intentionally weight 700 — going to 400 reads as design-portfolio, not trading platform.
- Don''t add atmospheric gradients to the canvas (mesh, aurora, glow effects). Binance trusts color-block contrast — adding atmospheric depth muddies the trading-platform feel.
- Don''t invert `{component.button-primary}`''s text color. Black on yellow is the system''s signature — white text on yellow loses contrast and brand recognition.', '{"sourcePath":"docs/design-md/binance/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Top nav collapses to hamburger; hero h1 drops from 64px to ~36px; markets table converts to a horizontally-scrollable card list; demo grids drop to 1-up; footer 6 columns wrap to 2 |
| Tablet | 768–1024px | Top nav stays horizontal but tightens, secondary menu items hide behind a "More" dropdown; markets table 2-up; pricing/feature grids 2-up |
| Desktop | 1024–1440px | Full top-nav with all primary menu items; 5-column markets table; trading dashboards in 8/4 split (chart + side rail) |
| Wide | > 1440px | Same as desktop with more outer breathing room; max content width caps at 1280-1440px depending on surface |

### Touch Targets
- Primary CTAs render at minimum 40 × 40px (`{component.button-primary}` height + padding) — meets WCAG AAA''s 44 × 44 with surrounding spacing.
- Subscribe / inline action buttons are 28 × 28 — denser than ideal but matches industry trading platform norms.
- Coin icons in markets tables are 32 × 32px, with the entire row tappable for 44px+ effective target.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px; the menu opens as a full-screen sheet with the same yellow accent CTAs anchored to the bottom of the sheet.
- Markets table reflows to a horizontally-scrollable single card per coin pair on mobile.
- The hero stat numbers ("316M USERS") shrink proportionally rather than wrapping — Binance''s biggest claim must always read as a single block.
- Trading dashboards switch from chart + side-rail to chart-only with a separate "Trade" tab on mobile.
- The light footer stays full-bleed at every breakpoint — it does not collapse to a separate dark variant.

### Image Behavior
- Coin icons stay at fixed 24/32px sizes regardless of breakpoint.
- Lifestyle photos in the "Trade on the go" section crop responsively — wider at desktop, taller (vertical) at mobile.
- 3D coin-stack illustrations are fixed-aspect-ratio assets that scale uniformly without cropping.', '{"sourcePath":"docs/design-md/binance/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.button-primary}`, `{component.markets-row}`).
2. When adding a new component, decide first whether it lives in dark mode (marketing / product) or light mode (transactional). The same component appears in both with surface tone flipped.
3. Variants of an existing component (`-active`, `-disabled`) live as separate entries in `components:` — never as nested state objects.
4. Use `{token.refs}` everywhere prose mentions a color, a radius, a typography role, or a spacing value.
5. Never document hover. The system documents Default and Active/Pressed states only.
6. Numbers always use BinancePlex; copy always uses BinanceNova. Mixing them is a system violation.
7. Trading green / red are semantic price tokens — never repurpose them for "success" or "error" generic states.', '{"sourcePath":"docs/design-md/binance/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- The dembrandt frequency analyzer captured `#eaecef` (light hairline, count 1022) as the highest-frequency token. The brand-defining `{colors.primary}` (#FCD535) appears far less frequently because it''s used scarcely as accent — its system role had to be confirmed from screenshots.
- BinanceNova and BinancePlex weight-axis values are not formalized as variable-font tokens — only the static weights observed in screenshots are documented.
- Animation and transition timings (chart redraws, price-change flashes) are not in scope.
- Form validation states beyond `{component.text-input-on-light}` defaults are not extracted — error / success input variants would need a sign-up or order-confirmation flow to confirm.
- The trading dashboard surfaces (Spot / Futures / Margin) were not in the analyzed URL set; their order book, candlestick chart configuration, and position-management cards are not documented here.
- The light/dark theme toggle behavior (whether transactional pages can be forced dark by user preference) is product behavior, not extracted from the marketing surfaces.', '{"sourcePath":"docs/design-md/binance/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_1', '#FCD535', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_2', '#fcd535', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_3', '#f0b90b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_4', '#3a3a1f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_5', '#181a20', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_6', '#eaecef', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_7', '#707a8a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_8', '#929aa5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_9', '#2b3139', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_10', '#cdd1d6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_11', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_12', '#0b0e11', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_13', '#1e2329', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_14', '#fafafa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_15', '#f5f5f5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_16', '#0ecb81', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_17', '#f6465d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_18', '#2dbdb6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'color', 'color_19', '#3b82f6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'typography', 'font_1', 'BinanceNova, -apple-system, BlinkMacSystemFont, sans-serif', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'typography', 'font_2', 'BinanceNova, sans-serif', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'typography', 'font_3', 'BinancePlex, BinanceNova, sans-serif', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'typography', 'font_4', 'fontFamily: "BinanceNova, -apple-system, BlinkMacSystemFont, sans-serif', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md'), 'typography', 'font_5', 'fontFamily: "BinancePlex, BinanceNova, sans-serif', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/binance/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/binance/DESIGN.md';


-- Bmw
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Bmw', 'bmw', 'design-reference', null, now())
  on conflict (slug) do update
    set name = excluded.name,
        category = excluded.category,
        updated_at = now()
  returning id
),
d as (
  insert into design_documents (
    brand_id,
    source_type,
    original_filename,
    original_blob_url,
    status,
    raw_markdown,
    updated_at
  )
  select id, 'markdown_seed', 'docs/design-md/bmw/DESIGN.md', null, 'seeded', '---
version: alpha
name: BMW-design-analysis
description: BMW''s corporate site — distinct from BMW M''s motorsport-bombastic variant, this is a measured and settled corporate-automotive interface. On a light (cream-tinted white) canvas, BMW corporate blue (#1c69d4) carries every primary CTA; dark navy hero bands frame model photography. BMW Type Next Latin sets the entire hierarchy on two weights — heavy 700 display and Light 300 body. Configuration and reservation flows ride a card-based 4-up grid, where each card holds a model render, a name, and a "Learn More" link.

colors:
  primary: "#1c69d4"
  primary-active: "#0653b6"
  primary-disabled: "#d6d6d6"
  ink: "#262626"
  body: "#3c3c3c"
  body-strong: "#1a1a1a"
  muted: "#6b6b6b"
  muted-soft: "#9a9a9a"
  hairline: "#e6e6e6"
  hairline-strong: "#cccccc"
  canvas: "#ffffff"
  surface-soft: "#f7f7f7"
  surface-card: "#fafafa"
  surface-strong: "#ebebeb"
  surface-dark: "#1a2129"
  surface-dark-elevated: "#262e38"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  on-dark-soft: "#bbbbbb"
  m-blue-light: "#0066b1"
  m-blue-dark: "#1c69d4"
  m-red: "#e22718"
  success: "#22c55e"
  warning: "#f59e0b"
  error: "#dc2626"

typography:
  display-xl:
    fontFamily: "''BMW Type Next Latin'', system-ui, -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: 0
  display-lg:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0
  display-md:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: 0
  display-sm:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
  title-lg:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  title-md:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 14px
    fontWeight: 300
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.5px
  label-uppercase:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 1.5px
    textTransform: uppercase
  button:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 0.5px
  nav-link:
    fontFamily: "''BMW Type Next Latin'', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.3px

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 8px
  lg: 12px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 64px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 14px 32px
    height: 48px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.none}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 13px 31px
    height: 48px
  button-secondary-on-dark:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 13px 31px
  button-text-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.label-uppercase}"
  text-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  hero-band-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xl}"
    padding: 80px
  hero-photo-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: 80px
  model-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.none}"
    padding: 24px
  model-card-photo:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.none}"
  feature-photo-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.none}"
    padding: 24px
  spec-cell:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.display-sm}"
    rounded: "{rounded.none}"
    padding: 24px
  inventory-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.none}"
    padding: 16px
  filter-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    padding: 8px 14px
  filter-chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
  configurator-option-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 16px 24px
  configurator-option-tile-selected:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 15px 23px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 14px 16px
    height: 48px
  cookie-consent-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 24px
  category-tab:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.label-uppercase}"
    rounded: "{rounded.none}"
  category-tab-active:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.label-uppercase}"
    rounded: "{rounded.none}"
  m-stripe-divider:
    backgroundColor: transparent
    rounded: "{rounded.none}"
  cta-band-photo:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-md}"
    padding: 80px
  footer:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 64px
---

## Overview

BMW''s corporate site carries a far more **measured, corporate-automotive** interface than its motorsport-bombastic cousin BMW M. The atmosphere is light: `{colors.canvas}` (#ffffff) is the base surface, `{colors.surface-card}` (#fafafa) carries the soft-grey card plates, and dark navy `{colors.surface-dark}` (#1a2129) appears only inside hero bands — one per page, framing the lead model render.

Type runs BMW''s licensed **BMW Type Next Latin** at two weights: heavy 700 (display + button + nav) and Light 300 (body + secondary copy). That contrast — heavy display next to thin paragraph — is the editorial signature, channeling the brand''s "European-engineered" voice. Weight 500 is deliberately absent; weight 400 only appears on caption and nav-link in neutral utility contexts.

The brand action color, **BMW corporate blue** (`{colors.primary}` — #1c69d4), works alone across every primary CTA — buttons are **rectangular, 0px corner**, with white type. The site rotates a blue-button + dark-navy-hero combination across page rhythm. The M tricolor stripe (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`) only appears in motorsport contexts and as M-model badges/dividers — never in the corporate site''s main language.

The configuration and reservation flows add a dealer-side inventory UI on top of the same system — filter chips, model cards, price tables — but typography and color stay identical; only density goes up.

**Key Characteristics:**
- Light `{colors.canvas}` is the base surface; dark navy `{colors.surface-dark}` appears only inside hero bands — page rhythm relies on contrast.
- BMW corporate blue (`{colors.primary}` — #1c69d4) acts as the single primary action color.
- BMW Type Next Latin: weight 700 display against weight 300 body is the signature.
- Buttons are **rectangular, 0px radius** — corporate dialect, distinct from M''s sportier radii.
- Model cards run as 4-up or 5-up grids with no hairline border or only minimal border — just white plate + photo + title.
- Photography (model renders) sits in environment, no shadow — depth comes entirely from color-block contrast.
- M tricolor stripe appears only in M-model contexts — not part of the corporate language.
- Section rhythm holds at `{spacing.section}` (80px) for every major band.

## Colors

### Brand & Accent
- **BMW Blue (Primary)** (`{colors.primary}` — #1c69d4): The single brand action color. All primary CTAs, "Learn More" link prefixes (blue text), nav-link active state. Press shifts to `{colors.primary-active}` (#0653b6).
- **M Blue Light** (`{colors.m-blue-light}` — #0066b1) + **M Blue Dark** (`{colors.m-blue-dark}` — #1c69d4) + **M Red** (`{colors.m-red}` — #e22718): The M tricolor stripe — appears on the corporate site only on M-model pages and the "M" badge. Never as CTA colors.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default page surface.
- **Surface Soft** (`{colors.surface-soft}` — #f7f7f7): Soft grey for the footer and sub-navigation bands.
- **Surface Card** (`{colors.surface-card}` — #fafafa): The light plate behind a model card''s photo block.
- **Surface Strong** (`{colors.surface-strong}` — #ebebeb): A slightly heavier grey used as a section divider.
- **Surface Dark** (`{colors.surface-dark}` — #1a2129): Dark navy for hero bands and large dark CTAs. Not pure black — carries a warm undertone.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #262e38): One step lighter, used for nested cards on top of the dark hero.

### Hairlines
- **Hairline** (`{colors.hairline}` — #e6e6e6): The 1px divider — input outline, configurator card outline, table separator.
- **Hairline Strong** (`{colors.hairline-strong}` — #cccccc): A more visible 1px outline — disabled secondary buttons, emphasized table border.

### Text
- **Ink** (`{colors.ink}` — #262626): All display and primary text. Not pure black — soft against photography.
- **Body** (`{colors.body}` — #3c3c3c): Default running text.
- **Body Strong** (`{colors.body-strong}` — #1a1a1a): Emphasized paragraphs and lead text.
- **Muted** (`{colors.muted}` — #6b6b6b): Footer links, breadcrumbs, captions.
- **Muted Soft** (`{colors.muted-soft}` — #9a9a9a): Disabled text, fine-print legal.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on a blue button.
- **On Dark** (`{colors.on-dark}` — #ffffff): White text on a dark hero band.
- **On Dark Soft** (`{colors.on-dark-soft}` — #bbbbbb): A slightly muted white for secondary text on dark bands.

### Semantic
- **Success** (`{colors.success}` — #22c55e): Confirmation messages and "available" indicators.
- **Warning** (`{colors.warning}` — #f59e0b): Warning callouts.
- **Error** (`{colors.error}` — #dc2626): Validation errors.

## Typography

### Font Family
The system runs **BMW Type Next Latin** in two cuts: regular (display + UI labels) and **BMW Type Next Latin Light** (body + secondary copy). Fallback stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

The display/body split is functional:
- BMW Type Next Latin (700) → display headlines, button labels, nav links
- BMW Type Next Latin Light (300) → paragraphs, descriptive copy
- BMW Type Next Latin (400) → caption, neutral nav-link contexts

This three-way split mirrors BMW M''s — corporate and the M sub-brand share the same typographic DNA; only the weight/size ratios differ.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 700 | 1.05 | 0 | Hero h1 ("iX3", model name) |
| `{typography.display-lg}` | 48px | 700 | 1.1 | 0 | Section heads |
| `{typography.display-md}` | 32px | 700 | 1.15 | 0 | Sub-section heads |
| `{typography.display-sm}` | 24px | 700 | 1.25 | 0 | CTA-band headlines |
| `{typography.title-lg}` | 20px | 700 | 1.3 | 0 | Card group titles |
| `{typography.title-md}` | 18px | 700 | 1.4 | 0 | Model card title, intro paragraphs |
| `{typography.title-sm}` | 16px | 700 | 1.4 | 0 | Inventory card title, list label |
| `{typography.body-md}` | 16px | 300 (Light) | 1.55 | 0 | Default body — BMW Type Next Latin Light |
| `{typography.body-sm}` | 14px | 300 (Light) | 1.55 | 0 | Footer body, fine-print |
| `{typography.caption}` | 12px | 400 | 1.4 | 0.5px | Photo captions, meta |
| `{typography.label-uppercase}` | 13px | 700 | 1.3 | 1.5px | "LEARN MORE" inline links, category tabs |
| `{typography.button}` | 14px | 700 | 1.0 | 0.5px | Standard CTA button label |
| `{typography.nav-link}` | 14px | 400 | 1.4 | 0.3px | Top-nav menu items |

### Principles
- The **700/300 contrast** is the editorial signature. Weight 500 is absent from the system.
- **No negative letter-spacing** — BMW Type Next Latin works on a wide body, so tracking stays at default. Apple/Cal.com-style tightening reads off-brand here.
- **UPPERCASE inline links** — "LEARN MORE"-style CTAs run uppercase with 1.5px tracking. The "machined precision" voice.
- **Weight 400 lives in a narrow lane** — only caption and nav-link, both neutral utility roles.

### Note on Font Substitutes
BMW Type Next Latin is a licensed BMW typeface. Open-source alternatives:
- **Inter** (variable) — close match at weight 700/300. Leave letter-spacing at 0.0em.
- **Saira Condensed** — for a slightly more compressed BMW Type feel.

## Layout

### Spacing System
- **Base unit:** 8px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px.
- **Section padding:** `{spacing.section}` (80px) for every major editorial band.
- **Card internal padding:** `{spacing.lg}` (24px) for model and feature cards.

### Grid & Container
- **Max content width:** ~1440px center-aligned.
- **Editorial body:** A single 12-column grid.
- **Model card grids:** 4-up or 5-up at desktop, 2-up at tablet, 1-up on mobile.
- **Configurator inventory grids:** 3-up filter row + 4-up vehicle cards, dense layout.

### Whitespace Philosophy
BMW''s whitespace strategy is tighter than BMW M''s motorsport-aerated grenadier — the corporate side is more utility-driven. Section rhythm is 80px (not M''s 96px). Card padding is 24px (not M''s 32px). The page is denser, more dealership-functional.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body, top nav, footer, hero bands |
| Soft hairline | 1px `{colors.hairline}` border | Configurator option tile, table divider |
| Card surface | `{colors.surface-card}` background — no shadow | Model card photo plate |
| Photographic | Edge-to-edge photography | Hero band, model renders |

The system never uses a drop shadow. Depth comes entirely from (a) color-block contrast (light canvas vs dark hero) and (b) photographic subject + lighting.

### Decorative Depth
- **`m-stripe-divider`** — a 4px-tall horizontal tricolor stripe (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`). Only in M-model contexts, motorsport badges, or as an M-related section divider. Not part of the main corporate flow.
- **Photographic depth** — full-bleed vehicle photography (lighting + subject) does the work chrome would otherwise do.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Every button, card, input, configurator chip — the dominant radius |
| `{rounded.xs}` | 2px | Very small badges, very rare |
| `{rounded.sm}` | 4px | Small inline button (rare) |
| `{rounded.md}` | 8px | Mobile-only collapse cards (rare) |
| `{rounded.lg}` | 12px | Very rare — modal/dialog corners |
| `{rounded.pill}` | 9999px | Filter chips in some contexts (rare) |
| `{rounded.full}` | 9999px / 50% | Avatar, circular icon button |

The radius hierarchy is binary: **rectangular for everything, circular only for icon buttons.** A clear departure from the soft-cornered SaaS dialect of Apple or Cal.com — closer to BMW corporate-automotive''s "engineered precision" voice.

### Photography Geometry
- Hero photography is full-bleed at 16:9 or 21:9 cinematic ratio.
- Model card photos sit at 16:10, edge-to-edge with `{rounded.none}` corners.
- Configurator vehicle renders sit on a white studio background, full silhouette visible.

## Components

### Top Navigation

**`top-nav`** — A white sticky nav bar pinned to the top of the page. 64px tall, `{colors.canvas}` background. Left: BMW circular badge logo; center: primary horizontal menu (Models, Next Generation, Pre-Owned, Dealers, Test Drive); right: cart icon, language picker, profile. Menu items render in `{typography.nav-link}` (14px / 400 / 0.3px tracking).

### Buttons

**`button-primary`** — The signature primary CTA. Background `{colors.primary}` (BMW Blue #1c69d4), text `{colors.on-primary}`, type `{typography.button}` (BMW Type Next Latin 14px / 700 / 0.5px tracking), padding 14px × 32px, height 48px, rounded `{rounded.none}` (0px — rectangular). Press state: `button-primary-active` shifts to `{colors.primary-active}`.

**`button-secondary`** — A white button with a hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px `{colors.hairline-strong}` border, same padding + height + radius.

**`button-secondary-on-dark`** — Used over a dark hero band. Background transparent, text `{colors.on-dark}`, 1px `{colors.on-dark}` border, same rectangular shape.

**`button-text-link`** — An inline UPPERCASE letter-spaced link. No background, text `{colors.ink}`, type `{typography.label-uppercase}` (13px / 700 / 1.5px tracking). Reads as "LEARN MORE", terminated by a `›` chevron.

**`text-link`** — An inline link inside body copy. `{colors.ink}` text, no underline by default; underlines per context.

### Cards & Containers

**`hero-band-dark`** — Full-width dark navy hero. Background `{colors.surface-dark}`, text `{colors.on-dark}`, vertical padding `{spacing.section}` (80px). Centered: model name in `{typography.display-xl}` (64px / 700) + sub-headline + vehicle render (right-aligned or below). A single `{component.button-primary}` (blue) or `{component.button-secondary-on-dark}`.

**`hero-photo-band`** — A light-canvas model showcase band. Background `{colors.canvas}`, text `{colors.ink}`. The vehicle render takes the wide area; right or below, a headline + two link CTAs + sub-tagline.

**`model-card`** — Used in 4-up or 5-up model card grids on the homepage ("BMW iX3", "BMW iX", "BMW 5 Series"). Background `{colors.canvas}`, rounded `{rounded.none}`, padding `{spacing.lg}` (24px). Contents: model render at the top (`{component.model-card-photo}` on `{colors.surface-card}`), model name in `{typography.title-md}` (18px / 700) below, a one-line tagline in `{typography.body-sm}` (14px / 300), and a `{component.button-text-link}` ("LEARN MORE ›").

**`model-card-photo`** — The card''s photo plate. Background `{colors.surface-card}` (#fafafa — soft grey), rounded `{rounded.none}`, vehicle render in full silhouette. Zero padding — the photo runs edge-to-edge.

**`feature-photo-card`** — A feature/lifestyle card. Background `{colors.canvas}`, padding `{spacing.lg}`. 16:9 photo at the top, `{typography.title-md}` headline + body excerpt below.

**`spec-cell`** — A technical spec cell (model detail page). Transparent background, separated by hairline dividers. Value on top (`{typography.display-sm}` 24px / 700), label below (`{typography.label-uppercase}`).

### Inventory & Configurator

**`inventory-card`** — One card per vehicle on the dealer inventory page. Background `{colors.canvas}`, padding `{spacing.md}` (16px), rounded `{rounded.none}`. Vehicle photo on top, model + variant name + price + "View" link below.

**`filter-chip`** + **`filter-chip-active`** — Inventory filter chips (model, year, price range). Inactive: background `{colors.canvas}`, 1px `{colors.hairline-strong}` border, text `{colors.ink}`, type `{typography.caption}`. Active: background `{colors.ink}`, text `{colors.on-dark}`. Padding 8px × 14px, radius `{rounded.none}`.

**`configurator-option-tile`** + **`configurator-option-tile-selected`** — Configurator selection cell (color, wheels, upholstery). Inactive: background `{colors.canvas}`, 1px hairline. Selected: 2px `{colors.primary}` border. Padding 16px × 24px, radius `{rounded.none}`.

### Inputs & Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.none}` (0px), padding 14px × 16px, height 48px, 1px hairline border. On focus, the border thickens to ink.

**`cookie-consent-card`** — Cookie banner. Background `{colors.canvas}`, 1px hairline, padding `{spacing.lg}` (24px), `{typography.body-sm}` (14px / 300 — Light even in legal copy).

### Tabs / Tags

**`category-tab`** + **`category-tab-active`** — Category sub-nav. Inactive: transparent + `{colors.muted}` UPPERCASE label. Active: transparent + `{colors.ink}` UPPERCASE label + 2px ink underline. 12px vertical padding, no horizontal radius.

### Brand Signature

**`m-stripe-divider`** — A 4px-tall horizontal tricolor stripe (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`). Only in M-model contexts, motorsport badges, or as an M-related section divider. Absent from the corporate main flow; on M-model detail pages and the M Performance badge it plays an inline divider role.

### CTA / Footer

**`cta-band-photo`** — A pre-footer "Discover the New iX3"-style band. Background `{colors.surface-dark}` with a full-bleed vehicle photo. Centered headline in `{typography.display-md}` (32px / 700) + a single `{component.button-secondary-on-dark}`. 80px padding.

**`footer`** — The closing soft-grey footer. Background `{colors.surface-soft}` (#f7f7f7 — not pure white — soft grey), text `{colors.body}`. A 4-column link list: Models / Services / Dealers / About. Vertical padding 64px. Below, a copyright line in `{typography.body-sm}` with `{colors.muted}`.

## Do''s and Don''ts

### Do
- Sit every page on `{colors.canvas}` (pure white); reserve `{colors.surface-dark}` for hero bands only.
- Pair primary CTAs with `{colors.primary}` (BMW Blue) + `{colors.on-primary}` white text + `{rounded.none}` 0px corners — the corporate signature.
- Set display headlines in BMW Type Next Latin 700 and body in Light 300. The contrast is non-negotiable.
- Use UPPERCASE letter-spaced links like "LEARN MORE" as inline CTAs.
- Place the model card photo on `{colors.surface-card}` with the title beneath — the standard BMW corporate pattern.
- Hold section rhythm at `{spacing.section}` (80px) — tighter than BMW M''s 96px.
- Reserve the M tricolor stripe for M-model contexts and motorsport dividers.

### Don''t
- Don''t add a brand color other than blue — BMW Blue is the only primary action color.
- Don''t use pill or rounded buttons — `{rounded.none}` (0px) rectangular IS the brand button.
- Don''t drop display weight to 500 — the system uses 700 / 400 / 300; 500 is absent.
- Don''t bold body type — Light 300 is the BMW corporate editorial voice.
- Don''t add drop shadows to cards — depth comes from photo + color-block contrast.
- Don''t repeat the same surface mode across two consecutive bands — light → dark hero → light → light feature → dark CTA → light footer rotation is required.
- Don''t use the M tricolor stripe as a CTA fill — divider/accent role only.
- Don''t mix languages in a single page — UI language must stay consistent.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 64→40px; model card grid 1-up; configurator filter chips 2-up; footer 4 col → 1 col |
| Tablet | 768–1024px | Top nav narrows, secondary menu hides under "More"; model card 2-up; inventory 2-up |
| Desktop | 1024–1440px | Full top-nav; 4-up or 5-up model card grid; inventory 3-up; full configurator UI |
| Wide | > 1440px | Same as desktop, content fixed at 1440px; gutters absorb the rest |

### Touch Targets
- `{component.button-primary}` minimum 48 × 48px — above WCAG AAA (44 × 44).
- `{component.text-input}` height 48px.
- Category tabs run with 12px vertical padding, giving an effective tap area > 44px.

### Collapsing Strategy
- The top nav collapses to a hamburger below 768px; the menu opens as a full-screen sheet.
- The hero band''s internal layout drops to a single column.
- Model card grid 4-up/5-up → 2-up → 1-up.
- The configurator filter chip row scrolls horizontally on mobile.
- The M tricolor stripe stays at 4px height across every breakpoint.

### Image Behavior
- Model renders scale at every breakpoint while preserving native aspect ratios.
- Hero photography may shift to a more vertical crop on mobile (art direction).
- Inventory vehicle photos may move from 16:9 to 4:3 on mobile.

## Iteration Guide

1. Focus on a single component. Reference its YAML key directly (`{component.model-card}`, `{component.button-primary}`).
2. New components default to `{rounded.none}` (0px). Use `{rounded.full}` only for circular icon buttons.
3. Variants (`-active`, `-disabled`, `-selected`) live as separate entries inside the `components:` block.
4. `{token.refs}` everywhere — never inline hex.
5. Hover state is never documented. Only Default and Active/Pressed states.
6. Display headlines stay BMW Type Next Latin 700; body stays Light 300; the trio is fixed.
7. Keep UI strings in a single language — match the locale of the page.

## Known Gaps

- BMW Type Next Latin is licensed to BMW and not published as a public web font; Inter at weights 700/300 is documented as the substitute.
- Animation and transition timings (configurator color swap, model card hover-reveal) are out of scope here.
- Form validation states beyond `{component.text-input}` focus were not extracted — error/success states would need a dedicated form page.
- The dealer inventory sub-domain shares typography and color with the main corporate site; only UI density rises (filters, tables, prices).
- A cookie consent overlay can occlude part of the hero — the lead hero band content may not be fully captured.
- The M tricolor stripe appears infrequently on this corporate site; full motorsport context lives on the BMW M site.
', now()
  from b
  on conflict (brand_id, original_filename) do update
    set status = 'seeded',
        raw_markdown = excluded.raw_markdown,
        updated_at = now()
  returning id
),
deleted_sections as (
  delete from design_sections where document_id = (select id from d)
),
deleted_tokens as (
  delete from design_tokens where document_id = (select id from d)
)
insert into design_sections (document_id, category, original_title, normalized_title, content_markdown, content_json, confidence, sort_order)
values
((select id from d), 'overview', 'Overview', 'overview', '## Overview

BMW''s corporate site carries a far more **measured, corporate-automotive** interface than its motorsport-bombastic cousin BMW M. The atmosphere is light: `{colors.canvas}` (#ffffff) is the base surface, `{colors.surface-card}` (#fafafa) carries the soft-grey card plates, and dark navy `{colors.surface-dark}` (#1a2129) appears only inside hero bands — one per page, framing the lead model render.

Type runs BMW''s licensed **BMW Type Next Latin** at two weights: heavy 700 (display + button + nav) and Light 300 (body + secondary copy). That contrast — heavy display next to thin paragraph — is the editorial signature, channeling the brand''s "European-engineered" voice. Weight 500 is deliberately absent; weight 400 only appears on caption and nav-link in neutral utility contexts.

The brand action color, **BMW corporate blue** (`{colors.primary}` — #1c69d4), works alone across every primary CTA — buttons are **rectangular, 0px corner**, with white type. The site rotates a blue-button + dark-navy-hero combination across page rhythm. The M tricolor stripe (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`) only appears in motorsport contexts and as M-model badges/dividers — never in the corporate site''s main language.

The configuration and reservation flows add a dealer-side inventory UI on top of the same system — filter chips, model cards, price tables — but typography and color stay identical; only density goes up.

**Key Characteristics:**
- Light `{colors.canvas}` is the base surface; dark navy `{colors.surface-dark}` appears only inside hero bands — page rhythm relies on contrast.
- BMW corporate blue (`{colors.primary}` — #1c69d4) acts as the single primary action color.
- BMW Type Next Latin: weight 700 display against weight 300 body is the signature.
- Buttons are **rectangular, 0px radius** — corporate dialect, distinct from M''s sportier radii.
- Model cards run as 4-up or 5-up grids with no hairline border or only minimal border — just white plate + photo + title.
- Photography (model renders) sits in environment, no shadow — depth comes entirely from color-block contrast.
- M tricolor stripe appears only in M-model contexts — not part of the corporate language.
- Section rhythm holds at `{spacing.section}` (80px) for every major band.', '{"sourcePath":"docs/design-md/bmw/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **BMW Blue (Primary)** (`{colors.primary}` — #1c69d4): The single brand action color. All primary CTAs, "Learn More" link prefixes (blue text), nav-link active state. Press shifts to `{colors.primary-active}` (#0653b6).
- **M Blue Light** (`{colors.m-blue-light}` — #0066b1) + **M Blue Dark** (`{colors.m-blue-dark}` — #1c69d4) + **M Red** (`{colors.m-red}` — #e22718): The M tricolor stripe — appears on the corporate site only on M-model pages and the "M" badge. Never as CTA colors.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default page surface.
- **Surface Soft** (`{colors.surface-soft}` — #f7f7f7): Soft grey for the footer and sub-navigation bands.
- **Surface Card** (`{colors.surface-card}` — #fafafa): The light plate behind a model card''s photo block.
- **Surface Strong** (`{colors.surface-strong}` — #ebebeb): A slightly heavier grey used as a section divider.
- **Surface Dark** (`{colors.surface-dark}` — #1a2129): Dark navy for hero bands and large dark CTAs. Not pure black — carries a warm undertone.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #262e38): One step lighter, used for nested cards on top of the dark hero.

### Hairlines
- **Hairline** (`{colors.hairline}` — #e6e6e6): The 1px divider — input outline, configurator card outline, table separator.
- **Hairline Strong** (`{colors.hairline-strong}` — #cccccc): A more visible 1px outline — disabled secondary buttons, emphasized table border.

### Text
- **Ink** (`{colors.ink}` — #262626): All display and primary text. Not pure black — soft against photography.
- **Body** (`{colors.body}` — #3c3c3c): Default running text.
- **Body Strong** (`{colors.body-strong}` — #1a1a1a): Emphasized paragraphs and lead text.
- **Muted** (`{colors.muted}` — #6b6b6b): Footer links, breadcrumbs, captions.
- **Muted Soft** (`{colors.muted-soft}` — #9a9a9a): Disabled text, fine-print legal.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on a blue button.
- **On Dark** (`{colors.on-dark}` — #ffffff): White text on a dark hero band.
- **On Dark Soft** (`{colors.on-dark-soft}` — #bbbbbb): A slightly muted white for secondary text on dark bands.

### Semantic
- **Success** (`{colors.success}` — #22c55e): Confirmation messages and "available" indicators.
- **Warning** (`{colors.warning}` — #f59e0b): Warning callouts.
- **Error** (`{colors.error}` — #dc2626): Validation errors.', '{"sourcePath":"docs/design-md/bmw/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The system runs **BMW Type Next Latin** in two cuts: regular (display + UI labels) and **BMW Type Next Latin Light** (body + secondary copy). Fallback stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

The display/body split is functional:
- BMW Type Next Latin (700) → display headlines, button labels, nav links
- BMW Type Next Latin Light (300) → paragraphs, descriptive copy
- BMW Type Next Latin (400) → caption, neutral nav-link contexts

This three-way split mirrors BMW M''s — corporate and the M sub-brand share the same typographic DNA; only the weight/size ratios differ.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 700 | 1.05 | 0 | Hero h1 ("iX3", model name) |
| `{typography.display-lg}` | 48px | 700 | 1.1 | 0 | Section heads |
| `{typography.display-md}` | 32px | 700 | 1.15 | 0 | Sub-section heads |
| `{typography.display-sm}` | 24px | 700 | 1.25 | 0 | CTA-band headlines |
| `{typography.title-lg}` | 20px | 700 | 1.3 | 0 | Card group titles |
| `{typography.title-md}` | 18px | 700 | 1.4 | 0 | Model card title, intro paragraphs |
| `{typography.title-sm}` | 16px | 700 | 1.4 | 0 | Inventory card title, list label |
| `{typography.body-md}` | 16px | 300 (Light) | 1.55 | 0 | Default body — BMW Type Next Latin Light |
| `{typography.body-sm}` | 14px | 300 (Light) | 1.55 | 0 | Footer body, fine-print |
| `{typography.caption}` | 12px | 400 | 1.4 | 0.5px | Photo captions, meta |
| `{typography.label-uppercase}` | 13px | 700 | 1.3 | 1.5px | "LEARN MORE" inline links, category tabs |
| `{typography.button}` | 14px | 700 | 1.0 | 0.5px | Standard CTA button label |
| `{typography.nav-link}` | 14px | 400 | 1.4 | 0.3px | Top-nav menu items |

### Principles
- The **700/300 contrast** is the editorial signature. Weight 500 is absent from the system.
- **No negative letter-spacing** — BMW Type Next Latin works on a wide body, so tracking stays at default. Apple/Cal.com-style tightening reads off-brand here.
- **UPPERCASE inline links** — "LEARN MORE"-style CTAs run uppercase with 1.5px tracking. The "machined precision" voice.
- **Weight 400 lives in a narrow lane** — only caption and nav-link, both neutral utility roles.

### Note on Font Substitutes
BMW Type Next Latin is a licensed BMW typeface. Open-source alternatives:
- **Inter** (variable) — close match at weight 700/300. Leave letter-spacing at 0.0em.
- **Saira Condensed** — for a slightly more compressed BMW Type feel.', '{"sourcePath":"docs/design-md/bmw/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 8px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px.
- **Section padding:** `{spacing.section}` (80px) for every major editorial band.
- **Card internal padding:** `{spacing.lg}` (24px) for model and feature cards.

### Grid & Container
- **Max content width:** ~1440px center-aligned.
- **Editorial body:** A single 12-column grid.
- **Model card grids:** 4-up or 5-up at desktop, 2-up at tablet, 1-up on mobile.
- **Configurator inventory grids:** 3-up filter row + 4-up vehicle cards, dense layout.

### Whitespace Philosophy
BMW''s whitespace strategy is tighter than BMW M''s motorsport-aerated grenadier — the corporate side is more utility-driven. Section rhythm is 80px (not M''s 96px). Card padding is 24px (not M''s 32px). The page is denser, more dealership-functional.', '{"sourcePath":"docs/design-md/bmw/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body, top nav, footer, hero bands |
| Soft hairline | 1px `{colors.hairline}` border | Configurator option tile, table divider |
| Card surface | `{colors.surface-card}` background — no shadow | Model card photo plate |
| Photographic | Edge-to-edge photography | Hero band, model renders |

The system never uses a drop shadow. Depth comes entirely from (a) color-block contrast (light canvas vs dark hero) and (b) photographic subject + lighting.

### Decorative Depth
- **`m-stripe-divider`** — a 4px-tall horizontal tricolor stripe (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`). Only in M-model contexts, motorsport badges, or as an M-related section divider. Not part of the main corporate flow.
- **Photographic depth** — full-bleed vehicle photography (lighting + subject) does the work chrome would otherwise do.', '{"sourcePath":"docs/design-md/bmw/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Every button, card, input, configurator chip — the dominant radius |
| `{rounded.xs}` | 2px | Very small badges, very rare |
| `{rounded.sm}` | 4px | Small inline button (rare) |
| `{rounded.md}` | 8px | Mobile-only collapse cards (rare) |
| `{rounded.lg}` | 12px | Very rare — modal/dialog corners |
| `{rounded.pill}` | 9999px | Filter chips in some contexts (rare) |
| `{rounded.full}` | 9999px / 50% | Avatar, circular icon button |

The radius hierarchy is binary: **rectangular for everything, circular only for icon buttons.** A clear departure from the soft-cornered SaaS dialect of Apple or Cal.com — closer to BMW corporate-automotive''s "engineered precision" voice.

### Photography Geometry
- Hero photography is full-bleed at 16:9 or 21:9 cinematic ratio.
- Model card photos sit at 16:10, edge-to-edge with `{rounded.none}` corners.
- Configurator vehicle renders sit on a white studio background, full silhouette visible.', '{"sourcePath":"docs/design-md/bmw/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav`** — A white sticky nav bar pinned to the top of the page. 64px tall, `{colors.canvas}` background. Left: BMW circular badge logo; center: primary horizontal menu (Models, Next Generation, Pre-Owned, Dealers, Test Drive); right: cart icon, language picker, profile. Menu items render in `{typography.nav-link}` (14px / 400 / 0.3px tracking).

### Buttons

**`button-primary`** — The signature primary CTA. Background `{colors.primary}` (BMW Blue #1c69d4), text `{colors.on-primary}`, type `{typography.button}` (BMW Type Next Latin 14px / 700 / 0.5px tracking), padding 14px × 32px, height 48px, rounded `{rounded.none}` (0px — rectangular). Press state: `button-primary-active` shifts to `{colors.primary-active}`.

**`button-secondary`** — A white button with a hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px `{colors.hairline-strong}` border, same padding + height + radius.

**`button-secondary-on-dark`** — Used over a dark hero band. Background transparent, text `{colors.on-dark}`, 1px `{colors.on-dark}` border, same rectangular shape.

**`button-text-link`** — An inline UPPERCASE letter-spaced link. No background, text `{colors.ink}`, type `{typography.label-uppercase}` (13px / 700 / 1.5px tracking). Reads as "LEARN MORE", terminated by a `›` chevron.

**`text-link`** — An inline link inside body copy. `{colors.ink}` text, no underline by default; underlines per context.

### Cards & Containers

**`hero-band-dark`** — Full-width dark navy hero. Background `{colors.surface-dark}`, text `{colors.on-dark}`, vertical padding `{spacing.section}` (80px). Centered: model name in `{typography.display-xl}` (64px / 700) + sub-headline + vehicle render (right-aligned or below). A single `{component.button-primary}` (blue) or `{component.button-secondary-on-dark}`.

**`hero-photo-band`** — A light-canvas model showcase band. Background `{colors.canvas}`, text `{colors.ink}`. The vehicle render takes the wide area; right or below, a headline + two link CTAs + sub-tagline.

**`model-card`** — Used in 4-up or 5-up model card grids on the homepage ("BMW iX3", "BMW iX", "BMW 5 Series"). Background `{colors.canvas}`, rounded `{rounded.none}`, padding `{spacing.lg}` (24px). Contents: model render at the top (`{component.model-card-photo}` on `{colors.surface-card}`), model name in `{typography.title-md}` (18px / 700) below, a one-line tagline in `{typography.body-sm}` (14px / 300), and a `{component.button-text-link}` ("LEARN MORE ›").

**`model-card-photo`** — The card''s photo plate. Background `{colors.surface-card}` (#fafafa — soft grey), rounded `{rounded.none}`, vehicle render in full silhouette. Zero padding — the photo runs edge-to-edge.

**`feature-photo-card`** — A feature/lifestyle card. Background `{colors.canvas}`, padding `{spacing.lg}`. 16:9 photo at the top, `{typography.title-md}` headline + body excerpt below.

**`spec-cell`** — A technical spec cell (model detail page). Transparent background, separated by hairline dividers. Value on top (`{typography.display-sm}` 24px / 700), label below (`{typography.label-uppercase}`).

### Inventory & Configurator

**`inventory-card`** — One card per vehicle on the dealer inventory page. Background `{colors.canvas}`, padding `{spacing.md}` (16px), rounded `{rounded.none}`. Vehicle photo on top, model + variant name + price + "View" link below.

**`filter-chip`** + **`filter-chip-active`** — Inventory filter chips (model, year, price range). Inactive: background `{colors.canvas}`, 1px `{colors.hairline-strong}` border, text `{colors.ink}`, type `{typography.caption}`. Active: background `{colors.ink}`, text `{colors.on-dark}`. Padding 8px × 14px, radius `{rounded.none}`.

**`configurator-option-tile`** + **`configurator-option-tile-selected`** — Configurator selection cell (color, wheels, upholstery). Inactive: background `{colors.canvas}`, 1px hairline. Selected: 2px `{colors.primary}` border. Padding 16px × 24px, radius `{rounded.none}`.

### Inputs & Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.none}` (0px), padding 14px × 16px, height 48px, 1px hairline border. On focus, the border thickens to ink.

**`cookie-consent-card`** — Cookie banner. Background `{colors.canvas}`, 1px hairline, padding `{spacing.lg}` (24px), `{typography.body-sm}` (14px / 300 — Light even in legal copy).

### Tabs / Tags

**`category-tab`** + **`category-tab-active`** — Category sub-nav. Inactive: transparent + `{colors.muted}` UPPERCASE label. Active: transparent + `{colors.ink}` UPPERCASE label + 2px ink underline. 12px vertical padding, no horizontal radius.

### Brand Signature

**`m-stripe-divider`** — A 4px-tall horizontal tricolor stripe (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`). Only in M-model contexts, motorsport badges, or as an M-related section divider. Absent from the corporate main flow; on M-model detail pages and the M Performance badge it plays an inline divider role.

### CTA / Footer

**`cta-band-photo`** — A pre-footer "Discover the New iX3"-style band. Background `{colors.surface-dark}` with a full-bleed vehicle photo. Centered headline in `{typography.display-md}` (32px / 700) + a single `{component.button-secondary-on-dark}`. 80px padding.

**`footer`** — The closing soft-grey footer. Background `{colors.surface-soft}` (#f7f7f7 — not pure white — soft grey), text `{colors.body}`. A 4-column link list: Models / Services / Dealers / About. Vertical padding 64px. Below, a copyright line in `{typography.body-sm}` with `{colors.muted}`.', '{"sourcePath":"docs/design-md/bmw/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Sit every page on `{colors.canvas}` (pure white); reserve `{colors.surface-dark}` for hero bands only.
- Pair primary CTAs with `{colors.primary}` (BMW Blue) + `{colors.on-primary}` white text + `{rounded.none}` 0px corners — the corporate signature.
- Set display headlines in BMW Type Next Latin 700 and body in Light 300. The contrast is non-negotiable.
- Use UPPERCASE letter-spaced links like "LEARN MORE" as inline CTAs.
- Place the model card photo on `{colors.surface-card}` with the title beneath — the standard BMW corporate pattern.
- Hold section rhythm at `{spacing.section}` (80px) — tighter than BMW M''s 96px.
- Reserve the M tricolor stripe for M-model contexts and motorsport dividers.

### Don''t
- Don''t add a brand color other than blue — BMW Blue is the only primary action color.
- Don''t use pill or rounded buttons — `{rounded.none}` (0px) rectangular IS the brand button.
- Don''t drop display weight to 500 — the system uses 700 / 400 / 300; 500 is absent.
- Don''t bold body type — Light 300 is the BMW corporate editorial voice.
- Don''t add drop shadows to cards — depth comes from photo + color-block contrast.
- Don''t repeat the same surface mode across two consecutive bands — light → dark hero → light → light feature → dark CTA → light footer rotation is required.
- Don''t use the M tricolor stripe as a CTA fill — divider/accent role only.
- Don''t mix languages in a single page — UI language must stay consistent.', '{"sourcePath":"docs/design-md/bmw/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 64→40px; model card grid 1-up; configurator filter chips 2-up; footer 4 col → 1 col |
| Tablet | 768–1024px | Top nav narrows, secondary menu hides under "More"; model card 2-up; inventory 2-up |
| Desktop | 1024–1440px | Full top-nav; 4-up or 5-up model card grid; inventory 3-up; full configurator UI |
| Wide | > 1440px | Same as desktop, content fixed at 1440px; gutters absorb the rest |

### Touch Targets
- `{component.button-primary}` minimum 48 × 48px — above WCAG AAA (44 × 44).
- `{component.text-input}` height 48px.
- Category tabs run with 12px vertical padding, giving an effective tap area > 44px.

### Collapsing Strategy
- The top nav collapses to a hamburger below 768px; the menu opens as a full-screen sheet.
- The hero band''s internal layout drops to a single column.
- Model card grid 4-up/5-up → 2-up → 1-up.
- The configurator filter chip row scrolls horizontally on mobile.
- The M tricolor stripe stays at 4px height across every breakpoint.

### Image Behavior
- Model renders scale at every breakpoint while preserving native aspect ratios.
- Hero photography may shift to a more vertical crop on mobile (art direction).
- Inventory vehicle photos may move from 16:9 to 4:3 on mobile.', '{"sourcePath":"docs/design-md/bmw/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on a single component. Reference its YAML key directly (`{component.model-card}`, `{component.button-primary}`).
2. New components default to `{rounded.none}` (0px). Use `{rounded.full}` only for circular icon buttons.
3. Variants (`-active`, `-disabled`, `-selected`) live as separate entries inside the `components:` block.
4. `{token.refs}` everywhere — never inline hex.
5. Hover state is never documented. Only Default and Active/Pressed states.
6. Display headlines stay BMW Type Next Latin 700; body stays Light 300; the trio is fixed.
7. Keep UI strings in a single language — match the locale of the page.', '{"sourcePath":"docs/design-md/bmw/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- BMW Type Next Latin is licensed to BMW and not published as a public web font; Inter at weights 700/300 is documented as the substitute.
- Animation and transition timings (configurator color swap, model card hover-reveal) are out of scope here.
- Form validation states beyond `{component.text-input}` focus were not extracted — error/success states would need a dedicated form page.
- The dealer inventory sub-domain shares typography and color with the main corporate site; only UI density rises (filters, tables, prices).
- A cookie consent overlay can occlude part of the hero — the lead hero band content may not be fully captured.
- The M tricolor stripe appears infrequently on this corporate site; full motorsport context lives on the BMW M site.', '{"sourcePath":"docs/design-md/bmw/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_1', '#1c69d4', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_2', '#0653b6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_3', '#d6d6d6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_4', '#262626', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_5', '#3c3c3c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_6', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_7', '#6b6b6b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_8', '#9a9a9a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_9', '#e6e6e6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_10', '#cccccc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_11', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_12', '#f7f7f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_13', '#fafafa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_14', '#ebebeb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_15', '#1a2129', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_16', '#262e38', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_17', '#bbbbbb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_18', '#0066b1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_19', '#e22718', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_20', '#22c55e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_21', '#f59e0b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md'), 'color', 'color_22', '#dc2626', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/bmw/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/bmw/DESIGN.md';


-- Bmw M
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Bmw M', 'bmw-m', 'design-reference', null, now())
  on conflict (slug) do update
    set name = excluded.name,
        category = excluded.category,
        updated_at = now()
  returning id
),
d as (
  insert into design_documents (
    brand_id,
    source_type,
    original_filename,
    original_blob_url,
    status,
    raw_markdown,
    updated_at
  )
  select id, 'markdown_seed', 'docs/design-md/bmw-m/DESIGN.md', null, 'seeded', '---
version: alpha
name: BMW-M-design-analysis
description: A motorsport-engineering interface anchored on a near-black canvas with white BMW Type Next Latin display headlines in confident UPPERCASE. The brand carries no decorative voltage — its energy comes from full-bleed automotive photography (cars on tracks, driver-cockpit shots, carbon-fiber detail) and the iconic M tricolor stripe (light blue → dark blue → red) used sparingly as a brand signature on logos, dividers, and motorsport chrome. Type stays light to medium weight to feel European-engineered, never American-bombastic.

colors:
  primary: "#ffffff"
  ink: "#ffffff"
  body: "#bbbbbb"
  body-strong: "#e6e6e6"
  muted: "#7e7e7e"
  hairline: "#3c3c3c"
  hairline-strong: "#262626"
  canvas: "#000000"
  surface-card: "#1a1a1a"
  surface-elevated: "#262626"
  surface-soft: "#0d0d0d"
  on-primary: "#000000"
  on-dark: "#ffffff"
  m-blue-light: "#0066b1"
  m-blue-dark: "#1c69d4"
  m-red: "#e22718"
  bmw-blue: "#1c69d4"
  electric-blue: "#0653b6"
  carbon-gray: "#2b2b2b"
  warning: "#f4b400"
  success: "#0fa336"

typography:
  display-xl:
    fontFamily: "BMWTypeNextLatin, sans-serif"
    fontSize: 80px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0
  display-lg:
    fontFamily: "BMWTypeNextLatin, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: 0
  display-md:
    fontFamily: "BMWTypeNextLatin, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0
  display-sm:
    fontFamily: "BMWTypeNextLatin, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: 0
  title-lg:
    fontFamily: "BMWTypeNextLatin, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  title-md:
    fontFamily: "BMWTypeNextLatin, sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "BMWTypeNextLatin, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  label-uppercase:
    fontFamily: "BMWTypeNextLatin, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 1.5px
  body-md:
    fontFamily: "BMWTypeNextLatin Light, BMWTypeNextLatin, sans-serif"
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "BMWTypeNextLatin Light, sans-serif"
    fontSize: 14px
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "BMWTypeNextLatin, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.5px
  button:
    fontFamily: "BMWTypeNextLatin, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 1.5px
  nav-link:
    fontFamily: "BMWTypeNextLatin, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.5px

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 16px 32px
    height: 48px
  button-primary-outline:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 16px 32px
    height: 48px
  button-on-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 16px 32px
  button-icon:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    size: 48px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.label-uppercase}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.nav-link}"
    height: 64px
  hero-photo-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xl}"
    padding: 96px
  m-stripe-divider:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    height: 4px
  feature-photo-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.none}"
    padding: 24px
  model-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.none}"
    padding: 24px
  magazine-article-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.none}"
    padding: 24px
  spec-cell:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 24px
  cookie-consent-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 24px
  category-tab:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.label-uppercase}"
    padding: 12px 0
  category-tab-active:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.label-uppercase}"
    padding: 12px 0
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 12px 16px
    height: 48px
  chatbot-launcher:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.none}"
    padding: 24px
  cta-band-photo:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-md}"
    padding: 80px
  motorsport-photo-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.none}"
  carousel-arrow:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    size: 48px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 64px
---

## Overview

BMW M''s marketing surface is a near-pure black canvas (`{colors.canvas}` — #000) holding white BMW Type Next Latin headlines in **confident UPPERCASE**. The system has no decorative voltage of its own; brand energy comes from **full-bleed automotive photography** — cars cornering at speed, carbon-fiber wheel detail, driver cockpit shots, motorsport pit lanes — placed as edge-to-edge content that fills entire bands. UI chrome around the photography stays minimal: thin sans-serif copy, dividers as 1px hairlines (`{colors.hairline}`), all-caps button labels with no fill until hovered.

The **M tricolor stripe** — `{colors.m-blue-light}` (#0066b1) → `{colors.m-blue-dark}` (#1c69d4) → `{colors.m-red}` (#e22718) — appears sparingly as the brand''s signature accent, used on the M wordmark, motorsport chrome, vehicle-tech callouts, and model badges. It is never a CTA color and never used as a background fill — the tricolor is exclusively a brand-identity marker.

Type voice runs **BMW Type Next Latin** in two cuts: regular for display + nav labels and Light for body + secondary copy. Display sizes use weight 700 (BMW''s signature heavy-but-tight setting), while body type drops to weight 300 (Light). The contrast between heavy display and light body is the system''s editorial signature.

**Key Characteristics:**
- Near-pure black canvas (`{colors.canvas}` — #000) with white type. The system inverts almost nothing — there is no light-mode marketing surface.
- Display headlines in UPPERCASE BMW Type Next Latin at weight 700. Sub-heads stay sentence-case at lighter weight.
- M tricolor (`{colors.m-blue-light}` / `{colors.m-blue-dark}` / `{colors.m-red}`) used as 4px brand-stripe dividers, M-wordmark accents, and motorsport chrome — never as buttons or fills.
- Photography fills entire bands edge-to-edge. Cars are always the visual subject; UI chrome backs off to small white labels overlaid on photography.
- Buttons are flat with `{rounded.none}` (0px) corners and uppercase letterspaced labels. The "industrial precision" rectangular silhouette IS the brand.
- Border radius is mostly zero across the system. The few exceptions: `{rounded.full}` on circular icon buttons (carousel arrows, chatbot launcher) and `{rounded.sm}` on a handful of small toggle pills.
- Spacing is generous and grid-aligned: `{spacing.section}` (96px) between major bands; `{spacing.xxl}` (64px) inside hero photo bands; `{spacing.xl}` (40px) inside content cards.

## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #ffffff): The system''s primary type and CTA color. Used for h1/h2/h3 display, body text on dark, and primary button labels (the buttons themselves are transparent or canvas-colored — the white text + outline IS the button).
- **M Blue Light** (`{colors.m-blue-light}` — #0066b1): The first stop in the M tricolor stripe. Used on M-badge accents and motorsport chrome.
- **M Blue Dark** (`{colors.m-blue-dark}` — #1c69d4): The middle stop. The same hex as `{colors.bmw-blue}` — BMW''s heritage corporate blue, repurposed as the middle band of the M stripe.
- **M Red** (`{colors.m-red}` — #e22718): The third stop. The signature M-power red, used in the stripe and on motorsport-pace callouts.
- **Electric Blue** (`{colors.electric-blue}` — #0653b6): A separate electric-vehicle accent used on M xDrive electric model pages. Distinct from the heritage blue — feels colder, more digital.

### Surface
- **Canvas** (`{colors.canvas}` — #000000): The default page floor across every marketing surface. True black.
- **Surface Soft** (`{colors.surface-soft}` — #0d0d0d): A barely-different-from-black used for spec table cells and footer-adjacent strips.
- **Surface Card** (`{colors.surface-card}` — #1a1a1a): Cards, secondary buttons, icon-button backgrounds.
- **Surface Elevated** (`{colors.surface-elevated}` — #262626): One step lighter, used for nested cards inside dark bands.
- **Carbon Gray** (`{colors.carbon-gray}` — #2b2b2b): Carbon-fiber-inspired surface tone used on technical-spec cards.

### Hairlines & Borders
- **Hairline** (`{colors.hairline}` — #3c3c3c): The 1px divider tone on dark surfaces. Used between body sections, between table rows, around card outlines.
- **Hairline Strong** (`{colors.hairline-strong}` — #262626): Same hex as `{colors.surface-elevated}` — borders feel like one-step elevations rather than ink lines.

### Text
- **Ink / On Dark** (`{colors.on-dark}` — #ffffff): All headline and primary text on dark canvas.
- **Body** (`{colors.body}` — #bbbbbb): Default running-text color (slightly cooler than pure white). Used for body paragraphs and secondary metadata.
- **Body Strong** (`{colors.body-strong}` — #e6e6e6): Emphasized body / lead paragraph.
- **Muted** (`{colors.muted}` — #7e7e7e): Footer links, breadcrumbs, captions.

### Semantic
- **Warning** (`{colors.warning}` — #f4b400): Used very sparingly on technical-warning callouts.
- **Success** (`{colors.success}` — #0fa336): Order-confirmation states (rare on marketing surfaces).

## Typography

### Font Family
**BMW Type Next Latin** is BMW''s licensed display + body typeface. The system uses two cuts: regular and Light. The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

The split is a deliberate weight-pair:
- Display (700) for headlines, navigation labels, button text, and category labels — the "stamped" voice
- Light (300) for body paragraphs, descriptive copy, and secondary metadata — the "engineered" voice

The contrast between heavy display and light body is BMW''s editorial signature — never blur it by using regular (400) display or medium (500) body.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 80px | 700 | 1.0 | 0 | Hero h1 ("THE ULTIMATE", "MORE BMW M.") |
| `{typography.display-lg}` | 56px | 700 | 1.05 | 0 | Section heads ("MORE FROM BMW M MAGAZINE.") |
| `{typography.display-md}` | 40px | 700 | 1.1 | 0 | Sub-section heads, model names |
| `{typography.display-sm}` | 32px | 700 | 1.15 | 0 | CTA-band heads, category page titles |
| `{typography.title-lg}` | 24px | 700 | 1.3 | 0 | Card titles in 3-up grids |
| `{typography.title-md}` | 20px | 400 | 1.4 | 0 | Card sub-titles, lead paragraphs |
| `{typography.title-sm}` | 18px | 400 | 1.4 | 0 | Spec callouts, intro paragraphs |
| `{typography.label-uppercase}` | 14px | 700 | 1.3 | 1.5px | Category tabs, "VIEW MORE" inline labels |
| `{typography.body-md}` | 16px | 300 (Light) | 1.5 | 0 | Default body — BMW Type Next Latin Light |
| `{typography.body-sm}` | 14px | 300 (Light) | 1.5 | 0 | Footer body, cookie consent, fine print |
| `{typography.caption}` | 12px | 400 | 1.4 | 0.5px | Photo captions, image-credit lines |
| `{typography.button}` | 14px | 700 | 1.0 | 1.5px | All button labels — uppercase, letterspaced |
| `{typography.nav-link}` | 14px | 400 | 1.4 | 0.5px | Top-nav menu items |

### Principles
The system contrasts heavy headlines (700) against very light body (300) at all times — the gap is the editorial signature. Letter-spacing is non-trivial: button labels and category labels carry 1.5px tracking that makes them feel "machined" rather than "typed." Display headlines stay at 0 letter-spacing — BMW Type''s natural cap-height handles spacing on large sizes.

UPPERCASE display is the default voice for h1/h2 — sentence case appears on body and intro paragraphs but rarely on headlines. The all-caps treatment is a brand-voice signal, not a stylistic choice.

### Note on Font Substitutes
If BMW Type Next Latin is unavailable, **Inter** (variable) at 700/300 is the closest open-source substitute. Adjust display headline tracking to -0.5px to match BMW Type''s tighter spacing at large sizes. **Saira Condensed** is an alternative for headlines if a slightly more compressed feel is desired.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 40px · `{spacing.xxl}` 64px · `{spacing.section}` 96px.
- **Section padding (vertical):** `{spacing.section}` (96px) between major editorial bands.
- **Hero photo bands:** `{spacing.xxl}` (64px) internal vertical padding around the hero h1 + sub-headline pair.
- **Card internal padding:** `{spacing.lg}` (24px) for content and model cards; `{spacing.xl}` (40px) for spec-cell tables.
- **Gutters:** `{spacing.lg}` (24px) between cards in 3-up grids; `{spacing.md}` (16px) inside footer columns.

### Grid & Container
- **Max content width:** ~1440px centered on marketing pages — wider than typical SaaS to give photography breathing room.
- **Editorial body:** Single 12-column grid; photo bands bleed full-bleed (no max-width).
- **Card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Footer:** 4-column link list at desktop, 2-up at tablet, 1-up at mobile.

### Whitespace Philosophy
BMW M trusts photography to do the visual work. Whitespace around photography is restrained — the cars fill the frame, and copy sits below or beside them in tightly-aligned columns. Where whitespace appears (between body sections, around CTAs), it''s always uniform `{spacing.section}` (96px). The system never adds atmospheric backdrops, gradients, or decoration — empty space stays as empty black canvas.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, footer, photo bands |
| Soft hairline | 1px `{colors.hairline}` border | Section dividers, card outlines, table rows |
| Card surface | `{colors.surface-card}` background over canvas — no shadow | Feature photo cards, magazine cards, chatbot launcher |
| Photographic depth | Full-bleed photography with edge-to-edge crop | Hero bands, motorsport features — depth via subject matter, not chrome |

The system uses no drop shadows and no layered chrome. Depth comes entirely from photography (subject + lens + lighting) and the contrast between black canvas and slightly-elevated `{colors.surface-card}`.

### Decorative Depth
- **M Stripe Divider** (`{component.m-stripe-divider}`): A 4px-tall horizontal divider carrying the M tricolor (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`). Used on motorsport chrome, model-detail headers, and brand-identity moments. The stripe is the system''s only true "decorative" element — used sparingly to mark significance.
- **Carbon-fiber surfaces**: The technical-spec page uses `{colors.carbon-gray}` (#2b2b2b) cells with subtle texture overlay. This is a single-page treatment, not a system-wide pattern.
- **Photographic depth**: Full-bleed cars are the depth. Lighting in the photography (track lights, sunset rim-light) does the elevation work that drop shadows would do in a SaaS system.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | All buttons, cards, photo containers, spec cells, inputs — the dominant radius |
| `{rounded.xs}` | 2px | Almost no use — reserved for legal CTAs |
| `{rounded.sm}` | 4px | Small toggle pills on configurator surfaces |
| `{rounded.md}` | 6px | Rare — small dropdown menu items |
| `{rounded.full}` | 9999px / 50% | Circular icon buttons, carousel arrows, chatbot launcher |

The radius hierarchy is "almost always 0, sometimes circular." This binary radius decision is a deliberate brand-language choice — sharp rectangles read as engineered precision; circles read as functional controls. Nothing in between.

### Photography Geometry
Hero photography fills full-width with no rounding. Photo cards inside grids retain `{rounded.none}` corners, edge-to-edge images. Carbon-wheel detail shots and motorsport-pit photos use 16:9 or 21:9 cinema-aspect ratios. Driver portraits in racing-team grids use 4:5 portrait crops, also with sharp corners.

## Components

### Top Navigation

**`top-nav`** — Black nav bar pinned to the top of every page. 64px tall, `{colors.canvas}` background. Carries the BMW M logo at left (M tricolor + BMW roundel + "M" wordmark), primary horizontal menu (Models, Topics, Magazine, Configurator, Fastlane), right-side cluster with language selector, search icon, account icon. Menu items render in `{typography.nav-link}` with sentence-case labels.

### Buttons

**`button-primary`** — The signature primary CTA. Background `{colors.canvas}` (or transparent over photography), text `{colors.on-dark}` (white), 1px white border outline, rounded `{rounded.none}` (0px), padding 16px × 32px, height 48px. Type `{typography.button}` — uppercase 14px / 700 / 1.5px tracking. The rectangular silhouette and uppercase letterspaced label IS the brand button.

**`button-primary-outline`** — Same shape as primary but with transparent background and white outline only. Used over photography where a filled button would clash with the image.

**`button-on-light`** — Used on rare light-surface contexts (configurator, account dialogs). Background `{colors.canvas}`, text `{colors.on-dark}` — black button with white text, inverted from the dark-canvas default.

**`button-icon`** — Circular icon buttons (carousel controls, share, favorite). 48 × 48px, background `{colors.surface-card}`, white icon centered, rounded `{rounded.full}`. The only non-rectangular button shape in the system.

**`carousel-arrow`** — Specific 48 × 48 circular arrow used in photo carousels. Same shape as `{component.button-icon}` with chevron glyph.

**`text-link`** — Inline uppercase letterspaced links ("VIEW ALL MODELS", "READ MORE"). `{typography.label-uppercase}`, white on dark, no underline. The chevron arrow → glyph appears next to most link labels.

### Cards & Containers

**`hero-photo-band`** — Full-width black band with full-bleed automotive photography filling most of the frame. The h1 uses `{typography.display-xl}` (80px / 700) and sits left-aligned over the photo, often with a small subtitle in `{typography.body-md}` below. Vertical padding `{spacing.xxl}` (64px). No card frame — the photo IS the band.

**`feature-photo-card`** — Used in 3-up grids for "MORE FROM BMW M MAGAZINE" and similar editorial sections. Background `{colors.surface-card}`, rounded `{rounded.none}`, internal padding `{spacing.lg}` (24px). Top half of the card is a 16:9 photo (full-bleed within the card); below the photo, a category tag in `{typography.label-uppercase}`, a `{typography.title-lg}` title, and a short body description.

**`model-card`** — Used in the "MORE NEW M MODELS" 3-up grid. Background `{colors.canvas}` (no card surface — just photo on black), rounded `{rounded.none}`. Top: 16:10 hero shot of the model. Below: model name in `{typography.display-md}` (40px / 700), short specs line in `{typography.body-sm}`, a `{component.text-link}` ("EXPLORE THIS MODEL").

**`magazine-article-card`** — A more text-forward card variant used on the magazine overview page. Background `{colors.canvas}` with hairline border, rounded `{rounded.none}`. Carries a small thumbnail at top, a category label in `{typography.label-uppercase}`, headline in `{typography.title-lg}`, and a body excerpt.

**`spec-cell`** — Technical specification cells used on model-detail pages (engine specs, weight, top speed, 0-100 time). Background `{colors.surface-soft}` (#0d0d0d), rounded `{rounded.none}`, padding `{spacing.lg}` (24px). Each cell holds a value in `{typography.display-sm}` (32px / 700) at top and a label in `{typography.label-uppercase}` below.

**`motorsport-photo-card`** — Edge-to-edge photo cards used in the racing-team / motorsport sections. No card surface — just a full-bleed photograph with a small overlay caption in white text at the bottom-left. The photography IS the brand here.

**`chatbot-launcher`** — A right-side card-style entry point ("BMW M CHATBOT") on the homepage. Background `{colors.surface-card}`, rounded `{rounded.none}`, padding `{spacing.lg}` (24px). Carries an h3 title, a short prompt, and a `{component.button-primary}` to launch.

**`category-tab`** + **`category-tab-active`** — The category selector tabs used on the magazine and topics pages (e.g., "ALL · MAGAZINE · MODELS · LIFESTYLE · MOTORSPORT"). Tabs render as text-only labels in `{typography.label-uppercase}`. Active state changes text color from `{colors.body}` to `{colors.on-dark}` and adds a 2px white underline below the label. No background fill, no rounded corners.

### Inputs & Forms

**`text-input`** — Standard text input on dark surfaces. Background `{colors.surface-card}`, text `{colors.on-dark}`, type `{typography.body-md}`, rounded `{rounded.none}` (0px), padding 12px × 16px, height 48px. 1px hairline border. Focus state thickens the border to white.

**`cookie-consent-card`** — A right-side cookie-banner card visible on the homepage. Background `{colors.canvas}` with 1px hairline, rounded `{rounded.none}`, padding `{spacing.lg}` (24px). Body text in `{typography.body-sm}` (14px / 300) — Light weight even for legal text. Two buttons stacked at bottom: primary outline + text-link.

### Signature Components

**`m-stripe-divider`** — The 4px horizontal stripe carrying the M tricolor (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`). Used as a divider on motorsport chrome, between brand-identity sections, and as a hover-state indicator on category tabs. The most distinctive non-typographic element in the system.

**`cta-band-photo`** — A pre-footer "Drive an M" CTA band carrying full-bleed photography of a car cornering on a track, with a centered headline in `{typography.display-md}` and a `{component.button-primary-outline}` below. Vertical padding 80px. The CTA inherits the editorial gravity of the rest of the page through full-bleed photography rather than chrome.

### Footer

**`footer`** — Black footer that closes every page. Background `{colors.canvas}`, text `{colors.body}`. 4-column link list at desktop covering BMW M Models / BMW M Lifestyle / Owners / Company. Vertical padding 64px. Bottom row carries the BMW corporate disclaimer in `{typography.caption}` and language selector. The footer never inverts — it stays black even when the body might transition.

## Do''s and Don''ts

### Do
- Anchor every page with full-bleed automotive photography. The cars are the brand voltage; chrome backs off.
- Use UPPERCASE display headlines in `{typography.display-xl}` or `{typography.display-lg}`. Sentence-case display reads as off-brand.
- Pair heavy display (700) with light body (300). The weight contrast is the editorial signature.
- Reserve the M tricolor stripe for brand-identity moments — wordmark accents, motorsport chrome, model badges. Never as a button fill or surface.
- Use `{rounded.none}` (0px) by default. Reserve `{rounded.full}` for circular icon buttons only.
- Letter-space all-caps labels at 1.5px. The "machined" feel is non-negotiable.
- Use `{spacing.section}` (96px) between major editorial bands for grid-aligned vertical rhythm.

### Don''t
- Don''t introduce a brand color outside the M tricolor (`{colors.m-blue-light}` / `{colors.m-blue-dark}` / `{colors.m-red}`) and the heritage `{colors.bmw-blue}`.
- Don''t bold body type. Body stays at 300 (Light) — bumping to 400 or 500 makes the page feel marketing-bombastic instead of European-engineered.
- Don''t use rounded buttons. The rectangular silhouette IS the brand. Rounded corners read as consumer-tech, not motorsport.
- Don''t put gradient backdrops behind hero type. The hero IS the photography — the page floor stays pure black, and the photo provides the depth.
- Don''t repeat the same surface mode in two consecutive bands. Rhythm: photo band → spec table → photo band → magazine grid → photo band. Two text-only bands in a row read as a corporate site.
- Don''t use the M stripe as a button fill. The stripe is a divider / accent — never an action surface.
- Don''t bold uppercase tracking under 1.5px on button labels — the spacing is what makes them feel "machined."

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 scales 80→48px; demo grid 1-up; photo cards stack full-width; footer 4 cols → 1 |
| Tablet | 768–1024px | Top nav stays horizontal but tightens; 2-up card grids; spec tables 2-up |
| Desktop | 1024–1440px | Full top-nav; 3-up card grids; spec tables 4-up |
| Wide | > 1440px | Same as desktop with more breathing room; max content 1440px |

### Touch Targets
- `{component.button-primary}` renders at 48 × 48px minimum — meets WCAG AAA.
- `{component.button-icon}` and `{component.carousel-arrow}` are exactly 48 × 48 — comfortably above the 44 × 44 minimum.
- `{component.text-input}` height is 48px.
- Category tabs render as text-only labels with 12px vertical padding; effective tap area meets 44px with surrounding spacing.

### Collapsing Strategy
- Top nav collapses to a hamburger sheet at < 768px; the menu opens as a full-screen black overlay with the M tricolor stripe at the top.
- Photography stays full-bleed at every breakpoint — never collapses to a margin''d container.
- Card grids reduce columns rather than scaling cards down; photography retains its native aspect ratio.
- Spec tables collapse from 4-up to 2-up to 1-up; spec values stay at `{typography.display-sm}` regardless of column count.
- The M-stripe divider stays at 4px height across all breakpoints.

### Image Behavior
- Hero photography crops responsively — wider crops at desktop, vertical crops on mobile.
- Lifestyle and motorsport photos retain native aspect ratios; the system never letterboxes or pillarboxes.
- The M wordmark + tricolor logo scales proportionally with viewport width.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.hero-photo-band}`, `{component.spec-cell}`).
2. New components default to `{rounded.none}` (0px). Only use `{rounded.full}` if it''s a circular icon button.
3. Variants (`-active`, `-disabled`) live as separate entries in `components:`.
4. Use `{token.refs}` everywhere — never inline hex.
5. Never document hover states. Default and Active/Pressed only.
6. Display headlines stay UPPERCASE 700; body stays sentence-case 300. Never blur the contrast.
7. The M tricolor is brand-identity-only — never extend it to system tokens for "primary action."
8. When in doubt about emphasis: bigger photography before bigger type.

## Known Gaps

- The dembrandt frequency analyzer captured the white text (count 955) as the highest-frequency token. The black canvas was inferred from screenshot — dembrandt''s body-background sampling didn''t surface it as a top palette entry, but the page is unambiguously black-on-white-text.
- The exact M tricolor stops are documented from public BMW brand guidelines; the screenshots show the stripe as a small element but pixel-sampling at this resolution doesn''t reliably distinguish #0066b1 from #1c69d4. Treat the documented stops as canonical based on BMW Design Works'' published brand spec.
- BMW Type Next Latin weight axis values beyond Light (300) and regular (700) are not documented — only the static weights observed in screenshots.
- Animation and transition timings (photo carousel transitions, hover-reveal effects, configurator interactions) are not in scope.
- Form validation states beyond `{component.text-input}` defaults are not extracted — error / success input variants would need a configurator or order flow to confirm.
- The configurator surface (vehicle build pages with color / wheel / interior pickers) was not in the analyzed URL set; its swatch grid, comparison panels, and price-summary card are not documented here.
- The cookie consent overlay obscured part of the homepage hero in the captured screenshot; secondary hero treatments (different car models cycling through the hero band) may carry variations not captured.
', now()
  from b
  on conflict (brand_id, original_filename) do update
    set status = 'seeded',
        raw_markdown = excluded.raw_markdown,
        updated_at = now()
  returning id
),
deleted_sections as (
  delete from design_sections where document_id = (select id from d)
),
deleted_tokens as (
  delete from design_tokens where document_id = (select id from d)
)
insert into design_sections (document_id, category, original_title, normalized_title, content_markdown, content_json, confidence, sort_order)
values
((select id from d), 'overview', 'Overview', 'overview', '## Overview

BMW M''s marketing surface is a near-pure black canvas (`{colors.canvas}` — #000) holding white BMW Type Next Latin headlines in **confident UPPERCASE**. The system has no decorative voltage of its own; brand energy comes from **full-bleed automotive photography** — cars cornering at speed, carbon-fiber wheel detail, driver cockpit shots, motorsport pit lanes — placed as edge-to-edge content that fills entire bands. UI chrome around the photography stays minimal: thin sans-serif copy, dividers as 1px hairlines (`{colors.hairline}`), all-caps button labels with no fill until hovered.

The **M tricolor stripe** — `{colors.m-blue-light}` (#0066b1) → `{colors.m-blue-dark}` (#1c69d4) → `{colors.m-red}` (#e22718) — appears sparingly as the brand''s signature accent, used on the M wordmark, motorsport chrome, vehicle-tech callouts, and model badges. It is never a CTA color and never used as a background fill — the tricolor is exclusively a brand-identity marker.

Type voice runs **BMW Type Next Latin** in two cuts: regular for display + nav labels and Light for body + secondary copy. Display sizes use weight 700 (BMW''s signature heavy-but-tight setting), while body type drops to weight 300 (Light). The contrast between heavy display and light body is the system''s editorial signature.

**Key Characteristics:**
- Near-pure black canvas (`{colors.canvas}` — #000) with white type. The system inverts almost nothing — there is no light-mode marketing surface.
- Display headlines in UPPERCASE BMW Type Next Latin at weight 700. Sub-heads stay sentence-case at lighter weight.
- M tricolor (`{colors.m-blue-light}` / `{colors.m-blue-dark}` / `{colors.m-red}`) used as 4px brand-stripe dividers, M-wordmark accents, and motorsport chrome — never as buttons or fills.
- Photography fills entire bands edge-to-edge. Cars are always the visual subject; UI chrome backs off to small white labels overlaid on photography.
- Buttons are flat with `{rounded.none}` (0px) corners and uppercase letterspaced labels. The "industrial precision" rectangular silhouette IS the brand.
- Border radius is mostly zero across the system. The few exceptions: `{rounded.full}` on circular icon buttons (carousel arrows, chatbot launcher) and `{rounded.sm}` on a handful of small toggle pills.
- Spacing is generous and grid-aligned: `{spacing.section}` (96px) between major bands; `{spacing.xxl}` (64px) inside hero photo bands; `{spacing.xl}` (40px) inside content cards.', '{"sourcePath":"docs/design-md/bmw-m/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #ffffff): The system''s primary type and CTA color. Used for h1/h2/h3 display, body text on dark, and primary button labels (the buttons themselves are transparent or canvas-colored — the white text + outline IS the button).
- **M Blue Light** (`{colors.m-blue-light}` — #0066b1): The first stop in the M tricolor stripe. Used on M-badge accents and motorsport chrome.
- **M Blue Dark** (`{colors.m-blue-dark}` — #1c69d4): The middle stop. The same hex as `{colors.bmw-blue}` — BMW''s heritage corporate blue, repurposed as the middle band of the M stripe.
- **M Red** (`{colors.m-red}` — #e22718): The third stop. The signature M-power red, used in the stripe and on motorsport-pace callouts.
- **Electric Blue** (`{colors.electric-blue}` — #0653b6): A separate electric-vehicle accent used on M xDrive electric model pages. Distinct from the heritage blue — feels colder, more digital.

### Surface
- **Canvas** (`{colors.canvas}` — #000000): The default page floor across every marketing surface. True black.
- **Surface Soft** (`{colors.surface-soft}` — #0d0d0d): A barely-different-from-black used for spec table cells and footer-adjacent strips.
- **Surface Card** (`{colors.surface-card}` — #1a1a1a): Cards, secondary buttons, icon-button backgrounds.
- **Surface Elevated** (`{colors.surface-elevated}` — #262626): One step lighter, used for nested cards inside dark bands.
- **Carbon Gray** (`{colors.carbon-gray}` — #2b2b2b): Carbon-fiber-inspired surface tone used on technical-spec cards.

### Hairlines & Borders
- **Hairline** (`{colors.hairline}` — #3c3c3c): The 1px divider tone on dark surfaces. Used between body sections, between table rows, around card outlines.
- **Hairline Strong** (`{colors.hairline-strong}` — #262626): Same hex as `{colors.surface-elevated}` — borders feel like one-step elevations rather than ink lines.

### Text
- **Ink / On Dark** (`{colors.on-dark}` — #ffffff): All headline and primary text on dark canvas.
- **Body** (`{colors.body}` — #bbbbbb): Default running-text color (slightly cooler than pure white). Used for body paragraphs and secondary metadata.
- **Body Strong** (`{colors.body-strong}` — #e6e6e6): Emphasized body / lead paragraph.
- **Muted** (`{colors.muted}` — #7e7e7e): Footer links, breadcrumbs, captions.

### Semantic
- **Warning** (`{colors.warning}` — #f4b400): Used very sparingly on technical-warning callouts.
- **Success** (`{colors.success}` — #0fa336): Order-confirmation states (rare on marketing surfaces).', '{"sourcePath":"docs/design-md/bmw-m/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**BMW Type Next Latin** is BMW''s licensed display + body typeface. The system uses two cuts: regular and Light. The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

The split is a deliberate weight-pair:
- Display (700) for headlines, navigation labels, button text, and category labels — the "stamped" voice
- Light (300) for body paragraphs, descriptive copy, and secondary metadata — the "engineered" voice

The contrast between heavy display and light body is BMW''s editorial signature — never blur it by using regular (400) display or medium (500) body.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 80px | 700 | 1.0 | 0 | Hero h1 ("THE ULTIMATE", "MORE BMW M.") |
| `{typography.display-lg}` | 56px | 700 | 1.05 | 0 | Section heads ("MORE FROM BMW M MAGAZINE.") |
| `{typography.display-md}` | 40px | 700 | 1.1 | 0 | Sub-section heads, model names |
| `{typography.display-sm}` | 32px | 700 | 1.15 | 0 | CTA-band heads, category page titles |
| `{typography.title-lg}` | 24px | 700 | 1.3 | 0 | Card titles in 3-up grids |
| `{typography.title-md}` | 20px | 400 | 1.4 | 0 | Card sub-titles, lead paragraphs |
| `{typography.title-sm}` | 18px | 400 | 1.4 | 0 | Spec callouts, intro paragraphs |
| `{typography.label-uppercase}` | 14px | 700 | 1.3 | 1.5px | Category tabs, "VIEW MORE" inline labels |
| `{typography.body-md}` | 16px | 300 (Light) | 1.5 | 0 | Default body — BMW Type Next Latin Light |
| `{typography.body-sm}` | 14px | 300 (Light) | 1.5 | 0 | Footer body, cookie consent, fine print |
| `{typography.caption}` | 12px | 400 | 1.4 | 0.5px | Photo captions, image-credit lines |
| `{typography.button}` | 14px | 700 | 1.0 | 1.5px | All button labels — uppercase, letterspaced |
| `{typography.nav-link}` | 14px | 400 | 1.4 | 0.5px | Top-nav menu items |

### Principles
The system contrasts heavy headlines (700) against very light body (300) at all times — the gap is the editorial signature. Letter-spacing is non-trivial: button labels and category labels carry 1.5px tracking that makes them feel "machined" rather than "typed." Display headlines stay at 0 letter-spacing — BMW Type''s natural cap-height handles spacing on large sizes.

UPPERCASE display is the default voice for h1/h2 — sentence case appears on body and intro paragraphs but rarely on headlines. The all-caps treatment is a brand-voice signal, not a stylistic choice.

### Note on Font Substitutes
If BMW Type Next Latin is unavailable, **Inter** (variable) at 700/300 is the closest open-source substitute. Adjust display headline tracking to -0.5px to match BMW Type''s tighter spacing at large sizes. **Saira Condensed** is an alternative for headlines if a slightly more compressed feel is desired.', '{"sourcePath":"docs/design-md/bmw-m/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 40px · `{spacing.xxl}` 64px · `{spacing.section}` 96px.
- **Section padding (vertical):** `{spacing.section}` (96px) between major editorial bands.
- **Hero photo bands:** `{spacing.xxl}` (64px) internal vertical padding around the hero h1 + sub-headline pair.
- **Card internal padding:** `{spacing.lg}` (24px) for content and model cards; `{spacing.xl}` (40px) for spec-cell tables.
- **Gutters:** `{spacing.lg}` (24px) between cards in 3-up grids; `{spacing.md}` (16px) inside footer columns.

### Grid & Container
- **Max content width:** ~1440px centered on marketing pages — wider than typical SaaS to give photography breathing room.
- **Editorial body:** Single 12-column grid; photo bands bleed full-bleed (no max-width).
- **Card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Footer:** 4-column link list at desktop, 2-up at tablet, 1-up at mobile.

### Whitespace Philosophy
BMW M trusts photography to do the visual work. Whitespace around photography is restrained — the cars fill the frame, and copy sits below or beside them in tightly-aligned columns. Where whitespace appears (between body sections, around CTAs), it''s always uniform `{spacing.section}` (96px). The system never adds atmospheric backdrops, gradients, or decoration — empty space stays as empty black canvas.', '{"sourcePath":"docs/design-md/bmw-m/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, footer, photo bands |
| Soft hairline | 1px `{colors.hairline}` border | Section dividers, card outlines, table rows |
| Card surface | `{colors.surface-card}` background over canvas — no shadow | Feature photo cards, magazine cards, chatbot launcher |
| Photographic depth | Full-bleed photography with edge-to-edge crop | Hero bands, motorsport features — depth via subject matter, not chrome |

The system uses no drop shadows and no layered chrome. Depth comes entirely from photography (subject + lens + lighting) and the contrast between black canvas and slightly-elevated `{colors.surface-card}`.

### Decorative Depth
- **M Stripe Divider** (`{component.m-stripe-divider}`): A 4px-tall horizontal divider carrying the M tricolor (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`). Used on motorsport chrome, model-detail headers, and brand-identity moments. The stripe is the system''s only true "decorative" element — used sparingly to mark significance.
- **Carbon-fiber surfaces**: The technical-spec page uses `{colors.carbon-gray}` (#2b2b2b) cells with subtle texture overlay. This is a single-page treatment, not a system-wide pattern.
- **Photographic depth**: Full-bleed cars are the depth. Lighting in the photography (track lights, sunset rim-light) does the elevation work that drop shadows would do in a SaaS system.', '{"sourcePath":"docs/design-md/bmw-m/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | All buttons, cards, photo containers, spec cells, inputs — the dominant radius |
| `{rounded.xs}` | 2px | Almost no use — reserved for legal CTAs |
| `{rounded.sm}` | 4px | Small toggle pills on configurator surfaces |
| `{rounded.md}` | 6px | Rare — small dropdown menu items |
| `{rounded.full}` | 9999px / 50% | Circular icon buttons, carousel arrows, chatbot launcher |

The radius hierarchy is "almost always 0, sometimes circular." This binary radius decision is a deliberate brand-language choice — sharp rectangles read as engineered precision; circles read as functional controls. Nothing in between.

### Photography Geometry
Hero photography fills full-width with no rounding. Photo cards inside grids retain `{rounded.none}` corners, edge-to-edge images. Carbon-wheel detail shots and motorsport-pit photos use 16:9 or 21:9 cinema-aspect ratios. Driver portraits in racing-team grids use 4:5 portrait crops, also with sharp corners.', '{"sourcePath":"docs/design-md/bmw-m/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav`** — Black nav bar pinned to the top of every page. 64px tall, `{colors.canvas}` background. Carries the BMW M logo at left (M tricolor + BMW roundel + "M" wordmark), primary horizontal menu (Models, Topics, Magazine, Configurator, Fastlane), right-side cluster with language selector, search icon, account icon. Menu items render in `{typography.nav-link}` with sentence-case labels.

### Buttons

**`button-primary`** — The signature primary CTA. Background `{colors.canvas}` (or transparent over photography), text `{colors.on-dark}` (white), 1px white border outline, rounded `{rounded.none}` (0px), padding 16px × 32px, height 48px. Type `{typography.button}` — uppercase 14px / 700 / 1.5px tracking. The rectangular silhouette and uppercase letterspaced label IS the brand button.

**`button-primary-outline`** — Same shape as primary but with transparent background and white outline only. Used over photography where a filled button would clash with the image.

**`button-on-light`** — Used on rare light-surface contexts (configurator, account dialogs). Background `{colors.canvas}`, text `{colors.on-dark}` — black button with white text, inverted from the dark-canvas default.

**`button-icon`** — Circular icon buttons (carousel controls, share, favorite). 48 × 48px, background `{colors.surface-card}`, white icon centered, rounded `{rounded.full}`. The only non-rectangular button shape in the system.

**`carousel-arrow`** — Specific 48 × 48 circular arrow used in photo carousels. Same shape as `{component.button-icon}` with chevron glyph.

**`text-link`** — Inline uppercase letterspaced links ("VIEW ALL MODELS", "READ MORE"). `{typography.label-uppercase}`, white on dark, no underline. The chevron arrow → glyph appears next to most link labels.

### Cards & Containers

**`hero-photo-band`** — Full-width black band with full-bleed automotive photography filling most of the frame. The h1 uses `{typography.display-xl}` (80px / 700) and sits left-aligned over the photo, often with a small subtitle in `{typography.body-md}` below. Vertical padding `{spacing.xxl}` (64px). No card frame — the photo IS the band.

**`feature-photo-card`** — Used in 3-up grids for "MORE FROM BMW M MAGAZINE" and similar editorial sections. Background `{colors.surface-card}`, rounded `{rounded.none}`, internal padding `{spacing.lg}` (24px). Top half of the card is a 16:9 photo (full-bleed within the card); below the photo, a category tag in `{typography.label-uppercase}`, a `{typography.title-lg}` title, and a short body description.

**`model-card`** — Used in the "MORE NEW M MODELS" 3-up grid. Background `{colors.canvas}` (no card surface — just photo on black), rounded `{rounded.none}`. Top: 16:10 hero shot of the model. Below: model name in `{typography.display-md}` (40px / 700), short specs line in `{typography.body-sm}`, a `{component.text-link}` ("EXPLORE THIS MODEL").

**`magazine-article-card`** — A more text-forward card variant used on the magazine overview page. Background `{colors.canvas}` with hairline border, rounded `{rounded.none}`. Carries a small thumbnail at top, a category label in `{typography.label-uppercase}`, headline in `{typography.title-lg}`, and a body excerpt.

**`spec-cell`** — Technical specification cells used on model-detail pages (engine specs, weight, top speed, 0-100 time). Background `{colors.surface-soft}` (#0d0d0d), rounded `{rounded.none}`, padding `{spacing.lg}` (24px). Each cell holds a value in `{typography.display-sm}` (32px / 700) at top and a label in `{typography.label-uppercase}` below.

**`motorsport-photo-card`** — Edge-to-edge photo cards used in the racing-team / motorsport sections. No card surface — just a full-bleed photograph with a small overlay caption in white text at the bottom-left. The photography IS the brand here.

**`chatbot-launcher`** — A right-side card-style entry point ("BMW M CHATBOT") on the homepage. Background `{colors.surface-card}`, rounded `{rounded.none}`, padding `{spacing.lg}` (24px). Carries an h3 title, a short prompt, and a `{component.button-primary}` to launch.

**`category-tab`** + **`category-tab-active`** — The category selector tabs used on the magazine and topics pages (e.g., "ALL · MAGAZINE · MODELS · LIFESTYLE · MOTORSPORT"). Tabs render as text-only labels in `{typography.label-uppercase}`. Active state changes text color from `{colors.body}` to `{colors.on-dark}` and adds a 2px white underline below the label. No background fill, no rounded corners.

### Inputs & Forms

**`text-input`** — Standard text input on dark surfaces. Background `{colors.surface-card}`, text `{colors.on-dark}`, type `{typography.body-md}`, rounded `{rounded.none}` (0px), padding 12px × 16px, height 48px. 1px hairline border. Focus state thickens the border to white.

**`cookie-consent-card`** — A right-side cookie-banner card visible on the homepage. Background `{colors.canvas}` with 1px hairline, rounded `{rounded.none}`, padding `{spacing.lg}` (24px). Body text in `{typography.body-sm}` (14px / 300) — Light weight even for legal text. Two buttons stacked at bottom: primary outline + text-link.

### Signature Components

**`m-stripe-divider`** — The 4px horizontal stripe carrying the M tricolor (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`). Used as a divider on motorsport chrome, between brand-identity sections, and as a hover-state indicator on category tabs. The most distinctive non-typographic element in the system.

**`cta-band-photo`** — A pre-footer "Drive an M" CTA band carrying full-bleed photography of a car cornering on a track, with a centered headline in `{typography.display-md}` and a `{component.button-primary-outline}` below. Vertical padding 80px. The CTA inherits the editorial gravity of the rest of the page through full-bleed photography rather than chrome.

### Footer

**`footer`** — Black footer that closes every page. Background `{colors.canvas}`, text `{colors.body}`. 4-column link list at desktop covering BMW M Models / BMW M Lifestyle / Owners / Company. Vertical padding 64px. Bottom row carries the BMW corporate disclaimer in `{typography.caption}` and language selector. The footer never inverts — it stays black even when the body might transition.', '{"sourcePath":"docs/design-md/bmw-m/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Anchor every page with full-bleed automotive photography. The cars are the brand voltage; chrome backs off.
- Use UPPERCASE display headlines in `{typography.display-xl}` or `{typography.display-lg}`. Sentence-case display reads as off-brand.
- Pair heavy display (700) with light body (300). The weight contrast is the editorial signature.
- Reserve the M tricolor stripe for brand-identity moments — wordmark accents, motorsport chrome, model badges. Never as a button fill or surface.
- Use `{rounded.none}` (0px) by default. Reserve `{rounded.full}` for circular icon buttons only.
- Letter-space all-caps labels at 1.5px. The "machined" feel is non-negotiable.
- Use `{spacing.section}` (96px) between major editorial bands for grid-aligned vertical rhythm.

### Don''t
- Don''t introduce a brand color outside the M tricolor (`{colors.m-blue-light}` / `{colors.m-blue-dark}` / `{colors.m-red}`) and the heritage `{colors.bmw-blue}`.
- Don''t bold body type. Body stays at 300 (Light) — bumping to 400 or 500 makes the page feel marketing-bombastic instead of European-engineered.
- Don''t use rounded buttons. The rectangular silhouette IS the brand. Rounded corners read as consumer-tech, not motorsport.
- Don''t put gradient backdrops behind hero type. The hero IS the photography — the page floor stays pure black, and the photo provides the depth.
- Don''t repeat the same surface mode in two consecutive bands. Rhythm: photo band → spec table → photo band → magazine grid → photo band. Two text-only bands in a row read as a corporate site.
- Don''t use the M stripe as a button fill. The stripe is a divider / accent — never an action surface.
- Don''t bold uppercase tracking under 1.5px on button labels — the spacing is what makes them feel "machined."', '{"sourcePath":"docs/design-md/bmw-m/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 scales 80→48px; demo grid 1-up; photo cards stack full-width; footer 4 cols → 1 |
| Tablet | 768–1024px | Top nav stays horizontal but tightens; 2-up card grids; spec tables 2-up |
| Desktop | 1024–1440px | Full top-nav; 3-up card grids; spec tables 4-up |
| Wide | > 1440px | Same as desktop with more breathing room; max content 1440px |

### Touch Targets
- `{component.button-primary}` renders at 48 × 48px minimum — meets WCAG AAA.
- `{component.button-icon}` and `{component.carousel-arrow}` are exactly 48 × 48 — comfortably above the 44 × 44 minimum.
- `{component.text-input}` height is 48px.
- Category tabs render as text-only labels with 12px vertical padding; effective tap area meets 44px with surrounding spacing.

### Collapsing Strategy
- Top nav collapses to a hamburger sheet at < 768px; the menu opens as a full-screen black overlay with the M tricolor stripe at the top.
- Photography stays full-bleed at every breakpoint — never collapses to a margin''d container.
- Card grids reduce columns rather than scaling cards down; photography retains its native aspect ratio.
- Spec tables collapse from 4-up to 2-up to 1-up; spec values stay at `{typography.display-sm}` regardless of column count.
- The M-stripe divider stays at 4px height across all breakpoints.

### Image Behavior
- Hero photography crops responsively — wider crops at desktop, vertical crops on mobile.
- Lifestyle and motorsport photos retain native aspect ratios; the system never letterboxes or pillarboxes.
- The M wordmark + tricolor logo scales proportionally with viewport width.', '{"sourcePath":"docs/design-md/bmw-m/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.hero-photo-band}`, `{component.spec-cell}`).
2. New components default to `{rounded.none}` (0px). Only use `{rounded.full}` if it''s a circular icon button.
3. Variants (`-active`, `-disabled`) live as separate entries in `components:`.
4. Use `{token.refs}` everywhere — never inline hex.
5. Never document hover states. Default and Active/Pressed only.
6. Display headlines stay UPPERCASE 700; body stays sentence-case 300. Never blur the contrast.
7. The M tricolor is brand-identity-only — never extend it to system tokens for "primary action."
8. When in doubt about emphasis: bigger photography before bigger type.', '{"sourcePath":"docs/design-md/bmw-m/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- The dembrandt frequency analyzer captured the white text (count 955) as the highest-frequency token. The black canvas was inferred from screenshot — dembrandt''s body-background sampling didn''t surface it as a top palette entry, but the page is unambiguously black-on-white-text.
- The exact M tricolor stops are documented from public BMW brand guidelines; the screenshots show the stripe as a small element but pixel-sampling at this resolution doesn''t reliably distinguish #0066b1 from #1c69d4. Treat the documented stops as canonical based on BMW Design Works'' published brand spec.
- BMW Type Next Latin weight axis values beyond Light (300) and regular (700) are not documented — only the static weights observed in screenshots.
- Animation and transition timings (photo carousel transitions, hover-reveal effects, configurator interactions) are not in scope.
- Form validation states beyond `{component.text-input}` defaults are not extracted — error / success input variants would need a configurator or order flow to confirm.
- The configurator surface (vehicle build pages with color / wheel / interior pickers) was not in the analyzed URL set; its swatch grid, comparison panels, and price-summary card are not documented here.
- The cookie consent overlay obscured part of the homepage hero in the captured screenshot; secondary hero treatments (different car models cycling through the hero band) may carry variations not captured.', '{"sourcePath":"docs/design-md/bmw-m/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_1', '#ffffff', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_2', '#bbbbbb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_3', '#e6e6e6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_4', '#7e7e7e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_5', '#3c3c3c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_6', '#262626', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_7', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_8', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_9', '#0d0d0d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_10', '#0066b1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_11', '#1c69d4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_12', '#e22718', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_13', '#0653b6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_14', '#2b2b2b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_15', '#f4b400', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'color', 'color_16', '#0fa336', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'typography', 'font_1', 'BMWTypeNextLatin, sans-serif', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'typography', 'font_2', 'BMWTypeNextLatin Light, BMWTypeNextLatin, sans-serif', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md'), 'typography', 'font_3', 'BMWTypeNextLatin Light, sans-serif', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/bmw-m/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/bmw-m/DESIGN.md';


-- Bugatti
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Bugatti', 'bugatti', 'design-reference', null, now())
  on conflict (slug) do update
    set name = excluded.name,
        category = excluded.category,
        updated_at = now()
  returning id
),
d as (
  insert into design_documents (
    brand_id,
    source_type,
    original_filename,
    original_blob_url,
    status,
    raw_markdown,
    updated_at
  )
  select id, 'markdown_seed', 'docs/design-md/bugatti/DESIGN.md', null, 'seeded', '---
version: alpha
name: Bugatti-design-analysis
description: An austere luxury-automotive interface that uses near-pure black canvas, white uppercase letterspaced display, and full-bleed automotive photography as the only voltage. The system runs three custom Bugatti typefaces — Bugatti Display, Bugatti Text Regular, and Bugatti Monospace — and combines them at modest weights with wide tracking to feel European-engineered, hyper-minimal, and quietly expensive. There is no accent color, no decorative element, no chrome — only photography, typography, and the brand wordmark.

colors:
  primary: "#ffffff"
  ink: "#ffffff"
  body: "#cccccc"
  body-strong: "#e6e6e6"
  muted: "#999999"
  muted-soft: "#666666"
  hairline: "#262626"
  hairline-strong: "#3a3a3a"
  canvas: "#000000"
  surface-soft: "#0d0d0d"
  surface-card: "#141414"
  surface-elevated: "#1f1f1f"
  on-primary: "#000000"
  on-dark: "#ffffff"
  on-photo: "#ffffff"
  link: "#c3d9f3"
  warning: "#d4a017"
  success: "#5fa657"

typography:
  display-xl:
    fontFamily: "Bugatti Display, sans-serif"
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: 4px
  display-lg:
    fontFamily: "Bugatti Display, sans-serif"
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: 3px
  display-md:
    fontFamily: "Bugatti Display, sans-serif"
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 2px
  display-sm:
    fontFamily: "Bugatti Display, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 1.5px
  wordmark:
    fontFamily: "Bugatti Display, serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 6px
  title-md:
    fontFamily: "Bugatti Display, sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 1px
  title-sm:
    fontFamily: "Bugatti Display, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 1.5px
  caption-uppercase:
    fontFamily: "Bugatti Monospace, ui-monospace, monospace"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 2px
  body-md:
    fontFamily: "Bugatti Text Regular, serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "Bugatti Text Regular, serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button:
    fontFamily: "Bugatti Monospace, ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 2.5px
  nav-link:
    fontFamily: "Bugatti Monospace, ui-monospace, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 2px

rounded:
  none: 0px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  section: 120px

components:
  button-primary:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 14px 32px
    height: 44px
  button-icon:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    size: 40px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.link}"
    typography: "{typography.button}"
  top-nav:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.nav-link}"
    height: 56px
  wordmark-display:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.wordmark}"
  hero-photo-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xl}"
    padding: 96px
  caption-overlay:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.caption-uppercase}"
  career-callout-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 16px
    width: 320px
  model-photo-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-md}"
    rounded: "{rounded.none}"
  newsroom-article-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.none}"
    padding: 24px
  career-listing-row:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    padding: 24px 0
  text-input:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 12px 0
    height: 44px
  spec-cell:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    padding: 24px 0
  date-pill:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.caption-uppercase}"
  category-tag:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.caption-uppercase}"
  cta-band-photo:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-md}"
    padding: 80px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
    padding: 64px
---

## Overview

Bugatti''s marketing surface is the most austere interface in luxury automotive: a near-pure black canvas (`{colors.canvas}` — #000000) holding white uppercase **letterspaced** display type and full-bleed automotive photography. The system has no accent color, no surface card decoration, no shadows, no gradients, no chrome — only **photography, typography, and the brand wordmark**. Every other luxury auto site in this category (BMW M, Aston Martin, Lamborghini) uses some form of accent color or signature element; Bugatti uses nothing. The empty space, the photograph, and the precisely-tracked Bugatti Display headline ARE the brand.

The system runs **three custom Bugatti typefaces**: **Bugatti Display** (display headlines, the "BUGATTI" wordmark, all caps with wide tracking), **Bugatti Text Regular** (body paragraphs, a serif text face), and **Bugatti Monospace** (button labels, navigation, captions, dates — anywhere precision and machined feel matters). The split is deliberate and unbreakable: never use Bugatti Text in a button, never use Bugatti Monospace in a paragraph.

Display sizes use weight 400 (regular) — never bold. Visual emphasis comes from **size and tracking**, not weight. Letter-spacing on the wordmark is 6px; on display headlines 2-4px; on uppercase labels 2-2.5px. Tight tracking is a brand violation. The wide spacing creates the "engineered precision" feel that no other luxury maker matches.

**Key Characteristics:**
- Pure black canvas (`{colors.canvas}` — #000000) with white type. The system does not have a light mode.
- Three custom Bugatti typefaces: **Display** (uppercase headlines + wordmark), **Text Regular** (body serif), **Monospace** (buttons, captions, nav).
- All display headlines are UPPERCASE with wide letter-spacing (2-4px). Body copy stays sentence-case at standard tracking.
- No accent color. The only non-monochrome color anywhere on the site is `{colors.link}` (#c3d9f3) — a desaturated ice-blue used on inline anchor links, and even that appears rarely.
- Buttons are pill-shaped (`{rounded.pill}`) with **transparent background** and a 1px white outline. Bugatti is the only luxury-auto brand whose primary CTA is fully transparent.
- Photography is the only depth element. No drop shadows. No gradients. No card surfaces. Surface cards are `{colors.surface-card}` (#141414) at most — a barely-different-from-black tone.
- Section rhythm is generous — `{spacing.section}` (120px) between major bands, longer than most marketing sites because Bugatti''s pages are mostly photography with minimal text density.

## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #ffffff): The single brand color. White type and white CTA outlines on the black canvas.
- **Link** (`{colors.link}` — #c3d9f3): The only non-monochrome color in the system — a desaturated ice-blue used on inline anchor links and rarely on focus states. Bugatti''s brand discipline is so tight that this single token is essentially the entire chromatic vocabulary outside black-and-white.

### Surface
- **Canvas** (`{colors.canvas}` — #000000): The default page floor across every surface. Pure black.
- **Surface Soft** (`{colors.surface-soft}` — #0d0d0d): A barely-different-from-black tone used for spec table rows and dense data sections.
- **Surface Card** (`{colors.surface-card}` — #141414): Cards (career callout, newsroom article container, occasional content cards). Even card surfaces stay nearly-black — no contrast jump.
- **Surface Elevated** (`{colors.surface-elevated}` — #1f1f1f): One step further from black, used for nested cards on rare dense pages.
- **Hairline** (`{colors.hairline}` — #262626): The 1px divider tone. Visible but quiet. Used on table rows, between body sections, around card outlines.
- **Hairline Strong** (`{colors.hairline-strong}` — #3a3a3a): A heavier divider used on the underside of input fields (input fields have no border — only an underline hairline).

### Text
- **Ink / On Dark** (`{colors.on-dark}` — #ffffff): All headline and primary text on dark canvas.
- **Body** (`{colors.body}` — #cccccc): Default running-text color (slightly cooler than pure white). Used in body paragraphs.
- **Body Strong** (`{colors.body-strong}` — #e6e6e6): Emphasized body / lead paragraph.
- **Muted** (`{colors.muted}` — #999999): Footer links, dates, captions, secondary metadata. Dembrandt''s frequency analysis confirms this as palette-2 (count 6, medium confidence).
- **Muted Soft** (`{colors.muted-soft}` — #666666): A second-tier muted for very-secondary text (legal disclaimer, copyright line).

### Semantic
- **Warning** (`{colors.warning}` — #d4a017): Reserved for technical-warning callouts (specifications, recall notices). Almost never appears on marketing surfaces.
- **Success** (`{colors.success}` — #5fa657): Order confirmation states (rare on marketing pages).

## Typography

### Font Family
The system runs **three custom Bugatti typefaces** as a rigid trinity:
1. **Bugatti Display** — All display headlines (h1, h2, h3), the "BUGATTI" wordmark, model name plates. Uppercase, wide-tracked. The default for any visual emphasis.
2. **Bugatti Text Regular** — A serif text face used exclusively for running body copy, lead paragraphs, model descriptions. Standard sentence-case, no letter-spacing.
3. **Bugatti Monospace** — Button labels, navigation, captions, dates, monospace-precision contexts. Always uppercase with 2-2.5px tracking.

The split is functional and absolute. Bugatti Display in a button breaks the "machined precision" voice; Bugatti Monospace in a paragraph breaks the "engineered elegance" voice; Bugatti Text in a button is unthinkable.

The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for Bugatti Display, `Garamond, "Times New Roman", serif` for Bugatti Text Regular, and `ui-monospace, "SF Mono", "Cascadia Mono", monospace` for Bugatti Monospace.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 400 | 1.1 | 4px | Hero h1 ("THE BUGATTI F.K.P. HOMMAGE", "TOURBILLON") — Bugatti Display, uppercase, wide-tracked |
| `{typography.display-lg}` | 48px | 400 | 1.15 | 3px | Section heads — Bugatti Display, uppercase |
| `{typography.display-md}` | 32px | 400 | 1.2 | 2px | Sub-section heads, model names — Bugatti Display |
| `{typography.display-sm}` | 24px | 400 | 1.3 | 1.5px | Card titles — Bugatti Display |
| `{typography.wordmark}` | 14px | 400 | 1.0 | 6px | The "BUGATTI" brand wordmark in the top nav — Bugatti Display, the widest tracking in the system |
| `{typography.title-md}` | 20px | 400 | 1.3 | 1px | Career listing titles, intro paragraphs — Bugatti Display |
| `{typography.title-sm}` | 16px | 400 | 1.3 | 1.5px | Mid-tier headlines, callout cards |
| `{typography.caption-uppercase}` | 11px | 400 | 1.4 | 2px | Photo captions, metadata, "EXPLORE OUR OPPORTUNITIES" — Bugatti Monospace, uppercase |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body — Bugatti Text Regular (a serif face), sentence case, no tracking |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body, fine-print legal — Bugatti Text Regular |
| `{typography.button}` | 14px | 400 | 1.0 | 2.5px | All button labels — Bugatti Monospace, uppercase, 2.5px tracking |
| `{typography.nav-link}` | 12px | 400 | 1.4 | 2px | Top-nav menu items ("MENU", "STORE") — Bugatti Monospace |

### Principles
The system NEVER uses bold weight. Every Bugatti typeface is set at weight 400 (regular). Visual emphasis comes from:
1. **Size** — 64px hero vs 16px body is a 4× hierarchy
2. **Letter-spacing** — 6px wordmark vs 0px body
3. **Case** — Uppercase display vs sentence-case body
4. **Family contrast** — Display vs Text Regular vs Monospace

Going to weight 700 anywhere would break the "modest engineering" feel and make Bugatti read like a generic luxury template.

The serif Bugatti Text Regular sets the brand apart from the all-sans luxury crowd (BMW, Aston Martin, Lamborghini all use sans-serif body type). Bugatti''s serif body voice signals literary, considered, slow-reading prose — which is the brand''s editorial philosophy.

### Note on Font Substitutes
If Bugatti Display, Bugatti Text Regular, and Bugatti Monospace are unavailable, the closest open-source substitutes are:
- **Bugatti Display** → **Saira Condensed** (variable, weight 400) at +0.05em letter-spacing
- **Bugatti Text Regular** → **Cormorant Garamond** (regular) or **EB Garamond**
- **Bugatti Monospace** → **JetBrains Mono** or **IBM Plex Mono** (regular weight)

The substitution preserves the three-family split, which is more important than exact typeface match.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 40px · `{spacing.xxl}` 64px · `{spacing.section}` 120px.
- **Section padding:** `{spacing.section}` (120px) — longer than most marketing sites because Bugatti''s bands are mostly photography with minimal text. The empty space frames the cars.
- **Card internal padding:** `{spacing.lg}` (24px) for newsroom and content cards; `{spacing.md}` (16px) for the career callout card; `{spacing.xxl}` (64px) inside hero photo bands.
- **Gutters:** `{spacing.xl}` (40px) between cards in 2-up grids — wider than typical because Bugatti''s grids are sparse.

### Grid & Container
- **Max content width:** ~1280px centered. Hero photo bands bleed full-width with no max.
- **Editorial body:** Single 12-column grid; photo bands are full-bleed.
- **Newsroom layout:** 2-up article grid at desktop, 1-up at tablet+mobile.
- **Career listings:** Single column with 80px row spacing.

### Whitespace Philosophy
Bugatti uses whitespace more aggressively than any luxury-auto competitor. The homepage hero is mostly photography + huge whitespace + a single sentence + a single button. The empty black space below the photograph is intentional — it lets the car breathe. Compressing the whitespace to "fit more content" breaks the brand''s fundamental contract: that less is more.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body, top nav, footer, photo bands |
| Soft hairline | 1px `{colors.hairline}` border | Section dividers, table rows |
| Card surface | `{colors.surface-card}` background — no shadow | Career callout, newsroom article container |
| Photographic depth | Full-bleed photography with edge-to-edge crop | Hero bands, model showcases — depth via subject + lens, not chrome |

The system uses no shadows, no glassmorphism, no gradients. Depth comes entirely from photography (lighting, lens, subject framing) and from the contrast between black canvas and minimally-elevated `{colors.surface-card}`.

### Decorative Depth
- None. Bugatti is the only luxury-auto brand without a single decorative element. There is no stripe, no badge, no heritage emblem on the marketing site outside the wordmark itself.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | All cards, photo containers, inputs, spec cells — the dominant radius |
| `{rounded.pill}` | 9999px | All buttons (the only rounded element in the system) |
| `{rounded.full}` | 9999px / 50% | Circular icon buttons, avatar surfaces |

The radius hierarchy is binary: rectangular for everything except buttons, which are pills. No 4px, no 8px, no 12px in between — those would feel "designed" rather than "engineered."

### Photography Geometry
Hero photography fills full-width with no rounding. Photo cards inside grids retain `{rounded.none}` (0px) corners, edge-to-edge images. Model detail shots use 16:9 or wider cinema-aspect ratios. Newsroom thumbnails use 16:9 with 0px corners. There are no avatars or rounded photo crops anywhere on the marketing site.

## Components

### Top Navigation

**`top-nav`** — A 56px-tall transparent nav bar overlaid on the hero photo at the top of every page. No fill, no border. Carries "MENU" at left, the centered **wordmark-display** ("BUGATTI" in 14px Bugatti Display with 6px tracking), and "STORE" at right with a small bag icon. All labels in `{typography.nav-link}` (Bugatti Monospace, 12px, 2px tracking, uppercase).

**`wordmark-display`** — The "BUGATTI" wordmark itself. Bugatti Display at 14px, weight 400, 6px letter-spacing. The widest tracking in the system. Centered in the nav bar at every breakpoint.

### Buttons

**`button-primary`** — The signature primary CTA. Background **transparent**, text `{colors.on-dark}` (white), 1px white outline, rounded `{rounded.pill}` (9999px), padding 14px × 32px, height 44px. Type `{typography.button}` — Bugatti Monospace, uppercase, 14px, 2.5px tracking. The transparent fill is unique to Bugatti — every other luxury-auto brand uses a filled or outlined-with-text-shift button. Bugatti''s transparent pill IS the button.

**`button-icon`** — Circular icon buttons (carousel arrows, share, language switcher). 40 × 40px, transparent background, white outline 1px, rounded `{rounded.full}`. Same outline-only treatment as the primary button.

**`text-link`** — Inline body links in `{colors.link}` (#c3d9f3, the only non-monochrome color in the system). Underlined by default. Type inherits `{typography.body-md}` (Bugatti Text Regular, serif).

### Cards & Containers

**`hero-photo-band`** — Full-width black band with full-bleed automotive photography. The h1 in `{typography.display-xl}` sits center-aligned over the photo near the top, often paired with a small Bugatti Monospace caption (`{typography.caption-uppercase}`) below the headline and a single `{component.button-primary}` further down. Vertical padding 96px-200px depending on photo height.

**`career-callout-card`** — A small right-aligned card that floats over the hero photo on the homepage with a recruiting prompt ("Are you ready for a new adventure?"). Background `{colors.surface-card}`, rounded `{rounded.none}` (0px), padding `{spacing.md}` (16px), width 320px. Carries a small thumbnail at top, body line, and a `{typography.caption-uppercase}` link ("EXPLORE OUR OPPORTUNITIES").

**`model-photo-card`** — Used in model showcases (Tourbillon page, model lineup grid). Background `{colors.canvas}` (no card surface — just photo on black), rounded `{rounded.none}`. Top: 16:9 or 21:9 hero shot of the model. Below: model name in `{typography.display-md}` (32px Bugatti Display, 2px tracking), short specs line in `{typography.caption-uppercase}` (11px Bugatti Monospace), a `{component.text-link}` ("DISCOVER").

**`newsroom-article-card`** — Used on the newsroom page (newsroom.bugatti.com). Background `{colors.canvas}` with hairline border, rounded `{rounded.none}`, padding `{spacing.lg}` (24px). Carries a 16:9 thumbnail, a `{component.date-pill}` ("12. NOVEMBER 2025"), a `{typography.title-md}` headline, and a body excerpt in `{typography.body-md}` (Bugatti Text Regular serif).

**`career-listing-row`** — Each row of the careers page job listing. Transparent background, padding 24px vertical, hairline divider between rows. Job title in `{typography.title-md}` (Bugatti Display 20px) at left; location + department in `{typography.caption-uppercase}` at right; chevron arrow (→) at far right.

**`spec-cell`** — Vehicle technical-spec display on model-detail pages (Tourbillon engine specs). Transparent background with hairline dividers between cells (not between cells inside a card). Each spec shows a value in `{typography.title-md}` at top and a label in `{typography.caption-uppercase}` below. Padding 24px vertical.

### Inputs & Forms

**`text-input`** — Standard text input on dark canvas. Background **transparent**, text `{colors.on-dark}`, 1px hairline-strong bottom border only (no top, left, right border), padding 12px × 0px, height 44px. Type `{typography.body-md}` (Bugatti Text Regular). Placeholder in `{colors.muted}`. Focus thickens the bottom border to white.

### Tags & Captions

**`caption-overlay`** — Photo-overlay caption (e.g., "HONORING THE OEYRON AND ITS VISIONARY CREATOR"). Centered or left-aligned over photography in `{typography.caption-uppercase}` (Bugatti Monospace, 11px, 2px tracking, white).

**`category-tag`** + **`date-pill`** — Both render as transparent inline labels in `{typography.caption-uppercase}`, color `{colors.muted}`. No background fill, no border. The "tag" is the type itself.

### CTA / Footer

**`cta-band-photo`** — A pre-footer "Discover Bugatti" band with full-bleed photography of a Bugatti car at speed and a centered headline in `{typography.display-md}` + a `{component.button-primary}` below. Vertical padding 80px. Inherits the editorial gravity of the hero through full-bleed photography.

**`footer`** — Black footer that closes every page. Background `{colors.canvas}`, text `{colors.muted}`. 4-column link list at desktop covering Bugatti / Models / Heritage / Connect. Vertical padding 64px. Bottom row carries the copyright line in `{typography.body-sm}` (Bugatti Text Regular). The wordmark sits center-aligned at the very bottom. The footer never inverts.

## Do''s and Don''ts

### Do
- Anchor every page with full-bleed automotive photography. The cars are the brand voltage; chrome backs off entirely.
- Keep all display headlines in UPPERCASE Bugatti Display with 2-4px letter-spacing. The wordmark gets 6px.
- Use Bugatti Display for headlines, Bugatti Text Regular (serif!) for body, Bugatti Monospace for buttons + captions + nav. The trinity is unbreakable.
- Keep `{component.button-primary}` transparent with a 1px white outline. The transparent pill IS the brand button.
- Use weight 400 everywhere. Bold breaks the brand voice — the system has no bold weight role.
- Use `{spacing.section}` (120px) between major editorial bands. The whitespace is part of the brand.
- Reserve `{colors.link}` (#c3d9f3) for inline anchor links only. It''s the system''s only non-monochrome color.

### Don''t
- Don''t introduce any accent color outside `{colors.link}`. Bugatti''s brand discipline is total monochrome + photography. Adding a brand-blue or brand-red breaks the contract.
- Don''t bold any type. The system has no bold weight — every typeface stays at 400.
- Don''t fill primary buttons. Transparent + outline only. A solid white button reads as off-brand.
- Don''t compress whitespace between sections. The 120px rhythm is part of the editorial pacing.
- Don''t use rounded corners outside buttons. Cards, photos, inputs all stay at 0px. Rounded cards read as consumer-tech, not luxury-engineered.
- Don''t tighten letter-spacing on display headlines. 2-4px tracking on Bugatti Display is non-negotiable.
- Don''t use Bugatti Display in a button (use Bugatti Monospace) or Bugatti Monospace in a paragraph (use Bugatti Text Regular). The trinity split is the brand voice.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 64→32px; career callout card hides; photo bands stay full-bleed; footer 4 cols → 1 |
| Tablet | 768–1024px | Top nav stays minimal (MENU + wordmark + STORE); 2-up newsroom grid; career rows full-width |
| Desktop | 1024–1440px | Full minimal top-nav; 2-up newsroom grid; spec tables 4-up |
| Wide | > 1440px | Same as desktop with more breathing room; max content 1280px |

### Touch Targets
- `{component.button-primary}` renders at minimum 44 × 44px (matches WCAG AAA).
- `{component.button-icon}` is exactly 40 × 40px.
- `{component.text-input}` height is 44px.
- Career listing rows have 24px vertical padding; effective tap area meets 44px+ with surrounding spacing.

### Collapsing Strategy
- Top nav stays minimal at all breakpoints (MENU label + wordmark + STORE label). On mobile the labels hide behind a hamburger but the wordmark stays centered.
- Hero photography stays full-bleed at every breakpoint. Photo crops adjust — wider crops at desktop, vertical crops on mobile.
- The career callout card on the homepage hides at < 768px (it''s a desktop-only floating element).
- 2-up newsroom grid collapses to 1-up at < 768px.
- Spec cells reflow from 4-up to 2-up to 1-up; values stay at the same display size regardless of column count.

### Image Behavior
- Hero photography crops responsively — wider crops at desktop, vertical crops on mobile. Bugatti cars are always shown in motion or at-angle (never flat profiles).
- Newsroom thumbnails retain 16:9 ratio and 0px corners.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.hero-photo-band}`, `{component.career-callout-card}`).
2. New components default to `{rounded.none}` (0px). Only `{component.button-primary}` and `{component.button-icon}` use pill / full radius.
3. Variants live as separate entries in `components:`.
4. Use `{token.refs}` everywhere — never inline hex.
5. Never document hover. Default and Active/Pressed states only.
6. Display headlines stay UPPERCASE Bugatti Display 400 with 2-4px tracking. Body stays sentence-case Bugatti Text Regular (serif). Button labels stay Bugatti Monospace 2.5px tracking. The trinity does not blur.
7. When in doubt about emphasis: bigger photography before bigger type.

## Known Gaps

- The dembrandt frequency analyzer captured only 3 colors at root level (`#000000`, `#999999`, `#c3d9f3`). The white text (#ffffff) and dark surface tones (`#0d0d0d`, `#141414`, `#1f1f1f`) were inferred from screenshot — Bugatti''s pages are so monochrome that the frequency-based analyzer didn''t surface body text or surface tones as distinct palette entries.
- The three Bugatti typefaces (Display, Text Regular, Monospace) are licensed to Bugatti and not available as web fonts publicly. Substitutes are documented in the typography section.
- Animation and transition timings (photo carousel transitions, hover-reveal of menu, configurator animations) are not in scope.
- Form validation states beyond the underline-only `{component.text-input}` are not extracted — error / success states are inferred from general standards, not from the analyzed surfaces.
- The configurator surface (vehicle build pages with custom paint / interior pickers) was not in the analyzed URL set; its swatch grid, customization controls, and price-summary card are not documented here.
- The German-language newsroom (newsroom.bugatti.com/de) shares the system with the English Bugatti.com surfaces — no design-system-level differences observed, only language localization.
- The actual Tourbillon page rendered as a sparse minimal page in the captured screenshot, suggesting either lazy-loaded content or an interactive configurator-style UI that doesn''t render fully in static screenshots; engine-spec layout is documented from general luxury-auto patterns informed by the captured spec cell tokens.
', now()
  from b
  on conflict (brand_id, original_filename) do update
    set status = 'seeded',
        raw_markdown = excluded.raw_markdown,
        updated_at = now()
  returning id
),
deleted_sections as (
  delete from design_sections where document_id = (select id from d)
),
deleted_tokens as (
  delete from design_tokens where document_id = (select id from d)
)
insert into design_sections (document_id, category, original_title, normalized_title, content_markdown, content_json, confidence, sort_order)
values
((select id from d), 'overview', 'Overview', 'overview', '## Overview

Bugatti''s marketing surface is the most austere interface in luxury automotive: a near-pure black canvas (`{colors.canvas}` — #000000) holding white uppercase **letterspaced** display type and full-bleed automotive photography. The system has no accent color, no surface card decoration, no shadows, no gradients, no chrome — only **photography, typography, and the brand wordmark**. Every other luxury auto site in this category (BMW M, Aston Martin, Lamborghini) uses some form of accent color or signature element; Bugatti uses nothing. The empty space, the photograph, and the precisely-tracked Bugatti Display headline ARE the brand.

The system runs **three custom Bugatti typefaces**: **Bugatti Display** (display headlines, the "BUGATTI" wordmark, all caps with wide tracking), **Bugatti Text Regular** (body paragraphs, a serif text face), and **Bugatti Monospace** (button labels, navigation, captions, dates — anywhere precision and machined feel matters). The split is deliberate and unbreakable: never use Bugatti Text in a button, never use Bugatti Monospace in a paragraph.

Display sizes use weight 400 (regular) — never bold. Visual emphasis comes from **size and tracking**, not weight. Letter-spacing on the wordmark is 6px; on display headlines 2-4px; on uppercase labels 2-2.5px. Tight tracking is a brand violation. The wide spacing creates the "engineered precision" feel that no other luxury maker matches.

**Key Characteristics:**
- Pure black canvas (`{colors.canvas}` — #000000) with white type. The system does not have a light mode.
- Three custom Bugatti typefaces: **Display** (uppercase headlines + wordmark), **Text Regular** (body serif), **Monospace** (buttons, captions, nav).
- All display headlines are UPPERCASE with wide letter-spacing (2-4px). Body copy stays sentence-case at standard tracking.
- No accent color. The only non-monochrome color anywhere on the site is `{colors.link}` (#c3d9f3) — a desaturated ice-blue used on inline anchor links, and even that appears rarely.
- Buttons are pill-shaped (`{rounded.pill}`) with **transparent background** and a 1px white outline. Bugatti is the only luxury-auto brand whose primary CTA is fully transparent.
- Photography is the only depth element. No drop shadows. No gradients. No card surfaces. Surface cards are `{colors.surface-card}` (#141414) at most — a barely-different-from-black tone.
- Section rhythm is generous — `{spacing.section}` (120px) between major bands, longer than most marketing sites because Bugatti''s pages are mostly photography with minimal text density.', '{"sourcePath":"docs/design-md/bugatti/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #ffffff): The single brand color. White type and white CTA outlines on the black canvas.
- **Link** (`{colors.link}` — #c3d9f3): The only non-monochrome color in the system — a desaturated ice-blue used on inline anchor links and rarely on focus states. Bugatti''s brand discipline is so tight that this single token is essentially the entire chromatic vocabulary outside black-and-white.

### Surface
- **Canvas** (`{colors.canvas}` — #000000): The default page floor across every surface. Pure black.
- **Surface Soft** (`{colors.surface-soft}` — #0d0d0d): A barely-different-from-black tone used for spec table rows and dense data sections.
- **Surface Card** (`{colors.surface-card}` — #141414): Cards (career callout, newsroom article container, occasional content cards). Even card surfaces stay nearly-black — no contrast jump.
- **Surface Elevated** (`{colors.surface-elevated}` — #1f1f1f): One step further from black, used for nested cards on rare dense pages.
- **Hairline** (`{colors.hairline}` — #262626): The 1px divider tone. Visible but quiet. Used on table rows, between body sections, around card outlines.
- **Hairline Strong** (`{colors.hairline-strong}` — #3a3a3a): A heavier divider used on the underside of input fields (input fields have no border — only an underline hairline).

### Text
- **Ink / On Dark** (`{colors.on-dark}` — #ffffff): All headline and primary text on dark canvas.
- **Body** (`{colors.body}` — #cccccc): Default running-text color (slightly cooler than pure white). Used in body paragraphs.
- **Body Strong** (`{colors.body-strong}` — #e6e6e6): Emphasized body / lead paragraph.
- **Muted** (`{colors.muted}` — #999999): Footer links, dates, captions, secondary metadata. Dembrandt''s frequency analysis confirms this as palette-2 (count 6, medium confidence).
- **Muted Soft** (`{colors.muted-soft}` — #666666): A second-tier muted for very-secondary text (legal disclaimer, copyright line).

### Semantic
- **Warning** (`{colors.warning}` — #d4a017): Reserved for technical-warning callouts (specifications, recall notices). Almost never appears on marketing surfaces.
- **Success** (`{colors.success}` — #5fa657): Order confirmation states (rare on marketing pages).', '{"sourcePath":"docs/design-md/bugatti/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The system runs **three custom Bugatti typefaces** as a rigid trinity:
1. **Bugatti Display** — All display headlines (h1, h2, h3), the "BUGATTI" wordmark, model name plates. Uppercase, wide-tracked. The default for any visual emphasis.
2. **Bugatti Text Regular** — A serif text face used exclusively for running body copy, lead paragraphs, model descriptions. Standard sentence-case, no letter-spacing.
3. **Bugatti Monospace** — Button labels, navigation, captions, dates, monospace-precision contexts. Always uppercase with 2-2.5px tracking.

The split is functional and absolute. Bugatti Display in a button breaks the "machined precision" voice; Bugatti Monospace in a paragraph breaks the "engineered elegance" voice; Bugatti Text in a button is unthinkable.

The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for Bugatti Display, `Garamond, "Times New Roman", serif` for Bugatti Text Regular, and `ui-monospace, "SF Mono", "Cascadia Mono", monospace` for Bugatti Monospace.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 400 | 1.1 | 4px | Hero h1 ("THE BUGATTI F.K.P. HOMMAGE", "TOURBILLON") — Bugatti Display, uppercase, wide-tracked |
| `{typography.display-lg}` | 48px | 400 | 1.15 | 3px | Section heads — Bugatti Display, uppercase |
| `{typography.display-md}` | 32px | 400 | 1.2 | 2px | Sub-section heads, model names — Bugatti Display |
| `{typography.display-sm}` | 24px | 400 | 1.3 | 1.5px | Card titles — Bugatti Display |
| `{typography.wordmark}` | 14px | 400 | 1.0 | 6px | The "BUGATTI" brand wordmark in the top nav — Bugatti Display, the widest tracking in the system |
| `{typography.title-md}` | 20px | 400 | 1.3 | 1px | Career listing titles, intro paragraphs — Bugatti Display |
| `{typography.title-sm}` | 16px | 400 | 1.3 | 1.5px | Mid-tier headlines, callout cards |
| `{typography.caption-uppercase}` | 11px | 400 | 1.4 | 2px | Photo captions, metadata, "EXPLORE OUR OPPORTUNITIES" — Bugatti Monospace, uppercase |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body — Bugatti Text Regular (a serif face), sentence case, no tracking |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body, fine-print legal — Bugatti Text Regular |
| `{typography.button}` | 14px | 400 | 1.0 | 2.5px | All button labels — Bugatti Monospace, uppercase, 2.5px tracking |
| `{typography.nav-link}` | 12px | 400 | 1.4 | 2px | Top-nav menu items ("MENU", "STORE") — Bugatti Monospace |

### Principles
The system NEVER uses bold weight. Every Bugatti typeface is set at weight 400 (regular). Visual emphasis comes from:
1. **Size** — 64px hero vs 16px body is a 4× hierarchy
2. **Letter-spacing** — 6px wordmark vs 0px body
3. **Case** — Uppercase display vs sentence-case body
4. **Family contrast** — Display vs Text Regular vs Monospace

Going to weight 700 anywhere would break the "modest engineering" feel and make Bugatti read like a generic luxury template.

The serif Bugatti Text Regular sets the brand apart from the all-sans luxury crowd (BMW, Aston Martin, Lamborghini all use sans-serif body type). Bugatti''s serif body voice signals literary, considered, slow-reading prose — which is the brand''s editorial philosophy.

### Note on Font Substitutes
If Bugatti Display, Bugatti Text Regular, and Bugatti Monospace are unavailable, the closest open-source substitutes are:
- **Bugatti Display** → **Saira Condensed** (variable, weight 400) at +0.05em letter-spacing
- **Bugatti Text Regular** → **Cormorant Garamond** (regular) or **EB Garamond**
- **Bugatti Monospace** → **JetBrains Mono** or **IBM Plex Mono** (regular weight)

The substitution preserves the three-family split, which is more important than exact typeface match.', '{"sourcePath":"docs/design-md/bugatti/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 40px · `{spacing.xxl}` 64px · `{spacing.section}` 120px.
- **Section padding:** `{spacing.section}` (120px) — longer than most marketing sites because Bugatti''s bands are mostly photography with minimal text. The empty space frames the cars.
- **Card internal padding:** `{spacing.lg}` (24px) for newsroom and content cards; `{spacing.md}` (16px) for the career callout card; `{spacing.xxl}` (64px) inside hero photo bands.
- **Gutters:** `{spacing.xl}` (40px) between cards in 2-up grids — wider than typical because Bugatti''s grids are sparse.

### Grid & Container
- **Max content width:** ~1280px centered. Hero photo bands bleed full-width with no max.
- **Editorial body:** Single 12-column grid; photo bands are full-bleed.
- **Newsroom layout:** 2-up article grid at desktop, 1-up at tablet+mobile.
- **Career listings:** Single column with 80px row spacing.

### Whitespace Philosophy
Bugatti uses whitespace more aggressively than any luxury-auto competitor. The homepage hero is mostly photography + huge whitespace + a single sentence + a single button. The empty black space below the photograph is intentional — it lets the car breathe. Compressing the whitespace to "fit more content" breaks the brand''s fundamental contract: that less is more.', '{"sourcePath":"docs/design-md/bugatti/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body, top nav, footer, photo bands |
| Soft hairline | 1px `{colors.hairline}` border | Section dividers, table rows |
| Card surface | `{colors.surface-card}` background — no shadow | Career callout, newsroom article container |
| Photographic depth | Full-bleed photography with edge-to-edge crop | Hero bands, model showcases — depth via subject + lens, not chrome |

The system uses no shadows, no glassmorphism, no gradients. Depth comes entirely from photography (lighting, lens, subject framing) and from the contrast between black canvas and minimally-elevated `{colors.surface-card}`.

### Decorative Depth
- None. Bugatti is the only luxury-auto brand without a single decorative element. There is no stripe, no badge, no heritage emblem on the marketing site outside the wordmark itself.', '{"sourcePath":"docs/design-md/bugatti/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | All cards, photo containers, inputs, spec cells — the dominant radius |
| `{rounded.pill}` | 9999px | All buttons (the only rounded element in the system) |
| `{rounded.full}` | 9999px / 50% | Circular icon buttons, avatar surfaces |

The radius hierarchy is binary: rectangular for everything except buttons, which are pills. No 4px, no 8px, no 12px in between — those would feel "designed" rather than "engineered."

### Photography Geometry
Hero photography fills full-width with no rounding. Photo cards inside grids retain `{rounded.none}` (0px) corners, edge-to-edge images. Model detail shots use 16:9 or wider cinema-aspect ratios. Newsroom thumbnails use 16:9 with 0px corners. There are no avatars or rounded photo crops anywhere on the marketing site.', '{"sourcePath":"docs/design-md/bugatti/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav`** — A 56px-tall transparent nav bar overlaid on the hero photo at the top of every page. No fill, no border. Carries "MENU" at left, the centered **wordmark-display** ("BUGATTI" in 14px Bugatti Display with 6px tracking), and "STORE" at right with a small bag icon. All labels in `{typography.nav-link}` (Bugatti Monospace, 12px, 2px tracking, uppercase).

**`wordmark-display`** — The "BUGATTI" wordmark itself. Bugatti Display at 14px, weight 400, 6px letter-spacing. The widest tracking in the system. Centered in the nav bar at every breakpoint.

### Buttons

**`button-primary`** — The signature primary CTA. Background **transparent**, text `{colors.on-dark}` (white), 1px white outline, rounded `{rounded.pill}` (9999px), padding 14px × 32px, height 44px. Type `{typography.button}` — Bugatti Monospace, uppercase, 14px, 2.5px tracking. The transparent fill is unique to Bugatti — every other luxury-auto brand uses a filled or outlined-with-text-shift button. Bugatti''s transparent pill IS the button.

**`button-icon`** — Circular icon buttons (carousel arrows, share, language switcher). 40 × 40px, transparent background, white outline 1px, rounded `{rounded.full}`. Same outline-only treatment as the primary button.

**`text-link`** — Inline body links in `{colors.link}` (#c3d9f3, the only non-monochrome color in the system). Underlined by default. Type inherits `{typography.body-md}` (Bugatti Text Regular, serif).

### Cards & Containers

**`hero-photo-band`** — Full-width black band with full-bleed automotive photography. The h1 in `{typography.display-xl}` sits center-aligned over the photo near the top, often paired with a small Bugatti Monospace caption (`{typography.caption-uppercase}`) below the headline and a single `{component.button-primary}` further down. Vertical padding 96px-200px depending on photo height.

**`career-callout-card`** — A small right-aligned card that floats over the hero photo on the homepage with a recruiting prompt ("Are you ready for a new adventure?"). Background `{colors.surface-card}`, rounded `{rounded.none}` (0px), padding `{spacing.md}` (16px), width 320px. Carries a small thumbnail at top, body line, and a `{typography.caption-uppercase}` link ("EXPLORE OUR OPPORTUNITIES").

**`model-photo-card`** — Used in model showcases (Tourbillon page, model lineup grid). Background `{colors.canvas}` (no card surface — just photo on black), rounded `{rounded.none}`. Top: 16:9 or 21:9 hero shot of the model. Below: model name in `{typography.display-md}` (32px Bugatti Display, 2px tracking), short specs line in `{typography.caption-uppercase}` (11px Bugatti Monospace), a `{component.text-link}` ("DISCOVER").

**`newsroom-article-card`** — Used on the newsroom page (newsroom.bugatti.com). Background `{colors.canvas}` with hairline border, rounded `{rounded.none}`, padding `{spacing.lg}` (24px). Carries a 16:9 thumbnail, a `{component.date-pill}` ("12. NOVEMBER 2025"), a `{typography.title-md}` headline, and a body excerpt in `{typography.body-md}` (Bugatti Text Regular serif).

**`career-listing-row`** — Each row of the careers page job listing. Transparent background, padding 24px vertical, hairline divider between rows. Job title in `{typography.title-md}` (Bugatti Display 20px) at left; location + department in `{typography.caption-uppercase}` at right; chevron arrow (→) at far right.

**`spec-cell`** — Vehicle technical-spec display on model-detail pages (Tourbillon engine specs). Transparent background with hairline dividers between cells (not between cells inside a card). Each spec shows a value in `{typography.title-md}` at top and a label in `{typography.caption-uppercase}` below. Padding 24px vertical.

### Inputs & Forms

**`text-input`** — Standard text input on dark canvas. Background **transparent**, text `{colors.on-dark}`, 1px hairline-strong bottom border only (no top, left, right border), padding 12px × 0px, height 44px. Type `{typography.body-md}` (Bugatti Text Regular). Placeholder in `{colors.muted}`. Focus thickens the bottom border to white.

### Tags & Captions

**`caption-overlay`** — Photo-overlay caption (e.g., "HONORING THE OEYRON AND ITS VISIONARY CREATOR"). Centered or left-aligned over photography in `{typography.caption-uppercase}` (Bugatti Monospace, 11px, 2px tracking, white).

**`category-tag`** + **`date-pill`** — Both render as transparent inline labels in `{typography.caption-uppercase}`, color `{colors.muted}`. No background fill, no border. The "tag" is the type itself.

### CTA / Footer

**`cta-band-photo`** — A pre-footer "Discover Bugatti" band with full-bleed photography of a Bugatti car at speed and a centered headline in `{typography.display-md}` + a `{component.button-primary}` below. Vertical padding 80px. Inherits the editorial gravity of the hero through full-bleed photography.

**`footer`** — Black footer that closes every page. Background `{colors.canvas}`, text `{colors.muted}`. 4-column link list at desktop covering Bugatti / Models / Heritage / Connect. Vertical padding 64px. Bottom row carries the copyright line in `{typography.body-sm}` (Bugatti Text Regular). The wordmark sits center-aligned at the very bottom. The footer never inverts.', '{"sourcePath":"docs/design-md/bugatti/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Anchor every page with full-bleed automotive photography. The cars are the brand voltage; chrome backs off entirely.
- Keep all display headlines in UPPERCASE Bugatti Display with 2-4px letter-spacing. The wordmark gets 6px.
- Use Bugatti Display for headlines, Bugatti Text Regular (serif!) for body, Bugatti Monospace for buttons + captions + nav. The trinity is unbreakable.
- Keep `{component.button-primary}` transparent with a 1px white outline. The transparent pill IS the brand button.
- Use weight 400 everywhere. Bold breaks the brand voice — the system has no bold weight role.
- Use `{spacing.section}` (120px) between major editorial bands. The whitespace is part of the brand.
- Reserve `{colors.link}` (#c3d9f3) for inline anchor links only. It''s the system''s only non-monochrome color.

### Don''t
- Don''t introduce any accent color outside `{colors.link}`. Bugatti''s brand discipline is total monochrome + photography. Adding a brand-blue or brand-red breaks the contract.
- Don''t bold any type. The system has no bold weight — every typeface stays at 400.
- Don''t fill primary buttons. Transparent + outline only. A solid white button reads as off-brand.
- Don''t compress whitespace between sections. The 120px rhythm is part of the editorial pacing.
- Don''t use rounded corners outside buttons. Cards, photos, inputs all stay at 0px. Rounded cards read as consumer-tech, not luxury-engineered.
- Don''t tighten letter-spacing on display headlines. 2-4px tracking on Bugatti Display is non-negotiable.
- Don''t use Bugatti Display in a button (use Bugatti Monospace) or Bugatti Monospace in a paragraph (use Bugatti Text Regular). The trinity split is the brand voice.', '{"sourcePath":"docs/design-md/bugatti/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 64→32px; career callout card hides; photo bands stay full-bleed; footer 4 cols → 1 |
| Tablet | 768–1024px | Top nav stays minimal (MENU + wordmark + STORE); 2-up newsroom grid; career rows full-width |
| Desktop | 1024–1440px | Full minimal top-nav; 2-up newsroom grid; spec tables 4-up |
| Wide | > 1440px | Same as desktop with more breathing room; max content 1280px |

### Touch Targets
- `{component.button-primary}` renders at minimum 44 × 44px (matches WCAG AAA).
- `{component.button-icon}` is exactly 40 × 40px.
- `{component.text-input}` height is 44px.
- Career listing rows have 24px vertical padding; effective tap area meets 44px+ with surrounding spacing.

### Collapsing Strategy
- Top nav stays minimal at all breakpoints (MENU label + wordmark + STORE label). On mobile the labels hide behind a hamburger but the wordmark stays centered.
- Hero photography stays full-bleed at every breakpoint. Photo crops adjust — wider crops at desktop, vertical crops on mobile.
- The career callout card on the homepage hides at < 768px (it''s a desktop-only floating element).
- 2-up newsroom grid collapses to 1-up at < 768px.
- Spec cells reflow from 4-up to 2-up to 1-up; values stay at the same display size regardless of column count.

### Image Behavior
- Hero photography crops responsively — wider crops at desktop, vertical crops on mobile. Bugatti cars are always shown in motion or at-angle (never flat profiles).
- Newsroom thumbnails retain 16:9 ratio and 0px corners.', '{"sourcePath":"docs/design-md/bugatti/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.hero-photo-band}`, `{component.career-callout-card}`).
2. New components default to `{rounded.none}` (0px). Only `{component.button-primary}` and `{component.button-icon}` use pill / full radius.
3. Variants live as separate entries in `components:`.
4. Use `{token.refs}` everywhere — never inline hex.
5. Never document hover. Default and Active/Pressed states only.
6. Display headlines stay UPPERCASE Bugatti Display 400 with 2-4px tracking. Body stays sentence-case Bugatti Text Regular (serif). Button labels stay Bugatti Monospace 2.5px tracking. The trinity does not blur.
7. When in doubt about emphasis: bigger photography before bigger type.', '{"sourcePath":"docs/design-md/bugatti/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- The dembrandt frequency analyzer captured only 3 colors at root level (`#000000`, `#999999`, `#c3d9f3`). The white text (#ffffff) and dark surface tones (`#0d0d0d`, `#141414`, `#1f1f1f`) were inferred from screenshot — Bugatti''s pages are so monochrome that the frequency-based analyzer didn''t surface body text or surface tones as distinct palette entries.
- The three Bugatti typefaces (Display, Text Regular, Monospace) are licensed to Bugatti and not available as web fonts publicly. Substitutes are documented in the typography section.
- Animation and transition timings (photo carousel transitions, hover-reveal of menu, configurator animations) are not in scope.
- Form validation states beyond the underline-only `{component.text-input}` are not extracted — error / success states are inferred from general standards, not from the analyzed surfaces.
- The configurator surface (vehicle build pages with custom paint / interior pickers) was not in the analyzed URL set; its swatch grid, customization controls, and price-summary card are not documented here.
- The German-language newsroom (newsroom.bugatti.com/de) shares the system with the English Bugatti.com surfaces — no design-system-level differences observed, only language localization.
- The actual Tourbillon page rendered as a sparse minimal page in the captured screenshot, suggesting either lazy-loaded content or an interactive configurator-style UI that doesn''t render fully in static screenshots; engine-spec layout is documented from general luxury-auto patterns informed by the captured spec cell tokens.', '{"sourcePath":"docs/design-md/bugatti/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_1', '#ffffff', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_2', '#cccccc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_3', '#e6e6e6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_4', '#999999', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_5', '#666666', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_6', '#262626', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_7', '#3a3a3a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_8', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_9', '#0d0d0d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_10', '#141414', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_11', '#1f1f1f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_12', '#c3d9f3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_13', '#d4a017', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'color', 'color_14', '#5fa657', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'typography', 'font_1', 'Bugatti Display, sans-serif', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'typography', 'font_2', 'Bugatti Display, serif', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'typography', 'font_3', 'Bugatti Monospace, ui-monospace, monospace', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md'), 'typography', 'font_4', 'Bugatti Text Regular, serif', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/bugatti/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/bugatti/DESIGN.md';


-- Cal
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Cal', 'cal', 'design-reference', null, now())
  on conflict (slug) do update
    set name = excluded.name,
        category = excluded.category,
        updated_at = now()
  returning id
),
d as (
  insert into design_documents (
    brand_id,
    source_type,
    original_filename,
    original_blob_url,
    status,
    raw_markdown,
    updated_at
  )
  select id, 'markdown_seed', 'docs/design-md/cal/DESIGN.md', null, 'seeded', '---
version: alpha
name: Cal.com-design-analysis
description: A clean, calendar-software-first interface anchored on white canvas with black primary CTAs and custom Cal Sans display typography. The system reads as friendly modern SaaS — generous whitespace, soft-rounded cards (~12px), product UI fragments shown directly inside cards, and a dark navy footer that visually closes long-scroll pages. Brand voltage comes from the Cal Sans display headline (a custom geometric face) and from product UI artifacts shown in-card rather than from accent colors.

colors:
  primary: "#111111"
  primary-active: "#242424"
  primary-disabled: "#e5e7eb"
  ink: "#111111"
  body: "#374151"
  muted: "#6b7280"
  muted-soft: "#898989"
  hairline: "#e5e7eb"
  hairline-soft: "#f3f4f6"
  canvas: "#ffffff"
  surface-soft: "#f8f9fa"
  surface-card: "#f5f5f5"
  surface-strong: "#e5e7eb"
  surface-dark: "#101010"
  surface-dark-elevated: "#1a1a1a"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  on-dark-soft: "#a1a1aa"
  brand-accent: "#3b82f6"
  success: "#10b981"
  warning: "#f59e0b"
  error: "#ef4444"
  badge-orange: "#fb923c"
  badge-pink: "#ec4899"
  badge-violet: "#8b5cf6"
  badge-emerald: "#34d399"

typography:
  display-xl:
    fontFamily: "Cal Sans, Inter, sans-serif"
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -2px
  display-lg:
    fontFamily: "Cal Sans, Inter, sans-serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -1.5px
  display-md:
    fontFamily: "Cal Sans, Inter, sans-serif"
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -1px
  display-sm:
    fontFamily: "Cal Sans, Inter, sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.5px
  title-lg:
    fontFamily: "Inter, sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.3px
  title-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  nav-link:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 40px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 40px
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 36px
  button-text-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
  text-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 64px
  nav-pill-group:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.pill}"
    padding: 6px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: 96px
  hero-app-mockup-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  feature-icon-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.lg}"
    padding: 24px
  product-mockup-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 24px
  testimonial-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-tier-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-tier-card-featured:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 14px
    height: 40px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  category-tab:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.nav-link}"
    padding: 8px 14px
    rounded: "{rounded.md}"
  category-tab-active:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.md}"
  avatar-circle:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 36px
  badge-pill:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  rating-stars:
    backgroundColor: transparent
    textColor: "{colors.badge-orange}"
    typography: "{typography.caption}"
  cta-band-light:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.display-sm}"
    rounded: "{rounded.lg}"
    padding: 48px
  footer:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark-soft}"
    typography: "{typography.body-sm}"
    padding: 64px
---

## Overview

Cal.com''s marketing surface is a clean, friendly modern-SaaS interface — white canvas (`{colors.canvas}` — #ffffff) with black primary CTAs (`{colors.primary}` — #111111), custom **Cal Sans** display typography, and `{colors.surface-card}` (#f5f5f5) light-gray cards holding product UI fragments. The system reads as confidently engineered without trying to impress — every band has clear hierarchy, generous whitespace, and a single primary action.

Type voice splits cleanly into two roles: **Cal Sans** (the brand''s custom geometric display face — used for h1, h2, h3, and hero headlines) and **Inter** (used for everything else — body, buttons, nav, captions). Cal Sans uses weight 600 with negative letter-spacing (-0.5px to -2px depending on size) — it feels modern, slightly condensed, distinctly Cal.com.

Component voltage comes from **product UI fragments shown directly inside cards** — calendar widgets, scheduling forms, automation diagrams, integration tiles. Cal.com doesn''t paint marketing illustrations of the product; it shows the actual product chrome at small scale embedded in the marketing flow.

The footer flips to `{colors.surface-dark}` (#101010) — a deep near-black that visually closes every long-scroll page. The footer is the only dark surface in the system; everything above stays white-with-light-gray-cards.

**Key Characteristics:**
- White canvas with black primary CTA (`{colors.primary}` — #111111). Buttons are `{rounded.md}` (8px) with confident weight-600 labels. Standard friendly-SaaS button.
- Custom `Cal Sans` display typeface for headlines (substituted with Inter weight 600 here). Negative letter-spacing on display sizes — geometric, precise, slightly condensed.
- Light-gray card surfaces (`{colors.surface-card}` — #f5f5f5) for feature cards, testimonials, and pricing tiers (non-featured). The featured pricing tier flips to `{colors.surface-dark}` (the only dark card on light pages).
- Product UI fragments embedded directly in cards — Cal.com shows real schedule pickers, calendar widgets, integration grids inside its marketing cards. Brand voltage from real product chrome at small scale.
- Nav-pill-group (`{component.nav-pill-group}`) — a small pill-radius wrapper around grouped nav segments (e.g., the sub-nav switcher between product views). The pill wrapper is one of the system''s signature interactive components.
- Avatars are circular (`{rounded.full}`), 36px diameter, used in testimonial rows and team-listing surfaces.
- Footer is dark navy (`{colors.surface-dark}` — #101010) with light text (`{colors.on-dark-soft}` — #a1a1aa). The dark footer closes every page even though the body above is white.
- Spacing rhythm is `{spacing.section}` (96px) between major bands — tight enough to feel modern-SaaS but generous enough to breathe.
- Border radius is hierarchical: `{rounded.md}` (8px) for buttons + inputs, `{rounded.lg}` (12px) for content cards, `{rounded.xl}` (16px) for the hero app-mockup container, `{rounded.pill}` for nav-pill-group + badges, `{rounded.full}` for avatars + icon buttons.

## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #111111): The dominant action color. All primary CTAs, h1/h2 display type. Press state shifts to `{colors.primary-active}` (#242424).
- **Brand Accent** (`{colors.brand-accent}` — #3b82f6): Used sparely on inline links and on a small badge / "Customer story" highlight. Cal.com is a near-monochrome brand — the blue appears rarely.
- **Badge Pastels** — A small pastel set for category badges and avatar fills: `{colors.badge-orange}` (#fb923c), `{colors.badge-pink}` (#ec4899), `{colors.badge-violet}` (#8b5cf6), `{colors.badge-emerald}` (#34d399). These appear on tag pills and small accent moments inside product UI fragments — never on hero CTAs.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default page floor.
- **Surface Soft** (`{colors.surface-soft}` — #f8f9fa): Nav-pill-group background, very-soft section dividers.
- **Surface Card** (`{colors.surface-card}` — #f5f5f5): Feature cards, testimonial cards, badge pills, default avatar fills.
- **Surface Strong** (`{colors.surface-strong}` — #e5e7eb): Hairline border alternative; disabled button background.
- **Surface Dark** (`{colors.surface-dark}` — #101010): The footer background — the only dark surface on every page. Also used for the featured pricing tier card.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #1a1a1a): Used for nested cards inside the dark footer or featured pricing card.
- **Hairline** (`{colors.hairline}` — #e5e7eb): The 1px border tone on light surfaces. Used on input borders, table dividers, content card outlines (sometimes).
- **Hairline Soft** (`{colors.hairline-soft}` — #f3f4f6): A barely-visible divider used between sections that share the white canvas.

### Text
- **Ink** (`{colors.ink}` — #111111): All headlines and primary text.
- **Body** (`{colors.body}` — #374151): Default running-text color.
- **Muted** (`{colors.muted}` — #6b7280): Secondary text — sub-headings, breadcrumbs, footer body.
- **Muted Soft** (`{colors.muted-soft}` — #898989): Tertiary text — captions, fine-print, copyright lines.
- **On Primary / On Dark** (`{colors.on-primary}` / `{colors.on-dark}` — #ffffff): Text on primary buttons and dark footer.
- **On Dark Soft** (`{colors.on-dark-soft}` — #a1a1aa): Footer body text — slightly muted white for the link rows.

### Semantic
- **Success** (`{colors.success}` — #10b981): Confirmation states, success badges in product UI.
- **Warning** (`{colors.warning}` — #f59e0b): Warning callouts.
- **Error** (`{colors.error}` — #ef4444): Validation errors.

## Typography

### Font Family
The system runs **Cal Sans** for display + brand wordmark and **Inter** for everything else. Cal Sans is Cal.com''s custom geometric display typeface — slightly condensed, weight 600, negative letter-spacing. Inter handles body, buttons, navigation, captions, and tabular code blocks. The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for both families.

The split is functional:
- Cal Sans (display, 600 weight, -0.5 to -2px tracking) — h1, h2, h3
- Inter (body + UI, 400-600 weight, 0 letter-spacing) — paragraphs, labels, buttons, nav

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 600 | 1.05 | -2px | Homepage h1 ("The better way to schedule your meetings") — Cal Sans |
| `{typography.display-lg}` | 48px | 600 | 1.1 | -1.5px | Section heads ("Your all-purpose scheduling app") — Cal Sans |
| `{typography.display-md}` | 36px | 600 | 1.15 | -1px | Sub-section heads, card titles — Cal Sans |
| `{typography.display-sm}` | 28px | 600 | 1.2 | -0.5px | CTA-band heads, pricing tier prices — Cal Sans |
| `{typography.title-lg}` | 22px | 600 | 1.3 | -0.3px | Pricing plan names — Inter |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Feature card titles, intro paragraphs |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Small card titles, list labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default running-text |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body, fine-print |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
| `{typography.code}` | 14px | 400 | 1.5 | 0 | Code snippets, API examples — JetBrains Mono |
| `{typography.button}` | 14px | 600 | 1.0 | 0 | Standard button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
Cal Sans is the brand voice — every display headline uses it. Inter handles the supporting type. The boundary is strict: never put body copy in Cal Sans, never put a display headline in Inter. Cal Sans without negative letter-spacing reads as off-brand — the -0.5 to -2px tracking is part of the voice.

Display weight stays at 600 across all sizes — never 700, never 500. The middle weight is what makes Cal Sans feel modern and confident without becoming bombastic.

### Note on Font Substitutes
If Cal Sans is unavailable, **Inter** at weight 600 with -0.04em letter-spacing is a usable approximation. The geometric character of Cal Sans differs from Inter''s humanist forms, but the substitution preserves the weight + tracking signature. **Manrope** at weight 700 is another close alternative.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) — the universal vertical rhythm between editorial bands.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards and pricing tier cards; `{spacing.lg}` (24px) for testimonial and product-mockup cards.
- **Gutters:** `{spacing.lg}` (24px) between cards in 3-up grids; `{spacing.md}` (16px) inside footer columns.

### Grid & Container
- **Max content width:** ~1200px centered on marketing pages.
- **Editorial body:** Single 12-column grid; hero band often uses 7/5 split (h1 left, app mockup card right).
- **Feature card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Pricing grid:** 4-up at desktop, 2-up at tablet, 1-up at mobile.
- **Footer:** 4-column link list at desktop, wrapping to 2-up at tablet, 1-up at mobile.

### Whitespace Philosophy
Cal.com uses generous but not excessive whitespace — section padding sits at 96px (modern-SaaS standard), and card internal padding stays at 32px. The rhythm is calibrated for fast scanning: every band has a single h1 + h2 + supporting cards, never densely packed lists. The result reads as confident-not-shouting.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero bands |
| Soft hairline | 1px `{colors.hairline}` border | Inputs, table dividers, occasionally on cards |
| Card surface | `{colors.surface-card}` background — no shadow | Feature cards, testimonials |
| Subtle drop shadow | Faint shadow at low alpha | Pricing tier cards, hover-elevated states (the system uses `0 1px 2px rgba(0,0,0,0.05)` and `0 4px 12px rgba(0,0,0,0.08)`) |
| Featured tier | `{colors.surface-dark}` background, no shadow needed | The featured pricing tier inverts to dark surface — color contrast does the elevation work |

The elevation philosophy is **soft and modern** — small drop shadows on elevated cards, color-block contrast for emphasis. No heavy shadows, no neumorphism, no glassmorphism.

### Decorative Depth
- Calendar widgets and product UI fragments embedded inside marketing cards carry their own internal shadows from the product UI itself — these are not system tokens, they''re product chrome shown as content.
- Avatar circles in testimonial sections sometimes carry pastel fill colors (`{colors.badge-orange}`, `{colors.badge-pink}`, etc.) — adds a small chromatic flourish without breaking the monochrome brand voice.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Almost no use — reserved for badge accents |
| `{rounded.sm}` | 6px | Small inline buttons, dropdown items |
| `{rounded.md}` | 8px | Standard CTA buttons, text inputs, category tabs |
| `{rounded.lg}` | 12px | Content cards (feature cards, testimonial cards, pricing tier cards) |
| `{rounded.xl}` | 16px | Hero app-mockup card (a slightly larger radius for the marquee component) |
| `{rounded.pill}` | 9999px | Nav-pill-group, badge pills |
| `{rounded.full}` | 9999px / 50% | Avatars, icon buttons |

### Photography Geometry
Avatar photos use `{rounded.full}` (perfect circles) at 36px or 40px. Product UI fragments inside marketing cards retain their native chrome (which often has its own internal radii — e.g., calendar grid cells, button rows). Hero illustration zones use 16:9 or 4:3 ratios with `{rounded.xl}` corners.

## Components

### Top Navigation

**`top-nav`** — White nav bar pinned to the top of every page. 64px tall, `{colors.canvas}` background. Carries the Cal.com wordmark + logo at left (the lowercase "Cal.com" with the brand circle), primary horizontal menu (Product, Solutions, Resources, Pricing, Enterprise) center, right-side cluster with "Sign in" text-link, "Sign up free" `{component.button-primary}`, and a sometimes-visible language selector. Menu items in `{typography.nav-link}` (Inter 14px / 500).

**`nav-pill-group`** — A small pill-radius wrapper around 2-3 sub-nav segments (e.g., the product-mode switcher between "Personal" / "Teams" / "Enterprise"). Background `{colors.surface-soft}` with internal padding 6px, rounded `{rounded.pill}`. Active segment renders as a white-canvas pill with a subtle drop shadow inside the wrapper. The pill-in-pill treatment is one of Cal.com''s signature interactive components.

### Buttons

**`button-primary`** — The signature primary CTA. Background `{colors.primary}` (#111111), text `{colors.on-primary}`, type `{typography.button}` (Inter 14px / 600), padding 12px × 20px, height 40px, rounded `{rounded.md}` (8px). Active state `button-primary-active` shifts to `{colors.primary-active}` (#242424).

**`button-secondary`** — White button with hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px hairline border, same padding + height + radius as primary.

**`button-icon-circular`** — 36 × 36px circular icon button. Background `{colors.canvas}`, hairline border, ink-color icon. Used for share, "view more", carousel arrows.

**`button-text-link`** — Inline text button, no background. Used for "Sign in" in the top nav and inline CTA links inside cards.

**`text-link`** — Inline body links in `{colors.ink}` (the brand keeps inline links monochrome). Underlined on hover (not documented per the no-hover policy, but mentioned for context).

### Cards & Containers

**`hero-band`** — White-canvas hero with a 7-5 grid: h1 + sub-headline + button row on the left, `{component.hero-app-mockup-card}` on the right. Vertical padding `{spacing.section}` (96px).

**`hero-app-mockup-card`** — A larger product-UI mockup card showing the actual Cal.com booking widget with calendar grid, time slots, and a primary "Confirm" button inside. Background `{colors.canvas}`, 1px hairline border, rounded `{rounded.xl}` (16px), subtle drop shadow. Used as the hero''s right-side artifact.

**`feature-card`** — Used in 3-up feature grids ("With us, appointment scheduling is easy"). Background `{colors.surface-card}` (#f5f5f5), rounded `{rounded.lg}` (12px), internal padding `{spacing.xl}` (32px). Carries a small icon at top, an `{typography.title-md}` headline, and a body description in `{typography.body-md}`.

**`feature-icon-card`** — A simpler card variant used in 4-up feature grids on lower-density bands. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Carries a small icon, `{typography.title-sm}` title, short description.

**`product-mockup-card`** — A card showing actual Cal.com product UI fragments (workflow editor, calendar grid, integration grid, automation flow). Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). The product UI inside has its own internal chrome — these cards display the product, they don''t decorate around it.

**`testimonial-card`** — Used in customer-quote grids. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Top row carries a `{component.avatar-circle}` + name + role; below sits the testimonial quote in `{typography.body-md}`.

**`pricing-tier-card`** — Standard tier card. Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px). Carries the plan name in `{typography.title-lg}`, price in `{typography.display-sm}`, feature checklist in `{typography.body-md}`, and a `{component.button-primary}` at the bottom.

**`pricing-tier-card-featured`** — The featured tier (typically "Teams"). Background flips to `{colors.surface-dark}` (#101010), text inverts to `{colors.on-dark}`. The dark surface IS the featured-tier signal — no accent border, no badge, no scale shift.

### Inputs & Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}` (8px), padding 10px × 14px, height 40px. 1px hairline border in `{colors.hairline}`.

**`text-input-focused`** — Focus state. Border thickens or shifts to `{colors.ink}` for emphasis.

### Tags / Badges

**`badge-pill`** — Small pill label used for category tags ("Product", "Article", "New") and pastel-fill avatar substitutes. Background `{colors.surface-card}` or one of the badge pastels (`{colors.badge-orange}`, `{colors.badge-pink}`, etc.), text `{colors.ink}`, type `{typography.caption}` (13px / 500), rounded `{rounded.pill}`, padding 4px × 12px.

**`avatar-circle`** — 36px diameter, rounded `{rounded.full}`. Either holds a photo or a pastel fill with initials in `{typography.caption}`.

**`rating-stars`** — Inline star rating in `{colors.badge-orange}` (#fb923c). Used near testimonial avatars to display a 5-star satisfaction score.

### Tab / Filter

**`category-tab`** + **`category-tab-active`** — Used inside the nav-pill-group. Inactive: transparent background, `{colors.muted}` text. Active: `{colors.canvas}` background, `{colors.ink}` text, subtle drop shadow inside the pill-group wrapper. Padding 8px × 14px, rounded `{rounded.md}`.

### CTA / Footer

**`cta-band-light`** — A pre-footer "Smarter, simpler scheduling" CTA card. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding `{spacing.xxl}` (48px). Carries an h2 in `{typography.display-sm}`, a sub-line, and a `{component.button-primary}` centered.

**`footer`** — Dark navy footer that closes every page. Background `{colors.surface-dark}` (#101010), text `{colors.on-dark-soft}`. 4-column link list at desktop covering Product / Solutions / Company / Resources. Vertical padding 64px. The Cal.com wordmark sits at the top-left in `{colors.on-dark}`. The footer is the only dark surface on every page — the deliberate inversion visually closes the page.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (#111111) for primary CTAs and h1/h2 type. Cal.com''s button is near-black, not blue.
- Use Cal Sans for every display headline. Pair with Inter body. Never blur the boundary.
- Apply negative letter-spacing on display sizes (-0.5 to -2px). Cal Sans without it reads as off-brand.
- Use `{component.feature-card}` (light gray) and `{component.product-mockup-card}` (white with chrome) deliberately — the gray cards signal "abstract feature claim", white cards signal "look at the actual product".
- Embed real product UI fragments inside marketing cards. Don''t paint marketing illustrations of the product when you can show the product itself.
- Keep avatar circles at 36px, perfect circles, sometimes with pastel fills. Avatars are the only place where badge pastels appear.
- Use `{component.nav-pill-group}` for grouped sub-nav segments. The pill-in-pill treatment is signature.
- End every page with the dark footer. The light-to-dark transition is part of the editorial rhythm.

### Don''t
- Don''t use accent colors (`{colors.brand-accent}`, badge pastels) on primary CTAs. The system is monochrome at the action layer.
- Don''t bold display weight beyond 600. Cal Sans at 700 reads as bombastic.
- Don''t use rounded radius beyond `{rounded.xl}` (16px) on cards. Larger radii read as consumer-app, not professional booking software.
- Don''t put dark surface cards anywhere except the footer and the featured pricing tier. The dark surface is a deliberate, scarce signal.
- Don''t repeat the same surface mode in two consecutive bands. Cal.com''s pacing alternates white → light-gray → white → product-mockup-card → white → dark-footer.
- Don''t add hover state styling beyond what the system already encodes — primary darkens on press; nothing else changes.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 64→32px; hero-app-mockup-card stacks below content; feature grids 1-up; pricing 1-up; footer 4 cols → 1 |
| Tablet | 768–1024px | Top nav stays horizontal but tightens; nav-pill-group wraps; feature cards 2-up; pricing 2-up |
| Desktop | 1024–1440px | Full top-nav with all menu items; 3-up feature cards; 4-up pricing tiers |
| Wide | > 1440px | Same as desktop with more outer breathing room; max content width caps at 1200px |

### Touch Targets
- `{component.button-primary}` at minimum 40 × 40px.
- `{component.button-icon-circular}` at exactly 36 × 36 — slightly under WCAG''s 44 × 44 but the centered icon and full-circle silhouette compensate.
- `{component.text-input}` height is 40px.
- `{component.category-tab}` rendered inside nav-pill-group has 8 × 14 padding; effective tap area meets 44px+ with the surrounding pill.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px; menu opens as a full-screen sheet.
- Hero band''s 7-5 grid collapses to single-column on mobile — h1 + sub-head + buttons first, then the app-mockup card below.
- Feature grids reduce columns rather than scaling cards down.
- Pricing tier cards collapse 4 → 2 → 1; featured-tier dark surface stays visually distinct at every breakpoint.
- Nav-pill-group wraps to multi-row on tablet if the segments don''t fit horizontally.
- Avatar + testimonial card layouts stay grid-aligned at every breakpoint.

### Image Behavior
- Product UI fragments inside cards retain native aspect ratios; the cards themselves resize.
- Avatar photos crop to circles at every breakpoint.
- Hero app-mockup card scales proportionally on mobile — the calendar grid stays legible.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.feature-card}`, `{component.pricing-tier-card-featured}`).
2. Variants of an existing component (`-active`, `-disabled`, `-focused`) live as separate entries in `components:`.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay Cal Sans 600 with negative letter-spacing. Body stays Inter 400. The trinity does not blur.
6. The dark footer is the only dark surface on most pages. Don''t add other dark cards casually.
7. When in doubt about emphasis: bigger Cal Sans before bolder Cal Sans.

## Known Gaps

- The dembrandt frequency analyzer captured `Buttons: 0 variants` — Cal.com renders most CTAs as styled `<a>` link elements rather than `<button>` tags, which dembrandt''s button selector doesn''t capture. Button styles are documented from screenshot ground-truth + standard Cal Sans / Inter baselines.
- Cal Sans is licensed to Cal.com and not available as a public web font; substitutes are documented in the typography section.
- The badge pastel set (orange / pink / violet / emerald) is documented from observed avatar fill colors; exact hex values may shift seasonally.
- Animation and transition timings (calendar slot picker, schedule confirmation, integration grid hover-reveal) are not in scope.
- Form validation states beyond `{component.text-input-focused}` are not extracted — error / success states would need a sign-up or booking flow to confirm.
- The actual booking widget surface (cal.com/{username}) is the product, not a marketing surface; its spec is out of scope.
- Avatar photos in testimonial sections sometimes carry pastel circular fills with initials instead of photographs; both treatments coexist on the same page.
', now()
  from b
  on conflict (brand_id, original_filename) do update
    set status = 'seeded',
        raw_markdown = excluded.raw_markdown,
        updated_at = now()
  returning id
),
deleted_sections as (
  delete from design_sections where document_id = (select id from d)
),
deleted_tokens as (
  delete from design_tokens where document_id = (select id from d)
)
insert into design_sections (document_id, category, original_title, normalized_title, content_markdown, content_json, confidence, sort_order)
values
((select id from d), 'overview', 'Overview', 'overview', '## Overview

Cal.com''s marketing surface is a clean, friendly modern-SaaS interface — white canvas (`{colors.canvas}` — #ffffff) with black primary CTAs (`{colors.primary}` — #111111), custom **Cal Sans** display typography, and `{colors.surface-card}` (#f5f5f5) light-gray cards holding product UI fragments. The system reads as confidently engineered without trying to impress — every band has clear hierarchy, generous whitespace, and a single primary action.

Type voice splits cleanly into two roles: **Cal Sans** (the brand''s custom geometric display face — used for h1, h2, h3, and hero headlines) and **Inter** (used for everything else — body, buttons, nav, captions). Cal Sans uses weight 600 with negative letter-spacing (-0.5px to -2px depending on size) — it feels modern, slightly condensed, distinctly Cal.com.

Component voltage comes from **product UI fragments shown directly inside cards** — calendar widgets, scheduling forms, automation diagrams, integration tiles. Cal.com doesn''t paint marketing illustrations of the product; it shows the actual product chrome at small scale embedded in the marketing flow.

The footer flips to `{colors.surface-dark}` (#101010) — a deep near-black that visually closes every long-scroll page. The footer is the only dark surface in the system; everything above stays white-with-light-gray-cards.

**Key Characteristics:**
- White canvas with black primary CTA (`{colors.primary}` — #111111). Buttons are `{rounded.md}` (8px) with confident weight-600 labels. Standard friendly-SaaS button.
- Custom `Cal Sans` display typeface for headlines (substituted with Inter weight 600 here). Negative letter-spacing on display sizes — geometric, precise, slightly condensed.
- Light-gray card surfaces (`{colors.surface-card}` — #f5f5f5) for feature cards, testimonials, and pricing tiers (non-featured). The featured pricing tier flips to `{colors.surface-dark}` (the only dark card on light pages).
- Product UI fragments embedded directly in cards — Cal.com shows real schedule pickers, calendar widgets, integration grids inside its marketing cards. Brand voltage from real product chrome at small scale.
- Nav-pill-group (`{component.nav-pill-group}`) — a small pill-radius wrapper around grouped nav segments (e.g., the sub-nav switcher between product views). The pill wrapper is one of the system''s signature interactive components.
- Avatars are circular (`{rounded.full}`), 36px diameter, used in testimonial rows and team-listing surfaces.
- Footer is dark navy (`{colors.surface-dark}` — #101010) with light text (`{colors.on-dark-soft}` — #a1a1aa). The dark footer closes every page even though the body above is white.
- Spacing rhythm is `{spacing.section}` (96px) between major bands — tight enough to feel modern-SaaS but generous enough to breathe.
- Border radius is hierarchical: `{rounded.md}` (8px) for buttons + inputs, `{rounded.lg}` (12px) for content cards, `{rounded.xl}` (16px) for the hero app-mockup container, `{rounded.pill}` for nav-pill-group + badges, `{rounded.full}` for avatars + icon buttons.', '{"sourcePath":"docs/design-md/cal/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #111111): The dominant action color. All primary CTAs, h1/h2 display type. Press state shifts to `{colors.primary-active}` (#242424).
- **Brand Accent** (`{colors.brand-accent}` — #3b82f6): Used sparely on inline links and on a small badge / "Customer story" highlight. Cal.com is a near-monochrome brand — the blue appears rarely.
- **Badge Pastels** — A small pastel set for category badges and avatar fills: `{colors.badge-orange}` (#fb923c), `{colors.badge-pink}` (#ec4899), `{colors.badge-violet}` (#8b5cf6), `{colors.badge-emerald}` (#34d399). These appear on tag pills and small accent moments inside product UI fragments — never on hero CTAs.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default page floor.
- **Surface Soft** (`{colors.surface-soft}` — #f8f9fa): Nav-pill-group background, very-soft section dividers.
- **Surface Card** (`{colors.surface-card}` — #f5f5f5): Feature cards, testimonial cards, badge pills, default avatar fills.
- **Surface Strong** (`{colors.surface-strong}` — #e5e7eb): Hairline border alternative; disabled button background.
- **Surface Dark** (`{colors.surface-dark}` — #101010): The footer background — the only dark surface on every page. Also used for the featured pricing tier card.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #1a1a1a): Used for nested cards inside the dark footer or featured pricing card.
- **Hairline** (`{colors.hairline}` — #e5e7eb): The 1px border tone on light surfaces. Used on input borders, table dividers, content card outlines (sometimes).
- **Hairline Soft** (`{colors.hairline-soft}` — #f3f4f6): A barely-visible divider used between sections that share the white canvas.

### Text
- **Ink** (`{colors.ink}` — #111111): All headlines and primary text.
- **Body** (`{colors.body}` — #374151): Default running-text color.
- **Muted** (`{colors.muted}` — #6b7280): Secondary text — sub-headings, breadcrumbs, footer body.
- **Muted Soft** (`{colors.muted-soft}` — #898989): Tertiary text — captions, fine-print, copyright lines.
- **On Primary / On Dark** (`{colors.on-primary}` / `{colors.on-dark}` — #ffffff): Text on primary buttons and dark footer.
- **On Dark Soft** (`{colors.on-dark-soft}` — #a1a1aa): Footer body text — slightly muted white for the link rows.

### Semantic
- **Success** (`{colors.success}` — #10b981): Confirmation states, success badges in product UI.
- **Warning** (`{colors.warning}` — #f59e0b): Warning callouts.
- **Error** (`{colors.error}` — #ef4444): Validation errors.', '{"sourcePath":"docs/design-md/cal/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The system runs **Cal Sans** for display + brand wordmark and **Inter** for everything else. Cal Sans is Cal.com''s custom geometric display typeface — slightly condensed, weight 600, negative letter-spacing. Inter handles body, buttons, navigation, captions, and tabular code blocks. The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for both families.

The split is functional:
- Cal Sans (display, 600 weight, -0.5 to -2px tracking) — h1, h2, h3
- Inter (body + UI, 400-600 weight, 0 letter-spacing) — paragraphs, labels, buttons, nav

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 600 | 1.05 | -2px | Homepage h1 ("The better way to schedule your meetings") — Cal Sans |
| `{typography.display-lg}` | 48px | 600 | 1.1 | -1.5px | Section heads ("Your all-purpose scheduling app") — Cal Sans |
| `{typography.display-md}` | 36px | 600 | 1.15 | -1px | Sub-section heads, card titles — Cal Sans |
| `{typography.display-sm}` | 28px | 600 | 1.2 | -0.5px | CTA-band heads, pricing tier prices — Cal Sans |
| `{typography.title-lg}` | 22px | 600 | 1.3 | -0.3px | Pricing plan names — Inter |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Feature card titles, intro paragraphs |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Small card titles, list labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default running-text |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body, fine-print |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
| `{typography.code}` | 14px | 400 | 1.5 | 0 | Code snippets, API examples — JetBrains Mono |
| `{typography.button}` | 14px | 600 | 1.0 | 0 | Standard button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
Cal Sans is the brand voice — every display headline uses it. Inter handles the supporting type. The boundary is strict: never put body copy in Cal Sans, never put a display headline in Inter. Cal Sans without negative letter-spacing reads as off-brand — the -0.5 to -2px tracking is part of the voice.

Display weight stays at 600 across all sizes — never 700, never 500. The middle weight is what makes Cal Sans feel modern and confident without becoming bombastic.

### Note on Font Substitutes
If Cal Sans is unavailable, **Inter** at weight 600 with -0.04em letter-spacing is a usable approximation. The geometric character of Cal Sans differs from Inter''s humanist forms, but the substitution preserves the weight + tracking signature. **Manrope** at weight 700 is another close alternative.', '{"sourcePath":"docs/design-md/cal/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) — the universal vertical rhythm between editorial bands.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards and pricing tier cards; `{spacing.lg}` (24px) for testimonial and product-mockup cards.
- **Gutters:** `{spacing.lg}` (24px) between cards in 3-up grids; `{spacing.md}` (16px) inside footer columns.

### Grid & Container
- **Max content width:** ~1200px centered on marketing pages.
- **Editorial body:** Single 12-column grid; hero band often uses 7/5 split (h1 left, app mockup card right).
- **Feature card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Pricing grid:** 4-up at desktop, 2-up at tablet, 1-up at mobile.
- **Footer:** 4-column link list at desktop, wrapping to 2-up at tablet, 1-up at mobile.

### Whitespace Philosophy
Cal.com uses generous but not excessive whitespace — section padding sits at 96px (modern-SaaS standard), and card internal padding stays at 32px. The rhythm is calibrated for fast scanning: every band has a single h1 + h2 + supporting cards, never densely packed lists. The result reads as confident-not-shouting.', '{"sourcePath":"docs/design-md/cal/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero bands |
| Soft hairline | 1px `{colors.hairline}` border | Inputs, table dividers, occasionally on cards |
| Card surface | `{colors.surface-card}` background — no shadow | Feature cards, testimonials |
| Subtle drop shadow | Faint shadow at low alpha | Pricing tier cards, hover-elevated states (the system uses `0 1px 2px rgba(0,0,0,0.05)` and `0 4px 12px rgba(0,0,0,0.08)`) |
| Featured tier | `{colors.surface-dark}` background, no shadow needed | The featured pricing tier inverts to dark surface — color contrast does the elevation work |

The elevation philosophy is **soft and modern** — small drop shadows on elevated cards, color-block contrast for emphasis. No heavy shadows, no neumorphism, no glassmorphism.

### Decorative Depth
- Calendar widgets and product UI fragments embedded inside marketing cards carry their own internal shadows from the product UI itself — these are not system tokens, they''re product chrome shown as content.
- Avatar circles in testimonial sections sometimes carry pastel fill colors (`{colors.badge-orange}`, `{colors.badge-pink}`, etc.) — adds a small chromatic flourish without breaking the monochrome brand voice.', '{"sourcePath":"docs/design-md/cal/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Almost no use — reserved for badge accents |
| `{rounded.sm}` | 6px | Small inline buttons, dropdown items |
| `{rounded.md}` | 8px | Standard CTA buttons, text inputs, category tabs |
| `{rounded.lg}` | 12px | Content cards (feature cards, testimonial cards, pricing tier cards) |
| `{rounded.xl}` | 16px | Hero app-mockup card (a slightly larger radius for the marquee component) |
| `{rounded.pill}` | 9999px | Nav-pill-group, badge pills |
| `{rounded.full}` | 9999px / 50% | Avatars, icon buttons |

### Photography Geometry
Avatar photos use `{rounded.full}` (perfect circles) at 36px or 40px. Product UI fragments inside marketing cards retain their native chrome (which often has its own internal radii — e.g., calendar grid cells, button rows). Hero illustration zones use 16:9 or 4:3 ratios with `{rounded.xl}` corners.', '{"sourcePath":"docs/design-md/cal/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav`** — White nav bar pinned to the top of every page. 64px tall, `{colors.canvas}` background. Carries the Cal.com wordmark + logo at left (the lowercase "Cal.com" with the brand circle), primary horizontal menu (Product, Solutions, Resources, Pricing, Enterprise) center, right-side cluster with "Sign in" text-link, "Sign up free" `{component.button-primary}`, and a sometimes-visible language selector. Menu items in `{typography.nav-link}` (Inter 14px / 500).

**`nav-pill-group`** — A small pill-radius wrapper around 2-3 sub-nav segments (e.g., the product-mode switcher between "Personal" / "Teams" / "Enterprise"). Background `{colors.surface-soft}` with internal padding 6px, rounded `{rounded.pill}`. Active segment renders as a white-canvas pill with a subtle drop shadow inside the wrapper. The pill-in-pill treatment is one of Cal.com''s signature interactive components.

### Buttons

**`button-primary`** — The signature primary CTA. Background `{colors.primary}` (#111111), text `{colors.on-primary}`, type `{typography.button}` (Inter 14px / 600), padding 12px × 20px, height 40px, rounded `{rounded.md}` (8px). Active state `button-primary-active` shifts to `{colors.primary-active}` (#242424).

**`button-secondary`** — White button with hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px hairline border, same padding + height + radius as primary.

**`button-icon-circular`** — 36 × 36px circular icon button. Background `{colors.canvas}`, hairline border, ink-color icon. Used for share, "view more", carousel arrows.

**`button-text-link`** — Inline text button, no background. Used for "Sign in" in the top nav and inline CTA links inside cards.

**`text-link`** — Inline body links in `{colors.ink}` (the brand keeps inline links monochrome). Underlined on hover (not documented per the no-hover policy, but mentioned for context).

### Cards & Containers

**`hero-band`** — White-canvas hero with a 7-5 grid: h1 + sub-headline + button row on the left, `{component.hero-app-mockup-card}` on the right. Vertical padding `{spacing.section}` (96px).

**`hero-app-mockup-card`** — A larger product-UI mockup card showing the actual Cal.com booking widget with calendar grid, time slots, and a primary "Confirm" button inside. Background `{colors.canvas}`, 1px hairline border, rounded `{rounded.xl}` (16px), subtle drop shadow. Used as the hero''s right-side artifact.

**`feature-card`** — Used in 3-up feature grids ("With us, appointment scheduling is easy"). Background `{colors.surface-card}` (#f5f5f5), rounded `{rounded.lg}` (12px), internal padding `{spacing.xl}` (32px). Carries a small icon at top, an `{typography.title-md}` headline, and a body description in `{typography.body-md}`.

**`feature-icon-card`** — A simpler card variant used in 4-up feature grids on lower-density bands. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Carries a small icon, `{typography.title-sm}` title, short description.

**`product-mockup-card`** — A card showing actual Cal.com product UI fragments (workflow editor, calendar grid, integration grid, automation flow). Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). The product UI inside has its own internal chrome — these cards display the product, they don''t decorate around it.

**`testimonial-card`** — Used in customer-quote grids. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Top row carries a `{component.avatar-circle}` + name + role; below sits the testimonial quote in `{typography.body-md}`.

**`pricing-tier-card`** — Standard tier card. Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px). Carries the plan name in `{typography.title-lg}`, price in `{typography.display-sm}`, feature checklist in `{typography.body-md}`, and a `{component.button-primary}` at the bottom.

**`pricing-tier-card-featured`** — The featured tier (typically "Teams"). Background flips to `{colors.surface-dark}` (#101010), text inverts to `{colors.on-dark}`. The dark surface IS the featured-tier signal — no accent border, no badge, no scale shift.

### Inputs & Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}` (8px), padding 10px × 14px, height 40px. 1px hairline border in `{colors.hairline}`.

**`text-input-focused`** — Focus state. Border thickens or shifts to `{colors.ink}` for emphasis.

### Tags / Badges

**`badge-pill`** — Small pill label used for category tags ("Product", "Article", "New") and pastel-fill avatar substitutes. Background `{colors.surface-card}` or one of the badge pastels (`{colors.badge-orange}`, `{colors.badge-pink}`, etc.), text `{colors.ink}`, type `{typography.caption}` (13px / 500), rounded `{rounded.pill}`, padding 4px × 12px.

**`avatar-circle`** — 36px diameter, rounded `{rounded.full}`. Either holds a photo or a pastel fill with initials in `{typography.caption}`.

**`rating-stars`** — Inline star rating in `{colors.badge-orange}` (#fb923c). Used near testimonial avatars to display a 5-star satisfaction score.

### Tab / Filter

**`category-tab`** + **`category-tab-active`** — Used inside the nav-pill-group. Inactive: transparent background, `{colors.muted}` text. Active: `{colors.canvas}` background, `{colors.ink}` text, subtle drop shadow inside the pill-group wrapper. Padding 8px × 14px, rounded `{rounded.md}`.

### CTA / Footer

**`cta-band-light`** — A pre-footer "Smarter, simpler scheduling" CTA card. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding `{spacing.xxl}` (48px). Carries an h2 in `{typography.display-sm}`, a sub-line, and a `{component.button-primary}` centered.

**`footer`** — Dark navy footer that closes every page. Background `{colors.surface-dark}` (#101010), text `{colors.on-dark-soft}`. 4-column link list at desktop covering Product / Solutions / Company / Resources. Vertical padding 64px. The Cal.com wordmark sits at the top-left in `{colors.on-dark}`. The footer is the only dark surface on every page — the deliberate inversion visually closes the page.', '{"sourcePath":"docs/design-md/cal/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (#111111) for primary CTAs and h1/h2 type. Cal.com''s button is near-black, not blue.
- Use Cal Sans for every display headline. Pair with Inter body. Never blur the boundary.
- Apply negative letter-spacing on display sizes (-0.5 to -2px). Cal Sans without it reads as off-brand.
- Use `{component.feature-card}` (light gray) and `{component.product-mockup-card}` (white with chrome) deliberately — the gray cards signal "abstract feature claim", white cards signal "look at the actual product".
- Embed real product UI fragments inside marketing cards. Don''t paint marketing illustrations of the product when you can show the product itself.
- Keep avatar circles at 36px, perfect circles, sometimes with pastel fills. Avatars are the only place where badge pastels appear.
- Use `{component.nav-pill-group}` for grouped sub-nav segments. The pill-in-pill treatment is signature.
- End every page with the dark footer. The light-to-dark transition is part of the editorial rhythm.

### Don''t
- Don''t use accent colors (`{colors.brand-accent}`, badge pastels) on primary CTAs. The system is monochrome at the action layer.
- Don''t bold display weight beyond 600. Cal Sans at 700 reads as bombastic.
- Don''t use rounded radius beyond `{rounded.xl}` (16px) on cards. Larger radii read as consumer-app, not professional booking software.
- Don''t put dark surface cards anywhere except the footer and the featured pricing tier. The dark surface is a deliberate, scarce signal.
- Don''t repeat the same surface mode in two consecutive bands. Cal.com''s pacing alternates white → light-gray → white → product-mockup-card → white → dark-footer.
- Don''t add hover state styling beyond what the system already encodes — primary darkens on press; nothing else changes.', '{"sourcePath":"docs/design-md/cal/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 64→32px; hero-app-mockup-card stacks below content; feature grids 1-up; pricing 1-up; footer 4 cols → 1 |
| Tablet | 768–1024px | Top nav stays horizontal but tightens; nav-pill-group wraps; feature cards 2-up; pricing 2-up |
| Desktop | 1024–1440px | Full top-nav with all menu items; 3-up feature cards; 4-up pricing tiers |
| Wide | > 1440px | Same as desktop with more outer breathing room; max content width caps at 1200px |

### Touch Targets
- `{component.button-primary}` at minimum 40 × 40px.
- `{component.button-icon-circular}` at exactly 36 × 36 — slightly under WCAG''s 44 × 44 but the centered icon and full-circle silhouette compensate.
- `{component.text-input}` height is 40px.
- `{component.category-tab}` rendered inside nav-pill-group has 8 × 14 padding; effective tap area meets 44px+ with the surrounding pill.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px; menu opens as a full-screen sheet.
- Hero band''s 7-5 grid collapses to single-column on mobile — h1 + sub-head + buttons first, then the app-mockup card below.
- Feature grids reduce columns rather than scaling cards down.
- Pricing tier cards collapse 4 → 2 → 1; featured-tier dark surface stays visually distinct at every breakpoint.
- Nav-pill-group wraps to multi-row on tablet if the segments don''t fit horizontally.
- Avatar + testimonial card layouts stay grid-aligned at every breakpoint.

### Image Behavior
- Product UI fragments inside cards retain native aspect ratios; the cards themselves resize.
- Avatar photos crop to circles at every breakpoint.
- Hero app-mockup card scales proportionally on mobile — the calendar grid stays legible.', '{"sourcePath":"docs/design-md/cal/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.feature-card}`, `{component.pricing-tier-card-featured}`).
2. Variants of an existing component (`-active`, `-disabled`, `-focused`) live as separate entries in `components:`.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay Cal Sans 600 with negative letter-spacing. Body stays Inter 400. The trinity does not blur.
6. The dark footer is the only dark surface on most pages. Don''t add other dark cards casually.
7. When in doubt about emphasis: bigger Cal Sans before bolder Cal Sans.', '{"sourcePath":"docs/design-md/cal/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- The dembrandt frequency analyzer captured `Buttons: 0 variants` — Cal.com renders most CTAs as styled `<a>` link elements rather than `<button>` tags, which dembrandt''s button selector doesn''t capture. Button styles are documented from screenshot ground-truth + standard Cal Sans / Inter baselines.
- Cal Sans is licensed to Cal.com and not available as a public web font; substitutes are documented in the typography section.
- The badge pastel set (orange / pink / violet / emerald) is documented from observed avatar fill colors; exact hex values may shift seasonally.
- Animation and transition timings (calendar slot picker, schedule confirmation, integration grid hover-reveal) are not in scope.
- Form validation states beyond `{component.text-input-focused}` are not extracted — error / success states would need a sign-up or booking flow to confirm.
- The actual booking widget surface (cal.com/{username}) is the product, not a marketing surface; its spec is out of scope.
- Avatar photos in testimonial sections sometimes carry pastel circular fills with initials instead of photographs; both treatments coexist on the same page.', '{"sourcePath":"docs/design-md/cal/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_1', '#111111', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_2', '#242424', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_3', '#e5e7eb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_4', '#374151', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_5', '#6b7280', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_6', '#898989', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_7', '#f3f4f6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_8', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_9', '#f8f9fa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_10', '#f5f5f5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_11', '#101010', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_12', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_13', '#a1a1aa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_14', '#3b82f6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_15', '#10b981', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_16', '#f59e0b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_17', '#ef4444', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_18', '#fb923c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_19', '#ec4899', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_20', '#8b5cf6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'color', 'color_21', '#34d399', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'typography', 'font_1', 'Cal Sans, Inter, sans-serif', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'typography', 'font_2', 'Inter, sans-serif', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md'), 'typography', 'font_3', 'JetBrains Mono, ui-monospace, monospace', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/cal/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/cal/DESIGN.md';


-- Claude
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Claude', 'claude', 'design-reference', null, now())
  on conflict (slug) do update
    set name = excluded.name,
        category = excluded.category,
        updated_at = now()
  returning id
),
d as (
  insert into design_documents (
    brand_id,
    source_type,
    original_filename,
    original_blob_url,
    status,
    raw_markdown,
    updated_at
  )
  select id, 'markdown_seed', 'docs/design-md/claude/DESIGN.md', null, 'seeded', '---
version: alpha
name: Claude-design-analysis
description: A warm-canvas editorial interface for Anthropic''s Claude product. The system anchors on a tinted cream canvas with serif display headlines, warm coral CTAs, and dark navy product surfaces (code editor mockups, model showcase cards). Brand voltage comes from the cream/coral pairing — deliberately warm and humanist where most AI brands use cool blue + slate. Type voice runs a slab-serif display ("Copernicus" / Tiempos Headline) for h1/h2 and a humanist sans for body. The signature Anthropic black-radial-spike mark anchors the wordmark.

colors:
  primary: "#cc785c"
  primary-active: "#a9583e"
  primary-disabled: "#e6dfd8"
  ink: "#141413"
  body: "#3d3d3a"
  body-strong: "#252523"
  muted: "#6c6a64"
  muted-soft: "#8e8b82"
  hairline: "#e6dfd8"
  hairline-soft: "#ebe6df"
  canvas: "#faf9f5"
  surface-soft: "#f5f0e8"
  surface-card: "#efe9de"
  surface-cream-strong: "#e8e0d2"
  surface-dark: "#181715"
  surface-dark-elevated: "#252320"
  surface-dark-soft: "#1f1e1b"
  on-primary: "#ffffff"
  on-dark: "#faf9f5"
  on-dark-soft: "#a09d96"
  accent-teal: "#5db8a6"
  accent-amber: "#e8a55a"
  success: "#5db872"
  warning: "#d4a017"
  error: "#c64545"

typography:
  display-xl:
    fontFamily: "Copernicus, Tiempos Headline, serif"
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: -1.5px
  display-lg:
    fontFamily: "Copernicus, Tiempos Headline, serif"
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -1px
  display-md:
    fontFamily: "Copernicus, Tiempos Headline, serif"
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: -0.5px
  display-sm:
    fontFamily: "Copernicus, Tiempos Headline, serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.3px
  title-lg:
    fontFamily: "StyreneB, Inter, sans-serif"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0
  title-md:
    fontFamily: "StyreneB, Inter, sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "StyreneB, Inter, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "StyreneB, Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: "StyreneB, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: "StyreneB, Inter, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "StyreneB, Inter, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 1.5px
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  button:
    fontFamily: "StyreneB, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
  nav-link:
    fontFamily: "StyreneB, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 40px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 40px
  button-secondary-on-dark:
    backgroundColor: "{colors.surface-dark-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  button-text-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 36px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 64px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: 96px
  hero-illustration-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  product-mockup-card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  code-window-card:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code}"
    rounded: "{rounded.lg}"
    padding: 24px
  model-comparison-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-tier-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-tier-card-featured:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  callout-card-coral:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  connector-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.lg}"
    padding: 20px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 14px
    height: 40px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  cookie-consent-card:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 24px
  category-tab:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.nav-link}"
    padding: 8px 14px
    rounded: "{rounded.md}"
  category-tab-active:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.md}"
  badge-pill:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  badge-coral:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  cta-band-coral:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-sm}"
    rounded: "{rounded.lg}"
    padding: 64px
  cta-band-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-sm}"
    rounded: "{rounded.lg}"
    padding: 64px
  footer:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark-soft}"
    typography: "{typography.body-sm}"
    padding: 64px
---

## Overview

Claude.com is the warmest, most editorial interface in the AI-product category. The base atmosphere is a **tinted cream canvas** (`{colors.canvas}` — #faf9f5) — distinctly warm, deliberately not the cool gray-white that every other AI brand uses. Headlines run a **slab-serif display** ("Copernicus" / Tiempos Headline) at weight 400 with negative letter-spacing, paired with **StyreneB / Inter** body sans. The combination feels like a literary publication, not a SaaS marketing page.

Brand voltage comes from the **cream + coral pairing** — coral (`{colors.primary}` — #cc785c) is the signature Anthropic accent, used on every primary CTA, on the brand wordmark, and on full-bleed callout cards. The coral is warm, slightly muted, never cyan/blue — a deliberate counter-positioning against OpenAI''s cool slate, Google''s saturated blue, and Microsoft''s corporate cyan.

The system has three surface modes that alternate page-by-page:
1. **Cream canvas** (`{colors.canvas}`) — default body floor
2. **Light cream cards** (`{colors.surface-card}`) — feature card backgrounds
3. **Dark navy product surfaces** (`{colors.surface-dark}`) — code editor mockups, model showcase cards, pre-footer CTAs, footer itself

The dark surfaces are where Claude shows its product chrome — code blocks, terminal output, model comparison tables, agentic-flow diagrams. The cream-to-dark contrast is the page''s pacing rhythm.

**Key Characteristics:**
- Warm cream canvas (`{colors.canvas}` — #faf9f5) with dark warm-ink text (`{colors.ink}` — #141413). The brand''s defining color choice.
- Coral primary CTA (`{colors.primary}` — #cc785c). Used scarcely on individual buttons, generously on full-bleed coral callout cards.
- Slab-serif display headlines via Copernicus / Tiempos Headline at weight 400 with negative letter-spacing. Pairs with humanist sans body for a literary editorial voice.
- Dark navy product mockup cards (`{colors.surface-dark}` — #181715) carrying code blocks, terminal panels, model comparison data — the brand shows the product chrome at scale rather than abstract marketing illustrations.
- Light cream feature cards (`{colors.surface-card}` — #efe9de) — slightly darker than canvas, used for content-driven feature explanations.
- Anthropic radial-spike mark — a small black asterisk-like glyph (4-spoke radial) — appears as the brand wordmark prefix and as a content marker.
- Border radius is hierarchical: `{rounded.md}` (8px) for buttons + inputs, `{rounded.lg}` (12px) for content + product cards, `{rounded.xl}` (16px) for the hero illustration container, `{rounded.pill}` for badges.
- Section rhythm `{spacing.section}` (96px) — modern-SaaS standard. Internal card padding stays generous at `{spacing.xl}` (32px).

## Colors

### Brand & Accent
- **Coral / Primary** (`{colors.primary}` — #cc785c): The signature Anthropic warm coral. Used on every primary CTA background, on full-bleed coral callout cards, on the brand wordmark accent. The most-recognized Anthropic color outside of the spike-mark logo.
- **Coral Active** (`{colors.primary-active}` — #a9583e): The press / hover-darker variant.
- **Coral Disabled** (`{colors.primary-disabled}` — #e6dfd8): A desaturated cream-tinted disabled state.
- **Accent Teal** (`{colors.accent-teal}` — #5db8a6): Used sparingly on secondary product surfaces (terminal status indicators, "active connection" dots in connectors page).
- **Accent Amber** (`{colors.accent-amber}` — #e8a55a): A small companion warm-tone used on category badges and inline highlights.

### Surface
- **Canvas** (`{colors.canvas}` — #faf9f5): The default page floor. Tinted cream — warm, deliberately not pure white.
- **Surface Soft** (`{colors.surface-soft}` — #f5f0e8): Section dividers, very-soft band backgrounds.
- **Surface Card** (`{colors.surface-card}` — #efe9de): Feature cards, content cards. One step darker than canvas.
- **Surface Cream Strong** (`{colors.surface-cream-strong}` — #e8e0d2): A strongest-cream variant used on selected category tabs and emphasized section bands.
- **Surface Dark** (`{colors.surface-dark}` — #181715): Code editor mockups, model showcase cards, footer. The dominant dark surface.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #252320): Elevated cards inside dark bands (settings panels in mockups).
- **Surface Dark Soft** (`{colors.surface-dark-soft}` — #1f1e1b): Slightly lighter dark, used for code block backgrounds inside larger dark cards.
- **Hairline** (`{colors.hairline}` — #e6dfd8): The 1px border tone on cream surfaces. Same hex as `{colors.primary-disabled}` — borders feel like one elevation step rather than ink lines.
- **Hairline Soft** (`{colors.hairline-soft}` — #ebe6df): Barely-visible divider used inside the same band.

### Text
- **Ink** (`{colors.ink}` — #141413): All headlines and primary text. Warm dark, slightly off-pure-black.
- **Body Strong** (`{colors.body-strong}` — #252523): Emphasized paragraphs, lead text.
- **Body** (`{colors.body}` — #3d3d3a): Default running-text color.
- **Muted** (`{colors.muted}` — #6c6a64): Sub-headings, breadcrumbs, footer-adjacent secondary text.
- **Muted Soft** (`{colors.muted-soft}` — #8e8b82): Captions, fine-print, copyright lines.
- **On Primary** (`{colors.on-primary}` — #ffffff): Text on coral buttons.
- **On Dark** (`{colors.on-dark}` — #faf9f5): Cream-tinted white used on dark surfaces (echoes the canvas tone).
- **On Dark Soft** (`{colors.on-dark-soft}` — #a09d96): Footer body text, secondary labels in dark mockups.

### Semantic
- **Success** (`{colors.success}` — #5db872): Green status dots, "available" indicators.
- **Warning** (`{colors.warning}` — #d4a017): Warning callouts (rare on marketing surfaces).
- **Error** (`{colors.error}` — #c64545): Validation errors.

## Typography

### Font Family
The system runs **Copernicus** (or **Tiempos Headline** as substitute) as the slab-serif display face for headlines, and **StyreneB** (or **Inter** as substitute) as the humanist sans for body, navigation, and UI labels. **JetBrains Mono** handles code blocks. The fallback stack walks `Tiempos Headline, Garamond, "Times New Roman", serif` for display and `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for body.

The display/body split is editorial:
- Copernicus serif (weight 400, negative tracking) → h1, h2, h3, hero display
- StyreneB sans (weight 400-500) → body, navigation, buttons, captions, labels
- JetBrains Mono → all code blocks and terminal text

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 400 | 1.05 | -1.5px | Homepage h1 ("Meet your thinking partner") — Copernicus serif |
| `{typography.display-lg}` | 48px | 400 | 1.1 | -1px | Section heads — Copernicus |
| `{typography.display-md}` | 36px | 400 | 1.15 | -0.5px | Sub-section heads, model names — Copernicus |
| `{typography.display-sm}` | 28px | 400 | 1.2 | -0.3px | Pricing tier names, callout headlines — Copernicus |
| `{typography.title-lg}` | 22px | 500 | 1.3 | 0 | Pricing plan size labels — StyreneB |
| `{typography.title-md}` | 18px | 500 | 1.4 | 0 | Feature card titles, intro paragraphs |
| `{typography.title-sm}` | 16px | 500 | 1.4 | 0 | Connector tile titles, list labels |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Default running-text — StyreneB |
| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Footer body, fine-print |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
| `{typography.caption-uppercase}` | 12px | 500 | 1.4 | 1.5px | Category tags, "NEW" badges |
| `{typography.code}` | 14px | 400 | 1.6 | 0 | Code blocks — JetBrains Mono |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | Standard button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
Display sizes use weight 400 (regular), never bold. Negative letter-spacing (-0.3 to -1.5px) is essential — Copernicus without it reads as off-brand. The serif character is what gives Anthropic its literary, considered voice; switching to a sans-serif display would make Claude feel like every other AI tool.

Body type stays at weight 400 for paragraphs, weight 500 for labels and emphasized phrases. The sans body is humanist (StyreneB) — never geometric. Inter is an acceptable substitute because of its similar humanist proportions; Helvetica or Arial would be too neutral and break the warm-editorial feel.

### Note on Font Substitutes
If Copernicus / Tiempos Headline is unavailable, **Cormorant Garamond** at weight 500 with -0.02em letter-spacing is the closest open-source approximation. **EB Garamond** is a fallback. For StyreneB, **Inter** is the closest match — both are humanist sans designed for screen reading. **Söhne** is another close alternative if licensed.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) — modern-SaaS rhythm.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards, pricing tier cards, model comparison cards; `{spacing.lg}` (24px) for code-window cards and connector tiles.
- **Callout / CTA bands:** `{spacing.xxl}` (48px) inside coral callout cards; 64px inside the larger dark CTA band.

### Grid & Container
- **Max content width:** ~1200px centered.
- **Editorial body:** Single 12-column grid; hero often uses 6/6 split (h1 left, illustration right).
- **Feature card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Connector tile grids:** 4-up or 6-up at desktop, 2-up at tablet, 1-up at mobile.
- **Pricing grid:** 3-up at desktop (Free / Pro / Team / Enterprise often), 1-up at mobile.

### Whitespace Philosophy
The cream canvas + serif display + generous internal padding create an editorial pacing — Claude reads like a long-form magazine column rather than a marketing template. Whitespace between bands stays uniform at 96px; whitespace inside cards is generous (32px), letting type breathe.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero bands |
| Soft hairline | 1px `{colors.hairline}` border | Inputs, sub-nav, occasionally on cards |
| Cream card | `{colors.surface-card}` background — no shadow | Feature cards, content cards |
| Dark surface card | `{colors.surface-dark}` background — no shadow | Code editor mockups, model showcase cards |
| Subtle drop shadow | Faint shadow at low alpha | Hover-elevated states (the system uses `0 1px 3px rgba(20,20,19,0.08)` rarely) |

The elevation philosophy is **color-block first, shadow rare**. Most depth comes from the cream-vs-dark surface contrast. Shadows are minimal. The dark surface mockups have their own internal product chrome (code editor scrollbars, line numbers, syntax highlighting) which adds detail without needing external shadows.

### Decorative Depth
- The Anthropic spike-mark glyph (4-spoke radial asterisk) appears as a small black mark in the brand wordmark and inline as a content marker.
- Code editor mockups carry their own internal depth: syntax-highlighted text in muted blues / oranges / grays, line numbers in `{colors.muted-soft}`, status bars at the bottom in `{colors.surface-dark-elevated}`.
- Some hero illustrations use simple line-art with coral and dark-navy strokes on cream — minimal, hand-drawn-feeling, never photorealistic.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Reserved for badge accents and tiny dropdowns |
| `{rounded.sm}` | 6px | Small inline buttons, dropdown items |
| `{rounded.md}` | 8px | Standard CTA buttons, text inputs, category tabs |
| `{rounded.lg}` | 12px | Content cards (feature, pricing, code-window, model-comparison) |
| `{rounded.xl}` | 16px | Hero illustration container, the larger marquee components |
| `{rounded.pill}` | 9999px | Badge pills, "NEW" tags |
| `{rounded.full}` | 9999px / 50% | Avatar substitutes, icon buttons |

### Photography & Illustrations
Claude''s hero rarely uses photography. Instead it uses:
- Simple line-art illustrations with coral + dark-navy strokes on the cream canvas
- Code editor mockups (the dominant "hero" treatment on developer-focused pages)
- Terminal output mockups with monospace text on dark
- Model comparison cards (Opus / Sonnet / Haiku) with abstract geometric thumbnails

When photography is used (rare — mostly testimonials), avatars crop to perfect circles at 40px diameter.

## Components

### Top Navigation

**`top-nav`** — Cream nav bar pinned to the top of every page. 64px tall, `{colors.canvas}` background. Carries the Anthropic spike-mark + "Claude" wordmark at left, primary horizontal menu (Product, Solutions, Use Cases, Pricing, Research, Company) center-left, right-side cluster with "Sign in" text-link, "Try Claude" `{component.button-primary}` (coral). Menu items in `{typography.nav-link}` (StyreneB 14px / 500).

### Buttons

**`button-primary`** — The signature coral CTA. Background `{colors.primary}` (#cc785c), text `{colors.on-primary}` (white), type `{typography.button}` (StyreneB 14px / 500), padding 12px × 20px, height 40px, rounded `{rounded.md}` (8px). Active state `button-primary-active` darkens to `{colors.primary-active}` (#a9583e).

**`button-secondary`** — Cream button with hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px hairline border, same padding + height + radius as primary.

**`button-secondary-on-dark`** — Used over `{colors.surface-dark}` cards. Background `{colors.surface-dark-elevated}` (#252320), text `{colors.on-dark}`. Stays dark — the system never inverts to a light secondary on dark surfaces.

**`button-text-link`** — Inline text button, no background. Used for "Sign in" in the top nav and inline CTA links.

**`button-icon-circular`** — 36px circular icon button. Background `{colors.canvas}`, hairline border, ink-color icon. Used for carousel arrows, share, "view more".

**`text-link`** — Inline body links in `{colors.primary}` (the coral). Underlined on press; the coral inline link is one of the system''s most distinctive small details.

### Cards & Containers

**`hero-band`** — Cream-canvas hero with a 6-6 grid: h1 + sub-headline + button row on the left, hero illustration card or product mockup card on the right. Vertical padding `{spacing.section}` (96px).

**`hero-illustration-card`** — A larger card holding the hero''s right-side artifact — sometimes a coral-stroke line illustration on cream background, sometimes a dark code editor mockup. Background `{colors.canvas}` or `{colors.surface-dark}` depending on context, rounded `{rounded.xl}` (16px).

**`feature-card`** — Used in 3-up feature grids. Background `{colors.surface-card}` (#efe9de — slightly darker cream), rounded `{rounded.lg}` (12px), internal padding `{spacing.xl}` (32px). Carries a small icon at top, an `{typography.title-md}` headline, and a body description in `{typography.body-md}`.

**`product-mockup-card-dark`** — Dark navy card showing actual Claude product chrome (chat interface, code editor, agent controls). Background `{colors.surface-dark}`, rounded `{rounded.lg}`, internal padding `{spacing.xl}` (32px). Carries text labels in `{colors.on-dark}` and product UI fragments below.

**`code-window-card`** — A specialized dark card showing a code editor with line numbers, syntax-highlighted code in `{typography.code}` (JetBrains Mono), and sometimes a "Run" button or terminal output panel below. Background `{colors.surface-dark}` with `{colors.surface-dark-soft}` for the inner code block, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). The signature visual element of Claude Code product pages.

**`model-comparison-card`** — Used on the homepage''s "Which problem are you up against?" section comparing Opus / Sonnet / Haiku. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, internal padding `{spacing.xl}` (32px). Carries the model name, a short capability blurb, and a `{component.text-link}` to learn more.

**`pricing-tier-card`** — Standard tier card. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px). Carries the plan name in `{typography.title-lg}` (StyreneB), price in `{typography.display-sm}` (Copernicus serif!), feature checklist in `{typography.body-md}`, and a `{component.button-primary}` at the bottom.

**`pricing-tier-card-featured`** — The featured tier (typically "Pro" or "Team"). Background flips to `{colors.surface-dark}`, text inverts to `{colors.on-dark}`. The dark surface IS the featured-tier signal.

**`callout-card-coral`** — A full-bleed coral card carrying a major call-to-action. Background `{colors.primary}` (#cc785c), text `{colors.on-primary}` (white), rounded `{rounded.lg}`, padding `{spacing.xxl}` (48px). The coral surface IS the voltage; the CTA inside uses an inverted button style (cream/canvas button on coral).

**`connector-tile`** — Used on the connectors page''s integration grid. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding 20px. Each tile carries a logo at top, a `{typography.title-sm}` connector name, and a short description.

### Inputs & Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}` (8px), padding 10px × 14px, height 40px. 1px hairline border in `{colors.hairline}`.

**`text-input-focused`** — Focus state. Border thickens or shifts to `{colors.primary}` (coral) for emphasis. Carries a 3px coral-at-15%-alpha outer ring.

**`cookie-consent-card`** — Bottom-right floating dark cookie banner. Background `{colors.surface-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). One of the few places dark surface appears at small scale on cream pages.

### Tags / Badges

**`badge-pill`** — Small pill label used for category tags. Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.caption}` (13px / 500), rounded `{rounded.pill}`, padding 4px × 12px.

**`badge-coral`** — Coral-fill badge for "NEW", "BETA", featured highlights. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.caption-uppercase}` (12px / 500 / 1.5px tracking), rounded `{rounded.pill}`, padding 4px × 12px.

### Tab / Filter

**`category-tab`** + **`category-tab-active`** — Used in sub-nav rows on solutions / connectors pages. Inactive: transparent background, `{colors.muted}` text. Active: `{colors.surface-card}` background, `{colors.ink}` text. Padding 8px × 14px, rounded `{rounded.md}`.

### CTA / Footer

**`cta-band-coral`** — A pre-footer "Try Claude" CTA card. Full-width coral fill, white type, rounded `{rounded.lg}`, padding 64px. Carries an h2 in `{typography.display-sm}` (still serif!), a sub-line, and a cream-button CTA.

**`cta-band-dark`** — Alternative pre-footer band on developer-focused pages. Background `{colors.surface-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding 64px. Often pairs with a code-window card.

**`footer`** — Dark navy footer that closes every page. Background `{colors.surface-dark}` (#181715), text `{colors.on-dark-soft}`. 4-column link list at desktop covering Product / Company / Resources / Legal. Vertical padding 64px. The Anthropic spike-mark + "Anthropic" wordmark sits at the top in `{colors.on-dark}`. The footer never inverts.

## Do''s and Don''ts

### Do
- Anchor every page on the cream canvas. Pure white reads as "any other AI tool"; the warm tint is the brand differentiator.
- Use Copernicus serif for every display headline. Pair with StyreneB sans body. Negative letter-spacing on display sizes is non-negotiable.
- Reserve `{colors.primary}` (coral) for primary CTAs and full-bleed `{component.callout-card-coral}` moments. Don''t paint accent moments coral elsewhere.
- Use `{component.product-mockup-card-dark}` and `{component.code-window-card}` to show actual Claude product chrome. Don''t paint marketing illustrations of code when you can show real code.
- Pair `{component.feature-card}` (cream) with `{component.product-mockup-card-dark}` (navy) in alternating bands. The cream-to-dark rhythm is the brand''s pacing mechanism.
- Use the Anthropic spike-mark glyph as the brand wordmark prefix. Never invert the mark to white-on-dark within the wordmark itself.
- Apply `{spacing.section}` (96px) between major bands.

### Don''t
- Don''t use cool grays or pure white for canvas. Cream is the brand.
- Don''t bold serif display weight. Copernicus at 700 reads as bombastic; the system stays at 400.
- Don''t use cool blue or saturated cyan as a brand accent. The coral is the brand voltage.
- Don''t put coral everywhere. The coral is scarce on individual elements and generous only on full-bleed coral callout cards.
- Don''t use Inter for display headlines. The serif character is the brand voice.
- Don''t repeat the same surface mode in two consecutive bands. The pacing alternates: cream → cream-card → dark-mockup → cream → coral-callout → dark-footer.
- Don''t add hover state styling beyond what the system already encodes — primary darkens on press; nothing else changes.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 64→32px; hero-illustration-card stacks below content; feature grids 1-up; connector tiles 2-up; pricing 1-up; footer 4 cols → 1 |
| Tablet | 768–1024px | Top nav stays horizontal but tightens; feature cards 2-up; connector tiles 3-up; pricing 2-up |
| Desktop | 1024–1440px | Full top-nav with all menu items; 3-up feature cards; 4-up or 6-up connector tiles; 3-up pricing tiers |
| Wide | > 1440px | Same as desktop with more outer breathing room; max content width caps at 1200px |

### Touch Targets
- `{component.button-primary}` at minimum 40 × 40px.
- `{component.button-icon-circular}` at exactly 36 × 36 — slightly under WCAG 44 but visually centered.
- `{component.text-input}` height is 40px.
- Connector tile entire card area is tappable; effective tap area >> 44px.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px; menu opens as a full-screen cream sheet.
- Hero band''s 6-6 grid collapses to single-column on mobile — h1 + sub-head + buttons first, then the illustration / mockup card below.
- Feature grids reduce columns rather than scaling cards down.
- Pricing tier cards collapse 4 → 2 → 1; featured-tier dark surface stays visually distinct at every breakpoint.
- Code-window cards retain code legibility at every breakpoint by allowing horizontal scroll within the card rather than wrapping code lines.

### Image Behavior
- Code blocks inside dark mockups stay at fixed font-size; horizontal scroll on mobile rather than wrapping.
- Hero illustrations scale proportionally; line-art strokes thin slightly on mobile.
- Avatar photos in testimonials crop to circles at every breakpoint.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.feature-card}`, `{component.code-window-card}`).
2. Variants of an existing component (`-active`, `-disabled`, `-focused`) live as separate entries in `components:`.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay Copernicus serif 400 with negative tracking. Body stays StyreneB / Inter 400. The split is unbreakable.
6. Cream + coral + dark navy is the trinity. Don''t introduce a fourth surface tone (no purple cards, no green sections).
7. When in doubt about emphasis: bigger Copernicus serif before bolder weight.

## Known Gaps

- Copernicus and StyreneB are licensed Anthropic typefaces and not available as public web fonts. Substitutes (Tiempos Headline / Cormorant Garamond / EB Garamond for serif; Inter / Söhne for sans) are documented in the typography section.
- The Anthropic radial-spike-mark is a brand glyph rendered as inline SVG; it''s not formalized as a system token here. Treat it as a logo asset.
- Animation and transition timings (chat message reveal, code block typewriter effect on the homepage, agentic-flow diagram animations) are not in scope.
- Form validation states beyond `{component.text-input-focused}` are not extracted — error / success states would need a sign-up or feedback flow to confirm.
- The actual Claude product surface (claude.ai chat interface) shares some tokens with the marketing site but adds many product-specific components (chat bubbles, message tools, file upload chips, conversation history sidebar) that are out of scope for this marketing-surface document.
- The "agent" / "computer use" demo cards on certain pages display animated Claude controlling a browser — the static screenshot doesn''t fully capture the animation chrome.
', now()
  from b
  on conflict (brand_id, original_filename) do update
    set status = 'seeded',
        raw_markdown = excluded.raw_markdown,
        updated_at = now()
  returning id
),
deleted_sections as (
  delete from design_sections where document_id = (select id from d)
),
deleted_tokens as (
  delete from design_tokens where document_id = (select id from d)
)
insert into design_sections (document_id, category, original_title, normalized_title, content_markdown, content_json, confidence, sort_order)
values
((select id from d), 'overview', 'Overview', 'overview', '## Overview

Claude.com is the warmest, most editorial interface in the AI-product category. The base atmosphere is a **tinted cream canvas** (`{colors.canvas}` — #faf9f5) — distinctly warm, deliberately not the cool gray-white that every other AI brand uses. Headlines run a **slab-serif display** ("Copernicus" / Tiempos Headline) at weight 400 with negative letter-spacing, paired with **StyreneB / Inter** body sans. The combination feels like a literary publication, not a SaaS marketing page.

Brand voltage comes from the **cream + coral pairing** — coral (`{colors.primary}` — #cc785c) is the signature Anthropic accent, used on every primary CTA, on the brand wordmark, and on full-bleed callout cards. The coral is warm, slightly muted, never cyan/blue — a deliberate counter-positioning against OpenAI''s cool slate, Google''s saturated blue, and Microsoft''s corporate cyan.

The system has three surface modes that alternate page-by-page:
1. **Cream canvas** (`{colors.canvas}`) — default body floor
2. **Light cream cards** (`{colors.surface-card}`) — feature card backgrounds
3. **Dark navy product surfaces** (`{colors.surface-dark}`) — code editor mockups, model showcase cards, pre-footer CTAs, footer itself

The dark surfaces are where Claude shows its product chrome — code blocks, terminal output, model comparison tables, agentic-flow diagrams. The cream-to-dark contrast is the page''s pacing rhythm.

**Key Characteristics:**
- Warm cream canvas (`{colors.canvas}` — #faf9f5) with dark warm-ink text (`{colors.ink}` — #141413). The brand''s defining color choice.
- Coral primary CTA (`{colors.primary}` — #cc785c). Used scarcely on individual buttons, generously on full-bleed coral callout cards.
- Slab-serif display headlines via Copernicus / Tiempos Headline at weight 400 with negative letter-spacing. Pairs with humanist sans body for a literary editorial voice.
- Dark navy product mockup cards (`{colors.surface-dark}` — #181715) carrying code blocks, terminal panels, model comparison data — the brand shows the product chrome at scale rather than abstract marketing illustrations.
- Light cream feature cards (`{colors.surface-card}` — #efe9de) — slightly darker than canvas, used for content-driven feature explanations.
- Anthropic radial-spike mark — a small black asterisk-like glyph (4-spoke radial) — appears as the brand wordmark prefix and as a content marker.
- Border radius is hierarchical: `{rounded.md}` (8px) for buttons + inputs, `{rounded.lg}` (12px) for content + product cards, `{rounded.xl}` (16px) for the hero illustration container, `{rounded.pill}` for badges.
- Section rhythm `{spacing.section}` (96px) — modern-SaaS standard. Internal card padding stays generous at `{spacing.xl}` (32px).', '{"sourcePath":"docs/design-md/claude/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Coral / Primary** (`{colors.primary}` — #cc785c): The signature Anthropic warm coral. Used on every primary CTA background, on full-bleed coral callout cards, on the brand wordmark accent. The most-recognized Anthropic color outside of the spike-mark logo.
- **Coral Active** (`{colors.primary-active}` — #a9583e): The press / hover-darker variant.
- **Coral Disabled** (`{colors.primary-disabled}` — #e6dfd8): A desaturated cream-tinted disabled state.
- **Accent Teal** (`{colors.accent-teal}` — #5db8a6): Used sparingly on secondary product surfaces (terminal status indicators, "active connection" dots in connectors page).
- **Accent Amber** (`{colors.accent-amber}` — #e8a55a): A small companion warm-tone used on category badges and inline highlights.

### Surface
- **Canvas** (`{colors.canvas}` — #faf9f5): The default page floor. Tinted cream — warm, deliberately not pure white.
- **Surface Soft** (`{colors.surface-soft}` — #f5f0e8): Section dividers, very-soft band backgrounds.
- **Surface Card** (`{colors.surface-card}` — #efe9de): Feature cards, content cards. One step darker than canvas.
- **Surface Cream Strong** (`{colors.surface-cream-strong}` — #e8e0d2): A strongest-cream variant used on selected category tabs and emphasized section bands.
- **Surface Dark** (`{colors.surface-dark}` — #181715): Code editor mockups, model showcase cards, footer. The dominant dark surface.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #252320): Elevated cards inside dark bands (settings panels in mockups).
- **Surface Dark Soft** (`{colors.surface-dark-soft}` — #1f1e1b): Slightly lighter dark, used for code block backgrounds inside larger dark cards.
- **Hairline** (`{colors.hairline}` — #e6dfd8): The 1px border tone on cream surfaces. Same hex as `{colors.primary-disabled}` — borders feel like one elevation step rather than ink lines.
- **Hairline Soft** (`{colors.hairline-soft}` — #ebe6df): Barely-visible divider used inside the same band.

### Text
- **Ink** (`{colors.ink}` — #141413): All headlines and primary text. Warm dark, slightly off-pure-black.
- **Body Strong** (`{colors.body-strong}` — #252523): Emphasized paragraphs, lead text.
- **Body** (`{colors.body}` — #3d3d3a): Default running-text color.
- **Muted** (`{colors.muted}` — #6c6a64): Sub-headings, breadcrumbs, footer-adjacent secondary text.
- **Muted Soft** (`{colors.muted-soft}` — #8e8b82): Captions, fine-print, copyright lines.
- **On Primary** (`{colors.on-primary}` — #ffffff): Text on coral buttons.
- **On Dark** (`{colors.on-dark}` — #faf9f5): Cream-tinted white used on dark surfaces (echoes the canvas tone).
- **On Dark Soft** (`{colors.on-dark-soft}` — #a09d96): Footer body text, secondary labels in dark mockups.

### Semantic
- **Success** (`{colors.success}` — #5db872): Green status dots, "available" indicators.
- **Warning** (`{colors.warning}` — #d4a017): Warning callouts (rare on marketing surfaces).
- **Error** (`{colors.error}` — #c64545): Validation errors.', '{"sourcePath":"docs/design-md/claude/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The system runs **Copernicus** (or **Tiempos Headline** as substitute) as the slab-serif display face for headlines, and **StyreneB** (or **Inter** as substitute) as the humanist sans for body, navigation, and UI labels. **JetBrains Mono** handles code blocks. The fallback stack walks `Tiempos Headline, Garamond, "Times New Roman", serif` for display and `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for body.

The display/body split is editorial:
- Copernicus serif (weight 400, negative tracking) → h1, h2, h3, hero display
- StyreneB sans (weight 400-500) → body, navigation, buttons, captions, labels
- JetBrains Mono → all code blocks and terminal text

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 400 | 1.05 | -1.5px | Homepage h1 ("Meet your thinking partner") — Copernicus serif |
| `{typography.display-lg}` | 48px | 400 | 1.1 | -1px | Section heads — Copernicus |
| `{typography.display-md}` | 36px | 400 | 1.15 | -0.5px | Sub-section heads, model names — Copernicus |
| `{typography.display-sm}` | 28px | 400 | 1.2 | -0.3px | Pricing tier names, callout headlines — Copernicus |
| `{typography.title-lg}` | 22px | 500 | 1.3 | 0 | Pricing plan size labels — StyreneB |
| `{typography.title-md}` | 18px | 500 | 1.4 | 0 | Feature card titles, intro paragraphs |
| `{typography.title-sm}` | 16px | 500 | 1.4 | 0 | Connector tile titles, list labels |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Default running-text — StyreneB |
| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Footer body, fine-print |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
| `{typography.caption-uppercase}` | 12px | 500 | 1.4 | 1.5px | Category tags, "NEW" badges |
| `{typography.code}` | 14px | 400 | 1.6 | 0 | Code blocks — JetBrains Mono |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | Standard button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
Display sizes use weight 400 (regular), never bold. Negative letter-spacing (-0.3 to -1.5px) is essential — Copernicus without it reads as off-brand. The serif character is what gives Anthropic its literary, considered voice; switching to a sans-serif display would make Claude feel like every other AI tool.

Body type stays at weight 400 for paragraphs, weight 500 for labels and emphasized phrases. The sans body is humanist (StyreneB) — never geometric. Inter is an acceptable substitute because of its similar humanist proportions; Helvetica or Arial would be too neutral and break the warm-editorial feel.

### Note on Font Substitutes
If Copernicus / Tiempos Headline is unavailable, **Cormorant Garamond** at weight 500 with -0.02em letter-spacing is the closest open-source approximation. **EB Garamond** is a fallback. For StyreneB, **Inter** is the closest match — both are humanist sans designed for screen reading. **Söhne** is another close alternative if licensed.', '{"sourcePath":"docs/design-md/claude/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) — modern-SaaS rhythm.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards, pricing tier cards, model comparison cards; `{spacing.lg}` (24px) for code-window cards and connector tiles.
- **Callout / CTA bands:** `{spacing.xxl}` (48px) inside coral callout cards; 64px inside the larger dark CTA band.

### Grid & Container
- **Max content width:** ~1200px centered.
- **Editorial body:** Single 12-column grid; hero often uses 6/6 split (h1 left, illustration right).
- **Feature card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Connector tile grids:** 4-up or 6-up at desktop, 2-up at tablet, 1-up at mobile.
- **Pricing grid:** 3-up at desktop (Free / Pro / Team / Enterprise often), 1-up at mobile.

### Whitespace Philosophy
The cream canvas + serif display + generous internal padding create an editorial pacing — Claude reads like a long-form magazine column rather than a marketing template. Whitespace between bands stays uniform at 96px; whitespace inside cards is generous (32px), letting type breathe.', '{"sourcePath":"docs/design-md/claude/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero bands |
| Soft hairline | 1px `{colors.hairline}` border | Inputs, sub-nav, occasionally on cards |
| Cream card | `{colors.surface-card}` background — no shadow | Feature cards, content cards |
| Dark surface card | `{colors.surface-dark}` background — no shadow | Code editor mockups, model showcase cards |
| Subtle drop shadow | Faint shadow at low alpha | Hover-elevated states (the system uses `0 1px 3px rgba(20,20,19,0.08)` rarely) |

The elevation philosophy is **color-block first, shadow rare**. Most depth comes from the cream-vs-dark surface contrast. Shadows are minimal. The dark surface mockups have their own internal product chrome (code editor scrollbars, line numbers, syntax highlighting) which adds detail without needing external shadows.

### Decorative Depth
- The Anthropic spike-mark glyph (4-spoke radial asterisk) appears as a small black mark in the brand wordmark and inline as a content marker.
- Code editor mockups carry their own internal depth: syntax-highlighted text in muted blues / oranges / grays, line numbers in `{colors.muted-soft}`, status bars at the bottom in `{colors.surface-dark-elevated}`.
- Some hero illustrations use simple line-art with coral and dark-navy strokes on cream — minimal, hand-drawn-feeling, never photorealistic.', '{"sourcePath":"docs/design-md/claude/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Reserved for badge accents and tiny dropdowns |
| `{rounded.sm}` | 6px | Small inline buttons, dropdown items |
| `{rounded.md}` | 8px | Standard CTA buttons, text inputs, category tabs |
| `{rounded.lg}` | 12px | Content cards (feature, pricing, code-window, model-comparison) |
| `{rounded.xl}` | 16px | Hero illustration container, the larger marquee components |
| `{rounded.pill}` | 9999px | Badge pills, "NEW" tags |
| `{rounded.full}` | 9999px / 50% | Avatar substitutes, icon buttons |

### Photography & Illustrations
Claude''s hero rarely uses photography. Instead it uses:
- Simple line-art illustrations with coral + dark-navy strokes on the cream canvas
- Code editor mockups (the dominant "hero" treatment on developer-focused pages)
- Terminal output mockups with monospace text on dark
- Model comparison cards (Opus / Sonnet / Haiku) with abstract geometric thumbnails

When photography is used (rare — mostly testimonials), avatars crop to perfect circles at 40px diameter.', '{"sourcePath":"docs/design-md/claude/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav`** — Cream nav bar pinned to the top of every page. 64px tall, `{colors.canvas}` background. Carries the Anthropic spike-mark + "Claude" wordmark at left, primary horizontal menu (Product, Solutions, Use Cases, Pricing, Research, Company) center-left, right-side cluster with "Sign in" text-link, "Try Claude" `{component.button-primary}` (coral). Menu items in `{typography.nav-link}` (StyreneB 14px / 500).

### Buttons

**`button-primary`** — The signature coral CTA. Background `{colors.primary}` (#cc785c), text `{colors.on-primary}` (white), type `{typography.button}` (StyreneB 14px / 500), padding 12px × 20px, height 40px, rounded `{rounded.md}` (8px). Active state `button-primary-active` darkens to `{colors.primary-active}` (#a9583e).

**`button-secondary`** — Cream button with hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px hairline border, same padding + height + radius as primary.

**`button-secondary-on-dark`** — Used over `{colors.surface-dark}` cards. Background `{colors.surface-dark-elevated}` (#252320), text `{colors.on-dark}`. Stays dark — the system never inverts to a light secondary on dark surfaces.

**`button-text-link`** — Inline text button, no background. Used for "Sign in" in the top nav and inline CTA links.

**`button-icon-circular`** — 36px circular icon button. Background `{colors.canvas}`, hairline border, ink-color icon. Used for carousel arrows, share, "view more".

**`text-link`** — Inline body links in `{colors.primary}` (the coral). Underlined on press; the coral inline link is one of the system''s most distinctive small details.

### Cards & Containers

**`hero-band`** — Cream-canvas hero with a 6-6 grid: h1 + sub-headline + button row on the left, hero illustration card or product mockup card on the right. Vertical padding `{spacing.section}` (96px).

**`hero-illustration-card`** — A larger card holding the hero''s right-side artifact — sometimes a coral-stroke line illustration on cream background, sometimes a dark code editor mockup. Background `{colors.canvas}` or `{colors.surface-dark}` depending on context, rounded `{rounded.xl}` (16px).

**`feature-card`** — Used in 3-up feature grids. Background `{colors.surface-card}` (#efe9de — slightly darker cream), rounded `{rounded.lg}` (12px), internal padding `{spacing.xl}` (32px). Carries a small icon at top, an `{typography.title-md}` headline, and a body description in `{typography.body-md}`.

**`product-mockup-card-dark`** — Dark navy card showing actual Claude product chrome (chat interface, code editor, agent controls). Background `{colors.surface-dark}`, rounded `{rounded.lg}`, internal padding `{spacing.xl}` (32px). Carries text labels in `{colors.on-dark}` and product UI fragments below.

**`code-window-card`** — A specialized dark card showing a code editor with line numbers, syntax-highlighted code in `{typography.code}` (JetBrains Mono), and sometimes a "Run" button or terminal output panel below. Background `{colors.surface-dark}` with `{colors.surface-dark-soft}` for the inner code block, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). The signature visual element of Claude Code product pages.

**`model-comparison-card`** — Used on the homepage''s "Which problem are you up against?" section comparing Opus / Sonnet / Haiku. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, internal padding `{spacing.xl}` (32px). Carries the model name, a short capability blurb, and a `{component.text-link}` to learn more.

**`pricing-tier-card`** — Standard tier card. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px). Carries the plan name in `{typography.title-lg}` (StyreneB), price in `{typography.display-sm}` (Copernicus serif!), feature checklist in `{typography.body-md}`, and a `{component.button-primary}` at the bottom.

**`pricing-tier-card-featured`** — The featured tier (typically "Pro" or "Team"). Background flips to `{colors.surface-dark}`, text inverts to `{colors.on-dark}`. The dark surface IS the featured-tier signal.

**`callout-card-coral`** — A full-bleed coral card carrying a major call-to-action. Background `{colors.primary}` (#cc785c), text `{colors.on-primary}` (white), rounded `{rounded.lg}`, padding `{spacing.xxl}` (48px). The coral surface IS the voltage; the CTA inside uses an inverted button style (cream/canvas button on coral).

**`connector-tile`** — Used on the connectors page''s integration grid. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding 20px. Each tile carries a logo at top, a `{typography.title-sm}` connector name, and a short description.

### Inputs & Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}` (8px), padding 10px × 14px, height 40px. 1px hairline border in `{colors.hairline}`.

**`text-input-focused`** — Focus state. Border thickens or shifts to `{colors.primary}` (coral) for emphasis. Carries a 3px coral-at-15%-alpha outer ring.

**`cookie-consent-card`** — Bottom-right floating dark cookie banner. Background `{colors.surface-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). One of the few places dark surface appears at small scale on cream pages.

### Tags / Badges

**`badge-pill`** — Small pill label used for category tags. Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.caption}` (13px / 500), rounded `{rounded.pill}`, padding 4px × 12px.

**`badge-coral`** — Coral-fill badge for "NEW", "BETA", featured highlights. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.caption-uppercase}` (12px / 500 / 1.5px tracking), rounded `{rounded.pill}`, padding 4px × 12px.

### Tab / Filter

**`category-tab`** + **`category-tab-active`** — Used in sub-nav rows on solutions / connectors pages. Inactive: transparent background, `{colors.muted}` text. Active: `{colors.surface-card}` background, `{colors.ink}` text. Padding 8px × 14px, rounded `{rounded.md}`.

### CTA / Footer

**`cta-band-coral`** — A pre-footer "Try Claude" CTA card. Full-width coral fill, white type, rounded `{rounded.lg}`, padding 64px. Carries an h2 in `{typography.display-sm}` (still serif!), a sub-line, and a cream-button CTA.

**`cta-band-dark`** — Alternative pre-footer band on developer-focused pages. Background `{colors.surface-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding 64px. Often pairs with a code-window card.

**`footer`** — Dark navy footer that closes every page. Background `{colors.surface-dark}` (#181715), text `{colors.on-dark-soft}`. 4-column link list at desktop covering Product / Company / Resources / Legal. Vertical padding 64px. The Anthropic spike-mark + "Anthropic" wordmark sits at the top in `{colors.on-dark}`. The footer never inverts.', '{"sourcePath":"docs/design-md/claude/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Anchor every page on the cream canvas. Pure white reads as "any other AI tool"; the warm tint is the brand differentiator.
- Use Copernicus serif for every display headline. Pair with StyreneB sans body. Negative letter-spacing on display sizes is non-negotiable.
- Reserve `{colors.primary}` (coral) for primary CTAs and full-bleed `{component.callout-card-coral}` moments. Don''t paint accent moments coral elsewhere.
- Use `{component.product-mockup-card-dark}` and `{component.code-window-card}` to show actual Claude product chrome. Don''t paint marketing illustrations of code when you can show real code.
- Pair `{component.feature-card}` (cream) with `{component.product-mockup-card-dark}` (navy) in alternating bands. The cream-to-dark rhythm is the brand''s pacing mechanism.
- Use the Anthropic spike-mark glyph as the brand wordmark prefix. Never invert the mark to white-on-dark within the wordmark itself.
- Apply `{spacing.section}` (96px) between major bands.

### Don''t
- Don''t use cool grays or pure white for canvas. Cream is the brand.
- Don''t bold serif display weight. Copernicus at 700 reads as bombastic; the system stays at 400.
- Don''t use cool blue or saturated cyan as a brand accent. The coral is the brand voltage.
- Don''t put coral everywhere. The coral is scarce on individual elements and generous only on full-bleed coral callout cards.
- Don''t use Inter for display headlines. The serif character is the brand voice.
- Don''t repeat the same surface mode in two consecutive bands. The pacing alternates: cream → cream-card → dark-mockup → cream → coral-callout → dark-footer.
- Don''t add hover state styling beyond what the system already encodes — primary darkens on press; nothing else changes.', '{"sourcePath":"docs/design-md/claude/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 64→32px; hero-illustration-card stacks below content; feature grids 1-up; connector tiles 2-up; pricing 1-up; footer 4 cols → 1 |
| Tablet | 768–1024px | Top nav stays horizontal but tightens; feature cards 2-up; connector tiles 3-up; pricing 2-up |
| Desktop | 1024–1440px | Full top-nav with all menu items; 3-up feature cards; 4-up or 6-up connector tiles; 3-up pricing tiers |
| Wide | > 1440px | Same as desktop with more outer breathing room; max content width caps at 1200px |

### Touch Targets
- `{component.button-primary}` at minimum 40 × 40px.
- `{component.button-icon-circular}` at exactly 36 × 36 — slightly under WCAG 44 but visually centered.
- `{component.text-input}` height is 40px.
- Connector tile entire card area is tappable; effective tap area >> 44px.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px; menu opens as a full-screen cream sheet.
- Hero band''s 6-6 grid collapses to single-column on mobile — h1 + sub-head + buttons first, then the illustration / mockup card below.
- Feature grids reduce columns rather than scaling cards down.
- Pricing tier cards collapse 4 → 2 → 1; featured-tier dark surface stays visually distinct at every breakpoint.
- Code-window cards retain code legibility at every breakpoint by allowing horizontal scroll within the card rather than wrapping code lines.

### Image Behavior
- Code blocks inside dark mockups stay at fixed font-size; horizontal scroll on mobile rather than wrapping.
- Hero illustrations scale proportionally; line-art strokes thin slightly on mobile.
- Avatar photos in testimonials crop to circles at every breakpoint.', '{"sourcePath":"docs/design-md/claude/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.feature-card}`, `{component.code-window-card}`).
2. Variants of an existing component (`-active`, `-disabled`, `-focused`) live as separate entries in `components:`.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay Copernicus serif 400 with negative tracking. Body stays StyreneB / Inter 400. The split is unbreakable.
6. Cream + coral + dark navy is the trinity. Don''t introduce a fourth surface tone (no purple cards, no green sections).
7. When in doubt about emphasis: bigger Copernicus serif before bolder weight.', '{"sourcePath":"docs/design-md/claude/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Copernicus and StyreneB are licensed Anthropic typefaces and not available as public web fonts. Substitutes (Tiempos Headline / Cormorant Garamond / EB Garamond for serif; Inter / Söhne for sans) are documented in the typography section.
- The Anthropic radial-spike-mark is a brand glyph rendered as inline SVG; it''s not formalized as a system token here. Treat it as a logo asset.
- Animation and transition timings (chat message reveal, code block typewriter effect on the homepage, agentic-flow diagram animations) are not in scope.
- Form validation states beyond `{component.text-input-focused}` are not extracted — error / success states would need a sign-up or feedback flow to confirm.
- The actual Claude product surface (claude.ai chat interface) shares some tokens with the marketing site but adds many product-specific components (chat bubbles, message tools, file upload chips, conversation history sidebar) that are out of scope for this marketing-surface document.
- The "agent" / "computer use" demo cards on certain pages display animated Claude controlling a browser — the static screenshot doesn''t fully capture the animation chrome.', '{"sourcePath":"docs/design-md/claude/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_1', '#cc785c', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_2', '#a9583e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_3', '#e6dfd8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_4', '#141413', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_5', '#3d3d3a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_6', '#252523', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_7', '#6c6a64', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_8', '#8e8b82', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_9', '#ebe6df', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_10', '#faf9f5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_11', '#f5f0e8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_12', '#efe9de', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_13', '#e8e0d2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_14', '#181715', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_15', '#252320', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_16', '#1f1e1b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_17', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_18', '#a09d96', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_19', '#5db8a6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_20', '#e8a55a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_21', '#5db872', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_22', '#d4a017', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'color', 'color_23', '#c64545', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'typography', 'font_1', 'Copernicus, Tiempos Headline, serif', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'typography', 'font_2', 'StyreneB, Inter, sans-serif', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md'), 'typography', 'font_3', 'JetBrains Mono, ui-monospace, monospace', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/claude/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/claude/DESIGN.md';


-- Clay
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Clay', 'clay', 'design-reference', null, now())
  on conflict (slug) do update
    set name = excluded.name,
        category = excluded.category,
        updated_at = now()
  returning id
),
d as (
  insert into design_documents (
    brand_id,
    source_type,
    original_filename,
    original_blob_url,
    status,
    raw_markdown,
    updated_at
  )
  select id, 'markdown_seed', 'docs/design-md/clay/DESIGN.md', null, 'seeded', '---
version: alpha
name: Clay-design-analysis
description: A vibrant claymation-meets-data interface for Clay.com (GTM data-orchestration platform). Anchors on white canvas with dark-navy primary CTAs, custom rounded display type, and saturated single-color feature cards — hot pink, deep teal, lavender, peach, ochre — that punctuate long-scroll explainer pages. Brand voltage comes from 3D-rendered claymation illustrations (mountains, characters, mascots) used as full-bleed hero artifacts and the bright multi-color card surfaces showing product UI fragments.

colors:
  primary: "#0a0a0a"
  primary-active: "#1f1f1f"
  primary-disabled: "#e5e5e5"
  ink: "#0a0a0a"
  body: "#3a3a3a"
  body-strong: "#1a1a1a"
  muted: "#6a6a6a"
  muted-soft: "#9a9a9a"
  hairline: "#e5e5e5"
  hairline-soft: "#f0f0f0"
  canvas: "#fffaf0"
  surface-soft: "#faf5e8"
  surface-card: "#f5f0e0"
  surface-strong: "#ebe6d6"
  surface-dark: "#0a1a1a"
  surface-dark-elevated: "#1a2a2a"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  on-dark-soft: "#a0a0a0"
  brand-pink: "#ff4d8b"
  brand-teal: "#1a3a3a"
  brand-lavender: "#b8a4ed"
  brand-peach: "#ffb084"
  brand-ochre: "#e8b94a"
  brand-mint: "#a4d4c5"
  brand-coral: "#ff6b5a"
  success: "#22c55e"
  warning: "#f59e0b"
  error: "#ef4444"

typography:
  display-xl:
    fontFamily: "Plain Black, Inter, sans-serif"
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -2.5px
  display-lg:
    fontFamily: "Plain Black, Inter, sans-serif"
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -2px
  display-md:
    fontFamily: "Plain Black, Inter, sans-serif"
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -1px
  display-sm:
    fontFamily: "Plain Black, Inter, sans-serif"
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.5px
  title-lg:
    fontFamily: "Inter, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.3px
  title-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "Inter, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 1.5px
  button:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  nav-link:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  xs: 6px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 44px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 44px
  button-on-color:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 44px
  button-text-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
  text-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 64px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: 96px
  hero-illustration-card:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
  feature-card-pink:
    backgroundColor: "{colors.brand-pink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.title-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  feature-card-teal:
    backgroundColor: "{colors.brand-teal}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  feature-card-lavender:
    backgroundColor: "{colors.brand-lavender}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  feature-card-peach:
    backgroundColor: "{colors.brand-peach}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  feature-card-ochre:
    backgroundColor: "{colors.brand-ochre}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  feature-card-cream:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  product-mockup-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  testimonial-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-tier-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-tier-card-featured:
    backgroundColor: "{colors.brand-teal}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 44px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  category-tab:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
  category-tab-active:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.pill}"
  badge-pill:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  expert-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  cta-band-illustrated:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    rounded: "{rounded.xl}"
    padding: 80px
  footer:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 80px
---

## Overview

Clay.com is the most playful B2B SaaS interface in the GTM-data category. The base atmosphere is **cream-tinted white canvas** (`{colors.canvas}` — #fffaf0) holding dark-navy ink type and **3D-rendered claymation illustrations** (mountains, mascot characters, peach/ochre/lavender landscapes) as the dominant brand voltage. Where most data-platform brands play it cool with grids and gradients, Clay leans hard into hand-crafted-looking 3D illustrations and saturated single-color feature cards.

Type voice runs **Plain Black** (or substituted with Inter weight 500-600) — a custom rounded display face used at very large sizes (72px hero) with negative letter-spacing. Body type uses Inter at standard weights. The display weight stays at 500, never bolder — the rounded character of the typeface gives it warmth without needing weight.

Component voltage comes from **saturated single-color feature cards** in a 6-color palette: hot pink, deep teal, lavender, peach, ochre, and cream-card. Each card shows product UI fragments at small scale — Claygent agent runs, sequencer flows, CRM enrichment outputs. The colored card IS the primary visual element on every long-scroll page.

**Key Characteristics:**
- Cream-tinted white canvas (`{colors.canvas}` — #fffaf0). The warmth differentiates Clay from cool-gray competitor sites.
- Dark navy/black primary CTAs (`{colors.primary}` — #0a0a0a). Buttons rounded `{rounded.md}` (12px) — friendly modern but not pill.
- 6-color saturated feature card palette: `{colors.brand-pink}`, `{colors.brand-teal}`, `{colors.brand-lavender}`, `{colors.brand-peach}`, `{colors.brand-ochre}`, `{colors.surface-card}` (cream).
- 3D claymation illustrations (mountains, characters, abstract shapes) as full-bleed hero artifacts — the brand''s most-recognized visual element.
- Custom rounded Plain Black display typeface at 500 weight with -1 to -2.5px letter-spacing on display sizes.
- Border radius is generous: `{rounded.md}` (12px) for buttons + inputs, `{rounded.lg}` (16px) for content cards, `{rounded.xl}` (24px) for feature cards. The bigger radius matches the rounded display type''s character.
- Product UI fragments embedded inside colored cards at small scale — agent run logs, sequencer flows, enrichment results.
- Section rhythm `{spacing.section}` (96px) between major bands.
- Footer is cream-tinted (`{colors.surface-soft}`) — Clay does NOT use a dark footer. Even the closing band stays warm-light.

## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #0a0a0a): All primary CTAs, h1/h2 ink type. Near-black with slight warmth.
- **Brand Pink** (`{colors.brand-pink}` — #ff4d8b): Hot-pink feature card surface. Sequencer / outbound feature pages.
- **Brand Teal** (`{colors.brand-teal}` — #1a3a3a): Deep teal-green feature card. Often the featured pricing tier.
- **Brand Lavender** (`{colors.brand-lavender}` — #b8a4ed): Soft lavender feature card.
- **Brand Peach** (`{colors.brand-peach}` — #ffb084): Warm peach feature card.
- **Brand Ochre** (`{colors.brand-ochre}` — #e8b94a): Mustard / ochre feature card and illustration accents.
- **Brand Mint** (`{colors.brand-mint}` — #a4d4c5): Mint accent on illustrations and small badges.
- **Brand Coral** (`{colors.brand-coral}` — #ff6b5a): Coral accent for highlights.

### Surface
- **Canvas** (`{colors.canvas}` — #fffaf0): The default page floor. Cream-tinted white.
- **Surface Soft** (`{colors.surface-soft}` — #faf5e8): Footer and CTA-band background.
- **Surface Card** (`{colors.surface-card}` — #f5f0e0): Cream feature cards, testimonial cards.
- **Surface Strong** (`{colors.surface-strong}` — #ebe6d6): Stronger cream for emphasized bands.
- **Surface Dark** (`{colors.surface-dark}` — #0a1a1a): Dark teal-tinted near-black for occasional dark cards (rare).
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #1a2a2a): Elevated dark cards.
- **Hairline** (`{colors.hairline}` — #e5e5e5): 1px borders on cards and inputs.

### Text
- **Ink** (`{colors.ink}` — #0a0a0a): Headlines and primary text.
- **Body Strong** (`{colors.body-strong}` — #1a1a1a): Emphasized body, lead paragraphs.
- **Body** (`{colors.body}` — #3a3a3a): Default running-text.
- **Muted** (`{colors.muted}` — #6a6a6a): Sub-headings, breadcrumbs, footer body.
- **Muted Soft** (`{colors.muted-soft}` — #9a9a9a): Captions, fine-print.
- **On Primary / On Dark** (`{colors.on-primary}` — #ffffff): Text on primary buttons + dark feature cards (teal).

### Semantic
- **Success** (`{colors.success}` — #22c55e): Success states.
- **Warning** (`{colors.warning}` — #f59e0b): Warning callouts.
- **Error** (`{colors.error}` — #ef4444): Validation errors.

## Typography

### Font Family
The system runs **Plain Black** (a custom rounded display face) for headlines and **Inter** for body, navigation, and UI. Plain Black at weight 500 with negative letter-spacing handles every display headline; Inter handles the rest. The fallback stack walks `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for both.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 72px | 500 | 1.0 | -2.5px | Homepage h1 ("Go to market with unique data") — Plain Black |
| `{typography.display-lg}` | 56px | 500 | 1.05 | -2px | Section heads — Plain Black |
| `{typography.display-md}` | 40px | 500 | 1.1 | -1px | Sub-section heads, product names |
| `{typography.display-sm}` | 32px | 500 | 1.15 | -0.5px | CTA-band heads, feature card titles |
| `{typography.title-lg}` | 24px | 600 | 1.3 | -0.3px | Pricing plan names, larger feature titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Card titles, intro paragraphs |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Small card titles, list labels |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Default running-text |
| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Footer body, fine-print |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
| `{typography.caption-uppercase}` | 12px | 600 | 1.4 | 1.5px | Section labels, "FEATURED" badges |
| `{typography.button}` | 14px | 600 | 1.0 | 0 | Standard button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
Plain Black at weight 500 + negative letter-spacing IS the brand voice. Going to weight 700 reads as bombastic; the rounded character of the typeface adds warmth that bolder weight would flatten.

The body-vs-display split is functional: Plain Black for Plain Black moments (headlines), Inter for everything else (running text, UI, buttons). Mixing them is a system violation.

### Note on Font Substitutes
If Plain Black is unavailable, **Inter** at weight 500 with -0.05em letter-spacing is a usable approximation. **Söhne Breit** at weight Buch is an alternative if licensed. **Recoleta** at weight 500 carries similar rounded-display warmth.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) between major editorial bands.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards and pricing tiers; `{spacing.lg}` (24px) for testimonial and product mockup cards.

### Grid & Container
- **Max content width:** ~1280px centered.
- **Editorial body:** Single 12-column grid; hero often uses 7/5 split (h1 left, illustration right).
- **Feature card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Pricing grid:** 3-4 up at desktop, 1-up at mobile.

### Whitespace Philosophy
Clay uses generous whitespace around big rounded display headlines and saturated feature cards. The cream canvas + colored cards + 3D illustrations create a playful warmth that competing data-platform sites lack.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero |
| Soft hairline | 1px `{colors.hairline}` border | Inputs, small content cards |
| Saturated card | Brand pink/teal/lavender/peach/ochre fill — no shadow | Feature cards |
| Cream card | `{colors.surface-card}` background — no shadow | Testimonial, secondary cards |
| Subtle drop shadow | Faint shadow at low alpha | Hover-elevated states (rare) |

The system uses no heavy shadows. Depth comes from the saturated color contrast between cream canvas and bright feature cards.

### Decorative Depth
- **3D claymation illustrations** — mountains, characters, mascots rendered in a hand-crafted 3D style. The brand''s most-recognized depth element. Not a token — these are illustrated assets.
- **Mascot characters** appear as inline figures in feature cards and CTAs.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 6px | Small badges, dropdown items |
| `{rounded.sm}` | 8px | Small buttons, hairline-border accent |
| `{rounded.md}` | 12px | Standard CTA buttons, text inputs |
| `{rounded.lg}` | 16px | Content cards, testimonial cards, pricing tiers |
| `{rounded.xl}` | 24px | Feature cards (the saturated brand-color cards) |
| `{rounded.pill}` | 9999px | Category tabs, badge pills |
| `{rounded.full}` | 9999px / 50% | Avatars, icon buttons |

## Components

### Top Navigation

**`top-nav`** — Cream nav bar pinned to top. 64px tall, `{colors.canvas}` background. Carries the Clay logo + wordmark at left, primary horizontal menu (Product, Solutions, Resources, Pricing, Customers) center, right-side cluster with "Sign in" + "Try free" `{component.button-primary}`. Menu items in `{typography.nav-link}` (Inter 14px / 500).

### Buttons

**`button-primary`** — Background `{colors.primary}` (near-black), text `{colors.on-primary}` (white), type `{typography.button}` (Inter 14px / 600), padding 12px × 20px, height 44px, rounded `{rounded.md}` (12px).

**`button-secondary`** — Cream button with hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px hairline border.

**`button-on-color`** — White button used over saturated brand-color feature cards. Same shape as primary but inverted (white background, ink text).

**`button-text-link`** — Inline text button, no background. Used for "Sign in" and inline link CTAs.

**`text-link`** — Inline body links in `{colors.ink}` with underline.

### Cards & Containers

**`hero-band`** — Cream-canvas hero with 7-5 grid: h1 + sub-headline + button row on the left, 3D claymation illustration on the right. Vertical padding `{spacing.section}` (96px).

**`hero-illustration-card`** — Right-side artifact holding 3D claymation illustration (mountains, mascot character, abstract shapes). Background `{colors.surface-soft}`, rounded `{rounded.xl}` (24px). The illustration IS the artifact.

**`feature-card-pink`** / **`feature-card-teal`** / **`feature-card-lavender`** / **`feature-card-peach`** / **`feature-card-ochre`** — Saturated single-color feature cards. Background varies per variant; rounded `{rounded.xl}` (24px); padding `{spacing.xl}` (32px). Each card carries an h3 in `{typography.title-md}`, a body description, and a product UI fragment or mascot illustration. Text color flips to `{colors.on-dark}` (white) on pink and teal cards, `{colors.ink}` (dark) on lavender/peach/ochre cards (the lighter saturations have enough contrast for dark text).

**`feature-card-cream`** — Lower-key feature card variant on `{colors.surface-card}`. Used for less-emphasized features that don''t warrant a saturated color.

**`product-mockup-card`** — Card showing actual Clay product UI (Claygent agent runs, sequencer flows, CRM enrichment tables). Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px).

**`testimonial-card`** — Customer quote cards. Background `{colors.surface-card}` (cream), rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Top row has avatar + name + role; below sits the testimonial in `{typography.body-md}`.

**`pricing-tier-card`** — Standard tier card. Background `{colors.canvas}` with hairline, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px).

**`pricing-tier-card-featured`** — The featured tier flips to `{colors.brand-teal}` (deep teal-green). The teal surface IS the featured signal.

**`expert-card`** — Used on /experts page. Background `{colors.canvas}` with hairline, rounded `{rounded.lg}`, padding `{spacing.lg}`. Carries an avatar at top, expert name, specialization, and a "Book session" link.

### Inputs & Forms

**`text-input`** — Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}` (12px), padding 12px × 16px, height 44px. 1px hairline border.

**`text-input-focused`** — Border thickens to ink for emphasis.

### Tabs / Badges

**`category-tab`** + **`category-tab-active`** — Pill-shaped tabs in sub-nav. Inactive: transparent + muted text. Active: cream-card background + ink text. Padding 8px × 16px.

**`badge-pill`** — Small cream-fill pill labels in `{typography.caption}` (13px / 500), rounded `{rounded.pill}`.

### CTA / Footer

**`cta-band-illustrated`** — Pre-footer "Turn your growth ideas into reality today" band. Background `{colors.surface-soft}`, rounded `{rounded.xl}`, padding 80px. Carries an h2 in `{typography.display-md}`, a sub-line, and a `{component.button-primary}` — usually paired with a 3D illustration of a mascot or scene.

**`footer`** — Cream-tinted footer (NOT dark navy unlike most SaaS sites). Background `{colors.surface-soft}`, text `{colors.body}`. 4-column link list. Vertical padding 80px. Often features a horizon-style 3D mountain illustration at the very bottom — Clay''s signature footer mountain.

## Do''s and Don''ts

### Do
- Anchor every page on the cream canvas (`{colors.canvas}` — #fffaf0). The warm tint differentiates Clay from cool-gray data sites.
- Use 3D claymation illustrations as hero artifacts. Hand-crafted 3D characters and mountains ARE the brand.
- Cycle saturated feature cards across the page — pink → teal → lavender → peach → ochre → cream. Repeating the same color twice in a row reads as off-rhythm.
- Use Plain Black at weight 500 with negative letter-spacing on every display headline.
- Show product UI fragments inside saturated feature cards. The brand voltage is product-driven, not abstract.
- Use cream footer (NOT dark). Clay deliberately closes pages with warm cream rather than the standard dark-footer SaaS template.
- Anchor every band with `{spacing.section}` (96px) vertical rhythm.

### Don''t
- Don''t use cool grays for canvas. The cream tint is non-negotiable.
- Don''t use a 7th brand-color card. The 6-color palette is saturated enough.
- Don''t bold display weight beyond 500. Plain Black at 700 reads as bombastic.
- Don''t repeat the same brand-color card twice in a row.
- Don''t replace claymation illustrations with flat vector art. The hand-crafted 3D character IS the brand voice.
- Don''t use a dark footer. The cream footer is part of the system''s warm-throughout pacing.
- Don''t add hover state styling beyond what the system already encodes.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 72→36px; hero-illustration-card stacks below; feature grids 1-up; pricing 1-up |
| Tablet | 768–1024px | Top nav tightens; feature cards 2-up; pricing 2-up |
| Desktop | 1024–1440px | Full top-nav; 3-up feature cards; 3-up pricing tiers |
| Wide | > 1440px | Same as desktop with more breathing room; max content 1280px |

### Touch Targets
- `{component.button-primary}` at minimum 44 × 44px (matches WCAG AAA).
- `{component.text-input}` height is 44px.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px.
- Hero 7-5 grid → single-column on mobile.
- Feature card grids reduce columns rather than scaling.
- Saturated feature cards retain their colored fill at every breakpoint.
- Pricing tier cards collapse 4 → 2 → 1.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.feature-card-pink}`, `{component.pricing-tier-card-featured}`).
2. Pick the right brand-color card for the feature: pink for outbound/sequencer, teal for enterprise/featured, lavender for AI-agent products, peach for general SaaS warmth, ochre for community / experts.
3. Variants of an existing component (`-active`, `-disabled`) live as separate entries.
4. Use `{token.refs}` everywhere — never inline hex.
5. Never document hover.
6. Display headlines stay Plain Black 500 with negative letter-spacing. Body stays Inter 400.
7. The cream-throughout palette is a system contract — don''t add a dark footer.

## Known Gaps

- Plain Black is licensed to Clay and not available as a public web font; Inter weight 500 with negative letter-spacing is the closest substitute.
- 3D claymation illustrations are commissioned assets, not system tokens — they''re rendered per-page.
- The mascot characters (named characters that recur across the site) are illustrated assets; their exact lineage and naming are not formalized in tokens.
- Animation and transition timings (3D illustration parallax on scroll, feature card entrance animations) are not in scope.
- Form validation states beyond `{component.text-input-focused}` are not extracted.
- The actual Clay product surface (in-app data tables, formula editor, agent builder) shares some tokens with the marketing site but adds many product-specific components that are out of scope.
', now()
  from b
  on conflict (brand_id, original_filename) do update
    set status = 'seeded',
        raw_markdown = excluded.raw_markdown,
        updated_at = now()
  returning id
),
deleted_sections as (
  delete from design_sections where document_id = (select id from d)
),
deleted_tokens as (
  delete from design_tokens where document_id = (select id from d)
)
insert into design_sections (document_id, category, original_title, normalized_title, content_markdown, content_json, confidence, sort_order)
values
((select id from d), 'overview', 'Overview', 'overview', '## Overview

Clay.com is the most playful B2B SaaS interface in the GTM-data category. The base atmosphere is **cream-tinted white canvas** (`{colors.canvas}` — #fffaf0) holding dark-navy ink type and **3D-rendered claymation illustrations** (mountains, mascot characters, peach/ochre/lavender landscapes) as the dominant brand voltage. Where most data-platform brands play it cool with grids and gradients, Clay leans hard into hand-crafted-looking 3D illustrations and saturated single-color feature cards.

Type voice runs **Plain Black** (or substituted with Inter weight 500-600) — a custom rounded display face used at very large sizes (72px hero) with negative letter-spacing. Body type uses Inter at standard weights. The display weight stays at 500, never bolder — the rounded character of the typeface gives it warmth without needing weight.

Component voltage comes from **saturated single-color feature cards** in a 6-color palette: hot pink, deep teal, lavender, peach, ochre, and cream-card. Each card shows product UI fragments at small scale — Claygent agent runs, sequencer flows, CRM enrichment outputs. The colored card IS the primary visual element on every long-scroll page.

**Key Characteristics:**
- Cream-tinted white canvas (`{colors.canvas}` — #fffaf0). The warmth differentiates Clay from cool-gray competitor sites.
- Dark navy/black primary CTAs (`{colors.primary}` — #0a0a0a). Buttons rounded `{rounded.md}` (12px) — friendly modern but not pill.
- 6-color saturated feature card palette: `{colors.brand-pink}`, `{colors.brand-teal}`, `{colors.brand-lavender}`, `{colors.brand-peach}`, `{colors.brand-ochre}`, `{colors.surface-card}` (cream).
- 3D claymation illustrations (mountains, characters, abstract shapes) as full-bleed hero artifacts — the brand''s most-recognized visual element.
- Custom rounded Plain Black display typeface at 500 weight with -1 to -2.5px letter-spacing on display sizes.
- Border radius is generous: `{rounded.md}` (12px) for buttons + inputs, `{rounded.lg}` (16px) for content cards, `{rounded.xl}` (24px) for feature cards. The bigger radius matches the rounded display type''s character.
- Product UI fragments embedded inside colored cards at small scale — agent run logs, sequencer flows, enrichment results.
- Section rhythm `{spacing.section}` (96px) between major bands.
- Footer is cream-tinted (`{colors.surface-soft}`) — Clay does NOT use a dark footer. Even the closing band stays warm-light.', '{"sourcePath":"docs/design-md/clay/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #0a0a0a): All primary CTAs, h1/h2 ink type. Near-black with slight warmth.
- **Brand Pink** (`{colors.brand-pink}` — #ff4d8b): Hot-pink feature card surface. Sequencer / outbound feature pages.
- **Brand Teal** (`{colors.brand-teal}` — #1a3a3a): Deep teal-green feature card. Often the featured pricing tier.
- **Brand Lavender** (`{colors.brand-lavender}` — #b8a4ed): Soft lavender feature card.
- **Brand Peach** (`{colors.brand-peach}` — #ffb084): Warm peach feature card.
- **Brand Ochre** (`{colors.brand-ochre}` — #e8b94a): Mustard / ochre feature card and illustration accents.
- **Brand Mint** (`{colors.brand-mint}` — #a4d4c5): Mint accent on illustrations and small badges.
- **Brand Coral** (`{colors.brand-coral}` — #ff6b5a): Coral accent for highlights.

### Surface
- **Canvas** (`{colors.canvas}` — #fffaf0): The default page floor. Cream-tinted white.
- **Surface Soft** (`{colors.surface-soft}` — #faf5e8): Footer and CTA-band background.
- **Surface Card** (`{colors.surface-card}` — #f5f0e0): Cream feature cards, testimonial cards.
- **Surface Strong** (`{colors.surface-strong}` — #ebe6d6): Stronger cream for emphasized bands.
- **Surface Dark** (`{colors.surface-dark}` — #0a1a1a): Dark teal-tinted near-black for occasional dark cards (rare).
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #1a2a2a): Elevated dark cards.
- **Hairline** (`{colors.hairline}` — #e5e5e5): 1px borders on cards and inputs.

### Text
- **Ink** (`{colors.ink}` — #0a0a0a): Headlines and primary text.
- **Body Strong** (`{colors.body-strong}` — #1a1a1a): Emphasized body, lead paragraphs.
- **Body** (`{colors.body}` — #3a3a3a): Default running-text.
- **Muted** (`{colors.muted}` — #6a6a6a): Sub-headings, breadcrumbs, footer body.
- **Muted Soft** (`{colors.muted-soft}` — #9a9a9a): Captions, fine-print.
- **On Primary / On Dark** (`{colors.on-primary}` — #ffffff): Text on primary buttons + dark feature cards (teal).

### Semantic
- **Success** (`{colors.success}` — #22c55e): Success states.
- **Warning** (`{colors.warning}` — #f59e0b): Warning callouts.
- **Error** (`{colors.error}` — #ef4444): Validation errors.', '{"sourcePath":"docs/design-md/clay/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The system runs **Plain Black** (a custom rounded display face) for headlines and **Inter** for body, navigation, and UI. Plain Black at weight 500 with negative letter-spacing handles every display headline; Inter handles the rest. The fallback stack walks `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for both.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 72px | 500 | 1.0 | -2.5px | Homepage h1 ("Go to market with unique data") — Plain Black |
| `{typography.display-lg}` | 56px | 500 | 1.05 | -2px | Section heads — Plain Black |
| `{typography.display-md}` | 40px | 500 | 1.1 | -1px | Sub-section heads, product names |
| `{typography.display-sm}` | 32px | 500 | 1.15 | -0.5px | CTA-band heads, feature card titles |
| `{typography.title-lg}` | 24px | 600 | 1.3 | -0.3px | Pricing plan names, larger feature titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Card titles, intro paragraphs |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Small card titles, list labels |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Default running-text |
| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Footer body, fine-print |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
| `{typography.caption-uppercase}` | 12px | 600 | 1.4 | 1.5px | Section labels, "FEATURED" badges |
| `{typography.button}` | 14px | 600 | 1.0 | 0 | Standard button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
Plain Black at weight 500 + negative letter-spacing IS the brand voice. Going to weight 700 reads as bombastic; the rounded character of the typeface adds warmth that bolder weight would flatten.

The body-vs-display split is functional: Plain Black for Plain Black moments (headlines), Inter for everything else (running text, UI, buttons). Mixing them is a system violation.

### Note on Font Substitutes
If Plain Black is unavailable, **Inter** at weight 500 with -0.05em letter-spacing is a usable approximation. **Söhne Breit** at weight Buch is an alternative if licensed. **Recoleta** at weight 500 carries similar rounded-display warmth.', '{"sourcePath":"docs/design-md/clay/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) between major editorial bands.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards and pricing tiers; `{spacing.lg}` (24px) for testimonial and product mockup cards.

### Grid & Container
- **Max content width:** ~1280px centered.
- **Editorial body:** Single 12-column grid; hero often uses 7/5 split (h1 left, illustration right).
- **Feature card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Pricing grid:** 3-4 up at desktop, 1-up at mobile.

### Whitespace Philosophy
Clay uses generous whitespace around big rounded display headlines and saturated feature cards. The cream canvas + colored cards + 3D illustrations create a playful warmth that competing data-platform sites lack.', '{"sourcePath":"docs/design-md/clay/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero |
| Soft hairline | 1px `{colors.hairline}` border | Inputs, small content cards |
| Saturated card | Brand pink/teal/lavender/peach/ochre fill — no shadow | Feature cards |
| Cream card | `{colors.surface-card}` background — no shadow | Testimonial, secondary cards |
| Subtle drop shadow | Faint shadow at low alpha | Hover-elevated states (rare) |

The system uses no heavy shadows. Depth comes from the saturated color contrast between cream canvas and bright feature cards.

### Decorative Depth
- **3D claymation illustrations** — mountains, characters, mascots rendered in a hand-crafted 3D style. The brand''s most-recognized depth element. Not a token — these are illustrated assets.
- **Mascot characters** appear as inline figures in feature cards and CTAs.', '{"sourcePath":"docs/design-md/clay/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 6px | Small badges, dropdown items |
| `{rounded.sm}` | 8px | Small buttons, hairline-border accent |
| `{rounded.md}` | 12px | Standard CTA buttons, text inputs |
| `{rounded.lg}` | 16px | Content cards, testimonial cards, pricing tiers |
| `{rounded.xl}` | 24px | Feature cards (the saturated brand-color cards) |
| `{rounded.pill}` | 9999px | Category tabs, badge pills |
| `{rounded.full}` | 9999px / 50% | Avatars, icon buttons |', '{"sourcePath":"docs/design-md/clay/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav`** — Cream nav bar pinned to top. 64px tall, `{colors.canvas}` background. Carries the Clay logo + wordmark at left, primary horizontal menu (Product, Solutions, Resources, Pricing, Customers) center, right-side cluster with "Sign in" + "Try free" `{component.button-primary}`. Menu items in `{typography.nav-link}` (Inter 14px / 500).

### Buttons

**`button-primary`** — Background `{colors.primary}` (near-black), text `{colors.on-primary}` (white), type `{typography.button}` (Inter 14px / 600), padding 12px × 20px, height 44px, rounded `{rounded.md}` (12px).

**`button-secondary`** — Cream button with hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px hairline border.

**`button-on-color`** — White button used over saturated brand-color feature cards. Same shape as primary but inverted (white background, ink text).

**`button-text-link`** — Inline text button, no background. Used for "Sign in" and inline link CTAs.

**`text-link`** — Inline body links in `{colors.ink}` with underline.

### Cards & Containers

**`hero-band`** — Cream-canvas hero with 7-5 grid: h1 + sub-headline + button row on the left, 3D claymation illustration on the right. Vertical padding `{spacing.section}` (96px).

**`hero-illustration-card`** — Right-side artifact holding 3D claymation illustration (mountains, mascot character, abstract shapes). Background `{colors.surface-soft}`, rounded `{rounded.xl}` (24px). The illustration IS the artifact.

**`feature-card-pink`** / **`feature-card-teal`** / **`feature-card-lavender`** / **`feature-card-peach`** / **`feature-card-ochre`** — Saturated single-color feature cards. Background varies per variant; rounded `{rounded.xl}` (24px); padding `{spacing.xl}` (32px). Each card carries an h3 in `{typography.title-md}`, a body description, and a product UI fragment or mascot illustration. Text color flips to `{colors.on-dark}` (white) on pink and teal cards, `{colors.ink}` (dark) on lavender/peach/ochre cards (the lighter saturations have enough contrast for dark text).

**`feature-card-cream`** — Lower-key feature card variant on `{colors.surface-card}`. Used for less-emphasized features that don''t warrant a saturated color.

**`product-mockup-card`** — Card showing actual Clay product UI (Claygent agent runs, sequencer flows, CRM enrichment tables). Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px).

**`testimonial-card`** — Customer quote cards. Background `{colors.surface-card}` (cream), rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Top row has avatar + name + role; below sits the testimonial in `{typography.body-md}`.

**`pricing-tier-card`** — Standard tier card. Background `{colors.canvas}` with hairline, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px).

**`pricing-tier-card-featured`** — The featured tier flips to `{colors.brand-teal}` (deep teal-green). The teal surface IS the featured signal.

**`expert-card`** — Used on /experts page. Background `{colors.canvas}` with hairline, rounded `{rounded.lg}`, padding `{spacing.lg}`. Carries an avatar at top, expert name, specialization, and a "Book session" link.

### Inputs & Forms

**`text-input`** — Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}` (12px), padding 12px × 16px, height 44px. 1px hairline border.

**`text-input-focused`** — Border thickens to ink for emphasis.

### Tabs / Badges

**`category-tab`** + **`category-tab-active`** — Pill-shaped tabs in sub-nav. Inactive: transparent + muted text. Active: cream-card background + ink text. Padding 8px × 16px.

**`badge-pill`** — Small cream-fill pill labels in `{typography.caption}` (13px / 500), rounded `{rounded.pill}`.

### CTA / Footer

**`cta-band-illustrated`** — Pre-footer "Turn your growth ideas into reality today" band. Background `{colors.surface-soft}`, rounded `{rounded.xl}`, padding 80px. Carries an h2 in `{typography.display-md}`, a sub-line, and a `{component.button-primary}` — usually paired with a 3D illustration of a mascot or scene.

**`footer`** — Cream-tinted footer (NOT dark navy unlike most SaaS sites). Background `{colors.surface-soft}`, text `{colors.body}`. 4-column link list. Vertical padding 80px. Often features a horizon-style 3D mountain illustration at the very bottom — Clay''s signature footer mountain.', '{"sourcePath":"docs/design-md/clay/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Anchor every page on the cream canvas (`{colors.canvas}` — #fffaf0). The warm tint differentiates Clay from cool-gray data sites.
- Use 3D claymation illustrations as hero artifacts. Hand-crafted 3D characters and mountains ARE the brand.
- Cycle saturated feature cards across the page — pink → teal → lavender → peach → ochre → cream. Repeating the same color twice in a row reads as off-rhythm.
- Use Plain Black at weight 500 with negative letter-spacing on every display headline.
- Show product UI fragments inside saturated feature cards. The brand voltage is product-driven, not abstract.
- Use cream footer (NOT dark). Clay deliberately closes pages with warm cream rather than the standard dark-footer SaaS template.
- Anchor every band with `{spacing.section}` (96px) vertical rhythm.

### Don''t
- Don''t use cool grays for canvas. The cream tint is non-negotiable.
- Don''t use a 7th brand-color card. The 6-color palette is saturated enough.
- Don''t bold display weight beyond 500. Plain Black at 700 reads as bombastic.
- Don''t repeat the same brand-color card twice in a row.
- Don''t replace claymation illustrations with flat vector art. The hand-crafted 3D character IS the brand voice.
- Don''t use a dark footer. The cream footer is part of the system''s warm-throughout pacing.
- Don''t add hover state styling beyond what the system already encodes.', '{"sourcePath":"docs/design-md/clay/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 72→36px; hero-illustration-card stacks below; feature grids 1-up; pricing 1-up |
| Tablet | 768–1024px | Top nav tightens; feature cards 2-up; pricing 2-up |
| Desktop | 1024–1440px | Full top-nav; 3-up feature cards; 3-up pricing tiers |
| Wide | > 1440px | Same as desktop with more breathing room; max content 1280px |

### Touch Targets
- `{component.button-primary}` at minimum 44 × 44px (matches WCAG AAA).
- `{component.text-input}` height is 44px.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px.
- Hero 7-5 grid → single-column on mobile.
- Feature card grids reduce columns rather than scaling.
- Saturated feature cards retain their colored fill at every breakpoint.
- Pricing tier cards collapse 4 → 2 → 1.', '{"sourcePath":"docs/design-md/clay/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.feature-card-pink}`, `{component.pricing-tier-card-featured}`).
2. Pick the right brand-color card for the feature: pink for outbound/sequencer, teal for enterprise/featured, lavender for AI-agent products, peach for general SaaS warmth, ochre for community / experts.
3. Variants of an existing component (`-active`, `-disabled`) live as separate entries.
4. Use `{token.refs}` everywhere — never inline hex.
5. Never document hover.
6. Display headlines stay Plain Black 500 with negative letter-spacing. Body stays Inter 400.
7. The cream-throughout palette is a system contract — don''t add a dark footer.', '{"sourcePath":"docs/design-md/clay/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Plain Black is licensed to Clay and not available as a public web font; Inter weight 500 with negative letter-spacing is the closest substitute.
- 3D claymation illustrations are commissioned assets, not system tokens — they''re rendered per-page.
- The mascot characters (named characters that recur across the site) are illustrated assets; their exact lineage and naming are not formalized in tokens.
- Animation and transition timings (3D illustration parallax on scroll, feature card entrance animations) are not in scope.
- Form validation states beyond `{component.text-input-focused}` are not extracted.
- The actual Clay product surface (in-app data tables, formula editor, agent builder) shares some tokens with the marketing site but adds many product-specific components that are out of scope.', '{"sourcePath":"docs/design-md/clay/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_1', '#0a0a0a', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_2', '#1f1f1f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_3', '#e5e5e5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_4', '#3a3a3a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_5', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_6', '#6a6a6a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_7', '#9a9a9a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_8', '#f0f0f0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_9', '#fffaf0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_10', '#faf5e8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_11', '#f5f0e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_12', '#ebe6d6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_13', '#0a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_14', '#1a2a2a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_15', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_16', '#a0a0a0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_17', '#ff4d8b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_18', '#1a3a3a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_19', '#b8a4ed', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_20', '#ffb084', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_21', '#e8b94a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_22', '#a4d4c5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_23', '#ff6b5a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_24', '#22c55e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_25', '#f59e0b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'color', 'color_26', '#ef4444', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'typography', 'font_1', 'Plain Black, Inter, sans-serif', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md'), 'typography', 'font_2', 'Inter, sans-serif', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/clay/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/clay/DESIGN.md';

