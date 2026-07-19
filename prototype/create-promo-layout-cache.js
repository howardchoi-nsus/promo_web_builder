(function initCreatePromoLayoutCache(globalScope) {
  const IDENTITY_FIELDS = [
    "templateId",
    "templateKey",
    "templateVersion",
    "layoutId",
    "layoutRevision",
    "configRevision",
    "rendererKey",
    "rendererVersion",
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeLayoutIdentity(value = {}) {
    if (!value || typeof value !== "object" || Number(value.contractVersion) !== 2) return null;
    const identity = {
      contractVersion: 2,
      templateId: String(value.templateId || ""),
      templateKey: String(value.templateKey || ""),
      templateVersion: Number(value.templateVersion || 0),
      layoutId: String(value.layoutId || ""),
      layoutRevision: Number(value.layoutRevision || 0),
      configRevision: String(value.configRevision || ""),
      rendererKey: String(value.rendererKey || ""),
      rendererVersion: Number(value.rendererVersion || 0),
    };
    if (!identity.templateId || !identity.templateKey || identity.templateVersion < 1
      || identity.layoutRevision < 1 || !identity.rendererKey || identity.rendererVersion < 1) {
      return null;
    }
    return identity;
  }

  function sameLayoutIdentity(left, right) {
    const normalizedLeft = normalizeLayoutIdentity(left);
    const normalizedRight = normalizeLayoutIdentity(right);
    if (!normalizedLeft || !normalizedRight) return false;
    return IDENTITY_FIELDS.every((field) => normalizedLeft[field] === normalizedRight[field]);
  }

  function layoutWithoutCreatePromoAppearance(value = {}) {
    const layout = clone(value || {});
    layout.theme = { ...(layout.theme || {}) };
    [
      "backgroundColor",
      "backgroundImage",
      "backgroundImageName",
      "textColor",
      "ctaColor",
      "ctaShape",
      "ctaVariant",
    ].forEach((key) => delete layout.theme[key]);
    return layout;
  }

  function stableValue(value) {
    if (Array.isArray(value)) return value.map(stableValue);
    if (!value || typeof value !== "object") return value;
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = stableValue(value[key]);
      return result;
    }, {});
  }

  function hasLayoutOverrides(baseLayout, resolvedLayout) {
    return JSON.stringify(stableValue(layoutWithoutCreatePromoAppearance(baseLayout)))
      !== JSON.stringify(stableValue(layoutWithoutCreatePromoAppearance(resolvedLayout)));
  }

  function resolveLayoutCache({ savedLayout, incomingIdentity, defaultLayout }) {
    const normalizedIdentity = normalizeLayoutIdentity(incomingIdentity);
    const fallback = clone(defaultLayout || {});
    if (!normalizedIdentity) {
      return { resolvedLayout: fallback, cacheStatus: "invalid_identity", identity: null };
    }
    if (!savedLayout || typeof savedLayout !== "object") {
      return { resolvedLayout: fallback, cacheStatus: "fresh", identity: normalizedIdentity };
    }
    if (!savedLayout.layoutIdentity) {
      return { resolvedLayout: fallback, cacheStatus: "legacy_invalidated", identity: normalizedIdentity };
    }
    if (!sameLayoutIdentity(savedLayout.layoutIdentity, normalizedIdentity)) {
      return { resolvedLayout: fallback, cacheStatus: "identity_mismatch", identity: normalizedIdentity };
    }
    return {
      resolvedLayout: clone(savedLayout.resolvedLayout || fallback),
      cacheStatus: "restored",
      identity: normalizedIdentity,
    };
  }

  const api = {
    normalizeLayoutIdentity,
    sameLayoutIdentity,
    hasLayoutOverrides,
    resolveLayoutCache,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  globalScope.CreatePromoLayoutCache = api;
}(typeof globalThis !== "undefined" ? globalThis : window));
