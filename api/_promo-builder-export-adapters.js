const { createHash } = require("node:crypto");

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function publicExportSnapshot(snapshot) {
  const source = object(snapshot);
  const content = object(source.content);
  const formTemplate = object(content.formTemplate);
  const assets = object(source.assets);
  return {
    contractVersion: Number(source.contractVersion || content.contractVersion || 2),
    layoutIdentity: clone(object(source.layoutIdentity)),
    appearance: clone(object(source.appearance)),
    content: {
      contractVersion: Number(content.contractVersion || source.contractVersion || 2),
      formTemplate: {
        id: formTemplate.id || "",
        templateKey: formTemplate.templateKey || "",
        version: Number(formTemplate.version || 1),
        designTokenSetVersionId: formTemplate.designTokenSetVersionId || "",
        designTokens: clone(object(formTemplate.designTokens)),
      },
      sectionSnapshot: clone(Array.isArray(content.sectionSnapshot) ? content.sectionSnapshot : []),
      sectionInputs: clone(object(content.sectionInputs)),
      sectionOrder: clone(Array.isArray(content.sectionOrder) ? content.sectionOrder : []),
      resourceReferences: clone(Array.isArray(content.resourceReferences) ? content.resourceReferences : []),
    },
    designSpec: clone(object(source.designSpec)),
    motionSpec: clone(object(source.motionSpec)),
    assets: {
      contractVersion: Number(assets.contractVersion || 1),
      items: clone(object(assets.items)),
    },
  };
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash("sha256").update(stableJson(value)).digest("hex");
}

function dependencyManifest(snapshot, { documentId = "", revision = 0 } = {}) {
  const exported = publicExportSnapshot(snapshot);
  const sections = exported.content.sectionSnapshot;
  const componentVersionIds = [...new Set(sections.flatMap((section) => (
    (Array.isArray(section.items) ? section.items : []).map((item) => item.componentVersionId).filter(Boolean)
  )))].sort();
  const assetItems = Object.values(exported.assets.items).map((item) => ({
    assetKey: item.assetKey || item.key || "",
    url: item.url || item.publicUrl || "",
    status: item.status || "ready",
    contentHash: item.contentHash || item.sha256 || "",
  })).sort((a, b) => a.assetKey.localeCompare(b.assetKey));
  const tokenValues = object(exported.content.formTemplate.designTokens?.values);
  return {
    manifestVersion: 1,
    documentId,
    revision: Number(revision || 0),
    contractVersion: exported.contractVersion,
    renderer: {
      key: exported.layoutIdentity.rendererKey || "default-promo-renderer",
      version: Number(exported.layoutIdentity.rendererVersion || 1),
    },
    designTokenSetVersionId: exported.appearance.designTokenSetVersionId
      || exported.content.formTemplate.designTokenSetVersionId || "",
    designTokenKeys: Object.keys(tokenValues).sort(),
    componentVersionIds,
    resources: exported.content.resourceReferences.map((reference) => ({
      resourceVersionId: reference.resourceVersionId || reference.versionId || "",
      resourceKey: reference.resourceKey || "",
      locale: reference.locale || "",
      contentHash: reference.contentHash || reference.sha256 || "",
    })),
    assets: assetItems,
    snapshotHash: sha256(exported),
  };
}

function safeJson(value) {
  return JSON.stringify(value)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function htmlExport(snapshot, options = {}) {
  const exported = publicExportSnapshot(snapshot);
  const manifest = dependencyManifest(exported, options);
  const title = String(options.title || "Promotion").replace(/[<>&\"]/g, "");
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="promo-export-hash" content="${manifest.snapshotHash}">
  <title>${title}</title>
  <link rel="stylesheet" href="/prototype/visual-editor-assets/promo-renderer.css">
  <link rel="stylesheet" href="/prototype/visual-editor-assets/export-runtime.css">
</head>
<body>
  <main id="promo-export-root"></main>
  <script id="promo-export-snapshot" type="application/json">${safeJson(exported)}</script>
  <script id="promo-export-manifest" type="application/json">${safeJson(manifest)}</script>
  <script type="module" src="/prototype/visual-editor-assets/export-runtime.js"></script>
</body>
</html>`;
}

function frameworkSource(snapshot, framework, options = {}) {
  const html = htmlExport(snapshot, options);
  const literal = JSON.stringify(html);
  if (framework === "vue") {
    return `<script setup>\nconst exportedHtml = ${literal};\n<\/script>\n\n<template>\n  <iframe title="Promotion" :srcdoc="exportedHtml" style="width:100%;min-height:100vh;border:0" />\n</template>\n`;
  }
  if (framework === "react") {
    return `export default function PromotionPage() {\n  const exportedHtml = ${literal};\n  return <iframe title="Promotion" srcDoc={exportedHtml} style={{ width: "100%", minHeight: "100vh", border: 0 }} />;\n}\n`;
  }
  throw new TypeError(`Unsupported framework: ${framework}`);
}

module.exports = {
  publicExportSnapshot,
  dependencyManifest,
  htmlExport,
  frameworkSource,
  safeJson,
};
