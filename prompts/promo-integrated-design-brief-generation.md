# Promo Integrated Design Brief Generation Prompt

Create a detailed self-contained integrated design brief for generating a promotional Web UI design image.

Return valid JSON only. Do not include markdown fences or explanations outside JSON.

## Critical Purpose

- This is not a summary.
- This document must be a complete design-generation request document.
- A downstream image-generation LLM must be able to create the final Web UI design by reading only this integrated brief.
- The brief must be usable by other LLMs or design agents, not only this n8n workflow.
- The resulting design must read as a Web UI design mockup, not as a poster, flyer, brochure, presentation slide, editorial cover, print ad, or key visual.
- Do not require the downstream step to re-read DESIGN.md, content.md, sectionInputs JSON, layoutMapping JSON, designBrief JSON, or promo-ui-design-image-generation.md.
- Restate all adopted values, visible copy, design rules, section mappings, conflicts, and final imagePrompt inputs inside this document.

## Source Priority Rules

- DESIGN.md / selected Design MD controls style: colors, typography, spacing, radius, component language, layout philosophy, visual mood, depth/effects, dos, and donts.
- B Section Input Log / sectionInputs controls visible content: copy, CTA text, links, legal text, section text, visualMode, footer labels.
- promo-ui-design-image-generation.md controls output format, Template 4 section order, compliance map, negative prompt expectations, and image-generation constraints.
- Promo metadata is fallback only when sectionInputs are missing.
- If values conflict, do not silently discard either value. Document the conflict and explain the adopted value.

## Language Rule

- All visible UI copy in the final design must be English only.
- If source content is Korean or another language, translate and adapt it into concise natural English.

## Canvas And Full-Page Rule

- The final bitmap may use a 1024x1536 export size, but that export size is not the page's real web proportion and must not be treated as a poster artboard.
- It represents a 1440px desktop Web UI page scaled into the bitmap.
- This is a full-page Web UI design mockup, not a cropped viewport screenshot.
- It should look like a browserless screenshot or design mockup of a real scrollable webpage, not a print composition.
- Header through Footer must be visible in one image.
- Do not crop the bottom.
- Do not merge Title and Description into Footer.
- If content is long, compress spacing, section height, visual size, and decoration before removing content.

## Required Markdown Structure

The `integratedDesignBriefMarkdown` must include exactly these sections in this order:

1. YAML frontmatter
2. `# Integrated Design Brief MD`
3. `## Source Priority Rules`
4. `## Resolved Conflicts`
5. `## Non-Negotiable Rules`
6. `## MD Compliance Map`
7. `## Section Content Mapping`
8. `## Design Style Basis`
9. `## Visual Direction`
10. `## Final Image Prompt Inputs`
11. `## Negative Prompt`
12. `## Visual QA Checklist`

### YAML frontmatter must include

- type
- runKey
- promptGroupId if available
- promoTitle
- selectedMd
- selectedMdSlug
- template
- canvasSize
- pageWidth
- language
- sourceDocuments

### Source Priority Rules must include

- Style priority
- Content priority
- Template priority
- Promo metadata fallback rule
- Design Style override rule
- Structural conflict rule
- Non-destructive integration rule

### Resolved Conflicts must be a markdown table with columns

`| Item | Design MD Value | B Section / Content Value | Template Rule | Adopted Value | Reason |`

Include conflicts for at least:

- Section count / section order
- Title and Description vs Footer separation
- Typography
- CTA shape
- Depth/effects
- Canvas strategy

### Non-Negotiable Rules must include bullets for

- No HTML/CSS generation
- Full-page Web UI design mockup
- 1024x1536 tall canvas
- All seven Template 4 sections visible
- English-only visible copy
- sectionInputs primary content source
- no bottom crop
- no generic SaaS landing page
- no browser/editor/Figma UI

### MD Compliance Map must include a JSON block with

- layoutPhilosophy
- visualMood
- spacingRhythm
- composition
- componentStyle
- depthAndEffects
- shapeAndRadius
- promoPageImplications
- dosApplied
- dontsAvoided
- notColorFontOnlyProof

### Section Content Mapping must include one H3 for each Template 4 section

- `### Header`
- `### Hero Banner`
- `### Step Bar`
- `### Content CTA`
- `### Image Text Row`
- `### Title and Description`
- `### Footer`

For each section include:

- Source fields
- Visible English copy
- Visual treatment
- Vertical allocation/compression note
- MD rule applied
- Fallback behavior

### Design Style Basis must include a JSON block with

- canvas
- primarySurface
- darkBands
- cta
- typography
- radius
- depth
- language

### Visual Direction must include bullets for

- Canvas strategy
- Web UI fidelity strategy
- Vertical fit strategy
- Hero strategy
- Supporting visual strategy
- Typography strategy
- Component strategy
- Footer strategy

### Final Image Prompt Inputs must include

- `### Image Prompt Direction`
- `### Section Order`
- `### Must Show`
- `### Must Avoid`

The Image Prompt Direction must be directly usable by an image-generation prompt LLM. It must include canvas size, page width, full-page requirement, all 7 sections, English-only copy, no bottom crop, and design system constraints.
It must also include concrete anti-print guidance: avoid poster/flyer/brochure/presentation-slide composition, avoid single centered key visual layouts, and include visible web UI cues such as navigation, CTA components, section containers, grid rhythm, component hierarchy, and footer/legal structure.

### Negative Prompt

Must include a fenced text block.

### Visual QA Checklist

Must include at least 10 checklist items.

## Return JSON Shape

```json
{
  "integratedDesignBriefMarkdown": "complete markdown document string following the required structure",
  "integratedDesignBrief": {
    "sourcePriorityRules": {},
    "resolvedConflicts": [],
    "nonNegotiableRules": [],
    "mdComplianceMap": {},
    "sectionContentMapping": {},
    "designStyleBasis": {},
    "visualDirection": {},
    "finalImagePromptInputs": {},
    "negativePrompt": "",
    "visualQaChecklist": []
  }
}
```

## Minimum Quality Bar

- `integratedDesignBriefMarkdown` must be at least 6000 characters.
- It must include a Resolved Conflicts table.
- It must include all seven Template 4 section H3 headings.
- It must include at least one JSON block for MD Compliance Map.
- It must include a final Image Prompt Direction.
- It must include a Negative Prompt.
- It must include a Visual QA Checklist.
- It must be self-contained enough that the next LLM can generate the Web UI design from this document alone.
- It must include enough web UI fidelity guidance that another LLM or design agent can understand why the output should not look like print design.

## Input Metadata

- runKey: `{{runKey}}`
- promptGroupId: `{{promptGroupId}}`
- promoTitle: `{{promoTitle}}`
- selectedMd: `{{selectedMd}}`
- selectedMdSlug: `{{selectedMdSlug}}`
- template: `{{templateName}}`
- canvasSize: `{{canvasSize}}`
- pageWidth: `{{pageWidth}}`
- language: `English only`

## Input Design Brief JSON

```json
{{designBrief}}
```

## Suggested Layout Mapping JSON

```json
{{layoutMapping}}
```
