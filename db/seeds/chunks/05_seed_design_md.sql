-- Generated seed chunk 05
-- Run 000_prepare.sql once before running these chunks.
-- Documents: 10


-- Ollama
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Ollama', 'ollama', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/ollama/DESIGN.md', null, 'seeded', '---
version: alpha
name: Ollama-design-analysis
description: |
  An almost defiantly minimal documentation-first system that treats the home page like a Markdown README — paper-white canvas, 36px center-aligned heading, a single black pill CTA, an inline terminal install snippet, and a hand-drawn llama mascot as the only ornamental element. No gradient, no hero photography, no marketing pyrotechnics. The chrome is a tiny utility palette of pure black, pure white, and three neutral grays; every interactive element is fully rounded into a pill (`{rounded.full}`); typography is SF Pro Rounded for headings paired with system sans for body and ui-monospace for code. Pricing tiers, FAQs, and "your data stays yours" guarantees all sit on the same flat canvas inside thin-border cards — the system is the documentation, and the documentation is the system.

colors:
  primary: "#000000"
  on-primary: "#ffffff"
  ink: "#000000"
  ink-deep: "#090909"
  charcoal: "#525252"
  body: "#737373"
  mute: "#a3a3a3"
  canvas: "#ffffff"
  surface-soft: "#fafafa"
  surface-card: "#ffffff"
  hairline: "#e5e5e5"
  hairline-strong: "#d4d4d4"
  on-dark: "#ffffff"
  on-dark-mute: "rgba(255,255,255,0.7)"
  surface-dark: "#171717"
  focus-ring: "rgba(59,130,246,0.5)"
  link: "#000000"
  link-mute: "#737373"
  terminal-red: "#ff5f56"
  terminal-yellow: "#ffbd2e"
  terminal-green: "#27c93f"

typography:
  display-xl:
    fontFamily: SF Pro Rounded
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.11
    letterSpacing: 0
  display-lg:
    fontFamily: SF Pro Rounded
    fontSize: 30px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  heading-lg:
    fontFamily: SF Pro Rounded
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0
  heading-md:
    fontFamily: ui-sans-serif
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  heading-sm:
    fontFamily: ui-sans-serif
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.56
    letterSpacing: 0
  body-md:
    fontFamily: ui-sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: ui-sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: ui-sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  body-sm-strong:
    fontFamily: ui-sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: 0
  caption-sm:
    fontFamily: ui-sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0
  code-md:
    fontFamily: ui-monospace
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  code-sm:
    fontFamily: ui-monospace
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  button-md:
    fontFamily: ui-sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0

rounded:
  none: 0px
  sm: 6px
  md: 8px
  lg: 12px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  section: 88px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 20px
    height: 36px
  button-primary-active:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 20px
    height: 36px
  button-pill-on-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 20px
  button-disabled:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.mute}"
    rounded: "{rounded.full}"
  search-pill:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: 8px 16px
    height: 36px
  search-pill-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 8px 16px
    height: 40px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
  install-snippet:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.code-md}"
    rounded: "{rounded.full}"
    padding: 12px 20px
    height: 48px
  command-tag:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.full}"
    padding: 6px 12px
  terminal-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.lg}"
    padding: 16px
  terminal-traffic-lights:
    rounded: "{rounded.full}"
    size: 12px
  pricing-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  feature-bullet:
    textColor: "{colors.charcoal}"
    typography: "{typography.body-sm}"
  faq-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 16px 0px
  link-inline:
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  link-mute:
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
  primary-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.none}"
    height: 56px
  footer-section:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.none}"
    padding: 32px 24px
  cta-strip-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.heading-lg}"
    rounded: "{rounded.lg}"
    padding: 24px 32px
---

## Overview

Ollama''s site is the most aggressively under-designed marketing surface in the AI tooling space, and that is the entire point. The home page reads like a Markdown README rendered with care: a 36px center-aligned heading sits above an inline `curl` install snippet inside a soft-gray pill, a single black "Download" CTA, and a hand-drawn llama mascot as the only ornament. Everything else — automate-your-work block, "Start local. Scale cloud." pricing pair, "Your data stays yours" guarantee strip, FAQ wall on `/pricing` — sits on the same paper-white canvas (`{colors.canvas}`) with quiet `{colors.body}` neutrals carrying the prose. The system is the documentation, and the documentation is the system.

The design philosophy is geometric: every interactive element collapses to `{rounded.full}` (9999px) — buttons, search pills, install-snippet pills, text inputs, and the terminal-traffic-light dots. There are no decorative drop shadows, no gradients, no hero illustrations beyond the llama. Cards (the rare ones, on `/pricing`) use a soft `{rounded.lg}` (12px) and a 1px hairline. The single inverted moment in the entire system is the dark "Max" pricing tier — `{colors.surface-dark}` with white text — which acts as the only attention-grabbing surface in an otherwise studiously flat layout.

Typography pairs SF Pro Rounded (display headings, weight 500–600) with the operating system''s default sans (`ui-sans-serif`) for body and `ui-monospace` for code. The roundness of the heading face is the only "personality" the chrome carries — it gently echoes the `{rounded.full}` button geometry without being decorative about it.

**Key Characteristics:**
- Paper-white `{colors.canvas}` end-to-end with no surface alternation — the whole page is one continuous sheet
- Center-aligned hero with `{typography.display-xl}` SF Pro Rounded headline, no eyebrow, no subhead beyond a small "Power OpenClaw with Ollama" line under the llama
- Pill geometry everywhere: every button and pill input is `{rounded.full}`; cards use `{rounded.lg}`; nothing is sharp-cornered except section dividers
- Single-color CTA system: pure black `{colors.primary}` pills carry every action; "Get Pro" / "Get Max" inside pricing cards are the only variations
- Inline `curl` install snippet rendered as a pill with `{typography.code-md}` — the most signature element, sitting directly under the hero headline
- Terminal-mockup card with macOS traffic-light dots and inline `ollama launch openclaw` example — the home page''s only "product preview"
- Inverted dark `{component.pricing-card-dark}` for the highest-tier "Max" plan, breaking the flat-white rhythm exactly once per page

## Colors

> **Source pages:** `/` (home) and `/pricing`. The chrome palette is identical across both — only content changes.

### Brand & Accent
- **Pure Black** (`{colors.primary}` — `#000000`): the brand. Every primary CTA, every black pill, every link in the nav, and every solid icon. There is no other "brand color."
- **Ink Deep** (`{colors.ink-deep}` — `#090909`): pressed-state black for the primary pill — a single notch below pure.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): the page itself. Nearly every surface in the system.
- **Soft Surface** (`{colors.surface-soft}` — `#fafafa`): install-snippet pill background, search pill, secondary chip backgrounds, alternating row fill where one is needed.
- **Surface Dark** (`{colors.surface-dark}` — `#171717`): the dark "Max" pricing card and dark CTA strips. The single inverted surface in the system.
- **Hairline** (`{colors.hairline}` — `#e5e5e5`): 1px card border, divider line above footer, divider between FAQ rows.
- **Hairline Strong** (`{colors.hairline-strong}` — `#d4d4d4`): rare slightly stronger divider where extra separation is needed (e.g., between unrelated FAQ groups).

### Text
- **Ink** (`{colors.ink}` — `#000000`): all headlines, primary nav links, button text on light surfaces, prices on pricing cards.
- **Charcoal** (`{colors.charcoal}` — `#525252`): list-item text and disabled-state secondary copy.
- **Body** (`{colors.body}` — `#737373`): default body color for paragraph copy, FAQ answers, footer link text — the system''s most-used text color after pure black.
- **Mute** (`{colors.mute}` — `#a3a3a3`): caption text, command-line "comment" gray inside terminal mockups, lowest-emphasis utility text.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.surface-dark}`.
- **On Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.7)`): secondary copy inside the dark "Max" pricing card.

### Semantic
The system has effectively no error/success/warning palette in its public marketing surfaces — there are no validation states, no destructive flows, no banners. The only "semantic" colors are the macOS terminal traffic lights inside the terminal mockup:

- **Terminal Red** (`{colors.terminal-red}` — `#ff5f56`): close-window dot.
- **Terminal Yellow** (`{colors.terminal-yellow}` — `#ffbd2e`): minimize dot.
- **Terminal Green** (`{colors.terminal-green}` — `#27c93f`): zoom dot.

These appear only inside `{component.terminal-card}` and have no other use.

### Focus
- **Focus Ring** (`{colors.focus-ring}` — `rgba(59,130,246,0.5)`): translucent blue browser-default focus ring around interactive elements. The only blue in the system.

## Typography

### Font Family
- **SF Pro Rounded** (display headings) — Apple''s rounded geometric sans, used at weights 500 and 600 for headlines from `{typography.display-xl}` (36px) down to `{typography.heading-lg}` (24px). Falls back to `system-ui` → `-apple-system`.
- **ui-sans-serif** (body, links, buttons, captions) — the operating system''s default sans-serif. Carries every non-display text role at 12–20px. Falls back through `system-ui` and platform emoji families.
- **ui-monospace** (code, install snippet, command tags) — the OS default monospace. Used inside the terminal mockup, the inline `curl` install pill, and any inline `<code>` formatting. Falls back to SFMono-Regular → Menlo → Monaco → Consolas.

The pairing of SF Pro Rounded display + system sans body + system mono code is intentionally "stock Apple" — the design decision is to not have a typography decision. Branded display faces would compete with the system''s documentation feel.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 36px | 500 | 1.11 | 0 | Hero headline ("The easiest way to build with open models") |
| `{typography.display-lg}` | 30px | 500 | 1.2 | 0 | Major section headlines ("Pricing", "Frequently asked questions") |
| `{typography.heading-lg}` | 24px | 600 | 1.33 | 0 | Section subheading inside body ("Automate your work", "Start local. Scale cloud.") |
| `{typography.heading-md}` | 20px | 500 | 1.4 | 0 | Pricing tier name ("Free", "Pro", "Max"), card title |
| `{typography.heading-sm}` | 18px | 500 | 1.56 | 0 | FAQ question label, in-card subtitle |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body, FAQ answers, paragraph copy |
| `{typography.body-strong}` | 16px | 500 | 1.5 | 0 | Inline emphasis, primary-nav link |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Feature bullet ("Access larger models on data-center-grade hardware"), footer link |
| `{typography.body-sm-strong}` | 14px | 500 | 1.43 | 0 | Button label, pricing-card eyebrow ("Solve harder tasks, faster") |
| `{typography.caption-sm}` | 12px | 400 | 1.33 | 0 | Footer copyright row, smallest meta text |
| `{typography.code-md}` | 16px | 400 | 1.5 | 0 | Install-snippet `curl` line, in-terminal command |
| `{typography.code-sm}` | 14px | 400 | 1.43 | 0 | Terminal output line, inline `<code>` chips |
| `{typography.button-md}` | 14px | 500 | 1 | 0 | Every button label across the system |

### Principles
The typography is built for legibility at small sizes on a flat-white canvas. SF Pro Rounded''s softened terminals on the heading face do almost all of the brand expression; everything below 20px collapses into the operating system''s default sans, which renders identically to the way docs.ollama.com and the Ollama CLI''s own help text would appear in a terminal. There is almost no letter-spacing variation, no display-only weights, no italic, and the heading-to-body ratio compresses tightly (36 → 30 → 24 → 20 → 16) so the page reads as a single readable column rather than a marketing pyramid.

### Note on Font Substitutes
SF Pro Rounded is Apple-licensed and ships only on macOS/iOS. On other systems it falls back to `system-ui` (Segoe UI / Roboto / DejaVu Sans depending on platform) — Ollama explicitly accepts that the heading face will look slightly different on Windows/Linux. The closest open-source substitute is **Nunito** (rounded geometric sans, weights 500/600). For the body face, **Inter** is a near-perfect match for `system-ui` rendered metrics. For code, **JetBrains Mono** or **Fira Code** are the canonical open-source substitutes for `ui-monospace`.

## Layout

### Spacing System
- **Base unit:** 8px (with finer 2/4/6px steps available for tight inline gaps)
- **Tokens (front matter):** `{spacing.xxs}` (2px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (88px)
- **Universal section rhythm:** every page uses `{spacing.section}` (88px) as the vertical gap between major content blocks (hero → automate → start local/scale cloud → your data stays yours → get-started footer call). This is the single largest spacing token in the system and it is used liberally.
- **Card internal padding:** pricing cards sit at `{spacing.xxl}` (32px) all around; FAQ rows use `{spacing.lg}` (16px) vertical with no horizontal padding.

### Grid & Container
- **Max width:** ~720px content column on the home page (the whole page is laid out as a single narrow reading column with optional 2-column splits inside specific sections).
- **Pricing grid:** 3-up cards at desktop with a max content width of ~960px; collapses to 1-up below 768px.
- **Automate-your-work split:** desktop 50/50 left-text/right-terminal-mockup; mobile stacks vertical with the terminal below the text.
- **FAQ:** single-column stacked rows, full-width within the 720px content column.
- **Footer:** single-row of small body-sm links, center-aligned at desktop, wrapping to two rows on narrow screens.

### Whitespace Philosophy
Whitespace is the entire layout. Sections are separated by 88px of plain white air, never by decorative dividers, never by colored bands. Inside a section, content sits in a tight reading column with no decorative columns, callout boxes, or lifted cards. The site treats the page as a long-form Markdown document, and the air between sections is the equivalent of a blank line in Markdown source.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Hero, automate-your-work, your-data-stays-yours, footer — the dominant treatment across the page |
| 1 — Hairline border | 1px solid `{colors.hairline}` | Pricing cards, FAQ row dividers, terminal mockup card |
| 2 — Inverted dark | `{colors.surface-dark}` fill | Dark "Max" pricing card and dark CTA strip — the system''s only "elevated" surfaces use color, not shadow |

The system has no drop-shadow elevation at all. Nothing lifts, nothing floats, nothing layers. The only depth cue beyond hairline borders is the single dark surface used on the highest-tier pricing card to draw attention to it.

### Decorative Depth
The site has effectively zero decorative depth in the traditional sense. The "depth" comes entirely from two recurring devices:
- **The hand-drawn llama mascot** — appearing once at the top of the hero, once at the top of each pricing card, and once next to the lock icon in the "Your data stays yours" section. It is the only illustration in the system.
- **A single line-drawn lock icon** — used in the data-privacy section. Stroke-only, no fill, drawn in `{colors.ink}`.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Nav, footer, FAQ row dividers — flat structural lines |
| `{rounded.sm}` | 6px | Inline code chips, command tags |
| `{rounded.md}` | 8px | Rare medium-radius surfaces (e.g., dropdown panels) |
| `{rounded.lg}` | 12px | Pricing cards, terminal mockup card |
| `{rounded.full}` | 9999px | Every button, every pill input, install-snippet pill, search pill, traffic-light dots |

The dominant shape vocabulary is just two values: pills (`{rounded.full}`) for everything interactive and 12px (`{rounded.lg}`) for the few cards in the system. There are no medium-radius "soft cards" — surfaces are either pills or rectangles with corners large enough to read as deliberately soft.

### Photography Geometry
There is no photography. The only image-like elements are:
- **The llama mascot** — a hand-drawn line illustration, ~80–120px on the hero, ~32–48px when it appears as a pricing-card eyebrow icon.
- **The lock icon** — single stroke line drawing in the privacy section.
- **macOS traffic-light dots** — three filled circles at 12px (`{rounded.full}`) inside the terminal mockup card.

## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal Ollama CTA
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `8px 20px`, height `36px`, rounded `{rounded.full}`.
- Used for "Download" (top nav), "Sign in" (top nav, paired with Download), "Create account", "Get Pro", "Get Max" — every primary action in the system.
- Pressed state lives in `button-primary-active` — background drops to `{colors.ink-deep}`.

**`button-secondary`** — outline alternative on light canvas
- Background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline-strong}`, type `{typography.button-md}`, padding `8px 20px`, height `36px`, rounded `{rounded.full}`.
- Used as a secondary affordance — e.g., the "Sign in" pill in the top nav when paired with the black "Download" pill, "See more apps →" arrow link in compact form.

**`button-pill-on-dark`** — white pill on dark surface
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-md}`, rounded `{rounded.full}`.
- Sits inside the dark "Max" pricing card as the "Get Max" CTA — inverts the standard primary so the dark card itself becomes the visual anchor and the white pill reads as the CTA.

**`button-disabled`**
- Background `{colors.surface-soft}`, text `{colors.mute}`, rounded `{rounded.full}` — flat soft gray.

### Inputs & Forms

**`search-pill`** + **`search-pill-focused`**
- Default: background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.body-sm}`, padding `8px 16px`, height `36px`, rounded `{rounded.full}`. Anchored in the center of the primary nav with a small magnifier icon prefix and "Search models" placeholder.
- Focused: background flips to `{colors.canvas}` and the browser-default `{colors.focus-ring}` translucent blue ring appears.

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.canvas}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `8px 16px`, height `40px`, rounded `{rounded.full}`.
- Focused: 1px ink border + browser-default focus ring.

**`install-snippet`** — the signature install pill
- Background `{colors.surface-soft}`, text `{colors.ink}` rendered in `{typography.code-md}`, padding `12px 20px`, height `48px`, rounded `{rounded.full}`.
- Contains the literal `curl -fsSL https://ollama.com/install.sh | sh` install command with a small copy-icon at the right edge. Sits directly below the hero headline as the page''s most prominent "CTA."

**`command-tag`** — small inline command chip
- Background `{colors.surface-soft}`, text `{colors.ink}` in `{typography.code-sm}`, padding `6px 12px`, rounded `{rounded.full}`.
- Used inside the "Automate your work" section for the `ollama launch openclaw` example chip and similar inline-command demos.

### Cards & Containers

**`terminal-card`** — the home page''s only "product preview"
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.lg}` (16px), rounded `{rounded.lg}`.
- Header: three `{component.terminal-traffic-lights}` dots (red/yellow/green at 12px) anchored to the top-left of the card.
- Body: terminal output rendered in `{typography.code-sm}` with comments in `{colors.mute}` and active commands in `{colors.ink}`.

**`terminal-traffic-lights`**
- Three 12px filled circles at `{rounded.full}`: `{colors.terminal-red}`, `{colors.terminal-yellow}`, `{colors.terminal-green}`. Sits as a row of three with `{spacing.xs}` gaps between dots inside the terminal card header.

**`pricing-card`** — Free / Pro tiers
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.xxl}` (32px), rounded `{rounded.lg}`.
- Layout: small llama mascot icon (~32px) at top, tier name in `{typography.heading-md}`, one-line tier description, large price in `{typography.display-lg}` (`$0` / `$20`), single `{component.button-primary}` CTA, divider, `{typography.body-sm-strong}` "Everything in Free, plus:" header, list of `{component.feature-bullet}` rows.

**`pricing-card-dark`** — Max tier (inverted)
- Identical layout to `pricing-card` but with `{colors.surface-dark}` background, `{colors.on-dark}` text, `{colors.on-dark-mute}` secondary text, and `{component.button-pill-on-dark}` CTA. The inversion is the system''s single "look here" cue.

**`feature-bullet`** — pricing card list item
- Inline `✓` checkmark at `{colors.ink}` followed by `{typography.body-sm}` text in `{colors.charcoal}`. No background, no border, just stacked rows with `{spacing.sm}` between them.

**`faq-row`** — `/pricing` FAQ entry
- Container: background `{colors.canvas}`, padding `16px 0`, 1px bottom border `{colors.hairline}`.
- Question: `{typography.heading-sm}` (18px / 500) in `{colors.ink}`.
- Answer: `{typography.body-md}` (16px / 400) in `{colors.body}`, sitting directly below the question with `{spacing.xs}` gap. Always expanded — no accordion collapse.

**`cta-strip-dark`** — rare dark CTA band
- Background `{colors.surface-dark}`, text `{colors.on-dark}` in `{typography.heading-lg}`, padding `24px 32px`, rounded `{rounded.lg}`. Used sparingly between sections.

### Inline

**`link-inline`** — body-prose anchor link
- `{colors.ink}` text with underline. Default decoration is `text-decoration: underline`.

**`link-mute`** — secondary anchor in long-form prose
- `{colors.body}` text with underline appearing on default — used in FAQ answers ("see [hello@ollama.com](mailto:)") and footer.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}`, text `{colors.ink}`, height 56px, type `{typography.body-sm-strong}`, rounded `{rounded.none}`.
- Layout (desktop): llama icon (left) followed by "Models · Docs · Pricing" text links, centered `{component.search-pill}`, and a right cluster of "Sign in" + black `{component.button-primary}` "Download".

**Top Nav (Mobile)**
- Llama icon at left, hamburger drawer trigger at right. Search pill expands to full-width when triggered. The drawer lists "Models · Docs · Pricing · Sign in · Download" stacked vertically with `{spacing.lg}` row gaps.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, 1px top border `{colors.hairline}`, padding `32px 24px`, type `{typography.caption-sm}` `{colors.body}`.
- Single horizontal row of small links: "Download · Blog · Docs · GitHub · Discord · X · Contact · Privacy · Terms" + a "© 2026 Ollama" copyright at the right edge. Wraps to two rows on narrow screens.

## Do''s and Don''ts

### Do
- Treat the page like a Markdown document: single reading column, plenty of `{spacing.section}` air between sections, no decorative dividers.
- Use `{component.button-primary}` (black pill) for every primary action. There is no green, no blue, no brand-tinted CTA.
- Default to `{rounded.full}` for any interactive element. Cards get `{rounded.lg}` (12px) and that is the only exception.
- Use `{typography.display-xl}` SF Pro Rounded for the hero headline and `{typography.body-md}` system sans for everything else. Avoid intermediate display sizes.
- Reserve `{component.pricing-card-dark}` (the inverted dark surface) for exactly one "look here" moment per page — never use it twice.
- Render install commands and CLI examples inside `{component.install-snippet}` or `{component.terminal-card}` with `{typography.code-md}` / `{typography.code-sm}`. Code is a first-class component.
- Keep the llama mascot the only illustration in the system. It is the brand.

### Don''t
- Don''t introduce gradients, drop shadows, or atmospheric backgrounds. The canvas is pure `{colors.canvas}`.
- Don''t add brand colors. The system is `{colors.primary}` (black) on `{colors.canvas}` (white) with `{colors.body}` (gray) text. That is it.
- Don''t soften pills or sharpen cards — pills stay `{rounded.full}`, cards stay `{rounded.lg}`. Don''t introduce `{rounded.md}` for buttons or `{rounded.full}` for cards.
- Don''t lift cards with shadows. Use a 1px `{colors.hairline}` border or invert to `{colors.surface-dark}` — those are the only two card treatments.
- Don''t replace `ui-sans-serif` with a branded display body face. The system relies on `system-ui` rendering to feel native.
- Don''t fill long-form pages with marketing chrome. FAQ answers stay in `{colors.body}` body-md prose with no decorative containers.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| desktop-large | 1280px+ | Default desktop — 720px content column, 3-up pricing grid |
| desktop | 1024px | Same layout; nav remains horizontal |
| tablet | 850px | Pricing collapses from 3-up to 2-up + 1; nav search pill compresses |
| tablet-narrow | 768px | Pricing collapses to 1-up stacked; primary nav becomes hamburger |
| mobile | 640px | Hero headline drops from `{typography.display-xl}` (36px) to ~28px; install-snippet wraps; section padding tightens |

### Touch Targets
All interactive elements meet WCAG AA at the 36–40px height range. `{component.button-primary}` and `{component.button-secondary}` sit at 36px height with 20px horizontal padding, giving an effective tappable area of ~36×80px which exceeds the 44×44px AAA threshold via the inline padding. `{component.text-input}` sits at 40px. `{component.search-pill}` sits at 36px height with 16px padding. Footer links use `{typography.caption-sm}` (12px) but receive ~12px line-height + ~8px vertical padding for a tappable row of ~32–36px.

### Collapsing Strategy
- **Primary nav:** desktop horizontal → tablet-narrow hamburger drawer at 768px. The black "Download" CTA stays visible at all widths; it never collapses into the menu.
- **Search pill:** desktop fixed width ~360px → tablet compressed to ~240px → mobile collapses to icon-only with a full-width overlay on tap.
- **Pricing grid:** 3-up → 2+1 → 1-up stacked at 850, 768, and below. The dark "Max" card stays in its inverted treatment at every breakpoint.
- **Automate-your-work split:** desktop 50/50 → tablet stacks vertical with text above terminal mockup.
- **Hero headline:** `{typography.display-xl}` (36px) at desktop, scaling to ~28px at mobile with line-height holding at ~1.15.
- **Section spacing:** `{spacing.section}` (88px) desktop → 64px tablet → 48px mobile.
- **Install-snippet pill:** wraps `curl` text to a second line on narrow screens rather than truncating; the copy-icon stays anchored to the right edge.

### Image Behavior
The only image asset is the llama mascot (raster PNG at multiple resolutions: 16/32/48/64/180/192/512px). It is rendered at fixed pixel sizes on the hero and pricing cards rather than scaling responsively — the brand asset is treated like a logo, not a hero image.

## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry from the front matter and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-active}`, `{rounded.full}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-active`, `-disabled`, `-focused`) — do not bury them inside prose.
5. Default body to `{typography.body-md}`; reach for `{typography.body-sm}` for footer/utility text; reserve `{typography.display-xl}` strictly for the page-top headline.
6. Keep `{colors.primary}` scarce per viewport — there should be at most one black pill per fold (counting nav, hero CTA, and pricing-card CTA together). The design''s restraint is the design.
7. When introducing a new component, ask whether it can be expressed with the existing pill + flat-card + terminal-mockup vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.

## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes Ollama''s known mobile pattern (hamburger drawer, 1-up pricing stack, install-snippet wrap) from desktop evidence and the extracted breakpoint stack.
- **Hover states not documented** by system policy.
- **Form field styling** beyond search and install-snippet is not present in the captured surfaces — there is no visible long-form form on the home or pricing pages.
- **Authenticated chrome** (account dropdown, billing settings, model dashboard) not in the captured pages.
- **Models / Docs pages** not in the captured set — those surfaces likely add a sidebar and a docs typography tier that this document does not describe.
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

Ollama''s site is the most aggressively under-designed marketing surface in the AI tooling space, and that is the entire point. The home page reads like a Markdown README rendered with care: a 36px center-aligned heading sits above an inline `curl` install snippet inside a soft-gray pill, a single black "Download" CTA, and a hand-drawn llama mascot as the only ornament. Everything else — automate-your-work block, "Start local. Scale cloud." pricing pair, "Your data stays yours" guarantee strip, FAQ wall on `/pricing` — sits on the same paper-white canvas (`{colors.canvas}`) with quiet `{colors.body}` neutrals carrying the prose. The system is the documentation, and the documentation is the system.

The design philosophy is geometric: every interactive element collapses to `{rounded.full}` (9999px) — buttons, search pills, install-snippet pills, text inputs, and the terminal-traffic-light dots. There are no decorative drop shadows, no gradients, no hero illustrations beyond the llama. Cards (the rare ones, on `/pricing`) use a soft `{rounded.lg}` (12px) and a 1px hairline. The single inverted moment in the entire system is the dark "Max" pricing tier — `{colors.surface-dark}` with white text — which acts as the only attention-grabbing surface in an otherwise studiously flat layout.

Typography pairs SF Pro Rounded (display headings, weight 500–600) with the operating system''s default sans (`ui-sans-serif`) for body and `ui-monospace` for code. The roundness of the heading face is the only "personality" the chrome carries — it gently echoes the `{rounded.full}` button geometry without being decorative about it.

**Key Characteristics:**
- Paper-white `{colors.canvas}` end-to-end with no surface alternation — the whole page is one continuous sheet
- Center-aligned hero with `{typography.display-xl}` SF Pro Rounded headline, no eyebrow, no subhead beyond a small "Power OpenClaw with Ollama" line under the llama
- Pill geometry everywhere: every button and pill input is `{rounded.full}`; cards use `{rounded.lg}`; nothing is sharp-cornered except section dividers
- Single-color CTA system: pure black `{colors.primary}` pills carry every action; "Get Pro" / "Get Max" inside pricing cards are the only variations
- Inline `curl` install snippet rendered as a pill with `{typography.code-md}` — the most signature element, sitting directly under the hero headline
- Terminal-mockup card with macOS traffic-light dots and inline `ollama launch openclaw` example — the home page''s only "product preview"
- Inverted dark `{component.pricing-card-dark}` for the highest-tier "Max" plan, breaking the flat-white rhythm exactly once per page', '{"sourcePath":"docs/design-md/ollama/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> **Source pages:** `/` (home) and `/pricing`. The chrome palette is identical across both — only content changes.

### Brand & Accent
- **Pure Black** (`{colors.primary}` — `#000000`): the brand. Every primary CTA, every black pill, every link in the nav, and every solid icon. There is no other "brand color."
- **Ink Deep** (`{colors.ink-deep}` — `#090909`): pressed-state black for the primary pill — a single notch below pure.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): the page itself. Nearly every surface in the system.
- **Soft Surface** (`{colors.surface-soft}` — `#fafafa`): install-snippet pill background, search pill, secondary chip backgrounds, alternating row fill where one is needed.
- **Surface Dark** (`{colors.surface-dark}` — `#171717`): the dark "Max" pricing card and dark CTA strips. The single inverted surface in the system.
- **Hairline** (`{colors.hairline}` — `#e5e5e5`): 1px card border, divider line above footer, divider between FAQ rows.
- **Hairline Strong** (`{colors.hairline-strong}` — `#d4d4d4`): rare slightly stronger divider where extra separation is needed (e.g., between unrelated FAQ groups).

### Text
- **Ink** (`{colors.ink}` — `#000000`): all headlines, primary nav links, button text on light surfaces, prices on pricing cards.
- **Charcoal** (`{colors.charcoal}` — `#525252`): list-item text and disabled-state secondary copy.
- **Body** (`{colors.body}` — `#737373`): default body color for paragraph copy, FAQ answers, footer link text — the system''s most-used text color after pure black.
- **Mute** (`{colors.mute}` — `#a3a3a3`): caption text, command-line "comment" gray inside terminal mockups, lowest-emphasis utility text.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.surface-dark}`.
- **On Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.7)`): secondary copy inside the dark "Max" pricing card.

### Semantic
The system has effectively no error/success/warning palette in its public marketing surfaces — there are no validation states, no destructive flows, no banners. The only "semantic" colors are the macOS terminal traffic lights inside the terminal mockup:

- **Terminal Red** (`{colors.terminal-red}` — `#ff5f56`): close-window dot.
- **Terminal Yellow** (`{colors.terminal-yellow}` — `#ffbd2e`): minimize dot.
- **Terminal Green** (`{colors.terminal-green}` — `#27c93f`): zoom dot.

These appear only inside `{component.terminal-card}` and have no other use.

### Focus
- **Focus Ring** (`{colors.focus-ring}` — `rgba(59,130,246,0.5)`): translucent blue browser-default focus ring around interactive elements. The only blue in the system.', '{"sourcePath":"docs/design-md/ollama/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
- **SF Pro Rounded** (display headings) — Apple''s rounded geometric sans, used at weights 500 and 600 for headlines from `{typography.display-xl}` (36px) down to `{typography.heading-lg}` (24px). Falls back to `system-ui` → `-apple-system`.
- **ui-sans-serif** (body, links, buttons, captions) — the operating system''s default sans-serif. Carries every non-display text role at 12–20px. Falls back through `system-ui` and platform emoji families.
- **ui-monospace** (code, install snippet, command tags) — the OS default monospace. Used inside the terminal mockup, the inline `curl` install pill, and any inline `<code>` formatting. Falls back to SFMono-Regular → Menlo → Monaco → Consolas.

The pairing of SF Pro Rounded display + system sans body + system mono code is intentionally "stock Apple" — the design decision is to not have a typography decision. Branded display faces would compete with the system''s documentation feel.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 36px | 500 | 1.11 | 0 | Hero headline ("The easiest way to build with open models") |
| `{typography.display-lg}` | 30px | 500 | 1.2 | 0 | Major section headlines ("Pricing", "Frequently asked questions") |
| `{typography.heading-lg}` | 24px | 600 | 1.33 | 0 | Section subheading inside body ("Automate your work", "Start local. Scale cloud.") |
| `{typography.heading-md}` | 20px | 500 | 1.4 | 0 | Pricing tier name ("Free", "Pro", "Max"), card title |
| `{typography.heading-sm}` | 18px | 500 | 1.56 | 0 | FAQ question label, in-card subtitle |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body, FAQ answers, paragraph copy |
| `{typography.body-strong}` | 16px | 500 | 1.5 | 0 | Inline emphasis, primary-nav link |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Feature bullet ("Access larger models on data-center-grade hardware"), footer link |
| `{typography.body-sm-strong}` | 14px | 500 | 1.43 | 0 | Button label, pricing-card eyebrow ("Solve harder tasks, faster") |
| `{typography.caption-sm}` | 12px | 400 | 1.33 | 0 | Footer copyright row, smallest meta text |
| `{typography.code-md}` | 16px | 400 | 1.5 | 0 | Install-snippet `curl` line, in-terminal command |
| `{typography.code-sm}` | 14px | 400 | 1.43 | 0 | Terminal output line, inline `<code>` chips |
| `{typography.button-md}` | 14px | 500 | 1 | 0 | Every button label across the system |

### Principles
The typography is built for legibility at small sizes on a flat-white canvas. SF Pro Rounded''s softened terminals on the heading face do almost all of the brand expression; everything below 20px collapses into the operating system''s default sans, which renders identically to the way docs.ollama.com and the Ollama CLI''s own help text would appear in a terminal. There is almost no letter-spacing variation, no display-only weights, no italic, and the heading-to-body ratio compresses tightly (36 → 30 → 24 → 20 → 16) so the page reads as a single readable column rather than a marketing pyramid.

### Note on Font Substitutes
SF Pro Rounded is Apple-licensed and ships only on macOS/iOS. On other systems it falls back to `system-ui` (Segoe UI / Roboto / DejaVu Sans depending on platform) — Ollama explicitly accepts that the heading face will look slightly different on Windows/Linux. The closest open-source substitute is **Nunito** (rounded geometric sans, weights 500/600). For the body face, **Inter** is a near-perfect match for `system-ui` rendered metrics. For code, **JetBrains Mono** or **Fira Code** are the canonical open-source substitutes for `ui-monospace`.', '{"sourcePath":"docs/design-md/ollama/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 8px (with finer 2/4/6px steps available for tight inline gaps)
- **Tokens (front matter):** `{spacing.xxs}` (2px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (88px)
- **Universal section rhythm:** every page uses `{spacing.section}` (88px) as the vertical gap between major content blocks (hero → automate → start local/scale cloud → your data stays yours → get-started footer call). This is the single largest spacing token in the system and it is used liberally.
- **Card internal padding:** pricing cards sit at `{spacing.xxl}` (32px) all around; FAQ rows use `{spacing.lg}` (16px) vertical with no horizontal padding.

### Grid & Container
- **Max width:** ~720px content column on the home page (the whole page is laid out as a single narrow reading column with optional 2-column splits inside specific sections).
- **Pricing grid:** 3-up cards at desktop with a max content width of ~960px; collapses to 1-up below 768px.
- **Automate-your-work split:** desktop 50/50 left-text/right-terminal-mockup; mobile stacks vertical with the terminal below the text.
- **FAQ:** single-column stacked rows, full-width within the 720px content column.
- **Footer:** single-row of small body-sm links, center-aligned at desktop, wrapping to two rows on narrow screens.

### Whitespace Philosophy
Whitespace is the entire layout. Sections are separated by 88px of plain white air, never by decorative dividers, never by colored bands. Inside a section, content sits in a tight reading column with no decorative columns, callout boxes, or lifted cards. The site treats the page as a long-form Markdown document, and the air between sections is the equivalent of a blank line in Markdown source.', '{"sourcePath":"docs/design-md/ollama/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Hero, automate-your-work, your-data-stays-yours, footer — the dominant treatment across the page |
| 1 — Hairline border | 1px solid `{colors.hairline}` | Pricing cards, FAQ row dividers, terminal mockup card |
| 2 — Inverted dark | `{colors.surface-dark}` fill | Dark "Max" pricing card and dark CTA strip — the system''s only "elevated" surfaces use color, not shadow |

The system has no drop-shadow elevation at all. Nothing lifts, nothing floats, nothing layers. The only depth cue beyond hairline borders is the single dark surface used on the highest-tier pricing card to draw attention to it.

### Decorative Depth
The site has effectively zero decorative depth in the traditional sense. The "depth" comes entirely from two recurring devices:
- **The hand-drawn llama mascot** — appearing once at the top of the hero, once at the top of each pricing card, and once next to the lock icon in the "Your data stays yours" section. It is the only illustration in the system.
- **A single line-drawn lock icon** — used in the data-privacy section. Stroke-only, no fill, drawn in `{colors.ink}`.', '{"sourcePath":"docs/design-md/ollama/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Nav, footer, FAQ row dividers — flat structural lines |
| `{rounded.sm}` | 6px | Inline code chips, command tags |
| `{rounded.md}` | 8px | Rare medium-radius surfaces (e.g., dropdown panels) |
| `{rounded.lg}` | 12px | Pricing cards, terminal mockup card |
| `{rounded.full}` | 9999px | Every button, every pill input, install-snippet pill, search pill, traffic-light dots |

The dominant shape vocabulary is just two values: pills (`{rounded.full}`) for everything interactive and 12px (`{rounded.lg}`) for the few cards in the system. There are no medium-radius "soft cards" — surfaces are either pills or rectangles with corners large enough to read as deliberately soft.

### Photography Geometry
There is no photography. The only image-like elements are:
- **The llama mascot** — a hand-drawn line illustration, ~80–120px on the hero, ~32–48px when it appears as a pricing-card eyebrow icon.
- **The lock icon** — single stroke line drawing in the privacy section.
- **macOS traffic-light dots** — three filled circles at 12px (`{rounded.full}`) inside the terminal mockup card.', '{"sourcePath":"docs/design-md/ollama/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal Ollama CTA
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `8px 20px`, height `36px`, rounded `{rounded.full}`.
- Used for "Download" (top nav), "Sign in" (top nav, paired with Download), "Create account", "Get Pro", "Get Max" — every primary action in the system.
- Pressed state lives in `button-primary-active` — background drops to `{colors.ink-deep}`.

**`button-secondary`** — outline alternative on light canvas
- Background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline-strong}`, type `{typography.button-md}`, padding `8px 20px`, height `36px`, rounded `{rounded.full}`.
- Used as a secondary affordance — e.g., the "Sign in" pill in the top nav when paired with the black "Download" pill, "See more apps →" arrow link in compact form.

**`button-pill-on-dark`** — white pill on dark surface
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-md}`, rounded `{rounded.full}`.
- Sits inside the dark "Max" pricing card as the "Get Max" CTA — inverts the standard primary so the dark card itself becomes the visual anchor and the white pill reads as the CTA.

**`button-disabled`**
- Background `{colors.surface-soft}`, text `{colors.mute}`, rounded `{rounded.full}` — flat soft gray.

### Inputs & Forms

**`search-pill`** + **`search-pill-focused`**
- Default: background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.body-sm}`, padding `8px 16px`, height `36px`, rounded `{rounded.full}`. Anchored in the center of the primary nav with a small magnifier icon prefix and "Search models" placeholder.
- Focused: background flips to `{colors.canvas}` and the browser-default `{colors.focus-ring}` translucent blue ring appears.

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.canvas}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `8px 16px`, height `40px`, rounded `{rounded.full}`.
- Focused: 1px ink border + browser-default focus ring.

**`install-snippet`** — the signature install pill
- Background `{colors.surface-soft}`, text `{colors.ink}` rendered in `{typography.code-md}`, padding `12px 20px`, height `48px`, rounded `{rounded.full}`.
- Contains the literal `curl -fsSL https://ollama.com/install.sh | sh` install command with a small copy-icon at the right edge. Sits directly below the hero headline as the page''s most prominent "CTA."

**`command-tag`** — small inline command chip
- Background `{colors.surface-soft}`, text `{colors.ink}` in `{typography.code-sm}`, padding `6px 12px`, rounded `{rounded.full}`.
- Used inside the "Automate your work" section for the `ollama launch openclaw` example chip and similar inline-command demos.

### Cards & Containers

**`terminal-card`** — the home page''s only "product preview"
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.lg}` (16px), rounded `{rounded.lg}`.
- Header: three `{component.terminal-traffic-lights}` dots (red/yellow/green at 12px) anchored to the top-left of the card.
- Body: terminal output rendered in `{typography.code-sm}` with comments in `{colors.mute}` and active commands in `{colors.ink}`.

**`terminal-traffic-lights`**
- Three 12px filled circles at `{rounded.full}`: `{colors.terminal-red}`, `{colors.terminal-yellow}`, `{colors.terminal-green}`. Sits as a row of three with `{spacing.xs}` gaps between dots inside the terminal card header.

**`pricing-card`** — Free / Pro tiers
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `{spacing.xxl}` (32px), rounded `{rounded.lg}`.
- Layout: small llama mascot icon (~32px) at top, tier name in `{typography.heading-md}`, one-line tier description, large price in `{typography.display-lg}` (`$0` / `$20`), single `{component.button-primary}` CTA, divider, `{typography.body-sm-strong}` "Everything in Free, plus:" header, list of `{component.feature-bullet}` rows.

**`pricing-card-dark`** — Max tier (inverted)
- Identical layout to `pricing-card` but with `{colors.surface-dark}` background, `{colors.on-dark}` text, `{colors.on-dark-mute}` secondary text, and `{component.button-pill-on-dark}` CTA. The inversion is the system''s single "look here" cue.

**`feature-bullet`** — pricing card list item
- Inline `✓` checkmark at `{colors.ink}` followed by `{typography.body-sm}` text in `{colors.charcoal}`. No background, no border, just stacked rows with `{spacing.sm}` between them.

**`faq-row`** — `/pricing` FAQ entry
- Container: background `{colors.canvas}`, padding `16px 0`, 1px bottom border `{colors.hairline}`.
- Question: `{typography.heading-sm}` (18px / 500) in `{colors.ink}`.
- Answer: `{typography.body-md}` (16px / 400) in `{colors.body}`, sitting directly below the question with `{spacing.xs}` gap. Always expanded — no accordion collapse.

**`cta-strip-dark`** — rare dark CTA band
- Background `{colors.surface-dark}`, text `{colors.on-dark}` in `{typography.heading-lg}`, padding `24px 32px`, rounded `{rounded.lg}`. Used sparingly between sections.

### Inline

**`link-inline`** — body-prose anchor link
- `{colors.ink}` text with underline. Default decoration is `text-decoration: underline`.

**`link-mute`** — secondary anchor in long-form prose
- `{colors.body}` text with underline appearing on default — used in FAQ answers ("see [hello@ollama.com](mailto:)") and footer.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}`, text `{colors.ink}`, height 56px, type `{typography.body-sm-strong}`, rounded `{rounded.none}`.
- Layout (desktop): llama icon (left) followed by "Models · Docs · Pricing" text links, centered `{component.search-pill}`, and a right cluster of "Sign in" + black `{component.button-primary}` "Download".

**Top Nav (Mobile)**
- Llama icon at left, hamburger drawer trigger at right. Search pill expands to full-width when triggered. The drawer lists "Models · Docs · Pricing · Sign in · Download" stacked vertically with `{spacing.lg}` row gaps.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, 1px top border `{colors.hairline}`, padding `32px 24px`, type `{typography.caption-sm}` `{colors.body}`.
- Single horizontal row of small links: "Download · Blog · Docs · GitHub · Discord · X · Contact · Privacy · Terms" + a "© 2026 Ollama" copyright at the right edge. Wraps to two rows on narrow screens.', '{"sourcePath":"docs/design-md/ollama/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Treat the page like a Markdown document: single reading column, plenty of `{spacing.section}` air between sections, no decorative dividers.
- Use `{component.button-primary}` (black pill) for every primary action. There is no green, no blue, no brand-tinted CTA.
- Default to `{rounded.full}` for any interactive element. Cards get `{rounded.lg}` (12px) and that is the only exception.
- Use `{typography.display-xl}` SF Pro Rounded for the hero headline and `{typography.body-md}` system sans for everything else. Avoid intermediate display sizes.
- Reserve `{component.pricing-card-dark}` (the inverted dark surface) for exactly one "look here" moment per page — never use it twice.
- Render install commands and CLI examples inside `{component.install-snippet}` or `{component.terminal-card}` with `{typography.code-md}` / `{typography.code-sm}`. Code is a first-class component.
- Keep the llama mascot the only illustration in the system. It is the brand.

### Don''t
- Don''t introduce gradients, drop shadows, or atmospheric backgrounds. The canvas is pure `{colors.canvas}`.
- Don''t add brand colors. The system is `{colors.primary}` (black) on `{colors.canvas}` (white) with `{colors.body}` (gray) text. That is it.
- Don''t soften pills or sharpen cards — pills stay `{rounded.full}`, cards stay `{rounded.lg}`. Don''t introduce `{rounded.md}` for buttons or `{rounded.full}` for cards.
- Don''t lift cards with shadows. Use a 1px `{colors.hairline}` border or invert to `{colors.surface-dark}` — those are the only two card treatments.
- Don''t replace `ui-sans-serif` with a branded display body face. The system relies on `system-ui` rendering to feel native.
- Don''t fill long-form pages with marketing chrome. FAQ answers stay in `{colors.body}` body-md prose with no decorative containers.', '{"sourcePath":"docs/design-md/ollama/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| desktop-large | 1280px+ | Default desktop — 720px content column, 3-up pricing grid |
| desktop | 1024px | Same layout; nav remains horizontal |
| tablet | 850px | Pricing collapses from 3-up to 2-up + 1; nav search pill compresses |
| tablet-narrow | 768px | Pricing collapses to 1-up stacked; primary nav becomes hamburger |
| mobile | 640px | Hero headline drops from `{typography.display-xl}` (36px) to ~28px; install-snippet wraps; section padding tightens |

### Touch Targets
All interactive elements meet WCAG AA at the 36–40px height range. `{component.button-primary}` and `{component.button-secondary}` sit at 36px height with 20px horizontal padding, giving an effective tappable area of ~36×80px which exceeds the 44×44px AAA threshold via the inline padding. `{component.text-input}` sits at 40px. `{component.search-pill}` sits at 36px height with 16px padding. Footer links use `{typography.caption-sm}` (12px) but receive ~12px line-height + ~8px vertical padding for a tappable row of ~32–36px.

### Collapsing Strategy
- **Primary nav:** desktop horizontal → tablet-narrow hamburger drawer at 768px. The black "Download" CTA stays visible at all widths; it never collapses into the menu.
- **Search pill:** desktop fixed width ~360px → tablet compressed to ~240px → mobile collapses to icon-only with a full-width overlay on tap.
- **Pricing grid:** 3-up → 2+1 → 1-up stacked at 850, 768, and below. The dark "Max" card stays in its inverted treatment at every breakpoint.
- **Automate-your-work split:** desktop 50/50 → tablet stacks vertical with text above terminal mockup.
- **Hero headline:** `{typography.display-xl}` (36px) at desktop, scaling to ~28px at mobile with line-height holding at ~1.15.
- **Section spacing:** `{spacing.section}` (88px) desktop → 64px tablet → 48px mobile.
- **Install-snippet pill:** wraps `curl` text to a second line on narrow screens rather than truncating; the copy-icon stays anchored to the right edge.

### Image Behavior
The only image asset is the llama mascot (raster PNG at multiple resolutions: 16/32/48/64/180/192/512px). It is rendered at fixed pixel sizes on the hero and pricing cards rather than scaling responsively — the brand asset is treated like a logo, not a hero image.', '{"sourcePath":"docs/design-md/ollama/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry from the front matter and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-active}`, `{rounded.full}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-active`, `-disabled`, `-focused`) — do not bury them inside prose.
5. Default body to `{typography.body-md}`; reach for `{typography.body-sm}` for footer/utility text; reserve `{typography.display-xl}` strictly for the page-top headline.
6. Keep `{colors.primary}` scarce per viewport — there should be at most one black pill per fold (counting nav, hero CTA, and pricing-card CTA together). The design''s restraint is the design.
7. When introducing a new component, ask whether it can be expressed with the existing pill + flat-card + terminal-mockup vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.', '{"sourcePath":"docs/design-md/ollama/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes Ollama''s known mobile pattern (hamburger drawer, 1-up pricing stack, install-snippet wrap) from desktop evidence and the extracted breakpoint stack.
- **Hover states not documented** by system policy.
- **Form field styling** beyond search and install-snippet is not present in the captured surfaces — there is no visible long-form form on the home or pricing pages.
- **Authenticated chrome** (account dropdown, billing settings, model dashboard) not in the captured pages.
- **Models / Docs pages** not in the captured set — those surfaces likely add a sidebar and a docs typography tier that this document does not describe.', '{"sourcePath":"docs/design-md/ollama/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_1', '#000000', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_3', '#090909', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_4', '#525252', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_5', '#737373', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_6', '#a3a3a3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_7', '#fafafa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_8', '#e5e5e5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_9', '#d4d4d4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_10', '#171717', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_11', '#ff5f56', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_12', '#ffbd2e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md'), 'color', 'color_13', '#27c93f', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/ollama/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/ollama/DESIGN.md';


-- Opencode Ai
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Opencode Ai', 'opencode.ai', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/opencode.ai/DESIGN.md', null, 'seeded', '---
version: alpha
name: OpenCode-design-analysis
description: |
  A terminal-native marketing system rendered entirely in Berkeley Mono — every word on the page, from the hero headline down to the footer fine print, is monospaced. The page itself reads like a manpage or a static-site README: warm cream canvas (`#fdfcfc`), nearly-black ink (`#201d1d`), 4px-radius rectangles for the few interactive elements, and bracketed `[+]`/`[-]` ASCII markers used as bullets. The brand''s only "visual moment" is a single dark hero card that mocks up the OpenCode TUI itself — black background, monospaced terminal output, ASCII pipe characters, and a wordmark rendered as block-pixel ASCII. Every section sits as a hairline-bordered text block on the cream canvas with no shadows, no gradients, no decorative imagery, and no non-monospaced character anywhere in the system.

colors:
  primary: "#201d1d"
  on-primary: "#fdfcfc"
  ink: "#201d1d"
  ink-deep: "#0f0000"
  charcoal: "#302c2c"
  body: "#424245"
  mute: "#646262"
  stone: "#6e6e73"
  ash: "#9a9898"
  canvas: "#fdfcfc"
  surface-soft: "#f8f7f7"
  surface-card: "#f1eeee"
  surface-dark: "#201d1d"
  surface-dark-elevated: "#302c2c"
  hairline: "rgba(15,0,0,0.12)"
  hairline-strong: "#646262"
  on-dark: "#fdfcfc"
  on-dark-mute: "#9a9898"
  accent: "#007aff"
  accent-hover: "#0056b3"
  accent-active: "#004085"
  warning: "#ff9f0a"
  warning-hover: "#cc7f08"
  warning-active: "#995f06"
  danger: "#ff3b30"
  danger-hover: "#d70015"
  danger-active: "#a50011"
  success: "#30d158"

typography:
  display-xl:
    fontFamily: Berkeley Mono
    fontSize: 38px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
  heading-md:
    fontFamily: Berkeley Mono
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
  body-md:
    fontFamily: Berkeley Mono
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: Berkeley Mono
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  body-tight:
    fontFamily: Berkeley Mono
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
  link-md:
    fontFamily: Berkeley Mono
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button-md:
    fontFamily: Berkeley Mono
    fontSize: 16px
    fontWeight: 500
    lineHeight: 2
    letterSpacing: 0
  caption-md:
    fontFamily: Berkeley Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 2
    letterSpacing: 0

rounded:
  none: 0px
  sm: 4px
  full: 9999px

spacing:
  xxs: 1px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 4px 20px
    height: 36px
  button-primary-active:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 4px 20px
  button-tab:
    backgroundColor: "transparent"
    textColor: "{colors.mute}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    padding: 8px 16px
  button-tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
  button-disabled:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ash}"
    rounded: "{rounded.sm}"
  badge-news:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.sm}"
    padding: 2px 8px
  text-input:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 8px 12px
    height: 40px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  textarea:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px
  install-snippet:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
  hero-tui-mockup:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 64px 32px
  tui-prompt-row:
    backgroundColor: "{colors.surface-dark-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 8px 12px
  list-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 8px 0px
  faq-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 12px 0px
  testimonial-row:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 16px 20px
  chart-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.none}"
    padding: 16px
  primary-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
    height: 56px
  footer-section:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.none}"
    padding: 32px 0px
  link-inline:
    textColor: "{colors.ink}"
    typography: "{typography.link-md}"
  badge-section-label:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.heading-md}"
    rounded: "{rounded.none}"
---

## Overview

OpenCode''s marketing site is rendered entirely in Berkeley Mono — every word on the page, from the 38px hero headline down to the 14px footer fine print, sits in the same monospaced face. The visual identity comes from that single typographic decision: the page reads like a manpage or a static-site README, complete with bracketed `[+]` / `[-]` / `[x]` ASCII markers used in place of icons or bullets, and a wordmark rendered as block-pixel ASCII art at the top of the nav. There is no sans-serif anywhere, no display face, no italics, no decorative ornament — the system is one font and one weight away from being a 1990s `whatis` page rendered at modern resolutions.

The chrome is austere: warm cream canvas (`{colors.canvas}` — `#fdfcfc` with a faint blush), nearly-black ink (`{colors.ink}` — `#201d1d`), and a 4-tier neutral gray ladder for body, metadata, and disabled text. Cards don''t exist as raised surfaces — sections are just hairline-bordered text blocks (`{colors.hairline}` 1px) sitting directly on the canvas with `{spacing.section}` (96px) air between them. The single "visual" moment in the entire system is a full-bleed dark hero card (`{colors.surface-dark}` — true near-black) that mocks up the OpenCode TUI itself: a terminal frame with `tab` / `ctrl-p` keybinding hints, a "Build" command line, and the OpenCode wordmark rendered as a pixel-block ASCII title.

The semantic palette is unusual for a brand-marketing site: it ships the full Apple Human Interface Guidelines accent ramp — `{colors.accent}` (Apple Blue `#007aff`), `{colors.danger}` (`#ff3b30`), `{colors.warning}` (`#ff9f0a`), `{colors.success}` (`#30d158`) plus their hover/active deepenings — even though the marketing surfaces themselves only use these colors in the dark hero TUI mockup as syntax-highlight stand-ins. The wider palette belongs to the in-product TUI; the marketing pages mostly stay in monochrome.

**Key Characteristics:**
- 100% Berkeley Mono typography across every text role — no sans-serif fallback anywhere in the chrome
- Warm cream `{colors.canvas}` (#fdfcfc) as the only body background — no surface alternation across sections
- Single dark surface (`{colors.surface-dark}` — #201d1d) reserved exclusively for the hero TUI mockup
- 4px radius (`{rounded.sm}`) on every interactive element; sections themselves are sharp rectangles bordered in 1px hairline
- ASCII bracket markers (`[+]`, `[-]`, `[x]`) used as bullet glyphs in feature lists and FAQ rows
- Block-pixel ASCII wordmark in the primary nav and inside the hero TUI — the brand identity is its own ASCII art
- 96px `{spacing.section}` rhythm between every section, with no decorative dividers; only thin 1px `{colors.hairline}` rules separate content blocks

## Colors

> **Source pages:** `/` (home), `/zen`, `/enterprise`. The chrome palette is identical across all three.

### Brand & Accent
- **Ink** (`{colors.primary}` / `{colors.ink}` — `#201d1d`): the brand''s only "color." Headlines, body text, primary CTA fill, nav links, and every solid icon. Treats nearly-black as the brand color rather than pure black to keep type readable on the warm cream canvas.
- **Ink Deep** (`{colors.ink-deep}` — `#0f0000`): pressed-state for the primary CTA. Carries a faint red undertone matching the canvas''s warm cast.
- **Cream** (`{colors.canvas}` — `#fdfcfc`): the brand''s signature warm white. Used for every page body, every card surface, the on-primary text color, and the ASCII wordmark fill on dark.

### Surface
- **Canvas Cream** (`{colors.canvas}` — `#fdfcfc`): every page body, every card.
- **Soft Surface** (`{colors.surface-soft}` — `#f8f7f7`): text-input default background, testimonial row fill, alternating row tint.
- **Surface Card** (`{colors.surface-card}` — `#f1eeee`): install-snippet pill, disabled button fill, slightly-elevated section row.
- **Surface Dark** (`{colors.surface-dark}` — `#201d1d`): the hero TUI mockup background and the dark CTA pill on the home page. Identical to `{colors.ink}` — the brand uses one near-black for both text and dark surfaces.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — `#302c2c`): the prompt-row inside the hero TUI mockup, one notch lighter than the dark surface itself.
- **Hairline** (`{colors.hairline}` — `rgba(15,0,0,0.12)`): 1px section divider. The translucent warm tint matches the cream canvas''s undertone.
- **Hairline Strong** (`{colors.hairline-strong}` — `#646262`): tab strip''s bottom rule and stronger inline divider.

### Text
- **Ink** (`{colors.ink}` — `#201d1d`): headlines, body text, primary nav links, button text on light surfaces.
- **Charcoal** (`{colors.charcoal}` — `#302c2c`): subtly softer body where pure ink is too heavy.
- **Body** (`{colors.body}` — `#424245`): default paragraph text and FAQ answers.
- **Mute** (`{colors.mute}` — `#646262`): tab labels (default state), metadata, footer link text, in-list secondary annotations.
- **Stone** (`{colors.stone}` — `#6e6e73`): least-emphasis utility text, breadcrumb separators.
- **Ash** (`{colors.ash}` — `#9a9898`): disabled text and secondary annotation in dark TUI mockup, also TUI mockup secondary color.

### Semantic
The full Apple Human Interface Guidelines semantic ramp ships with the system. On marketing pages these colors appear primarily inside the hero TUI mockup as syntax-highlight stand-ins; in the in-product TUI they carry their conventional meaning.

- **Accent** (`{colors.accent}` — `#007aff`): primary informational signal, in-product link color, TUI command highlight.
- **Accent Hover** (`{colors.accent-hover}` — `#0056b3`): pressed informational link.
- **Accent Active** (`{colors.accent-active}` — `#004085`): deeply-pressed informational state.
- **Danger** (`{colors.danger}` — `#ff3b30`): destructive confirmation, error state.
- **Danger Hover** (`{colors.danger-hover}` — `#d70015`): pressed destructive.
- **Danger Active** (`{colors.danger-active}` — `#a50011`): deeply-pressed destructive.
- **Warning** (`{colors.warning}` — `#ff9f0a`): caution callouts.
- **Warning Hover** (`{colors.warning-hover}` — `#cc7f08`): pressed caution.
- **Warning Active** (`{colors.warning-active}` — `#995f06`): deeply-pressed caution.
- **Success** (`{colors.success}` — `#30d158`): positive confirmation, in-TUI success indicator.

## Typography

### Font Family
**Berkeley Mono** is the proprietary monospaced face used across every text role in the system. It carries weights 400 (regular), 500 (medium), and 700 (bold) and falls back through a long monospace stack — IBM Plex Mono → ui-monospace → SFMono-Regular → Menlo → Monaco → Consolas → Liberation Mono → Courier New.

The single-font decision is the brand. There is no display face, no body sans, no italic alternative, and no fallback to a proportional font anywhere — even the legal copyright row uses Berkeley Mono at 14px. This is the most aggressive typographic restraint of any site in the marketing-tools category: OpenCode''s identity is "the marketing page is a man page."

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 38px | 700 | 1.5 | 0 | Hero headline ("The open source AI coding agent") |
| `{typography.heading-md}` | 16px | 700 | 1.5 | 0 | Section label ("What is OpenCode?", "FAQ", "Built for privacy first") |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Body copy, paragraph text, list-row text, install-snippet code |
| `{typography.body-strong}` | 16px | 500 | 1.5 | 0 | Inline emphasis, primary nav link, tab-label active |
| `{typography.body-tight}` | 16px | 500 | 1 | 0 | Compact label rendered without breathing room |
| `{typography.link-md}` | 16px | 400 | 1.5 | 0 | Inline anchor link in body prose |
| `{typography.button-md}` | 16px | 500 | 2 | 0 | Every button label across the system |
| `{typography.caption-md}` | 14px | 400 | 2 | 0 | Footer link text, badge label, copyright row, chart caption |

### Principles
The hierarchy is built almost entirely from size and weight contrast on a single face. The display headline (38px / 700) and the heading-md label (16px / 700) share a weight; the difference is just size. Body and link share size, weight, and line-height — only context distinguishes them. Buttons get a deliberately tall line-height (2.0) so labels feel calmly spaced inside the 4px-radius rectangle.

### Note on Font Substitutes
Berkeley Mono is a paid commercial font. Open-source substitutes that approximate its metrics within ~3% at body sizes:
- **JetBrains Mono** — closest match for stroke contrast and x-height; pair at weights 400 / 500 / 700.
- **IBM Plex Mono** — official secondary fallback in the documented font stack; slightly more open counters but matches line-height behavior.
- **Geist Mono** — modern alternative with similar geometric construction.

When substituting, line-height behavior is preserved by keeping `lineHeight: 1.5` for body and `lineHeight: 2` for buttons — adjusting weight is rarely needed.

## Layout

### Spacing System
- **Base unit:** 8px (with finer 1/2/4px steps available for tight inline gaps).
- **Tokens (front matter):** `{spacing.xxs}` (1px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (96px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (96px) as the vertical gap between major content blocks. This is the largest spacing token in the system and is the dominant layout cue across the home, `/zen`, and `/enterprise` pages.
- **Section internal padding:** content rows inside a section sit at `{spacing.lg}` (16px) vertical with no horizontal padding — text starts flush at the section''s left edge.

### Grid & Container
- **Max width:** ~960px content column for body sections; the dark hero TUI mockup is full-bleed within an outer ~1100px content frame.
- **Two-column split:** `/enterprise` pairs a left text block (~360px wide) with a right-aligned form column (~480px wide). The home page is single-column reading.
- **Footer:** 5-up horizontal link row (GitHub / Docs / Changelog / Discord / X) at desktop, collapsing to 2-up at tablet and 1-up at mobile.

### Whitespace Philosophy
Whitespace is structural and generous. Sections sit 96px apart with no decorative dividers between them — the `{colors.hairline}` 1px rule is the only signal of separation. Inside a section, content is left-flush against the column edge with no internal indentation; bullets use ASCII bracket prefixes (`[+]` / `[-]`) instead of indent-based layout. The result is a page that feels like a printed code listing rather than a styled marketing layout.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for body sections, list rows, hero text block, footer |
| 1 — Hairline rule | 1px solid `{colors.hairline}` (translucent warm tint) | Section dividers, between major content blocks |
| 2 — Hairline strong | 1px solid `{colors.hairline-strong}` | Tab strip bottom rule, in-list emphasized divider |
| 3 — Inverted dark | `{colors.surface-dark}` fill | Hero TUI mockup, dark CTA pill — the system''s only "elevated" surface uses color, not shadow |

There are no drop shadows in the system. Nothing lifts, nothing floats. The only way an element registers as "above" another is the dark surface used in the hero mockup.

### Decorative Depth
Depth comes from typography density and the single dark TUI mockup, not from CSS effects:
- **ASCII block-pixel wordmark** — the OpenCode brand name rendered as a 5-row block of monospaced character cells, used in the primary nav and as the centerpiece of the hero TUI mockup.
- **Hero TUI mockup** — full-bleed `{colors.surface-dark}` rectangle containing a faux terminal interface: ASCII wordmark, a `tui-prompt-row` showing a Build command line, and `tab switch agent` / `ctrl-p commands` keybinding hints in `{colors.ash}` at the bottom edge.
- **Chart tiles** — three thin-line ASCII charts inside the home page''s "open source AI coding agent" stat block, with abstract dotted/sparse-line plots in `{colors.body}` against the cream canvas. Captions sit beneath in `{typography.caption-md}` (`Fig 1. 150K GitHub Stars`, `Fig 2. 850 Contributors`, `Fig 3. 6.5M Monthly Devs`).

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Sections, hero TUI mockup, primary nav, footer, list rows — every container that isn''t a button |
| `{rounded.sm}` | 4px | Every interactive element — primary CTA, secondary CTA, text inputs, install snippet, badges, prompt rows |
| `{rounded.full}` | 9999px | Avatar circles in testimonials |

The radius vocabulary is two values: 4px for interactive elements and 0px for everything else. Avatar circles in testimonial rows are the only fully-rounded element in the system.

### Photography Geometry
There is no photography. Visual elements are limited to:
- **ASCII block-pixel wordmark** in the nav and hero TUI mockup.
- **Inline ASCII charts** inside the stat-block section — abstract sparse-line and dotted plots without specific data points.
- **Avatar dots** (~32px) inside testimonial rows on `/zen` — flat colored circles in `{rounded.full}`.
- **In-product icons** (kbd, A+, ⊕, ↻, K, Z) rendered as small monospaced character glyphs, not bitmaps or SVG.

## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal OpenCode CTA
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `4px 20px`, height ~36px, rounded `{rounded.sm}` (4px).
- Used for "Download" (top nav), "Get started with Zen", "Send" (enterprise contact form), "Subscribe" (newsletter footer), "Read docs →".
- Pressed state lives in `button-primary-active` — background drops to `{colors.ink-deep}`.

**`button-secondary`** — outlined alternative
- Background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline-strong}` border, type `{typography.button-md}`, padding `4px 20px`, rounded `{rounded.sm}`.
- Lower-emphasis CTA — appears beside the primary fill where two actions are paired.

**`button-tab`** + **`button-tab-active`** — install-tab strip
- Default: transparent background, text `{colors.mute}`, type `{typography.button-md}`, padding `8px 16px`, rounded `{rounded.none}`.
- Active: same surface, text `{colors.ink}`, with a 2px `{colors.ash}` bottom underline indicating selection.
- Used in the install-method tab strip on the home page (`curl` / `npm` / `bun` / `brew` / `yay`).

**`button-disabled`**
- Background `{colors.surface-card}`, text `{colors.ash}`, rounded `{rounded.sm}`.

### Badges & Chips

**`badge-news`** — small dark chip in the news/announcement strip
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.caption-md}`, padding `2px 8px`, rounded `{rounded.sm}`.
- Sits inline with body copy as a "News" / "Beta" / "Live now" tag on the home page above the hero headline.

**`badge-section-label`** — bracketed section header
- Background transparent, text `{colors.ink}`, type `{typography.heading-md}`, rounded `{rounded.none}`.
- Renders as a bare `**Heading**` line above a 1px `{colors.hairline}` rule with no chip background — but the way the text reads ("[+]", "[x]", `What is OpenCode?`) makes it function as a label component.

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.surface-soft}`, text `{colors.ink}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `8px 12px`, height ~40px, rounded `{rounded.sm}`.
- Focused: background flips to `{colors.canvas}`, border becomes 1px solid `{colors.ink}` (the canvas''s flat focus signal — no halo, no glow).
- Used for every contact-form field on `/enterprise` (Full name, Role, Company, Company email, Phone number) and the newsletter email field at the home page footer.

**`textarea`**
- Background `{colors.surface-soft}`, text `{colors.ink}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `12px`, rounded `{rounded.sm}`.
- "What problem are you trying to solve?" multi-line textarea on `/enterprise`.

**`install-snippet`** — the home page''s signature install code block
- Background `{colors.surface-card}` (`#f1eeee`), text `{colors.ink}` rendered in `{typography.body-md}` (already monospaced — Berkeley Mono), padding `12px 16px`, rounded `{rounded.sm}`.
- Contains the literal `curl -fsSL https://opencode.ai/install | bash` command with a small copy-icon at the right edge. Sits below the install-method tab strip.

### Cards & Containers

**`hero-tui-mockup`** — the home page''s signature TUI preview
- Container: full-bleed `{colors.surface-dark}` (~near-black), padding `64px 32px`, rounded `{rounded.none}`.
- Contents (top → bottom): ASCII block-pixel "OPENCODE" wordmark centered in `{colors.on-dark}`; a `{component.tui-prompt-row}` showing a "Build" command line with model selector text; an `tab switch agent  ctrl-p commands` keybinding hint row at the bottom in `{colors.ash}`.

**`tui-prompt-row`** — the inset command line inside the TUI mockup
- Background `{colors.surface-dark-elevated}` (`#302c2c`), text `{colors.on-dark}` in `{typography.body-md}`, padding `8px 12px`, rounded `{rounded.sm}`.
- Renders an inline command (`Build  Claude Opus 4.5  OpenCode Zen`) with a leading vertical pipe and the model name styled as a bracketed token.

**`list-row`** — feature/benefit row with ASCII bracket bullet
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.body-md}`, padding `8px 0`.
- Each row begins with a `[+]` / `[-]` / `[x]` ASCII marker followed by a bold label and a regular description: e.g., `[+] LSP enabled    Automatically loads the right LSPs for the IDE`. The bracket marker is part of the text content, not a separate icon.

**`faq-row`** — FAQ entry with bracket toggle
- Background `{colors.canvas}`, text `{colors.ink}` in `{typography.body-md}`, padding `12px 0`, with a 1px `{colors.hairline}` bottom rule.
- Each row leads with `+` / `−` ASCII markers indicating expand/collapse state. Always rendered as plain text rows — no chevron icons, no animated accordion chrome.

**`testimonial-row`** — `/zen` peer-quote row
- Background `{colors.surface-soft}`, text `{colors.body}` in `{typography.body-md}`, padding `16px 20px`, rounded `{rounded.sm}`.
- Layout: a 32px avatar circle (`{rounded.full}`) at left, name + role + company in `{typography.body-strong}` on the first line, quote in `{typography.body-md}` `{colors.body}` on the second line.

**`chart-tile`** — the stat-block sparse-line chart
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.caption-md}`, rounded `{rounded.none}`, padding `16px`.
- Contains an inline SVG/CSS-drawn ASCII-style sparse-line plot (dotted, abstract — never specific data points) with a `Fig N. <stat label>` caption beneath in `{colors.mute}`.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}`, text `{colors.ink}` in `{typography.body-strong}`, height ~56px, rounded `{rounded.none}`, with a 1px `{colors.hairline}` bottom rule.
- Layout (desktop): block-pixel ASCII OpenCode wordmark at left (~120×24px), nav links cluster center-right ("GitHub [150K] · Docs · Zen · Go · Enterprise"), `{component.button-primary}` "Download" CTA at the far right with a small download glyph.

**Top Nav (Mobile)**
- ASCII wordmark stays at left, nav links collapse into a hamburger drawer at the right. The Download CTA remains visible at every breakpoint.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.caption-md}`, padding `32px 0`, with a 1px `{colors.hairline}` top rule.
- Top row: 5-column horizontal link grid (GitHub [150K] · Docs · Changelog · Discord · X), each rendered as a centered cell separated by 1px `{colors.hairline}` vertical rules.
- Bottom row: `©2026 Anomaly` copyright at left, `Brand · Privacy · Terms · English ▼` utility cluster at right, all in `{typography.caption-md}` `{colors.mute}`.

### Inline

**`link-inline`** — body-prose anchor link
- `{colors.ink}` text with underline. The brand''s only link affordance — even links inside body paragraphs use ink color rather than `{colors.accent}` blue. Apple Blue is reserved for the in-product TUI.

## Do''s and Don''ts

### Do
- Render every text role in Berkeley Mono. The single-font decision is the entire identity.
- Keep `{colors.canvas}` (`#fdfcfc`) as the only body background. Don''t introduce gray section bands.
- Use ASCII bracket markers (`[+]`, `[-]`, `[x]`, `+`, `−`) as bullets, toggles, and section glyphs. They are the brand''s only iconography.
- Anchor the dark `{component.hero-tui-mockup}` exactly once per landing page as the hero centerpiece. Never use the dark surface for body content.
- Reserve `{colors.accent}` (Apple Blue) and the rest of the semantic ramp for in-TUI states; marketing chrome stays monochrome.
- Use `{rounded.sm}` (4px) on every interactive element and `{rounded.none}` (0px) on every container.
- Stack content sections at `{spacing.section}` (96px) rhythm with only 1px `{colors.hairline}` rules between them.

### Don''t
- Don''t introduce a sans-serif body font, a display face, or an italic style. Berkeley Mono carries everything.
- Don''t add drop shadows, gradients, or atmospheric backgrounds. The system is flat-on-cream.
- Don''t replace the ASCII bracket markers with SVG icons. The brackets are the icons.
- Don''t use the semantic accent ramp (`{colors.accent}`, `{colors.warning}`, `{colors.danger}`, `{colors.success}`) on marketing CTAs. They belong to the in-product TUI.
- Don''t pad cards with 24px+ internal padding. List rows sit at 8px vertical; FAQ rows at 12px.
- Don''t render the OpenCode wordmark as a vector logo. It is always block-pixel ASCII.
- Don''t fill the hero TUI mockup with photography or illustration. It is text-only and always shows a faux terminal command line.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| desktop-large | 1280px+ | Default — 960px content column, 5-up footer link grid |
| desktop | 1024px | Same layout; nav remains horizontal |
| tablet | 850px | Footer collapses to 2-up grid; `/enterprise` two-column form stacks |
| tablet-narrow | 768px | Primary nav becomes hamburger drawer; Download CTA stays visible |
| mobile | 640px | Single-column everything; hero display drops 38px → ~28px; section padding tightens |

### Touch Targets
All interactive elements meet WCAG AA at the ~36–40px height range. `{component.button-primary}` sits at ~36px with 20px horizontal padding. `{component.text-input}` and `{component.textarea}` sit at ~40px. `{component.button-tab}` rows in the install-method strip sit at ~32–36px depending on label length but extend to a full 44px tappable cell via inline padding. Footer links use `{typography.caption-md}` (14px) but receive ~28px line-height (caption-md is 2.0) plus 8px vertical padding for a comfortable ~44px tappable row.

### Collapsing Strategy
- **Primary nav:** desktop horizontal cluster → tablet-narrow hamburger drawer at 768px. The dark "Download" CTA stays visible at all widths.
- **Hero TUI mockup:** maintains its full-bleed dark surface at every breakpoint; the ASCII wordmark scales proportionally and the keybinding-hint row may wrap to two lines on narrow screens.
- **Install snippet + tab strip:** desktop fixed-width pill → mobile full-width pill with horizontal scroll on the tab strip if labels overflow.
- **Footer:** 5-up horizontal link grid → 2-up at tablet → 1-up at mobile (each link becomes a full-width row).
- **`/enterprise` two-column layout:** desktop 50/50 → tablet stacks to single-column with the form below the text block.
- **Section padding:** `{spacing.section}` (96px) desktop → 64px tablet → 48px mobile.
- **Hero headline:** `{typography.display-xl}` (38px) at desktop, scaling to ~28px at mobile, line-height holding at 1.5.

### Image Behavior
There are no raster images in the system aside from the favicon and OG share image. Every visual element — wordmarks, charts, icons — is rendered as type or inline SVG and scales without aspect-ratio considerations.

## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry and verify every property resolves.
2. Reference component names and tokens directly (`{colors.ink}`, `{component.hero-tui-mockup}`, `{rounded.sm}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-active`, `-disabled`) — do not bury them inside prose.
5. Default body to `{typography.body-md}`; reach for `{typography.body-strong}` for emphasis; reserve `{typography.display-xl}` strictly for the page-top hero headline.
6. Keep `{colors.surface-dark}` scarce — at most one full-bleed dark mockup per page. The dark surface is a narrative device, not a chrome treatment.
7. When introducing a new component, ask whether it can be expressed with the existing ASCII-bracket + 4px-radius + Berkeley-Mono vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.

## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes OpenCode''s mobile pattern (hamburger drawer, single-column, footer accordion) from desktop evidence and the breakpoint stack.
- **Hover states not documented** by system policy.
- **In-product TUI screenshots** beyond the marketing hero mockup are not in the captured set; the actual `opencode` terminal interface (full keybindings, panels, status bar) is not documented here.
- **`/go` page** not extracted — the marketing page for the Go SDK likely shares the same chrome but introduces code-sample blocks not documented above.
- **Form validation state styling** (success / error inline messages) not present in the captured surfaces.
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

OpenCode''s marketing site is rendered entirely in Berkeley Mono — every word on the page, from the 38px hero headline down to the 14px footer fine print, sits in the same monospaced face. The visual identity comes from that single typographic decision: the page reads like a manpage or a static-site README, complete with bracketed `[+]` / `[-]` / `[x]` ASCII markers used in place of icons or bullets, and a wordmark rendered as block-pixel ASCII art at the top of the nav. There is no sans-serif anywhere, no display face, no italics, no decorative ornament — the system is one font and one weight away from being a 1990s `whatis` page rendered at modern resolutions.

The chrome is austere: warm cream canvas (`{colors.canvas}` — `#fdfcfc` with a faint blush), nearly-black ink (`{colors.ink}` — `#201d1d`), and a 4-tier neutral gray ladder for body, metadata, and disabled text. Cards don''t exist as raised surfaces — sections are just hairline-bordered text blocks (`{colors.hairline}` 1px) sitting directly on the canvas with `{spacing.section}` (96px) air between them. The single "visual" moment in the entire system is a full-bleed dark hero card (`{colors.surface-dark}` — true near-black) that mocks up the OpenCode TUI itself: a terminal frame with `tab` / `ctrl-p` keybinding hints, a "Build" command line, and the OpenCode wordmark rendered as a pixel-block ASCII title.

The semantic palette is unusual for a brand-marketing site: it ships the full Apple Human Interface Guidelines accent ramp — `{colors.accent}` (Apple Blue `#007aff`), `{colors.danger}` (`#ff3b30`), `{colors.warning}` (`#ff9f0a`), `{colors.success}` (`#30d158`) plus their hover/active deepenings — even though the marketing surfaces themselves only use these colors in the dark hero TUI mockup as syntax-highlight stand-ins. The wider palette belongs to the in-product TUI; the marketing pages mostly stay in monochrome.

**Key Characteristics:**
- 100% Berkeley Mono typography across every text role — no sans-serif fallback anywhere in the chrome
- Warm cream `{colors.canvas}` (#fdfcfc) as the only body background — no surface alternation across sections
- Single dark surface (`{colors.surface-dark}` — #201d1d) reserved exclusively for the hero TUI mockup
- 4px radius (`{rounded.sm}`) on every interactive element; sections themselves are sharp rectangles bordered in 1px hairline
- ASCII bracket markers (`[+]`, `[-]`, `[x]`) used as bullet glyphs in feature lists and FAQ rows
- Block-pixel ASCII wordmark in the primary nav and inside the hero TUI — the brand identity is its own ASCII art
- 96px `{spacing.section}` rhythm between every section, with no decorative dividers; only thin 1px `{colors.hairline}` rules separate content blocks', '{"sourcePath":"docs/design-md/opencode.ai/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> **Source pages:** `/` (home), `/zen`, `/enterprise`. The chrome palette is identical across all three.

### Brand & Accent
- **Ink** (`{colors.primary}` / `{colors.ink}` — `#201d1d`): the brand''s only "color." Headlines, body text, primary CTA fill, nav links, and every solid icon. Treats nearly-black as the brand color rather than pure black to keep type readable on the warm cream canvas.
- **Ink Deep** (`{colors.ink-deep}` — `#0f0000`): pressed-state for the primary CTA. Carries a faint red undertone matching the canvas''s warm cast.
- **Cream** (`{colors.canvas}` — `#fdfcfc`): the brand''s signature warm white. Used for every page body, every card surface, the on-primary text color, and the ASCII wordmark fill on dark.

### Surface
- **Canvas Cream** (`{colors.canvas}` — `#fdfcfc`): every page body, every card.
- **Soft Surface** (`{colors.surface-soft}` — `#f8f7f7`): text-input default background, testimonial row fill, alternating row tint.
- **Surface Card** (`{colors.surface-card}` — `#f1eeee`): install-snippet pill, disabled button fill, slightly-elevated section row.
- **Surface Dark** (`{colors.surface-dark}` — `#201d1d`): the hero TUI mockup background and the dark CTA pill on the home page. Identical to `{colors.ink}` — the brand uses one near-black for both text and dark surfaces.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — `#302c2c`): the prompt-row inside the hero TUI mockup, one notch lighter than the dark surface itself.
- **Hairline** (`{colors.hairline}` — `rgba(15,0,0,0.12)`): 1px section divider. The translucent warm tint matches the cream canvas''s undertone.
- **Hairline Strong** (`{colors.hairline-strong}` — `#646262`): tab strip''s bottom rule and stronger inline divider.

### Text
- **Ink** (`{colors.ink}` — `#201d1d`): headlines, body text, primary nav links, button text on light surfaces.
- **Charcoal** (`{colors.charcoal}` — `#302c2c`): subtly softer body where pure ink is too heavy.
- **Body** (`{colors.body}` — `#424245`): default paragraph text and FAQ answers.
- **Mute** (`{colors.mute}` — `#646262`): tab labels (default state), metadata, footer link text, in-list secondary annotations.
- **Stone** (`{colors.stone}` — `#6e6e73`): least-emphasis utility text, breadcrumb separators.
- **Ash** (`{colors.ash}` — `#9a9898`): disabled text and secondary annotation in dark TUI mockup, also TUI mockup secondary color.

### Semantic
The full Apple Human Interface Guidelines semantic ramp ships with the system. On marketing pages these colors appear primarily inside the hero TUI mockup as syntax-highlight stand-ins; in the in-product TUI they carry their conventional meaning.

- **Accent** (`{colors.accent}` — `#007aff`): primary informational signal, in-product link color, TUI command highlight.
- **Accent Hover** (`{colors.accent-hover}` — `#0056b3`): pressed informational link.
- **Accent Active** (`{colors.accent-active}` — `#004085`): deeply-pressed informational state.
- **Danger** (`{colors.danger}` — `#ff3b30`): destructive confirmation, error state.
- **Danger Hover** (`{colors.danger-hover}` — `#d70015`): pressed destructive.
- **Danger Active** (`{colors.danger-active}` — `#a50011`): deeply-pressed destructive.
- **Warning** (`{colors.warning}` — `#ff9f0a`): caution callouts.
- **Warning Hover** (`{colors.warning-hover}` — `#cc7f08`): pressed caution.
- **Warning Active** (`{colors.warning-active}` — `#995f06`): deeply-pressed caution.
- **Success** (`{colors.success}` — `#30d158`): positive confirmation, in-TUI success indicator.', '{"sourcePath":"docs/design-md/opencode.ai/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**Berkeley Mono** is the proprietary monospaced face used across every text role in the system. It carries weights 400 (regular), 500 (medium), and 700 (bold) and falls back through a long monospace stack — IBM Plex Mono → ui-monospace → SFMono-Regular → Menlo → Monaco → Consolas → Liberation Mono → Courier New.

The single-font decision is the brand. There is no display face, no body sans, no italic alternative, and no fallback to a proportional font anywhere — even the legal copyright row uses Berkeley Mono at 14px. This is the most aggressive typographic restraint of any site in the marketing-tools category: OpenCode''s identity is "the marketing page is a man page."

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 38px | 700 | 1.5 | 0 | Hero headline ("The open source AI coding agent") |
| `{typography.heading-md}` | 16px | 700 | 1.5 | 0 | Section label ("What is OpenCode?", "FAQ", "Built for privacy first") |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Body copy, paragraph text, list-row text, install-snippet code |
| `{typography.body-strong}` | 16px | 500 | 1.5 | 0 | Inline emphasis, primary nav link, tab-label active |
| `{typography.body-tight}` | 16px | 500 | 1 | 0 | Compact label rendered without breathing room |
| `{typography.link-md}` | 16px | 400 | 1.5 | 0 | Inline anchor link in body prose |
| `{typography.button-md}` | 16px | 500 | 2 | 0 | Every button label across the system |
| `{typography.caption-md}` | 14px | 400 | 2 | 0 | Footer link text, badge label, copyright row, chart caption |

### Principles
The hierarchy is built almost entirely from size and weight contrast on a single face. The display headline (38px / 700) and the heading-md label (16px / 700) share a weight; the difference is just size. Body and link share size, weight, and line-height — only context distinguishes them. Buttons get a deliberately tall line-height (2.0) so labels feel calmly spaced inside the 4px-radius rectangle.

### Note on Font Substitutes
Berkeley Mono is a paid commercial font. Open-source substitutes that approximate its metrics within ~3% at body sizes:
- **JetBrains Mono** — closest match for stroke contrast and x-height; pair at weights 400 / 500 / 700.
- **IBM Plex Mono** — official secondary fallback in the documented font stack; slightly more open counters but matches line-height behavior.
- **Geist Mono** — modern alternative with similar geometric construction.

When substituting, line-height behavior is preserved by keeping `lineHeight: 1.5` for body and `lineHeight: 2` for buttons — adjusting weight is rarely needed.', '{"sourcePath":"docs/design-md/opencode.ai/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 8px (with finer 1/2/4px steps available for tight inline gaps).
- **Tokens (front matter):** `{spacing.xxs}` (1px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (96px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (96px) as the vertical gap between major content blocks. This is the largest spacing token in the system and is the dominant layout cue across the home, `/zen`, and `/enterprise` pages.
- **Section internal padding:** content rows inside a section sit at `{spacing.lg}` (16px) vertical with no horizontal padding — text starts flush at the section''s left edge.

### Grid & Container
- **Max width:** ~960px content column for body sections; the dark hero TUI mockup is full-bleed within an outer ~1100px content frame.
- **Two-column split:** `/enterprise` pairs a left text block (~360px wide) with a right-aligned form column (~480px wide). The home page is single-column reading.
- **Footer:** 5-up horizontal link row (GitHub / Docs / Changelog / Discord / X) at desktop, collapsing to 2-up at tablet and 1-up at mobile.

### Whitespace Philosophy
Whitespace is structural and generous. Sections sit 96px apart with no decorative dividers between them — the `{colors.hairline}` 1px rule is the only signal of separation. Inside a section, content is left-flush against the column edge with no internal indentation; bullets use ASCII bracket prefixes (`[+]` / `[-]`) instead of indent-based layout. The result is a page that feels like a printed code listing rather than a styled marketing layout.', '{"sourcePath":"docs/design-md/opencode.ai/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for body sections, list rows, hero text block, footer |
| 1 — Hairline rule | 1px solid `{colors.hairline}` (translucent warm tint) | Section dividers, between major content blocks |
| 2 — Hairline strong | 1px solid `{colors.hairline-strong}` | Tab strip bottom rule, in-list emphasized divider |
| 3 — Inverted dark | `{colors.surface-dark}` fill | Hero TUI mockup, dark CTA pill — the system''s only "elevated" surface uses color, not shadow |

There are no drop shadows in the system. Nothing lifts, nothing floats. The only way an element registers as "above" another is the dark surface used in the hero mockup.

### Decorative Depth
Depth comes from typography density and the single dark TUI mockup, not from CSS effects:
- **ASCII block-pixel wordmark** — the OpenCode brand name rendered as a 5-row block of monospaced character cells, used in the primary nav and as the centerpiece of the hero TUI mockup.
- **Hero TUI mockup** — full-bleed `{colors.surface-dark}` rectangle containing a faux terminal interface: ASCII wordmark, a `tui-prompt-row` showing a Build command line, and `tab switch agent` / `ctrl-p commands` keybinding hints in `{colors.ash}` at the bottom edge.
- **Chart tiles** — three thin-line ASCII charts inside the home page''s "open source AI coding agent" stat block, with abstract dotted/sparse-line plots in `{colors.body}` against the cream canvas. Captions sit beneath in `{typography.caption-md}` (`Fig 1. 150K GitHub Stars`, `Fig 2. 850 Contributors`, `Fig 3. 6.5M Monthly Devs`).', '{"sourcePath":"docs/design-md/opencode.ai/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Sections, hero TUI mockup, primary nav, footer, list rows — every container that isn''t a button |
| `{rounded.sm}` | 4px | Every interactive element — primary CTA, secondary CTA, text inputs, install snippet, badges, prompt rows |
| `{rounded.full}` | 9999px | Avatar circles in testimonials |

The radius vocabulary is two values: 4px for interactive elements and 0px for everything else. Avatar circles in testimonial rows are the only fully-rounded element in the system.

### Photography Geometry
There is no photography. Visual elements are limited to:
- **ASCII block-pixel wordmark** in the nav and hero TUI mockup.
- **Inline ASCII charts** inside the stat-block section — abstract sparse-line and dotted plots without specific data points.
- **Avatar dots** (~32px) inside testimonial rows on `/zen` — flat colored circles in `{rounded.full}`.
- **In-product icons** (kbd, A+, ⊕, ↻, K, Z) rendered as small monospaced character glyphs, not bitmaps or SVG.', '{"sourcePath":"docs/design-md/opencode.ai/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal OpenCode CTA
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-md}`, padding `4px 20px`, height ~36px, rounded `{rounded.sm}` (4px).
- Used for "Download" (top nav), "Get started with Zen", "Send" (enterprise contact form), "Subscribe" (newsletter footer), "Read docs →".
- Pressed state lives in `button-primary-active` — background drops to `{colors.ink-deep}`.

**`button-secondary`** — outlined alternative
- Background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline-strong}` border, type `{typography.button-md}`, padding `4px 20px`, rounded `{rounded.sm}`.
- Lower-emphasis CTA — appears beside the primary fill where two actions are paired.

**`button-tab`** + **`button-tab-active`** — install-tab strip
- Default: transparent background, text `{colors.mute}`, type `{typography.button-md}`, padding `8px 16px`, rounded `{rounded.none}`.
- Active: same surface, text `{colors.ink}`, with a 2px `{colors.ash}` bottom underline indicating selection.
- Used in the install-method tab strip on the home page (`curl` / `npm` / `bun` / `brew` / `yay`).

**`button-disabled`**
- Background `{colors.surface-card}`, text `{colors.ash}`, rounded `{rounded.sm}`.

### Badges & Chips

**`badge-news`** — small dark chip in the news/announcement strip
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.caption-md}`, padding `2px 8px`, rounded `{rounded.sm}`.
- Sits inline with body copy as a "News" / "Beta" / "Live now" tag on the home page above the hero headline.

**`badge-section-label`** — bracketed section header
- Background transparent, text `{colors.ink}`, type `{typography.heading-md}`, rounded `{rounded.none}`.
- Renders as a bare `**Heading**` line above a 1px `{colors.hairline}` rule with no chip background — but the way the text reads ("[+]", "[x]", `What is OpenCode?`) makes it function as a label component.

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.surface-soft}`, text `{colors.ink}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `8px 12px`, height ~40px, rounded `{rounded.sm}`.
- Focused: background flips to `{colors.canvas}`, border becomes 1px solid `{colors.ink}` (the canvas''s flat focus signal — no halo, no glow).
- Used for every contact-form field on `/enterprise` (Full name, Role, Company, Company email, Phone number) and the newsletter email field at the home page footer.

**`textarea`**
- Background `{colors.surface-soft}`, text `{colors.ink}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `12px`, rounded `{rounded.sm}`.
- "What problem are you trying to solve?" multi-line textarea on `/enterprise`.

**`install-snippet`** — the home page''s signature install code block
- Background `{colors.surface-card}` (`#f1eeee`), text `{colors.ink}` rendered in `{typography.body-md}` (already monospaced — Berkeley Mono), padding `12px 16px`, rounded `{rounded.sm}`.
- Contains the literal `curl -fsSL https://opencode.ai/install | bash` command with a small copy-icon at the right edge. Sits below the install-method tab strip.

### Cards & Containers

**`hero-tui-mockup`** — the home page''s signature TUI preview
- Container: full-bleed `{colors.surface-dark}` (~near-black), padding `64px 32px`, rounded `{rounded.none}`.
- Contents (top → bottom): ASCII block-pixel "OPENCODE" wordmark centered in `{colors.on-dark}`; a `{component.tui-prompt-row}` showing a "Build" command line with model selector text; an `tab switch agent  ctrl-p commands` keybinding hint row at the bottom in `{colors.ash}`.

**`tui-prompt-row`** — the inset command line inside the TUI mockup
- Background `{colors.surface-dark-elevated}` (`#302c2c`), text `{colors.on-dark}` in `{typography.body-md}`, padding `8px 12px`, rounded `{rounded.sm}`.
- Renders an inline command (`Build  Claude Opus 4.5  OpenCode Zen`) with a leading vertical pipe and the model name styled as a bracketed token.

**`list-row`** — feature/benefit row with ASCII bracket bullet
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.body-md}`, padding `8px 0`.
- Each row begins with a `[+]` / `[-]` / `[x]` ASCII marker followed by a bold label and a regular description: e.g., `[+] LSP enabled    Automatically loads the right LSPs for the IDE`. The bracket marker is part of the text content, not a separate icon.

**`faq-row`** — FAQ entry with bracket toggle
- Background `{colors.canvas}`, text `{colors.ink}` in `{typography.body-md}`, padding `12px 0`, with a 1px `{colors.hairline}` bottom rule.
- Each row leads with `+` / `−` ASCII markers indicating expand/collapse state. Always rendered as plain text rows — no chevron icons, no animated accordion chrome.

**`testimonial-row`** — `/zen` peer-quote row
- Background `{colors.surface-soft}`, text `{colors.body}` in `{typography.body-md}`, padding `16px 20px`, rounded `{rounded.sm}`.
- Layout: a 32px avatar circle (`{rounded.full}`) at left, name + role + company in `{typography.body-strong}` on the first line, quote in `{typography.body-md}` `{colors.body}` on the second line.

**`chart-tile`** — the stat-block sparse-line chart
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.caption-md}`, rounded `{rounded.none}`, padding `16px`.
- Contains an inline SVG/CSS-drawn ASCII-style sparse-line plot (dotted, abstract — never specific data points) with a `Fig N. <stat label>` caption beneath in `{colors.mute}`.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}`, text `{colors.ink}` in `{typography.body-strong}`, height ~56px, rounded `{rounded.none}`, with a 1px `{colors.hairline}` bottom rule.
- Layout (desktop): block-pixel ASCII OpenCode wordmark at left (~120×24px), nav links cluster center-right ("GitHub [150K] · Docs · Zen · Go · Enterprise"), `{component.button-primary}` "Download" CTA at the far right with a small download glyph.

**Top Nav (Mobile)**
- ASCII wordmark stays at left, nav links collapse into a hamburger drawer at the right. The Download CTA remains visible at every breakpoint.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.caption-md}`, padding `32px 0`, with a 1px `{colors.hairline}` top rule.
- Top row: 5-column horizontal link grid (GitHub [150K] · Docs · Changelog · Discord · X), each rendered as a centered cell separated by 1px `{colors.hairline}` vertical rules.
- Bottom row: `©2026 Anomaly` copyright at left, `Brand · Privacy · Terms · English ▼` utility cluster at right, all in `{typography.caption-md}` `{colors.mute}`.

### Inline

**`link-inline`** — body-prose anchor link
- `{colors.ink}` text with underline. The brand''s only link affordance — even links inside body paragraphs use ink color rather than `{colors.accent}` blue. Apple Blue is reserved for the in-product TUI.', '{"sourcePath":"docs/design-md/opencode.ai/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Render every text role in Berkeley Mono. The single-font decision is the entire identity.
- Keep `{colors.canvas}` (`#fdfcfc`) as the only body background. Don''t introduce gray section bands.
- Use ASCII bracket markers (`[+]`, `[-]`, `[x]`, `+`, `−`) as bullets, toggles, and section glyphs. They are the brand''s only iconography.
- Anchor the dark `{component.hero-tui-mockup}` exactly once per landing page as the hero centerpiece. Never use the dark surface for body content.
- Reserve `{colors.accent}` (Apple Blue) and the rest of the semantic ramp for in-TUI states; marketing chrome stays monochrome.
- Use `{rounded.sm}` (4px) on every interactive element and `{rounded.none}` (0px) on every container.
- Stack content sections at `{spacing.section}` (96px) rhythm with only 1px `{colors.hairline}` rules between them.

### Don''t
- Don''t introduce a sans-serif body font, a display face, or an italic style. Berkeley Mono carries everything.
- Don''t add drop shadows, gradients, or atmospheric backgrounds. The system is flat-on-cream.
- Don''t replace the ASCII bracket markers with SVG icons. The brackets are the icons.
- Don''t use the semantic accent ramp (`{colors.accent}`, `{colors.warning}`, `{colors.danger}`, `{colors.success}`) on marketing CTAs. They belong to the in-product TUI.
- Don''t pad cards with 24px+ internal padding. List rows sit at 8px vertical; FAQ rows at 12px.
- Don''t render the OpenCode wordmark as a vector logo. It is always block-pixel ASCII.
- Don''t fill the hero TUI mockup with photography or illustration. It is text-only and always shows a faux terminal command line.', '{"sourcePath":"docs/design-md/opencode.ai/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| desktop-large | 1280px+ | Default — 960px content column, 5-up footer link grid |
| desktop | 1024px | Same layout; nav remains horizontal |
| tablet | 850px | Footer collapses to 2-up grid; `/enterprise` two-column form stacks |
| tablet-narrow | 768px | Primary nav becomes hamburger drawer; Download CTA stays visible |
| mobile | 640px | Single-column everything; hero display drops 38px → ~28px; section padding tightens |

### Touch Targets
All interactive elements meet WCAG AA at the ~36–40px height range. `{component.button-primary}` sits at ~36px with 20px horizontal padding. `{component.text-input}` and `{component.textarea}` sit at ~40px. `{component.button-tab}` rows in the install-method strip sit at ~32–36px depending on label length but extend to a full 44px tappable cell via inline padding. Footer links use `{typography.caption-md}` (14px) but receive ~28px line-height (caption-md is 2.0) plus 8px vertical padding for a comfortable ~44px tappable row.

### Collapsing Strategy
- **Primary nav:** desktop horizontal cluster → tablet-narrow hamburger drawer at 768px. The dark "Download" CTA stays visible at all widths.
- **Hero TUI mockup:** maintains its full-bleed dark surface at every breakpoint; the ASCII wordmark scales proportionally and the keybinding-hint row may wrap to two lines on narrow screens.
- **Install snippet + tab strip:** desktop fixed-width pill → mobile full-width pill with horizontal scroll on the tab strip if labels overflow.
- **Footer:** 5-up horizontal link grid → 2-up at tablet → 1-up at mobile (each link becomes a full-width row).
- **`/enterprise` two-column layout:** desktop 50/50 → tablet stacks to single-column with the form below the text block.
- **Section padding:** `{spacing.section}` (96px) desktop → 64px tablet → 48px mobile.
- **Hero headline:** `{typography.display-xl}` (38px) at desktop, scaling to ~28px at mobile, line-height holding at 1.5.

### Image Behavior
There are no raster images in the system aside from the favicon and OG share image. Every visual element — wordmarks, charts, icons — is rendered as type or inline SVG and scales without aspect-ratio considerations.', '{"sourcePath":"docs/design-md/opencode.ai/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry and verify every property resolves.
2. Reference component names and tokens directly (`{colors.ink}`, `{component.hero-tui-mockup}`, `{rounded.sm}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-active`, `-disabled`) — do not bury them inside prose.
5. Default body to `{typography.body-md}`; reach for `{typography.body-strong}` for emphasis; reserve `{typography.display-xl}` strictly for the page-top hero headline.
6. Keep `{colors.surface-dark}` scarce — at most one full-bleed dark mockup per page. The dark surface is a narrative device, not a chrome treatment.
7. When introducing a new component, ask whether it can be expressed with the existing ASCII-bracket + 4px-radius + Berkeley-Mono vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.', '{"sourcePath":"docs/design-md/opencode.ai/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes OpenCode''s mobile pattern (hamburger drawer, single-column, footer accordion) from desktop evidence and the breakpoint stack.
- **Hover states not documented** by system policy.
- **In-product TUI screenshots** beyond the marketing hero mockup are not in the captured set; the actual `opencode` terminal interface (full keybindings, panels, status bar) is not documented here.
- **`/go` page** not extracted — the marketing page for the Go SDK likely shares the same chrome but introduces code-sample blocks not documented above.
- **Form validation state styling** (success / error inline messages) not present in the captured surfaces.', '{"sourcePath":"docs/design-md/opencode.ai/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_1', '#fdfcfc', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_2', '#201d1d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_3', '#0f0000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_4', '#302c2c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_5', '#424245', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_6', '#646262', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_7', '#6e6e73', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_8', '#9a9898', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_9', '#f8f7f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_10', '#f1eeee', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_11', '#007aff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_12', '#0056b3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_13', '#004085', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_14', '#ff9f0a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_15', '#cc7f08', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_16', '#995f06', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_17', '#ff3b30', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_18', '#d70015', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_19', '#a50011', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md'), 'color', 'color_20', '#30d158', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/opencode.ai/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/opencode.ai/DESIGN.md';


-- Pinterest
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Pinterest', 'pinterest', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/pinterest/DESIGN.md', null, 'seeded', '---
version: alpha
name: Pinterest-design-analysis
description: |
  A photography-first discovery system organized around the Pinterest Red CTA, the masonry pin grid, and a soft warm-cream chrome that gets out of the imagery''s way. The home page is a content-discovery tool wearing the chrome of a magazine publisher: 70px display headlines, friendly Pin Sans typography, fully-rounded pill buttons (16px) on a cream-tinted neutral palette, and a sticky red "Sign up" CTA that anchors every viewport. Pin imagery is the system''s load-bearing visual element — square, portrait, and landscape pins tile in a column-based masonry grid where each tile is a fully-rounded 16px-radius card, separated by tight 8px gutters. The chrome is otherwise quiet: warm grays, true whites, and a single saturated red — no decorative gradients, no atmospheric backgrounds, no shadows beyond a soft modal scrim.

colors:
  primary: "#e60023"
  on-primary: "#ffffff"
  primary-pressed: "#cc001f"
  ink: "#000000"
  ink-soft: "#211922"
  body: "#33332e"
  charcoal: "#262622"
  mute: "#62625b"
  ash: "#91918c"
  stone: "#c8c8c1"
  hairline: "#dadad3"
  hairline-soft: "#e5e5e0"
  on-secondary: "#000000"
  secondary-bg: "#e5e5e0"
  secondary-pressed: "#c8c8c1"
  canvas: "#ffffff"
  surface-soft: "#fbfbf9"
  surface-card: "#f6f6f3"
  surface-elevated: "#ffffff"
  on-dark: "#ffffff"
  on-dark-mute: "rgba(255,255,255,0.7)"
  surface-dark: "#262622"
  focus-outer: "#435ee5"
  focus-inner: "#ffffff"
  accent-pressed-blue: "#617bff"
  accent-purple: "#7e238b"
  accent-purple-deep: "#6845ab"
  success-deep: "#103c25"
  success-pale: "#c7f0da"
  error: "#9e0a0a"
  error-deep: "#cc001f"

typography:
  display-xl:
    fontFamily: Pin Sans
    fontSize: 70px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -1.2px
  display-lg:
    fontFamily: Pin Sans
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.8px
  heading-xl:
    fontFamily: Pin Sans
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -1.2px
  heading-lg:
    fontFamily: Pin Sans
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  heading-md:
    fontFamily: Pin Sans
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  body-md:
    fontFamily: Pin Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  body-strong:
    fontFamily: Pin Sans
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-sm:
    fontFamily: Pin Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  body-sm-strong:
    fontFamily: Pin Sans
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0
  caption-md:
    fontFamily: Pin Sans
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  caption-sm:
    fontFamily: Pin Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  link-md:
    fontFamily: Pin Sans
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  button-md:
    fontFamily: Pin Sans
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0
  button-sm:
    fontFamily: Pin Sans
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0

rounded:
  none: 0px
  sm: 8px
  md: 16px
  lg: 32px
  full: 9999px

spacing:
  xxs: 4px
  xs: 6px
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
    rounded: "{rounded.md}"
    padding: 6px 14px
    height: 40px
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.secondary-bg}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 6px 14px
    height: 40px
  button-secondary-pressed:
    backgroundColor: "{colors.secondary-pressed}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
  button-icon-circular:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 40px
  button-pill-on-image:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 14px
  button-disabled:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ash}"
    rounded: "{rounded.md}"
  search-bar:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 11px 15px
    height: 48px
  search-bar-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 11px 15px
    height: 44px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  pin-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 0px
  pin-card-large:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 0px
  pin-overlay-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 6px 12px
  filter-chip:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 16px
  filter-chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
  category-tile:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: 16px
  feature-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-xl}"
    rounded: "{rounded.md}"
    padding: 32px
  feature-card-soft:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-xl}"
    rounded: "{rounded.md}"
    padding: 32px
  modal-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  hero-cta-strip:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.heading-xl}"
    rounded: "{rounded.none}"
    padding: 48px 32px
  primary-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
    height: 64px
  footer-section:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.mute}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 32px 24px
  link-inline:
    textColor: "{colors.ink-soft}"
    typography: "{typography.link-md}"
---

## Overview

Pinterest''s marketing system is built around a single instructional principle: get out of the photograph''s way. The chrome is a quiet warm-cream neutral palette (`{colors.surface-soft}`, `{colors.surface-card}`, `{colors.canvas}`) carrying typography in Pinterest''s proprietary Pin Sans face, with Pinterest Red (`{colors.primary}` — `#e60023`) reserved exclusively for the "Sign up" CTA, the active-tab indicator, and the sticky top-nav anchor. Every other surface is allowed to fade behind the imagery — pin tiles, category tiles, content thumbnails, profile shots — that constitutes the actual product.

The design system has two distinct surface modes that alternate down the home page: the **hero/CTA chrome** (cream surfaces, large 70px Pin Sans display headlines, alternating left/right photo-illustrated feature cards) and the **content masonry** (a column-based grid of 16px-radius pin cards on `{colors.surface-card}` with no internal padding — the pin is the card). The search results page is almost pure masonry: a tight column grid of pin imagery in mixed aspect ratios, with a small filter-chip strip at the top and the sticky red Sign-up CTA in the upper-right corner. The `create.pinterest.com` business surface inverts the grid back to a more traditional editorial layout but keeps every other rule of the system: Pin Sans, cream chrome, red CTA, 16px-radius pills.

The system''s signature gesture is **shape geometry**: 16px radius (`{rounded.md}`) for nearly every surface — buttons, inputs, pin cards, feature cards — and 32px radius (`{rounded.lg}`) reserved for pin-card-large and modal cards. There are exactly three radius values in active use: 16px, 32px, and pill (9999px). The system never goes flat (sharp corners) and never goes radius-medium — those two values are the entire shape vocabulary.

**Key Characteristics:**
- Single-accent CTA: Pinterest Red (`{colors.primary}`) carries every primary action; everything else is monochrome
- Pin Sans proprietary typography across every text role from `{typography.display-xl}` (70px) down to `{typography.caption-sm}` (12px) — no serif, no monospace anywhere
- Two-radius shape system: `{rounded.md}` (16px) for most components, `{rounded.lg}` (32px) for large cards and modals, `{rounded.full}` for circular elements
- Masonry pin grid as the load-bearing visual element — column-based layout where each pin''s natural aspect ratio is preserved
- Warm-cream neutral chrome (`{colors.surface-card}` — #f6f6f3) that softly recedes behind imagery without competing
- Sticky top nav with the always-red Sign-up CTA anchored in the upper-right at every breakpoint
- Modal overlay (login/signup) using a soft scrim over the page content rather than a navigation jump

## Colors

> **Source pages:** `/` (home), `/search/pins/?q=bold lip` (search results), `create.pinterest.com/` (creator marketing), `create.pinterest.com/product-features/how-to-create-boards/` (creator article). The chrome palette is identical across all four pages.

### Brand & Accent
- **Pinterest Red** (`{colors.primary}` — `#e60023`): the brand''s only highly-saturated color. Sign-up CTAs, sticky top-nav anchor, active state in tab strips, and the brand wordmark.
- **Pinterest Red Pressed** (`{colors.primary-pressed}` — `#cc001f`): pressed state for the primary button — a single notch deeper than brand red.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): true white. The base surface for the primary nav, modals, feature cards, and content body.
- **Soft Surface** (`{colors.surface-soft}` — `#fbfbf9`): faintly cream-tinted off-white used for the page body wash on the home page hero.
- **Surface Card** (`{colors.surface-card}` — `#f6f6f3`): warm-cream card and pin-tile background. Carries category tiles, search-bar default fill, button-secondary default, and pin-card backgrounds.
- **Secondary BG** (`{colors.secondary-bg}` — `#e5e5e0`): the gray-cream used for `{component.button-secondary}` ("I already have an account") fill — a notch deeper than `{colors.surface-card}`.
- **Secondary Pressed** (`{colors.secondary-pressed}` — `#c8c8c1`): pressed state for the secondary button.
- **Surface Dark** (`{colors.surface-dark}` — `#262622`): warm near-black used in the rare dark CTA strip on `create.pinterest.com`.
- **Hairline** (`{colors.hairline}` — `#dadad3`): 1px row dividers, footer column rules.
- **Hairline Soft** (`{colors.hairline-soft}` — `#e5e5e0`): lighter inline divider; doubles as the secondary-button background.

### Text
- **Ink** (`{colors.ink}` — `#000000`): primary headlines, button text, primary nav links.
- **Ink Soft** (`{colors.ink-soft}` — `#211922`): inline-link color in body prose. The brand''s only "color" beyond Pinterest Red used in chrome — a near-black with a faint warm cast.
- **Body** (`{colors.body}` — `#33332e`): default paragraph text on `{colors.canvas}`.
- **Charcoal** (`{colors.charcoal}` — `#262622`): subtly softer body where pure ink is too heavy.
- **Mute** (`{colors.mute}` — `#62625b`): metadata text, footer links, secondary captions.
- **Ash** (`{colors.ash}` — `#91918c`): disabled button text, placeholder text in inputs.
- **Stone** (`{colors.stone}` — `#c8c8c1`): least-emphasis utility text, disabled-state borders.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.surface-dark}`.

### Semantic
- **Error** (`{colors.error}` — `#9e0a0a`): validation messages, destructive confirmation copy.
- **Error Deep** (`{colors.error-deep}` — `#cc001f`): deepened error background where the regular error tone needs more contrast. Note: this matches the primary-pressed value but in error context represents semantic destructiveness.
- **Success Deep** (`{colors.success-deep}` — `#103c25`): in-product success messaging.
- **Success Pale** (`{colors.success-pale}` — `#c7f0da`): pale success-pill background.
- **Focus Outer** (`{colors.focus-outer}` — `#435ee5`): the system''s focus-ring blue — appears as a 2px outer outline around focused inputs and buttons.
- **Focus Inner** (`{colors.focus-inner}` — `#ffffff`): white inner gap inside the focus-ring stack.

### Editorial Accents (used sparingly inside content imagery and category badges)
- **Accent Pressed Blue** (`{colors.accent-pressed-blue}` — `#617bff`): pressed state for blue informational badges and editorial pin chips.
- **Accent Purple** (`{colors.accent-purple}` — `#7e238b`): editorial recommendation badge, in-product "Pinterest Predicts" callout.
- **Accent Purple Deep** (`{colors.accent-purple-deep}` — `#6845ab`): paired dark for purple lockups and "Performance+" iconography.

## Typography

### Font Family
**Pin Sans** is Pinterest''s proprietary geometric sans-serif used across every text role on every page. It carries weights 400 (regular), 500 (medium), 600 (semibold), and 700 (bold), and falls back through a long stack — `-apple-system` → `system-ui` → `Segoe UI` → `Roboto` → `Helvetica Neue` → `Arial` plus emoji fallbacks. The face''s distinctive trait is its tight letter-spacing at display sizes (-1.2px on `{typography.display-xl}` and `{typography.heading-xl}`), which gives 70px headlines a confident, friendly density rather than the airy spread of more conventional display geometric sans faces.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 70px | 600 | 1.1 | -1.2px | Marketing hero headline ("Create the life you love on Pinterest") |
| `{typography.display-lg}` | 44px | 700 | 1.15 | -0.8px | "Where your content can thrive" creator hero |
| `{typography.heading-xl}` | 28px | 700 | 1.2 | -1.2px | Section heading ("Bring your favorite ideas to life", "Pinterest for your brand") |
| `{typography.heading-lg}` | 22px | 600 | 1.25 | 0 | Sub-section heading, modal title ("Welcome to Pinterest") |
| `{typography.heading-md}` | 18px | 600 | 1.3 | 0 | Card title, in-grid pin label |
| `{typography.body-md}` | 16px | 400 | 1.4 | 0 | Body copy, modal body, default paragraph |
| `{typography.body-strong}` | 16px | 600 | 1.4 | 0 | Inline emphasis, primary nav link, form label |
| `{typography.body-sm}` | 14px | 400 | 1.4 | 0 | Footer copy, in-grid pin metadata, helper text |
| `{typography.body-sm-strong}` | 14px | 700 | 1.4 | 0 | Search-result count label, table-header text |
| `{typography.caption-md}` | 12px | 500 | 1.5 | 0 | Caption text, link metadata |
| `{typography.caption-sm}` | 12px | 400 | 1.4 | 0 | Smallest utility text, copyright |
| `{typography.link-md}` | 16px | 600 | 1.4 | 0 | Inline anchor link in body prose |
| `{typography.button-md}` | 14px | 700 | 1 | 0 | Standard primary/secondary button label |
| `{typography.button-sm}` | 12px | 700 | 1 | 0 | Compact pill chip, in-card button |

### Principles
The system has an unusually steep size jump between display and body — `{typography.display-xl}` (70px) drops directly to `{typography.body-md}` (16px) on the home hero with no intermediate tier between. The negative tracking on the largest tiers (-1.2px / -0.8px) creates a tighter, more confident headline than a default geometric sans would deliver, and the body copy sits at a generous 1.4 line-height to keep multi-line descriptions breathing.

### Note on Font Substitutes
Pin Sans is proprietary. The closest open-source substitute is **Inter** (weights 400 / 500 / 600 / 700) — its geometry, x-height, and metric balance match Pin Sans within ~3% at body sizes. **Manrope** is a strong secondary substitute for the display tier where slightly tighter letterspacing helps the 70px headline feel weighted. Apply -1.2px tracking on the substitute at display sizes regardless of which substitute is chosen.

## Layout

### Spacing System
- **Base unit:** 8px (with finer 4/6/7px steps available for tight inline gaps in pill buttons and chips).
- **Tokens (front matter):** `{spacing.xxs}` (4px) · `{spacing.xs}` (6px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (64px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (64px) as the vertical gap between major content blocks. Pin grids use `{spacing.sm}` (8px) gutters between tiles — the tightest grid gutter in the system, designed so imagery effectively touches across columns.
- **Modal padding:** `{component.modal-card}` uses 32px internal padding (`{spacing.xxl}`) on all sides.

### Grid & Container
- **Max width:** ~1280px content area at desktop with 24px gutters (~48px at ultrawide).
- **Pin masonry grid:** auto-fitting column-based layout — 5–6 columns at ultrawide, 4 columns at desktop, 3 at tablet, 2 at mobile-landscape, 1 at mobile. Each tile preserves its natural aspect ratio (square / 2:3 / 3:4 / 4:5 portrait — never landscape because pins are vertically-oriented). Gutters are `{spacing.sm}` (8px) horizontal and vertical.
- **Home hero feature row:** asymmetric 2-column split where text and imagery alternate left/right down the page (text-left + image-right, then image-left + text-right, etc.).
- **Footer:** 4-column link grid at desktop, collapsing to 2-up at tablet, 1-up at mobile.

### Whitespace Philosophy
Whitespace is generous on the marketing surfaces and tight on the discovery surfaces. The home page sits sections 64px apart with photo-illustrated feature cards using 32px internal padding, while the search results page collapses to an 8px-gutter masonry grid that tiles imagery edge-to-edge. The system reads as two tools sharing the same chrome: a magazine (hero / feature / CTA / footer) and a search engine (top nav / filter row / pin grid / load more).

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for pin cards, feature cards, footer — the dominant treatment |
| 1 — Hairline border | 1px solid `{colors.hairline}` | Inputs, footer column dividers, in-list rows |
| 2 — Modal scrim + soft shadow | Modal sits on a dark scrim over the page content with a soft 16px ambient shadow | Login / signup modal, image preview modal |
| 3 — Pin hover lift | (intentionally undocumented per system policy) | n/a |

Pinterest''s system has effectively no shadow elevation in its content surfaces. Pin cards sit flat on the canvas; the only "elevation" appears on the modal layer where a 16px ambient shadow paired with a 50%-opacity scrim lifts the modal above the page content.

### Decorative Depth
Depth comes entirely from the imagery itself, not from CSS effects:
- **Pin photography** carries cinematic depth through composition (food photography, fashion close-ups, interior shots) — the design lets each tile''s image speak rather than adding chrome to it.
- **Category tile thumbnails** in the home page''s feature rows use Pinterest''s own pin imagery as composition assets, often with a small `{component.pin-overlay-pill}` ("Cherry red", "Preppy look", "Earthy space inspo") overlaid in the corner of the image.
- **Modal scrim** — a 50%-opacity dark overlay over the entire page content when the login modal opens, with a 16px ambient shadow underneath the modal card lifting it to the visual top.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Footer, primary nav, page sections — all flat structural surfaces |
| `{rounded.sm}` | 8px | Rare medium-radius surface (e.g., editorial tooltip) |
| `{rounded.md}` | 16px | Buttons, inputs, pin cards, feature cards, category tiles — the dominant component radius |
| `{rounded.lg}` | 32px | Large pin cards, modal cards — used sparingly for "big" content surfaces |
| `{rounded.full}` | 9999px | Search bar, filter chips, pin overlay pills, icon-circular buttons, avatars |

The radius vocabulary is essentially three values: 16px for most things, 32px for big cards and modals, and pill for circular elements. There are no sharp-cornered buttons or sharp-cornered pin cards.

### Photography Geometry
- **Pin imagery:** mixed aspect ratios — square (1:1), portrait (3:4, 2:3, 4:5), and rare landscape — preserved at their natural ratio inside `{rounded.md}` (16px) corners on small tiles and `{rounded.lg}` (32px) on large feature pins.
- **Category tile thumbnails:** square (1:1) with `{rounded.md}` corners.
- **Avatar circles:** 32–48px at `{rounded.full}` for in-pin attribution and profile chips.
- **Feature card imagery:** typically 4:5 portrait on home-page category cards, with the photo occupying ~60% of the card and the headline + CTA stacked beneath.

## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal Pinterest CTA
- Background `{colors.primary}` (Pinterest Red), text `{colors.on-primary}`, type `{typography.button-md}`, padding `6px 14px`, height ~40px, rounded `{rounded.md}` (16px).
- Used for "Sign up", "Join Pinterest for free", "Get started" — every primary action across every surface in the system.
- Pressed state lives in `button-primary-pressed` — background drops to `{colors.primary-pressed}` (`#cc001f`).

**`button-secondary`** — gray-cream alternative
- Background `{colors.secondary-bg}` (`#e5e5e0`), text `{colors.on-secondary}`, type `{typography.button-md}`, padding `6px 14px`, height ~40px, rounded `{rounded.md}`.
- "I already have an account", "Continue", "Cancel" — second-tier actions paired with the red primary.
- Pressed state lives in `button-secondary-pressed` — background drops to `{colors.secondary-pressed}`.

**`button-tertiary`** — ghost link
- Background transparent, text `{colors.ink}`, type `{typography.button-md}`, rounded `{rounded.md}`.
- Used for low-emphasis actions inside dialogs ("Read the docs", "Learn more →" with a small chevron).

**`button-icon-circular`** — circular icon button
- Background `{colors.surface-card}`, icon `{colors.ink}`, rounded `{rounded.full}`, size 40px.
- Carousel paddles, modal close button, and small floating action buttons in pin imagery.

**`button-pill-on-image`** — small overlay pill on photography
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-md}`, rounded `{rounded.full}`, padding `8px 14px`.
- The signature "Cherry red" / "Preppy look" / "Earthy space inspo" overlay pill that anchors the corner of category-tile pin imagery.

**`button-disabled`**
- Background `{colors.surface-card}`, text `{colors.ash}` — flat soft-cream.

### Filter & Tab Chips

**`filter-chip`** + **`filter-chip-active`**
- Default: background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.button-md}`, rounded `{rounded.full}`, padding `8px 16px`.
- Active: background `{colors.ink}`, text `{colors.on-dark}` — the chip flips fully inverted on selection.
- Used across the search results page filter strip ("Beauty makeup", "Lipstick", "Editorial makeup"...).

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.ash}`, type `{typography.body-md}`, padding `11px 15px`, height ~44px, rounded `{rounded.md}`.
- Focused: 2px `{colors.ink}` inner border + 4px `{colors.focus-outer}` outer outline — the signature double-ring focus signal.
- Used across the login/signup modal for email, password, birthdate, country fields.

**`search-bar`** + **`search-bar-focused`**
- Default: background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-md}`, padding `11px 15px`, height ~48px, rounded `{rounded.full}`.
- Focused: same dimensions, background flips to `{colors.canvas}` with a 1px `{colors.ash}` border.
- Anchored in the center of the primary nav with a magnifier glyph at the left edge and "Search for ideas, fashion..." placeholder.

### Cards & Containers

**`pin-card`** — the standard masonry pin tile
- Container: background `{colors.surface-card}`, rounded `{rounded.md}` (16px), padding 0.
- Layout: full-bleed image at the card''s natural aspect ratio with no internal padding. Optional `{component.pin-overlay-pill}` anchored to one corner of the image, optional 32px circular avatar with profile name in `{typography.body-sm-strong}` overlaid at the bottom-left.

**`pin-card-large`** — the home-page feature pin
- Identical to `pin-card` but rounded `{rounded.lg}` (32px) — used for the large editorial pins that anchor home-page feature rows.

**`pin-overlay-pill`** — anchored chip on pin imagery
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-sm}`, rounded `{rounded.full}`, padding `6px 12px`.
- Floats over a pin''s bottom-left or top-left corner with the search-term label that surfaces if the pin matches a search ("Cherry red", "Preppy look", "Earthy space inspo").

**`category-tile`**
- Background `{colors.surface-card}`, rounded `{rounded.md}`, padding 16px.
- 3- or 4-up grid of small category thumbnails inside the home-page "Bring your favorite ideas to life" section. Each tile contains a category icon or composition photograph + a short label in `{typography.body-strong}`.

**`feature-card`** + **`feature-card-soft`**
- Standard: background `{colors.canvas}`, rounded `{rounded.md}`, padding 32px. Pairs a 4:5 portrait pin image (left or right) with a `{typography.heading-xl}` headline + body copy + `{component.button-primary}` red CTA.
- Soft: background `{colors.surface-card}` for the alternating-row variant where the cream surface is needed to break up content.

**`modal-card`** — login/signup overlay
- Background `{colors.canvas}`, rounded `{rounded.lg}` (32px), padding 32px.
- Layout: title in `{typography.heading-lg}` ("Welcome to Pinterest"), subtitle in `{typography.body-md}`, stacked `{component.text-input}` fields (Email, Password, Birthdate, Country), primary `{component.button-primary}` "Continue", small "Already a member? Log in" link below.
- Floats over a 50%-opacity scrim covering the entire page content with a 16px ambient shadow.

**`hero-cta-strip`** — dark CTA strip on `create.pinterest.com`
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.heading-xl}`, padding `48px 32px`, rounded `{rounded.none}`.
- Sits at the top of the creator marketing page with a single `{component.button-primary}` red CTA on the right.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}`, text `{colors.ink}`, height ~64px, type `{typography.body-strong}`, rounded `{rounded.none}`, with a 1px `{colors.hairline}` bottom rule on inner pages (no rule on the home hero).
- Layout (desktop home): Pinterest red wordmark at left + "Explore" link, centered `{component.search-bar}`, right cluster ("About / Businesses / Create / Log in" + the always-red `{component.button-primary}` "Sign up" CTA).
- Layout (search results): Pinterest red P-logo at left, centered search bar with the active query, right cluster ("Log in" + red Sign-up button).

**Top Nav (Mobile)**
- Hamburger menu icon at left, P-logo at center, search-glyph + Sign-up CTA at right. Search bar collapses into the magnifier icon and expands to full-width when tapped.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, text `{colors.mute}` in `{typography.body-sm}`, padding `32px 24px`, rounded `{rounded.none}`, with a 1px `{colors.hairline}` top rule.
- Layout: 4-column link grid (Get the app — iOS / Android · Quick Links — Explore / Shop / Users / Collections / Shopping · Pinterest for · About — Privacy / Terms / Help Center) with column headers in `{typography.body-sm-strong}` and link lists in `{typography.body-sm}` `{colors.mute}`.
- Bottom row: Pinterest red wordmark + "© 2026 Pinterest" in `{typography.caption-sm}` `{colors.mute}`.

### Inline

**`link-inline`** — body-prose anchor link
- `{colors.ink-soft}` text with no underline by default. Pinterest''s only "color" beyond brand red on chrome — a near-black warm tint used inline to differentiate links from body without color contrast.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (Pinterest Red) for primary CTAs, the active-tab indicator, and the brand wordmark only. It is never decorative.
- Use `{rounded.md}` (16px) on every interactive element and standard card; reserve `{rounded.lg}` (32px) for large pin cards and modals; reserve `{rounded.full}` for circular elements (search bar, chips, avatars).
- Stage every pin image inside a `{component.pin-card}` with no internal padding — the photograph IS the card.
- Stack content sections at `{spacing.section}` (64px) rhythm; tighten pin grids to `{spacing.sm}` (8px) gutters so imagery effectively touches.
- Use `{component.pin-overlay-pill}` to anchor a search-term tag in the corner of a category-tile pin photograph — the system''s signature decorative gesture.
- Build hierarchy from font weight (400 → 600 → 700) and size, not from color tinting. Body stays `{colors.body}` regardless of section context.
- Apply -1.2px letter-spacing on `{typography.display-xl}` and `{typography.heading-xl}`. The negative tracking is part of the brand voice.

### Don''t
- Don''t use sharp-cornered buttons or cards. There are no `{rounded.none}` interactive elements in the system.
- Don''t introduce drop shadows on cards. The only shadow in the system is the 16px ambient under `{component.modal-card}`.
- Don''t pad `{component.pin-card}` internally. The image is full-bleed; metadata sits over the image as an overlay pill, not below it.
- Don''t replace `{colors.primary}` with another red. The brand red is precise — `#e60023`.
- Don''t use `{colors.ink-soft}` (the body-prose link tint) outside of inline body anchor links. It is not a chrome color.
- Don''t introduce a third radius value between 16px and 32px. The system jumps directly from md to lg with nothing in between.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Pin grid expands to 5–6 columns; content max-width holds at ~1280px |
| desktop-large | 1440px | Default — 4-column pin grid, full primary nav |
| desktop | 1280px | Same layout with narrower outer gutters |
| desktop-small | 1024px | Pin grid collapses to 3 columns; sub-nav remains horizontal |
| tablet | 768px | Pin grid collapses to 2 columns; primary nav becomes hamburger drawer; search bar becomes icon-only |
| mobile | 480px | Single-column pin grid; hero `{typography.display-xl}` scales 70px → ~44px |
| mobile-narrow | 320px | Hero further scales to ~36px; section padding tightens to 32px |

### Touch Targets
All interactive elements meet WCAG AA (≥ 44×44px). `{component.button-primary}` and `{component.button-secondary}` sit at ~40px height with 14px horizontal padding (effective ~40×80px tappable). `{component.search-bar}` sits at 48px. `{component.text-input}` sits at 44px. `{component.filter-chip}` is ~36–40px height with 16px padding — extends to 44px tappable via inline padding. `{component.button-icon-circular}` is exactly 40×40 with extended hit-target padding to 48×48 inside the parent.

### Collapsing Strategy
- **Primary nav:** desktop horizontal cluster → tablet hamburger drawer at 768px. The red Sign-up CTA stays visible at every breakpoint.
- **Search bar:** desktop centered (~480px wide) → tablet compressed (~320px) → mobile collapses to a magnifier icon that expands to a full-width overlay on tap.
- **Pin masonry grid:** 5/6-up → 4-up → 3-up → 2-up → 1-up at 1920, 1024, 768, and 480px. Gutters drop from 8px to 6px on mobile.
- **Home feature row:** desktop alternating left/right 2-column → tablet vertical stack with text above image → mobile single-column with full-bleed image.
- **Modal:** desktop centered ~480px-wide card → mobile full-width sheet with rounded `{rounded.lg}` top-only and bottom-anchored CTA.
- **Section padding:** `{spacing.section}` (64px) desktop → 48px tablet → 32px mobile.
- **Hero headline:** `{typography.display-xl}` (70px) at desktop, scaling 56px / 44px / 36px down the breakpoint stack.
- **Footer:** 4-up link columns → 2-up at tablet → full accordion at mobile (each header becomes a tap-to-expand row).

### Image Behavior
- Pin imagery preserves natural aspect ratio at every breakpoint; the column count changes, not the aspect.
- Category tile thumbnails maintain 1:1 across all sizes.
- Hero feature imagery uses art-direction crops on mobile (4:5 portrait → square) so the subject stays centered when the layout collapses to single-column.
- All non-critical imagery is lazy-loaded as the user scrolls into the next grid row.

## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.md}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-pressed`, `-disabled`, `-focused`) — do not bury them inside prose.
5. Default body to `{typography.body-md}`; reach for `{typography.body-strong}` for emphasis; reserve `{typography.display-xl}` strictly for top-of-page hero headlines.
6. Keep `{colors.primary}` scarce — at most one Pinterest-red CTA per fold (counting nav, hero, and feature-card CTAs together).
7. When introducing a new component, ask whether it can be expressed with the existing pin-card + 16px-radius + cream-surface vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.

## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes Pinterest''s known mobile pattern (hamburger drawer, single-column grid, hero downscale) from desktop evidence and the documented breakpoint stack.
- **Hover states not documented** by system policy.
- **Pin-detail close-up (single pin overlay)** is not in the captured set — the in-product Pin detail view (with comments, related pins, save board picker) likely introduces components not documented here.
- **Authenticated chrome** (logged-in home feed, board pages, profile pages) not in the captured pages — the captured surfaces are the logged-out marketing and search experience.
- **Pinterest mobile app screens** not in the system documented here — this is the web-only chrome.
- **Form validation states** (success / error inline messages) not documented; only the focused-state field is captured.
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

Pinterest''s marketing system is built around a single instructional principle: get out of the photograph''s way. The chrome is a quiet warm-cream neutral palette (`{colors.surface-soft}`, `{colors.surface-card}`, `{colors.canvas}`) carrying typography in Pinterest''s proprietary Pin Sans face, with Pinterest Red (`{colors.primary}` — `#e60023`) reserved exclusively for the "Sign up" CTA, the active-tab indicator, and the sticky top-nav anchor. Every other surface is allowed to fade behind the imagery — pin tiles, category tiles, content thumbnails, profile shots — that constitutes the actual product.

The design system has two distinct surface modes that alternate down the home page: the **hero/CTA chrome** (cream surfaces, large 70px Pin Sans display headlines, alternating left/right photo-illustrated feature cards) and the **content masonry** (a column-based grid of 16px-radius pin cards on `{colors.surface-card}` with no internal padding — the pin is the card). The search results page is almost pure masonry: a tight column grid of pin imagery in mixed aspect ratios, with a small filter-chip strip at the top and the sticky red Sign-up CTA in the upper-right corner. The `create.pinterest.com` business surface inverts the grid back to a more traditional editorial layout but keeps every other rule of the system: Pin Sans, cream chrome, red CTA, 16px-radius pills.

The system''s signature gesture is **shape geometry**: 16px radius (`{rounded.md}`) for nearly every surface — buttons, inputs, pin cards, feature cards — and 32px radius (`{rounded.lg}`) reserved for pin-card-large and modal cards. There are exactly three radius values in active use: 16px, 32px, and pill (9999px). The system never goes flat (sharp corners) and never goes radius-medium — those two values are the entire shape vocabulary.

**Key Characteristics:**
- Single-accent CTA: Pinterest Red (`{colors.primary}`) carries every primary action; everything else is monochrome
- Pin Sans proprietary typography across every text role from `{typography.display-xl}` (70px) down to `{typography.caption-sm}` (12px) — no serif, no monospace anywhere
- Two-radius shape system: `{rounded.md}` (16px) for most components, `{rounded.lg}` (32px) for large cards and modals, `{rounded.full}` for circular elements
- Masonry pin grid as the load-bearing visual element — column-based layout where each pin''s natural aspect ratio is preserved
- Warm-cream neutral chrome (`{colors.surface-card}` — #f6f6f3) that softly recedes behind imagery without competing
- Sticky top nav with the always-red Sign-up CTA anchored in the upper-right at every breakpoint
- Modal overlay (login/signup) using a soft scrim over the page content rather than a navigation jump', '{"sourcePath":"docs/design-md/pinterest/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> **Source pages:** `/` (home), `/search/pins/?q=bold lip` (search results), `create.pinterest.com/` (creator marketing), `create.pinterest.com/product-features/how-to-create-boards/` (creator article). The chrome palette is identical across all four pages.

### Brand & Accent
- **Pinterest Red** (`{colors.primary}` — `#e60023`): the brand''s only highly-saturated color. Sign-up CTAs, sticky top-nav anchor, active state in tab strips, and the brand wordmark.
- **Pinterest Red Pressed** (`{colors.primary-pressed}` — `#cc001f`): pressed state for the primary button — a single notch deeper than brand red.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): true white. The base surface for the primary nav, modals, feature cards, and content body.
- **Soft Surface** (`{colors.surface-soft}` — `#fbfbf9`): faintly cream-tinted off-white used for the page body wash on the home page hero.
- **Surface Card** (`{colors.surface-card}` — `#f6f6f3`): warm-cream card and pin-tile background. Carries category tiles, search-bar default fill, button-secondary default, and pin-card backgrounds.
- **Secondary BG** (`{colors.secondary-bg}` — `#e5e5e0`): the gray-cream used for `{component.button-secondary}` ("I already have an account") fill — a notch deeper than `{colors.surface-card}`.
- **Secondary Pressed** (`{colors.secondary-pressed}` — `#c8c8c1`): pressed state for the secondary button.
- **Surface Dark** (`{colors.surface-dark}` — `#262622`): warm near-black used in the rare dark CTA strip on `create.pinterest.com`.
- **Hairline** (`{colors.hairline}` — `#dadad3`): 1px row dividers, footer column rules.
- **Hairline Soft** (`{colors.hairline-soft}` — `#e5e5e0`): lighter inline divider; doubles as the secondary-button background.

### Text
- **Ink** (`{colors.ink}` — `#000000`): primary headlines, button text, primary nav links.
- **Ink Soft** (`{colors.ink-soft}` — `#211922`): inline-link color in body prose. The brand''s only "color" beyond Pinterest Red used in chrome — a near-black with a faint warm cast.
- **Body** (`{colors.body}` — `#33332e`): default paragraph text on `{colors.canvas}`.
- **Charcoal** (`{colors.charcoal}` — `#262622`): subtly softer body where pure ink is too heavy.
- **Mute** (`{colors.mute}` — `#62625b`): metadata text, footer links, secondary captions.
- **Ash** (`{colors.ash}` — `#91918c`): disabled button text, placeholder text in inputs.
- **Stone** (`{colors.stone}` — `#c8c8c1`): least-emphasis utility text, disabled-state borders.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.surface-dark}`.

### Semantic
- **Error** (`{colors.error}` — `#9e0a0a`): validation messages, destructive confirmation copy.
- **Error Deep** (`{colors.error-deep}` — `#cc001f`): deepened error background where the regular error tone needs more contrast. Note: this matches the primary-pressed value but in error context represents semantic destructiveness.
- **Success Deep** (`{colors.success-deep}` — `#103c25`): in-product success messaging.
- **Success Pale** (`{colors.success-pale}` — `#c7f0da`): pale success-pill background.
- **Focus Outer** (`{colors.focus-outer}` — `#435ee5`): the system''s focus-ring blue — appears as a 2px outer outline around focused inputs and buttons.
- **Focus Inner** (`{colors.focus-inner}` — `#ffffff`): white inner gap inside the focus-ring stack.

### Editorial Accents (used sparingly inside content imagery and category badges)
- **Accent Pressed Blue** (`{colors.accent-pressed-blue}` — `#617bff`): pressed state for blue informational badges and editorial pin chips.
- **Accent Purple** (`{colors.accent-purple}` — `#7e238b`): editorial recommendation badge, in-product "Pinterest Predicts" callout.
- **Accent Purple Deep** (`{colors.accent-purple-deep}` — `#6845ab`): paired dark for purple lockups and "Performance+" iconography.', '{"sourcePath":"docs/design-md/pinterest/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**Pin Sans** is Pinterest''s proprietary geometric sans-serif used across every text role on every page. It carries weights 400 (regular), 500 (medium), 600 (semibold), and 700 (bold), and falls back through a long stack — `-apple-system` → `system-ui` → `Segoe UI` → `Roboto` → `Helvetica Neue` → `Arial` plus emoji fallbacks. The face''s distinctive trait is its tight letter-spacing at display sizes (-1.2px on `{typography.display-xl}` and `{typography.heading-xl}`), which gives 70px headlines a confident, friendly density rather than the airy spread of more conventional display geometric sans faces.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 70px | 600 | 1.1 | -1.2px | Marketing hero headline ("Create the life you love on Pinterest") |
| `{typography.display-lg}` | 44px | 700 | 1.15 | -0.8px | "Where your content can thrive" creator hero |
| `{typography.heading-xl}` | 28px | 700 | 1.2 | -1.2px | Section heading ("Bring your favorite ideas to life", "Pinterest for your brand") |
| `{typography.heading-lg}` | 22px | 600 | 1.25 | 0 | Sub-section heading, modal title ("Welcome to Pinterest") |
| `{typography.heading-md}` | 18px | 600 | 1.3 | 0 | Card title, in-grid pin label |
| `{typography.body-md}` | 16px | 400 | 1.4 | 0 | Body copy, modal body, default paragraph |
| `{typography.body-strong}` | 16px | 600 | 1.4 | 0 | Inline emphasis, primary nav link, form label |
| `{typography.body-sm}` | 14px | 400 | 1.4 | 0 | Footer copy, in-grid pin metadata, helper text |
| `{typography.body-sm-strong}` | 14px | 700 | 1.4 | 0 | Search-result count label, table-header text |
| `{typography.caption-md}` | 12px | 500 | 1.5 | 0 | Caption text, link metadata |
| `{typography.caption-sm}` | 12px | 400 | 1.4 | 0 | Smallest utility text, copyright |
| `{typography.link-md}` | 16px | 600 | 1.4 | 0 | Inline anchor link in body prose |
| `{typography.button-md}` | 14px | 700 | 1 | 0 | Standard primary/secondary button label |
| `{typography.button-sm}` | 12px | 700 | 1 | 0 | Compact pill chip, in-card button |

### Principles
The system has an unusually steep size jump between display and body — `{typography.display-xl}` (70px) drops directly to `{typography.body-md}` (16px) on the home hero with no intermediate tier between. The negative tracking on the largest tiers (-1.2px / -0.8px) creates a tighter, more confident headline than a default geometric sans would deliver, and the body copy sits at a generous 1.4 line-height to keep multi-line descriptions breathing.

### Note on Font Substitutes
Pin Sans is proprietary. The closest open-source substitute is **Inter** (weights 400 / 500 / 600 / 700) — its geometry, x-height, and metric balance match Pin Sans within ~3% at body sizes. **Manrope** is a strong secondary substitute for the display tier where slightly tighter letterspacing helps the 70px headline feel weighted. Apply -1.2px tracking on the substitute at display sizes regardless of which substitute is chosen.', '{"sourcePath":"docs/design-md/pinterest/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 8px (with finer 4/6/7px steps available for tight inline gaps in pill buttons and chips).
- **Tokens (front matter):** `{spacing.xxs}` (4px) · `{spacing.xs}` (6px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (64px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (64px) as the vertical gap between major content blocks. Pin grids use `{spacing.sm}` (8px) gutters between tiles — the tightest grid gutter in the system, designed so imagery effectively touches across columns.
- **Modal padding:** `{component.modal-card}` uses 32px internal padding (`{spacing.xxl}`) on all sides.

### Grid & Container
- **Max width:** ~1280px content area at desktop with 24px gutters (~48px at ultrawide).
- **Pin masonry grid:** auto-fitting column-based layout — 5–6 columns at ultrawide, 4 columns at desktop, 3 at tablet, 2 at mobile-landscape, 1 at mobile. Each tile preserves its natural aspect ratio (square / 2:3 / 3:4 / 4:5 portrait — never landscape because pins are vertically-oriented). Gutters are `{spacing.sm}` (8px) horizontal and vertical.
- **Home hero feature row:** asymmetric 2-column split where text and imagery alternate left/right down the page (text-left + image-right, then image-left + text-right, etc.).
- **Footer:** 4-column link grid at desktop, collapsing to 2-up at tablet, 1-up at mobile.

### Whitespace Philosophy
Whitespace is generous on the marketing surfaces and tight on the discovery surfaces. The home page sits sections 64px apart with photo-illustrated feature cards using 32px internal padding, while the search results page collapses to an 8px-gutter masonry grid that tiles imagery edge-to-edge. The system reads as two tools sharing the same chrome: a magazine (hero / feature / CTA / footer) and a search engine (top nav / filter row / pin grid / load more).', '{"sourcePath":"docs/design-md/pinterest/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for pin cards, feature cards, footer — the dominant treatment |
| 1 — Hairline border | 1px solid `{colors.hairline}` | Inputs, footer column dividers, in-list rows |
| 2 — Modal scrim + soft shadow | Modal sits on a dark scrim over the page content with a soft 16px ambient shadow | Login / signup modal, image preview modal |
| 3 — Pin hover lift | (intentionally undocumented per system policy) | n/a |

Pinterest''s system has effectively no shadow elevation in its content surfaces. Pin cards sit flat on the canvas; the only "elevation" appears on the modal layer where a 16px ambient shadow paired with a 50%-opacity scrim lifts the modal above the page content.

### Decorative Depth
Depth comes entirely from the imagery itself, not from CSS effects:
- **Pin photography** carries cinematic depth through composition (food photography, fashion close-ups, interior shots) — the design lets each tile''s image speak rather than adding chrome to it.
- **Category tile thumbnails** in the home page''s feature rows use Pinterest''s own pin imagery as composition assets, often with a small `{component.pin-overlay-pill}` ("Cherry red", "Preppy look", "Earthy space inspo") overlaid in the corner of the image.
- **Modal scrim** — a 50%-opacity dark overlay over the entire page content when the login modal opens, with a 16px ambient shadow underneath the modal card lifting it to the visual top.', '{"sourcePath":"docs/design-md/pinterest/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Footer, primary nav, page sections — all flat structural surfaces |
| `{rounded.sm}` | 8px | Rare medium-radius surface (e.g., editorial tooltip) |
| `{rounded.md}` | 16px | Buttons, inputs, pin cards, feature cards, category tiles — the dominant component radius |
| `{rounded.lg}` | 32px | Large pin cards, modal cards — used sparingly for "big" content surfaces |
| `{rounded.full}` | 9999px | Search bar, filter chips, pin overlay pills, icon-circular buttons, avatars |

The radius vocabulary is essentially three values: 16px for most things, 32px for big cards and modals, and pill for circular elements. There are no sharp-cornered buttons or sharp-cornered pin cards.

### Photography Geometry
- **Pin imagery:** mixed aspect ratios — square (1:1), portrait (3:4, 2:3, 4:5), and rare landscape — preserved at their natural ratio inside `{rounded.md}` (16px) corners on small tiles and `{rounded.lg}` (32px) on large feature pins.
- **Category tile thumbnails:** square (1:1) with `{rounded.md}` corners.
- **Avatar circles:** 32–48px at `{rounded.full}` for in-pin attribution and profile chips.
- **Feature card imagery:** typically 4:5 portrait on home-page category cards, with the photo occupying ~60% of the card and the headline + CTA stacked beneath.', '{"sourcePath":"docs/design-md/pinterest/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal Pinterest CTA
- Background `{colors.primary}` (Pinterest Red), text `{colors.on-primary}`, type `{typography.button-md}`, padding `6px 14px`, height ~40px, rounded `{rounded.md}` (16px).
- Used for "Sign up", "Join Pinterest for free", "Get started" — every primary action across every surface in the system.
- Pressed state lives in `button-primary-pressed` — background drops to `{colors.primary-pressed}` (`#cc001f`).

**`button-secondary`** — gray-cream alternative
- Background `{colors.secondary-bg}` (`#e5e5e0`), text `{colors.on-secondary}`, type `{typography.button-md}`, padding `6px 14px`, height ~40px, rounded `{rounded.md}`.
- "I already have an account", "Continue", "Cancel" — second-tier actions paired with the red primary.
- Pressed state lives in `button-secondary-pressed` — background drops to `{colors.secondary-pressed}`.

**`button-tertiary`** — ghost link
- Background transparent, text `{colors.ink}`, type `{typography.button-md}`, rounded `{rounded.md}`.
- Used for low-emphasis actions inside dialogs ("Read the docs", "Learn more →" with a small chevron).

**`button-icon-circular`** — circular icon button
- Background `{colors.surface-card}`, icon `{colors.ink}`, rounded `{rounded.full}`, size 40px.
- Carousel paddles, modal close button, and small floating action buttons in pin imagery.

**`button-pill-on-image`** — small overlay pill on photography
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-md}`, rounded `{rounded.full}`, padding `8px 14px`.
- The signature "Cherry red" / "Preppy look" / "Earthy space inspo" overlay pill that anchors the corner of category-tile pin imagery.

**`button-disabled`**
- Background `{colors.surface-card}`, text `{colors.ash}` — flat soft-cream.

### Filter & Tab Chips

**`filter-chip`** + **`filter-chip-active`**
- Default: background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.button-md}`, rounded `{rounded.full}`, padding `8px 16px`.
- Active: background `{colors.ink}`, text `{colors.on-dark}` — the chip flips fully inverted on selection.
- Used across the search results page filter strip ("Beauty makeup", "Lipstick", "Editorial makeup"...).

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.ash}`, type `{typography.body-md}`, padding `11px 15px`, height ~44px, rounded `{rounded.md}`.
- Focused: 2px `{colors.ink}` inner border + 4px `{colors.focus-outer}` outer outline — the signature double-ring focus signal.
- Used across the login/signup modal for email, password, birthdate, country fields.

**`search-bar`** + **`search-bar-focused`**
- Default: background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-md}`, padding `11px 15px`, height ~48px, rounded `{rounded.full}`.
- Focused: same dimensions, background flips to `{colors.canvas}` with a 1px `{colors.ash}` border.
- Anchored in the center of the primary nav with a magnifier glyph at the left edge and "Search for ideas, fashion..." placeholder.

### Cards & Containers

**`pin-card`** — the standard masonry pin tile
- Container: background `{colors.surface-card}`, rounded `{rounded.md}` (16px), padding 0.
- Layout: full-bleed image at the card''s natural aspect ratio with no internal padding. Optional `{component.pin-overlay-pill}` anchored to one corner of the image, optional 32px circular avatar with profile name in `{typography.body-sm-strong}` overlaid at the bottom-left.

**`pin-card-large`** — the home-page feature pin
- Identical to `pin-card` but rounded `{rounded.lg}` (32px) — used for the large editorial pins that anchor home-page feature rows.

**`pin-overlay-pill`** — anchored chip on pin imagery
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button-sm}`, rounded `{rounded.full}`, padding `6px 12px`.
- Floats over a pin''s bottom-left or top-left corner with the search-term label that surfaces if the pin matches a search ("Cherry red", "Preppy look", "Earthy space inspo").

**`category-tile`**
- Background `{colors.surface-card}`, rounded `{rounded.md}`, padding 16px.
- 3- or 4-up grid of small category thumbnails inside the home-page "Bring your favorite ideas to life" section. Each tile contains a category icon or composition photograph + a short label in `{typography.body-strong}`.

**`feature-card`** + **`feature-card-soft`**
- Standard: background `{colors.canvas}`, rounded `{rounded.md}`, padding 32px. Pairs a 4:5 portrait pin image (left or right) with a `{typography.heading-xl}` headline + body copy + `{component.button-primary}` red CTA.
- Soft: background `{colors.surface-card}` for the alternating-row variant where the cream surface is needed to break up content.

**`modal-card`** — login/signup overlay
- Background `{colors.canvas}`, rounded `{rounded.lg}` (32px), padding 32px.
- Layout: title in `{typography.heading-lg}` ("Welcome to Pinterest"), subtitle in `{typography.body-md}`, stacked `{component.text-input}` fields (Email, Password, Birthdate, Country), primary `{component.button-primary}` "Continue", small "Already a member? Log in" link below.
- Floats over a 50%-opacity scrim covering the entire page content with a 16px ambient shadow.

**`hero-cta-strip`** — dark CTA strip on `create.pinterest.com`
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.heading-xl}`, padding `48px 32px`, rounded `{rounded.none}`.
- Sits at the top of the creator marketing page with a single `{component.button-primary}` red CTA on the right.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}`, text `{colors.ink}`, height ~64px, type `{typography.body-strong}`, rounded `{rounded.none}`, with a 1px `{colors.hairline}` bottom rule on inner pages (no rule on the home hero).
- Layout (desktop home): Pinterest red wordmark at left + "Explore" link, centered `{component.search-bar}`, right cluster ("About / Businesses / Create / Log in" + the always-red `{component.button-primary}` "Sign up" CTA).
- Layout (search results): Pinterest red P-logo at left, centered search bar with the active query, right cluster ("Log in" + red Sign-up button).

**Top Nav (Mobile)**
- Hamburger menu icon at left, P-logo at center, search-glyph + Sign-up CTA at right. Search bar collapses into the magnifier icon and expands to full-width when tapped.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, text `{colors.mute}` in `{typography.body-sm}`, padding `32px 24px`, rounded `{rounded.none}`, with a 1px `{colors.hairline}` top rule.
- Layout: 4-column link grid (Get the app — iOS / Android · Quick Links — Explore / Shop / Users / Collections / Shopping · Pinterest for · About — Privacy / Terms / Help Center) with column headers in `{typography.body-sm-strong}` and link lists in `{typography.body-sm}` `{colors.mute}`.
- Bottom row: Pinterest red wordmark + "© 2026 Pinterest" in `{typography.caption-sm}` `{colors.mute}`.

### Inline

**`link-inline`** — body-prose anchor link
- `{colors.ink-soft}` text with no underline by default. Pinterest''s only "color" beyond brand red on chrome — a near-black warm tint used inline to differentiate links from body without color contrast.', '{"sourcePath":"docs/design-md/pinterest/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (Pinterest Red) for primary CTAs, the active-tab indicator, and the brand wordmark only. It is never decorative.
- Use `{rounded.md}` (16px) on every interactive element and standard card; reserve `{rounded.lg}` (32px) for large pin cards and modals; reserve `{rounded.full}` for circular elements (search bar, chips, avatars).
- Stage every pin image inside a `{component.pin-card}` with no internal padding — the photograph IS the card.
- Stack content sections at `{spacing.section}` (64px) rhythm; tighten pin grids to `{spacing.sm}` (8px) gutters so imagery effectively touches.
- Use `{component.pin-overlay-pill}` to anchor a search-term tag in the corner of a category-tile pin photograph — the system''s signature decorative gesture.
- Build hierarchy from font weight (400 → 600 → 700) and size, not from color tinting. Body stays `{colors.body}` regardless of section context.
- Apply -1.2px letter-spacing on `{typography.display-xl}` and `{typography.heading-xl}`. The negative tracking is part of the brand voice.

### Don''t
- Don''t use sharp-cornered buttons or cards. There are no `{rounded.none}` interactive elements in the system.
- Don''t introduce drop shadows on cards. The only shadow in the system is the 16px ambient under `{component.modal-card}`.
- Don''t pad `{component.pin-card}` internally. The image is full-bleed; metadata sits over the image as an overlay pill, not below it.
- Don''t replace `{colors.primary}` with another red. The brand red is precise — `#e60023`.
- Don''t use `{colors.ink-soft}` (the body-prose link tint) outside of inline body anchor links. It is not a chrome color.
- Don''t introduce a third radius value between 16px and 32px. The system jumps directly from md to lg with nothing in between.', '{"sourcePath":"docs/design-md/pinterest/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Pin grid expands to 5–6 columns; content max-width holds at ~1280px |
| desktop-large | 1440px | Default — 4-column pin grid, full primary nav |
| desktop | 1280px | Same layout with narrower outer gutters |
| desktop-small | 1024px | Pin grid collapses to 3 columns; sub-nav remains horizontal |
| tablet | 768px | Pin grid collapses to 2 columns; primary nav becomes hamburger drawer; search bar becomes icon-only |
| mobile | 480px | Single-column pin grid; hero `{typography.display-xl}` scales 70px → ~44px |
| mobile-narrow | 320px | Hero further scales to ~36px; section padding tightens to 32px |

### Touch Targets
All interactive elements meet WCAG AA (≥ 44×44px). `{component.button-primary}` and `{component.button-secondary}` sit at ~40px height with 14px horizontal padding (effective ~40×80px tappable). `{component.search-bar}` sits at 48px. `{component.text-input}` sits at 44px. `{component.filter-chip}` is ~36–40px height with 16px padding — extends to 44px tappable via inline padding. `{component.button-icon-circular}` is exactly 40×40 with extended hit-target padding to 48×48 inside the parent.

### Collapsing Strategy
- **Primary nav:** desktop horizontal cluster → tablet hamburger drawer at 768px. The red Sign-up CTA stays visible at every breakpoint.
- **Search bar:** desktop centered (~480px wide) → tablet compressed (~320px) → mobile collapses to a magnifier icon that expands to a full-width overlay on tap.
- **Pin masonry grid:** 5/6-up → 4-up → 3-up → 2-up → 1-up at 1920, 1024, 768, and 480px. Gutters drop from 8px to 6px on mobile.
- **Home feature row:** desktop alternating left/right 2-column → tablet vertical stack with text above image → mobile single-column with full-bleed image.
- **Modal:** desktop centered ~480px-wide card → mobile full-width sheet with rounded `{rounded.lg}` top-only and bottom-anchored CTA.
- **Section padding:** `{spacing.section}` (64px) desktop → 48px tablet → 32px mobile.
- **Hero headline:** `{typography.display-xl}` (70px) at desktop, scaling 56px / 44px / 36px down the breakpoint stack.
- **Footer:** 4-up link columns → 2-up at tablet → full accordion at mobile (each header becomes a tap-to-expand row).

### Image Behavior
- Pin imagery preserves natural aspect ratio at every breakpoint; the column count changes, not the aspect.
- Category tile thumbnails maintain 1:1 across all sizes.
- Hero feature imagery uses art-direction crops on mobile (4:5 portrait → square) so the subject stays centered when the layout collapses to single-column.
- All non-critical imagery is lazy-loaded as the user scrolls into the next grid row.', '{"sourcePath":"docs/design-md/pinterest/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.md}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-pressed`, `-disabled`, `-focused`) — do not bury them inside prose.
5. Default body to `{typography.body-md}`; reach for `{typography.body-strong}` for emphasis; reserve `{typography.display-xl}` strictly for top-of-page hero headlines.
6. Keep `{colors.primary}` scarce — at most one Pinterest-red CTA per fold (counting nav, hero, and feature-card CTAs together).
7. When introducing a new component, ask whether it can be expressed with the existing pin-card + 16px-radius + cream-surface vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.', '{"sourcePath":"docs/design-md/pinterest/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes Pinterest''s known mobile pattern (hamburger drawer, single-column grid, hero downscale) from desktop evidence and the documented breakpoint stack.
- **Hover states not documented** by system policy.
- **Pin-detail close-up (single pin overlay)** is not in the captured set — the in-product Pin detail view (with comments, related pins, save board picker) likely introduces components not documented here.
- **Authenticated chrome** (logged-in home feed, board pages, profile pages) not in the captured pages — the captured surfaces are the logged-out marketing and search experience.
- **Pinterest mobile app screens** not in the system documented here — this is the web-only chrome.
- **Form validation states** (success / error inline messages) not documented; only the focused-state field is captured.', '{"sourcePath":"docs/design-md/pinterest/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_1', '#e60023', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_2', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_3', '#cc001f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_4', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_5', '#211922', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_6', '#33332e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_7', '#262622', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_8', '#62625b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_9', '#91918c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_10', '#c8c8c1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_11', '#dadad3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_12', '#e5e5e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_13', '#fbfbf9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_14', '#f6f6f3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_15', '#435ee5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_16', '#617bff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_17', '#7e238b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_18', '#6845ab', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_19', '#103c25', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_20', '#c7f0da', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md'), 'color', 'color_21', '#9e0a0a', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/pinterest/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/pinterest/DESIGN.md';


-- Playstation
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Playstation', 'playstation', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/playstation/DESIGN.md', null, 'seeded', '---
version: alpha
name: PlayStation-design-analysis
description: |
  A three-surface marketing system organized around alternating black, white, and PlayStation Blue chapters that scroll past the viewer like a console launch trailer. Each section has a single editorial purpose — hero photography, console product render, PS Plus tier callout, news strip — and each owns one of three full-bleed canvas modes. The chrome is unusually quiet for a gaming brand: bright PlayStation Blue (`#0070d1`) carries every primary CTA as a fully-rounded pill, the proprietary SST face renders display copy at a signature weight 300 (light) for an airy, premium feel, and a crisp 8px-radius secondary card system carries product info on either canvas mode. The system never decorates — no gradient backgrounds on chrome, no atmospheric mesh, no drop shadows beyond a faint section-divide. Imagery does all the heavy lifting: console glamour shots, game key art, and PS Plus tier illustrations occupy 60-90% of every section, with copy compressed into a small editorial slot.

colors:
  primary: "#0070d1"
  primary-pressed: "#0064b7"
  primary-active: "#004d8d"
  on-primary: "#ffffff"
  link-light: "#0064b7"
  link-dark: "#53b1ff"
  commerce: "#d53b00"
  commerce-pressed: "#aa2f00"
  commerce-link-base: "#d63d00"
  on-commerce: "#ffffff"
  ink: "#000000"
  ink-deep: "#121314"
  ink-elevated: "#181818"
  charcoal: "#1f2024"
  body-light: "rgba(0,0,0,0.6)"
  mute-light: "#6b6b6b"
  ash-light: "#cccccc"
  body-dark: "rgba(255,255,255,0.7)"
  mute-dark: "rgba(229,229,229,0.55)"
  ash-dark: "rgba(229,229,229,0.2)"
  canvas-light: "#ffffff"
  surface-soft: "#f3f3f3"
  surface-card: "#f5f7fa"
  surface-filter: "rgba(245,247,250,0.3)"
  canvas-dark: "#000000"
  surface-dark-elevated: "#121314"
  surface-dark-card: "#181818"
  hairline-light: "#f3f3f3"
  hairline-dark: "rgba(229,229,229,0.2)"
  on-dark: "#ffffff"
  on-dark-mute: "#cccccc"
  warning: "#c81b3a"
  ps-plus-gold-start: "#ffce21"
  ps-plus-gold-mid: "#f5a623"
  ps-plus-gold-end: "#ee8e00"
  marathon-yellow: "#deff20"

typography:
  display-xl:
    fontFamily: PlayStation SST
    fontSize: 54px
    fontWeight: 300
    lineHeight: 1.25
    letterSpacing: -0.1px
  display-lg:
    fontFamily: PlayStation SST
    fontSize: 44px
    fontWeight: 300
    lineHeight: 1.25
    letterSpacing: 0.1px
  display-md:
    fontFamily: PlayStation SST
    fontSize: 35px
    fontWeight: 300
    lineHeight: 1.25
    letterSpacing: 0
  heading-xl:
    fontFamily: PlayStation SST
    fontSize: 28px
    fontWeight: 300
    lineHeight: 1.25
    letterSpacing: 0.1px
  heading-lg:
    fontFamily: PlayStation SST
    fontSize: 22px
    fontWeight: 300
    lineHeight: 1.25
    letterSpacing: 0.1px
  heading-md:
    fontFamily: PlayStation SST
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  body-md:
    fontFamily: PlayStation SST
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.1px
  body-strong:
    fontFamily: PlayStation SST
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0.4px
  body-sm:
    fontFamily: PlayStation SST
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption-md:
    fontFamily: PlayStation SST
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption-sm:
    fontFamily: PlayStation SST
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  link-md:
    fontFamily: PlayStation SST
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button-lg:
    fontFamily: PlayStation SST
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0.45px
  button-md:
    fontFamily: PlayStation SST
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0.324px

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 16px
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
    typography: "{typography.button-lg}"
    rounded: "{rounded.full}"
    padding: 12px 28px
    height: 48px
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.full}"
  button-commerce:
    backgroundColor: "{colors.commerce}"
    textColor: "{colors.on-commerce}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.full}"
    padding: 12px 28px
    height: 48px
  button-commerce-pressed:
    backgroundColor: "{colors.commerce-pressed}"
    textColor: "{colors.on-commerce}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.full}"
  button-secondary-light:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.full}"
    padding: 12px 28px
    height: 48px
  button-secondary-dark:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.full}"
    padding: 12px 28px
    height: 48px
  button-disabled:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ash-light}"
    rounded: "{rounded.full}"
  text-input:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
    height: 48px
  text-input-focused:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  filter-pill:
    backgroundColor: "{colors.surface-filter}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 16px
  filter-pill-active:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
  product-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 24px
  product-card-dark:
    backgroundColor: "{colors.surface-dark-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 24px
  game-tile:
    backgroundColor: "{colors.surface-dark-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 0px
  feature-card:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 32px
  hero-band-blue:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-md}"
    rounded: "{rounded.none}"
    padding: 96px 48px
  hero-band-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xl}"
    rounded: "{rounded.none}"
    padding: 96px 48px
  hero-band-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    rounded: "{rounded.none}"
    padding: 96px 48px
  ps-plus-banner:
    backgroundColor: "{colors.surface-dark-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.heading-xl}"
    rounded: "{rounded.md}"
    padding: 48px 32px
  carousel-paddle:
    backgroundColor: "rgba(255,255,255,0.16)"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    size: 48px
  pagination-dot:
    backgroundColor: "{colors.ash-dark}"
    rounded: "{rounded.full}"
    size: 8px
  pagination-dot-active:
    backgroundColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    size: 8px
  badge-info:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  primary-nav:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
    height: 48px
  sub-nav:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.none}"
    height: 40px
  footer-section:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.none}"
    padding: 48px 32px
  support-search-bar:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 12px 24px
    height: 56px
  support-row:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 16px 0px
  link-inline:
    textColor: "{colors.link-light}"
    typography: "{typography.link-md}"
---

## Overview

PlayStation''s marketing system reads like a console launch trailer scrolling past the viewer in chapters. Each section is a full-bleed band — pure black `{colors.canvas-dark}`, true white `{colors.canvas-light}`, or PlayStation Blue `{colors.primary}` — and each chapter owns one editorial moment: hero console photography, a games-coming-soon strip, the PlayStation Plus tier banner, the "30 Years of PlayStation" anniversary band, the news strip from the PlayStation Blog. There is no decorative chrome between chapters; the section background change IS the divider. Sections stack at `{spacing.section}` (96px) rhythm with the next band''s color taking over the page edge-to-edge.

The system has two distinct surface modes that alternate down the page: a **dark canvas mode** for editorial product moments (hero, "ON PLAYSTATION" band, marathon game pages) and a **light canvas mode** for utility surfaces (PS5 games listing, support pages, news index). Both modes use the same chrome vocabulary — fully-rounded `{rounded.full}` pill buttons, 8px-radius `{rounded.md}` cards, the proprietary PlayStation SST face — only the surface and on-surface colors change. The third surface mode is the **PlayStation Blue band** (`{colors.primary}` — `#0070d1`) reserved for the highest-priority moments: the Marathon launch CTA strip, the footer, and any "Action Required" banner.

The typography is the system''s most distinctive choice. PlayStation SST renders display headlines at **weight 300** (light) — unusual for a gaming brand that could easily reach for bold geometric display faces. The light weight gives the chrome an airy, almost editorial quality that lets the imagery speak; copy is information rather than decoration. Heading sizes drop in tight increments (54 → 44 → 35 → 28 → 22 → 18) and body settles at 18px with 1.5 line-height for comfortable long-form reading on support and games pages.

**Key Characteristics:**
- Three-canvas chapter system: `{colors.canvas-dark}` (black), `{colors.canvas-light}` (white), `{colors.primary}` (PlayStation Blue) alternating down the page
- PlayStation Blue (`{colors.primary}` — `#0070d1`) is the universal primary CTA — fully-rounded pill at `{rounded.full}` (9999px)
- Commerce orange (`{colors.commerce}` — `#d53b00`) is the secondary CTA reserved for "Buy now" / "Pre-order" / store actions
- PlayStation SST display tier renders at **weight 300** with -0.1px to +0.4px tracking — the brand''s signature airy editorial voice
- 8px-radius (`{rounded.md}`) for product cards and feature panels; 4px-radius (`{rounded.sm}`) for inputs; pills (`{rounded.full}`) for every CTA
- Game tiles, console renders, and PS Plus tier illustrations occupy 60-90% of each section — imagery does the storytelling
- Color-block page rhythm (one observed band sequence): dark hero → light console showcase → dark "Great PS4 & PS5 games" rail → light "Discover PlayStation Plus" tier band → light "30 years of PlayStation" callout → dark "ON PLAYSTATION" band → light news strip → blue footer

## Colors

> **Source pages:** `/en-tr/` (home), `/en-tr/ps5/games/` (PS5 games listing), `/en-tr/games/marathon/` (single game page), `/tr-tr/support/account/` (support center). The chrome palette is identical across all four pages; the support page uses the light-canvas mode exclusively while marketing pages alternate.

### Brand & Accent
- **PlayStation Blue** (`{colors.primary}` — `#0070d1`): the brand''s universal primary. Every primary CTA pill, the active filter chip, the footer surface, badge fills, and inline link color on dark surfaces.
- **PlayStation Blue Pressed** (`{colors.primary-pressed}` — `#0064b7`): pressed state for the primary pill — also doubles as the inline link color on light surfaces.
- **PlayStation Blue Active** (`{colors.primary-active}` — `#004d8d`): deeply-pressed state for the primary button.
- **Commerce Orange** (`{colors.commerce}` — `#d53b00`): the secondary CTA reserved for store/buy/pre-order actions. The only warm color in the system.
- **Commerce Orange Pressed** (`{colors.commerce-pressed}` — `#aa2f00`): pressed state for commerce buttons.
- **Marathon Yellow** (`{colors.marathon-yellow}` — `#deff20`): a single high-saturation game-page accent extracted from Marathon''s product palette — used only inside the dedicated `/marathon/` game page chrome and not part of the system''s general accent vocabulary.

### Surface
- **Canvas Dark** (`{colors.canvas-dark}` — `#000000`): pure black hero band, primary nav background, footer base. The dominant surface for editorial product moments.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — `#121314`): inset dark panels, PS Plus tier banner background, "ON PLAYSTATION" gradient end.
- **Surface Dark Card** (`{colors.surface-dark-card}` — `#181818`): game tile fill, dark product card background.
- **Canvas Light** (`{colors.canvas-light}` — `#ffffff`): true white console-showcase band, support page body, news strip background.
- **Soft Surface** (`{colors.surface-soft}` — `#f3f3f3`): hairline-soft band fill on light pages, divider rule on light surfaces.
- **Surface Card** (`{colors.surface-card}` — `#f5f7fa`): cool-blue-tinted product card and tier-card background on light canvas.
- **Surface Filter** (`{colors.surface-filter}` — `rgba(245,247,250,0.3)`): translucent fill for filter-pill default state on light canvas.
- **Hairline Light** (`{colors.hairline-light}` — `#f3f3f3`): 1px divider rule on light pages.
- **Hairline Dark** (`{colors.hairline-dark}` — `rgba(229,229,229,0.2)`): translucent 1px divider on dark canvas.

### Text
- **Ink** (`{colors.ink}` — `#000000`): primary text on `{colors.canvas-light}`. Headlines, button text, support body.
- **Ink Deep** (`{colors.ink-deep}` — `#121314`): warmer near-black for in-card titles on dark surfaces and deep-shadow gradients.
- **Ink Elevated** (`{colors.ink-elevated}` — `#181818`): the lightest of the dark-canvas inks, used for elevated card backgrounds.
- **Body Light** (`{colors.body-light}` — `rgba(0,0,0,0.6)`): translucent body text on light canvas — the system''s default paragraph color.
- **Mute Light** (`{colors.mute-light}` — `#6b6b6b`): metadata text and footer link captions on light canvas.
- **Ash Light** (`{colors.ash-light}` — `#cccccc`): disabled-state text and lowest-emphasis utility on light surfaces.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.canvas-dark}` — headlines, button text on dark hero bands.
- **Body Dark** (`{colors.body-dark}` — `rgba(255,255,255,0.7)`): translucent body text on dark canvas.
- **On Dark Mute** (`{colors.on-dark-mute}` — `#cccccc`): secondary text and disabled state on dark surfaces.
- **Mute Dark** (`{colors.mute-dark}` — `rgba(229,229,229,0.55)`): captions and metadata on dark canvas.

### Semantic
- **Warning** (`{colors.warning}` — `#c81b3a`): validation errors and destructive confirmation copy.
- **Link Light** (`{colors.link-light}` — `#0064b7`): inline body-prose anchor link on light canvas — same hex as `{colors.primary-pressed}`.
- **Link Dark** (`{colors.link-dark}` — `#53b1ff`): inline body-prose anchor link on dark canvas — a brightened blue for dark-mode legibility.

### Brand Gradient
- **PlayStation Plus Gold Gradient** — a horizontal three-stop gold gradient `{colors.ps-plus-gold-start}` (`#ffce21`) → `{colors.ps-plus-gold-mid}` (`#f5a623`) → `{colors.ps-plus-gold-end}` (`#ee8e00`) that anchors the PS Plus banner on the home page. The only gradient in the system; reserved exclusively for PS Plus chrome.

## Typography

### Font Family
- **PlayStation SST** is the proprietary brand sans-serif used across every text role on the site. It carries weights 300 (light), 400 (regular), 500 (medium), 600 (semibold), and 700 (bold), and falls back through `sst` → `Arial` → `Helvetica`. The brand''s distinctive choice is using **weight 300 (light) for display headlines** — unusual for a gaming brand and the source of the system''s editorial, airy character.
- **SST** appears as a secondary cut for in-product surfaces, falling back to Helvetica → Arial.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 54px | 300 | 1.25 | -0.1px | Hero headline ("Discover all PS5 consoles and accessories") |
| `{typography.display-lg}` | 44px | 300 | 1.25 | 0.1px | Section headline ("Great PS4 & PS5 games out now or coming soon") |
| `{typography.display-md}` | 35px | 300 | 1.25 | 0 | Mid-section headline, game-page sub-hero |
| `{typography.heading-xl}` | 28px | 300 | 1.25 | 0.1px | "30 Years of PlayStation" callout, in-band sub-heading |
| `{typography.heading-lg}` | 22px | 300 | 1.25 | 0.1px | News card title, support category title |
| `{typography.heading-md}` | 18px | 600 | 1 | 0 | Card label, navigation menu heading, in-product strong title |
| `{typography.body-md}` | 18px | 400 | 1.5 | 0.1px | Body copy, paragraph text, support article body |
| `{typography.body-strong}` | 18px | 500 | 1.25 | 0.4px | Inline emphasis, primary nav link, button label (large) |
| `{typography.body-sm}` | 16px | 400 | 1.5 | 0 | Card description, secondary body |
| `{typography.caption-md}` | 14px | 400 | 1.5 | 0 | Footer link, metadata, sub-nav text |
| `{typography.caption-sm}` | 12px | 500 | 1.5 | 0 | Smallest utility text, badge label |
| `{typography.link-md}` | 18px | 400 | 1.5 | 0 | Inline body-prose anchor link |
| `{typography.button-lg}` | 18px | 700 | 1.25 | 0.45px | Primary CTA pill |
| `{typography.button-md}` | 14px | 700 | 1.25 | 0.324px | Compact pill, filter chip, secondary CTA |

### Principles
The hierarchy works on a 1.25-line-height ladder almost exclusively — even body sits at 1.5 instead of the typical 1.6 — which keeps long-form support pages tight and console showcases efficient. The weight contrast between display (300) and button (700) is dramatic: a single 18px chrome line might host a heavyweight CTA next to a feather-light 22px headline, giving the system its editorial gaming-magazine feel.

### Note on Font Substitutes
PlayStation SST is proprietary. The closest open-source substitutes:
- **Roboto Light (300)** for the display tier — its slightly looser letter-spacing matches SST''s display optical fit.
- **Inter** at weights 400/500/600 for body and chrome — the closest geometric sans match for SST''s body cut.
- **Source Sans Pro Light (300)** as an alternative for the display tier when Roboto reads too utilitarian.

When substituting, preserve the +0.1px to +0.45px tracking on display and button tiers — the spacing is part of what makes PlayStation SST feel premium at the light weight.

## Layout

### Spacing System
- **Base unit:** 8px (with finer 4/12px steps for tight inline gaps).
- **Tokens (front matter):** `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (24px) · `{spacing.xl}` (32px) · `{spacing.xxl}` (48px) · `{spacing.section}` (96px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (96px) as the vertical gap between major content blocks. Card grids use `{spacing.lg}` (24px) gutters; in-card padding sits at `{spacing.lg}` to `{spacing.xl}` depending on density.
- **Hero band padding:** 96px vertical / 48px horizontal — the largest spacing in the system, reserved for full-bleed surface chapters.

### Grid & Container
- **Max width:** ~1280px content area for body text on desktop with 24px gutters that expand to ~48px at ultrawide. Hero bands and game-tile rails go full-bleed with no max-width constraint on imagery.
- **Game tile carousel:** 4-up at desktop with horizontal scroll on the same row, collapsing to 3-up at 1024px and 2-up at 768px. Each tile uses 16:9 cover art at `{rounded.md}`.
- **Console showcase grid:** desktop 5-column thumbnail strip below the main hero render, collapsing to 3-up + horizontal scroll at tablet.
- **Support page:** desktop 2-column 30/70 split (sidebar nav + article body), collapsing to single-column with the sidebar promoted to a top accordion at mobile.
- **News strip:** 3-up card grid at desktop, 2-up at tablet, 1-up at mobile.

### Whitespace Philosophy
Whitespace is structural and band-defined. The 96px `{spacing.section}` between chapters reads as silence between trailer cuts — there''s no decorative wash, no gradient transition, no mid-section divider. Inside a section, content is left-aligned in a tight column with the imagery breathing in the right 60-70% of the band. Paragraph text is comfortable at 1.5 line-height but column widths stay narrow (~520px at desktop) to keep long-form copy readable.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for hero bands, footer, full-bleed sections — the dominant treatment |
| 1 — Hairline divider | 1px solid `{colors.hairline-light}` or `{colors.hairline-dark}` | Card borders, support row dividers, footer column rules |
| 2 — Soft active shadow | `0 4px 12px rgba(0,0,0,0.16)` | Active/pressed CTAs, lifted product card |
| 3 — Section gradient | Soft top-to-bottom darkening from `{colors.surface-dark-elevated}` to `{colors.canvas-dark}` | "ON PLAYSTATION" band — only place a gradient appears on chrome |

The system has effectively no resting shadow on cards; depth is built from surface-color contrast across band chapters. Cards lift only on press.

### Decorative Depth
Depth comes from the alternating-band rhythm and from the imagery itself:
- **Console product photography** — DualSense controller and PS5 console renders shot on neutral white with crisp edge lighting, full-bleed inside the light-canvas band.
- **Game key art** — full-bleed cinematic stills (Marathon, the latest blockbuster releases) inside dark-canvas bands with title lockup overlaid in the lower-left.
- **PS Plus tier banner** — a subtle horizontal gold gradient (`{colors.ps-plus-gold-start}` → `{colors.ps-plus-gold-end}`) sits as the only chrome gradient in the system, anchoring the "Discover PlayStation Plus" CTA.
- **"ON PLAYSTATION" gradient band** — top-to-bottom deepening from `{colors.surface-dark-elevated}` (`#121314`) to `{colors.canvas-dark}` (`#000000`) creates a cinematic dimming effect under the anniversary callout.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero bands, primary nav, footer, sub-nav, support article body — every full-bleed structural surface |
| `{rounded.sm}` | 4px | Text inputs, support search field utilities |
| `{rounded.md}` | 8px | Game tiles, product cards, feature cards, PS Plus banner |
| `{rounded.lg}` | 16px | Rare large container with extra-soft corners (e.g., dialog cards) |
| `{rounded.full}` | 9999px | Every CTA pill (primary / commerce / secondary), filter chips, pagination dots, carousel paddles |

The radius vocabulary works on a 4 / 8 / pill rhythm for chrome with structural surfaces staying flat at 0px.

### Photography Geometry
- **Hero console render:** large centered console + DualSense composition on white, ~70% width of the band, with copy slot to the left.
- **Game tiles:** 16:9 key art at `{rounded.md}` (8px), 4-up rail at desktop with horizontal carousel.
- **Marathon game page hero:** full-bleed cinematic 16:9 still with the "MARATHON" wordmark in the lower-left at light weight, brand yellow `{colors.marathon-yellow}` accent on a few small UI tags.
- **News card thumbnails:** 16:9 imagery at `{rounded.md}` with a small text block below.
- **Avatar / brand icons:** 32–40px circles for sub-nav social row.

## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal PlayStation CTA
- Background `{colors.primary}` (PlayStation Blue), text `{colors.on-primary}`, type `{typography.button-lg}`, padding `12px 28px`, height ~48px, rounded `{rounded.full}`.
- Used for "Add to bag", "Sign up", "Learn more", "Subscribe" — every primary action across both light and dark canvases.
- Pressed state lives in `button-primary-pressed` — background drops to `{colors.primary-pressed}` (`#0064b7`).

**`button-commerce`** — orange store CTA
- Background `{colors.commerce}` (`#d53b00`), text `{colors.on-commerce}`, type `{typography.button-lg}`, padding `12px 28px`, height ~48px, rounded `{rounded.full}`.
- Reserved for "Buy now", "Pre-order", "Add to cart" — store actions only. The only warm color in the system.
- Pressed state lives in `button-commerce-pressed` — background drops to `{colors.commerce-pressed}`.

**`button-secondary-light`** — outline variant on light canvas
- Background transparent, text `{colors.ink}`, 1px solid `{colors.ash-light}` border, type `{typography.button-lg}`, padding `12px 28px`, height ~48px, rounded `{rounded.full}`.
- Lower-emphasis CTA on white surfaces ("Learn more →", "Watch trailer").

**`button-secondary-dark`** — outline variant on dark canvas
- Background transparent, text `{colors.on-dark}`, 1px solid `{colors.hairline-dark}`, type `{typography.button-lg}`, padding `12px 28px`, height ~48px, rounded `{rounded.full}`.
- Same role as the light variant but inverted for use on `{colors.canvas-dark}` hero bands.

**`button-disabled`**
- Background `{colors.surface-soft}`, text `{colors.ash-light}`, rounded `{rounded.full}` — flat soft gray.

### Filter & Tab Chips

**`filter-pill`** + **`filter-pill-active`**
- Default: background `{colors.surface-filter}` (translucent), text `{colors.ink}`, type `{typography.button-md}`, padding `8px 16px`, rounded `{rounded.full}`.
- Active: background flips to `{colors.canvas-light}` (opaque white) — the chip "lifts" from the translucent default.
- Used in the PS5 games filter strip ("All", "Coming Soon", "PlayStation VR2", "Recently Released").

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.canvas-light}`, text `{colors.ink}`, 1px solid `{colors.ash-light}`, type `{typography.body-md}`, padding `12px 16px`, height ~48px, rounded `{rounded.sm}` (4px).
- Focused: 2px solid `{colors.primary}` border, no halo (relies on the border weight increase as the focus signal).

**`support-search-bar`** — the support-page signature search field
- Background `{colors.canvas-light}`, text `{colors.ink}`, type `{typography.body-md}`, padding `12px 24px`, height ~56px, rounded `{rounded.full}`.
- Sits at the top of the support page hero with a magnifier icon at the left edge and "Search the support center" placeholder.

### Cards & Containers

**`product-card`** — light-canvas product/feature card
- Container: background `{colors.surface-card}` (`#f5f7fa` cool-blue-tinted), 1px solid `{colors.hairline-light}` (rare; usually borderless), padding `{spacing.lg}` (24px), rounded `{rounded.md}` (8px).
- Used for the "PlayStation Store" sale callout, news cards, and PS Plus tier comparison cards on light canvas.

**`product-card-dark`** — dark-canvas product card
- Container: background `{colors.surface-dark-card}` (`#181818`), padding `{spacing.lg}`, rounded `{rounded.md}`.
- Used for game-detail cards and dark-canvas feature panels.

**`game-tile`** — game/console thumbnail tile
- Container: background `{colors.surface-dark-elevated}`, padding 0, rounded `{rounded.md}`.
- Layout: 16:9 cover art at full bleed inside the radius, with title + platform tag overlaid at the bottom-left in `{typography.body-sm}`.
- Used in the "Great PS4 & PS5 games" rail and the PS5 games listing grid.

**`feature-card`** — light-canvas marketing card
- Container: background `{colors.canvas-light}`, padding `{spacing.xl}` (32px), rounded `{rounded.md}`.
- Used for the "PlayStation Store" hero card and similar feature panels with a small product icon, title, body, and CTA.

**`hero-band-blue`** — the PlayStation Blue full-bleed band
- Background `{colors.primary}`, text `{colors.on-primary}` in `{typography.display-md}`, padding `96px 48px`, rounded `{rounded.none}`.
- The Marathon launch CTA strip and the footer surface use this band. The band''s defining purpose is "this is the action moment of the page."

**`hero-band-dark`** — full-bleed dark hero
- Background `{colors.canvas-dark}` (with optional gradient end at `{colors.surface-dark-elevated}`), text `{colors.on-dark}` in `{typography.display-xl}`, padding `96px 48px`, rounded `{rounded.none}`.
- The home-page hero, the game-detail page hero, and the "ON PLAYSTATION" anniversary band.

**`hero-band-light`** — full-bleed white hero
- Background `{colors.canvas-light}`, text `{colors.ink}` in `{typography.display-xl}`, padding `96px 48px`, rounded `{rounded.none}`.
- The console showcase band ("Discover all PS5 consoles and accessories") and the support page top.

**`ps-plus-banner`** — PlayStation Plus tier callout
- Background `{colors.surface-dark-elevated}` with the `{colors.ps-plus-gold-start}` → `{colors.ps-plus-gold-end}` gold gradient as a horizontal accent bar across the top, text `{colors.on-dark}` in `{typography.heading-xl}`, padding `48px 32px`, rounded `{rounded.md}`.
- The "Discover PlayStation Plus" full-width banner on the home page.

**`carousel-paddle`** — circular carousel control
- Background `rgba(255,255,255,0.16)`, icon `{colors.on-dark}`, rounded `{rounded.full}`, size 48px.
- Anchored to the left/right edge of the game tile carousel.

**`pagination-dot`** + **`pagination-dot-active`**
- 8px circle at `{rounded.full}`. Default fill `{colors.ash-dark}`; active fill `{colors.on-dark}`.
- Carousel position indicator below the game tile rail.

### Inline

**`badge-info`** — small info tag
- Background `{colors.primary}`, text `{colors.on-primary}` in `{typography.caption-sm}`, padding `4px 10px`, rounded `{rounded.full}`.
- "New", "Pre-order", "Coming Soon" labels overlaid on game tiles.

**`link-inline`** — body-prose anchor link
- `{colors.link-light}` text on light canvas / `{colors.link-dark}` on dark canvas, no underline by default. Inline body links inside support article paragraphs.

### Navigation

**`primary-nav`**
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, height ~48px, type `{typography.body-strong}`, rounded `{rounded.none}`.
- Layout (desktop): PlayStation P-logo at far-left, centered nav row ("Games · PS5 · PS4 · PS VR2 · Subscriptions · Hardware · Mobile · News · Shop · Support"), right cluster (search-glyph + locale + cart icon + user-avatar circle).

**`sub-nav`** — secondary nav strip
- Background `{colors.canvas-dark}`, text `{colors.on-dark}` in `{typography.caption-md}`, height ~40px, rounded `{rounded.none}`.
- Sits directly below the primary nav on PS5 games / single game / PS Plus pages with section-specific anchor links.

**Top Nav (Mobile)**
- Hamburger menu icon at left, P-logo at center, search + cart icons at right. Primary nav collapses into a full-screen dark drawer that slides from the left.

### Footer

**`footer-section`**
- Background `{colors.primary}` (PlayStation Blue), text `{colors.on-primary}` in `{typography.caption-md}`, padding `{spacing.xxl}` (48px) vertical.
- Layout: large PlayStation wordmark at top-left, multi-column link grid (locale selector, store links, account, support, social), bottom row with terms / privacy fine-print in `{typography.caption-sm}`.
- The footer''s blue surface is the system''s "we''re done — return to the brand" anchor.

### Support-page-specific

**`support-row`** — support article-list row
- Background `{colors.canvas-light}`, text `{colors.ink}` in `{typography.body-md}`, padding `16px 0`, with a 1px `{colors.hairline-light}` bottom rule.
- Used for FAQ / category-listing rows on the support page with a small chevron-right icon at the right edge.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (PlayStation Blue) for primary CTAs and the footer surface only. The blue band is precious — at most one full-bleed blue band per page.
- Reserve `{colors.commerce}` (orange) for store/buy/pre-order CTAs only. It is never used on marketing chrome or hero pills.
- Use PlayStation SST at weight 300 for display headings (54 / 44 / 35 / 28 / 22). The light weight is the brand voice.
- Stack content sections at `{spacing.section}` (96px) rhythm with the next band''s surface color taking over the page edge-to-edge — no decorative dividers between bands.
- Use `{rounded.full}` (9999px) on every CTA pill and `{rounded.md}` (8px) on every product card. The two-radius vocabulary is the entire shape system aside from inputs.
- Pair full-bleed game key art and console renders inside dark or light bands; let imagery occupy 60-90% of the band''s vertical height.
- Use `{component.ps-plus-banner}` with the gold gradient exclusively for the PlayStation Plus tier callout — never decorate other components with the gold.

### Don''t
- Don''t introduce drop shadows on resting cards. The system is flat-on-canvas; cards lift only on press.
- Don''t replace `{colors.primary}` with another shade of blue. The brand blue is precise — `#0070d1` for default and `#0064b7` for pressed.
- Don''t use `{colors.commerce}` (orange) on marketing/hero CTAs. It''s reserved exclusively for store actions.
- Don''t introduce a sans-serif body font, italic, or monospace style. PlayStation SST carries every text role.
- Don''t soften pill geometry. CTAs are always `{rounded.full}` — no medium-radius buttons.
- Don''t use the gold PS Plus gradient on anything that isn''t the PS Plus banner. It is a tier-specific brand asset.
- Don''t put a gradient on chrome. The only allowed gradient is the gold PS Plus accent and the soft top-to-bottom darkening of the "ON PLAYSTATION" band.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Hero band stays at content max-width 1280px; outer gutters grow to ~80px |
| desktop-large | 1440px | Default desktop — 4-up game tile carousel, full primary nav |
| desktop | 1280px | Same layout with narrower outer gutters |
| desktop-small | 1024px | Game tile rail collapses to 3-up; sub-nav remains horizontal |
| tablet | 768px | Game tiles → 2-up; primary nav becomes hamburger drawer |
| mobile | 480px | Single-column everything; hero `{typography.display-xl}` scales 54px → ~32px |
| mobile-narrow | 320px | Section padding tightens to 32px; hero further scales to ~28px |

### Touch Targets
All interactive elements meet WCAG AAA (≥ 44×44px). `{component.button-primary}` and `{component.button-commerce}` sit at 48px height with 28px horizontal padding (effective ~48×100px tappable). `{component.text-input}` sits at 48px. `{component.support-search-bar}` sits at 56px. `{component.filter-pill}` is ~36–40px height with 16px padding extending to 44px tappable via inline padding. `{component.carousel-paddle}` is exactly 48×48 circular.

### Collapsing Strategy
- **Primary nav:** desktop horizontal cluster → tablet hamburger drawer at 768px. The right-cluster icons (search, cart, account) stay visible at every breakpoint.
- **Sub-nav:** desktop horizontal anchor row → tablet horizontal scroll → mobile select dropdown.
- **Game tile carousel:** 4-up → 3-up → 2-up at 1024 and 768px; carousel paddles stay visible at every desktop breakpoint, hide on mobile in favor of touch-swipe.
- **Hero bands:** stay full-bleed at every breakpoint; only the internal content column reflows from 2-column (text-left + image-right) to single-column (text above image).
- **Console showcase:** desktop 5-up thumbnail strip → tablet 3-up + horizontal scroll → mobile 1-up with paddle.
- **Support page:** desktop 30/70 split (sidebar + body) → tablet sidebar promoted to top accordion → mobile fully collapsed accordion.
- **Section padding:** `{spacing.section}` (96px) desktop → 64px tablet → 48px mobile.
- **Hero headline:** `{typography.display-xl}` (54px) at desktop, scaling 44px / 32px / 28px down the breakpoint stack.

### Image Behavior
- Hero imagery (console renders, game key art) uses art-direction crops on mobile so the central subject stays centered when the band collapses to single-column.
- Game tile cover art preserves 16:9 ratio at every breakpoint; only the column count changes.
- Console showcase thumbnails maintain their natural aspect (~1:1 product render) across breakpoints.
- All non-critical imagery is lazy-loaded as the user scrolls into the next chapter.

## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.full}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-pressed`, `-disabled`) — do not bury them inside prose.
5. Default body to `{typography.body-md}` (18px / 400 / 1.5); reach for `{typography.display-xl}` strictly for the page-top hero headline; use `{typography.body-strong}` for primary nav links.
6. Keep `{colors.primary}` scarce per viewport — at most one full-bleed PlayStation Blue band per page.
7. When introducing a new component, ask whether it can be expressed with the existing pill + 8px-radius card + full-bleed-band vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.

## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes PlayStation''s known mobile pattern (hamburger drawer, single-column band reflow, hero downscale) from desktop evidence and the breakpoint stack.
- **Hover states not documented** by system policy.
- **Sign-in / authentication chrome** (login modal, account dashboard, profile pages) not in the captured pages.
- **PlayStation Store** in-store browsing surfaces (PDP / cart / checkout) are not in the captured set — those use a more dense data-table layout that this document does not describe.
- **Game-page-specific theming** — the `/marathon/` page uses `{colors.marathon-yellow}` as a chapter accent. Other game pages may pull in their own per-title brand colors that vary outside the documented system.
- **Form validation states** (success / error inline messages) not present in the captured surfaces beyond the `{colors.warning}` color token.
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

PlayStation''s marketing system reads like a console launch trailer scrolling past the viewer in chapters. Each section is a full-bleed band — pure black `{colors.canvas-dark}`, true white `{colors.canvas-light}`, or PlayStation Blue `{colors.primary}` — and each chapter owns one editorial moment: hero console photography, a games-coming-soon strip, the PlayStation Plus tier banner, the "30 Years of PlayStation" anniversary band, the news strip from the PlayStation Blog. There is no decorative chrome between chapters; the section background change IS the divider. Sections stack at `{spacing.section}` (96px) rhythm with the next band''s color taking over the page edge-to-edge.

The system has two distinct surface modes that alternate down the page: a **dark canvas mode** for editorial product moments (hero, "ON PLAYSTATION" band, marathon game pages) and a **light canvas mode** for utility surfaces (PS5 games listing, support pages, news index). Both modes use the same chrome vocabulary — fully-rounded `{rounded.full}` pill buttons, 8px-radius `{rounded.md}` cards, the proprietary PlayStation SST face — only the surface and on-surface colors change. The third surface mode is the **PlayStation Blue band** (`{colors.primary}` — `#0070d1`) reserved for the highest-priority moments: the Marathon launch CTA strip, the footer, and any "Action Required" banner.

The typography is the system''s most distinctive choice. PlayStation SST renders display headlines at **weight 300** (light) — unusual for a gaming brand that could easily reach for bold geometric display faces. The light weight gives the chrome an airy, almost editorial quality that lets the imagery speak; copy is information rather than decoration. Heading sizes drop in tight increments (54 → 44 → 35 → 28 → 22 → 18) and body settles at 18px with 1.5 line-height for comfortable long-form reading on support and games pages.

**Key Characteristics:**
- Three-canvas chapter system: `{colors.canvas-dark}` (black), `{colors.canvas-light}` (white), `{colors.primary}` (PlayStation Blue) alternating down the page
- PlayStation Blue (`{colors.primary}` — `#0070d1`) is the universal primary CTA — fully-rounded pill at `{rounded.full}` (9999px)
- Commerce orange (`{colors.commerce}` — `#d53b00`) is the secondary CTA reserved for "Buy now" / "Pre-order" / store actions
- PlayStation SST display tier renders at **weight 300** with -0.1px to +0.4px tracking — the brand''s signature airy editorial voice
- 8px-radius (`{rounded.md}`) for product cards and feature panels; 4px-radius (`{rounded.sm}`) for inputs; pills (`{rounded.full}`) for every CTA
- Game tiles, console renders, and PS Plus tier illustrations occupy 60-90% of each section — imagery does the storytelling
- Color-block page rhythm (one observed band sequence): dark hero → light console showcase → dark "Great PS4 & PS5 games" rail → light "Discover PlayStation Plus" tier band → light "30 years of PlayStation" callout → dark "ON PLAYSTATION" band → light news strip → blue footer', '{"sourcePath":"docs/design-md/playstation/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> **Source pages:** `/en-tr/` (home), `/en-tr/ps5/games/` (PS5 games listing), `/en-tr/games/marathon/` (single game page), `/tr-tr/support/account/` (support center). The chrome palette is identical across all four pages; the support page uses the light-canvas mode exclusively while marketing pages alternate.

### Brand & Accent
- **PlayStation Blue** (`{colors.primary}` — `#0070d1`): the brand''s universal primary. Every primary CTA pill, the active filter chip, the footer surface, badge fills, and inline link color on dark surfaces.
- **PlayStation Blue Pressed** (`{colors.primary-pressed}` — `#0064b7`): pressed state for the primary pill — also doubles as the inline link color on light surfaces.
- **PlayStation Blue Active** (`{colors.primary-active}` — `#004d8d`): deeply-pressed state for the primary button.
- **Commerce Orange** (`{colors.commerce}` — `#d53b00`): the secondary CTA reserved for store/buy/pre-order actions. The only warm color in the system.
- **Commerce Orange Pressed** (`{colors.commerce-pressed}` — `#aa2f00`): pressed state for commerce buttons.
- **Marathon Yellow** (`{colors.marathon-yellow}` — `#deff20`): a single high-saturation game-page accent extracted from Marathon''s product palette — used only inside the dedicated `/marathon/` game page chrome and not part of the system''s general accent vocabulary.

### Surface
- **Canvas Dark** (`{colors.canvas-dark}` — `#000000`): pure black hero band, primary nav background, footer base. The dominant surface for editorial product moments.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — `#121314`): inset dark panels, PS Plus tier banner background, "ON PLAYSTATION" gradient end.
- **Surface Dark Card** (`{colors.surface-dark-card}` — `#181818`): game tile fill, dark product card background.
- **Canvas Light** (`{colors.canvas-light}` — `#ffffff`): true white console-showcase band, support page body, news strip background.
- **Soft Surface** (`{colors.surface-soft}` — `#f3f3f3`): hairline-soft band fill on light pages, divider rule on light surfaces.
- **Surface Card** (`{colors.surface-card}` — `#f5f7fa`): cool-blue-tinted product card and tier-card background on light canvas.
- **Surface Filter** (`{colors.surface-filter}` — `rgba(245,247,250,0.3)`): translucent fill for filter-pill default state on light canvas.
- **Hairline Light** (`{colors.hairline-light}` — `#f3f3f3`): 1px divider rule on light pages.
- **Hairline Dark** (`{colors.hairline-dark}` — `rgba(229,229,229,0.2)`): translucent 1px divider on dark canvas.

### Text
- **Ink** (`{colors.ink}` — `#000000`): primary text on `{colors.canvas-light}`. Headlines, button text, support body.
- **Ink Deep** (`{colors.ink-deep}` — `#121314`): warmer near-black for in-card titles on dark surfaces and deep-shadow gradients.
- **Ink Elevated** (`{colors.ink-elevated}` — `#181818`): the lightest of the dark-canvas inks, used for elevated card backgrounds.
- **Body Light** (`{colors.body-light}` — `rgba(0,0,0,0.6)`): translucent body text on light canvas — the system''s default paragraph color.
- **Mute Light** (`{colors.mute-light}` — `#6b6b6b`): metadata text and footer link captions on light canvas.
- **Ash Light** (`{colors.ash-light}` — `#cccccc`): disabled-state text and lowest-emphasis utility on light surfaces.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.canvas-dark}` — headlines, button text on dark hero bands.
- **Body Dark** (`{colors.body-dark}` — `rgba(255,255,255,0.7)`): translucent body text on dark canvas.
- **On Dark Mute** (`{colors.on-dark-mute}` — `#cccccc`): secondary text and disabled state on dark surfaces.
- **Mute Dark** (`{colors.mute-dark}` — `rgba(229,229,229,0.55)`): captions and metadata on dark canvas.

### Semantic
- **Warning** (`{colors.warning}` — `#c81b3a`): validation errors and destructive confirmation copy.
- **Link Light** (`{colors.link-light}` — `#0064b7`): inline body-prose anchor link on light canvas — same hex as `{colors.primary-pressed}`.
- **Link Dark** (`{colors.link-dark}` — `#53b1ff`): inline body-prose anchor link on dark canvas — a brightened blue for dark-mode legibility.

### Brand Gradient
- **PlayStation Plus Gold Gradient** — a horizontal three-stop gold gradient `{colors.ps-plus-gold-start}` (`#ffce21`) → `{colors.ps-plus-gold-mid}` (`#f5a623`) → `{colors.ps-plus-gold-end}` (`#ee8e00`) that anchors the PS Plus banner on the home page. The only gradient in the system; reserved exclusively for PS Plus chrome.', '{"sourcePath":"docs/design-md/playstation/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
- **PlayStation SST** is the proprietary brand sans-serif used across every text role on the site. It carries weights 300 (light), 400 (regular), 500 (medium), 600 (semibold), and 700 (bold), and falls back through `sst` → `Arial` → `Helvetica`. The brand''s distinctive choice is using **weight 300 (light) for display headlines** — unusual for a gaming brand and the source of the system''s editorial, airy character.
- **SST** appears as a secondary cut for in-product surfaces, falling back to Helvetica → Arial.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 54px | 300 | 1.25 | -0.1px | Hero headline ("Discover all PS5 consoles and accessories") |
| `{typography.display-lg}` | 44px | 300 | 1.25 | 0.1px | Section headline ("Great PS4 & PS5 games out now or coming soon") |
| `{typography.display-md}` | 35px | 300 | 1.25 | 0 | Mid-section headline, game-page sub-hero |
| `{typography.heading-xl}` | 28px | 300 | 1.25 | 0.1px | "30 Years of PlayStation" callout, in-band sub-heading |
| `{typography.heading-lg}` | 22px | 300 | 1.25 | 0.1px | News card title, support category title |
| `{typography.heading-md}` | 18px | 600 | 1 | 0 | Card label, navigation menu heading, in-product strong title |
| `{typography.body-md}` | 18px | 400 | 1.5 | 0.1px | Body copy, paragraph text, support article body |
| `{typography.body-strong}` | 18px | 500 | 1.25 | 0.4px | Inline emphasis, primary nav link, button label (large) |
| `{typography.body-sm}` | 16px | 400 | 1.5 | 0 | Card description, secondary body |
| `{typography.caption-md}` | 14px | 400 | 1.5 | 0 | Footer link, metadata, sub-nav text |
| `{typography.caption-sm}` | 12px | 500 | 1.5 | 0 | Smallest utility text, badge label |
| `{typography.link-md}` | 18px | 400 | 1.5 | 0 | Inline body-prose anchor link |
| `{typography.button-lg}` | 18px | 700 | 1.25 | 0.45px | Primary CTA pill |
| `{typography.button-md}` | 14px | 700 | 1.25 | 0.324px | Compact pill, filter chip, secondary CTA |

### Principles
The hierarchy works on a 1.25-line-height ladder almost exclusively — even body sits at 1.5 instead of the typical 1.6 — which keeps long-form support pages tight and console showcases efficient. The weight contrast between display (300) and button (700) is dramatic: a single 18px chrome line might host a heavyweight CTA next to a feather-light 22px headline, giving the system its editorial gaming-magazine feel.

### Note on Font Substitutes
PlayStation SST is proprietary. The closest open-source substitutes:
- **Roboto Light (300)** for the display tier — its slightly looser letter-spacing matches SST''s display optical fit.
- **Inter** at weights 400/500/600 for body and chrome — the closest geometric sans match for SST''s body cut.
- **Source Sans Pro Light (300)** as an alternative for the display tier when Roboto reads too utilitarian.

When substituting, preserve the +0.1px to +0.45px tracking on display and button tiers — the spacing is part of what makes PlayStation SST feel premium at the light weight.', '{"sourcePath":"docs/design-md/playstation/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 8px (with finer 4/12px steps for tight inline gaps).
- **Tokens (front matter):** `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (24px) · `{spacing.xl}` (32px) · `{spacing.xxl}` (48px) · `{spacing.section}` (96px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (96px) as the vertical gap between major content blocks. Card grids use `{spacing.lg}` (24px) gutters; in-card padding sits at `{spacing.lg}` to `{spacing.xl}` depending on density.
- **Hero band padding:** 96px vertical / 48px horizontal — the largest spacing in the system, reserved for full-bleed surface chapters.

### Grid & Container
- **Max width:** ~1280px content area for body text on desktop with 24px gutters that expand to ~48px at ultrawide. Hero bands and game-tile rails go full-bleed with no max-width constraint on imagery.
- **Game tile carousel:** 4-up at desktop with horizontal scroll on the same row, collapsing to 3-up at 1024px and 2-up at 768px. Each tile uses 16:9 cover art at `{rounded.md}`.
- **Console showcase grid:** desktop 5-column thumbnail strip below the main hero render, collapsing to 3-up + horizontal scroll at tablet.
- **Support page:** desktop 2-column 30/70 split (sidebar nav + article body), collapsing to single-column with the sidebar promoted to a top accordion at mobile.
- **News strip:** 3-up card grid at desktop, 2-up at tablet, 1-up at mobile.

### Whitespace Philosophy
Whitespace is structural and band-defined. The 96px `{spacing.section}` between chapters reads as silence between trailer cuts — there''s no decorative wash, no gradient transition, no mid-section divider. Inside a section, content is left-aligned in a tight column with the imagery breathing in the right 60-70% of the band. Paragraph text is comfortable at 1.5 line-height but column widths stay narrow (~520px at desktop) to keep long-form copy readable.', '{"sourcePath":"docs/design-md/playstation/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for hero bands, footer, full-bleed sections — the dominant treatment |
| 1 — Hairline divider | 1px solid `{colors.hairline-light}` or `{colors.hairline-dark}` | Card borders, support row dividers, footer column rules |
| 2 — Soft active shadow | `0 4px 12px rgba(0,0,0,0.16)` | Active/pressed CTAs, lifted product card |
| 3 — Section gradient | Soft top-to-bottom darkening from `{colors.surface-dark-elevated}` to `{colors.canvas-dark}` | "ON PLAYSTATION" band — only place a gradient appears on chrome |

The system has effectively no resting shadow on cards; depth is built from surface-color contrast across band chapters. Cards lift only on press.

### Decorative Depth
Depth comes from the alternating-band rhythm and from the imagery itself:
- **Console product photography** — DualSense controller and PS5 console renders shot on neutral white with crisp edge lighting, full-bleed inside the light-canvas band.
- **Game key art** — full-bleed cinematic stills (Marathon, the latest blockbuster releases) inside dark-canvas bands with title lockup overlaid in the lower-left.
- **PS Plus tier banner** — a subtle horizontal gold gradient (`{colors.ps-plus-gold-start}` → `{colors.ps-plus-gold-end}`) sits as the only chrome gradient in the system, anchoring the "Discover PlayStation Plus" CTA.
- **"ON PLAYSTATION" gradient band** — top-to-bottom deepening from `{colors.surface-dark-elevated}` (`#121314`) to `{colors.canvas-dark}` (`#000000`) creates a cinematic dimming effect under the anniversary callout.', '{"sourcePath":"docs/design-md/playstation/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero bands, primary nav, footer, sub-nav, support article body — every full-bleed structural surface |
| `{rounded.sm}` | 4px | Text inputs, support search field utilities |
| `{rounded.md}` | 8px | Game tiles, product cards, feature cards, PS Plus banner |
| `{rounded.lg}` | 16px | Rare large container with extra-soft corners (e.g., dialog cards) |
| `{rounded.full}` | 9999px | Every CTA pill (primary / commerce / secondary), filter chips, pagination dots, carousel paddles |

The radius vocabulary works on a 4 / 8 / pill rhythm for chrome with structural surfaces staying flat at 0px.

### Photography Geometry
- **Hero console render:** large centered console + DualSense composition on white, ~70% width of the band, with copy slot to the left.
- **Game tiles:** 16:9 key art at `{rounded.md}` (8px), 4-up rail at desktop with horizontal carousel.
- **Marathon game page hero:** full-bleed cinematic 16:9 still with the "MARATHON" wordmark in the lower-left at light weight, brand yellow `{colors.marathon-yellow}` accent on a few small UI tags.
- **News card thumbnails:** 16:9 imagery at `{rounded.md}` with a small text block below.
- **Avatar / brand icons:** 32–40px circles for sub-nav social row.', '{"sourcePath":"docs/design-md/playstation/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal PlayStation CTA
- Background `{colors.primary}` (PlayStation Blue), text `{colors.on-primary}`, type `{typography.button-lg}`, padding `12px 28px`, height ~48px, rounded `{rounded.full}`.
- Used for "Add to bag", "Sign up", "Learn more", "Subscribe" — every primary action across both light and dark canvases.
- Pressed state lives in `button-primary-pressed` — background drops to `{colors.primary-pressed}` (`#0064b7`).

**`button-commerce`** — orange store CTA
- Background `{colors.commerce}` (`#d53b00`), text `{colors.on-commerce}`, type `{typography.button-lg}`, padding `12px 28px`, height ~48px, rounded `{rounded.full}`.
- Reserved for "Buy now", "Pre-order", "Add to cart" — store actions only. The only warm color in the system.
- Pressed state lives in `button-commerce-pressed` — background drops to `{colors.commerce-pressed}`.

**`button-secondary-light`** — outline variant on light canvas
- Background transparent, text `{colors.ink}`, 1px solid `{colors.ash-light}` border, type `{typography.button-lg}`, padding `12px 28px`, height ~48px, rounded `{rounded.full}`.
- Lower-emphasis CTA on white surfaces ("Learn more →", "Watch trailer").

**`button-secondary-dark`** — outline variant on dark canvas
- Background transparent, text `{colors.on-dark}`, 1px solid `{colors.hairline-dark}`, type `{typography.button-lg}`, padding `12px 28px`, height ~48px, rounded `{rounded.full}`.
- Same role as the light variant but inverted for use on `{colors.canvas-dark}` hero bands.

**`button-disabled`**
- Background `{colors.surface-soft}`, text `{colors.ash-light}`, rounded `{rounded.full}` — flat soft gray.

### Filter & Tab Chips

**`filter-pill`** + **`filter-pill-active`**
- Default: background `{colors.surface-filter}` (translucent), text `{colors.ink}`, type `{typography.button-md}`, padding `8px 16px`, rounded `{rounded.full}`.
- Active: background flips to `{colors.canvas-light}` (opaque white) — the chip "lifts" from the translucent default.
- Used in the PS5 games filter strip ("All", "Coming Soon", "PlayStation VR2", "Recently Released").

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.canvas-light}`, text `{colors.ink}`, 1px solid `{colors.ash-light}`, type `{typography.body-md}`, padding `12px 16px`, height ~48px, rounded `{rounded.sm}` (4px).
- Focused: 2px solid `{colors.primary}` border, no halo (relies on the border weight increase as the focus signal).

**`support-search-bar`** — the support-page signature search field
- Background `{colors.canvas-light}`, text `{colors.ink}`, type `{typography.body-md}`, padding `12px 24px`, height ~56px, rounded `{rounded.full}`.
- Sits at the top of the support page hero with a magnifier icon at the left edge and "Search the support center" placeholder.

### Cards & Containers

**`product-card`** — light-canvas product/feature card
- Container: background `{colors.surface-card}` (`#f5f7fa` cool-blue-tinted), 1px solid `{colors.hairline-light}` (rare; usually borderless), padding `{spacing.lg}` (24px), rounded `{rounded.md}` (8px).
- Used for the "PlayStation Store" sale callout, news cards, and PS Plus tier comparison cards on light canvas.

**`product-card-dark`** — dark-canvas product card
- Container: background `{colors.surface-dark-card}` (`#181818`), padding `{spacing.lg}`, rounded `{rounded.md}`.
- Used for game-detail cards and dark-canvas feature panels.

**`game-tile`** — game/console thumbnail tile
- Container: background `{colors.surface-dark-elevated}`, padding 0, rounded `{rounded.md}`.
- Layout: 16:9 cover art at full bleed inside the radius, with title + platform tag overlaid at the bottom-left in `{typography.body-sm}`.
- Used in the "Great PS4 & PS5 games" rail and the PS5 games listing grid.

**`feature-card`** — light-canvas marketing card
- Container: background `{colors.canvas-light}`, padding `{spacing.xl}` (32px), rounded `{rounded.md}`.
- Used for the "PlayStation Store" hero card and similar feature panels with a small product icon, title, body, and CTA.

**`hero-band-blue`** — the PlayStation Blue full-bleed band
- Background `{colors.primary}`, text `{colors.on-primary}` in `{typography.display-md}`, padding `96px 48px`, rounded `{rounded.none}`.
- The Marathon launch CTA strip and the footer surface use this band. The band''s defining purpose is "this is the action moment of the page."

**`hero-band-dark`** — full-bleed dark hero
- Background `{colors.canvas-dark}` (with optional gradient end at `{colors.surface-dark-elevated}`), text `{colors.on-dark}` in `{typography.display-xl}`, padding `96px 48px`, rounded `{rounded.none}`.
- The home-page hero, the game-detail page hero, and the "ON PLAYSTATION" anniversary band.

**`hero-band-light`** — full-bleed white hero
- Background `{colors.canvas-light}`, text `{colors.ink}` in `{typography.display-xl}`, padding `96px 48px`, rounded `{rounded.none}`.
- The console showcase band ("Discover all PS5 consoles and accessories") and the support page top.

**`ps-plus-banner`** — PlayStation Plus tier callout
- Background `{colors.surface-dark-elevated}` with the `{colors.ps-plus-gold-start}` → `{colors.ps-plus-gold-end}` gold gradient as a horizontal accent bar across the top, text `{colors.on-dark}` in `{typography.heading-xl}`, padding `48px 32px`, rounded `{rounded.md}`.
- The "Discover PlayStation Plus" full-width banner on the home page.

**`carousel-paddle`** — circular carousel control
- Background `rgba(255,255,255,0.16)`, icon `{colors.on-dark}`, rounded `{rounded.full}`, size 48px.
- Anchored to the left/right edge of the game tile carousel.

**`pagination-dot`** + **`pagination-dot-active`**
- 8px circle at `{rounded.full}`. Default fill `{colors.ash-dark}`; active fill `{colors.on-dark}`.
- Carousel position indicator below the game tile rail.

### Inline

**`badge-info`** — small info tag
- Background `{colors.primary}`, text `{colors.on-primary}` in `{typography.caption-sm}`, padding `4px 10px`, rounded `{rounded.full}`.
- "New", "Pre-order", "Coming Soon" labels overlaid on game tiles.

**`link-inline`** — body-prose anchor link
- `{colors.link-light}` text on light canvas / `{colors.link-dark}` on dark canvas, no underline by default. Inline body links inside support article paragraphs.

### Navigation

**`primary-nav`**
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, height ~48px, type `{typography.body-strong}`, rounded `{rounded.none}`.
- Layout (desktop): PlayStation P-logo at far-left, centered nav row ("Games · PS5 · PS4 · PS VR2 · Subscriptions · Hardware · Mobile · News · Shop · Support"), right cluster (search-glyph + locale + cart icon + user-avatar circle).

**`sub-nav`** — secondary nav strip
- Background `{colors.canvas-dark}`, text `{colors.on-dark}` in `{typography.caption-md}`, height ~40px, rounded `{rounded.none}`.
- Sits directly below the primary nav on PS5 games / single game / PS Plus pages with section-specific anchor links.

**Top Nav (Mobile)**
- Hamburger menu icon at left, P-logo at center, search + cart icons at right. Primary nav collapses into a full-screen dark drawer that slides from the left.

### Footer

**`footer-section`**
- Background `{colors.primary}` (PlayStation Blue), text `{colors.on-primary}` in `{typography.caption-md}`, padding `{spacing.xxl}` (48px) vertical.
- Layout: large PlayStation wordmark at top-left, multi-column link grid (locale selector, store links, account, support, social), bottom row with terms / privacy fine-print in `{typography.caption-sm}`.
- The footer''s blue surface is the system''s "we''re done — return to the brand" anchor.

### Support-page-specific

**`support-row`** — support article-list row
- Background `{colors.canvas-light}`, text `{colors.ink}` in `{typography.body-md}`, padding `16px 0`, with a 1px `{colors.hairline-light}` bottom rule.
- Used for FAQ / category-listing rows on the support page with a small chevron-right icon at the right edge.', '{"sourcePath":"docs/design-md/playstation/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` (PlayStation Blue) for primary CTAs and the footer surface only. The blue band is precious — at most one full-bleed blue band per page.
- Reserve `{colors.commerce}` (orange) for store/buy/pre-order CTAs only. It is never used on marketing chrome or hero pills.
- Use PlayStation SST at weight 300 for display headings (54 / 44 / 35 / 28 / 22). The light weight is the brand voice.
- Stack content sections at `{spacing.section}` (96px) rhythm with the next band''s surface color taking over the page edge-to-edge — no decorative dividers between bands.
- Use `{rounded.full}` (9999px) on every CTA pill and `{rounded.md}` (8px) on every product card. The two-radius vocabulary is the entire shape system aside from inputs.
- Pair full-bleed game key art and console renders inside dark or light bands; let imagery occupy 60-90% of the band''s vertical height.
- Use `{component.ps-plus-banner}` with the gold gradient exclusively for the PlayStation Plus tier callout — never decorate other components with the gold.

### Don''t
- Don''t introduce drop shadows on resting cards. The system is flat-on-canvas; cards lift only on press.
- Don''t replace `{colors.primary}` with another shade of blue. The brand blue is precise — `#0070d1` for default and `#0064b7` for pressed.
- Don''t use `{colors.commerce}` (orange) on marketing/hero CTAs. It''s reserved exclusively for store actions.
- Don''t introduce a sans-serif body font, italic, or monospace style. PlayStation SST carries every text role.
- Don''t soften pill geometry. CTAs are always `{rounded.full}` — no medium-radius buttons.
- Don''t use the gold PS Plus gradient on anything that isn''t the PS Plus banner. It is a tier-specific brand asset.
- Don''t put a gradient on chrome. The only allowed gradient is the gold PS Plus accent and the soft top-to-bottom darkening of the "ON PLAYSTATION" band.', '{"sourcePath":"docs/design-md/playstation/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Hero band stays at content max-width 1280px; outer gutters grow to ~80px |
| desktop-large | 1440px | Default desktop — 4-up game tile carousel, full primary nav |
| desktop | 1280px | Same layout with narrower outer gutters |
| desktop-small | 1024px | Game tile rail collapses to 3-up; sub-nav remains horizontal |
| tablet | 768px | Game tiles → 2-up; primary nav becomes hamburger drawer |
| mobile | 480px | Single-column everything; hero `{typography.display-xl}` scales 54px → ~32px |
| mobile-narrow | 320px | Section padding tightens to 32px; hero further scales to ~28px |

### Touch Targets
All interactive elements meet WCAG AAA (≥ 44×44px). `{component.button-primary}` and `{component.button-commerce}` sit at 48px height with 28px horizontal padding (effective ~48×100px tappable). `{component.text-input}` sits at 48px. `{component.support-search-bar}` sits at 56px. `{component.filter-pill}` is ~36–40px height with 16px padding extending to 44px tappable via inline padding. `{component.carousel-paddle}` is exactly 48×48 circular.

### Collapsing Strategy
- **Primary nav:** desktop horizontal cluster → tablet hamburger drawer at 768px. The right-cluster icons (search, cart, account) stay visible at every breakpoint.
- **Sub-nav:** desktop horizontal anchor row → tablet horizontal scroll → mobile select dropdown.
- **Game tile carousel:** 4-up → 3-up → 2-up at 1024 and 768px; carousel paddles stay visible at every desktop breakpoint, hide on mobile in favor of touch-swipe.
- **Hero bands:** stay full-bleed at every breakpoint; only the internal content column reflows from 2-column (text-left + image-right) to single-column (text above image).
- **Console showcase:** desktop 5-up thumbnail strip → tablet 3-up + horizontal scroll → mobile 1-up with paddle.
- **Support page:** desktop 30/70 split (sidebar + body) → tablet sidebar promoted to top accordion → mobile fully collapsed accordion.
- **Section padding:** `{spacing.section}` (96px) desktop → 64px tablet → 48px mobile.
- **Hero headline:** `{typography.display-xl}` (54px) at desktop, scaling 44px / 32px / 28px down the breakpoint stack.

### Image Behavior
- Hero imagery (console renders, game key art) uses art-direction crops on mobile so the central subject stays centered when the band collapses to single-column.
- Game tile cover art preserves 16:9 ratio at every breakpoint; only the column count changes.
- Console showcase thumbnails maintain their natural aspect (~1:1 product render) across breakpoints.
- All non-critical imagery is lazy-loaded as the user scrolls into the next chapter.', '{"sourcePath":"docs/design-md/playstation/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.full}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-pressed`, `-disabled`) — do not bury them inside prose.
5. Default body to `{typography.body-md}` (18px / 400 / 1.5); reach for `{typography.display-xl}` strictly for the page-top hero headline; use `{typography.body-strong}` for primary nav links.
6. Keep `{colors.primary}` scarce per viewport — at most one full-bleed PlayStation Blue band per page.
7. When introducing a new component, ask whether it can be expressed with the existing pill + 8px-radius card + full-bleed-band vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.', '{"sourcePath":"docs/design-md/playstation/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes PlayStation''s known mobile pattern (hamburger drawer, single-column band reflow, hero downscale) from desktop evidence and the breakpoint stack.
- **Hover states not documented** by system policy.
- **Sign-in / authentication chrome** (login modal, account dashboard, profile pages) not in the captured pages.
- **PlayStation Store** in-store browsing surfaces (PDP / cart / checkout) are not in the captured set — those use a more dense data-table layout that this document does not describe.
- **Game-page-specific theming** — the `/marathon/` page uses `{colors.marathon-yellow}` as a chapter accent. Other game pages may pull in their own per-title brand colors that vary outside the documented system.
- **Form validation states** (success / error inline messages) not present in the captured surfaces beyond the `{colors.warning}` color token.', '{"sourcePath":"docs/design-md/playstation/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_1', '#0070d1', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_2', '#0064b7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_3', '#004d8d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_4', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_5', '#53b1ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_6', '#d53b00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_7', '#aa2f00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_8', '#d63d00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_9', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_10', '#121314', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_11', '#181818', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_12', '#1f2024', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_13', '#6b6b6b', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_14', '#cccccc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_15', '#f3f3f3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_16', '#f5f7fa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_17', '#c81b3a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_18', '#ffce21', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_19', '#f5a623', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_20', '#ee8e00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md'), 'color', 'color_21', '#deff20', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/playstation/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/playstation/DESIGN.md';


-- Posthog
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Posthog', 'posthog', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/posthog/DESIGN.md', null, 'seeded', '---
version: alpha
name: PostHog-design-analysis
description: |
  A playful developer-tools system rendered on a warm cream canvas with hand-drawn hedgehog mascots dotted across every page like marginalia in a sketchbook. The chrome reads like a friendly engineering blog: olive-gray ink (#4d4f46) for body, deep olive-charcoal (#23251d) for headlines, IBM Plex Sans Variable typography in tight 1.43-line-height paragraphs, and a single saturated yellow-orange CTA pill (#f7a501) carrying every primary action. The system actively rejects the genre''s typical somber dark-tech aesthetic in favor of a creamy, textbook-illustration sensibility — bordered cards stack on the cream canvas with 4–6px radii, doc sidebars use rounded outline-icon mini-illustrations, and the home page leans on cartoon characters (hedgehogs in lab coats, hedgehogs at terminals, hedgehogs in lounge chairs) as its signature decoration. Code samples and product analytics charts live inside white-on-cream cards with thin olive borders; the contrast between the playful illustration and the data-dense product imagery is the brand''s signature voice.

colors:
  primary: "#f7a501"
  primary-pressed: "#dd9001"
  primary-active: "#b17816"
  on-primary: "#23251d"
  ink: "#23251d"
  body: "#4d4f46"
  charcoal: "#33342d"
  mute: "#6c6e63"
  ash: "#9b9c92"
  stone: "#b6b7af"
  hairline: "#bfc1b7"
  hairline-soft: "#dcdfd2"
  on-dark: "#ffffff"
  canvas: "#eeefe9"
  surface-soft: "#e5e7e0"
  surface-card: "#ffffff"
  surface-doc: "#fcfcfa"
  surface-dark: "#23251d"
  link-blue: "#1d4ed8"
  link-teal: "#1078a3"
  accent-blue: "#2c84e0"
  accent-blue-soft: "#dceaf6"
  accent-red: "#cd4239"
  accent-red-soft: "#f7d6d3"
  accent-green: "#2c8c66"
  accent-green-soft: "#d9eddf"
  accent-purple: "#7c44a6"
  accent-purple-soft: "#e7d8ee"
  focus-ring: "rgba(59,130,246,0.5)"

typography:
  display-xl:
    fontFamily: IBM Plex Sans Variable
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
  display-lg:
    fontFamily: IBM Plex Sans Variable
    fontSize: 24px
    fontWeight: 800
    lineHeight: 1.33
    letterSpacing: -0.6px
  heading-lg:
    fontFamily: IBM Plex Sans Variable
    fontSize: 21px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.5px
  heading-md:
    fontFamily: IBM Plex Sans Variable
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0
  heading-sm:
    fontFamily: IBM Plex Sans Variable
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
    textTransform: uppercase
  heading-sm-mixed:
    fontFamily: IBM Plex Sans Variable
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.56
    letterSpacing: 0
  body-md:
    fontFamily: IBM Plex Sans Variable
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: IBM Plex Sans Variable
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: IBM Plex Sans Variable
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.71
    letterSpacing: 0
  body-sm-strong:
    fontFamily: IBM Plex Sans Variable
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.71
    letterSpacing: 0
  body-xs:
    fontFamily: IBM Plex Sans Variable
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: 0
  caption-md:
    fontFamily: IBM Plex Sans Variable
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.71
    letterSpacing: 0
  caption-sm:
    fontFamily: IBM Plex Sans Variable
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  caption-xs:
    fontFamily: IBM Plex Sans Variable
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0
    textTransform: uppercase
  utility-xs:
    fontFamily: IBM Plex Sans Variable
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: 0
    textTransform: uppercase
  link-md:
    fontFamily: IBM Plex Sans Variable
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button-md:
    fontFamily: IBM Plex Sans Variable
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
  button-sm:
    fontFamily: IBM Plex Sans Variable
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
  code-sm:
    fontFamily: ui-monospace
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  code-xs:
    fontFamily: Source Code Pro
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: 0

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
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
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    height: 40px
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    height: 40px
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  button-disabled:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ash}"
    rounded: "{rounded.md}"
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 8px 12px
    height: 36px
  text-input-focused:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  search-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 8px 12px
    height: 36px
  product-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 24px
  doc-card:
    backgroundColor: "{colors.surface-doc}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 24px
  feature-tile:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-sm-mixed}"
    rounded: "{rounded.md}"
    padding: 20px
  pricing-tier-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 32px
  hedgehog-mascot-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 24px
  product-tab:
    backgroundColor: "transparent"
    textColor: "{colors.body}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  product-tab-active:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
  pill-tab:
    backgroundColor: "transparent"
    textColor: "{colors.body}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 6px 14px
  pill-tab-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
  badge-uppercase:
    backgroundColor: "transparent"
    textColor: "{colors.body}"
    typography: "{typography.utility-xs}"
    rounded: "{rounded.none}"
  badge-promo:
    backgroundColor: "{colors.accent-blue-soft}"
    textColor: "{colors.link-blue}"
    typography: "{typography.caption-xs}"
    rounded: "{rounded.full}"
    padding: 2px 8px
  banner-tip-blue:
    backgroundColor: "{colors.accent-blue-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px 20px
  banner-tip-green:
    backgroundColor: "{colors.accent-green-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px 20px
  banner-tip-red:
    backgroundColor: "{colors.accent-red-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px 20px
  banner-tip-purple:
    backgroundColor: "{colors.accent-purple-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px 20px
  code-block:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.md}"
    padding: 16px 20px
  inline-code:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.code-xs}"
    rounded: "{rounded.xs}"
    padding: 2px 6px
  primary-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
    height: 56px
  sub-nav-strip:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.body-xs}"
    rounded: "{rounded.none}"
    height: 40px
  doc-sidebar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-xs}"
    rounded: "{rounded.none}"
    width: 240px
  footer-section:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-xs}"
    rounded: "{rounded.none}"
    padding: 32px 24px
  link-inline:
    textColor: "{colors.link-teal}"
    typography: "{typography.link-md}"
---

## Overview

PostHog''s marketing system is built on the visual contradiction at the heart of the brand: a serious open-source product analytics platform rendered as if it were a friendly engineering sketchbook. The chrome runs on a warm cream canvas (`{colors.canvas}` — `#eeefe9`) — not white — and every page is dotted with hand-drawn hedgehog mascots in lab coats, lounge chairs, terminals, and reading glasses, scattered across the layout like marginalia in a textbook. Type sits in IBM Plex Sans Variable at olive-gray (`{colors.body}` — `#4d4f46`) for body and deep olive-charcoal (`{colors.ink}` — `#23251d`) for headlines, with weights stepped tightly between 400, 600, 700, and 800 to create hierarchy without color. The single saturated yellow-orange pill (`{colors.primary}` — `#f7a501`) is the brand''s only loud chromatic moment; everything else is cream, olive, white card, and the occasional pastel callout band.

The system has a distinctive **two-mode body layout**: marketing pages (home, workflows, pricing) lean on alternating-pastel callout bands and feature tiles in white cards on cream, while documentation pages add a sticky 240px left sidebar with a rounded outline-icon section list. Code samples are full-width dark blocks on `{colors.surface-dark}` (the same olive-charcoal that carries body ink, used inverted) inside white doc cards, creating the system''s most distinctive visual moment: a dark-on-dark code island floating inside a white card on a cream canvas, with a hedgehog mascot doodled in the margin.

Sections stack at `{spacing.section}` (80px) rhythm with cream canvas continuing edge-to-edge between them. The only color bands that interrupt the cream are pastel `{component.banner-tip-blue}` / `-green` / `-red` / `-purple` callout panels inside doc articles — soft tinted boxes that carry "💡 Tip", "✅ Success", "⚠️ Warning", "📘 Info" inline annotations. There are no decorative gradients, no atmospheric mesh backgrounds, and no full-bleed dark hero chapters; the cream canvas runs uninterrupted top to bottom and the hedgehogs are the entire visual identity.

**Key Characteristics:**
- Warm cream canvas (`{colors.canvas}` — #eeefe9) end-to-end with no surface alternation between sections — the page is one continuous sheet
- Single yellow-orange CTA pill (`{colors.primary}` — #f7a501) with deep olive text (`{colors.on-primary}`) — the brand''s only saturated color
- IBM Plex Sans Variable across every text role with weights 400/500/600/700/800 — no other typeface in the system
- Hand-drawn hedgehog mascots scattered across the layout as the entire decorative system — no gradients, no mesh, no atmospheric backgrounds
- 4–8px radius card vocabulary: `{rounded.md}` (6px) for most components, `{rounded.lg}` (8px) for select containers, fully rounded for pill chips
- Pastel callout banners (`{colors.accent-blue-soft}`, `{colors.accent-green-soft}`, `{colors.accent-red-soft}`, `{colors.accent-purple-soft}`) break up doc article body with soft tinted side rails for tips/warnings/info
- Documentation pages add a sticky 240px `{component.doc-sidebar}` with rounded outline-icon section nav and an "Ask PostHog AI" CTA at the top

## Colors

> **Source pages:** `/` (home), `/pricing` (pricing detail), `/docs/product-analytics` (docs article), `/workflows` (product feature page). The chrome palette is identical across all four pages — only doc-specific accents (callout-banner pastels, code-block dark surface) appear exclusively inside the docs experience.

### Brand & Accent
- **PostHog Yellow** (`{colors.primary}` — `#f7a501`): the universal primary CTA. Sticky "Get started — free" pill in the top-right of every nav, hero CTAs, pricing-tier subscribe buttons, footer signup pill. The system''s only saturated chromatic moment.
- **Yellow Pressed** (`{colors.primary-pressed}` — `#dd9001`): pressed state for the primary pill.
- **Yellow Active** (`{colors.primary-active}` — `#b17816`): deeply-pressed yellow + the system''s gold-toned border accent (rare 1px gold rule on inline form elements).

### Surface
- **Canvas** (`{colors.canvas}` — `#eeefe9`): the warm cream page background. End-to-end on every page; the brand''s most distinctive surface choice.
- **Soft Surface** (`{colors.surface-soft}` — `#e5e7e0`): button-secondary fill, sub-nav strip background, inline-code chip background.
- **Surface Card** (`{colors.surface-card}` — `#ffffff`): true white card and tile background sitting on top of the cream canvas. The dominant card surface.
- **Surface Doc** (`{colors.surface-doc}` — `#fcfcfa`): a faintly cream-warm white used inside doc article body cards — slightly softer than pure white to keep the page tonally unified.
- **Surface Dark** (`{colors.surface-dark}` — `#23251d`): the deep olive-charcoal used inverted as code-block background. The same hex as `{colors.ink}` — the brand uses one olive-near-black for both text and dark code surfaces.
- **Hairline** (`{colors.hairline}` — `#bfc1b7`): 1px card border, table rule, footer column dividers.
- **Hairline Soft** (`{colors.hairline-soft}` — `#dcdfd2`): in-card row divider, soft inset rule.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.surface-dark}` code blocks.

### Text
- **Ink** (`{colors.ink}` — `#23251d`): headlines, button text on light, primary nav links — deep olive-charcoal that reads near-black against cream.
- **Body** (`{colors.body}` — `#4d4f46`): default paragraph text, doc article body, inline link color before hover. The brand''s most-used text color.
- **Charcoal** (`{colors.charcoal}` — `#33342d`): emphasized body text where body is too soft.
- **Mute** (`{colors.mute}` — `#6c6e63`): metadata, footer link text, in-list secondary annotations.
- **Ash** (`{colors.ash}` — `#9b9c92`): disabled-state text and lowest-emphasis utility.
- **Stone** (`{colors.stone}` — `#b6b7af`): least-emphasis caption text and disabled icon color.

### Semantic
- **Link Blue** (`{colors.link-blue}` — `#1d4ed8`): inline anchor link inside body prose. The system''s primary informational link color.
- **Link Teal** (`{colors.link-teal}` — `#1078a3`): doc-article inline link variant, paired with body text.
- **Accent Blue** (`{colors.accent-blue}` — `#2c84e0`) + **Accent Blue Soft** (`{colors.accent-blue-soft}` — `#dceaf6`): "💡 Tip / Info" callout banner inside docs.
- **Accent Red** (`{colors.accent-red}` — `#cd4239`) + **Accent Red Soft** (`{colors.accent-red-soft}` — `#f7d6d3`): "⚠️ Warning / Caution" callout banner.
- **Accent Green** (`{colors.accent-green}` — `#2c8c66`) + **Accent Green Soft** (`{colors.accent-green-soft}` — `#d9eddf`): "✅ Success / Positive" callout banner.
- **Accent Purple** (`{colors.accent-purple}` — `#7c44a6`) + **Accent Purple Soft** (`{colors.accent-purple-soft}` — `#e7d8ee`): "📘 Note / Reference" callout banner.
- **Focus Ring** (`{colors.focus-ring}` — `rgba(59,130,246,0.5)`): translucent blue browser-default focus ring around interactive elements.

## Typography

### Font Family
**IBM Plex Sans Variable** is the system''s primary face — used across every text role on every page at weights 400 (regular), 500 (medium), 600 (semibold), 700 (bold), and 800 (extra-bold). Falls back through `IBM Plex Sans` → `-apple-system` → `system-ui` → broad cross-platform sans stack.

**ui-monospace** + **Source Code Pro** carry code samples and inline-code chips at 14px / 1.43 line-height. Source Code Pro is the explicit display monospace; ui-monospace handles inline `<code>` chips.

The brand-distinctive choice is the **mixed weight ladder** (400 / 500 / 600 / 700 / 800) — most chrome lives in the 400–700 band, with weight 800 reserved exclusively for the larger display headlines on home and pricing. This gives the system its "engineering blog" feel: hierarchy is built from weight contrast much more than from size.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 36px | 700 | 1.5 | 0 | Hero headline ("The new way to build products") |
| `{typography.display-lg}` | 24px | 800 | 1.33 | -0.6px | Section headline, pricing tier name |
| `{typography.heading-lg}` | 21px | 700 | 1.4 | -0.5px | Sub-section heading, doc-article H2 |
| `{typography.heading-md}` | 20px | 700 | 1.4 | 0 | Card group title, in-grid heading |
| `{typography.heading-sm}` | 18px | 700 | 1.5 | 0 (uppercase) | Section eyebrow ("UNDERSTAND PRODUCT USAGE") |
| `{typography.heading-sm-mixed}` | 18px | 600 | 1.56 | 0 | Card title in mixed-case (no uppercase transform) |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Body copy, default paragraph |
| `{typography.body-strong}` | 16px | 600 | 1.5 | 0 | Inline emphasis, primary nav link, in-card label |
| `{typography.body-sm}` | 15px | 400 | 1.71 | 0 | Doc article body, marketing card description |
| `{typography.body-sm-strong}` | 15px | 600 | 1.71 | 0 | Sub-section emphasis inside doc article |
| `{typography.body-xs}` | 14px | 500 | 1.43 | 0 | Doc sidebar item, metadata, in-list caption |
| `{typography.caption-md}` | 14px | 700 | 1.71 | 0 | Card eyebrow, link cluster header |
| `{typography.caption-sm}` | 13px | 500 | 1.5 | 0 | Compact metadata caption |
| `{typography.caption-xs}` | 12px | 600 | 1.33 | 0 (uppercase) | Inline badge label |
| `{typography.utility-xs}` | 12px | 700 | 1.33 | 0 (uppercase) | Section-eyebrow utility text, footer category header |
| `{typography.link-md}` | 16px | 400 | 1.5 | 0 | Inline body anchor link |
| `{typography.button-md}` | 14px | 700 | 1.5 | 0 | Standard primary/secondary button label |
| `{typography.button-sm}` | 13px | 500 | 1 | 0 | Pill chip / compact CTA |
| `{typography.code-sm}` | 14px | 400 | 1.43 | 0 | Code block content |
| `{typography.code-xs}` | 14px | 500 | 1.43 | 0 | Inline code chip |

### Principles
The hierarchy is explicitly built from weight + size + occasional uppercase transform — there is no italic style, no decorative display variant, no proprietary face. The biggest display moments use weight 800 with -0.6px tracking, and the body settles at 400 with 1.5 line-height; everything else fills the band between. Section eyebrows (`{typography.heading-sm}` and `{typography.utility-xs}`) consistently render uppercase, which gives the doc layout its textbook-chapter feel.

### Note on Font Substitutes
IBM Plex Sans Variable is open-source and Google-Fonts-hosted. There is no need for a substitute — load it directly. If a substitute is genuinely needed, **Inter** is the closest geometric match at all five weights; pair with Inter''s letter-spacing -0.5 to -0.6px on display sizes to approximate Plex''s display tracking. For monospace, **JetBrains Mono** is a near-perfect substitute for Source Code Pro at body sizes.

## Layout

### Spacing System
- **Base unit:** 8px (with finer 2/4/6px steps for tight inline gaps in callout banners and pill buttons).
- **Tokens (front matter):** `{spacing.xxs}` (2px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (80px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (80px) as the vertical gap between major content blocks. Card grids use `{spacing.lg}` (16px) gutters; card internal padding sits at `{spacing.xl}` (24px) for product cards and `{spacing.xxl}` (32px) for pricing tier cards.

### Grid & Container
- **Max width:** ~1280px content area at desktop with 24px gutters (~48px at ultrawide). Doc article body sits at ~720px max width with the 240px sidebar pushing the article column right of center.
- **Marketing card grid:** 4-up at desktop, 3-up at 1024px, 2-up at 768px, 1-up at 480px. Cards preserve a fixed 1:1 or 4:3 ratio.
- **Pricing tier grid:** 3-up at desktop with a left rail of plan info, collapsing to 2-up + 1 at tablet and 1-up at mobile.
- **Doc layout:** desktop 240px sticky left sidebar + ~720px article body + (optional) 200px right TOC rail = ~1160px content width.
- **Footer:** 6-column horizontal link grid at desktop, 3-up at tablet, 2-up at mobile.

### Whitespace Philosophy
Whitespace is generous on marketing pages and tight on doc pages. The home and workflows pages stack feature tiles with `{spacing.lg}` (16px) gutters and 24px internal padding, while doc articles tighten internal spacing to `{spacing.md}` (12px) between paragraphs to maximize information density. The cream canvas runs continuously through every section — there are no decorative dividers, no shaded section bands; only the 1px hairline beneath section eyebrows and footer column rules separate content blocks.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for canvas-on-canvas blocks, hero text, body sections |
| 1 — Hairline border | 1px solid `{colors.hairline}` | Marketing cards, pricing tier cards, doc sidebar items, footer column rules |
| 2 — Hairline soft | 1px solid `{colors.hairline-soft}` | In-card row divider between adjacent rows |
| 3 — Inverted dark code block | `{colors.surface-dark}` fill | Code samples inside doc cards — the system''s only "elevated" surface uses color, not shadow |

The system has no drop-shadow elevation in marketing or product chrome. Cards sit flat on cream with thin olive borders. The single inverted moment is the dark code-block surface used inside doc article body cards.

### Decorative Depth
Depth comes entirely from illustration and the pastel callout band system, not from CSS effects:
- **Hand-drawn hedgehog mascots** — characters in various costumes (lab coat, terminal, lounge chair, magnifying glass, hammock, hat) scattered across pages as marginalia. Always rendered as flat color illustrations, never photographs.
- **Pastel callout banners** — `{component.banner-tip-blue}` / `-green` / `-red` / `-purple` soft tinted side-rail panels inside doc articles, each prefixed with an emoji icon (💡 ✅ ⚠️ 📘) and carrying tip/warning/note copy.
- **Code blocks** — full-width dark olive-charcoal panels on `{colors.surface-dark}` with white code text. The system''s most cinematic surface, used inside white doc cards.
- **Outline product icons** in the doc sidebar — small rounded-square mini-illustrations (chart icon, funnel, session-replay icon) mark each major product section.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Sub-nav strip, footer, doc sidebar, primary nav — flat structural surfaces |
| `{rounded.xs}` | 2px | Inline `<code>` chips, micro-rule highlights |
| `{rounded.sm}` | 4px | Inline buttons, form inputs, micro chips |
| `{rounded.md}` | 6px | Marketing cards, pricing cards, doc cards, code blocks, every standard CTA |
| `{rounded.lg}` | 8px | Tab top corners (`6px 6px 0 0` on active tab) and rare large containers |
| `{rounded.full}` | 9999px | Pill chips and pill-style CTAs ("Get started — free" sticky CTA in nav) |

The radius vocabulary clusters around 4–6px for nearly everything; the only fully-rounded element is the pill-style sticky nav CTA and inline pill chips.

### Photography Geometry
There is no photography. Visual elements are limited to:
- **Hedgehog character illustrations** — flat-color cartoon hedgehogs ranging from ~80px (in-card mascot) to ~240px (hero illustration). Always at native aspect, never cropped to a frame.
- **Outline product icons** in the doc sidebar — 20–24px rounded-square illustrations.
- **Inline emoji** at 14–16px inside callout banners (💡 ✅ ⚠️ 📘) — used as functional iconography rather than decoration.
- **Section illustrations** on the home page — small hedgehog vignettes paired with each "Understand product usage" / "Build sticky habits" / "Test before launch" feature row.

## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal PostHog CTA
- Background `{colors.primary}` (yellow-orange), text `{colors.on-primary}` (deep olive), type `{typography.button-md}`, padding `8px 16px`, height `40px`, rounded `{rounded.md}`.
- Used for "Get started — free" (sticky top-nav CTA), "Sign up", "Try it free", "Subscribe" — every primary action.
- Pressed state lives in `button-primary-pressed` — background drops to `{colors.primary-pressed}`.

**`button-secondary`** — soft alternative on cream canvas
- Background `{colors.surface-soft}` (`#e5e7e0`), text `{colors.ink}`, type `{typography.button-md}`, padding `8px 16px`, height `40px`, rounded `{rounded.md}`.
- "Talk to sales", "Read docs", "Watch demo" — second-tier actions paired with the yellow primary.

**`button-tertiary`** — ghost text button
- Background transparent, text `{colors.ink}`, type `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.md}`.
- Lowest-emphasis action: "See all docs →", "Browse all features".

**`button-disabled`**
- Background `{colors.surface-soft}`, text `{colors.ash}` — flat soft cream-gray.

### Tabs & Chips

**`product-tab`** + **`product-tab-active`** — major product section tabs
- Default: transparent background, text `{colors.body}`, type `{typography.body-strong}`, padding `8px 12px`, rounded `{rounded.md}`.
- Active: background flips to `{colors.surface-card}` (white), text `{colors.ink}` — the tab card lifts off the cream canvas as the visual signal of selection.

**`pill-tab`** + **`pill-tab-active`** — compact filter pill
- Default: transparent background, text `{colors.body}`, type `{typography.button-sm}`, padding `6px 14px`, rounded `{rounded.full}`.
- Active: background flips to `{colors.ink}`, text `{colors.on-dark}` — the chip flips fully inverted on selection.

**`badge-uppercase`** — text-only utility label
- Background transparent, text `{colors.body}` in `{typography.utility-xs}` (uppercase) — used as in-list category prefix ("FEATURE FLAG", "EXPERIMENT", "HEATMAP").

**`badge-promo`** — small inline pill chip
- Background `{colors.accent-blue-soft}`, text `{colors.link-blue}`, type `{typography.caption-xs}`, padding `2px 8px`, rounded `{rounded.full}`.
- "New", "Beta", "Coming soon" pill labels overlaid on cards.

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.surface-card}`, text `{colors.ink}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `8px 12px`, height `36px`, rounded `{rounded.md}`.
- Focused: same surface; 2px solid `{colors.accent-blue}` border replaces the 1px hairline + a translucent `{colors.focus-ring}` outline.

**`search-input`** — utility search field (doc sidebar, "Ask PostHog AI")
- Same dimensions as `text-input` with a magnifier glyph at the left edge in `{colors.mute}`.

### Cards & Containers

**`product-card`** — marketing tile / feature card
- Container: background `{colors.surface-card}` (white), 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.md}`.
- Layout: small hedgehog illustration at top-left, `{typography.heading-sm-mixed}` title, `{typography.body-sm}` description, optional `{component.button-tertiary}` "Learn more →" link.

**`doc-card`** — doc article body card
- Container: background `{colors.surface-doc}` (`#fcfcfa` warm-white), 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.md}`.
- Carries article body sections, code blocks, callout banners, and tables inside doc pages.

**`feature-tile`** — small marketing feature tile
- Container: background `{colors.surface-card}`, 1px solid `{colors.hairline}`, padding `{spacing.lg}` (20px), rounded `{rounded.md}`.
- Used in 3-up or 4-up grids on home and workflows pages — paired with a small icon and a 1-line description.

**`pricing-tier-card`** — pricing plan card
- Container: background `{colors.surface-card}`, 1px solid `{colors.hairline}`, padding `{spacing.xxl}` (32px), rounded `{rounded.md}`.
- Layout: tier name in `{typography.display-lg}` (24px / 800 / -0.6px), large price + period, feature checklist with check-icon bullets, primary or secondary CTA at bottom.

**`hedgehog-mascot-card`** — feature card with margin-anchored hedgehog
- Same chrome as `{component.product-card}` but with a hand-drawn hedgehog illustration anchored in the right margin or top-right corner — the brand''s signature card variant.

### Callout Banners

**`banner-tip-blue`** + **`banner-tip-green`** + **`banner-tip-red`** + **`banner-tip-purple`**
- Background `{colors.accent-blue-soft}` / `{colors.accent-green-soft}` / `{colors.accent-red-soft}` / `{colors.accent-purple-soft}`, text `{colors.ink}`, type `{typography.body-md}`, padding `16px 20px`, rounded `{rounded.md}`.
- Each prefixed with an inline emoji icon (💡 / ✅ / ⚠️ / 📘) followed by an inline label and body copy.
- Only appear inside doc article body. The four-color callout family is the brand''s information-architecture vocabulary for inline tips/warnings/info inside long-form documentation.

### Code

**`code-block`** — dark code sample inside doc card
- Container: background `{colors.surface-dark}` (deep olive-charcoal), text `{colors.on-dark}` in `{typography.code-sm}`, padding `16px 20px`, rounded `{rounded.md}`.
- Syntax highlighting uses muted accent colors (blue for keywords, green for strings, purple for numbers) — never the bright accent colors used in callout banners.

**`inline-code`** — small inline `<code>` chip
- Background `{colors.surface-soft}`, text `{colors.ink}` in `{typography.code-xs}`, padding `2px 6px`, rounded `{rounded.xs}` (2px).
- Used inside body prose to mark code snippets and identifiers.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}` (cream — same as the page), text `{colors.ink}`, height `56px`, type `{typography.body-strong}`, rounded `{rounded.none}`.
- Layout (desktop): PostHog wordmark + hedgehog logo at left, nav menu cluster ("Pricing · Docs · Community · Company"), right cluster with a search-glyph, "Login" link, and the always-yellow `{component.button-primary}` "Get started — free" pill anchored to the far right.

**`sub-nav-strip`** — secondary nav bar (under primary)
- Background `{colors.surface-soft}`, text `{colors.body}` in `{typography.body-xs}`, height `40px`, rounded `{rounded.none}`.
- Sits directly below the primary nav on workflows / product pages with section anchor links and a contextual "Get started →" link at the right.

**`doc-sidebar`** — sticky doc-page left sidebar
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.body-xs}`, width `240px`, rounded `{rounded.none}`.
- Layout: search-input "Ask PostHog AI" at top, then a vertical list of section headers each with a small rounded outline-icon mini-illustration, then nested item links indented under the active header.

**Top Nav (Mobile)**
- Hamburger menu icon at left, PostHog wordmark + hedgehog at center, search + sticky yellow "Get started — free" CTA at right. Primary nav collapses into a full-height drawer that slides from the left.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.body-xs}`, padding `32px 24px`, rounded `{rounded.none}`, with a 1px `{colors.hairline}` top rule.
- Layout: 6-column horizontal link grid (Product · Resources · Company · Community · Pricing · Legal), each column with a `{typography.utility-xs}` (uppercase) header and a vertical list of links in `{typography.body-xs}` `{colors.body}`.
- Bottom row: PostHog wordmark + small hedgehog illustration, copyright in `{typography.caption-xs}` `{colors.mute}`, social-icon row at far-right.

### Inline

**`link-inline`** — body-prose anchor link
- `{colors.link-teal}` (`#1078a3`) in body prose with no underline by default; underline appears on focus. The brand''s primary inline link color.

## Do''s and Don''ts

### Do
- Use `{colors.canvas}` (cream — `#eeefe9`) as the page body. Never substitute pure white as the canvas.
- Reserve `{colors.primary}` (yellow-orange) for the primary CTA pill only. The "Get started — free" treatment is the brand''s anchor.
- Render the brand wordmark with the hedgehog illustration alongside it, not as a stand-alone wordmark. The hedgehog IS the brand identity.
- Use IBM Plex Sans Variable across every text role — body 400, emphasis 600/700, display 800.
- Stack content sections at `{spacing.section}` (80px) rhythm with no decorative dividers between them; let the cream canvas continue uninterrupted.
- Use `{component.banner-tip-blue}` / `-green` / `-red` / `-purple` only inside doc article body for tip/warning/note panels — keep marketing chrome out of the four-color callout family.
- Pair every code sample with the dark `{component.code-block}` surface; inline `<code>` chips use `{component.inline-code}` (cream surface-soft chip).
- Anchor a hedgehog mascot illustration in feature tile margins on home and workflows pages — the system''s signature decoration.

### Don''t
- Don''t introduce drop shadows on cards. Cards sit flat on cream with thin olive borders only.
- Don''t add a second saturated chromatic CTA. Yellow-orange is the only loud color in the system.
- Don''t replace the cream canvas with pure white or full-bleed dark hero bands. The cream is the brand.
- Don''t use the four-color callout banner pastels (`{colors.accent-blue-soft}`, `-green`, `-red`, `-purple`) as marketing-card backgrounds. They belong to inline doc content only.
- Don''t substitute the hedgehog illustration with a generic icon set. The character system is the brand.
- Don''t use uppercase transform outside of `{typography.heading-sm}`, `{typography.utility-xs}`, and `{typography.caption-xs}`. Uppercase is reserved for eyebrows and footer category headers.
- Don''t pad cards with 32px+ on all sides except for `{component.pricing-tier-card}`. Standard cards sit at 24px internal padding.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Content max-width holds at 1280px; outer gutters grow to ~80px |
| desktop-large | 1440px | Default — 4-up feature tile grid, 240px sticky doc sidebar visible |
| desktop | 1280px | Same layout with narrower outer gutters |
| desktop-small | 1024px | 4-up tiles collapse to 3-up; doc sidebar remains visible |
| tablet | 768px | 3-up tiles collapse to 2-up; doc sidebar collapses into a top accordion; primary nav becomes hamburger |
| mobile | 480px | Single-column everything; hero `{typography.display-xl}` scales 36px → ~28px |
| mobile-narrow | 320px | Section padding tightens to 32px |

### Touch Targets
All interactive elements meet WCAG AA (≥ 40×40px). `{component.button-primary}` and `{component.button-secondary}` sit at 40px height with 16px padding. `{component.text-input}` sits at 36px (just under AAA but above AA at this size). `{component.pill-tab}` is ~32–36px height with 14px padding extending to ~44px tappable via inline padding. Doc-sidebar items use 14px text with ~32px line-height + 6px vertical padding for ~44px tap rows.

### Collapsing Strategy
- **Primary nav:** desktop horizontal cluster → tablet hamburger drawer at 768px. The yellow "Get started — free" CTA stays visible at every breakpoint.
- **Sub-nav strip:** desktop horizontal anchor row → tablet horizontal scroll → mobile select dropdown.
- **Marketing card grid:** 4-up → 3-up → 2-up → 1-up at 1024, 768, and 480px; gutters drop from 16px to 12px on mobile.
- **Pricing grid:** 3-up → 2+1 → 1-up stacked at tablet and below.
- **Doc layout:** desktop 240px sidebar + 720px article → tablet sidebar collapses to a top accordion → mobile fully collapsed accordion.
- **Footer:** 6-up link columns → 3-up at tablet → 2-up at mobile.
- **Section padding:** `{spacing.section}` (80px) desktop → 64px tablet → 48px mobile.
- **Hero headline:** `{typography.display-xl}` (36px) at desktop, scaling to ~28px at mobile, line-height holding at 1.5.

### Image Behavior
The only "imagery" in the system is hand-drawn hedgehog illustrations rendered as inline SVG. They preserve their natural aspect at every breakpoint and scale via CSS `width: auto; max-width: 100%`. There is no responsive art-direction needed because there is no photography.

## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.md}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-pressed`, `-disabled`, `-focused`) — do not bury them inside prose.
5. Default body to `{typography.body-md}` (16px / 400 / 1.5); reach for `{typography.body-strong}` for emphasis; reserve `{typography.display-lg}` (24px / 800) strictly for marketing display moments.
6. Keep `{colors.primary}` scarce per viewport — at most one yellow-orange pill per fold.
7. When introducing a new component, ask whether it can be expressed with the existing card + 6px-radius + cream-canvas vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.

## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes PostHog''s mobile pattern (hamburger drawer, single-column grid, doc sidebar accordion) from desktop evidence and the breakpoint stack.
- **Hover states not documented** by system policy.
- **In-product app chrome** (PostHog dashboard, charts, session replay player) not in the captured set — the marketing site is documented here, not the in-product analytics interface.
- **Authenticated chrome** (login modal, account dashboard, billing settings) not in the captured pages.
- **Form validation states** beyond the focused-state input not present in the captured surfaces.
- **Marketing illustration set** — the full library of hedgehog character poses is not enumerated here; specific poses (lab coat hedgehog, terminal hedgehog, hammock hedgehog) are noted as visible in screenshots but the full asset library is page-specific.
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

PostHog''s marketing system is built on the visual contradiction at the heart of the brand: a serious open-source product analytics platform rendered as if it were a friendly engineering sketchbook. The chrome runs on a warm cream canvas (`{colors.canvas}` — `#eeefe9`) — not white — and every page is dotted with hand-drawn hedgehog mascots in lab coats, lounge chairs, terminals, and reading glasses, scattered across the layout like marginalia in a textbook. Type sits in IBM Plex Sans Variable at olive-gray (`{colors.body}` — `#4d4f46`) for body and deep olive-charcoal (`{colors.ink}` — `#23251d`) for headlines, with weights stepped tightly between 400, 600, 700, and 800 to create hierarchy without color. The single saturated yellow-orange pill (`{colors.primary}` — `#f7a501`) is the brand''s only loud chromatic moment; everything else is cream, olive, white card, and the occasional pastel callout band.

The system has a distinctive **two-mode body layout**: marketing pages (home, workflows, pricing) lean on alternating-pastel callout bands and feature tiles in white cards on cream, while documentation pages add a sticky 240px left sidebar with a rounded outline-icon section list. Code samples are full-width dark blocks on `{colors.surface-dark}` (the same olive-charcoal that carries body ink, used inverted) inside white doc cards, creating the system''s most distinctive visual moment: a dark-on-dark code island floating inside a white card on a cream canvas, with a hedgehog mascot doodled in the margin.

Sections stack at `{spacing.section}` (80px) rhythm with cream canvas continuing edge-to-edge between them. The only color bands that interrupt the cream are pastel `{component.banner-tip-blue}` / `-green` / `-red` / `-purple` callout panels inside doc articles — soft tinted boxes that carry "💡 Tip", "✅ Success", "⚠️ Warning", "📘 Info" inline annotations. There are no decorative gradients, no atmospheric mesh backgrounds, and no full-bleed dark hero chapters; the cream canvas runs uninterrupted top to bottom and the hedgehogs are the entire visual identity.

**Key Characteristics:**
- Warm cream canvas (`{colors.canvas}` — #eeefe9) end-to-end with no surface alternation between sections — the page is one continuous sheet
- Single yellow-orange CTA pill (`{colors.primary}` — #f7a501) with deep olive text (`{colors.on-primary}`) — the brand''s only saturated color
- IBM Plex Sans Variable across every text role with weights 400/500/600/700/800 — no other typeface in the system
- Hand-drawn hedgehog mascots scattered across the layout as the entire decorative system — no gradients, no mesh, no atmospheric backgrounds
- 4–8px radius card vocabulary: `{rounded.md}` (6px) for most components, `{rounded.lg}` (8px) for select containers, fully rounded for pill chips
- Pastel callout banners (`{colors.accent-blue-soft}`, `{colors.accent-green-soft}`, `{colors.accent-red-soft}`, `{colors.accent-purple-soft}`) break up doc article body with soft tinted side rails for tips/warnings/info
- Documentation pages add a sticky 240px `{component.doc-sidebar}` with rounded outline-icon section nav and an "Ask PostHog AI" CTA at the top', '{"sourcePath":"docs/design-md/posthog/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> **Source pages:** `/` (home), `/pricing` (pricing detail), `/docs/product-analytics` (docs article), `/workflows` (product feature page). The chrome palette is identical across all four pages — only doc-specific accents (callout-banner pastels, code-block dark surface) appear exclusively inside the docs experience.

### Brand & Accent
- **PostHog Yellow** (`{colors.primary}` — `#f7a501`): the universal primary CTA. Sticky "Get started — free" pill in the top-right of every nav, hero CTAs, pricing-tier subscribe buttons, footer signup pill. The system''s only saturated chromatic moment.
- **Yellow Pressed** (`{colors.primary-pressed}` — `#dd9001`): pressed state for the primary pill.
- **Yellow Active** (`{colors.primary-active}` — `#b17816`): deeply-pressed yellow + the system''s gold-toned border accent (rare 1px gold rule on inline form elements).

### Surface
- **Canvas** (`{colors.canvas}` — `#eeefe9`): the warm cream page background. End-to-end on every page; the brand''s most distinctive surface choice.
- **Soft Surface** (`{colors.surface-soft}` — `#e5e7e0`): button-secondary fill, sub-nav strip background, inline-code chip background.
- **Surface Card** (`{colors.surface-card}` — `#ffffff`): true white card and tile background sitting on top of the cream canvas. The dominant card surface.
- **Surface Doc** (`{colors.surface-doc}` — `#fcfcfa`): a faintly cream-warm white used inside doc article body cards — slightly softer than pure white to keep the page tonally unified.
- **Surface Dark** (`{colors.surface-dark}` — `#23251d`): the deep olive-charcoal used inverted as code-block background. The same hex as `{colors.ink}` — the brand uses one olive-near-black for both text and dark code surfaces.
- **Hairline** (`{colors.hairline}` — `#bfc1b7`): 1px card border, table rule, footer column dividers.
- **Hairline Soft** (`{colors.hairline-soft}` — `#dcdfd2`): in-card row divider, soft inset rule.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.surface-dark}` code blocks.

### Text
- **Ink** (`{colors.ink}` — `#23251d`): headlines, button text on light, primary nav links — deep olive-charcoal that reads near-black against cream.
- **Body** (`{colors.body}` — `#4d4f46`): default paragraph text, doc article body, inline link color before hover. The brand''s most-used text color.
- **Charcoal** (`{colors.charcoal}` — `#33342d`): emphasized body text where body is too soft.
- **Mute** (`{colors.mute}` — `#6c6e63`): metadata, footer link text, in-list secondary annotations.
- **Ash** (`{colors.ash}` — `#9b9c92`): disabled-state text and lowest-emphasis utility.
- **Stone** (`{colors.stone}` — `#b6b7af`): least-emphasis caption text and disabled icon color.

### Semantic
- **Link Blue** (`{colors.link-blue}` — `#1d4ed8`): inline anchor link inside body prose. The system''s primary informational link color.
- **Link Teal** (`{colors.link-teal}` — `#1078a3`): doc-article inline link variant, paired with body text.
- **Accent Blue** (`{colors.accent-blue}` — `#2c84e0`) + **Accent Blue Soft** (`{colors.accent-blue-soft}` — `#dceaf6`): "💡 Tip / Info" callout banner inside docs.
- **Accent Red** (`{colors.accent-red}` — `#cd4239`) + **Accent Red Soft** (`{colors.accent-red-soft}` — `#f7d6d3`): "⚠️ Warning / Caution" callout banner.
- **Accent Green** (`{colors.accent-green}` — `#2c8c66`) + **Accent Green Soft** (`{colors.accent-green-soft}` — `#d9eddf`): "✅ Success / Positive" callout banner.
- **Accent Purple** (`{colors.accent-purple}` — `#7c44a6`) + **Accent Purple Soft** (`{colors.accent-purple-soft}` — `#e7d8ee`): "📘 Note / Reference" callout banner.
- **Focus Ring** (`{colors.focus-ring}` — `rgba(59,130,246,0.5)`): translucent blue browser-default focus ring around interactive elements.', '{"sourcePath":"docs/design-md/posthog/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**IBM Plex Sans Variable** is the system''s primary face — used across every text role on every page at weights 400 (regular), 500 (medium), 600 (semibold), 700 (bold), and 800 (extra-bold). Falls back through `IBM Plex Sans` → `-apple-system` → `system-ui` → broad cross-platform sans stack.

**ui-monospace** + **Source Code Pro** carry code samples and inline-code chips at 14px / 1.43 line-height. Source Code Pro is the explicit display monospace; ui-monospace handles inline `<code>` chips.

The brand-distinctive choice is the **mixed weight ladder** (400 / 500 / 600 / 700 / 800) — most chrome lives in the 400–700 band, with weight 800 reserved exclusively for the larger display headlines on home and pricing. This gives the system its "engineering blog" feel: hierarchy is built from weight contrast much more than from size.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 36px | 700 | 1.5 | 0 | Hero headline ("The new way to build products") |
| `{typography.display-lg}` | 24px | 800 | 1.33 | -0.6px | Section headline, pricing tier name |
| `{typography.heading-lg}` | 21px | 700 | 1.4 | -0.5px | Sub-section heading, doc-article H2 |
| `{typography.heading-md}` | 20px | 700 | 1.4 | 0 | Card group title, in-grid heading |
| `{typography.heading-sm}` | 18px | 700 | 1.5 | 0 (uppercase) | Section eyebrow ("UNDERSTAND PRODUCT USAGE") |
| `{typography.heading-sm-mixed}` | 18px | 600 | 1.56 | 0 | Card title in mixed-case (no uppercase transform) |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Body copy, default paragraph |
| `{typography.body-strong}` | 16px | 600 | 1.5 | 0 | Inline emphasis, primary nav link, in-card label |
| `{typography.body-sm}` | 15px | 400 | 1.71 | 0 | Doc article body, marketing card description |
| `{typography.body-sm-strong}` | 15px | 600 | 1.71 | 0 | Sub-section emphasis inside doc article |
| `{typography.body-xs}` | 14px | 500 | 1.43 | 0 | Doc sidebar item, metadata, in-list caption |
| `{typography.caption-md}` | 14px | 700 | 1.71 | 0 | Card eyebrow, link cluster header |
| `{typography.caption-sm}` | 13px | 500 | 1.5 | 0 | Compact metadata caption |
| `{typography.caption-xs}` | 12px | 600 | 1.33 | 0 (uppercase) | Inline badge label |
| `{typography.utility-xs}` | 12px | 700 | 1.33 | 0 (uppercase) | Section-eyebrow utility text, footer category header |
| `{typography.link-md}` | 16px | 400 | 1.5 | 0 | Inline body anchor link |
| `{typography.button-md}` | 14px | 700 | 1.5 | 0 | Standard primary/secondary button label |
| `{typography.button-sm}` | 13px | 500 | 1 | 0 | Pill chip / compact CTA |
| `{typography.code-sm}` | 14px | 400 | 1.43 | 0 | Code block content |
| `{typography.code-xs}` | 14px | 500 | 1.43 | 0 | Inline code chip |

### Principles
The hierarchy is explicitly built from weight + size + occasional uppercase transform — there is no italic style, no decorative display variant, no proprietary face. The biggest display moments use weight 800 with -0.6px tracking, and the body settles at 400 with 1.5 line-height; everything else fills the band between. Section eyebrows (`{typography.heading-sm}` and `{typography.utility-xs}`) consistently render uppercase, which gives the doc layout its textbook-chapter feel.

### Note on Font Substitutes
IBM Plex Sans Variable is open-source and Google-Fonts-hosted. There is no need for a substitute — load it directly. If a substitute is genuinely needed, **Inter** is the closest geometric match at all five weights; pair with Inter''s letter-spacing -0.5 to -0.6px on display sizes to approximate Plex''s display tracking. For monospace, **JetBrains Mono** is a near-perfect substitute for Source Code Pro at body sizes.', '{"sourcePath":"docs/design-md/posthog/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 8px (with finer 2/4/6px steps for tight inline gaps in callout banners and pill buttons).
- **Tokens (front matter):** `{spacing.xxs}` (2px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (80px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (80px) as the vertical gap between major content blocks. Card grids use `{spacing.lg}` (16px) gutters; card internal padding sits at `{spacing.xl}` (24px) for product cards and `{spacing.xxl}` (32px) for pricing tier cards.

### Grid & Container
- **Max width:** ~1280px content area at desktop with 24px gutters (~48px at ultrawide). Doc article body sits at ~720px max width with the 240px sidebar pushing the article column right of center.
- **Marketing card grid:** 4-up at desktop, 3-up at 1024px, 2-up at 768px, 1-up at 480px. Cards preserve a fixed 1:1 or 4:3 ratio.
- **Pricing tier grid:** 3-up at desktop with a left rail of plan info, collapsing to 2-up + 1 at tablet and 1-up at mobile.
- **Doc layout:** desktop 240px sticky left sidebar + ~720px article body + (optional) 200px right TOC rail = ~1160px content width.
- **Footer:** 6-column horizontal link grid at desktop, 3-up at tablet, 2-up at mobile.

### Whitespace Philosophy
Whitespace is generous on marketing pages and tight on doc pages. The home and workflows pages stack feature tiles with `{spacing.lg}` (16px) gutters and 24px internal padding, while doc articles tighten internal spacing to `{spacing.md}` (12px) between paragraphs to maximize information density. The cream canvas runs continuously through every section — there are no decorative dividers, no shaded section bands; only the 1px hairline beneath section eyebrows and footer column rules separate content blocks.', '{"sourcePath":"docs/design-md/posthog/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for canvas-on-canvas blocks, hero text, body sections |
| 1 — Hairline border | 1px solid `{colors.hairline}` | Marketing cards, pricing tier cards, doc sidebar items, footer column rules |
| 2 — Hairline soft | 1px solid `{colors.hairline-soft}` | In-card row divider between adjacent rows |
| 3 — Inverted dark code block | `{colors.surface-dark}` fill | Code samples inside doc cards — the system''s only "elevated" surface uses color, not shadow |

The system has no drop-shadow elevation in marketing or product chrome. Cards sit flat on cream with thin olive borders. The single inverted moment is the dark code-block surface used inside doc article body cards.

### Decorative Depth
Depth comes entirely from illustration and the pastel callout band system, not from CSS effects:
- **Hand-drawn hedgehog mascots** — characters in various costumes (lab coat, terminal, lounge chair, magnifying glass, hammock, hat) scattered across pages as marginalia. Always rendered as flat color illustrations, never photographs.
- **Pastel callout banners** — `{component.banner-tip-blue}` / `-green` / `-red` / `-purple` soft tinted side-rail panels inside doc articles, each prefixed with an emoji icon (💡 ✅ ⚠️ 📘) and carrying tip/warning/note copy.
- **Code blocks** — full-width dark olive-charcoal panels on `{colors.surface-dark}` with white code text. The system''s most cinematic surface, used inside white doc cards.
- **Outline product icons** in the doc sidebar — small rounded-square mini-illustrations (chart icon, funnel, session-replay icon) mark each major product section.', '{"sourcePath":"docs/design-md/posthog/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Sub-nav strip, footer, doc sidebar, primary nav — flat structural surfaces |
| `{rounded.xs}` | 2px | Inline `<code>` chips, micro-rule highlights |
| `{rounded.sm}` | 4px | Inline buttons, form inputs, micro chips |
| `{rounded.md}` | 6px | Marketing cards, pricing cards, doc cards, code blocks, every standard CTA |
| `{rounded.lg}` | 8px | Tab top corners (`6px 6px 0 0` on active tab) and rare large containers |
| `{rounded.full}` | 9999px | Pill chips and pill-style CTAs ("Get started — free" sticky CTA in nav) |

The radius vocabulary clusters around 4–6px for nearly everything; the only fully-rounded element is the pill-style sticky nav CTA and inline pill chips.

### Photography Geometry
There is no photography. Visual elements are limited to:
- **Hedgehog character illustrations** — flat-color cartoon hedgehogs ranging from ~80px (in-card mascot) to ~240px (hero illustration). Always at native aspect, never cropped to a frame.
- **Outline product icons** in the doc sidebar — 20–24px rounded-square illustrations.
- **Inline emoji** at 14–16px inside callout banners (💡 ✅ ⚠️ 📘) — used as functional iconography rather than decoration.
- **Section illustrations** on the home page — small hedgehog vignettes paired with each "Understand product usage" / "Build sticky habits" / "Test before launch" feature row.', '{"sourcePath":"docs/design-md/posthog/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal PostHog CTA
- Background `{colors.primary}` (yellow-orange), text `{colors.on-primary}` (deep olive), type `{typography.button-md}`, padding `8px 16px`, height `40px`, rounded `{rounded.md}`.
- Used for "Get started — free" (sticky top-nav CTA), "Sign up", "Try it free", "Subscribe" — every primary action.
- Pressed state lives in `button-primary-pressed` — background drops to `{colors.primary-pressed}`.

**`button-secondary`** — soft alternative on cream canvas
- Background `{colors.surface-soft}` (`#e5e7e0`), text `{colors.ink}`, type `{typography.button-md}`, padding `8px 16px`, height `40px`, rounded `{rounded.md}`.
- "Talk to sales", "Read docs", "Watch demo" — second-tier actions paired with the yellow primary.

**`button-tertiary`** — ghost text button
- Background transparent, text `{colors.ink}`, type `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.md}`.
- Lowest-emphasis action: "See all docs →", "Browse all features".

**`button-disabled`**
- Background `{colors.surface-soft}`, text `{colors.ash}` — flat soft cream-gray.

### Tabs & Chips

**`product-tab`** + **`product-tab-active`** — major product section tabs
- Default: transparent background, text `{colors.body}`, type `{typography.body-strong}`, padding `8px 12px`, rounded `{rounded.md}`.
- Active: background flips to `{colors.surface-card}` (white), text `{colors.ink}` — the tab card lifts off the cream canvas as the visual signal of selection.

**`pill-tab`** + **`pill-tab-active`** — compact filter pill
- Default: transparent background, text `{colors.body}`, type `{typography.button-sm}`, padding `6px 14px`, rounded `{rounded.full}`.
- Active: background flips to `{colors.ink}`, text `{colors.on-dark}` — the chip flips fully inverted on selection.

**`badge-uppercase`** — text-only utility label
- Background transparent, text `{colors.body}` in `{typography.utility-xs}` (uppercase) — used as in-list category prefix ("FEATURE FLAG", "EXPERIMENT", "HEATMAP").

**`badge-promo`** — small inline pill chip
- Background `{colors.accent-blue-soft}`, text `{colors.link-blue}`, type `{typography.caption-xs}`, padding `2px 8px`, rounded `{rounded.full}`.
- "New", "Beta", "Coming soon" pill labels overlaid on cards.

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.surface-card}`, text `{colors.ink}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `8px 12px`, height `36px`, rounded `{rounded.md}`.
- Focused: same surface; 2px solid `{colors.accent-blue}` border replaces the 1px hairline + a translucent `{colors.focus-ring}` outline.

**`search-input`** — utility search field (doc sidebar, "Ask PostHog AI")
- Same dimensions as `text-input` with a magnifier glyph at the left edge in `{colors.mute}`.

### Cards & Containers

**`product-card`** — marketing tile / feature card
- Container: background `{colors.surface-card}` (white), 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.md}`.
- Layout: small hedgehog illustration at top-left, `{typography.heading-sm-mixed}` title, `{typography.body-sm}` description, optional `{component.button-tertiary}` "Learn more →" link.

**`doc-card`** — doc article body card
- Container: background `{colors.surface-doc}` (`#fcfcfa` warm-white), 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.md}`.
- Carries article body sections, code blocks, callout banners, and tables inside doc pages.

**`feature-tile`** — small marketing feature tile
- Container: background `{colors.surface-card}`, 1px solid `{colors.hairline}`, padding `{spacing.lg}` (20px), rounded `{rounded.md}`.
- Used in 3-up or 4-up grids on home and workflows pages — paired with a small icon and a 1-line description.

**`pricing-tier-card`** — pricing plan card
- Container: background `{colors.surface-card}`, 1px solid `{colors.hairline}`, padding `{spacing.xxl}` (32px), rounded `{rounded.md}`.
- Layout: tier name in `{typography.display-lg}` (24px / 800 / -0.6px), large price + period, feature checklist with check-icon bullets, primary or secondary CTA at bottom.

**`hedgehog-mascot-card`** — feature card with margin-anchored hedgehog
- Same chrome as `{component.product-card}` but with a hand-drawn hedgehog illustration anchored in the right margin or top-right corner — the brand''s signature card variant.

### Callout Banners

**`banner-tip-blue`** + **`banner-tip-green`** + **`banner-tip-red`** + **`banner-tip-purple`**
- Background `{colors.accent-blue-soft}` / `{colors.accent-green-soft}` / `{colors.accent-red-soft}` / `{colors.accent-purple-soft}`, text `{colors.ink}`, type `{typography.body-md}`, padding `16px 20px`, rounded `{rounded.md}`.
- Each prefixed with an inline emoji icon (💡 / ✅ / ⚠️ / 📘) followed by an inline label and body copy.
- Only appear inside doc article body. The four-color callout family is the brand''s information-architecture vocabulary for inline tips/warnings/info inside long-form documentation.

### Code

**`code-block`** — dark code sample inside doc card
- Container: background `{colors.surface-dark}` (deep olive-charcoal), text `{colors.on-dark}` in `{typography.code-sm}`, padding `16px 20px`, rounded `{rounded.md}`.
- Syntax highlighting uses muted accent colors (blue for keywords, green for strings, purple for numbers) — never the bright accent colors used in callout banners.

**`inline-code`** — small inline `<code>` chip
- Background `{colors.surface-soft}`, text `{colors.ink}` in `{typography.code-xs}`, padding `2px 6px`, rounded `{rounded.xs}` (2px).
- Used inside body prose to mark code snippets and identifiers.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}` (cream — same as the page), text `{colors.ink}`, height `56px`, type `{typography.body-strong}`, rounded `{rounded.none}`.
- Layout (desktop): PostHog wordmark + hedgehog logo at left, nav menu cluster ("Pricing · Docs · Community · Company"), right cluster with a search-glyph, "Login" link, and the always-yellow `{component.button-primary}` "Get started — free" pill anchored to the far right.

**`sub-nav-strip`** — secondary nav bar (under primary)
- Background `{colors.surface-soft}`, text `{colors.body}` in `{typography.body-xs}`, height `40px`, rounded `{rounded.none}`.
- Sits directly below the primary nav on workflows / product pages with section anchor links and a contextual "Get started →" link at the right.

**`doc-sidebar`** — sticky doc-page left sidebar
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.body-xs}`, width `240px`, rounded `{rounded.none}`.
- Layout: search-input "Ask PostHog AI" at top, then a vertical list of section headers each with a small rounded outline-icon mini-illustration, then nested item links indented under the active header.

**Top Nav (Mobile)**
- Hamburger menu icon at left, PostHog wordmark + hedgehog at center, search + sticky yellow "Get started — free" CTA at right. Primary nav collapses into a full-height drawer that slides from the left.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.body-xs}`, padding `32px 24px`, rounded `{rounded.none}`, with a 1px `{colors.hairline}` top rule.
- Layout: 6-column horizontal link grid (Product · Resources · Company · Community · Pricing · Legal), each column with a `{typography.utility-xs}` (uppercase) header and a vertical list of links in `{typography.body-xs}` `{colors.body}`.
- Bottom row: PostHog wordmark + small hedgehog illustration, copyright in `{typography.caption-xs}` `{colors.mute}`, social-icon row at far-right.

### Inline

**`link-inline`** — body-prose anchor link
- `{colors.link-teal}` (`#1078a3`) in body prose with no underline by default; underline appears on focus. The brand''s primary inline link color.', '{"sourcePath":"docs/design-md/posthog/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Use `{colors.canvas}` (cream — `#eeefe9`) as the page body. Never substitute pure white as the canvas.
- Reserve `{colors.primary}` (yellow-orange) for the primary CTA pill only. The "Get started — free" treatment is the brand''s anchor.
- Render the brand wordmark with the hedgehog illustration alongside it, not as a stand-alone wordmark. The hedgehog IS the brand identity.
- Use IBM Plex Sans Variable across every text role — body 400, emphasis 600/700, display 800.
- Stack content sections at `{spacing.section}` (80px) rhythm with no decorative dividers between them; let the cream canvas continue uninterrupted.
- Use `{component.banner-tip-blue}` / `-green` / `-red` / `-purple` only inside doc article body for tip/warning/note panels — keep marketing chrome out of the four-color callout family.
- Pair every code sample with the dark `{component.code-block}` surface; inline `<code>` chips use `{component.inline-code}` (cream surface-soft chip).
- Anchor a hedgehog mascot illustration in feature tile margins on home and workflows pages — the system''s signature decoration.

### Don''t
- Don''t introduce drop shadows on cards. Cards sit flat on cream with thin olive borders only.
- Don''t add a second saturated chromatic CTA. Yellow-orange is the only loud color in the system.
- Don''t replace the cream canvas with pure white or full-bleed dark hero bands. The cream is the brand.
- Don''t use the four-color callout banner pastels (`{colors.accent-blue-soft}`, `-green`, `-red`, `-purple`) as marketing-card backgrounds. They belong to inline doc content only.
- Don''t substitute the hedgehog illustration with a generic icon set. The character system is the brand.
- Don''t use uppercase transform outside of `{typography.heading-sm}`, `{typography.utility-xs}`, and `{typography.caption-xs}`. Uppercase is reserved for eyebrows and footer category headers.
- Don''t pad cards with 32px+ on all sides except for `{component.pricing-tier-card}`. Standard cards sit at 24px internal padding.', '{"sourcePath":"docs/design-md/posthog/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Content max-width holds at 1280px; outer gutters grow to ~80px |
| desktop-large | 1440px | Default — 4-up feature tile grid, 240px sticky doc sidebar visible |
| desktop | 1280px | Same layout with narrower outer gutters |
| desktop-small | 1024px | 4-up tiles collapse to 3-up; doc sidebar remains visible |
| tablet | 768px | 3-up tiles collapse to 2-up; doc sidebar collapses into a top accordion; primary nav becomes hamburger |
| mobile | 480px | Single-column everything; hero `{typography.display-xl}` scales 36px → ~28px |
| mobile-narrow | 320px | Section padding tightens to 32px |

### Touch Targets
All interactive elements meet WCAG AA (≥ 40×40px). `{component.button-primary}` and `{component.button-secondary}` sit at 40px height with 16px padding. `{component.text-input}` sits at 36px (just under AAA but above AA at this size). `{component.pill-tab}` is ~32–36px height with 14px padding extending to ~44px tappable via inline padding. Doc-sidebar items use 14px text with ~32px line-height + 6px vertical padding for ~44px tap rows.

### Collapsing Strategy
- **Primary nav:** desktop horizontal cluster → tablet hamburger drawer at 768px. The yellow "Get started — free" CTA stays visible at every breakpoint.
- **Sub-nav strip:** desktop horizontal anchor row → tablet horizontal scroll → mobile select dropdown.
- **Marketing card grid:** 4-up → 3-up → 2-up → 1-up at 1024, 768, and 480px; gutters drop from 16px to 12px on mobile.
- **Pricing grid:** 3-up → 2+1 → 1-up stacked at tablet and below.
- **Doc layout:** desktop 240px sidebar + 720px article → tablet sidebar collapses to a top accordion → mobile fully collapsed accordion.
- **Footer:** 6-up link columns → 3-up at tablet → 2-up at mobile.
- **Section padding:** `{spacing.section}` (80px) desktop → 64px tablet → 48px mobile.
- **Hero headline:** `{typography.display-xl}` (36px) at desktop, scaling to ~28px at mobile, line-height holding at 1.5.

### Image Behavior
The only "imagery" in the system is hand-drawn hedgehog illustrations rendered as inline SVG. They preserve their natural aspect at every breakpoint and scale via CSS `width: auto; max-width: 100%`. There is no responsive art-direction needed because there is no photography.', '{"sourcePath":"docs/design-md/posthog/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.md}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-pressed`, `-disabled`, `-focused`) — do not bury them inside prose.
5. Default body to `{typography.body-md}` (16px / 400 / 1.5); reach for `{typography.body-strong}` for emphasis; reserve `{typography.display-lg}` (24px / 800) strictly for marketing display moments.
6. Keep `{colors.primary}` scarce per viewport — at most one yellow-orange pill per fold.
7. When introducing a new component, ask whether it can be expressed with the existing card + 6px-radius + cream-canvas vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.', '{"sourcePath":"docs/design-md/posthog/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes PostHog''s mobile pattern (hamburger drawer, single-column grid, doc sidebar accordion) from desktop evidence and the breakpoint stack.
- **Hover states not documented** by system policy.
- **In-product app chrome** (PostHog dashboard, charts, session replay player) not in the captured set — the marketing site is documented here, not the in-product analytics interface.
- **Authenticated chrome** (login modal, account dashboard, billing settings) not in the captured pages.
- **Form validation states** beyond the focused-state input not present in the captured surfaces.
- **Marketing illustration set** — the full library of hedgehog character poses is not enumerated here; specific poses (lab coat hedgehog, terminal hedgehog, hammock hedgehog) are noted as visible in screenshots but the full asset library is page-specific.', '{"sourcePath":"docs/design-md/posthog/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_1', '#4d4f46', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_2', '#23251d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_3', '#f7a501', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_4', '#dd9001', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_5', '#b17816', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_6', '#33342d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_7', '#6c6e63', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_8', '#9b9c92', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_9', '#b6b7af', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_10', '#bfc1b7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_11', '#dcdfd2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_12', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_13', '#eeefe9', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_14', '#e5e7e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_15', '#fcfcfa', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_16', '#1d4ed8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_17', '#1078a3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_18', '#2c84e0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_19', '#dceaf6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_20', '#cd4239', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_21', '#f7d6d3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_22', '#2c8c66', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_23', '#d9eddf', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_24', '#7c44a6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md'), 'color', 'color_25', '#e7d8ee', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/posthog/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/posthog/DESIGN.md';


-- Raycast
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Raycast', 'raycast', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/raycast/DESIGN.md', null, 'seeded', '---
version: alpha
name: Raycast-design-analysis
属于: A dark-canvas developer-tools system that treats the marketing page like an extended product screenshot — pure-near-black background, command-palette mockups as the hero, Inter typography with the ss03 stylistic set turned on, and a single white CTA pill that doesn''t break the inky atmosphere. The chrome reads like Raycast''s own command-palette UI scaled up to a marketing page: monochrome dark surfaces with a faint surface ladder (#07080a → #0d0d0d → #101111), tight 6–10px radius on cards, hairline 1px borders in #242728, and rare splashes of saturated accent (Hacker News yellow, Slack red, Mac green, info blue) reserved for product-tile category illustrations. The signature visual moment is a red gradient hero wordmark — three diagonal red stripes laid across the very top of the home page like a launch-banner — paired with full-bleed product UI screenshots that show Raycast''s actual command palette, store, and AI chat surfaces.
description: |
  Raycast''s marketing system reads like an extended product screenshot. The chrome IS the in-product chrome at marketing scale: pure-near-black canvas, hairline 1px borders, command-palette-style cards, Inter typography with the ss03 stylistic set enabled site-wide, white CTA pill, and a small set of saturated category accent colors (yellow / red / green / blue) reserved for extension and feature illustrations. Section rhythm is generous (~96px) but the page never breaks tonal continuity — the whole site sits in one continuous dark mode.

colors:
  primary: "#ffffff"
  primary-pressed: "#e8e8e8"
  on-primary: "#000000"
  ink: "#f4f4f6"
  body: "#cdcdcd"
  charcoal: "#d3d3d4"
  mute: "#9c9c9d"
  ash: "#6a6b6c"
  stone: "#434345"
  on-dark: "#ffffff"
  on-dark-mute: "rgba(255,255,255,0.72)"
  canvas: "#07080a"
  surface: "#0d0d0d"
  surface-elevated: "#101111"
  surface-card: "#121212"
  button-fg: "#18191a"
  hairline: "#242728"
  hairline-soft: "rgba(255,255,255,0.08)"
  hairline-strong: "rgba(255,255,255,0.16)"
  accent-blue: "#57c1ff"
  accent-blue-soft: "rgba(87,193,255,0.15)"
  accent-red: "#ff6161"
  accent-red-soft: "rgba(255,97,97,0.15)"
  accent-green: "#59d499"
  accent-green-soft: "rgba(89,212,153,0.15)"
  accent-yellow: "#ffc533"
  accent-yellow-soft: "rgba(255,197,51,0.15)"
  hero-stripe-start: "#ff5757"
  hero-stripe-end: "#a1131a"
  key-bg-start: "#121212"
  key-bg-end: "#0d0d0d"

typography:
  display-xl:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  display-lg:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.17
    letterSpacing: 0.2px
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  heading-xl:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.2px
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  heading-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: 0
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  heading-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2px
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  heading-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2px
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  body-strong:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2px
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  body-sm-strong:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.2px
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  caption-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.1px
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  caption-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.4px
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  link-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.3px
    fontFeature: ''"calt", "kern", "liga", "ss03"''
  button-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.2px
    fontFeature: ''"calt", "kern", "liga", "ss03"''

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
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
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    height: 36px
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    height: 36px
  button-tertiary:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    height: 36px
  button-disabled:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ash}"
    rounded: "{rounded.md}"
  install-button:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 6px 14px
  text-input:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 8px 12px
    height: 36px
  text-input-focused:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.md}"
  store-search-bar:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    height: 44px
  command-palette-row:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 6px 10px
  command-palette-row-active:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
  pill-tab:
    backgroundColor: "transparent"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  pill-tab-active:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
  badge-pro:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-dark-mute}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.xs}"
    padding: 2px 6px
  badge-info-soft:
    backgroundColor: "{colors.accent-blue-soft}"
    textColor: "{colors.accent-blue}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.xs}"
    padding: 2px 8px
  keycap:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.xs}"
    padding: 1px 6px
    height: 20px
  command-palette-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 0px
  feature-card-dark:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  feature-card-elevated:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  store-extension-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
  pricing-tier-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-tier-card-featured:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  hero-stripe-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xl}"
    rounded: "{rounded.none}"
    padding: 96px 48px
  app-icon-tile:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.md}"
    size: 48px
  app-icon-tile-large:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.md}"
    size: 64px
  primary-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.none}"
    height: 56px
  footer-section:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 64px 48px
  link-inline:
    textColor: "{colors.on-dark}"
    typography: "{typography.link-md}"
---

## Overview

Raycast''s marketing site reads like an extended product screenshot. The chrome IS the in-product command palette at marketing scale: pure near-black canvas (`{colors.canvas}` — `#07080a`), hairline 1px borders (`{colors.hairline}` — `#242728`), command-palette-style cards with rounded corners between 6 and 16px, Inter typography with the **ss03 stylistic set enabled site-wide** (a single character — the alternate `g` — that gives Raycast''s typography its signature subtle distinction), a single white CTA pill that anchors every primary action, and small splashes of saturated accent reserved for category illustrations.

The system has effectively one surface mode — dark — with a faint three-step surface ladder (`{colors.canvas}` → `{colors.surface}` → `{colors.surface-elevated}` → `{colors.surface-card}`) carrying cards, in-card panels, and key-cap glyph backgrounds. The signature decorative moment is a **red diagonal-stripe gradient band** across the very top of the home page hero, used as a launch-banner motif behind the headline (the only time saturated red appears on chrome). Beyond that single moment, color in the chrome is reserved for category accents inside extension and feature illustrations: Hacker News yellow, Slack red, Linear green, info blue.

The design philosophy is "the marketing page is the product." Section rhythm is generous (`{spacing.section}` 96px) but the page never breaks tonal continuity — the whole site sits in one continuous dark mode, full-bleed product UI screenshots show Raycast''s actual command palette / store / AI chat surfaces, and the typography ligature settings (`ss03`) are inherited from the in-product app''s text rendering.

**Key Characteristics:**
- Single dark surface mode with a 4-step surface ladder: `{colors.canvas}` (#07080a) → `{colors.surface}` (#0d0d0d) → `{colors.surface-elevated}` (#101111) → `{colors.surface-card}` (#121212)
- White CTA pill (`{colors.primary}` — #ffffff) is the universal primary action; everything else is monochrome dark
- Inter typography with `font-feature-settings: "calt", "kern", "liga", "ss03"` enabled site-wide — the ss03 alternate `g` is part of the brand voice
- Hairline 1px borders (`{colors.hairline}` — #242728) carry every card edge; there are no drop shadows in the system
- Multi-radius card vocabulary: `{rounded.sm}` (6px) for keycaps, `{rounded.md}` (8px) for buttons and small cards, `{rounded.lg}` (10px) for feature cards, `{rounded.xl}` (16px) for hero command-palette mockup containers
- Saturated category accents (`{colors.accent-yellow}` for Hacker News, `{colors.accent-red}` for Slack/Apple, `{colors.accent-green}` for productivity tools, `{colors.accent-blue}` for info) appear only inside extension tile imagery — never on chrome
- Signature red diagonal-stripe gradient band at the very top of the hero — three angled stripes in `{colors.hero-stripe-start}` → `{colors.hero-stripe-end}`, used once per page maximum

## Colors

> **Source pages:** `/` (home), `/store` (extension marketplace), `/core-features/ai` (feature page), `/pricing` (plan tiers), `/thomas/hacker-news` (single extension detail). The chrome palette is identical across all five pages — the dark surface ladder, hairline borders, white CTA, and ss03-enabled typography are the same on every page.

### Brand & Accent
- **White** (`{colors.primary}` — `#ffffff`): the universal primary CTA pill background. "Download" / "Install Extension" / "Get Pro" — every primary action carries it.
- **White Pressed** (`{colors.primary-pressed}` — `#e8e8e8`): pressed-state for the primary pill — a single notch dimmer.
- **On Primary** (`{colors.on-primary}` — `#000000`): pure black text on the white CTA — the only place black appears as text in the system.

### Surface
- **Canvas** (`{colors.canvas}` — `#07080a`): pure-near-black page background. The dominant surface across every page.
- **Surface** (`{colors.surface}` — `#0d0d0d`): card and elevated panel background — one notch lighter than canvas.
- **Surface Elevated** (`{colors.surface-elevated}` — `#101111`): button-tertiary fill, text-input fill, store-search-bar fill, pill-tab-active fill.
- **Surface Card** (`{colors.surface-card}` — `#121212`): app-icon-tile background, keycap fill, command-palette row hover.
- **Button FG (in-card)** (`{colors.button-fg}` — `#18191a`): rare deep-card variant used inside featured pricing tier card backgrounds.
- **Hairline** (`{colors.hairline}` — `#242728`): the universal 1px card border. Carries every card edge across every page.
- **Hairline Soft** (`{colors.hairline-soft}` — `rgba(255,255,255,0.08)`): even fainter border on translucent over-image overlays.
- **Hairline Strong** (`{colors.hairline-strong}` — `rgba(255,255,255,0.16)`): stronger 1px divider where a regular hairline reads as too soft.

### Text
- **Ink** (`{colors.ink}` — `#f4f4f6`): primary headlines on dark canvas. Slightly off-white for tonal coherence with the near-black background.
- **Body** (`{colors.body}` — `#cdcdcd`): default paragraph text and inline-link color.
- **Charcoal** (`{colors.charcoal}` — `#d3d3d4`): subtly brighter body where ink reads too soft.
- **Mute** (`{colors.mute}` — `#9c9c9d`): metadata, footer link text, secondary captions.
- **Ash** (`{colors.ash}` — `#6a6b6c`): disabled-state text, lowest-emphasis utility.
- **Stone** (`{colors.stone}` — `#434345`): least-emphasis caption text and disabled icon color.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): interactive-state primary text (button label, focused tab).
- **On Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.72)`): translucent secondary text on dark surfaces.

### Semantic
- **Accent Blue** (`{colors.accent-blue}` — `#57c1ff`) + **Soft** (`{colors.accent-blue-soft}` — `rgba(87,193,255,0.15)`): info and informational badge — used inside feature illustrations and the rare "New" pill.
- **Accent Red** (`{colors.accent-red}` — `#ff6161`) + **Soft** (`{colors.accent-red-soft}` — `rgba(255,97,97,0.15)`): destructive/error indicator + Slack/Apple category accent in extension illustrations.
- **Accent Green** (`{colors.accent-green}` — `#59d499`) + **Soft** (`{colors.accent-green-soft}` — `rgba(89,212,153,0.15)`): success state + productivity category accent in extension illustrations.
- **Accent Yellow** (`{colors.accent-yellow}` — `#ffc533`) + **Soft** (`{colors.accent-yellow-soft}` — `rgba(255,197,51,0.15)`): "warning" semantic + the Hacker News orange-yellow that appears as the most prominent accent illustration on the home page hero.

### Brand Gradient
- **Hero Stripe Gradient** — three diagonal red stripes layered across the very top of the home page hero, fading from `{colors.hero-stripe-start}` (`#ff5757`) to `{colors.hero-stripe-end}` (`#a1131a`). The system''s only chromatic gradient on chrome — used once per page maximum and reserved for hero launch-banner moments.
- **Keycap Gradient** — the small key-glyph background uses a subtle linear-gradient from `{colors.key-bg-start}` (`#121212`) to `{colors.key-bg-end}` (`#0d0d0d`) that gives Raycast''s keycap UI its slight 3D-key feel.

## Typography

### Font Family
**Inter** is the system''s primary face, loaded with the `Inter Fallback` system fallback variant. Critically, Raycast enables `font-feature-settings: "calt", "kern", "liga", "ss03"` site-wide — the **ss03 stylistic set** swaps in Inter''s alternate `g` glyph (single-story open `g`), which is the brand''s signature typographic detail. Standard ligatures (`liga`), kerning (`kern`), and contextual alternates (`calt`) are also active. The display tier additionally enables `ss02` and `ss08` and disables standard `liga` to render the hero "Raycast Pro" wordmark with its distinctive geometric construction.

There is no monospace face used outside of inline `<code>` chips in documentation; the marketing pages use Inter for everything.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 600 | 1.1 | 0 | Hero "Built for the perfect tools" / "The new way to..." headline (with `liga: 0`, `ss02`, `ss08`) |
| `{typography.display-lg}` | 56px | 500 | 1.17 | 0.2px | Section headline ("Explore", "Pricing", store hero "Store") |
| `{typography.heading-xl}` | 24px | 500 | 1.6 | 0.2px | Sub-section heading, pricing-tier name |
| `{typography.heading-lg}` | 22px | 500 | 1.15 | 0 | Mid-section feature heading |
| `{typography.heading-md}` | 20px | 500 | 1.4 | 0.2px | Card group title, in-card heading |
| `{typography.heading-sm}` | 18px | 500 | 1.4 | 0.2px | Small heading, extension card title |
| `{typography.body-lg}` | 18px | 400 | 1.6 | 0 | Pricing tier description, hero subtitle |
| `{typography.body-md}` | 16px | 400 | 1.6 | 0 | Default body, paragraph text |
| `{typography.body-strong}` | 16px | 500 | 1.4 | 0.2px | Inline emphasis, primary nav link |
| `{typography.body-sm}` | 14px | 400 | 1.6 | 0 | Card description, secondary copy |
| `{typography.body-sm-strong}` | 14px | 500 | 1.6 | 0.2px | In-card label, table-header text |
| `{typography.caption-md}` | 13px | 400 | 1.4 | 0.1px | Caption, metadata |
| `{typography.caption-sm}` | 12px | 400 | 1.5 | 0.4px | Smallest utility text, badge label |
| `{typography.link-md}` | 16px | 500 | 1.4 | 0.3px | Inline body anchor link |
| `{typography.button-md}` | 14px | 500 | 1.6 | 0.2px | Standard button label |

### Principles
The hierarchy works on a 1.6-line-height ladder for body and a 1.1–1.4 ladder for display/heading. Letter-spacing is consistently positive (0.1–0.4px) — slightly opening the type — which gives Raycast''s chrome an airy quality at body sizes despite the dark canvas. The `ss03` stylistic set is the brand''s most distinctive typographic detail; without it, the body face renders identically to plain Inter and loses Raycast''s signature rendering.

### Note on Font Substitutes
Inter is open-source and Google-Fonts-hosted; load it directly. To preserve the brand''s signature look, you must enable `font-feature-settings: "calt", "kern", "liga", "ss03"` on the body element. Without `ss03`, the typography is recognizably "Inter default" rather than "Raycast." On systems where Inter cannot be loaded, the documented fallback is `Inter Fallback` (a self-hosted variant) → `system-ui`. **JetBrains Mono** or **Geist Mono** are acceptable substitutes for inline code chips when needed, though Raycast''s marketing chrome rarely uses code-styled text.

## Layout

### Spacing System
- **Base unit:** 8px (with 2/4/12px steps for tight inline gaps).
- **Tokens (front matter):** `{spacing.xxs}` (2px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (96px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (96px) as the vertical gap between major content blocks. Card grids use `{spacing.lg}` (16px) gutters; in-card padding sits at `{spacing.xl}` (24px) for feature cards and `{spacing.lg}` (16px) for store extension cards.

### Grid & Container
- **Max width:** ~1240px content area at desktop with 24px gutters (~48px at ultrawide). Hero command-palette mockups run wider (~1080px) with the page background extending to full bleed.
- **Store extension grid:** 2-up at desktop with rows of 2 cards stacked, collapsing to 1-up at mobile. Each card is a horizontal layout with a large square app icon at the left and copy + Install button at the right.
- **Pricing tier grid:** 3-up at desktop (Free / Pro / Pro+Advanced AI), collapsing to 1-up stacked at mobile.
- **Featured extension card grid:** 3-up at desktop in the "Featured" row at the top of the store page.
- **Comparison table:** full-width on the pricing page below the tier cards — 5-column table (Free / Pro / Advanced AI / Custom for Teams / Enterprise) with feature rows.
- **Footer:** 6-column horizontal link grid at desktop, collapsing to 2-up at tablet and 1-up at mobile.

### Whitespace Philosophy
Whitespace is generous and the canvas is uninterrupted. Sections sit 96px apart with no decorative dividers between them — the dark canvas continues edge-to-edge from hero to footer. Inside a section, content is left-aligned in a tight column, with command-palette mockup imagery occupying the right 50–60% of the band on home-page feature rows. The signature decorative element — the red diagonal-stripe gradient band — only appears in the very first hero band; from the second section down, the page is monochrome dark.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for canvas-on-canvas blocks, hero text, footer body |
| 1 — Hairline border | 1px solid `{colors.hairline}` (#242728) | Every card on `{colors.surface}`, store extension card, pricing tier card |
| 2 — Hairline strong | 1px solid `{colors.hairline-strong}` | Stronger inline divider, table-row separator on the comparison table |
| 3 — Surface ladder elevation | `{colors.canvas}` → `{colors.surface}` → `{colors.surface-elevated}` → `{colors.surface-card}` | Multi-step background-color ladder used to create elevation without shadows |

The system has no drop-shadow elevation at all. Depth is built entirely from the surface-color ladder: each notch lighter on the dark scale reads as one step closer to the viewer.

### Decorative Depth
Depth comes from product imagery and a single stripe-gradient band:
- **Hero stripe gradient** — three diagonal red stripes (`{colors.hero-stripe-start}` → `{colors.hero-stripe-end}`) layered across the home-page hero band, evoking a launch-banner / motion-blur effect. The system''s signature decorative moment.
- **Command-palette mockups** — full-fidelity Raycast in-product UI screenshots (the actual Spotlight-style overlay with rounded keycaps, command rows, and accent-color glyphs) sitting inside the home-page hero and feature rows. These ARE the brand decoration.
- **App icon tiles** — small 48–64px rounded-corner tiles displaying real app icons (Slack, Spotify, Figma, Notion, Linear, Hacker News) inside store and feature illustrations.
- **Keycap glyphs** — subtle gradient-filled rounded keycap glyphs used inline to indicate keyboard shortcuts (e.g., `⌘ K`), with a faint `{colors.key-bg-start}` → `{colors.key-bg-end}` linear gradient suggesting a physical key surface.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero band, primary nav, footer, full-bleed structural surfaces |
| `{rounded.xs}` | 4px | Keycap glyphs, badge-pro chips, small inline tags |
| `{rounded.sm}` | 6px | Command-palette row, inline buttons, micro chips |
| `{rounded.md}` | 8px | Standard buttons, text inputs, store search bar, app-icon tiles, store extension card |
| `{rounded.lg}` | 10px | Feature card, command-palette mockup card, pricing tier card |
| `{rounded.xl}` | 16px | Large hero command-palette mockup container, oversized feature panel |
| `{rounded.full}` | 9999px | Pill-tab chips, avatar circles |

The radius vocabulary clusters tightly between 4 and 16px, with most chrome at 6–10px. The system never goes flat (0px) on cards and never above 16px except for fully-rounded pills.

### Photography Geometry
There is no traditional photography. Visual elements are limited to:
- **Command-palette mockups** — full-fidelity Raycast UI screenshots at 16:9 or 4:3 aspect inside `{rounded.xl}` (16px) containers.
- **App icon tiles** — 48–64px square at `{rounded.md}` (8px), displaying real app icons.
- **Avatar circles** — 32–40px at `{rounded.full}` for in-extension author attribution.
- **Hero stripe gradient** — full-bleed wash with no aspect ratio.

## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal Raycast CTA
- Background `{colors.primary}` (white), text `{colors.on-primary}` (black), type `{typography.button-md}`, padding `8px 16px`, height ~36px, rounded `{rounded.md}`.
- Used for "Download" (sticky top-nav CTA), "Get Pro", "Install" — every primary action across every surface.
- Pressed state lives in `button-primary-pressed` — background dims to `{colors.primary-pressed}`.

**`button-secondary`** — transparent text button
- Background transparent, text `{colors.on-dark}`, type `{typography.button-md}`, padding `8px 16px`, height ~36px, rounded `{rounded.md}`.
- Lower-emphasis action: "Sign in" (top nav), "Learn more →", "View on GitHub".

**`button-tertiary`** — soft surface button
- Background `{colors.surface-elevated}`, text `{colors.on-dark}`, type `{typography.button-md}`, padding `8px 16px`, height ~36px, rounded `{rounded.md}`.
- Mid-emphasis: "Watch demo", "View extension", "Manage" buttons inside cards.

**`button-disabled`**
- Background `{colors.surface-elevated}`, text `{colors.ash}` — dim utility state.

**`install-button`** — the store-page install pill
- Background transparent with 1px solid `{colors.hairline-strong}` border, text `{colors.on-dark}`, type `{typography.button-md}`, padding `6px 14px`, rounded `{rounded.md}`.
- Sits at the right edge of every store extension card with the label "Install Extension".

### Filter & Tab Chips

**`pill-tab`** + **`pill-tab-active`** — small filter chip strip
- Default: transparent background, text `{colors.body}`, type `{typography.body-sm}`, padding `4px 10px`, rounded `{rounded.full}`.
- Active: background flips to `{colors.surface-elevated}`, text `{colors.on-dark}` — the chip "lifts" by one surface notch.
- Used in the store filter row ("All Extensions", "Recently Added", "Most Popular") and similar segmented controls.

**`badge-pro`** — small Pro/Plan label
- Background `{colors.surface-elevated}`, text `{colors.on-dark-mute}`, type `{typography.caption-sm}`, padding `2px 6px`, rounded `{rounded.xs}`.
- Inline "Pro" / "Pro+" / "Free" tier indicators on pricing tier cards.

**`badge-info-soft`** — translucent info chip
- Background `{colors.accent-blue-soft}`, text `{colors.accent-blue}`, type `{typography.caption-sm}`, padding `2px 8px`, rounded `{rounded.xs}`.
- Rare "New" / "Beta" inline tag.

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.surface-elevated}`, text `{colors.on-dark}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `8px 12px`, height ~36px, rounded `{rounded.md}`.
- Focused: same surface; 1px border becomes `{colors.hairline-strong}` — a subtle brightening rather than a colored ring.

**`store-search-bar`** — the store-page search field
- Background `{colors.surface-elevated}`, text `{colors.on-dark}`, type `{typography.body-md}`, padding `10px 16px`, height ~44px, rounded `{rounded.md}`.
- Sits at the top of the store page hero with a magnifier icon at the left and "Search the store..." placeholder. Slightly taller than the standard `text-input`.

### Cards & Containers

**`command-palette-card`** — the home-page hero command-palette mockup
- Container: background `{colors.surface}`, 1px solid `{colors.hairline}`, padding 0 (the mockup contents fill the card), rounded `{rounded.lg}` or `{rounded.xl}` depending on hero size.
- Layout: top header strip with macOS traffic-light dots + a search input row, body with a vertical stack of `{component.command-palette-row}` items, bottom-right keycap hint cluster.

**`command-palette-row`** + **`command-palette-row-active`** — single row inside the command palette
- Default: transparent background, text `{colors.on-dark}` in `{typography.body-md}`, padding `6px 10px`, rounded `{rounded.sm}`.
- Active: background `{colors.surface-card}` (one notch lighter than the surrounding palette card) — the selection state.
- Each row contains a small app-icon tile + label + optional keycap shortcut at the right edge.

**`feature-card-dark`** — standard product feature card
- Container: background `{colors.surface}`, 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.lg}`.
- Used in 2- or 3-up grids on home and feature pages — pairs a small product mockup or app-icon row with body copy and a "Learn more →" `{component.button-secondary}`.

**`feature-card-elevated`** — slightly-elevated variant
- Same chrome as `feature-card-dark` but background flips to `{colors.surface-elevated}` — used to break visual rhythm in alternating feature rows.

**`store-extension-card`** — store-page extension card
- Container: background `{colors.surface}`, 1px solid `{colors.hairline}`, padding `{spacing.lg}` (16px), rounded `{rounded.md}`.
- Layout: 48px `{component.app-icon-tile}` at left, vertical stack of name + by-author metadata + 1-line description in the center, `{component.install-button}` at the right edge.

**`pricing-tier-card`** — pricing plan card (default tier)
- Container: background `{colors.surface}`, 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.lg}`.
- Layout: tier name in `{typography.heading-xl}` (24px), price in larger numeric in `{typography.display-lg}`, body description in `{typography.body-lg}`, CTA `{component.button-primary}` (or `{component.button-secondary}` for free tier), feature checklist with `✓` glyphs.

**`pricing-tier-card-featured`** — middle "Pro" featured tier
- Same chrome but background flips to `{colors.surface-elevated}` (one notch lighter) — the only visual cue distinguishing the featured tier from the surrounding cards.

**`hero-stripe-band`** — home-page hero with red stripe gradient
- Background `{colors.canvas}` with three diagonal red stripes layered across the top half (`{colors.hero-stripe-start}` → `{colors.hero-stripe-end}`).
- Padding `{spacing.section}` 96px vertical / 48px horizontal, rounded `{rounded.none}`.
- Carries the hero headline in `{typography.display-xl}` and a single `{component.button-primary}` "Download" CTA.

### Decorative

**`app-icon-tile`** — small 48px square app icon
- Background `{colors.surface-card}`, padding 0 (icon fills the tile), rounded `{rounded.md}`, size 48×48.
- Used in command-palette rows and store extension cards.

**`app-icon-tile-large`** — 64px feature variant
- Same but at 64×64. Used in featured store cards and home-page hero illustration rows.

**`keycap`** — keyboard shortcut glyph
- Background `{colors.surface-card}` with a subtle linear gradient `{colors.key-bg-start}` → `{colors.key-bg-end}`, text `{colors.body}` in `{typography.caption-md}`, padding `1px 6px`, height ~20px, rounded `{rounded.xs}`.
- Renders inline command-palette shortcut hints like `⌘ K`, `⏎`, `Esc`. The signature "physical-key" feel on a flat dark canvas.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}`, text `{colors.on-dark}`, height ~56px, type `{typography.body-sm-strong}`, rounded `{rounded.none}`, with a 1px `{colors.hairline}` bottom rule.
- Layout (desktop): Raycast wordmark at left, centered nav cluster ("Pro · AI · Store · Manual · Changelog · Blog · Pricing"), right cluster (Sign in link + the always-white `{component.button-primary}` "Download" CTA pill).

**Top Nav (Mobile)**
- Hamburger menu icon at left, Raycast wordmark at center, "Download" white CTA pill at right. Primary nav collapses into a full-screen drawer that slides from the left.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.body-sm}`, padding `64px 48px`, with a 1px `{colors.hairline}` top rule.
- Layout: 6-column horizontal link grid (Product · Core Features · Top Extensions · Company · Community · By Raycast) with column headers in `{typography.body-sm-strong}` `{colors.on-dark}` and link lists in `{typography.body-sm}` `{colors.body}`.
- Bottom row: small Raycast wordmark + a subscribe newsletter input field with `{component.button-primary}` "Subscribe" at the right.
- The very top of the footer band has a faint red stripe-gradient repeat — a smaller echo of the hero''s diagonal stripe motif.

### Inline

**`link-inline`** — body-prose anchor link
- `{colors.on-dark}` text with no underline by default; underlines on focus. Inline body links are full-white rather than a tinted accent color, which keeps the dark canvas tonally pure.

## Do''s and Don''ts

### Do
- Render the entire site in one continuous dark mode. There is no light variant in the system.
- Use `{colors.primary}` (white pill) for every primary CTA. There is no second primary color — white IS the brand action.
- Build elevation from the surface-color ladder (`{colors.canvas}` → `{colors.surface}` → `{colors.surface-elevated}` → `{colors.surface-card}`), never from drop shadows.
- Enable `font-feature-settings: "calt", "kern", "liga", "ss03"` on the body element. The ss03 alternate `g` is part of the brand identity.
- Anchor a `{component.command-palette-card}` mockup as the hero''s load-bearing visual. Real Raycast UI is the brand.
- Use `{component.keycap}` glyphs inline to indicate keyboard shortcuts. Subtle key-bg gradient (`{colors.key-bg-start}` → `{colors.key-bg-end}`) is the brand''s only "depth" decoration.
- Reserve `{colors.hero-stripe-start}` → `{colors.hero-stripe-end}` red gradient for the hero band exactly once per page. Never repeat the stripe gradient deeper in the page.
- Use saturated category accents (`{colors.accent-yellow}`, `{colors.accent-red}`, `{colors.accent-green}`, `{colors.accent-blue}`) only inside extension and feature illustrations — never on chrome buttons or text.

### Don''t
- Don''t introduce a light mode. The system is dark-only by design.
- Don''t add drop shadows on cards. Elevation is built from the surface ladder, not from shadows.
- Don''t replace `{colors.primary}` (white) with a tinted accent for the primary CTA. Pure white is the brand action color.
- Don''t use the saturated accent colors (`{colors.accent-yellow}`, `{colors.accent-red}`, `{colors.accent-green}`, `{colors.accent-blue}`) on text, buttons, or chrome surfaces. They belong inside extension illustrations.
- Don''t repeat the hero stripe gradient outside the top hero band. The one-band rule is the system''s restraint.
- Don''t use Inter without the `ss03` feature flag enabled. The chrome will lose its signature voice.
- Don''t pad cards with 32px+ on all sides. The system runs tight at 16–24px in-card padding.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Content max-width holds at 1240px; outer gutters grow to ~80px |
| desktop-large | 1440px | Default — 3-up pricing grid, 2-up store extension grid |
| desktop | 1280px | Same with narrower outer gutters |
| desktop-small | 1024px | 3-up pricing collapses to 2+1; primary nav remains horizontal |
| tablet | 768px | Pricing → 1-up stacked; primary nav becomes hamburger drawer |
| mobile | 480px | Single-column everything; hero `{typography.display-xl}` scales 64px → ~36px |
| mobile-narrow | 320px | Section padding tightens to 48px |

### Touch Targets
All interactive elements meet WCAG AA at 36px+. `{component.button-primary}` and `{component.button-tertiary}` sit at 36px height with 16px padding. `{component.text-input}` sits at 36px. `{component.store-search-bar}` sits at 44px (above AAA). `{component.pill-tab}` is ~24–28px height with 10px padding extending to 36–40px tappable via inline padding (above AA but below AAA — intentional, the chips are compact). `{component.install-button}` sits at ~32px height with 14px padding.

### Collapsing Strategy
- **Primary nav:** desktop horizontal cluster → tablet hamburger drawer at 768px. The white "Download" CTA stays visible at every breakpoint.
- **Hero command-palette mockup:** desktop full-fidelity 2-column with copy at left + mockup at right → tablet stacks vertical with mockup below copy → mobile mockup scales down to ~80% width.
- **Store extension grid:** 2-up → 1-up at tablet.
- **Pricing tier grid:** 3-up → 2+1 at desktop-small → 1-up stacked at tablet.
- **Comparison table:** desktop full 5-column → tablet horizontal scroll → mobile vertical card stack with one tier per card.
- **Footer:** 6-up link columns → 3-up at tablet → 2-up at mobile-landscape → 1-up at mobile.
- **Section padding:** `{spacing.section}` (96px) desktop → 64px tablet → 48px mobile.
- **Hero headline:** `{typography.display-xl}` (64px) at desktop, scaling 56px / 44px / 36px down the breakpoint stack.

### Image Behavior
The only "imagery" in the system is in-product Raycast UI screenshots and small app-icon assets:
- **Command-palette mockups** scale fluidly with the container; the in-product UI itself is responsive and re-renders for each breakpoint.
- **App-icon tiles** stay at 48–64px fixed size at every breakpoint; they tile in flexible rows that wrap at narrower widths.
- **Hero stripe gradient** stays at the top of the hero band at every breakpoint with the stripe angle preserved.

## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.md}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-pressed`, `-disabled`, `-active`) — do not bury them inside prose.
5. Default body to `{typography.body-md}` (16px / 400 / 1.6); reach for `{typography.body-strong}` for emphasis; reserve `{typography.display-xl}` strictly for the hero band.
6. Keep `{colors.primary}` (white CTA pill) scarce per viewport — at most one solid white pill per fold.
7. When introducing a new component, ask whether it can be expressed with the existing surface-ladder + 8px-radius + ss03-Inter vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.

## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes Raycast''s mobile pattern (hamburger drawer, single-column grid, hero downscale) from desktop evidence and the breakpoint stack.
- **Hover states not documented** by system policy. Raycast''s in-product app has rich hover behavior on command-palette rows that this document doesn''t capture.
- **In-product app chrome** (the actual Raycast launcher running on macOS) is referenced in marketing screenshots but not documented as a separate UI system here. The marketing site is documented; the in-product app surface is its own design system.
- **Dark mode is the only mode** — no light variant exists in the captured surfaces.
- **Form validation states** beyond the focused-input border treatment are not present in the captured surfaces.
- **Authenticated chrome** (account dashboard, billing settings, team management) not in the captured pages.
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

Raycast''s marketing site reads like an extended product screenshot. The chrome IS the in-product command palette at marketing scale: pure near-black canvas (`{colors.canvas}` — `#07080a`), hairline 1px borders (`{colors.hairline}` — `#242728`), command-palette-style cards with rounded corners between 6 and 16px, Inter typography with the **ss03 stylistic set enabled site-wide** (a single character — the alternate `g` — that gives Raycast''s typography its signature subtle distinction), a single white CTA pill that anchors every primary action, and small splashes of saturated accent reserved for category illustrations.

The system has effectively one surface mode — dark — with a faint three-step surface ladder (`{colors.canvas}` → `{colors.surface}` → `{colors.surface-elevated}` → `{colors.surface-card}`) carrying cards, in-card panels, and key-cap glyph backgrounds. The signature decorative moment is a **red diagonal-stripe gradient band** across the very top of the home page hero, used as a launch-banner motif behind the headline (the only time saturated red appears on chrome). Beyond that single moment, color in the chrome is reserved for category accents inside extension and feature illustrations: Hacker News yellow, Slack red, Linear green, info blue.

The design philosophy is "the marketing page is the product." Section rhythm is generous (`{spacing.section}` 96px) but the page never breaks tonal continuity — the whole site sits in one continuous dark mode, full-bleed product UI screenshots show Raycast''s actual command palette / store / AI chat surfaces, and the typography ligature settings (`ss03`) are inherited from the in-product app''s text rendering.

**Key Characteristics:**
- Single dark surface mode with a 4-step surface ladder: `{colors.canvas}` (#07080a) → `{colors.surface}` (#0d0d0d) → `{colors.surface-elevated}` (#101111) → `{colors.surface-card}` (#121212)
- White CTA pill (`{colors.primary}` — #ffffff) is the universal primary action; everything else is monochrome dark
- Inter typography with `font-feature-settings: "calt", "kern", "liga", "ss03"` enabled site-wide — the ss03 alternate `g` is part of the brand voice
- Hairline 1px borders (`{colors.hairline}` — #242728) carry every card edge; there are no drop shadows in the system
- Multi-radius card vocabulary: `{rounded.sm}` (6px) for keycaps, `{rounded.md}` (8px) for buttons and small cards, `{rounded.lg}` (10px) for feature cards, `{rounded.xl}` (16px) for hero command-palette mockup containers
- Saturated category accents (`{colors.accent-yellow}` for Hacker News, `{colors.accent-red}` for Slack/Apple, `{colors.accent-green}` for productivity tools, `{colors.accent-blue}` for info) appear only inside extension tile imagery — never on chrome
- Signature red diagonal-stripe gradient band at the very top of the hero — three angled stripes in `{colors.hero-stripe-start}` → `{colors.hero-stripe-end}`, used once per page maximum', '{"sourcePath":"docs/design-md/raycast/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

> **Source pages:** `/` (home), `/store` (extension marketplace), `/core-features/ai` (feature page), `/pricing` (plan tiers), `/thomas/hacker-news` (single extension detail). The chrome palette is identical across all five pages — the dark surface ladder, hairline borders, white CTA, and ss03-enabled typography are the same on every page.

### Brand & Accent
- **White** (`{colors.primary}` — `#ffffff`): the universal primary CTA pill background. "Download" / "Install Extension" / "Get Pro" — every primary action carries it.
- **White Pressed** (`{colors.primary-pressed}` — `#e8e8e8`): pressed-state for the primary pill — a single notch dimmer.
- **On Primary** (`{colors.on-primary}` — `#000000`): pure black text on the white CTA — the only place black appears as text in the system.

### Surface
- **Canvas** (`{colors.canvas}` — `#07080a`): pure-near-black page background. The dominant surface across every page.
- **Surface** (`{colors.surface}` — `#0d0d0d`): card and elevated panel background — one notch lighter than canvas.
- **Surface Elevated** (`{colors.surface-elevated}` — `#101111`): button-tertiary fill, text-input fill, store-search-bar fill, pill-tab-active fill.
- **Surface Card** (`{colors.surface-card}` — `#121212`): app-icon-tile background, keycap fill, command-palette row hover.
- **Button FG (in-card)** (`{colors.button-fg}` — `#18191a`): rare deep-card variant used inside featured pricing tier card backgrounds.
- **Hairline** (`{colors.hairline}` — `#242728`): the universal 1px card border. Carries every card edge across every page.
- **Hairline Soft** (`{colors.hairline-soft}` — `rgba(255,255,255,0.08)`): even fainter border on translucent over-image overlays.
- **Hairline Strong** (`{colors.hairline-strong}` — `rgba(255,255,255,0.16)`): stronger 1px divider where a regular hairline reads as too soft.

### Text
- **Ink** (`{colors.ink}` — `#f4f4f6`): primary headlines on dark canvas. Slightly off-white for tonal coherence with the near-black background.
- **Body** (`{colors.body}` — `#cdcdcd`): default paragraph text and inline-link color.
- **Charcoal** (`{colors.charcoal}` — `#d3d3d4`): subtly brighter body where ink reads too soft.
- **Mute** (`{colors.mute}` — `#9c9c9d`): metadata, footer link text, secondary captions.
- **Ash** (`{colors.ash}` — `#6a6b6c`): disabled-state text, lowest-emphasis utility.
- **Stone** (`{colors.stone}` — `#434345`): least-emphasis caption text and disabled icon color.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): interactive-state primary text (button label, focused tab).
- **On Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.72)`): translucent secondary text on dark surfaces.

### Semantic
- **Accent Blue** (`{colors.accent-blue}` — `#57c1ff`) + **Soft** (`{colors.accent-blue-soft}` — `rgba(87,193,255,0.15)`): info and informational badge — used inside feature illustrations and the rare "New" pill.
- **Accent Red** (`{colors.accent-red}` — `#ff6161`) + **Soft** (`{colors.accent-red-soft}` — `rgba(255,97,97,0.15)`): destructive/error indicator + Slack/Apple category accent in extension illustrations.
- **Accent Green** (`{colors.accent-green}` — `#59d499`) + **Soft** (`{colors.accent-green-soft}` — `rgba(89,212,153,0.15)`): success state + productivity category accent in extension illustrations.
- **Accent Yellow** (`{colors.accent-yellow}` — `#ffc533`) + **Soft** (`{colors.accent-yellow-soft}` — `rgba(255,197,51,0.15)`): "warning" semantic + the Hacker News orange-yellow that appears as the most prominent accent illustration on the home page hero.

### Brand Gradient
- **Hero Stripe Gradient** — three diagonal red stripes layered across the very top of the home page hero, fading from `{colors.hero-stripe-start}` (`#ff5757`) to `{colors.hero-stripe-end}` (`#a1131a`). The system''s only chromatic gradient on chrome — used once per page maximum and reserved for hero launch-banner moments.
- **Keycap Gradient** — the small key-glyph background uses a subtle linear-gradient from `{colors.key-bg-start}` (`#121212`) to `{colors.key-bg-end}` (`#0d0d0d`) that gives Raycast''s keycap UI its slight 3D-key feel.', '{"sourcePath":"docs/design-md/raycast/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family
**Inter** is the system''s primary face, loaded with the `Inter Fallback` system fallback variant. Critically, Raycast enables `font-feature-settings: "calt", "kern", "liga", "ss03"` site-wide — the **ss03 stylistic set** swaps in Inter''s alternate `g` glyph (single-story open `g`), which is the brand''s signature typographic detail. Standard ligatures (`liga`), kerning (`kern`), and contextual alternates (`calt`) are also active. The display tier additionally enables `ss02` and `ss08` and disables standard `liga` to render the hero "Raycast Pro" wordmark with its distinctive geometric construction.

There is no monospace face used outside of inline `<code>` chips in documentation; the marketing pages use Inter for everything.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 600 | 1.1 | 0 | Hero "Built for the perfect tools" / "The new way to..." headline (with `liga: 0`, `ss02`, `ss08`) |
| `{typography.display-lg}` | 56px | 500 | 1.17 | 0.2px | Section headline ("Explore", "Pricing", store hero "Store") |
| `{typography.heading-xl}` | 24px | 500 | 1.6 | 0.2px | Sub-section heading, pricing-tier name |
| `{typography.heading-lg}` | 22px | 500 | 1.15 | 0 | Mid-section feature heading |
| `{typography.heading-md}` | 20px | 500 | 1.4 | 0.2px | Card group title, in-card heading |
| `{typography.heading-sm}` | 18px | 500 | 1.4 | 0.2px | Small heading, extension card title |
| `{typography.body-lg}` | 18px | 400 | 1.6 | 0 | Pricing tier description, hero subtitle |
| `{typography.body-md}` | 16px | 400 | 1.6 | 0 | Default body, paragraph text |
| `{typography.body-strong}` | 16px | 500 | 1.4 | 0.2px | Inline emphasis, primary nav link |
| `{typography.body-sm}` | 14px | 400 | 1.6 | 0 | Card description, secondary copy |
| `{typography.body-sm-strong}` | 14px | 500 | 1.6 | 0.2px | In-card label, table-header text |
| `{typography.caption-md}` | 13px | 400 | 1.4 | 0.1px | Caption, metadata |
| `{typography.caption-sm}` | 12px | 400 | 1.5 | 0.4px | Smallest utility text, badge label |
| `{typography.link-md}` | 16px | 500 | 1.4 | 0.3px | Inline body anchor link |
| `{typography.button-md}` | 14px | 500 | 1.6 | 0.2px | Standard button label |

### Principles
The hierarchy works on a 1.6-line-height ladder for body and a 1.1–1.4 ladder for display/heading. Letter-spacing is consistently positive (0.1–0.4px) — slightly opening the type — which gives Raycast''s chrome an airy quality at body sizes despite the dark canvas. The `ss03` stylistic set is the brand''s most distinctive typographic detail; without it, the body face renders identically to plain Inter and loses Raycast''s signature rendering.

### Note on Font Substitutes
Inter is open-source and Google-Fonts-hosted; load it directly. To preserve the brand''s signature look, you must enable `font-feature-settings: "calt", "kern", "liga", "ss03"` on the body element. Without `ss03`, the typography is recognizably "Inter default" rather than "Raycast." On systems where Inter cannot be loaded, the documented fallback is `Inter Fallback` (a self-hosted variant) → `system-ui`. **JetBrains Mono** or **Geist Mono** are acceptable substitutes for inline code chips when needed, though Raycast''s marketing chrome rarely uses code-styled text.', '{"sourcePath":"docs/design-md/raycast/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit:** 8px (with 2/4/12px steps for tight inline gaps).
- **Tokens (front matter):** `{spacing.xxs}` (2px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (96px).
- **Universal section rhythm:** every page in the set uses `{spacing.section}` (96px) as the vertical gap between major content blocks. Card grids use `{spacing.lg}` (16px) gutters; in-card padding sits at `{spacing.xl}` (24px) for feature cards and `{spacing.lg}` (16px) for store extension cards.

### Grid & Container
- **Max width:** ~1240px content area at desktop with 24px gutters (~48px at ultrawide). Hero command-palette mockups run wider (~1080px) with the page background extending to full bleed.
- **Store extension grid:** 2-up at desktop with rows of 2 cards stacked, collapsing to 1-up at mobile. Each card is a horizontal layout with a large square app icon at the left and copy + Install button at the right.
- **Pricing tier grid:** 3-up at desktop (Free / Pro / Pro+Advanced AI), collapsing to 1-up stacked at mobile.
- **Featured extension card grid:** 3-up at desktop in the "Featured" row at the top of the store page.
- **Comparison table:** full-width on the pricing page below the tier cards — 5-column table (Free / Pro / Advanced AI / Custom for Teams / Enterprise) with feature rows.
- **Footer:** 6-column horizontal link grid at desktop, collapsing to 2-up at tablet and 1-up at mobile.

### Whitespace Philosophy
Whitespace is generous and the canvas is uninterrupted. Sections sit 96px apart with no decorative dividers between them — the dark canvas continues edge-to-edge from hero to footer. Inside a section, content is left-aligned in a tight column, with command-palette mockup imagery occupying the right 50–60% of the band on home-page feature rows. The signature decorative element — the red diagonal-stripe gradient band — only appears in the very first hero band; from the second section down, the page is monochrome dark.', '{"sourcePath":"docs/design-md/raycast/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for canvas-on-canvas blocks, hero text, footer body |
| 1 — Hairline border | 1px solid `{colors.hairline}` (#242728) | Every card on `{colors.surface}`, store extension card, pricing tier card |
| 2 — Hairline strong | 1px solid `{colors.hairline-strong}` | Stronger inline divider, table-row separator on the comparison table |
| 3 — Surface ladder elevation | `{colors.canvas}` → `{colors.surface}` → `{colors.surface-elevated}` → `{colors.surface-card}` | Multi-step background-color ladder used to create elevation without shadows |

The system has no drop-shadow elevation at all. Depth is built entirely from the surface-color ladder: each notch lighter on the dark scale reads as one step closer to the viewer.

### Decorative Depth
Depth comes from product imagery and a single stripe-gradient band:
- **Hero stripe gradient** — three diagonal red stripes (`{colors.hero-stripe-start}` → `{colors.hero-stripe-end}`) layered across the home-page hero band, evoking a launch-banner / motion-blur effect. The system''s signature decorative moment.
- **Command-palette mockups** — full-fidelity Raycast in-product UI screenshots (the actual Spotlight-style overlay with rounded keycaps, command rows, and accent-color glyphs) sitting inside the home-page hero and feature rows. These ARE the brand decoration.
- **App icon tiles** — small 48–64px rounded-corner tiles displaying real app icons (Slack, Spotify, Figma, Notion, Linear, Hacker News) inside store and feature illustrations.
- **Keycap glyphs** — subtle gradient-filled rounded keycap glyphs used inline to indicate keyboard shortcuts (e.g., `⌘ K`), with a faint `{colors.key-bg-start}` → `{colors.key-bg-end}` linear gradient suggesting a physical key surface.', '{"sourcePath":"docs/design-md/raycast/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero band, primary nav, footer, full-bleed structural surfaces |
| `{rounded.xs}` | 4px | Keycap glyphs, badge-pro chips, small inline tags |
| `{rounded.sm}` | 6px | Command-palette row, inline buttons, micro chips |
| `{rounded.md}` | 8px | Standard buttons, text inputs, store search bar, app-icon tiles, store extension card |
| `{rounded.lg}` | 10px | Feature card, command-palette mockup card, pricing tier card |
| `{rounded.xl}` | 16px | Large hero command-palette mockup container, oversized feature panel |
| `{rounded.full}` | 9999px | Pill-tab chips, avatar circles |

The radius vocabulary clusters tightly between 4 and 16px, with most chrome at 6–10px. The system never goes flat (0px) on cards and never above 16px except for fully-rounded pills.

### Photography Geometry
There is no traditional photography. Visual elements are limited to:
- **Command-palette mockups** — full-fidelity Raycast UI screenshots at 16:9 or 4:3 aspect inside `{rounded.xl}` (16px) containers.
- **App icon tiles** — 48–64px square at `{rounded.md}` (8px), displaying real app icons.
- **Avatar circles** — 32–40px at `{rounded.full}` for in-extension author attribution.
- **Hero stripe gradient** — full-bleed wash with no aspect ratio.', '{"sourcePath":"docs/design-md/raycast/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

> **No hover states documented** per system policy. Each spec covers Default and Active/Pressed only.

### Buttons

**`button-primary`** — the universal Raycast CTA
- Background `{colors.primary}` (white), text `{colors.on-primary}` (black), type `{typography.button-md}`, padding `8px 16px`, height ~36px, rounded `{rounded.md}`.
- Used for "Download" (sticky top-nav CTA), "Get Pro", "Install" — every primary action across every surface.
- Pressed state lives in `button-primary-pressed` — background dims to `{colors.primary-pressed}`.

**`button-secondary`** — transparent text button
- Background transparent, text `{colors.on-dark}`, type `{typography.button-md}`, padding `8px 16px`, height ~36px, rounded `{rounded.md}`.
- Lower-emphasis action: "Sign in" (top nav), "Learn more →", "View on GitHub".

**`button-tertiary`** — soft surface button
- Background `{colors.surface-elevated}`, text `{colors.on-dark}`, type `{typography.button-md}`, padding `8px 16px`, height ~36px, rounded `{rounded.md}`.
- Mid-emphasis: "Watch demo", "View extension", "Manage" buttons inside cards.

**`button-disabled`**
- Background `{colors.surface-elevated}`, text `{colors.ash}` — dim utility state.

**`install-button`** — the store-page install pill
- Background transparent with 1px solid `{colors.hairline-strong}` border, text `{colors.on-dark}`, type `{typography.button-md}`, padding `6px 14px`, rounded `{rounded.md}`.
- Sits at the right edge of every store extension card with the label "Install Extension".

### Filter & Tab Chips

**`pill-tab`** + **`pill-tab-active`** — small filter chip strip
- Default: transparent background, text `{colors.body}`, type `{typography.body-sm}`, padding `4px 10px`, rounded `{rounded.full}`.
- Active: background flips to `{colors.surface-elevated}`, text `{colors.on-dark}` — the chip "lifts" by one surface notch.
- Used in the store filter row ("All Extensions", "Recently Added", "Most Popular") and similar segmented controls.

**`badge-pro`** — small Pro/Plan label
- Background `{colors.surface-elevated}`, text `{colors.on-dark-mute}`, type `{typography.caption-sm}`, padding `2px 6px`, rounded `{rounded.xs}`.
- Inline "Pro" / "Pro+" / "Free" tier indicators on pricing tier cards.

**`badge-info-soft`** — translucent info chip
- Background `{colors.accent-blue-soft}`, text `{colors.accent-blue}`, type `{typography.caption-sm}`, padding `2px 8px`, rounded `{rounded.xs}`.
- Rare "New" / "Beta" inline tag.

### Inputs & Forms

**`text-input`** + **`text-input-focused`**
- Default: background `{colors.surface-elevated}`, text `{colors.on-dark}`, 1px solid `{colors.hairline}`, type `{typography.body-md}`, padding `8px 12px`, height ~36px, rounded `{rounded.md}`.
- Focused: same surface; 1px border becomes `{colors.hairline-strong}` — a subtle brightening rather than a colored ring.

**`store-search-bar`** — the store-page search field
- Background `{colors.surface-elevated}`, text `{colors.on-dark}`, type `{typography.body-md}`, padding `10px 16px`, height ~44px, rounded `{rounded.md}`.
- Sits at the top of the store page hero with a magnifier icon at the left and "Search the store..." placeholder. Slightly taller than the standard `text-input`.

### Cards & Containers

**`command-palette-card`** — the home-page hero command-palette mockup
- Container: background `{colors.surface}`, 1px solid `{colors.hairline}`, padding 0 (the mockup contents fill the card), rounded `{rounded.lg}` or `{rounded.xl}` depending on hero size.
- Layout: top header strip with macOS traffic-light dots + a search input row, body with a vertical stack of `{component.command-palette-row}` items, bottom-right keycap hint cluster.

**`command-palette-row`** + **`command-palette-row-active`** — single row inside the command palette
- Default: transparent background, text `{colors.on-dark}` in `{typography.body-md}`, padding `6px 10px`, rounded `{rounded.sm}`.
- Active: background `{colors.surface-card}` (one notch lighter than the surrounding palette card) — the selection state.
- Each row contains a small app-icon tile + label + optional keycap shortcut at the right edge.

**`feature-card-dark`** — standard product feature card
- Container: background `{colors.surface}`, 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.lg}`.
- Used in 2- or 3-up grids on home and feature pages — pairs a small product mockup or app-icon row with body copy and a "Learn more →" `{component.button-secondary}`.

**`feature-card-elevated`** — slightly-elevated variant
- Same chrome as `feature-card-dark` but background flips to `{colors.surface-elevated}` — used to break visual rhythm in alternating feature rows.

**`store-extension-card`** — store-page extension card
- Container: background `{colors.surface}`, 1px solid `{colors.hairline}`, padding `{spacing.lg}` (16px), rounded `{rounded.md}`.
- Layout: 48px `{component.app-icon-tile}` at left, vertical stack of name + by-author metadata + 1-line description in the center, `{component.install-button}` at the right edge.

**`pricing-tier-card`** — pricing plan card (default tier)
- Container: background `{colors.surface}`, 1px solid `{colors.hairline}`, padding `{spacing.xl}` (24px), rounded `{rounded.lg}`.
- Layout: tier name in `{typography.heading-xl}` (24px), price in larger numeric in `{typography.display-lg}`, body description in `{typography.body-lg}`, CTA `{component.button-primary}` (or `{component.button-secondary}` for free tier), feature checklist with `✓` glyphs.

**`pricing-tier-card-featured`** — middle "Pro" featured tier
- Same chrome but background flips to `{colors.surface-elevated}` (one notch lighter) — the only visual cue distinguishing the featured tier from the surrounding cards.

**`hero-stripe-band`** — home-page hero with red stripe gradient
- Background `{colors.canvas}` with three diagonal red stripes layered across the top half (`{colors.hero-stripe-start}` → `{colors.hero-stripe-end}`).
- Padding `{spacing.section}` 96px vertical / 48px horizontal, rounded `{rounded.none}`.
- Carries the hero headline in `{typography.display-xl}` and a single `{component.button-primary}` "Download" CTA.

### Decorative

**`app-icon-tile`** — small 48px square app icon
- Background `{colors.surface-card}`, padding 0 (icon fills the tile), rounded `{rounded.md}`, size 48×48.
- Used in command-palette rows and store extension cards.

**`app-icon-tile-large`** — 64px feature variant
- Same but at 64×64. Used in featured store cards and home-page hero illustration rows.

**`keycap`** — keyboard shortcut glyph
- Background `{colors.surface-card}` with a subtle linear gradient `{colors.key-bg-start}` → `{colors.key-bg-end}`, text `{colors.body}` in `{typography.caption-md}`, padding `1px 6px`, height ~20px, rounded `{rounded.xs}`.
- Renders inline command-palette shortcut hints like `⌘ K`, `⏎`, `Esc`. The signature "physical-key" feel on a flat dark canvas.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}`, text `{colors.on-dark}`, height ~56px, type `{typography.body-sm-strong}`, rounded `{rounded.none}`, with a 1px `{colors.hairline}` bottom rule.
- Layout (desktop): Raycast wordmark at left, centered nav cluster ("Pro · AI · Store · Manual · Changelog · Blog · Pricing"), right cluster (Sign in link + the always-white `{component.button-primary}` "Download" CTA pill).

**Top Nav (Mobile)**
- Hamburger menu icon at left, Raycast wordmark at center, "Download" white CTA pill at right. Primary nav collapses into a full-screen drawer that slides from the left.

### Footer

**`footer-section`**
- Background `{colors.canvas}`, text `{colors.body}` in `{typography.body-sm}`, padding `64px 48px`, with a 1px `{colors.hairline}` top rule.
- Layout: 6-column horizontal link grid (Product · Core Features · Top Extensions · Company · Community · By Raycast) with column headers in `{typography.body-sm-strong}` `{colors.on-dark}` and link lists in `{typography.body-sm}` `{colors.body}`.
- Bottom row: small Raycast wordmark + a subscribe newsletter input field with `{component.button-primary}` "Subscribe" at the right.
- The very top of the footer band has a faint red stripe-gradient repeat — a smaller echo of the hero''s diagonal stripe motif.

### Inline

**`link-inline`** — body-prose anchor link
- `{colors.on-dark}` text with no underline by default; underlines on focus. Inline body links are full-white rather than a tinted accent color, which keeps the dark canvas tonally pure.', '{"sourcePath":"docs/design-md/raycast/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Render the entire site in one continuous dark mode. There is no light variant in the system.
- Use `{colors.primary}` (white pill) for every primary CTA. There is no second primary color — white IS the brand action.
- Build elevation from the surface-color ladder (`{colors.canvas}` → `{colors.surface}` → `{colors.surface-elevated}` → `{colors.surface-card}`), never from drop shadows.
- Enable `font-feature-settings: "calt", "kern", "liga", "ss03"` on the body element. The ss03 alternate `g` is part of the brand identity.
- Anchor a `{component.command-palette-card}` mockup as the hero''s load-bearing visual. Real Raycast UI is the brand.
- Use `{component.keycap}` glyphs inline to indicate keyboard shortcuts. Subtle key-bg gradient (`{colors.key-bg-start}` → `{colors.key-bg-end}`) is the brand''s only "depth" decoration.
- Reserve `{colors.hero-stripe-start}` → `{colors.hero-stripe-end}` red gradient for the hero band exactly once per page. Never repeat the stripe gradient deeper in the page.
- Use saturated category accents (`{colors.accent-yellow}`, `{colors.accent-red}`, `{colors.accent-green}`, `{colors.accent-blue}`) only inside extension and feature illustrations — never on chrome buttons or text.

### Don''t
- Don''t introduce a light mode. The system is dark-only by design.
- Don''t add drop shadows on cards. Elevation is built from the surface ladder, not from shadows.
- Don''t replace `{colors.primary}` (white) with a tinted accent for the primary CTA. Pure white is the brand action color.
- Don''t use the saturated accent colors (`{colors.accent-yellow}`, `{colors.accent-red}`, `{colors.accent-green}`, `{colors.accent-blue}`) on text, buttons, or chrome surfaces. They belong inside extension illustrations.
- Don''t repeat the hero stripe gradient outside the top hero band. The one-band rule is the system''s restraint.
- Don''t use Inter without the `ss03` feature flag enabled. The chrome will lose its signature voice.
- Don''t pad cards with 32px+ on all sides. The system runs tight at 16–24px in-card padding.', '{"sourcePath":"docs/design-md/raycast/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| ultrawide | 1920px+ | Content max-width holds at 1240px; outer gutters grow to ~80px |
| desktop-large | 1440px | Default — 3-up pricing grid, 2-up store extension grid |
| desktop | 1280px | Same with narrower outer gutters |
| desktop-small | 1024px | 3-up pricing collapses to 2+1; primary nav remains horizontal |
| tablet | 768px | Pricing → 1-up stacked; primary nav becomes hamburger drawer |
| mobile | 480px | Single-column everything; hero `{typography.display-xl}` scales 64px → ~36px |
| mobile-narrow | 320px | Section padding tightens to 48px |

### Touch Targets
All interactive elements meet WCAG AA at 36px+. `{component.button-primary}` and `{component.button-tertiary}` sit at 36px height with 16px padding. `{component.text-input}` sits at 36px. `{component.store-search-bar}` sits at 44px (above AAA). `{component.pill-tab}` is ~24–28px height with 10px padding extending to 36–40px tappable via inline padding (above AA but below AAA — intentional, the chips are compact). `{component.install-button}` sits at ~32px height with 14px padding.

### Collapsing Strategy
- **Primary nav:** desktop horizontal cluster → tablet hamburger drawer at 768px. The white "Download" CTA stays visible at every breakpoint.
- **Hero command-palette mockup:** desktop full-fidelity 2-column with copy at left + mockup at right → tablet stacks vertical with mockup below copy → mobile mockup scales down to ~80% width.
- **Store extension grid:** 2-up → 1-up at tablet.
- **Pricing tier grid:** 3-up → 2+1 at desktop-small → 1-up stacked at tablet.
- **Comparison table:** desktop full 5-column → tablet horizontal scroll → mobile vertical card stack with one tier per card.
- **Footer:** 6-up link columns → 3-up at tablet → 2-up at mobile-landscape → 1-up at mobile.
- **Section padding:** `{spacing.section}` (96px) desktop → 64px tablet → 48px mobile.
- **Hero headline:** `{typography.display-xl}` (64px) at desktop, scaling 56px / 44px / 36px down the breakpoint stack.

### Image Behavior
The only "imagery" in the system is in-product Raycast UI screenshots and small app-icon assets:
- **Command-palette mockups** scale fluidly with the container; the in-product UI itself is responsive and re-renders for each breakpoint.
- **App-icon tiles** stay at 48–64px fixed size at every breakpoint; they tile in flexible rows that wrap at narrower widths.
- **Hero stripe gradient** stays at the top of the hero band at every breakpoint with the stripe angle preserved.', '{"sourcePath":"docs/design-md/raycast/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Pull its YAML entry and verify every property resolves.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.md}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits — `broken-ref`, `contrast-ratio`, and `orphaned-tokens` warnings flag issues automatically.
4. Add new variants as separate component entries (`-pressed`, `-disabled`, `-active`) — do not bury them inside prose.
5. Default body to `{typography.body-md}` (16px / 400 / 1.6); reach for `{typography.body-strong}` for emphasis; reserve `{typography.display-xl}` strictly for the hero band.
6. Keep `{colors.primary}` (white CTA pill) scarce per viewport — at most one solid white pill per fold.
7. When introducing a new component, ask whether it can be expressed with the existing surface-ladder + 8px-radius + ss03-Inter vocabulary before adding new tokens. The system''s strength is that it almost never needs new ones.', '{"sourcePath":"docs/design-md/raycast/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- **Mobile screenshots not captured** — responsive behavior synthesizes Raycast''s mobile pattern (hamburger drawer, single-column grid, hero downscale) from desktop evidence and the breakpoint stack.
- **Hover states not documented** by system policy. Raycast''s in-product app has rich hover behavior on command-palette rows that this document doesn''t capture.
- **In-product app chrome** (the actual Raycast launcher running on macOS) is referenced in marketing screenshots but not documented as a separate UI system here. The marketing site is documented; the in-product app surface is its own design system.
- **Dark mode is the only mode** — no light variant exists in the captured surfaces.
- **Form validation states** beyond the focused-input border treatment are not present in the captured surfaces.
- **Authenticated chrome** (account dashboard, billing settings, team management) not in the captured pages.', '{"sourcePath":"docs/design-md/raycast/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_1', '#07080a', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_2', '#0d0d0d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_3', '#101111', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_4', '#242728', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_5', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_6', '#e8e8e8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_7', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_8', '#f4f4f6', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_9', '#cdcdcd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_10', '#d3d3d4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_11', '#9c9c9d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_12', '#6a6b6c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_13', '#434345', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_14', '#121212', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_15', '#18191a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_16', '#57c1ff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_17', '#ff6161', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_18', '#59d499', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_19', '#ffc533', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_20', '#ff5757', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md'), 'color', 'color_21', '#a1131a', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/raycast/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/raycast/DESIGN.md';


-- Renault
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Renault', 'renault', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/renault/DESIGN.md', null, 'seeded', '---
version: alpha
name: Renault-design-analysis
description: |
  Renault''s web presence pairs the freshly-modernised Renault diamond
  (the 2021 flat-line rhombus mark) with a stark black-and-white canvas, a
  signature Sunlight Yellow accent, and the proprietary NouvelR display
  typeface. The system reads as confident, photography-first automotive — large
  hero cars on neutral or atmospheric backdrops, square-edged or barely-rounded
  containers, and a small disciplined palette where every coloured element is
  intentional. Tile grids, full-bleed banners, and a recurring "configurator"
  surface (white card, yellow accent dots, neutral product chrome) carry the
  mass-market dealership tone without crossing into luxury.

colors:
  primary: "#ffed00"
  primary-deep: "#e6d200"
  on-primary: "#000000"
  ink: "#000000"
  body: "#222222"
  charcoal: "#333333"
  mute: "#666666"
  ash: "#8a8a8a"
  stone: "#c4c4c4"
  on-dark: "#ffffff"
  on-dark-mute: "rgba(255,255,255,0.72)"
  canvas: "#ffffff"
  surface-soft: "#f7f7f7"
  surface-card: "#ffffff"
  surface-dark: "#000000"
  surface-deep: "#111111"
  hairline: "#f2f2f2"
  hairline-strong: "#000000"
  divider-dark: "rgba(255,255,255,0.16)"
  badge-new: "#ffed00"
  link: "#0000ee"
  error: "#be6464"
  warning: "#f0ad4e"
  success: "#8dc572"
  info: "#337ab7"

typography:
  display-xl:
    fontFamily: NouvelR
    fontSize: 56px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: 0
  display-lg:
    fontFamily: NouvelR
    fontSize: 40px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: 0
  display-md:
    fontFamily: NouvelR
    fontSize: 32px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: 0
  heading-lg:
    fontFamily: NouvelR
    fontSize: 24px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: 0
  heading-md:
    fontFamily: NouvelR
    fontSize: 20px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: 0
  heading-sm:
    fontFamily: NouvelR
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 0
  subtitle:
    fontFamily: NouvelR
    fontSize: 19.2px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  body-lg:
    fontFamily: NouvelR
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-md:
    fontFamily: NouvelR
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  body-sm:
    fontFamily: NouvelR
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.57
    letterSpacing: 0
  button-lg:
    fontFamily: NouvelR
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 0
  button-md:
    fontFamily: NouvelR
    fontSize: 14.4px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 0.144px
  button-sm:
    fontFamily: NouvelR
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.13px
  caption:
    fontFamily: NouvelR
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  overline:
    fontFamily: NouvelR
    fontSize: 10px
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: 0

rounded:
  none: 0px
  xs: 2px
  sm: 3px
  md: 4px
  pill: 46px
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
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xs}"
    padding: 14px 24px
    height: 48px
  button-primary-pressed:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xs}"
  button-secondary-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xs}"
    padding: 14px 24px
  button-outline-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xs}"
    padding: 13px 23px
  button-outline-light:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xs}"
    padding: 13px 23px
  button-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
    height: 36px
  button-icon-square:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xs}"
    size: 40px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 12px 16px
    height: 48px
  hero-banner:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
    padding: 0
  promo-tile-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-lg}"
    rounded: "{rounded.none}"
    padding: 32px
  promo-tile-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.heading-lg}"
    rounded: "{rounded.none}"
    padding: 32px
  promo-tile-yellow:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.heading-lg}"
    rounded: "{rounded.none}"
    padding: 32px
  vehicle-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 0
  configurator-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 24px 0
  configurator-swatch:
    backgroundColor: "{colors.surface-soft}"
    rounded: "{rounded.full}"
    size: 56px
  badge-new:
    backgroundColor: "{colors.badge-new}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 6px 14px
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    height: 60px
  sub-nav-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
  footer:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 64px 24px
---

## Overview

Renault''s Turkish marketing surfaces are unapologetically high-contrast: a
white canvas for browsing, a black canvas for product storytelling, and a
single Sunlight Yellow accent (`{colors.primary}` — `#ffed00`) reserved for
the most consequential actions. The brand''s modernised flat diamond logo sets
the tone — geometric, confident, slightly industrial — and the system follows
suit. Square corners dominate, hairline borders are rare, and elevation is
expressed through colour blocking rather than shadow.

The typography is monolithic. Every text on the site is set in **NouvelR**,
Renault''s bespoke display family, with a strong preference for weight 700 at
display sizes (with a tight `lineHeight: 0.95`) and weight 400 for body. There
is no secondary serif, no decorative italic, no script — the discipline is
the signature.

Page rhythm cycles between three surface modes: a **white catalogue mode** for
listings and configurators (`{colors.canvas}` with hairline-thin
`{colors.hairline}` dividers), a **black storytelling mode** for hero
sections, lifestyle imagery, and the lower half of campaign pages, and brief
**yellow accent moments** (`{colors.primary}` tiles, "NEW" badges, R5-coded
yellow paint shots) that punctuate the otherwise neutral palette.

**Key Characteristics:**
- Two-tone canvas system — `{colors.canvas}` (white) for browsing, `{colors.surface-dark}` (black) for storytelling — switched in full-bleed bands rather than subtle gradations.
- A single brand accent — `{colors.primary}` Sunlight Yellow — used scarcely on primary CTAs, "NEW" badges, R5 hero photography, and configurator dot indicators.
- **NouvelR everywhere**, with `{typography.display-xl}` headlines at 56px / weight 700 / `lineHeight: 0.95` so condensed multi-line headlines stack cleanly.
- Square geometry: `{rounded.xs}` (2px) on buttons, `{rounded.none}` on tiles and product cards, `{rounded.pill}` reserved exclusively for sub-nav chips and decorative badges.
- Photography-first product tiles — vehicle photos full-bleed inside otherwise neutral cards, with copy stacked beneath rather than overlaid.
- Page-level rhythm cycles white → black → yellow accent → black, with the wordmark and footer always closing on `{colors.surface-dark}`.

## Colors

### Brand & Accent
- **Sunlight Yellow** (`{colors.primary}` — `#ffed00`): the brand accent. Reserved for primary CTAs, "NEW" / "yeni" badges, configurator dot indicators, and full-bleed promotional tiles. Never decorative.
- **Sunlight Yellow Pressed** (`{colors.primary-deep}` — `#e6d200`): the active/pressed state of `{colors.primary}` buttons and tiles.
- **On-Primary** (`{colors.on-primary}` — `#000000`): label colour on top of `{colors.primary}` surfaces. Yellow always pairs with black text — never white.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): the default page background and card surface.
- **Surface Soft** (`{colors.surface-soft}` — `#f7f7f7`): subtle elevation step for grouped configurator rows and inactive form fields.
- **Surface Dark** (`{colors.surface-dark}` — `#000000`): the alternate canvas, used for hero bands, footer, and full-bleed storytelling sections.
- **Surface Deep** (`{colors.surface-deep}` — `#111111`): a one-step-up elevation inside `{colors.surface-dark}` regions for inset cards and form panels.
- **Hairline** (`{colors.hairline}` — `#f2f2f2`): the soft 1px divider between rows on white surfaces.
- **Hairline Strong** (`{colors.hairline-strong}` — `#000000`): full-strength dividers on white, plus all card / button outlines.
- **Divider Dark** (`{colors.divider-dark}` — `rgba(255,255,255,0.16)`): the corresponding low-contrast divider used inside `{colors.surface-dark}` regions.

### Text
- **Ink** (`{colors.ink}` — `#000000`): primary text colour on white surfaces. The same value also drives logos, icons, and outline borders — black is structural, not decorative.
- **Body** (`{colors.body}` — `#222222`): secondary body text where pure black would feel too heavy in long paragraphs.
- **Charcoal** (`{colors.charcoal}` — `#333333`): captions, metadata, and small labels.
- **Mute** (`{colors.mute}` — `#666666`): supporting text and inactive nav labels.
- **Ash** (`{colors.ash}` — `#8a8a8a`): placeholder text, disabled labels.
- **Stone** (`{colors.stone}` — `#c4c4c4`): disabled-state foreground.
- **On-Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.surface-dark}` surfaces.
- **On-Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.72)`): secondary text in dark regions; preserves the brand''s high-contrast feel without resorting to mid-grey.

### Semantic
- **Error** (`{colors.error}` — `#be6464`): muted desaturated red used for inline form errors. Notably warmer than typical pure-red error states.
- **Warning** (`{colors.warning}` — `#f0ad4e`): amber alert.
- **Success** (`{colors.success}` — `#8dc572`): muted green confirmation.
- **Info** (`{colors.info}` — `#337ab7`): a desaturated mid-blue used in informational chips.
- **Link** (`{colors.link}` — `#0000ee`): the unstyled-anchor default kept for fallback inline text links — production links inherit `{colors.ink}` and rely on underline/weight rather than colour.

## Typography

### Font Family

The entire system is set in **NouvelR**, Renault''s proprietary display
family, used across navigation, headlines, body, captions, and button
labels. The family carries a slightly geometric, semi-condensed personality
with tall x-heights and squared apexes that pair naturally with the diamond
logomark.

When NouvelR cannot be licensed, suitable open-source substitutes include
**Inter Tight**, **Manrope**, or **HK Grotesk Semi Condensed** — all share
the geometric-with-warmth feel and adapt cleanly to weights 400 / 600 / 700.
Tighten `lineHeight` on display sizes to ~0.95 to match the original; do not
relax it.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 56px | 700 | 0.95 | 0 | Hero headlines, campaign titles ("E-TECH ELEKTRİKLİ", "REVOLUTION"). |
| `{typography.display-lg}` | 40px | 700 | 0.95 | 0 | Secondary section titles. |
| `{typography.display-md}` | 32px | 700 | 0.95 | 0 | Page-level H1 on sub-pages and configurator panels. |
| `{typography.heading-lg}` | 24px | 700 | 0.95 | 0 | Section headers, card titles. |
| `{typography.heading-md}` | 20px | 700 | 0.95 | 0 | Sub-section headers, prominent labels. |
| `{typography.heading-sm}` | 18px | 700 | 1.0 | 0 | Tile titles, list group headers. |
| `{typography.subtitle}` | 19.2px | 600 | 1.3 | 0 | Lead paragraphs, hero subtitles. |
| `{typography.body-lg}` | 18px | 400 | 1.5 | 0 | Long-form body. |
| `{typography.body-md}` | 16px | 400 | 1.4 | 0 | Default body and form fields. |
| `{typography.body-sm}` | 14px | 400 | 1.57 | 0 | Captions, metadata. |
| `{typography.button-lg}` | 16px | 700 | 1.0 | 0 | Large CTAs in hero bands. |
| `{typography.button-md}` | 14.4px | 700 | 1.0 | 0.144px | Default button label across the system. |
| `{typography.button-sm}` | 13px | 600 | 1.2 | 0.13px | Sub-nav pills, small in-card actions. |
| `{typography.caption}` | 12px | 400 | 1.4 | 0 | Footer disclosure, regulatory text. |
| `{typography.overline}` | 10px | 700 | 1.45 | 0 | Short uppercase labels above titles. |

### Principles
- Display sizes always weight 700, always at `lineHeight: 0.95`. The tightness is what makes the brand feel confident rather than corporate.
- Body copy stays at weight 400 — never 500. The contrast between body and display is part of the system.
- Button labels carry a tiny positive letter-spacing (`0.144px` on `{typography.button-md}`) — almost imperceptible, but it adds the small bit of mechanical precision the brand wants on CTAs.
- No italics, no script, no decorative ligatures.

### Note on Font Substitutes

NouvelR is licensed; substitutes (Inter Tight / Manrope / HK Grotesk Semi
Condensed) preserve the geometric character but typically render with
slightly looser line heights at display sizes — clamp display
`lineHeight` to 0.95 explicitly to match the source.

## Layout

### Spacing System
- **Base unit**: 4px, with the working scale built on multiples of 4 and 8.
- **Tokens**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 20px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.xxxl}` 40px · `{spacing.section}` 80px.
- Section padding (full-bleed band → next band): `{spacing.section}` (80px) on desktop, collapsing to `{spacing.xxxl}` (40px) on mobile.
- Promo-tile internal padding: `{spacing.xxl}` (32px) all sides on desktop.
- Configurator row vertical padding: `{spacing.xl}` (24px) top/bottom with hairline divider between rows.

### Grid & Container
- **Max content width** ≈ 1440px. Beyond that, content remains centred and the dark/light bands extend full-bleed.
- **Promo grid** on the homepage: a 2-column tile grid on desktop, dropping to 1-up on mobile. Each tile is square-cornered (`{rounded.none}`) with the photography or solid colour as the background.
- **Vehicle range grids**: 3 to 4 cars per row at desktop, collapsing 2-up at tablet and 1-up at small mobile.
- **Configurator** uses a fixed left visualisation pane (~60% width) with a right-hand scrolling option list (~40% width) on desktop.

### Whitespace Philosophy
- Whitespace is structural, not decorative. Sections are separated by colour-blocking (white → black) rather than soft padding ramps.
- Inside cards and configurator rows, padding is generous but never airy — the brand is mass-market, so density is acceptable.
- Hairline `{colors.hairline}` dividers on white surfaces create the sense of catalogue precision; on dark surfaces, `{colors.divider-dark}` carries the same role.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — flat | No shadow, no border | Default page surface, full-bleed bands. |
| 1 — outline | 1px solid `{colors.hairline-strong}` or `{colors.hairline}` | Promo tiles on light, vehicle cards, configurator panels. |
| 2 — colour-blocked elevation | Surface colour shift (e.g. `{colors.canvas}` card sitting inside a `{colors.surface-soft}` band) | Configurator detail cards, related-content rows. |
| 3 — dark inversion | Card swaps to `{colors.surface-dark}` against a `{colors.canvas}` band | "Ticari araç" hero promo tiles, lifestyle storytelling cards. |

Drop shadows are extracted from the system but rarely visible on the marketing
surfaces. When they appear, they are very subtle (~10% opacity, 2–4px blur)
and used on floating elements like the configurator''s sticky summary bar.

### Decorative Depth
- The R5 hero band uses an atmospheric mesh-gradient backdrop — purple-to-pink-to-yellow glow behind the car silhouette — that acts as the only true atmospheric depth in the system. Everywhere else, depth is structural (colour-blocking + outlines), not atmospheric.
- E-TECH electric powertrain pages use a luminous magenta-to-violet gradient behind cutaway diagrams, reserved for the electric sub-brand.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Tiles, vehicle cards, dividers, banner bands, full-bleed images. |
| `{rounded.xs}` | 2px | Default buttons (primary yellow, secondary black, outline). |
| `{rounded.sm}` | 3px | Tab panels, small chips. |
| `{rounded.md}` | 4px | Form labels, inline tags. |
| `{rounded.pill}` | 46px | Sub-nav pills, "yeni" / "NEW" badges, decorative carousel chips. |
| `{rounded.full}` | 9999px | Configurator colour swatches, avatar dots. |

### Photography Geometry
- Vehicle photography is **always square-cornered** (`{rounded.none}`). No rounded vehicle hero shots, no soft-edged car cards.
- Aspect ratios cluster around **16:9** (hero bands), **1:1** (square promo tiles), and **4:3** (vehicle range cards). Lifestyle imagery sometimes runs **2:1 wide** for full-bleed bands.
- Avatars and small profile cues — when present — use `{rounded.full}` circles to contrast with the otherwise square geometry.

## Components

### Buttons

**`button-primary`** — yellow CTA
- Background `{colors.primary}`, label `{colors.on-primary}`, type `{typography.button-md}`, padding `14px 24px`, `rounded: {rounded.xs}`.
- The single most important action on a page (e.g. "Hemen randevu al", "Hesapla", "Konfigüratörü başlat").
- Pressed state lives in `button-primary-pressed` (background `{colors.primary-deep}`).

**`button-secondary-dark`** — solid black CTA
- Background `{colors.surface-dark}`, label `{colors.on-dark}`, type `{typography.button-md}`, `rounded: {rounded.xs}`.
- Equal-weight secondary action paired with `{component.button-primary}`, or the primary action when used on a yellow tile background.

**`button-outline-dark`** — outlined CTA on light
- Background `{colors.canvas}`, label `{colors.ink}`, 1px solid `{colors.hairline-strong}`, type `{typography.button-md}`, `rounded: {rounded.xs}`.
- Tertiary action; appears alongside primary/secondary for "Detayları gör", "Modeller", etc.

**`button-outline-light`** — outlined CTA on dark
- Background `{colors.surface-dark}`, label `{colors.on-dark}`, 1px solid `{colors.on-dark}`, type `{typography.button-md}`, `rounded: {rounded.xs}`.
- The dark-canvas counterpart to `{component.button-outline-dark}`.

**`button-pill`** — sub-nav chip
- Background `{colors.canvas}`, label `{colors.ink}`, 1px solid `{colors.hairline-strong}`, type `{typography.button-sm}`, `rounded: {rounded.pill}`, height 36px.
- The only place the system uses a pill — for top-level filter chips ("Servis & randevu", "Sahiplik dönemi geçişi", "Kampanyalar") and configurator tab switches.

**`button-icon-square`** — small icon button
- Background `{colors.canvas}`, 1px solid `{colors.hairline-strong}`, `rounded: {rounded.xs}`, 40×40px square.
- Carousel arrows, share, language switcher.

### Cards & Containers

**`promo-tile-light`** — white promo tile
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.heading-lg}`, padding `{spacing.xxl}`, `rounded: {rounded.none}`.
- Used in the homepage 2-up grid for "Hybrid araç modelleri", "binek araç satış kampanyaları" tiles.

**`promo-tile-dark`** — black promo tile
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.heading-lg}`, padding `{spacing.xxl}`, `rounded: {rounded.none}`.
- Lifestyle / commercial-vehicle storytelling tiles ("ticari araç satış kampanyaları").

**`promo-tile-yellow`** — accent promo tile
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.heading-lg}`, padding `{spacing.xxl}`, `rounded: {rounded.none}`.
- The single "PARLAK SARI" / "Sunlight Yellow" attention tile that anchors a campaign band. Reserved — usually one per page maximum.

**`vehicle-card`** — car listing card
- Background `{colors.canvas}`, full-bleed product photography on top, text below, `rounded: {rounded.none}`, no outer border.
- Includes vehicle name (`{typography.heading-md}`), variant subtitle (`{typography.body-sm}`), and a single trailing arrow icon.

**`hero-banner`** — full-bleed hero
- Background `{colors.surface-dark}` with full-bleed photo or atmospheric gradient, content stacked left, type `{typography.display-xl}` for the title.
- "SCENIC E-TECH ELEKTRİKLİ" hero on the homepage.

### Inputs & Forms

**`text-input`** — default input
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, 1px bottom border `{colors.hairline-strong}`, `rounded: {rounded.none}`, padding `{spacing.sm} {spacing.md}`, height 48px.
- Inputs intentionally minimal — borderless on top and sides, single hairline at the bottom — keeping the catalogue feel.

### Configurator

**`configurator-row`** — option list row
- Background `{colors.canvas}`, separator hairline `{colors.hairline}` between rows, padding `{spacing.xl}` top/bottom, type `{typography.body-md}`.
- Right-side scrolling list on the configurator: "kasa tipi", "motor seçimi", "versiyon seçimi", "renk seçenekleri", etc.

**`configurator-swatch`** — circular colour pick
- Background `{colors.surface-soft}` (or the actual car colour), `rounded: {rounded.full}`, 56×56px.
- Used for paint colour selection. Active state adds a 1px solid `{colors.hairline-strong}` ring.

### Navigation

**`nav-bar`** — top nav (desktop)
- Background `{colors.canvas}`, type `{typography.button-md}`, height 60px, hairline `{colors.hairline}` bottom border.
- Left: diamond logomark. Centre: top-level nav ("Modeller", "Hizmetler", "Renault Yaşamı", "MyRenault"). Right: language switcher + login icon.

**`nav-bar`** (mobile)
- Same height 60px, collapses centre nav into a hamburger icon. Logo stays left, login stays right.

**`sub-nav-pill`** — pill-style sub-nav
- Pill chips set in a horizontal scroll bar between hero and content body (e.g. "Servis & randevu", "Sahiplik dönemi geçişi", "Kampanyalar"), `{component.button-pill}` styling.

### Signature Components

**`badge-new`** — "yeni" badge
- Background `{colors.primary}`, label `{colors.on-primary}`, type `{typography.button-md}`, `rounded: {rounded.full}`, padding `6px 14px`.
- Anchored on the bottom-left of new vehicle cards.

**`footer`** — global footer
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.body-sm}`, padding `64px 24px`.
- Three-column legal/quick-links/locale grid above a single-line copyright row separated by `{colors.divider-dark}`.

## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` exclusively for primary CTAs, "yeni"/"NEW" badges, and at most one accent promo tile per band — `{component.promo-tile-yellow}` is intentionally rare.
- Pair `{colors.primary}` only with `{colors.on-primary}` text. Yellow + white is forbidden.
- Set everything in **NouvelR** — no secondary serif, no script, no decorative italic.
- Hold display headlines at `{typography.display-xl}` weight 700 with `lineHeight: 0.95` so they stack tightly on multi-line wraps.
- Use `{rounded.xs}` (2px) on every standard button — the near-flat corner is part of the brand.
- Switch full bands between `{colors.canvas}` and `{colors.surface-dark}` for storytelling rhythm. Avoid mid-greys as section backgrounds.
- Show vehicle photography full-bleed inside `{component.vehicle-card}` with copy stacked beneath, never overlaid.
- Use `{component.sub-nav-pill}` (`{rounded.pill}`) only for sub-nav and small filter rows — never for primary CTAs.

### Don''t
- Don''t introduce a secondary accent colour. Yellow is the only brand accent; semantic colours (`{colors.error}`, `{colors.success}`, `{colors.warning}`) are functional, not decorative.
- Don''t round vehicle cards or promo tiles. Square-cornered photography is core to the brand expression.
- Don''t soften body weights to 500 or 600 — the system relies on the 400 / 700 contrast.
- Don''t apply `{colors.primary}` to body text or large surfaces beyond the single accent tile per band.
- Don''t add atmospheric gradient washes outside the dedicated R5 / E-TECH hero contexts.
- Don''t pair light grey text on white. Body text steps through `{colors.body}`, `{colors.charcoal}`, `{colors.mute}` — `{colors.ash}` and `{colors.stone}` are reserved for placeholders and disabled states.
- Don''t add drop shadows to vehicle cards or promo tiles — the system is shadow-free at the catalogue level.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop XL | ≥ 1440px | Full max-width container, 3–4 column vehicle grid, 2-up promo tile grid. |
| Desktop | 1280–1439px | Same layout, container shrinks to viewport with `{spacing.xl}` side padding. |
| Tablet Large | 1024–1279px | Vehicle grid drops to 3-up, configurator left/right panes resize to 55/45. |
| Tablet | 768–1023px | Promo tile grid collapses to 2-up, sub-nav pills become horizontal scroll. |
| Mobile Large | 426–767px | Vehicle grid 2-up, configurator switches to stacked panes (visualisation on top, options below), nav collapses to hamburger. |
| Mobile | ≤ 425px | All grids 1-up, hero `{typography.display-xl}` clamps to ~40px, section padding `{spacing.section}` collapses to `{spacing.xxxl}`. |

### Touch Targets
- All buttons ship at minimum 44×44px on mobile; default `{component.button-primary}` is 48px tall, comfortably exceeding WCAG AAA.
- `{component.sub-nav-pill}` (36px) is bumped to 40px tall on mobile via increased vertical padding.
- `{component.button-icon-square}` (40px) sits at the WCAG AA minimum and remains tappable, but should grow to 44px when used as a primary navigation control.

### Collapsing Strategy
- Top-level nav collapses to hamburger at < 1024px; the logo and login icon stay anchored.
- 2-up promo grid collapses to 1-up at < 768px; tile padding shrinks from `{spacing.xxl}` to `{spacing.lg}`.
- Configurator switches from side-by-side to stacked at < 1024px, with the visualisation pinned to the top of the viewport on scroll.
- Display headlines clamp: `{typography.display-xl}` 56px → 40px → 32px across the breakpoint ladder.
- Sub-nav pills convert from a wrap row to a horizontal scroll-rail at < 768px.

### Image Behavior
- Vehicle photography is served at 1.5× and 2× DPR; below 768px, the system swaps to a portrait-oriented composition where art direction allows.
- Hero atmospheric gradients (R5, E-TECH) load lazily after primary content; they are not blocking.
- Lifestyle / commercial photography in `{component.promo-tile-dark}` keeps the same 16:9 framing across breakpoints, cropping inward rather than letterboxing.

## Iteration Guide

1. Focus on ONE component at a time. Most components share `{rounded.xs}`, `{colors.canvas}` / `{colors.surface-dark}`, and NouvelR — only the role-specific tokens (`{colors.primary}`, `{component.promo-tile-yellow}`) shift between variants.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.pill}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits; the orphaned-tokens warning will catch unused entries before they ship.
4. Add new variants as separate entries (`-pressed`, `-disabled`, `-outline`) — do not bury them in prose.
5. Default body type to `{typography.body-md}`; reach for `{typography.subtitle}` only on hero subtitles and lead paragraphs.
6. Keep `{colors.primary}` scarce — if more than one yellow element appears per viewport, ask whether one of them should drop to `{colors.surface-dark}` or `{colors.canvas}` instead.

## Known Gaps

- Active/pressed visual states are not consistently observable in static surfaces; `button-primary-pressed` documents the extracted darkened-yellow value, but no other component has a pressed variant promoted to the YAML.
- Drop-shadow values exist in the extracted tokens but are rarely surfaced visually; only the configurator''s sticky summary bar uses them on the captured pages.
- The MyRenault application surfaces (logged-in product) are out of scope for this extraction — only the public marketing canvas is documented.
- Form-field focus styling is not extracted; the system likely relies on a thicker bottom border at `{colors.ink}`, but this is not visually confirmed on the captured pages.
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

Renault''s Turkish marketing surfaces are unapologetically high-contrast: a
white canvas for browsing, a black canvas for product storytelling, and a
single Sunlight Yellow accent (`{colors.primary}` — `#ffed00`) reserved for
the most consequential actions. The brand''s modernised flat diamond logo sets
the tone — geometric, confident, slightly industrial — and the system follows
suit. Square corners dominate, hairline borders are rare, and elevation is
expressed through colour blocking rather than shadow.

The typography is monolithic. Every text on the site is set in **NouvelR**,
Renault''s bespoke display family, with a strong preference for weight 700 at
display sizes (with a tight `lineHeight: 0.95`) and weight 400 for body. There
is no secondary serif, no decorative italic, no script — the discipline is
the signature.

Page rhythm cycles between three surface modes: a **white catalogue mode** for
listings and configurators (`{colors.canvas}` with hairline-thin
`{colors.hairline}` dividers), a **black storytelling mode** for hero
sections, lifestyle imagery, and the lower half of campaign pages, and brief
**yellow accent moments** (`{colors.primary}` tiles, "NEW" badges, R5-coded
yellow paint shots) that punctuate the otherwise neutral palette.

**Key Characteristics:**
- Two-tone canvas system — `{colors.canvas}` (white) for browsing, `{colors.surface-dark}` (black) for storytelling — switched in full-bleed bands rather than subtle gradations.
- A single brand accent — `{colors.primary}` Sunlight Yellow — used scarcely on primary CTAs, "NEW" badges, R5 hero photography, and configurator dot indicators.
- **NouvelR everywhere**, with `{typography.display-xl}` headlines at 56px / weight 700 / `lineHeight: 0.95` so condensed multi-line headlines stack cleanly.
- Square geometry: `{rounded.xs}` (2px) on buttons, `{rounded.none}` on tiles and product cards, `{rounded.pill}` reserved exclusively for sub-nav chips and decorative badges.
- Photography-first product tiles — vehicle photos full-bleed inside otherwise neutral cards, with copy stacked beneath rather than overlaid.
- Page-level rhythm cycles white → black → yellow accent → black, with the wordmark and footer always closing on `{colors.surface-dark}`.', '{"sourcePath":"docs/design-md/renault/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Sunlight Yellow** (`{colors.primary}` — `#ffed00`): the brand accent. Reserved for primary CTAs, "NEW" / "yeni" badges, configurator dot indicators, and full-bleed promotional tiles. Never decorative.
- **Sunlight Yellow Pressed** (`{colors.primary-deep}` — `#e6d200`): the active/pressed state of `{colors.primary}` buttons and tiles.
- **On-Primary** (`{colors.on-primary}` — `#000000`): label colour on top of `{colors.primary}` surfaces. Yellow always pairs with black text — never white.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): the default page background and card surface.
- **Surface Soft** (`{colors.surface-soft}` — `#f7f7f7`): subtle elevation step for grouped configurator rows and inactive form fields.
- **Surface Dark** (`{colors.surface-dark}` — `#000000`): the alternate canvas, used for hero bands, footer, and full-bleed storytelling sections.
- **Surface Deep** (`{colors.surface-deep}` — `#111111`): a one-step-up elevation inside `{colors.surface-dark}` regions for inset cards and form panels.
- **Hairline** (`{colors.hairline}` — `#f2f2f2`): the soft 1px divider between rows on white surfaces.
- **Hairline Strong** (`{colors.hairline-strong}` — `#000000`): full-strength dividers on white, plus all card / button outlines.
- **Divider Dark** (`{colors.divider-dark}` — `rgba(255,255,255,0.16)`): the corresponding low-contrast divider used inside `{colors.surface-dark}` regions.

### Text
- **Ink** (`{colors.ink}` — `#000000`): primary text colour on white surfaces. The same value also drives logos, icons, and outline borders — black is structural, not decorative.
- **Body** (`{colors.body}` — `#222222`): secondary body text where pure black would feel too heavy in long paragraphs.
- **Charcoal** (`{colors.charcoal}` — `#333333`): captions, metadata, and small labels.
- **Mute** (`{colors.mute}` — `#666666`): supporting text and inactive nav labels.
- **Ash** (`{colors.ash}` — `#8a8a8a`): placeholder text, disabled labels.
- **Stone** (`{colors.stone}` — `#c4c4c4`): disabled-state foreground.
- **On-Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.surface-dark}` surfaces.
- **On-Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.72)`): secondary text in dark regions; preserves the brand''s high-contrast feel without resorting to mid-grey.

### Semantic
- **Error** (`{colors.error}` — `#be6464`): muted desaturated red used for inline form errors. Notably warmer than typical pure-red error states.
- **Warning** (`{colors.warning}` — `#f0ad4e`): amber alert.
- **Success** (`{colors.success}` — `#8dc572`): muted green confirmation.
- **Info** (`{colors.info}` — `#337ab7`): a desaturated mid-blue used in informational chips.
- **Link** (`{colors.link}` — `#0000ee`): the unstyled-anchor default kept for fallback inline text links — production links inherit `{colors.ink}` and rely on underline/weight rather than colour.', '{"sourcePath":"docs/design-md/renault/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

The entire system is set in **NouvelR**, Renault''s proprietary display
family, used across navigation, headlines, body, captions, and button
labels. The family carries a slightly geometric, semi-condensed personality
with tall x-heights and squared apexes that pair naturally with the diamond
logomark.

When NouvelR cannot be licensed, suitable open-source substitutes include
**Inter Tight**, **Manrope**, or **HK Grotesk Semi Condensed** — all share
the geometric-with-warmth feel and adapt cleanly to weights 400 / 600 / 700.
Tighten `lineHeight` on display sizes to ~0.95 to match the original; do not
relax it.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 56px | 700 | 0.95 | 0 | Hero headlines, campaign titles ("E-TECH ELEKTRİKLİ", "REVOLUTION"). |
| `{typography.display-lg}` | 40px | 700 | 0.95 | 0 | Secondary section titles. |
| `{typography.display-md}` | 32px | 700 | 0.95 | 0 | Page-level H1 on sub-pages and configurator panels. |
| `{typography.heading-lg}` | 24px | 700 | 0.95 | 0 | Section headers, card titles. |
| `{typography.heading-md}` | 20px | 700 | 0.95 | 0 | Sub-section headers, prominent labels. |
| `{typography.heading-sm}` | 18px | 700 | 1.0 | 0 | Tile titles, list group headers. |
| `{typography.subtitle}` | 19.2px | 600 | 1.3 | 0 | Lead paragraphs, hero subtitles. |
| `{typography.body-lg}` | 18px | 400 | 1.5 | 0 | Long-form body. |
| `{typography.body-md}` | 16px | 400 | 1.4 | 0 | Default body and form fields. |
| `{typography.body-sm}` | 14px | 400 | 1.57 | 0 | Captions, metadata. |
| `{typography.button-lg}` | 16px | 700 | 1.0 | 0 | Large CTAs in hero bands. |
| `{typography.button-md}` | 14.4px | 700 | 1.0 | 0.144px | Default button label across the system. |
| `{typography.button-sm}` | 13px | 600 | 1.2 | 0.13px | Sub-nav pills, small in-card actions. |
| `{typography.caption}` | 12px | 400 | 1.4 | 0 | Footer disclosure, regulatory text. |
| `{typography.overline}` | 10px | 700 | 1.45 | 0 | Short uppercase labels above titles. |

### Principles
- Display sizes always weight 700, always at `lineHeight: 0.95`. The tightness is what makes the brand feel confident rather than corporate.
- Body copy stays at weight 400 — never 500. The contrast between body and display is part of the system.
- Button labels carry a tiny positive letter-spacing (`0.144px` on `{typography.button-md}`) — almost imperceptible, but it adds the small bit of mechanical precision the brand wants on CTAs.
- No italics, no script, no decorative ligatures.

### Note on Font Substitutes

NouvelR is licensed; substitutes (Inter Tight / Manrope / HK Grotesk Semi
Condensed) preserve the geometric character but typically render with
slightly looser line heights at display sizes — clamp display
`lineHeight` to 0.95 explicitly to match the source.', '{"sourcePath":"docs/design-md/renault/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4px, with the working scale built on multiples of 4 and 8.
- **Tokens**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 20px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.xxxl}` 40px · `{spacing.section}` 80px.
- Section padding (full-bleed band → next band): `{spacing.section}` (80px) on desktop, collapsing to `{spacing.xxxl}` (40px) on mobile.
- Promo-tile internal padding: `{spacing.xxl}` (32px) all sides on desktop.
- Configurator row vertical padding: `{spacing.xl}` (24px) top/bottom with hairline divider between rows.

### Grid & Container
- **Max content width** ≈ 1440px. Beyond that, content remains centred and the dark/light bands extend full-bleed.
- **Promo grid** on the homepage: a 2-column tile grid on desktop, dropping to 1-up on mobile. Each tile is square-cornered (`{rounded.none}`) with the photography or solid colour as the background.
- **Vehicle range grids**: 3 to 4 cars per row at desktop, collapsing 2-up at tablet and 1-up at small mobile.
- **Configurator** uses a fixed left visualisation pane (~60% width) with a right-hand scrolling option list (~40% width) on desktop.

### Whitespace Philosophy
- Whitespace is structural, not decorative. Sections are separated by colour-blocking (white → black) rather than soft padding ramps.
- Inside cards and configurator rows, padding is generous but never airy — the brand is mass-market, so density is acceptable.
- Hairline `{colors.hairline}` dividers on white surfaces create the sense of catalogue precision; on dark surfaces, `{colors.divider-dark}` carries the same role.', '{"sourcePath":"docs/design-md/renault/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — flat | No shadow, no border | Default page surface, full-bleed bands. |
| 1 — outline | 1px solid `{colors.hairline-strong}` or `{colors.hairline}` | Promo tiles on light, vehicle cards, configurator panels. |
| 2 — colour-blocked elevation | Surface colour shift (e.g. `{colors.canvas}` card sitting inside a `{colors.surface-soft}` band) | Configurator detail cards, related-content rows. |
| 3 — dark inversion | Card swaps to `{colors.surface-dark}` against a `{colors.canvas}` band | "Ticari araç" hero promo tiles, lifestyle storytelling cards. |

Drop shadows are extracted from the system but rarely visible on the marketing
surfaces. When they appear, they are very subtle (~10% opacity, 2–4px blur)
and used on floating elements like the configurator''s sticky summary bar.

### Decorative Depth
- The R5 hero band uses an atmospheric mesh-gradient backdrop — purple-to-pink-to-yellow glow behind the car silhouette — that acts as the only true atmospheric depth in the system. Everywhere else, depth is structural (colour-blocking + outlines), not atmospheric.
- E-TECH electric powertrain pages use a luminous magenta-to-violet gradient behind cutaway diagrams, reserved for the electric sub-brand.', '{"sourcePath":"docs/design-md/renault/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Tiles, vehicle cards, dividers, banner bands, full-bleed images. |
| `{rounded.xs}` | 2px | Default buttons (primary yellow, secondary black, outline). |
| `{rounded.sm}` | 3px | Tab panels, small chips. |
| `{rounded.md}` | 4px | Form labels, inline tags. |
| `{rounded.pill}` | 46px | Sub-nav pills, "yeni" / "NEW" badges, decorative carousel chips. |
| `{rounded.full}` | 9999px | Configurator colour swatches, avatar dots. |

### Photography Geometry
- Vehicle photography is **always square-cornered** (`{rounded.none}`). No rounded vehicle hero shots, no soft-edged car cards.
- Aspect ratios cluster around **16:9** (hero bands), **1:1** (square promo tiles), and **4:3** (vehicle range cards). Lifestyle imagery sometimes runs **2:1 wide** for full-bleed bands.
- Avatars and small profile cues — when present — use `{rounded.full}` circles to contrast with the otherwise square geometry.', '{"sourcePath":"docs/design-md/renault/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — yellow CTA
- Background `{colors.primary}`, label `{colors.on-primary}`, type `{typography.button-md}`, padding `14px 24px`, `rounded: {rounded.xs}`.
- The single most important action on a page (e.g. "Hemen randevu al", "Hesapla", "Konfigüratörü başlat").
- Pressed state lives in `button-primary-pressed` (background `{colors.primary-deep}`).

**`button-secondary-dark`** — solid black CTA
- Background `{colors.surface-dark}`, label `{colors.on-dark}`, type `{typography.button-md}`, `rounded: {rounded.xs}`.
- Equal-weight secondary action paired with `{component.button-primary}`, or the primary action when used on a yellow tile background.

**`button-outline-dark`** — outlined CTA on light
- Background `{colors.canvas}`, label `{colors.ink}`, 1px solid `{colors.hairline-strong}`, type `{typography.button-md}`, `rounded: {rounded.xs}`.
- Tertiary action; appears alongside primary/secondary for "Detayları gör", "Modeller", etc.

**`button-outline-light`** — outlined CTA on dark
- Background `{colors.surface-dark}`, label `{colors.on-dark}`, 1px solid `{colors.on-dark}`, type `{typography.button-md}`, `rounded: {rounded.xs}`.
- The dark-canvas counterpart to `{component.button-outline-dark}`.

**`button-pill`** — sub-nav chip
- Background `{colors.canvas}`, label `{colors.ink}`, 1px solid `{colors.hairline-strong}`, type `{typography.button-sm}`, `rounded: {rounded.pill}`, height 36px.
- The only place the system uses a pill — for top-level filter chips ("Servis & randevu", "Sahiplik dönemi geçişi", "Kampanyalar") and configurator tab switches.

**`button-icon-square`** — small icon button
- Background `{colors.canvas}`, 1px solid `{colors.hairline-strong}`, `rounded: {rounded.xs}`, 40×40px square.
- Carousel arrows, share, language switcher.

### Cards & Containers

**`promo-tile-light`** — white promo tile
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.heading-lg}`, padding `{spacing.xxl}`, `rounded: {rounded.none}`.
- Used in the homepage 2-up grid for "Hybrid araç modelleri", "binek araç satış kampanyaları" tiles.

**`promo-tile-dark`** — black promo tile
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.heading-lg}`, padding `{spacing.xxl}`, `rounded: {rounded.none}`.
- Lifestyle / commercial-vehicle storytelling tiles ("ticari araç satış kampanyaları").

**`promo-tile-yellow`** — accent promo tile
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.heading-lg}`, padding `{spacing.xxl}`, `rounded: {rounded.none}`.
- The single "PARLAK SARI" / "Sunlight Yellow" attention tile that anchors a campaign band. Reserved — usually one per page maximum.

**`vehicle-card`** — car listing card
- Background `{colors.canvas}`, full-bleed product photography on top, text below, `rounded: {rounded.none}`, no outer border.
- Includes vehicle name (`{typography.heading-md}`), variant subtitle (`{typography.body-sm}`), and a single trailing arrow icon.

**`hero-banner`** — full-bleed hero
- Background `{colors.surface-dark}` with full-bleed photo or atmospheric gradient, content stacked left, type `{typography.display-xl}` for the title.
- "SCENIC E-TECH ELEKTRİKLİ" hero on the homepage.

### Inputs & Forms

**`text-input`** — default input
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, 1px bottom border `{colors.hairline-strong}`, `rounded: {rounded.none}`, padding `{spacing.sm} {spacing.md}`, height 48px.
- Inputs intentionally minimal — borderless on top and sides, single hairline at the bottom — keeping the catalogue feel.

### Configurator

**`configurator-row`** — option list row
- Background `{colors.canvas}`, separator hairline `{colors.hairline}` between rows, padding `{spacing.xl}` top/bottom, type `{typography.body-md}`.
- Right-side scrolling list on the configurator: "kasa tipi", "motor seçimi", "versiyon seçimi", "renk seçenekleri", etc.

**`configurator-swatch`** — circular colour pick
- Background `{colors.surface-soft}` (or the actual car colour), `rounded: {rounded.full}`, 56×56px.
- Used for paint colour selection. Active state adds a 1px solid `{colors.hairline-strong}` ring.

### Navigation

**`nav-bar`** — top nav (desktop)
- Background `{colors.canvas}`, type `{typography.button-md}`, height 60px, hairline `{colors.hairline}` bottom border.
- Left: diamond logomark. Centre: top-level nav ("Modeller", "Hizmetler", "Renault Yaşamı", "MyRenault"). Right: language switcher + login icon.

**`nav-bar`** (mobile)
- Same height 60px, collapses centre nav into a hamburger icon. Logo stays left, login stays right.

**`sub-nav-pill`** — pill-style sub-nav
- Pill chips set in a horizontal scroll bar between hero and content body (e.g. "Servis & randevu", "Sahiplik dönemi geçişi", "Kampanyalar"), `{component.button-pill}` styling.

### Signature Components

**`badge-new`** — "yeni" badge
- Background `{colors.primary}`, label `{colors.on-primary}`, type `{typography.button-md}`, `rounded: {rounded.full}`, padding `6px 14px`.
- Anchored on the bottom-left of new vehicle cards.

**`footer`** — global footer
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.body-sm}`, padding `64px 24px`.
- Three-column legal/quick-links/locale grid above a single-line copyright row separated by `{colors.divider-dark}`.', '{"sourcePath":"docs/design-md/renault/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Reserve `{colors.primary}` exclusively for primary CTAs, "yeni"/"NEW" badges, and at most one accent promo tile per band — `{component.promo-tile-yellow}` is intentionally rare.
- Pair `{colors.primary}` only with `{colors.on-primary}` text. Yellow + white is forbidden.
- Set everything in **NouvelR** — no secondary serif, no script, no decorative italic.
- Hold display headlines at `{typography.display-xl}` weight 700 with `lineHeight: 0.95` so they stack tightly on multi-line wraps.
- Use `{rounded.xs}` (2px) on every standard button — the near-flat corner is part of the brand.
- Switch full bands between `{colors.canvas}` and `{colors.surface-dark}` for storytelling rhythm. Avoid mid-greys as section backgrounds.
- Show vehicle photography full-bleed inside `{component.vehicle-card}` with copy stacked beneath, never overlaid.
- Use `{component.sub-nav-pill}` (`{rounded.pill}`) only for sub-nav and small filter rows — never for primary CTAs.

### Don''t
- Don''t introduce a secondary accent colour. Yellow is the only brand accent; semantic colours (`{colors.error}`, `{colors.success}`, `{colors.warning}`) are functional, not decorative.
- Don''t round vehicle cards or promo tiles. Square-cornered photography is core to the brand expression.
- Don''t soften body weights to 500 or 600 — the system relies on the 400 / 700 contrast.
- Don''t apply `{colors.primary}` to body text or large surfaces beyond the single accent tile per band.
- Don''t add atmospheric gradient washes outside the dedicated R5 / E-TECH hero contexts.
- Don''t pair light grey text on white. Body text steps through `{colors.body}`, `{colors.charcoal}`, `{colors.mute}` — `{colors.ash}` and `{colors.stone}` are reserved for placeholders and disabled states.
- Don''t add drop shadows to vehicle cards or promo tiles — the system is shadow-free at the catalogue level.', '{"sourcePath":"docs/design-md/renault/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop XL | ≥ 1440px | Full max-width container, 3–4 column vehicle grid, 2-up promo tile grid. |
| Desktop | 1280–1439px | Same layout, container shrinks to viewport with `{spacing.xl}` side padding. |
| Tablet Large | 1024–1279px | Vehicle grid drops to 3-up, configurator left/right panes resize to 55/45. |
| Tablet | 768–1023px | Promo tile grid collapses to 2-up, sub-nav pills become horizontal scroll. |
| Mobile Large | 426–767px | Vehicle grid 2-up, configurator switches to stacked panes (visualisation on top, options below), nav collapses to hamburger. |
| Mobile | ≤ 425px | All grids 1-up, hero `{typography.display-xl}` clamps to ~40px, section padding `{spacing.section}` collapses to `{spacing.xxxl}`. |

### Touch Targets
- All buttons ship at minimum 44×44px on mobile; default `{component.button-primary}` is 48px tall, comfortably exceeding WCAG AAA.
- `{component.sub-nav-pill}` (36px) is bumped to 40px tall on mobile via increased vertical padding.
- `{component.button-icon-square}` (40px) sits at the WCAG AA minimum and remains tappable, but should grow to 44px when used as a primary navigation control.

### Collapsing Strategy
- Top-level nav collapses to hamburger at < 1024px; the logo and login icon stay anchored.
- 2-up promo grid collapses to 1-up at < 768px; tile padding shrinks from `{spacing.xxl}` to `{spacing.lg}`.
- Configurator switches from side-by-side to stacked at < 1024px, with the visualisation pinned to the top of the viewport on scroll.
- Display headlines clamp: `{typography.display-xl}` 56px → 40px → 32px across the breakpoint ladder.
- Sub-nav pills convert from a wrap row to a horizontal scroll-rail at < 768px.

### Image Behavior
- Vehicle photography is served at 1.5× and 2× DPR; below 768px, the system swaps to a portrait-oriented composition where art direction allows.
- Hero atmospheric gradients (R5, E-TECH) load lazily after primary content; they are not blocking.
- Lifestyle / commercial photography in `{component.promo-tile-dark}` keeps the same 16:9 framing across breakpoints, cropping inward rather than letterboxing.', '{"sourcePath":"docs/design-md/renault/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Most components share `{rounded.xs}`, `{colors.canvas}` / `{colors.surface-dark}`, and NouvelR — only the role-specific tokens (`{colors.primary}`, `{component.promo-tile-yellow}`) shift between variants.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.pill}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits; the orphaned-tokens warning will catch unused entries before they ship.
4. Add new variants as separate entries (`-pressed`, `-disabled`, `-outline`) — do not bury them in prose.
5. Default body type to `{typography.body-md}`; reach for `{typography.subtitle}` only on hero subtitles and lead paragraphs.
6. Keep `{colors.primary}` scarce — if more than one yellow element appears per viewport, ask whether one of them should drop to `{colors.surface-dark}` or `{colors.canvas}` instead.', '{"sourcePath":"docs/design-md/renault/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Active/pressed visual states are not consistently observable in static surfaces; `button-primary-pressed` documents the extracted darkened-yellow value, but no other component has a pressed variant promoted to the YAML.
- Drop-shadow values exist in the extracted tokens but are rarely surfaced visually; only the configurator''s sticky summary bar uses them on the captured pages.
- The MyRenault application surfaces (logged-in product) are out of scope for this extraction — only the public marketing canvas is documented.
- Form-field focus styling is not extracted; the system likely relies on a thicker bottom border at `{colors.ink}`, but this is not visually confirmed on the captured pages.', '{"sourcePath":"docs/design-md/renault/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_1', '#ffed00', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_2', '#e6d200', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_3', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_4', '#222222', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_5', '#333333', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_6', '#666666', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_7', '#8a8a8a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_8', '#c4c4c4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_9', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_10', '#f7f7f7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_11', '#111111', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_12', '#f2f2f2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_13', '#0000ee', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_14', '#be6464', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_15', '#f0ad4e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_16', '#8dc572', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md'), 'color', 'color_17', '#337ab7', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/renault/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/renault/DESIGN.md';


-- Replicate
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Replicate', 'replicate', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/replicate/DESIGN.md', null, 'seeded', '---
version: alpha
name: Replicate-design-analysis
description: |
  Replicate''s marketing surfaces pair the warm-cream developer-tools aesthetic
  of an indie ML playground with a confident hot-orange brand accent and a
  signature display typeface (rb-freigeist-neue) sized aggressively large at
  72px+. The system reads as "AI lab notebook crossed with print magazine":
  cream and bone surfaces, dark ink type, monospace code wells, irregular
  hand-drawn-feeling diagrams, and a rich orange used scarcely on the most
  consequential CTA. Photography of contributors and example outputs is
  square-ish with mid-radius corners; everything else is borderless or hairline.

colors:
  primary: "#ea2804"
  primary-deep: "#c01f00"
  on-primary: "#ffffff"
  ink: "#202020"
  body: "#3a3a3a"
  charcoal: "#575757"
  mute: "#646464"
  ash: "#8d8d8d"
  stone: "#bbbbbb"
  on-dark: "#fcfcfc"
  on-dark-mute: "rgba(252,252,252,0.72)"
  canvas: "#f9f7f3"
  surface-bone: "#f3f0e8"
  surface-card: "#ffffff"
  surface-dark: "#202020"
  surface-deep: "#000000"
  hairline: "rgba(32,32,32,0.12)"
  hairline-strong: "#202020"
  divider-dark: "rgba(255,255,255,0.2)"
  hero-warm: "#ea2804"
  hero-glow: "#ff6a3d"
  hero-pink: "#f4a8a0"
  badge-success: "#2b9a66"
  link: "#ea2804"
  ring-focus: "rgba(59,130,246,0.5)"
  github-dark: "#24292e"

typography:
  display-xxl:
    fontFamily: rb-freigeist-neue
    fontSize: 128px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -3px
  display-xl:
    fontFamily: rb-freigeist-neue
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -1.8px
  display-lg:
    fontFamily: rb-freigeist-neue
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -1px
  display-md:
    fontFamily: rb-freigeist-neue
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.5px
  heading-lg:
    fontFamily: basier-square
    fontSize: 38.4px
    fontWeight: 600
    lineHeight: 0.83
    letterSpacing: -0.5px
  heading-md:
    fontFamily: basier-square
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: -0.35px
  heading-sm:
    fontFamily: basier-square
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.3px
  subtitle:
    fontFamily: rb-freigeist-neue
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.56
    letterSpacing: 0
  body-lg:
    fontFamily: basier-square
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.56
    letterSpacing: 0
  body-md:
    fontFamily: basier-square
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: basier-square
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  button-md:
    fontFamily: basier-square
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0
  button-sm:
    fontFamily: basier-square
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0
  caption:
    fontFamily: basier-square
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0
  caption-tight:
    fontFamily: basier-square
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.43
    letterSpacing: -0.35px
  code-md:
    fontFamily: jetbrains-mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  code-sm:
    fontFamily: jetbrains-mono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 10px
  lg: 16px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  xxxl: 48px
  section: 96px
  band: 160px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 12px 24px
    height: 44px
  button-primary-pressed:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
  button-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 12px 24px
    height: 44px
  button-outline:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 11px 23px
    height: 44px
  button-ghost:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 16px
    height: 36px
  button-icon:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 36px
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 12px 20px
    height: 44px
  hero-band:
    backgroundColor: "{colors.hero-warm}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xl}"
    rounded: "{rounded.none}"
    padding: 96px 32px
  model-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
  collection-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-md}"
    rounded: "{rounded.md}"
    padding: 24px
  pricing-tier:
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
  code-block:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code-md}"
    rounded: "{rounded.md}"
    padding: 24px
  code-tab:
    backgroundColor: "{colors.surface-deep}"
    textColor: "{colors.on-dark-mute}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.xs}"
    padding: 6px 12px
  badge-status:
    backgroundColor: "{colors.badge-success}"
    textColor: "{colors.on-dark}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  badge-tag:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.none}"
    height: 60px
  sub-nav-pill:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 6px 14px
  contributor-avatar:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 40px
  footer:
    backgroundColor: "{colors.surface-deep}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 64px 32px
---

## Overview

Replicate is a developer-tools platform with the soul of an art zine. The
public marketing surfaces sit on a warm cream canvas (`{colors.canvas}` —
`#f9f7f3`) rather than the white-or-near-black default of typical AI
infrastructure sites, and that single decision colours everything else:
photography reads as editorial, code wells read as printed pull-quotes, and
the brand orange (`{colors.primary}` — `#ea2804`) feels like a stamp rather
than a notification.

The typography is the load-bearing decoration. **rb-freigeist-neue** — a
heavy, slightly condensed grotesque — appears at sizes up to 128px in hero
bands, with a tight `lineHeight: 1.0` and negative letter-spacing that lets
multi-line headlines pack into geometric blocks. The companion family,
**basier-square**, takes care of body, button labels, and metadata in the
14–18px range. **JetBrains Mono** carries every code well, command, and
example. Three families, three jobs, no overlap.

Page rhythm cycles between a default cream canvas, a bold full-bleed orange
hero band, and a `{colors.surface-dark}` (`#202020`) section that hosts the
code stories — the "how it works" walkthrough. Curves are intentional and
soft: every interactive surface (buttons, inputs, tags, avatars) uses
`{rounded.full}`, while content cards and code wells step up to `{rounded.md}`
or `{rounded.lg}`. There are no sharp corners on Replicate; the system reads
as friendly precision.

**Key Characteristics:**
- A warm cream canvas (`{colors.canvas}` — `#f9f7f3`) replaces the typical white background, paired with `{colors.surface-bone}` for inset cards.
- Hot orange (`{colors.primary}` — `#ea2804`) is reserved for the primary CTA, the hero band, and inline link colour. Never decorative.
- Display headlines run massive — `{typography.display-xxl}` at 128px in hero bands and `{typography.display-xl}` at 72px on section openers — with tight `lineHeight: 1.0` and negative letter-spacing.
- Three-family typography stack: `rb-freigeist-neue` for display, `basier-square` for UI/body, `jetbrains-mono` for code.
- Every interactive element is fully rounded (`{rounded.full}` 9999px) — buttons, inputs, badges, avatars — while content cards step to `{rounded.md}` 10px.
- Dark code wells (`{colors.surface-dark}` background) sit inside the cream canvas as full-bleed reading surfaces, mimicking print pull-quotes.
- Section rhythm: cream → orange hero → cream → dark code-story band → cream → black footer.

## Colors

### Brand & Accent
- **Replicate Orange** (`{colors.primary}` — `#ea2804`): the brand accent. Reserved for the primary CTA, hero band background, and inline link colour. Treat as a stamp — one orange element per viewport at most.
- **Orange Pressed** (`{colors.primary-deep}` — `#c01f00`): the active/pressed state of `{colors.primary}` — used on `{component.button-primary-pressed}`.
- **Hero Glow** (`{colors.hero-glow}` — `#ff6a3d`): the lighter orange that appears in the radial atmospheric mesh behind the hero copy.
- **Hero Pink** (`{colors.hero-pink}` — `#f4a8a0`): a warm pink wash that softens the bottom edge of the hero band before it transitions to cream.
- **On-Primary** (`{colors.on-primary}` — `#ffffff`): label colour on top of `{colors.primary}` surfaces.

### Surface
- **Canvas** (`{colors.canvas}` — `#f9f7f3`): the default page background. Warm cream, never pure white.
- **Surface Bone** (`{colors.surface-bone}` — `#f3f0e8`): a half-step deeper cream used for inset card groups and feature bands.
- **Surface Card** (`{colors.surface-card}` — `#ffffff`): pure white for individual model cards, search inputs, and pricing tiers — the only place white appears.
- **Surface Dark** (`{colors.surface-dark}` — `#202020`): code wells, featured pricing tier, and the "how it works" walkthrough band.
- **Surface Deep** (`{colors.surface-deep}` — `#000000`): footer canvas and the inset code-tab strip inside `{component.code-block}`.
- **Hairline** (`{colors.hairline}` — `rgba(32,32,32,0.12)`): low-contrast 1px dividers on cream surfaces.
- **Hairline Strong** (`{colors.hairline-strong}` — `#202020`): button outlines, focused inputs, and structural separators.

### Text
- **Ink** (`{colors.ink}` — `#202020`): primary text colour. Notably warmer than `#000000`, matching the cream canvas.
- **Body** (`{colors.body}` — `#3a3a3a`): long-form body copy where ink would feel too heavy at 18px+ line lengths.
- **Charcoal** (`{colors.charcoal}` — `#575757`): captions, metadata, secondary nav.
- **Mute** (`{colors.mute}` — `#646464`): supporting text and inactive labels.
- **Ash** (`{colors.ash}` — `#8d8d8d`): tertiary text, placeholder copy.
- **Stone** (`{colors.stone}` — `#bbbbbb`): disabled foreground, neutral icon outlines.
- **On-Dark** (`{colors.on-dark}` — `#fcfcfc`): primary text on `{colors.surface-dark}` and `{colors.surface-deep}`.
- **On-Dark Mute** (`{colors.on-dark-mute}` — `rgba(252,252,252,0.72)`): secondary text in dark regions; preserves the off-white feel without pure white pop.

### Semantic
- **Success** (`{colors.badge-success}` — `#2b9a66`): inline success badges and "running" status pills on model cards.
- **Link** (`{colors.link}` — `#ea2804`): inline link colour — same as primary orange, intentionally pulling links into the brand accent.
- **Focus Ring** (`{colors.ring-focus}` — `rgba(59,130,246,0.5)`): the default focus ring on interactive elements.
- **GitHub Dark** (`{colors.github-dark}` — `#24292e`): the GitHub-branded button surface (kept off-brand-on-purpose to match GitHub''s own tokens).

## Typography

### Font Family

Replicate ships a deliberate three-family stack:

- **rb-freigeist-neue** — proprietary heavy grotesque used for all display sizes (30px+). Carries the editorial-magazine personality through tight `lineHeight: 1.0` and negative letter-spacing.
- **basier-square** — proprietary humanist sans-serif used for body, button labels, captions, and metadata.
- **jetbrains-mono** — open-source monospace used in every code well and inline command.

When proprietary families cannot be licensed, **Bricolage Grotesque** or **Migra** are credible substitutes for rb-freigeist-neue, and **Geist** or **Inter** can stand in for basier-square. JetBrains Mono is open-source and should always be used directly.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 128px | 700 | 1.0 | -3px | The single hero "Run AI" / "Imagine what you can build" headline. One per page. |
| `{typography.display-xl}` | 72px | 700 | 1.0 | -1.8px | Section openers ("How it works", "Scale on Replicate"). |
| `{typography.display-lg}` | 48px | 700 | 1.0 | -1px | Sub-section titles, pricing tier names. |
| `{typography.display-md}` | 30px | 600 | 1.2 | -0.5px | Feature card titles. |
| `{typography.heading-lg}` | 38.4px | 600 | 0.83 | -0.5px | Tightly-stacked basier-square headlines, used in pricing and enterprise hero. |
| `{typography.heading-md}` | 24px | 600 | 1.33 | -0.35px | Card titles, model detail headers. |
| `{typography.heading-sm}` | 20px | 600 | 1.4 | -0.3px | List section headers. |
| `{typography.subtitle}` | 18px | 600 | 1.56 | 0 | Lead paragraphs in display sections. |
| `{typography.body-lg}` | 18px | 400 | 1.56 | 0 | Marketing prose. |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body. |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Captions, metadata. |
| `{typography.button-md}` | 16px | 600 | 1.0 | 0 | Default button label. |
| `{typography.button-sm}` | 14px | 600 | 1.0 | 0 | Compact button label, sub-nav pills. |
| `{typography.caption}` | 12px | 400 | 1.33 | 0 | Footer disclosure, copyright. |
| `{typography.caption-tight}` | 14px | 600 | 1.43 | -0.35px | Emphatic small caption used in pricing tier rows. |
| `{typography.code-md}` | 14px | 400 | 1.43 | 0 | Code blocks and inline code. |
| `{typography.code-sm}` | 11px | 400 | 1.5 | 0 | Code-tab labels and small inline tokens. |

### Principles
- Display sizes hold `lineHeight: 1.0` (or 0.83 on `{typography.heading-lg}`) so multi-line stacks read as single typographic blocks.
- Negative letter-spacing scales with size — bigger types tighten more (-3px at 128px down to -0.3px at 20px). Body type stays at 0.
- Body weight sits at 400 across `{typography.body-lg}` and `{typography.body-md}` — never bumped to 500 for emphasis. Emphasis comes from family change (basier-square → rb-freigeist-neue) rather than weight.
- Code is never set in basier-square, even at small sizes — JetBrains Mono carries every literal command, every model slug, every API call.

### Note on Font Substitutes

When the proprietary families are unavailable, clamp display `lineHeight` to 1.0 explicitly and apply a -3% letter-spacing on display-xxl / display-xl to match the original tightness. Substitutes typically render with looser tracking by default.

## Layout

### Spacing System
- **Base unit**: 4px, with the working scale on multiples of 4 / 8 / 16.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.xxxl}` 48px · `{spacing.section}` 96px · `{spacing.band}` 160px.
- Section padding: `{spacing.section}` (96px) vertical between full-width bands; `{spacing.band}` (160px) when a band needs extra editorial breathing room (the hero, the closing "Imagine what you can build" stripe).
- Card internal padding: `{spacing.lg}` (16px) on `{component.model-card}`, `{spacing.xxl}` (32px) on `{component.pricing-tier}`.

### Grid & Container
- **Max content width** ≈ 1280px on body sections, 1440px on hero bands which run full-bleed.
- **Model grid** on collections: 4 columns at desktop, 3 at tablet large, 2 at tablet, 1 at mobile.
- **Pricing**: 3-tier grid centred at desktop, stacking vertically below 1024px; the centre tier flips to `{component.pricing-tier-featured}` (dark inversion) as the recommended option.
- **Code-story sections**: a 2-up split — narrative copy left, code well right — collapsing to stacked at < 1024px.

### Whitespace Philosophy
- Whitespace on cream is generous and editorial — sections breathe at 96px and key bands open at 160px so the typography can scale up without feeling cramped.
- Inside cards, the system tightens to 16–32px so model thumbnails, statuses, and metadata sit in a compact list-of-cards rhythm.
- Hairline `{colors.hairline}` dividers replace shadow on cream surfaces; on dark surfaces, `{colors.divider-dark}` carries the equivalent role.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — flat | No shadow, no border | Default cream canvas, full-bleed bands. |
| 1 — outline | 1px solid `{colors.hairline}` or `{colors.hairline-strong}` | Model cards, pricing tiers, collection tiles. |
| 2 — bone inset | Surface colour shift to `{colors.surface-bone}` inside a `{colors.canvas}` band | Feature group containers, "How it works" walkthrough. |
| 3 — dark inversion | Card swaps to `{colors.surface-dark}` against cream | Code wells, featured pricing tier, "Scale on Replicate" hero card. |
| 4 — soft drop | `0 8px 24px rgba(32,32,32,0.08)` | Hover-anchored model thumbnails (visual only — not interaction-state-documented). |

Drop shadows exist in the extracted tokens but are restrained — used sparingly to lift photography thumbnails one step off the cream canvas. The dominant elevation language is colour-blocking.

### Decorative Depth
- **Hero atmospheric mesh** — the orange-to-pink gradient backing the home hero is a layered radial mesh: `{colors.primary}` core → `{colors.hero-glow}` mid-stop → `{colors.hero-pink}` outer wash. Reserved for the home hero band only.
- **Code-story dark band** — the "How it works" section uses `{colors.surface-dark}` full-bleed with a single hairline `{colors.divider-dark}` separating narrative copy and code well.
- **Contributor mosaic** — the home page features a horizontally-scrolling band of circular avatars (`{component.contributor-avatar}`) over a textured cream canvas; this is the only place avatars appear at the brand level.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero bands, full-bleed sections, footer. |
| `{rounded.xs}` | 4px | Code tabs, inline tags inside code wells. |
| `{rounded.sm}` | 6px | Mid-radius callouts, small inset chips. |
| `{rounded.md}` | 10px | Model cards, collection tiles, code wells. |
| `{rounded.lg}` | 16px | Pricing tiers, larger feature cards. |
| `{rounded.full}` | 9999px | Buttons, inputs, badges, avatars, pills. |

### Photography Geometry
- Model thumbnails: square (1:1) with `{rounded.md}` corners, full-bleed image to the card edge.
- Hero example outputs: 4:3 or 16:9 with `{rounded.md}` corners.
- Contributor avatars: circular (`{rounded.full}`), 40px on home, 32px in card metadata.
- The hero band uses a stylised black-ink illustration (the "tinkerer at the workbench") as its photography stand-in — kept inside the orange band rather than overlaid on cream.

## Components

### Buttons

**`button-primary`** — orange CTA
- Background `{colors.primary}`, label `{colors.on-primary}`, type `{typography.button-md}`, padding `12px 24px`, `rounded: {rounded.full}`, height 44px.
- The single most important action on a page (e.g. "Sign in with GitHub", "Try a model").
- Pressed state lives in `button-primary-pressed` (background `{colors.primary-deep}`).

**`button-dark`** — dark CTA
- Background `{colors.surface-dark}`, label `{colors.on-dark}`, type `{typography.button-md}`, `rounded: {rounded.full}`.
- Equal-weight secondary action paired with `{component.button-primary}`, or the primary action on cream when orange would be too loud.

**`button-outline`** — outlined CTA
- Background `{colors.surface-card}`, label `{colors.ink}`, 1px solid `{colors.hairline-strong}`, type `{typography.button-md}`, `rounded: {rounded.full}`.
- Tertiary action; appears alongside primary/dark for "View docs", "Read more".

**`button-ghost`** — inline button
- Background `{colors.canvas}`, label `{colors.ink}`, no border, type `{typography.button-md}`, `rounded: {rounded.full}`, padding `8px 16px`.
- Sub-actions inside cards and inline with body copy.

**`button-icon`** — icon button
- Background `{colors.surface-card}`, label `{colors.ink}`, 1px solid `{colors.hairline}`, `rounded: {rounded.full}`, 36×36px circular.
- Carousel arrows, copy-to-clipboard, GitHub link icon.

### Cards & Containers

**`model-card`** — model listing card
- Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-md}`, `rounded: {rounded.md}`, padding `{spacing.lg}` (16px).
- Square thumbnail on top, model owner + name beneath in `{typography.body-sm}`, single-line description in `{colors.charcoal}`, status pill `{component.badge-status}` bottom-left.

**`collection-tile`** — collection-of-models tile
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.heading-md}`, `rounded: {rounded.md}`, padding `{spacing.xl}` (24px).
- Cream-on-cream tile inside a `{colors.surface-bone}` band, used for browsing model categories.

**`pricing-tier`** — pricing tier card
- Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}` (32px).
- 3-up grid; tier name in `{typography.display-lg}` ("Free", "Pro", "Enterprise"), price in `{typography.display-md}`.

**`pricing-tier-featured`** — featured pricing tier
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}`.
- Centre tier flipped to dark inversion to mark "recommended".

**`code-block`** — code well
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.code-md}`, `rounded: {rounded.md}`, padding `{spacing.xl}` (24px).
- Tab strip on top using `{component.code-tab}` for switching between languages (Python, Node.js, cURL, HTTP).

**`code-tab`** — code tab chip
- Background `{colors.surface-deep}`, text `{colors.on-dark-mute}`, type `{typography.code-sm}`, `rounded: {rounded.xs}`, padding `6px 12px`.
- Active tab swaps text colour to `{colors.on-dark}` and adds a 2px bottom underline in `{colors.primary}`.

**`hero-band`** — full-bleed hero
- Background `{colors.hero-warm}` with the atmospheric mesh detailed in Elevation, text `{colors.on-dark}`, type `{typography.display-xxl}` for the title.
- Used only on the home page; secondary pages open with cream + `{typography.display-xl}`.

### Inputs & Forms

**`text-input`** — default input
- Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-md}`, 1px solid `{colors.hairline}`, `rounded: {rounded.full}`, padding `12px 20px`, height 44px.
- Pill-shaped search and email fields. Focus state adds a `{colors.ring-focus}` 3px ring.

### Navigation

**`nav-bar`** — top nav (desktop)
- Background `{colors.canvas}`, type `{typography.button-sm}`, height 60px, single hairline `{colors.hairline}` bottom border.
- Left: wordmark logo. Centre: top-level nav ("Explore", "Pricing", "Docs", "Blog"). Right: GitHub icon + "Sign in" link + `{component.button-primary}`.

**`nav-bar`** (mobile)
- Same height 60px, collapses centre nav into a hamburger icon. Logo stays left, sign-in CTA stays right.

**`sub-nav-pill`** — sub-nav chip
- Pill chips set in a horizontal row above content (e.g. "All", "Featured", "Image generation", "Audio"), `{component.sub-nav-pill}` styling.

### Signature Components

**`badge-status`** — model status badge
- Background `{colors.badge-success}`, label `{colors.on-dark}`, type `{typography.caption}`, `rounded: {rounded.full}`, padding `4px 10px`.
- Anchored on the bottom-left of model cards to indicate "running" or "deployed".

**`badge-tag`** — neutral tag
- Background `{colors.canvas}`, label `{colors.ink}`, 1px solid `{colors.hairline}`, type `{typography.caption}`, `rounded: {rounded.full}`, padding `4px 10px`.
- Capability tags ("text-to-image", "video", "audio") on model cards.

**`contributor-avatar`** — community contributor
- Background `{colors.surface-card}` placeholder behind 1:1 photography, `rounded: {rounded.full}`, 40×40px (32px in metadata contexts).
- Used in the home-page contributor mosaic.

**`footer`** — global footer
- Background `{colors.surface-deep}`, text `{colors.on-dark}`, type `{typography.body-sm}`, `rounded: {rounded.none}`, padding `64px 32px`.
- Multi-column quick-links grid above a copyright row separated by `{colors.divider-dark}`.

## Do''s and Don''ts

### Do
- Use `{colors.canvas}` (cream) as the default page background. White (`{colors.surface-card}`) appears only on individual cards, inputs, and the hero illustration backdrop.
- Reserve `{colors.primary}` for the primary CTA, the home hero band, and inline links — three roles, nothing else.
- Set every interactive element to `{rounded.full}` — buttons, inputs, badges, avatars, pills.
- Step content cards up to `{rounded.md}` (10px) or `{rounded.lg}` (16px) — never sharp corners.
- Open hero bands with `{typography.display-xxl}` (128px) and `{typography.display-xl}` (72px) at `lineHeight: 1.0` with negative letter-spacing.
- Use `rb-freigeist-neue` for all display, `basier-square` for UI/body, `jetbrains-mono` for code. Keep the lanes strict.
- Render code in `{component.code-block}` with a `{colors.surface-dark}` background — code is print, not an inline grey box.
- Pair photography with `{rounded.md}` corners and full-bleed crop inside cards.

### Don''t
- Don''t replace cream with pure white at the page level. The brand temperature comes from `{colors.canvas}`.
- Don''t introduce a secondary brand colour. Orange is the only accent; semantic green and focus blue are functional, not decorative.
- Don''t loosen display `lineHeight` past 1.0. Tight stacking is structural.
- Don''t bump body weight to 500 for emphasis — change family (`basier-square` → `rb-freigeist-neue`) instead.
- Don''t apply `{rounded.full}` to content cards. Pill-shaped cards break the rhythm.
- Don''t put code in a light grey box. Code wells are always `{colors.surface-dark}` or `{colors.surface-deep}`.
- Don''t use orange on body text or large surfaces — it loses its stamp quality immediately.
- Don''t add drop shadows on cream surfaces. Elevation is colour-blocking; shadows are reserved for floating thumbnails.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop XL | ≥ 1440px | Full max-width 1280 body, hero band runs full-bleed, 4-up model grid. |
| Desktop | 1280–1439px | Container shrinks; padding `{spacing.xl}` (24px) sides. |
| Tablet Large | 1024–1279px | Model grid 3-up, code-story splits remain 2-up. |
| Tablet | 768–1023px | Model grid 2-up, code-story stacks (narrative on top, code below), pricing stacks vertically. |
| Mobile Large | 426–767px | Model grid 1-up at 480px+, nav collapses to hamburger, hero `{typography.display-xxl}` clamps to 64px. |
| Mobile | ≤ 425px | All grids 1-up, hero clamps to 48px, section padding `{spacing.section}` collapses to 64px. |

### Touch Targets
- All buttons ship at minimum 44px tall on mobile; default `{component.button-primary}` is 44px tall — comfortably clearing WCAG AAA.
- `{component.button-icon}` (36px) is bumped to 44px on mobile via increased padding.
- `{component.sub-nav-pill}` stays at 36px on desktop and grows to 40px on mobile via vertical padding adjustment.

### Collapsing Strategy
- Top-level nav collapses to hamburger at < 1024px; the wordmark and `{component.button-primary}` stay anchored.
- Hero `{typography.display-xxl}` clamps: 128px → 96px → 64px → 48px across the breakpoint ladder.
- Pricing 3-up grid stacks vertically at < 1024px with the featured tier remaining centre-stacked.
- Code-story splits switch from side-by-side to stacked at < 1024px, code well always second.
- Sub-nav pills convert from a wrap row to a horizontal scroll-rail at < 768px.

### Image Behavior
- Model thumbnails serve at 1.5× and 2× DPR; below 768px the system swaps to a 600×600 export instead of 1200×1200.
- Hero atmospheric mesh is rendered as a CSS gradient — no asset cost, no breakpoint variation.
- Code-block contents wrap softly at < 1024px (no horizontal scroll); long lines break with a continuation marker.

## Iteration Guide

1. Focus on ONE component at a time. Most interactive elements share `{rounded.full}` and the `{colors.canvas}` / `{colors.surface-card}` pair — only the role-specific tokens (`{colors.primary}`, `{component.code-block}`) shift between variants.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.lg}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits; orphaned-tokens warnings will catch unused entries.
4. Add new variants as separate entries (`-pressed`, `-disabled`, `-featured`) — do not bury them in prose.
5. Default body type to `{typography.body-md}`; reach for `{typography.subtitle}` only on hero subtitles.
6. Keep `{colors.primary}` scarce — if more than one orange element appears per viewport, ask whether one should drop to `{colors.surface-dark}` instead.

## Known Gaps

- Active/pressed visual states are documented for `button-primary-pressed` only; other components rely on the focus-ring (`{colors.ring-focus}`) for interactive feedback, which is not extracted as a per-component variant.
- The model playground / try-this-model interactive surfaces (logged-in feature) are out of scope; only the public marketing canvas is documented.
- Dashboard / billing / API key management surfaces are not extracted — those live behind authentication.
- The home hero illustration ("the tinkerer at the workbench") is treated as decorative artwork, not a system component; replicating it requires bespoke illustration rather than tokens.
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

Replicate is a developer-tools platform with the soul of an art zine. The
public marketing surfaces sit on a warm cream canvas (`{colors.canvas}` —
`#f9f7f3`) rather than the white-or-near-black default of typical AI
infrastructure sites, and that single decision colours everything else:
photography reads as editorial, code wells read as printed pull-quotes, and
the brand orange (`{colors.primary}` — `#ea2804`) feels like a stamp rather
than a notification.

The typography is the load-bearing decoration. **rb-freigeist-neue** — a
heavy, slightly condensed grotesque — appears at sizes up to 128px in hero
bands, with a tight `lineHeight: 1.0` and negative letter-spacing that lets
multi-line headlines pack into geometric blocks. The companion family,
**basier-square**, takes care of body, button labels, and metadata in the
14–18px range. **JetBrains Mono** carries every code well, command, and
example. Three families, three jobs, no overlap.

Page rhythm cycles between a default cream canvas, a bold full-bleed orange
hero band, and a `{colors.surface-dark}` (`#202020`) section that hosts the
code stories — the "how it works" walkthrough. Curves are intentional and
soft: every interactive surface (buttons, inputs, tags, avatars) uses
`{rounded.full}`, while content cards and code wells step up to `{rounded.md}`
or `{rounded.lg}`. There are no sharp corners on Replicate; the system reads
as friendly precision.

**Key Characteristics:**
- A warm cream canvas (`{colors.canvas}` — `#f9f7f3`) replaces the typical white background, paired with `{colors.surface-bone}` for inset cards.
- Hot orange (`{colors.primary}` — `#ea2804`) is reserved for the primary CTA, the hero band, and inline link colour. Never decorative.
- Display headlines run massive — `{typography.display-xxl}` at 128px in hero bands and `{typography.display-xl}` at 72px on section openers — with tight `lineHeight: 1.0` and negative letter-spacing.
- Three-family typography stack: `rb-freigeist-neue` for display, `basier-square` for UI/body, `jetbrains-mono` for code.
- Every interactive element is fully rounded (`{rounded.full}` 9999px) — buttons, inputs, badges, avatars — while content cards step to `{rounded.md}` 10px.
- Dark code wells (`{colors.surface-dark}` background) sit inside the cream canvas as full-bleed reading surfaces, mimicking print pull-quotes.
- Section rhythm: cream → orange hero → cream → dark code-story band → cream → black footer.', '{"sourcePath":"docs/design-md/replicate/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Replicate Orange** (`{colors.primary}` — `#ea2804`): the brand accent. Reserved for the primary CTA, hero band background, and inline link colour. Treat as a stamp — one orange element per viewport at most.
- **Orange Pressed** (`{colors.primary-deep}` — `#c01f00`): the active/pressed state of `{colors.primary}` — used on `{component.button-primary-pressed}`.
- **Hero Glow** (`{colors.hero-glow}` — `#ff6a3d`): the lighter orange that appears in the radial atmospheric mesh behind the hero copy.
- **Hero Pink** (`{colors.hero-pink}` — `#f4a8a0`): a warm pink wash that softens the bottom edge of the hero band before it transitions to cream.
- **On-Primary** (`{colors.on-primary}` — `#ffffff`): label colour on top of `{colors.primary}` surfaces.

### Surface
- **Canvas** (`{colors.canvas}` — `#f9f7f3`): the default page background. Warm cream, never pure white.
- **Surface Bone** (`{colors.surface-bone}` — `#f3f0e8`): a half-step deeper cream used for inset card groups and feature bands.
- **Surface Card** (`{colors.surface-card}` — `#ffffff`): pure white for individual model cards, search inputs, and pricing tiers — the only place white appears.
- **Surface Dark** (`{colors.surface-dark}` — `#202020`): code wells, featured pricing tier, and the "how it works" walkthrough band.
- **Surface Deep** (`{colors.surface-deep}` — `#000000`): footer canvas and the inset code-tab strip inside `{component.code-block}`.
- **Hairline** (`{colors.hairline}` — `rgba(32,32,32,0.12)`): low-contrast 1px dividers on cream surfaces.
- **Hairline Strong** (`{colors.hairline-strong}` — `#202020`): button outlines, focused inputs, and structural separators.

### Text
- **Ink** (`{colors.ink}` — `#202020`): primary text colour. Notably warmer than `#000000`, matching the cream canvas.
- **Body** (`{colors.body}` — `#3a3a3a`): long-form body copy where ink would feel too heavy at 18px+ line lengths.
- **Charcoal** (`{colors.charcoal}` — `#575757`): captions, metadata, secondary nav.
- **Mute** (`{colors.mute}` — `#646464`): supporting text and inactive labels.
- **Ash** (`{colors.ash}` — `#8d8d8d`): tertiary text, placeholder copy.
- **Stone** (`{colors.stone}` — `#bbbbbb`): disabled foreground, neutral icon outlines.
- **On-Dark** (`{colors.on-dark}` — `#fcfcfc`): primary text on `{colors.surface-dark}` and `{colors.surface-deep}`.
- **On-Dark Mute** (`{colors.on-dark-mute}` — `rgba(252,252,252,0.72)`): secondary text in dark regions; preserves the off-white feel without pure white pop.

### Semantic
- **Success** (`{colors.badge-success}` — `#2b9a66`): inline success badges and "running" status pills on model cards.
- **Link** (`{colors.link}` — `#ea2804`): inline link colour — same as primary orange, intentionally pulling links into the brand accent.
- **Focus Ring** (`{colors.ring-focus}` — `rgba(59,130,246,0.5)`): the default focus ring on interactive elements.
- **GitHub Dark** (`{colors.github-dark}` — `#24292e`): the GitHub-branded button surface (kept off-brand-on-purpose to match GitHub''s own tokens).', '{"sourcePath":"docs/design-md/replicate/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

Replicate ships a deliberate three-family stack:

- **rb-freigeist-neue** — proprietary heavy grotesque used for all display sizes (30px+). Carries the editorial-magazine personality through tight `lineHeight: 1.0` and negative letter-spacing.
- **basier-square** — proprietary humanist sans-serif used for body, button labels, captions, and metadata.
- **jetbrains-mono** — open-source monospace used in every code well and inline command.

When proprietary families cannot be licensed, **Bricolage Grotesque** or **Migra** are credible substitutes for rb-freigeist-neue, and **Geist** or **Inter** can stand in for basier-square. JetBrains Mono is open-source and should always be used directly.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 128px | 700 | 1.0 | -3px | The single hero "Run AI" / "Imagine what you can build" headline. One per page. |
| `{typography.display-xl}` | 72px | 700 | 1.0 | -1.8px | Section openers ("How it works", "Scale on Replicate"). |
| `{typography.display-lg}` | 48px | 700 | 1.0 | -1px | Sub-section titles, pricing tier names. |
| `{typography.display-md}` | 30px | 600 | 1.2 | -0.5px | Feature card titles. |
| `{typography.heading-lg}` | 38.4px | 600 | 0.83 | -0.5px | Tightly-stacked basier-square headlines, used in pricing and enterprise hero. |
| `{typography.heading-md}` | 24px | 600 | 1.33 | -0.35px | Card titles, model detail headers. |
| `{typography.heading-sm}` | 20px | 600 | 1.4 | -0.3px | List section headers. |
| `{typography.subtitle}` | 18px | 600 | 1.56 | 0 | Lead paragraphs in display sections. |
| `{typography.body-lg}` | 18px | 400 | 1.56 | 0 | Marketing prose. |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body. |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Captions, metadata. |
| `{typography.button-md}` | 16px | 600 | 1.0 | 0 | Default button label. |
| `{typography.button-sm}` | 14px | 600 | 1.0 | 0 | Compact button label, sub-nav pills. |
| `{typography.caption}` | 12px | 400 | 1.33 | 0 | Footer disclosure, copyright. |
| `{typography.caption-tight}` | 14px | 600 | 1.43 | -0.35px | Emphatic small caption used in pricing tier rows. |
| `{typography.code-md}` | 14px | 400 | 1.43 | 0 | Code blocks and inline code. |
| `{typography.code-sm}` | 11px | 400 | 1.5 | 0 | Code-tab labels and small inline tokens. |

### Principles
- Display sizes hold `lineHeight: 1.0` (or 0.83 on `{typography.heading-lg}`) so multi-line stacks read as single typographic blocks.
- Negative letter-spacing scales with size — bigger types tighten more (-3px at 128px down to -0.3px at 20px). Body type stays at 0.
- Body weight sits at 400 across `{typography.body-lg}` and `{typography.body-md}` — never bumped to 500 for emphasis. Emphasis comes from family change (basier-square → rb-freigeist-neue) rather than weight.
- Code is never set in basier-square, even at small sizes — JetBrains Mono carries every literal command, every model slug, every API call.

### Note on Font Substitutes

When the proprietary families are unavailable, clamp display `lineHeight` to 1.0 explicitly and apply a -3% letter-spacing on display-xxl / display-xl to match the original tightness. Substitutes typically render with looser tracking by default.', '{"sourcePath":"docs/design-md/replicate/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4px, with the working scale on multiples of 4 / 8 / 16.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.xxxl}` 48px · `{spacing.section}` 96px · `{spacing.band}` 160px.
- Section padding: `{spacing.section}` (96px) vertical between full-width bands; `{spacing.band}` (160px) when a band needs extra editorial breathing room (the hero, the closing "Imagine what you can build" stripe).
- Card internal padding: `{spacing.lg}` (16px) on `{component.model-card}`, `{spacing.xxl}` (32px) on `{component.pricing-tier}`.

### Grid & Container
- **Max content width** ≈ 1280px on body sections, 1440px on hero bands which run full-bleed.
- **Model grid** on collections: 4 columns at desktop, 3 at tablet large, 2 at tablet, 1 at mobile.
- **Pricing**: 3-tier grid centred at desktop, stacking vertically below 1024px; the centre tier flips to `{component.pricing-tier-featured}` (dark inversion) as the recommended option.
- **Code-story sections**: a 2-up split — narrative copy left, code well right — collapsing to stacked at < 1024px.

### Whitespace Philosophy
- Whitespace on cream is generous and editorial — sections breathe at 96px and key bands open at 160px so the typography can scale up without feeling cramped.
- Inside cards, the system tightens to 16–32px so model thumbnails, statuses, and metadata sit in a compact list-of-cards rhythm.
- Hairline `{colors.hairline}` dividers replace shadow on cream surfaces; on dark surfaces, `{colors.divider-dark}` carries the equivalent role.', '{"sourcePath":"docs/design-md/replicate/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — flat | No shadow, no border | Default cream canvas, full-bleed bands. |
| 1 — outline | 1px solid `{colors.hairline}` or `{colors.hairline-strong}` | Model cards, pricing tiers, collection tiles. |
| 2 — bone inset | Surface colour shift to `{colors.surface-bone}` inside a `{colors.canvas}` band | Feature group containers, "How it works" walkthrough. |
| 3 — dark inversion | Card swaps to `{colors.surface-dark}` against cream | Code wells, featured pricing tier, "Scale on Replicate" hero card. |
| 4 — soft drop | `0 8px 24px rgba(32,32,32,0.08)` | Hover-anchored model thumbnails (visual only — not interaction-state-documented). |

Drop shadows exist in the extracted tokens but are restrained — used sparingly to lift photography thumbnails one step off the cream canvas. The dominant elevation language is colour-blocking.

### Decorative Depth
- **Hero atmospheric mesh** — the orange-to-pink gradient backing the home hero is a layered radial mesh: `{colors.primary}` core → `{colors.hero-glow}` mid-stop → `{colors.hero-pink}` outer wash. Reserved for the home hero band only.
- **Code-story dark band** — the "How it works" section uses `{colors.surface-dark}` full-bleed with a single hairline `{colors.divider-dark}` separating narrative copy and code well.
- **Contributor mosaic** — the home page features a horizontally-scrolling band of circular avatars (`{component.contributor-avatar}`) over a textured cream canvas; this is the only place avatars appear at the brand level.', '{"sourcePath":"docs/design-md/replicate/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero bands, full-bleed sections, footer. |
| `{rounded.xs}` | 4px | Code tabs, inline tags inside code wells. |
| `{rounded.sm}` | 6px | Mid-radius callouts, small inset chips. |
| `{rounded.md}` | 10px | Model cards, collection tiles, code wells. |
| `{rounded.lg}` | 16px | Pricing tiers, larger feature cards. |
| `{rounded.full}` | 9999px | Buttons, inputs, badges, avatars, pills. |

### Photography Geometry
- Model thumbnails: square (1:1) with `{rounded.md}` corners, full-bleed image to the card edge.
- Hero example outputs: 4:3 or 16:9 with `{rounded.md}` corners.
- Contributor avatars: circular (`{rounded.full}`), 40px on home, 32px in card metadata.
- The hero band uses a stylised black-ink illustration (the "tinkerer at the workbench") as its photography stand-in — kept inside the orange band rather than overlaid on cream.', '{"sourcePath":"docs/design-md/replicate/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — orange CTA
- Background `{colors.primary}`, label `{colors.on-primary}`, type `{typography.button-md}`, padding `12px 24px`, `rounded: {rounded.full}`, height 44px.
- The single most important action on a page (e.g. "Sign in with GitHub", "Try a model").
- Pressed state lives in `button-primary-pressed` (background `{colors.primary-deep}`).

**`button-dark`** — dark CTA
- Background `{colors.surface-dark}`, label `{colors.on-dark}`, type `{typography.button-md}`, `rounded: {rounded.full}`.
- Equal-weight secondary action paired with `{component.button-primary}`, or the primary action on cream when orange would be too loud.

**`button-outline`** — outlined CTA
- Background `{colors.surface-card}`, label `{colors.ink}`, 1px solid `{colors.hairline-strong}`, type `{typography.button-md}`, `rounded: {rounded.full}`.
- Tertiary action; appears alongside primary/dark for "View docs", "Read more".

**`button-ghost`** — inline button
- Background `{colors.canvas}`, label `{colors.ink}`, no border, type `{typography.button-md}`, `rounded: {rounded.full}`, padding `8px 16px`.
- Sub-actions inside cards and inline with body copy.

**`button-icon`** — icon button
- Background `{colors.surface-card}`, label `{colors.ink}`, 1px solid `{colors.hairline}`, `rounded: {rounded.full}`, 36×36px circular.
- Carousel arrows, copy-to-clipboard, GitHub link icon.

### Cards & Containers

**`model-card`** — model listing card
- Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-md}`, `rounded: {rounded.md}`, padding `{spacing.lg}` (16px).
- Square thumbnail on top, model owner + name beneath in `{typography.body-sm}`, single-line description in `{colors.charcoal}`, status pill `{component.badge-status}` bottom-left.

**`collection-tile`** — collection-of-models tile
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.heading-md}`, `rounded: {rounded.md}`, padding `{spacing.xl}` (24px).
- Cream-on-cream tile inside a `{colors.surface-bone}` band, used for browsing model categories.

**`pricing-tier`** — pricing tier card
- Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}` (32px).
- 3-up grid; tier name in `{typography.display-lg}` ("Free", "Pro", "Enterprise"), price in `{typography.display-md}`.

**`pricing-tier-featured`** — featured pricing tier
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}`.
- Centre tier flipped to dark inversion to mark "recommended".

**`code-block`** — code well
- Background `{colors.surface-dark}`, text `{colors.on-dark}`, type `{typography.code-md}`, `rounded: {rounded.md}`, padding `{spacing.xl}` (24px).
- Tab strip on top using `{component.code-tab}` for switching between languages (Python, Node.js, cURL, HTTP).

**`code-tab`** — code tab chip
- Background `{colors.surface-deep}`, text `{colors.on-dark-mute}`, type `{typography.code-sm}`, `rounded: {rounded.xs}`, padding `6px 12px`.
- Active tab swaps text colour to `{colors.on-dark}` and adds a 2px bottom underline in `{colors.primary}`.

**`hero-band`** — full-bleed hero
- Background `{colors.hero-warm}` with the atmospheric mesh detailed in Elevation, text `{colors.on-dark}`, type `{typography.display-xxl}` for the title.
- Used only on the home page; secondary pages open with cream + `{typography.display-xl}`.

### Inputs & Forms

**`text-input`** — default input
- Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-md}`, 1px solid `{colors.hairline}`, `rounded: {rounded.full}`, padding `12px 20px`, height 44px.
- Pill-shaped search and email fields. Focus state adds a `{colors.ring-focus}` 3px ring.

### Navigation

**`nav-bar`** — top nav (desktop)
- Background `{colors.canvas}`, type `{typography.button-sm}`, height 60px, single hairline `{colors.hairline}` bottom border.
- Left: wordmark logo. Centre: top-level nav ("Explore", "Pricing", "Docs", "Blog"). Right: GitHub icon + "Sign in" link + `{component.button-primary}`.

**`nav-bar`** (mobile)
- Same height 60px, collapses centre nav into a hamburger icon. Logo stays left, sign-in CTA stays right.

**`sub-nav-pill`** — sub-nav chip
- Pill chips set in a horizontal row above content (e.g. "All", "Featured", "Image generation", "Audio"), `{component.sub-nav-pill}` styling.

### Signature Components

**`badge-status`** — model status badge
- Background `{colors.badge-success}`, label `{colors.on-dark}`, type `{typography.caption}`, `rounded: {rounded.full}`, padding `4px 10px`.
- Anchored on the bottom-left of model cards to indicate "running" or "deployed".

**`badge-tag`** — neutral tag
- Background `{colors.canvas}`, label `{colors.ink}`, 1px solid `{colors.hairline}`, type `{typography.caption}`, `rounded: {rounded.full}`, padding `4px 10px`.
- Capability tags ("text-to-image", "video", "audio") on model cards.

**`contributor-avatar`** — community contributor
- Background `{colors.surface-card}` placeholder behind 1:1 photography, `rounded: {rounded.full}`, 40×40px (32px in metadata contexts).
- Used in the home-page contributor mosaic.

**`footer`** — global footer
- Background `{colors.surface-deep}`, text `{colors.on-dark}`, type `{typography.body-sm}`, `rounded: {rounded.none}`, padding `64px 32px`.
- Multi-column quick-links grid above a copyright row separated by `{colors.divider-dark}`.', '{"sourcePath":"docs/design-md/replicate/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Use `{colors.canvas}` (cream) as the default page background. White (`{colors.surface-card}`) appears only on individual cards, inputs, and the hero illustration backdrop.
- Reserve `{colors.primary}` for the primary CTA, the home hero band, and inline links — three roles, nothing else.
- Set every interactive element to `{rounded.full}` — buttons, inputs, badges, avatars, pills.
- Step content cards up to `{rounded.md}` (10px) or `{rounded.lg}` (16px) — never sharp corners.
- Open hero bands with `{typography.display-xxl}` (128px) and `{typography.display-xl}` (72px) at `lineHeight: 1.0` with negative letter-spacing.
- Use `rb-freigeist-neue` for all display, `basier-square` for UI/body, `jetbrains-mono` for code. Keep the lanes strict.
- Render code in `{component.code-block}` with a `{colors.surface-dark}` background — code is print, not an inline grey box.
- Pair photography with `{rounded.md}` corners and full-bleed crop inside cards.

### Don''t
- Don''t replace cream with pure white at the page level. The brand temperature comes from `{colors.canvas}`.
- Don''t introduce a secondary brand colour. Orange is the only accent; semantic green and focus blue are functional, not decorative.
- Don''t loosen display `lineHeight` past 1.0. Tight stacking is structural.
- Don''t bump body weight to 500 for emphasis — change family (`basier-square` → `rb-freigeist-neue`) instead.
- Don''t apply `{rounded.full}` to content cards. Pill-shaped cards break the rhythm.
- Don''t put code in a light grey box. Code wells are always `{colors.surface-dark}` or `{colors.surface-deep}`.
- Don''t use orange on body text or large surfaces — it loses its stamp quality immediately.
- Don''t add drop shadows on cream surfaces. Elevation is colour-blocking; shadows are reserved for floating thumbnails.', '{"sourcePath":"docs/design-md/replicate/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop XL | ≥ 1440px | Full max-width 1280 body, hero band runs full-bleed, 4-up model grid. |
| Desktop | 1280–1439px | Container shrinks; padding `{spacing.xl}` (24px) sides. |
| Tablet Large | 1024–1279px | Model grid 3-up, code-story splits remain 2-up. |
| Tablet | 768–1023px | Model grid 2-up, code-story stacks (narrative on top, code below), pricing stacks vertically. |
| Mobile Large | 426–767px | Model grid 1-up at 480px+, nav collapses to hamburger, hero `{typography.display-xxl}` clamps to 64px. |
| Mobile | ≤ 425px | All grids 1-up, hero clamps to 48px, section padding `{spacing.section}` collapses to 64px. |

### Touch Targets
- All buttons ship at minimum 44px tall on mobile; default `{component.button-primary}` is 44px tall — comfortably clearing WCAG AAA.
- `{component.button-icon}` (36px) is bumped to 44px on mobile via increased padding.
- `{component.sub-nav-pill}` stays at 36px on desktop and grows to 40px on mobile via vertical padding adjustment.

### Collapsing Strategy
- Top-level nav collapses to hamburger at < 1024px; the wordmark and `{component.button-primary}` stay anchored.
- Hero `{typography.display-xxl}` clamps: 128px → 96px → 64px → 48px across the breakpoint ladder.
- Pricing 3-up grid stacks vertically at < 1024px with the featured tier remaining centre-stacked.
- Code-story splits switch from side-by-side to stacked at < 1024px, code well always second.
- Sub-nav pills convert from a wrap row to a horizontal scroll-rail at < 768px.

### Image Behavior
- Model thumbnails serve at 1.5× and 2× DPR; below 768px the system swaps to a 600×600 export instead of 1200×1200.
- Hero atmospheric mesh is rendered as a CSS gradient — no asset cost, no breakpoint variation.
- Code-block contents wrap softly at < 1024px (no horizontal scroll); long lines break with a continuation marker.', '{"sourcePath":"docs/design-md/replicate/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Most interactive elements share `{rounded.full}` and the `{colors.canvas}` / `{colors.surface-card}` pair — only the role-specific tokens (`{colors.primary}`, `{component.code-block}`) shift between variants.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.lg}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits; orphaned-tokens warnings will catch unused entries.
4. Add new variants as separate entries (`-pressed`, `-disabled`, `-featured`) — do not bury them in prose.
5. Default body type to `{typography.body-md}`; reach for `{typography.subtitle}` only on hero subtitles.
6. Keep `{colors.primary}` scarce — if more than one orange element appears per viewport, ask whether one should drop to `{colors.surface-dark}` instead.', '{"sourcePath":"docs/design-md/replicate/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Active/pressed visual states are documented for `button-primary-pressed` only; other components rely on the focus-ring (`{colors.ring-focus}`) for interactive feedback, which is not extracted as a per-component variant.
- The model playground / try-this-model interactive surfaces (logged-in feature) are out of scope; only the public marketing canvas is documented.
- Dashboard / billing / API key management surfaces are not extracted — those live behind authentication.
- The home hero illustration ("the tinkerer at the workbench") is treated as decorative artwork, not a system component; replicating it requires bespoke illustration rather than tokens.', '{"sourcePath":"docs/design-md/replicate/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_1', '#ea2804', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_2', '#c01f00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_3', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_4', '#202020', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_5', '#3a3a3a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_6', '#575757', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_7', '#646464', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_8', '#8d8d8d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_9', '#bbbbbb', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_10', '#fcfcfc', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_11', '#f9f7f3', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_12', '#f3f0e8', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_13', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_14', '#ff6a3d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_15', '#f4a8a0', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_16', '#2b9a66', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md'), 'color', 'color_17', '#24292e', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/replicate/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/replicate/DESIGN.md';


-- Resend
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Resend', 'resend', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/resend/DESIGN.md', null, 'seeded', '---
version: alpha
name: Resend-design-analysis
description: |
  Resend''s marketing surfaces sit on a near-pure black canvas with off-white
  text and a single signature color — the deep editorial-serif Domaine
  Display headline mark — that gives an otherwise utilitarian developer-tool
  brand its print-magazine confidence. The system pairs Domaine Display
  (oversized 76px–96px serif, ss01/ss04/ss11 features on) with ABC Favorit
  for body and Inter for UI. Surfaces rely on subtle 6–9% opacity gradient
  glows, hairline 1px borders made from translucent white, and a strict
  rounded-12px container vocabulary. There is no decorative chrome — just
  type, code, and atmospheric depth.

colors:
  primary: "#fcfdff"
  primary-on: "#000000"
  ink: "#fcfdff"
  body: "rgba(252,253,255,0.86)"
  charcoal: "rgba(252,253,255,0.7)"
  mute: "#a1a4a5"
  ash: "#888e90"
  stone: "#464a4d"
  on-light: "#000000"
  on-light-mute: "rgba(0,0,51,0.7)"
  canvas: "#000000"
  surface-card: "#0a0a0c"
  surface-elevated: "#101012"
  surface-deep: "#06060a"
  hairline: "rgba(255,255,255,0.06)"
  hairline-strong: "rgba(255,255,255,0.14)"
  divider-soft: "rgba(255,255,255,0.04)"
  accent-orange: "#ff801f"
  accent-orange-glow: "rgba(255,89,0,0.22)"
  accent-yellow: "#ffc53d"
  accent-blue: "#3b9eff"
  accent-blue-glow: "rgba(0,117,255,0.34)"
  accent-green: "#11ff99"
  accent-green-glow: "rgba(34,255,153,0.18)"
  accent-red: "#ff2047"
  accent-red-glow: "rgba(255,32,71,0.34)"
  link: "#3b9eff"
  surface-light: "#f1f7fe"

typography:
  display-xxl:
    fontFamily: Domaine Display
    fontSize: 96px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.96px
    fontFeature: "ss01, ss04, ss11"
  display-xl:
    fontFamily: Domaine Display
    fontSize: 76.8px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.768px
    fontFeature: "ss01, ss04, ss11"
  display-lg:
    fontFamily: ABC Favorit
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -2.8px
    fontFeature: "ss01, ss04, ss11"
  heading-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: -0.4px
  heading-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.3px
  subtitle:
    fontFamily: ABC Favorit
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.3
    fontFeature: "ss01, ss04, ss11"
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: ABC Favorit
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.8px
    fontFeature: "ss01, ss04, ss11"
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
  button-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
  button-sm:
    fontFamily: ABC Favorit
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: 0.35px
    fontFeature: "ss01, ss03, ss04"
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  caption-emph:
    fontFamily: Helvetica
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.0
  code-md:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6

rounded:
  none: 0px
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
  xxxl: 48px
  section: 96px
  band: 128px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-on}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    height: 36px
  button-primary-pressed:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.primary-on}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
  button-ghost:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    height: 36px
  button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 7px 15px
    height: 36px
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 10px 14px
    height: 40px
  hero-stripe:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xxl}"
    rounded: "{rounded.none}"
    padding: 96px 32px
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  feature-card-bordered:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-tier:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-tier-featured:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  code-window:
    backgroundColor: "{colors.surface-deep}"
    textColor: "{colors.body}"
    typography: "{typography.code-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  code-tab:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.charcoal}"
    typography: "{typography.code-md}"
    rounded: "{rounded.sm}"
    padding: 6px 12px
  email-mockup:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 0
  badge-pill:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  status-dot:
    backgroundColor: "{colors.accent-green}"
    rounded: "{rounded.full}"
    size: 8px
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.none}"
    height: 64px
  sub-nav-pill:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.body}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 6px 14px
  contributor-avatar:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.full}"
    size: 32px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.charcoal}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 64px 32px
---

## Overview

Resend looks like a developer tool with the typography of an editorial.
Every page opens on `{colors.canvas}` (`#000000`), and the loudest element on
the canvas is not a button or a brand stamp — it''s a 96px Domaine Display
serif headline ("Email for developers", "Email reimagined") with the
`ss01 / ss04 / ss11` stylistic alternates engaged. That single typographic
decision sets the brand tone: confident, considered, slightly literary, and
priced on quality rather than novelty.

The supporting cast is technical. Body copy switches to **ABC Favorit** for
marketing prose and **Inter** for UI labels, while code blocks render in
**Geist Mono** inside `{component.code-window}` shells with hairline traffic-
light dots. Surface depth is built almost entirely from translucent white —
6% borders, 14% strong borders, 4% dividers — over a deep `{colors.surface-deep}`
layer that sits just below the canvas black. There are no gradients painted
across full bands, just **soft atmospheric glows** (orange, blue, green, red,
yellow) anchored at the top of select sections, all at low opacity.

Page rhythm cycles in a single dark register: hero stripe → atmospheric
section → code window section → email mockup section → pricing or feature
grid → black footer. The brand never warms to a light surface; even
secondary email mockups are rendered as compact white cards inside the dark
canvas, framed like print insets in a black-bordered magazine page.

**Key Characteristics:**
- Pure black canvas (`{colors.canvas}` — `#000000`) on every public page; off-white text (`{colors.ink}` — `#fcfdff`) carries the full read.
- A serif-led type system: **Domaine Display** at 76–96px for hero headlines, **ABC Favorit** for marketing body, **Inter** for UI, **Geist Mono** for code.
- Six accent glow colours used only as low-opacity atmospheric washes (`{colors.accent-orange}`, `{colors.accent-blue}`, `{colors.accent-green}`, `{colors.accent-red}`, `{colors.accent-yellow}`) — never as buttons or solid surfaces.
- Strict container vocabulary: `{rounded.lg}` (12px) for feature cards, code wells, and email mockups; `{rounded.md}` (8px) for buttons; `{rounded.full}` for pills and avatars.
- Translucent white borders (`{colors.hairline}` 6% / `{colors.hairline-strong}` 14%) replace shadows entirely — the system has no traditional drop-shadow elevation language.
- `{component.button-primary}` is a small white rectangle with black text — counterintuitive contrast that becomes the page''s brightest pixel and works as a single visual anchor.

## Colors

### Brand & Accent
- **Primary White** (`{colors.primary}` — `#fcfdff`): the brand''s de facto accent. Reserved for `{component.button-primary}` (white pill on black canvas), Domaine display headlines, and the active text colour. White is the loudest possible colour on this canvas — that''s the signature.
- **Primary On** (`{colors.primary-on}` — `#000000`): label colour on top of `{colors.primary}` surfaces. Black text on white pill is the brand''s CTA pattern.
- **Surface Light** (`{colors.surface-light}` — `#f1f7fe`): a subtle blue-tinted off-white used as the active/pressed state of `{component.button-primary}`.

### Surface
- **Canvas** (`{colors.canvas}` — `#000000`): the default page background. True black, never near-black.
- **Surface Card** (`{colors.surface-card}` — `#0a0a0c`): the standard inset card surface, just lighter than canvas to register a step up in elevation.
- **Surface Elevated** (`{colors.surface-elevated}` — `#101012`): a second elevation step used on featured pricing tiers and ghost button surfaces.
- **Surface Deep** (`{colors.surface-deep}` — `#06060a`): code window background — slightly cooler and darker than the canvas itself, suggesting depth via temperature.
- **Hairline** (`{colors.hairline}` — `rgba(255,255,255,0.06)`): the soft 1px translucent-white divider used between rows and around feature cards.
- **Hairline Strong** (`{colors.hairline-strong}` — `rgba(255,255,255,0.14)`): the structural 1px border on cards, code wells, and form inputs.
- **Divider Soft** (`{colors.divider-soft}` — `rgba(255,255,255,0.04)`): low-contrast dividers between footer columns.

### Text
- **Ink** (`{colors.ink}` — `#fcfdff`): primary text colour on the dark canvas. Faintly blue-cool to feel like printed paper rather than pure white pop.
- **Body** (`{colors.body}` — `rgba(252,253,255,0.86)`): long-form body text where pure ink would feel too sharp.
- **Charcoal** (`{colors.charcoal}` — `rgba(252,253,255,0.7)`): captions, secondary nav labels.
- **Mute** (`{colors.mute}` — `#a1a4a5`): supporting text and inactive labels.
- **Ash** (`{colors.ash}` — `#888e90`): tertiary text, footer copy.
- **Stone** (`{colors.stone}` — `#464a4d`): disabled foreground.
- **On-Light** (`{colors.on-light}` — `#000000`): label colour inside the rare email-mockup white cards.
- **On-Light Mute** (`{colors.on-light-mute}` — `rgba(0,0,51,0.7)`): secondary text inside email mockups.

### Semantic
- **Accent Orange** (`{colors.accent-orange}` — `#ff801f`) + glow (`{colors.accent-orange-glow}` — `rgba(255,89,0,0.22)`): atmospheric warm wash anchored to "Email reimagined" / customer story sections. Solid orange never appears as a button or surface — only the glow.
- **Accent Yellow** (`{colors.accent-yellow}` — `#ffc53d`): used in inline highlight strokes and "first-class developer experience" key callouts.
- **Accent Blue** (`{colors.accent-blue}` — `#3b9eff`) + glow (`{colors.accent-blue-glow}` — `rgba(0,117,255,0.34)`): inline link colour and the cool atmospheric wash on the "Integrate this weekend" section.
- **Accent Green** (`{colors.accent-green}` — `#11ff99`) + glow (`{colors.accent-green-glow}` — `rgba(34,255,153,0.18)`): success status dots and the "delivery confirmed" feature glow.
- **Accent Red** (`{colors.accent-red}` — `#ff2047`) + glow (`{colors.accent-red-glow}` — `rgba(255,32,71,0.34)`): inline error red and the "reach humans, not spam folders" attention wash.
- **Link** (`{colors.link}` — `#3b9eff`): inline link colour — same as accent blue.

## Typography

### Font Family

Resend ships a four-family stack:

- **Domaine Display** — proprietary editorial serif used exclusively for hero headlines at 76px+, with `ss01 / ss04 / ss11` stylistic sets engaged for a slightly tighter, more print-magazine look.
- **ABC Favorit** — proprietary humanist sans-serif used for marketing body copy, hero subtitles, and pill labels. Carries `ss01 / ss03 / ss04` features for tabular figures and alternate glyphs.
- **Inter** — open-source sans-serif used for UI: button labels, captions, card body text, nav links.
- **Geist Mono** — open-source monospace used in code wells.

When proprietary families cannot be licensed, **Söhne** or **Tiempos Headline** stand in for Domaine Display, and **Geist** or **Inter Tight** can replace ABC Favorit. Inter and Geist Mono are open-source and should be used directly.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 96px | 400 | 1.0 | -0.96px | Home hero ("Email for developers"). One per page. |
| `{typography.display-xl}` | 76.8px | 400 | 1.0 | -0.768px | Section openers ("Email reimagined", "Available today"). |
| `{typography.display-lg}` | 56px | 400 | 1.2 | -2.8px | ABC Favorit display sub-titles. |
| `{typography.heading-md}` | 24px | 500 | 1.5 | -0.4px | Card titles, section sub-titles. |
| `{typography.heading-sm}` | 20px | 500 | 1.3 | -0.3px | List headers. |
| `{typography.subtitle}` | 20px | 400 | 1.3 | 0 | Hero subtitles. |
| `{typography.body-lg}` | 18px | 400 | 1.5 | 0 | Marketing prose. |
| `{typography.body-md}` | 16px | 400 | 1.5 | -0.8px | ABC Favorit body. |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Captions, metadata. |
| `{typography.button-md}` | 14px | 500 | 1.43 | 0 | Default button label. |
| `{typography.button-sm}` | 14px | 500 | 1.43 | 0.35px | Pill labels, inline links. |
| `{typography.caption}` | 12px | 400 | 1.5 | 0 | Footer disclosure, copyright. |
| `{typography.caption-emph}` | 14px | 600 | 1.0 | 0 | Emphatic small caption — Helvetica fallback. |
| `{typography.code-md}` | 13px | 400 | 1.6 | 0 | Code blocks, inline code. |

### Principles
- Display sizes always run at `lineHeight: 1.0` with negative letter-spacing — the Domaine Display headlines pack into solid typographic blocks rather than open prose lines.
- Body weight stays at 400 across `{typography.body-lg}` and `{typography.body-md}`. The serif/sans family change carries hierarchy, not weight bumps.
- ABC Favorit always runs with `ss01 / ss04 / ss11` engaged; Inter never carries OpenType features. Code in Geist Mono never carries ligatures.
- Inline links use `{typography.button-sm}` with positive letter-spacing (`0.35px`) and ABC Favorit — the small spacing nudge gives interactive prose its precision.

### Note on Font Substitutes

When Domaine Display is unavailable, clamp `lineHeight` to 1.0 explicitly and apply `font-feature-settings: "ss01", "liga"` on the substitute serif to mimic the alternate glyphs. Söhne or Tiempos Headline will read closest. ABC Favorit substitutes (Geist, Inter Tight) typically default to looser tracking — apply -0.5% letter-spacing on body sizes to compensate.

## Layout

### Spacing System
- **Base unit**: 4px, with the working scale on multiples of 4 / 8 / 16.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.xxxl}` 48px · `{spacing.section}` 96px · `{spacing.band}` 128px.
- Section padding: `{spacing.section}` (96px) vertical between bands; `{spacing.band}` (128px) on the hero stripe and closing footer transition.
- Card internal padding: `{spacing.xxl}` (32px) on `{component.feature-card}`, `{component.pricing-tier}`, and `{component.code-window}`.

### Grid & Container
- **Max content width** ≈ 1200px on body sections.
- **Feature grid**: 3 columns at desktop, 2 at tablet, 1 at mobile.
- **Pricing**: 3-tier grid centred at desktop; centre tier promotes to `{component.pricing-tier-featured}` (one-step-elevated surface).
- **Code-story splits**: a 2-up split — narrative copy left, `{component.code-window}` right — collapsing to stacked at < 1024px.
- **Email mockup band**: a single white card (640px max width) centred in the dark canvas with generous vertical padding to read like a print magazine inset.

### Whitespace Philosophy
- Whitespace is editorial and generous — full-bleed sections breathe at 96–128px so Domaine Display headlines have room to register at scale.
- Inside cards, padding stays at 32px so feature copy and code wells have a consistent rhythm with the outer grid.
- Hairline `{colors.hairline}` and `{colors.hairline-strong}` carry the role drop shadows would in a brighter system; the dark canvas suppresses traditional shadow depth entirely.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — flat | No shadow, no border | Default canvas, full-bleed bands. |
| 1 — surface card | `{colors.surface-card}` (`#0a0a0c`) + 1px `{colors.hairline-strong}` | Feature cards, pricing tiers, form inputs. |
| 2 — elevated | `{colors.surface-elevated}` (`#101012`) + 1px `{colors.hairline-strong}` | Featured pricing tier, ghost button. |
| 3 — code well | `{colors.surface-deep}` (`#06060a`) + 1px `{colors.hairline-strong}` | Code window, terminal shells. |
| 4 — atmospheric glow | Low-opacity radial gradient (`{colors.accent-*-glow}`) anchored at section top | Section openers ("Integrate this weekend", "Email reimagined"). |

The system has **no traditional drop shadow language**. Every surface either gets a translucent-white hairline border or sits inside an atmospheric glow. The dark canvas absorbs shadow naturally; surfaces register depth via temperature and luminance shifts rather than blur.

### Decorative Depth
- **Atmospheric section glows** — six accent colours each with a paired glow token (orange, yellow, blue, green, red, plus a deep slate for "everything in your context"). Each section opens with a single radial wash anchored at the top edge of the section, falling off to canvas black within ~600px vertical distance. Never two glows in the same section.
- **Email card insets** — the "Beyond experience" mockup band lifts a single white email card off the black canvas, giving it the only true light-on-dark contrast in the system. The card uses no shadow; the contrast itself is the elevation.
- **Code window traffic lights** — `{component.code-window}` shells include a row of three coloured dots (red `{colors.accent-red}`, yellow `{colors.accent-yellow}`, green `{colors.accent-green}`) at the top — the only place all three semantic colours appear together as solid surfaces.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero stripe, full-bleed bands, footer. |
| `{rounded.xs}` | 4px | Inline tags inside code wells. |
| `{rounded.sm}` | 6px | Code tabs, mid-size chips. |
| `{rounded.md}` | 8px | Buttons, form inputs. |
| `{rounded.lg}` | 12px | Feature cards, pricing tiers, code wells, email mockups. |
| `{rounded.xl}` | 16px | Larger feature panels. |
| `{rounded.full}` | 9999px | Pills, status dots, contributor avatars. |

### Photography Geometry
- The system uses almost no photography. Visual interest comes from typography + atmospheric glows + code wells + the white email-card insets.
- When portraits appear (testimonial avatars), they are circular (`{rounded.full}`) at 32px, sitting inline with body copy.
- Email mockup cards run at 4:5 portrait aspect with `{rounded.lg}` corners.

## Components

### Buttons

**`button-primary`** — white CTA
- Background `{colors.primary}`, label `{colors.primary-on}`, type `{typography.button-md}`, padding `8px 16px`, `rounded: {rounded.md}`, height 36px.
- The brightest pixel on the canvas. Used for "Get started", "Sign up", "Try Resend".
- Pressed state lives in `button-primary-pressed` (background `{colors.surface-light}`).

**`button-ghost`** — translucent CTA
- Background `{colors.surface-elevated}`, label `{colors.ink}`, 1px `{colors.hairline-strong}`, type `{typography.button-md}`, `rounded: {rounded.md}`, height 36px.
- Equal-weight secondary action paired with `{component.button-primary}`.

**`button-outline`** — outlined CTA
- Background `{colors.canvas}`, label `{colors.ink}`, 1px `{colors.hairline-strong}`, type `{typography.button-md}`, `rounded: {rounded.md}`, height 36px.
- Tertiary action; appears on its own next to inline links.

### Cards & Containers

**`hero-stripe`** — full-bleed hero
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.display-xxl}` for the headline, padding `96px 32px`, `rounded: {rounded.none}`.
- Used only on the home page hero band; carries the 96px Domaine Display headline and a single `{component.button-primary}` CTA. No photography, no atmospheric glow inside the hero itself — the glow appears on the section that follows.

**`feature-card`** — feature highlight card
- Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}` (32px).
- Used in the home grid: "Despite emails using React", "So beyond editing", etc. No outline by default — relies on canvas black contrast.

**`feature-card-bordered`** — outlined feature card
- Background `{colors.surface-card}`, text `{colors.ink}`, 1px `{colors.hairline-strong}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}`.
- Used when feature cards sit close together and need explicit separation.

**`pricing-tier`** — pricing tier card
- Background `{colors.surface-card}`, text `{colors.ink}`, 1px `{colors.hairline-strong}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}` (32px).
- Tier name in `{typography.heading-md}` + price in `{typography.display-lg}` (ABC Favorit, 56px).

**`pricing-tier-featured`** — recommended tier
- Background `{colors.surface-elevated}`, text `{colors.ink}`, 1px `{colors.hairline-strong}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}`.
- Centre tier elevated by surface luminance, not by colour.

**`code-window`** — code well
- Background `{colors.surface-deep}`, text `{colors.body}`, type `{typography.code-md}`, 1px `{colors.hairline-strong}`, `rounded: {rounded.lg}`, padding `{spacing.xl}` (24px).
- Includes a 3-dot traffic-light row at top using `{colors.accent-red}` / `{colors.accent-yellow}` / `{colors.accent-green}` for chrome, plus a tab strip below it.

**`code-tab`** — code language tab
- Background `{colors.surface-card}`, text `{colors.charcoal}`, type `{typography.code-md}`, `rounded: {rounded.sm}`, padding `6px 12px`.
- Active tab bumps text to `{colors.ink}` and adds a subtle `{colors.hairline-strong}` underline.

**`email-mockup`** — email-card inset
- Background `{colors.surface-card}` (or the rare `#ffffff` when rendered as a light-island inset), text `{colors.ink}` (or `{colors.on-light}` for white insets), type `{typography.body-md}`, `rounded: {rounded.lg}`, padding 0.
- Used in the "Beyond experience" band to demonstrate rendered email output.

### Inputs & Forms

**`text-input`** — default input
- Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-sm}`, 1px `{colors.hairline-strong}`, `rounded: {rounded.md}`, padding `10px 14px`, height 40px.
- Sign-up and waitlist email fields. Focus state thickens the border to `{colors.ink}` (no separate ring colour).

### Navigation

**`nav-bar`** — top nav (desktop)
- Background `{colors.canvas}`, text `{colors.body}`, type `{typography.button-sm}`, height 64px, single hairline `{colors.hairline}` bottom border.
- Left: wordmark logo. Centre: top-level nav ("Features", "Pricing", "Docs", "Customers"). Right: "Sign in" link + `{component.button-primary}`.

**`nav-bar`** (mobile)
- Same height 64px, collapses centre nav into a hamburger icon. Logo stays left, sign-in CTA stays right.

**`sub-nav-pill`** — pill-style sub-nav
- Pill chips set in a horizontal row above content (e.g. on the customers index), `{component.sub-nav-pill}` styling.

### Signature Components

**`badge-pill`** — neutral pill
- Background `{colors.surface-elevated}`, text `{colors.body}`, type `{typography.caption}`, `rounded: {rounded.full}`, padding `4px 10px`.
- Inline tags ("New", "Beta", "v3.0") inside hero copy and customer story headers.

**`status-dot`** — status indicator
- Background `{colors.accent-green}`, `rounded: {rounded.full}`, 8px square.
- Inline indicator next to "Status: Operational" in the footer or system status references.

**`contributor-avatar`** — testimonial avatar
- Background `{colors.surface-card}` placeholder, `rounded: {rounded.full}`, 32×32px.
- Used inline with customer testimonials.

**`footer`** — global footer
- Background `{colors.canvas}`, text `{colors.charcoal}`, type `{typography.body-sm}`, `rounded: {rounded.none}`, padding `64px 32px`.
- Multi-column quick-links grid above a single-line copyright row separated by `{colors.divider-soft}`.

## Do''s and Don''ts

### Do
- Use `{colors.canvas}` (true black) as the default page background. Every public page lives here.
- Reserve `{component.button-primary}` (white pill) as the only solid bright surface. One per viewport at most.
- Set hero headlines in **Domaine Display** at 76–96px with `lineHeight: 1.0` and `ss01 / ss04 / ss11` features engaged.
- Use **ABC Favorit** for marketing body, **Inter** for UI labels, **Geist Mono** for code. Keep the lanes strict.
- Build elevation from translucent-white hairlines, not drop shadows.
- Use `{colors.accent-*-glow}` tokens as low-opacity radial atmospheric washes — never as solid surfaces.
- Set buttons and inputs to `{rounded.md}` (8px); cards and code wells to `{rounded.lg}` (12px); pills and avatars to `{rounded.full}`.
- Use the white email-mockup inset sparingly — it''s the only deliberately-light surface and should feel like a print pull-quote.

### Don''t
- Don''t use a near-black canvas. The brand sits on `#000000`, not `#0a0a0a`.
- Don''t apply solid colour to atmospheric accent tokens. `{colors.accent-orange}` is for inline highlights only — its glow form is for backdrops.
- Don''t add drop shadows to feature cards or code wells. Translucent white borders carry depth on this canvas.
- Don''t bump body weight to 600 for emphasis. Use family change (Inter → ABC Favorit → Domaine Display) instead.
- Don''t render code outside `{component.code-window}` — even small inline code uses Geist Mono and a `{colors.surface-card}` background.
- Don''t loosen Domaine Display `lineHeight` past 1.0. Tight stacking is structural to the brand.
- Don''t introduce a secondary brand accent. White is the brand on black — accents are atmospheric only.
- Don''t bring photography front-and-centre. The brand reads as type-and-code, not photography-led.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop XL | ≥ 1440px | Full max-width 1200 body, 3-up feature grid, side-by-side code-story splits. |
| Desktop | 1280–1439px | Container shrinks; xl side padding. |
| Tablet Large | 1024–1279px | Feature grid stays 3-up, code-story remains 2-up. |
| Tablet | 768–1023px | Feature grid 2-up, code-story stacks (narrative on top), pricing stacks vertically. |
| Mobile Large | 426–767px | Feature grid 1-up; nav collapses to hamburger; hero `{typography.display-xxl}` clamps to 56px. |
| Mobile | ≤ 425px | All grids 1-up, hero clamps to 44px, section padding `{spacing.section}` collapses to 64px. |

### Touch Targets
- All buttons ship at minimum 36px tall on desktop, scaling to 44px on mobile via padding adjustment. WCAG AAA met on mobile.
- `{component.text-input}` is 40px tall — comfortable but not large. Mobile scales to 48px via padding.
- `{component.sub-nav-pill}` stays at 36px on desktop, 40px on mobile.

### Collapsing Strategy
- Top-level nav collapses to hamburger at < 1024px; the wordmark and `{component.button-primary}` stay anchored.
- Hero `{typography.display-xxl}` clamps: 96px → 76px → 56px → 44px across the breakpoint ladder.
- Pricing 3-up stacks vertically at < 1024px with the featured tier remaining centre-stacked.
- Code-story splits switch from side-by-side to stacked at < 1024px, code well always second.
- Atmospheric glows scale with section width but maintain the same opacity — they fade naturally at small viewports.

### Image Behavior
- Email mockup cards reflow at 1:1 aspect on mobile to remain readable.
- Atmospheric glows are CSS gradients — no asset cost, no breakpoint variation.
- Customer testimonial avatars stay 32px circular regardless of breakpoint.

## Iteration Guide

1. Focus on ONE component at a time. Most surfaces share `{colors.surface-card}` or `{colors.surface-elevated}` with `{rounded.lg}` — only the role-specific tokens (`{colors.primary}`, `{component.code-window}`) shift between variants.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.lg}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits; orphaned-tokens warnings will catch unused entries.
4. Add new variants as separate entries (`-pressed`, `-featured`, `-disabled`) — do not bury them in prose.
5. Default body type to `{typography.body-md}`; reach for `{typography.subtitle}` only on hero subtitles.
6. Keep `{colors.primary}` (white) scarce — if more than one solid white surface appears per viewport, ask whether one should drop to `{component.button-ghost}` instead.

## Known Gaps

- Pressed/active visual states are documented only for `button-primary-pressed`; other components rely on the default focus-ring (browser default) for interactive feedback.
- Logged-in dashboard surfaces (API keys, sending logs, audience management) are out of scope; only the public marketing canvas is documented.
- Email-template editor surfaces (a key product feature) are not extracted — those live behind authentication.
- The atmospheric glow rendering uses CSS radial gradients; exact stops and angles vary per section and are not standardised as tokens — render per section-specific design judgment.
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

Resend looks like a developer tool with the typography of an editorial.
Every page opens on `{colors.canvas}` (`#000000`), and the loudest element on
the canvas is not a button or a brand stamp — it''s a 96px Domaine Display
serif headline ("Email for developers", "Email reimagined") with the
`ss01 / ss04 / ss11` stylistic alternates engaged. That single typographic
decision sets the brand tone: confident, considered, slightly literary, and
priced on quality rather than novelty.

The supporting cast is technical. Body copy switches to **ABC Favorit** for
marketing prose and **Inter** for UI labels, while code blocks render in
**Geist Mono** inside `{component.code-window}` shells with hairline traffic-
light dots. Surface depth is built almost entirely from translucent white —
6% borders, 14% strong borders, 4% dividers — over a deep `{colors.surface-deep}`
layer that sits just below the canvas black. There are no gradients painted
across full bands, just **soft atmospheric glows** (orange, blue, green, red,
yellow) anchored at the top of select sections, all at low opacity.

Page rhythm cycles in a single dark register: hero stripe → atmospheric
section → code window section → email mockup section → pricing or feature
grid → black footer. The brand never warms to a light surface; even
secondary email mockups are rendered as compact white cards inside the dark
canvas, framed like print insets in a black-bordered magazine page.

**Key Characteristics:**
- Pure black canvas (`{colors.canvas}` — `#000000`) on every public page; off-white text (`{colors.ink}` — `#fcfdff`) carries the full read.
- A serif-led type system: **Domaine Display** at 76–96px for hero headlines, **ABC Favorit** for marketing body, **Inter** for UI, **Geist Mono** for code.
- Six accent glow colours used only as low-opacity atmospheric washes (`{colors.accent-orange}`, `{colors.accent-blue}`, `{colors.accent-green}`, `{colors.accent-red}`, `{colors.accent-yellow}`) — never as buttons or solid surfaces.
- Strict container vocabulary: `{rounded.lg}` (12px) for feature cards, code wells, and email mockups; `{rounded.md}` (8px) for buttons; `{rounded.full}` for pills and avatars.
- Translucent white borders (`{colors.hairline}` 6% / `{colors.hairline-strong}` 14%) replace shadows entirely — the system has no traditional drop-shadow elevation language.
- `{component.button-primary}` is a small white rectangle with black text — counterintuitive contrast that becomes the page''s brightest pixel and works as a single visual anchor.', '{"sourcePath":"docs/design-md/resend/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Primary White** (`{colors.primary}` — `#fcfdff`): the brand''s de facto accent. Reserved for `{component.button-primary}` (white pill on black canvas), Domaine display headlines, and the active text colour. White is the loudest possible colour on this canvas — that''s the signature.
- **Primary On** (`{colors.primary-on}` — `#000000`): label colour on top of `{colors.primary}` surfaces. Black text on white pill is the brand''s CTA pattern.
- **Surface Light** (`{colors.surface-light}` — `#f1f7fe`): a subtle blue-tinted off-white used as the active/pressed state of `{component.button-primary}`.

### Surface
- **Canvas** (`{colors.canvas}` — `#000000`): the default page background. True black, never near-black.
- **Surface Card** (`{colors.surface-card}` — `#0a0a0c`): the standard inset card surface, just lighter than canvas to register a step up in elevation.
- **Surface Elevated** (`{colors.surface-elevated}` — `#101012`): a second elevation step used on featured pricing tiers and ghost button surfaces.
- **Surface Deep** (`{colors.surface-deep}` — `#06060a`): code window background — slightly cooler and darker than the canvas itself, suggesting depth via temperature.
- **Hairline** (`{colors.hairline}` — `rgba(255,255,255,0.06)`): the soft 1px translucent-white divider used between rows and around feature cards.
- **Hairline Strong** (`{colors.hairline-strong}` — `rgba(255,255,255,0.14)`): the structural 1px border on cards, code wells, and form inputs.
- **Divider Soft** (`{colors.divider-soft}` — `rgba(255,255,255,0.04)`): low-contrast dividers between footer columns.

### Text
- **Ink** (`{colors.ink}` — `#fcfdff`): primary text colour on the dark canvas. Faintly blue-cool to feel like printed paper rather than pure white pop.
- **Body** (`{colors.body}` — `rgba(252,253,255,0.86)`): long-form body text where pure ink would feel too sharp.
- **Charcoal** (`{colors.charcoal}` — `rgba(252,253,255,0.7)`): captions, secondary nav labels.
- **Mute** (`{colors.mute}` — `#a1a4a5`): supporting text and inactive labels.
- **Ash** (`{colors.ash}` — `#888e90`): tertiary text, footer copy.
- **Stone** (`{colors.stone}` — `#464a4d`): disabled foreground.
- **On-Light** (`{colors.on-light}` — `#000000`): label colour inside the rare email-mockup white cards.
- **On-Light Mute** (`{colors.on-light-mute}` — `rgba(0,0,51,0.7)`): secondary text inside email mockups.

### Semantic
- **Accent Orange** (`{colors.accent-orange}` — `#ff801f`) + glow (`{colors.accent-orange-glow}` — `rgba(255,89,0,0.22)`): atmospheric warm wash anchored to "Email reimagined" / customer story sections. Solid orange never appears as a button or surface — only the glow.
- **Accent Yellow** (`{colors.accent-yellow}` — `#ffc53d`): used in inline highlight strokes and "first-class developer experience" key callouts.
- **Accent Blue** (`{colors.accent-blue}` — `#3b9eff`) + glow (`{colors.accent-blue-glow}` — `rgba(0,117,255,0.34)`): inline link colour and the cool atmospheric wash on the "Integrate this weekend" section.
- **Accent Green** (`{colors.accent-green}` — `#11ff99`) + glow (`{colors.accent-green-glow}` — `rgba(34,255,153,0.18)`): success status dots and the "delivery confirmed" feature glow.
- **Accent Red** (`{colors.accent-red}` — `#ff2047`) + glow (`{colors.accent-red-glow}` — `rgba(255,32,71,0.34)`): inline error red and the "reach humans, not spam folders" attention wash.
- **Link** (`{colors.link}` — `#3b9eff`): inline link colour — same as accent blue.', '{"sourcePath":"docs/design-md/resend/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

Resend ships a four-family stack:

- **Domaine Display** — proprietary editorial serif used exclusively for hero headlines at 76px+, with `ss01 / ss04 / ss11` stylistic sets engaged for a slightly tighter, more print-magazine look.
- **ABC Favorit** — proprietary humanist sans-serif used for marketing body copy, hero subtitles, and pill labels. Carries `ss01 / ss03 / ss04` features for tabular figures and alternate glyphs.
- **Inter** — open-source sans-serif used for UI: button labels, captions, card body text, nav links.
- **Geist Mono** — open-source monospace used in code wells.

When proprietary families cannot be licensed, **Söhne** or **Tiempos Headline** stand in for Domaine Display, and **Geist** or **Inter Tight** can replace ABC Favorit. Inter and Geist Mono are open-source and should be used directly.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 96px | 400 | 1.0 | -0.96px | Home hero ("Email for developers"). One per page. |
| `{typography.display-xl}` | 76.8px | 400 | 1.0 | -0.768px | Section openers ("Email reimagined", "Available today"). |
| `{typography.display-lg}` | 56px | 400 | 1.2 | -2.8px | ABC Favorit display sub-titles. |
| `{typography.heading-md}` | 24px | 500 | 1.5 | -0.4px | Card titles, section sub-titles. |
| `{typography.heading-sm}` | 20px | 500 | 1.3 | -0.3px | List headers. |
| `{typography.subtitle}` | 20px | 400 | 1.3 | 0 | Hero subtitles. |
| `{typography.body-lg}` | 18px | 400 | 1.5 | 0 | Marketing prose. |
| `{typography.body-md}` | 16px | 400 | 1.5 | -0.8px | ABC Favorit body. |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Captions, metadata. |
| `{typography.button-md}` | 14px | 500 | 1.43 | 0 | Default button label. |
| `{typography.button-sm}` | 14px | 500 | 1.43 | 0.35px | Pill labels, inline links. |
| `{typography.caption}` | 12px | 400 | 1.5 | 0 | Footer disclosure, copyright. |
| `{typography.caption-emph}` | 14px | 600 | 1.0 | 0 | Emphatic small caption — Helvetica fallback. |
| `{typography.code-md}` | 13px | 400 | 1.6 | 0 | Code blocks, inline code. |

### Principles
- Display sizes always run at `lineHeight: 1.0` with negative letter-spacing — the Domaine Display headlines pack into solid typographic blocks rather than open prose lines.
- Body weight stays at 400 across `{typography.body-lg}` and `{typography.body-md}`. The serif/sans family change carries hierarchy, not weight bumps.
- ABC Favorit always runs with `ss01 / ss04 / ss11` engaged; Inter never carries OpenType features. Code in Geist Mono never carries ligatures.
- Inline links use `{typography.button-sm}` with positive letter-spacing (`0.35px`) and ABC Favorit — the small spacing nudge gives interactive prose its precision.

### Note on Font Substitutes

When Domaine Display is unavailable, clamp `lineHeight` to 1.0 explicitly and apply `font-feature-settings: "ss01", "liga"` on the substitute serif to mimic the alternate glyphs. Söhne or Tiempos Headline will read closest. ABC Favorit substitutes (Geist, Inter Tight) typically default to looser tracking — apply -0.5% letter-spacing on body sizes to compensate.', '{"sourcePath":"docs/design-md/resend/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4px, with the working scale on multiples of 4 / 8 / 16.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.xxxl}` 48px · `{spacing.section}` 96px · `{spacing.band}` 128px.
- Section padding: `{spacing.section}` (96px) vertical between bands; `{spacing.band}` (128px) on the hero stripe and closing footer transition.
- Card internal padding: `{spacing.xxl}` (32px) on `{component.feature-card}`, `{component.pricing-tier}`, and `{component.code-window}`.

### Grid & Container
- **Max content width** ≈ 1200px on body sections.
- **Feature grid**: 3 columns at desktop, 2 at tablet, 1 at mobile.
- **Pricing**: 3-tier grid centred at desktop; centre tier promotes to `{component.pricing-tier-featured}` (one-step-elevated surface).
- **Code-story splits**: a 2-up split — narrative copy left, `{component.code-window}` right — collapsing to stacked at < 1024px.
- **Email mockup band**: a single white card (640px max width) centred in the dark canvas with generous vertical padding to read like a print magazine inset.

### Whitespace Philosophy
- Whitespace is editorial and generous — full-bleed sections breathe at 96–128px so Domaine Display headlines have room to register at scale.
- Inside cards, padding stays at 32px so feature copy and code wells have a consistent rhythm with the outer grid.
- Hairline `{colors.hairline}` and `{colors.hairline-strong}` carry the role drop shadows would in a brighter system; the dark canvas suppresses traditional shadow depth entirely.', '{"sourcePath":"docs/design-md/resend/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — flat | No shadow, no border | Default canvas, full-bleed bands. |
| 1 — surface card | `{colors.surface-card}` (`#0a0a0c`) + 1px `{colors.hairline-strong}` | Feature cards, pricing tiers, form inputs. |
| 2 — elevated | `{colors.surface-elevated}` (`#101012`) + 1px `{colors.hairline-strong}` | Featured pricing tier, ghost button. |
| 3 — code well | `{colors.surface-deep}` (`#06060a`) + 1px `{colors.hairline-strong}` | Code window, terminal shells. |
| 4 — atmospheric glow | Low-opacity radial gradient (`{colors.accent-*-glow}`) anchored at section top | Section openers ("Integrate this weekend", "Email reimagined"). |

The system has **no traditional drop shadow language**. Every surface either gets a translucent-white hairline border or sits inside an atmospheric glow. The dark canvas absorbs shadow naturally; surfaces register depth via temperature and luminance shifts rather than blur.

### Decorative Depth
- **Atmospheric section glows** — six accent colours each with a paired glow token (orange, yellow, blue, green, red, plus a deep slate for "everything in your context"). Each section opens with a single radial wash anchored at the top edge of the section, falling off to canvas black within ~600px vertical distance. Never two glows in the same section.
- **Email card insets** — the "Beyond experience" mockup band lifts a single white email card off the black canvas, giving it the only true light-on-dark contrast in the system. The card uses no shadow; the contrast itself is the elevation.
- **Code window traffic lights** — `{component.code-window}` shells include a row of three coloured dots (red `{colors.accent-red}`, yellow `{colors.accent-yellow}`, green `{colors.accent-green}`) at the top — the only place all three semantic colours appear together as solid surfaces.', '{"sourcePath":"docs/design-md/resend/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero stripe, full-bleed bands, footer. |
| `{rounded.xs}` | 4px | Inline tags inside code wells. |
| `{rounded.sm}` | 6px | Code tabs, mid-size chips. |
| `{rounded.md}` | 8px | Buttons, form inputs. |
| `{rounded.lg}` | 12px | Feature cards, pricing tiers, code wells, email mockups. |
| `{rounded.xl}` | 16px | Larger feature panels. |
| `{rounded.full}` | 9999px | Pills, status dots, contributor avatars. |

### Photography Geometry
- The system uses almost no photography. Visual interest comes from typography + atmospheric glows + code wells + the white email-card insets.
- When portraits appear (testimonial avatars), they are circular (`{rounded.full}`) at 32px, sitting inline with body copy.
- Email mockup cards run at 4:5 portrait aspect with `{rounded.lg}` corners.', '{"sourcePath":"docs/design-md/resend/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — white CTA
- Background `{colors.primary}`, label `{colors.primary-on}`, type `{typography.button-md}`, padding `8px 16px`, `rounded: {rounded.md}`, height 36px.
- The brightest pixel on the canvas. Used for "Get started", "Sign up", "Try Resend".
- Pressed state lives in `button-primary-pressed` (background `{colors.surface-light}`).

**`button-ghost`** — translucent CTA
- Background `{colors.surface-elevated}`, label `{colors.ink}`, 1px `{colors.hairline-strong}`, type `{typography.button-md}`, `rounded: {rounded.md}`, height 36px.
- Equal-weight secondary action paired with `{component.button-primary}`.

**`button-outline`** — outlined CTA
- Background `{colors.canvas}`, label `{colors.ink}`, 1px `{colors.hairline-strong}`, type `{typography.button-md}`, `rounded: {rounded.md}`, height 36px.
- Tertiary action; appears on its own next to inline links.

### Cards & Containers

**`hero-stripe`** — full-bleed hero
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.display-xxl}` for the headline, padding `96px 32px`, `rounded: {rounded.none}`.
- Used only on the home page hero band; carries the 96px Domaine Display headline and a single `{component.button-primary}` CTA. No photography, no atmospheric glow inside the hero itself — the glow appears on the section that follows.

**`feature-card`** — feature highlight card
- Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}` (32px).
- Used in the home grid: "Despite emails using React", "So beyond editing", etc. No outline by default — relies on canvas black contrast.

**`feature-card-bordered`** — outlined feature card
- Background `{colors.surface-card}`, text `{colors.ink}`, 1px `{colors.hairline-strong}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}`.
- Used when feature cards sit close together and need explicit separation.

**`pricing-tier`** — pricing tier card
- Background `{colors.surface-card}`, text `{colors.ink}`, 1px `{colors.hairline-strong}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}` (32px).
- Tier name in `{typography.heading-md}` + price in `{typography.display-lg}` (ABC Favorit, 56px).

**`pricing-tier-featured`** — recommended tier
- Background `{colors.surface-elevated}`, text `{colors.ink}`, 1px `{colors.hairline-strong}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}`.
- Centre tier elevated by surface luminance, not by colour.

**`code-window`** — code well
- Background `{colors.surface-deep}`, text `{colors.body}`, type `{typography.code-md}`, 1px `{colors.hairline-strong}`, `rounded: {rounded.lg}`, padding `{spacing.xl}` (24px).
- Includes a 3-dot traffic-light row at top using `{colors.accent-red}` / `{colors.accent-yellow}` / `{colors.accent-green}` for chrome, plus a tab strip below it.

**`code-tab`** — code language tab
- Background `{colors.surface-card}`, text `{colors.charcoal}`, type `{typography.code-md}`, `rounded: {rounded.sm}`, padding `6px 12px`.
- Active tab bumps text to `{colors.ink}` and adds a subtle `{colors.hairline-strong}` underline.

**`email-mockup`** — email-card inset
- Background `{colors.surface-card}` (or the rare `#ffffff` when rendered as a light-island inset), text `{colors.ink}` (or `{colors.on-light}` for white insets), type `{typography.body-md}`, `rounded: {rounded.lg}`, padding 0.
- Used in the "Beyond experience" band to demonstrate rendered email output.

### Inputs & Forms

**`text-input`** — default input
- Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.body-sm}`, 1px `{colors.hairline-strong}`, `rounded: {rounded.md}`, padding `10px 14px`, height 40px.
- Sign-up and waitlist email fields. Focus state thickens the border to `{colors.ink}` (no separate ring colour).

### Navigation

**`nav-bar`** — top nav (desktop)
- Background `{colors.canvas}`, text `{colors.body}`, type `{typography.button-sm}`, height 64px, single hairline `{colors.hairline}` bottom border.
- Left: wordmark logo. Centre: top-level nav ("Features", "Pricing", "Docs", "Customers"). Right: "Sign in" link + `{component.button-primary}`.

**`nav-bar`** (mobile)
- Same height 64px, collapses centre nav into a hamburger icon. Logo stays left, sign-in CTA stays right.

**`sub-nav-pill`** — pill-style sub-nav
- Pill chips set in a horizontal row above content (e.g. on the customers index), `{component.sub-nav-pill}` styling.

### Signature Components

**`badge-pill`** — neutral pill
- Background `{colors.surface-elevated}`, text `{colors.body}`, type `{typography.caption}`, `rounded: {rounded.full}`, padding `4px 10px`.
- Inline tags ("New", "Beta", "v3.0") inside hero copy and customer story headers.

**`status-dot`** — status indicator
- Background `{colors.accent-green}`, `rounded: {rounded.full}`, 8px square.
- Inline indicator next to "Status: Operational" in the footer or system status references.

**`contributor-avatar`** — testimonial avatar
- Background `{colors.surface-card}` placeholder, `rounded: {rounded.full}`, 32×32px.
- Used inline with customer testimonials.

**`footer`** — global footer
- Background `{colors.canvas}`, text `{colors.charcoal}`, type `{typography.body-sm}`, `rounded: {rounded.none}`, padding `64px 32px`.
- Multi-column quick-links grid above a single-line copyright row separated by `{colors.divider-soft}`.', '{"sourcePath":"docs/design-md/resend/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Use `{colors.canvas}` (true black) as the default page background. Every public page lives here.
- Reserve `{component.button-primary}` (white pill) as the only solid bright surface. One per viewport at most.
- Set hero headlines in **Domaine Display** at 76–96px with `lineHeight: 1.0` and `ss01 / ss04 / ss11` features engaged.
- Use **ABC Favorit** for marketing body, **Inter** for UI labels, **Geist Mono** for code. Keep the lanes strict.
- Build elevation from translucent-white hairlines, not drop shadows.
- Use `{colors.accent-*-glow}` tokens as low-opacity radial atmospheric washes — never as solid surfaces.
- Set buttons and inputs to `{rounded.md}` (8px); cards and code wells to `{rounded.lg}` (12px); pills and avatars to `{rounded.full}`.
- Use the white email-mockup inset sparingly — it''s the only deliberately-light surface and should feel like a print pull-quote.

### Don''t
- Don''t use a near-black canvas. The brand sits on `#000000`, not `#0a0a0a`.
- Don''t apply solid colour to atmospheric accent tokens. `{colors.accent-orange}` is for inline highlights only — its glow form is for backdrops.
- Don''t add drop shadows to feature cards or code wells. Translucent white borders carry depth on this canvas.
- Don''t bump body weight to 600 for emphasis. Use family change (Inter → ABC Favorit → Domaine Display) instead.
- Don''t render code outside `{component.code-window}` — even small inline code uses Geist Mono and a `{colors.surface-card}` background.
- Don''t loosen Domaine Display `lineHeight` past 1.0. Tight stacking is structural to the brand.
- Don''t introduce a secondary brand accent. White is the brand on black — accents are atmospheric only.
- Don''t bring photography front-and-centre. The brand reads as type-and-code, not photography-led.', '{"sourcePath":"docs/design-md/resend/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop XL | ≥ 1440px | Full max-width 1200 body, 3-up feature grid, side-by-side code-story splits. |
| Desktop | 1280–1439px | Container shrinks; xl side padding. |
| Tablet Large | 1024–1279px | Feature grid stays 3-up, code-story remains 2-up. |
| Tablet | 768–1023px | Feature grid 2-up, code-story stacks (narrative on top), pricing stacks vertically. |
| Mobile Large | 426–767px | Feature grid 1-up; nav collapses to hamburger; hero `{typography.display-xxl}` clamps to 56px. |
| Mobile | ≤ 425px | All grids 1-up, hero clamps to 44px, section padding `{spacing.section}` collapses to 64px. |

### Touch Targets
- All buttons ship at minimum 36px tall on desktop, scaling to 44px on mobile via padding adjustment. WCAG AAA met on mobile.
- `{component.text-input}` is 40px tall — comfortable but not large. Mobile scales to 48px via padding.
- `{component.sub-nav-pill}` stays at 36px on desktop, 40px on mobile.

### Collapsing Strategy
- Top-level nav collapses to hamburger at < 1024px; the wordmark and `{component.button-primary}` stay anchored.
- Hero `{typography.display-xxl}` clamps: 96px → 76px → 56px → 44px across the breakpoint ladder.
- Pricing 3-up stacks vertically at < 1024px with the featured tier remaining centre-stacked.
- Code-story splits switch from side-by-side to stacked at < 1024px, code well always second.
- Atmospheric glows scale with section width but maintain the same opacity — they fade naturally at small viewports.

### Image Behavior
- Email mockup cards reflow at 1:1 aspect on mobile to remain readable.
- Atmospheric glows are CSS gradients — no asset cost, no breakpoint variation.
- Customer testimonial avatars stay 32px circular regardless of breakpoint.', '{"sourcePath":"docs/design-md/resend/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Most surfaces share `{colors.surface-card}` or `{colors.surface-elevated}` with `{rounded.lg}` — only the role-specific tokens (`{colors.primary}`, `{component.code-window}`) shift between variants.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.button-primary-pressed}`, `{rounded.lg}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits; orphaned-tokens warnings will catch unused entries.
4. Add new variants as separate entries (`-pressed`, `-featured`, `-disabled`) — do not bury them in prose.
5. Default body type to `{typography.body-md}`; reach for `{typography.subtitle}` only on hero subtitles.
6. Keep `{colors.primary}` (white) scarce — if more than one solid white surface appears per viewport, ask whether one should drop to `{component.button-ghost}` instead.', '{"sourcePath":"docs/design-md/resend/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Pressed/active visual states are documented only for `button-primary-pressed`; other components rely on the default focus-ring (browser default) for interactive feedback.
- Logged-in dashboard surfaces (API keys, sending logs, audience management) are out of scope; only the public marketing canvas is documented.
- Email-template editor surfaces (a key product feature) are not extracted — those live behind authentication.
- The atmospheric glow rendering uses CSS radial gradients; exact stops and angles vary per section and are not standardised as tokens — render per section-specific design judgment.', '{"sourcePath":"docs/design-md/resend/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_1', '#fcfdff', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_2', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_3', '#a1a4a5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_4', '#888e90', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_5', '#464a4d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_6', '#0a0a0c', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_7', '#101012', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_8', '#06060a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_9', '#ff801f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_10', '#ffc53d', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_11', '#3b9eff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_12', '#11ff99', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_13', '#ff2047', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_14', '#f1f7fe', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_15', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md'), 'color', 'color_16', '#0a0a0a', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/resend/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/resend/DESIGN.md';


-- Revolut
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values ('Revolut', 'revolut', 'design-reference', null, now())
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
  select id, 'markdown_seed', 'docs/design-md/revolut/DESIGN.md', null, 'seeded', '---
version: alpha
name: Revolut-design-analysis
description: |
  Revolut''s marketing surfaces pair a stark black canvas with the brand''s
  cobalt-violet (`#494fdf`) and a wide accent palette of deep, fully-saturated
  product colours — teal, light-blue, deep pink, light-green, warning orange.
  The system reads as fintech-meets-product-brochure: oversized 80px–136px
  Aeonik Pro display headlines, generous whitespace, photography-led hero
  bands, and full-width product mockups (cards, phones, terminals) shown as
  hero objects inside near-black sections. Most surfaces are either black or
  off-white; pill-shaped buttons and rounded-12/20px content cards carry the
  consumer-financial-app feel without crossing into playful territory.

colors:
  primary: "#494fdf"
  primary-bright: "#4f55f1"
  primary-deep: "#3a40c4"
  on-primary: "#ffffff"
  ink: "#191c1f"
  body: "#1f2226"
  charcoal: "#3a3d40"
  mute: "#505a63"
  ash: "#5c5e60"
  stone: "#8d969e"
  faint: "#c9c9cd"
  on-dark: "#ffffff"
  on-dark-mute: "rgba(255,255,255,0.72)"
  canvas-light: "#ffffff"
  canvas-dark: "#000000"
  surface-soft: "#f4f4f4"
  surface-card: "#ffffff"
  surface-deep: "#0a0a0a"
  surface-elevated: "#16181a"
  hairline-light: "#e2e2e7"
  hairline-dark: "rgba(255,255,255,0.12)"
  hairline-strong: "#191c1f"
  divider-soft: "rgba(255,255,255,0.06)"
  accent-teal: "#00a87e"
  accent-blue-link: "#376cd5"
  accent-light-blue: "#007bc2"
  accent-light-green: "#428619"
  accent-green-text: "#006400"
  accent-yellow: "#b09000"
  accent-warning: "#ec7e00"
  accent-pink: "#e61e49"
  accent-danger: "#e23b4a"
  accent-deep-red: "#8b0000"
  accent-brown: "#936d62"
  link: "#376cd5"

typography:
  display-xxl:
    fontFamily: Aeonik Pro
    fontSize: 136px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -2.72px
  display-xl:
    fontFamily: Aeonik Pro
    fontSize: 80px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.8px
  display-lg:
    fontFamily: Aeonik Pro
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.21
    letterSpacing: -0.48px
  display-md:
    fontFamily: Aeonik Pro
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.4px
  heading-lg:
    fontFamily: Aeonik Pro
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.19
    letterSpacing: -0.32px
  heading-md:
    fontFamily: Aeonik Pro
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: 0
  heading-sm:
    fontFamily: Aeonik Pro
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.56
    letterSpacing: -0.09px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.24px
  body-md-bold:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0.16px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
  button-lg:
    fontFamily: Aeonik Pro
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
  button-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0.24px
  button-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.43
  caption:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
  link-emph:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0.24px

rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 28px
  full: 9999px

spacing:
  xxs: 4px
  xs: 6px
  sm: 8px
  md: 14px
  lg: 16px
  xl: 24px
  xxl: 32px
  xxxl: 48px
  block: 80px
  section: 88px
  band: 120px

components:
  button-primary:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.canvas-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 14px 28px
    height: 48px
  button-primary-pressed:
    backgroundColor: "{colors.faint}"
    textColor: "{colors.canvas-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
  button-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 14px 28px
    height: 48px
  button-soft:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 14px 28px
    height: 48px
  button-outline-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 13px 27px
    height: 48px
  button-outline-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 13px 27px
    height: 48px
  button-pill-sm:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 8px 16px
    height: 36px
  text-input:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 14px 16px
    height: 56px
  hero-band-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xxl}"
    rounded: "{rounded.none}"
    padding: 88px 24px
  hero-band-photo:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xl}"
    rounded: "{rounded.none}"
    padding: 0
  feature-card-light:
    backgroundColor: "{colors.canvas-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  feature-card-dark:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  plan-card:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  plan-card-featured:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  product-mockup:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.xl}"
    padding: 48px
  download-tile:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 56px
  badge-tag:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  badge-feature:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  nav-bar:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    height: 64px
  sub-nav-pill:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 8px 16px
  footer:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark-mute}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 80px 24px
---

## Overview

Revolut''s marketing canvas operates in a high-contrast two-mode system: a
**near-black storytelling canvas** (`{colors.canvas-dark}` — `#000000`)
that hosts hero bands, product mockups, and the planning section, alternating
with **white catalogue bands** (`{colors.canvas-light}` — `#ffffff`) that
host comparison tables, FAQ rows, and download tiles. The two modes switch
in full-bleed bands rather than soft transitions; sections slam against each
other to create the magazine-spread rhythm the brand is known for.

The display typography is **Aeonik Pro at weight 500**, used at sizes from
20px to 136px. The flagship hero ("Banking & Beyond", "Join the 70+ million
using Revolut") sits at 80–136px with `lineHeight: 1.0` and tight negative
letter-spacing. Body type is **Inter** at weight 400 — open-source,
no-nonsense, paired with positive tracking (`0.24px`) on UI labels for
slightly more mechanical precision.

The brand accent is `{colors.primary}` (`#494fdf`) — a saturated cobalt
violet — but it appears scarcely on marketing surfaces. The actual primary
CTA on the hero is the **white pill on black** ("Choose your subscription"),
and the cobalt violet is reserved for featured plan cards, secondary CTAs in
white sections, and the brand glyph itself. A wide secondary palette of deep
teal, light-blue, deep-pink, light-green, warning orange, and yellow appears
inside product mockups and feature illustrations — never as button surfaces.

**Key Characteristics:**
- Two-mode canvas system — `{colors.canvas-dark}` (true black) for storytelling, `{colors.canvas-light}` (white) for browsing — switched in full-bleed bands.
- Display typography is **Aeonik Pro 500** at sizes 20–136px with tight `lineHeight: 1.0` and large negative letter-spacing on display sizes.
- The actual primary CTA is `{component.button-primary}` — a **white pill with black text**, sitting on the dark canvas as the brightest pixel. Cobalt-violet `{colors.primary}` is reserved for featured plan cards and secondary CTAs.
- Eight saturated accent colours live inside product mockups and illustrations only, never as button surfaces — teal, light-blue, deep-pink, light-green, warning orange, yellow, brown, danger red.
- All buttons are pill-shaped (`{rounded.full}`); content cards use `{rounded.lg}` (20px); inputs and small chips use `{rounded.md}` (12px).
- Photography is product-led — phone mockups, card mockups, terminal mockups — shown full-bleed inside dark sections with no caption overlay.

## Colors

### Brand & Accent
- **Cobalt Violet** (`{colors.primary}` — `#494fdf`): the brand accent. Reserved for featured plan cards (`{component.plan-card-featured}`), the brand wordmark icon, and secondary CTAs in white-canvas regions.
- **Cobalt Bright** (`{colors.primary-bright}` — `#4f55f1`): a one-step-up bright variant used in inline link colour and accent-photo headers.
- **Cobalt Deep** (`{colors.primary-deep}` — `#3a40c4`): the active/pressed state of cobalt elements.
- **On-Primary** (`{colors.on-primary}` — `#ffffff`): label colour on top of `{colors.primary}` surfaces.

### Surface
- **Canvas Light** (`{colors.canvas-light}` — `#ffffff`): the white catalogue mode for FAQ, download tiles, comparison tables.
- **Canvas Dark** (`{colors.canvas-dark}` — `#000000`): the storytelling canvas — true black, never near-black.
- **Surface Soft** (`{colors.surface-soft}` — `#f4f4f4`): a subtle off-white used on download tiles, soft buttons, and inset card groups inside white bands.
- **Surface Card** (`{colors.surface-card}` — `#ffffff`): pure white card surface, used for feature cards in white-canvas regions.
- **Surface Deep** (`{colors.surface-deep}` — `#0a0a0a`): a one-step-up dark surface for inset cards inside black-canvas regions.
- **Surface Elevated** (`{colors.surface-elevated}` — `#16181a`): the planning-section card background — slightly luminous, lifts plan cards off the black canvas.
- **Hairline Light** (`{colors.hairline-light}` — `#e2e2e7`): 1px dividers inside white bands.
- **Hairline Dark** (`{colors.hairline-dark}` — `rgba(255,255,255,0.12)`): the corresponding low-contrast divider in dark regions.
- **Hairline Strong** (`{colors.hairline-strong}` — `#191c1f`): structural full-strength dividers and the outline of light cards.

### Text
- **Ink** (`{colors.ink}` — `#191c1f`): primary text colour. Notably warmer than pure black, paired with the white canvas for body legibility.
- **Body** (`{colors.body}` — `#1f2226`): long-form body where `{colors.ink}` would feel slightly too sharp.
- **Charcoal** (`{colors.charcoal}` — `#3a3d40`): captions, secondary nav.
- **Mute** (`{colors.mute}` — `#505a63`): supporting text.
- **Ash** (`{colors.ash}` — `#5c5e60`): tertiary text, footer copy.
- **Stone** (`{colors.stone}` — `#8d969e`): metadata, subtle captions.
- **Faint** (`{colors.faint}` — `#c9c9cd`): disabled foreground, hairline replacements.
- **On-Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.canvas-dark}`.
- **On-Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.72)`): secondary text in dark regions.

### Semantic
- **Accent Teal** (`{colors.accent-teal}` — `#00a87e`): used in product mockup illustrations.
- **Accent Light Blue** (`{colors.accent-light-blue}` — `#007bc2`): inline link colour in dark photo headers.
- **Accent Blue Link** (`{colors.accent-blue-link}` — `#376cd5`): default inline link colour on white surfaces.
- **Accent Light Green** (`{colors.accent-light-green}` — `#428619`): success / positive product callouts.
- **Accent Green Text** (`{colors.accent-green-text}` — `#006400`): inline success text.
- **Accent Yellow** (`{colors.accent-yellow}` — `#b09000`): caution / pending state in product mockups.
- **Accent Warning** (`{colors.accent-warning}` — `#ec7e00`): full-saturation orange used in warning illustrations.
- **Accent Pink** (`{colors.accent-pink}` — `#e61e49`): deep pink — used inside product photography and category iconography.
- **Accent Danger** (`{colors.accent-danger}` — `#e23b4a`): destructive / error state.
- **Accent Deep Red** (`{colors.accent-deep-red}` — `#8b0000`): inline error text.
- **Accent Brown** (`{colors.accent-brown}` — `#936d62`): a single warm-neutral used in metals tier card chrome.
- **Link** (`{colors.link}` — `#376cd5`): default inline link colour. Same as `{colors.accent-blue-link}`.

## Typography

### Font Family

Revolut ships a two-family stack:

- **Aeonik Pro** — proprietary humanist sans-serif used for all display sizes (20px+) at weight 500. Carries the brand''s editorial confidence; tightens dramatically with negative letter-spacing at large sizes.
- **Inter** — open-source workhorse for body, button labels, captions, and metadata. Always at weight 400 or 600, with positive tracking (`0.16–0.24px`) on UI labels.

When Aeonik Pro cannot be licensed, **Inter Display**, **General Sans**, or **Söhne** are credible substitutes — all share the warm geometric character. Apply -1% letter-spacing on display sizes to match the original tightness.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 136px | 500 | 1.0 | -2.72px | The flagship hero ("Banking & Beyond"). One per page. |
| `{typography.display-xl}` | 80px | 500 | 1.0 | -0.8px | Section openers ("Join the 70+ million using Revolut"). |
| `{typography.display-lg}` | 48px | 500 | 1.21 | -0.48px | Sub-section titles. |
| `{typography.display-md}` | 40px | 500 | 1.2 | -0.4px | Feature card titles. |
| `{typography.heading-lg}` | 32px | 500 | 1.19 | -0.32px | Plan card titles. |
| `{typography.heading-md}` | 24px | 500 | 1.33 | 0 | Section sub-titles. |
| `{typography.heading-sm}` | 20px | 500 | 1.4 | 0 | List headers, prominent labels. |
| `{typography.body-lg}` | 18px | 400 | 1.56 | -0.09px | Marketing prose. |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0.24px | Default body. |
| `{typography.body-md-bold}` | 16px | 600 | 1.5 | 0.16px | Emphatic body. |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Captions, metadata. |
| `{typography.button-lg}` | 20px | 500 | 1.4 | 0 | Hero CTAs (Aeonik Pro). |
| `{typography.button-md}` | 16px | 600 | 1.5 | 0.24px | Default button label. |
| `{typography.button-sm}` | 14px | 600 | 1.43 | 0 | Pill chips, sub-nav. |
| `{typography.caption}` | 13px | 400 | 1.4 | 0 | Footer disclosure, regulatory text. |
| `{typography.link-emph}` | 16px | 700 | 1.5 | 0.24px | Emphatic inline link in dark mode. |

### Principles
- Display sizes always run at weight 500 with `lineHeight: 1.0` (or 1.19–1.21 below 48px). The negative letter-spacing scales with size — bigger types tighten more.
- Body Inter sits at weight 400 with positive tracking (`0.24px`) — the small spacing nudge makes UI labels feel slightly mechanical, fitting fintech precision.
- Hero CTAs use the Aeonik Pro `{typography.button-lg}` variant; everything below the hero uses the Inter `{typography.button-md}`.
- Inline links inside dark photo regions step up to weight 700 (`{typography.link-emph}`) so they hold contrast against the canvas without using the cobalt accent.

### Note on Font Substitutes

When Aeonik Pro is unavailable, clamp display `lineHeight` to 1.0 explicitly and apply -1% letter-spacing on display sizes. Inter Display, General Sans, or Söhne will read closest to the original. Inter is open-source and should be used directly.

## Layout

### Spacing System
- **Base unit**: 4px, with the working scale on multiples of 4 / 8 / 16.
- **Tokens**: `{spacing.xxs}` 4px · `{spacing.xs}` 6px · `{spacing.sm}` 8px · `{spacing.md}` 14px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.xxxl}` 48px · `{spacing.block}` 80px · `{spacing.section}` 88px · `{spacing.band}` 120px.
- Section padding: `{spacing.section}` (88px) vertical between bands; `{spacing.band}` (120px) on the hero band and the closing planning section.
- Card internal padding: `{spacing.xxl}` (32px) on `{component.feature-card-light}`, `{component.plan-card}`, `{component.feature-card-dark}`.

### Grid & Container
- **Max content width** ≈ 1200px on body sections; hero bands run full-bleed.
- **Plan grid**: 4-up plan cards on the home page, stacking 2-up at tablet and 1-up at small mobile.
- **Feature grid**: 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Product mockup bands**: a single full-width hero photo of a phone or card mockup, no surrounding chrome — the asset itself is the section.

### Whitespace Philosophy
- Whitespace is generous and editorial — sections breathe at 88–120px so display headlines have room to register at 80–136px without feeling cramped.
- Inside cards, padding stays at 32px so feature copy and plan tiers have a consistent rhythm.
- Hairline `{colors.hairline-light}` dividers replace shadow on white surfaces; `{colors.hairline-dark}` carries the corresponding role in dark regions.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — flat | No shadow, no border | Default canvas bands (light or dark), full-bleed hero. |
| 1 — surface card | `{colors.surface-card}` (white) on `{colors.surface-soft}` band | Feature cards inside light bands. |
| 2 — surface elevated dark | `{colors.surface-elevated}` (`#16181a`) on `{colors.canvas-dark}` | Plan cards inside the planning section. |
| 3 — featured surface | `{colors.primary}` on `{colors.canvas-dark}` | Featured plan card (cobalt violet inversion). |
| 4 — product mockup | Full-bleed photo asset | Hero phone / card / terminal mockup bands. |

The system has **no traditional drop-shadow language**. Surfaces register depth via colour-blocking (light → dark band switches) and surface-luminance shifts (`{colors.canvas-dark}` → `{colors.surface-elevated}`). Photography mockups carry their own depth from the asset itself.

### Decorative Depth
- **Product mockup hero bands** — the home page features a phone mockup full-bleed against `{colors.canvas-dark}`, with the device''s own glow providing the only atmospheric depth. No additional gradients, no shadows.
- **Featured plan card** — the cobalt-violet `{component.plan-card-featured}` sits inside the otherwise dark planning grid as a single saturated colour block, marking the recommended tier visually.
- **Card metals tier** — the brand uses `{colors.accent-brown}` and a deep gradient on metals card mockups to signal premium without resorting to gold-on-black metallic effects.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero bands, full-bleed sections, footer. |
| `{rounded.sm}` | 8px | Inline tags, small chips. |
| `{rounded.md}` | 12px | Form inputs, download tiles. |
| `{rounded.lg}` | 20px | Feature cards, plan cards. |
| `{rounded.xl}` | 28px | Product mockup containers. |
| `{rounded.full}` | 9999px | Buttons, pills, badges, tabs. |

### Photography Geometry
- Phone mockups: 9:19.5 (vertical) with `{rounded.xl}` corners on the device chrome.
- Card mockups: 1.586:1 (credit-card aspect) with `{rounded.lg}` corners.
- Terminal/POS mockups: 4:3 with `{rounded.xl}` corners and substantial padding around the device.
- Lifestyle photography (rare): 16:9 with `{rounded.lg}` corners.

## Components

### Buttons

**`button-primary`** — white CTA on dark
- Background `{colors.canvas-light}`, label `{colors.canvas-dark}`, type `{typography.button-md}`, padding `14px 28px`, `rounded: {rounded.full}`, height 48px.
- The brand''s primary CTA, used on every dark hero band ("Choose your subscription", "Get started").
- Pressed state lives in `button-primary-pressed` (background `{colors.faint}`).

**`button-dark`** — dark CTA on light
- Background `{colors.canvas-dark}`, label `{colors.on-dark}`, type `{typography.button-md}`, `rounded: {rounded.full}`.
- The reverse-canvas equivalent of `{component.button-primary}` — used inside white catalogue bands.

**`button-soft`** — soft surface CTA
- Background `{colors.surface-soft}`, label `{colors.ink}`, type `{typography.button-md}`, `rounded: {rounded.full}`.
- Tertiary action in white-canvas regions ("Learn more", "View FAQs").

**`button-outline-light`** — outlined CTA on light
- Background `{colors.canvas-light}`, label `{colors.ink}`, 1px solid `{colors.hairline-strong}`, type `{typography.button-md}`, `rounded: {rounded.full}`.
- Secondary action when paired with `{component.button-dark}`.

**`button-outline-dark`** — outlined CTA on dark
- Background `{colors.canvas-dark}`, label `{colors.on-dark}`, 1px solid `{colors.on-dark}`, type `{typography.button-md}`, `rounded: {rounded.full}`, padding `13px 27px`, height 48px.
- Dark-canvas counterpart of `{component.button-outline-light}`; used inside dark hero bands as a tertiary action when paired with `{component.button-primary}`.

**`button-pill-sm`** — small pill chip
- Background `{colors.surface-soft}`, label `{colors.ink}`, type `{typography.button-sm}`, `rounded: {rounded.full}`, padding `8px 16px`, height 36px.
- Sub-nav chips, filter pills.

### Cards & Containers

**`hero-band-dark`** — full-bleed dark hero
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, type `{typography.display-xxl}` for the title, padding `{spacing.section}` (88px) vertical, `rounded: {rounded.none}`.
- Used only on the home page hero band.

**`hero-band-photo`** — photo-led hero
- Background `{colors.canvas-dark}` with full-bleed product photography, text `{colors.on-dark}`, type `{typography.display-xl}`, `rounded: {rounded.none}`.
- Used on product pages — phone or card mockup as the full-band canvas.

**`feature-card-light`** — feature card on white
- Background `{colors.surface-card}`, text `{colors.ink}`, 1px solid `{colors.hairline-light}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}` (32px).
- Used in white catalogue bands for feature comparisons.

**`feature-card-dark`** — feature card on dark
- Background `{colors.surface-elevated}`, text `{colors.on-dark}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}`.
- Used inside dark storytelling sections.

**`plan-card`** — subscription plan card
- Background `{colors.surface-elevated}`, text `{colors.on-dark}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}` (32px).
- Plan name in `{typography.heading-lg}` ("Standard", "Plus", "Premium", "Metal", "Ultra").

**`plan-card-featured`** — featured plan card
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}`.
- Cobalt-violet inversion of `{component.plan-card}` — used on the recommended tier.

**`product-mockup`** — full-bleed product asset
- Background `{colors.canvas-dark}`, the asset itself fills the band, `rounded: {rounded.xl}` on the device chrome.
- Phone, card, and terminal mockups — no caption overlay, no surrounding chrome.

**`download-tile`** — app store download tile
- Background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.body-sm}`, `rounded: {rounded.md}`, padding `12px 20px`, height 56px.
- App Store + Google Play download buttons, side-by-side.

### Inputs & Forms

**`text-input`** — default input
- Background `{colors.canvas-light}`, text `{colors.ink}`, type `{typography.body-md}`, 1px solid `{colors.hairline-light}`, `rounded: {rounded.md}`, padding `14px 16px`, height 56px.
- Generous height for fintech accessibility — comfortably exceeds WCAG AAA touch target.

### Navigation

**`nav-bar`** — top nav (desktop)
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, type `{typography.button-md}`, height 64px.
- Left: wordmark logo. Centre: top-level nav ("Personal", "Business", "Company"). Right: language switcher + "Log in" + `{component.button-primary}`.

**`nav-bar`** (mobile)
- Same height 64px, collapses centre nav into a hamburger icon. Logo stays left, sign-in CTA stays right.

**`sub-nav-pill`** — sub-nav chip
- Pill chips set in a horizontal row inside dark sections (e.g. "Personal", "Business", "Premium"), `{component.sub-nav-pill}` styling.

### Signature Components

**`badge-tag`** — neutral tag
- Background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.caption}`, `rounded: {rounded.full}`, padding `4px 12px`.
- Inline tags inside feature cards.

**`badge-feature`** — feature highlight badge
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.caption}`, `rounded: {rounded.full}`, padding `4px 12px`.
- "New", "Most popular" badges anchored on plan cards.

**`footer`** — global footer
- Background `{colors.canvas-dark}`, text `{colors.on-dark-mute}`, type `{typography.body-sm}`, `rounded: {rounded.none}`, padding `80px 24px`.
- Multi-column quick-links grid above a copyright + regulatory disclosure block separated by `{colors.divider-soft}`.

## Do''s and Don''ts

### Do
- Switch full bands between `{colors.canvas-dark}` (storytelling) and `{colors.canvas-light}` (catalogue). The two-mode rhythm is core.
- Use `{component.button-primary}` (white pill on dark) as the primary CTA on every dark hero band. It''s the brand''s loudest action.
- Reserve `{colors.primary}` for the featured plan card and the brand wordmark — the cobalt should feel like a deliberate stamp, not a colour theme.
- Set hero headlines in **Aeonik Pro 500** at 80–136px with `lineHeight: 1.0` and large negative letter-spacing.
- Use **Inter** for body, button labels, captions — never substitute Aeonik Pro for body type.
- Apply `{rounded.full}` to every button and pill; `{rounded.lg}` (20px) to feature and plan cards; `{rounded.md}` (12px) to inputs.
- Show product mockups full-bleed inside dark sections — the asset IS the section.
- Use the wide accent palette (`{colors.accent-teal}`, `{colors.accent-pink}`, `{colors.accent-light-green}`, etc.) inside product illustrations and iconography only.

### Don''t
- Don''t use accent colours (`{colors.accent-teal}`, `{colors.accent-pink}`, etc.) as button surfaces. They live inside illustrations only.
- Don''t use a near-black canvas. The brand is `#000000`, not `#0a0a0a`.
- Don''t pair white text with cobalt violet inside body content — `{colors.primary}` is for the featured plan card surface, not large prose.
- Don''t add drop shadows on cards. Elevation is canvas + surface-luminance shifts.
- Don''t introduce a secondary brand colour. Cobalt violet is the only brand stamp.
- Don''t loosen Aeonik Pro `lineHeight` past 1.0 on display sizes. Tight stacking is structural.
- Don''t bump body Inter to weight 500. Use 400 (default) or 600 (emphatic) — never the in-between.
- Don''t pair `{colors.canvas-dark}` with another dark surface beyond `{colors.surface-elevated}`. The surface ladder has only two dark steps.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop XL | ≥ 1440px | 4-up plan grid, full-bleed product mockup bands, max content 1200. |
| Desktop | 1280–1439px | Container shrinks; xl side padding. |
| Tablet Large | 1024–1279px | Plan grid 4-up; feature grid 3-up. |
| Tablet | 768–1023px | Plan grid 2-up; feature grid 2-up. |
| Mobile Large | 426–767px | Plan grid 1-up; feature grid 1-up; nav collapses to hamburger; hero `display-xxl` clamps to 64px. |
| Mobile | ≤ 425px | All grids 1-up; hero clamps to 48px; section padding `{spacing.section}` collapses to 64px. |

### Touch Targets
- All buttons ship at minimum 48px tall — comfortably exceeds WCAG AAA (44px). Default `{component.button-primary}` is 48px.
- `{component.text-input}` is 56px tall — fintech-grade accessibility.
- `{component.button-pill-sm}` (36px) is bumped to 44px on mobile via padding adjustment.

### Collapsing Strategy
- Top-level nav collapses to hamburger at < 1024px; the wordmark and `{component.button-primary}` stay anchored.
- Hero `{typography.display-xxl}` clamps: 136px → 80px → 64px → 48px across the breakpoint ladder.
- Plan grid steps from 4-up to 2-up at < 1024px to 1-up at < 768px.
- Product mockup bands maintain full-bleed at every breakpoint; the asset crops inward rather than letterboxing.
- Sub-nav pills convert from a wrap row to a horizontal scroll-rail at < 768px.

### Image Behavior
- Phone and card mockups are served at 1.5× and 2× DPR; below 768px the system swaps to a smaller hero crop.
- Product photography retains its own atmospheric lighting at every breakpoint — no responsive variant assets.

## Iteration Guide

1. Focus on ONE component at a time. Most surfaces share the `{colors.canvas-dark}` / `{colors.canvas-light}` pair with `{rounded.full}` for buttons and `{rounded.lg}` for cards.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.plan-card-featured}`, `{rounded.lg}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits; orphaned-tokens warnings will catch unused entries.
4. Add new variants as separate entries (`-pressed`, `-featured`, `-disabled`) — do not bury them in prose.
5. Default body type to `{typography.body-md}` (Inter 400 with positive tracking); reach for `{typography.body-md-bold}` only on emphasis.
6. Keep `{colors.primary}` scarce — if more than one cobalt-violet element appears per viewport, ask whether one should drop to `{component.plan-card}` (`{colors.surface-elevated}`) instead.

## Known Gaps

- Pressed/active visual states are documented for `button-primary-pressed` only; other components rely on focus-ring (browser default) for interactive feedback.
- Logged-in app surfaces (transactions, transfers, account settings) are out of scope — only the public marketing canvas is documented.
- The wide accent palette (`{colors.accent-teal}` through `{colors.accent-brown}`) is captured from the extracted token set, but exact usage inside product illustrations varies per market and product line; document per-illustration rather than as system buttons.
- Mobile-app screenshot art direction (phone bezels, status bars) is product-photography territory and not standardised as design tokens.
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

Revolut''s marketing canvas operates in a high-contrast two-mode system: a
**near-black storytelling canvas** (`{colors.canvas-dark}` — `#000000`)
that hosts hero bands, product mockups, and the planning section, alternating
with **white catalogue bands** (`{colors.canvas-light}` — `#ffffff`) that
host comparison tables, FAQ rows, and download tiles. The two modes switch
in full-bleed bands rather than soft transitions; sections slam against each
other to create the magazine-spread rhythm the brand is known for.

The display typography is **Aeonik Pro at weight 500**, used at sizes from
20px to 136px. The flagship hero ("Banking & Beyond", "Join the 70+ million
using Revolut") sits at 80–136px with `lineHeight: 1.0` and tight negative
letter-spacing. Body type is **Inter** at weight 400 — open-source,
no-nonsense, paired with positive tracking (`0.24px`) on UI labels for
slightly more mechanical precision.

The brand accent is `{colors.primary}` (`#494fdf`) — a saturated cobalt
violet — but it appears scarcely on marketing surfaces. The actual primary
CTA on the hero is the **white pill on black** ("Choose your subscription"),
and the cobalt violet is reserved for featured plan cards, secondary CTAs in
white sections, and the brand glyph itself. A wide secondary palette of deep
teal, light-blue, deep-pink, light-green, warning orange, and yellow appears
inside product mockups and feature illustrations — never as button surfaces.

**Key Characteristics:**
- Two-mode canvas system — `{colors.canvas-dark}` (true black) for storytelling, `{colors.canvas-light}` (white) for browsing — switched in full-bleed bands.
- Display typography is **Aeonik Pro 500** at sizes 20–136px with tight `lineHeight: 1.0` and large negative letter-spacing on display sizes.
- The actual primary CTA is `{component.button-primary}` — a **white pill with black text**, sitting on the dark canvas as the brightest pixel. Cobalt-violet `{colors.primary}` is reserved for featured plan cards and secondary CTAs.
- Eight saturated accent colours live inside product mockups and illustrations only, never as button surfaces — teal, light-blue, deep-pink, light-green, warning orange, yellow, brown, danger red.
- All buttons are pill-shaped (`{rounded.full}`); content cards use `{rounded.lg}` (20px); inputs and small chips use `{rounded.md}` (12px).
- Photography is product-led — phone mockups, card mockups, terminal mockups — shown full-bleed inside dark sections with no caption overlay.', '{"sourcePath":"docs/design-md/revolut/DESIGN.md","category":"overview"}'::jsonb, 0.75, 1),
((select id from d), 'colors', 'Colors', 'colors', '## Colors

### Brand & Accent
- **Cobalt Violet** (`{colors.primary}` — `#494fdf`): the brand accent. Reserved for featured plan cards (`{component.plan-card-featured}`), the brand wordmark icon, and secondary CTAs in white-canvas regions.
- **Cobalt Bright** (`{colors.primary-bright}` — `#4f55f1`): a one-step-up bright variant used in inline link colour and accent-photo headers.
- **Cobalt Deep** (`{colors.primary-deep}` — `#3a40c4`): the active/pressed state of cobalt elements.
- **On-Primary** (`{colors.on-primary}` — `#ffffff`): label colour on top of `{colors.primary}` surfaces.

### Surface
- **Canvas Light** (`{colors.canvas-light}` — `#ffffff`): the white catalogue mode for FAQ, download tiles, comparison tables.
- **Canvas Dark** (`{colors.canvas-dark}` — `#000000`): the storytelling canvas — true black, never near-black.
- **Surface Soft** (`{colors.surface-soft}` — `#f4f4f4`): a subtle off-white used on download tiles, soft buttons, and inset card groups inside white bands.
- **Surface Card** (`{colors.surface-card}` — `#ffffff`): pure white card surface, used for feature cards in white-canvas regions.
- **Surface Deep** (`{colors.surface-deep}` — `#0a0a0a`): a one-step-up dark surface for inset cards inside black-canvas regions.
- **Surface Elevated** (`{colors.surface-elevated}` — `#16181a`): the planning-section card background — slightly luminous, lifts plan cards off the black canvas.
- **Hairline Light** (`{colors.hairline-light}` — `#e2e2e7`): 1px dividers inside white bands.
- **Hairline Dark** (`{colors.hairline-dark}` — `rgba(255,255,255,0.12)`): the corresponding low-contrast divider in dark regions.
- **Hairline Strong** (`{colors.hairline-strong}` — `#191c1f`): structural full-strength dividers and the outline of light cards.

### Text
- **Ink** (`{colors.ink}` — `#191c1f`): primary text colour. Notably warmer than pure black, paired with the white canvas for body legibility.
- **Body** (`{colors.body}` — `#1f2226`): long-form body where `{colors.ink}` would feel slightly too sharp.
- **Charcoal** (`{colors.charcoal}` — `#3a3d40`): captions, secondary nav.
- **Mute** (`{colors.mute}` — `#505a63`): supporting text.
- **Ash** (`{colors.ash}` — `#5c5e60`): tertiary text, footer copy.
- **Stone** (`{colors.stone}` — `#8d969e`): metadata, subtle captions.
- **Faint** (`{colors.faint}` — `#c9c9cd`): disabled foreground, hairline replacements.
- **On-Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.canvas-dark}`.
- **On-Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.72)`): secondary text in dark regions.

### Semantic
- **Accent Teal** (`{colors.accent-teal}` — `#00a87e`): used in product mockup illustrations.
- **Accent Light Blue** (`{colors.accent-light-blue}` — `#007bc2`): inline link colour in dark photo headers.
- **Accent Blue Link** (`{colors.accent-blue-link}` — `#376cd5`): default inline link colour on white surfaces.
- **Accent Light Green** (`{colors.accent-light-green}` — `#428619`): success / positive product callouts.
- **Accent Green Text** (`{colors.accent-green-text}` — `#006400`): inline success text.
- **Accent Yellow** (`{colors.accent-yellow}` — `#b09000`): caution / pending state in product mockups.
- **Accent Warning** (`{colors.accent-warning}` — `#ec7e00`): full-saturation orange used in warning illustrations.
- **Accent Pink** (`{colors.accent-pink}` — `#e61e49`): deep pink — used inside product photography and category iconography.
- **Accent Danger** (`{colors.accent-danger}` — `#e23b4a`): destructive / error state.
- **Accent Deep Red** (`{colors.accent-deep-red}` — `#8b0000`): inline error text.
- **Accent Brown** (`{colors.accent-brown}` — `#936d62`): a single warm-neutral used in metals tier card chrome.
- **Link** (`{colors.link}` — `#376cd5`): default inline link colour. Same as `{colors.accent-blue-link}`.', '{"sourcePath":"docs/design-md/revolut/DESIGN.md","category":"colors"}'::jsonb, 0.75, 2),
((select id from d), 'typography', 'Typography', 'typography', '## Typography

### Font Family

Revolut ships a two-family stack:

- **Aeonik Pro** — proprietary humanist sans-serif used for all display sizes (20px+) at weight 500. Carries the brand''s editorial confidence; tightens dramatically with negative letter-spacing at large sizes.
- **Inter** — open-source workhorse for body, button labels, captions, and metadata. Always at weight 400 or 600, with positive tracking (`0.16–0.24px`) on UI labels.

When Aeonik Pro cannot be licensed, **Inter Display**, **General Sans**, or **Söhne** are credible substitutes — all share the warm geometric character. Apply -1% letter-spacing on display sizes to match the original tightness.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 136px | 500 | 1.0 | -2.72px | The flagship hero ("Banking & Beyond"). One per page. |
| `{typography.display-xl}` | 80px | 500 | 1.0 | -0.8px | Section openers ("Join the 70+ million using Revolut"). |
| `{typography.display-lg}` | 48px | 500 | 1.21 | -0.48px | Sub-section titles. |
| `{typography.display-md}` | 40px | 500 | 1.2 | -0.4px | Feature card titles. |
| `{typography.heading-lg}` | 32px | 500 | 1.19 | -0.32px | Plan card titles. |
| `{typography.heading-md}` | 24px | 500 | 1.33 | 0 | Section sub-titles. |
| `{typography.heading-sm}` | 20px | 500 | 1.4 | 0 | List headers, prominent labels. |
| `{typography.body-lg}` | 18px | 400 | 1.56 | -0.09px | Marketing prose. |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0.24px | Default body. |
| `{typography.body-md-bold}` | 16px | 600 | 1.5 | 0.16px | Emphatic body. |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Captions, metadata. |
| `{typography.button-lg}` | 20px | 500 | 1.4 | 0 | Hero CTAs (Aeonik Pro). |
| `{typography.button-md}` | 16px | 600 | 1.5 | 0.24px | Default button label. |
| `{typography.button-sm}` | 14px | 600 | 1.43 | 0 | Pill chips, sub-nav. |
| `{typography.caption}` | 13px | 400 | 1.4 | 0 | Footer disclosure, regulatory text. |
| `{typography.link-emph}` | 16px | 700 | 1.5 | 0.24px | Emphatic inline link in dark mode. |

### Principles
- Display sizes always run at weight 500 with `lineHeight: 1.0` (or 1.19–1.21 below 48px). The negative letter-spacing scales with size — bigger types tighten more.
- Body Inter sits at weight 400 with positive tracking (`0.24px`) — the small spacing nudge makes UI labels feel slightly mechanical, fitting fintech precision.
- Hero CTAs use the Aeonik Pro `{typography.button-lg}` variant; everything below the hero uses the Inter `{typography.button-md}`.
- Inline links inside dark photo regions step up to weight 700 (`{typography.link-emph}`) so they hold contrast against the canvas without using the cobalt accent.

### Note on Font Substitutes

When Aeonik Pro is unavailable, clamp display `lineHeight` to 1.0 explicitly and apply -1% letter-spacing on display sizes. Inter Display, General Sans, or Söhne will read closest to the original. Inter is open-source and should be used directly.', '{"sourcePath":"docs/design-md/revolut/DESIGN.md","category":"typography"}'::jsonb, 0.75, 3),
((select id from d), 'layout', 'Layout', 'layout', '## Layout

### Spacing System
- **Base unit**: 4px, with the working scale on multiples of 4 / 8 / 16.
- **Tokens**: `{spacing.xxs}` 4px · `{spacing.xs}` 6px · `{spacing.sm}` 8px · `{spacing.md}` 14px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.xxxl}` 48px · `{spacing.block}` 80px · `{spacing.section}` 88px · `{spacing.band}` 120px.
- Section padding: `{spacing.section}` (88px) vertical between bands; `{spacing.band}` (120px) on the hero band and the closing planning section.
- Card internal padding: `{spacing.xxl}` (32px) on `{component.feature-card-light}`, `{component.plan-card}`, `{component.feature-card-dark}`.

### Grid & Container
- **Max content width** ≈ 1200px on body sections; hero bands run full-bleed.
- **Plan grid**: 4-up plan cards on the home page, stacking 2-up at tablet and 1-up at small mobile.
- **Feature grid**: 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Product mockup bands**: a single full-width hero photo of a phone or card mockup, no surrounding chrome — the asset itself is the section.

### Whitespace Philosophy
- Whitespace is generous and editorial — sections breathe at 88–120px so display headlines have room to register at 80–136px without feeling cramped.
- Inside cards, padding stays at 32px so feature copy and plan tiers have a consistent rhythm.
- Hairline `{colors.hairline-light}` dividers replace shadow on white surfaces; `{colors.hairline-dark}` carries the corresponding role in dark regions.', '{"sourcePath":"docs/design-md/revolut/DESIGN.md","category":"layout"}'::jsonb, 0.75, 4),
((select id from d), 'elevation', 'Elevation & Depth', 'elevation', '## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — flat | No shadow, no border | Default canvas bands (light or dark), full-bleed hero. |
| 1 — surface card | `{colors.surface-card}` (white) on `{colors.surface-soft}` band | Feature cards inside light bands. |
| 2 — surface elevated dark | `{colors.surface-elevated}` (`#16181a`) on `{colors.canvas-dark}` | Plan cards inside the planning section. |
| 3 — featured surface | `{colors.primary}` on `{colors.canvas-dark}` | Featured plan card (cobalt violet inversion). |
| 4 — product mockup | Full-bleed photo asset | Hero phone / card / terminal mockup bands. |

The system has **no traditional drop-shadow language**. Surfaces register depth via colour-blocking (light → dark band switches) and surface-luminance shifts (`{colors.canvas-dark}` → `{colors.surface-elevated}`). Photography mockups carry their own depth from the asset itself.

### Decorative Depth
- **Product mockup hero bands** — the home page features a phone mockup full-bleed against `{colors.canvas-dark}`, with the device''s own glow providing the only atmospheric depth. No additional gradients, no shadows.
- **Featured plan card** — the cobalt-violet `{component.plan-card-featured}` sits inside the otherwise dark planning grid as a single saturated colour block, marking the recommended tier visually.
- **Card metals tier** — the brand uses `{colors.accent-brown}` and a deep gradient on metals card mockups to signal premium without resorting to gold-on-black metallic effects.', '{"sourcePath":"docs/design-md/revolut/DESIGN.md","category":"elevation"}'::jsonb, 0.75, 5),
((select id from d), 'shapes', 'Shapes', 'shapes', '## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero bands, full-bleed sections, footer. |
| `{rounded.sm}` | 8px | Inline tags, small chips. |
| `{rounded.md}` | 12px | Form inputs, download tiles. |
| `{rounded.lg}` | 20px | Feature cards, plan cards. |
| `{rounded.xl}` | 28px | Product mockup containers. |
| `{rounded.full}` | 9999px | Buttons, pills, badges, tabs. |

### Photography Geometry
- Phone mockups: 9:19.5 (vertical) with `{rounded.xl}` corners on the device chrome.
- Card mockups: 1.586:1 (credit-card aspect) with `{rounded.lg}` corners.
- Terminal/POS mockups: 4:3 with `{rounded.xl}` corners and substantial padding around the device.
- Lifestyle photography (rare): 16:9 with `{rounded.lg}` corners.', '{"sourcePath":"docs/design-md/revolut/DESIGN.md","category":"shapes"}'::jsonb, 0.75, 6),
((select id from d), 'components', 'Components', 'components', '## Components

### Buttons

**`button-primary`** — white CTA on dark
- Background `{colors.canvas-light}`, label `{colors.canvas-dark}`, type `{typography.button-md}`, padding `14px 28px`, `rounded: {rounded.full}`, height 48px.
- The brand''s primary CTA, used on every dark hero band ("Choose your subscription", "Get started").
- Pressed state lives in `button-primary-pressed` (background `{colors.faint}`).

**`button-dark`** — dark CTA on light
- Background `{colors.canvas-dark}`, label `{colors.on-dark}`, type `{typography.button-md}`, `rounded: {rounded.full}`.
- The reverse-canvas equivalent of `{component.button-primary}` — used inside white catalogue bands.

**`button-soft`** — soft surface CTA
- Background `{colors.surface-soft}`, label `{colors.ink}`, type `{typography.button-md}`, `rounded: {rounded.full}`.
- Tertiary action in white-canvas regions ("Learn more", "View FAQs").

**`button-outline-light`** — outlined CTA on light
- Background `{colors.canvas-light}`, label `{colors.ink}`, 1px solid `{colors.hairline-strong}`, type `{typography.button-md}`, `rounded: {rounded.full}`.
- Secondary action when paired with `{component.button-dark}`.

**`button-outline-dark`** — outlined CTA on dark
- Background `{colors.canvas-dark}`, label `{colors.on-dark}`, 1px solid `{colors.on-dark}`, type `{typography.button-md}`, `rounded: {rounded.full}`, padding `13px 27px`, height 48px.
- Dark-canvas counterpart of `{component.button-outline-light}`; used inside dark hero bands as a tertiary action when paired with `{component.button-primary}`.

**`button-pill-sm`** — small pill chip
- Background `{colors.surface-soft}`, label `{colors.ink}`, type `{typography.button-sm}`, `rounded: {rounded.full}`, padding `8px 16px`, height 36px.
- Sub-nav chips, filter pills.

### Cards & Containers

**`hero-band-dark`** — full-bleed dark hero
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, type `{typography.display-xxl}` for the title, padding `{spacing.section}` (88px) vertical, `rounded: {rounded.none}`.
- Used only on the home page hero band.

**`hero-band-photo`** — photo-led hero
- Background `{colors.canvas-dark}` with full-bleed product photography, text `{colors.on-dark}`, type `{typography.display-xl}`, `rounded: {rounded.none}`.
- Used on product pages — phone or card mockup as the full-band canvas.

**`feature-card-light`** — feature card on white
- Background `{colors.surface-card}`, text `{colors.ink}`, 1px solid `{colors.hairline-light}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}` (32px).
- Used in white catalogue bands for feature comparisons.

**`feature-card-dark`** — feature card on dark
- Background `{colors.surface-elevated}`, text `{colors.on-dark}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}`.
- Used inside dark storytelling sections.

**`plan-card`** — subscription plan card
- Background `{colors.surface-elevated}`, text `{colors.on-dark}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}` (32px).
- Plan name in `{typography.heading-lg}` ("Standard", "Plus", "Premium", "Metal", "Ultra").

**`plan-card-featured`** — featured plan card
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.body-md}`, `rounded: {rounded.lg}`, padding `{spacing.xxl}`.
- Cobalt-violet inversion of `{component.plan-card}` — used on the recommended tier.

**`product-mockup`** — full-bleed product asset
- Background `{colors.canvas-dark}`, the asset itself fills the band, `rounded: {rounded.xl}` on the device chrome.
- Phone, card, and terminal mockups — no caption overlay, no surrounding chrome.

**`download-tile`** — app store download tile
- Background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.body-sm}`, `rounded: {rounded.md}`, padding `12px 20px`, height 56px.
- App Store + Google Play download buttons, side-by-side.

### Inputs & Forms

**`text-input`** — default input
- Background `{colors.canvas-light}`, text `{colors.ink}`, type `{typography.body-md}`, 1px solid `{colors.hairline-light}`, `rounded: {rounded.md}`, padding `14px 16px`, height 56px.
- Generous height for fintech accessibility — comfortably exceeds WCAG AAA touch target.

### Navigation

**`nav-bar`** — top nav (desktop)
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, type `{typography.button-md}`, height 64px.
- Left: wordmark logo. Centre: top-level nav ("Personal", "Business", "Company"). Right: language switcher + "Log in" + `{component.button-primary}`.

**`nav-bar`** (mobile)
- Same height 64px, collapses centre nav into a hamburger icon. Logo stays left, sign-in CTA stays right.

**`sub-nav-pill`** — sub-nav chip
- Pill chips set in a horizontal row inside dark sections (e.g. "Personal", "Business", "Premium"), `{component.sub-nav-pill}` styling.

### Signature Components

**`badge-tag`** — neutral tag
- Background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.caption}`, `rounded: {rounded.full}`, padding `4px 12px`.
- Inline tags inside feature cards.

**`badge-feature`** — feature highlight badge
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.caption}`, `rounded: {rounded.full}`, padding `4px 12px`.
- "New", "Most popular" badges anchored on plan cards.

**`footer`** — global footer
- Background `{colors.canvas-dark}`, text `{colors.on-dark-mute}`, type `{typography.body-sm}`, `rounded: {rounded.none}`, padding `80px 24px`.
- Multi-column quick-links grid above a copyright + regulatory disclosure block separated by `{colors.divider-soft}`.', '{"sourcePath":"docs/design-md/revolut/DESIGN.md","category":"components"}'::jsonb, 0.75, 7),
((select id from d), 'dos_and_donts', 'Do''s and Don''ts', 'dos_and_donts', '## Do''s and Don''ts

### Do
- Switch full bands between `{colors.canvas-dark}` (storytelling) and `{colors.canvas-light}` (catalogue). The two-mode rhythm is core.
- Use `{component.button-primary}` (white pill on dark) as the primary CTA on every dark hero band. It''s the brand''s loudest action.
- Reserve `{colors.primary}` for the featured plan card and the brand wordmark — the cobalt should feel like a deliberate stamp, not a colour theme.
- Set hero headlines in **Aeonik Pro 500** at 80–136px with `lineHeight: 1.0` and large negative letter-spacing.
- Use **Inter** for body, button labels, captions — never substitute Aeonik Pro for body type.
- Apply `{rounded.full}` to every button and pill; `{rounded.lg}` (20px) to feature and plan cards; `{rounded.md}` (12px) to inputs.
- Show product mockups full-bleed inside dark sections — the asset IS the section.
- Use the wide accent palette (`{colors.accent-teal}`, `{colors.accent-pink}`, `{colors.accent-light-green}`, etc.) inside product illustrations and iconography only.

### Don''t
- Don''t use accent colours (`{colors.accent-teal}`, `{colors.accent-pink}`, etc.) as button surfaces. They live inside illustrations only.
- Don''t use a near-black canvas. The brand is `#000000`, not `#0a0a0a`.
- Don''t pair white text with cobalt violet inside body content — `{colors.primary}` is for the featured plan card surface, not large prose.
- Don''t add drop shadows on cards. Elevation is canvas + surface-luminance shifts.
- Don''t introduce a secondary brand colour. Cobalt violet is the only brand stamp.
- Don''t loosen Aeonik Pro `lineHeight` past 1.0 on display sizes. Tight stacking is structural.
- Don''t bump body Inter to weight 500. Use 400 (default) or 600 (emphatic) — never the in-between.
- Don''t pair `{colors.canvas-dark}` with another dark surface beyond `{colors.surface-elevated}`. The surface ladder has only two dark steps.', '{"sourcePath":"docs/design-md/revolut/DESIGN.md","category":"dos_and_donts"}'::jsonb, 0.75, 8),
((select id from d), 'responsive_guidelines', 'Responsive Behavior', 'responsive_guidelines', '## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop XL | ≥ 1440px | 4-up plan grid, full-bleed product mockup bands, max content 1200. |
| Desktop | 1280–1439px | Container shrinks; xl side padding. |
| Tablet Large | 1024–1279px | Plan grid 4-up; feature grid 3-up. |
| Tablet | 768–1023px | Plan grid 2-up; feature grid 2-up. |
| Mobile Large | 426–767px | Plan grid 1-up; feature grid 1-up; nav collapses to hamburger; hero `display-xxl` clamps to 64px. |
| Mobile | ≤ 425px | All grids 1-up; hero clamps to 48px; section padding `{spacing.section}` collapses to 64px. |

### Touch Targets
- All buttons ship at minimum 48px tall — comfortably exceeds WCAG AAA (44px). Default `{component.button-primary}` is 48px.
- `{component.text-input}` is 56px tall — fintech-grade accessibility.
- `{component.button-pill-sm}` (36px) is bumped to 44px on mobile via padding adjustment.

### Collapsing Strategy
- Top-level nav collapses to hamburger at < 1024px; the wordmark and `{component.button-primary}` stay anchored.
- Hero `{typography.display-xxl}` clamps: 136px → 80px → 64px → 48px across the breakpoint ladder.
- Plan grid steps from 4-up to 2-up at < 1024px to 1-up at < 768px.
- Product mockup bands maintain full-bleed at every breakpoint; the asset crops inward rather than letterboxing.
- Sub-nav pills convert from a wrap row to a horizontal scroll-rail at < 768px.

### Image Behavior
- Phone and card mockups are served at 1.5× and 2× DPR; below 768px the system swaps to a smaller hero crop.
- Product photography retains its own atmospheric lighting at every breakpoint — no responsive variant assets.', '{"sourcePath":"docs/design-md/revolut/DESIGN.md","category":"responsive_guidelines"}'::jsonb, 0.75, 9),
((select id from d), 'other', 'Iteration Guide', 'other', '## Iteration Guide

1. Focus on ONE component at a time. Most surfaces share the `{colors.canvas-dark}` / `{colors.canvas-light}` pair with `{rounded.full}` for buttons and `{rounded.lg}` for cards.
2. Reference component names and tokens directly (`{colors.primary}`, `{component.plan-card-featured}`, `{rounded.lg}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits; orphaned-tokens warnings will catch unused entries.
4. Add new variants as separate entries (`-pressed`, `-featured`, `-disabled`) — do not bury them in prose.
5. Default body type to `{typography.body-md}` (Inter 400 with positive tracking); reach for `{typography.body-md-bold}` only on emphasis.
6. Keep `{colors.primary}` scarce — if more than one cobalt-violet element appears per viewport, ask whether one should drop to `{component.plan-card}` (`{colors.surface-elevated}`) instead.', '{"sourcePath":"docs/design-md/revolut/DESIGN.md","category":"other"}'::jsonb, 0.75, 10),
((select id from d), 'known_gaps', 'Known Gaps', 'known_gaps', '## Known Gaps

- Pressed/active visual states are documented for `button-primary-pressed` only; other components rely on focus-ring (browser default) for interactive feedback.
- Logged-in app surfaces (transactions, transfers, account settings) are out of scope — only the public marketing canvas is documented.
- The wide accent palette (`{colors.accent-teal}` through `{colors.accent-brown}`) is captured from the extracted token set, but exact usage inside product illustrations varies per market and product line; document per-illustration rather than as system buttons.
- Mobile-app screenshot art direction (phone bezels, status bars) is product-photography territory and not standardised as design tokens.', '{"sourcePath":"docs/design-md/revolut/DESIGN.md","category":"known_gaps"}'::jsonb, 0.75, 11);

insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)
values
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_1', '#494fdf', 'primary_detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_2', '#4f55f1', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_3', '#3a40c4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_4', '#ffffff', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_5', '#191c1f', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_6', '#1f2226', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_7', '#3a3d40', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_8', '#505a63', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_9', '#5c5e60', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_10', '#8d969e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_11', '#c9c9cd', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_12', '#000000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_13', '#f4f4f4', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_14', '#0a0a0a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_15', '#16181a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_16', '#e2e2e7', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_17', '#00a87e', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_18', '#376cd5', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_19', '#007bc2', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_20', '#428619', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_21', '#006400', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_22', '#b09000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_23', '#ec7e00', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_24', '#e61e49', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_25', '#e23b4a', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_26', '#8b0000', 'detected', 'Extracted from DESIGN.md'),
((select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md'), 'color', 'color_27', '#936d62', 'detected', 'Extracted from DESIGN.md');

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = 'docs/design-md/revolut/DESIGN.md')
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = 'docs/design-md/revolut/DESIGN.md';

