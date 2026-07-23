---
type: integrated_design_brief_sample
runKey: "promo-sample"
promptGroupId: "SAMPLE"
generatedAt: "2026-06-30T00:00:00.000Z"
promoTitle: "GGPoker Welcome Bonus"
selectedMd: "Cohere"
selectedMdSlug: "cohere"
template: "Template 4"
canvasSize: "1024x1536"
pageWidth: "1440px scaled to fit"
language: "English only"
sourceDocuments:
  - "DESIGN.md / Selected Design MD"
  - "B Section Input Log / sectionInputs"
  - "promo-ui-design-image-generation.md / System Prompt Template"
---

# Integrated Design Brief MD

This document is a self-contained UI design-generation brief. A downstream image-generation prompt step must be able to create the final Web UI design image by reading only this document, without re-reading the original DESIGN.md, B-section input log, designBrief JSON, layoutMapping JSON, or system prompt template.

All visible UI copy in the generated design must be English. If source content contains Korean or another language, translate and adapt it into concise natural English before using it in the design.

## Source Priority Rules

- Style source priority: the selected Design MD is the binding source for colors, typography, radius, spacing rhythm, component language, depth/effects, visual mood, and layout philosophy.
- Content source priority: B-section `sectionInputs` are the primary source for visible copy, CTA labels, links, section text, legal text, and visual mode.
- Template source priority: `promo-ui-design-image-generation.md` defines the required output format, Template 4 section order, JSON shape, and compliance requirements.
- Promo metadata is fallback only. Use it only when a required `sectionInputs` value is empty or missing.
- Design Style values from the B-section payload may be used as explicit overrides or language fallbacks, but they must not replace the selected Design MD unless the conflict is documented.
- Structural conflicts must be resolved in favor of the original template and content contract. Template 4 has seven sections and must not be collapsed into six sections.
- Non-destructive integration is required. When values conflict, record both source values, the adopted value, and the reason.

## Resolved Conflicts

| Item | Design MD Value | B Section / Content Value | Template Rule | Adopted Value | Reason |
| --- | --- | --- | --- | --- | --- |
| Section count | Design MD may describe layout bands conceptually | `sectionInputs` contains `header`, `heroBanner`, `stepBar`, `contentCta`, `imageTextRow`, `titleDescription`, `footer` | Template 4 requires Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Title and Description, Footer | Seven sections | The content contract and template both require Title and Description and Footer as separate sections. |
| Footer handling | Legal/footer may be visually compact | Legal text appears in `titleDescription`; license/footer appears in `footer` | Title and Description must not be collapsed into Footer | Separate Title and Description plus Footer | Prevents bottom content loss and supports visual verification. |
| Typography | Hanken Grotesk for headings/body, JetBrains Mono for labels | Pretendard may appear as a generated fallback | No template override | Hanken Grotesk primary, JetBrains Mono labels, Pretendard fallback only | Design MD owns typography; Pretendard can support multilingual fallback but final visible copy is English. |
| CTA shape | Pill CTA required | CTA label from content is "Join Now" | CTA must be visible | Pill-shaped "Join Now" CTA | Design MD owns shape; content owns label. |
| Depth model | No heavy shadows; use borders and tonal layering | No explicit conflict | Avoid generic card-heavy landing page | Border-based elevation, no drop shadows | Prevents color/font-only reskin and keeps MD compliance visible. |
| Canvas strategy | Full-page Web UI design mockup | Seven content sections must be visible | Image output uses tall canvas | 1024x1536 full-page mockup, 1440px page scaled down | Prevents bottom crop and keeps all sections visible in one image. |

## Non-Negotiable Rules

- Generate a Web UI design image prompt, not HTML/CSS.
- The final image must look like a polished full-page desktop Web UI design mockup, not a cropped browser screenshot.
- Use a tall `1024x1536` canvas representing a `1440px` desktop page scaled down to fit vertically.
- All seven Template 4 sections must be visible: Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Title and Description, Footer.
- Do not crop the bottom. Footer must be visible.
- Do not merge Title and Description into Footer.
- Use B-section `sectionInputs` as the visible content source. Promo metadata is fallback only.
- Render all visible UI text in English only.
- If content is too long, compress section height, visual asset size, spacing, and decorative elements before removing content.
- Avoid browser chrome, editor UI, Figma canvas UI, code, and generic SaaS landing page patterns.
- Prove MD compliance through layout, structure, spacing, component language, depth/effects, and shape/radius, not only color and font.

## MD Compliance Map

```json
{
  "layoutPhilosophy": "Use a precise, technical, full-page composition with alternating white surfaces and dark architectural bands. The page should feel like a designed Web UI system, not a loose marketing poster.",
  "visualMood": "Restrained, confident, technical, and high-contrast with disciplined use of accent color for primary actions.",
  "spacingRhythm": "Use a compact 8px-based spacing rhythm so all seven sections fit into a 1024x1536 full-page image without cropping. Major sections should be visibly separated but vertically compressed.",
  "composition": "Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Title and Description, and Footer are stacked top-to-bottom in a complete full-page mockup.",
  "componentStyle": "CTAs are pill-shaped. Cards and panels use thin borders and restrained radius. Labels and badges use monospaced technical styling.",
  "depthAndEffects": "Avoid heavy shadows. Use tonal layering, borders, contrast bands, and shape differences to create hierarchy.",
  "shapeAndRadius": "Use larger radius for major bands/media and smaller radius for cards/panels. CTA buttons must be fully pill-shaped.",
  "promoPageImplications": "The promo offer must be readable and action-oriented, while legal and footer content remain visible and separate.",
  "dosApplied": [
    "Apply selected Design MD layout and component language beyond colors and fonts.",
    "Keep all seven Template 4 sections visible.",
    "Use sectionInputs as the visible content contract.",
    "Translate all visible text into English.",
    "Compress vertical spacing instead of omitting content."
  ],
  "dontsAvoided": [
    "Do not crop the footer.",
    "Do not make a hero-only image.",
    "Do not merge Title and Description with Footer.",
    "Do not use generic SaaS landing page composition.",
    "Do not use non-English visible UI text."
  ],
  "notColorFontOnlyProof": "The design applies the selected MD through section rhythm, full-page stacking, dark-band hierarchy, border-based depth, pill CTA shapes, radius hierarchy, compact vertical fit strategy, and explicit Template 4 content mapping, not merely through color or font substitutions."
}
```

## Section Content Mapping

### Header

- Source fields: `sectionInputs.header.logoText`, `sectionInputs.header.badgeText`.
- Visible English copy:
  - Logo: "Cohere"
  - Badge: "Global"
- Visual treatment: white surface, thin bottom border, technical badge on the right.
- Vertical allocation/compression note: keep header shallow, approximately 56-72px visual height.
- MD rule applied: precise technical header, monospaced metadata, restrained border.
- Fallback behavior: if badge is missing, use market metadata in English.

### Hero Banner

- Source fields: `sectionInputs.heroBanner.leaderText`, `title`, `sublineText`, `cta`, `alphaText`, `visualMode`.
- Visible English copy:
  - Eyebrow: "Recommended Promotion"
  - Title: "GGPoker Welcome Bonus"
  - Subline: "Give new players a first deposit bonus and tournament tickets"
  - CTA: "Join Now"
  - Legal microcopy: "Terms, eligibility, regional availability, and 18+ responsible play apply."
- Visual treatment: dominant hero band with strong hierarchy, one focused supporting visual if `visualMode` is `use_visual`.
- Vertical allocation/compression note: hero should be impactful but not oversized; use approximately 22-26% of the image height.
- MD rule applied: high-contrast band, restrained technical system, pill CTA.
- Fallback behavior: if leader text is non-English, translate to concise English.

### Step Bar

- Source fields: `sectionInputs.stepBar[0..2].title`, `description`, `link`.
- Visible English copy:
  - Step 1: "Sign Up" / "Create your account and join GGPoker for the first time."
  - Step 2: "Claim Rewards" / "Make your first deposit and unlock the welcome bonus package."
  - Step 3: "Start Playing" / "Move directly into cash games and tournaments."
- Visual treatment: three compact cards or a horizontal step strip with technical labels.
- Vertical allocation/compression note: keep cards compact with short descriptions; avoid large icons.
- MD rule applied: border-based cards, monospaced step labels, no heavy shadows.
- Fallback behavior: translate non-English step titles into natural English.

### Content CTA

- Source fields: `sectionInputs.contentCta.longText`, `sectionInputs.contentCta.cta`, `visualMode`.
- Visible English copy:
  - Body: "Follow a clear reward path from registration to your first games and tournaments."
  - CTA: "Join Now"
- Visual treatment: dark band or strong tonal section with CTA placed clearly.
- Vertical allocation/compression note: use one concise text block and one CTA; avoid secondary paragraphs.
- MD rule applied: full-width band, pill CTA, high contrast.
- Fallback behavior: if long text is missing, use `simpleBrief.secondaryMessage` translated to English.

### Image Text Row

- Source fields: `sectionInputs.imageTextRow.headerTitle`, `headerDescription`, `title`, `description`, `visualMode`.
- Visible English copy:
  - Eyebrow: "Welcome Bonus Details"
  - Heading: "Sign up, make your first deposit, and claim your welcome rewards"
  - Description: "A clear path for new players to register, deposit, and enter games quickly."
- Visual treatment: compact image panel plus text block; if visual is used, make it supportive and not dominant.
- Vertical allocation/compression note: use a balanced two-column row with reduced image height.
- MD rule applied: structured content row, radius hierarchy, restrained visual density.
- Fallback behavior: if header text is non-English, translate into concise English.

### Title and Description

- Source fields: `sectionInputs.titleDescription.title`, `sectionInputs.titleDescription.contents`.
- Visible English copy:
  - Title: "Terms and Conditions"
  - Body: "This promotion is subject to GGPoker terms and conditions and applicable local regulations. Bonus eligibility, validity period, and participating regions may vary. Available only to responsible players aged 18 or older."
- Visual treatment: standalone white panel or terms block, visually separate from footer.
- Vertical allocation/compression note: use condensed legal text, small but readable.
- MD rule applied: legal content remains visible and separated, not hidden in footer.
- Fallback behavior: if terms text is long, summarize without deleting required 18+ and eligibility meaning.

### Footer

- Source fields: `sectionInputs.footer.logoText`, `sectionInputs.footer.licenseBadges`.
- Visible English copy:
  - Logo: "Cohere"
  - Badges: "Visa · Mastercard · 18+ · BeGambleAware"
- Visual treatment: final footer band, visually present at bottom of image.
- Vertical allocation/compression note: compact footer height, but never cropped.
- MD rule applied: technical footer, monospaced badges, dark band hierarchy.
- Fallback behavior: if badges are missing, show "18+ · Terms Apply".

## Design Style Basis

```json
{
  "canvas": "Full-page Web UI mockup, 1024x1536 image, representing a 1440px desktop page scaled down",
  "primarySurface": "White or off-white canvas from selected Design MD",
  "darkBands": "Use selected MD dark band colors only where the MD calls for strong section hierarchy",
  "cta": "Pill-shaped primary CTA, label from sectionInputs, translated to English",
  "typography": "Selected Design MD typography as primary; fallback fonts only for rendering support",
  "radius": "Selected Design MD radius hierarchy: larger bands/media, smaller cards/panels, pill CTA",
  "depth": "No heavy drop shadows; use borders, tonal layers, contrast, and shape hierarchy",
  "language": "English-only visible copy"
}
```

## Visual Direction

- Canvas strategy: create a single full-page Web UI design image, not a viewport crop.
- Vertical fit strategy: compress section spacing, reduce visual asset height, use concise text, and avoid oversized hero treatment.
- Hero strategy: visually strong but limited in height so lower sections remain visible.
- Supporting visual strategy: use visuals only where `visualMode` requires them; keep them compact.
- Typography strategy: strong hierarchy with readable English copy; legal text may be smaller but must remain legible.
- Component strategy: pill CTA, compact cards, technical badges, border-based hierarchy.
- Footer strategy: keep footer visible at the bottom with brand and compliance badges.

## Final Image Prompt Inputs

### Image Prompt Direction

Create a polished full-page desktop promotional Web UI design mockup as a single `1024x1536` image. The design represents a `1440px` desktop page scaled down to fit vertically. Use only the details in this integrated brief. Show all seven Template 4 sections from Header through Footer. Do not crop the bottom. Render all visible text in English only.

### Section Order

1. Header
2. Hero Banner
3. Step Bar
4. Content CTA
5. Image Text Row
6. Title and Description
7. Footer

### Must Show

- "Cohere" brand in the header and footer.
- "GGPoker Welcome Bonus" hero title.
- "Join Now" CTA.
- Three-step reward path.
- Content CTA block.
- Image Text Row details.
- Separate "Terms and Conditions" section.
- Footer with "Visa · Mastercard · 18+ · BeGambleAware".

### Must Avoid

- Cropped bottom.
- Missing Footer.
- Missing Title and Description.
- Hero-only screenshot.
- Generic SaaS landing page.
- Non-English visible UI copy.
- Browser chrome, editor UI, or Figma canvas UI.
- Color/font-only reskin without structural MD compliance.

### Negative Prompt

```text
cropped bottom, missing footer, missing Title and Description, hero-only screenshot, middle-page screenshot, generic landing page, weak MD compliance, color/font-only reskin, unreadable text, non-English UI copy, Korean text, wrong section order, browser chrome, editor UI, Figma canvas UI, heavy drop shadows, squared CTA buttons
```

## Visual QA Checklist

- [ ] The final image is a full-page Web UI design mockup, not a cropped viewport.
- [ ] The image uses a tall `1024x1536` canvas or equivalent full-page vertical composition.
- [ ] All seven Template 4 sections are visible in order.
- [ ] Footer is visible and not cropped.
- [ ] Title and Description is separate from Footer.
- [ ] All visible UI copy is English.
- [ ] CTA text is "Join Now" and CTA shape is pill-style.
- [ ] Legal / 18+ / eligibility information is visible.
- [ ] The design applies MD structure through layout, spacing, components, depth, and radius, not only through colors/fonts.
- [ ] No browser chrome, editor UI, or Figma canvas UI appears.
