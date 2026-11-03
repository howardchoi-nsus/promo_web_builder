# Promo Integrated Design Brief Generation Prompt

Create a detailed self-contained integrated design brief for generating a promotional Web UI design image.

Return valid JSON only. Do not include markdown fences or explanations outside JSON.

## Critical Purpose

- This is not a summary.
- This document must be a complete design-generation execution specification.
- The word "brief" means an execution brief/specification, not a short summary.
- A downstream image-generation LLM must be able to create the final Web UI design by reading only this integrated brief.
- The brief must be usable by other LLMs or design agents, not only this n8n workflow.
- The resulting design must read as a Web UI design mockup, not as a poster, flyer, brochure, presentation slide, editorial cover, print ad, or key visual.
- Do not require the downstream step to re-read Design Prompt MD, Section Input Log MD, DESIGN.md, content.md, sectionInputs JSON, layoutMapping JSON, designBrief JSON, or promo-ui-design-image-generation.md.
- Restate all adopted design tokens, visible copy, design rules, section mappings, conflicts, and final imagePrompt inputs inside this document.

## Source Priority Rules

- Design Prompt MD controls style: colors, typography, spacing, radius, component language, layout patterns, guidelines, qualitative classification, and token-derived constraints.
- Section Input Log MD controls visible content: copy, CTA text, links, legal text, section text, visualMode, footer labels, promo metadata, user-composed page structure, and selected template input values.
- Page Composition in the Section Input Log MD is the primary structure source for section order, visible section coverage, hidden sections, fixed sections, custom sections, item visibility, and image-generation targets.
- Promotion Strategy, Market / Region Context, and Promotion Content Contract in the Section Input Log MD are the primary interpretation source for the promotion purpose, audience, CTA intent, selected region, user disposition, and required visible content.
- The selected template schema is the fallback structural source only when Page Composition and Section Config are missing.
- Market / region is shared promo metadata, but it primarily affects image-generation visual localization. Use it as subtle mood, audience, environment, and compliance context; do not force the market name into visible copy.
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
- The full user-composed page from first visible section through final visible section must be visible in one image.
- Do not crop the bottom.
- Do not merge legal/detail content into Footer unless the selected template schema explicitly maps it there.
- If content is long, compress spacing, section height, visual size, and decoration before removing content.
- Template section names are internal planning labels only.
- The final generated UI must not render template section names as visible labels, side labels, side annotations, guide text, wireframe labels, callouts, diagram legends, or QA checklist text.

## Required Markdown Structure

The `integratedDesignBriefMarkdown` must include exactly these sections in this order:

1. YAML frontmatter
2. `# Integrated Design Brief MD`
3. `## Source Priority Rules`
4. `## Resolved Conflicts`
5. `## Non-Negotiable Rules`
6. `## MD Compliance Map`
7. `## Design Token Application`
8. `## Section Content Mapping`
9. `## Token-to-Section Application`
10. `## Design Style Basis`
11. `## Visual Direction`
12. `## Final Image Prompt Inputs`
13. `## Negative Prompt`
14. `## Visual QA Checklist`

### YAML frontmatter must include

- type must be exactly `integrated_design_brief`
- runKey
- promptGroupId if available
- promoTitle
- selectedMd
- selectedMdSlug
- template
- canvasSize
- pageWidth
- language
- sourceDocuments must include `design_prompt` and `section_input_log`

The markdown string must begin with YAML frontmatter on the first character. Use this exact pattern:

```yaml
---
type: integrated_design_brief
runKey: "..."
promptGroupId: "..."
promoTitle: "..."
selectedMd: "..."
selectedMdSlug: "..."
template: "Template 4"
canvasSize: "1024x1536"
pageWidth: "1440px scaled to fit"
language: "English only"
sourceDocuments:
  - design_prompt
  - section_input_log
---
```

Do not start the markdown with `# Integrated Design Brief MD` before the frontmatter. Do not omit `type: integrated_design_brief`.

### Source Priority Rules must include

- Style priority
- Content priority
- Template priority
- Promo metadata fallback rule
- Design Style override rule
- Structural conflict rule
- Non-destructive integration rule
- No-reference rule: never tell the downstream step to consult the source documents.

### Resolved Conflicts must be a markdown table with columns

`| Item | Design MD Value | B Section / Content Value | Template Rule | Adopted Value | Reason |`

Include conflicts for at least:

- Page Composition / section order
- Detail/legal content vs Footer separation
- Typography
- CTA shape
- Depth/effects
- Canvas strategy

### Non-Negotiable Rules must include bullets for

- No HTML/CSS generation
- Full-page Web UI design mockup
- 1024x1536 tall canvas
- generated image page canvas/background must be full-bleed pure black `#000000` to all four bitmap edges
- no gray/off-black/charcoal/white/beige/cream/ivory/transparent outer artboard, page margin, or full-width section background
- content and layout role from all selected visible Page Composition sections represented in the provided order
- English-only visible copy
- sectionInputs primary content source
- Page Composition and sectionConfig control selected visible sections, hidden sections, custom sections, visible items, fixed section behavior, and image-generation targets
- market / region affects visual localization more than text copy
- no bottom crop
- no generic SaaS landing page
- no browser/editor/Figma UI
- no visible template section labels, side guides, wireframe labels, annotations, diagram legends, or QA checklist labels
- exact section label guard phrase: `template section names are internal planning labels only, not visible UI text`
- exact section label guard phrase: `do not add side labels or annotation columns`
- exact section label guard phrase: `do not add diagram legends`

The generated markdown must include the exact lowercase phrases `template section names`, `visible ui text`, `side labels`, `annotation columns`, and `diagram legends` somewhere in the Non-Negotiable Rules or Final Image Prompt Inputs.

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

### Design Token Application must include

- Colors adopted from Design Prompt MD
- Typography adopted from Design Prompt MD
- Radius adopted from Design Prompt MD
- Spacing adopted from Design Prompt MD
- Elevation/depth adopted from Design Prompt MD
- Breakpoints/page-width interpretation
- Component patterns adopted from Design Prompt MD
- Layout patterns adopted from Design Prompt MD
- Guidelines adopted from Design Prompt MD
- Unknown token handling

### Section Content Mapping must include one H3 for each selected visible Page Composition section

Use Page Composition from the Section Input Log MD as the primary source for visible section list, order, fixed position, custom sections, and hidden sections. Section headings in this markdown are internal documentation only; they must not become visible UI copy in the image prompt.

For each visible section, use a stable H3 based on Page Composition order and display name:

`### {order}. {displayName}`

Each section block must include `sectionId`, `role`, `visible`, `fixedPosition`, `contentPath`, source fields, visible English copy, section visibility and item visibility decisions, image-generation target decisions, visual treatment, vertical allocation/compression note, MD rule applied, and fallback behavior.

Do not use `displayName` as the validation key. Use `sectionId` as the stable mapping key. Custom sections that are not part of Template 4 must still be mapped when they appear in Page Composition.

Hidden sections must not be described as rendered content. Put hidden sections under an explicit `### Excluded Sections` note with their `sectionId`, `displayName`, and reason.

### Token-to-Section Application must include one H3 for each selected visible template section

For each section explain exactly how selected design tokens affect:

Repeat the same visible Page Composition H3 heading set under `## Token-to-Section Application`. Hidden sections must not be described as rendered content:

- `### {order}. {displayName}`

- Color usage
- Typography hierarchy
- Spacing and density
- Radius/shape
- Component style
- Layout behavior
- Visual treatment
- Guidelines/donts applied

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
- Pure black `#000000` page/background canvas strategy: all four bitmap edges, outer margins, page floor, artboard area, and between-section gaps must remain `#000000`; selected MD colors may appear only in components, accents, typography, imagery, and contained inner surfaces.
- Web UI fidelity strategy
- Vertical fit strategy
- Hero strategy
- Supporting visual strategy
- Typography strategy
- Component strategy
- Footer strategy
- Market visual localization strategy: use market/region as subtle visual context, avoid flags, maps, stereotypes, and visible market labels unless supplied as user-facing copy.

### Final Image Prompt Inputs must include

- `### Image Prompt Direction`
- `### Must Show`
- `### Must Avoid`
- `### Visible Sections`
- `### Visual Targets`
- `### Content Coverage`

The Image Prompt Direction must be directly usable by an image-generation prompt LLM. It must include canvas size, page width, full-page requirement, full-bleed pure black `#000000` page/background canvas to all four bitmap edges, no gray/light artboard or light full-width section backgrounds, the content and layout role of each selected visible Page Composition section, English-only copy, no bottom crop, and design system constraints.
It must explicitly state that Template section names are internal labels and must not be rendered as visible UI text.
It must explicitly forbid visible template labels, side annotations, wireframe labels, QA labels, diagram legends, and any explanatory text outside the actual promotional webpage.
It must also include concrete anti-print guidance: avoid poster/flyer/brochure/presentation-slide composition, avoid single centered key visual layouts, and include visible web UI cues such as navigation, CTA components, section containers, grid rhythm, component hierarchy, and footer/legal structure.
Do not include a `### Section Order` block in Final Image Prompt Inputs. Use natural page-flow language for the final image direction, based on Page Composition order, instead of telling the image model to show section names.

## Negative Prompt

Must include a fenced text block.

## Visual QA Checklist

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
    "finalImagePromptInputs": {
      "imagePromptDirection": "Single source-of-truth image direction derived only from this integrated brief.",
      "visibleSections": ["visible sectionId from Page Composition"],
      "visibleCopy": {
        "sectionOrField": "Exact English user-facing copy that may appear in the generated UI"
      },
      "mustShow": ["Required visible content, section role, CTA, legal, and footer requirements"],
      "mustAvoid": ["Brief-specific exclusions beyond the global negative prompt"],
      "visualTargets": [
        {
          "section": "visible sectionId from Page Composition",
          "target": "hero visual | supporting visual | badge | image area | none",
          "description": "Visual instruction grounded in the section's own copy and Design MD"
        }
      ],
      "contentCoverage": {
        "sourceField": "visible section or final image prompt input where this value is represented"
      }
    },
    "negativePrompt": "",
    "visualQaChecklist": []
  }
}
```

## Minimum Quality Bar

- `integratedDesignBriefMarkdown` must be at least 6000 characters.
- It must include a Resolved Conflicts table.
- It must include H3 headings for each selected visible Page Composition section. Use Page Composition order and displayName in headings, and include sectionId as the stable mapping key. Do not force hidden sections into rendered content.
- It must include at least one JSON block for MD Compliance Map.
- It must include selected design token values directly; do not say to consult or refer to Design Prompt MD.
- It must include Section Input Log visible copy directly; do not say to consult or refer to Section Input Log MD.
- It must include a final Image Prompt Direction and structured `finalImagePromptInputs` with visibleSections, visibleCopy, mustShow, mustAvoid, visualTargets, and contentCoverage.
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

## Input Design Prompt MD

{{designPromptMarkdown}}

## Input Section Input Log MD

{{sectionInputLogMarkdown}}
