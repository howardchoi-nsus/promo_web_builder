const { createHash } = require("node:crypto");
const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { getSql, fetchDocument } = require("./_promo-builder-document-store");

const EVENT_NAMES = new Set([
  "builder_mode_selected", "ai_overview_requested", "ai_overview_reviewed",
  "shared_sections_confirmed", "composition_requested", "composition_validated",
  "composition_auto_applied", "composition_review_required", "composition_applied",
  "composition_apply_failed", "composition_operation_proposed",
  "composition_operation_applied", "composition_revision_conflict",
  "asset_job_started", "asset_job_ready", "asset_job_failed",
  "web_output_opened",
]);

// Public client event names evolve independently of the historical DB enum.
// Normalize on the server so already deployed/cached clients remain compatible.
const EVENT_ALIASES = Object.freeze({
  ai_overview_retrying: {name:'ai_overview_requested', phase:'retry'},
  builder_quality_gate_passed: {name:'composition_validated', phase:'quality_gate_passed'},
  builder_quality_gate_blocked: {name:'composition_review_required', phase:'quality_gate_blocked'},
  builder_document_exported: {name:'web_output_opened', phase:'document_exported'},
});
function normalizeEvent(eventName, metadata) {
  const alias = Object.hasOwn(EVENT_ALIASES, eventName) ? EVENT_ALIASES[eventName] : null;
  return {
    eventName: alias?.name || eventName,
    metadata: safeMetadata(alias
      ? {sourceEventName:eventName,eventPhase:alias.phase,...Object.fromEntries(Object.entries(safeMetadata(metadata)).filter(([key])=>!['sourceEventName','eventPhase'].includes(key)))}
      : metadata),
  };
}

function safeMetadata(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return Object.fromEntries(Object.entries(source).slice(0, 30).map(([key, item]) => [
    String(key).slice(0, 80),
    typeof item === "string" ? item.slice(0, 300)
      : typeof item === "number" || typeof item === "boolean" ? item
        : null,
  ]));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "no-store");
    const owner = resolveBuilderOwner(req, res);
    const body = parseBody(req.body);
    const receivedEventName = String(body.eventName || "");
    const {eventName,metadata} = normalizeEvent(receivedEventName,body.metadata);
    const documentId = String(body.documentId || "").trim();
    if (!EVENT_NAMES.has(eventName)) return res.status(400).json({ error: "Unknown eventName" });
    const sql = getSql();
    if (documentId) {
      const document = await fetchDocument(sql, documentId, owner.ownerSubject, { includeSnapshot: false });
      if (!document) return res.status(404).json({ error: "Builder document not found" });
    }
    await sql`
      insert into promo_builder_events (
        document_id, owner_subject_hash, event_name,
        document_revision, request_id, duration_ms, metadata
      ) values (
        ${documentId || null}::uuid,
        ${createHash("sha256").update(owner.ownerSubject).digest("hex")},
        ${eventName},
        ${body.documentRevision == null ? null : Number(body.documentRevision)},
        ${String(body.requestId || "").slice(0, 120)},
        ${body.durationMs == null ? null : Math.max(0, Math.round(Number(body.durationMs) || 0))},
        ${JSON.stringify(metadata)}::jsonb
      )
    `;
    return res.status(202).json({ ok: true });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Builder event failed",
      code: error.code || null,
      message: error.message,
    });
  }
};

module.exports.EVENT_NAMES = EVENT_NAMES;
module.exports.safeMetadata = safeMetadata;

module.exports.EVENT_ALIASES = EVENT_ALIASES;
module.exports.normalizeEvent = normalizeEvent;
