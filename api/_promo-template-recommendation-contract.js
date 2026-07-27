const { normalizeOverview, overviewFingerprint } = require("./_promo-overview-contract");
const { normalizeRecommendationProfile } = require("./_wizard-form-templates-store");

function normalizedText(value) {
  return String(value || "").trim().toLocaleLowerCase();
}

function includesValue(values, value) {
  const target = normalizedText(value);
  if (!values.length) return null;
  return values.some((item) => {
    const candidate = normalizedText(item);
    return candidate === "*" || candidate === "all" || candidate === target;
  });
}

function overviewValueAtPath(overview, path) {
  return String(path || "").split(".").reduce((value, key) => value?.[key], overview);
}

function scoreTemplateRecommendation(template, overviewValue) {
  const overview = normalizeOverview(overviewValue);
  const profile = normalizeRecommendationProfile(template.recommendationProfile);
  const reasons = [];
  const warnings = [];
  const requiredConfirmations = [];
  let score = 40;

  const marketMatch = includesValue(profile.markets, overview.market);
  if (marketMatch === false) return null;
  if (marketMatch) {
    score += 15;
    reasons.push(`마켓 ${overview.market}에 적합`);
  }

  [
    ["promotionTypes", overview.promotionPurpose, 15, "프로모션 목적"],
    ["audiences", overview.audience, 12, "대상 고객"],
    ["tones", overview.campaignTone, 10, "캠페인 톤"],
  ].forEach(([key, value, points, label]) => {
    const matched = includesValue(profile[key], value);
    if (matched) {
      score += points;
      reasons.push(`${label} 적합`);
    } else if (matched === false) {
      score -= Math.ceil(points / 2);
    }
  });

  const searchable = normalizedText([
    overview.title, overview.mainOffer, overview.promotionPurposeOther,
    template.name, template.description,
  ].join(" "));
  const matchingTags = profile.tags.filter((tag) => searchable.includes(normalizedText(tag)));
  if (matchingTags.length) {
    score += Math.min(12, matchingTags.length * 3);
    reasons.push(`관련 태그: ${matchingTags.slice(0, 3).join(", ")}`);
  }

  profile.requiredInputs.forEach((path) => {
    if (!String(overviewValueAtPath(overview, path) || "").trim()) {
      requiredConfirmations.push(path);
    }
  });
  if (requiredConfirmations.length) {
    score -= Math.min(15, requiredConfirmations.length * 3);
    warnings.push(`추가 확인 필요: ${requiredConfirmations.join(", ")}`);
  }
  if (profile.requiredNotices.length) {
    warnings.push(`필수 고지 확인: ${profile.requiredNotices.join(", ")}`);
  }
  if (template.isDefault) {
    score += 3;
    reasons.push("기본 템플릿");
  }
  if (!reasons.length) reasons.push("일반 프로모션 구성에 사용 가능");

  return {
    templateId: template.id,
    templateKey: template.templateKey,
    templateVersion: template.version,
    templateName: template.name,
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons,
    warnings,
    requiredConfirmations,
  };
}

function rankTemplateRecommendations(templates, overview, limit = 3) {
  return templates
    .filter((template) => template.status === "active")
    .map((template) => scoreTemplateRecommendation(template, overview))
    .filter(Boolean)
    .sort((left, right) => right.score - left.score
      || left.templateName.localeCompare(right.templateName))
    .slice(0, Math.max(1, Math.min(10, Number(limit) || 3)));
}

function recommendationFingerprint(overview) {
  return overviewFingerprint(overview);
}

module.exports = {
  scoreTemplateRecommendation,
  rankTemplateRecommendations,
  recommendationFingerprint,
};
