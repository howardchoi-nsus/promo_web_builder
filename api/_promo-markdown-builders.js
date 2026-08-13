function formatTimestamp(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date).reduce((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});
  const pad = (value) => String(value).padStart(2, "0");
  return [
    String(parts.year).slice(-2),
    pad(parts.month),
    pad(parts.day),
    pad(parts.hour),
    pad(parts.minute),
  ].join("");
}

function buildDesignPromptMarkdown({ runKey, promptGroupId, generatedAt, payload }) {
  const md = payload?.md || {};
  const designData = md.designData || {};
  const schema = designData.normalizedSchema || {};
  const lines = [
    "---",
    "type: design_prompt",
    `runKey: ${escapeYaml(runKey)}`,
    `promptGroupId: ${escapeYaml(promptGroupId)}`,
    `generatedAt: ${generatedAt.toISOString()}`,
    `timestampStamp: ${escapeYaml(formatTimestamp(generatedAt))}`,
    `promoTitle: ${escapeYaml(payload?.promo?.title || "")}`,
    `selectedMd: ${escapeYaml(md?.brand || "")}`,
    "---",
    "",
    "# Design Tokens",
    "",
    "This document is a deterministic snapshot of the selected Design MD token data.",
    "It is generated from stored design token records and does not include LLM-written image prompts or integrated brief content.",
    "",
    "## Selected Design MD",
    "",
    `- id: ${md.id || "unknown"}`,
    `- brand: ${md.brand || "unknown"}`,
    `- slug: ${md.slug || "unknown"}`,
    `- extractionStatus: ${designData.extractionStatus || "unknown"}`,
    `- sourceHash: ${designData.sourceHash || "unknown"}`,
    `- schemaVersion: ${schema.schemaVersion || "unknown"}`,
    "",
  ];

  appendClassificationSection(lines, schema.classification || md.styleClassification || {});
  appendTokenSection(lines, "Colors", schema.tokens?.color);
  appendTokenSection(lines, "Typography", schema.tokens?.typography);
  appendTokenSection(lines, "Radius", schema.tokens?.radius);
  appendTokenSection(lines, "Spacing", schema.tokens?.spacing);
  appendTokenSection(lines, "Elevation", schema.tokens?.elevation);
  appendTokenSection(lines, "Breakpoints", schema.tokens?.breakpoint);
  appendTokenSection(lines, "Components", schema.components);
  appendTokenSection(lines, "Layouts", schema.layouts);
  appendTokenSection(lines, "Guidelines", schema.guidelines);
  if (md.selectedTokens && Object.keys(md.selectedTokens).length) {
    lines.push("## Selected Raw Design Tokens", "");
    lines.push("```json");
    lines.push(JSON.stringify(md.selectedTokens, null, 2));
    lines.push("```");
    lines.push("");
  }
  appendRecordArraySection(lines, "Token Items", designData.tokenItems, tokenItemToMarkdownLine);
  appendRecordArraySection(lines, "Component Patterns", designData.componentPatterns, componentPatternToMarkdownLine);
  appendRecordArraySection(lines, "Layout Patterns", designData.layoutPatterns, layoutPatternToMarkdownLine);
  appendRecordArraySection(lines, "Guideline Items", designData.guidelineItems, guidelineItemToMarkdownLine);

  return lines.join("\n");
}

function buildPromoInputMarkdown({ runKey, promptGroupId, generatedAt, payload, promo, md, template }) {
  const pageComposition = buildPageComposition(payload, template);
  const visibleSections = pageComposition.filter((section) => section.visible);
  const excludedSections = pageComposition.filter((section) => !section.visible);
  const promotionInput = payload?.promotionInput || {};
  const simpleBrief = payload?.simpleBrief || {};
  const marketGuidance = payload?.marketVisualGuidance || {};
  const sectionInputs = payload?.sectionInputs || {};
  const sectionConfig = payload?.sectionConfig || {};
  return [
    "---",
    "type: section_input_log",
    `runKey: ${escapeYaml(runKey)}`,
    `promptGroupId: ${escapeYaml(promptGroupId)}`,
    `generatedAt: ${generatedAt.toISOString()}`,
    `timestampStamp: ${escapeYaml(formatTimestamp(generatedAt))}`,
    `promoTitle: ${escapeYaml(promo?.title || "")}`,
    `selectedMd: ${escapeYaml(md?.brand || "")}`,
    "---",
    "",
    "# Promotion Input Log MD",
    "",
    "## Log Summary",
    "",
    `- Run Key: ${runKey}`,
    `- Prompt Group ID: ${promptGroupId}`,
    `- Generated At: ${generatedAt.toISOString()}`,
    `- Promo Title: ${stringOrUnknown(promo?.title)}`,
    `- Selected Design MD: ${stringOrUnknown(md?.brand)}`,
    `- Template: ${stringOrUnknown(template?.name || template?.id)}`,
    `- Visible Sections: ${visibleSections.map((section) => section.sectionId).join(", ") || "none"}`,
    `- Excluded Sections: ${excludedSections.map((section) => section.sectionId).join(", ") || "none"}`,
    "",
    "## Promotion Strategy",
    "",
    `- Promotion Definition: ${stringOrUnknown(promo?.title)}`,
    `- Purpose: ${stringOrUnknown(resolvePurposeLabel(promotionInput, promo))}`,
    `- Target Customer: ${stringOrUnknown(promotionInput.targetCustomer || simpleBrief.audience)}`,
    `- Target Action: ${stringOrUnknown(simpleBrief.targetAction)}`,
    `- Primary Benefit: ${stringOrUnknown(simpleBrief.mainOffer || promo?.leadText)}`,
    `- Campaign Tone: ${stringOrUnknown(promotionInput.campaignTone || simpleBrief.campaignTone)}`,
    `- CTA Intent: ${stringOrUnknown(simpleBrief.targetAction || promo?.ctaLabel)}`,
    `- CTA Copy: ${stringOrUnknown(promo?.ctaLabel)}`,
    `- CTA URL: ${stringOrUnknown(promo?.ctaUrl)}`,
    `- Risk / Compliance Notes: ${stringOrUnknown(promo?.alphaText || promo?.termsText)}`,
    "",
    "## Market / Region Context",
    "",
    `- Selected Region: ${stringOrUnknown(marketGuidance.market || promo?.market)}`,
    `- Primary Use: ${stringOrUnknown(marketGuidance.primaryUse || "image_generation")}`,
    `- Text Copy Influence: ${stringOrUnknown(marketGuidance.textCopyInfluence || "low")}`,
    `- Visual Influence: ${stringOrUnknown(marketGuidance.visualInfluence)}`,
    `- User Disposition / Visual Mood: ${stringOrUnknown(marketGuidance.visualMood)}`,
    `- Design Implication: ${stringOrUnknown(marketGuidance.instruction)}`,
    `- Avoid: ${Array.isArray(marketGuidance.avoid) && marketGuidance.avoid.length ? marketGuidance.avoid.join("; ") : "unknown"}`,
    "## Promotion Content Contract",
    "",
    `- Title: ${stringOrUnknown(promo?.title)}`,
    `- Lead Text: ${stringOrUnknown(promo?.leadText)}`,
    `- Main Offer: ${stringOrUnknown(simpleBrief.mainOffer)}`,
    `- Subline / Secondary Message: ${stringOrUnknown(promo?.subline || simpleBrief.secondaryMessage)}`,
    `- CTA Label: ${stringOrUnknown(promo?.ctaLabel)}`,
    `- CTA Link: ${stringOrUnknown(promo?.ctaUrl)}`,
    `- Alpha / Compliance Text: ${stringOrUnknown(promo?.alphaText)}`,
    `- Terms / Legal Text: ${stringOrUnknown(promo?.termsText)}`,
    "## Page Composition",
    "",
    "```json",
    stringifyLogJson(pageComposition),
    "```",
    "",
    "## Section Content Mapping",
    "",
    ...visibleSections.flatMap((section) => sectionToMarkdown(section, sectionInputs)),
    ...(excludedSections.length ? [
      "## Excluded Sections",
      "",
      ...excludedSections.flatMap((section) => [
        `### ${section.order}. ${section.displayName}`,
        "",
        `- sectionId: ${section.sectionId}`,
        `- role: ${section.role}`,
        "- visible: false",
        "",
      ]),
    ] : []),
    "## Section Visibility / Generation Controls",
    "",
    "```json",
    stringifyLogJson({
      orderedSections: pageComposition.map((section) => section.sectionId),
      visibleSections: visibleSections.map((section) => section.sectionId),
      hiddenSections: excludedSections.map((section) => section.sectionId),
      sectionVisibility: template?.sectionVisibility || {},
      itemVisibility: template?.itemVisibility || {},
      imageGenerationMode: sectionConfig.imageGenerationMode || {},
      imageGenerationTargets: sectionConfig.imageGenerationTargets || template?.imageGenerationTargets || [],
      fixedSections: sectionConfig.fixedSections || template?.fixedSections || {},
      repeatableSets: sectionConfig.repeatableSets || {},
    }),
    "```",
    "",
    "## Design Source Summary",
    "",
    "```json",
    stringifyLogJson({
      id: md?.id || "",
      brand: md?.brand || "",
      slug: md?.slug || "",
      styleClassification: md?.styleClassification || null,
    }),
    "```",
    "",
    "## Raw Payload Snapshot",
    "",
    "### Promo",
    "",
    "```json",
    stringifyLogJson(promo || {}),
    "```",
    "",
    "### Promotion Input",
    "",
    "```json",
    stringifyLogJson(promotionInput || {}),
    "```",
    "",
    "### Market Visual Guidance",
    "",
    "```json",
    stringifyLogJson(marketGuidance || {}),
    "```",
    "",
    "### Simple Brief",
    "",
    "```json",
    stringifyLogJson(simpleBrief || {}),
    "```",
    "",
    "### Section Inputs",
    "",
    "```json",
    stringifyLogJson(sectionInputs || {}),
    "```",
    "",
    "### Section Config",
    "",
    "```json",
    stringifyLogJson(sectionConfig || {}),
    "```",
    "",
    "### Template",
    "",
    "```json",
    stringifyLogJson(template || {}),
    "```",
    "",
    "### Design Style",
    "",
    "```json",
    stringifyLogJson(payload?.design || {}),
    "```",
    "",
  ].join("\n");
}

function buildPageComposition(payload, template) {
  const configSections = Array.isArray(payload?.sectionConfig?.sections) ? payload.sectionConfig.sections : [];
  const configuredOrder = Array.isArray(payload?.sectionConfig?.orderedSections) ? payload.sectionConfig.orderedSections : [];
  const sectionOrder = configuredOrder.length
    ? configuredOrder
    : (Array.isArray(template?.sectionOrder) ? template.sectionOrder : []);
  const visibleSections = Array.isArray(template?.visibleSections) ? template.visibleSections : [];
  const sectionVisibility = payload?.sectionConfig?.sectionVisibility || template?.sectionVisibility || {};
  const fixedSections = normalizeFixedSections(payload?.sectionConfig?.fixedSections || template?.fixedSections);
  const byConfiguredId = new Map(configSections.map((section) => [section.sectionId || section.key || section.id, section]));
  const sourceSections = sectionOrder.length
    ? sectionOrder.map((sectionId) => byConfiguredId.get(sectionId) || { sectionId, name: canonicalSectionName(sectionId) })
    : configSections;

  return sourceSections.map((section, index) => {
    const sectionId = section.sectionId || section.key || section.id || `customSection${index + 1}`;
    const visible = Object.prototype.hasOwnProperty.call(sectionVisibility, sectionId)
      ? Boolean(sectionVisibility[sectionId])
      : (Array.isArray(visibleSections) && visibleSections.length ? visibleSections.includes(sectionId) : section.visible !== false);
    return {
      order: index + 1,
      sectionId,
      displayName: normalizeLogString(section.name || section.label || canonicalSectionName(sectionId)),
      role: section.role || sectionRole(sectionId),
      visible,
      fixedPosition: fixedSections[sectionId] || section.fixedPosition || null,
      contentPath: `sectionInputs.${sectionId}`,
      source: configSections.length
        ? "sectionConfig.sections"
        : (configuredOrder.length ? "sectionConfig.orderedSections" : "template.fallback"),
      repeatable: Boolean(section.repeatableSet),
    };
  });
}

function normalizeFixedSections(value) {
  if (!value) return {};
  if (!Array.isArray(value)) return value && typeof value === "object" ? value : {};
  return Object.fromEntries(value.map((section) => [section.sectionId, section.fixedPosition]).filter(([sectionId]) => sectionId));
}

function canonicalSectionName(sectionId) {
  const names = {
    header: "Header",
    heroBanner: "Hero Banner",
    stepBar: "Step Bar",
    contentCta: "Content CTA",
    imageTextRow: "Image Text Row",
    titleDescription: "Title and Description",
    footer: "Footer",
  };
  return names[sectionId] || sectionId;
}

function sectionRole(sectionId) {
  const roles = {
    header: "navigation_or_brand_context",
    heroBanner: "primary_offer",
    stepBar: "participation_steps",
    contentCta: "conversion_support",
    imageTextRow: "supporting_content",
    titleDescription: "terms_or_detail_content",
    footer: "legal_and_brand_footer",
  };
  return roles[sectionId] || "custom_content";
}

function resolvePurposeLabel(promotionInput, promo) {
  const purpose = promotionInput.purpose || promo?.promotionPurpose || promo?.purpose || "";
  if (purpose === "기타" && (promotionInput.purposeOther || promo?.promotionPurposeOther)) {
    return promotionInput.purposeOther || promo.promotionPurposeOther;
  }
  return purpose;
}

function sectionToMarkdown(section, sectionInputs) {
  const value = sectionInputs?.[section.sectionId];
  const entries = Array.isArray(value) ? value : [value || {}];
  return entries.flatMap((entry, index) => [
    `### ${section.order}${entries.length > 1 ? `.${index + 1}` : ""}. ${normalizeLogString(section.displayName)}`,
    "",
    `- sectionId: ${section.sectionId}`,
    `- role: ${section.role}`,
    `- visible: ${section.visible ? "true" : "false"}`,
    `- fixedPosition: ${section.fixedPosition || "none"}`,
    `- contentPath: ${section.contentPath}${entries.length > 1 ? `.${index}` : ""}`,
    `- repeatable: ${section.repeatable ? "true" : "false"}`,
    "- Content:",
    "```json",
    stringifyLogJson(entry || {}),
    "```",
    "",
  ]);
}

function canonicalTemplateSections(payload) {
  const canonical = [
    { sectionId: "header", name: "Header" },
    { sectionId: "heroBanner", name: "Hero Banner" },
    { sectionId: "stepBar", name: "Step Bar" },
    { sectionId: "contentCta", name: "Content CTA" },
    { sectionId: "imageTextRow", name: "Image Text Row" },
    { sectionId: "titleDescription", name: "Title and Description" },
    { sectionId: "footer", name: "Footer" },
  ];
  const configSections = Array.isArray(payload?.sectionConfig?.sections) ? payload.sectionConfig.sections : [];
  const visibility = payload?.template?.sectionVisibility || {};

  return canonical.map((section) => {
    const configured = configSections.find((item) => item.sectionId === section.sectionId || item.key === section.sectionId) || {};
    const visible = Object.prototype.hasOwnProperty.call(visibility, section.sectionId)
      ? Boolean(visibility[section.sectionId])
      : configured.visible !== false;
    return {
      ...section,
      configuredName: configured.name || configured.label || "",
      visible,
    };
  });
}

function appendClassificationSection(lines, classification) {
  const primary = classification?.primaryGroup || {};
  lines.push("## Classification", "");
  lines.push(`- primaryGroup: ${stringOrUnknown(primary.name || primary.slug || classification.primaryGroup)}`);
  lines.push(`- colorMode: ${stringOrUnknown(classification.colorMode)}`);
  lines.push(`- typographyTone: ${stringOrUnknown(classification.typographyTone)}`);
  lines.push(`- shapeModel: ${stringOrUnknown(classification.shapeModel)}`);
  lines.push(`- depthModel: ${stringOrUnknown(classification.depthModel)}`);
  lines.push(`- styleTags: ${Array.isArray(classification.styleTags) && classification.styleTags.length ? classification.styleTags.join(", ") : "unknown"}`);
  lines.push("");
}

function appendTokenSection(lines, title, group) {
  lines.push(`## ${title}`, "");
  const entries = Object.entries(group || {});
  if (!entries.length) {
    lines.push("- unknown");
    lines.push("");
    return;
  }
  for (const [key, value] of entries) {
    lines.push(`- ${key}: ${tokenValueToText(value)}`);
  }
  lines.push("");
}

function appendRecordArraySection(lines, title, records, formatter) {
  lines.push(`## ${title}`, "");
  if (!Array.isArray(records) || !records.length) {
    lines.push("- unknown");
    lines.push("");
    return;
  }
  records.forEach((record, index) => {
    lines.push(formatter(record, index));
  });
  lines.push("");
}

function tokenItemToMarkdownLine(item, index) {
  const name = item.tokenPath || item.tokenName || item.tokenType || `token-${index + 1}`;
  const value = item.tokenValue ?? item.value ?? item.description ?? item.sourceExcerpt ?? "unknown";
  const meta = [
    item.tokenType ? `type=${item.tokenType}` : "",
    item.aliasOf ? `aliasOf=${item.aliasOf}` : "",
    item.referencePath ? `reference=${item.referencePath}` : "",
    item.confidence != null ? `confidence=${item.confidence}` : "",
  ].filter(Boolean);
  return `- ${name}: ${tokenValueToText(value)}${meta.length ? ` (${meta.join(", ")})` : ""}`;
}

function componentPatternToMarkdownLine(item, index) {
  const name = item.componentType || item.patternKey || `component-${index + 1}`;
  return `- ${name}: ${tokenValueToText(item.valueJson || item.sourceExcerpt || "unknown")}`;
}

function layoutPatternToMarkdownLine(item, index) {
  const name = item.layoutType || item.patternKey || `layout-${index + 1}`;
  return `- ${name}: ${tokenValueToText(item.valueJson || item.sourceExcerpt || "unknown")}`;
}

function guidelineItemToMarkdownLine(item, index) {
  const name = item.guidelineType || item.key || item.appliesTo || `guideline-${index + 1}`;
  return `- ${name}: ${tokenValueToText(item.value || item.sourceExcerpt || "unknown")}`;
}

function tokenValueToText(value) {
  if (value === null || value === undefined || value === "") return "unknown";
  if (Array.isArray(value)) {
    if (!value.length) return "unknown";
    return value.map(tokenValueToText).join(" | ");
  }
  if (typeof value !== "object") return String(value);
  if (value.hex) return String(value.hex);
  if (value.$value?.hex) return String(value.$value.hex);
  const direct = value.$value ?? value.value ?? value.summary ?? value.description ?? value.role ?? value.pattern ?? value.guideline;
  const description = value.$description ?? value.description;
  const type = value.$type ?? value.type;
  const source = value.source;
  const confidence = value.confidence;
  const parts = [
    direct !== undefined ? tokenValueToText(direct) : "",
    description && description !== direct ? `description=${tokenValueToText(description)}` : "",
    type ? `type=${tokenValueToText(type)}` : "",
    source ? `source=${tokenValueToText(source)}` : "",
    confidence !== undefined && confidence !== null ? `confidence=${confidence}` : "",
  ].filter(Boolean);
  if (parts.length) return parts.join(" | ");

  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== null && entryValue !== undefined && entryValue !== "");
  if (!entries.length) return "unknown";
  return ["{", entries.map(([key, entryValue]) => `${key}: ${tokenValueToText(entryValue)}`).join("; "), "}"].join("");
}

const LOG_VALUE_TRANSLATIONS = new Map([
  ["할인쿠폰", "Discount coupon"],
  ["웰컴", "Welcome"],
  ["이벤트", "Event"],
  ["기타", "Other"],
  ["신규", "New players"],
  ["기존고객", "Existing customers"],
  ["윈백고객", "Win-back customers"],
  ["활기찬", "Energetic"],
  ["신중한", "Considered"],
  ["럭키", "Lucky"],
  ["프리미엄", "Premium"],
  ["긴급한", "Urgent"],
  ["친근한", "Friendly"],
  ["프로모션 목적", "Promotion purpose"],
  ["대상고객", "Target customer"],
  ["캠페인톤", "Campaign tone"],
  ["기타 목적", "Other purpose"],
  ["AI 자동 생성", "AI auto generation"],
  ["템플릿 선택", "Template selection"],
  ["디자인 생성되고 있습니다.", "Generating design."],
  ["Step Set 추가", "Add Step Set"],
  ["?좎씤荑좏룿", "Discount coupon"],
  ["?대깽??", "Event"],
  ["湲고?", "Other"],
  ["?좉퇋", "New players"],
  ["湲곗〈怨좉컼", "Existing customers"],
  ["?덈갚怨좉컼", "Win-back customers"],
  ["?쒓린李?", "Energetic"],
  ["?좎쨷??", "Considered"],
  ["??궎", "Lucky"],
  ["?꾨━誘몄뾼", "Premium"],
  ["湲닿툒??", "Urgent"],
  ["移쒓렐??", "Friendly"],
]);

function normalizeLogString(value) {
  const text = String(value || "");
  return LOG_VALUE_TRANSLATIONS.get(text) || text;
}

function normalizeLogValue(value) {
  if (Array.isArray(value)) return value.map((entry) => normalizeLogValue(entry));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entryValue]) => [key, normalizeLogValue(entryValue)]));
  }
  if (typeof value === "string") return normalizeLogString(value);
  return value;
}

function stringifyLogJson(value) {
  return JSON.stringify(normalizeLogValue(value), null, 2);
}

function escapeYaml(value) {
  return JSON.stringify(normalizeLogString(value));
}

function stringOrUnknown(value) {
  if (value === null || value === undefined || value === "") return "unknown";
  return normalizeLogString(value);
}

module.exports = {
  buildDesignPromptMarkdown,
  buildPromoInputMarkdown,
  canonicalTemplateSections,
  formatTimestamp,
  tokenValueToText,
};
