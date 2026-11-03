const REQUIRED_TOP_LEVEL = Object.freeze([
  "designIntent",
  "layoutSummary",
  "mdComplianceMap",
  "html",
  "css",
  "qualityChecks",
]);

const REQUIRED_COMPLIANCE_FIELDS = Object.freeze([
  "layoutPhilosophy",
  "visualMood",
  "spacingRhythm",
  "componentStyle",
  "depthAndEffects",
  "shapeAndRadius",
  "promoPageImplications",
  "dosApplied",
  "dontsAvoided",
  "notColorFontOnlyProof",
]);

const REQUIRED_QUALITY_CHECKS = Object.freeze([
  "CONTENT_FIDELITY",
  "RESPONSIVE_1440",
  "RESPONSIVE_390",
  "ACCESSIBILITY",
  "CONTRAST",
  "OVERFLOW",
  "LEGAL_VISIBILITY",
  "TOKEN_DISCIPLINE",
  "TEXT_FIRST_MVP",
  "DUPLICATE_COPY",
]);

function fail(code, message, details = {}) {
  throw Object.assign(new Error(message), { statusCode: 422, code, details });
}

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)));
}

function normalizedText(value) {
  return decodeHtml(value)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function countMatches(value, pattern) {
  return Array.from(String(value || "").matchAll(pattern)).length;
}

function validateRequiredCopy(html, requiredVisibleCopy) {
  const visible = normalizedText(html);
  const compactVisible = visible.replace(/\s+/g, "");
  const required = Array.from(new Set((Array.isArray(requiredVisibleCopy) ? requiredVisibleCopy : [])
    .map(normalizedText)
    .filter(Boolean)));
  if (required.length > 32) fail("PAGE_REQUIRED_COPY_INVALID", "requiredVisibleCopy cannot contain more than 32 values");
  const missing = required.filter((copy) => (
    !visible.includes(copy) && !compactVisible.includes(copy.replace(/\s+/g, ""))
  ));
  if (missing.length) {
    fail("PAGE_REQUIRED_COPY_MISSING", "Generated HTML is missing required promotion copy", {
      missingCount: missing.length,
    });
  }
}

function assertSafeTextFirstHtml(html) {
  const forbidden = [
    [/<\/?(?:html|head|body)\b/i, "document wrapper"],
    [/<\s*(?:script|iframe|img|picture|video|audio|svg|canvas|object|embed|link|base|meta|form)\b/i, "media, script, form, or external document element"],
    [/\son[a-z0-9_-]+\s*=/i, "inline event handler"],
    [/\sstyle\s*=/i, "inline style attribute"],
    [/\ssrc\s*=/i, "source attribute"],
    [/javascript\s*:/i, "javascript URL"],
    [/data\s*:/i, "data URL"],
    [/<\s*style\b/i, "inline style block"],
  ];
  for (const [pattern, label] of forbidden) {
    if (pattern.test(html)) fail("PAGE_UNSAFE_HTML", `Generated HTML contains a forbidden ${label}`);
  }
  if (!/<main\b[^>]*class\s*=\s*(["'])[^"']*\bpromo-generated-page\b[^"']*\1[^>]*>/i.test(html)) {
    fail("PAGE_ROOT_INVALID", "HTML must be rooted at <main class=\"promo-generated-page\">");
  }
  if (countMatches(html, /<h1\b/gi) !== 1) fail("PAGE_HEADING_INVALID", "Generated HTML must contain exactly one h1");
  if (!/<a\b[^>]*href\s*=/i.test(html)) fail("PAGE_CTA_MISSING", "Generated HTML must contain a linked primary CTA");
}

function validateLinks(html, context) {
  const ctaUrl = String(context.ctaUrl || "").trim();
  const allowedUrls = new Set((Array.isArray(context.allowedUrls) ? context.allowedUrls : [])
    .map((value) => decodeHtml(value).trim())
    .filter(Boolean));
  if (ctaUrl) allowedUrls.add(decodeHtml(ctaUrl).trim());
  const unsafeConfiguredUrl = Array.from(allowedUrls).find((value) => (
    !/^https?:\/\//i.test(value) && !/^\/(?!\/)/.test(value) && !/^#[a-z0-9_-]+$/i.test(value)
  ));
  if (unsafeConfiguredUrl) fail("PAGE_ALLOWED_URL_INVALID", "Promotion URLs must use http(s), a root-relative path, or a fragment");
  const anchorTags = Array.from(String(html || "").matchAll(/<a\b[^>]*>/gi), (match) => match[0]);
  const links = anchorTags.map((tag) => {
    const hrefAssignments = Array.from(tag.matchAll(/\bhref\s*=/gi));
    const quotedHrefs = Array.from(tag.matchAll(/\bhref\s*=\s*(["'])(.*?)\1/gi));
    if (hrefAssignments.length !== 1 || quotedHrefs.length !== 1) {
      fail("PAGE_LINK_ATTRIBUTE_INVALID", "Every generated link must contain exactly one quoted href attribute");
    }
    return decodeHtml(quotedHrefs[0][2]).trim();
  });
  const unapproved = links.filter((value) => !value.startsWith("#") && !allowedUrls.has(value));
  if (unapproved.length) fail("PAGE_UNAPPROVED_LINK", "Generated HTML contains a URL not supplied by promotion content");
  if (ctaUrl && !links.includes(decodeHtml(ctaUrl).trim())) {
    fail("PAGE_CTA_URL_MISSING", "Generated HTML does not preserve the supplied CTA URL");
  }
}

function assertSafeResponsiveCss(css) {
  const forbidden = [
    [/@import\b/i, "@import"],
    [/url\s*\(/i, "url()"],
    [/background-image\s*:/i, "background-image"],
    [/<\/?style\b/i, "style-tag escape"],
    [/expression\s*\(/i, "CSS expression"],
    [/(?:behavior|-moz-binding)\s*:/i, "executable CSS binding"],
    [/javascript\s*:|data\s*:/i, "embedded URL"],
    [/position\s*:\s*fixed\b/i, "fixed positioning"],
  ];
  for (const [pattern, label] of forbidden) {
    if (pattern.test(css)) fail("PAGE_UNSAFE_CSS", `Generated CSS contains forbidden ${label}`);
  }
  if (!/\.promo-generated-page\b/.test(css)) fail("PAGE_CSS_SCOPE_MISSING", "CSS must be scoped under .promo-generated-page");
  const mobileBreakpoints = Array.from(css.matchAll(/@media[^\{]*max-width\s*:\s*(\d+)px/gi))
    .map((match) => Number(match[1]));
  if (!mobileBreakpoints.some((width) => width >= 320 && width <= 480)) {
    fail("PAGE_MOBILE_CSS_MISSING", "CSS must include a deliberate 320–480px mobile breakpoint");
  }
  if (!/:focus-visible\b/i.test(css)) fail("PAGE_FOCUS_STYLE_MISSING", "CSS must include a visible :focus-visible state");
  if (!/prefers-reduced-motion\s*:\s*reduce/i.test(css)) {
    fail("PAGE_REDUCED_MOTION_MISSING", "CSS must respect prefers-reduced-motion: reduce");
  }
}

function validateQualityChecks(value) {
  if (!Array.isArray(value) || !value.length || value.some((item) => typeof item !== "string" || !item.trim())) {
    fail("PAGE_QUALITY_CHECKS_INVALID", "qualityChecks must be a non-empty string array");
  }
  const missing = REQUIRED_QUALITY_CHECKS.filter((check) => !value.some((item) => String(item).includes(check)));
  if (missing.length) fail("PAGE_QUALITY_CHECKS_MISSING", `qualityChecks are missing: ${missing.join(", ")}`);
  const failed = REQUIRED_QUALITY_CHECKS.filter((check) => {
    const item = value.find((candidate) => String(candidate).includes(check));
    const text = String(item || "");
    if (/(?:\bfail(?:ed)?\b|실패|미통과|위반|누락)/i.test(text)) return true;
    return !/(?:\bpass(?:ed)?\b|\bok\b|\bverified\b|\bclear\b|\bnone\b|\bno\b|통과|확인|준수|없음|이상 없음)/i.test(text);
  });
  if (failed.length) fail("PAGE_QUALITY_CHECKS_FAILED", `qualityChecks did not pass: ${failed.join(", ")}`);
}

function resolveDocumentLanguage({ locale, market, visibleCopy = [] } = {}) {
  const localeLanguage = String(locale || "").trim().toLowerCase().match(/^[a-z]{2,3}(?=[-_]|$)/)?.[0];
  if (localeLanguage) return localeLanguage;
  const marketLanguage = {
    kr: "ko", korea: "ko", ko: "ko",
    jp: "ja", japan: "ja", ja: "ja",
    cn: "zh", china: "zh", zh: "zh",
    tw: "zh",
    us: "en", uk: "en", gb: "en", en: "en",
  }[String(market || "").trim().toLowerCase()];
  if (marketLanguage) return marketLanguage;
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test((Array.isArray(visibleCopy) ? visibleCopy : []).join(" ")) ? "ko" : "en";
}

function validatePromoPageGenerationResult(generated, context = {}) {
  const result = plainObject(generated);
  if (!result) fail("PAGE_RESULT_INVALID", "Generated page result must be a JSON object");
  const keys = Object.keys(result).sort();
  const expectedKeys = [...REQUIRED_TOP_LEVEL].sort();
  if (JSON.stringify(keys) !== JSON.stringify(expectedKeys)) {
    fail("PAGE_RESULT_SHAPE_INVALID", `Generated page must contain exactly: ${REQUIRED_TOP_LEVEL.join(", ")}`);
  }
  for (const key of ["designIntent", "layoutSummary", "html", "css"]) {
    if (typeof result[key] !== "string" || !result[key].trim()) fail("PAGE_RESULT_FIELD_INVALID", `${key} must be a non-empty string`);
  }
  if (result.html.length > 500_000 || result.css.length > 300_000) {
    fail("PAGE_RESULT_TOO_LARGE", "Generated HTML or CSS exceeds the allowed size");
  }

  const compliance = plainObject(result.mdComplianceMap);
  if (!compliance) fail("PAGE_COMPLIANCE_INVALID", "mdComplianceMap must be an object");
  const missingCompliance = REQUIRED_COMPLIANCE_FIELDS.filter((key) => {
    const value = compliance[key];
    return Array.isArray(value) ? !value.length || value.some((item) => !String(item || "").trim()) : !String(value || "").trim();
  });
  if (missingCompliance.length) {
    fail("PAGE_COMPLIANCE_MISSING", `mdComplianceMap is missing: ${missingCompliance.join(", ")}`);
  }
  if (!Array.isArray(compliance.dosApplied) || !Array.isArray(compliance.dontsAvoided)) {
    fail("PAGE_COMPLIANCE_LIST_INVALID", "dosApplied and dontsAvoided must be arrays");
  }
  if (String(compliance.notColorFontOnlyProof).trim().length < 40) {
    fail("PAGE_COMPLIANCE_PROOF_WEAK", "notColorFontOnlyProof must contain concrete layout evidence");
  }

  validateQualityChecks(result.qualityChecks);
  assertSafeTextFirstHtml(result.html);
  assertSafeResponsiveCss(result.css);
  validateRequiredCopy(result.html, context.requiredVisibleCopy);
  validateLinks(result.html, context);

  return {
    result: {
      designIntent: result.designIntent.trim(),
      layoutSummary: result.layoutSummary.trim(),
      mdComplianceMap: compliance,
      html: result.html.trim(),
      css: result.css.trim(),
      qualityChecks: result.qualityChecks.map((item) => item.trim()),
    },
    documentLanguage: resolveDocumentLanguage({
      locale: context.locale,
      market: context.market,
      visibleCopy: context.requiredVisibleCopy,
    }),
  };
}

module.exports = {
  REQUIRED_COMPLIANCE_FIELDS,
  REQUIRED_QUALITY_CHECKS,
  REQUIRED_TOP_LEVEL,
  resolveDocumentLanguage,
  validatePromoPageGenerationResult,
};
