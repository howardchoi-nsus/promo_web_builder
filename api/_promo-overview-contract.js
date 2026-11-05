const { CTA_LABEL_MAX_CHARACTERS, normalizeCtaLabel } = require("./_promo-content-policy");
const PROMOTION_PURPOSES = ["할인쿠폰", "경품", "이벤트", "기타"];
const AUDIENCES = ["신규", "기존고객", "일반고객"];
const CAMPAIGN_TONES = ["활기찬", "진중함", "럭셔리", "프리미엄", "긴급함", "친근함"];
const OVERVIEW_FIELDS = Object.freeze([
  "title",
  "leadText",
  "ctaLabel",
  "promotionPurpose",
  "promotionPurposeOther",
  "market",
  "audience",
  "campaignTone",
  "mainOffer",
]);
const OVERVIEW_CONTENT_FIELDS = Object.freeze([
  "contentSections",
  "additionalInformation",
  "notices",
  "legalInformation",
]);
const OVERVIEW_REQUIREMENT_FIELDS = Object.freeze([
  ...OVERVIEW_FIELDS,
  ...OVERVIEW_CONTENT_FIELDS,
]);
const CONTENT_SECTION_TYPES = Object.freeze([
  "hero", "benefits", "cards", "steps", "feature", "story", "stats",
  "faq", "notice", "legal", "footer", "custom",
]);
const CONTENT_PRESENTATION_HINTS = Object.freeze([
  "hero", "cards", "steps", "split-content", "story", "stats", "list",
  "legal", "footer",
]);
const FIELD_ORIGINS = Object.freeze([
  "provided",
  "generated",
  "inferred",
  "needs-confirmation",
]);
const MIN_OVERVIEW_INSTRUCTION_CHARACTERS = 2;
const MAX_OVERVIEW_INSTRUCTION_CHARACTERS = 4000;
const MAX_PROMPT_CONTEXT_JSON_LENGTH = 50000;

const OVERVIEW_PARSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "overview",
    "fieldDecisions",
    "assumptions",
    "missingCriticalInputs",
    "warnings",
    "summary",
    "confidence",
  ],
  properties: {
    overview: {
      type: "object",
      additionalProperties: false,
      required: OVERVIEW_REQUIREMENT_FIELDS,
      properties: {
        title: { type: "string", maxLength: 200 },
        leadText: { type: "string", maxLength: 240 },
        ctaLabel: { type: "string", maxLength: CTA_LABEL_MAX_CHARACTERS },
        promotionPurpose: { type: "string", enum: PROMOTION_PURPOSES },
        promotionPurposeOther: { type: "string", maxLength: 200 },
        market: { type: "string", maxLength: 200 },
        audience: { type: "string", enum: AUDIENCES },
        campaignTone: { type: "string", enum: CAMPAIGN_TONES },
        mainOffer: { type: "string", maxLength: 1000 },
        contentSections: {
          type: "array",
          maxItems: 16,
          items: {
            type: "object",
            additionalProperties: false,
            required: [
              "sectionKey", "sectionType", "title", "description", "presentationHint",
              "items", "cta", "media", "required",
            ],
            properties: {
              sectionKey: { type: "string", maxLength: 100 },
              sectionType: { type: "string", enum: CONTENT_SECTION_TYPES },
              title: { type: "string", maxLength: 200 },
              description: { type: "string", maxLength: 1000 },
              presentationHint: { type: "string", enum: CONTENT_PRESENTATION_HINTS },
              items: {
                type: "array",
                maxItems: 12,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: [
                    "itemKey", "title", "description", "eyebrow", "badge", "value",
                    "imageIntent", "ctaLabel", "ctaUrl", "confirmationRequired",
                  ],
                  properties: {
                    itemKey: { type: "string", maxLength: 100 },
                    title: { type: "string", maxLength: 200 },
                    description: { type: "string", maxLength: 1000 },
                    eyebrow: { type: "string", maxLength: 120 },
                    badge: { type: "string", maxLength: 80 },
                    value: { type: "string", maxLength: 200 },
                    imageIntent: { type: "string", maxLength: 500 },
                    ctaLabel: { type: "string", maxLength: CTA_LABEL_MAX_CHARACTERS },
                    ctaUrl: { type: "string", maxLength: 1000 },
                    confirmationRequired: { type: "boolean" },
                  },
                },
              },
              cta: {
                type: "object",
                additionalProperties: false,
                required: ["label", "url", "confirmationRequired"],
                properties: {
                  label: { type: "string", maxLength: CTA_LABEL_MAX_CHARACTERS },
                  url: { type: "string", maxLength: 1000 },
                  confirmationRequired: { type: "boolean" },
                },
              },
              media: {
                type: "object",
                additionalProperties: false,
                required: ["role", "imageIntent", "altText", "mobileImageRequired"],
                properties: {
                  role: { type: "string", maxLength: 80 },
                  imageIntent: { type: "string", maxLength: 500 },
                  altText: { type: "string", maxLength: 300 },
                  mobileImageRequired: { type: "boolean" },
                },
              },
              required: { type: "boolean" },
            },
          },
        },
        additionalInformation: {
          type: "array",
          maxItems: 20,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["label", "value", "description", "confirmationRequired"],
            properties: {
              label: { type: "string", maxLength: 120 },
              value: { type: "string", maxLength: 500 },
              description: { type: "string", maxLength: 1000 },
              confirmationRequired: { type: "boolean" },
            },
          },
        },
        notices: {
          type: "array",
          maxItems: 20,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["title", "body", "confirmationRequired"],
            properties: {
              title: { type: "string", maxLength: 160 },
              body: { type: "string", maxLength: 1500 },
              confirmationRequired: { type: "boolean" },
            },
          },
        },
        legalInformation: {
          type: "array",
          maxItems: 20,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["title", "body", "confirmationRequired"],
            properties: {
              title: { type: "string", maxLength: 160 },
              body: { type: "string", maxLength: 2000 },
              confirmationRequired: { type: "boolean" },
            },
          },
        },
      },
    },
    fieldDecisions: {
      type: "array",
      maxItems: OVERVIEW_REQUIREMENT_FIELDS.length,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["field", "origin", "confidence", "reason", "requiresConfirmation"],
        properties: {
          field: { type: "string", enum: OVERVIEW_REQUIREMENT_FIELDS },
          origin: { type: "string", enum: FIELD_ORIGINS },
          confidence: { type: "number", minimum: 0, maximum: 1 },
          reason: { type: "string", maxLength: 300 },
          requiresConfirmation: { type: "boolean" },
        },
      },
    },
    assumptions: {
      type: "array",
      maxItems: 20,
      items: { type: "string", maxLength: 300 },
    },
    missingCriticalInputs: {
      type: "array",
      maxItems: OVERVIEW_REQUIREMENT_FIELDS.length,
      items: { type: "string", enum: OVERVIEW_REQUIREMENT_FIELDS },
    },
    warnings: {
      type: "array",
      maxItems: 20,
      items: { type: "string", maxLength: 300 },
    },
    summary: { type: "string", maxLength: 600 },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
};

function text(value, maxLength = 2000) {
  return String(value || "").trim().slice(0, maxLength);
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

function validateOverviewInstruction(value) {
  const instruction = String(value || "").trim();
  if (instruction.length < MIN_OVERVIEW_INSTRUCTION_CHARACTERS) {
    throw Object.assign(
      new Error(`프로모션 요구사항을 ${MIN_OVERVIEW_INSTRUCTION_CHARACTERS}자 이상 입력해 주세요.`),
      { code: "OVERVIEW_INSTRUCTION_TOO_SHORT", statusCode: 422 },
    );
  }
  if (instruction.length > MAX_OVERVIEW_INSTRUCTION_CHARACTERS) {
    throw Object.assign(
      new Error(`프로모션 요구사항은 ${MAX_OVERVIEW_INSTRUCTION_CHARACTERS}자 이하여야 합니다.`),
      { code: "OVERVIEW_INSTRUCTION_TOO_LONG", statusCode: 422 },
    );
  }
  return instruction;
}

function normalizeOverview(value = {}) {
  const purpose = PROMOTION_PURPOSES.includes(value.promotionPurpose)
    ? value.promotionPurpose : "";
  return {
    schemaVersion: 6,
    inputMode: value.inputMode === "natural-language" ? "natural-language" : "structured",
    rawNaturalLanguage: text(value.rawNaturalLanguage, 4000),
    title: text(value.title, 200),
    leadText: text(value.leadText, 240),
    ctaLabel: normalizeCtaLabel(value.ctaLabel),
    promotionPurpose: purpose,
    promotionPurposeOther: purpose === "기타" ? text(value.promotionPurposeOther, 200) : "",
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

function uniqueTextList(value, maxItems = 20) {
  return Array.from(new Set(
    (Array.isArray(value) ? value : [])
      .map((item) => text(item, 300))
      .filter(Boolean)
  )).slice(0, maxItems);
}

function normalizeParsedOverview({ result = {}, instruction = "" }) {
  const overview = normalizeOverview({
    ...(result.overview || {}),
    inputMode: "natural-language",
    rawNaturalLanguage: instruction,
  });
  const decisions = new Map();
  (Array.isArray(result.fieldDecisions) ? result.fieldDecisions : []).forEach((item) => {
    const field = text(item?.field, 120);
    const origin = text(item?.origin, 120);
    if (!OVERVIEW_REQUIREMENT_FIELDS.includes(field) || !FIELD_ORIGINS.includes(origin) || decisions.has(field)) return;
    decisions.set(field, {
      field,
      origin,
      confidence: Math.max(0, Math.min(1, Number(item?.confidence) || 0)),
      reason: text(item?.reason, 300),
      requiresConfirmation: Boolean(item?.requiresConfirmation),
    });
  });
  const missingCriticalInputs = Array.from(new Set(
    (Array.isArray(result.missingCriticalInputs) ? result.missingCriticalInputs : [])
      .map((item) => text(item, 120))
      .filter((item) => OVERVIEW_REQUIREMENT_FIELDS.includes(item))
  ));
  if (!overview.market && !missingCriticalInputs.includes("market")) {
    missingCriticalInputs.push("market");
  }
  return {
    overview,
    fieldDecisions: Array.from(decisions.values()),
    assumptions: uniqueTextList(result.assumptions),
    missingCriticalInputs,
    warnings: uniqueTextList(result.warnings),
    summary: text(result.summary, 600),
    confidence: Math.max(0, Math.min(1, Number(result.confidence) || 0)),
  };
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

function overviewFingerprint(value) {
  return fnvFingerprint("overview", stableStringify(normalizeOverview(value)));
}

function overviewRequestFingerprint(value) {
  return fnvFingerprint("overview-request", text(value, 4000));
}

function promptContextValue(value, fallback, label) {
  let parsed = value;
  if (typeof parsed === "string") {
    const source = parsed.trim();
    if (!source) return fallback;
    try {
      parsed = JSON.parse(source);
    } catch {
      throw Object.assign(new Error(`${label} must be valid JSON`), {
        code: "OVERVIEW_PROMPT_CONTEXT_INVALID",
        statusCode: 422,
      });
    }
  }
  if (!parsed || typeof parsed !== "object") {
    throw Object.assign(new Error(`${label} must be a JSON object or array`), {
      code: "OVERVIEW_PROMPT_CONTEXT_INVALID",
      statusCode: 422,
    });
  }
  return parsed;
}

function promptContextJson(value, fallback, label) {
  const serialized = JSON.stringify(promptContextValue(value, fallback, label));
  if (serialized.length > MAX_PROMPT_CONTEXT_JSON_LENGTH) {
    throw Object.assign(new Error(`${label} exceeds the ${MAX_PROMPT_CONTEXT_JSON_LENGTH} character limit`), {
      code: "OVERVIEW_PROMPT_CONTEXT_TOO_LARGE",
      statusCode: 422,
    });
  }
  return serialized;
}

function requestLocale(acceptLanguage = "") {
  return text(String(acceptLanguage || "").split(",")[0].split(";")[0], 64);
}

function inputLanguageLocale(value = "") {
  const source = text(value, 4000)
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/\b(?:[A-Z]{2,}|[a-z]+_[a-z0-9_]+|[a-z]+-[A-Z]{2})\b/g, " ");
  if (!source) return "";
  const counts = {
    ko: (source.match(/[\uac00-\ud7af]/g) || []).length,
    ja: (source.match(/[\u3040-\u30ff]/g) || []).length,
    zh: (source.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g) || []).length,
    ar: (source.match(/[\u0600-\u06ff]/g) || []).length,
    th: (source.match(/[\u0e00-\u0e7f]/g) || []).length,
    cyrl: (source.match(/[\u0400-\u04ff]/g) || []).length,
    latin: (source.match(/[A-Za-z\u00c0-\u024f]/g) || []).length,
  };
  if (counts.ko > 0 && counts.ko >= counts.ja && counts.ko >= counts.zh) return "ko";
  if (counts.ja > 0) return "ja";
  if (counts.zh > 0) return "zh";
  if (counts.ar > 0) return "ar";
  if (counts.th > 0) return "th";
  if (counts.cyrl > 0) return "ru";
  if (counts.latin > 0) return "en";
  return "";
}

function buildOverviewPromptContexts({
  productCatalog,
  localeAndMarket,
  naturalLanguage,
  locale,
  market,
  acceptLanguage,
  currentOverview,
} = {}) {
  const suppliedLocaleAndMarket = promptContextValue(
    localeAndMarket || {},
    {},
    "localeAndMarket",
  );
  if (Array.isArray(suppliedLocaleAndMarket)) {
    throw Object.assign(new Error("localeAndMarket must be a JSON object"), {
      code: "OVERVIEW_PROMPT_CONTEXT_INVALID",
      statusCode: 422,
    });
  }
  const overview = currentOverview && typeof currentOverview === "object" && !Array.isArray(currentOverview)
    ? currentOverview
    : {};
  const detectedInputLocale = inputLanguageLocale(naturalLanguage);
  const normalizedLocaleAndMarket = {
    locale: text(detectedInputLocale || locale || suppliedLocaleAndMarket.locale || requestLocale(acceptLanguage), 64),
    market: text(market || suppliedLocaleAndMarket.market || overview.market, 200),
  };
  return {
    productCatalogJson: promptContextJson(productCatalog || [], [], "productCatalog"),
    localeAndMarketJson: promptContextJson(normalizedLocaleAndMarket, {}, "localeAndMarket"),
  };
}

module.exports = {
  PROMOTION_PURPOSES,
  AUDIENCES,
  CAMPAIGN_TONES,
  OVERVIEW_FIELDS,
  OVERVIEW_CONTENT_FIELDS,
  OVERVIEW_REQUIREMENT_FIELDS,
  CONTENT_SECTION_TYPES,
  CONTENT_PRESENTATION_HINTS,
  FIELD_ORIGINS,
  MIN_OVERVIEW_INSTRUCTION_CHARACTERS,
  MAX_OVERVIEW_INSTRUCTION_CHARACTERS,
  OVERVIEW_PARSE_SCHEMA,
  validateOverviewInstruction,
  normalizeOverview,
  normalizeParsedOverview,
  inputLanguageLocale,
  buildOverviewPromptContexts,
  overviewFingerprint,
  overviewRequestFingerprint,
};
