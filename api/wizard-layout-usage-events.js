const { getSql, parseBody } = require("./_wizard-form-templates-store");

const ALLOWED_EVENTS = new Set([
  "layout_loaded", "layout_load_failed", "layout_edit_started",
  "item_moved", "item_style_changed", "section_resized",
  "item_reset", "layout_reset", "layout_completed", "run_snapshot_created",
  "legacy_layout_cache_invalidated", "layout_identity_mismatch",
  "admin_layout_update_detected", "admin_layout_update_applied", "admin_layout_update_deferred",
]);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = parseBody(req.body);
    const eventName = String(body.eventName || "").trim();
    const sessionId = String(body.sessionId || "").trim();
    if (!ALLOWED_EVENTS.has(eventName)) return res.status(400).json({ error: "Unsupported eventName" });
    if (!sessionId) return res.status(400).json({ error: "sessionId is required" });
    const summary = body.changeSummary && typeof body.changeSummary === "object" && !Array.isArray(body.changeSummary)
      ? body.changeSummary : {};
    if (JSON.stringify(summary).length > 4096) return res.status(413).json({ error: "changeSummary is too large" });
    const sql = getSql();
    const rows = await sql`
      insert into wizard_layout_usage_events (
        client_event_id, event_name, session_id, run_id, form_template_id,
        template_key, template_version, config_revision, layout_revision,
        target_key, change_summary
      ) values (
        ${String(body.clientEventId || "") || null}, ${eventName}, ${sessionId},
        ${String(body.runId || "") || null}::uuid,
        ${String(body.formTemplateId || "") || null}::uuid,
        ${String(body.templateKey || "")}, ${Number(body.templateVersion || 1)},
        ${String(body.configRevision || "")}, ${Number(body.layoutRevision || 1)},
        ${String(body.targetKey || "")}, ${JSON.stringify(summary)}::jsonb
      )
      on conflict (client_event_id) where client_event_id is not null and client_event_id <> ''
      do update set client_event_id = excluded.client_event_id
      returning id::text, created_at
    `;
    return res.status(201).json({ ok: true, event: rows[0] });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard layout usage event API failed", message: error.message });
  }
};
