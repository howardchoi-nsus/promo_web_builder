import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const prompt = await readPromptFile();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      id: "promo-ui-design-image-generation",
      version: "2026-06-29.external-prompt-v1",
      prompt,
    });
  } catch (error) {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      id: "promo-ui-design-image-generation",
      version: "2026-06-29.external-prompt-fallback-v1",
      prompt: FALLBACK_PROMPT,
      warning: "Prompt file could not be read; served embedded fallback prompt.",
      message: error.message,
    });
  }
}

async function readPromptFile() {
  const filename = "promo-ui-design-image-generation.md";
  const candidates = [
    path.join(process.cwd(), "prompts", filename),
    path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "prompts", filename),
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

const FALLBACK_PROMPT = `# Promo UI Design Image Generation Prompt

Create an image-generation prompt for a desktop promotional web UI design.

Return valid JSON only. Do not include markdown fences. Do not include explanations outside JSON.

NON-NEGOTIABLE DESIGN RULES:
- Do not generate HTML or CSS.
- Follow Template 4 order exactly: Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Title and Description, Footer.
- Use sectionInputs as the primary source of visible content. Use promo only as fallback metadata.
- For visualMode auto, infer visuals from that section's own text.
- For visualMode use_visual, include a relevant visual.
- For visualMode no_visual, do not create an image area for that section.
- Follow the MD design concept as a binding specification: layout philosophy, visual mood, spacing rhythm, composition, components, depth/effects, shape/radius, promo page implications, dos, and donts.
- Do not create a generic SaaS landing page, casino template, or color/font reskin.
- Make the section composition and component language visibly derived from the MD.
- Color and font settings are constraints, but the design must not be color/font-only.
- Include a wireframe-aware layout mapping and an MD compliance check.
- Avoid unreadable tiny text. Legal/terms can be shown as condensed footer blocks but must be visibly present.
- Use a tall full-page canvas at {{imageSize}} so all Template 4 sections are visible from header through footer.
- The image should look like a polished desktop UI design mockup of a 1440px-wide page scaled to fit the tall canvas.
- Do not crop the bottom, do not end at the hero or middle sections, and do not omit Title and Description or Footer.
- If vertical space is tight, reduce section heights, visual asset sizes, whitespace, and text density before removing content.
- Every Template 4 section must be visible in one image: Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Title and Description, Footer.

Before writing imagePrompt, internally decide and reflect in the prompt:
1. The dominant MD layout model and how Temp.4 sections should be arranged.
2. The hero composition and visual treatment that best matches the MD.
3. The spacing rhythm and information density.
4. The component language for CTAs, step bars, panels, badges, and legal/footer.
5. The depth/effects model: flat, bordered, layered, image-led, restrained, glossy, editorial, etc.
6. Which generic patterns and MD donts must be avoided.

Return this JSON shape:
{
  "imagePrompt": "single detailed prompt string with explicit section-by-section layout, visual hierarchy, component style, depth/effects, shape/radius, color/font constraints, and visible promo content",
  "negativePrompt": "generic landing pages, weak MD compliance, color/font-only reskins, unreadable text, missing legal footer, wrong section order, browser chrome, editor UI, Figma canvas UI",
  "designBrief": {},
  "layoutMapping": {},
  "mdComplianceMap": {
    "layoutPhilosophy": "...",
    "visualMood": "...",
    "spacingRhythm": "...",
    "composition": "...",
    "componentStyle": "...",
    "depthAndEffects": "...",
    "shapeAndRadius": "...",
    "promoPageImplications": "...",
    "dosApplied": ["..."],
    "dontsAvoided": ["..."],
    "notColorFontOnlyProof": "..."
  }
}

Input design brief:
{{designBrief}}

Suggested field mapping:
{{layoutMapping}}

Required MD compliance keys:
{{mdComplianceKeys}}
`;
