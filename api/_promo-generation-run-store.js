const { randomUUID, createHash } = require("node:crypto");
const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

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
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
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
};
