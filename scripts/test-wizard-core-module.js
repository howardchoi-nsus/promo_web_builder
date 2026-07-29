const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "..", "prototype", "wizard", "wizard-core.js"),
  "utf8",
);
const context = {
  globalThis: {},
  fetch: async () => ({
    ok: false,
    status: 503,
    json: async () => ({
      error: "Section design asset generation failed",
      message: "Requested entity was not found.",
      code: "PROVIDER_ENTITY_NOT_FOUND",
      retryable: true,
      retryAfterMs: 15000,
      provider: { name: "google", model: "gemini-image" },
    }),
  }),
};
vm.runInNewContext(source, context);
const { fetchJson, resolveActiveTemplate } = context.globalThis.PromoWizardCore;

const defaultTemplate = {
  id: "default-v3",
  templateKey: "default",
  version: 3,
  isDefault: true,
};
const replacementVersion = {
  id: "campaign-v6",
  templateKey: "campaign",
  version: 6,
  isDefault: false,
};
const activeTemplates = [defaultTemplate, replacementVersion];

assert.equal(
  resolveActiveTemplate(activeTemplates, { id: "campaign-v6", templateKey: "campaign" }).id,
  "campaign-v6",
  "An exact active template ID must win.",
);
assert.equal(
  resolveActiveTemplate(activeTemplates, { id: "campaign-v5", templateKey: "campaign" }).id,
  "campaign-v6",
  "A replacement active version with the same templateKey must win before the default template.",
);
assert.equal(
  resolveActiveTemplate(activeTemplates, { id: "missing", templateKey: "missing" }).id,
  "default-v3",
  "The default template is the fallback when the logical template no longer exists.",
);
assert.equal(resolveActiveTemplate([], { id: "missing", templateKey: "missing" }), null);

(async () => {
  await assert.rejects(
    () => fetchJson("/api/promo-section-design-asset-process"),
    (error) => {
      assert.equal(error.message, "Requested entity was not found.");
      assert.equal(error.status, 503);
      assert.equal(error.code, "PROVIDER_ENTITY_NOT_FOUND");
      assert.equal(error.retryable, true);
      assert.equal(error.retryAfterMs, 15000);
      assert.equal(error.payload.provider.model, "gemini-image");
      return true;
    },
  );
  console.log("Wizard core module tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
