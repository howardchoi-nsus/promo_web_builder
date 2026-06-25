-- Generated seed chunk 07
-- Run 000_prepare.sql once before running these chunks.
-- Documents: 10


-- Superhuman
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Superhuman', 'superhuman', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/superhuman/DESIGN.md', null, 'seeded', '---
version: alpha
name: Superhumon-Inspired-design-analysis
description: An inspired interpretation of Superhumon''s design language — a fast-email productivity brand split between an editorial dark hero (deep indigo navy with violet-sky atmospheric backdrop and a portrait subject) and a quiet white content body with off-warm-grey ink. The system uses a single proprietary variable display sans, heavy weight 460–540 with tight tracking, and a deep-teal closing CTA band that breaks the indigo/white rhythm with a warm dark interlude. Buttons are tight rounded rectangles, pricing is sober and dense, and the brand reads more like a high-end newsletter than a SaaS app.

colors:
  primary: "#1b1938"
  primary-deep: "#0e0c1f"
  on-primary: "#ffffff"
  ink: "#292827"
  ink-mute: "#73706d"
  ink-faint: "#9a9794"
  canvas: "#ffffff"
  canvas-soft: "#fafaf8"
  surface-violet-soft: "#c9b4fa"
  surface-teal-deep: "#0e3030"
  surface-teal-mid: "#155555"
  hairline: "#e8e4dd"
  hairline-dark: "#3f3a52"
  on-dark-mute: "#bcbac9"
  on-dark-faint: "#5a5772"

typography:
  display-xxl:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 64px
    fontWeight: 540
    lineHeight: 0.96
    letterSpacing: 0
  display-xl:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 48px
    fontWeight: 460
    lineHeight: 0.96
    letterSpacing: -1.32px
  display-lg:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 28px
    fontWeight: 540
    lineHeight: 1.14
    letterSpacing: -0.63px
  display-md:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 22px
    fontWeight: 460
    lineHeight: 1.1
    letterSpacing: -0.315px
  heading-lg:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 20px
    fontWeight: 460
    lineHeight: 1.2
    letterSpacing: -0.4px
  body-lg:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 18px
    fontWeight: 540
    lineHeight: 1.5
    letterSpacing: -0.135px
  body-md:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 16px
    fontWeight: 460
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 18.72px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
  button-md:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 0
  button-cap:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0
  caption:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 14px
    fontWeight: 460
    lineHeight: 1.4
    letterSpacing: 0
  micro:
    fontFamily: "''Super Sans VF'', system-ui, -apple-system, ''Segoe UI'', Roboto, sans-serif"
    fontSize: 12px
    fontWeight: 540
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 64px

components:
  button-primary-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  button-primary-dark-pressed:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  button-on-dark-pill:
    backgroundColor: "{colors.surface-violet-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 12px 20px
  button-secondary-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  button-on-teal:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.surface-teal-deep}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 10px 12px
  card-feature-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-pricing:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-pricing-featured:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-teal-band:
    backgroundColor: "{colors.surface-teal-deep}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    padding: 64px
  card-feature-row:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 24px
  pill-tab-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-cap}"
    rounded: "{rounded.full}"
    padding: 8px 16px
  nav-bar-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 16px 24px
  nav-bar-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 16px 24px
  link-on-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 0px
  footer-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-mute}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 24px
---

## Overview

Superhumon''s marketing pages open in an editorial dark register: a deep indigo navy `{colors.primary}` (`#1b1938`) canvas overlaid with a soft violet-and-sky atmospheric backdrop and a half-bleed portrait subject (often a person looking off-frame, photographed at twilight). Headlines render in `{typography.display-xxl}` (Super Sans VF at 64px / weight 540) with negative tracking, set in white over the indigo. A single rounded-rectangle CTA button anchors each band — never two, never three.

The body of every page flips to white. `{colors.canvas}` (`#ffffff`) takes over below the hero, with body type in `{colors.ink}` (`#292827` — a slightly warm dark grey, never pure black) and feature rows alternating between white and `{colors.canvas-soft}` (a barely-tinted off-white). Pricing tiers sit on this white surface; the featured tier inverts to the indigo navy, completing the brand''s binary polarity.

Every page closes with a **deep-teal CTA band** (`{colors.surface-teal-deep}` — `#0e3030`). The teal is a single chromatic interlude: rich, almost-black green-blue, that breaks up what would otherwise be an indigo/white-only page. The teal band always contains the closing CTA in `{typography.display-lg}` paired with a single white-pill button.

Typography runs **Super Sans VF** — a proprietary variable display sans — at unusual mid-weights (460, 540, 600). The variable axes let the brand pick precise sub-default weights that read as warmer and more human than typical 400/500/700 SaaS scales. Display sizes use negative letter-spacing of -1.32px to -0.315px depending on size; line-heights are unusually tight (0.96 on 48px display).

**Key Characteristics:**
- Three-canvas system: indigo navy (`{colors.primary}`) for hero, white (`{colors.canvas}`) for body, deep teal (`{colors.surface-teal-deep}`) for closing CTA.
- Half-bleed portrait subject in the hero with violet-sky atmospheric backdrop — the brand uses a person looking off-frame as a recurring visual.
- Single CTA per band; the marketing pages never crowd actions.
- Super Sans VF at sub-default weights (460, 540, 600) — the brand''s typographic warmth signature.
- Tight line-heights (0.96) on display sizes — vertical compression as editorial density.
- Off-warm-grey body ink (`#292827`) — never pure black; the brand''s quiet warmth.
- Pill-shaped on-hero CTA in pale violet (`{colors.surface-violet-soft}`); rounded-rectangle CTAs everywhere else.

## Colors

> **Source pages:** home (`/`), `/products/go-ai-assistant`, `/contact-sales`, `/plans`.

### Brand & Accent
- **Primary Indigo Navy** (`{colors.primary}` — `#1b1938`): The brand''s primary surface and CTA color. Hero canvas, filled rounded-rectangle button, featured pricing tier.
- **Indigo Deep** (`{colors.primary-deep}` — `#0e0c1f`): Pressed-state lift / deeper navy used in hero gradient stops.
- **Surface Violet Soft** (`{colors.surface-violet-soft}` — `#c9b4fa`): The hero pill-button fill — pale violet over the indigo canvas. Also appears in atmospheric backdrops.
- **Surface Teal Deep** (`{colors.surface-teal-deep}` — `#0e3030`): The signature closing-CTA band color. Rich green-blue, almost black.
- **Surface Teal Mid** (`{colors.surface-teal-mid}` — `#155555`): Slightly lifted teal for nested chrome inside the band.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): Default body background.
- **Canvas Soft** (`{colors.canvas-soft}` — `#fafaf8`): Barely-warm off-white for alternating feature-row bands.
- **Hairline** (`{colors.hairline}` — `#e8e4dd`): 1px borders, slightly warm grey.
- **Hairline Dark** (`{colors.hairline-dark}` — `#3f3a52`): 1px borders on dark surfaces.

### Text
- **Ink** (`{colors.ink}` — `#292827`): Default body text. Warm dark grey, never pure black.
- **Ink Mute** (`{colors.ink-mute}` — `#73706d`): Secondary text, captions.
- **Ink Faint** (`{colors.ink-faint}` — `#9a9794`): Tertiary / disabled text.
- **On Primary** (`{colors.on-primary}` — `#ffffff`): Text on dark navy / teal surfaces.
- **On Dark Mute** (`{colors.on-dark-mute}` — translucent white): Secondary text on dark.
- **On Dark Faint** (`{colors.on-dark-faint}` — translucent white): Tertiary text on dark.

## Typography

### Font Family

The display and UI tier is **Super Sans VF** — a proprietary variable sans (variable axes for weight, with the brand using sub-default 460 / 540 / 600 weights). Fallback chain is the system font stack.

For substitution use **Inter Variable** (open-source) at weight 460 / 540 / 600 — Inter''s variable axes match Super Sans VF''s behavior closely. Avoid fixed-weight Inter at 400 / 500 / 600 — the brand specifically picks the in-between weights.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 64px | 540 | 0.96 | 0 | Hero headline |
| `{typography.display-xl}` | 48px | 460 | 0.96 | -1.32px | Section opener on light surfaces |
| `{typography.display-lg}` | 28px | 540 | 1.14 | -0.63px | Sub-section / feature title |
| `{typography.display-md}` | 22px | 460 | 1.1 | -0.315px | Card title |
| `{typography.heading-lg}` | 20px | 460 | 1.2 | -0.4px | Compact card title |
| `{typography.body-lg}` | 18px | 540 | 1.5 | -0.135px | Marketing body lead |
| `{typography.body-md}` | 16px | 460 | 1.5 | 0 | Default UI body |
| `{typography.body-strong}` | 18.72px | 700 | 1.5 | 0 | Emphasized body |
| `{typography.button-md}` | 16px | 700 | 1.0 | 0 | Rounded-rectangle button label |
| `{typography.button-cap}` | 14px | 600 | 1.0 | 0 | Compact button label |
| `{typography.caption}` | 14px | 460 | 1.4 | 0 | Helper, footnote |
| `{typography.micro}` | 12px | 540 | 1.4 | 0 | Pill label, fine print |

### Principles
- **Sub-default weights.** The brand picks 460 / 540 / 600 instead of 400 / 500 / 700 — a quiet warmth in the typography that distinguishes it from default SaaS systems.
- **Tight display leading.** 0.96 on 48–64px display — the type stacks unusually compact.
- **Negative tracking on display sizes.** -1.32px at 48px scaling proportionally — tightens the variable letterforms into editorial density.

### Note on Font Substitutes
**Inter Variable** (open-source via Google Fonts) is the recommended substitute. Set `font-variation-settings: "wght" 540` for display, 460 for body — Inter''s variable axes match. Avoid fixed-weight Inter; the in-between weights are the brand''s signature.

## Layout

### Spacing System
- **Base unit**: 8px (with 2 / 4 / 12 sub-tokens for fine work).
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.huge}` 64px.
- **Section padding**: 64–96px on most sections; closing teal band uses 96–128px for editorial weight.
- **Card internal padding**: 32px on pricing cards; 24px on alternating feature rows.

### Grid & Container
- Hero spans full viewport width with the violet-sky backdrop edge-to-edge; content centers in a ~960px column.
- Body content centers in ~960–1100px.
- Pricing collapses 3-up → 2-up → 1-up at 1024 / 768 breakpoints.

### Whitespace Philosophy
The brand uses generous editorial whitespace on both polarities — dark hero and white body. Section gaps tend toward 96px; the teal closing band gets up to 128px of vertical air. The whitespace itself is part of the brand''s "considered, slow-tempo" feel.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 | Flat | Default surface |
| 1 | `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` | Subtle card lift |
| 2 | `box-shadow: 0 8px 24px rgba(0,0,0,0.12)` | Floating panels, modals |
| 3 | Atmospheric backdrop (violet-sky over indigo) | The hero''s depth medium |

### Decorative Depth
The hero''s depth is the **violet-sky atmospheric backdrop** — a soft indigo-to-violet-to-sky-blue radial wash that sits behind the portrait subject. Implemented as a CSS radial gradient or large background image. Below the hero, depth is minimal — the white canvas is flat.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Hairline tags |
| `{rounded.sm}` | 6px | Form inputs |
| `{rounded.md}` | 8px | Buttons (the brand''s signature button shape — rounded rectangle, never pill) |
| `{rounded.lg}` | 12px | Pricing cards, feature cards |
| `{rounded.xl}` | 16px | Modal dialogs, large feature cards |
| `{rounded.full}` | 9999px | Pill tabs in feature row, hero CTA |

### Photography Geometry
The hero uses **half-bleed portrait subjects** — a person photographed at twilight, looking off-frame, occupying the right half of the hero. The portrait extends edge-to-edge vertically and stops mid-canvas horizontally; type sits on the left side. Other photography is rare; product UI mockups handle most other illustrative needs.

## Components

### Buttons

**`button-primary-dark`** — the dominant rounded-rectangle CTA on white surfaces.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `{spacing.md} {spacing.xl}` (12px 20px), rounded `{rounded.md}` 8px.
- Pressed state `button-primary-dark-pressed` shifts to `{colors.primary-deep}`.

**`button-on-dark-pill`** — the hero CTA in pale violet pill shape.
- Background `{colors.surface-violet-soft}`, text `{colors.primary}`, same typography, padding 12px 20px, rounded `{rounded.full}`. The pill shape only appears on the hero — body CTAs use the rounded rectangle.

**`button-secondary-outline`** — outline alternative on white.
- Background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline-dark}` border, same shape as `button-primary-dark`.

**`button-on-teal`** — CTA inside the closing teal band.
- Background `{colors.canvas}`, text `{colors.surface-teal-deep}`, rounded-rectangle, same typography.

### Cards & Containers

**`card-feature-light`** — feature card on white.
- Background `{colors.canvas}`, padding `{spacing.xxl}`, rounded `{rounded.lg}`, 1px `{colors.hairline}` border.

**`card-pricing`** — standard pricing tier card.
- Background `{colors.canvas}`, padding `{spacing.xxl}`, rounded `{rounded.lg}`, 1px `{colors.hairline}` border.

**`card-pricing-featured`** — inverted indigo featured tier.
- Background `{colors.primary}`, text `{colors.on-primary}`, otherwise identical to `card-pricing`.

**`card-teal-band`** — the closing CTA band on every page.
- Background `{colors.surface-teal-deep}`, text `{colors.on-primary}`, padding `{spacing.huge}` 64px, rounded `{rounded.lg}` 12px (often radius-less in practice when full-bleed). Holds a single closing headline in `{typography.display-lg}` and a `button-on-teal`.

**`card-feature-row`** — alternating feature-row card on the body.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.xl}` 24px, rounded `{rounded.md}` 8px. Used in pairs/triplets to explain features below the hero.

### Inputs & Forms

**`text-input`** — standard form input.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, padding `{spacing.sm}+ {spacing.md}` (10px 12px), rounded `{rounded.sm}` 6px, 1px `{colors.hairline}` border.

### Navigation

**`nav-bar-dark`** — top nav over the indigo hero.
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.lg} {spacing.xl}`. Logo on the left, nav center, "Get Started" `button-on-dark-pill` on the right.

**`nav-bar-light`** — top nav on body / pricing pages.
- Background `{colors.canvas}`, text `{colors.ink}`, otherwise same structure with `button-primary-dark` on the right.

### Pills, Tags, and Chips

**`pill-tab-light`** — feature-row tab selector.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-cap}`, padding `{spacing.sm} {spacing.lg}`, rounded `{rounded.full}`. Used in the feature category picker (Mail / Channels / Code / AI / Calendar etc.) below the hero.

### Signature Components

**Half-Bleed Portrait Hero** — a person photographed at twilight, occupying the right half of the indigo hero with violet-sky atmospheric backdrop behind. Type and CTA sit on the left side. The portrait is the brand''s recurring visual signature.

**Closing Teal Band** — every page closes with a `card-teal-band` containing a `{typography.display-lg}` closing headline and a single `button-on-teal`. The teal is the page''s resolving chord.

**`link-on-light`** — inline links on body.
- Text `{colors.ink}` rendered in `{typography.body-md}` with persistent underline.

**`footer-light`** — site-wide footer.
- Background `{colors.canvas}`, text `{colors.ink-mute}`, type `{typography.caption}`, padding `{spacing.huge} {spacing.xl}` (64px 24px). Holds 4 columns of link groups, social icons, and a small legal/copyright row.

## Do''s and Don''ts

### Do
- Pair every hero with the violet-sky atmospheric backdrop and a half-bleed portrait subject when possible.
- Render display tiers at sub-default weights (460 / 540) — the warmth is the typographic signature.
- Use rounded-rectangle CTAs at 8px radius everywhere except the hero (where pill-shaped is the rule).
- Close every marketing page with a deep-teal CTA band.
- Use warm dark grey `{colors.ink}` for body text — never pure black.
- Apply tight 0.96 line-height on display sizes; the editorial compression is the brand.

### Don''t
- Don''t use pill-shaped buttons in the body of the page; the pill is hero-only.
- Don''t bump display weight above 540 unless using `body-strong` (700) for emphasized inline body.
- Don''t render body text in pure black — the warm grey `#292827` is part of the brand.
- Don''t omit the closing teal band — every marketing page closes with it.
- Don''t introduce additional accent colors beyond indigo, violet-soft, teal, and the off-warm-greys.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Wide | ≥ 1440px | Half-bleed portrait at full scale; teal band 128px tall |
| Desktop | 1024–1440px | Default content max-width; pricing 3-up |
| Tablet | 768–1023px | Pricing 2-up; portrait crops tighter |
| Mobile | < 768px | Pricing 1-up; hamburger nav; display drops 64 → 36px |

### Touch Targets
- Buttons hit ≥ 44×44px on mobile via 12px vertical padding × 16px line-height. WCAG AAA.
- Form fields stay at the 44px minimum height.

### Collapsing Strategy
- Display tiers stair-step 64 → 48 → 36 → 28 → 22px.
- Half-bleed portrait crops to head-and-shoulders on mobile; atmospheric backdrop simplifies.
- Pricing tiers stair-step 3-up → 2-up → 1-up.
- Top nav collapses to hamburger below 768px.
- Closing teal band reduces vertical padding from 128 → 64px on mobile.

### Image Behavior
Hero portrait uses `srcset` with desktop / mobile crops — desktop favors the full half-bleed composition; mobile crops to head-and-shoulders.

## Iteration Guide

1. Focus on ONE component at a time.
2. Reference component names and tokens directly.
3. Run `npx @google/design.md lint DESIGN.md` after edits.
4. Default body to `{typography.body-md}`; reserve `{typography.body-lg}` for marketing leads.
5. Keep the three-canvas rhythm (indigo / white / teal) — adding a fourth canvas color breaks the system.
6. The closing teal band is non-negotiable — every marketing page resolves there.
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

Superhumon''s marketing pages open in an editorial dark register: a deep indigo navy `{colors.primary}` (`#1b1938`) canvas overlaid with a soft violet-and-sky atmospheric backdrop and a half-bleed portrait subject (often a person looking off-frame, photographed at twilight). Headlines render in `{typography.display-xxl}` (Super Sans VF at 64px / weight 540) with negative tracking, set in white over the indigo. A single rounded-rectangle CTA button anchors each band — never two, never three.

The body of every page flips to white. `{colors.canvas}` (`#ffffff`) takes over below the hero, with body type in `{colors.ink}` (`#292827` — a slightly warm dark grey, never pure black) and feature rows alternating between white and `{colors.canvas-soft}` (a barely-tinted off-white). Pricing tiers sit on this white surface; the featured tier inverts to the indigo navy, completing the brand''s binary polarity.

Every page closes with a **deep-teal CTA band** (`{colors.surface-teal-deep}` — `#0e3030`). The teal is a single chromatic interlude: rich, almost-black green-blue, that breaks up what would otherwise be an indigo/white-only page. The teal band always contains the closing CTA in `{typography.display-lg}` paired with a single white-pill button.

Typography runs **Super Sans VF** — a proprietary variable display sans — at unusual mid-weights (460, 540, 600). The variable axes let the brand pick precise sub-default weights that read as warmer and more human than typical 400/500/700 SaaS scales. Display sizes use negative letter-spacing of -1.32px to -0.315px depending on size; line-heights are unusually tight (0.96 on 48px display).

**Key Characteristics:**
- Three-canvas system: indigo navy (`{colors.primary}`) for hero, white (`{colors.canvas}`) for body, deep teal (`{colors.surface-teal-deep}`) for closing CTA.
- Half-bleed portrait subject in the hero with violet-sky atmospheric backdrop — the brand uses a person looking off-frame as a recurring visual.
- Single CTA per band; the marketing pages never crowd actions.
- Super Sans VF at sub-default weights (460, 540, 600) — the brand''s typographic warmth signature.
- Tight line-heights (0.96) on display sizes — vertical compression as editorial density.
- Off-warm-grey body ink (`#292827`) — never pure black; the brand''s quiet warmth.
- Pill-shaped on-hero CTA in pale violet (`{colors.surface-violet-soft}`); rounded-rectangle CTAs everywhere else.', '{"sourcePath":"docs/design-md/superhuman/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> **Source pages:** home (`/`), `/products/go-ai-assistant`, `/contact-sales`, `/plans`.

### Brand & Accent
- **Primary Indigo Navy** (`{colors.primary}` — `#1b1938`): The brand''s primary surface and CTA color. Hero canvas, filled rounded-rectangle button, featured pricing tier.
- **Indigo Deep** (`{colors.primary-deep}` — `#0e0c1f`): Pressed-state lift / deeper navy used in hero gradient stops.
- **Surface Violet Soft** (`{colors.surface-violet-soft}` — `#c9b4fa`): The hero pill-button fill — pale violet over the indigo canvas. Also appears in atmospheric backdrops.
- **Surface Teal Deep** (`{colors.surface-teal-deep}` — `#0e3030`): The signature closing-CTA band color. Rich green-blue, almost black.
- **Surface Teal Mid** (`{colors.surface-teal-mid}` — `#155555`): Slightly lifted teal for nested chrome inside the band.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): Default body background.
- **Canvas Soft** (`{colors.canvas-soft}` — `#fafaf8`): Barely-warm off-white for alternating feature-row bands.
- **Hairline** (`{colors.hairline}` — `#e8e4dd`): 1px borders, slightly warm grey.
- **Hairline Dark** (`{colors.hairline-dark}` — `#3f3a52`): 1px borders on dark surfaces.

### Text
- **Ink** (`{colors.ink}` — `#292827`): Default body text. Warm dark grey, never pure black.
- **Ink Mute** (`{colors.ink-mute}` — `#73706d`): Secondary text, captions.
- **Ink Faint** (`{colors.ink-faint}` — `#9a9794`): Tertiary / disabled text.
- **On Primary** (`{colors.on-primary}` — `#ffffff`): Text on dark navy / teal surfaces.
- **On Dark Mute** (`{colors.on-dark-mute}` — translucent white): Secondary text on dark.
- **On Dark Faint** (`{colors.on-dark-faint}` — translucent white): Tertiary text on dark.', '{"sourcePath":"docs/design-md/superhuman/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

The display and UI tier is **Super Sans VF** — a proprietary variable sans (variable axes for weight, with the brand using sub-default 460 / 540 / 600 weights). Fallback chain is the system font stack.

For substitution use **Inter Variable** (open-source) at weight 460 / 540 / 600 — Inter''s variable axes match Super Sans VF''s behavior closely. Avoid fixed-weight Inter at 400 / 500 / 600 — the brand specifically picks the in-between weights.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 64px | 540 | 0.96 | 0 | Hero headline |
| `{typography.display-xl}` | 48px | 460 | 0.96 | -1.32px | Section opener on light surfaces |
| `{typography.display-lg}` | 28px | 540 | 1.14 | -0.63px | Sub-section / feature title |
| `{typography.display-md}` | 22px | 460 | 1.1 | -0.315px | Card title |
| `{typography.heading-lg}` | 20px | 460 | 1.2 | -0.4px | Compact card title |
| `{typography.body-lg}` | 18px | 540 | 1.5 | -0.135px | Marketing body lead |
| `{typography.body-md}` | 16px | 460 | 1.5 | 0 | Default UI body |
| `{typography.body-strong}` | 18.72px | 700 | 1.5 | 0 | Emphasized body |
| `{typography.button-md}` | 16px | 700 | 1.0 | 0 | Rounded-rectangle button label |
| `{typography.button-cap}` | 14px | 600 | 1.0 | 0 | Compact button label |
| `{typography.caption}` | 14px | 460 | 1.4 | 0 | Helper, footnote |
| `{typography.micro}` | 12px | 540 | 1.4 | 0 | Pill label, fine print |

### Principles
- **Sub-default weights.** The brand picks 460 / 540 / 600 instead of 400 / 500 / 700 — a quiet warmth in the typography that distinguishes it from default SaaS systems.
- **Tight display leading.** 0.96 on 48–64px display — the type stacks unusually compact.
- **Negative tracking on display sizes.** -1.32px at 48px scaling proportionally — tightens the variable letterforms into editorial density.

### Note on Font Substitutes
**Inter Variable** (open-source via Google Fonts) is the recommended substitute. Set `font-variation-settings: "wght" 540` for display, 460 for body — Inter''s variable axes match. Avoid fixed-weight Inter; the in-between weights are the brand''s signature.', '{"sourcePath":"docs/design-md/superhuman/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 8px (with 2 / 4 / 12 sub-tokens for fine work).
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.huge}` 64px.
- **Section padding**: 64–96px on most sections; closing teal band uses 96–128px for editorial weight.
- **Card internal padding**: 32px on pricing cards; 24px on alternating feature rows.

### Grid & Container
- Hero spans full viewport width with the violet-sky backdrop edge-to-edge; content centers in a ~960px column.
- Body content centers in ~960–1100px.
- Pricing collapses 3-up → 2-up → 1-up at 1024 / 768 breakpoints.

### Whitespace Philosophy
The brand uses generous editorial whitespace on both polarities — dark hero and white body. Section gaps tend toward 96px; the teal closing band gets up to 128px of vertical air. The whitespace itself is part of the brand''s "considered, slow-tempo" feel.', '{"sourcePath":"docs/design-md/superhuman/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 | Flat | Default surface |
| 1 | `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` | Subtle card lift |
| 2 | `box-shadow: 0 8px 24px rgba(0,0,0,0.12)` | Floating panels, modals |
| 3 | Atmospheric backdrop (violet-sky over indigo) | The hero''s depth medium |

### Decorative Depth
The hero''s depth is the **violet-sky atmospheric backdrop** — a soft indigo-to-violet-to-sky-blue radial wash that sits behind the portrait subject. Implemented as a CSS radial gradient or large background image. Below the hero, depth is minimal — the white canvas is flat.', '{"sourcePath":"docs/design-md/superhuman/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Hairline tags |
| `{rounded.sm}` | 6px | Form inputs |
| `{rounded.md}` | 8px | Buttons (the brand''s signature button shape — rounded rectangle, never pill) |
| `{rounded.lg}` | 12px | Pricing cards, feature cards |
| `{rounded.xl}` | 16px | Modal dialogs, large feature cards |
| `{rounded.full}` | 9999px | Pill tabs in feature row, hero CTA |

### Photography Geometry
The hero uses **half-bleed portrait subjects** — a person photographed at twilight, looking off-frame, occupying the right half of the hero. The portrait extends edge-to-edge vertically and stops mid-canvas horizontally; type sits on the left side. Other photography is rare; product UI mockups handle most other illustrative needs.', '{"sourcePath":"docs/design-md/superhuman/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary-dark`** — the dominant rounded-rectangle CTA on white surfaces.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `{spacing.md} {spacing.xl}` (12px 20px), rounded `{rounded.md}` 8px.
- Pressed state `button-primary-dark-pressed` shifts to `{colors.primary-deep}`.

**`button-on-dark-pill`** — the hero CTA in pale violet pill shape.
- Background `{colors.surface-violet-soft}`, text `{colors.primary}`, same typography, padding 12px 20px, rounded `{rounded.full}`. The pill shape only appears on the hero — body CTAs use the rounded rectangle.

**`button-secondary-outline`** — outline alternative on white.
- Background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline-dark}` border, same shape as `button-primary-dark`.

**`button-on-teal`** — CTA inside the closing teal band.
- Background `{colors.canvas}`, text `{colors.surface-teal-deep}`, rounded-rectangle, same typography.

### Cards & Containers

**`card-feature-light`** — feature card on white.
- Background `{colors.canvas}`, padding `{spacing.xxl}`, rounded `{rounded.lg}`, 1px `{colors.hairline}` border.

**`card-pricing`** — standard pricing tier card.
- Background `{colors.canvas}`, padding `{spacing.xxl}`, rounded `{rounded.lg}`, 1px `{colors.hairline}` border.

**`card-pricing-featured`** — inverted indigo featured tier.
- Background `{colors.primary}`, text `{colors.on-primary}`, otherwise identical to `card-pricing`.

**`card-teal-band`** — the closing CTA band on every page.
- Background `{colors.surface-teal-deep}`, text `{colors.on-primary}`, padding `{spacing.huge}` 64px, rounded `{rounded.lg}` 12px (often radius-less in practice when full-bleed). Holds a single closing headline in `{typography.display-lg}` and a `button-on-teal`.

**`card-feature-row`** — alternating feature-row card on the body.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.xl}` 24px, rounded `{rounded.md}` 8px. Used in pairs/triplets to explain features below the hero.

### Inputs & Forms

**`text-input`** — standard form input.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, padding `{spacing.sm}+ {spacing.md}` (10px 12px), rounded `{rounded.sm}` 6px, 1px `{colors.hairline}` border.

### Navigation

**`nav-bar-dark`** — top nav over the indigo hero.
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.lg} {spacing.xl}`. Logo on the left, nav center, "Get Started" `button-on-dark-pill` on the right.

**`nav-bar-light`** — top nav on body / pricing pages.
- Background `{colors.canvas}`, text `{colors.ink}`, otherwise same structure with `button-primary-dark` on the right.

### Pills, Tags, and Chips

**`pill-tab-light`** — feature-row tab selector.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-cap}`, padding `{spacing.sm} {spacing.lg}`, rounded `{rounded.full}`. Used in the feature category picker (Mail / Channels / Code / AI / Calendar etc.) below the hero.

### Signature Components

**Half-Bleed Portrait Hero** — a person photographed at twilight, occupying the right half of the indigo hero with violet-sky atmospheric backdrop behind. Type and CTA sit on the left side. The portrait is the brand''s recurring visual signature.

**Closing Teal Band** — every page closes with a `card-teal-band` containing a `{typography.display-lg}` closing headline and a single `button-on-teal`. The teal is the page''s resolving chord.

**`link-on-light`** — inline links on body.
- Text `{colors.ink}` rendered in `{typography.body-md}` with persistent underline.

**`footer-light`** — site-wide footer.
- Background `{colors.canvas}`, text `{colors.ink-mute}`, type `{typography.caption}`, padding `{spacing.huge} {spacing.xl}` (64px 24px). Holds 4 columns of link groups, social icons, and a small legal/copyright row.', '{"sourcePath":"docs/design-md/superhuman/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Pair every hero with the violet-sky atmospheric backdrop and a half-bleed portrait subject when possible.
- Render display tiers at sub-default weights (460 / 540) — the warmth is the typographic signature.
- Use rounded-rectangle CTAs at 8px radius everywhere except the hero (where pill-shaped is the rule).
- Close every marketing page with a deep-teal CTA band.
- Use warm dark grey `{colors.ink}` for body text — never pure black.
- Apply tight 0.96 line-height on display sizes; the editorial compression is the brand.

### Don''t
- Don''t use pill-shaped buttons in the body of the page; the pill is hero-only.
- Don''t bump display weight above 540 unless using `body-strong` (700) for emphasized inline body.
- Don''t render body text in pure black — the warm grey `#292827` is part of the brand.
- Don''t omit the closing teal band — every marketing page closes with it.
- Don''t introduce additional accent colors beyond indigo, violet-soft, teal, and the off-warm-greys.', '{"sourcePath":"docs/design-md/superhuman/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Wide | ≥ 1440px | Half-bleed portrait at full scale; teal band 128px tall |
| Desktop | 1024–1440px | Default content max-width; pricing 3-up |
| Tablet | 768–1023px | Pricing 2-up; portrait crops tighter |
| Mobile | < 768px | Pricing 1-up; hamburger nav; display drops 64 → 36px |

### Touch Targets
- Buttons hit ≥ 44×44px on mobile via 12px vertical padding × 16px line-height. WCAG AAA.
- Form fields stay at the 44px minimum height.

### Collapsing Strategy
- Display tiers stair-step 64 → 48 → 36 → 28 → 22px.
- Half-bleed portrait crops to head-and-shoulders on mobile; atmospheric backdrop simplifies.
- Pricing tiers stair-step 3-up → 2-up → 1-up.
- Top nav collapses to hamburger below 768px.
- Closing teal band reduces vertical padding from 128 → 64px on mobile.

### Image Behavior
Hero portrait uses `srcset` with desktop / mobile crops — desktop favors the full half-bleed composition; mobile crops to head-and-shoulders.', '{"sourcePath":"docs/design-md/superhuman/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time.
2. Reference component names and tokens directly.
3. Run `npx @google/design.md lint DESIGN.md` after edits.
4. Default body to `{typography.body-md}`; reserve `{typography.body-lg}` for marketing leads.
5. Keep the three-canvas rhythm (indigo / white / teal) — adding a fourth canvas color breaks the system.
6. The closing teal band is non-negotiable — every marketing page resolves there.', '{"sourcePath":"docs/design-md/superhuman/DESIGN.md","category":"other"}'::jsonb, 0.75, 10);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_1', '#1b1938', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_2', '#0e0c1f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_3', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_4', '#292827', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_5', '#73706d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_6', '#9a9794', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_7', '#fafaf8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_8', '#c9b4fa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_9', '#0e3030', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_10', '#155555', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_11', '#e8e4dd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_12', '#3f3a52', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_13', '#bcbac9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md'), 'color', 'color_14', '#5a5772', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/superhuman/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/superhuman/DESIGN.md';


-- Tesla
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Tesla', 'tesla', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/tesla/DESIGN.md', null, 'seeded', '# Design System Inspired by Tesla

## 1. Visual Theme & Atmosphere

Tesla''s website is an exercise in radical subtraction — a digital showroom where the product is everything and the interface is almost nothing. The page opens with a full-viewport hero that fills the entire screen with cinematic car photography: three vehicles arranged on polished concrete against a hazy cityscape sky, with a single model name floating above in translucent white type. There are no decorative borders, no gradients, no patterns, no shadows. The UI exists only to provide just enough navigational structure to get out of the way. Every pixel that isn''t product imagery is white space, and that restraint is the design system''s most powerful statement.

The color philosophy is almost ascetic: a single blue (`#3E6AE1`) for primary calls to action, three shades of dark gray for text hierarchy, and white for everything else. The entire emotional weight is carried by photography — sprawling landscape shots, studio-lit vehicle profiles, and atmospheric environmental compositions that stretch edge-to-edge across each viewport-height section. The UI chrome dissolves into the imagery. The navigation bar floats above the hero with no visible background, border, or shadow — the TESLA wordmark and five navigation labels simply exist in the space, trusting the content beneath them to provide sufficient contrast.

Typography recently transitioned from Gotham to Universal Sans — a custom family split into "Display" for headlines and "Text" for body/UI elements — unifying the website, mobile app, and in-car software into a single typographic voice. The Display variant renders hero titles at 40px weight 500, while the Text variant handles everything from navigation (14px/500) to body copy (14px/400). The font carries a geometric precision with slightly humanist terminals that feels engineered rather than designed — exactly matching Tesla''s brand identity of technology that doesn''t need to announce itself. There are no text shadows, no text gradients, no decorative type treatments. Every letterform earns its place through clarity alone.

**Key Characteristics:**
- Full-viewport hero sections (100vh) dominated by cinematic car photography with minimal overlay UI
- Near-zero UI decoration: no shadows, no gradients, no borders, no patterns anywhere on the page
- Single accent color — Electric Blue (`#3E6AE1`) — used exclusively for primary CTA buttons
- Universal Sans font family (Display + Text) unifying web, app, and in-car interfaces
- Photography-first presentation where product imagery carries all emotional weight
- Frosted-glass navigation concept with transparent/white nav that floats over hero content
- 0.33s cubic-bezier transitions as the universal timing for all interactive state changes
- Carousel-driven hero with dot indicators and edge arrow navigation for multiple vehicle showcases
- "Ask a Question" persistent chatbot bar anchored to the viewport bottom

## 2. Color Palette & Roles

### Primary
- **Electric Blue** (`#3E6AE1`): Primary CTA button background — a confident, mid-saturation blue (rgb 62, 106, 225) that stands alone as the only chromatic color in the entire interface. Used exclusively for "Order Now" and other primary action buttons
- **Pure White** (`#FFFFFF`): Dominant background color for all surfaces, panels, navigation, and secondary button fills — the canvas that lets photography breathe

### Secondary & Accent
- **Promo Blue** (`#3E6AE1`): Blue also serves for promotional text ("0% APR Available") displayed over hero imagery in the same hue as the CTA — creating a visual link between incentive messaging and action
- No secondary accent colors exist. Tesla deliberately avoids color variety to maintain extreme visual discipline

### Surface & Background
- **White Canvas** (`#FFFFFF`): Page background, navigation panel, dropdown menus, and all surface containers
- **Light Ash** (`#F4F4F4`): Subtle alternate surface for section differentiation — barely perceptible shift from pure white (rgb 244, 244, 244)
- **Carbon Dark** (`#171A20`): Dark surface color for hero text overlays and potential dark-mode contexts (rgb 23, 26, 32) — a warm near-black with a blue undertone
- **Frosted Glass** (`rgba(255, 255, 255, 0.75)`): Semi-transparent white for navigation backdrop-filter effects on scroll

### Neutrals & Text
- **Carbon Dark** (`#171A20`): Primary heading and navigation text — the darkest text value (rgb 23, 26, 32), used for model names, nav labels, and hero titles on light backgrounds
- **Graphite** (`#393C41`): Body text and secondary content (rgb 57, 60, 65) — the default paragraph color, slightly warmer than pure gray
- **Pewter** (`#5C5E62`): Tertiary text for sub-links, secondary navigation links like "Learn" and "Order" (rgb 92, 94, 98)
- **Silver Fog** (`#8E8E8E`): Placeholder text in input fields and disabled states (rgb 142, 142, 142)
- **Cloud Gray** (`#EEEEEE`): Light borders and divider lines (rgb 238, 238, 238)
- **Pale Silver** (`#D0D1D2`): Subtle UI borders and delineation (rgb 208, 209, 210)

### Semantic & Accent
- Tesla''s marketing site avoids semantic color coding (no green/red/yellow status indicators). Error, success, and warning states follow standard browser defaults in form contexts
- The blue CTA (`#3E6AE1`) serves as the sole interactive color signal

### Gradient System
- No gradients are used anywhere in the interface
- Depth is achieved entirely through photography, whitespace, and the binary contrast between full-bleed imagery and clean white surfaces
- The navigation achieves layering through opacity (frosted glass effect) rather than gradient or shadow

## 3. Typography Rules

### Font Family
- **Display**: `Universal Sans Display`, -apple-system, Arial, sans-serif — used for hero titles and large model names. A geometric sans-serif with precisely engineered proportions, recently replacing Gotham to unify Tesla''s digital ecosystem (website, mobile app, vehicle interface)
- **Text/UI**: `Universal Sans Text`, -apple-system, Arial, sans-serif — used for navigation, body copy, buttons, and all UI text. Optimized for legibility at smaller sizes with slightly wider proportions than the Display variant
- **No OpenType features** detected — typography is completely unembellished
- **No italic variants** observed on the marketing site

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| Hero Title | 40px (2.50rem) | 500 | 48px (1.20) | normal | Universal Sans Display, white on dark hero imagery |
| Product Name | 17px (1.06rem) | 500 | 20px (1.18) | normal | Universal Sans Text, model names in nav panel and cards |
| Nav Item | 14px (0.88rem) | 500 | 16.8px (1.20) | normal | Universal Sans Text, primary navigation labels |
| Body Text | 14px (0.88rem) | 400 | 20px (1.43) | normal | Universal Sans Text, paragraph and descriptive content |
| Button Label | 14px (0.88rem) | 500 | 16.8px (1.20) | normal | Universal Sans Text, CTA button text |
| Sub-link | 14px (0.88rem) | 400 | 20px (1.43) | normal | Tertiary links (Learn, Order, Experience) |
| Promo Text | 22px (1.38rem) | 400 | 20px (0.91) | normal | White promotional text on hero ("0% APR Available") |
| Category Label | 16px (est.) | 500 | — | normal | White text labels on category cards ("Sport Sedan") |

### Principles
- **"Normal" letter-spacing everywhere**: Unlike most modern tech brands that use negative tracking for headlines, Tesla uses default letter-spacing at every level. This reflects a philosophy that the typeface should speak for itself without manipulation
- **Weight restraint**: Only two weights appear — 500 (medium) for headings/UI and 400 (regular) for body. No bold (700), no light (300). The system avoids typographic drama
- **Unified font sizing**: Most UI text clusters at 14px with only hero titles (40px) and promo text (22px) breaking away. This extreme uniformity creates a sense of engineered consistency
- **Display vs Text split**: The two-variant system (Display for hero, Text for UI) creates subtle optical correction without visible stylistic difference — they appear as the same typeface at different sizes
- **No text transforms**: No uppercase text appears in the main navigation or CTAs — the lowercase approach reinforces Tesla''s understated confidence

## 4. Component Stylings

### Buttons
All buttons use barely-rounded rectangles (4px border-radius) — creating a sharp, technical aesthetic that mirrors the precision of the vehicles.

**Primary CTA** — The main action button:
- Default: bg `#3E6AE1` (Electric Blue), text `#FFFFFF`, fontSize 14px, fontWeight 500, padding 4px with inner content centering, borderRadius 4px, minHeight 40px, width 200px
- Border: 3px solid transparent (reserves space for focus/active border animation)
- Box Shadow: `rgba(0,0,0,0) 0px 0px 0px 2px inset` (invisible at rest, animates to visible on focus)
- Transition: `border-color 0.33s, background-color 0.33s, color 0.33s, box-shadow 0.25s`
- Hover: subtle darkening of blue background
- Used for: "Order Now" calls to action

**Secondary CTA** — The alternative action button:
- Default: bg `#FFFFFF`, text `#393C41` (Graphite), same dimensions and border pattern as primary
- Transition: identical timing to primary (0.33s)
- Used for: "View Inventory" alongside primary CTA

**Nav Button** — Top navigation items:
- Default: bg transparent, text `#171A20` (Carbon Dark), fontSize 14px, fontWeight 500, borderRadius 4px, padding 4px 16px, minHeight 32px
- Transition: `color 0.33s, background-color 0.33s`
- Active/expanded: subtle background highlight
- Used for: "Vehicles", "Energy", "Charging", "Discover", "Shop"

**Text Link** — In-content actions:
- Default: text `#5C5E62` (Pewter), fontSize 14px, fontWeight 400, no background, no border
- Hover: underline decoration with box-shadow transition
- Transition: `box-shadow 0.33s cubic-bezier(0.5, 0, 0, 0.75), color 0.33s`
- Used for: "Learn", "Order", "Experience", "New", "Pre-Owned" links in dropdown panel

### Cards & Containers

**Vehicle Card** (Navigation panel):
- Background: transparent (inherits panel white)
- Border: none
- Shadow: none
- Content: vehicle image (transparent PNG) + model name centered below + two text links
- Layout: 3-column grid within the dropdown panel
- No hover animation on the card itself — interaction is via the text links beneath

**Category Card** (Homepage lower section):
- Background: full-bleed landscape photography
- Border radius: approximately 12px (subtly rounded)
- Overflow: hidden (clips image to rounded corners)
- Text: white label in top-left corner ("Sport Sedan", "Midsize SUV")
- Size: large format, approximately 2:1 aspect ratio
- No shadow, no border, no overlay gradient — text relies on image darkness for contrast

### Inputs & Forms
- Background: transparent
- Text color: `#171A20` (Carbon Dark)
- Placeholder color: `#8E8E8E` (Silver Fog)
- Border: minimal, inherits from browser defaults
- Font: Universal Sans Text, 14px
- The "Ask a Question" chatbot input bar sits at the viewport bottom with a clean white background and subtle border

### Navigation
- **Desktop**: Centered horizontal nav with TESLA wordmark (spaced uppercase letters) on the left, five category buttons center-aligned, and three icon buttons (help, globe/language, account) on the right
- **Background**: White (transitions from transparent over dark hero to opaque white on scroll via class toggle `tds-site-header--white-background`)
- **Dropdown panel**: Full-width white panel with 3-column vehicle grid + right sidebar text links, no shadow, no border — appears seamlessly below the nav
- **Sticky behavior**: `sticky-without-slide` class — stays at top without slide-in animation
- **Mobile**: Hamburger collapse pattern
- **No visible separator** between nav and content — the nav blends with the hero

### Image Treatment
- **Hero**: Full-viewport (100vh) sections with cinematic photography — edge-to-edge, no padding, no margin
- **Vehicle images**: Transparent PNG renders on white background in dropdown panel, studio-quality 3/4 angle shots
- **Category cards**: Landscape photography with approximately 2:1 ratio, rounded corners (12px)
- **Carousel**: Auto-advancing with dot indicators (3 dots) and left/right arrow navigation on edges
- **Lazy loading**: Below-fold sections use lazy loading, rendering as blank white until scrolled into view

### Persistent Chat Bar
- Anchored to viewport bottom, visible across all sections
- White background with subtle border
- Contains: chat icon + "Ask a Question" label + placeholder text ("What''s Dog Mode?") + send icon + "Schedule a Drive Today" secondary CTA
- Schedule CTA has a teal/blue icon accent

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Common values**: 8px (0.5rem), 16px (1rem), 21.44px (1.34rem)
- **Button padding**: 4px (minimal outer) with content centering via flexbox, 4px 16px for nav items
- **Section padding**: Full-viewport sections with content centered vertically
- **Card gap**: approximately 16px between category cards

### Grid & Container
- **Max width**: approximately 1383px (full viewport width used for most content)
- **Hero**: Full-bleed, edge-to-edge, 100vh sections
- **Navigation panel**: 3-column grid for vehicle cards with right-aligned text sidebar (~70/30 split)
- **Category cards**: 2-up horizontal layout (large left card + smaller right card)

### Whitespace Philosophy
Tesla uses whitespace as a luxury signal. The generous vertical spacing between sections (each section is a full viewport height) means you can only see one "message" at a time — one car, one model name, one CTA pair. This creates a gallery-like browsing experience where each scroll is a deliberate transition, not a continuous feed. White space is not empty — it''s the frame that elevates each vehicle to the status of art piece.

### Border Radius Scale
| Value | Context |
|-------|---------|
| 0px | Most elements — sharp edges are the default |
| 4px | Buttons (primary, secondary, nav items) — barely perceptible rounding |
| ~12px | Category cards — noticeable but restrained rounding on larger surfaces |
| 50% | Carousel dot indicators — perfect circles |

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Flat) | No shadow, no border | Default state for all elements — cards, panels, buttons at rest |
| Level 1 (Frost) | `rgba(255,255,255,0.75)` backdrop | Navigation bar on scroll — frosted glass transparency |
| Level 2 (Overlay) | `rgba(128,128,128,0.65)` | Modal overlays and region/cookie popups |
| Level 3 (Subtle) | `rgba(0,0,0,0.05)` | Minimal shadow hints on rare hover states |

### Shadow Philosophy
Tesla''s approach to elevation is essentially "none." The site avoids box-shadows entirely in its primary interface. Depth is communicated through three alternative strategies:
1. **Z-index layering**: The sticky navigation sits above hero content through positioning, not shadow
2. **Opacity-based transparency**: The frosted glass nav and overlay modals use background-color opacity rather than shadow to indicate layering
3. **Photography-as-depth**: The full-bleed images create their own visual depth through perspective, lighting, and composition — making UI shadows redundant

### Decorative Depth
- No gradients, glows, or atmospheric effects on UI elements
- The hero imagery itself provides all visual richness — sunset skies, reflected light on car surfaces, ground shadows from studio lighting
- The carousel arrow buttons use a semi-transparent white background to float above the hero imagery without disrupting it

## 7. Do''s and Don''ts

### Do
- Let photography dominate every screen — the product IS the design
- Use Electric Blue (`#3E6AE1`) exclusively for primary CTAs — never for decorative purposes
- Maintain viewport-height sections for major content blocks — one message per screen
- Keep typography at weight 400-500 only — no bold, no light, no extremes
- Use 4px border-radius for all interactive elements — precision over playfulness
- Trust whitespace as a luxury signal — never fill available space just because it''s empty
- Keep all transitions at 0.33s — consistency in motion is as important as consistency in color
- Use transparent PNG vehicle imagery on white backgrounds for product showcases
- Center CTAs horizontally below model names — the vertical rhythm is model → subtitle → buttons
- Maintain the Display/Text font split — Display for hero-scale text only, Text for everything else

### Don''t
- Add shadows to any element — elevation through shadow contradicts the flat, gallery aesthetic
- Use more than one chromatic color besides the blue CTA — the palette is intentionally monochrome-plus-one
- Apply gradients, patterns, or decorative backgrounds to surfaces — white and photography are the only backgrounds
- Use text larger than 40px on the web — the typography is deliberately restrained even at hero scale
- Add borders to cards or containers — separation is achieved through spacing, not lines
- Use uppercase text transforms — Tesla''s confidence is expressed through lowercase calm
- Introduce rounded-pill buttons or large border-radii — the 4px radius is deliberate and precise
- Override the Universal Sans family with other typefaces — cross-platform consistency is a core brand value
- Add hover animations with scale/translate transforms — Tesla''s interactions are color-only (background and border transitions)
- Clutter the viewport with multiple CTAs — every screen should have at most two action buttons

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Single-column layout, hamburger nav replaces horizontal labels, hero text scales to ~28px, CTA buttons stack vertically, category cards become full-width |
| Tablet | 768-1024px | 2-column nav panel, hero maintains full-viewport height, CTAs remain side-by-side, reduced horizontal padding |
| Desktop | 1024-1440px | Full horizontal nav, 3-column vehicle grid in dropdown, hero at 40px, side-by-side CTAs at 200px/160px width |
| Large Desktop | >1440px | Content remains centered, hero photography scales to fill wider viewports, max-width container for nav panel content |

### Touch Targets
- Primary CTA buttons: 200px × 40px minimum (well above 44×44px WCAG requirement)
- Nav buttons: minimum 32px height with 4px 16px padding — adequate touch targets
- Carousel arrows: ~44px square white semi-transparent buttons at viewport edges
- Text links ("Learn", "Order"): 14px text with adequate line-height spacing for touch

### Collapsing Strategy
- **Navigation**: Horizontal category buttons (Vehicles, Energy, Charging, Discover, Shop) collapse to a hamburger/drawer menu on mobile
- **Hero CTA pair**: Side-by-side buttons on desktop stack vertically on mobile
- **Category cards**: 2-up horizontal layout collapses to single-column full-width on mobile
- **Vehicle grid**: 3-column grid in desktop nav panel becomes 2-column on tablet, single-column on mobile
- **Spacing**: Section vertical padding remains generous (viewport-height sections) but horizontal padding reduces

### Image Behavior
- Hero images are fully responsive and fill the entire viewport at every breakpoint
- Vehicle carousel images use `object-fit: cover` to maintain cinematic composition across widths
- Transparent PNG vehicle images in the nav panel scale proportionally within their grid cells
- Category card images maintain their landscape ratio and clip via `overflow: hidden` with border-radius

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: "Electric Blue (#3E6AE1)"
- Background: "Pure White (#FFFFFF)"
- Heading text: "Carbon Dark (#171A20)"
- Body text: "Graphite (#393C41)"
- Tertiary text: "Pewter (#5C5E62)"
- Placeholder: "Silver Fog (#8E8E8E)"
- Alternate surface: "Light Ash (#F4F4F4)"
- Dark surface: "Carbon Dark (#171A20)"

### Example Component Prompts
- "Create a hero section with a full-viewport background image, centered ''Model Y'' title in Universal Sans Display at 40px weight 500 in white, a subtitle line below, and two buttons side by side: a primary Electric Blue (#3E6AE1) ''Order Now'' button and a secondary white ''View Inventory'' button, both with 4px border-radius and 40px height"
- "Design a navigation bar with a spaced-letter wordmark on the left, five text buttons (14px, weight 500, Carbon Dark #171A20) centered, and three icon buttons on the right, all on a white background with no shadow or border"
- "Build a vehicle card grid with 3 columns, each card showing a transparent-background car image above a model name (17px, weight 500, Carbon Dark) and two text links (14px, weight 400, Pewter #5C5E62) labeled ''Learn'' and ''Order'', on a pure white surface with no borders or shadows"
- "Create a category card with full-bleed landscape photography, 12px border-radius, overflow hidden, and a white text label (''Sport Sedan'') positioned in the top-left corner with no overlay gradient"
- "Design a persistent bottom bar with a chat input (''Ask a Question'' placeholder), a send icon, and a secondary CTA (''Schedule a Drive Today'') with a teal icon, anchored to the viewport bottom on a white background"

### Iteration Guide
When refining existing screens generated with this design system:
1. Focus on ONE component at a time — Tesla''s system is so minimal that each element must be pixel-perfect
2. Reference specific color names and hex codes from this document — there are only 6-7 colors in the entire system
3. Use natural language descriptions, not CSS values — "barely rounded corners" not "border-radius: 4px"
4. Describe the desired "feel" alongside specific measurements — "gallery-like silence between sections" communicates the whitespace philosophy better than "margin-bottom: 100vh"
5. Always verify that photography is doing the emotional heavy-lifting — if the UI itself feels "designed," it''s too much
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
((select id from d), 'other', 'Design System Inspired by Tesla', 'other', '# Design System Inspired by Tesla', '{"sourcePath":"docs/design-md/tesla/DESIGN.md","category":"other"}'::jsonb, 0.75, 1),
((select id from d), 'overview', '1. Visual Theme & Atmosphere', 'overview', '## 1. Visual Theme & Atmosphere

Tesla''s website is an exercise in radical subtraction — a digital showroom where the product is everything and the interface is almost nothing. The page opens with a full-viewport hero that fills the entire screen with cinematic car photography: three vehicles arranged on polished concrete against a hazy cityscape sky, with a single model name floating above in translucent white type. There are no decorative borders, no gradients, no patterns, no shadows. The UI exists only to provide just enough navigational structure to get out of the way. Every pixel that isn''t product imagery is white space, and that restraint is the design system''s most powerful statement.

The color philosophy is almost ascetic: a single blue (`#3E6AE1`) for primary calls to action, three shades of dark gray for text hierarchy, and white for everything else. The entire emotional weight is carried by photography — sprawling landscape shots, studio-lit vehicle profiles, and atmospheric environmental compositions that stretch edge-to-edge across each viewport-height section. The UI chrome dissolves into the imagery. The navigation bar floats above the hero with no visible background, border, or shadow — the TESLA wordmark and five navigation labels simply exist in the space, trusting the content beneath them to provide sufficient contrast.

Typography recently transitioned from Gotham to Universal Sans — a custom family split into "Display" for headlines and "Text" for body/UI elements — unifying the website, mobile app, and in-car software into a single typographic voice. The Display variant renders hero titles at 40px weight 500, while the Text variant handles everything from navigation (14px/500) to body copy (14px/400). The font carries a geometric precision with slightly humanist terminals that feels engineered rather than designed — exactly matching Tesla''s brand identity of technology that doesn''t need to announce itself. There are no text shadows, no text gradients, no decorative type treatments. Every letterform earns its place through clarity alone.

**Key Characteristics:**
- Full-viewport hero sections (100vh) dominated by cinematic car photography with minimal overlay UI
- Near-zero UI decoration: no shadows, no gradients, no borders, no patterns anywhere on the page
- Single accent color — Electric Blue (`#3E6AE1`) — used exclusively for primary CTA buttons
- Universal Sans font family (Display + Text) unifying web, app, and in-car interfaces
- Photography-first presentation where product imagery carries all emotional weight
- Frosted-glass navigation concept with transparent/white nav that floats over hero content
- 0.33s cubic-bezier transitions as the universal timing for all interactive state changes
- Carousel-driven hero with dot indicators and edge arrow navigation for multiple vehicle showcases
- "Ask a Question" persistent chatbot bar anchored to the viewport bottom', '{"sourcePath":"docs/design-md/tesla/DESIGN.md","category":"overview"}'::jsonb, 0.75, 2),
((select id from d), 'colors', '2. Color Palette & Roles', 'colors', '## 2. Color Palette & Roles

### Primary
- **Electric Blue** (`#3E6AE1`): Primary CTA button background — a confident, mid-saturation blue (rgb 62, 106, 225) that stands alone as the only chromatic color in the entire interface. Used exclusively for "Order Now" and other primary action buttons
- **Pure White** (`#FFFFFF`): Dominant background color for all surfaces, panels, navigation, and secondary button fills — the canvas that lets photography breathe

### Secondary & Accent
- **Promo Blue** (`#3E6AE1`): Blue also serves for promotional text ("0% APR Available") displayed over hero imagery in the same hue as the CTA — creating a visual link between incentive messaging and action
- No secondary accent colors exist. Tesla deliberately avoids color variety to maintain extreme visual discipline

### Surface & Background
- **White Canvas** (`#FFFFFF`): Page background, navigation panel, dropdown menus, and all surface containers
- **Light Ash** (`#F4F4F4`): Subtle alternate surface for section differentiation — barely perceptible shift from pure white (rgb 244, 244, 244)
- **Carbon Dark** (`#171A20`): Dark surface color for hero text overlays and potential dark-mode contexts (rgb 23, 26, 32) — a warm near-black with a blue undertone
- **Frosted Glass** (`rgba(255, 255, 255, 0.75)`): Semi-transparent white for navigation backdrop-filter effects on scroll

### Neutrals & Text
- **Carbon Dark** (`#171A20`): Primary heading and navigation text — the darkest text value (rgb 23, 26, 32), used for model names, nav labels, and hero titles on light backgrounds
- **Graphite** (`#393C41`): Body text and secondary content (rgb 57, 60, 65) — the default paragraph color, slightly warmer than pure gray
- **Pewter** (`#5C5E62`): Tertiary text for sub-links, secondary navigation links like "Learn" and "Order" (rgb 92, 94, 98)
- **Silver Fog** (`#8E8E8E`): Placeholder text in input fields and disabled states (rgb 142, 142, 142)
- **Cloud Gray** (`#EEEEEE`): Light borders and divider lines (rgb 238, 238, 238)
- **Pale Silver** (`#D0D1D2`): Subtle UI borders and delineation (rgb 208, 209, 210)

### Semantic & Accent
- Tesla''s marketing site avoids semantic color coding (no green/red/yellow status indicators). Error, success, and warning states follow standard browser defaults in form contexts
- The blue CTA (`#3E6AE1`) serves as the sole interactive color signal

### Gradient System
- No gradients are used anywhere in the interface
- Depth is achieved entirely through photography, whitespace, and the binary contrast between full-bleed imagery and clean white surfaces
- The navigation achieves layering through opacity (frosted glass effect) rather than gradient or shadow', '{"sourcePath":"docs/design-md/tesla/DESIGN.md","category":"colors"}'::jsonb, 0.75, 3),
((select id from d), 'typography', '3. Typography Rules', 'typography', '## 3. Typography Rules

### Font Family
- **Display**: `Universal Sans Display`, -apple-system, Arial, sans-serif — used for hero titles and large model names. A geometric sans-serif with precisely engineered proportions, recently replacing Gotham to unify Tesla''s digital ecosystem (website, mobile app, vehicle interface)
- **Text/UI**: `Universal Sans Text`, -apple-system, Arial, sans-serif — used for navigation, body copy, buttons, and all UI text. Optimized for legibility at smaller sizes with slightly wider proportions than the Display variant
- **No OpenType features** detected — typography is completely unembellished
- **No italic variants** observed on the marketing site

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| Hero Title | 40px (2.50rem) | 500 | 48px (1.20) | normal | Universal Sans Display, white on dark hero imagery |
| Product Name | 17px (1.06rem) | 500 | 20px (1.18) | normal | Universal Sans Text, model names in nav panel and cards |
| Nav Item | 14px (0.88rem) | 500 | 16.8px (1.20) | normal | Universal Sans Text, primary navigation labels |
| Body Text | 14px (0.88rem) | 400 | 20px (1.43) | normal | Universal Sans Text, paragraph and descriptive content |
| Button Label | 14px (0.88rem) | 500 | 16.8px (1.20) | normal | Universal Sans Text, CTA button text |
| Sub-link | 14px (0.88rem) | 400 | 20px (1.43) | normal | Tertiary links (Learn, Order, Experience) |
| Promo Text | 22px (1.38rem) | 400 | 20px (0.91) | normal | White promotional text on hero ("0% APR Available") |
| Category Label | 16px (est.) | 500 | — | normal | White text labels on category cards ("Sport Sedan") |

### Principles
- **"Normal" letter-spacing everywhere**: Unlike most modern tech brands that use negative tracking for headlines, Tesla uses default letter-spacing at every level. This reflects a philosophy that the typeface should speak for itself without manipulation
- **Weight restraint**: Only two weights appear — 500 (medium) for headings/UI and 400 (regular) for body. No bold (700), no light (300). The system avoids typographic drama
- **Unified font sizing**: Most UI text clusters at 14px with only hero titles (40px) and promo text (22px) breaking away. This extreme uniformity creates a sense of engineered consistency
- **Display vs Text split**: The two-variant system (Display for hero, Text for UI) creates subtle optical correction without visible stylistic difference — they appear as the same typeface at different sizes
- **No text transforms**: No uppercase text appears in the main navigation or CTAs — the lowercase approach reinforces Tesla''s understated confidence', '{"sourcePath":"docs/design-md/tesla/DESIGN.md","category":"typography"}'::jsonb, 0.75, 4),
((select id from d), 'components', '4. Component Stylings', 'components', '## 4. Component Stylings

### Buttons
All buttons use barely-rounded rectangles (4px border-radius) — creating a sharp, technical aesthetic that mirrors the precision of the vehicles.

**Primary CTA** — The main action button:
- Default: bg `#3E6AE1` (Electric Blue), text `#FFFFFF`, fontSize 14px, fontWeight 500, padding 4px with inner content centering, borderRadius 4px, minHeight 40px, width 200px
- Border: 3px solid transparent (reserves space for focus/active border animation)
- Box Shadow: `rgba(0,0,0,0) 0px 0px 0px 2px inset` (invisible at rest, animates to visible on focus)
- Transition: `border-color 0.33s, background-color 0.33s, color 0.33s, box-shadow 0.25s`
- Hover: subtle darkening of blue background
- Used for: "Order Now" calls to action

**Secondary CTA** — The alternative action button:
- Default: bg `#FFFFFF`, text `#393C41` (Graphite), same dimensions and border pattern as primary
- Transition: identical timing to primary (0.33s)
- Used for: "View Inventory" alongside primary CTA

**Nav Button** — Top navigation items:
- Default: bg transparent, text `#171A20` (Carbon Dark), fontSize 14px, fontWeight 500, borderRadius 4px, padding 4px 16px, minHeight 32px
- Transition: `color 0.33s, background-color 0.33s`
- Active/expanded: subtle background highlight
- Used for: "Vehicles", "Energy", "Charging", "Discover", "Shop"

**Text Link** — In-content actions:
- Default: text `#5C5E62` (Pewter), fontSize 14px, fontWeight 400, no background, no border
- Hover: underline decoration with box-shadow transition
- Transition: `box-shadow 0.33s cubic-bezier(0.5, 0, 0, 0.75), color 0.33s`
- Used for: "Learn", "Order", "Experience", "New", "Pre-Owned" links in dropdown panel

### Cards & Containers

**Vehicle Card** (Navigation panel):
- Background: transparent (inherits panel white)
- Border: none
- Shadow: none
- Content: vehicle image (transparent PNG) + model name centered below + two text links
- Layout: 3-column grid within the dropdown panel
- No hover animation on the card itself — interaction is via the text links beneath

**Category Card** (Homepage lower section):
- Background: full-bleed landscape photography
- Border radius: approximately 12px (subtly rounded)
- Overflow: hidden (clips image to rounded corners)
- Text: white label in top-left corner ("Sport Sedan", "Midsize SUV")
- Size: large format, approximately 2:1 aspect ratio
- No shadow, no border, no overlay gradient — text relies on image darkness for contrast

### Inputs & Forms
- Background: transparent
- Text color: `#171A20` (Carbon Dark)
- Placeholder color: `#8E8E8E` (Silver Fog)
- Border: minimal, inherits from browser defaults
- Font: Universal Sans Text, 14px
- The "Ask a Question" chatbot input bar sits at the viewport bottom with a clean white background and subtle border

### Navigation
- **Desktop**: Centered horizontal nav with TESLA wordmark (spaced uppercase letters) on the left, five category buttons center-aligned, and three icon buttons (help, globe/language, account) on the right
- **Background**: White (transitions from transparent over dark hero to opaque white on scroll via class toggle `tds-site-header--white-background`)
- **Dropdown panel**: Full-width white panel with 3-column vehicle grid + right sidebar text links, no shadow, no border — appears seamlessly below the nav
- **Sticky behavior**: `sticky-without-slide` class — stays at top without slide-in animation
- **Mobile**: Hamburger collapse pattern
- **No visible separator** between nav and content — the nav blends with the hero

### Image Treatment
- **Hero**: Full-viewport (100vh) sections with cinematic photography — edge-to-edge, no padding, no margin
- **Vehicle images**: Transparent PNG renders on white background in dropdown panel, studio-quality 3/4 angle shots
- **Category cards**: Landscape photography with approximately 2:1 ratio, rounded corners (12px)
- **Carousel**: Auto-advancing with dot indicators (3 dots) and left/right arrow navigation on edges
- **Lazy loading**: Below-fold sections use lazy loading, rendering as blank white until scrolled into view

### Persistent Chat Bar
- Anchored to viewport bottom, visible across all sections
- White background with subtle border
- Contains: chat icon + "Ask a Question" label + placeholder text ("What''s Dog Mode?") + send icon + "Schedule a Drive Today" secondary CTA
- Schedule CTA has a teal/blue icon accent', '{"sourcePath":"docs/design-md/tesla/DESIGN.md","category":"components"}'::jsonb, 0.75, 5),
((select id from d), 'layout', '5. Layout Principles', 'layout', '## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Common values**: 8px (0.5rem), 16px (1rem), 21.44px (1.34rem)
- **Button padding**: 4px (minimal outer) with content centering via flexbox, 4px 16px for nav items
- **Section padding**: Full-viewport sections with content centered vertically
- **Card gap**: approximately 16px between category cards

### Grid & Container
- **Max width**: approximately 1383px (full viewport width used for most content)
- **Hero**: Full-bleed, edge-to-edge, 100vh sections
- **Navigation panel**: 3-column grid for vehicle cards with right-aligned text sidebar (~70/30 split)
- **Category cards**: 2-up horizontal layout (large left card + smaller right card)

### Whitespace Philosophy
Tesla uses whitespace as a luxury signal. The generous vertical spacing between sections (each section is a full viewport height) means you can only see one "message" at a time — one car, one model name, one CTA pair. This creates a gallery-like browsing experience where each scroll is a deliberate transition, not a continuous feed. White space is not empty — it''s the frame that elevates each vehicle to the status of art piece.

### Border Radius Scale
| Value | Context |
|-------|---------|
| 0px | Most elements — sharp edges are the default |
| 4px | Buttons (primary, secondary, nav items) — barely perceptible rounding |
| ~12px | Category cards — noticeable but restrained rounding on larger surfaces |
| 50% | Carousel dot indicators — perfect circles |', '{"sourcePath":"docs/design-md/tesla/DESIGN.md","category":"layout"}'::jsonb, 0.75, 6),
((select id from d), 'elevation', '6. Depth & Elevation', 'elevation', '## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Flat) | No shadow, no border | Default state for all elements — cards, panels, buttons at rest |
| Level 1 (Frost) | `rgba(255,255,255,0.75)` backdrop | Navigation bar on scroll — frosted glass transparency |
| Level 2 (Overlay) | `rgba(128,128,128,0.65)` | Modal overlays and region/cookie popups |
| Level 3 (Subtle) | `rgba(0,0,0,0.05)` | Minimal shadow hints on rare hover states |

### Shadow Philosophy
Tesla''s approach to elevation is essentially "none." The site avoids box-shadows entirely in its primary interface. Depth is communicated through three alternative strategies:
1. **Z-index layering**: The sticky navigation sits above hero content through positioning, not shadow
2. **Opacity-based transparency**: The frosted glass nav and overlay modals use background-color opacity rather than shadow to indicate layering
3. **Photography-as-depth**: The full-bleed images create their own visual depth through perspective, lighting, and composition — making UI shadows redundant

### Decorative Depth
- No gradients, glows, or atmospheric effects on UI elements
- The hero imagery itself provides all visual richness — sunset skies, reflected light on car surfaces, ground shadows from studio lighting
- The carousel arrow buttons use a semi-transparent white background to float above the hero imagery without disrupting it', '{"sourcePath":"docs/design-md/tesla/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', '7. Do''s and Don''ts', 'dos_and_donts', '## 7. Do''s and Don''ts

### Do
- Let photography dominate every screen — the product IS the design
- Use Electric Blue (`#3E6AE1`) exclusively for primary CTAs — never for decorative purposes
- Maintain viewport-height sections for major content blocks — one message per screen
- Keep typography at weight 400-500 only — no bold, no light, no extremes
- Use 4px border-radius for all interactive elements — precision over playfulness
- Trust whitespace as a luxury signal — never fill available space just because it''s empty
- Keep all transitions at 0.33s — consistency in motion is as important as consistency in color
- Use transparent PNG vehicle imagery on white backgrounds for product showcases
- Center CTAs horizontally below model names — the vertical rhythm is model → subtitle → buttons
- Maintain the Display/Text font split — Display for hero-scale text only, Text for everything else

### Don''t
- Add shadows to any element — elevation through shadow contradicts the flat, gallery aesthetic
- Use more than one chromatic color besides the blue CTA — the palette is intentionally monochrome-plus-one
- Apply gradients, patterns, or decorative backgrounds to surfaces — white and photography are the only backgrounds
- Use text larger than 40px on the web — the typography is deliberately restrained even at hero scale
- Add borders to cards or containers — separation is achieved through spacing, not lines
- Use uppercase text transforms — Tesla''s confidence is expressed through lowercase calm
- Introduce rounded-pill buttons or large border-radii — the 4px radius is deliberate and precise
- Override the Universal Sans family with other typefaces — cross-platform consistency is a core brand value
- Add hover animations with scale/translate transforms — Tesla''s interactions are color-only (background and border transitions)
- Clutter the viewport with multiple CTAs — every screen should have at most two action buttons', '{"sourcePath":"docs/design-md/tesla/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', '8. Responsive Behavior', 'responsive_guidelines', '## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Single-column layout, hamburger nav replaces horizontal labels, hero text scales to ~28px, CTA buttons stack vertically, category cards become full-width |
| Tablet | 768-1024px | 2-column nav panel, hero maintains full-viewport height, CTAs remain side-by-side, reduced horizontal padding |
| Desktop | 1024-1440px | Full horizontal nav, 3-column vehicle grid in dropdown, hero at 40px, side-by-side CTAs at 200px/160px width |
| Large Desktop | >1440px | Content remains centered, hero photography scales to fill wider viewports, max-width container for nav panel content |

### Touch Targets
- Primary CTA buttons: 200px × 40px minimum (well above 44×44px WCAG requirement)
- Nav buttons: minimum 32px height with 4px 16px padding — adequate touch targets
- Carousel arrows: ~44px square white semi-transparent buttons at viewport edges
- Text links ("Learn", "Order"): 14px text with adequate line-height spacing for touch

### Collapsing Strategy
- **Navigation**: Horizontal category buttons (Vehicles, Energy, Charging, Discover, Shop) collapse to a hamburger/drawer menu on mobile
- **Hero CTA pair**: Side-by-side buttons on desktop stack vertically on mobile
- **Category cards**: 2-up horizontal layout collapses to single-column full-width on mobile
- **Vehicle grid**: 3-column grid in desktop nav panel becomes 2-column on tablet, single-column on mobile
- **Spacing**: Section vertical padding remains generous (viewport-height sections) but horizontal padding reduces

### Image Behavior
- Hero images are fully responsive and fill the entire viewport at every breakpoint
- Vehicle carousel images use `object-fit: cover` to maintain cinematic composition across widths
- Transparent PNG vehicle images in the nav panel scale proportionally within their grid cells
- Category card images maintain their landscape ratio and clip via `overflow: hidden` with border-radius', '{"sourcePath":"docs/design-md/tesla/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', '9. Agent Prompt Guide', 'other', '## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: "Electric Blue (#3E6AE1)"
- Background: "Pure White (#FFFFFF)"
- Heading text: "Carbon Dark (#171A20)"
- Body text: "Graphite (#393C41)"
- Tertiary text: "Pewter (#5C5E62)"
- Placeholder: "Silver Fog (#8E8E8E)"
- Alternate surface: "Light Ash (#F4F4F4)"
- Dark surface: "Carbon Dark (#171A20)"

### Example Component Prompts
- "Create a hero section with a full-viewport background image, centered ''Model Y'' title in Universal Sans Display at 40px weight 500 in white, a subtitle line below, and two buttons side by side: a primary Electric Blue (#3E6AE1) ''Order Now'' button and a secondary white ''View Inventory'' button, both with 4px border-radius and 40px height"
- "Design a navigation bar with a spaced-letter wordmark on the left, five text buttons (14px, weight 500, Carbon Dark #171A20) centered, and three icon buttons on the right, all on a white background with no shadow or border"
- "Build a vehicle card grid with 3 columns, each card showing a transparent-background car image above a model name (17px, weight 500, Carbon Dark) and two text links (14px, weight 400, Pewter #5C5E62) labeled ''Learn'' and ''Order'', on a pure white surface with no borders or shadows"
- "Create a category card with full-bleed landscape photography, 12px border-radius, overflow hidden, and a white text label (''Sport Sedan'') positioned in the top-left corner with no overlay gradient"
- "Design a persistent bottom bar with a chat input (''Ask a Question'' placeholder), a send icon, and a secondary CTA (''Schedule a Drive Today'') with a teal icon, anchored to the viewport bottom on a white background"

### Iteration Guide
When refining existing screens generated with this design system:
1. Focus on ONE component at a time — Tesla''s system is so minimal that each element must be pixel-perfect
2. Reference specific color names and hex codes from this document — there are only 6-7 colors in the entire system
3. Use natural language descriptions, not CSS values — "barely rounded corners" not "border-radius: 4px"
4. Describe the desired "feel" alongside specific measurements — "gallery-like silence between sections" communicates the whitespace philosophy better than "margin-bottom: 100vh"
5. Always verify that photography is doing the emotional heavy-lifting — if the UI itself feels "designed," it''s too much', '{"sourcePath":"docs/design-md/tesla/DESIGN.md","category":"other"}'::jsonb, 0.75, 10);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/tesla/DESIGN.md'), 'color', 'color_1', '#3E6AE1', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/tesla/DESIGN.md'), 'color', 'color_2', '#FFFFFF', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/tesla/DESIGN.md'), 'color', 'color_3', '#F4F4F4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/tesla/DESIGN.md'), 'color', 'color_4', '#171A20', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/tesla/DESIGN.md'), 'color', 'color_5', '#393C41', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/tesla/DESIGN.md'), 'color', 'color_6', '#5C5E62', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/tesla/DESIGN.md'), 'color', 'color_7', '#8E8E8E', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/tesla/DESIGN.md'), 'color', 'color_8', '#EEEEEE', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/tesla/DESIGN.md'), 'color', 'color_9', '#D0D1D2', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/tesla/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/tesla/DESIGN.md';


-- Theverge
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Theverge', 'theverge', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/theverge/DESIGN.md', null, 'seeded', '# Design System Inspired by The Verge

## 1. Visual Theme & Atmosphere

The Verge''s 2024 redesign feels like somebody wired a Condé Nast magazine to a chiptune soundboard. The canvas is almost-black (`#131313`), the headlines are built from a brutally heavy display face (Manuka) that runs up to 107px, and the whole page is peppered with acid-mint `#3cffd0` and ultraviolet `#5200ff` that behave less like brand colors and more like hazard tape. Story tiles are not quiet gray cards — they''re saturated, full-bleed color blocks (yellow, pink, orange, blue, purple) that feel like pasted-up rave flyers arranged into a timeline. The mood is "developer console meets club night meets tech tabloid": serious enough to cover a congressional hearing, loud enough to review a synthesizer.

What makes this system unmistakable is the **StoryStream** timeline: a vertical feed where every post is a rounded rectangle — often 20–40px radius — filled edge-to-edge with color, framed by a thin border, and marked by a mono-uppercase timestamp on its left rail. Stories don''t float on a grid; they stack on a dashed vertical rule like commits in a git log. Above that, a massive **"The Verge" wordmark** dominates the masthead in Manuka at hero scale, letting the reader know before any headline loads that this is editorial territory, not a template.

There is no "light mode" on the homepage — the dark canvas is the product, and the only time the palette inverts is when a single story tile takes a mint or yellow fill. The depth is almost entirely flat: **hairline 1px borders** (`#ffffff`, `#3cffd0`, or `#5200ff`) do the work that shadows would do on a Material-flavored site. Every container is either `#131313` with a 1px outline, a fully saturated accent block, or a slate-gray `#2d2d2d` secondary surface.

**Key Characteristics:**
- Near-black editorial canvas (`#131313`) as the default surface — no light mode on the homepage
- Acid-mint `#3cffd0` + ultraviolet `#5200ff` as hazard-tape accents, never quiet background wash
- Massive Manuka display headlines up to 107px — the single loudest type move in mainstream tech media
- Rounded pill-card everything: 20/24/30/40px corner radii, never square
- Fully saturated color-block story tiles (mint, purple, yellow, pink, orange, electric blue) on a dark page
- Timeline "StoryStream" feed with mono uppercase timestamps rather than a traditional magazine grid
- Flat depth — 1px borders in white, mint, purple do the work that shadows would do elsewhere

## 2. Color Palette & Roles

### Primary (Brand Hazards)
- **Jelly Mint** (`#3cffd0`): The Verge''s signature acid-mint accent. Used as CTA button fill, link underlines, active tab borders, and high-attention story-tile backgrounds. Treat it as the visual equivalent of neon safety paint — applied sparingly to the most important element on screen.
- **Verge Ultraviolet** (`#5200ff`): The complementary brand hazard. Used for secondary color-block tiles, promotional spans, and the occasional outlined button. Often applied at 0.9 alpha to soften its cathode intensity.

### Secondary & Accent
- **Console Mint Border** (`#309875`): A darker variant of the jelly mint used on card outlines and button borders where pure mint would over-saturate.
- **Deep Link Blue** (`#3860be`): The link *hover* color — the one moment blue appears on the site. It replaces mint/white/black on hover across every link style.
- **Focus Cyan** (`#1eaedb`): Reserved for button focus rings. Never shown outside a keyboard-focus state.
- **Purple Rule** (`#3d00bf`): A darker ultraviolet variant used as the vertical border on StoryStream `<li>` items.

### Surface & Background
- **Canvas Black** (`#131313`): The default dark surface for the entire homepage. Almost-but-not-quite pure black — has just enough warmth to feel like a printed newsprint negative rather than an OLED void.
- **Surface Slate** (`#2d2d2d`): Secondary card background, used when a story tile doesn''t need to be a saturated color block.
- **Image Frame** (`#313131`): The 1px border that wraps inline imagery.
- **Hazard White** (`#ffffff`): Used as story-tile fill, button border, and primary text. When white appears as a large block, it''s an editorial decision — a "spotlight" on that tile.
- **Absolute Black** (`#000000`): Reserved for text on the mint/yellow/white tiles — the only place it appears.

### Neutrals & Text
- **Primary Text** (`#ffffff`): Headlines and display text on the canvas.
- **Secondary Text** (`#949494`): Bylines, timestamps, photo credits. The mid-gray that anchors the metadata layer.
- **Muted Text** (`#e9e9e9`): Button text on dark slate buttons. Slightly off-white to reduce screen glare.
- **Inverted Text** (`#131313`): Used only on accent tiles (mint, yellow, white) to keep contrast legible.

### Semantic & Accent
- **Focus Ring** (`#1eaedb`): Keyboard focus only.
- **Overlay Black** (`rgba(0, 0, 0, 0.33)`): Subtle 1px ring used as the quiet shadow alternative on stacked cards.
- **Dim Gray** (`#8c8c8c`): Active/pressed button background — the "pressed down" state.

### Gradient System
The Verge uses **zero decorative gradients**. The only gradient-like treatment is the transition from a saturated accent story tile (mint/purple/yellow) back to the `#131313` canvas between rows. Color is applied in solid blocks, not as washes. This is a deliberate choice — the site''s hazard-tape visual identity would dissolve if anything faded.

## 3. Typography Rules

### Font Family
- **Manuka** (Klim Type Foundry) — fallback: Impact, Helvetica. The signature display face for The Verge wordmark and feature headlines. A heavy-weight (900) industrial sans-serif with a condensed, almost-athletic stance. Runs at 60–107px on the homepage, never smaller.
- **PolySans** (PanGram Pangram / Nikolas Wrobel) — fallback: Helvetica, Arial. The UI and secondary headline workhorse. Covers weights 300 / 500 / 700 across the system — everything from kicker captions to body decks.
- **PolySans Mono** — fallback: Courier New, Courier. The monospaced sibling, used exclusively for ALL-CAPS labels: kickers, timestamps, category tags, button labels. This mono-uppercase usage is the second-most-identifiable Verge detail after Manuka.
- **FK Roman Standard** (Florian Karsten) — fallback: Georgia. A serif used sparingly for specific body/caption treatments (article excerpts, certain review pulls). Adds a "print-magazine" counterpoint to the PolySans stack.
- **Roboto** — fallback: `-apple-system`, `system-ui`. Utility UI font for widgets and legacy modules.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Hero Wordmark / Display | Manuka | 107px / 6.69rem | 900 | 0.80 | 1.07px | The top-of-page "The Verge" logo and feature headlines |
| Secondary Display | Manuka | 90px / 5.63rem | 900 | 0.80 | — | Section-level feature headlines |
| Tertiary Display | Manuka | 60px / 3.75rem | 900 | 0.80 | — | Inline feature callouts |
| Large Headline | PolySans | 34px / 2.13rem | 700 | 1.00 | — | Section and module headlines |
| Heading Wide | PolySans | 32px / 2.00rem | 400 | 1.10 | 0.32px | Sub-heroes, promotional units |
| Heading Medium | PolySans | 24px / 1.50rem | 700 | 1.00 | — | Story tile headlines in the main feed |
| Heading Small | PolySans | 20px / 1.25rem | 700 | 1.00 | — | Compact tile headlines |
| Light Capitalized Label | PolySans | 19px / 1.19rem | 300 | 1.20 | 1.9px | Thin-weight capitalized eyebrows — a distinctive Verge move |
| All-Caps Label XL | PolySans | 18px / 1.13rem | 400 | 1.10 | 1.8px | UPPERCASE section kickers |
| Bold Body | PolySans | 16px / 1.00rem | 700 | 1.00 | — | Emphasis within decks |
| Body Relaxed | PolySans | 16px / 1.00rem | 500 | 1.60 | — | Long-form reading body |
| Inline Label | PolySans | 15px / 0.94rem | 400 | 1.20 | 0.15px | UI labels and secondary headlines |
| Body Compact | PolySans | 13px / 0.81rem | 400 | 1.60 | — | Secondary captions and decks |
| Eyebrow All-Caps | PolySans | 12px / 0.75rem | 400 | 1.30 | 1.8px | UPPERCASE kicker above tile headlines |
| Tag Label | PolySans | 12px / 0.75rem | 400 | 1.20 | 0.72px | UPPERCASE category tag |
| Caption Micro | PolySans | 11px / 0.69rem | 400 | 1.20 | 1.1px | UPPERCASE bylines |
| Meta Nano | PolySans | 10px / 0.63rem | 500 | 1.40 | 1.5px | UPPERCASE timestamp microtext |
| Mono Button Label | PolySans Mono | 12px / 0.75rem | 600 | 2.00 | 1.5px | UPPERCASE button text, very open leading |
| Mono Timestamp | PolySans Mono | 11px / 0.69rem | 500/600 | 1.20 | 1.1–1.8px | UPPERCASE StoryStream timestamps |
| Serif Body | FK Roman Standard | 16px / 1.00rem | 400 | 1.30 | -0.16px | Review decks, print-voice excerpts |
| Serif Caption | FK Roman Standard | 20px / 1.25rem | 400 | 1.20 | — | Magazine-style pull quotes |

### Principles
- **Manuka is always the hero, never the UI.** If you see Manuka below 60px you''re looking at a bug. It exists to *shout the brand*, not to label a button.
- **PolySans is the workhorse, PolySans Mono is its uniformed sibling.** Mono is used exclusively for UPPERCASE labels, timestamps, tags, and certain buttons. Lowercase mono doesn''t exist in this system.
- **Thin-weight (300) capitalized headlines** are a signature Verge move. The 19–20px weight-300 with 1.9px tracking creates a "fashion magazine whisper" that contrasts with the 107px Manuka shout above it. This whisper-vs-shout contrast is the typographic fingerprint.
- **Letter-spacing has two registers**: positive (0.72–1.9px) for ALL-CAPS mono and sans labels, negative (`-0.16px`) for the rare serif appearances, barely-positive (0.32px, 1.07px) for massive display. Plain 0 letter-spacing is rare.
- **FK Roman Standard is the editorial exception**, not the rule. Reserve it for long-form print-voice moments — reviews, critic pulls, masthead essays. Never use it in UI.
- **Line heights are tight** (0.80–1.30) for every display and label, relaxed (1.60–2.00) only for reading body and mono button labels. The leading jump is intentional — it gives the page a "telegraph ticker" rhythm.

### Note on Font Substitutes
The 0.80 line-height on Manuka display (107px, 90px, 60px) assumes the **proprietary Manuka face from Klim Type Foundry**, which has aggressively tight vertical metrics designed for athletic stance at large sizes. If you substitute with wide-metric open-source condensed displays like **Anton**, **Oswald**, **Bebas Neue**, or **Archivo Black**, loosen display line-heights by approximately **+0.10 to +0.15** to prevent ascender/descender collisions (e.g., 0.80 → 0.95). PolySans substitutes (Space Grotesk, DM Sans, Hanken Grotesk) work at the token values without adjustment — their metrics are close enough. PolySans Mono substitutes (Space Mono, JetBrains Mono) and FK Roman substitutes (Newsreader, Literata) also work without adjustment.

## 4. Component Stylings

### Buttons

**Primary — Jelly Mint Pill**
- Background: `#3cffd0` (Jelly Mint)
- Text: `#000000` (Absolute Black), PolySans 16px / 700 or PolySans Mono 12px / 600 UPPERCASE
- Border: none (pure fill)
- Border radius: `24px` — fully rounded pill
- Padding: `10px 24px`
- Outline: `none` at rest
- Hover: background shifts to `rgba(255, 255, 255, 0.2)` (translucent white), text stays black, adds a 1px `#c2c2c2` ring shadow
- Active: background `rgba(140, 140, 140, 0.87)`, opacity `0.5`, ring shadow `#8c8c8c`
- Focus: background `#1eaedb`, white text, 1px solid `#0500ff` border, translucent white focus ring
- Transition: ~180ms ease on background and shadow

**Secondary — Dark Slate Pill**
- Background: `#2d2d2d` (Surface Slate)
- Text: `#e9e9e9` (Muted Text), PolySans 16px / 400
- Border: none
- Border radius: `24px`
- Padding: `10px 24px`
- Outline: `rgb(233, 233, 233) none 0px`
- Hover: same translucent white invert as primary — `rgba(255, 255, 255, 0.2)` bg, black text, 1px `#c2c2c2` ring
- Focus: same cyan focus treatment as primary

**Tertiary — Outlined Mint**
- Background: transparent
- Text: `#3cffd0`, PolySans Mono 12px / 600 UPPERCASE, 1.5px tracking
- Border: `1px solid #3cffd0`
- Border radius: `40px` — larger pill for secondary outline style
- Padding: ~`10px 20px`
- Hover: inverts to mint fill, black text
- Transition: 150ms ease

**Outlined Ultraviolet (Promotional)**
- Background: transparent
- Text: `#5200ff` or `#ffffff`
- Border: `1px solid #5200ff`
- Border radius: `30px`
- Used for "Subscribe" or "Join the Stream" style promotional callouts

**Pill Tag (Non-interactive)**
- Background: saturated accent (`#3cffd0`, `#5200ff`, yellow, etc.)
- Text: black or white depending on background luminance
- Border radius: `20px` (tighter radius than buttons — this is the *text pill*)
- Font: PolySans Mono 11px / 600 UPPERCASE, 1.8px tracking
- Padding: ~`4px 10px`

### Cards & Containers

**StoryStream Tile**
- Background: either `#131313` + 1px white border, OR a saturated accent fill (mint, purple, yellow, pink, orange, white)
- Border radius: `20px` (standard) or `24px` (feature)
- Border: `1px solid #ffffff` (on dark) or `0px 0px 1px solid #3cffd0` (on mint) or nothing (on saturated fill)
- Padding: ~24–32px interior
- Hover: no lift, no scale — the headline text color transitions from white to `#3860be` (deep link blue)
- Transition: 150ms ease on color only

**Feature Card (Top Story)**
- Background: `#131313` with 1px hairline border, OR full-bleed color accent
- Border radius: `24px`
- Padding: 32px+
- Image inside: clipped to match the outer radius (`3px` or `4px` inner radius when nested)
- Hover: text color shift only; the image remains static

**StoryStream Rail (Timeline)**
- A vertical dashed or solid rule (1px `#3d00bf` or `#ffffff`) runs along the left edge of each item, marking the timeline spine
- Timestamps sit on the left rail in PolySans Mono 11px / 500 / UPPERCASE / 1.1px tracking
- Each entry is a pill-cornered rectangle separated from its neighbors by 12–16px vertical gap

### Inputs & Forms
- **Default**: `#131313` background, 1px solid `#ffffff` or `#949494` border, `2px` border radius (tight, newspaper-form feel), PolySans 15px text in `#ffffff`, placeholder in `#949494`.
- **Focus**: border transitions to `#3cffd0` (jelly mint) with optional `1px solid #5200ff` inner ring on deep focus. No glow.
- **Error**: border turns `#5200ff` (ultraviolet — used as error/alert accent here, not the usual red).
- **Transition**: ~150ms ease on border-color.

### Navigation

- **Top nav**: thin `#131313` bar with the Verge wordmark (Manuka) left-aligned, a search icon and a few UPPERCASE mono category links (12–14px, PolySans Mono, 1.5–1.8px tracking), and a single mint-pill CTA (usually "Subscribe") pinned right.
- **Wordmark**: massive on first scroll — the homepage treats the "The Verge" logo as a hero element, not a 32px corner logo.
- **Hover**: every link transitions from `#ffffff` to `#3860be` (deep link blue). No underline — it''s a color-only response.
- **Active section**: marked by a 1px mint underline (inset box-shadow `0px -1px 0px 0px inset #3cffd0`)
- **Mobile**: the wordmark shrinks, category nav collapses into a hamburger drawer. Inside the drawer, links are mono-uppercase and stack with 16–20px gaps.

### Image Treatment

- **Aspect ratios**: 16:9 dominates for hero and feature images, 4:3 for mid-feed, 1:1 for thumbnails and author avatars.
- **Corners**: always rounded to match the parent card — `3px`, `4px`, or inherit `20px` / `24px` from the tile.
- **Frame**: 1px `#313131` or `#ffffff` hairline around photography, giving a "contained Polaroid" feel.
- **Full-bleed**: only within the color-block tiles, where the image runs to the padded edge of the accent fill.
- **Hover**: static — no zoom, no scale, no opacity shift. The headline below is the only interactive response.
- **Lazy loading**: `loading="lazy"` on everything below the first fold; eager on the masthead hero only.

### StoryStream Timeline Item (Distinctive)

- Vertical rail line (1px `#3d00bf` or `#ffffff` on `#131313`)
- Mono timestamp on the left in PolySans Mono 11px / UPPERCASE
- Pill-cornered body card (20px radius) with kicker, headline, and optional deck
- Stacked vertically with 12–16px gap, the rail continuing between them
- Often interleaved with full-bleed accent tiles that "break" the timeline rhythm for emphasis

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px.
- **Scale**: 1, 2, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 20, 24, 25px.
- **Section padding**: 32–64px vertical between major feed sections. StoryStream items themselves are tighter — 12–16px gaps.
- **Card padding**: 20–32px interior. Feature cards expand to 40–48px.
- **Inline spacing**: kickers sit ~6–10px above headlines; headlines sit ~10–14px above decks; timestamps sit ~6–8px below decks.
- **Micro-scale**: The 2/4/5/6/9/10px values are used inside buttons, pills, and tight label clusters, not in the editorial grid.

### Grid & Container
- **Max width**: ~1280–1300px (dembrandt detected breakpoints at 1200/1280/1300).
- **Column patterns**: a 12-column underlying grid that resolves into 3-column hero + 1-column StoryStream rail + feature panels. The homepage feels freeform because color-block tiles frequently span 2–3 columns on a whim.
- **Container padding**: 24px mobile / 48px desktop on the outer edges.
- **Gutters**: 16–24px between columns, tighter (8–12px) inside StoryStream items.

### Whitespace Philosophy
The Verge treats whitespace like a club DJ treats silence — as a dramatic reset between loud moments. The canvas is so dark and the accents are so saturated that even 32px of empty `#131313` between two tiles acts as a palette cleanser. The page is not airy like Apple or Stripe; it''s **paced**, with loud hazard-color blocks interrupting stretches of near-black. Whitespace carries the rhythm, not the elegance.

### Border Radius Scale
- **2px** — inputs, small badges (feels like a typewriter tag)
- **3px** — inline images (just enough to soften against the canvas)
- **4px** — nested card images and small button variants
- **20px** — standard pill cards and color-block tiles
- **24px** — feature tile radius and primary button pill
- **30px** — large promotional buttons
- **40px** — outlined CTA pills (the loudest pill in the system)
- **50%** — avatar circles, icon buttons, and certain round badges

Eight discrete radius values — a **lot** for a single site. This is deliberate: the rhythm between 2px typewriter tags, 20px pill cards, and 40px outlined buttons creates a "nested scale" feel where every component announces its hierarchy through its corners.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | No border, no shadow | Default `#131313` canvas text |
| 1 | `rgba(0,0,0,0) 0px 0px 0px 0px inset` (placeholder) | Reset state for interactive elements |
| 2 | `1px solid #ffffff` or `#313131` hairline | Image frames and quiet card outlines |
| 3 | `1px solid #3cffd0` hairline | Active button outlines, focused story tiles |
| 4 | `1px solid #5200ff` hairline | Promotional/alternate state outlines |
| 5 | `rgba(0, 0, 0, 0.33) 0px 0px 0px 1px` | The single "atmospheric" ring — applied to layered cards |
| 6 | `0px -1px 0px 0px inset` (mint/black/white) | Active tab underline — a signature Verge move |
| 7 | Saturated accent fill (`#3cffd0`, `#5200ff`, white, yellow, pink) | Story-tile elevation via color, not shadow |

The Verge''s depth philosophy is **color-as-elevation**. When something needs to stand out, it doesn''t get a shadow — it gets a mint fill or a 1px hazard-color border. There are 14 shadow entries in the extracted tokens, but all of them are either inset underlines (0px -1px inset) or near-transparent 1px rings — none of them are traditional elevation shadows. The `#131313` canvas stays perfectly flat throughout, and hierarchy is carried by color saturation.

### Decorative Depth
- **1px inset underline** on active tabs/nav links (mint, black, or white depending on context)
- **Subtle `rgba(0, 0, 0, 0.33)` 1px ring** on stacked cards — the only effect that faintly resembles a shadow
- **No gradients, no glows, no atmospheric blurs** anywhere. The hazard-tape aesthetic would break if anything faded softly.

## 7. Do''s and Don''ts

### Do
- **Do** use `#131313` as the canvas for every view. There is no light mode.
- **Do** use Jelly Mint (`#3cffd0`) and Verge Ultraviolet (`#5200ff`) as hazard accents — buttons, borders, active states, and saturated color-block tiles.
- **Do** use Manuka exclusively at 60px+ for hero headlines. Treat anything smaller as a bug.
- **Do** round everything: 20px for cards, 24px for feature cards, 30–40px for pill buttons.
- **Do** use PolySans Mono for UPPERCASE labels, timestamps, kickers, and button text. Lowercase mono doesn''t exist here.
- **Do** apply 1.5–1.9px letter-spacing to every ALL-CAPS label — this is a Verge signature.
- **Do** use saturated color-block tiles (mint, purple, yellow, pink, orange, white) to elevate a story — never a drop shadow.
- **Do** use `#3860be` (deep link blue) as the hover color on every link, regardless of base color.
- **Do** apply the StoryStream timeline rail (1px dashed/solid `#3d00bf` or white) on feed views.
- **Do** use thin-weight (300) PolySans at 19–20px with 1.9px tracking for "fashion-whisper" capitalized eyebrows — the contrast with the 107px Manuka shout is the whole voice.

### Don''t
- **Don''t** use a light background. The dark canvas is the product.
- **Don''t** add `box-shadow` for elevation. Use 1px borders or saturated accent fills instead.
- **Don''t** use square corners. Every interactive and content container is rounded.
- **Don''t** use Manuka for UI, buttons, or body copy. It''s strictly display.
- **Don''t** use lowercase mono. PolySans Mono is always UPPERCASE.
- **Don''t** let mint and ultraviolet appear as background washes — they''re hazard accents, not canvas tints.
- **Don''t** use gradients anywhere. The system is solid color blocks only.
- **Don''t** introduce new accent colors outside the declared mint / purple / yellow / pink / orange tile palette.
- **Don''t** pair Manuka with FK Roman Standard in the same headline cluster — Manuka is the only display shout, serif pulls are reserved for body moments.
- **Don''t** use `#3cffd0` text on a `#131313` background at under 16px — the contrast vibrates at small sizes.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small Mobile | <400px | Single column, Manuka hero scales down to ~48–54px, StoryStream rail collapses to inline timestamps |
| Mobile | 400–549px | Single column, color-block tiles stack full-width, nav is a hamburger drawer |
| Large Mobile | 550–767px | Still single column but padding opens up, tile radii stay at 20px |
| Tablet | 768–1023px | 2-column StoryStream with feature card spanning, wordmark shrinks ~50% |
| Small Desktop | 1024–1179px | Full 3–4 column editorial grid, mint pill CTA restored to nav |
| Desktop | 1180–1299px | Max padding, Manuka wordmark at full hero scale |
| Large Desktop | ≥1300px | Container caps at ~1280–1300px, whitespace expands at the margins, no further scaling |

The dembrandt sweep detected 26 intermediate breakpoints (1300 → 1280 → 1200 → 1181 → 1180 → 1179 → 1024 → 1023 → 901 → 900 → 897 → 896 → 890 → 769 → 768 → 620 → 605 → 600 → 550 → 549 → 530 → 426 → 425 → 400 → 320). The Verge tunes its grid at virtually every major device boundary — an unusually aggressive responsive strategy.

### Touch Targets
- Primary pill buttons are ~44px minimum height (10px vertical padding + 16px text + 2px border) — meets WCAG AA.
- Mono uppercase nav links are smaller (~28–32px tall) — for derivative work, pad to 44px on mobile.
- Circle icon buttons are 40–44px circles, touch-friendly.

### Collapsing Strategy
- **Nav**: wordmark scales from hero (Manuka 60–107px) to ~24–32px on mobile. Category links collapse to a hamburger drawer below 900px.
- **Grid**: 4-col → 3-col → 2-col → 1-col. Feature cards that span 2 columns on desktop reflow to full-width single-column on mobile.
- **Spacing**: section padding tightens from 64px → 32px → 20px. Tile interior padding tightens from 32px → 20px.
- **Type**: Manuka hero scales from 107px to ~48–54px on mobile. PolySans headlines scale from 34px → 24px. Mono labels stay pinned at 11–12px (they don''t shrink further or they become unreadable).
- **Color tiles**: accent story blocks never lose saturation on mobile — they just reflow to full width.

### Image Behavior
- Responsive raster via `srcset`, aspect ratios preserved.
- No art-direction swaps — same crop scales across all viewports.
- `loading="lazy"` on everything below the fold, `eager` on the masthead hero.
- Images inside color-block tiles inherit the tile''s inner radius (4px or 20px nested).

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA**: "Jelly Mint (`#3cffd0`)"
- **Background (Canvas)**: "Canvas Black (`#131313`)"
- **Accent (Secondary Hazard)**: "Verge Ultraviolet (`#5200ff`)"
- **Heading Text**: "Hazard White (`#ffffff`)"
- **Body Text**: "Hazard White (`#ffffff`)" (primary) or "Muted Text (`#e9e9e9`)"
- **Secondary Text / Metadata**: "Secondary Text (`#949494`)"
- **Card Border**: "Hazard White (`#ffffff`)" hairline on dark, "Console Mint Border (`#309875`)" on mint variants
- **Link Hover**: "Deep Link Blue (`#3860be`)"

### Example Component Prompts
1. *"Create a StoryStream timeline item on a `#131313` canvas: a 20px-radius rectangle with a 1px solid `#ffffff` border, a PolySans Mono 11px / 600 / UPPERCASE / 1.1px tracking timestamp on the left rail, a 12px PolySans UPPERCASE kicker in mint (`#3cffd0`), and a 24px / 700 PolySans headline in white below. No shadow, no lift — hover only shifts the headline color to `#3860be`."*
2. *"Design a primary subscribe button with a Jelly Mint (`#3cffd0`) fill, black text in PolySans Mono 12px / 600 / UPPERCASE / 1.5px tracking, 24px border radius, 10px × 24px padding. Hover state shifts to `rgba(255, 255, 255, 0.2)` background with a 1px `#c2c2c2` ring shadow, 180ms ease."*
3. *"Build a feature hero with a 107px Manuka 900 headline in white with 1.07px letter-spacing and 0.80 line-height, a thin-weight 300 PolySans 20px capitalized kicker above with 1.9px tracking, on a `#131313` canvas with 64px vertical padding."*
4. *"Create a color-block accent tile filled with Verge Ultraviolet (`#5200ff`) at 0.9 alpha, 24px border radius, white text, a PolySans Mono 11px UPPERCASE category label with 1.5px tracking at the top, and a 32px PolySans 400 capitalized headline with 0.32px tracking below."*
5. *"Design a dark slate secondary button with a `#2d2d2d` background, `#e9e9e9` PolySans 16px text, 24px radius pill shape, 10px × 24px padding. Hover matches the primary button — translucent white `rgba(255, 255, 255, 0.2)` bg with black text."*

### Iteration Guide
When refining existing screens generated with this design system:
1. **Audit the canvas.** If you see a light background anywhere on the homepage, flatten it to `#131313`. There is no light mode.
2. **Audit corners.** Every rectangle should land on 2/3/4/20/24/30/40px or 50%. Square corners break the voice.
3. **Audit shadows.** Strip every `box-shadow` that isn''t a 1px inset underline or a 1px hazard-color border. The Verge uses color for elevation, not shadow.
4. **Audit type roles.** Manuka only ≥60px. PolySans Mono only UPPERCASE. PolySans 300 at 19–20px should have 1.9px tracking. FK Roman only for body/magazine moments, never UI.
5. **Audit accent usage.** Mint and ultraviolet should appear as hazard accents — buttons, 1px borders, active underlines, saturated tile fills. If they''re appearing as background washes or gradient fades, correct to solid blocks.
6. **Audit labels.** Every kicker, timestamp, category tag, and button label should be ALL CAPS with 1.1–1.9px letter-spacing. Missing tracking = missing voice.
7. **Audit link hover.** Every link, regardless of its base color, should hover to `#3860be` deep link blue with no underline. Any other hover color is drift.
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
((select id from d), 'other', 'Design System Inspired by The Verge', 'other', '# Design System Inspired by The Verge', '{"sourcePath":"docs/design-md/theverge/DESIGN.md","category":"other"}'::jsonb, 0.75, 1),
((select id from d), 'overview', '1. Visual Theme & Atmosphere', 'overview', '## 1. Visual Theme & Atmosphere

The Verge''s 2024 redesign feels like somebody wired a Condé Nast magazine to a chiptune soundboard. The canvas is almost-black (`#131313`), the headlines are built from a brutally heavy display face (Manuka) that runs up to 107px, and the whole page is peppered with acid-mint `#3cffd0` and ultraviolet `#5200ff` that behave less like brand colors and more like hazard tape. Story tiles are not quiet gray cards — they''re saturated, full-bleed color blocks (yellow, pink, orange, blue, purple) that feel like pasted-up rave flyers arranged into a timeline. The mood is "developer console meets club night meets tech tabloid": serious enough to cover a congressional hearing, loud enough to review a synthesizer.

What makes this system unmistakable is the **StoryStream** timeline: a vertical feed where every post is a rounded rectangle — often 20–40px radius — filled edge-to-edge with color, framed by a thin border, and marked by a mono-uppercase timestamp on its left rail. Stories don''t float on a grid; they stack on a dashed vertical rule like commits in a git log. Above that, a massive **"The Verge" wordmark** dominates the masthead in Manuka at hero scale, letting the reader know before any headline loads that this is editorial territory, not a template.

There is no "light mode" on the homepage — the dark canvas is the product, and the only time the palette inverts is when a single story tile takes a mint or yellow fill. The depth is almost entirely flat: **hairline 1px borders** (`#ffffff`, `#3cffd0`, or `#5200ff`) do the work that shadows would do on a Material-flavored site. Every container is either `#131313` with a 1px outline, a fully saturated accent block, or a slate-gray `#2d2d2d` secondary surface.

**Key Characteristics:**
- Near-black editorial canvas (`#131313`) as the default surface — no light mode on the homepage
- Acid-mint `#3cffd0` + ultraviolet `#5200ff` as hazard-tape accents, never quiet background wash
- Massive Manuka display headlines up to 107px — the single loudest type move in mainstream tech media
- Rounded pill-card everything: 20/24/30/40px corner radii, never square
- Fully saturated color-block story tiles (mint, purple, yellow, pink, orange, electric blue) on a dark page
- Timeline "StoryStream" feed with mono uppercase timestamps rather than a traditional magazine grid
- Flat depth — 1px borders in white, mint, purple do the work that shadows would do elsewhere', '{"sourcePath":"docs/design-md/theverge/DESIGN.md","category":"overview"}'::jsonb, 0.75, 2),
((select id from d), 'colors', '2. Color Palette & Roles', 'colors', '## 2. Color Palette & Roles

### Primary (Brand Hazards)
- **Jelly Mint** (`#3cffd0`): The Verge''s signature acid-mint accent. Used as CTA button fill, link underlines, active tab borders, and high-attention story-tile backgrounds. Treat it as the visual equivalent of neon safety paint — applied sparingly to the most important element on screen.
- **Verge Ultraviolet** (`#5200ff`): The complementary brand hazard. Used for secondary color-block tiles, promotional spans, and the occasional outlined button. Often applied at 0.9 alpha to soften its cathode intensity.

### Secondary & Accent
- **Console Mint Border** (`#309875`): A darker variant of the jelly mint used on card outlines and button borders where pure mint would over-saturate.
- **Deep Link Blue** (`#3860be`): The link *hover* color — the one moment blue appears on the site. It replaces mint/white/black on hover across every link style.
- **Focus Cyan** (`#1eaedb`): Reserved for button focus rings. Never shown outside a keyboard-focus state.
- **Purple Rule** (`#3d00bf`): A darker ultraviolet variant used as the vertical border on StoryStream `<li>` items.

### Surface & Background
- **Canvas Black** (`#131313`): The default dark surface for the entire homepage. Almost-but-not-quite pure black — has just enough warmth to feel like a printed newsprint negative rather than an OLED void.
- **Surface Slate** (`#2d2d2d`): Secondary card background, used when a story tile doesn''t need to be a saturated color block.
- **Image Frame** (`#313131`): The 1px border that wraps inline imagery.
- **Hazard White** (`#ffffff`): Used as story-tile fill, button border, and primary text. When white appears as a large block, it''s an editorial decision — a "spotlight" on that tile.
- **Absolute Black** (`#000000`): Reserved for text on the mint/yellow/white tiles — the only place it appears.

### Neutrals & Text
- **Primary Text** (`#ffffff`): Headlines and display text on the canvas.
- **Secondary Text** (`#949494`): Bylines, timestamps, photo credits. The mid-gray that anchors the metadata layer.
- **Muted Text** (`#e9e9e9`): Button text on dark slate buttons. Slightly off-white to reduce screen glare.
- **Inverted Text** (`#131313`): Used only on accent tiles (mint, yellow, white) to keep contrast legible.

### Semantic & Accent
- **Focus Ring** (`#1eaedb`): Keyboard focus only.
- **Overlay Black** (`rgba(0, 0, 0, 0.33)`): Subtle 1px ring used as the quiet shadow alternative on stacked cards.
- **Dim Gray** (`#8c8c8c`): Active/pressed button background — the "pressed down" state.

### Gradient System
The Verge uses **zero decorative gradients**. The only gradient-like treatment is the transition from a saturated accent story tile (mint/purple/yellow) back to the `#131313` canvas between rows. Color is applied in solid blocks, not as washes. This is a deliberate choice — the site''s hazard-tape visual identity would dissolve if anything faded.', '{"sourcePath":"docs/design-md/theverge/DESIGN.md","category":"colors"}'::jsonb, 0.75, 3),
((select id from d), 'typography', '3. Typography Rules', 'typography', '## 3. Typography Rules

### Font Family
- **Manuka** (Klim Type Foundry) — fallback: Impact, Helvetica. The signature display face for The Verge wordmark and feature headlines. A heavy-weight (900) industrial sans-serif with a condensed, almost-athletic stance. Runs at 60–107px on the homepage, never smaller.
- **PolySans** (PanGram Pangram / Nikolas Wrobel) — fallback: Helvetica, Arial. The UI and secondary headline workhorse. Covers weights 300 / 500 / 700 across the system — everything from kicker captions to body decks.
- **PolySans Mono** — fallback: Courier New, Courier. The monospaced sibling, used exclusively for ALL-CAPS labels: kickers, timestamps, category tags, button labels. This mono-uppercase usage is the second-most-identifiable Verge detail after Manuka.
- **FK Roman Standard** (Florian Karsten) — fallback: Georgia. A serif used sparingly for specific body/caption treatments (article excerpts, certain review pulls). Adds a "print-magazine" counterpoint to the PolySans stack.
- **Roboto** — fallback: `-apple-system`, `system-ui`. Utility UI font for widgets and legacy modules.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Hero Wordmark / Display | Manuka | 107px / 6.69rem | 900 | 0.80 | 1.07px | The top-of-page "The Verge" logo and feature headlines |
| Secondary Display | Manuka | 90px / 5.63rem | 900 | 0.80 | — | Section-level feature headlines |
| Tertiary Display | Manuka | 60px / 3.75rem | 900 | 0.80 | — | Inline feature callouts |
| Large Headline | PolySans | 34px / 2.13rem | 700 | 1.00 | — | Section and module headlines |
| Heading Wide | PolySans | 32px / 2.00rem | 400 | 1.10 | 0.32px | Sub-heroes, promotional units |
| Heading Medium | PolySans | 24px / 1.50rem | 700 | 1.00 | — | Story tile headlines in the main feed |
| Heading Small | PolySans | 20px / 1.25rem | 700 | 1.00 | — | Compact tile headlines |
| Light Capitalized Label | PolySans | 19px / 1.19rem | 300 | 1.20 | 1.9px | Thin-weight capitalized eyebrows — a distinctive Verge move |
| All-Caps Label XL | PolySans | 18px / 1.13rem | 400 | 1.10 | 1.8px | UPPERCASE section kickers |
| Bold Body | PolySans | 16px / 1.00rem | 700 | 1.00 | — | Emphasis within decks |
| Body Relaxed | PolySans | 16px / 1.00rem | 500 | 1.60 | — | Long-form reading body |
| Inline Label | PolySans | 15px / 0.94rem | 400 | 1.20 | 0.15px | UI labels and secondary headlines |
| Body Compact | PolySans | 13px / 0.81rem | 400 | 1.60 | — | Secondary captions and decks |
| Eyebrow All-Caps | PolySans | 12px / 0.75rem | 400 | 1.30 | 1.8px | UPPERCASE kicker above tile headlines |
| Tag Label | PolySans | 12px / 0.75rem | 400 | 1.20 | 0.72px | UPPERCASE category tag |
| Caption Micro | PolySans | 11px / 0.69rem | 400 | 1.20 | 1.1px | UPPERCASE bylines |
| Meta Nano | PolySans | 10px / 0.63rem | 500 | 1.40 | 1.5px | UPPERCASE timestamp microtext |
| Mono Button Label | PolySans Mono | 12px / 0.75rem | 600 | 2.00 | 1.5px | UPPERCASE button text, very open leading |
| Mono Timestamp | PolySans Mono | 11px / 0.69rem | 500/600 | 1.20 | 1.1–1.8px | UPPERCASE StoryStream timestamps |
| Serif Body | FK Roman Standard | 16px / 1.00rem | 400 | 1.30 | -0.16px | Review decks, print-voice excerpts |
| Serif Caption | FK Roman Standard | 20px / 1.25rem | 400 | 1.20 | — | Magazine-style pull quotes |

### Principles
- **Manuka is always the hero, never the UI.** If you see Manuka below 60px you''re looking at a bug. It exists to *shout the brand*, not to label a button.
- **PolySans is the workhorse, PolySans Mono is its uniformed sibling.** Mono is used exclusively for UPPERCASE labels, timestamps, tags, and certain buttons. Lowercase mono doesn''t exist in this system.
- **Thin-weight (300) capitalized headlines** are a signature Verge move. The 19–20px weight-300 with 1.9px tracking creates a "fashion magazine whisper" that contrasts with the 107px Manuka shout above it. This whisper-vs-shout contrast is the typographic fingerprint.
- **Letter-spacing has two registers**: positive (0.72–1.9px) for ALL-CAPS mono and sans labels, negative (`-0.16px`) for the rare serif appearances, barely-positive (0.32px, 1.07px) for massive display. Plain 0 letter-spacing is rare.
- **FK Roman Standard is the editorial exception**, not the rule. Reserve it for long-form print-voice moments — reviews, critic pulls, masthead essays. Never use it in UI.
- **Line heights are tight** (0.80–1.30) for every display and label, relaxed (1.60–2.00) only for reading body and mono button labels. The leading jump is intentional — it gives the page a "telegraph ticker" rhythm.

### Note on Font Substitutes
The 0.80 line-height on Manuka display (107px, 90px, 60px) assumes the **proprietary Manuka face from Klim Type Foundry**, which has aggressively tight vertical metrics designed for athletic stance at large sizes. If you substitute with wide-metric open-source condensed displays like **Anton**, **Oswald**, **Bebas Neue**, or **Archivo Black**, loosen display line-heights by approximately **+0.10 to +0.15** to prevent ascender/descender collisions (e.g., 0.80 → 0.95). PolySans substitutes (Space Grotesk, DM Sans, Hanken Grotesk) work at the token values without adjustment — their metrics are close enough. PolySans Mono substitutes (Space Mono, JetBrains Mono) and FK Roman substitutes (Newsreader, Literata) also work without adjustment.', '{"sourcePath":"docs/design-md/theverge/DESIGN.md","category":"typography"}'::jsonb, 0.75, 4),
((select id from d), 'components', '4. Component Stylings', 'components', '## 4. Component Stylings

### Buttons

**Primary — Jelly Mint Pill**
- Background: `#3cffd0` (Jelly Mint)
- Text: `#000000` (Absolute Black), PolySans 16px / 700 or PolySans Mono 12px / 600 UPPERCASE
- Border: none (pure fill)
- Border radius: `24px` — fully rounded pill
- Padding: `10px 24px`
- Outline: `none` at rest
- Hover: background shifts to `rgba(255, 255, 255, 0.2)` (translucent white), text stays black, adds a 1px `#c2c2c2` ring shadow
- Active: background `rgba(140, 140, 140, 0.87)`, opacity `0.5`, ring shadow `#8c8c8c`
- Focus: background `#1eaedb`, white text, 1px solid `#0500ff` border, translucent white focus ring
- Transition: ~180ms ease on background and shadow

**Secondary — Dark Slate Pill**
- Background: `#2d2d2d` (Surface Slate)
- Text: `#e9e9e9` (Muted Text), PolySans 16px / 400
- Border: none
- Border radius: `24px`
- Padding: `10px 24px`
- Outline: `rgb(233, 233, 233) none 0px`
- Hover: same translucent white invert as primary — `rgba(255, 255, 255, 0.2)` bg, black text, 1px `#c2c2c2` ring
- Focus: same cyan focus treatment as primary

**Tertiary — Outlined Mint**
- Background: transparent
- Text: `#3cffd0`, PolySans Mono 12px / 600 UPPERCASE, 1.5px tracking
- Border: `1px solid #3cffd0`
- Border radius: `40px` — larger pill for secondary outline style
- Padding: ~`10px 20px`
- Hover: inverts to mint fill, black text
- Transition: 150ms ease

**Outlined Ultraviolet (Promotional)**
- Background: transparent
- Text: `#5200ff` or `#ffffff`
- Border: `1px solid #5200ff`
- Border radius: `30px`
- Used for "Subscribe" or "Join the Stream" style promotional callouts

**Pill Tag (Non-interactive)**
- Background: saturated accent (`#3cffd0`, `#5200ff`, yellow, etc.)
- Text: black or white depending on background luminance
- Border radius: `20px` (tighter radius than buttons — this is the *text pill*)
- Font: PolySans Mono 11px / 600 UPPERCASE, 1.8px tracking
- Padding: ~`4px 10px`

### Cards & Containers

**StoryStream Tile**
- Background: either `#131313` + 1px white border, OR a saturated accent fill (mint, purple, yellow, pink, orange, white)
- Border radius: `20px` (standard) or `24px` (feature)
- Border: `1px solid #ffffff` (on dark) or `0px 0px 1px solid #3cffd0` (on mint) or nothing (on saturated fill)
- Padding: ~24–32px interior
- Hover: no lift, no scale — the headline text color transitions from white to `#3860be` (deep link blue)
- Transition: 150ms ease on color only

**Feature Card (Top Story)**
- Background: `#131313` with 1px hairline border, OR full-bleed color accent
- Border radius: `24px`
- Padding: 32px+
- Image inside: clipped to match the outer radius (`3px` or `4px` inner radius when nested)
- Hover: text color shift only; the image remains static

**StoryStream Rail (Timeline)**
- A vertical dashed or solid rule (1px `#3d00bf` or `#ffffff`) runs along the left edge of each item, marking the timeline spine
- Timestamps sit on the left rail in PolySans Mono 11px / 500 / UPPERCASE / 1.1px tracking
- Each entry is a pill-cornered rectangle separated from its neighbors by 12–16px vertical gap

### Inputs & Forms
- **Default**: `#131313` background, 1px solid `#ffffff` or `#949494` border, `2px` border radius (tight, newspaper-form feel), PolySans 15px text in `#ffffff`, placeholder in `#949494`.
- **Focus**: border transitions to `#3cffd0` (jelly mint) with optional `1px solid #5200ff` inner ring on deep focus. No glow.
- **Error**: border turns `#5200ff` (ultraviolet — used as error/alert accent here, not the usual red).
- **Transition**: ~150ms ease on border-color.

### Navigation

- **Top nav**: thin `#131313` bar with the Verge wordmark (Manuka) left-aligned, a search icon and a few UPPERCASE mono category links (12–14px, PolySans Mono, 1.5–1.8px tracking), and a single mint-pill CTA (usually "Subscribe") pinned right.
- **Wordmark**: massive on first scroll — the homepage treats the "The Verge" logo as a hero element, not a 32px corner logo.
- **Hover**: every link transitions from `#ffffff` to `#3860be` (deep link blue). No underline — it''s a color-only response.
- **Active section**: marked by a 1px mint underline (inset box-shadow `0px -1px 0px 0px inset #3cffd0`)
- **Mobile**: the wordmark shrinks, category nav collapses into a hamburger drawer. Inside the drawer, links are mono-uppercase and stack with 16–20px gaps.

### Image Treatment

- **Aspect ratios**: 16:9 dominates for hero and feature images, 4:3 for mid-feed, 1:1 for thumbnails and author avatars.
- **Corners**: always rounded to match the parent card — `3px`, `4px`, or inherit `20px` / `24px` from the tile.
- **Frame**: 1px `#313131` or `#ffffff` hairline around photography, giving a "contained Polaroid" feel.
- **Full-bleed**: only within the color-block tiles, where the image runs to the padded edge of the accent fill.
- **Hover**: static — no zoom, no scale, no opacity shift. The headline below is the only interactive response.
- **Lazy loading**: `loading="lazy"` on everything below the first fold; eager on the masthead hero only.

### StoryStream Timeline Item (Distinctive)

- Vertical rail line (1px `#3d00bf` or `#ffffff` on `#131313`)
- Mono timestamp on the left in PolySans Mono 11px / UPPERCASE
- Pill-cornered body card (20px radius) with kicker, headline, and optional deck
- Stacked vertically with 12–16px gap, the rail continuing between them
- Often interleaved with full-bleed accent tiles that "break" the timeline rhythm for emphasis', '{"sourcePath":"docs/design-md/theverge/DESIGN.md","category":"components"}'::jsonb, 0.75, 5),
((select id from d), 'layout', '5. Layout Principles', 'layout', '## 5. Layout Principles

### Spacing System
- **Base unit**: 8px.
- **Scale**: 1, 2, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 20, 24, 25px.
- **Section padding**: 32–64px vertical between major feed sections. StoryStream items themselves are tighter — 12–16px gaps.
- **Card padding**: 20–32px interior. Feature cards expand to 40–48px.
- **Inline spacing**: kickers sit ~6–10px above headlines; headlines sit ~10–14px above decks; timestamps sit ~6–8px below decks.
- **Micro-scale**: The 2/4/5/6/9/10px values are used inside buttons, pills, and tight label clusters, not in the editorial grid.

### Grid & Container
- **Max width**: ~1280–1300px (dembrandt detected breakpoints at 1200/1280/1300).
- **Column patterns**: a 12-column underlying grid that resolves into 3-column hero + 1-column StoryStream rail + feature panels. The homepage feels freeform because color-block tiles frequently span 2–3 columns on a whim.
- **Container padding**: 24px mobile / 48px desktop on the outer edges.
- **Gutters**: 16–24px between columns, tighter (8–12px) inside StoryStream items.

### Whitespace Philosophy
The Verge treats whitespace like a club DJ treats silence — as a dramatic reset between loud moments. The canvas is so dark and the accents are so saturated that even 32px of empty `#131313` between two tiles acts as a palette cleanser. The page is not airy like Apple or Stripe; it''s **paced**, with loud hazard-color blocks interrupting stretches of near-black. Whitespace carries the rhythm, not the elegance.

### Border Radius Scale
- **2px** — inputs, small badges (feels like a typewriter tag)
- **3px** — inline images (just enough to soften against the canvas)
- **4px** — nested card images and small button variants
- **20px** — standard pill cards and color-block tiles
- **24px** — feature tile radius and primary button pill
- **30px** — large promotional buttons
- **40px** — outlined CTA pills (the loudest pill in the system)
- **50%** — avatar circles, icon buttons, and certain round badges

Eight discrete radius values — a **lot** for a single site. This is deliberate: the rhythm between 2px typewriter tags, 20px pill cards, and 40px outlined buttons creates a "nested scale" feel where every component announces its hierarchy through its corners.', '{"sourcePath":"docs/design-md/theverge/DESIGN.md","category":"layout"}'::jsonb, 0.75, 6),
((select id from d), 'elevation', '6. Depth & Elevation', 'elevation', '## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | No border, no shadow | Default `#131313` canvas text |
| 1 | `rgba(0,0,0,0) 0px 0px 0px 0px inset` (placeholder) | Reset state for interactive elements |
| 2 | `1px solid #ffffff` or `#313131` hairline | Image frames and quiet card outlines |
| 3 | `1px solid #3cffd0` hairline | Active button outlines, focused story tiles |
| 4 | `1px solid #5200ff` hairline | Promotional/alternate state outlines |
| 5 | `rgba(0, 0, 0, 0.33) 0px 0px 0px 1px` | The single "atmospheric" ring — applied to layered cards |
| 6 | `0px -1px 0px 0px inset` (mint/black/white) | Active tab underline — a signature Verge move |
| 7 | Saturated accent fill (`#3cffd0`, `#5200ff`, white, yellow, pink) | Story-tile elevation via color, not shadow |

The Verge''s depth philosophy is **color-as-elevation**. When something needs to stand out, it doesn''t get a shadow — it gets a mint fill or a 1px hazard-color border. There are 14 shadow entries in the extracted tokens, but all of them are either inset underlines (0px -1px inset) or near-transparent 1px rings — none of them are traditional elevation shadows. The `#131313` canvas stays perfectly flat throughout, and hierarchy is carried by color saturation.

### Decorative Depth
- **1px inset underline** on active tabs/nav links (mint, black, or white depending on context)
- **Subtle `rgba(0, 0, 0, 0.33)` 1px ring** on stacked cards — the only effect that faintly resembles a shadow
- **No gradients, no glows, no atmospheric blurs** anywhere. The hazard-tape aesthetic would break if anything faded softly.', '{"sourcePath":"docs/design-md/theverge/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', '7. Do''s and Don''ts', 'dos_and_donts', '## 7. Do''s and Don''ts

### Do
- **Do** use `#131313` as the canvas for every view. There is no light mode.
- **Do** use Jelly Mint (`#3cffd0`) and Verge Ultraviolet (`#5200ff`) as hazard accents — buttons, borders, active states, and saturated color-block tiles.
- **Do** use Manuka exclusively at 60px+ for hero headlines. Treat anything smaller as a bug.
- **Do** round everything: 20px for cards, 24px for feature cards, 30–40px for pill buttons.
- **Do** use PolySans Mono for UPPERCASE labels, timestamps, kickers, and button text. Lowercase mono doesn''t exist here.
- **Do** apply 1.5–1.9px letter-spacing to every ALL-CAPS label — this is a Verge signature.
- **Do** use saturated color-block tiles (mint, purple, yellow, pink, orange, white) to elevate a story — never a drop shadow.
- **Do** use `#3860be` (deep link blue) as the hover color on every link, regardless of base color.
- **Do** apply the StoryStream timeline rail (1px dashed/solid `#3d00bf` or white) on feed views.
- **Do** use thin-weight (300) PolySans at 19–20px with 1.9px tracking for "fashion-whisper" capitalized eyebrows — the contrast with the 107px Manuka shout is the whole voice.

### Don''t
- **Don''t** use a light background. The dark canvas is the product.
- **Don''t** add `box-shadow` for elevation. Use 1px borders or saturated accent fills instead.
- **Don''t** use square corners. Every interactive and content container is rounded.
- **Don''t** use Manuka for UI, buttons, or body copy. It''s strictly display.
- **Don''t** use lowercase mono. PolySans Mono is always UPPERCASE.
- **Don''t** let mint and ultraviolet appear as background washes — they''re hazard accents, not canvas tints.
- **Don''t** use gradients anywhere. The system is solid color blocks only.
- **Don''t** introduce new accent colors outside the declared mint / purple / yellow / pink / orange tile palette.
- **Don''t** pair Manuka with FK Roman Standard in the same headline cluster — Manuka is the only display shout, serif pulls are reserved for body moments.
- **Don''t** use `#3cffd0` text on a `#131313` background at under 16px — the contrast vibrates at small sizes.', '{"sourcePath":"docs/design-md/theverge/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', '8. Responsive Behavior', 'responsive_guidelines', '## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small Mobile | <400px | Single column, Manuka hero scales down to ~48–54px, StoryStream rail collapses to inline timestamps |
| Mobile | 400–549px | Single column, color-block tiles stack full-width, nav is a hamburger drawer |
| Large Mobile | 550–767px | Still single column but padding opens up, tile radii stay at 20px |
| Tablet | 768–1023px | 2-column StoryStream with feature card spanning, wordmark shrinks ~50% |
| Small Desktop | 1024–1179px | Full 3–4 column editorial grid, mint pill CTA restored to nav |
| Desktop | 1180–1299px | Max padding, Manuka wordmark at full hero scale |
| Large Desktop | ≥1300px | Container caps at ~1280–1300px, whitespace expands at the margins, no further scaling |

The dembrandt sweep detected 26 intermediate breakpoints (1300 → 1280 → 1200 → 1181 → 1180 → 1179 → 1024 → 1023 → 901 → 900 → 897 → 896 → 890 → 769 → 768 → 620 → 605 → 600 → 550 → 549 → 530 → 426 → 425 → 400 → 320). The Verge tunes its grid at virtually every major device boundary — an unusually aggressive responsive strategy.

### Touch Targets
- Primary pill buttons are ~44px minimum height (10px vertical padding + 16px text + 2px border) — meets WCAG AA.
- Mono uppercase nav links are smaller (~28–32px tall) — for derivative work, pad to 44px on mobile.
- Circle icon buttons are 40–44px circles, touch-friendly.

### Collapsing Strategy
- **Nav**: wordmark scales from hero (Manuka 60–107px) to ~24–32px on mobile. Category links collapse to a hamburger drawer below 900px.
- **Grid**: 4-col → 3-col → 2-col → 1-col. Feature cards that span 2 columns on desktop reflow to full-width single-column on mobile.
- **Spacing**: section padding tightens from 64px → 32px → 20px. Tile interior padding tightens from 32px → 20px.
- **Type**: Manuka hero scales from 107px to ~48–54px on mobile. PolySans headlines scale from 34px → 24px. Mono labels stay pinned at 11–12px (they don''t shrink further or they become unreadable).
- **Color tiles**: accent story blocks never lose saturation on mobile — they just reflow to full width.

### Image Behavior
- Responsive raster via `srcset`, aspect ratios preserved.
- No art-direction swaps — same crop scales across all viewports.
- `loading="lazy"` on everything below the fold, `eager` on the masthead hero.
- Images inside color-block tiles inherit the tile''s inner radius (4px or 20px nested).', '{"sourcePath":"docs/design-md/theverge/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', '9. Agent Prompt Guide', 'other', '## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA**: "Jelly Mint (`#3cffd0`)"
- **Background (Canvas)**: "Canvas Black (`#131313`)"
- **Accent (Secondary Hazard)**: "Verge Ultraviolet (`#5200ff`)"
- **Heading Text**: "Hazard White (`#ffffff`)"
- **Body Text**: "Hazard White (`#ffffff`)" (primary) or "Muted Text (`#e9e9e9`)"
- **Secondary Text / Metadata**: "Secondary Text (`#949494`)"
- **Card Border**: "Hazard White (`#ffffff`)" hairline on dark, "Console Mint Border (`#309875`)" on mint variants
- **Link Hover**: "Deep Link Blue (`#3860be`)"

### Example Component Prompts
1. *"Create a StoryStream timeline item on a `#131313` canvas: a 20px-radius rectangle with a 1px solid `#ffffff` border, a PolySans Mono 11px / 600 / UPPERCASE / 1.1px tracking timestamp on the left rail, a 12px PolySans UPPERCASE kicker in mint (`#3cffd0`), and a 24px / 700 PolySans headline in white below. No shadow, no lift — hover only shifts the headline color to `#3860be`."*
2. *"Design a primary subscribe button with a Jelly Mint (`#3cffd0`) fill, black text in PolySans Mono 12px / 600 / UPPERCASE / 1.5px tracking, 24px border radius, 10px × 24px padding. Hover state shifts to `rgba(255, 255, 255, 0.2)` background with a 1px `#c2c2c2` ring shadow, 180ms ease."*
3. *"Build a feature hero with a 107px Manuka 900 headline in white with 1.07px letter-spacing and 0.80 line-height, a thin-weight 300 PolySans 20px capitalized kicker above with 1.9px tracking, on a `#131313` canvas with 64px vertical padding."*
4. *"Create a color-block accent tile filled with Verge Ultraviolet (`#5200ff`) at 0.9 alpha, 24px border radius, white text, a PolySans Mono 11px UPPERCASE category label with 1.5px tracking at the top, and a 32px PolySans 400 capitalized headline with 0.32px tracking below."*
5. *"Design a dark slate secondary button with a `#2d2d2d` background, `#e9e9e9` PolySans 16px text, 24px radius pill shape, 10px × 24px padding. Hover matches the primary button — translucent white `rgba(255, 255, 255, 0.2)` bg with black text."*

### Iteration Guide
When refining existing screens generated with this design system:
1. **Audit the canvas.** If you see a light background anywhere on the homepage, flatten it to `#131313`. There is no light mode.
2. **Audit corners.** Every rectangle should land on 2/3/4/20/24/30/40px or 50%. Square corners break the voice.
3. **Audit shadows.** Strip every `box-shadow` that isn''t a 1px inset underline or a 1px hazard-color border. The Verge uses color for elevation, not shadow.
4. **Audit type roles.** Manuka only ≥60px. PolySans Mono only UPPERCASE. PolySans 300 at 19–20px should have 1.9px tracking. FK Roman only for body/magazine moments, never UI.
5. **Audit accent usage.** Mint and ultraviolet should appear as hazard accents — buttons, 1px borders, active underlines, saturated tile fills. If they''re appearing as background washes or gradient fades, correct to solid blocks.
6. **Audit labels.** Every kicker, timestamp, category tag, and button label should be ALL CAPS with 1.1–1.9px letter-spacing. Missing tracking = missing voice.
7. **Audit link hover.** Every link, regardless of its base color, should hover to `#3860be` deep link blue with no underline. Any other hover color is drift.', '{"sourcePath":"docs/design-md/theverge/DESIGN.md","category":"other"}'::jsonb, 0.75, 10);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_1', '#131313', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_2', '#3cffd0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_3', '#5200ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_4', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_5', '#2d2d2d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_6', '#309875', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_7', '#3860be', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_8', '#1eaedb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_9', '#3d00bf', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_10', '#313131', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_11', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_12', '#949494', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_13', '#e9e9e9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_14', '#8c8c8c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_15', '#c2c2c2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md'), 'color', 'color_16', '#0500ff', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/theverge/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/theverge/DESIGN.md';


-- Together Ai
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Together Ai', 'together.ai', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/together.ai/DESIGN.md', null, 'seeded', '---
version: alpha
name: Together-AI-Inspired-design-analysis
description: An inspired interpretation of Together AI''s design language — an AI infrastructure platform whose surface alternates between near-black hero bands (with a three-color orange-magenta-periwinkle gradient as the single piece of brand chrome) and bright white research / pricing / docs bands, knit together by a custom display sans and an uppercase mono eyebrow face.

colors:
  primary: "#000000"
  on-primary: "#ffffff"
  ink: "#000000"
  body: "#959494"
  hairline: "#959494"
  canvas: "#ffffff"
  canvas-dark: "#010120"
  surface-dark-soft: "#313641"
  on-dark: "#ffffff"
  accent-orange: "#fc4c02"
  accent-magenta: "#ef2cc1"
  accent-periwinkle: "#bdbbff"
  accent-mint: "#c8f6f9"

typography:
  display-xxl:
    fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 64px
    fontWeight: 500
    lineHeight: 70.4px
    letterSpacing: -1.92px
  display-xl:
    fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 40px
    fontWeight: 500
    lineHeight: 48px
    letterSpacing: -0.8px
  display-lg:
    fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 28px
    fontWeight: 500
    lineHeight: 32.2px
    letterSpacing: -0.42px
  display-md:
    fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 22px
    fontWeight: 500
    lineHeight: 25.3px
    letterSpacing: -0.22px
  body-lg:
    fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 23.4px
    letterSpacing: -0.18px
  body-lg-strong:
    fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 500
    lineHeight: 23.4px
    letterSpacing: -0.18px
  body-md:
    fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 20.8px
    letterSpacing: -0.16px
  body-md-strong:
    fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 20.8px
    letterSpacing: -0.16px
  caption:
    fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 19.6px
  caption-strong:
    fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 19.6px
  mono-caps-button:
    fontFamily: PP Neue Montreal Mono, ui-monospace, SF Mono, Menlo, monospace
    fontSize: 16px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.08px
  mono-caps-eyebrow:
    fontFamily: PP Neue Montreal Mono, ui-monospace, SF Mono, Menlo, monospace
    fontSize: 11px
    fontWeight: 500
    lineHeight: 11px
    letterSpacing: 0.55px
  mono-caps-label:
    fontFamily: PP Neue Montreal Mono, ui-monospace, SF Mono, Menlo, monospace
    fontSize: 11px
    fontWeight: 500
    lineHeight: 15.4px
    letterSpacing: 0.055px
  mono-caption:
    fontFamily: PP Neue Montreal Mono, ui-monospace, SF Mono, Menlo, monospace
    fontSize: 10px
    fontWeight: 400
    lineHeight: 14px
    letterSpacing: 0.05px

rounded:
  none: 0px
  xs: 3.25px
  sm: 4px
  md: 8px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 44px
  5xl: 48px
  6xl: 55.2px
  section: 80px

components:
  nav-bar:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    padding: "{spacing.lg} {spacing.3xl}"
  nav-link:
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.mono-caps-button}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.2xl}"
  button-secondary-mint:
    backgroundColor: "{colors.accent-mint}"
    textColor: "{colors.ink}"
    typography: "{typography.mono-caps-button}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.2xl}"
  button-secondary-white:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.mono-caps-button}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.2xl}"
  button-ghost-on-dark:
    backgroundColor: "{colors.surface-dark-soft}"
    textColor: "{colors.on-dark}"
    typography: "{typography.mono-caps-button}"
    rounded: "{rounded.sm}"
  button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "rgba(0, 0, 0, 0.08)"
    typography: "{typography.mono-caps-button}"
    rounded: "{rounded.xs}"
  button-icon-circular:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "rgba(0, 0, 0, 0.08)"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
  badge-neutral:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "rgba(0, 0, 0, 0.08)"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.sm}"
  badge-subtle-on-dark:
    backgroundColor: "{colors.surface-dark-soft}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.sm}"
  hero-band-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xxl}"
    padding: "{spacing.section} {spacing.3xl}"
  research-band-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xl}"
    padding: "{spacing.section} {spacing.3xl}"
  feature-tab-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-strong}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.2xl}"
  pricing-sub-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: "{spacing.sm} {spacing.lg}"
  stats-card-tinted:
    backgroundColor: "{colors.accent-mint}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    rounded: "{rounded.sm}"
    padding: "{spacing.3xl}"
  research-card:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    borderColor: "rgba(255, 255, 255, 0.12)"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.2xl}"
  testimonial-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.2xl}"
  article-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.2xl}"
  code-editor-mockup:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.mono-caption}"
    rounded: "{rounded.sm}"
    padding: "{spacing.2xl}"
  data-table-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "rgba(0, 0, 0, 0.08)"
    typography: "{typography.body-md}"
    padding: "{spacing.md} {spacing.lg}"
  data-table-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.mono-caps-eyebrow}"
    padding: "{spacing.md} {spacing.lg}"
  toggle-pill-group:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.mono-caps-button}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: "{spacing.section} {spacing.3xl}"
  footer-wordmark-banner:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.display-xxl}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default Pricing tier card. Mirrors article-card chrome on canvas-soft surface with a hairline border."
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "rgba(0, 0, 0, 0.08)"
    rounded: "{rounded.sm}"
    padding: "{spacing.3xl}"
  ex-pricing-tier-featured:
    description: "Featured tier — polarity-flipped to canvas-dark with white text."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.3xl}"
  ex-product-selector:
    description: "What''s Included summary card — repurposed for the brand''s GPU / inference packaging tiers."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "{spacing.2xl}"
  ex-cart-drawer:
    description: "Subscription summary — line items per add-on (NOT a literal e-commerce cart)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "{spacing.2xl}"
    item-divider: "{colors.hairline}"
  ex-app-shell-row:
    description: "Sidebar nav row. Active state uses brand primary as a left-edge indicator bar."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  ex-data-table-cell:
    description: "Mirrors the brand''s pricing-page table. Header uses mono-caps-eyebrow uppercase; body uses body-md."
    headerBackground: "{colors.hairline}"
    headerTypography: "{typography.mono-caps-eyebrow}"
    bodyTypography: "{typography.body-md}"
    cellPadding: "{spacing.md} {spacing.lg}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Mirrors article-card chrome with text-input primitives inside."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "{spacing.3xl}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as article-card; relies on tinted scrim instead of card shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "{spacing.3xl}"
  ex-empty-state-card:
    description: "Empty-state illustration frame. Generous padding on canvas-soft surface."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "{spacing.5xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — flat-cornered article-card chrome with a soft brand-tinted drop shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
    typography: "{typography.body-md}"

---


## Overview

Together AI is an AI cloud-infrastructure platform — model inference, GPU clusters, fine-tuning, all the plumbing that makes "the AI native cloud" deliverable to a developer team — and the brand''s web surface signals exactly that posture: a near-black hero on top, a long ribbon of white technical content in the middle, and a single recurring piece of brand chrome — a three-color orange-magenta-periwinkle gradient ribbon — that does the entire job of "we are not just another grey enterprise SaaS." There is no other illustration system. The gradient is the brand.

Type is the second decisive voice. Two faces carry every page: a custom geometric display sans (extracted as `The Future`) for headlines and body, set at weight 500 with tight, slightly-negative letter-spacing so 64-pixel hero type feels poured rather than typed; and an uppercase monospace eyebrow (`PP Neue Montreal Mono`) that labels every section, every button, and every cell header. Headlines are sentence-case; everything technical is uppercase mono. That contrast is the brand''s tonal joke — the platform is serious enough to use a monospace label, modern enough to not put the headline in it.

Surfaces alternate aggressively: a `{colors.canvas-dark}` (`#010120`) band for hero / research / "Grounded in cutting-edge research" — followed by `{colors.canvas}` (white) for product, pricing, and testimonials, with `{colors.hairline}` reserved for table-header rows and toggle backgrounds. Pastel `{colors.accent-mint}` tinted stat tiles break up the white middle. Cards are universally lightly rounded (`{rounded.sm}` 4 px) with hairline borders — never floating with shadows.

**Key Characteristics:**
- A single black `{colors.primary}` CTA pill carries every conversion target across pricing, footer, sign-in. The mint `{colors.accent-mint}` and white pill variants are reserved for hero contexts only.
- A three-color brand gradient (`{colors.accent-orange}` → `{colors.accent-magenta}` → `{colors.accent-periwinkle}`) is the entire decorative system — used as the hero ribbon graphic and never reduced to a swatch elsewhere.
- All-caps mono eyebrows and button labels in `{typography.mono-caps-eyebrow}` / `{typography.mono-caps-button}` everywhere — section titles, model row headers, "ON-DEMAND" labels in pricing tables.
- Lightly rounded card chrome at `{rounded.sm}` 4 px; one off `{rounded.xs}` 3.25 px appears inside pricing-tab pills as a tighter system; `{rounded.full}` only for the floating chat-launcher orb.
- Dual surface mode — alternating `{colors.canvas-dark}` and `{colors.canvas}` bands; no in-between greys. The single soft surface `{colors.hairline}` exists only to mark table-header rows.
- A massive `together.ai` wordmark banner at the very bottom of every page, set in `{typography.display-xxl}` and tinted nearly-into-the-canvas (`{colors.hairline}`), as a "we are here" sign-off that doubles as a footer separator.

## Colors

### Brand & Accent
- **Ink Black** (`{colors.primary}` — `#000000`): The single primary CTA color. Black pill carries "Sign in", "Contact sales", "Get started now", every footer CTA.
- **Brand Orange** (`{colors.accent-orange}` — `#fc4c02`): One leg of the three-color brand gradient. Appears in the hero ribbon graphic; never used as a UI fill on its own.
- **Brand Magenta** (`{colors.accent-magenta}` — `#ef2cc1`): The second leg of the gradient.
- **Brand Periwinkle** (`{colors.accent-periwinkle}` — `#bdbbff`): The third leg of the gradient; also used as a soft fill for some stat tiles.
- **Brand Mint** (`{colors.accent-mint}` — `#c8f6f9`): A pastel cyan that lives outside the gradient — used for hero secondary-CTA pills and `stats-card-tinted` tiles.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default product / pricing / docs background.
- **Hairline / Canvas Soft** (`{colors.hairline}` — `#ebebeb`): The brand''s single soft surface tone — used for data-table header rows, toggle-pill rails, and 1 px dividers between table rows.
- **Canvas Dark** (`{colors.canvas-dark}` — `#010120`): The brand''s dark hero surface; appears on `hero-band-dark` and `research-band-dark`.
- **Hairline** (`{colors.hairline}` — `#ebebeb`): 1 px dividers on light surfaces — table rows, card chrome, badge borders.
- **Hairline on Dark** (`{colors.surface-dark-soft}` — `#26263a`): 1 px dividers and badge backgrounds on `{colors.canvas-dark}` surfaces; pre-blended from the brand''s translucent-white-on-dark hairline.
- **Surface Dark Soft** (`{colors.surface-dark-soft}` — `#313641`): A slightly lighter dark fill used inside dark-band cards.

### Text
- **Ink** (`{colors.ink}` — `#000000`): Every heading and body paragraph on light surfaces.
- **Body** (`{colors.body}` — `#999999`): Secondary text — captions, table cell secondary values, footer link text. Pre-blended from the brand''s translucent-black 40 % body color.
- **Body Muted** (`{colors.body}` — `#999999`): The all-caps mono-eyebrow text color on light surfaces also rides on this token — there is no separate "mute" tone, the brand keeps secondary text consistent with caption text.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): All text on `{colors.canvas-dark}` surfaces.

### Semantic
The brand does not maintain a separate error / success palette in its public surface; validation cues use the primary black or the brand gradient depending on context. No explicit error red, success green, or warning yellow is documented here — adopting framework defaults is appropriate.

### Brand Gradient
The brand''s signature decoration is a three-stop gradient drawn from `{colors.accent-orange}` → `{colors.accent-magenta}` → `{colors.accent-periwinkle}`, applied as the only piece of decorative chrome (the hero ribbon graphic). Treat the gradient as one unified object — do not crop it down to a single colour, do not reorder the stops, and do not add a fourth stop. Used at large scale; never miniaturised to icon size.

## Typography

### Font Family
Two families carry the entire system:

1. **A custom geometric display sans** (extracted as `The Future`) for every headline, lead paragraph, body, button label that is not uppercase, and inline link. Weights 400 and 500 are the working pair; the face never appears in bold (700) or heavier. Tight negative letter-spacing (`-1.92 px` at 64 px display, `-0.16 px` at 16 px body) gives the face its slightly-condensed, poured-on-the-page feel.
2. **An uppercase mono caption face** (extracted as `PP Neue Montreal Mono`) for every eyebrow, button label, table-header cell, and pricing-table tab. Weight 500 at 11–16 px; always uppercase; positive letter-spacing (`0.05 – 0.55 px`). The mono carries the brand''s technical voice — every label that says "PRICING", "INFERENCE", "MODEL", "GPU", "GA-DEC ''25" is set in this face.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 64px | 500 | 70.4px | -1.92px | Hero headline ("Build what''s next on the AI Native Cloud"). |
| `{typography.display-xl}` | 40px | 500 | 48px | -0.8px | Section headlines ("The Together AI Platform", "Start building on Together AI"). |
| `{typography.display-lg}` | 28px | 500 | 32.2px | -0.42px | Sub-section headlines and stat-tile big numbers. |
| `{typography.display-md}` | 22px | 500 | 25.3px | -0.22px | Card titles, research-card headings. |
| `{typography.body-lg}` | 18px | 400 | 23.4px | -0.18px | Lead paragraphs under section headlines. |
| `{typography.body-lg-strong}` | 18px | 500 | 23.4px | -0.18px | Emphasis runs inside lead paragraphs. |
| `{typography.body-md}` | 16px | 400 | 20.8px | -0.16px | Default body paragraph. |
| `{typography.body-md-strong}` | 16px | 500 | 20.8px | -0.16px | Bolded inline body. |
| `{typography.caption}` | 14px | 400 | 19.6px | 0 | Fine print, footer secondary text. |
| `{typography.caption-strong}` | 14px | 500 | 19.6px | 0 | Bolded captions. |
| `{typography.mono-caps-button}` | 16px | 500 | 16px | 0.08px | Primary button labels — uppercase, mono. |
| `{typography.mono-caps-eyebrow}` | 11px | 500 | 11px | 0.55px | Section eyebrows, table-header cell labels. |
| `{typography.mono-caps-label}` | 11px | 500 | 15.4px | 0.055px | Inline tag labels inside text contexts. |
| `{typography.mono-caption}` | 10px | 400 | 14px | 0.05px | Mono fine print (inside code editor mockup). |

### Principles
- **Two-face contrast is the voice.** Display sans for narrative; uppercase mono for technical labels. Never let the mono carry a paragraph; never let the display sans carry a button label.
- **Negative letter-spacing only on the display sans.** The mono face uses small positive tracking; reversing this is wrong.
- **Headlines stay sentence-case.** Every uppercase moment belongs to the mono face. Mixing all-caps display would muddy the contrast.

### Note on Font Substitutes
The two primary faces are proprietary. Open-source substitutes:
- **Display sans** — *Inter* (400 / 500) with `font-feature-settings: "ss01"` enabled comes closest; tighten letter-spacing by ~0.6 % at display sizes to land on the brand''s compressed feel. *Geist* is the second-best option but reads slightly wider.
- **Uppercase mono eyebrow** — *JetBrains Mono* or *Geist Mono* (weight 500) at 11 px with `text-transform: uppercase` matches the brand''s voice once tracking is bumped to `0.04em`.

## Layout

### Spacing System
- **Base unit**: 4 px. Almost every captured value is a multiple of 4, with two exceptions (7.2 px, 55.2 px) that are gap-multiplier derivatives, not layout decisions.
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px · `{spacing.4xl}` 44 px · `{spacing.5xl}` 48 px · `{spacing.6xl}` 55.2 px · `{spacing.section}` 80 px.
- **Section padding**: marketing bands use `{spacing.section}` 80 px top/bottom on desktop. The hero and the "research" dark band keep the 80 px rhythm; pricing tables tighten to `{spacing.5xl}` to keep dense data legible.
- **Card interior padding**: research cards and testimonial cards sit at `{spacing.2xl}` 24 px interior; the stat-card tiles use `{spacing.3xl}` 32 px to give the big number breathing room.
- **Inline gap**: button + nav rows use `{spacing.md}` 12 px between siblings; chip groups use `{spacing.sm}` 8 px.

### Grid & Container
- **Max width**: ~1280 px desktop container; nothing rendered above that. Content centres with horizontal gutters of `{spacing.3xl}` 32 px on desktop, `{spacing.lg}` 16 px on mobile.
- **Column patterns**:
  - Research / testimonial grids: 3-up at desktop, 1-up at mobile.
  - Stats tile grid: 3-up at desktop, 1-up at mobile.
  - Article-card grid: 2-up at desktop, 1-up at mobile.
  - Pricing data table: full-width, model rows stack on mobile.
  - Hero: 50 / 50 split (headline left, ribbon graphic right) at desktop; stacked at mobile with graphic above.

### Whitespace Philosophy
Surface contrast does most of the separation. A dark band ends → 80 px of breathing room → next light band begins. Inside a band, headline and lead paragraph hug close (`{spacing.lg}` 16 px between them), then a wider gap before the supporting visual or CTA cluster. Inside pricing data tables, the brand keeps rows tight (`{spacing.md}` 12 px vertical) — the table reads more like a sheet than a marketing component.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 479px | Hero stacks; nav collapses to hamburger; all multi-col grids drop to 1-up. |
| Mobile-Large | 479–767px | Same as Mobile; some tables enable horizontal scroll. |
| Tablet | 768–991px | Article grid moves to 2-up; testimonial grid stays 3-up only if container > 900 px, otherwise 1-up. |
| Desktop | 992–1279px | Full 3-up research grid, 2-up article grid, hero 50/50 split. |
| Desktop-Large | ≥ 1280px | Container caps at 1280 px; bands stay edge-to-edge in colour while content centres. |

#### Touch Targets
The mono-cap button label is set at 16 px; combined with `{spacing.xs}` 4 px top / bottom and a 24 px horizontal padding, the primary pill renders at roughly 32 px tall. On mobile viewports, button height is inflated to ≥ 44 px through extra vertical padding inside the touch row — meeting WCAG AAA. The circular icon button (`button-icon-circular`) renders at 44 × 44 px minimum at all viewports.

#### Collapsing Strategy
- **Nav**: full link row + black "Sign in" pill + "Get started" pill at desktop. Collapses to logo + hamburger at mobile; the menu opens as a full-overlay drawer with the same link list stacked vertically.
- **Hero**: at desktop, headline left + gradient ribbon right (50 / 50). At mobile, headline stacks above a smaller-scale ribbon — never below.
- **Research band**: 4-up grid at desktop drops to 2-up at tablet, 1-up at mobile. Card chrome stays identical.
- **Pricing data table**: at desktop, full-width with all columns visible. At tablet, sub-tab row enables horizontal scroll. At mobile, cell rows stack model-name above price block.
- **Footer wordmark banner**: scales fluidly — the giant `together.ai` wordmark stays edge-to-edge regardless of viewport.

#### Image Behavior
- **Hero ribbon graphic**: rendered as an SVG, scales fluidly with the hero container; never crops, never repositions.
- **Testimonial portraits**: square or 4:5 portrait, hard-cropped at top; consistent square framing across the grid.
- **Article thumbnails**: 16:9 landscape, fills card top with `{rounded.sm}` corners on the image only.
- **Logo bar**: customer logos rendered as grayscale SVGs in a wrapping flex row.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Most cards on light surfaces lean on hairline borders, not shadow. |
| Level 1 — Hairline | 1 px solid `{colors.hairline}` on `{colors.canvas}` cards. | Testimonial cards, article cards, data-table rows. |
| Level 2 — Hairline on Dark | 1 px solid `{colors.surface-dark-soft}` on `{colors.canvas-dark}` cards. | Research-band cards, on-dark badges. |
| Level 3 — Soft Drop | `rgba(1, 1, 32, 0.1) 0px 4px 10px 0px` — a barely-perceptible shadow tinted with the brand''s dark-navy. | Floating elements (the chat-launcher orb, sticky-bottom nav row when one appears). |

### Decorative Depth
- **Gradient ribbon as depth**: the hero''s three-stop gradient ribbon is the page''s only true atmospheric effect. It loops through layered translucent shapes that imply depth without leaving the brand palette.
- **Code editor mockup as section-depth break**: a dark code-editor surface inside the otherwise-white product band acts as a one-step lift, mirroring the hero''s polarity flip.
- **Wordmark banner as terminal depth**: the giant `together.ai` letters at the bottom are technically inside `{colors.canvas}` but tinted toward `{colors.hairline}` so they read as a faint stencil, giving the page a final "you have arrived" sign-off.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero / research full-bleed bands; the footer wordmark banner. |
| `{rounded.xs}` | 3.25px | The pricing page''s slightly tighter sub-tab and outline button. |
| `{rounded.sm}` | 4px | The brand''s canonical radius — buttons, badges, cards, data-table rows, stat tiles. |
| `{rounded.md}` | 8px | Feature-tab pills inside the "Full-stack cloud" section, larger pricing-tab containers. |
| `{rounded.full}` | 9999px | The floating chat-launcher orb (`button-icon-circular`). The only fully-pill shape in the system. |

### Photography Geometry
- **Hero ribbon**: SVG gradient, free-form; no aspect-ratio constraint.
- **Customer logos**: vector, rendered grayscale at consistent height (~24 px) in a wrapping flex row.
- **Testimonial portraits**: 1:1 square crop with hard-edge corners — no avatar pill.
- **Article thumbnails**: 16:9 with `{rounded.sm}` 4 px top-corner radius on the image only; card chrome stays square.

## Components

### Buttons

**`button-primary`** — the black pill that carries every primary CTA.
- Background `{colors.primary}`, text `{colors.on-primary}`, label set in `{typography.mono-caps-button}` (uppercase mono, 16 px / 500 / 0.08 px tracking), shape `{rounded.sm}` 4 px, padding `{spacing.xs} {spacing.2xl}`. No shadow.

**`button-secondary-mint`** — the hero secondary CTA pill.
- Background `{colors.accent-mint}`, text `{colors.ink}`, same typography and shape as `button-primary`. Only appears in hero contexts.

**`button-secondary-white`** — the white pill paired with `button-secondary-mint` inside the hero.
- Background `{colors.canvas}`, text `{colors.ink}`, same typography and shape. Always sits adjacent to the mint or primary button.

**`button-ghost-on-dark`** — the translucent button used on dark hero / research surfaces.
- Background `{colors.surface-dark-soft}`, text `{colors.on-dark}`, shape `{rounded.sm}` 4 px. Used for "Read more" / "Watch the announcement" affordances on dark bands.

**`button-outline`** — the white-on-white outline button used inside pricing pages and feature toggles.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, shape `{rounded.xs}` 3.25 px.

**`button-icon-circular`** — the floating chat-launcher orb in the bottom-right of every page.
- Background `{colors.primary}`, white icon, shape `{rounded.full}`. The only fully-pill shape in the system.

### Cards & Containers

**`research-card`** — the 4-up grid card on the dark "Grounded in cutting-edge research" band.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, 1 px solid `{colors.surface-dark-soft}` border, padding `{spacing.2xl}`, shape `{rounded.sm}` 4 px. Inside: mono eyebrow tag + display headline + body paragraph.

**`testimonial-card`** — the 3-up "AI natives build on Together AI" card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.sm}` 4 px. Inside: 1:1 portrait crop + display-md name + body quote + mono caption stat row.

**`article-card`** — the 2-up "What''s new at Together AI" article card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.sm}` 4 px. Inside: 16:9 image at top + mono eyebrow tag + display-md title + body summary + mono caption byline.

**`code-editor-mockup`** — the dark code-preview surface inside the product band.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, body in `{typography.mono-caption}`, padding `{spacing.2xl}`, shape `{rounded.sm}` 4 px. Window chrome stays minimal — no traffic-light dots, no title bar.

**`stats-card-tinted`** — the pastel-tinted stat tile (mint, peach, periwinkle) on the white middle band.
- Background `{colors.accent-mint}` (or sibling accent tints), text `{colors.ink}`, big number in `{typography.display-xl}` + label in `{typography.mono-caps-eyebrow}`, padding `{spacing.3xl}`, shape `{rounded.sm}` 4 px.

### Inputs & Forms

**`text-input`** — the form input on the startup-accelerator application form.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, body set in `{typography.body-md}`, shape `{rounded.sm}` 4 px.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas-dark}` on the hero band, switches to `{colors.canvas}` once the user scrolls past the hero. Text `{colors.on-dark}` on dark, `{colors.ink}` on white. Layout: logo left, link row centre, "Contact sales" + "Sign in" right.

**`nav-link`** — the centred link row inside `nav-bar`.
- Text `{colors.on-dark}` (or `{colors.ink}` after scroll), set in `{typography.body-md}` 400 weight. Links separate with `{spacing.2xl}` 24 px between siblings.

**`footer`** — the bottom 4-column nav.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.section} {spacing.3xl}`. Eyebrow labels in `{typography.mono-caps-eyebrow}`; link rows in `{typography.body-md}`.

### Signature Components

**`hero-band-dark`** — the dark navy hero that opens every product / marketing page.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, padding `{spacing.section} {spacing.3xl}`. Headline in `{typography.display-xxl}` (sentence case, never all-caps). Eyebrow in `{typography.mono-caps-eyebrow}`. Two-column layout: headline + CTA cluster on left, gradient ribbon SVG on right.

**`research-band-dark`** — the dark navy band that hosts the "Grounded in cutting-edge research" 4-up card grid.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, padding `{spacing.section} {spacing.3xl}`. Section headline in `{typography.display-xl}` followed by the `research-card` grid.

**`feature-tab-pill`** — the tab pill row inside the "Full-stack cloud" section.
- Background `{colors.canvas}`, text `{colors.ink}`, label in `{typography.body-md-strong}`, padding `{spacing.md} {spacing.2xl}`, shape `{rounded.md}` 8 px. Tab group sits on `{colors.hairline}` rail.

**`pricing-sub-tab`** — the secondary tab row inside the pricing-page model table (TEXT / VISION / IMAGE / AUDIO / VIDEO).
- Background `{colors.canvas}`, text `{colors.ink}`, label in `{typography.body-md}`, padding `{spacing.sm} {spacing.lg}`, shape `{rounded.xs}` 3.25 px.

**`data-table-row`** — the model row inside the pricing serverless-inference table.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` bottom border, padding `{spacing.md} {spacing.lg}`. Inside: model icon + model name (display sans) + input cost cell + output cost cell.

**`data-table-header`** — the table header row.
- Background `{colors.hairline}`, text `{colors.body}`, set in `{typography.mono-caps-eyebrow}` (uppercase mono), padding `{spacing.md} {spacing.lg}`.

**`toggle-pill-group`** — the "Standard Pricing / Wholesale Pricing" segmented control above the fine-tuning table.
- Background `{colors.hairline}` rail, individual pills `{colors.canvas}` (inactive) or `{colors.primary}` (active), label in `{typography.mono-caps-button}`, shape `{rounded.sm}` 4 px, rail padding `{spacing.xs}`.

**`badge-neutral`** — the inline tag pill on light surfaces.
- Background `{colors.hairline}`, text `{colors.ink}`, body in `{typography.body-md}`, 1 px solid `{colors.hairline}` border, padding `{spacing.xxs} {spacing.sm}`, shape `{rounded.sm}` 4 px.

**`badge-subtle-on-dark`** — the inline tag pill on dark hero / research surfaces.
- Background `{colors.surface-dark-soft}`, text `{colors.on-dark}`, body in `{typography.body-md}`, padding `{spacing.xxs} {spacing.sm}`, shape `{rounded.sm}` 4 px.

**`footer-wordmark-banner`** — the massive `together.ai` wordmark at the bottom of every page.
- Background `{colors.canvas}`, wordmark colour `{colors.hairline}` (faint stencil tint), set in `{typography.display-xxl}` scaled fluidly to the viewport width. Edge-to-edge, square corners. Acts as the final page sign-off.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (`#000000`) for every primary CTA. One black pill per visible viewport — that consistency is the brand''s whole conversion story.
- Set every section eyebrow and button label in `{typography.mono-caps-button}` / `{typography.mono-caps-eyebrow}` — uppercase mono, positive tracking.
- Pair the brand gradient (`{colors.accent-orange}` → `{colors.accent-magenta}` → `{colors.accent-periwinkle}`) at hero scale only. The gradient is the brand chrome; never shrink to icon size.
- Cycle page surfaces in the `{colors.canvas-dark}` → `{colors.canvas}` → `{colors.canvas-dark}` rhythm; the dark-light contrast carries elevation more than any shadow.
- Use `{rounded.sm}` 4 px as the canonical card / button radius across the system; reserve `{rounded.full}` for the single floating chat-launcher orb.
- Render the giant `together.ai` wordmark banner at the bottom of every long page in `{typography.display-xxl}`, tinted toward `{colors.hairline}` so it reads as a stencil — not as a heavy footer title.

### Don''t
- Don''t introduce a fifth accent colour. The three-stop gradient + mint pill is the entire decorative palette; new accents flatten the brand.
- Don''t set body paragraphs in the mono face. The mono is for labels only; long-form mono reads as a console log, not as marketing copy.
- Don''t centre-align body paragraphs under a left-aligned display headline. The brand keeps text-block alignment consistent within a copy stack.
- Don''t drop a soft drop-shadow on light-surface cards. The brand uses hairlines and surface contrast for elevation; soft shadows belong only on the floating chat-launcher orb.
- Don''t reduce the brand gradient to a single-colour fill, reorder its stops, or add a fourth stop. The gradient is a fixed object.
- Don''t switch the primary button shape to a full pill `{rounded.full}`. The brand''s CTA shape is a slightly-rounded rectangle, never a full pill.
- Don''t set headlines in the all-caps mono. Every all-caps moment belongs to the mono face; every headline belongs to the display sans in sentence case.
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

Together AI is an AI cloud-infrastructure platform — model inference, GPU clusters, fine-tuning, all the plumbing that makes "the AI native cloud" deliverable to a developer team — and the brand''s web surface signals exactly that posture: a near-black hero on top, a long ribbon of white technical content in the middle, and a single recurring piece of brand chrome — a three-color orange-magenta-periwinkle gradient ribbon — that does the entire job of "we are not just another grey enterprise SaaS." There is no other illustration system. The gradient is the brand.

Type is the second decisive voice. Two faces carry every page: a custom geometric display sans (extracted as `The Future`) for headlines and body, set at weight 500 with tight, slightly-negative letter-spacing so 64-pixel hero type feels poured rather than typed; and an uppercase monospace eyebrow (`PP Neue Montreal Mono`) that labels every section, every button, and every cell header. Headlines are sentence-case; everything technical is uppercase mono. That contrast is the brand''s tonal joke — the platform is serious enough to use a monospace label, modern enough to not put the headline in it.

Surfaces alternate aggressively: a `{colors.canvas-dark}` (`#010120`) band for hero / research / "Grounded in cutting-edge research" — followed by `{colors.canvas}` (white) for product, pricing, and testimonials, with `{colors.hairline}` reserved for table-header rows and toggle backgrounds. Pastel `{colors.accent-mint}` tinted stat tiles break up the white middle. Cards are universally lightly rounded (`{rounded.sm}` 4 px) with hairline borders — never floating with shadows.

**Key Characteristics:**
- A single black `{colors.primary}` CTA pill carries every conversion target across pricing, footer, sign-in. The mint `{colors.accent-mint}` and white pill variants are reserved for hero contexts only.
- A three-color brand gradient (`{colors.accent-orange}` → `{colors.accent-magenta}` → `{colors.accent-periwinkle}`) is the entire decorative system — used as the hero ribbon graphic and never reduced to a swatch elsewhere.
- All-caps mono eyebrows and button labels in `{typography.mono-caps-eyebrow}` / `{typography.mono-caps-button}` everywhere — section titles, model row headers, "ON-DEMAND" labels in pricing tables.
- Lightly rounded card chrome at `{rounded.sm}` 4 px; one off `{rounded.xs}` 3.25 px appears inside pricing-tab pills as a tighter system; `{rounded.full}` only for the floating chat-launcher orb.
- Dual surface mode — alternating `{colors.canvas-dark}` and `{colors.canvas}` bands; no in-between greys. The single soft surface `{colors.hairline}` exists only to mark table-header rows.
- A massive `together.ai` wordmark banner at the very bottom of every page, set in `{typography.display-xxl}` and tinted nearly-into-the-canvas (`{colors.hairline}`), as a "we are here" sign-off that doubles as a footer separator.', '{"sourcePath":"docs/design-md/together.ai/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Ink Black** (`{colors.primary}` — `#000000`): The single primary CTA color. Black pill carries "Sign in", "Contact sales", "Get started now", every footer CTA.
- **Brand Orange** (`{colors.accent-orange}` — `#fc4c02`): One leg of the three-color brand gradient. Appears in the hero ribbon graphic; never used as a UI fill on its own.
- **Brand Magenta** (`{colors.accent-magenta}` — `#ef2cc1`): The second leg of the gradient.
- **Brand Periwinkle** (`{colors.accent-periwinkle}` — `#bdbbff`): The third leg of the gradient; also used as a soft fill for some stat tiles.
- **Brand Mint** (`{colors.accent-mint}` — `#c8f6f9`): A pastel cyan that lives outside the gradient — used for hero secondary-CTA pills and `stats-card-tinted` tiles.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default product / pricing / docs background.
- **Hairline / Canvas Soft** (`{colors.hairline}` — `#ebebeb`): The brand''s single soft surface tone — used for data-table header rows, toggle-pill rails, and 1 px dividers between table rows.
- **Canvas Dark** (`{colors.canvas-dark}` — `#010120`): The brand''s dark hero surface; appears on `hero-band-dark` and `research-band-dark`.
- **Hairline** (`{colors.hairline}` — `#ebebeb`): 1 px dividers on light surfaces — table rows, card chrome, badge borders.
- **Hairline on Dark** (`{colors.surface-dark-soft}` — `#26263a`): 1 px dividers and badge backgrounds on `{colors.canvas-dark}` surfaces; pre-blended from the brand''s translucent-white-on-dark hairline.
- **Surface Dark Soft** (`{colors.surface-dark-soft}` — `#313641`): A slightly lighter dark fill used inside dark-band cards.

### Text
- **Ink** (`{colors.ink}` — `#000000`): Every heading and body paragraph on light surfaces.
- **Body** (`{colors.body}` — `#999999`): Secondary text — captions, table cell secondary values, footer link text. Pre-blended from the brand''s translucent-black 40 % body color.
- **Body Muted** (`{colors.body}` — `#999999`): The all-caps mono-eyebrow text color on light surfaces also rides on this token — there is no separate "mute" tone, the brand keeps secondary text consistent with caption text.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): All text on `{colors.canvas-dark}` surfaces.

### Semantic
The brand does not maintain a separate error / success palette in its public surface; validation cues use the primary black or the brand gradient depending on context. No explicit error red, success green, or warning yellow is documented here — adopting framework defaults is appropriate.

### Brand Gradient
The brand''s signature decoration is a three-stop gradient drawn from `{colors.accent-orange}` → `{colors.accent-magenta}` → `{colors.accent-periwinkle}`, applied as the only piece of decorative chrome (the hero ribbon graphic). Treat the gradient as one unified object — do not crop it down to a single colour, do not reorder the stops, and do not add a fourth stop. Used at large scale; never miniaturised to icon size.', '{"sourcePath":"docs/design-md/together.ai/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
Two families carry the entire system:

1. **A custom geometric display sans** (extracted as `The Future`) for every headline, lead paragraph, body, button label that is not uppercase, and inline link. Weights 400 and 500 are the working pair; the face never appears in bold (700) or heavier. Tight negative letter-spacing (`-1.92 px` at 64 px display, `-0.16 px` at 16 px body) gives the face its slightly-condensed, poured-on-the-page feel.
2. **An uppercase mono caption face** (extracted as `PP Neue Montreal Mono`) for every eyebrow, button label, table-header cell, and pricing-table tab. Weight 500 at 11–16 px; always uppercase; positive letter-spacing (`0.05 – 0.55 px`). The mono carries the brand''s technical voice — every label that says "PRICING", "INFERENCE", "MODEL", "GPU", "GA-DEC ''25" is set in this face.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 64px | 500 | 70.4px | -1.92px | Hero headline ("Build what''s next on the AI Native Cloud"). |
| `{typography.display-xl}` | 40px | 500 | 48px | -0.8px | Section headlines ("The Together AI Platform", "Start building on Together AI"). |
| `{typography.display-lg}` | 28px | 500 | 32.2px | -0.42px | Sub-section headlines and stat-tile big numbers. |
| `{typography.display-md}` | 22px | 500 | 25.3px | -0.22px | Card titles, research-card headings. |
| `{typography.body-lg}` | 18px | 400 | 23.4px | -0.18px | Lead paragraphs under section headlines. |
| `{typography.body-lg-strong}` | 18px | 500 | 23.4px | -0.18px | Emphasis runs inside lead paragraphs. |
| `{typography.body-md}` | 16px | 400 | 20.8px | -0.16px | Default body paragraph. |
| `{typography.body-md-strong}` | 16px | 500 | 20.8px | -0.16px | Bolded inline body. |
| `{typography.caption}` | 14px | 400 | 19.6px | 0 | Fine print, footer secondary text. |
| `{typography.caption-strong}` | 14px | 500 | 19.6px | 0 | Bolded captions. |
| `{typography.mono-caps-button}` | 16px | 500 | 16px | 0.08px | Primary button labels — uppercase, mono. |
| `{typography.mono-caps-eyebrow}` | 11px | 500 | 11px | 0.55px | Section eyebrows, table-header cell labels. |
| `{typography.mono-caps-label}` | 11px | 500 | 15.4px | 0.055px | Inline tag labels inside text contexts. |
| `{typography.mono-caption}` | 10px | 400 | 14px | 0.05px | Mono fine print (inside code editor mockup). |

### Principles
- **Two-face contrast is the voice.** Display sans for narrative; uppercase mono for technical labels. Never let the mono carry a paragraph; never let the display sans carry a button label.
- **Negative letter-spacing only on the display sans.** The mono face uses small positive tracking; reversing this is wrong.
- **Headlines stay sentence-case.** Every uppercase moment belongs to the mono face. Mixing all-caps display would muddy the contrast.

### Note on Font Substitutes
The two primary faces are proprietary. Open-source substitutes:
- **Display sans** — *Inter* (400 / 500) with `font-feature-settings: "ss01"` enabled comes closest; tighten letter-spacing by ~0.6 % at display sizes to land on the brand''s compressed feel. *Geist* is the second-best option but reads slightly wider.
- **Uppercase mono eyebrow** — *JetBrains Mono* or *Geist Mono* (weight 500) at 11 px with `text-transform: uppercase` matches the brand''s voice once tracking is bumped to `0.04em`.', '{"sourcePath":"docs/design-md/together.ai/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4 px. Almost every captured value is a multiple of 4, with two exceptions (7.2 px, 55.2 px) that are gap-multiplier derivatives, not layout decisions.
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px · `{spacing.4xl}` 44 px · `{spacing.5xl}` 48 px · `{spacing.6xl}` 55.2 px · `{spacing.section}` 80 px.
- **Section padding**: marketing bands use `{spacing.section}` 80 px top/bottom on desktop. The hero and the "research" dark band keep the 80 px rhythm; pricing tables tighten to `{spacing.5xl}` to keep dense data legible.
- **Card interior padding**: research cards and testimonial cards sit at `{spacing.2xl}` 24 px interior; the stat-card tiles use `{spacing.3xl}` 32 px to give the big number breathing room.
- **Inline gap**: button + nav rows use `{spacing.md}` 12 px between siblings; chip groups use `{spacing.sm}` 8 px.

### Grid & Container
- **Max width**: ~1280 px desktop container; nothing rendered above that. Content centres with horizontal gutters of `{spacing.3xl}` 32 px on desktop, `{spacing.lg}` 16 px on mobile.
- **Column patterns**:
  - Research / testimonial grids: 3-up at desktop, 1-up at mobile.
  - Stats tile grid: 3-up at desktop, 1-up at mobile.
  - Article-card grid: 2-up at desktop, 1-up at mobile.
  - Pricing data table: full-width, model rows stack on mobile.
  - Hero: 50 / 50 split (headline left, ribbon graphic right) at desktop; stacked at mobile with graphic above.

### Whitespace Philosophy
Surface contrast does most of the separation. A dark band ends → 80 px of breathing room → next light band begins. Inside a band, headline and lead paragraph hug close (`{spacing.lg}` 16 px between them), then a wider gap before the supporting visual or CTA cluster. Inside pricing data tables, the brand keeps rows tight (`{spacing.md}` 12 px vertical) — the table reads more like a sheet than a marketing component.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 479px | Hero stacks; nav collapses to hamburger; all multi-col grids drop to 1-up. |
| Mobile-Large | 479–767px | Same as Mobile; some tables enable horizontal scroll. |
| Tablet | 768–991px | Article grid moves to 2-up; testimonial grid stays 3-up only if container > 900 px, otherwise 1-up. |
| Desktop | 992–1279px | Full 3-up research grid, 2-up article grid, hero 50/50 split. |
| Desktop-Large | ≥ 1280px | Container caps at 1280 px; bands stay edge-to-edge in colour while content centres. |

#### Touch Targets
The mono-cap button label is set at 16 px; combined with `{spacing.xs}` 4 px top / bottom and a 24 px horizontal padding, the primary pill renders at roughly 32 px tall. On mobile viewports, button height is inflated to ≥ 44 px through extra vertical padding inside the touch row — meeting WCAG AAA. The circular icon button (`button-icon-circular`) renders at 44 × 44 px minimum at all viewports.

#### Collapsing Strategy
- **Nav**: full link row + black "Sign in" pill + "Get started" pill at desktop. Collapses to logo + hamburger at mobile; the menu opens as a full-overlay drawer with the same link list stacked vertically.
- **Hero**: at desktop, headline left + gradient ribbon right (50 / 50). At mobile, headline stacks above a smaller-scale ribbon — never below.
- **Research band**: 4-up grid at desktop drops to 2-up at tablet, 1-up at mobile. Card chrome stays identical.
- **Pricing data table**: at desktop, full-width with all columns visible. At tablet, sub-tab row enables horizontal scroll. At mobile, cell rows stack model-name above price block.
- **Footer wordmark banner**: scales fluidly — the giant `together.ai` wordmark stays edge-to-edge regardless of viewport.

#### Image Behavior
- **Hero ribbon graphic**: rendered as an SVG, scales fluidly with the hero container; never crops, never repositions.
- **Testimonial portraits**: square or 4:5 portrait, hard-cropped at top; consistent square framing across the grid.
- **Article thumbnails**: 16:9 landscape, fills card top with `{rounded.sm}` corners on the image only.
- **Logo bar**: customer logos rendered as grayscale SVGs in a wrapping flex row.', '{"sourcePath":"docs/design-md/together.ai/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Most cards on light surfaces lean on hairline borders, not shadow. |
| Level 1 — Hairline | 1 px solid `{colors.hairline}` on `{colors.canvas}` cards. | Testimonial cards, article cards, data-table rows. |
| Level 2 — Hairline on Dark | 1 px solid `{colors.surface-dark-soft}` on `{colors.canvas-dark}` cards. | Research-band cards, on-dark badges. |
| Level 3 — Soft Drop | `rgba(1, 1, 32, 0.1) 0px 4px 10px 0px` — a barely-perceptible shadow tinted with the brand''s dark-navy. | Floating elements (the chat-launcher orb, sticky-bottom nav row when one appears). |

### Decorative Depth
- **Gradient ribbon as depth**: the hero''s three-stop gradient ribbon is the page''s only true atmospheric effect. It loops through layered translucent shapes that imply depth without leaving the brand palette.
- **Code editor mockup as section-depth break**: a dark code-editor surface inside the otherwise-white product band acts as a one-step lift, mirroring the hero''s polarity flip.
- **Wordmark banner as terminal depth**: the giant `together.ai` letters at the bottom are technically inside `{colors.canvas}` but tinted toward `{colors.hairline}` so they read as a faint stencil, giving the page a final "you have arrived" sign-off.', '{"sourcePath":"docs/design-md/together.ai/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero / research full-bleed bands; the footer wordmark banner. |
| `{rounded.xs}` | 3.25px | The pricing page''s slightly tighter sub-tab and outline button. |
| `{rounded.sm}` | 4px | The brand''s canonical radius — buttons, badges, cards, data-table rows, stat tiles. |
| `{rounded.md}` | 8px | Feature-tab pills inside the "Full-stack cloud" section, larger pricing-tab containers. |
| `{rounded.full}` | 9999px | The floating chat-launcher orb (`button-icon-circular`). The only fully-pill shape in the system. |

### Photography Geometry
- **Hero ribbon**: SVG gradient, free-form; no aspect-ratio constraint.
- **Customer logos**: vector, rendered grayscale at consistent height (~24 px) in a wrapping flex row.
- **Testimonial portraits**: 1:1 square crop with hard-edge corners — no avatar pill.
- **Article thumbnails**: 16:9 with `{rounded.sm}` 4 px top-corner radius on the image only; card chrome stays square.', '{"sourcePath":"docs/design-md/together.ai/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — the black pill that carries every primary CTA.
- Background `{colors.primary}`, text `{colors.on-primary}`, label set in `{typography.mono-caps-button}` (uppercase mono, 16 px / 500 / 0.08 px tracking), shape `{rounded.sm}` 4 px, padding `{spacing.xs} {spacing.2xl}`. No shadow.

**`button-secondary-mint`** — the hero secondary CTA pill.
- Background `{colors.accent-mint}`, text `{colors.ink}`, same typography and shape as `button-primary`. Only appears in hero contexts.

**`button-secondary-white`** — the white pill paired with `button-secondary-mint` inside the hero.
- Background `{colors.canvas}`, text `{colors.ink}`, same typography and shape. Always sits adjacent to the mint or primary button.

**`button-ghost-on-dark`** — the translucent button used on dark hero / research surfaces.
- Background `{colors.surface-dark-soft}`, text `{colors.on-dark}`, shape `{rounded.sm}` 4 px. Used for "Read more" / "Watch the announcement" affordances on dark bands.

**`button-outline`** — the white-on-white outline button used inside pricing pages and feature toggles.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, shape `{rounded.xs}` 3.25 px.

**`button-icon-circular`** — the floating chat-launcher orb in the bottom-right of every page.
- Background `{colors.primary}`, white icon, shape `{rounded.full}`. The only fully-pill shape in the system.

### Cards & Containers

**`research-card`** — the 4-up grid card on the dark "Grounded in cutting-edge research" band.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, 1 px solid `{colors.surface-dark-soft}` border, padding `{spacing.2xl}`, shape `{rounded.sm}` 4 px. Inside: mono eyebrow tag + display headline + body paragraph.

**`testimonial-card`** — the 3-up "AI natives build on Together AI" card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.sm}` 4 px. Inside: 1:1 portrait crop + display-md name + body quote + mono caption stat row.

**`article-card`** — the 2-up "What''s new at Together AI" article card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.sm}` 4 px. Inside: 16:9 image at top + mono eyebrow tag + display-md title + body summary + mono caption byline.

**`code-editor-mockup`** — the dark code-preview surface inside the product band.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, body in `{typography.mono-caption}`, padding `{spacing.2xl}`, shape `{rounded.sm}` 4 px. Window chrome stays minimal — no traffic-light dots, no title bar.

**`stats-card-tinted`** — the pastel-tinted stat tile (mint, peach, periwinkle) on the white middle band.
- Background `{colors.accent-mint}` (or sibling accent tints), text `{colors.ink}`, big number in `{typography.display-xl}` + label in `{typography.mono-caps-eyebrow}`, padding `{spacing.3xl}`, shape `{rounded.sm}` 4 px.

### Inputs & Forms

**`text-input`** — the form input on the startup-accelerator application form.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, body set in `{typography.body-md}`, shape `{rounded.sm}` 4 px.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas-dark}` on the hero band, switches to `{colors.canvas}` once the user scrolls past the hero. Text `{colors.on-dark}` on dark, `{colors.ink}` on white. Layout: logo left, link row centre, "Contact sales" + "Sign in" right.

**`nav-link`** — the centred link row inside `nav-bar`.
- Text `{colors.on-dark}` (or `{colors.ink}` after scroll), set in `{typography.body-md}` 400 weight. Links separate with `{spacing.2xl}` 24 px between siblings.

**`footer`** — the bottom 4-column nav.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.section} {spacing.3xl}`. Eyebrow labels in `{typography.mono-caps-eyebrow}`; link rows in `{typography.body-md}`.

### Signature Components

**`hero-band-dark`** — the dark navy hero that opens every product / marketing page.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, padding `{spacing.section} {spacing.3xl}`. Headline in `{typography.display-xxl}` (sentence case, never all-caps). Eyebrow in `{typography.mono-caps-eyebrow}`. Two-column layout: headline + CTA cluster on left, gradient ribbon SVG on right.

**`research-band-dark`** — the dark navy band that hosts the "Grounded in cutting-edge research" 4-up card grid.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, padding `{spacing.section} {spacing.3xl}`. Section headline in `{typography.display-xl}` followed by the `research-card` grid.

**`feature-tab-pill`** — the tab pill row inside the "Full-stack cloud" section.
- Background `{colors.canvas}`, text `{colors.ink}`, label in `{typography.body-md-strong}`, padding `{spacing.md} {spacing.2xl}`, shape `{rounded.md}` 8 px. Tab group sits on `{colors.hairline}` rail.

**`pricing-sub-tab`** — the secondary tab row inside the pricing-page model table (TEXT / VISION / IMAGE / AUDIO / VIDEO).
- Background `{colors.canvas}`, text `{colors.ink}`, label in `{typography.body-md}`, padding `{spacing.sm} {spacing.lg}`, shape `{rounded.xs}` 3.25 px.

**`data-table-row`** — the model row inside the pricing serverless-inference table.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` bottom border, padding `{spacing.md} {spacing.lg}`. Inside: model icon + model name (display sans) + input cost cell + output cost cell.

**`data-table-header`** — the table header row.
- Background `{colors.hairline}`, text `{colors.body}`, set in `{typography.mono-caps-eyebrow}` (uppercase mono), padding `{spacing.md} {spacing.lg}`.

**`toggle-pill-group`** — the "Standard Pricing / Wholesale Pricing" segmented control above the fine-tuning table.
- Background `{colors.hairline}` rail, individual pills `{colors.canvas}` (inactive) or `{colors.primary}` (active), label in `{typography.mono-caps-button}`, shape `{rounded.sm}` 4 px, rail padding `{spacing.xs}`.

**`badge-neutral`** — the inline tag pill on light surfaces.
- Background `{colors.hairline}`, text `{colors.ink}`, body in `{typography.body-md}`, 1 px solid `{colors.hairline}` border, padding `{spacing.xxs} {spacing.sm}`, shape `{rounded.sm}` 4 px.

**`badge-subtle-on-dark`** — the inline tag pill on dark hero / research surfaces.
- Background `{colors.surface-dark-soft}`, text `{colors.on-dark}`, body in `{typography.body-md}`, padding `{spacing.xxs} {spacing.sm}`, shape `{rounded.sm}` 4 px.

**`footer-wordmark-banner`** — the massive `together.ai` wordmark at the bottom of every page.
- Background `{colors.canvas}`, wordmark colour `{colors.hairline}` (faint stencil tint), set in `{typography.display-xxl}` scaled fluidly to the viewport width. Edge-to-edge, square corners. Acts as the final page sign-off.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`', '{"sourcePath":"docs/design-md/together.ai/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (`#000000`) for every primary CTA. One black pill per visible viewport — that consistency is the brand''s whole conversion story.
- Set every section eyebrow and button label in `{typography.mono-caps-button}` / `{typography.mono-caps-eyebrow}` — uppercase mono, positive tracking.
- Pair the brand gradient (`{colors.accent-orange}` → `{colors.accent-magenta}` → `{colors.accent-periwinkle}`) at hero scale only. The gradient is the brand chrome; never shrink to icon size.
- Cycle page surfaces in the `{colors.canvas-dark}` → `{colors.canvas}` → `{colors.canvas-dark}` rhythm; the dark-light contrast carries elevation more than any shadow.
- Use `{rounded.sm}` 4 px as the canonical card / button radius across the system; reserve `{rounded.full}` for the single floating chat-launcher orb.
- Render the giant `together.ai` wordmark banner at the bottom of every long page in `{typography.display-xxl}`, tinted toward `{colors.hairline}` so it reads as a stencil — not as a heavy footer title.

### Don''t
- Don''t introduce a fifth accent colour. The three-stop gradient + mint pill is the entire decorative palette; new accents flatten the brand.
- Don''t set body paragraphs in the mono face. The mono is for labels only; long-form mono reads as a console log, not as marketing copy.
- Don''t centre-align body paragraphs under a left-aligned display headline. The brand keeps text-block alignment consistent within a copy stack.
- Don''t drop a soft drop-shadow on light-surface cards. The brand uses hairlines and surface contrast for elevation; soft shadows belong only on the floating chat-launcher orb.
- Don''t reduce the brand gradient to a single-colour fill, reorder its stops, or add a fourth stop. The gradient is a fixed object.
- Don''t switch the primary button shape to a full pill `{rounded.full}`. The brand''s CTA shape is a slightly-rounded rectangle, never a full pill.
- Don''t set headlines in the all-caps mono. Every all-caps moment belongs to the mono face; every headline belongs to the display sans in sentence case.', '{"sourcePath":"docs/design-md/together.ai/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_1', '#000000', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_3', '#959494', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_4', '#010120', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_5', '#313641', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_6', '#fc4c02', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_7', '#ef2cc1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_8', '#bdbbff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_9', '#c8f6f9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_10', '#ebebeb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_11', '#26263a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md'), 'color', 'color_12', '#999999', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/together.ai/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/together.ai/DESIGN.md';


-- Uber
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Uber', 'uber', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/uber/DESIGN.md', null, 'seeded', '---
version: alpha
name: Uber-Inspired-design-analysis
description: An inspired interpretation of Uber''s design language — a transportation-and-delivery super-app brand whose web surface is a black-and-white duet, framed by a custom geometric display sans, accented by a single signature pill shape (radius 999px) on every interactive element, and decorated only by editorial 4:3 illustrations of riders, drivers, and city objects.

colors:
  primary: "#000000"
  on-primary: "#ffffff"
  ink: "#000000"
  body: "#5e5e5e"
  mute: "#afafaf"
  hairline-mid: "#4b4b4b"
  canvas: "#ffffff"
  canvas-soft: "#efefef"
  canvas-softer: "#f3f3f3"
  surface-pressed: "#e2e2e2"
  link: "#0000ee"
  on-dark: "#ffffff"
  black-elevated: "#282828"

typography:
  display-xxl:
    fontFamily: UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 52px
    fontWeight: 700
    lineHeight: 64px
  display-xl:
    fontFamily: UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 36px
    fontWeight: 700
    lineHeight: 44px
  display-lg:
    fontFamily: UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
  display-md:
    fontFamily: UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
  display-sm:
    fontFamily: UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 20px
    fontWeight: 700
    lineHeight: 28px
  body-lg:
    fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 500
    lineHeight: 24px
  body-md:
    fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 20px
  body-sm:
    fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 16px
  caption:
    fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 20px
  button-large:
    fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 500
    lineHeight: 24px
  button-md:
    fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 20px

rounded:
  none: 0px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 999px
  pill-tab: 36px
  full: 9999px

spacing:
  xxs: 4px
  xs: 6px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-strong}"
    padding: "{spacing.lg} {spacing.3xl}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body-md-strong}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md} {spacing.md}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md} {spacing.md}"
  button-subtle:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md} {spacing.lg}"
  button-floating:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md}"
  button-large-rounded:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-large}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg} {spacing.xl}"
  button-tab-translucent:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-strong}"
    rounded: "{rounded.pill-tab}"
  text-input:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  text-input-on-soft:
    backgroundColor: "{colors.canvas-softer}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  card-content:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
  card-elevated:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
  card-soft-tinted:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
  promo-card-illustrated:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
  promo-card-on-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
  request-form-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  request-form-input-row:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  category-button:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm} {spacing.lg}"
  faq-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-strong}"
    padding: "{spacing.lg} 0"
  app-download-pill:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md} {spacing.xl}"
  hero-band-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xxl}"
    padding: "{spacing.3xl} {spacing.3xl}"
  hero-band-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xxl}"
    padding: "{spacing.3xl} {spacing.3xl}"
  showcase-image-card:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xxl}"
    rounded: "{rounded.xl}"
    padding: "{spacing.3xl}"
  link-blue:
    textColor: "{colors.link}"
    typography: "{typography.body-md}"
  link-on-dark:
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
  link-mute:
    textColor: "{colors.hairline-mid}"
    typography: "{typography.body-md}"
  link-mute-soft:
    textColor: "{colors.mute}"
    typography: "{typography.body-md}"
  icon-button-circular:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
  footer:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    padding: "{spacing.3xl} {spacing.3xl}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default tier card. Mirrors card-content chrome with canvas-soft surface and a faint border."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.surface-pressed}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
  ex-pricing-tier-featured:
    description: "Featured tier — polarity-flipped to ink with white text."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
  ex-product-selector:
    description: "Plan picker — re-purposed for the brand''s Ride / Eats / Reserve tier picker. Uses category-button pills inside the frame."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.none}"
    padding: "{spacing.2xl}"
  ex-cart-drawer:
    description: "Subscription summary — line items per add-on (NOT a literal e-commerce cart)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
    item-divider: "{colors.surface-pressed}"
  ex-app-shell-row:
    description: "Sidebar nav row. Active state uses brand primary as a left-edge indicator bar."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.lg}"
  ex-data-table-cell:
    description: "Default data-table th + td chrome. Header uses body-sm-strong 500 weight; body uses body-sm."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.body-sm-strong}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.md} {spacing.lg}"
    rowBorder: "{colors.surface-pressed}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Mirrors card-content chrome with text-input primitives inside."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as card-content with Level 2 drop shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
  ex-empty-state-card:
    description: "Empty-state illustration frame. Generous padding on canvas-soft surface."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — flat-cornered card-content chrome with Level 2 drop shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.lg}"
    typography: "{typography.body-sm}"

---


## Overview

Uber is a transportation-and-delivery super-app — ride, eats, freight, the whole urban logistics layer — and the brand''s web surface signals that scale through restraint: no third colour, no accent palette, no illustration that fights the headline. The page is structurally a black-and-white duet, where black `{colors.primary}` is the conversion anchor (every CTA pill, every nav login button, the footer fill) and `{colors.canvas}` white carries everything else. The only consistent decoration is a body of editorial 4:3 illustrations — riders, drivers, parking lots, cars-on-highway — that ground the marketing without leaking accent colour into the system.

Type is the second decisive voice. Two custom faces carry every page: `UberMove` at weight 700 for headlines (32 – 52 px display sizes with tight 1.22 – 1.25 line-height, never letter-spaced), and `UberMoveText` at weights 400 / 500 for body, button, and link. The pairing reads as engineering-grade — no italic, no decorative weight, no tracking flourish. Headlines are sentence-case; eyebrows are uppercase only when used as the section eyebrow ("WHY BECOME"); buttons are sentence-case.

The single shape signature is the pill. Every interactive element rounds to `{rounded.pill}` 999 px — primary CTA, secondary CTA, subtle gray pill, white floating pill, category chip, app-download badge. Cards and surfaces round to `{rounded.xl}` 16 px; the larger "Go Get 2026" annual-showcase card uses the same 16 px shape, just at scale. The tab-toggle on the hero ride-request form uses an off-shape `{rounded.pill-tab}` 36 px — barely-pill, deliberately tighter than the canonical 999 px pill.

**Key Characteristics:**
- A two-colour CTA hierarchy: black `{colors.primary}` pill for primary conversion targets; white `{colors.canvas}` pill (sometimes with a soft drop shadow) for secondary; subtle gray `{colors.canvas-soft}` pill for tertiary or chip variants.
- The pill is the single signature shape — `{rounded.pill}` 999 px on every interactive element except the tab-toggle (`{rounded.pill-tab}` 36 px) and the larger product cards (`{rounded.xl}` 16 px).
- Every headline is sentence-case in `{typography.display-xl}` / `{typography.display-xxl}` weight 700; no all-caps display.
- Editorial 4:3 illustrations of riders / drivers / cars are the only consistent decorative system; no gradients, no atmospheric backdrops, no shadows that aren''t card-elevation hints.
- A signature alternating-band rhythm: white feature card → black promo card (with white text and white CTA) → white feature card → black footer. The black bands are NOT hero-only; they appear mid-page as promo callouts.
- A signature ride-request form card on the hero: pickup pin input + destination input + date/time chip + black "See prices" pill, all stacked inside a `{rounded.xl}` shadowed card.

## Colors

### Brand & Accent
- **Ink Black** (`{colors.primary}` — `#000000`): The brand''s only conversion colour. Every primary CTA pill, the footer fill, every dark promo band, every nav login button. The system has no secondary accent.
- **Surface Pressed** (`{colors.surface-pressed}` — `#e2e2e2`): The pressed-state fill for white pills — a soft grey that''s used only in active / pressed states.
- **Black Elevated** (`{colors.black-elevated}` — `#282828`): A near-black used on hover for the translucent white tab-toggle pill. Documented as a system colour because it appears on a recurring brand control.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default page background.
- **Canvas Soft** (`{colors.canvas-soft}` — `#efefef`): The soft gray fill for category chips, form-input rows inside the ride-request card, and subtle pill buttons.
- **Canvas Softer** (`{colors.canvas-softer}` — `#f3f3f3`): A slightly lighter gray used as a nested-input fill on white surfaces.

### Text
- **Ink** (`{colors.ink}` — `#000000`): Every heading and body paragraph on light surfaces.
- **Body** (`{colors.body}` — `#5e5e5e`): Secondary text — captions, sub-headings, supporting copy.
- **Hairline Mid** (`{colors.hairline-mid}` — `#4b4b4b`): A mid-gray used for muted link text inside footer columns and breadcrumb-style nav.
- **Mute** (`{colors.mute}` — `#afafaf`): The lightest text role — placeholder text, fine print, low-priority metadata.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): All text on `{colors.ink}` surfaces (footer, dark promo bands).

### Semantic
The brand does not maintain a separate error / success / warning palette in its public marketing surface. Validation cues come from the primary black or from the brand''s editorial illustrations. The `#0000ee` link colour is the system''s only chromatic — it''s the browser-default link blue, appearing in body-copy inline links inside legal / footer text.

## Typography

### Font Family
Two custom faces carry the entire system:

1. **A custom geometric display sans** (extracted as `UberMove`) for every headline. Weight 700 only; no italic; no tracking variation. Sizes range from `display-sm` 20 px up to `display-xxl` 52 px on the hero. Line-heights tighten to 1.22 – 1.25 at display sizes for a poured-on-the-page look.
2. **A custom text sans** (extracted as `UberMoveText`) for body, button, link, and small headings. Weights 400 and 500 are the working pair. Used at 12 – 18 px; 24 px maximum for ride-request form labels. Tracking is always neutral.

The two faces share a family DNA but never overlap roles — the display face never carries a body paragraph; the text face never carries a hero headline.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display-xxl}` | 52px | 700 | 64px | Hero headline ("Go anywhere with Uber", "Drive when you want"). |
| `{typography.display-xl}` | 36px | 700 | 44px | Page section headlines ("Plan for later", "Safety, simplified"). |
| `{typography.display-lg}` | 32px | 700 | 40px | Promo-card headlines. |
| `{typography.display-md}` | 24px | 700 | 32px | Card titles, illustrated-promo headlines. |
| `{typography.display-sm}` | 20px | 700 | 28px | Sub-card headings. |
| `{typography.body-lg}` | 18px | 500 | 24px | Lead paragraphs and larger body. |
| `{typography.body-md}` | 16px | 400 | 24px | Default paragraph body. |
| `{typography.body-md-strong}` | 16px | 500 | 20px | Bolded inline body and most button labels. |
| `{typography.body-sm}` | 14px | 400 | 20px | Captions, secondary metadata. |
| `{typography.body-sm-strong}` | 14px | 500 | 16px | Bold caption / chip labels. |
| `{typography.caption}` | 12px | 400 | 20px | Fine print, footer secondary lines. |
| `{typography.button-large}` | 18px | 500 | 24px | Large rounded buttons inside the ride-request form. |
| `{typography.button-md}` | 16px | 500 | 20px | Default button label. |

### Principles
- **Sentence-case is the voice.** No all-caps headlines. Eyebrow tags ("WHY BECOME") are the rare exception.
- **Weight 700 is for headlines; weight 500 is for buttons and emphasis.** Don''t promote button labels to 700.
- **No tracking flourish.** The display face is never letter-spaced, positive or negative.
- **Two faces, two roles.** UberMove for display; UberMoveText for everything else. Never cross the streams.

### Note on Font Substitutes
The two faces are proprietary. Open-source substitutes:
- **Display sans** — *Inter* weight 700 with `font-feature-settings: "ss01"` enabled comes closest. *Geist* weight 700 is the second-best option.
- **Text sans** — *Inter* weights 400 / 500 match the geometric width and x-height. *Plus Jakarta Sans* is a softer alternative if the brand wants a less neutral feel.

## Layout

### Spacing System
- **Base unit**: 4 px. Most captured values are multiples of 4 with a few 6-px sub-multiples (10, 14) inside button padding.
- **Tokens**: `{spacing.xxs}` 4 px · `{spacing.xs}` 6 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px.
- **Section padding**: marketing bands sit at `{spacing.3xl}` 32 px top/bottom on tighter pages and `{spacing.3xl} {spacing.3xl}` for hero bands; promo cards inset at `{spacing.2xl}` 24 px.
- **Card interior padding**: content cards sit at `{spacing.2xl}` 24 px; the ride-request form uses `{spacing.lg}` 16 px to keep the form compact.
- **Inline gap**: button rows, category chip rows, app-store pill rows use `{spacing.md}` 12 px between siblings.

### Grid & Container
- **Max width**: ~1200 px container; centred with horizontal gutters of `{spacing.3xl}` 32 px on desktop, `{spacing.lg}` 16 px on mobile.
- **Column patterns**:
  - Promo-card rows: 2-up at desktop (image left + content right, alternating sides), 1-up at mobile.
  - Category chips: horizontal flex with wrap.
  - FAQ rows: full-width single-column.
  - App-download pills: 2-up at desktop (Rider + Driver), 1-up at mobile.

### Whitespace Philosophy
Card-to-card spacing carries the rhythm — between two stacked promo cards there''s roughly a full `{spacing.3xl}` 32 px gutter; inside a card the headline / paragraph / CTA stack is tight (`{spacing.sm}` 8 px between siblings). The black promo bands and the footer have no internal hairlines — content sits on flat ink with white text.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 600px | Nav collapses to hamburger; promo cards stack; ride-request form becomes full-width. |
| Mobile-Large | 600–767px | Same as Mobile; chip rows enable horizontal scroll. |
| Tablet | 768–1119px | 2-up promo grid at upper widths; nav stays horizontal until ≥ 1120 px. |
| Desktop | 1120–1135px | Full nav row visible; promo cards 2-up. |
| Desktop-Large | ≥ 1136px | Container caps at ~1200 px; bands stay edge-to-edge while content centres. |

#### Touch Targets
The pill `button-primary` renders at ~44 px tall (10 px vertical padding + 24 px label line-height); the larger `button-large-rounded` at ~56 px. Both meet WCAG AAA at all breakpoints. Category chips inflate to ≥ 44 px tall through extra padding on touch viewports.

#### Collapsing Strategy
- **Nav**: full link row + Help / Log in / Sign up pills at desktop. Collapses to logo + hamburger at mobile; menu overlays full-screen with the same link list stacked.
- **Ride-request form card**: at desktop, the form sits inside a max-490-px `{rounded.xl}` card with shadow. At mobile, full-width with edge-to-edge.
- **Promo cards**: at desktop, image-left + content-right (or alternating). At mobile, image always above content.
- **Annual showcase card**: scales from a 2:3 desktop frame to a 4:3 mobile frame; date text resizes proportionally.

#### Image Behavior
- **Editorial illustrations**: 4:3 or 16:9 hard-edge rectangles; never cropped to a circle, never tilted. Aspect preserved.
- **Photography**: same — square or landscape; framed inside `{rounded.xl}` card chrome.
- **Maps in ride-request flow**: full-bleed inside a card; rounded corners follow the parent card.
- **Logo bar**: SVG vector, monochrome, consistent height.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default — most cards and surfaces lean on hairline-of-canvas contrast. |
| Level 1 — Subtle Drop | `rgba(0, 0, 0, 0.12) 0px 4px 16px 0px` | Card-elevated frames around promo cards on light bands. |
| Level 2 — Card Drop | `rgba(0, 0, 0, 0.16) 0px 4px 16px 0px` | The ride-request form card on the hero; large content cards with embedded forms. |
| Level 3 — Pill Float | `rgba(0, 0, 0, 0.16) 0px 2px 8px 0px` | The floating white pill button (the one that floats over hero photography). |

### Decorative Depth
- **Black bands as polarity-flip depth**: the brand uses pure black `{colors.primary}` mid-page bands to break the white-on-white rhythm. The polarity shift IS the depth cue.
- **Editorial illustrations as in-card depth**: every promo card has a single 4:3 illustration as its left or right column. The illustration''s visual weight is part of the card''s elevation read.
- **Pill geometry as micro-depth**: `{rounded.pill}` 999 px applied at varying button heights creates a stack of nested pills that reads as visual hierarchy.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed hero bands, footer fill, raw image edges. |
| `{rounded.md}` | 8px | Form-input fields inside the ride-request card. |
| `{rounded.lg}` | 12px | Smaller secondary card chrome. |
| `{rounded.xl}` | 16px | Canonical card radius — promo cards, content cards, ride-request form card, annual-showcase card, large rounded buttons. |
| `{rounded.pill}` | 999px | The brand''s signature interactive shape — every pill button, category chip, app-download pill, icon button. |
| `{rounded.pill-tab}` | 36px | The translucent-white tab-toggle pill on the hero (Ride / Drive). |
| `{rounded.full}` | 9999px | Identical effect to `{rounded.pill}` for circular icon containers. |

### Photography Geometry
- **Editorial illustrations**: 4:3 landscape inside promo cards; 16:9 for full-width showcase frames.
- **Driver / rider portraits**: 4:5 portrait crop; framed by `{rounded.xl}` 16 px card chrome.
- **Annual showcase image**: 2:3 portrait at desktop, scaling to 4:3 at mobile. The image fills the card; the headline overlays the bottom.
- **Logo bar**: monochrome SVG vectors at consistent ~24 px height.
- **Avatars** (where used): square or `{rounded.full}` circle, never `{rounded.lg}` rounded-square.

## Components

### Buttons

**`button-primary`** — the canonical black pill, the brand''s conversion target.
- Background `{colors.primary}`, text `{colors.on-primary}`, label set in `{typography.button-md}`, padding `{spacing.md} {spacing.md}`, shape `{rounded.pill}` 999 px.

**`button-secondary`** — the white pill paired with the black primary.
- Background `{colors.canvas}`, text `{colors.ink}`, same label and padding as `button-primary`, shape `{rounded.pill}`.

**`button-subtle`** — the gray secondary pill used for tertiary actions inside cards (e.g., "Learn more" / "Use Reserve").
- Background `{colors.canvas-soft}` (`#efefef`), text `{colors.ink}`, label in `{typography.button-md}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.pill}`.

**`button-floating`** — the white pill with a subtle drop-shadow that floats over a dark or photographic surface.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md}`, shape `{rounded.pill}`. Carries a Level 3 pill-float shadow.

**`button-large-rounded`** — the bigger black call-to-action used inside the ride-request flow ("Yes, help me").
- Background `{colors.primary}`, text `{colors.on-primary}`, label in `{typography.button-large}`, padding `{spacing.lg} {spacing.xl}`, shape `{rounded.xl}` 16 px (not pill — the only black CTA that breaks the pill rule, used in the larger form context).

**`button-tab-translucent`** — the tab-toggle on the hero ride-request form (Ride / Drive).
- Background `{colors.canvas}`, text `{colors.ink}`, label in `{typography.body-md-strong}`, shape `{rounded.pill-tab}` 36 px (off-shape, deliberately tighter than the canonical 999 px pill).

### Cards & Containers

**`card-content`** — the canonical content card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.xl}` 16 px. No shadow on the default state.

**`card-elevated`** — the content card with Level 1 subtle drop.
- Background `{colors.canvas}`, text `{colors.ink}`, same padding + shape as `card-content`. Shadow at Level 1.

**`card-soft-tinted`** — the gray-tinted card used as a sub-region inside the page (e.g., "Plan for later" callout).
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.xl}`.

**`promo-card-illustrated`** — the 2-column promo card with illustration on one side and copy on the other.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.xl}`. Headline in `{typography.display-md}` or larger.

**`promo-card-on-dark`** — the polarity-flipped promo card in black.
- Background `{colors.ink}`, text `{colors.on-dark}`, padding `{spacing.2xl}`, shape `{rounded.xl}`. Used for the "Drive with Uber" mid-page band.

**`request-form-card`** — the hero ride-request form chrome.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.xl}`. Carries Level 2 card drop shadow.

**`request-form-input-row`** — the per-field row inside the request-form card.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.md}` 8 px. Hosts an icon + label + value.

**`showcase-image-card`** — the giant "GO•GET 2026" annual showcase card.
- Background `{colors.ink}`, text `{colors.on-dark}` overlay, padding `{spacing.3xl}`, shape `{rounded.xl}`. Display-xxl headline overlays the bottom of the image.

### Inputs & Forms

**`text-input`** — the canonical text input.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, body in `{typography.body-md}`, padding `{spacing.lg}`, shape `{rounded.md}` 8 px.

**`text-input-on-soft`** — the nested input on a white card (slightly lighter fill).
- Background `{colors.canvas-softer}`, otherwise identical to `text-input`.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas}` on light pages, switches to `{colors.ink}` on the rare dark page (e.g., Uber Eats hero). Padding `{spacing.lg} {spacing.3xl}`.

**`nav-link`** — the link row inside `nav-bar`.
- Text `{colors.ink}`, set in `{typography.body-md-strong}` 500 weight.

**`footer`** — the deep-black footer band.
- Background `{colors.primary}` (the brand''s only true black surface), text `{colors.on-dark}`, padding `{spacing.3xl} {spacing.3xl}`. Body in `{typography.body-sm}`; column eyebrows in `{typography.body-md-strong}`.

### Signature Components

**`hero-band-light`** — the white hero with the ride-request card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.3xl}`. Headline in `{typography.display-xxl}` (52 px / 700) on the left; `request-form-card` on the right.

**`hero-band-dark`** — the rare black hero (used on Uber Eats and Drive landing).
- Background `{colors.ink}`, text `{colors.on-dark}`, padding `{spacing.3xl} {spacing.3xl}`. Same display-xxl headline scale; CTA inverts to `button-secondary` white pill.

**`category-button`** — the horizontal-scroll category row ("Reserve / Rentals / Teens / Group rides").
- Background `{colors.canvas-soft}`, text `{colors.ink}`, label in `{typography.body-sm-strong}`, padding `{spacing.sm} {spacing.lg}`, shape `{rounded.pill}`. An icon precedes the label.

**`faq-row`** — the FAQ accordion item.
- Background `{colors.canvas}`, text `{colors.ink}`, question in `{typography.body-md-strong}`, padding `{spacing.lg}` 0. No card chrome — hairline dividers between rows.

**`app-download-pill`** — the "Download the Rider app" / "Download the Driver app" pill.
- Background `{colors.ink}`, text `{colors.on-dark}`, label in `{typography.body-md-strong}`, padding `{spacing.md} {spacing.xl}`, shape `{rounded.pill}`.

**`icon-button-circular`** — the round icon container used in the nav and inside the ride-request card.
- Background `{colors.canvas-soft}`, dark icon, shape `{rounded.full}`. No label.

### Links

**`link-blue`** — the system-default browser-blue link inside legal / footer fine print.
- Text `{colors.link}` (`#0000ee`), body in `{typography.body-md}`.

**`link-on-dark`** — the white link inside dark bands.
- Text `{colors.on-dark}`, body in `{typography.body-md}`.

**`link-mute`** — the muted gray link inside footer columns.
- Text `{colors.hairline-mid}`, body in `{typography.body-md}`.

**`link-mute-soft`** — the lightest gray link, used for low-priority secondary text on dark surfaces.
- Text `{colors.mute}`, body in `{typography.body-md}`.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (`#000000`) for every primary CTA pill. One black pill per visible viewport is the brand''s whole conversion story.
- Use `{rounded.pill}` 999 px on every interactive element (buttons, chips, app pills). The pill IS the brand''s geometric signature.
- Render cards in `{rounded.xl}` 16 px — promo cards, content cards, the ride-request form card, the annual-showcase card all share this radius.
- Set every headline in `{typography.display-*}` weight 700 in sentence-case. The display face never carries body copy.
- Use polarity-flipped black promo bands mid-page to break up white-on-white rhythm. The polarity shift IS the depth cue.
- Anchor every promo card with a 4:3 editorial illustration; never use generic stock imagery.

### Don''t
- Don''t introduce a second brand accent colour (orange, blue, green). The brand''s entire UI is black-and-white plus grayscale; new accents flatten the system.
- Don''t render the primary CTA as a `{rounded.xl}` rectangle except inside the larger ride-request flow (where `button-large-rounded` is the documented exception).
- Don''t use all-caps display headlines. Sentence-case is the voice; uppercase is restricted to rare eyebrow tags.
- Don''t drop a soft drop-shadow on every card. The brand uses Level 0 flat as the default; shadow is reserved for the floating pill and the ride-request form.
- Don''t reduce the brand to its illustration system alone. The pill geometry + black/white duet carries the brand even without illustrations.
- Don''t tighten or loosen letter-spacing on the display face. The brand never letter-spaces; default tracking is part of the voice.
- Don''t use `{rounded.full}` 9999 px for square cards — the pill 999 px and full 9999 px effects are identical for interactive elements, but cards stay at `{rounded.xl}` 16 px.
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

Uber is a transportation-and-delivery super-app — ride, eats, freight, the whole urban logistics layer — and the brand''s web surface signals that scale through restraint: no third colour, no accent palette, no illustration that fights the headline. The page is structurally a black-and-white duet, where black `{colors.primary}` is the conversion anchor (every CTA pill, every nav login button, the footer fill) and `{colors.canvas}` white carries everything else. The only consistent decoration is a body of editorial 4:3 illustrations — riders, drivers, parking lots, cars-on-highway — that ground the marketing without leaking accent colour into the system.

Type is the second decisive voice. Two custom faces carry every page: `UberMove` at weight 700 for headlines (32 – 52 px display sizes with tight 1.22 – 1.25 line-height, never letter-spaced), and `UberMoveText` at weights 400 / 500 for body, button, and link. The pairing reads as engineering-grade — no italic, no decorative weight, no tracking flourish. Headlines are sentence-case; eyebrows are uppercase only when used as the section eyebrow ("WHY BECOME"); buttons are sentence-case.

The single shape signature is the pill. Every interactive element rounds to `{rounded.pill}` 999 px — primary CTA, secondary CTA, subtle gray pill, white floating pill, category chip, app-download badge. Cards and surfaces round to `{rounded.xl}` 16 px; the larger "Go Get 2026" annual-showcase card uses the same 16 px shape, just at scale. The tab-toggle on the hero ride-request form uses an off-shape `{rounded.pill-tab}` 36 px — barely-pill, deliberately tighter than the canonical 999 px pill.

**Key Characteristics:**
- A two-colour CTA hierarchy: black `{colors.primary}` pill for primary conversion targets; white `{colors.canvas}` pill (sometimes with a soft drop shadow) for secondary; subtle gray `{colors.canvas-soft}` pill for tertiary or chip variants.
- The pill is the single signature shape — `{rounded.pill}` 999 px on every interactive element except the tab-toggle (`{rounded.pill-tab}` 36 px) and the larger product cards (`{rounded.xl}` 16 px).
- Every headline is sentence-case in `{typography.display-xl}` / `{typography.display-xxl}` weight 700; no all-caps display.
- Editorial 4:3 illustrations of riders / drivers / cars are the only consistent decorative system; no gradients, no atmospheric backdrops, no shadows that aren''t card-elevation hints.
- A signature alternating-band rhythm: white feature card → black promo card (with white text and white CTA) → white feature card → black footer. The black bands are NOT hero-only; they appear mid-page as promo callouts.
- A signature ride-request form card on the hero: pickup pin input + destination input + date/time chip + black "See prices" pill, all stacked inside a `{rounded.xl}` shadowed card.', '{"sourcePath":"docs/design-md/uber/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Ink Black** (`{colors.primary}` — `#000000`): The brand''s only conversion colour. Every primary CTA pill, the footer fill, every dark promo band, every nav login button. The system has no secondary accent.
- **Surface Pressed** (`{colors.surface-pressed}` — `#e2e2e2`): The pressed-state fill for white pills — a soft grey that''s used only in active / pressed states.
- **Black Elevated** (`{colors.black-elevated}` — `#282828`): A near-black used on hover for the translucent white tab-toggle pill. Documented as a system colour because it appears on a recurring brand control.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default page background.
- **Canvas Soft** (`{colors.canvas-soft}` — `#efefef`): The soft gray fill for category chips, form-input rows inside the ride-request card, and subtle pill buttons.
- **Canvas Softer** (`{colors.canvas-softer}` — `#f3f3f3`): A slightly lighter gray used as a nested-input fill on white surfaces.

### Text
- **Ink** (`{colors.ink}` — `#000000`): Every heading and body paragraph on light surfaces.
- **Body** (`{colors.body}` — `#5e5e5e`): Secondary text — captions, sub-headings, supporting copy.
- **Hairline Mid** (`{colors.hairline-mid}` — `#4b4b4b`): A mid-gray used for muted link text inside footer columns and breadcrumb-style nav.
- **Mute** (`{colors.mute}` — `#afafaf`): The lightest text role — placeholder text, fine print, low-priority metadata.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): All text on `{colors.ink}` surfaces (footer, dark promo bands).

### Semantic
The brand does not maintain a separate error / success / warning palette in its public marketing surface. Validation cues come from the primary black or from the brand''s editorial illustrations. The `#0000ee` link colour is the system''s only chromatic — it''s the browser-default link blue, appearing in body-copy inline links inside legal / footer text.', '{"sourcePath":"docs/design-md/uber/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
Two custom faces carry the entire system:

1. **A custom geometric display sans** (extracted as `UberMove`) for every headline. Weight 700 only; no italic; no tracking variation. Sizes range from `display-sm` 20 px up to `display-xxl` 52 px on the hero. Line-heights tighten to 1.22 – 1.25 at display sizes for a poured-on-the-page look.
2. **A custom text sans** (extracted as `UberMoveText`) for body, button, link, and small headings. Weights 400 and 500 are the working pair. Used at 12 – 18 px; 24 px maximum for ride-request form labels. Tracking is always neutral.

The two faces share a family DNA but never overlap roles — the display face never carries a body paragraph; the text face never carries a hero headline.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display-xxl}` | 52px | 700 | 64px | Hero headline ("Go anywhere with Uber", "Drive when you want"). |
| `{typography.display-xl}` | 36px | 700 | 44px | Page section headlines ("Plan for later", "Safety, simplified"). |
| `{typography.display-lg}` | 32px | 700 | 40px | Promo-card headlines. |
| `{typography.display-md}` | 24px | 700 | 32px | Card titles, illustrated-promo headlines. |
| `{typography.display-sm}` | 20px | 700 | 28px | Sub-card headings. |
| `{typography.body-lg}` | 18px | 500 | 24px | Lead paragraphs and larger body. |
| `{typography.body-md}` | 16px | 400 | 24px | Default paragraph body. |
| `{typography.body-md-strong}` | 16px | 500 | 20px | Bolded inline body and most button labels. |
| `{typography.body-sm}` | 14px | 400 | 20px | Captions, secondary metadata. |
| `{typography.body-sm-strong}` | 14px | 500 | 16px | Bold caption / chip labels. |
| `{typography.caption}` | 12px | 400 | 20px | Fine print, footer secondary lines. |
| `{typography.button-large}` | 18px | 500 | 24px | Large rounded buttons inside the ride-request form. |
| `{typography.button-md}` | 16px | 500 | 20px | Default button label. |

### Principles
- **Sentence-case is the voice.** No all-caps headlines. Eyebrow tags ("WHY BECOME") are the rare exception.
- **Weight 700 is for headlines; weight 500 is for buttons and emphasis.** Don''t promote button labels to 700.
- **No tracking flourish.** The display face is never letter-spaced, positive or negative.
- **Two faces, two roles.** UberMove for display; UberMoveText for everything else. Never cross the streams.

### Note on Font Substitutes
The two faces are proprietary. Open-source substitutes:
- **Display sans** — *Inter* weight 700 with `font-feature-settings: "ss01"` enabled comes closest. *Geist* weight 700 is the second-best option.
- **Text sans** — *Inter* weights 400 / 500 match the geometric width and x-height. *Plus Jakarta Sans* is a softer alternative if the brand wants a less neutral feel.', '{"sourcePath":"docs/design-md/uber/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4 px. Most captured values are multiples of 4 with a few 6-px sub-multiples (10, 14) inside button padding.
- **Tokens**: `{spacing.xxs}` 4 px · `{spacing.xs}` 6 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px.
- **Section padding**: marketing bands sit at `{spacing.3xl}` 32 px top/bottom on tighter pages and `{spacing.3xl} {spacing.3xl}` for hero bands; promo cards inset at `{spacing.2xl}` 24 px.
- **Card interior padding**: content cards sit at `{spacing.2xl}` 24 px; the ride-request form uses `{spacing.lg}` 16 px to keep the form compact.
- **Inline gap**: button rows, category chip rows, app-store pill rows use `{spacing.md}` 12 px between siblings.

### Grid & Container
- **Max width**: ~1200 px container; centred with horizontal gutters of `{spacing.3xl}` 32 px on desktop, `{spacing.lg}` 16 px on mobile.
- **Column patterns**:
  - Promo-card rows: 2-up at desktop (image left + content right, alternating sides), 1-up at mobile.
  - Category chips: horizontal flex with wrap.
  - FAQ rows: full-width single-column.
  - App-download pills: 2-up at desktop (Rider + Driver), 1-up at mobile.

### Whitespace Philosophy
Card-to-card spacing carries the rhythm — between two stacked promo cards there''s roughly a full `{spacing.3xl}` 32 px gutter; inside a card the headline / paragraph / CTA stack is tight (`{spacing.sm}` 8 px between siblings). The black promo bands and the footer have no internal hairlines — content sits on flat ink with white text.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 600px | Nav collapses to hamburger; promo cards stack; ride-request form becomes full-width. |
| Mobile-Large | 600–767px | Same as Mobile; chip rows enable horizontal scroll. |
| Tablet | 768–1119px | 2-up promo grid at upper widths; nav stays horizontal until ≥ 1120 px. |
| Desktop | 1120–1135px | Full nav row visible; promo cards 2-up. |
| Desktop-Large | ≥ 1136px | Container caps at ~1200 px; bands stay edge-to-edge while content centres. |

#### Touch Targets
The pill `button-primary` renders at ~44 px tall (10 px vertical padding + 24 px label line-height); the larger `button-large-rounded` at ~56 px. Both meet WCAG AAA at all breakpoints. Category chips inflate to ≥ 44 px tall through extra padding on touch viewports.

#### Collapsing Strategy
- **Nav**: full link row + Help / Log in / Sign up pills at desktop. Collapses to logo + hamburger at mobile; menu overlays full-screen with the same link list stacked.
- **Ride-request form card**: at desktop, the form sits inside a max-490-px `{rounded.xl}` card with shadow. At mobile, full-width with edge-to-edge.
- **Promo cards**: at desktop, image-left + content-right (or alternating). At mobile, image always above content.
- **Annual showcase card**: scales from a 2:3 desktop frame to a 4:3 mobile frame; date text resizes proportionally.

#### Image Behavior
- **Editorial illustrations**: 4:3 or 16:9 hard-edge rectangles; never cropped to a circle, never tilted. Aspect preserved.
- **Photography**: same — square or landscape; framed inside `{rounded.xl}` card chrome.
- **Maps in ride-request flow**: full-bleed inside a card; rounded corners follow the parent card.
- **Logo bar**: SVG vector, monochrome, consistent height.', '{"sourcePath":"docs/design-md/uber/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default — most cards and surfaces lean on hairline-of-canvas contrast. |
| Level 1 — Subtle Drop | `rgba(0, 0, 0, 0.12) 0px 4px 16px 0px` | Card-elevated frames around promo cards on light bands. |
| Level 2 — Card Drop | `rgba(0, 0, 0, 0.16) 0px 4px 16px 0px` | The ride-request form card on the hero; large content cards with embedded forms. |
| Level 3 — Pill Float | `rgba(0, 0, 0, 0.16) 0px 2px 8px 0px` | The floating white pill button (the one that floats over hero photography). |

### Decorative Depth
- **Black bands as polarity-flip depth**: the brand uses pure black `{colors.primary}` mid-page bands to break the white-on-white rhythm. The polarity shift IS the depth cue.
- **Editorial illustrations as in-card depth**: every promo card has a single 4:3 illustration as its left or right column. The illustration''s visual weight is part of the card''s elevation read.
- **Pill geometry as micro-depth**: `{rounded.pill}` 999 px applied at varying button heights creates a stack of nested pills that reads as visual hierarchy.', '{"sourcePath":"docs/design-md/uber/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed hero bands, footer fill, raw image edges. |
| `{rounded.md}` | 8px | Form-input fields inside the ride-request card. |
| `{rounded.lg}` | 12px | Smaller secondary card chrome. |
| `{rounded.xl}` | 16px | Canonical card radius — promo cards, content cards, ride-request form card, annual-showcase card, large rounded buttons. |
| `{rounded.pill}` | 999px | The brand''s signature interactive shape — every pill button, category chip, app-download pill, icon button. |
| `{rounded.pill-tab}` | 36px | The translucent-white tab-toggle pill on the hero (Ride / Drive). |
| `{rounded.full}` | 9999px | Identical effect to `{rounded.pill}` for circular icon containers. |

### Photography Geometry
- **Editorial illustrations**: 4:3 landscape inside promo cards; 16:9 for full-width showcase frames.
- **Driver / rider portraits**: 4:5 portrait crop; framed by `{rounded.xl}` 16 px card chrome.
- **Annual showcase image**: 2:3 portrait at desktop, scaling to 4:3 at mobile. The image fills the card; the headline overlays the bottom.
- **Logo bar**: monochrome SVG vectors at consistent ~24 px height.
- **Avatars** (where used): square or `{rounded.full}` circle, never `{rounded.lg}` rounded-square.', '{"sourcePath":"docs/design-md/uber/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — the canonical black pill, the brand''s conversion target.
- Background `{colors.primary}`, text `{colors.on-primary}`, label set in `{typography.button-md}`, padding `{spacing.md} {spacing.md}`, shape `{rounded.pill}` 999 px.

**`button-secondary`** — the white pill paired with the black primary.
- Background `{colors.canvas}`, text `{colors.ink}`, same label and padding as `button-primary`, shape `{rounded.pill}`.

**`button-subtle`** — the gray secondary pill used for tertiary actions inside cards (e.g., "Learn more" / "Use Reserve").
- Background `{colors.canvas-soft}` (`#efefef`), text `{colors.ink}`, label in `{typography.button-md}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.pill}`.

**`button-floating`** — the white pill with a subtle drop-shadow that floats over a dark or photographic surface.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md}`, shape `{rounded.pill}`. Carries a Level 3 pill-float shadow.

**`button-large-rounded`** — the bigger black call-to-action used inside the ride-request flow ("Yes, help me").
- Background `{colors.primary}`, text `{colors.on-primary}`, label in `{typography.button-large}`, padding `{spacing.lg} {spacing.xl}`, shape `{rounded.xl}` 16 px (not pill — the only black CTA that breaks the pill rule, used in the larger form context).

**`button-tab-translucent`** — the tab-toggle on the hero ride-request form (Ride / Drive).
- Background `{colors.canvas}`, text `{colors.ink}`, label in `{typography.body-md-strong}`, shape `{rounded.pill-tab}` 36 px (off-shape, deliberately tighter than the canonical 999 px pill).

### Cards & Containers

**`card-content`** — the canonical content card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.xl}` 16 px. No shadow on the default state.

**`card-elevated`** — the content card with Level 1 subtle drop.
- Background `{colors.canvas}`, text `{colors.ink}`, same padding + shape as `card-content`. Shadow at Level 1.

**`card-soft-tinted`** — the gray-tinted card used as a sub-region inside the page (e.g., "Plan for later" callout).
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.xl}`.

**`promo-card-illustrated`** — the 2-column promo card with illustration on one side and copy on the other.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.xl}`. Headline in `{typography.display-md}` or larger.

**`promo-card-on-dark`** — the polarity-flipped promo card in black.
- Background `{colors.ink}`, text `{colors.on-dark}`, padding `{spacing.2xl}`, shape `{rounded.xl}`. Used for the "Drive with Uber" mid-page band.

**`request-form-card`** — the hero ride-request form chrome.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.xl}`. Carries Level 2 card drop shadow.

**`request-form-input-row`** — the per-field row inside the request-form card.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.md}` 8 px. Hosts an icon + label + value.

**`showcase-image-card`** — the giant "GO•GET 2026" annual showcase card.
- Background `{colors.ink}`, text `{colors.on-dark}` overlay, padding `{spacing.3xl}`, shape `{rounded.xl}`. Display-xxl headline overlays the bottom of the image.

### Inputs & Forms

**`text-input`** — the canonical text input.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, body in `{typography.body-md}`, padding `{spacing.lg}`, shape `{rounded.md}` 8 px.

**`text-input-on-soft`** — the nested input on a white card (slightly lighter fill).
- Background `{colors.canvas-softer}`, otherwise identical to `text-input`.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas}` on light pages, switches to `{colors.ink}` on the rare dark page (e.g., Uber Eats hero). Padding `{spacing.lg} {spacing.3xl}`.

**`nav-link`** — the link row inside `nav-bar`.
- Text `{colors.ink}`, set in `{typography.body-md-strong}` 500 weight.

**`footer`** — the deep-black footer band.
- Background `{colors.primary}` (the brand''s only true black surface), text `{colors.on-dark}`, padding `{spacing.3xl} {spacing.3xl}`. Body in `{typography.body-sm}`; column eyebrows in `{typography.body-md-strong}`.

### Signature Components

**`hero-band-light`** — the white hero with the ride-request card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.3xl}`. Headline in `{typography.display-xxl}` (52 px / 700) on the left; `request-form-card` on the right.

**`hero-band-dark`** — the rare black hero (used on Uber Eats and Drive landing).
- Background `{colors.ink}`, text `{colors.on-dark}`, padding `{spacing.3xl} {spacing.3xl}`. Same display-xxl headline scale; CTA inverts to `button-secondary` white pill.

**`category-button`** — the horizontal-scroll category row ("Reserve / Rentals / Teens / Group rides").
- Background `{colors.canvas-soft}`, text `{colors.ink}`, label in `{typography.body-sm-strong}`, padding `{spacing.sm} {spacing.lg}`, shape `{rounded.pill}`. An icon precedes the label.

**`faq-row`** — the FAQ accordion item.
- Background `{colors.canvas}`, text `{colors.ink}`, question in `{typography.body-md-strong}`, padding `{spacing.lg}` 0. No card chrome — hairline dividers between rows.

**`app-download-pill`** — the "Download the Rider app" / "Download the Driver app" pill.
- Background `{colors.ink}`, text `{colors.on-dark}`, label in `{typography.body-md-strong}`, padding `{spacing.md} {spacing.xl}`, shape `{rounded.pill}`.

**`icon-button-circular`** — the round icon container used in the nav and inside the ride-request card.
- Background `{colors.canvas-soft}`, dark icon, shape `{rounded.full}`. No label.

### Links

**`link-blue`** — the system-default browser-blue link inside legal / footer fine print.
- Text `{colors.link}` (`#0000ee`), body in `{typography.body-md}`.

**`link-on-dark`** — the white link inside dark bands.
- Text `{colors.on-dark}`, body in `{typography.body-md}`.

**`link-mute`** — the muted gray link inside footer columns.
- Text `{colors.hairline-mid}`, body in `{typography.body-md}`.

**`link-mute-soft`** — the lightest gray link, used for low-priority secondary text on dark surfaces.
- Text `{colors.mute}`, body in `{typography.body-md}`.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`', '{"sourcePath":"docs/design-md/uber/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (`#000000`) for every primary CTA pill. One black pill per visible viewport is the brand''s whole conversion story.
- Use `{rounded.pill}` 999 px on every interactive element (buttons, chips, app pills). The pill IS the brand''s geometric signature.
- Render cards in `{rounded.xl}` 16 px — promo cards, content cards, the ride-request form card, the annual-showcase card all share this radius.
- Set every headline in `{typography.display-*}` weight 700 in sentence-case. The display face never carries body copy.
- Use polarity-flipped black promo bands mid-page to break up white-on-white rhythm. The polarity shift IS the depth cue.
- Anchor every promo card with a 4:3 editorial illustration; never use generic stock imagery.

### Don''t
- Don''t introduce a second brand accent colour (orange, blue, green). The brand''s entire UI is black-and-white plus grayscale; new accents flatten the system.
- Don''t render the primary CTA as a `{rounded.xl}` rectangle except inside the larger ride-request flow (where `button-large-rounded` is the documented exception).
- Don''t use all-caps display headlines. Sentence-case is the voice; uppercase is restricted to rare eyebrow tags.
- Don''t drop a soft drop-shadow on every card. The brand uses Level 0 flat as the default; shadow is reserved for the floating pill and the ride-request form.
- Don''t reduce the brand to its illustration system alone. The pill geometry + black/white duet carries the brand even without illustrations.
- Don''t tighten or loosen letter-spacing on the display face. The brand never letter-spaces; default tracking is part of the voice.
- Don''t use `{rounded.full}` 9999 px for square cards — the pill 999 px and full 9999 px effects are identical for interactive elements, but cards stay at `{rounded.xl}` 16 px.', '{"sourcePath":"docs/design-md/uber/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/uber/DESIGN.md'), 'color', 'color_1', '#000000', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/uber/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/uber/DESIGN.md'), 'color', 'color_3', '#5e5e5e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/uber/DESIGN.md'), 'color', 'color_4', '#afafaf', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/uber/DESIGN.md'), 'color', 'color_5', '#4b4b4b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/uber/DESIGN.md'), 'color', 'color_6', '#efefef', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/uber/DESIGN.md'), 'color', 'color_7', '#f3f3f3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/uber/DESIGN.md'), 'color', 'color_8', '#e2e2e2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/uber/DESIGN.md'), 'color', 'color_9', '#0000ee', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/uber/DESIGN.md'), 'color', 'color_10', '#282828', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/uber/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/uber/DESIGN.md';


-- Vercel
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Vercel', 'vercel', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/vercel/DESIGN.md', null, 'seeded', '---
version: alpha
name: Vercel-Inspired-design-analysis
description: An inspired interpretation of Vercel''s design language — a developer-platform brand whose surface is a stark black-and-ink duet on near-white canvas, broken at hero scale by a multi-color mesh gradient (cyan / blue / magenta / amber) that acts as the entire decorative system, paired with a custom geometric sans for headlines and a monospaced caption face for technical labels.

colors:
  primary: "#171717"
  on-primary: "#ffffff"
  ink: "#171717"
  body: "#4d4d4d"
  mute: "#888888"
  hairline: "#ebebeb"
  hairline-strong: "#a1a1a1"
  canvas: "#ffffff"
  canvas-soft: "#fafafa"
  canvas-soft-2: "#f5f5f5"
  link: "#0070f3"
  link-deep: "#0761d1"
  link-bg-soft: "#d3e5ff"
  success: "#0070f3"
  error: "#ee0000"
  error-soft: "#f7d4d6"
  error-deep: "#c50000"
  warning: "#f5a623"
  warning-soft: "#ffefcf"
  warning-deep: "#ab570a"
  violet: "#7928ca"
  violet-soft: "#d8ccf1"
  violet-deep: "#4c2889"
  cyan: "#50e3c2"
  cyan-soft: "#aaffec"
  cyan-deep: "#29bc9b"
  highlight-pink: "#ff0080"
  highlight-magenta: "#eb367f"
  gradient-develop-start: "#007cf0"
  gradient-develop-end: "#00dfd8"
  gradient-preview-start: "#7928ca"
  gradient-preview-end: "#ff0080"
  gradient-ship-start: "#ff4d4d"
  gradient-ship-end: "#f9cb28"
  selection-bg: "#171717"
  selection-fg: "#f2f2f2"

typography:
  display-xl:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 48px
    fontWeight: 600
    lineHeight: 48px
    letterSpacing: -2.4px
  display-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 32px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -1.28px
  display-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.96px
  display-sm:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.6px
  body-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
    letterSpacing: 0px
  body-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
  body-sm:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: -0.28px
  body-sm-strong:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: -0.28px
  caption:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  caption-mono:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  code:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
  button-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  button-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill-sm: 64px
  pill: 100px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 40px
  3xl: 48px
  4xl: 64px
  5xl: 96px
  6xl: 128px
  section: 192px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    height: 64px
    padding: "{spacing.sm} {spacing.lg}"
  nav-link:
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.sm}"
  nav-cta-signup:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  nav-cta-login:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  nav-cta-ask-ai:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.sm}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.sm}"
  button-primary-sm:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.xs}"
  button-secondary-sm:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.xs}"
  tab-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill-sm}"
    padding: "0px {spacing.md}"
  icon-button-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.full}"
  card-marketing:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  card-marketing-large:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  card-soft:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  template-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  code-editor-mockup:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  form-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 40px
  form-input-sm:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 32px
  form-input-lg:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 48px
  badge-secondary:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "0px {spacing.xs}"
  pricing-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  pricing-card-featured:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  logo-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.lg} {spacing.xl}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.4xl} {spacing.lg}"
  feature-mesh-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  showcase-band-light:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  showcase-band-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.4xl} {spacing.lg}"
  link-inline:
    textColor: "{colors.link}"
    typography: "{typography.body-md}"
  banner-marketing:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.sm}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default tier card. Mirrors pricing-card chrome on canvas-soft surface with a hairline border."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-pricing-tier-featured:
    description: "Featured tier — polarity-flipped to ink primary with white text and white CTA."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-product-selector:
    description: "What''s Included summary card — repurposed for the brand''s GPU / inference / Pro feature tiers."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  ex-cart-drawer:
    description: "Subscription summary — line items per add-on (NOT a literal e-commerce cart)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
    item-divider: "{colors.hairline}"
  ex-app-shell-row:
    description: "Sidebar nav row. Active state uses brand primary as a left-edge indicator bar."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
  ex-data-table-cell:
    description: "Mirrors the brand''s table chrome. Header uses caption-mono uppercase mono; body uses body-sm."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption-mono}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.xs} {spacing.sm}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Mirrors card-marketing-large chrome with form-input primitives inside."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as card-marketing-large with Level 5 modal shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: "Empty-state illustration frame. Generous padding on canvas-soft."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — flat-cornered card-marketing chrome with Level 4 shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    typography: "{typography.body-sm}"

---


## Overview

Vercel is a developer-platform brand — the page is a deployment dashboard''s marketing surface, written for engineers who already know the syntax. It earns that posture with one of the cleanest stark systems on the web: near-white `{colors.canvas-soft}` body background, ink-near-black `{colors.ink}` text, a 200-step gray scale that gives every divider, border, and disabled state its own deliberate step. The only place the brand introduces colour at marketing scale is the multi-stop mesh gradient (`{colors.gradient-develop-start}` → `{colors.gradient-preview-end}` → `{colors.gradient-ship-start}` → cyan / magenta / amber) that floats in atmospheric backdrops, never miniaturised to a swatch. That gradient is the entire decoration system.

Type is the second decisive voice. The brand''s own custom geometric sans (Geist) carries display, body, button — everything narrative — at weight 600 for display, 500 for buttons, 400 for body. A matching monospaced face (Geist Mono) carries technical labels: terminal mockups, code blocks, sometimes filename captions. Headlines are sentence-case with aggressive negative letter-spacing (`-2.4px` at 48 px hero) — the brand never letter-spaces positively, never goes uppercase outside of mono labels.

Surfaces use a four-step ladder: `{colors.canvas}` (pure white for cards), `{colors.canvas-soft}` 98% (the page body), `{colors.canvas-soft-2}` 95% (occasional inset region), `{colors.primary}` (the deep ink-near-black used as the polarity-flipped band when a section needs the dark mode treatment). Shadows are exceptionally subtle — every elevated card carries a stacked shadow built from `0px 1px 1px #00000005` + `0px 2px 2px #0000000a` + an inset border. Cards never float on heavy drop-shadow; they sit on the page held by hairline + soft glow.

**Key Characteristics:**
- A single black-ink primary CTA `{colors.primary}` carries every conversion target, paired with white-on-white `button-secondary` for the secondary action. The brand uses 100 px pill shape for marketing CTAs and a tight 6 px square shape for in-app nav buttons.
- A multi-stop mesh gradient (cyan-blue-magenta-amber) is the only decorative chrome — used at hero scale and inside feature-band atmospheric backdrops. It is the brand.
- Every section eyebrow and small label uses the monospace face `{typography.caption-mono}` or `{typography.code}`; everything else is in the geometric sans.
- Subtle stacked-shadow elevation — three offsets layered with 4-12 % black opacity — never a single heavy drop-shadow.
- A complete 100–1000 gray + blue + red + amber + green + teal + purple + pink colour scale exists as a system token set, but the marketing surface uses only the `100`, `1000`, and `700`-level tones; the rest stay in the design-system tokens for in-product surfaces.
- An "Active CPU" pricing rhythm: `pricing-card` lays out 3-up on the pricing page with `pricing-card-featured` (Pro tier) polarity-flipped to `{colors.primary}` against white-card siblings.

## Colors

### Brand & Accent
- **Ink** (`{colors.primary}` — `#171717`): The single primary CTA color. Black-near-pure ink that carries every Sign Up pill, every footer CTA, the dark-band polarity-flip. Used as text color throughout the page on light surfaces. (Resolved from `--ds-gray-1000`.)
- **Cyan** (`{colors.cyan}` — `#50e3c2`): A signature mint-cyan used in the brand gradient and inside Geist-system spotlight tokens. Visible inside the hero gradient stops.
- **Highlight Pink** (`{colors.highlight-pink}` — `#ff0080`): The brand''s highlight magenta, used as the high-saturation stop in the preview-gradient pair.
- **Violet** (`{colors.violet}` — `#7928ca`): The deep purple used as the start of the preview-gradient and inside developer-console highlights.
- **Link Blue** (`{colors.link}` — `#0070f3`): The brand''s primary link color and the legacy `--geist-success` semantic.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The pure-white card / dialog / modal surface.
- **Canvas Soft** (`{colors.canvas-soft}` — `#fafafa`): The default page background — 98 % white. Almost every section sits on this tone.
- **Canvas Soft 2** (`{colors.canvas-soft-2}` — `#f5f5f5`): A slightly deeper inset surface for "code editor inner background", template-card hover states, and dropdown menus.
- **Hairline** (`{colors.hairline}` — `#ebebeb`): 1 px dividers — table rows, card borders, input borders.
- **Hairline Strong** (`{colors.hairline-strong}` — `#a1a1a1`): The 500-level gray, used as the slightly-stronger divider on light bands and as the deemphasised text color.

### Text
- **Ink** (`{colors.ink}` — `#171717`): Every heading and body paragraph on light surfaces.
- **Body** (`{colors.body}` — `#4d4d4d`): Secondary text — sub-headings, body captions, nav-link inactive text, footer column body.
- **Mute** (`{colors.mute}` — `#888888`): Lowest-priority text — placeholder text, fine print, low-key labels.
- **On Primary** (`{colors.on-primary}` — `#ffffff`): All text on `{colors.primary}` surfaces.

### Semantic
- **Success / Link** (`{colors.success}` — `#0070f3`): The brand''s legacy success indicator doubles as the primary link color. Visible underline-on-hover for inline body links.
- **Link Deep** (`{colors.link-deep}` — `#0761d1`): The pressed / visited tone for inline links.
- **Link Bg Soft** (`{colors.link-bg-soft}` — `#d3e5ff`): Soft pastel blue fill for "what''s new" pill banners and informational badges.
- **Error** (`{colors.error}` — `#ee0000`): Validation red for destructive actions and form errors.
- **Error Soft** (`{colors.error-soft}` — `#f7d4d6`): Soft pastel red for destructive-state backgrounds.
- **Error Deep** (`{colors.error-deep}` — `#c50000`): Pressed / deep destructive state.
- **Warning** (`{colors.warning}` — `#f5a623`): Caution / pending status indicator.
- **Warning Soft** (`{colors.warning-soft}` — `#ffefcf`) / **Warning Deep** (`{colors.warning-deep}` — `#ab570a`): Background + pressed variants.

### Brand Gradient
The brand''s signature decoration is a three-pair gradient stack:
- **Develop** (`{colors.gradient-develop-start}` `#007cf0` → `{colors.gradient-develop-end}` `#00dfd8`) — the blue-to-teal pair used to mark the "deploy" / "develop" rhythm.
- **Preview** (`{colors.gradient-preview-start}` `#7928ca` → `{colors.gradient-preview-end}` `#ff0080`) — the violet-to-pink pair used for "preview" surfaces.
- **Ship** (`{colors.gradient-ship-start}` `#ff4d4d` → `{colors.gradient-ship-end}` `#f9cb28`) — the coral-to-amber pair used for "ship" surfaces.

The three pairs collapse into a single multi-color mesh gradient when used as the hero atmospheric backdrop. Treat the gradient as one unified object — do not crop down to a single colour, do not reorder the stops, and do not miniaturise. Used at hero scale only.

## Typography

### Font Family
Two custom faces carry the entire system:

1. **A custom geometric sans** (extracted as `Geist`) for every display, body, button, link, and label. Weights 400 / 500 / 600 are the working set; the face never appears in 700 or heavier. Display sizes are tracked aggressively negative (`-2.4 px` at 48 px hero, `-1.28 px` at 32 px section); body stays at neutral or slightly-negative tracking.
2. **A custom monospaced face** (extracted as `Geist Mono`) for terminal mockups, code blocks, and small mono-caption labels — anything that wants to signal "technical." Weight 400 only at 12 – 13 px. Tracking neutral.

A condensed display sans (`Space Grotesk`) is loaded as a third face for occasional editorial moments but does not render as the primary face anywhere in the captured surfaces.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 48px | 600 | 48px | -2.4px | Hero headline ("Build and deploy on the AI Cloud."). |
| `{typography.display-lg}` | 32px | 600 | 40px | -1.28px | Section headlines ("Your frontend, delivered.", "A compute model for all workloads."). |
| `{typography.display-md}` | 24px | 600 | 32px | -0.96px | Card-cluster headlines, pricing-tier names. |
| `{typography.display-sm}` | 20px | 600 | 28px | -0.6px | Inline display micro-headings. |
| `{typography.body-lg}` | 18px | 400 | 28px | 0 | Lead paragraphs under section headlines. |
| `{typography.body-md}` | 16px | 400 | 24px | 0 | Default body paragraph. |
| `{typography.body-md-strong}` | 16px | 500 | 24px | 0 | Bolded inline body. |
| `{typography.body-sm}` | 14px | 400 | 20px | -0.28px | Secondary body, nav-link text, button-md labels. |
| `{typography.body-sm-strong}` | 14px | 500 | 20px | -0.28px | Nav CTA labels, table-row emphasis. |
| `{typography.caption}` | 12px | 400 | 16px | 0 | Footer secondary lines, badge labels. |
| `{typography.caption-mono}` | 12px | 400 | 16px | 0 | Section eyebrows and label captions that want a technical voice. |
| `{typography.code}` | 13px | 400 | 20px | 0 | Inline code, terminal mockups, command snippets. |
| `{typography.button-md}` | 14px | 500 | 20px | 0 | Small / nav-scale button labels. |
| `{typography.button-lg}` | 16px | 500 | 24px | 0 | Marketing-scale pill button labels. |

### Principles
- **Negative tracking is part of the voice.** Display sizes use aggressive `-2.4` to `-0.6` px tracking. Reverting to default tracking breaks the brand.
- **Sentence-case headlines, period-terminated.** Headlines like "Build and deploy on the AI Cloud." end with a deliberate period — that punctuation is part of the brand''s voice.
- **Mono for the technical layer only.** Section eyebrows, code blocks, terminal mockups. Body paragraphs never set in mono.
- **Weight 600 is the display ceiling.** The geometric sans never appears at 700 / 800. The brand reads as a calmer system because of this.

### Note on Font Substitutes
The two primary faces are proprietary (custom-cut for the brand). Open-source substitutes:
- **Geometric sans** — *Inter* (400 / 500 / 600) is the closest stylistic match; `font-feature-settings: "ss01", "ss02"` enables the geometric alternates. *Satoshi* is a passable second choice.
- **Monospace** — *JetBrains Mono* (400) at 12 – 13 px matches the technical voice. *IBM Plex Mono* is the second-best option.

## Layout

### Spacing System
- **Base unit**: 4 px. The brand''s `--geist-space` token is exactly 4 px and every captured value is a multiple of 4.
- **Tokens**: `{spacing.xxs}` 4 px · `{spacing.xs}` 8 px · `{spacing.sm}` 12 px · `{spacing.md}` 16 px · `{spacing.lg}` 24 px · `{spacing.xl}` 32 px · `{spacing.2xl}` 40 px · `{spacing.3xl}` 48 px · `{spacing.4xl}` 64 px · `{spacing.5xl}` 96 px · `{spacing.6xl}` 128 px · `{spacing.section}` 192 px.
- **Section padding**: marketing bands use `{spacing.4xl}` to `{spacing.5xl}` top/bottom. Hero bands stretch to `{spacing.section}` to give the mesh gradient room to breathe.
- **Card interior padding**: marketing cards sit at `{spacing.lg}` to `{spacing.xl}`; template-grid cards stay tighter at `{spacing.md}` because they sit in a denser grid.
- **Inline gap**: button rows, nav rows, and chip rows use `{spacing.sm}` to `{spacing.md}` between siblings. The brand''s `--geist-gap` is exactly 24 px.

### Grid & Container
- **Max width**: ~1400 px (`--ds-page-width`); the legacy `--geist-page-width` is 1200 px and still appears on some marketing surfaces. Content centres with horizontal gutters of `{spacing.lg}` 24 px on desktop, `{spacing.md}` 16 px on mobile.
- **Column patterns**:
  - Three-feature row: 3-up at desktop, 1-up at mobile (rows like "Web Apps / Composable Commerce / Multi-tenant Platforms").
  - Tab pill row: 5-up centred row of `tab-ghost` pills.
  - Template-grid cluster: 5-up at desktop, scaling to 1-up at mobile.
  - Pricing tier grid: 3-up at desktop with the middle tier polarity-flipped.
  - Logo strip: ~5 logos wide, single row.

### Whitespace Philosophy
The mesh gradient does most of the heavy decorative lifting; whitespace separates the bands. Section spacing is generous — `{spacing.4xl}` to `{spacing.5xl}` between bands lets the gradient breathe. Inside a card, the headline/paragraph stack is tight (`{spacing.xs}` 8 px gap), then a wider gap before the CTA cluster. The page reads as engineered — large gaps + tight interior, never the other way around.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 600px | Hero stacks; nav collapses to hamburger; 3-up feature grids drop to 1-up; tab pill row enables horizontal scroll. |
| Tablet | 600–959px | 3-up grids drop to 2-up; nav still horizontal. |
| Desktop | 960–1199px | Full 3-up grids; pricing 3-up. |
| Wide | 1200–1399px | Container caps at 1400 px content width. |
| Ultra-wide | ≥ 1400px | Content stays centred at 1400 px; bands stretch edge-to-edge in colour but content holds the max-width. |

#### Touch Targets
The `button-primary` pill renders at ~32 px tall in nav and ~48 px tall in marketing contexts. Marketing CTAs comfortably meet WCAG AAA at all breakpoints; nav buttons inflate touch area through `{spacing.xs}` padding on mobile to meet the 44 × 44 px floor.

#### Collapsing Strategy
- **Nav**: full link row + Ask AI / Log In / Sign Up pills at desktop. Collapses to logo + hamburger at mobile with the menu opening as a full-overlay.
- **Hero**: mesh gradient stays centred; headline + body stack vertically at all breakpoints (the brand doesn''t use a split-hero pattern).
- **Three-feature row**: 3-up → 2-up → 1-up at the breakpoints above; cards keep their `{rounded.md}` 8 px shape across all viewports.
- **Pricing card grid**: 3-up at desktop, vertical stack at mobile with `pricing-card-featured` always sitting in the middle.
- **Template grid**: 5-up → 3-up → 2-up → 1-up. Each `template-card` keeps its 16:9 aspect on the image.

#### Image Behavior
- **Mesh gradient**: rendered as inline SVG or canvas-painted gradient; scales fluidly with the hero container; never crops, never tiles.
- **Customer logos**: rendered as monochrome SVGs in the logo strip; consistent 24 px height.
- **Code editor mockup**: dark `{colors.primary}` rectangle with mono text rendered inside; treated as an image at the layout level.
- **Template thumbnails**: 16:9 landscape inside `{rounded.md}` card chrome; lazy-loaded; consistent grayscale palette in the placeholder state.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Full-bleed hero bands and the polarity-flipped dark sections. |
| Level 1 — Inset Hairline | `0 0 0 1px #00000014` inset 1 px border. | Default card chrome — the brand''s universal "you can see this card" cue. |
| Level 2 — Subtle Drop | `0px 1px 1px #00000005, 0px 2px 2px #0000000a` plus inset hairline. | Slightly elevated cards (template-grid, marketing-card). |
| Level 3 — Soft Stack | `0px 2px 2px #0000000a, 0px 8px 8px -8px #0000000a` plus inset hairline. | The "medium" elevation — feature-grid cards. |
| Level 4 — Float Stack | `0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a` plus inset hairline. | "Large" elevation — pricing cards, callout panels. |
| Level 5 — Modal | `0px 1px 1px #00000005, 0px 8px 16px -4px #0000000a, 0px 24px 32px -8px #0000000f` plus inset hairline. | Modal / dialog surfaces and dropdown menus. |

The brand uses STACKED shadows — multiple small offsets layered to fake natural light — never a single 8-px-blur generic drop. Inset hairline rings are always added so the card edge stays crisp.

### Decorative Depth
- **Mesh gradient as atmospheric depth**: the hero''s multi-stop gradient is the brand''s only "atmospheric" effect — applied as a flat 2-D backdrop rather than a 3-D illustration.
- **Polarity-flipped dark band as section-depth**: switching the surface from `{colors.canvas-soft}` to `{colors.primary}` (the deep ink) is the brand''s chief depth cue between bands.
- **Inset-shadow + drop-shadow combo**: the cards'' combination of an inset 1 px ring and a multi-stop drop produces a "card sits on the page" effect without ever feeling material-heavy.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed hero / footer bands. |
| `{rounded.xs}` | 4px | Tightest inline pill — the `nav-cta-signup` 6-px-radius button (mapped to `xs/sm`). |
| `{rounded.sm}` | 6px | The brand''s `--geist-radius` token — base UI radius for in-app buttons, form inputs, dropdown menus. |
| `{rounded.md}` | 8px | The brand''s `--geist-marketing-radius` token — feature cards, template cards. |
| `{rounded.lg}` | 12px | Slightly larger card chrome (pricing-card variants). |
| `{rounded.xl}` | 16px | Largest card chrome — when a card hosts a hero image cap. |
| `{rounded.pill-sm}` | 64px | Tab-ghost pills inside the "AI Apps / Web Apps / Ecommerce / Marketing / Platforms" row. |
| `{rounded.pill}` | 100px | The marketing CTA pill — `button-primary`, `button-secondary`, "Start Deploying" pill. |
| `{rounded.full}` | 9999px | Icon-button circular containers, nav-link ghost pills. |

### Photography Geometry
- **Mesh gradient**: full-bleed 2-D atmospheric backdrop, never cropped to a frame; treated as the page''s wallpaper.
- **Customer logos**: monochrome SVG, consistent 24 px height in a flex row.
- **Code editor mockup**: 16:10 dark rectangle, `{rounded.md}` corners.
- **Template thumbnails**: 16:9 landscape inside `{rounded.md}` chrome.
- **Showcase imagery**: 2:1 or 16:9 inside `{rounded.lg}` to `{rounded.xl}` chrome with a stacked shadow.

## Components

### Buttons

**`button-primary`** — the canonical 100-px-radius black pill, marketing scale.
- Background `{colors.primary}`, text `{colors.on-primary}`, label set in `{typography.button-lg}`, padding `0px {spacing.sm}` 12 px, shape `{rounded.pill}` 100 px. Renders ~48 px tall when paired with the marketing flex layout.

**`button-secondary`** — the white pill paired with the black primary inside marketing bands.
- Background `{colors.canvas}`, text `{colors.ink}`, same typography + padding as `button-primary`, shape `{rounded.pill}`.

**`button-primary-sm`** — the smaller-scale primary pill used inside nav and pricing-card CTAs.
- Background `{colors.primary}`, text `{colors.on-primary}`, label set in `{typography.button-md}` (14 px / 500), shape `{rounded.pill}`.

**`button-secondary-sm`** — the smaller-scale white pill paired with `button-primary-sm`.
- Background `{colors.canvas}`, text `{colors.ink}`, same typography + shape as `button-primary-sm`.

**`tab-ghost`** — the centred-row tab pill ("AI Apps / Web Apps / Ecommerce / Marketing / Platforms").
- Background `{colors.canvas}`, text `{colors.ink}`, label set in `{typography.body-sm}`, padding `0px {spacing.md}`, shape `{rounded.pill-sm}` 64 px.

**`icon-button-circular`** — the circular icon container (often a "?" or arrow inside).
- Background `{colors.canvas}`, dark icon, 1 px solid hairline border, shape `{rounded.full}`.

**Nav CTAs:**

**`nav-cta-signup`** — the small black "Sign Up" button in the nav row.
- Background `{colors.primary}`, text `{colors.on-primary}`, label `{typography.body-sm-strong}`, padding `0px {spacing.xs}`, height 28 px, shape `{rounded.sm}` 6 px (the brand''s `--geist-radius`).

**`nav-cta-login`** — the white "Log In" button in the nav.
- Background `{colors.canvas}`, text `{colors.ink}`, same typography / height / shape as `nav-cta-signup`.

**`nav-cta-ask-ai`** — the small "Ask AI" button with a faint border.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border (extracted as `0px solid rgb(235, 235, 235)`), same typography / height / shape.

### Cards & Containers

**`card-marketing`** — the canonical marketing feature card (3-up section cards).
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.lg}` 24 px, shape `{rounded.md}` 8 px (the `--geist-marketing-radius`). Carries Level 3 soft-stack shadow.

**`card-marketing-large`** — the larger marketing card used for "compute model" / "AI Gateway" callouts.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.lg}` 12 px. Carries Level 4 float-stack shadow.

**`card-soft`** — the soft-tinted card used inside cluster groups (lighter than canvas-soft).
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.md}`.

**`template-card`** — the deploy-template card in the "Deploy your first app" grid.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md}` 16 px, shape `{rounded.md}` 8 px. Hosts a 16:9 thumbnail at the top.

**`code-editor-mockup`** — the dark code-preview surface inside marketing bands.
- Background `{colors.primary}`, text `{colors.on-primary}`, body in `{typography.code}` (13 px / Geist Mono), padding `{spacing.lg}` 24 px, shape `{rounded.md}` 8 px.

**`pricing-card`** — the default pricing-tier card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.xl}` 32 px, shape `{rounded.lg}` 12 px. Inside: tier name in `{typography.display-md}`, price in `{typography.display-xl}`, feature list in `{typography.body-md}` rows, CTA at the bottom.

**`pricing-card-featured`** — the polarity-flipped "Pro" tier card.
- Background `{colors.primary}`, text `{colors.on-primary}`, same shape + padding as `pricing-card`. CTA inverts to `button-secondary-sm` (white pill on black card).

### Inputs & Forms

**`form-input`** — the canonical text input.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, body in `{typography.body-sm}` (14 px), padding `0px {spacing.sm}`, height 40 px (the brand''s `--geist-form-height`), shape `{rounded.sm}` 6 px.

**`form-input-sm`** — small-height variant (32 px tall) for tight forms.
- Same as `form-input` but height 32 px (the `--geist-form-small-height`).

**`form-input-lg`** — large-height variant (48 px tall) for hero CTAs.
- Same as `form-input` but height 48 px (the `--geist-form-large-height`); body in `{typography.body-md}` 16 px.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas}`, text `{colors.ink}`, height 64 px (the brand''s `--header-height`), padding `{spacing.sm} {spacing.lg}`. Layout: logo left, link row centre, "Ask AI / Log In / Sign Up" cluster right.

**`nav-link`** — the centred link row inside `nav-bar`.
- Text `{colors.body}`, set in `{typography.body-sm}`, padding `{spacing.xs} {spacing.sm}`, shape `{rounded.full}` (ghost pill — visible only on hover or active, but the radius is documented).

**`footer`** — the bottom 4-column nav.
- Background `{colors.canvas}`, text `{colors.body}`, padding `{spacing.4xl} {spacing.lg}`. Eyebrow column labels in `{typography.caption-mono}` (uppercase mono effect); link rows in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — the white hero with the mesh gradient backdrop.
- Background `{colors.canvas}` (or `{colors.canvas-soft}` on some surfaces), text `{colors.ink}`, padding `{spacing.4xl} {spacing.lg}`. Inside: a small mono badge above the headline, the headline in `{typography.display-xl}` (sentence-case, period-terminated), a body lead in `{typography.body-lg}`, then a CTA row with `button-primary` + `button-secondary`. The mesh gradient sits behind, scaled to occupy roughly the top half of the band.

**`feature-mesh-band`** — the secondary section that hosts a mesh-gradient atmospheric backdrop with feature copy on top.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.lg}`. Section headline in `{typography.display-lg}`; supporting body in `{typography.body-md}`.

**`showcase-band-light`** — a soft-canvas section ("Deploy your first app in seconds").
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.lg}`.

**`showcase-band-dark`** — the polarity-flipped dark band ("A compute model for all workloads").
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.5xl} {spacing.lg}`. Section headline in `{typography.display-lg}` (white on black). Often contains a `code-editor-mockup` flush with the band.

**`logo-strip`** — the customer-logo wrapping row near the top of the page.
- Background `{colors.canvas}`, text `{colors.body}`, padding `{spacing.lg} {spacing.xl}`. Logos rendered as monochrome SVGs at consistent height.

**`badge-secondary`** — the small inline metadata pill ("New", "Beta", "Live").
- Background `{colors.canvas-soft}`, text `{colors.body}`, body in `{typography.caption}`, padding `0px {spacing.xs}`, shape `{rounded.full}`.

**`banner-marketing`** — the "Introducing X" announcement pill at the top of pages.
- Background `{colors.canvas-soft}`, text `{colors.body}`, body in `{typography.body-sm}`, padding `{spacing.xs} {spacing.sm}`, shape `{rounded.full}`.

**`link-inline`** — body-copy inline links.
- Text `{colors.link}` (`#0070f3`), body in `{typography.body-md}`, underlined.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (`#171717`) for primary CTAs across the page. Black ink IS the conversion target.
- Use `{rounded.pill}` 100 px for every marketing-scale CTA and `{rounded.sm}` 6 px for nav-scale buttons. The two pill scales coexist deliberately.
- Set every headline in `{typography.display-*}` weight 600, sentence-case, often period-terminated. Aggressive negative tracking is part of the voice.
- Use the brand mesh gradient as atmospheric decoration at hero scale only — never miniaturise it to an icon, never reduce to a single colour.
- Layer stacked shadows (multiple small offsets with inset hairline) rather than single heavy drops. The brand''s elevation is calmer than Material.
- Cycle page surfaces in `{colors.canvas-soft}` → `{colors.canvas}` → `{colors.primary}` polarity-flipped bands; the dark band IS the depth cue.
- Set every code block and technical eyebrow in `{typography.code}` / `{typography.caption-mono}`. Mono is the voice of the platform.

### Don''t
- Don''t introduce a sixth accent colour. The brand operates with ink + gray + the four-pair gradient palette; new accents flatten the voice.
- Don''t render headlines in all-caps. Sentence-case + negative tracking is non-negotiable.
- Don''t drop a single heavy drop-shadow on cards. The brand''s elevation is built from stacked small offsets + inset hairline rings.
- Don''t render the brand gradient at icon scale or in a single-colour reduced form. The gradient lives at hero scale only.
- Don''t promote the geometric sans to weight 700. The brand''s display ceiling is 600.
- Don''t pair the marketing 100-px pill CTA shape with the 6-px nav radius on the same screen — pick a scale and stay there.
- Don''t set body paragraphs in the mono face. The mono is for code + technical labels only.
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

Vercel is a developer-platform brand — the page is a deployment dashboard''s marketing surface, written for engineers who already know the syntax. It earns that posture with one of the cleanest stark systems on the web: near-white `{colors.canvas-soft}` body background, ink-near-black `{colors.ink}` text, a 200-step gray scale that gives every divider, border, and disabled state its own deliberate step. The only place the brand introduces colour at marketing scale is the multi-stop mesh gradient (`{colors.gradient-develop-start}` → `{colors.gradient-preview-end}` → `{colors.gradient-ship-start}` → cyan / magenta / amber) that floats in atmospheric backdrops, never miniaturised to a swatch. That gradient is the entire decoration system.

Type is the second decisive voice. The brand''s own custom geometric sans (Geist) carries display, body, button — everything narrative — at weight 600 for display, 500 for buttons, 400 for body. A matching monospaced face (Geist Mono) carries technical labels: terminal mockups, code blocks, sometimes filename captions. Headlines are sentence-case with aggressive negative letter-spacing (`-2.4px` at 48 px hero) — the brand never letter-spaces positively, never goes uppercase outside of mono labels.

Surfaces use a four-step ladder: `{colors.canvas}` (pure white for cards), `{colors.canvas-soft}` 98% (the page body), `{colors.canvas-soft-2}` 95% (occasional inset region), `{colors.primary}` (the deep ink-near-black used as the polarity-flipped band when a section needs the dark mode treatment). Shadows are exceptionally subtle — every elevated card carries a stacked shadow built from `0px 1px 1px #00000005` + `0px 2px 2px #0000000a` + an inset border. Cards never float on heavy drop-shadow; they sit on the page held by hairline + soft glow.

**Key Characteristics:**
- A single black-ink primary CTA `{colors.primary}` carries every conversion target, paired with white-on-white `button-secondary` for the secondary action. The brand uses 100 px pill shape for marketing CTAs and a tight 6 px square shape for in-app nav buttons.
- A multi-stop mesh gradient (cyan-blue-magenta-amber) is the only decorative chrome — used at hero scale and inside feature-band atmospheric backdrops. It is the brand.
- Every section eyebrow and small label uses the monospace face `{typography.caption-mono}` or `{typography.code}`; everything else is in the geometric sans.
- Subtle stacked-shadow elevation — three offsets layered with 4-12 % black opacity — never a single heavy drop-shadow.
- A complete 100–1000 gray + blue + red + amber + green + teal + purple + pink colour scale exists as a system token set, but the marketing surface uses only the `100`, `1000`, and `700`-level tones; the rest stay in the design-system tokens for in-product surfaces.
- An "Active CPU" pricing rhythm: `pricing-card` lays out 3-up on the pricing page with `pricing-card-featured` (Pro tier) polarity-flipped to `{colors.primary}` against white-card siblings.', '{"sourcePath":"docs/design-md/vercel/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Ink** (`{colors.primary}` — `#171717`): The single primary CTA color. Black-near-pure ink that carries every Sign Up pill, every footer CTA, the dark-band polarity-flip. Used as text color throughout the page on light surfaces. (Resolved from `--ds-gray-1000`.)
- **Cyan** (`{colors.cyan}` — `#50e3c2`): A signature mint-cyan used in the brand gradient and inside Geist-system spotlight tokens. Visible inside the hero gradient stops.
- **Highlight Pink** (`{colors.highlight-pink}` — `#ff0080`): The brand''s highlight magenta, used as the high-saturation stop in the preview-gradient pair.
- **Violet** (`{colors.violet}` — `#7928ca`): The deep purple used as the start of the preview-gradient and inside developer-console highlights.
- **Link Blue** (`{colors.link}` — `#0070f3`): The brand''s primary link color and the legacy `--geist-success` semantic.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The pure-white card / dialog / modal surface.
- **Canvas Soft** (`{colors.canvas-soft}` — `#fafafa`): The default page background — 98 % white. Almost every section sits on this tone.
- **Canvas Soft 2** (`{colors.canvas-soft-2}` — `#f5f5f5`): A slightly deeper inset surface for "code editor inner background", template-card hover states, and dropdown menus.
- **Hairline** (`{colors.hairline}` — `#ebebeb`): 1 px dividers — table rows, card borders, input borders.
- **Hairline Strong** (`{colors.hairline-strong}` — `#a1a1a1`): The 500-level gray, used as the slightly-stronger divider on light bands and as the deemphasised text color.

### Text
- **Ink** (`{colors.ink}` — `#171717`): Every heading and body paragraph on light surfaces.
- **Body** (`{colors.body}` — `#4d4d4d`): Secondary text — sub-headings, body captions, nav-link inactive text, footer column body.
- **Mute** (`{colors.mute}` — `#888888`): Lowest-priority text — placeholder text, fine print, low-key labels.
- **On Primary** (`{colors.on-primary}` — `#ffffff`): All text on `{colors.primary}` surfaces.

### Semantic
- **Success / Link** (`{colors.success}` — `#0070f3`): The brand''s legacy success indicator doubles as the primary link color. Visible underline-on-hover for inline body links.
- **Link Deep** (`{colors.link-deep}` — `#0761d1`): The pressed / visited tone for inline links.
- **Link Bg Soft** (`{colors.link-bg-soft}` — `#d3e5ff`): Soft pastel blue fill for "what''s new" pill banners and informational badges.
- **Error** (`{colors.error}` — `#ee0000`): Validation red for destructive actions and form errors.
- **Error Soft** (`{colors.error-soft}` — `#f7d4d6`): Soft pastel red for destructive-state backgrounds.
- **Error Deep** (`{colors.error-deep}` — `#c50000`): Pressed / deep destructive state.
- **Warning** (`{colors.warning}` — `#f5a623`): Caution / pending status indicator.
- **Warning Soft** (`{colors.warning-soft}` — `#ffefcf`) / **Warning Deep** (`{colors.warning-deep}` — `#ab570a`): Background + pressed variants.

### Brand Gradient
The brand''s signature decoration is a three-pair gradient stack:
- **Develop** (`{colors.gradient-develop-start}` `#007cf0` → `{colors.gradient-develop-end}` `#00dfd8`) — the blue-to-teal pair used to mark the "deploy" / "develop" rhythm.
- **Preview** (`{colors.gradient-preview-start}` `#7928ca` → `{colors.gradient-preview-end}` `#ff0080`) — the violet-to-pink pair used for "preview" surfaces.
- **Ship** (`{colors.gradient-ship-start}` `#ff4d4d` → `{colors.gradient-ship-end}` `#f9cb28`) — the coral-to-amber pair used for "ship" surfaces.

The three pairs collapse into a single multi-color mesh gradient when used as the hero atmospheric backdrop. Treat the gradient as one unified object — do not crop down to a single colour, do not reorder the stops, and do not miniaturise. Used at hero scale only.', '{"sourcePath":"docs/design-md/vercel/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
Two custom faces carry the entire system:

1. **A custom geometric sans** (extracted as `Geist`) for every display, body, button, link, and label. Weights 400 / 500 / 600 are the working set; the face never appears in 700 or heavier. Display sizes are tracked aggressively negative (`-2.4 px` at 48 px hero, `-1.28 px` at 32 px section); body stays at neutral or slightly-negative tracking.
2. **A custom monospaced face** (extracted as `Geist Mono`) for terminal mockups, code blocks, and small mono-caption labels — anything that wants to signal "technical." Weight 400 only at 12 – 13 px. Tracking neutral.

A condensed display sans (`Space Grotesk`) is loaded as a third face for occasional editorial moments but does not render as the primary face anywhere in the captured surfaces.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 48px | 600 | 48px | -2.4px | Hero headline ("Build and deploy on the AI Cloud."). |
| `{typography.display-lg}` | 32px | 600 | 40px | -1.28px | Section headlines ("Your frontend, delivered.", "A compute model for all workloads."). |
| `{typography.display-md}` | 24px | 600 | 32px | -0.96px | Card-cluster headlines, pricing-tier names. |
| `{typography.display-sm}` | 20px | 600 | 28px | -0.6px | Inline display micro-headings. |
| `{typography.body-lg}` | 18px | 400 | 28px | 0 | Lead paragraphs under section headlines. |
| `{typography.body-md}` | 16px | 400 | 24px | 0 | Default body paragraph. |
| `{typography.body-md-strong}` | 16px | 500 | 24px | 0 | Bolded inline body. |
| `{typography.body-sm}` | 14px | 400 | 20px | -0.28px | Secondary body, nav-link text, button-md labels. |
| `{typography.body-sm-strong}` | 14px | 500 | 20px | -0.28px | Nav CTA labels, table-row emphasis. |
| `{typography.caption}` | 12px | 400 | 16px | 0 | Footer secondary lines, badge labels. |
| `{typography.caption-mono}` | 12px | 400 | 16px | 0 | Section eyebrows and label captions that want a technical voice. |
| `{typography.code}` | 13px | 400 | 20px | 0 | Inline code, terminal mockups, command snippets. |
| `{typography.button-md}` | 14px | 500 | 20px | 0 | Small / nav-scale button labels. |
| `{typography.button-lg}` | 16px | 500 | 24px | 0 | Marketing-scale pill button labels. |

### Principles
- **Negative tracking is part of the voice.** Display sizes use aggressive `-2.4` to `-0.6` px tracking. Reverting to default tracking breaks the brand.
- **Sentence-case headlines, period-terminated.** Headlines like "Build and deploy on the AI Cloud." end with a deliberate period — that punctuation is part of the brand''s voice.
- **Mono for the technical layer only.** Section eyebrows, code blocks, terminal mockups. Body paragraphs never set in mono.
- **Weight 600 is the display ceiling.** The geometric sans never appears at 700 / 800. The brand reads as a calmer system because of this.

### Note on Font Substitutes
The two primary faces are proprietary (custom-cut for the brand). Open-source substitutes:
- **Geometric sans** — *Inter* (400 / 500 / 600) is the closest stylistic match; `font-feature-settings: "ss01", "ss02"` enables the geometric alternates. *Satoshi* is a passable second choice.
- **Monospace** — *JetBrains Mono* (400) at 12 – 13 px matches the technical voice. *IBM Plex Mono* is the second-best option.', '{"sourcePath":"docs/design-md/vercel/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4 px. The brand''s `--geist-space` token is exactly 4 px and every captured value is a multiple of 4.
- **Tokens**: `{spacing.xxs}` 4 px · `{spacing.xs}` 8 px · `{spacing.sm}` 12 px · `{spacing.md}` 16 px · `{spacing.lg}` 24 px · `{spacing.xl}` 32 px · `{spacing.2xl}` 40 px · `{spacing.3xl}` 48 px · `{spacing.4xl}` 64 px · `{spacing.5xl}` 96 px · `{spacing.6xl}` 128 px · `{spacing.section}` 192 px.
- **Section padding**: marketing bands use `{spacing.4xl}` to `{spacing.5xl}` top/bottom. Hero bands stretch to `{spacing.section}` to give the mesh gradient room to breathe.
- **Card interior padding**: marketing cards sit at `{spacing.lg}` to `{spacing.xl}`; template-grid cards stay tighter at `{spacing.md}` because they sit in a denser grid.
- **Inline gap**: button rows, nav rows, and chip rows use `{spacing.sm}` to `{spacing.md}` between siblings. The brand''s `--geist-gap` is exactly 24 px.

### Grid & Container
- **Max width**: ~1400 px (`--ds-page-width`); the legacy `--geist-page-width` is 1200 px and still appears on some marketing surfaces. Content centres with horizontal gutters of `{spacing.lg}` 24 px on desktop, `{spacing.md}` 16 px on mobile.
- **Column patterns**:
  - Three-feature row: 3-up at desktop, 1-up at mobile (rows like "Web Apps / Composable Commerce / Multi-tenant Platforms").
  - Tab pill row: 5-up centred row of `tab-ghost` pills.
  - Template-grid cluster: 5-up at desktop, scaling to 1-up at mobile.
  - Pricing tier grid: 3-up at desktop with the middle tier polarity-flipped.
  - Logo strip: ~5 logos wide, single row.

### Whitespace Philosophy
The mesh gradient does most of the heavy decorative lifting; whitespace separates the bands. Section spacing is generous — `{spacing.4xl}` to `{spacing.5xl}` between bands lets the gradient breathe. Inside a card, the headline/paragraph stack is tight (`{spacing.xs}` 8 px gap), then a wider gap before the CTA cluster. The page reads as engineered — large gaps + tight interior, never the other way around.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 600px | Hero stacks; nav collapses to hamburger; 3-up feature grids drop to 1-up; tab pill row enables horizontal scroll. |
| Tablet | 600–959px | 3-up grids drop to 2-up; nav still horizontal. |
| Desktop | 960–1199px | Full 3-up grids; pricing 3-up. |
| Wide | 1200–1399px | Container caps at 1400 px content width. |
| Ultra-wide | ≥ 1400px | Content stays centred at 1400 px; bands stretch edge-to-edge in colour but content holds the max-width. |

#### Touch Targets
The `button-primary` pill renders at ~32 px tall in nav and ~48 px tall in marketing contexts. Marketing CTAs comfortably meet WCAG AAA at all breakpoints; nav buttons inflate touch area through `{spacing.xs}` padding on mobile to meet the 44 × 44 px floor.

#### Collapsing Strategy
- **Nav**: full link row + Ask AI / Log In / Sign Up pills at desktop. Collapses to logo + hamburger at mobile with the menu opening as a full-overlay.
- **Hero**: mesh gradient stays centred; headline + body stack vertically at all breakpoints (the brand doesn''t use a split-hero pattern).
- **Three-feature row**: 3-up → 2-up → 1-up at the breakpoints above; cards keep their `{rounded.md}` 8 px shape across all viewports.
- **Pricing card grid**: 3-up at desktop, vertical stack at mobile with `pricing-card-featured` always sitting in the middle.
- **Template grid**: 5-up → 3-up → 2-up → 1-up. Each `template-card` keeps its 16:9 aspect on the image.

#### Image Behavior
- **Mesh gradient**: rendered as inline SVG or canvas-painted gradient; scales fluidly with the hero container; never crops, never tiles.
- **Customer logos**: rendered as monochrome SVGs in the logo strip; consistent 24 px height.
- **Code editor mockup**: dark `{colors.primary}` rectangle with mono text rendered inside; treated as an image at the layout level.
- **Template thumbnails**: 16:9 landscape inside `{rounded.md}` card chrome; lazy-loaded; consistent grayscale palette in the placeholder state.', '{"sourcePath":"docs/design-md/vercel/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Full-bleed hero bands and the polarity-flipped dark sections. |
| Level 1 — Inset Hairline | `0 0 0 1px #00000014` inset 1 px border. | Default card chrome — the brand''s universal "you can see this card" cue. |
| Level 2 — Subtle Drop | `0px 1px 1px #00000005, 0px 2px 2px #0000000a` plus inset hairline. | Slightly elevated cards (template-grid, marketing-card). |
| Level 3 — Soft Stack | `0px 2px 2px #0000000a, 0px 8px 8px -8px #0000000a` plus inset hairline. | The "medium" elevation — feature-grid cards. |
| Level 4 — Float Stack | `0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a` plus inset hairline. | "Large" elevation — pricing cards, callout panels. |
| Level 5 — Modal | `0px 1px 1px #00000005, 0px 8px 16px -4px #0000000a, 0px 24px 32px -8px #0000000f` plus inset hairline. | Modal / dialog surfaces and dropdown menus. |

The brand uses STACKED shadows — multiple small offsets layered to fake natural light — never a single 8-px-blur generic drop. Inset hairline rings are always added so the card edge stays crisp.

### Decorative Depth
- **Mesh gradient as atmospheric depth**: the hero''s multi-stop gradient is the brand''s only "atmospheric" effect — applied as a flat 2-D backdrop rather than a 3-D illustration.
- **Polarity-flipped dark band as section-depth**: switching the surface from `{colors.canvas-soft}` to `{colors.primary}` (the deep ink) is the brand''s chief depth cue between bands.
- **Inset-shadow + drop-shadow combo**: the cards'' combination of an inset 1 px ring and a multi-stop drop produces a "card sits on the page" effect without ever feeling material-heavy.', '{"sourcePath":"docs/design-md/vercel/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed hero / footer bands. |
| `{rounded.xs}` | 4px | Tightest inline pill — the `nav-cta-signup` 6-px-radius button (mapped to `xs/sm`). |
| `{rounded.sm}` | 6px | The brand''s `--geist-radius` token — base UI radius for in-app buttons, form inputs, dropdown menus. |
| `{rounded.md}` | 8px | The brand''s `--geist-marketing-radius` token — feature cards, template cards. |
| `{rounded.lg}` | 12px | Slightly larger card chrome (pricing-card variants). |
| `{rounded.xl}` | 16px | Largest card chrome — when a card hosts a hero image cap. |
| `{rounded.pill-sm}` | 64px | Tab-ghost pills inside the "AI Apps / Web Apps / Ecommerce / Marketing / Platforms" row. |
| `{rounded.pill}` | 100px | The marketing CTA pill — `button-primary`, `button-secondary`, "Start Deploying" pill. |
| `{rounded.full}` | 9999px | Icon-button circular containers, nav-link ghost pills. |

### Photography Geometry
- **Mesh gradient**: full-bleed 2-D atmospheric backdrop, never cropped to a frame; treated as the page''s wallpaper.
- **Customer logos**: monochrome SVG, consistent 24 px height in a flex row.
- **Code editor mockup**: 16:10 dark rectangle, `{rounded.md}` corners.
- **Template thumbnails**: 16:9 landscape inside `{rounded.md}` chrome.
- **Showcase imagery**: 2:1 or 16:9 inside `{rounded.lg}` to `{rounded.xl}` chrome with a stacked shadow.', '{"sourcePath":"docs/design-md/vercel/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — the canonical 100-px-radius black pill, marketing scale.
- Background `{colors.primary}`, text `{colors.on-primary}`, label set in `{typography.button-lg}`, padding `0px {spacing.sm}` 12 px, shape `{rounded.pill}` 100 px. Renders ~48 px tall when paired with the marketing flex layout.

**`button-secondary`** — the white pill paired with the black primary inside marketing bands.
- Background `{colors.canvas}`, text `{colors.ink}`, same typography + padding as `button-primary`, shape `{rounded.pill}`.

**`button-primary-sm`** — the smaller-scale primary pill used inside nav and pricing-card CTAs.
- Background `{colors.primary}`, text `{colors.on-primary}`, label set in `{typography.button-md}` (14 px / 500), shape `{rounded.pill}`.

**`button-secondary-sm`** — the smaller-scale white pill paired with `button-primary-sm`.
- Background `{colors.canvas}`, text `{colors.ink}`, same typography + shape as `button-primary-sm`.

**`tab-ghost`** — the centred-row tab pill ("AI Apps / Web Apps / Ecommerce / Marketing / Platforms").
- Background `{colors.canvas}`, text `{colors.ink}`, label set in `{typography.body-sm}`, padding `0px {spacing.md}`, shape `{rounded.pill-sm}` 64 px.

**`icon-button-circular`** — the circular icon container (often a "?" or arrow inside).
- Background `{colors.canvas}`, dark icon, 1 px solid hairline border, shape `{rounded.full}`.

**Nav CTAs:**

**`nav-cta-signup`** — the small black "Sign Up" button in the nav row.
- Background `{colors.primary}`, text `{colors.on-primary}`, label `{typography.body-sm-strong}`, padding `0px {spacing.xs}`, height 28 px, shape `{rounded.sm}` 6 px (the brand''s `--geist-radius`).

**`nav-cta-login`** — the white "Log In" button in the nav.
- Background `{colors.canvas}`, text `{colors.ink}`, same typography / height / shape as `nav-cta-signup`.

**`nav-cta-ask-ai`** — the small "Ask AI" button with a faint border.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border (extracted as `0px solid rgb(235, 235, 235)`), same typography / height / shape.

### Cards & Containers

**`card-marketing`** — the canonical marketing feature card (3-up section cards).
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.lg}` 24 px, shape `{rounded.md}` 8 px (the `--geist-marketing-radius`). Carries Level 3 soft-stack shadow.

**`card-marketing-large`** — the larger marketing card used for "compute model" / "AI Gateway" callouts.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.lg}` 12 px. Carries Level 4 float-stack shadow.

**`card-soft`** — the soft-tinted card used inside cluster groups (lighter than canvas-soft).
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.md}`.

**`template-card`** — the deploy-template card in the "Deploy your first app" grid.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md}` 16 px, shape `{rounded.md}` 8 px. Hosts a 16:9 thumbnail at the top.

**`code-editor-mockup`** — the dark code-preview surface inside marketing bands.
- Background `{colors.primary}`, text `{colors.on-primary}`, body in `{typography.code}` (13 px / Geist Mono), padding `{spacing.lg}` 24 px, shape `{rounded.md}` 8 px.

**`pricing-card`** — the default pricing-tier card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.xl}` 32 px, shape `{rounded.lg}` 12 px. Inside: tier name in `{typography.display-md}`, price in `{typography.display-xl}`, feature list in `{typography.body-md}` rows, CTA at the bottom.

**`pricing-card-featured`** — the polarity-flipped "Pro" tier card.
- Background `{colors.primary}`, text `{colors.on-primary}`, same shape + padding as `pricing-card`. CTA inverts to `button-secondary-sm` (white pill on black card).

### Inputs & Forms

**`form-input`** — the canonical text input.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, body in `{typography.body-sm}` (14 px), padding `0px {spacing.sm}`, height 40 px (the brand''s `--geist-form-height`), shape `{rounded.sm}` 6 px.

**`form-input-sm`** — small-height variant (32 px tall) for tight forms.
- Same as `form-input` but height 32 px (the `--geist-form-small-height`).

**`form-input-lg`** — large-height variant (48 px tall) for hero CTAs.
- Same as `form-input` but height 48 px (the `--geist-form-large-height`); body in `{typography.body-md}` 16 px.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas}`, text `{colors.ink}`, height 64 px (the brand''s `--header-height`), padding `{spacing.sm} {spacing.lg}`. Layout: logo left, link row centre, "Ask AI / Log In / Sign Up" cluster right.

**`nav-link`** — the centred link row inside `nav-bar`.
- Text `{colors.body}`, set in `{typography.body-sm}`, padding `{spacing.xs} {spacing.sm}`, shape `{rounded.full}` (ghost pill — visible only on hover or active, but the radius is documented).

**`footer`** — the bottom 4-column nav.
- Background `{colors.canvas}`, text `{colors.body}`, padding `{spacing.4xl} {spacing.lg}`. Eyebrow column labels in `{typography.caption-mono}` (uppercase mono effect); link rows in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — the white hero with the mesh gradient backdrop.
- Background `{colors.canvas}` (or `{colors.canvas-soft}` on some surfaces), text `{colors.ink}`, padding `{spacing.4xl} {spacing.lg}`. Inside: a small mono badge above the headline, the headline in `{typography.display-xl}` (sentence-case, period-terminated), a body lead in `{typography.body-lg}`, then a CTA row with `button-primary` + `button-secondary`. The mesh gradient sits behind, scaled to occupy roughly the top half of the band.

**`feature-mesh-band`** — the secondary section that hosts a mesh-gradient atmospheric backdrop with feature copy on top.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.lg}`. Section headline in `{typography.display-lg}`; supporting body in `{typography.body-md}`.

**`showcase-band-light`** — a soft-canvas section ("Deploy your first app in seconds").
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.lg}`.

**`showcase-band-dark`** — the polarity-flipped dark band ("A compute model for all workloads").
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.5xl} {spacing.lg}`. Section headline in `{typography.display-lg}` (white on black). Often contains a `code-editor-mockup` flush with the band.

**`logo-strip`** — the customer-logo wrapping row near the top of the page.
- Background `{colors.canvas}`, text `{colors.body}`, padding `{spacing.lg} {spacing.xl}`. Logos rendered as monochrome SVGs at consistent height.

**`badge-secondary`** — the small inline metadata pill ("New", "Beta", "Live").
- Background `{colors.canvas-soft}`, text `{colors.body}`, body in `{typography.caption}`, padding `0px {spacing.xs}`, shape `{rounded.full}`.

**`banner-marketing`** — the "Introducing X" announcement pill at the top of pages.
- Background `{colors.canvas-soft}`, text `{colors.body}`, body in `{typography.body-sm}`, padding `{spacing.xs} {spacing.sm}`, shape `{rounded.full}`.

**`link-inline`** — body-copy inline links.
- Text `{colors.link}` (`#0070f3`), body in `{typography.body-md}`, underlined.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`', '{"sourcePath":"docs/design-md/vercel/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (`#171717`) for primary CTAs across the page. Black ink IS the conversion target.
- Use `{rounded.pill}` 100 px for every marketing-scale CTA and `{rounded.sm}` 6 px for nav-scale buttons. The two pill scales coexist deliberately.
- Set every headline in `{typography.display-*}` weight 600, sentence-case, often period-terminated. Aggressive negative tracking is part of the voice.
- Use the brand mesh gradient as atmospheric decoration at hero scale only — never miniaturise it to an icon, never reduce to a single colour.
- Layer stacked shadows (multiple small offsets with inset hairline) rather than single heavy drops. The brand''s elevation is calmer than Material.
- Cycle page surfaces in `{colors.canvas-soft}` → `{colors.canvas}` → `{colors.primary}` polarity-flipped bands; the dark band IS the depth cue.
- Set every code block and technical eyebrow in `{typography.code}` / `{typography.caption-mono}`. Mono is the voice of the platform.

### Don''t
- Don''t introduce a sixth accent colour. The brand operates with ink + gray + the four-pair gradient palette; new accents flatten the voice.
- Don''t render headlines in all-caps. Sentence-case + negative tracking is non-negotiable.
- Don''t drop a single heavy drop-shadow on cards. The brand''s elevation is built from stacked small offsets + inset hairline rings.
- Don''t render the brand gradient at icon scale or in a single-colour reduced form. The gradient lives at hero scale only.
- Don''t promote the geometric sans to weight 700. The brand''s display ceiling is 600.
- Don''t pair the marketing 100-px pill CTA shape with the 6-px nav radius on the same screen — pick a scale and stay there.
- Don''t set body paragraphs in the mono face. The mono is for code + technical labels only.', '{"sourcePath":"docs/design-md/vercel/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_1', '#171717', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_3', '#4d4d4d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_4', '#888888', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_5', '#ebebeb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_6', '#a1a1a1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_7', '#fafafa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_8', '#f5f5f5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_9', '#0070f3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_10', '#0761d1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_11', '#d3e5ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_12', '#ee0000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_13', '#f7d4d6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_14', '#c50000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_15', '#f5a623', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_16', '#ffefcf', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_17', '#ab570a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_18', '#7928ca', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_19', '#d8ccf1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_20', '#4c2889', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_21', '#50e3c2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_22', '#aaffec', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_23', '#29bc9b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_24', '#ff0080', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_25', '#eb367f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_26', '#007cf0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_27', '#00dfd8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_28', '#ff4d4d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_29', '#f9cb28', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md'), 'color', 'color_30', '#f2f2f2', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/vercel/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/vercel/DESIGN.md';


-- Vodafone
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Vodafone', 'vodafone', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/vodafone/DESIGN.md', null, 'seeded', '---
version: alpha
name: Vodafone-Inspired-design-analysis
description: An inspired interpretation of Vodafone''s design language — a telecom super-brand whose web surface alternates between editorial photography hero bands with massive uppercase display headlines and clean white content bands, anchored by the company''s signature scarlet red CTA and the proprietary Vodafone display sans set at impossibly heavy 800 weight.

colors:
  primary: "#e60000"
  on-primary: "#ffffff"
  ink: "#25282b"
  body: "#7e7e7e"
  mute: "#bebebe"
  canvas: "#ffffff"
  canvas-soft: "#f2f2f2"
  on-dark: "#ffffff"

typography:
  display-hero:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 144px
    fontWeight: 800
    lineHeight: 114px
    letterSpacing: -1px
  display-xxl:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 126px
    fontWeight: 800
    lineHeight: 113px
    letterSpacing: -1px
  display-xl:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 90px
    fontWeight: 800
    lineHeight: 84px
  display-lg:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 48px
    fontWeight: 300
    lineHeight: 52px
  display-md:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 40px
    fontWeight: 300
    lineHeight: 44px
  display-sm:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
  display-xs:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 24px
    fontWeight: 700
    lineHeight: 24px
  eyebrow-uppercase:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 800
    lineHeight: 24px
  body-lg:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 22px
    fontWeight: 400
    lineHeight: 24px
  body-md:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
  body-md-strong:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 28px
  body-sm:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 700
    lineHeight: 22px
  caption:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 16px
  caption-strong:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 14px
    fontWeight: 700
    lineHeight: 21px
  caption-uppercase:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.5691px
  button-md:
    fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px

rounded:
  none: 0px
  xs: 1px
  sm: 6px
  card: 6px
  pill-md: 32px
  pill-lg: 60px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px

components:
  nav-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    padding: "{spacing.lg} {spacing.3xl}"
  nav-link:
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    borderColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill-lg}"
    padding: "{spacing.md} {spacing.2xl}"
  button-outline-red:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill-lg}"
    padding: "{spacing.md} {spacing.2xl}"
  button-outline-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill-lg}"
    padding: "{spacing.md} {spacing.2xl}"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.canvas}"
    rounded: "{rounded.full}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  badge-chip:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.pill-md}"
    padding: "{spacing.xs} {spacing.md}"
  card-content:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  card-hero:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-sm}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  hero-band-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-hero}"
    padding: "{spacing.3xl} {spacing.3xl}"
  hero-band-red:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-xl}"
    padding: "{spacing.3xl} {spacing.3xl}"
  content-band-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "{spacing.3xl} {spacing.3xl}"
  speechmark-logo-orb:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  divider-on-dark:
    borderColor: "{colors.on-dark}"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    padding: "{spacing.3xl} {spacing.3xl}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default tier card. Mirrors card-content chrome with canvas-soft surface and a hairline border."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.mute}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  ex-pricing-tier-featured:
    description: "Featured tier — polarity-flipped to ink with white text and white pill CTA inside."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  ex-product-selector:
    description: "Tariff-tier picker — repurposed as the brand''s plan selector with badge-chip chips inside the frame."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  ex-cart-drawer:
    description: "Subscription summary — line items per tariff add-on, light hairline dividers."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
    item-divider: "{colors.mute}"
  ex-app-shell-row:
    description: "Sidebar nav row. Active state uses brand primary as a left-edge indicator bar."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  ex-data-table-cell:
    description: "Default data-table cell chrome. Header uses caption-uppercase mono-style eyebrow; body uses body-sm."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption-uppercase}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.md} {spacing.lg}"
    rowBorder: "{colors.mute}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Mirrors card-content chrome with text-input primitives inside."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as card-content; brand uses scrim, not card shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  ex-empty-state-card:
    description: "Empty-state illustration frame on canvas-soft with generous interior padding."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.card}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — card-content shape with caption-strong body."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
    typography: "{typography.body-sm}"

---


## Overview

Vodafone is a global telecom super-brand and its web surface delivers exactly that posture: heroic editorial photography, occasionally cropping a portrait so tight only an eye line and a phone hand are visible, with a single colossal uppercase headline floating on top in the brand''s proprietary heavy display weight. The page reads like a campaign poster more than a corporate site, then breaks into a calmer content rhythm of light-canvas story cards and a single red marker (the iconic speechmark logo) drawing the eye to the brand''s centre of gravity. There is no second accent colour competing — the entire decorative palette is `{colors.primary}` Vodafone red, near-black `{colors.ink}`, and the surrounding white and grayscale neutrals.

Type is the second decisive voice. Vodafone''s custom display sans (extracted as `Vodafone`) carries every headline at impossibly heavy weight 800 in upper case for hero scale (`{typography.display-hero}` 144 px, `{typography.display-xxl}` 126 px) and at lighter weight 300 for the sub-displays that follow. Body text stays in the same family at weight 400 with neutral tracking. The contrast between display weight 800 and display weight 300 IS the brand''s typographic story: a shout, then a calm sentence.

Every interactive CTA renders as a generously rounded pill (`{rounded.pill-lg}` 60 px) — Vodafone has never used a square button on its marketing surface in years, and the brand''s pill scale ladder runs from 32 px (badge pills) through 60 px (CTA pills) up to 9999 px (icon circular containers). Cards stay gentler at `{rounded.card}` 6 px.

**Key Characteristics:**
- A single primary CTA color `{colors.primary}` (`#e60000`) — Vodafone Red. Pill-filled for primary, pill-outline for secondary. No third button variant.
- Massive uppercase display weight 800 (`{typography.display-hero}` and siblings) is the brand''s signature. The 300-weight headline siblings (`{typography.display-lg}` / `{typography.display-md}`) handle calmer secondary moments.
- The `speechmark-logo-orb` — a red square hosting Vodafone''s quotation-mark icon — is the only piece of decorative chrome that''s not a CTA. It anchors the brand''s centre of every page.
- Pill geometry on every interactive shape — `{rounded.pill-lg}` 60 px for buttons, `{rounded.pill-md}` 32 px for inline badges. Card chrome stays at `{rounded.card}` 6 px.
- A two-band page rhythm — `{colors.ink}` dark hero / `{colors.canvas}` light content. No mid-band greys; the brand uses surface contrast, not soft neutrals, for elevation.
- Editorial photography (real portraits, real cities, real cabling) is the only consistent decorative system — no illustration, no atmospheric gradients.

## Colors

### Brand & Accent
- **Vodafone Red** (`{colors.primary}` — `#e60000`): The single brand accent. Every primary CTA pill, every speechmark logo, every conversion target. The most iconic red in telecom — never desaturated, never used at scale for body fills (reserved for high-attention surfaces).

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default light content background.
- **Canvas Soft** (`{colors.canvas-soft}` — `#f2f2f2`): A near-white tint used as the badge-chip background.
- **Ink** (`{colors.ink}` — `#25282b`): The brand''s near-black surface — used as the dark hero band, the nav background, and the footer fill. Doubles as the primary text color on light surfaces.

### Text
- **Ink** (`{colors.ink}` — `#25282b`): Every heading and body paragraph on light surfaces.
- **Body** (`{colors.body}` — `#7e7e7e`): Secondary body text on light surfaces — captions, metadata, supporting copy.
- **Mute** (`{colors.mute}` — `#bebebe`): The lowest-priority text color — placeholder text, low-key footer links.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): All text on `{colors.ink}` surfaces (hero, footer, nav).

### Semantic
The brand does not maintain a separate semantic palette. The primary red doubles as validation / destructive signal when needed; success / warning use are reserved for in-product contexts and are not part of the documented marketing system.

## Typography

### Font Family
A single custom face carries the entire system: **Vodafone**, the brand''s proprietary display sans. The face spans weights 300 (light), 400 (regular), 600, 700, and 800 — every role in the system pulls from this one family. There is no mono companion; technical labels (rare on the marketing surface) borrow the same face at smaller sizes.

The icomoon icon-font is loaded for proprietary glyphs but does not render as a typographic role.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-hero}` | 144px | 800 | 114px | -1px | The hero stencil (`"STAY CONNECTED"`) — uppercase, ultra-tight tracking, brand''s signature size. |
| `{typography.display-xxl}` | 126px | 800 | 113px | -1px | Slightly smaller hero variant. |
| `{typography.display-xl}` | 90px | 800 | 84px | 0 | Mid-hero scale. |
| `{typography.display-lg}` | 48px | 300 | 52px | 0 | Section-headline sub-display in the lighter weight. |
| `{typography.display-md}` | 40px | 300 | 44px | 0 | Sub-section displays. |
| `{typography.display-sm}` | 32px | 700 | 40px | 0 | Card headings, story-card titles. |
| `{typography.display-xs}` | 24px | 700 | 24px | 0 | Inline display micro-headings. |
| `{typography.eyebrow-uppercase}` | 16px | 800 | 24px | 0 | Uppercase eyebrow tags above section headlines. |
| `{typography.body-lg}` | 22px | 400 | 24px | 0 | Lead body paragraphs. |
| `{typography.body-md}` | 18px | 400 | 28px | 0 | Default paragraph body. |
| `{typography.body-md-strong}` | 18px | 600 | 28px | 0 | Bolded inline body. |
| `{typography.body-sm}` | 16px | 400 | 20px | 0 | Secondary body. |
| `{typography.body-sm-strong}` | 16px | 700 | 22px | 0 | Bolded short body. |
| `{typography.caption}` | 14px | 400 | 16px | 0 | Captions, fine print. |
| `{typography.caption-strong}` | 14px | 700 | 21px | 0 | Bold captions, badge labels. |
| `{typography.caption-uppercase}` | 12px | 600 | 16px | 0.57px | Uppercase metadata, footer eyebrows. |
| `{typography.button-md}` | 18px | 400 | 28px | 0 | Default button label. |

### Principles
- **Weight 800 + uppercase = hero voice.** This is the entire reason the brand reads as a billboard rather than a tech site.
- **Weight 300 = the calmer secondary voice.** Used at 40 – 48 px for sub-displays; never below 24 px to keep legibility.
- **Single family throughout.** The brand never mixes a serif or a mono into the typographic system. Consistency is the calm.
- **Tracking stays tight at display sizes.** `-1px` at 144 px is the brand''s calibration; reverting to neutral tracking softens the stencil look.

### Note on Font Substitutes
The Vodafone display sans is proprietary. Open-source substitutes:
- **Display sans** — *Inter* weight 800 at hero scale with `letter-spacing: -1px` is the closest free match. *Geist* weight 700–800 is the second-best.
- **Lighter display weight (300)** — *Inter* weight 300 holds its line-height well at 48 px display sizes.

## Layout

### Spacing System
- **Base unit**: 4 px (mostly multiples of 4; a few 5/7 px appear inside icon-padding compensation).
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px.
- **Section padding**: hero bands and content bands use `{spacing.3xl}` 32 px gutters; vertical spacing inside hero is fluid (fill-the-band).
- **Card interior padding**: story cards use `{spacing.lg}` 16 px around image + headline.
- **Inline gap**: button rows and chip rows use `{spacing.md}` 12 px between siblings.

### Grid & Container
- Marketing content uses a wide container (effectively edge-to-edge with `{spacing.3xl}` gutters on desktop, shrinking on mobile).
- Story-card grids: 2-up at desktop, 1-up at mobile.
- Hero photography fills the viewport; the headline overlays at the top-left.

### Whitespace Philosophy
The hero''s massive display headline owns the whole top of the page; whitespace below is generous to let the second band breathe. Inside content cards, headline and copy hug close (`{spacing.sm}` 8 px gap), then a wider gap (`{spacing.3xl}`) before the next card. The footer band is dark and dense.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 600px | Hero display scales down to ~64 px; story-card grid drops to 1-up; nav collapses to hamburger. |
| Tablet | 600–1023px | Story-card grid 2-up; display headlines drop to 90 – 110 px. |
| Desktop | 1024–1399px | Full display headline at 126 – 144 px; 2-up story grid. |
| Ultra-wide | ≥ 1400px | Container caps at ~1400 px; bands stay edge-to-edge in colour. |

#### Touch Targets
The `button-primary` pill renders at ~52 px tall (12 px vertical padding + 28 px line-height). All buttons comfortably meet WCAG AAA at every breakpoint.

#### Collapsing Strategy
- **Nav**: full link row at desktop. Collapses to a hamburger menu at mobile; the menu opens as a dark overlay with the same link list stacked.
- **Hero**: the massive display headline scales fluidly. At mobile, the photography crop tightens to the figure''s face only.
- **Story-card grid**: 2-up → 1-up at the breakpoint above.
- **Speechmark logo orb**: stays at consistent size relative to surrounding content; never shrinks below ~48 px.

#### Image Behavior
- **Hero photography**: full-bleed 16:9 or 4:3 portraits at desktop; tighter crops at mobile.
- **Story-card thumbnails**: 16:9 landscape inside `{rounded.card}` 6 px chrome.
- **Speechmark orb**: always rendered as the red SVG quote-mark icon, never substituted.
- **Logo bar (if present on partner pages)**: monochrome SVGs at consistent height.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default for most cards and panels — surface contrast does the elevation work. |
| Level 1 — Hairline | 1 px solid `{colors.ink}` border. | Form inputs, the `divider-on-dark` between footer columns. |
| Level 2 — Border on Dark | 1 px solid `{colors.on-dark}` border on `{colors.ink}` surfaces. | Outline buttons sitting on the dark hero band. |

The brand does not use soft drop shadows; depth comes from polarity-flip between `{colors.ink}` and `{colors.canvas}` bands.

### Decorative Depth
- **Editorial photography**: the hero photo (real-person portrait or environment shot) is the brand''s only true atmospheric effect.
- **Speechmark logo orb as visual anchor**: the red orb hosting the quote-mark icon acts as a single point of focal-depth in the centre of the otherwise-flat content rhythm.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed hero bands, footer, banner strips. |
| `{rounded.xs}` | 1px | Tightest inline indicator (rarely used). |
| `{rounded.sm}` | 6px | The brand''s canonical content radius — applied to images and inputs. |
| `{rounded.card}` | 6px | Card chrome and image frames (alias for `sm`). |
| `{rounded.pill-md}` | 32px | Badge / chip pills. |
| `{rounded.pill-lg}` | 60px | The brand''s signature CTA pill — every primary and secondary button. |
| `{rounded.full}` | 9999px | Circular icon containers (e.g., video play/pause). |

### Photography Geometry
- Hero portraits: edge-to-edge 16:9 or 4:3 with no internal frame.
- Story-card thumbnails: 16:9 landscape inside `{rounded.card}` chrome.
- Speechmark logo orb: square with `{rounded.sm}` corners (visually a tilted-square mark; the SVG mark itself fills the orb).

## Components

### Buttons

**`button-primary`** — the red pill CTA, brand''s primary conversion target.
- Background `{colors.primary}`, text `{colors.on-primary}`, 1 px solid `{colors.primary}` border, label set in `{typography.button-md}`, padding `{spacing.md} {spacing.2xl}`, shape `{rounded.pill-lg}` 60 px.

**`button-outline-red`** — the secondary pill, red-text-on-white with red border.
- Background `{colors.canvas}`, text `{colors.primary}`, 1 px solid `{colors.primary}` border, same label / padding / shape as `button-primary`.

**`button-outline-dark`** — the tertiary pill, ink-text-on-white with ink border.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.ink}` border, same label / padding / shape.

**`button-icon-circular`** — the round white icon button (video play / pause / chevron).
- Background `{colors.canvas}`, ink icon, 1 px solid `{colors.canvas}` outline (effectively borderless), shape `{rounded.full}`.

### Cards & Containers

**`card-content`** — the default story-card chrome.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.card}` 6 px. Hosts a 16:9 thumbnail at the top + headline + caption.

**`card-hero`** — the slightly larger card variant used as the lead story.
- Same chrome as `card-content` but headline scales to `{typography.display-sm}`.

### Inputs & Forms

**`text-input`** — the canonical text input.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.ink}` border, body in `{typography.body-sm}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.sm}` 6 px.

### Navigation

**`nav-bar`** — the dark top nav, fixed to the page top.
- Background `{colors.ink}`, text `{colors.on-dark}`, padding `{spacing.lg} {spacing.3xl}`. Layout: logo left, link row right with login / search affordances.

**`nav-link`** — the link items inside `nav-bar`.
- Text `{colors.on-dark}`, set in `{typography.body-sm}`.

**`footer`** — the dark footer band.
- Background `{colors.ink}`, text `{colors.on-dark}`, padding `{spacing.3xl} {spacing.3xl}`. Body in `{typography.body-sm}`; column eyebrows in `{typography.caption-uppercase}`.

### Signature Components

**`hero-band-dark`** — the dark navy/ink hero band hosting the massive display headline.
- Background `{colors.ink}` with full-bleed editorial photography overlay at reduced opacity; text `{colors.on-dark}`; padding `{spacing.3xl} {spacing.3xl}`. Headline in `{typography.display-hero}` (uppercase, weight 800).

**`hero-band-red`** — the rare full-bleed red hero used on signature campaigns.
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.3xl} {spacing.3xl}`. Headline in `{typography.display-xl}`.

**`content-band-light`** — the white content band that follows every hero.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.3xl}`. Section headline in `{typography.display-md}` or `{typography.display-lg}` (weight 300).

**`speechmark-logo-orb`** — the red square hosting Vodafone''s quotation-mark icon. The brand''s visual anchor.
- Background `{colors.primary}`, white icon glyph, shape `{rounded.sm}`. Acts as a focal element between content bands, often near the centre of long pages.

**`badge-chip`** — the inline metadata pill used for category tags inside story cards.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, label in `{typography.caption-strong}`, padding `{spacing.xs} {spacing.md}`, shape `{rounded.pill-md}` 32 px.

**`divider-on-dark`** — the 1 px hairline used between sections / columns on dark surfaces.
- 1 px solid `{colors.on-dark}` (often at 25 % opacity at the component level).

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` Vodafone Red for primary CTAs and the `speechmark-logo-orb`. Every conversion target uses the red pill.
- Set hero headlines in `{typography.display-hero}` weight 800 UPPERCASE with tight `-1px` tracking. That stencil look IS the brand voice.
- Use `{rounded.pill-lg}` 60 px on every interactive pill. The brand never uses square corners on CTAs.
- Cycle page surfaces in `{colors.ink}` dark hero → `{colors.canvas}` light content → `{colors.ink}` footer. Surface contrast is the depth cue.
- Pair editorial portrait photography with the massive display headline overlay — that combination IS the brand''s signature.
- Render the speechmark logo orb at consistent size relative to surrounding content — it''s the brand''s centre of gravity on every page.

### Don''t
- Don''t introduce a second accent colour. The brand operates with red + ink + grayscale only.
- Don''t render headlines in sentence case at hero scale. Hero display IS uppercase weight 800.
- Don''t render the primary CTA as a square rectangle. The 60 px pill is non-negotiable.
- Don''t drop a soft drop-shadow on cards. The brand relies on surface-colour contrast, not shadow.
- Don''t substitute the speechmark logo orb with a wordmark or a different shape. The orb is the iconic mark.
- Don''t pair the weight 800 display face with letter-spacing 0 at 144 px — the `-1px` tracking is part of the brand''s calibration.
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

Vodafone is a global telecom super-brand and its web surface delivers exactly that posture: heroic editorial photography, occasionally cropping a portrait so tight only an eye line and a phone hand are visible, with a single colossal uppercase headline floating on top in the brand''s proprietary heavy display weight. The page reads like a campaign poster more than a corporate site, then breaks into a calmer content rhythm of light-canvas story cards and a single red marker (the iconic speechmark logo) drawing the eye to the brand''s centre of gravity. There is no second accent colour competing — the entire decorative palette is `{colors.primary}` Vodafone red, near-black `{colors.ink}`, and the surrounding white and grayscale neutrals.

Type is the second decisive voice. Vodafone''s custom display sans (extracted as `Vodafone`) carries every headline at impossibly heavy weight 800 in upper case for hero scale (`{typography.display-hero}` 144 px, `{typography.display-xxl}` 126 px) and at lighter weight 300 for the sub-displays that follow. Body text stays in the same family at weight 400 with neutral tracking. The contrast between display weight 800 and display weight 300 IS the brand''s typographic story: a shout, then a calm sentence.

Every interactive CTA renders as a generously rounded pill (`{rounded.pill-lg}` 60 px) — Vodafone has never used a square button on its marketing surface in years, and the brand''s pill scale ladder runs from 32 px (badge pills) through 60 px (CTA pills) up to 9999 px (icon circular containers). Cards stay gentler at `{rounded.card}` 6 px.

**Key Characteristics:**
- A single primary CTA color `{colors.primary}` (`#e60000`) — Vodafone Red. Pill-filled for primary, pill-outline for secondary. No third button variant.
- Massive uppercase display weight 800 (`{typography.display-hero}` and siblings) is the brand''s signature. The 300-weight headline siblings (`{typography.display-lg}` / `{typography.display-md}`) handle calmer secondary moments.
- The `speechmark-logo-orb` — a red square hosting Vodafone''s quotation-mark icon — is the only piece of decorative chrome that''s not a CTA. It anchors the brand''s centre of every page.
- Pill geometry on every interactive shape — `{rounded.pill-lg}` 60 px for buttons, `{rounded.pill-md}` 32 px for inline badges. Card chrome stays at `{rounded.card}` 6 px.
- A two-band page rhythm — `{colors.ink}` dark hero / `{colors.canvas}` light content. No mid-band greys; the brand uses surface contrast, not soft neutrals, for elevation.
- Editorial photography (real portraits, real cities, real cabling) is the only consistent decorative system — no illustration, no atmospheric gradients.', '{"sourcePath":"docs/design-md/vodafone/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Vodafone Red** (`{colors.primary}` — `#e60000`): The single brand accent. Every primary CTA pill, every speechmark logo, every conversion target. The most iconic red in telecom — never desaturated, never used at scale for body fills (reserved for high-attention surfaces).

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default light content background.
- **Canvas Soft** (`{colors.canvas-soft}` — `#f2f2f2`): A near-white tint used as the badge-chip background.
- **Ink** (`{colors.ink}` — `#25282b`): The brand''s near-black surface — used as the dark hero band, the nav background, and the footer fill. Doubles as the primary text color on light surfaces.

### Text
- **Ink** (`{colors.ink}` — `#25282b`): Every heading and body paragraph on light surfaces.
- **Body** (`{colors.body}` — `#7e7e7e`): Secondary body text on light surfaces — captions, metadata, supporting copy.
- **Mute** (`{colors.mute}` — `#bebebe`): The lowest-priority text color — placeholder text, low-key footer links.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): All text on `{colors.ink}` surfaces (hero, footer, nav).

### Semantic
The brand does not maintain a separate semantic palette. The primary red doubles as validation / destructive signal when needed; success / warning use are reserved for in-product contexts and are not part of the documented marketing system.', '{"sourcePath":"docs/design-md/vodafone/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
A single custom face carries the entire system: **Vodafone**, the brand''s proprietary display sans. The face spans weights 300 (light), 400 (regular), 600, 700, and 800 — every role in the system pulls from this one family. There is no mono companion; technical labels (rare on the marketing surface) borrow the same face at smaller sizes.

The icomoon icon-font is loaded for proprietary glyphs but does not render as a typographic role.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-hero}` | 144px | 800 | 114px | -1px | The hero stencil (`"STAY CONNECTED"`) — uppercase, ultra-tight tracking, brand''s signature size. |
| `{typography.display-xxl}` | 126px | 800 | 113px | -1px | Slightly smaller hero variant. |
| `{typography.display-xl}` | 90px | 800 | 84px | 0 | Mid-hero scale. |
| `{typography.display-lg}` | 48px | 300 | 52px | 0 | Section-headline sub-display in the lighter weight. |
| `{typography.display-md}` | 40px | 300 | 44px | 0 | Sub-section displays. |
| `{typography.display-sm}` | 32px | 700 | 40px | 0 | Card headings, story-card titles. |
| `{typography.display-xs}` | 24px | 700 | 24px | 0 | Inline display micro-headings. |
| `{typography.eyebrow-uppercase}` | 16px | 800 | 24px | 0 | Uppercase eyebrow tags above section headlines. |
| `{typography.body-lg}` | 22px | 400 | 24px | 0 | Lead body paragraphs. |
| `{typography.body-md}` | 18px | 400 | 28px | 0 | Default paragraph body. |
| `{typography.body-md-strong}` | 18px | 600 | 28px | 0 | Bolded inline body. |
| `{typography.body-sm}` | 16px | 400 | 20px | 0 | Secondary body. |
| `{typography.body-sm-strong}` | 16px | 700 | 22px | 0 | Bolded short body. |
| `{typography.caption}` | 14px | 400 | 16px | 0 | Captions, fine print. |
| `{typography.caption-strong}` | 14px | 700 | 21px | 0 | Bold captions, badge labels. |
| `{typography.caption-uppercase}` | 12px | 600 | 16px | 0.57px | Uppercase metadata, footer eyebrows. |
| `{typography.button-md}` | 18px | 400 | 28px | 0 | Default button label. |

### Principles
- **Weight 800 + uppercase = hero voice.** This is the entire reason the brand reads as a billboard rather than a tech site.
- **Weight 300 = the calmer secondary voice.** Used at 40 – 48 px for sub-displays; never below 24 px to keep legibility.
- **Single family throughout.** The brand never mixes a serif or a mono into the typographic system. Consistency is the calm.
- **Tracking stays tight at display sizes.** `-1px` at 144 px is the brand''s calibration; reverting to neutral tracking softens the stencil look.

### Note on Font Substitutes
The Vodafone display sans is proprietary. Open-source substitutes:
- **Display sans** — *Inter* weight 800 at hero scale with `letter-spacing: -1px` is the closest free match. *Geist* weight 700–800 is the second-best.
- **Lighter display weight (300)** — *Inter* weight 300 holds its line-height well at 48 px display sizes.', '{"sourcePath":"docs/design-md/vodafone/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4 px (mostly multiples of 4; a few 5/7 px appear inside icon-padding compensation).
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px.
- **Section padding**: hero bands and content bands use `{spacing.3xl}` 32 px gutters; vertical spacing inside hero is fluid (fill-the-band).
- **Card interior padding**: story cards use `{spacing.lg}` 16 px around image + headline.
- **Inline gap**: button rows and chip rows use `{spacing.md}` 12 px between siblings.

### Grid & Container
- Marketing content uses a wide container (effectively edge-to-edge with `{spacing.3xl}` gutters on desktop, shrinking on mobile).
- Story-card grids: 2-up at desktop, 1-up at mobile.
- Hero photography fills the viewport; the headline overlays at the top-left.

### Whitespace Philosophy
The hero''s massive display headline owns the whole top of the page; whitespace below is generous to let the second band breathe. Inside content cards, headline and copy hug close (`{spacing.sm}` 8 px gap), then a wider gap (`{spacing.3xl}`) before the next card. The footer band is dark and dense.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 600px | Hero display scales down to ~64 px; story-card grid drops to 1-up; nav collapses to hamburger. |
| Tablet | 600–1023px | Story-card grid 2-up; display headlines drop to 90 – 110 px. |
| Desktop | 1024–1399px | Full display headline at 126 – 144 px; 2-up story grid. |
| Ultra-wide | ≥ 1400px | Container caps at ~1400 px; bands stay edge-to-edge in colour. |

#### Touch Targets
The `button-primary` pill renders at ~52 px tall (12 px vertical padding + 28 px line-height). All buttons comfortably meet WCAG AAA at every breakpoint.

#### Collapsing Strategy
- **Nav**: full link row at desktop. Collapses to a hamburger menu at mobile; the menu opens as a dark overlay with the same link list stacked.
- **Hero**: the massive display headline scales fluidly. At mobile, the photography crop tightens to the figure''s face only.
- **Story-card grid**: 2-up → 1-up at the breakpoint above.
- **Speechmark logo orb**: stays at consistent size relative to surrounding content; never shrinks below ~48 px.

#### Image Behavior
- **Hero photography**: full-bleed 16:9 or 4:3 portraits at desktop; tighter crops at mobile.
- **Story-card thumbnails**: 16:9 landscape inside `{rounded.card}` 6 px chrome.
- **Speechmark orb**: always rendered as the red SVG quote-mark icon, never substituted.
- **Logo bar (if present on partner pages)**: monochrome SVGs at consistent height.', '{"sourcePath":"docs/design-md/vodafone/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default for most cards and panels — surface contrast does the elevation work. |
| Level 1 — Hairline | 1 px solid `{colors.ink}` border. | Form inputs, the `divider-on-dark` between footer columns. |
| Level 2 — Border on Dark | 1 px solid `{colors.on-dark}` border on `{colors.ink}` surfaces. | Outline buttons sitting on the dark hero band. |

The brand does not use soft drop shadows; depth comes from polarity-flip between `{colors.ink}` and `{colors.canvas}` bands.

### Decorative Depth
- **Editorial photography**: the hero photo (real-person portrait or environment shot) is the brand''s only true atmospheric effect.
- **Speechmark logo orb as visual anchor**: the red orb hosting the quote-mark icon acts as a single point of focal-depth in the centre of the otherwise-flat content rhythm.', '{"sourcePath":"docs/design-md/vodafone/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed hero bands, footer, banner strips. |
| `{rounded.xs}` | 1px | Tightest inline indicator (rarely used). |
| `{rounded.sm}` | 6px | The brand''s canonical content radius — applied to images and inputs. |
| `{rounded.card}` | 6px | Card chrome and image frames (alias for `sm`). |
| `{rounded.pill-md}` | 32px | Badge / chip pills. |
| `{rounded.pill-lg}` | 60px | The brand''s signature CTA pill — every primary and secondary button. |
| `{rounded.full}` | 9999px | Circular icon containers (e.g., video play/pause). |

### Photography Geometry
- Hero portraits: edge-to-edge 16:9 or 4:3 with no internal frame.
- Story-card thumbnails: 16:9 landscape inside `{rounded.card}` chrome.
- Speechmark logo orb: square with `{rounded.sm}` corners (visually a tilted-square mark; the SVG mark itself fills the orb).', '{"sourcePath":"docs/design-md/vodafone/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — the red pill CTA, brand''s primary conversion target.
- Background `{colors.primary}`, text `{colors.on-primary}`, 1 px solid `{colors.primary}` border, label set in `{typography.button-md}`, padding `{spacing.md} {spacing.2xl}`, shape `{rounded.pill-lg}` 60 px.

**`button-outline-red`** — the secondary pill, red-text-on-white with red border.
- Background `{colors.canvas}`, text `{colors.primary}`, 1 px solid `{colors.primary}` border, same label / padding / shape as `button-primary`.

**`button-outline-dark`** — the tertiary pill, ink-text-on-white with ink border.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.ink}` border, same label / padding / shape.

**`button-icon-circular`** — the round white icon button (video play / pause / chevron).
- Background `{colors.canvas}`, ink icon, 1 px solid `{colors.canvas}` outline (effectively borderless), shape `{rounded.full}`.

### Cards & Containers

**`card-content`** — the default story-card chrome.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.card}` 6 px. Hosts a 16:9 thumbnail at the top + headline + caption.

**`card-hero`** — the slightly larger card variant used as the lead story.
- Same chrome as `card-content` but headline scales to `{typography.display-sm}`.

### Inputs & Forms

**`text-input`** — the canonical text input.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.ink}` border, body in `{typography.body-sm}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.sm}` 6 px.

### Navigation

**`nav-bar`** — the dark top nav, fixed to the page top.
- Background `{colors.ink}`, text `{colors.on-dark}`, padding `{spacing.lg} {spacing.3xl}`. Layout: logo left, link row right with login / search affordances.

**`nav-link`** — the link items inside `nav-bar`.
- Text `{colors.on-dark}`, set in `{typography.body-sm}`.

**`footer`** — the dark footer band.
- Background `{colors.ink}`, text `{colors.on-dark}`, padding `{spacing.3xl} {spacing.3xl}`. Body in `{typography.body-sm}`; column eyebrows in `{typography.caption-uppercase}`.

### Signature Components

**`hero-band-dark`** — the dark navy/ink hero band hosting the massive display headline.
- Background `{colors.ink}` with full-bleed editorial photography overlay at reduced opacity; text `{colors.on-dark}`; padding `{spacing.3xl} {spacing.3xl}`. Headline in `{typography.display-hero}` (uppercase, weight 800).

**`hero-band-red`** — the rare full-bleed red hero used on signature campaigns.
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.3xl} {spacing.3xl}`. Headline in `{typography.display-xl}`.

**`content-band-light`** — the white content band that follows every hero.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.3xl}`. Section headline in `{typography.display-md}` or `{typography.display-lg}` (weight 300).

**`speechmark-logo-orb`** — the red square hosting Vodafone''s quotation-mark icon. The brand''s visual anchor.
- Background `{colors.primary}`, white icon glyph, shape `{rounded.sm}`. Acts as a focal element between content bands, often near the centre of long pages.

**`badge-chip`** — the inline metadata pill used for category tags inside story cards.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, label in `{typography.caption-strong}`, padding `{spacing.xs} {spacing.md}`, shape `{rounded.pill-md}` 32 px.

**`divider-on-dark`** — the 1 px hairline used between sections / columns on dark surfaces.
- 1 px solid `{colors.on-dark}` (often at 25 % opacity at the component level).

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`', '{"sourcePath":"docs/design-md/vodafone/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` Vodafone Red for primary CTAs and the `speechmark-logo-orb`. Every conversion target uses the red pill.
- Set hero headlines in `{typography.display-hero}` weight 800 UPPERCASE with tight `-1px` tracking. That stencil look IS the brand voice.
- Use `{rounded.pill-lg}` 60 px on every interactive pill. The brand never uses square corners on CTAs.
- Cycle page surfaces in `{colors.ink}` dark hero → `{colors.canvas}` light content → `{colors.ink}` footer. Surface contrast is the depth cue.
- Pair editorial portrait photography with the massive display headline overlay — that combination IS the brand''s signature.
- Render the speechmark logo orb at consistent size relative to surrounding content — it''s the brand''s centre of gravity on every page.

### Don''t
- Don''t introduce a second accent colour. The brand operates with red + ink + grayscale only.
- Don''t render headlines in sentence case at hero scale. Hero display IS uppercase weight 800.
- Don''t render the primary CTA as a square rectangle. The 60 px pill is non-negotiable.
- Don''t drop a soft drop-shadow on cards. The brand relies on surface-colour contrast, not shadow.
- Don''t substitute the speechmark logo orb with a wordmark or a different shape. The orb is the iconic mark.
- Don''t pair the weight 800 display face with letter-spacing 0 at 144 px — the `-1px` tracking is part of the brand''s calibration.', '{"sourcePath":"docs/design-md/vodafone/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/vodafone/DESIGN.md'), 'color', 'color_1', '#e60000', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vodafone/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vodafone/DESIGN.md'), 'color', 'color_3', '#25282b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vodafone/DESIGN.md'), 'color', 'color_4', '#7e7e7e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vodafone/DESIGN.md'), 'color', 'color_5', '#bebebe', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/vodafone/DESIGN.md'), 'color', 'color_6', '#f2f2f2', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/vodafone/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/vodafone/DESIGN.md';


-- Voltagent
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Voltagent', 'voltagent', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/voltagent/DESIGN.md', null, 'seeded', '---
version: alpha
name: Voltagent-Inspired-design-analysis
description: An inspired interpretation of Voltagent''s design language — a developer-focused AI agent engineering platform whose surface is an unrelenting near-black canvas broken only by a single electric-green brand accent, code-editor mockups inside the hero, and a precise grid of dark feature cards that read like a documentation site dressed as marketing.

colors:
  primary: "#00d992"
  primary-soft: "#2fd6a1"
  primary-deep: "#10b981"
  on-primary: "#101010"
  ink: "#f2f2f2"
  ink-strong: "#ffffff"
  body: "#bdbdbd"
  mute: "#8b949e"
  hairline: "#3d3a39"
  hairline-soft: "#b8b3b0"
  canvas: "#101010"
  canvas-soft: "#1a1a1a"
  canvas-text-soft: "#f5f6f7"

typography:
  display-xl:
    fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif
    fontSize: 60px
    fontWeight: 400
    lineHeight: 60px
    letterSpacing: -0.65px
  display-lg:
    fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif
    fontSize: 36px
    fontWeight: 400
    lineHeight: 40px
    letterSpacing: -0.9px
  display-md:
    fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
    letterSpacing: -0.6px
  display-sm:
    fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
  eyebrow-mono:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 2.52px
  eyebrow-uppercase:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: 0.45px
  body-lg:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
  body-md:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 26px
  body-md-strong:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body-sm:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 23px
  caption:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  caption-strong:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
  code:
    fontFamily: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
  code-strong:
    fontFamily: SFMono-Regular, Menlo, Monaco, Consolas, monospace
    fontSize: 13px
    fontWeight: 550
    lineHeight: 16px
  button-md:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 40px
  5xl: 48px
  6xl: 64px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "{spacing.md} {spacing.3xl}"
  nav-link:
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  button-outline-on-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  button-ghost-green:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary-soft}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  button-pill-tag:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  text-input:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  card-feature:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.2xl}"
  card-feature-emphasized:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  code-mockup:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  code-inline-chip:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.canvas-text-soft}"
    typography: "{typography.code}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.sm}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.5xl} {spacing.3xl}"
  content-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.3xl}"
  green-divider-band:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.primary}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.4xl} {spacing.3xl}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.md}"
    padding: "{spacing.2xl}"
  ex-pricing-tier-featured:
    description: "Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode)."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.2xl}"
  ex-product-selector:
    description: "What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery)."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.md}"
    padding: "{spacing.2xl}"
  ex-cart-drawer:
    description: "Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.2xl}"
    item-divider: "{colors.hairline}"
  ex-app-shell-row:
    description: "Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  ex-data-table-cell:
    description: "Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.md} {spacing.lg}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.md}"
    padding: "{spacing.2xl}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as feature-card with elevated shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.2xl}"
  ex-empty-state-card:
    description: "Empty-state illustration frame."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — feature-card shape + medium shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.lg}"
    typography: "{typography.body-sm}"

---


## Overview

Voltagent is an AI agent engineering platform built for developers, and the brand wears that audience proudly: a near-black `{colors.canvas}` (`#101010`) page background that runs edge-to-edge with no light-mode counterpart, a single electric-green accent (`{colors.primary}` `#00d992`) reserved for CTAs, status pills, and the brand lightning glyph, and a typography system that pairs sentence-case Inter with SF Mono for inline code and command snippets. The whole page reads like polished documentation that decided to also sell something.

The decorative system is restrained. There is no gradient mesh, no atmospheric backdrop, no illustration suite. Instead, the brand uses small typographic moments — a green code chip (`npx voltagent ...`), a 3-px outlined feature card sitting against the same near-black canvas, a green hairline divider between section bands — to mark its identity. The result is a page that feels engineered: every card has a hairline border, every snippet has a copy-to-clipboard button, every metric is rendered in a numeric monospace.

Type stays calm. Hero display sits at 60 px in regular weight with `-0.65 px` tracking — not a billboard headline, more like a documentation H1. Section headings step down to 36 px / 24 px in similar weights. Body copy is 16 px Inter at line-height 1.65 for the kind of legibility long-form devs expect. Uppercase eyebrows are common — `EVERYTHING YOU NEED` style mono-cap labels above section headlines — and they use Inter at weight 600 with wide positive tracking (`2.52 px` at 14 px).

**Key Characteristics:**
- A single electric-green accent `{colors.primary}` (`#00d992`) carries every CTA, every status pill, and the brand''s lightning logo. No second accent.
- Dark canvas (`{colors.canvas}` `#101010`) is the only page surface — there is no light-mode rhythm; the entire site reads as one continuous dark surface broken by feature-card boundaries.
- Hairline-bordered feature cards (`{colors.hairline}` `#3d3a39`, 1 px solid) are the brand''s primary chrome — no shadows, no fills, just precise hairline rectangles.
- A signature dashed-border accent (`1px dashed rgba(79, 93, 117, 0.4)`) appears between sections as a quiet rhythm cue — the brand''s only ornamental line.
- Inter + SF Mono pair carries every typographic role. SF Mono is reserved for code blocks, inline command snippets, and metric counters.
- Buttons are tight 6 px rounded rectangles (not pills); only inline status tags use the 9999 px full pill.

## Colors

### Brand & Accent
- **Electric Green** (`{colors.primary}` — `#00d992`): The single brand accent. Every primary CTA, every status pill, every "live" indicator, the brand''s lightning glyph itself. Reserved.
- **Primary Soft** (`{colors.primary-soft}` — `#2fd6a1`): A slightly more muted green used inside button-ghost variants and tooltip / focus indicators.
- **Primary Deep** (`{colors.primary-deep}` — `#10b981`): The darker green used for inline link colour in body copy.

### Surface
- **Canvas** (`{colors.canvas}` — `#101010`): The default near-black page background. The only surface mode in the brand''s marketing system.
- **Canvas Soft** (`{colors.canvas-soft}` — `#1a1a1a`): A slightly lighter dark fill used inside code blocks and form inputs to mark them visually distinct against the canvas.
- **Hairline** (`{colors.hairline}` — `#3d3a39`): 1 px solid borders — feature cards, buttons, dividers between rows. The brand''s universal "edge" colour.
- **Hairline Soft** (`{colors.hairline-soft}` — `#b8b3b0`): A lighter divider tint used in rare on-light secondary contexts.

### Text
- **Ink** (`{colors.ink}` — `#f2f2f2`): Default text colour on the dark canvas — slightly off-white to reduce contrast strain.
- **Ink Strong** (`{colors.ink-strong}` — `#ffffff`): Pure-white text for hero headlines and high-emphasis copy.
- **Body** (`{colors.body}` — `#bdbdbd`): Secondary text — supporting copy, body paragraphs in long-form sections.
- **Mute** (`{colors.mute}` — `#8b949e`): Lowest-priority on-dark text — captions, fine print, footer secondary lines.
- **Canvas Text Soft** (`{colors.canvas-text-soft}` — `#f5f6f7`): Used inside code mockups to keep code colour just slightly cooler than the surrounding body text.

### Semantic
The brand doesn''t surface a separate error / warning palette in its public marketing pages — the underlying Docusaurus default semantic palette exists in the design system but is reserved for in-product / docs contexts. Validation cues on the marketing surface use the primary green for success and a muted body grey for missing states.

## Typography

### Font Family
Two faces carry the system:
1. **Inter** for every display, body, button, and link role. Weights 400 / 500 / 600 / 700 are the working set. Used with OpenType features `"calt"` and `"rlig"` enabled across the page so the geometric Inter ligatures and contextual alternates render correctly.
2. **SF Mono** (`SFMono-Regular` with Menlo / Monaco / Consolas / Liberation Mono fallbacks) for inline code, command snippets, terminal mockups, and the brand''s numeric counters. Weights 400 / 549 / 550 / 700 are present — the unusual 549 / 550 sub-bold weight gives the mono a "slightly heavier than regular" voice for emphasis.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 60px | 400 | 60px | -0.65px | Hero headline ("AI Agent Engineering Platform"). |
| `{typography.display-lg}` | 36px | 400 | 40px | -0.9px | Section headlines. |
| `{typography.display-md}` | 24px | 700 | 32px | -0.6px | Sub-section / card-title displays. |
| `{typography.display-sm}` | 20px | 600 | 28px | 0 | Card titles in dense grids. |
| `{typography.eyebrow-mono}` | 14px | 600 | 20px | 2.52px | UPPERCASE eyebrow tags ("EVERYTHING YOU NEED"). |
| `{typography.eyebrow-uppercase}` | 18px | 600 | 28px | 0.45px | Larger uppercase eyebrows above hero subsections. |
| `{typography.body-lg}` | 18px | 400 | 28px | 0 | Lead paragraphs. |
| `{typography.body-md}` | 16px | 400 | 26px | 0 | Default body paragraph. |
| `{typography.body-md-strong}` | 16px | 600 | 24px | 0 | Bolded inline body. |
| `{typography.body-sm}` | 14px | 400 | 20px | 0 | Secondary body. |
| `{typography.body-sm-strong}` | 14px | 600 | 23px | 0 | Bold caption / pill-tag labels. |
| `{typography.caption}` | 12px | 400 | 16px | 0 | Fine print. |
| `{typography.caption-strong}` | 12px | 500 | 16px | 0 | Bold caption. |
| `{typography.code}` | 13px | 400 | 18px | 0 | Code blocks, inline command snippets. |
| `{typography.code-strong}` | 13px | 550 | 16px | 0 | Emphasised inline code (the SF Mono "almost-bold" weight). |
| `{typography.button-md}` | 16px | 600 | 24px | 0 | Button labels. |

### Principles
- **Inter regular at 60 px display** is the brand''s calming counter to AI marketing''s tendency to shout. The light tracking and modest weight read like documentation.
- **Two-face contrast carries the technical voice.** Inter for narrative; SF Mono for anything that could be typed at a terminal.
- **Uppercase eyebrow with tracking is the brand''s signature label style.** `2.52 px` at 14 px is the documented value.

### Note on Font Substitutes
- **Sans** — *Inter* is the brand''s actual face; substitute is the brand itself when self-hosting is not available.
- **Mono** — *SF Mono* is Apple-system; *JetBrains Mono* or *Geist Mono* are the best free substitutes.

## Layout

### Spacing System
- **Base unit**: 4 px; small 5 / 6.4 px values appear inside code-mockup line-height compensation.
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px · `{spacing.4xl}` 40 px · `{spacing.5xl}` 48 px · `{spacing.6xl}` 64 px.
- **Section padding**: hero + content bands use `{spacing.5xl}` 48 px top/bottom.
- **Card interior padding**: feature cards sit at `{spacing.2xl}` 24 px.

### Grid & Container
- Marketing container centres at roughly 1200 – 1400 px; content stays edge-to-edge in colour with horizontal gutters of `{spacing.3xl}` on desktop.
- Feature-card grids: 2-up to 3-up at desktop, 1-up at mobile.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hero 60→32 px; cards 1-up; nav hamburger. |
| Tablet | 768–1023px | Cards 2-up; nav stays horizontal. |
| Desktop | ≥ 1024px | Full 3-up card grids. |

#### Touch Targets
Buttons render at ~44 px tall (12 px vertical padding + 24 px line-height). Meet WCAG AAA at all breakpoints.

#### Collapsing Strategy
Nav collapses to hamburger at mobile; the menu overlay keeps the same green CTA pinned at the bottom. Feature-card grids drop to 1-up; hero typography scales fluidly.

#### Image Behavior
Code-editor mockups render as image-like cards with copy-to-clipboard affordances. No photography in the brand''s marketing surface.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Full-bleed bands. |
| Level 1 — Hairline | 1 px solid `{colors.hairline}` border on `{colors.canvas}`. | Default for every feature card and button. |
| Level 2 — Inset Glow | `0 0 15px rgba(92, 88, 85, 0.2)` subtle outer glow. | Hovering / featured cards. |
| Level 3 — Modal Stack | `0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(148,163,184,0.1) inset` heavy drop + inset ring. | Modal / dialog surfaces in-product. |

### Decorative Depth
- Hairline cards on dark canvas — the brand''s only true elevation mode.
- A 2 px solid `{colors.primary}` green border occasionally marks "featured" or "active" status on a card.
- A 1 px dashed `rgba(79, 93, 117, 0.4)` divider sits between section bands as a quiet rhythm cue.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands. |
| `{rounded.xs}` | 4px | Smallest inline pills, code inline chips. |
| `{rounded.sm}` | 6px | Default button and input radius. |
| `{rounded.md}` | 8px | Card chrome, code-block chrome. |
| `{rounded.pill}` | 9999px | Inline status tags ("Live", "Beta"). |
| `{rounded.full}` | 9999px | Circular icon containers. |

## Components

### Buttons

**`button-primary`** — the electric-green CTA.
- Background `{colors.primary}`, text `{colors.on-primary}` (near-black), label `{typography.button-md}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.sm}` 6 px.

**`button-outline-on-dark`** — the hairline-on-dark secondary button.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, same typography / padding / shape.

**`button-ghost-green`** — text-only with green label, for tertiary actions.
- Background `{colors.canvas}`, text `{colors.primary-soft}`, no border.

**`button-pill-tag`** — the inline pill for category tags / status labels.
- Background `{colors.canvas}`, text `{colors.ink}`, hairline border, body in `{typography.body-sm}`, padding `{spacing.xs} {spacing.md}`, shape `{rounded.pill}` 9999 px.

### Cards & Containers

**`card-feature`** — the default feature card.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, padding `{spacing.2xl}`, shape `{rounded.md}` 8 px. The brand''s most-repeated card chrome.

**`card-feature-emphasized`** — the same card with a 3 px hairline border for emphasis.
- Same chrome as `card-feature` with 3 px solid `{colors.hairline}`.

**`code-mockup`** — the dark code-editor card with copy-to-clipboard affordance.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, body in `{typography.code}` (SF Mono 13 px), padding `{spacing.xl}`, shape `{rounded.md}`.

**`code-inline-chip`** — the inline command snippet pill.
- Background `{colors.canvas-soft}`, text `{colors.canvas-text-soft}`, body in `{typography.code}`, padding `{spacing.xxs} {spacing.sm}`, shape `{rounded.sm}`.

### Inputs & Forms

**`text-input`** — the standard text input on dark.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, body in `{typography.body-sm}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.sm}` 6 px.

### Navigation

**`nav-bar`** — the sticky top nav on dark.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.3xl}`.

**`nav-link`** — link items in nav.
- Text `{colors.body}`, set in `{typography.body-sm}`.

**`footer`** — the dark footer band.
- Background `{colors.canvas}`, text `{colors.body}`, padding `{spacing.4xl} {spacing.3xl}`. Body in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — the dark hero band with the 60-px Inter headline.
- Background `{colors.canvas}`, text `{colors.ink}` (with the headline at `{colors.ink-strong}` white), padding `{spacing.5xl} {spacing.3xl}`. Headline in `{typography.display-xl}` (60 px / weight 400 / `-0.65 px` tracking). Eyebrow above headline in `{typography.eyebrow-mono}` (uppercase, tracked).

**`content-band`** — the standard content band hosting feature grids.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.3xl}`. Section headline in `{typography.display-lg}`.

**`green-divider-band`** — a thin green-glow band that occasionally separates major sections.
- Background `{colors.canvas}`, 2 px solid `{colors.primary}` top/bottom border. The brand''s only chromatic divider.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (`#00d992`) for every primary CTA, the lightning logo glyph, and live-status indicators. The green is the brand''s centre of gravity.
- Use the dark `{colors.canvas}` (`#101010`) as the only page surface. There is no light-mode rhythm.
- Build cards with 1 px `{colors.hairline}` borders, not shadows. Hairlines on dark IS the brand''s elevation system.
- Pair Inter (sentence-case) with SF Mono (inline code, command snippets). Every uppercase moment uses Inter at weight 600 with `2.52 px` tracking — not a separate mono.
- Use `{rounded.sm}` 6 px for buttons, `{rounded.md}` 8 px for cards, `{rounded.pill}` 9999 px only for inline status tags.

### Don''t
- Don''t introduce a light-mode counterpart. The brand is dark-canvas only.
- Don''t use the primary green as a body-text fill. It''s CTA-only.
- Don''t drop a soft drop-shadow on cards. The brand uses hairlines + occasional glow, never material shadows.
- Don''t render the hero headline in heavy weight (700+). The brand''s display is intentionally calm at weight 400.
- Don''t replace Inter or SF Mono with a different family — both faces are part of the brand''s voice and pairing.
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

Voltagent is an AI agent engineering platform built for developers, and the brand wears that audience proudly: a near-black `{colors.canvas}` (`#101010`) page background that runs edge-to-edge with no light-mode counterpart, a single electric-green accent (`{colors.primary}` `#00d992`) reserved for CTAs, status pills, and the brand lightning glyph, and a typography system that pairs sentence-case Inter with SF Mono for inline code and command snippets. The whole page reads like polished documentation that decided to also sell something.

The decorative system is restrained. There is no gradient mesh, no atmospheric backdrop, no illustration suite. Instead, the brand uses small typographic moments — a green code chip (`npx voltagent ...`), a 3-px outlined feature card sitting against the same near-black canvas, a green hairline divider between section bands — to mark its identity. The result is a page that feels engineered: every card has a hairline border, every snippet has a copy-to-clipboard button, every metric is rendered in a numeric monospace.

Type stays calm. Hero display sits at 60 px in regular weight with `-0.65 px` tracking — not a billboard headline, more like a documentation H1. Section headings step down to 36 px / 24 px in similar weights. Body copy is 16 px Inter at line-height 1.65 for the kind of legibility long-form devs expect. Uppercase eyebrows are common — `EVERYTHING YOU NEED` style mono-cap labels above section headlines — and they use Inter at weight 600 with wide positive tracking (`2.52 px` at 14 px).

**Key Characteristics:**
- A single electric-green accent `{colors.primary}` (`#00d992`) carries every CTA, every status pill, and the brand''s lightning logo. No second accent.
- Dark canvas (`{colors.canvas}` `#101010`) is the only page surface — there is no light-mode rhythm; the entire site reads as one continuous dark surface broken by feature-card boundaries.
- Hairline-bordered feature cards (`{colors.hairline}` `#3d3a39`, 1 px solid) are the brand''s primary chrome — no shadows, no fills, just precise hairline rectangles.
- A signature dashed-border accent (`1px dashed rgba(79, 93, 117, 0.4)`) appears between sections as a quiet rhythm cue — the brand''s only ornamental line.
- Inter + SF Mono pair carries every typographic role. SF Mono is reserved for code blocks, inline command snippets, and metric counters.
- Buttons are tight 6 px rounded rectangles (not pills); only inline status tags use the 9999 px full pill.', '{"sourcePath":"docs/design-md/voltagent/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Electric Green** (`{colors.primary}` — `#00d992`): The single brand accent. Every primary CTA, every status pill, every "live" indicator, the brand''s lightning glyph itself. Reserved.
- **Primary Soft** (`{colors.primary-soft}` — `#2fd6a1`): A slightly more muted green used inside button-ghost variants and tooltip / focus indicators.
- **Primary Deep** (`{colors.primary-deep}` — `#10b981`): The darker green used for inline link colour in body copy.

### Surface
- **Canvas** (`{colors.canvas}` — `#101010`): The default near-black page background. The only surface mode in the brand''s marketing system.
- **Canvas Soft** (`{colors.canvas-soft}` — `#1a1a1a`): A slightly lighter dark fill used inside code blocks and form inputs to mark them visually distinct against the canvas.
- **Hairline** (`{colors.hairline}` — `#3d3a39`): 1 px solid borders — feature cards, buttons, dividers between rows. The brand''s universal "edge" colour.
- **Hairline Soft** (`{colors.hairline-soft}` — `#b8b3b0`): A lighter divider tint used in rare on-light secondary contexts.

### Text
- **Ink** (`{colors.ink}` — `#f2f2f2`): Default text colour on the dark canvas — slightly off-white to reduce contrast strain.
- **Ink Strong** (`{colors.ink-strong}` — `#ffffff`): Pure-white text for hero headlines and high-emphasis copy.
- **Body** (`{colors.body}` — `#bdbdbd`): Secondary text — supporting copy, body paragraphs in long-form sections.
- **Mute** (`{colors.mute}` — `#8b949e`): Lowest-priority on-dark text — captions, fine print, footer secondary lines.
- **Canvas Text Soft** (`{colors.canvas-text-soft}` — `#f5f6f7`): Used inside code mockups to keep code colour just slightly cooler than the surrounding body text.

### Semantic
The brand doesn''t surface a separate error / warning palette in its public marketing pages — the underlying Docusaurus default semantic palette exists in the design system but is reserved for in-product / docs contexts. Validation cues on the marketing surface use the primary green for success and a muted body grey for missing states.', '{"sourcePath":"docs/design-md/voltagent/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
Two faces carry the system:
1. **Inter** for every display, body, button, and link role. Weights 400 / 500 / 600 / 700 are the working set. Used with OpenType features `"calt"` and `"rlig"` enabled across the page so the geometric Inter ligatures and contextual alternates render correctly.
2. **SF Mono** (`SFMono-Regular` with Menlo / Monaco / Consolas / Liberation Mono fallbacks) for inline code, command snippets, terminal mockups, and the brand''s numeric counters. Weights 400 / 549 / 550 / 700 are present — the unusual 549 / 550 sub-bold weight gives the mono a "slightly heavier than regular" voice for emphasis.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 60px | 400 | 60px | -0.65px | Hero headline ("AI Agent Engineering Platform"). |
| `{typography.display-lg}` | 36px | 400 | 40px | -0.9px | Section headlines. |
| `{typography.display-md}` | 24px | 700 | 32px | -0.6px | Sub-section / card-title displays. |
| `{typography.display-sm}` | 20px | 600 | 28px | 0 | Card titles in dense grids. |
| `{typography.eyebrow-mono}` | 14px | 600 | 20px | 2.52px | UPPERCASE eyebrow tags ("EVERYTHING YOU NEED"). |
| `{typography.eyebrow-uppercase}` | 18px | 600 | 28px | 0.45px | Larger uppercase eyebrows above hero subsections. |
| `{typography.body-lg}` | 18px | 400 | 28px | 0 | Lead paragraphs. |
| `{typography.body-md}` | 16px | 400 | 26px | 0 | Default body paragraph. |
| `{typography.body-md-strong}` | 16px | 600 | 24px | 0 | Bolded inline body. |
| `{typography.body-sm}` | 14px | 400 | 20px | 0 | Secondary body. |
| `{typography.body-sm-strong}` | 14px | 600 | 23px | 0 | Bold caption / pill-tag labels. |
| `{typography.caption}` | 12px | 400 | 16px | 0 | Fine print. |
| `{typography.caption-strong}` | 12px | 500 | 16px | 0 | Bold caption. |
| `{typography.code}` | 13px | 400 | 18px | 0 | Code blocks, inline command snippets. |
| `{typography.code-strong}` | 13px | 550 | 16px | 0 | Emphasised inline code (the SF Mono "almost-bold" weight). |
| `{typography.button-md}` | 16px | 600 | 24px | 0 | Button labels. |

### Principles
- **Inter regular at 60 px display** is the brand''s calming counter to AI marketing''s tendency to shout. The light tracking and modest weight read like documentation.
- **Two-face contrast carries the technical voice.** Inter for narrative; SF Mono for anything that could be typed at a terminal.
- **Uppercase eyebrow with tracking is the brand''s signature label style.** `2.52 px` at 14 px is the documented value.

### Note on Font Substitutes
- **Sans** — *Inter* is the brand''s actual face; substitute is the brand itself when self-hosting is not available.
- **Mono** — *SF Mono* is Apple-system; *JetBrains Mono* or *Geist Mono* are the best free substitutes.', '{"sourcePath":"docs/design-md/voltagent/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4 px; small 5 / 6.4 px values appear inside code-mockup line-height compensation.
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px · `{spacing.4xl}` 40 px · `{spacing.5xl}` 48 px · `{spacing.6xl}` 64 px.
- **Section padding**: hero + content bands use `{spacing.5xl}` 48 px top/bottom.
- **Card interior padding**: feature cards sit at `{spacing.2xl}` 24 px.

### Grid & Container
- Marketing container centres at roughly 1200 – 1400 px; content stays edge-to-edge in colour with horizontal gutters of `{spacing.3xl}` on desktop.
- Feature-card grids: 2-up to 3-up at desktop, 1-up at mobile.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hero 60→32 px; cards 1-up; nav hamburger. |
| Tablet | 768–1023px | Cards 2-up; nav stays horizontal. |
| Desktop | ≥ 1024px | Full 3-up card grids. |

#### Touch Targets
Buttons render at ~44 px tall (12 px vertical padding + 24 px line-height). Meet WCAG AAA at all breakpoints.

#### Collapsing Strategy
Nav collapses to hamburger at mobile; the menu overlay keeps the same green CTA pinned at the bottom. Feature-card grids drop to 1-up; hero typography scales fluidly.

#### Image Behavior
Code-editor mockups render as image-like cards with copy-to-clipboard affordances. No photography in the brand''s marketing surface.', '{"sourcePath":"docs/design-md/voltagent/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Full-bleed bands. |
| Level 1 — Hairline | 1 px solid `{colors.hairline}` border on `{colors.canvas}`. | Default for every feature card and button. |
| Level 2 — Inset Glow | `0 0 15px rgba(92, 88, 85, 0.2)` subtle outer glow. | Hovering / featured cards. |
| Level 3 — Modal Stack | `0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(148,163,184,0.1) inset` heavy drop + inset ring. | Modal / dialog surfaces in-product. |

### Decorative Depth
- Hairline cards on dark canvas — the brand''s only true elevation mode.
- A 2 px solid `{colors.primary}` green border occasionally marks "featured" or "active" status on a card.
- A 1 px dashed `rgba(79, 93, 117, 0.4)` divider sits between section bands as a quiet rhythm cue.', '{"sourcePath":"docs/design-md/voltagent/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands. |
| `{rounded.xs}` | 4px | Smallest inline pills, code inline chips. |
| `{rounded.sm}` | 6px | Default button and input radius. |
| `{rounded.md}` | 8px | Card chrome, code-block chrome. |
| `{rounded.pill}` | 9999px | Inline status tags ("Live", "Beta"). |
| `{rounded.full}` | 9999px | Circular icon containers. |', '{"sourcePath":"docs/design-md/voltagent/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — the electric-green CTA.
- Background `{colors.primary}`, text `{colors.on-primary}` (near-black), label `{typography.button-md}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.sm}` 6 px.

**`button-outline-on-dark`** — the hairline-on-dark secondary button.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, same typography / padding / shape.

**`button-ghost-green`** — text-only with green label, for tertiary actions.
- Background `{colors.canvas}`, text `{colors.primary-soft}`, no border.

**`button-pill-tag`** — the inline pill for category tags / status labels.
- Background `{colors.canvas}`, text `{colors.ink}`, hairline border, body in `{typography.body-sm}`, padding `{spacing.xs} {spacing.md}`, shape `{rounded.pill}` 9999 px.

### Cards & Containers

**`card-feature`** — the default feature card.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, padding `{spacing.2xl}`, shape `{rounded.md}` 8 px. The brand''s most-repeated card chrome.

**`card-feature-emphasized`** — the same card with a 3 px hairline border for emphasis.
- Same chrome as `card-feature` with 3 px solid `{colors.hairline}`.

**`code-mockup`** — the dark code-editor card with copy-to-clipboard affordance.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, body in `{typography.code}` (SF Mono 13 px), padding `{spacing.xl}`, shape `{rounded.md}`.

**`code-inline-chip`** — the inline command snippet pill.
- Background `{colors.canvas-soft}`, text `{colors.canvas-text-soft}`, body in `{typography.code}`, padding `{spacing.xxs} {spacing.sm}`, shape `{rounded.sm}`.

### Inputs & Forms

**`text-input`** — the standard text input on dark.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, body in `{typography.body-sm}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.sm}` 6 px.

### Navigation

**`nav-bar`** — the sticky top nav on dark.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.3xl}`.

**`nav-link`** — link items in nav.
- Text `{colors.body}`, set in `{typography.body-sm}`.

**`footer`** — the dark footer band.
- Background `{colors.canvas}`, text `{colors.body}`, padding `{spacing.4xl} {spacing.3xl}`. Body in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — the dark hero band with the 60-px Inter headline.
- Background `{colors.canvas}`, text `{colors.ink}` (with the headline at `{colors.ink-strong}` white), padding `{spacing.5xl} {spacing.3xl}`. Headline in `{typography.display-xl}` (60 px / weight 400 / `-0.65 px` tracking). Eyebrow above headline in `{typography.eyebrow-mono}` (uppercase, tracked).

**`content-band`** — the standard content band hosting feature grids.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.3xl}`. Section headline in `{typography.display-lg}`.

**`green-divider-band`** — a thin green-glow band that occasionally separates major sections.
- Background `{colors.canvas}`, 2 px solid `{colors.primary}` top/bottom border. The brand''s only chromatic divider.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`', '{"sourcePath":"docs/design-md/voltagent/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (`#00d992`) for every primary CTA, the lightning logo glyph, and live-status indicators. The green is the brand''s centre of gravity.
- Use the dark `{colors.canvas}` (`#101010`) as the only page surface. There is no light-mode rhythm.
- Build cards with 1 px `{colors.hairline}` borders, not shadows. Hairlines on dark IS the brand''s elevation system.
- Pair Inter (sentence-case) with SF Mono (inline code, command snippets). Every uppercase moment uses Inter at weight 600 with `2.52 px` tracking — not a separate mono.
- Use `{rounded.sm}` 6 px for buttons, `{rounded.md}` 8 px for cards, `{rounded.pill}` 9999 px only for inline status tags.

### Don''t
- Don''t introduce a light-mode counterpart. The brand is dark-canvas only.
- Don''t use the primary green as a body-text fill. It''s CTA-only.
- Don''t drop a soft drop-shadow on cards. The brand uses hairlines + occasional glow, never material shadows.
- Don''t render the hero headline in heavy weight (700+). The brand''s display is intentionally calm at weight 400.
- Don''t replace Inter or SF Mono with a different family — both faces are part of the brand''s voice and pairing.', '{"sourcePath":"docs/design-md/voltagent/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_1', '#00d992', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_2', '#2fd6a1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_3', '#10b981', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_4', '#101010', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_5', '#f2f2f2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_6', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_7', '#bdbdbd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_8', '#8b949e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_9', '#3d3a39', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_10', '#b8b3b0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_11', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md'), 'color', 'color_12', '#f5f6f7', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/voltagent/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/voltagent/DESIGN.md';


-- Warp
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Warp', 'warp', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/warp/DESIGN.md', null, 'seeded', '---
version: alpha
name: Warp-Inspired-design-analysis
description: An inspired interpretation of Warp''s design language — an agentic terminal-and-development-environment brand whose surface is a warm near-charcoal canvas (a tint warmer than pure black), broken only by clean Inter typography, the occasional Instrument Serif italic moment, and dense terminal-mockup imagery; CTAs are unusually understated, with shape geometry running tighter than most marketing sites.

colors:
  primary: "#f7f5f0"
  on-primary: "#2b2622"
  ink: "#f7f5f0"
  body: "#c9c0ad"
  body-strong: "#dad2c1"
  mute: "#aea69c"
  canvas: "#2b2622"
  canvas-soft: "#383330"
  hairline: "#3f3a36"

typography:
  display-xl:
    fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif
    fontSize: 64px
    fontWeight: 400
    lineHeight: 70.4px
    letterSpacing: -1.6px
  display-lg:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 48px
    fontWeight: 400
    lineHeight: 52.8px
    letterSpacing: -1.2px
  display-md:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 32px
    fontWeight: 500
    lineHeight: 40px
    letterSpacing: -0.8px
  display-sm:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 24px
    fontWeight: 500
    lineHeight: 32px
    letterSpacing: -0.4px
  display-serif:
    fontFamily: Instrument Serif, Georgia, "Times New Roman", serif
    fontSize: 48px
    fontWeight: 400
    lineHeight: 52px
    letterSpacing: -0.5px
  body-lg:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
  body-md:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
  body-sm:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  caption:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  code:
    fontFamily: DM Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
  code-md:
    fontFamily: DM Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  button-md:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px

rounded:
  none: 0px
  xxs: 1px
  xs: 2px
  sm: 3px
  md: 4px
  lg: 6px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 10px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
  5xl: 96px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.md} {spacing.xl}"
  nav-link:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.lg}"
  button-secondary-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.lg}"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  text-input:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
  card-content:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  card-mockup:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  download-tile:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md-strong}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  press-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    padding: "{spacing.lg} 0"
  job-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md-strong}"
    padding: "{spacing.lg} 0"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.5xl} {spacing.xl}"
  content-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "{spacing.5xl} {spacing.xl}"
  partner-logo-tile:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-strong}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  testimonial-card:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.3xl} {spacing.xl}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-pricing-tier-featured:
    description: "Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode)."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-product-selector:
    description: "What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery)."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-cart-drawer:
    description: "Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    item-divider: "{colors.hairline}"
  ex-app-shell-row:
    description: "Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
  ex-data-table-cell:
    description: "Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.sm} {spacing.md}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as feature-card with elevated shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: "Empty-state illustration frame."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.2xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — feature-card shape + medium shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    typography: "{typography.body-sm}"

---


## Overview

Warp is an "agentic development environment" — a terminal application that wraps an AI agent — and its marketing site mirrors the product''s posture: a single dark band running the entire page, warmer than pure black (`{colors.canvas}` `#2b2622` carries a hint of brown-beige from the brand''s oklch-defined warmth value), with copy set almost entirely in Inter. The page reads more like a developer''s reading-mode editor than a marketing surface.

The decoration is restrained. Two terminal screenshots open the hero (split between the two main product modes — agent + terminal). A partner-logo strip (Anthropic / OpenAI / Google / Stanford) sits below the hero on a slightly warmer tile surface. A single testimonial card with a portrait photograph. A press-coverage list. Then the page closes with download tiles for Mac / Linux / Windows. There is no gradient, no atmospheric backdrop, no illustration system.

Type is the second decisive voice. Hero display sits at 64 px Inter weight 400 with `-1.6px` tracking — restrained for a hero, deliberately quiet. The brand carries DM Mono as its monospace face for code blocks, and Instrument Serif italics occasionally appear for editorial moments. Body text is 16 px Inter at line-height 1.5, very readable.

**Key Characteristics:**
- A single primary "color" — really an off-white `{colors.primary}` (`#f7f5f0`) — that doubles as text on canvas and as the button-primary fill. There is no chromatic brand accent.
- Warm dark canvas (`{colors.canvas}` `#2b2622`) is the only page surface. The brand''s defining tone is the brown-warmth, not pure black.
- Extremely tight button radii — 3 / 4 px (1 / 2× the brand''s `{rounded.md}` 4 px base) — the brand never uses generous pill shapes for CTAs. Only icon containers use `{rounded.full}`.
- Inter sans + DM Mono mono is the canonical pairing. Instrument Serif appears as a third editorial face for occasional italics.
- Terminal-mockup imagery is the brand''s only consistent decorative system — no gradients, no atmospheric overlays.
- A subtle warm tint runs through every neutral; even body text and dividers carry a hint of warmth rather than neutral gray.

## Colors

### Brand & Accent
- **Off White Primary** (`{colors.primary}` — `#f7f5f0`): The brand''s "primary" is a warm off-white. Used as button-primary fill, as default text on canvas, as the wordmark color. There is no chromatic brand accent — the off-white IS the brand''s distinguishing tone.

### Surface
- **Canvas** (`{colors.canvas}` — `#2b2622`): The warm dark page background. Resolved from `oklch(22.0% 0.004 84.6)`. Slightly browner than pure black, slightly warmer than a neutral gray — the warmth IS the brand''s identity.
- **Canvas Soft** (`{colors.canvas-soft}` — `#383330`): A lighter warm-dark fill used for cards, mockup chrome, and partner-logo tiles.
- **Hairline** (`{colors.hairline}` — `#3f3a36`): 1 px solid divider on dark surfaces.

### Text
- **Ink** (`{colors.ink}` — `#f7f5f0`): Default text on canvas — same off-white as the primary, intentionally unified.
- **Body Strong** (`{colors.body-strong}` — `#dad2c1`): Mid-emphasis body text.
- **Body** (`{colors.body}` — `#c9c0ad`): Secondary body text — captions, supporting copy, press-coverage rows.
- **Mute** (`{colors.mute}` — `#aea69c`): Lowest-priority text — timestamps, fine print, footer secondary lines. Resolved from `oklch(71.5% 0.008 84.6)`.

### Semantic
The brand doesn''t surface a separate error / warning / success palette in its marketing pages. Validation cues come from the unified off-white system; in-product semantic colors live in the terminal application proper.

## Typography

### Font Family
Three faces ladder the system:
1. **Inter** for every display, body, button, link, and label role. Weights 400 / 500 are the working pair. Used with the brand''s "Inter Fallback" custom face as the metric-compatible system fallback.
2. **DM Mono** for terminal mockups, command snippets, and code blocks. Weight 400 only. Loaded as `--font-dm-mono`.
3. **Instrument Serif** for occasional editorial italic moments — rare on the marketing surface, but documented as a third face for emphasised tagline-style phrases. **Abel** is also loaded as a fourth fallback for headline emphasis.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 400 | 70.4px | -1.6px | Hero headline ("Warp is the agentic development environment"). |
| `{typography.display-lg}` | 48px | 400 | 52.8px | -1.2px | Section headlines. |
| `{typography.display-md}` | 32px | 500 | 40px | -0.8px | Sub-section displays. |
| `{typography.display-sm}` | 24px | 500 | 32px | -0.4px | Card titles and lead emphasis. |
| `{typography.display-serif}` | 48px | 400 | 52px | -0.5px | Instrument Serif italic editorial moments. |
| `{typography.body-lg}` | 18px | 400 | 28px | 0 | Lead paragraphs. |
| `{typography.body-md}` | 16px | 400 | 24px | 0 | Default body. |
| `{typography.body-md-strong}` | 16px | 500 | 24px | 0 | Bold inline body. |
| `{typography.body-sm}` | 14px | 400 | 20px | 0 | Secondary body. |
| `{typography.body-sm-strong}` | 14px | 500 | 20px | 0 | Nav link / button labels. |
| `{typography.caption}` | 12px | 400 | 16px | 0 | Captions, fine print. |
| `{typography.code}` | 13px | 400 | 18px | 0 | Terminal mockup body. |
| `{typography.code-md}` | 14px | 400 | 20px | 0 | Inline command snippets. |
| `{typography.button-md}` | 14px | 500 | 20px | 0 | Button labels. |

### Principles
- **Hero display at weight 400** — the brand reads as quietly confident, not as a billboard.
- **Negative tracking is part of the voice.** `-1.6 px` at 64 px hero, scaling down through display levels.
- **Inter for narrative, DM Mono for technical.** Strict role separation.

### Note on Font Substitutes
All three faces are open or freely-loadable:
- **Inter** — load directly from Google Fonts or Vercel-hosted CDN.
- **DM Mono** — open-source on Google Fonts.
- **Instrument Serif** — open-source on Google Fonts.

## Layout

### Spacing System
- **Base unit**: 4 px (with occasional 10 px and 6 px values for button padding).
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 10 px · `{spacing.lg}` 16 px · `{spacing.xl}` 24 px · `{spacing.2xl}` 32 px · `{spacing.3xl}` 48 px · `{spacing.4xl}` 64 px · `{spacing.5xl}` 96 px.
- **Section padding**: hero / content bands use `{spacing.5xl}` 96 px on desktop.
- **Card interior**: cards sit at `{spacing.xl}` 24 px.

### Grid & Container
- Marketing content centres at roughly 1200 px width.
- Hero: 2-column at desktop (split between two terminal screenshots), stacks at mobile.
- Partner logos: 5-up wrapping flex row.
- Download tiles: 3-up at desktop (Mac / Linux / Windows), 1-up at mobile.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hero stacks; 1-up grids; nav hamburger. |
| Tablet | 768–1023px | 2-up grids. |
| Desktop | ≥ 1024px | Full hero split; 3-up download tiles. |

#### Touch Targets
Buttons render at ~36 px tall (8 px vertical padding + 20 px line-height). Mobile inflates touch area through additional padding to meet WCAG 44 × 44 px floor.

#### Collapsing Strategy
- Nav: full link row + Sign in / Download right cluster at desktop. Hamburger at mobile.
- Hero terminal-mockup split: stacks vertically at mobile.
- Press / job rows: full-width single column; stay legible at all widths.

#### Image Behavior
- **Terminal mockups**: rendered as dark cards with the actual terminal UI inside (warm canvas + colored syntax). Aspect ratio ~3:2.
- **Partner logos**: monochrome SVGs on dark tile cards.
- **Testimonial portraits**: 1:1 square crop inside `{rounded.md}` card chrome.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default for hero band. |
| Level 1 — Hairline | 1 px solid `{colors.hairline}` border on `{colors.canvas-soft}`. | Default card chrome. |
| Level 2 — Inset Card | Canvas-soft fill against canvas background with 1 px hairline. | Mockup cards, download tiles, testimonial cards. |

The brand uses surface-contrast and hairline borders for elevation; soft drop-shadows do not appear in the marketing surface.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands. |
| `{rounded.xxs}` | 1px | Tightest in-text indicator. |
| `{rounded.xs}` | 2px | Inline very-small chips. |
| `{rounded.sm}` | 3px | Default button radius — extremely tight. |
| `{rounded.md}` | 4px | Card chrome (the brand''s `--radius` base). |
| `{rounded.lg}` | 6px | Slightly larger cards. |
| `{rounded.pill}` | 9999px | Icon containers, status pills. |

### Photography Geometry
- Terminal mockups: ~3:2 inside `{rounded.md}` card chrome.
- Partner logos: monochrome SVGs at consistent 24 px height inside tile cards.
- Testimonial portraits: 1:1 square inside `{rounded.md}`.

## Components

### Buttons

**`button-primary`** — the off-white CTA on dark canvas.
- Background `{colors.primary}` (off-white), text `{colors.on-primary}` (warm dark), label `{typography.button-md}`, padding `{spacing.sm} {spacing.lg}`, shape `{rounded.sm}` 3 px. Tight.

**`button-secondary-ghost`** — the ghost-style secondary used for nav and tertiary actions.
- Background `{colors.canvas}`, text `{colors.ink}`, no border, same typography / shape.

**`button-icon-circular`** — the circular icon container.
- Background `{colors.canvas}`, ink icon, shape `{rounded.full}`. Used for nav controls (search, theme).

### Cards & Containers

**`card-content`** — the default content card on canvas-soft.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, padding `{spacing.xl}`, shape `{rounded.md}`.

**`card-mockup`** — the terminal-screenshot mockup card.
- Same chrome as `card-content` but body in `{typography.code}` (DM Mono) when text appears inside.

**`download-tile`** — the Mac / Linux / Windows download tile.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, hairline border, padding `{spacing.xl}`, shape `{rounded.md}`. Hosts a platform icon + label + download CTA.

**`partner-logo-tile`** — the canvas-soft tile hosting a partner logo.
- Background `{colors.canvas-soft}`, monochrome logo SVG inside, padding `{spacing.lg}`, shape `{rounded.md}`.

**`testimonial-card`** — the single quote-style card with a portrait.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.md}`. Portrait 1:1 + body in `{typography.body-md}`.

**`press-row`** — the press-coverage list item.
- Background `{colors.canvas}` (no fill — sits on the canvas band), 1 px solid bottom border `{colors.hairline}`, body in `{typography.body-md}`, padding `{spacing.lg}` 0.

**`job-row`** — the "Join our team" list item (single row per open role).
- Background `{colors.canvas}`, 1 px solid bottom border, body in `{typography.body-md-strong}`, padding `{spacing.lg}` 0.

### Inputs & Forms

**`text-input`** — the dark-canvas text input.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, body in `{typography.body-sm}`, padding `{spacing.sm} {spacing.md}`, shape `{rounded.sm}`.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.xl}`.

**`nav-link`** — link items in nav.
- Background `{colors.canvas}`, text `{colors.ink}`, body in `{typography.body-sm-strong}`, padding `{spacing.xs} {spacing.md}`, shape `{rounded.sm}`.

**`footer`** — the footer band.
- Background `{colors.canvas}`, text `{colors.body}`, padding `{spacing.3xl} {spacing.xl}`. Body in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — the dark hero band hosting the 64-px Inter headline.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.xl}`. Headline `{typography.display-xl}` (64 px / 400 / `-1.6 px`). Below: a 2-column terminal-mockup split.

**`content-band`** — the standard content band.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.xl}`. Section headline `{typography.display-md}`.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` off-white for primary CTA pills and default text. There is no chromatic accent.
- Use tight `{rounded.sm}` 3 px or `{rounded.md}` 4 px button radii. The brand never uses generous pills for CTAs.
- Set hero headlines in Inter weight 400 with `-1.6 px` tracking. The brand reads as quietly confident.
- Pair Inter (sentence-case) with DM Mono (code blocks, terminal mockups).
- Keep the warm-dark canvas tone — pure black breaks the brand''s identity.

### Don''t
- Don''t introduce a chromatic brand accent. The off-white-on-warm-dark IS the brand''s voice.
- Don''t render the hero headline in heavy weight (700+). The brand''s display is intentionally light.
- Don''t use generous pill CTAs. The brand''s button radius is 3-4 px, almost rectangular.
- Don''t replace the warm dark canvas with neutral gray or pure black. The warmth IS the brand.
- Don''t drop a soft drop-shadow on cards. Hairlines + surface contrast carry elevation.
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

Warp is an "agentic development environment" — a terminal application that wraps an AI agent — and its marketing site mirrors the product''s posture: a single dark band running the entire page, warmer than pure black (`{colors.canvas}` `#2b2622` carries a hint of brown-beige from the brand''s oklch-defined warmth value), with copy set almost entirely in Inter. The page reads more like a developer''s reading-mode editor than a marketing surface.

The decoration is restrained. Two terminal screenshots open the hero (split between the two main product modes — agent + terminal). A partner-logo strip (Anthropic / OpenAI / Google / Stanford) sits below the hero on a slightly warmer tile surface. A single testimonial card with a portrait photograph. A press-coverage list. Then the page closes with download tiles for Mac / Linux / Windows. There is no gradient, no atmospheric backdrop, no illustration system.

Type is the second decisive voice. Hero display sits at 64 px Inter weight 400 with `-1.6px` tracking — restrained for a hero, deliberately quiet. The brand carries DM Mono as its monospace face for code blocks, and Instrument Serif italics occasionally appear for editorial moments. Body text is 16 px Inter at line-height 1.5, very readable.

**Key Characteristics:**
- A single primary "color" — really an off-white `{colors.primary}` (`#f7f5f0`) — that doubles as text on canvas and as the button-primary fill. There is no chromatic brand accent.
- Warm dark canvas (`{colors.canvas}` `#2b2622`) is the only page surface. The brand''s defining tone is the brown-warmth, not pure black.
- Extremely tight button radii — 3 / 4 px (1 / 2× the brand''s `{rounded.md}` 4 px base) — the brand never uses generous pill shapes for CTAs. Only icon containers use `{rounded.full}`.
- Inter sans + DM Mono mono is the canonical pairing. Instrument Serif appears as a third editorial face for occasional italics.
- Terminal-mockup imagery is the brand''s only consistent decorative system — no gradients, no atmospheric overlays.
- A subtle warm tint runs through every neutral; even body text and dividers carry a hint of warmth rather than neutral gray.', '{"sourcePath":"docs/design-md/warp/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Off White Primary** (`{colors.primary}` — `#f7f5f0`): The brand''s "primary" is a warm off-white. Used as button-primary fill, as default text on canvas, as the wordmark color. There is no chromatic brand accent — the off-white IS the brand''s distinguishing tone.

### Surface
- **Canvas** (`{colors.canvas}` — `#2b2622`): The warm dark page background. Resolved from `oklch(22.0% 0.004 84.6)`. Slightly browner than pure black, slightly warmer than a neutral gray — the warmth IS the brand''s identity.
- **Canvas Soft** (`{colors.canvas-soft}` — `#383330`): A lighter warm-dark fill used for cards, mockup chrome, and partner-logo tiles.
- **Hairline** (`{colors.hairline}` — `#3f3a36`): 1 px solid divider on dark surfaces.

### Text
- **Ink** (`{colors.ink}` — `#f7f5f0`): Default text on canvas — same off-white as the primary, intentionally unified.
- **Body Strong** (`{colors.body-strong}` — `#dad2c1`): Mid-emphasis body text.
- **Body** (`{colors.body}` — `#c9c0ad`): Secondary body text — captions, supporting copy, press-coverage rows.
- **Mute** (`{colors.mute}` — `#aea69c`): Lowest-priority text — timestamps, fine print, footer secondary lines. Resolved from `oklch(71.5% 0.008 84.6)`.

### Semantic
The brand doesn''t surface a separate error / warning / success palette in its marketing pages. Validation cues come from the unified off-white system; in-product semantic colors live in the terminal application proper.', '{"sourcePath":"docs/design-md/warp/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
Three faces ladder the system:
1. **Inter** for every display, body, button, link, and label role. Weights 400 / 500 are the working pair. Used with the brand''s "Inter Fallback" custom face as the metric-compatible system fallback.
2. **DM Mono** for terminal mockups, command snippets, and code blocks. Weight 400 only. Loaded as `--font-dm-mono`.
3. **Instrument Serif** for occasional editorial italic moments — rare on the marketing surface, but documented as a third face for emphasised tagline-style phrases. **Abel** is also loaded as a fourth fallback for headline emphasis.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 400 | 70.4px | -1.6px | Hero headline ("Warp is the agentic development environment"). |
| `{typography.display-lg}` | 48px | 400 | 52.8px | -1.2px | Section headlines. |
| `{typography.display-md}` | 32px | 500 | 40px | -0.8px | Sub-section displays. |
| `{typography.display-sm}` | 24px | 500 | 32px | -0.4px | Card titles and lead emphasis. |
| `{typography.display-serif}` | 48px | 400 | 52px | -0.5px | Instrument Serif italic editorial moments. |
| `{typography.body-lg}` | 18px | 400 | 28px | 0 | Lead paragraphs. |
| `{typography.body-md}` | 16px | 400 | 24px | 0 | Default body. |
| `{typography.body-md-strong}` | 16px | 500 | 24px | 0 | Bold inline body. |
| `{typography.body-sm}` | 14px | 400 | 20px | 0 | Secondary body. |
| `{typography.body-sm-strong}` | 14px | 500 | 20px | 0 | Nav link / button labels. |
| `{typography.caption}` | 12px | 400 | 16px | 0 | Captions, fine print. |
| `{typography.code}` | 13px | 400 | 18px | 0 | Terminal mockup body. |
| `{typography.code-md}` | 14px | 400 | 20px | 0 | Inline command snippets. |
| `{typography.button-md}` | 14px | 500 | 20px | 0 | Button labels. |

### Principles
- **Hero display at weight 400** — the brand reads as quietly confident, not as a billboard.
- **Negative tracking is part of the voice.** `-1.6 px` at 64 px hero, scaling down through display levels.
- **Inter for narrative, DM Mono for technical.** Strict role separation.

### Note on Font Substitutes
All three faces are open or freely-loadable:
- **Inter** — load directly from Google Fonts or Vercel-hosted CDN.
- **DM Mono** — open-source on Google Fonts.
- **Instrument Serif** — open-source on Google Fonts.', '{"sourcePath":"docs/design-md/warp/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4 px (with occasional 10 px and 6 px values for button padding).
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 10 px · `{spacing.lg}` 16 px · `{spacing.xl}` 24 px · `{spacing.2xl}` 32 px · `{spacing.3xl}` 48 px · `{spacing.4xl}` 64 px · `{spacing.5xl}` 96 px.
- **Section padding**: hero / content bands use `{spacing.5xl}` 96 px on desktop.
- **Card interior**: cards sit at `{spacing.xl}` 24 px.

### Grid & Container
- Marketing content centres at roughly 1200 px width.
- Hero: 2-column at desktop (split between two terminal screenshots), stacks at mobile.
- Partner logos: 5-up wrapping flex row.
- Download tiles: 3-up at desktop (Mac / Linux / Windows), 1-up at mobile.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hero stacks; 1-up grids; nav hamburger. |
| Tablet | 768–1023px | 2-up grids. |
| Desktop | ≥ 1024px | Full hero split; 3-up download tiles. |

#### Touch Targets
Buttons render at ~36 px tall (8 px vertical padding + 20 px line-height). Mobile inflates touch area through additional padding to meet WCAG 44 × 44 px floor.

#### Collapsing Strategy
- Nav: full link row + Sign in / Download right cluster at desktop. Hamburger at mobile.
- Hero terminal-mockup split: stacks vertically at mobile.
- Press / job rows: full-width single column; stay legible at all widths.

#### Image Behavior
- **Terminal mockups**: rendered as dark cards with the actual terminal UI inside (warm canvas + colored syntax). Aspect ratio ~3:2.
- **Partner logos**: monochrome SVGs on dark tile cards.
- **Testimonial portraits**: 1:1 square crop inside `{rounded.md}` card chrome.', '{"sourcePath":"docs/design-md/warp/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default for hero band. |
| Level 1 — Hairline | 1 px solid `{colors.hairline}` border on `{colors.canvas-soft}`. | Default card chrome. |
| Level 2 — Inset Card | Canvas-soft fill against canvas background with 1 px hairline. | Mockup cards, download tiles, testimonial cards. |

The brand uses surface-contrast and hairline borders for elevation; soft drop-shadows do not appear in the marketing surface.', '{"sourcePath":"docs/design-md/warp/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands. |
| `{rounded.xxs}` | 1px | Tightest in-text indicator. |
| `{rounded.xs}` | 2px | Inline very-small chips. |
| `{rounded.sm}` | 3px | Default button radius — extremely tight. |
| `{rounded.md}` | 4px | Card chrome (the brand''s `--radius` base). |
| `{rounded.lg}` | 6px | Slightly larger cards. |
| `{rounded.pill}` | 9999px | Icon containers, status pills. |

### Photography Geometry
- Terminal mockups: ~3:2 inside `{rounded.md}` card chrome.
- Partner logos: monochrome SVGs at consistent 24 px height inside tile cards.
- Testimonial portraits: 1:1 square inside `{rounded.md}`.', '{"sourcePath":"docs/design-md/warp/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — the off-white CTA on dark canvas.
- Background `{colors.primary}` (off-white), text `{colors.on-primary}` (warm dark), label `{typography.button-md}`, padding `{spacing.sm} {spacing.lg}`, shape `{rounded.sm}` 3 px. Tight.

**`button-secondary-ghost`** — the ghost-style secondary used for nav and tertiary actions.
- Background `{colors.canvas}`, text `{colors.ink}`, no border, same typography / shape.

**`button-icon-circular`** — the circular icon container.
- Background `{colors.canvas}`, ink icon, shape `{rounded.full}`. Used for nav controls (search, theme).

### Cards & Containers

**`card-content`** — the default content card on canvas-soft.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, padding `{spacing.xl}`, shape `{rounded.md}`.

**`card-mockup`** — the terminal-screenshot mockup card.
- Same chrome as `card-content` but body in `{typography.code}` (DM Mono) when text appears inside.

**`download-tile`** — the Mac / Linux / Windows download tile.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, hairline border, padding `{spacing.xl}`, shape `{rounded.md}`. Hosts a platform icon + label + download CTA.

**`partner-logo-tile`** — the canvas-soft tile hosting a partner logo.
- Background `{colors.canvas-soft}`, monochrome logo SVG inside, padding `{spacing.lg}`, shape `{rounded.md}`.

**`testimonial-card`** — the single quote-style card with a portrait.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.md}`. Portrait 1:1 + body in `{typography.body-md}`.

**`press-row`** — the press-coverage list item.
- Background `{colors.canvas}` (no fill — sits on the canvas band), 1 px solid bottom border `{colors.hairline}`, body in `{typography.body-md}`, padding `{spacing.lg}` 0.

**`job-row`** — the "Join our team" list item (single row per open role).
- Background `{colors.canvas}`, 1 px solid bottom border, body in `{typography.body-md-strong}`, padding `{spacing.lg}` 0.

### Inputs & Forms

**`text-input`** — the dark-canvas text input.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, body in `{typography.body-sm}`, padding `{spacing.sm} {spacing.md}`, shape `{rounded.sm}`.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.xl}`.

**`nav-link`** — link items in nav.
- Background `{colors.canvas}`, text `{colors.ink}`, body in `{typography.body-sm-strong}`, padding `{spacing.xs} {spacing.md}`, shape `{rounded.sm}`.

**`footer`** — the footer band.
- Background `{colors.canvas}`, text `{colors.body}`, padding `{spacing.3xl} {spacing.xl}`. Body in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — the dark hero band hosting the 64-px Inter headline.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.xl}`. Headline `{typography.display-xl}` (64 px / 400 / `-1.6 px`). Below: a 2-column terminal-mockup split.

**`content-band`** — the standard content band.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.xl}`. Section headline `{typography.display-md}`.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`', '{"sourcePath":"docs/design-md/warp/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` off-white for primary CTA pills and default text. There is no chromatic accent.
- Use tight `{rounded.sm}` 3 px or `{rounded.md}` 4 px button radii. The brand never uses generous pills for CTAs.
- Set hero headlines in Inter weight 400 with `-1.6 px` tracking. The brand reads as quietly confident.
- Pair Inter (sentence-case) with DM Mono (code blocks, terminal mockups).
- Keep the warm-dark canvas tone — pure black breaks the brand''s identity.

### Don''t
- Don''t introduce a chromatic brand accent. The off-white-on-warm-dark IS the brand''s voice.
- Don''t render the hero headline in heavy weight (700+). The brand''s display is intentionally light.
- Don''t use generous pill CTAs. The brand''s button radius is 3-4 px, almost rectangular.
- Don''t replace the warm dark canvas with neutral gray or pure black. The warmth IS the brand.
- Don''t drop a soft drop-shadow on cards. Hairlines + surface contrast carry elevation.', '{"sourcePath":"docs/design-md/warp/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/warp/DESIGN.md'), 'color', 'color_1', '#f7f5f0', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/warp/DESIGN.md'), 'color', 'color_2', '#2b2622', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/warp/DESIGN.md'), 'color', 'color_3', '#c9c0ad', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/warp/DESIGN.md'), 'color', 'color_4', '#dad2c1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/warp/DESIGN.md'), 'color', 'color_5', '#aea69c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/warp/DESIGN.md'), 'color', 'color_6', '#383330', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/warp/DESIGN.md'), 'color', 'color_7', '#3f3a36', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/warp/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/warp/DESIGN.md';


-- Webflow
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Webflow', 'webflow', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/webflow/DESIGN.md', null, 'seeded', '---
version: alpha
name: Webflow-Inspired-design-analysis
description: An inspired interpretation of Webflow''s design language — a visual web development platform whose surface contrasts a deep near-black `#080808` primary against a generous white canvas, broken by a five-stop chromatic accent system (purple / pink / blue / orange / green) that maps to the brand''s product categories, and anchored by the proprietary WF Visual Sans family used at restrained 500 / 600 weights with negative tracking.

colors:
  primary: "#080808"
  on-primary: "#ffffff"
  ink: "#080808"
  ink-strong: "#222222"
  body: "#363636"
  body-mid: "#5a5a5a"
  mute: "#898989"
  mute-soft: "#ababab"
  hairline: "#d8d8d8"
  canvas: "#ffffff"
  accent-purple: "#7a3dff"
  accent-pink: "#ed52cb"
  accent-blue: "#3b89ff"
  accent-blue-deep: "#006acc"
  accent-blue-info: "#146ef5"
  accent-orange: "#ff6b00"
  accent-green: "#00d722"
  accent-yellow: "#ffae13"
  accent-red: "#ee1d36"

typography:
  display-xxl:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, -apple-system, sans-serif
    fontSize: 80px
    fontWeight: 600
    lineHeight: 83.2px
    letterSpacing: -0.8px
  display-xl:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 56px
    fontWeight: 600
    lineHeight: 58.24px
  display-lg:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 44.8px
    fontWeight: 600
    lineHeight: 46.6px
  display-md:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 32px
    fontWeight: 500
    lineHeight: 41.6px
  display-sm:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 24px
    fontWeight: 500
    lineHeight: 31.2px
  display-xs:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 20px
    fontWeight: 500
    lineHeight: 28px
  eyebrow-uppercase:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 15px
    fontWeight: 500
    lineHeight: 19.5px
    letterSpacing: 1.5px
  eyebrow-uppercase-sm:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 12px
    letterSpacing: 0.6px
  body-lg:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 28.8px
    fontWeight: 400
    lineHeight: 46.08px
    letterSpacing: -0.288px
  body-md:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 25.6px
    letterSpacing: -0.16px
  body-md-strong:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 25.6px
    letterSpacing: -0.16px
  body-sm:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22.4px
  body-sm-strong:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 22.4px
  caption:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 12.8px
    fontWeight: 550
    lineHeight: 15.36px
  caption-mono:
    fontFamily: WFVisualSans-Mono, Inconsolata, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
  button-md:
    fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 25.6px
    letterSpacing: -0.16px

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 8px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.lg} {spacing.3xl}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.xl}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.xl}"
  button-text-arrow:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    padding: "{spacing.xl} 0"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  badge-info:
    backgroundColor: "{colors.accent-blue-info}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
  badge-info-soft:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.accent-blue-info}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
  card-feature:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  card-feature-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  card-pricing:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xxl}"
    padding: "{spacing.3xl} {spacing.3xl}"
  hero-band-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-xxl}"
    padding: "{spacing.3xl} {spacing.3xl}"
  content-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.3xl} {spacing.3xl}"
  category-card-purple:
    backgroundColor: "{colors.accent-purple}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  category-card-blue:
    backgroundColor: "{colors.accent-blue}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  category-card-orange:
    backgroundColor: "{colors.accent-orange}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  category-card-green:
    backgroundColor: "{colors.accent-green}"
    textColor: "{colors.primary}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  category-card-pink:
    backgroundColor: "{colors.accent-pink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body-mid}"
    typography: "{typography.body-sm}"
    padding: "{spacing.3xl} {spacing.3xl}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface."
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  ex-pricing-tier-featured:
    description: "Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode)."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  ex-product-selector:
    description: "What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  ex-cart-drawer:
    description: "Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.2xl}"
    item-divider: "{colors.hairline}"
  ex-app-shell-row:
    description: "Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  ex-data-table-cell:
    description: "Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm."
    headerBackground: "{colors.canvas}"
    headerTypography: "{typography.caption}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.md} {spacing.lg}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as feature-card with elevated shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
  ex-empty-state-card:
    description: "Empty-state illustration frame."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — feature-card shape + medium shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.lg}"
    typography: "{typography.body-sm}"

---


## Overview

Webflow positions itself as the visual web development platform — the marketing surface reads as a confident professional product, not a tech startup. The default page is a generous white canvas (`{colors.canvas}`) with a deep near-black `{colors.primary}` (`#080808`) for the brand''s primary CTA, typography, and ink. Around this restrained primary, the brand layers a five-stop chromatic accent system — `{colors.accent-purple}` `#7a3dff`, `{colors.accent-pink}` `#ed52cb`, `{colors.accent-blue}` `#3b89ff`, `{colors.accent-orange}` `#ff6b00`, `{colors.accent-green}` `#00d722` — each mapped to one of the platform''s product categories (design, CMS, hosting, ecommerce, etc.). These accents appear as full-card fills inside the product-category grid, not as button colours; the brand''s primary CTA stays near-black.

Type carries the second decisive voice. The proprietary `WF Visual Sans Variable` family carries every display, body, and label role at weight 500 / 600 — the brand never goes heavier than semibold, never lighter than regular. Hero display sits at 80 px / weight 600 / `-0.8 px` tracking — confident but not shouting. Uppercase eyebrows in 15 px weight 500 with `1.5 px` positive tracking mark every section header.

The shape system is restrained. Buttons take a tight `{rounded.sm}` 4 px radius — neither pill nor square; the brand reads as engineered. Cards step up to `{rounded.md}` 8 px. Pill (`{rounded.full}` 9999 px) is reserved for circular icon containers. Layered drop-shadows on featured cards add modest elevation but never feel material-heavy.

**Key Characteristics:**
- A two-colour conversion hierarchy — `{colors.primary}` near-black for every primary CTA, white-on-hairline for every secondary. Chromatic accents are used as full surface fills on category cards, never as button backgrounds.
- The brand''s signature is its **five-stop chromatic category palette**: purple / pink / blue / orange / green, each tied to a product surface. Used at full saturation as card fills.
- Hero typography at 80 px weight 600 with `-0.8 px` tracking — restrained, confident, never billboard-loud.
- WF Visual Sans Variable is the single family; the brand uses no separate sans for body / display. WFVisualSans-Mono / Inconsolata appears only for technical captions.
- Tight `{rounded.sm}` 4 px button geometry; cards at `{rounded.md}` 8 px. The brand never uses pill CTAs.
- Layered multi-offset drop-shadows on featured cards — the brand''s only elevation cue.

## Colors

### Brand & Accent
- **Ink Black** (`{colors.primary}` — `#080808`): The brand''s primary conversion colour. Every primary CTA, every heading, every wordmark. Deeper than pure black to read as branded.
- **Accent Purple** (`{colors.accent-purple}` — `#7a3dff`): One of the five chromatic category accents — used for design / build product surfaces.
- **Accent Pink** (`{colors.accent-pink}` — `#ed52cb`): Magenta accent — used for animation / interaction product surfaces.
- **Accent Blue** (`{colors.accent-blue}` — `#3b89ff`): Bright cyan-blue — used for SEO / analytics product surfaces.
- **Accent Blue Deep** (`{colors.accent-blue-deep}` — `#006acc`): The deeper blue used for emphasis links.
- **Accent Blue Info** (`{colors.accent-blue-info}` — `#146ef5`): The badge-info blue.
- **Accent Orange** (`{colors.accent-orange}` — `#ff6b00`): Used for hosting / infrastructure product surfaces.
- **Accent Green** (`{colors.accent-green}` — `#00d722`): Used for ecommerce / status-success surfaces.
- **Accent Yellow** (`{colors.accent-yellow}` — `#ffae13`): Used for warning / collaboration product surfaces.
- **Accent Red** (`{colors.accent-red}` — `#ee1d36`): Used for error / destructive states.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default page background.
- **Hairline** (`{colors.hairline}` — `#d8d8d8`): 1 px solid borders — input borders, card chrome, divider lines.

### Text
- **Ink** (`{colors.ink}` — `#080808`): Default text and headings.
- **Ink Strong** (`{colors.ink-strong}` — `#222222`): Near-black emphasis.
- **Body** (`{colors.body}` — `#363636`): Default body paragraph color.
- **Body Mid** (`{colors.body-mid}` — `#5a5a5a`): Mid-emphasis secondary text — footer lines, captions.
- **Mute** (`{colors.mute}` — `#898989`): Lower-priority text.
- **Mute Soft** (`{colors.mute-soft}` — `#ababab`): The lightest text role — placeholder text, fine print.

### Semantic
- **Info Blue** (`{colors.accent-blue-info}` — `#146ef5`): Info badge / notification.
- **Success Green** (`{colors.accent-green}` — `#00d722`): Success indicators.
- **Warning Yellow** (`{colors.accent-yellow}` — `#ffae13`): Warning states.
- **Error Red** (`{colors.accent-red}` — `#ee1d36`): Validation / destructive.

## Typography

### Font Family
A single proprietary family carries every typographic role: **WF Visual Sans Variable** (with `Arial` system fallback). Weights 400 / 500 / 550 / 600 are present; the brand never uses 700 / 800 / 900. A monospace variant — **WFVisualSans-Mono** with `Inconsolata` fallback — handles rare technical caption moments and code-style labels. OpenType features `"ss02"`, `"ss10"`, `"zero"` are enabled in the mono variant for the styled zero glyph.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 80px | 600 | 83.2px | -0.8px | Hero headline. |
| `{typography.display-xl}` | 56px | 600 | 58.24px | 0 | Sub-hero displays. |
| `{typography.display-lg}` | 44.8px | 600 | 46.6px | 0 | Section headlines. |
| `{typography.display-md}` | 32px | 500 | 41.6px | 0 | Card-cluster headlines. |
| `{typography.display-sm}` | 24px | 500 | 31.2px | 0 | Sub-section displays. |
| `{typography.display-xs}` | 20px | 500 | 28px | 0 | Inline display micro-headings. |
| `{typography.eyebrow-uppercase}` | 15px | 500 | 19.5px | 1.5px | UPPERCASE eyebrow tags above sections. |
| `{typography.eyebrow-uppercase-sm}` | 12px | 500 | 12px | 0.6px | Small uppercase metadata. |
| `{typography.body-lg}` | 28.8px | 400 | 46.08px | -0.288px | Lead paragraphs. |
| `{typography.body-md}` | 16px | 400 | 25.6px | -0.16px | Default body. |
| `{typography.body-md-strong}` | 16px | 500 | 25.6px | -0.16px | Bolded inline body. |
| `{typography.body-sm}` | 14px | 400 | 22.4px | 0 | Secondary body. |
| `{typography.body-sm-strong}` | 14px | 500 | 22.4px | 0 | Bold caption / nav-link. |
| `{typography.caption}` | 12.8px | 550 | 15.36px | 0 | Badge labels (the brand''s signature 550 weight). |
| `{typography.caption-mono}` | 12px | 400 | 18px | 0 | Mono code captions. |
| `{typography.button-md}` | 16px | 500 | 25.6px | -0.16px | Button labels. |

### Principles
- **Weight ceiling at 600.** The brand never uses 700+. Confident, not loud.
- **Negative tracking at display sizes.** `-0.8 px` at 80 px, scaling through. Tight kerning is part of the voice.
- **Uppercase eyebrows mark every section.** 15 px / weight 500 / `1.5 px` positive tracking is the brand''s signature label style.
- **Single family across the system.** No separate display vs body face. The variable axes do the work.

### Note on Font Substitutes
WF Visual Sans Variable is proprietary. Open-source substitutes:
- **Display + body** — *Inter* weights 400 / 500 / 600 with `font-feature-settings: "ss01"` enabled is the closest stylistic match.
- **Mono** — *Inconsolata* (the documented fallback) or *DM Mono*.

## Layout

### Spacing System
- **Base unit**: 4 px (with frequent 0.4 / 0.8 sub-multiples for fine padding).
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px.
- **Section padding**: hero / content bands use `{spacing.3xl}` 32 px gutters with generous vertical spacing.
- **Card interior padding**: feature and pricing cards sit at `{spacing.3xl}` 32 px.

### Grid & Container
- Marketing container is wide (effectively edge-to-edge with `{spacing.3xl}` gutters).
- Category card grid: 2 / 3-up at desktop with mixed sizing (some larger feature cards span 2 columns).
- Pricing tier grid: 3-up at desktop, 1-up at mobile.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 479px | Hero stacks; all grids 1-up. |
| Mobile-Large | 479–767px | Same as Mobile. |
| Tablet | 768–991px | 2-up grids. |
| Desktop | ≥ 992px | Full multi-up grids. |

#### Touch Targets
Buttons render at ~44 px (12 px vertical padding + 25.6 px line-height). WCAG AAA met.

#### Collapsing Strategy
- Nav: full link row at desktop. Hamburger at mobile.
- Category card grid: 2 / 3 / 4-up at desktop, drops to 1-up at mobile.
- Pricing tier: 3 / 4-up at desktop, 1-up at mobile.

#### Image Behavior
- Category cards: full-bleed solid colour fills (no photography).
- Product screenshots: 16:9 inside `{rounded.md}` card chrome.
- No portrait imagery in the marketing surface.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default bands. |
| Level 1 — Hairline | 1 px solid `{colors.hairline}` border on `{colors.canvas}`. | Default card chrome and input borders. |
| Level 2 — Layered Drop | Multi-stop layered shadow with subtle warm offsets — `0 84px 24px rgba(0,0,0,0), 0 54px 22px rgba(0,0,0,0.01), 0 30px 18px rgba(0,0,0,0.04), 0 13px 13px rgba(0,0,0,0.08), 0 3px 7px rgba(0,0,0,0.09)`. | Featured cards needing visible lift. |
| Level 3 — Layered Drop Strong | Deeper version of Level 2 with `0.12` final offset opacity. | Pricing / modal-level emphasis. |
| Level 4 — Heavy Modal | Extremely heavy multi-stop — `0 24px 24px rgba(0,0,0,0.26), 0 6px 13px rgba(0,0,0,0.29)` final stops. | Modal / dialog surfaces. |

### Decorative Depth
- The chromatic category cards (full-saturation purple / pink / blue / orange / green fills) provide visual depth through pure colour contrast against the white canvas.
- Layered shadow recipes are the brand''s only true atmospheric effect — they''re 5-stop drop-shadow stacks with very low individual opacities.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands. |
| `{rounded.xs}` | 2px | Tight inline pills. |
| `{rounded.sm}` | 4px | The brand''s canonical button + badge + small-element radius. |
| `{rounded.md}` | 8px | Card chrome and feature / category cards. |
| `{rounded.full}` | 9999px | Circular icon containers only. |

## Components

### Buttons

**`button-primary`** — the canonical near-black CTA.
- Background `{colors.primary}` (`#080808`), text `{colors.on-primary}` white, label `{typography.button-md}` (16 px weight 500), padding `{spacing.md} {spacing.xl}`, shape `{rounded.sm}` 4 px.

**`button-secondary`** — the white outline CTA.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, same typography + padding + shape.

**`button-text-arrow`** — the underlined text-link CTA with arrow used in long-form sections.
- Background `{colors.canvas}`, text `{colors.ink}`, no border, body in `{typography.button-md}`, padding `{spacing.xl}` 0.

**`button-icon-circular`** — the circular icon button for carousel controls.
- Background `{colors.canvas}`, ink icon, shape `{rounded.full}`.

### Cards & Containers

**`card-feature`** — the canonical feature card on canvas.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, padding `{spacing.3xl}`, shape `{rounded.md}`. Often elevated to Level 2 shadow when featured.

**`card-feature-dark`** — the polarity-flipped feature card on near-black.
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.3xl}`, shape `{rounded.md}`.

**`card-pricing`** — the pricing-tier card.
- Background `{colors.canvas}`, text `{colors.ink}`, hairline border, padding `{spacing.3xl}`, shape `{rounded.md}`. Layered shadow on the featured tier.

### Inputs & Forms

**`text-input`** — the canonical text input.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, body in `{typography.body-md}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.sm}`.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.lg} {spacing.3xl}`.

**`nav-link`** — link items inside `nav-bar`.
- Text `{colors.ink}`, set in `{typography.body-sm-strong}`.

**`footer`** — the footer band.
- Background `{colors.canvas}`, text `{colors.body-mid}`, padding `{spacing.3xl} {spacing.3xl}`. Body in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — the white hero band.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.3xl}`. Headline in `{typography.display-xxl}` (80 px weight 600).

**`hero-band-dark`** — the polarity-flipped near-black hero band (used on some campaign pages).
- Background `{colors.primary}`, text `{colors.on-primary}`, same padding / headline scale.

**`content-band`** — the standard content band on canvas.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.3xl}`. Section headline in `{typography.display-lg}`.

**`category-card-purple`** — full-fill purple category card.
- Background `{colors.accent-purple}`, text white, padding `{spacing.3xl}`, shape `{rounded.md}`.

**`category-card-pink`** — full-fill pink category card.
- Background `{colors.accent-pink}`, text white, padding `{spacing.3xl}`, shape `{rounded.md}`.

**`category-card-blue`** — full-fill blue category card.
- Background `{colors.accent-blue}`, text white, padding `{spacing.3xl}`, shape `{rounded.md}`.

**`category-card-orange`** — full-fill orange category card.
- Background `{colors.accent-orange}`, text white, padding `{spacing.3xl}`, shape `{rounded.md}`.

**`category-card-green`** — full-fill green category card (uses ink text for legibility against the lighter green).
- Background `{colors.accent-green}`, text `{colors.primary}` (ink), padding `{spacing.3xl}`, shape `{rounded.md}`.

**`badge-info`** + **`badge-info-soft`** — info badges in solid blue or soft outline.
- Filled: bg `{colors.accent-blue-info}` text white. Soft: bg canvas, text `{colors.accent-blue-info}`. Both at `{typography.caption}` (12.8 px weight 550) — the brand''s signature 550-weight caption.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (`#080808`) for every primary CTA, every heading, and every wordmark. Near-black is the conversion colour.
- Use the five chromatic accents (purple / pink / blue / orange / green) as full-fill category cards, NOT as button backgrounds.
- Set hero headlines in `{typography.display-xxl}` weight 600 with `-0.8 px` tracking.
- Pair the proprietary WF Visual Sans family across every typographic role.
- Use `{rounded.sm}` 4 px for buttons, `{rounded.md}` 8 px for cards. The brand never uses pill CTAs.
- Use layered multi-stop drop-shadows on featured cards — the brand''s distinctive elevation recipe.

### Don''t
- Don''t promote button-medium weight to 700+. The brand''s weight ceiling is 600.
- Don''t use chromatic accents as button backgrounds. They''re surface fills, not actions.
- Don''t render CTAs as pills. The brand''s button geometry is tight 4 px rectangle.
- Don''t introduce a sixth accent colour. The 5-stop palette is the system.
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

Webflow positions itself as the visual web development platform — the marketing surface reads as a confident professional product, not a tech startup. The default page is a generous white canvas (`{colors.canvas}`) with a deep near-black `{colors.primary}` (`#080808`) for the brand''s primary CTA, typography, and ink. Around this restrained primary, the brand layers a five-stop chromatic accent system — `{colors.accent-purple}` `#7a3dff`, `{colors.accent-pink}` `#ed52cb`, `{colors.accent-blue}` `#3b89ff`, `{colors.accent-orange}` `#ff6b00`, `{colors.accent-green}` `#00d722` — each mapped to one of the platform''s product categories (design, CMS, hosting, ecommerce, etc.). These accents appear as full-card fills inside the product-category grid, not as button colours; the brand''s primary CTA stays near-black.

Type carries the second decisive voice. The proprietary `WF Visual Sans Variable` family carries every display, body, and label role at weight 500 / 600 — the brand never goes heavier than semibold, never lighter than regular. Hero display sits at 80 px / weight 600 / `-0.8 px` tracking — confident but not shouting. Uppercase eyebrows in 15 px weight 500 with `1.5 px` positive tracking mark every section header.

The shape system is restrained. Buttons take a tight `{rounded.sm}` 4 px radius — neither pill nor square; the brand reads as engineered. Cards step up to `{rounded.md}` 8 px. Pill (`{rounded.full}` 9999 px) is reserved for circular icon containers. Layered drop-shadows on featured cards add modest elevation but never feel material-heavy.

**Key Characteristics:**
- A two-colour conversion hierarchy — `{colors.primary}` near-black for every primary CTA, white-on-hairline for every secondary. Chromatic accents are used as full surface fills on category cards, never as button backgrounds.
- The brand''s signature is its **five-stop chromatic category palette**: purple / pink / blue / orange / green, each tied to a product surface. Used at full saturation as card fills.
- Hero typography at 80 px weight 600 with `-0.8 px` tracking — restrained, confident, never billboard-loud.
- WF Visual Sans Variable is the single family; the brand uses no separate sans for body / display. WFVisualSans-Mono / Inconsolata appears only for technical captions.
- Tight `{rounded.sm}` 4 px button geometry; cards at `{rounded.md}` 8 px. The brand never uses pill CTAs.
- Layered multi-offset drop-shadows on featured cards — the brand''s only elevation cue.', '{"sourcePath":"docs/design-md/webflow/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Ink Black** (`{colors.primary}` — `#080808`): The brand''s primary conversion colour. Every primary CTA, every heading, every wordmark. Deeper than pure black to read as branded.
- **Accent Purple** (`{colors.accent-purple}` — `#7a3dff`): One of the five chromatic category accents — used for design / build product surfaces.
- **Accent Pink** (`{colors.accent-pink}` — `#ed52cb`): Magenta accent — used for animation / interaction product surfaces.
- **Accent Blue** (`{colors.accent-blue}` — `#3b89ff`): Bright cyan-blue — used for SEO / analytics product surfaces.
- **Accent Blue Deep** (`{colors.accent-blue-deep}` — `#006acc`): The deeper blue used for emphasis links.
- **Accent Blue Info** (`{colors.accent-blue-info}` — `#146ef5`): The badge-info blue.
- **Accent Orange** (`{colors.accent-orange}` — `#ff6b00`): Used for hosting / infrastructure product surfaces.
- **Accent Green** (`{colors.accent-green}` — `#00d722`): Used for ecommerce / status-success surfaces.
- **Accent Yellow** (`{colors.accent-yellow}` — `#ffae13`): Used for warning / collaboration product surfaces.
- **Accent Red** (`{colors.accent-red}` — `#ee1d36`): Used for error / destructive states.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default page background.
- **Hairline** (`{colors.hairline}` — `#d8d8d8`): 1 px solid borders — input borders, card chrome, divider lines.

### Text
- **Ink** (`{colors.ink}` — `#080808`): Default text and headings.
- **Ink Strong** (`{colors.ink-strong}` — `#222222`): Near-black emphasis.
- **Body** (`{colors.body}` — `#363636`): Default body paragraph color.
- **Body Mid** (`{colors.body-mid}` — `#5a5a5a`): Mid-emphasis secondary text — footer lines, captions.
- **Mute** (`{colors.mute}` — `#898989`): Lower-priority text.
- **Mute Soft** (`{colors.mute-soft}` — `#ababab`): The lightest text role — placeholder text, fine print.

### Semantic
- **Info Blue** (`{colors.accent-blue-info}` — `#146ef5`): Info badge / notification.
- **Success Green** (`{colors.accent-green}` — `#00d722`): Success indicators.
- **Warning Yellow** (`{colors.accent-yellow}` — `#ffae13`): Warning states.
- **Error Red** (`{colors.accent-red}` — `#ee1d36`): Validation / destructive.', '{"sourcePath":"docs/design-md/webflow/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
A single proprietary family carries every typographic role: **WF Visual Sans Variable** (with `Arial` system fallback). Weights 400 / 500 / 550 / 600 are present; the brand never uses 700 / 800 / 900. A monospace variant — **WFVisualSans-Mono** with `Inconsolata` fallback — handles rare technical caption moments and code-style labels. OpenType features `"ss02"`, `"ss10"`, `"zero"` are enabled in the mono variant for the styled zero glyph.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 80px | 600 | 83.2px | -0.8px | Hero headline. |
| `{typography.display-xl}` | 56px | 600 | 58.24px | 0 | Sub-hero displays. |
| `{typography.display-lg}` | 44.8px | 600 | 46.6px | 0 | Section headlines. |
| `{typography.display-md}` | 32px | 500 | 41.6px | 0 | Card-cluster headlines. |
| `{typography.display-sm}` | 24px | 500 | 31.2px | 0 | Sub-section displays. |
| `{typography.display-xs}` | 20px | 500 | 28px | 0 | Inline display micro-headings. |
| `{typography.eyebrow-uppercase}` | 15px | 500 | 19.5px | 1.5px | UPPERCASE eyebrow tags above sections. |
| `{typography.eyebrow-uppercase-sm}` | 12px | 500 | 12px | 0.6px | Small uppercase metadata. |
| `{typography.body-lg}` | 28.8px | 400 | 46.08px | -0.288px | Lead paragraphs. |
| `{typography.body-md}` | 16px | 400 | 25.6px | -0.16px | Default body. |
| `{typography.body-md-strong}` | 16px | 500 | 25.6px | -0.16px | Bolded inline body. |
| `{typography.body-sm}` | 14px | 400 | 22.4px | 0 | Secondary body. |
| `{typography.body-sm-strong}` | 14px | 500 | 22.4px | 0 | Bold caption / nav-link. |
| `{typography.caption}` | 12.8px | 550 | 15.36px | 0 | Badge labels (the brand''s signature 550 weight). |
| `{typography.caption-mono}` | 12px | 400 | 18px | 0 | Mono code captions. |
| `{typography.button-md}` | 16px | 500 | 25.6px | -0.16px | Button labels. |

### Principles
- **Weight ceiling at 600.** The brand never uses 700+. Confident, not loud.
- **Negative tracking at display sizes.** `-0.8 px` at 80 px, scaling through. Tight kerning is part of the voice.
- **Uppercase eyebrows mark every section.** 15 px / weight 500 / `1.5 px` positive tracking is the brand''s signature label style.
- **Single family across the system.** No separate display vs body face. The variable axes do the work.

### Note on Font Substitutes
WF Visual Sans Variable is proprietary. Open-source substitutes:
- **Display + body** — *Inter* weights 400 / 500 / 600 with `font-feature-settings: "ss01"` enabled is the closest stylistic match.
- **Mono** — *Inconsolata* (the documented fallback) or *DM Mono*.', '{"sourcePath":"docs/design-md/webflow/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4 px (with frequent 0.4 / 0.8 sub-multiples for fine padding).
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px.
- **Section padding**: hero / content bands use `{spacing.3xl}` 32 px gutters with generous vertical spacing.
- **Card interior padding**: feature and pricing cards sit at `{spacing.3xl}` 32 px.

### Grid & Container
- Marketing container is wide (effectively edge-to-edge with `{spacing.3xl}` gutters).
- Category card grid: 2 / 3-up at desktop with mixed sizing (some larger feature cards span 2 columns).
- Pricing tier grid: 3-up at desktop, 1-up at mobile.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 479px | Hero stacks; all grids 1-up. |
| Mobile-Large | 479–767px | Same as Mobile. |
| Tablet | 768–991px | 2-up grids. |
| Desktop | ≥ 992px | Full multi-up grids. |

#### Touch Targets
Buttons render at ~44 px (12 px vertical padding + 25.6 px line-height). WCAG AAA met.

#### Collapsing Strategy
- Nav: full link row at desktop. Hamburger at mobile.
- Category card grid: 2 / 3 / 4-up at desktop, drops to 1-up at mobile.
- Pricing tier: 3 / 4-up at desktop, 1-up at mobile.

#### Image Behavior
- Category cards: full-bleed solid colour fills (no photography).
- Product screenshots: 16:9 inside `{rounded.md}` card chrome.
- No portrait imagery in the marketing surface.', '{"sourcePath":"docs/design-md/webflow/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default bands. |
| Level 1 — Hairline | 1 px solid `{colors.hairline}` border on `{colors.canvas}`. | Default card chrome and input borders. |
| Level 2 — Layered Drop | Multi-stop layered shadow with subtle warm offsets — `0 84px 24px rgba(0,0,0,0), 0 54px 22px rgba(0,0,0,0.01), 0 30px 18px rgba(0,0,0,0.04), 0 13px 13px rgba(0,0,0,0.08), 0 3px 7px rgba(0,0,0,0.09)`. | Featured cards needing visible lift. |
| Level 3 — Layered Drop Strong | Deeper version of Level 2 with `0.12` final offset opacity. | Pricing / modal-level emphasis. |
| Level 4 — Heavy Modal | Extremely heavy multi-stop — `0 24px 24px rgba(0,0,0,0.26), 0 6px 13px rgba(0,0,0,0.29)` final stops. | Modal / dialog surfaces. |

### Decorative Depth
- The chromatic category cards (full-saturation purple / pink / blue / orange / green fills) provide visual depth through pure colour contrast against the white canvas.
- Layered shadow recipes are the brand''s only true atmospheric effect — they''re 5-stop drop-shadow stacks with very low individual opacities.', '{"sourcePath":"docs/design-md/webflow/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands. |
| `{rounded.xs}` | 2px | Tight inline pills. |
| `{rounded.sm}` | 4px | The brand''s canonical button + badge + small-element radius. |
| `{rounded.md}` | 8px | Card chrome and feature / category cards. |
| `{rounded.full}` | 9999px | Circular icon containers only. |', '{"sourcePath":"docs/design-md/webflow/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — the canonical near-black CTA.
- Background `{colors.primary}` (`#080808`), text `{colors.on-primary}` white, label `{typography.button-md}` (16 px weight 500), padding `{spacing.md} {spacing.xl}`, shape `{rounded.sm}` 4 px.

**`button-secondary`** — the white outline CTA.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, same typography + padding + shape.

**`button-text-arrow`** — the underlined text-link CTA with arrow used in long-form sections.
- Background `{colors.canvas}`, text `{colors.ink}`, no border, body in `{typography.button-md}`, padding `{spacing.xl}` 0.

**`button-icon-circular`** — the circular icon button for carousel controls.
- Background `{colors.canvas}`, ink icon, shape `{rounded.full}`.

### Cards & Containers

**`card-feature`** — the canonical feature card on canvas.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, padding `{spacing.3xl}`, shape `{rounded.md}`. Often elevated to Level 2 shadow when featured.

**`card-feature-dark`** — the polarity-flipped feature card on near-black.
- Background `{colors.primary}`, text `{colors.on-primary}`, padding `{spacing.3xl}`, shape `{rounded.md}`.

**`card-pricing`** — the pricing-tier card.
- Background `{colors.canvas}`, text `{colors.ink}`, hairline border, padding `{spacing.3xl}`, shape `{rounded.md}`. Layered shadow on the featured tier.

### Inputs & Forms

**`text-input`** — the canonical text input.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, body in `{typography.body-md}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.sm}`.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.lg} {spacing.3xl}`.

**`nav-link`** — link items inside `nav-bar`.
- Text `{colors.ink}`, set in `{typography.body-sm-strong}`.

**`footer`** — the footer band.
- Background `{colors.canvas}`, text `{colors.body-mid}`, padding `{spacing.3xl} {spacing.3xl}`. Body in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — the white hero band.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.3xl}`. Headline in `{typography.display-xxl}` (80 px weight 600).

**`hero-band-dark`** — the polarity-flipped near-black hero band (used on some campaign pages).
- Background `{colors.primary}`, text `{colors.on-primary}`, same padding / headline scale.

**`content-band`** — the standard content band on canvas.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.3xl}`. Section headline in `{typography.display-lg}`.

**`category-card-purple`** — full-fill purple category card.
- Background `{colors.accent-purple}`, text white, padding `{spacing.3xl}`, shape `{rounded.md}`.

**`category-card-pink`** — full-fill pink category card.
- Background `{colors.accent-pink}`, text white, padding `{spacing.3xl}`, shape `{rounded.md}`.

**`category-card-blue`** — full-fill blue category card.
- Background `{colors.accent-blue}`, text white, padding `{spacing.3xl}`, shape `{rounded.md}`.

**`category-card-orange`** — full-fill orange category card.
- Background `{colors.accent-orange}`, text white, padding `{spacing.3xl}`, shape `{rounded.md}`.

**`category-card-green`** — full-fill green category card (uses ink text for legibility against the lighter green).
- Background `{colors.accent-green}`, text `{colors.primary}` (ink), padding `{spacing.3xl}`, shape `{rounded.md}`.

**`badge-info`** + **`badge-info-soft`** — info badges in solid blue or soft outline.
- Filled: bg `{colors.accent-blue-info}` text white. Soft: bg canvas, text `{colors.accent-blue-info}`. Both at `{typography.caption}` (12.8 px weight 550) — the brand''s signature 550-weight caption.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`', '{"sourcePath":"docs/design-md/webflow/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (`#080808`) for every primary CTA, every heading, and every wordmark. Near-black is the conversion colour.
- Use the five chromatic accents (purple / pink / blue / orange / green) as full-fill category cards, NOT as button backgrounds.
- Set hero headlines in `{typography.display-xxl}` weight 600 with `-0.8 px` tracking.
- Pair the proprietary WF Visual Sans family across every typographic role.
- Use `{rounded.sm}` 4 px for buttons, `{rounded.md}` 8 px for cards. The brand never uses pill CTAs.
- Use layered multi-stop drop-shadows on featured cards — the brand''s distinctive elevation recipe.

### Don''t
- Don''t promote button-medium weight to 700+. The brand''s weight ceiling is 600.
- Don''t use chromatic accents as button backgrounds. They''re surface fills, not actions.
- Don''t render CTAs as pills. The brand''s button geometry is tight 4 px rectangle.
- Don''t introduce a sixth accent colour. The 5-stop palette is the system.', '{"sourcePath":"docs/design-md/webflow/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_1', '#080808', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_3', '#222222', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_4', '#363636', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_5', '#5a5a5a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_6', '#898989', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_7', '#ababab', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_8', '#d8d8d8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_9', '#7a3dff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_10', '#ed52cb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_11', '#3b89ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_12', '#006acc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_13', '#146ef5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_14', '#ff6b00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_15', '#00d722', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_16', '#ffae13', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md'), 'color', 'color_17', '#ee1d36', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/webflow/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/webflow/DESIGN.md';

