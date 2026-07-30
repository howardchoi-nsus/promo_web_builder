const PROMOTION_PURPOSES = ["할인쿠폰", "경품", "이벤트", "기타"];
const AUDIENCES = ["신규", "기존고객", "일반고객"];
const CAMPAIGN_TONES = ["활기찬", "진중함", "럭셔리", "프리미엄", "긴급함", "친근함"];
const OVERVIEW_FIELDS = Object.freeze([
  "title",
  "leadText",
  "promotionPurpose",
  "promotionPurposeOther",
  "market",
  "audience",
  "campaignTone",
  "mainOffer",
]);
const FIELD_ORIGINS = Object.freeze([
  "provided",
  "generated",
  "inferred",
  "needs-confirmation",
]);

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
      required: OVERVIEW_FIELDS,
      properties: {
        title: { type: "string", maxLength: 200 },
        leadText: { type: "string", maxLength: 240 },
        promotionPurpose: { type: "string", enum: PROMOTION_PURPOSES },
        promotionPurposeOther: { type: "string", maxLength: 200 },
        market: { type: "string", maxLength: 200 },
        audience: { type: "string", enum: AUDIENCES },
        campaignTone: { type: "string", enum: CAMPAIGN_TONES },
        mainOffer: { type: "string", maxLength: 1000 },
      },
    },
    fieldDecisions: {
      type: "array",
      maxItems: OVERVIEW_FIELDS.length,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["field", "origin", "confidence", "reason", "requiresConfirmation"],
        properties: {
          field: { type: "string", enum: OVERVIEW_FIELDS },
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
      maxItems: OVERVIEW_FIELDS.length,
      items: { type: "string", enum: OVERVIEW_FIELDS },
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

function normalizeOverview(value = {}) {
  const purpose = PROMOTION_PURPOSES.includes(value.promotionPurpose)
    ? value.promotionPurpose : "";
  return {
    schemaVersion: 4,
    inputMode: value.inputMode === "natural-language" ? "natural-language" : "structured",
    rawNaturalLanguage: text(value.rawNaturalLanguage, 4000),
    title: text(value.title, 200),
    leadText: text(value.leadText, 240),
    promotionPurpose: purpose,
    promotionPurposeOther: purpose === "기타" ? text(value.promotionPurposeOther, 200) : "",
    market: text(value.market, 200),
    audience: AUDIENCES.includes(value.audience) ? value.audience : "",
    campaignTone: CAMPAIGN_TONES.includes(value.campaignTone) ? value.campaignTone : "",
    mainOffer: text(value.mainOffer, 1000),
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
    if (!OVERVIEW_FIELDS.includes(field) || !FIELD_ORIGINS.includes(origin) || decisions.has(field)) return;
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
      .filter((item) => OVERVIEW_FIELDS.includes(item))
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

module.exports = {
  PROMOTION_PURPOSES,
  AUDIENCES,
  CAMPAIGN_TONES,
  OVERVIEW_FIELDS,
  FIELD_ORIGINS,
  OVERVIEW_PARSE_SCHEMA,
  normalizeOverview,
  normalizeParsedOverview,
  overviewFingerprint,
  overviewRequestFingerprint,
};
