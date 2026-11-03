const { fetchComponents } = require("./_item-components-store");
const { fetchTokenSets, fetchTokenVersion, toRuntimeTokenMap } = require("./_design-token-store");
const { fetchResourceVersions } = require("./_promo-content-resources-store");
const { sha256, stableJson } = require("./_promo-service-v3-store");

async function loadGenerationContextV3(sql, filters = {}) {
  const locale = String(filters.locale || "ko-KR").trim();
  const [componentRecords, tokenSets, resourceVersions] = await Promise.all([
    fetchComponents(sql, { includeArchived: false }),
    fetchTokenSets(sql, { activeOnly: true }),
    fetchResourceVersions(sql, { includeContent: true }),
  ]);

  const components = componentRecords.filter((component) => component.activeVersion).map((component) => ({
    id: component.id,
    componentKey: component.componentKey,
    name: component.name,
    status: component.status,
    libraryPresentation: component.libraryPresentation,
    version: component.activeVersion,
  }));
  const activeTokenSets = await Promise.all(tokenSets.map(async (tokenSet) => {
    const versionId = tokenSet.activeVersion?.id || tokenSet.versionId;
    const version = versionId ? await fetchTokenVersion(sql, versionId) : null;
    return version ? {
      setKey: tokenSet.setKey,
      name: tokenSet.name,
      isDefault: tokenSet.isDefault,
      versionId: version.id,
      version: version.version,
      values: toRuntimeTokenMap(version.values || []),
    } : null;
  }));
  const designTokens = {
    sets: activeTokenSets.filter(Boolean),
    defaultSetKey: activeTokenSets.find((tokenSet) => tokenSet?.isDefault)?.setKey
      || activeTokenSets.find(Boolean)?.setKey
      || "",
  };
  const now = Date.now();
  const contentResources = resourceVersions.filter((resource) => {
    const effectiveFrom = resource.effectiveFrom ? new Date(resource.effectiveFrom).getTime() : 0;
    const effectiveTo = resource.effectiveTo ? new Date(resource.effectiveTo).getTime() : Number.POSITIVE_INFINITY;
    return resource.status === "active"
      && resource.resourceStatus === "active"
      && (resource.locale === locale || resource.locale === "*")
      && (!Number.isFinite(effectiveFrom) || effectiveFrom <= now)
      && (!Number.isFinite(effectiveTo) || effectiveTo > now);
  });
  const versionedData = { components, designTokens, contentResources, locale };
  return {
    contractVersion: 3,
    contextVersion: sha256(stableJson(versionedData)),
    components,
    designTokens,
    contentResources,
    assets: [],
    policies: { locale, activeVersionsOnly: true, source: "internal-postgresql" },
  };
}

module.exports = { loadGenerationContextV3 };
