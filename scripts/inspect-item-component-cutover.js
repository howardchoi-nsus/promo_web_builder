const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("../api/_db");

async function main() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) throw new Error("DATABASE_URL or PREVIEW_DATABASE_URL is not configured");
  const sql = neon(databaseUrl);
  const relations = await sql`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_name = any(${[
      "wizard_item_components", "wizard_item_component_versions",
      "wizard_content_section_component_instances", "promo_design_token_sets",
      "promo_design_token_set_versions", "promo_section_design_asset_jobs",
    ]}::text[])
  `;
  const names = new Set(relations.map((row) => row.table_name));
  const required = [
    "wizard_item_components", "wizard_item_component_versions",
    "wizard_content_section_component_instances", "promo_design_token_sets",
    "promo_design_token_set_versions", "promo_section_design_asset_jobs",
  ];
  const result = { readOnly: true, schemaReady: required.every((name) => names.has(name)), missingTables: required.filter((name) => !names.has(name)) };
  if (result.schemaReady) {
    const [counts] = await sql`
      select
        (select count(*)::integer from wizard_item_components where status = 'active') as components,
        (select count(*)::integer from wizard_item_component_versions where status = 'active') as active_component_versions,
        (select count(*)::integer from wizard_content_section_component_instances) as section_instances,
        (select count(*)::integer from promo_design_token_set_versions where status = 'active') as active_token_sets,
        (select count(*)::integer from wizard_form_templates where status = 'active' and design_token_set_version_id is not null) as active_templates_with_tokens
    `;
    Object.assign(result, counts);
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.schemaReady) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
