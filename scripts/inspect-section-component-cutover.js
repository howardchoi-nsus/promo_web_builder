const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("../api/_db");

const databaseUrl = getDatabaseUrl();
if (!databaseUrl) {
  console.error("DATABASE_URL is not configured. This inspection is read-only and did not run.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function scalar(queryResult, key = "count") {
  const rows = await queryResult;
  return Number(rows[0]?.[key] || 0);
}

async function main() {
  const [
    templates,
    memberships,
    layouts,
    sections,
    items,
    components,
    sectionDesignRuns,
    activeSectionDesignRuns,
    missingTemplateSnapshots,
  ] = await Promise.all([
    scalar(sql`select count(*)::integer as count from wizard_form_templates`),
    scalar(sql`select count(*)::integer as count from wizard_form_template_sections`),
    scalar(sql`select count(*)::integer as count from wizard_form_template_layouts`),
    scalar(sql`select count(*)::integer as count from wizard_content_sections`),
    scalar(sql`select count(*)::integer as count from wizard_content_section_items`),
    scalar(sql`select count(*)::integer as count from wizard_section_components`),
    scalar(sql`select count(*)::integer as count from promo_section_design_runs`),
    scalar(sql`
      select count(*)::integer as count
      from promo_section_design_runs
      where status in (
        'queued', 'analyzing_content', 'generating_layout', 'validating_layout',
        'generating_assets', 'validating_assets', 'ready'
      )
    `),
    scalar(sql`
      select count(*)::integer as count
      from promo_section_design_runs
      where nullif(trim(template_key_snapshot), '') is null
        or input_snapshot = '{}'::jsonb
    `),
  ]);

  const foreignKeys = await sql`
    select
      source.relname as source_table,
      constraint_row.conname as constraint_name,
      target.relname as target_table,
      constraint_row.confdeltype as delete_action
    from pg_constraint constraint_row
    join pg_class source on source.oid = constraint_row.conrelid
    join pg_class target on target.oid = constraint_row.confrelid
    where constraint_row.contype = 'f'
      and target.relname in (
        'wizard_form_templates', 'wizard_form_template_sections',
        'wizard_content_sections', 'wizard_content_section_items'
      )
    order by target.relname, source.relname, constraint_row.conname
  `;

  const runTemplateFk = foreignKeys.find((row) => (
    row.source_table === "promo_section_design_runs"
    && row.target_table === "wizard_form_templates"
  ));
  const gates = {
    noActiveSectionDesignRuns: activeSectionDesignRuns === 0,
    sectionDesignSnapshotsComplete: missingTemplateSnapshots === 0,
    sectionDesignRunTemplateFkPreservesRows: runTemplateFk?.delete_action === "n",
  };

  console.log(JSON.stringify({
    ok: Object.values(gates).every(Boolean),
    readOnly: true,
    counts: {
      templates,
      memberships,
      layouts,
      sections,
      items,
      components,
      sectionDesignRuns,
      activeSectionDesignRuns,
      missingTemplateSnapshots,
    },
    gates,
    foreignKeys,
    note: "No rows were changed. Back up configuration and verify generated-promotion snapshots before any reset.",
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
