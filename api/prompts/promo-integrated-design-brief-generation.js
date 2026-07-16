const { readFile } = require("node:fs/promises");
const path = require("node:path");
const {
  ensureDefaultPromptTemplates,
  getSql,
} = require("../_prompt-template-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const managedPrompt = await readManagedPrompt().catch(() => null);
    if (managedPrompt) {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({
        id: "promo-integrated-design-brief-generation",
        version: `managed-v${managedPrompt.version}`,
        prompt: managedPrompt.body,
        promptTemplateId: managedPrompt.id,
        promptTemplateType: managedPrompt.type,
        promptTemplateStatus: managedPrompt.status,
        provider: managedPrompt.provider || "",
        model: managedPrompt.model || "",
        modelOptions: managedPrompt.model_options || {},
      });
    }

    const prompt = await readPromptFile();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      id: "promo-integrated-design-brief-generation",
      version: "2026-07-07.page-composition-source-v1",
      prompt,
    });
  } catch (error) {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      id: "promo-integrated-design-brief-generation",
      version: "2026-07-07.page-composition-source-fallback-v1",
      prompt: FALLBACK_PROMPT,
      warning: "Prompt file could not be read; served embedded fallback prompt.",
      message: error.message,
    });
  }
};

async function readManagedPrompt() {
  const sql = getSql();
  await ensureDefaultPromptTemplates(sql);
  const rows = await sql`
    select id::text, type, body, status, version, provider, model, model_options
    from prompt_templates
    where type = 'integrated_brief'
      and status = 'active'
    limit 1
  `;
  return rows[0] || null;
}

async function readPromptFile() {
  const filename = "promo-integrated-design-brief-generation.md";
  const candidates = [
    path.join(process.cwd(), "prompts", filename),
    path.join(__dirname, "..", "..", "prompts", filename),
  ];

  let lastError;
  for (const promptPath of candidates) {
    try {
      return await readFile(promptPath, "utf8");
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

const FALLBACK_PROMPT = `# Promo Integrated Design Brief Generation Prompt

Create a detailed self-contained integrated design brief for generating a promotional Web UI design image. The word "brief" means execution specification, not a short summary.

Return valid JSON only. Do not include markdown fences or explanations outside JSON.

The integratedDesignBriefMarkdown must be a complete design-generation request document that includes:
- # Integrated Design Brief MD
- ## Source Priority Rules
- ## Resolved Conflicts
- ## Non-Negotiable Rules
- ## MD Compliance Map
- ## Design Token Application
- ## Section Content Mapping
- ## Token-to-Section Application
- ## Design Style Basis
- ## Visual Direction
- ## Final Image Prompt Inputs
- ## Negative Prompt
- ## Visual QA Checklist

Rules:
- Design Prompt MD controls style tokens, component patterns, layout patterns, and guidelines.
- Section Input Log MD controls visible content, CTA text, legal text, user-composed page structure, selected region context, promotion strategy, and selected template input values.
- Page Composition in the Section Input Log MD is the primary source for section order, visible section coverage, hidden sections, fixed sections, custom sections, item visibility, and image-generation targets.
- Promotion Strategy, Market / Region Context, and Promotion Content Contract in the Section Input Log MD are primary interpretation sources.
- The selected template schema is fallback only when Page Composition and Section Config are missing.
- Market / region is shared promo metadata, but it primarily affects image-generation visual localization. Use it as subtle mood, audience, environment, and compliance context; do not force the market name into visible copy.
- YAML frontmatter type must be exactly integrated_design_brief.
- integratedDesignBriefMarkdown must begin with YAML frontmatter as the first characters, before # Integrated Design Brief MD.
- The frontmatter must include type: integrated_design_brief, runKey, promptGroupId, promoTitle, selectedMd, selectedMdSlug, template, canvasSize, pageWidth, language, and sourceDocuments.
- sourceDocuments must include design_prompt and section_input_log.
- All visible UI copy must be English only.
- Restate all selected design token values and section input values directly in the integrated brief.
- Do not say "refer to Design Prompt MD", "see Section Input Log", or ask the downstream step to consult source documents.
- Treat 1024x1536 as the bitmap export size, not as a poster artboard or real web page proportion.
- Represent a 1440px desktop Web UI page scaled into the bitmap.
- The result must read as a web UI design mockup, not a poster, flyer, brochure, presentation slide, print ad, or key visual.
- The content and layout role of all selected visible Page Composition sections must be represented in the provided order.
- Use Page Composition order and displayName for H3 headings under Section Content Mapping and Token-to-Section Application.
- Always include sectionId as the stable mapping key. Do not use displayName as the validation key.
- Custom sections that are not part of Template 4 must still be mapped when they appear in Page Composition.
- Hidden sections must not be described as rendered content; place them under Excluded Sections.
- Market / region affects visual localization more than text copy.
- Template section names are internal structure labels only and must not appear as visible UI text.
- Do not render side labels, annotation columns, guide text, wireframe labels, section-name callouts, diagram legends, QA checklist labels, or explanatory labels outside the actual webpage.
- The generated markdown must include these exact lowercase phrases in Non-Negotiable Rules or Final Image Prompt Inputs: template section names, visible ui text, side labels, annotation columns, diagram legends.
- Section Order blocks and numbered section lists are internal planning metadata only and must not be treated as visible UI copy.
- The document must be self-contained enough for the next LLM to generate the Web UI image from this document alone.
- integratedDesignBrief.negativePrompt is required and must be a non-empty, substantive string. It must prohibit poster-like composition, internal section labels, editor UI, non-English copy, unreadable text, cropped footer, and missing required content.
- The ## Negative Prompt markdown section must contain the same substantive restrictions as integratedDesignBrief.negativePrompt. Never return an empty heading or empty string.

Return JSON shape:
{
  "integratedDesignBriefMarkdown": "complete markdown document string",
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
      "visibleCopy": {},
      "mustShow": [],
      "mustAvoid": [],
      "visualTargets": [],
      "contentCoverage": {}
    },
    "negativePrompt": "poster, flyer, brochure, presentation slide, browser chrome, editor UI, Figma canvas UI, template labels, section labels, side annotations, non-English UI copy, Korean text, unreadable text, cropped footer, missing legal content, missing required promotional sections",
    "visualQaChecklist": []
  }
}

Input Design Prompt MD:
{{designPromptMarkdown}}

Input Section Input Log MD:
{{sectionInputLogMarkdown}}
`;
