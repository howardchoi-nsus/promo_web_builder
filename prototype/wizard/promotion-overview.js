(function registerPromotionOverview(global) {
  function text(value, maxLength = 2000) {
    return String(value || "").trim().slice(0, maxLength);
  }

  function normalize(value = {}) {
    return {
      schemaVersion: 2,
      inputMode: value.inputMode === "natural-language" ? "natural-language" : "structured",
      rawNaturalLanguage: text(value.rawNaturalLanguage, 4000),
      title: text(value.title, 200),
      promotionPurpose: text(value.promotionPurpose, 100),
      promotionPurposeOther: text(value.promotionPurposeOther, 200),
      market: text(value.market, 200),
      audience: text(value.audience, 100),
      campaignTone: text(value.campaignTone, 100),
      mainOffer: text(value.mainOffer, 1000),
      primaryAction: {
        label: text(value.primaryAction?.label, 120),
        url: text(value.primaryAction?.url, 2000),
      },
    };
  }

  function fromLegacy(content = {}) {
    const saved = content.promotionOverview || {};
    return normalize({
      ...saved,
      title: content.promo?.title || saved.title,
      promotionPurpose: content.promo?.promotionPurpose || saved.promotionPurpose,
      promotionPurposeOther: content.promo?.promotionPurposeOther || saved.promotionPurposeOther,
      market: content.promo?.market || saved.market,
      audience: content.simpleBrief?.audience || saved.audience,
      campaignTone: content.simpleBrief?.campaignTone || saved.campaignTone,
      mainOffer: content.simpleBrief?.mainOffer || saved.mainOffer,
      primaryAction: {
        label: content.promo?.ctaLabel || saved.primaryAction?.label,
        url: content.promo?.ctaUrl || saved.primaryAction?.url,
      },
    });
  }

  function applyToLegacy(content, value) {
    const overview = normalize(value);
    content.promotionOverview = overview;
    content.promo = content.promo || {};
    content.simpleBrief = content.simpleBrief || {};
    content.promo.title = overview.title;
    content.promo.promotionPurpose = overview.promotionPurpose;
    content.promo.promotionPurposeOther = overview.promotionPurpose === "기타"
      ? overview.promotionPurposeOther : "";
    content.promo.market = overview.market;
    content.promo.ctaLabel = overview.primaryAction.label;
    content.promo.ctaUrl = overview.primaryAction.url;
    content.simpleBrief.audience = overview.audience;
    content.simpleBrief.campaignTone = overview.campaignTone;
    content.simpleBrief.mainOffer = overview.mainOffer;
    return overview;
  }

  function syncFromLegacy(content) {
    content.promotionOverview = fromLegacy(content);
    return content.promotionOverview;
  }

  function stableStringify(value) {
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
    if (value && typeof value === "object") {
      return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
    }
    return JSON.stringify(value);
  }

  function fingerprint(value) {
    const input = stableStringify(normalize(value));
    let hash = 2166136261;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `overview-${(hash >>> 0).toString(16).padStart(8, "0")}`;
  }

  global.PromoPromotionOverview = Object.freeze({
    normalize,
    fromLegacy,
    applyToLegacy,
    syncFromLegacy,
    fingerprint,
  });
})(globalThis);
