function formatTimestamp(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    String(date.getFullYear()).slice(-2),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
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
  appendRecordArraySection(lines, "Token Items", designData.tokenItems, tokenItemToMarkdownLine);
  appendRecordArraySection(lines, "Component Patterns", designData.componentPatterns, componentPatternToMarkdownLine);
  appendRecordArraySection(lines, "Layout Patterns", designData.layoutPatterns, layoutPatternToMarkdownLine);
  appendRecordArraySection(lines, "Guideline Items", designData.guidelineItems, guidelineItemToMarkdownLine);

  return lines.join("\n");
}

function buildPromoInputMarkdown({ runKey, promptGroupId, generatedAt, payload, promo, md, template }) {
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
    "# Section Input Log MD",
    "",
    "## Log Summary",
    "",
    `- Run Key: ${runKey}`,
    `- Prompt Group ID: ${promptGroupId}`,
    `- Generated At: ${generatedAt.toISOString()}`,
    `- Promo Title: ${promo?.title || ""}`,
    `- Selected Design MD: ${md?.brand || ""}`,
    `- Template: ${template?.name || template?.id || ""}`,
    "",
    "## Selected Design MD",
    "",
    "```json",
    JSON.stringify({
      id: md?.id || "",
      brand: md?.brand || "",
      slug: md?.slug || "",
      styleClassification: md?.styleClassification || null,
    }, null, 2),
    "```",
    "",
    "## Promo",
    "",
    "```json",
    JSON.stringify(promo || {}, null, 2),
    "```",
    "",
    "## Simple Brief",
    "",
    "```json",
    JSON.stringify(payload?.simpleBrief || {}, null, 2),
    "```",
    "",
    "## Section Inputs",
    "",
    "```json",
    JSON.stringify(payload?.sectionInputs || {}, null, 2),
    "```",
    "",
    "## Template",
    "",
    "```json",
    JSON.stringify(template || {}, null, 2),
    "```",
    "",
    "## Design Style",
    "",
    "```json",
    JSON.stringify(payload?.design || {}, null, 2),
    "```",
    "",
  ].join("\n");
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

function escapeYaml(value) {
  return JSON.stringify(String(value || ""));
}

function stringOrUnknown(value) {
  return value === null || value === undefined || value === "" ? "unknown" : String(value);
}

module.exports = {
  buildDesignPromptMarkdown,
  buildPromoInputMarkdown,
  formatTimestamp,
  tokenValueToText,
};
