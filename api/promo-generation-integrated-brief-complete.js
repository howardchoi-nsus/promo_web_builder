const {
  getSql,
  integratedBriefSummary,
  loadRunState,
  parseBody,
  resolveRun,
} = require("./_promo-generation-run-store");

const DEFAULT_NEGATIVE_PROMPT = [
  "poster, flyer, brochure, print ad, presentation slide, magazine cover",
  "browser chrome, editor UI, Figma canvas UI",
  "template labels, section labels, side annotations, annotation columns, wireframe labels, diagram legends, QA checklist labels",
  "non-English UI copy, Korean text, unreadable text",
  "cropped footer, missing legal content, missing required promotional sections",
].join(", ");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody(req.body);
    const runId = String(body.runId || body.run_id || body.id || body.runKey || body.run_key || "").trim();
    if (!runId) return res.status(400).json({ error: "runId or runKey is required" });

    const sql = getSql();
    const run = await resolveRun(sql, runId);
    if (!run) return res.status(404).json({ error: "Generation run not found" });

    let parsed;
    try {
      parsed = parseIntegratedBriefResponse(body);
    } catch (error) {
      await saveIntegratedBriefFailure({
        sql,
        run,
        body,
        errorMessage: error.message,
      });
      return res.status(422).json({
        ok: false,
        error: "Integrated brief response processing failed",
        message: error.message,
      });
    }
    const validation = validateIntegratedBrief(parsed);
    if (!validation.ok) {
      await saveIntegratedBriefFailure({
        sql,
        run,
        body,
        errorMessage: validation.error,
        extraPromptMeta: { lengthGuard: buildLengthGuardMeta(parsed) },
      });
      return res.status(422).json({
        ok: false,
        error: "Integrated brief validation failed",
        message: validation.error,
      });
    }

    const promptMeta = mergeMeta(body.promptMeta || body.prompt_meta, {
      llmResponseMeta: parsed.llmResponseMeta,
      lengthGuard: buildLengthGuardMeta(parsed),
      completedAt: new Date().toISOString(),
    });
    const modelMeta = mergeMeta(body.modelMeta || body.model_meta, parsed.modelMeta);
    const rows = await sql`
      insert into promo_generation_integrated_briefs (
        run_id,
        status,
        integrated_brief_markdown,
        integrated_brief_json,
        prompt_meta,
        model_meta,
        error_message,
        updated_at
      )
      values (
        ${run.id}::uuid,
        'ready',
        ${parsed.integratedDesignBriefMarkdown},
        ${JSON.stringify(parsed.integratedDesignBrief)}::jsonb,
        ${JSON.stringify(promptMeta)}::jsonb,
        ${JSON.stringify(modelMeta)}::jsonb,
        '',
        now()
      )
      on conflict (run_id) do update set
        status = 'ready',
        integrated_brief_markdown = excluded.integrated_brief_markdown,
        integrated_brief_json = excluded.integrated_brief_json,
        prompt_meta = coalesce(promo_generation_integrated_briefs.prompt_meta, '{}'::jsonb) || excluded.prompt_meta,
        model_meta = coalesce(promo_generation_integrated_briefs.model_meta, '{}'::jsonb) || excluded.model_meta,
        error_message = '',
        updated_at = now()
      returning
        id::text,
        run_id::text,
        status,
        integrated_brief_markdown,
        integrated_brief_json,
        prompt_meta,
        model_meta,
        error_message,
        created_at,
        updated_at
    `;

    await sql`
      update promo_generation_runs
      set status = 'integrated_brief_ready', stage = 'integrated_brief', error_message = '', updated_at = now()
      where id = ${run.id}::uuid
    `;

    const state = await loadRunState(sql, run.id);
    return res.status(200).json({
      ok: true,
      integratedBrief: integratedBriefSummary(rows[0]),
      state,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Integrated brief completion API failed",
      message: error.message,
    });
  }
};

function parseIntegratedBriefResponse(body) {
  const directMarkdown = body.integratedDesignBriefMarkdown || body.integrated_design_brief_markdown;
  const directBrief = body.integratedDesignBrief || body.integratedBrief || body.integrated_brief || body.integratedBriefJson;
  if (directMarkdown && directBrief && typeof directBrief === "object") {
    const normalizedBrief = normalizeIntegratedBrief(directBrief, directMarkdown);
    return {
      integratedDesignBriefMarkdown: materializeRequiredMarkdownSections(directMarkdown, normalizedBrief),
      integratedDesignBrief: normalizedBrief,
      llmResponseMeta: { source: "direct" },
      modelMeta: body.modelMeta || body.model_meta || {},
    };
  }

  const response = body.llmResponse || body.llm_response || body.response || body;
  const content = extractLlmContent(response);
  if (!content) {
    throw new Error("LLM response content is empty");
  }

  let generated;
  try {
    generated = typeof content === "string" ? JSON.parse(stripJsonFence(content)) : content;
  } catch (error) {
    throw new Error(`Failed to parse integrated brief JSON: ${error.message}`);
  }

  const markdown = String(generated.integratedDesignBriefMarkdown || "").trim();
  const brief = normalizeIntegratedBrief(generated.integratedDesignBrief || {}, markdown);

  return {
    integratedDesignBriefMarkdown: materializeRequiredMarkdownSections(markdown, brief),
    integratedDesignBrief: brief,
    llmResponseMeta: buildLlmResponseMeta(response, content),
    modelMeta: {
      ...(body.modelMeta || body.model_meta || {}),
      provider: body.provider || body.modelMeta?.provider || body.model_meta?.provider || "",
      model: body.model || response.model || body.modelMeta?.model || body.model_meta?.model || "",
    },
  };
}

function extractLlmContent(response) {
  if (Array.isArray(response)) return extractLlmContent(response[0]);
  if (!response || typeof response !== "object") return "";
  return response.choices?.[0]?.message?.content ||
    response.message?.content ||
    response.content ||
    response.text ||
    response.output_text ||
    response.data?.choices?.[0]?.message?.content ||
    "";
}

function normalizeIntegratedBrief(brief, markdown) {
  const safeBrief = brief && typeof brief === "object" && !Array.isArray(brief) ? { ...brief } : {};
  const finalInputs = safeBrief.finalImagePromptInputs && typeof safeBrief.finalImagePromptInputs === "object"
    ? { ...safeBrief.finalImagePromptInputs }
    : {};

  if (!finalInputs.imagePromptDirection && !finalInputs.image_prompt_direction) {
    const direction = extractMarkdownSection(markdown, "### Image Prompt Direction", [
      "### Must Show",
      "### Must Avoid",
      "### Visible Sections",
      "### Visual Targets",
      "### Content Coverage",
      "## Negative Prompt",
      "## Visual QA Checklist",
    ]);
    if (direction) finalInputs.imagePromptDirection = direction;
  }

  if (!Array.isArray(finalInputs.mustShow)) {
    finalInputs.mustShow = extractMarkdownList(markdown, "### Must Show", [
      "### Must Avoid",
      "### Visible Sections",
      "### Visual Targets",
      "### Content Coverage",
      "## Negative Prompt",
    ]);
  }
  if (!Array.isArray(finalInputs.mustAvoid)) {
    finalInputs.mustAvoid = extractMarkdownList(markdown, "### Must Avoid", [
      "### Visible Sections",
      "### Visual Targets",
      "### Content Coverage",
      "## Negative Prompt",
    ]);
  }
  if (!Array.isArray(finalInputs.visibleSections)) {
    finalInputs.visibleSections = extractMarkdownList(markdown, "### Visible Sections", [
      "### Visual Targets",
      "### Content Coverage",
      "## Negative Prompt",
    ]);
  }
  if (!finalInputs.contentCoverage || typeof finalInputs.contentCoverage !== "object") {
    finalInputs.contentCoverage = {
      summary: extractMarkdownSection(markdown, "### Content Coverage", [
        "## Negative Prompt",
        "## Visual QA Checklist",
      ]),
    };
  }

  safeBrief.finalImagePromptInputs = finalInputs;
  if (!safeBrief.negativePrompt && safeBrief.negative_prompt) {
    safeBrief.negativePrompt = safeBrief.negative_prompt;
  }
  if (!safeBrief.negativePrompt) {
    safeBrief.negativePrompt = extractMarkdownSection(markdown, "## Negative Prompt", ["## Visual QA Checklist"]);
  }
  if (!String(safeBrief.negativePrompt || "").trim()) {
    safeBrief.negativePrompt = DEFAULT_NEGATIVE_PROMPT;
  }
  if (!Array.isArray(safeBrief.visualQaChecklist) && Array.isArray(safeBrief.visual_qa_checklist)) {
    safeBrief.visualQaChecklist = safeBrief.visual_qa_checklist;
  }
  if (!Array.isArray(safeBrief.visualQaChecklist)) {
    safeBrief.visualQaChecklist = extractMarkdownList(markdown, "## Visual QA Checklist", []);
  }
  return safeBrief;
}

function materializeRequiredMarkdownSections(markdown, brief) {
  let result = String(markdown || "").trim();
  const negativePrompt = String(brief?.negativePrompt || "").trim();
  const checklist = Array.isArray(brief?.visualQaChecklist)
    ? brief.visualQaChecklist.map((item) => String(item || "").trim()).filter(Boolean)
    : [];

  const existingNegativePrompt = extractMarkdownSection(result, "## Negative Prompt", ["## Visual QA Checklist"]);
  if (!existingNegativePrompt && negativePrompt) {
    const section = `## Negative Prompt\n\n\`\`\`text\n${negativePrompt}\n\`\`\``;
    const negativeIndex = result.indexOf("## Negative Prompt");
    if (negativeIndex >= 0) {
      const qaIndex = result.indexOf("## Visual QA Checklist", negativeIndex);
      result = qaIndex >= 0
        ? `${result.slice(0, negativeIndex).trimEnd()}\n\n${section}\n\n${result.slice(qaIndex).trimStart()}`
        : `${result.slice(0, negativeIndex).trimEnd()}\n\n${section}`;
    } else {
      const qaIndex = result.indexOf("## Visual QA Checklist");
      result = qaIndex >= 0
        ? `${result.slice(0, qaIndex).trimEnd()}\n\n${section}\n\n${result.slice(qaIndex).trimStart()}`
        : `${result}\n\n${section}`;
    }
  }
  if (!result.includes("## Visual QA Checklist") && checklist.length) {
    result = `${result}\n\n## Visual QA Checklist\n\n${checklist.map((item) => `- [ ] ${item.replace(/^\[[ xX]\]\s*/, "")}`).join("\n")}`;
  }
  return result.trim();
}

function extractMarkdownSection(markdown, heading, nextHeadings) {
  const source = String(markdown || "");
  const start = source.indexOf(heading);
  if (start < 0) return "";
  const contentStart = start + heading.length;
  const nextIndexes = nextHeadings
    .map((nextHeading) => source.indexOf(nextHeading, contentStart))
    .filter((index) => index >= 0);
  const end = nextIndexes.length ? Math.min(...nextIndexes) : source.length;
  return source.slice(contentStart, end).trim().replace(/^```(?:text)?\s*/i, "").replace(/```$/i, "").trim();
}

function extractMarkdownList(markdown, heading, nextHeadings) {
  const section = extractMarkdownSection(markdown, heading, nextHeadings);
  if (!section) return [];
  return section
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*]\s+/, "").trim())
    .filter(Boolean);
}

function stripJsonFence(content) {
  return String(content)
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function validateIntegratedBrief(parsed) {
  const markdown = String(parsed.integratedDesignBriefMarkdown || "").trim();
  const brief = parsed.integratedDesignBrief;
  if (!markdown) return { ok: false, error: "integratedDesignBriefMarkdown is required" };
  if (markdown.length > 30000) {
    return {
      ok: false,
      error: `Integrated design brief exceeds the 30000 character hard limit (${markdown.length})`,
    };
  }
  if (markdown.length > 20000) {
    return {
      ok: false,
      error: `Integrated design brief exceeds the 20000 character retry threshold (${markdown.length})`,
    };
  }
  if (markdown.length < 6000) {
    return {
      ok: false,
      error: "Integrated design brief is too short; expected a complete self-contained request document",
    };
  }
  if (!brief || typeof brief !== "object" || Array.isArray(brief)) {
    return { ok: false, error: "integratedDesignBrief object is required" };
  }

  const finalInputs = brief.finalImagePromptInputs || brief.final_image_prompt_inputs || {};
  const imageDirection = String(
    finalInputs.imagePromptDirection ||
    finalInputs.image_prompt_direction ||
    finalInputs.direction ||
    finalInputs.promptDirection ||
    ""
  ).trim();
  if (!imageDirection) return { ok: false, error: "finalImagePromptInputs.imagePromptDirection is required" };

  const negativePrompt = String(brief.negativePrompt || brief.negative_prompt || "").trim();
  if (!negativePrompt) return { ok: false, error: "integratedDesignBrief.negativePrompt is required" };
  const visualQaChecklist = Array.isArray(brief.visualQaChecklist)
    ? brief.visualQaChecklist
    : Array.isArray(brief.visual_qa_checklist) ? brief.visual_qa_checklist : [];
  if (visualQaChecklist.filter((item) => String(item || "").trim()).length < 10) {
    return { ok: false, error: "integratedDesignBrief.visualQaChecklist requires at least 10 items" };
  }

  const requiredHeadings = [
    "# Integrated Design Brief MD",
    "## Source Priority Rules",
    "## Non-Negotiable Rules",
    "## MD Compliance Map",
    "## Design Token Application",
    "## Section Content Mapping",
    "## Token-to-Section Application",
    "## Design Style Basis",
    "## Visual Direction",
    "## Final Image Prompt Inputs",
    "## Negative Prompt",
    "## Visual QA Checklist",
  ];
  const missingHeadings = requiredHeadings.filter((heading) => !markdown.includes(heading));
  if (missingHeadings.length) {
    return { ok: false, error: `Integrated design brief missing sections: ${missingHeadings.join(", ")}` };
  }

  const frontmatterMatch = markdown.match(/^---\s*\n([\s\S]*?)\n---/);
  const frontmatter = frontmatterMatch ? frontmatterMatch[1] : "";
  if (!/^\s*type:\s*integrated_design_brief\s*$/im.test(frontmatter)) {
    return { ok: false, error: "Integrated design brief frontmatter type must be integrated_design_brief" };
  }
  if (!/sourceDocuments\s*:/i.test(frontmatter) || !frontmatter.toLowerCase().includes("design_prompt") || !frontmatter.toLowerCase().includes("section_input_log")) {
    return {
      ok: false,
      error: "Integrated design brief sourceDocuments must include design_prompt and section_input_log",
    };
  }

  return { ok: true };
}

function buildLengthGuardMeta(parsed) {
  const contentLength = Number(parsed?.llmResponseMeta?.contentLength || 0);
  const markdownLength = String(parsed?.integratedDesignBriefMarkdown || "").length;
  const measuredLength = Math.max(contentLength, markdownLength);
  return {
    measuredLength,
    warningThreshold: 15000,
    retryThreshold: 20000,
    hardLimit: 30000,
    warning: measuredLength > 15000,
    retryRecommended: measuredLength > 20000,
  };
}

async function saveIntegratedBriefFailure({ sql, run, body, errorMessage, extraPromptMeta = {} }) {
  const promptMeta = mergeMeta(body.promptMeta || body.prompt_meta, {
    ...extraPromptMeta,
    failedAt: new Date().toISOString(),
  });
  const modelMeta = body.modelMeta || body.model_meta || {};
  await sql`
    insert into promo_generation_integrated_briefs (
      run_id,
      status,
      prompt_meta,
      model_meta,
      error_message,
      updated_at
    )
    values (
      ${run.id}::uuid,
      'failed',
      ${JSON.stringify(promptMeta)}::jsonb,
      ${JSON.stringify(modelMeta)}::jsonb,
      ${errorMessage},
      now()
    )
    on conflict (run_id) do update set
      status = 'failed',
      prompt_meta = coalesce(promo_generation_integrated_briefs.prompt_meta, '{}'::jsonb) || excluded.prompt_meta,
      model_meta = coalesce(promo_generation_integrated_briefs.model_meta, '{}'::jsonb) || excluded.model_meta,
      error_message = excluded.error_message,
      updated_at = now()
  `;
  await sql`
    update promo_generation_runs
    set status = 'integrated_brief_failed', stage = 'integrated_brief', error_message = ${errorMessage}, updated_at = now()
    where id = ${run.id}::uuid
  `;
}

function buildLlmResponseMeta(response, content) {
  return {
    source: "llm_response",
    model: response?.model || "",
    id: response?.id || "",
    finishReason: response?.choices?.[0]?.finish_reason || "",
    usage: response?.usage || {},
    contentLength: typeof content === "string" ? content.length : 0,
  };
}

function mergeMeta(base, extra) {
  const safeBase = base && typeof base === "object" && !Array.isArray(base) ? base : {};
  return {
    ...safeBase,
    ...extra,
  };
}

module.exports._test = {
  DEFAULT_NEGATIVE_PROMPT,
  materializeRequiredMarkdownSections,
  normalizeIntegratedBrief,
};
