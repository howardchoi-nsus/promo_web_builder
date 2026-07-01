const { readFile } = require("node:fs/promises");
const path = require("node:path");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const prompt = await readPromptFile();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      id: "promo-integrated-design-brief-generation",
      version: "2026-06-30.external-prompt-v1",
      prompt,
    });
  } catch (error) {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      id: "promo-integrated-design-brief-generation",
      version: "2026-06-30.external-prompt-fallback-v1",
      prompt: FALLBACK_PROMPT,
      warning: "Prompt file could not be read; served embedded fallback prompt.",
      message: error.message,
    });
  }
};

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

Create a detailed self-contained integrated design brief for generating a promotional Web UI design image.

Return valid JSON only. Do not include markdown fences or explanations outside JSON.

The integratedDesignBriefMarkdown must be a complete design-generation request document that includes:
- # Integrated Design Brief MD
- ## Source Priority Rules
- ## Resolved Conflicts
- ## Non-Negotiable Rules
- ## MD Compliance Map
- ## Section Content Mapping
- ## Design Style Basis
- ## Visual Direction
- ## Final Image Prompt Inputs
- ## Negative Prompt
- ## Visual QA Checklist

Rules:
- DESIGN.md / selected Design MD controls style.
- B Section Input Log / sectionInputs controls visible content.
- promo-ui-design-image-generation.md controls output format and Template 4 section order.
- All visible UI copy must be English only.
- Treat 1024x1536 as the bitmap export size, not as a poster artboard or real web page proportion.
- Represent a 1440px desktop Web UI page scaled into the bitmap.
- The result must read as a web UI design mockup, not a poster, flyer, brochure, presentation slide, print ad, or key visual.
- All seven Template 4 sections must be visible: Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Title and Description, Footer.
- The document must be self-contained enough for the next LLM to generate the Web UI image from this document alone.

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
    "finalImagePromptInputs": {},
    "negativePrompt": "",
    "visualQaChecklist": []
  }
}

Input design brief JSON:
{{designBrief}}

Suggested layout mapping JSON:
{{layoutMapping}}
`;
