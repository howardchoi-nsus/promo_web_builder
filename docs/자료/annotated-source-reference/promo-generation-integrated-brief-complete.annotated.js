// ============================================================================
// 참고용 주석 추가 사본 (READ-ONLY REFERENCE COPY)
// 원본: api/promo-generation-integrated-brief-complete.js
// 이 파일은 원본 소스코드를 수정하지 않고, 이해를 돕기 위해 "왜"를 설명하는
// 주석만 추가한 사본입니다. 실제 로직은 원본과 한 글자도 다르지 않습니다.
// 배포/빌드에 사용하지 마세요 — 원본 파일을 계속 사용해야 합니다.
// ============================================================================

const {
  getSql,
  integratedBriefSummary,
  loadRunState,
  parseBody,
  resolveRun,
} = require("./_promo-generation-run-store");

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

    // n8n PATCHes here after the LLM call finishes. The response shape can be
    // either an already-normalized {markdown, brief} pair or a raw provider
    // response that still needs content extraction/parsing — see
    // parseIntegratedBriefResponse below for why both paths exist.
    const parsed = parseIntegratedBriefResponse(body);
    // Validation is a hard gate: a brief that fails structural checks must not
    // reach "ready" status, otherwise downstream LO-FI/Final Design workers would
    // build on an incomplete or malformed brief with no way to detect it later.
    const validation = validateIntegratedBrief(parsed);
    if (!validation.ok) {
      await saveIntegratedBriefFailure({
        sql,
        run,
        body,
        errorMessage: validation.error,
      });
      return res.status(422).json({
        ok: false,
        error: "Integrated brief validation failed",
        message: validation.error,
      });
    }

    const promptMeta = mergeMeta(body.promptMeta || body.prompt_meta, {
      llmResponseMeta: parsed.llmResponseMeta,
      completedAt: new Date().toISOString(),
    });
    const modelMeta = mergeMeta(body.modelMeta || body.model_meta, parsed.modelMeta);
    // Upsert on run_id: an integrated brief is 1-per-run, so a retry/regeneration
    // overwrites the previous attempt rather than creating a second row.
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

// Two supported call shapes:
// 1) "direct" — caller already parsed/validated the brief itself and just wants
//    it stored (used by non-LLM callers or pre-normalized worker payloads).
// 2) raw LLM response — the common n8n path. We still have to pull the actual
//    text out of a provider-specific envelope (OpenAI/Gemini/etc shapes differ),
//    then JSON.parse it ourselves, since n8n intentionally does no parsing.
function parseIntegratedBriefResponse(body) {
  const directMarkdown = body.integratedDesignBriefMarkdown || body.integrated_design_brief_markdown;
  const directBrief = body.integratedDesignBrief || body.integratedBrief || body.integrated_brief || body.integratedBriefJson;
  if (directMarkdown && directBrief && typeof directBrief === "object") {
    return {
      integratedDesignBriefMarkdown: String(directMarkdown).trim(),
      integratedDesignBrief: directBrief,
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
  // normalizeIntegratedBrief backfills fields the LLM sometimes drops from the
  // JSON block even though the same content is present in the markdown body
  // (see handoff-2026-07-08.md: imagePromptDirection was observed missing from
  // JSON while still present under "### Image Prompt Direction" in markdown).
  const brief = normalizeIntegratedBrief(generated.integratedDesignBrief || {}, markdown);

  return {
    integratedDesignBriefMarkdown: markdown,
    integratedDesignBrief: brief,
    llmResponseMeta: buildLlmResponseMeta(response, content),
    modelMeta: {
      ...(body.modelMeta || body.model_meta || {}),
      provider: body.provider || body.modelMeta?.provider || body.model_meta?.provider || "",
      model: body.model || response.model || body.modelMeta?.model || body.model_meta?.model || "",
    },
  };
}

// Tries every known provider response shape in order (OpenAI chat completions,
// a generic "message.content", plain "content"/"text"/"output_text", and a
// nested variant some proxies wrap responses in) so callers do not need to
// know which provider produced the payload.
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

// Best-effort recovery layer: if the model's JSON object is missing a field
// that the same generation already wrote out in the markdown body, pull it
// back out of markdown instead of failing validation. This keeps a single
// prompt-formatting slip from turning into a hard failure for the whole run.
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
  if (!safeBrief.negativePrompt) {
    safeBrief.negativePrompt = extractMarkdownSection(markdown, "## Negative Prompt", ["## Visual QA Checklist"]);
  }
  if (!Array.isArray(safeBrief.visualQaChecklist)) {
    safeBrief.visualQaChecklist = extractMarkdownList(markdown, "## Visual QA Checklist", []);
  }
  return safeBrief;
}

// Generic "everything between this heading and the next known heading" slice.
// Markdown heading text is used as the boundary instead of a stricter parser
// because the brief's section order/headings are already enforced separately
// by validateIntegratedBrief's requiredHeadings check.
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

// LLMs frequently wrap JSON answers in ```json ... ``` fences even when asked
// not to; strip them before JSON.parse instead of rejecting the response.
function stripJsonFence(content) {
  return String(content)
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

// Structural gate for the brief before it can be marked "ready". Every check
// here maps to a concrete downstream failure mode if skipped:
// - length >= 6000: guards against a truncated/lazy generation that would look
//   valid but isn't "a complete self-contained request document" the image
//   workers can build from without referring back to original inputs.
// - imagePromptDirection required: this is the single field Final Design most
//   directly depends on; everything else can theoretically be re-derived.
// - requiredHeadings: enforces the prompt's own contract so a brief that drifts
//   from the expected template shape is caught here, not silently downstream.
// - frontmatter type/sourceDocuments: keeps the brief traceable to the inputs
//   it was generated from (design_prompt + section_input_log).
function validateIntegratedBrief(parsed) {
  const markdown = String(parsed.integratedDesignBriefMarkdown || "").trim();
  const brief = parsed.integratedDesignBrief;
  if (!markdown) return { ok: false, error: "integratedDesignBriefMarkdown is required" };
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

// Failure is still persisted (not just returned as an HTTP error) so the run's
// polling state reflects "failed" instead of staying "queued" forever, which
// is what the frontend stale-timeout logic in _promo-generation-run-store.js
// is there to catch as a fallback if this write itself never happened.
async function saveIntegratedBriefFailure({ sql, run, body, errorMessage }) {
  const promptMeta = mergeMeta(body.promptMeta || body.prompt_meta, {
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
