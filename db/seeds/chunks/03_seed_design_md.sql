-- Generated seed chunk 03
-- Run 000_prepare.sql once before running these chunks.
-- Documents: 10


-- Framer
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Framer', 'framer', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/framer/DESIGN.md', null, 'seeded', '---
version: alpha
name: Framer-design-analysis
description: "A confident dark-canvas builder marketing site that treats the page like a working artboard — pure black surfaces, white display type set in GT Walsheim Medium with aggressive negative tracking, and a single confident blue (#0099ff) reserved for hyperlinks and selection states. The page rhythm is broken by oversized vibrant gradient atmosphere panels — magenta, violet, orange spotlights — that act as living showcase tiles, not decoration. Every CTA is a white pill on dark; every card is a translucent or charcoal surface; every section title pulls letter-spacing tight enough to feel like a poster."

colors:
  primary: "#ffffff"
  on-primary: "#000000"
  accent-blue: "#0099ff"
  ink: "#ffffff"
  ink-muted: "#999999"
  canvas: "#090909"
  surface-1: "#141414"
  surface-2: "#1c1c1c"
  hairline: "#262626"
  hairline-soft: "#1a1a1a"
  inverse-canvas: "#ffffff"
  inverse-ink: "#000000"
  gradient-magenta: "#d44df0"
  gradient-violet: "#6a4cf5"
  gradient-orange: "#ff7a3d"
  gradient-coral: "#ff5577"
  semantic-success: "#22c55e"

typography:
  display-xxl:
    fontFamily: GT Walsheim Framer Medium
    fontSize: 110px
    fontWeight: 500
    lineHeight: 0.85
    letterSpacing: -5.5px
  display-xl:
    fontFamily: GT Walsheim Medium
    fontSize: 85px
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: -4.25px
    fontFeature: ss02
  display-lg:
    fontFamily: GT Walsheim Medium
    fontSize: 62px
    fontWeight: 500
    lineHeight: 1.00
    letterSpacing: -3.1px
    fontFeature: ss02
  display-md:
    fontFamily: GT Walsheim Medium
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.13
    letterSpacing: -1.0px
  headline:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.20
    letterSpacing: -0.8px
    fontFeature: cv05
  subhead:
    fontFamily: Inter Variable
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.30
    letterSpacing: -0.01px
    fontFeature: cv11
  body-lg:
    fontFamily: Inter Variable
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.30
    letterSpacing: -0.18px
    fontFeature: cv11
  body:
    fontFamily: Inter Variable
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.30
    letterSpacing: -0.15px
    fontFeature: cv11
  body-sm:
    fontFamily: Inter Variable
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.40
    letterSpacing: -0.14px
    fontFeature: cv11
  caption:
    fontFamily: Inter Variable
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: -0.13px
    fontFeature: cv11
  micro:
    fontFamily: Inter Variable
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.20
    letterSpacing: -0.12px
    fontFeature: cv11
  button:
    fontFamily: Inter Variable
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.14px
    fontFeature: cv11

rounded:
  xs: 4px
  sm: 6px
  md: 10px
  lg: 15px
  xl: 20px
  xxl: 30px
  pill: 100px
  full: 9999px

spacing:
  hair: 1px
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 15px
  lg: 20px
  xl: 30px
  xxl: 40px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 10px 15px
  button-primary-pressed:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 10px 15px
  button-translucent:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.xxl}"
    padding: 8px 14px
  button-icon-circular:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    size: 40px
  pricing-tab-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 14px
  pricing-tab-selected:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 14px
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 14px
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 14px
  pricing-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  pricing-card-featured:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  template-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 12px
  gradient-spotlight-card:
    backgroundColor: "{colors.gradient-violet}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.xl}"
    padding: 32px
  gradient-spotlight-card-magenta:
    backgroundColor: "{colors.gradient-magenta}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.xl}"
    padding: 32px
  gradient-spotlight-card-orange:
    backgroundColor: "{colors.gradient-orange}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.xl}"
    padding: 32px
  product-mockup-tile:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xl}"
    padding: 16px
  feature-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
  comparison-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 56px
  faq-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 24px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
---

## Overview

Framer''s marketing canvas is a near-pure black artboard. The dominant surface is `{colors.canvas}` — almost pure black with a faint warmth — and on top of it sits oversized white display type set in **GT Walsheim Medium** with letter-spacing pulled to extreme negative values (-5.5px on the 110px display, -4.25px on the 85px hero). The page reads like a poster: one assertive statement per band, generous breathing room above and below.

The single accent is `{colors.accent-blue}` — used scarcely, mostly for hyperlinks, selection halos, and a subtle blue-tinted shadow ring on focused inputs. The brand chrome itself is monochrome: white pill buttons, charcoal cards, gray secondary text. What makes Framer distinctive is the rhythm break — every few sections the page drops in a **vibrant gradient atmosphere card**: a magenta-violet spotlight, a sunset-orange wash, a coral-pink panel. These aren''t section backgrounds; they''re individual cards arranged in a card grid, each one a small living poster that shows what Framer can produce.

Body type is **Inter Variable**, with Framer leaning hard into Inter''s character variants (`cv01`, `cv05`, `cv09`, `cv11`, `ss03`, `ss07`, `dlig`) — the result is a body voice that feels custom-tuned, with single-storey "a", straight-leg "l", and tabular figures. There''s no light mode on the marketing site; the brand IS dark.

**Key Characteristics:**
- Black-canvas marketing system: `{colors.canvas}` is the surface for hero, body, pricing, FAQ, and footer alike — no light interludes.
- Massive negative letter-spacing on display sizes (-5.5px / -4.25px / -3.1px) creates a poster-grade headline cadence.
- White pill (`{components.button-primary}`) is the only primary CTA shape across the site; secondary actions live as charcoal pills (`{components.button-secondary}`) or text links.
- Oversized **gradient spotlight cards** (violet, magenta, orange, coral) act as showcase tiles inside the dark grid; they are individual cards, not section backgrounds.
- Inter Variable with bespoke OpenType character variants (`cv01/05/09/11`, `ss03/ss07`, `dlig`) used everywhere body type appears — the typographic voice is unmistakable.
- Border radius scale runs from 4px utility chips up to 100px pills and full circles, with 15–20px the default for cards and 30px for atmospheric gradient cards.
- A single chromatic accent `{colors.accent-blue}` reserved for hyperlinks, focus, and selection — never decorative.

## Colors

> Source pages: framer.com (home), /ai/, /startups/, /marketplace/templates/nudge/, /gallery/a16z-speedrun-×-tonik, /pricing.

### Brand & Accent
- **Pure White** ({colors.primary}): The brand primary surface. Every primary CTA pill, every display headline, every body line on canvas.
- **Sky Blue** ({colors.accent-blue}): The single chromatic accent. Hyperlinks, focused-input rings, and a few selection states. Never used for backgrounds or as a brand fill.

### Surface
- **Canvas** ({colors.canvas}): Default page background — near-black with a faint warmth. Footer, pricing, hero, and FAQ all sit on it.
- **Surface 1** ({colors.surface-1}): One step above canvas — pricing cards, secondary buttons, mockup tiles.
- **Surface 2** ({colors.surface-2}): Two steps above — featured pricing card, hero pill backdrop, selected pricing tab.
- **Hairline** ({colors.hairline}): 1px borders on input groups, comparison-table dividers.
- **Hairline Soft** ({colors.hairline-soft}): Subtler dividers — between FAQ rows and footer column rules.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white — used as the surface of light-on-dark pill CTAs and a small set of light-mode template thumbnails embedded in the showcase grid.

### Text
- **Ink** ({colors.ink}): All headline and emphasized body type — pure white.
- **Ink Muted** ({colors.ink-muted}): Secondary type — gray (#999999) used for meta info, footer columns, comparison-row labels, deselected pricing tabs. Hierarchy on the dark canvas is carried by ink → ink-muted contrast, not by weight changes.

### Semantic
- **Success Green** ({colors.semantic-success}): Pricing comparison-table checkmarks. Glyph fill, not surface.

### Brand Gradient (signature)
- **Gradient Magenta** ({colors.gradient-magenta}): Spotlight card variant.
- **Gradient Violet** ({colors.gradient-violet}): Spotlight card variant — most common.
- **Gradient Orange** ({colors.gradient-orange}): Spotlight card variant — sunset wash.
- **Gradient Coral** ({colors.gradient-coral}): Spotlight card variant — coral/pink.

These four sit as oversized atmospheric tiles inside otherwise monochrome card grids — a dark canvas with one or two glowing spotlight cards is a recurring page signature.

## Typography

### Font Family

- **GT Walsheim Framer Medium** / **GT Walsheim Medium** — Framer''s display typeface. Geometric, slightly humanist, very confident at large sizes with extreme negative tracking. Fallbacks: `GT Walsheim Medium Placeholder` system font.
- **Inter Variable** — System body typeface. Used with extensive OpenType character variants: `cv01` (alternate "1"), `cv05` (alternate "g"), `cv09` (alternate "i" / "l"), `cv11` (alternate "0"), `ss03` / `ss07` stylistic sets, `dlig` discretionary ligatures, and `tnum` for numerics in tabular contexts. The result is a body voice that feels bespoke without commissioning a custom face.
- **Inter** — Used selectively for `{typography.headline}` (the 22px / 20px tier). The non-variable cut catches small tracking targets that the variable file rounds.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 110px | 500 | 0.85 | -5.5px | Largest hero headline (home, AI page) |
| `{typography.display-xl}` | 85px | 500 | 0.95 | -4.25px | Section opener headlines |
| `{typography.display-lg}` | 62px | 500 | 1.00 | -3.1px | Sub-section openers |
| `{typography.display-md}` | 32px | 500 | 1.13 | -1.0px | Card titles, smaller display |
| `{typography.headline}` | 22px | 700 | 1.20 | -0.8px | Pricing tier headlines, FAQ category titles |
| `{typography.subhead}` | 24px | 400 | 1.30 | -0.01px | Lead body next to display headlines |
| `{typography.body-lg}` | 18px | 400 | 1.30 | -0.18px | Hero subhead, lead paragraphs |
| `{typography.body}` | 15px | 400 | 1.30 | -0.15px | Default body, card descriptions |
| `{typography.body-sm}` | 14px | 500 | 1.40 | -0.14px | Pricing comparison rows, dense data |
| `{typography.caption}` | 13px | 500 | 1.20 | -0.13px | Eyebrows, footer columns, meta |
| `{typography.micro}` | 12px | 400 | 1.20 | -0.12px | Disclaimer, footnote |
| `{typography.button}` | 14px | 500 | 1.0 | -0.14px | Pill buttons |

### Principles

- **Letter-spacing scales with size, hard.** Display-xxl pulls -5.5px (5% of size); body sticks to about -1% (-0.15px on 15px). The result: posters at the top, comfortable reading at body.
- **OpenType character variants are the brand voice.** Switching off `cv11`, `ss03`, etc. visibly changes the body voice — the brand depends on them.
- **Weight stays in a narrow band.** Display sits at 500, body at 400, body-sm/caption at 500. Hierarchy is carried by size + tracking, not by 700/900 ramps.
- **Tight line-heights everywhere.** Even body runs at 1.30 — Framer''s editorial tone is denser than typical SaaS marketing.

### Note on Font Substitutes

If implementing without GT Walsheim Medium, suitable open-source substitutes include **Mona Sans**, **Geist**, or **Inter** at weight 600–700 with manually tightened tracking. Mona Sans''s hairline weights at 100–300 are particularly close to Framer''s cleaner section openers. Inter Variable is open-source — keep it as-is and preserve the documented OpenType variants.

## Layout

### Spacing System

- **Base unit**: 5px (Framer uses non-standard 5/10/15/20/30 increments rather than the more common 4/8/16/24).
- **Tokens (front matter)**: `{spacing.hair}` 1px · `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 15px · `{spacing.lg}` 20px · `{spacing.xl}` 30px · `{spacing.xxl}` 40px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 20px on pricing cards; `{spacing.xl}` 30px on gradient spotlight cards.
- Pill button padding: 10px vertical · 15px horizontal — `{components.button-primary}`.
- Section padding (vertical): roughly `{spacing.section}` 96px on home; tighter (~64px) on pricing comparison.

### Grid & Container

- Max content width sits around the 1199px breakpoint, with side gutters that scale toward `{spacing.xl}` on desktop.
- Card grids on the home gallery use 2-up at desktop, collapsing to 1-up below 810px.
- Pricing tier grid is 4-up across the documented breakpoints; comparison table beneath it uses fixed-width left column with horizontally scrolling tier columns at narrow widths.

### Whitespace Philosophy

The dark canvas IS the whitespace. Where lighter brands lean on white air to separate sections, Framer leans on long stretches of black with a single oversized statement floating in the middle. Sections separate by mode change: a band of charcoal cards, then a band of black with a gradient spotlight, then back to charcoal — like cuts in a dark film.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for canvas-mounted display type, FAQ rows, footer |
| 1 (charcoal) | `{colors.surface-1}` lift on canvas | Pricing cards, mockup tiles, secondary buttons |
| 2 (light-edge) | `rgba(255,255,255,0.10)` 0.5px top edge + `rgba(0,0,0,0.25)` 0px 10px 30px drop | Floating product cards, modal cards |
| 3 (selected) | `rgba(0,153,255,0.15)` 0px 0px 0px 1px ring | Focused inputs, selected option |

Four shadow signatures recur across the homepage: a 1px subtle drop, a translucent blue ring, a thick near-black 2px outline (used as the active-element marker on sub-nav), and the layered light-edge + drop-shadow used for floating cards.

### Decorative Depth

- **Gradient spotlight cards** are the dominant depth device — color saturation against black canvas substitutes for shadow-driven elevation.
- **Layered product mockups** (browser frames containing live Framer-built sites) sit inside `{colors.surface-1}` cards with the level-2 light-edge treatment.
- **Subtle blue ring (focus / selected)** is the only chromatic depth signal — used to mark the active state of input groups and pricing tier toggles without changing the underlying surface.

## Shapes

### Border Radius Scale

Framer''s extracted radius set is unusually granular (1px, 4px, 5px, 6px, 8px, 10px, 12px, 15px, 20px, 30px, 40px, 100px). The named scale below picks the levels the marketing surface actually consumes.

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chip / utility radius |
| `{rounded.sm}` | 6px | Inline tag, badge |
| `{rounded.md}` | 10px | Form input, list item |
| `{rounded.lg}` | 15px | Template card thumbnails |
| `{rounded.xl}` | 20px | Pricing cards, mockup tiles |
| `{rounded.xxl}` | 30px | Gradient spotlight cards, oversized panels |
| `{rounded.pill}` | 100px | All primary text CTAs |
| `{rounded.full}` | 9999px | Circular icon buttons, avatar circles |

### Photography & Illustration Geometry

- Embedded site mockups (browser-chromed previews of Framer-built sites) sit in `{rounded.xl}` 20px tiles with `{spacing.md}` 15px interior padding.
- Gradient spotlight cards use `{rounded.xxl}` 30px corners — softer than the 20px content cards by design, to make them feel like atmospheric panels rather than tighter UI.
- Icon glyphs and sub-nav glyphs render in `{rounded.full}` circles at 32–40px sizes.

## Components

### Buttons

**`button-primary`** — White pill on dark canvas. The primary CTA across home, pricing, AI, and gallery pages.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 10px 15px, rounded `{rounded.pill}`.
- Pressed state lives in `button-primary-pressed` (the live site uses a transform-scale shrink rather than a darkened fill).

**`button-secondary`** — Charcoal pill. Used for secondary navigation actions ("Sign in", "Talk to sales") and as the visual counterpart to the primary pill.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.button}`, padding 10px 15px, rounded `{rounded.pill}`.

**`button-translucent`** — Translucent / lifted secondary used on top of busy backgrounds (gallery hero, gradient cards).
- Background `{colors.surface-2}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.xxl}`, padding 8px 14px.

**`button-icon-circular`** — 40px circle for inline icon actions (carousel arrows, social links).
- Background `{colors.surface-1}`, text `{colors.ink}`, rounded `{rounded.full}`, size 40px.

### Pricing Tabs

**`pricing-tab-default`** + **`pricing-tab-selected`** — The pill-toggle that switches between Basic / Pro / Business / Enterprise on `/pricing`.
- Default: `{colors.canvas}` background, `{colors.ink-muted}` text, rounded `{rounded.pill}`.
- Selected: `{colors.surface-2}` background, `{colors.ink}` text — selected = lift, not color. Surface depth communicates "active" without needing a chromatic fill.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on `/pricing` (seat-count, currency switcher) and the in-product preview surfaces.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 10px 14px.
- Focused state retains the same surface; the focus ring is the level-3 blue-tinted shadow `rgba(0,153,255,0.15)` 0 0 0 1px.

### Cards & Containers

**`pricing-card`** — Each tier on `/pricing`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xl}`, padding 24px.

**`pricing-card-featured`** — The Pro tier (visually emphasized).
- Background `{colors.surface-2}`, otherwise identical structure. The lift is one surface step up — no chromatic outline.

**`template-card`** — Thumbnail tile in the home "Built with Framer" gallery and `/marketplace`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.lg}`, padding 12px.

**`product-mockup-tile`** — Larger tile that frames a live product UI mock (Framer canvas, Workshop video, AI translate panel).
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.xl}`, padding 16px.

### Gradient Spotlight Cards (signature)

The defining decorative surface of Framer''s marketing — oversized atmospheric tiles dropped into otherwise monochrome card grids. Variants:

**`gradient-spotlight-card`** — violet ground (most common).
- Background `{colors.gradient-violet}`, text `{colors.ink}`, type `{typography.subhead}`, rounded `{rounded.xl}`, padding 32px. (The on-site card often pushes to `{rounded.xxl}` 30px when it spans a wider tile.)

**`gradient-spotlight-card-magenta`** — magenta-pink ground.
- Background `{colors.gradient-magenta}`, otherwise identical.

**`gradient-spotlight-card-orange`** — sunset-orange wash.
- Background `{colors.gradient-orange}`, otherwise identical.

(Coral pink follows the same shape with `{colors.gradient-coral}`.)

### Comparison & FAQ

**`feature-row`** + **`comparison-row`** — Single rows inside the pricing comparison table.
- `feature-row`: `{colors.canvas}` background, `{colors.ink}` text. Header rows.
- `comparison-row`: `{colors.canvas}` background, `{colors.ink-muted}` text. Data rows with `{typography.body-sm}` and 1px `{colors.hairline-soft}` underlines.

**`faq-row`** — Each accordion line in the pricing-page FAQ.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 24px.

### Navigation

**`top-nav`** — Sticky bar on `{colors.canvas}` with the Framer wordmark left, primary nav links centered, and a `button-secondary` ("Sign in") + `button-primary` ("Get started for free") pair right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 56px.
- Mobile: collapses primary links into a hamburger; the two pill CTAs collapse into a single primary pill on the bar.

### Footer

**`footer`** — Dense link grid on `{colors.canvas}` with the Framer wordmark left and 5–6 columns of caption-sized links.
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.caption}`, padding 64px 32px.

## Do''s and Don''ts

### Do

- Reserve `{colors.primary}` (white) and `{colors.canvas}` (near-black) as the system''s two anchor surfaces. Every band of the page chooses one or the other.
- Push display-size letter-spacing aggressively negative — `{typography.display-xxl}` at -5.5px is the brand signature, not a stylistic accident.
- Use `{colors.accent-blue}` only for hyperlinks, focus rings, and selected indicators. Never as a background or button fill.
- Drop one or two `gradient-spotlight-card` variants into a card grid; they are the brand''s atmosphere device. Don''t overdo it — three or more in the same viewport reads as a moodboard, not a system.
- Compose every CTA as a pill (`{rounded.pill}`); secondary actions live as charcoal pills, never as bordered ghost buttons.
- Keep body type Inter Variable with character variants `cv01`, `cv05`, `cv09`, `cv11`, `ss03`, `ss07` enabled — the brand voice depends on them.
- Use surface lift (canvas → surface-1 → surface-2) to mark hierarchy on dark, not opacity changes on white type.

### Don''t

- Don''t ship a light-mode marketing page. Framer''s identity is dark.
- Don''t introduce mid-tone gray text outside `{colors.ink-muted}`. The hierarchy is binary: `ink` or `ink-muted`.
- Don''t use `{colors.accent-blue}` as a brand fill (e.g., a blue CTA pill). The blue is a signal color, not a surface.
- Don''t square off CTAs. Pill (`{rounded.pill}`) or full circle is the brand vocabulary.
- Don''t reduce the negative letter-spacing on display sizes "for accessibility". The compression is intrinsic to the brand voice; reduce the SIZE if needed, but keep the percentage.
- Don''t apply gradient backgrounds to whole sections. Gradients are CARDS, not section grounds.
- Don''t combine more than one chromatic accent. The palette is monochrome plus one blue plus the gradient family — not "blue, green, and red".

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop | 1199px | Default desktop layout |
| Tablet | 810px | Card grids collapse 4-up → 2-up; nav becomes hamburger |
| Mobile-Lg | 809px | Pricing comparison table becomes per-tier accordion |
| Mobile-XS | 98px | Smallest documented breakpoint — single-column everything |

### Touch Targets

- Pill buttons (`button-primary`, `button-secondary`) maintain a minimum 44px tap height across all viewports — combine `{typography.button}` 14px line-height with the documented 10px vertical padding.
- Circular icon buttons (`button-icon-circular`) are 40px on desktop and grow to 44px on touch viewports.
- Pricing-tab pills hold ≥40px tap height; below 810px they may collapse into a horizontal-scroll row instead of stacking.

### Collapsing Strategy

- **Nav**: horizontal nav with a centered link group + right-anchored pill pair collapses to a hamburger overlay below 810px. The `button-primary` stays visible on the bar.
- **Card grids**: the gallery and template-card grids go 2-up on desktop → 1-up on mobile. Gradient spotlight cards retain `{rounded.xxl}` corners at every viewport — they don''t bleed.
- **Pricing comparison table**: collapses into per-tier accordions below 810px to avoid horizontal scroll.
- **Display type**: `{typography.display-xxl}` 110px scales down toward `{typography.display-lg}` 62px on tablet and `{typography.display-md}` 32px on mobile, preserving the percentage-negative letter-spacing.

### Image Behavior

- Embedded product mockups (browser frames containing live Framer-built sites) maintain their aspect ratio and never crop.
- Gradient spotlight cards keep their gradient orientations across breakpoints — the gradient direction is part of the brand spec.

## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name (e.g., `{components.button-primary}`, `{components.gradient-spotlight-card}`).
2. When introducing a new section on the dark canvas, decide first which surface lift it lives on — `{colors.canvas}` for hero/FAQ, `{colors.surface-1}` for cards, `{colors.surface-2}` for featured cards. The depth choice is the most consequential decision.
3. Default body to `{typography.body}` with all the documented OpenType variants; reach for `{typography.subhead}` only inside spotlight cards.
4. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
5. Add new variants as separate component entries (`-pressed`, `-featured`, `-selected`) — do not bury them in prose.
6. Treat `{colors.accent-blue}` as a single-shot signal color: hyperlinks, focus, and selection — that''s it. If you find yourself reaching for a second blue, the brand is drifting.
7. Gradient spotlight cards are scarce by design. One or two per long page is the spec; three is a moodboard.

## Known Gaps

- The exact gradient stops for the spotlight cards are derived from screenshot pixels rather than from CSS variables — the production gradients are likely defined as `linear-gradient` strings on individual elements rather than as design tokens. Treat the documented `{colors.gradient-*}` hex values as base anchors, not as exact gradient specs.
- Form-field validation / error styling is not visible on the inspected pages because no error states render in the static screenshots.
- Dark mode is the only mode — no light-mode adaptation is documented because the marketing site does not ship one.
- The marketplace template detail page returned sparser CSS variable data than the other pages; surface tokens for that page were inferred from the matching home / gallery treatment rather than extracted directly.
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

Framer''s marketing canvas is a near-pure black artboard. The dominant surface is `{colors.canvas}` — almost pure black with a faint warmth — and on top of it sits oversized white display type set in **GT Walsheim Medium** with letter-spacing pulled to extreme negative values (-5.5px on the 110px display, -4.25px on the 85px hero). The page reads like a poster: one assertive statement per band, generous breathing room above and below.

The single accent is `{colors.accent-blue}` — used scarcely, mostly for hyperlinks, selection halos, and a subtle blue-tinted shadow ring on focused inputs. The brand chrome itself is monochrome: white pill buttons, charcoal cards, gray secondary text. What makes Framer distinctive is the rhythm break — every few sections the page drops in a **vibrant gradient atmosphere card**: a magenta-violet spotlight, a sunset-orange wash, a coral-pink panel. These aren''t section backgrounds; they''re individual cards arranged in a card grid, each one a small living poster that shows what Framer can produce.

Body type is **Inter Variable**, with Framer leaning hard into Inter''s character variants (`cv01`, `cv05`, `cv09`, `cv11`, `ss03`, `ss07`, `dlig`) — the result is a body voice that feels custom-tuned, with single-storey "a", straight-leg "l", and tabular figures. There''s no light mode on the marketing site; the brand IS dark.

**Key Characteristics:**
- Black-canvas marketing system: `{colors.canvas}` is the surface for hero, body, pricing, FAQ, and footer alike — no light interludes.
- Massive negative letter-spacing on display sizes (-5.5px / -4.25px / -3.1px) creates a poster-grade headline cadence.
- White pill (`{components.button-primary}`) is the only primary CTA shape across the site; secondary actions live as charcoal pills (`{components.button-secondary}`) or text links.
- Oversized **gradient spotlight cards** (violet, magenta, orange, coral) act as showcase tiles inside the dark grid; they are individual cards, not section backgrounds.
- Inter Variable with bespoke OpenType character variants (`cv01/05/09/11`, `ss03/ss07`, `dlig`) used everywhere body type appears — the typographic voice is unmistakable.
- Border radius scale runs from 4px utility chips up to 100px pills and full circles, with 15–20px the default for cards and 30px for atmospheric gradient cards.
- A single chromatic accent `{colors.accent-blue}` reserved for hyperlinks, focus, and selection — never decorative.', '{"sourcePath":"docs/design-md/framer/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: framer.com (home), /ai/, /startups/, /marketplace/templates/nudge/, /gallery/a16z-speedrun-×-tonik, /pricing.

### Brand & Accent
- **Pure White** ({colors.primary}): The brand primary surface. Every primary CTA pill, every display headline, every body line on canvas.
- **Sky Blue** ({colors.accent-blue}): The single chromatic accent. Hyperlinks, focused-input rings, and a few selection states. Never used for backgrounds or as a brand fill.

### Surface
- **Canvas** ({colors.canvas}): Default page background — near-black with a faint warmth. Footer, pricing, hero, and FAQ all sit on it.
- **Surface 1** ({colors.surface-1}): One step above canvas — pricing cards, secondary buttons, mockup tiles.
- **Surface 2** ({colors.surface-2}): Two steps above — featured pricing card, hero pill backdrop, selected pricing tab.
- **Hairline** ({colors.hairline}): 1px borders on input groups, comparison-table dividers.
- **Hairline Soft** ({colors.hairline-soft}): Subtler dividers — between FAQ rows and footer column rules.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white — used as the surface of light-on-dark pill CTAs and a small set of light-mode template thumbnails embedded in the showcase grid.

### Text
- **Ink** ({colors.ink}): All headline and emphasized body type — pure white.
- **Ink Muted** ({colors.ink-muted}): Secondary type — gray (#999999) used for meta info, footer columns, comparison-row labels, deselected pricing tabs. Hierarchy on the dark canvas is carried by ink → ink-muted contrast, not by weight changes.

### Semantic
- **Success Green** ({colors.semantic-success}): Pricing comparison-table checkmarks. Glyph fill, not surface.

### Brand Gradient (signature)
- **Gradient Magenta** ({colors.gradient-magenta}): Spotlight card variant.
- **Gradient Violet** ({colors.gradient-violet}): Spotlight card variant — most common.
- **Gradient Orange** ({colors.gradient-orange}): Spotlight card variant — sunset wash.
- **Gradient Coral** ({colors.gradient-coral}): Spotlight card variant — coral/pink.

These four sit as oversized atmospheric tiles inside otherwise monochrome card grids — a dark canvas with one or two glowing spotlight cards is a recurring page signature.', '{"sourcePath":"docs/design-md/framer/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

- **GT Walsheim Framer Medium** / **GT Walsheim Medium** — Framer''s display typeface. Geometric, slightly humanist, very confident at large sizes with extreme negative tracking. Fallbacks: `GT Walsheim Medium Placeholder` system font.
- **Inter Variable** — System body typeface. Used with extensive OpenType character variants: `cv01` (alternate "1"), `cv05` (alternate "g"), `cv09` (alternate "i" / "l"), `cv11` (alternate "0"), `ss03` / `ss07` stylistic sets, `dlig` discretionary ligatures, and `tnum` for numerics in tabular contexts. The result is a body voice that feels bespoke without commissioning a custom face.
- **Inter** — Used selectively for `{typography.headline}` (the 22px / 20px tier). The non-variable cut catches small tracking targets that the variable file rounds.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 110px | 500 | 0.85 | -5.5px | Largest hero headline (home, AI page) |
| `{typography.display-xl}` | 85px | 500 | 0.95 | -4.25px | Section opener headlines |
| `{typography.display-lg}` | 62px | 500 | 1.00 | -3.1px | Sub-section openers |
| `{typography.display-md}` | 32px | 500 | 1.13 | -1.0px | Card titles, smaller display |
| `{typography.headline}` | 22px | 700 | 1.20 | -0.8px | Pricing tier headlines, FAQ category titles |
| `{typography.subhead}` | 24px | 400 | 1.30 | -0.01px | Lead body next to display headlines |
| `{typography.body-lg}` | 18px | 400 | 1.30 | -0.18px | Hero subhead, lead paragraphs |
| `{typography.body}` | 15px | 400 | 1.30 | -0.15px | Default body, card descriptions |
| `{typography.body-sm}` | 14px | 500 | 1.40 | -0.14px | Pricing comparison rows, dense data |
| `{typography.caption}` | 13px | 500 | 1.20 | -0.13px | Eyebrows, footer columns, meta |
| `{typography.micro}` | 12px | 400 | 1.20 | -0.12px | Disclaimer, footnote |
| `{typography.button}` | 14px | 500 | 1.0 | -0.14px | Pill buttons |

### Principles

- **Letter-spacing scales with size, hard.** Display-xxl pulls -5.5px (5% of size); body sticks to about -1% (-0.15px on 15px). The result: posters at the top, comfortable reading at body.
- **OpenType character variants are the brand voice.** Switching off `cv11`, `ss03`, etc. visibly changes the body voice — the brand depends on them.
- **Weight stays in a narrow band.** Display sits at 500, body at 400, body-sm/caption at 500. Hierarchy is carried by size + tracking, not by 700/900 ramps.
- **Tight line-heights everywhere.** Even body runs at 1.30 — Framer''s editorial tone is denser than typical SaaS marketing.

### Note on Font Substitutes

If implementing without GT Walsheim Medium, suitable open-source substitutes include **Mona Sans**, **Geist**, or **Inter** at weight 600–700 with manually tightened tracking. Mona Sans''s hairline weights at 100–300 are particularly close to Framer''s cleaner section openers. Inter Variable is open-source — keep it as-is and preserve the documented OpenType variants.', '{"sourcePath":"docs/design-md/framer/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System

- **Base unit**: 5px (Framer uses non-standard 5/10/15/20/30 increments rather than the more common 4/8/16/24).
- **Tokens (front matter)**: `{spacing.hair}` 1px · `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 15px · `{spacing.lg}` 20px · `{spacing.xl}` 30px · `{spacing.xxl}` 40px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 20px on pricing cards; `{spacing.xl}` 30px on gradient spotlight cards.
- Pill button padding: 10px vertical · 15px horizontal — `{components.button-primary}`.
- Section padding (vertical): roughly `{spacing.section}` 96px on home; tighter (~64px) on pricing comparison.

### Grid & Container

- Max content width sits around the 1199px breakpoint, with side gutters that scale toward `{spacing.xl}` on desktop.
- Card grids on the home gallery use 2-up at desktop, collapsing to 1-up below 810px.
- Pricing tier grid is 4-up across the documented breakpoints; comparison table beneath it uses fixed-width left column with horizontally scrolling tier columns at narrow widths.

### Whitespace Philosophy

The dark canvas IS the whitespace. Where lighter brands lean on white air to separate sections, Framer leans on long stretches of black with a single oversized statement floating in the middle. Sections separate by mode change: a band of charcoal cards, then a band of black with a gradient spotlight, then back to charcoal — like cuts in a dark film.', '{"sourcePath":"docs/design-md/framer/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for canvas-mounted display type, FAQ rows, footer |
| 1 (charcoal) | `{colors.surface-1}` lift on canvas | Pricing cards, mockup tiles, secondary buttons |
| 2 (light-edge) | `rgba(255,255,255,0.10)` 0.5px top edge + `rgba(0,0,0,0.25)` 0px 10px 30px drop | Floating product cards, modal cards |
| 3 (selected) | `rgba(0,153,255,0.15)` 0px 0px 0px 1px ring | Focused inputs, selected option |

Four shadow signatures recur across the homepage: a 1px subtle drop, a translucent blue ring, a thick near-black 2px outline (used as the active-element marker on sub-nav), and the layered light-edge + drop-shadow used for floating cards.

### Decorative Depth

- **Gradient spotlight cards** are the dominant depth device — color saturation against black canvas substitutes for shadow-driven elevation.
- **Layered product mockups** (browser frames containing live Framer-built sites) sit inside `{colors.surface-1}` cards with the level-2 light-edge treatment.
- **Subtle blue ring (focus / selected)** is the only chromatic depth signal — used to mark the active state of input groups and pricing tier toggles without changing the underlying surface.', '{"sourcePath":"docs/design-md/framer/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

Framer''s extracted radius set is unusually granular (1px, 4px, 5px, 6px, 8px, 10px, 12px, 15px, 20px, 30px, 40px, 100px). The named scale below picks the levels the marketing surface actually consumes.

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chip / utility radius |
| `{rounded.sm}` | 6px | Inline tag, badge |
| `{rounded.md}` | 10px | Form input, list item |
| `{rounded.lg}` | 15px | Template card thumbnails |
| `{rounded.xl}` | 20px | Pricing cards, mockup tiles |
| `{rounded.xxl}` | 30px | Gradient spotlight cards, oversized panels |
| `{rounded.pill}` | 100px | All primary text CTAs |
| `{rounded.full}` | 9999px | Circular icon buttons, avatar circles |

### Photography & Illustration Geometry

- Embedded site mockups (browser-chromed previews of Framer-built sites) sit in `{rounded.xl}` 20px tiles with `{spacing.md}` 15px interior padding.
- Gradient spotlight cards use `{rounded.xxl}` 30px corners — softer than the 20px content cards by design, to make them feel like atmospheric panels rather than tighter UI.
- Icon glyphs and sub-nav glyphs render in `{rounded.full}` circles at 32–40px sizes.', '{"sourcePath":"docs/design-md/framer/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — White pill on dark canvas. The primary CTA across home, pricing, AI, and gallery pages.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 10px 15px, rounded `{rounded.pill}`.
- Pressed state lives in `button-primary-pressed` (the live site uses a transform-scale shrink rather than a darkened fill).

**`button-secondary`** — Charcoal pill. Used for secondary navigation actions ("Sign in", "Talk to sales") and as the visual counterpart to the primary pill.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.button}`, padding 10px 15px, rounded `{rounded.pill}`.

**`button-translucent`** — Translucent / lifted secondary used on top of busy backgrounds (gallery hero, gradient cards).
- Background `{colors.surface-2}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.xxl}`, padding 8px 14px.

**`button-icon-circular`** — 40px circle for inline icon actions (carousel arrows, social links).
- Background `{colors.surface-1}`, text `{colors.ink}`, rounded `{rounded.full}`, size 40px.

### Pricing Tabs

**`pricing-tab-default`** + **`pricing-tab-selected`** — The pill-toggle that switches between Basic / Pro / Business / Enterprise on `/pricing`.
- Default: `{colors.canvas}` background, `{colors.ink-muted}` text, rounded `{rounded.pill}`.
- Selected: `{colors.surface-2}` background, `{colors.ink}` text — selected = lift, not color. Surface depth communicates "active" without needing a chromatic fill.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on `/pricing` (seat-count, currency switcher) and the in-product preview surfaces.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 10px 14px.
- Focused state retains the same surface; the focus ring is the level-3 blue-tinted shadow `rgba(0,153,255,0.15)` 0 0 0 1px.

### Cards & Containers

**`pricing-card`** — Each tier on `/pricing`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xl}`, padding 24px.

**`pricing-card-featured`** — The Pro tier (visually emphasized).
- Background `{colors.surface-2}`, otherwise identical structure. The lift is one surface step up — no chromatic outline.

**`template-card`** — Thumbnail tile in the home "Built with Framer" gallery and `/marketplace`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.lg}`, padding 12px.

**`product-mockup-tile`** — Larger tile that frames a live product UI mock (Framer canvas, Workshop video, AI translate panel).
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.xl}`, padding 16px.

### Gradient Spotlight Cards (signature)

The defining decorative surface of Framer''s marketing — oversized atmospheric tiles dropped into otherwise monochrome card grids. Variants:

**`gradient-spotlight-card`** — violet ground (most common).
- Background `{colors.gradient-violet}`, text `{colors.ink}`, type `{typography.subhead}`, rounded `{rounded.xl}`, padding 32px. (The on-site card often pushes to `{rounded.xxl}` 30px when it spans a wider tile.)

**`gradient-spotlight-card-magenta`** — magenta-pink ground.
- Background `{colors.gradient-magenta}`, otherwise identical.

**`gradient-spotlight-card-orange`** — sunset-orange wash.
- Background `{colors.gradient-orange}`, otherwise identical.

(Coral pink follows the same shape with `{colors.gradient-coral}`.)

### Comparison & FAQ

**`feature-row`** + **`comparison-row`** — Single rows inside the pricing comparison table.
- `feature-row`: `{colors.canvas}` background, `{colors.ink}` text. Header rows.
- `comparison-row`: `{colors.canvas}` background, `{colors.ink-muted}` text. Data rows with `{typography.body-sm}` and 1px `{colors.hairline-soft}` underlines.

**`faq-row`** — Each accordion line in the pricing-page FAQ.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 24px.

### Navigation

**`top-nav`** — Sticky bar on `{colors.canvas}` with the Framer wordmark left, primary nav links centered, and a `button-secondary` ("Sign in") + `button-primary` ("Get started for free") pair right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 56px.
- Mobile: collapses primary links into a hamburger; the two pill CTAs collapse into a single primary pill on the bar.

### Footer

**`footer`** — Dense link grid on `{colors.canvas}` with the Framer wordmark left and 5–6 columns of caption-sized links.
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.caption}`, padding 64px 32px.', '{"sourcePath":"docs/design-md/framer/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do

- Reserve `{colors.primary}` (white) and `{colors.canvas}` (near-black) as the system''s two anchor surfaces. Every band of the page chooses one or the other.
- Push display-size letter-spacing aggressively negative — `{typography.display-xxl}` at -5.5px is the brand signature, not a stylistic accident.
- Use `{colors.accent-blue}` only for hyperlinks, focus rings, and selected indicators. Never as a background or button fill.
- Drop one or two `gradient-spotlight-card` variants into a card grid; they are the brand''s atmosphere device. Don''t overdo it — three or more in the same viewport reads as a moodboard, not a system.
- Compose every CTA as a pill (`{rounded.pill}`); secondary actions live as charcoal pills, never as bordered ghost buttons.
- Keep body type Inter Variable with character variants `cv01`, `cv05`, `cv09`, `cv11`, `ss03`, `ss07` enabled — the brand voice depends on them.
- Use surface lift (canvas → surface-1 → surface-2) to mark hierarchy on dark, not opacity changes on white type.

### Don''t

- Don''t ship a light-mode marketing page. Framer''s identity is dark.
- Don''t introduce mid-tone gray text outside `{colors.ink-muted}`. The hierarchy is binary: `ink` or `ink-muted`.
- Don''t use `{colors.accent-blue}` as a brand fill (e.g., a blue CTA pill). The blue is a signal color, not a surface.
- Don''t square off CTAs. Pill (`{rounded.pill}`) or full circle is the brand vocabulary.
- Don''t reduce the negative letter-spacing on display sizes "for accessibility". The compression is intrinsic to the brand voice; reduce the SIZE if needed, but keep the percentage.
- Don''t apply gradient backgrounds to whole sections. Gradients are CARDS, not section grounds.
- Don''t combine more than one chromatic accent. The palette is monochrome plus one blue plus the gradient family — not "blue, green, and red".', '{"sourcePath":"docs/design-md/framer/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop | 1199px | Default desktop layout |
| Tablet | 810px | Card grids collapse 4-up → 2-up; nav becomes hamburger |
| Mobile-Lg | 809px | Pricing comparison table becomes per-tier accordion |
| Mobile-XS | 98px | Smallest documented breakpoint — single-column everything |

### Touch Targets

- Pill buttons (`button-primary`, `button-secondary`) maintain a minimum 44px tap height across all viewports — combine `{typography.button}` 14px line-height with the documented 10px vertical padding.
- Circular icon buttons (`button-icon-circular`) are 40px on desktop and grow to 44px on touch viewports.
- Pricing-tab pills hold ≥40px tap height; below 810px they may collapse into a horizontal-scroll row instead of stacking.

### Collapsing Strategy

- **Nav**: horizontal nav with a centered link group + right-anchored pill pair collapses to a hamburger overlay below 810px. The `button-primary` stays visible on the bar.
- **Card grids**: the gallery and template-card grids go 2-up on desktop → 1-up on mobile. Gradient spotlight cards retain `{rounded.xxl}` corners at every viewport — they don''t bleed.
- **Pricing comparison table**: collapses into per-tier accordions below 810px to avoid horizontal scroll.
- **Display type**: `{typography.display-xxl}` 110px scales down toward `{typography.display-lg}` 62px on tablet and `{typography.display-md}` 32px on mobile, preserving the percentage-negative letter-spacing.

### Image Behavior

- Embedded product mockups (browser frames containing live Framer-built sites) maintain their aspect ratio and never crop.
- Gradient spotlight cards keep their gradient orientations across breakpoints — the gradient direction is part of the brand spec.', '{"sourcePath":"docs/design-md/framer/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name (e.g., `{components.button-primary}`, `{components.gradient-spotlight-card}`).
2. When introducing a new section on the dark canvas, decide first which surface lift it lives on — `{colors.canvas}` for hero/FAQ, `{colors.surface-1}` for cards, `{colors.surface-2}` for featured cards. The depth choice is the most consequential decision.
3. Default body to `{typography.body}` with all the documented OpenType variants; reach for `{typography.subhead}` only inside spotlight cards.
4. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
5. Add new variants as separate component entries (`-pressed`, `-featured`, `-selected`) — do not bury them in prose.
6. Treat `{colors.accent-blue}` as a single-shot signal color: hyperlinks, focus, and selection — that''s it. If you find yourself reaching for a second blue, the brand is drifting.
7. Gradient spotlight cards are scarce by design. One or two per long page is the spec; three is a moodboard.', '{"sourcePath":"docs/design-md/framer/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- The exact gradient stops for the spotlight cards are derived from screenshot pixels rather than from CSS variables — the production gradients are likely defined as `linear-gradient` strings on individual elements rather than as design tokens. Treat the documented `{colors.gradient-*}` hex values as base anchors, not as exact gradient specs.
- Form-field validation / error styling is not visible on the inspected pages because no error states render in the static screenshots.
- Dark mode is the only mode — no light-mode adaptation is documented because the marketing site does not ship one.
- The marketplace template detail page returned sparser CSS variable data than the other pages; surface tokens for that page were inferred from the matching home / gallery treatment rather than extracted directly.', '{"sourcePath":"docs/design-md/framer/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_1', '#0099ff', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_3', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_4', '#999999', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_5', '#090909', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_6', '#141414', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_7', '#1c1c1c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_8', '#262626', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_9', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_10', '#d44df0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_11', '#6a4cf5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_12', '#ff7a3d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_13', '#ff5577', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'color', 'color_14', '#22c55e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md'), 'typography', 'font_1', 'fontFamily: Inter', 'primary_detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/framer/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/framer/DESIGN.md';


-- Hashicorp
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Hashicorp', 'hashicorp', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/hashicorp/DESIGN.md', null, 'seeded', '---
version: alpha
name: HashiCorp-design-analysis
description: "An enterprise-infrastructure marketing canvas built around a near-black ground (#000000) and a system of per-product accent colors — Terraform purple, Vault yellow, Consul pink, Waypoint cyan, Vagrant blue — that act as identity tokens rather than decorative palette. Display type is hashicorpSans set in 600/700 with tight 1.17–1.21 line-heights; body type runs the same family at 500 weight with relaxed 1.50–1.71 line-heights. Cards live as charcoal surfaces with 1px translucent gray borders; product showcase cards lift into per-product chromatic gradients. The system reads as confident, technical, and intentionally multi-product — every section quietly signals which HashiCorp tool it represents."

colors:
  primary: "#000000"
  on-primary: "#ffffff"
  accent-blue: "#2b89ff"
  ink: "#ffffff"
  ink-muted: "#b2b6bd"
  ink-subtle: "#656a76"
  canvas: "#000000"
  surface-1: "#15181e"
  surface-2: "#1f232b"
  surface-3: "#3b3d45"
  hairline: "#3b3d45"
  hairline-soft: "#252830"
  inverse-canvas: "#ffffff"
  inverse-ink: "#000000"
  product-terraform: "#7b42bc"
  product-terraform-bright: "#911ced"
  product-vault: "#ffcf25"
  product-consul: "#e62b1e"
  product-waypoint: "#14c6cb"
  product-waypoint-deep: "#12b6bb"
  product-vagrant: "#1868f2"
  product-nomad: "#00ca8e"
  product-boundary: "#f24c53"
  amber-100: "#fbeabf"
  amber-200: "#bb5a00"
  blue-7: "#101a59"
  semantic-success: "#00ca8e"
  semantic-warning: "#ffcf25"
  semantic-error: "#e62b1e"
  semantic-visited: "#a737ff"

typography:
  display-xl:
    fontFamily: hashicorpSans
    fontSize: 80px
    fontWeight: 700
    lineHeight: 1.17
    letterSpacing: -2.5px
  display-lg:
    fontFamily: hashicorpSans
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: -1.6px
  display-md:
    fontFamily: hashicorpSans
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.19
    letterSpacing: -1.0px
  headline:
    fontFamily: hashicorpSans
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.21
    letterSpacing: -0.6px
  card-title:
    fontFamily: hashicorpSans
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: -0.4px
  subhead:
    fontFamily: hashicorpSans
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.2px
  body-lg:
    fontFamily: hashicorpSans
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.69
    letterSpacing: 0
  body:
    fontFamily: hashicorpSans
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.50
    letterSpacing: 0
  body-sm:
    fontFamily: hashicorpSans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.71
    letterSpacing: 0
  caption:
    fontFamily: hashicorpSans
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.38
    letterSpacing: 0.2px
  button:
    fontFamily: hashicorpSans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: 0
  eyebrow:
    fontFamily: hashicorpSans
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.23
    letterSpacing: 0.6px

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px
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
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  button-primary-pressed:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  button-product-terraform:
    backgroundColor: "{colors.product-terraform}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  button-product-vault:
    backgroundColor: "{colors.product-vault}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  button-product-waypoint:
    backgroundColor: "{colors.product-waypoint}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  product-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  product-card-terraform:
    backgroundColor: "{colors.product-terraform}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  product-card-vault:
    backgroundColor: "{colors.product-vault}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  product-card-waypoint:
    backgroundColor: "{colors.product-waypoint}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  feature-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-card-featured:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 32px
  resource-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 16px
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 14px
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 14px
  product-pill:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 64px
  comparison-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
  cta-banner:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.xxl}"
    padding: 48px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
---

## Overview

HashiCorp''s marketing canvas is a near-black ground that serves a multi-product portfolio without ever feeling generic. The dominant surface is `{colors.canvas}` (pure black) layered with `{colors.surface-1}` charcoal cards and 1px translucent gray hairlines. The chrome is monochrome — white pill-rounded buttons (`{components.button-primary}`), white type, gray secondary type — but the system is held together by a **palette of per-product accent colors** that signal which HashiCorp tool a given section belongs to: Terraform purple, Vault yellow, Consul red, Waypoint cyan, Vagrant blue, Nomad green, Boundary coral.

Display type is **hashicorpSans** at weights 600/700 with tight line-heights (1.17–1.21); body type is the same family at 500 weight with deliberately relaxed line-heights (1.50–1.71) — the contrast feels editorial, not enterprise-templated. CTAs use small `{rounded.md}` 8px corners rather than pills, which keeps the system reading as developer-facing rather than consumer-y.

The signature device is the **product-card** family — each HashiCorp product gets its own colored card variant on the home and infrastructure pages, lifting Terraform into a violet ground, Vault into yellow, Waypoint into cyan. These aren''t decorative gradients — they''re identity surfaces. A reader scrolling the page can tell which product a section is about from the corner of their eye.

**Key Characteristics:**
- Black-canvas marketing system: `{colors.canvas}` is the surface for hero, body, pricing, comparison tables, and footer alike.
- **Per-product color identity**: Terraform `{colors.product-terraform}`, Vault `{colors.product-vault}`, Waypoint `{colors.product-waypoint}`, Vagrant `{colors.product-vagrant}`, Consul `{colors.product-consul}`, Nomad `{colors.product-nomad}`, Boundary `{colors.product-boundary}` — each with its own button + card variant.
- Display headlines run hashicorpSans 600/700 with line-height 1.17–1.21 (tight); body runs the same family at 500 with 1.50–1.71 (relaxed) — the proportional gap is the brand''s voice.
- CTA shape is `{rounded.md}` 8px — not a pill — keeping the system reading as developer-tool rather than consumer-app.
- Charcoal surface lift (canvas → surface-1 → surface-2) instead of shadow-driven elevation.
- 1px translucent gray hairlines (`rgba(178,182,189,0.1)`) define cards and dividers — the borders are felt more than seen.
- Eyebrow typography (12–13px, 600 weight, 0.6px positive tracking, uppercase) marks every section as a category label.

## Colors

> Source pages: hashicorp.com/en (home), /en/infrastructure-cloud, /en/products/terraform, /en/pricing, /en/resources?contentType=PDF.

### Brand & Accent
- **Black** ({colors.primary}): The system primary surface. Canvas, footer, comparison tables, hero — all black.
- **White** ({colors.on-primary}): Inverse text on black; canvas of `button-primary`.
- **Accent Blue** ({colors.accent-blue}): Hyperlinks across the marketing surface.
- **Visited Purple** ({colors.semantic-visited}): Visited-link state.

### Surface
- **Canvas** ({colors.canvas}): Default page background.
- **Surface 1** ({colors.surface-1}): Charcoal one step above canvas — feature cards, pricing cards, resource tiles.
- **Surface 2** ({colors.surface-2}): Two steps above — featured pricing card, secondary buttons, hovered product chrome.
- **Surface 3** ({colors.surface-3}): Three steps above — small chips, badges, sub-nav backgrounds.
- **Hairline** ({colors.hairline}): 1px borders on cards and dividers.
- **Hairline Soft** ({colors.hairline-soft}): Subtler dividers — comparison-table rows.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white — used as the surface of `button-primary` only.

### Text
- **Ink** ({colors.ink}): All headline and emphasized body type — pure white.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #b2b6bd — meta info, footer columns.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #656a76 — form helper text, timestamps, footnotes.

### Per-Product Identity (signature)
HashiCorp''s marketing isn''t held together by a single accent color — it''s held together by a system of product-specific accents, each used to mark which tool a section represents.

- **Terraform Purple** ({colors.product-terraform}): Terraform sections, terraform CTAs, the violet 3D cube on the home hero.
- **Terraform Bright** ({colors.product-terraform-bright}): Saturated highlight — link emphasis on Terraform pages.
- **Vault Yellow** ({colors.product-vault}): Vault sections and CTAs.
- **Consul Red** ({colors.product-consul}): Consul sections.
- **Waypoint Cyan** ({colors.product-waypoint}): Waypoint sections, deep variant `{colors.product-waypoint-deep}` for hover/active.
- **Vagrant Blue** ({colors.product-vagrant}): Vagrant sections.
- **Nomad Green** ({colors.product-nomad}): Nomad sections.
- **Boundary Coral** ({colors.product-boundary}): Boundary sections.

### Semantic
- **Success** ({colors.semantic-success}): Positive states (also reused as Nomad green).
- **Warning** ({colors.semantic-warning}): Warning states (also Vault yellow).
- **Error** ({colors.semantic-error}): Error states (also Consul red).
- **Amber 100** ({colors.amber-100}): Soft warm highlight — extracted but used sparingly.
- **Amber 200** ({colors.amber-200}): Saturated amber for caution badges.
- **Blue 7** ({colors.blue-7}): Deep navy used in unified-core gradients.

## Typography

### Font Family

- **hashicorpSans** — HashiCorp''s proprietary marketing typeface. Geometric, clean, slightly humanist. Fallback stack `__hashicorpSans_Fallback_96f0ca` (system font), then `-apple-system, BlinkMacSystemFont, Segoe UI, helvetica, arial`.

The same family carries display, body, button, and caption — no separate display + body pairing. Hierarchy is carried by weight (500 body / 600 emphasis / 700 display) and by a deliberate line-height contrast (tight on display, relaxed on body).

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 80px | 700 | 1.17 | -2.5px | Largest hero headline |
| `{typography.display-lg}` | 56px | 700 | 1.18 | -1.6px | Section opener headlines |
| `{typography.display-md}` | 40px | 600 | 1.19 | -1.0px | Sub-section headlines |
| `{typography.headline}` | 28px | 600 | 1.21 | -0.6px | Pricing tier titles, CTA banner heading |
| `{typography.card-title}` | 22px | 600 | 1.18 | -0.4px | Feature card title |
| `{typography.subhead}` | 20px | 600 | 1.35 | -0.2px | Long-form intro paragraphs |
| `{typography.body-lg}` | 18px | 500 | 1.69 | 0 | Hero subhead, lead body |
| `{typography.body}` | 16px | 500 | 1.50 | 0 | Default body |
| `{typography.body-sm}` | 14px | 500 | 1.71 | 0 | Card body, footer columns |
| `{typography.caption}` | 13px | 500 | 1.38 | 0.2px | Meta, comparison cell labels |
| `{typography.button}` | 14px | 600 | 1.29 | 0 | Pill / square CTA buttons |
| `{typography.eyebrow}` | 12px | 600 | 1.23 | 0.6px | Uppercase section eyebrows |

### Principles

- **Tight on display, relaxed on body.** Display sits at line-height 1.17–1.21; body lifts to 1.50–1.71. The size + line-height contrast carries hierarchy.
- **Weight hierarchy is small.** 500 body / 600 emphasis / 700 display. No light / black extremes — the brand reads as engineered.
- **Eyebrow positive-tracked uppercase 12px is the section header.** Every meaningful section has one above the headline.
- **No mono.** Despite being a developer-tools brand, the marketing surface uses no monospace face — code voice is reserved for in-product surfaces.

### Note on Font Substitutes

If implementing without hashicorpSans, suitable open-source substitutes include **Inter** (closest geometric character set), **Geist Sans**, or **IBM Plex Sans**. Inter at weights 500 / 600 / 700 closely approximates hashicorpSans''s proportions; expect to manually adjust line-heights down by ~0.02 to match.

## Layout

### Spacing System

- **Base unit**: 8px (the primary increments are 4 / 8 / 12 / 16 / 24 / 32 / 48).
- **Tokens (front matter)**: `{spacing.hair}` 1px · `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on product cards; `{spacing.xl}` 32px on pricing cards; `{spacing.xxl}` 48px on CTA banners.
- Button padding: 10px vertical · 18px horizontal on `{components.button-primary}`.
- Universal rhythm constant: `{spacing.section}` (96px) vertical gap between major sections.

### Grid & Container

- Max content width sits around 1280px with side gutters scaling from `{spacing.xxl}` on desktop down to `{spacing.lg}` on mobile.
- Product card grids are 3-up on desktop, 2-up at tablet, 1-up on mobile.
- Pricing tier grid is 3-up across desktop; comparison table beneath uses fixed-width left column.
- Resource directory (PDF library) uses 4-up dense thumbnail grid.

### Whitespace Philosophy

The dark canvas IS the whitespace. Sections separate by surface lift (canvas → surface-1) rather than by gaps in white. Within a section, generous `{spacing.xl}` 32px gaps separate cards; `{spacing.lg}` 24px separates rows.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Canvas-mounted display type, hero, footer |
| 1 (charcoal lift) | `{colors.surface-1}` background + 1px `rgba(178,182,189,0.1)` border | Default cards, resource tiles, pricing cards |
| 2 (surface-2 lift) | `{colors.surface-2}` background + 1px `{colors.hairline}` border | Featured pricing card, hovered cards, sub-nav |
| 3 (product chromatic) | Per-product accent color background — Terraform purple, Vault yellow, Waypoint cyan | Product showcase cards |

The product chromatic level isn''t a "modal lift" — it''s an identity device. A Terraform card sits at the same z-plane as a feature-card; the difference is meaning, not depth.

### Decorative Depth

- **3D product visuals** — isometric purple cubes (Terraform), translucent yellow safes (Vault), and similar product-tinted illustrations sit in the right column of hero sections.
- **1px translucent gray hairlines** are the dominant edge — borders are visible without competing.
- **No drop shadows on dark.** Cards lift via surface change, never shadow.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips / badges |
| `{rounded.sm}` | 6px | Inline tag |
| `{rounded.md}` | 8px | All CTA buttons, form inputs, list items |
| `{rounded.lg}` | 12px | Feature cards, product cards, pricing cards |
| `{rounded.xl}` | 16px | Large illustrative tiles |
| `{rounded.xxl}` | 24px | CTA banner panels |
| `{rounded.pill}` | 9999px | Eyebrow-style product pills (small chips) |
| `{rounded.full}` | 9999px | Avatar circles (rare on marketing) |

### Photography & Illustration Geometry

- Product 3D illustrations use full-bleed within their container — no rounded inner mask.
- Logo chips in the customer marquee sit on `{rounded.sm}` 6px tiles with 1px hairline.
- Resource thumbnails use `{rounded.lg}` 12px corners.

## Components

### Buttons

**`button-primary`** — White rounded-rect CTA. Used as primary CTA on all pages.
- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink}`, type `{typography.button}`, padding 10px 18px, rounded `{rounded.md}`.
- Pressed state lives in `button-primary-pressed`.

**`button-secondary`** — Charcoal rounded-rect. Secondary CTA, "Read docs" / "Talk to sales".
- Background `{colors.surface-2}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

**`button-tertiary`** — Bare ghost button on canvas with text-only treatment.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

**`button-product-terraform`** — Terraform-tinted CTA on Terraform pages.
- Background `{colors.product-terraform}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

**`button-product-vault`** — Vault-yellow CTA.
- Background `{colors.product-vault}`, text `{colors.inverse-ink}` (yellow needs dark text), type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

**`button-product-waypoint`** — Waypoint-cyan CTA.
- Background `{colors.product-waypoint}`, text `{colors.inverse-ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

(Vagrant blue, Nomad green, Consul red, Boundary coral follow the same pattern with their respective `{colors.product-*}` token.)

### Cards & Containers

**`product-card`** — Default product showcase card — surface-1 charcoal.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`product-card-terraform`** — Product card with Terraform purple ground (used as identity surface, not modal elevation).
- Background `{colors.product-terraform}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`product-card-vault`** — Vault-yellow ground.
- Background `{colors.product-vault}`, text `{colors.inverse-ink}`, otherwise identical structure.

**`product-card-waypoint`** — Waypoint-cyan ground.
- Background `{colors.product-waypoint}`, text `{colors.inverse-ink}`, otherwise identical structure.

(Other product variants follow the same shape with their respective product token.)

**`feature-card`** — Generic feature highlight on surface-1.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`pricing-card`** — Pricing tier on `/en/pricing`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 32px.

**`pricing-card-featured`** — Recommended tier (visually emphasized via surface lift).
- Background `{colors.surface-2}`, otherwise identical structure.

**`resource-card`** — PDF / whitepaper / guide tile in the resources directory.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.lg}`, padding 16px.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on pricing seat-count and contact forms.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 10px 14px.
- Focused state retains the same surface; the focus ring is a 1px `{colors.accent-blue}` outline.

### Pills & Chips

**`product-pill`** — Small product-name chip used above hero headlines and on resource cards to label which product a piece of content belongs to.
- Background `{colors.surface-1}`, text `{colors.ink-muted}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 4px 10px.

### Comparison Table

**`comparison-row`** — Single row inside the pricing comparison table.
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.body-sm}`. Row separator is `{colors.hairline-soft}`.

### CTA Banner

**`cta-banner`** — Large rounded panel used at the bottom of long-form pages with a closing CTA.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.subhead}`, rounded `{rounded.xxl}`, padding 48px.

### Navigation

**`top-nav`** — Sticky black bar with HashiCorp logomark left, primary nav links centered, and a `button-primary` ("Sign up") + `button-secondary` ("Sign in") pair right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 64px.
- Mobile: collapses primary links into a hamburger; the primary CTA remains visible.

### Footer

**`footer`** — Dense link grid on `{colors.canvas}` with the wordmark at left and 5–6 columns of caption-sized links.
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.caption}`, padding 64px 32px.

## Do''s and Don''ts

### Do

- Reserve `{colors.canvas}` (black) and `{colors.surface-1}` (charcoal) as the system''s two anchor surfaces. Every band of the page is one or the other.
- When introducing a section about a specific HashiCorp product, use that product''s `{colors.product-*}` token consistently — for the section pill, the CTA button, and (where appropriate) the showcase card background.
- Use `{rounded.md}` 8px on CTA buttons; HashiCorp''s brand reads as engineered, not consumer.
- Pair tight display line-heights (1.17–1.21) with relaxed body line-heights (1.50–1.71). The contrast IS the brand voice.
- Use the eyebrow typography (`{typography.eyebrow}`, uppercase, 0.6px tracking) above every meaningful section.
- Use surface lift (canvas → surface-1 → surface-2) to express hierarchy on dark.
- Reserve product-chromatic cards for product identity; keep generic feature cards on `{colors.surface-1}`.

### Don''t

- Don''t ship a light-mode marketing page. HashiCorp''s marketing brand IS dark.
- Don''t introduce mid-tone gray text outside the documented `ink` / `ink-muted` / `ink-subtle` set.
- Don''t square off CTA corners — use `{rounded.md}` 8px, not 0px.
- Don''t use a product accent color for a CTA on a page that isn''t about that product. Terraform purple on the Vault page is a brand violation.
- Don''t combine multiple product accents in the same viewport — the system says "this section is about THIS tool", and mixing accents breaks that signal.
- Don''t add drop shadows on dark; surface lift carries elevation.
- Don''t replace `hashicorpSans` with a display-only sans for headlines and a different family for body. The brand is held together by one family across the full hierarchy.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop-XL | 1440px | Default desktop layout |
| Desktop | 1280px | Pricing 3-up grid maintained |
| Tablet | 1024px | Product card grid 3-up → 2-up |
| Mobile-Lg | 768px | Pricing comparison becomes per-tier accordion; nav becomes hamburger |
| Mobile | 480px | Single-column everything; display-xl scales 80px → ~36px |

### Touch Targets

- CTA buttons (`button-primary`, `button-secondary`) maintain ≥40px tap height across viewports.
- Product pills are 24px tall on desktop and grow to 28px on touch viewports.
- Form inputs hold ≥44px tap target on touch viewports.

### Collapsing Strategy

- **Nav**: horizontal nav with right-anchored CTAs collapses to a hamburger overlay below 768px. The primary CTA stays visible on the bar.
- **Product card grid**: 3-up → 2-up at 1024px → 1-up below 768px.
- **Pricing comparison table**: collapses into per-tier accordions below 768px to avoid horizontal scroll.
- **Display type**: `{typography.display-xl}` 80px scales toward `{typography.display-md}` 40px on mobile while preserving the negative-tracking percentage.

### Image Behavior

- 3D product illustrations (cubes, safes, etc.) maintain aspect ratio and never crop; below 768px they shrink rather than reflow.
- Customer logo marquee scales horizontally and may wrap to a second row at narrow widths.

## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. When introducing a new section, decide first whether it''s a generic feature (surface-1) or a product-identity section (product-* color).
3. Default body to `{typography.body}` at 500 weight; reach for `{typography.subhead}` only inside CTA banners and feature cards.
4. Run `npx @google/design.md lint DESIGN.md` after edits.
5. Add new product variants as separate component entries (`product-card-nomad`, `button-product-consul`, etc.).
6. Treat the per-product palette as identity tokens, not decoration. If you reach for a product color outside its product context, the brand is drifting.
7. Eyebrow type is mandatory above every section — skipping it makes sections read as floating.

## Known Gaps

- The exact product-color hex values come from the `--mds-color-*` CSS variable set extracted directly; they are HashiCorp''s canonical brand spec.
- Shadow tokens are not extensively documented because the dark surface system uses surface lift instead of shadow elevation.
- Form-field error and validation styling is not visible on the inspected pages.
- Dark mode is the only marketing mode — light-mode adaptation is not documented.
- Product-card variants for Consul, Nomad, Vagrant, and Boundary follow the documented Terraform / Vault / Waypoint pattern but are referenced in prose only; if they need formal entries they can be added as `product-card-consul`, `product-card-nomad`, etc.
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

HashiCorp''s marketing canvas is a near-black ground that serves a multi-product portfolio without ever feeling generic. The dominant surface is `{colors.canvas}` (pure black) layered with `{colors.surface-1}` charcoal cards and 1px translucent gray hairlines. The chrome is monochrome — white pill-rounded buttons (`{components.button-primary}`), white type, gray secondary type — but the system is held together by a **palette of per-product accent colors** that signal which HashiCorp tool a given section belongs to: Terraform purple, Vault yellow, Consul red, Waypoint cyan, Vagrant blue, Nomad green, Boundary coral.

Display type is **hashicorpSans** at weights 600/700 with tight line-heights (1.17–1.21); body type is the same family at 500 weight with deliberately relaxed line-heights (1.50–1.71) — the contrast feels editorial, not enterprise-templated. CTAs use small `{rounded.md}` 8px corners rather than pills, which keeps the system reading as developer-facing rather than consumer-y.

The signature device is the **product-card** family — each HashiCorp product gets its own colored card variant on the home and infrastructure pages, lifting Terraform into a violet ground, Vault into yellow, Waypoint into cyan. These aren''t decorative gradients — they''re identity surfaces. A reader scrolling the page can tell which product a section is about from the corner of their eye.

**Key Characteristics:**
- Black-canvas marketing system: `{colors.canvas}` is the surface for hero, body, pricing, comparison tables, and footer alike.
- **Per-product color identity**: Terraform `{colors.product-terraform}`, Vault `{colors.product-vault}`, Waypoint `{colors.product-waypoint}`, Vagrant `{colors.product-vagrant}`, Consul `{colors.product-consul}`, Nomad `{colors.product-nomad}`, Boundary `{colors.product-boundary}` — each with its own button + card variant.
- Display headlines run hashicorpSans 600/700 with line-height 1.17–1.21 (tight); body runs the same family at 500 with 1.50–1.71 (relaxed) — the proportional gap is the brand''s voice.
- CTA shape is `{rounded.md}` 8px — not a pill — keeping the system reading as developer-tool rather than consumer-app.
- Charcoal surface lift (canvas → surface-1 → surface-2) instead of shadow-driven elevation.
- 1px translucent gray hairlines (`rgba(178,182,189,0.1)`) define cards and dividers — the borders are felt more than seen.
- Eyebrow typography (12–13px, 600 weight, 0.6px positive tracking, uppercase) marks every section as a category label.', '{"sourcePath":"docs/design-md/hashicorp/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: hashicorp.com/en (home), /en/infrastructure-cloud, /en/products/terraform, /en/pricing, /en/resources?contentType=PDF.

### Brand & Accent
- **Black** ({colors.primary}): The system primary surface. Canvas, footer, comparison tables, hero — all black.
- **White** ({colors.on-primary}): Inverse text on black; canvas of `button-primary`.
- **Accent Blue** ({colors.accent-blue}): Hyperlinks across the marketing surface.
- **Visited Purple** ({colors.semantic-visited}): Visited-link state.

### Surface
- **Canvas** ({colors.canvas}): Default page background.
- **Surface 1** ({colors.surface-1}): Charcoal one step above canvas — feature cards, pricing cards, resource tiles.
- **Surface 2** ({colors.surface-2}): Two steps above — featured pricing card, secondary buttons, hovered product chrome.
- **Surface 3** ({colors.surface-3}): Three steps above — small chips, badges, sub-nav backgrounds.
- **Hairline** ({colors.hairline}): 1px borders on cards and dividers.
- **Hairline Soft** ({colors.hairline-soft}): Subtler dividers — comparison-table rows.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white — used as the surface of `button-primary` only.

### Text
- **Ink** ({colors.ink}): All headline and emphasized body type — pure white.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #b2b6bd — meta info, footer columns.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #656a76 — form helper text, timestamps, footnotes.

### Per-Product Identity (signature)
HashiCorp''s marketing isn''t held together by a single accent color — it''s held together by a system of product-specific accents, each used to mark which tool a section represents.

- **Terraform Purple** ({colors.product-terraform}): Terraform sections, terraform CTAs, the violet 3D cube on the home hero.
- **Terraform Bright** ({colors.product-terraform-bright}): Saturated highlight — link emphasis on Terraform pages.
- **Vault Yellow** ({colors.product-vault}): Vault sections and CTAs.
- **Consul Red** ({colors.product-consul}): Consul sections.
- **Waypoint Cyan** ({colors.product-waypoint}): Waypoint sections, deep variant `{colors.product-waypoint-deep}` for hover/active.
- **Vagrant Blue** ({colors.product-vagrant}): Vagrant sections.
- **Nomad Green** ({colors.product-nomad}): Nomad sections.
- **Boundary Coral** ({colors.product-boundary}): Boundary sections.

### Semantic
- **Success** ({colors.semantic-success}): Positive states (also reused as Nomad green).
- **Warning** ({colors.semantic-warning}): Warning states (also Vault yellow).
- **Error** ({colors.semantic-error}): Error states (also Consul red).
- **Amber 100** ({colors.amber-100}): Soft warm highlight — extracted but used sparingly.
- **Amber 200** ({colors.amber-200}): Saturated amber for caution badges.
- **Blue 7** ({colors.blue-7}): Deep navy used in unified-core gradients.', '{"sourcePath":"docs/design-md/hashicorp/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

- **hashicorpSans** — HashiCorp''s proprietary marketing typeface. Geometric, clean, slightly humanist. Fallback stack `__hashicorpSans_Fallback_96f0ca` (system font), then `-apple-system, BlinkMacSystemFont, Segoe UI, helvetica, arial`.

The same family carries display, body, button, and caption — no separate display + body pairing. Hierarchy is carried by weight (500 body / 600 emphasis / 700 display) and by a deliberate line-height contrast (tight on display, relaxed on body).

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 80px | 700 | 1.17 | -2.5px | Largest hero headline |
| `{typography.display-lg}` | 56px | 700 | 1.18 | -1.6px | Section opener headlines |
| `{typography.display-md}` | 40px | 600 | 1.19 | -1.0px | Sub-section headlines |
| `{typography.headline}` | 28px | 600 | 1.21 | -0.6px | Pricing tier titles, CTA banner heading |
| `{typography.card-title}` | 22px | 600 | 1.18 | -0.4px | Feature card title |
| `{typography.subhead}` | 20px | 600 | 1.35 | -0.2px | Long-form intro paragraphs |
| `{typography.body-lg}` | 18px | 500 | 1.69 | 0 | Hero subhead, lead body |
| `{typography.body}` | 16px | 500 | 1.50 | 0 | Default body |
| `{typography.body-sm}` | 14px | 500 | 1.71 | 0 | Card body, footer columns |
| `{typography.caption}` | 13px | 500 | 1.38 | 0.2px | Meta, comparison cell labels |
| `{typography.button}` | 14px | 600 | 1.29 | 0 | Pill / square CTA buttons |
| `{typography.eyebrow}` | 12px | 600 | 1.23 | 0.6px | Uppercase section eyebrows |

### Principles

- **Tight on display, relaxed on body.** Display sits at line-height 1.17–1.21; body lifts to 1.50–1.71. The size + line-height contrast carries hierarchy.
- **Weight hierarchy is small.** 500 body / 600 emphasis / 700 display. No light / black extremes — the brand reads as engineered.
- **Eyebrow positive-tracked uppercase 12px is the section header.** Every meaningful section has one above the headline.
- **No mono.** Despite being a developer-tools brand, the marketing surface uses no monospace face — code voice is reserved for in-product surfaces.

### Note on Font Substitutes

If implementing without hashicorpSans, suitable open-source substitutes include **Inter** (closest geometric character set), **Geist Sans**, or **IBM Plex Sans**. Inter at weights 500 / 600 / 700 closely approximates hashicorpSans''s proportions; expect to manually adjust line-heights down by ~0.02 to match.', '{"sourcePath":"docs/design-md/hashicorp/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System

- **Base unit**: 8px (the primary increments are 4 / 8 / 12 / 16 / 24 / 32 / 48).
- **Tokens (front matter)**: `{spacing.hair}` 1px · `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on product cards; `{spacing.xl}` 32px on pricing cards; `{spacing.xxl}` 48px on CTA banners.
- Button padding: 10px vertical · 18px horizontal on `{components.button-primary}`.
- Universal rhythm constant: `{spacing.section}` (96px) vertical gap between major sections.

### Grid & Container

- Max content width sits around 1280px with side gutters scaling from `{spacing.xxl}` on desktop down to `{spacing.lg}` on mobile.
- Product card grids are 3-up on desktop, 2-up at tablet, 1-up on mobile.
- Pricing tier grid is 3-up across desktop; comparison table beneath uses fixed-width left column.
- Resource directory (PDF library) uses 4-up dense thumbnail grid.

### Whitespace Philosophy

The dark canvas IS the whitespace. Sections separate by surface lift (canvas → surface-1) rather than by gaps in white. Within a section, generous `{spacing.xl}` 32px gaps separate cards; `{spacing.lg}` 24px separates rows.', '{"sourcePath":"docs/design-md/hashicorp/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Canvas-mounted display type, hero, footer |
| 1 (charcoal lift) | `{colors.surface-1}` background + 1px `rgba(178,182,189,0.1)` border | Default cards, resource tiles, pricing cards |
| 2 (surface-2 lift) | `{colors.surface-2}` background + 1px `{colors.hairline}` border | Featured pricing card, hovered cards, sub-nav |
| 3 (product chromatic) | Per-product accent color background — Terraform purple, Vault yellow, Waypoint cyan | Product showcase cards |

The product chromatic level isn''t a "modal lift" — it''s an identity device. A Terraform card sits at the same z-plane as a feature-card; the difference is meaning, not depth.

### Decorative Depth

- **3D product visuals** — isometric purple cubes (Terraform), translucent yellow safes (Vault), and similar product-tinted illustrations sit in the right column of hero sections.
- **1px translucent gray hairlines** are the dominant edge — borders are visible without competing.
- **No drop shadows on dark.** Cards lift via surface change, never shadow.', '{"sourcePath":"docs/design-md/hashicorp/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips / badges |
| `{rounded.sm}` | 6px | Inline tag |
| `{rounded.md}` | 8px | All CTA buttons, form inputs, list items |
| `{rounded.lg}` | 12px | Feature cards, product cards, pricing cards |
| `{rounded.xl}` | 16px | Large illustrative tiles |
| `{rounded.xxl}` | 24px | CTA banner panels |
| `{rounded.pill}` | 9999px | Eyebrow-style product pills (small chips) |
| `{rounded.full}` | 9999px | Avatar circles (rare on marketing) |

### Photography & Illustration Geometry

- Product 3D illustrations use full-bleed within their container — no rounded inner mask.
- Logo chips in the customer marquee sit on `{rounded.sm}` 6px tiles with 1px hairline.
- Resource thumbnails use `{rounded.lg}` 12px corners.', '{"sourcePath":"docs/design-md/hashicorp/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — White rounded-rect CTA. Used as primary CTA on all pages.
- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink}`, type `{typography.button}`, padding 10px 18px, rounded `{rounded.md}`.
- Pressed state lives in `button-primary-pressed`.

**`button-secondary`** — Charcoal rounded-rect. Secondary CTA, "Read docs" / "Talk to sales".
- Background `{colors.surface-2}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

**`button-tertiary`** — Bare ghost button on canvas with text-only treatment.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

**`button-product-terraform`** — Terraform-tinted CTA on Terraform pages.
- Background `{colors.product-terraform}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

**`button-product-vault`** — Vault-yellow CTA.
- Background `{colors.product-vault}`, text `{colors.inverse-ink}` (yellow needs dark text), type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

**`button-product-waypoint`** — Waypoint-cyan CTA.
- Background `{colors.product-waypoint}`, text `{colors.inverse-ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

(Vagrant blue, Nomad green, Consul red, Boundary coral follow the same pattern with their respective `{colors.product-*}` token.)

### Cards & Containers

**`product-card`** — Default product showcase card — surface-1 charcoal.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`product-card-terraform`** — Product card with Terraform purple ground (used as identity surface, not modal elevation).
- Background `{colors.product-terraform}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`product-card-vault`** — Vault-yellow ground.
- Background `{colors.product-vault}`, text `{colors.inverse-ink}`, otherwise identical structure.

**`product-card-waypoint`** — Waypoint-cyan ground.
- Background `{colors.product-waypoint}`, text `{colors.inverse-ink}`, otherwise identical structure.

(Other product variants follow the same shape with their respective product token.)

**`feature-card`** — Generic feature highlight on surface-1.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`pricing-card`** — Pricing tier on `/en/pricing`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 32px.

**`pricing-card-featured`** — Recommended tier (visually emphasized via surface lift).
- Background `{colors.surface-2}`, otherwise identical structure.

**`resource-card`** — PDF / whitepaper / guide tile in the resources directory.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.lg}`, padding 16px.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on pricing seat-count and contact forms.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 10px 14px.
- Focused state retains the same surface; the focus ring is a 1px `{colors.accent-blue}` outline.

### Pills & Chips

**`product-pill`** — Small product-name chip used above hero headlines and on resource cards to label which product a piece of content belongs to.
- Background `{colors.surface-1}`, text `{colors.ink-muted}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 4px 10px.

### Comparison Table

**`comparison-row`** — Single row inside the pricing comparison table.
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.body-sm}`. Row separator is `{colors.hairline-soft}`.

### CTA Banner

**`cta-banner`** — Large rounded panel used at the bottom of long-form pages with a closing CTA.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.subhead}`, rounded `{rounded.xxl}`, padding 48px.

### Navigation

**`top-nav`** — Sticky black bar with HashiCorp logomark left, primary nav links centered, and a `button-primary` ("Sign up") + `button-secondary` ("Sign in") pair right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 64px.
- Mobile: collapses primary links into a hamburger; the primary CTA remains visible.

### Footer

**`footer`** — Dense link grid on `{colors.canvas}` with the wordmark at left and 5–6 columns of caption-sized links.
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.caption}`, padding 64px 32px.', '{"sourcePath":"docs/design-md/hashicorp/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do

- Reserve `{colors.canvas}` (black) and `{colors.surface-1}` (charcoal) as the system''s two anchor surfaces. Every band of the page is one or the other.
- When introducing a section about a specific HashiCorp product, use that product''s `{colors.product-*}` token consistently — for the section pill, the CTA button, and (where appropriate) the showcase card background.
- Use `{rounded.md}` 8px on CTA buttons; HashiCorp''s brand reads as engineered, not consumer.
- Pair tight display line-heights (1.17–1.21) with relaxed body line-heights (1.50–1.71). The contrast IS the brand voice.
- Use the eyebrow typography (`{typography.eyebrow}`, uppercase, 0.6px tracking) above every meaningful section.
- Use surface lift (canvas → surface-1 → surface-2) to express hierarchy on dark.
- Reserve product-chromatic cards for product identity; keep generic feature cards on `{colors.surface-1}`.

### Don''t

- Don''t ship a light-mode marketing page. HashiCorp''s marketing brand IS dark.
- Don''t introduce mid-tone gray text outside the documented `ink` / `ink-muted` / `ink-subtle` set.
- Don''t square off CTA corners — use `{rounded.md}` 8px, not 0px.
- Don''t use a product accent color for a CTA on a page that isn''t about that product. Terraform purple on the Vault page is a brand violation.
- Don''t combine multiple product accents in the same viewport — the system says "this section is about THIS tool", and mixing accents breaks that signal.
- Don''t add drop shadows on dark; surface lift carries elevation.
- Don''t replace `hashicorpSans` with a display-only sans for headlines and a different family for body. The brand is held together by one family across the full hierarchy.', '{"sourcePath":"docs/design-md/hashicorp/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop-XL | 1440px | Default desktop layout |
| Desktop | 1280px | Pricing 3-up grid maintained |
| Tablet | 1024px | Product card grid 3-up → 2-up |
| Mobile-Lg | 768px | Pricing comparison becomes per-tier accordion; nav becomes hamburger |
| Mobile | 480px | Single-column everything; display-xl scales 80px → ~36px |

### Touch Targets

- CTA buttons (`button-primary`, `button-secondary`) maintain ≥40px tap height across viewports.
- Product pills are 24px tall on desktop and grow to 28px on touch viewports.
- Form inputs hold ≥44px tap target on touch viewports.

### Collapsing Strategy

- **Nav**: horizontal nav with right-anchored CTAs collapses to a hamburger overlay below 768px. The primary CTA stays visible on the bar.
- **Product card grid**: 3-up → 2-up at 1024px → 1-up below 768px.
- **Pricing comparison table**: collapses into per-tier accordions below 768px to avoid horizontal scroll.
- **Display type**: `{typography.display-xl}` 80px scales toward `{typography.display-md}` 40px on mobile while preserving the negative-tracking percentage.

### Image Behavior

- 3D product illustrations (cubes, safes, etc.) maintain aspect ratio and never crop; below 768px they shrink rather than reflow.
- Customer logo marquee scales horizontally and may wrap to a second row at narrow widths.', '{"sourcePath":"docs/design-md/hashicorp/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. When introducing a new section, decide first whether it''s a generic feature (surface-1) or a product-identity section (product-* color).
3. Default body to `{typography.body}` at 500 weight; reach for `{typography.subhead}` only inside CTA banners and feature cards.
4. Run `npx @google/design.md lint DESIGN.md` after edits.
5. Add new product variants as separate component entries (`product-card-nomad`, `button-product-consul`, etc.).
6. Treat the per-product palette as identity tokens, not decoration. If you reach for a product color outside its product context, the brand is drifting.
7. Eyebrow type is mandatory above every section — skipping it makes sections read as floating.', '{"sourcePath":"docs/design-md/hashicorp/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- The exact product-color hex values come from the `--mds-color-*` CSS variable set extracted directly; they are HashiCorp''s canonical brand spec.
- Shadow tokens are not extensively documented because the dark surface system uses surface lift instead of shadow elevation.
- Form-field error and validation styling is not visible on the inspected pages.
- Dark mode is the only marketing mode — light-mode adaptation is not documented.
- Product-card variants for Consul, Nomad, Vagrant, and Boundary follow the documented Terraform / Vault / Waypoint pattern but are referenced in prose only; if they need formal entries they can be added as `product-card-consul`, `product-card-nomad`, etc.', '{"sourcePath":"docs/design-md/hashicorp/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_1', '#000000', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_3', '#2b89ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_4', '#b2b6bd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_5', '#656a76', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_6', '#15181e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_7', '#1f232b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_8', '#3b3d45', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_9', '#252830', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_10', '#7b42bc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_11', '#911ced', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_12', '#ffcf25', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_13', '#e62b1e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_14', '#14c6cb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_15', '#12b6bb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_16', '#1868f2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_17', '#00ca8e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_18', '#f24c53', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_19', '#fbeabf', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_20', '#bb5a00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_21', '#101a59', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md'), 'color', 'color_22', '#a737ff', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/hashicorp/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/hashicorp/DESIGN.md';


-- Hp
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Hp', 'hp', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/hp/DESIGN.md', null, 'seeded', '---
version: alpha
name: HP-design-analysis
description: An inspired interpretation of HP''s design language — a white-paper enterprise-consumer system anchored by HP Electric Blue (`#024ad8`) as the lone signal CTA, near-black ink (`#1a1a1a`) for headlines, geometric Forma-DJR sans throughout, and angular blue-chevron decorations that nod to the HP wordmark''s slashes. Cards round at 8–16px, photos sit in soft 16px frames, and dark navy slabs anchor the customer-story and "how can we help" closing bands.

colors:
  primary: "#024ad8"
  primary-bright: "#296ef9"
  primary-deep: "#0e3191"
  primary-soft: "#c9e0fc"
  on-primary: "#ffffff"
  ink: "#1a1a1a"
  ink-deep: "#000000"
  ink-soft: "#292929"
  on-ink: "#ffffff"
  canvas: "#ffffff"
  paper: "#ffffff"
  cloud: "#f7f7f7"
  fog: "#e8e8e8"
  steel: "#c2c2c2"
  graphite: "#636363"
  charcoal: "#3d3d3d"
  hairline: "#e8e8e8"
  hairline-strong: "#c2c2c2"
  link: "#024ad8"
  link-pressed: "#0e3191"
  bloom-coral: "#ff5050"
  bloom-rose: "#f9d4d2"
  bloom-deep: "#b3262b"
  bloom-wine: "#5a1313"
  storm-mist: "#8ebdce"
  storm-sea: "#7fadbe"
  storm-deep: "#356373"
  error: "#b3262b"

typography:
  display-xxl:
    fontFamily: Forma DJR Micro
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  display-xl:
    fontFamily: Forma DJR Micro
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  display-lg:
    fontFamily: Forma DJR Micro
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  display-md:
    fontFamily: Forma DJR Micro
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  display-sm:
    fontFamily: Forma DJR Micro
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.17
    letterSpacing: 0
  display-xs:
    fontFamily: Forma DJR Micro
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  body-lg:
    fontFamily: Forma DJR Micro
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0
  body-md:
    fontFamily: Forma DJR Micro
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.38
    letterSpacing: 0
  body-emphasis:
    fontFamily: Forma DJR Micro
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.38
    letterSpacing: 0
  caption-md:
    fontFamily: Forma DJR Micro
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption-sm:
    fontFamily: Forma DJR Micro
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0
  caption-bold:
    fontFamily: Forma DJR Micro
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  link-md:
    fontFamily: Forma DJR Micro
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.38
    letterSpacing: 0
  button-md:
    fontFamily: Forma DJR Micro
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.7px
    textTransform: uppercase
  button-sm:
    fontFamily: Forma DJR Micro
    fontSize: 12.6px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 0.126px
  price-md:
    fontFamily: Forma DJR Micro
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.17
    letterSpacing: 0

rounded:
  none: 0px
  xs: 2px
  sm: 3px
  md: 4px
  lg: 8px
  xl: 16px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 12px 24px
    height: 44px
  button-primary-pressed:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.on-primary}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 12px 24px
    height: 44px
  button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 12px 24px
    height: 44px
  button-outline-ink:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 12px 24px
    height: 44px
  button-text-link:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.link-md}"
    padding: 4px 0
  badge-pill-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 6px 12px
  badge-pill-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 6px 12px
  badge-sale-coral:
    backgroundColor: "{colors.bloom-coral}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: 4px 8px
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
  text-input-search:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 40px
  card-product:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 24px
  card-product-feature:
    backgroundColor: "{colors.cloud}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 32px
  card-pricing-tier:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 24px
  card-pricing-tier-featured:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 24px
  card-customer-story:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 16px
  card-article-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 16px
  card-category-icon:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-emphasis}"
    rounded: "{rounded.lg}"
    padding: 16px
  promo-strip-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 48px
  hero-promo-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 32px
  utility-strip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-md}"
    height: 36px
    padding: 0 24px
  nav-bar-top:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    height: 64px
    padding: 0 32px
  nav-link:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 8px 16px
  category-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-emphasis}"
    rounded: "{rounded.pill}"
    padding: 8px 20px
  category-tab-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  faq-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-emphasis}"
    rounded: "{rounded.lg}"
    padding: 20px 24px
  chevron-decoration:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.none}"
  help-band-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    padding: 64px 32px
  footer-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    padding: 64px 32px
---

## Overview

HP reads like a long-running consumer-electronics catalog crossed with an enterprise-software product page. The whole system sits on **pure white** (`{colors.canvas}` — `#ffffff`) with thin gray panels (`{colors.cloud}` / `{colors.fog}`) for alternating section bands. There is one chromatic action color — **HP Electric Blue** (`{colors.primary}` — `#024ad8`) — and one ink color (`{colors.ink}` — `#1a1a1a`); together they do ninety percent of the work. Type is a single family across every surface: **Forma DJR Micro**, HP''s bespoke geometric grotesque, set at weight 500 for headlines and 400 for body — clean, neutral, slightly mechanical.

The signature gesture is **angular blue chevrons** — sharp 0-radius slashes derived from the HP wordmark''s pair of parallel slashes — that anchor the homepage hero, the laptop-page hero, and the printer pricing page. They appear on the left and right edges of the primary banner card, layered behind product photography. Outside those decorative slashes, every other surface is rectilinear with **soft 8–16px corners** on cards and a 4px corner on buttons.

The system breaks into three voice modes: a **white commercial body** for product browsing (cards, category icons, pricing tiers); a **dark navy slab** (`{colors.ink}` near-black) for testimonial bands, the closing "How can we help?" footer-prelude, and the page footer; and a **light fog band** (`{colors.cloud}` / `{colors.fog}`) for utility sections like comparison strips and FAQ accordions. The blue accent appears only on filled CTAs, link text, the chevron decorations, and the active price-stamp on a featured tier — never as a section background.

**Key Characteristics:**
- Pure white canvas (`{colors.canvas}`) with deep ink (`{colors.ink}`) running every body surface; light fog bands (`{colors.cloud}`, `{colors.fog}`) alternate for section rhythm
- HP Electric Blue (`{colors.primary}`) is the lone CTA fill and link color; it appears at most twice per viewport
- Bespoke Forma DJR Micro across every surface — display, body, button, caption — at weights 400 / 500 / 600 / 700
- Cards round at `{rounded.xl}` (16px) for product/pricing tiles; buttons sit at `{rounded.md}` (4px) with capitalize labels
- Geometric blue chevrons (`{colors.primary}` rectangles cut at 45°) frame hero photography and reinforce the wordmark
- Dark-navy slabs (`{colors.ink}`) close every page rhythm — testimonial bands, "how can we help?" prelude, and the footer
- Section rhythm: utility-strip → top nav → white body → cloud-band → ink slab → cloud-band → ink footer

## Colors

> **No Interaction sub-section.** Hover colors are silently filtered. Allowed sub-sections: Brand & Accent, Surface, Text, Semantic.

### Brand & Accent
- **HP Electric Blue** (`{colors.primary}` — `#024ad8`): the system''s lone signal — primary CTA fill, link color, chevron-decoration fill, active sub-nav indicator. Reserved.
- **Bright Blue** (`{colors.primary-bright}` — `#296ef9`): a slightly lighter variant used inside dark slabs (testimonial-card buttons, dark-band CTA links) where the deeper blue would muddy.
- **Deep Navy** (`{colors.primary-deep}` — `#0e3191`): pressed state for the primary CTA and the visited-link color.
- **Soft Blue** (`{colors.primary-soft}` — `#c9e0fc`): pale-blue surface used inside customer-story cards and selection chips.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): the universal page background. White, full opacity.
- **Paper** (`{colors.paper}` — `#ffffff`): card surfaces — same white as canvas, with hairline borders or shadows providing the lift.
- **Cloud** (`{colors.cloud}` — `#f7f7f7`): the lightest gray section band, used for alternating-row backgrounds and product-feature card groups.
- **Fog** (`{colors.fog}` — `#e8e8e8`): a slightly darker gray surface band, used for FAQ outer panels and the "Trending laptops" header strip.
- **Steel** (`{colors.steel}` — `#c2c2c2`): hairline border used on outlined elements with stronger emphasis (focus states, active filter).
- **Bloom Coral / Bloom Rose** (`{colors.bloom-coral}` / `{colors.bloom-rose}` — `#ff5050`, `#f9d4d2`): the "Get 25% off" sale-tag chip + soft pink lifestyle accent on the sale hero.
- **Storm Mist / Sea / Deep** (`{colors.storm-mist}`, `{colors.storm-sea}`, `{colors.storm-deep}` — `#8ebdce`, `#7fadbe`, `#356373`): the teal-storm tones reserved for the printer-plan illustration backdrop and supporting infographic accents.

### Text
- **Ink** (`{colors.ink}` — `#1a1a1a`): the universal text color on white surfaces — headlines, body, button labels, navigation.
- **Ink Deep** (`{colors.ink-deep}` — `#000000`): pure black used for the wordmark and 1px hairline strokes around badge outlines.
- **Ink Soft** (`{colors.ink-soft}` — `#292929`): an alternate near-black used inside dark-navy slabs as a subtle textural shift.
- **On Ink** (`{colors.on-ink}` — `#ffffff`): pure white used for headline and body text on every dark-navy slab.
- **Charcoal** (`{colors.charcoal}` — `#3d3d3d`): muted body color on white surfaces — secondary descriptions, fine-print disclaimers.
- **Graphite** (`{colors.graphite}` — `#636363`): smaller-print color, used for legal lines and timestamp metadata.

### Semantic
- **Bloom Deep** (`{colors.bloom-deep}` — `#b3262b`) + **Bloom Wine** (`{colors.bloom-wine}` — `#5a1313`): error and discount-emphasis colors. The deep brick reads as "sale" or "destructive" depending on placement.
- **Storm Deep** (`{colors.storm-deep}` — `#356373`): used as a neutral status accent (e.g., printer-plan tier "Versatile" tier color).

## Typography

### Font Family

The voice is **single-family**: Forma DJR Micro (HP''s bespoke geometric grotesque, fallback Arial) across every surface — display, body, button, caption. Forma DJR Micro is a wide, slightly rounded grotesque designed at small optical sizes to stay legible at UI-chrome scale. HP runs it at weight 400 for body, 500 for display headlines, 600/700 for emphasis and button labels.

The 16/14/12-px caption tier carries the catalog metadata — model numbers, spec rows, fine print — at weight 400 with a 1.4–1.5 line-height. Button labels lift to weight 600/700 with positive 0.5–1.1px letter-spacing and uppercase transform — the only place the system tracks letters.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 72px | 500 | 1.0 | 0 | Hero headline (homepage, laptop hub) |
| `{typography.display-xl}` | 56px | 500 | 1.0 | 0 | Section headlines on landing pages |
| `{typography.display-lg}` | 44px | 500 | 1.0 | 0 | Sub-section headlines on shop pages |
| `{typography.display-md}` | 32px | 500 | 1.0 | 0 | Promo strip headlines, FAQ section headers |
| `{typography.display-sm}` | 24px | 500 | 1.17 | 0 | Card titles, pricing-tier names |
| `{typography.display-xs}` | 20px | 500 | 1.0 | 0 | Inline list headers, accordion labels |
| `{typography.body-lg}` | 18px | 400 | 1.33 | 0 | Lead paragraphs |
| `{typography.body-md}` | 16px | 400 | 1.38 | 0 | Default body |
| `{typography.body-emphasis}` | 16px | 500 | 1.38 | 0 | Bolded run-in copy |
| `{typography.caption-md}` | 14px | 400 | 1.5 | 0 | Specs, metadata, captions |
| `{typography.caption-bold}` | 14px | 700 | 1.3 | 0 | Sale tags, in-card highlights |
| `{typography.caption-sm}` | 12px | 400 | 1.33 | 0 | Footnotes, legal lines |
| `{typography.link-md}` | 16px | 500 | 1.38 | 0 | Inline link emphasis |
| `{typography.button-md}` | 14px | 600 | 1.4 | 0.7px | Primary/secondary button labels (uppercase) |
| `{typography.button-sm}` | 12.6px | 700 | 1.0 | 0.126px | Compact button labels in tight cells |
| `{typography.price-md}` | 24px | 500 | 1.17 | 0 | Tier and product price stamps |

### Principles

The typographic decision worth flagging: HP runs **weight 500 for every display size**, including the largest 72px hero headline. Most editorial systems jump to 600/700 at hero scale; HP doesn''t. The result feels open and approachable rather than commanding — appropriate for a brand that sells across consumer, SMB, and enterprise audiences in the same catalog.

Forma DJR Micro''s rounded-grotesque shapes do most of the warmth. There''s no italic in the system except inside legal disclaimers; emphasis is carried by weight (500 → body-emphasis, 700 → caption-bold) instead.

### Note on Font Substitutes

Forma DJR Micro is proprietary (Commercial Type / Mark Caneso). Closest open-source substitutes:
- **Inter** at weights 400 / 500 / 600 / 700 — slightly narrower than Forma DJR Micro; bump font-size by ~3% to compensate
- **Manrope** at weights 400 / 500 / 600 / 700 — closer in proportion, gentler curves; use directly with no metric adjustment
- **Roboto** at weights 400 / 500 / 700 — flatter character; use as last-resort fallback

When swapping, set body line-height to 1.4 and display line-height to 1.0 explicitly — the Forma DJR Micro line-height numbers are tight, and most substitutes default looser.

## Layout

### Spacing System

- **Base unit**: 8px. Smaller half-step at 4px. The scale is gentle — most card padding lands at 16px or 24px; section gap at 80px.
- **Tokens (front matter)**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 20px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.section}` 80px
- **Section padding**: `{spacing.section}` (80px) vertical between major bands on desktop; collapses to ~48px on mobile.
- **Card internal padding**: `{spacing.xl}` (24px) for product cards; `{spacing.xxl}` (32px) for promo strips and feature cards; `{spacing.md}` (16px) for compact article tiles.
- **Gutter**: `{spacing.xl}` (24px) between grid columns at desktop; `{spacing.md}` (16px) on tablet/mobile.

The 80px section gap is the universal rhythm constant — it appears between every major homepage band, between the hero and the comparison table on the printer-plan page, and between feature rows on the laptop-shop page.

### Grid & Container

- **Desktop max-width**: 1366px content container with full-bleed-on-canvas section backgrounds.
- **Hero**: a single full-width photo card (homepage and laptop-hub hero) with the headline overlay positioned upper-left or upper-right.
- **Product family grid**: 4 columns at >1200px, 3 at 1024–1199px, 2 at 768–1023px, 1 below 768px.
- **Pricing tiers**: 4 columns at >1024px, 2x2 grid at 768–1023px, single-column accordion below 768px.
- **Footer**: 5-column link grid at >1024px, collapsing to 2-column then accordion on mobile.

### Whitespace Philosophy

Whitespace is **commercial-clean** — generous around hero photography, tight around catalog spec rows. Product cards leave breathing room above and below the photo (≥32px) so the laptop or printer reads as a hero shot rather than a thumbnail. The fine-print disclaimer regions (legal, footnote rows) tighten line-height to 1.3 and shrink type to 11–12px so the bulk of fine print stays compact.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow. | Section bands (white, cloud, fog), full-bleed photo heroes |
| 1 — Hairline | 1px solid `{colors.hairline}` (`#e8e8e8`) border, no shadow. | Outlined buttons, comparison-table cells, FAQ accordion outers |
| 2 — Soft Lift | `0 2px 8px rgba(26, 26, 26, 0.08)`. | Product cards, pricing-tier columns, customer-story tiles |
| 3 — Floating Modal | `0 8px 24px rgba(26, 26, 26, 0.12)`. | Add-to-cart drawer, mobile-nav sheet, image zoom modal |

The system is mostly flat — depth is communicated by **color contrast** (cloud-band vs. white card on the same band) rather than shadow elevation. The Soft Lift level is the workhorse for the catalog — every product tile and pricing column gets it; nothing else does. Modal-floating is rare and reserved for transient overlays.

### Decorative Depth

The system''s most distinctive depth gesture is the **HP blue chevron pair** — two angular `{colors.primary}` slashes (no radius, no shadow) that sit on the left and right of the homepage hero card and the laptop-shop hero. They''re not decorative noise; they''re a literal echo of the HP wordmark''s two parallel slashes, scaled up to architectural size. Treat them as a brand artifact, not a generic geometric flourish.

Photography on the homepage and laptop-shop pages frames product imagery inside `{rounded.xl}` (16px) containers with a soft 1px hairline. Lifestyle photography (testimonials, "How HP works for X") sits full-bleed inside dark-navy slabs without rounding.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero chevron decorations, full-bleed photo heroes, marquee strips |
| `{rounded.xs}` | 2px | Secondary chip backgrounds, sale-tag pills |
| `{rounded.sm}` | 3px | Default secondary CTA radius (small touch zones) |
| `{rounded.md}` | 4px | Primary buttons, secondary buttons, text inputs |
| `{rounded.lg}` | 8px | Badge pills, category-icon cards, FAQ row containers |
| `{rounded.xl}` | 16px | Product cards, pricing tiers, customer-story tiles, photo frames |
| `{rounded.pill}` | 9999px | Category sub-nav tabs, search-pill input, filter chips |

The system maintains a clear two-tier philosophy: **buttons stay sharp** (4px, almost rectilinear) while **cards and photo frames stay soft** (16px). This split is the visual signature — sharp interactive elements against softer container surfaces.

### Photography Geometry

Hero photography sits in `{rounded.xl}` (16px) frames with no border. Product family thumbnails inside the laptop-grid are 1:1 (square) on a `{colors.canvas}` background, padded so the laptop is shown at ~70% of the frame. Customer-story photography uses 16:9 inside the same `{rounded.xl}` frame. There are no full-bleed circular avatars; testimonial avatars are 4px-rounded squares.

## Components

> **No hover states documented.** Every component spec below documents only Default and Active/Pressed states. Variants live as separate front-matter entries.

### Buttons

**`button-primary`** — the lone HP Electric Blue CTA
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}` (uppercase, 0.7px tracking), padding `{spacing.sm} {spacing.xl}` (12 × 24), height 44px, rounded `{rounded.md}`
- Pressed state `button-primary-pressed` — background `{colors.primary-deep}`, same text
- Disabled state `button-primary-disabled` — background `{colors.steel}`, white text
- Used for: "Buy now", "Shop now", "Get a printer", primary form submit

**`button-ink`** — black filled CTA
- Background `{colors.ink}`, text `{colors.on-primary}`, padding `{spacing.sm} {spacing.xl}`, height 44px, rounded `{rounded.md}`, type `{typography.button-md}`
- Used for: "Buy now" on dark photo overlays, secondary primary actions where the blue would clash with imagery

**`button-outline`** — blue-text outlined CTA
- Background `{colors.canvas}`, text `{colors.primary}`, 1px `{colors.primary}` border, padding `{spacing.sm} {spacing.xl}`, height 44px, rounded `{rounded.md}`
- Used for: "Compare", "Customize", "Learn more" — secondary actions on white surfaces

**`button-outline-ink`** — black-text outlined CTA
- Background `{colors.canvas}`, text `{colors.ink}`, 1px `{colors.ink}` border, padding `{spacing.sm} {spacing.xl}`, height 44px, rounded `{rounded.md}`
- Used for: "View" buttons inside product family card grids — neutral against the blue primary

**`button-text-link`** — inline blue link with underline
- Background `{colors.canvas}`, text `{colors.primary}`, type `{typography.link-md}`, padding `{spacing.xxs} 0`
- Used for: "See details", "Read more" inside cards and disclaimer rows

### Cards & Containers

**`card-product`** — the workhorse product tile
- Background `{colors.canvas}`, rounded `{rounded.xl}` (16px), padding `{spacing.xl}` (24px), Soft Lift shadow
- Layout: hero photo (1:1 ratio) on top, title in `{typography.display-xs}`, spec rows in `{typography.caption-md}`, price in `{typography.price-md}`, CTA pinned to bottom
- Used for: laptop catalog cards, desktop catalog cards

**`card-product-feature`** — full-row feature card with photo + copy
- Background `{colors.cloud}`, rounded `{rounded.xl}`, padding `{spacing.xxl}` (32px)
- Layout: photo on the left (50% width), copy on the right with section eyebrow + title + body + CTA pair
- Used for: "Trending laptops" feature rows, "Shop these must haves"

**`card-pricing-tier`** + **`card-pricing-tier-featured`**
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, Soft Lift shadow
- Tier name in `{typography.display-sm}`, monthly price in `{typography.display-md}` with `{typography.caption-md}` cadence, page count caption, full feature list, primary CTA
- Featured tier carries `{colors.primary}` text accent on the price-stamp + a `{colors.primary}` thin top border instead of a colored card background — never inverted to dark

**`card-customer-story`** — the three-up testimonial tile
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.md}` (16px), Soft Lift shadow
- 16:9 photo at top in `{rounded.xl}` frame, quote excerpt in `{typography.body-md}`, attribution row at the bottom
- Used in the "See what our customers say" homepage section

**`card-article-tile`** — the four-up "Latest from HP" tile
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.md}`, Soft Lift shadow
- 16:9 thumbnail at top, date eyebrow in `{typography.caption-sm}`, title in `{typography.body-emphasis}`, "Read more" link

**`card-category-icon`** — the small icon-and-label card in the homepage "Our Products" row
- Background `{colors.canvas}`, rounded `{rounded.lg}` (8px), padding `{spacing.md}`
- 48px icon at top, label in `{typography.body-emphasis}` below
- Used for: Laptops, Desktops, Printers, Computer Tools, Accessories, Enterprise Solutions

**`hero-promo-card`** — the homepage hero card with chevron decorations
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xxl}` (32px)
- Photography occupies left half; copy block (eyebrow + headline + price stamp + CTA pair) occupies right half
- Flanked by `chevron-decoration` blue slashes outside the card''s bounding box on left and right edges

**`promo-strip-dark`** — the inline dark navy promo block
- Background `{colors.ink}`, text `{colors.on-ink}`, rounded `{rounded.xl}`, padding `{spacing.xxl} 48px`
- Used for: "When did work start getting in the way of work?" mid-page promo, the SMB testimonial slab

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Background `{colors.canvas}`, text `{colors.ink}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px
- 1px `{colors.steel}` border in default; gains 1px `{colors.ink}` border on focus (no halo)

**`text-input-search`** — pill search in the top nav
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 40px, 1px `{colors.steel}` border, magnifying-glass icon at right

**`badge-pill-ink`** — filled tag pill
- Background `{colors.ink}`, text `{colors.on-primary}`, rounded `{rounded.lg}`, padding 6px 12px, type `{typography.body-md}`
- Used inline next to product titles to mark "New" or featured indicators

**`badge-pill-outline`** — outlined tag pill
- Background `{colors.canvas}`, text `{colors.ink}`, 1px `{colors.ink}` border, rounded `{rounded.lg}`, padding 6px 12px

**`badge-sale-coral`** — the sale price-stamp
- Background `{colors.bloom-coral}`, text `{colors.on-primary}`, rounded `{rounded.sm}`, padding `{spacing.xxs} {spacing.xs}`, type `{typography.caption-bold}`
- Used for: "Save $200", "25% off" overlay tags on hero promo cards

### Navigation

**`utility-strip`** — the top-of-page utility bar
- Background `{colors.ink}`, text `{colors.on-primary}`, height 36px, padding 0 {spacing.xl}, type `{typography.caption-md}`
- Holds: country/locale picker, "For Business / For Home" toggle, "Sign in" link, cart link

**`nav-bar-top`** — desktop top nav (sits below utility strip)
- Background `{colors.canvas}`, height 64px, padding 0 32px
- Layout: HP wordmark logo flush left → middle category list (Laptops / Desktops / Printers / Accessories / Solutions / Support) → right slot with Search field, Sign-in link, Cart icon
- 1px `{colors.hairline}` bottom border separates nav from page

**`nav-link`**
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, padding `{spacing.xs} {spacing.md}`
- Active page draws a 2px `{colors.primary}` underline below the text baseline

**Top Nav (Mobile)**
- Same height, hamburger icon replaces the middle category list, Search and Cart stay visible
- Drawer expands as a full-canvas sheet with `{typography.body-lg}` link list and a sticky Sign-in CTA at bottom

**`category-tab`** + **`category-tab-active`** — the pill sub-nav
- Default: background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-emphasis}`, rounded `{rounded.pill}`, padding `{spacing.xs} {spacing.lg}`
- Active: background `{colors.ink}`, text `{colors.on-primary}`, same rounding
- Used on the laptop-shop page for "All / Trending / On Sale" filtering, and on the homepage "How can we help?" closing band

### Signature Components

**`chevron-decoration`** — the geometric blue slash motif
- Background `{colors.primary}`, rounded `{rounded.none}`, no shadow
- Renders as a sharp parallelogram cut at ~60° angle, sized to the height of the hero card it flanks
- Reserved for hero bands and full-page banners — never decorative noise inside cards

**`faq-row`** — the accordion row on the printer-plan FAQ
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg} {spacing.xl}`, type `{typography.body-emphasis}`
- 1px `{colors.hairline}` divider between rows; chevron-down icon on the right collapsed, chevron-up when expanded
- Body answer renders inside the same row container in `{typography.body-md}` after expansion

**`help-band-dark`** — the closing "How can we help?" prelude band
- Background `{colors.ink}`, text `{colors.on-primary}`, padding 64px {spacing.xl}
- Layout: large lifestyle photograph as the band background (low-opacity) with chip-style category tabs centered: Browse Topics / Live Chat / Contact / Diagnose / Order Status

**`footer-dark`**
- Background `{colors.ink}`, text `{colors.on-primary}`, type `{typography.body-md}`, padding 64px {spacing.xl}
- 5-column link grid (Company / Shop / Support / Resources / Connect) with `{typography.body-emphasis}` headers and `{typography.caption-md}` link rows
- Bottom strip carries social icons, language picker, and legal lines in `{typography.caption-sm}` muted to `{colors.steel}`

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` for the primary CTA, link color, and `chevron-decoration` motif — at most twice per viewport
- Set every headline in Forma DJR Micro at weight 500 with line-height 1.0 — resist the urge to bump weight at hero scale
- Use `{rounded.xl}` (16px) for cards and photo frames; `{rounded.md}` (4px) for buttons and inputs — keep the two-tier split sharp
- Pair white `{colors.canvas}` body bands with `{colors.cloud}` (`#f7f7f7`) alternating bands; let the gray do the breathing
- Close every page rhythm with a dark-navy `{colors.ink}` slab — the "How can we help?" prelude + footer
- Set button labels in uppercase with `{typography.button-md}` (0.7px tracking) — the only place the system tracks letters
- Use Soft Lift shadow exclusively for product cards and pricing tiers — leave section bands flat
- Frame product photography inside `{rounded.xl}` containers; never use full-bleed circular masks

### Don''t
- Don''t introduce secondary saturated colors outside `{colors.primary}` family + the `bloom-coral` sale-tag and `storm` printer-plan accents
- Don''t apply heavy material shadows — depth is via color contrast (cloud vs. white) and Soft Lift only
- Don''t round buttons above `{rounded.md}` (4px); a soft 8px+ button reads as a different brand
- Don''t run Forma DJR Micro below 12px — small caption at 11px is the floor
- Don''t use the chevron decoration as inline noise; it is a hero-only architectural element tied to the wordmark
- Don''t drop ink text opacity to create hierarchy — switch surface or shift to `{colors.charcoal}` / `{colors.graphite}` instead
- Don''t replace the HP wordmark with a generic sans lockup; the wordmark is a custom mark with its own ratio

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 480px | Single-column stack; hamburger nav; section padding drops to ~48px; hero serif scales to ~36px |
| Mobile-Large | 480–767px | Same column count; hero scales to ~44px; pricing tiers stack vertically |
| Tablet | 768–1023px | 2-column product grid; pricing 2x2; nav still full text labels |
| Desktop | 1024–1279px | 3-column product grid; 4-column pricing; full nav |
| Desktop-Large | ≥ 1280px | 4-column product grid; 1366px content max-width with full-bleed bands |

### Touch Targets

Every interactive element clears 44×44px on mobile. `button-primary` at 44px height + 24px horizontal padding meets WCAG-AAA touch target. `category-tab` at 8px 20px padding bumps to 12px 24px on touch screens. Nav-link tap areas extend invisibly beyond the text run to the full 44px row height. Sticky cart/sign-in icons in the top nav use 44×44 invisible hit boxes around their visible 24×24 glyph.

### Collapsing Strategy

- **Utility strip**: stays visible on every breakpoint; dropdowns collapse into a single "Account" icon below 768px
- **Top nav**: middle category list collapses into a hamburger drawer below 1024px; the right-side Search + Sign-in + Cart stay visible
- **Hero**: stays single-column at every breakpoint; chevron decorations shrink to ~60% size on tablet and disappear entirely on mobile
- **Product family grid**: 4 → 3 → 2 → 1 column as breakpoints shrink; cards keep `{rounded.xl}` corners at every size
- **Pricing comparison table**: 4-column grid on desktop collapses to 2x2 on tablet, then stacks into individual accordion-style cards on mobile
- **Footer**: 5-column link grid → 2-column tablet → single-column accordion on mobile; HP wordmark stays flush left

### Image Behavior

Hero photography uses `{rounded.xl}` containers at every breakpoint. The chevron decorations vanish on mobile; the underlying photo card centers in the viewport. Lifestyle photography in the testimonial and "how-can-we-help" bands maintains 16:9 ratio with horizontal cropping rather than letterboxing on mobile. There are no art-direction crop swaps between desktop and mobile — the same image is used at every size.

## Iteration Guide

1. Focus on ONE component at a time; resist refactoring an entire section in one pass
2. Reference component names and tokens directly (`{colors.primary}`, `{typography.display-xxl}`, `{rounded.xl}`, `card-product`) — do not paraphrase to hex/px in prose
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically
4. Add new variants as separate component entries (`-pressed`, `-disabled`, `-focused`); never bury state inside prose
5. Default body to `{typography.body-md}`; reach for `{typography.body-emphasis}` for run-in bolds; keep display sizes for true heading roles
6. Keep `{colors.primary}` scarce — at most two flame elements per viewport (one CTA + one chevron decoration). Three flame items in one viewport is over-saturation
7. When introducing a new section band, choose from `{colors.canvas}` / `{colors.cloud}` / `{colors.fog}` / `{colors.ink}` — six pre-defined surface modes is the entire surface vocabulary
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

HP reads like a long-running consumer-electronics catalog crossed with an enterprise-software product page. The whole system sits on **pure white** (`{colors.canvas}` — `#ffffff`) with thin gray panels (`{colors.cloud}` / `{colors.fog}`) for alternating section bands. There is one chromatic action color — **HP Electric Blue** (`{colors.primary}` — `#024ad8`) — and one ink color (`{colors.ink}` — `#1a1a1a`); together they do ninety percent of the work. Type is a single family across every surface: **Forma DJR Micro**, HP''s bespoke geometric grotesque, set at weight 500 for headlines and 400 for body — clean, neutral, slightly mechanical.

The signature gesture is **angular blue chevrons** — sharp 0-radius slashes derived from the HP wordmark''s pair of parallel slashes — that anchor the homepage hero, the laptop-page hero, and the printer pricing page. They appear on the left and right edges of the primary banner card, layered behind product photography. Outside those decorative slashes, every other surface is rectilinear with **soft 8–16px corners** on cards and a 4px corner on buttons.

The system breaks into three voice modes: a **white commercial body** for product browsing (cards, category icons, pricing tiers); a **dark navy slab** (`{colors.ink}` near-black) for testimonial bands, the closing "How can we help?" footer-prelude, and the page footer; and a **light fog band** (`{colors.cloud}` / `{colors.fog}`) for utility sections like comparison strips and FAQ accordions. The blue accent appears only on filled CTAs, link text, the chevron decorations, and the active price-stamp on a featured tier — never as a section background.

**Key Characteristics:**
- Pure white canvas (`{colors.canvas}`) with deep ink (`{colors.ink}`) running every body surface; light fog bands (`{colors.cloud}`, `{colors.fog}`) alternate for section rhythm
- HP Electric Blue (`{colors.primary}`) is the lone CTA fill and link color; it appears at most twice per viewport
- Bespoke Forma DJR Micro across every surface — display, body, button, caption — at weights 400 / 500 / 600 / 700
- Cards round at `{rounded.xl}` (16px) for product/pricing tiles; buttons sit at `{rounded.md}` (4px) with capitalize labels
- Geometric blue chevrons (`{colors.primary}` rectangles cut at 45°) frame hero photography and reinforce the wordmark
- Dark-navy slabs (`{colors.ink}`) close every page rhythm — testimonial bands, "how can we help?" prelude, and the footer
- Section rhythm: utility-strip → top nav → white body → cloud-band → ink slab → cloud-band → ink footer', '{"sourcePath":"docs/design-md/hp/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> **No Interaction sub-section.** Hover colors are silently filtered. Allowed sub-sections: Brand & Accent, Surface, Text, Semantic.

### Brand & Accent
- **HP Electric Blue** (`{colors.primary}` — `#024ad8`): the system''s lone signal — primary CTA fill, link color, chevron-decoration fill, active sub-nav indicator. Reserved.
- **Bright Blue** (`{colors.primary-bright}` — `#296ef9`): a slightly lighter variant used inside dark slabs (testimonial-card buttons, dark-band CTA links) where the deeper blue would muddy.
- **Deep Navy** (`{colors.primary-deep}` — `#0e3191`): pressed state for the primary CTA and the visited-link color.
- **Soft Blue** (`{colors.primary-soft}` — `#c9e0fc`): pale-blue surface used inside customer-story cards and selection chips.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): the universal page background. White, full opacity.
- **Paper** (`{colors.paper}` — `#ffffff`): card surfaces — same white as canvas, with hairline borders or shadows providing the lift.
- **Cloud** (`{colors.cloud}` — `#f7f7f7`): the lightest gray section band, used for alternating-row backgrounds and product-feature card groups.
- **Fog** (`{colors.fog}` — `#e8e8e8`): a slightly darker gray surface band, used for FAQ outer panels and the "Trending laptops" header strip.
- **Steel** (`{colors.steel}` — `#c2c2c2`): hairline border used on outlined elements with stronger emphasis (focus states, active filter).
- **Bloom Coral / Bloom Rose** (`{colors.bloom-coral}` / `{colors.bloom-rose}` — `#ff5050`, `#f9d4d2`): the "Get 25% off" sale-tag chip + soft pink lifestyle accent on the sale hero.
- **Storm Mist / Sea / Deep** (`{colors.storm-mist}`, `{colors.storm-sea}`, `{colors.storm-deep}` — `#8ebdce`, `#7fadbe`, `#356373`): the teal-storm tones reserved for the printer-plan illustration backdrop and supporting infographic accents.

### Text
- **Ink** (`{colors.ink}` — `#1a1a1a`): the universal text color on white surfaces — headlines, body, button labels, navigation.
- **Ink Deep** (`{colors.ink-deep}` — `#000000`): pure black used for the wordmark and 1px hairline strokes around badge outlines.
- **Ink Soft** (`{colors.ink-soft}` — `#292929`): an alternate near-black used inside dark-navy slabs as a subtle textural shift.
- **On Ink** (`{colors.on-ink}` — `#ffffff`): pure white used for headline and body text on every dark-navy slab.
- **Charcoal** (`{colors.charcoal}` — `#3d3d3d`): muted body color on white surfaces — secondary descriptions, fine-print disclaimers.
- **Graphite** (`{colors.graphite}` — `#636363`): smaller-print color, used for legal lines and timestamp metadata.

### Semantic
- **Bloom Deep** (`{colors.bloom-deep}` — `#b3262b`) + **Bloom Wine** (`{colors.bloom-wine}` — `#5a1313`): error and discount-emphasis colors. The deep brick reads as "sale" or "destructive" depending on placement.
- **Storm Deep** (`{colors.storm-deep}` — `#356373`): used as a neutral status accent (e.g., printer-plan tier "Versatile" tier color).', '{"sourcePath":"docs/design-md/hp/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

The voice is **single-family**: Forma DJR Micro (HP''s bespoke geometric grotesque, fallback Arial) across every surface — display, body, button, caption. Forma DJR Micro is a wide, slightly rounded grotesque designed at small optical sizes to stay legible at UI-chrome scale. HP runs it at weight 400 for body, 500 for display headlines, 600/700 for emphasis and button labels.

The 16/14/12-px caption tier carries the catalog metadata — model numbers, spec rows, fine print — at weight 400 with a 1.4–1.5 line-height. Button labels lift to weight 600/700 with positive 0.5–1.1px letter-spacing and uppercase transform — the only place the system tracks letters.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 72px | 500 | 1.0 | 0 | Hero headline (homepage, laptop hub) |
| `{typography.display-xl}` | 56px | 500 | 1.0 | 0 | Section headlines on landing pages |
| `{typography.display-lg}` | 44px | 500 | 1.0 | 0 | Sub-section headlines on shop pages |
| `{typography.display-md}` | 32px | 500 | 1.0 | 0 | Promo strip headlines, FAQ section headers |
| `{typography.display-sm}` | 24px | 500 | 1.17 | 0 | Card titles, pricing-tier names |
| `{typography.display-xs}` | 20px | 500 | 1.0 | 0 | Inline list headers, accordion labels |
| `{typography.body-lg}` | 18px | 400 | 1.33 | 0 | Lead paragraphs |
| `{typography.body-md}` | 16px | 400 | 1.38 | 0 | Default body |
| `{typography.body-emphasis}` | 16px | 500 | 1.38 | 0 | Bolded run-in copy |
| `{typography.caption-md}` | 14px | 400 | 1.5 | 0 | Specs, metadata, captions |
| `{typography.caption-bold}` | 14px | 700 | 1.3 | 0 | Sale tags, in-card highlights |
| `{typography.caption-sm}` | 12px | 400 | 1.33 | 0 | Footnotes, legal lines |
| `{typography.link-md}` | 16px | 500 | 1.38 | 0 | Inline link emphasis |
| `{typography.button-md}` | 14px | 600 | 1.4 | 0.7px | Primary/secondary button labels (uppercase) |
| `{typography.button-sm}` | 12.6px | 700 | 1.0 | 0.126px | Compact button labels in tight cells |
| `{typography.price-md}` | 24px | 500 | 1.17 | 0 | Tier and product price stamps |

### Principles

The typographic decision worth flagging: HP runs **weight 500 for every display size**, including the largest 72px hero headline. Most editorial systems jump to 600/700 at hero scale; HP doesn''t. The result feels open and approachable rather than commanding — appropriate for a brand that sells across consumer, SMB, and enterprise audiences in the same catalog.

Forma DJR Micro''s rounded-grotesque shapes do most of the warmth. There''s no italic in the system except inside legal disclaimers; emphasis is carried by weight (500 → body-emphasis, 700 → caption-bold) instead.

### Note on Font Substitutes

Forma DJR Micro is proprietary (Commercial Type / Mark Caneso). Closest open-source substitutes:
- **Inter** at weights 400 / 500 / 600 / 700 — slightly narrower than Forma DJR Micro; bump font-size by ~3% to compensate
- **Manrope** at weights 400 / 500 / 600 / 700 — closer in proportion, gentler curves; use directly with no metric adjustment
- **Roboto** at weights 400 / 500 / 700 — flatter character; use as last-resort fallback

When swapping, set body line-height to 1.4 and display line-height to 1.0 explicitly — the Forma DJR Micro line-height numbers are tight, and most substitutes default looser.', '{"sourcePath":"docs/design-md/hp/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System

- **Base unit**: 8px. Smaller half-step at 4px. The scale is gentle — most card padding lands at 16px or 24px; section gap at 80px.
- **Tokens (front matter)**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 20px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.section}` 80px
- **Section padding**: `{spacing.section}` (80px) vertical between major bands on desktop; collapses to ~48px on mobile.
- **Card internal padding**: `{spacing.xl}` (24px) for product cards; `{spacing.xxl}` (32px) for promo strips and feature cards; `{spacing.md}` (16px) for compact article tiles.
- **Gutter**: `{spacing.xl}` (24px) between grid columns at desktop; `{spacing.md}` (16px) on tablet/mobile.

The 80px section gap is the universal rhythm constant — it appears between every major homepage band, between the hero and the comparison table on the printer-plan page, and between feature rows on the laptop-shop page.

### Grid & Container

- **Desktop max-width**: 1366px content container with full-bleed-on-canvas section backgrounds.
- **Hero**: a single full-width photo card (homepage and laptop-hub hero) with the headline overlay positioned upper-left or upper-right.
- **Product family grid**: 4 columns at >1200px, 3 at 1024–1199px, 2 at 768–1023px, 1 below 768px.
- **Pricing tiers**: 4 columns at >1024px, 2x2 grid at 768–1023px, single-column accordion below 768px.
- **Footer**: 5-column link grid at >1024px, collapsing to 2-column then accordion on mobile.

### Whitespace Philosophy

Whitespace is **commercial-clean** — generous around hero photography, tight around catalog spec rows. Product cards leave breathing room above and below the photo (≥32px) so the laptop or printer reads as a hero shot rather than a thumbnail. The fine-print disclaimer regions (legal, footnote rows) tighten line-height to 1.3 and shrink type to 11–12px so the bulk of fine print stays compact.', '{"sourcePath":"docs/design-md/hp/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow. | Section bands (white, cloud, fog), full-bleed photo heroes |
| 1 — Hairline | 1px solid `{colors.hairline}` (`#e8e8e8`) border, no shadow. | Outlined buttons, comparison-table cells, FAQ accordion outers |
| 2 — Soft Lift | `0 2px 8px rgba(26, 26, 26, 0.08)`. | Product cards, pricing-tier columns, customer-story tiles |
| 3 — Floating Modal | `0 8px 24px rgba(26, 26, 26, 0.12)`. | Add-to-cart drawer, mobile-nav sheet, image zoom modal |

The system is mostly flat — depth is communicated by **color contrast** (cloud-band vs. white card on the same band) rather than shadow elevation. The Soft Lift level is the workhorse for the catalog — every product tile and pricing column gets it; nothing else does. Modal-floating is rare and reserved for transient overlays.

### Decorative Depth

The system''s most distinctive depth gesture is the **HP blue chevron pair** — two angular `{colors.primary}` slashes (no radius, no shadow) that sit on the left and right of the homepage hero card and the laptop-shop hero. They''re not decorative noise; they''re a literal echo of the HP wordmark''s two parallel slashes, scaled up to architectural size. Treat them as a brand artifact, not a generic geometric flourish.

Photography on the homepage and laptop-shop pages frames product imagery inside `{rounded.xl}` (16px) containers with a soft 1px hairline. Lifestyle photography (testimonials, "How HP works for X") sits full-bleed inside dark-navy slabs without rounding.', '{"sourcePath":"docs/design-md/hp/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero chevron decorations, full-bleed photo heroes, marquee strips |
| `{rounded.xs}` | 2px | Secondary chip backgrounds, sale-tag pills |
| `{rounded.sm}` | 3px | Default secondary CTA radius (small touch zones) |
| `{rounded.md}` | 4px | Primary buttons, secondary buttons, text inputs |
| `{rounded.lg}` | 8px | Badge pills, category-icon cards, FAQ row containers |
| `{rounded.xl}` | 16px | Product cards, pricing tiers, customer-story tiles, photo frames |
| `{rounded.pill}` | 9999px | Category sub-nav tabs, search-pill input, filter chips |

The system maintains a clear two-tier philosophy: **buttons stay sharp** (4px, almost rectilinear) while **cards and photo frames stay soft** (16px). This split is the visual signature — sharp interactive elements against softer container surfaces.

### Photography Geometry

Hero photography sits in `{rounded.xl}` (16px) frames with no border. Product family thumbnails inside the laptop-grid are 1:1 (square) on a `{colors.canvas}` background, padded so the laptop is shown at ~70% of the frame. Customer-story photography uses 16:9 inside the same `{rounded.xl}` frame. There are no full-bleed circular avatars; testimonial avatars are 4px-rounded squares.', '{"sourcePath":"docs/design-md/hp/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> **No hover states documented.** Every component spec below documents only Default and Active/Pressed states. Variants live as separate front-matter entries.

### Buttons

**`button-primary`** — the lone HP Electric Blue CTA
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}` (uppercase, 0.7px tracking), padding `{spacing.sm} {spacing.xl}` (12 × 24), height 44px, rounded `{rounded.md}`
- Pressed state `button-primary-pressed` — background `{colors.primary-deep}`, same text
- Disabled state `button-primary-disabled` — background `{colors.steel}`, white text
- Used for: "Buy now", "Shop now", "Get a printer", primary form submit

**`button-ink`** — black filled CTA
- Background `{colors.ink}`, text `{colors.on-primary}`, padding `{spacing.sm} {spacing.xl}`, height 44px, rounded `{rounded.md}`, type `{typography.button-md}`
- Used for: "Buy now" on dark photo overlays, secondary primary actions where the blue would clash with imagery

**`button-outline`** — blue-text outlined CTA
- Background `{colors.canvas}`, text `{colors.primary}`, 1px `{colors.primary}` border, padding `{spacing.sm} {spacing.xl}`, height 44px, rounded `{rounded.md}`
- Used for: "Compare", "Customize", "Learn more" — secondary actions on white surfaces

**`button-outline-ink`** — black-text outlined CTA
- Background `{colors.canvas}`, text `{colors.ink}`, 1px `{colors.ink}` border, padding `{spacing.sm} {spacing.xl}`, height 44px, rounded `{rounded.md}`
- Used for: "View" buttons inside product family card grids — neutral against the blue primary

**`button-text-link`** — inline blue link with underline
- Background `{colors.canvas}`, text `{colors.primary}`, type `{typography.link-md}`, padding `{spacing.xxs} 0`
- Used for: "See details", "Read more" inside cards and disclaimer rows

### Cards & Containers

**`card-product`** — the workhorse product tile
- Background `{colors.canvas}`, rounded `{rounded.xl}` (16px), padding `{spacing.xl}` (24px), Soft Lift shadow
- Layout: hero photo (1:1 ratio) on top, title in `{typography.display-xs}`, spec rows in `{typography.caption-md}`, price in `{typography.price-md}`, CTA pinned to bottom
- Used for: laptop catalog cards, desktop catalog cards

**`card-product-feature`** — full-row feature card with photo + copy
- Background `{colors.cloud}`, rounded `{rounded.xl}`, padding `{spacing.xxl}` (32px)
- Layout: photo on the left (50% width), copy on the right with section eyebrow + title + body + CTA pair
- Used for: "Trending laptops" feature rows, "Shop these must haves"

**`card-pricing-tier`** + **`card-pricing-tier-featured`**
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, Soft Lift shadow
- Tier name in `{typography.display-sm}`, monthly price in `{typography.display-md}` with `{typography.caption-md}` cadence, page count caption, full feature list, primary CTA
- Featured tier carries `{colors.primary}` text accent on the price-stamp + a `{colors.primary}` thin top border instead of a colored card background — never inverted to dark

**`card-customer-story`** — the three-up testimonial tile
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.md}` (16px), Soft Lift shadow
- 16:9 photo at top in `{rounded.xl}` frame, quote excerpt in `{typography.body-md}`, attribution row at the bottom
- Used in the "See what our customers say" homepage section

**`card-article-tile`** — the four-up "Latest from HP" tile
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.md}`, Soft Lift shadow
- 16:9 thumbnail at top, date eyebrow in `{typography.caption-sm}`, title in `{typography.body-emphasis}`, "Read more" link

**`card-category-icon`** — the small icon-and-label card in the homepage "Our Products" row
- Background `{colors.canvas}`, rounded `{rounded.lg}` (8px), padding `{spacing.md}`
- 48px icon at top, label in `{typography.body-emphasis}` below
- Used for: Laptops, Desktops, Printers, Computer Tools, Accessories, Enterprise Solutions

**`hero-promo-card`** — the homepage hero card with chevron decorations
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xxl}` (32px)
- Photography occupies left half; copy block (eyebrow + headline + price stamp + CTA pair) occupies right half
- Flanked by `chevron-decoration` blue slashes outside the card''s bounding box on left and right edges

**`promo-strip-dark`** — the inline dark navy promo block
- Background `{colors.ink}`, text `{colors.on-ink}`, rounded `{rounded.xl}`, padding `{spacing.xxl} 48px`
- Used for: "When did work start getting in the way of work?" mid-page promo, the SMB testimonial slab

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Background `{colors.canvas}`, text `{colors.ink}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px
- 1px `{colors.steel}` border in default; gains 1px `{colors.ink}` border on focus (no halo)

**`text-input-search`** — pill search in the top nav
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 40px, 1px `{colors.steel}` border, magnifying-glass icon at right

**`badge-pill-ink`** — filled tag pill
- Background `{colors.ink}`, text `{colors.on-primary}`, rounded `{rounded.lg}`, padding 6px 12px, type `{typography.body-md}`
- Used inline next to product titles to mark "New" or featured indicators

**`badge-pill-outline`** — outlined tag pill
- Background `{colors.canvas}`, text `{colors.ink}`, 1px `{colors.ink}` border, rounded `{rounded.lg}`, padding 6px 12px

**`badge-sale-coral`** — the sale price-stamp
- Background `{colors.bloom-coral}`, text `{colors.on-primary}`, rounded `{rounded.sm}`, padding `{spacing.xxs} {spacing.xs}`, type `{typography.caption-bold}`
- Used for: "Save $200", "25% off" overlay tags on hero promo cards

### Navigation

**`utility-strip`** — the top-of-page utility bar
- Background `{colors.ink}`, text `{colors.on-primary}`, height 36px, padding 0 {spacing.xl}, type `{typography.caption-md}`
- Holds: country/locale picker, "For Business / For Home" toggle, "Sign in" link, cart link

**`nav-bar-top`** — desktop top nav (sits below utility strip)
- Background `{colors.canvas}`, height 64px, padding 0 32px
- Layout: HP wordmark logo flush left → middle category list (Laptops / Desktops / Printers / Accessories / Solutions / Support) → right slot with Search field, Sign-in link, Cart icon
- 1px `{colors.hairline}` bottom border separates nav from page

**`nav-link`**
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, padding `{spacing.xs} {spacing.md}`
- Active page draws a 2px `{colors.primary}` underline below the text baseline

**Top Nav (Mobile)**
- Same height, hamburger icon replaces the middle category list, Search and Cart stay visible
- Drawer expands as a full-canvas sheet with `{typography.body-lg}` link list and a sticky Sign-in CTA at bottom

**`category-tab`** + **`category-tab-active`** — the pill sub-nav
- Default: background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-emphasis}`, rounded `{rounded.pill}`, padding `{spacing.xs} {spacing.lg}`
- Active: background `{colors.ink}`, text `{colors.on-primary}`, same rounding
- Used on the laptop-shop page for "All / Trending / On Sale" filtering, and on the homepage "How can we help?" closing band

### Signature Components

**`chevron-decoration`** — the geometric blue slash motif
- Background `{colors.primary}`, rounded `{rounded.none}`, no shadow
- Renders as a sharp parallelogram cut at ~60° angle, sized to the height of the hero card it flanks
- Reserved for hero bands and full-page banners — never decorative noise inside cards

**`faq-row`** — the accordion row on the printer-plan FAQ
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg} {spacing.xl}`, type `{typography.body-emphasis}`
- 1px `{colors.hairline}` divider between rows; chevron-down icon on the right collapsed, chevron-up when expanded
- Body answer renders inside the same row container in `{typography.body-md}` after expansion

**`help-band-dark`** — the closing "How can we help?" prelude band
- Background `{colors.ink}`, text `{colors.on-primary}`, padding 64px {spacing.xl}
- Layout: large lifestyle photograph as the band background (low-opacity) with chip-style category tabs centered: Browse Topics / Live Chat / Contact / Diagnose / Order Status

**`footer-dark`**
- Background `{colors.ink}`, text `{colors.on-primary}`, type `{typography.body-md}`, padding 64px {spacing.xl}
- 5-column link grid (Company / Shop / Support / Resources / Connect) with `{typography.body-emphasis}` headers and `{typography.caption-md}` link rows
- Bottom strip carries social icons, language picker, and legal lines in `{typography.caption-sm}` muted to `{colors.steel}`', '{"sourcePath":"docs/design-md/hp/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` for the primary CTA, link color, and `chevron-decoration` motif — at most twice per viewport
- Set every headline in Forma DJR Micro at weight 500 with line-height 1.0 — resist the urge to bump weight at hero scale
- Use `{rounded.xl}` (16px) for cards and photo frames; `{rounded.md}` (4px) for buttons and inputs — keep the two-tier split sharp
- Pair white `{colors.canvas}` body bands with `{colors.cloud}` (`#f7f7f7`) alternating bands; let the gray do the breathing
- Close every page rhythm with a dark-navy `{colors.ink}` slab — the "How can we help?" prelude + footer
- Set button labels in uppercase with `{typography.button-md}` (0.7px tracking) — the only place the system tracks letters
- Use Soft Lift shadow exclusively for product cards and pricing tiers — leave section bands flat
- Frame product photography inside `{rounded.xl}` containers; never use full-bleed circular masks

### Don''t
- Don''t introduce secondary saturated colors outside `{colors.primary}` family + the `bloom-coral` sale-tag and `storm` printer-plan accents
- Don''t apply heavy material shadows — depth is via color contrast (cloud vs. white) and Soft Lift only
- Don''t round buttons above `{rounded.md}` (4px); a soft 8px+ button reads as a different brand
- Don''t run Forma DJR Micro below 12px — small caption at 11px is the floor
- Don''t use the chevron decoration as inline noise; it is a hero-only architectural element tied to the wordmark
- Don''t drop ink text opacity to create hierarchy — switch surface or shift to `{colors.charcoal}` / `{colors.graphite}` instead
- Don''t replace the HP wordmark with a generic sans lockup; the wordmark is a custom mark with its own ratio', '{"sourcePath":"docs/design-md/hp/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 480px | Single-column stack; hamburger nav; section padding drops to ~48px; hero serif scales to ~36px |
| Mobile-Large | 480–767px | Same column count; hero scales to ~44px; pricing tiers stack vertically |
| Tablet | 768–1023px | 2-column product grid; pricing 2x2; nav still full text labels |
| Desktop | 1024–1279px | 3-column product grid; 4-column pricing; full nav |
| Desktop-Large | ≥ 1280px | 4-column product grid; 1366px content max-width with full-bleed bands |

### Touch Targets

Every interactive element clears 44×44px on mobile. `button-primary` at 44px height + 24px horizontal padding meets WCAG-AAA touch target. `category-tab` at 8px 20px padding bumps to 12px 24px on touch screens. Nav-link tap areas extend invisibly beyond the text run to the full 44px row height. Sticky cart/sign-in icons in the top nav use 44×44 invisible hit boxes around their visible 24×24 glyph.

### Collapsing Strategy

- **Utility strip**: stays visible on every breakpoint; dropdowns collapse into a single "Account" icon below 768px
- **Top nav**: middle category list collapses into a hamburger drawer below 1024px; the right-side Search + Sign-in + Cart stay visible
- **Hero**: stays single-column at every breakpoint; chevron decorations shrink to ~60% size on tablet and disappear entirely on mobile
- **Product family grid**: 4 → 3 → 2 → 1 column as breakpoints shrink; cards keep `{rounded.xl}` corners at every size
- **Pricing comparison table**: 4-column grid on desktop collapses to 2x2 on tablet, then stacks into individual accordion-style cards on mobile
- **Footer**: 5-column link grid → 2-column tablet → single-column accordion on mobile; HP wordmark stays flush left

### Image Behavior

Hero photography uses `{rounded.xl}` containers at every breakpoint. The chevron decorations vanish on mobile; the underlying photo card centers in the viewport. Lifestyle photography in the testimonial and "how-can-we-help" bands maintains 16:9 ratio with horizontal cropping rather than letterboxing on mobile. There are no art-direction crop swaps between desktop and mobile — the same image is used at every size.', '{"sourcePath":"docs/design-md/hp/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time; resist refactoring an entire section in one pass
2. Reference component names and tokens directly (`{colors.primary}`, `{typography.display-xxl}`, `{rounded.xl}`, `card-product`) — do not paraphrase to hex/px in prose
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically
4. Add new variants as separate component entries (`-pressed`, `-disabled`, `-focused`); never bury state inside prose
5. Default body to `{typography.body-md}`; reach for `{typography.body-emphasis}` for run-in bolds; keep display sizes for true heading roles
6. Keep `{colors.primary}` scarce — at most two flame elements per viewport (one CTA + one chevron decoration). Three flame items in one viewport is over-saturation
7. When introducing a new section band, choose from `{colors.canvas}` / `{colors.cloud}` / `{colors.fog}` / `{colors.ink}` — six pre-defined surface modes is the entire surface vocabulary', '{"sourcePath":"docs/design-md/hp/DESIGN.md","category":"other"}'::jsonb, 0.75, 10);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_1', '#024ad8', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_2', '#1a1a1a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_3', '#296ef9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_4', '#0e3191', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_5', '#c9e0fc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_6', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_7', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_8', '#292929', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_9', '#f7f7f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_10', '#e8e8e8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_11', '#c2c2c2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_12', '#636363', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_13', '#3d3d3d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_14', '#ff5050', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_15', '#f9d4d2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_16', '#b3262b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_17', '#5a1313', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_18', '#8ebdce', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_19', '#7fadbe', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md'), 'color', 'color_20', '#356373', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/hp/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/hp/DESIGN.md';


-- Ibm
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Ibm', 'ibm', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/ibm/DESIGN.md', null, 'seeded', '---
version: alpha
name: IBM-design-analysis
description: "An enterprise-marketing canvas faithful to Carbon Design System: white surfaces, charcoal type, IBM Blue (#0f62fe) as the single confident accent, and a deliberately flat-square aesthetic where corners stay at 0–4px. Type runs IBM Plex Sans at light weight 300 for display sizes (a brand signature) and 400/600 for body and emphasis. Cards live as thin-bordered tiles with no shadow; sections separate via subtle gray rows. The chrome is square, the typography is light, and the only color in the system is one assertive blue — the result reads as old-world enterprise gravitas reframed for the cloud era."

colors:
  primary: "#0f62fe"
  on-primary: "#ffffff"
  ink: "#161616"
  ink-muted: "#525252"
  ink-subtle: "#8c8c8c"
  canvas: "#ffffff"
  surface-1: "#f4f4f4"
  surface-2: "#e0e0e0"
  inverse-canvas: "#161616"
  inverse-surface-1: "#262626"
  inverse-ink: "#ffffff"
  inverse-ink-muted: "#c6c6c6"
  hairline: "#e0e0e0"
  hairline-strong: "#161616"
  blue-60: "#0043ce"
  blue-80: "#002d9c"
  blue-hover: "#0050e6"
  semantic-success: "#24a148"
  semantic-warning: "#f1c21b"
  semantic-error: "#da1e28"
  semantic-info: "#0f62fe"

typography:
  display-xl:
    fontFamily: IBM Plex Sans
    fontSize: 76px
    fontWeight: 300
    lineHeight: 1.17
    letterSpacing: -0.5px
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 60px
    fontWeight: 300
    lineHeight: 1.17
    letterSpacing: -0.4px
  display-md:
    fontFamily: IBM Plex Sans
    fontSize: 42px
    fontWeight: 300
    lineHeight: 1.20
    letterSpacing: 0
  headline:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: 0
  card-title:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0
  subhead:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  body:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0.16px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: 0.16px
  body-emphasis:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: 0.16px
  caption:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0.32px
  button:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: 0.16px
  eyebrow:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: 0.16px

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
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
    rounded: "{rounded.none}"
    padding: 12px 16px
  button-primary-pressed:
    backgroundColor: "{colors.blue-80}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 12px 16px
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 12px 16px
  button-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 12px 16px
  button-danger:
    backgroundColor: "{colors.semantic-error}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: 12px 16px
  feature-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 24px
  feature-card-elevated:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 24px
  product-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 32px
  hero-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    rounded: "{rounded.none}"
    padding: 48px
  cta-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: 48px
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 11px 16px
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 11px 16px
  text-input-error:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 11px 16px
  newsletter-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 11px 16px
  product-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 16px 20px
  product-tab-selected:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-emphasis}"
    rounded: "{rounded.none}"
    padding: 16px 20px
  resource-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 16px
  customer-logo-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    padding: 24px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    height: 48px
  utility-bar:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    height: 32px
  footer:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 64px 32px
---

## Overview

IBM''s marketing system is a faithful application of **Carbon Design System** — IBM''s open-source enterprise design system. The dominant surface is `{colors.canvas}` pure white with `{colors.surface-1}` light gray for elevation, charcoal `{colors.ink}` (#161616) for text, and IBM Blue `{colors.primary}` (#0f62fe) as the single brand accent.

The defining choice is **flat geometry**: every CTA, every card, every input, every container uses square corners (`{rounded.none}` 0px) with thin 1px borders. There are no rounded pills, no soft shadows, no atmospheric gradients. The system is engineered, not stylized.

**IBM Plex Sans** carries the entire type hierarchy. Display sizes (76 / 60 / 42px) run at weight **300** — IBM''s signature light display treatment that makes 76px feel calmer than competing brands'' 700-weight display. Body type sits at weight 400 with `letter-spacing: 0.16px` (a Carbon precision detail) and line-height 1.50. The voice reads as careful, technical, and trustworthy.

The system reaches for color rarely — IBM Blue marks links, primary CTAs, and the rare full-bleed CTA banner. Charcoal carries every other surface that isn''t white. The result is enterprise gravitas without the enterprise stiffness: rigorous, light-weighted, and intentionally restrained.

**Key Characteristics:**
- **Carbon Design System** — IBM''s marketing chrome IS Carbon. Buttons are square, inputs are square-with-bottom-rule, corners stay at 0px.
- **Light-weight display type**: Plex Sans at weight 300 for 42–76px headlines is the brand''s typographic signature.
- **One accent color**: `{colors.primary}` IBM Blue carries every link, primary CTA, and CTA banner. There is no second brand color.
- White canvas + light gray (`{colors.surface-1}`) + charcoal (`{colors.ink}`) cover 95% of surfaces.
- Footer inverts to charcoal (`{colors.inverse-canvas}` #161616) — the only dark surface above the page break.
- Card hierarchy is carried by 1px hairlines and surface change, never by drop shadow.
- `letter-spacing: 0.16px` on body is a Carbon precision detail — the small positive tracking is part of the brand voice.
- Page rhythm: utility bar → top nav → hero with light-weight headline → feature card grid → customer logo marquee → enterprise feature row → training section → newsletter / sign-in CTA → dark footer.

## Colors

> Source pages: ibm.com (home), /software/ai-productivity, /consulting, /products/cloud-pak-for-aiops, /products/bare-metal-servers, community.ibm.com.

### Brand & Accent
- **IBM Blue** ({colors.primary}): The single brand accent. Links, primary CTAs, CTA banner backgrounds, focus rings.
- **Blue 60** ({colors.blue-60}): Hovered link state.
- **Blue 80** ({colors.blue-80}): Pressed primary button.
- **Blue Hover** ({colors.blue-hover}): Hover state for primary buttons.

### Surface
- **Canvas** ({colors.canvas}): Default page background.
- **Surface 1** ({colors.surface-1}): Light gray (#f4f4f4) — input fields, alternate-row stripes, subtle section bands.
- **Surface 2** ({colors.surface-2}): Slightly darker gray (#e0e0e0) — disabled fields, hairline-as-fill for separators.
- **Hairline** ({colors.hairline}): 1px borders on cards, inputs, dividers.
- **Hairline Strong** ({colors.hairline-strong}): 1px charcoal underline on focused inputs (Carbon''s signature focus treatment).
- **Inverse Canvas** ({colors.inverse-canvas}): Charcoal #161616 — footer surface.
- **Inverse Surface 1** ({colors.inverse-surface-1}): One step lighter than inverse canvas — footer column dividers, hovered footer items.

### Text
- **Ink** ({colors.ink}): All headlines and emphasized body type — charcoal #161616.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #525252 — meta, sub-headlines, footer body.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #8c8c8c — disabled, helper text, captions.
- **Inverse Ink** ({colors.inverse-ink}): White on charcoal — footer headings.
- **Inverse Ink Muted** ({colors.inverse-ink-muted}): Light gray on charcoal — footer body.

### Semantic
- **Success Green** ({colors.semantic-success}): Carbon green-50 — success states.
- **Warning Yellow** ({colors.semantic-warning}): Carbon yellow-30 — warning states.
- **Error Red** ({colors.semantic-error}): Carbon red-60 — error states; danger button background.
- **Info Blue** ({colors.semantic-info}): Identical to primary — informational badges.

## Typography

### Font Family

- **IBM Plex Sans** — IBM''s open-source proprietary typeface (free for any use). Geometric, slightly humanist, designed specifically for enterprise UI. Fallback: `Helvetica Neue, Arial, sans-serif`.

The same family carries display, body, and caption — there is no display + body pairing. Hierarchy is carried by **size + weight** rather than by family change. Plex Sans is also free / open-source under the SIL Open Font License — making it the easiest custom face on this list to substitute for in implementation.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 76px | 300 | 1.17 | -0.5px | Largest hero headline |
| `{typography.display-lg}` | 60px | 300 | 1.17 | -0.4px | Section opener headlines |
| `{typography.display-md}` | 42px | 300 | 1.20 | 0 | Sub-section headlines, hero card title |
| `{typography.headline}` | 32px | 400 | 1.25 | 0 | Card collection heading, FAQ category |
| `{typography.card-title}` | 24px | 400 | 1.33 | 0 | Feature card title |
| `{typography.subhead}` | 20px | 400 | 1.40 | 0 | Lead body next to display headlines |
| `{typography.body-lg}` | 18px | 400 | 1.50 | 0 | Hero subhead, lead paragraphs |
| `{typography.body}` | 16px | 400 | 1.50 | 0.16px | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.29 | 0.16px | Card body, footer columns |
| `{typography.body-emphasis}` | 14px | 600 | 1.29 | 0.16px | Selected tab label, emphasized body line |
| `{typography.caption}` | 12px | 400 | 1.33 | 0.32px | Captions, meta, utility bar |
| `{typography.button}` | 14px | 400 | 1.29 | 0.16px | All button labels |
| `{typography.eyebrow}` | 14px | 400 | 1.29 | 0.16px | Section eyebrows (Carbon avoids strong eyebrows; uses sentence case 14px) |

### Principles

- **Light-weight display is the brand voice.** Plex Sans at weight 300 for 76px headlines reads as quietly authoritative — switching to 700 would make it look like every other enterprise site.
- **Carbon''s `letter-spacing: 0.16px`** on body sizes is a precision detail. Don''t remove it.
- **No mono** on marketing surfaces (Plex Mono exists but lives in product surfaces only).
- **Eyebrow typography uses sentence case 14px** — Carbon resists the all-caps tracked eyebrow common to other enterprise brands.
- **Line-heights tighten on display, relax on body**: 1.17 at display-xl, 1.50 at body — proportional to size.

### Note on Font Substitutes

IBM Plex Sans is **free and open-source** (SIL OFL license) and available on Google Fonts. It is the recommended implementation. The Plex family also includes Plex Mono and Plex Serif if expanded typographic needs arise.

## Layout

### Spacing System

- **Base unit**: 4px (Carbon''s signature 4-pixel grid).
- **Tokens (front matter)**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on feature cards; `{spacing.xl}` 32px on product cards; `{spacing.xxl}` 48px on hero cards and CTA banners.
- Button padding: 12px vertical · 16px horizontal — Carbon spec.
- Form input padding: 11px vertical · 16px horizontal.

### Grid & Container

- Carbon''s 16-column grid at desktop, scaling to 8 / 4 columns at tablet / mobile.
- Max content width sits around 1584px (Carbon''s max-grid breakpoint).
- Card grids are 4-up at desktop, 2-up at tablet, 1-up at mobile.
- The customer logo marquee uses fixed-width tiles in a flex row, scrolling horizontally on smaller viewports.

### Whitespace Philosophy

Carbon uses precise alignment to a 4-pixel grid as its whitespace system. Sections separate via thin gray rows (`{colors.surface-1}`) rather than via large vertical gaps. Content is dense by design — IBM''s customers expect to see a lot on a page, not a lot of air.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for body type, hero text, footer body |
| 1 (hairline) | 1px `{colors.hairline}` border on canvas | Feature cards, inputs, list items |
| 2 (surface lift) | `{colors.surface-1}` background on canvas | Alternate-row banners, hovered cards |
| 3 (focus ring) | 2px `{colors.primary}` outline + 1px `{colors.hairline-strong}` underline | Focused input, focused button |

Carbon resists drop shadows on marketing — depth is carried by surface change and 1px hairlines. The exception is product / app surfaces (Carbon documents shadow tokens for elevated panels), but the marketing site barely uses them.

### Decorative Depth

- **Soft blue gradient backdrops** appear behind some hero illustrations — a faint blue-to-white wash that warms the canvas without competing with the headline.
- **No atmospheric depth.** No spotlight cards, no pastel section blocks, no gradient panels.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Default — every button, card, input, container |
| `{rounded.xs}` | 2px | Small badges (rare exception) |
| `{rounded.sm}` | 4px | Avatar circles squared, dropdown menus |
| `{rounded.md}` | 6px | (Used rarely; documented for completeness) |
| `{rounded.lg}` | 8px | (Used rarely; documented for completeness) |
| `{rounded.pill}` | 9999px | Status pills, badges in product UI (rare on marketing) |

The brand commits to flat 0px corners. The other tokens exist for product / mobile surfaces but rarely surface on marketing.

### Photography & Illustration Geometry

- IBM uses photography (people, hardware, sports cars) and abstract illustration (geometric mesh, dotted patterns) interchangeably.
- Image frames are flat — no rounded corners.
- Customer logo tiles sit on `{rounded.none}` 0px tiles with thin 1px borders.

## Components

### Buttons

**`button-primary`** — Blue solid CTA. The default primary across all pages.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 12px 16px, rounded `{rounded.none}`.
- Pressed state lives in `button-primary-pressed` (background shifts to `{colors.blue-80}`).

**`button-secondary`** — Charcoal solid button — Carbon''s "secondary" treatment.
- Background `{colors.ink}`, text `{colors.inverse-ink}`, type `{typography.button}`, padding 12px 16px, rounded `{rounded.none}`.

**`button-tertiary`** — White button with blue 1px border + blue text. Used for tertiary CTAs.
- Background `{colors.canvas}`, text `{colors.primary}`, type `{typography.button}`, rounded `{rounded.none}`, padding 12px 16px. (Border in implementation: 1px `{colors.primary}`.)

**`button-ghost`** — Plain text + chevron, no background until hover.
- Background `{colors.canvas}`, text `{colors.primary}`, type `{typography.button}`, rounded `{rounded.none}`, padding 12px 16px.

**`button-danger`** — Carbon''s destructive variant.
- Background `{colors.semantic-error}`, text `{colors.on-primary}`, type `{typography.button}`, rounded `{rounded.none}`, padding 12px 16px.

### Cards & Containers

**`feature-card`** — Default feature highlight tile on the home and product pages.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.none}`, padding 24px. Stroked with 1px `{colors.hairline}`.

**`feature-card-elevated`** — Same shape on `{colors.surface-1}` ground — used for "Recommended" cards in the latest-content carousel.
- Background `{colors.surface-1}`, otherwise identical structure.

**`product-card`** — Larger product showcase tile.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.none}`, padding 32px.

**`hero-card`** — Hero composition card with light-weight title, body, and CTA.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.display-md}`, rounded `{rounded.none}`, padding 48px.

**`cta-banner`** — Full-width blue CTA panel near the bottom of the page.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.headline}`, rounded `{rounded.none}`, padding 48px.

**`resource-tile`** — Smaller article / case-study tile.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.none}`, padding 16px.

**`customer-logo-tile`** — Single tile in the customer marquee on the home page (Ferrari, Pfizer, etc.).
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.caption}`, rounded `{rounded.none}`, padding 24px. 1px hairline border.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** + **`text-input-error`** — Carbon''s input chrome.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.none}`, padding 11px 16px.
- Focus state replaces the bottom 1px hairline with a 2px `{colors.primary}` underline (Carbon''s signature focus treatment).
- Error state adds 2px `{colors.semantic-error}` bottom underline.

**`newsletter-input`** — The "Stay connected" newsletter capture on the home page.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.none}`, padding 11px 16px. Adjacent submit is `button-primary`.

### Tabs

**`product-tab`** + **`product-tab-selected`** — The horizontal tab strip on product pages and the home "Recommended" carousel.
- Default: `{colors.canvas}` background, `{colors.ink-muted}` text, rounded `{rounded.none}`, padding 16px 20px. Bottom 1px hairline.
- Selected: `{colors.canvas}` background, `{colors.ink}` text, `{typography.body-emphasis}` weight, bottom 2px `{colors.primary}` underline. Same padding / rounding.

### Navigation

**`top-nav`** — Sticky white bar with the IBM logomark left, nav categories center, and search / sign-in icons right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 48px. 1px bottom hairline.

**`utility-bar`** — Slim gray ribbon above the top nav with location switch, contact, search shortcuts.
- Background `{colors.surface-1}`, text `{colors.ink-muted}`, type `{typography.caption}`, height 32px.

### Footer

**`footer`** — Charcoal footer (`{colors.inverse-canvas}`) with the IBM wordmark left and 5–6 columns of caption-sized links. The only inverted surface above the page break.
- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink-muted}`, type `{typography.body-sm}`, padding 64px 32px.

## Do''s and Don''ts

### Do

- Use `{rounded.none}` 0px on every CTA, card, input, and container. The flat-square aesthetic is the brand.
- Pair Plex Sans weight 300 for display sizes (42px+) with weight 400 for body. Resist the urge to bold the headline.
- Reserve `{colors.primary}` IBM Blue for primary CTAs, links, focused-input underlines, and CTA banner. Do not use it as a card background or eyebrow color.
- Apply `letter-spacing: 0.16px` to body sizes. It''s a Carbon precision detail and part of the typographic voice.
- Use surface change (`canvas` → `surface-1`) and 1px hairlines for card hierarchy. Skip drop shadows.
- Stick to sentence case for eyebrows and section labels — Carbon resists all-caps tracking.
- Invert to `{colors.inverse-canvas}` only at the footer; the rest of the page stays light.

### Don''t

- Don''t round corners on buttons, cards, or inputs. Even 4px rounded corners break the Carbon look.
- Don''t bold display headlines. Plex Sans at weight 300 is the brand voice; weight 700 makes it look generic.
- Don''t add atmospheric depth (gradient backdrops, drop shadows, atmospheric overlays) outside the documented soft-blue hero gradient.
- Don''t introduce a second brand color. IBM Blue is the only chromatic accent; status semantics use the documented green / yellow / red.
- Don''t replace IBM Plex Sans with Inter or Helvetica without preserving the `letter-spacing: 0.16px` and weight-300 display treatment.
- Don''t use pill-shaped buttons. Carbon uses square corners; pills read as a different brand.
- Don''t write all-caps tracked eyebrows. Carbon''s eyebrows are sentence case at 14px.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Max | 1584px | Carbon max grid; gutters expand |
| Desktop-XL | 1312px | Default desktop layout |
| Desktop | 1056px | Card grid 4-up maintained |
| Tablet | 672px | Card grid 4-up → 2-up; nav becomes hamburger |
| Mobile | 320px | Single-column; display-xl scales 76px → ~32px |

### Touch Targets

- Carbon spec: 48px minimum tap target. Buttons and inputs hold 48px on touch viewports.
- Top-nav links grow from 36px to 48px tap height on touch.
- Tab strip rows hold 48px tap height.

### Collapsing Strategy

- **Top nav**: links collapse to a hamburger overlay below 672px. Logomark and search icon stay on the bar.
- **Utility bar**: hides below 672px to reclaim vertical space.
- **Card grid**: 4-up → 2-up at 1056px → 1-up below 672px.
- **Display type**: `{typography.display-xl}` 76px scales toward 42px on mobile while preserving the weight-300 treatment.
- **Footer**: 6-column link grid → 3-column at tablet → 1-column at mobile.

### Image Behavior

- Customer logos in the marquee maintain aspect ratio and may collapse to 2-row scroll below 672px.
- Hero illustrations scale proportionally; below 672px they may stack above the headline rather than sit beside it.

## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. Default body to `{typography.body}` at weight 400 with `letter-spacing: 0.16px`. Don''t remove the tracking.
3. When introducing a new section, decide whether it sits on `{colors.canvas}` (default) or on `{colors.surface-1}` (alternate band). The two-surface rhythm is the rhythm.
4. Run `npx @google/design.md lint DESIGN.md` after edits.
5. Add new variants as separate component entries (`button-primary-pressed`, `text-input-error`, `text-input-focused`).
6. Treat IBM Blue as scarce: links, primary CTA, CTA banner, focus underline. Anything beyond that is drift.
7. Resist rounded corners. If a designer pushes for 4px rounding, the brand is shifting away from Carbon.

## Known Gaps

- IBM''s product surfaces (cloud-pak, watson, datacap) have richer Carbon component usage (data tables, graph cells, breadcrumbs, contextual menus) that aren''t present on the marketing pages inspected — those components live in Carbon''s documentation rather than in the marketing extraction.
- Form-field error and validation styling is documented in Carbon docs; the inspected pages didn''t render error states.
- Dark mode is documented in Carbon as Gray-100 theme but isn''t exposed on these marketing pages — only the footer inverts. The full dark theme is a separate Carbon palette not extracted here.
- The community.ibm.com sub-domain uses a different chrome (community-platform white-label) that approximates Carbon but isn''t strict — the documented system applies to ibm.com proper.
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

IBM''s marketing system is a faithful application of **Carbon Design System** — IBM''s open-source enterprise design system. The dominant surface is `{colors.canvas}` pure white with `{colors.surface-1}` light gray for elevation, charcoal `{colors.ink}` (#161616) for text, and IBM Blue `{colors.primary}` (#0f62fe) as the single brand accent.

The defining choice is **flat geometry**: every CTA, every card, every input, every container uses square corners (`{rounded.none}` 0px) with thin 1px borders. There are no rounded pills, no soft shadows, no atmospheric gradients. The system is engineered, not stylized.

**IBM Plex Sans** carries the entire type hierarchy. Display sizes (76 / 60 / 42px) run at weight **300** — IBM''s signature light display treatment that makes 76px feel calmer than competing brands'' 700-weight display. Body type sits at weight 400 with `letter-spacing: 0.16px` (a Carbon precision detail) and line-height 1.50. The voice reads as careful, technical, and trustworthy.

The system reaches for color rarely — IBM Blue marks links, primary CTAs, and the rare full-bleed CTA banner. Charcoal carries every other surface that isn''t white. The result is enterprise gravitas without the enterprise stiffness: rigorous, light-weighted, and intentionally restrained.

**Key Characteristics:**
- **Carbon Design System** — IBM''s marketing chrome IS Carbon. Buttons are square, inputs are square-with-bottom-rule, corners stay at 0px.
- **Light-weight display type**: Plex Sans at weight 300 for 42–76px headlines is the brand''s typographic signature.
- **One accent color**: `{colors.primary}` IBM Blue carries every link, primary CTA, and CTA banner. There is no second brand color.
- White canvas + light gray (`{colors.surface-1}`) + charcoal (`{colors.ink}`) cover 95% of surfaces.
- Footer inverts to charcoal (`{colors.inverse-canvas}` #161616) — the only dark surface above the page break.
- Card hierarchy is carried by 1px hairlines and surface change, never by drop shadow.
- `letter-spacing: 0.16px` on body is a Carbon precision detail — the small positive tracking is part of the brand voice.
- Page rhythm: utility bar → top nav → hero with light-weight headline → feature card grid → customer logo marquee → enterprise feature row → training section → newsletter / sign-in CTA → dark footer.', '{"sourcePath":"docs/design-md/ibm/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: ibm.com (home), /software/ai-productivity, /consulting, /products/cloud-pak-for-aiops, /products/bare-metal-servers, community.ibm.com.

### Brand & Accent
- **IBM Blue** ({colors.primary}): The single brand accent. Links, primary CTAs, CTA banner backgrounds, focus rings.
- **Blue 60** ({colors.blue-60}): Hovered link state.
- **Blue 80** ({colors.blue-80}): Pressed primary button.
- **Blue Hover** ({colors.blue-hover}): Hover state for primary buttons.

### Surface
- **Canvas** ({colors.canvas}): Default page background.
- **Surface 1** ({colors.surface-1}): Light gray (#f4f4f4) — input fields, alternate-row stripes, subtle section bands.
- **Surface 2** ({colors.surface-2}): Slightly darker gray (#e0e0e0) — disabled fields, hairline-as-fill for separators.
- **Hairline** ({colors.hairline}): 1px borders on cards, inputs, dividers.
- **Hairline Strong** ({colors.hairline-strong}): 1px charcoal underline on focused inputs (Carbon''s signature focus treatment).
- **Inverse Canvas** ({colors.inverse-canvas}): Charcoal #161616 — footer surface.
- **Inverse Surface 1** ({colors.inverse-surface-1}): One step lighter than inverse canvas — footer column dividers, hovered footer items.

### Text
- **Ink** ({colors.ink}): All headlines and emphasized body type — charcoal #161616.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #525252 — meta, sub-headlines, footer body.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #8c8c8c — disabled, helper text, captions.
- **Inverse Ink** ({colors.inverse-ink}): White on charcoal — footer headings.
- **Inverse Ink Muted** ({colors.inverse-ink-muted}): Light gray on charcoal — footer body.

### Semantic
- **Success Green** ({colors.semantic-success}): Carbon green-50 — success states.
- **Warning Yellow** ({colors.semantic-warning}): Carbon yellow-30 — warning states.
- **Error Red** ({colors.semantic-error}): Carbon red-60 — error states; danger button background.
- **Info Blue** ({colors.semantic-info}): Identical to primary — informational badges.', '{"sourcePath":"docs/design-md/ibm/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

- **IBM Plex Sans** — IBM''s open-source proprietary typeface (free for any use). Geometric, slightly humanist, designed specifically for enterprise UI. Fallback: `Helvetica Neue, Arial, sans-serif`.

The same family carries display, body, and caption — there is no display + body pairing. Hierarchy is carried by **size + weight** rather than by family change. Plex Sans is also free / open-source under the SIL Open Font License — making it the easiest custom face on this list to substitute for in implementation.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 76px | 300 | 1.17 | -0.5px | Largest hero headline |
| `{typography.display-lg}` | 60px | 300 | 1.17 | -0.4px | Section opener headlines |
| `{typography.display-md}` | 42px | 300 | 1.20 | 0 | Sub-section headlines, hero card title |
| `{typography.headline}` | 32px | 400 | 1.25 | 0 | Card collection heading, FAQ category |
| `{typography.card-title}` | 24px | 400 | 1.33 | 0 | Feature card title |
| `{typography.subhead}` | 20px | 400 | 1.40 | 0 | Lead body next to display headlines |
| `{typography.body-lg}` | 18px | 400 | 1.50 | 0 | Hero subhead, lead paragraphs |
| `{typography.body}` | 16px | 400 | 1.50 | 0.16px | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.29 | 0.16px | Card body, footer columns |
| `{typography.body-emphasis}` | 14px | 600 | 1.29 | 0.16px | Selected tab label, emphasized body line |
| `{typography.caption}` | 12px | 400 | 1.33 | 0.32px | Captions, meta, utility bar |
| `{typography.button}` | 14px | 400 | 1.29 | 0.16px | All button labels |
| `{typography.eyebrow}` | 14px | 400 | 1.29 | 0.16px | Section eyebrows (Carbon avoids strong eyebrows; uses sentence case 14px) |

### Principles

- **Light-weight display is the brand voice.** Plex Sans at weight 300 for 76px headlines reads as quietly authoritative — switching to 700 would make it look like every other enterprise site.
- **Carbon''s `letter-spacing: 0.16px`** on body sizes is a precision detail. Don''t remove it.
- **No mono** on marketing surfaces (Plex Mono exists but lives in product surfaces only).
- **Eyebrow typography uses sentence case 14px** — Carbon resists the all-caps tracked eyebrow common to other enterprise brands.
- **Line-heights tighten on display, relax on body**: 1.17 at display-xl, 1.50 at body — proportional to size.

### Note on Font Substitutes

IBM Plex Sans is **free and open-source** (SIL OFL license) and available on Google Fonts. It is the recommended implementation. The Plex family also includes Plex Mono and Plex Serif if expanded typographic needs arise.', '{"sourcePath":"docs/design-md/ibm/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System

- **Base unit**: 4px (Carbon''s signature 4-pixel grid).
- **Tokens (front matter)**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on feature cards; `{spacing.xl}` 32px on product cards; `{spacing.xxl}` 48px on hero cards and CTA banners.
- Button padding: 12px vertical · 16px horizontal — Carbon spec.
- Form input padding: 11px vertical · 16px horizontal.

### Grid & Container

- Carbon''s 16-column grid at desktop, scaling to 8 / 4 columns at tablet / mobile.
- Max content width sits around 1584px (Carbon''s max-grid breakpoint).
- Card grids are 4-up at desktop, 2-up at tablet, 1-up at mobile.
- The customer logo marquee uses fixed-width tiles in a flex row, scrolling horizontally on smaller viewports.

### Whitespace Philosophy

Carbon uses precise alignment to a 4-pixel grid as its whitespace system. Sections separate via thin gray rows (`{colors.surface-1}`) rather than via large vertical gaps. Content is dense by design — IBM''s customers expect to see a lot on a page, not a lot of air.', '{"sourcePath":"docs/design-md/ibm/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for body type, hero text, footer body |
| 1 (hairline) | 1px `{colors.hairline}` border on canvas | Feature cards, inputs, list items |
| 2 (surface lift) | `{colors.surface-1}` background on canvas | Alternate-row banners, hovered cards |
| 3 (focus ring) | 2px `{colors.primary}` outline + 1px `{colors.hairline-strong}` underline | Focused input, focused button |

Carbon resists drop shadows on marketing — depth is carried by surface change and 1px hairlines. The exception is product / app surfaces (Carbon documents shadow tokens for elevated panels), but the marketing site barely uses them.

### Decorative Depth

- **Soft blue gradient backdrops** appear behind some hero illustrations — a faint blue-to-white wash that warms the canvas without competing with the headline.
- **No atmospheric depth.** No spotlight cards, no pastel section blocks, no gradient panels.', '{"sourcePath":"docs/design-md/ibm/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Default — every button, card, input, container |
| `{rounded.xs}` | 2px | Small badges (rare exception) |
| `{rounded.sm}` | 4px | Avatar circles squared, dropdown menus |
| `{rounded.md}` | 6px | (Used rarely; documented for completeness) |
| `{rounded.lg}` | 8px | (Used rarely; documented for completeness) |
| `{rounded.pill}` | 9999px | Status pills, badges in product UI (rare on marketing) |

The brand commits to flat 0px corners. The other tokens exist for product / mobile surfaces but rarely surface on marketing.

### Photography & Illustration Geometry

- IBM uses photography (people, hardware, sports cars) and abstract illustration (geometric mesh, dotted patterns) interchangeably.
- Image frames are flat — no rounded corners.
- Customer logo tiles sit on `{rounded.none}` 0px tiles with thin 1px borders.', '{"sourcePath":"docs/design-md/ibm/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — Blue solid CTA. The default primary across all pages.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 12px 16px, rounded `{rounded.none}`.
- Pressed state lives in `button-primary-pressed` (background shifts to `{colors.blue-80}`).

**`button-secondary`** — Charcoal solid button — Carbon''s "secondary" treatment.
- Background `{colors.ink}`, text `{colors.inverse-ink}`, type `{typography.button}`, padding 12px 16px, rounded `{rounded.none}`.

**`button-tertiary`** — White button with blue 1px border + blue text. Used for tertiary CTAs.
- Background `{colors.canvas}`, text `{colors.primary}`, type `{typography.button}`, rounded `{rounded.none}`, padding 12px 16px. (Border in implementation: 1px `{colors.primary}`.)

**`button-ghost`** — Plain text + chevron, no background until hover.
- Background `{colors.canvas}`, text `{colors.primary}`, type `{typography.button}`, rounded `{rounded.none}`, padding 12px 16px.

**`button-danger`** — Carbon''s destructive variant.
- Background `{colors.semantic-error}`, text `{colors.on-primary}`, type `{typography.button}`, rounded `{rounded.none}`, padding 12px 16px.

### Cards & Containers

**`feature-card`** — Default feature highlight tile on the home and product pages.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.none}`, padding 24px. Stroked with 1px `{colors.hairline}`.

**`feature-card-elevated`** — Same shape on `{colors.surface-1}` ground — used for "Recommended" cards in the latest-content carousel.
- Background `{colors.surface-1}`, otherwise identical structure.

**`product-card`** — Larger product showcase tile.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.none}`, padding 32px.

**`hero-card`** — Hero composition card with light-weight title, body, and CTA.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.display-md}`, rounded `{rounded.none}`, padding 48px.

**`cta-banner`** — Full-width blue CTA panel near the bottom of the page.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.headline}`, rounded `{rounded.none}`, padding 48px.

**`resource-tile`** — Smaller article / case-study tile.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.none}`, padding 16px.

**`customer-logo-tile`** — Single tile in the customer marquee on the home page (Ferrari, Pfizer, etc.).
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.caption}`, rounded `{rounded.none}`, padding 24px. 1px hairline border.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** + **`text-input-error`** — Carbon''s input chrome.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.none}`, padding 11px 16px.
- Focus state replaces the bottom 1px hairline with a 2px `{colors.primary}` underline (Carbon''s signature focus treatment).
- Error state adds 2px `{colors.semantic-error}` bottom underline.

**`newsletter-input`** — The "Stay connected" newsletter capture on the home page.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.none}`, padding 11px 16px. Adjacent submit is `button-primary`.

### Tabs

**`product-tab`** + **`product-tab-selected`** — The horizontal tab strip on product pages and the home "Recommended" carousel.
- Default: `{colors.canvas}` background, `{colors.ink-muted}` text, rounded `{rounded.none}`, padding 16px 20px. Bottom 1px hairline.
- Selected: `{colors.canvas}` background, `{colors.ink}` text, `{typography.body-emphasis}` weight, bottom 2px `{colors.primary}` underline. Same padding / rounding.

### Navigation

**`top-nav`** — Sticky white bar with the IBM logomark left, nav categories center, and search / sign-in icons right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 48px. 1px bottom hairline.

**`utility-bar`** — Slim gray ribbon above the top nav with location switch, contact, search shortcuts.
- Background `{colors.surface-1}`, text `{colors.ink-muted}`, type `{typography.caption}`, height 32px.

### Footer

**`footer`** — Charcoal footer (`{colors.inverse-canvas}`) with the IBM wordmark left and 5–6 columns of caption-sized links. The only inverted surface above the page break.
- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink-muted}`, type `{typography.body-sm}`, padding 64px 32px.', '{"sourcePath":"docs/design-md/ibm/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do

- Use `{rounded.none}` 0px on every CTA, card, input, and container. The flat-square aesthetic is the brand.
- Pair Plex Sans weight 300 for display sizes (42px+) with weight 400 for body. Resist the urge to bold the headline.
- Reserve `{colors.primary}` IBM Blue for primary CTAs, links, focused-input underlines, and CTA banner. Do not use it as a card background or eyebrow color.
- Apply `letter-spacing: 0.16px` to body sizes. It''s a Carbon precision detail and part of the typographic voice.
- Use surface change (`canvas` → `surface-1`) and 1px hairlines for card hierarchy. Skip drop shadows.
- Stick to sentence case for eyebrows and section labels — Carbon resists all-caps tracking.
- Invert to `{colors.inverse-canvas}` only at the footer; the rest of the page stays light.

### Don''t

- Don''t round corners on buttons, cards, or inputs. Even 4px rounded corners break the Carbon look.
- Don''t bold display headlines. Plex Sans at weight 300 is the brand voice; weight 700 makes it look generic.
- Don''t add atmospheric depth (gradient backdrops, drop shadows, atmospheric overlays) outside the documented soft-blue hero gradient.
- Don''t introduce a second brand color. IBM Blue is the only chromatic accent; status semantics use the documented green / yellow / red.
- Don''t replace IBM Plex Sans with Inter or Helvetica without preserving the `letter-spacing: 0.16px` and weight-300 display treatment.
- Don''t use pill-shaped buttons. Carbon uses square corners; pills read as a different brand.
- Don''t write all-caps tracked eyebrows. Carbon''s eyebrows are sentence case at 14px.', '{"sourcePath":"docs/design-md/ibm/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Max | 1584px | Carbon max grid; gutters expand |
| Desktop-XL | 1312px | Default desktop layout |
| Desktop | 1056px | Card grid 4-up maintained |
| Tablet | 672px | Card grid 4-up → 2-up; nav becomes hamburger |
| Mobile | 320px | Single-column; display-xl scales 76px → ~32px |

### Touch Targets

- Carbon spec: 48px minimum tap target. Buttons and inputs hold 48px on touch viewports.
- Top-nav links grow from 36px to 48px tap height on touch.
- Tab strip rows hold 48px tap height.

### Collapsing Strategy

- **Top nav**: links collapse to a hamburger overlay below 672px. Logomark and search icon stay on the bar.
- **Utility bar**: hides below 672px to reclaim vertical space.
- **Card grid**: 4-up → 2-up at 1056px → 1-up below 672px.
- **Display type**: `{typography.display-xl}` 76px scales toward 42px on mobile while preserving the weight-300 treatment.
- **Footer**: 6-column link grid → 3-column at tablet → 1-column at mobile.

### Image Behavior

- Customer logos in the marquee maintain aspect ratio and may collapse to 2-row scroll below 672px.
- Hero illustrations scale proportionally; below 672px they may stack above the headline rather than sit beside it.', '{"sourcePath":"docs/design-md/ibm/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. Default body to `{typography.body}` at weight 400 with `letter-spacing: 0.16px`. Don''t remove the tracking.
3. When introducing a new section, decide whether it sits on `{colors.canvas}` (default) or on `{colors.surface-1}` (alternate band). The two-surface rhythm is the rhythm.
4. Run `npx @google/design.md lint DESIGN.md` after edits.
5. Add new variants as separate component entries (`button-primary-pressed`, `text-input-error`, `text-input-focused`).
6. Treat IBM Blue as scarce: links, primary CTA, CTA banner, focus underline. Anything beyond that is drift.
7. Resist rounded corners. If a designer pushes for 4px rounding, the brand is shifting away from Carbon.', '{"sourcePath":"docs/design-md/ibm/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- IBM''s product surfaces (cloud-pak, watson, datacap) have richer Carbon component usage (data tables, graph cells, breadcrumbs, contextual menus) that aren''t present on the marketing pages inspected — those components live in Carbon''s documentation rather than in the marketing extraction.
- Form-field error and validation styling is documented in Carbon docs; the inspected pages didn''t render error states.
- Dark mode is documented in Carbon as Gray-100 theme but isn''t exposed on these marketing pages — only the footer inverts. The full dark theme is a separate Carbon palette not extracted here.
- The community.ibm.com sub-domain uses a different chrome (community-platform white-label) that approximates Carbon but isn''t strict — the documented system applies to ibm.com proper.', '{"sourcePath":"docs/design-md/ibm/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_1', '#0f62fe', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_3', '#161616', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_4', '#525252', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_5', '#8c8c8c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_6', '#f4f4f4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_7', '#e0e0e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_8', '#262626', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_9', '#c6c6c6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_10', '#0043ce', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_11', '#002d9c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_12', '#0050e6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_13', '#24a148', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_14', '#f1c21b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md'), 'color', 'color_15', '#da1e28', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/ibm/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/ibm/DESIGN.md';


-- Intercom
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Intercom', 'intercom', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/intercom/DESIGN.md', null, 'seeded', '---
version: alpha
name: Intercom-design-analysis
description: "An editorial customer-service marketing canvas built around a soft cream-white ground, charcoal type set in Saans (Intercom''s proprietary geometric sans), and a single confident Fin Orange (#ff5600) reserved for the Fin AI brand. Cards live as floating white tiles with thin hairline borders and minimal radii (8–16px). Display headlines run Saans at weight 500 with measured negative tracking. The system reads as a careful, product-led publication: product screenshots dominate, ornament is rare, and the only place chromatic energy enters is the Fin Orange CTA."

colors:
  primary: "#111111"
  on-primary: "#ffffff"
  ink: "#111111"
  ink-muted: "#626260"
  ink-subtle: "#7b7b78"
  ink-tertiary: "#9c9fa5"
  canvas: "#f5f1ec"
  surface-1: "#ffffff"
  surface-2: "#ebe7e1"
  inverse-canvas: "#000000"
  inverse-surface-1: "#313130"
  inverse-ink: "#ffffff"
  inverse-ink-muted: "#9c9fa5"
  hairline: "#d3cec6"
  hairline-soft: "#ebe7e1"
  fin-orange: "#ff5600"
  report-orange: "#fe4c02"
  report-blue: "#65b5ff"
  report-green: "#0bdf50"
  report-pink: "#ff2067"
  report-lime: "#b3e01c"
  report-cyan: "#03b2cb"
  brand-blue: "#0007cb"
  semantic-error: "#c41c1c"
  semantic-success: "#0bdf50"

typography:
  display-xl:
    fontFamily: Saans
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -2.0px
  display-lg:
    fontFamily: Saans
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.10
    letterSpacing: -1.4px
  display-md:
    fontFamily: Saans
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.8px
  headline:
    fontFamily: Saans
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: -0.5px
  card-title:
    fontFamily: Saans
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.3px
  subhead:
    fontFamily: Saans
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: -0.2px
  body-lg:
    fontFamily: Saans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.1px
  body:
    fontFamily: Saans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  body-sm:
    fontFamily: Saans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  caption:
    fontFamily: Saans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  button:
    fontFamily: Saans
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0
  eyebrow:
    fontFamily: Saans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0
  mono:
    fontFamily: SaansMono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0

rounded:
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
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  button-primary-pressed:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  button-fin:
    backgroundColor: "{colors.fin-orange}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  pricing-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-card-featured:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  feature-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  product-mockup-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  testimonial-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  customer-logo-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 16px
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 14px
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 14px
  pricing-tab-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
  pricing-tab-selected:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
  faq-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 24px
  cta-banner:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: 48px
  startup-discount-card:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 32px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 56px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
---

## Overview

Intercom''s marketing canvas is a soft cream-white ground (`{colors.canvas}` ≈ #f5f1ec) — not pure white. The warmth is the brand''s signal: this is editorial, calm, and product-focused, not bright SaaS. On top of the cream canvas sit white floating cards (`{colors.surface-1}`), thin hairline dividers (`{colors.hairline}`), and charcoal type (`{colors.ink}` #111111).

Display type is **Saans** — Intercom''s proprietary geometric sans — set at weight 500 with measured negative letter-spacing (-2.0px on 72px display). Body type is the same family at weight 400. The single proprietary mono is **SaansMono**, used sparingly for code snippets and product UI screenshots embedded in the marketing surface.

The single chromatic accent is **Fin Orange** (`{colors.fin-orange}` #ff5600) — Intercom''s AI-product brand color. It surfaces on the Fin product CTA, the Fin badge in pricing, and a few inline emphasis moments. It is NOT a system primary; the system primary is charcoal `{colors.ink}`. Intercom also maintains a small **report palette** (`{colors.report-blue}`, `{colors.report-green}`, `{colors.report-pink}`, `{colors.report-lime}`) used inside in-product analytics surfaces shown in mockups.

The page rhythm is heavy on **product mockups**: every section''s payload is a high-fidelity screenshot of Intercom''s product UI, framed in white cards with `{rounded.xl}` 16px corners. The marketing chrome is intentionally quiet so the product can be the protagonist.

**Key Characteristics:**
- **Cream canvas** (`{colors.canvas}` #f5f1ec) is the brand''s defining surface — neither white nor gray, deliberately warm.
- Product-screenshot-led page rhythm: every section centers a product mockup card, marketing chrome stays minimal.
- **Saans** proprietary sans-serif carries the entire hierarchy; SaansMono for code-only contexts.
- **Charcoal** `{colors.ink}` (#111111) is the system primary — buttons, headlines, body type all sit on charcoal.
- **Fin Orange** (`{colors.fin-orange}` #ff5600) is the AI product color — used on the Fin CTA and Fin badge, never decoratively.
- Display tracking pulls aggressively negative (-2.0px on 72px); body stays at 0.
- Card corners stay modest at `{rounded.lg}` 12px and `{rounded.xl}` 16px — never pill-rounded; never square.

## Colors

> Source pages: intercom.com (home), /pricing, /helpdesk, /customers, /helpdesk/inbox.

### Brand & Accent
- **Charcoal** ({colors.ink}): The system primary surface. Headlines, body type, primary CTA pill background — all charcoal.
- **White** ({colors.on-primary}): Text on charcoal CTAs; canvas of floating cards.
- **Fin Orange** ({colors.fin-orange}): The AI-product accent. Used on the Fin CTA, Fin badge, and a small set of inline emphasis moments.
- **Report Orange** ({colors.report-orange}): A slightly different orange used inside the report / analytics palette for in-product mockups.
- **Brand Blue** ({colors.brand-blue}): Saturated brand blue (#0007cb) — used on a small set of marketing illustrations.

### Surface
- **Canvas** ({colors.canvas}): Default page background — soft cream-white #f5f1ec.
- **Surface 1** ({colors.surface-1}): Pure white — used for floating cards (pricing, feature, product-mockup).
- **Surface 2** ({colors.surface-2}): Slightly darker cream — startup-discount banner, alt-row stripes.
- **Hairline** ({colors.hairline}): 1px borders on cards — soft warm gray (#d3cec6).
- **Hairline Soft** ({colors.hairline-soft}): Even softer dividers between FAQ rows and footer columns.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure black — only on the testimonial / quote callout strip.
- **Inverse Surface 1** ({colors.inverse-surface-1}): One step lighter — hovered footer items in dark contexts.

### Text
- **Ink** ({colors.ink}): All headlines, body type, button labels — charcoal #111111.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #626260 — meta info, deselected pricing tabs.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #7b7b78 — footer columns, helper text.
- **Ink Tertiary** ({colors.ink-tertiary}): Quaternary type at #9c9fa5 — disabled, footnotes.
- **Inverse Ink** ({colors.inverse-ink}): White on black — quote-strip type.
- **Inverse Ink Muted** ({colors.inverse-ink-muted}): Light gray on black — quote-strip meta.

### Semantic & Report Palette (in-product mockups)
- **Error Red** ({colors.semantic-error}): Form validation, destructive states.
- **Success Green** ({colors.semantic-success}): Positive states (also `{colors.report-green}`).
- **Report Blue** ({colors.report-blue}): Analytics chart blue.
- **Report Pink** ({colors.report-pink}): Analytics chart pink.
- **Report Lime** ({colors.report-lime}): Analytics chart lime.
- **Report Cyan** ({colors.report-cyan}): Phone country selector accent.

The report palette appears INSIDE product UI mockups — these are Intercom''s in-product chart colors, not marketing surface colors.

## Typography

### Font Family

- **Saans** — Intercom''s proprietary geometric sans, fallback `Saans Fallback, ui-sans-serif, system-ui`. Carries display, body, eyebrow, and button.
- **SaansMono** — Proprietary mono, fallback `SaansMono Fallback, ui-monospace`. Used inside code snippets shown in product mockups.

The same family carries the entire hierarchy. Hierarchy is carried by size + weight + tracking, not by family change.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 72px | 500 | 1.05 | -2.0px | Largest hero headline |
| `{typography.display-lg}` | 56px | 500 | 1.10 | -1.4px | Section opener headlines |
| `{typography.display-md}` | 40px | 500 | 1.15 | -0.8px | Sub-section headlines |
| `{typography.headline}` | 28px | 500 | 1.20 | -0.5px | Pricing tier titles, CTA banner |
| `{typography.card-title}` | 22px | 500 | 1.25 | -0.3px | Card title, feature card |
| `{typography.subhead}` | 20px | 400 | 1.40 | -0.2px | Lead body, intro paragraphs |
| `{typography.body-lg}` | 18px | 400 | 1.50 | -0.1px | Hero subhead, lead paragraphs |
| `{typography.body}` | 16px | 400 | 1.50 | 0 | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Card body, footer |
| `{typography.caption}` | 12px | 400 | 1.40 | 0 | Captions, meta |
| `{typography.button}` | 15px | 500 | 1.20 | 0 | Pill / square button labels |
| `{typography.eyebrow}` | 14px | 500 | 1.30 | 0 | Section eyebrow (sentence case) |
| `{typography.mono}` | 13px | 400 | 1.50 | 0 | SaansMono for code in mockups |

### Principles

- **Weight 500 carries display.** Saans at 500 reads as confident without bold.
- **Negative letter-spacing scales with size.** -2.0px at 72px (≈3% of size), down to 0 on body.
- **Line-heights tighten on display, relax on body.** 1.05 at display-xl, 1.50 at body.
- **No mono on chrome.** SaansMono lives in product UI; marketing chrome stays in Saans.
- **Eyebrow uses sentence case** at 14px / 500 weight — no all-caps tracking.

### Note on Font Substitutes

If implementing without Saans, suitable substitutes include **Söhne** (paid), **Inter** (free, weight 500), or **Geist Sans** (free). Inter at weight 500 is the closest free substitute; SaansMono can be approximated with **JetBrains Mono** at weight 400.

## Layout

### Spacing System

- **Base unit**: 8px.
- **Tokens (front matter)**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on pricing/feature cards; `{spacing.xl}` 32px on testimonial/discount cards; `{spacing.xxl}` 48px on CTA banners.
- Pill button padding: 10px vertical · 18px horizontal.

### Grid & Container

- Max content width sits around 1280px.
- Card grids are 3-up at desktop, 2-up at tablet, 1-up at mobile.
- Pricing tier grid is 3-up; comparison strip below shows checkmarks per tier.
- Product mockup cards span full content width — they''re the protagonist of every section.

### Whitespace Philosophy

The cream canvas does the work white space would in another brand. Sections separate by ample vertical breathing room (`{spacing.section}` 96px) plus the lift-onto-white cards.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for body type, hero text, footer |
| 1 (lift on cream) | `{colors.surface-1}` white background on `{colors.canvas}` cream | Pricing cards, feature cards, product mockups |
| 2 (hairline lift) | `{colors.surface-1}` + 1px `{colors.hairline}` border | Floating tiles with extra definition |
| 3 (deep accent) | `{colors.inverse-canvas}` true black | Quote / testimonial callout strip |

Intercom resists drop shadows. Depth is communicated by the white-on-cream surface change.

### Decorative Depth

- **Product UI mockups** dominate every section''s right column or center band — these are screenshots, not illustrations.
- **No atmospheric gradients, no spotlight cards, no pastel section blocks.** The cream + white system is deliberately restrained.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, badges |
| `{rounded.sm}` | 6px | Inline tags |
| `{rounded.md}` | 8px | All buttons, form inputs |
| `{rounded.lg}` | 12px | Pricing cards, feature cards, FAQ rows |
| `{rounded.xl}` | 16px | Product mockup cards |
| `{rounded.xxl}` | 24px | Oversized CTA banners |
| `{rounded.pill}` | 9999px | Tab toggles |
| `{rounded.full}` | 9999px | Avatar circles |

### Photography & Illustration Geometry

- Product UI screenshots dominate the marketing surface; they sit in `{rounded.xl}` 16px tiles.
- Customer logo tiles render at small sizes (~24–32px logo height) on `{colors.canvas}` cream with no border.
- Avatar circles in testimonial cards use `{rounded.full}` at 40–48px sizes.

## Components

### Buttons

**`button-primary`** — Charcoal CTA. The default primary CTA across all pages.
- Background `{colors.ink}`, text `{colors.on-primary}`, type `{typography.button}`, padding 10px 18px, rounded `{rounded.md}`.
- Pressed state lives in `button-primary-pressed`.

**`button-secondary`** — White button on cream. Used for secondary CTAs.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.button}`, padding 10px 18px, rounded `{rounded.md}`. 1px `{colors.hairline}` border.

**`button-tertiary`** — Plain text button.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

**`button-fin`** — Fin Orange CTA — reserved for Fin AI product CTAs.
- Background `{colors.fin-orange}`, text `{colors.on-primary}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

### Pricing Tabs

**`pricing-tab-default`** + **`pricing-tab-selected`** — Pill-toggle on `/pricing`.
- Default: `{colors.canvas}` background, `{colors.ink-muted}` text, rounded `{rounded.pill}`.
- Selected: `{colors.surface-1}` white background, `{colors.ink}` text — selected = lift onto white.

### Cards & Containers

**`pricing-card`** — Each tier on `/pricing`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`pricing-card-featured`** — Featured / recommended tier — inverts to charcoal.
- Background `{colors.ink}`, text `{colors.on-primary}`, otherwise identical structure.

**`feature-card`** — Generic feature highlight.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`product-mockup-card`** — The dominant card type — frames a high-fidelity product UI screenshot.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xl}`, padding 24px.

**`testimonial-card`** — Customer quote with avatar + name + company.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-lg}`, rounded `{rounded.lg}`, padding 32px.

**`startup-discount-card`** — The "Startups get 90% off" tinted card.
- Background `{colors.surface-2}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 32px.

**`customer-logo-tile`** — Small tile in the customer marquee.
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.caption}`, rounded `{rounded.xs}`, padding 16px.

**`cta-banner`** — Closing CTA panel near page bottom.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.headline}`, rounded `{rounded.lg}`, padding 48px.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on contact and search overlays.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 10px 14px.

### FAQ

**`faq-row`** — Expandable accordion row in the pricing FAQ.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 24px. 1px `{colors.hairline-soft}` bottom rule.

### Navigation

**`top-nav`** — Sticky cream bar with the Intercom wordmark left, nav links centered, log-in + sign-up pair right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 56px.

### Footer

**`footer`** — Dense link grid on `{colors.canvas}` cream with the Intercom wordmark left.
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.caption}`, padding 64px 32px.

## Do''s and Don''ts

### Do

- Reserve `{colors.canvas}` cream as the system''s anchor surface — never replace with pure white.
- Lift cards from cream onto white (`{colors.surface-1}`) for hierarchy.
- Use **`button-fin`** Fin Orange ONLY on Fin AI product CTAs and Fin badges.
- Pair Saans display at weight 500 with body at 400.
- Use product UI screenshots as the protagonist of every section.
- Use `{rounded.lg}` 12px for cards and `{rounded.xl}` 16px for product mockup tiles.
- Apply negative tracking proportionally to display sizes.

### Don''t

- Don''t use pure white as the canvas.
- Don''t use Fin Orange as a section background or as a generic primary CTA.
- Don''t add drop shadows to floating cards.
- Don''t introduce a second display family.
- Don''t pill-round CTAs.
- Don''t write all-caps tracked eyebrows.
- Don''t promote the report palette colors to brand-level surfaces.
- Don''t combine charcoal CTAs and Fin Orange CTAs in the same viewport.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop-XL | 1440px | Default desktop layout |
| Desktop | 1280px | Card grid 3-up maintained |
| Tablet | 1024px | Card grid 3-up → 2-up |
| Mobile-Lg | 768px | Pricing comparison becomes accordion; nav hamburger |
| Mobile | 480px | Single-column; display-xl scales 72px → ~32px |

### Touch Targets

- CTAs hold ≥40px tap height across viewports.
- Pricing tab pills hold ≥40px tap height.
- Form inputs hold ≥44px tap target on touch.

### Collapsing Strategy

- **Top nav**: links collapse to hamburger below 768px; primary CTA stays visible.
- **Card grids**: 3-up → 2-up at 1024px → 1-up below 768px.
- **Pricing comparison**: collapses into per-tier accordion below 768px.
- **Display type**: `{typography.display-xl}` 72px scales toward `{typography.display-md}` 40px on mobile.

### Image Behavior

- Product UI screenshots maintain aspect ratio and never crop.
- Customer logos in the marquee may collapse from 6-up to 3-up below 768px.

## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. When introducing a section, decide first whether it sits on `{colors.canvas}` cream (default) or whether it lifts onto a `{colors.surface-1}` white card.
3. Default body to `{typography.body}` at weight 400.
4. Run `npx @google/design.md lint DESIGN.md` after edits.
5. Add new variants as separate component entries.
6. Treat Fin Orange as a product accent: Fin CTA and Fin badge only.
7. Lead every section with a product screenshot.

## Known Gaps

- The **report palette** lives in product analytics dashboards rendered inside marketing mockups; they are documented for completeness but are not brand surface colors.
- Form-field error and validation styling is not visible on the inspected pages.
- Dark mode is not documented because the marketing site does not ship a dark theme.
- The helpdesk / inbox product surfaces show in-product UI states that aren''t formal marketing chrome.
- Saans and SaansMono are proprietary; an open-source substitute (Inter, Söhne, Geist) is acceptable.
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

Intercom''s marketing canvas is a soft cream-white ground (`{colors.canvas}` ≈ #f5f1ec) — not pure white. The warmth is the brand''s signal: this is editorial, calm, and product-focused, not bright SaaS. On top of the cream canvas sit white floating cards (`{colors.surface-1}`), thin hairline dividers (`{colors.hairline}`), and charcoal type (`{colors.ink}` #111111).

Display type is **Saans** — Intercom''s proprietary geometric sans — set at weight 500 with measured negative letter-spacing (-2.0px on 72px display). Body type is the same family at weight 400. The single proprietary mono is **SaansMono**, used sparingly for code snippets and product UI screenshots embedded in the marketing surface.

The single chromatic accent is **Fin Orange** (`{colors.fin-orange}` #ff5600) — Intercom''s AI-product brand color. It surfaces on the Fin product CTA, the Fin badge in pricing, and a few inline emphasis moments. It is NOT a system primary; the system primary is charcoal `{colors.ink}`. Intercom also maintains a small **report palette** (`{colors.report-blue}`, `{colors.report-green}`, `{colors.report-pink}`, `{colors.report-lime}`) used inside in-product analytics surfaces shown in mockups.

The page rhythm is heavy on **product mockups**: every section''s payload is a high-fidelity screenshot of Intercom''s product UI, framed in white cards with `{rounded.xl}` 16px corners. The marketing chrome is intentionally quiet so the product can be the protagonist.

**Key Characteristics:**
- **Cream canvas** (`{colors.canvas}` #f5f1ec) is the brand''s defining surface — neither white nor gray, deliberately warm.
- Product-screenshot-led page rhythm: every section centers a product mockup card, marketing chrome stays minimal.
- **Saans** proprietary sans-serif carries the entire hierarchy; SaansMono for code-only contexts.
- **Charcoal** `{colors.ink}` (#111111) is the system primary — buttons, headlines, body type all sit on charcoal.
- **Fin Orange** (`{colors.fin-orange}` #ff5600) is the AI product color — used on the Fin CTA and Fin badge, never decoratively.
- Display tracking pulls aggressively negative (-2.0px on 72px); body stays at 0.
- Card corners stay modest at `{rounded.lg}` 12px and `{rounded.xl}` 16px — never pill-rounded; never square.', '{"sourcePath":"docs/design-md/intercom/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: intercom.com (home), /pricing, /helpdesk, /customers, /helpdesk/inbox.

### Brand & Accent
- **Charcoal** ({colors.ink}): The system primary surface. Headlines, body type, primary CTA pill background — all charcoal.
- **White** ({colors.on-primary}): Text on charcoal CTAs; canvas of floating cards.
- **Fin Orange** ({colors.fin-orange}): The AI-product accent. Used on the Fin CTA, Fin badge, and a small set of inline emphasis moments.
- **Report Orange** ({colors.report-orange}): A slightly different orange used inside the report / analytics palette for in-product mockups.
- **Brand Blue** ({colors.brand-blue}): Saturated brand blue (#0007cb) — used on a small set of marketing illustrations.

### Surface
- **Canvas** ({colors.canvas}): Default page background — soft cream-white #f5f1ec.
- **Surface 1** ({colors.surface-1}): Pure white — used for floating cards (pricing, feature, product-mockup).
- **Surface 2** ({colors.surface-2}): Slightly darker cream — startup-discount banner, alt-row stripes.
- **Hairline** ({colors.hairline}): 1px borders on cards — soft warm gray (#d3cec6).
- **Hairline Soft** ({colors.hairline-soft}): Even softer dividers between FAQ rows and footer columns.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure black — only on the testimonial / quote callout strip.
- **Inverse Surface 1** ({colors.inverse-surface-1}): One step lighter — hovered footer items in dark contexts.

### Text
- **Ink** ({colors.ink}): All headlines, body type, button labels — charcoal #111111.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #626260 — meta info, deselected pricing tabs.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #7b7b78 — footer columns, helper text.
- **Ink Tertiary** ({colors.ink-tertiary}): Quaternary type at #9c9fa5 — disabled, footnotes.
- **Inverse Ink** ({colors.inverse-ink}): White on black — quote-strip type.
- **Inverse Ink Muted** ({colors.inverse-ink-muted}): Light gray on black — quote-strip meta.

### Semantic & Report Palette (in-product mockups)
- **Error Red** ({colors.semantic-error}): Form validation, destructive states.
- **Success Green** ({colors.semantic-success}): Positive states (also `{colors.report-green}`).
- **Report Blue** ({colors.report-blue}): Analytics chart blue.
- **Report Pink** ({colors.report-pink}): Analytics chart pink.
- **Report Lime** ({colors.report-lime}): Analytics chart lime.
- **Report Cyan** ({colors.report-cyan}): Phone country selector accent.

The report palette appears INSIDE product UI mockups — these are Intercom''s in-product chart colors, not marketing surface colors.', '{"sourcePath":"docs/design-md/intercom/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

- **Saans** — Intercom''s proprietary geometric sans, fallback `Saans Fallback, ui-sans-serif, system-ui`. Carries display, body, eyebrow, and button.
- **SaansMono** — Proprietary mono, fallback `SaansMono Fallback, ui-monospace`. Used inside code snippets shown in product mockups.

The same family carries the entire hierarchy. Hierarchy is carried by size + weight + tracking, not by family change.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 72px | 500 | 1.05 | -2.0px | Largest hero headline |
| `{typography.display-lg}` | 56px | 500 | 1.10 | -1.4px | Section opener headlines |
| `{typography.display-md}` | 40px | 500 | 1.15 | -0.8px | Sub-section headlines |
| `{typography.headline}` | 28px | 500 | 1.20 | -0.5px | Pricing tier titles, CTA banner |
| `{typography.card-title}` | 22px | 500 | 1.25 | -0.3px | Card title, feature card |
| `{typography.subhead}` | 20px | 400 | 1.40 | -0.2px | Lead body, intro paragraphs |
| `{typography.body-lg}` | 18px | 400 | 1.50 | -0.1px | Hero subhead, lead paragraphs |
| `{typography.body}` | 16px | 400 | 1.50 | 0 | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Card body, footer |
| `{typography.caption}` | 12px | 400 | 1.40 | 0 | Captions, meta |
| `{typography.button}` | 15px | 500 | 1.20 | 0 | Pill / square button labels |
| `{typography.eyebrow}` | 14px | 500 | 1.30 | 0 | Section eyebrow (sentence case) |
| `{typography.mono}` | 13px | 400 | 1.50 | 0 | SaansMono for code in mockups |

### Principles

- **Weight 500 carries display.** Saans at 500 reads as confident without bold.
- **Negative letter-spacing scales with size.** -2.0px at 72px (≈3% of size), down to 0 on body.
- **Line-heights tighten on display, relax on body.** 1.05 at display-xl, 1.50 at body.
- **No mono on chrome.** SaansMono lives in product UI; marketing chrome stays in Saans.
- **Eyebrow uses sentence case** at 14px / 500 weight — no all-caps tracking.

### Note on Font Substitutes

If implementing without Saans, suitable substitutes include **Söhne** (paid), **Inter** (free, weight 500), or **Geist Sans** (free). Inter at weight 500 is the closest free substitute; SaansMono can be approximated with **JetBrains Mono** at weight 400.', '{"sourcePath":"docs/design-md/intercom/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System

- **Base unit**: 8px.
- **Tokens (front matter)**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on pricing/feature cards; `{spacing.xl}` 32px on testimonial/discount cards; `{spacing.xxl}` 48px on CTA banners.
- Pill button padding: 10px vertical · 18px horizontal.

### Grid & Container

- Max content width sits around 1280px.
- Card grids are 3-up at desktop, 2-up at tablet, 1-up at mobile.
- Pricing tier grid is 3-up; comparison strip below shows checkmarks per tier.
- Product mockup cards span full content width — they''re the protagonist of every section.

### Whitespace Philosophy

The cream canvas does the work white space would in another brand. Sections separate by ample vertical breathing room (`{spacing.section}` 96px) plus the lift-onto-white cards.', '{"sourcePath":"docs/design-md/intercom/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for body type, hero text, footer |
| 1 (lift on cream) | `{colors.surface-1}` white background on `{colors.canvas}` cream | Pricing cards, feature cards, product mockups |
| 2 (hairline lift) | `{colors.surface-1}` + 1px `{colors.hairline}` border | Floating tiles with extra definition |
| 3 (deep accent) | `{colors.inverse-canvas}` true black | Quote / testimonial callout strip |

Intercom resists drop shadows. Depth is communicated by the white-on-cream surface change.

### Decorative Depth

- **Product UI mockups** dominate every section''s right column or center band — these are screenshots, not illustrations.
- **No atmospheric gradients, no spotlight cards, no pastel section blocks.** The cream + white system is deliberately restrained.', '{"sourcePath":"docs/design-md/intercom/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, badges |
| `{rounded.sm}` | 6px | Inline tags |
| `{rounded.md}` | 8px | All buttons, form inputs |
| `{rounded.lg}` | 12px | Pricing cards, feature cards, FAQ rows |
| `{rounded.xl}` | 16px | Product mockup cards |
| `{rounded.xxl}` | 24px | Oversized CTA banners |
| `{rounded.pill}` | 9999px | Tab toggles |
| `{rounded.full}` | 9999px | Avatar circles |

### Photography & Illustration Geometry

- Product UI screenshots dominate the marketing surface; they sit in `{rounded.xl}` 16px tiles.
- Customer logo tiles render at small sizes (~24–32px logo height) on `{colors.canvas}` cream with no border.
- Avatar circles in testimonial cards use `{rounded.full}` at 40–48px sizes.', '{"sourcePath":"docs/design-md/intercom/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — Charcoal CTA. The default primary CTA across all pages.
- Background `{colors.ink}`, text `{colors.on-primary}`, type `{typography.button}`, padding 10px 18px, rounded `{rounded.md}`.
- Pressed state lives in `button-primary-pressed`.

**`button-secondary`** — White button on cream. Used for secondary CTAs.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.button}`, padding 10px 18px, rounded `{rounded.md}`. 1px `{colors.hairline}` border.

**`button-tertiary`** — Plain text button.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

**`button-fin`** — Fin Orange CTA — reserved for Fin AI product CTAs.
- Background `{colors.fin-orange}`, text `{colors.on-primary}`, type `{typography.button}`, rounded `{rounded.md}`, padding 10px 18px.

### Pricing Tabs

**`pricing-tab-default`** + **`pricing-tab-selected`** — Pill-toggle on `/pricing`.
- Default: `{colors.canvas}` background, `{colors.ink-muted}` text, rounded `{rounded.pill}`.
- Selected: `{colors.surface-1}` white background, `{colors.ink}` text — selected = lift onto white.

### Cards & Containers

**`pricing-card`** — Each tier on `/pricing`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`pricing-card-featured`** — Featured / recommended tier — inverts to charcoal.
- Background `{colors.ink}`, text `{colors.on-primary}`, otherwise identical structure.

**`feature-card`** — Generic feature highlight.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`product-mockup-card`** — The dominant card type — frames a high-fidelity product UI screenshot.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xl}`, padding 24px.

**`testimonial-card`** — Customer quote with avatar + name + company.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-lg}`, rounded `{rounded.lg}`, padding 32px.

**`startup-discount-card`** — The "Startups get 90% off" tinted card.
- Background `{colors.surface-2}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 32px.

**`customer-logo-tile`** — Small tile in the customer marquee.
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.caption}`, rounded `{rounded.xs}`, padding 16px.

**`cta-banner`** — Closing CTA panel near page bottom.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.headline}`, rounded `{rounded.lg}`, padding 48px.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on contact and search overlays.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 10px 14px.

### FAQ

**`faq-row`** — Expandable accordion row in the pricing FAQ.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 24px. 1px `{colors.hairline-soft}` bottom rule.

### Navigation

**`top-nav`** — Sticky cream bar with the Intercom wordmark left, nav links centered, log-in + sign-up pair right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 56px.

### Footer

**`footer`** — Dense link grid on `{colors.canvas}` cream with the Intercom wordmark left.
- Background `{colors.canvas}`, text `{colors.ink-muted}`, type `{typography.caption}`, padding 64px 32px.', '{"sourcePath":"docs/design-md/intercom/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do

- Reserve `{colors.canvas}` cream as the system''s anchor surface — never replace with pure white.
- Lift cards from cream onto white (`{colors.surface-1}`) for hierarchy.
- Use **`button-fin`** Fin Orange ONLY on Fin AI product CTAs and Fin badges.
- Pair Saans display at weight 500 with body at 400.
- Use product UI screenshots as the protagonist of every section.
- Use `{rounded.lg}` 12px for cards and `{rounded.xl}` 16px for product mockup tiles.
- Apply negative tracking proportionally to display sizes.

### Don''t

- Don''t use pure white as the canvas.
- Don''t use Fin Orange as a section background or as a generic primary CTA.
- Don''t add drop shadows to floating cards.
- Don''t introduce a second display family.
- Don''t pill-round CTAs.
- Don''t write all-caps tracked eyebrows.
- Don''t promote the report palette colors to brand-level surfaces.
- Don''t combine charcoal CTAs and Fin Orange CTAs in the same viewport.', '{"sourcePath":"docs/design-md/intercom/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop-XL | 1440px | Default desktop layout |
| Desktop | 1280px | Card grid 3-up maintained |
| Tablet | 1024px | Card grid 3-up → 2-up |
| Mobile-Lg | 768px | Pricing comparison becomes accordion; nav hamburger |
| Mobile | 480px | Single-column; display-xl scales 72px → ~32px |

### Touch Targets

- CTAs hold ≥40px tap height across viewports.
- Pricing tab pills hold ≥40px tap height.
- Form inputs hold ≥44px tap target on touch.

### Collapsing Strategy

- **Top nav**: links collapse to hamburger below 768px; primary CTA stays visible.
- **Card grids**: 3-up → 2-up at 1024px → 1-up below 768px.
- **Pricing comparison**: collapses into per-tier accordion below 768px.
- **Display type**: `{typography.display-xl}` 72px scales toward `{typography.display-md}` 40px on mobile.

### Image Behavior

- Product UI screenshots maintain aspect ratio and never crop.
- Customer logos in the marquee may collapse from 6-up to 3-up below 768px.', '{"sourcePath":"docs/design-md/intercom/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. When introducing a section, decide first whether it sits on `{colors.canvas}` cream (default) or whether it lifts onto a `{colors.surface-1}` white card.
3. Default body to `{typography.body}` at weight 400.
4. Run `npx @google/design.md lint DESIGN.md` after edits.
5. Add new variants as separate component entries.
6. Treat Fin Orange as a product accent: Fin CTA and Fin badge only.
7. Lead every section with a product screenshot.', '{"sourcePath":"docs/design-md/intercom/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- The **report palette** lives in product analytics dashboards rendered inside marketing mockups; they are documented for completeness but are not brand surface colors.
- Form-field error and validation styling is not visible on the inspected pages.
- Dark mode is not documented because the marketing site does not ship a dark theme.
- The helpdesk / inbox product surfaces show in-product UI states that aren''t formal marketing chrome.
- Saans and SaansMono are proprietary; an open-source substitute (Inter, Söhne, Geist) is acceptable.', '{"sourcePath":"docs/design-md/intercom/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_1', '#ff5600', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_2', '#111111', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_3', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_4', '#626260', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_5', '#7b7b78', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_6', '#9c9fa5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_7', '#f5f1ec', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_8', '#ebe7e1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_9', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_10', '#313130', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_11', '#d3cec6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_12', '#fe4c02', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_13', '#65b5ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_14', '#0bdf50', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_15', '#ff2067', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_16', '#b3e01c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_17', '#03b2cb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_18', '#0007cb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md'), 'color', 'color_19', '#c41c1c', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/intercom/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/intercom/DESIGN.md';


-- Kraken
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Kraken', 'kraken', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/kraken/DESIGN.md', null, 'seeded', '# Design System Inspired by Kraken

## 1. Visual Theme & Atmosphere

Kraken''s website is a clean, trustworthy crypto exchange that uses purple as its commanding brand color. The design operates on white backgrounds with Kraken Purple (`#7132f5`, `#5741d8`, `#5b1ecf`) creating a distinctive, professional crypto identity. The proprietary Kraken-Brand font handles display headings with bold (700) weight and negative tracking, while Kraken-Product (with IBM Plex Sans fallback) serves as the UI workhorse.

**Key Characteristics:**
- Kraken Purple (`#7132f5`) as primary brand with darker variants (`#5741d8`, `#5b1ecf`)
- Kraken-Brand (display) + Kraken-Product (UI) dual font system
- Near-black (`#101114`) text with cool blue-gray neutral scale
- 12px radius buttons (rounded but not pill)
- Subtle shadows (`rgba(0,0,0,0.03) 0px 4px 24px`) — whisper-level
- Green accent (`#149e61`) for positive/success states

## 2. Color Palette & Roles

### Primary
- **Kraken Purple** (`#7132f5`): Primary CTA, brand accent, links
- **Purple Dark** (`#5741d8`): Button borders, outlined variants
- **Purple Deep** (`#5b1ecf`): Deepest purple
- **Purple Subtle** (`rgba(133,91,251,0.16)`): Purple at 16% — subtle button backgrounds
- **Near Black** (`#101114`): Primary text

### Neutral
- **Cool Gray** (`#686b82`): Primary neutral, borders at 24% opacity
- **Silver Blue** (`#9497a9`): Secondary text, muted elements
- **White** (`#ffffff`): Primary surface
- **Border Gray** (`#dedee5`): Divider borders

### Semantic
- **Green** (`#149e61`): Success/positive at 16% opacity for badges
- **Green Dark** (`#026b3f`): Badge text

## 3. Typography Rules

### Font Families
- **Display**: `Kraken-Brand`, fallbacks: `IBM Plex Sans, Helvetica, Arial`
- **UI / Body**: `Kraken-Product`, fallbacks: `Helvetica Neue, Helvetica, Arial`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Display Hero | Kraken-Brand | 48px | 700 | 1.17 | -1px |
| Section Heading | Kraken-Brand | 36px | 700 | 1.22 | -0.5px |
| Sub-heading | Kraken-Brand | 28px | 700 | 1.29 | -0.5px |
| Feature Title | Kraken-Product | 22px | 600 | 1.20 | normal |
| Body | Kraken-Product | 16px | 400 | 1.38 | normal |
| Body Medium | Kraken-Product | 16px | 500 | 1.38 | normal |
| Button | Kraken-Product | 16px | 500–600 | 1.38 | normal |
| Caption | Kraken-Product | 14px | 400–700 | 1.43–1.71 | normal |
| Small | Kraken-Product | 12px | 400–500 | 1.33 | normal |
| Micro | Kraken-Product | 7px | 500 | 1.00 | uppercase |

## 4. Component Stylings

### Buttons

**Primary Purple**
- Background: `#7132f5`
- Text: `#ffffff`
- Padding: 13px 16px
- Radius: 12px

**Purple Outlined**
- Background: `#ffffff`
- Text: `#5741d8`
- Border: `1px solid #5741d8`
- Radius: 12px

**Purple Subtle**
- Background: `rgba(133,91,251,0.16)`
- Text: `#7132f5`
- Padding: 8px
- Radius: 12px

**White Button**
- Background: `#ffffff`
- Text: `#101114`
- Radius: 10px
- Shadow: `rgba(0,0,0,0.03) 0px 4px 24px`

**Secondary Gray**
- Background: `rgba(148,151,169,0.08)`
- Text: `#101114`
- Radius: 12px

### Badges
- Success: `rgba(20,158,97,0.16)` bg, `#026b3f` text, 6px radius
- Neutral: `rgba(104,107,130,0.12)` bg, `#484b5e` text, 8px radius

## 5. Layout Principles

### Spacing: 1px, 2px, 3px, 4px, 5px, 6px, 8px, 10px, 12px, 13px, 15px, 16px, 20px, 24px, 25px
### Border Radius: 3px, 6px, 8px, 10px, 12px, 16px, 9999px, 50%

## 6. Depth & Elevation
- Subtle: `rgba(0,0,0,0.03) 0px 4px 24px`
- Micro: `rgba(16,24,40,0.04) 0px 1px 4px`

## 7. Do''s and Don''ts

### Do
- Use Kraken Purple (#7132f5) for CTAs and links
- Apply 12px radius on all buttons
- Use Kraken-Brand for headings, Kraken-Product for body

### Don''t
- Don''t use pill buttons — 12px is the max radius for buttons
- Don''t use other purples outside the defined scale

## 8. Responsive Behavior
Breakpoints: 375px, 425px, 640px, 768px, 1024px, 1280px, 1536px

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand: Kraken Purple (`#7132f5`)
- Dark variant: `#5741d8`
- Text: Near Black (`#101114`)
- Secondary text: `#9497a9`
- Background: White (`#ffffff`)

### Example Component Prompts
- "Create hero: white background. Kraken-Brand 48px weight 700, letter-spacing -1px. Purple CTA (#7132f5, 12px radius, 13px 16px padding)."
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
((select id from d), 'other', 'Design System Inspired by Kraken', 'other', '# Design System Inspired by Kraken', '{"sourcePath":"docs/design-md/kraken/DESIGN.md","category":"other"}'::jsonb, 0.75, 1),
((select id from d), 'overview', '1. Visual Theme & Atmosphere', 'overview', '## 1. Visual Theme & Atmosphere

Kraken''s website is a clean, trustworthy crypto exchange that uses purple as its commanding brand color. The design operates on white backgrounds with Kraken Purple (`#7132f5`, `#5741d8`, `#5b1ecf`) creating a distinctive, professional crypto identity. The proprietary Kraken-Brand font handles display headings with bold (700) weight and negative tracking, while Kraken-Product (with IBM Plex Sans fallback) serves as the UI workhorse.

**Key Characteristics:**
- Kraken Purple (`#7132f5`) as primary brand with darker variants (`#5741d8`, `#5b1ecf`)
- Kraken-Brand (display) + Kraken-Product (UI) dual font system
- Near-black (`#101114`) text with cool blue-gray neutral scale
- 12px radius buttons (rounded but not pill)
- Subtle shadows (`rgba(0,0,0,0.03) 0px 4px 24px`) — whisper-level
- Green accent (`#149e61`) for positive/success states', '{"sourcePath":"docs/design-md/kraken/DESIGN.md","category":"overview"}'::jsonb, 0.75, 2),
((select id from d), 'colors', '2. Color Palette & Roles', 'colors', '## 2. Color Palette & Roles

### Primary
- **Kraken Purple** (`#7132f5`): Primary CTA, brand accent, links
- **Purple Dark** (`#5741d8`): Button borders, outlined variants
- **Purple Deep** (`#5b1ecf`): Deepest purple
- **Purple Subtle** (`rgba(133,91,251,0.16)`): Purple at 16% — subtle button backgrounds
- **Near Black** (`#101114`): Primary text

### Neutral
- **Cool Gray** (`#686b82`): Primary neutral, borders at 24% opacity
- **Silver Blue** (`#9497a9`): Secondary text, muted elements
- **White** (`#ffffff`): Primary surface
- **Border Gray** (`#dedee5`): Divider borders

### Semantic
- **Green** (`#149e61`): Success/positive at 16% opacity for badges
- **Green Dark** (`#026b3f`): Badge text', '{"sourcePath":"docs/design-md/kraken/DESIGN.md","category":"colors"}'::jsonb, 0.75, 3),
((select id from d), 'typography', '3. Typography Rules', 'typography', '## 3. Typography Rules

### Font Families
- **Display**: `Kraken-Brand`, fallbacks: `IBM Plex Sans, Helvetica, Arial`
- **UI / Body**: `Kraken-Product`, fallbacks: `Helvetica Neue, Helvetica, Arial`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Display Hero | Kraken-Brand | 48px | 700 | 1.17 | -1px |
| Section Heading | Kraken-Brand | 36px | 700 | 1.22 | -0.5px |
| Sub-heading | Kraken-Brand | 28px | 700 | 1.29 | -0.5px |
| Feature Title | Kraken-Product | 22px | 600 | 1.20 | normal |
| Body | Kraken-Product | 16px | 400 | 1.38 | normal |
| Body Medium | Kraken-Product | 16px | 500 | 1.38 | normal |
| Button | Kraken-Product | 16px | 500–600 | 1.38 | normal |
| Caption | Kraken-Product | 14px | 400–700 | 1.43–1.71 | normal |
| Small | Kraken-Product | 12px | 400–500 | 1.33 | normal |
| Micro | Kraken-Product | 7px | 500 | 1.00 | uppercase |', '{"sourcePath":"docs/design-md/kraken/DESIGN.md","category":"typography"}'::jsonb, 0.75, 4),
((select id from d), 'components', '4. Component Stylings', 'components', '## 4. Component Stylings

### Buttons

**Primary Purple**
- Background: `#7132f5`
- Text: `#ffffff`
- Padding: 13px 16px
- Radius: 12px

**Purple Outlined**
- Background: `#ffffff`
- Text: `#5741d8`
- Border: `1px solid #5741d8`
- Radius: 12px

**Purple Subtle**
- Background: `rgba(133,91,251,0.16)`
- Text: `#7132f5`
- Padding: 8px
- Radius: 12px

**White Button**
- Background: `#ffffff`
- Text: `#101114`
- Radius: 10px
- Shadow: `rgba(0,0,0,0.03) 0px 4px 24px`

**Secondary Gray**
- Background: `rgba(148,151,169,0.08)`
- Text: `#101114`
- Radius: 12px

### Badges
- Success: `rgba(20,158,97,0.16)` bg, `#026b3f` text, 6px radius
- Neutral: `rgba(104,107,130,0.12)` bg, `#484b5e` text, 8px radius', '{"sourcePath":"docs/design-md/kraken/DESIGN.md","category":"components"}'::jsonb, 0.75, 5),
((select id from d), 'layout', '5. Layout Principles', 'layout', '## 5. Layout Principles

### Spacing: 1px, 2px, 3px, 4px, 5px, 6px, 8px, 10px, 12px, 13px, 15px, 16px, 20px, 24px, 25px
### Border Radius: 3px, 6px, 8px, 10px, 12px, 16px, 9999px, 50%', '{"sourcePath":"docs/design-md/kraken/DESIGN.md","category":"layout"}'::jsonb, 0.75, 6),
((select id from d), 'elevation', '6. Depth & Elevation', 'elevation', '## 6. Depth & Elevation
- Subtle: `rgba(0,0,0,0.03) 0px 4px 24px`
- Micro: `rgba(16,24,40,0.04) 0px 1px 4px`', '{"sourcePath":"docs/design-md/kraken/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', '7. Do''s and Don''ts', 'dos_and_donts', '## 7. Do''s and Don''ts

### Do
- Use Kraken Purple (#7132f5) for CTAs and links
- Apply 12px radius on all buttons
- Use Kraken-Brand for headings, Kraken-Product for body

### Don''t
- Don''t use pill buttons — 12px is the max radius for buttons
- Don''t use other purples outside the defined scale', '{"sourcePath":"docs/design-md/kraken/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', '8. Responsive Behavior', 'responsive_guidelines', '## 8. Responsive Behavior
Breakpoints: 375px, 425px, 640px, 768px, 1024px, 1280px, 1536px', '{"sourcePath":"docs/design-md/kraken/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', '9. Agent Prompt Guide', 'other', '## 9. Agent Prompt Guide

### Quick Color Reference
- Brand: Kraken Purple (`#7132f5`)
- Dark variant: `#5741d8`
- Text: Near Black (`#101114`)
- Secondary text: `#9497a9`
- Background: White (`#ffffff`)

### Example Component Prompts
- "Create hero: white background. Kraken-Brand 48px weight 700, letter-spacing -1px. Purple CTA (#7132f5, 12px radius, 13px 16px padding)."', '{"sourcePath":"docs/design-md/kraken/DESIGN.md","category":"other"}'::jsonb, 0.75, 10);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md'), 'color', 'color_1', '#7132f5', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md'), 'color', 'color_2', '#5741d8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md'), 'color', 'color_3', '#5b1ecf', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md'), 'color', 'color_4', '#101114', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md'), 'color', 'color_5', '#149e61', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md'), 'color', 'color_6', '#686b82', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md'), 'color', 'color_7', '#9497a9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md'), 'color', 'color_8', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md'), 'color', 'color_9', '#dedee5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md'), 'color', 'color_10', '#026b3f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md'), 'color', 'color_11', '#484b5e', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/kraken/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/kraken/DESIGN.md';


-- Lamborghini
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Lamborghini', 'lamborghini', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/lamborghini/DESIGN.md', null, 'seeded', '# Design System Inspired by Lamborghini

## 1. Visual Theme & Atmosphere

Lamborghini''s website is a cathedral of darkness — a digital stage where jet-black surfaces stretch infinitely and every element emerges from the void like a machine under a spotlight. The page is almost entirely black. Not dark gray, not near-black — true, uncompromising black (`#000000`) that saturates the viewport and refuses to yield. Into this abyss, white type and Lamborghini Gold (`#FFC000`) are deployed with surgical precision, creating a visual language that feels like walking through a nighttime motorsport event where every surface absorbs light except the things that matter.

The hero is a full-viewport video — dark, cinematic, immersive — showing event footage or vehicle reveals with the Lamborghini bull logo floating ethereally above. The navigation is minimal: a centered bull logo, a "MENU" hamburger on the left, and search/bookmark icons on the right, all rendered in white against the black canvas. There are no borders, no visible nav containers, no background color on the header — just white marks floating in darkness. The overall mood is nocturnal luxury: exclusive, theatrical, and deliberately intimidating. Each section transition is a scroll through darkness into the next revelation.

Typography is the voice of this darkness. LamboType — a custom Neo-Grotesk typeface created by Character Type and design agency Strichpunkt — is used for everything from 120px uppercase display headlines to 10px micro labels. Its distinctive 12° angled terminals are inspired by the aerodynamic lines of Lamborghini''s super sports cars, and its proportions range from Normal to Ultracompressed width. Headlines SHOUT in uppercase at enormous scales with tight line-heights (0.92 at 120px), creating dense blocks of text that feel stamped from steel. The typeface carries hexagonal geometric DNA — constructed from hexagons, three-armed stars, and circles — that echoes throughout the interface in the hexagonal pause button and UI icons. Built on Bootstrap grid with 68 Element Plus/UI components, the technical infrastructure is substantial beneath the theatrical surface.

**Key Characteristics:**
- True black (`#000000`) dominant surfaces with white and gold as the only relief colors
- LamboType custom Neo-Grotesk font with 12° angled terminals inspired by aerodynamic car lines
- Lamborghini Gold (`#FFC000`) as the sole accent color — used exclusively for primary CTA buttons
- All-uppercase display typography at extreme scales (120px, 80px, 54px) with tight line-heights
- Full-viewport video heroes with cinematic event/vehicle content
- Zero border-radius on buttons — sharp, angular, uncompromising rectangles
- Hexagonal motifs in UI elements (pause button, icon system) echoing brand geometry
- Bootstrap grid system + Element Plus/UI 68 components underneath
- Transparent ghost buttons with white borders at 50% opacity as the secondary CTA pattern

## 2. Color Palette & Roles

### Primary
- **Lamborghini Gold** (`#FFC000`): The signature accent color — a warm, saturated amber-gold (rgb 255, 192, 0) used exclusively for primary action buttons ("Discover More", "Tickets", "Start Configuration"). The only chromatic color in the entire interface, it ignites against the black canvas like a headlight cutting through night
- **Pure White** (`#FFFFFF`): Primary text color on dark surfaces, logo rendering, nav elements, and light-mode button fills — the voice that speaks from the darkness

### Secondary & Accent
- **Dark Gold** (`#917300`): Hover/pressed state for gold buttons — a deep amber (rgb 145, 115, 0) that darkens the gold to signal interaction
- **Gold Text** (`#FFCE3E`): Slightly lighter gold variant (rgb 255, 206, 62) used for inline text accents and highlighted labels
- **Cyan Pulse** (`#29ABE2`): Electric blue-cyan (rgb 41, 171, 226) appearing as an informational accent and interactive element highlight
- **Link Blue** (`#3860BE`): Medium blue (rgb 56, 96, 190) used universally for link hover states across all text colors

### Surface & Background
- **Absolute Black** (`#000000`): The dominant surface color — used for page background, hero sections, header, footer, and most containers
- **Charcoal** (`#202020`): Elevated dark surface (rgb 32, 32, 32) — the primary "dark gray" for cards, panels, and text containers sitting above the black canvas
- **Dark Iron** (`#181818`): Subtle surface variant (rgb 24, 24, 24) — barely distinguishable from black, used for footer and deep sections
- **Overlay Black** (`rgba(0,0,0,0.7)`): Semi-transparent overlay for modals and video dimming
- **Near White** (`#F8F8F8`): Rare light surface (rgb 248, 248, 248) for content blocks in white-mode sections
- **Mist** (`#E6E6E6`): Light gray surface for secondary light-mode containers

### Neutrals & Text
- **Pure White** (`#FFFFFF`): Primary text on dark backgrounds — headlines, body, nav labels
- **Smoke** (`#F5F5F5`): Secondary text on dark surfaces — slightly softer than pure white
- **Graphite** (`#494949`): Dark gray text on light surfaces (rgb 73, 73, 73)
- **Ash** (`#7D7D7D`): Mid-range gray for muted text, timestamps, and metadata (rgb 125, 125, 125)
- **Steel** (`#969696`): Lighter gray for disabled text and subtle labels (rgb 150, 150, 150)
- **Slate** (`#666666`): Alternative mid-gray for secondary content
- **Iron** (`#555555`): Dark mid-gray for body text variants
- **Shadow** (`#313131`): Very dark gray for text on dark surfaces where white is too strong

### Semantic & Accent
- **Cyan Pulse** (`#29ABE2`): Used for informational highlights and interactive feedback
- **Link Blue** (`#3860BE`): Universal hover state for all hyperlinks
- **Teal Action** (`#1EAEDB`): Button hover background for transparent/ghost variants (rgb 30, 174, 219)

### Gradient System
- No explicit gradients in the color palette — the dark-to-light progression is achieved through surface layering: `#000000` → `#181818` → `#202020` → `#494949` → `#7D7D7D`
- Video heroes use natural atmospheric gradients from the content itself
- Top-of-page gradient: subtle dark-to-darker fade at the edges of full-bleed imagery

## 3. Typography Rules

### Font Family
- **Display & UI**: `LamboType`, Roboto, Helvetica Neue, Arial — custom Neo-Grotesk typeface by Character Type for Lamborghini''s 2024 brand refresh. Available in widths from Normal to Ultracompressed and weights from Light (300) to Black. Features 12° angled terminals inspired by aerodynamic car geometry, hexagonal construction logic, and support for 200+ languages including Latin, Cyrillic, and Greek
- **Fallback/UI**: `Open Sans` — used for some button/form contexts as system fallback
- **No italic variants** observed on the marketing site — the brand voice is always upright

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| Hero Display | 120px (7.50rem) | 400 | 0.92 | normal | LamboType, uppercase, maximum impact |
| Display 2 | 80px (5.00rem) | 400 | 1.13 | normal | LamboType, uppercase, major section titles |
| Section Title | 54px (3.38rem) | 400 | 1.19 | normal | LamboType, uppercase |
| Sub-section | 40px (2.50rem) | 400 | 1.15 | normal | LamboType, uppercase |
| Feature Heading | 27px (1.69rem) | 400 | 1.37 | normal | LamboType, uppercase |
| Card Title | 24px (1.50rem) | 400 | — | normal | LamboType |
| Body Large | 18px (1.13rem) | 400 | 1.56 | normal | LamboType, mixed case and uppercase variants |
| Body / UI | 16px (1.00rem) | 400/700 | 1.50 | normal/0.16px | LamboType, primary body text |
| Button Large | 16px (1.00rem) | 400 | 1.50 | normal | Gold CTA buttons |
| Button Standard | 14.4px (0.90rem) | 300/700 | 1.00 | 0.14–0.2px | LamboType, uppercase, ghost buttons |
| Button Small | 13px (0.81rem) | 300/500 | 1.20 | 0.13–0.2px | LamboType, compact button variant |
| Caption | 14px (0.88rem) | 600/700 | 1.14–1.50 | -0.42px | LamboType, uppercase, negative tracking |
| Label | 12px (0.75rem) | 400/500 | 1.83 | 0.96px | LamboType, uppercase badges and micro labels |
| Micro | 10px (0.63rem) | 400 | 1.00–2.00 | 0.225px | LamboType, uppercase, smallest text |

### Principles
- **ALL-CAPS is the default voice**: Display and feature headings are universally uppercase. This creates a shouting, commanding tone that matches the brand''s aggression
- **Extreme scale range**: From 120px heroes to 10px micro labels — a 12:1 ratio that creates dramatic visual hierarchy
- **Tight line-heights at scale**: Display sizes use 0.92-1.19 line-height, creating dense, compressed blocks of type that feel stamped rather than typeset
- **Weight 400 dominates**: Unlike many design systems that use bold for emphasis, Lamborghini''s regular weight carries the headlines — the typeface itself is so distinctive it doesn''t need weight variation
- **Negative tracking on captions**: -0.42px letter-spacing on 14px captions creates a compressed, technical aesthetic
- **Positive tracking on micro text**: +0.225px at 10px ensures legibility at the smallest sizes
- **Single typeface discipline**: LamboType handles everything — the 12° angled terminals and hexagonal geometry provide visual coherence across all sizes

## 4. Component Stylings

### Buttons
All buttons use **zero border-radius** — sharp, angular rectangles that echo the aggressive lines of Lamborghini vehicles.

**Gold Accent CTA** — The primary action:
- Default: bg `#FFC000` (Lamborghini Gold), text `#000000`, padding 24px, fontSize 16px, fontWeight 400, borderRadius 0px, no border
- Hover: bg `#917300` (Dark Gold), darkens significantly
- Class: `btn-accent btn-large`
- Used for: "Discover More", "Tickets", "Start Configuration"

**Transparent Ghost** — The secondary action on dark backgrounds:
- Default: bg transparent, text `#FFFFFF`, border 1px solid `#FFFFFF`, padding 16px, opacity 0.5
- Hover: bg `#1EAEDB` (Teal Action), text white, opacity 0.7
- Focus: bg `#1EAEDB`, border 1px solid `#000000`, outline 2px solid `#000000`
- Used for: secondary CTAs on hero sections and dark panels

**White Filled** — Light-mode primary:
- Default: bg `#FFFFFF`, text `#202020`, no border
- Used for: CTAs on dark sections where gold isn''t appropriate

**Black Filled** — Dark filled variant:
- Default: bg `#000000`, text `#202020`
- Used for: Inverted CTA on light sections

**Gray Neutral** — Subtle action:
- Default: bg `#969696`, text `#202020`
- Used for: secondary/tertiary actions, badge-like buttons

### Cards & Containers
- Background: `#202020` (Charcoal) on black canvas, or `#000000` on lighter sections
- Border: `0px 1px solid #202020` bottom borders for section dividers
- Border-radius: 0px (completely sharp corners)
- Shadow: minimal, uses overlay opacity for depth
- Content: full-bleed photography + overlaid text in white

### Inputs & Forms
- Minimal form presence on the marketing site
- Switch elements: border-radius 20px (the only rounded element), border 1px solid `#DDDDDD`
- Cookie banner input style: white text on black with `#7D7D7D` borders

### Navigation
- **Desktop**: Centered bull logo, "MENU" hamburger with icon on left, search icon + bookmarks icon on right
- **Background**: Transparent (inherits black page background)
- **Sticky**: Fixed to top, floats above content
- **No visible borders or shadows** — elements float in the darkness
- **"MENU" label**: White text at 14px weight 400, uppercase, accompanies hamburger icon
- **Hexagonal motifs**: Pause button on hero sections uses hexagonal outline shape

### Image Treatment
- **Hero**: Full-viewport video sections (100vh) with cinematic event/vehicle footage
- **Event photography**: Full-bleed aerial shots of Lamborghini Arena events
- **Vehicle imagery**: High-contrast studio shots on dark backgrounds, full-width
- **Aspect ratios**: Predominantly 16:9 and wider for cinematic feel
- **Dark gradient overlays**: Subtle darkening at top/bottom edges of video to ensure text legibility

### Distinctive Components
- **Hexagonal Pause Button**: Video control uses a hexagonal outline (matching the brand''s geometric DNA from the typeface), positioned bottom-right of hero sections
- **Progress Bar**: Thin white line at bottom of hero sections indicating video/slide progress
- **Badge/Tag**: bg `#969696`, text white, padding 8px, fontSize 10px, borderRadius 2px — tiny metallic pills

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Full scale**: 2px, 4px, 5px, 8px, 10px, 12px, 15px, 16px, 20px, 24px, 32px, 40px, 48px, 56px
- **Button padding**: 16px (ghost), 24px (gold accent)
- **Section padding**: 48–56px vertical, 40px horizontal
- **Small spacing**: 2–5px for fine adjustments (badge padding, border spacing)

### Grid & Container
- **Framework**: Bootstrap grid system (container + row + col)
- **Max width**: 1440px (largest breakpoint)
- **Columns**: Standard 12-column Bootstrap grid
- **Full-bleed**: Hero sections break out of grid to fill viewport edge-to-edge
- **Content areas**: Centered within 1200px max-width containers

### Whitespace Philosophy
Lamborghini uses darkness as whitespace. The generous black expanses between content blocks serve the same function as white space in a light design — creating breathing room that elevates each element to the status of exhibit. A model name floating in the middle of a black viewport has the same visual weight as a gallery piece on a white wall. The absence of color IS the design.

### Border Radius Scale
| Value | Context |
|-------|---------|
| 0px | Default for everything — buttons, cards, containers, images |
| 1px | Subtle span elements |
| 2px | Badges, close buttons, cookie elements — barely perceptible |
| 20px | Toggle switches only — the sole rounded element |

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Abyss) | `#000000` flat | Page background, deepest layer |
| Level 1 (Surface) | `#181818` or `#202020` | Cards, content panels, elevated sections |
| Level 2 (Overlay) | `rgba(0,0,0,0.7)` | Modal backdrops, video dimming |
| Level 3 (Fog) | `rgba(0,0,0,0.5)` | Lighter overlays, hover states |
| Level 4 (Mist) | `rgba(0,0,0,0.25)` | Subtle depth hints |

### Shadow Philosophy
Lamborghini achieves depth through surface color layering rather than shadows. On a black canvas, traditional drop shadows are invisible — instead, the system creates elevation by shifting from absolute black to progressively lighter dark grays: `#000000` → `#181818` → `#202020` → `#494949`. This "darkness gradient" approach means that elevated elements are literally lighter than their surroundings, inverting the traditional shadow model.

### Decorative Depth
- Full-bleed video provides atmospheric depth through cinematic lighting
- The hexagonal pause button floats with a thin white outline stroke
- Progress bars at hero section bottoms create a subtle horizon line
- No gradients, glows, or blur effects on UI elements — the photography provides all visual richness

## 7. Do''s and Don''ts

### Do
- Use absolute black (`#000000`) as the primary background — never dark gray as a substitute
- Apply Lamborghini Gold (`#FFC000`) exclusively for primary CTA buttons — never for decorative purposes
- Set all display headings in uppercase with LamboType — the brand voice is always SHOUTING
- Use zero border-radius on buttons and cards — sharp angles are non-negotiable
- Maintain tight line-heights (0.92–1.19) on display type to create dense, architectural text blocks
- Use the transparent ghost button (white border, 50% opacity) as the secondary CTA on dark backgrounds
- Let full-viewport video/photography carry emotional weight — UI is infrastructure, not decoration
- Reserve hexagonal geometry for UI icons and the video control button
- Use weight 400 (regular) for headlines — the typeface is distinctive enough without bold emphasis
- Keep the gray palette achromatic — all neutrals are pure gray without color tinting

### Don''t
- Introduce additional accent colors beyond gold — the monochrome-plus-gold system is sacred
- Apply border-radius to buttons or cards — curved edges contradict the angular vehicle aesthetic
- Use LamboType in italic or decorative styles — the brand is always upright and direct
- Add gradients to buttons or surfaces — depth comes from surface layering, not blending
- Use light backgrounds as the primary canvas — darkness is the default state, light is the exception
- Mix lowercase into display headings — the uppercase convention communicates authority and power
- Add hover animations with scale or translate — interactions should be color-only (background/opacity shifts)
- Use Open Sans for display text — LamboType must handle all visible typography
- Create busy layouts with many small elements — Lamborghini''s design is about singular, bold statements
- Apply shadows to elements — on a black canvas, shadows are meaningless; use surface color shifts instead

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <425px | Single column, reduced type scale, stacked buttons |
| Mobile | 425-576px | Single column, hamburger nav, hero text ~40px |
| Tablet Small | 576-768px | 2-column grid begins, padding adjusts |
| Tablet | 768-1024px | 2-column layout, expanded hero, vehicle cards side-by-side |
| Desktop | 1024-1280px | Full navigation, 3+ column grids, display text at 80px |
| Desktop Large | 1280-1440px | Full layout, hero at 120px display, max-width containers |
| Wide | >1440px | Content centered, margins expand, hero fills viewport |

### Touch Targets
- Gold CTA buttons: 48px+ minimum height with 24px padding (exceeds WCAG 44×44px)
- Ghost buttons: 48px+ with 16px padding
- Hamburger menu: large touch target (~48px square)
- Hexagonal pause button: approximately 48px diameter

### Collapsing Strategy
- **Navigation**: Always hamburger-based ("MENU" + icon) — no horizontal nav expansion on any breakpoint
- **Hero video**: Maintains full-viewport height across all breakpoints, adjusting object-fit
- **Display type**: Scales from 120px (desktop) → 80px (tablet) → 54px/40px (mobile)
- **Button layout**: Side-by-side on desktop, stacks vertically on mobile
- **Grid columns**: 3-column → 2-column → 1-column progression
- **Section spacing**: Reduces from 56px → 40px → 24px vertical padding

### Image Behavior
- Hero videos use `object-fit: cover` to maintain cinematic framing at all sizes
- Vehicle images scale within their containers with maintained aspect ratios
- Event photography crops to viewport width on narrow screens
- Background images darken at edges to maintain text contrast on all viewports

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: "Lamborghini Gold (#FFC000)"
- Background: "Absolute Black (#000000)"
- Surface: "Charcoal (#202020)"
- Heading text: "Pure White (#FFFFFF)"
- Body text: "Ash (#7D7D7D)"
- Link hover: "Link Blue (#3860BE)"
- Accent: "Cyan Pulse (#29ABE2)"
- Border: "Pure White (#FFFFFF) at 50% opacity"

### Example Component Prompts
- "Create a hero section with a full-viewport black background, the model name ''TEMERARIO'' in LamboType at 120px uppercase weight 400 white text with 0.92 line-height, centered vertically, with a Lamborghini Gold (#FFC000) ''Discover More'' button below — sharp corners, 0px radius, 24px padding, black text"
- "Design a transparent ghost button with 1px solid white border at 50% opacity, white text at 14.4px uppercase with 0.2px letter-spacing, padding 16px, on a black background — hover state changes to Teal Action (#1EAEDB) background with 70% opacity"
- "Build a navigation bar with zero visible background on absolute black, a centered bull logo, ''MENU'' text label with hamburger icon on the left, and search + bookmark icons on the right — all in white, sticky position"
- "Create a news card grid on charcoal (#202020) background with white headlines at 27px uppercase, body text in #7D7D7D at 16px, and a white underlined ''Read More'' link that turns #3860BE on hover"
- "Design a section divider using a 1px solid bottom border in #202020 on a black canvas — the elevation difference is purely through surface color shift, not shadow"

### Iteration Guide
When refining existing screens generated with this design system:
1. Focus on ONE component at a time — Lamborghini''s system is extreme and every element must feel aggressive
2. Reference specific color names and hex codes from this document — the palette has only about 5 active colors
3. Use natural language descriptions, not CSS values — "sharp-cut golden rectangle" not "border-radius: 0px; background: #FFC000"
4. Describe the desired "feel" alongside specific measurements — "floating in total darkness" communicates the black canvas better than "background: #000000"
5. Remember that UPPERCASE IS THE DEFAULT — if text isn''t uppercase at display sizes, it probably should be
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
((select id from d), 'other', 'Design System Inspired by Lamborghini', 'other', '# Design System Inspired by Lamborghini', '{"sourcePath":"docs/design-md/lamborghini/DESIGN.md","category":"other"}'::jsonb, 0.75, 1),
((select id from d), 'overview', '1. Visual Theme & Atmosphere', 'overview', '## 1. Visual Theme & Atmosphere

Lamborghini''s website is a cathedral of darkness — a digital stage where jet-black surfaces stretch infinitely and every element emerges from the void like a machine under a spotlight. The page is almost entirely black. Not dark gray, not near-black — true, uncompromising black (`#000000`) that saturates the viewport and refuses to yield. Into this abyss, white type and Lamborghini Gold (`#FFC000`) are deployed with surgical precision, creating a visual language that feels like walking through a nighttime motorsport event where every surface absorbs light except the things that matter.

The hero is a full-viewport video — dark, cinematic, immersive — showing event footage or vehicle reveals with the Lamborghini bull logo floating ethereally above. The navigation is minimal: a centered bull logo, a "MENU" hamburger on the left, and search/bookmark icons on the right, all rendered in white against the black canvas. There are no borders, no visible nav containers, no background color on the header — just white marks floating in darkness. The overall mood is nocturnal luxury: exclusive, theatrical, and deliberately intimidating. Each section transition is a scroll through darkness into the next revelation.

Typography is the voice of this darkness. LamboType — a custom Neo-Grotesk typeface created by Character Type and design agency Strichpunkt — is used for everything from 120px uppercase display headlines to 10px micro labels. Its distinctive 12° angled terminals are inspired by the aerodynamic lines of Lamborghini''s super sports cars, and its proportions range from Normal to Ultracompressed width. Headlines SHOUT in uppercase at enormous scales with tight line-heights (0.92 at 120px), creating dense blocks of text that feel stamped from steel. The typeface carries hexagonal geometric DNA — constructed from hexagons, three-armed stars, and circles — that echoes throughout the interface in the hexagonal pause button and UI icons. Built on Bootstrap grid with 68 Element Plus/UI components, the technical infrastructure is substantial beneath the theatrical surface.

**Key Characteristics:**
- True black (`#000000`) dominant surfaces with white and gold as the only relief colors
- LamboType custom Neo-Grotesk font with 12° angled terminals inspired by aerodynamic car lines
- Lamborghini Gold (`#FFC000`) as the sole accent color — used exclusively for primary CTA buttons
- All-uppercase display typography at extreme scales (120px, 80px, 54px) with tight line-heights
- Full-viewport video heroes with cinematic event/vehicle content
- Zero border-radius on buttons — sharp, angular, uncompromising rectangles
- Hexagonal motifs in UI elements (pause button, icon system) echoing brand geometry
- Bootstrap grid system + Element Plus/UI 68 components underneath
- Transparent ghost buttons with white borders at 50% opacity as the secondary CTA pattern', '{"sourcePath":"docs/design-md/lamborghini/DESIGN.md","category":"overview"}'::jsonb, 0.75, 2),
((select id from d), 'colors', '2. Color Palette & Roles', 'colors', '## 2. Color Palette & Roles

### Primary
- **Lamborghini Gold** (`#FFC000`): The signature accent color — a warm, saturated amber-gold (rgb 255, 192, 0) used exclusively for primary action buttons ("Discover More", "Tickets", "Start Configuration"). The only chromatic color in the entire interface, it ignites against the black canvas like a headlight cutting through night
- **Pure White** (`#FFFFFF`): Primary text color on dark surfaces, logo rendering, nav elements, and light-mode button fills — the voice that speaks from the darkness

### Secondary & Accent
- **Dark Gold** (`#917300`): Hover/pressed state for gold buttons — a deep amber (rgb 145, 115, 0) that darkens the gold to signal interaction
- **Gold Text** (`#FFCE3E`): Slightly lighter gold variant (rgb 255, 206, 62) used for inline text accents and highlighted labels
- **Cyan Pulse** (`#29ABE2`): Electric blue-cyan (rgb 41, 171, 226) appearing as an informational accent and interactive element highlight
- **Link Blue** (`#3860BE`): Medium blue (rgb 56, 96, 190) used universally for link hover states across all text colors

### Surface & Background
- **Absolute Black** (`#000000`): The dominant surface color — used for page background, hero sections, header, footer, and most containers
- **Charcoal** (`#202020`): Elevated dark surface (rgb 32, 32, 32) — the primary "dark gray" for cards, panels, and text containers sitting above the black canvas
- **Dark Iron** (`#181818`): Subtle surface variant (rgb 24, 24, 24) — barely distinguishable from black, used for footer and deep sections
- **Overlay Black** (`rgba(0,0,0,0.7)`): Semi-transparent overlay for modals and video dimming
- **Near White** (`#F8F8F8`): Rare light surface (rgb 248, 248, 248) for content blocks in white-mode sections
- **Mist** (`#E6E6E6`): Light gray surface for secondary light-mode containers

### Neutrals & Text
- **Pure White** (`#FFFFFF`): Primary text on dark backgrounds — headlines, body, nav labels
- **Smoke** (`#F5F5F5`): Secondary text on dark surfaces — slightly softer than pure white
- **Graphite** (`#494949`): Dark gray text on light surfaces (rgb 73, 73, 73)
- **Ash** (`#7D7D7D`): Mid-range gray for muted text, timestamps, and metadata (rgb 125, 125, 125)
- **Steel** (`#969696`): Lighter gray for disabled text and subtle labels (rgb 150, 150, 150)
- **Slate** (`#666666`): Alternative mid-gray for secondary content
- **Iron** (`#555555`): Dark mid-gray for body text variants
- **Shadow** (`#313131`): Very dark gray for text on dark surfaces where white is too strong

### Semantic & Accent
- **Cyan Pulse** (`#29ABE2`): Used for informational highlights and interactive feedback
- **Link Blue** (`#3860BE`): Universal hover state for all hyperlinks
- **Teal Action** (`#1EAEDB`): Button hover background for transparent/ghost variants (rgb 30, 174, 219)

### Gradient System
- No explicit gradients in the color palette — the dark-to-light progression is achieved through surface layering: `#000000` → `#181818` → `#202020` → `#494949` → `#7D7D7D`
- Video heroes use natural atmospheric gradients from the content itself
- Top-of-page gradient: subtle dark-to-darker fade at the edges of full-bleed imagery', '{"sourcePath":"docs/design-md/lamborghini/DESIGN.md","category":"colors"}'::jsonb, 0.75, 3),
((select id from d), 'typography', '3. Typography Rules', 'typography', '## 3. Typography Rules

### Font Family
- **Display & UI**: `LamboType`, Roboto, Helvetica Neue, Arial — custom Neo-Grotesk typeface by Character Type for Lamborghini''s 2024 brand refresh. Available in widths from Normal to Ultracompressed and weights from Light (300) to Black. Features 12° angled terminals inspired by aerodynamic car geometry, hexagonal construction logic, and support for 200+ languages including Latin, Cyrillic, and Greek
- **Fallback/UI**: `Open Sans` — used for some button/form contexts as system fallback
- **No italic variants** observed on the marketing site — the brand voice is always upright

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| Hero Display | 120px (7.50rem) | 400 | 0.92 | normal | LamboType, uppercase, maximum impact |
| Display 2 | 80px (5.00rem) | 400 | 1.13 | normal | LamboType, uppercase, major section titles |
| Section Title | 54px (3.38rem) | 400 | 1.19 | normal | LamboType, uppercase |
| Sub-section | 40px (2.50rem) | 400 | 1.15 | normal | LamboType, uppercase |
| Feature Heading | 27px (1.69rem) | 400 | 1.37 | normal | LamboType, uppercase |
| Card Title | 24px (1.50rem) | 400 | — | normal | LamboType |
| Body Large | 18px (1.13rem) | 400 | 1.56 | normal | LamboType, mixed case and uppercase variants |
| Body / UI | 16px (1.00rem) | 400/700 | 1.50 | normal/0.16px | LamboType, primary body text |
| Button Large | 16px (1.00rem) | 400 | 1.50 | normal | Gold CTA buttons |
| Button Standard | 14.4px (0.90rem) | 300/700 | 1.00 | 0.14–0.2px | LamboType, uppercase, ghost buttons |
| Button Small | 13px (0.81rem) | 300/500 | 1.20 | 0.13–0.2px | LamboType, compact button variant |
| Caption | 14px (0.88rem) | 600/700 | 1.14–1.50 | -0.42px | LamboType, uppercase, negative tracking |
| Label | 12px (0.75rem) | 400/500 | 1.83 | 0.96px | LamboType, uppercase badges and micro labels |
| Micro | 10px (0.63rem) | 400 | 1.00–2.00 | 0.225px | LamboType, uppercase, smallest text |

### Principles
- **ALL-CAPS is the default voice**: Display and feature headings are universally uppercase. This creates a shouting, commanding tone that matches the brand''s aggression
- **Extreme scale range**: From 120px heroes to 10px micro labels — a 12:1 ratio that creates dramatic visual hierarchy
- **Tight line-heights at scale**: Display sizes use 0.92-1.19 line-height, creating dense, compressed blocks of type that feel stamped rather than typeset
- **Weight 400 dominates**: Unlike many design systems that use bold for emphasis, Lamborghini''s regular weight carries the headlines — the typeface itself is so distinctive it doesn''t need weight variation
- **Negative tracking on captions**: -0.42px letter-spacing on 14px captions creates a compressed, technical aesthetic
- **Positive tracking on micro text**: +0.225px at 10px ensures legibility at the smallest sizes
- **Single typeface discipline**: LamboType handles everything — the 12° angled terminals and hexagonal geometry provide visual coherence across all sizes', '{"sourcePath":"docs/design-md/lamborghini/DESIGN.md","category":"typography"}'::jsonb, 0.75, 4),
((select id from d), 'components', '4. Component Stylings', 'components', '## 4. Component Stylings

### Buttons
All buttons use **zero border-radius** — sharp, angular rectangles that echo the aggressive lines of Lamborghini vehicles.

**Gold Accent CTA** — The primary action:
- Default: bg `#FFC000` (Lamborghini Gold), text `#000000`, padding 24px, fontSize 16px, fontWeight 400, borderRadius 0px, no border
- Hover: bg `#917300` (Dark Gold), darkens significantly
- Class: `btn-accent btn-large`
- Used for: "Discover More", "Tickets", "Start Configuration"

**Transparent Ghost** — The secondary action on dark backgrounds:
- Default: bg transparent, text `#FFFFFF`, border 1px solid `#FFFFFF`, padding 16px, opacity 0.5
- Hover: bg `#1EAEDB` (Teal Action), text white, opacity 0.7
- Focus: bg `#1EAEDB`, border 1px solid `#000000`, outline 2px solid `#000000`
- Used for: secondary CTAs on hero sections and dark panels

**White Filled** — Light-mode primary:
- Default: bg `#FFFFFF`, text `#202020`, no border
- Used for: CTAs on dark sections where gold isn''t appropriate

**Black Filled** — Dark filled variant:
- Default: bg `#000000`, text `#202020`
- Used for: Inverted CTA on light sections

**Gray Neutral** — Subtle action:
- Default: bg `#969696`, text `#202020`
- Used for: secondary/tertiary actions, badge-like buttons

### Cards & Containers
- Background: `#202020` (Charcoal) on black canvas, or `#000000` on lighter sections
- Border: `0px 1px solid #202020` bottom borders for section dividers
- Border-radius: 0px (completely sharp corners)
- Shadow: minimal, uses overlay opacity for depth
- Content: full-bleed photography + overlaid text in white

### Inputs & Forms
- Minimal form presence on the marketing site
- Switch elements: border-radius 20px (the only rounded element), border 1px solid `#DDDDDD`
- Cookie banner input style: white text on black with `#7D7D7D` borders

### Navigation
- **Desktop**: Centered bull logo, "MENU" hamburger with icon on left, search icon + bookmarks icon on right
- **Background**: Transparent (inherits black page background)
- **Sticky**: Fixed to top, floats above content
- **No visible borders or shadows** — elements float in the darkness
- **"MENU" label**: White text at 14px weight 400, uppercase, accompanies hamburger icon
- **Hexagonal motifs**: Pause button on hero sections uses hexagonal outline shape

### Image Treatment
- **Hero**: Full-viewport video sections (100vh) with cinematic event/vehicle footage
- **Event photography**: Full-bleed aerial shots of Lamborghini Arena events
- **Vehicle imagery**: High-contrast studio shots on dark backgrounds, full-width
- **Aspect ratios**: Predominantly 16:9 and wider for cinematic feel
- **Dark gradient overlays**: Subtle darkening at top/bottom edges of video to ensure text legibility

### Distinctive Components
- **Hexagonal Pause Button**: Video control uses a hexagonal outline (matching the brand''s geometric DNA from the typeface), positioned bottom-right of hero sections
- **Progress Bar**: Thin white line at bottom of hero sections indicating video/slide progress
- **Badge/Tag**: bg `#969696`, text white, padding 8px, fontSize 10px, borderRadius 2px — tiny metallic pills', '{"sourcePath":"docs/design-md/lamborghini/DESIGN.md","category":"components"}'::jsonb, 0.75, 5),
((select id from d), 'layout', '5. Layout Principles', 'layout', '## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Full scale**: 2px, 4px, 5px, 8px, 10px, 12px, 15px, 16px, 20px, 24px, 32px, 40px, 48px, 56px
- **Button padding**: 16px (ghost), 24px (gold accent)
- **Section padding**: 48–56px vertical, 40px horizontal
- **Small spacing**: 2–5px for fine adjustments (badge padding, border spacing)

### Grid & Container
- **Framework**: Bootstrap grid system (container + row + col)
- **Max width**: 1440px (largest breakpoint)
- **Columns**: Standard 12-column Bootstrap grid
- **Full-bleed**: Hero sections break out of grid to fill viewport edge-to-edge
- **Content areas**: Centered within 1200px max-width containers

### Whitespace Philosophy
Lamborghini uses darkness as whitespace. The generous black expanses between content blocks serve the same function as white space in a light design — creating breathing room that elevates each element to the status of exhibit. A model name floating in the middle of a black viewport has the same visual weight as a gallery piece on a white wall. The absence of color IS the design.

### Border Radius Scale
| Value | Context |
|-------|---------|
| 0px | Default for everything — buttons, cards, containers, images |
| 1px | Subtle span elements |
| 2px | Badges, close buttons, cookie elements — barely perceptible |
| 20px | Toggle switches only — the sole rounded element |', '{"sourcePath":"docs/design-md/lamborghini/DESIGN.md","category":"layout"}'::jsonb, 0.75, 6),
((select id from d), 'elevation', '6. Depth & Elevation', 'elevation', '## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Abyss) | `#000000` flat | Page background, deepest layer |
| Level 1 (Surface) | `#181818` or `#202020` | Cards, content panels, elevated sections |
| Level 2 (Overlay) | `rgba(0,0,0,0.7)` | Modal backdrops, video dimming |
| Level 3 (Fog) | `rgba(0,0,0,0.5)` | Lighter overlays, hover states |
| Level 4 (Mist) | `rgba(0,0,0,0.25)` | Subtle depth hints |

### Shadow Philosophy
Lamborghini achieves depth through surface color layering rather than shadows. On a black canvas, traditional drop shadows are invisible — instead, the system creates elevation by shifting from absolute black to progressively lighter dark grays: `#000000` → `#181818` → `#202020` → `#494949`. This "darkness gradient" approach means that elevated elements are literally lighter than their surroundings, inverting the traditional shadow model.

### Decorative Depth
- Full-bleed video provides atmospheric depth through cinematic lighting
- The hexagonal pause button floats with a thin white outline stroke
- Progress bars at hero section bottoms create a subtle horizon line
- No gradients, glows, or blur effects on UI elements — the photography provides all visual richness', '{"sourcePath":"docs/design-md/lamborghini/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', '7. Do''s and Don''ts', 'dos_and_donts', '## 7. Do''s and Don''ts

### Do
- Use absolute black (`#000000`) as the primary background — never dark gray as a substitute
- Apply Lamborghini Gold (`#FFC000`) exclusively for primary CTA buttons — never for decorative purposes
- Set all display headings in uppercase with LamboType — the brand voice is always SHOUTING
- Use zero border-radius on buttons and cards — sharp angles are non-negotiable
- Maintain tight line-heights (0.92–1.19) on display type to create dense, architectural text blocks
- Use the transparent ghost button (white border, 50% opacity) as the secondary CTA on dark backgrounds
- Let full-viewport video/photography carry emotional weight — UI is infrastructure, not decoration
- Reserve hexagonal geometry for UI icons and the video control button
- Use weight 400 (regular) for headlines — the typeface is distinctive enough without bold emphasis
- Keep the gray palette achromatic — all neutrals are pure gray without color tinting

### Don''t
- Introduce additional accent colors beyond gold — the monochrome-plus-gold system is sacred
- Apply border-radius to buttons or cards — curved edges contradict the angular vehicle aesthetic
- Use LamboType in italic or decorative styles — the brand is always upright and direct
- Add gradients to buttons or surfaces — depth comes from surface layering, not blending
- Use light backgrounds as the primary canvas — darkness is the default state, light is the exception
- Mix lowercase into display headings — the uppercase convention communicates authority and power
- Add hover animations with scale or translate — interactions should be color-only (background/opacity shifts)
- Use Open Sans for display text — LamboType must handle all visible typography
- Create busy layouts with many small elements — Lamborghini''s design is about singular, bold statements
- Apply shadows to elements — on a black canvas, shadows are meaningless; use surface color shifts instead', '{"sourcePath":"docs/design-md/lamborghini/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', '8. Responsive Behavior', 'responsive_guidelines', '## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <425px | Single column, reduced type scale, stacked buttons |
| Mobile | 425-576px | Single column, hamburger nav, hero text ~40px |
| Tablet Small | 576-768px | 2-column grid begins, padding adjusts |
| Tablet | 768-1024px | 2-column layout, expanded hero, vehicle cards side-by-side |
| Desktop | 1024-1280px | Full navigation, 3+ column grids, display text at 80px |
| Desktop Large | 1280-1440px | Full layout, hero at 120px display, max-width containers |
| Wide | >1440px | Content centered, margins expand, hero fills viewport |

### Touch Targets
- Gold CTA buttons: 48px+ minimum height with 24px padding (exceeds WCAG 44×44px)
- Ghost buttons: 48px+ with 16px padding
- Hamburger menu: large touch target (~48px square)
- Hexagonal pause button: approximately 48px diameter

### Collapsing Strategy
- **Navigation**: Always hamburger-based ("MENU" + icon) — no horizontal nav expansion on any breakpoint
- **Hero video**: Maintains full-viewport height across all breakpoints, adjusting object-fit
- **Display type**: Scales from 120px (desktop) → 80px (tablet) → 54px/40px (mobile)
- **Button layout**: Side-by-side on desktop, stacks vertically on mobile
- **Grid columns**: 3-column → 2-column → 1-column progression
- **Section spacing**: Reduces from 56px → 40px → 24px vertical padding

### Image Behavior
- Hero videos use `object-fit: cover` to maintain cinematic framing at all sizes
- Vehicle images scale within their containers with maintained aspect ratios
- Event photography crops to viewport width on narrow screens
- Background images darken at edges to maintain text contrast on all viewports', '{"sourcePath":"docs/design-md/lamborghini/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', '9. Agent Prompt Guide', 'other', '## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: "Lamborghini Gold (#FFC000)"
- Background: "Absolute Black (#000000)"
- Surface: "Charcoal (#202020)"
- Heading text: "Pure White (#FFFFFF)"
- Body text: "Ash (#7D7D7D)"
- Link hover: "Link Blue (#3860BE)"
- Accent: "Cyan Pulse (#29ABE2)"
- Border: "Pure White (#FFFFFF) at 50% opacity"

### Example Component Prompts
- "Create a hero section with a full-viewport black background, the model name ''TEMERARIO'' in LamboType at 120px uppercase weight 400 white text with 0.92 line-height, centered vertically, with a Lamborghini Gold (#FFC000) ''Discover More'' button below — sharp corners, 0px radius, 24px padding, black text"
- "Design a transparent ghost button with 1px solid white border at 50% opacity, white text at 14.4px uppercase with 0.2px letter-spacing, padding 16px, on a black background — hover state changes to Teal Action (#1EAEDB) background with 70% opacity"
- "Build a navigation bar with zero visible background on absolute black, a centered bull logo, ''MENU'' text label with hamburger icon on the left, and search + bookmark icons on the right — all in white, sticky position"
- "Create a news card grid on charcoal (#202020) background with white headlines at 27px uppercase, body text in #7D7D7D at 16px, and a white underlined ''Read More'' link that turns #3860BE on hover"
- "Design a section divider using a 1px solid bottom border in #202020 on a black canvas — the elevation difference is purely through surface color shift, not shadow"

### Iteration Guide
When refining existing screens generated with this design system:
1. Focus on ONE component at a time — Lamborghini''s system is extreme and every element must feel aggressive
2. Reference specific color names and hex codes from this document — the palette has only about 5 active colors
3. Use natural language descriptions, not CSS values — "sharp-cut golden rectangle" not "border-radius: 0px; background: #FFC000"
4. Describe the desired "feel" alongside specific measurements — "floating in total darkness" communicates the black canvas better than "background: #000000"
5. Remember that UPPERCASE IS THE DEFAULT — if text isn''t uppercase at display sizes, it probably should be', '{"sourcePath":"docs/design-md/lamborghini/DESIGN.md","category":"other"}'::jsonb, 0.75, 10);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_1', '#000000', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_2', '#FFC000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_3', '#FFFFFF', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_4', '#917300', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_5', '#FFCE3E', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_6', '#29ABE2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_7', '#3860BE', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_8', '#202020', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_9', '#181818', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_10', '#F8F8F8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_11', '#E6E6E6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_12', '#F5F5F5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_13', '#494949', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_14', '#7D7D7D', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_15', '#969696', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_16', '#666666', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_17', '#555555', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_18', '#313131', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_19', '#1EAEDB', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md'), 'color', 'color_20', '#DDDDDD', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/lamborghini/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/lamborghini/DESIGN.md';


-- Linear App
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Linear App', 'linear.app', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/linear.app/DESIGN.md', null, 'seeded', '---
version: alpha
name: Linear-design-analysis
description: "A near-black product-focused marketing canvas built around #010102 (the deepest dark surface of any tool in this collection), light gray text (#f7f8f8), and the signature Linear lavender-blue (#5e6ad2) used as the single chromatic accent. The system reads as software-craft documentation: dense, technical, and quietly luxurious. Display type is set in the Linear custom sans (SF Pro Display fallback) at 500–700 with measured negative tracking. Cards live as charcoal panels (#0f1011) with hairline borders. The accent lavender appears on the brand mark, focus rings, and a few intentional CTAs — never decoratively. Page rhythm leans on product UI screenshots framed in dark panels rather than atmospheric color."

colors:
  primary: "#5e6ad2"
  on-primary: "#ffffff"
  primary-hover: "#828fff"
  primary-focus: "#5e69d1"
  ink: "#f7f8f8"
  ink-muted: "#d0d6e0"
  ink-subtle: "#8a8f98"
  ink-tertiary: "#62666d"
  canvas: "#010102"
  surface-1: "#0f1011"
  surface-2: "#141516"
  surface-3: "#18191a"
  surface-4: "#191a1b"
  hairline: "#23252a"
  hairline-strong: "#34343a"
  hairline-tertiary: "#3e3e44"
  inverse-canvas: "#ffffff"
  inverse-surface-1: "#f5f6f6"
  inverse-surface-2: "#f6f7f7"
  inverse-ink: "#000000"
  brand-secure: "#7a7fad"
  semantic-success: "#27a644"
  semantic-overlay: "#000000"

typography:
  display-xl:
    fontFamily: Linear Display
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -3.0px
  display-lg:
    fontFamily: Linear Display
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1.8px
  display-md:
    fontFamily: Linear Display
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -1.0px
  headline:
    fontFamily: Linear Display
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.6px
  card-title:
    fontFamily: Linear Display
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.4px
  subhead:
    fontFamily: Linear Display
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: -0.2px
  body-lg:
    fontFamily: Linear Text
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.1px
  body:
    fontFamily: Linear Text
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.05px
  body-sm:
    fontFamily: Linear Text
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  caption:
    fontFamily: Linear Text
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  button:
    fontFamily: Linear Text
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0
  eyebrow:
    fontFamily: Linear Text
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0.4px
  mono:
    fontFamily: Linear Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0

rounded:
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
    padding: 8px 14px
  button-primary-pressed:
    backgroundColor: "{colors.primary-focus}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-inverse:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  pricing-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-card-featured:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  feature-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  product-screenshot-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  testimonial-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  customer-logo-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 16px
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  pricing-tab-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  pricing-tab-selected:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  cta-banner:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: 48px
  changelog-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 24px 0
  status-badge:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 56px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
---

## Overview

Linear''s marketing canvas is the deepest dark surface in this collection — `{colors.canvas}` is #010102, essentially pure black with a faint blue tint. On top sits a four-step surface ladder (`{colors.surface-1}` through `{colors.surface-4}`) for cards, panels, and lifted tiles, with hairline borders running from `{colors.hairline}` (#23252a) up through `{colors.hairline-strong}` and `{colors.hairline-tertiary}`. Light gray text (`{colors.ink}` #f7f8f8) carries the body and headlines.

The single chromatic accent is **Linear lavender-blue** `{colors.primary}` (#5e6ad2) — used on the brand mark, focus rings, and the primary CTA button. A lighter hover state (`{colors.primary-hover}` #828fff) and a focus-tinted variant (`{colors.primary-focus}` #5e69d1) extend the same hue. Linear avoids saturated greens, oranges, reds, etc. on the marketing canvas — the only semantic color is `{colors.semantic-success}` (#27a644) for status pills and the rare success indicator.

Display type runs Linear''s custom sans (with `SF Pro Display` fallback) at weight 500–700 with negative letter-spacing scaling from -3.0px at 80px down to 0 at body. The body family is Linear''s text cut, and a Linear Mono is reserved for code snippets in product screenshots.

The page rhythm is **dense product screenshots** — Linear''s marketing leads with high-fidelity captures of the product UI (issue list, project view, dashboard) framed in `{colors.surface-1}` panels with `{rounded.xl}` 16px corners. The chrome is intentionally minimal so the app screenshots can do the heavy lifting.

**Key Characteristics:**
- **Dark-canvas marketing system** — `{colors.canvas}` (#010102) is the deepest dark in this collection.
- **Lavender-blue brand accent** (`{colors.primary}` #5e6ad2) — used scarcely on brand mark, focus, and the primary CTA.
- Four-step surface ladder (canvas → surface-1 → surface-2 → surface-3 → surface-4) carries hierarchy without shadow.
- Display tracking pulls aggressively negative (-3.0px at 80px); body holds at -0.05px.
- Cards use `{rounded.lg}` 12px corners with 1px hairline borders — never pill, rarely 16px.
- **Product UI screenshots** dominate the page. The marketing chrome is a dark frame for the app.
- No second chromatic color. No atmospheric gradients. No spotlight cards.

## Colors

> Source pages: linear.app (home), /intake, /pricing, /contact/sales, /build.

### Brand & Accent
- **Lavender-Blue** ({colors.primary}): The signature Linear accent — primary CTA, brand mark, link emphasis.
- **Lavender Hover** ({colors.primary-hover}): Lighter lavender (#828fff) — hovered state of the primary CTA.
- **Lavender Focus** ({colors.primary-focus}): Focus-ring tint (#5e69d1) — focused inputs, focused buttons.
- **Brand Secure** ({colors.brand-secure}): Muted lavender-gray (#7a7fad) — used in "Linear Security" surfaces.

### Surface
- **Canvas** ({colors.canvas}): Default page background — #010102, near-pure black with a faint blue tint.
- **Surface 1** ({colors.surface-1}): One step above canvas — feature cards, pricing cards, product screenshot panels.
- **Surface 2** ({colors.surface-2}): Two steps above — featured pricing card, hovered cards.
- **Surface 3** ({colors.surface-3}): Three steps above — line-tertiary backgrounds, sub-nav.
- **Surface 4** ({colors.surface-4}): Four steps above — bg-level-3, deepest lifted surface.
- **Hairline** ({colors.hairline}): 1px borders on cards and dividers.
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px borders — input focus rings.
- **Hairline Tertiary** ({colors.hairline-tertiary}): Tertiary borders for nested surfaces.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white — surface of the inverse pill CTA on a small set of section openers.
- **Inverse Surface 1** ({colors.inverse-surface-1}): One step above inverse canvas.
- **Inverse Surface 2** ({colors.inverse-surface-2}): Two steps above inverse canvas.

### Text
- **Ink** ({colors.ink}): All headlines and emphasized body type — light gray #f7f8f8.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #d0d6e0 — meta info on hero panels.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #8a8f98 — deselected pricing tabs, footer columns.
- **Ink Tertiary** ({colors.ink-tertiary}): Quaternary at #62666d — disabled, footnotes.

### Semantic
- **Success Green** ({colors.semantic-success}): Status pills, success indicators. The only semantic color on marketing.
- **Overlay** ({colors.semantic-overlay}): Pure black overlay scrim for modals.

## Typography

### Font Family

- **Linear Display** — Linear''s custom display sans; fallback `SF Pro Display, -apple-system, system-ui, Segoe UI, Roboto`. Carries display-xl through subhead.
- **Linear Text** — Linear''s custom text sans (a slightly different cut tuned for body sizes); same fallback stack. Carries body sizes, button labels, captions.
- **Linear Mono** — Linear''s custom mono; fallback `ui-monospace, SF Mono, Menlo`. Used for code snippets in product screenshots and for status / ID tokens.

The marketing surface treats Display and Text as one continuous voice; the family change is silent.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 80px | 600 | 1.05 | -3.0px | Largest hero headline |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.8px | Section opener headlines |
| `{typography.display-md}` | 40px | 600 | 1.15 | -1.0px | Sub-section headlines |
| `{typography.headline}` | 28px | 600 | 1.20 | -0.6px | Pricing tier titles, CTA banner heading |
| `{typography.card-title}` | 22px | 500 | 1.25 | -0.4px | Feature card title |
| `{typography.subhead}` | 20px | 400 | 1.40 | -0.2px | Lead body, intro paragraphs |
| `{typography.body-lg}` | 18px | 400 | 1.50 | -0.1px | Hero subhead, lead paragraphs |
| `{typography.body}` | 16px | 400 | 1.50 | -0.05px | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Card body, footer columns |
| `{typography.caption}` | 12px | 400 | 1.40 | 0 | Captions, meta, status |
| `{typography.button}` | 14px | 500 | 1.20 | 0 | All button labels |
| `{typography.eyebrow}` | 13px | 500 | 1.30 | 0.4px | Section eyebrow (slight positive tracking) |
| `{typography.mono}` | 13px | 400 | 1.50 | 0 | Linear Mono for code in product screenshots |

### Principles

- **Aggressive negative tracking on display** (-3.0px at 80px ≈ 4% of size).
- **Single voice from display to body.** Display-xl at 600 → body at 400 — same family, narrower weights.
- **Eyebrow uses positive tracking** (+0.4px) — contrast against the negative-tracked display marks the eyebrow as taxonomy.
- **Mono only in code contexts.** Linear Mono lives inside product screenshots — not on marketing chrome.

### Note on Font Substitutes

Linear''s custom typeface isn''t publicly distributed; the documented fallback `SF Pro Display, -apple-system, system-ui` is the recommended substitute on macOS. For cross-platform implementation, **Inter** at weight 500 / 600 / 700 is the closest free substitute. **Geist Sans** is also viable. For mono, **JetBrains Mono** or **Geist Mono** at weight 400 closely approximates Linear Mono.

## Layout

### Spacing System

- **Base unit**: 4px.
- **Tokens (front matter)**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on feature/pricing cards; `{spacing.xl}` 32px on testimonial cards; `{spacing.xxl}` 48px on CTA banners.
- Pill button padding: 8px vertical · 14px horizontal — Linear''s compact button spec.
- Form input padding: 8px vertical · 12px horizontal.

### Grid & Container

- Max content width sits around 1280px.
- Card grids are 3-up at desktop, 2-up at tablet, 1-up at mobile.
- Pricing tier grid is 3-up; comparison strip below shows checkmarks per tier.
- Product screenshot panels span full content width — they''re the protagonist.

### Whitespace Philosophy

The dark canvas IS the whitespace. Sections separate by lift onto surface-1 panels, not by gaps in white. Within a panel, generous `{spacing.lg}` 24px gaps between content blocks; `{spacing.section}` 96px between sections.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for body type, hero text, footer |
| 1 (charcoal lift) | `{colors.surface-1}` background on canvas, 1px `{colors.hairline}` | Default cards, product panels |
| 2 (surface-2 lift) | `{colors.surface-2}` background, 1px `{colors.hairline-strong}` | Featured pricing card, hovered cards |
| 3 (surface-3 lift) | `{colors.surface-3}` background | Sub-nav, dropdown menus |
| 4 (focus ring) | 2px `{colors.primary-focus}` outline at 50% opacity | Focused input, focused button |

Linear''s depth is carried by surface ladder + hairline borders. The brand resists drop shadows on dark almost entirely.

### Decorative Depth

- **Product UI screenshots** dominate as decorative depth.
- **No atmospheric gradients, no spotlight cards.**
- **Subtle white edge highlight** on the top edge of lifted panels — gives the dark surface a faint "pixel rendered" feel.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, status badges |
| `{rounded.sm}` | 6px | Inline tags |
| `{rounded.md}` | 8px | All buttons, form inputs |
| `{rounded.lg}` | 12px | Pricing cards, feature cards, testimonial cards |
| `{rounded.xl}` | 16px | Product screenshot panels |
| `{rounded.xxl}` | 24px | Oversized CTA banners (rare) |
| `{rounded.pill}` | 9999px | Pricing tab toggles, status pills |
| `{rounded.full}` | 9999px | Avatar circles |

### Photography & Illustration Geometry

- Product UI screenshots dominate; they sit in `{rounded.xl}` 16px tiles with `{spacing.lg}` 24px outer padding.
- Customer logo tiles render at small sizes (~24px logo height) on `{colors.canvas}` with no border.
- Avatar circles in testimonial cards use `{rounded.full}` at 32–40px sizes.

## Components

### Buttons

**`button-primary`** — Lavender CTA. The default primary CTA across all pages.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 8px 14px, rounded `{rounded.md}`.
- Pressed state lives in `button-primary-pressed` (background shifts to `{colors.primary-focus}`).
- Hover state lives in `button-primary-hover` (background shifts to `{colors.primary-hover}` lighter lavender).

**`button-secondary`** — Charcoal button. Used for secondary CTAs ("Sign in", "Read changelog").
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.button}`, padding 8px 14px, rounded `{rounded.md}`. 1px `{colors.hairline}` border.

**`button-tertiary`** — Plain text button.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 8px 14px.

**`button-inverse`** — White-on-dark inverse CTA.
- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 8px 14px.

### Pricing Tabs

**`pricing-tab-default`** + **`pricing-tab-selected`** — Pill-toggle on `/pricing`.
- Default: `{colors.canvas}` background, `{colors.ink-subtle}` text, rounded `{rounded.pill}`, padding 6px 14px.
- Selected: `{colors.surface-2}` background, `{colors.ink}` text — selected = surface lift.

### Cards & Containers

**`pricing-card`** — Each tier on `/pricing`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px. 1px `{colors.hairline}` border.

**`pricing-card-featured`** — Recommended tier — surface lift to surface-2.
- Background `{colors.surface-2}`, otherwise identical structure.

**`feature-card`** — Generic feature highlight tile.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`product-screenshot-card`** — The dominant card type — frames a high-fidelity Linear app UI screenshot.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xl}`, padding 24px.

**`testimonial-card`** — Customer quote with avatar + name + role.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-lg}`, rounded `{rounded.lg}`, padding 32px.

**`customer-logo-tile`** — Small tile in the customer marquee.
- Background `{colors.canvas}`, text `{colors.ink-subtle}`, type `{typography.caption}`, rounded `{rounded.xs}`, padding 16px.

**`cta-banner`** — Closing CTA panel near page bottom.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.headline}`, rounded `{rounded.lg}`, padding 48px.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on `/contact/sales` and signup overlays.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 8px 12px.
- Focused state retains the same surface; the focus ring is a 2px `{colors.primary-focus}` outline at 50% opacity.

### Status & Build Page

**`changelog-row`** — Each row in `/build` (changelog page) listing version, date, and changes.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xs}`, padding 24px 0. 1px `{colors.hairline}` bottom rule.

**`status-badge`** — Small status pill.
- Background `{colors.surface-2}`, text `{colors.ink-muted}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 2px 8px.

### Navigation

**`top-nav`** — Sticky dark bar with the Linear wordmark left, primary nav links centered, and a `button-secondary` ("Sign in") + `button-primary` ("Get started") pair right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 56px.

### Footer

**`footer`** — Dense link grid on `{colors.canvas}` with the Linear wordmark left.
- Background `{colors.canvas}`, text `{colors.ink-subtle}`, type `{typography.caption}`, padding 64px 32px.

## Do''s and Don''ts

### Do

- Reserve `{colors.canvas}` (#010102) as the system''s anchor surface — the faint blue tint is intentional.
- Use `{colors.primary}` lavender ONLY for: brand mark, primary CTA, focus ring, link emphasis.
- Use the four-step surface ladder for hierarchy. Avoid skipping levels.
- Pair display weight 600 with body weight 400 — Linear resists 700+ display weights.
- Apply negative letter-spacing aggressively on display.
- Use product UI screenshots as the protagonist of every section.
- Compose CTAs as `{rounded.md}` 8px corners.

### Don''t

- Don''t ship a light-mode marketing page.
- Don''t use lavender as a section background or card fill.
- Don''t introduce a second chromatic accent (orange, pink, green for marketing).
- Don''t add atmospheric gradients or spotlight cards.
- Don''t pill-round CTAs.
- Don''t use `#000000` true black as the canvas.
- Don''t combine multiple bright accents in product screenshot mockups.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop-XL | 1440px | Default desktop layout |
| Desktop | 1280px | Card grid 3-up maintained |
| Tablet | 1024px | Card grid 3-up → 2-up |
| Mobile-Lg | 768px | Pricing comparison becomes accordion; nav hamburger |
| Mobile | 480px | Single-column; display-xl scales 80px → ~36px |

### Touch Targets

- CTAs hold ≥40px tap height across viewports.
- Pricing tab pills hold ≥36px tap height; touch viewports grow to ≥44px.
- Form inputs hold ≥44px tap target on touch.

### Collapsing Strategy

- **Top nav**: links collapse to hamburger below 768px.
- **Card grids**: 3-up → 2-up at 1024px → 1-up below 768px.
- **Pricing comparison**: per-tier accordion below 768px.
- **Display type**: `{typography.display-xl}` 80px scales toward `{typography.display-md}` 40px on mobile.

### Image Behavior

- Product UI screenshots maintain aspect ratio and never crop.
- Customer logos in the marquee may collapse from 6-up to 3-up below 768px.

## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. When introducing a section, decide first which surface lift it lives on.
3. Default body to `{typography.body}` at weight 400.
4. Run `npx @google/design.md lint DESIGN.md` after edits.
5. Add new variants as separate component entries.
6. Treat lavender as scarce: brand mark, primary CTA, focus, link emphasis.
7. Lead every section with a product UI screenshot.

## Known Gaps

- The four-step surface ladder values are extracted directly from Linear''s `--color-bg-level-3`, `--color-line-tint`, etc. CSS variables; they are Linear''s canonical surface spec.
- Form-field error and validation styling is not visible on the inspected pages.
- Light mode is not documented because the marketing site does not ship a light theme.
- Linear''s actual product UI uses a richer color-tag palette (red, orange, yellow, green, blue, purple) for issue priorities and project labels — those colors live in the in-product surfaces shown in mockups.
- The custom display, text, and mono families are proprietary; an open-source substitute is acceptable.
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

Linear''s marketing canvas is the deepest dark surface in this collection — `{colors.canvas}` is #010102, essentially pure black with a faint blue tint. On top sits a four-step surface ladder (`{colors.surface-1}` through `{colors.surface-4}`) for cards, panels, and lifted tiles, with hairline borders running from `{colors.hairline}` (#23252a) up through `{colors.hairline-strong}` and `{colors.hairline-tertiary}`. Light gray text (`{colors.ink}` #f7f8f8) carries the body and headlines.

The single chromatic accent is **Linear lavender-blue** `{colors.primary}` (#5e6ad2) — used on the brand mark, focus rings, and the primary CTA button. A lighter hover state (`{colors.primary-hover}` #828fff) and a focus-tinted variant (`{colors.primary-focus}` #5e69d1) extend the same hue. Linear avoids saturated greens, oranges, reds, etc. on the marketing canvas — the only semantic color is `{colors.semantic-success}` (#27a644) for status pills and the rare success indicator.

Display type runs Linear''s custom sans (with `SF Pro Display` fallback) at weight 500–700 with negative letter-spacing scaling from -3.0px at 80px down to 0 at body. The body family is Linear''s text cut, and a Linear Mono is reserved for code snippets in product screenshots.

The page rhythm is **dense product screenshots** — Linear''s marketing leads with high-fidelity captures of the product UI (issue list, project view, dashboard) framed in `{colors.surface-1}` panels with `{rounded.xl}` 16px corners. The chrome is intentionally minimal so the app screenshots can do the heavy lifting.

**Key Characteristics:**
- **Dark-canvas marketing system** — `{colors.canvas}` (#010102) is the deepest dark in this collection.
- **Lavender-blue brand accent** (`{colors.primary}` #5e6ad2) — used scarcely on brand mark, focus, and the primary CTA.
- Four-step surface ladder (canvas → surface-1 → surface-2 → surface-3 → surface-4) carries hierarchy without shadow.
- Display tracking pulls aggressively negative (-3.0px at 80px); body holds at -0.05px.
- Cards use `{rounded.lg}` 12px corners with 1px hairline borders — never pill, rarely 16px.
- **Product UI screenshots** dominate the page. The marketing chrome is a dark frame for the app.
- No second chromatic color. No atmospheric gradients. No spotlight cards.', '{"sourcePath":"docs/design-md/linear.app/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> Source pages: linear.app (home), /intake, /pricing, /contact/sales, /build.

### Brand & Accent
- **Lavender-Blue** ({colors.primary}): The signature Linear accent — primary CTA, brand mark, link emphasis.
- **Lavender Hover** ({colors.primary-hover}): Lighter lavender (#828fff) — hovered state of the primary CTA.
- **Lavender Focus** ({colors.primary-focus}): Focus-ring tint (#5e69d1) — focused inputs, focused buttons.
- **Brand Secure** ({colors.brand-secure}): Muted lavender-gray (#7a7fad) — used in "Linear Security" surfaces.

### Surface
- **Canvas** ({colors.canvas}): Default page background — #010102, near-pure black with a faint blue tint.
- **Surface 1** ({colors.surface-1}): One step above canvas — feature cards, pricing cards, product screenshot panels.
- **Surface 2** ({colors.surface-2}): Two steps above — featured pricing card, hovered cards.
- **Surface 3** ({colors.surface-3}): Three steps above — line-tertiary backgrounds, sub-nav.
- **Surface 4** ({colors.surface-4}): Four steps above — bg-level-3, deepest lifted surface.
- **Hairline** ({colors.hairline}): 1px borders on cards and dividers.
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px borders — input focus rings.
- **Hairline Tertiary** ({colors.hairline-tertiary}): Tertiary borders for nested surfaces.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white — surface of the inverse pill CTA on a small set of section openers.
- **Inverse Surface 1** ({colors.inverse-surface-1}): One step above inverse canvas.
- **Inverse Surface 2** ({colors.inverse-surface-2}): Two steps above inverse canvas.

### Text
- **Ink** ({colors.ink}): All headlines and emphasized body type — light gray #f7f8f8.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #d0d6e0 — meta info on hero panels.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #8a8f98 — deselected pricing tabs, footer columns.
- **Ink Tertiary** ({colors.ink-tertiary}): Quaternary at #62666d — disabled, footnotes.

### Semantic
- **Success Green** ({colors.semantic-success}): Status pills, success indicators. The only semantic color on marketing.
- **Overlay** ({colors.semantic-overlay}): Pure black overlay scrim for modals.', '{"sourcePath":"docs/design-md/linear.app/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

- **Linear Display** — Linear''s custom display sans; fallback `SF Pro Display, -apple-system, system-ui, Segoe UI, Roboto`. Carries display-xl through subhead.
- **Linear Text** — Linear''s custom text sans (a slightly different cut tuned for body sizes); same fallback stack. Carries body sizes, button labels, captions.
- **Linear Mono** — Linear''s custom mono; fallback `ui-monospace, SF Mono, Menlo`. Used for code snippets in product screenshots and for status / ID tokens.

The marketing surface treats Display and Text as one continuous voice; the family change is silent.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 80px | 600 | 1.05 | -3.0px | Largest hero headline |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.8px | Section opener headlines |
| `{typography.display-md}` | 40px | 600 | 1.15 | -1.0px | Sub-section headlines |
| `{typography.headline}` | 28px | 600 | 1.20 | -0.6px | Pricing tier titles, CTA banner heading |
| `{typography.card-title}` | 22px | 500 | 1.25 | -0.4px | Feature card title |
| `{typography.subhead}` | 20px | 400 | 1.40 | -0.2px | Lead body, intro paragraphs |
| `{typography.body-lg}` | 18px | 400 | 1.50 | -0.1px | Hero subhead, lead paragraphs |
| `{typography.body}` | 16px | 400 | 1.50 | -0.05px | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Card body, footer columns |
| `{typography.caption}` | 12px | 400 | 1.40 | 0 | Captions, meta, status |
| `{typography.button}` | 14px | 500 | 1.20 | 0 | All button labels |
| `{typography.eyebrow}` | 13px | 500 | 1.30 | 0.4px | Section eyebrow (slight positive tracking) |
| `{typography.mono}` | 13px | 400 | 1.50 | 0 | Linear Mono for code in product screenshots |

### Principles

- **Aggressive negative tracking on display** (-3.0px at 80px ≈ 4% of size).
- **Single voice from display to body.** Display-xl at 600 → body at 400 — same family, narrower weights.
- **Eyebrow uses positive tracking** (+0.4px) — contrast against the negative-tracked display marks the eyebrow as taxonomy.
- **Mono only in code contexts.** Linear Mono lives inside product screenshots — not on marketing chrome.

### Note on Font Substitutes

Linear''s custom typeface isn''t publicly distributed; the documented fallback `SF Pro Display, -apple-system, system-ui` is the recommended substitute on macOS. For cross-platform implementation, **Inter** at weight 500 / 600 / 700 is the closest free substitute. **Geist Sans** is also viable. For mono, **JetBrains Mono** or **Geist Mono** at weight 400 closely approximates Linear Mono.', '{"sourcePath":"docs/design-md/linear.app/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System

- **Base unit**: 4px.
- **Tokens (front matter)**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on feature/pricing cards; `{spacing.xl}` 32px on testimonial cards; `{spacing.xxl}` 48px on CTA banners.
- Pill button padding: 8px vertical · 14px horizontal — Linear''s compact button spec.
- Form input padding: 8px vertical · 12px horizontal.

### Grid & Container

- Max content width sits around 1280px.
- Card grids are 3-up at desktop, 2-up at tablet, 1-up at mobile.
- Pricing tier grid is 3-up; comparison strip below shows checkmarks per tier.
- Product screenshot panels span full content width — they''re the protagonist.

### Whitespace Philosophy

The dark canvas IS the whitespace. Sections separate by lift onto surface-1 panels, not by gaps in white. Within a panel, generous `{spacing.lg}` 24px gaps between content blocks; `{spacing.section}` 96px between sections.', '{"sourcePath":"docs/design-md/linear.app/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for body type, hero text, footer |
| 1 (charcoal lift) | `{colors.surface-1}` background on canvas, 1px `{colors.hairline}` | Default cards, product panels |
| 2 (surface-2 lift) | `{colors.surface-2}` background, 1px `{colors.hairline-strong}` | Featured pricing card, hovered cards |
| 3 (surface-3 lift) | `{colors.surface-3}` background | Sub-nav, dropdown menus |
| 4 (focus ring) | 2px `{colors.primary-focus}` outline at 50% opacity | Focused input, focused button |

Linear''s depth is carried by surface ladder + hairline borders. The brand resists drop shadows on dark almost entirely.

### Decorative Depth

- **Product UI screenshots** dominate as decorative depth.
- **No atmospheric gradients, no spotlight cards.**
- **Subtle white edge highlight** on the top edge of lifted panels — gives the dark surface a faint "pixel rendered" feel.', '{"sourcePath":"docs/design-md/linear.app/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, status badges |
| `{rounded.sm}` | 6px | Inline tags |
| `{rounded.md}` | 8px | All buttons, form inputs |
| `{rounded.lg}` | 12px | Pricing cards, feature cards, testimonial cards |
| `{rounded.xl}` | 16px | Product screenshot panels |
| `{rounded.xxl}` | 24px | Oversized CTA banners (rare) |
| `{rounded.pill}` | 9999px | Pricing tab toggles, status pills |
| `{rounded.full}` | 9999px | Avatar circles |

### Photography & Illustration Geometry

- Product UI screenshots dominate; they sit in `{rounded.xl}` 16px tiles with `{spacing.lg}` 24px outer padding.
- Customer logo tiles render at small sizes (~24px logo height) on `{colors.canvas}` with no border.
- Avatar circles in testimonial cards use `{rounded.full}` at 32–40px sizes.', '{"sourcePath":"docs/design-md/linear.app/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — Lavender CTA. The default primary CTA across all pages.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 8px 14px, rounded `{rounded.md}`.
- Pressed state lives in `button-primary-pressed` (background shifts to `{colors.primary-focus}`).
- Hover state lives in `button-primary-hover` (background shifts to `{colors.primary-hover}` lighter lavender).

**`button-secondary`** — Charcoal button. Used for secondary CTAs ("Sign in", "Read changelog").
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.button}`, padding 8px 14px, rounded `{rounded.md}`. 1px `{colors.hairline}` border.

**`button-tertiary`** — Plain text button.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 8px 14px.

**`button-inverse`** — White-on-dark inverse CTA.
- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 8px 14px.

### Pricing Tabs

**`pricing-tab-default`** + **`pricing-tab-selected`** — Pill-toggle on `/pricing`.
- Default: `{colors.canvas}` background, `{colors.ink-subtle}` text, rounded `{rounded.pill}`, padding 6px 14px.
- Selected: `{colors.surface-2}` background, `{colors.ink}` text — selected = surface lift.

### Cards & Containers

**`pricing-card`** — Each tier on `/pricing`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px. 1px `{colors.hairline}` border.

**`pricing-card-featured`** — Recommended tier — surface lift to surface-2.
- Background `{colors.surface-2}`, otherwise identical structure.

**`feature-card`** — Generic feature highlight tile.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`product-screenshot-card`** — The dominant card type — frames a high-fidelity Linear app UI screenshot.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xl}`, padding 24px.

**`testimonial-card`** — Customer quote with avatar + name + role.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-lg}`, rounded `{rounded.lg}`, padding 32px.

**`customer-logo-tile`** — Small tile in the customer marquee.
- Background `{colors.canvas}`, text `{colors.ink-subtle}`, type `{typography.caption}`, rounded `{rounded.xs}`, padding 16px.

**`cta-banner`** — Closing CTA panel near page bottom.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.headline}`, rounded `{rounded.lg}`, padding 48px.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on `/contact/sales` and signup overlays.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 8px 12px.
- Focused state retains the same surface; the focus ring is a 2px `{colors.primary-focus}` outline at 50% opacity.

### Status & Build Page

**`changelog-row`** — Each row in `/build` (changelog page) listing version, date, and changes.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xs}`, padding 24px 0. 1px `{colors.hairline}` bottom rule.

**`status-badge`** — Small status pill.
- Background `{colors.surface-2}`, text `{colors.ink-muted}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 2px 8px.

### Navigation

**`top-nav`** — Sticky dark bar with the Linear wordmark left, primary nav links centered, and a `button-secondary` ("Sign in") + `button-primary` ("Get started") pair right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 56px.

### Footer

**`footer`** — Dense link grid on `{colors.canvas}` with the Linear wordmark left.
- Background `{colors.canvas}`, text `{colors.ink-subtle}`, type `{typography.caption}`, padding 64px 32px.', '{"sourcePath":"docs/design-md/linear.app/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do

- Reserve `{colors.canvas}` (#010102) as the system''s anchor surface — the faint blue tint is intentional.
- Use `{colors.primary}` lavender ONLY for: brand mark, primary CTA, focus ring, link emphasis.
- Use the four-step surface ladder for hierarchy. Avoid skipping levels.
- Pair display weight 600 with body weight 400 — Linear resists 700+ display weights.
- Apply negative letter-spacing aggressively on display.
- Use product UI screenshots as the protagonist of every section.
- Compose CTAs as `{rounded.md}` 8px corners.

### Don''t

- Don''t ship a light-mode marketing page.
- Don''t use lavender as a section background or card fill.
- Don''t introduce a second chromatic accent (orange, pink, green for marketing).
- Don''t add atmospheric gradients or spotlight cards.
- Don''t pill-round CTAs.
- Don''t use `#000000` true black as the canvas.
- Don''t combine multiple bright accents in product screenshot mockups.', '{"sourcePath":"docs/design-md/linear.app/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop-XL | 1440px | Default desktop layout |
| Desktop | 1280px | Card grid 3-up maintained |
| Tablet | 1024px | Card grid 3-up → 2-up |
| Mobile-Lg | 768px | Pricing comparison becomes accordion; nav hamburger |
| Mobile | 480px | Single-column; display-xl scales 80px → ~36px |

### Touch Targets

- CTAs hold ≥40px tap height across viewports.
- Pricing tab pills hold ≥36px tap height; touch viewports grow to ≥44px.
- Form inputs hold ≥44px tap target on touch.

### Collapsing Strategy

- **Top nav**: links collapse to hamburger below 768px.
- **Card grids**: 3-up → 2-up at 1024px → 1-up below 768px.
- **Pricing comparison**: per-tier accordion below 768px.
- **Display type**: `{typography.display-xl}` 80px scales toward `{typography.display-md}` 40px on mobile.

### Image Behavior

- Product UI screenshots maintain aspect ratio and never crop.
- Customer logos in the marquee may collapse from 6-up to 3-up below 768px.', '{"sourcePath":"docs/design-md/linear.app/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. When introducing a section, decide first which surface lift it lives on.
3. Default body to `{typography.body}` at weight 400.
4. Run `npx @google/design.md lint DESIGN.md` after edits.
5. Add new variants as separate component entries.
6. Treat lavender as scarce: brand mark, primary CTA, focus, link emphasis.
7. Lead every section with a product UI screenshot.', '{"sourcePath":"docs/design-md/linear.app/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- The four-step surface ladder values are extracted directly from Linear''s `--color-bg-level-3`, `--color-line-tint`, etc. CSS variables; they are Linear''s canonical surface spec.
- Form-field error and validation styling is not visible on the inspected pages.
- Light mode is not documented because the marketing site does not ship a light theme.
- Linear''s actual product UI uses a richer color-tag palette (red, orange, yellow, green, blue, purple) for issue priorities and project labels — those colors live in the in-product surfaces shown in mockups.
- The custom display, text, and mono families are proprietary; an open-source substitute is acceptable.', '{"sourcePath":"docs/design-md/linear.app/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_1', '#010102', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_2', '#f7f8f8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_3', '#5e6ad2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_4', '#0f1011', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_5', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_6', '#828fff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_7', '#5e69d1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_8', '#d0d6e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_9', '#8a8f98', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_10', '#62666d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_11', '#141516', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_12', '#18191a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_13', '#191a1b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_14', '#23252a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_15', '#34343a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_16', '#3e3e44', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_17', '#f5f6f6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_18', '#f6f7f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_19', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_20', '#7a7fad', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md'), 'color', 'color_21', '#27a644', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/linear.app/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/linear.app/DESIGN.md';


-- Lovable
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Lovable', 'lovable', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/lovable/DESIGN.md', null, 'seeded', '# Design System Inspired by Lovable

## 1. Visual Theme & Atmosphere

Lovable''s website radiates warmth through restraint. The entire page sits on a creamy, parchment-toned background (`#f7f4ed`) that immediately separates it from the cold-white conventions of most developer tool sites. This isn''t minimalism for minimalism''s sake — it''s a deliberate choice to feel approachable, almost analog, like a well-crafted notebook. The near-black text (`#1c1c1c`) against this warm cream creates a contrast ratio that''s easy on the eyes while maintaining sharp readability.

The custom Camera Plain Variable typeface is the system''s secret weapon. Unlike geometric sans-serifs that signal "tech company," Camera Plain has a humanist warmth — slightly rounded terminals, organic curves, and a comfortable reading rhythm. At display sizes (48px–60px), weight 600 with aggressive negative letter-spacing (-0.9px to -1.5px) compresses headlines into confident, editorial statements. The font uses `ui-sans-serif, system-ui` as fallbacks, acknowledging that the custom typeface carries the brand personality.

What makes Lovable''s visual system distinctive is its opacity-driven depth model. Rather than using a traditional gray scale, the system modulates `#1c1c1c` at varying opacities (0.03, 0.04, 0.4, 0.82–0.83) to create a unified tonal range. Every shade of gray on the page is technically the same hue — just more or less transparent. This creates a visual coherence that''s nearly impossible to achieve with arbitrary hex values. The border system follows suit: `1px solid #eceae4` for light divisions and `1px solid rgba(28, 28, 28, 0.4)` for stronger interactive boundaries.

**Key Characteristics:**
- Warm parchment background (`#f7f4ed`) — not white, not beige, a deliberate cream that feels hand-selected
- Camera Plain Variable typeface with humanist warmth and editorial letter-spacing at display sizes
- Opacity-driven color system: all grays derived from `#1c1c1c` at varying transparency levels
- Inset shadow technique on buttons: `rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset`
- Warm neutral border palette: `#eceae4` for subtle, `rgba(28,28,28,0.4)` for interactive elements
- Full-pill radius (`9999px`) used extensively for action buttons and icon containers
- Focus state uses `rgba(0,0,0,0.1) 0px 4px 12px` shadow for soft, warm emphasis
- shadcn/ui + Radix UI component primitives with Tailwind CSS utility styling

## 2. Color Palette & Roles

### Primary
- **Cream** (`#f7f4ed`): Page background, card surfaces, button surfaces. The foundation — warm, paper-like, human.
- **Charcoal** (`#1c1c1c`): Primary text, headings, dark button backgrounds. Not pure black — organic warmth.
- **Off-White** (`#fcfbf8`): Button text on dark backgrounds, subtle highlight. Barely distinguishable from pure white.

### Neutral Scale (Opacity-Based)
- **Charcoal 100%** (`#1c1c1c`): Primary text, headings, dark surfaces.
- **Charcoal 83%** (`rgba(28,28,28,0.83)`): Strong secondary text.
- **Charcoal 82%** (`rgba(28,28,28,0.82)`): Body copy.
- **Muted Gray** (`#5f5f5d`): Secondary text, descriptions, captions.
- **Charcoal 40%** (`rgba(28,28,28,0.4)`): Interactive borders, button outlines.
- **Charcoal 4%** (`rgba(28,28,28,0.04)`): Subtle hover backgrounds, micro-tints.
- **Charcoal 3%** (`rgba(28,28,28,0.03)`): Barely-visible overlays, background depth.

### Surface & Border
- **Light Cream** (`#eceae4`): Card borders, dividers, image outlines. The warm divider line.
- **Cream Surface** (`#f7f4ed`): Card backgrounds, section fills — same as page background for seamless integration.

### Interactive
- **Ring Blue** (`#3b82f6` at 50% opacity): `--tw-ring-color`, Tailwind focus ring.
- **Focus Shadow** (`rgba(0,0,0,0.1) 0px 4px 12px`): Focus and active state shadow — soft, warm, diffused.

### Inset Shadows
- **Button Inset** (`rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px`): The signature multi-layer inset shadow on dark buttons.

## 3. Typography Rules

### Font Family
- **Primary**: `Camera Plain Variable`, with fallbacks: `ui-sans-serif, system-ui`
- **Weight range**: 400 (body/reading), 480 (special display), 600 (headings/emphasis)
- **Feature**: Variable font with continuous weight axis — allows fine-tuned intermediary weights like 480.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | Camera Plain Variable | 60px (3.75rem) | 600 | 1.00–1.10 (tight) | -1.5px | Maximum impact, editorial |
| Display Alt | Camera Plain Variable | 60px (3.75rem) | 480 | 1.00 (tight) | normal | Lighter hero variant |
| Section Heading | Camera Plain Variable | 48px (3.00rem) | 600 | 1.00 (tight) | -1.2px | Feature section titles |
| Sub-heading | Camera Plain Variable | 36px (2.25rem) | 600 | 1.10 (tight) | -0.9px | Sub-sections |
| Card Title | Camera Plain Variable | 20px (1.25rem) | 400 | 1.25 (tight) | normal | Card headings |
| Body Large | Camera Plain Variable | 18px (1.13rem) | 400 | 1.38 | normal | Introductions |
| Body | Camera Plain Variable | 16px (1.00rem) | 400 | 1.50 | normal | Standard reading text |
| Button | Camera Plain Variable | 16px (1.00rem) | 400 | 1.50 | normal | Button labels |
| Button Small | Camera Plain Variable | 14px (0.88rem) | 400 | 1.50 | normal | Compact buttons |
| Link | Camera Plain Variable | 16px (1.00rem) | 400 | 1.50 | normal | Underline decoration |
| Link Small | Camera Plain Variable | 14px (0.88rem) | 400 | 1.50 | normal | Footer links |
| Caption | Camera Plain Variable | 14px (0.88rem) | 400 | 1.50 | normal | Metadata, small text |

### Principles
- **Warm humanist voice**: Camera Plain Variable gives Lovable its approachable personality. The slightly rounded terminals and organic curves contrast with the sharp geometric sans-serifs used by most developer tools.
- **Variable weight as design tool**: The font supports continuous weight values (e.g., 480), enabling nuanced hierarchy beyond standard weight stops. Weight 480 at 60px creates a display style that feels lighter than semibold but stronger than regular.
- **Compression at scale**: Headlines use negative letter-spacing (-0.9px to -1.5px) for editorial impact. Body text stays at normal tracking for comfortable reading.
- **Two weights, clear roles**: 400 (body/UI/links/buttons) and 600 (headings/emphasis). The narrow weight range creates hierarchy through size and spacing, not weight variation.

## 4. Component Stylings

### Buttons

**Primary Dark (Inset Shadow)**
- Background: `#1c1c1c`
- Text: `#fcfbf8`
- Padding: 8px 16px
- Radius: 6px
- Shadow: `rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px`
- Active: opacity 0.8
- Focus: `rgba(0,0,0,0.1) 0px 4px 12px` shadow
- Use: Primary CTA ("Start Building", "Get Started")

**Ghost / Outline**
- Background: transparent
- Text: `#1c1c1c`
- Padding: 8px 16px
- Radius: 6px
- Border: `1px solid rgba(28,28,28,0.4)`
- Active: opacity 0.8
- Focus: `rgba(0,0,0,0.1) 0px 4px 12px` shadow
- Use: Secondary actions ("Log In", "Documentation")

**Cream Surface**
- Background: `#f7f4ed`
- Text: `#1c1c1c`
- Padding: 8px 16px
- Radius: 6px
- No border
- Active: opacity 0.8
- Use: Tertiary actions, toolbar buttons

**Pill / Icon Button**
- Background: `#f7f4ed`
- Text: `#1c1c1c`
- Radius: 9999px (full pill)
- Shadow: same inset pattern as primary dark
- Opacity: 0.5 (default), 0.8 (active)
- Use: Additional actions, plan mode toggle, voice recording

### Cards & Containers
- Background: `#f7f4ed` (matches page)
- Border: `1px solid #eceae4`
- Radius: 12px (standard), 16px (featured), 8px (compact)
- No box-shadow by default — borders define boundaries
- Image cards: `1px solid #eceae4` with 12px radius

### Inputs & Forms
- Background: `#f7f4ed`
- Text: `#1c1c1c`
- Border: `1px solid #eceae4`
- Radius: 6px
- Focus: ring blue (`rgba(59,130,246,0.5)`) outline
- Placeholder: `#5f5f5d`

### Navigation
- Clean horizontal nav on cream background, fixed
- Logo/wordmark left-aligned (128.75 x 22px)
- Links: Camera Plain 14–16px weight 400, `#1c1c1c` text
- CTA: dark button with inset shadow, 6px radius
- Mobile: hamburger menu with 6px radius button
- Subtle border or no border on scroll

### Links
- Color: `#1c1c1c`
- Decoration: underline (default)
- Hover: primary accent (via CSS variable `hsl(var(--primary))`)
- No color change on hover — decoration carries the interactive signal

### Image Treatment
- Showcase/portfolio images with `1px solid #eceae4` border
- Consistent 12px border radius on all image containers
- Soft gradient backgrounds behind hero content (warm multi-color wash)
- Gallery-style presentation for template/project showcases

### Distinctive Components

**AI Chat Input**
- Large prompt input area with soft borders
- Suggestion pills with `#eceae4` borders
- Voice recording / plan mode toggle buttons as pill shapes (9999px)
- Warm, inviting input area — not clinical

**Template Gallery**
- Card grid showing project templates
- Each card: image + title, `1px solid #eceae4` border, 12px radius
- Hover: subtle shadow or border darkening
- Category labels as text links

**Stats Bar**
- Large metrics: "0M+" pattern in 48px+ weight 600
- Descriptive text below in muted gray
- Horizontal layout with generous spacing

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 8px, 10px, 12px, 16px, 24px, 32px, 40px, 56px, 80px, 96px, 128px, 176px, 192px, 208px
- The scale expands generously at the top end — sections use 80px–208px vertical spacing for editorial breathing room

### Grid & Container
- Max content width: approximately 1200px (centered)
- Hero: centered single-column with massive vertical padding (96px+)
- Feature sections: 2–3 column grids
- Full-width footer with multi-column link layout
- Showcase sections with centered card grids

### Whitespace Philosophy
- **Editorial generosity**: Lovable''s spacing is lavish at section boundaries (80px–208px). The warm cream background makes these expanses feel cozy rather than empty.
- **Content-driven rhythm**: Tight internal spacing within cards (12–24px) contrasts with wide section gaps, creating a reading rhythm that alternates between focused content and visual rest.
- **Section separation**: Footer uses `1px solid #eceae4` border and 16px radius container. Sections defined by generous spacing rather than border lines.

### Border Radius Scale
- Micro (4px): Small buttons, interactive elements
- Standard (6px): Buttons, inputs, navigation menu
- Comfortable (8px): Compact cards, divs
- Card (12px): Standard cards, image containers, templates
- Container (16px): Large containers, footer sections
- Full Pill (9999px): Action pills, icon buttons, toggles

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, cream background | Page surface, most content |
| Bordered (Level 1) | `1px solid #eceae4` | Cards, images, dividers |
| Inset (Level 2) | `rgba(255,255,255,0.2) 0px 0.5px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px` | Dark buttons, primary actions |
| Focus (Level 3) | `rgba(0,0,0,0.1) 0px 4px 12px` | Active/focus states |
| Ring (Accessibility) | `rgba(59,130,246,0.5)` 2px ring | Keyboard focus on inputs |

**Shadow Philosophy**: Lovable''s depth system is intentionally shallow. Instead of floating cards with dramatic drop-shadows, the system relies on warm borders (`#eceae4`) against the cream surface to create gentle containment. The only notable shadow pattern is the inset shadow on dark buttons — a subtle multi-layer technique where a white highlight line sits at the top edge while a dark ring and soft drop handle the bottom. This creates a tactile, pressed-into-surface feeling rather than a hovering-above-surface feeling. The warm focus shadow (`rgba(0,0,0,0.1) 0px 4px 12px`) is deliberately diffused and large, creating a soft glow rather than a sharp outline.

### Decorative Depth
- Hero: soft, warm multi-color gradient wash (pinks, oranges, blues) behind hero — atmospheric, barely visible
- Footer: gradient background with warm tones transitioning to the bottom
- No harsh section dividers — spacing and background warmth handle transitions

## 7. Do''s and Don''ts

### Do
- Use the warm cream background (`#f7f4ed`) as the page foundation — it''s the brand''s signature warmth
- Use Camera Plain Variable at display sizes with negative letter-spacing (-0.9px to -1.5px)
- Derive all grays from `#1c1c1c` at varying opacity levels for tonal unity
- Use the inset shadow technique on dark buttons for tactile depth
- Use `#eceae4` borders instead of shadows for card containment
- Keep the weight system narrow: 400 for body/UI, 600 for headings
- Use full-pill radius (9999px) only for action pills and icon buttons
- Apply opacity 0.8 on active states for responsive tactile feedback

### Don''t
- Don''t use pure white (`#ffffff`) as a page background — the cream is intentional
- Don''t use heavy box-shadows for cards — borders are the containment mechanism
- Don''t introduce saturated accent colors — the palette is intentionally warm-neutral
- Don''t use weight 700 (bold) — 600 is the maximum weight in the system
- Don''t apply 9999px radius on rectangular buttons — pills are for icon/action toggles
- Don''t use sharp focus outlines — the system uses soft shadow-based focus indicators
- Don''t mix border styles — `#eceae4` for passive, `rgba(28,28,28,0.4)` for interactive
- Don''t increase letter-spacing on headings — Camera Plain is designed to run tight at scale

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <600px | Tight single column, reduced padding |
| Mobile | 600–640px | Standard mobile layout |
| Tablet Small | 640–700px | 2-column grids begin |
| Tablet | 700–768px | Card grids expand |
| Desktop Small | 768–1024px | Multi-column layouts |
| Desktop | 1024–1280px | Full feature layout |
| Large Desktop | 1280–1536px | Maximum content width, generous margins |

### Touch Targets
- Buttons: 8px 16px padding (comfortable touch)
- Navigation: adequate spacing between items
- Pill buttons: 9999px radius creates large tap-friendly targets
- Menu toggle: 6px radius button with adequate sizing

### Collapsing Strategy
- Hero: 60px → 48px → 36px headline scaling with proportional letter-spacing
- Navigation: horizontal links → hamburger menu at 768px
- Feature cards: 3-column → 2-column → single column stacked
- Template gallery: grid → stacked vertical cards
- Stats bar: horizontal → stacked vertical
- Footer: multi-column → stacked single column
- Section spacing: 128px+ → 64px on mobile

### Image Behavior
- Template screenshots maintain `1px solid #eceae4` border at all sizes
- 12px border radius preserved across breakpoints
- Gallery images responsive with consistent aspect ratios
- Hero gradient softens/simplifies on mobile

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: Charcoal (`#1c1c1c`)
- Background: Cream (`#f7f4ed`)
- Heading text: Charcoal (`#1c1c1c`)
- Body text: Muted Gray (`#5f5f5d`)
- Border: `#eceae4` (passive), `rgba(28,28,28,0.4)` (interactive)
- Focus: `rgba(0,0,0,0.1) 0px 4px 12px`
- Button text on dark: `#fcfbf8`

### Example Component Prompts
- "Create a hero section on cream background (#f7f4ed). Headline at 60px Camera Plain Variable weight 600, line-height 1.10, letter-spacing -1.5px, color #1c1c1c. Subtitle at 18px weight 400, line-height 1.38, color #5f5f5d. Dark CTA button (#1c1c1c bg, #fcfbf8 text, 6px radius, 8px 16px padding, inset shadow) and ghost button (transparent bg, 1px solid rgba(28,28,28,0.4) border, 6px radius)."
- "Design a card on cream (#f7f4ed) background. Border: 1px solid #eceae4. Radius 12px. No box-shadow. Title at 20px Camera Plain Variable weight 400, line-height 1.25, color #1c1c1c. Body at 14px weight 400, color #5f5f5d."
- "Build a template gallery: grid of cards with 12px radius, 1px solid #eceae4 border, cream backgrounds. Each card: image with 12px top radius, title below. Hover: subtle border darkening."
- "Create navigation: sticky on cream (#f7f4ed). Camera Plain 16px weight 400 for links, #1c1c1c text. Dark CTA button right-aligned with inset shadow. Mobile: hamburger menu with 6px radius."
- "Design a stats section: large numbers at 48px Camera Plain weight 600, letter-spacing -1.2px, #1c1c1c. Labels below at 16px weight 400, #5f5f5d. Horizontal layout with 32px gap."

### Iteration Guide
1. Always use cream (`#f7f4ed`) as the base — never pure white
2. Derive grays from `#1c1c1c` at opacity levels rather than using distinct hex values
3. Use `#eceae4` borders for containment, not shadows
4. Letter-spacing scales with size: -1.5px at 60px, -1.2px at 48px, -0.9px at 36px, normal at 16px
5. Two weights: 400 (everything except headings) and 600 (headings)
6. The inset shadow on dark buttons is the signature detail — don''t skip it
7. Camera Plain Variable at weight 480 is for special display moments only
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
((select id from d), 'other', 'Design System Inspired by Lovable', 'other', '# Design System Inspired by Lovable', '{"sourcePath":"docs/design-md/lovable/DESIGN.md","category":"other"}'::jsonb, 0.75, 1),
((select id from d), 'overview', '1. Visual Theme & Atmosphere', 'overview', '## 1. Visual Theme & Atmosphere

Lovable''s website radiates warmth through restraint. The entire page sits on a creamy, parchment-toned background (`#f7f4ed`) that immediately separates it from the cold-white conventions of most developer tool sites. This isn''t minimalism for minimalism''s sake — it''s a deliberate choice to feel approachable, almost analog, like a well-crafted notebook. The near-black text (`#1c1c1c`) against this warm cream creates a contrast ratio that''s easy on the eyes while maintaining sharp readability.

The custom Camera Plain Variable typeface is the system''s secret weapon. Unlike geometric sans-serifs that signal "tech company," Camera Plain has a humanist warmth — slightly rounded terminals, organic curves, and a comfortable reading rhythm. At display sizes (48px–60px), weight 600 with aggressive negative letter-spacing (-0.9px to -1.5px) compresses headlines into confident, editorial statements. The font uses `ui-sans-serif, system-ui` as fallbacks, acknowledging that the custom typeface carries the brand personality.

What makes Lovable''s visual system distinctive is its opacity-driven depth model. Rather than using a traditional gray scale, the system modulates `#1c1c1c` at varying opacities (0.03, 0.04, 0.4, 0.82–0.83) to create a unified tonal range. Every shade of gray on the page is technically the same hue — just more or less transparent. This creates a visual coherence that''s nearly impossible to achieve with arbitrary hex values. The border system follows suit: `1px solid #eceae4` for light divisions and `1px solid rgba(28, 28, 28, 0.4)` for stronger interactive boundaries.

**Key Characteristics:**
- Warm parchment background (`#f7f4ed`) — not white, not beige, a deliberate cream that feels hand-selected
- Camera Plain Variable typeface with humanist warmth and editorial letter-spacing at display sizes
- Opacity-driven color system: all grays derived from `#1c1c1c` at varying transparency levels
- Inset shadow technique on buttons: `rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset`
- Warm neutral border palette: `#eceae4` for subtle, `rgba(28,28,28,0.4)` for interactive elements
- Full-pill radius (`9999px`) used extensively for action buttons and icon containers
- Focus state uses `rgba(0,0,0,0.1) 0px 4px 12px` shadow for soft, warm emphasis
- shadcn/ui + Radix UI component primitives with Tailwind CSS utility styling', '{"sourcePath":"docs/design-md/lovable/DESIGN.md","category":"overview"}'::jsonb, 0.75, 2),
((select id from d), 'colors', '2. Color Palette & Roles', 'colors', '## 2. Color Palette & Roles

### Primary
- **Cream** (`#f7f4ed`): Page background, card surfaces, button surfaces. The foundation — warm, paper-like, human.
- **Charcoal** (`#1c1c1c`): Primary text, headings, dark button backgrounds. Not pure black — organic warmth.
- **Off-White** (`#fcfbf8`): Button text on dark backgrounds, subtle highlight. Barely distinguishable from pure white.

### Neutral Scale (Opacity-Based)
- **Charcoal 100%** (`#1c1c1c`): Primary text, headings, dark surfaces.
- **Charcoal 83%** (`rgba(28,28,28,0.83)`): Strong secondary text.
- **Charcoal 82%** (`rgba(28,28,28,0.82)`): Body copy.
- **Muted Gray** (`#5f5f5d`): Secondary text, descriptions, captions.
- **Charcoal 40%** (`rgba(28,28,28,0.4)`): Interactive borders, button outlines.
- **Charcoal 4%** (`rgba(28,28,28,0.04)`): Subtle hover backgrounds, micro-tints.
- **Charcoal 3%** (`rgba(28,28,28,0.03)`): Barely-visible overlays, background depth.

### Surface & Border
- **Light Cream** (`#eceae4`): Card borders, dividers, image outlines. The warm divider line.
- **Cream Surface** (`#f7f4ed`): Card backgrounds, section fills — same as page background for seamless integration.

### Interactive
- **Ring Blue** (`#3b82f6` at 50% opacity): `--tw-ring-color`, Tailwind focus ring.
- **Focus Shadow** (`rgba(0,0,0,0.1) 0px 4px 12px`): Focus and active state shadow — soft, warm, diffused.

### Inset Shadows
- **Button Inset** (`rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px`): The signature multi-layer inset shadow on dark buttons.', '{"sourcePath":"docs/design-md/lovable/DESIGN.md","category":"colors"}'::jsonb, 0.75, 3),
((select id from d), 'typography', '3. Typography Rules', 'typography', '## 3. Typography Rules

### Font Family
- **Primary**: `Camera Plain Variable`, with fallbacks: `ui-sans-serif, system-ui`
- **Weight range**: 400 (body/reading), 480 (special display), 600 (headings/emphasis)
- **Feature**: Variable font with continuous weight axis — allows fine-tuned intermediary weights like 480.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | Camera Plain Variable | 60px (3.75rem) | 600 | 1.00–1.10 (tight) | -1.5px | Maximum impact, editorial |
| Display Alt | Camera Plain Variable | 60px (3.75rem) | 480 | 1.00 (tight) | normal | Lighter hero variant |
| Section Heading | Camera Plain Variable | 48px (3.00rem) | 600 | 1.00 (tight) | -1.2px | Feature section titles |
| Sub-heading | Camera Plain Variable | 36px (2.25rem) | 600 | 1.10 (tight) | -0.9px | Sub-sections |
| Card Title | Camera Plain Variable | 20px (1.25rem) | 400 | 1.25 (tight) | normal | Card headings |
| Body Large | Camera Plain Variable | 18px (1.13rem) | 400 | 1.38 | normal | Introductions |
| Body | Camera Plain Variable | 16px (1.00rem) | 400 | 1.50 | normal | Standard reading text |
| Button | Camera Plain Variable | 16px (1.00rem) | 400 | 1.50 | normal | Button labels |
| Button Small | Camera Plain Variable | 14px (0.88rem) | 400 | 1.50 | normal | Compact buttons |
| Link | Camera Plain Variable | 16px (1.00rem) | 400 | 1.50 | normal | Underline decoration |
| Link Small | Camera Plain Variable | 14px (0.88rem) | 400 | 1.50 | normal | Footer links |
| Caption | Camera Plain Variable | 14px (0.88rem) | 400 | 1.50 | normal | Metadata, small text |

### Principles
- **Warm humanist voice**: Camera Plain Variable gives Lovable its approachable personality. The slightly rounded terminals and organic curves contrast with the sharp geometric sans-serifs used by most developer tools.
- **Variable weight as design tool**: The font supports continuous weight values (e.g., 480), enabling nuanced hierarchy beyond standard weight stops. Weight 480 at 60px creates a display style that feels lighter than semibold but stronger than regular.
- **Compression at scale**: Headlines use negative letter-spacing (-0.9px to -1.5px) for editorial impact. Body text stays at normal tracking for comfortable reading.
- **Two weights, clear roles**: 400 (body/UI/links/buttons) and 600 (headings/emphasis). The narrow weight range creates hierarchy through size and spacing, not weight variation.', '{"sourcePath":"docs/design-md/lovable/DESIGN.md","category":"typography"}'::jsonb, 0.75, 4),
((select id from d), 'components', '4. Component Stylings', 'components', '## 4. Component Stylings

### Buttons

**Primary Dark (Inset Shadow)**
- Background: `#1c1c1c`
- Text: `#fcfbf8`
- Padding: 8px 16px
- Radius: 6px
- Shadow: `rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px`
- Active: opacity 0.8
- Focus: `rgba(0,0,0,0.1) 0px 4px 12px` shadow
- Use: Primary CTA ("Start Building", "Get Started")

**Ghost / Outline**
- Background: transparent
- Text: `#1c1c1c`
- Padding: 8px 16px
- Radius: 6px
- Border: `1px solid rgba(28,28,28,0.4)`
- Active: opacity 0.8
- Focus: `rgba(0,0,0,0.1) 0px 4px 12px` shadow
- Use: Secondary actions ("Log In", "Documentation")

**Cream Surface**
- Background: `#f7f4ed`
- Text: `#1c1c1c`
- Padding: 8px 16px
- Radius: 6px
- No border
- Active: opacity 0.8
- Use: Tertiary actions, toolbar buttons

**Pill / Icon Button**
- Background: `#f7f4ed`
- Text: `#1c1c1c`
- Radius: 9999px (full pill)
- Shadow: same inset pattern as primary dark
- Opacity: 0.5 (default), 0.8 (active)
- Use: Additional actions, plan mode toggle, voice recording

### Cards & Containers
- Background: `#f7f4ed` (matches page)
- Border: `1px solid #eceae4`
- Radius: 12px (standard), 16px (featured), 8px (compact)
- No box-shadow by default — borders define boundaries
- Image cards: `1px solid #eceae4` with 12px radius

### Inputs & Forms
- Background: `#f7f4ed`
- Text: `#1c1c1c`
- Border: `1px solid #eceae4`
- Radius: 6px
- Focus: ring blue (`rgba(59,130,246,0.5)`) outline
- Placeholder: `#5f5f5d`

### Navigation
- Clean horizontal nav on cream background, fixed
- Logo/wordmark left-aligned (128.75 x 22px)
- Links: Camera Plain 14–16px weight 400, `#1c1c1c` text
- CTA: dark button with inset shadow, 6px radius
- Mobile: hamburger menu with 6px radius button
- Subtle border or no border on scroll

### Links
- Color: `#1c1c1c`
- Decoration: underline (default)
- Hover: primary accent (via CSS variable `hsl(var(--primary))`)
- No color change on hover — decoration carries the interactive signal

### Image Treatment
- Showcase/portfolio images with `1px solid #eceae4` border
- Consistent 12px border radius on all image containers
- Soft gradient backgrounds behind hero content (warm multi-color wash)
- Gallery-style presentation for template/project showcases

### Distinctive Components

**AI Chat Input**
- Large prompt input area with soft borders
- Suggestion pills with `#eceae4` borders
- Voice recording / plan mode toggle buttons as pill shapes (9999px)
- Warm, inviting input area — not clinical

**Template Gallery**
- Card grid showing project templates
- Each card: image + title, `1px solid #eceae4` border, 12px radius
- Hover: subtle shadow or border darkening
- Category labels as text links

**Stats Bar**
- Large metrics: "0M+" pattern in 48px+ weight 600
- Descriptive text below in muted gray
- Horizontal layout with generous spacing', '{"sourcePath":"docs/design-md/lovable/DESIGN.md","category":"components"}'::jsonb, 0.75, 5),
((select id from d), 'layout', '5. Layout Principles', 'layout', '## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 8px, 10px, 12px, 16px, 24px, 32px, 40px, 56px, 80px, 96px, 128px, 176px, 192px, 208px
- The scale expands generously at the top end — sections use 80px–208px vertical spacing for editorial breathing room

### Grid & Container
- Max content width: approximately 1200px (centered)
- Hero: centered single-column with massive vertical padding (96px+)
- Feature sections: 2–3 column grids
- Full-width footer with multi-column link layout
- Showcase sections with centered card grids

### Whitespace Philosophy
- **Editorial generosity**: Lovable''s spacing is lavish at section boundaries (80px–208px). The warm cream background makes these expanses feel cozy rather than empty.
- **Content-driven rhythm**: Tight internal spacing within cards (12–24px) contrasts with wide section gaps, creating a reading rhythm that alternates between focused content and visual rest.
- **Section separation**: Footer uses `1px solid #eceae4` border and 16px radius container. Sections defined by generous spacing rather than border lines.

### Border Radius Scale
- Micro (4px): Small buttons, interactive elements
- Standard (6px): Buttons, inputs, navigation menu
- Comfortable (8px): Compact cards, divs
- Card (12px): Standard cards, image containers, templates
- Container (16px): Large containers, footer sections
- Full Pill (9999px): Action pills, icon buttons, toggles', '{"sourcePath":"docs/design-md/lovable/DESIGN.md","category":"layout"}'::jsonb, 0.75, 6),
((select id from d), 'elevation', '6. Depth & Elevation', 'elevation', '## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, cream background | Page surface, most content |
| Bordered (Level 1) | `1px solid #eceae4` | Cards, images, dividers |
| Inset (Level 2) | `rgba(255,255,255,0.2) 0px 0.5px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px` | Dark buttons, primary actions |
| Focus (Level 3) | `rgba(0,0,0,0.1) 0px 4px 12px` | Active/focus states |
| Ring (Accessibility) | `rgba(59,130,246,0.5)` 2px ring | Keyboard focus on inputs |

**Shadow Philosophy**: Lovable''s depth system is intentionally shallow. Instead of floating cards with dramatic drop-shadows, the system relies on warm borders (`#eceae4`) against the cream surface to create gentle containment. The only notable shadow pattern is the inset shadow on dark buttons — a subtle multi-layer technique where a white highlight line sits at the top edge while a dark ring and soft drop handle the bottom. This creates a tactile, pressed-into-surface feeling rather than a hovering-above-surface feeling. The warm focus shadow (`rgba(0,0,0,0.1) 0px 4px 12px`) is deliberately diffused and large, creating a soft glow rather than a sharp outline.

### Decorative Depth
- Hero: soft, warm multi-color gradient wash (pinks, oranges, blues) behind hero — atmospheric, barely visible
- Footer: gradient background with warm tones transitioning to the bottom
- No harsh section dividers — spacing and background warmth handle transitions', '{"sourcePath":"docs/design-md/lovable/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', '7. Do''s and Don''ts', 'dos_and_donts', '## 7. Do''s and Don''ts

### Do
- Use the warm cream background (`#f7f4ed`) as the page foundation — it''s the brand''s signature warmth
- Use Camera Plain Variable at display sizes with negative letter-spacing (-0.9px to -1.5px)
- Derive all grays from `#1c1c1c` at varying opacity levels for tonal unity
- Use the inset shadow technique on dark buttons for tactile depth
- Use `#eceae4` borders instead of shadows for card containment
- Keep the weight system narrow: 400 for body/UI, 600 for headings
- Use full-pill radius (9999px) only for action pills and icon buttons
- Apply opacity 0.8 on active states for responsive tactile feedback

### Don''t
- Don''t use pure white (`#ffffff`) as a page background — the cream is intentional
- Don''t use heavy box-shadows for cards — borders are the containment mechanism
- Don''t introduce saturated accent colors — the palette is intentionally warm-neutral
- Don''t use weight 700 (bold) — 600 is the maximum weight in the system
- Don''t apply 9999px radius on rectangular buttons — pills are for icon/action toggles
- Don''t use sharp focus outlines — the system uses soft shadow-based focus indicators
- Don''t mix border styles — `#eceae4` for passive, `rgba(28,28,28,0.4)` for interactive
- Don''t increase letter-spacing on headings — Camera Plain is designed to run tight at scale', '{"sourcePath":"docs/design-md/lovable/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', '8. Responsive Behavior', 'responsive_guidelines', '## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <600px | Tight single column, reduced padding |
| Mobile | 600–640px | Standard mobile layout |
| Tablet Small | 640–700px | 2-column grids begin |
| Tablet | 700–768px | Card grids expand |
| Desktop Small | 768–1024px | Multi-column layouts |
| Desktop | 1024–1280px | Full feature layout |
| Large Desktop | 1280–1536px | Maximum content width, generous margins |

### Touch Targets
- Buttons: 8px 16px padding (comfortable touch)
- Navigation: adequate spacing between items
- Pill buttons: 9999px radius creates large tap-friendly targets
- Menu toggle: 6px radius button with adequate sizing

### Collapsing Strategy
- Hero: 60px → 48px → 36px headline scaling with proportional letter-spacing
- Navigation: horizontal links → hamburger menu at 768px
- Feature cards: 3-column → 2-column → single column stacked
- Template gallery: grid → stacked vertical cards
- Stats bar: horizontal → stacked vertical
- Footer: multi-column → stacked single column
- Section spacing: 128px+ → 64px on mobile

### Image Behavior
- Template screenshots maintain `1px solid #eceae4` border at all sizes
- 12px border radius preserved across breakpoints
- Gallery images responsive with consistent aspect ratios
- Hero gradient softens/simplifies on mobile', '{"sourcePath":"docs/design-md/lovable/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', '9. Agent Prompt Guide', 'other', '## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: Charcoal (`#1c1c1c`)
- Background: Cream (`#f7f4ed`)
- Heading text: Charcoal (`#1c1c1c`)
- Body text: Muted Gray (`#5f5f5d`)
- Border: `#eceae4` (passive), `rgba(28,28,28,0.4)` (interactive)
- Focus: `rgba(0,0,0,0.1) 0px 4px 12px`
- Button text on dark: `#fcfbf8`

### Example Component Prompts
- "Create a hero section on cream background (#f7f4ed). Headline at 60px Camera Plain Variable weight 600, line-height 1.10, letter-spacing -1.5px, color #1c1c1c. Subtitle at 18px weight 400, line-height 1.38, color #5f5f5d. Dark CTA button (#1c1c1c bg, #fcfbf8 text, 6px radius, 8px 16px padding, inset shadow) and ghost button (transparent bg, 1px solid rgba(28,28,28,0.4) border, 6px radius)."
- "Design a card on cream (#f7f4ed) background. Border: 1px solid #eceae4. Radius 12px. No box-shadow. Title at 20px Camera Plain Variable weight 400, line-height 1.25, color #1c1c1c. Body at 14px weight 400, color #5f5f5d."
- "Build a template gallery: grid of cards with 12px radius, 1px solid #eceae4 border, cream backgrounds. Each card: image with 12px top radius, title below. Hover: subtle border darkening."
- "Create navigation: sticky on cream (#f7f4ed). Camera Plain 16px weight 400 for links, #1c1c1c text. Dark CTA button right-aligned with inset shadow. Mobile: hamburger menu with 6px radius."
- "Design a stats section: large numbers at 48px Camera Plain weight 600, letter-spacing -1.2px, #1c1c1c. Labels below at 16px weight 400, #5f5f5d. Horizontal layout with 32px gap."

### Iteration Guide
1. Always use cream (`#f7f4ed`) as the base — never pure white
2. Derive grays from `#1c1c1c` at opacity levels rather than using distinct hex values
3. Use `#eceae4` borders for containment, not shadows
4. Letter-spacing scales with size: -1.5px at 60px, -1.2px at 48px, -0.9px at 36px, normal at 16px
5. Two weights: 400 (everything except headings) and 600 (headings)
6. The inset shadow on dark buttons is the signature detail — don''t skip it
7. Camera Plain Variable at weight 480 is for special display moments only', '{"sourcePath":"docs/design-md/lovable/DESIGN.md","category":"other"}'::jsonb, 0.75, 10);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/lovable/DESIGN.md'), 'color', 'color_1', '#f7f4ed', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lovable/DESIGN.md'), 'color', 'color_2', '#1c1c1c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lovable/DESIGN.md'), 'color', 'color_3', '#eceae4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lovable/DESIGN.md'), 'color', 'color_4', '#fcfbf8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lovable/DESIGN.md'), 'color', 'color_5', '#5f5f5d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lovable/DESIGN.md'), 'color', 'color_6', '#3b82f6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/lovable/DESIGN.md'), 'color', 'color_7', '#ffffff', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/lovable/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/lovable/DESIGN.md';


-- Mastercard
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Mastercard', 'mastercard', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/mastercard/DESIGN.md', null, 'seeded', '# Design System Inspired by Mastercard

## 1. Visual Theme & Atmosphere

Mastercard''s experience reads like a warm, editorial magazine built from soft stone and signal orange. The canvas is a muted putty-cream (`#F3F0EE`) — not white, not gray, but a color that feels like the paper of a premium annual report. On top of that canvas, everything that matters is shaped like a stadium, a pill, or a perfect circle. The dominant visual gesture is the **oversized radius**: heroes carry 40-point corners, cards go fully pill-shaped, service images are cropped into circular orbits, and buttons either complete the pill or fit snugly at 20 points. There are almost no sharp corners anywhere on the page.

The second gesture is **orbit and trajectory**. Circular image masks don''t sit still — they''re connected by thin, hand-drawn-feeling orange arcs that span entire viewport widths, implying a constellation of services rather than a list. Each circle has a small attached "satellite" — a white micro-CTA holding an arrow icon — docked onto its perimeter like a moon. This is the most distinctive thing about Mastercard''s current design language: the circles feel like they''re in motion even though the page is still.

Typography is rendered entirely in **MarkForMC**, Mastercard''s proprietary geometric sans. Headlines are set at a medium weight (500) with tight negative letter-spacing (-2%), giving them confidence without shouting. Body copy runs at the same family in a slightly lighter weight (450) — a weight you rarely see on the web, chosen because it reads softer than regular 400 without feeling thin. The whole system — warm cream surfaces, pill shapes, circular portraits, traced-orange orbits, black CTAs — feels simultaneously institutional (a 60-year-old payments network) and editorial (a modern brand magazine), which is exactly the tension Mastercard wants to hold.

**Key Characteristics:**
- Warm cream canvas (`#F3F0EE`) replaces traditional white — every surface is tinted, never sterile
- Extreme border-radius as design language: 40px, 99px, 1000px dominate; anything square is a cookie-banner third-party
- Circular image portraits with attached white satellite-CTAs and traced-orange orbital paths
- Ghost "watermark" headlines (cream-on-cream text at heading scale) layered behind circle portraits
- Black primary CTAs with 20px radius in the body — the cookie-banner orange is kept to consent flows
- Floating pill-shaped navigation that docks below the viewport top with rounded shoulders
- Eyebrow labels with a tiny accent dot + uppercase bold tracking — used as the section-category signal
- Dark warm-black footer (`#141413`) with four-column link layout and large conversational headline

## 2. Color Palette & Roles

### Primary
- **Mastercard Red** (`#EB001B`): The left circle of the Mastercard mark — used only in the brand logo, never as a UI color.
- **Mastercard Yellow** (`#F79E1B`): The right circle of the Mastercard mark — used only in the brand logo, never as a UI color.
- **Ink Black** (`#141413`): The warm near-black used for primary CTAs, headline text on cream, and the footer surface. Slightly warm (the `13` blue value pulls toward the cream) so it never feels jet-black on the warm canvas.

### Secondary & Accent
- **Signal Orange** (`#CF4500`): The burnt/rust CTA orange used on consent actions and eyebrow dots. Deeper than the brand yellow, brighter than ink — it''s the page''s single aggressive color and must be used sparingly.
- **Light Signal Orange** (`#F37338`): A lighter carroty orange used for carousel active indicators and decorative orbital arcs. Always acts as an attention cue, never as body color.
- **Clay Brown** (`#9A3A0A`): The deep rust used for secondary link-style buttons (e.g., cookie details). Sits between ink and signal orange.

### Surface & Background
- **Canvas Cream** (`#F3F0EE`): The page canvas. Warm, putty-toned, the default body background. All editorial sections sit on this.
- **Lifted Cream** (`#FCFBFA`): One step lighter than canvas — used for nested "raised" sections that want to feel like paper laid on paper.
- **White** (`#FFFFFF`): Reserved for the floating navigation pill, modal cards, secondary button fills, and small satellite-CTA circles attached to image portraits.
- **Soft Bone** (`#F4F4F4`): A cool-gray alternative surface used inside a handful of component subregions.

### Neutrals & Text
- **Ink Black** (`#141413`): Primary headline and body text color.
- **Charcoal** (`#262627`): A slightly softer black used for some text alternates.
- **Slate Gray** (`#696969`): Muted secondary text — eyebrow label alternative, disabled states, "Privacy Choices" bottom-row text.
- **Granite** (`#555555`) and **Graphite** (`#565656`): Deeper gray for inline body accents and link alternates.
- **Dust Taupe** (`#D1CDC7`): Very muted cream-gray used for disabled or "whisper" text (e.g., placeholder-like empty state labels). Low contrast on cream; use only for subdued content.

### Semantic & Accent
- **Link Blue** (`#3860BE`): A deep, slightly dusty blue used for inline links and informational callouts. Saturated enough to read as a link without being neon.
- **Priceless Red + Yellow**: The full-color Mastercard logo mark is the only place the brand''s red and yellow appear together; they lock the identity to the page without acting as a UI palette.

### Gradient System
Mastercard uses no programmatic gradients in the core UI. The visual impression of "gradient" comes from two places:
- **Circular image portraits** where a warm-orange photo subject (a card, a sunflower, a beverage) fades to the cream canvas at its edge
- **Deep card shadows** on elevated content (`rgba(0,0,0,0.08) 0px 24px 48px`) that create a soft halo beneath pill-shaped media

## 3. Typography Rules

### Font Family
- **Primary**: `MarkForMC` — Mastercard''s proprietary geometric sans. Every headline, body paragraph, button, nav link, and footer link on the page.
- **Secondary**: `MarkOffcForMC` — an "Official" cut used in a minority of contexts (legal text, some forms).
- **Fallback stack**: `SofiaSans, Arial, sans-serif` — Sofia Sans is a reasonable open-source stand-in; Arial is the final web-safe fallback.

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| H1 (hero) | 64px | 500 | 64px | -1.28px (-2%) | Set to `1:1` line-height for very tight vertical rhythm on multi-line hero |
| H2 (section) | 36px | 500 | 44px | -0.72px (-2%) | Used in ghost-watermark headline treatments and section titles |
| H3 (card title) | 24px | 500 | 28.8px (1.2) | -0.48px (-2%) | Titles inside service/solution cards |
| H4 (subhead) | 14px | 700 | 18.2px (1.3) | normal | Rarely used in marketing surfaces |
| Eyebrow (H5) | 14px | 700 | 14px | 0.56px (+4%) | Uppercase, paired with a tiny accent dot (e.g., "• SERVICES") |
| Body paragraph | 16px | 450 | 22.4px (1.4) | normal | The half-step 450 weight is MarkForMC''s signature — softer than 500, firmer than 400 |
| Nav link / Button label | 16px | 500 | 16px | -0.48px (-3%) | Tight, compact, no text-transform |
| Footer link | 14px | 450 | ~20px | normal | Lighter weight on dark footer for airier density |
| Footer column header | 12–14px | 700 | 14px | 0.56px (+4%) | Uppercase, muted gray, short tracking |

### Principles
- **Weight 450 is load-bearing**. Most brands use 400/500/700; Mastercard uses 450 for body copy, which creates an unusually soft reading tone. Replacing it with 400 flattens the identity.
- **Tight negative tracking on headlines** (-2%) gives display text its editorial density — the words lock together rather than breathe.
- **Uppercase tracking only on the eyebrow scale** (14px / 700 / +4% tracking). Don''t use uppercase anywhere else; no shouty section titles.
- **One-font system**. Resist the urge to add a second typeface for contrast. The contrast comes from scale, weight, and letter-spacing, not from a serif or display accent.
- **Line-height ratio drops with size**. H1 is 1:1, H3 is 1.2, body is 1.4. Tight display, comfortable reading.

### Note on Font Substitutes
MarkForMC is proprietary and licensed. When rebuilding a matching aesthetic without access to the original:
- **Sofia Sans** (Google Fonts) is the closest open-source match — it''s already in Mastercard''s declared fallback stack.
- **Inter** at weights 450/500/700 works as a generic stand-in; expect slightly taller x-height and looser letter shapes.
- **Neue Haas Grotesk** or **Geist** can approximate the geometric feel for commercial projects.
- Whichever substitute is used, preserve the **-2% letter-spacing on headlines** and the **450 body weight** (use `font-weight: 450` with variable fonts, or substitute `font-weight: 400` and tighten the letter-spacing by ~-0.5% to compensate).

## 4. Component Stylings

### Buttons

**Primary — Ink Pill**
- Background: Ink Black (`#141413`)
- Text: Canvas Cream (`#F3F0EE`) — not pure white
- Border: 1.5px solid Ink Black (same as bg, creates crisp edge)
- Radius: 20px
- Padding: 6px 24px
- Font: MarkForMC 16px / weight 500 / letter-spacing -0.32px
- Default: as above; solid warm-black pill on cream canvas
- Active / pressed: subtle inward-shrink or 2px offset (not a hover variant)
- Use for: all marketing CTAs in the page body ("Learn more", "Explore", "Discover")

**Secondary — Outlined Pill**
- Background: White (`#FFFFFF`)
- Text: Ink Black (`#141413`)
- Border: 1.5px solid Ink Black
- Radius: 20px
- Padding: 6px 24px
- Font: MarkForMC 16px / weight 450 / line-height 20.8px
- Default: white-on-cream pill with crisp ink outline
- Active / pressed: subtle compression
- Use for: secondary actions paired with a primary, or standalone utility CTAs

**Consent / Signal — Orange Pill**
- Background: Signal Orange (`#CF4500`)
- Text: White (`#FFFFFF`)
- Border: 0
- Radius: 24px
- Padding: 1px 30px (very tight vertical, wide horizontal)
- Font: MarkForMC 13px / weight 400 / letter-spacing 0.13px
- Default: as above; bright rust pill with white text
- Use for: cookie consent, privacy preference, and other legally-distinct confirmations. **Do not** use this orange for marketing CTAs — it reads as a compliance color.

**Satellite — Circular Micro-CTA**
- Background: White (`#FFFFFF`)
- Icon: Ink Black arrow (`→`) at ~20px
- Border: none
- Radius: 50% (perfect circle)
- Size: ~50–60px diameter
- Shadow: none or very subtle (the portrait''s shadow carries the elevation)
- Default: docks onto the bottom-right edge of a circular portrait, protruding partway outside the portrait''s circle
- Use for: the primary entry point into service/solution cards; always paired with a circular portrait

**Icon-Only Circle Button (carousel, play/pause)**
- Background: transparent or white
- Icon: 10–20px centered
- Border: 1px solid Ink Black (when on cream) or none (when over media)
- Radius: 50%
- Size: 40px diameter minimum for carousel controls; 80px for hero video play
- Use for: carousel pagination/play-pause, hero video play, search toggle

### Cards & Containers

**Hero Media Frame (Stadium)**
- Background: Dark video or full-bleed imagery (typically black `#000000` or `#2B2B2B` behind video)
- Radius: 40px all corners (creates a stadium shape on wide viewports)
- Width: ~full viewport minus ~48px gutter on each side
- Height: ~60–70% of viewport
- Shadow: none (sits directly on canvas)
- Corners: the extreme 40px radius on a media element is the most iconic Mastercard gesture — do not round less

**Service / Solution Portrait Card**
- Shape: Perfect circle (radius 50%) or ellipse (radius 999px / 1000px)
- Diameter: 260–340px desktop; ~220px mobile
- Image crop: square source, cropped to circle
- Attached element: White satellite circular CTA (see above) docked bottom-right, ~40% outside the portrait
- Eyebrow below: accent dot + uppercase label (e.g., "• SERVICES", "• SOLUTIONS")
- Title below: H3 (24px / weight 500 / -2% tracking), 1–2 lines max
- Decorative orbit: thin ~1px Light Signal Orange curved line spanning from this card outward to the next, implying connection

**Pill Carousel Card**
- Radius: 1000px (full pill) or 40px corners (rounded stadium)
- Width: ~40–60% of viewport
- Height: ~380–420px (portrait-pill orientation)
- Content: full-bleed photography with small overlaid chip labels
- Chip inside: White pill (~ 999px radius), Ink Black text, padding 8px 20px, used for category tags like "Story"
- Large inline CTA inside: Ink Pill button, oversized (padding 16px 40px, radius 40px)

**Ghost Watermark Text Block**
- Font: MarkForMC 72–128px / weight 500 / tight -2% tracking
- Color: Canvas Cream slightly darkened (`#E8E2DA` or similar — cream-on-cream)
- Position: layered behind portrait circles, bleeding off the viewport edge
- Purpose: sets section theme without competing with foreground copy

### Inputs & Forms
Minimal form surface on the marketing page. The search input in the nav header is:
- Initial state: a 48px circular button with a magnifier icon
- Expanded state: horizontal input field, border `1px solid` Ink Black at ~50% opacity, radius 999px, padding 12px 24px, white background

**Country/language selector (footer)**
- Background: Ink Black (same as footer)
- Text: White
- Border: 1px solid `rgba(255,255,255,0.4)`
- Radius: 999px (full pill)
- Icon: downward chevron on the right

### Navigation

**Floating Nav Pill (desktop)**
- Container: white-to-translucent-white pill floating below the very top of the viewport with a ~24px top margin
- Radius: 999px / 1000px (full pill)
- Padding: ~16px 40px internal
- Shadow: very soft (`rgba(0, 0, 0, 0.04) 0px 4px 24px 0px`) — just enough to lift it off the cream canvas
- Content: Mastercard logo left, primary link group center ("For you", "For business", "For the world", "For innovators", "News and trends"), search icon right
- Link spacing: ~48–56px gap between primary links
- Link style: Ink Black, weight 500, 16px, no underline, no pill surround until active

**Mobile Nav**
- The same pill shape but collapsed to: logo + hamburger menu button + search icon only
- Menu opens into a full-screen overlay with the primary links stacked vertically

### Image Treatment

- **Aspect ratios used**: 1:1 (all service portraits — cropped to circle), ~3:4 or ~4:5 (carousel pill cards), 16:9 or wider (hero video frame)
- **Full-bleed vs padded**: Hero is viewport-wide with gutters; service portraits are always centered in their column with generous whitespace around; footer imagery is rare
- **Masking**: Aggressive circular masking is the defining treatment — square source images are cropped to perfect circles of matching diameter. Never use rectangular service imagery.
- **Lazy loading**: Standard `loading="lazy"` with a soft blur-up transition from a cream-tinted placeholder, preserving the warm palette during load

### Decorative Orbital Lines

A signature motif: thin (~1–1.5px) single-weight curved lines in Light Signal Orange (`#F37338`) tracing arcs between circular portraits. These lines:
- Imply connection between service cards without literal arrows
- Span widths from ~200px up to full-viewport arcs
- Feel hand-drawn (subtle irregularity) rather than perfect CSS curves
- Appear only in sections with circular portrait content — never on pill sections, never in the footer

### Footer

- Background: Ink Black (`#141413`)
- Text: White
- Padding: 48px horizontal 100px / bottom 148px (very tall bottom space)
- Structure: large conversational H2 ("We''re always here when you need us") left-aligned, then a 4-column link grid below
- Column headers: uppercase, muted, weight 700, letter-spacing +4%
- Link rows: white, weight 450, 14px; entries prefixed with a small icon (support bubble, card, map pin, question mark) for the "NEED HELP?" column
- External link marker: a small upper-right arrow (`↗`) after link text
- Bottom row (below a 1px white-at-opacity divider): copyright + privacy small-print + country-language pill dropdown + four social icons (LinkedIn, Facebook, X, YouTube)

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px (confirmed by dembrandt extraction and computed styles)
- **Scale**: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 (powers of 8)
- **Section vertical padding**: ~96–128px between major sections on desktop; ~48–64px on mobile
- **Card internal padding**: 32–40px on desktop, ~24px on mobile
- **Nav top margin**: ~24px from viewport top (the pill floats, doesn''t touch)

### Grid & Container
- **Max content width**: ~1200–1280px centered, with ~48–100px horizontal gutter
- **Column pattern**: 12-column implied, but practical layouts use 2-up asymmetric (large headline left, supporting text right), 1-up full-bleed (hero, video), or staggered single-portrait placement (service cards sit in varying grid positions creating the "constellation" feel)
- **Footer grid**: 4 equal columns on desktop, collapses to single column accordion on mobile

### Whitespace Philosophy
Mastercard treats whitespace as structure, not absence. A typical service section has:
- A ghost headline occupying the top ~40% of the section (mostly empty cream)
- A single circular portrait positioned ~60% down, asymmetric to left or right
- ~300–500px of blank canvas between the portrait and the next section
This deliberate emptiness tells the eye "slow down, read one thing at a time" — the opposite of dense dashboard UIs.

### Border Radius Scale

| Radius | Use |
|--------|-----|
| 3–6px | Tiny decorative elements, cookie banner micro-chips |
| 20px | Primary and secondary body CTAs (the signature button radius) |
| 24px | Consent/orange pill buttons, modal inner chips |
| 40px | Hero media frames, large section container corners, H2 pill labels |
| 50% | Circular portraits, icon-only buttons, satellite CTAs |
| 99px / 999px / 1000px | Full pill shapes — navigation, carousel cards, footer country selector, primary inline chips |

The scale is unusual: most systems use 4/8/12/16. Mastercard skips those and commits to **either small (≤6), medium-large (20–40), or full-pill (99+)**. The middle ground of 8–12 is absent, which is why the UI feels either "precise and utility" or "soft and editorial" with no in-between.

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 | No shadow | The default — 95% of surfaces sit directly on cream canvas |
| 1 | `rgba(0, 0, 0, 0.04) 0px 4px 24px 0px` | Floating nav pill — barely-there lift |
| 2 | `rgba(0, 0, 0, 0.08) 0px 24px 48px 0px` | Hero media frames, elevated cards — a soft large-radius halo rather than a hard drop |
| 3 | `rgba(0, 0, 0, 0.25) 0px 70px 110px 0px` | Rare; dramatic elevation on a feature tile |

### Shadow Philosophy
Mastercard uses shadows as **atmospheric cushioning**, not directional light. The Level 2 shadow has a 48px spread and only 8% opacity — it barely exists as dark pixels but creates a "the card is breathing above the canvas" feel. There are almost no hard-edged, tight shadows anywhere in the system. Border lines are preferred over shadows for functional delineation (form inputs, footer divider).

### Decorative Depth
- **Orbital arcs** (Light Signal Orange, ~1px): trace connective paths across sections
- **Ghost watermark headlines**: cream-on-cream text gives sections an almost-pressed-paper quality
- **Circle-image fade**: warm-toned photography at the edge of circular portraits dissolves into the canvas, implying soft atmospheric depth

## 7. Do''s and Don''ts

### Do
- Use Canvas Cream (`#F3F0EE`) as the default body background — never pure white
- Mask service/feature imagery as perfect circles, not rectangles or rounded rectangles
- Attach a white satellite CTA to the bottom-right of each circular portrait
- Set headlines in MarkForMC weight 500 with -2% letter-spacing
- Use weight 450 (not 400) for body paragraphs
- Keep primary CTAs as Ink Black pills (20px radius) with cream text
- Use Signal Orange only on consent, legal, or compliance actions
- Float the nav as a rounded white pill below the viewport top, not flush at y=0
- Build page rhythm from three surface tones: canvas cream → lifted cream → ink footer
- Use thin Light Signal Orange arcs between service cards to imply connection

### Don''t
- Don''t use pure white as a page background — it breaks the warm editorial tone
- Don''t round image frames at 8–16px — Mastercard either uses full-pill, 40px, or full-circle. In-between radii look generic
- Don''t use Signal Orange for marketing CTAs — it reads as cookie-consent orange and dilutes the legal color signal
- Don''t mix typefaces — no serif accent, no script, no secondary display font
- Don''t crowd the nav with more than six top-level links — the pill is meant to feel airy
- Don''t drop hard shadows — all elevation should use 48px+ spread and ≤10% opacity
- Don''t use uppercase for anything larger than the 14px eyebrow label
- Don''t omit the tiny accent dot before eyebrow labels — it''s the identity
- Don''t place circular portraits on a grid — their magic comes from asymmetric placement

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | ≤ 767px | Nav pill shows logo + menu + search only; primary links hide behind hamburger; service portraits stack single-column centered; hero headline drops from 64px to ~40px; footer columns collapse into a vertical accordion |
| Tablet | 768–1023px | Nav pill shows 2–3 primary links truncated; service portraits arrange 2-up; hero headline ~48px |
| Desktop | ≥ 1024px | Full nav with 5 primary links centered; service portraits asymmetrically placed with decorative orbital lines; hero headline 64px |
| Wide | ≥ 1440px | Content max-width caps at ~1280px; gutters grow symmetrically; orbital lines extend further |

### Touch Targets
All interactive elements comfortably exceed 44×44px. The satellite CTA (circle + arrow) is ~50–60px. The nav pill buttons are ~48px tall. Mobile hamburger and search are 48×48px. No link or button drops below 40px in any breakpoint.

### Collapsing Strategy
- **Nav**: full pill → compact pill with hamburger. Pill shape is preserved across breakpoints — always rounded, always floating.
- **Service grid**: asymmetric constellation → 2-up → 1-up stack. Orbital arcs are removed on mobile (they only work with asymmetric placement).
- **Spacing**: section vertical padding compresses from 128px to 48px on mobile.
- **Content**: two-column hero (headline left / supporting text right) becomes stacked (headline on top, supporting text below).
- **Footer**: 4 columns → 1 column accordion with chevron toggles per section.

### Image Behavior
Circular portraits scale proportionally (maintaining the perfect circle at every size). Hero video frames maintain their 40px radius at every breakpoint, but the frame itself shrinks with the viewport. Lazy loading is standard with a cream-tinted blur-up placeholder, preserving the palette during load.

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: "Ink Black (`#141413`) — the warm near-black used for primary pill buttons and footer"
- Background: "Canvas Cream (`#F3F0EE`) — warm putty body canvas, never pure white"
- Lifted surface: "Lifted Cream (`#FCFBFA`) — one step lighter than canvas for nested sections"
- Heading text: "Ink Black (`#141413`)"
- Body text: "Ink Black (`#141413`) at weight 450"
- Muted text: "Slate Gray (`#696969`)"
- Signal / Consent: "Signal Orange (`#CF4500`) — reserve for cookie consent and legal actions"
- Accent arc: "Light Signal Orange (`#F37338`) — orbital decorative lines only"
- Border / Outline: "Ink Black at 1.5px for pill buttons; 1px at low opacity elsewhere"
- Footer: "Ink Black (`#141413`) with White text"

### Example Component Prompts
- "Create a circular portrait card 300px in diameter, with a square photograph cropped to a perfect circle. Attach a 56px white satellite button with a dark arrow icon at the bottom-right, so it protrudes ~40% outside the portrait. Below the portrait, add an eyebrow label with a Light Signal Orange dot and uppercase ''SERVICES'' text in MarkForMC weight 700 at 14px. Below the eyebrow, set a 24px / weight 500 title in Ink Black."
- "Design a primary CTA button: Ink Black (`#141413`) background, Canvas Cream (`#F3F0EE`) text, 20px border-radius, 6px vertical and 24px horizontal padding, MarkForMC font at 16px weight 500 with -2% letter-spacing."
- "Build a floating navigation pill: white background with `rgba(0, 0, 0, 0.04) 0px 4px 24px 0px` shadow, 999px border-radius, ~16px vertical and 40px horizontal internal padding. Position it 24px below the viewport top, centered, with the Mastercard logo at the left, five primary links centered with 48px gap, and a circular 48px search button at the right."
- "Create a hero media frame: 40px border-radius on all corners, full viewport width minus 48px gutters, ~60% viewport height, dark background for video content. Place it directly on the cream canvas with no shadow."
- "Design a footer: Ink Black (`#141413`) background, white text, 4-column link grid with uppercase muted column headers at 14px weight 700 +4% tracking. Include a large conversational H2 above the grid, a 1px white-at-30%-opacity horizontal divider below, and a bottom row with copyright, legal small-print links, a pill-shaped country selector, and four social icons."

### Iteration Guide
When refining existing screens generated with this design system:
1. Focus on ONE component at a time — don''t redesign multiple surfaces in parallel
2. Reference specific color names AND hex codes from this document
3. Use natural language ("warm putty cream", "stadium pill", "circular portrait with satellite CTA") alongside technical values
4. Describe the desired "feel" (editorial, soft, institutional) alongside specific measurements
5. When in doubt, reach for one of three radii: 20px (buttons), 40px (hero/stadium), or 999px (pill/nav)
6. Default backgrounds to Canvas Cream (`#F3F0EE`), not white — this single change shifts the entire mood toward Mastercard

### Known Gaps
- The live page uses MarkForMC, a proprietary licensed typeface. Sofia Sans is the closest open-source substitute and is listed in Mastercard''s own fallback stack.
- Tablet breakpoint specifics (768–1023px) were inferred from desktop and mobile captures; intermediate layouts may vary per section.
- The exact "whisper" cream tone used for ghost-watermark headlines behind circular portraits reads between `#E8E2DA` and `#D1CDC7` in captures; the precise value varies per section.
- Third-party consent orange (`#CF4500`) is Mastercard''s documented consent signal and should not be confused with any marketing CTA color.
- The Mastercard logo mark (red `#EB001B` + yellow `#F79E1B`) is a brand asset, not a UI palette entry.
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
((select id from d), 'other', 'Design System Inspired by Mastercard', 'other', '# Design System Inspired by Mastercard', '{"sourcePath":"docs/design-md/mastercard/DESIGN.md","category":"other"}'::jsonb, 0.75, 1),
((select id from d), 'overview', '1. Visual Theme & Atmosphere', 'overview', '## 1. Visual Theme & Atmosphere

Mastercard''s experience reads like a warm, editorial magazine built from soft stone and signal orange. The canvas is a muted putty-cream (`#F3F0EE`) — not white, not gray, but a color that feels like the paper of a premium annual report. On top of that canvas, everything that matters is shaped like a stadium, a pill, or a perfect circle. The dominant visual gesture is the **oversized radius**: heroes carry 40-point corners, cards go fully pill-shaped, service images are cropped into circular orbits, and buttons either complete the pill or fit snugly at 20 points. There are almost no sharp corners anywhere on the page.

The second gesture is **orbit and trajectory**. Circular image masks don''t sit still — they''re connected by thin, hand-drawn-feeling orange arcs that span entire viewport widths, implying a constellation of services rather than a list. Each circle has a small attached "satellite" — a white micro-CTA holding an arrow icon — docked onto its perimeter like a moon. This is the most distinctive thing about Mastercard''s current design language: the circles feel like they''re in motion even though the page is still.

Typography is rendered entirely in **MarkForMC**, Mastercard''s proprietary geometric sans. Headlines are set at a medium weight (500) with tight negative letter-spacing (-2%), giving them confidence without shouting. Body copy runs at the same family in a slightly lighter weight (450) — a weight you rarely see on the web, chosen because it reads softer than regular 400 without feeling thin. The whole system — warm cream surfaces, pill shapes, circular portraits, traced-orange orbits, black CTAs — feels simultaneously institutional (a 60-year-old payments network) and editorial (a modern brand magazine), which is exactly the tension Mastercard wants to hold.

**Key Characteristics:**
- Warm cream canvas (`#F3F0EE`) replaces traditional white — every surface is tinted, never sterile
- Extreme border-radius as design language: 40px, 99px, 1000px dominate; anything square is a cookie-banner third-party
- Circular image portraits with attached white satellite-CTAs and traced-orange orbital paths
- Ghost "watermark" headlines (cream-on-cream text at heading scale) layered behind circle portraits
- Black primary CTAs with 20px radius in the body — the cookie-banner orange is kept to consent flows
- Floating pill-shaped navigation that docks below the viewport top with rounded shoulders
- Eyebrow labels with a tiny accent dot + uppercase bold tracking — used as the section-category signal
- Dark warm-black footer (`#141413`) with four-column link layout and large conversational headline', '{"sourcePath":"docs/design-md/mastercard/DESIGN.md","category":"overview"}'::jsonb, 0.75, 2),
((select id from d), 'colors', '2. Color Palette & Roles', 'colors', '## 2. Color Palette & Roles

### Primary
- **Mastercard Red** (`#EB001B`): The left circle of the Mastercard mark — used only in the brand logo, never as a UI color.
- **Mastercard Yellow** (`#F79E1B`): The right circle of the Mastercard mark — used only in the brand logo, never as a UI color.
- **Ink Black** (`#141413`): The warm near-black used for primary CTAs, headline text on cream, and the footer surface. Slightly warm (the `13` blue value pulls toward the cream) so it never feels jet-black on the warm canvas.

### Secondary & Accent
- **Signal Orange** (`#CF4500`): The burnt/rust CTA orange used on consent actions and eyebrow dots. Deeper than the brand yellow, brighter than ink — it''s the page''s single aggressive color and must be used sparingly.
- **Light Signal Orange** (`#F37338`): A lighter carroty orange used for carousel active indicators and decorative orbital arcs. Always acts as an attention cue, never as body color.
- **Clay Brown** (`#9A3A0A`): The deep rust used for secondary link-style buttons (e.g., cookie details). Sits between ink and signal orange.

### Surface & Background
- **Canvas Cream** (`#F3F0EE`): The page canvas. Warm, putty-toned, the default body background. All editorial sections sit on this.
- **Lifted Cream** (`#FCFBFA`): One step lighter than canvas — used for nested "raised" sections that want to feel like paper laid on paper.
- **White** (`#FFFFFF`): Reserved for the floating navigation pill, modal cards, secondary button fills, and small satellite-CTA circles attached to image portraits.
- **Soft Bone** (`#F4F4F4`): A cool-gray alternative surface used inside a handful of component subregions.

### Neutrals & Text
- **Ink Black** (`#141413`): Primary headline and body text color.
- **Charcoal** (`#262627`): A slightly softer black used for some text alternates.
- **Slate Gray** (`#696969`): Muted secondary text — eyebrow label alternative, disabled states, "Privacy Choices" bottom-row text.
- **Granite** (`#555555`) and **Graphite** (`#565656`): Deeper gray for inline body accents and link alternates.
- **Dust Taupe** (`#D1CDC7`): Very muted cream-gray used for disabled or "whisper" text (e.g., placeholder-like empty state labels). Low contrast on cream; use only for subdued content.

### Semantic & Accent
- **Link Blue** (`#3860BE`): A deep, slightly dusty blue used for inline links and informational callouts. Saturated enough to read as a link without being neon.
- **Priceless Red + Yellow**: The full-color Mastercard logo mark is the only place the brand''s red and yellow appear together; they lock the identity to the page without acting as a UI palette.

### Gradient System
Mastercard uses no programmatic gradients in the core UI. The visual impression of "gradient" comes from two places:
- **Circular image portraits** where a warm-orange photo subject (a card, a sunflower, a beverage) fades to the cream canvas at its edge
- **Deep card shadows** on elevated content (`rgba(0,0,0,0.08) 0px 24px 48px`) that create a soft halo beneath pill-shaped media', '{"sourcePath":"docs/design-md/mastercard/DESIGN.md","category":"colors"}'::jsonb, 0.75, 3),
((select id from d), 'typography', '3. Typography Rules', 'typography', '## 3. Typography Rules

### Font Family
- **Primary**: `MarkForMC` — Mastercard''s proprietary geometric sans. Every headline, body paragraph, button, nav link, and footer link on the page.
- **Secondary**: `MarkOffcForMC` — an "Official" cut used in a minority of contexts (legal text, some forms).
- **Fallback stack**: `SofiaSans, Arial, sans-serif` — Sofia Sans is a reasonable open-source stand-in; Arial is the final web-safe fallback.

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| H1 (hero) | 64px | 500 | 64px | -1.28px (-2%) | Set to `1:1` line-height for very tight vertical rhythm on multi-line hero |
| H2 (section) | 36px | 500 | 44px | -0.72px (-2%) | Used in ghost-watermark headline treatments and section titles |
| H3 (card title) | 24px | 500 | 28.8px (1.2) | -0.48px (-2%) | Titles inside service/solution cards |
| H4 (subhead) | 14px | 700 | 18.2px (1.3) | normal | Rarely used in marketing surfaces |
| Eyebrow (H5) | 14px | 700 | 14px | 0.56px (+4%) | Uppercase, paired with a tiny accent dot (e.g., "• SERVICES") |
| Body paragraph | 16px | 450 | 22.4px (1.4) | normal | The half-step 450 weight is MarkForMC''s signature — softer than 500, firmer than 400 |
| Nav link / Button label | 16px | 500 | 16px | -0.48px (-3%) | Tight, compact, no text-transform |
| Footer link | 14px | 450 | ~20px | normal | Lighter weight on dark footer for airier density |
| Footer column header | 12–14px | 700 | 14px | 0.56px (+4%) | Uppercase, muted gray, short tracking |

### Principles
- **Weight 450 is load-bearing**. Most brands use 400/500/700; Mastercard uses 450 for body copy, which creates an unusually soft reading tone. Replacing it with 400 flattens the identity.
- **Tight negative tracking on headlines** (-2%) gives display text its editorial density — the words lock together rather than breathe.
- **Uppercase tracking only on the eyebrow scale** (14px / 700 / +4% tracking). Don''t use uppercase anywhere else; no shouty section titles.
- **One-font system**. Resist the urge to add a second typeface for contrast. The contrast comes from scale, weight, and letter-spacing, not from a serif or display accent.
- **Line-height ratio drops with size**. H1 is 1:1, H3 is 1.2, body is 1.4. Tight display, comfortable reading.

### Note on Font Substitutes
MarkForMC is proprietary and licensed. When rebuilding a matching aesthetic without access to the original:
- **Sofia Sans** (Google Fonts) is the closest open-source match — it''s already in Mastercard''s declared fallback stack.
- **Inter** at weights 450/500/700 works as a generic stand-in; expect slightly taller x-height and looser letter shapes.
- **Neue Haas Grotesk** or **Geist** can approximate the geometric feel for commercial projects.
- Whichever substitute is used, preserve the **-2% letter-spacing on headlines** and the **450 body weight** (use `font-weight: 450` with variable fonts, or substitute `font-weight: 400` and tighten the letter-spacing by ~-0.5% to compensate).', '{"sourcePath":"docs/design-md/mastercard/DESIGN.md","category":"typography"}'::jsonb, 0.75, 4),
((select id from d), 'components', '4. Component Stylings', 'components', '## 4. Component Stylings

### Buttons

**Primary — Ink Pill**
- Background: Ink Black (`#141413`)
- Text: Canvas Cream (`#F3F0EE`) — not pure white
- Border: 1.5px solid Ink Black (same as bg, creates crisp edge)
- Radius: 20px
- Padding: 6px 24px
- Font: MarkForMC 16px / weight 500 / letter-spacing -0.32px
- Default: as above; solid warm-black pill on cream canvas
- Active / pressed: subtle inward-shrink or 2px offset (not a hover variant)
- Use for: all marketing CTAs in the page body ("Learn more", "Explore", "Discover")

**Secondary — Outlined Pill**
- Background: White (`#FFFFFF`)
- Text: Ink Black (`#141413`)
- Border: 1.5px solid Ink Black
- Radius: 20px
- Padding: 6px 24px
- Font: MarkForMC 16px / weight 450 / line-height 20.8px
- Default: white-on-cream pill with crisp ink outline
- Active / pressed: subtle compression
- Use for: secondary actions paired with a primary, or standalone utility CTAs

**Consent / Signal — Orange Pill**
- Background: Signal Orange (`#CF4500`)
- Text: White (`#FFFFFF`)
- Border: 0
- Radius: 24px
- Padding: 1px 30px (very tight vertical, wide horizontal)
- Font: MarkForMC 13px / weight 400 / letter-spacing 0.13px
- Default: as above; bright rust pill with white text
- Use for: cookie consent, privacy preference, and other legally-distinct confirmations. **Do not** use this orange for marketing CTAs — it reads as a compliance color.

**Satellite — Circular Micro-CTA**
- Background: White (`#FFFFFF`)
- Icon: Ink Black arrow (`→`) at ~20px
- Border: none
- Radius: 50% (perfect circle)
- Size: ~50–60px diameter
- Shadow: none or very subtle (the portrait''s shadow carries the elevation)
- Default: docks onto the bottom-right edge of a circular portrait, protruding partway outside the portrait''s circle
- Use for: the primary entry point into service/solution cards; always paired with a circular portrait

**Icon-Only Circle Button (carousel, play/pause)**
- Background: transparent or white
- Icon: 10–20px centered
- Border: 1px solid Ink Black (when on cream) or none (when over media)
- Radius: 50%
- Size: 40px diameter minimum for carousel controls; 80px for hero video play
- Use for: carousel pagination/play-pause, hero video play, search toggle

### Cards & Containers

**Hero Media Frame (Stadium)**
- Background: Dark video or full-bleed imagery (typically black `#000000` or `#2B2B2B` behind video)
- Radius: 40px all corners (creates a stadium shape on wide viewports)
- Width: ~full viewport minus ~48px gutter on each side
- Height: ~60–70% of viewport
- Shadow: none (sits directly on canvas)
- Corners: the extreme 40px radius on a media element is the most iconic Mastercard gesture — do not round less

**Service / Solution Portrait Card**
- Shape: Perfect circle (radius 50%) or ellipse (radius 999px / 1000px)
- Diameter: 260–340px desktop; ~220px mobile
- Image crop: square source, cropped to circle
- Attached element: White satellite circular CTA (see above) docked bottom-right, ~40% outside the portrait
- Eyebrow below: accent dot + uppercase label (e.g., "• SERVICES", "• SOLUTIONS")
- Title below: H3 (24px / weight 500 / -2% tracking), 1–2 lines max
- Decorative orbit: thin ~1px Light Signal Orange curved line spanning from this card outward to the next, implying connection

**Pill Carousel Card**
- Radius: 1000px (full pill) or 40px corners (rounded stadium)
- Width: ~40–60% of viewport
- Height: ~380–420px (portrait-pill orientation)
- Content: full-bleed photography with small overlaid chip labels
- Chip inside: White pill (~ 999px radius), Ink Black text, padding 8px 20px, used for category tags like "Story"
- Large inline CTA inside: Ink Pill button, oversized (padding 16px 40px, radius 40px)

**Ghost Watermark Text Block**
- Font: MarkForMC 72–128px / weight 500 / tight -2% tracking
- Color: Canvas Cream slightly darkened (`#E8E2DA` or similar — cream-on-cream)
- Position: layered behind portrait circles, bleeding off the viewport edge
- Purpose: sets section theme without competing with foreground copy

### Inputs & Forms
Minimal form surface on the marketing page. The search input in the nav header is:
- Initial state: a 48px circular button with a magnifier icon
- Expanded state: horizontal input field, border `1px solid` Ink Black at ~50% opacity, radius 999px, padding 12px 24px, white background

**Country/language selector (footer)**
- Background: Ink Black (same as footer)
- Text: White
- Border: 1px solid `rgba(255,255,255,0.4)`
- Radius: 999px (full pill)
- Icon: downward chevron on the right

### Navigation

**Floating Nav Pill (desktop)**
- Container: white-to-translucent-white pill floating below the very top of the viewport with a ~24px top margin
- Radius: 999px / 1000px (full pill)
- Padding: ~16px 40px internal
- Shadow: very soft (`rgba(0, 0, 0, 0.04) 0px 4px 24px 0px`) — just enough to lift it off the cream canvas
- Content: Mastercard logo left, primary link group center ("For you", "For business", "For the world", "For innovators", "News and trends"), search icon right
- Link spacing: ~48–56px gap between primary links
- Link style: Ink Black, weight 500, 16px, no underline, no pill surround until active

**Mobile Nav**
- The same pill shape but collapsed to: logo + hamburger menu button + search icon only
- Menu opens into a full-screen overlay with the primary links stacked vertically

### Image Treatment

- **Aspect ratios used**: 1:1 (all service portraits — cropped to circle), ~3:4 or ~4:5 (carousel pill cards), 16:9 or wider (hero video frame)
- **Full-bleed vs padded**: Hero is viewport-wide with gutters; service portraits are always centered in their column with generous whitespace around; footer imagery is rare
- **Masking**: Aggressive circular masking is the defining treatment — square source images are cropped to perfect circles of matching diameter. Never use rectangular service imagery.
- **Lazy loading**: Standard `loading="lazy"` with a soft blur-up transition from a cream-tinted placeholder, preserving the warm palette during load

### Decorative Orbital Lines

A signature motif: thin (~1–1.5px) single-weight curved lines in Light Signal Orange (`#F37338`) tracing arcs between circular portraits. These lines:
- Imply connection between service cards without literal arrows
- Span widths from ~200px up to full-viewport arcs
- Feel hand-drawn (subtle irregularity) rather than perfect CSS curves
- Appear only in sections with circular portrait content — never on pill sections, never in the footer

### Footer

- Background: Ink Black (`#141413`)
- Text: White
- Padding: 48px horizontal 100px / bottom 148px (very tall bottom space)
- Structure: large conversational H2 ("We''re always here when you need us") left-aligned, then a 4-column link grid below
- Column headers: uppercase, muted, weight 700, letter-spacing +4%
- Link rows: white, weight 450, 14px; entries prefixed with a small icon (support bubble, card, map pin, question mark) for the "NEED HELP?" column
- External link marker: a small upper-right arrow (`↗`) after link text
- Bottom row (below a 1px white-at-opacity divider): copyright + privacy small-print + country-language pill dropdown + four social icons (LinkedIn, Facebook, X, YouTube)', '{"sourcePath":"docs/design-md/mastercard/DESIGN.md","category":"components"}'::jsonb, 0.75, 5),
((select id from d), 'layout', '5. Layout Principles', 'layout', '## 5. Layout Principles

### Spacing System
- **Base unit**: 8px (confirmed by dembrandt extraction and computed styles)
- **Scale**: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 (powers of 8)
- **Section vertical padding**: ~96–128px between major sections on desktop; ~48–64px on mobile
- **Card internal padding**: 32–40px on desktop, ~24px on mobile
- **Nav top margin**: ~24px from viewport top (the pill floats, doesn''t touch)

### Grid & Container
- **Max content width**: ~1200–1280px centered, with ~48–100px horizontal gutter
- **Column pattern**: 12-column implied, but practical layouts use 2-up asymmetric (large headline left, supporting text right), 1-up full-bleed (hero, video), or staggered single-portrait placement (service cards sit in varying grid positions creating the "constellation" feel)
- **Footer grid**: 4 equal columns on desktop, collapses to single column accordion on mobile

### Whitespace Philosophy
Mastercard treats whitespace as structure, not absence. A typical service section has:
- A ghost headline occupying the top ~40% of the section (mostly empty cream)
- A single circular portrait positioned ~60% down, asymmetric to left or right
- ~300–500px of blank canvas between the portrait and the next section
This deliberate emptiness tells the eye "slow down, read one thing at a time" — the opposite of dense dashboard UIs.

### Border Radius Scale

| Radius | Use |
|--------|-----|
| 3–6px | Tiny decorative elements, cookie banner micro-chips |
| 20px | Primary and secondary body CTAs (the signature button radius) |
| 24px | Consent/orange pill buttons, modal inner chips |
| 40px | Hero media frames, large section container corners, H2 pill labels |
| 50% | Circular portraits, icon-only buttons, satellite CTAs |
| 99px / 999px / 1000px | Full pill shapes — navigation, carousel cards, footer country selector, primary inline chips |

The scale is unusual: most systems use 4/8/12/16. Mastercard skips those and commits to **either small (≤6), medium-large (20–40), or full-pill (99+)**. The middle ground of 8–12 is absent, which is why the UI feels either "precise and utility" or "soft and editorial" with no in-between.', '{"sourcePath":"docs/design-md/mastercard/DESIGN.md","category":"layout"}'::jsonb, 0.75, 6),
((select id from d), 'elevation', '6. Depth & Elevation', 'elevation', '## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 | No shadow | The default — 95% of surfaces sit directly on cream canvas |
| 1 | `rgba(0, 0, 0, 0.04) 0px 4px 24px 0px` | Floating nav pill — barely-there lift |
| 2 | `rgba(0, 0, 0, 0.08) 0px 24px 48px 0px` | Hero media frames, elevated cards — a soft large-radius halo rather than a hard drop |
| 3 | `rgba(0, 0, 0, 0.25) 0px 70px 110px 0px` | Rare; dramatic elevation on a feature tile |

### Shadow Philosophy
Mastercard uses shadows as **atmospheric cushioning**, not directional light. The Level 2 shadow has a 48px spread and only 8% opacity — it barely exists as dark pixels but creates a "the card is breathing above the canvas" feel. There are almost no hard-edged, tight shadows anywhere in the system. Border lines are preferred over shadows for functional delineation (form inputs, footer divider).

### Decorative Depth
- **Orbital arcs** (Light Signal Orange, ~1px): trace connective paths across sections
- **Ghost watermark headlines**: cream-on-cream text gives sections an almost-pressed-paper quality
- **Circle-image fade**: warm-toned photography at the edge of circular portraits dissolves into the canvas, implying soft atmospheric depth', '{"sourcePath":"docs/design-md/mastercard/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', '7. Do''s and Don''ts', 'dos_and_donts', '## 7. Do''s and Don''ts

### Do
- Use Canvas Cream (`#F3F0EE`) as the default body background — never pure white
- Mask service/feature imagery as perfect circles, not rectangles or rounded rectangles
- Attach a white satellite CTA to the bottom-right of each circular portrait
- Set headlines in MarkForMC weight 500 with -2% letter-spacing
- Use weight 450 (not 400) for body paragraphs
- Keep primary CTAs as Ink Black pills (20px radius) with cream text
- Use Signal Orange only on consent, legal, or compliance actions
- Float the nav as a rounded white pill below the viewport top, not flush at y=0
- Build page rhythm from three surface tones: canvas cream → lifted cream → ink footer
- Use thin Light Signal Orange arcs between service cards to imply connection

### Don''t
- Don''t use pure white as a page background — it breaks the warm editorial tone
- Don''t round image frames at 8–16px — Mastercard either uses full-pill, 40px, or full-circle. In-between radii look generic
- Don''t use Signal Orange for marketing CTAs — it reads as cookie-consent orange and dilutes the legal color signal
- Don''t mix typefaces — no serif accent, no script, no secondary display font
- Don''t crowd the nav with more than six top-level links — the pill is meant to feel airy
- Don''t drop hard shadows — all elevation should use 48px+ spread and ≤10% opacity
- Don''t use uppercase for anything larger than the 14px eyebrow label
- Don''t omit the tiny accent dot before eyebrow labels — it''s the identity
- Don''t place circular portraits on a grid — their magic comes from asymmetric placement', '{"sourcePath":"docs/design-md/mastercard/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', '8. Responsive Behavior', 'responsive_guidelines', '## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | ≤ 767px | Nav pill shows logo + menu + search only; primary links hide behind hamburger; service portraits stack single-column centered; hero headline drops from 64px to ~40px; footer columns collapse into a vertical accordion |
| Tablet | 768–1023px | Nav pill shows 2–3 primary links truncated; service portraits arrange 2-up; hero headline ~48px |
| Desktop | ≥ 1024px | Full nav with 5 primary links centered; service portraits asymmetrically placed with decorative orbital lines; hero headline 64px |
| Wide | ≥ 1440px | Content max-width caps at ~1280px; gutters grow symmetrically; orbital lines extend further |

### Touch Targets
All interactive elements comfortably exceed 44×44px. The satellite CTA (circle + arrow) is ~50–60px. The nav pill buttons are ~48px tall. Mobile hamburger and search are 48×48px. No link or button drops below 40px in any breakpoint.

### Collapsing Strategy
- **Nav**: full pill → compact pill with hamburger. Pill shape is preserved across breakpoints — always rounded, always floating.
- **Service grid**: asymmetric constellation → 2-up → 1-up stack. Orbital arcs are removed on mobile (they only work with asymmetric placement).
- **Spacing**: section vertical padding compresses from 128px to 48px on mobile.
- **Content**: two-column hero (headline left / supporting text right) becomes stacked (headline on top, supporting text below).
- **Footer**: 4 columns → 1 column accordion with chevron toggles per section.

### Image Behavior
Circular portraits scale proportionally (maintaining the perfect circle at every size). Hero video frames maintain their 40px radius at every breakpoint, but the frame itself shrinks with the viewport. Lazy loading is standard with a cream-tinted blur-up placeholder, preserving the palette during load.', '{"sourcePath":"docs/design-md/mastercard/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', '9. Agent Prompt Guide', 'other', '## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: "Ink Black (`#141413`) — the warm near-black used for primary pill buttons and footer"
- Background: "Canvas Cream (`#F3F0EE`) — warm putty body canvas, never pure white"
- Lifted surface: "Lifted Cream (`#FCFBFA`) — one step lighter than canvas for nested sections"
- Heading text: "Ink Black (`#141413`)"
- Body text: "Ink Black (`#141413`) at weight 450"
- Muted text: "Slate Gray (`#696969`)"
- Signal / Consent: "Signal Orange (`#CF4500`) — reserve for cookie consent and legal actions"
- Accent arc: "Light Signal Orange (`#F37338`) — orbital decorative lines only"
- Border / Outline: "Ink Black at 1.5px for pill buttons; 1px at low opacity elsewhere"
- Footer: "Ink Black (`#141413`) with White text"

### Example Component Prompts
- "Create a circular portrait card 300px in diameter, with a square photograph cropped to a perfect circle. Attach a 56px white satellite button with a dark arrow icon at the bottom-right, so it protrudes ~40% outside the portrait. Below the portrait, add an eyebrow label with a Light Signal Orange dot and uppercase ''SERVICES'' text in MarkForMC weight 700 at 14px. Below the eyebrow, set a 24px / weight 500 title in Ink Black."
- "Design a primary CTA button: Ink Black (`#141413`) background, Canvas Cream (`#F3F0EE`) text, 20px border-radius, 6px vertical and 24px horizontal padding, MarkForMC font at 16px weight 500 with -2% letter-spacing."
- "Build a floating navigation pill: white background with `rgba(0, 0, 0, 0.04) 0px 4px 24px 0px` shadow, 999px border-radius, ~16px vertical and 40px horizontal internal padding. Position it 24px below the viewport top, centered, with the Mastercard logo at the left, five primary links centered with 48px gap, and a circular 48px search button at the right."
- "Create a hero media frame: 40px border-radius on all corners, full viewport width minus 48px gutters, ~60% viewport height, dark background for video content. Place it directly on the cream canvas with no shadow."
- "Design a footer: Ink Black (`#141413`) background, white text, 4-column link grid with uppercase muted column headers at 14px weight 700 +4% tracking. Include a large conversational H2 above the grid, a 1px white-at-30%-opacity horizontal divider below, and a bottom row with copyright, legal small-print links, a pill-shaped country selector, and four social icons."

### Iteration Guide
When refining existing screens generated with this design system:
1. Focus on ONE component at a time — don''t redesign multiple surfaces in parallel
2. Reference specific color names AND hex codes from this document
3. Use natural language ("warm putty cream", "stadium pill", "circular portrait with satellite CTA") alongside technical values
4. Describe the desired "feel" (editorial, soft, institutional) alongside specific measurements
5. When in doubt, reach for one of three radii: 20px (buttons), 40px (hero/stadium), or 999px (pill/nav)
6. Default backgrounds to Canvas Cream (`#F3F0EE`), not white — this single change shifts the entire mood toward Mastercard

### Known Gaps
- The live page uses MarkForMC, a proprietary licensed typeface. Sofia Sans is the closest open-source substitute and is listed in Mastercard''s own fallback stack.
- Tablet breakpoint specifics (768–1023px) were inferred from desktop and mobile captures; intermediate layouts may vary per section.
- The exact "whisper" cream tone used for ghost-watermark headlines behind circular portraits reads between `#E8E2DA` and `#D1CDC7` in captures; the precise value varies per section.
- Third-party consent orange (`#CF4500`) is Mastercard''s documented consent signal and should not be confused with any marketing CTA color.
- The Mastercard logo mark (red `#EB001B` + yellow `#F79E1B`) is a brand asset, not a UI palette entry.', '{"sourcePath":"docs/design-md/mastercard/DESIGN.md","category":"other"}'::jsonb, 0.75, 10);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_1', '#F3F0EE', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_2', '#141413', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_3', '#EB001B', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_4', '#F79E1B', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_5', '#CF4500', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_6', '#F37338', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_7', '#9A3A0A', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_8', '#FCFBFA', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_9', '#FFFFFF', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_10', '#F4F4F4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_11', '#262627', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_12', '#696969', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_13', '#555555', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_14', '#565656', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_15', '#D1CDC7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_16', '#3860BE', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_17', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_18', '#2B2B2B', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md'), 'color', 'color_19', '#E8E2DA', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/mastercard/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/mastercard/DESIGN.md';

