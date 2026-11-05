(function registerPromotionOverview(global) {
  const PROMOTION_PURPOSES = ["할인쿠폰", "경품", "이벤트", "기타"];
  const AUDIENCES = ["신규", "기존고객", "일반고객"];
  const CAMPAIGN_TONES = ["활기찬", "진중함", "럭셔리", "프리미엄", "긴급함", "친근함"];
  const CONTENT_SECTION_TYPES = [
    "hero", "benefits", "cards", "steps", "feature", "story", "stats",
    "faq", "notice", "legal", "footer", "custom",
  ];
  const CONTENT_PRESENTATION_HINTS = [
    "hero", "cards", "steps", "split-content", "story", "stats", "list",
    "legal", "footer",
  ];

  function text(value, maxLength = 2000) {
    return String(value || "").trim().slice(0, maxLength);
  }

  function normalizeCtaLabel(value) {
    const label = String(value ?? "").trim().replace(/\s+/g, " ");
    if (Array.from(label).length > 20) {
      const error = new Error("CTA label must not exceed 20 characters");
      error.code = "CTA_LABEL_TOO_LONG";
      error.maxCharacters = 20;
      throw error;
    }
    return label;
  }

  function normalizeContentItem(value = {}, index = 0) {
    return {
      itemKey: text(value.itemKey, 100) || `item-${index + 1}`,
      title: text(value.title, 200),
      description: text(value.description, 1000),
      eyebrow: text(value.eyebrow, 120),
      badge: text(value.badge, 80),
      value: text(value.value, 200),
      imageIntent: text(value.imageIntent, 500),
      ctaLabel: normalizeCtaLabel(value.ctaLabel),
      ctaUrl: text(value.ctaUrl, 1000),
      confirmationRequired: Boolean(value.confirmationRequired),
    };
  }

  function normalizeContentSection(value = {}, index = 0) {
    const sectionType = CONTENT_SECTION_TYPES.includes(value.sectionType) ? value.sectionType : "custom";
    const defaultPresentation = sectionType === "benefits" || sectionType === "cards" ? "cards"
      : sectionType === "steps" ? "steps"
        : sectionType === "stats" ? "stats"
          : sectionType === "legal" || sectionType === "notice" ? "legal"
            : sectionType === "footer" ? "footer"
              : sectionType === "hero" ? "hero"
                : "story";
    return {
      sectionKey: text(value.sectionKey, 100) || `section-${index + 1}`,
      sectionType,
      title: text(value.title, 200),
      description: text(value.description, 1000),
      presentationHint: CONTENT_PRESENTATION_HINTS.includes(value.presentationHint)
        ? value.presentationHint : defaultPresentation,
      items: (Array.isArray(value.items) ? value.items : []).slice(0, 12)
        .map((item, itemIndex) => normalizeContentItem(item, itemIndex)),
      cta: {
        label: normalizeCtaLabel(value.cta?.label),
        url: text(value.cta?.url, 1000),
        confirmationRequired: Boolean(value.cta?.confirmationRequired),
      },
      media: {
        role: text(value.media?.role, 80),
        imageIntent: text(value.media?.imageIntent, 500),
        altText: text(value.media?.altText, 300),
        mobileImageRequired: Boolean(value.media?.mobileImageRequired),
      },
      required: value.required !== false,
    };
  }

  function normalizeAdditionalInformation(value = {}) {
    return {
      label: text(value.label, 120),
      value: text(value.value, 500),
      description: text(value.description, 1000),
      confirmationRequired: Boolean(value.confirmationRequired),
    };
  }

  function normalizeNotice(value = {}, maxBodyLength = 1500) {
    return {
      title: text(value.title, 160),
      body: text(value.body, maxBodyLength),
      confirmationRequired: Boolean(value.confirmationRequired),
    };
  }

  function normalize(value = {}) {
    const promotionPurpose = PROMOTION_PURPOSES.includes(value.promotionPurpose)
      ? value.promotionPurpose : "";
    return {
      schemaVersion: 6,
      inputMode: value.inputMode === "natural-language" ? "natural-language" : "structured",
      rawNaturalLanguage: text(value.rawNaturalLanguage, 4000),
      title: text(value.title, 200),
      leadText: text(value.leadText, 240),
      ctaLabel: normalizeCtaLabel(value.ctaLabel),
      promotionPurpose,
      promotionPurposeOther: promotionPurpose === "기타"
        ? text(value.promotionPurposeOther, 200) : "",
      market: text(value.market, 200),
      audience: AUDIENCES.includes(value.audience) ? value.audience : "",
      campaignTone: CAMPAIGN_TONES.includes(value.campaignTone) ? value.campaignTone : "",
      mainOffer: text(value.mainOffer, 1000),
      contentSections: (Array.isArray(value.contentSections) ? value.contentSections : []).slice(0, 16)
        .map((section, index) => normalizeContentSection(section, index)),
      additionalInformation: (Array.isArray(value.additionalInformation) ? value.additionalInformation : []).slice(0, 20)
        .map(normalizeAdditionalInformation),
      notices: (Array.isArray(value.notices) ? value.notices : []).slice(0, 20)
        .map((notice) => normalizeNotice(notice, 1500)),
      legalInformation: (Array.isArray(value.legalInformation) ? value.legalInformation : []).slice(0, 20)
        .map((notice) => normalizeNotice(notice, 2000)),
    };
  }

  function fromLegacy(content = {}) {
    const saved = content.promotionOverview || {};
    return normalize({
      ...saved,
      title: content.promo?.title || saved.title,
      leadText: content.promo?.leadText || saved.leadText,
      ctaLabel: content.promo?.ctaLabel || saved.ctaLabel,
      promotionPurpose: content.promo?.promotionPurpose || saved.promotionPurpose,
      promotionPurposeOther: content.promo?.promotionPurposeOther || saved.promotionPurposeOther,
      market: content.promo?.market || saved.market,
      audience: content.simpleBrief?.audience || saved.audience,
      campaignTone: content.simpleBrief?.campaignTone || saved.campaignTone,
      mainOffer: content.simpleBrief?.mainOffer || saved.mainOffer,
    });
  }

  function applyToLegacy(content, value) {
    const overview = normalize(value);
    content.promotionOverview = overview;
    content.promo = content.promo || {};
    content.simpleBrief = content.simpleBrief || {};
    content.promo.title = overview.title;
    content.promo.leadText = overview.leadText;
    content.promo.ctaLabel = overview.ctaLabel;
    content.promo.promotionPurpose = overview.promotionPurpose;
    content.promo.promotionPurposeOther = overview.promotionPurpose === "기타"
      ? overview.promotionPurposeOther : "";
    content.promo.market = overview.market;
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

  function fnvFingerprint(prefix, input) {
    let hash = 2166136261;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `${prefix}-${(hash >>> 0).toString(16).padStart(8, "0")}`;
  }

  function fingerprint(value) {
    return fnvFingerprint("overview", stableStringify(normalize(value)));
  }

  function requestFingerprint(value) {
    return fnvFingerprint("overview-request", text(value, 4000));
  }

  global.PromoPromotionOverview = Object.freeze({
    normalize,
    fromLegacy,
    applyToLegacy,
    syncFromLegacy,
    fingerprint,
    requestFingerprint,
  });
})(globalThis);
