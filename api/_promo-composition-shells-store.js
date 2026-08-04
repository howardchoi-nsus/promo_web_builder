function normalizeConfig(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function toShellVersion(row) {
  if (!row) return null;
  return {
    id: row.id,
    shellId: row.shell_id,
    shellKey: row.shell_key,
    shellName: row.shell_name,
    shellStatus: row.shell_status,
    version: Number(row.version || 1),
    status: row.status,
    config: normalizeConfig(row.config_json),
    fallbackTemplateId: row.fallback_template_id || null,
    fallbackTemplateVersion: row.fallback_template_version == null
      ? null
      : Number(row.fallback_template_version),
    changeNote: row.change_note || "",
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function fetchShellVersions(sql, { activeOnly = false, shellKey = "" } = {}) {
  const rows = activeOnly
    ? await sql`
      select version.id::text, version.shell_id::text, shell.shell_key,
        shell.name as shell_name, shell.status as shell_status,
        version.version, version.status, version.config_json,
        version.fallback_template_id::text, version.fallback_template_version,
        version.change_note, version.created_at, version.updated_at
      from promo_composition_shell_versions version
      join promo_composition_shells shell on shell.id = version.shell_id
      where version.status = 'active' and shell.status = 'active'
        and (${shellKey} = '' or shell.shell_key = ${shellKey})
      order by shell.shell_key, version.version desc
    `
    : await sql`
      select version.id::text, version.shell_id::text, shell.shell_key,
        shell.name as shell_name, shell.status as shell_status,
        version.version, version.status, version.config_json,
        version.fallback_template_id::text, version.fallback_template_version,
        version.change_note, version.created_at, version.updated_at
      from promo_composition_shell_versions version
      join promo_composition_shells shell on shell.id = version.shell_id
      where (${shellKey} = '' or shell.shell_key = ${shellKey})
      order by shell.shell_key, version.version desc
    `;
  return rows.map(toShellVersion);
}

async function fetchShellVersion(sql, versionId) {
  const rows = await sql`
    select version.id::text, version.shell_id::text, shell.shell_key,
      shell.name as shell_name, shell.status as shell_status,
      version.version, version.status, version.config_json,
      version.fallback_template_id::text, version.fallback_template_version,
      version.change_note, version.created_at, version.updated_at
    from promo_composition_shell_versions version
    join promo_composition_shells shell on shell.id = version.shell_id
    where version.id = ${versionId}::uuid
    limit 1
  `;
  return toShellVersion(rows[0]);
}

async function createShell(sql, input) {
  const rows = await sql`
    select create_promo_composition_shell(
      ${input.shellKey}, ${input.name}, ${input.description || ""},
      ${JSON.stringify(normalizeConfig(input.config))}::jsonb,
      ${input.fallbackTemplateId || null}::uuid,
      ${input.fallbackTemplateVersion || null},
      ${input.changeNote || "Composition shell created."}
    )::text as id
  `;
  return fetchShellVersion(sql, rows[0].id);
}

async function cloneShellVersion(sql, sourceVersionId, changeNote) {
  const rows = await sql`
    select clone_promo_composition_shell_version(
      ${sourceVersionId}::uuid,
      ${changeNote || "Composition shell draft created."}
    )::text as id
  `;
  return fetchShellVersion(sql, rows[0].id);
}

async function updateShellDraft(sql, versionId, input) {
  const current = await fetchShellVersion(sql, versionId);
  if (!current || current.status !== "draft") return null;
  const hasConfig = Object.prototype.hasOwnProperty.call(input, "config");
  const hasFallbackTemplateId = Object.prototype.hasOwnProperty.call(input, "fallbackTemplateId");
  const hasFallbackTemplateVersion = Object.prototype.hasOwnProperty.call(input, "fallbackTemplateVersion");
  const rows = await sql`
    update promo_composition_shell_versions
    set config_json = ${JSON.stringify(hasConfig ? normalizeConfig(input.config) : current.config)}::jsonb,
      fallback_template_id = ${hasFallbackTemplateId ? input.fallbackTemplateId || null : current.fallbackTemplateId}::uuid,
      fallback_template_version = ${hasFallbackTemplateVersion ? input.fallbackTemplateVersion || null : current.fallbackTemplateVersion},
      change_note = ${input.changeNote || "Composition shell draft updated."},
      updated_at = now()
    where id = ${versionId}::uuid and status = 'draft'
    returning id::text
  `;
  return rows[0] ? fetchShellVersion(sql, rows[0].id) : null;
}

async function activateShellVersion(sql, versionId, changeNote) {
  const rows = await sql`
    select activate_promo_composition_shell_version(
      ${versionId}::uuid,
      ${changeNote || "Composition shell version activated."}
    )::text as id
  `;
  return fetchShellVersion(sql, rows[0].id);
}

module.exports = {
  normalizeConfig,
  toShellVersion,
  fetchShellVersions,
  fetchShellVersion,
  createShell,
  cloneShellVersion,
  updateShellDraft,
  activateShellVersion,
};
