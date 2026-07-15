const { getSql } = require("./_wizard-content-sections-store");

async function recordWizardSectionAudit(sql, entry) {
  await sql`
    insert into wizard_section_audit_logs (
      form_template_id, form_template_key, section_id, section_key,
      item_id, item_key, entity_type, action, summary, previous_state, new_state
    ) values (
      ${entry.formTemplateId || null}::uuid, ${String(entry.formTemplateKey || "")},
      ${entry.sectionId || null}::uuid, ${String(entry.sectionKey || "")},
      ${entry.itemId || null}::uuid, ${String(entry.itemKey || "")},
      ${entry.entityType}, ${entry.action}, ${String(entry.summary || "")},
      ${entry.previousState === undefined ? null : JSON.stringify(entry.previousState)}::jsonb,
      ${entry.newState === undefined ? null : JSON.stringify(entry.newState)}::jsonb
    )
  `;
}

async function listWizardSectionAudits(query = {}) {
  const sql = getSql();
  const templateKey = String(query.templateKey || "").trim();
  const sectionKey = String(query.sectionKey || "").trim();
  const action = String(query.action || "").trim();
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 100, 1), 300);
  const rows = await sql`
    select id::text, form_template_id::text, form_template_key,
      section_id::text, section_key, item_id::text, item_key,
      entity_type, action, summary, previous_state, new_state, created_at
    from wizard_section_audit_logs
    where (${templateKey} = '' or form_template_key = ${templateKey})
      and (${sectionKey} = '' or section_key = ${sectionKey})
      and (${action} = '' or action = ${action})
    order by created_at desc
    limit ${limit}
  `;
  return rows.map((row) => ({
    id: row.id,
    formTemplateId: row.form_template_id || null,
    formTemplateKey: row.form_template_key || "",
    sectionId: row.section_id || null,
    sectionKey: row.section_key || "",
    itemId: row.item_id || null,
    itemKey: row.item_key || "",
    entityType: row.entity_type,
    action: row.action,
    summary: row.summary || "",
    previousState: row.previous_state || null,
    newState: row.new_state || null,
    createdAt: row.created_at,
  }));
}

module.exports = { recordWizardSectionAudit, listWizardSectionAudits };
