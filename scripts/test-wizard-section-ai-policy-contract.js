const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { normalizeAiDesign } = require("../api/_wizard-content-sections-store");

assert.deepEqual(normalizeAiDesign(), {
  enabled: true,
  allowedLayoutVariants: ["split-left", "split-right", "centered-hero"],
  allowSectionBackground: true,
  imageTarget: "section-background",
  imageTargetItemKeys: [],
  imageAspectRatio: "16:9",
  backgroundPromptText: "",
});
assert.deepEqual(normalizeAiDesign({
  enabled: false,
  allowedLayoutVariants: ["split-left", "standard-header", "bad key", "split-left"],
  imageTarget: "item",
  imageTargetItemKeys: ["heroImage", "", "heroImage"],
  imageAspectRatio: "4:3",
}), {
  enabled: false,
  allowedLayoutVariants: ["split-left", "standard-header"],
  allowSectionBackground: true,
  imageTarget: "item",
  imageTargetItemKeys: ["heroImage"],
  imageAspectRatio: "4:3",
  backgroundPromptText: "",
});

const root = path.resolve(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "db/migrations/026_wizard_section_ai_design_policy.sql"), "utf8");
const adminHtml = fs.readFileSync(path.join(root, "prototype/index.html"), "utf8");
const adminApp = fs.readFileSync(path.join(root, "prototype/app.js"), "utf8");
const runs = fs.readFileSync(path.join(root, "api/promo-section-design-runs.js"), "utf8");
const templateSectionsApi = fs.readFileSync(path.join(root, "api/wizard-form-template-sections.js"), "utf8");
const publicTemplateApi = fs.readFileSync(path.join(root, "api/wizard-form-template-public.js"), "utf8");
assert.match(migration, /add column if not exists ai_design jsonb/i);
assert.match(migration, /v_source\.ai_design/);
assert.match(adminHtml, /wizardSectionFieldsEditor\.aiDesign\.enabled/);
assert.match(adminHtml, /Section Items[\s\S]*wizardFormTemplateSectionEditor\.aiDesign\.enabled/);
assert.match(adminHtml, /AI 정책 저장/);
assert.match(adminApp, /aiDesign:\s*\{[\s\S]*allowedLayoutVariants/);
assert.match(adminHtml, /aiDesign\.allowSectionBackground/);
assert.match(adminHtml, /섹션 배경 AI 생성 허용/);
assert.match(templateSectionsApi, /ai_design\s*=/);
assert.doesNotMatch(templateSectionsApi, /"aiDesign"\]\s*\.filter/);
assert.match(publicTemplateApi, /aiDesign: normalizeAiDesign\(membership\.aiDesign\)/);
assert.match(publicTemplateApi, /JSON\.stringify\(section\.aiDesign\)/);
assert.match(runs, /constraints\.enabled/);
assert.match(runs, /body\.targetType/);

console.log("Wizard section AI policy contract tests passed.");
