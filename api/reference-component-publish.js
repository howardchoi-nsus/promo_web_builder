const { createHash } = require("node:crypto");
const { getSql, parseBody } = require("./_item-components-store");
const { resolveAdminOwner } = require("./_promo-admin-auth");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { fetchComponentGenerationReadiness } = require("./_reference-component-readiness");
const {
  buildReferenceComponentPublishPlan,
  normalizePublishInput,
} = require("./_reference-component-publishing");

function requestHash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "private, no-store");
    requireBuilderFlag("referenceComponentPublishing");
    const owner = resolveAdminOwner(req, res);
    const body = parseBody(req.body);
    const idempotencyKey = String(req.headers?.["idempotency-key"] || body.idempotencyKey || "").trim();
    const changeNote = String(body.changeNote || "").trim();
    if (!idempotencyKey || idempotencyKey.length > 200) {
      return res.status(400).json({ error: "Idempotency-Key is required", code: "IDEMPOTENCY_KEY_REQUIRED" });
    }
    if (!changeNote) {
      return res.status(400).json({ error: "changeNote is required", code: "CHANGE_NOTE_REQUIRED" });
    }
    const sql = getSql();
    const hash = requestHash({ input: normalizePublishInput(body), changeNote });
    const existing = await sql`
      select id::text, request_hash, status, result_snapshot
      from reference_component_publish_operations
      where idempotency_key = ${idempotencyKey}
      limit 1
    `;
    if (existing.length) {
      if (existing[0].request_hash !== hash) {
        return res.status(409).json({ error: "Idempotency-Key was already used for another request", code: "IDEMPOTENCY_KEY_REUSED" });
      }
      return res.status(200).json({ ok: true, replayed: true, operation: existing[0].result_snapshot });
    }
    const plan = await buildReferenceComponentPublishPlan(sql, body);
    if (!plan.readiness.ready) {
      return res.status(422).json({
        error: "Reference component is not ready to publish",
        code: "REFERENCE_COMPONENT_PUBLISH_BLOCKED",
        plan,
      });
    }
    const componentId = plan.component.id;
    const versionId = plan.component.version.id;
    const sectionId = plan.section.id;
    const itemKey = plan.input.itemKey;
    const referenceIds = plan.references.map((reference) => reference.id);
    const resultSnapshot = {
      planFingerprint: plan.fingerprint,
      componentId,
      componentVersionId: versionId,
      sectionId,
      itemKey,
      referenceIds,
      publishedBy: owner.actorSubject,
    };
    const queries = [
      sql`update wizard_item_component_versions
          set status = 'inactive', updated_at = now()
          where component_id = ${componentId}::uuid and status = 'active' and id <> ${versionId}::uuid`,
      sql`update wizard_item_component_versions
          set status = 'active', change_note = ${changeNote}, updated_at = now()
          where id = ${versionId}::uuid and component_id = ${componentId}::uuid`,
      sql`insert into wizard_content_section_component_instances (
            section_id, component_version_id, item_key, display_name,
            is_visible_in_wizard, is_required, user_reorder_allowed,
            sort_order, is_locked, locked_value, instance_config
          ) values (
            ${sectionId}::uuid, ${versionId}::uuid, ${itemKey}, ${plan.component.name},
            true, false, true, 100, false, null, '{}'::jsonb
          )
          on conflict (section_id, item_key) do update set
            component_version_id = excluded.component_version_id,
            display_name = excluded.display_name,
            is_visible_in_wizard = true,
            updated_at = now()`,
      ...referenceIds.map((referenceId) => sql`
        insert into promo_layout_reference_component_links (
          layout_reference_id, component_id, component_version_id,
          relationship, evidence, created_by
        ) values (
          ${referenceId}::uuid, ${componentId}::uuid, ${versionId}::uuid,
          'derived', ${JSON.stringify({ planFingerprint: plan.fingerprint })}::jsonb, ${owner.actorSubject}
        )
        on conflict (layout_reference_id, component_id, relationship) do update set
          component_version_id = excluded.component_version_id,
          evidence = excluded.evidence,
          created_by = excluded.created_by
      `),
      sql`insert into reference_component_publish_operations (
            idempotency_key, request_hash, status, plan_snapshot,
            result_snapshot, change_note, created_by, completed_at
          ) values (
            ${idempotencyKey}, ${hash}, 'completed', ${JSON.stringify(plan)}::jsonb,
            ${JSON.stringify(resultSnapshot)}::jsonb, ${changeNote}, ${owner.actorSubject}, now()
          )`,
    ];
    await sql.transaction(queries);
    const generationReadiness = await fetchComponentGenerationReadiness(sql, componentId);
    return res.status(200).json({
      ok: true,
      replayed: false,
      operation: { ...resultSnapshot, generationReadiness },
    });
  } catch (error) {
    const status = error.code === "23505" ? 409 : error.statusCode || 500;
    return res.status(status).json({
      error: "Reference component publish failed",
      code: error.code || "REFERENCE_COMPONENT_PUBLISH_FAILED",
      message: error.message,
    });
  }
};
