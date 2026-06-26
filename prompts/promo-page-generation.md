# Promo AI Page Generation Prompt

Create a desktop promotional web page using the selected design markdown analysis and promo inputs.

Return valid JSON only. Do not include markdown fences. Do not include explanations outside JSON.

NON-NEGOTIABLE DESIGN RULES:
- The selected MD is the design specification, not moodboard inspiration.
- A result that only applies colors and fonts is invalid.
- The page must visibly implement the MD's layoutPhilosophy, visualMood, spacingRhythm, componentStyle, depthAndEffects, shapeAndRadius, dos, donts, and promoPageImplications.
- Do not create a generic marketing landing page.
- Do not use decorative cards, gradients, shadows, rounded corners, oversized heroes, floating panels, or playful visuals unless the MD explicitly supports them.
- If the MD asks for dense/productive/system-like design, make the layout dense, structured, and utility-oriented.
- If the MD asks for editorial/luxury/playful/immersive design, make the layout and effects visibly follow that direction.
- Color and font values are execution tokens only. They do not replace the MD's layout, component, effect, and interaction requirements.

Before writing HTML/CSS, internally decide:
1. The MD's dominant layout model.
2. The hero composition that best fits the MD.
3. The section rhythm and information density.
4. The component language: buttons, cards, panels, badges, forms, CTA, legal blocks.
5. The depth/effects model: flat, bordered, shadowed, layered, image-led, gradient-led, or restrained.
6. What generic landing page patterns must be avoided.

Priority rules:
1. The promo input fields are the source of page content and must be visible in the page.
2. The selected MD controls layout, visual mood, section rhythm, depth/effects, component style, shape/radius, and overall composition.
3. The final color/font style controls actual CSS color and typography values.
4. If styleSource is company_default, use company color/font values but still follow the MD's layout/effects/component concept.
5. If styleSource is design_md, use the MD-derived color/font values and MD concept together.
6. Legal/terms text must be visible, readable, and visually subordinate.
7. Generate for desktop first: 1440px viewport, minimum content width 1180px.
8. Do not use external JavaScript. Do not include script tags. Do not include inline event handlers.
9. CSS must be scoped under .promo-generated-page where practical.
10. Use Pretendard as the Korean/default web font unless the final style specifies another font.

Selected MD:
- brand: {{brand}}
- slug: {{slug}}
- design concept summary: {{designConceptSummary}}
- design prompt context:
{{designPromptContext}}
- concept JSON:
{{designConceptJson}}
- extracted categories: {{categories}}
- extracted colors: {{colors}}
- extracted fonts: {{fonts}}

Promo inputs:
{{promoJson}}

Final color/font style:
{{designJson}}

Style source:
- styleSource: {{styleSource}}
- styleSourceLabel: {{styleSourceLabel}}
- companyPreset: {{companyPreset}}
- hasOverride: {{hasOverride}}

Required JSON schema:
{
  "designIntent": "Korean explanation of how the MD design specification was translated into the page, not just colors/fonts.",
  "layoutSummary": "Korean summary of hero, sections, CTA, and legal layout.",
  "mdComplianceMap": {
    "layoutPhilosophy": "Which HTML sections and CSS rules implement the MD layout philosophy.",
    "visualMood": "Which composition, contrast, imagery/graphics, and hierarchy implement the MD visual mood.",
    "spacingRhythm": "Which spacing, density, and section rhythm decisions implement the MD.",
    "componentStyle": "Which buttons, panels, cards, badges, nav, CTA, and legal components implement the MD.",
    "depthAndEffects": "Which CSS effects or restraint rules implement the MD depth/effects model.",
    "shapeAndRadius": "Which radius, geometry, crop, or shape rules implement the MD.",
    "promoPageImplications": "How hero, content sections, CTA, legal, and desktop layout instructions were applied.",
    "dosApplied": ["Specific MD do rule and where it appears in HTML/CSS."],
    "dontsAvoided": ["Specific MD don't rule and how it was avoided."],
    "notColorFontOnlyProof": "Explain what changed beyond colors and fonts."
  },
  "html": "HTML body content only. Start with <main class='promo-generated-page'> and do not include html/head/body tags.",
  "css": "CSS string. Include responsive desktop-safe CSS and @import for Pretendard if needed.",
  "qualityChecks": ["Concrete MD compliance check that was satisfied."]
}

HTML/CSS requirements:
- HTML must contain meaningful section class names that reflect the MD-specific structure.
- CSS must include layout, spacing, component, depth/effect, and shape/radius decisions beyond color/font variables.
- Include all required promo content.
- The generated page should look like a brand-specific promo page derived from the MD, not a reusable generic template.
