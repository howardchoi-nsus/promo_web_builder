const { createHash } = require("node:crypto");
const { stableStringify } = require("./_promo-composition-fingerprint");

function contentHash(content) {
  return createHash("sha256").update(stableStringify(content || {})).digest("hex");
}

function toResourceVersion(row, { includeContent = false } = {}) {
  if (!row) return null;
  return {
    resourceId: row.resource_id,
    resourceKey: row.resource_key,
    resourceType: row.resource_type,
    resourceName: row.resource_name,
    resourceStatus: row.resource_status,
    resourceVersionId: row.resource_version_id || row.id,
    locale: row.locale,
    version: Number(row.version || 1),
    status: row.status,
    contentHash: row.content_hash,
    effectiveFrom: row.effective_from,
    effectiveTo: row.effective_to || null,
    changeNote: row.change_note || "",
    ...(includeContent ? { content: row.content_json || {} } : {}),
  };
}

async function fetchResourceVersions(sql, { resourceId = "", includeContent = false } = {}) {
  const rows = await sql`
    select resource.id::text as resource_id, resource.resource_key, resource.resource_type,
      resource.name as resource_name, resource.status as resource_status,
      version.id::text as resource_version_id, version.locale, version.version,
      version.status, version.content_json, version.content_hash,
      version.effective_from, version.effective_to, version.change_note
    from promo_content_resources resource
    join promo_content_resource_versions version on version.resource_id = resource.id
    where (${resourceId} = '' or resource.id = ${resourceId || null}::uuid)
    order by resource.resource_key, version.locale, version.version desc
  `;
  return rows.map((row) => toResourceVersion(row, { includeContent }));
}

async function fetchPinnedResourceVersions(sql, references = []) {
  const ids = Array.from(new Set(references.map((item) => String(item?.resourceVersionId || "").trim()).filter(Boolean)));
  if (!ids.length) return new Map();
  const rows = await sql`
    select resource.id::text as resource_id, resource.resource_key, resource.resource_type,
      resource.name as resource_name, resource.status as resource_status,
      version.id::text as resource_version_id, version.locale, version.version,
      version.status, version.content_json, version.content_hash,
      version.effective_from, version.effective_to, version.change_note
    from promo_content_resource_versions version
    join promo_content_resources resource on resource.id = version.resource_id
    where version.id = any(${ids}::uuid[])
  `;
  const byId = new Map(rows.map((row) => [row.resource_version_id, toResourceVersion(row, { includeContent: true })]));
  references.forEach((reference) => {
    const version = byId.get(reference.resourceVersionId);
    if (!version) {
      throw Object.assign(new Error(`Pinned content Resource version not found: ${reference.resourceKey}`), {
        code: "PINNED_RESOURCE_VERSION_NOT_FOUND",
        statusCode: 409,
      });
    }
    if (version.status !== "active" || version.resourceStatus !== "active") {
      throw Object.assign(new Error(`Pinned content Resource version is not active: ${reference.resourceKey}`), {
        code: "PINNED_RESOURCE_VERSION_NOT_ACTIVE",
        statusCode: 409,
      });
    }
    if (version.contentHash !== reference.contentHash || contentHash(version.content) !== reference.contentHash) {
      throw Object.assign(new Error(`Pinned content Resource hash mismatch: ${reference.resourceKey}`), {
        code: "PINNED_RESOURCE_HASH_MISMATCH",
        statusCode: 409,
      });
    }
  });
  return byId;
}

async function createResource(sql, input) {
  const state = {
    resourceKey: input.resourceKey,
    resourceType: input.resourceType,
    name: input.name,
    status: "active",
  };
  const rows = await sql`
    with created as (
      insert into promo_content_resources (
        resource_key, resource_type, name, description, status
      ) values (
        ${input.resourceKey}, ${input.resourceType}, ${input.name},
        ${input.description || ""}, 'active'
      ) returning id
    ), recorded as (
      insert into promo_content_resource_histories (
        resource_id, action, change_note, new_state
      )
      select id, 'resource-created', ${input.changeNote || "Content resource created."},
        ${JSON.stringify(state)}::jsonb
      from created
    )
    select id::text from created
  `;
  const resourceId = rows[0].id;
  return { id: resourceId, resourceKey: input.resourceKey };
}

async function createResourceVersion(sql, input) {
  const content = input.content && typeof input.content === "object" && !Array.isArray(input.content)
    ? input.content : {};
  const hash = contentHash(content);
  const rows = await sql`
    select create_promo_content_resource_version(
      ${input.resourceId}::uuid, ${input.locale}, ${JSON.stringify(content)}::jsonb,
      ${hash}, ${input.effectiveFrom}::timestamptz,
      ${input.effectiveTo || null}::timestamptz, ${input.changeNote || "Content resource version created."}
    )::text as id
  `;
  return { id: rows[0].id, contentHash: hash };
}

async function activateResourceVersion(sql, versionId, changeNote) {
  const rows = await sql`
    select activate_promo_content_resource_version(
      ${versionId}::uuid, ${changeNote || "Content resource version activated."}
    )::text as id
  `;
  return { id: rows[0].id };
}

async function createResourceRule(sql, input) {
  const state = {
    marketCode: input.marketCode || "*",
    locale: input.locale || "*",
    promotionPurpose: input.promotionPurpose || "*",
    sectionRole: input.sectionRole,
    isRequired: input.isRequired !== false,
    priority: Number(input.priority || 0),
  };
  const rows = await sql`
    with created as (
      insert into promo_content_resource_market_rules (
        resource_id, market_code, locale, promotion_purpose, section_role,
        is_required, priority, status, effective_from, effective_to
      ) values (
        ${input.resourceId}::uuid, ${input.marketCode || "*"}, ${input.locale || "*"},
        ${input.promotionPurpose || "*"}, ${input.sectionRole},
        ${input.isRequired !== false}, ${Number(input.priority || 0)}, 'active',
        ${input.effectiveFrom}::timestamptz, ${input.effectiveTo || null}::timestamptz
      ) returning id, resource_id
    ), recorded as (
      insert into promo_content_resource_histories (
        resource_id, market_rule_id, action, change_note, new_state
      )
      select resource_id, id, 'market-rule-created',
        ${input.changeNote || "Content resource market rule created."},
        ${JSON.stringify(state)}::jsonb
      from created
    )
    select id::text from created
  `;
  return { id: rows[0].id };
}

module.exports = {
  contentHash,
  toResourceVersion,
  fetchResourceVersions,
  fetchPinnedResourceVersions,
  createResource,
  createResourceVersion,
  activateResourceVersion,
  createResourceRule,
};
