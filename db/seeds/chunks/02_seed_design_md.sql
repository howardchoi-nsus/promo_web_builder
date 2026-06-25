-- Generated seed chunk 02
-- Run 000_prepare.sql once before running these chunks.
-- Documents: 10


-- Clickhouse
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Clickhouse', 'clickhouse', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/clickhouse/DESIGN.md', null, 'seeded', '---
version: alpha
name: ClickHouse-design-analysis
description: A high-performance database interface anchored on near-pure black canvas with electric yellow as the brand voltage. White typography in confident sans, yellow CTAs, and yellow-text stat numbers carry the brand voice across every page. Code blocks and product UI fragments embed directly in dark cards. The yellow + black pairing (and yellow used scarcely as accent) is the system''s signature — brand identity without atmospheric decoration.

colors:
  primary: "#faff69"
  primary-active: "#e6eb52"
  primary-disabled: "#3a3a1f"
  ink: "#ffffff"
  body: "#cccccc"
  body-strong: "#e6e6e6"
  muted: "#888888"
  muted-soft: "#5a5a5a"
  hairline: "#2a2a2a"
  hairline-strong: "#3a3a3a"
  canvas: "#0a0a0a"
  surface-soft: "#121212"
  surface-card: "#1a1a1a"
  surface-elevated: "#242424"
  surface-yellow-band: "#faff69"
  on-primary: "#0a0a0a"
  on-dark: "#ffffff"
  on-yellow: "#0a0a0a"
  accent-emerald: "#22c55e"
  accent-rose: "#ef4444"
  accent-blue: "#3b82f6"
  success: "#22c55e"
  warning: "#f59e0b"
  error: "#ef4444"

typography:
  display-xl:
    fontFamily: "Inter, sans-serif"
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -2.5px
  display-lg:
    fontFamily: "Inter, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -2px
  display-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -1.5px
  display-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -1px
  title-lg:
    fontFamily: "Inter, sans-serif"
    fontSize: 24px
    fontWeight: 700
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
  stat-display:
    fontFamily: "Inter, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -1.5px
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
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
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
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 40px
  button-text-link:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
  button-icon-circular:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    size: 36px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.nav-link}"
    height: 64px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xl}"
    padding: 96px
  hero-stat-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.stat-display}"
  feature-card-yellow:
    backgroundColor: "{colors.surface-yellow-band}"
    textColor: "{colors.on-yellow}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  feature-card-dark:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  code-window-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code}"
    rounded: "{rounded.lg}"
    padding: 24px
  product-mockup-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-tier-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-tier-card-featured:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  stat-callout:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.stat-display}"
  cta-band-yellow:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-md}"
    rounded: "{rounded.lg}"
    padding: 64px
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 14px
    height: 40px
  text-input-focused:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.md}"
  category-tab:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  category-tab-active:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.md}"
  badge-pill:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  badge-yellow:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  events-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  customer-logo-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.body-md}"
    padding: 32px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
    padding: 64px
---

## Overview

ClickHouse''s marketing surface is the highest-contrast interface in the database / data-platform category. The base atmosphere is **near-pure black canvas** (`{colors.canvas}` — #0a0a0a) with **electric yellow** (`{colors.primary}` — #faff69) as the singular brand voltage. The yellow handles every primary CTA, every stat-callout number, every "GET STARTED" badge — used scarcely on individual elements but generously on full-bleed yellow CTA cards. White typography in confident weight-700 sans-serif anchors the editorial body.

The yellow + black pairing is what makes ClickHouse instantly recognizable. Where Snowflake uses cool blue gradients and Databricks uses red + slate, ClickHouse leans hard into one electric yellow that does all the brand work. Code blocks, terminal output, and product UI fragments embed directly in dark `{colors.surface-card}` (#1a1a1a) cards across every page.

Type voice runs **Inter** at confident weights — 700 for display headlines (with negative letter-spacing -1 to -2.5px), 600 for sub-titles and buttons, 400 for body. The system has no display-serif counter-voice; everything is one geometric humanist sans, scaled and weighted for hierarchy.

**Key Characteristics:**
- Near-pure black canvas (`{colors.canvas}` — #0a0a0a) with white type. The system has no light-mode marketing surface.
- Electric yellow primary (`{colors.primary}` — #faff69). Used on primary CTAs, large stat-callout numbers ("2.8k+", "74k+"), and full-bleed yellow CTA bands.
- Inter at weight 700 for display, weight 600 for sub-titles + buttons, weight 400 for body. No serif counterpoint.
- Dark surface cards (`{colors.surface-card}` — #1a1a1a) for feature cards, code windows, and product mockups. Cards barely lighter than canvas — color-block contrast is subtle.
- Code blocks render in JetBrains Mono inside `{colors.surface-card}`. SQL syntax-highlighted in muted blues / yellows / grays.
- Stat numbers in yellow + sans-700 + huge size carry the credibility moment ("779+", "2.8k+", "47k+" community / contributor / star counts).
- Border radius is hierarchical: `{rounded.md}` (8px) for buttons, `{rounded.lg}` (12px) for content cards. No pill except in tag badges.
- Section rhythm `{spacing.section}` (96px) between major editorial bands.

## Colors

### Brand & Accent
- **Primary (Electric Yellow)** (`{colors.primary}` — #faff69): The signature brand color. All primary CTA backgrounds, large stat-callout numbers, full-bleed yellow CTA cards. The yellow is the brand.
- **Primary Active** (`{colors.primary-active}` — #e6eb52): Press / hover-darker variant.
- **Primary Disabled** (`{colors.primary-disabled}` — #3a3a1f): Desaturated dark-yellow on dark canvas.

### Surface
- **Canvas** (`{colors.canvas}` — #0a0a0a): The default page floor. Near-pure black.
- **Surface Soft** (`{colors.surface-soft}` — #121212): Section dividers, very-soft band tints.
- **Surface Card** (`{colors.surface-card}` — #1a1a1a): Feature cards, code windows, product mockups, pricing tier cards.
- **Surface Elevated** (`{colors.surface-elevated}` — #242424): Nested cards inside larger dark cards.
- **Surface Yellow Band** (`{colors.surface-yellow-band}` — #faff69): The yellow CTA card / band fill — same hex as primary.
- **Hairline** (`{colors.hairline}` — #2a2a2a): 1px borders on cards.
- **Hairline Strong** (`{colors.hairline-strong}` — #3a3a3a): Heavier divider on input underlines and emphasis.

### Text
- **Ink / On Dark** (`{colors.on-dark}` — #ffffff): All headline and primary text.
- **Body** (`{colors.body}` — #cccccc): Default running-text color.
- **Body Strong** (`{colors.body-strong}` — #e6e6e6): Emphasized paragraphs.
- **Muted** (`{colors.muted}` — #888888): Footer links, captions, breadcrumbs.
- **Muted Soft** (`{colors.muted-soft}` — #5a5a5a): Tertiary text — fine print.
- **On Primary / On Yellow** (`{colors.on-primary}` / `{colors.on-yellow}` — #0a0a0a): Black text on yellow CTAs and yellow CTA bands. The high-contrast yellow + black combo is the brand action signal.

### Semantic / Accent
- **Accent Emerald** (`{colors.accent-emerald}` — #22c55e): Success states, "active" status indicators in product UI.
- **Accent Rose** (`{colors.accent-rose}` — #ef4444): Error states, "down" indicators.
- **Accent Blue** (`{colors.accent-blue}` — #3b82f6): Info states, code-syntax highlighting.

## Typography

### Font Family
The system runs **Inter** for everything — display, body, navigation, buttons, captions. **JetBrains Mono** handles code blocks. The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

The single-family approach is deliberate: Inter at weight 700 + 600 + 400 covers the entire hierarchy without needing a serif or display counter-voice. The geometric humanist character of Inter at confident bold weight gives ClickHouse a precise, engineered feel that matches the database''s performance-first positioning.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 72px | 700 | 1.05 | -2.5px | Homepage h1 ("The leading database for AI") |
| `{typography.display-lg}` | 56px | 700 | 1.1 | -2px | Section heads |
| `{typography.display-md}` | 40px | 700 | 1.15 | -1.5px | Sub-section heads, CTA-band heads |
| `{typography.display-sm}` | 32px | 700 | 1.2 | -1px | Card titles, pricing tier prices |
| `{typography.title-lg}` | 24px | 700 | 1.3 | -0.3px | Pricing plan names, larger feature titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Card titles, intro paragraphs |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Small card titles, list labels |
| `{typography.stat-display}` | 56px | 700 | 1.0 | -1.5px | Stat callouts ("779+", "47k+") — ALWAYS yellow |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Default running-text |
| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Footer body, fine-print |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
| `{typography.caption-uppercase}` | 12px | 600 | 1.4 | 1.5px | Section labels, "NEW" badges |
| `{typography.code}` | 14px | 400 | 1.55 | 0 | Code blocks — JetBrains Mono |
| `{typography.button}` | 14px | 600 | 1.0 | 0 | Standard button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
Display weights stay at 700 across all sizes. Negative letter-spacing (-1 to -2.5px) is essential — Inter at weight 700 without negative tracking reads as too wide / Apple-marketing. The tightened tracking gives ClickHouse the precise, engineered feel.

Body and labels stay at weights 400 / 500 / 600. The hierarchy is built on size + weight, not on family contrast.

### Note on Font Substitutes
Inter is open-source and the documented choice. **Söhne** is a close commercial alternative if licensed. **Geist** is another modern alternative.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) between major bands.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards, pricing tiers; `{spacing.lg}` (24px) for code-window cards and event cards.

### Grid & Container
- **Max content width:** ~1280px centered.
- **Editorial body:** Single 12-column grid; hero often uses 7/5 split (h1 left, code mockup right).
- **Feature card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Pricing grid:** 3-4 up at desktop, 1-up at mobile.

### Whitespace Philosophy
ClickHouse uses dense, slightly-compressed whitespace appropriate for a developer-tooling brand — generous enough to read editorially, tight enough to feel "engineering-grade" rather than "marketing-soft." Section rhythm at 96px is standard; card internal padding stays at 32px for feature cards.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero |
| Soft hairline | 1px `{colors.hairline}` border | Code-window cards, content cards |
| Surface card | `{colors.surface-card}` background — no shadow | Feature cards, pricing tiers, event cards |
| Yellow band | `{colors.primary}` background — no shadow | Full-bleed yellow CTA cards / bands |

The system uses no drop shadows. Depth comes from the contrast between black canvas and `{colors.surface-card}` (a barely-lighter-than-canvas tone) — the contrast is subtle, more like an "engineering-grade dim panel" than an "elevated card."

### Decorative Depth
- Code-window cards carry their own internal product chrome — line numbers, syntax highlighting, status bars at the bottom — adding visual density without external shadows.
- The yellow-on-black contrast does most of the elevation work for CTAs.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Reserved for badge accents |
| `{rounded.sm}` | 6px | Small inline buttons |
| `{rounded.md}` | 8px | Standard CTA buttons, text inputs |
| `{rounded.lg}` | 12px | Content cards, code-window cards, pricing tiers |
| `{rounded.pill}` | 9999px | Badge pills |
| `{rounded.full}` | 9999px / 50% | Avatars, icon buttons |

## Components

### Top Navigation

**`top-nav`** — Black nav bar pinned to top. 64px tall, `{colors.canvas}` background. Carries the ClickHouse logo + wordmark at left, primary horizontal menu (Product, Use Cases, Pricing, Resources, Customers) center-left, right-side cluster with "Sign in" + "Get Started" `{component.button-primary}` (yellow). Menu items in `{typography.nav-link}` (Inter 14px / 500).

### Buttons

**`button-primary`** — The signature yellow CTA. Background `{colors.primary}` (#faff69), text `{colors.on-primary}` (black), type `{typography.button}` (Inter 14px / 600), padding 12px × 20px, height 40px, rounded `{rounded.md}` (8px). The yellow + black combination is iconic.

**`button-secondary`** — Dark surface card button. Background `{colors.surface-card}`, text `{colors.on-dark}`, same shape as primary.

**`button-text-link`** — Inline text button, no background. Used for "Sign in" and inline link CTAs.

**`text-link`** — Inline body links in `{colors.primary}` (yellow on dark). Underlined.

**`button-icon-circular`** — 36 × 36 circular icon button on dark.

### Cards & Containers

**`hero-band`** — Black-canvas hero with 7-5 grid: h1 + sub-headline + button row on the left, code-window or product mockup on the right. Vertical padding `{spacing.section}` (96px).

**`hero-stat-card`** — Yellow stat-display numbers ("779+", "47k+") inline on the canvas. No card surface — just yellow text in `{typography.stat-display}` (56px / 700).

**`feature-card-yellow`** — Full-bleed yellow card ("Built for every modern data challenge"). Background `{colors.primary}`, text `{colors.on-yellow}` (black), rounded `{rounded.lg}` (12px), padding `{spacing.xl}` (32px). The yellow card IS the visual emphasis.

**`feature-card-dark`** — Standard dark feature card. Background `{colors.surface-card}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px).

**`code-window-card`** — Dark card showing a SQL code block. Background `{colors.surface-card}`, code in JetBrains Mono with syntax highlighting, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Often the hero''s right-side artifact on developer-focused pages.

**`product-mockup-card`** — Card showing actual ClickHouse product UI (query editor, dashboard, monitoring panel). Same shape as `{component.feature-card-dark}` but with embedded product chrome inside.

**`pricing-tier-card`** — Standard tier card. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px).

**`pricing-tier-card-featured`** — The featured tier flips to `{colors.primary}` (yellow). The yellow surface IS the featured signal.

**`stat-callout`** — Inline yellow stat numbers ("779+", "2.8k+", "47k+"). Transparent background, text `{colors.primary}`, type `{typography.stat-display}`. Used as a flat layout block, not a card with surface.

**`events-card`** — Used on /company/events. Dark card with event title, date in `{typography.caption-uppercase}`, location, and a "Register" CTA. Rounded `{rounded.lg}`, padding `{spacing.lg}`.

**`customer-logo-strip`** — Horizontal monochrome customer-logo strip. Background `{colors.canvas}`, logos in `{colors.muted}`, vertical padding `{spacing.xl}` (32px).

### Inputs & Forms

**`text-input`** — Dark text input. Background `{colors.surface-card}`, text `{colors.on-dark}`, rounded `{rounded.md}` (8px), padding 10px × 14px, height 40px.

**`text-input-focused`** — Border thickens to `{colors.primary}` (yellow) for emphasis.

### Tags / Badges

**`badge-pill`** — Small dark pill label. Background `{colors.surface-card}`, text `{colors.on-dark}`, type `{typography.caption}`, rounded `{rounded.pill}`.

**`badge-yellow`** — Yellow pill for "NEW", "GET STARTED" emphasis. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`.

### Tab / Filter

**`category-tab`** + **`category-tab-active`** — Dark tab navigation. Inactive: transparent + muted text. Active: surface-card background + on-dark text. Padding 8px × 14px, rounded `{rounded.md}`.

### CTA / Footer

**`cta-band-yellow`** — A pre-footer "Deploy your way" CTA band. Full yellow fill, black type, rounded `{rounded.lg}`, padding 64px. Carries an h2 in `{typography.display-md}` and a CTA — usually a black-button on the yellow surface.

**`footer`** — Black footer that closes every page. Background `{colors.canvas}`, text `{colors.muted}`. 4-column link list at desktop covering Product / Use Cases / Resources / Company. Vertical padding 64px. The ClickHouse wordmark sits at the top in `{colors.on-dark}`.

## Do''s and Don''ts

### Do
- Anchor every page on the black canvas. The yellow + black pairing is the brand voltage.
- Reserve `{colors.primary}` (yellow) for primary CTAs, stat-callout numbers, and full-bleed yellow CTA bands. The yellow''s scarcity at the element level + abundance at the band level is what makes it powerful.
- Use Inter at weight 700 for every display headline, with -1 to -2.5px letter-spacing.
- Show actual SQL code blocks inside `{component.code-window-card}` — ClickHouse is a database; show the query, don''t paint marketing illustrations of queries.
- Use `{component.stat-callout}` numbers to establish credibility (community size, contributors, performance benchmarks). The yellow stat numbers are signature.
- Anchor every band with `{spacing.section}` (96px) vertical rhythm.

### Don''t
- Don''t introduce a second brand color. ClickHouse is monochromatic + yellow.
- Don''t bold display weight beyond 700 or use weight 500 for headlines. The hierarchy depends on size, not on weight gradation.
- Don''t use yellow for body text or large surface fills outside of intentional yellow cards.
- Don''t use rounded buttons / pills outside of small badges. The standard button radius is 8px (md).
- Don''t repeat the same surface mode in two consecutive bands. Black canvas → dark feature card → yellow CTA card → black canvas → code-window card.
- Don''t replace SQL code mockups with abstract illustrations. The code IS the marketing voltage.
- Don''t add hover state styling beyond what the system already encodes.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 72→36px; code-window-card stacks below; feature grids 1-up; pricing 1-up |
| Tablet | 768–1024px | Top nav tightens; feature cards 2-up; pricing 2-up |
| Desktop | 1024–1440px | Full top-nav; 3-up feature cards; 3-4 up pricing tiers |
| Wide | > 1440px | Same as desktop with more breathing room; max content 1280px |

### Touch Targets
- `{component.button-primary}` at minimum 40 × 40px.
- `{component.button-icon-circular}` at exactly 36 × 36 — slightly under WCAG 44, visually centered.
- `{component.text-input}` height is 40px.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px.
- Hero 7-5 grid → single-column on mobile.
- Feature card grids reduce columns rather than scaling.
- Code-window cards retain font-size; horizontal scroll inside the card on mobile.
- Pricing tier cards collapse 4 → 2 → 1; featured tier yellow stays distinct.

### Image Behavior
- Code blocks inside dark mockups stay at fixed font-size; horizontal scroll on mobile rather than wrapping.
- Customer logos in monochrome strip retain native widths; row wraps on mobile.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.code-window-card}`, `{component.pricing-tier-card-featured}`).
2. Variants of an existing component (`-active`, `-disabled`, `-focused`) live as separate entries.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay Inter 700 with negative letter-spacing. Body stays Inter 400.
6. The yellow + black pairing is the brand contract. Don''t soften with secondary accents.
7. When in doubt about emphasis: bigger Inter 700 before adding color.

## Known Gaps

- The exact yellow hex (#faff69) was sampled from the screenshot; ClickHouse may publish an official brand color slightly differently.
- Inter weight axis values beyond 400 / 500 / 600 / 700 are not formalized — only the static weights observed are documented.
- Animation and transition timings (code typewriter effects, stat counter animations) are not in scope.
- Form validation states beyond `{component.text-input-focused}` are not extracted.
- The actual ClickHouse Cloud product surface (query console, monitoring dashboards, table browser) shares some tokens with the marketing site but adds many product-specific components that are out of scope.
- The customer logo strip''s exact opacity / treatment varies — the muted gray is approximate.
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

ClickHouse''s marketing surface is the highest-contrast interface in the database / data-platform category. The base atmosphere is **near-pure black canvas** (`{colors.canvas}` — #0a0a0a) with **electric yellow** (`{colors.primary}` — #faff69) as the singular brand voltage. The yellow handles every primary CTA, every stat-callout number, every "GET STARTED" badge — used scarcely on individual elements but generously on full-bleed yellow CTA cards. White typography in confident weight-700 sans-serif anchors the editorial body.

The yellow + black pairing is what makes ClickHouse instantly recognizable. Where Snowflake uses cool blue gradients and Databricks uses red + slate, ClickHouse leans hard into one electric yellow that does all the brand work. Code blocks, terminal output, and product UI fragments embed directly in dark `{colors.surface-card}` (#1a1a1a) cards across every page.

Type voice runs **Inter** at confident weights — 700 for display headlines (with negative letter-spacing -1 to -2.5px), 600 for sub-titles and buttons, 400 for body. The system has no display-serif counter-voice; everything is one geometric humanist sans, scaled and weighted for hierarchy.

**Key Characteristics:**
- Near-pure black canvas (`{colors.canvas}` — #0a0a0a) with white type. The system has no light-mode marketing surface.
- Electric yellow primary (`{colors.primary}` — #faff69). Used on primary CTAs, large stat-callout numbers ("2.8k+", "74k+"), and full-bleed yellow CTA bands.
- Inter at weight 700 for display, weight 600 for sub-titles + buttons, weight 400 for body. No serif counterpoint.
- Dark surface cards (`{colors.surface-card}` — #1a1a1a) for feature cards, code windows, and product mockups. Cards barely lighter than canvas — color-block contrast is subtle.
- Code blocks render in JetBrains Mono inside `{colors.surface-card}`. SQL syntax-highlighted in muted blues / yellows / grays.
- Stat numbers in yellow + sans-700 + huge size carry the credibility moment ("779+", "2.8k+", "47k+" community / contributor / star counts).
- Border radius is hierarchical: `{rounded.md}` (8px) for buttons, `{rounded.lg}` (12px) for content cards. No pill except in tag badges.
- Section rhythm `{spacing.section}` (96px) between major editorial bands.', '{"sourcePath":"docs/design-md/clickhouse/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Primary (Electric Yellow)** (`{colors.primary}` — #faff69): The signature brand color. All primary CTA backgrounds, large stat-callout numbers, full-bleed yellow CTA cards. The yellow is the brand.
- **Primary Active** (`{colors.primary-active}` — #e6eb52): Press / hover-darker variant.
- **Primary Disabled** (`{colors.primary-disabled}` — #3a3a1f): Desaturated dark-yellow on dark canvas.

### Surface
- **Canvas** (`{colors.canvas}` — #0a0a0a): The default page floor. Near-pure black.
- **Surface Soft** (`{colors.surface-soft}` — #121212): Section dividers, very-soft band tints.
- **Surface Card** (`{colors.surface-card}` — #1a1a1a): Feature cards, code windows, product mockups, pricing tier cards.
- **Surface Elevated** (`{colors.surface-elevated}` — #242424): Nested cards inside larger dark cards.
- **Surface Yellow Band** (`{colors.surface-yellow-band}` — #faff69): The yellow CTA card / band fill — same hex as primary.
- **Hairline** (`{colors.hairline}` — #2a2a2a): 1px borders on cards.
- **Hairline Strong** (`{colors.hairline-strong}` — #3a3a3a): Heavier divider on input underlines and emphasis.

### Text
- **Ink / On Dark** (`{colors.on-dark}` — #ffffff): All headline and primary text.
- **Body** (`{colors.body}` — #cccccc): Default running-text color.
- **Body Strong** (`{colors.body-strong}` — #e6e6e6): Emphasized paragraphs.
- **Muted** (`{colors.muted}` — #888888): Footer links, captions, breadcrumbs.
- **Muted Soft** (`{colors.muted-soft}` — #5a5a5a): Tertiary text — fine print.
- **On Primary / On Yellow** (`{colors.on-primary}` / `{colors.on-yellow}` — #0a0a0a): Black text on yellow CTAs and yellow CTA bands. The high-contrast yellow + black combo is the brand action signal.

### Semantic / Accent
- **Accent Emerald** (`{colors.accent-emerald}` — #22c55e): Success states, "active" status indicators in product UI.
- **Accent Rose** (`{colors.accent-rose}` — #ef4444): Error states, "down" indicators.
- **Accent Blue** (`{colors.accent-blue}` — #3b82f6): Info states, code-syntax highlighting.', '{"sourcePath":"docs/design-md/clickhouse/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The system runs **Inter** for everything — display, body, navigation, buttons, captions. **JetBrains Mono** handles code blocks. The fallback stack walks `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

The single-family approach is deliberate: Inter at weight 700 + 600 + 400 covers the entire hierarchy without needing a serif or display counter-voice. The geometric humanist character of Inter at confident bold weight gives ClickHouse a precise, engineered feel that matches the database''s performance-first positioning.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 72px | 700 | 1.05 | -2.5px | Homepage h1 ("The leading database for AI") |
| `{typography.display-lg}` | 56px | 700 | 1.1 | -2px | Section heads |
| `{typography.display-md}` | 40px | 700 | 1.15 | -1.5px | Sub-section heads, CTA-band heads |
| `{typography.display-sm}` | 32px | 700 | 1.2 | -1px | Card titles, pricing tier prices |
| `{typography.title-lg}` | 24px | 700 | 1.3 | -0.3px | Pricing plan names, larger feature titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Card titles, intro paragraphs |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Small card titles, list labels |
| `{typography.stat-display}` | 56px | 700 | 1.0 | -1.5px | Stat callouts ("779+", "47k+") — ALWAYS yellow |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Default running-text |
| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Footer body, fine-print |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
| `{typography.caption-uppercase}` | 12px | 600 | 1.4 | 1.5px | Section labels, "NEW" badges |
| `{typography.code}` | 14px | 400 | 1.55 | 0 | Code blocks — JetBrains Mono |
| `{typography.button}` | 14px | 600 | 1.0 | 0 | Standard button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
Display weights stay at 700 across all sizes. Negative letter-spacing (-1 to -2.5px) is essential — Inter at weight 700 without negative tracking reads as too wide / Apple-marketing. The tightened tracking gives ClickHouse the precise, engineered feel.

Body and labels stay at weights 400 / 500 / 600. The hierarchy is built on size + weight, not on family contrast.

### Note on Font Substitutes
Inter is open-source and the documented choice. **Söhne** is a close commercial alternative if licensed. **Geist** is another modern alternative.', '{"sourcePath":"docs/design-md/clickhouse/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) between major bands.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards, pricing tiers; `{spacing.lg}` (24px) for code-window cards and event cards.

### Grid & Container
- **Max content width:** ~1280px centered.
- **Editorial body:** Single 12-column grid; hero often uses 7/5 split (h1 left, code mockup right).
- **Feature card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Pricing grid:** 3-4 up at desktop, 1-up at mobile.

### Whitespace Philosophy
ClickHouse uses dense, slightly-compressed whitespace appropriate for a developer-tooling brand — generous enough to read editorially, tight enough to feel "engineering-grade" rather than "marketing-soft." Section rhythm at 96px is standard; card internal padding stays at 32px for feature cards.', '{"sourcePath":"docs/design-md/clickhouse/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero |
| Soft hairline | 1px `{colors.hairline}` border | Code-window cards, content cards |
| Surface card | `{colors.surface-card}` background — no shadow | Feature cards, pricing tiers, event cards |
| Yellow band | `{colors.primary}` background — no shadow | Full-bleed yellow CTA cards / bands |

The system uses no drop shadows. Depth comes from the contrast between black canvas and `{colors.surface-card}` (a barely-lighter-than-canvas tone) — the contrast is subtle, more like an "engineering-grade dim panel" than an "elevated card."

### Decorative Depth
- Code-window cards carry their own internal product chrome — line numbers, syntax highlighting, status bars at the bottom — adding visual density without external shadows.
- The yellow-on-black contrast does most of the elevation work for CTAs.', '{"sourcePath":"docs/design-md/clickhouse/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Reserved for badge accents |
| `{rounded.sm}` | 6px | Small inline buttons |
| `{rounded.md}` | 8px | Standard CTA buttons, text inputs |
| `{rounded.lg}` | 12px | Content cards, code-window cards, pricing tiers |
| `{rounded.pill}` | 9999px | Badge pills |
| `{rounded.full}` | 9999px / 50% | Avatars, icon buttons |', '{"sourcePath":"docs/design-md/clickhouse/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav`** — Black nav bar pinned to top. 64px tall, `{colors.canvas}` background. Carries the ClickHouse logo + wordmark at left, primary horizontal menu (Product, Use Cases, Pricing, Resources, Customers) center-left, right-side cluster with "Sign in" + "Get Started" `{component.button-primary}` (yellow). Menu items in `{typography.nav-link}` (Inter 14px / 500).

### Buttons

**`button-primary`** — The signature yellow CTA. Background `{colors.primary}` (#faff69), text `{colors.on-primary}` (black), type `{typography.button}` (Inter 14px / 600), padding 12px × 20px, height 40px, rounded `{rounded.md}` (8px). The yellow + black combination is iconic.

**`button-secondary`** — Dark surface card button. Background `{colors.surface-card}`, text `{colors.on-dark}`, same shape as primary.

**`button-text-link`** — Inline text button, no background. Used for "Sign in" and inline link CTAs.

**`text-link`** — Inline body links in `{colors.primary}` (yellow on dark). Underlined.

**`button-icon-circular`** — 36 × 36 circular icon button on dark.

### Cards & Containers

**`hero-band`** — Black-canvas hero with 7-5 grid: h1 + sub-headline + button row on the left, code-window or product mockup on the right. Vertical padding `{spacing.section}` (96px).

**`hero-stat-card`** — Yellow stat-display numbers ("779+", "47k+") inline on the canvas. No card surface — just yellow text in `{typography.stat-display}` (56px / 700).

**`feature-card-yellow`** — Full-bleed yellow card ("Built for every modern data challenge"). Background `{colors.primary}`, text `{colors.on-yellow}` (black), rounded `{rounded.lg}` (12px), padding `{spacing.xl}` (32px). The yellow card IS the visual emphasis.

**`feature-card-dark`** — Standard dark feature card. Background `{colors.surface-card}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px).

**`code-window-card`** — Dark card showing a SQL code block. Background `{colors.surface-card}`, code in JetBrains Mono with syntax highlighting, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Often the hero''s right-side artifact on developer-focused pages.

**`product-mockup-card`** — Card showing actual ClickHouse product UI (query editor, dashboard, monitoring panel). Same shape as `{component.feature-card-dark}` but with embedded product chrome inside.

**`pricing-tier-card`** — Standard tier card. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px).

**`pricing-tier-card-featured`** — The featured tier flips to `{colors.primary}` (yellow). The yellow surface IS the featured signal.

**`stat-callout`** — Inline yellow stat numbers ("779+", "2.8k+", "47k+"). Transparent background, text `{colors.primary}`, type `{typography.stat-display}`. Used as a flat layout block, not a card with surface.

**`events-card`** — Used on /company/events. Dark card with event title, date in `{typography.caption-uppercase}`, location, and a "Register" CTA. Rounded `{rounded.lg}`, padding `{spacing.lg}`.

**`customer-logo-strip`** — Horizontal monochrome customer-logo strip. Background `{colors.canvas}`, logos in `{colors.muted}`, vertical padding `{spacing.xl}` (32px).

### Inputs & Forms

**`text-input`** — Dark text input. Background `{colors.surface-card}`, text `{colors.on-dark}`, rounded `{rounded.md}` (8px), padding 10px × 14px, height 40px.

**`text-input-focused`** — Border thickens to `{colors.primary}` (yellow) for emphasis.

### Tags / Badges

**`badge-pill`** — Small dark pill label. Background `{colors.surface-card}`, text `{colors.on-dark}`, type `{typography.caption}`, rounded `{rounded.pill}`.

**`badge-yellow`** — Yellow pill for "NEW", "GET STARTED" emphasis. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`.

### Tab / Filter

**`category-tab`** + **`category-tab-active`** — Dark tab navigation. Inactive: transparent + muted text. Active: surface-card background + on-dark text. Padding 8px × 14px, rounded `{rounded.md}`.

### CTA / Footer

**`cta-band-yellow`** — A pre-footer "Deploy your way" CTA band. Full yellow fill, black type, rounded `{rounded.lg}`, padding 64px. Carries an h2 in `{typography.display-md}` and a CTA — usually a black-button on the yellow surface.

**`footer`** — Black footer that closes every page. Background `{colors.canvas}`, text `{colors.muted}`. 4-column link list at desktop covering Product / Use Cases / Resources / Company. Vertical padding 64px. The ClickHouse wordmark sits at the top in `{colors.on-dark}`.', '{"sourcePath":"docs/design-md/clickhouse/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Anchor every page on the black canvas. The yellow + black pairing is the brand voltage.
- Reserve `{colors.primary}` (yellow) for primary CTAs, stat-callout numbers, and full-bleed yellow CTA bands. The yellow''s scarcity at the element level + abundance at the band level is what makes it powerful.
- Use Inter at weight 700 for every display headline, with -1 to -2.5px letter-spacing.
- Show actual SQL code blocks inside `{component.code-window-card}` — ClickHouse is a database; show the query, don''t paint marketing illustrations of queries.
- Use `{component.stat-callout}` numbers to establish credibility (community size, contributors, performance benchmarks). The yellow stat numbers are signature.
- Anchor every band with `{spacing.section}` (96px) vertical rhythm.

### Don''t
- Don''t introduce a second brand color. ClickHouse is monochromatic + yellow.
- Don''t bold display weight beyond 700 or use weight 500 for headlines. The hierarchy depends on size, not on weight gradation.
- Don''t use yellow for body text or large surface fills outside of intentional yellow cards.
- Don''t use rounded buttons / pills outside of small badges. The standard button radius is 8px (md).
- Don''t repeat the same surface mode in two consecutive bands. Black canvas → dark feature card → yellow CTA card → black canvas → code-window card.
- Don''t replace SQL code mockups with abstract illustrations. The code IS the marketing voltage.
- Don''t add hover state styling beyond what the system already encodes.', '{"sourcePath":"docs/design-md/clickhouse/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 72→36px; code-window-card stacks below; feature grids 1-up; pricing 1-up |
| Tablet | 768–1024px | Top nav tightens; feature cards 2-up; pricing 2-up |
| Desktop | 1024–1440px | Full top-nav; 3-up feature cards; 3-4 up pricing tiers |
| Wide | > 1440px | Same as desktop with more breathing room; max content 1280px |

### Touch Targets
- `{component.button-primary}` at minimum 40 × 40px.
- `{component.button-icon-circular}` at exactly 36 × 36 — slightly under WCAG 44, visually centered.
- `{component.text-input}` height is 40px.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px.
- Hero 7-5 grid → single-column on mobile.
- Feature card grids reduce columns rather than scaling.
- Code-window cards retain font-size; horizontal scroll inside the card on mobile.
- Pricing tier cards collapse 4 → 2 → 1; featured tier yellow stays distinct.

### Image Behavior
- Code blocks inside dark mockups stay at fixed font-size; horizontal scroll on mobile rather than wrapping.
- Customer logos in monochrome strip retain native widths; row wraps on mobile.', '{"sourcePath":"docs/design-md/clickhouse/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.code-window-card}`, `{component.pricing-tier-card-featured}`).
2. Variants of an existing component (`-active`, `-disabled`, `-focused`) live as separate entries.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay Inter 700 with negative letter-spacing. Body stays Inter 400.
6. The yellow + black pairing is the brand contract. Don''t soften with secondary accents.
7. When in doubt about emphasis: bigger Inter 700 before adding color.', '{"sourcePath":"docs/design-md/clickhouse/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- The exact yellow hex (#faff69) was sampled from the screenshot; ClickHouse may publish an official brand color slightly differently.
- Inter weight axis values beyond 400 / 500 / 600 / 700 are not formalized — only the static weights observed are documented.
- Animation and transition timings (code typewriter effects, stat counter animations) are not in scope.
- Form validation states beyond `{component.text-input-focused}` are not extracted.
- The actual ClickHouse Cloud product surface (query console, monitoring dashboards, table browser) shares some tokens with the marketing site but adds many product-specific components that are out of scope.
- The customer logo strip''s exact opacity / treatment varies — the muted gray is approximate.', '{"sourcePath":"docs/design-md/clickhouse/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_1', '#faff69', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_2', '#e6eb52', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_3', '#3a3a1f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_4', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_5', '#cccccc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_6', '#e6e6e6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_7', '#888888', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_8', '#5a5a5a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_9', '#2a2a2a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_10', '#3a3a3a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_11', '#0a0a0a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_12', '#121212', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_13', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_14', '#242424', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_15', '#22c55e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_16', '#ef4444', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_17', '#3b82f6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'color', 'color_18', '#f59e0b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'typography', 'font_1', 'Inter, sans-serif', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'typography', 'font_2', 'JetBrains Mono, ui-monospace, monospace', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md'), 'typography', 'font_3', 'fontFamily: "Inter, sans-serif', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/clickhouse/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/clickhouse/DESIGN.md';


-- Cohere
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Cohere', 'cohere', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/cohere/DESIGN.md', null, 'seeded', '---
version: alpha
name: Cohere-design-analysis
description: Cohere''s 2026 web system is a controlled enterprise AI interface built from stark white editorial space, deep green-black product bands, soft mineral surfaces, rounded media cards, and a distinctive type split between monospaced-feeling display headlines and precise Unica77 UI text.

colors:
  primary: "#17171c"
  cohere-black: "#000000"
  ink: "#212121"
  deep-green: "#003c33"
  dark-navy: "#071829"
  canvas: "#ffffff"
  soft-stone: "#eeece7"
  pale-green: "#edfce9"
  pale-blue: "#f1f5ff"
  hairline: "#d9d9dd"
  border-light: "#e5e7eb"
  card-border: "#f2f2f2"
  muted: "#93939f"
  slate: "#75758a"
  body-muted: "#616161"
  action-blue: "#1863dc"
  focus-blue: "#4c6ee6"
  coral: "#ff7759"
  coral-soft: "#ffad9b"
  form-focus: "#9b60aa"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  error: "#b30000"

typography:
  hero-display:
    fontFamily: CohereText
    fontSize: 96px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -1.92px
  product-display:
    fontFamily: CohereText
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -1.44px
  section-display:
    fontFamily: Unica77 Cohere Web
    fontSize: 60px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -1.2px
  section-heading:
    fontFamily: Unica77 Cohere Web
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.48px
  card-heading:
    fontFamily: Unica77 Cohere Web
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.32px
  feature-heading:
    fontFamily: Unica77 Cohere Web
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0
  body-large:
    fontFamily: Unica77 Cohere Web
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  body:
    fontFamily: Unica77 Cohere Web
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button:
    fontFamily: Unica77 Cohere Web
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.71
    letterSpacing: 0
  caption:
    fontFamily: Unica77 Cohere Web
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  mono-label:
    fontFamily: CohereMono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.28px
  micro:
    fontFamily: Unica77 Cohere Web
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 22px
  xl: 30px
  pill: 32px
  full: 9999px

spacing:
  xxs: 2px
  xs: 6px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 8px 0
  button-pill-outline:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.xl}"
    padding: 6px 12px
  announcement-bar:
    backgroundColor: "{colors.cohere-black}"
    textColor: "{colors.on-dark}"
    typography: "{typography.micro}"
    height: 36px
  hero-photo-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
  agent-console-card:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.sm}"
    padding: 24px
  trust-logo-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
  capability-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 24px
  dark-feature-band:
    backgroundColor: "{colors.deep-green}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: 80px
  product-card:
    backgroundColor: "{colors.soft-stone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: 32px
  blog-filter-chip:
    backgroundColor: transparent
    textColor: "{colors.coral}"
    typography: "{typography.card-heading}"
    rounded: "{rounded.sm}"
    padding: 8px 14px
  research-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-large}"
  contact-form-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 32px
  footer-newsletter:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-dark}"
    typography: "{typography.micro}"
---

## Overview

Cohere''s current web presence feels like a sober enterprise AI command center with editorial restraint. The home page opens on a huge typographic declaration over a white canvas, then uses photography, dark product mockups, trust logos, and generous empty space to make AI infrastructure feel controlled rather than speculative. Product pages invert the tone into deep green-black or dark navy bands, while blog and research pages move toward publishing-system clarity: large filters, thin rules, dense lists, and pale technical backgrounds.

What makes the system distinctive is the mix of austere black-and-white UI with bursts of tactile brand imagery. The site avoids decorative chrome in the normal interface; color arrives through photography, abstract 3D media, coral blog taxonomy chips, blue research links, and dark product environments. Cards are rounded but not cute. Type is large, tight, and almost monospaced in spirit, creating a research-lab cadence across marketing, product, and editorial surfaces.

**Key Characteristics:**
- Monumental display headlines with very tight line height and negative tracking.
- White editorial canvases interrupted by deep green, dark navy, and image-led CTA bands.
- Rounded media cards and product cards, usually 8px to 22px.
- Pill CTAs in near-black or white, with most secondary actions rendered as underlined text links.
- Trust-logo strips with monochrome partner marks and very wide vertical spacing.
- Agent-console mockups using dark panels, small status chips, and product integration badges.
- Blog and research surfaces with prominent taxonomy chips, long rule-separated lists, and search fields.

## Colors

### Brand & Accent

- **Cohere Black** (`#000000`): Announcement bar, highest-contrast text, and the global brand anchor.
- **Near-Black Primary** (`#17171c`): Primary CTA buttons, dark footer, and deep UI cards.
- **Deep Enterprise Green** (`#003c33`): Product hero bands for North and Command-style dark sections.
- **Dark Navy** (`#071829`): Financial-services and security-oriented solution bands.
- **Action Blue** (`#1863dc`): Editorial links, pagination, and secondary action emphasis.
- **Coral** (`#ff7759`): Blog category chips, taxonomy outlines, and warm product markers.
- **Soft Coral** (`#ffad9b`): Pale chip borders and segmented article-label details.

### Surface & Background

- **Canvas White** (`#ffffff`): Dominant page background and form/card surface.
- **Soft Stone** (`#eeece7`): Product cards, testimonial placeholders, and warm neutral surface blocks.
- **Pale Green Wash** (`#edfce9`): North page section backdrop behind stacked dark capability panels.
- **Pale Blue Wash** (`#f1f5ff`): Blog CTA surface behind abstract 3D imagery.
- **Card Border** (`#f2f2f2`): Softest card containment line.

### Text & Rules

- **Ink** (`#212121`): Default body text and most link text on light backgrounds.
- **Muted Slate** (`#93939f`): Footer links, dates, metadata, and de-emphasized labels.
- **Slate** (`#75758a`): Research separators and tertiary text.
- **Hairline** (`#d9d9dd`): Standard list rules and section dividers.
- **Border Light** (`#e5e7eb`): Secondary divider and utility rule.

### Semantic

- **Focus Blue** (`#4c6ee6`): Keyboard focus and ring color.
- **Form Focus Violet** (`#9b60aa`): Focus border for text inputs.
- **Error Red** (`#b30000`): Extracted ring/shadow color associated with validation-like states.

### Gradient System

Cohere does not use gradients as a generic UI fill. Gradients and color fields are media-led: abstract 3D hero imagery, deep blue open-science particle fields, red-orange product video posters, and dark green-to-black product environments. Keep UI surfaces flat; reserve gradient richness for large media panels and CTA image bands.

## Typography

### Font Family

- **Display**: `CohereText`, falling back to `Space Grotesk`, `Inter`, `ui-sans-serif`, and `system-ui`.
- **Body/UI**: `Unica77 Cohere Web`, falling back to `Inter`, `Arial`, `ui-sans-serif`, and `system-ui`.
- **Technical labels**: `CohereMono`, falling back to `Arial`, `ui-sans-serif`, and `system-ui`.
- **Icons**: Cohere uses custom icon fonts and thin-line geometric illustrations.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---:|---:|---:|---:|---|
| Hero Display | CohereText | 96px | 400 | 1.00 | -1.92px | Home page declaration scale. |
| Product Display | CohereText | 72px | 400 | 1.00 | -1.44px | Product and research hero headlines. |
| Section Display | Unica77 | 60px | 400 | 1.00 | -1.2px | Large product-page headings. |
| Section Heading | Unica77 | 48px | 400 | 1.20 | -0.48px | Split hero and CTA headings. |
| Card Heading | Unica77 | 32px | 400 | 1.20 | -0.32px | Feature card and list section titles. |
| Feature Heading | Unica77 | 24px | 400 | 1.30 | 0 | Cards, filters, and article titles. |
| Body Large | Unica77 | 18px | 400 | 1.40 | 0 | Lead text and larger paragraphs. |
| Body | Unica77 | 16px | 400 | 1.50 | 0 | Default copy and link text. |
| Button | Unica77 | 14px | 500 | 1.71 | 0 | Compact CTA labels. |
| Caption | Unica77 | 14px | 400 | 1.40 | 0 | Metadata and small explanatory text. |
| Mono Label | CohereMono | 14px | 400 | 1.40 | 0.28px | Uppercase technical labels. |
| Micro | Unica77 | 12px | 400 | 1.40 | 0 | Footer, nav microcopy, and small links. |

### Principles

- Use massive type sparingly; Cohere pages often have one oversized headline and then settle into restrained 16px-24px UI copy.
- Keep display type tight. Hero copy should feel compact and carved, not airy.
- Avoid heavy bold weights. Size, spacing, and surface contrast do most of the hierarchy work.
- Use uppercase mono labels for category and system markers, especially on product and research pages.
- Editorial pages can use coral chips and blue links, but the base typography remains black and measured.

## Layout

### Spacing System

The system uses an 8px base with many one-off alignment values: `2px`, `6px`, `8px`, `10px`, `12px`, `16px`, `20px`, `22px`, `24px`, `28px`, `32px`, `36px`, `40px`, `56px`, `60px`, `64px`, and `80px`.

Large sections rely on dramatic vertical breathing room. The home page places a trust-logo strip far below the hero media. Product pages often hold dark panels inside fields of empty white space, then transition to dense forms or footers only near the end.

### Grid & Container

- Global nav uses a three-zone layout: logo left, menu centered, sign-in/CTA right.
- Home hero is centered text above a two-card media composition: a wide product mockup card beside a narrower photography card.
- Feature sections commonly use 3-column cards on desktop.
- Product pages alternate centered hero blocks, trust-logo strips, large single-feature bands, and 2- or 3-column card grids.
- Research pages use full-width lists with date and chip columns instead of decorative cards.
- Forms use two-column input rows inside a rounded white card on dark or stone section backgrounds.

### Whitespace Philosophy

Cohere uses whitespace as a trust signal. Large empty intervals separate the brand claim, customer proof, product proof, and CTA. Dense content appears only where it serves the information architecture: research paper rows, blog card grids, and contact form fields.

## Elevation & Depth

Cohere is mostly flat. Depth comes from surface alternation, media contrast, rounded corners, and thin borders rather than drop shadows.

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, white or dark field | Hero copy, research lists, editorial surfaces |
| Bordered | 1px `#d9d9dd`, `#e5e7eb`, or dark translucent rules | Research rows, forms, pale cards, footer inputs |
| Media Lift | Rounded image or video over contrasting section color | Hero photo cards, product videos, CTA imagery |
| Dark Product Field | Deep green or navy full-width band | Command, North, financial services, security sections |

## Shapes

### Radius Scale

| Token | Value | Role |
|---|---:|---|
| `xs` | 4px | Small images, search fields, article thumbnails, utility elements |
| `sm` | 8px | Blog chips, cards, small media, dialogs |
| `md` | 16px | Medium product cards and grouped blocks |
| `lg` | 22px | Signature media-card and soft placeholder radius |
| `xl` | 30px | Research/topic filter pills |
| `pill` | 32px | Primary CTA buttons |
| `full` | 9999px | Round status elements and fully pill-shaped controls |

### Image Treatment

Images are not decorative backdrops for text except in CTA bands. Most imagery sits as rounded cards with visible corners: product videos, enterprise photography, article thumbnails, and abstract 3D renders. The dominant radii are 8px and 22px.

## Components

### **`button-primary`**

Near-black or white pill CTA, depending on surface contrast. Uses 14px-16px Unica77, 12px 24px padding, and a 32px pill radius. This is the primary action style for "Request a demo", "Submit", and hero CTAs.

### **`button-secondary`**

Text-only action link, usually underlined or rule-aligned, with no filled background. Used for "Explore products", "Try the Playground", newsletter signup, and secondary hero actions.

### **`button-pill-outline`**

Outlined pill control with transparent fill, 1px dark border, and 30px radius. Used for research filters, topic tags, and lightweight taxonomy controls.

### **`announcement-bar`**

Full-width black strip above the nav, 36px tall, centered microcopy with an underlined "Learn more" link and a close control at the far right.

### **`hero-photo-card`**

Rounded media card used in the home hero and solution pages. It combines photography or abstract imagery with an overlaid dark agent-console module. Radius is usually 22px on large cards and 8px on smaller thumbnails.

### **`agent-console-card`**

Dark product mockup panel showing agent names, status chips, integration badges, prompt fields, and generated response cards. Background is near-black, text is white or muted, and small accent chips use product colors.

### **`trust-logo-strip`**

Centered copy above a row of monochrome customer logos. It is intentionally quiet: no cards, no borders, just large horizontal spacing and black or white logos depending on the background.

### **`capability-card`**

Content block with thin-line geometric illustration, 24px heading, body copy, and a text link. On light backgrounds, cards often have only a top rule or a subtle image/card relationship rather than full boxing.

### **`dark-feature-band`**

Deep green or navy full-width section used for product capabilities, security claims, and feature breakdowns. Text turns white; cards use darker translucent surfaces, pale borders, and abstract line illustrations.

### **`product-card`**

Warm stone card used for product/model summaries. Typically 3-column on desktop, with 8px radius, generous padding, a small pill button, a divider line, and checkmark bullet rows.

### **`blog-filter-chip`**

Large coral taxonomy chip used on the blog index. Active chips invert to coral fill with dark text; inactive chips use coral outline and pale fill. Typography is oversized relative to typical filters, making the taxonomy a hero-level control.

### **`research-table`**

Rule-separated publication list with title left, topic pills centered, and date right. Rows are tall, white, and border-driven; filters above use many compact outlined pills.

### **`contact-form-card`**

Rounded white form panel set against dark green or warm stone sections. Inputs are rectangular with thin gray borders, 12px-16px padding, and compact labels/placeholders. Submit uses the same near-black pill style as primary CTAs.

### **`footer-newsletter`**

Dark footer subscription block with coral "AI moves fast" label, white headline, muted legal microcopy, a single-line email field, and arrow submit marker. Footer columns use white section labels and muted links.

## Do''s and Don''ts

### Do

- Use white canvas as the default surface; introduce dark green or navy as full-width product bands.
- Keep primary CTAs pill-shaped and near-black on light surfaces.
- Use 22px radius on major media cards and placeholders.
- Use coral for editorial taxonomy and small warm accents, not as the main CTA system.
- Use monochrome trust logos with wide spacing.
- Use thin-line geometric illustrations for research and capability icons.
- Let photography and product mockups carry color, while the UI shell stays restrained.

### Don''t

- Do not turn coral or blue into broad decorative surface colors.
- Do not add heavy drop shadows to cards.
- Do not make every section card-based; Cohere often uses unframed rows, rules, and open space.
- Do not use rounded cards below 8px for major media.
- Do not replace the display/body type split with one generic sans-serif voice.
- Do not render undocumented interaction variants in documentation or previews.
- Do not use saturated gradients as normal UI backgrounds; keep gradients media-led.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---:|---|
| Small Mobile | <425px | Single-column cards, compact nav, reduced hero headline scale |
| Mobile | 425-640px | Hero media stacks, card grids become one column, form rows stack |
| Large Mobile | 640-768px | Wider one-column layouts with larger media cards |
| Tablet | 768-1024px | Two-column cards begin, nav spacing tightens |
| Desktop | 1024-1440px | Full nav, 3-column card grids, split hero compositions |
| Large Desktop | 1440-2560px | Wide containers and large empty vertical intervals |

### Touch Targets

Primary CTAs and pills meet comfortable touch sizing through 12px-24px padding and pill radii. Research filter chips and blog category chips are larger than standard tags, making dense taxonomy surfaces usable on touch devices.

### Collapsing Strategy

- Nav collapses from full horizontal links to a compact mobile menu.
- Hero media moves from split cards to stacked cards.
- Product and capability grids collapse from 3 columns to 2 and then 1.
- Form fields collapse from paired rows to a single column.
- Research rows preserve their rule-separated structure but stack metadata below titles on smaller widths.

## Iteration Guide

1. Start from a white canvas or a full-width dark green/navy band; avoid mid-tone page backgrounds unless the screenshot shows a specific CTA/form section.
2. Use `button-primary` for the single highest-priority action and `button-secondary` for the companion action.
3. Use `hero-photo-card` or `agent-console-card` when a page needs visual energy; avoid invented dashboard data.
4. For editorial pages, combine `blog-filter-chip`, `button-pill-outline`, and `research-table` instead of generic marketing cards.
5. Keep component examples structurally honest: placeholder product frames are better than invented product content.

## Known Gaps

- Exact proprietary font files are not bundled; use the documented fallbacks when implementing externally.
- Mobile screenshots were not regenerated in this public update, so mobile behavior is documented from the desktop system and existing responsive patterns.
- Some live pages lazy-load content blocks late; blank testimonial placeholders are documented as placeholder skeleton surfaces rather than filled testimonial cards.
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

Cohere''s current web presence feels like a sober enterprise AI command center with editorial restraint. The home page opens on a huge typographic declaration over a white canvas, then uses photography, dark product mockups, trust logos, and generous empty space to make AI infrastructure feel controlled rather than speculative. Product pages invert the tone into deep green-black or dark navy bands, while blog and research pages move toward publishing-system clarity: large filters, thin rules, dense lists, and pale technical backgrounds.

What makes the system distinctive is the mix of austere black-and-white UI with bursts of tactile brand imagery. The site avoids decorative chrome in the normal interface; color arrives through photography, abstract 3D media, coral blog taxonomy chips, blue research links, and dark product environments. Cards are rounded but not cute. Type is large, tight, and almost monospaced in spirit, creating a research-lab cadence across marketing, product, and editorial surfaces.

**Key Characteristics:**
- Monumental display headlines with very tight line height and negative tracking.
- White editorial canvases interrupted by deep green, dark navy, and image-led CTA bands.
- Rounded media cards and product cards, usually 8px to 22px.
- Pill CTAs in near-black or white, with most secondary actions rendered as underlined text links.
- Trust-logo strips with monochrome partner marks and very wide vertical spacing.
- Agent-console mockups using dark panels, small status chips, and product integration badges.
- Blog and research surfaces with prominent taxonomy chips, long rule-separated lists, and search fields.', '{"sourcePath":"docs/design-md/cohere/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent

- **Cohere Black** (`#000000`): Announcement bar, highest-contrast text, and the global brand anchor.
- **Near-Black Primary** (`#17171c`): Primary CTA buttons, dark footer, and deep UI cards.
- **Deep Enterprise Green** (`#003c33`): Product hero bands for North and Command-style dark sections.
- **Dark Navy** (`#071829`): Financial-services and security-oriented solution bands.
- **Action Blue** (`#1863dc`): Editorial links, pagination, and secondary action emphasis.
- **Coral** (`#ff7759`): Blog category chips, taxonomy outlines, and warm product markers.
- **Soft Coral** (`#ffad9b`): Pale chip borders and segmented article-label details.

### Surface & Background

- **Canvas White** (`#ffffff`): Dominant page background and form/card surface.
- **Soft Stone** (`#eeece7`): Product cards, testimonial placeholders, and warm neutral surface blocks.
- **Pale Green Wash** (`#edfce9`): North page section backdrop behind stacked dark capability panels.
- **Pale Blue Wash** (`#f1f5ff`): Blog CTA surface behind abstract 3D imagery.
- **Card Border** (`#f2f2f2`): Softest card containment line.

### Text & Rules

- **Ink** (`#212121`): Default body text and most link text on light backgrounds.
- **Muted Slate** (`#93939f`): Footer links, dates, metadata, and de-emphasized labels.
- **Slate** (`#75758a`): Research separators and tertiary text.
- **Hairline** (`#d9d9dd`): Standard list rules and section dividers.
- **Border Light** (`#e5e7eb`): Secondary divider and utility rule.

### Semantic

- **Focus Blue** (`#4c6ee6`): Keyboard focus and ring color.
- **Form Focus Violet** (`#9b60aa`): Focus border for text inputs.
- **Error Red** (`#b30000`): Extracted ring/shadow color associated with validation-like states.

### Gradient System

Cohere does not use gradients as a generic UI fill. Gradients and color fields are media-led: abstract 3D hero imagery, deep blue open-science particle fields, red-orange product video posters, and dark green-to-black product environments. Keep UI surfaces flat; reserve gradient richness for large media panels and CTA image bands.', '{"sourcePath":"docs/design-md/cohere/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

- **Display**: `CohereText`, falling back to `Space Grotesk`, `Inter`, `ui-sans-serif`, and `system-ui`.
- **Body/UI**: `Unica77 Cohere Web`, falling back to `Inter`, `Arial`, `ui-sans-serif`, and `system-ui`.
- **Technical labels**: `CohereMono`, falling back to `Arial`, `ui-sans-serif`, and `system-ui`.
- **Icons**: Cohere uses custom icon fonts and thin-line geometric illustrations.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---:|---:|---:|---:|---|
| Hero Display | CohereText | 96px | 400 | 1.00 | -1.92px | Home page declaration scale. |
| Product Display | CohereText | 72px | 400 | 1.00 | -1.44px | Product and research hero headlines. |
| Section Display | Unica77 | 60px | 400 | 1.00 | -1.2px | Large product-page headings. |
| Section Heading | Unica77 | 48px | 400 | 1.20 | -0.48px | Split hero and CTA headings. |
| Card Heading | Unica77 | 32px | 400 | 1.20 | -0.32px | Feature card and list section titles. |
| Feature Heading | Unica77 | 24px | 400 | 1.30 | 0 | Cards, filters, and article titles. |
| Body Large | Unica77 | 18px | 400 | 1.40 | 0 | Lead text and larger paragraphs. |
| Body | Unica77 | 16px | 400 | 1.50 | 0 | Default copy and link text. |
| Button | Unica77 | 14px | 500 | 1.71 | 0 | Compact CTA labels. |
| Caption | Unica77 | 14px | 400 | 1.40 | 0 | Metadata and small explanatory text. |
| Mono Label | CohereMono | 14px | 400 | 1.40 | 0.28px | Uppercase technical labels. |
| Micro | Unica77 | 12px | 400 | 1.40 | 0 | Footer, nav microcopy, and small links. |

### Principles

- Use massive type sparingly; Cohere pages often have one oversized headline and then settle into restrained 16px-24px UI copy.
- Keep display type tight. Hero copy should feel compact and carved, not airy.
- Avoid heavy bold weights. Size, spacing, and surface contrast do most of the hierarchy work.
- Use uppercase mono labels for category and system markers, especially on product and research pages.
- Editorial pages can use coral chips and blue links, but the base typography remains black and measured.', '{"sourcePath":"docs/design-md/cohere/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System

The system uses an 8px base with many one-off alignment values: `2px`, `6px`, `8px`, `10px`, `12px`, `16px`, `20px`, `22px`, `24px`, `28px`, `32px`, `36px`, `40px`, `56px`, `60px`, `64px`, and `80px`.

Large sections rely on dramatic vertical breathing room. The home page places a trust-logo strip far below the hero media. Product pages often hold dark panels inside fields of empty white space, then transition to dense forms or footers only near the end.

### Grid & Container

- Global nav uses a three-zone layout: logo left, menu centered, sign-in/CTA right.
- Home hero is centered text above a two-card media composition: a wide product mockup card beside a narrower photography card.
- Feature sections commonly use 3-column cards on desktop.
- Product pages alternate centered hero blocks, trust-logo strips, large single-feature bands, and 2- or 3-column card grids.
- Research pages use full-width lists with date and chip columns instead of decorative cards.
- Forms use two-column input rows inside a rounded white card on dark or stone section backgrounds.

### Whitespace Philosophy

Cohere uses whitespace as a trust signal. Large empty intervals separate the brand claim, customer proof, product proof, and CTA. Dense content appears only where it serves the information architecture: research paper rows, blog card grids, and contact form fields.', '{"sourcePath":"docs/design-md/cohere/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

Cohere is mostly flat. Depth comes from surface alternation, media contrast, rounded corners, and thin borders rather than drop shadows.

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, white or dark field | Hero copy, research lists, editorial surfaces |
| Bordered | 1px `#d9d9dd`, `#e5e7eb`, or dark translucent rules | Research rows, forms, pale cards, footer inputs |
| Media Lift | Rounded image or video over contrasting section color | Hero photo cards, product videos, CTA imagery |
| Dark Product Field | Deep green or navy full-width band | Command, North, financial services, security sections |', '{"sourcePath":"docs/design-md/cohere/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Radius Scale

| Token | Value | Role |
|---|---:|---|
| `xs` | 4px | Small images, search fields, article thumbnails, utility elements |
| `sm` | 8px | Blog chips, cards, small media, dialogs |
| `md` | 16px | Medium product cards and grouped blocks |
| `lg` | 22px | Signature media-card and soft placeholder radius |
| `xl` | 30px | Research/topic filter pills |
| `pill` | 32px | Primary CTA buttons |
| `full` | 9999px | Round status elements and fully pill-shaped controls |

### Image Treatment

Images are not decorative backdrops for text except in CTA bands. Most imagery sits as rounded cards with visible corners: product videos, enterprise photography, article thumbnails, and abstract 3D renders. The dominant radii are 8px and 22px.', '{"sourcePath":"docs/design-md/cohere/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### **`button-primary`**

Near-black or white pill CTA, depending on surface contrast. Uses 14px-16px Unica77, 12px 24px padding, and a 32px pill radius. This is the primary action style for "Request a demo", "Submit", and hero CTAs.

### **`button-secondary`**

Text-only action link, usually underlined or rule-aligned, with no filled background. Used for "Explore products", "Try the Playground", newsletter signup, and secondary hero actions.

### **`button-pill-outline`**

Outlined pill control with transparent fill, 1px dark border, and 30px radius. Used for research filters, topic tags, and lightweight taxonomy controls.

### **`announcement-bar`**

Full-width black strip above the nav, 36px tall, centered microcopy with an underlined "Learn more" link and a close control at the far right.

### **`hero-photo-card`**

Rounded media card used in the home hero and solution pages. It combines photography or abstract imagery with an overlaid dark agent-console module. Radius is usually 22px on large cards and 8px on smaller thumbnails.

### **`agent-console-card`**

Dark product mockup panel showing agent names, status chips, integration badges, prompt fields, and generated response cards. Background is near-black, text is white or muted, and small accent chips use product colors.

### **`trust-logo-strip`**

Centered copy above a row of monochrome customer logos. It is intentionally quiet: no cards, no borders, just large horizontal spacing and black or white logos depending on the background.

### **`capability-card`**

Content block with thin-line geometric illustration, 24px heading, body copy, and a text link. On light backgrounds, cards often have only a top rule or a subtle image/card relationship rather than full boxing.

### **`dark-feature-band`**

Deep green or navy full-width section used for product capabilities, security claims, and feature breakdowns. Text turns white; cards use darker translucent surfaces, pale borders, and abstract line illustrations.

### **`product-card`**

Warm stone card used for product/model summaries. Typically 3-column on desktop, with 8px radius, generous padding, a small pill button, a divider line, and checkmark bullet rows.

### **`blog-filter-chip`**

Large coral taxonomy chip used on the blog index. Active chips invert to coral fill with dark text; inactive chips use coral outline and pale fill. Typography is oversized relative to typical filters, making the taxonomy a hero-level control.

### **`research-table`**

Rule-separated publication list with title left, topic pills centered, and date right. Rows are tall, white, and border-driven; filters above use many compact outlined pills.

### **`contact-form-card`**

Rounded white form panel set against dark green or warm stone sections. Inputs are rectangular with thin gray borders, 12px-16px padding, and compact labels/placeholders. Submit uses the same near-black pill style as primary CTAs.

### **`footer-newsletter`**

Dark footer subscription block with coral "AI moves fast" label, white headline, muted legal microcopy, a single-line email field, and arrow submit marker. Footer columns use white section labels and muted links.', '{"sourcePath":"docs/design-md/cohere/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do

- Use white canvas as the default surface; introduce dark green or navy as full-width product bands.
- Keep primary CTAs pill-shaped and near-black on light surfaces.
- Use 22px radius on major media cards and placeholders.
- Use coral for editorial taxonomy and small warm accents, not as the main CTA system.
- Use monochrome trust logos with wide spacing.
- Use thin-line geometric illustrations for research and capability icons.
- Let photography and product mockups carry color, while the UI shell stays restrained.

### Don''t

- Do not turn coral or blue into broad decorative surface colors.
- Do not add heavy drop shadows to cards.
- Do not make every section card-based; Cohere often uses unframed rows, rules, and open space.
- Do not use rounded cards below 8px for major media.
- Do not replace the display/body type split with one generic sans-serif voice.
- Do not render undocumented interaction variants in documentation or previews.
- Do not use saturated gradients as normal UI backgrounds; keep gradients media-led.', '{"sourcePath":"docs/design-md/cohere/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---:|---|
| Small Mobile | <425px | Single-column cards, compact nav, reduced hero headline scale |
| Mobile | 425-640px | Hero media stacks, card grids become one column, form rows stack |
| Large Mobile | 640-768px | Wider one-column layouts with larger media cards |
| Tablet | 768-1024px | Two-column cards begin, nav spacing tightens |
| Desktop | 1024-1440px | Full nav, 3-column card grids, split hero compositions |
| Large Desktop | 1440-2560px | Wide containers and large empty vertical intervals |

### Touch Targets

Primary CTAs and pills meet comfortable touch sizing through 12px-24px padding and pill radii. Research filter chips and blog category chips are larger than standard tags, making dense taxonomy surfaces usable on touch devices.

### Collapsing Strategy

- Nav collapses from full horizontal links to a compact mobile menu.
- Hero media moves from split cards to stacked cards.
- Product and capability grids collapse from 3 columns to 2 and then 1.
- Form fields collapse from paired rows to a single column.
- Research rows preserve their rule-separated structure but stack metadata below titles on smaller widths.', '{"sourcePath":"docs/design-md/cohere/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Start from a white canvas or a full-width dark green/navy band; avoid mid-tone page backgrounds unless the screenshot shows a specific CTA/form section.
2. Use `button-primary` for the single highest-priority action and `button-secondary` for the companion action.
3. Use `hero-photo-card` or `agent-console-card` when a page needs visual energy; avoid invented dashboard data.
4. For editorial pages, combine `blog-filter-chip`, `button-pill-outline`, and `research-table` instead of generic marketing cards.
5. Keep component examples structurally honest: placeholder product frames are better than invented product content.', '{"sourcePath":"docs/design-md/cohere/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Exact proprietary font files are not bundled; use the documented fallbacks when implementing externally.
- Mobile screenshots were not regenerated in this public update, so mobile behavior is documented from the desktop system and existing responsive patterns.
- Some live pages lazy-load content blocks late; blank testimonial placeholders are documented as placeholder skeleton surfaces rather than filled testimonial cards.', '{"sourcePath":"docs/design-md/cohere/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_1', '#17171c', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_2', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_3', '#212121', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_4', '#003c33', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_5', '#071829', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_6', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_7', '#eeece7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_8', '#edfce9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_9', '#f1f5ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_10', '#d9d9dd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_11', '#e5e7eb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_12', '#f2f2f2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_13', '#93939f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_14', '#75758a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_15', '#616161', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_16', '#1863dc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_17', '#4c6ee6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_18', '#ff7759', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_19', '#ffad9b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_20', '#9b60aa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md'), 'color', 'color_21', '#b30000', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/cohere/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/cohere/DESIGN.md';


-- Coinbase
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Coinbase', 'coinbase', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/coinbase/DESIGN.md', null, 'seeded', '---
version: alpha
name: Coinbase-design-analysis
description: An institutional-grade crypto exchange whose marketing surfaces read like a quietly-confident financial-services brand. The base canvas is pure white; Coinbase Blue (`#0052ff`) is the single brand voltage, used scarcely on primary CTAs, signature glyphs, and inline accent moments. Type runs Coinbase''s licensed CoinbaseDisplay (display) and CoinbaseSans (body) at modest weights — display sits at weight 400 not 700, signaling editorial calm rather than fintech-bombastic. Page rhythm rotates between bright white sections, soft gray elevation bands, and full-bleed dark editorial heroes (`#0a0b0d`) carrying product-ui mockup cards. Iconography is geometric and minimal; depth comes from card-on-card layering, never decorative shadows.

colors:
  primary: "#0052ff"
  primary-active: "#003ecc"
  primary-disabled: "#a8b8cc"
  ink: "#0a0b0d"
  body: "#5b616e"
  body-strong: "#0a0b0d"
  muted: "#7c828a"
  muted-soft: "#a8acb3"
  hairline: "#dee1e6"
  hairline-soft: "#eef0f3"
  canvas: "#ffffff"
  surface-soft: "#f7f7f7"
  surface-card: "#ffffff"
  surface-strong: "#eef0f3"
  surface-dark: "#0a0b0d"
  surface-dark-elevated: "#16181c"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  on-dark-soft: "#a8acb3"
  semantic-up: "#05b169"
  semantic-down: "#cf202f"
  accent-yellow: "#f4b000"

typography:
  display-mega:
    fontFamily: "''Coinbase Display'', -apple-system, system-ui, ''Segoe UI'', Roboto, Helvetica, Arial, sans-serif"
    fontSize: 80px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -2px
  display-xl:
    fontFamily: "''Coinbase Display'', sans-serif"
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -1.6px
  display-lg:
    fontFamily: "''Coinbase Display'', sans-serif"
    fontSize: 52px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -1.3px
  display-md:
    fontFamily: "''Coinbase Display'', sans-serif"
    fontSize: 44px
    fontWeight: 400
    lineHeight: 1.09
    letterSpacing: -1px
  display-sm:
    fontFamily: "''Coinbase Sans'', sans-serif"
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.11
    letterSpacing: -0.5px
  title-lg:
    fontFamily: "''Coinbase Sans'', sans-serif"
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: -0.4px
  title-md:
    fontFamily: "''Coinbase Sans'', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0
  title-sm:
    fontFamily: "''Coinbase Sans'', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  body-md:
    fontFamily: "''Coinbase Sans'', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: "''Coinbase Sans'', sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "''Coinbase Sans'', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "''Coinbase Sans'', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption-strong:
    fontFamily: "''Coinbase Sans'', sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0
  number-display:
    fontFamily: "''Coinbase Mono'', ''Coinbase Sans'', monospace"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  button:
    fontFamily: "''Coinbase Sans'', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: 0
  nav-link:
    fontFamily: "''Coinbase Sans'', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 100px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  base: 16px
  md: 20px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  top-nav-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 64px
  top-nav-on-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.nav-link}"
    height: 64px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 20px
    height: 44px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-secondary-light:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 20px
    height: 44px
  button-secondary-dark:
    backgroundColor: "{colors.surface-dark-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 20px
    height: 44px
  button-outline-on-dark:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 11px 19px
    height: 44px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.button}"
  button-pill-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 16px 32px
    height: 56px
  hero-band-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-mega}"
    padding: 96px
  hero-band-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-mega}"
    padding: 96px
  product-ui-card-dark:
    backgroundColor: "{colors.surface-dark-elevated}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.xl}"
    padding: 32px
  product-ui-card-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 32px
  feature-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  asset-row:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 16px 0
  price-up-cell:
    backgroundColor: transparent
    textColor: "{colors.semantic-up}"
    typography: "{typography.number-display}"
  price-down-cell:
    backgroundColor: transparent
    textColor: "{colors.semantic-down}"
    typography: "{typography.number-display}"
  pricing-tier-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  pricing-tier-featured:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  cta-band-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-lg}"
    padding: 96px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 14px 16px
    height: 48px
  search-input-pill:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: 12px 20px
    height: 44px
  badge-pill:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  asset-icon-circular:
    backgroundColor: "{colors.surface-strong}"
    rounded: "{rounded.full}"
    size: 32px
  footer-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 64px 48px
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
  legal-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
---

## Overview

Coinbase reads like an institutional financial brand that happens to trade crypto — the marketing surfaces are quiet, white-canvas, editorially-spaced, and almost monochromatic. The single brand voltage is **Coinbase Blue** (`{colors.primary}` — #0052ff), used scarcely: every primary CTA pill, the brand wordmark, and inline emphasis links. Beyond that one blue, the system is white canvas + ink + soft gray elevation bands + a deep near-black editorial canvas (`{colors.surface-dark}` — #0a0b0d) for full-bleed product-mockup heroes.

Type pairs **CoinbaseDisplay** for hero headlines with **CoinbaseSans** for body, captions, and navigation. Display sits at **weight 400** — not the 700+ typical of trading platforms. The choice signals editorial calm and institutional trust rather than fintech urgency.

The page rhythm rotates three modes: bright white editorial sections, soft-gray elevation bands, and **full-bleed dark editorial heroes** carrying layered product-UI mockup cards. The dark hero with floating dashboard mockups is the single most distinctive component.

**Key Characteristics:**
- Single accent color: `{colors.primary}` (#0052ff Coinbase Blue) carries every primary CTA, wordmark, and inline brand link. Used scarcely.
- Modest display weights — CoinbaseDisplay at weight 400, never 700+.
- Editorial pill geometry: every CTA is `{rounded.pill}` (100px), every asset glyph is `{rounded.full}`, every card is `{rounded.xl}` (24px). Sharp corners absent.
- Full-bleed dark heroes with floating product-UI cards: `{component.hero-band-dark}` plus inline `{component.product-ui-card-dark}` mockups is the brand''s strongest signature pattern.
- Trading semantics: `{colors.semantic-up}` (#05b169) and `{colors.semantic-down}` (#cf202f) — text color only, never background fills.
- 96px section rhythm — generous editorial pacing.

## Colors

### Brand & Accent
- **Coinbase Blue** (`{colors.primary}` — #0052ff): The single brand color. Every primary CTA pill, the Coinbase wordmark, and inline brand links.
- **Coinbase Blue Active** (`{colors.primary-active}` — #003ecc): Press-state darken on the primary pill.
- **Coinbase Blue Disabled** (`{colors.primary-disabled}` — #a8b8cc): Faded-blue tint for disabled CTAs.
- **Accent Yellow** (`{colors.accent-yellow}` — #f4b000): A small sub-brand accent used very sparingly on Bitcoin/asset glyph fills inside feature cards. Illustrative-only, not an action color.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default page floor.
- **Surface Soft** (`{colors.surface-soft}` — #f7f7f7): Subtle alternating band surface.
- **Surface Strong** (`{colors.surface-strong}` — #eef0f3): The light-gray fill behind secondary buttons, search pills, asset-icon plates.
- **Surface Dark** (`{colors.surface-dark}` — #0a0b0d): Deep near-black canvas for full-bleed dark heroes, CTA bands. Same hex as `{colors.ink}` — page-floor and text-color share the value.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #16181c): One step lighter, used for floating product-UI mockup cards inside dark heroes.

### Hairlines
- **Hairline** (`{colors.hairline}` — #dee1e6): Default 1px divider on white surfaces.
- **Hairline Soft** (`{colors.hairline-soft}` — #eef0f3): Lighter divider — same hex as `{colors.surface-strong}`.

### Text
- **Ink** (`{colors.ink}` — #0a0b0d): Display headings, primary nav, body emphasis.
- **Body** (`{colors.body}` — #5b616e): Default running-text — slightly cool gray.
- **Body Strong** (`{colors.body-strong}` — #0a0b0d): Same as ink, used for stronger emphasis.
- **Muted** (`{colors.muted}` — #7c828a): Sub-titles, breadcrumbs, footer secondary.
- **Muted Soft** (`{colors.muted-soft}` — #a8acb3): Disabled link text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on Coinbase Blue CTAs.
- **On Dark** (`{colors.on-dark}` — #ffffff): White text on dark heroes.
- **On Dark Soft** (`{colors.on-dark-soft}` — #a8acb3): Muted off-white for secondary text on dark.

### Trading Semantics
- **Semantic Up** (`{colors.semantic-up}` — #05b169): "Price up" green, text color only.
- **Semantic Down** (`{colors.semantic-down}` — #cf202f): "Price down" red, text color only.

## Typography

### Font Family
The system runs **CoinbaseDisplay** (display headlines), **CoinbaseSans** (body, navigation, captions, buttons), **CoinbaseIcons** (icon font), and **CoinbaseMono** for tabular numerical data. Fallback stack: `-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

The display/body split is functional: CoinbaseDisplay carries hero headlines only; CoinbaseSans carries everything else.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 80px | 400 | 1.0 | -2px | Homepage hero h1 |
| `{typography.display-xl}` | 64px | 400 | 1.0 | -1.6px | Subsidiary heroes |
| `{typography.display-lg}` | 52px | 400 | 1.0 | -1.3px | Section heads |
| `{typography.display-md}` | 44px | 400 | 1.09 | -1px | CTA-band headlines |
| `{typography.display-sm}` | 36px | 400 | 1.11 | -0.5px | Sub-section heads — CoinbaseSans |
| `{typography.title-lg}` | 32px | 400 | 1.13 | -0.4px | Card group titles |
| `{typography.title-md}` | 18px | 600 | 1.33 | 0 | Component titles, asset row primary |
| `{typography.title-sm}` | 16px | 600 | 1.25 | 0 | List labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-strong}` | 16px | 700 | 1.5 | 0 | Emphasized body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 13px | 400 | 1.5 | 0 | Photo captions |
| `{typography.caption-strong}` | 12px | 600 | 1.5 | 0 | Badge pill labels |
| `{typography.number-display}` | 18px | 500 | 1.4 | 0 | Asset prices, percent changes — CoinbaseMono |
| `{typography.button}` | 16px | 600 | 1.15 | 0 | Standard CTA pill |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
- **Display weight stays at 400.** The single most distinctive typographic choice — signals "calm institutional brand" rather than "trading-platform urgency."
- **Negative letter-spacing on display only.** Display uses -1px to -2px tracking; body stays at 0.
- **CoinbaseMono on every number.** Asset prices, percent changes — anything tabular renders in CoinbaseMono.

### Note on Font Substitutes
CoinbaseDisplay, CoinbaseSans, and CoinbaseMono are licensed Coinbase typefaces.
- **CoinbaseDisplay → Inter** at weight 400, letter-spacing -1.5%.
- **CoinbaseSans → Inter** at weight 400/600.
- **CoinbaseMono → JetBrains Mono** or **Geist Mono** at weight 500.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) for every major editorial band.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards and product-UI mockups.

### Grid & Container
- **Max content width:** ~1200px centered. Hero photography full-bleed.
- **Editorial body:** Single 12-column grid.
- **Feature card grids:** 2-up at desktop for hero splits, 3-up for benefit grids.
- **Footer:** 6-column link list at desktop.

### Whitespace Philosophy
Generous editorial pacing — closer to Bloomberg or the Financial Times than to a trading dashboard. 96px between bands; cards inside bands sit 24px apart. Density lives behind login walls, not on marketing.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | 80% of surfaces |
| Hairline border | 1px `{colors.hairline}` | Feature card outlines on white |
| Soft drop | `0 4px 12px rgba(0, 0, 0, 0.04)` | Single shadow tier — hovered cards |
| Photographic | Full-bleed product-UI mockups | Hero depth |

### Decorative Depth
- **Layered product-UI cards inside dark heroes** is the most distinctive decorative pattern — a `{component.product-ui-card-dark}` floats above a darker base canvas, often with a second smaller card overlapping at an angle.
- **Geometric brand illustrations** carry illustrative depth where shadows would otherwise.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved (essentially unused) |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 8px | Compact rows |
| `{rounded.md}` | 12px | Form inputs |
| `{rounded.lg}` | 16px | Mid-size cards |
| `{rounded.xl}` | 24px | Feature cards, product-UI mockups, pricing tiers |
| `{rounded.pill}` | 100px | All CTA buttons, search pills, badges |
| `{rounded.full}` | 9999px | Asset icon circles, avatars |

Pill for interactive, card-radius (24px) for containers, full circle for icons. Sharp corners absent.

## Components

### Top Navigation

**`top-nav-light`** — Default top nav on white pages. Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: Coinbase wordmark left, primary horizontal menu (Cryptocurrencies / Individuals / Businesses / Institutions / Developers / Company), search-icon + globe + Sign In + Sign Up CTAs right.

**`top-nav-on-dark`** — Top nav over a dark hero band. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same layout.

### Buttons

**`button-primary`** — The signature Coinbase Blue pill. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (16px / 600), padding 12px × 20px, height 44px, rounded `{rounded.pill}` (100px).

**`button-primary-active`** — Press state. Background `{colors.primary-active}`, deeper blue.

**`button-primary-disabled`** — Faded blue tint. Background `{colors.primary-disabled}`. Cursor not-allowed.

**`button-secondary-light`** — Soft-gray secondary on white surfaces. Background `{colors.surface-strong}`, text `{colors.ink}`, same pill geometry.

**`button-secondary-dark`** — Used on dark heroes. Background `{colors.surface-dark-elevated}`, text `{colors.on-dark}`, same pill geometry.

**`button-outline-on-dark`** — Transparent pill with white outline. Background transparent, text `{colors.on-dark}`, 1px white border.

**`button-tertiary-text`** — Inline text link. Background transparent, text `{colors.primary}`, type `{typography.button}`.

**`button-pill-cta`** — Larger pill CTA used on the homepage hero ("Get started"). Same Coinbase Blue palette but with 56px height and 16px × 32px padding for a prouder stance.

### Hero Bands

**`hero-band-dark`** — The signature full-bleed dark hero. Background `{colors.surface-dark}`, text `{colors.on-dark}`, full-bleed layered product-UI mockup cards. Display headline left in `{typography.display-mega}` (80px / 400), subhead in `{typography.body-md}`, two CTAs.

**`hero-band-light`** — White-canvas variant used on Wealth and Explore. Background `{colors.canvas}`, text `{colors.ink}`. Same skeleton, light palette.

### Cards

**`product-ui-card-dark`** — The floating product-UI mockup. Background `{colors.surface-dark-elevated}`, text `{colors.on-dark}`, rounded `{rounded.xl}` (24px), padding 32px. Often shown as 2-3 stacked cards at slight rotation, mimicking a layered dashboard.

**`product-ui-card-light`** — Light-canvas variant used on Explore for asset cards. Background `{colors.canvas}`, text `{colors.ink}`, same geometry, 1px hairline border.

**`feature-card`** — Used in 3-up and 2-up grids. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.title-md}`, rounded `{rounded.xl}`, padding 32px.

### Trading Surfaces

**`asset-row`** — Horizontal row in asset lists (Explore, Wealth). Background transparent, 1px hairline divider. Layout: 32px circular asset icon left, asset name + ticker, price column in `{typography.number-display}`, 24h change column with `{component.price-up-cell}` or `{component.price-down-cell}`.

**`price-up-cell`** + **`price-down-cell`** — Inline price-change cells. Color only — green or red text in `{typography.number-display}`, no background fill.

**`asset-icon-circular`** — Circular plate behind asset glyphs. Background `{colors.surface-strong}`, rounded `{rounded.full}`, 32px diameter.

### Pricing

**`pricing-tier-card`** — Standard pricing tier on Developer Platform. Background `{colors.canvas}`, rounded `{rounded.xl}`, padding 32px, 1px hairline border. Layout: tier name + price + feature checklist + CTA pill.

**`pricing-tier-featured`** — The featured tier. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same skeleton, dark palette — visual inversion signals "highlighted choice" without colored ribbons.

### Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, rounded `{rounded.md}` (12px), padding 14px × 16px, height 48px, 1px hairline border. On focus, border thickens to 2px Coinbase Blue.

**`search-input-pill`** — Pill-shaped search bar. Background `{colors.surface-strong}`, rounded `{rounded.pill}`, padding 12px × 20px, height 44px.

### Tags & Badges

**`badge-pill`** — Small uppercase pill used as section labels ("INSTITUTIONAL", "REGULATED"). Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-strong}`, rounded `{rounded.pill}`.

### CTA / Footer

**`cta-band-dark`** — Pre-footer "Take control of your money" band. Background `{colors.surface-dark}`, text `{colors.on-dark}`, vertical padding 96px. Centered headline + two CTAs.

**`footer-light`** — Closing white-canvas footer. Background `{colors.canvas}`, text `{colors.body}`. 6-column link list.

**`footer-link`** — Individual footer link. Background transparent, text `{colors.body}`.

**`legal-band`** — Bottom strip beneath footer columns. All text `{colors.muted}` at `{typography.caption}`.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (Coinbase Blue) for primary CTAs, wordmark, brand-glyph illustrations, inline accent links.
- Set every CTA as `{rounded.pill}` (100px); every asset glyph as `{rounded.full}`.
- Keep CoinbaseDisplay headlines at weight 400.
- Use the dark/light band rotation as page rhythm.
- Render every numerical value in CoinbaseMono via `{typography.number-display}`.
- Pair every dark hero with a layered product-UI mockup card stack.

### Don''t
- Don''t introduce a secondary brand color. Coinbase Blue is the only action color; trading green/red are semantic-only.
- Don''t bold display copy — display sits at weight 400; bolding shifts the brand voice.
- Don''t add drop shadow tiers — system has one shadow tier.
- Don''t use sharp `{rounded.none}` (0px) on CTAs.
- Don''t mix CoinbaseDisplay and CoinbaseSans inside the same headline.
- Don''t use trading green/red as a button background.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA color is what appears on actual product CTAs, not on injected modals.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 80→40px; feature card grid 1-up; asset row stacks; nav collapses to hamburger; layered product-UI cards collapse to single card. |
| Tablet | 640–1024px | Hero h1 64px; feature card grid 2-up; asset rows stay horizontal but compress columns. |
| Desktop | 1024–1280px | Full hero h1 80px; feature card grid 3-up; full asset row layout. |
| Wide | > 1280px | Content caps at 1200px; hero photography full-bleed. |

### Touch Targets
- Primary CTA pill at 44px height — at WCAG AAA.
- Larger hero pill (`{component.button-pill-cta}`) at 56px — well above AAA.
- Asset icon circles at 32px — borderline; padded 8px row creates effective 48px tap zone.
- Search pill at 44px height — at AAA.

### Collapsing Strategy
- Top nav switches to hamburger sheet below 768px. Sign Up CTA stays visible.
- Hero h1 steps down: 80 → 64 → 52 → 44 → 36px on smallest screens.
- Layered product-UI mockup cards collapse from 2-3 stacked into a single card on mobile.
- Pricing tier rows: 3-up → 2-up → 1-up.
- Asset rows on mobile stack vertically: ticker line on top, price + change line beneath.

## Iteration Guide

1. Focus on a single component at a time. Reference YAML keys directly.
2. New CTAs default to `{rounded.pill}` (100px); new icon plates default to `{rounded.full}`. Cards use `{rounded.xl}`.
3. Variants live as separate entries inside the `components:` block.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented. Only Default and Active/Pressed.
6. CoinbaseDisplay 400 for display, CoinbaseSans 400/600/700 for body. CoinbaseMono on every number.
7. Coinbase Blue stays scarce — one or two blue moments per band.

## Known Gaps

- CoinbaseDisplay, CoinbaseSans, CoinbaseMono are licensed; Inter and JetBrains Mono are documented substitutes.
- In-product trading surfaces (order book, charts, order forms) are behind login walls — this document covers marketing only.
- Animation timings out of scope.
- Form validation states beyond focus not visible on captured surfaces.
- Accent yellow appears only inside Bitcoin asset glyph illustrations; documented as illustrative-only.
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

Coinbase reads like an institutional financial brand that happens to trade crypto — the marketing surfaces are quiet, white-canvas, editorially-spaced, and almost monochromatic. The single brand voltage is **Coinbase Blue** (`{colors.primary}` — #0052ff), used scarcely: every primary CTA pill, the brand wordmark, and inline emphasis links. Beyond that one blue, the system is white canvas + ink + soft gray elevation bands + a deep near-black editorial canvas (`{colors.surface-dark}` — #0a0b0d) for full-bleed product-mockup heroes.

Type pairs **CoinbaseDisplay** for hero headlines with **CoinbaseSans** for body, captions, and navigation. Display sits at **weight 400** — not the 700+ typical of trading platforms. The choice signals editorial calm and institutional trust rather than fintech urgency.

The page rhythm rotates three modes: bright white editorial sections, soft-gray elevation bands, and **full-bleed dark editorial heroes** carrying layered product-UI mockup cards. The dark hero with floating dashboard mockups is the single most distinctive component.

**Key Characteristics:**
- Single accent color: `{colors.primary}` (#0052ff Coinbase Blue) carries every primary CTA, wordmark, and inline brand link. Used scarcely.
- Modest display weights — CoinbaseDisplay at weight 400, never 700+.
- Editorial pill geometry: every CTA is `{rounded.pill}` (100px), every asset glyph is `{rounded.full}`, every card is `{rounded.xl}` (24px). Sharp corners absent.
- Full-bleed dark heroes with floating product-UI cards: `{component.hero-band-dark}` plus inline `{component.product-ui-card-dark}` mockups is the brand''s strongest signature pattern.
- Trading semantics: `{colors.semantic-up}` (#05b169) and `{colors.semantic-down}` (#cf202f) — text color only, never background fills.
- 96px section rhythm — generous editorial pacing.', '{"sourcePath":"docs/design-md/coinbase/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Coinbase Blue** (`{colors.primary}` — #0052ff): The single brand color. Every primary CTA pill, the Coinbase wordmark, and inline brand links.
- **Coinbase Blue Active** (`{colors.primary-active}` — #003ecc): Press-state darken on the primary pill.
- **Coinbase Blue Disabled** (`{colors.primary-disabled}` — #a8b8cc): Faded-blue tint for disabled CTAs.
- **Accent Yellow** (`{colors.accent-yellow}` — #f4b000): A small sub-brand accent used very sparingly on Bitcoin/asset glyph fills inside feature cards. Illustrative-only, not an action color.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default page floor.
- **Surface Soft** (`{colors.surface-soft}` — #f7f7f7): Subtle alternating band surface.
- **Surface Strong** (`{colors.surface-strong}` — #eef0f3): The light-gray fill behind secondary buttons, search pills, asset-icon plates.
- **Surface Dark** (`{colors.surface-dark}` — #0a0b0d): Deep near-black canvas for full-bleed dark heroes, CTA bands. Same hex as `{colors.ink}` — page-floor and text-color share the value.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #16181c): One step lighter, used for floating product-UI mockup cards inside dark heroes.

### Hairlines
- **Hairline** (`{colors.hairline}` — #dee1e6): Default 1px divider on white surfaces.
- **Hairline Soft** (`{colors.hairline-soft}` — #eef0f3): Lighter divider — same hex as `{colors.surface-strong}`.

### Text
- **Ink** (`{colors.ink}` — #0a0b0d): Display headings, primary nav, body emphasis.
- **Body** (`{colors.body}` — #5b616e): Default running-text — slightly cool gray.
- **Body Strong** (`{colors.body-strong}` — #0a0b0d): Same as ink, used for stronger emphasis.
- **Muted** (`{colors.muted}` — #7c828a): Sub-titles, breadcrumbs, footer secondary.
- **Muted Soft** (`{colors.muted-soft}` — #a8acb3): Disabled link text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on Coinbase Blue CTAs.
- **On Dark** (`{colors.on-dark}` — #ffffff): White text on dark heroes.
- **On Dark Soft** (`{colors.on-dark-soft}` — #a8acb3): Muted off-white for secondary text on dark.

### Trading Semantics
- **Semantic Up** (`{colors.semantic-up}` — #05b169): "Price up" green, text color only.
- **Semantic Down** (`{colors.semantic-down}` — #cf202f): "Price down" red, text color only.', '{"sourcePath":"docs/design-md/coinbase/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The system runs **CoinbaseDisplay** (display headlines), **CoinbaseSans** (body, navigation, captions, buttons), **CoinbaseIcons** (icon font), and **CoinbaseMono** for tabular numerical data. Fallback stack: `-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

The display/body split is functional: CoinbaseDisplay carries hero headlines only; CoinbaseSans carries everything else.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 80px | 400 | 1.0 | -2px | Homepage hero h1 |
| `{typography.display-xl}` | 64px | 400 | 1.0 | -1.6px | Subsidiary heroes |
| `{typography.display-lg}` | 52px | 400 | 1.0 | -1.3px | Section heads |
| `{typography.display-md}` | 44px | 400 | 1.09 | -1px | CTA-band headlines |
| `{typography.display-sm}` | 36px | 400 | 1.11 | -0.5px | Sub-section heads — CoinbaseSans |
| `{typography.title-lg}` | 32px | 400 | 1.13 | -0.4px | Card group titles |
| `{typography.title-md}` | 18px | 600 | 1.33 | 0 | Component titles, asset row primary |
| `{typography.title-sm}` | 16px | 600 | 1.25 | 0 | List labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-strong}` | 16px | 700 | 1.5 | 0 | Emphasized body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 13px | 400 | 1.5 | 0 | Photo captions |
| `{typography.caption-strong}` | 12px | 600 | 1.5 | 0 | Badge pill labels |
| `{typography.number-display}` | 18px | 500 | 1.4 | 0 | Asset prices, percent changes — CoinbaseMono |
| `{typography.button}` | 16px | 600 | 1.15 | 0 | Standard CTA pill |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
- **Display weight stays at 400.** The single most distinctive typographic choice — signals "calm institutional brand" rather than "trading-platform urgency."
- **Negative letter-spacing on display only.** Display uses -1px to -2px tracking; body stays at 0.
- **CoinbaseMono on every number.** Asset prices, percent changes — anything tabular renders in CoinbaseMono.

### Note on Font Substitutes
CoinbaseDisplay, CoinbaseSans, and CoinbaseMono are licensed Coinbase typefaces.
- **CoinbaseDisplay → Inter** at weight 400, letter-spacing -1.5%.
- **CoinbaseSans → Inter** at weight 400/600.
- **CoinbaseMono → JetBrains Mono** or **Geist Mono** at weight 500.', '{"sourcePath":"docs/design-md/coinbase/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) for every major editorial band.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards and product-UI mockups.

### Grid & Container
- **Max content width:** ~1200px centered. Hero photography full-bleed.
- **Editorial body:** Single 12-column grid.
- **Feature card grids:** 2-up at desktop for hero splits, 3-up for benefit grids.
- **Footer:** 6-column link list at desktop.

### Whitespace Philosophy
Generous editorial pacing — closer to Bloomberg or the Financial Times than to a trading dashboard. 96px between bands; cards inside bands sit 24px apart. Density lives behind login walls, not on marketing.', '{"sourcePath":"docs/design-md/coinbase/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | 80% of surfaces |
| Hairline border | 1px `{colors.hairline}` | Feature card outlines on white |
| Soft drop | `0 4px 12px rgba(0, 0, 0, 0.04)` | Single shadow tier — hovered cards |
| Photographic | Full-bleed product-UI mockups | Hero depth |

### Decorative Depth
- **Layered product-UI cards inside dark heroes** is the most distinctive decorative pattern — a `{component.product-ui-card-dark}` floats above a darker base canvas, often with a second smaller card overlapping at an angle.
- **Geometric brand illustrations** carry illustrative depth where shadows would otherwise.', '{"sourcePath":"docs/design-md/coinbase/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved (essentially unused) |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 8px | Compact rows |
| `{rounded.md}` | 12px | Form inputs |
| `{rounded.lg}` | 16px | Mid-size cards |
| `{rounded.xl}` | 24px | Feature cards, product-UI mockups, pricing tiers |
| `{rounded.pill}` | 100px | All CTA buttons, search pills, badges |
| `{rounded.full}` | 9999px | Asset icon circles, avatars |

Pill for interactive, card-radius (24px) for containers, full circle for icons. Sharp corners absent.', '{"sourcePath":"docs/design-md/coinbase/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav-light`** — Default top nav on white pages. Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: Coinbase wordmark left, primary horizontal menu (Cryptocurrencies / Individuals / Businesses / Institutions / Developers / Company), search-icon + globe + Sign In + Sign Up CTAs right.

**`top-nav-on-dark`** — Top nav over a dark hero band. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same layout.

### Buttons

**`button-primary`** — The signature Coinbase Blue pill. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (16px / 600), padding 12px × 20px, height 44px, rounded `{rounded.pill}` (100px).

**`button-primary-active`** — Press state. Background `{colors.primary-active}`, deeper blue.

**`button-primary-disabled`** — Faded blue tint. Background `{colors.primary-disabled}`. Cursor not-allowed.

**`button-secondary-light`** — Soft-gray secondary on white surfaces. Background `{colors.surface-strong}`, text `{colors.ink}`, same pill geometry.

**`button-secondary-dark`** — Used on dark heroes. Background `{colors.surface-dark-elevated}`, text `{colors.on-dark}`, same pill geometry.

**`button-outline-on-dark`** — Transparent pill with white outline. Background transparent, text `{colors.on-dark}`, 1px white border.

**`button-tertiary-text`** — Inline text link. Background transparent, text `{colors.primary}`, type `{typography.button}`.

**`button-pill-cta`** — Larger pill CTA used on the homepage hero ("Get started"). Same Coinbase Blue palette but with 56px height and 16px × 32px padding for a prouder stance.

### Hero Bands

**`hero-band-dark`** — The signature full-bleed dark hero. Background `{colors.surface-dark}`, text `{colors.on-dark}`, full-bleed layered product-UI mockup cards. Display headline left in `{typography.display-mega}` (80px / 400), subhead in `{typography.body-md}`, two CTAs.

**`hero-band-light`** — White-canvas variant used on Wealth and Explore. Background `{colors.canvas}`, text `{colors.ink}`. Same skeleton, light palette.

### Cards

**`product-ui-card-dark`** — The floating product-UI mockup. Background `{colors.surface-dark-elevated}`, text `{colors.on-dark}`, rounded `{rounded.xl}` (24px), padding 32px. Often shown as 2-3 stacked cards at slight rotation, mimicking a layered dashboard.

**`product-ui-card-light`** — Light-canvas variant used on Explore for asset cards. Background `{colors.canvas}`, text `{colors.ink}`, same geometry, 1px hairline border.

**`feature-card`** — Used in 3-up and 2-up grids. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.title-md}`, rounded `{rounded.xl}`, padding 32px.

### Trading Surfaces

**`asset-row`** — Horizontal row in asset lists (Explore, Wealth). Background transparent, 1px hairline divider. Layout: 32px circular asset icon left, asset name + ticker, price column in `{typography.number-display}`, 24h change column with `{component.price-up-cell}` or `{component.price-down-cell}`.

**`price-up-cell`** + **`price-down-cell`** — Inline price-change cells. Color only — green or red text in `{typography.number-display}`, no background fill.

**`asset-icon-circular`** — Circular plate behind asset glyphs. Background `{colors.surface-strong}`, rounded `{rounded.full}`, 32px diameter.

### Pricing

**`pricing-tier-card`** — Standard pricing tier on Developer Platform. Background `{colors.canvas}`, rounded `{rounded.xl}`, padding 32px, 1px hairline border. Layout: tier name + price + feature checklist + CTA pill.

**`pricing-tier-featured`** — The featured tier. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same skeleton, dark palette — visual inversion signals "highlighted choice" without colored ribbons.

### Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, rounded `{rounded.md}` (12px), padding 14px × 16px, height 48px, 1px hairline border. On focus, border thickens to 2px Coinbase Blue.

**`search-input-pill`** — Pill-shaped search bar. Background `{colors.surface-strong}`, rounded `{rounded.pill}`, padding 12px × 20px, height 44px.

### Tags & Badges

**`badge-pill`** — Small uppercase pill used as section labels ("INSTITUTIONAL", "REGULATED"). Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-strong}`, rounded `{rounded.pill}`.

### CTA / Footer

**`cta-band-dark`** — Pre-footer "Take control of your money" band. Background `{colors.surface-dark}`, text `{colors.on-dark}`, vertical padding 96px. Centered headline + two CTAs.

**`footer-light`** — Closing white-canvas footer. Background `{colors.canvas}`, text `{colors.body}`. 6-column link list.

**`footer-link`** — Individual footer link. Background transparent, text `{colors.body}`.

**`legal-band`** — Bottom strip beneath footer columns. All text `{colors.muted}` at `{typography.caption}`.', '{"sourcePath":"docs/design-md/coinbase/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (Coinbase Blue) for primary CTAs, wordmark, brand-glyph illustrations, inline accent links.
- Set every CTA as `{rounded.pill}` (100px); every asset glyph as `{rounded.full}`.
- Keep CoinbaseDisplay headlines at weight 400.
- Use the dark/light band rotation as page rhythm.
- Render every numerical value in CoinbaseMono via `{typography.number-display}`.
- Pair every dark hero with a layered product-UI mockup card stack.

### Don''t
- Don''t introduce a secondary brand color. Coinbase Blue is the only action color; trading green/red are semantic-only.
- Don''t bold display copy — display sits at weight 400; bolding shifts the brand voice.
- Don''t add drop shadow tiers — system has one shadow tier.
- Don''t use sharp `{rounded.none}` (0px) on CTAs.
- Don''t mix CoinbaseDisplay and CoinbaseSans inside the same headline.
- Don''t use trading green/red as a button background.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA color is what appears on actual product CTAs, not on injected modals.', '{"sourcePath":"docs/design-md/coinbase/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 80→40px; feature card grid 1-up; asset row stacks; nav collapses to hamburger; layered product-UI cards collapse to single card. |
| Tablet | 640–1024px | Hero h1 64px; feature card grid 2-up; asset rows stay horizontal but compress columns. |
| Desktop | 1024–1280px | Full hero h1 80px; feature card grid 3-up; full asset row layout. |
| Wide | > 1280px | Content caps at 1200px; hero photography full-bleed. |

### Touch Targets
- Primary CTA pill at 44px height — at WCAG AAA.
- Larger hero pill (`{component.button-pill-cta}`) at 56px — well above AAA.
- Asset icon circles at 32px — borderline; padded 8px row creates effective 48px tap zone.
- Search pill at 44px height — at AAA.

### Collapsing Strategy
- Top nav switches to hamburger sheet below 768px. Sign Up CTA stays visible.
- Hero h1 steps down: 80 → 64 → 52 → 44 → 36px on smallest screens.
- Layered product-UI mockup cards collapse from 2-3 stacked into a single card on mobile.
- Pricing tier rows: 3-up → 2-up → 1-up.
- Asset rows on mobile stack vertically: ticker line on top, price + change line beneath.', '{"sourcePath":"docs/design-md/coinbase/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on a single component at a time. Reference YAML keys directly.
2. New CTAs default to `{rounded.pill}` (100px); new icon plates default to `{rounded.full}`. Cards use `{rounded.xl}`.
3. Variants live as separate entries inside the `components:` block.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented. Only Default and Active/Pressed.
6. CoinbaseDisplay 400 for display, CoinbaseSans 400/600/700 for body. CoinbaseMono on every number.
7. Coinbase Blue stays scarce — one or two blue moments per band.', '{"sourcePath":"docs/design-md/coinbase/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- CoinbaseDisplay, CoinbaseSans, CoinbaseMono are licensed; Inter and JetBrains Mono are documented substitutes.
- In-product trading surfaces (order book, charts, order forms) are behind login walls — this document covers marketing only.
- Animation timings out of scope.
- Form validation states beyond focus not visible on captured surfaces.
- Accent yellow appears only inside Bitcoin asset glyph illustrations; documented as illustrative-only.', '{"sourcePath":"docs/design-md/coinbase/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_1', '#0052ff', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_2', '#0a0b0d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_3', '#003ecc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_4', '#a8b8cc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_5', '#5b616e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_6', '#7c828a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_7', '#a8acb3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_8', '#dee1e6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_9', '#eef0f3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_10', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_11', '#f7f7f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_12', '#16181c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_13', '#05b169', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_14', '#cf202f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'color', 'color_15', '#f4b000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md'), 'typography', 'font_1', 'fontFamily: "''Coinbase Mono'', ''Coinbase Sans'', monospace', 'primary_detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/coinbase/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/coinbase/DESIGN.md';


-- Composio
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Composio', 'composio', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/composio/DESIGN.md', null, 'seeded', '---
version: alpha
name: Composio-design-analysis
description: A developer-tools brand for AI-agent tool integration whose marketing surfaces lean into a dark, technical aesthetic with a single deep-electric-blue voltage (`#0007cd`). The page floor is near-black (`#0f0f0f`); cards float above on subtle gray-tinted surfaces. abcDiatype carries display and body in a single sans family with weights 400-600. The brand''s strongest visual signature is a four-pane terminal-style mockup (a 2×2 grid of dark code/output panels) with a central blue spotlight glow — used as the homepage hero anchor.

colors:
  primary: "#0007cd"
  primary-active: "#0005a3"
  primary-glow: "#1a26ff"
  ink: "#ffffff"
  body: "#a8a8a8"
  body-strong: "#ffffff"
  muted: "#888888"
  muted-soft: "#666666"
  hairline: "#222222"
  hairline-soft: "#1a1a1a"
  hairline-strong: "#333333"
  canvas: "#0f0f0f"
  canvas-deep: "#000000"
  surface-card: "#181818"
  surface-card-elevated: "#222222"
  surface-strong: "#2a2a2a"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  accent-cyan: "#00d4ff"
  accent-violet: "#7b3aed"
  semantic-error: "#ff4d4d"
  semantic-success: "#33d17a"

typography:
  display-mega:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -2.16px
  display-xl:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -1.68px
  display-lg:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -1.32px
  display-md:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.96px
  display-sm:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.5px
  title-md:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.88px
    textTransform: uppercase
  code:
    fontFamily: "''JetBrains Mono'', ''Fira Code'', monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  nav-link:
    fontFamily: "''abcDiatype'', ui-sans-serif, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
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
  base: 16px
  md: 20px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  top-nav-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body-strong}"
    typography: "{typography.nav-link}"
    height: 64px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
    height: 40px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-secondary-dark:
    backgroundColor: "{colors.surface-card-elevated}"
    textColor: "{colors.body-strong}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
    height: 40px
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.body-strong}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 9px 17px
    height: 40px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.button}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body-strong}"
    typography: "{typography.display-mega}"
    padding: 96px
  terminal-mockup-grid:
    backgroundColor: "{colors.canvas-deep}"
    textColor: "{colors.body-strong}"
    typography: "{typography.code}"
    rounded: "{rounded.xl}"
    padding: 32px
  terminal-pane:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.code}"
    rounded: "{rounded.lg}"
    padding: 20px
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.title-md}"
    rounded: "{rounded.xl}"
    padding: 28px
  toolkit-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body-strong}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.lg}"
    padding: 20px
  toolkit-icon:
    backgroundColor: "{colors.surface-card-elevated}"
    rounded: "{rounded.md}"
    size: 40px
  spotlight-glow-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body-strong}"
    typography: "{typography.display-md}"
    rounded: "{rounded.xl}"
    padding: 48px
  code-block:
    backgroundColor: "{colors.canvas-deep}"
    textColor: "{colors.body}"
    typography: "{typography.code}"
    rounded: "{rounded.lg}"
    padding: 20px
  badge-pill:
    backgroundColor: "{colors.surface-card-elevated}"
    textColor: "{colors.body-strong}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body-strong}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 44px
  search-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body-strong}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    height: 40px
  cta-band-spotlight:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body-strong}"
    typography: "{typography.display-lg}"
    padding: 96px
  testimonial-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  footer-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 64px 48px
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
---

## Overview

Composio''s marketing site reads like a serious developer-infrastructure brand — closer to Vercel or Stripe Docs in atmosphere than to a typical AI-tools startup. The base canvas is a near-black `{colors.canvas}` (#0f0f0f) holding white type and a single voltage of **deep electric blue** (`{colors.primary}` — #0007cd) carrying every primary CTA, brand wordmark, and atmospheric spotlight glow that backs the homepage hero.

Type runs **abcDiatype** as the single sans family across display, body, navigation, and captions. Display sits at weight 500 — confident but not bombastic. Code blocks and terminal mockups switch to JetBrains Mono.

The page rhythm is monolithic: dark canvas top to bottom with subtle elevation steps via card surfaces. The brand''s strongest visual signature is a **four-pane terminal-style mockup** — a 2×2 grid of dark code/output panels with a central blue spotlight glow behind them.

**Key Characteristics:**
- Single accent: `{colors.primary}` (#0007cd) for primary CTAs, wordmark, spotlight glows.
- Single sans family: abcDiatype carries everything except code (JetBrains Mono).
- Dark monolithic canvas: `{colors.canvas}` runs top to bottom; depth from `{colors.surface-card}` and `{colors.surface-card-elevated}` brightness steps.
- Terminal-mockup hero: 2×2 grid of code/output panes is the brand signature.
- Compact pill geometry: CTAs sit at `{rounded.md}` (8px), not full pills — developer-tool dialect.
- Spotlight-glow atmospheric backdrop: a radial blue glow centered behind hero content.
- 96px section rhythm.

## Colors

### Brand & Accent
- **Composio Blue** (`{colors.primary}` — #0007cd): Primary CTAs, wordmark, spotlight glow center.
- **Composio Blue Active** (`{colors.primary-active}` — #0005a3): Press state.
- **Spotlight Glow Tone** (`{colors.primary-glow}` — #1a26ff): Brighter blue used inside radial atmospheric glows.
- **Accent Cyan** (`{colors.accent-cyan}` — #00d4ff): Sparingly on data-flow visualizations.
- **Accent Violet** (`{colors.accent-violet}` — #7b3aed): Inside specific product illustrations only.

### Surface
- **Canvas** (`{colors.canvas}` — #0f0f0f): Page floor — near-black.
- **Canvas Deep** (`{colors.canvas-deep}` — #000000): Pure black for terminal mockup grids and code blocks.
- **Surface Card** (`{colors.surface-card}` — #181818): Default content card.
- **Surface Card Elevated** (`{colors.surface-card-elevated}` — #222222): Terminal panes, secondary buttons.
- **Surface Strong** (`{colors.surface-strong}` — #2a2a2a): Dropdown menus.

### Hairlines
- **Hairline** (`{colors.hairline}` — #222222): Default 1px divider.
- **Hairline Soft** (`{colors.hairline-soft}` — #1a1a1a): Lighter divider.
- **Hairline Strong** (`{colors.hairline-strong}` — #333333): Stronger panel outline.

### Text
- **Ink** (`{colors.ink}` — #ffffff): Display headlines.
- **Body** (`{colors.body}` — #a8a8a8): Default running-text — soft gray.
- **Body Strong** (`{colors.body-strong}` — #ffffff): Same as ink.
- **Muted** (`{colors.muted}` — #888888): Sub-titles, breadcrumbs.
- **Muted Soft** (`{colors.muted-soft}` — #666666): Disabled text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on blue CTAs.

### Semantic
- **Success** (`{colors.semantic-success}` — #33d17a): "Online", "active" indicators.
- **Error** (`{colors.semantic-error}` — #ff4d4d): Validation errors.

## Typography

### Font Family
The system runs **abcDiatype** (Lineto) across every text role. Code blocks switch to **JetBrains Mono**. Fallback: `ui-sans-serif, system-ui, sans-serif`.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 72px | 500 | 1.05 | -2.16px | Homepage hero h1 |
| `{typography.display-xl}` | 56px | 500 | 1.05 | -1.68px | Subsidiary heroes |
| `{typography.display-lg}` | 44px | 500 | 1.1 | -1.32px | Section heads |
| `{typography.display-md}` | 32px | 500 | 1.15 | -0.96px | Sub-section heads |
| `{typography.display-sm}` | 24px | 500 | 1.25 | -0.5px | Card group titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Component titles |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Toolkit card titles |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 13px | 400 | 1.4 | 0 | Photo captions |
| `{typography.caption-uppercase}` | 11px | 600 | 1.4 | 0.88px | Section labels, badge pills |
| `{typography.code}` | 13px | 400 | 1.5 | 0 | Code blocks — JetBrains Mono |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | CTA pill labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu |

### Principles
- **Display weight stays at 500.** Confident but not display-bold.
- **abcDiatype across every role.** No display/body family split.
- **JetBrains Mono on every code surface.**

### Note on Font Substitutes
abcDiatype is a Lineto licensed typeface. Open-source substitute: **Inter** at weight 500 with letter-spacing -1.5%.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) for major bands.

### Grid & Container
- Max content width: ~1200px.
- Editorial body: 12-column grid.
- Terminal mockup grid: 2×2 equal-size panes.
- Toolkit grid: 4-up at desktop, 2-up tablet, 1-up mobile.
- Footer: 5-column at desktop.

### Whitespace Philosophy
The dark canvas creates its own depth — whitespace can stay tight without feeling crowded. 96px between bands; 24px between cards inside a band.

## Elevation & Depth

The system uses **brightness-step elevation**: surfaces step up in brightness instead of casting drop shadows. Combined with subtle radial blue glows, this creates a focused dark-mode atmosphere.

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#0f0f0f) | Body bands, footer |
| Recessed | `{colors.canvas-deep}` (#000000) | Terminal mockup grid background, code blocks |
| Card | `{colors.surface-card}` (#181818) | Default content cards |
| Card elevated | `{colors.surface-card-elevated}` (#222222) | Terminal panes, secondary buttons |
| Atmospheric glow | Radial gradient using `{colors.primary-glow}` | Hero spotlight backdrop |

### Decorative Depth
- **Spotlight glow backdrops** — radial blue gradient centered behind hero content.
- **Terminal-pane brightness ladder** — 2×2 mockup uses canvas-deep outer + surface-card-elevated panes.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 6px | Compact rows |
| `{rounded.md}` | 8px | CTA buttons, form inputs |
| `{rounded.lg}` | 12px | Toolkit cards, code blocks, terminal panes |
| `{rounded.xl}` | 16px | Feature cards, terminal mockup grids |
| `{rounded.pill}` | 9999px | Section-label badges |
| `{rounded.full}` | 9999px | Avatar plates (rare) |

Compact developer-ergonomic radii — 8px CTAs, 12-16px cards. Signals "developer tool" rather than "consumer brand."

## Components

### Top Navigation

**`top-nav-dark`** — Default top nav. Background `{colors.canvas}`, text `{colors.body-strong}`, height 64px. Layout: Composio wordmark left, primary horizontal menu (Product / Toolkits / Docs / Pricing / Customers / Blog), GitHub stars + Sign In + "Get started" right.

### Buttons

**`button-primary`** — The signature Composio Blue CTA. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (14px / 500), padding 10px × 18px, height 40px, rounded `{rounded.md}` (8px).

**`button-primary-active`** — Press state. Background `{colors.primary-active}`.

**`button-secondary-dark`** — Surface-elevated secondary. Background `{colors.surface-card-elevated}`, text `{colors.body-strong}`.

**`button-outline`** — Transparent with 1px hairline-strong border.

**`button-tertiary-text`** — Inline text link.

### Hero & Atmospheric

**`hero-band`** — Homepage hero. Background `{colors.canvas}`, full-width display headline in `{typography.display-mega}` (72px / 500), subhead, two CTAs, and a spotlight-glow backdrop emanating from behind the centered terminal-mockup grid.

**`terminal-mockup-grid`** — The brand''s strongest visual signature. 2×2 grid of dark code/output panels inside a `{rounded.xl}` (16px) container. Background `{colors.canvas-deep}`, padding 32px, gap 16px.

**`terminal-pane`** — Individual code/output panel inside the mockup grid. Background `{colors.surface-card}`, text `{colors.body}` in `{typography.code}`, rounded `{rounded.lg}` (12px), padding 20px.

**`spotlight-glow-card`** — Large feature card with centered display headline and a radial blue glow behind it. Background `{colors.surface-card}`, text `{colors.body-strong}` in `{typography.display-md}`, rounded `{rounded.xl}`, padding 48px.

### Cards

**`feature-card`** — 3-up benefit grid. Background `{colors.surface-card}`, text `{colors.body}`, type `{typography.title-md}`, rounded `{rounded.xl}`, padding 28px.

**`toolkit-card`** — 4-up toolkit grid (Slack, GitHub, Stripe, Notion, Linear, etc.). Background `{colors.surface-card}`, text `{colors.body-strong}`, type `{typography.title-sm}`, rounded `{rounded.lg}`, padding 20px. 40px square `{component.toolkit-icon}` top, toolkit name, one-line description.

**`toolkit-icon`** — Square icon plate. Background `{colors.surface-card-elevated}`, rounded `{rounded.md}`, 40px size.

**`testimonial-card`** — Quote card. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 24px.

### Code

**`code-block`** — Inline code/terminal block. Background `{colors.canvas-deep}`, text `{colors.body}` in `{typography.code}`, rounded `{rounded.lg}`, padding 20px.

### Forms

**`text-input`** — Background `{colors.surface-card}`, text `{colors.body-strong}`, rounded `{rounded.md}` (8px), padding 12px × 16px, height 44px.

**`search-input`** — Compact search field. Same surface and radius, smaller padding, 40px height.

### Tags & Badges

**`badge-pill`** — Small uppercase pill. Background `{colors.surface-card-elevated}`, text `{colors.body-strong}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 10px.

### CTA / Footer

**`cta-band-spotlight`** — Pre-footer band. Background `{colors.canvas}` with centered radial spotlight glow. Display headline + single primary CTA pill. 96px padding.

**`footer-dark`** — Closing footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`** — Background transparent, text `{colors.body}`, type `{typography.body-sm}`.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` for primary CTAs, wordmark, and spotlight glows.
- Use `{rounded.md}` (8px) for every CTA — not full pills.
- Use brightness-step ladder for elevation; avoid drop shadows.
- Pair every hero with a centered radial blue spotlight glow.
- Render code, CLI commands in JetBrains Mono via `{typography.code}`.
- Use the 2×2 terminal-mockup grid as the homepage hero anchor.

### Don''t
- Don''t introduce a secondary brand color. Cyan and violet are illustrative-only.
- Don''t use full pills on CTAs.
- Don''t drop display weight to 400.
- Don''t add drop shadow tiers.
- Don''t use canvas-deep (#000000) outside terminal/code surfaces.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA color is what appears on actual page CTAs.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 72→36px; terminal mockup grid collapses to single pane; toolkit grid 1-up; nav hamburger. |
| Tablet | 640–1024px | Hero h1 56px; terminal mockup grid stays 2×2; toolkit grid 2-up. |
| Desktop | 1024–1280px | Full hero h1 72px; full 2×2 terminal mockup; toolkit grid 4-up. |
| Wide | > 1280px | Content caps at 1200px. |

### Touch Targets
- Primary CTA at 40px height — at WCAG AA, padded for AAA.
- Search input at 40px.

### Collapsing Strategy
- Top nav switches to hamburger below 768px.
- Terminal mockup 2×2 grid collapses to a single pane on mobile.
- Toolkit grid: 4-up → 2-up → 1-up.
- Hero spotlight glow stays at every breakpoint.

## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `{rounded.md}` (8px). Cards use `{rounded.lg}` or `{rounded.xl}`.
3. Variants live as separate entries inside `components:`.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented.
6. abcDiatype 500 for display, 400/600 for body. JetBrains Mono on every code surface.
7. Composio Blue stays scarce.

## Known Gaps

- abcDiatype is licensed; Inter is the substitute.
- Animation timings out of scope.
- In-product surfaces (toolkit dashboards, agent playground) are behind login walls.
- Form validation states beyond focus not visible on captured surfaces.
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

Composio''s marketing site reads like a serious developer-infrastructure brand — closer to Vercel or Stripe Docs in atmosphere than to a typical AI-tools startup. The base canvas is a near-black `{colors.canvas}` (#0f0f0f) holding white type and a single voltage of **deep electric blue** (`{colors.primary}` — #0007cd) carrying every primary CTA, brand wordmark, and atmospheric spotlight glow that backs the homepage hero.

Type runs **abcDiatype** as the single sans family across display, body, navigation, and captions. Display sits at weight 500 — confident but not bombastic. Code blocks and terminal mockups switch to JetBrains Mono.

The page rhythm is monolithic: dark canvas top to bottom with subtle elevation steps via card surfaces. The brand''s strongest visual signature is a **four-pane terminal-style mockup** — a 2×2 grid of dark code/output panels with a central blue spotlight glow behind them.

**Key Characteristics:**
- Single accent: `{colors.primary}` (#0007cd) for primary CTAs, wordmark, spotlight glows.
- Single sans family: abcDiatype carries everything except code (JetBrains Mono).
- Dark monolithic canvas: `{colors.canvas}` runs top to bottom; depth from `{colors.surface-card}` and `{colors.surface-card-elevated}` brightness steps.
- Terminal-mockup hero: 2×2 grid of code/output panes is the brand signature.
- Compact pill geometry: CTAs sit at `{rounded.md}` (8px), not full pills — developer-tool dialect.
- Spotlight-glow atmospheric backdrop: a radial blue glow centered behind hero content.
- 96px section rhythm.', '{"sourcePath":"docs/design-md/composio/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Composio Blue** (`{colors.primary}` — #0007cd): Primary CTAs, wordmark, spotlight glow center.
- **Composio Blue Active** (`{colors.primary-active}` — #0005a3): Press state.
- **Spotlight Glow Tone** (`{colors.primary-glow}` — #1a26ff): Brighter blue used inside radial atmospheric glows.
- **Accent Cyan** (`{colors.accent-cyan}` — #00d4ff): Sparingly on data-flow visualizations.
- **Accent Violet** (`{colors.accent-violet}` — #7b3aed): Inside specific product illustrations only.

### Surface
- **Canvas** (`{colors.canvas}` — #0f0f0f): Page floor — near-black.
- **Canvas Deep** (`{colors.canvas-deep}` — #000000): Pure black for terminal mockup grids and code blocks.
- **Surface Card** (`{colors.surface-card}` — #181818): Default content card.
- **Surface Card Elevated** (`{colors.surface-card-elevated}` — #222222): Terminal panes, secondary buttons.
- **Surface Strong** (`{colors.surface-strong}` — #2a2a2a): Dropdown menus.

### Hairlines
- **Hairline** (`{colors.hairline}` — #222222): Default 1px divider.
- **Hairline Soft** (`{colors.hairline-soft}` — #1a1a1a): Lighter divider.
- **Hairline Strong** (`{colors.hairline-strong}` — #333333): Stronger panel outline.

### Text
- **Ink** (`{colors.ink}` — #ffffff): Display headlines.
- **Body** (`{colors.body}` — #a8a8a8): Default running-text — soft gray.
- **Body Strong** (`{colors.body-strong}` — #ffffff): Same as ink.
- **Muted** (`{colors.muted}` — #888888): Sub-titles, breadcrumbs.
- **Muted Soft** (`{colors.muted-soft}` — #666666): Disabled text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on blue CTAs.

### Semantic
- **Success** (`{colors.semantic-success}` — #33d17a): "Online", "active" indicators.
- **Error** (`{colors.semantic-error}` — #ff4d4d): Validation errors.', '{"sourcePath":"docs/design-md/composio/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
The system runs **abcDiatype** (Lineto) across every text role. Code blocks switch to **JetBrains Mono**. Fallback: `ui-sans-serif, system-ui, sans-serif`.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 72px | 500 | 1.05 | -2.16px | Homepage hero h1 |
| `{typography.display-xl}` | 56px | 500 | 1.05 | -1.68px | Subsidiary heroes |
| `{typography.display-lg}` | 44px | 500 | 1.1 | -1.32px | Section heads |
| `{typography.display-md}` | 32px | 500 | 1.15 | -0.96px | Sub-section heads |
| `{typography.display-sm}` | 24px | 500 | 1.25 | -0.5px | Card group titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Component titles |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Toolkit card titles |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 13px | 400 | 1.4 | 0 | Photo captions |
| `{typography.caption-uppercase}` | 11px | 600 | 1.4 | 0.88px | Section labels, badge pills |
| `{typography.code}` | 13px | 400 | 1.5 | 0 | Code blocks — JetBrains Mono |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | CTA pill labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu |

### Principles
- **Display weight stays at 500.** Confident but not display-bold.
- **abcDiatype across every role.** No display/body family split.
- **JetBrains Mono on every code surface.**

### Note on Font Substitutes
abcDiatype is a Lineto licensed typeface. Open-source substitute: **Inter** at weight 500 with letter-spacing -1.5%.', '{"sourcePath":"docs/design-md/composio/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) for major bands.

### Grid & Container
- Max content width: ~1200px.
- Editorial body: 12-column grid.
- Terminal mockup grid: 2×2 equal-size panes.
- Toolkit grid: 4-up at desktop, 2-up tablet, 1-up mobile.
- Footer: 5-column at desktop.

### Whitespace Philosophy
The dark canvas creates its own depth — whitespace can stay tight without feeling crowded. 96px between bands; 24px between cards inside a band.', '{"sourcePath":"docs/design-md/composio/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

The system uses **brightness-step elevation**: surfaces step up in brightness instead of casting drop shadows. Combined with subtle radial blue glows, this creates a focused dark-mode atmosphere.

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#0f0f0f) | Body bands, footer |
| Recessed | `{colors.canvas-deep}` (#000000) | Terminal mockup grid background, code blocks |
| Card | `{colors.surface-card}` (#181818) | Default content cards |
| Card elevated | `{colors.surface-card-elevated}` (#222222) | Terminal panes, secondary buttons |
| Atmospheric glow | Radial gradient using `{colors.primary-glow}` | Hero spotlight backdrop |

### Decorative Depth
- **Spotlight glow backdrops** — radial blue gradient centered behind hero content.
- **Terminal-pane brightness ladder** — 2×2 mockup uses canvas-deep outer + surface-card-elevated panes.', '{"sourcePath":"docs/design-md/composio/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 6px | Compact rows |
| `{rounded.md}` | 8px | CTA buttons, form inputs |
| `{rounded.lg}` | 12px | Toolkit cards, code blocks, terminal panes |
| `{rounded.xl}` | 16px | Feature cards, terminal mockup grids |
| `{rounded.pill}` | 9999px | Section-label badges |
| `{rounded.full}` | 9999px | Avatar plates (rare) |

Compact developer-ergonomic radii — 8px CTAs, 12-16px cards. Signals "developer tool" rather than "consumer brand."', '{"sourcePath":"docs/design-md/composio/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav-dark`** — Default top nav. Background `{colors.canvas}`, text `{colors.body-strong}`, height 64px. Layout: Composio wordmark left, primary horizontal menu (Product / Toolkits / Docs / Pricing / Customers / Blog), GitHub stars + Sign In + "Get started" right.

### Buttons

**`button-primary`** — The signature Composio Blue CTA. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (14px / 500), padding 10px × 18px, height 40px, rounded `{rounded.md}` (8px).

**`button-primary-active`** — Press state. Background `{colors.primary-active}`.

**`button-secondary-dark`** — Surface-elevated secondary. Background `{colors.surface-card-elevated}`, text `{colors.body-strong}`.

**`button-outline`** — Transparent with 1px hairline-strong border.

**`button-tertiary-text`** — Inline text link.

### Hero & Atmospheric

**`hero-band`** — Homepage hero. Background `{colors.canvas}`, full-width display headline in `{typography.display-mega}` (72px / 500), subhead, two CTAs, and a spotlight-glow backdrop emanating from behind the centered terminal-mockup grid.

**`terminal-mockup-grid`** — The brand''s strongest visual signature. 2×2 grid of dark code/output panels inside a `{rounded.xl}` (16px) container. Background `{colors.canvas-deep}`, padding 32px, gap 16px.

**`terminal-pane`** — Individual code/output panel inside the mockup grid. Background `{colors.surface-card}`, text `{colors.body}` in `{typography.code}`, rounded `{rounded.lg}` (12px), padding 20px.

**`spotlight-glow-card`** — Large feature card with centered display headline and a radial blue glow behind it. Background `{colors.surface-card}`, text `{colors.body-strong}` in `{typography.display-md}`, rounded `{rounded.xl}`, padding 48px.

### Cards

**`feature-card`** — 3-up benefit grid. Background `{colors.surface-card}`, text `{colors.body}`, type `{typography.title-md}`, rounded `{rounded.xl}`, padding 28px.

**`toolkit-card`** — 4-up toolkit grid (Slack, GitHub, Stripe, Notion, Linear, etc.). Background `{colors.surface-card}`, text `{colors.body-strong}`, type `{typography.title-sm}`, rounded `{rounded.lg}`, padding 20px. 40px square `{component.toolkit-icon}` top, toolkit name, one-line description.

**`toolkit-icon`** — Square icon plate. Background `{colors.surface-card-elevated}`, rounded `{rounded.md}`, 40px size.

**`testimonial-card`** — Quote card. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 24px.

### Code

**`code-block`** — Inline code/terminal block. Background `{colors.canvas-deep}`, text `{colors.body}` in `{typography.code}`, rounded `{rounded.lg}`, padding 20px.

### Forms

**`text-input`** — Background `{colors.surface-card}`, text `{colors.body-strong}`, rounded `{rounded.md}` (8px), padding 12px × 16px, height 44px.

**`search-input`** — Compact search field. Same surface and radius, smaller padding, 40px height.

### Tags & Badges

**`badge-pill`** — Small uppercase pill. Background `{colors.surface-card-elevated}`, text `{colors.body-strong}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 10px.

### CTA / Footer

**`cta-band-spotlight`** — Pre-footer band. Background `{colors.canvas}` with centered radial spotlight glow. Display headline + single primary CTA pill. 96px padding.

**`footer-dark`** — Closing footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`** — Background transparent, text `{colors.body}`, type `{typography.body-sm}`.', '{"sourcePath":"docs/design-md/composio/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` for primary CTAs, wordmark, and spotlight glows.
- Use `{rounded.md}` (8px) for every CTA — not full pills.
- Use brightness-step ladder for elevation; avoid drop shadows.
- Pair every hero with a centered radial blue spotlight glow.
- Render code, CLI commands in JetBrains Mono via `{typography.code}`.
- Use the 2×2 terminal-mockup grid as the homepage hero anchor.

### Don''t
- Don''t introduce a secondary brand color. Cyan and violet are illustrative-only.
- Don''t use full pills on CTAs.
- Don''t drop display weight to 400.
- Don''t add drop shadow tiers.
- Don''t use canvas-deep (#000000) outside terminal/code surfaces.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA color is what appears on actual page CTAs.', '{"sourcePath":"docs/design-md/composio/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 72→36px; terminal mockup grid collapses to single pane; toolkit grid 1-up; nav hamburger. |
| Tablet | 640–1024px | Hero h1 56px; terminal mockup grid stays 2×2; toolkit grid 2-up. |
| Desktop | 1024–1280px | Full hero h1 72px; full 2×2 terminal mockup; toolkit grid 4-up. |
| Wide | > 1280px | Content caps at 1200px. |

### Touch Targets
- Primary CTA at 40px height — at WCAG AA, padded for AAA.
- Search input at 40px.

### Collapsing Strategy
- Top nav switches to hamburger below 768px.
- Terminal mockup 2×2 grid collapses to a single pane on mobile.
- Toolkit grid: 4-up → 2-up → 1-up.
- Hero spotlight glow stays at every breakpoint.', '{"sourcePath":"docs/design-md/composio/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `{rounded.md}` (8px). Cards use `{rounded.lg}` or `{rounded.xl}`.
3. Variants live as separate entries inside `components:`.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented.
6. abcDiatype 500 for display, 400/600 for body. JetBrains Mono on every code surface.
7. Composio Blue stays scarce.', '{"sourcePath":"docs/design-md/composio/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- abcDiatype is licensed; Inter is the substitute.
- Animation timings out of scope.
- In-product surfaces (toolkit dashboards, agent playground) are behind login walls.
- Form validation states beyond focus not visible on captured surfaces.', '{"sourcePath":"docs/design-md/composio/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_1', '#0007cd', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_2', '#0f0f0f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_3', '#0005a3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_4', '#1a26ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_5', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_6', '#a8a8a8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_7', '#888888', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_8', '#666666', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_9', '#222222', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_10', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_11', '#333333', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_12', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_13', '#181818', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_14', '#2a2a2a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_15', '#00d4ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_16', '#7b3aed', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_17', '#ff4d4d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md'), 'color', 'color_18', '#33d17a', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/composio/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/composio/DESIGN.md';


-- Cursor
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Cursor', 'cursor', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/cursor/DESIGN.md', null, 'seeded', '---
version: alpha
name: Cursor-design-analysis
description: An AI-first code editor whose marketing site reads like a quietly-confident developer-tools brand with a warm-cream editorial canvas (`#f7f7f4`) instead of the typical dark IDE atmosphere. Near-black warm ink (`#26251e`) carries body and display alike — display sits at weight 400 with negative letter-spacing for a magazine feel rather than a bold tech voice. The single brand voltage is **Cursor Orange** (`#f54e00`) reserved for primary CTAs and the wordmark. A signature pastel timeline palette (peach, mint, blue, lavender, gold) marks AI-action stages (Thinking / Reading / Editing / Grepping / Done) — only inside in-product timeline visualizations. Cards use minimal hairlines, no shadows, generous 80px section rhythm. CursorGothic for display/body, JetBrains Mono on every code surface (which is roughly half the page).

colors:
  primary: "#f54e00"
  primary-active: "#d04200"
  ink: "#26251e"
  body: "#5a5852"
  body-strong: "#26251e"
  muted: "#807d72"
  muted-soft: "#a09c92"
  hairline: "#e6e5e0"
  hairline-soft: "#efeee8"
  hairline-strong: "#cfcdc4"
  canvas: "#f7f7f4"
  canvas-soft: "#fafaf7"
  surface-card: "#ffffff"
  surface-strong: "#e6e5e0"
  on-primary: "#ffffff"
  timeline-thinking: "#dfa88f"
  timeline-grep: "#9fc9a2"
  timeline-read: "#9fbbe0"
  timeline-edit: "#c0a8dd"
  timeline-done: "#c08532"
  semantic-error: "#cf2d56"
  semantic-success: "#1f8a65"

typography:
  display-mega:
    fontFamily: "''CursorGothic'', system-ui, ''Helvetica Neue'', Helvetica, Arial, sans-serif"
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -2.16px
  display-lg:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.72px
  display-md:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 26px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.325px
  display-sm:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.11px
  title-md:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-tracked:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.08px
  body-sm:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.88px
    textTransform: uppercase
  code:
    fontFamily: "''JetBrains Mono'', ''Fira Code'', monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  nav-link:
    fontFamily: "''CursorGothic'', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
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
  base: 16px
  md: 20px
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
    rounded: "{rounded.md}"
    padding: 10px 18px
    height: 40px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 9px 17px
    height: 40px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
  button-download:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 44px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-mega}"
    padding: 80px
  ide-mockup-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 0
  ide-pane:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.body}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: 16px
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  comparison-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  timeline-pill-thinking:
    backgroundColor: "{colors.timeline-thinking}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-grep:
    backgroundColor: "{colors.timeline-grep}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-read:
    backgroundColor: "{colors.timeline-read}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-edit:
    backgroundColor: "{colors.timeline-edit}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-done:
    backgroundColor: "{colors.timeline-done}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  code-block:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.lg}"
    padding: 20px
  pricing-tier-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-tier-featured:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 44px
  badge-pill:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  cta-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: 96px
  testimonial-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 64px 48px
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
---

## Overview

Cursor''s marketing site reads as a quietly-confident developer brand that believes in editorial calm over IDE-darkness. The base canvas is **warm cream** (`{colors.canvas}` — #f7f7f4) holding warm near-black ink (`{colors.ink}` — #26251e) for body and display alike. The single brand voltage is **Cursor Orange** (`{colors.primary}` — #f54e00) reserved for primary CTAs and the wordmark — used scarcely.

Type runs **CursorGothic** as the single sans family. Display sits at weight 400 with negative letter-spacing — a magazine-editorial voice rather than tech-bombastic. JetBrains Mono carries every code surface (and code surfaces are roughly half the page).

The brand''s strongest visual signature is the **AI-timeline pill palette**: five pastel pills (peach `{colors.timeline-thinking}`, mint `{colors.timeline-grep}`, blue `{colors.timeline-read}`, lavender `{colors.timeline-edit}`, gold `{colors.timeline-done}`) marking AI-action stages inside in-product timeline visualizations. Used only in product UI — never as system action colors.

**Key Characteristics:**
- Warm cream canvas, not white. Ink is warm (#26251e), not pure black.
- Single CTA color: `{colors.primary}` (Cursor Orange #f54e00). Used scarcely.
- Display weight stays at 400 — never bold. Magazine voice.
- AI timeline pastels: 5 dedicated tokens for in-product agent action stages.
- Compact 8px CTA radius — developer dialect.
- Hairline-only depth; no drop shadows.
- 80px section rhythm.

## Colors

### Brand & Accent
- **Cursor Orange** (`{colors.primary}` — #f54e00): Primary CTA pills, wordmark, hero accent. Used scarcely.
- **Cursor Orange Active** (`{colors.primary-active}` — #d04200): Press state.

### Surface
- **Canvas** (`{colors.canvas}` — #f7f7f4): Warm cream page floor.
- **Canvas Soft** (`{colors.canvas-soft}` — #fafaf7): IDE-pane background inside mockups.
- **Surface Card** (`{colors.surface-card}` — #ffffff): Pure white card surface — slight contrast against the cream canvas.
- **Surface Strong** (`{colors.surface-strong}` — #e6e5e0): Badges, tag pills.

### Hairlines
- **Hairline** (`{colors.hairline}` — #e6e5e0): 1px divider.
- **Hairline Soft** (`{colors.hairline-soft}` — #efeee8): Lighter divider.
- **Hairline Strong** (`{colors.hairline-strong}` — #cfcdc4): Stronger panel outline.

### Text
- **Ink** (`{colors.ink}` — #26251e): Display, body emphasis. Warm near-black.
- **Body** (`{colors.body}` — #5a5852): Default running-text.
- **Body Strong** (`{colors.body-strong}` — #26251e): Same as ink.
- **Muted** (`{colors.muted}` — #807d72): Sub-titles.
- **Muted Soft** (`{colors.muted-soft}` — #a09c92): Disabled text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on Cursor Orange.

### Timeline (AI-action signature)
- **Thinking** (`{colors.timeline-thinking}` — #dfa88f): Peach. Used inside in-product agent timeline only.
- **Grep** (`{colors.timeline-grep}` — #9fc9a2): Mint.
- **Read** (`{colors.timeline-read}` — #9fbbe0): Pastel blue.
- **Edit** (`{colors.timeline-edit}` — #c0a8dd): Lavender.
- **Done** (`{colors.timeline-done}` — #c08532): Warm gold.

### Semantic
- **Success** (`{colors.semantic-success}` — #1f8a65): Confirmation indicators.
- **Error** (`{colors.semantic-error}` — #cf2d56): Validation errors.

## Typography

### Font Family
**CursorGothic** is the licensed display + body family. Fallback: `system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif`. Code surfaces switch to **JetBrains Mono**.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 72px | 400 | 1.1 | -2.16px | Homepage hero h1 |
| `{typography.display-lg}` | 36px | 400 | 1.2 | -0.72px | Section heads |
| `{typography.display-md}` | 26px | 400 | 1.25 | -0.325px | Sub-section heads |
| `{typography.display-sm}` | 22px | 400 | 1.3 | -0.11px | Card group titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Component titles |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | List labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-tracked}` | 16px | 400 | 1.5 | 0.08px | Tracked editorial body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 13px | 400 | 1.4 | 0 | Photo captions |
| `{typography.caption-uppercase}` | 11px | 600 | 1.4 | 0.88px | Section labels, timeline pill labels |
| `{typography.code}` | 13px | 400 | 1.5 | 0 | Code blocks — JetBrains Mono |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | CTA pill labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu |

### Principles
- **Display weight stays at 400.** Magazine voice, never bold.
- **Negative letter-spacing on display only.** -0.11px to -2.16px tracking.
- **JetBrains Mono on every code surface.**

### Note on Font Substitutes
CursorGothic is licensed. Open-source substitute: **Inter** at weight 400 with letter-spacing -1.5%. Or **GT Sectra** for a more editorial feel.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px.
- **Section padding:** 80px.

### Grid & Container
- Max content width: ~1200px.
- Editorial body: 12-column grid.
- Feature card grids: 2-up at desktop for splits, 3-up for benefits.
- Footer: 5-column at desktop.

### Whitespace Philosophy
Generous editorial pacing — closer to a print magazine than a tech site. The cream canvas has plenty of breathing room; cards within bands sit close (16-24px gap).

## Elevation & Depth

The system uses **hairline-only depth**. No drop shadows, no elevation tiers. Cards float above the canvas via 1px hairlines and the slight white-on-cream contrast.

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#f7f7f4) | Body bands, footer |
| Card | `{colors.surface-card}` (#ffffff) | Content cards |
| Hairline border | 1px `{colors.hairline}` | Card outlines, dividers |
| IDE pane | `{colors.canvas-soft}` (#fafaf7) | Inside IDE mockup cards |

### Decorative Depth
- **IDE-mockup cards** are the only "elevated" element. White card on cream canvas with internal pane structure mimicking the actual Cursor editor.
- **Timeline pastel pills** add chromatic depth without surface elevation.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 6px | Compact rows |
| `{rounded.md}` | 8px | CTA buttons, form inputs |
| `{rounded.lg}` | 12px | Cards, IDE panes |
| `{rounded.xl}` | 16px | Larger feature cards (rare) |
| `{rounded.pill}` | 9999px | Timeline pills, badges |
| `{rounded.full}` | 9999px | Avatars (rare) |

## Components

### Top Navigation

**`top-nav`** — Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: Cursor wordmark left, primary horizontal menu (Pricing / Features / Enterprise / Blog / Forum / Careers), Sign In + Download primary CTA right.

### Buttons

**`button-primary`** — The signature Cursor Orange CTA. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (14px / 500), padding 10px × 18px, height 40px, rounded `{rounded.md}` (8px).

**`button-primary-active`** — Press state. Background `{colors.primary-active}`.

**`button-secondary`** — White card pill on cream canvas. Background `{colors.surface-card}`, text `{colors.ink}`, 1px `{colors.hairline-strong}` border.

**`button-tertiary-text`** — Inline ink text link.

**`button-download`** — Larger ink-canvas CTA. Background `{colors.ink}`, text `{colors.canvas}`, padding 12px × 20px, height 44px. Used for "Download for macOS" type CTAs.

### Hero & IDE Mockups

**`hero-band`** — Background `{colors.canvas}`, full-width display headline in `{typography.display-mega}` (72px / 400 / -2.16px), subhead in `{typography.body-md}`, two CTAs (`button-download` + `button-tertiary-text`), and a centered IDE-mockup card below the hero copy.

**`ide-mockup-card`** — A white card containing a multi-pane IDE mockup (sidebar + main editor + chat panel + terminal). Background `{colors.surface-card}`, rounded `{rounded.lg}` (12px), 1px `{colors.hairline}` border, no padding (panes fill the card edge-to-edge).

**`ide-pane`** — Individual IDE pane inside the mockup. Background `{colors.canvas-soft}`, text `{colors.body}` in `{typography.code}` (JetBrains Mono 13px), rounded `{rounded.md}` (8px), padding 16px.

### Cards

**`feature-card`** — Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.title-md}`, rounded `{rounded.lg}`, padding 24px. 1px `{colors.hairline}` border.

**`comparison-card`** — Side-by-side "Cursor vs other tools" card. Same surface and rounding; internally split into 2 columns.

**`testimonial-card`** — Quote card. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 24px.

### AI Timeline (signature)

**`timeline-pill-thinking`** — Peach pill. Background `{colors.timeline-thinking}`, text `{colors.ink}`, type `{typography.caption-uppercase}` (11px / 600 / 0.88px tracking, uppercase), rounded `{rounded.pill}`, padding 4px × 10px. Marks "Thinking" stage in product timeline.

**`timeline-pill-grep`** — Mint pill. Same shape, background `{colors.timeline-grep}`. Marks "Grepping" stage.

**`timeline-pill-read`** — Pastel-blue pill. Background `{colors.timeline-read}`. Marks "Reading" stage.

**`timeline-pill-edit`** — Lavender pill. Background `{colors.timeline-edit}`. Marks "Editing" stage.

**`timeline-pill-done`** — Gold pill. Background `{colors.timeline-done}`, text `{colors.on-primary}` white. Marks "Done" stage.

### Code

**`code-block`** — Inline code block. Background `{colors.surface-card}`, text `{colors.ink}` in `{typography.code}`, rounded `{rounded.lg}`, padding 20px, 1px `{colors.hairline}` border.

### Pricing

**`pricing-tier-card`** — Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding 32px, 1px `{colors.hairline}` border.

**`pricing-tier-featured`** — Featured tier inverts to ink. Background `{colors.ink}`, text `{colors.canvas}`. Same shape, dark inversion signals "highlighted" without colored ribbon.

### Forms & Tags

**`text-input`** — Background `{colors.surface-card}`, text `{colors.ink}`, rounded `{rounded.md}` (8px), padding 12px × 16px, height 44px.

**`badge-pill`** — Small uppercase pill. Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 10px.

### CTA / Footer

**`cta-band`** — Pre-footer "Try Cursor now" band. Background `{colors.canvas}`, centered display headline in `{typography.display-lg}`, single Cursor Orange CTA. 96px vertical padding.

**`footer`** — Closing footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`** — Background transparent, text `{colors.body}`, type `{typography.body-sm}`.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (Cursor Orange) for primary CTAs and brand wordmark.
- Keep display weight at 400. The editorial voice depends on this.
- Use the cream `{colors.canvas}` page floor — never pure white.
- Render every code surface (inline, blocks, IDE panes) in JetBrains Mono.
- Use timeline pastels only inside in-product agent visualizations — never as system action colors.

### Don''t
- Don''t introduce a secondary brand action color. Cursor Orange is the only one.
- Don''t drop display to bold weights (700+). Magazine voice depends on 400.
- Don''t add drop shadows. Hairlines + ink-on-cream contrast carry the depth.
- Don''t use timeline pastels on non-timeline UI. They''re scoped to the agent timeline only.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA is what appears on actual product CTAs.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 72→32px; IDE mockup collapses to single pane preview; feature grid 1-up; nav hamburger. |
| Tablet | 640–1024px | Hero h1 56px; IDE mockup compresses; feature grid 2-up. |
| Desktop | 1024–1280px | Full hero h1 72px; full multi-pane IDE mockup; feature grid 3-up. |
| Wide | > 1280px | Content caps at 1200px. |

### Touch Targets
- Primary CTA at 40px height — at WCAG AA, padded for AAA.
- Download CTA at 44px — at AAA.

### Collapsing Strategy
- Top nav switches to hamburger below 768px.
- IDE mockup multi-pane collapses to a single primary pane preview on mobile.
- Feature grid: 3-up → 2-up → 1-up.

## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `{rounded.md}` (8px). Cards use `{rounded.lg}` (12px).
3. Variants live as separate entries inside `components:`.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented.
6. CursorGothic 400 for display, 400/500/600 for body. JetBrains Mono on every code surface.
7. Cursor Orange stays scarce.
8. Timeline pastels stay scoped to in-product agent visualizations.

## Known Gaps

- CursorGothic is a licensed typeface; Inter is the substitute.
- Animation timings (timeline pill entrance, IDE pane reveal) out of scope.
- In-app surfaces (code editor, chat panel, agent timeline) only partially captured via marketing IDE mockups.
- Form validation states beyond focus not visible on captured surfaces.
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

Cursor''s marketing site reads as a quietly-confident developer brand that believes in editorial calm over IDE-darkness. The base canvas is **warm cream** (`{colors.canvas}` — #f7f7f4) holding warm near-black ink (`{colors.ink}` — #26251e) for body and display alike. The single brand voltage is **Cursor Orange** (`{colors.primary}` — #f54e00) reserved for primary CTAs and the wordmark — used scarcely.

Type runs **CursorGothic** as the single sans family. Display sits at weight 400 with negative letter-spacing — a magazine-editorial voice rather than tech-bombastic. JetBrains Mono carries every code surface (and code surfaces are roughly half the page).

The brand''s strongest visual signature is the **AI-timeline pill palette**: five pastel pills (peach `{colors.timeline-thinking}`, mint `{colors.timeline-grep}`, blue `{colors.timeline-read}`, lavender `{colors.timeline-edit}`, gold `{colors.timeline-done}`) marking AI-action stages inside in-product timeline visualizations. Used only in product UI — never as system action colors.

**Key Characteristics:**
- Warm cream canvas, not white. Ink is warm (#26251e), not pure black.
- Single CTA color: `{colors.primary}` (Cursor Orange #f54e00). Used scarcely.
- Display weight stays at 400 — never bold. Magazine voice.
- AI timeline pastels: 5 dedicated tokens for in-product agent action stages.
- Compact 8px CTA radius — developer dialect.
- Hairline-only depth; no drop shadows.
- 80px section rhythm.', '{"sourcePath":"docs/design-md/cursor/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Cursor Orange** (`{colors.primary}` — #f54e00): Primary CTA pills, wordmark, hero accent. Used scarcely.
- **Cursor Orange Active** (`{colors.primary-active}` — #d04200): Press state.

### Surface
- **Canvas** (`{colors.canvas}` — #f7f7f4): Warm cream page floor.
- **Canvas Soft** (`{colors.canvas-soft}` — #fafaf7): IDE-pane background inside mockups.
- **Surface Card** (`{colors.surface-card}` — #ffffff): Pure white card surface — slight contrast against the cream canvas.
- **Surface Strong** (`{colors.surface-strong}` — #e6e5e0): Badges, tag pills.

### Hairlines
- **Hairline** (`{colors.hairline}` — #e6e5e0): 1px divider.
- **Hairline Soft** (`{colors.hairline-soft}` — #efeee8): Lighter divider.
- **Hairline Strong** (`{colors.hairline-strong}` — #cfcdc4): Stronger panel outline.

### Text
- **Ink** (`{colors.ink}` — #26251e): Display, body emphasis. Warm near-black.
- **Body** (`{colors.body}` — #5a5852): Default running-text.
- **Body Strong** (`{colors.body-strong}` — #26251e): Same as ink.
- **Muted** (`{colors.muted}` — #807d72): Sub-titles.
- **Muted Soft** (`{colors.muted-soft}` — #a09c92): Disabled text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on Cursor Orange.

### Timeline (AI-action signature)
- **Thinking** (`{colors.timeline-thinking}` — #dfa88f): Peach. Used inside in-product agent timeline only.
- **Grep** (`{colors.timeline-grep}` — #9fc9a2): Mint.
- **Read** (`{colors.timeline-read}` — #9fbbe0): Pastel blue.
- **Edit** (`{colors.timeline-edit}` — #c0a8dd): Lavender.
- **Done** (`{colors.timeline-done}` — #c08532): Warm gold.

### Semantic
- **Success** (`{colors.semantic-success}` — #1f8a65): Confirmation indicators.
- **Error** (`{colors.semantic-error}` — #cf2d56): Validation errors.', '{"sourcePath":"docs/design-md/cursor/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**CursorGothic** is the licensed display + body family. Fallback: `system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif`. Code surfaces switch to **JetBrains Mono**.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 72px | 400 | 1.1 | -2.16px | Homepage hero h1 |
| `{typography.display-lg}` | 36px | 400 | 1.2 | -0.72px | Section heads |
| `{typography.display-md}` | 26px | 400 | 1.25 | -0.325px | Sub-section heads |
| `{typography.display-sm}` | 22px | 400 | 1.3 | -0.11px | Card group titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Component titles |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | List labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-tracked}` | 16px | 400 | 1.5 | 0.08px | Tracked editorial body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 13px | 400 | 1.4 | 0 | Photo captions |
| `{typography.caption-uppercase}` | 11px | 600 | 1.4 | 0.88px | Section labels, timeline pill labels |
| `{typography.code}` | 13px | 400 | 1.5 | 0 | Code blocks — JetBrains Mono |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | CTA pill labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu |

### Principles
- **Display weight stays at 400.** Magazine voice, never bold.
- **Negative letter-spacing on display only.** -0.11px to -2.16px tracking.
- **JetBrains Mono on every code surface.**

### Note on Font Substitutes
CursorGothic is licensed. Open-source substitute: **Inter** at weight 400 with letter-spacing -1.5%. Or **GT Sectra** for a more editorial feel.', '{"sourcePath":"docs/design-md/cursor/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px.
- **Section padding:** 80px.

### Grid & Container
- Max content width: ~1200px.
- Editorial body: 12-column grid.
- Feature card grids: 2-up at desktop for splits, 3-up for benefits.
- Footer: 5-column at desktop.

### Whitespace Philosophy
Generous editorial pacing — closer to a print magazine than a tech site. The cream canvas has plenty of breathing room; cards within bands sit close (16-24px gap).', '{"sourcePath":"docs/design-md/cursor/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

The system uses **hairline-only depth**. No drop shadows, no elevation tiers. Cards float above the canvas via 1px hairlines and the slight white-on-cream contrast.

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#f7f7f4) | Body bands, footer |
| Card | `{colors.surface-card}` (#ffffff) | Content cards |
| Hairline border | 1px `{colors.hairline}` | Card outlines, dividers |
| IDE pane | `{colors.canvas-soft}` (#fafaf7) | Inside IDE mockup cards |

### Decorative Depth
- **IDE-mockup cards** are the only "elevated" element. White card on cream canvas with internal pane structure mimicking the actual Cursor editor.
- **Timeline pastel pills** add chromatic depth without surface elevation.', '{"sourcePath":"docs/design-md/cursor/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 6px | Compact rows |
| `{rounded.md}` | 8px | CTA buttons, form inputs |
| `{rounded.lg}` | 12px | Cards, IDE panes |
| `{rounded.xl}` | 16px | Larger feature cards (rare) |
| `{rounded.pill}` | 9999px | Timeline pills, badges |
| `{rounded.full}` | 9999px | Avatars (rare) |', '{"sourcePath":"docs/design-md/cursor/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav`** — Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: Cursor wordmark left, primary horizontal menu (Pricing / Features / Enterprise / Blog / Forum / Careers), Sign In + Download primary CTA right.

### Buttons

**`button-primary`** — The signature Cursor Orange CTA. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (14px / 500), padding 10px × 18px, height 40px, rounded `{rounded.md}` (8px).

**`button-primary-active`** — Press state. Background `{colors.primary-active}`.

**`button-secondary`** — White card pill on cream canvas. Background `{colors.surface-card}`, text `{colors.ink}`, 1px `{colors.hairline-strong}` border.

**`button-tertiary-text`** — Inline ink text link.

**`button-download`** — Larger ink-canvas CTA. Background `{colors.ink}`, text `{colors.canvas}`, padding 12px × 20px, height 44px. Used for "Download for macOS" type CTAs.

### Hero & IDE Mockups

**`hero-band`** — Background `{colors.canvas}`, full-width display headline in `{typography.display-mega}` (72px / 400 / -2.16px), subhead in `{typography.body-md}`, two CTAs (`button-download` + `button-tertiary-text`), and a centered IDE-mockup card below the hero copy.

**`ide-mockup-card`** — A white card containing a multi-pane IDE mockup (sidebar + main editor + chat panel + terminal). Background `{colors.surface-card}`, rounded `{rounded.lg}` (12px), 1px `{colors.hairline}` border, no padding (panes fill the card edge-to-edge).

**`ide-pane`** — Individual IDE pane inside the mockup. Background `{colors.canvas-soft}`, text `{colors.body}` in `{typography.code}` (JetBrains Mono 13px), rounded `{rounded.md}` (8px), padding 16px.

### Cards

**`feature-card`** — Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.title-md}`, rounded `{rounded.lg}`, padding 24px. 1px `{colors.hairline}` border.

**`comparison-card`** — Side-by-side "Cursor vs other tools" card. Same surface and rounding; internally split into 2 columns.

**`testimonial-card`** — Quote card. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 24px.

### AI Timeline (signature)

**`timeline-pill-thinking`** — Peach pill. Background `{colors.timeline-thinking}`, text `{colors.ink}`, type `{typography.caption-uppercase}` (11px / 600 / 0.88px tracking, uppercase), rounded `{rounded.pill}`, padding 4px × 10px. Marks "Thinking" stage in product timeline.

**`timeline-pill-grep`** — Mint pill. Same shape, background `{colors.timeline-grep}`. Marks "Grepping" stage.

**`timeline-pill-read`** — Pastel-blue pill. Background `{colors.timeline-read}`. Marks "Reading" stage.

**`timeline-pill-edit`** — Lavender pill. Background `{colors.timeline-edit}`. Marks "Editing" stage.

**`timeline-pill-done`** — Gold pill. Background `{colors.timeline-done}`, text `{colors.on-primary}` white. Marks "Done" stage.

### Code

**`code-block`** — Inline code block. Background `{colors.surface-card}`, text `{colors.ink}` in `{typography.code}`, rounded `{rounded.lg}`, padding 20px, 1px `{colors.hairline}` border.

### Pricing

**`pricing-tier-card`** — Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding 32px, 1px `{colors.hairline}` border.

**`pricing-tier-featured`** — Featured tier inverts to ink. Background `{colors.ink}`, text `{colors.canvas}`. Same shape, dark inversion signals "highlighted" without colored ribbon.

### Forms & Tags

**`text-input`** — Background `{colors.surface-card}`, text `{colors.ink}`, rounded `{rounded.md}` (8px), padding 12px × 16px, height 44px.

**`badge-pill`** — Small uppercase pill. Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 10px.

### CTA / Footer

**`cta-band`** — Pre-footer "Try Cursor now" band. Background `{colors.canvas}`, centered display headline in `{typography.display-lg}`, single Cursor Orange CTA. 96px vertical padding.

**`footer`** — Closing footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`** — Background transparent, text `{colors.body}`, type `{typography.body-sm}`.', '{"sourcePath":"docs/design-md/cursor/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (Cursor Orange) for primary CTAs and brand wordmark.
- Keep display weight at 400. The editorial voice depends on this.
- Use the cream `{colors.canvas}` page floor — never pure white.
- Render every code surface (inline, blocks, IDE panes) in JetBrains Mono.
- Use timeline pastels only inside in-product agent visualizations — never as system action colors.

### Don''t
- Don''t introduce a secondary brand action color. Cursor Orange is the only one.
- Don''t drop display to bold weights (700+). Magazine voice depends on 400.
- Don''t add drop shadows. Hairlines + ink-on-cream contrast carry the depth.
- Don''t use timeline pastels on non-timeline UI. They''re scoped to the agent timeline only.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA is what appears on actual product CTAs.', '{"sourcePath":"docs/design-md/cursor/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 72→32px; IDE mockup collapses to single pane preview; feature grid 1-up; nav hamburger. |
| Tablet | 640–1024px | Hero h1 56px; IDE mockup compresses; feature grid 2-up. |
| Desktop | 1024–1280px | Full hero h1 72px; full multi-pane IDE mockup; feature grid 3-up. |
| Wide | > 1280px | Content caps at 1200px. |

### Touch Targets
- Primary CTA at 40px height — at WCAG AA, padded for AAA.
- Download CTA at 44px — at AAA.

### Collapsing Strategy
- Top nav switches to hamburger below 768px.
- IDE mockup multi-pane collapses to a single primary pane preview on mobile.
- Feature grid: 3-up → 2-up → 1-up.', '{"sourcePath":"docs/design-md/cursor/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `{rounded.md}` (8px). Cards use `{rounded.lg}` (12px).
3. Variants live as separate entries inside `components:`.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented.
6. CursorGothic 400 for display, 400/500/600 for body. JetBrains Mono on every code surface.
7. Cursor Orange stays scarce.
8. Timeline pastels stay scoped to in-product agent visualizations.', '{"sourcePath":"docs/design-md/cursor/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- CursorGothic is a licensed typeface; Inter is the substitute.
- Animation timings (timeline pill entrance, IDE pane reveal) out of scope.
- In-app surfaces (code editor, chat panel, agent timeline) only partially captured via marketing IDE mockups.
- Form validation states beyond focus not visible on captured surfaces.', '{"sourcePath":"docs/design-md/cursor/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_1', '#f7f7f4', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_2', '#26251e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_3', '#f54e00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_4', '#d04200', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_5', '#5a5852', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_6', '#807d72', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_7', '#a09c92', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_8', '#e6e5e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_9', '#efeee8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_10', '#cfcdc4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_11', '#fafaf7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_12', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_13', '#dfa88f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_14', '#9fc9a2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_15', '#9fbbe0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_16', '#c0a8dd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_17', '#c08532', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_18', '#cf2d56', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md'), 'color', 'color_19', '#1f8a65', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/cursor/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/cursor/DESIGN.md';


-- Dell 1996
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Dell 1996', 'dell-1996', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/dell-1996/DESIGN.md', null, 'seeded', '---
version: alpha
name: Dell 1996 Inspired
description: An inspired interpretation of Dell.com''s 1996 design language — a catalog-era enterprise web design built around a literal black page frame, vivid flat color-block "ribbon cards" tinted in sage, salmon, periwinkle, sky, peach and lime, chunky Helvetica-Black display titles, Times Roman body copy, and an entire visual vocabulary of pre-Photoshop hand-cut GIF stickers (NEW! bursts, award seals, beveled product photos).

colors:
  primary: "#e91d2a"
  on-primary: "#ffffff"
  canvas: "#ffffff"
  surface: "#ffffff"
  ink: "#000000"
  frame-ink: "#000000"
  yellow-sticker: "#fcc20f"
  purple-stripe: "#6a26a4"
  link: "#0000ee"

  # Ribbon-card tint family (one per product line)
  tint-olive: "#8e8a25"
  tint-sage: "#b3bd95"
  tint-salmon: "#d77a7a"
  tint-peach: "#e6915d"
  tint-lime: "#c0d4a7"
  tint-sky: "#9ab6c8"
  tint-steel: "#a5b8c0"
  tint-periwinkle: "#8c9ae0"

typography:
  display:
    fontFamily: Arial Black
    fontSize: 36px
    fontWeight: 900
    lineHeight: 1.0
    letterSpacing: 0
  heading-1:
    fontFamily: Arial Black
    fontSize: 24px
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: 0
  heading-2:
    fontFamily: Helvetica
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  heading-3:
    fontFamily: Helvetica
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  body:
    fontFamily: Times New Roman
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  body-sm:
    fontFamily: Times New Roman
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption:
    fontFamily: Times New Roman
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: 0
  button:
    fontFamily: Helvetica
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 0
  link:
    fontFamily: Times New Roman
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  ui-label:
    fontFamily: Helvetica
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 0

rounded:
  none: 0px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  s: 6px
  sm: 8px
  m: 10px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 24px
  section-sm: 32px
  section: 40px
  section-lg: 48px

components:
  # ─── Brand-native components ───
  page-frame:
    backgroundColor: "{colors.frame-ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.none}"
    padding: 8px

  top-banner:
    backgroundColor: "{colors.frame-ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.heading-2}"
    rounded: "{rounded.none}"
    padding: 12px 16px

  section-eyebrow-olive:
    backgroundColor: "{colors.tint-olive}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
    padding: 24px 16px

  section-eyebrow-salmon:
    backgroundColor: "{colors.tint-salmon}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
    padding: 24px 16px

  ribbon-card-title:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.heading-3}"
    rounded: "{rounded.none}"
    padding: 6px 12px

  ribbon-card-body-sage:
    backgroundColor: "{colors.tint-sage}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 12px 16px

  ribbon-card-body-salmon:
    backgroundColor: "{colors.tint-salmon}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 12px 16px

  ribbon-card-body-peach:
    backgroundColor: "{colors.tint-peach}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 12px 16px

  ribbon-card-body-lime:
    backgroundColor: "{colors.tint-lime}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 12px 16px

  ribbon-card-body-sky:
    backgroundColor: "{colors.tint-sky}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 12px 16px

  ribbon-card-body-steel:
    backgroundColor: "{colors.tint-steel}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 12px 16px

  ribbon-card-body-periwinkle:
    backgroundColor: "{colors.tint-periwinkle}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 12px 16px

  cta-block-red:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 16px

  phone-callout:
    backgroundColor: "{colors.frame-ink}"
    textColor: "{colors.primary}"
    typography: "{typography.heading-2}"
    rounded: "{rounded.none}"
    padding: 4px 8px

  buy-a-dell-sticker:
    backgroundColor: "{colors.yellow-sticker}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 4px 8px

  new-burst-sticker:
    backgroundColor: "{colors.yellow-sticker}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 4px 8px

  cert-seal:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    size: 64px

  icon-label-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.ui-label}"
    rounded: "{rounded.none}"
    padding: 8px

  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 4px 6px

  button-primary:
    backgroundColor: "{colors.frame-ink}"
    textColor: "{colors.on-primary}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 6px 16px

  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 6px 16px

  button-text-link:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.link}"
    typography: "{typography.link}"
    rounded: "{rounded.none}"

  footer-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    typography: "{typography.body-sm}"
    padding: 16px

  # ─── Examples (illustrative, kit-mirror) — injected by derive-examples-block.mjs ───

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default Pricing tier card. Re-uses feature-card chrome with the base white surface."
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.frame-ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  ex-pricing-tier-featured:
    description: "Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode)."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  ex-product-selector:
    description: "What''s Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery)."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  ex-cart-drawer:
    description: "Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart)."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
    item-divider: "{colors.frame-ink}"
  ex-app-shell-row:
    description: "Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: "{spacing.sm} {spacing.md}"
  ex-data-table-cell:
    description: "Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm."
    headerBackground: "{colors.surface}"
    headerTypography: "{typography.caption}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.s} {spacing.md}"
    rowBorder: "{colors.frame-ink}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as feature-card with elevated shadow."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  ex-empty-state-card:
    description: "Empty-state illustration frame."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "{spacing.xl}"
    captionTypography: "{typography.body}"
  ex-toast:
    description: "Toast notification surface — feature-card shape + medium shadow."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "{spacing.md} {spacing.lg}"
    typography: "{typography.body-sm}"

---


## Overview

Dell''s December 1996 home page is a perfectly preserved fossil of catalog-era enterprise web design — the moment when a Fortune-100 brand decided the web was *important enough* to invest in, but two years before CSS would be widely adopted and three years before "design system" was a phrase anyone used. Every visual choice on the page is a downstream consequence of that constraint: layout via HTML tables, type via the browser''s built-in font stack (Arial Black / Helvetica / Times Roman), color via 8-bit-safe flat fills, and decoration via hand-cut GIF "stickers" (the NEW! burst, the round PC Magazine Readers'' Choice seal, the beveled "BUY a DELL" yellow tab). The page is bordered — literally bordered, in a 1-cell-wide black HTML table — and inside that frame, every product line gets a "ribbon card": a white title bar with a sharp black underline, a tinted body block in one of eight catalog colors (sage, salmon, peach, lime, sky, steel, periwinkle, olive), and a beveled product photograph notched into the right edge of the card.

The brand voice carries through in two anchors: a vivid Dell-red CTA panel on the left of the homepage (cream-yellow Times Roman copy on a `{colors.primary}` fill, set inside the black frame) and a screaming red phone number — `1-800-213-DELL` — pinned to the top-right of every page, because in 1996 the website was a brochure that ended with a phone call. The footer is a row of four hand-drawn icon-labels (FIND / HOME / ONLINE STORE / SERVICE & SUPPORT) linked by a thin green horizontal rule, and a single classic-Mosaic-blue underlined "Copyright" link sitting above the legal small print in Times Roman.

**Key Characteristics:**
- Literal page frame: every page sits inside a `{colors.frame-ink}` (black) outer border ~8 px thick — the design treats the browser window as a printed picture frame
- Flat color-block "ribbon cards" tint each product family with a dedicated catalog color (`{colors.tint-sage}` Latitude, `{colors.tint-salmon}` OptiPlex GX, `{colors.tint-periwinkle}` PowerEdge, `{colors.tint-sky}` Dellware, etc.) — no gradients, no shadows, no opacity
- Chunky display typography in `{typography.display}` (Arial Black 36 / weight 900) for section title blocks; `{typography.heading-2}` (Helvetica Bold 16) for product row titles; `{typography.body}` Times Roman 14 for everything else
- Hand-cut GIF "stickers" overlay the layout: yellow "BUY a DELL" tab in the top right, angled "NEW!" bursts on new product rows, round red PC Magazine Readers'' Choice seals
- `{colors.primary}` (Dell red) reserved for two things only: the homepage CTA panel and the top-right phone number — never decorative
- Footer icon-nav with classic-blue (`{colors.link}` #0000ee) anchor underlines — the unmistakable Netscape 3.x link colour

## Colors

### Brand & Accent
- **Dell Red** (`{colors.primary}` — #e91d2a): The brand''s signature red. Reserved for the homepage CTA panel ("At Dell.com, we''ll help you find the right system…"), the top-right phone number, and the PC Magazine Readers'' Choice seal ring. Never used as a card body fill.
- **Dell Yellow** (`{colors.yellow-sticker}` — #fcc20f): Sticker yellow — the "BUY a DELL" tab in the top banner, and the angled "NEW!" bursts overlapping new product rows.
- **Dell Purple** (`{colors.purple-stripe}` — #6a26a4): The accent stripe behind the lowercase ".com" / "DELL" wordmark text — appears inside the "BUY a DELL" sticker chrome only.

### Surface
- **Frame Ink** (`{colors.frame-ink}` — #000000): Pure black. The page frame, the top banner background, button fills, and all 1 px ribbon-card hairlines.
- **Canvas** (`{colors.canvas}` — #ffffff): True white inside the frame. The page surface, the ribbon-card title-bar fill, and the icon-label nav backdrop.

### Text
- **Ink** (`{colors.ink}` — #000000): Body text, headings, link copy before visit. Pure black; no warm-near-black softening in 1996.
- **Link** (`{colors.link}` — #0000ee): Classic Mosaic / Netscape 3.x default link blue. Underlined inline anchors ("Copyright", "(Terms of Use)", inline "from Dell''s award-winning service and support teams").

### Ribbon-Card Tint Family
Eight catalog colors, one per product line — these are the page''s chromatic personality:
- **Olive** (`{colors.tint-olive}` — #8e8a25): "DIMENSION DESKTOPS" eyebrow block
- **Sage** (`{colors.tint-sage}` — #b3bd95): Latitude Notebooks ribbon body
- **Salmon** (`{colors.tint-salmon}` — #d77a7a): "OPTIPLEX DESKTOP SYSTEMS" eyebrow + GX Series body
- **Peach** (`{colors.tint-peach}` — #e6915d): Dimension card body + OptiPlex Gs body
- **Lime** (`{colors.tint-lime}` — #c0d4a7): OptiPlex G Series body
- **Sky** (`{colors.tint-sky}` — #9ab6c8): Dellware ribbon body
- **Steel** (`{colors.tint-steel}` — #a5b8c0): Dimension XPS Pro ribbon body
- **Periwinkle** (`{colors.tint-periwinkle}` — #8c9ae0): PowerEdge ribbon body

The tints are saturated but not vivid — they sit just below true neutral chroma, the signature of GIF-era web-safe-palette quantization.

## Typography

### Font Family

Three system-stack families, no webfonts (webfonts didn''t exist yet):

- **Arial Black** (fallback: Helvetica, system-ui sans) — display headings only. The chunky stenciled section eyebrows ("DIMENSION DESKTOPS", "OPTIPLEX DESKTOP SYSTEMS") are Arial Black at weight 900, set in all-caps with normal tracking.
- **Helvetica** (fallback: Arial, system-ui sans) — product-row titles, button labels, the top banner''s "BUILD YOUR OWN COMPUTER. ONLINE." headline. Always bold (700), always all-caps.
- **Times New Roman** (fallback: Times, serif) — body copy. Every paragraph, every caption, every inline anchor sits in default-rendered Times Roman. The serifs date the design instantly — body text on the modern web is almost never serif.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display}` | 36px | 900 | 1.0 | Section eyebrow titles ("DIMENSION DESKTOPS", "OPTIPLEX DESKTOP SYSTEMS") |
| `{typography.heading-1}` | 24px | 900 | 1.05 | Sub-page hero headlines |
| `{typography.heading-2}` | 16px | 700 | 1.2 | Top banner copy, product-line H1 ("Reliable PC''s for High-Performance Computing.") |
| `{typography.heading-3}` | 14px | 700 | 1.2 | Ribbon-card title bar ("OPTIPLEX GX PRO", "DIMENSION XPS") |
| `{typography.body}` | 14px | 400 | 1.4 | Default paragraph copy, ribbon-card body, CTA-panel copy |
| `{typography.body-sm}` | 12px | 400 | 1.4 | "This site is best viewed with browser versions 3.0 and higher." |
| `{typography.caption}` | 11px | 400 | 1.35 | Footer copyright text |
| `{typography.button}` | 12px | 700 | 1.0 | Button labels, "NEW!" sticker, BUY-a-DELL sticker |
| `{typography.ui-label}` | 12px | 700 | 1.0 | Icon-label nav uppercase labels ("FIND", "HOME", "ONLINE STORE", "SERVICE & SUPPORT") |

### Principles
- Sans for UI, serif for body — the inverse of the modern convention, and a dead giveaway of mid-90s typography.
- Display weights are extreme (900 / Black) and never softer. The "Dimension" / "OptiPlex" eyebrow blocks lean on the heaviest weight the font ships.
- No letter-spacing tracking adjustments — pixel-fonts in 1996 didn''t reward it. Everything is set at the browser''s default kern.
- Line-height is tight on display (1.0) and conventional on body (1.4) — a holdover from print-magazine catalog layout.

### Note on Font Substitutes
All three families are operating-system defaults on every consumer OS shipped in 1996 (Windows 95: Arial / Times New Roman; Mac OS 7.5+: Helvetica / Times). The brand had no fallback strategy because no fallback was needed — the fonts were always present. Modern reproductions can stay on this exact stack (Arial Black / Helvetica / Times New Roman) for authenticity.

## Layout

### Spacing System

- **Base unit**: 4 px (with 2 / 6 / 10 intermediates). 1996 page layout was driven by HTML table cell padding (`cellpadding="4"` / `cellspacing="0"`) rather than a designed scale.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.s}` 6px · `{spacing.sm}` 8px · `{spacing.m}` 10px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 20px · `{spacing.xxl}` 24px · `{spacing.section-sm}` 32px · `{spacing.section}` 40px · `{spacing.section-lg}` 48px.
- **Card interior padding**: `{spacing.md}` 12 px vertical / `{spacing.lg}` 16 px horizontal on ribbon-card bodies.
- **Section vertical rhythm**: `{spacing.section}` 40 px between product-ribbon stacks; `{spacing.section-sm}` 32 px between the eyebrow color block and its first ribbon-card.

### Grid & Container
- Fixed-width table layout pinned around 760 px wide — the de facto 1996 standard targeting 800×600 monitors with a small scrollbar gutter.
- Two-column outer structure: left rail (~28 %) carries the homepage icon-link grid + CTA red panel; right column (~72 %) carries the product ribbon stack.
- No grid system in the modern sense — every section is its own `<table>` declaration with hard-coded column widths.

### Whitespace Philosophy
Tight by modern standards. Catalog density wins over editorial breath — every pixel inside the black frame is doing work (illustration, color block, headline, body). The compensating decompression happens *inside* each ribbon card: white title bar + tinted body block + product photo notch creates internal breathing room without enlarging the overall page.

### Responsive Strategy

#### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Period default | 800 × 600 | Fixed 760 px layout, designed for the era''s standard monitor |
| Modern desktop | 1280+ px | Layout sits centered with generous side gutters — emulates "magazine spread in the middle of the screen" |
| Tablet | 768 px | Black frame compresses to 4 px; ribbon-cards stack at full width inside |
| Mobile | < 480 px | Black frame to 2 px; two-column structure collapses to single column; left rail icon grid stacks above the right-column product stack |

#### Touch Targets
1996 had no notion of touch — the original designs assume mouse-only. Modern reproductions need to widen the icon-label nav targets to 44 × 44 px minimum at mobile (the 1996 icons sat at ~24 × 24 with 8 px label below, well under modern guidelines).

#### Collapsing Strategy
- At ≤ 768 px, the homepage''s left-rail icon-link grid (Online Store / Service / Why Dell? / Government / Worldwide / Order Status / Company Info / U.S. Careers) collapses from a 2 × 4 grid to a single-column stack
- Ribbon-card right-edge product photo notch becomes a top-aligned full-width image at mobile
- The top banner''s tagline ("BUILD YOUR OWN COMPUTER. ONLINE.") shrinks one type tier; the phone number wraps below the BUY-a-DELL sticker
- Footer icon-label nav stays 4-up at all widths — the icons are small enough to survive

#### Image Behavior
Product photos are bitmap GIFs with hand-applied bevel shadows — they were authored at fixed pixel widths (typically 80–120 px wide). The right-edge notch effect was achieved by table-cell negative spacing. Modern reproductions should keep the bevel shadow effect (it''s signature) but use SVG drop-shadow or CSS `filter: drop-shadow(2px 2px 0 #000)` to recreate it crisply at high-DPI.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flush | No shadow, no border | Body text, copyright row, footer band background |
| 1 — Hairline | `1px solid {colors.frame-ink}` | Ribbon-card outer edge, table-cell dividers |
| 2 — Frame | `8px solid {colors.frame-ink}` | The page-frame border around the entire viewport |
| 3 — Bevel | Hard-edge 1 px highlight + 1 px shadow on GIF stickers and product photos | "BUY a DELL" yellow sticker, NEW! bursts, award seals, product photographs |

There are **no soft shadows** in the 1996 design — every depth cue is either a hard 1 px border or a hand-painted bevel inside a GIF. Modern reproductions that need to feel period-accurate must resist the urge to add Material-style elevation or atmospheric drop shadows.

### Decorative Depth
Bevels and frames carry the entire depth vocabulary:
- The **page frame** is the strongest depth cue — it tells the viewer "this is a contained document, not a continuous canvas."
- **Bevels on stickers** (BUY a DELL, NEW!, PC Magazine Readers'' Choice) push them forward off the page surface as if pinned on with thumbtacks.
- **Product photographs** carry their own hand-painted bevel + drop-shadow, baked into the GIF itself.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Universal default — buttons, cards, inputs, banners, page frame, ribbon-card bodies, eyebrow blocks |
| `{rounded.full}` | 9999px | Circular award seals (PC Magazine Readers'' Choice), the round "h" sticker on the HOME icon |

The 1996 design has effectively **two** radius modes: square (everything) and round (decorative seal stickers). No 4 / 8 / 12 px subtle radius tier — that vocabulary belongs to the post-Bootstrap web.

### Photography Geometry
Product photos are rectangular GIFs with their own internal beveled "monitor" framing — they sit at native pixel dimensions, never scaled. Aspect ratios cluster around 4:3 (the era''s standard CRT shape). Avatars don''t exist on this site — staff photography was reserved for "About Dell" pages not captured in these snapshots.

## Components

> **No hover states documented.** Per the global no-hover policy, every component below documents Default state only.

### Frame & Banner

**`page-frame`** — the literal black border around the entire viewport.
- Background `{colors.frame-ink}`, padding `{spacing.sm}` 8 px on every side, no radius.
- The page sits *inside* this border. Treat it as a non-negotiable container chrome; collapsing it on mobile is acceptable (to ~4 px), but removing it entirely loses the brand.

**`top-banner`** — pure-black strip running across the top with white "BUILD YOUR OWN COMPUTER. ONLINE." headline + sub-tagline, the yellow "BUY a DELL" sticker pinned at right, and the red "1-800-213-DELL" phone number.
- Background `{colors.frame-ink}`, text `{colors.canvas}`, type `{typography.heading-2}`, padding 12 px vertical / 16 px horizontal, no radius.

### Section Eyebrow Blocks

**`section-eyebrow-olive`** — large tinted color block holding the chunky stenciled section title ("DIMENSION DESKTOPS"). Used at the top of the Dimension product page.
- Background `{colors.tint-olive}`, text `{colors.ink}`, type `{typography.display}` (Arial Black 36 / 900), padding 24 × 16, no radius.

**`section-eyebrow-salmon`** — same chrome with the OptiPlex line''s salmon-pink fill ("OPTIPLEX DESKTOP SYSTEMS").
- Background `{colors.tint-salmon}`, otherwise identical to the olive variant.

### Ribbon Cards

The brand''s signature component. Each product-row "card" is a stack of three pieces:
1. **`ribbon-card-title`** — white horizontal title bar with the product variant name in Helvetica Bold all-caps (e.g. "OPTIPLEX GX PRO", "DIMENSION XPS", "POWEREDGE SERVERS"). 1 px bottom border in `{colors.frame-ink}`.
   - Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.heading-3}`, padding 6 × 12, no radius.
2. **`ribbon-card-body-<tint>`** — color-block body in one of eight tints, holding the short marketing pitch in `{typography.body}` (Times Roman 14). Padding 12 × 16. The product photograph notches into the right edge with a transparent GIF cutout.
3. **Photo notch** — the GIF sits in the rightmost ~25 % of the row, hanging slightly above and below the body bar like a card pinned to a corkboard.

Each tint variant is its own component entry. Pick the one that matches the product family:

- **`ribbon-card-body-sage`** — `{colors.tint-sage}` fill, used for Latitude Notebooks rows
- **`ribbon-card-body-salmon`** — `{colors.tint-salmon}` fill, used for OptiPlex GX Series rows
- **`ribbon-card-body-peach`** — `{colors.tint-peach}` fill, used for Dimension rows and OptiPlex Gs
- **`ribbon-card-body-lime`** — `{colors.tint-lime}` fill, used for OptiPlex G Series rows
- **`ribbon-card-body-sky`** — `{colors.tint-sky}` fill, used for Dellware rows
- **`ribbon-card-body-steel`** — `{colors.tint-steel}` fill, used for Dimension XPS Pro rows
- **`ribbon-card-body-periwinkle`** — `{colors.tint-periwinkle}` fill, used for PowerEdge Server rows

All seven share identical chrome: 1 px solid `{colors.frame-ink}` border, `{spacing.md}` × `{spacing.lg}` (12 × 16) padding, `{rounded.none}` (sharp corners), `{typography.body}` Times Roman 14 inside. Only the fill color changes per product family.

### Call-to-Action

**`cta-block-red`** — the homepage''s vivid Dell-red panel ("At Dell.com, we''ll help you find the right system, configure it, price it, and order it…").
- Background `{colors.primary}`, text `{colors.on-primary}` (white), 1 px solid frame-ink border, type `{typography.body}` (Times Roman 14), padding 16 px, no radius.
- One per page maximum. The brand''s most aggressive attention-grab — never use it for anything except a top-tier sales message.

**`phone-callout`** — top-right phone number ("1-800-213-DELL") rendered as red on the black banner.
- Background `{colors.frame-ink}`, text `{colors.primary}`, type `{typography.heading-2}` Helvetica Bold 16, padding 4 × 8, no radius. Pinned to the right of the top banner on every page.

### Stickers (GIF-style overlays)

**`buy-a-dell-sticker`** — yellow rectangular sticker with "BUY a DELL" in Helvetica Bold, the "a" set in a small purple stripe, the "DELL" wordmark in black. Pinned to the top-right of every page.
- Background `{colors.yellow-sticker}`, text `{colors.ink}`, 1 px black border, type `{typography.button}`, padding 4 × 8, no radius.

**`new-burst-sticker`** — angled yellow burst with "NEW!" in Helvetica Bold black, overlapping the right side of new product ribbon-cards. Slight rotation (~15°) gives it the pinned-on-with-tape feel.
- Background `{colors.yellow-sticker}`, text `{colors.ink}`, type `{typography.button}`, padding 4 × 8, no radius (rotation applied separately).

**`cert-seal`** — round red award seal: center reads "PC MAGAZINE", ringed by "SERVICE · RELIABILITY · READERS'' CHOICE", with an inner white field and red bordered ring. Sits on the right rail of product pages.
- Background `{colors.primary}`, text `{colors.canvas}`, type `{typography.button}`, rounded `{rounded.full}`, 64 px size.

### Navigation

**`icon-label-nav`** — bottom-of-page navigation row: four hand-drawn icons (eyeglasses-FIND / house-HOME / yellow-sticker-ONLINE STORE / wrench-SERVICE & SUPPORT) connected by a thin green horizontal rule, each with an uppercase Helvetica label beneath.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.ui-label}`, padding 8 px around each icon-label pair, no radius.
- The connecting green rule is part of the GIF imagery, not a CSS border.

### Inputs & Buttons

**`text-input`** — bordered HTML input. White fill, 1 px solid black border, Times Roman 14 inside.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid frame-ink, type `{typography.body}`, padding 4 × 6, no radius.
- Used on the Search and "Configure & Buy" forms (not visible in these three captures but consistent with the era''s HTML 3.2 form widgets).

**`button-primary`** — black filled button with white Helvetica Bold uppercase label.
- Background `{colors.frame-ink}`, text `{colors.on-primary}`, 1 px solid frame-ink, type `{typography.button}`, padding 6 × 16, no radius.

**`button-secondary`** — white filled outlined button. Same chrome with inverted colours.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid frame-ink, type `{typography.button}`, padding 6 × 16, no radius.

**`button-text-link`** — bare underlined anchor in classic-Mosaic blue.
- Text `{colors.link}` #0000ee, type `{typography.link}` Times Roman 14, underline on default. No padding, no radius.

### Footer

**`footer-band`** — the bottom of every page: icon-label nav row, classic-blue Copyright link, "(Terms of Use)" parenthetical, browser-compatibility small print, and the Microsoft BackOffice / Internet Explorer logo banners.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px top border in frame-ink, type `{typography.body-sm}`, padding 16 px.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with the base white surface.
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
- Keep the literal `{components.page-frame}` black border on every page — this is the brand''s single most identifiable container chrome.
- Reserve `{colors.primary}` (Dell red) for the `{components.cta-block-red}` panel and the `{components.phone-callout}` only. Every other use dilutes the urgency signal.
- Use the eight ribbon-card tint colors (`{colors.tint-olive}` / sage / salmon / peach / lime / sky / steel / periwinkle) as a *family* — pick one per product line and stay with it across the line''s marketing surfaces.
- Set every display headline in `{typography.display}` (Arial Black 36 / weight 900). The brand''s typographic register depends on extreme weight against flat color.
- Keep body copy in `{typography.body}` Times Roman 14 — substituting a modern sans loses the catalog feel entirely.
- Render every CTA / button at `{rounded.none}` (0 px). Modern soft-radius buttons betray the era.
- Use hand-painted bevels / hard-edge GIF shadows on stickers and product photos. Never substitute a soft CSS shadow.

### Don''t
- Don''t introduce a chromatic accent outside the eight catalog tints + Dell red + Dell yellow + classic link blue. The palette is closed by design.
- Don''t soften any corner. `{rounded.none}` is the universal modifier; only award seals get `{rounded.full}`.
- Don''t replace Times Roman body with Arial / Helvetica / Inter / a webfont — the serif body is the era''s signature.
- Don''t add soft drop-shadows or atmospheric gradients. The brand has hard borders and flat fills; everything else reads as anachronism.
- Don''t crop or "tuck" product photos with `border-radius` or `clip-path`. The notch into the ribbon-card right edge is the framing — the photo itself stays a hard rectangle.
- Don''t pair two `{components.cta-block-red}` panels on the same page. The red fill is meant to be the singular attention pole.
- Don''t strip the `{components.phone-callout}` from the top banner. In 1996 the website existed to drive phone-call orders; the phone number IS the navigation.
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

Dell''s December 1996 home page is a perfectly preserved fossil of catalog-era enterprise web design — the moment when a Fortune-100 brand decided the web was *important enough* to invest in, but two years before CSS would be widely adopted and three years before "design system" was a phrase anyone used. Every visual choice on the page is a downstream consequence of that constraint: layout via HTML tables, type via the browser''s built-in font stack (Arial Black / Helvetica / Times Roman), color via 8-bit-safe flat fills, and decoration via hand-cut GIF "stickers" (the NEW! burst, the round PC Magazine Readers'' Choice seal, the beveled "BUY a DELL" yellow tab). The page is bordered — literally bordered, in a 1-cell-wide black HTML table — and inside that frame, every product line gets a "ribbon card": a white title bar with a sharp black underline, a tinted body block in one of eight catalog colors (sage, salmon, peach, lime, sky, steel, periwinkle, olive), and a beveled product photograph notched into the right edge of the card.

The brand voice carries through in two anchors: a vivid Dell-red CTA panel on the left of the homepage (cream-yellow Times Roman copy on a `{colors.primary}` fill, set inside the black frame) and a screaming red phone number — `1-800-213-DELL` — pinned to the top-right of every page, because in 1996 the website was a brochure that ended with a phone call. The footer is a row of four hand-drawn icon-labels (FIND / HOME / ONLINE STORE / SERVICE & SUPPORT) linked by a thin green horizontal rule, and a single classic-Mosaic-blue underlined "Copyright" link sitting above the legal small print in Times Roman.

**Key Characteristics:**
- Literal page frame: every page sits inside a `{colors.frame-ink}` (black) outer border ~8 px thick — the design treats the browser window as a printed picture frame
- Flat color-block "ribbon cards" tint each product family with a dedicated catalog color (`{colors.tint-sage}` Latitude, `{colors.tint-salmon}` OptiPlex GX, `{colors.tint-periwinkle}` PowerEdge, `{colors.tint-sky}` Dellware, etc.) — no gradients, no shadows, no opacity
- Chunky display typography in `{typography.display}` (Arial Black 36 / weight 900) for section title blocks; `{typography.heading-2}` (Helvetica Bold 16) for product row titles; `{typography.body}` Times Roman 14 for everything else
- Hand-cut GIF "stickers" overlay the layout: yellow "BUY a DELL" tab in the top right, angled "NEW!" bursts on new product rows, round red PC Magazine Readers'' Choice seals
- `{colors.primary}` (Dell red) reserved for two things only: the homepage CTA panel and the top-right phone number — never decorative
- Footer icon-nav with classic-blue (`{colors.link}` #0000ee) anchor underlines — the unmistakable Netscape 3.x link colour', '{"sourcePath":"docs/design-md/dell-1996/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Dell Red** (`{colors.primary}` — #e91d2a): The brand''s signature red. Reserved for the homepage CTA panel ("At Dell.com, we''ll help you find the right system…"), the top-right phone number, and the PC Magazine Readers'' Choice seal ring. Never used as a card body fill.
- **Dell Yellow** (`{colors.yellow-sticker}` — #fcc20f): Sticker yellow — the "BUY a DELL" tab in the top banner, and the angled "NEW!" bursts overlapping new product rows.
- **Dell Purple** (`{colors.purple-stripe}` — #6a26a4): The accent stripe behind the lowercase ".com" / "DELL" wordmark text — appears inside the "BUY a DELL" sticker chrome only.

### Surface
- **Frame Ink** (`{colors.frame-ink}` — #000000): Pure black. The page frame, the top banner background, button fills, and all 1 px ribbon-card hairlines.
- **Canvas** (`{colors.canvas}` — #ffffff): True white inside the frame. The page surface, the ribbon-card title-bar fill, and the icon-label nav backdrop.

### Text
- **Ink** (`{colors.ink}` — #000000): Body text, headings, link copy before visit. Pure black; no warm-near-black softening in 1996.
- **Link** (`{colors.link}` — #0000ee): Classic Mosaic / Netscape 3.x default link blue. Underlined inline anchors ("Copyright", "(Terms of Use)", inline "from Dell''s award-winning service and support teams").

### Ribbon-Card Tint Family
Eight catalog colors, one per product line — these are the page''s chromatic personality:
- **Olive** (`{colors.tint-olive}` — #8e8a25): "DIMENSION DESKTOPS" eyebrow block
- **Sage** (`{colors.tint-sage}` — #b3bd95): Latitude Notebooks ribbon body
- **Salmon** (`{colors.tint-salmon}` — #d77a7a): "OPTIPLEX DESKTOP SYSTEMS" eyebrow + GX Series body
- **Peach** (`{colors.tint-peach}` — #e6915d): Dimension card body + OptiPlex Gs body
- **Lime** (`{colors.tint-lime}` — #c0d4a7): OptiPlex G Series body
- **Sky** (`{colors.tint-sky}` — #9ab6c8): Dellware ribbon body
- **Steel** (`{colors.tint-steel}` — #a5b8c0): Dimension XPS Pro ribbon body
- **Periwinkle** (`{colors.tint-periwinkle}` — #8c9ae0): PowerEdge ribbon body

The tints are saturated but not vivid — they sit just below true neutral chroma, the signature of GIF-era web-safe-palette quantization.', '{"sourcePath":"docs/design-md/dell-1996/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

Three system-stack families, no webfonts (webfonts didn''t exist yet):

- **Arial Black** (fallback: Helvetica, system-ui sans) — display headings only. The chunky stenciled section eyebrows ("DIMENSION DESKTOPS", "OPTIPLEX DESKTOP SYSTEMS") are Arial Black at weight 900, set in all-caps with normal tracking.
- **Helvetica** (fallback: Arial, system-ui sans) — product-row titles, button labels, the top banner''s "BUILD YOUR OWN COMPUTER. ONLINE." headline. Always bold (700), always all-caps.
- **Times New Roman** (fallback: Times, serif) — body copy. Every paragraph, every caption, every inline anchor sits in default-rendered Times Roman. The serifs date the design instantly — body text on the modern web is almost never serif.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display}` | 36px | 900 | 1.0 | Section eyebrow titles ("DIMENSION DESKTOPS", "OPTIPLEX DESKTOP SYSTEMS") |
| `{typography.heading-1}` | 24px | 900 | 1.05 | Sub-page hero headlines |
| `{typography.heading-2}` | 16px | 700 | 1.2 | Top banner copy, product-line H1 ("Reliable PC''s for High-Performance Computing.") |
| `{typography.heading-3}` | 14px | 700 | 1.2 | Ribbon-card title bar ("OPTIPLEX GX PRO", "DIMENSION XPS") |
| `{typography.body}` | 14px | 400 | 1.4 | Default paragraph copy, ribbon-card body, CTA-panel copy |
| `{typography.body-sm}` | 12px | 400 | 1.4 | "This site is best viewed with browser versions 3.0 and higher." |
| `{typography.caption}` | 11px | 400 | 1.35 | Footer copyright text |
| `{typography.button}` | 12px | 700 | 1.0 | Button labels, "NEW!" sticker, BUY-a-DELL sticker |
| `{typography.ui-label}` | 12px | 700 | 1.0 | Icon-label nav uppercase labels ("FIND", "HOME", "ONLINE STORE", "SERVICE & SUPPORT") |

### Principles
- Sans for UI, serif for body — the inverse of the modern convention, and a dead giveaway of mid-90s typography.
- Display weights are extreme (900 / Black) and never softer. The "Dimension" / "OptiPlex" eyebrow blocks lean on the heaviest weight the font ships.
- No letter-spacing tracking adjustments — pixel-fonts in 1996 didn''t reward it. Everything is set at the browser''s default kern.
- Line-height is tight on display (1.0) and conventional on body (1.4) — a holdover from print-magazine catalog layout.

### Note on Font Substitutes
All three families are operating-system defaults on every consumer OS shipped in 1996 (Windows 95: Arial / Times New Roman; Mac OS 7.5+: Helvetica / Times). The brand had no fallback strategy because no fallback was needed — the fonts were always present. Modern reproductions can stay on this exact stack (Arial Black / Helvetica / Times New Roman) for authenticity.', '{"sourcePath":"docs/design-md/dell-1996/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System

- **Base unit**: 4 px (with 2 / 6 / 10 intermediates). 1996 page layout was driven by HTML table cell padding (`cellpadding="4"` / `cellspacing="0"`) rather than a designed scale.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.s}` 6px · `{spacing.sm}` 8px · `{spacing.m}` 10px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 20px · `{spacing.xxl}` 24px · `{spacing.section-sm}` 32px · `{spacing.section}` 40px · `{spacing.section-lg}` 48px.
- **Card interior padding**: `{spacing.md}` 12 px vertical / `{spacing.lg}` 16 px horizontal on ribbon-card bodies.
- **Section vertical rhythm**: `{spacing.section}` 40 px between product-ribbon stacks; `{spacing.section-sm}` 32 px between the eyebrow color block and its first ribbon-card.

### Grid & Container
- Fixed-width table layout pinned around 760 px wide — the de facto 1996 standard targeting 800×600 monitors with a small scrollbar gutter.
- Two-column outer structure: left rail (~28 %) carries the homepage icon-link grid + CTA red panel; right column (~72 %) carries the product ribbon stack.
- No grid system in the modern sense — every section is its own `<table>` declaration with hard-coded column widths.

### Whitespace Philosophy
Tight by modern standards. Catalog density wins over editorial breath — every pixel inside the black frame is doing work (illustration, color block, headline, body). The compensating decompression happens *inside* each ribbon card: white title bar + tinted body block + product photo notch creates internal breathing room without enlarging the overall page.

### Responsive Strategy

#### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Period default | 800 × 600 | Fixed 760 px layout, designed for the era''s standard monitor |
| Modern desktop | 1280+ px | Layout sits centered with generous side gutters — emulates "magazine spread in the middle of the screen" |
| Tablet | 768 px | Black frame compresses to 4 px; ribbon-cards stack at full width inside |
| Mobile | < 480 px | Black frame to 2 px; two-column structure collapses to single column; left rail icon grid stacks above the right-column product stack |

#### Touch Targets
1996 had no notion of touch — the original designs assume mouse-only. Modern reproductions need to widen the icon-label nav targets to 44 × 44 px minimum at mobile (the 1996 icons sat at ~24 × 24 with 8 px label below, well under modern guidelines).

#### Collapsing Strategy
- At ≤ 768 px, the homepage''s left-rail icon-link grid (Online Store / Service / Why Dell? / Government / Worldwide / Order Status / Company Info / U.S. Careers) collapses from a 2 × 4 grid to a single-column stack
- Ribbon-card right-edge product photo notch becomes a top-aligned full-width image at mobile
- The top banner''s tagline ("BUILD YOUR OWN COMPUTER. ONLINE.") shrinks one type tier; the phone number wraps below the BUY-a-DELL sticker
- Footer icon-label nav stays 4-up at all widths — the icons are small enough to survive

#### Image Behavior
Product photos are bitmap GIFs with hand-applied bevel shadows — they were authored at fixed pixel widths (typically 80–120 px wide). The right-edge notch effect was achieved by table-cell negative spacing. Modern reproductions should keep the bevel shadow effect (it''s signature) but use SVG drop-shadow or CSS `filter: drop-shadow(2px 2px 0 #000)` to recreate it crisply at high-DPI.', '{"sourcePath":"docs/design-md/dell-1996/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flush | No shadow, no border | Body text, copyright row, footer band background |
| 1 — Hairline | `1px solid {colors.frame-ink}` | Ribbon-card outer edge, table-cell dividers |
| 2 — Frame | `8px solid {colors.frame-ink}` | The page-frame border around the entire viewport |
| 3 — Bevel | Hard-edge 1 px highlight + 1 px shadow on GIF stickers and product photos | "BUY a DELL" yellow sticker, NEW! bursts, award seals, product photographs |

There are **no soft shadows** in the 1996 design — every depth cue is either a hard 1 px border or a hand-painted bevel inside a GIF. Modern reproductions that need to feel period-accurate must resist the urge to add Material-style elevation or atmospheric drop shadows.

### Decorative Depth
Bevels and frames carry the entire depth vocabulary:
- The **page frame** is the strongest depth cue — it tells the viewer "this is a contained document, not a continuous canvas."
- **Bevels on stickers** (BUY a DELL, NEW!, PC Magazine Readers'' Choice) push them forward off the page surface as if pinned on with thumbtacks.
- **Product photographs** carry their own hand-painted bevel + drop-shadow, baked into the GIF itself.', '{"sourcePath":"docs/design-md/dell-1996/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Universal default — buttons, cards, inputs, banners, page frame, ribbon-card bodies, eyebrow blocks |
| `{rounded.full}` | 9999px | Circular award seals (PC Magazine Readers'' Choice), the round "h" sticker on the HOME icon |

The 1996 design has effectively **two** radius modes: square (everything) and round (decorative seal stickers). No 4 / 8 / 12 px subtle radius tier — that vocabulary belongs to the post-Bootstrap web.

### Photography Geometry
Product photos are rectangular GIFs with their own internal beveled "monitor" framing — they sit at native pixel dimensions, never scaled. Aspect ratios cluster around 4:3 (the era''s standard CRT shape). Avatars don''t exist on this site — staff photography was reserved for "About Dell" pages not captured in these snapshots.', '{"sourcePath":"docs/design-md/dell-1996/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> **No hover states documented.** Per the global no-hover policy, every component below documents Default state only.

### Frame & Banner

**`page-frame`** — the literal black border around the entire viewport.
- Background `{colors.frame-ink}`, padding `{spacing.sm}` 8 px on every side, no radius.
- The page sits *inside* this border. Treat it as a non-negotiable container chrome; collapsing it on mobile is acceptable (to ~4 px), but removing it entirely loses the brand.

**`top-banner`** — pure-black strip running across the top with white "BUILD YOUR OWN COMPUTER. ONLINE." headline + sub-tagline, the yellow "BUY a DELL" sticker pinned at right, and the red "1-800-213-DELL" phone number.
- Background `{colors.frame-ink}`, text `{colors.canvas}`, type `{typography.heading-2}`, padding 12 px vertical / 16 px horizontal, no radius.

### Section Eyebrow Blocks

**`section-eyebrow-olive`** — large tinted color block holding the chunky stenciled section title ("DIMENSION DESKTOPS"). Used at the top of the Dimension product page.
- Background `{colors.tint-olive}`, text `{colors.ink}`, type `{typography.display}` (Arial Black 36 / 900), padding 24 × 16, no radius.

**`section-eyebrow-salmon`** — same chrome with the OptiPlex line''s salmon-pink fill ("OPTIPLEX DESKTOP SYSTEMS").
- Background `{colors.tint-salmon}`, otherwise identical to the olive variant.

### Ribbon Cards

The brand''s signature component. Each product-row "card" is a stack of three pieces:
1. **`ribbon-card-title`** — white horizontal title bar with the product variant name in Helvetica Bold all-caps (e.g. "OPTIPLEX GX PRO", "DIMENSION XPS", "POWEREDGE SERVERS"). 1 px bottom border in `{colors.frame-ink}`.
   - Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.heading-3}`, padding 6 × 12, no radius.
2. **`ribbon-card-body-<tint>`** — color-block body in one of eight tints, holding the short marketing pitch in `{typography.body}` (Times Roman 14). Padding 12 × 16. The product photograph notches into the right edge with a transparent GIF cutout.
3. **Photo notch** — the GIF sits in the rightmost ~25 % of the row, hanging slightly above and below the body bar like a card pinned to a corkboard.

Each tint variant is its own component entry. Pick the one that matches the product family:

- **`ribbon-card-body-sage`** — `{colors.tint-sage}` fill, used for Latitude Notebooks rows
- **`ribbon-card-body-salmon`** — `{colors.tint-salmon}` fill, used for OptiPlex GX Series rows
- **`ribbon-card-body-peach`** — `{colors.tint-peach}` fill, used for Dimension rows and OptiPlex Gs
- **`ribbon-card-body-lime`** — `{colors.tint-lime}` fill, used for OptiPlex G Series rows
- **`ribbon-card-body-sky`** — `{colors.tint-sky}` fill, used for Dellware rows
- **`ribbon-card-body-steel`** — `{colors.tint-steel}` fill, used for Dimension XPS Pro rows
- **`ribbon-card-body-periwinkle`** — `{colors.tint-periwinkle}` fill, used for PowerEdge Server rows

All seven share identical chrome: 1 px solid `{colors.frame-ink}` border, `{spacing.md}` × `{spacing.lg}` (12 × 16) padding, `{rounded.none}` (sharp corners), `{typography.body}` Times Roman 14 inside. Only the fill color changes per product family.

### Call-to-Action

**`cta-block-red`** — the homepage''s vivid Dell-red panel ("At Dell.com, we''ll help you find the right system, configure it, price it, and order it…").
- Background `{colors.primary}`, text `{colors.on-primary}` (white), 1 px solid frame-ink border, type `{typography.body}` (Times Roman 14), padding 16 px, no radius.
- One per page maximum. The brand''s most aggressive attention-grab — never use it for anything except a top-tier sales message.

**`phone-callout`** — top-right phone number ("1-800-213-DELL") rendered as red on the black banner.
- Background `{colors.frame-ink}`, text `{colors.primary}`, type `{typography.heading-2}` Helvetica Bold 16, padding 4 × 8, no radius. Pinned to the right of the top banner on every page.

### Stickers (GIF-style overlays)

**`buy-a-dell-sticker`** — yellow rectangular sticker with "BUY a DELL" in Helvetica Bold, the "a" set in a small purple stripe, the "DELL" wordmark in black. Pinned to the top-right of every page.
- Background `{colors.yellow-sticker}`, text `{colors.ink}`, 1 px black border, type `{typography.button}`, padding 4 × 8, no radius.

**`new-burst-sticker`** — angled yellow burst with "NEW!" in Helvetica Bold black, overlapping the right side of new product ribbon-cards. Slight rotation (~15°) gives it the pinned-on-with-tape feel.
- Background `{colors.yellow-sticker}`, text `{colors.ink}`, type `{typography.button}`, padding 4 × 8, no radius (rotation applied separately).

**`cert-seal`** — round red award seal: center reads "PC MAGAZINE", ringed by "SERVICE · RELIABILITY · READERS'' CHOICE", with an inner white field and red bordered ring. Sits on the right rail of product pages.
- Background `{colors.primary}`, text `{colors.canvas}`, type `{typography.button}`, rounded `{rounded.full}`, 64 px size.

### Navigation

**`icon-label-nav`** — bottom-of-page navigation row: four hand-drawn icons (eyeglasses-FIND / house-HOME / yellow-sticker-ONLINE STORE / wrench-SERVICE & SUPPORT) connected by a thin green horizontal rule, each with an uppercase Helvetica label beneath.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.ui-label}`, padding 8 px around each icon-label pair, no radius.
- The connecting green rule is part of the GIF imagery, not a CSS border.

### Inputs & Buttons

**`text-input`** — bordered HTML input. White fill, 1 px solid black border, Times Roman 14 inside.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid frame-ink, type `{typography.body}`, padding 4 × 6, no radius.
- Used on the Search and "Configure & Buy" forms (not visible in these three captures but consistent with the era''s HTML 3.2 form widgets).

**`button-primary`** — black filled button with white Helvetica Bold uppercase label.
- Background `{colors.frame-ink}`, text `{colors.on-primary}`, 1 px solid frame-ink, type `{typography.button}`, padding 6 × 16, no radius.

**`button-secondary`** — white filled outlined button. Same chrome with inverted colours.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid frame-ink, type `{typography.button}`, padding 6 × 16, no radius.

**`button-text-link`** — bare underlined anchor in classic-Mosaic blue.
- Text `{colors.link}` #0000ee, type `{typography.link}` Times Roman 14, underline on default. No padding, no radius.

### Footer

**`footer-band`** — the bottom of every page: icon-label nav row, classic-blue Copyright link, "(Terms of Use)" parenthetical, browser-compatibility small print, and the Microsoft BackOffice / Internet Explorer logo banners.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px top border in frame-ink, type `{typography.body-sm}`, padding 16 px.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with the base white surface.
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
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`', '{"sourcePath":"docs/design-md/dell-1996/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Keep the literal `{components.page-frame}` black border on every page — this is the brand''s single most identifiable container chrome.
- Reserve `{colors.primary}` (Dell red) for the `{components.cta-block-red}` panel and the `{components.phone-callout}` only. Every other use dilutes the urgency signal.
- Use the eight ribbon-card tint colors (`{colors.tint-olive}` / sage / salmon / peach / lime / sky / steel / periwinkle) as a *family* — pick one per product line and stay with it across the line''s marketing surfaces.
- Set every display headline in `{typography.display}` (Arial Black 36 / weight 900). The brand''s typographic register depends on extreme weight against flat color.
- Keep body copy in `{typography.body}` Times Roman 14 — substituting a modern sans loses the catalog feel entirely.
- Render every CTA / button at `{rounded.none}` (0 px). Modern soft-radius buttons betray the era.
- Use hand-painted bevels / hard-edge GIF shadows on stickers and product photos. Never substitute a soft CSS shadow.

### Don''t
- Don''t introduce a chromatic accent outside the eight catalog tints + Dell red + Dell yellow + classic link blue. The palette is closed by design.
- Don''t soften any corner. `{rounded.none}` is the universal modifier; only award seals get `{rounded.full}`.
- Don''t replace Times Roman body with Arial / Helvetica / Inter / a webfont — the serif body is the era''s signature.
- Don''t add soft drop-shadows or atmospheric gradients. The brand has hard borders and flat fills; everything else reads as anachronism.
- Don''t crop or "tuck" product photos with `border-radius` or `clip-path`. The notch into the ribbon-card right edge is the framing — the photo itself stays a hard rectangle.
- Don''t pair two `{components.cta-block-red}` panels on the same page. The red fill is meant to be the singular attention pole.
- Don''t strip the `{components.phone-callout}` from the top banner. In 1996 the website existed to drive phone-call orders; the phone number IS the navigation.', '{"sourcePath":"docs/design-md/dell-1996/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_1', '#e91d2a', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_3', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_4', '#fcc20f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_5', '#6a26a4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_6', '#0000ee', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_7', '#8e8a25', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_8', '#b3bd95', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_9', '#d77a7a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_10', '#e6915d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_11', '#c0d4a7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_12', '#9ab6c8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_13', '#a5b8c0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'color', 'color_14', '#8c9ae0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md'), 'typography', 'font_1', 'fontFamily: Arial', 'primary_detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/dell-1996/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/dell-1996/DESIGN.md';


-- Elevenlabs
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Elevenlabs', 'elevenlabs', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/elevenlabs/DESIGN.md', null, 'seeded', '---
version: alpha
name: ElevenLabs-design-analysis
description: A voice-AI brand whose marketing surfaces read like a quietly editorial print magazine. The base canvas is off-white (`#f5f5f5`) holding warm near-black ink (`#292524`); the brand voltage is photographic, not chromatic — soft pastel atmospheric gradient orbs (mint → peach → lavender → sky) drift through the page as the only "color" moments. Display runs Waldenburg Light at weight 300 — the editorial signature. Inter carries body, navigation, captions. CTAs are subtle: a near-black ink pill is the primary, a transparent outline is the secondary. The brand trusts atmospheric photography and modest type weights to do all of the brand work; there is no neon accent, no saturated CTA color, no developer-tools dark canvas.

colors:
  primary: "#292524"
  primary-active: "#0c0a09"
  ink: "#0c0a09"
  body: "#4e4e4e"
  body-strong: "#292524"
  muted: "#777169"
  muted-soft: "#a8a29e"
  hairline: "#e7e5e4"
  hairline-soft: "#f0efed"
  hairline-strong: "#d6d3d1"
  canvas: "#f5f5f5"
  canvas-soft: "#fafafa"
  canvas-deep: "#0c0a09"
  surface-card: "#ffffff"
  surface-strong: "#f0efed"
  surface-dark: "#0c0a09"
  surface-dark-elevated: "#1c1917"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  on-dark-soft: "#a8a29e"
  gradient-mint: "#a7e5d3"
  gradient-peach: "#f4c5a8"
  gradient-lavender: "#c8b8e0"
  gradient-sky: "#a8c8e8"
  gradient-rose: "#e8b8c4"
  semantic-error: "#dc2626"
  semantic-success: "#16a34a"

typography:
  display-mega:
    fontFamily: "''Waldenburg'', ''Times New Roman'', serif"
    fontSize: 64px
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: -1.92px
  display-xl:
    fontFamily: "''Waldenburg'', serif"
    fontSize: 48px
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: -0.96px
  display-lg:
    fontFamily: "''Waldenburg'', serif"
    fontSize: 36px
    fontWeight: 300
    lineHeight: 1.17
    letterSpacing: -0.36px
  display-md:
    fontFamily: "''Waldenburg'', serif"
    fontSize: 32px
    fontWeight: 300
    lineHeight: 1.13
    letterSpacing: -0.32px
  display-sm:
    fontFamily: "''Waldenburg'', serif"
    fontSize: 24px
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: 0
  title-md:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0
  title-sm:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.44
    letterSpacing: 0.18px
  body-md:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.16px
  body-strong:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0.16px
  body-sm:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: 0.15px
  caption:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.96px
    textTransform: uppercase
  button:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  nav-link:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  base: 16px
  md: 20px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

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
    rounded: "{rounded.pill}"
    padding: 10px 20px
    height: 40px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 9px 19px
    height: 40px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-mega}"
    padding: 96px
  gradient-orb-card:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xxl}"
    padding: 32px
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.xl}"
    padding: 24px
  product-card-stack:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 0
  voice-row:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 12px 0
  voice-icon-circular:
    backgroundColor: "{colors.surface-strong}"
    rounded: "{rounded.full}"
    size: 32px
  pricing-tier-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  pricing-tier-featured:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 44px
  badge-pill:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  cta-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: 96px
  testimonial-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 32px
  audio-waveform-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 24px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 64px 48px
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
---

## Overview

ElevenLabs reads like a quietly editorial print magazine that happens to be a voice-AI product. The base canvas is off-white `{colors.canvas}` (#f5f5f5) holding warm near-black ink `{colors.ink}` (#0c0a09). The brand voltage is **photographic, not chromatic**: soft pastel atmospheric gradient orbs (mint, peach, lavender, sky, rose) drift through the page as the only "color" moments. There is no neon accent, no saturated CTA color, no dark-canvas dev-tools atmosphere.

Type pairs **Waldenburg Light** (custom serif at weight 300) for display with **Inter** for body, navigation, captions. The display weight at 300 is the editorial signature — never bold, never heavy.

CTAs are subtle: a near-black ink pill (`{component.button-primary}`) is the primary, a transparent outline (`{component.button-outline}`) is the secondary. The brand trusts atmospheric photography and modest type weights to carry brand work.

**Key Characteristics:**
- Off-white canvas, warm near-black ink. No saturated CTA color.
- Single primary action: ink pill at `{rounded.pill}`. Atmospheric gradients carry visual brand voltage.
- Display runs Waldenburg Light at weight 300 — editorial magazine voice.
- Body runs Inter at 400 with subtle letter-spacing (+0.15-0.18px).
- Pastel gradient orbs (5 tokens: mint, peach, lavender, sky, rose) used as atmospheric brand decoration only.
- Soft pill geometry (`{rounded.pill}` for CTAs, `{rounded.xl}` for cards).
- 96px section rhythm.

## Colors

### Brand & Accent
- **Ink Primary** (`{colors.primary}` — #292524): The primary action color — warm near-black pill. Used scarcely.
- **Ink Primary Active** (`{colors.primary-active}` — #0c0a09): Press state.

### Surface
- **Canvas** (`{colors.canvas}` — #f5f5f5): Off-white page floor.
- **Canvas Soft** (`{colors.canvas-soft}` — #fafafa): Lighter band for subtle alternating sections.
- **Canvas Deep** (`{colors.canvas-deep}` — #0c0a09): Same as ink — used for the rare dark-mode hero (Agents page).
- **Surface Card** (`{colors.surface-card}` — #ffffff): Pure white card.
- **Surface Strong** (`{colors.surface-strong}` — #f0efed): Badges, voice-icon plates.
- **Surface Dark** (`{colors.surface-dark}` — #0c0a09): Dark hero/CTA band canvas.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #1c1917): Cards on dark canvas.

### Hairlines
- **Hairline** (`{colors.hairline}` — #e7e5e4): Default 1px divider.
- **Hairline Soft** (`{colors.hairline-soft}` — #f0efed): Lighter divider.
- **Hairline Strong** (`{colors.hairline-strong}` — #d6d3d1): Stronger panel outline.

### Text
- **Ink** (`{colors.ink}` — #0c0a09): Display, primary text.
- **Body** (`{colors.body}` — #4e4e4e): Default running-text.
- **Body Strong** (`{colors.body-strong}` — #292524): Same as primary — emphasis.
- **Muted** (`{colors.muted}` — #777169): Sub-titles.
- **Muted Soft** (`{colors.muted-soft}` — #a8a29e): Disabled text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on ink pill.
- **On Dark** (`{colors.on-dark}` — #ffffff): White text on dark hero.
- **On Dark Soft** (`{colors.on-dark-soft}` — #a8a29e): Muted off-white on dark.

### Atmospheric Gradient Stops (signature)
- **Gradient Mint** (`{colors.gradient-mint}` — #a7e5d3): Mint green orb.
- **Gradient Peach** (`{colors.gradient-peach}` — #f4c5a8): Peach orb.
- **Gradient Lavender** (`{colors.gradient-lavender}` — #c8b8e0): Lavender orb.
- **Gradient Sky** (`{colors.gradient-sky}` — #a8c8e8): Sky-blue orb.
- **Gradient Rose** (`{colors.gradient-rose}` — #e8b8c4): Rose orb.

These appear ONLY as soft radial-gradient atmospheric orbs inside `{component.gradient-orb-card}` and as background atmospheric blooms behind hero copy. Never as button fills, never as text colors.

### Semantic
- **Success** (`{colors.semantic-success}` — #16a34a): Confirmation.
- **Error** (`{colors.semantic-error}` — #dc2626): Validation errors.

## Typography

### Font Family
**Waldenburg Light** is the licensed display serif at weight 300. **Inter** carries body, navigation, captions, and buttons. Fallback: `''Times New Roman'', serif` for Waldenburg, `sans-serif` for Inter.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 64px | 300 | 1.05 | -1.92px | Homepage hero h1 |
| `{typography.display-xl}` | 48px | 300 | 1.08 | -0.96px | Subsidiary heroes |
| `{typography.display-lg}` | 36px | 300 | 1.17 | -0.36px | Section heads |
| `{typography.display-md}` | 32px | 300 | 1.13 | -0.32px | Sub-section heads |
| `{typography.display-sm}` | 24px | 300 | 1.2 | 0 | Card group titles |
| `{typography.title-md}` | 20px | 500 | 1.35 | 0 | Component titles — Inter |
| `{typography.title-sm}` | 18px | 500 | 1.44 | 0.18px | List labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0.16px | Default body — Inter |
| `{typography.body-strong}` | 16px | 500 | 1.5 | 0.16px | Emphasized body |
| `{typography.body-sm}` | 15px | 400 | 1.47 | 0.15px | Footer body |
| `{typography.caption}` | 14px | 400 | 1.5 | 0 | Photo captions |
| `{typography.caption-uppercase}` | 12px | 600 | 1.4 | 0.96px | Section labels, badges |
| `{typography.button}` | 15px | 500 | 1.0 | 0 | CTA pill |
| `{typography.nav-link}` | 15px | 500 | 1.4 | 0 | Top-nav menu |

### Principles
- **Display weight stays at 300.** Waldenburg Light is the editorial signature. Never bold display copy.
- **Subtle letter-spacing on body.** Inter at +0.15-0.18px tracking — slightly looser than default Inter for a more editorial feel.
- **Negative letter-spacing on display.** Waldenburg pulls -0.32px to -1.92px tighter on display sizes.

### Note on Font Substitutes
Waldenburg is licensed. Open-source substitute: **EB Garamond** at weight 300 (slightly more humanist) or **GT Sectra** (closer to Waldenburg''s modernity). Use Inter directly for body — it''s the same family ElevenLabs uses.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** 96px.

### Grid & Container
- Max content width: ~1200px.
- Editorial body: 12-column grid.
- Feature card grids: 2-up at desktop for hero splits, 3-up for benefit grids.
- Footer: 5-column at desktop.

### Whitespace Philosophy
Generous editorial pacing — print-magazine feel. 96px between bands; cards inside bands sit close (16-24px gap). The atmospheric gradient orbs occupy generous breathing space without competing with copy.

## Elevation & Depth

The system uses **hairline + soft drop**. Cards float above the off-white canvas via 1px hairlines and a single subtle shadow tier. Atmospheric depth comes from gradient orbs.

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#f5f5f5) | Body bands, footer |
| Card | `{colors.surface-card}` (#ffffff) | Content cards |
| Hairline border | 1px `{colors.hairline}` | Card outlines |
| Soft drop | `0 4px 16px rgba(0, 0, 0, 0.04)` | Hovered cards (single shadow tier) |
| Gradient orb | Radial gradient with one of `{colors.gradient-*}` | Atmospheric depth — never a card surface |

### Decorative Depth
- **Pastel gradient orbs** are the brand''s strongest atmospheric pattern. Soft radial blooms in mint, peach, lavender, sky, or rose drift through hero bands and feature sections without containing any content — they are pure atmosphere.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 6px | Compact rows |
| `{rounded.md}` | 8px | Form inputs |
| `{rounded.lg}` | 12px | Compact cards |
| `{rounded.xl}` | 16px | Feature cards, pricing tiers |
| `{rounded.xxl}` | 24px | Gradient orb cards (extra-soft) |
| `{rounded.pill}` | 9999px | All CTA buttons, badges |
| `{rounded.full}` | 9999px | Voice icon circles, avatars |

## Components

### Top Navigation

**`top-nav`** — Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: ElevenLabs wordmark left, primary horizontal menu (Creative / Agents / Video / Pricing / Enterprise / Docs), Sign In + "Try free" primary CTA right.

### Buttons

**`button-primary`** — Near-black ink pill. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (15px / 500), padding 10px × 20px, height 40px, rounded `{rounded.pill}`.

**`button-primary-active`** — Press state. Background `{colors.primary-active}`.

**`button-outline`** — Transparent pill with 1px ink border. Background transparent, text `{colors.ink}`, 1px `{colors.hairline-strong}` border.

**`button-tertiary-text`** — Inline ink text link.

### Hero & Atmospheric

**`hero-band`** — Background `{colors.canvas}`, full-width display headline in `{typography.display-mega}` (64px / 300 / -1.92px), subhead in `{typography.body-md}`, two CTAs, and an atmospheric gradient orb behind the centered headline.

**`gradient-orb-card`** — A large card with a soft radial-gradient orb behind centered display copy. Background `{colors.canvas-soft}`, rounded `{rounded.xxl}` (24px), padding 32px. Each variant uses one of the five gradient tokens (`gradient-mint`, `gradient-peach`, `gradient-lavender`, `gradient-sky`, `gradient-rose`).

**`audio-waveform-card`** — A waveform visualization card. Background `{colors.surface-card}`, rounded `{rounded.xl}`, padding 24px. Holds a play button + waveform glyph + voice metadata.

### Cards

**`feature-card`** — 2-up or 3-up grids. Background `{colors.surface-card}`, text `{colors.ink}`, rounded `{rounded.xl}`, padding 24px, 1px hairline border.

**`product-card-stack`** — Stacked product preview cards. Background `{colors.surface-card}`, rounded `{rounded.xl}`, no padding (children fill the card edge-to-edge).

**`testimonial-card`** — Quote card. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.xl}`, padding 32px.

### Voice Library

**`voice-row`** — Horizontal row in voice list. Background transparent, 1px hairline divider. Layout: 32px circular voice icon (`{component.voice-icon-circular}`) left, voice name + accent stack, optional preview button right.

**`voice-icon-circular`** — Background `{colors.surface-strong}`, rounded `{rounded.full}`, 32px diameter. Holds initials or voice glyph.

### Pricing

**`pricing-tier-card`** — Background `{colors.surface-card}`, rounded `{rounded.xl}`, padding 32px, 1px hairline border.

**`pricing-tier-featured`** — Featured tier inverts. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same shape, dark inversion.

### Forms & Tags

**`text-input`** — Background `{colors.surface-card}`, text `{colors.ink}`, rounded `{rounded.md}` (8px), padding 12px × 16px, height 44px, 1px `{colors.hairline-strong}` border. On focus, border thickens to 2px ink.

**`badge-pill`** — Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 10px.

### CTA / Footer

**`cta-band`** — Pre-footer. Background `{colors.canvas}`, centered display headline in `{typography.display-lg}`, single ink pill CTA. 96px padding.

**`footer`** — Closing footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`** — Background transparent, text `{colors.body}`, type `{typography.body-sm}`.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (ink pill) for primary CTAs.
- Use Waldenburg Light at weight 300 for every display headline. Never bold.
- Use Inter at +0.15-0.18px tracking for body — the editorial dialect.
- Use atmospheric gradient orbs (mint/peach/lavender/sky/rose) as decoration only.
- Use the pill shape for every CTA and badge.

### Don''t
- Don''t introduce a saturated brand action color. Ink pill is the only CTA color.
- Don''t bold display copy. Display sits at weight 300 — bolding shifts the brand voice from editorial to consumer-marketing.
- Don''t use gradient orbs as button fills, text colors, or component backgrounds. They are pure atmosphere.
- Don''t use sharp `{rounded.none}` (0px) on CTAs. Pill geometry is the brand button.
- Don''t drop body Inter to weight 300 to match Waldenburg — body stays at 400/500 for legibility.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA color is what appears on actual product CTAs.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 64→32px; feature cards 1-up; nav hamburger; gradient orbs shrink. |
| Tablet | 640–1024px | Hero h1 48px; feature cards 2-up. |
| Desktop | 1024–1280px | Full hero h1 64px; feature cards 3-up. |
| Wide | > 1280px | Content caps at 1200px. |

### Touch Targets
- Primary pill at 40px height — at WCAG AA, padded for AAA.
- Voice icon circles 32px — padded row creates effective 48px tap zone.

### Collapsing Strategy
- Top nav switches to hamburger below 768px.
- Feature grid: 3-up → 2-up → 1-up.
- Gradient orbs reduce diameter at every breakpoint but never disappear.

## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `{rounded.pill}`. Cards use `{rounded.xl}` (16px).
3. Variants live as separate entries.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented.
6. Waldenburg 300 for display, Inter 400/500 for body.
7. Gradient orbs scoped to atmospheric decoration.

## Known Gaps

- Waldenburg is a licensed typeface; EB Garamond / GT Sectra are documented substitutes.
- Animation timings (orb drift, waveform pulse, hero entrance) out of scope.
- In-product surfaces (voice library editor, agent playground) only partially captured via marketing mockups.
- Form validation states beyond focus not visible on captured surfaces.
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

ElevenLabs reads like a quietly editorial print magazine that happens to be a voice-AI product. The base canvas is off-white `{colors.canvas}` (#f5f5f5) holding warm near-black ink `{colors.ink}` (#0c0a09). The brand voltage is **photographic, not chromatic**: soft pastel atmospheric gradient orbs (mint, peach, lavender, sky, rose) drift through the page as the only "color" moments. There is no neon accent, no saturated CTA color, no dark-canvas dev-tools atmosphere.

Type pairs **Waldenburg Light** (custom serif at weight 300) for display with **Inter** for body, navigation, captions. The display weight at 300 is the editorial signature — never bold, never heavy.

CTAs are subtle: a near-black ink pill (`{component.button-primary}`) is the primary, a transparent outline (`{component.button-outline}`) is the secondary. The brand trusts atmospheric photography and modest type weights to carry brand work.

**Key Characteristics:**
- Off-white canvas, warm near-black ink. No saturated CTA color.
- Single primary action: ink pill at `{rounded.pill}`. Atmospheric gradients carry visual brand voltage.
- Display runs Waldenburg Light at weight 300 — editorial magazine voice.
- Body runs Inter at 400 with subtle letter-spacing (+0.15-0.18px).
- Pastel gradient orbs (5 tokens: mint, peach, lavender, sky, rose) used as atmospheric brand decoration only.
- Soft pill geometry (`{rounded.pill}` for CTAs, `{rounded.xl}` for cards).
- 96px section rhythm.', '{"sourcePath":"docs/design-md/elevenlabs/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Ink Primary** (`{colors.primary}` — #292524): The primary action color — warm near-black pill. Used scarcely.
- **Ink Primary Active** (`{colors.primary-active}` — #0c0a09): Press state.

### Surface
- **Canvas** (`{colors.canvas}` — #f5f5f5): Off-white page floor.
- **Canvas Soft** (`{colors.canvas-soft}` — #fafafa): Lighter band for subtle alternating sections.
- **Canvas Deep** (`{colors.canvas-deep}` — #0c0a09): Same as ink — used for the rare dark-mode hero (Agents page).
- **Surface Card** (`{colors.surface-card}` — #ffffff): Pure white card.
- **Surface Strong** (`{colors.surface-strong}` — #f0efed): Badges, voice-icon plates.
- **Surface Dark** (`{colors.surface-dark}` — #0c0a09): Dark hero/CTA band canvas.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #1c1917): Cards on dark canvas.

### Hairlines
- **Hairline** (`{colors.hairline}` — #e7e5e4): Default 1px divider.
- **Hairline Soft** (`{colors.hairline-soft}` — #f0efed): Lighter divider.
- **Hairline Strong** (`{colors.hairline-strong}` — #d6d3d1): Stronger panel outline.

### Text
- **Ink** (`{colors.ink}` — #0c0a09): Display, primary text.
- **Body** (`{colors.body}` — #4e4e4e): Default running-text.
- **Body Strong** (`{colors.body-strong}` — #292524): Same as primary — emphasis.
- **Muted** (`{colors.muted}` — #777169): Sub-titles.
- **Muted Soft** (`{colors.muted-soft}` — #a8a29e): Disabled text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on ink pill.
- **On Dark** (`{colors.on-dark}` — #ffffff): White text on dark hero.
- **On Dark Soft** (`{colors.on-dark-soft}` — #a8a29e): Muted off-white on dark.

### Atmospheric Gradient Stops (signature)
- **Gradient Mint** (`{colors.gradient-mint}` — #a7e5d3): Mint green orb.
- **Gradient Peach** (`{colors.gradient-peach}` — #f4c5a8): Peach orb.
- **Gradient Lavender** (`{colors.gradient-lavender}` — #c8b8e0): Lavender orb.
- **Gradient Sky** (`{colors.gradient-sky}` — #a8c8e8): Sky-blue orb.
- **Gradient Rose** (`{colors.gradient-rose}` — #e8b8c4): Rose orb.

These appear ONLY as soft radial-gradient atmospheric orbs inside `{component.gradient-orb-card}` and as background atmospheric blooms behind hero copy. Never as button fills, never as text colors.

### Semantic
- **Success** (`{colors.semantic-success}` — #16a34a): Confirmation.
- **Error** (`{colors.semantic-error}` — #dc2626): Validation errors.', '{"sourcePath":"docs/design-md/elevenlabs/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**Waldenburg Light** is the licensed display serif at weight 300. **Inter** carries body, navigation, captions, and buttons. Fallback: `''Times New Roman'', serif` for Waldenburg, `sans-serif` for Inter.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 64px | 300 | 1.05 | -1.92px | Homepage hero h1 |
| `{typography.display-xl}` | 48px | 300 | 1.08 | -0.96px | Subsidiary heroes |
| `{typography.display-lg}` | 36px | 300 | 1.17 | -0.36px | Section heads |
| `{typography.display-md}` | 32px | 300 | 1.13 | -0.32px | Sub-section heads |
| `{typography.display-sm}` | 24px | 300 | 1.2 | 0 | Card group titles |
| `{typography.title-md}` | 20px | 500 | 1.35 | 0 | Component titles — Inter |
| `{typography.title-sm}` | 18px | 500 | 1.44 | 0.18px | List labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0.16px | Default body — Inter |
| `{typography.body-strong}` | 16px | 500 | 1.5 | 0.16px | Emphasized body |
| `{typography.body-sm}` | 15px | 400 | 1.47 | 0.15px | Footer body |
| `{typography.caption}` | 14px | 400 | 1.5 | 0 | Photo captions |
| `{typography.caption-uppercase}` | 12px | 600 | 1.4 | 0.96px | Section labels, badges |
| `{typography.button}` | 15px | 500 | 1.0 | 0 | CTA pill |
| `{typography.nav-link}` | 15px | 500 | 1.4 | 0 | Top-nav menu |

### Principles
- **Display weight stays at 300.** Waldenburg Light is the editorial signature. Never bold display copy.
- **Subtle letter-spacing on body.** Inter at +0.15-0.18px tracking — slightly looser than default Inter for a more editorial feel.
- **Negative letter-spacing on display.** Waldenburg pulls -0.32px to -1.92px tighter on display sizes.

### Note on Font Substitutes
Waldenburg is licensed. Open-source substitute: **EB Garamond** at weight 300 (slightly more humanist) or **GT Sectra** (closer to Waldenburg''s modernity). Use Inter directly for body — it''s the same family ElevenLabs uses.', '{"sourcePath":"docs/design-md/elevenlabs/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** 96px.

### Grid & Container
- Max content width: ~1200px.
- Editorial body: 12-column grid.
- Feature card grids: 2-up at desktop for hero splits, 3-up for benefit grids.
- Footer: 5-column at desktop.

### Whitespace Philosophy
Generous editorial pacing — print-magazine feel. 96px between bands; cards inside bands sit close (16-24px gap). The atmospheric gradient orbs occupy generous breathing space without competing with copy.', '{"sourcePath":"docs/design-md/elevenlabs/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

The system uses **hairline + soft drop**. Cards float above the off-white canvas via 1px hairlines and a single subtle shadow tier. Atmospheric depth comes from gradient orbs.

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#f5f5f5) | Body bands, footer |
| Card | `{colors.surface-card}` (#ffffff) | Content cards |
| Hairline border | 1px `{colors.hairline}` | Card outlines |
| Soft drop | `0 4px 16px rgba(0, 0, 0, 0.04)` | Hovered cards (single shadow tier) |
| Gradient orb | Radial gradient with one of `{colors.gradient-*}` | Atmospheric depth — never a card surface |

### Decorative Depth
- **Pastel gradient orbs** are the brand''s strongest atmospheric pattern. Soft radial blooms in mint, peach, lavender, sky, or rose drift through hero bands and feature sections without containing any content — they are pure atmosphere.', '{"sourcePath":"docs/design-md/elevenlabs/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 6px | Compact rows |
| `{rounded.md}` | 8px | Form inputs |
| `{rounded.lg}` | 12px | Compact cards |
| `{rounded.xl}` | 16px | Feature cards, pricing tiers |
| `{rounded.xxl}` | 24px | Gradient orb cards (extra-soft) |
| `{rounded.pill}` | 9999px | All CTA buttons, badges |
| `{rounded.full}` | 9999px | Voice icon circles, avatars |', '{"sourcePath":"docs/design-md/elevenlabs/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav`** — Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: ElevenLabs wordmark left, primary horizontal menu (Creative / Agents / Video / Pricing / Enterprise / Docs), Sign In + "Try free" primary CTA right.

### Buttons

**`button-primary`** — Near-black ink pill. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (15px / 500), padding 10px × 20px, height 40px, rounded `{rounded.pill}`.

**`button-primary-active`** — Press state. Background `{colors.primary-active}`.

**`button-outline`** — Transparent pill with 1px ink border. Background transparent, text `{colors.ink}`, 1px `{colors.hairline-strong}` border.

**`button-tertiary-text`** — Inline ink text link.

### Hero & Atmospheric

**`hero-band`** — Background `{colors.canvas}`, full-width display headline in `{typography.display-mega}` (64px / 300 / -1.92px), subhead in `{typography.body-md}`, two CTAs, and an atmospheric gradient orb behind the centered headline.

**`gradient-orb-card`** — A large card with a soft radial-gradient orb behind centered display copy. Background `{colors.canvas-soft}`, rounded `{rounded.xxl}` (24px), padding 32px. Each variant uses one of the five gradient tokens (`gradient-mint`, `gradient-peach`, `gradient-lavender`, `gradient-sky`, `gradient-rose`).

**`audio-waveform-card`** — A waveform visualization card. Background `{colors.surface-card}`, rounded `{rounded.xl}`, padding 24px. Holds a play button + waveform glyph + voice metadata.

### Cards

**`feature-card`** — 2-up or 3-up grids. Background `{colors.surface-card}`, text `{colors.ink}`, rounded `{rounded.xl}`, padding 24px, 1px hairline border.

**`product-card-stack`** — Stacked product preview cards. Background `{colors.surface-card}`, rounded `{rounded.xl}`, no padding (children fill the card edge-to-edge).

**`testimonial-card`** — Quote card. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.xl}`, padding 32px.

### Voice Library

**`voice-row`** — Horizontal row in voice list. Background transparent, 1px hairline divider. Layout: 32px circular voice icon (`{component.voice-icon-circular}`) left, voice name + accent stack, optional preview button right.

**`voice-icon-circular`** — Background `{colors.surface-strong}`, rounded `{rounded.full}`, 32px diameter. Holds initials or voice glyph.

### Pricing

**`pricing-tier-card`** — Background `{colors.surface-card}`, rounded `{rounded.xl}`, padding 32px, 1px hairline border.

**`pricing-tier-featured`** — Featured tier inverts. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same shape, dark inversion.

### Forms & Tags

**`text-input`** — Background `{colors.surface-card}`, text `{colors.ink}`, rounded `{rounded.md}` (8px), padding 12px × 16px, height 44px, 1px `{colors.hairline-strong}` border. On focus, border thickens to 2px ink.

**`badge-pill`** — Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 10px.

### CTA / Footer

**`cta-band`** — Pre-footer. Background `{colors.canvas}`, centered display headline in `{typography.display-lg}`, single ink pill CTA. 96px padding.

**`footer`** — Closing footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`** — Background transparent, text `{colors.body}`, type `{typography.body-sm}`.', '{"sourcePath":"docs/design-md/elevenlabs/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (ink pill) for primary CTAs.
- Use Waldenburg Light at weight 300 for every display headline. Never bold.
- Use Inter at +0.15-0.18px tracking for body — the editorial dialect.
- Use atmospheric gradient orbs (mint/peach/lavender/sky/rose) as decoration only.
- Use the pill shape for every CTA and badge.

### Don''t
- Don''t introduce a saturated brand action color. Ink pill is the only CTA color.
- Don''t bold display copy. Display sits at weight 300 — bolding shifts the brand voice from editorial to consumer-marketing.
- Don''t use gradient orbs as button fills, text colors, or component backgrounds. They are pure atmosphere.
- Don''t use sharp `{rounded.none}` (0px) on CTAs. Pill geometry is the brand button.
- Don''t drop body Inter to weight 300 to match Waldenburg — body stays at 400/500 for legibility.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA color is what appears on actual product CTAs.', '{"sourcePath":"docs/design-md/elevenlabs/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 64→32px; feature cards 1-up; nav hamburger; gradient orbs shrink. |
| Tablet | 640–1024px | Hero h1 48px; feature cards 2-up. |
| Desktop | 1024–1280px | Full hero h1 64px; feature cards 3-up. |
| Wide | > 1280px | Content caps at 1200px. |

### Touch Targets
- Primary pill at 40px height — at WCAG AA, padded for AAA.
- Voice icon circles 32px — padded row creates effective 48px tap zone.

### Collapsing Strategy
- Top nav switches to hamburger below 768px.
- Feature grid: 3-up → 2-up → 1-up.
- Gradient orbs reduce diameter at every breakpoint but never disappear.', '{"sourcePath":"docs/design-md/elevenlabs/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `{rounded.pill}`. Cards use `{rounded.xl}` (16px).
3. Variants live as separate entries.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented.
6. Waldenburg 300 for display, Inter 400/500 for body.
7. Gradient orbs scoped to atmospheric decoration.', '{"sourcePath":"docs/design-md/elevenlabs/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Waldenburg is a licensed typeface; EB Garamond / GT Sectra are documented substitutes.
- Animation timings (orb drift, waveform pulse, hero entrance) out of scope.
- In-product surfaces (voice library editor, agent playground) only partially captured via marketing mockups.
- Form validation states beyond focus not visible on captured surfaces.', '{"sourcePath":"docs/design-md/elevenlabs/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_1', '#f5f5f5', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_2', '#292524', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_3', '#0c0a09', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_4', '#4e4e4e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_5', '#777169', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_6', '#a8a29e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_7', '#e7e5e4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_8', '#f0efed', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_9', '#d6d3d1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_10', '#fafafa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_11', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_12', '#1c1917', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_13', '#a7e5d3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_14', '#f4c5a8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_15', '#c8b8e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_16', '#a8c8e8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_17', '#e8b8c4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_18', '#dc2626', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md'), 'color', 'color_19', '#16a34a', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/elevenlabs/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/elevenlabs/DESIGN.md';


-- Expo
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Expo', 'expo', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/expo/DESIGN.md', null, 'seeded', '---
version: alpha
name: Expo-design-analysis
description: A React Native developer-platform whose marketing site reads like a quietly-confident infrastructure brand. The base canvas is pure white with a soft sky-blue gradient atmospheric wash behind the hero; near-black ink (`#171717`) carries body and display alike. The single brand voltage is **pure black** (`#000000`) for primary CTAs — minimal and editorial-feeling, paired with a small blue text-link accent (`#0d74ce`) reserved for inline body links. Type pairs Inter at modest weights (display 600, body 400) with JetBrains Mono on every code surface. The brand''s strongest visual signature is the **device-mockup hero** — a centered MacBook + iPhone composite showing real Expo dev surfaces — over the gradient sky wash.

colors:
  primary: "#000000"
  primary-active: "#1a1a1a"
  text-link: "#0d74ce"
  text-link-secondary: "#476cff"
  ink: "#171717"
  body: "#60646c"
  body-strong: "#171717"
  muted: "#999999"
  muted-soft: "#cccccc"
  hairline: "#f0f0f3"
  hairline-soft: "#f5f5f7"
  hairline-strong: "#dcdee0"
  canvas: "#ffffff"
  canvas-soft: "#fafafa"
  surface-card: "#ffffff"
  surface-strong: "#f0f0f3"
  surface-dark: "#171717"
  surface-dark-elevated: "#1a1a1a"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  on-dark-soft: "#b0b4ba"
  gradient-sky-light: "#cfe7ff"
  gradient-sky-mid: "#a8c8e8"
  accent-warning: "#ab6400"
  accent-preview: "#8145b5"
  accent-link-bright: "#47c2ff"
  semantic-error: "#eb8e90"
  semantic-success: "#16a34a"

typography:
  display-mega:
    fontFamily: "''Inter'', -apple-system, system-ui, sans-serif"
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -1.92px
  display-xl:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -1.44px
  display-lg:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -1.08px
  display-md:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.84px
  display-sm:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.5px
  title-md:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.88px
    textTransform: uppercase
  code:
    fontFamily: "''JetBrains Mono'', ''Fira Code'', monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  nav-link:
    fontFamily: "''Inter'', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  base: 16px
  md: 20px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

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
    rounded: "{rounded.md}"
    padding: 10px 18px
    height: 40px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 9px 17px
    height: 40px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.text-link}"
    typography: "{typography.button}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-mega}"
    padding: 96px
  device-mockup-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 0
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  feature-card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  workflow-step-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 20px
  workflow-step-icon:
    backgroundColor: "{colors.surface-strong}"
    rounded: "{rounded.md}"
    size: 32px
  code-block:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code}"
    rounded: "{rounded.lg}"
    padding: 20px
  ide-mockup-card:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: 0
  pricing-tier-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-tier-featured:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 44px
  badge-pill:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  ecosystem-tile:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.md}"
    size: 64px
  cta-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: 96px
  testimonial-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  footer-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 64px 48px
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
---

## Overview

Expo''s marketing site reads like a quietly-confident React-Native developer platform. The base canvas is **pure white** (`{colors.canvas}` — #ffffff) with a soft **sky-blue gradient atmospheric wash** behind the hero band. Near-black ink `{colors.ink}` (#171717) carries body and display alike. The single brand voltage is **pure black** (`{colors.primary}` — #000000) for primary CTAs — minimal and editorial-feeling. A small blue text-link accent (`{colors.text-link}` — #0d74ce) is reserved for inline body links, never as a CTA.

Type runs **Inter** as the single sans family at modest weights (display 600, body 400). JetBrains Mono carries every code surface. No custom typeface — the brand trusts Inter''s editorial neutrality.

The brand''s strongest visual signature is the **device-mockup hero** — a centered MacBook + iPhone composite showing real Expo dev surfaces (Expo Studio, EAS Build dashboard, the Expo Go simulator) — over a sky-blue gradient atmospheric wash. The composite is the page''s chrome instead of an illustration.

**Key Characteristics:**
- Pure white canvas with sky-blue gradient atmospheric backdrop in hero only.
- Single primary CTA: pure black pill at `{rounded.md}` (8px) — compact developer-tool dialect.
- Text-link blue (`{colors.text-link}`) for inline links only — never on a CTA.
- Inter as the single sans family — no custom display typeface.
- JetBrains Mono on every code surface.
- Device-mockup hero with real Expo product surfaces is the brand chrome.
- Hairline + soft drop depth; no atmospheric brand decoration outside the hero.
- 96px section rhythm.

## Colors

### Brand & Accent
- **Black** (`{colors.primary}` — #000000): Primary CTA fill. Used scarcely.
- **Black Active** (`{colors.primary-active}` — #1a1a1a): Press state.
- **Text Link Blue** (`{colors.text-link}` — #0d74ce): Inline body links inside long-form copy. Scoped narrowly — never on CTAs.
- **Legal Link Blue** (`{colors.text-link-secondary}` — #476cff): Inline links inside legal copy footer.
- **Bright Cyan** (`{colors.accent-link-bright}` — #47c2ff): Used very sparingly inside docs widget links.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): Pure white page floor.
- **Canvas Soft** (`{colors.canvas-soft}` — #fafafa): Subtle alternating band.
- **Surface Card** (`{colors.surface-card}` — #ffffff): Pure white card.
- **Surface Strong** (`{colors.surface-strong}` — #f0f0f3): Badges, ecosystem tiles, secondary buttons.
- **Surface Dark** (`{colors.surface-dark}` — #171717): Dark feature cards, code blocks, IDE mockups, featured pricing.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #1a1a1a): One step lighter inside dark cards.

### Atmospheric Backdrop
- **Sky Light** (`{colors.gradient-sky-light}` — #cfe7ff) + **Sky Mid** (`{colors.gradient-sky-mid}` — #a8c8e8): The soft sky-blue gradient wash behind the homepage hero only. Not a brand action color.

### Hairlines
- **Hairline** (`{colors.hairline}` — #f0f0f3): Default 1px divider.
- **Hairline Soft** (`{colors.hairline-soft}` — #f5f5f7): Lighter divider.
- **Hairline Strong** (`{colors.hairline-strong}` — #dcdee0): Stronger panel outline.

### Text
- **Ink** (`{colors.ink}` — #171717): Display, body emphasis.
- **Body** (`{colors.body}` — #60646c): Default running-text — slightly cool gray.
- **Body Strong** (`{colors.body-strong}` — #171717): Same as ink.
- **Muted** (`{colors.muted}` — #999999): Sub-titles.
- **Muted Soft** (`{colors.muted-soft}` — #cccccc): Disabled text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on black CTA.
- **On Dark** (`{colors.on-dark}` — #ffffff): White text on dark cards.
- **On Dark Soft** (`{colors.on-dark-soft}` — #b0b4ba): Muted off-white on dark.

### Semantic
- **Warning** (`{colors.accent-warning}` — #ab6400): Warning text inside docs callouts.
- **Preview** (`{colors.accent-preview}` — #8145b5): "Preview" tag color.
- **Success** (`{colors.semantic-success}` — #16a34a): Confirmation.
- **Error** (`{colors.semantic-error}` — #eb8e90): Validation errors.

## Typography

### Font Family
**Inter** is the single sans family across every text role. **JetBrains Mono** carries every code surface. Fallback: `-apple-system, system-ui, sans-serif`.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 64px | 600 | 1.05 | -1.92px | Homepage hero h1 |
| `{typography.display-xl}` | 48px | 600 | 1.1 | -1.44px | Subsidiary heroes |
| `{typography.display-lg}` | 36px | 600 | 1.15 | -1.08px | Section heads |
| `{typography.display-md}` | 28px | 600 | 1.2 | -0.84px | Sub-section heads |
| `{typography.display-sm}` | 22px | 600 | 1.25 | -0.5px | Card group titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Component titles |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | List labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 13px | 400 | 1.4 | 0 | Photo captions |
| `{typography.caption-uppercase}` | 11px | 600 | 1.4 | 0.88px | Section labels, badges |
| `{typography.code}` | 13px | 400 | 1.5 | 0 | Code blocks — JetBrains Mono |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | CTA labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu |

### Principles
- **Display weight stays at 600** — confident but not bombastic. Inter at 600 reads cleaner than 700.
- **Negative letter-spacing on display** — -0.5px to -1.92px tracking.
- **JetBrains Mono on every code surface.**

### Note on Font Substitutes
Inter and JetBrains Mono are both freely available — the system uses them directly.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** 96px.

### Grid & Container
- Max content width: ~1200px.
- Editorial body: 12-column grid.
- Feature card grids: 2-up at desktop for hero splits, 3-up for benefit grids.
- Ecosystem tile grid: 8-up at desktop.
- Footer: 5-column at desktop.

### Whitespace Philosophy
Generous editorial pacing. The white canvas does not compete with the hero''s gradient sky wash; cards inside dense workflow sections sit close (16-24px gap).

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#ffffff) | Body bands, footer |
| Card | `{colors.surface-card}` (#ffffff) | Content cards |
| Hairline border | 1px `{colors.hairline}` | Card outlines |
| Soft drop | `0 4px 12px rgba(0, 0, 0, 0.04)` | Hovered cards (single shadow tier) |
| Atmospheric gradient | Sky-blue radial wash | Hero backdrop only |
| Dark inversion | `{colors.surface-dark}` (#171717) | Dark feature cards, code blocks, featured pricing |

### Decorative Depth
- **Sky-blue gradient backdrop** in the hero only — atmospheric depth without claiming to be a brand color.
- **Device mockup composite** as page chrome — MacBook + iPhone showing real Expo dev surfaces.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 6px | Compact rows |
| `{rounded.md}` | 8px | CTA buttons, form inputs, ecosystem tiles |
| `{rounded.lg}` | 12px | Feature cards, code blocks, pricing tiers |
| `{rounded.xl}` | 16px | Device mockup cards |
| `{rounded.xxl}` | 24px | Larger atmospheric cards (rare) |
| `{rounded.pill}` | 9999px | Badges only |
| `{rounded.full}` | 9999px | Avatar plates (rare) |

Compact developer-ergonomic radii — 8px CTAs, 12px cards. Pill geometry is reserved for badges, never CTAs.

## Components

### Top Navigation

**`top-nav`** — Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: Expo wordmark left, primary horizontal menu (Tools / Workflows / EAS / Pricing / Docs / Showcase), Sign In + Get started CTA right.

### Buttons

**`button-primary`** — Pure black pill. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (14px / 500), padding 10px × 18px, height 40px, rounded `{rounded.md}` (8px).

**`button-primary-active`** — Press state. Background `{colors.primary-active}`.

**`button-secondary`** — White card with 1px hairline-strong border. Background `{colors.surface-card}`, text `{colors.ink}`, 1px `{colors.hairline-strong}` border.

**`button-tertiary-text`** — Inline blue text link. Background transparent, text `{colors.text-link}`.

### Hero & Device Mockup

**`hero-band`** — Background `{colors.canvas}` with a soft sky-blue gradient wash behind the centered headline. Display headline in `{typography.display-mega}` (64px / 600 / -1.92px), subhead in `{typography.body-md}`, single primary CTA, then below — the device mockup composite.

**`device-mockup-card`** — A layered MacBook + iPhone composite showing real Expo dev surfaces. Background `{colors.surface-card}`, rounded `{rounded.xl}`. The MacBook holds the EAS dashboard or Expo Studio screenshot; the iPhone overlay shows the running app in Expo Go. This is the page chrome.

### Cards

**`feature-card`** — Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.title-md}`, rounded `{rounded.lg}`, padding 24px, 1px `{colors.hairline-strong}` border.

**`feature-card-dark`** — Dark variant. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same shape, dark inversion.

**`workflow-step-card`** — Step in the "Get your app on every device" workflow row. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 20px. Layout: 32px square `{component.workflow-step-icon}` + step number + label + body.

**`workflow-step-icon`** — Square plate. Background `{colors.surface-strong}`, rounded `{rounded.md}`, 32px size.

**`testimonial-card`** — Quote card. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 24px.

### Code & IDE

**`code-block`** — Inline code block. Background `{colors.surface-dark}`, text `{colors.on-dark}` in `{typography.code}` (JetBrains Mono 13px), rounded `{rounded.lg}`, padding 20px. White text on dark.

**`ide-mockup-card`** — Stylized IDE mockup. Background `{colors.surface-dark}`, rounded `{rounded.lg}`. Multi-pane editor + terminal preview.

### Pricing

**`pricing-tier-card`** — Standard pricing tier. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding 32px, 1px `{colors.hairline-strong}` border.

**`pricing-tier-featured`** — Featured tier. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same shape, dark inversion.

### Ecosystem

**`ecosystem-tile`** — Square logo plate for ecosystem partner logos (TypeScript, React, Sentry, etc.). Background `{colors.surface-card}`, rounded `{rounded.md}`, 64px size, 1px `{colors.hairline}` border.

### Forms & Tags

**`text-input`** — Background `{colors.surface-card}`, text `{colors.ink}`, rounded `{rounded.md}` (8px), padding 12px × 16px, height 44px, 1px `{colors.hairline-strong}` border. Focus thickens border to 2px ink.

**`badge-pill`** — Small uppercase pill. Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 10px.

### CTA / Footer

**`cta-band`** — Pre-footer band. Background `{colors.canvas}`, centered display headline in `{typography.display-lg}`, single black pill CTA. 96px padding.

**`footer-light`** — Closing white footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`** — Background transparent, text `{colors.body}`, type `{typography.body-sm}`.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (black) for primary CTAs.
- Use `{colors.text-link}` (blue) for inline body links only — never on CTAs or buttons.
- Set every CTA at `{rounded.md}` (8px) — developer dialect.
- Use Inter at weight 600 for display, 400 for body.
- Render every code surface in JetBrains Mono.
- Pair the hero with the device-mockup composite — it''s the page chrome.

### Don''t
- Don''t introduce a saturated brand action color. Black is the only CTA fill.
- Don''t use blue (`{colors.text-link}`) on a CTA. Inline links only.
- Don''t drop display below weight 600 or above 700.
- Don''t use full pills on CTAs — pills are for badges only.
- Don''t replicate the sky-blue gradient backdrop outside the hero.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA is what appears on actual page CTAs.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 64→32px; device mockup → single iPhone screen; feature grid 1-up; nav hamburger. |
| Tablet | 640–1024px | Hero h1 48px; device mockup compresses; feature grid 2-up. |
| Desktop | 1024–1280px | Full hero h1 64px; full MacBook + iPhone composite; feature grid 3-up. |
| Wide | > 1280px | Content caps at 1200px. |

### Touch Targets
- Primary CTA at 40px height — at WCAG AA, padded for AAA.
- Search input 44px — at AAA.

### Collapsing Strategy
- Top nav switches to hamburger below 768px.
- Device mockup MacBook + iPhone collapses to a single iPhone preview on mobile.
- Feature grid: 3-up → 2-up → 1-up.
- Ecosystem tile grid: 8-up → 4-up → 3-up → 2-up.

## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `{rounded.md}` (8px). Cards use `{rounded.lg}` (12px).
3. Variants live as separate entries.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented.
6. Inter 600 for display, Inter 400 for body. JetBrains Mono on code.
7. Black stays the only CTA color; text-link blue stays inline-only.

## Known Gaps

- Inter and JetBrains Mono are freely available — no licensing concerns.
- Animation timings (device mockup parallax, hero entrance) out of scope.
- In-app surfaces (EAS dashboard interactive, Expo Go simulator) only partially captured via marketing mockups.
- Form validation states beyond focus not visible on captured surfaces.
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

Expo''s marketing site reads like a quietly-confident React-Native developer platform. The base canvas is **pure white** (`{colors.canvas}` — #ffffff) with a soft **sky-blue gradient atmospheric wash** behind the hero band. Near-black ink `{colors.ink}` (#171717) carries body and display alike. The single brand voltage is **pure black** (`{colors.primary}` — #000000) for primary CTAs — minimal and editorial-feeling. A small blue text-link accent (`{colors.text-link}` — #0d74ce) is reserved for inline body links, never as a CTA.

Type runs **Inter** as the single sans family at modest weights (display 600, body 400). JetBrains Mono carries every code surface. No custom typeface — the brand trusts Inter''s editorial neutrality.

The brand''s strongest visual signature is the **device-mockup hero** — a centered MacBook + iPhone composite showing real Expo dev surfaces (Expo Studio, EAS Build dashboard, the Expo Go simulator) — over a sky-blue gradient atmospheric wash. The composite is the page''s chrome instead of an illustration.

**Key Characteristics:**
- Pure white canvas with sky-blue gradient atmospheric backdrop in hero only.
- Single primary CTA: pure black pill at `{rounded.md}` (8px) — compact developer-tool dialect.
- Text-link blue (`{colors.text-link}`) for inline links only — never on a CTA.
- Inter as the single sans family — no custom display typeface.
- JetBrains Mono on every code surface.
- Device-mockup hero with real Expo product surfaces is the brand chrome.
- Hairline + soft drop depth; no atmospheric brand decoration outside the hero.
- 96px section rhythm.', '{"sourcePath":"docs/design-md/expo/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Black** (`{colors.primary}` — #000000): Primary CTA fill. Used scarcely.
- **Black Active** (`{colors.primary-active}` — #1a1a1a): Press state.
- **Text Link Blue** (`{colors.text-link}` — #0d74ce): Inline body links inside long-form copy. Scoped narrowly — never on CTAs.
- **Legal Link Blue** (`{colors.text-link-secondary}` — #476cff): Inline links inside legal copy footer.
- **Bright Cyan** (`{colors.accent-link-bright}` — #47c2ff): Used very sparingly inside docs widget links.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): Pure white page floor.
- **Canvas Soft** (`{colors.canvas-soft}` — #fafafa): Subtle alternating band.
- **Surface Card** (`{colors.surface-card}` — #ffffff): Pure white card.
- **Surface Strong** (`{colors.surface-strong}` — #f0f0f3): Badges, ecosystem tiles, secondary buttons.
- **Surface Dark** (`{colors.surface-dark}` — #171717): Dark feature cards, code blocks, IDE mockups, featured pricing.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #1a1a1a): One step lighter inside dark cards.

### Atmospheric Backdrop
- **Sky Light** (`{colors.gradient-sky-light}` — #cfe7ff) + **Sky Mid** (`{colors.gradient-sky-mid}` — #a8c8e8): The soft sky-blue gradient wash behind the homepage hero only. Not a brand action color.

### Hairlines
- **Hairline** (`{colors.hairline}` — #f0f0f3): Default 1px divider.
- **Hairline Soft** (`{colors.hairline-soft}` — #f5f5f7): Lighter divider.
- **Hairline Strong** (`{colors.hairline-strong}` — #dcdee0): Stronger panel outline.

### Text
- **Ink** (`{colors.ink}` — #171717): Display, body emphasis.
- **Body** (`{colors.body}` — #60646c): Default running-text — slightly cool gray.
- **Body Strong** (`{colors.body-strong}` — #171717): Same as ink.
- **Muted** (`{colors.muted}` — #999999): Sub-titles.
- **Muted Soft** (`{colors.muted-soft}` — #cccccc): Disabled text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on black CTA.
- **On Dark** (`{colors.on-dark}` — #ffffff): White text on dark cards.
- **On Dark Soft** (`{colors.on-dark-soft}` — #b0b4ba): Muted off-white on dark.

### Semantic
- **Warning** (`{colors.accent-warning}` — #ab6400): Warning text inside docs callouts.
- **Preview** (`{colors.accent-preview}` — #8145b5): "Preview" tag color.
- **Success** (`{colors.semantic-success}` — #16a34a): Confirmation.
- **Error** (`{colors.semantic-error}` — #eb8e90): Validation errors.', '{"sourcePath":"docs/design-md/expo/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**Inter** is the single sans family across every text role. **JetBrains Mono** carries every code surface. Fallback: `-apple-system, system-ui, sans-serif`.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 64px | 600 | 1.05 | -1.92px | Homepage hero h1 |
| `{typography.display-xl}` | 48px | 600 | 1.1 | -1.44px | Subsidiary heroes |
| `{typography.display-lg}` | 36px | 600 | 1.15 | -1.08px | Section heads |
| `{typography.display-md}` | 28px | 600 | 1.2 | -0.84px | Sub-section heads |
| `{typography.display-sm}` | 22px | 600 | 1.25 | -0.5px | Card group titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Component titles |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | List labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 13px | 400 | 1.4 | 0 | Photo captions |
| `{typography.caption-uppercase}` | 11px | 600 | 1.4 | 0.88px | Section labels, badges |
| `{typography.code}` | 13px | 400 | 1.5 | 0 | Code blocks — JetBrains Mono |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | CTA labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu |

### Principles
- **Display weight stays at 600** — confident but not bombastic. Inter at 600 reads cleaner than 700.
- **Negative letter-spacing on display** — -0.5px to -1.92px tracking.
- **JetBrains Mono on every code surface.**

### Note on Font Substitutes
Inter and JetBrains Mono are both freely available — the system uses them directly.', '{"sourcePath":"docs/design-md/expo/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** 96px.

### Grid & Container
- Max content width: ~1200px.
- Editorial body: 12-column grid.
- Feature card grids: 2-up at desktop for hero splits, 3-up for benefit grids.
- Ecosystem tile grid: 8-up at desktop.
- Footer: 5-column at desktop.

### Whitespace Philosophy
Generous editorial pacing. The white canvas does not compete with the hero''s gradient sky wash; cards inside dense workflow sections sit close (16-24px gap).', '{"sourcePath":"docs/design-md/expo/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#ffffff) | Body bands, footer |
| Card | `{colors.surface-card}` (#ffffff) | Content cards |
| Hairline border | 1px `{colors.hairline}` | Card outlines |
| Soft drop | `0 4px 12px rgba(0, 0, 0, 0.04)` | Hovered cards (single shadow tier) |
| Atmospheric gradient | Sky-blue radial wash | Hero backdrop only |
| Dark inversion | `{colors.surface-dark}` (#171717) | Dark feature cards, code blocks, featured pricing |

### Decorative Depth
- **Sky-blue gradient backdrop** in the hero only — atmospheric depth without claiming to be a brand color.
- **Device mockup composite** as page chrome — MacBook + iPhone showing real Expo dev surfaces.', '{"sourcePath":"docs/design-md/expo/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 6px | Compact rows |
| `{rounded.md}` | 8px | CTA buttons, form inputs, ecosystem tiles |
| `{rounded.lg}` | 12px | Feature cards, code blocks, pricing tiers |
| `{rounded.xl}` | 16px | Device mockup cards |
| `{rounded.xxl}` | 24px | Larger atmospheric cards (rare) |
| `{rounded.pill}` | 9999px | Badges only |
| `{rounded.full}` | 9999px | Avatar plates (rare) |

Compact developer-ergonomic radii — 8px CTAs, 12px cards. Pill geometry is reserved for badges, never CTAs.', '{"sourcePath":"docs/design-md/expo/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav`** — Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: Expo wordmark left, primary horizontal menu (Tools / Workflows / EAS / Pricing / Docs / Showcase), Sign In + Get started CTA right.

### Buttons

**`button-primary`** — Pure black pill. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (14px / 500), padding 10px × 18px, height 40px, rounded `{rounded.md}` (8px).

**`button-primary-active`** — Press state. Background `{colors.primary-active}`.

**`button-secondary`** — White card with 1px hairline-strong border. Background `{colors.surface-card}`, text `{colors.ink}`, 1px `{colors.hairline-strong}` border.

**`button-tertiary-text`** — Inline blue text link. Background transparent, text `{colors.text-link}`.

### Hero & Device Mockup

**`hero-band`** — Background `{colors.canvas}` with a soft sky-blue gradient wash behind the centered headline. Display headline in `{typography.display-mega}` (64px / 600 / -1.92px), subhead in `{typography.body-md}`, single primary CTA, then below — the device mockup composite.

**`device-mockup-card`** — A layered MacBook + iPhone composite showing real Expo dev surfaces. Background `{colors.surface-card}`, rounded `{rounded.xl}`. The MacBook holds the EAS dashboard or Expo Studio screenshot; the iPhone overlay shows the running app in Expo Go. This is the page chrome.

### Cards

**`feature-card`** — Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.title-md}`, rounded `{rounded.lg}`, padding 24px, 1px `{colors.hairline-strong}` border.

**`feature-card-dark`** — Dark variant. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same shape, dark inversion.

**`workflow-step-card`** — Step in the "Get your app on every device" workflow row. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 20px. Layout: 32px square `{component.workflow-step-icon}` + step number + label + body.

**`workflow-step-icon`** — Square plate. Background `{colors.surface-strong}`, rounded `{rounded.md}`, 32px size.

**`testimonial-card`** — Quote card. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 24px.

### Code & IDE

**`code-block`** — Inline code block. Background `{colors.surface-dark}`, text `{colors.on-dark}` in `{typography.code}` (JetBrains Mono 13px), rounded `{rounded.lg}`, padding 20px. White text on dark.

**`ide-mockup-card`** — Stylized IDE mockup. Background `{colors.surface-dark}`, rounded `{rounded.lg}`. Multi-pane editor + terminal preview.

### Pricing

**`pricing-tier-card`** — Standard pricing tier. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding 32px, 1px `{colors.hairline-strong}` border.

**`pricing-tier-featured`** — Featured tier. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same shape, dark inversion.

### Ecosystem

**`ecosystem-tile`** — Square logo plate for ecosystem partner logos (TypeScript, React, Sentry, etc.). Background `{colors.surface-card}`, rounded `{rounded.md}`, 64px size, 1px `{colors.hairline}` border.

### Forms & Tags

**`text-input`** — Background `{colors.surface-card}`, text `{colors.ink}`, rounded `{rounded.md}` (8px), padding 12px × 16px, height 44px, 1px `{colors.hairline-strong}` border. Focus thickens border to 2px ink.

**`badge-pill`** — Small uppercase pill. Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 10px.

### CTA / Footer

**`cta-band`** — Pre-footer band. Background `{colors.canvas}`, centered display headline in `{typography.display-lg}`, single black pill CTA. 96px padding.

**`footer-light`** — Closing white footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`** — Background transparent, text `{colors.body}`, type `{typography.body-sm}`.', '{"sourcePath":"docs/design-md/expo/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (black) for primary CTAs.
- Use `{colors.text-link}` (blue) for inline body links only — never on CTAs or buttons.
- Set every CTA at `{rounded.md}` (8px) — developer dialect.
- Use Inter at weight 600 for display, 400 for body.
- Render every code surface in JetBrains Mono.
- Pair the hero with the device-mockup composite — it''s the page chrome.

### Don''t
- Don''t introduce a saturated brand action color. Black is the only CTA fill.
- Don''t use blue (`{colors.text-link}`) on a CTA. Inline links only.
- Don''t drop display below weight 600 or above 700.
- Don''t use full pills on CTAs — pills are for badges only.
- Don''t replicate the sky-blue gradient backdrop outside the hero.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA is what appears on actual page CTAs.', '{"sourcePath":"docs/design-md/expo/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 64→32px; device mockup → single iPhone screen; feature grid 1-up; nav hamburger. |
| Tablet | 640–1024px | Hero h1 48px; device mockup compresses; feature grid 2-up. |
| Desktop | 1024–1280px | Full hero h1 64px; full MacBook + iPhone composite; feature grid 3-up. |
| Wide | > 1280px | Content caps at 1200px. |

### Touch Targets
- Primary CTA at 40px height — at WCAG AA, padded for AAA.
- Search input 44px — at AAA.

### Collapsing Strategy
- Top nav switches to hamburger below 768px.
- Device mockup MacBook + iPhone collapses to a single iPhone preview on mobile.
- Feature grid: 3-up → 2-up → 1-up.
- Ecosystem tile grid: 8-up → 4-up → 3-up → 2-up.', '{"sourcePath":"docs/design-md/expo/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `{rounded.md}` (8px). Cards use `{rounded.lg}` (12px).
3. Variants live as separate entries.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented.
6. Inter 600 for display, Inter 400 for body. JetBrains Mono on code.
7. Black stays the only CTA color; text-link blue stays inline-only.', '{"sourcePath":"docs/design-md/expo/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Inter and JetBrains Mono are freely available — no licensing concerns.
- Animation timings (device mockup parallax, hero entrance) out of scope.
- In-app surfaces (EAS dashboard interactive, Expo Go simulator) only partially captured via marketing mockups.
- Form validation states beyond focus not visible on captured surfaces.', '{"sourcePath":"docs/design-md/expo/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_1', '#171717', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_2', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_3', '#0d74ce', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_4', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_5', '#476cff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_6', '#60646c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_7', '#999999', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_8', '#cccccc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_9', '#f0f0f3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_10', '#f5f5f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_11', '#dcdee0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_12', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_13', '#fafafa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_14', '#b0b4ba', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_15', '#cfe7ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_16', '#a8c8e8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_17', '#ab6400', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_18', '#8145b5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_19', '#47c2ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_20', '#eb8e90', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md'), 'color', 'color_21', '#16a34a', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/expo/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/expo/DESIGN.md';


-- Ferrari
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Ferrari', 'ferrari', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/ferrari/DESIGN.md', null, 'seeded', '---
version: alpha
name: Ferrari-design-analysis
description: A luxury-automotive brand whose marketing surfaces read as cinematic editorial. The base canvas is **near-black** (`#181818`) holding pure white display type; white-canvas bands appear only inside specific editorial contexts (preowned listings, pricing tables). The single brand voltage is **Rosso Corsa** (`#da291c`) — the iconic Ferrari racing red — used scarcely on primary CTAs, the Cavallino mark, and Formula 1 race-position highlights. Type runs **FerrariSans** at modest weights (display 500, body 400) — never bombastic. Spacing follows an explicit 8px token ladder (`xxxs` 4px through `super` 128px); generous editorial pacing throughout. The brand''s strongest visual signature is the **full-bleed cinematic hero photograph** that fills the viewport top with car photography, model details, or trackside livery — followed by a tighter editorial body layout below.

colors:
  primary: "#da291c"
  primary-active: "#b01e0a"
  primary-hover: "#9d2211"
  ink: "#ffffff"
  body: "#969696"
  body-strong: "#ffffff"
  body-on-light: "#181818"
  muted: "#666666"
  muted-soft: "#8f8f8f"
  hairline: "#303030"
  hairline-on-light: "#d2d2d2"
  hairline-soft: "#ebebeb"
  canvas: "#181818"
  canvas-elevated: "#303030"
  canvas-light: "#ffffff"
  surface-card: "#303030"
  surface-soft-light: "#f7f7f7"
  surface-strong-light: "#ebebeb"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  on-light: "#181818"
  accent-yellow-hypersail: "#fff200"
  accent-yellow: "#f6e500"
  semantic-info: "#4c98b9"
  semantic-success: "#03904a"
  semantic-warning: "#f13a2c"

typography:
  display-mega:
    fontFamily: "''FerrariSans'', -apple-system, system-ui, sans-serif"
    fontSize: 80px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -1.6px
  display-xl:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -1.12px
  display-lg:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.36px
  display-md:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 26px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0.195px
  title-md:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  title-sm:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.08px
  body-md:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 1.1px
    textTransform: uppercase
  button:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 1.4px
    textTransform: uppercase
  nav-link:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.65px
    textTransform: uppercase
  number-display:
    fontFamily: "''FerrariSans'', sans-serif"
    fontSize: 80px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -1.6px

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px

spacing:
  xxxs: 4px
  xxs: 8px
  xs: 16px
  sm: 24px
  md: 32px
  lg: 48px
  xl: 64px
  xxl: 96px
  super: 128px

components:
  top-nav-on-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 64px
  top-nav-on-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.body-on-light}"
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
  button-outline-on-dark:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 13px 31px
    height: 48px
  button-outline-on-light:
    backgroundColor: transparent
    textColor: "{colors.body-on-light}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 13px 31px
    height: 48px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
  hero-band-cinema:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-mega}"
    padding: 0
  hero-band-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.body-on-light}"
    typography: "{typography.display-xl}"
    padding: 96px
  feature-card-photo:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.none}"
    padding: 0
  feature-card-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.body-on-light}"
    typography: "{typography.title-md}"
    rounded: "{rounded.none}"
    padding: 32px
  livery-band:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: 96px
  preowned-listing-card:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.body-on-light}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 24px
  spec-cell:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.number-display}"
    padding: 24px 0
  race-position-cell:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.number-display}"
  race-calendar-row:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 16px 0
  driver-card:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.none}"
    padding: 24px
  text-input-on-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 14px 16px
    height: 48px
  text-input-on-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.body-on-light}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 14px 16px
    height: 48px
  badge-pill:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  cta-band-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: 96px
  newsletter-input-band:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 32px
  footer-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 64px 48px
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
---

## Overview

Ferrari''s marketing site reads as cinematic editorial — closer to a luxury-magazine spread than a typical car-OEM site. The base canvas is **near-black** (`{colors.canvas}` — #181818) holding pure white display type; white-canvas bands appear only inside specific editorial contexts (preowned listings, pricing tables, dealer surfaces). The single brand voltage is **Rosso Corsa** (`{colors.primary}` — #da291c), the iconic Ferrari racing red, used scarcely on primary CTAs, the Cavallino mark, and Formula 1 race-position highlights.

Type runs **FerrariSans** as the single sans family at modest weights — display 500, body 400. CTA labels render in uppercase with generous tracking (1.1-1.4px). The brand never uses bold display copy.

The brand''s strongest visual signature is the **full-bleed cinematic hero photograph** — top-of-page imagery shows car photography, model details, or trackside livery without any chrome competing with it. Headlines float over the bottom of the photo or sit in a tight band beneath. Spacing follows the explicit 8px token ladder: `xxxs` 4 / `xxs` 8 / `xs` 16 / `sm` 24 / `md` 32 / `lg` 48 / `xl` 64 / `xxl` 96 / `super` 128.

**Key Characteristics:**
- Single accent: `{colors.primary}` (Rosso Corsa #da291c) for primary CTAs, the Cavallino, F1 race-position highlights. Used scarcely.
- Near-black canvas (#181818) — never pure black. White-canvas bands only inside editorial contexts.
- Single sans family: FerrariSans across every text role.
- Display weight stays at 500 — never bold.
- CTA labels render uppercase with 1.4px tracking.
- Sharp `{rounded.none}` (0px) corners on every CTA, card, and band — luxury-automotive precision.
- Full-bleed cinematic hero photography is the page chrome.
- Explicit 8px spacing token ladder with named scale (xxxs through super).
- Hairlines + photographic depth — no drop shadow tiers.

## Colors

### Brand & Accent
- **Rosso Corsa** (`{colors.primary}` — #da291c): The iconic Ferrari racing red. Primary CTA fill, Cavallino mark, F1 driver-position highlights. Used scarcely.
- **Rosso Corsa Active** (`{colors.primary-active}` — #b01e0a): Press state.
- **Rosso Corsa Hover-darker** (`{colors.primary-hover}` — #9d2211): Documented for completeness; per the no-hover policy this is not used in preview HTML.
- **Hypersail Yellow** (`{colors.accent-yellow-hypersail}` — #fff200) + **Yellow** (`{colors.accent-yellow}` — #f6e500): Sub-brand accents reserved for the Hypersail sailing program and the global focus-ring color. Not part of the main automotive palette.

### Surface
- **Canvas** (`{colors.canvas}` — #181818): Near-black page floor — never pure black, slight warmth.
- **Canvas Elevated** (`{colors.canvas-elevated}` — #303030): Cards and panels on dark canvas.
- **Canvas Light** (`{colors.canvas-light}` — #ffffff): White editorial bands (preowned listings, pricing).
- **Surface Card** (`{colors.surface-card}` — #303030): Same as canvas-elevated — driver cards, livery photo plates.
- **Surface Soft Light** (`{colors.surface-soft-light}` — #f7f7f7): Light editorial alternating band.
- **Surface Strong Light** (`{colors.surface-strong-light}` — #ebebeb): Light-canvas dividers, badges.

### Hairlines
- **Hairline** (`{colors.hairline}` — #303030): 1px divider on dark — same hex as `{colors.canvas-elevated}`.
- **Hairline On Light** (`{colors.hairline-on-light}` — #d2d2d2): 1px divider on light bands.
- **Hairline Soft** (`{colors.hairline-soft}` — #ebebeb): Lighter divider.

### Text
- **Ink** (`{colors.ink}` — #ffffff): Display, body emphasis on dark.
- **Body** (`{colors.body}` — #969696): Default running-text on dark.
- **Body Strong** (`{colors.body-strong}` — #ffffff): Same as ink.
- **Body On Light** (`{colors.body-on-light}` — #181818): Default text on light bands.
- **Muted** (`{colors.muted}` — #666666): Sub-titles, captions on dark.
- **Muted Soft** (`{colors.muted-soft}` — #8f8f8f): Disabled link text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on Rosso Corsa.

### Semantic
- **Info** (`{colors.semantic-info}` — #4c98b9): Info badges, callout backgrounds.
- **Success** (`{colors.semantic-success}` — #03904a): Confirmation.
- **Warning** (`{colors.semantic-warning}` — #f13a2c): Validation warnings.

## Typography

### Font Family
**FerrariSans** is the licensed single sans family across every text role. Fallback: `-apple-system, system-ui, sans-serif`. No display/body family split.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 80px | 500 | 1.05 | -1.6px | Homepage hero h1 |
| `{typography.display-xl}` | 56px | 500 | 1.1 | -1.12px | Subsidiary heroes |
| `{typography.display-lg}` | 36px | 500 | 1.2 | -0.36px | Section heads, livery band |
| `{typography.display-md}` | 26px | 500 | 1.5 | 0.195px | Sub-section heads |
| `{typography.title-md}` | 18px | 700 | 1.2 | 0 | Component titles |
| `{typography.title-sm}` | 16px | 500 | 1.4 | 0.08px | List labels |
| `{typography.body-md}` | 14px | 400 | 1.5 | 0 | Default body |
| `{typography.body-sm}` | 13px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 12px | 400 | 1.4 | 0 | Photo captions |
| `{typography.caption-uppercase}` | 11px | 600 | 1.4 | 1.1px | Section labels, badges |
| `{typography.button}` | 14px | 700 | 1.0 | 1.4px (uppercase) | CTA pill labels |
| `{typography.nav-link}` | 13px | 600 | 1.4 | 0.65px (uppercase) | Top-nav menu items |
| `{typography.number-display}` | 80px | 700 | 1.0 | -1.6px | Race position highlights, spec values |

### Principles
- **Display weight stays at 500.** Editorial confidence, not bombastic. The cinematic photography is doing the visual heavy-lifting — type doesn''t need to compete.
- **CTA labels are uppercase with 1.4px tracking.** Luxury-precision feel.
- **Nav labels are uppercase with 0.65px tracking.** Consistent with CTA voice.
- **Negative letter-spacing on display only.** -0.36px to -1.6px on display sizes; body stays at 0.

### Note on Font Substitutes
FerrariSans is licensed. Open-source substitute: **Inter** at weight 500 with letter-spacing -1%, or **Söhne** for closer humanist proportions.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxxs}` 4px · `{spacing.xxs}` 8px · `{spacing.xs}` 16px · `{spacing.sm}` 24px · `{spacing.md}` 32px · `{spacing.lg}` 48px · `{spacing.xl}` 64px · `{spacing.xxl}` 96px · `{spacing.super}` 128px.
- **Section padding:** `{spacing.xxl}` (96px) for major bands; `{spacing.super}` (128px) reserved for hero band depth.

### Grid & Container
- Max content width: ~1280px on editorial bands. Hero photography goes full-bleed.
- Editorial body: 12-column grid.
- Feature card grids: 2-up at desktop for hero splits, 3-up for benefit grids, 4-up for preowned listing tiles.
- Footer: 5-column at desktop.

### Whitespace Philosophy
Generous editorial pacing. Cinematic hero photography occupies generous viewport real-estate; body sections sit in tighter editorial layouts beneath. The canvas-light editorial bands (preowned, pricing) carry tighter density than the dark cinema bands.

## Elevation & Depth

The system uses **photographic depth + brightness-step** elevation. No drop shadows except a single soft-small `{shadow.small}` documented in extracted tokens.

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#181818) | Body bands, footer |
| Card | `{colors.canvas-elevated}` (#303030) | Driver cards, livery plates |
| Light band | `{colors.canvas-light}` (#ffffff) | Preowned listings, pricing |
| Hairline border | 1px `{colors.hairline}` or `{colors.hairline-on-light}` | Card outlines, dividers |
| Soft drop | `0 4px 8px rgba(0,0,0,0.1)` | Hovered cards (single shadow tier) |
| Photographic | Full-bleed cinema imagery | Hero band, livery photographs |

### Decorative Depth
- **Full-bleed cinema photography** is the brand''s primary depth treatment.
- **Brand red gradient** (`linear-gradient(180deg, #a00c01, #da291c 64%)`): The Rosso Corsa gradient used inside accent bands and CTA hover states.
- **Dark grey gradient** (`linear-gradient(180deg, #3c3c3c, #030303 64%)`): Atmospheric darken used at section transitions.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Every CTA, card, band — dominant radius |
| `{rounded.xs}` | 2px | Tight badges (rare) |
| `{rounded.sm}` | 4px | Form inputs |
| `{rounded.md}` | 6px | Compact cards (rare) |
| `{rounded.lg}` | 8px | Mobile-only collapse cards |
| `{rounded.xl}` | 12px | Modal/dialog corners (rare) |
| `{rounded.full}` | 9999px | Avatar plates, badge pills |

The radius vocabulary is **sharp by default**. Sharp 0px corners are the brand button shape — never rounded pills. Pill geometry is reserved for badge labels only.

## Components

### Top Navigation

**`top-nav-on-dark`** — Default top nav on dark hero pages. Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: Cavallino mark left, primary horizontal menu (Models / F1 / Lifestyle / Owners / Preowned), language picker + utilities right. Menu items render uppercase with 0.65px tracking.

**`top-nav-on-light`** — White-canvas variant for editorial light bands.

### Buttons

**`button-primary`** — The signature Rosso Corsa CTA. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (14px / 700 / 1.4px tracking, uppercase), padding 14px × 32px, height 48px, **rounded `{rounded.none}` (0px — sharp corners)**.

**`button-primary-active`** — Press state. Background `{colors.primary-active}`.

**`button-outline-on-dark`** — Transparent with 1px white border. Background transparent, text `{colors.ink}`, 1px white border, same sharp 0px corners.

**`button-outline-on-light`** — Transparent with 1px ink border on light bands.

**`button-tertiary-text`** — Inline text link, uppercase tracking.

### Hero Bands

**`hero-band-cinema`** — Full-bleed cinematic photograph. Background `{colors.canvas}` underneath, but the photo fills the viewport. Display headline floats over the bottom of the photo or sits in a tight band beneath, in `{typography.display-mega}` (80px / 500 / -1.6px). One primary CTA + one outline CTA. Zero padding — the photo fills edge-to-edge.

**`hero-band-light`** — White-canvas variant for editorial bands. Background `{colors.canvas-light}`, text `{colors.body-on-light}`, padding 96px.

### Cards

**`feature-card-photo`** — Image-first card. Background `{colors.canvas}`, text `{colors.ink}`, rounded `{rounded.none}`. Image fills the top edge-to-edge; title + body sit beneath in tight typography.

**`feature-card-light`** — White-canvas variant. Background `{colors.canvas-light}`, text `{colors.body-on-light}`, rounded `{rounded.none}`, padding 32px.

**`driver-card`** — F1 driver portrait card. Background `{colors.canvas-elevated}`, text `{colors.ink}`, rounded `{rounded.none}`, padding 24px. Layout: driver portrait + name + race number + team badge.

### Editorial Surfaces

**`livery-band`** — A full-width Rosso Corsa accent band. Background `{colors.primary}`, text `{colors.ink}`, type `{typography.display-lg}`, 96px padding. Used as a standout livery callout between dark editorial bands.

**`preowned-listing-card`** — Used in the preowned Ferrari listing grid. Background `{colors.canvas-light}`, text `{colors.body-on-light}`, rounded `{rounded.none}`, padding 24px. Layout: car photo top + model name + year/mileage + price.

### Spec & Race Surfaces

**`spec-cell`** — Technical spec callout. Transparent background, value in `{typography.number-display}` (80px / 700 / -1.6px white), label below in `{typography.caption-uppercase}`.

**`race-position-cell`** — F1 driver finishing position. Same number-display geometry but text in `{colors.primary}` Rosso Corsa for the brand''s racing identity.

**`race-calendar-row`** — Hairline-divided row in the F1 race calendar. Layout: date column left, race name + circuit middle, results column right.

### Forms & Tags

**`text-input-on-dark`** — Background `{colors.canvas}`, text `{colors.ink}`, rounded `{rounded.sm}` (4px), padding 14px × 16px, height 48px, 1px `{colors.hairline}` border.

**`text-input-on-light`** — White-canvas variant.

**`badge-pill`** — Small uppercase pill. Background `{colors.canvas-elevated}`, text `{colors.ink}`, type `{typography.caption-uppercase}` (11px / 600 / 1.1px tracking, uppercase), rounded `{rounded.full}` (9999px), padding 4px × 12px. The only place pill geometry is used.

### Newsletter / CTA / Footer

**`newsletter-input-band`** — Newsletter signup band. Background `{colors.canvas-elevated}`, padding 32px, rounded `{rounded.sm}`. Holds an inline email input + primary CTA.

**`cta-band-dark`** — Pre-footer band. Background `{colors.canvas}`, centered display headline in `{typography.display-lg}`, single Rosso Corsa CTA. 96px padding.

**`footer-dark`** — Closing dark footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`** — Background transparent, text `{colors.body}`, type `{typography.body-sm}`.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (Rosso Corsa) for primary CTAs, the Cavallino mark, and F1 race-position highlights.
- Set every CTA at `{rounded.none}` (0px sharp corners) — the brand''s signature precision.
- Render CTA labels in uppercase with 1.4px tracking via `{typography.button}`.
- Pair every hero with a full-bleed cinematic photograph — the photograph IS the depth.
- Use the explicit 8px spacing ladder (`xxxs` through `super`) rather than ad-hoc px values.
- Keep display weight at 500 — never bold.

### Don''t
- Don''t introduce a saturated brand color other than Rosso Corsa.
- Don''t use rounded or pill CTAs — sharp 0px corners are the brand button.
- Don''t bold display copy. The cinematic photography does the visual heavy-lifting.
- Don''t use Hypersail yellow outside the Hypersail sailing program context.
- Don''t use pure black canvas. The brand canvas is `{colors.canvas}` (#181818) — slightly warm.
- Don''t add drop shadow tiers. Photography + brightness-step elevation carry the depth.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA color is what appears on actual product CTAs, not on injected modals.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero photograph crops vertically; hero h1 80→32px; feature card grid 1-up; nav hamburger; preowned listing 1-up. |
| Tablet | 640–1024px | Hero h1 56px; feature card grid 2-up; preowned listing 2-up. |
| Desktop | 1024–1280px | Full hero h1 80px; feature card grid 3-up; preowned listing 4-up. |
| Wide | > 1280px | Editorial body content caps at 1280px; hero photography continues full-bleed. |

### Touch Targets
- Primary CTA at 48px height — at WCAG AAA (44 × 44).
- Nav items render uppercase with 0.65px tracking, padded for an effective 48px tap area.

### Collapsing Strategy
- Top nav switches to hamburger below 768px.
- Hero photograph reframes per breakpoint via art direction — desktop carries wide cinematic; mobile crops tighter or shifts to vertical.
- Feature card grid: 4-up → 3-up → 2-up → 1-up.
- F1 driver cards: 2-up at desktop, 1-up at mobile.

## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `{rounded.none}` (0px sharp). Cards use `{rounded.none}` too. Pill is reserved for badges.
3. Variants live as separate entries inside `components:`.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented.
6. FerrariSans 500 for display, 400/700 for body. Uppercase + tracking on CTAs and nav.
7. Rosso Corsa stays scarce — primary CTAs, Cavallino, race-position highlights only.
8. Use the explicit 8px named spacing ladder.

## Known Gaps

- FerrariSans is a licensed typeface; Inter at weight 500 is the documented substitute.
- Animation timings (hero parallax, livery band entrance, race position counter) out of scope.
- In-product surfaces (preowned configurator, F1 telemetry overlays) only partially captured via marketing surfaces.
- Form validation states beyond focus not visible on captured surfaces.
- Hypersail yellow tokens are extracted but only appear in the Hypersail sailing program context — documented as scoped accents.
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

Ferrari''s marketing site reads as cinematic editorial — closer to a luxury-magazine spread than a typical car-OEM site. The base canvas is **near-black** (`{colors.canvas}` — #181818) holding pure white display type; white-canvas bands appear only inside specific editorial contexts (preowned listings, pricing tables, dealer surfaces). The single brand voltage is **Rosso Corsa** (`{colors.primary}` — #da291c), the iconic Ferrari racing red, used scarcely on primary CTAs, the Cavallino mark, and Formula 1 race-position highlights.

Type runs **FerrariSans** as the single sans family at modest weights — display 500, body 400. CTA labels render in uppercase with generous tracking (1.1-1.4px). The brand never uses bold display copy.

The brand''s strongest visual signature is the **full-bleed cinematic hero photograph** — top-of-page imagery shows car photography, model details, or trackside livery without any chrome competing with it. Headlines float over the bottom of the photo or sit in a tight band beneath. Spacing follows the explicit 8px token ladder: `xxxs` 4 / `xxs` 8 / `xs` 16 / `sm` 24 / `md` 32 / `lg` 48 / `xl` 64 / `xxl` 96 / `super` 128.

**Key Characteristics:**
- Single accent: `{colors.primary}` (Rosso Corsa #da291c) for primary CTAs, the Cavallino, F1 race-position highlights. Used scarcely.
- Near-black canvas (#181818) — never pure black. White-canvas bands only inside editorial contexts.
- Single sans family: FerrariSans across every text role.
- Display weight stays at 500 — never bold.
- CTA labels render uppercase with 1.4px tracking.
- Sharp `{rounded.none}` (0px) corners on every CTA, card, and band — luxury-automotive precision.
- Full-bleed cinematic hero photography is the page chrome.
- Explicit 8px spacing token ladder with named scale (xxxs through super).
- Hairlines + photographic depth — no drop shadow tiers.', '{"sourcePath":"docs/design-md/ferrari/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Rosso Corsa** (`{colors.primary}` — #da291c): The iconic Ferrari racing red. Primary CTA fill, Cavallino mark, F1 driver-position highlights. Used scarcely.
- **Rosso Corsa Active** (`{colors.primary-active}` — #b01e0a): Press state.
- **Rosso Corsa Hover-darker** (`{colors.primary-hover}` — #9d2211): Documented for completeness; per the no-hover policy this is not used in preview HTML.
- **Hypersail Yellow** (`{colors.accent-yellow-hypersail}` — #fff200) + **Yellow** (`{colors.accent-yellow}` — #f6e500): Sub-brand accents reserved for the Hypersail sailing program and the global focus-ring color. Not part of the main automotive palette.

### Surface
- **Canvas** (`{colors.canvas}` — #181818): Near-black page floor — never pure black, slight warmth.
- **Canvas Elevated** (`{colors.canvas-elevated}` — #303030): Cards and panels on dark canvas.
- **Canvas Light** (`{colors.canvas-light}` — #ffffff): White editorial bands (preowned listings, pricing).
- **Surface Card** (`{colors.surface-card}` — #303030): Same as canvas-elevated — driver cards, livery photo plates.
- **Surface Soft Light** (`{colors.surface-soft-light}` — #f7f7f7): Light editorial alternating band.
- **Surface Strong Light** (`{colors.surface-strong-light}` — #ebebeb): Light-canvas dividers, badges.

### Hairlines
- **Hairline** (`{colors.hairline}` — #303030): 1px divider on dark — same hex as `{colors.canvas-elevated}`.
- **Hairline On Light** (`{colors.hairline-on-light}` — #d2d2d2): 1px divider on light bands.
- **Hairline Soft** (`{colors.hairline-soft}` — #ebebeb): Lighter divider.

### Text
- **Ink** (`{colors.ink}` — #ffffff): Display, body emphasis on dark.
- **Body** (`{colors.body}` — #969696): Default running-text on dark.
- **Body Strong** (`{colors.body-strong}` — #ffffff): Same as ink.
- **Body On Light** (`{colors.body-on-light}` — #181818): Default text on light bands.
- **Muted** (`{colors.muted}` — #666666): Sub-titles, captions on dark.
- **Muted Soft** (`{colors.muted-soft}` — #8f8f8f): Disabled link text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on Rosso Corsa.

### Semantic
- **Info** (`{colors.semantic-info}` — #4c98b9): Info badges, callout backgrounds.
- **Success** (`{colors.semantic-success}` — #03904a): Confirmation.
- **Warning** (`{colors.semantic-warning}` — #f13a2c): Validation warnings.', '{"sourcePath":"docs/design-md/ferrari/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**FerrariSans** is the licensed single sans family across every text role. Fallback: `-apple-system, system-ui, sans-serif`. No display/body family split.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 80px | 500 | 1.05 | -1.6px | Homepage hero h1 |
| `{typography.display-xl}` | 56px | 500 | 1.1 | -1.12px | Subsidiary heroes |
| `{typography.display-lg}` | 36px | 500 | 1.2 | -0.36px | Section heads, livery band |
| `{typography.display-md}` | 26px | 500 | 1.5 | 0.195px | Sub-section heads |
| `{typography.title-md}` | 18px | 700 | 1.2 | 0 | Component titles |
| `{typography.title-sm}` | 16px | 500 | 1.4 | 0.08px | List labels |
| `{typography.body-md}` | 14px | 400 | 1.5 | 0 | Default body |
| `{typography.body-sm}` | 13px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 12px | 400 | 1.4 | 0 | Photo captions |
| `{typography.caption-uppercase}` | 11px | 600 | 1.4 | 1.1px | Section labels, badges |
| `{typography.button}` | 14px | 700 | 1.0 | 1.4px (uppercase) | CTA pill labels |
| `{typography.nav-link}` | 13px | 600 | 1.4 | 0.65px (uppercase) | Top-nav menu items |
| `{typography.number-display}` | 80px | 700 | 1.0 | -1.6px | Race position highlights, spec values |

### Principles
- **Display weight stays at 500.** Editorial confidence, not bombastic. The cinematic photography is doing the visual heavy-lifting — type doesn''t need to compete.
- **CTA labels are uppercase with 1.4px tracking.** Luxury-precision feel.
- **Nav labels are uppercase with 0.65px tracking.** Consistent with CTA voice.
- **Negative letter-spacing on display only.** -0.36px to -1.6px on display sizes; body stays at 0.

### Note on Font Substitutes
FerrariSans is licensed. Open-source substitute: **Inter** at weight 500 with letter-spacing -1%, or **Söhne** for closer humanist proportions.', '{"sourcePath":"docs/design-md/ferrari/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxxs}` 4px · `{spacing.xxs}` 8px · `{spacing.xs}` 16px · `{spacing.sm}` 24px · `{spacing.md}` 32px · `{spacing.lg}` 48px · `{spacing.xl}` 64px · `{spacing.xxl}` 96px · `{spacing.super}` 128px.
- **Section padding:** `{spacing.xxl}` (96px) for major bands; `{spacing.super}` (128px) reserved for hero band depth.

### Grid & Container
- Max content width: ~1280px on editorial bands. Hero photography goes full-bleed.
- Editorial body: 12-column grid.
- Feature card grids: 2-up at desktop for hero splits, 3-up for benefit grids, 4-up for preowned listing tiles.
- Footer: 5-column at desktop.

### Whitespace Philosophy
Generous editorial pacing. Cinematic hero photography occupies generous viewport real-estate; body sections sit in tighter editorial layouts beneath. The canvas-light editorial bands (preowned, pricing) carry tighter density than the dark cinema bands.', '{"sourcePath":"docs/design-md/ferrari/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

The system uses **photographic depth + brightness-step** elevation. No drop shadows except a single soft-small `{shadow.small}` documented in extracted tokens.

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#181818) | Body bands, footer |
| Card | `{colors.canvas-elevated}` (#303030) | Driver cards, livery plates |
| Light band | `{colors.canvas-light}` (#ffffff) | Preowned listings, pricing |
| Hairline border | 1px `{colors.hairline}` or `{colors.hairline-on-light}` | Card outlines, dividers |
| Soft drop | `0 4px 8px rgba(0,0,0,0.1)` | Hovered cards (single shadow tier) |
| Photographic | Full-bleed cinema imagery | Hero band, livery photographs |

### Decorative Depth
- **Full-bleed cinema photography** is the brand''s primary depth treatment.
- **Brand red gradient** (`linear-gradient(180deg, #a00c01, #da291c 64%)`): The Rosso Corsa gradient used inside accent bands and CTA hover states.
- **Dark grey gradient** (`linear-gradient(180deg, #3c3c3c, #030303 64%)`): Atmospheric darken used at section transitions.', '{"sourcePath":"docs/design-md/ferrari/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Every CTA, card, band — dominant radius |
| `{rounded.xs}` | 2px | Tight badges (rare) |
| `{rounded.sm}` | 4px | Form inputs |
| `{rounded.md}` | 6px | Compact cards (rare) |
| `{rounded.lg}` | 8px | Mobile-only collapse cards |
| `{rounded.xl}` | 12px | Modal/dialog corners (rare) |
| `{rounded.full}` | 9999px | Avatar plates, badge pills |

The radius vocabulary is **sharp by default**. Sharp 0px corners are the brand button shape — never rounded pills. Pill geometry is reserved for badge labels only.', '{"sourcePath":"docs/design-md/ferrari/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Top Navigation

**`top-nav-on-dark`** — Default top nav on dark hero pages. Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: Cavallino mark left, primary horizontal menu (Models / F1 / Lifestyle / Owners / Preowned), language picker + utilities right. Menu items render uppercase with 0.65px tracking.

**`top-nav-on-light`** — White-canvas variant for editorial light bands.

### Buttons

**`button-primary`** — The signature Rosso Corsa CTA. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (14px / 700 / 1.4px tracking, uppercase), padding 14px × 32px, height 48px, **rounded `{rounded.none}` (0px — sharp corners)**.

**`button-primary-active`** — Press state. Background `{colors.primary-active}`.

**`button-outline-on-dark`** — Transparent with 1px white border. Background transparent, text `{colors.ink}`, 1px white border, same sharp 0px corners.

**`button-outline-on-light`** — Transparent with 1px ink border on light bands.

**`button-tertiary-text`** — Inline text link, uppercase tracking.

### Hero Bands

**`hero-band-cinema`** — Full-bleed cinematic photograph. Background `{colors.canvas}` underneath, but the photo fills the viewport. Display headline floats over the bottom of the photo or sits in a tight band beneath, in `{typography.display-mega}` (80px / 500 / -1.6px). One primary CTA + one outline CTA. Zero padding — the photo fills edge-to-edge.

**`hero-band-light`** — White-canvas variant for editorial bands. Background `{colors.canvas-light}`, text `{colors.body-on-light}`, padding 96px.

### Cards

**`feature-card-photo`** — Image-first card. Background `{colors.canvas}`, text `{colors.ink}`, rounded `{rounded.none}`. Image fills the top edge-to-edge; title + body sit beneath in tight typography.

**`feature-card-light`** — White-canvas variant. Background `{colors.canvas-light}`, text `{colors.body-on-light}`, rounded `{rounded.none}`, padding 32px.

**`driver-card`** — F1 driver portrait card. Background `{colors.canvas-elevated}`, text `{colors.ink}`, rounded `{rounded.none}`, padding 24px. Layout: driver portrait + name + race number + team badge.

### Editorial Surfaces

**`livery-band`** — A full-width Rosso Corsa accent band. Background `{colors.primary}`, text `{colors.ink}`, type `{typography.display-lg}`, 96px padding. Used as a standout livery callout between dark editorial bands.

**`preowned-listing-card`** — Used in the preowned Ferrari listing grid. Background `{colors.canvas-light}`, text `{colors.body-on-light}`, rounded `{rounded.none}`, padding 24px. Layout: car photo top + model name + year/mileage + price.

### Spec & Race Surfaces

**`spec-cell`** — Technical spec callout. Transparent background, value in `{typography.number-display}` (80px / 700 / -1.6px white), label below in `{typography.caption-uppercase}`.

**`race-position-cell`** — F1 driver finishing position. Same number-display geometry but text in `{colors.primary}` Rosso Corsa for the brand''s racing identity.

**`race-calendar-row`** — Hairline-divided row in the F1 race calendar. Layout: date column left, race name + circuit middle, results column right.

### Forms & Tags

**`text-input-on-dark`** — Background `{colors.canvas}`, text `{colors.ink}`, rounded `{rounded.sm}` (4px), padding 14px × 16px, height 48px, 1px `{colors.hairline}` border.

**`text-input-on-light`** — White-canvas variant.

**`badge-pill`** — Small uppercase pill. Background `{colors.canvas-elevated}`, text `{colors.ink}`, type `{typography.caption-uppercase}` (11px / 600 / 1.1px tracking, uppercase), rounded `{rounded.full}` (9999px), padding 4px × 12px. The only place pill geometry is used.

### Newsletter / CTA / Footer

**`newsletter-input-band`** — Newsletter signup band. Background `{colors.canvas-elevated}`, padding 32px, rounded `{rounded.sm}`. Holds an inline email input + primary CTA.

**`cta-band-dark`** — Pre-footer band. Background `{colors.canvas}`, centered display headline in `{typography.display-lg}`, single Rosso Corsa CTA. 96px padding.

**`footer-dark`** — Closing dark footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`** — Background transparent, text `{colors.body}`, type `{typography.body-sm}`.', '{"sourcePath":"docs/design-md/ferrari/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (Rosso Corsa) for primary CTAs, the Cavallino mark, and F1 race-position highlights.
- Set every CTA at `{rounded.none}` (0px sharp corners) — the brand''s signature precision.
- Render CTA labels in uppercase with 1.4px tracking via `{typography.button}`.
- Pair every hero with a full-bleed cinematic photograph — the photograph IS the depth.
- Use the explicit 8px spacing ladder (`xxxs` through `super`) rather than ad-hoc px values.
- Keep display weight at 500 — never bold.

### Don''t
- Don''t introduce a saturated brand color other than Rosso Corsa.
- Don''t use rounded or pill CTAs — sharp 0px corners are the brand button.
- Don''t bold display copy. The cinematic photography does the visual heavy-lifting.
- Don''t use Hypersail yellow outside the Hypersail sailing program context.
- Don''t use pure black canvas. The brand canvas is `{colors.canvas}` (#181818) — slightly warm.
- Don''t add drop shadow tiers. Photography + brightness-step elevation carry the depth.
- Don''t extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand''s CTA color is what appears on actual product CTAs, not on injected modals.', '{"sourcePath":"docs/design-md/ferrari/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero photograph crops vertically; hero h1 80→32px; feature card grid 1-up; nav hamburger; preowned listing 1-up. |
| Tablet | 640–1024px | Hero h1 56px; feature card grid 2-up; preowned listing 2-up. |
| Desktop | 1024–1280px | Full hero h1 80px; feature card grid 3-up; preowned listing 4-up. |
| Wide | > 1280px | Editorial body content caps at 1280px; hero photography continues full-bleed. |

### Touch Targets
- Primary CTA at 48px height — at WCAG AAA (44 × 44).
- Nav items render uppercase with 0.65px tracking, padded for an effective 48px tap area.

### Collapsing Strategy
- Top nav switches to hamburger below 768px.
- Hero photograph reframes per breakpoint via art direction — desktop carries wide cinematic; mobile crops tighter or shifts to vertical.
- Feature card grid: 4-up → 3-up → 2-up → 1-up.
- F1 driver cards: 2-up at desktop, 1-up at mobile.', '{"sourcePath":"docs/design-md/ferrari/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `{rounded.none}` (0px sharp). Cards use `{rounded.none}` too. Pill is reserved for badges.
3. Variants live as separate entries inside `components:`.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented.
6. FerrariSans 500 for display, 400/700 for body. Uppercase + tracking on CTAs and nav.
7. Rosso Corsa stays scarce — primary CTAs, Cavallino, race-position highlights only.
8. Use the explicit 8px named spacing ladder.', '{"sourcePath":"docs/design-md/ferrari/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- FerrariSans is a licensed typeface; Inter at weight 500 is the documented substitute.
- Animation timings (hero parallax, livery band entrance, race position counter) out of scope.
- In-product surfaces (preowned configurator, F1 telemetry overlays) only partially captured via marketing surfaces.
- Form validation states beyond focus not visible on captured surfaces.
- Hypersail yellow tokens are extracted but only appear in the Hypersail sailing program context — documented as scoped accents.', '{"sourcePath":"docs/design-md/ferrari/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_1', '#181818', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_2', '#da291c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_3', '#b01e0a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_4', '#9d2211', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_5', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_6', '#969696', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_7', '#666666', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_8', '#8f8f8f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_9', '#303030', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_10', '#d2d2d2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_11', '#ebebeb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_12', '#f7f7f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_13', '#fff200', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_14', '#f6e500', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_15', '#4c98b9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_16', '#03904a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_17', '#f13a2c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_18', '#a00c01', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_19', '#3c3c3c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'color', 'color_20', '#030303', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md'), 'typography', 'font_1', 'fontFamily: "''FerrariSans'', sans-serif', 'primary_detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/ferrari/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/ferrari/DESIGN.md';


-- Figma
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Figma', 'figma', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/figma/DESIGN.md', null, 'seeded', '---
version: alpha
name: Figma-design-analysis
description: "A confident black-and-white editorial frame interrupted by oversized, hand-cut pastel color blocks. The marketing canvas is rigorously monochrome — figmaSans variable type, pure white surfaces, pure black ink, pill-shaped CTAs — while each story section drops the page into a saturated lime, lavender, cream, mint, or pink panel that reads like a sticky note placed on a clean desk. The result is a design system that feels both technical and joyful — a tool for serious work, made by people who like color."

colors:
  primary: "#000000"
  on-primary: "#ffffff"
  ink: "#000000"
  canvas: "#ffffff"
  inverse-canvas: "#000000"
  inverse-ink: "#ffffff"
  on-inverse-soft: "#ffffff"
  hairline: "#e6e6e6"
  hairline-soft: "#f1f1f1"
  surface-soft: "#f7f7f5"
  block-lime: "#dceeb1"
  block-lilac: "#c5b0f4"
  block-cream: "#f4ecd6"
  block-pink: "#efd4d4"
  block-mint: "#c8e6cd"
  block-coral: "#f3c9b6"
  block-navy: "#1f1d3d"
  accent-magenta: "#ff3d8b"
  semantic-success: "#1ea64a"
  overlay-scrim: "#000000"

typography:
  display-xl:
    fontFamily: figmaSans
    fontSize: 86px
    fontWeight: 340
    lineHeight: 1.00
    letterSpacing: -1.72px
    fontFeature: kern
  display-lg:
    fontFamily: figmaSans
    fontSize: 64px
    fontWeight: 340
    lineHeight: 1.10
    letterSpacing: -0.96px
    fontFeature: kern
  headline:
    fontFamily: figmaSans
    fontSize: 26px
    fontWeight: 540
    lineHeight: 1.35
    letterSpacing: -0.26px
    fontFeature: kern
  subhead:
    fontFamily: figmaSans
    fontSize: 26px
    fontWeight: 340
    lineHeight: 1.35
    letterSpacing: -0.26px
    fontFeature: kern
  card-title:
    fontFamily: figmaSans
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: 0
    fontFeature: kern
  body-lg:
    fontFamily: figmaSans
    fontSize: 20px
    fontWeight: 330
    lineHeight: 1.40
    letterSpacing: -0.14px
    fontFeature: kern
  body:
    fontFamily: figmaSans
    fontSize: 18px
    fontWeight: 320
    lineHeight: 1.45
    letterSpacing: -0.26px
    fontFeature: kern
  body-sm:
    fontFamily: figmaSans
    fontSize: 16px
    fontWeight: 330
    lineHeight: 1.45
    letterSpacing: -0.14px
    fontFeature: kern
  link:
    fontFamily: figmaSans
    fontSize: 20px
    fontWeight: 480
    lineHeight: 1.40
    letterSpacing: -0.10px
    fontFeature: kern
  button:
    fontFamily: figmaSans
    fontSize: 20px
    fontWeight: 480
    lineHeight: 1.40
    letterSpacing: -0.10px
    fontFeature: kern
  eyebrow:
    fontFamily: figmaMono
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.30
    letterSpacing: 0.54px
    fontFeature: kern
  caption:
    fontFamily: figmaMono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.00
    letterSpacing: 0.60px
    fontFeature: kern

rounded:
  xs: 2px
  sm: 6px
  md: 8px
  lg: 24px
  xl: 32px
  pill: 50px
  full: 9999px

spacing:
  hair: 1px
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
    rounded: "{rounded.pill}"
    padding: 10px 20px
  button-primary-pressed:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 18px 10px
  button-tertiary-text:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.link}"
    rounded: "{rounded.full}"
    padding: 8px 12px
  button-icon-circular:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    size: 40px
  button-icon-circular-inverse:
    backgroundColor: "{colors.on-inverse-soft}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    size: 40px
  button-magenta-promo:
    backgroundColor: "{colors.accent-magenta}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 10px 18px
  pricing-tab-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 18px
  pricing-tab-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 18px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px 14px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px 14px
  pricing-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-card-feature-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
  color-block-section:
    backgroundColor: "{colors.block-lime}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.lg}"
    padding: 48px
  color-block-section-lilac:
    backgroundColor: "{colors.block-lilac}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.lg}"
    padding: 48px
  color-block-section-navy:
    backgroundColor: "{colors.block-navy}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.lg}"
    padding: 48px
  promo-banner-lilac:
    backgroundColor: "{colors.block-lilac}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px 24px
  template-card:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  feature-illustration-tile:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.md}"
    padding: 24px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 56px
  marquee-strip:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 36px
  comparison-checkmark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.semantic-success}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    size: 16px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
---

## Overview

Figma''s marketing canvas is, at the system level, an editor-clean black-and-white frame. The chrome — top nav, body type, footer, primary CTA — is monochrome. Headlines are oversized `{typography.display-xl}` set in `figmaSans` with aggressive negative tracking, body copy hovers around weight 320–340 of the same variable family, and small mono `{typography.eyebrow}` and `{typography.caption}` labels (figmaMono, all-caps, positive tracking) act as section markers. Every CTA is a pill — `{rounded.pill}` — and the primary action across the entire site is the same black `{components.button-primary}` paired with the same white `{components.button-secondary}`.

What makes the design unique is what happens **between** those monochrome bookends: the page repeatedly drops into oversized pastel **color-block sections** — lime, lavender, cream, mint, pink, coral, and a deep navy — that span the full content width with `{rounded.lg}` corners and `{spacing.xxl}` interior padding. These blocks are where the storytelling lives. They aren''t accents tucked into a card; they take over a whole viewport''s worth of vertical space, like a designer arranging giant sticky notes on a clean wall. FigJam is the most pastel-saturated, the home page rotates through the full set, and the pricing page ends with a lime FAQ panel — same vocabulary, different rhythm per route.

This is a system built on contrast: the monochrome chrome makes the color blocks feel intentional rather than decorative, and the color blocks make the monochrome chrome feel like editorial paper rather than enterprise SaaS. Density is generous, line-heights are tight on display sizes, and the interface never reaches for shadows or gradients to do the work that color blocks and confident typography already do.

**Key Characteristics:**
- Monochrome system core: `{colors.primary}` (black) and `{colors.canvas}` (white) carry every CTA, every body line, every footer link.
- Oversized pastel **color-block sections** (`{colors.block-lime}`, `{colors.block-lilac}`, `{colors.block-cream}`, `{colors.block-mint}`, `{colors.block-pink}`, `{colors.block-coral}`, `{colors.block-navy}`) define the narrative rhythm of every long-form page.
- Pill is the only button shape — `{rounded.pill}` for text CTAs, `{rounded.full}` for icon buttons. No square buttons anywhere.
- `figmaSans` variable typeface used at unusually fine weight increments (320, 330, 340, 450, 480, 540) — the type system reads as a single voice that flexes rather than a multi-weight family.
- Tight negative letter-spacing on display sizes (-1.72px at 86px, -0.96px at 64px) creates a confident editorial cadence.
- `figmaMono` reserved for category labels, eyebrows, and captions — always uppercase, positive tracking — to flag taxonomy without competing with display type.
- Color-block page rhythm (home): white hero → marquee strip → white feature → lime systems block → navy ship-products block → coral developer block → white template grid → white footer.

## Colors

> Source pages: figma.com (home), /design/, /figjam/brainstorming-tool/, /pricing/, /contact/.

### Brand & Accent
- **Black** ({colors.primary}): The system primary. Every primary CTA, every headline, every body line, the marquee strip, the inverse canvas of dark sections.
- **White** ({colors.on-primary}): Inverse text on black surfaces; also the canvas color used as the foreground of secondary pill buttons (`{components.button-secondary}`).
- **Magenta Promo** ({colors.accent-magenta}): A single saturated CTA pink reserved for promotional inline buttons — appears, for example, on the lilac "Save your spot" Release Notes banner. Use scarcely; it is not a section color.

### Surface
- **Canvas** ({colors.canvas}): Default page background and the body of every white card.
- **Inverse Canvas** ({colors.inverse-canvas}): Footer, marquee strip, and a subset of "ship products"-style story sections.
- **Surface Soft** ({colors.surface-soft}): Off-white tile background used for icon buttons, template cards, and feature illustration tiles when they sit on the white canvas.
- **Hairline** ({colors.hairline}): 1px borders on form inputs, pricing cards, and table dividers.
- **Hairline Soft** ({colors.hairline-soft}): Even subtler dividers — comparison-table row separators and footer column rules.
- **Block Lime** ({colors.block-lime}): The signature **systems / FAQ / contact-form** color block. Recurs across home, pricing, contact.
- **Block Lilac** ({colors.block-lilac}): Hero block on `/design/`; also the inline Release Notes promo banner.
- **Block Cream** ({colors.block-cream}): Soft warm background — FigJam hero strip, template-grid section.
- **Block Mint** ({colors.block-mint}): FigJam pastel section.
- **Block Pink** ({colors.block-pink}): FigJam pastel section.
- **Block Coral** ({colors.block-coral}): "Ship products" coral story block on home.
- **Block Navy** ({colors.block-navy}): Deep indigo story block — only place dark surfaces appear above the footer.

### Text
- **Ink** ({colors.ink}): All headline, body, and caption type on light surfaces. There is no softer mid-gray text role on marketing — body copy is always black at weight 320–340, and weight (not opacity) carries the hierarchy.
- **Inverse Ink** ({colors.inverse-ink}): Type on inverse-canvas surfaces (footer, marquee strip, navy color block).
- **On-Inverse Soft** ({colors.on-inverse-soft}): White used at ~16% opacity for circular icon-button surfaces against dark sections (token captures the base color; the translucency is applied at render time).

### Semantic
- **Success Green** ({colors.semantic-success}): Comparison-table checkmarks on pricing. Used as a glyph fill, not a surface.
- **Overlay Scrim** ({colors.overlay-scrim}): Black used at ~60% opacity behind modal / video-overlay surfaces (token captures the base; opacity applied at render time).

## Typography

### Font Family

- **figmaSans** — Figma''s proprietary variable typeface; fallback stack `figmaSans Fallback, SF Pro Display, system-ui, helvetica`. Variable weight axis is exercised at unusually fine increments (320, 330, 340, 450, 480, 540, 700) — the design system reads as a single voice modulating rather than a stepped weight family.
- **figmaMono** — Proprietary monospace; fallback `figmaMono Fallback, SF Mono, menlo`. Used exclusively for eyebrow labels and captions, always uppercase with positive letter-spacing.

OpenType `kern` is enabled across every role.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 86px | 340 | 1.00 | -1.72px | Hero headlines (home, FigJam) |
| `{typography.display-lg}` | 64px | 340 | 1.10 | -0.96px | Section opener headlines |
| `{typography.headline}` | 26px | 540 | 1.35 | -0.26px | Story-block titles inside color blocks |
| `{typography.subhead}` | 26px | 340 | 1.35 | -0.26px | Long-form intro paragraphs that sit at near-headline scale |
| `{typography.card-title}` | 24px | 700 | 1.45 | 0 | Pricing-tier titles, feature card titles |
| `{typography.body-lg}` | 20px | 330 | 1.40 | -0.14px | Lead body copy on hero, contact form labels |
| `{typography.body}` | 18px | 320 | 1.45 | -0.26px | Default body |
| `{typography.body-sm}` | 16px | 330 | 1.45 | -0.14px | Card body, footer link list |
| `{typography.link}` | 20px | 480 | 1.40 | -0.10px | Inline link emphasis |
| `{typography.button}` | 20px | 480 | 1.40 | -0.10px | All pill buttons, primary and secondary |
| `{typography.eyebrow}` | 18px | 400 | 1.30 | 0.54px | figmaMono uppercase section eyebrows |
| `{typography.caption}` | 12px | 400 | 1.00 | 0.60px | figmaMono uppercase captions, footer column heads |

### Principles

- **Weight, not size, carries hierarchy on body copy.** A 20px paragraph at weight 330 sits next to a 20px link at weight 480 — the eye reads emphasis without scale change.
- **Negative letter-spacing scales with size.** Display-xl pulls -1.72px; subhead pulls only -0.26px. Body copy stays near-zero. The result is editorial-feeling display type without sacrificing readability at body size.
- **Mono is taxonomy, not body.** figmaMono is reserved for eyebrows and captions — never used to set a paragraph.
- **Tight line-heights on display, generous on body.** Display sizes run 1.00–1.10; body runs 1.40–1.45. The contrast reinforces that headlines are graphics and body copy is for reading.

### Note on Font Substitutes

If implementing without access to figmaSans / figmaMono, suitable open-source substitutes are **Inter** (or **Geist**) for the sans, and **JetBrains Mono** (or **Geist Mono**) for the mono. Inter at variable weights closely matches the fine-grained weight axis figmaSans uses; expect to manually adjust line-heights down by ~0.02 to compensate for Inter''s slightly taller x-height.

## Layout

### Spacing System

- **Base unit**: 8px.
- **Tokens (front matter)**: `{spacing.hair}` 1px · `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Section interior padding: `{spacing.xxl}` (48px) on color-block sections.
- Card interior padding: `{spacing.lg}` (24px) on pricing cards and template tiles.
- Form input padding: `{spacing.sm}` 12px vertical · 14px horizontal.
- Button padding: `{spacing.xs}` 8px vertical · `{spacing.lg}` 24px horizontal for pill buttons (the asymmetric `8px 18px 10px` extracted on `button-secondary` nudges the type optically inside the pill).
- Universal rhythm constant: `{spacing.section}` (96px) — the vertical gap between major content sections holds across home, pricing, and FigJam pages.

### Grid & Container

- Max content width sits around 1280px (one of the explicit breakpoints), with side gutters that scale from `{spacing.xxl}` on desktop down to `{spacing.lg}` on mobile.
- Three- and four-column grids on the desktop pricing comparison and FigJam template galleries.
- Color-block sections break the column grid — they span content width with full bleed inside the rounded `{rounded.lg}` corners, then place a single editorial column of headline + body inside.

### Whitespace Philosophy

White space is used to make the color blocks feel deliberate. Between every colored panel and the next, the page returns to white canvas with `{spacing.section}` of breathing room. Inside a color block, the type itself is given generous side margins (often more than 1/4 of the block''s width on each side) so the panel reads as a poster, not a wall of copy.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for color-block sections, inverse-canvas footer, hero |
| 1 (hairline) | 1px `{colors.hairline}` border on `{colors.canvas}` | Pricing cards, form inputs, comparison table cells |
| 2 (soft elevation) | Subtle drop shadow approx 0 4px 16px rgba(0,0,0,0.06) | Floating template tiles, dropdown menus |
| 3 (modal) | Stronger shadow + `{colors.overlay-scrim}` behind | Video / image lightbox overlays |

Figma''s marketing system is shadow-light by design — the color blocks substitute for traditional elevation. Where most SaaS sites use a shadowed white card to draw attention, Figma uses a saturated background panel. This makes the rare actual shadow (e.g., a floating template card hovering over a cream section) feel like an exception worth noticing.

### Decorative Depth

- **Color-block sections** are the primary depth device. The change from white canvas to lime / lavender / cream is the section break.
- **Sticky-note style component thumbnails** in FigJam — slightly off-axis pastel rectangles arranged like notes on a board — read as collage, not card-stack.
- **Embedded product UI mocks** (Figma Design panels, FigJam canvas snippets) appear as flat compositions on color blocks; their internal shadows are subtle and stay within the mock.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 2px | Anchor / link decoration corners |
| `{rounded.sm}` | 6px | Small chips, sub-nav tabs |
| `{rounded.md}` | 8px | Form inputs, list items, image frames |
| `{rounded.lg}` | 24px | Pricing cards, color-block sections, large image containers |
| `{rounded.xl}` | 32px | Hero feature panels, oversized callouts |
| `{rounded.pill}` | 50px | All text CTAs (primary, secondary, tab toggles) |
| `{rounded.full}` | 9999px | Circular icon buttons, comparison-table checkmark glyphs |

### Photography & Illustration Geometry

- Image frames use `{rounded.md}` (8px) — generous enough to feel friendly, conservative enough to read as editorial.
- Template thumbnails on the home grid sit in `{rounded.md}` tiles with `{spacing.md}` interior padding around the embedded preview.
- FigJam pastel sticky-note component thumbnails preserve a small `{rounded.sm}` corner that mimics actual sticky paper.
- No avatar circles appear in marketing surfaces — Figma''s marketing avoids personification.

## Components

### Buttons

**`button-primary`** — The black "Get started for free" pill that appears in the top nav, every hero, and every closing CTA.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 10px 20px, rounded `{rounded.pill}`.
- Pressed state lives in `button-primary-pressed` (same surface; the live site relies on micro-scale rather than a darkened fill).

**`button-secondary`** — White pill with black text. Used for tertiary navigation actions ("Contact sales") and as the visual counterpart to the primary pill.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, padding 8px 18px 10px (asymmetric vertical to optically center the type), rounded `{rounded.pill}`. No border.

**`button-tertiary-text`** — Plain text link styled as a button hit target inside top nav and footer.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.link}`, rounded `{rounded.full}` (hit target only), padding `{spacing.xs}` `{spacing.sm}`.

**`button-icon-circular`** — 40px circular icon button used for carousel controls, social links, and inline actions on light surfaces.
- Background `{colors.surface-soft}`, text `{colors.ink}`, rounded `{rounded.full}`, size 40px.

**`button-icon-circular-inverse`** — Same shape, used on inverse-canvas / dark color blocks.
- Background `{colors.on-inverse-soft}` (translucent white), text `{colors.inverse-ink}`, rounded `{rounded.full}`, size 40px.

**`button-magenta-promo`** — Saturated pink pill used only inside promotional surfaces such as the lilac "Save your spot" Release Notes banner. Reserved for moments where Figma''s product team wants the CTA to pop against an already-colored panel.
- Background `{colors.accent-magenta}`, text `{colors.on-primary}`, type `{typography.button}`, rounded `{rounded.pill}`, padding 10px 18px.

### Pricing Tabs

**`pricing-tab-default`** + **`pricing-tab-selected`** — The pill-toggle that switches between Starter / Professional / Organization / Enterprise on `/pricing/`.
- Default: `{colors.canvas}` background, `{colors.ink}` text, rounded `{rounded.pill}`.
- Selected: `{colors.primary}` background, `{colors.on-primary}` text — exactly the same surface as `button-primary`, which makes the selected tab feel like an active CTA, not a passive state.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on `/contact/` and pricing seat-count steppers.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 12px 14px.
- Focused state retains the same surface — focus is communicated via ring, not via fill change.

### Cards & Containers

**`pricing-card`** — Each tier on `/pricing/`.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding `{spacing.lg}`. Stroked with `{colors.hairline}` rather than shadowed.

**`pricing-card-feature-row`** — Single row inside the comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`. Row separator is `{colors.hairline-soft}`.

**`template-card`** — Thumbnail tile in the home "Explore what people are making" grid and the FigJam template gallery.
- Background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`feature-illustration-tile`** — Larger composition tile that holds a product UI mock or pastel illustration.
- Background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.eyebrow}`, rounded `{rounded.md}`, padding `{spacing.lg}`.

### Color-Block Sections (signature)

The defining surface of Figma''s marketing. Each is a full-content-width panel with `{rounded.lg}` corners and `{spacing.xxl}` interior padding. Variants:

**`color-block-section`** — lime ground for "systems" stories (home), pricing FAQ, and the contact form.
- Background `{colors.block-lime}`, text `{colors.ink}`, type `{typography.subhead}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`color-block-section-lilac`** — lavender ground for `/design/` hero and FigJam highlight sections.
- Background `{colors.block-lilac}`, otherwise identical structure.

**`color-block-section-navy`** — deep indigo ground for the home "Ship products" story block. The only inverse color-block surface above the footer.
- Background `{colors.block-navy}`, text `{colors.inverse-ink}`, otherwise identical structure.

(Cream, mint, pink, and coral block variants follow the same shape with their respective `{colors.block-*}` surface.)

### Promo Banner

**`promo-banner-lilac`** — The Release Notes / "Save your spot" inline banner that floats above the contact form.
- Background `{colors.block-lilac}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.md}`, padding `{spacing.md}` `{spacing.lg}`. Carries a `button-magenta-promo` on the right edge.

### Navigation

**`top-nav`** — Sticky white bar with logo, primary nav links, sign-in link, and the right-anchored `button-secondary` ("Contact sales") + `button-primary` ("Get started for free") pair.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 56px.
- Mobile: collapses primary links into a hamburger that opens a full-canvas overlay; the two pill CTAs remain visible on the bar.

**`marquee-strip`** — Thin black ribbon directly under the nav that scrolls through customer logos in white.
- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink}`, type `{typography.body-sm}`, height 36px.

### Comparison Glyphs

**`comparison-checkmark`** — Green check used in the pricing comparison matrix.
- Background `{colors.canvas}`, glyph color `{colors.semantic-success}`, rounded `{rounded.full}`, size 16px.

### Footer

**`footer`** — Dense link grid on white canvas with the wordmark "Figma" set in display weight at the top-left.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.caption}` for column headings and small links, padding `{spacing.section}` top/bottom · `{spacing.xl}` sides.

## Do''s and Don''ts

### Do

- Reserve `{colors.primary}` for genuine primary CTAs and selected states (e.g., `pricing-tab-selected`). Don''t use it as a decorative accent.
- When introducing a story section, choose **one** color block from the `{colors.block-*}` family and let it span full content width with `{rounded.lg}` corners and `{spacing.xxl}` interior padding.
- Keep type in `figmaSans` at variable weights — pick from 320, 330, 340, 480, 540, 700 to express hierarchy. Avoid intermediate weights outside this set.
- Use `figmaMono` only for eyebrows and captions, always uppercase, with the documented positive letter-spacing.
- Compose every CTA as a pill (`{rounded.pill}`) and every icon button as a circle (`{rounded.full}`).
- Allow the page to **return to white canvas** between every two color blocks so each block reads as deliberate.
- Pair `button-primary` and `button-secondary` whenever a section needs both a primary action and a sales / secondary action — the black-and-white pair is the brand signature.

### Don''t

- Don''t introduce mid-gray text. Body hierarchy comes from `figmaSans` weight, not from opacity.
- Don''t add drop shadows to color-block sections — the color is the depth device.
- Don''t introduce new accent colors outside the documented `{colors.block-*}` palette and `{colors.accent-magenta}`. Adding, e.g., a saturated brand orange would break the system.
- Don''t combine more than one color block visible inside a single viewport — Figma''s pacing always lets the white canvas separate them.
- Don''t square off CTAs. Square buttons read as a different brand.
- Don''t put `figmaMono` in body copy — it''s a taxonomy tool, not a reading typeface.
- Don''t replace the `pricing-tab-selected` black fill with a colored tab; the brand pattern is "selected = primary surface".

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| 4k | 1920px | Max content width holds at 1280px; gutters expand |
| Desktop-XL | 1440px | Default desktop layout |
| Desktop | 1400px | Comparison table column widths normalize |
| Desktop-S | 1280px | Pricing 4-up tier grid maintained |
| Tablet | 960px | Pricing collapses 4-up → 2-up; nav becomes hamburger |
| Mobile-L | 768px | Color-block sections become full-bleed (no rounded corners on edges) |
| Mobile | 560px | Display-xl reduces from 86px to ~48px; pill CTAs go full-width |
| Mobile-XS | 559px | Two-column footer collapses to single column |

### Touch Targets

- Pill buttons (`button-primary`, `button-secondary`) maintain a minimum 44px tap height across all viewports — achieved by combining `{typography.button}` 20px line-height with the documented vertical padding.
- Circular icon buttons (`button-icon-circular`) are 40px on desktop and grow to 44px on touch viewports.
- Form input minimum tap target on `/contact/` is 48px high.

### Collapsing Strategy

- **Nav**: desktop horizontal nav with two right-anchored pills collapses to a hamburger overlay below 960px. The two pills (`Contact sales`, `Get started for free`) stay visible on the bar above 560px and stack in the overlay below.
- **Pricing tier grid**: 4-up → 2-up at 960px → 1-up below 768px. The pill toggle stays horizontal and scrolls horizontally if needed below 560px.
- **Color-block sections**: above 768px the section keeps `{spacing.xxl}` of canvas around it so the rounded corners read; below 768px the corners are removed and the block bleeds to viewport edge for a poster effect.
- **Comparison table**: below 960px the matrix collapses into per-tier accordions to avoid horizontal scroll.

### Image Behavior

- Product UI mocks inside color blocks scale proportionally and never crop. Below 768px they shrink rather than reflow.
- Template thumbnails in the home grid use lazy loading and animate in on scroll.
- Sticky-note style FigJam thumbnails maintain their slight off-axis rotation across breakpoints — the rotation is a brand signal, not a desktop-only flourish.

## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name (e.g., `{components.button-primary}`, `{components.color-block-section}`).
2. When introducing a new section, decide **first** which `{colors.block-*}` token it sits on; the surface choice is the most consequential decision.
3. Default body type to `{typography.body}`; reach for `{typography.subhead}` or `{typography.headline}` only inside a color block.
4. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
5. Add new variants as separate component entries (`-pressed`, `-selected`) — do not bury them in prose.
6. Keep `{colors.primary}` scarce. If two `button-primary` instances appear in the same viewport, the section is doing too much — neutralize one to `button-secondary`.
7. Treat `{colors.accent-magenta}` as a single-shot color: one promo CTA per page, never two.

## Known Gaps

- The exact pastel hex values of `{colors.block-*}` are derived from screenshot pixels; the production source likely uses named tokens that aren''t exposed via CSS variables. Treat the documented hex values as faithful approximations rather than exact brand specs.
- Dark mode is not documented because the marketing site does not ship a dark theme — the closest analog is the navy color-block (`color-block-section-navy`) and the inverse-canvas footer.
- Form-field error and validation styling is not visible on `/contact/` because no error states render in the static screenshot. Inputs have hairline borders and rounded `{rounded.md}` corners; error treatment is not documented.
- The animated marquee-strip and color-block reveal animations are not documented (per the no-interaction policy).
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

Figma''s marketing canvas is, at the system level, an editor-clean black-and-white frame. The chrome — top nav, body type, footer, primary CTA — is monochrome. Headlines are oversized `{typography.display-xl}` set in `figmaSans` with aggressive negative tracking, body copy hovers around weight 320–340 of the same variable family, and small mono `{typography.eyebrow}` and `{typography.caption}` labels (figmaMono, all-caps, positive tracking) act as section markers. Every CTA is a pill — `{rounded.pill}` — and the primary action across the entire site is the same black `{components.button-primary}` paired with the same white `{components.button-secondary}`.

What makes the design unique is what happens **between** those monochrome bookends: the page repeatedly drops into oversized pastel **color-block sections** — lime, lavender, cream, mint, pink, coral, and a deep navy — that span the full content width with `{rounded.lg}` corners and `{spacing.xxl}` interior padding. These blocks are where the storytelling lives. They aren''t accents tucked into a card; they take over a whole viewport''s worth of vertical space, like a designer arranging giant sticky notes on a clean wall. FigJam is the most pastel-saturated, the home page rotates through the full set, and the pricing page ends with a lime FAQ panel — same vocabulary, different rhythm per route.

This is a system built on contrast: the monochrome chrome makes the color blocks feel intentional rather than decorative, and the color blocks make the monochrome chrome feel like editorial paper rather than enterprise SaaS. Density is generous, line-heights are tight on display sizes, and the interface never reaches for shadows or gradients to do the work that color blocks and confident typography already do.

**Key Characteristics:**
- Monochrome system core: `{colors.primary}` (black) and `{colors.canvas}` (white) carry every CTA, every body line, every footer link.
- Oversized pastel **color-block sections** (`{colors.block-lime}`, `{colors.block-lilac}`, `{colors.block-cream}`, `{colors.block-mint}`, `{colors.block-pink}`, `{colors.block-coral}`, `{colors.block-navy}`) define the narrative rhythm of every long-form page.
- Pill is the only button shape — `{rounded.pill}` for text CTAs, `{rounded.full}` for icon buttons. No square buttons anywhere.
- `figmaSans` variable typeface used at unusually fine weight increments (320, 330, 340, 450, 480, 540) — the type system reads as a single voice that flexes rather than a multi-weight family.
- Tight negative letter-spacing on display sizes (-1.72px at 86px, -0.96px at 64px) creates a confident editorial cadence.
- `figmaMono` reserved for category labels, eyebrows, and captions — always uppercase, positive tracking — to flag taxonomy without competing with display type.
- Color-block page rhythm (home): white hero → marquee strip → white feature → lime systems block → navy ship-products block → coral developer block → white template grid → white footer.', '{"sourcePath":"docs/design-md/figma/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: figma.com (home), /design/, /figjam/brainstorming-tool/, /pricing/, /contact/.

### Brand & Accent
- **Black** ({colors.primary}): The system primary. Every primary CTA, every headline, every body line, the marquee strip, the inverse canvas of dark sections.
- **White** ({colors.on-primary}): Inverse text on black surfaces; also the canvas color used as the foreground of secondary pill buttons (`{components.button-secondary}`).
- **Magenta Promo** ({colors.accent-magenta}): A single saturated CTA pink reserved for promotional inline buttons — appears, for example, on the lilac "Save your spot" Release Notes banner. Use scarcely; it is not a section color.

### Surface
- **Canvas** ({colors.canvas}): Default page background and the body of every white card.
- **Inverse Canvas** ({colors.inverse-canvas}): Footer, marquee strip, and a subset of "ship products"-style story sections.
- **Surface Soft** ({colors.surface-soft}): Off-white tile background used for icon buttons, template cards, and feature illustration tiles when they sit on the white canvas.
- **Hairline** ({colors.hairline}): 1px borders on form inputs, pricing cards, and table dividers.
- **Hairline Soft** ({colors.hairline-soft}): Even subtler dividers — comparison-table row separators and footer column rules.
- **Block Lime** ({colors.block-lime}): The signature **systems / FAQ / contact-form** color block. Recurs across home, pricing, contact.
- **Block Lilac** ({colors.block-lilac}): Hero block on `/design/`; also the inline Release Notes promo banner.
- **Block Cream** ({colors.block-cream}): Soft warm background — FigJam hero strip, template-grid section.
- **Block Mint** ({colors.block-mint}): FigJam pastel section.
- **Block Pink** ({colors.block-pink}): FigJam pastel section.
- **Block Coral** ({colors.block-coral}): "Ship products" coral story block on home.
- **Block Navy** ({colors.block-navy}): Deep indigo story block — only place dark surfaces appear above the footer.

### Text
- **Ink** ({colors.ink}): All headline, body, and caption type on light surfaces. There is no softer mid-gray text role on marketing — body copy is always black at weight 320–340, and weight (not opacity) carries the hierarchy.
- **Inverse Ink** ({colors.inverse-ink}): Type on inverse-canvas surfaces (footer, marquee strip, navy color block).
- **On-Inverse Soft** ({colors.on-inverse-soft}): White used at ~16% opacity for circular icon-button surfaces against dark sections (token captures the base color; the translucency is applied at render time).

### Semantic
- **Success Green** ({colors.semantic-success}): Comparison-table checkmarks on pricing. Used as a glyph fill, not a surface.
- **Overlay Scrim** ({colors.overlay-scrim}): Black used at ~60% opacity behind modal / video-overlay surfaces (token captures the base; opacity applied at render time).', '{"sourcePath":"docs/design-md/figma/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

- **figmaSans** — Figma''s proprietary variable typeface; fallback stack `figmaSans Fallback, SF Pro Display, system-ui, helvetica`. Variable weight axis is exercised at unusually fine increments (320, 330, 340, 450, 480, 540, 700) — the design system reads as a single voice modulating rather than a stepped weight family.
- **figmaMono** — Proprietary monospace; fallback `figmaMono Fallback, SF Mono, menlo`. Used exclusively for eyebrow labels and captions, always uppercase with positive letter-spacing.

OpenType `kern` is enabled across every role.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 86px | 340 | 1.00 | -1.72px | Hero headlines (home, FigJam) |
| `{typography.display-lg}` | 64px | 340 | 1.10 | -0.96px | Section opener headlines |
| `{typography.headline}` | 26px | 540 | 1.35 | -0.26px | Story-block titles inside color blocks |
| `{typography.subhead}` | 26px | 340 | 1.35 | -0.26px | Long-form intro paragraphs that sit at near-headline scale |
| `{typography.card-title}` | 24px | 700 | 1.45 | 0 | Pricing-tier titles, feature card titles |
| `{typography.body-lg}` | 20px | 330 | 1.40 | -0.14px | Lead body copy on hero, contact form labels |
| `{typography.body}` | 18px | 320 | 1.45 | -0.26px | Default body |
| `{typography.body-sm}` | 16px | 330 | 1.45 | -0.14px | Card body, footer link list |
| `{typography.link}` | 20px | 480 | 1.40 | -0.10px | Inline link emphasis |
| `{typography.button}` | 20px | 480 | 1.40 | -0.10px | All pill buttons, primary and secondary |
| `{typography.eyebrow}` | 18px | 400 | 1.30 | 0.54px | figmaMono uppercase section eyebrows |
| `{typography.caption}` | 12px | 400 | 1.00 | 0.60px | figmaMono uppercase captions, footer column heads |

### Principles

- **Weight, not size, carries hierarchy on body copy.** A 20px paragraph at weight 330 sits next to a 20px link at weight 480 — the eye reads emphasis without scale change.
- **Negative letter-spacing scales with size.** Display-xl pulls -1.72px; subhead pulls only -0.26px. Body copy stays near-zero. The result is editorial-feeling display type without sacrificing readability at body size.
- **Mono is taxonomy, not body.** figmaMono is reserved for eyebrows and captions — never used to set a paragraph.
- **Tight line-heights on display, generous on body.** Display sizes run 1.00–1.10; body runs 1.40–1.45. The contrast reinforces that headlines are graphics and body copy is for reading.

### Note on Font Substitutes

If implementing without access to figmaSans / figmaMono, suitable open-source substitutes are **Inter** (or **Geist**) for the sans, and **JetBrains Mono** (or **Geist Mono**) for the mono. Inter at variable weights closely matches the fine-grained weight axis figmaSans uses; expect to manually adjust line-heights down by ~0.02 to compensate for Inter''s slightly taller x-height.', '{"sourcePath":"docs/design-md/figma/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System

- **Base unit**: 8px.
- **Tokens (front matter)**: `{spacing.hair}` 1px · `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Section interior padding: `{spacing.xxl}` (48px) on color-block sections.
- Card interior padding: `{spacing.lg}` (24px) on pricing cards and template tiles.
- Form input padding: `{spacing.sm}` 12px vertical · 14px horizontal.
- Button padding: `{spacing.xs}` 8px vertical · `{spacing.lg}` 24px horizontal for pill buttons (the asymmetric `8px 18px 10px` extracted on `button-secondary` nudges the type optically inside the pill).
- Universal rhythm constant: `{spacing.section}` (96px) — the vertical gap between major content sections holds across home, pricing, and FigJam pages.

### Grid & Container

- Max content width sits around 1280px (one of the explicit breakpoints), with side gutters that scale from `{spacing.xxl}` on desktop down to `{spacing.lg}` on mobile.
- Three- and four-column grids on the desktop pricing comparison and FigJam template galleries.
- Color-block sections break the column grid — they span content width with full bleed inside the rounded `{rounded.lg}` corners, then place a single editorial column of headline + body inside.

### Whitespace Philosophy

White space is used to make the color blocks feel deliberate. Between every colored panel and the next, the page returns to white canvas with `{spacing.section}` of breathing room. Inside a color block, the type itself is given generous side margins (often more than 1/4 of the block''s width on each side) so the panel reads as a poster, not a wall of copy.', '{"sourcePath":"docs/design-md/figma/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for color-block sections, inverse-canvas footer, hero |
| 1 (hairline) | 1px `{colors.hairline}` border on `{colors.canvas}` | Pricing cards, form inputs, comparison table cells |
| 2 (soft elevation) | Subtle drop shadow approx 0 4px 16px rgba(0,0,0,0.06) | Floating template tiles, dropdown menus |
| 3 (modal) | Stronger shadow + `{colors.overlay-scrim}` behind | Video / image lightbox overlays |

Figma''s marketing system is shadow-light by design — the color blocks substitute for traditional elevation. Where most SaaS sites use a shadowed white card to draw attention, Figma uses a saturated background panel. This makes the rare actual shadow (e.g., a floating template card hovering over a cream section) feel like an exception worth noticing.

### Decorative Depth

- **Color-block sections** are the primary depth device. The change from white canvas to lime / lavender / cream is the section break.
- **Sticky-note style component thumbnails** in FigJam — slightly off-axis pastel rectangles arranged like notes on a board — read as collage, not card-stack.
- **Embedded product UI mocks** (Figma Design panels, FigJam canvas snippets) appear as flat compositions on color blocks; their internal shadows are subtle and stay within the mock.', '{"sourcePath":"docs/design-md/figma/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 2px | Anchor / link decoration corners |
| `{rounded.sm}` | 6px | Small chips, sub-nav tabs |
| `{rounded.md}` | 8px | Form inputs, list items, image frames |
| `{rounded.lg}` | 24px | Pricing cards, color-block sections, large image containers |
| `{rounded.xl}` | 32px | Hero feature panels, oversized callouts |
| `{rounded.pill}` | 50px | All text CTAs (primary, secondary, tab toggles) |
| `{rounded.full}` | 9999px | Circular icon buttons, comparison-table checkmark glyphs |

### Photography & Illustration Geometry

- Image frames use `{rounded.md}` (8px) — generous enough to feel friendly, conservative enough to read as editorial.
- Template thumbnails on the home grid sit in `{rounded.md}` tiles with `{spacing.md}` interior padding around the embedded preview.
- FigJam pastel sticky-note component thumbnails preserve a small `{rounded.sm}` corner that mimics actual sticky paper.
- No avatar circles appear in marketing surfaces — Figma''s marketing avoids personification.', '{"sourcePath":"docs/design-md/figma/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — The black "Get started for free" pill that appears in the top nav, every hero, and every closing CTA.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 10px 20px, rounded `{rounded.pill}`.
- Pressed state lives in `button-primary-pressed` (same surface; the live site relies on micro-scale rather than a darkened fill).

**`button-secondary`** — White pill with black text. Used for tertiary navigation actions ("Contact sales") and as the visual counterpart to the primary pill.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, padding 8px 18px 10px (asymmetric vertical to optically center the type), rounded `{rounded.pill}`. No border.

**`button-tertiary-text`** — Plain text link styled as a button hit target inside top nav and footer.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.link}`, rounded `{rounded.full}` (hit target only), padding `{spacing.xs}` `{spacing.sm}`.

**`button-icon-circular`** — 40px circular icon button used for carousel controls, social links, and inline actions on light surfaces.
- Background `{colors.surface-soft}`, text `{colors.ink}`, rounded `{rounded.full}`, size 40px.

**`button-icon-circular-inverse`** — Same shape, used on inverse-canvas / dark color blocks.
- Background `{colors.on-inverse-soft}` (translucent white), text `{colors.inverse-ink}`, rounded `{rounded.full}`, size 40px.

**`button-magenta-promo`** — Saturated pink pill used only inside promotional surfaces such as the lilac "Save your spot" Release Notes banner. Reserved for moments where Figma''s product team wants the CTA to pop against an already-colored panel.
- Background `{colors.accent-magenta}`, text `{colors.on-primary}`, type `{typography.button}`, rounded `{rounded.pill}`, padding 10px 18px.

### Pricing Tabs

**`pricing-tab-default`** + **`pricing-tab-selected`** — The pill-toggle that switches between Starter / Professional / Organization / Enterprise on `/pricing/`.
- Default: `{colors.canvas}` background, `{colors.ink}` text, rounded `{rounded.pill}`.
- Selected: `{colors.primary}` background, `{colors.on-primary}` text — exactly the same surface as `button-primary`, which makes the selected tab feel like an active CTA, not a passive state.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on `/contact/` and pricing seat-count steppers.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 12px 14px.
- Focused state retains the same surface — focus is communicated via ring, not via fill change.

### Cards & Containers

**`pricing-card`** — Each tier on `/pricing/`.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding `{spacing.lg}`. Stroked with `{colors.hairline}` rather than shadowed.

**`pricing-card-feature-row`** — Single row inside the comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`. Row separator is `{colors.hairline-soft}`.

**`template-card`** — Thumbnail tile in the home "Explore what people are making" grid and the FigJam template gallery.
- Background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`feature-illustration-tile`** — Larger composition tile that holds a product UI mock or pastel illustration.
- Background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.eyebrow}`, rounded `{rounded.md}`, padding `{spacing.lg}`.

### Color-Block Sections (signature)

The defining surface of Figma''s marketing. Each is a full-content-width panel with `{rounded.lg}` corners and `{spacing.xxl}` interior padding. Variants:

**`color-block-section`** — lime ground for "systems" stories (home), pricing FAQ, and the contact form.
- Background `{colors.block-lime}`, text `{colors.ink}`, type `{typography.subhead}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`color-block-section-lilac`** — lavender ground for `/design/` hero and FigJam highlight sections.
- Background `{colors.block-lilac}`, otherwise identical structure.

**`color-block-section-navy`** — deep indigo ground for the home "Ship products" story block. The only inverse color-block surface above the footer.
- Background `{colors.block-navy}`, text `{colors.inverse-ink}`, otherwise identical structure.

(Cream, mint, pink, and coral block variants follow the same shape with their respective `{colors.block-*}` surface.)

### Promo Banner

**`promo-banner-lilac`** — The Release Notes / "Save your spot" inline banner that floats above the contact form.
- Background `{colors.block-lilac}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.md}`, padding `{spacing.md}` `{spacing.lg}`. Carries a `button-magenta-promo` on the right edge.

### Navigation

**`top-nav`** — Sticky white bar with logo, primary nav links, sign-in link, and the right-anchored `button-secondary` ("Contact sales") + `button-primary` ("Get started for free") pair.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 56px.
- Mobile: collapses primary links into a hamburger that opens a full-canvas overlay; the two pill CTAs remain visible on the bar.

**`marquee-strip`** — Thin black ribbon directly under the nav that scrolls through customer logos in white.
- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink}`, type `{typography.body-sm}`, height 36px.

### Comparison Glyphs

**`comparison-checkmark`** — Green check used in the pricing comparison matrix.
- Background `{colors.canvas}`, glyph color `{colors.semantic-success}`, rounded `{rounded.full}`, size 16px.

### Footer

**`footer`** — Dense link grid on white canvas with the wordmark "Figma" set in display weight at the top-left.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.caption}` for column headings and small links, padding `{spacing.section}` top/bottom · `{spacing.xl}` sides.', '{"sourcePath":"docs/design-md/figma/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do

- Reserve `{colors.primary}` for genuine primary CTAs and selected states (e.g., `pricing-tab-selected`). Don''t use it as a decorative accent.
- When introducing a story section, choose **one** color block from the `{colors.block-*}` family and let it span full content width with `{rounded.lg}` corners and `{spacing.xxl}` interior padding.
- Keep type in `figmaSans` at variable weights — pick from 320, 330, 340, 480, 540, 700 to express hierarchy. Avoid intermediate weights outside this set.
- Use `figmaMono` only for eyebrows and captions, always uppercase, with the documented positive letter-spacing.
- Compose every CTA as a pill (`{rounded.pill}`) and every icon button as a circle (`{rounded.full}`).
- Allow the page to **return to white canvas** between every two color blocks so each block reads as deliberate.
- Pair `button-primary` and `button-secondary` whenever a section needs both a primary action and a sales / secondary action — the black-and-white pair is the brand signature.

### Don''t

- Don''t introduce mid-gray text. Body hierarchy comes from `figmaSans` weight, not from opacity.
- Don''t add drop shadows to color-block sections — the color is the depth device.
- Don''t introduce new accent colors outside the documented `{colors.block-*}` palette and `{colors.accent-magenta}`. Adding, e.g., a saturated brand orange would break the system.
- Don''t combine more than one color block visible inside a single viewport — Figma''s pacing always lets the white canvas separate them.
- Don''t square off CTAs. Square buttons read as a different brand.
- Don''t put `figmaMono` in body copy — it''s a taxonomy tool, not a reading typeface.
- Don''t replace the `pricing-tab-selected` black fill with a colored tab; the brand pattern is "selected = primary surface".', '{"sourcePath":"docs/design-md/figma/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| 4k | 1920px | Max content width holds at 1280px; gutters expand |
| Desktop-XL | 1440px | Default desktop layout |
| Desktop | 1400px | Comparison table column widths normalize |
| Desktop-S | 1280px | Pricing 4-up tier grid maintained |
| Tablet | 960px | Pricing collapses 4-up → 2-up; nav becomes hamburger |
| Mobile-L | 768px | Color-block sections become full-bleed (no rounded corners on edges) |
| Mobile | 560px | Display-xl reduces from 86px to ~48px; pill CTAs go full-width |
| Mobile-XS | 559px | Two-column footer collapses to single column |

### Touch Targets

- Pill buttons (`button-primary`, `button-secondary`) maintain a minimum 44px tap height across all viewports — achieved by combining `{typography.button}` 20px line-height with the documented vertical padding.
- Circular icon buttons (`button-icon-circular`) are 40px on desktop and grow to 44px on touch viewports.
- Form input minimum tap target on `/contact/` is 48px high.

### Collapsing Strategy

- **Nav**: desktop horizontal nav with two right-anchored pills collapses to a hamburger overlay below 960px. The two pills (`Contact sales`, `Get started for free`) stay visible on the bar above 560px and stack in the overlay below.
- **Pricing tier grid**: 4-up → 2-up at 960px → 1-up below 768px. The pill toggle stays horizontal and scrolls horizontally if needed below 560px.
- **Color-block sections**: above 768px the section keeps `{spacing.xxl}` of canvas around it so the rounded corners read; below 768px the corners are removed and the block bleeds to viewport edge for a poster effect.
- **Comparison table**: below 960px the matrix collapses into per-tier accordions to avoid horizontal scroll.

### Image Behavior

- Product UI mocks inside color blocks scale proportionally and never crop. Below 768px they shrink rather than reflow.
- Template thumbnails in the home grid use lazy loading and animate in on scroll.
- Sticky-note style FigJam thumbnails maintain their slight off-axis rotation across breakpoints — the rotation is a brand signal, not a desktop-only flourish.', '{"sourcePath":"docs/design-md/figma/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name (e.g., `{components.button-primary}`, `{components.color-block-section}`).
2. When introducing a new section, decide **first** which `{colors.block-*}` token it sits on; the surface choice is the most consequential decision.
3. Default body type to `{typography.body}`; reach for `{typography.subhead}` or `{typography.headline}` only inside a color block.
4. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
5. Add new variants as separate component entries (`-pressed`, `-selected`) — do not bury them in prose.
6. Keep `{colors.primary}` scarce. If two `button-primary` instances appear in the same viewport, the section is doing too much — neutralize one to `button-secondary`.
7. Treat `{colors.accent-magenta}` as a single-shot color: one promo CTA per page, never two.', '{"sourcePath":"docs/design-md/figma/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- The exact pastel hex values of `{colors.block-*}` are derived from screenshot pixels; the production source likely uses named tokens that aren''t exposed via CSS variables. Treat the documented hex values as faithful approximations rather than exact brand specs.
- Dark mode is not documented because the marketing site does not ship a dark theme — the closest analog is the navy color-block (`color-block-section-navy`) and the inverse-canvas footer.
- Form-field error and validation styling is not visible on `/contact/` because no error states render in the static screenshot. Inputs have hairline borders and rounded `{rounded.md}` corners; error treatment is not documented.
- The animated marquee-strip and color-block reveal animations are not documented (per the no-interaction policy).', '{"sourcePath":"docs/design-md/figma/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_1', '#000000', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_3', '#e6e6e6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_4', '#f1f1f1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_5', '#f7f7f5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_6', '#dceeb1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_7', '#c5b0f4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_8', '#f4ecd6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_9', '#efd4d4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_10', '#c8e6cd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_11', '#f3c9b6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_12', '#1f1d3d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_13', '#ff3d8b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md'), 'color', 'color_14', '#1ea64a', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/figma/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/figma/DESIGN.md';

