const { fingerprint } = require("./_promo-composition-fingerprint");

function normalized(value) {
  return String(value || "").trim().toLowerCase();
}

function localeSpecificity(candidate, requested) {
  const value = normalized(candidate);
  const locale = normalized(requested);
  if (value === locale && value) return 3;
  if (value !== "*" && value === locale.split("-")[0]) return 2;
  if (value === "*") return 1;
  return 0;
}

function ruleScore(rule, criteria) {
  const market = normalized(criteria.market);
  const purpose = normalized(criteria.promotionPurpose);
  const ruleMarket = normalized(rule.marketCode);
  const rulePurpose = normalized(rule.promotionPurpose);
  if (![market, "*"].includes(ruleMarket)) return -1;
  if (![purpose, "*"].includes(rulePurpose)) return -1;
  const localeScore = localeSpecificity(rule.locale, criteria.locale);
  if (!localeScore) return -1;
  return Number(rule.priority || 0) * 1000
    + (ruleMarket === market ? 100 : 0)
    + localeScore * 10
    + (rulePurpose === purpose ? 5 : 0);
}

function selectResourceReferences({ rules = [], versions = [], criteria = {} }) {
  const versionsByResource = new Map();
  versions.forEach((version) => {
    const score = localeSpecificity(version.locale, criteria.locale);
    if (!score) return;
    if (!versionsByResource.has(version.resourceId)) versionsByResource.set(version.resourceId, []);
    versionsByResource.get(version.resourceId).push({ ...version, localeScore: score });
  });
  const selectedRules = new Map();
  rules.forEach((rule) => {
    const score = ruleScore(rule, criteria);
    if (score < 0) return;
    const current = selectedRules.get(rule.resourceId);
    if (!current || score > current.score || (score === current.score && String(rule.id).localeCompare(String(current.rule.id)) < 0)) {
      selectedRules.set(rule.resourceId, { rule, score });
    }
  });
  const references = [];
  const issues = [];
  [...selectedRules.values()].sort((left, right) => (
    right.score - left.score || String(left.rule.resourceKey).localeCompare(String(right.rule.resourceKey))
  )).forEach(({ rule }) => {
    const candidates = (versionsByResource.get(rule.resourceId) || []).sort((left, right) => (
      right.localeScore - left.localeScore
      || Number(right.version) - Number(left.version)
      || String(left.resourceVersionId).localeCompare(String(right.resourceVersionId))
    ));
    const version = candidates[0];
    if (!version) {
      issues.push({
        code: "RESOURCE_VERSION_NOT_AVAILABLE",
        resourceId: rule.resourceId,
        resourceKey: rule.resourceKey,
        required: Boolean(rule.isRequired),
      });
      return;
    }
    references.push({
      resourceId: rule.resourceId,
      resourceKey: rule.resourceKey,
      resourceType: rule.resourceType,
      resourceVersionId: version.resourceVersionId,
      version: Number(version.version),
      locale: version.locale,
      contentHash: version.contentHash,
      marketRuleId: rule.id,
      sectionRole: rule.sectionRole,
      required: Boolean(rule.isRequired),
    });
  });
  return { references, issues };
}

function enrichCandidatesWithResourcePolicy({ sections = [], resources = [] }) {
  const enriched = sections.map((section) => ({
    ...section,
    resourceReferences: [...(section.resourceReferences || [])],
  }));
  const issues = [];
  resources.forEach((resource) => {
    const matches = enriched.filter((section) => section.sectionRole === resource.sectionRole);
    if (!matches.length) {
      if (resource.required) issues.push({
        code: "REQUIRED_RESOURCE_SECTION_MISSING",
        resourceKey: resource.resourceKey,
        sectionRole: resource.sectionRole,
      });
      return;
    }
    const target = matches.sort((left, right) => (
      Number(right.rankScore || 0) - Number(left.rankScore || 0)
      || String(left.sectionKey).localeCompare(String(right.sectionKey))
    ))[0];
    target.resourceReferences.push(resource);
    if (resource.required) {
      target.resolvedRequired = true;
      target.rankScore = Number(target.rankScore || 0) + 2000;
    }
  });
  return {
    sections: enriched.sort((left, right) => (
      Number(right.rankScore || 0) - Number(left.rankScore || 0)
      || Number(left.sortOrder || 0) - Number(right.sortOrder || 0)
      || String(left.sectionKey).localeCompare(String(right.sectionKey))
    )),
    issues,
  };
}

async function resolveContentResourceReferences(sql, { criteria, asOf = new Date().toISOString() }) {
  const rules = await sql`
    select rule.id::text, rule.resource_id::text, resource.resource_key,
      resource.resource_type, rule.market_code, rule.locale, rule.promotion_purpose,
      rule.section_role, rule.is_required, rule.priority
    from promo_content_resource_market_rules rule
    join promo_content_resources resource on resource.id = rule.resource_id
    where rule.status = 'active' and resource.status = 'active'
      and rule.effective_from <= ${asOf}::timestamptz
      and (rule.effective_to is null or rule.effective_to > ${asOf}::timestamptz)
    order by rule.priority desc, resource.resource_key, rule.id
  `;
  const versions = await sql`
    select version.id::text as resource_version_id, version.resource_id::text,
      version.locale, version.version, version.content_hash
    from promo_content_resource_versions version
    join promo_content_resources resource on resource.id = version.resource_id
    where version.status = 'active' and resource.status = 'active'
      and version.effective_from <= ${asOf}::timestamptz
      and (version.effective_to is null or version.effective_to > ${asOf}::timestamptz)
    order by version.resource_id, version.version desc
  `;
  const normalizedRules = rules.map((row) => ({
    id: row.id,
    resourceId: row.resource_id,
    resourceKey: row.resource_key,
    resourceType: row.resource_type,
    marketCode: row.market_code,
    locale: row.locale,
    promotionPurpose: row.promotion_purpose,
    sectionRole: row.section_role,
    isRequired: Boolean(row.is_required),
    priority: Number(row.priority || 0),
  }));
  const normalizedVersions = versions.map((row) => ({
    resourceVersionId: row.resource_version_id,
    resourceId: row.resource_id,
    locale: row.locale,
    version: Number(row.version),
    contentHash: row.content_hash,
  }));
  const resolved = selectResourceReferences({ rules: normalizedRules, versions: normalizedVersions, criteria });
  return { ...resolved, resourceFingerprint: fingerprint(resolved.references) };
}

module.exports = {
  localeSpecificity,
  ruleScore,
  selectResourceReferences,
  enrichCandidatesWithResourcePolicy,
  resolveContentResourceReferences,
};
