const { createHash } = require("node:crypto");

const PROMOTION_PURPOSES = ["할인쿠폰", "경품", "이벤트", "기타"];
const AUDIENCES = ["신규", "기존고객", "일반고객"];
const CAMPAIGN_TONES = ["활기찬", "진중함", "럭셔리", "프리미엄", "긴급함", "친근함"];

const OVERVIEW_PARSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["overview", "missingInputs", "uncertainInputs", "summary", "confidence"],
  properties: {
    overview: {
      type: "object",
      additionalProperties: false,
      required: [
        "title", "promotionPurpose", "promotionPurposeOther", "market",
        "audience", "campaignTone", "mainOffer", "primaryAction",
      ],
      properties: {
        title: { type: "string", maxLength: 200 },
        promotionPurpose: { type: "string", enum: PROMOTION_PURPOSES },
        promotionPurposeOther: { type: "string", maxLength: 200 },
        market: { type: "string", maxLength: 200 },
        audience: { type: "string", enum: AUDIENCES },
        campaignTone: { type: "string", enum: CAMPAIGN_TONES },
        mainOffer: { type: "string", maxLength: 1000 },
        primaryAction: {
          type: "object",
          additionalProperties: false,
          required: ["label", "url"],
          properties: {
            label: { type: "string", maxLength: 120 },
            url: { type: "string", maxLength: 2000 },
          },
        },
      },
    },
    missingInputs: {
      type: "array",
      maxItems: 20,
      items: { type: "string", maxLength: 200 },
    },
    uncertainInputs: {
      type: "array",
      maxItems: 20,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["field", "reason"],
        properties: {
          field: { type: "string", maxLength: 120 },
          reason: { type: "string", maxLength: 300 },
        },
      },
    },
    summary: { type: "string", maxLength: 600 },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
};

function text(value, maxLength = 2000) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizedUrl(value) {
  const raw = text(value, 2000);
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function normalizeOverview(value = {}) {
  const purpose = PROMOTION_PURPOSES.includes(value.promotionPurpose)
    ? value.promotionPurpose : "";
  const audience = AUDIENCES.includes(value.audience) ? value.audience : "";
  const campaignTone = CAMPAIGN_TONES.includes(value.campaignTone) ? value.campaignTone : "";
  return {
    schemaVersion: 2,
    inputMode: value.inputMode === "natural-language" ? "natural-language" : "structured",
    rawNaturalLanguage: text(value.rawNaturalLanguage, 4000),
    title: text(value.title, 200),
    promotionPurpose: purpose,
    promotionPurposeOther: purpose === "기타" ? text(value.promotionPurposeOther, 200) : "",
    market: text(value.market, 200),
    audience,
    campaignTone,
    mainOffer: text(value.mainOffer, 1000),
    primaryAction: {
      label: text(value.primaryAction?.label, 120),
      url: normalizedUrl(value.primaryAction?.url),
    },
  };
}

function hasExplicitUrl(instruction, currentOverview) {
  const allowed = new Set(
    `${instruction || ""} ${currentOverview?.primaryAction?.url || ""}`
      .match(/https?:\/\/[^\s"'<>]+/gi) || []
  );
  return allowed;
}

function normalizeParsedOverview({ result = {}, instruction = "", currentOverview = {} }) {
  const parsed = normalizeOverview({
    ...(result.overview || {}),
    inputMode: "natural-language",
    rawNaturalLanguage: instruction,
  });
  const allowedUrls = hasExplicitUrl(instruction, currentOverview);
  const returnedUrl = parsed.primaryAction.url;
  if (returnedUrl && !allowedUrls.has(returnedUrl) && returnedUrl !== currentOverview?.primaryAction?.url) {
    parsed.primaryAction.url = "";
  }
  const missingInputs = Array.from(new Set(
    (Array.isArray(result.missingInputs) ? result.missingInputs : [])
      .map((item) => text(item, 200)).filter(Boolean)
  ));
  if (!parsed.primaryAction.url && parsed.primaryAction.label && !missingInputs.includes("primaryAction.url")) {
    missingInputs.push("primaryAction.url");
  }
  return {
    overview: parsed,
    missingInputs,
    uncertainInputs: (Array.isArray(result.uncertainInputs) ? result.uncertainInputs : [])
      .map((item) => ({ field: text(item?.field, 120), reason: text(item?.reason, 300) }))
      .filter((item) => item.field && item.reason),
    summary: text(result.summary, 600),
    confidence: Math.max(0, Math.min(1, Number(result.confidence) || 0)),
  };
}

function overviewFingerprint(value) {
  const normalized = normalizeOverview(value);
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}

module.exports = {
  PROMOTION_PURPOSES,
  AUDIENCES,
  CAMPAIGN_TONES,
  OVERVIEW_PARSE_SCHEMA,
  normalizeOverview,
  normalizeParsedOverview,
  overviewFingerprint,
};
