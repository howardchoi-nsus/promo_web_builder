const { getSql } = require("./_wizard-form-templates-store");

const STATUSES = new Set(["draft", "review", "approved", "archived"]);
const VIEWPORTS = new Set(["desktop", "mobile", "responsive"]);
const SCORE_KEYS = ["hierarchy", "composition", "originality", "responsiveness", "reusability"];

function fail(message, statusCode = 400, code = "LAYOUT_REFERENCE_INVALID") {
  throw Object.assign(new Error(message), { statusCode, code });
}

function normalizeUrl(value, fieldName, { optional = false } = {}) {
  const raw = String(value || "").trim();
  if (!raw && optional) return "";
  let parsed;
  try { parsed = new URL(raw); } catch { fail(`${fieldName} must be a valid URL`); }
  if (!['http:', 'https:'].includes(parsed.protocol)) fail(`${fieldName} must use HTTP or HTTPS`);
  if (fieldName === "previewImageUrl" && parsed.protocol !== "https:") fail("previewImageUrl must use HTTPS");
  if (parsed.username || parsed.password) fail(`${fieldName} must not include credentials`);
  const hostname = parsed.hostname.toLowerCase();
  if (["localhost", "127.0.0.1", "::1"].includes(hostname) || hostname.endsWith(".local")) {
    fail(`${fieldName} must reference a public host`);
  }
  return parsed.toString();
}

function normalizeStringList(value, limit = 30) {
  const items = Array.isArray(value) ? value : String(value || "").split(",");
  return Array.from(new Set(items.map((item) => String(item || "").trim()).filter(Boolean))).slice(0, limit);
}

function normalizeJsonObject(value, fieldName) {
  if (value === null || value === undefined || value === "") return {};
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch {}
    fail(`${fieldName} must be a JSON object`);
  }
  if (typeof value === "object" && !Array.isArray(value)) return value;
  fail(`${fieldName} must be a JSON object`);
}

function normalizeQualityScores(value = {}) {
  const source = normalizeJsonObject(value, "qualityScores");
  return Object.fromEntries(SCORE_KEYS.map((key) => {
    const score = Number(source[key] || 0);
    if (!Number.isFinite(score) || score < 0 || score > 5) fail(`${key} score must be between 0 and 5`);
    return [key, Math.round(score * 10) / 10];
  }));
}

function qualityAverage(scores) {
  const values = SCORE_KEYS.map((key) => Number(scores[key] || 0));
  return Math.round((values.reduce((sum, value) => sum + value, 0) / SCORE_KEYS.length) * 100) / 100;
}

function normalizeInput(input = {}, { partial = false } = {}) {
  const result = {};
  const has = (key) => Object.prototype.hasOwnProperty.call(input, key);
  const assign = (key, value, aliases = []) => {
    if (!partial || has(key) || aliases.some(has)) result[key] = value;
  };
  const title = String(input.title || "").trim();
  if ((!partial || has("title")) && (!title || title.length > 200)) fail("title is required and must be 200 characters or fewer");
  assign("title", title);
  assign("sourceSite", String(input.sourceSite || "").trim().slice(0, 160));
  if (!partial || has("sourceUrl")) assign("sourceUrl", normalizeUrl(input.sourceUrl, "sourceUrl"));
  if (!partial || has("previewImageUrl")) assign("previewImageUrl", normalizeUrl(input.previewImageUrl, "previewImageUrl", { optional: true }));
  const status = String(input.status || "draft").trim().toLowerCase();
  if ((!partial || has("status")) && !STATUSES.has(status)) fail("status is invalid");
  assign("status", status);
  const viewport = String(input.viewport || "responsive").trim().toLowerCase();
  if ((!partial || has("viewport")) && !VIEWPORTS.has(viewport)) fail("viewport is invalid");
  assign("viewport", viewport);
  assign("pageType", String(input.pageType || "").trim().slice(0, 120));
  assign("industry", String(input.industry || "").trim().slice(0, 120));
  assign("promotionGoal", String(input.promotionGoal || "").trim().slice(0, 160));
  assign("visualStyles", normalizeStringList(input.visualStyles));
  assign("sectionTypes", normalizeStringList(input.sectionTypes));
  assign("tags", normalizeStringList(input.tags, 50));
  assign("designSummary", String(input.designSummary || "").trim().slice(0, 5000));
  assign("strengths", String(input.strengths || "").trim().slice(0, 5000));
  assign("risks", String(input.risks || "").trim().slice(0, 5000));
  assign("layoutSpec", normalizeJsonObject(input.layoutSpec, "layoutSpec"));
  assign("analysisMeta", normalizeJsonObject(input.analysisMeta, "analysisMeta"));
  if (!partial || has("qualityScores")) {
    const scores = normalizeQualityScores(input.qualityScores);
    assign("qualityScores", scores);
    assign("qualityScore", qualityAverage(scores));
  }
  assign("copyrightReviewed", Boolean(input.copyrightReviewed));
  let capturedAt = null;
  if (input.capturedAt) {
    const capturedDate = new Date(input.capturedAt);
    if (Number.isNaN(capturedDate.getTime())) fail("capturedAt must be a valid date");
    capturedAt = capturedDate.toISOString();
  }
  assign("capturedAt", capturedAt);
  assign("changeNote", String(input.changeNote || "").trim().slice(0, 1000));
  return result;
}

function toReference(row) {
  return {
    id: row.id,
    title: row.title,
    sourceSite: row.source_site || "",
    sourceUrl: row.source_url,
    previewImageUrl: row.preview_image_url || "",
    status: row.status,
    pageType: row.page_type || "",
    industry: row.industry || "",
    promotionGoal: row.promotion_goal || "",
    viewport: row.viewport,
    visualStyles: row.visual_styles || [],
    sectionTypes: row.section_types || [],
    tags: row.tags || [],
    designSummary: row.design_summary || "",
    strengths: row.strengths || "",
    risks: row.risks || "",
    layoutSpec: row.layout_spec || {},
    analysisMeta: row.analysis_meta || {},
    qualityScores: row.quality_scores || {},
    qualityScore: Number(row.quality_score || 0),
    copyrightReviewed: Boolean(row.copyright_reviewed),
    researchOnly: Boolean(row.research_only),
    capturedAt: row.captured_at || null,
    approvedAt: row.approved_at || null,
    approvedBy: row.approved_by || "",
    createdBy: row.created_by || "",
    updatedBy: row.updated_by || "",
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function ensureLayoutReferenceRegistry(sql) {
  await sql`create extension if not exists pgcrypto`;
  await sql`
    create table if not exists promo_layout_references (
      id uuid primary key default gen_random_uuid(), title text not null,
      source_site text not null default '', source_url text not null,
      preview_image_url text not null default '',
      status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'archived')),
      page_type text not null default '', industry text not null default '', promotion_goal text not null default '',
      viewport text not null default 'responsive' check (viewport in ('desktop', 'mobile', 'responsive')),
      visual_styles jsonb not null default '[]'::jsonb, section_types jsonb not null default '[]'::jsonb,
      tags jsonb not null default '[]'::jsonb, design_summary text not null default '',
      strengths text not null default '', risks text not null default '', layout_spec jsonb not null default '{}'::jsonb,
      analysis_meta jsonb not null default '{}'::jsonb,
      quality_scores jsonb not null default '{}'::jsonb,
      quality_score numeric(4, 2) not null default 0 check (quality_score >= 0 and quality_score <= 5),
      copyright_reviewed boolean not null default false, research_only boolean not null default true,
      captured_at timestamptz, approved_at timestamptz, approved_by text,
      created_by text not null, updated_by text not null,
      created_at timestamptz not null default now(), updated_at timestamptz not null default now()
    )
  `;
  await sql`alter table promo_layout_references add column if not exists analysis_meta jsonb not null default '{}'::jsonb`;
  await sql`
    create table if not exists promo_layout_reference_histories (
      id uuid primary key default gen_random_uuid(),
      layout_reference_id uuid references promo_layout_references(id) on delete set null,
      action text not null, previous_status text, new_status text not null,
      snapshot jsonb not null default '{}'::jsonb, change_note text not null default '',
      changed_by text not null, changed_at timestamptz not null default now()
    )
  `;
  await sql`
    create unique index if not exists promo_layout_references_source_viewport_idx
    on promo_layout_references(lower(source_url), viewport) where status <> 'archived'
  `;
  await sql`
    create index if not exists promo_layout_references_discovery_idx
    on promo_layout_references(status, page_type, industry, quality_score desc, updated_at desc)
  `;
}

async function appendHistory(sql, row, previousStatus, action, actor, changeNote = "") {
  await sql`
    insert into promo_layout_reference_histories (
      layout_reference_id, action, previous_status, new_status, snapshot, change_note, changed_by
    ) values (
      ${row.id}::uuid, ${action}, ${previousStatus || null}, ${row.status},
      ${JSON.stringify(toReference(row))}::jsonb, ${changeNote}, ${actor}
    )
  `;
}

async function listReferences(sql, { includeArchived = true } = {}) {
  await ensureLayoutReferenceRegistry(sql);
  const rows = includeArchived
    ? await sql`select * from promo_layout_references order by updated_at desc, title asc`
    : await sql`select * from promo_layout_references where status <> 'archived' order by updated_at desc, title asc`;
  return rows.map(toReference);
}

async function listHistories(sql, limit = 200) {
  await ensureLayoutReferenceRegistry(sql);
  const safeLimit = Math.max(1, Math.min(Number(limit) || 200, 500));
  const rows = await sql`
    select id::text, layout_reference_id::text, action, previous_status, new_status,
      snapshot, change_note, changed_by, changed_at
    from promo_layout_reference_histories order by changed_at desc limit ${safeLimit}
  `;
  return rows.map((row) => ({
    id: row.id, layoutReferenceId: row.layout_reference_id || null, action: row.action,
    previousStatus: row.previous_status || "", newStatus: row.new_status,
    snapshot: row.snapshot || {}, changeNote: row.change_note || "",
    changedBy: row.changed_by, changedAt: row.changed_at,
  }));
}

async function createReference(sql, input, actor) {
  await ensureLayoutReferenceRegistry(sql);
  const value = normalizeInput({ ...input, status: "draft" });
  const rows = await sql`
    insert into promo_layout_references (
      title, source_site, source_url, preview_image_url, status, page_type, industry,
      promotion_goal, viewport, visual_styles, section_types, tags, design_summary,
      strengths, risks, layout_spec, analysis_meta, quality_scores, quality_score, copyright_reviewed,
      captured_at, created_by, updated_by
    ) values (
      ${value.title}, ${value.sourceSite}, ${value.sourceUrl}, ${value.previewImageUrl}, 'draft',
      ${value.pageType}, ${value.industry}, ${value.promotionGoal}, ${value.viewport},
      ${JSON.stringify(value.visualStyles)}::jsonb, ${JSON.stringify(value.sectionTypes)}::jsonb,
      ${JSON.stringify(value.tags)}::jsonb, ${value.designSummary}, ${value.strengths}, ${value.risks},
      ${JSON.stringify(value.layoutSpec)}::jsonb, ${JSON.stringify(value.analysisMeta)}::jsonb,
      ${JSON.stringify(value.qualityScores)}::jsonb,
      ${value.qualityScore}, ${value.copyrightReviewed}, ${value.capturedAt}, ${actor}, ${actor}
    ) returning *
  `;
  await appendHistory(sql, rows[0], null, "created", actor, value.changeNote);
  return toReference(rows[0]);
}

function approvalErrors(value) {
  const errors = [];
  if (!value.sectionTypes?.length) errors.push("sectionTypes is required");
  if (!value.designSummary) errors.push("designSummary is required");
  if (!value.copyrightReviewed) errors.push("copyright review is required");
  if (SCORE_KEYS.some((key) => Number(value.qualityScores?.[key] || 0) === 0)) errors.push("all quality scores are required");
  if (Number(value.qualityScore || 0) < 4) errors.push("quality score must be 4.0 or higher");
  return errors;
}

async function updateReference(sql, id, input, actor) {
  await ensureLayoutReferenceRegistry(sql);
  const existingRows = await sql`select * from promo_layout_references where id = ${id}::uuid limit 1`;
  if (!existingRows[0]) return null;
  const existing = toReference(existingRows[0]);
  const patch = normalizeInput(input, { partial: true });
  const next = { ...existing, ...patch };
  if (patch.status === "approved") {
    const errors = approvalErrors(next);
    if (errors.length) fail(`Reference cannot be approved: ${errors.join(", ")}`, 422, "LAYOUT_REFERENCE_APPROVAL_BLOCKED");
  }
  const rows = await sql`
    update promo_layout_references set
      title = ${next.title}, source_site = ${next.sourceSite}, source_url = ${next.sourceUrl},
      preview_image_url = ${next.previewImageUrl}, status = ${next.status}, page_type = ${next.pageType},
      industry = ${next.industry}, promotion_goal = ${next.promotionGoal}, viewport = ${next.viewport},
      visual_styles = ${JSON.stringify(next.visualStyles)}::jsonb,
      section_types = ${JSON.stringify(next.sectionTypes)}::jsonb, tags = ${JSON.stringify(next.tags)}::jsonb,
      design_summary = ${next.designSummary}, strengths = ${next.strengths}, risks = ${next.risks},
      layout_spec = ${JSON.stringify(next.layoutSpec)}::jsonb,
      analysis_meta = ${JSON.stringify(next.analysisMeta)}::jsonb,
      quality_scores = ${JSON.stringify(next.qualityScores)}::jsonb, quality_score = ${next.qualityScore},
      copyright_reviewed = ${next.copyrightReviewed}, captured_at = ${next.capturedAt},
      approved_at = case when ${next.status} = 'approved' then coalesce(approved_at, now()) else null end,
      approved_by = case when ${next.status} = 'approved' then coalesce(approved_by, ${actor}) else null end,
      updated_by = ${actor}, updated_at = now()
    where id = ${id}::uuid returning *
  `;
  const action = existing.status === next.status ? "updated" : "status_changed";
  await appendHistory(sql, rows[0], existing.status, action, actor, patch.changeNote || "");
  return toReference(rows[0]);
}

module.exports = {
  SCORE_KEYS, STATUSES, VIEWPORTS, approvalErrors, createReference, ensureLayoutReferenceRegistry,
  getSql, listHistories, listReferences, normalizeInput, normalizeQualityScores,
  qualityAverage, toReference, updateReference,
};
