const assert = require("node:assert/strict");
const {
  publicExportSnapshot,
  dependencyManifest,
  htmlExport,
  frameworkSource,
} = require("../api/_promo-builder-export-adapters");
const { builderFlags } = require("../api/_promo-builder-flags");
const { percent, rolloutBucket } = require("../api/_promo-builder-rollout");

const snapshot = {
  contractVersion: 3,
  documentRevision: 7,
  layoutIdentity: { rendererKey: "default-promo-renderer", rendererVersion: 1 },
  appearance: { designTokenSetVersionId: "tokens-v4" },
  compositionMeta: { model: "must-not-export", prompt: "secret" },
  provenance: { internal: true },
  validation: { warnings: ["internal"] },
  content: {
    contractVersion: 3,
    formTemplate: {
      id: "fallback-template",
      templateKey: "shell:default",
      version: 2,
      designTokenSetVersionId: "tokens-v4",
      designTokens: { values: { "--promo-accent": "#123456" } },
      adminOnly: true,
    },
    sectionOrder: ["hero"],
    sectionInputs: { hero: { title: "</script><img src=x onerror=alert(1)>" } },
    sectionSnapshot: [{
      sectionKey: "hero",
      items: [{ itemKey: "title", componentVersionId: "component-title-v2" }],
    }],
    resourceReferences: [{ resourceKey: "terms", resourceVersionId: "resource-v3", contentHash: "abc" }],
  },
  designSpec: { theme: { accentColor: "#123456" } },
  motionSpec: { sections: {}, items: {} },
  assets: {
    contractVersion: 1,
    items: { hero: { assetKey: "hero", url: "https://cdn.example/hero.png", status: "ready" } },
    requests: [{ prompt: "must-not-export" }],
  },
};

const exported = publicExportSnapshot(snapshot);
assert.equal(exported.contractVersion, 3);
assert.equal(exported.content.sectionInputs.hero.title.includes("</script>"), true);
assert.equal(Object.hasOwn(exported, "compositionMeta"), false);
assert.equal(Object.hasOwn(exported, "provenance"), false);
assert.equal(Object.hasOwn(exported, "validation"), false);
assert.equal(Object.hasOwn(exported.assets, "requests"), false);
assert.equal(Object.hasOwn(exported.content.formTemplate, "adminOnly"), false);

const manifest = dependencyManifest(snapshot, { documentId: "doc-1", revision: 7 });
assert.equal(manifest.contractVersion, 3);
assert.deepEqual(manifest.componentVersionIds, ["component-title-v2"]);
assert.deepEqual(manifest.designTokenKeys, ["--promo-accent"]);
assert.equal(manifest.resources[0].resourceVersionId, "resource-v3");
assert.match(manifest.snapshotHash, /^[a-f0-9]{64}$/);

const html = htmlExport(snapshot, { documentId: "doc-1", revision: 7 });
assert.match(html, /promo-export-root/);
assert.match(html, /export-runtime\.js/);
assert.doesNotMatch(html, /must-not-export/);
assert.doesNotMatch(html, /<\/script><img/);
assert.match(html, /\\u003c\/script\\u003e/);
assert.match(frameworkSource(snapshot, "vue"), /<iframe/);
assert.match(frameworkSource(snapshot, "react"), /srcDoc/);

assert.equal(builderFlags({ PROMO_BUILDER_EXPORT_ENABLED: "false" }).export, false);
assert.equal(percent("45"), 45);
assert.equal(percent("200"), 100);
assert.equal(rolloutBucket("owner-1"), rolloutBucket("owner-1"));

console.log("Promo Builder export adapter tests passed.");
