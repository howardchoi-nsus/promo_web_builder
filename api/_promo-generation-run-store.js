const { randomUUID, createHash } = require("node:crypto");
const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

// Shared persistence helpers for the multi-stage promo generation flow. Keep
// cross-stage summaries here so the builder, worker callbacks, and reviewers read
// the same state shape.
// Polling stale limits are UX guardrails, not hard worker deadlines: image steps get
// a little longer than LO-FI because n8n may spend extra time on prompt assembly/upload.
const STAGE_STALE_LIMITS_MS = {
  integrated_brief: 6 * 60 * 1000,
  lofi_draft: 4 * 60 * 1000,
  final_design: 6 * 60 * 1000,
};

function getSql() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    const error = new Error("DATABASE_URL is not configured");
    error.statusCode = 500;
    throw error;
  }
  return neon(databaseUrl);
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (typeof body === "object" && !Array.isArray(body)) return body;
  return {};
}

function sha256(value) {
  return createHash("sha256").update(String(value || "")).digest("hex");
}

function stableJson(value) {
  return JSON.stringify(sortValue(value || {}));
}

// The input hash must stay stable across equivalent JSON payloads so retries can
// compare generation intent even when clients send object keys in different orders.
function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value).sort().reduce((acc, key) => {
    acc[key] = sortValue(value[key]);
    return acc;
  }, {});
}

function runKeyFromPayload(body) {
  return String(body.runKey || body.run_key || body.id || body.payload?.id || `promo-${Date.now()}-${randomUUID().slice(0, 8)}`).trim();
}

function payloadFromBody(body) {
  return body.payload && typeof body.payload === "object" ? body.payload : body;
}

function runSummary(row) {
  if (!row) return null;
  const stale = staleInfo(row.stage, row.status, row.updated_at);
  return {
    runId: row.id,
    runKey: row.run_key,
    promoTitle: row.promo_title || "",
    selectedMdId: row.selected_md_id || "",
    selectedMdName: row.selected_md_name || "",
    status: row.status || "",
    stage: row.stage || "",
    inputHash: row.input_hash || "",
    inputSnapshot: row.input_snapshot || {},
    errorMessage: row.error_message || "",
    metadata: row.metadata || {},
    polling: stale,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function staleInfo(stage, status, updatedAt) {
  const stageKey = String(stage || "");
  const statusKey = String(status || "");
  const limitMs = STAGE_STALE_LIMITS_MS[stageKey] || 0;
  // Only active-looking states are marked stale; ready/failed historical runs should
  // remain readable without creating false retry prompts in the builder UI.
  const active = /queued|generating|running|pending|accepted/i.test(statusKey);
  const updatedTime = updatedAt ? new Date(updatedAt).getTime() : 0;
  const ageMs = updatedTime ? Math.max(0, Date.now() - updatedTime) : 0;
  return {
    staleLimitMs: limitMs,
    ageMs,
    isActive: active,
    isStale: Boolean(limitMs && active && ageMs > limitMs),
    staleMessage: limitMs && active && ageMs > limitMs
      ? "This step is taking longer than expected. Please check the worker status or retry this stage."
      : "",
  };
}

function integratedBriefSummary(row) {
  if (!row) return null;
  return {
    integratedBriefId: row.id,
    runId: row.run_id,
    status: row.status || "",
    integratedBriefMarkdown: row.integrated_brief_markdown || "",
    integratedBriefJson: row.integrated_brief_json || {},
    promptMeta: row.prompt_meta || {},
    modelMeta: row.model_meta || {},
    errorMessage: row.error_message || "",
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function draftSummary(row) {
  if (!row) return null;
  return {
    draftId: row.id,
    runId: row.run_id,
    draftAttempt: Number(row.draft_attempt || 0),
    status: row.status || "",
    draftImageUrl: row.draft_image_url || "",
    draftPrompt: row.draft_prompt || "",
    promptMeta: row.prompt_meta || {},
    modelMeta: row.model_meta || {},
    errorMessage: row.error_message || "",
    confirmedAt: row.confirmed_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function finalDesignSummary(row) {
  if (!row) return null;
  return {
    finalDesignId: row.id,
    runId: row.run_id,
    confirmedDraftId: row.confirmed_draft_id || "",
    status: row.status || "",
    finalImageUrl: row.final_image_url || "",
    finalPrompt: row.final_prompt || "",
    promptMeta: row.prompt_meta || {},
    modelMeta: row.model_meta || {},
    errorMessage: row.error_message || "",
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function resolveRun(sql, value) {
  const id = String(value || "").trim();
  if (!id) return null;
  const rows = await sql`
    select
      id::text,
      run_key,
      promo_title,
      selected_md_id,
      selected_md_name,
      status,
      stage,
      input_hash,
      input_snapshot,
      error_message,
      metadata,
      created_at,
      updated_at
    from promo_generation_runs
    where id::text = ${id} or run_key = ${id}
    limit 1
  `;
  return rows[0] || null;
}

async function loadRunState(sql, value) {
  const run = await resolveRun(sql, value);
  if (!run) return null;
  const briefRows = await sql`
    select
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
    from promo_generation_integrated_briefs
    where run_id = ${run.id}::uuid
    limit 1
  `;
  const draftRows = await sql`
    select
      id::text,
      run_id::text,
      draft_attempt,
      status,
      draft_image_url,
      draft_prompt,
      prompt_meta,
      model_meta,
      error_message,
      confirmed_at,
      created_at,
      updated_at
    from promo_generation_lofi_drafts
    where run_id = ${run.id}::uuid
    order by draft_attempt asc
  `;
  const finalRows = await sql`
    select
      id::text,
      run_id::text,
      confirmed_draft_id::text,
      status,
      final_image_url,
      final_prompt,
      prompt_meta,
      model_meta,
      error_message,
      created_at,
      updated_at
    from promo_generation_final_designs
    where run_id = ${run.id}::uuid
    order by created_at desc
  `;

  return {
    run: runSummary(run),
    integratedBrief: integratedBriefSummary(briefRows[0]),
    drafts: draftRows.map(draftSummary),
    confirmedDraft: draftSummary(draftRows.find((row) => row.confirmed_at)),
    finalDesigns: finalRows.map(finalDesignSummary),
  };
}

module.exports = {
  draftSummary,
  finalDesignSummary,
  getSql,
  integratedBriefSummary,
  loadRunState,
  parseBody,
  payloadFromBody,
  resolveRun,
  runKeyFromPayload,
  runSummary,
  sha256,
  stableJson,
  STAGE_STALE_LIMITS_MS,
};
