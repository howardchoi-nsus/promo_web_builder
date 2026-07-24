const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "..", "prototype", "wizard", "wizard-core.js"),
  "utf8",
);
const context = { globalThis: {} };
vm.runInNewContext(source, context);
const { resolveActiveTemplate } = context.globalThis.PromoWizardCore;

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

console.log("Wizard core module tests passed.");
