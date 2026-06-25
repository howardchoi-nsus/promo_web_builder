-- Generated seed chunk 04
-- Run 000_prepare.sql once before running these chunks.
-- Documents: 10


-- Meta
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Meta', 'meta', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/meta/DESIGN.md', null, 'seeded', '---
version: alpha
name: Meta-design-analysis
description: Meta''s design system spans hardware commerce (Quest VR, Ray-Ban Meta AI glasses) and brand surfaces with a confident product-merchandising voice. The system pairs a stark white canvas with full-bleed photographic product cards, a confident Optimistic VF wordmark/headline face, dual-CTA hero patterns (black primary + outlined secondary), and a saturated cobalt blue (#0064E0) for in-product purchase actions. Pill-shaped 100px-radius buttons, generous 24-32px card rounding, and tight three-tier text hierarchy carry across homepage, product detail (PDP), buy-now configurator, and accessory subpages.

colors:
  primary: "#0064e0"
  primary-deep: "#0457cb"
  primary-soft: "#0091ff"
  on-primary: "#ffffff"
  ink-button: "#000000"
  on-ink-button: "#ffffff"
  fb-blue: "#1876f2"
  meta-link: "#385898"
  oculus-purple: "#a121ce"
  success: "#31a24c"
  success-bg: "#24e400"
  attention: "#f2a918"
  warning: "#f7b928"
  warning-bg: "#ffe200"
  critical: "#e41e3f"
  critical-strong: "#f0284a"
  canvas: "#ffffff"
  surface-soft: "#f1f4f7"
  ink-deep: "#0a1317"
  ink: "#1c1e21"
  charcoal: "#444950"
  slate: "#4b4c4f"
  steel: "#5d6c7b"
  stone: "#8595a4"
  hairline: "#ced0d4"
  hairline-soft: "#dee3e9"
  disabled-text: "#bcc0c4"

typography:
  hero-display:
    fontFamily: Optimistic VF
    fontSize: 64px
    fontWeight: 500
    lineHeight: 1.16
    fontFeature: "ss01, ss02"
  display-lg:
    fontFamily: Optimistic VF
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.17
    fontFeature: "ss01, ss02"
  heading-lg:
    fontFamily: Optimistic VF
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.28
    fontFeature: "ss01, ss02"
  heading-md:
    fontFamily: Optimistic VF
    fontSize: 28px
    fontWeight: 300
    lineHeight: 1.21
    fontFeature: "ss01, ss02"
  heading-sm:
    fontFamily: Optimistic VF
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.25
    fontFeature: "ss01, ss02"
  subtitle-lg:
    fontFamily: Optimistic VF
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.44
  subtitle-md:
    fontFamily: Optimistic VF
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.44
  body-md-bold:
    fontFamily: Optimistic VF
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.50
    letterSpacing: -0.16px
  body-md:
    fontFamily: Optimistic VF
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.16px
  body-sm-bold:
    fontFamily: Optimistic VF
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.43
    letterSpacing: -0.14px
  body-sm:
    fontFamily: Optimistic VF
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: -0.14px
  caption-bold:
    fontFamily: Optimistic VF
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.33
  caption:
    fontFamily: Optimistic VF
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
  button-md:
    fontFamily: Optimistic VF
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.43
    letterSpacing: -0.14px
  link-md:
    fontFamily: Optimistic VF
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.50
    letterSpacing: -0.16px

rounded:
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 16px
  xxl: 24px
  xxxl: 32px
  feature: 40px
  full: 100px
  circle: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 10px
  md: 12px
  base: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section-sm: 48px
  section: 64px
  section-lg: 80px
  hero: 120px

components:
  button-primary:
    backgroundColor: "{colors.ink-button}"
    textColor: "{colors.on-ink-button}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "14px 30px"
  button-primary-pressed:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.on-ink-button}"
  button-primary-disabled:
    backgroundColor: "{colors.disabled-text}"
    textColor: "{colors.canvas}"
  button-buy-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "14px 30px"
  button-buy-cta-pressed:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-deep}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "12px 28px"
    border: "2px solid {colors.ink-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-deep}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 22px"
    border: "2px solid rgba(10, 19, 23, 0.12)"
  button-pill-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-bold}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    border: "1px solid {colors.hairline}"
  button-pill-tab-active:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.canvas}"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    size: 40px
  card-product-feature:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xxxl}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline-soft}"
  card-feature-photo:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xxxl}"
    padding: "0"
    border: "none"
  card-promo-strip:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.xxxl}"
    padding: "{spacing.section}"
  card-icon-feature:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-checkout-summary:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline-soft}"
    shadow: "rgba(20, 22, 26, 0.3) 0px 1px 4px 0px"
  product-thumbnail:
    backgroundColor: "{colors.surface-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.base}"
    aspect-ratio: "1 / 1"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline}"
    height: 44px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.fb-blue}"
  text-input-error:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.critical-strong}"
  search-pill:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.md} {spacing.lg}"
    height: 40px
  radio-option:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px solid rgba(10, 19, 23, 0.12)"
  radio-option-selected:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    border: "2px solid #0143b5"
  color-swatch-circle:
    rounded: "{rounded.circle}"
    size: 32px
    border: "2px solid {colors.canvas}"
  badge-promo-yellow:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.ink-deep}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-attention:
    backgroundColor: "{colors.attention}"
    textColor: "{colors.canvas}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.canvas}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-critical:
    backgroundColor: "{colors.critical}"
    textColor: "{colors.canvas}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  promo-banner:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-sm-bold}"
    padding: "{spacing.md} {spacing.xl}"
  faq-accordion-item:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline-soft}"
  why-buy-tile:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl} {spacing.xl}"
    border: "1px solid {colors.hairline-soft}"
  warranty-card:
    backgroundColor: "{colors.surface-soft}"
    rounded: "{rounded.xxl}"
    padding: "{spacing.xxl}"
  footer-region:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.section} {spacing.xxl}"
    border: "1px solid {colors.hairline-soft}"
  hero-band-marketing:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.canvas}"
    typography: "{typography.hero-display}"
    rounded: "{rounded.xxxl}"
    padding: "{spacing.section-lg}"
  product-gallery-pdp:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xxxl}"
    padding: "{spacing.base}"
  color-sku-picker-row:
    backgroundColor: "{colors.surface-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.base}"
  feature-icon-row:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline-soft}"
  tech-specs-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.hairline-soft}"
  testimonial-customer-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline-soft}"
---

## Overview

Meta''s commerce surfaces (homepage, Quest configurator, Ray-Ban product detail, prescription page) read as a confident hardware merchandiser. The brand voice is photography-first: large, full-bleed product imagery dominates above-the-fold real estate, with white space and tight typographic hierarchy carrying the rest. The system has a recognizable dual-CTA pattern — a black pill-shaped primary on marketing surfaces shifting to a saturated cobalt blue ({colors.primary}) inside the buy-now flows, paired with an outlined ghost button for secondary navigation.

Optimistic VF — Meta''s variable display face — anchors the entire system, ranging from a 64px hero display down to a 12px caption. The face''s `ss01` and `ss02` stylistic sets are switched on across every heading role, contributing to the brand''s slightly humanist, friendly geometric character. Below 768px the system collapses cleanly: hero stacks, pill nav becomes a hamburger, three-up feature grids flatten to a single column, and product configurators drop their right-rail summary into a sticky bottom bar.

**Key Characteristics:**
- Stark white canvas ({colors.canvas}) carrying full-bleed product photography with `{rounded.xxxl}` (32px) corner softening on showcase tiles
- Two-tier primary button system: marketing CTAs use {colors.ink-button} pills; commerce CTAs use {colors.primary} cobalt pills inside buy-now panels
- Optimistic VF as the universal display + body face with consistent `ss01, ss02` OpenType features
- Pill-shaped buttons ({rounded.full}) and `{rounded.xxxl}`/`{rounded.feature}` cards as the dominant geometric signature
- Saturated promotional banners (yellow {colors.warning}, dark {colors.ink-deep}) used sparingly above the nav for time-bound offers
- Photographic feature cards with no card chrome (no border, no shadow) — the product imagery IS the surface treatment

## Colors

> Source pages: meta.com/ (homepage), /ai-glasses/ray-ban-meta-skyler-gen-2/ (PDP), /quest/quest-3s/buy-now/ (configurator), /ai-glasses/prescription/ (lens upsell). Token coverage was identical across all four pages — the design system is genuinely unified.

### Brand & Accent
- **Cobalt Primary** ({colors.primary}): The buy-now CTA color. Used on every "Add to cart", "Configure", "Pre-order" button inside the commerce flow and the right-rail purchase panel.
- **Deep Cobalt** ({colors.primary-deep}): Pressed-state and dark-surface variant of the cobalt primary; also the active link color.
- **Soft Cobalt** ({colors.primary-soft}): Translucent background tint for informational callouts (`{colors.primary-soft}` at 15% alpha).
- **Facebook Blue** ({colors.fb-blue}): Selected radio/checkbox state and inline form-control activation color.
- **Meta Link Blue** ({colors.meta-link}): Reserved for legacy navigation and footer link affordances.
- **Oculus Purple** ({colors.oculus-purple}): VR product accent — used inside Quest-branded surfaces for category emphasis.

### Surface
- **Canvas White** ({colors.canvas}): Page background and primary card surface.
- **Soft Cloud** ({colors.surface-soft}): Subtle product-thumbnail and warranty-card background; also the search-pill rest state.
- **Hairline Gray** ({colors.hairline}): 1px input border and form-control divider.
- **Hairline Soft** ({colors.hairline-soft}): Quieter divider used on cards, footer separators, and section breaks.

### Text
- **Deep Ink** ({colors.ink-deep}): Primary headline and body text on light surfaces.
- **Ink** ({colors.ink}): Standard body and secondary headline text.
- **Charcoal** ({colors.charcoal}): Tertiary body text and form-button labels.
- **Slate** ({colors.slate}): Section-header copy and supporting microcopy.
- **Steel** ({colors.steel}): Quieter caption text and footer link hierarchy.
- **Stone** ({colors.stone}): Disabled or de-emphasized labels.

### Semantic
- **Success** ({colors.success}): "In stock", "Free returns" affirmations.
- **Attention** ({colors.attention}): Mid-priority alerts and timed callouts.
- **Warning** ({colors.warning}): Promotional banners ("Get 25% off…") and limited-time tags.
- **Critical** ({colors.critical}): Validation errors, destructive feedback.
- **Critical Strong** ({colors.critical-strong}): Form-input error border and inline error labels.

## Typography

### Font Family
**Optimistic VF** is Meta''s proprietary variable display face. Fallbacks: Montserrat, Helvetica, Arial, Noto Sans. The variable axes carry from 300 (light heading-md, used for editorial intro headlines like "Look forward") through 500 (display, hero, heading-sm) up to 700 (subtitle, body emphasis, button labels). Stylistic sets `ss01` and `ss02` are switched on across every heading role — they soften the geometry and give the type a slightly humanist breathing.

A secondary Helvetica fallback chain is used for technical microcopy (12px) inside spec sheets and footer fine print.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | OpenType | Use |
|---|---|---|---|---|---|---|
| `{typography.hero-display}` | 64px | 500 | 1.16 | 0 | ss01, ss02 | Homepage hero ("Get 25% off…", category opener) |
| `{typography.display-lg}` | 48px | 500 | 1.17 | 0 | ss01, ss02 | Section-opener display ("Made for prescriptions. Built for comfort.") |
| `{typography.heading-lg}` | 36px | 500 | 1.28 | 0 | ss01, ss02 | Subsection headlines ("Why buy from Meta", "Tech specs") |
| `{typography.heading-md}` | 28px | 300 | 1.21 | 0 | ss01, ss02 | Editorial subheads in lighter weight ("Look forward", "Built for prescriptions") |
| `{typography.heading-sm}` | 24px | 500 | 1.25 | 0 | ss01, ss02 | Card titles, feature-tile headers |
| `{typography.subtitle-lg}` | 18px | 700 | 1.44 | 0 | — | Bold callouts, FAQ question titles |
| `{typography.subtitle-md}` | 18px | 400 | 1.44 | 0 | — | Body lead and longer-line subtitles |
| `{typography.body-md}` | 16px | 400 | 1.50 | -0.16px | — | Primary body text |
| `{typography.body-md-bold}` | 16px | 700 | 1.50 | -0.16px | — | Body emphasis and link-md |
| `{typography.body-sm}` | 14px | 400 | 1.43 | -0.14px | — | Secondary body, helper text |
| `{typography.body-sm-bold}` | 14px | 700 | 1.43 | -0.14px | — | Pill tab labels, footer headings |
| `{typography.caption-bold}` | 12px | 700 | 1.33 | 0 | — | Badge labels, timestamps |
| `{typography.caption}` | 12px | 400 | 1.33 | 0 | — | Footer fine print, legal microcopy |
| `{typography.button-md}` | 14px | 700 | 1.43 | -0.14px | — | Pill button labels |
| `{typography.link-md}` | 16px | 700 | 1.50 | -0.16px | — | Inline navigation links |

### Principles
- Negative letter-spacing on body roles (`-0.14px` to `-0.16px`) tightens the type fractionally — Optimistic VF was designed for this snug-but-not-condensed setting.
- Editorial subheads use the 300 weight to introduce visual rest between the 500-weight display headlines and the 400-weight body, creating a three-tier visual rhythm.
- All headings carry `ss01, ss02` stylistic sets together — the design treats them as a paired alternates package, never one without the other.
- Buttons, pill tabs, and footer headings share `{typography.body-sm-bold}` (14px / 700 / -0.14px), creating a tight visual relationship between interactive elements.

## Layout

### Spacing System
- **Base unit**: 4px increment with 8px as the dominant primary step.
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (10px) · `{spacing.md}` (12px) · `{spacing.base}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (80px) · `{spacing.hero}` (120px).
- **Section rhythm**: Marketing sections separate at `{spacing.section-lg}` (80px); product detail sections compress to `{spacing.section}` (64px); FAQ stacks tighten further to `{spacing.xxl}` (32px).
- **Card internal padding**: Standard `{spacing.xxl}` (32px); icon-feature tiles compress to `{spacing.xl}` (24px); promo-strip cards expand to `{spacing.section}` (64px) for hero presence.

### Grid & Container
- Marketing page max-width sits around 1280px with 32–48px gutters.
- The PDP layout uses a 2-column split: hero gallery (~58% width) + sticky purchase rail (~42%, with `max-width: 380px` on the rail).
- Three-up feature grids ("Why buy from Meta") use a 24px column gap; six-up product thumbnail rows (color/SKU pickers) use a 12px gap.

### Whitespace Philosophy
Whitespace is product-photography-first. Hero sections give product imagery 50–70% of the viewport height; copy is given oxygen to breathe in `{spacing.xxl}` to `{spacing.xxxl}` blocks above and below. Inside the configurator, whitespace tightens — the buy-now panel is information-dense, with `{spacing.base}` to `{spacing.lg}` rhythm between option groups.

## Elevation & Depth

The system runs predominantly flat. Elevation is reserved for two interaction layers:

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{rounded.xxxl}` rounding + `{colors.hairline-soft}` border | Default product cards, why-buy tiles |
| 1 (subtle) | `rgba(0, 0, 0, 0.2) 1px 1px 0px 0px` | Pill-tab activation indicator |
| 2 (sticky panel) | `rgba(20, 22, 26, 0.3) 0px 1px 4px 0px` | PDP right-rail purchase summary, sticky mobile checkout bar |

### Decorative Depth
- Photography-as-depth: full-bleed product imagery on `{rounded.xxxl}` cards creates atmospheric layering without shadows.
- Translucent overlays (`rgba(255, 255, 255, 0.1)` to `rgba(10, 19, 23, 0.12)`) cover dark hero photography to lift legibility of overlaid text.
- Decorative pastel tints inside accessory cards — soft pink, ice-blue, mint — appear briefly behind product cutouts but are NOT formalized as system tokens (treated as photographic content).

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 2px | Inline checkbox marks, fine UI corners |
| `{rounded.sm}` | 4px | Tags, micro-controls |
| `{rounded.md}` | 6px | Square thumbnail rounding |
| `{rounded.lg}` | 8px | Form inputs, radio-option containers |
| `{rounded.xl}` | 16px | Standard feature cards, FAQ accordion items |
| `{rounded.xxl}` | 24px | Warranty / accessory tiles, ghost-style action cards |
| `{rounded.xxxl}` | 32px | Photographic feature cards, big promo strips |
| `{rounded.feature}` | 40px | Accessory hero panels, "Built for prescriptions" cards |
| `{rounded.full}` | 100px | Pill buttons, tab chips, badges |
| `{rounded.circle}` | 50% | Color swatches, circular icon buttons |

### Photography Geometry
- Product hero photography sits in `{rounded.xxxl}` (32px) frames more often than rectangles.
- Color/material swatches are perfect circles (`{rounded.circle}`, 32px diameter, 2px white border ring when selected).
- Square product thumbnails (`aspect-ratio: 1/1`) use `{rounded.xl}` rounding.
- Six-up "color & SKU" picker rows use 1:1 aspect tiles with `{rounded.lg}` (8px) corners — tighter than the hero photography frames to differentiate selection-grid context from showcase context.

## Components

> Per the no-hover policy, hover states are NOT documented for any component below. Default and pressed/active states only.

### Buttons

**`button-primary`** — Black pill primary CTA for marketing surfaces ("Shop", "Pre-order").
- Background `{colors.ink-button}`, text `{colors.on-ink-button}`, typography `{typography.button-md}`, padding `14px 30px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` flips background to `{colors.charcoal}`.
- Disabled state `button-primary-disabled` uses `{colors.disabled-text}` background.

**`button-buy-cta`** — Cobalt pill primary CTA for commerce flows ("Add to cart", "Configure", "Continue").
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `14px 30px`, rounded `{rounded.full}`.
- Pressed state `button-buy-cta-pressed` deepens background to `{colors.primary-deep}`.
- This variant ONLY appears inside the buy-now configurator and PDP purchase rail. Marketing surfaces use `button-primary` instead.

**`button-secondary`** — Outlined ghost CTA, often paired with primary in dual-CTA hero patterns.
- Background transparent, text `{colors.ink-deep}`, border `2px solid {colors.ink-deep}`, typography `{typography.button-md}`, padding `12px 28px`, rounded `{rounded.full}`.

**`button-ghost`** — Quieter outlined variant used for tertiary CTAs.
- Background transparent, text `{colors.ink-deep}`, border `2px solid rgba(10, 19, 23, 0.12)`, typography `{typography.button-md}`, padding `10px 22px`, rounded `{rounded.full}`.

**`button-pill-tab`** + **`button-pill-tab-active`** — Top-of-page category navigation pills ("Glasses / Quest / Apps").
- Inactive: background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, padding `8px 16px`, rounded `{rounded.full}`.
- Active: background `{colors.ink-deep}`, text `{colors.canvas}`. No border in active state — the dark fill replaces it.

**`button-icon-circular`** — 40×40px circular utility buttons (carousel arrows, share, favorite).
- Background `{colors.canvas}`, icon color `{colors.ink}`, rounded `{rounded.circle}`.

### Cards & Containers

**`card-product-feature`** — White feature card with product photography and copy (homepage "Designed for sport", "Advanced. Inside and out.").
- Background `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`.

**`card-feature-photo`** — Edge-to-edge photographic showcase tile with NO chrome (homepage "Built for prescriptions" full-bleed glasses card).
- Background `{colors.canvas}` (visible only at the corners), rounded `{rounded.xxxl}`, no padding, no border. The image fills the card; copy is overlaid bottom-left in white.

**`card-promo-strip`** — Dark full-width promo card with embedded copy + CTAs (homepage "Meta Quest brings the magic of virtual reality" wide strip).
- Background `{colors.ink-deep}`, text `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `{spacing.section}`.

**`card-icon-feature`** — Three-up feature tile with line icon, headline, and short copy ("Free 2-day delivery", "Free 30-day returns", "Worry-free warranty", "Buy now, pay later").
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`card-checkout-summary`** — PDP right-rail sticky summary with title, price, color picker, "Add to cart" button.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`, shadow `rgba(20, 22, 26, 0.3) 0px 1px 4px 0px`.

**`product-thumbnail`** — Square product image cell used in color/SKU pickers and "People also bought" rows.
- Background `{colors.surface-soft}`, rounded `{rounded.xl}`, padding `{spacing.base}`, aspect-ratio `1 / 1`.

**`warranty-card`** — Promo callout for warranty + finance offers ("1y Warranty", "Meta Horizon+").
- Background `{colors.surface-soft}`, rounded `{rounded.xxl}`, padding `{spacing.xxl}`. Uses pastel-tinted variants for additional perks.

**`why-buy-tile`** — 4-up reassurance tile row in the lower marketing zone.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xxl} {spacing.xl}`, border `1px solid {colors.hairline-soft}`. Heading in `{typography.subtitle-lg}`, body in `{typography.body-sm}`.

### Inputs & Forms

**`text-input`** — Standard form field (footer email subscribe, support form).
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.lg}`, padding `{spacing.md}`, height 44px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.fb-blue}`.

**`text-input-error`** — Validation error state.
- Border switches to `1px solid {colors.critical-strong}`; error label below in `{colors.critical-strong}` `{typography.body-sm}`.

**`search-pill`** — Top-nav search field.
- Background `{colors.surface-soft}`, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.full}`, height 40px.

**`radio-option`** + **`radio-option-selected`** — Configurator option cards (storage, color variant, shipping option).
- Inactive: background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg}`, border `1px solid rgba(10, 19, 23, 0.12)`.
- Selected: border switches to `2px solid #0143b5` (deep cobalt) — the cobalt theme persists into form-control selection signaling.

**`color-swatch-circle`** — Round color/material picker (Ray-Ban frame finishes, glass colors).
- 32px diameter, `{rounded.circle}`, `2px solid {colors.canvas}` ring on selection over the swatch''s own fill color.

### Badges & Status

**`badge-promo-yellow`** — Limited-time offer chip ("Limited time", "Sale").
- Background `{colors.warning}`, text `{colors.ink-deep}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-attention`** — Mid-priority status indicator ("Almost gone", "Selling fast").
- Background `{colors.attention}`, text `{colors.canvas}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-success`** — Affirmative status ("In stock", "Verified", "Free shipping").
- Background `{colors.success}`, text `{colors.canvas}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-critical`** — Urgent/destructive label ("Out of stock", "Discontinued", error chips).
- Background `{colors.critical}`, text `{colors.canvas}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`promo-banner`** — Sticky full-width promotional strip ABOVE the top nav ("Get 25% off the #1 selling AI glasses").
- Background `{colors.ink-deep}` (or `{colors.warning}` for yellow promo variants), text `{colors.canvas}` (or `{colors.ink-deep}` on yellow), typography `{typography.body-sm-bold}`, padding `{spacing.md} {spacing.xl}`. Carries one-line offer copy plus an inline CTA link.

### Navigation

**Top Navigation (Desktop)** — Sticky white bar with category pill tabs, search, account, cart.
- Background `{colors.canvas}`, height ~64px with bottom `1px solid {colors.hairline-soft}`.
- Left: Meta wordmark logo (61×14px). Center: pill-tab category nav. Right: search-pill + circular icon buttons (account, cart).

**Top Navigation (Mobile)** — Compressed to logo + hamburger + cart icon. Pill-tab nav slides into a full-screen drawer below 768px.

**Promo Banner** — Full-width strip ABOVE the nav for time-bound offers.
- Background `{colors.ink-deep}` or `{colors.warning}` (yellow), text `{colors.canvas}` or `{colors.ink-deep}`, typography `{typography.body-sm-bold}`, padding `{spacing.md} {spacing.xl}`. Carries one-line offer copy + inline link.

**Breadcrumb (PDP)** — Inline path above the product hero ("Glasses › Ray-Ban Meta › Skyler (Gen 2)").
- Typography `{typography.body-sm}`, separator dot in `{colors.stone}`, active leaf in `{colors.ink}`, parent links in `{colors.steel}`.

### Signature Components

**`hero-band-marketing`** — Full-bleed photographic hero with overlaid copy + dual-CTA pair.
- Edge-to-edge product photography on a dark or photographic background. Overlay copy in `{typography.hero-display}` white. Below the title: 1-line subtitle in `{typography.subtitle-md}` then `button-primary` + `button-secondary` pair.

**`product-gallery-pdp`** — Product detail page main hero: 4-up vertical thumbnail strip on the left, large product image center, sticky purchase rail right.
- Thumbnails: 80×80px, `{rounded.lg}`, `{colors.surface-soft}` background, 1px `{colors.hairline-soft}` border (active border switches to `{colors.ink-deep}`).
- Main image area: ~720×720px on desktop, `{rounded.xxxl}` rounding, photographic surface.
- Sticky rail uses `card-checkout-summary`.

**`color-sku-picker-row`** — Six-up grid of square product variants with name + price below each.
- Tile background `{colors.surface-soft}`, rounded `{rounded.lg}`, image padded `{spacing.base}`. Active tile border switches to `2px solid {colors.ink-deep}`. Below the tile: variant name in `{typography.body-sm-bold}` and price in `{typography.body-sm}`.

**`feature-icon-row`** — Four reassurance benefits ("Free 2-day delivery", "Free 30-day returns", "Worry-free warranty", "Buy now, pay later").
- 4-column grid, each cell uses `card-icon-feature` chrome with a 32px line icon at top, headline `{typography.subtitle-lg}`, body `{typography.body-sm}`.

**`faq-accordion`** — Vertical stack of expandable Q&A items.
- Each item uses `faq-accordion-item` chrome. Question in `{typography.subtitle-lg}` left, chevron icon (`{colors.steel}`, 20px) right. Expanded answer drops in `{typography.body-md}` text below with `{spacing.base}` top padding.

**`tech-specs-table`** — Two-column key/value table for product specifications.
- Row layout: spec label (`{typography.body-sm-bold}` `{colors.ink}`) left, spec value (`{typography.body-sm}` `{colors.charcoal}`) right. Row separator `1px solid {colors.hairline-soft}`. Section headers in `{typography.heading-sm}` above each spec group.

**`testimonial-customer-card`** — Small editorial card with author + quote + photo.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`. Avatar circle 40px, byline in `{typography.body-sm-bold}`, quote in `{typography.body-md}`.

**`footer-region`** — Dense multi-column site footer.
- Background `{colors.canvas}`, top border `1px solid {colors.hairline-soft}`, padding `{spacing.section} {spacing.xxl}`. Six column groups with section headings in `{typography.body-sm-bold}` `{colors.ink}` and link lists in `{typography.body-sm}` `{colors.steel}`. Bottom row contains language picker, region selector, legal links in `{typography.caption}` `{colors.stone}`.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (cobalt) for buy-now CTAs only — its visual weight is meaningful precisely because it doesn''t appear on marketing pages.
- Use `{colors.ink-button}` (black) for marketing-surface primary CTAs. Pair with `{colors.button-secondary}` ghost outline for the secondary action.
- Apply `{rounded.full}` to every button, every category pill, every badge, every chip — buttons are NEVER squared in Meta''s system.
- Apply `{rounded.xxxl}` to photographic product cards and `{rounded.xl}` to icon-feature tiles to maintain the visible card-hierarchy contrast.
- Switch on `ss01, ss02` together for any Optimistic VF heading. Never one stylistic set without the other.
- Use the 300-weight `{typography.heading-md}` for editorial subheads — it creates the brand''s signature visual rhythm against the 500-weight displays.

### Don''t
- Don''t use `{colors.primary}` (cobalt) for marketing-surface primary buttons — it conflicts with Meta''s brand-history positioning of black-CTA-on-white-canvas marketing.
- Don''t introduce additional accent colors beyond cobalt + Oculus purple. The hardware brand is deliberately monochromatic outside its product photography.
- Don''t soften the corners of pill buttons below `{rounded.full}`. The pill is a brand signature.
- Don''t run feature cards without rounding — `{rounded.xxxl}` is the minimum for any photographic surface.
- Don''t reduce `{typography.body-md}` line-height below 1.50 — the negative letter-spacing already tightens the metric and any further compression breaks legibility.
- Don''t apply heavy shadows to marketing cards. Elevation is a commerce-flow signal, not a marketing flourish.

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero text drops to `{typography.display-lg}` or smaller. Pill tabs collapse into hamburger drawer. PDP gallery stacks above purchase rail; rail becomes sticky bottom bar. |
| Mobile (large) | 480 – 767px | Same as small but feature tiles render two-up. |
| Tablet | 768 – 1023px | Two-column feature grids. Pill-tab nav returns. PDP gallery + purchase rail render side-by-side at compressed proportions (~60/40). |
| Desktop | 1024 – 1359px | Full three- and four-up feature grids; full pill-tab category nav; PDP at standard 58/42 split. |
| Wide Desktop | ≥ 1360px | Same as desktop with wider hero gutters and larger product photography. |

### Touch Targets
- Pill buttons render at 40–44px effective height (with the 14px button text + `14px 30px` padding). Above the WCAG AAA 44px floor.
- Circular icon buttons are 40×40px — at the AA floor; bumps to 44×44px on mobile via override.
- Color swatch circles are 32×32px. To hit AAA, the swatch carries a 12px clear hit zone around it (effective hit target ~56px).
- Form inputs render at 44px height to align with primary button height.

### Collapsing Strategy
- **Promo banner** stays full-width on all breakpoints; truncates with ellipsis on small mobile, retains the inline link affordance.
- **Pill-tab nav** below 768px collapses into a hamburger drawer; the active tab is rendered as a label inside the closed nav.
- **PDP layout**: gallery stacks above the purchase summary at < 1024px; the summary becomes a sticky bottom bar with price + "Add to cart" button at < 768px. The full summary remains scrollable above the sticky bar.
- **Feature grids** (3-up, 4-up) collapse to 2-up at 768–1023px and 1-up at < 768px. Card padding compresses from `{spacing.xxl}` to `{spacing.xl}` at the 1-up breakpoint.
- **Hero typography**: `{typography.hero-display}` (64px) drops to `{typography.heading-lg}` (36px) at < 768px and `{typography.heading-sm}` (24px) at < 480px.
- **Footer**: 6-column desktop layout reflows to 2-column at tablet and accordion-collapsed groups at mobile.

### Image Behavior
- Product photography uses 1:1 (thumbnails, color pickers), 4:3 (PDP gallery), and 16:9 (homepage promo strips) ratios.
- Hero photography is full-bleed with `{rounded.xxxl}` corners; lazy-loaded below the fold.
- Product variant images preserve their `{rounded.lg}` thumbnails across all breakpoints — they never go full-width on mobile.

## Iteration Guide

1. Focus on ONE component at a time. The system has high internal consistency — small precision wins compound.
2. Reference component names and tokens directly (`{colors.primary}`, `{component-name}-pressed`, `{rounded.full}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits to catch broken refs, contrast issues, orphaned tokens.
4. Add new variants as separate `components:` entries (`-pressed`, `-disabled`, `-focused`) — do not bury them inside prose.
5. Default to `{typography.body-md}` for body and `{typography.subtitle-lg}` for emphasis. Headlines step down through `hero-display → display-lg → heading-lg → heading-md → heading-sm`.
6. Keep `{colors.primary}` (cobalt) scarce. If it appears outside the buy-now flow on a viewport, ask whether the surface really needs to look like a checkout panel.
7. Pill-shaped buttons (`{rounded.full}`) always; squared buttons signal "third-party widget" in this design language and should be filtered out of any work surface.

## Known Gaps

- Selected/checked states for non-button form controls (toggle, multi-select) were not visible on the captured surfaces — implement following the cobalt-on-white pattern from `radio-option-selected`.
- Animation/transition timings are not extracted; recommend 150–250ms ease-out for primary surface transitions and 300ms ease-in-out for accordion expand/collapse.
- Specific dark-mode token values for canvas, surface, ink, and hairline are not defined; the brand has not surfaced a published dark-mode token set on these commerce pages.
- Pastel decorative tints inside accessory cards (soft pink, ice blue, mint) appear visually but are not formalized — treat them as photographic content, not as system colors.
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

Meta''s commerce surfaces (homepage, Quest configurator, Ray-Ban product detail, prescription page) read as a confident hardware merchandiser. The brand voice is photography-first: large, full-bleed product imagery dominates above-the-fold real estate, with white space and tight typographic hierarchy carrying the rest. The system has a recognizable dual-CTA pattern — a black pill-shaped primary on marketing surfaces shifting to a saturated cobalt blue ({colors.primary}) inside the buy-now flows, paired with an outlined ghost button for secondary navigation.

Optimistic VF — Meta''s variable display face — anchors the entire system, ranging from a 64px hero display down to a 12px caption. The face''s `ss01` and `ss02` stylistic sets are switched on across every heading role, contributing to the brand''s slightly humanist, friendly geometric character. Below 768px the system collapses cleanly: hero stacks, pill nav becomes a hamburger, three-up feature grids flatten to a single column, and product configurators drop their right-rail summary into a sticky bottom bar.

**Key Characteristics:**
- Stark white canvas ({colors.canvas}) carrying full-bleed product photography with `{rounded.xxxl}` (32px) corner softening on showcase tiles
- Two-tier primary button system: marketing CTAs use {colors.ink-button} pills; commerce CTAs use {colors.primary} cobalt pills inside buy-now panels
- Optimistic VF as the universal display + body face with consistent `ss01, ss02` OpenType features
- Pill-shaped buttons ({rounded.full}) and `{rounded.xxxl}`/`{rounded.feature}` cards as the dominant geometric signature
- Saturated promotional banners (yellow {colors.warning}, dark {colors.ink-deep}) used sparingly above the nav for time-bound offers
- Photographic feature cards with no card chrome (no border, no shadow) — the product imagery IS the surface treatment', '{"sourcePath":"docs/design-md/meta/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: meta.com/ (homepage), /ai-glasses/ray-ban-meta-skyler-gen-2/ (PDP), /quest/quest-3s/buy-now/ (configurator), /ai-glasses/prescription/ (lens upsell). Token coverage was identical across all four pages — the design system is genuinely unified.

### Brand & Accent
- **Cobalt Primary** ({colors.primary}): The buy-now CTA color. Used on every "Add to cart", "Configure", "Pre-order" button inside the commerce flow and the right-rail purchase panel.
- **Deep Cobalt** ({colors.primary-deep}): Pressed-state and dark-surface variant of the cobalt primary; also the active link color.
- **Soft Cobalt** ({colors.primary-soft}): Translucent background tint for informational callouts (`{colors.primary-soft}` at 15% alpha).
- **Facebook Blue** ({colors.fb-blue}): Selected radio/checkbox state and inline form-control activation color.
- **Meta Link Blue** ({colors.meta-link}): Reserved for legacy navigation and footer link affordances.
- **Oculus Purple** ({colors.oculus-purple}): VR product accent — used inside Quest-branded surfaces for category emphasis.

### Surface
- **Canvas White** ({colors.canvas}): Page background and primary card surface.
- **Soft Cloud** ({colors.surface-soft}): Subtle product-thumbnail and warranty-card background; also the search-pill rest state.
- **Hairline Gray** ({colors.hairline}): 1px input border and form-control divider.
- **Hairline Soft** ({colors.hairline-soft}): Quieter divider used on cards, footer separators, and section breaks.

### Text
- **Deep Ink** ({colors.ink-deep}): Primary headline and body text on light surfaces.
- **Ink** ({colors.ink}): Standard body and secondary headline text.
- **Charcoal** ({colors.charcoal}): Tertiary body text and form-button labels.
- **Slate** ({colors.slate}): Section-header copy and supporting microcopy.
- **Steel** ({colors.steel}): Quieter caption text and footer link hierarchy.
- **Stone** ({colors.stone}): Disabled or de-emphasized labels.

### Semantic
- **Success** ({colors.success}): "In stock", "Free returns" affirmations.
- **Attention** ({colors.attention}): Mid-priority alerts and timed callouts.
- **Warning** ({colors.warning}): Promotional banners ("Get 25% off…") and limited-time tags.
- **Critical** ({colors.critical}): Validation errors, destructive feedback.
- **Critical Strong** ({colors.critical-strong}): Form-input error border and inline error labels.', '{"sourcePath":"docs/design-md/meta/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**Optimistic VF** is Meta''s proprietary variable display face. Fallbacks: Montserrat, Helvetica, Arial, Noto Sans. The variable axes carry from 300 (light heading-md, used for editorial intro headlines like "Look forward") through 500 (display, hero, heading-sm) up to 700 (subtitle, body emphasis, button labels). Stylistic sets `ss01` and `ss02` are switched on across every heading role — they soften the geometry and give the type a slightly humanist breathing.

A secondary Helvetica fallback chain is used for technical microcopy (12px) inside spec sheets and footer fine print.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | OpenType | Use |
|---|---|---|---|---|---|---|
| `{typography.hero-display}` | 64px | 500 | 1.16 | 0 | ss01, ss02 | Homepage hero ("Get 25% off…", category opener) |
| `{typography.display-lg}` | 48px | 500 | 1.17 | 0 | ss01, ss02 | Section-opener display ("Made for prescriptions. Built for comfort.") |
| `{typography.heading-lg}` | 36px | 500 | 1.28 | 0 | ss01, ss02 | Subsection headlines ("Why buy from Meta", "Tech specs") |
| `{typography.heading-md}` | 28px | 300 | 1.21 | 0 | ss01, ss02 | Editorial subheads in lighter weight ("Look forward", "Built for prescriptions") |
| `{typography.heading-sm}` | 24px | 500 | 1.25 | 0 | ss01, ss02 | Card titles, feature-tile headers |
| `{typography.subtitle-lg}` | 18px | 700 | 1.44 | 0 | — | Bold callouts, FAQ question titles |
| `{typography.subtitle-md}` | 18px | 400 | 1.44 | 0 | — | Body lead and longer-line subtitles |
| `{typography.body-md}` | 16px | 400 | 1.50 | -0.16px | — | Primary body text |
| `{typography.body-md-bold}` | 16px | 700 | 1.50 | -0.16px | — | Body emphasis and link-md |
| `{typography.body-sm}` | 14px | 400 | 1.43 | -0.14px | — | Secondary body, helper text |
| `{typography.body-sm-bold}` | 14px | 700 | 1.43 | -0.14px | — | Pill tab labels, footer headings |
| `{typography.caption-bold}` | 12px | 700 | 1.33 | 0 | — | Badge labels, timestamps |
| `{typography.caption}` | 12px | 400 | 1.33 | 0 | — | Footer fine print, legal microcopy |
| `{typography.button-md}` | 14px | 700 | 1.43 | -0.14px | — | Pill button labels |
| `{typography.link-md}` | 16px | 700 | 1.50 | -0.16px | — | Inline navigation links |

### Principles
- Negative letter-spacing on body roles (`-0.14px` to `-0.16px`) tightens the type fractionally — Optimistic VF was designed for this snug-but-not-condensed setting.
- Editorial subheads use the 300 weight to introduce visual rest between the 500-weight display headlines and the 400-weight body, creating a three-tier visual rhythm.
- All headings carry `ss01, ss02` stylistic sets together — the design treats them as a paired alternates package, never one without the other.
- Buttons, pill tabs, and footer headings share `{typography.body-sm-bold}` (14px / 700 / -0.14px), creating a tight visual relationship between interactive elements.', '{"sourcePath":"docs/design-md/meta/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4px increment with 8px as the dominant primary step.
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (10px) · `{spacing.md}` (12px) · `{spacing.base}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (80px) · `{spacing.hero}` (120px).
- **Section rhythm**: Marketing sections separate at `{spacing.section-lg}` (80px); product detail sections compress to `{spacing.section}` (64px); FAQ stacks tighten further to `{spacing.xxl}` (32px).
- **Card internal padding**: Standard `{spacing.xxl}` (32px); icon-feature tiles compress to `{spacing.xl}` (24px); promo-strip cards expand to `{spacing.section}` (64px) for hero presence.

### Grid & Container
- Marketing page max-width sits around 1280px with 32–48px gutters.
- The PDP layout uses a 2-column split: hero gallery (~58% width) + sticky purchase rail (~42%, with `max-width: 380px` on the rail).
- Three-up feature grids ("Why buy from Meta") use a 24px column gap; six-up product thumbnail rows (color/SKU pickers) use a 12px gap.

### Whitespace Philosophy
Whitespace is product-photography-first. Hero sections give product imagery 50–70% of the viewport height; copy is given oxygen to breathe in `{spacing.xxl}` to `{spacing.xxxl}` blocks above and below. Inside the configurator, whitespace tightens — the buy-now panel is information-dense, with `{spacing.base}` to `{spacing.lg}` rhythm between option groups.', '{"sourcePath":"docs/design-md/meta/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

The system runs predominantly flat. Elevation is reserved for two interaction layers:

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{rounded.xxxl}` rounding + `{colors.hairline-soft}` border | Default product cards, why-buy tiles |
| 1 (subtle) | `rgba(0, 0, 0, 0.2) 1px 1px 0px 0px` | Pill-tab activation indicator |
| 2 (sticky panel) | `rgba(20, 22, 26, 0.3) 0px 1px 4px 0px` | PDP right-rail purchase summary, sticky mobile checkout bar |

### Decorative Depth
- Photography-as-depth: full-bleed product imagery on `{rounded.xxxl}` cards creates atmospheric layering without shadows.
- Translucent overlays (`rgba(255, 255, 255, 0.1)` to `rgba(10, 19, 23, 0.12)`) cover dark hero photography to lift legibility of overlaid text.
- Decorative pastel tints inside accessory cards — soft pink, ice-blue, mint — appear briefly behind product cutouts but are NOT formalized as system tokens (treated as photographic content).', '{"sourcePath":"docs/design-md/meta/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 2px | Inline checkbox marks, fine UI corners |
| `{rounded.sm}` | 4px | Tags, micro-controls |
| `{rounded.md}` | 6px | Square thumbnail rounding |
| `{rounded.lg}` | 8px | Form inputs, radio-option containers |
| `{rounded.xl}` | 16px | Standard feature cards, FAQ accordion items |
| `{rounded.xxl}` | 24px | Warranty / accessory tiles, ghost-style action cards |
| `{rounded.xxxl}` | 32px | Photographic feature cards, big promo strips |
| `{rounded.feature}` | 40px | Accessory hero panels, "Built for prescriptions" cards |
| `{rounded.full}` | 100px | Pill buttons, tab chips, badges |
| `{rounded.circle}` | 50% | Color swatches, circular icon buttons |

### Photography Geometry
- Product hero photography sits in `{rounded.xxxl}` (32px) frames more often than rectangles.
- Color/material swatches are perfect circles (`{rounded.circle}`, 32px diameter, 2px white border ring when selected).
- Square product thumbnails (`aspect-ratio: 1/1`) use `{rounded.xl}` rounding.
- Six-up "color & SKU" picker rows use 1:1 aspect tiles with `{rounded.lg}` (8px) corners — tighter than the hero photography frames to differentiate selection-grid context from showcase context.', '{"sourcePath":"docs/design-md/meta/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> Per the no-hover policy, hover states are NOT documented for any component below. Default and pressed/active states only.

### Buttons

**`button-primary`** — Black pill primary CTA for marketing surfaces ("Shop", "Pre-order").
- Background `{colors.ink-button}`, text `{colors.on-ink-button}`, typography `{typography.button-md}`, padding `14px 30px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` flips background to `{colors.charcoal}`.
- Disabled state `button-primary-disabled` uses `{colors.disabled-text}` background.

**`button-buy-cta`** — Cobalt pill primary CTA for commerce flows ("Add to cart", "Configure", "Continue").
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `14px 30px`, rounded `{rounded.full}`.
- Pressed state `button-buy-cta-pressed` deepens background to `{colors.primary-deep}`.
- This variant ONLY appears inside the buy-now configurator and PDP purchase rail. Marketing surfaces use `button-primary` instead.

**`button-secondary`** — Outlined ghost CTA, often paired with primary in dual-CTA hero patterns.
- Background transparent, text `{colors.ink-deep}`, border `2px solid {colors.ink-deep}`, typography `{typography.button-md}`, padding `12px 28px`, rounded `{rounded.full}`.

**`button-ghost`** — Quieter outlined variant used for tertiary CTAs.
- Background transparent, text `{colors.ink-deep}`, border `2px solid rgba(10, 19, 23, 0.12)`, typography `{typography.button-md}`, padding `10px 22px`, rounded `{rounded.full}`.

**`button-pill-tab`** + **`button-pill-tab-active`** — Top-of-page category navigation pills ("Glasses / Quest / Apps").
- Inactive: background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, padding `8px 16px`, rounded `{rounded.full}`.
- Active: background `{colors.ink-deep}`, text `{colors.canvas}`. No border in active state — the dark fill replaces it.

**`button-icon-circular`** — 40×40px circular utility buttons (carousel arrows, share, favorite).
- Background `{colors.canvas}`, icon color `{colors.ink}`, rounded `{rounded.circle}`.

### Cards & Containers

**`card-product-feature`** — White feature card with product photography and copy (homepage "Designed for sport", "Advanced. Inside and out.").
- Background `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`.

**`card-feature-photo`** — Edge-to-edge photographic showcase tile with NO chrome (homepage "Built for prescriptions" full-bleed glasses card).
- Background `{colors.canvas}` (visible only at the corners), rounded `{rounded.xxxl}`, no padding, no border. The image fills the card; copy is overlaid bottom-left in white.

**`card-promo-strip`** — Dark full-width promo card with embedded copy + CTAs (homepage "Meta Quest brings the magic of virtual reality" wide strip).
- Background `{colors.ink-deep}`, text `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `{spacing.section}`.

**`card-icon-feature`** — Three-up feature tile with line icon, headline, and short copy ("Free 2-day delivery", "Free 30-day returns", "Worry-free warranty", "Buy now, pay later").
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`card-checkout-summary`** — PDP right-rail sticky summary with title, price, color picker, "Add to cart" button.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`, shadow `rgba(20, 22, 26, 0.3) 0px 1px 4px 0px`.

**`product-thumbnail`** — Square product image cell used in color/SKU pickers and "People also bought" rows.
- Background `{colors.surface-soft}`, rounded `{rounded.xl}`, padding `{spacing.base}`, aspect-ratio `1 / 1`.

**`warranty-card`** — Promo callout for warranty + finance offers ("1y Warranty", "Meta Horizon+").
- Background `{colors.surface-soft}`, rounded `{rounded.xxl}`, padding `{spacing.xxl}`. Uses pastel-tinted variants for additional perks.

**`why-buy-tile`** — 4-up reassurance tile row in the lower marketing zone.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xxl} {spacing.xl}`, border `1px solid {colors.hairline-soft}`. Heading in `{typography.subtitle-lg}`, body in `{typography.body-sm}`.

### Inputs & Forms

**`text-input`** — Standard form field (footer email subscribe, support form).
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.lg}`, padding `{spacing.md}`, height 44px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.fb-blue}`.

**`text-input-error`** — Validation error state.
- Border switches to `1px solid {colors.critical-strong}`; error label below in `{colors.critical-strong}` `{typography.body-sm}`.

**`search-pill`** — Top-nav search field.
- Background `{colors.surface-soft}`, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.full}`, height 40px.

**`radio-option`** + **`radio-option-selected`** — Configurator option cards (storage, color variant, shipping option).
- Inactive: background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg}`, border `1px solid rgba(10, 19, 23, 0.12)`.
- Selected: border switches to `2px solid #0143b5` (deep cobalt) — the cobalt theme persists into form-control selection signaling.

**`color-swatch-circle`** — Round color/material picker (Ray-Ban frame finishes, glass colors).
- 32px diameter, `{rounded.circle}`, `2px solid {colors.canvas}` ring on selection over the swatch''s own fill color.

### Badges & Status

**`badge-promo-yellow`** — Limited-time offer chip ("Limited time", "Sale").
- Background `{colors.warning}`, text `{colors.ink-deep}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-attention`** — Mid-priority status indicator ("Almost gone", "Selling fast").
- Background `{colors.attention}`, text `{colors.canvas}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-success`** — Affirmative status ("In stock", "Verified", "Free shipping").
- Background `{colors.success}`, text `{colors.canvas}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-critical`** — Urgent/destructive label ("Out of stock", "Discontinued", error chips).
- Background `{colors.critical}`, text `{colors.canvas}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`promo-banner`** — Sticky full-width promotional strip ABOVE the top nav ("Get 25% off the #1 selling AI glasses").
- Background `{colors.ink-deep}` (or `{colors.warning}` for yellow promo variants), text `{colors.canvas}` (or `{colors.ink-deep}` on yellow), typography `{typography.body-sm-bold}`, padding `{spacing.md} {spacing.xl}`. Carries one-line offer copy plus an inline CTA link.

### Navigation

**Top Navigation (Desktop)** — Sticky white bar with category pill tabs, search, account, cart.
- Background `{colors.canvas}`, height ~64px with bottom `1px solid {colors.hairline-soft}`.
- Left: Meta wordmark logo (61×14px). Center: pill-tab category nav. Right: search-pill + circular icon buttons (account, cart).

**Top Navigation (Mobile)** — Compressed to logo + hamburger + cart icon. Pill-tab nav slides into a full-screen drawer below 768px.

**Promo Banner** — Full-width strip ABOVE the nav for time-bound offers.
- Background `{colors.ink-deep}` or `{colors.warning}` (yellow), text `{colors.canvas}` or `{colors.ink-deep}`, typography `{typography.body-sm-bold}`, padding `{spacing.md} {spacing.xl}`. Carries one-line offer copy + inline link.

**Breadcrumb (PDP)** — Inline path above the product hero ("Glasses › Ray-Ban Meta › Skyler (Gen 2)").
- Typography `{typography.body-sm}`, separator dot in `{colors.stone}`, active leaf in `{colors.ink}`, parent links in `{colors.steel}`.

### Signature Components

**`hero-band-marketing`** — Full-bleed photographic hero with overlaid copy + dual-CTA pair.
- Edge-to-edge product photography on a dark or photographic background. Overlay copy in `{typography.hero-display}` white. Below the title: 1-line subtitle in `{typography.subtitle-md}` then `button-primary` + `button-secondary` pair.

**`product-gallery-pdp`** — Product detail page main hero: 4-up vertical thumbnail strip on the left, large product image center, sticky purchase rail right.
- Thumbnails: 80×80px, `{rounded.lg}`, `{colors.surface-soft}` background, 1px `{colors.hairline-soft}` border (active border switches to `{colors.ink-deep}`).
- Main image area: ~720×720px on desktop, `{rounded.xxxl}` rounding, photographic surface.
- Sticky rail uses `card-checkout-summary`.

**`color-sku-picker-row`** — Six-up grid of square product variants with name + price below each.
- Tile background `{colors.surface-soft}`, rounded `{rounded.lg}`, image padded `{spacing.base}`. Active tile border switches to `2px solid {colors.ink-deep}`. Below the tile: variant name in `{typography.body-sm-bold}` and price in `{typography.body-sm}`.

**`feature-icon-row`** — Four reassurance benefits ("Free 2-day delivery", "Free 30-day returns", "Worry-free warranty", "Buy now, pay later").
- 4-column grid, each cell uses `card-icon-feature` chrome with a 32px line icon at top, headline `{typography.subtitle-lg}`, body `{typography.body-sm}`.

**`faq-accordion`** — Vertical stack of expandable Q&A items.
- Each item uses `faq-accordion-item` chrome. Question in `{typography.subtitle-lg}` left, chevron icon (`{colors.steel}`, 20px) right. Expanded answer drops in `{typography.body-md}` text below with `{spacing.base}` top padding.

**`tech-specs-table`** — Two-column key/value table for product specifications.
- Row layout: spec label (`{typography.body-sm-bold}` `{colors.ink}`) left, spec value (`{typography.body-sm}` `{colors.charcoal}`) right. Row separator `1px solid {colors.hairline-soft}`. Section headers in `{typography.heading-sm}` above each spec group.

**`testimonial-customer-card`** — Small editorial card with author + quote + photo.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`. Avatar circle 40px, byline in `{typography.body-sm-bold}`, quote in `{typography.body-md}`.

**`footer-region`** — Dense multi-column site footer.
- Background `{colors.canvas}`, top border `1px solid {colors.hairline-soft}`, padding `{spacing.section} {spacing.xxl}`. Six column groups with section headings in `{typography.body-sm-bold}` `{colors.ink}` and link lists in `{typography.body-sm}` `{colors.steel}`. Bottom row contains language picker, region selector, legal links in `{typography.caption}` `{colors.stone}`.', '{"sourcePath":"docs/design-md/meta/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (cobalt) for buy-now CTAs only — its visual weight is meaningful precisely because it doesn''t appear on marketing pages.
- Use `{colors.ink-button}` (black) for marketing-surface primary CTAs. Pair with `{colors.button-secondary}` ghost outline for the secondary action.
- Apply `{rounded.full}` to every button, every category pill, every badge, every chip — buttons are NEVER squared in Meta''s system.
- Apply `{rounded.xxxl}` to photographic product cards and `{rounded.xl}` to icon-feature tiles to maintain the visible card-hierarchy contrast.
- Switch on `ss01, ss02` together for any Optimistic VF heading. Never one stylistic set without the other.
- Use the 300-weight `{typography.heading-md}` for editorial subheads — it creates the brand''s signature visual rhythm against the 500-weight displays.

### Don''t
- Don''t use `{colors.primary}` (cobalt) for marketing-surface primary buttons — it conflicts with Meta''s brand-history positioning of black-CTA-on-white-canvas marketing.
- Don''t introduce additional accent colors beyond cobalt + Oculus purple. The hardware brand is deliberately monochromatic outside its product photography.
- Don''t soften the corners of pill buttons below `{rounded.full}`. The pill is a brand signature.
- Don''t run feature cards without rounding — `{rounded.xxxl}` is the minimum for any photographic surface.
- Don''t reduce `{typography.body-md}` line-height below 1.50 — the negative letter-spacing already tightens the metric and any further compression breaks legibility.
- Don''t apply heavy shadows to marketing cards. Elevation is a commerce-flow signal, not a marketing flourish.', '{"sourcePath":"docs/design-md/meta/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero text drops to `{typography.display-lg}` or smaller. Pill tabs collapse into hamburger drawer. PDP gallery stacks above purchase rail; rail becomes sticky bottom bar. |
| Mobile (large) | 480 – 767px | Same as small but feature tiles render two-up. |
| Tablet | 768 – 1023px | Two-column feature grids. Pill-tab nav returns. PDP gallery + purchase rail render side-by-side at compressed proportions (~60/40). |
| Desktop | 1024 – 1359px | Full three- and four-up feature grids; full pill-tab category nav; PDP at standard 58/42 split. |
| Wide Desktop | ≥ 1360px | Same as desktop with wider hero gutters and larger product photography. |

### Touch Targets
- Pill buttons render at 40–44px effective height (with the 14px button text + `14px 30px` padding). Above the WCAG AAA 44px floor.
- Circular icon buttons are 40×40px — at the AA floor; bumps to 44×44px on mobile via override.
- Color swatch circles are 32×32px. To hit AAA, the swatch carries a 12px clear hit zone around it (effective hit target ~56px).
- Form inputs render at 44px height to align with primary button height.

### Collapsing Strategy
- **Promo banner** stays full-width on all breakpoints; truncates with ellipsis on small mobile, retains the inline link affordance.
- **Pill-tab nav** below 768px collapses into a hamburger drawer; the active tab is rendered as a label inside the closed nav.
- **PDP layout**: gallery stacks above the purchase summary at < 1024px; the summary becomes a sticky bottom bar with price + "Add to cart" button at < 768px. The full summary remains scrollable above the sticky bar.
- **Feature grids** (3-up, 4-up) collapse to 2-up at 768–1023px and 1-up at < 768px. Card padding compresses from `{spacing.xxl}` to `{spacing.xl}` at the 1-up breakpoint.
- **Hero typography**: `{typography.hero-display}` (64px) drops to `{typography.heading-lg}` (36px) at < 768px and `{typography.heading-sm}` (24px) at < 480px.
- **Footer**: 6-column desktop layout reflows to 2-column at tablet and accordion-collapsed groups at mobile.

### Image Behavior
- Product photography uses 1:1 (thumbnails, color pickers), 4:3 (PDP gallery), and 16:9 (homepage promo strips) ratios.
- Hero photography is full-bleed with `{rounded.xxxl}` corners; lazy-loaded below the fold.
- Product variant images preserve their `{rounded.lg}` thumbnails across all breakpoints — they never go full-width on mobile.', '{"sourcePath":"docs/design-md/meta/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. The system has high internal consistency — small precision wins compound.
2. Reference component names and tokens directly (`{colors.primary}`, `{component-name}-pressed`, `{rounded.full}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits to catch broken refs, contrast issues, orphaned tokens.
4. Add new variants as separate `components:` entries (`-pressed`, `-disabled`, `-focused`) — do not bury them inside prose.
5. Default to `{typography.body-md}` for body and `{typography.subtitle-lg}` for emphasis. Headlines step down through `hero-display → display-lg → heading-lg → heading-md → heading-sm`.
6. Keep `{colors.primary}` (cobalt) scarce. If it appears outside the buy-now flow on a viewport, ask whether the surface really needs to look like a checkout panel.
7. Pill-shaped buttons (`{rounded.full}`) always; squared buttons signal "third-party widget" in this design language and should be filtered out of any work surface.', '{"sourcePath":"docs/design-md/meta/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Selected/checked states for non-button form controls (toggle, multi-select) were not visible on the captured surfaces — implement following the cobalt-on-white pattern from `radio-option-selected`.
- Animation/transition timings are not extracted; recommend 150–250ms ease-out for primary surface transitions and 300ms ease-in-out for accordion expand/collapse.
- Specific dark-mode token values for canvas, surface, ink, and hairline are not defined; the brand has not surfaced a published dark-mode token set on these commerce pages.
- Pastel decorative tints inside accessory cards (soft pink, ice blue, mint) appear visually but are not formalized — treat them as photographic content, not as system colors.', '{"sourcePath":"docs/design-md/meta/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_1', '#0064E0', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_2', '#0064e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_3', '#0457cb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_4', '#0091ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_5', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_6', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_7', '#1876f2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_8', '#385898', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_9', '#a121ce', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_10', '#31a24c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_11', '#24e400', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_12', '#f2a918', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_13', '#f7b928', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_14', '#ffe200', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_15', '#e41e3f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_16', '#f0284a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_17', '#f1f4f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_18', '#0a1317', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_19', '#1c1e21', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_20', '#444950', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_21', '#4b4c4f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_22', '#5d6c7b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_23', '#8595a4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_24', '#ced0d4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_25', '#dee3e9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_26', '#bcc0c4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md'), 'color', 'color_27', '#0143b5', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/meta/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/meta/DESIGN.md';


-- Minimax
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Minimax', 'minimax', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/minimax/DESIGN.md', null, 'seeded', '---
version: alpha
name: MiniMax-design-analysis
description: MiniMax presents itself as a premium AI infrastructure brand through a striking duality — bold black-pill CTAs and stark white canvas for marketing, paired with vibrant gradient product cards (orange-red, magenta-pink, purple, blue) that turn each model release into a distinctive visual identity. The system uses DM Sans across all surfaces, employs an oversized 80px hero display, anchors major actions in deep near-black pills, and layers content density via a 3-column documentation grid with sidebar nav, prose body, and TOC. Coverage spans the marketing homepage, model showcase pages, developer documentation, and platform pricing surfaces.

colors:
  primary: "#0a0a0a"
  on-primary: "#ffffff"
  primary-soft: "#181e25"
  brand-coral: "#ff5530"
  brand-magenta: "#ea5ec1"
  brand-blue: "#1456f0"
  brand-blue-mid: "#3b82f6"
  brand-blue-deep: "#1d4ed8"
  brand-blue-700: "#17437d"
  brand-cyan: "#3daeff"
  brand-blue-200: "#bfdbfe"
  brand-purple: "#a855f7"
  canvas: "#ffffff"
  surface: "#f7f8fa"
  surface-soft: "#f2f3f5"
  hairline: "#e5e7eb"
  hairline-soft: "#eaecf0"
  ink: "#0a0a0a"
  ink-strong: "#000000"
  charcoal: "#222222"
  slate: "#45515e"
  steel: "#5f5f5f"
  stone: "#8e8e93"
  muted: "#a8aab2"
  success-bg: "#e8ffea"
  success-text: "#1ba673"
  on-dark: "#ffffff"
  footer-bg: "#0a0a0a"

typography:
  hero-display:
    fontFamily: DM Sans
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -2px
  display-lg:
    fontFamily: DM Sans
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1.5px
  heading-lg:
    fontFamily: DM Sans
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -1px
  heading-md:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.5px
  heading-sm:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.30
  card-title:
    fontFamily: DM Sans
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.40
  subtitle:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.50
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
  body-md-bold:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.50
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  body-sm-medium:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.50
  caption:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.70
  caption-bold:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.50
  micro:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.50
  button-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.40

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 20px
  xxxl: 24px
  hero: 32px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section-sm: 48px
  section: 64px
  section-lg: 80px
  hero: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "11px 24px"
  button-primary-pressed:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.muted}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "11px 24px"
    border: "1px solid {colors.ink}"
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "11px 24px"
    border: "1px solid {colors.hairline}"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    padding: "8px 0"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 36px
    border: "1px solid {colors.hairline}"
  product-card-coral:
    backgroundColor: "{colors.brand-coral}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.hero}"
    padding: "{spacing.xxl}"
  product-card-magenta:
    backgroundColor: "{colors.brand-magenta}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.hero}"
    padding: "{spacing.xxl}"
  product-card-blue:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.hero}"
    padding: "{spacing.xxl}"
  product-card-purple:
    backgroundColor: "{colors.brand-purple}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.hero}"
    padding: "{spacing.xxl}"
  product-card-photo:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.hero}"
    padding: "{spacing.xxl}"
  card-base:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-feature:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
  card-recommendation:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.hairline}"
  promo-cta-card:
    backgroundColor: "{colors.brand-coral}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.hero}"
    padding: "{spacing.section}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline}"
    height: 40px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.brand-blue-deep}"
  text-input-error:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "1px solid #d45656"
  search-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.xs} {spacing.md}"
    height: 36px
    border: "1px solid {colors.hairline}"
  segmented-tab:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.button-md}"
    rounded: "0"
    padding: "{spacing.md} {spacing.lg}"
    border: "0 0 2px transparent solid"
  segmented-tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    border: "0 0 2px {colors.ink} solid"
  pill-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.md}"
    border: "1px solid {colors.hairline}"
  pill-tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    border: "1px solid {colors.primary}"
  badge-success:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success-text}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-new:
    backgroundColor: "{colors.brand-coral}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-beta:
    backgroundColor: "{colors.brand-blue-200}"
    textColor: "{colors.brand-blue-deep}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-code:
    backgroundColor: "{colors.brand-blue-200}"
    textColor: "{colors.brand-blue-deep}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  promo-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.lg}"
  data-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
  data-table-header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.caption-bold}"
    padding: "{spacing.sm} {spacing.md}"
  data-table-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "{spacing.md}"
    border: "0 0 1px {colors.hairline-soft} solid"
  sidebar-nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
  sidebar-nav-item-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
  doc-toc-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xs} 0"
  ai-product-tile:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xxxl}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  footer-region:
    backgroundColor: "{colors.footer-bg}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    padding: "{spacing.section} {spacing.xxl}"
  footer-link:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
  hero-band-marketing:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.hero-display}"
    rounded: "{rounded.lg}"
    padding: "{spacing.hero}"
  product-matrix-grid:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.hero}"
    padding: "{spacing.xxl}"
  ai-product-matrix:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xxxl}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  docs-prose-block:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.charcoal}"
    typography: "{typography.body-md}"
    padding: "{spacing.xxl}"
  models-comparison-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
  testimonial-stat-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-lg}"
    padding: "{spacing.xl}"
---

## Overview

MiniMax stages itself as a Chinese AI infrastructure brand with a sophisticated dual identity. Marketing surfaces and platform pages anchor in stark white canvas with deep-black typographic emphasis — the brand voice is confident, technical, almost editorial. But each model release gets its own vibrant gradient identity card: M2.7 in volcanic coral-red, Music 2.6 in magenta-pink, Hailuo in deep blue, Speech 2.8 in saturated orange-purple. Together these vibrant tiles read like album covers laid out on the homepage — each one declaring its own product personality.

DM Sans anchors every surface from oversized 80px hero displays down to 12px micro labels. The geometric, slightly humanist character of the face suits both the dense documentation surfaces (where 14px body type carries 1.5 line-height for long-form prose) and the high-impact marketing displays (where -2px letter-spacing tightens 80px headlines). Buttons are universally pill-shaped (`rounded-full`) with a sharp two-tier system: black-pill primary (the dominant CTA) and outline-pill secondary. Cards split into two distinct families: vibrant gradient product showcases (32px corner softening) and quiet white documentation cards (16px corner softening).

**Key Characteristics:**
- Stark monochrome palette — black ({colors.primary}) and white ({colors.canvas}) — broken open by saturated brand-color gradient cards
- Distinct product-color encoding: each model line has its own vibrant brand color (coral M2.7, magenta Music 2.6, blue Hailuo, orange Speech 2.8)
- DM Sans across the entire system; Inter as fallback
- Pill-shaped buttons ({rounded.full}) and pill-shaped tabs everywhere; rectangular forms only inside data tables and dense docs
- Hero typography uses tight 1.10 line-height with -2px letter-spacing for impact
- Documentation surfaces use a 3-column layout: left sidebar nav, center prose body, right table-of-contents
- Black promo banners ({colors.primary}) above the nav for time-bound brand moments

## Colors

> Source pages: minimax.io/ (homepage), /models/text/m27 (product showcase), platform.minimax.io/docs/guides/models-intro (documentation), /subscribe/token-plan (pricing). Token coverage was identical across all four pages.

### Brand & Accent
- **Brand Coral** ({colors.brand-coral}): Signature high-impact accent. Used on M2.7 product card, "Token Plan" hero band, promo CTA strips, and "NEW" badges. Carries the brand''s most attention-grabbing energy.
- **Brand Magenta** ({colors.brand-magenta}): Secondary product-card identity (Music 2.6); used for music/audio product encoding.
- **Brand Blue** ({colors.brand-blue}): Hailuo video product identity; primary blue accent across the system.
- **Brand Blue Deep** ({colors.brand-blue-deep}): Form-control activation, link emphasis.
- **Brand Blue 700** ({colors.brand-blue-700}): Documentation tag and reference text color.
- **Brand Cyan** ({colors.brand-cyan}): Atmospheric blue for product gradients and decorative wash.
- **Brand Blue 200** ({colors.brand-blue-200}): Code badges, info-tag backgrounds.
- **Brand Purple** ({colors.brand-purple}): Speech 2.8 and minor purple-product identity; gradient mate for magenta cards.

### Surface
- **Canvas White** ({colors.canvas}): Primary page background and card surface.
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest, sidebar-nav active state.
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions.
- **Hairline** ({colors.hairline}): 1px input border and primary divider.
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row divider and secondary section break.

### Text
- **Ink** ({colors.ink}): Primary headline and CTA text — the brand''s near-black anchor.
- **Ink Strong** ({colors.ink-strong}): Pure black used in promo banners and hero displays for maximum contrast.
- **Charcoal** ({colors.charcoal}): Body text on light surfaces.
- **Slate** ({colors.slate}): Secondary text, metadata.
- **Steel** ({colors.steel}): Tertiary text, table headers, sidebar inactive items.
- **Stone** ({colors.stone}): Muted captions and tab inactive labels.
- **Muted** ({colors.muted}): Footer link text and de-emphasized labels.

### Semantic
- **Success Background** ({colors.success-bg}): Pale-green wash for success badges and confirmations.
- **Success Text** ({colors.success-text}): Deep-green ink for success badge labels.
- Error tones derive from a `#d45656` red used in input border error states (not extracted as a top-level system token).

## Typography

### Font Family
**DM Sans** (primary): Geometric variable sans-serif. Used across every surface, every role. Fallbacks: Inter, Helvetica Neue, Helvetica, Arial.

DM Sans was chosen for its dual fluency: it scales cleanly from 80px hero displays (where -2px letter-spacing creates magazine-grade tightness) down to 12px micro labels (where the slightly humanist counters maintain legibility). The face has no italic variant in the brand''s deployment — emphasis comes from weight (500/600/700) instead.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 80px | 600 | 1.10 | -2px | Homepage hero ("MiniMax Music 2.6") |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.5px | Section openers, major page heroes |
| `{typography.heading-lg}` | 40px | 600 | 1.20 | -1px | Sub-page headlines ("Token Plan", "Models Overview") |
| `{typography.heading-md}` | 32px | 600 | 1.25 | -0.5px | Subsection headers ("Full-Stack Model Matrix") |
| `{typography.heading-sm}` | 24px | 600 | 1.30 | 0 | Card titles, feature headers |
| `{typography.card-title}` | 20px | 600 | 1.40 | 0 | Product-card titles, feature-tile headers |
| `{typography.subtitle}` | 18px | 500 | 1.50 | 0 | Section subtitles, lead body |
| `{typography.body-md}` | 16px | 400 | 1.50 | 0 | Primary body text |
| `{typography.body-md-bold}` | 16px | 700 | 1.50 | 0 | Body emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body, table cells, navigation |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Active sidebar nav, button labels |
| `{typography.caption}` | 13px | 400 | 1.70 | 0 | Documentation captions, fine print |
| `{typography.caption-bold}` | 13px | 600 | 1.50 | 0 | Badge labels, table-header text |
| `{typography.micro}` | 12px | 400 | 1.50 | 0 | Footer microcopy, chip labels |
| `{typography.button-md}` | 14px | 600 | 1.40 | 0 | Pill button labels |

### Principles
- **Tight hero leading** (1.10) and aggressive negative letter-spacing on display sizes create a magazine-quality typographic display unique to MiniMax.
- **Generous body leading** (1.50) keeps long-form documentation comfortable; captions push to 1.70 for scientific-paper-grade clarity.
- **Weight discipline:** 400 (body), 500 (medium emphasis), 600 (headings/buttons), 700 (strong inline emphasis). Heavier weights are not used.
- **Single typeface** strategy — never mix DM Sans with another sans-serif. Code samples (when shown) use a system monospace fallback, but no second typeface enters the brand canvas.

## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment).
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (80px) · `{spacing.hero}` (96px).
- **Section rhythm**: Marketing pages separate at `{spacing.hero}` (96px) above-fold, then `{spacing.section-lg}` (80px) below; documentation tightens to `{spacing.section}` (64px); table rows compress to `{spacing.md}` (16px).
- **Card internal padding**: Vibrant product cards use `{spacing.xxl}` (32px); documentation cards use `{spacing.lg}–{spacing.xl}` (20–24px); promo strips expand to `{spacing.section}` (64px).

### Grid & Container
- Marketing pages use a 1280px max-width with 32px gutters.
- Homepage product matrix renders as a 4-column row of 32px-rounded gradient cards, each ~280–320px wide.
- AI Product Matrix below uses a 4-column grid with 16px-rounded white cards.
- Documentation surfaces use a 3-column layout: left sidebar nav (~220px), center prose body (~720px max-width), right TOC (~180px). Sidebar persists on desktop; collapses to drawer below 1024px.
- Token Plan / pricing pages use 2-column tabs above a 3-column tier card grid.

### Whitespace Philosophy
Marketing pages give product photography and color cards generous breathing room — `{spacing.hero}` (96px) above-the-fold creates visual oxygen for the 80px hero display. Inside documentation, whitespace tightens dramatically: section gaps drop to `{spacing.xxl}` (32px), table rows pack down to `{spacing.md}` (16px), and the sidebar nav uses `{spacing.xs}` (8px) vertical rhythm.

## Elevation & Depth

The system runs predominantly flat. Elevation is reserved for sticky panels, dropdowns, and the rare floating CTA.

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline}` border | Default cards, table rows, form inputs |
| 1 (subtle) | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | Card-recommendation, hover-elevated tiles |
| 2 (card) | `rgba(0, 0, 0, 0.08) 0px 4px 6px 0px` | Standard feature cards, dropdowns |
| 3 (atmospheric) | `rgba(0, 0, 0, 0.08) 0px 0px 22px 0px` | Diffuse glow on featured product cards |
| 4 (modal) | `rgba(36, 36, 36, 0.08) 0px 12px 16px -4px` | Modals, confirmation dialogs, sticky panels |

### Decorative Depth
- The vibrant gradient product cards carry their own atmospheric depth via internal radial gradients and silhouette imagery — no shadow needed; the color does the work.
- Brand-tinted shadows (`rgba(44, 30, 116, 0.16) 0px 0px 15px`) appear under purple-themed cards for subtle ambient lift.
- Dotted/grain textures occasionally appear inside product cards as photographic-content decoration; these are not formalized as system tokens.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Code chips, micro-controls |
| `{rounded.sm}` | 6px | Compact controls, table cells |
| `{rounded.md}` | 8px | Inputs, secondary buttons, search pill |
| `{rounded.lg}` | 12px | Documentation cards, recommendation tiles |
| `{rounded.xl}` | 16px | Standard feature cards, AI product tiles |
| `{rounded.xxl}` | 20px | Larger feature panels |
| `{rounded.xxxl}` | 24px | AI product tile feature variants |
| `{rounded.hero}` | 32px | Vibrant gradient product cards, promo CTA strip |
| `{rounded.full}` | 9999px | All buttons, all pill tabs, badges |

### Photography Geometry
- Vibrant product cards use 32px corner softening — distinct from the 16px used on quiet white cards. The doubled radius is the visual signature of "this is a featured product moment."
- Product imagery inside cards is treated as photographic content (silhouettes, dark portrait studio lighting) without rounded internal frames.
- Avatar circles (rare, in testimonials) are `{rounded.full}` — perfect circles.

## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Black pill primary CTA, the dominant action across all surfaces.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `11px 24px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` lifts to `{colors.charcoal}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background and `{colors.muted}` text.

**`button-secondary`** — Outlined pill secondary action, paired with primary in dual-CTA hero patterns.
- Background transparent, text `{colors.ink}`, border `1px solid {colors.ink}`, typography `{typography.button-md}`, padding `11px 24px`, rounded `{rounded.full}`.

**`button-tertiary`** — White-fill quieter pill, used for tertiary nav and informational CTAs.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, typography `{typography.button-md}`, padding `11px 24px`, rounded `{rounded.full}`.

**`button-link`** — Inline text link styled as a subtle button.
- Background transparent, text `{colors.ink}`, typography `{typography.body-sm-medium}`, padding `8px 0`. Underline appears on activation.

**`button-icon-circular`** — 36×36px circular utility button (carousel arrows, share, copy).
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.full}`.

### Vibrant Product Cards

**`product-card-coral`** — M2.7 / Token Plan signature card.
- Background `{colors.brand-coral}`, text `{colors.on-dark}`, rounded `{rounded.hero}` (32px), padding `{spacing.xxl}`.
- Hosts the M2.7 wordmark in massive `{typography.display-lg}` with white tagline.

**`product-card-magenta`** — Music 2.6 product showcase.
- Background `{colors.brand-magenta}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

**`product-card-blue`** — Hailuo Video product showcase.
- Background `{colors.brand-blue}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

**`product-card-purple`** — Speech 2.8 / variant product showcase.
- Background `{colors.brand-purple}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

**`product-card-photo`** — Dark portrait product card (homepage S2 placement, video-emotion product).
- Background `{colors.primary}` (black with overlaid product photo), text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

### Cards & Containers

**`card-base`** — Standard documentation/feature card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-feature`** — Quieter feature panel on light gray.
- Background `{colors.surface}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`.

**`card-recommendation`** — "Recommended Reading" tile in documentation footer.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg}`, border `1px solid {colors.hairline}`.

**`promo-cta-card`** — Bright orange "Refunds of 10%..." promo strip with embedded CTA pill.
- Background `{colors.brand-coral}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.section}`. Embedded button uses `button-tertiary` (white pill on coral) for the "Join Now" action.

**`ai-product-tile`** — White card in the AI Product Matrix grid (Agent, Hailuo Video, MiniMax Audio).
- Background `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`. Carries an icon/illustration top, title `{typography.card-title}`, description `{typography.body-sm}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 40px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.brand-blue-deep}`.

**`text-input-error`** — Validation error state.
- Border switches to `1px solid #d45656`; error label below in matching red `{typography.body-sm}`.

**`search-pill`** — Documentation top-bar search field.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, height 36px, border `1px solid {colors.hairline}`.

### Tabs

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation (Benchmark / Self-Evaluation / Multi-Agent Collaboration on the M2.7 page).
- Inactive: text `{colors.steel}`, transparent background, padding `{spacing.md} {spacing.lg}`. Active: text shifts to `{colors.ink}`, 2px bottom border in `{colors.ink}`.

**`pill-tab`** + **`pill-tab-active`** — Pricing-page tab nav (Token Plan / Audio Subscription / Video Package).
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.primary}`, text `{colors.on-primary}`, no border (or matching black border).

### Badges & Status

**`badge-success`** — Pale-green confirmation badge ("Available", "Active").
- Background `{colors.success-bg}`, text `{colors.success-text}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-new`** — Coral "NEW" / "Live" pill for fresh releases.
- Background `{colors.brand-coral}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-beta`** — Pale-blue "BETA" / informational pill.
- Background `{colors.brand-blue-200}`, text `{colors.brand-blue-deep}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-code`** — Inline code-style chip ("Code", "API").
- Background `{colors.brand-blue-200}`, text `{colors.brand-blue-deep}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 6px`.

**`promo-banner`** — Sticky black promotional strip ABOVE the top nav ("Invite & Earn — Rewards for Both!").
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.lg}`. Carries one-line copy with optional inline link.

### Data Tables

**`data-table`** — Documentation models comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`data-table-header`** — Top header row of the data table.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.caption-bold}`, padding `{spacing.sm} {spacing.md}`.

**`data-table-row`** — Body rows.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, padding `{spacing.md}`, bottom border `1px solid {colors.hairline-soft}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar with logo, link list, and right-side CTAs.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline-soft}`.
- Left: MiniMax wordmark + horizontal link list (Models, Product, API, Company).
- Right: black-pill "Contact Us" + outlined-pill "Login".

**Top Navigation (Documentation/Platform)** — Compressed nav with center search-pill and right-side account/upgrade CTAs.
- Background `{colors.canvas}`, height ~56px, with search-pill at center and "Documentation / Account / Subscribe" links + black-pill "Sign Up" right.

**`sidebar-nav-item`** + **`sidebar-nav-item-active`** — Documentation left rail link entries.
- Inactive: background transparent, text `{colors.charcoal}`, typography `{typography.body-sm}`, rounded `{rounded.sm}`, padding `{spacing.xs} {spacing.md}`.
- Active: background `{colors.surface}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`.

**`doc-toc-item`** — Right-rail table-of-contents links.
- Background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xs} 0`. Active item color shifts to `{colors.ink}`.

### Signature Components

**`hero-band-marketing`** — Centered hero with massive 80px display + dual-CTA pair.
- Layout: centered headline in `{typography.hero-display}` ({colors.ink}), centered subtitle in `{typography.subtitle}` ({colors.steel}), centered button row (`button-primary` + `button-secondary`).

**`product-matrix-grid`** — 4-column horizontal scroll of vibrant gradient product cards (homepage "Full-Stack Model Matrix").
- Each tile uses one of the `product-card-*` variants (coral, magenta, blue, purple, photo).
- Card title in `{typography.display-lg}` (M2.7 wordmark) or `{typography.heading-lg}` (Music 2.6).
- Below the wordmark: thin tagline in `{typography.body-sm}` 80% white opacity.
- Optional badge top-right: `badge-new`.
- Card heights are uniform (~360–400px); the row scrolls horizontally on mobile.

**`ai-product-matrix`** — 4-column grid of white product tiles below the vibrant matrix (Agent / Hailuo Video / Audio / Video).
- Each tile is `ai-product-tile` chrome.
- Top: 100px-tall illustration zone (often line-art icon or 3D mark).
- Below: title in `{typography.card-title}`, description in `{typography.body-sm}` `{colors.steel}`.

**`docs-prose-block`** — Documentation main content area.
- Max-width ~720px, centered. Body in `{typography.body-md}` `{colors.charcoal}` line-height 1.6.
- Inline code in `{typography.body-md}` monospace fallback with `{colors.surface}` background and `{rounded.xs}` corners.

**`models-comparison-table`** — Documentation table comparing model sizes and features.
- Uses `data-table` chrome. Each row carries a model name (linkified, in `{colors.ink}` body-sm-medium), a description column (`{colors.charcoal}`), and a features bullet list column.

**`testimonial-stat-row`** — Stats strip ("214,000+ Enterprise Clients & Developers", "0+ Countries Served").
- Horizontal row of 4 stat cells, each cell with a large number in `{typography.heading-lg}` `{colors.ink}` and a label below in `{typography.body-sm}` `{colors.steel}`.

**`footer-region`** — Dense black-canvas multi-column footer.
- Background `{colors.footer-bg}`, padding `{spacing.section} {spacing.xxl}`.
- Top row: MiniMax wordmark ("intelligence with everyone" tagline) and social icons (X, Twitter, GitHub, etc.).
- Body: 4-column link grid (Research / Product / API / Company / News).
- Section headers in `{typography.body-sm-medium}` `{colors.on-dark}`.

**`footer-link`** — Individual link entry inside the footer column.
- Background transparent, text `{colors.muted}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`. Active/visited states do not change color — only opacity shifts on activation.

## Do''s and Don''ts

### Do
- Use `{colors.primary}` (black) as the dominant CTA — it''s the brand''s most recognizable interactive element.
- Reserve product brand colors (`{colors.brand-coral}`, `{colors.brand-magenta}`, `{colors.brand-blue}`, `{colors.brand-purple}`) ONLY for product-identity moments — never for general buttons or text.
- Pair `{rounded.hero}` (32px) gradient cards with `{rounded.xl}` (16px) white cards in the same viewport — the radius contrast is the visual signature.
- Apply `{rounded.full}` to every button, every pill tab, every badge.
- Use `{typography.hero-display}` (80px) with -2px letter-spacing for hero displays — never compromise the leading or letter-spacing.
- Treat each model/product line as a distinct color identity. M2.7 is coral, Music is magenta, Hailuo is blue. These are brand assignments, not free choices.

### Don''t
- Don''t use brand-coral or brand-magenta on body text or large surfaces — they lose meaning when overused.
- Don''t soften corners on buttons (anything less than `{rounded.full}`); the pill is a brand signature.
- Don''t introduce a second display typeface; DM Sans handles every role.
- Don''t reduce hero leading below 1.10 — the brand needs that breathing room on the 80px display.
- Don''t apply heavy shadows on white cards; flat-with-borders is the documentation default.
- Don''t put gradient backgrounds on standard buttons; gradients are reserved for product-card identity moments.

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero drops to 40px. Pill nav collapses to hamburger. Product matrix horizontal-scroll. Footer 1-column accordion. |
| Mobile (large) | 480 – 767px | Same as small but AI product matrix renders 2-up. |
| Tablet | 768 – 1023px | 2-column AI product matrix. Pill-tab nav returns. Documentation sidebar collapses to drawer. |
| Desktop | 1024 – 1279px | Full 4-column product matrix; 3-column docs grid (sidebar / body / TOC). |
| Wide Desktop | ≥ 1280px | Wider hero gutters, larger product photography, fixed 220px sidebar. |

### Touch Targets
- Pill buttons render at 38–40px effective height — bumps to 44px on mobile via padding override.
- Circular icon buttons: 36×36px desktop → 44×44px on mobile.
- Form inputs render at 40px height; bumps to 44px on mobile.
- Sidebar nav items render at ~32px tall — bumps to 44px on mobile drawers.

### Collapsing Strategy
- **Promo banner** stays full-width; collapses to single line at < 480px with truncation.
- **Top nav** below 1024px collapses to hamburger; horizontal links move into drawer.
- **Documentation grid**: 3-column desktop → sidebar-drawer at < 1024px → single-column with collapsible sidebar at < 768px.
- **Product matrix**: 4-column desktop → horizontal-scroll at < 1024px (carousel-style with snap points).
- **AI Product Matrix**: 4-column → 2-column at tablet → 1-column at mobile.
- **Hero typography**: `{typography.hero-display}` (80px) → 56px at < 1024px → 40px at < 768px → 32px at < 480px.
- **Stats strip**: 4-column → 2×2 at < 768px → 1-column at < 480px.

### Image Behavior
- Product card imagery uses photographic content with internal gradient overlays; lazy-loaded below the fold.
- AI product tile illustrations are SVG-based; remain crisp at all breakpoints.
- Avatar imagery in testimonials uses 1:1 aspect ratio with `{rounded.full}` masking.

## Iteration Guide

1. Focus on ONE component at a time. The system has high internal consistency.
2. Reference component names and tokens directly (`{colors.primary}`, `{component-name}-pressed`, `{rounded.full}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits to catch broken refs and contrast issues.
4. Add new variants as separate `components:` entries (`-pressed`, `-disabled`, `-active`).
5. Default to `{typography.body-md}` for body and `{typography.subtitle}` for emphasis. Headlines step down `hero-display → display-lg → heading-lg → heading-md → heading-sm`.
6. Keep brand colors (coral, magenta, blue, purple) confined to product-card identity. If a brand color appears on a standard button or generic surface, ask whether it earned that surface.
7. Pill-shaped buttons (`{rounded.full}`) always; squared buttons signal "third-party widget" in this language.

## Known Gaps

- Specific dark-mode token values (canvas, surface, ink, hairline) are not surfaced on these pages; the brand has not yet shipped a published dark-mode palette.
- Animation/transition timings are not extracted; recommend 150–200ms ease for hover/focus state transitions.
- Form validation success state is not explicitly captured beyond defaults — implement following standard green-border + success badge patterns.
- Code syntax highlighting palette inside docs is not formalized; documentation samples appear with system-default monospace and minimal coloring.
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

MiniMax stages itself as a Chinese AI infrastructure brand with a sophisticated dual identity. Marketing surfaces and platform pages anchor in stark white canvas with deep-black typographic emphasis — the brand voice is confident, technical, almost editorial. But each model release gets its own vibrant gradient identity card: M2.7 in volcanic coral-red, Music 2.6 in magenta-pink, Hailuo in deep blue, Speech 2.8 in saturated orange-purple. Together these vibrant tiles read like album covers laid out on the homepage — each one declaring its own product personality.

DM Sans anchors every surface from oversized 80px hero displays down to 12px micro labels. The geometric, slightly humanist character of the face suits both the dense documentation surfaces (where 14px body type carries 1.5 line-height for long-form prose) and the high-impact marketing displays (where -2px letter-spacing tightens 80px headlines). Buttons are universally pill-shaped (`rounded-full`) with a sharp two-tier system: black-pill primary (the dominant CTA) and outline-pill secondary. Cards split into two distinct families: vibrant gradient product showcases (32px corner softening) and quiet white documentation cards (16px corner softening).

**Key Characteristics:**
- Stark monochrome palette — black ({colors.primary}) and white ({colors.canvas}) — broken open by saturated brand-color gradient cards
- Distinct product-color encoding: each model line has its own vibrant brand color (coral M2.7, magenta Music 2.6, blue Hailuo, orange Speech 2.8)
- DM Sans across the entire system; Inter as fallback
- Pill-shaped buttons ({rounded.full}) and pill-shaped tabs everywhere; rectangular forms only inside data tables and dense docs
- Hero typography uses tight 1.10 line-height with -2px letter-spacing for impact
- Documentation surfaces use a 3-column layout: left sidebar nav, center prose body, right table-of-contents
- Black promo banners ({colors.primary}) above the nav for time-bound brand moments', '{"sourcePath":"docs/design-md/minimax/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: minimax.io/ (homepage), /models/text/m27 (product showcase), platform.minimax.io/docs/guides/models-intro (documentation), /subscribe/token-plan (pricing). Token coverage was identical across all four pages.

### Brand & Accent
- **Brand Coral** ({colors.brand-coral}): Signature high-impact accent. Used on M2.7 product card, "Token Plan" hero band, promo CTA strips, and "NEW" badges. Carries the brand''s most attention-grabbing energy.
- **Brand Magenta** ({colors.brand-magenta}): Secondary product-card identity (Music 2.6); used for music/audio product encoding.
- **Brand Blue** ({colors.brand-blue}): Hailuo video product identity; primary blue accent across the system.
- **Brand Blue Deep** ({colors.brand-blue-deep}): Form-control activation, link emphasis.
- **Brand Blue 700** ({colors.brand-blue-700}): Documentation tag and reference text color.
- **Brand Cyan** ({colors.brand-cyan}): Atmospheric blue for product gradients and decorative wash.
- **Brand Blue 200** ({colors.brand-blue-200}): Code badges, info-tag backgrounds.
- **Brand Purple** ({colors.brand-purple}): Speech 2.8 and minor purple-product identity; gradient mate for magenta cards.

### Surface
- **Canvas White** ({colors.canvas}): Primary page background and card surface.
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest, sidebar-nav active state.
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions.
- **Hairline** ({colors.hairline}): 1px input border and primary divider.
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row divider and secondary section break.

### Text
- **Ink** ({colors.ink}): Primary headline and CTA text — the brand''s near-black anchor.
- **Ink Strong** ({colors.ink-strong}): Pure black used in promo banners and hero displays for maximum contrast.
- **Charcoal** ({colors.charcoal}): Body text on light surfaces.
- **Slate** ({colors.slate}): Secondary text, metadata.
- **Steel** ({colors.steel}): Tertiary text, table headers, sidebar inactive items.
- **Stone** ({colors.stone}): Muted captions and tab inactive labels.
- **Muted** ({colors.muted}): Footer link text and de-emphasized labels.

### Semantic
- **Success Background** ({colors.success-bg}): Pale-green wash for success badges and confirmations.
- **Success Text** ({colors.success-text}): Deep-green ink for success badge labels.
- Error tones derive from a `#d45656` red used in input border error states (not extracted as a top-level system token).', '{"sourcePath":"docs/design-md/minimax/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**DM Sans** (primary): Geometric variable sans-serif. Used across every surface, every role. Fallbacks: Inter, Helvetica Neue, Helvetica, Arial.

DM Sans was chosen for its dual fluency: it scales cleanly from 80px hero displays (where -2px letter-spacing creates magazine-grade tightness) down to 12px micro labels (where the slightly humanist counters maintain legibility). The face has no italic variant in the brand''s deployment — emphasis comes from weight (500/600/700) instead.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 80px | 600 | 1.10 | -2px | Homepage hero ("MiniMax Music 2.6") |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.5px | Section openers, major page heroes |
| `{typography.heading-lg}` | 40px | 600 | 1.20 | -1px | Sub-page headlines ("Token Plan", "Models Overview") |
| `{typography.heading-md}` | 32px | 600 | 1.25 | -0.5px | Subsection headers ("Full-Stack Model Matrix") |
| `{typography.heading-sm}` | 24px | 600 | 1.30 | 0 | Card titles, feature headers |
| `{typography.card-title}` | 20px | 600 | 1.40 | 0 | Product-card titles, feature-tile headers |
| `{typography.subtitle}` | 18px | 500 | 1.50 | 0 | Section subtitles, lead body |
| `{typography.body-md}` | 16px | 400 | 1.50 | 0 | Primary body text |
| `{typography.body-md-bold}` | 16px | 700 | 1.50 | 0 | Body emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body, table cells, navigation |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Active sidebar nav, button labels |
| `{typography.caption}` | 13px | 400 | 1.70 | 0 | Documentation captions, fine print |
| `{typography.caption-bold}` | 13px | 600 | 1.50 | 0 | Badge labels, table-header text |
| `{typography.micro}` | 12px | 400 | 1.50 | 0 | Footer microcopy, chip labels |
| `{typography.button-md}` | 14px | 600 | 1.40 | 0 | Pill button labels |

### Principles
- **Tight hero leading** (1.10) and aggressive negative letter-spacing on display sizes create a magazine-quality typographic display unique to MiniMax.
- **Generous body leading** (1.50) keeps long-form documentation comfortable; captions push to 1.70 for scientific-paper-grade clarity.
- **Weight discipline:** 400 (body), 500 (medium emphasis), 600 (headings/buttons), 700 (strong inline emphasis). Heavier weights are not used.
- **Single typeface** strategy — never mix DM Sans with another sans-serif. Code samples (when shown) use a system monospace fallback, but no second typeface enters the brand canvas.', '{"sourcePath":"docs/design-md/minimax/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment).
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (80px) · `{spacing.hero}` (96px).
- **Section rhythm**: Marketing pages separate at `{spacing.hero}` (96px) above-fold, then `{spacing.section-lg}` (80px) below; documentation tightens to `{spacing.section}` (64px); table rows compress to `{spacing.md}` (16px).
- **Card internal padding**: Vibrant product cards use `{spacing.xxl}` (32px); documentation cards use `{spacing.lg}–{spacing.xl}` (20–24px); promo strips expand to `{spacing.section}` (64px).

### Grid & Container
- Marketing pages use a 1280px max-width with 32px gutters.
- Homepage product matrix renders as a 4-column row of 32px-rounded gradient cards, each ~280–320px wide.
- AI Product Matrix below uses a 4-column grid with 16px-rounded white cards.
- Documentation surfaces use a 3-column layout: left sidebar nav (~220px), center prose body (~720px max-width), right TOC (~180px). Sidebar persists on desktop; collapses to drawer below 1024px.
- Token Plan / pricing pages use 2-column tabs above a 3-column tier card grid.

### Whitespace Philosophy
Marketing pages give product photography and color cards generous breathing room — `{spacing.hero}` (96px) above-the-fold creates visual oxygen for the 80px hero display. Inside documentation, whitespace tightens dramatically: section gaps drop to `{spacing.xxl}` (32px), table rows pack down to `{spacing.md}` (16px), and the sidebar nav uses `{spacing.xs}` (8px) vertical rhythm.', '{"sourcePath":"docs/design-md/minimax/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

The system runs predominantly flat. Elevation is reserved for sticky panels, dropdowns, and the rare floating CTA.

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline}` border | Default cards, table rows, form inputs |
| 1 (subtle) | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | Card-recommendation, hover-elevated tiles |
| 2 (card) | `rgba(0, 0, 0, 0.08) 0px 4px 6px 0px` | Standard feature cards, dropdowns |
| 3 (atmospheric) | `rgba(0, 0, 0, 0.08) 0px 0px 22px 0px` | Diffuse glow on featured product cards |
| 4 (modal) | `rgba(36, 36, 36, 0.08) 0px 12px 16px -4px` | Modals, confirmation dialogs, sticky panels |

### Decorative Depth
- The vibrant gradient product cards carry their own atmospheric depth via internal radial gradients and silhouette imagery — no shadow needed; the color does the work.
- Brand-tinted shadows (`rgba(44, 30, 116, 0.16) 0px 0px 15px`) appear under purple-themed cards for subtle ambient lift.
- Dotted/grain textures occasionally appear inside product cards as photographic-content decoration; these are not formalized as system tokens.', '{"sourcePath":"docs/design-md/minimax/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Code chips, micro-controls |
| `{rounded.sm}` | 6px | Compact controls, table cells |
| `{rounded.md}` | 8px | Inputs, secondary buttons, search pill |
| `{rounded.lg}` | 12px | Documentation cards, recommendation tiles |
| `{rounded.xl}` | 16px | Standard feature cards, AI product tiles |
| `{rounded.xxl}` | 20px | Larger feature panels |
| `{rounded.xxxl}` | 24px | AI product tile feature variants |
| `{rounded.hero}` | 32px | Vibrant gradient product cards, promo CTA strip |
| `{rounded.full}` | 9999px | All buttons, all pill tabs, badges |

### Photography Geometry
- Vibrant product cards use 32px corner softening — distinct from the 16px used on quiet white cards. The doubled radius is the visual signature of "this is a featured product moment."
- Product imagery inside cards is treated as photographic content (silhouettes, dark portrait studio lighting) without rounded internal frames.
- Avatar circles (rare, in testimonials) are `{rounded.full}` — perfect circles.', '{"sourcePath":"docs/design-md/minimax/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Black pill primary CTA, the dominant action across all surfaces.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `11px 24px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` lifts to `{colors.charcoal}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background and `{colors.muted}` text.

**`button-secondary`** — Outlined pill secondary action, paired with primary in dual-CTA hero patterns.
- Background transparent, text `{colors.ink}`, border `1px solid {colors.ink}`, typography `{typography.button-md}`, padding `11px 24px`, rounded `{rounded.full}`.

**`button-tertiary`** — White-fill quieter pill, used for tertiary nav and informational CTAs.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, typography `{typography.button-md}`, padding `11px 24px`, rounded `{rounded.full}`.

**`button-link`** — Inline text link styled as a subtle button.
- Background transparent, text `{colors.ink}`, typography `{typography.body-sm-medium}`, padding `8px 0`. Underline appears on activation.

**`button-icon-circular`** — 36×36px circular utility button (carousel arrows, share, copy).
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.full}`.

### Vibrant Product Cards

**`product-card-coral`** — M2.7 / Token Plan signature card.
- Background `{colors.brand-coral}`, text `{colors.on-dark}`, rounded `{rounded.hero}` (32px), padding `{spacing.xxl}`.
- Hosts the M2.7 wordmark in massive `{typography.display-lg}` with white tagline.

**`product-card-magenta`** — Music 2.6 product showcase.
- Background `{colors.brand-magenta}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

**`product-card-blue`** — Hailuo Video product showcase.
- Background `{colors.brand-blue}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

**`product-card-purple`** — Speech 2.8 / variant product showcase.
- Background `{colors.brand-purple}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

**`product-card-photo`** — Dark portrait product card (homepage S2 placement, video-emotion product).
- Background `{colors.primary}` (black with overlaid product photo), text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

### Cards & Containers

**`card-base`** — Standard documentation/feature card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-feature`** — Quieter feature panel on light gray.
- Background `{colors.surface}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`.

**`card-recommendation`** — "Recommended Reading" tile in documentation footer.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg}`, border `1px solid {colors.hairline}`.

**`promo-cta-card`** — Bright orange "Refunds of 10%..." promo strip with embedded CTA pill.
- Background `{colors.brand-coral}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.section}`. Embedded button uses `button-tertiary` (white pill on coral) for the "Join Now" action.

**`ai-product-tile`** — White card in the AI Product Matrix grid (Agent, Hailuo Video, MiniMax Audio).
- Background `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`. Carries an icon/illustration top, title `{typography.card-title}`, description `{typography.body-sm}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 40px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.brand-blue-deep}`.

**`text-input-error`** — Validation error state.
- Border switches to `1px solid #d45656`; error label below in matching red `{typography.body-sm}`.

**`search-pill`** — Documentation top-bar search field.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, height 36px, border `1px solid {colors.hairline}`.

### Tabs

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation (Benchmark / Self-Evaluation / Multi-Agent Collaboration on the M2.7 page).
- Inactive: text `{colors.steel}`, transparent background, padding `{spacing.md} {spacing.lg}`. Active: text shifts to `{colors.ink}`, 2px bottom border in `{colors.ink}`.

**`pill-tab`** + **`pill-tab-active`** — Pricing-page tab nav (Token Plan / Audio Subscription / Video Package).
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.primary}`, text `{colors.on-primary}`, no border (or matching black border).

### Badges & Status

**`badge-success`** — Pale-green confirmation badge ("Available", "Active").
- Background `{colors.success-bg}`, text `{colors.success-text}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-new`** — Coral "NEW" / "Live" pill for fresh releases.
- Background `{colors.brand-coral}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-beta`** — Pale-blue "BETA" / informational pill.
- Background `{colors.brand-blue-200}`, text `{colors.brand-blue-deep}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-code`** — Inline code-style chip ("Code", "API").
- Background `{colors.brand-blue-200}`, text `{colors.brand-blue-deep}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 6px`.

**`promo-banner`** — Sticky black promotional strip ABOVE the top nav ("Invite & Earn — Rewards for Both!").
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.lg}`. Carries one-line copy with optional inline link.

### Data Tables

**`data-table`** — Documentation models comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`data-table-header`** — Top header row of the data table.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.caption-bold}`, padding `{spacing.sm} {spacing.md}`.

**`data-table-row`** — Body rows.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, padding `{spacing.md}`, bottom border `1px solid {colors.hairline-soft}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar with logo, link list, and right-side CTAs.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline-soft}`.
- Left: MiniMax wordmark + horizontal link list (Models, Product, API, Company).
- Right: black-pill "Contact Us" + outlined-pill "Login".

**Top Navigation (Documentation/Platform)** — Compressed nav with center search-pill and right-side account/upgrade CTAs.
- Background `{colors.canvas}`, height ~56px, with search-pill at center and "Documentation / Account / Subscribe" links + black-pill "Sign Up" right.

**`sidebar-nav-item`** + **`sidebar-nav-item-active`** — Documentation left rail link entries.
- Inactive: background transparent, text `{colors.charcoal}`, typography `{typography.body-sm}`, rounded `{rounded.sm}`, padding `{spacing.xs} {spacing.md}`.
- Active: background `{colors.surface}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`.

**`doc-toc-item`** — Right-rail table-of-contents links.
- Background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xs} 0`. Active item color shifts to `{colors.ink}`.

### Signature Components

**`hero-band-marketing`** — Centered hero with massive 80px display + dual-CTA pair.
- Layout: centered headline in `{typography.hero-display}` ({colors.ink}), centered subtitle in `{typography.subtitle}` ({colors.steel}), centered button row (`button-primary` + `button-secondary`).

**`product-matrix-grid`** — 4-column horizontal scroll of vibrant gradient product cards (homepage "Full-Stack Model Matrix").
- Each tile uses one of the `product-card-*` variants (coral, magenta, blue, purple, photo).
- Card title in `{typography.display-lg}` (M2.7 wordmark) or `{typography.heading-lg}` (Music 2.6).
- Below the wordmark: thin tagline in `{typography.body-sm}` 80% white opacity.
- Optional badge top-right: `badge-new`.
- Card heights are uniform (~360–400px); the row scrolls horizontally on mobile.

**`ai-product-matrix`** — 4-column grid of white product tiles below the vibrant matrix (Agent / Hailuo Video / Audio / Video).
- Each tile is `ai-product-tile` chrome.
- Top: 100px-tall illustration zone (often line-art icon or 3D mark).
- Below: title in `{typography.card-title}`, description in `{typography.body-sm}` `{colors.steel}`.

**`docs-prose-block`** — Documentation main content area.
- Max-width ~720px, centered. Body in `{typography.body-md}` `{colors.charcoal}` line-height 1.6.
- Inline code in `{typography.body-md}` monospace fallback with `{colors.surface}` background and `{rounded.xs}` corners.

**`models-comparison-table`** — Documentation table comparing model sizes and features.
- Uses `data-table` chrome. Each row carries a model name (linkified, in `{colors.ink}` body-sm-medium), a description column (`{colors.charcoal}`), and a features bullet list column.

**`testimonial-stat-row`** — Stats strip ("214,000+ Enterprise Clients & Developers", "0+ Countries Served").
- Horizontal row of 4 stat cells, each cell with a large number in `{typography.heading-lg}` `{colors.ink}` and a label below in `{typography.body-sm}` `{colors.steel}`.

**`footer-region`** — Dense black-canvas multi-column footer.
- Background `{colors.footer-bg}`, padding `{spacing.section} {spacing.xxl}`.
- Top row: MiniMax wordmark ("intelligence with everyone" tagline) and social icons (X, Twitter, GitHub, etc.).
- Body: 4-column link grid (Research / Product / API / Company / News).
- Section headers in `{typography.body-sm-medium}` `{colors.on-dark}`.

**`footer-link`** — Individual link entry inside the footer column.
- Background transparent, text `{colors.muted}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`. Active/visited states do not change color — only opacity shifts on activation.', '{"sourcePath":"docs/design-md/minimax/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Use `{colors.primary}` (black) as the dominant CTA — it''s the brand''s most recognizable interactive element.
- Reserve product brand colors (`{colors.brand-coral}`, `{colors.brand-magenta}`, `{colors.brand-blue}`, `{colors.brand-purple}`) ONLY for product-identity moments — never for general buttons or text.
- Pair `{rounded.hero}` (32px) gradient cards with `{rounded.xl}` (16px) white cards in the same viewport — the radius contrast is the visual signature.
- Apply `{rounded.full}` to every button, every pill tab, every badge.
- Use `{typography.hero-display}` (80px) with -2px letter-spacing for hero displays — never compromise the leading or letter-spacing.
- Treat each model/product line as a distinct color identity. M2.7 is coral, Music is magenta, Hailuo is blue. These are brand assignments, not free choices.

### Don''t
- Don''t use brand-coral or brand-magenta on body text or large surfaces — they lose meaning when overused.
- Don''t soften corners on buttons (anything less than `{rounded.full}`); the pill is a brand signature.
- Don''t introduce a second display typeface; DM Sans handles every role.
- Don''t reduce hero leading below 1.10 — the brand needs that breathing room on the 80px display.
- Don''t apply heavy shadows on white cards; flat-with-borders is the documentation default.
- Don''t put gradient backgrounds on standard buttons; gradients are reserved for product-card identity moments.', '{"sourcePath":"docs/design-md/minimax/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero drops to 40px. Pill nav collapses to hamburger. Product matrix horizontal-scroll. Footer 1-column accordion. |
| Mobile (large) | 480 – 767px | Same as small but AI product matrix renders 2-up. |
| Tablet | 768 – 1023px | 2-column AI product matrix. Pill-tab nav returns. Documentation sidebar collapses to drawer. |
| Desktop | 1024 – 1279px | Full 4-column product matrix; 3-column docs grid (sidebar / body / TOC). |
| Wide Desktop | ≥ 1280px | Wider hero gutters, larger product photography, fixed 220px sidebar. |

### Touch Targets
- Pill buttons render at 38–40px effective height — bumps to 44px on mobile via padding override.
- Circular icon buttons: 36×36px desktop → 44×44px on mobile.
- Form inputs render at 40px height; bumps to 44px on mobile.
- Sidebar nav items render at ~32px tall — bumps to 44px on mobile drawers.

### Collapsing Strategy
- **Promo banner** stays full-width; collapses to single line at < 480px with truncation.
- **Top nav** below 1024px collapses to hamburger; horizontal links move into drawer.
- **Documentation grid**: 3-column desktop → sidebar-drawer at < 1024px → single-column with collapsible sidebar at < 768px.
- **Product matrix**: 4-column desktop → horizontal-scroll at < 1024px (carousel-style with snap points).
- **AI Product Matrix**: 4-column → 2-column at tablet → 1-column at mobile.
- **Hero typography**: `{typography.hero-display}` (80px) → 56px at < 1024px → 40px at < 768px → 32px at < 480px.
- **Stats strip**: 4-column → 2×2 at < 768px → 1-column at < 480px.

### Image Behavior
- Product card imagery uses photographic content with internal gradient overlays; lazy-loaded below the fold.
- AI product tile illustrations are SVG-based; remain crisp at all breakpoints.
- Avatar imagery in testimonials uses 1:1 aspect ratio with `{rounded.full}` masking.', '{"sourcePath":"docs/design-md/minimax/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. The system has high internal consistency.
2. Reference component names and tokens directly (`{colors.primary}`, `{component-name}-pressed`, `{rounded.full}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits to catch broken refs and contrast issues.
4. Add new variants as separate `components:` entries (`-pressed`, `-disabled`, `-active`).
5. Default to `{typography.body-md}` for body and `{typography.subtitle}` for emphasis. Headlines step down `hero-display → display-lg → heading-lg → heading-md → heading-sm`.
6. Keep brand colors (coral, magenta, blue, purple) confined to product-card identity. If a brand color appears on a standard button or generic surface, ask whether it earned that surface.
7. Pill-shaped buttons (`{rounded.full}`) always; squared buttons signal "third-party widget" in this language.', '{"sourcePath":"docs/design-md/minimax/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Specific dark-mode token values (canvas, surface, ink, hairline) are not surfaced on these pages; the brand has not yet shipped a published dark-mode palette.
- Animation/transition timings are not extracted; recommend 150–200ms ease for hover/focus state transitions.
- Form validation success state is not explicitly captured beyond defaults — implement following standard green-border + success badge patterns.
- Code syntax highlighting palette inside docs is not formalized; documentation samples appear with system-default monospace and minimal coloring.', '{"sourcePath":"docs/design-md/minimax/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_1', '#0a0a0a', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_3', '#181e25', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_4', '#ff5530', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_5', '#ea5ec1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_6', '#1456f0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_7', '#3b82f6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_8', '#1d4ed8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_9', '#17437d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_10', '#3daeff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_11', '#bfdbfe', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_12', '#a855f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_13', '#f7f8fa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_14', '#f2f3f5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_15', '#e5e7eb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_16', '#eaecf0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_17', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_18', '#222222', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_19', '#45515e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_20', '#5f5f5f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_21', '#8e8e93', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_22', '#a8aab2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_23', '#e8ffea', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_24', '#1ba673', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md'), 'color', 'color_25', '#d45656', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/minimax/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/minimax/DESIGN.md';


-- Mintlify
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Mintlify', 'mintlify', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/mintlify/DESIGN.md', null, 'seeded', '---
version: alpha
name: Mintlify-design-analysis
description: Mintlify presents documentation infrastructure with a dual-mode aesthetic — atmospheric sky-gradient marketing heroes (cloud illustration backdrops, soft cream-to-blue washes) paired with dense developer-grade documentation surfaces. The system uses Inter for UI prose, Geist Mono for code, and a signature Mintlify green ({colors.brand-green}) reserved for accent CTAs and active states. Black-pill primary buttons dominate marketing, white-on-dark inversions appear on dark hero bands, and a 3-column documentation layout (sidebar / prose / TOC) anchors the developer experience. Coverage spans homepage, startups program, pricing comparison, and the live tabs documentation page.

colors:
  primary: "#0a0a0a"
  on-primary: "#ffffff"
  brand-green: "#00d4a4"
  brand-green-deep: "#00b48a"
  brand-green-soft: "#7cebcb"
  brand-tag: "#3772cf"
  brand-warn: "#c37d0d"
  brand-annotate: "#1ba673"
  brand-error: "#d45656"
  brand-cursor: "#888888"
  hero-sky-from: "#87a8c8"
  hero-sky-to: "#f5e9d8"
  hero-dark-from: "#1a3d4a"
  hero-dark-to: "#2d5a4f"
  testimonial-orange: "#f55a3c"
  testimonial-orange-deep: "#cc3a1f"
  canvas: "#ffffff"
  canvas-dark: "#0a0a0a"
  surface: "#f7f7f7"
  surface-soft: "#fafafa"
  surface-code: "#1c1c1e"
  hairline: "#e5e5e5"
  hairline-soft: "#ededed"
  hairline-dark: "#1f1f1f"
  ink: "#0a0a0a"
  charcoal: "#1c1c1e"
  slate: "#3a3a3c"
  steel: "#5a5a5c"
  stone: "#888888"
  muted: "#a8a8aa"
  on-dark: "#ffffff"
  on-dark-muted: "#b3b3b3"

typography:
  hero-display:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -2px
  display-lg:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1.5px
  heading-1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1px
  heading-2:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.5px
  heading-3:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
  heading-4:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.30
  heading-5:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.40
  subtitle:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
  body-md-medium:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.50
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  body-sm-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.50
  caption:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  caption-bold:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.40
  micro:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.40
  micro-uppercase:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: 0.5px
  button-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.30
  code-md:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  code-sm:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  code-inline:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.30

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section-sm: 48px
  section: 64px
  section-lg: 96px
  hero: 120px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-primary-pressed:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.muted}"
  button-accent-green:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-on-dark:
    backgroundColor: "{colors.on-dark}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
    border: "1px solid {colors.hairline}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    padding: "0"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 32px
    border: "1px solid {colors.hairline}"
  card-base:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-feature:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-help:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-startup-perk:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  pricing-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  pricing-card-featured:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "2px solid {colors.brand-green}"
    shadow: "rgba(0, 212, 164, 0.08) 0px 8px 24px"
  testimonial-card-feature:
    backgroundColor: "{colors.testimonial-orange}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.section}"
  testimonial-card-quote:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline}"
    height: 40px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.brand-green}"
  search-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.xs} {spacing.md}"
    height: 36px
    border: "1px solid {colors.hairline}"
  segmented-tab:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
    border: "0 0 2px transparent solid"
  segmented-tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    border: "0 0 2px {colors.ink} solid"
  pill-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    border: "1px solid {colors.hairline}"
  pill-tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    border: "1px solid {colors.primary}"
  toggle-monthly-yearly:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "4px"
  badge-discount:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  badge-required:
    backgroundColor: "{colors.brand-error}"
    textColor: "{colors.on-dark}"
    typography: "{typography.micro-uppercase}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  badge-type:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  badge-tag:
    backgroundColor: "rgba(55, 114, 207, 0.15)"
    textColor: "{colors.brand-tag}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  promo-banner:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
  code-block:
    backgroundColor: "{colors.surface-code}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  code-block-header:
    backgroundColor: "{colors.surface-code}"
    textColor: "{colors.on-dark-muted}"
    typography: "{typography.caption}"
    padding: "{spacing.xs} {spacing.md}"
    border: "0 0 1px {colors.hairline-dark} solid"
  code-inline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.charcoal}"
    typography: "{typography.code-inline}"
    rounded: "{rounded.xs}"
    padding: "2px 6px"
    border: "1px solid {colors.hairline}"
  property-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "{spacing.md} 0"
    border: "0 0 1px {colors.hairline-soft} solid"
  feature-comparison-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
  feature-comparison-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "{spacing.md} {spacing.lg}"
    border: "0 0 1px {colors.hairline-soft} solid"
  sidebar-nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
  sidebar-nav-item-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
  sidebar-section-header:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.micro-uppercase}"
    padding: "{spacing.md} {spacing.md} {spacing.xs}"
  doc-toc-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
  doc-toc-item-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
  copy-code-button:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.xs}"
    border: "1px solid {colors.hairline-dark}"
  hero-band-sky:
    backgroundColor: "{colors.hero-sky-from}"
    textColor: "{colors.on-dark}"
    rounded: "0"
    padding: "{spacing.hero}"
  hero-band-dark:
    backgroundColor: "{colors.hero-dark-from}"
    textColor: "{colors.on-dark}"
    rounded: "0"
    padding: "{spacing.hero}"
  hero-product-mockup:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "0"
    border: "1px solid {colors.hairline-soft}"
    shadow: "rgba(0, 0, 0, 0.12) 0px 24px 48px -8px"
  logo-wall-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-md-medium}"
    padding: "{spacing.lg}"
  faq-accordion-item:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline-soft}"
  footer-region:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.section} {spacing.xxl}"
    border: "1px solid {colors.hairline}"
  footer-link:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
  startup-program-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  founder-quote-card:
    backgroundColor: "{colors.testimonial-orange}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
---

## Overview

Mintlify positions itself at the intersection of polished marketing presentation and developer-grade documentation density. The home and startups pages open with cinematic atmospheric heroes — soft sky-gradient backdrops with cloud illustrations on the homepage, dark teal-to-mint gradients with a rocket launch on the startups page — that feel more like a SaaS landing aesthetic than a developer tool. Then the deeper surfaces (pricing comparison, live documentation pages) collapse into dense, high-information layouts where Inter body type carries 14–16px copy across long-form prose, syntax-highlighted code blocks, and 3-column documentation grids.

The brand''s signature mint green ({colors.brand-green}) appears sparingly but decisively — on the hero "Get started" pill button, the green checkmark icons inside feature lists, the "Featured" pricing tier border, and active state indicators inside docs UI. Black-pill primary buttons dominate the marketing flow; white-on-dark inversions appear on dark hero bands. The signature pairing of Inter (body, headings) with Geist Mono (code blocks, inline references, type signatures) reinforces the developer-tool DNA without requiring a third typeface.

**Key Characteristics:**
- Atmospheric gradient hero bands (sky-blue to cream on homepage; teal-to-mint on startups) provide cinematic marketing presentation
- Signature Mintlify mint green ({colors.brand-green}) reserved for accent CTAs, active states, and feature confirmations
- Black-pill primary buttons ({colors.primary} + `{rounded.full}`) for marketing CTAs
- Inter for all UI prose; Geist Mono for code blocks, inline code, and type/property signatures
- 3-column documentation layout (sidebar / prose / TOC) with dense 14px body type for long-form developer reading
- Tightly-controlled radius scale: marketing uses `{rounded.lg}` (12px), pill buttons use `{rounded.full}` — no in-between corner softening
- Vibrant testimonial card (`{colors.testimonial-orange}`) breaks color rhythm intentionally for emotional impact

## Colors

> Source pages: mintlify.com/ (homepage), /startups (program page), /pricing (comparison), /docs/components/tabs (live documentation). Token coverage was identical across all four pages.

### Brand & Accent
- **Mintlify Mint** ({colors.brand-green}): Signature accent — used on hero "Get started" pill button, green checkmarks in feature lists, featured pricing tier border accent, sidebar active indicator dots.
- **Deep Mint** ({colors.brand-green-deep}): Pressed/active variant of the mint accent.
- **Soft Mint** ({colors.brand-green-soft}): Subtle background tint for success states and confirmation surfaces.
- **Brand Tag** ({colors.brand-tag}): Documentation tag and reference color (used in `<Tabs>` JSX-style annotations and code-tag chips).
- **Brand Annotate** ({colors.brand-annotate}): Inline code annotation green (used in twoslash code annotation system).
- **Brand Warn** ({colors.brand-warn}): Code warning highlight (deprecated, caution).
- **Brand Error** ({colors.brand-error}): Red used for required-field labels and error highlight.
- **Testimonial Orange** ({colors.testimonial-orange}): Warm coral-orange used on the "Cursor" testimonial card and warm callout surfaces.

### Surface
- **Canvas White** ({colors.canvas}): Primary page and card background.
- **Canvas Dark** ({colors.canvas-dark}): Promo banner, dark inversion surfaces, code editor wrapper.
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest, code-inline background, sidebar active state.
- **Surface Soft** ({colors.surface-soft}): Quieter section backgrounds and FAQ accordion.
- **Surface Code** ({colors.surface-code}): Dark code-block wrapper background.
- **Hairline** ({colors.hairline}): 1px borders and primary dividers.
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row dividers and secondary section breaks.

### Hero Atmospheric
- **Hero Sky From / To** ({colors.hero-sky-from}, {colors.hero-sky-to}): Atmospheric sky-blue to soft cream gradient on the homepage hero.
- **Hero Dark From / To** ({colors.hero-dark-from}, {colors.hero-dark-to}): Dark teal to mint gradient on the startups hero.

### Text
- **Ink** ({colors.ink}): Primary headlines and CTA text.
- **Charcoal** ({colors.charcoal}): Body text, code-inline foreground.
- **Slate** ({colors.slate}): Secondary text and metadata.
- **Steel** ({colors.steel}): Tertiary text, table headers, sidebar inactive items, footer links.
- **Stone** ({colors.stone}): Captions, twoslash cursor color, muted labels.
- **Muted** ({colors.muted}): De-emphasized labels and disabled text.
- **On Dark** ({colors.on-dark}): White text on dark surfaces (hero bands, code blocks, promo banner).
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white for code-block headers and metadata on dark.

### Semantic
- Error tones derive from `{colors.brand-error}` for input borders, required-field labels, and validation messaging.

## Typography

### Font Family
**Inter** (primary): Variable typeface optimized for UI legibility. Used across every UI surface — body, headings, navigation, button labels, captions. Fallbacks: -apple-system, BlinkMacSystemFont, ''Segoe UI'', sans-serif.

**Geist Mono** (code): Monospace typeface used inside code blocks, inline code references, type signatures (e.g. `string`, `number`, `boolean`), and property names in API documentation. Fallbacks: ''SF Mono'', Menlo, Consolas, ''Geist Mono Fallback'', monospace.

The brand uses no italic variants of either face — emphasis comes from weight (500/600), color shift, or background highlighting (in code references).

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 72px | 600 | 1.05 | -2px | Marketing hero display ("The intelligent Knowledge Platform") |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.5px | Major section opener ("Built for the intelligence age") |
| `{typography.heading-1}` | 48px | 600 | 1.10 | -1px | Page-level headlines ("Pricing on your terms") |
| `{typography.heading-2}` | 36px | 600 | 1.20 | -0.5px | Section headlines ("Apply to the Mintlify startup program") |
| `{typography.heading-3}` | 28px | 600 | 1.25 | 0 | Subsection headers, "Tabs" docs page title |
| `{typography.heading-4}` | 22px | 600 | 1.30 | 0 | Card titles, larger feature headers |
| `{typography.heading-5}` | 18px | 600 | 1.40 | 0 | Smaller feature headers, FAQ question titles |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Hero subtitle, lead body |
| `{typography.body-md}` | 16px | 400 | 1.50 | 0 | Primary body text |
| `{typography.body-md-medium}` | 16px | 500 | 1.50 | 0 | Body emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body, table cells, navigation |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Active sidebar nav, button labels, tab labels |
| `{typography.caption}` | 13px | 400 | 1.40 | 0 | Helper text, fine print, code-block headers |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Badge labels |
| `{typography.micro}` | 12px | 500 | 1.40 | 0 | Footer microcopy, label chips |
| `{typography.micro-uppercase}` | 11px | 600 | 1.40 | 0.5px | Sidebar section headers, "REQUIRED" labels |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | Pill button labels |
| `{typography.code-md}` | 14px | 400 | 1.50 | 0 | Code block content |
| `{typography.code-sm}` | 13px | 400 | 1.40 | 0 | Smaller code, type signatures |
| `{typography.code-inline}` | 13px | 500 | 1.30 | 0 | Inline `<Tabs>` references in body |

### Principles
- **Tight hero leading** (1.05) creates magazine-grade display headlines on the 72px hero
- **Negative letter-spacing** progresses inversely with size — display sizes use -2px to -1.5px; smaller headings relax to 0
- **Documentation-grade body** (1.50 line-height on 14–16px) ensures comfortable long-form reading in dense docs surfaces
- **Inter / Geist Mono pairing** — Inter for everything else, Geist Mono surgically for code references; the contrast between the two is the brand''s developer-respect signal
- **Uppercase micro labels** with +0.5px letter-spacing carry sidebar section headers and "REQUIRED" annotation tags

## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (96px) · `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px) between major bands; pricing comparison tightens to `{spacing.section}` (64px); documentation surfaces use `{spacing.xxl}` (32px) between subsections
- **Card internal padding**: Standard `{spacing.xl}` (24px) for compact cards; `{spacing.xxl}` (32px) for pricing cards and feature panels; testimonial card pushes to `{spacing.section}` (64px) for hero-card presence

### Grid & Container
- Marketing pages use a 1280px max-width with 32px gutters
- Hero and feature bands often use 2-column splits (text left, illustration/mockup right)
- Pricing page renders 3 tier cards in a row at desktop (FREE / Lift Off / Custom), then a comprehensive feature comparison table below
- Documentation pages use a strict 3-column grid: left sidebar nav (~240px), center prose (~720px max-width), right TOC (~200px)
- Logo walls use 6-up rows of customer logos at 80–100px height each

### Whitespace Philosophy
Marketing surfaces give content generous breathing room — `{spacing.hero}` (120px) above-the-fold creates space for atmospheric gradient backdrops to read clearly. Documentation tightens dramatically: section gaps drop to `{spacing.xxl}` (32px), table rows pack to `{spacing.md}` (16px), sidebar nav compresses to `{spacing.xs}` (8px) vertical rhythm.

## Elevation & Depth

The system runs predominantly flat with strategic atmospheric depth.

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline}` border | Default cards, table rows, form inputs |
| 1 (subtle) | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | Hover-elevated tiles, subtle highlights |
| 2 (card) | `rgba(0, 0, 0, 0.08) 0px 4px 12px 0px` | Standard feature cards |
| 3 (mockup) | `rgba(0, 0, 0, 0.12) 0px 24px 48px -8px` | Hero product mockup framing — the deep diffuse drop on the homepage hero docs preview |
| 4 (brand-tinted) | `rgba(0, 212, 164, 0.08) 0px 8px 24px` | Featured pricing tier glow |

### Decorative Depth
- The homepage hero uses an atmospheric photographic backdrop (cloud illustration on sky-gradient) for depth — no shadow needed; the imagery does the work
- The startups hero uses a similar treatment with a rocket-launch illustration cutting across the dark teal gradient
- Code blocks carry their own internal depth via syntax-highlighting color hierarchy on the dark surface; no shadow used

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Inline code chips, micro tags |
| `{rounded.sm}` | 6px | Sidebar nav items, type badges |
| `{rounded.md}` | 8px | Inputs, search pill, code blocks, secondary cards |
| `{rounded.lg}` | 12px | Standard cards, pricing tiers, hero mockup, FAQ items |
| `{rounded.xl}` | 16px | Larger feature panels |
| `{rounded.xxl}` | 24px | Featured product showcase tiles |
| `{rounded.full}` | 9999px | All buttons, pill tabs, badges |

The radius scale is tightly disciplined — the brand never uses a corner softening between `{rounded.md}` (8px) and `{rounded.lg}` (12px) for the same component family. Pill buttons (`{rounded.full}`) are used universally; rectangular cards use `{rounded.lg}` (12px) consistently.

### Photography Geometry
- Hero illustrations (cloud, rocket) sit on full-bleed gradient backdrops with no internal framing
- Customer logo walls use 1:1 ratio cells without rounding (logos are presented inline as wordmarks)
- Testimonial photos use 1:1 aspect with `{rounded.md}` (8px) softening
- Code editor mockup hero image uses `{rounded.lg}` (12px) corners on a hairline-bordered card with a deep diffuse drop shadow

## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Black pill primary CTA, the dominant action across all surfaces.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` lifts to `{colors.charcoal}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background and `{colors.muted}` text.

**`button-accent-green`** — Mint green pill for brand-emphasis CTAs (hero "Get started", featured pricing CTA).
- Background `{colors.brand-green}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.

**`button-on-dark`** — White pill for use on dark hero bands (startups page "Get started").
- Background `{colors.on-dark}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.

**`button-secondary`** — Outlined pill for secondary actions.
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.

**`button-ghost`** — Quieter rectangular ghost button (sidebar action, tertiary nav).
- Background transparent, text `{colors.ink}`, typography `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.md}`.

**`button-link`** — Inline text link styled as a subtle button.
- Background transparent, text `{colors.ink}`, typography `{typography.body-sm-medium}`, padding `0`. Underline appears on activation.

**`button-icon-circular`** — 32×32px circular utility button (close, copy, arrow).
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.full}`.

### Cards & Containers

**`card-base`** — Standard documentation/feature card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-feature`** — Feature panel on light gray surface.
- Background `{colors.surface}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-help`** — "Need help?" CTA cards below the pricing comparison ("Quickstart guide", "Guide to technical writing", "Founder", "Sales").
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-startup-perk`** — Startup-program perk grid item ("Discounts and credits", "Priority support", "Startup pack", "Founder community").
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`. Carries an icon at top, heading `{typography.heading-5}`, description `{typography.body-sm}` `{colors.steel}`.

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.
- Title `{typography.heading-3}`, price `{typography.display-lg}`, feature list `{typography.body-sm}` with green checkmark icons.

**`pricing-card-featured`** — Highlighted pricing tier (Lift Off / featured plan).
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `2px solid {colors.brand-green}`, soft brand-tinted shadow `rgba(0, 212, 164, 0.08) 0px 8px 24px`.

**`testimonial-card-feature`** — Bright orange large testimonial card with photo + quote ("Cursor — Every YC batch we consistently see the top performing startups use Mintlify to build their docs.").
- Background `{colors.testimonial-orange}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.section}`. Photo on right, large quote in `{typography.heading-3}` left, attribution below in `{typography.body-sm-medium}`.

**`testimonial-card-quote`** — Smaller white testimonial card on the startups page.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`founder-quote-card`** — Cursor founder testimonial card variant on the orange surface.
- Background `{colors.testimonial-orange}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`. Carries the specific founder portrait + quote treatment.

**`startup-program-card`** — Larger application/program card containing perks grid + apply CTA.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 40px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.brand-green}` — focus uses the brand mint as the activation signal.

**`search-pill`** — Documentation top-bar search.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, height 36px, border `1px solid {colors.hairline}`.

### Tabs

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation (used inside docs Tabs component for "First tab / Second tab / Third tab").
- Inactive: text `{colors.steel}`, transparent background, padding `{spacing.sm} {spacing.md}`. Active: text `{colors.ink}`, 2px bottom border in `{colors.ink}`.

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav (top of pricing page: "Pricing / Roadmap").
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `8px 16px`, rounded `{rounded.full}`.
- Active: background `{colors.primary}`, text `{colors.on-primary}`, no border.

**`toggle-monthly-yearly`** — Two-state pill toggle (Monthly / Annual on pricing page).
- Background `{colors.surface}`, rounded `{rounded.full}`, padding `4px`. Active state moves a white pill thumb to the selected position.

### Badges & Status

**`badge-discount`** — Small green "Save 20%" badge attached to annual toggle.
- Background `{colors.brand-green}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `2px 8px`.

**`badge-required`** — Red "REQUIRED" label on documentation property rows.
- Background `{colors.brand-error}`, text `{colors.on-dark}`, typography `{typography.micro-uppercase}`, rounded `{rounded.sm}`, padding `2px 6px`.

**`badge-type`** — Type signature chip in documentation (e.g. `string`, `number`, `boolean`).
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.code-sm}`, rounded `{rounded.sm}`, padding `2px 6px`.

**`badge-tag`** — Documentation tag chip (e.g. `<Tabs>` reference highlighted in body text).
- Background `rgba(55, 114, 207, 0.15)`, text `{colors.brand-tag}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`promo-banner`** — Sticky black promo strip ABOVE the top nav (when present).
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`.

### Code

**`code-block`** — Syntax-highlighted code container.
- Background `{colors.surface-code}`, text `{colors.on-dark}`, typography `{typography.code-md}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`code-block-header`** — Header bar above the code with language label + copy button.
- Background `{colors.surface-code}`, text `{colors.on-dark-muted}`, typography `{typography.caption}`, padding `{spacing.xs} {spacing.md}`, bottom border `1px solid {colors.hairline-dark}`.

**`code-inline`** — Inline `<Tabs>` reference in body prose.
- Background `{colors.surface}`, text `{colors.charcoal}`, typography `{typography.code-inline}`, rounded `{rounded.xs}`, padding `2px 6px`, border `1px solid {colors.hairline}`.

**`copy-code-button`** — "Copy code" button in code-block header.
- Background transparent, text `{colors.on-dark-muted}`, typography `{typography.caption}`, rounded `{rounded.sm}`, padding `{spacing.xxs} {spacing.xs}`, border `1px solid {colors.hairline-dark}`.

### Documentation Components

**`property-row`** — API property documentation row (e.g. `defaultIndex` on the Tabs page).
- Background transparent, text `{colors.ink}`, typography `{typography.body-sm}`, padding `{spacing.md} 0`, bottom border `1px solid {colors.hairline-soft}`.
- Layout: property name in `{typography.code-inline}` + type badge + optional REQUIRED badge + description below in `{typography.body-sm}` `{colors.steel}`.

**`feature-comparison-table`** — Detailed pricing-page feature comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`feature-comparison-row`** — Individual row inside the comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.lg}`, bottom border `1px solid {colors.hairline-soft}`. Section dividers in `{typography.micro-uppercase}` `{colors.steel}`.

**`sidebar-nav-item`** + **`sidebar-nav-item-active`** — Documentation left rail link entries.
- Inactive: background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.sm}`, padding `{spacing.xs} {spacing.md}`.
- Active: background `{colors.surface}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`.

**`sidebar-section-header`** — Uppercase section header inside sidebar (e.g. "COMPONENTS", "PRIMITIVES").
- Background transparent, text `{colors.steel}`, typography `{typography.micro-uppercase}`, padding `{spacing.md} {spacing.md} {spacing.xs}`.

**`doc-toc-item`** + **`doc-toc-item-active`** — Right-rail table-of-contents links.
- Inactive: background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.
- Active: text `{colors.ink}`, typography `{typography.body-sm-medium}`, optional left-border accent in `{colors.brand-green}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar with logo, link list, and right-side CTAs.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline-soft}`.
- Left: Mintlify wordmark + horizontal link list (Solutions, Pricing, Customers, Documentation, Changelog).
- Right: secondary "Talk to sales" + black-pill "Get Started".

**Top Navigation (Documentation)** — Compressed nav with center search-pill and right-side account/upgrade CTAs.
- Background `{colors.canvas}`, height ~56px. Search-pill at center, "Documentation / Guides / API Reference / Changelog" links + "Talk to us" + green "Get started" right.

### Signature Components

**`hero-band-sky`** — Homepage hero with atmospheric sky-blue to cream gradient and cloud illustrations.
- Background gradient `linear-gradient(180deg, {colors.hero-sky-from} 0%, {colors.hero-sky-to} 100%)`, text `{colors.on-dark}` (early portion of gradient) shifting to `{colors.ink}` further down, padding `{spacing.hero}`.
- Layout: centered hero headline in `{typography.hero-display}`, centered subtitle in `{typography.subtitle}`, centered button row (`button-accent-green` "Get started" + `button-secondary` "Talk to us"), product mockup below the buttons.

**`hero-band-dark`** — Startups hero with dark teal-to-mint gradient and rocket launch illustration.
- Background gradient `linear-gradient(135deg, {colors.hero-dark-from} 0%, {colors.hero-dark-to} 100%)`, text `{colors.on-dark}`, padding `{spacing.hero}`.
- Layout: hero headline left in `{typography.hero-display}` `{colors.on-dark}`, illustration right (rocket cutting across the gradient), button row uses `button-on-dark` (white pill) + ghost link.

**`hero-product-mockup`** — Code-editor mockup framed inside the homepage hero.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, border `1px solid {colors.hairline-soft}`, deep shadow `rgba(0, 0, 0, 0.12) 0px 24px 48px -8px`.
- Carries a documentation page preview inside (sidebar on left, prose body, mock UI controls).

**`logo-wall-item`** — Customer logo cell in 6-up trust-row grids ("Anthropic / Cognition / Mintlify / Vercel / react / Lovable", "Stripe / Block / PayPal / Compound / Auth").
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.
- Logos rendered as wordmarks with consistent vertical centering.

**`faq-accordion-item`** — Frequently-asked-questions panel item (visible on pricing page).
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.
- Question in `{typography.heading-5}`, expanded answer in `{typography.body-md}` `{colors.steel}`, chevron icon in `{colors.steel}` 16px.

**`footer-region`** — Multi-column site footer.
- Background `{colors.canvas}`, top border `1px solid {colors.hairline}`, padding `{spacing.section} {spacing.xxl}`.
- 5 column groups (Explore / Resources / Company / Legal + brand mark column).
- Section headers in `{typography.body-sm-medium}` `{colors.ink}`, link items in `{typography.body-sm}` `{colors.steel}`.

**`footer-link`** — Individual link entry in the footer.
- Background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.

## Do''s and Don''ts

### Do
- Reserve `{colors.brand-green}` (Mintlify mint) for accent CTAs and active state indicators only — even one accent button per viewport carries weight
- Use `{colors.primary}` (black) as the dominant CTA on light backgrounds; switch to `button-on-dark` (white pill) on dark hero bands
- Apply `{rounded.full}` to every button and pill; never soften pill corners
- Pair Inter (UI prose) with Geist Mono (code) — never introduce a third typeface
- Use atmospheric gradient hero bands sparingly (only the homepage and startups page); keep deeper surfaces flat and dense
- Apply `{rounded.lg}` (12px) consistently on cards; use `{rounded.md}` (8px) only on compact UI like search pills and code blocks
- Keep documentation prose at `{typography.body-md}` (16px) with 1.50 line-height — never compress

### Don''t
- Don''t use `{colors.brand-green}` on body text or large surfaces — it loses signal
- Don''t introduce additional accent colors beyond mint, tag-blue, error-red, and the testimonial orange
- Don''t apply heavy shadows on flat documentation cards; reserve elevation for the hero product mockup
- Don''t reduce documentation line-height below 1.50 — long-form readability suffers
- Don''t combine atmospheric gradients with multiple competing color accents in the same hero — the sky/dark gradient is the brand mood; let it breathe
- Don''t use Inter for code or Geist Mono for prose — the typeface assignment IS the brand voice

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero scales to 36px. Pill nav collapses to hamburger. Pricing tiers stack 1-up. Footer 1-column accordion. |
| Mobile (large) | 480 – 767px | Same as small but feature tiles render 2-up. Hero scales to 44px. |
| Tablet | 768 – 1023px | 2-column feature grids. Pill-tab nav returns. Documentation sidebar collapses to drawer. Hero scales to 56px. |
| Desktop | 1024 – 1279px | Full 3-column docs grid (sidebar / body / TOC). 3-tier pricing card row. Hero at 72px. |
| Wide Desktop | ≥ 1280px | Wider hero gutters, larger product mockup, fixed 240px sidebar. |

### Touch Targets
- Pill buttons render at 36–40px effective height — bumps to 44px on mobile via padding override
- Circular icon buttons: 32×32px desktop → 44×44px mobile
- Form inputs render at 40px height; bumps to 44px mobile
- Sidebar nav items render at ~32px tall — bump to 44px mobile drawers

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger; horizontal links move into drawer
- **Hero band**: 2-column hero (text + mockup) collapses to stacked at < 1024px; mockup rendered below text on mobile
- **Documentation grid**: 3-column desktop → sidebar-drawer at < 1024px → single-column at < 768px
- **Pricing comparison**: 3-column tiers → 1-column stacked at < 768px; comparison table becomes horizontal-scroll
- **Hero typography**: `{typography.hero-display}` (72px) → 56px tablet → 44px mobile-large → 36px mobile-small
- **Customer logo wall**: 6-up → 3-up at tablet → 2-up at mobile
- **Footer**: 5-column desktop → 2-column tablet → accordion at mobile

### Image Behavior
- Hero illustrations (cloud, rocket) lazy-load with the hero band; remain crisp at all breakpoints (SVG-based)
- Product mockup retains its aspect ratio across breakpoints; scales proportionally
- Customer logos use SVG wordmarks; remain crisp on retina displays

## Iteration Guide

1. Focus on ONE component at a time. The system has high internal consistency.
2. Reference component names and tokens directly (`{colors.primary}`, `{component-name}-pressed`, `{rounded.full}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits to catch broken refs and contrast issues.
4. Add new variants as separate `components:` entries (`-pressed`, `-disabled`, `-focused`, `-active`).
5. Default to `{typography.body-md}` for body and `{typography.subtitle}` for emphasis. Headlines step down `hero-display → display-lg → heading-1 → heading-2 → heading-3 → heading-4 → heading-5`.
6. Keep `{colors.brand-green}` confined to accent moments. If it appears on a generic surface, ask whether it earned that role.
7. Pill-shaped buttons (`{rounded.full}`) always; squared buttons signal "third-party widget" in this language.
8. Documentation prose belongs in `{typography.body-md}` 16px with 1.50 line-height — anything denser breaks the reading experience.

## Known Gaps

- Specific dark-mode token values for canvas, surface, ink, and hairline are not surfaced on these pages; the brand has not yet shipped a published dark-mode palette
- Animation/transition timings are not extracted; recommend 150–200ms ease for hover/focus state transitions
- Form validation success state is not explicitly captured beyond defaults — implement following standard green-border + success badge patterns
- Code syntax highlighting palette inside docs is not formalized; documentation samples carry their own twoslash-style annotation system tokens (e.g. `{colors.brand-tag}`, `{colors.brand-annotate}`, `{colors.brand-warn}`) but the full highlight scheme is not enumerated
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

Mintlify positions itself at the intersection of polished marketing presentation and developer-grade documentation density. The home and startups pages open with cinematic atmospheric heroes — soft sky-gradient backdrops with cloud illustrations on the homepage, dark teal-to-mint gradients with a rocket launch on the startups page — that feel more like a SaaS landing aesthetic than a developer tool. Then the deeper surfaces (pricing comparison, live documentation pages) collapse into dense, high-information layouts where Inter body type carries 14–16px copy across long-form prose, syntax-highlighted code blocks, and 3-column documentation grids.

The brand''s signature mint green ({colors.brand-green}) appears sparingly but decisively — on the hero "Get started" pill button, the green checkmark icons inside feature lists, the "Featured" pricing tier border, and active state indicators inside docs UI. Black-pill primary buttons dominate the marketing flow; white-on-dark inversions appear on dark hero bands. The signature pairing of Inter (body, headings) with Geist Mono (code blocks, inline references, type signatures) reinforces the developer-tool DNA without requiring a third typeface.

**Key Characteristics:**
- Atmospheric gradient hero bands (sky-blue to cream on homepage; teal-to-mint on startups) provide cinematic marketing presentation
- Signature Mintlify mint green ({colors.brand-green}) reserved for accent CTAs, active states, and feature confirmations
- Black-pill primary buttons ({colors.primary} + `{rounded.full}`) for marketing CTAs
- Inter for all UI prose; Geist Mono for code blocks, inline code, and type/property signatures
- 3-column documentation layout (sidebar / prose / TOC) with dense 14px body type for long-form developer reading
- Tightly-controlled radius scale: marketing uses `{rounded.lg}` (12px), pill buttons use `{rounded.full}` — no in-between corner softening
- Vibrant testimonial card (`{colors.testimonial-orange}`) breaks color rhythm intentionally for emotional impact', '{"sourcePath":"docs/design-md/mintlify/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: mintlify.com/ (homepage), /startups (program page), /pricing (comparison), /docs/components/tabs (live documentation). Token coverage was identical across all four pages.

### Brand & Accent
- **Mintlify Mint** ({colors.brand-green}): Signature accent — used on hero "Get started" pill button, green checkmarks in feature lists, featured pricing tier border accent, sidebar active indicator dots.
- **Deep Mint** ({colors.brand-green-deep}): Pressed/active variant of the mint accent.
- **Soft Mint** ({colors.brand-green-soft}): Subtle background tint for success states and confirmation surfaces.
- **Brand Tag** ({colors.brand-tag}): Documentation tag and reference color (used in `<Tabs>` JSX-style annotations and code-tag chips).
- **Brand Annotate** ({colors.brand-annotate}): Inline code annotation green (used in twoslash code annotation system).
- **Brand Warn** ({colors.brand-warn}): Code warning highlight (deprecated, caution).
- **Brand Error** ({colors.brand-error}): Red used for required-field labels and error highlight.
- **Testimonial Orange** ({colors.testimonial-orange}): Warm coral-orange used on the "Cursor" testimonial card and warm callout surfaces.

### Surface
- **Canvas White** ({colors.canvas}): Primary page and card background.
- **Canvas Dark** ({colors.canvas-dark}): Promo banner, dark inversion surfaces, code editor wrapper.
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest, code-inline background, sidebar active state.
- **Surface Soft** ({colors.surface-soft}): Quieter section backgrounds and FAQ accordion.
- **Surface Code** ({colors.surface-code}): Dark code-block wrapper background.
- **Hairline** ({colors.hairline}): 1px borders and primary dividers.
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row dividers and secondary section breaks.

### Hero Atmospheric
- **Hero Sky From / To** ({colors.hero-sky-from}, {colors.hero-sky-to}): Atmospheric sky-blue to soft cream gradient on the homepage hero.
- **Hero Dark From / To** ({colors.hero-dark-from}, {colors.hero-dark-to}): Dark teal to mint gradient on the startups hero.

### Text
- **Ink** ({colors.ink}): Primary headlines and CTA text.
- **Charcoal** ({colors.charcoal}): Body text, code-inline foreground.
- **Slate** ({colors.slate}): Secondary text and metadata.
- **Steel** ({colors.steel}): Tertiary text, table headers, sidebar inactive items, footer links.
- **Stone** ({colors.stone}): Captions, twoslash cursor color, muted labels.
- **Muted** ({colors.muted}): De-emphasized labels and disabled text.
- **On Dark** ({colors.on-dark}): White text on dark surfaces (hero bands, code blocks, promo banner).
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white for code-block headers and metadata on dark.

### Semantic
- Error tones derive from `{colors.brand-error}` for input borders, required-field labels, and validation messaging.', '{"sourcePath":"docs/design-md/mintlify/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**Inter** (primary): Variable typeface optimized for UI legibility. Used across every UI surface — body, headings, navigation, button labels, captions. Fallbacks: -apple-system, BlinkMacSystemFont, ''Segoe UI'', sans-serif.

**Geist Mono** (code): Monospace typeface used inside code blocks, inline code references, type signatures (e.g. `string`, `number`, `boolean`), and property names in API documentation. Fallbacks: ''SF Mono'', Menlo, Consolas, ''Geist Mono Fallback'', monospace.

The brand uses no italic variants of either face — emphasis comes from weight (500/600), color shift, or background highlighting (in code references).

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 72px | 600 | 1.05 | -2px | Marketing hero display ("The intelligent Knowledge Platform") |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.5px | Major section opener ("Built for the intelligence age") |
| `{typography.heading-1}` | 48px | 600 | 1.10 | -1px | Page-level headlines ("Pricing on your terms") |
| `{typography.heading-2}` | 36px | 600 | 1.20 | -0.5px | Section headlines ("Apply to the Mintlify startup program") |
| `{typography.heading-3}` | 28px | 600 | 1.25 | 0 | Subsection headers, "Tabs" docs page title |
| `{typography.heading-4}` | 22px | 600 | 1.30 | 0 | Card titles, larger feature headers |
| `{typography.heading-5}` | 18px | 600 | 1.40 | 0 | Smaller feature headers, FAQ question titles |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Hero subtitle, lead body |
| `{typography.body-md}` | 16px | 400 | 1.50 | 0 | Primary body text |
| `{typography.body-md-medium}` | 16px | 500 | 1.50 | 0 | Body emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body, table cells, navigation |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Active sidebar nav, button labels, tab labels |
| `{typography.caption}` | 13px | 400 | 1.40 | 0 | Helper text, fine print, code-block headers |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Badge labels |
| `{typography.micro}` | 12px | 500 | 1.40 | 0 | Footer microcopy, label chips |
| `{typography.micro-uppercase}` | 11px | 600 | 1.40 | 0.5px | Sidebar section headers, "REQUIRED" labels |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | Pill button labels |
| `{typography.code-md}` | 14px | 400 | 1.50 | 0 | Code block content |
| `{typography.code-sm}` | 13px | 400 | 1.40 | 0 | Smaller code, type signatures |
| `{typography.code-inline}` | 13px | 500 | 1.30 | 0 | Inline `<Tabs>` references in body |

### Principles
- **Tight hero leading** (1.05) creates magazine-grade display headlines on the 72px hero
- **Negative letter-spacing** progresses inversely with size — display sizes use -2px to -1.5px; smaller headings relax to 0
- **Documentation-grade body** (1.50 line-height on 14–16px) ensures comfortable long-form reading in dense docs surfaces
- **Inter / Geist Mono pairing** — Inter for everything else, Geist Mono surgically for code references; the contrast between the two is the brand''s developer-respect signal
- **Uppercase micro labels** with +0.5px letter-spacing carry sidebar section headers and "REQUIRED" annotation tags', '{"sourcePath":"docs/design-md/mintlify/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (96px) · `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px) between major bands; pricing comparison tightens to `{spacing.section}` (64px); documentation surfaces use `{spacing.xxl}` (32px) between subsections
- **Card internal padding**: Standard `{spacing.xl}` (24px) for compact cards; `{spacing.xxl}` (32px) for pricing cards and feature panels; testimonial card pushes to `{spacing.section}` (64px) for hero-card presence

### Grid & Container
- Marketing pages use a 1280px max-width with 32px gutters
- Hero and feature bands often use 2-column splits (text left, illustration/mockup right)
- Pricing page renders 3 tier cards in a row at desktop (FREE / Lift Off / Custom), then a comprehensive feature comparison table below
- Documentation pages use a strict 3-column grid: left sidebar nav (~240px), center prose (~720px max-width), right TOC (~200px)
- Logo walls use 6-up rows of customer logos at 80–100px height each

### Whitespace Philosophy
Marketing surfaces give content generous breathing room — `{spacing.hero}` (120px) above-the-fold creates space for atmospheric gradient backdrops to read clearly. Documentation tightens dramatically: section gaps drop to `{spacing.xxl}` (32px), table rows pack to `{spacing.md}` (16px), sidebar nav compresses to `{spacing.xs}` (8px) vertical rhythm.', '{"sourcePath":"docs/design-md/mintlify/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

The system runs predominantly flat with strategic atmospheric depth.

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline}` border | Default cards, table rows, form inputs |
| 1 (subtle) | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | Hover-elevated tiles, subtle highlights |
| 2 (card) | `rgba(0, 0, 0, 0.08) 0px 4px 12px 0px` | Standard feature cards |
| 3 (mockup) | `rgba(0, 0, 0, 0.12) 0px 24px 48px -8px` | Hero product mockup framing — the deep diffuse drop on the homepage hero docs preview |
| 4 (brand-tinted) | `rgba(0, 212, 164, 0.08) 0px 8px 24px` | Featured pricing tier glow |

### Decorative Depth
- The homepage hero uses an atmospheric photographic backdrop (cloud illustration on sky-gradient) for depth — no shadow needed; the imagery does the work
- The startups hero uses a similar treatment with a rocket-launch illustration cutting across the dark teal gradient
- Code blocks carry their own internal depth via syntax-highlighting color hierarchy on the dark surface; no shadow used', '{"sourcePath":"docs/design-md/mintlify/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Inline code chips, micro tags |
| `{rounded.sm}` | 6px | Sidebar nav items, type badges |
| `{rounded.md}` | 8px | Inputs, search pill, code blocks, secondary cards |
| `{rounded.lg}` | 12px | Standard cards, pricing tiers, hero mockup, FAQ items |
| `{rounded.xl}` | 16px | Larger feature panels |
| `{rounded.xxl}` | 24px | Featured product showcase tiles |
| `{rounded.full}` | 9999px | All buttons, pill tabs, badges |

The radius scale is tightly disciplined — the brand never uses a corner softening between `{rounded.md}` (8px) and `{rounded.lg}` (12px) for the same component family. Pill buttons (`{rounded.full}`) are used universally; rectangular cards use `{rounded.lg}` (12px) consistently.

### Photography Geometry
- Hero illustrations (cloud, rocket) sit on full-bleed gradient backdrops with no internal framing
- Customer logo walls use 1:1 ratio cells without rounding (logos are presented inline as wordmarks)
- Testimonial photos use 1:1 aspect with `{rounded.md}` (8px) softening
- Code editor mockup hero image uses `{rounded.lg}` (12px) corners on a hairline-bordered card with a deep diffuse drop shadow', '{"sourcePath":"docs/design-md/mintlify/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Black pill primary CTA, the dominant action across all surfaces.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` lifts to `{colors.charcoal}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background and `{colors.muted}` text.

**`button-accent-green`** — Mint green pill for brand-emphasis CTAs (hero "Get started", featured pricing CTA).
- Background `{colors.brand-green}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.

**`button-on-dark`** — White pill for use on dark hero bands (startups page "Get started").
- Background `{colors.on-dark}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.

**`button-secondary`** — Outlined pill for secondary actions.
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.

**`button-ghost`** — Quieter rectangular ghost button (sidebar action, tertiary nav).
- Background transparent, text `{colors.ink}`, typography `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.md}`.

**`button-link`** — Inline text link styled as a subtle button.
- Background transparent, text `{colors.ink}`, typography `{typography.body-sm-medium}`, padding `0`. Underline appears on activation.

**`button-icon-circular`** — 32×32px circular utility button (close, copy, arrow).
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.full}`.

### Cards & Containers

**`card-base`** — Standard documentation/feature card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-feature`** — Feature panel on light gray surface.
- Background `{colors.surface}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-help`** — "Need help?" CTA cards below the pricing comparison ("Quickstart guide", "Guide to technical writing", "Founder", "Sales").
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-startup-perk`** — Startup-program perk grid item ("Discounts and credits", "Priority support", "Startup pack", "Founder community").
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`. Carries an icon at top, heading `{typography.heading-5}`, description `{typography.body-sm}` `{colors.steel}`.

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.
- Title `{typography.heading-3}`, price `{typography.display-lg}`, feature list `{typography.body-sm}` with green checkmark icons.

**`pricing-card-featured`** — Highlighted pricing tier (Lift Off / featured plan).
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `2px solid {colors.brand-green}`, soft brand-tinted shadow `rgba(0, 212, 164, 0.08) 0px 8px 24px`.

**`testimonial-card-feature`** — Bright orange large testimonial card with photo + quote ("Cursor — Every YC batch we consistently see the top performing startups use Mintlify to build their docs.").
- Background `{colors.testimonial-orange}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.section}`. Photo on right, large quote in `{typography.heading-3}` left, attribution below in `{typography.body-sm-medium}`.

**`testimonial-card-quote`** — Smaller white testimonial card on the startups page.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`founder-quote-card`** — Cursor founder testimonial card variant on the orange surface.
- Background `{colors.testimonial-orange}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`. Carries the specific founder portrait + quote treatment.

**`startup-program-card`** — Larger application/program card containing perks grid + apply CTA.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 40px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.brand-green}` — focus uses the brand mint as the activation signal.

**`search-pill`** — Documentation top-bar search.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, height 36px, border `1px solid {colors.hairline}`.

### Tabs

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation (used inside docs Tabs component for "First tab / Second tab / Third tab").
- Inactive: text `{colors.steel}`, transparent background, padding `{spacing.sm} {spacing.md}`. Active: text `{colors.ink}`, 2px bottom border in `{colors.ink}`.

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav (top of pricing page: "Pricing / Roadmap").
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `8px 16px`, rounded `{rounded.full}`.
- Active: background `{colors.primary}`, text `{colors.on-primary}`, no border.

**`toggle-monthly-yearly`** — Two-state pill toggle (Monthly / Annual on pricing page).
- Background `{colors.surface}`, rounded `{rounded.full}`, padding `4px`. Active state moves a white pill thumb to the selected position.

### Badges & Status

**`badge-discount`** — Small green "Save 20%" badge attached to annual toggle.
- Background `{colors.brand-green}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `2px 8px`.

**`badge-required`** — Red "REQUIRED" label on documentation property rows.
- Background `{colors.brand-error}`, text `{colors.on-dark}`, typography `{typography.micro-uppercase}`, rounded `{rounded.sm}`, padding `2px 6px`.

**`badge-type`** — Type signature chip in documentation (e.g. `string`, `number`, `boolean`).
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.code-sm}`, rounded `{rounded.sm}`, padding `2px 6px`.

**`badge-tag`** — Documentation tag chip (e.g. `<Tabs>` reference highlighted in body text).
- Background `rgba(55, 114, 207, 0.15)`, text `{colors.brand-tag}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`promo-banner`** — Sticky black promo strip ABOVE the top nav (when present).
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`.

### Code

**`code-block`** — Syntax-highlighted code container.
- Background `{colors.surface-code}`, text `{colors.on-dark}`, typography `{typography.code-md}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`code-block-header`** — Header bar above the code with language label + copy button.
- Background `{colors.surface-code}`, text `{colors.on-dark-muted}`, typography `{typography.caption}`, padding `{spacing.xs} {spacing.md}`, bottom border `1px solid {colors.hairline-dark}`.

**`code-inline`** — Inline `<Tabs>` reference in body prose.
- Background `{colors.surface}`, text `{colors.charcoal}`, typography `{typography.code-inline}`, rounded `{rounded.xs}`, padding `2px 6px`, border `1px solid {colors.hairline}`.

**`copy-code-button`** — "Copy code" button in code-block header.
- Background transparent, text `{colors.on-dark-muted}`, typography `{typography.caption}`, rounded `{rounded.sm}`, padding `{spacing.xxs} {spacing.xs}`, border `1px solid {colors.hairline-dark}`.

### Documentation Components

**`property-row`** — API property documentation row (e.g. `defaultIndex` on the Tabs page).
- Background transparent, text `{colors.ink}`, typography `{typography.body-sm}`, padding `{spacing.md} 0`, bottom border `1px solid {colors.hairline-soft}`.
- Layout: property name in `{typography.code-inline}` + type badge + optional REQUIRED badge + description below in `{typography.body-sm}` `{colors.steel}`.

**`feature-comparison-table`** — Detailed pricing-page feature comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`feature-comparison-row`** — Individual row inside the comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.lg}`, bottom border `1px solid {colors.hairline-soft}`. Section dividers in `{typography.micro-uppercase}` `{colors.steel}`.

**`sidebar-nav-item`** + **`sidebar-nav-item-active`** — Documentation left rail link entries.
- Inactive: background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.sm}`, padding `{spacing.xs} {spacing.md}`.
- Active: background `{colors.surface}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`.

**`sidebar-section-header`** — Uppercase section header inside sidebar (e.g. "COMPONENTS", "PRIMITIVES").
- Background transparent, text `{colors.steel}`, typography `{typography.micro-uppercase}`, padding `{spacing.md} {spacing.md} {spacing.xs}`.

**`doc-toc-item`** + **`doc-toc-item-active`** — Right-rail table-of-contents links.
- Inactive: background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.
- Active: text `{colors.ink}`, typography `{typography.body-sm-medium}`, optional left-border accent in `{colors.brand-green}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar with logo, link list, and right-side CTAs.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline-soft}`.
- Left: Mintlify wordmark + horizontal link list (Solutions, Pricing, Customers, Documentation, Changelog).
- Right: secondary "Talk to sales" + black-pill "Get Started".

**Top Navigation (Documentation)** — Compressed nav with center search-pill and right-side account/upgrade CTAs.
- Background `{colors.canvas}`, height ~56px. Search-pill at center, "Documentation / Guides / API Reference / Changelog" links + "Talk to us" + green "Get started" right.

### Signature Components

**`hero-band-sky`** — Homepage hero with atmospheric sky-blue to cream gradient and cloud illustrations.
- Background gradient `linear-gradient(180deg, {colors.hero-sky-from} 0%, {colors.hero-sky-to} 100%)`, text `{colors.on-dark}` (early portion of gradient) shifting to `{colors.ink}` further down, padding `{spacing.hero}`.
- Layout: centered hero headline in `{typography.hero-display}`, centered subtitle in `{typography.subtitle}`, centered button row (`button-accent-green` "Get started" + `button-secondary` "Talk to us"), product mockup below the buttons.

**`hero-band-dark`** — Startups hero with dark teal-to-mint gradient and rocket launch illustration.
- Background gradient `linear-gradient(135deg, {colors.hero-dark-from} 0%, {colors.hero-dark-to} 100%)`, text `{colors.on-dark}`, padding `{spacing.hero}`.
- Layout: hero headline left in `{typography.hero-display}` `{colors.on-dark}`, illustration right (rocket cutting across the gradient), button row uses `button-on-dark` (white pill) + ghost link.

**`hero-product-mockup`** — Code-editor mockup framed inside the homepage hero.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, border `1px solid {colors.hairline-soft}`, deep shadow `rgba(0, 0, 0, 0.12) 0px 24px 48px -8px`.
- Carries a documentation page preview inside (sidebar on left, prose body, mock UI controls).

**`logo-wall-item`** — Customer logo cell in 6-up trust-row grids ("Anthropic / Cognition / Mintlify / Vercel / react / Lovable", "Stripe / Block / PayPal / Compound / Auth").
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.
- Logos rendered as wordmarks with consistent vertical centering.

**`faq-accordion-item`** — Frequently-asked-questions panel item (visible on pricing page).
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.
- Question in `{typography.heading-5}`, expanded answer in `{typography.body-md}` `{colors.steel}`, chevron icon in `{colors.steel}` 16px.

**`footer-region`** — Multi-column site footer.
- Background `{colors.canvas}`, top border `1px solid {colors.hairline}`, padding `{spacing.section} {spacing.xxl}`.
- 5 column groups (Explore / Resources / Company / Legal + brand mark column).
- Section headers in `{typography.body-sm-medium}` `{colors.ink}`, link items in `{typography.body-sm}` `{colors.steel}`.

**`footer-link`** — Individual link entry in the footer.
- Background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.', '{"sourcePath":"docs/design-md/mintlify/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.brand-green}` (Mintlify mint) for accent CTAs and active state indicators only — even one accent button per viewport carries weight
- Use `{colors.primary}` (black) as the dominant CTA on light backgrounds; switch to `button-on-dark` (white pill) on dark hero bands
- Apply `{rounded.full}` to every button and pill; never soften pill corners
- Pair Inter (UI prose) with Geist Mono (code) — never introduce a third typeface
- Use atmospheric gradient hero bands sparingly (only the homepage and startups page); keep deeper surfaces flat and dense
- Apply `{rounded.lg}` (12px) consistently on cards; use `{rounded.md}` (8px) only on compact UI like search pills and code blocks
- Keep documentation prose at `{typography.body-md}` (16px) with 1.50 line-height — never compress

### Don''t
- Don''t use `{colors.brand-green}` on body text or large surfaces — it loses signal
- Don''t introduce additional accent colors beyond mint, tag-blue, error-red, and the testimonial orange
- Don''t apply heavy shadows on flat documentation cards; reserve elevation for the hero product mockup
- Don''t reduce documentation line-height below 1.50 — long-form readability suffers
- Don''t combine atmospheric gradients with multiple competing color accents in the same hero — the sky/dark gradient is the brand mood; let it breathe
- Don''t use Inter for code or Geist Mono for prose — the typeface assignment IS the brand voice', '{"sourcePath":"docs/design-md/mintlify/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero scales to 36px. Pill nav collapses to hamburger. Pricing tiers stack 1-up. Footer 1-column accordion. |
| Mobile (large) | 480 – 767px | Same as small but feature tiles render 2-up. Hero scales to 44px. |
| Tablet | 768 – 1023px | 2-column feature grids. Pill-tab nav returns. Documentation sidebar collapses to drawer. Hero scales to 56px. |
| Desktop | 1024 – 1279px | Full 3-column docs grid (sidebar / body / TOC). 3-tier pricing card row. Hero at 72px. |
| Wide Desktop | ≥ 1280px | Wider hero gutters, larger product mockup, fixed 240px sidebar. |

### Touch Targets
- Pill buttons render at 36–40px effective height — bumps to 44px on mobile via padding override
- Circular icon buttons: 32×32px desktop → 44×44px mobile
- Form inputs render at 40px height; bumps to 44px mobile
- Sidebar nav items render at ~32px tall — bump to 44px mobile drawers

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger; horizontal links move into drawer
- **Hero band**: 2-column hero (text + mockup) collapses to stacked at < 1024px; mockup rendered below text on mobile
- **Documentation grid**: 3-column desktop → sidebar-drawer at < 1024px → single-column at < 768px
- **Pricing comparison**: 3-column tiers → 1-column stacked at < 768px; comparison table becomes horizontal-scroll
- **Hero typography**: `{typography.hero-display}` (72px) → 56px tablet → 44px mobile-large → 36px mobile-small
- **Customer logo wall**: 6-up → 3-up at tablet → 2-up at mobile
- **Footer**: 5-column desktop → 2-column tablet → accordion at mobile

### Image Behavior
- Hero illustrations (cloud, rocket) lazy-load with the hero band; remain crisp at all breakpoints (SVG-based)
- Product mockup retains its aspect ratio across breakpoints; scales proportionally
- Customer logos use SVG wordmarks; remain crisp on retina displays', '{"sourcePath":"docs/design-md/mintlify/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. The system has high internal consistency.
2. Reference component names and tokens directly (`{colors.primary}`, `{component-name}-pressed`, `{rounded.full}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits to catch broken refs and contrast issues.
4. Add new variants as separate `components:` entries (`-pressed`, `-disabled`, `-focused`, `-active`).
5. Default to `{typography.body-md}` for body and `{typography.subtitle}` for emphasis. Headlines step down `hero-display → display-lg → heading-1 → heading-2 → heading-3 → heading-4 → heading-5`.
6. Keep `{colors.brand-green}` confined to accent moments. If it appears on a generic surface, ask whether it earned that role.
7. Pill-shaped buttons (`{rounded.full}`) always; squared buttons signal "third-party widget" in this language.
8. Documentation prose belongs in `{typography.body-md}` 16px with 1.50 line-height — anything denser breaks the reading experience.', '{"sourcePath":"docs/design-md/mintlify/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Specific dark-mode token values for canvas, surface, ink, and hairline are not surfaced on these pages; the brand has not yet shipped a published dark-mode palette
- Animation/transition timings are not extracted; recommend 150–200ms ease for hover/focus state transitions
- Form validation success state is not explicitly captured beyond defaults — implement following standard green-border + success badge patterns
- Code syntax highlighting palette inside docs is not formalized; documentation samples carry their own twoslash-style annotation system tokens (e.g. `{colors.brand-tag}`, `{colors.brand-annotate}`, `{colors.brand-warn}`) but the full highlight scheme is not enumerated', '{"sourcePath":"docs/design-md/mintlify/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_1', '#0a0a0a', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_3', '#00d4a4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_4', '#00b48a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_5', '#7cebcb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_6', '#3772cf', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_7', '#c37d0d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_8', '#1ba673', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_9', '#d45656', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_10', '#888888', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_11', '#87a8c8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_12', '#f5e9d8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_13', '#1a3d4a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_14', '#2d5a4f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_15', '#f55a3c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_16', '#cc3a1f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_17', '#f7f7f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_18', '#fafafa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_19', '#1c1c1e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_20', '#e5e5e5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_21', '#ededed', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_22', '#1f1f1f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_23', '#3a3a3c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_24', '#5a5a5c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_25', '#a8a8aa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'color', 'color_26', '#b3b3b3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md'), 'typography', 'font_1', 'fontFamily: Inter', 'primary_detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/mintlify/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/mintlify/DESIGN.md';


-- Miro
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Miro', 'miro', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/miro/DESIGN.md', null, 'seeded', '---
version: alpha
name: Miro-design-analysis
description: Miro presents itself as the AI-powered visual workspace through a confident, almost playful brand voice — anchored by its signature canary yellow ({colors.brand-yellow}) wordmark over white canvas, broken open by colorful pastel feature tints (rose, teal, coral, orange, mint) that echo the actual sticky-note color palette used on the live whiteboard. Black-pill primary buttons dominate marketing, real Miro-board mockups serve as feature illustrations, and a 4-tier pricing grid leads into a dense comparison table. Roobert PRO carries display headlines; the system supports homepage, pricing, AI Workflows product page, agile vertical, and customer stories surfaces.

colors:
  primary: "#1c1c1e"
  on-primary: "#ffffff"
  brand-yellow: "#ffd02f"
  brand-yellow-deep: "#fcb900"
  yellow-light: "#fff4c4"
  yellow-dark: "#746019"
  brand-blue: "#4262ff"
  blue-450: "#5b76fe"
  blue-pressed: "#2a41b6"
  brand-coral: "#ff9999"
  coral-light: "#ffc6c6"
  coral-dark: "#600000"
  brand-rose: "#ffd8f4"
  rose-light: "#fde0f0"
  brand-pink: "#fde0f0"
  brand-teal: "#0fbcb0"
  teal-light: "#c3faf5"
  moss-dark: "#187574"
  brand-orange-light: "#ffe6cd"
  brand-red: "#fbd4d4"
  brand-red-dark: "#e3c5c5"
  success-accent: "#00b473"
  canvas: "#ffffff"
  surface: "#f7f8fa"
  surface-soft: "#fafbfc"
  surface-yellow: "#fff8e0"
  surface-pricing-featured: "#f5f3ff"
  hairline: "#e0e2e8"
  hairline-soft: "#eef0f3"
  hairline-strong: "#c7cad5"
  ink-deep: "#050038"
  ink: "#1c1c1e"
  charcoal: "#2c2c34"
  slate: "#555a6a"
  steel: "#6b6f7e"
  stone: "#8e91a0"
  muted: "#a5a8b5"
  on-dark: "#ffffff"
  on-dark-muted: "#a5a8b5"
  footer-bg: "#1c1c1e"

typography:
  hero-display:
    fontFamily: Roobert PRO
    fontSize: 80px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -2px
  display-lg:
    fontFamily: Roobert PRO
    fontSize: 60px
    fontWeight: 500
    lineHeight: 1.10
    letterSpacing: -1.5px
  heading-1:
    fontFamily: Roobert PRO
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -1px
  heading-2:
    fontFamily: Roobert PRO
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: -0.5px
  heading-3:
    fontFamily: Roobert PRO
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.25
  heading-4:
    fontFamily: Roobert PRO
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.30
  heading-5:
    fontFamily: Roobert PRO
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.40
  subtitle:
    fontFamily: Roobert PRO
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
  body-md:
    fontFamily: Roobert PRO
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
  body-md-medium:
    fontFamily: Roobert PRO
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.50
  body-sm:
    fontFamily: Roobert PRO
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  body-sm-medium:
    fontFamily: Roobert PRO
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.50
  caption:
    fontFamily: Roobert PRO
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  caption-bold:
    fontFamily: Roobert PRO
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.40
  micro:
    fontFamily: Roobert PRO
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.40
  micro-uppercase:
    fontFamily: Roobert PRO
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: 0.5px
  button-md:
    fontFamily: Roobert PRO
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.30
  stat-display:
    fontFamily: Roobert PRO
    fontSize: 64px
    fontWeight: 500
    lineHeight: 1.10
    letterSpacing: -1.5px

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 20px
  xxxl: 28px
  feature: 32px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section-sm: 48px
  section: 64px
  section-lg: 96px
  hero: 120px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-pressed:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.muted}"
  button-yellow:
    backgroundColor: "{colors.brand-yellow}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-blue:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    border: "1px solid {colors.hairline-strong}"
  button-on-dark:
    backgroundColor: "{colors.on-dark}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.brand-blue}"
    typography: "{typography.body-sm-medium}"
    padding: "0"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 36px
    border: "1px solid {colors.hairline}"
  card-base:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline-soft}"
  card-feature:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xxxl}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline-soft}"
  card-feature-yellow:
    backgroundColor: "{colors.brand-yellow}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xxxl}"
    padding: "{spacing.xxl}"
  card-feature-coral:
    backgroundColor: "{colors.coral-light}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xxxl}"
    padding: "{spacing.xxl}"
  card-feature-teal:
    backgroundColor: "{colors.teal-light}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xxxl}"
    padding: "{spacing.xxl}"
  card-feature-rose:
    backgroundColor: "{colors.rose-light}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xxxl}"
    padding: "{spacing.xxl}"
  card-customer-story:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xxxl}"
    padding: "0"
    border: "1px solid {colors.hairline-soft}"
  card-stat:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.stat-display}"
    padding: "{spacing.lg}"
  pricing-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  pricing-card-featured:
    backgroundColor: "{colors.surface-pricing-featured}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
    border: "2px solid {colors.brand-blue}"
  pricing-card-enterprise:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline-strong}"
    height: 44px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.brand-blue}"
  search-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.xs} {spacing.md}"
    height: 40px
    border: "1px solid {colors.hairline}"
  filter-dropdown:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.md}"
    border: "1px solid {colors.hairline-strong}"
  pill-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.md}"
    border: "1px solid {colors.hairline}"
  pill-tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    border: "1px solid {colors.primary}"
  toggle-monthly-yearly:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "4px"
  badge-promo:
    backgroundColor: "{colors.brand-yellow}"
    textColor: "{colors.primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-tag-yellow:
    backgroundColor: "{colors.surface-yellow}"
    textColor: "{colors.yellow-dark}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-tag-purple:
    backgroundColor: "{colors.surface-pricing-featured}"
    textColor: "{colors.brand-blue}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-tag-coral:
    backgroundColor: "{colors.coral-light}"
    textColor: "{colors.coral-dark}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-success:
    backgroundColor: "{colors.success-accent}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-discount:
    backgroundColor: "{colors.brand-yellow}"
    textColor: "{colors.primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  promo-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
  comparison-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
  comparison-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "{spacing.md} {spacing.lg}"
    border: "0 0 1px {colors.hairline-soft} solid"
  template-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline}"
  whiteboard-mockup:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "0"
    border: "1px solid {colors.hairline-soft}"
    shadow: "rgba(5, 0, 56, 0.08) 0px 12px 32px -4px"
  faq-accordion-item:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    border: "0 0 1px {colors.hairline} solid"
  logo-wall-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-md-medium}"
    padding: "{spacing.lg}"
  hero-band-marketing:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.hero-display}"
    rounded: "0"
    padding: "{spacing.hero}"
  cta-banner-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.feature}"
    padding: "{spacing.section}"
  industry-tile:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline-soft}"
  capterra-badge:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline}"
  footer-region:
    backgroundColor: "{colors.footer-bg}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    padding: "{spacing.section} {spacing.xxl}"
  footer-link:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-muted}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
  app-store-badge:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
---

## Overview

Miro positions itself as the AI-powered visual workspace through a confident, slightly playful brand voice. The homepage opens with a stark white canvas anchored by a small canary-yellow Miro wordmark in the top-left, a black-pill primary CTA "Get started free" and a secondary "Book a demo" outline pill — then dramatic real-Miro-board mockup imagery (sticky notes, kanban, mind maps) carries the visual weight. Across deeper surfaces, the system breaks open: pastel feature cards (rose, teal, coral, yellow) echo the actual sticky-note color palette of the live whiteboard product, and customer story cards reuse those tints to differentiate brand vignettes.

Roobert PRO — Miro''s custom display face — anchors every typographic surface, from the 80px hero display down to 11px micro labels. The face''s slightly rounded, geometric character pairs naturally with the playful product photography and the friendly product positioning. Black-pill primary buttons (`{rounded.full}`) dominate marketing CTAs; the brand color, signature canary yellow ({colors.brand-yellow}), is reserved for the wordmark, top promo banners, and "yellow tag" feature pills — never as a primary CTA. The 4-tier pricing comparison (Free / Starter / Business / Enterprise) leads into the densest surface in the system: a feature comparison table that runs ~80 rows deep across multiple section dividers.

**Key Characteristics:**
- Stark white canvas + Miro wordmark in canary yellow ({colors.brand-yellow}) as the recognizable opening signature
- Black-pill primary CTAs ({colors.primary} + `{rounded.full}`) as the dominant interactive element
- Pastel feature cards (yellow, rose, coral, teal, mint) that echo the actual sticky-note palette
- Roobert PRO across every UI surface; geometric, slightly rounded character
- Real Miro-board mockup imagery used as feature illustrations
- 4-tier pricing card grid + dense feature comparison table
- Massive dark footer ({colors.footer-bg}) with multi-column links + app-store badges

## Colors

> Source pages: miro.com/ (homepage), /pricing/ (4-tier comparison), /products/ai-workflows/ (AI product), /agile/ (vertical landing), /customers/ (story directory). Token coverage was identical across all five pages.

### Brand & Accent
- **Miro Yellow** ({colors.brand-yellow}): The brand''s recognizable canary yellow — wordmark color, top promo banner, "yellow tag" pills
- **Yellow Deep** ({colors.brand-yellow-deep}): Darker variant for hover states and emphasis
- **Yellow Light** ({colors.yellow-light}): Pale yellow background tint for tag chips
- **Yellow Dark** ({colors.yellow-dark}): Yellow-tag text color (dark olive) for chip foreground
- **Brand Blue** ({colors.brand-blue}): Action blue for inline links and featured-pricing-tier border
- **Blue Pressed** ({colors.blue-pressed}): Pressed-state blue
- **Brand Coral** ({colors.brand-coral}): Coral accent for warm callouts
- **Coral Light** ({colors.coral-light}): Pale coral for feature card backgrounds
- **Coral Dark** ({colors.coral-dark}): Coral-tag text color (deep wine)
- **Brand Rose** ({colors.brand-rose}): Soft rose-pink for feature card variants
- **Brand Teal** ({colors.brand-teal}): Brand teal
- **Teal Light** ({colors.teal-light}): Pale teal for feature card backgrounds
- **Moss Dark** ({colors.moss-dark}): Deep teal-green text color
- **Brand Pink** ({colors.brand-pink}): Pale pink for soft callouts
- **Brand Orange Light** ({colors.brand-orange-light}): Soft orange for feature card backgrounds

### Surface
- **Canvas White** ({colors.canvas}): Page background and primary card surface
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions
- **Surface Yellow** ({colors.surface-yellow}): Pale yellow-tinted surface for tag chip
- **Surface Pricing Featured** ({colors.surface-pricing-featured}): Pale lavender for featured pricing tier
- **Hairline** ({colors.hairline}): 1px borders and primary dividers
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row dividers
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px border for inputs

### Text
- **Ink Deep** ({colors.ink-deep}): Headlines on lighter feature cards
- **Ink** ({colors.ink}): Primary headlines and body text
- **Charcoal** ({colors.charcoal}): Body emphasis text
- **Slate** ({colors.slate}): Secondary text, metadata
- **Steel** ({colors.steel}): Tertiary text, footer links
- **Stone** ({colors.stone}): Captions, muted labels
- **Muted** ({colors.muted}): Disabled labels, input placeholders
- **On Dark** ({colors.on-dark}): White text on dark surfaces
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white on dark

### Semantic
- **Success Accent** ({colors.success-accent}): Confirmation/success indicator green
- **Brand Red** ({colors.brand-red}): Soft red for error backgrounds
- **Brand Red Dark** ({colors.brand-red-dark}): Stronger red for error borders

## Typography

### Font Family
**Roobert PRO** (primary): Miro''s custom geometric sans-serif typeface. Used across every UI surface from oversized 80px hero displays to 11px micro labels. The face has a slightly rounded, friendly character that matches the brand''s playful product positioning. Fallbacks: Noto Sans, -apple-system, BlinkMacSystemFont, sans-serif.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 80px | 500 | 1.05 | -2px | Marketing hero ("See how teams get great done with Miro") |
| `{typography.display-lg}` | 60px | 500 | 1.10 | -1.5px | Major section openers |
| `{typography.heading-1}` | 48px | 500 | 1.15 | -1px | Page-level headlines |
| `{typography.heading-2}` | 36px | 500 | 1.20 | -0.5px | Subsection headlines |
| `{typography.heading-3}` | 28px | 500 | 1.25 | 0 | Card titles |
| `{typography.heading-4}` | 22px | 500 | 1.30 | 0 | Feature tile titles |
| `{typography.heading-5}` | 18px | 500 | 1.40 | 0 | FAQ questions, smaller cards |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Hero subtitle |
| `{typography.body-md}` | 16px | 400 | 1.50 | 0 | Primary body text |
| `{typography.body-md-medium}` | 16px | 500 | 1.50 | 0 | Logo wall labels |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body, table cells |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Filter dropdowns, button labels |
| `{typography.caption}` | 13px | 400 | 1.40 | 0 | Helper text |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Badge labels, tag chips |
| `{typography.micro}` | 12px | 500 | 1.40 | 0 | Footer microcopy |
| `{typography.micro-uppercase}` | 11px | 600 | 1.40 | 0.5px | Section dividers in tables |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | Pill button labels |
| `{typography.stat-display}` | 64px | 500 | 1.10 | -1.5px | "100M+ users" stat callouts |

### Principles
- **Tight hero leading** (1.05) creates magazine-grade display headlines on the 80px hero
- **Negative letter-spacing progression** — display sizes use -2px to -1.5px; smaller headings relax to 0
- **Stat-display token** (64px / 500) for marketing stat callouts
- **Single weight scale** — 400 (body), 500 (medium emphasis + headings), 600 (badges and uppercase). Roobert PRO does not use 700 in this system.

## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (96px) · `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px); pricing comparison tightens to `{spacing.section}` (64px); customer story stack uses `{spacing.xxl}` (32px)
- **Card internal padding**: `{spacing.xl}` (24px) for compact cards; `{spacing.xxl}` (32px) for feature panels

### Grid & Container
- Marketing pages use 1280px max-width with 32px gutters
- Pricing page renders 4-tier card row at desktop (Free / Starter / Business / Enterprise)
- Customer stories page uses 2-column grid with filter dropdowns
- AI Workflows page uses 2-column hero, then 3-up feature grid

### Whitespace Philosophy
Marketing surfaces give content generous breathing room — `{spacing.hero}` (120px) hero padding gives the small wordmark room to breathe. Pricing surfaces tighten dramatically.

## Elevation & Depth

The system runs predominantly flat with strategic depth on hero mockups.

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline-soft}` border | Default cards, table rows, form inputs |
| 1 (subtle) | `rgba(5, 0, 56, 0.04) 0px 1px 2px 0px` | Subtle hover-elevated tiles |
| 2 (card) | `rgba(5, 0, 56, 0.06) 0px 4px 12px 0px` | Standard feature cards |
| 3 (mockup) | `rgba(5, 0, 56, 0.08) 0px 12px 32px -4px` | Hero whiteboard mockup framing |
| 4 (modal) | `rgba(5, 0, 56, 0.12) 0px 16px 48px -8px` | Modals, dropdowns |

### Decorative Depth
- The atmospheric depth on Miro''s hero comes from the live-product-board mockup illustrations — sticky notes layered at z-offsets, color-block tints behind whiteboard frames
- Pastel feature cards carry their own visual weight via saturated background color
- Customer-story cards layer dark photographic content with overlay scrims

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, micro-controls |
| `{rounded.sm}` | 6px | Discount badges |
| `{rounded.md}` | 8px | Inputs, search-pill |
| `{rounded.lg}` | 12px | Standard cards, table containers |
| `{rounded.xl}` | 16px | Pricing cards, feature panels |
| `{rounded.xxl}` | 20px | Larger feature cards |
| `{rounded.xxxl}` | 28px | Pastel feature cards (yellow, rose, coral, teal) |
| `{rounded.feature}` | 32px | Hero CTA banner cards |
| `{rounded.full}` | 9999px | All buttons, pill tabs, badges |

### Photography Geometry
- Real Miro board mockups render with `{rounded.xl}` (16px) corners and a subtle drop shadow
- Customer story cards use `{rounded.xxxl}` (28px) corners with full-bleed photography
- Template card thumbnails use `{rounded.xl}` (16px) with photographic content
- Customer logos wall presents wordmarks inline at consistent 100px height

## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Black pill primary CTA, the dominant action ("Get started free").
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` lifts to `{colors.charcoal}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background and `{colors.muted}` text.

**`button-yellow`** — Brand-yellow pill for moments of brand emphasis.
- Background `{colors.brand-yellow}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-blue`** — Brand-blue pill for inline action callouts.
- Background `{colors.brand-blue}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-secondary`** — Outlined pill for secondary actions ("Book a demo").
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-on-dark`** — White pill for dark CTA banners.
- Background `{colors.on-dark}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-ghost`** — Quieter rectangular ghost button.
- Background transparent, text `{colors.ink}`, typography `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.md}`.

**`button-link`** — Inline text link.
- Background transparent, text `{colors.brand-blue}`, typography `{typography.body-sm-medium}`, padding `0`.

**`button-icon-circular`** — 36×36px circular utility button.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.full}`.

### Cards & Containers

**`card-base`** — Standard content card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`card-feature`** — White feature card with larger 28px corners.
- Background `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`.

**`card-feature-yellow`** — Pastel-yellow feature card.
- Background `{colors.brand-yellow}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-feature-coral`** — Pastel-coral feature card variant.
- Background `{colors.coral-light}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-feature-teal`** — Pastel-teal feature card variant.
- Background `{colors.teal-light}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-feature-rose`** — Pastel-rose feature card variant.
- Background `{colors.rose-light}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-customer-story`** — Customer story card.
- Background `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `0` (image fills the card), border `1px solid {colors.hairline-soft}`.

**`card-stat`** — Stat-row cell for "100M+ users".
- Background transparent, text `{colors.ink}`, typography `{typography.stat-display}`, padding `{spacing.lg}`.

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`pricing-card-featured`** — Featured pricing tier (Business — lavender background + blue border).
- Background `{colors.surface-pricing-featured}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`, border `2px solid {colors.brand-blue}`.

**`pricing-card-enterprise`** — Dark-canvas enterprise tier card.
- Background `{colors.primary}`, text `{colors.on-primary}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.brand-blue}`.

**`search-pill`** — Search bar.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, height 40px, border `1px solid {colors.hairline}`.

**`filter-dropdown`** — Pill-shaped filter dropdown ("Company use" / "Industry" / "Use case").
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`, rounded `{rounded.full}`, padding `{spacing.xs} {spacing.md}`, border `1px solid {colors.hairline-strong}`.

### Tabs

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav.
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.primary}`, text `{colors.on-primary}`.

**`toggle-monthly-yearly`** — Two-state pill toggle (Monthly / Annual on pricing).
- Background `{colors.surface}`, rounded `{rounded.full}`, padding `4px`.

### Badges & Status

**`badge-promo`** — Yellow promo banner badge.
- Background `{colors.brand-yellow}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-yellow`** — Soft-yellow feature tag chip ("Yellow" tag on AI Workflows page).
- Background `{colors.surface-yellow}`, text `{colors.yellow-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-purple`** — Lavender feature tag chip ("AI agent" tag).
- Background `{colors.surface-pricing-featured}`, text `{colors.brand-blue}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-coral`** — Coral feature tag chip variant.
- Background `{colors.coral-light}`, text `{colors.coral-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-success`** — Green success indicator.
- Background `{colors.success-accent}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-discount`** — Yellow rectangular discount pill ("Save 15%").
- Background `{colors.brand-yellow}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 6px`.

**`promo-banner`** — Sticky black promo strip ABOVE the top nav.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`. Carries inline yellow "GET YOUR SPOT" pill.

### Tables

**`comparison-table`** — Pricing feature comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`comparison-row`** — Individual feature row.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.lg}`, bottom border `1px solid {colors.hairline-soft}`.

### Documentation Components

**`whiteboard-mockup`** — Real Miro-board UI rendered as feature illustration.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, border `1px solid {colors.hairline-soft}`, shadow `rgba(5, 0, 56, 0.08) 0px 12px 32px -4px`.

**`template-card`** — Template thumbnail card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.md}`, border `1px solid {colors.hairline}`.

**`industry-tile`** — Industry-vertical tile.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`faq-accordion-item`** — FAQ panel item.
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, bottom border `1px solid {colors.hairline}`.

**`logo-wall-item`** — Customer logo wordmark cell.
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.

**`capterra-badge`** — Review/rating badge in the footer.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.caption}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, border `1px solid {colors.hairline}`.

**`app-store-badge`** — App store / Google Play download pill.
- Background `{colors.canvas}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar with yellow Miro wordmark + horizontal links + right-side CTAs.
- Background `{colors.canvas}`, height ~64px.
- Left: Yellow square Miro wordmark + horizontal link list (Product, Solutions, Resources).
- Right: "Login / Pricing / Contact sales" links + black-pill "Get started free".

### Signature Components

**`hero-band-marketing`** — Marketing hero band.
- Background `{colors.canvas}`, padding `{spacing.hero}`.
- Layout: centered headline in `{typography.hero-display}`, centered subtitle, centered button row, then whiteboard mockup illustration below.

**`cta-banner-dark`** — Dark CTA banner at the bottom of feature pages.
- Background `{colors.primary}`, text `{colors.on-primary}`, rounded `{rounded.feature}`, padding `{spacing.section}`. Centered headline + subtitle + `button-on-dark` "Get started free".

**`footer-region`** — Massive multi-column dark footer.
- Background `{colors.footer-bg}`, padding `{spacing.section} {spacing.xxl}`.
- 6-column link grid (Product / Solutions / Tools / Resources / Company / Plans & Pricing).
- Section headings in `{typography.body-md-medium}` `{colors.on-dark}`.

**`footer-link`** — Individual link in the footer.
- Background transparent, text `{colors.on-dark-muted}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.

## Do''s and Don''ts

### Do
- Reserve `{colors.brand-yellow}` for the wordmark, top promo banner, and "yellow tag" chips
- Use `{colors.primary}` (black) as the dominant CTA on all surfaces
- Pair pastel feature cards (yellow, rose, coral, teal) with white feature cards in the same viewport
- Apply `{rounded.full}` to every button, every pill tab, every status badge
- Apply `{rounded.xxxl}` (28px) to pastel feature cards
- Use real Miro-board mockups as feature illustrations
- Maintain Roobert PRO across every UI surface

### Don''t
- Don''t use `{colors.brand-yellow}` on standard CTAs or large background surfaces
- Don''t introduce additional accent colors beyond yellow + brand pastels
- Don''t soften corners on buttons; the pill is a brand signature
- Don''t reduce hero leading below 1.05
- Don''t apply heavy shadows on flat documentation cards; reserve elevation for whiteboard mockups
- Don''t use stock photography — show the live product board UI

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero scales to 36px. Pill nav collapses to hamburger. Pricing tiers stack 1-up. |
| Mobile (large) | 480 – 767px | Feature tiles 2-up. Hero scales to 48px. |
| Tablet | 768 – 1023px | 2-column feature grids. Pill-tab nav returns. |
| Desktop | 1024 – 1279px | 4-tier pricing card row. Customer story grid 2-up. Hero at 64px. |
| Wide Desktop | ≥ 1280px | Full hero presentation, 80px hero display. |

### Touch Targets
- Pill buttons render at 40–44px effective height — at WCAG AAA floor
- Circular icon buttons: 36×36px desktop → 44×44px mobile
- Form inputs render at 44px height
- Filter dropdowns render at ~36px tall — bumps to 44px on mobile

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger
- **Hero band**: 2-column hero collapses to stacked at < 1024px
- **Pricing comparison**: 4-column tiers → 2-column tablet → 1-column mobile; comparison table becomes horizontal-scroll
- **Customer story grid**: 2-up → 1-up at < 768px
- **Hero typography**: 80px → 60px tablet → 48px mobile-large → 36px mobile-small
- **Footer**: 6-column desktop → 3-column tablet → 2-column mobile → accordion at small mobile

### Image Behavior
- Whiteboard mockups maintain aspect ratio; lazy-loaded below the fold
- Customer story photography uses 16:9 ratio with full-bleed scaling
- Logo wall presents wordmarks at consistent 100px height

## Iteration Guide

1. Focus on ONE component at a time
2. Reference component names and tokens directly
3. Run `npx @google/design.md lint DESIGN.md` after edits
4. Add new variants as separate `components:` entries
5. Default to `{typography.body-md}` for body and `{typography.subtitle}` for emphasis
6. Keep `{colors.brand-yellow}` confined to wordmark, promo banner, and yellow-tag chips
7. Pill-shaped buttons (`{rounded.full}`) always
8. When showing the product, use a real Miro-board mockup with sticky-note color tints

## Known Gaps

- Specific dark-mode token values not surfaced
- Animation/transition timings not extracted; recommend 150–200ms ease
- Form validation success state not explicitly captured beyond defaults
- Sticky note color tints inside the actual whiteboard product are richer than what marketing surfaces capture
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

Miro positions itself as the AI-powered visual workspace through a confident, slightly playful brand voice. The homepage opens with a stark white canvas anchored by a small canary-yellow Miro wordmark in the top-left, a black-pill primary CTA "Get started free" and a secondary "Book a demo" outline pill — then dramatic real-Miro-board mockup imagery (sticky notes, kanban, mind maps) carries the visual weight. Across deeper surfaces, the system breaks open: pastel feature cards (rose, teal, coral, yellow) echo the actual sticky-note color palette of the live whiteboard product, and customer story cards reuse those tints to differentiate brand vignettes.

Roobert PRO — Miro''s custom display face — anchors every typographic surface, from the 80px hero display down to 11px micro labels. The face''s slightly rounded, geometric character pairs naturally with the playful product photography and the friendly product positioning. Black-pill primary buttons (`{rounded.full}`) dominate marketing CTAs; the brand color, signature canary yellow ({colors.brand-yellow}), is reserved for the wordmark, top promo banners, and "yellow tag" feature pills — never as a primary CTA. The 4-tier pricing comparison (Free / Starter / Business / Enterprise) leads into the densest surface in the system: a feature comparison table that runs ~80 rows deep across multiple section dividers.

**Key Characteristics:**
- Stark white canvas + Miro wordmark in canary yellow ({colors.brand-yellow}) as the recognizable opening signature
- Black-pill primary CTAs ({colors.primary} + `{rounded.full}`) as the dominant interactive element
- Pastel feature cards (yellow, rose, coral, teal, mint) that echo the actual sticky-note palette
- Roobert PRO across every UI surface; geometric, slightly rounded character
- Real Miro-board mockup imagery used as feature illustrations
- 4-tier pricing card grid + dense feature comparison table
- Massive dark footer ({colors.footer-bg}) with multi-column links + app-store badges', '{"sourcePath":"docs/design-md/miro/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: miro.com/ (homepage), /pricing/ (4-tier comparison), /products/ai-workflows/ (AI product), /agile/ (vertical landing), /customers/ (story directory). Token coverage was identical across all five pages.

### Brand & Accent
- **Miro Yellow** ({colors.brand-yellow}): The brand''s recognizable canary yellow — wordmark color, top promo banner, "yellow tag" pills
- **Yellow Deep** ({colors.brand-yellow-deep}): Darker variant for hover states and emphasis
- **Yellow Light** ({colors.yellow-light}): Pale yellow background tint for tag chips
- **Yellow Dark** ({colors.yellow-dark}): Yellow-tag text color (dark olive) for chip foreground
- **Brand Blue** ({colors.brand-blue}): Action blue for inline links and featured-pricing-tier border
- **Blue Pressed** ({colors.blue-pressed}): Pressed-state blue
- **Brand Coral** ({colors.brand-coral}): Coral accent for warm callouts
- **Coral Light** ({colors.coral-light}): Pale coral for feature card backgrounds
- **Coral Dark** ({colors.coral-dark}): Coral-tag text color (deep wine)
- **Brand Rose** ({colors.brand-rose}): Soft rose-pink for feature card variants
- **Brand Teal** ({colors.brand-teal}): Brand teal
- **Teal Light** ({colors.teal-light}): Pale teal for feature card backgrounds
- **Moss Dark** ({colors.moss-dark}): Deep teal-green text color
- **Brand Pink** ({colors.brand-pink}): Pale pink for soft callouts
- **Brand Orange Light** ({colors.brand-orange-light}): Soft orange for feature card backgrounds

### Surface
- **Canvas White** ({colors.canvas}): Page background and primary card surface
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions
- **Surface Yellow** ({colors.surface-yellow}): Pale yellow-tinted surface for tag chip
- **Surface Pricing Featured** ({colors.surface-pricing-featured}): Pale lavender for featured pricing tier
- **Hairline** ({colors.hairline}): 1px borders and primary dividers
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row dividers
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px border for inputs

### Text
- **Ink Deep** ({colors.ink-deep}): Headlines on lighter feature cards
- **Ink** ({colors.ink}): Primary headlines and body text
- **Charcoal** ({colors.charcoal}): Body emphasis text
- **Slate** ({colors.slate}): Secondary text, metadata
- **Steel** ({colors.steel}): Tertiary text, footer links
- **Stone** ({colors.stone}): Captions, muted labels
- **Muted** ({colors.muted}): Disabled labels, input placeholders
- **On Dark** ({colors.on-dark}): White text on dark surfaces
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white on dark

### Semantic
- **Success Accent** ({colors.success-accent}): Confirmation/success indicator green
- **Brand Red** ({colors.brand-red}): Soft red for error backgrounds
- **Brand Red Dark** ({colors.brand-red-dark}): Stronger red for error borders', '{"sourcePath":"docs/design-md/miro/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**Roobert PRO** (primary): Miro''s custom geometric sans-serif typeface. Used across every UI surface from oversized 80px hero displays to 11px micro labels. The face has a slightly rounded, friendly character that matches the brand''s playful product positioning. Fallbacks: Noto Sans, -apple-system, BlinkMacSystemFont, sans-serif.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 80px | 500 | 1.05 | -2px | Marketing hero ("See how teams get great done with Miro") |
| `{typography.display-lg}` | 60px | 500 | 1.10 | -1.5px | Major section openers |
| `{typography.heading-1}` | 48px | 500 | 1.15 | -1px | Page-level headlines |
| `{typography.heading-2}` | 36px | 500 | 1.20 | -0.5px | Subsection headlines |
| `{typography.heading-3}` | 28px | 500 | 1.25 | 0 | Card titles |
| `{typography.heading-4}` | 22px | 500 | 1.30 | 0 | Feature tile titles |
| `{typography.heading-5}` | 18px | 500 | 1.40 | 0 | FAQ questions, smaller cards |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Hero subtitle |
| `{typography.body-md}` | 16px | 400 | 1.50 | 0 | Primary body text |
| `{typography.body-md-medium}` | 16px | 500 | 1.50 | 0 | Logo wall labels |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body, table cells |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Filter dropdowns, button labels |
| `{typography.caption}` | 13px | 400 | 1.40 | 0 | Helper text |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Badge labels, tag chips |
| `{typography.micro}` | 12px | 500 | 1.40 | 0 | Footer microcopy |
| `{typography.micro-uppercase}` | 11px | 600 | 1.40 | 0.5px | Section dividers in tables |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | Pill button labels |
| `{typography.stat-display}` | 64px | 500 | 1.10 | -1.5px | "100M+ users" stat callouts |

### Principles
- **Tight hero leading** (1.05) creates magazine-grade display headlines on the 80px hero
- **Negative letter-spacing progression** — display sizes use -2px to -1.5px; smaller headings relax to 0
- **Stat-display token** (64px / 500) for marketing stat callouts
- **Single weight scale** — 400 (body), 500 (medium emphasis + headings), 600 (badges and uppercase). Roobert PRO does not use 700 in this system.', '{"sourcePath":"docs/design-md/miro/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (96px) · `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px); pricing comparison tightens to `{spacing.section}` (64px); customer story stack uses `{spacing.xxl}` (32px)
- **Card internal padding**: `{spacing.xl}` (24px) for compact cards; `{spacing.xxl}` (32px) for feature panels

### Grid & Container
- Marketing pages use 1280px max-width with 32px gutters
- Pricing page renders 4-tier card row at desktop (Free / Starter / Business / Enterprise)
- Customer stories page uses 2-column grid with filter dropdowns
- AI Workflows page uses 2-column hero, then 3-up feature grid

### Whitespace Philosophy
Marketing surfaces give content generous breathing room — `{spacing.hero}` (120px) hero padding gives the small wordmark room to breathe. Pricing surfaces tighten dramatically.', '{"sourcePath":"docs/design-md/miro/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

The system runs predominantly flat with strategic depth on hero mockups.

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline-soft}` border | Default cards, table rows, form inputs |
| 1 (subtle) | `rgba(5, 0, 56, 0.04) 0px 1px 2px 0px` | Subtle hover-elevated tiles |
| 2 (card) | `rgba(5, 0, 56, 0.06) 0px 4px 12px 0px` | Standard feature cards |
| 3 (mockup) | `rgba(5, 0, 56, 0.08) 0px 12px 32px -4px` | Hero whiteboard mockup framing |
| 4 (modal) | `rgba(5, 0, 56, 0.12) 0px 16px 48px -8px` | Modals, dropdowns |

### Decorative Depth
- The atmospheric depth on Miro''s hero comes from the live-product-board mockup illustrations — sticky notes layered at z-offsets, color-block tints behind whiteboard frames
- Pastel feature cards carry their own visual weight via saturated background color
- Customer-story cards layer dark photographic content with overlay scrims', '{"sourcePath":"docs/design-md/miro/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, micro-controls |
| `{rounded.sm}` | 6px | Discount badges |
| `{rounded.md}` | 8px | Inputs, search-pill |
| `{rounded.lg}` | 12px | Standard cards, table containers |
| `{rounded.xl}` | 16px | Pricing cards, feature panels |
| `{rounded.xxl}` | 20px | Larger feature cards |
| `{rounded.xxxl}` | 28px | Pastel feature cards (yellow, rose, coral, teal) |
| `{rounded.feature}` | 32px | Hero CTA banner cards |
| `{rounded.full}` | 9999px | All buttons, pill tabs, badges |

### Photography Geometry
- Real Miro board mockups render with `{rounded.xl}` (16px) corners and a subtle drop shadow
- Customer story cards use `{rounded.xxxl}` (28px) corners with full-bleed photography
- Template card thumbnails use `{rounded.xl}` (16px) with photographic content
- Customer logos wall presents wordmarks inline at consistent 100px height', '{"sourcePath":"docs/design-md/miro/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Black pill primary CTA, the dominant action ("Get started free").
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` lifts to `{colors.charcoal}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background and `{colors.muted}` text.

**`button-yellow`** — Brand-yellow pill for moments of brand emphasis.
- Background `{colors.brand-yellow}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-blue`** — Brand-blue pill for inline action callouts.
- Background `{colors.brand-blue}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-secondary`** — Outlined pill for secondary actions ("Book a demo").
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-on-dark`** — White pill for dark CTA banners.
- Background `{colors.on-dark}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-ghost`** — Quieter rectangular ghost button.
- Background transparent, text `{colors.ink}`, typography `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.md}`.

**`button-link`** — Inline text link.
- Background transparent, text `{colors.brand-blue}`, typography `{typography.body-sm-medium}`, padding `0`.

**`button-icon-circular`** — 36×36px circular utility button.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.full}`.

### Cards & Containers

**`card-base`** — Standard content card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`card-feature`** — White feature card with larger 28px corners.
- Background `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`.

**`card-feature-yellow`** — Pastel-yellow feature card.
- Background `{colors.brand-yellow}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-feature-coral`** — Pastel-coral feature card variant.
- Background `{colors.coral-light}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-feature-teal`** — Pastel-teal feature card variant.
- Background `{colors.teal-light}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-feature-rose`** — Pastel-rose feature card variant.
- Background `{colors.rose-light}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-customer-story`** — Customer story card.
- Background `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `0` (image fills the card), border `1px solid {colors.hairline-soft}`.

**`card-stat`** — Stat-row cell for "100M+ users".
- Background transparent, text `{colors.ink}`, typography `{typography.stat-display}`, padding `{spacing.lg}`.

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`pricing-card-featured`** — Featured pricing tier (Business — lavender background + blue border).
- Background `{colors.surface-pricing-featured}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`, border `2px solid {colors.brand-blue}`.

**`pricing-card-enterprise`** — Dark-canvas enterprise tier card.
- Background `{colors.primary}`, text `{colors.on-primary}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.brand-blue}`.

**`search-pill`** — Search bar.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, height 40px, border `1px solid {colors.hairline}`.

**`filter-dropdown`** — Pill-shaped filter dropdown ("Company use" / "Industry" / "Use case").
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`, rounded `{rounded.full}`, padding `{spacing.xs} {spacing.md}`, border `1px solid {colors.hairline-strong}`.

### Tabs

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav.
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.primary}`, text `{colors.on-primary}`.

**`toggle-monthly-yearly`** — Two-state pill toggle (Monthly / Annual on pricing).
- Background `{colors.surface}`, rounded `{rounded.full}`, padding `4px`.

### Badges & Status

**`badge-promo`** — Yellow promo banner badge.
- Background `{colors.brand-yellow}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-yellow`** — Soft-yellow feature tag chip ("Yellow" tag on AI Workflows page).
- Background `{colors.surface-yellow}`, text `{colors.yellow-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-purple`** — Lavender feature tag chip ("AI agent" tag).
- Background `{colors.surface-pricing-featured}`, text `{colors.brand-blue}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-coral`** — Coral feature tag chip variant.
- Background `{colors.coral-light}`, text `{colors.coral-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-success`** — Green success indicator.
- Background `{colors.success-accent}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-discount`** — Yellow rectangular discount pill ("Save 15%").
- Background `{colors.brand-yellow}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 6px`.

**`promo-banner`** — Sticky black promo strip ABOVE the top nav.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`. Carries inline yellow "GET YOUR SPOT" pill.

### Tables

**`comparison-table`** — Pricing feature comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`comparison-row`** — Individual feature row.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.lg}`, bottom border `1px solid {colors.hairline-soft}`.

### Documentation Components

**`whiteboard-mockup`** — Real Miro-board UI rendered as feature illustration.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, border `1px solid {colors.hairline-soft}`, shadow `rgba(5, 0, 56, 0.08) 0px 12px 32px -4px`.

**`template-card`** — Template thumbnail card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.md}`, border `1px solid {colors.hairline}`.

**`industry-tile`** — Industry-vertical tile.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`faq-accordion-item`** — FAQ panel item.
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, bottom border `1px solid {colors.hairline}`.

**`logo-wall-item`** — Customer logo wordmark cell.
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.

**`capterra-badge`** — Review/rating badge in the footer.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.caption}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, border `1px solid {colors.hairline}`.

**`app-store-badge`** — App store / Google Play download pill.
- Background `{colors.canvas}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar with yellow Miro wordmark + horizontal links + right-side CTAs.
- Background `{colors.canvas}`, height ~64px.
- Left: Yellow square Miro wordmark + horizontal link list (Product, Solutions, Resources).
- Right: "Login / Pricing / Contact sales" links + black-pill "Get started free".

### Signature Components

**`hero-band-marketing`** — Marketing hero band.
- Background `{colors.canvas}`, padding `{spacing.hero}`.
- Layout: centered headline in `{typography.hero-display}`, centered subtitle, centered button row, then whiteboard mockup illustration below.

**`cta-banner-dark`** — Dark CTA banner at the bottom of feature pages.
- Background `{colors.primary}`, text `{colors.on-primary}`, rounded `{rounded.feature}`, padding `{spacing.section}`. Centered headline + subtitle + `button-on-dark` "Get started free".

**`footer-region`** — Massive multi-column dark footer.
- Background `{colors.footer-bg}`, padding `{spacing.section} {spacing.xxl}`.
- 6-column link grid (Product / Solutions / Tools / Resources / Company / Plans & Pricing).
- Section headings in `{typography.body-md-medium}` `{colors.on-dark}`.

**`footer-link`** — Individual link in the footer.
- Background transparent, text `{colors.on-dark-muted}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.', '{"sourcePath":"docs/design-md/miro/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.brand-yellow}` for the wordmark, top promo banner, and "yellow tag" chips
- Use `{colors.primary}` (black) as the dominant CTA on all surfaces
- Pair pastel feature cards (yellow, rose, coral, teal) with white feature cards in the same viewport
- Apply `{rounded.full}` to every button, every pill tab, every status badge
- Apply `{rounded.xxxl}` (28px) to pastel feature cards
- Use real Miro-board mockups as feature illustrations
- Maintain Roobert PRO across every UI surface

### Don''t
- Don''t use `{colors.brand-yellow}` on standard CTAs or large background surfaces
- Don''t introduce additional accent colors beyond yellow + brand pastels
- Don''t soften corners on buttons; the pill is a brand signature
- Don''t reduce hero leading below 1.05
- Don''t apply heavy shadows on flat documentation cards; reserve elevation for whiteboard mockups
- Don''t use stock photography — show the live product board UI', '{"sourcePath":"docs/design-md/miro/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero scales to 36px. Pill nav collapses to hamburger. Pricing tiers stack 1-up. |
| Mobile (large) | 480 – 767px | Feature tiles 2-up. Hero scales to 48px. |
| Tablet | 768 – 1023px | 2-column feature grids. Pill-tab nav returns. |
| Desktop | 1024 – 1279px | 4-tier pricing card row. Customer story grid 2-up. Hero at 64px. |
| Wide Desktop | ≥ 1280px | Full hero presentation, 80px hero display. |

### Touch Targets
- Pill buttons render at 40–44px effective height — at WCAG AAA floor
- Circular icon buttons: 36×36px desktop → 44×44px mobile
- Form inputs render at 44px height
- Filter dropdowns render at ~36px tall — bumps to 44px on mobile

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger
- **Hero band**: 2-column hero collapses to stacked at < 1024px
- **Pricing comparison**: 4-column tiers → 2-column tablet → 1-column mobile; comparison table becomes horizontal-scroll
- **Customer story grid**: 2-up → 1-up at < 768px
- **Hero typography**: 80px → 60px tablet → 48px mobile-large → 36px mobile-small
- **Footer**: 6-column desktop → 3-column tablet → 2-column mobile → accordion at small mobile

### Image Behavior
- Whiteboard mockups maintain aspect ratio; lazy-loaded below the fold
- Customer story photography uses 16:9 ratio with full-bleed scaling
- Logo wall presents wordmarks at consistent 100px height', '{"sourcePath":"docs/design-md/miro/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time
2. Reference component names and tokens directly
3. Run `npx @google/design.md lint DESIGN.md` after edits
4. Add new variants as separate `components:` entries
5. Default to `{typography.body-md}` for body and `{typography.subtitle}` for emphasis
6. Keep `{colors.brand-yellow}` confined to wordmark, promo banner, and yellow-tag chips
7. Pill-shaped buttons (`{rounded.full}`) always
8. When showing the product, use a real Miro-board mockup with sticky-note color tints', '{"sourcePath":"docs/design-md/miro/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Specific dark-mode token values not surfaced
- Animation/transition timings not extracted; recommend 150–200ms ease
- Form validation success state not explicitly captured beyond defaults
- Sticky note color tints inside the actual whiteboard product are richer than what marketing surfaces capture', '{"sourcePath":"docs/design-md/miro/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_1', '#1c1c1e', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_3', '#ffd02f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_4', '#fcb900', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_5', '#fff4c4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_6', '#746019', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_7', '#4262ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_8', '#5b76fe', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_9', '#2a41b6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_10', '#ff9999', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_11', '#ffc6c6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_12', '#600000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_13', '#ffd8f4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_14', '#fde0f0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_15', '#0fbcb0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_16', '#c3faf5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_17', '#187574', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_18', '#ffe6cd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_19', '#fbd4d4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_20', '#e3c5c5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_21', '#00b473', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_22', '#f7f8fa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_23', '#fafbfc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_24', '#fff8e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_25', '#f5f3ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_26', '#e0e2e8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_27', '#eef0f3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_28', '#c7cad5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_29', '#050038', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_30', '#2c2c34', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_31', '#555a6a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_32', '#6b6f7e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_33', '#8e91a0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md'), 'color', 'color_34', '#a5a8b5', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/miro/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/miro/DESIGN.md';


-- Mistral Ai
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Mistral Ai', 'mistral.ai', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/mistral.ai/DESIGN.md', null, 'seeded', '---
version: alpha
name: Mistral-AI-design-analysis
description: Mistral AI brands itself with a singular signature — atmospheric sunset gradients (mustard, orange, deep red) layered over photography of mountains, plus a horizontal "sunset stripe" bar that closes every page. The system pairs warm cream-yellow surfaces ({colors.cream}) with a saturated orange primary CTA ({colors.primary}) and uses an elegant near-serif voice for hero displays. Coverage spans homepage (Frontier AI hero), Le Studio product page, Coding solutions, news article surfaces, contact form, and services tier page — all anchored by the signature gradient closing band.

colors:
  primary: "#fa520f"
  primary-deep: "#cc3a05"
  on-primary: "#ffffff"
  sunshine-300: "#ffd06a"
  sunshine-500: "#ffb83e"
  sunshine-700: "#ffa110"
  sunshine-800: "#ff8105"
  sunshine-900: "#ff8a00"
  yellow-saturated: "#ffd900"
  cream: "#fff8e0"
  cream-light: "#fffaeb"
  cream-deeper: "#fff0c2"
  beige-deep: "#e6d5a8"
  block-5: "#ffe295"
  block-6: "#ffd900"
  block-7: "#ff8105"
  ink: "#1f1f1f"
  ink-tint: "#3d3d3d"
  charcoal: "#2c2c2c"
  slate: "#4a4a4a"
  steel: "#6a6a6a"
  stone: "#8a8a8a"
  muted: "#a8a8a8"
  hairline: "#e5e5e5"
  hairline-soft: "#ededed"
  hairline-strong: "#c7c7c7"
  canvas: "#ffffff"
  surface: "#fafafa"
  surface-cream: "#fff8e0"
  surface-cream-soft: "#fffaeb"
  surface-code: "#1c1c1e"
  on-dark: "#ffffff"
  on-dark-muted: "#a8a8a8"
  on-cream: "#1f1f1f"
  footer-cream: "#fff8e0"
  link: "#fa520f"

typography:
  hero-display:
    fontFamily: PP Editorial Old
    fontSize: 84px
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: -1.5px
  display-lg:
    fontFamily: PP Editorial Old
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.10
    letterSpacing: -1px
  heading-1:
    fontFamily: PP Editorial Old
    fontSize: 52px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: -0.5px
  heading-2:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: -0.5px
  heading-3:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.25
  heading-4:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.30
  heading-5:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.40
  subtitle:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-md-medium:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.55
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  body-sm-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.50
  caption:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  caption-bold:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.40
  micro:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.40
  micro-uppercase:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: 1px
  button-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.30
  stat-display:
    fontFamily: PP Editorial Old
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.10
    letterSpacing: -1px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 20px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section-sm: 48px
  section: 64px
  section-lg: 96px
  hero: 120px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-pressed:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.muted}"
  button-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    border: "1px solid {colors.beige-deep}"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    border: "1px solid {colors.hairline-strong}"
  button-on-cream:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    border: "1px solid {colors.beige-deep}"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm-medium}"
    padding: "0"
  card-base:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline-soft}"
  card-feature:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline-soft}"
  card-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.beige-deep}"
  card-cream-soft:
    backgroundColor: "{colors.surface-cream-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-product:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline-soft}"
    shadow: "rgba(0, 0, 0, 0.04) 0px 4px 12px"
  card-photographic:
    backgroundColor: "{colors.surface-code}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "0"
  pricing-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline-soft}"
  pricing-card-featured:
    backgroundColor: "{colors.cream}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "2px solid {colors.primary}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline-strong}"
    height: 44px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.primary}"
  text-area:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline-strong}"
  contact-form-panel:
    backgroundColor: "{colors.cream}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.beige-deep}"
  pill-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.md}"
    border: "1px solid {colors.hairline}"
  pill-tab-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    border: "1px solid {colors.ink}"
  segmented-tab:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
    border: "0 0 2px transparent solid"
  segmented-tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm-medium}"
    border: "0 0 2px {colors.primary} solid"
  badge-orange:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-cream:
    backgroundColor: "{colors.cream-deeper}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  promo-banner:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
  hero-band-sunset:
    backgroundColor: "{colors.sunshine-700}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "{spacing.hero}"
  sunset-stripe-band:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "0"
    padding: "{spacing.lg} 0"
  cta-banner-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.section}"
  code-block:
    backgroundColor: "{colors.surface-code}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  code-block-header:
    backgroundColor: "{colors.surface-code}"
    textColor: "{colors.on-dark-muted}"
    typography: "{typography.caption}"
    padding: "{spacing.xs} {spacing.md}"
    border: "0 0 1px rgba(255,255,255,0.08) solid"
  feature-icon-tile:
    backgroundColor: "{colors.cream}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    border: "1px solid {colors.beige-deep}"
  industry-tile:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline-soft}"
  stat-cell:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.stat-display}"
    padding: "{spacing.lg}"
  customer-testimonial-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline-soft}"
  logo-wall-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-md-medium}"
    padding: "{spacing.lg}"
  faq-accordion-item:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    border: "0 0 1px {colors.hairline} solid"
  footer-region:
    backgroundColor: "{colors.footer-cream}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "{spacing.section} {spacing.xxl}"
  footer-link:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
  app-store-badge:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
---

## Overview

Mistral AI carries itself with a singular, almost cinematographic visual signature — the homepage opens with "Frontier AI. In your hands." rendered in elegant near-serif display type over a photographic mountain landscape bathed in mustard-orange sunset light. Below the hero, every page closes with the same recognizable element: a horizontal "sunset stripe" gradient band running red→orange→yellow→cream that wraps the foot of the page just above the footer. This stripe is THE brand recognizer — it appears on the homepage, products/studio, solutions/coding, news articles, contact form, and services tier page without exception.

The system pairs PP Editorial Old (a near-serif elegant display face) for hero displays with Inter for everything else (body, headings, UI). Cream-yellow surfaces ({colors.cream}, {colors.surface-cream-soft}) anchor form panels and feature cards; saturated orange ({colors.primary}) carries primary CTAs; the deep mountain photography on the homepage and the dark code mockups inside Le Studio create photographic depth. Cards are rectangular with `{rounded.lg}` (12px) corners — distinctly less playful than Miro''s or Mintlify''s pill-buttons-everywhere approach. Buttons are also `{rounded.md}` (8px), not pills — Mistral''s geometry is more sober and editorial than its peers.

**Key Characteristics:**
- Atmospheric mountain-sunset hero photography (orange-red-yellow gradient sky)
- Horizontal "sunset stripe" band ({colors.primary} → {colors.sunshine-700} → {colors.yellow-saturated} → {colors.cream}) at every page bottom
- Cream-yellow surfaces ({colors.cream}, {colors.cream-soft}) for form panels and feature cards
- PP Editorial Old (or similar near-serif) for hero displays; Inter for everything else
- `{rounded.md}` (8px) buttons and `{rounded.lg}` (12px) cards — less playful, more editorial geometry
- Saturated orange primary CTA ({colors.primary}) carries every action call

## Colors

> Source pages: mistral.ai/ (homepage), /products/studio (Le Studio product), /solutions/coding (coding solution), /news/vibe-remote-agents-mistral-medium-3-5 (news), /contact (contact form), /services (services tiers). Token coverage was identical across all six pages.

### Brand & Accent
- **Mistral Orange** ({colors.primary}): Primary CTA color, brand orange
- **Orange Deep** ({colors.primary-deep}): Pressed-state and emphasis variant
- **Sunshine 300** ({colors.sunshine-300}): Atmospheric light orange-yellow
- **Sunshine 500** ({colors.sunshine-500}): Mid-spectrum sunset orange
- **Sunshine 700** ({colors.sunshine-700}): Saturated mid sunset gradient stop
- **Sunshine 800** ({colors.sunshine-800}): Deep sunset gradient stop
- **Sunshine 900** ({colors.sunshine-900}): Deepest sunset orange
- **Yellow Saturated** ({colors.yellow-saturated}): Pure brand yellow used in the sunset stripe gradient
- **Block 5/6/7** ({colors.block-5}, {colors.block-6}, {colors.block-7}): Spectrum stops along the sunset gradient (light-yellow → mid-yellow → deep-orange)

### Cream / Neutral Warm
- **Cream** ({colors.cream}): Warm yellow-cream surface for form panels, feature cards, footer
- **Cream Soft** ({colors.cream-soft}): Lighter cream variant
- **Cream Deeper** ({colors.cream-deeper}): More-saturated cream for badge/tag chips
- **Beige Deep** ({colors.beige-deep}): Cream surface 1px border color

### Surface
- **Canvas White** ({colors.canvas}): Page background and card surface
- **Surface** ({colors.surface}): Subtle quieter background
- **Surface Cream** ({colors.surface-cream}): Cream-yellow tinted surface
- **Surface Code** ({colors.surface-code}): Dark code-block / IDE mockup surface
- **Hairline** ({colors.hairline}): 1px borders
- **Hairline Soft** ({colors.hairline-soft}): Quieter dividers
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px border for inputs

### Text
- **Ink** ({colors.ink}): Primary headlines and body text
- **Ink Tint** ({colors.ink-tint}): Slightly softer black for hero overlay text
- **Charcoal** ({colors.charcoal}): Body emphasis
- **Slate** ({colors.slate}): Secondary text
- **Steel** ({colors.steel}): Tertiary text, captions
- **Stone** ({colors.stone}): Muted labels
- **Muted** ({colors.muted}): Disabled, placeholders
- **On Dark** ({colors.on-dark}): White text on dark surfaces
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white
- **On Cream** ({colors.on-cream}): Ink text on cream surfaces

### Semantic
- **Link** ({colors.link}): Inline link color (matches primary orange)

## Typography

### Font Family
**PP Editorial Old** (display): Mistral''s signature near-serif elegant display typeface used for hero displays, large numbers, and editorial section openers. Carries a slightly classical, intelligent character that contrasts the contemporary product positioning. Fallbacks: ''Times New Roman'', Georgia, serif.

**Inter** (UI prose): Variable typeface for body, navigation, buttons, labels, captions. Fallbacks: ui-sans-serif, system-ui, -apple-system, sans-serif.

**JetBrains Mono** (code): Monospace for code blocks and IDE mockups. Fallbacks: ''SF Mono'', Menlo, Consolas, monospace.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Family | Use |
|---|---|---|---|---|---|---|
| `{typography.hero-display}` | 84px | 400 | 1.05 | -1.5px | PP Editorial Old | Hero ("Frontier AI. In your hands.") |
| `{typography.display-lg}` | 64px | 400 | 1.10 | -1px | PP Editorial Old | Section openers |
| `{typography.heading-1}` | 52px | 400 | 1.15 | -0.5px | PP Editorial Old | Page headlines ("Get in touch with the team.") |
| `{typography.stat-display}` | 56px | 400 | 1.10 | -1px | PP Editorial Old | Stat callouts ("75%") |
| `{typography.heading-2}` | 36px | 500 | 1.20 | -0.5px | Inter | Subsection headlines |
| `{typography.heading-3}` | 28px | 500 | 1.25 | 0 | Inter | Card titles |
| `{typography.heading-4}` | 22px | 500 | 1.30 | 0 | Inter | Feature tile titles |
| `{typography.heading-5}` | 18px | 500 | 1.40 | 0 | Inter | Smaller card titles |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Inter | Hero subtitle, lead body |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Inter | Primary body text |
| `{typography.body-md-medium}` | 16px | 500 | 1.55 | 0 | Inter | Body emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Inter | Secondary body |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Inter | Active sidebar, button labels |
| `{typography.caption}` | 13px | 400 | 1.40 | 0 | Inter | Helper text |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Inter | Badge labels |
| `{typography.micro}` | 12px | 500 | 1.40 | 0 | Inter | Footer microcopy |
| `{typography.micro-uppercase}` | 11px | 600 | 1.40 | 1px | Inter | Section eyebrows |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | Inter | Button labels |
| `{typography.code-md}` | 14px | 400 | 1.50 | 0 | JetBrains Mono | Code blocks |

### Principles
- **Editorial / sans pairing** — PP Editorial Old (near-serif, classical) anchors hero displays; Inter (geometric sans) carries everything else. The contrast IS the brand voice.
- **Generous body leading** (1.55 on body-md) for editorial readability across long-form pages
- **Tight hero leading** (1.05 on 84px display) creates magazine-grade typographic display
- **Negative letter-spacing** progresses with size — display sizes use -1.5px to -0.5px; smaller heads relax to 0
- **Stat-display token** (56px Editorial) for marketing stat callouts ("75% / 80% / 100%")

## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (96px) · `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px); content pages tighten to `{spacing.section}` (64px)
- **Card internal padding**: `{spacing.xl}` (24px) for compact cards; `{spacing.xxl}` (32px) for feature panels and form panels

### Grid & Container
- Marketing pages use 1280px max-width with 32px gutters
- Hero band uses 2-column split (text left, sunset photography right) on desktop
- Le Studio product page uses 3-up feature grid below the hero
- Contact page uses 1-column layout with cream form panel centered (~520px max-width)
- Services page uses 4-tier card layout with cream feature panel separator strip

### Whitespace Philosophy
Marketing surfaces give content generous breathing room — `{spacing.hero}` (120px) hero padding lets the mountain-sunset photography fill the frame. Form pages tighten dramatically: contact form panel uses `{spacing.xxl}` (32px) internal padding, fields stack on `{spacing.md}` (16px) gap.

## Elevation & Depth

The system runs predominantly flat with strategic atmospheric depth from photography.

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline-soft}` border | Default cards, table rows, form inputs |
| 1 (subtle) | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | Hover-elevated tiles |
| 2 (card) | `rgba(0, 0, 0, 0.04) 0px 4px 12px 0px` | Standard feature cards |
| 3 (mockup) | `rgba(0, 0, 0, 0.08) 0px 12px 24px -4px` | IDE mockup, code editor frames |
| 4 (modal) | `rgba(0, 0, 0, 0.12) 0px 16px 48px -8px` | Modals, dropdowns |

### Decorative Depth
- The atmospheric depth on Mistral''s hero comes from the photographic mountain-sunset imagery — natural light gradient does the work
- The "sunset stripe" closing band carries depth via its multi-stop gradient (red → orange → yellow → cream)
- IDE / code mockups use dark-canvas backgrounds with subtle drop shadow

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, micro-controls |
| `{rounded.sm}` | 6px | Discount badges, compact UI |
| `{rounded.md}` | 8px | Buttons, inputs, search-pill, code blocks |
| `{rounded.lg}` | 12px | Cards, modals, panels (the dominant card radius) |
| `{rounded.xl}` | 16px | Larger feature panels |
| `{rounded.xxl}` | 20px | Featured emphasis cards |
| `{rounded.full}` | 9999px | Status badges, pill tabs (used sparingly — most buttons are NOT pills) |

The radius scale is sober and editorial — Mistral does NOT use pill buttons. `{rounded.md}` (8px) for buttons, `{rounded.lg}` (12px) for cards, `{rounded.full}` reserved for badges and the rare pill tab.

### Photography Geometry
- Hero photography is full-bleed atmospheric mountain-sunset imagery with no internal framing
- IDE/code mockups render with `{rounded.lg}` (12px) corners on dark canvas
- Customer logos wall presents wordmarks inline at consistent 60–80px height
- Product imagery (Le Studio mockup, agent UI mockups) sits in `{rounded.lg}` panels with subtle border

## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Saturated-orange primary CTA, the dominant action.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.
- Pressed state `button-primary-pressed` deepens to `{colors.primary-deep}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background and `{colors.muted}` text.

**`button-cream`** — Warm cream-yellow secondary action, common on cream-surface sections.
- Background `{colors.cream}`, text `{colors.ink}`, border `1px solid {colors.beige-deep}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-dark`** — Dark/black primary CTA on cream surfaces.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-secondary`** — Outlined secondary action.
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-on-cream`** — White button on cream-tinted backgrounds.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.beige-deep}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-link`** — Inline orange text link.
- Background transparent, text `{colors.primary}`, typography `{typography.body-sm-medium}`, padding `0`. Underline on activation.

### Cards & Containers

**`card-base`** — Standard content card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`card-feature`** — White feature card with larger padding.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid `{colors.hairline-soft}`.

**`card-cream`** — Warm cream-yellow feature card (services tiers, perk callouts).
- Background `{colors.cream}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.beige-deep}`.

**`card-cream-soft`** — Lighter cream variant.
- Background `{colors.surface-cream-soft}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-feature-product`** — Product showcase card with subtle elevation.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`, shadow `rgba(0, 0, 0, 0.04) 0px 4px 12px`.

**`card-photographic`** — Photographic product card with dark background.
- Background `{colors.surface-code}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `0` (image fills the card).

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`.

**`pricing-card-featured`** — Featured pricing tier (cream background + orange border).
- Background `{colors.cream}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `2px solid {colors.primary}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.primary}`.

**`text-area`** — Multi-line text area for contact form.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`contact-form-panel`** — Cream-tinted form container on the contact page.
- Background `{colors.cream}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.beige-deep}`. Hosts text-inputs, text-area, submit `button-dark`.

### Tabs

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav (used sparingly on product pages).
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.ink}`, text `{colors.on-dark}`.

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation.
- Inactive: text `{colors.steel}`, transparent background, padding `{spacing.sm} {spacing.md}`, no bottom border.
- Active: text `{colors.primary}`, 2px bottom border in `{colors.primary}`.

### Badges & Status

**`badge-orange`** — Saturated orange badge.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-cream`** — Cream-tinted tag chip.
- Background `{colors.cream-deeper}`, text `{colors.ink}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-dark`** — Dark/black status badge.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`promo-banner`** — Sticky black promo strip ABOVE the top nav.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`. Carries one-line copy + inline CTA.

### Code

**`code-block`** — Syntax-highlighted IDE-style code block (Le Studio page mockup, agent demos).
- Background `{colors.surface-code}`, text `{colors.on-dark}`, typography `{typography.code-md}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`code-block-header`** — Header bar above the code block.
- Background `{colors.surface-code}`, text `{colors.on-dark-muted}`, typography `{typography.caption}`, padding `{spacing.xs} {spacing.md}`, bottom border `1px solid rgba(255,255,255,0.08)`.

### Documentation Components

**`feature-icon-tile`** — Cream-yellow feature icon callout.
- Background `{colors.cream}`, rounded `{rounded.md}`, padding `{spacing.md}`, border `1px solid {colors.beige-deep}`.

**`industry-tile`** — Industry-vertical tile in solutions page grid.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`stat-cell`** — Stat-row cell ("75% more / 80% better").
- Background transparent, text `{colors.ink}`, typography `{typography.stat-display}`, padding `{spacing.lg}`.

**`customer-testimonial-card`** — Customer quote card (used inside Le Studio and Solutions pages).
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`. Quote in `{typography.body-md}`, attribution in `{typography.body-sm}` `{colors.steel}`.

**`logo-wall-item`** — Customer logo wordmark cell.
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.

**`faq-accordion-item`** — FAQ panel.
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, bottom border `1px solid {colors.hairline}`.

**`app-store-badge`** — App Store / Google Play download badge.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline-soft}`.
- Left: Mistral M-mark logo + "MISTRAL AI_" wordmark + horizontal link list (Products, Solutions, Research, Blog, Customers, Company).
- Right: "Contact Sales" link + black-pill "Try Studio" CTA.

### Signature Components

**`hero-band-sunset`** — Atmospheric sunset hero band.
- Background gradient `linear-gradient(135deg, {colors.sunshine-700} 0%, {colors.sunshine-900} 60%, {colors.primary} 100%)` overlaid on photographic mountain landscape.
- Layout: hero headline left in `{typography.hero-display}` ({colors.ink}), subtitle in `{typography.subtitle}` ({colors.ink-tint}), button row (`button-dark` + `button-secondary`), atmospheric mountain photography right.

**`sunset-stripe-band`** — Horizontal closing band at the foot of every page.
- Multi-stop gradient: `{colors.primary}` → `{colors.sunshine-700}` → `{colors.sunshine-500}` → `{colors.yellow-saturated}` → `{colors.cream}`.
- Padding `{spacing.lg} 0`. Spans full width, sits above the footer. THIS IS THE BRAND''S MOST RECOGNIZABLE SIGNATURE ELEMENT.

**`cta-banner-cream`** — Page-bottom CTA band on cream surface.
- Background `{colors.cream}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.section}`. "The next chapter of AI is yours." headline in `{typography.heading-1}` (PP Editorial Old), button row below.

**`footer-region`** — Cream-tinted multi-column footer.
- Background `{colors.footer-cream}`, padding `{spacing.section} {spacing.xxl}`.
- 5-column link grid (Why Mistral / Explore / Build / Legal + brand mark column).
- Bottom: language picker + social icons.

**`footer-link`** — Individual footer link.
- Background transparent, text `{colors.primary}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (saturated orange) for primary CTAs and active states only
- Use the **sunset stripe band** at the foot of every page — it''s the brand''s most recognizable signature
- Pair PP Editorial Old (display) with Inter (UI) — never substitute either with a generic alternative
- Apply `{rounded.md}` (8px) to buttons and `{rounded.lg}` (12px) to cards consistently
- Use cream-yellow surfaces ({colors.cream}) for form panels, feature cards, and footer
- Anchor heroes with photographic mountain-sunset imagery (or its visual equivalent — atmospheric gradient sky)
- Use stat-display token (PP Editorial 56px) for stat callouts to maintain editorial character

### Don''t
- Don''t use pill-shaped buttons (`{rounded.full}`) — Mistral''s geometry is sober and editorial, not playful
- Don''t introduce additional accent colors beyond the orange/yellow/cream sunset palette
- Don''t reduce hero leading below 1.05 — the editorial display needs that magazine-grade tightness
- Don''t replace PP Editorial Old hero displays with Inter — the editorial / sans contrast IS the brand
- Don''t apply heavy shadows on flat documentation cards; reserve elevation for IDE mockups
- Don''t drop the sunset stripe band from any page bottom — it''s the brand''s continuity element

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero scales to 40px (PP Editorial). Pill nav collapses to hamburger. Pricing tiers stack 1-up. |
| Mobile (large) | 480 – 767px | Feature tiles 2-up. Hero scales to 52px. |
| Tablet | 768 – 1023px | 2-column feature grids. Pill-tab nav returns. Hero 64px. |
| Desktop | 1024 – 1279px | Multi-column layouts. Hero 76px. Stat row at full width. |
| Wide Desktop | ≥ 1280px | Full 84px hero presentation. |

### Touch Targets
- Buttons render at 40–44px effective height — at WCAG AAA floor with `10px 20px` padding
- Form inputs render at 44px height
- Pill tabs render at ~32px tall — bumps to 44px on mobile

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger
- **Hero band**: 2-column hero (text + photography) collapses to stacked at < 1024px
- **Pricing tiers**: 4-column desktop → 2-column tablet → 1-column mobile
- **Stat row**: 3-column → stacked at < 768px
- **Hero typography**: 84px → 64px → 52px → 40px
- **Footer**: 5-column desktop → 3-column tablet → 1-column accordion mobile
- **Sunset stripe band** stays full-width on all breakpoints

### Image Behavior
- Mountain-sunset photography uses 16:9 ratio with full-bleed scaling
- IDE mockup images maintain aspect ratio across breakpoints
- Customer logo wall presents wordmarks at consistent 60–80px height

## Iteration Guide

1. Focus on ONE component at a time
2. Reference component names and tokens directly (`{colors.primary}`, `{component-name}-pressed`)
3. Run `npx @google/design.md lint DESIGN.md` after edits
4. Add new variants as separate `components:` entries
5. Default to `{typography.body-md}` for body and `{typography.subtitle}` for emphasis. Hero displays use `{typography.hero-display}` (PP Editorial Old).
6. Keep `{colors.primary}` confined to primary CTAs, active states, and the sunset stripe band
7. Cards use `{rounded.lg}` (12px), buttons use `{rounded.md}` (8px). Pills (`{rounded.full}`) reserved for badges only.
8. Always include the sunset-stripe-band component at the foot of every page mockup.

## Known Gaps

- Specific dark-mode token values not surfaced; the brand has not shipped a published dark-mode palette
- Animation/transition timings not extracted; recommend 150–200ms ease for hover/focus state transitions
- Form validation success state not explicitly captured beyond defaults
- Sunset stripe band gradient stops are approximations — the actual values may vary slightly across pages but the visual rhythm is consistent
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

Mistral AI carries itself with a singular, almost cinematographic visual signature — the homepage opens with "Frontier AI. In your hands." rendered in elegant near-serif display type over a photographic mountain landscape bathed in mustard-orange sunset light. Below the hero, every page closes with the same recognizable element: a horizontal "sunset stripe" gradient band running red→orange→yellow→cream that wraps the foot of the page just above the footer. This stripe is THE brand recognizer — it appears on the homepage, products/studio, solutions/coding, news articles, contact form, and services tier page without exception.

The system pairs PP Editorial Old (a near-serif elegant display face) for hero displays with Inter for everything else (body, headings, UI). Cream-yellow surfaces ({colors.cream}, {colors.surface-cream-soft}) anchor form panels and feature cards; saturated orange ({colors.primary}) carries primary CTAs; the deep mountain photography on the homepage and the dark code mockups inside Le Studio create photographic depth. Cards are rectangular with `{rounded.lg}` (12px) corners — distinctly less playful than Miro''s or Mintlify''s pill-buttons-everywhere approach. Buttons are also `{rounded.md}` (8px), not pills — Mistral''s geometry is more sober and editorial than its peers.

**Key Characteristics:**
- Atmospheric mountain-sunset hero photography (orange-red-yellow gradient sky)
- Horizontal "sunset stripe" band ({colors.primary} → {colors.sunshine-700} → {colors.yellow-saturated} → {colors.cream}) at every page bottom
- Cream-yellow surfaces ({colors.cream}, {colors.cream-soft}) for form panels and feature cards
- PP Editorial Old (or similar near-serif) for hero displays; Inter for everything else
- `{rounded.md}` (8px) buttons and `{rounded.lg}` (12px) cards — less playful, more editorial geometry
- Saturated orange primary CTA ({colors.primary}) carries every action call', '{"sourcePath":"docs/design-md/mistral.ai/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: mistral.ai/ (homepage), /products/studio (Le Studio product), /solutions/coding (coding solution), /news/vibe-remote-agents-mistral-medium-3-5 (news), /contact (contact form), /services (services tiers). Token coverage was identical across all six pages.

### Brand & Accent
- **Mistral Orange** ({colors.primary}): Primary CTA color, brand orange
- **Orange Deep** ({colors.primary-deep}): Pressed-state and emphasis variant
- **Sunshine 300** ({colors.sunshine-300}): Atmospheric light orange-yellow
- **Sunshine 500** ({colors.sunshine-500}): Mid-spectrum sunset orange
- **Sunshine 700** ({colors.sunshine-700}): Saturated mid sunset gradient stop
- **Sunshine 800** ({colors.sunshine-800}): Deep sunset gradient stop
- **Sunshine 900** ({colors.sunshine-900}): Deepest sunset orange
- **Yellow Saturated** ({colors.yellow-saturated}): Pure brand yellow used in the sunset stripe gradient
- **Block 5/6/7** ({colors.block-5}, {colors.block-6}, {colors.block-7}): Spectrum stops along the sunset gradient (light-yellow → mid-yellow → deep-orange)

### Cream / Neutral Warm
- **Cream** ({colors.cream}): Warm yellow-cream surface for form panels, feature cards, footer
- **Cream Soft** ({colors.cream-soft}): Lighter cream variant
- **Cream Deeper** ({colors.cream-deeper}): More-saturated cream for badge/tag chips
- **Beige Deep** ({colors.beige-deep}): Cream surface 1px border color

### Surface
- **Canvas White** ({colors.canvas}): Page background and card surface
- **Surface** ({colors.surface}): Subtle quieter background
- **Surface Cream** ({colors.surface-cream}): Cream-yellow tinted surface
- **Surface Code** ({colors.surface-code}): Dark code-block / IDE mockup surface
- **Hairline** ({colors.hairline}): 1px borders
- **Hairline Soft** ({colors.hairline-soft}): Quieter dividers
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px border for inputs

### Text
- **Ink** ({colors.ink}): Primary headlines and body text
- **Ink Tint** ({colors.ink-tint}): Slightly softer black for hero overlay text
- **Charcoal** ({colors.charcoal}): Body emphasis
- **Slate** ({colors.slate}): Secondary text
- **Steel** ({colors.steel}): Tertiary text, captions
- **Stone** ({colors.stone}): Muted labels
- **Muted** ({colors.muted}): Disabled, placeholders
- **On Dark** ({colors.on-dark}): White text on dark surfaces
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white
- **On Cream** ({colors.on-cream}): Ink text on cream surfaces

### Semantic
- **Link** ({colors.link}): Inline link color (matches primary orange)', '{"sourcePath":"docs/design-md/mistral.ai/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**PP Editorial Old** (display): Mistral''s signature near-serif elegant display typeface used for hero displays, large numbers, and editorial section openers. Carries a slightly classical, intelligent character that contrasts the contemporary product positioning. Fallbacks: ''Times New Roman'', Georgia, serif.

**Inter** (UI prose): Variable typeface for body, navigation, buttons, labels, captions. Fallbacks: ui-sans-serif, system-ui, -apple-system, sans-serif.

**JetBrains Mono** (code): Monospace for code blocks and IDE mockups. Fallbacks: ''SF Mono'', Menlo, Consolas, monospace.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Family | Use |
|---|---|---|---|---|---|---|
| `{typography.hero-display}` | 84px | 400 | 1.05 | -1.5px | PP Editorial Old | Hero ("Frontier AI. In your hands.") |
| `{typography.display-lg}` | 64px | 400 | 1.10 | -1px | PP Editorial Old | Section openers |
| `{typography.heading-1}` | 52px | 400 | 1.15 | -0.5px | PP Editorial Old | Page headlines ("Get in touch with the team.") |
| `{typography.stat-display}` | 56px | 400 | 1.10 | -1px | PP Editorial Old | Stat callouts ("75%") |
| `{typography.heading-2}` | 36px | 500 | 1.20 | -0.5px | Inter | Subsection headlines |
| `{typography.heading-3}` | 28px | 500 | 1.25 | 0 | Inter | Card titles |
| `{typography.heading-4}` | 22px | 500 | 1.30 | 0 | Inter | Feature tile titles |
| `{typography.heading-5}` | 18px | 500 | 1.40 | 0 | Inter | Smaller card titles |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Inter | Hero subtitle, lead body |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Inter | Primary body text |
| `{typography.body-md-medium}` | 16px | 500 | 1.55 | 0 | Inter | Body emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Inter | Secondary body |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Inter | Active sidebar, button labels |
| `{typography.caption}` | 13px | 400 | 1.40 | 0 | Inter | Helper text |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Inter | Badge labels |
| `{typography.micro}` | 12px | 500 | 1.40 | 0 | Inter | Footer microcopy |
| `{typography.micro-uppercase}` | 11px | 600 | 1.40 | 1px | Inter | Section eyebrows |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | Inter | Button labels |
| `{typography.code-md}` | 14px | 400 | 1.50 | 0 | JetBrains Mono | Code blocks |

### Principles
- **Editorial / sans pairing** — PP Editorial Old (near-serif, classical) anchors hero displays; Inter (geometric sans) carries everything else. The contrast IS the brand voice.
- **Generous body leading** (1.55 on body-md) for editorial readability across long-form pages
- **Tight hero leading** (1.05 on 84px display) creates magazine-grade typographic display
- **Negative letter-spacing** progresses with size — display sizes use -1.5px to -0.5px; smaller heads relax to 0
- **Stat-display token** (56px Editorial) for marketing stat callouts ("75% / 80% / 100%")', '{"sourcePath":"docs/design-md/mistral.ai/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (96px) · `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px); content pages tighten to `{spacing.section}` (64px)
- **Card internal padding**: `{spacing.xl}` (24px) for compact cards; `{spacing.xxl}` (32px) for feature panels and form panels

### Grid & Container
- Marketing pages use 1280px max-width with 32px gutters
- Hero band uses 2-column split (text left, sunset photography right) on desktop
- Le Studio product page uses 3-up feature grid below the hero
- Contact page uses 1-column layout with cream form panel centered (~520px max-width)
- Services page uses 4-tier card layout with cream feature panel separator strip

### Whitespace Philosophy
Marketing surfaces give content generous breathing room — `{spacing.hero}` (120px) hero padding lets the mountain-sunset photography fill the frame. Form pages tighten dramatically: contact form panel uses `{spacing.xxl}` (32px) internal padding, fields stack on `{spacing.md}` (16px) gap.', '{"sourcePath":"docs/design-md/mistral.ai/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

The system runs predominantly flat with strategic atmospheric depth from photography.

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline-soft}` border | Default cards, table rows, form inputs |
| 1 (subtle) | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | Hover-elevated tiles |
| 2 (card) | `rgba(0, 0, 0, 0.04) 0px 4px 12px 0px` | Standard feature cards |
| 3 (mockup) | `rgba(0, 0, 0, 0.08) 0px 12px 24px -4px` | IDE mockup, code editor frames |
| 4 (modal) | `rgba(0, 0, 0, 0.12) 0px 16px 48px -8px` | Modals, dropdowns |

### Decorative Depth
- The atmospheric depth on Mistral''s hero comes from the photographic mountain-sunset imagery — natural light gradient does the work
- The "sunset stripe" closing band carries depth via its multi-stop gradient (red → orange → yellow → cream)
- IDE / code mockups use dark-canvas backgrounds with subtle drop shadow', '{"sourcePath":"docs/design-md/mistral.ai/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, micro-controls |
| `{rounded.sm}` | 6px | Discount badges, compact UI |
| `{rounded.md}` | 8px | Buttons, inputs, search-pill, code blocks |
| `{rounded.lg}` | 12px | Cards, modals, panels (the dominant card radius) |
| `{rounded.xl}` | 16px | Larger feature panels |
| `{rounded.xxl}` | 20px | Featured emphasis cards |
| `{rounded.full}` | 9999px | Status badges, pill tabs (used sparingly — most buttons are NOT pills) |

The radius scale is sober and editorial — Mistral does NOT use pill buttons. `{rounded.md}` (8px) for buttons, `{rounded.lg}` (12px) for cards, `{rounded.full}` reserved for badges and the rare pill tab.

### Photography Geometry
- Hero photography is full-bleed atmospheric mountain-sunset imagery with no internal framing
- IDE/code mockups render with `{rounded.lg}` (12px) corners on dark canvas
- Customer logos wall presents wordmarks inline at consistent 60–80px height
- Product imagery (Le Studio mockup, agent UI mockups) sits in `{rounded.lg}` panels with subtle border', '{"sourcePath":"docs/design-md/mistral.ai/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Saturated-orange primary CTA, the dominant action.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.
- Pressed state `button-primary-pressed` deepens to `{colors.primary-deep}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background and `{colors.muted}` text.

**`button-cream`** — Warm cream-yellow secondary action, common on cream-surface sections.
- Background `{colors.cream}`, text `{colors.ink}`, border `1px solid {colors.beige-deep}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-dark`** — Dark/black primary CTA on cream surfaces.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-secondary`** — Outlined secondary action.
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-on-cream`** — White button on cream-tinted backgrounds.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.beige-deep}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.md}`.

**`button-link`** — Inline orange text link.
- Background transparent, text `{colors.primary}`, typography `{typography.body-sm-medium}`, padding `0`. Underline on activation.

### Cards & Containers

**`card-base`** — Standard content card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`card-feature`** — White feature card with larger padding.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid `{colors.hairline-soft}`.

**`card-cream`** — Warm cream-yellow feature card (services tiers, perk callouts).
- Background `{colors.cream}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.beige-deep}`.

**`card-cream-soft`** — Lighter cream variant.
- Background `{colors.surface-cream-soft}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-feature-product`** — Product showcase card with subtle elevation.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`, shadow `rgba(0, 0, 0, 0.04) 0px 4px 12px`.

**`card-photographic`** — Photographic product card with dark background.
- Background `{colors.surface-code}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `0` (image fills the card).

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`.

**`pricing-card-featured`** — Featured pricing tier (cream background + orange border).
- Background `{colors.cream}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `2px solid {colors.primary}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.primary}`.

**`text-area`** — Multi-line text area for contact form.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`contact-form-panel`** — Cream-tinted form container on the contact page.
- Background `{colors.cream}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.beige-deep}`. Hosts text-inputs, text-area, submit `button-dark`.

### Tabs

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav (used sparingly on product pages).
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.ink}`, text `{colors.on-dark}`.

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation.
- Inactive: text `{colors.steel}`, transparent background, padding `{spacing.sm} {spacing.md}`, no bottom border.
- Active: text `{colors.primary}`, 2px bottom border in `{colors.primary}`.

### Badges & Status

**`badge-orange`** — Saturated orange badge.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-cream`** — Cream-tinted tag chip.
- Background `{colors.cream-deeper}`, text `{colors.ink}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-dark`** — Dark/black status badge.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`promo-banner`** — Sticky black promo strip ABOVE the top nav.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`. Carries one-line copy + inline CTA.

### Code

**`code-block`** — Syntax-highlighted IDE-style code block (Le Studio page mockup, agent demos).
- Background `{colors.surface-code}`, text `{colors.on-dark}`, typography `{typography.code-md}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`code-block-header`** — Header bar above the code block.
- Background `{colors.surface-code}`, text `{colors.on-dark-muted}`, typography `{typography.caption}`, padding `{spacing.xs} {spacing.md}`, bottom border `1px solid rgba(255,255,255,0.08)`.

### Documentation Components

**`feature-icon-tile`** — Cream-yellow feature icon callout.
- Background `{colors.cream}`, rounded `{rounded.md}`, padding `{spacing.md}`, border `1px solid {colors.beige-deep}`.

**`industry-tile`** — Industry-vertical tile in solutions page grid.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`stat-cell`** — Stat-row cell ("75% more / 80% better").
- Background transparent, text `{colors.ink}`, typography `{typography.stat-display}`, padding `{spacing.lg}`.

**`customer-testimonial-card`** — Customer quote card (used inside Le Studio and Solutions pages).
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`. Quote in `{typography.body-md}`, attribution in `{typography.body-sm}` `{colors.steel}`.

**`logo-wall-item`** — Customer logo wordmark cell.
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.

**`faq-accordion-item`** — FAQ panel.
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, bottom border `1px solid {colors.hairline}`.

**`app-store-badge`** — App Store / Google Play download badge.
- Background `{colors.ink}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline-soft}`.
- Left: Mistral M-mark logo + "MISTRAL AI_" wordmark + horizontal link list (Products, Solutions, Research, Blog, Customers, Company).
- Right: "Contact Sales" link + black-pill "Try Studio" CTA.

### Signature Components

**`hero-band-sunset`** — Atmospheric sunset hero band.
- Background gradient `linear-gradient(135deg, {colors.sunshine-700} 0%, {colors.sunshine-900} 60%, {colors.primary} 100%)` overlaid on photographic mountain landscape.
- Layout: hero headline left in `{typography.hero-display}` ({colors.ink}), subtitle in `{typography.subtitle}` ({colors.ink-tint}), button row (`button-dark` + `button-secondary`), atmospheric mountain photography right.

**`sunset-stripe-band`** — Horizontal closing band at the foot of every page.
- Multi-stop gradient: `{colors.primary}` → `{colors.sunshine-700}` → `{colors.sunshine-500}` → `{colors.yellow-saturated}` → `{colors.cream}`.
- Padding `{spacing.lg} 0`. Spans full width, sits above the footer. THIS IS THE BRAND''S MOST RECOGNIZABLE SIGNATURE ELEMENT.

**`cta-banner-cream`** — Page-bottom CTA band on cream surface.
- Background `{colors.cream}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.section}`. "The next chapter of AI is yours." headline in `{typography.heading-1}` (PP Editorial Old), button row below.

**`footer-region`** — Cream-tinted multi-column footer.
- Background `{colors.footer-cream}`, padding `{spacing.section} {spacing.xxl}`.
- 5-column link grid (Why Mistral / Explore / Build / Legal + brand mark column).
- Bottom: language picker + social icons.

**`footer-link`** — Individual footer link.
- Background transparent, text `{colors.primary}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.', '{"sourcePath":"docs/design-md/mistral.ai/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (saturated orange) for primary CTAs and active states only
- Use the **sunset stripe band** at the foot of every page — it''s the brand''s most recognizable signature
- Pair PP Editorial Old (display) with Inter (UI) — never substitute either with a generic alternative
- Apply `{rounded.md}` (8px) to buttons and `{rounded.lg}` (12px) to cards consistently
- Use cream-yellow surfaces ({colors.cream}) for form panels, feature cards, and footer
- Anchor heroes with photographic mountain-sunset imagery (or its visual equivalent — atmospheric gradient sky)
- Use stat-display token (PP Editorial 56px) for stat callouts to maintain editorial character

### Don''t
- Don''t use pill-shaped buttons (`{rounded.full}`) — Mistral''s geometry is sober and editorial, not playful
- Don''t introduce additional accent colors beyond the orange/yellow/cream sunset palette
- Don''t reduce hero leading below 1.05 — the editorial display needs that magazine-grade tightness
- Don''t replace PP Editorial Old hero displays with Inter — the editorial / sans contrast IS the brand
- Don''t apply heavy shadows on flat documentation cards; reserve elevation for IDE mockups
- Don''t drop the sunset stripe band from any page bottom — it''s the brand''s continuity element', '{"sourcePath":"docs/design-md/mistral.ai/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero scales to 40px (PP Editorial). Pill nav collapses to hamburger. Pricing tiers stack 1-up. |
| Mobile (large) | 480 – 767px | Feature tiles 2-up. Hero scales to 52px. |
| Tablet | 768 – 1023px | 2-column feature grids. Pill-tab nav returns. Hero 64px. |
| Desktop | 1024 – 1279px | Multi-column layouts. Hero 76px. Stat row at full width. |
| Wide Desktop | ≥ 1280px | Full 84px hero presentation. |

### Touch Targets
- Buttons render at 40–44px effective height — at WCAG AAA floor with `10px 20px` padding
- Form inputs render at 44px height
- Pill tabs render at ~32px tall — bumps to 44px on mobile

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger
- **Hero band**: 2-column hero (text + photography) collapses to stacked at < 1024px
- **Pricing tiers**: 4-column desktop → 2-column tablet → 1-column mobile
- **Stat row**: 3-column → stacked at < 768px
- **Hero typography**: 84px → 64px → 52px → 40px
- **Footer**: 5-column desktop → 3-column tablet → 1-column accordion mobile
- **Sunset stripe band** stays full-width on all breakpoints

### Image Behavior
- Mountain-sunset photography uses 16:9 ratio with full-bleed scaling
- IDE mockup images maintain aspect ratio across breakpoints
- Customer logo wall presents wordmarks at consistent 60–80px height', '{"sourcePath":"docs/design-md/mistral.ai/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time
2. Reference component names and tokens directly (`{colors.primary}`, `{component-name}-pressed`)
3. Run `npx @google/design.md lint DESIGN.md` after edits
4. Add new variants as separate `components:` entries
5. Default to `{typography.body-md}` for body and `{typography.subtitle}` for emphasis. Hero displays use `{typography.hero-display}` (PP Editorial Old).
6. Keep `{colors.primary}` confined to primary CTAs, active states, and the sunset stripe band
7. Cards use `{rounded.lg}` (12px), buttons use `{rounded.md}` (8px). Pills (`{rounded.full}`) reserved for badges only.
8. Always include the sunset-stripe-band component at the foot of every page mockup.', '{"sourcePath":"docs/design-md/mistral.ai/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Specific dark-mode token values not surfaced; the brand has not shipped a published dark-mode palette
- Animation/transition timings not extracted; recommend 150–200ms ease for hover/focus state transitions
- Form validation success state not explicitly captured beyond defaults
- Sunset stripe band gradient stops are approximations — the actual values may vary slightly across pages but the visual rhythm is consistent', '{"sourcePath":"docs/design-md/mistral.ai/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_1', '#fa520f', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_2', '#cc3a05', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_3', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_4', '#ffd06a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_5', '#ffb83e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_6', '#ffa110', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_7', '#ff8105', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_8', '#ff8a00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_9', '#ffd900', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_10', '#fff8e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_11', '#fffaeb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_12', '#fff0c2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_13', '#e6d5a8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_14', '#ffe295', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_15', '#1f1f1f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_16', '#3d3d3d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_17', '#2c2c2c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_18', '#4a4a4a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_19', '#6a6a6a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_20', '#8a8a8a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_21', '#a8a8a8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_22', '#e5e5e5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_23', '#ededed', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_24', '#c7c7c7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_25', '#fafafa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md'), 'color', 'color_26', '#1c1c1e', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/mistral.ai/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/mistral.ai/DESIGN.md';


-- Mongodb
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Mongodb', 'mongodb', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/mongodb/DESIGN.md', null, 'seeded', '---
version: alpha
name: MongoDB-design-analysis
description: MongoDB carries a strong dual-mode visual identity — dark deep-teal hero bands with bright MongoDB green ({colors.brand-green}) CTAs paired with stark white documentation surfaces. The signature green pill button is unmistakable across product, pricing, learning, and AI use-case surfaces. The system uses Euclid Circular A as its display face, anchors a 3-tier pricing comparison (Free / Flex / Dedicated), and presents extensive course catalogs in card grids with colored category tags. Coverage spans homepage, Atlas product page, Community Edition, MongoDB University, AI use cases, and pricing.

colors:
  primary: "#00ed64"
  primary-deep: "#00b545"
  primary-pressed: "#008c34"
  on-primary: "#001e2b"
  brand-green: "#00ed64"
  brand-green-dark: "#00684a"
  brand-green-mid: "#00a35c"
  brand-green-soft: "#c3f0d2"
  brand-teal-deep: "#001e2b"
  brand-teal: "#003d4f"
  brand-teal-mid: "#00684a"
  accent-purple: "#7b3ff2"
  accent-orange: "#fa6e39"
  accent-pink: "#f06bb8"
  accent-blue: "#3d4f9f"
  semantic-warning-bg: "#fff8e0"
  semantic-warning-text: "#946f3f"
  canvas: "#ffffff"
  canvas-dark: "#001e2b"
  surface: "#f9fbfa"
  surface-soft: "#f4f7f6"
  surface-feature: "#e3fcef"
  hairline: "#e1e5e8"
  hairline-soft: "#eceff1"
  hairline-strong: "#c1ccd6"
  hairline-dark: "#1c2d38"
  ink: "#001e2b"
  charcoal: "#1c2d38"
  slate: "#3d4f5b"
  steel: "#5c6c7a"
  stone: "#7c8c9a"
  muted: "#a8b3bc"
  on-dark: "#ffffff"
  on-dark-muted: "#a8b3bc"

typography:
  hero-display:
    fontFamily: Euclid Circular A
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.10
    letterSpacing: -1.5px
  display-lg:
    fontFamily: Euclid Circular A
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -1px
  heading-1:
    fontFamily: Euclid Circular A
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: -0.5px
  heading-2:
    fontFamily: Euclid Circular A
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.5px
  heading-3:
    fontFamily: Euclid Circular A
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.30
  heading-4:
    fontFamily: Euclid Circular A
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.35
  heading-5:
    fontFamily: Euclid Circular A
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.40
  subtitle:
    fontFamily: Euclid Circular A
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
  body-md:
    fontFamily: Euclid Circular A
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-md-medium:
    fontFamily: Euclid Circular A
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.55
  body-sm:
    fontFamily: Euclid Circular A
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  body-sm-medium:
    fontFamily: Euclid Circular A
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.50
  caption:
    fontFamily: Euclid Circular A
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  caption-bold:
    fontFamily: Euclid Circular A
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.40
  micro:
    fontFamily: Euclid Circular A
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.40
  micro-uppercase:
    fontFamily: Euclid Circular A
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: 1px
  button-md:
    fontFamily: Euclid Circular A
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.30
  code-md:
    fontFamily: Source Code Pro
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section-sm: 48px
  section: 64px
  section-lg: 96px
  hero: 120px

components:
  button-primary:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 22px"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.muted}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 22px"
    border: "1px solid {colors.hairline-strong}"
  button-on-dark:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 22px"
  button-secondary-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 22px"
    border: "1px solid {colors.hairline-dark}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.brand-green-dark}"
    typography: "{typography.body-sm-medium}"
    padding: "0"
  card-base:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-feature:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  card-product-deploy:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  card-feature-dark:
    backgroundColor: "{colors.brand-teal-deep}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-course:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-cert:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  pricing-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  pricing-card-featured:
    backgroundColor: "{colors.surface-feature}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "2px solid {colors.brand-green}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline-strong}"
    height: 44px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.brand-green-dark}"
  search-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    height: 44px
    border: "1px solid {colors.hairline-strong}"
  search-pill-large:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.steel}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    height: 56px
    border: "1px solid {colors.hairline-strong}"
  pill-tab:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.md}"
    border: "1px solid {colors.hairline}"
  pill-tab-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    border: "1px solid {colors.ink}"
  segmented-tab:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
    border: "0 0 2px transparent solid"
  segmented-tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.brand-green-dark}"
    typography: "{typography.body-sm-medium}"
    border: "0 0 2px {colors.brand-green-dark} solid"
  badge-green:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-green-soft:
    backgroundColor: "{colors.brand-green-soft}"
    textColor: "{colors.brand-green-dark}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-purple:
    backgroundColor: "{colors.accent-purple}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-orange:
    backgroundColor: "{colors.accent-orange}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-popular:
    backgroundColor: "{colors.brand-teal-deep}"
    textColor: "{colors.brand-green}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  promo-banner:
    backgroundColor: "{colors.brand-teal-deep}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
  hero-band-dark:
    backgroundColor: "{colors.brand-teal-deep}"
    textColor: "{colors.on-dark}"
    rounded: "0"
    padding: "{spacing.hero}"
  hero-platform-card:
    backgroundColor: "{colors.brand-teal-mid}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
  cta-banner-dark:
    backgroundColor: "{colors.brand-teal-deep}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.section}"
  code-block:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  code-mockup-card:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  comparison-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
  comparison-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "{spacing.md} {spacing.lg}"
    border: "0 0 1px {colors.hairline-soft} solid"
  service-tile:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  why-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  customer-testimonial-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  logo-wall-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-md-medium}"
    padding: "{spacing.lg}"
  faq-accordion-item:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    border: "0 0 1px {colors.hairline} solid"
  footer-region:
    backgroundColor: "{colors.brand-teal-deep}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    padding: "{spacing.section} {spacing.xxl}"
  footer-link:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-muted}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
---

## Overview

MongoDB carries a strong dual-mode visual identity — dark deep-teal hero bands with the unmistakable bright MongoDB green ({colors.brand-green}) CTA pill paired with stark white documentation and pricing surfaces. The homepage opens with "One data platform. Unlimited AI potential." headline over a deep navy hero, the green pill sitting at the visual center as the primary CTA. Lower on the page, embedded code mockup cards (terminal-aesthetic) sit on the dark hero band, breaking out into white feature cards below. The pricing page renders a 3-tier comparison (Free / Flex / Dedicated) with a featured tier highlighted in soft mint background and bright green border. The MongoDB University page presents a course catalog grid where each tile carries a colored category tag (orange, purple, green, teal) — these are MongoDB''s category-encoding accent colors and are the only place outside the brand green where saturated color appears.

The system uses Euclid Circular A as its display face. The face is contemporary geometric — confident but not overly playful — and pairs naturally with both the developer-tool aesthetic of the database product and the educational positioning of the learning surfaces. Cards use `{rounded.lg}` (12px) corners; buttons use `{rounded.full}` pills universally. The brand-teal palette ({colors.brand-teal-deep}) anchors hero bands, footer, code mockups, and the dark CTA banners.

**Key Characteristics:**
- Deep navy/teal hero bands ({colors.brand-teal-deep}) with bright MongoDB green ({colors.brand-green}) CTA pills
- Stark white pricing/documentation surfaces with colored category tags for course tiles (purple, orange, green, teal)
- Euclid Circular A across every UI surface
- Pill-shaped buttons ({rounded.full}) and 12px-rounded cards
- 3-tier pricing comparison (Free / Flex / Dedicated) with featured-mint highlight tier
- Code mockup cards with terminal-aesthetic dark canvas

## Colors

> Source pages: mongodb.com/ (homepage), /products/platform/atlas-database (Atlas product), /products/self-managed/community-edition, learn.mongodb.com/ (MongoDB University), /solutions/use-cases/artificial-intelligence (AI), /pricing (3-tier comparison). Token coverage was identical across all six pages.

### Brand & Accent
- **MongoDB Green** ({colors.brand-green}): The brand''s most recognizable signal — bright pill-CTA color
- **Green Dark** ({colors.brand-green-dark}): Inline link color, secondary green
- **Green Mid** ({colors.brand-green-mid}): Mid-spectrum green for atmospheric tints
- **Green Soft** ({colors.brand-green-soft}): Pale-mint background tint for success badges and featured pricing tier
- **Brand Teal Deep** ({colors.brand-teal-deep}): Deep navy-teal for hero bands, footer
- **Brand Teal** ({colors.brand-teal}): Mid-spectrum teal
- **Brand Teal Mid** ({colors.brand-teal-mid}): Lighter teal for hero platform cards

### Category Accent (Course Tags)
- **Accent Purple** ({colors.accent-purple}): Course tag for "Database & Security"
- **Accent Orange** ({colors.accent-orange}): Course tag for "Search"
- **Accent Pink** ({colors.accent-pink}): Course tag variant
- **Accent Blue** ({colors.accent-blue}): Course tag variant for atlas/cloud topics

### Surface
- **Canvas White** ({colors.canvas}): Page background and primary card surface
- **Canvas Dark** ({colors.canvas-dark}): Code-block backgrounds, dark mockup canvas
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions
- **Surface Feature** ({colors.surface-feature}): Pale mint background for featured pricing tier
- **Hairline** ({colors.hairline}): 1px borders and primary dividers
- **Hairline Soft** ({colors.hairline-soft}): Quieter dividers
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px border for inputs
- **Hairline Dark** ({colors.hairline-dark}): Border on dark surfaces

### Text
- **Ink** ({colors.ink}): Primary headlines and body text (deep navy-teal)
- **Charcoal** ({colors.charcoal}): Body emphasis
- **Slate** ({colors.slate}): Secondary text
- **Steel** ({colors.steel}): Tertiary text, captions
- **Stone** ({colors.stone}): Muted labels
- **Muted** ({colors.muted}): Disabled, placeholders
- **On Dark** ({colors.on-dark}): White text on dark surfaces
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white

### Semantic
- **Warning Background** ({colors.semantic-warning-bg}): Pale yellow callout bg
- **Warning Text** ({colors.semantic-warning-text}): Warning state copy color

## Typography

### Font Family
**Euclid Circular A** (primary): MongoDB''s geometric sans-serif. Fallbacks: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif.
**Source Code Pro** (code): Monospace for code mockups. Fallbacks: ''SF Mono'', Menlo, Consolas, monospace.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 72px | 500 | 1.10 | -1.5px | Hero ("One data platform") |
| `{typography.display-lg}` | 56px | 500 | 1.15 | -1px | Major section openers |
| `{typography.heading-1}` | 48px | 500 | 1.20 | -0.5px | Page-level headlines |
| `{typography.heading-2}` | 36px | 500 | 1.25 | -0.5px | Subsection headlines |
| `{typography.heading-3}` | 28px | 500 | 1.30 | 0 | Card titles |
| `{typography.heading-4}` | 22px | 500 | 1.35 | 0 | Feature tile titles |
| `{typography.heading-5}` | 18px | 600 | 1.40 | 0 | Smaller card titles, FAQ questions |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Hero subtitle, lead body |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Primary body text |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body, table cells |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Active sidebar, button labels |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Badge labels |
| `{typography.micro-uppercase}` | 11px | 600 | 1.40 | 1px | Section eyebrows, course category tags |
| `{typography.button-md}` | 14px | 600 | 1.30 | 0 | Pill button labels |
| `{typography.code-md}` | 14px | 400 | 1.55 | 0 | Code mockups |

### Principles
- Tight hero leading (1.10) on 72px display
- Negative letter-spacing on display sizes (-1.5px to -0.5px)
- 600 weight reserved for buttons and small emphasis (FAQ headings, badges)
- Generous body leading (1.55) for technical documentation readability

## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) through `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px); pricing tightens to `{spacing.section}` (64px)

### Grid & Container
- 1280px max-width with 32px gutters
- Pricing: 3-tier card row, dense feature comparison table below
- Learn catalog: 3-up course tile grid, 4-up certification grid
- AI use cases: 2-column hero with atmospheric illustration

### Whitespace Philosophy
Marketing surfaces give content generous breathing room — `{spacing.hero}` (120px) hero padding for deep teal bands. Pricing/learn surfaces tighten dramatically.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline}` border | Default cards, table rows |
| 1 (subtle) | `rgba(0, 30, 43, 0.04) 0px 1px 2px 0px` | Hover-elevated tiles |
| 2 (card) | `rgba(0, 30, 43, 0.08) 0px 4px 12px 0px` | Feature cards |
| 3 (mockup) | `rgba(0, 30, 43, 0.12) 0px 12px 24px -4px` | Code mockup over hero |
| 4 (modal) | `rgba(0, 30, 43, 0.16) 0px 16px 48px -8px` | Modals, dropdowns |

### Decorative Depth
- Dark teal hero bands carry atmospheric gradient depth
- Code mockup cards on hero use canvas-dark surface with terminal aesthetic
- Pale-mint pricing-feature tier uses brand-tinted shadow

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Course category tags |
| `{rounded.sm}` | 6px | Type badges, code chips |
| `{rounded.md}` | 8px | Inputs, search-pill, code blocks |
| `{rounded.lg}` | 12px | Cards, pricing tiers, course tiles |
| `{rounded.xl}` | 16px | Larger feature panels |
| `{rounded.xxl}` | 24px | Featured product showcases |
| `{rounded.full}` | 9999px | All buttons, status badges |

### Photography Geometry
- Hero illustrations sit on full-bleed dark backgrounds
- Course tile thumbnails use `{rounded.lg}` corners
- Customer logos wall: wordmarks at consistent 60–80px height

## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Bright MongoDB green pill primary CTA, the dominant action.
- Background `{colors.brand-green}`, text `{colors.on-primary}` (deep navy), typography `{typography.button-md}`, padding `10px 22px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` deepens to `{colors.primary-pressed}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background.

**`button-secondary`** — Outlined pill for secondary actions.
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, typography `{typography.button-md}`, padding `10px 22px`, rounded `{rounded.full}`.

**`button-on-dark`** — Bright green pill on dark hero bands.
- Background `{colors.brand-green}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `10px 22px`, rounded `{rounded.full}`.

**`button-secondary-on-dark`** — Outlined pill on dark backgrounds.
- Background transparent, text `{colors.on-dark}`, border `1px solid {colors.hairline-dark}`, typography `{typography.button-md}`, padding `10px 22px`, rounded `{rounded.full}`.

**`button-ghost`** — Quieter rectangular ghost button.
- Background transparent, text `{colors.ink}`, typography `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.md}`.

**`button-link`** — Inline green text link.
- Background transparent, text `{colors.brand-green-dark}`, typography `{typography.body-sm-medium}`, padding `0`.

### Cards & Containers

**`card-base`** — Standard content card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-feature`** — Feature card with larger padding.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`card-product-deploy`** — Product deployment card ("MongoDB Atlas / Community").
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`card-feature-dark`** — Dark teal feature card on hero band.
- Background `{colors.brand-teal-deep}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-course`** — MongoDB University course tile.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.
- Top: colored category tag. Below: title `{typography.heading-5}`, description `{typography.body-sm}`, "Get Started →" link.

**`card-cert`** — Certification card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`pricing-card-featured`** — Featured pricing tier (Flex tier, mint background + green border).
- Background `{colors.surface-feature}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `2px solid {colors.brand-green}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.brand-green-dark}`.

**`search-pill`** — Standard 44px search bar.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-md}`, rounded `{rounded.md}`, height 44px, border `1px solid {colors.hairline-strong}`.

**`search-pill-large`** — Large 56px search bar (top of MongoDB University catalog).
- Background `{colors.canvas}`, text `{colors.steel}`, typography `{typography.body-md}`, rounded `{rounded.md}`, height 56px, border `1px solid {colors.hairline-strong}`.

### Tabs

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav (top of pricing: "MongoDB Atlas / Enterprise Advanced").
- Inactive: text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.ink}`, text `{colors.on-dark}`.

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation.
- Inactive: text `{colors.steel}`, no border. Active: text `{colors.brand-green-dark}`, 2px bottom border in `{colors.brand-green-dark}`.

### Badges & Status

**`badge-green`** — Bright green badge for new product highlights.
- Background `{colors.brand-green}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-green-soft`** — Pale-mint pill for success/free indicators.
- Background `{colors.brand-green-soft}`, text `{colors.brand-green-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-purple`** — Purple course category tag.
- Background `{colors.accent-purple}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-orange`** — Orange course category tag.
- Background `{colors.accent-orange}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-popular`** — "Most Popular" tier indicator (dark teal pill with green text).
- Background `{colors.brand-teal-deep}`, text `{colors.brand-green}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`promo-banner`** — Dark teal sticky promo strip ABOVE the top nav.
- Background `{colors.brand-teal-deep}`, text `{colors.on-dark}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`.

### Code

**`code-block`** — Code container.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, typography `{typography.code-md}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`code-mockup-card`** — Embedded code mockup on hero band.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.lg}`. Carries terminal-aesthetic code snippet.

### Tables

**`comparison-table`** — Pricing feature comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`comparison-row`** — Individual feature row.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.lg}`, bottom border `1px solid {colors.hairline-soft}`.

### Documentation Components

**`service-tile`** — Tile in "Customize your deployment" 6-up grid.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`why-card`** — "Loved by builders" feature card.
- Background `{colors.surface}`, rounded `{rounded.lg}`, padding `{spacing.xl}`.

**`customer-testimonial-card`** — Customer quote card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`logo-wall-item`** — Customer logo wordmark cell.
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.

**`faq-accordion-item`** — FAQ panel.
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, bottom border `1px solid {colors.hairline}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline}`.
- Left: MongoDB leaf logo + "Solutions / Resources / Company / Pricing" links.
- Right: "Sign In" link + bright-green pill "Try Free" CTA.

### Signature Components

**`hero-band-dark`** — Deep teal hero band with embedded code mockup.
- Background `{colors.brand-teal-deep}`, text `{colors.on-dark}`, padding `{spacing.hero}`.
- Layout: centered headline `{typography.hero-display}`, subtitle, button row, `code-mockup-card` below.

**`hero-platform-card`** — Lighter-teal platform showcase card on dark hero.
- Background `{colors.brand-teal-mid}`, text `{colors.on-dark}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`.

**`cta-banner-dark`** — Dark CTA banner at the bottom of feature pages.
- Background `{colors.brand-teal-deep}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.section}`.

**`footer-region`** — Dark teal multi-column footer.
- Background `{colors.brand-teal-deep}`, padding `{spacing.section} {spacing.xxl}`.
- 6-column link grid.
- Section headings in `{typography.body-sm-medium}` `{colors.on-dark}`.

**`footer-link`** — Individual footer link.
- Background transparent, text `{colors.on-dark-muted}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.

## Do''s and Don''ts

### Do
- Use `{colors.brand-green}` (bright MongoDB green) for primary CTAs everywhere
- Pair dark-teal hero bands with bright green CTA pills
- Apply `{rounded.full}` to every button, every status badge
- Apply `{rounded.lg}` (12px) to cards consistently
- Use category accent colors (purple, orange, green, teal) ONLY for course tags
- Maintain Euclid Circular A across every UI surface
- Use code mockup cards with terminal-aesthetic content for product showcases

### Don''t
- Don''t use the bright green for body text or large surfaces
- Don''t introduce additional accent colors beyond the brand green and category-encoding palette
- Don''t soften corners on buttons; the pill is a brand signature
- Don''t replace deep teal hero bands with white hero bands
- Don''t apply heavy shadows on flat documentation cards; reserve elevation for code mockups
- Don''t use Source Code Pro for prose

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero 36px. Pricing 1-up. Course catalog 1-up. |
| Mobile (large) | 480 – 767px | Course tiles 2-up. Hero 48px. |
| Tablet | 768 – 1023px | 2-column feature grids. Hero 56px. |
| Desktop | 1024 – 1279px | 3-tier pricing card row. 3-up course catalog. Hero 64px. |
| Wide Desktop | ≥ 1280px | Full 72px hero presentation. |

### Touch Targets
- Pill buttons render at 40–44px effective height
- Form inputs render at 44px height
- Search pill (large) renders at 56px
- Pill tabs ~32px → 44px on mobile

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger
- **Hero band**: code mockup card moves below text on mobile
- **Pricing tiers**: 3-column → 2-column tablet → 1-column mobile
- **Course catalog**: 3-up → 2-up tablet → 1-up mobile
- **Hero typography**: 72px → 56px → 48px → 36px
- **Footer**: 6-column desktop → 3-column tablet → accordion mobile

### Image Behavior
- Atmospheric AI imagery uses 16:9 ratio with full-bleed scaling
- Code mockup card content remains readable across breakpoints
- Customer logo wall: wordmarks at consistent 60–80px height

## Iteration Guide

1. Focus on ONE component at a time
2. Reference component names and tokens directly
3. Run `npx @google/design.md lint DESIGN.md` after edits
4. Add new variants as separate `components:` entries
5. Default to `{typography.body-md}` for body
6. Keep `{colors.brand-green}` as the primary CTA across all surfaces
7. Pill-shaped buttons (`{rounded.full}`) always
8. Dark-teal hero bands frame primary CTAs

## Known Gaps

- Specific dark-mode token values for canvas/surface beyond hero bands not surfaced
- Animation/transition timings not extracted; recommend 150–200ms ease
- Form validation success state not explicitly captured
- Course-tile category color mappings are observation-based
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

MongoDB carries a strong dual-mode visual identity — dark deep-teal hero bands with the unmistakable bright MongoDB green ({colors.brand-green}) CTA pill paired with stark white documentation and pricing surfaces. The homepage opens with "One data platform. Unlimited AI potential." headline over a deep navy hero, the green pill sitting at the visual center as the primary CTA. Lower on the page, embedded code mockup cards (terminal-aesthetic) sit on the dark hero band, breaking out into white feature cards below. The pricing page renders a 3-tier comparison (Free / Flex / Dedicated) with a featured tier highlighted in soft mint background and bright green border. The MongoDB University page presents a course catalog grid where each tile carries a colored category tag (orange, purple, green, teal) — these are MongoDB''s category-encoding accent colors and are the only place outside the brand green where saturated color appears.

The system uses Euclid Circular A as its display face. The face is contemporary geometric — confident but not overly playful — and pairs naturally with both the developer-tool aesthetic of the database product and the educational positioning of the learning surfaces. Cards use `{rounded.lg}` (12px) corners; buttons use `{rounded.full}` pills universally. The brand-teal palette ({colors.brand-teal-deep}) anchors hero bands, footer, code mockups, and the dark CTA banners.

**Key Characteristics:**
- Deep navy/teal hero bands ({colors.brand-teal-deep}) with bright MongoDB green ({colors.brand-green}) CTA pills
- Stark white pricing/documentation surfaces with colored category tags for course tiles (purple, orange, green, teal)
- Euclid Circular A across every UI surface
- Pill-shaped buttons ({rounded.full}) and 12px-rounded cards
- 3-tier pricing comparison (Free / Flex / Dedicated) with featured-mint highlight tier
- Code mockup cards with terminal-aesthetic dark canvas', '{"sourcePath":"docs/design-md/mongodb/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: mongodb.com/ (homepage), /products/platform/atlas-database (Atlas product), /products/self-managed/community-edition, learn.mongodb.com/ (MongoDB University), /solutions/use-cases/artificial-intelligence (AI), /pricing (3-tier comparison). Token coverage was identical across all six pages.

### Brand & Accent
- **MongoDB Green** ({colors.brand-green}): The brand''s most recognizable signal — bright pill-CTA color
- **Green Dark** ({colors.brand-green-dark}): Inline link color, secondary green
- **Green Mid** ({colors.brand-green-mid}): Mid-spectrum green for atmospheric tints
- **Green Soft** ({colors.brand-green-soft}): Pale-mint background tint for success badges and featured pricing tier
- **Brand Teal Deep** ({colors.brand-teal-deep}): Deep navy-teal for hero bands, footer
- **Brand Teal** ({colors.brand-teal}): Mid-spectrum teal
- **Brand Teal Mid** ({colors.brand-teal-mid}): Lighter teal for hero platform cards

### Category Accent (Course Tags)
- **Accent Purple** ({colors.accent-purple}): Course tag for "Database & Security"
- **Accent Orange** ({colors.accent-orange}): Course tag for "Search"
- **Accent Pink** ({colors.accent-pink}): Course tag variant
- **Accent Blue** ({colors.accent-blue}): Course tag variant for atlas/cloud topics

### Surface
- **Canvas White** ({colors.canvas}): Page background and primary card surface
- **Canvas Dark** ({colors.canvas-dark}): Code-block backgrounds, dark mockup canvas
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions
- **Surface Feature** ({colors.surface-feature}): Pale mint background for featured pricing tier
- **Hairline** ({colors.hairline}): 1px borders and primary dividers
- **Hairline Soft** ({colors.hairline-soft}): Quieter dividers
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px border for inputs
- **Hairline Dark** ({colors.hairline-dark}): Border on dark surfaces

### Text
- **Ink** ({colors.ink}): Primary headlines and body text (deep navy-teal)
- **Charcoal** ({colors.charcoal}): Body emphasis
- **Slate** ({colors.slate}): Secondary text
- **Steel** ({colors.steel}): Tertiary text, captions
- **Stone** ({colors.stone}): Muted labels
- **Muted** ({colors.muted}): Disabled, placeholders
- **On Dark** ({colors.on-dark}): White text on dark surfaces
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white

### Semantic
- **Warning Background** ({colors.semantic-warning-bg}): Pale yellow callout bg
- **Warning Text** ({colors.semantic-warning-text}): Warning state copy color', '{"sourcePath":"docs/design-md/mongodb/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**Euclid Circular A** (primary): MongoDB''s geometric sans-serif. Fallbacks: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif.
**Source Code Pro** (code): Monospace for code mockups. Fallbacks: ''SF Mono'', Menlo, Consolas, monospace.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 72px | 500 | 1.10 | -1.5px | Hero ("One data platform") |
| `{typography.display-lg}` | 56px | 500 | 1.15 | -1px | Major section openers |
| `{typography.heading-1}` | 48px | 500 | 1.20 | -0.5px | Page-level headlines |
| `{typography.heading-2}` | 36px | 500 | 1.25 | -0.5px | Subsection headlines |
| `{typography.heading-3}` | 28px | 500 | 1.30 | 0 | Card titles |
| `{typography.heading-4}` | 22px | 500 | 1.35 | 0 | Feature tile titles |
| `{typography.heading-5}` | 18px | 600 | 1.40 | 0 | Smaller card titles, FAQ questions |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Hero subtitle, lead body |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Primary body text |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body, table cells |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Active sidebar, button labels |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Badge labels |
| `{typography.micro-uppercase}` | 11px | 600 | 1.40 | 1px | Section eyebrows, course category tags |
| `{typography.button-md}` | 14px | 600 | 1.30 | 0 | Pill button labels |
| `{typography.code-md}` | 14px | 400 | 1.55 | 0 | Code mockups |

### Principles
- Tight hero leading (1.10) on 72px display
- Negative letter-spacing on display sizes (-1.5px to -0.5px)
- 600 weight reserved for buttons and small emphasis (FAQ headings, badges)
- Generous body leading (1.55) for technical documentation readability', '{"sourcePath":"docs/design-md/mongodb/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) through `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px); pricing tightens to `{spacing.section}` (64px)

### Grid & Container
- 1280px max-width with 32px gutters
- Pricing: 3-tier card row, dense feature comparison table below
- Learn catalog: 3-up course tile grid, 4-up certification grid
- AI use cases: 2-column hero with atmospheric illustration

### Whitespace Philosophy
Marketing surfaces give content generous breathing room — `{spacing.hero}` (120px) hero padding for deep teal bands. Pricing/learn surfaces tighten dramatically.', '{"sourcePath":"docs/design-md/mongodb/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline}` border | Default cards, table rows |
| 1 (subtle) | `rgba(0, 30, 43, 0.04) 0px 1px 2px 0px` | Hover-elevated tiles |
| 2 (card) | `rgba(0, 30, 43, 0.08) 0px 4px 12px 0px` | Feature cards |
| 3 (mockup) | `rgba(0, 30, 43, 0.12) 0px 12px 24px -4px` | Code mockup over hero |
| 4 (modal) | `rgba(0, 30, 43, 0.16) 0px 16px 48px -8px` | Modals, dropdowns |

### Decorative Depth
- Dark teal hero bands carry atmospheric gradient depth
- Code mockup cards on hero use canvas-dark surface with terminal aesthetic
- Pale-mint pricing-feature tier uses brand-tinted shadow', '{"sourcePath":"docs/design-md/mongodb/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Course category tags |
| `{rounded.sm}` | 6px | Type badges, code chips |
| `{rounded.md}` | 8px | Inputs, search-pill, code blocks |
| `{rounded.lg}` | 12px | Cards, pricing tiers, course tiles |
| `{rounded.xl}` | 16px | Larger feature panels |
| `{rounded.xxl}` | 24px | Featured product showcases |
| `{rounded.full}` | 9999px | All buttons, status badges |

### Photography Geometry
- Hero illustrations sit on full-bleed dark backgrounds
- Course tile thumbnails use `{rounded.lg}` corners
- Customer logos wall: wordmarks at consistent 60–80px height', '{"sourcePath":"docs/design-md/mongodb/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Bright MongoDB green pill primary CTA, the dominant action.
- Background `{colors.brand-green}`, text `{colors.on-primary}` (deep navy), typography `{typography.button-md}`, padding `10px 22px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` deepens to `{colors.primary-pressed}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background.

**`button-secondary`** — Outlined pill for secondary actions.
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, typography `{typography.button-md}`, padding `10px 22px`, rounded `{rounded.full}`.

**`button-on-dark`** — Bright green pill on dark hero bands.
- Background `{colors.brand-green}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `10px 22px`, rounded `{rounded.full}`.

**`button-secondary-on-dark`** — Outlined pill on dark backgrounds.
- Background transparent, text `{colors.on-dark}`, border `1px solid {colors.hairline-dark}`, typography `{typography.button-md}`, padding `10px 22px`, rounded `{rounded.full}`.

**`button-ghost`** — Quieter rectangular ghost button.
- Background transparent, text `{colors.ink}`, typography `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.md}`.

**`button-link`** — Inline green text link.
- Background transparent, text `{colors.brand-green-dark}`, typography `{typography.body-sm-medium}`, padding `0`.

### Cards & Containers

**`card-base`** — Standard content card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-feature`** — Feature card with larger padding.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`card-product-deploy`** — Product deployment card ("MongoDB Atlas / Community").
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`card-feature-dark`** — Dark teal feature card on hero band.
- Background `{colors.brand-teal-deep}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-course`** — MongoDB University course tile.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.
- Top: colored category tag. Below: title `{typography.heading-5}`, description `{typography.body-sm}`, "Get Started →" link.

**`card-cert`** — Certification card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`pricing-card-featured`** — Featured pricing tier (Flex tier, mint background + green border).
- Background `{colors.surface-feature}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `2px solid {colors.brand-green}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.brand-green-dark}`.

**`search-pill`** — Standard 44px search bar.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-md}`, rounded `{rounded.md}`, height 44px, border `1px solid {colors.hairline-strong}`.

**`search-pill-large`** — Large 56px search bar (top of MongoDB University catalog).
- Background `{colors.canvas}`, text `{colors.steel}`, typography `{typography.body-md}`, rounded `{rounded.md}`, height 56px, border `1px solid {colors.hairline-strong}`.

### Tabs

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav (top of pricing: "MongoDB Atlas / Enterprise Advanced").
- Inactive: text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.ink}`, text `{colors.on-dark}`.

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation.
- Inactive: text `{colors.steel}`, no border. Active: text `{colors.brand-green-dark}`, 2px bottom border in `{colors.brand-green-dark}`.

### Badges & Status

**`badge-green`** — Bright green badge for new product highlights.
- Background `{colors.brand-green}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-green-soft`** — Pale-mint pill for success/free indicators.
- Background `{colors.brand-green-soft}`, text `{colors.brand-green-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-purple`** — Purple course category tag.
- Background `{colors.accent-purple}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-orange`** — Orange course category tag.
- Background `{colors.accent-orange}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-popular`** — "Most Popular" tier indicator (dark teal pill with green text).
- Background `{colors.brand-teal-deep}`, text `{colors.brand-green}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`promo-banner`** — Dark teal sticky promo strip ABOVE the top nav.
- Background `{colors.brand-teal-deep}`, text `{colors.on-dark}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`.

### Code

**`code-block`** — Code container.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, typography `{typography.code-md}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`code-mockup-card`** — Embedded code mockup on hero band.
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.lg}`. Carries terminal-aesthetic code snippet.

### Tables

**`comparison-table`** — Pricing feature comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`comparison-row`** — Individual feature row.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.lg}`, bottom border `1px solid {colors.hairline-soft}`.

### Documentation Components

**`service-tile`** — Tile in "Customize your deployment" 6-up grid.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`why-card`** — "Loved by builders" feature card.
- Background `{colors.surface}`, rounded `{rounded.lg}`, padding `{spacing.xl}`.

**`customer-testimonial-card`** — Customer quote card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`logo-wall-item`** — Customer logo wordmark cell.
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.

**`faq-accordion-item`** — FAQ panel.
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, bottom border `1px solid {colors.hairline}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline}`.
- Left: MongoDB leaf logo + "Solutions / Resources / Company / Pricing" links.
- Right: "Sign In" link + bright-green pill "Try Free" CTA.

### Signature Components

**`hero-band-dark`** — Deep teal hero band with embedded code mockup.
- Background `{colors.brand-teal-deep}`, text `{colors.on-dark}`, padding `{spacing.hero}`.
- Layout: centered headline `{typography.hero-display}`, subtitle, button row, `code-mockup-card` below.

**`hero-platform-card`** — Lighter-teal platform showcase card on dark hero.
- Background `{colors.brand-teal-mid}`, text `{colors.on-dark}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`.

**`cta-banner-dark`** — Dark CTA banner at the bottom of feature pages.
- Background `{colors.brand-teal-deep}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.section}`.

**`footer-region`** — Dark teal multi-column footer.
- Background `{colors.brand-teal-deep}`, padding `{spacing.section} {spacing.xxl}`.
- 6-column link grid.
- Section headings in `{typography.body-sm-medium}` `{colors.on-dark}`.

**`footer-link`** — Individual footer link.
- Background transparent, text `{colors.on-dark-muted}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.', '{"sourcePath":"docs/design-md/mongodb/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Use `{colors.brand-green}` (bright MongoDB green) for primary CTAs everywhere
- Pair dark-teal hero bands with bright green CTA pills
- Apply `{rounded.full}` to every button, every status badge
- Apply `{rounded.lg}` (12px) to cards consistently
- Use category accent colors (purple, orange, green, teal) ONLY for course tags
- Maintain Euclid Circular A across every UI surface
- Use code mockup cards with terminal-aesthetic content for product showcases

### Don''t
- Don''t use the bright green for body text or large surfaces
- Don''t introduce additional accent colors beyond the brand green and category-encoding palette
- Don''t soften corners on buttons; the pill is a brand signature
- Don''t replace deep teal hero bands with white hero bands
- Don''t apply heavy shadows on flat documentation cards; reserve elevation for code mockups
- Don''t use Source Code Pro for prose', '{"sourcePath":"docs/design-md/mongodb/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero 36px. Pricing 1-up. Course catalog 1-up. |
| Mobile (large) | 480 – 767px | Course tiles 2-up. Hero 48px. |
| Tablet | 768 – 1023px | 2-column feature grids. Hero 56px. |
| Desktop | 1024 – 1279px | 3-tier pricing card row. 3-up course catalog. Hero 64px. |
| Wide Desktop | ≥ 1280px | Full 72px hero presentation. |

### Touch Targets
- Pill buttons render at 40–44px effective height
- Form inputs render at 44px height
- Search pill (large) renders at 56px
- Pill tabs ~32px → 44px on mobile

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger
- **Hero band**: code mockup card moves below text on mobile
- **Pricing tiers**: 3-column → 2-column tablet → 1-column mobile
- **Course catalog**: 3-up → 2-up tablet → 1-up mobile
- **Hero typography**: 72px → 56px → 48px → 36px
- **Footer**: 6-column desktop → 3-column tablet → accordion mobile

### Image Behavior
- Atmospheric AI imagery uses 16:9 ratio with full-bleed scaling
- Code mockup card content remains readable across breakpoints
- Customer logo wall: wordmarks at consistent 60–80px height', '{"sourcePath":"docs/design-md/mongodb/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time
2. Reference component names and tokens directly
3. Run `npx @google/design.md lint DESIGN.md` after edits
4. Add new variants as separate `components:` entries
5. Default to `{typography.body-md}` for body
6. Keep `{colors.brand-green}` as the primary CTA across all surfaces
7. Pill-shaped buttons (`{rounded.full}`) always
8. Dark-teal hero bands frame primary CTAs', '{"sourcePath":"docs/design-md/mongodb/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Specific dark-mode token values for canvas/surface beyond hero bands not surfaced
- Animation/transition timings not extracted; recommend 150–200ms ease
- Form validation success state not explicitly captured
- Course-tile category color mappings are observation-based', '{"sourcePath":"docs/design-md/mongodb/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_1', '#00ed64', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_2', '#00b545', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_3', '#008c34', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_4', '#001e2b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_5', '#00684a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_6', '#00a35c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_7', '#c3f0d2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_8', '#003d4f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_9', '#7b3ff2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_10', '#fa6e39', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_11', '#f06bb8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_12', '#3d4f9f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_13', '#fff8e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_14', '#946f3f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_15', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_16', '#f9fbfa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_17', '#f4f7f6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_18', '#e3fcef', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_19', '#e1e5e8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_20', '#eceff1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_21', '#c1ccd6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_22', '#1c2d38', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_23', '#3d4f5b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_24', '#5c6c7a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_25', '#7c8c9a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md'), 'color', 'color_26', '#a8b3bc', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/mongodb/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/mongodb/DESIGN.md';


-- Nike
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Nike', 'nike', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/nike/DESIGN.md', null, 'seeded', '---
version: alpha
name: Nike-design-analysis
description: |
  A photography-first commerce system built on extreme typographic contrast — towering uppercase Futura display lockups burned into editorial campaign imagery, sitting above a dense, neutral, near-monochrome retail chrome of pill-shaped black CTAs, gray search and tag pills, and tight 8px-grid product cards. The brand''s voice is athletic, kinetic, and absolute: pure black, pure white, a single soft surface gray, and a deliberately small set of semantic accents (sale red, success green, restrained category tints) — every chromatic moment is reserved for editorial photography or pricing signal, never decorative chrome.

colors:
  primary: "#111111"
  on-primary: "#ffffff"
  canvas: "#ffffff"
  soft-cloud: "#f5f5f5"
  ink: "#111111"
  charcoal: "#39393b"
  ash: "#4b4b4d"
  mute: "#707072"
  stone: "#9e9ea0"
  hairline: "#cacacb"
  hairline-soft: "#e5e5e5"
  sale: "#d30005"
  sale-deep: "#780700"
  success: "#007d48"
  success-bright: "#1eaa52"
  info: "#1151ff"
  info-deep: "#0034e3"
  accent-pink: "#ed1aa0"
  accent-pink-soft: "#ffb0dd"
  accent-purple-soft: "#beaffd"
  accent-purple-pale: "#d6d1ff"
  accent-teal: "#0a7281"
  accent-pink-deep: "#4c012d"

typography:
  display-campaign:
    fontFamily: Nike Futura ND
    fontSize: 96px
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: 0
    textTransform: uppercase
  heading-xl:
    fontFamily: Helvetica Now Display Medium
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  heading-lg:
    fontFamily: Helvetica Now Display Medium
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  heading-md:
    fontFamily: Helvetica Now Display Medium
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: 0
  body-md:
    fontFamily: Helvetica Now Text
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: Helvetica Now Text Medium
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  button-lg:
    fontFamily: Helvetica Now Display Medium
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  button-md:
    fontFamily: Helvetica Now Text Medium
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  button-sm:
    fontFamily: Helvetica Now Text Medium
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  link-md:
    fontFamily: Helvetica Now Text
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: 0
    textDecoration: underline
  caption-md:
    fontFamily: Helvetica Now Text Medium
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  caption-sm:
    fontFamily: Helvetica Now Text Medium
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  utility-xs:
    fontFamily: Helvetica Neue
    fontSize: 9px
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: 0

rounded:
  none: 0px
  sm: 18px
  md: 24px
  lg: 30px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 18px
  xl: 24px
  xxl: 30px
  section: 48px

components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 16px 32px
    height: 48px
  button-primary-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
  button-secondary:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 16px 32px
    height: 48px
  button-outline-on-image:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 12px 24px
  button-icon-circular:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 40px
  search-pill:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    height: 40px
  search-pill-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  filter-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 16px
  filter-chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
  badge-promo:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  badge-sale-text:
    textColor: "{colors.sale}"
    typography: "{typography.caption-md}"
  product-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
    padding: 0px
  product-card-image:
    backgroundColor: "{colors.soft-cloud}"
    rounded: "{rounded.none}"
  swatch-dot:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 12px
  swatch-dot-active:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 12px
  campaign-tile:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-campaign}"
    rounded: "{rounded.none}"
  category-icon-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.none}"
  member-benefit-card:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.heading-lg}"
    rounded: "{rounded.none}"
  faq-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-md}"
    rounded: "{rounded.none}"
    padding: 24px 0px
  pdp-disclosure-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
    padding: 24px 0px
  utility-bar:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.none}"
    height: 36px
  primary-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
    height: 56px
  filter-sidebar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.mute}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.none}"
---

## Overview

Nike''s commerce system is built on a single, almost violently simple idea: photography speaks, the chrome doesn''t. Every page reads as an athletic editorial — towering uppercase Futura display lockups (`{typography.display-campaign}`) burned into full-bleed campaign imagery, with everything else (nav, filters, buttons, cards, footer) reduced to neutral typography and pill geometry on `{colors.canvas}` and `{colors.soft-cloud}`. There is no decorative gradient, no soft shadow nostalgia, no accent color used for "tone" — the system saves all chromatic energy for product photography and the small handful of moments that actually need to signal (sale price `{colors.sale}`, success `{colors.success}`, swatch dots).

The result is a layout that feels physical — campaign hero, product grid, sport tile, footer — stacked like a printed catalog rather than animated like a typical SaaS landing page. Density is high but never crowded, because the system relies on three relentless devices: square or near-square 1:1 product imagery on `{colors.soft-cloud}`, pill-shaped black CTAs (`{rounded.full}`) anchoring every actionable surface, and a tight 8px-base spacing scale that keeps cards and filters mathematically aligned across PLP, PDP, and editorial pages.

Across `/men`, the trail-running listing, the Zegama PDP, `/membership`, and Jordan Golf, the same chrome appears in identical proportions — only the photography and copy change. That is the system''s signature: maximum editorial expression in the imagery, maximum mechanical restraint everywhere else.

**Key Characteristics:**
- Editorial campaign hero with `{typography.display-campaign}` (Nike Futura ND, 96px, line-height 0.9, uppercase) burned directly into full-bleed photography
- Pure black/white/single-gray UI palette: `{colors.ink}`, `{colors.canvas}`, and `{colors.soft-cloud}` carry ~95% of the chrome surface area
- Pill geometry everywhere: every CTA, search field, filter chip, and badge uses `{rounded.full}` (30px) or `{rounded.md}` (24px) — there are no sharp-cornered buttons in the system
- Product cards have zero radius, zero shadow, sit directly on `{colors.soft-cloud}` swatch backgrounds — the photograph is the card
- Two-tone CTA hierarchy: `{component.button-primary}` (black on anything light) versus `{component.button-secondary}` (`{colors.soft-cloud}` on anything bright) — never both at once on the same surface
- 8px spacing system with section rhythm at `{spacing.section}` (48px) creating consistent vertical breathing across PLP, PDP, and editorial pages
- Sale signaling is the only place a non-neutral color appears in retail chrome: `{colors.sale}` price + strike-through original price, no badge background

## Colors

> **Source pages:** `/men` (primary), `/w/mens-acg-trail-running-shoes-…`, `/t/acg-zegama-…`, `/membership`, `/w/jordan-golf-…`. The chrome palette is identical across all five — only photography varies.

### Brand & Accent
- **Nike Black** (`{colors.ink}` — `#111111`): The brand''s only "color." It is the primary CTA, the swatch dot, the active filter chip, the campaign overlay, the headline color, and the body text. When Nike wants to assert anything, it goes black.
- **Pure White** (`{colors.on-primary}`, `{colors.canvas}` — `#ffffff`): Equal partner to black. Carries every page background, the on-image CTA, and the inverse text on `{colors.ink}` surfaces.

### Surface
- **Soft Cloud** (`{colors.soft-cloud}` — `#f5f5f5`): The most-used non-white surface in the entire system. Product card image backgrounds, search pill, secondary CTA, utility bar, sport-category swatch tiles. It is the "color" of every product photograph''s stage.
- **Hairline** (`{colors.hairline}` — `#cacacb`): 1px dividers between filter rows, footer columns, and PDP disclosure rows.
- **Hairline Soft** (`{colors.hairline-soft}` — `#e5e5e5`): Inset 1px shadow under sticky bars and tab strips, the only "shadow" the system uses.

### Text
- **Ink** (`{colors.ink}` — `#111111`): Primary text on light surfaces — headlines, product names, prices, nav.
- **Charcoal** (`{colors.charcoal}` — `#39393b`): Slightly softer body where ink is too heavy.
- **Ash** (`{colors.ash}` — `#4b4b4d`): Disabled secondary border on dark surfaces and very low-emphasis utility text.
- **Mute** (`{colors.mute}` — `#707072`): Product category subtitles ("Men''s Trail Running Shoes"), footer link text, secondary metadata.
- **Stone** (`{colors.stone}` — `#9e9ea0`): Inverse secondary text on dark surfaces and lowest-emphasis utility text.

### Semantic
- **Sale** (`{colors.sale}` — `#d30005`): Discounted price color and "% off" copy — the only red in the entire retail chrome.
- **Sale Deep** (`{colors.sale-deep}` — `#780700`): Sale price hover/pressed and dark-mode sale anchor.
- **Success** (`{colors.success}` — `#007d48`): Confirmation messages, in-stock indicators, eligibility ticks.
- **Success Bright** (`{colors.success-bright}` — `#1eaa52`): Inverse success on dark surfaces.
- **Info** (`{colors.info}` — `#1151ff`): Informational link/badge accent in member-experience callouts.
- **Info Deep** (`{colors.info-deep}` — `#0034e3`): Pressed state for info accent.

### Category Accents (sport / collection chips)
These appear sparingly — almost exclusively as small chip backgrounds, swatch dots, or category illustrations in editorial tiles. They are never used as text or primary CTA color.
- **Accent Pink** (`{colors.accent-pink}` — `#ed1aa0`): SKIMS / women''s collection moments.
- **Accent Pink Soft** (`{colors.accent-pink-soft}` — `#ffb0dd`): Soft tinting on member-experience tiles.
- **Accent Purple Soft** (`{colors.accent-purple-soft}` — `#beaffd`): Editorial swatch dot, soft category chip.
- **Accent Purple Pale** (`{colors.accent-purple-pale}` — `#d6d1ff`): Lightest soft-tile fill.
- **Accent Teal** (`{colors.accent-teal}` — `#0a7281`): Trail / outdoor / ACG editorial accent in lockups.
- **Accent Pink Deep** (`{colors.accent-pink-deep}` — `#4c012d`): Deepest editorial overlay tint, used as wash on heritage / Jordan tiles.

## Typography

### Font Family
- **Nike Futura ND** (display campaign only) — proprietary geometric sans for the towering uppercase headlines burned into campaign hero photography. Falls back to Helvetica Now Text Medium → Helvetica → Arial.
- **Helvetica Now Display Medium** (headings 16–32px) — modern Helvetica cut tuned for display sizes; carries every section title, PDP product name, and dialog headline.
- **Helvetica Now Text Medium** (UI 12–16px) — buttons, captions, swatch labels, badge text. The system''s UI workhorse.
- **Helvetica Now Text** (body and links) — long-form body and underlined inline links.
- **Neue Frutiger Arabic** — RTL pairing for Arabic locales at `{typography.heading-lg}` and caption sizes.
- **Helvetica Neue 9px** — legal-fine-print utility row only (`{typography.utility-xs}`).

When substituting on systems without proprietary Nike fonts: pair **Inter** (Display 700 for body chrome, Display 500 for buttons) with **Bebas Neue** or **Anton** at 96px/0.9 line-height for the campaign headline tier. Tighten letter-spacing slightly (-0.5%) on the substitute to approximate Futura ND''s optical weight.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-campaign}` | 96px | 500 | 0.9 | 0 | Editorial campaign headline burned into hero photography (uppercase) |
| `{typography.heading-xl}` | 32px | 500 | 1.2 | 0 | Section headers — "FEATURED FOOTWEAR", "LATEST IN CLOTHING", PDP product title block |
| `{typography.heading-lg}` | 24px | 500 | 1.2 | 0 | Subsection / member-benefit card title, large CTA label, PDP price |
| `{typography.heading-md}` | 16px | 500 | 1.75 | 0 | Card title, FAQ row label, filter group header |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Body copy, search-pill placeholder, product description |
| `{typography.body-strong}` | 16px | 500 | 1.5 | 0 | Product card name, filter row label, primary nav link |
| `{typography.button-lg}` | 24px | 500 | 1.2 | 0 | Pressed-letter campaign CTA inside hero blocks |
| `{typography.button-md}` | 16px | 500 | 1.5 | 0 | Standard pill CTAs across the system |
| `{typography.button-sm}` | 14px | 500 | 1.5 | 0 | Compact pill CTA, badge label, geo-selector button |
| `{typography.link-md}` | 16px | 500 | 1.75 | 0 | Underlined inline link, "View Product Details" |
| `{typography.caption-md}` | 14px | 500 | 1.5 | 0 | Product subtitle ("Men''s Trail Running Shoes"), filter count, footer link |
| `{typography.caption-sm}` | 12px | 500 | 1.5 | 0 | Filter chip label, badge text, color count |
| `{typography.utility-xs}` | 9px | 500 | 1.75 | 0 | Legal copyright / fine-print row at the very bottom |

### Principles
The system runs on extreme typographic contrast: a single 96px uppercase display tier reserved for editorial campaign moments, and a quiet 12–16px Helvetica Now Text/Medium tier carrying everything else. There is almost no middle ground — the jump from `{typography.heading-xl}` (32px) directly to `{typography.body-strong}` (16px) is intentional and creates the "billboard above, catalog below" effect across every page. Letter-spacing is left at 0 (Futura ND and Helvetica Now are both cut for tight optical fit at scale).

### Note on Font Substitutes
The closest open-source path to Nike''s display tier is **Bebas Neue** (free, geometric condensed) at 96px / 0.9 / uppercase / 500. For UI text, **Inter** is the safest substitute — match weights 400/500 and the system reads almost identically at button and caption sizes.

## Layout

### Spacing System
- **Base unit:** 8px
- **Tokens (front matter):** `{spacing.xxs}` (2px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (18px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (30px) · `{spacing.section}` (48px+)
- **Universal rhythm:** every page in the set uses `{spacing.section}` (48px) as the vertical gap between major content blocks (campaign hero → trending row → featured row → shop-by-sport → latest-in-clothing → footer). PLP card grids use `{spacing.sm}` (8px) gutters. PDP disclosure rows are stacked at `{spacing.xl}` (24px) vertical padding.
- **Card internal padding:** product cards use 0px internal padding — image is full-bleed; metadata rows sit directly below with `{spacing.sm}` (8px) gap between name, subtitle, and price.

### Grid & Container
- **Max width:** ~1440px content area with edge gutters that grow to ~80px at 1920px (the system lets very wide viewports breathe rather than stretch).
- **Column patterns:** PLP listing uses 3-up at desktop, collapsing to 2-up at 1023px and 1-up at 599px. The men''s home `/men` mixes a 2-up campaign hero row, a 3- or 4-up "Trending Now" row, a horizontal-scroll "Shop by Sport" rail, and a 4-up "Latest in Clothing" thumbnail grid.
- **Filter sidebar:** ~220px fixed-width left rail on PLP at desktop, collapsing into a `Hide Filters` toggle button at narrow widths.

### Whitespace Philosophy
Whitespace is a tool for separation, not for breath. Sections butt directly against each other vertically with `{spacing.section}` rhythm, and product photos tile edge-to-edge inside their grid — there is no padding wrapped around the product image itself. The "air" comes from the `{colors.soft-cloud}` background of the photograph, not from layout margin. Headlines do not have decorative whitespace above them; they sit immediately under the section divider line.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No shadow, no border | Default for cards, buttons, sections — the dominant treatment |
| 1 — Hairline divider | 1px solid `{colors.hairline}` | Filter row separators, footer column borders, PDP disclosure-row separators |
| 2 — Inset bottom-line | `box-shadow: inset 0 -1px 0 {colors.hairline-soft}` | Sticky utility/sub-nav bar bottom edge, tab strip underline |

The system has no drop-shadow elevation in its retail chrome at all. Cards do not lift on the page. The only depth cue is the 1px inset hairline on sticky strips and the contrast between full-bleed photography and `{colors.soft-cloud}` product backdrops.

### Decorative Depth
Depth in Nike''s system comes entirely from photography, not from CSS effects:
- **Editorial campaign tiles** create depth via cinematic perspective — a runner on a trail, a model in a courtyard — with the Futura display headline overlaid in white or `{colors.ink}` directly on the image.
- **Product card photography** is shot on flat `{colors.soft-cloud}` to remove any background depth, so the product itself is the only thing with form on the page.
- **Sport-category tiles** on the home page are full-bleed cinematic photography with a small `{component.button-outline-on-image}` pill anchored at the bottom-left, giving a moment of crisp white pill against atmospheric image.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Cards, campaign tiles, product imagery, navigation, footer — every container in the system |
| `{rounded.sm}` | 18px | Avatar / icon container in member-benefit lockups |
| `{rounded.md}` | 24px | Search pill, search submit, filter input |
| `{rounded.lg}` | 30px | Every CTA pill — primary, secondary, on-image, filter chip, geo-selector, "Notify Me" |
| `{rounded.full}` | 9999px | Color swatch dots and circular icon buttons (back, share, favorite, carousel paddle) |

### Photography Geometry
- **Product cards:** consistent 1:1 square or near-square (~4:5 portrait on tall product crops), full-bleed within the card with no padding, sitting on `{colors.soft-cloud}` backdrop.
- **Editorial campaign hero:** ~16:9 or wider cinematic crop, full-bleed across the content max-width, with the Futura display headline burned into the lower-left or upper-left third.
- **Sport-category rail:** 4:5 portrait full-bleed thumbnails with a small CTA pill anchored bottom-left.
- **PDP main image:** square primary image with vertical thumbnail rail to its left (~5–7 thumbnails stacked at small size), enabling rapid color/angle browsing without leaving the page.
- **Avatar / category icon cards:** centered illustrated icon at ~80–96px on `{colors.canvas}` with `{typography.caption-md}` label below.

## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only; variants live as separate `components:` entries in the front matter.

### Buttons

**`button-primary`** — the universal Nike CTA
- Background `{colors.ink}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `16px 32px`, height `{spacing.section}` (48px), rounded `{rounded.lg}` (30px pill).
- Used on every primary action in the system: "Sign Up", "Notify Me", "Buy", "Türkiye" geo-confirm, "Shop" overlay on sport tiles, "Continue".
- Pressed state lives in `button-primary-active` — the bg stays `{colors.ink}` while the surface shrinks to `scale(0.5)` with `opacity: 0.5` (Nike''s signature "tap collapse" feedback that''s extracted across all five pages).

**`button-secondary`** — soft alternative on light surfaces
- Background `{colors.soft-cloud}`, text `{colors.ink}`, type `{typography.button-md}`, padding `16px 32px`, rounded `{rounded.lg}`.
- Used as the lower-emphasis alternate when a primary CTA already exists, e.g., "United States" geo-decline next to the black "Türkiye" confirm; "Cancel" or "Discover More" on light cards.

**`button-outline-on-image`** — overlay CTA on photography
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.lg}`.
- The crisp white pill that anchors the bottom-left of every full-bleed sport-category and editorial campaign tile.

**`button-icon-circular`** — chrome icon controls
- Background `{colors.soft-cloud}` or transparent, icon `{colors.ink}`, rounded `{rounded.full}`, size 40px.
- Used for back-arrow, carousel paddle (left/right), wishlist heart, share, and "Hide Filters" toggle.

**`filter-chip`** + **`filter-chip-active`**
- Default: background `{colors.canvas}`, text `{colors.ink}`, 1px hairline `{colors.hairline}`, type `{typography.button-md}`, rounded `{rounded.lg}`, padding `8px 16px`.
- Active: background `{colors.ink}`, text `{colors.on-primary}` — the chip flips fully inverted when selected. No middle state.

### Inputs & Forms

**`search-pill`** + **`search-pill-focused`**
- Default: background `{colors.soft-cloud}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}` (24px), padding `8px 16px`, height `40px`. Anchored to the right of the primary nav with a small magnifier icon.
- Focused: background `{colors.canvas}`, 2px solid border `{colors.ink}`, with a 12px outer halo of `{colors.soft-cloud}` (the system''s only "focus ring" effect). The pill shape stays `{rounded.md}` so the halo reads as a soft glove, not a hard outline.

### Cards & Containers

**`product-card`**
- Container: background `{colors.canvas}`, rounded `{rounded.none}`, padding 0, no shadow.
- Image area: `{component.product-card-image}` — full-bleed product photo on `{colors.soft-cloud}` square.
- Below image (in this order with `{spacing.sm}` between): swatch dot row (3–6 dots at 12px circular), promo badge if applicable (`{component.badge-promo}` "Just In", "Coming Soon", "Recycled Materials"), product name `{typography.body-strong}` `{colors.ink}`, category subtitle `{typography.caption-md}` `{colors.mute}`, price row.
- Price row: regular price `{typography.body-strong}` `{colors.ink}`. If on sale: discounted price `{colors.sale}` followed by strike-through original `{colors.mute}` followed by "% off" in `{colors.sale}`.

**`campaign-tile`** — the brand''s signature editorial unit
- Full-bleed photography with `{typography.display-campaign}` headline burned in (uppercase, 96px, line-height 0.9).
- Headline color is whichever of `{colors.canvas}` or `{colors.ink}` reads against the underlying image — not parameterized; chosen per-asset.
- A single `{component.button-outline-on-image}` pill anchored bottom-left of the tile carries the call-to-action.

**`category-icon-card`**
- Container: background `{colors.canvas}`, rounded `{rounded.none}`.
- Centered category illustration (~80px) + label `{typography.caption-md}` `{colors.ink}` directly below. Used in the "Latest in Clothing" 4–8-up icon strip on `/men`.

**`member-benefit-card`**
- Full-bleed photographic card on a dark image background; copy slot at the bottom-left with `{typography.heading-lg}` headline `{colors.on-primary}` and a `{component.button-outline-on-image}` "Explore" pill below.
- Used in the `/membership` "Member Benefits" 3-up grid.

**`swatch-dot`** + **`swatch-dot-active`**
- 12px circle, rounded `{rounded.full}`, no border in default state. Renders the colorway options on every product card and PDP color picker.
- Default: filled with the colorway''s actual product color (extracted at runtime from the product image), 1px subtle outer ring in `{colors.hairline}` for white/light colorways so they remain visible on `{colors.canvas}`.
- Active: identical fill with a 2px `{colors.ink}` outer ring and 2px white interior gap, creating Nike''s signature concentric-ring "selected" state. No size change between default and active.

**`badge-promo`**
- Background `{colors.canvas}` with 1px hairline `{colors.hairline}`, text `{colors.ink}`, type `{typography.caption-sm}`, rounded `{rounded.lg}`, padding `4px 12px`.
- Sits on top of product imagery (top-left of card) with copy like "Just In", "Coming Soon", "Recycled Materials", "Member Exclusive".

**`badge-sale-text`**
- Inline price-row text in `{colors.sale}` with no background — the only "badge" in the system that has no container.

### Navigation

**`utility-bar`** — top utility strip
- Background `{colors.soft-cloud}`, text `{colors.ink}`, type `{typography.caption-sm}`, height ~36px, rounded `{rounded.none}`.
- Right-aligned cluster: "Find a Store · Help · Join Us · Sign In". Always present; never collapses.

**`primary-nav`** — main navigation
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-strong}` for nav links, height 56–64px, rounded `{rounded.none}`.
- Layout: Nike swoosh logo at left (32×32), centered nav row ("New & Featured · Men · Women · Kids · Jordan · Nike SKIMS · Sport"), right cluster (search pill, wishlist heart icon, bag icon).
- The active section gets a 2px-bottom underline in `{colors.ink}` — no background fill.

**Sub-nav strip** (PLP) — appears under primary nav with breadcrumb + sort + hide-filters controls.
- Same `{colors.canvas}` background with a 1px inset hairline-soft bottom edge.
- Left: breadcrumb in `{typography.caption-md}` `{colors.mute}` separated by " / ".
- Right: "Hide Filters" toggle + "Sort By: …" dropdown — both in `{typography.button-md}` with chevron icons.

**Top Nav (Mobile)**
- Hamburger menu icon (left), Nike swoosh (center), search + bag icons (right).
- Search pill collapses into an icon-only button at narrow widths; tapping expands a full-width overlay search pill with `{rounded.md}`.
- Primary nav collapses into a full-height drawer that slides in from the left, listing nav rows top-down with `{spacing.xl}` vertical padding.

### Signature Components

**`pdp-disclosure-row`** — PDP information accordion rows
- Stacked rows for "View Product Details", "Shipping & Returns", "Reviews (n)" with `{spacing.xl}` vertical padding and a 1px `{colors.hairline}` divider below each.
- Label `{typography.body-strong}` `{colors.ink}` left-aligned; chevron `{colors.ink}` right-aligned.

**`faq-row`** — `/membership` FAQ accordion
- Identical pattern to `pdp-disclosure-row` but with `{typography.heading-md}` label weight; 1px `{colors.hairline}` divider below each.

**`filter-sidebar`** — PLP left rail
- Container `{colors.canvas}`, rounded `{rounded.none}`.
- Section headers `{typography.body-strong}` `{colors.ink}` with `{spacing.lg}` (18px) vertical gap between groups.
- Active filters get a 1px ink underline; counts in parentheses use `{colors.mute}`.

**`footer`**
- Background `{colors.canvas}` with a single 1px `{colors.hairline}` top divider.
- Four columns: Resources / Help / Company / Promotions & Discounts, each with column header `{typography.body-strong}` `{colors.ink}` and link list `{typography.caption-md}` `{colors.mute}`.
- Below the columns: a horizontal rule, then a fine-print row with `{typography.utility-xs}` `{colors.mute}` (copyright, locale switcher, terms, privacy, supply-chain act).

## Do''s and Don''ts

### Do
- Reserve `{typography.display-campaign}` exclusively for editorial campaign hero lockups — never use 96px Futura for section headers or product titles.
- Use `{component.button-primary}` (`{colors.ink}` pill) as the single primary action per viewport. Pair it at most with `{component.button-secondary}` (`{colors.soft-cloud}` pill) for a soft alternative.
- Stage every product photograph on `{colors.soft-cloud}` — the gray is the system''s "studio."
- Keep all CTAs pill-shaped at `{rounded.lg}` (30px). Never introduce a square or `{rounded.sm}` button.
- Use `{colors.sale}` only on price rows — never on backgrounds, badges, or chrome.
- Stack content sections at `{spacing.section}` (48px) rhythm with no decorative dividers between them; the photography''s bleed-edge is the divider.
- Anchor on-image CTAs with `{component.button-outline-on-image}` (white pill) at bottom-left — the system''s universal "shop this image" position.

### Don''t
- Don''t introduce drop shadows or card elevation. Cards sit flat on the page; the only depth cue is the 1px inset hairline on sticky bars.
- Don''t use any of the category accent colors (`{colors.accent-pink}`, `{colors.accent-purple-soft}`, `{colors.accent-teal}`) for primary chrome — they belong to swatch dots, soft tile fills, and editorial moments only.
- Don''t replace `{colors.ink}` with a near-black gray like `{colors.charcoal}` for a CTA — Nike''s primary pill is true `#111111`.
- Don''t pad inside product cards. The image is full-bleed; metadata sits directly below with `{spacing.sm}` (8px) between rows.
- Don''t put two campaign-tile lockups in the same row at the same scale — Nike alternates a single full-bleed editorial tile with a 2-up or 4-up product/category grid.
- Don''t underline anything other than `{typography.link-md}` inline links and the active primary-nav indicator. Buttons, headings, and prices stay un-underlined.
- Don''t introduce a third button shape. Pill or icon-circular — that''s the entire button shape vocabulary.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Content max-width holds at ~1440px; outer gutters grow to ~80px on each side |
| desktop-large | 1440px | Default desktop layout — 3-up product grid, 4-up clothing strip, full primary nav |
| desktop | 1200px | Same as large with slightly narrower outer gutters |
| desktop-small | 1024px | Filter sidebar starts compressing; sport rail shows ~3 visible tiles |
| tablet | 1023–961px | 3-up PLP collapses to 2-up; "Hide Filters" becomes a default toggle |
| tablet-narrow | 960–640px | Primary nav center cluster collapses to a hamburger drawer; search pill becomes icon-only |
| mobile-landscape | 639–600px | 2-up PLP collapses to 1-up; product cards become full-width with image and metadata stacking |
| mobile | 599–320px | Single-column everything; campaign tiles render at full screen width with shorter Futura sizes (~64px) |

### Touch Targets
All interactive elements meet WCAG AAA (44×44px minimum). Pills (`{component.button-primary}`, `{component.button-secondary}`) sit at 48px height with 32px horizontal padding. Icon-circular buttons (`{component.button-icon-circular}`) sit at 40px — Nike''s PDP carousel paddle and wishlist heart sit just under AAA but above AA at 40×40, with hit-target padding extending the tappable area to 48px+. Filter-chip pills are 40px height with 16px padding.

### Collapsing Strategy
- **Primary nav:** desktop center cluster → mobile drawer triggered by hamburger at left of the swoosh.
- **PLP grid:** 3-up → 2-up → 1-up at 1023, 599, and below; gutters drop from `{spacing.sm}` to `{spacing.xs}` on mobile.
- **Filter sidebar:** 220px fixed → "Hide Filters" toggle → off-canvas full-screen filter drawer at mobile.
- **Sport rail:** desktop horizontal scroll with ~5 visible → mobile horizontal scroll with ~1.5 visible (peek-next-card pattern).
- **Section spacing:** `{spacing.section}` 48px desktop → 32px tablet → 24px mobile to keep editorial rhythm tight on small screens.
- **Editorial campaign headline:** desktop 96px → tablet 64px → mobile 48px, line-height stays at 0.9 across all sizes.

### Image Behavior
- Product imagery is responsive at the same 1:1 ratio across all breakpoints — the image scales, the ratio doesn''t.
- Editorial campaign tiles use art-direction crops: a 16:9 wide hero on desktop swaps to a 4:5 portrait on mobile so the figure stays centered and the headline still has burn-in space.
- All non-critical product imagery is lazy-loaded as the user scrolls into the next grid row.

## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry from the front matter and verify every property resolves.
2. Reference component names and tokens directly (`{colors.ink}`, `{component.button-primary-active}`, `{rounded.lg}`) — do not paraphrase color names or radii in prose.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-active`, `-disabled`, `-focused`) — do not bury them inside prose. Nike''s pressed state (`scale(0.5) opacity 0.5`) is intentional and must be its own entry, not a hover stand-in.
5. Default body to `{typography.body-md}`; reach for `{typography.body-strong}` for product names and primary nav links; reserve `{typography.display-campaign}` strictly for hero campaign lockups.
6. Keep `{colors.ink}` scarce per viewport — if more than one solid-black pill or block appears in the same fold, neutralize one to `{component.button-secondary}` or `{component.button-outline-on-image}`.
7. When introducing a new component, ask whether it can be expressed with the existing pill + flat-card + photography-on-`{colors.soft-cloud}` vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.

## Known Gaps

- **Mobile screenshots not captured** — responsive behavior described above synthesizes Nike''s known mobile pattern (hamburger drawer, 1-up grid, headline downscale) from desktop evidence and the breakpoint list extracted from tokens.
- **Hover states not documented** by system policy — Nike''s CSS uses `--pds-color-element-hover` and `--pds-color-text-hover` tokens but these are not included here.
- **Dialog / modal styling** beyond the geo-selector and the country-confirmation pill pair could not be confirmed from the captured surfaces; bag, wishlist, and login overlays are not documented.
- **Form field styling** for checkout, sign-up, and address forms is not present in the captured surfaces — only the search pill is documented.
- **Bag and wishlist** icon-state variants (filled count badges) not visible in the captured pages.
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

Nike''s commerce system is built on a single, almost violently simple idea: photography speaks, the chrome doesn''t. Every page reads as an athletic editorial — towering uppercase Futura display lockups (`{typography.display-campaign}`) burned into full-bleed campaign imagery, with everything else (nav, filters, buttons, cards, footer) reduced to neutral typography and pill geometry on `{colors.canvas}` and `{colors.soft-cloud}`. There is no decorative gradient, no soft shadow nostalgia, no accent color used for "tone" — the system saves all chromatic energy for product photography and the small handful of moments that actually need to signal (sale price `{colors.sale}`, success `{colors.success}`, swatch dots).

The result is a layout that feels physical — campaign hero, product grid, sport tile, footer — stacked like a printed catalog rather than animated like a typical SaaS landing page. Density is high but never crowded, because the system relies on three relentless devices: square or near-square 1:1 product imagery on `{colors.soft-cloud}`, pill-shaped black CTAs (`{rounded.full}`) anchoring every actionable surface, and a tight 8px-base spacing scale that keeps cards and filters mathematically aligned across PLP, PDP, and editorial pages.

Across `/men`, the trail-running listing, the Zegama PDP, `/membership`, and Jordan Golf, the same chrome appears in identical proportions — only the photography and copy change. That is the system''s signature: maximum editorial expression in the imagery, maximum mechanical restraint everywhere else.

**Key Characteristics:**
- Editorial campaign hero with `{typography.display-campaign}` (Nike Futura ND, 96px, line-height 0.9, uppercase) burned directly into full-bleed photography
- Pure black/white/single-gray UI palette: `{colors.ink}`, `{colors.canvas}`, and `{colors.soft-cloud}` carry ~95% of the chrome surface area
- Pill geometry everywhere: every CTA, search field, filter chip, and badge uses `{rounded.full}` (30px) or `{rounded.md}` (24px) — there are no sharp-cornered buttons in the system
- Product cards have zero radius, zero shadow, sit directly on `{colors.soft-cloud}` swatch backgrounds — the photograph is the card
- Two-tone CTA hierarchy: `{component.button-primary}` (black on anything light) versus `{component.button-secondary}` (`{colors.soft-cloud}` on anything bright) — never both at once on the same surface
- 8px spacing system with section rhythm at `{spacing.section}` (48px) creating consistent vertical breathing across PLP, PDP, and editorial pages
- Sale signaling is the only place a non-neutral color appears in retail chrome: `{colors.sale}` price + strike-through original price, no badge background', '{"sourcePath":"docs/design-md/nike/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> **Source pages:** `/men` (primary), `/w/mens-acg-trail-running-shoes-…`, `/t/acg-zegama-…`, `/membership`, `/w/jordan-golf-…`. The chrome palette is identical across all five — only photography varies.

### Brand & Accent
- **Nike Black** (`{colors.ink}` — `#111111`): The brand''s only "color." It is the primary CTA, the swatch dot, the active filter chip, the campaign overlay, the headline color, and the body text. When Nike wants to assert anything, it goes black.
- **Pure White** (`{colors.on-primary}`, `{colors.canvas}` — `#ffffff`): Equal partner to black. Carries every page background, the on-image CTA, and the inverse text on `{colors.ink}` surfaces.

### Surface
- **Soft Cloud** (`{colors.soft-cloud}` — `#f5f5f5`): The most-used non-white surface in the entire system. Product card image backgrounds, search pill, secondary CTA, utility bar, sport-category swatch tiles. It is the "color" of every product photograph''s stage.
- **Hairline** (`{colors.hairline}` — `#cacacb`): 1px dividers between filter rows, footer columns, and PDP disclosure rows.
- **Hairline Soft** (`{colors.hairline-soft}` — `#e5e5e5`): Inset 1px shadow under sticky bars and tab strips, the only "shadow" the system uses.

### Text
- **Ink** (`{colors.ink}` — `#111111`): Primary text on light surfaces — headlines, product names, prices, nav.
- **Charcoal** (`{colors.charcoal}` — `#39393b`): Slightly softer body where ink is too heavy.
- **Ash** (`{colors.ash}` — `#4b4b4d`): Disabled secondary border on dark surfaces and very low-emphasis utility text.
- **Mute** (`{colors.mute}` — `#707072`): Product category subtitles ("Men''s Trail Running Shoes"), footer link text, secondary metadata.
- **Stone** (`{colors.stone}` — `#9e9ea0`): Inverse secondary text on dark surfaces and lowest-emphasis utility text.

### Semantic
- **Sale** (`{colors.sale}` — `#d30005`): Discounted price color and "% off" copy — the only red in the entire retail chrome.
- **Sale Deep** (`{colors.sale-deep}` — `#780700`): Sale price hover/pressed and dark-mode sale anchor.
- **Success** (`{colors.success}` — `#007d48`): Confirmation messages, in-stock indicators, eligibility ticks.
- **Success Bright** (`{colors.success-bright}` — `#1eaa52`): Inverse success on dark surfaces.
- **Info** (`{colors.info}` — `#1151ff`): Informational link/badge accent in member-experience callouts.
- **Info Deep** (`{colors.info-deep}` — `#0034e3`): Pressed state for info accent.

### Category Accents (sport / collection chips)
These appear sparingly — almost exclusively as small chip backgrounds, swatch dots, or category illustrations in editorial tiles. They are never used as text or primary CTA color.
- **Accent Pink** (`{colors.accent-pink}` — `#ed1aa0`): SKIMS / women''s collection moments.
- **Accent Pink Soft** (`{colors.accent-pink-soft}` — `#ffb0dd`): Soft tinting on member-experience tiles.
- **Accent Purple Soft** (`{colors.accent-purple-soft}` — `#beaffd`): Editorial swatch dot, soft category chip.
- **Accent Purple Pale** (`{colors.accent-purple-pale}` — `#d6d1ff`): Lightest soft-tile fill.
- **Accent Teal** (`{colors.accent-teal}` — `#0a7281`): Trail / outdoor / ACG editorial accent in lockups.
- **Accent Pink Deep** (`{colors.accent-pink-deep}` — `#4c012d`): Deepest editorial overlay tint, used as wash on heritage / Jordan tiles.', '{"sourcePath":"docs/design-md/nike/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
- **Nike Futura ND** (display campaign only) — proprietary geometric sans for the towering uppercase headlines burned into campaign hero photography. Falls back to Helvetica Now Text Medium → Helvetica → Arial.
- **Helvetica Now Display Medium** (headings 16–32px) — modern Helvetica cut tuned for display sizes; carries every section title, PDP product name, and dialog headline.
- **Helvetica Now Text Medium** (UI 12–16px) — buttons, captions, swatch labels, badge text. The system''s UI workhorse.
- **Helvetica Now Text** (body and links) — long-form body and underlined inline links.
- **Neue Frutiger Arabic** — RTL pairing for Arabic locales at `{typography.heading-lg}` and caption sizes.
- **Helvetica Neue 9px** — legal-fine-print utility row only (`{typography.utility-xs}`).

When substituting on systems without proprietary Nike fonts: pair **Inter** (Display 700 for body chrome, Display 500 for buttons) with **Bebas Neue** or **Anton** at 96px/0.9 line-height for the campaign headline tier. Tighten letter-spacing slightly (-0.5%) on the substitute to approximate Futura ND''s optical weight.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-campaign}` | 96px | 500 | 0.9 | 0 | Editorial campaign headline burned into hero photography (uppercase) |
| `{typography.heading-xl}` | 32px | 500 | 1.2 | 0 | Section headers — "FEATURED FOOTWEAR", "LATEST IN CLOTHING", PDP product title block |
| `{typography.heading-lg}` | 24px | 500 | 1.2 | 0 | Subsection / member-benefit card title, large CTA label, PDP price |
| `{typography.heading-md}` | 16px | 500 | 1.75 | 0 | Card title, FAQ row label, filter group header |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Body copy, search-pill placeholder, product description |
| `{typography.body-strong}` | 16px | 500 | 1.5 | 0 | Product card name, filter row label, primary nav link |
| `{typography.button-lg}` | 24px | 500 | 1.2 | 0 | Pressed-letter campaign CTA inside hero blocks |
| `{typography.button-md}` | 16px | 500 | 1.5 | 0 | Standard pill CTAs across the system |
| `{typography.button-sm}` | 14px | 500 | 1.5 | 0 | Compact pill CTA, badge label, geo-selector button |
| `{typography.link-md}` | 16px | 500 | 1.75 | 0 | Underlined inline link, "View Product Details" |
| `{typography.caption-md}` | 14px | 500 | 1.5 | 0 | Product subtitle ("Men''s Trail Running Shoes"), filter count, footer link |
| `{typography.caption-sm}` | 12px | 500 | 1.5 | 0 | Filter chip label, badge text, color count |
| `{typography.utility-xs}` | 9px | 500 | 1.75 | 0 | Legal copyright / fine-print row at the very bottom |

### Principles
The system runs on extreme typographic contrast: a single 96px uppercase display tier reserved for editorial campaign moments, and a quiet 12–16px Helvetica Now Text/Medium tier carrying everything else. There is almost no middle ground — the jump from `{typography.heading-xl}` (32px) directly to `{typography.body-strong}` (16px) is intentional and creates the "billboard above, catalog below" effect across every page. Letter-spacing is left at 0 (Futura ND and Helvetica Now are both cut for tight optical fit at scale).

### Note on Font Substitutes
The closest open-source path to Nike''s display tier is **Bebas Neue** (free, geometric condensed) at 96px / 0.9 / uppercase / 500. For UI text, **Inter** is the safest substitute — match weights 400/500 and the system reads almost identically at button and caption sizes.', '{"sourcePath":"docs/design-md/nike/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 8px
- **Tokens (front matter):** `{spacing.xxs}` (2px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (18px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (30px) · `{spacing.section}` (48px+)
- **Universal rhythm:** every page in the set uses `{spacing.section}` (48px) as the vertical gap between major content blocks (campaign hero → trending row → featured row → shop-by-sport → latest-in-clothing → footer). PLP card grids use `{spacing.sm}` (8px) gutters. PDP disclosure rows are stacked at `{spacing.xl}` (24px) vertical padding.
- **Card internal padding:** product cards use 0px internal padding — image is full-bleed; metadata rows sit directly below with `{spacing.sm}` (8px) gap between name, subtitle, and price.

### Grid & Container
- **Max width:** ~1440px content area with edge gutters that grow to ~80px at 1920px (the system lets very wide viewports breathe rather than stretch).
- **Column patterns:** PLP listing uses 3-up at desktop, collapsing to 2-up at 1023px and 1-up at 599px. The men''s home `/men` mixes a 2-up campaign hero row, a 3- or 4-up "Trending Now" row, a horizontal-scroll "Shop by Sport" rail, and a 4-up "Latest in Clothing" thumbnail grid.
- **Filter sidebar:** ~220px fixed-width left rail on PLP at desktop, collapsing into a `Hide Filters` toggle button at narrow widths.

### Whitespace Philosophy
Whitespace is a tool for separation, not for breath. Sections butt directly against each other vertically with `{spacing.section}` rhythm, and product photos tile edge-to-edge inside their grid — there is no padding wrapped around the product image itself. The "air" comes from the `{colors.soft-cloud}` background of the photograph, not from layout margin. Headlines do not have decorative whitespace above them; they sit immediately under the section divider line.', '{"sourcePath":"docs/design-md/nike/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No shadow, no border | Default for cards, buttons, sections — the dominant treatment |
| 1 — Hairline divider | 1px solid `{colors.hairline}` | Filter row separators, footer column borders, PDP disclosure-row separators |
| 2 — Inset bottom-line | `box-shadow: inset 0 -1px 0 {colors.hairline-soft}` | Sticky utility/sub-nav bar bottom edge, tab strip underline |

The system has no drop-shadow elevation in its retail chrome at all. Cards do not lift on the page. The only depth cue is the 1px inset hairline on sticky strips and the contrast between full-bleed photography and `{colors.soft-cloud}` product backdrops.

### Decorative Depth
Depth in Nike''s system comes entirely from photography, not from CSS effects:
- **Editorial campaign tiles** create depth via cinematic perspective — a runner on a trail, a model in a courtyard — with the Futura display headline overlaid in white or `{colors.ink}` directly on the image.
- **Product card photography** is shot on flat `{colors.soft-cloud}` to remove any background depth, so the product itself is the only thing with form on the page.
- **Sport-category tiles** on the home page are full-bleed cinematic photography with a small `{component.button-outline-on-image}` pill anchored at the bottom-left, giving a moment of crisp white pill against atmospheric image.', '{"sourcePath":"docs/design-md/nike/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Cards, campaign tiles, product imagery, navigation, footer — every container in the system |
| `{rounded.sm}` | 18px | Avatar / icon container in member-benefit lockups |
| `{rounded.md}` | 24px | Search pill, search submit, filter input |
| `{rounded.lg}` | 30px | Every CTA pill — primary, secondary, on-image, filter chip, geo-selector, "Notify Me" |
| `{rounded.full}` | 9999px | Color swatch dots and circular icon buttons (back, share, favorite, carousel paddle) |

### Photography Geometry
- **Product cards:** consistent 1:1 square or near-square (~4:5 portrait on tall product crops), full-bleed within the card with no padding, sitting on `{colors.soft-cloud}` backdrop.
- **Editorial campaign hero:** ~16:9 or wider cinematic crop, full-bleed across the content max-width, with the Futura display headline burned into the lower-left or upper-left third.
- **Sport-category rail:** 4:5 portrait full-bleed thumbnails with a small CTA pill anchored bottom-left.
- **PDP main image:** square primary image with vertical thumbnail rail to its left (~5–7 thumbnails stacked at small size), enabling rapid color/angle browsing without leaving the page.
- **Avatar / category icon cards:** centered illustrated icon at ~80–96px on `{colors.canvas}` with `{typography.caption-md}` label below.', '{"sourcePath":"docs/design-md/nike/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only; variants live as separate `components:` entries in the front matter.

### Buttons

**`button-primary`** — the universal Nike CTA
- Background `{colors.ink}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `16px 32px`, height `{spacing.section}` (48px), rounded `{rounded.lg}` (30px pill).
- Used on every primary action in the system: "Sign Up", "Notify Me", "Buy", "Türkiye" geo-confirm, "Shop" overlay on sport tiles, "Continue".
- Pressed state lives in `button-primary-active` — the bg stays `{colors.ink}` while the surface shrinks to `scale(0.5)` with `opacity: 0.5` (Nike''s signature "tap collapse" feedback that''s extracted across all five pages).

**`button-secondary`** — soft alternative on light surfaces
- Background `{colors.soft-cloud}`, text `{colors.ink}`, type `{typography.button-md}`, padding `16px 32px`, rounded `{rounded.lg}`.
- Used as the lower-emphasis alternate when a primary CTA already exists, e.g., "United States" geo-decline next to the black "Türkiye" confirm; "Cancel" or "Discover More" on light cards.

**`button-outline-on-image`** — overlay CTA on photography
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.lg}`.
- The crisp white pill that anchors the bottom-left of every full-bleed sport-category and editorial campaign tile.

**`button-icon-circular`** — chrome icon controls
- Background `{colors.soft-cloud}` or transparent, icon `{colors.ink}`, rounded `{rounded.full}`, size 40px.
- Used for back-arrow, carousel paddle (left/right), wishlist heart, share, and "Hide Filters" toggle.

**`filter-chip`** + **`filter-chip-active`**
- Default: background `{colors.canvas}`, text `{colors.ink}`, 1px hairline `{colors.hairline}`, type `{typography.button-md}`, rounded `{rounded.lg}`, padding `8px 16px`.
- Active: background `{colors.ink}`, text `{colors.on-primary}` — the chip flips fully inverted when selected. No middle state.

### Inputs & Forms

**`search-pill`** + **`search-pill-focused`**
- Default: background `{colors.soft-cloud}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}` (24px), padding `8px 16px`, height `40px`. Anchored to the right of the primary nav with a small magnifier icon.
- Focused: background `{colors.canvas}`, 2px solid border `{colors.ink}`, with a 12px outer halo of `{colors.soft-cloud}` (the system''s only "focus ring" effect). The pill shape stays `{rounded.md}` so the halo reads as a soft glove, not a hard outline.

### Cards & Containers

**`product-card`**
- Container: background `{colors.canvas}`, rounded `{rounded.none}`, padding 0, no shadow.
- Image area: `{component.product-card-image}` — full-bleed product photo on `{colors.soft-cloud}` square.
- Below image (in this order with `{spacing.sm}` between): swatch dot row (3–6 dots at 12px circular), promo badge if applicable (`{component.badge-promo}` "Just In", "Coming Soon", "Recycled Materials"), product name `{typography.body-strong}` `{colors.ink}`, category subtitle `{typography.caption-md}` `{colors.mute}`, price row.
- Price row: regular price `{typography.body-strong}` `{colors.ink}`. If on sale: discounted price `{colors.sale}` followed by strike-through original `{colors.mute}` followed by "% off" in `{colors.sale}`.

**`campaign-tile`** — the brand''s signature editorial unit
- Full-bleed photography with `{typography.display-campaign}` headline burned in (uppercase, 96px, line-height 0.9).
- Headline color is whichever of `{colors.canvas}` or `{colors.ink}` reads against the underlying image — not parameterized; chosen per-asset.
- A single `{component.button-outline-on-image}` pill anchored bottom-left of the tile carries the call-to-action.

**`category-icon-card`**
- Container: background `{colors.canvas}`, rounded `{rounded.none}`.
- Centered category illustration (~80px) + label `{typography.caption-md}` `{colors.ink}` directly below. Used in the "Latest in Clothing" 4–8-up icon strip on `/men`.

**`member-benefit-card`**
- Full-bleed photographic card on a dark image background; copy slot at the bottom-left with `{typography.heading-lg}` headline `{colors.on-primary}` and a `{component.button-outline-on-image}` "Explore" pill below.
- Used in the `/membership` "Member Benefits" 3-up grid.

**`swatch-dot`** + **`swatch-dot-active`**
- 12px circle, rounded `{rounded.full}`, no border in default state. Renders the colorway options on every product card and PDP color picker.
- Default: filled with the colorway''s actual product color (extracted at runtime from the product image), 1px subtle outer ring in `{colors.hairline}` for white/light colorways so they remain visible on `{colors.canvas}`.
- Active: identical fill with a 2px `{colors.ink}` outer ring and 2px white interior gap, creating Nike''s signature concentric-ring "selected" state. No size change between default and active.

**`badge-promo`**
- Background `{colors.canvas}` with 1px hairline `{colors.hairline}`, text `{colors.ink}`, type `{typography.caption-sm}`, rounded `{rounded.lg}`, padding `4px 12px`.
- Sits on top of product imagery (top-left of card) with copy like "Just In", "Coming Soon", "Recycled Materials", "Member Exclusive".

**`badge-sale-text`**
- Inline price-row text in `{colors.sale}` with no background — the only "badge" in the system that has no container.

### Navigation

**`utility-bar`** — top utility strip
- Background `{colors.soft-cloud}`, text `{colors.ink}`, type `{typography.caption-sm}`, height ~36px, rounded `{rounded.none}`.
- Right-aligned cluster: "Find a Store · Help · Join Us · Sign In". Always present; never collapses.

**`primary-nav`** — main navigation
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-strong}` for nav links, height 56–64px, rounded `{rounded.none}`.
- Layout: Nike swoosh logo at left (32×32), centered nav row ("New & Featured · Men · Women · Kids · Jordan · Nike SKIMS · Sport"), right cluster (search pill, wishlist heart icon, bag icon).
- The active section gets a 2px-bottom underline in `{colors.ink}` — no background fill.

**Sub-nav strip** (PLP) — appears under primary nav with breadcrumb + sort + hide-filters controls.
- Same `{colors.canvas}` background with a 1px inset hairline-soft bottom edge.
- Left: breadcrumb in `{typography.caption-md}` `{colors.mute}` separated by " / ".
- Right: "Hide Filters" toggle + "Sort By: …" dropdown — both in `{typography.button-md}` with chevron icons.

**Top Nav (Mobile)**
- Hamburger menu icon (left), Nike swoosh (center), search + bag icons (right).
- Search pill collapses into an icon-only button at narrow widths; tapping expands a full-width overlay search pill with `{rounded.md}`.
- Primary nav collapses into a full-height drawer that slides in from the left, listing nav rows top-down with `{spacing.xl}` vertical padding.

### Signature Components

**`pdp-disclosure-row`** — PDP information accordion rows
- Stacked rows for "View Product Details", "Shipping & Returns", "Reviews (n)" with `{spacing.xl}` vertical padding and a 1px `{colors.hairline}` divider below each.
- Label `{typography.body-strong}` `{colors.ink}` left-aligned; chevron `{colors.ink}` right-aligned.

**`faq-row`** — `/membership` FAQ accordion
- Identical pattern to `pdp-disclosure-row` but with `{typography.heading-md}` label weight; 1px `{colors.hairline}` divider below each.

**`filter-sidebar`** — PLP left rail
- Container `{colors.canvas}`, rounded `{rounded.none}`.
- Section headers `{typography.body-strong}` `{colors.ink}` with `{spacing.lg}` (18px) vertical gap between groups.
- Active filters get a 1px ink underline; counts in parentheses use `{colors.mute}`.

**`footer`**
- Background `{colors.canvas}` with a single 1px `{colors.hairline}` top divider.
- Four columns: Resources / Help / Company / Promotions & Discounts, each with column header `{typography.body-strong}` `{colors.ink}` and link list `{typography.caption-md}` `{colors.mute}`.
- Below the columns: a horizontal rule, then a fine-print row with `{typography.utility-xs}` `{colors.mute}` (copyright, locale switcher, terms, privacy, supply-chain act).', '{"sourcePath":"docs/design-md/nike/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{typography.display-campaign}` exclusively for editorial campaign hero lockups — never use 96px Futura for section headers or product titles.
- Use `{component.button-primary}` (`{colors.ink}` pill) as the single primary action per viewport. Pair it at most with `{component.button-secondary}` (`{colors.soft-cloud}` pill) for a soft alternative.
- Stage every product photograph on `{colors.soft-cloud}` — the gray is the system''s "studio."
- Keep all CTAs pill-shaped at `{rounded.lg}` (30px). Never introduce a square or `{rounded.sm}` button.
- Use `{colors.sale}` only on price rows — never on backgrounds, badges, or chrome.
- Stack content sections at `{spacing.section}` (48px) rhythm with no decorative dividers between them; the photography''s bleed-edge is the divider.
- Anchor on-image CTAs with `{component.button-outline-on-image}` (white pill) at bottom-left — the system''s universal "shop this image" position.

### Don''t
- Don''t introduce drop shadows or card elevation. Cards sit flat on the page; the only depth cue is the 1px inset hairline on sticky bars.
- Don''t use any of the category accent colors (`{colors.accent-pink}`, `{colors.accent-purple-soft}`, `{colors.accent-teal}`) for primary chrome — they belong to swatch dots, soft tile fills, and editorial moments only.
- Don''t replace `{colors.ink}` with a near-black gray like `{colors.charcoal}` for a CTA — Nike''s primary pill is true `#111111`.
- Don''t pad inside product cards. The image is full-bleed; metadata sits directly below with `{spacing.sm}` (8px) between rows.
- Don''t put two campaign-tile lockups in the same row at the same scale — Nike alternates a single full-bleed editorial tile with a 2-up or 4-up product/category grid.
- Don''t underline anything other than `{typography.link-md}` inline links and the active primary-nav indicator. Buttons, headings, and prices stay un-underlined.
- Don''t introduce a third button shape. Pill or icon-circular — that''s the entire button shape vocabulary.', '{"sourcePath":"docs/design-md/nike/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Content max-width holds at ~1440px; outer gutters grow to ~80px on each side |
| desktop-large | 1440px | Default desktop layout — 3-up product grid, 4-up clothing strip, full primary nav |
| desktop | 1200px | Same as large with slightly narrower outer gutters |
| desktop-small | 1024px | Filter sidebar starts compressing; sport rail shows ~3 visible tiles |
| tablet | 1023–961px | 3-up PLP collapses to 2-up; "Hide Filters" becomes a default toggle |
| tablet-narrow | 960–640px | Primary nav center cluster collapses to a hamburger drawer; search pill becomes icon-only |
| mobile-landscape | 639–600px | 2-up PLP collapses to 1-up; product cards become full-width with image and metadata stacking |
| mobile | 599–320px | Single-column everything; campaign tiles render at full screen width with shorter Futura sizes (~64px) |

### Touch Targets
All interactive elements meet WCAG AAA (44×44px minimum). Pills (`{component.button-primary}`, `{component.button-secondary}`) sit at 48px height with 32px horizontal padding. Icon-circular buttons (`{component.button-icon-circular}`) sit at 40px — Nike''s PDP carousel paddle and wishlist heart sit just under AAA but above AA at 40×40, with hit-target padding extending the tappable area to 48px+. Filter-chip pills are 40px height with 16px padding.

### Collapsing Strategy
- **Primary nav:** desktop center cluster → mobile drawer triggered by hamburger at left of the swoosh.
- **PLP grid:** 3-up → 2-up → 1-up at 1023, 599, and below; gutters drop from `{spacing.sm}` to `{spacing.xs}` on mobile.
- **Filter sidebar:** 220px fixed → "Hide Filters" toggle → off-canvas full-screen filter drawer at mobile.
- **Sport rail:** desktop horizontal scroll with ~5 visible → mobile horizontal scroll with ~1.5 visible (peek-next-card pattern).
- **Section spacing:** `{spacing.section}` 48px desktop → 32px tablet → 24px mobile to keep editorial rhythm tight on small screens.
- **Editorial campaign headline:** desktop 96px → tablet 64px → mobile 48px, line-height stays at 0.9 across all sizes.

### Image Behavior
- Product imagery is responsive at the same 1:1 ratio across all breakpoints — the image scales, the ratio doesn''t.
- Editorial campaign tiles use art-direction crops: a 16:9 wide hero on desktop swaps to a 4:5 portrait on mobile so the figure stays centered and the headline still has burn-in space.
- All non-critical product imagery is lazy-loaded as the user scrolls into the next grid row.', '{"sourcePath":"docs/design-md/nike/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry from the front matter and verify every property resolves.
2. Reference component names and tokens directly (`{colors.ink}`, `{component.button-primary-active}`, `{rounded.lg}`) — do not paraphrase color names or radii in prose.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-active`, `-disabled`, `-focused`) — do not bury them inside prose. Nike''s pressed state (`scale(0.5) opacity 0.5`) is intentional and must be its own entry, not a hover stand-in.
5. Default body to `{typography.body-md}`; reach for `{typography.body-strong}` for product names and primary nav links; reserve `{typography.display-campaign}` strictly for hero campaign lockups.
6. Keep `{colors.ink}` scarce per viewport — if more than one solid-black pill or block appears in the same fold, neutralize one to `{component.button-secondary}` or `{component.button-outline-on-image}`.
7. When introducing a new component, ask whether it can be expressed with the existing pill + flat-card + photography-on-`{colors.soft-cloud}` vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.', '{"sourcePath":"docs/design-md/nike/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- **Mobile screenshots not captured** — responsive behavior described above synthesizes Nike''s known mobile pattern (hamburger drawer, 1-up grid, headline downscale) from desktop evidence and the breakpoint list extracted from tokens.
- **Hover states not documented** by system policy — Nike''s CSS uses `--pds-color-element-hover` and `--pds-color-text-hover` tokens but these are not included here.
- **Dialog / modal styling** beyond the geo-selector and the country-confirmation pill pair could not be confirmed from the captured surfaces; bag, wishlist, and login overlays are not documented.
- **Form field styling** for checkout, sign-up, and address forms is not present in the captured surfaces — only the search pill is documented.
- **Bag and wishlist** icon-state variants (filled count badges) not visible in the captured pages.', '{"sourcePath":"docs/design-md/nike/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_1', '#111111', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_3', '#f5f5f5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_4', '#39393b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_5', '#4b4b4d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_6', '#707072', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_7', '#9e9ea0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_8', '#cacacb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_9', '#e5e5e5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_10', '#d30005', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_11', '#780700', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_12', '#007d48', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_13', '#1eaa52', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_14', '#1151ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_15', '#0034e3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_16', '#ed1aa0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_17', '#ffb0dd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_18', '#beaffd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_19', '#d6d1ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_20', '#0a7281', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md'), 'color', 'color_21', '#4c012d', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/nike/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/nike/DESIGN.md';


-- Nintendo 2001
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Nintendo 2001', 'nintendo-2001', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/nintendo-2001/DESIGN.md', null, 'seeded', '---
version: alpha
name: Nintendo.com (2001) Analysis
description: An analysis of Nintendo.com''s 2001 design language — a brushed-periwinkle "console chrome" interface where every panel is a beveled metal plate, navigation glows amber over a halftone-dotted carbon bar, and bold outlined display type sits on circuit-board hero fields. A Y2K hardware aesthetic that treats the web page like the faceplate of a game system.

colors:
  primary: "#e60012"          # Nintendo Red — racetrack logo, alert
  signal: "#f68d1f"           # Signal Orange — forward cues, submit, "Play It On"
  amber: "#ecab37"            # Amber — utility buttons, info-box tabs, badges
  nav-gold: "#e48600"         # Nav Gold — top-nav menu links
  canvas: "#7a8aba"           # Periwinkle metallic — primary interface body
  canvas-soft: "#9fbee7"      # Pale Sky — secondary-nav strip, light inset panels
  sky: "#9fbee7"              # Pale Sky alias
  lavender: "#acace7"         # Pale Lavender — home hero field
  ice: "#c0d5e6"              # Pale Ice — news hero field
  periwinkle: "#8ba1d4"       # Light Periwinkle — raised mid panels
  chrome-indigo: "#3d4f97"    # Chrome Indigo — beveled borders, tab edges
  muted-indigo: "#60619c"     # Muted Indigo — inactive tabs, secondary chrome
  platinum: "#dedede"         # Platinum Gray — list-row / inset content surface
  surface: "#ffffff"          # White — content cards, list-row highlight
  carbon: "#21242e"           # Carbon Navy — nav bar, dark buttons, footer, ink
  hairline: "#5a5f8c"         # blended bevel divider
  ink: "#21242e"              # primary text on light
  ink-soft: "#3d4f97"         # secondary text / chrome labels
  on-primary: "#ffffff"       # text on dark/red/orange chrome
  systems-teal: "#206479"     # Systems hero circuit-board cyan
  games-red: "#a7282b"        # Games F-1 racing hero
  error: "#e60012"            # validation / destructive (shares brand red)

typography:
  nav-link:
    fontFamily: Arial
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.5px
  ui-label:
    fontFamily: Arial
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0.5px
  display:
    fontFamily: Arial Black
    fontSize: 44px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: 0
  hero-tagline:
    fontFamily: Arial
    fontSize: 15px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  body:
    fontFamily: Arial
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  link:
    fontFamily: Arial
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0
  micro:
    fontFamily: Arial
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  lg: 10px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  section: 48px

components:
  nav-bar:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.nav-gold}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
    padding: "{spacing.sm}"
    height: 28px
  subnav-strip:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.ui-label}"
    rounded: "{rounded.none}"
    padding: "{spacing.xs}"
  logo-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.display}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.carbon}"
    typography: "{typography.ui-label}"
    rounded: "{rounded.xs}"
    padding: "{spacing.md}"
  button-primary-pressed:
    backgroundColor: "{colors.nav-gold}"
    textColor: "{colors.carbon}"
    typography: "{typography.ui-label}"
    rounded: "{rounded.xs}"
    padding: "{spacing.md}"
  button-submit:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.on-primary}"
    typography: "{typography.ui-label}"
    rounded: "{rounded.xs}"
    padding: "{spacing.lg}"
  button-secondary:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.on-primary}"
    typography: "{typography.ui-label}"
    rounded: "{rounded.none}"
    padding: "{spacing.md}"
  button-icon-arrow:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    size: 22px
  button-arrow-chip:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xs}"
    padding: "{spacing.xs}"
    size: 18px
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: "{spacing.xs}"
    height: 20px
  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: "{spacing.xs}"
    height: 20px
  select-dropdown:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: "{spacing.xs}"
    height: 24px
  field-label:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.link}"
    rounded: "{rounded.none}"
    padding: "{spacing.xxs}"
  form-panel:
    backgroundColor: "{colors.platinum}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  dotted-divider:
    backgroundColor: "{colors.muted-indigo}"
    textColor: "{colors.muted-indigo}"
    rounded: "{rounded.none}"
    height: 1px
  hero-panel:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.surface}"
    typography: "{typography.display}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  section-label-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.ui-label}"
    rounded: "{rounded.none}"
    padding: "{spacing.sm}"
  news-row:
    backgroundColor: "{colors.platinum}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.link}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  featured-tile:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.on-primary}"
    typography: "{typography.micro}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs}"
  poll-panel:
    backgroundColor: "{colors.periwinkle}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  radio-option:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    size: 12px
  info-box:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
  promo-card:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
  system-tile:
    backgroundColor: "{colors.periwinkle}"
    textColor: "{colors.ink}"
    typography: "{typography.ui-label}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  link-row-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  calendar-widget:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.micro}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  left-rail-tab:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.canvas-soft}"
    typography: "{typography.ui-label}"
    rounded: "{rounded.none}"
    padding: "{spacing.xs}"
  footer-bar:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.canvas-soft}"
    typography: "{typography.micro}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  esrb-badge:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.carbon}"
    typography: "{typography.micro}"
    rounded: "{rounded.xs}"
    padding: "{spacing.xxs}"
  esrb-rating-square:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.carbon}"
    typography: "{typography.ui-label}"
    rounded: "{rounded.xs}"
    size: 20px
  mascot-bubble:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.carbon}"
    typography: "{typography.micro}"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm}"

  # ─── Examples (illustrative) — kit-mirror demonstration surfaces ───
  ex-pricing-tier:
    description: "Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  ex-pricing-tier-featured:
    description: "Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode)."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  ex-product-selector:
    description: "What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery)."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  ex-cart-drawer:
    description: "Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart)."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
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
    headerTypography: "{typography.ui-label}"
    bodyTypography: "{typography.body}"
    cellPadding: "{spacing.xs} {spacing.sm}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as feature-card with elevated shadow."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  ex-empty-state-card:
    description: "Empty-state illustration frame."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    captionTypography: "{typography.body}"
  ex-toast:
    description: "Toast notification surface — feature-card shape + medium shadow."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    typography: "{typography.body}"

---


## Overview

Nintendo.com circa 2001 is the web rendered as **console hardware**. Where most sites of the era reached for either grunge texture or corporate gradients, this interface builds itself out of **brushed-periwinkle metal plates** — every region is a discrete beveled panel, edge-lit with a brighter highlight on top and a `{colors.chrome-indigo}` shadow line beneath, as if stamped from the same injection-molded plastic as a Game Boy. The whole page reads as one machine faceplate: a body of `{colors.canvas}` periwinkle chrome carrying inset modules, with the corners of the largest panels physically **chamfered** (cut at 45°) rather than rounded, reinforcing the manufactured-object feeling.

The system runs on a tight three-voice contrast. The structural voice is the cool periwinkle-to-indigo chrome (`{colors.canvas}`, `{colors.periwinkle}`, `{colors.chrome-indigo}`). The authority voice is `{colors.carbon}` carbon-navy — the top navigation bar, the right-rail action buttons, and the footer, all near-black slabs printed with a faint **halftone dot-matrix texture** that evokes a speaker grille. The energy voice is warm and reserved for one job only: telling you where to go. `{colors.nav-gold}` lights the primary menu words, `{colors.amber}` fills the utility chips and badges, and `{colors.signal}` orange marks every "forward" cue — the round arrow buttons, the chevron chips beside each headline, the Submit button. Warmth in this system always means *action*; the cool chrome never carries it.

Atmosphere comes from the **hero fields**, which break the periwinkle calm with full-bleed product photography over textured backdrops — a circuit-board cyan on Systems, a motion-blurred racetrack red on Games, a soft lavender wash on Home — each topped with chunky `{typography.display}` wordmarks rendered in white with a heavy outline and hard drop shadow, the visual signature of game-box cover type. A pixel-eared Mario leans in from the masthead with a "Welcome to Nintendo.com!" speech bubble, anchoring the entire machine to the brand''s playful character voice.

**Key Characteristics:**
- Every UI region is a **beveled metal plate** in `{colors.canvas}` periwinkle, edge-lit on top and shadow-lined with `{colors.chrome-indigo}` below — the page is assembled, not laid out.
- **Chamfered (cut-corner) panel geometry** on the largest modules; most chrome is sharp-edged (`{rounded.none}`), with rounding reserved for the logo pill, radio dots, and circle-arrow badges (`{rounded.full}`).
- A **carbon-navy command layer** (`{colors.carbon}`) with halftone-dot texture carries the top nav, right-rail buttons, and footer.
- Warmth is rationed as **directional signal only**: `{colors.nav-gold}` for menu words, `{colors.amber}` for utility chips/badges, `{colors.signal}` for every forward/Submit cue.
- **Photographic hero fields** cycle a page-specific accent tint (`{colors.lavender}` home → `{colors.systems-teal}` systems → `{colors.games-red}` games) under outlined `{typography.display}` box-art wordmarks.
- A dense, **modular grid** — masthead, dual nav bars, hero, then a two-thirds content column of stacked list/feature panels beside a one-third right action rail — packed with minimal whitespace.
- **Character-led**: the Mario mascot speech-bubble masthead and ESRB badge frame the chrome with brand personality and regulatory trust marks.

## Colors

The palette is a **cool metallic chassis with rationed warm signal**. Read it as three layers: the periwinkle chrome that everything is built from, the carbon command slabs, and the warm wayfinding accents that are the only saturated color in the steady-state interface.

### Brand & Accent
- **Nintendo Red** (`{colors.primary}` — #e60012): The racetrack logo wordmark and the brand''s anchor hue. Used sparingly as pure brand identity and doubled as the validation/alert color. Never a surface fill outside the logo plate.
- **Signal Orange** (`{colors.signal}` — #f68d1f): The "go forward" color. Fills every round arrow button, every chevron chip beside a headline, the Submit button, and the "Play It On" platform badges. If something advances you, it is orange.
- **Amber** (`{colors.amber}` — #ecab37): Utility energy. Fills the Code Bank / Game Finder / Go chips, the info-box header tabs, the sweepstakes stars, and the ESRB Privacy-Certified badge. Distinguished from Signal Orange by being more golden and reserved for *tools and marks* rather than *forward motion*.
- **Nav Gold** (`{colors.nav-gold}` — #e48600): The deeper orange-gold reserved exclusively for the primary navigation words (Games, Systems, News, Nsider, Downloads) glowing on the carbon bar.

### Surface
- **Periwinkle Metallic** (`{colors.canvas}` — #7a8aba): The primary interface body — the brushed-metal chrome that every module is inset into.
- **Light Periwinkle** (`{colors.periwinkle}` — #8ba1d4): Raised mid panels (poll panel, system tiles) — one step brighter than canvas for elevation.
- **Pale Sky** (`{colors.sky}` / `{colors.canvas-soft}` — #9fbee7): The secondary-nav strip and light inset panel fills.
- **Pale Lavender** (`{colors.lavender}` — #acace7): The home hero field and side promo cards.
- **Pale Ice** (`{colors.ice}` — #c0d5e6): The News hero panel field.
- **Chrome Indigo** (`{colors.chrome-indigo}` — #3d4f97): The beveled border / shadow line under every plate, and the leading angled edge of nav tabs.
- **Muted Indigo** (`{colors.muted-indigo}` — #60619c): Inactive tabs and recessed chrome.
- **Platinum Gray** (`{colors.platinum}` — #dedede): The list-row and inset content surface — news headlines and archive rows sit on this cool platinum.
- **White** (`{colors.surface}` — #ffffff): Content cards, form fields, the logo pill, and list-row highlight.

### Text
- **Carbon Navy** (`{colors.ink}` — #21242e): Primary text on light chrome, and the fill of the dark command layer (nav bar, rail buttons, footer).
- **Chrome Indigo** (`{colors.ink-soft}` — #3d4f97): Secondary text and small-caps chrome labels.
- **White** (`{colors.on-primary}` — #ffffff): Text on carbon, red, and orange chrome.

### Semantic
- **Error / Alert** (`{colors.error}` — #e60012): Validation and destructive states reuse the brand red.
- **Systems Teal** (`{colors.systems-teal}` — #206479): Page-accent tint — the Systems hero''s circuit-board cyan field.
- **Games Red** (`{colors.games-red}` — #a7282b): Page-accent tint — the Games hero''s motion-blurred racetrack field.

## Typography

### Font Family
The era''s web-safe reality is **Arial / Helvetica** throughout — there are no webfonts. The system gets its character not from typeface choice but from *treatment*: tight uppercase tracking on every chrome label, and a heavy outlined-and-shadowed display style for hero wordmarks that mimics console box-art logotype. Body copy is plain small Arial; links are the same family at bold weight in `{colors.ink-soft}`.

The micro-labels (vertical left-rail tabs, footer fine print) render with the soft pixelation characteristic of small bitmap-rendered Arial of the period — for a faithful reproduction, pair Arial with a pixel face such as **Silkscreen** or **VT323** at the 10–11px label sizes.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display}` | 44px | 900 | 1 | 0 | Hero box-art wordmarks (white, heavy outline + hard drop shadow) |
| `{typography.hero-tagline}` | 15px | 700 | 1.3 | 0 | Hero supporting line ("Gorgeous graphics, great sound…") |
| `{typography.nav-link}` | 13px | 700 | 1 | 0.5px | Primary nav menu words, uppercase |
| `{typography.ui-label}` | 11px | 700 | 1.1 | 0.5px | Section header labels, panel titles, button text — uppercase |
| `{typography.link}` | 12px | 700 | 1.4 | 0 | News headline links, "Read More" |
| `{typography.body}` | 12px | 400 | 1.4 | 0 | Descriptions, poll text, info-box copy |
| `{typography.micro}` | 10px | 400 | 1.3 | 0 | Footer copyright, calendar cells, fine print |

### Principles
- **Uppercase + tracking is the chrome voice.** Every structural label — nav words, panel headers ("Official News", "Featured Sites", "Player''s Poll"), button text — is uppercase Arial Bold with a half-pixel of tracking. It reads like silkscreened legends on a controller.
- **Display type is outlined, never flat.** Hero wordmarks always carry a thick contrasting outline and a hard offset shadow so they pop off the photographic field — the box-art convention.
- **Body stays small and quiet.** At 12px, descriptive copy never competes with the chrome; the hierarchy is carried entirely by the labels and the photography.

### Note on Font Substitutes
Arial is freely available system-wide and needs no substitute. To recreate the period bitmap rendering of micro-labels, layer a pixel font (**Silkscreen**, **VT323**, or **Press Start 2P** for the chunkiest legends) at 10–11px and disable anti-aliasing. The display wordmarks are bespoke logotypes; the closest open substitute is **Archivo Black** (italicized) or **Arial Black** with a CSS text-stroke outline and `text-shadow` offset.

## Layout

### Spacing System
- **Base unit**: 8px (`{spacing.sm}`) — the gutter rhythm between list rows and grid cells.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.section}` 48px
- Panels carry **12px interior padding** (`{spacing.md}`); larger content modules use **16px** (`{spacing.lg}`). Inter-module gaps run 16–24px. The layout is deliberately dense — whitespace is a structural seam between plates, not a luxury.

### Grid & Container
- **Fixed-width canvas** ~780–830px wide (a desktop-era fixed table layout, centered). No fluid scaling — the interface is sized to a single target window like an application.
- **Masthead row**: Mario mascot + speech bubble (left) and search module (right) float above the chrome.
- **Dual nav bars**: a carbon primary bar (logo + 5 section words + Code Bank / Game Finder utility chips) stacked over a periwinkle secondary strip (Parents, Customer Service, Corporate, Global, Privacy, Store, Contact).
- **Body**: a full-width hero panel, then a **two-column split** — a ~two-thirds content column of stacked panels (Official News list, Featured Sites 2×2 grid, etc.) beside a ~one-third **right action rail** (Login / Subscribe / Newsletter / Help buttons, an info box, a side promo card).
- **Left rail**: a thin vertical strip of rotated tabs (Top Ten, Top Rentals, Player''s Choice, ESRB Ratings) clipped to the chrome edge.

### Whitespace Philosophy
Empty space is **engineered seam**, not breathing room. Modules butt against each other separated by thin `{colors.chrome-indigo}` bevel lines and a few pixels of canvas, so the eye reads grouped plates. The density is intentional: it makes the page feel like a packed control panel where everything is one click away.

### Responsive Strategy

#### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Desktop (only) | ~780–830px fixed | The native, sole target — a fixed-width application-style layout |
| Narrow window | < 780px | Horizontal scroll (no reflow); the table layout does not collapse |

This is a **pre-responsive, fixed-canvas** design. It was authored for a single desktop window size and does not reflow. A faithful *modern* re-implementation would preserve the fixed chrome metaphor on desktop and, below ~720px, stack the right action rail beneath the content column and collapse the dual nav bars into a single carbon bar with a disclosure toggle.

#### Touch Targets
Not a consideration in the original (mouse-only era); buttons and chips are 18–28px tall. A modern port must enlarge the `{components.button-primary}`, `{components.button-icon-arrow}`, and `{components.radio-option}` hit areas to a 44×44px minimum.

#### Collapsing Strategy
On a modern narrow viewport: dual nav bars → single carbon bar + menu disclosure; two-column body → single stacked column with the right rail moving below content; the left rotated-tab strip → a horizontal scroll chip row or removed; fixed hero → fluid full-bleed hero retaining the outlined wordmark.

#### Image Behavior
Hero fields are **full-bleed photographic plates** clipped to the panel''s beveled rectangle; featured-site and game tiles are fixed-pixel thumbnails (~95×60px) in a tight grid. No lazy loading (era predates it). Product renders sit on textured backdrops rather than transparent cutouts.

## Elevation & Depth

Depth in this system is **physical bevel simulation**, not soft shadow. There is no blurred drop-shadow vocabulary; instead every plate is given the illusion of being a raised piece of molded plastic.

| Level | Treatment | Use |
|---|---|---|
| 0 — Inset | Recessed into canvas; darker `{colors.chrome-indigo}` top edge, lighter bottom edge | List rows, form fields, the canvas body itself |
| 1 — Plate | Flush panel; lighter top highlight, `{colors.chrome-indigo}` shadow line beneath | Content panels, system tiles, info box |
| 2 — Raised chip | Beveled button with bright top edge + hard bottom shadow | Utility chips, Go/Submit buttons, nav tabs |
| 3 — Command slab | `{colors.carbon}` near-black with halftone texture, sits "above" the chrome | Top nav bar, right-rail buttons, footer |

### Decorative Depth
Depth is also carried by **texture and photography**: the halftone dot-matrix on carbon slabs reads as a recessed speaker grille; hero fields use motion-blur, circuit-board patterns, and product renders with their own cast shadows to create literal pictorial depth; chamfered corners on the outer chrome suggest a machined faceplate edge. The left-rail rotated tabs appear to tuck *behind* the main chrome, a small but effective layered cue.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | The default — nav bar, footer, most chrome plates (sharp / chamfered, not rounded) |
| `{rounded.xs}` | 2px | Utility buttons, form fields, badges |
| `{rounded.sm}` | 4px | Small panels, featured tiles, list rows |
| `{rounded.md}` | 6px | Content panels, hero panel |
| `{rounded.lg}` | 10px | Outer section panels, mascot bubble |
| `{rounded.full}` | 9999px | Logo racetrack pill, radio dots, circle-arrow badges |

The signature is **sharpness with rationed roundness**. The chrome is hard-edged and frequently *chamfered* (corners cut at 45° rather than curved) — this is the manufactured-faceplate look. Roundness appears only where it signals a physical control: the fully-pill logo, the round radio buttons, and the round Signal-Orange arrow badges. A modern reproduction should resist the urge to soften every corner; the tension between sharp plates and the few pill elements is the whole character.

### Photography Geometry
Hero photography fills beveled rectangles at roughly 4:1 (banner) and 16:9 proportions, full-bleed within the panel. Featured-site and game thumbnails are near-4:3 fixed tiles (~95×60px) framed by a 1–2px `{colors.chrome-indigo}` edge with `{rounded.sm}` corners. The mascot is a transparent cutout overlapping the masthead, breaking the rectangular grid for personality.

## Components

> No hover states are documented. Each spec below covers Default and (where extracted) Pressed/Active. Variants live as separate `components:` entries.

### Navigation

**`nav-bar`** — Primary top navigation
- `{colors.carbon}` slab with a faint halftone-dot texture, ~28px tall, carrying the `{components.logo-pill}` at left, the five `{colors.nav-gold}` section words in `{typography.nav-link}` uppercase, and the amber Code Bank / Game Finder utility chips at right. Sharp corners (`{rounded.none}`), `{spacing.sm}` padding.

**`subnav-strip`** — Secondary navigation
- A `{colors.canvas-soft}` pale-sky strip directly beneath the nav bar, carrying utility links (Parents, Customer Service, Corporate, Global, Privacy, Store, Contact) in `{typography.ui-label}` `{colors.ink}`, separated by thin dividers. Sharp, `{spacing.xs}` padding.

**`left-rail-tab`** — Rotated section tabs
- A thin vertical strip of `{colors.carbon}` tabs (Top Ten, Top Rentals, Player''s Choice, ESRB Ratings) with vertically-rotated `{typography.ui-label}` text in `{colors.canvas-soft}`, clipped to the left chrome edge. Sharp corners, `{spacing.xs}` padding.

### Brand & Masthead

**`logo-pill`** — Nintendo racetrack logo
- The wordmark in `{colors.primary}` red set inside a white `{rounded.full}` racetrack pill, outlined. Sits at the left of the nav bar. `{spacing.xs}` padding.

**`mascot-bubble`** — Mario welcome speech bubble
- A white `{rounded.lg}` rounded-rectangle speech bubble with a tail, carrying "Welcome to Nintendo.com!" in `{typography.micro}` `{colors.carbon}`, paired with the Mario cutout in the masthead. `{spacing.sm}` padding.

### Buttons

**`button-primary`** — Amber utility / Go chip
- `{colors.amber}` fill, `{colors.carbon}` text in `{typography.ui-label}`, `{rounded.xs}` corners, `{spacing.md}` padding, with a beveled top highlight. The everyday tool button (Code Bank, Game Finder, Go).
- Pressed state in **`button-primary-pressed`** — fill deepens to `{colors.nav-gold}`.

**`button-submit`** — Forward / Submit
- `{colors.signal}` orange fill, `{colors.on-primary}` white text in `{typography.ui-label}`, `{rounded.xs}`, `{spacing.lg}` padding. The "commit" action (poll Submit, Go on archives).

**`button-secondary`** — Right-rail action button
- `{colors.carbon}` near-black slab, `{colors.on-primary}` white text in `{typography.ui-label}`, sharp `{rounded.none}` corners, `{spacing.md}` padding, with a small leading icon. Used for Login / Subscribe / Newsletter / Help in the right rail.

**`button-icon-arrow`** — Round forward arrow
- A 22px `{colors.signal}` orange `{rounded.full}` disc with a white chevron — the primary "go" affordance on hero panels and section links.

**`button-arrow-chip`** — Headline chevron chip
- An 18px `{colors.signal}` orange `{rounded.xs}` chip with a white forward chevron, sitting at the right end of each `{components.news-row}` to advance to the article.

### Inputs & Forms

**`search-field`** — Masthead search input
- White `{colors.surface}` field, `{colors.ink}` text in `{typography.body}`, `{rounded.xs}` corners, 1px `{colors.hairline}` border, ~20px tall, paired with an "All" category dropdown and an amber Go chip.

**`text-input`** — Generic text field
- Same chassis as `search-field`: white fill, `{colors.ink}` text, `{rounded.xs}`, `{colors.hairline}` 1px border, `{spacing.xs}` padding. Used in the Login form (Username / Password / E-mail), news-archive keyword, and date fields.

**`select-dropdown`** — Native select ("Click to choose")
- A white `{colors.surface}` field with `{colors.ink}` text in `{typography.body}`, `{rounded.xs}` corners, and a hard 1px `{colors.carbon}` border (sharper than the inputs) closing on a beveled native dropdown-chevron button at the right edge. ~24px tall, `{spacing.xs}` padding. Used for the Register form''s Month / Year pickers.

**`field-label`** — Inline form label
- A bold `{colors.ink}` label in `{typography.link}` (Arial Bold 12px) sitting left of its input (Username, Password, E-mail, Month, Year). `{rounded.none}`, `{spacing.xxs}` padding.

**`radio-option`** — Poll radio button
- A 12px white `{rounded.full}` radio dot with a `{colors.hairline}` ring, paired with `{typography.body}` option text. Used in the Player''s Poll.

**`form-panel`** — Form container (Login / Register)
- A `{colors.platinum}` light-gray `{rounded.md}` panel holding a form, capped by a `{components.section-label-bar}` header (≡ LOG IN / ≡ REGISTER). `{spacing.lg}` interior. The Login page pairs two side by side.

**`dotted-divider`** — Dotted hairline rule
- A 1px dotted `{colors.muted-indigo}` separator rule used between form sub-sections (the "Note:" line, "Forgot Your Password?"). A recurring Y2K-chrome detail — dotted rather than solid.

### Cards & Panels

**`hero-panel`** — Photographic hero plate
- A `{rounded.md}` beveled rectangle filled with full-bleed product photography over a page-tinted field (`{colors.lavender}` / `{colors.systems-teal}` / `{colors.games-red}`), topped with an outlined `{typography.display}` wordmark and a `{components.button-icon-arrow}` call-to-action. `{spacing.lg}` interior.

**`section-label-bar`** — Panel header
- A `{colors.canvas}` header strip with a small grid/list glyph and an uppercase `{typography.ui-label}` title ("Official News", "Featured Sites", "Player''s Poll"). Sharp corners, `{spacing.sm}` padding. Caps every content module.

**`news-row`** — Headline list row
- A `{colors.platinum}` `{rounded.sm}` row with a small category icon, a `{typography.link}` headline in `{colors.ink-soft}`, and a trailing `{components.button-arrow-chip}`. `{spacing.sm}` padding. Stacked into the Official News / Other Headlines lists.

**`featured-tile`** — Featured-site thumbnail
- A `{colors.carbon}`-framed `{rounded.sm}` tile (~95×60px) holding a screenshot thumbnail with a `{typography.micro}` URL caption (e.g. www.pokemon.com). Tight `{spacing.xxs}` padding, arranged in a 2×2 grid.

**`poll-panel`** — Player''s Poll module
- A `{colors.periwinkle}` raised `{rounded.md}` panel posing a question, listing `{components.radio-option}` choices, and closing with a `{components.button-submit}`. `{spacing.md}` interior.

**`info-box`** — "What Is" explainer card
- A white `{colors.surface}` `{rounded.sm}` card with an amber header tab ("What Is — Game Finder") and `{typography.body}` explanatory copy. `{spacing.md}` padding. Sits in the right rail.

**`promo-card`** — Side product promo
- A `{colors.lavender}` `{rounded.sm}` card carrying an outlined product wordmark (e.g. Game Boy Advance) over a small product render, in the right rail. `{spacing.md}` padding.

**`system-tile`** — Hardware grid tile (Systems page)
- A `{colors.periwinkle}` `{rounded.sm}` tile holding a console render over a circuit-board backdrop with an outlined system name (Nintendo 64, Super Nintendo, Game Boy). `{spacing.sm}` padding, arranged in a 2×3 grid.

**`link-row-card`** — Utility link card (Systems page)
- A white `{rounded.sm}` card with an amber label tab (Technical Help, Store Locator, Online Store), a character icon, and a one-line `{typography.body}` description. `{spacing.sm}` padding.

**`calendar-widget`** — Month calendar (News page)
- A white `{rounded.sm}` grid calendar in `{typography.micro}`, with a `{colors.carbon}` caption header (e.g. "June 01"), highlighted event dates, and a month-select dropdown. `{spacing.sm}` padding.

### Badges & Footer

**`esrb-badge`** — ESRB Privacy-Certified mark
- A small `{colors.amber}` `{rounded.xs}` badge reading "ESRB — Privacy Certified" in `{typography.micro}` `{colors.carbon}`, pinned in the footer.

**`esrb-rating-square`** — Game content-rating square
- A 20px white `{rounded.xs}` square stamping the content-rating letter (E, T) in `{typography.ui-label}` `{colors.carbon}`, on each game card.

**`footer-bar`** — Page footer
- A `{colors.carbon}` chamfered slab with the "©1997–2001 Nintendo…" copyright in `{typography.micro}` `{colors.canvas-soft}`, the ESRB badge, and a privacy link. Sharp corners, `{spacing.lg}` padding.

### Examples (illustrative)

> Kit-mirror demonstration surfaces. Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently.

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
- Build every region as a **beveled plate**: a `{colors.canvas}` body with a brighter top edge and a `{colors.chrome-indigo}` shadow line beneath. The "assembled machine" feel depends on it.
- Reserve warm color for **wayfinding only** — `{colors.nav-gold}` for nav words, `{colors.amber}` for utility/badges, `{colors.signal}` for forward/Submit. Cool chrome never carries action color.
- Keep structural labels **uppercase Arial Bold with 0.5px tracking** (`{typography.ui-label}`) — it is the silkscreen-legend voice of the whole system.
- Render hero wordmarks as **outlined + drop-shadowed `{typography.display}`** over full-bleed photographic fields tinted per page.
- Use `{colors.carbon}` with halftone texture for the **command layer** (nav, right rail, footer) to separate "system controls" from "content."
- Let panels **butt together** with thin bevel seams; density is the intended texture.
- Default corners to **sharp/chamfered** (`{rounded.none}`); spend roundness only on the logo pill, radio dots, and circle-arrow badges.

### Don''t
- Don''t soften every corner — turning the sharp chrome into a uniformly rounded card system erases the manufactured-faceplate identity.
- Don''t introduce a **soft blurred drop-shadow** elevation language; depth here is hard bevels and pictorial photography, not Material elevation.
- Don''t let `{colors.signal}` and `{colors.amber}` bleed into decorative use — warm color must always mean "act here."
- Don''t add accent colors outside the page-tint heroes (`{colors.systems-teal}`, `{colors.games-red}`); the steady-state chrome is strictly cool periwinkle + carbon.
- Don''t widen body copy or whitespace into an airy modern layout; the packed, fixed-canvas density is the brand.
- Don''t flatten the dual-nav structure (gold primary words over the pale secondary strip) into one bar — the layered command hierarchy is signature.
- Don''t render hero or system wordmarks as flat text; without the outline + shadow they lose the box-art reference entirely.
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

Nintendo.com circa 2001 is the web rendered as **console hardware**. Where most sites of the era reached for either grunge texture or corporate gradients, this interface builds itself out of **brushed-periwinkle metal plates** — every region is a discrete beveled panel, edge-lit with a brighter highlight on top and a `{colors.chrome-indigo}` shadow line beneath, as if stamped from the same injection-molded plastic as a Game Boy. The whole page reads as one machine faceplate: a body of `{colors.canvas}` periwinkle chrome carrying inset modules, with the corners of the largest panels physically **chamfered** (cut at 45°) rather than rounded, reinforcing the manufactured-object feeling.

The system runs on a tight three-voice contrast. The structural voice is the cool periwinkle-to-indigo chrome (`{colors.canvas}`, `{colors.periwinkle}`, `{colors.chrome-indigo}`). The authority voice is `{colors.carbon}` carbon-navy — the top navigation bar, the right-rail action buttons, and the footer, all near-black slabs printed with a faint **halftone dot-matrix texture** that evokes a speaker grille. The energy voice is warm and reserved for one job only: telling you where to go. `{colors.nav-gold}` lights the primary menu words, `{colors.amber}` fills the utility chips and badges, and `{colors.signal}` orange marks every "forward" cue — the round arrow buttons, the chevron chips beside each headline, the Submit button. Warmth in this system always means *action*; the cool chrome never carries it.

Atmosphere comes from the **hero fields**, which break the periwinkle calm with full-bleed product photography over textured backdrops — a circuit-board cyan on Systems, a motion-blurred racetrack red on Games, a soft lavender wash on Home — each topped with chunky `{typography.display}` wordmarks rendered in white with a heavy outline and hard drop shadow, the visual signature of game-box cover type. A pixel-eared Mario leans in from the masthead with a "Welcome to Nintendo.com!" speech bubble, anchoring the entire machine to the brand''s playful character voice.

**Key Characteristics:**
- Every UI region is a **beveled metal plate** in `{colors.canvas}` periwinkle, edge-lit on top and shadow-lined with `{colors.chrome-indigo}` below — the page is assembled, not laid out.
- **Chamfered (cut-corner) panel geometry** on the largest modules; most chrome is sharp-edged (`{rounded.none}`), with rounding reserved for the logo pill, radio dots, and circle-arrow badges (`{rounded.full}`).
- A **carbon-navy command layer** (`{colors.carbon}`) with halftone-dot texture carries the top nav, right-rail buttons, and footer.
- Warmth is rationed as **directional signal only**: `{colors.nav-gold}` for menu words, `{colors.amber}` for utility chips/badges, `{colors.signal}` for every forward/Submit cue.
- **Photographic hero fields** cycle a page-specific accent tint (`{colors.lavender}` home → `{colors.systems-teal}` systems → `{colors.games-red}` games) under outlined `{typography.display}` box-art wordmarks.
- A dense, **modular grid** — masthead, dual nav bars, hero, then a two-thirds content column of stacked list/feature panels beside a one-third right action rail — packed with minimal whitespace.
- **Character-led**: the Mario mascot speech-bubble masthead and ESRB badge frame the chrome with brand personality and regulatory trust marks.', '{"sourcePath":"docs/design-md/nintendo-2001/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

The palette is a **cool metallic chassis with rationed warm signal**. Read it as three layers: the periwinkle chrome that everything is built from, the carbon command slabs, and the warm wayfinding accents that are the only saturated color in the steady-state interface.

### Brand & Accent
- **Nintendo Red** (`{colors.primary}` — #e60012): The racetrack logo wordmark and the brand''s anchor hue. Used sparingly as pure brand identity and doubled as the validation/alert color. Never a surface fill outside the logo plate.
- **Signal Orange** (`{colors.signal}` — #f68d1f): The "go forward" color. Fills every round arrow button, every chevron chip beside a headline, the Submit button, and the "Play It On" platform badges. If something advances you, it is orange.
- **Amber** (`{colors.amber}` — #ecab37): Utility energy. Fills the Code Bank / Game Finder / Go chips, the info-box header tabs, the sweepstakes stars, and the ESRB Privacy-Certified badge. Distinguished from Signal Orange by being more golden and reserved for *tools and marks* rather than *forward motion*.
- **Nav Gold** (`{colors.nav-gold}` — #e48600): The deeper orange-gold reserved exclusively for the primary navigation words (Games, Systems, News, Nsider, Downloads) glowing on the carbon bar.

### Surface
- **Periwinkle Metallic** (`{colors.canvas}` — #7a8aba): The primary interface body — the brushed-metal chrome that every module is inset into.
- **Light Periwinkle** (`{colors.periwinkle}` — #8ba1d4): Raised mid panels (poll panel, system tiles) — one step brighter than canvas for elevation.
- **Pale Sky** (`{colors.sky}` / `{colors.canvas-soft}` — #9fbee7): The secondary-nav strip and light inset panel fills.
- **Pale Lavender** (`{colors.lavender}` — #acace7): The home hero field and side promo cards.
- **Pale Ice** (`{colors.ice}` — #c0d5e6): The News hero panel field.
- **Chrome Indigo** (`{colors.chrome-indigo}` — #3d4f97): The beveled border / shadow line under every plate, and the leading angled edge of nav tabs.
- **Muted Indigo** (`{colors.muted-indigo}` — #60619c): Inactive tabs and recessed chrome.
- **Platinum Gray** (`{colors.platinum}` — #dedede): The list-row and inset content surface — news headlines and archive rows sit on this cool platinum.
- **White** (`{colors.surface}` — #ffffff): Content cards, form fields, the logo pill, and list-row highlight.

### Text
- **Carbon Navy** (`{colors.ink}` — #21242e): Primary text on light chrome, and the fill of the dark command layer (nav bar, rail buttons, footer).
- **Chrome Indigo** (`{colors.ink-soft}` — #3d4f97): Secondary text and small-caps chrome labels.
- **White** (`{colors.on-primary}` — #ffffff): Text on carbon, red, and orange chrome.

### Semantic
- **Error / Alert** (`{colors.error}` — #e60012): Validation and destructive states reuse the brand red.
- **Systems Teal** (`{colors.systems-teal}` — #206479): Page-accent tint — the Systems hero''s circuit-board cyan field.
- **Games Red** (`{colors.games-red}` — #a7282b): Page-accent tint — the Games hero''s motion-blurred racetrack field.', '{"sourcePath":"docs/design-md/nintendo-2001/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The era''s web-safe reality is **Arial / Helvetica** throughout — there are no webfonts. The system gets its character not from typeface choice but from *treatment*: tight uppercase tracking on every chrome label, and a heavy outlined-and-shadowed display style for hero wordmarks that mimics console box-art logotype. Body copy is plain small Arial; links are the same family at bold weight in `{colors.ink-soft}`.

The micro-labels (vertical left-rail tabs, footer fine print) render with the soft pixelation characteristic of small bitmap-rendered Arial of the period — for a faithful reproduction, pair Arial with a pixel face such as **Silkscreen** or **VT323** at the 10–11px label sizes.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display}` | 44px | 900 | 1 | 0 | Hero box-art wordmarks (white, heavy outline + hard drop shadow) |
| `{typography.hero-tagline}` | 15px | 700 | 1.3 | 0 | Hero supporting line ("Gorgeous graphics, great sound…") |
| `{typography.nav-link}` | 13px | 700 | 1 | 0.5px | Primary nav menu words, uppercase |
| `{typography.ui-label}` | 11px | 700 | 1.1 | 0.5px | Section header labels, panel titles, button text — uppercase |
| `{typography.link}` | 12px | 700 | 1.4 | 0 | News headline links, "Read More" |
| `{typography.body}` | 12px | 400 | 1.4 | 0 | Descriptions, poll text, info-box copy |
| `{typography.micro}` | 10px | 400 | 1.3 | 0 | Footer copyright, calendar cells, fine print |

### Principles
- **Uppercase + tracking is the chrome voice.** Every structural label — nav words, panel headers ("Official News", "Featured Sites", "Player''s Poll"), button text — is uppercase Arial Bold with a half-pixel of tracking. It reads like silkscreened legends on a controller.
- **Display type is outlined, never flat.** Hero wordmarks always carry a thick contrasting outline and a hard offset shadow so they pop off the photographic field — the box-art convention.
- **Body stays small and quiet.** At 12px, descriptive copy never competes with the chrome; the hierarchy is carried entirely by the labels and the photography.

### Note on Font Substitutes
Arial is freely available system-wide and needs no substitute. To recreate the period bitmap rendering of micro-labels, layer a pixel font (**Silkscreen**, **VT323**, or **Press Start 2P** for the chunkiest legends) at 10–11px and disable anti-aliasing. The display wordmarks are bespoke logotypes; the closest open substitute is **Archivo Black** (italicized) or **Arial Black** with a CSS text-stroke outline and `text-shadow` offset.', '{"sourcePath":"docs/design-md/nintendo-2001/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 8px (`{spacing.sm}`) — the gutter rhythm between list rows and grid cells.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.section}` 48px
- Panels carry **12px interior padding** (`{spacing.md}`); larger content modules use **16px** (`{spacing.lg}`). Inter-module gaps run 16–24px. The layout is deliberately dense — whitespace is a structural seam between plates, not a luxury.

### Grid & Container
- **Fixed-width canvas** ~780–830px wide (a desktop-era fixed table layout, centered). No fluid scaling — the interface is sized to a single target window like an application.
- **Masthead row**: Mario mascot + speech bubble (left) and search module (right) float above the chrome.
- **Dual nav bars**: a carbon primary bar (logo + 5 section words + Code Bank / Game Finder utility chips) stacked over a periwinkle secondary strip (Parents, Customer Service, Corporate, Global, Privacy, Store, Contact).
- **Body**: a full-width hero panel, then a **two-column split** — a ~two-thirds content column of stacked panels (Official News list, Featured Sites 2×2 grid, etc.) beside a ~one-third **right action rail** (Login / Subscribe / Newsletter / Help buttons, an info box, a side promo card).
- **Left rail**: a thin vertical strip of rotated tabs (Top Ten, Top Rentals, Player''s Choice, ESRB Ratings) clipped to the chrome edge.

### Whitespace Philosophy
Empty space is **engineered seam**, not breathing room. Modules butt against each other separated by thin `{colors.chrome-indigo}` bevel lines and a few pixels of canvas, so the eye reads grouped plates. The density is intentional: it makes the page feel like a packed control panel where everything is one click away.

### Responsive Strategy

#### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Desktop (only) | ~780–830px fixed | The native, sole target — a fixed-width application-style layout |
| Narrow window | < 780px | Horizontal scroll (no reflow); the table layout does not collapse |

This is a **pre-responsive, fixed-canvas** design. It was authored for a single desktop window size and does not reflow. A faithful *modern* re-implementation would preserve the fixed chrome metaphor on desktop and, below ~720px, stack the right action rail beneath the content column and collapse the dual nav bars into a single carbon bar with a disclosure toggle.

#### Touch Targets
Not a consideration in the original (mouse-only era); buttons and chips are 18–28px tall. A modern port must enlarge the `{components.button-primary}`, `{components.button-icon-arrow}`, and `{components.radio-option}` hit areas to a 44×44px minimum.

#### Collapsing Strategy
On a modern narrow viewport: dual nav bars → single carbon bar + menu disclosure; two-column body → single stacked column with the right rail moving below content; the left rotated-tab strip → a horizontal scroll chip row or removed; fixed hero → fluid full-bleed hero retaining the outlined wordmark.

#### Image Behavior
Hero fields are **full-bleed photographic plates** clipped to the panel''s beveled rectangle; featured-site and game tiles are fixed-pixel thumbnails (~95×60px) in a tight grid. No lazy loading (era predates it). Product renders sit on textured backdrops rather than transparent cutouts.', '{"sourcePath":"docs/design-md/nintendo-2001/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

Depth in this system is **physical bevel simulation**, not soft shadow. There is no blurred drop-shadow vocabulary; instead every plate is given the illusion of being a raised piece of molded plastic.

| Level | Treatment | Use |
|---|---|---|
| 0 — Inset | Recessed into canvas; darker `{colors.chrome-indigo}` top edge, lighter bottom edge | List rows, form fields, the canvas body itself |
| 1 — Plate | Flush panel; lighter top highlight, `{colors.chrome-indigo}` shadow line beneath | Content panels, system tiles, info box |
| 2 — Raised chip | Beveled button with bright top edge + hard bottom shadow | Utility chips, Go/Submit buttons, nav tabs |
| 3 — Command slab | `{colors.carbon}` near-black with halftone texture, sits "above" the chrome | Top nav bar, right-rail buttons, footer |

### Decorative Depth
Depth is also carried by **texture and photography**: the halftone dot-matrix on carbon slabs reads as a recessed speaker grille; hero fields use motion-blur, circuit-board patterns, and product renders with their own cast shadows to create literal pictorial depth; chamfered corners on the outer chrome suggest a machined faceplate edge. The left-rail rotated tabs appear to tuck *behind* the main chrome, a small but effective layered cue.', '{"sourcePath":"docs/design-md/nintendo-2001/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | The default — nav bar, footer, most chrome plates (sharp / chamfered, not rounded) |
| `{rounded.xs}` | 2px | Utility buttons, form fields, badges |
| `{rounded.sm}` | 4px | Small panels, featured tiles, list rows |
| `{rounded.md}` | 6px | Content panels, hero panel |
| `{rounded.lg}` | 10px | Outer section panels, mascot bubble |
| `{rounded.full}` | 9999px | Logo racetrack pill, radio dots, circle-arrow badges |

The signature is **sharpness with rationed roundness**. The chrome is hard-edged and frequently *chamfered* (corners cut at 45° rather than curved) — this is the manufactured-faceplate look. Roundness appears only where it signals a physical control: the fully-pill logo, the round radio buttons, and the round Signal-Orange arrow badges. A modern reproduction should resist the urge to soften every corner; the tension between sharp plates and the few pill elements is the whole character.

### Photography Geometry
Hero photography fills beveled rectangles at roughly 4:1 (banner) and 16:9 proportions, full-bleed within the panel. Featured-site and game thumbnails are near-4:3 fixed tiles (~95×60px) framed by a 1–2px `{colors.chrome-indigo}` edge with `{rounded.sm}` corners. The mascot is a transparent cutout overlapping the masthead, breaking the rectangular grid for personality.', '{"sourcePath":"docs/design-md/nintendo-2001/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> No hover states are documented. Each spec below covers Default and (where extracted) Pressed/Active. Variants live as separate `components:` entries.

### Navigation

**`nav-bar`** — Primary top navigation
- `{colors.carbon}` slab with a faint halftone-dot texture, ~28px tall, carrying the `{components.logo-pill}` at left, the five `{colors.nav-gold}` section words in `{typography.nav-link}` uppercase, and the amber Code Bank / Game Finder utility chips at right. Sharp corners (`{rounded.none}`), `{spacing.sm}` padding.

**`subnav-strip`** — Secondary navigation
- A `{colors.canvas-soft}` pale-sky strip directly beneath the nav bar, carrying utility links (Parents, Customer Service, Corporate, Global, Privacy, Store, Contact) in `{typography.ui-label}` `{colors.ink}`, separated by thin dividers. Sharp, `{spacing.xs}` padding.

**`left-rail-tab`** — Rotated section tabs
- A thin vertical strip of `{colors.carbon}` tabs (Top Ten, Top Rentals, Player''s Choice, ESRB Ratings) with vertically-rotated `{typography.ui-label}` text in `{colors.canvas-soft}`, clipped to the left chrome edge. Sharp corners, `{spacing.xs}` padding.

### Brand & Masthead

**`logo-pill`** — Nintendo racetrack logo
- The wordmark in `{colors.primary}` red set inside a white `{rounded.full}` racetrack pill, outlined. Sits at the left of the nav bar. `{spacing.xs}` padding.

**`mascot-bubble`** — Mario welcome speech bubble
- A white `{rounded.lg}` rounded-rectangle speech bubble with a tail, carrying "Welcome to Nintendo.com!" in `{typography.micro}` `{colors.carbon}`, paired with the Mario cutout in the masthead. `{spacing.sm}` padding.

### Buttons

**`button-primary`** — Amber utility / Go chip
- `{colors.amber}` fill, `{colors.carbon}` text in `{typography.ui-label}`, `{rounded.xs}` corners, `{spacing.md}` padding, with a beveled top highlight. The everyday tool button (Code Bank, Game Finder, Go).
- Pressed state in **`button-primary-pressed`** — fill deepens to `{colors.nav-gold}`.

**`button-submit`** — Forward / Submit
- `{colors.signal}` orange fill, `{colors.on-primary}` white text in `{typography.ui-label}`, `{rounded.xs}`, `{spacing.lg}` padding. The "commit" action (poll Submit, Go on archives).

**`button-secondary`** — Right-rail action button
- `{colors.carbon}` near-black slab, `{colors.on-primary}` white text in `{typography.ui-label}`, sharp `{rounded.none}` corners, `{spacing.md}` padding, with a small leading icon. Used for Login / Subscribe / Newsletter / Help in the right rail.

**`button-icon-arrow`** — Round forward arrow
- A 22px `{colors.signal}` orange `{rounded.full}` disc with a white chevron — the primary "go" affordance on hero panels and section links.

**`button-arrow-chip`** — Headline chevron chip
- An 18px `{colors.signal}` orange `{rounded.xs}` chip with a white forward chevron, sitting at the right end of each `{components.news-row}` to advance to the article.

### Inputs & Forms

**`search-field`** — Masthead search input
- White `{colors.surface}` field, `{colors.ink}` text in `{typography.body}`, `{rounded.xs}` corners, 1px `{colors.hairline}` border, ~20px tall, paired with an "All" category dropdown and an amber Go chip.

**`text-input`** — Generic text field
- Same chassis as `search-field`: white fill, `{colors.ink}` text, `{rounded.xs}`, `{colors.hairline}` 1px border, `{spacing.xs}` padding. Used in the Login form (Username / Password / E-mail), news-archive keyword, and date fields.

**`select-dropdown`** — Native select ("Click to choose")
- A white `{colors.surface}` field with `{colors.ink}` text in `{typography.body}`, `{rounded.xs}` corners, and a hard 1px `{colors.carbon}` border (sharper than the inputs) closing on a beveled native dropdown-chevron button at the right edge. ~24px tall, `{spacing.xs}` padding. Used for the Register form''s Month / Year pickers.

**`field-label`** — Inline form label
- A bold `{colors.ink}` label in `{typography.link}` (Arial Bold 12px) sitting left of its input (Username, Password, E-mail, Month, Year). `{rounded.none}`, `{spacing.xxs}` padding.

**`radio-option`** — Poll radio button
- A 12px white `{rounded.full}` radio dot with a `{colors.hairline}` ring, paired with `{typography.body}` option text. Used in the Player''s Poll.

**`form-panel`** — Form container (Login / Register)
- A `{colors.platinum}` light-gray `{rounded.md}` panel holding a form, capped by a `{components.section-label-bar}` header (≡ LOG IN / ≡ REGISTER). `{spacing.lg}` interior. The Login page pairs two side by side.

**`dotted-divider`** — Dotted hairline rule
- A 1px dotted `{colors.muted-indigo}` separator rule used between form sub-sections (the "Note:" line, "Forgot Your Password?"). A recurring Y2K-chrome detail — dotted rather than solid.

### Cards & Panels

**`hero-panel`** — Photographic hero plate
- A `{rounded.md}` beveled rectangle filled with full-bleed product photography over a page-tinted field (`{colors.lavender}` / `{colors.systems-teal}` / `{colors.games-red}`), topped with an outlined `{typography.display}` wordmark and a `{components.button-icon-arrow}` call-to-action. `{spacing.lg}` interior.

**`section-label-bar`** — Panel header
- A `{colors.canvas}` header strip with a small grid/list glyph and an uppercase `{typography.ui-label}` title ("Official News", "Featured Sites", "Player''s Poll"). Sharp corners, `{spacing.sm}` padding. Caps every content module.

**`news-row`** — Headline list row
- A `{colors.platinum}` `{rounded.sm}` row with a small category icon, a `{typography.link}` headline in `{colors.ink-soft}`, and a trailing `{components.button-arrow-chip}`. `{spacing.sm}` padding. Stacked into the Official News / Other Headlines lists.

**`featured-tile`** — Featured-site thumbnail
- A `{colors.carbon}`-framed `{rounded.sm}` tile (~95×60px) holding a screenshot thumbnail with a `{typography.micro}` URL caption (e.g. www.pokemon.com). Tight `{spacing.xxs}` padding, arranged in a 2×2 grid.

**`poll-panel`** — Player''s Poll module
- A `{colors.periwinkle}` raised `{rounded.md}` panel posing a question, listing `{components.radio-option}` choices, and closing with a `{components.button-submit}`. `{spacing.md}` interior.

**`info-box`** — "What Is" explainer card
- A white `{colors.surface}` `{rounded.sm}` card with an amber header tab ("What Is — Game Finder") and `{typography.body}` explanatory copy. `{spacing.md}` padding. Sits in the right rail.

**`promo-card`** — Side product promo
- A `{colors.lavender}` `{rounded.sm}` card carrying an outlined product wordmark (e.g. Game Boy Advance) over a small product render, in the right rail. `{spacing.md}` padding.

**`system-tile`** — Hardware grid tile (Systems page)
- A `{colors.periwinkle}` `{rounded.sm}` tile holding a console render over a circuit-board backdrop with an outlined system name (Nintendo 64, Super Nintendo, Game Boy). `{spacing.sm}` padding, arranged in a 2×3 grid.

**`link-row-card`** — Utility link card (Systems page)
- A white `{rounded.sm}` card with an amber label tab (Technical Help, Store Locator, Online Store), a character icon, and a one-line `{typography.body}` description. `{spacing.sm}` padding.

**`calendar-widget`** — Month calendar (News page)
- A white `{rounded.sm}` grid calendar in `{typography.micro}`, with a `{colors.carbon}` caption header (e.g. "June 01"), highlighted event dates, and a month-select dropdown. `{spacing.sm}` padding.

### Badges & Footer

**`esrb-badge`** — ESRB Privacy-Certified mark
- A small `{colors.amber}` `{rounded.xs}` badge reading "ESRB — Privacy Certified" in `{typography.micro}` `{colors.carbon}`, pinned in the footer.

**`esrb-rating-square`** — Game content-rating square
- A 20px white `{rounded.xs}` square stamping the content-rating letter (E, T) in `{typography.ui-label}` `{colors.carbon}`, on each game card.

**`footer-bar`** — Page footer
- A `{colors.carbon}` chamfered slab with the "©1997–2001 Nintendo…" copyright in `{typography.micro}` `{colors.canvas-soft}`, the ESRB badge, and a privacy link. Sharp corners, `{spacing.lg}` padding.

### Examples (illustrative)

> Kit-mirror demonstration surfaces. Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently.

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
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`', '{"sourcePath":"docs/design-md/nintendo-2001/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Build every region as a **beveled plate**: a `{colors.canvas}` body with a brighter top edge and a `{colors.chrome-indigo}` shadow line beneath. The "assembled machine" feel depends on it.
- Reserve warm color for **wayfinding only** — `{colors.nav-gold}` for nav words, `{colors.amber}` for utility/badges, `{colors.signal}` for forward/Submit. Cool chrome never carries action color.
- Keep structural labels **uppercase Arial Bold with 0.5px tracking** (`{typography.ui-label}`) — it is the silkscreen-legend voice of the whole system.
- Render hero wordmarks as **outlined + drop-shadowed `{typography.display}`** over full-bleed photographic fields tinted per page.
- Use `{colors.carbon}` with halftone texture for the **command layer** (nav, right rail, footer) to separate "system controls" from "content."
- Let panels **butt together** with thin bevel seams; density is the intended texture.
- Default corners to **sharp/chamfered** (`{rounded.none}`); spend roundness only on the logo pill, radio dots, and circle-arrow badges.

### Don''t
- Don''t soften every corner — turning the sharp chrome into a uniformly rounded card system erases the manufactured-faceplate identity.
- Don''t introduce a **soft blurred drop-shadow** elevation language; depth here is hard bevels and pictorial photography, not Material elevation.
- Don''t let `{colors.signal}` and `{colors.amber}` bleed into decorative use — warm color must always mean "act here."
- Don''t add accent colors outside the page-tint heroes (`{colors.systems-teal}`, `{colors.games-red}`); the steady-state chrome is strictly cool periwinkle + carbon.
- Don''t widen body copy or whitespace into an airy modern layout; the packed, fixed-canvas density is the brand.
- Don''t flatten the dual-nav structure (gold primary words over the pale secondary strip) into one bar — the layered command hierarchy is signature.
- Don''t render hero or system wordmarks as flat text; without the outline + shadow they lose the box-art reference entirely.', '{"sourcePath":"docs/design-md/nintendo-2001/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_1', '#e60012', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_2', '#f68d1f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_3', '#ecab37', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_4', '#e48600', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_5', '#7a8aba', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_6', '#9fbee7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_7', '#acace7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_8', '#c0d5e6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_9', '#8ba1d4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_10', '#3d4f97', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_11', '#60619c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_12', '#dedede', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_13', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_14', '#21242e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_15', '#5a5f8c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_16', '#206479', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'color', 'color_17', '#a7282b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md'), 'typography', 'font_1', 'fontFamily: Arial', 'primary_detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/nintendo-2001/DESIGN.md';


-- Notion
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Notion', 'notion', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/notion/DESIGN.md', null, 'seeded', '---
version: alpha
name: Notion-design-analysis
description: Notion presents itself as the all-in-one workspace through a confident, illustration-rich brand voice — anchored by a deep navy hero band ({colors.brand-navy}) decorated with brand-colored sticky-note dots and mesh wire illustrations, a signature purple pill primary CTA ({colors.primary}), and a rich palette of pastel-tinted feature cards that echo the colorful database properties of the live product. The system uses a Notion-Sans (Inter-based) typeface across every UI surface, anchors a 4-tier pricing comparison (Free / Plus / Business / Enterprise), and presents the live workspace UI mockup directly inside the hero band. Coverage spans homepage, Enterprise, Product AI, Product Agents, Startups, and Pricing surfaces.

colors:
  primary: "#5645d4"
  primary-pressed: "#4534b3"
  primary-deep: "#3a2a99"
  on-primary: "#ffffff"
  brand-navy: "#0a1530"
  brand-navy-deep: "#070f24"
  brand-navy-mid: "#1a2a52"
  link-blue: "#0075de"
  link-blue-pressed: "#005bab"
  brand-orange: "#dd5b00"
  brand-orange-deep: "#793400"
  brand-pink: "#ff64c8"
  brand-pink-deep: "#a02e6d"
  brand-purple: "#7b3ff2"
  brand-purple-300: "#d6b6f6"
  brand-purple-800: "#391c57"
  brand-teal: "#2a9d99"
  brand-green: "#1aae39"
  brand-yellow: "#f5d75e"
  brand-brown: "#523410"
  card-tint-peach: "#ffe8d4"
  card-tint-rose: "#fde0ec"
  card-tint-mint: "#d9f3e1"
  card-tint-lavender: "#e6e0f5"
  card-tint-sky: "#dcecfa"
  card-tint-yellow: "#fef7d6"
  card-tint-yellow-bold: "#f9e79f"
  card-tint-cream: "#f8f5e8"
  card-tint-gray: "#f0eeec"
  canvas: "#ffffff"
  surface: "#f6f5f4"
  surface-soft: "#fafaf9"
  hairline: "#e5e3df"
  hairline-soft: "#ede9e4"
  hairline-strong: "#c8c4be"
  ink-deep: "#000000"
  ink: "#1a1a1a"
  charcoal: "#37352f"
  slate: "#5d5b54"
  steel: "#787671"
  stone: "#a4a097"
  muted: "#bbb8b1"
  on-dark: "#ffffff"
  on-dark-muted: "#a4a097"
  semantic-success: "#1aae39"
  semantic-warning: "#dd5b00"
  semantic-error: "#e03131"

typography:
  hero-display:
    fontFamily: Notion Sans
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -2px
  display-lg:
    fontFamily: Notion Sans
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1px
  heading-1:
    fontFamily: Notion Sans
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.5px
  heading-2:
    fontFamily: Notion Sans
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.5px
  heading-3:
    fontFamily: Notion Sans
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
  heading-4:
    fontFamily: Notion Sans
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.30
  heading-5:
    fontFamily: Notion Sans
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.40
  subtitle:
    fontFamily: Notion Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
  body-md:
    fontFamily: Notion Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-md-medium:
    fontFamily: Notion Sans
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.55
  body-sm:
    fontFamily: Notion Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  body-sm-medium:
    fontFamily: Notion Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.50
  caption:
    fontFamily: Notion Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  caption-bold:
    fontFamily: Notion Sans
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.40
  micro:
    fontFamily: Notion Sans
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.40
  micro-uppercase:
    fontFamily: Notion Sans
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: 1px
  button-md:
    fontFamily: Notion Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.30

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 20px
  xxxl: 24px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section-sm: 48px
  section: 64px
  section-lg: 96px
  hero: 120px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.muted}"
  button-dark:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
    border: "1px solid {colors.hairline-strong}"
  button-on-dark:
    backgroundColor: "{colors.on-dark}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-secondary-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
    border: "1px solid {colors.on-dark-muted}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.link-blue}"
    typography: "{typography.body-sm-medium}"
    padding: "0"
  card-base:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-feature:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  card-feature-yellow-bold:
    backgroundColor: "{colors.card-tint-yellow-bold}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-peach:
    backgroundColor: "{colors.card-tint-peach}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-rose:
    backgroundColor: "{colors.card-tint-rose}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-mint:
    backgroundColor: "{colors.card-tint-mint}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-sky:
    backgroundColor: "{colors.card-tint-sky}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-lavender:
    backgroundColor: "{colors.card-tint-lavender}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-yellow:
    backgroundColor: "{colors.card-tint-yellow}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-feature-cream:
    backgroundColor: "{colors.card-tint-cream}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-agent-tile:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-template:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.hairline}"
  card-startup-perk:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  pricing-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  pricing-card-featured:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "2px solid {colors.primary}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline-strong}"
    height: 44px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.primary}"
  search-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    height: 44px
    border: "1px solid {colors.hairline}"
  pill-tab:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.md}"
    border: "1px solid {colors.hairline}"
  pill-tab-active:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    border: "1px solid {colors.ink-deep}"
  segmented-tab:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
    border: "0 0 2px transparent solid"
  segmented-tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    border: "0 0 2px {colors.ink} solid"
  badge-purple:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-pink:
    backgroundColor: "{colors.brand-pink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-orange:
    backgroundColor: "{colors.brand-orange}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-tag-purple:
    backgroundColor: "{colors.card-tint-lavender}"
    textColor: "{colors.brand-purple-800}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-tag-orange:
    backgroundColor: "{colors.card-tint-peach}"
    textColor: "{colors.brand-orange-deep}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-tag-green:
    backgroundColor: "{colors.card-tint-mint}"
    textColor: "{colors.brand-green}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  badge-popular:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  promo-banner:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
  hero-band-dark:
    backgroundColor: "{colors.brand-navy}"
    textColor: "{colors.on-dark}"
    rounded: "0"
    padding: "{spacing.hero}"
  workspace-mockup-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "0"
    border: "1px solid {colors.hairline}"
    shadow: "rgba(15, 15, 15, 0.2) 0px 24px 48px -8px"
  cta-banner-light:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.section}"
  comparison-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
  comparison-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "{spacing.md} {spacing.lg}"
    border: "0 0 1px {colors.hairline-soft} solid"
  testimonial-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  logo-wall-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-md-medium}"
    padding: "{spacing.lg}"
  faq-accordion-item:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    border: "0 0 1px {colors.hairline} solid"
  stat-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.section-sm}"
  footer-region:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.charcoal}"
    typography: "{typography.body-sm}"
    padding: "{spacing.section} {spacing.xxl}"
    border: "1px solid {colors.hairline}"
  footer-link:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
---

## Overview

Notion presents itself as the all-in-one workspace through a confident, illustration-rich brand voice. The homepage opens with **"Meet the night shift."** rendered centered over a deep navy hero band ({colors.brand-navy}), decorated with brand-colored sticky-note dots and mesh wire illustrations scattered around the headline. The signature **purple pill primary CTA** ({colors.primary}) "Get Notion free" sits at the visual center, paired with an outlined "Request a demo" secondary. Below the buttons, a real Notion workspace UI mockup card (the "Ramp HQ" kanban board) breaks out of the hero band with a deep diffuse drop shadow.

Below the hero, the page cycles through a distinctive sequence of feature sections: a dense sticky-note "Keep work moving 24/7" panel with red/blue/green/purple/teal status icons; a **bold yellow** ({colors.card-tint-yellow-bold}) "Ask your on-demand assistants" banner card flanked by orange/rose/mint pastel feature tiles showing assistant UI mockups; and a "Bring all your work together" 3-column grid with brand-colored mockups (sky-blue tutorial card, light Notion calendar, brown/rust testimonial slate). The pricing page renders 4 tiers (Free / Plus / Business / Enterprise) horizontally with one tier featured (purple-bordered) and a dense feature comparison table running below.

The system uses a Notion-Sans typeface (Inter-based) across every UI surface — humanist-geometric character that pairs naturally with the colorful illustrations. Buttons are `{rounded.md}` (8px) rectangles, NOT pills — distinguishing Notion''s sober rectangular geometry from competitors that use pills universally. Cards use `{rounded.lg}` (12px) consistently.

**Key Characteristics:**
- Deep navy hero band ({colors.brand-navy}) with scattered sticky-note dots + mesh wire decorative illustrations
- **Signature purple pill** ({colors.primary}) primary CTA — Notion''s recognizable "Get Notion free" button color
- Real Notion workspace UI mockup card embedded in the hero with deep drop shadow
- Bold yellow feature banner ({colors.card-tint-yellow-bold}) for high-emphasis content sections
- Pastel feature card palette (peach, rose, mint, lavender, sky, yellow) echoing the live product database properties
- Notion-Sans (Inter-based) across every UI surface
- 8px-rounded buttons (NOT pills), 12px-rounded cards — sober editorial geometry
- 4-tier pricing comparison with dense feature table
- Centered hero layout (different from the left-aligned norm of most B2B SaaS)

## Colors

> Source pages: notion.com/ (homepage), /enterprise, /product/ai, /product/agents, /startups, /pricing. Token coverage was identical across all six pages.

### Brand & Primary
- **Notion Purple** ({colors.primary}): Signature primary CTA color — the unmistakable "Get Notion free" pill button. Reserved for the dominant CTA only.
- **Purple Pressed** ({colors.primary-pressed}): Pressed-state variant
- **Purple Deep** ({colors.primary-deep}): Deeper variant for emphasis
- **Brand Navy** ({colors.brand-navy}): Hero band background — deep navy
- **Brand Navy Deep** ({colors.brand-navy-deep}): Deeper navy for promo banner
- **Brand Navy Mid** ({colors.brand-navy-mid}): Mid-spectrum navy
- **Link Blue** ({colors.link-blue}): Inline text link blue (NOT primary CTA)
- **Link Blue Pressed** ({colors.link-blue-pressed}): Pressed-state link blue

### Brand Color Spectrum (echoes live product database properties)
- **Brand Pink** ({colors.brand-pink}): Pink accent
- **Brand Pink Deep** ({colors.brand-pink-deep}): Deeper pink
- **Brand Orange** ({colors.brand-orange}): Orange accent
- **Brand Orange Deep** ({colors.brand-orange-deep}): Deeper orange-rust
- **Brand Purple** ({colors.brand-purple}): Purple accent variant
- **Brand Purple 300** ({colors.brand-purple-300}): Light purple
- **Brand Purple 800** ({colors.brand-purple-800}): Deep purple for tag text
- **Brand Teal** ({colors.brand-teal}): Teal accent
- **Brand Green** ({colors.brand-green}): Bright green
- **Brand Yellow** ({colors.brand-yellow}): Soft yellow
- **Brand Brown** ({colors.brand-brown}): Brand brown for "earthy" tints

### Card Tints (Pastel Feature Card Backgrounds)
- **Tint Peach** ({colors.card-tint-peach}): Pale peach
- **Tint Rose** ({colors.card-tint-rose}): Pale rose-pink
- **Tint Mint** ({colors.card-tint-mint}): Pale mint-green
- **Tint Lavender** ({colors.card-tint-lavender}): Pale lavender
- **Tint Sky** ({colors.card-tint-sky}): Pale sky-blue
- **Tint Yellow** ({colors.card-tint-yellow}): Pale yellow
- **Tint Yellow Bold** ({colors.card-tint-yellow-bold}): Bold yellow for high-emphasis feature banners ("Ask your on-demand assistants")
- **Tint Cream** ({colors.card-tint-cream}): Cream tint
- **Tint Gray** ({colors.card-tint-gray}): Neutral surface

### Surface
- **Canvas White** ({colors.canvas}): Page background and primary card surface
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest, featured pricing tier
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions
- **Hairline** ({colors.hairline}): 1px borders and primary dividers
- **Hairline Soft** ({colors.hairline-soft}): Quieter dividers
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px border for inputs

### Text
- **Ink Deep** ({colors.ink-deep}): Pure black for emphasis
- **Ink** ({colors.ink}): Primary headlines and body text
- **Charcoal** ({colors.charcoal}): Body emphasis (Notion''s signature warm-charcoal)
- **Slate** ({colors.slate}): Secondary text
- **Steel** ({colors.steel}): Tertiary, footer links
- **Stone** ({colors.stone}): Muted labels
- **Muted** ({colors.muted}): Disabled, placeholders
- **On Dark** ({colors.on-dark}): White text on dark surfaces
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white

### Semantic
- **Success** ({colors.semantic-success}): Confirmation green
- **Warning** ({colors.semantic-warning}): Mid-priority alerts (orange)
- **Error** ({colors.semantic-error}): Validation errors (red)

## Typography

### Font Family
**Notion Sans** (primary): Notion''s custom Inter-based variable typeface. Fallbacks: Inter, -apple-system, system-ui, ''Segoe UI'', Helvetica, sans-serif. Humanist-geometric character used across every UI surface.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 80px | 600 | 1.05 | -2px | Hero ("Meet the night shift") |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1px | Section openers |
| `{typography.heading-1}` | 48px | 600 | 1.15 | -0.5px | Page-level headlines ("Try for free") |
| `{typography.heading-2}` | 36px | 600 | 1.20 | -0.5px | Subsection headlines ("Keep work moving 24/7") |
| `{typography.heading-3}` | 28px | 600 | 1.25 | 0 | Card titles |
| `{typography.heading-4}` | 22px | 600 | 1.30 | 0 | Feature tile titles |
| `{typography.heading-5}` | 18px | 600 | 1.40 | 0 | FAQ questions |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Hero subtitle |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Primary body text |
| `{typography.body-md-medium}` | 16px | 500 | 1.55 | 0 | Body emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Active sidebar, button labels |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Badge labels |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | Button labels |

### Principles
- Tight hero leading (1.05) on 80px display
- Negative letter-spacing on display sizes (-2px to -0.5px)
- Generous body leading (1.55) for documentation readability
- 600 weight for headlines + 500 for buttons; 400 body

## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) through `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px); pricing tightens to `{spacing.section}` (64px)

### Grid & Container
- 1280px max-width with 32px gutters
- Pricing: 4-tier card row at desktop with dense comparison table
- Homepage: centered hero with workspace mockup below buttons; alternating colorful feature card sections

### Whitespace Philosophy
Marketing surfaces use generous breathing room between feature card bands. Workspace mockup card on hero gets full-width treatment with deep drop shadow.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline}` border | Default cards, table rows |
| 1 (subtle) | `rgba(15, 15, 15, 0.04) 0px 1px 2px 0px` | Hover-elevated tiles |
| 2 (card) | `rgba(15, 15, 15, 0.08) 0px 4px 12px 0px` | Feature cards |
| 3 (mockup) | `rgba(15, 15, 15, 0.20) 0px 24px 48px -8px` | Hero workspace mockup card |
| 4 (modal) | `rgba(15, 15, 15, 0.16) 0px 16px 48px -8px` | Modals, dropdowns |

### Decorative Depth
- Hero workspace mockup card uses deep diffuse drop shadow (Level 3) — significant elevation against the navy band
- Pastel feature cards carry their own visual weight via tint backgrounds
- Sticky-note dot illustrations and mesh wires add atmospheric decoration to navy hero

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Tag chips |
| `{rounded.sm}` | 6px | Type badges |
| `{rounded.md}` | 8px | Buttons, inputs, search-pill |
| `{rounded.lg}` | 12px | Cards, pricing tiers, agent tiles, workspace mockup |
| `{rounded.xl}` | 16px | Larger feature panels |
| `{rounded.xxl}` | 20px | Featured product showcases |
| `{rounded.xxxl}` | 24px | Larger feature cards |
| `{rounded.full}` | 9999px | Status badges, pill tabs (NOT regular buttons) |

Notion''s geometry is sober-editorial — `{rounded.md}` (8px) buttons distinguish it from pill-button-everywhere brands.

## Components

> Per the no-hover policy, hover states are NOT documented.

### Buttons

**`button-primary`** — Signature purple rectangular primary CTA, the dominant action.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.
- Pressed state `button-primary-pressed` deepens to `{colors.primary-pressed}`.
- Disabled state uses `{colors.hairline}` background.

**`button-dark`** — Black rectangular CTA on light backgrounds.
- Background `{colors.ink-deep}`, text `{colors.on-dark}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-secondary`** — Outlined rectangular for secondary actions ("Request a demo").
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-on-dark`** — White button on dark hero bands.
- Background `{colors.on-dark}`, text `{colors.ink}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-secondary-on-dark`** — Outlined button on dark.
- Background transparent, text `{colors.on-dark}`, border `1px solid {colors.on-dark-muted}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-ghost`** — Quieter ghost button.
- Background transparent, text `{colors.ink}`, typography `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.sm}`.

**`button-link`** — Inline blue text link (NOT primary purple).
- Background transparent, text `{colors.link-blue}`, typography `{typography.body-sm-medium}`, padding `0`.

### Cards & Containers

**`card-base`** — Standard content card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-feature`** — Feature card with larger padding.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`card-feature-yellow-bold`** — Bold yellow feature banner for high-emphasis content ("Ask your on-demand assistants").
- Background `{colors.card-tint-yellow-bold}`, text `{colors.charcoal}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-feature-peach`** + **`card-feature-rose`** + **`card-feature-mint`** + **`card-feature-sky`** + **`card-feature-lavender`** + **`card-feature-yellow`** + **`card-feature-cream`** — Pastel-tinted feature cards.
- Each variant uses its corresponding `card-tint-*` color as background, text `{colors.charcoal}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-agent-tile`** — Agent assistant tile.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-template`** — Template thumbnail card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg}`, border `1px solid {colors.hairline}`.

**`card-startup-perk`** — Startup-program perk grid item.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`pricing-card-featured`** — Featured pricing tier (Plus or Business — purple-bordered).
- Background `{colors.surface}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `2px solid {colors.primary}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.primary}` (purple).

**`search-pill`** — Search bar.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-md}`, rounded `{rounded.md}`, height 44px, border `1px solid {colors.hairline}`.

### Tabs

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav for top-level switching.
- Inactive: text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.ink-deep}`, text `{colors.on-dark}`.

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation.
- Inactive: text `{colors.steel}`, no border. Active: text `{colors.ink}`, 2px bottom border in `{colors.ink}`.

### Badges & Status

**`badge-purple`** — Purple status badge (matches primary CTA).
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-pink`** — Pink accent badge.
- Background `{colors.brand-pink}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-orange`** — Orange accent badge.
- Background `{colors.brand-orange}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-purple`** — Soft-purple feature tag chip.
- Background `{colors.card-tint-lavender}`, text `{colors.brand-purple-800}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-tag-orange`** — Soft-orange feature tag.
- Background `{colors.card-tint-peach}`, text `{colors.brand-orange-deep}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-tag-green`** — Soft-mint feature tag.
- Background `{colors.card-tint-mint}`, text `{colors.brand-green}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-popular`** — "Most Popular" tier indicator.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`promo-banner`** — Light surface promo strip ABOVE the top nav.
- Background `{colors.surface}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`. ("Developers: Get a first look at our new Developer Platform on May 13.")

### Tables

**`comparison-table`** — Pricing feature comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`comparison-row`** — Individual feature row.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.lg}`, bottom border `1px solid {colors.hairline-soft}`.

### Documentation Components

**`workspace-mockup-card`** — Embedded Notion workspace UI mockup on hero band ("Ramp HQ" kanban board).
- Background `{colors.canvas}`, rounded `{rounded.lg}`, border `1px solid {colors.hairline}`, deep shadow `rgba(15, 15, 15, 0.20) 0px 24px 48px -8px`. Carries actual Notion product UI mock.

**`testimonial-card`** — Customer testimonial card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`logo-wall-item`** — Customer logo wordmark cell.
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.

**`faq-accordion-item`** — FAQ panel.
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, bottom border `1px solid {colors.hairline}`.

**`stat-row`** — Stats strip with bar chart visualization ("More productivity. Fewer tools.").
- Background `{colors.surface}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.section-sm}`.

**`cta-banner-light`** — Light surface CTA banner.
- Background `{colors.surface}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.section}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline}`.
- Left: Notion "N" logo + "Product / AI / Solutions / Resources / Enterprise / Pricing / Request a demo" links.
- Right: "Get Notion free" purple button + "Log in" link.

### Signature Components

**`hero-band-dark`** — Deep navy hero band with embedded workspace mockup and decorative dots/wires.
- Background `{colors.brand-navy}`, text `{colors.on-dark}`, padding `{spacing.hero}`.
- Layout: centered headline `{typography.hero-display}`, subtitle, button row (`button-primary` purple + `button-secondary-on-dark`), `workspace-mockup-card` below.
- Atmospheric decoration: scattered colorful sticky-note dots and mesh wire illustrations around the hero content (NOT a literal pattern fill — handled per-page via SVG/illustration).

**`footer-region`** — Multi-column light footer.
- Background `{colors.canvas}`, padding `{spacing.section} {spacing.xxl}`, top border `1px solid {colors.hairline}`.
- 6-column link grid (Product / Download / Resources / Notion for / Company / Legal).

**`footer-link`** — Individual footer link.
- Background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.

## Do''s and Don''ts

### Do
- Use `{colors.primary}` (purple) as the dominant CTA across all surfaces — it''s the brand''s recognizable signal
- Pair deep navy hero bands ({colors.brand-navy}) with the purple button + decorative sticky-note dots
- Use pastel feature card tints (peach, rose, mint, lavender, sky, yellow) generously
- Use `{colors.card-tint-yellow-bold}` for high-emphasis "Ask the assistant"-style banner cards
- Apply `{rounded.md}` (8px) to buttons consistently — Notion uses rectangles, not pills
- Apply `{rounded.lg}` (12px) to all card families
- Maintain Notion-Sans across every UI surface
- Use the workspace mockup card on hero bands to show actual product UI

### Don''t
- Don''t use the purple for body text or large background surfaces
- Don''t use pill-shaped buttons; Notion''s geometry is rectangular-sober
- Don''t mix link-blue ({colors.link-blue}) with primary-purple ({colors.primary}) — they have distinct roles
- Don''t apply heavy shadows on flat documentation cards
- Don''t replace Notion-Sans with a generic Inter

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero 36px. Pricing 1-up. |
| Mobile (large) | 480 – 767px | Feature cards 2-up. Hero 48px. |
| Tablet | 768 – 1023px | 2-column feature grids. Hero 56px. |
| Desktop | 1024 – 1279px | 4-tier pricing card row. Hero 72px. |
| Wide Desktop | ≥ 1280px | Full 80px hero presentation. |

### Touch Targets
- Buttons render at 40–44px effective height
- Form inputs render at 44px height
- Pill tabs ~32px → 44px on mobile

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger
- **Hero band**: workspace mockup card moves below text/buttons on mobile
- **Pricing tiers**: 4-column → 2-column tablet → 1-column mobile
- **Feature cards**: 3-up desktop → 2-up tablet → 1-up mobile
- **Hero typography**: 80px → 56px → 48px → 36px
- **Footer**: 6-column desktop → 3-column tablet → accordion mobile

### Image Behavior
- Workspace mockup card maintains aspect ratio
- Pastel illustrations inside feature cards scale proportionally
- Customer logo wall: wordmarks at consistent 60–80px height

## Iteration Guide

1. Focus on ONE component at a time
2. Reference component names and tokens directly
3. Run `npx @google/design.md lint DESIGN.md` after edits
4. Add new variants as separate `components:` entries
5. Default to `{typography.body-md}` for body
6. Keep `{colors.primary}` (purple) as the primary CTA — distinct from `{colors.link-blue}` for inline links
7. Use `{rounded.md}` for buttons (rectangles), `{rounded.lg}` for cards, `{rounded.full}` for pill tabs/badges only

## Known Gaps

- Specific dark-mode token values not surfaced beyond hero bands
- Animation/transition timings not extracted; recommend 150–200ms ease
- Form validation success state not explicitly captured
- Pastel-tint mapping (which feature uses which tint) is observation-based — the actual brand library may have more entries
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

Notion presents itself as the all-in-one workspace through a confident, illustration-rich brand voice. The homepage opens with **"Meet the night shift."** rendered centered over a deep navy hero band ({colors.brand-navy}), decorated with brand-colored sticky-note dots and mesh wire illustrations scattered around the headline. The signature **purple pill primary CTA** ({colors.primary}) "Get Notion free" sits at the visual center, paired with an outlined "Request a demo" secondary. Below the buttons, a real Notion workspace UI mockup card (the "Ramp HQ" kanban board) breaks out of the hero band with a deep diffuse drop shadow.

Below the hero, the page cycles through a distinctive sequence of feature sections: a dense sticky-note "Keep work moving 24/7" panel with red/blue/green/purple/teal status icons; a **bold yellow** ({colors.card-tint-yellow-bold}) "Ask your on-demand assistants" banner card flanked by orange/rose/mint pastel feature tiles showing assistant UI mockups; and a "Bring all your work together" 3-column grid with brand-colored mockups (sky-blue tutorial card, light Notion calendar, brown/rust testimonial slate). The pricing page renders 4 tiers (Free / Plus / Business / Enterprise) horizontally with one tier featured (purple-bordered) and a dense feature comparison table running below.

The system uses a Notion-Sans typeface (Inter-based) across every UI surface — humanist-geometric character that pairs naturally with the colorful illustrations. Buttons are `{rounded.md}` (8px) rectangles, NOT pills — distinguishing Notion''s sober rectangular geometry from competitors that use pills universally. Cards use `{rounded.lg}` (12px) consistently.

**Key Characteristics:**
- Deep navy hero band ({colors.brand-navy}) with scattered sticky-note dots + mesh wire decorative illustrations
- **Signature purple pill** ({colors.primary}) primary CTA — Notion''s recognizable "Get Notion free" button color
- Real Notion workspace UI mockup card embedded in the hero with deep drop shadow
- Bold yellow feature banner ({colors.card-tint-yellow-bold}) for high-emphasis content sections
- Pastel feature card palette (peach, rose, mint, lavender, sky, yellow) echoing the live product database properties
- Notion-Sans (Inter-based) across every UI surface
- 8px-rounded buttons (NOT pills), 12px-rounded cards — sober editorial geometry
- 4-tier pricing comparison with dense feature table
- Centered hero layout (different from the left-aligned norm of most B2B SaaS)', '{"sourcePath":"docs/design-md/notion/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: notion.com/ (homepage), /enterprise, /product/ai, /product/agents, /startups, /pricing. Token coverage was identical across all six pages.

### Brand & Primary
- **Notion Purple** ({colors.primary}): Signature primary CTA color — the unmistakable "Get Notion free" pill button. Reserved for the dominant CTA only.
- **Purple Pressed** ({colors.primary-pressed}): Pressed-state variant
- **Purple Deep** ({colors.primary-deep}): Deeper variant for emphasis
- **Brand Navy** ({colors.brand-navy}): Hero band background — deep navy
- **Brand Navy Deep** ({colors.brand-navy-deep}): Deeper navy for promo banner
- **Brand Navy Mid** ({colors.brand-navy-mid}): Mid-spectrum navy
- **Link Blue** ({colors.link-blue}): Inline text link blue (NOT primary CTA)
- **Link Blue Pressed** ({colors.link-blue-pressed}): Pressed-state link blue

### Brand Color Spectrum (echoes live product database properties)
- **Brand Pink** ({colors.brand-pink}): Pink accent
- **Brand Pink Deep** ({colors.brand-pink-deep}): Deeper pink
- **Brand Orange** ({colors.brand-orange}): Orange accent
- **Brand Orange Deep** ({colors.brand-orange-deep}): Deeper orange-rust
- **Brand Purple** ({colors.brand-purple}): Purple accent variant
- **Brand Purple 300** ({colors.brand-purple-300}): Light purple
- **Brand Purple 800** ({colors.brand-purple-800}): Deep purple for tag text
- **Brand Teal** ({colors.brand-teal}): Teal accent
- **Brand Green** ({colors.brand-green}): Bright green
- **Brand Yellow** ({colors.brand-yellow}): Soft yellow
- **Brand Brown** ({colors.brand-brown}): Brand brown for "earthy" tints

### Card Tints (Pastel Feature Card Backgrounds)
- **Tint Peach** ({colors.card-tint-peach}): Pale peach
- **Tint Rose** ({colors.card-tint-rose}): Pale rose-pink
- **Tint Mint** ({colors.card-tint-mint}): Pale mint-green
- **Tint Lavender** ({colors.card-tint-lavender}): Pale lavender
- **Tint Sky** ({colors.card-tint-sky}): Pale sky-blue
- **Tint Yellow** ({colors.card-tint-yellow}): Pale yellow
- **Tint Yellow Bold** ({colors.card-tint-yellow-bold}): Bold yellow for high-emphasis feature banners ("Ask your on-demand assistants")
- **Tint Cream** ({colors.card-tint-cream}): Cream tint
- **Tint Gray** ({colors.card-tint-gray}): Neutral surface

### Surface
- **Canvas White** ({colors.canvas}): Page background and primary card surface
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest, featured pricing tier
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions
- **Hairline** ({colors.hairline}): 1px borders and primary dividers
- **Hairline Soft** ({colors.hairline-soft}): Quieter dividers
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px border for inputs

### Text
- **Ink Deep** ({colors.ink-deep}): Pure black for emphasis
- **Ink** ({colors.ink}): Primary headlines and body text
- **Charcoal** ({colors.charcoal}): Body emphasis (Notion''s signature warm-charcoal)
- **Slate** ({colors.slate}): Secondary text
- **Steel** ({colors.steel}): Tertiary, footer links
- **Stone** ({colors.stone}): Muted labels
- **Muted** ({colors.muted}): Disabled, placeholders
- **On Dark** ({colors.on-dark}): White text on dark surfaces
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white

### Semantic
- **Success** ({colors.semantic-success}): Confirmation green
- **Warning** ({colors.semantic-warning}): Mid-priority alerts (orange)
- **Error** ({colors.semantic-error}): Validation errors (red)', '{"sourcePath":"docs/design-md/notion/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**Notion Sans** (primary): Notion''s custom Inter-based variable typeface. Fallbacks: Inter, -apple-system, system-ui, ''Segoe UI'', Helvetica, sans-serif. Humanist-geometric character used across every UI surface.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 80px | 600 | 1.05 | -2px | Hero ("Meet the night shift") |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1px | Section openers |
| `{typography.heading-1}` | 48px | 600 | 1.15 | -0.5px | Page-level headlines ("Try for free") |
| `{typography.heading-2}` | 36px | 600 | 1.20 | -0.5px | Subsection headlines ("Keep work moving 24/7") |
| `{typography.heading-3}` | 28px | 600 | 1.25 | 0 | Card titles |
| `{typography.heading-4}` | 22px | 600 | 1.30 | 0 | Feature tile titles |
| `{typography.heading-5}` | 18px | 600 | 1.40 | 0 | FAQ questions |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Hero subtitle |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Primary body text |
| `{typography.body-md-medium}` | 16px | 500 | 1.55 | 0 | Body emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Active sidebar, button labels |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Badge labels |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | Button labels |

### Principles
- Tight hero leading (1.05) on 80px display
- Negative letter-spacing on display sizes (-2px to -0.5px)
- Generous body leading (1.55) for documentation readability
- 600 weight for headlines + 500 for buttons; 400 body', '{"sourcePath":"docs/design-md/notion/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) through `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px); pricing tightens to `{spacing.section}` (64px)

### Grid & Container
- 1280px max-width with 32px gutters
- Pricing: 4-tier card row at desktop with dense comparison table
- Homepage: centered hero with workspace mockup below buttons; alternating colorful feature card sections

### Whitespace Philosophy
Marketing surfaces use generous breathing room between feature card bands. Workspace mockup card on hero gets full-width treatment with deep drop shadow.', '{"sourcePath":"docs/design-md/notion/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline}` border | Default cards, table rows |
| 1 (subtle) | `rgba(15, 15, 15, 0.04) 0px 1px 2px 0px` | Hover-elevated tiles |
| 2 (card) | `rgba(15, 15, 15, 0.08) 0px 4px 12px 0px` | Feature cards |
| 3 (mockup) | `rgba(15, 15, 15, 0.20) 0px 24px 48px -8px` | Hero workspace mockup card |
| 4 (modal) | `rgba(15, 15, 15, 0.16) 0px 16px 48px -8px` | Modals, dropdowns |

### Decorative Depth
- Hero workspace mockup card uses deep diffuse drop shadow (Level 3) — significant elevation against the navy band
- Pastel feature cards carry their own visual weight via tint backgrounds
- Sticky-note dot illustrations and mesh wires add atmospheric decoration to navy hero', '{"sourcePath":"docs/design-md/notion/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Tag chips |
| `{rounded.sm}` | 6px | Type badges |
| `{rounded.md}` | 8px | Buttons, inputs, search-pill |
| `{rounded.lg}` | 12px | Cards, pricing tiers, agent tiles, workspace mockup |
| `{rounded.xl}` | 16px | Larger feature panels |
| `{rounded.xxl}` | 20px | Featured product showcases |
| `{rounded.xxxl}` | 24px | Larger feature cards |
| `{rounded.full}` | 9999px | Status badges, pill tabs (NOT regular buttons) |

Notion''s geometry is sober-editorial — `{rounded.md}` (8px) buttons distinguish it from pill-button-everywhere brands.', '{"sourcePath":"docs/design-md/notion/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> Per the no-hover policy, hover states are NOT documented.

### Buttons

**`button-primary`** — Signature purple rectangular primary CTA, the dominant action.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.
- Pressed state `button-primary-pressed` deepens to `{colors.primary-pressed}`.
- Disabled state uses `{colors.hairline}` background.

**`button-dark`** — Black rectangular CTA on light backgrounds.
- Background `{colors.ink-deep}`, text `{colors.on-dark}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-secondary`** — Outlined rectangular for secondary actions ("Request a demo").
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-on-dark`** — White button on dark hero bands.
- Background `{colors.on-dark}`, text `{colors.ink}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-secondary-on-dark`** — Outlined button on dark.
- Background transparent, text `{colors.on-dark}`, border `1px solid {colors.on-dark-muted}`, typography `{typography.button-md}`, padding `10px 18px`, rounded `{rounded.md}`.

**`button-ghost`** — Quieter ghost button.
- Background transparent, text `{colors.ink}`, typography `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.sm}`.

**`button-link`** — Inline blue text link (NOT primary purple).
- Background transparent, text `{colors.link-blue}`, typography `{typography.body-sm-medium}`, padding `0`.

### Cards & Containers

**`card-base`** — Standard content card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-feature`** — Feature card with larger padding.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`card-feature-yellow-bold`** — Bold yellow feature banner for high-emphasis content ("Ask your on-demand assistants").
- Background `{colors.card-tint-yellow-bold}`, text `{colors.charcoal}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-feature-peach`** + **`card-feature-rose`** + **`card-feature-mint`** + **`card-feature-sky`** + **`card-feature-lavender`** + **`card-feature-yellow`** + **`card-feature-cream`** — Pastel-tinted feature cards.
- Each variant uses its corresponding `card-tint-*` color as background, text `{colors.charcoal}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-agent-tile`** — Agent assistant tile.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-template`** — Template thumbnail card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg}`, border `1px solid {colors.hairline}`.

**`card-startup-perk`** — Startup-program perk grid item.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`pricing-card-featured`** — Featured pricing tier (Plus or Business — purple-bordered).
- Background `{colors.surface}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `2px solid {colors.primary}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.primary}` (purple).

**`search-pill`** — Search bar.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-md}`, rounded `{rounded.md}`, height 44px, border `1px solid {colors.hairline}`.

### Tabs

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav for top-level switching.
- Inactive: text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.ink-deep}`, text `{colors.on-dark}`.

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation.
- Inactive: text `{colors.steel}`, no border. Active: text `{colors.ink}`, 2px bottom border in `{colors.ink}`.

### Badges & Status

**`badge-purple`** — Purple status badge (matches primary CTA).
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-pink`** — Pink accent badge.
- Background `{colors.brand-pink}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-orange`** — Orange accent badge.
- Background `{colors.brand-orange}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-purple`** — Soft-purple feature tag chip.
- Background `{colors.card-tint-lavender}`, text `{colors.brand-purple-800}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-tag-orange`** — Soft-orange feature tag.
- Background `{colors.card-tint-peach}`, text `{colors.brand-orange-deep}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-tag-green`** — Soft-mint feature tag.
- Background `{colors.card-tint-mint}`, text `{colors.brand-green}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`badge-popular`** — "Most Popular" tier indicator.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`promo-banner`** — Light surface promo strip ABOVE the top nav.
- Background `{colors.surface}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`. ("Developers: Get a first look at our new Developer Platform on May 13.")

### Tables

**`comparison-table`** — Pricing feature comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`comparison-row`** — Individual feature row.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.lg}`, bottom border `1px solid {colors.hairline-soft}`.

### Documentation Components

**`workspace-mockup-card`** — Embedded Notion workspace UI mockup on hero band ("Ramp HQ" kanban board).
- Background `{colors.canvas}`, rounded `{rounded.lg}`, border `1px solid {colors.hairline}`, deep shadow `rgba(15, 15, 15, 0.20) 0px 24px 48px -8px`. Carries actual Notion product UI mock.

**`testimonial-card`** — Customer testimonial card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`logo-wall-item`** — Customer logo wordmark cell.
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.

**`faq-accordion-item`** — FAQ panel.
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, bottom border `1px solid {colors.hairline}`.

**`stat-row`** — Stats strip with bar chart visualization ("More productivity. Fewer tools.").
- Background `{colors.surface}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.section-sm}`.

**`cta-banner-light`** — Light surface CTA banner.
- Background `{colors.surface}`, text `{colors.ink}`, rounded `{rounded.lg}`, padding `{spacing.section}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline}`.
- Left: Notion "N" logo + "Product / AI / Solutions / Resources / Enterprise / Pricing / Request a demo" links.
- Right: "Get Notion free" purple button + "Log in" link.

### Signature Components

**`hero-band-dark`** — Deep navy hero band with embedded workspace mockup and decorative dots/wires.
- Background `{colors.brand-navy}`, text `{colors.on-dark}`, padding `{spacing.hero}`.
- Layout: centered headline `{typography.hero-display}`, subtitle, button row (`button-primary` purple + `button-secondary-on-dark`), `workspace-mockup-card` below.
- Atmospheric decoration: scattered colorful sticky-note dots and mesh wire illustrations around the hero content (NOT a literal pattern fill — handled per-page via SVG/illustration).

**`footer-region`** — Multi-column light footer.
- Background `{colors.canvas}`, padding `{spacing.section} {spacing.xxl}`, top border `1px solid {colors.hairline}`.
- 6-column link grid (Product / Download / Resources / Notion for / Company / Legal).

**`footer-link`** — Individual footer link.
- Background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.', '{"sourcePath":"docs/design-md/notion/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Use `{colors.primary}` (purple) as the dominant CTA across all surfaces — it''s the brand''s recognizable signal
- Pair deep navy hero bands ({colors.brand-navy}) with the purple button + decorative sticky-note dots
- Use pastel feature card tints (peach, rose, mint, lavender, sky, yellow) generously
- Use `{colors.card-tint-yellow-bold}` for high-emphasis "Ask the assistant"-style banner cards
- Apply `{rounded.md}` (8px) to buttons consistently — Notion uses rectangles, not pills
- Apply `{rounded.lg}` (12px) to all card families
- Maintain Notion-Sans across every UI surface
- Use the workspace mockup card on hero bands to show actual product UI

### Don''t
- Don''t use the purple for body text or large background surfaces
- Don''t use pill-shaped buttons; Notion''s geometry is rectangular-sober
- Don''t mix link-blue ({colors.link-blue}) with primary-purple ({colors.primary}) — they have distinct roles
- Don''t apply heavy shadows on flat documentation cards
- Don''t replace Notion-Sans with a generic Inter', '{"sourcePath":"docs/design-md/notion/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero 36px. Pricing 1-up. |
| Mobile (large) | 480 – 767px | Feature cards 2-up. Hero 48px. |
| Tablet | 768 – 1023px | 2-column feature grids. Hero 56px. |
| Desktop | 1024 – 1279px | 4-tier pricing card row. Hero 72px. |
| Wide Desktop | ≥ 1280px | Full 80px hero presentation. |

### Touch Targets
- Buttons render at 40–44px effective height
- Form inputs render at 44px height
- Pill tabs ~32px → 44px on mobile

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger
- **Hero band**: workspace mockup card moves below text/buttons on mobile
- **Pricing tiers**: 4-column → 2-column tablet → 1-column mobile
- **Feature cards**: 3-up desktop → 2-up tablet → 1-up mobile
- **Hero typography**: 80px → 56px → 48px → 36px
- **Footer**: 6-column desktop → 3-column tablet → accordion mobile

### Image Behavior
- Workspace mockup card maintains aspect ratio
- Pastel illustrations inside feature cards scale proportionally
- Customer logo wall: wordmarks at consistent 60–80px height', '{"sourcePath":"docs/design-md/notion/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time
2. Reference component names and tokens directly
3. Run `npx @google/design.md lint DESIGN.md` after edits
4. Add new variants as separate `components:` entries
5. Default to `{typography.body-md}` for body
6. Keep `{colors.primary}` (purple) as the primary CTA — distinct from `{colors.link-blue}` for inline links
7. Use `{rounded.md}` for buttons (rectangles), `{rounded.lg}` for cards, `{rounded.full}` for pill tabs/badges only', '{"sourcePath":"docs/design-md/notion/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Specific dark-mode token values not surfaced beyond hero bands
- Animation/transition timings not extracted; recommend 150–200ms ease
- Form validation success state not explicitly captured
- Pastel-tint mapping (which feature uses which tint) is observation-based — the actual brand library may have more entries', '{"sourcePath":"docs/design-md/notion/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_1', '#5645d4', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_2', '#4534b3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_3', '#3a2a99', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_4', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_5', '#0a1530', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_6', '#070f24', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_7', '#1a2a52', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_8', '#0075de', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_9', '#005bab', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_10', '#dd5b00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_11', '#793400', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_12', '#ff64c8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_13', '#a02e6d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_14', '#7b3ff2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_15', '#d6b6f6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_16', '#391c57', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_17', '#2a9d99', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_18', '#1aae39', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_19', '#f5d75e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_20', '#523410', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_21', '#ffe8d4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_22', '#fde0ec', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_23', '#d9f3e1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_24', '#e6e0f5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_25', '#dcecfa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_26', '#fef7d6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_27', '#f9e79f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_28', '#f8f5e8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_29', '#f0eeec', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_30', '#f6f5f4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_31', '#fafaf9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_32', '#e5e3df', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_33', '#ede9e4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_34', '#c8c4be', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_35', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_36', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_37', '#37352f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_38', '#5d5b54', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_39', '#787671', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md'), 'color', 'color_40', '#a4a097', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/notion/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/notion/DESIGN.md';


-- Nvidia
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Nvidia', 'nvidia', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/nvidia/DESIGN.md', null, 'seeded', '---
version: alpha
name: NVIDIA-design-analysis
description: |
  An engineering-grade marketing system organized around two surface modes — a deep black canvas for hero and footer chapters and a flat paper-white canvas for body content — connected by a single, almost violently saturated NVIDIA Green accent that carries every CTA, every active tab, and the small decorative corner squares that mark out cards. The system is unapologetically angular: 2px radius across every surface, tight bold sans-serif typography in NVIDIA''s proprietary EMEA cut, and a hairline gray rule that separates dense multi-column technical content. There is no decorative gradient, no atmospheric mesh, no soft drop shadow — just black, white, gray, and green stacked into a structured editorial grid that scales from product cards to massive industry landing pages without bending its rules.

colors:
  primary: "#76b900"
  on-primary: "#000000"
  primary-dark: "#5a8d00"
  ink: "#000000"
  canvas: "#ffffff"
  surface-dark: "#000000"
  surface-soft: "#f7f7f7"
  surface-elevated: "#1a1a1a"
  hairline: "#cccccc"
  hairline-strong: "#5e5e5e"
  body: "#1a1a1a"
  mute: "#757575"
  stone: "#898989"
  ash: "#a7a7a7"
  on-dark: "#ffffff"
  on-dark-mute: "rgba(255,255,255,0.7)"
  link-blue: "#0046a4"
  blue-700: "#0046a4"
  error: "#e52020"
  error-deep: "#650b0b"
  warning: "#df6500"
  warning-bright: "#ef9100"
  success-deep: "#3f8500"
  accent-yellow-pale: "#feeeb2"
  accent-purple: "#952fc6"
  accent-purple-deep: "#4d1368"
  accent-purple-pale: "#f9d4ff"
  accent-green-pale: "#bff230"

typography:
  display-xl:
    fontFamily: NVIDIA-EMEA
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
  display-lg:
    fontFamily: NVIDIA-EMEA
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
  heading-xl:
    fontFamily: NVIDIA-EMEA
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
  heading-lg:
    fontFamily: NVIDIA-EMEA
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0
  heading-md:
    fontFamily: NVIDIA-EMEA
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
  heading-sm:
    fontFamily: NVIDIA-EMEA
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0
  card-title:
    fontFamily: NVIDIA-EMEA
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.47
    letterSpacing: 0
  body-md:
    fontFamily: NVIDIA-EMEA
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: NVIDIA-EMEA
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: NVIDIA-EMEA
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.67
    letterSpacing: 0
  button-lg:
    fontFamily: NVIDIA-EMEA
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
  button-md:
    fontFamily: NVIDIA-EMEA
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
  button-sm:
    fontFamily: NVIDIA-EMEA
    fontSize: 14.4px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.144px
  link-md:
    fontFamily: NVIDIA-EMEA
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption-md:
    fontFamily: NVIDIA-EMEA
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.43
    letterSpacing: 0
    textTransform: uppercase
  caption-sm:
    fontFamily: NVIDIA-EMEA
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: 0
  caption-xs:
    fontFamily: NVIDIA-EMEA
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0
  utility-xs:
    fontFamily: NVIDIA-EMEA
    fontSize: 10px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
    textTransform: uppercase

rounded:
  none: 0px
  xs: 1px
  sm: 2px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  section: 64px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 11px 24px
    height: 44px
  button-primary-active:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 11px 13px
  button-outline-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
  button-ghost-link:
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
  button-disabled:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ash}"
    rounded: "{rounded.sm}"
  pill-tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.sm}"
    padding: 10px 18px
  pill-tab-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.sm}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
    height: 44px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  search-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 10px 16px
    height: 40px
  product-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.card-title}"
    rounded: "{rounded.sm}"
    padding: 24px
  feature-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 32px
  resource-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.card-title}"
    rounded: "{rounded.sm}"
    padding: 24px
  hero-card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xl}"
    rounded: "{rounded.none}"
    padding: 80px 48px
  cta-strip-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.heading-xl}"
    rounded: "{rounded.none}"
    padding: 64px 48px
  callout-stat:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.sm}"
    padding: 32px
  corner-square:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.none}"
    size: 12px
  utility-bar:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.none}"
    height: 32px
  primary-nav:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
    height: 64px
  breadcrumb-bar:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.none}"
    height: 48px
  sub-nav-strip:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    height: 56px
  footer-section:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark-mute}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 64px 48px
  link-inline:
    textColor: "{colors.link-blue}"
    typography: "{typography.link-md}"
  badge-tag:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.sm}"
    padding: 4px 10px
---

## Overview

NVIDIA''s marketing system is built like a piece of engineering documentation that learned graphic design — every page is a structured cascade of dense, factual information arranged on a paper-white grid, framed top and bottom by deep black hero/footer chapters. There is exactly one accent color in the entire system, and it is doing all the work: NVIDIA Green (`{colors.primary}` — `#76b900`), used for every primary CTA, every active tab, every link affordance on dark surfaces, and the small decorative corner squares that mark out card containers. Nothing else competes for attention.

The system''s character comes from extreme typographic restraint and an almost punishingly angular geometry. Every container, button, and image uses `{rounded.sm}` (2px) — a token that''s barely-there but never zero, giving the system the precise, technical feel of CAD output rather than warm consumer software. Cards sit on plain `{colors.canvas}` with a hairline `{colors.hairline}` border (no shadow, no elevation), separated by tight 8px-base spacing rhythm. Long-form pages stack 6–10 of these cards into multi-column technical grids without ever introducing decorative breaks.

The black-canvas hero and footer chapters are the system''s "headline moments" — a single full-bleed photographic or 3D-rendered image with `{typography.display-xl}` headline copy laid in white, a single green CTA button, and a small green corner square as the only ornamentation. Everything else is subordinate.

**Key Characteristics:**
- Single-accent system: `{colors.primary}` carries every CTA, active state, and decorative motif. The rest is monochrome black/white/gray.
- Two-mode surface architecture: `{colors.surface-dark}` for hero/footer chapters; `{colors.canvas}` for body — alternating in a predictable rhythm down the page
- Hyper-angular geometry: `{rounded.sm}` (2px) on every interactive element. There are no pill buttons, no rounded cards, no soft chrome.
- NVIDIA-EMEA proprietary sans-serif at weights 400 and 700, scaled across a 12-tier hierarchy from `{typography.utility-xs}` (10px) up to `{typography.display-xl}` (48px)
- Card library leans on hairline `{colors.hairline}` borders and `{colors.surface-soft}` backgrounds rather than shadows for separation
- Signature decorative element: the small `{component.corner-square}` (~12px green square) anchored to one corner of resource and feature cards
- Dense multi-column footer with 4–6 link columns on `{colors.surface-dark}` — every page closes with the same structured global navigation

## Colors

> **Source pages:** `/tr-tr/` (primary homepage), `/en-eu/industries/healthcare-life-sciences/`, `/en-eu/solutions/ai/`, `/en-eu/ai/foundry/`. The chrome palette is identical across all four — only photography and copy vary.

### Brand & Accent
- **NVIDIA Green** (`{colors.primary}` — `#76b900`): the brand. Every primary CTA, every active state, every link affordance on dark surfaces, every corner square, and the brand wordmark itself.
- **NVIDIA Green Dark** (`{colors.primary-dark}` — `#5a8d00`): pressed state for the primary button — a single notch deeper than the brand green.
- **Accent Green Pale** (`{colors.accent-green-pale}` — `#bff230`): rare highlight tint used in editorial callouts and decorative micro-blocks; never on chrome.

### Surface
- **Page Canvas** (`{colors.canvas}` — `#ffffff`): the body of every page. Cards sit directly on it with hairline rules.
- **Soft Surface** (`{colors.surface-soft}` — `#f7f7f7`): breadcrumb strip, sub-nav, side-by-side comparison panels, alternating row backgrounds.
- **Black Canvas** (`{colors.surface-dark}` — `#000000`): hero chapter, dark CTA strips, footer, primary nav. The system''s "frame" color.
- **Surface Elevated** (`{colors.surface-elevated}` — `#1a1a1a`): nested dark panels inside the footer (column dividers, fine-print bar).
- **Hairline** (`{colors.hairline}` — `#cccccc`): 1px card border, table rule, divider between footer link sections.
- **Hairline Strong** (`{colors.hairline-strong}` — `#5e5e5e`): 1px divider on dark surfaces (footer column rules, dark-mode card edges).

### Text
- **Ink** (`{colors.ink}` — `#000000`): headlines and body text on `{colors.canvas}`.
- **Body** (`{colors.body}` — `#1a1a1a`): long-form paragraph text where pure black is too heavy.
- **Mute** (`{colors.mute}` — `#757575`): metadata, breadcrumb separators, footer copyright.
- **Stone** (`{colors.stone}` — `#898989`): least-emphasis text and disabled state.
- **Ash** (`{colors.ash}` — `#a7a7a7`): disabled icon color and faint utility text.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.surface-dark}`.
- **On Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.7)`): secondary footer link text and dark-canvas body copy.

### Semantic
- **Error** (`{colors.error}` — `#e52020`): validation messages, destructive confirmation.
- **Error Deep** (`{colors.error-deep}` — `#650b0b`): pressed state for error buttons; hover-pressed validation icons.
- **Warning** (`{colors.warning}` — `#df6500`): caution callouts, deprecated documentation banners.
- **Warning Bright** (`{colors.warning-bright}` — `#ef9100`): inverse warning on dark canvas.
- **Success Deep** (`{colors.success-deep}` — `#3f8500`): positive confirmation where NVIDIA Green''s saturation would clash.
- **Link Blue** (`{colors.link-blue}` — `#0046a4`): inline anchor link color on light canvas — the only blue in the system, reserved for prose-embedded hyperlinks.

### Editorial Accents (used sparingly inside long-form content)
- **Accent Purple** (`{colors.accent-purple}` — `#952fc6`): research / scientific computing editorial accent.
- **Accent Purple Deep** (`{colors.accent-purple-deep}` — `#4d1368`): paired dark for purple lockups.
- **Accent Purple Pale** (`{colors.accent-purple-pale}` — `#f9d4ff`): wash background for editorial callouts.
- **Accent Yellow Pale** (`{colors.accent-yellow-pale}` — `#feeeb2`): documentation tip / soft callout fill.

## Typography

### Font Family
- **NVIDIA-EMEA** is the proprietary brand sans-serif used across every text role on the site. It carries weights 400 (regular) and 700 (bold) and falls back to Arial → Helvetica.
- **Font Awesome 6 Pro** and **Font Awesome 6 Sharp** are used exclusively for iconography (chevrons, social glyphs, breadcrumb separators, search/menu icons) at sizes 14–22px.

NVIDIA''s type system is unusually flat: most chrome and body roles render at the same line-height (1.25–1.5) with the only meaningful variation coming from weight (400 vs 700) and size. The system relies on weight contrast — not size jumps and not color tinting — to establish hierarchy, which gives marketing copy and technical documentation an editorial newspaper feel.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 48px | 700 | 1.25 | 0 | Hero headline on `{component.hero-card-dark}` |
| `{typography.display-lg}` | 36px | 700 | 1.25 | 0 | Section headline ("Explore Our AI Solutions"), large stat callouts |
| `{typography.heading-xl}` | 24px | 700 | 1.25 | 0 | Sub-section title, dark CTA-strip headline |
| `{typography.heading-lg}` | 22px | 400 | 1.75 | 0 | Long-form intro paragraph that doubles as a heading |
| `{typography.heading-md}` | 20px | 700 | 1.25 | 0 | Card group title, sub-nav anchor heading |
| `{typography.heading-sm}` | 18px | 700 | 1.4 | 0 | Side-rail filter group, small section label |
| `{typography.card-title}` | 17px | 700 | 1.47 | 0 | Resource card title, product card title |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Body copy, default paragraph |
| `{typography.body-strong}` | 16px | 700 | 1.5 | 0 | Inline emphasis, primary nav link, label |
| `{typography.body-sm}` | 15px | 400 | 1.67 | 0 | Card description, secondary copy |
| `{typography.button-lg}` | 18px | 700 | 1.25 | 0 | Hero primary CTA |
| `{typography.button-md}` | 16px | 700 | 1.25 | 0 | Standard primary/secondary buttons |
| `{typography.button-sm}` | 14.4px | 700 | 1 | 0.144px | Compact pill tab, in-card secondary CTA |
| `{typography.link-md}` | 15px | 400 | 1.5 | 0 | Inline anchor link in body prose |
| `{typography.caption-md}` | 14px | 700 | 1.43 | 0 | Eyebrow over section heading, breadcrumb (uppercase) |
| `{typography.caption-sm}` | 12px | 400 | 1.25 | 0 | Footnote copy, metadata, table caption |
| `{typography.caption-xs}` | 11px | 700 | 1 | 0 | Pill chip label, utility-bar text |
| `{typography.utility-xs}` | 10px | 700 | 1.5 | 0 | Legal fine-print bar at the very bottom (uppercase) |

### Principles
The typography is brand-locked: NVIDIA-EMEA is used at every level, no serif, no display variant, no monospace, no italic. Hierarchy is built almost entirely from size and weight — color is reserved for emphasis (`{colors.primary}` on links over dark, `{colors.link-blue}` on light) and never used to separate type tiers.

### Note on Font Substitutes
NVIDIA-EMEA is proprietary. The closest open-source pairing is **Inter** (weights 400/700) — its x-height and stroke contrast match NVIDIA-EMEA''s optical metrics within ~2% at body sizes. **Arial** is the official documented fallback and is acceptable for any system where Inter is unavailable. Avoid Helvetica Now or Helvetica Neue substitutes; their slightly tighter cap heights drift away from the brand''s geometry.

## Layout

### Spacing System
- **Base unit:** 8px
- **Tokens (front matter):** `{spacing.xxs}` (2px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (64px)
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (64px) as the vertical gap between major content blocks. Card grids use `{spacing.xl}` (24px) gutters; in-card padding sits at `{spacing.xl}` to `{spacing.xxl}` depending on density.
- **Hero chapter padding:** 80px vertical / 48px horizontal — the largest spacing in the system, reserved for `{component.hero-card-dark}`.

### Grid & Container
- **Max width:** ~1280px content area at desktop, with 24px gutters that grow to ~48px at ultrawide.
- **Column patterns:**
  - Card grids: 4-up at desktop, 3-up at 1024px, 2-up at 768px, 1-up at 480px.
  - Long-form text: 2-column 60/40 split (body + sidebar) at desktop, single-column at < 960px.
  - Footer: 6-up link columns at desktop, collapsing to 2-up on tablet, full accordion on mobile.
- **Card aspect:** product cards lean to 1:1 or 4:3 with 16:9 imagery on top + 1–2 lines of metadata below. Resource cards are 3:2 imagery with a longer description block.

### Whitespace Philosophy
Whitespace is structural, not atmospheric. Sections butt against each other with `{spacing.section}` rhythm — there are no decorative dividers, no empty "breathing room" bands, no gradient transitions between sections. The sense of air comes from `{colors.canvas}` body sections sandwiched between `{colors.surface-dark}` chapter blocks, not from generous padding inside any one component.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Canvas-on-canvas blocks, hero chapter content, footer column body |
| 1 — Hairline border | 1px solid `{colors.hairline}` | All cards on `{colors.canvas}`, table cells, comparison panels |
| 2 — Hairline strong | 1px solid `{colors.hairline-strong}` | Dividers on `{colors.surface-dark}` (footer column rules, dark-card edges) |
| 3 — Soft shadow | `0 0 5px 0 rgba(0,0,0,0.3)` | Sticky nav bottom edge when scrolled, sticky CTA bar — used very sparingly |

NVIDIA''s system has effectively no drop-shadow elevation in card or content surfaces. The only "shadow" in the extracted tokens is a subtle 5px ambient on sticky chrome bars. Cards do not lift; cards are flat rectangles with hairline borders.

### Decorative Depth
Depth in NVIDIA''s system comes from photography and 3D-rendered hero imagery rather than from CSS effects:
- **Hero imagery:** full-bleed photographic or rendered scenes (data-center hardware, neural-net visualizations, life-sciences microscopy) sit behind hero copy with a dark gradient overlay for legibility.
- **Decorative corner squares:** the small `{component.corner-square}` (~12px solid `{colors.primary}` square) anchored to the top-left or bottom-right corner of resource and feature cards — the system''s only consistent ornamental device.
- **Editorial 3D accents:** isometric or wireframe 3D renderings appear as illustration-style fills inside long-form articles, never as chrome.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero chapter, footer, dark CTA strips, primary nav |
| `{rounded.xs}` | 1px | Decorative micro-rules and inset accent strips |
| `{rounded.sm}` | 2px | Every interactive element — buttons, cards, inputs, pill tabs, badges |
| `{rounded.full}` | 9999px / 50% | Avatar circles, social-icon dots, brand wordmark icon |

The system is aggressively angular. Outside of avatar/icon circles, no element exceeds 2px radius. The 2px is enough to soften the optical aliasing on a sharp edge but small enough that the system reads as engineering-grade rather than consumer-friendly.

### Photography Geometry
- **Hero imagery:** full-bleed 16:9 (desktop) cropping to 4:5 portrait on mobile.
- **Card imagery:** 16:9 thumbnail at the top of resource cards; 1:1 square for product/SKU cards; 3:2 for editorial article cards.
- **Decorative corner squares:** 12×12px on standard cards, scaled to 16×16 on hero callouts.
- **Avatar/social icons:** 32–40px circles with 1px hairline.

## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only; variants live as separate `components:` entries in the front matter.

### Buttons

**`button-primary`** — the universal NVIDIA CTA
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `11px 24px`, height `44px`, rounded `{rounded.sm}`.
- The single most-repeated component in the system: hero CTA, dark CTA strip, "Learn More" on every card group, "Sign Up" / "Get Started" on every long-form page bottom.
- Pressed state lives in `button-primary-active` — background drops to `{colors.primary-dark}` (`#5a8d00`) with the same text color.

**`button-outline`** — secondary on light canvas
- Background transparent, text `{colors.ink}`, 2px solid `{colors.primary}` border, type `{typography.button-md}`, padding `11px 13px`, rounded `{rounded.sm}`.
- The system''s most distinctive secondary CTA: a clear pane bordered in NVIDIA Green. Used for "Read the Documentation", "Watch the Video", "Compare Products" — second-tier actions that still earn the brand color.

**`button-outline-on-dark`** — outline on `{colors.surface-dark}`
- Background transparent, text `{colors.on-dark}`, 1px solid `{colors.on-dark}`, type `{typography.button-md}`, rounded `{rounded.sm}`.
- White-on-black variant used in dark hero/footer CTA strips paired with a primary green button.

**`button-ghost-link`** — inline arrow link
- Text `{colors.primary}` with a small right-arrow icon, type `{typography.button-md}`, no background, no border, rounded `{rounded.none}`.
- "Learn More →" affordance sitting at the bottom of resource cards and long-form section blocks. The arrow is uppercase and bold per `{typography.caption-md}`-equivalent treatment.

**`button-disabled`**
- Background `{colors.surface-soft}`, text `{colors.ash}`, rounded `{rounded.sm}` — flat gray.

### Tabs & Chips

**`pill-tab`** + **`pill-tab-active`**
- Default: transparent background, text `{colors.ink}`, type `{typography.button-sm}`, padding `10px 18px`, rounded `{rounded.sm}`.
- Active: background `{colors.ink}`, text `{colors.on-dark}` — the tab flips inverted on selection. Used in the "Latest in AI Resources" filter strip and similar segmented controls.

**`badge-tag`**
- Background `{colors.surface-soft}`, text `{colors.body}`, type `{typography.caption-md}`, padding `4px 10px`, rounded `{rounded.sm}` (uppercase).
- Document type / category labels at the top of resource cards ("WHITE PAPER", "WEBINAR", "BLOG").

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `12px 16px`, height `44px`, rounded `{rounded.sm}`.
- Focused: same surface, border becomes 2px solid `{colors.primary}` — the green border is the only focus signal in the system.

**`search-input`**
- Used in the global search overlay — same treatment as `text-input` but at 40px height with a magnifier glyph at left.

### Cards

**`product-card`**
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.sm}`.
- Layout: 16:9 product image at top, `{typography.card-title}` title, `{typography.body-sm}` description, `{component.button-ghost-link}` "Learn More →" affordance at bottom.
- The `{component.corner-square}` sits at the top-left corner.

**`feature-card`**
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.xxl}` (32px), rounded `{rounded.sm}`.
- Layout: icon (Font Awesome at 22–24px) at top in `{colors.primary}` followed by `{typography.heading-md}` title and `{typography.body-md}` body.
- Used in 3-up or 4-up grids that explain product capabilities ("Agentic AI", "Data Science", "Inference", "Conversational AI").

**`resource-card`**
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.xl}`, rounded `{rounded.sm}`.
- Header strip: `{component.badge-tag}` document-type label.
- Body: 3:2 thumbnail, `{typography.card-title}` title, `{typography.body-sm}` description.
- Footer: ghost-link "Read More →" with right-pointing chevron in `{colors.primary}`.

**`callout-stat`**
- Background `{colors.canvas}` with 1px hairline `{colors.hairline}`, padding `{spacing.xxl}`, rounded `{rounded.sm}`.
- Massive `{typography.display-lg}` (36px) numeric in `{colors.primary}` followed by `{typography.body-md}` caption underneath ("4× faster training", "60% lower cost", etc.). Used inside long-form industry pages.

### Hero & CTA Strips

**`hero-card-dark`**
- Background `{colors.surface-dark}` with full-bleed 16:9 photographic/3D image and dark gradient overlay; copy slot at left.
- `{typography.display-xl}` headline `{colors.on-dark}`, `{typography.heading-lg}` subhead, single `{component.button-primary}` CTA (sometimes paired with `{component.button-outline-on-dark}`).
- Anchors the top of every primary landing page.

**`cta-strip-dark`**
- Same surface as hero but compressed to a 1-row band with `{typography.heading-xl}` headline + single CTA.
- Sits between content sections as a "Ready to get started?" bridge.

### Decorative

**`corner-square`**
- 12×12px solid `{colors.primary}` square anchored to a card corner. The brand''s signature ornamental motif.
- Used on resource cards, feature cards, and editorial callouts. Position varies (top-left, bottom-right) but the size and color are constant.

### Navigation

**`utility-bar`**
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, height 32px, type `{typography.caption-sm}`, rounded `{rounded.none}`.
- Right-aligned cluster: locale selector / "Login" / "Account". Always present at the very top of the page.

**`primary-nav`**
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, height 64px, type `{typography.body-strong}`, rounded `{rounded.none}`.
- Layout: NVIDIA wordmark at left, centered nav row ("Products / Solutions / Industries / Resources / Support / Company"), right cluster (search-glyph + "Login" button + green CTA "Get Started").

**`breadcrumb-bar`**
- Background `{colors.surface-soft}`, text `{colors.body}`, height 48px, type `{typography.caption-md}` (uppercase).
- Sits directly under the primary nav on every interior page; chevron separators in `{colors.mute}`.

**`sub-nav-strip`**
- Background `{colors.surface-soft}`, text `{colors.ink}`, height 56px, type `{typography.button-md}`, rounded `{rounded.none}`.
- Section-specific nav anchored above content (e.g., "Healthcare → Drug Discovery / Medical Imaging / Genomics / Patient Care").

**Top Nav (Mobile)**
- Hamburger menu icon (left), NVIDIA wordmark (center), search + locale icons (right). Primary nav collapses into a full-screen drawer that slides in from the right.

### Footer

**`footer-section`**
- Background `{colors.surface-dark}`, text `{colors.on-dark-mute}`, padding `{spacing.section}` (64px) vertical / 48px horizontal, rounded `{rounded.none}`.
- Layout: 6-column link grid (Products / Software / Resources / Company Info / Solutions / Support) with column headers in `{typography.body-strong}` `{colors.on-dark}` and link lists in `{typography.body-sm}` `{colors.on-dark-mute}`.
- Below the columns: social-icon strip + locale selector + legal/privacy fine-print row in `{typography.utility-xs}` (uppercase) `{colors.mute}`.

### Inline

**`link-inline`**
- Body-prose anchor link: `{colors.link-blue}` text with underline. The ONLY blue in the system — appears nowhere except inline links inside `{typography.body-md}` paragraphs.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` for primary CTAs, active states, decorative corner squares, and the NVIDIA wordmark itself. Treat it as a precious resource.
- Stack hero/footer chapters in `{colors.surface-dark}` and body sections in `{colors.canvas}` — alternate them in a predictable rhythm down the page.
- Anchor a `{component.corner-square}` to one corner of every reusable card. It is the system''s identity tag.
- Use `{rounded.sm}` (2px) on every interactive element. Never go to 0, never go past 4.
- Build hierarchy from font weight (400 vs 700) and size, not from color tinting. Body text stays `{colors.ink}` or `{colors.body}` regardless of context.
- Stack content sections at `{spacing.section}` (64px) rhythm with no decorative dividers between them.
- Pair `{component.button-primary}` (green fill) with `{component.button-outline}` (green border) for primary + secondary action pairs.

### Don''t
- Don''t introduce drop shadows on cards or content surfaces. The only allowed shadow is the 5px ambient on sticky chrome.
- Don''t substitute `{colors.success-deep}`, `{colors.accent-green-pale}`, or any other green for `{colors.primary}` in CTAs. The brand green is precise.
- Don''t use `{colors.link-blue}` outside of inline body-prose links. It is not a button color, not a chrome color.
- Don''t soften the geometry. No pill buttons, no rounded cards, no `{rounded.lg}` or higher anywhere except avatars and social icons.
- Don''t pad the hero `{component.hero-card-dark}` symmetrically. Copy hugs the left third; imagery fills the right.
- Don''t add a second accent color for variety. The system is intentionally one-color.
- Don''t put `{component.button-primary}` on a `{colors.canvas}` background where green-on-white would clash with photo content — use `{component.button-outline}` instead and reserve fill for dark surfaces.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Content max-width holds at 1280px; outer gutters grow to ~80px |
| desktop-large | 1440px | Default desktop layout — 4-up card grid, 6-col footer |
| desktop | 1280px | Same as large with slightly narrower outer gutters |
| desktop-small | 1024px | 4-up cards collapse to 3-up; sub-nav remains horizontal |
| tablet | 768px | 3-up cards collapse to 2-up; primary nav becomes hamburger drawer |
| mobile | 480px | Single-column everything; footer columns collapse to accordion |
| mobile-narrow | 320px | Hero `{typography.display-xl}` scales from 48px → 32px |

### Touch Targets
All interactive elements meet WCAG AA (≥ 44×44px). `{component.button-primary}` sits at 44px height with 24px horizontal padding. `{component.text-input}` sits at 44px. `{component.pill-tab}` sits at ~40px height with extended hit-target padding to 44px. `{component.button-outline}` matches the 44px standard. Footer links are 18–20px line-height with 8–12px vertical padding to keep tap targets at ~36–44px depending on link length.

### Collapsing Strategy
- **Primary nav:** desktop center cluster → tablet hamburger drawer at 768px.
- **Card grid:** 4-up → 3-up → 2-up → 1-up at 1024, 768, and 480px; gutters drop from 24px to 16px on mobile.
- **Footer:** 6-up link columns → 2-up at tablet → full accordion at mobile (each column header becomes a tap-to-expand row).
- **Hero copy:** desktop `{typography.display-xl}` (48px) → tablet 36px → mobile 32px; line-height holds at 1.25.
- **Sub-nav strip:** desktop horizontal anchor row → tablet horizontal scroll → mobile collapses into a select dropdown.
- **Section padding:** `{spacing.section}` (64px) desktop → 48px tablet → 32px mobile.
- **Long-form text:** desktop 60/40 body+sidebar → tablet/mobile single-column with sidebar pushed to the bottom.

### Image Behavior
- Hero imagery uses art-direction crops: 16:9 wide hero on desktop swaps to 4:5 portrait on mobile so the subject stays centered and headline text still has overlay space.
- Card imagery is a fixed aspect (16:9 for resource, 1:1 for product) that scales rather than re-crops between breakpoints.
- All non-critical imagery is lazy-loaded as the user scrolls into the next grid row.

## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry from the front matter and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-active}`, `{rounded.sm}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-active`, `-disabled`, `-focused`) — do not bury them inside prose.
5. Default body to `{typography.body-md}`; reach for `{typography.body-strong}` for emphasis; reserve `{typography.display-xl}` strictly for hero chapter headlines.
6. Keep `{colors.primary}` scarce per viewport — if more than one solid-green CTA appears in the same fold, neutralize one to `{component.button-outline}`.
7. When introducing a new component, ask whether it can be expressed with the existing card + 2px-radius + corner-square + green-CTA vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.

## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes NVIDIA''s known mobile pattern (hamburger drawer, accordion footer, 1-up card grid, hero downscale) from desktop evidence and the documented breakpoint stack.
- **Hover states not documented** by system policy.
- **Dialog / modal styling** beyond the locale-selector overlay not visible in the captured surfaces.
- **Form field styling** for full sign-up / contact forms is not present in the captured surfaces — only inline search and basic text inputs are documented.
- **Login / authenticated chrome** not in the captured pages.
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

NVIDIA''s marketing system is built like a piece of engineering documentation that learned graphic design — every page is a structured cascade of dense, factual information arranged on a paper-white grid, framed top and bottom by deep black hero/footer chapters. There is exactly one accent color in the entire system, and it is doing all the work: NVIDIA Green (`{colors.primary}` — `#76b900`), used for every primary CTA, every active tab, every link affordance on dark surfaces, and the small decorative corner squares that mark out card containers. Nothing else competes for attention.

The system''s character comes from extreme typographic restraint and an almost punishingly angular geometry. Every container, button, and image uses `{rounded.sm}` (2px) — a token that''s barely-there but never zero, giving the system the precise, technical feel of CAD output rather than warm consumer software. Cards sit on plain `{colors.canvas}` with a hairline `{colors.hairline}` border (no shadow, no elevation), separated by tight 8px-base spacing rhythm. Long-form pages stack 6–10 of these cards into multi-column technical grids without ever introducing decorative breaks.

The black-canvas hero and footer chapters are the system''s "headline moments" — a single full-bleed photographic or 3D-rendered image with `{typography.display-xl}` headline copy laid in white, a single green CTA button, and a small green corner square as the only ornamentation. Everything else is subordinate.

**Key Characteristics:**
- Single-accent system: `{colors.primary}` carries every CTA, active state, and decorative motif. The rest is monochrome black/white/gray.
- Two-mode surface architecture: `{colors.surface-dark}` for hero/footer chapters; `{colors.canvas}` for body — alternating in a predictable rhythm down the page
- Hyper-angular geometry: `{rounded.sm}` (2px) on every interactive element. There are no pill buttons, no rounded cards, no soft chrome.
- NVIDIA-EMEA proprietary sans-serif at weights 400 and 700, scaled across a 12-tier hierarchy from `{typography.utility-xs}` (10px) up to `{typography.display-xl}` (48px)
- Card library leans on hairline `{colors.hairline}` borders and `{colors.surface-soft}` backgrounds rather than shadows for separation
- Signature decorative element: the small `{component.corner-square}` (~12px green square) anchored to one corner of resource and feature cards
- Dense multi-column footer with 4–6 link columns on `{colors.surface-dark}` — every page closes with the same structured global navigation', '{"sourcePath":"docs/design-md/nvidia/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> **Source pages:** `/tr-tr/` (primary homepage), `/en-eu/industries/healthcare-life-sciences/`, `/en-eu/solutions/ai/`, `/en-eu/ai/foundry/`. The chrome palette is identical across all four — only photography and copy vary.

### Brand & Accent
- **NVIDIA Green** (`{colors.primary}` — `#76b900`): the brand. Every primary CTA, every active state, every link affordance on dark surfaces, every corner square, and the brand wordmark itself.
- **NVIDIA Green Dark** (`{colors.primary-dark}` — `#5a8d00`): pressed state for the primary button — a single notch deeper than the brand green.
- **Accent Green Pale** (`{colors.accent-green-pale}` — `#bff230`): rare highlight tint used in editorial callouts and decorative micro-blocks; never on chrome.

### Surface
- **Page Canvas** (`{colors.canvas}` — `#ffffff`): the body of every page. Cards sit directly on it with hairline rules.
- **Soft Surface** (`{colors.surface-soft}` — `#f7f7f7`): breadcrumb strip, sub-nav, side-by-side comparison panels, alternating row backgrounds.
- **Black Canvas** (`{colors.surface-dark}` — `#000000`): hero chapter, dark CTA strips, footer, primary nav. The system''s "frame" color.
- **Surface Elevated** (`{colors.surface-elevated}` — `#1a1a1a`): nested dark panels inside the footer (column dividers, fine-print bar).
- **Hairline** (`{colors.hairline}` — `#cccccc`): 1px card border, table rule, divider between footer link sections.
- **Hairline Strong** (`{colors.hairline-strong}` — `#5e5e5e`): 1px divider on dark surfaces (footer column rules, dark-mode card edges).

### Text
- **Ink** (`{colors.ink}` — `#000000`): headlines and body text on `{colors.canvas}`.
- **Body** (`{colors.body}` — `#1a1a1a`): long-form paragraph text where pure black is too heavy.
- **Mute** (`{colors.mute}` — `#757575`): metadata, breadcrumb separators, footer copyright.
- **Stone** (`{colors.stone}` — `#898989`): least-emphasis text and disabled state.
- **Ash** (`{colors.ash}` — `#a7a7a7`): disabled icon color and faint utility text.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.surface-dark}`.
- **On Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.7)`): secondary footer link text and dark-canvas body copy.

### Semantic
- **Error** (`{colors.error}` — `#e52020`): validation messages, destructive confirmation.
- **Error Deep** (`{colors.error-deep}` — `#650b0b`): pressed state for error buttons; hover-pressed validation icons.
- **Warning** (`{colors.warning}` — `#df6500`): caution callouts, deprecated documentation banners.
- **Warning Bright** (`{colors.warning-bright}` — `#ef9100`): inverse warning on dark canvas.
- **Success Deep** (`{colors.success-deep}` — `#3f8500`): positive confirmation where NVIDIA Green''s saturation would clash.
- **Link Blue** (`{colors.link-blue}` — `#0046a4`): inline anchor link color on light canvas — the only blue in the system, reserved for prose-embedded hyperlinks.

### Editorial Accents (used sparingly inside long-form content)
- **Accent Purple** (`{colors.accent-purple}` — `#952fc6`): research / scientific computing editorial accent.
- **Accent Purple Deep** (`{colors.accent-purple-deep}` — `#4d1368`): paired dark for purple lockups.
- **Accent Purple Pale** (`{colors.accent-purple-pale}` — `#f9d4ff`): wash background for editorial callouts.
- **Accent Yellow Pale** (`{colors.accent-yellow-pale}` — `#feeeb2`): documentation tip / soft callout fill.', '{"sourcePath":"docs/design-md/nvidia/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
- **NVIDIA-EMEA** is the proprietary brand sans-serif used across every text role on the site. It carries weights 400 (regular) and 700 (bold) and falls back to Arial → Helvetica.
- **Font Awesome 6 Pro** and **Font Awesome 6 Sharp** are used exclusively for iconography (chevrons, social glyphs, breadcrumb separators, search/menu icons) at sizes 14–22px.

NVIDIA''s type system is unusually flat: most chrome and body roles render at the same line-height (1.25–1.5) with the only meaningful variation coming from weight (400 vs 700) and size. The system relies on weight contrast — not size jumps and not color tinting — to establish hierarchy, which gives marketing copy and technical documentation an editorial newspaper feel.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 48px | 700 | 1.25 | 0 | Hero headline on `{component.hero-card-dark}` |
| `{typography.display-lg}` | 36px | 700 | 1.25 | 0 | Section headline ("Explore Our AI Solutions"), large stat callouts |
| `{typography.heading-xl}` | 24px | 700 | 1.25 | 0 | Sub-section title, dark CTA-strip headline |
| `{typography.heading-lg}` | 22px | 400 | 1.75 | 0 | Long-form intro paragraph that doubles as a heading |
| `{typography.heading-md}` | 20px | 700 | 1.25 | 0 | Card group title, sub-nav anchor heading |
| `{typography.heading-sm}` | 18px | 700 | 1.4 | 0 | Side-rail filter group, small section label |
| `{typography.card-title}` | 17px | 700 | 1.47 | 0 | Resource card title, product card title |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Body copy, default paragraph |
| `{typography.body-strong}` | 16px | 700 | 1.5 | 0 | Inline emphasis, primary nav link, label |
| `{typography.body-sm}` | 15px | 400 | 1.67 | 0 | Card description, secondary copy |
| `{typography.button-lg}` | 18px | 700 | 1.25 | 0 | Hero primary CTA |
| `{typography.button-md}` | 16px | 700 | 1.25 | 0 | Standard primary/secondary buttons |
| `{typography.button-sm}` | 14.4px | 700 | 1 | 0.144px | Compact pill tab, in-card secondary CTA |
| `{typography.link-md}` | 15px | 400 | 1.5 | 0 | Inline anchor link in body prose |
| `{typography.caption-md}` | 14px | 700 | 1.43 | 0 | Eyebrow over section heading, breadcrumb (uppercase) |
| `{typography.caption-sm}` | 12px | 400 | 1.25 | 0 | Footnote copy, metadata, table caption |
| `{typography.caption-xs}` | 11px | 700 | 1 | 0 | Pill chip label, utility-bar text |
| `{typography.utility-xs}` | 10px | 700 | 1.5 | 0 | Legal fine-print bar at the very bottom (uppercase) |

### Principles
The typography is brand-locked: NVIDIA-EMEA is used at every level, no serif, no display variant, no monospace, no italic. Hierarchy is built almost entirely from size and weight — color is reserved for emphasis (`{colors.primary}` on links over dark, `{colors.link-blue}` on light) and never used to separate type tiers.

### Note on Font Substitutes
NVIDIA-EMEA is proprietary. The closest open-source pairing is **Inter** (weights 400/700) — its x-height and stroke contrast match NVIDIA-EMEA''s optical metrics within ~2% at body sizes. **Arial** is the official documented fallback and is acceptable for any system where Inter is unavailable. Avoid Helvetica Now or Helvetica Neue substitutes; their slightly tighter cap heights drift away from the brand''s geometry.', '{"sourcePath":"docs/design-md/nvidia/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 8px
- **Tokens (front matter):** `{spacing.xxs}` (2px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (64px)
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (64px) as the vertical gap between major content blocks. Card grids use `{spacing.xl}` (24px) gutters; in-card padding sits at `{spacing.xl}` to `{spacing.xxl}` depending on density.
- **Hero chapter padding:** 80px vertical / 48px horizontal — the largest spacing in the system, reserved for `{component.hero-card-dark}`.

### Grid & Container
- **Max width:** ~1280px content area at desktop, with 24px gutters that grow to ~48px at ultrawide.
- **Column patterns:**
  - Card grids: 4-up at desktop, 3-up at 1024px, 2-up at 768px, 1-up at 480px.
  - Long-form text: 2-column 60/40 split (body + sidebar) at desktop, single-column at < 960px.
  - Footer: 6-up link columns at desktop, collapsing to 2-up on tablet, full accordion on mobile.
- **Card aspect:** product cards lean to 1:1 or 4:3 with 16:9 imagery on top + 1–2 lines of metadata below. Resource cards are 3:2 imagery with a longer description block.

### Whitespace Philosophy
Whitespace is structural, not atmospheric. Sections butt against each other with `{spacing.section}` rhythm — there are no decorative dividers, no empty "breathing room" bands, no gradient transitions between sections. The sense of air comes from `{colors.canvas}` body sections sandwiched between `{colors.surface-dark}` chapter blocks, not from generous padding inside any one component.', '{"sourcePath":"docs/design-md/nvidia/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Canvas-on-canvas blocks, hero chapter content, footer column body |
| 1 — Hairline border | 1px solid `{colors.hairline}` | All cards on `{colors.canvas}`, table cells, comparison panels |
| 2 — Hairline strong | 1px solid `{colors.hairline-strong}` | Dividers on `{colors.surface-dark}` (footer column rules, dark-card edges) |
| 3 — Soft shadow | `0 0 5px 0 rgba(0,0,0,0.3)` | Sticky nav bottom edge when scrolled, sticky CTA bar — used very sparingly |

NVIDIA''s system has effectively no drop-shadow elevation in card or content surfaces. The only "shadow" in the extracted tokens is a subtle 5px ambient on sticky chrome bars. Cards do not lift; cards are flat rectangles with hairline borders.

### Decorative Depth
Depth in NVIDIA''s system comes from photography and 3D-rendered hero imagery rather than from CSS effects:
- **Hero imagery:** full-bleed photographic or rendered scenes (data-center hardware, neural-net visualizations, life-sciences microscopy) sit behind hero copy with a dark gradient overlay for legibility.
- **Decorative corner squares:** the small `{component.corner-square}` (~12px solid `{colors.primary}` square) anchored to the top-left or bottom-right corner of resource and feature cards — the system''s only consistent ornamental device.
- **Editorial 3D accents:** isometric or wireframe 3D renderings appear as illustration-style fills inside long-form articles, never as chrome.', '{"sourcePath":"docs/design-md/nvidia/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero chapter, footer, dark CTA strips, primary nav |
| `{rounded.xs}` | 1px | Decorative micro-rules and inset accent strips |
| `{rounded.sm}` | 2px | Every interactive element — buttons, cards, inputs, pill tabs, badges |
| `{rounded.full}` | 9999px / 50% | Avatar circles, social-icon dots, brand wordmark icon |

The system is aggressively angular. Outside of avatar/icon circles, no element exceeds 2px radius. The 2px is enough to soften the optical aliasing on a sharp edge but small enough that the system reads as engineering-grade rather than consumer-friendly.

### Photography Geometry
- **Hero imagery:** full-bleed 16:9 (desktop) cropping to 4:5 portrait on mobile.
- **Card imagery:** 16:9 thumbnail at the top of resource cards; 1:1 square for product/SKU cards; 3:2 for editorial article cards.
- **Decorative corner squares:** 12×12px on standard cards, scaled to 16×16 on hero callouts.
- **Avatar/social icons:** 32–40px circles with 1px hairline.', '{"sourcePath":"docs/design-md/nvidia/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only; variants live as separate `components:` entries in the front matter.

### Buttons

**`button-primary`** — the universal NVIDIA CTA
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `11px 24px`, height `44px`, rounded `{rounded.sm}`.
- The single most-repeated component in the system: hero CTA, dark CTA strip, "Learn More" on every card group, "Sign Up" / "Get Started" on every long-form page bottom.
- Pressed state lives in `button-primary-active` — background drops to `{colors.primary-dark}` (`#5a8d00`) with the same text color.

**`button-outline`** — secondary on light canvas
- Background transparent, text `{colors.ink}`, 2px solid `{colors.primary}` border, type `{typography.button-md}`, padding `11px 13px`, rounded `{rounded.sm}`.
- The system''s most distinctive secondary CTA: a clear pane bordered in NVIDIA Green. Used for "Read the Documentation", "Watch the Video", "Compare Products" — second-tier actions that still earn the brand color.

**`button-outline-on-dark`** — outline on `{colors.surface-dark}`
- Background transparent, text `{colors.on-dark}`, 1px solid `{colors.on-dark}`, type `{typography.button-md}`, rounded `{rounded.sm}`.
- White-on-black variant used in dark hero/footer CTA strips paired with a primary green button.

**`button-ghost-link`** — inline arrow link
- Text `{colors.primary}` with a small right-arrow icon, type `{typography.button-md}`, no background, no border, rounded `{rounded.none}`.
- "Learn More →" affordance sitting at the bottom of resource cards and long-form section blocks. The arrow is uppercase and bold per `{typography.caption-md}`-equivalent treatment.

**`button-disabled`**
- Background `{colors.surface-soft}`, text `{colors.ash}`, rounded `{rounded.sm}` — flat gray.

### Tabs & Chips

**`pill-tab`** + **`pill-tab-active`**
- Default: transparent background, text `{colors.ink}`, type `{typography.button-sm}`, padding `10px 18px`, rounded `{rounded.sm}`.
- Active: background `{colors.ink}`, text `{colors.on-dark}` — the tab flips inverted on selection. Used in the "Latest in AI Resources" filter strip and similar segmented controls.

**`badge-tag`**
- Background `{colors.surface-soft}`, text `{colors.body}`, type `{typography.caption-md}`, padding `4px 10px`, rounded `{rounded.sm}` (uppercase).
- Document type / category labels at the top of resource cards ("WHITE PAPER", "WEBINAR", "BLOG").

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `12px 16px`, height `44px`, rounded `{rounded.sm}`.
- Focused: same surface, border becomes 2px solid `{colors.primary}` — the green border is the only focus signal in the system.

**`search-input`**
- Used in the global search overlay — same treatment as `text-input` but at 40px height with a magnifier glyph at left.

### Cards

**`product-card`**
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.sm}`.
- Layout: 16:9 product image at top, `{typography.card-title}` title, `{typography.body-sm}` description, `{component.button-ghost-link}` "Learn More →" affordance at bottom.
- The `{component.corner-square}` sits at the top-left corner.

**`feature-card`**
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.xxl}` (32px), rounded `{rounded.sm}`.
- Layout: icon (Font Awesome at 22–24px) at top in `{colors.primary}` followed by `{typography.heading-md}` title and `{typography.body-md}` body.
- Used in 3-up or 4-up grids that explain product capabilities ("Agentic AI", "Data Science", "Inference", "Conversational AI").

**`resource-card`**
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.xl}`, rounded `{rounded.sm}`.
- Header strip: `{component.badge-tag}` document-type label.
- Body: 3:2 thumbnail, `{typography.card-title}` title, `{typography.body-sm}` description.
- Footer: ghost-link "Read More →" with right-pointing chevron in `{colors.primary}`.

**`callout-stat`**
- Background `{colors.canvas}` with 1px hairline `{colors.hairline}`, padding `{spacing.xxl}`, rounded `{rounded.sm}`.
- Massive `{typography.display-lg}` (36px) numeric in `{colors.primary}` followed by `{typography.body-md}` caption underneath ("4× faster training", "60% lower cost", etc.). Used inside long-form industry pages.

### Hero & CTA Strips

**`hero-card-dark`**
- Background `{colors.surface-dark}` with full-bleed 16:9 photographic/3D image and dark gradient overlay; copy slot at left.
- `{typography.display-xl}` headline `{colors.on-dark}`, `{typography.heading-lg}` subhead, single `{component.button-primary}` CTA (sometimes paired with `{component.button-outline-on-dark}`).
- Anchors the top of every primary landing page.

**`cta-strip-dark`**
- Same surface as hero but compressed to a 1-row band with `{typography.heading-xl}` headline + single CTA.
- Sits between content sections as a "Ready to get started?" bridge.

### Decorative

**`corner-square`**
- 12×12px solid `{colors.primary}` square anchored to a card corner. The brand''s signature ornamental motif.
- Used on resource cards, feature cards, and editorial callouts. Position varies (top-left, bottom-right) but the size and color are constant.

### Navigation

**`utility-bar`**
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, height 32px, type `{typography.caption-sm}`, rounded `{rounded.none}`.
- Right-aligned cluster: locale selector / "Login" / "Account". Always present at the very top of the page.

**`primary-nav`**
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, height 64px, type `{typography.body-strong}`, rounded `{rounded.none}`.
- Layout: NVIDIA wordmark at left, centered nav row ("Products / Solutions / Industries / Resources / Support / Company"), right cluster (search-glyph + "Login" button + green CTA "Get Started").

**`breadcrumb-bar`**
- Background `{colors.surface-soft}`, text `{colors.body}`, height 48px, type `{typography.caption-md}` (uppercase).
- Sits directly under the primary nav on every interior page; chevron separators in `{colors.mute}`.

**`sub-nav-strip`**
- Background `{colors.surface-soft}`, text `{colors.ink}`, height 56px, type `{typography.button-md}`, rounded `{rounded.none}`.
- Section-specific nav anchored above content (e.g., "Healthcare → Drug Discovery / Medical Imaging / Genomics / Patient Care").

**Top Nav (Mobile)**
- Hamburger menu icon (left), NVIDIA wordmark (center), search + locale icons (right). Primary nav collapses into a full-screen drawer that slides in from the right.

### Footer

**`footer-section`**
- Background `{colors.surface-dark}`, text `{colors.on-dark-mute}`, padding `{spacing.section}` (64px) vertical / 48px horizontal, rounded `{rounded.none}`.
- Layout: 6-column link grid (Products / Software / Resources / Company Info / Solutions / Support) with column headers in `{typography.body-strong}` `{colors.on-dark}` and link lists in `{typography.body-sm}` `{colors.on-dark-mute}`.
- Below the columns: social-icon strip + locale selector + legal/privacy fine-print row in `{typography.utility-xs}` (uppercase) `{colors.mute}`.

### Inline

**`link-inline`**
- Body-prose anchor link: `{colors.link-blue}` text with underline. The ONLY blue in the system — appears nowhere except inline links inside `{typography.body-md}` paragraphs.', '{"sourcePath":"docs/design-md/nvidia/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` for primary CTAs, active states, decorative corner squares, and the NVIDIA wordmark itself. Treat it as a precious resource.
- Stack hero/footer chapters in `{colors.surface-dark}` and body sections in `{colors.canvas}` — alternate them in a predictable rhythm down the page.
- Anchor a `{component.corner-square}` to one corner of every reusable card. It is the system''s identity tag.
- Use `{rounded.sm}` (2px) on every interactive element. Never go to 0, never go past 4.
- Build hierarchy from font weight (400 vs 700) and size, not from color tinting. Body text stays `{colors.ink}` or `{colors.body}` regardless of context.
- Stack content sections at `{spacing.section}` (64px) rhythm with no decorative dividers between them.
- Pair `{component.button-primary}` (green fill) with `{component.button-outline}` (green border) for primary + secondary action pairs.

### Don''t
- Don''t introduce drop shadows on cards or content surfaces. The only allowed shadow is the 5px ambient on sticky chrome.
- Don''t substitute `{colors.success-deep}`, `{colors.accent-green-pale}`, or any other green for `{colors.primary}` in CTAs. The brand green is precise.
- Don''t use `{colors.link-blue}` outside of inline body-prose links. It is not a button color, not a chrome color.
- Don''t soften the geometry. No pill buttons, no rounded cards, no `{rounded.lg}` or higher anywhere except avatars and social icons.
- Don''t pad the hero `{component.hero-card-dark}` symmetrically. Copy hugs the left third; imagery fills the right.
- Don''t add a second accent color for variety. The system is intentionally one-color.
- Don''t put `{component.button-primary}` on a `{colors.canvas}` background where green-on-white would clash with photo content — use `{component.button-outline}` instead and reserve fill for dark surfaces.', '{"sourcePath":"docs/design-md/nvidia/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Content max-width holds at 1280px; outer gutters grow to ~80px |
| desktop-large | 1440px | Default desktop layout — 4-up card grid, 6-col footer |
| desktop | 1280px | Same as large with slightly narrower outer gutters |
| desktop-small | 1024px | 4-up cards collapse to 3-up; sub-nav remains horizontal |
| tablet | 768px | 3-up cards collapse to 2-up; primary nav becomes hamburger drawer |
| mobile | 480px | Single-column everything; footer columns collapse to accordion |
| mobile-narrow | 320px | Hero `{typography.display-xl}` scales from 48px → 32px |

### Touch Targets
All interactive elements meet WCAG AA (≥ 44×44px). `{component.button-primary}` sits at 44px height with 24px horizontal padding. `{component.text-input}` sits at 44px. `{component.pill-tab}` sits at ~40px height with extended hit-target padding to 44px. `{component.button-outline}` matches the 44px standard. Footer links are 18–20px line-height with 8–12px vertical padding to keep tap targets at ~36–44px depending on link length.

### Collapsing Strategy
- **Primary nav:** desktop center cluster → tablet hamburger drawer at 768px.
- **Card grid:** 4-up → 3-up → 2-up → 1-up at 1024, 768, and 480px; gutters drop from 24px to 16px on mobile.
- **Footer:** 6-up link columns → 2-up at tablet → full accordion at mobile (each column header becomes a tap-to-expand row).
- **Hero copy:** desktop `{typography.display-xl}` (48px) → tablet 36px → mobile 32px; line-height holds at 1.25.
- **Sub-nav strip:** desktop horizontal anchor row → tablet horizontal scroll → mobile collapses into a select dropdown.
- **Section padding:** `{spacing.section}` (64px) desktop → 48px tablet → 32px mobile.
- **Long-form text:** desktop 60/40 body+sidebar → tablet/mobile single-column with sidebar pushed to the bottom.

### Image Behavior
- Hero imagery uses art-direction crops: 16:9 wide hero on desktop swaps to 4:5 portrait on mobile so the subject stays centered and headline text still has overlay space.
- Card imagery is a fixed aspect (16:9 for resource, 1:1 for product) that scales rather than re-crops between breakpoints.
- All non-critical imagery is lazy-loaded as the user scrolls into the next grid row.', '{"sourcePath":"docs/design-md/nvidia/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry from the front matter and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-active}`, `{rounded.sm}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-active`, `-disabled`, `-focused`) — do not bury them inside prose.
5. Default body to `{typography.body-md}`; reach for `{typography.body-strong}` for emphasis; reserve `{typography.display-xl}` strictly for hero chapter headlines.
6. Keep `{colors.primary}` scarce per viewport — if more than one solid-green CTA appears in the same fold, neutralize one to `{component.button-outline}`.
7. When introducing a new component, ask whether it can be expressed with the existing card + 2px-radius + corner-square + green-CTA vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.', '{"sourcePath":"docs/design-md/nvidia/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes NVIDIA''s known mobile pattern (hamburger drawer, accordion footer, 1-up card grid, hero downscale) from desktop evidence and the documented breakpoint stack.
- **Hover states not documented** by system policy.
- **Dialog / modal styling** beyond the locale-selector overlay not visible in the captured surfaces.
- **Form field styling** for full sign-up / contact forms is not present in the captured surfaces — only inline search and basic text inputs are documented.
- **Login / authenticated chrome** not in the captured pages.', '{"sourcePath":"docs/design-md/nvidia/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_1', '#76b900', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_2', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_3', '#5a8d00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_4', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_5', '#f7f7f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_6', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_7', '#cccccc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_8', '#5e5e5e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_9', '#757575', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_10', '#898989', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_11', '#a7a7a7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_12', '#0046a4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_13', '#e52020', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_14', '#650b0b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_15', '#df6500', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_16', '#ef9100', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_17', '#3f8500', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_18', '#feeeb2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_19', '#952fc6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_20', '#4d1368', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_21', '#f9d4ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md'), 'color', 'color_22', '#bff230', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/nvidia/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/nvidia/DESIGN.md';

