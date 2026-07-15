const assert = require("assert");
const fs = require("fs");
const path = require("path");

const store = require("../api/_wizard-content-sections-store");

assert.deepStrictEqual(store.normalizeImageSources(["file", "url", "ai", "other"]), ["file", "url", "ai"]);
assert.strictEqual(store.validateLockedValue("text", "Fixed copy"), "");
assert.match(store.validateLockedValue("text", ""), /non-empty string/);
assert.strictEqual(store.validateLockedValue("cta", { label: "Join", link: "/join" }), "");
assert.match(store.validateLockedValue("cta", { label: "Join" }), /label and link/);
assert.strictEqual(store.validateLockedValue("image", { source: "url", value: "https://example.com/a.png" }), "");
assert.strictEqual(store.validateLockedValue("image", { source: "file", value: "asset" }), "");
assert.strictEqual(store.hasLockedValue(false), true);
assert.strictEqual(store.hasLockedValue(0), true);
assert.strictEqual(store.hasLockedValue(""), true);
assert.strictEqual(store.hasLockedValue(null), false);

const root = path.resolve(__dirname, "..");
const wizardSource = fs.readFileSync(path.join(root, "prototype", "promo-wizard.js"), "utf8");
const adminSource = fs.readFileSync(path.join(root, "prototype", "app.js"), "utf8");
const adminHtmlSource = fs.readFileSync(path.join(root, "prototype", "index.html"), "utf8");
const adminStyleSource = fs.readFileSync(path.join(root, "prototype", "styles.css"), "utf8");
const activateSource = fs.readFileSync(path.join(root, "api", "wizard-content-section-activate.js"), "utf8");
const archiveSource = fs.readFileSync(path.join(root, "api", "wizard-content-section-archive.js"), "utf8");
const orderSource = fs.readFileSync(path.join(root, "api", "wizard-content-sections-order.js"), "utf8");
const itemApiSource = fs.readFileSync(path.join(root, "api", "wizard-content-section-items.js"), "utf8");
const migrationSource = fs.readFileSync(path.join(root, "db", "migrations", "016_wizard_content_sections.sql"), "utf8");

assert.match(wizardSource, /wizardContentLegacyBackup/);
assert.match(wizardSource, /migrateLegacySectionInputs/);
assert.match(wizardSource, /wizardSectionConfigurationReady/);
assert.match(wizardSource, /applyCtaUtmParameters/);
assert.match(adminSource, /dragOverWizardSection/);
assert.match(adminSource, /wizardSectionDropPosition/);
assert.match(adminHtmlSource, /transition-group name="section-order-list"/);
assert.match(adminHtmlSource, /template-section-accordion-v8/);
assert.match(adminHtmlSource, /type="radio" name="wizard-form-template-image-source"/);
assert.match(itemApiSource, /must contain exactly one of: url, file, ai/);
assert.match(itemApiSource, /requestedItemKey \|\| createItemKey\(\)/);
assert.match(adminHtmlSource, /section-expand-button/);
assert.match(adminHtmlSource, /transition name="section-expand"/);
assert.match(adminStyleSource, /\.section-order-list-move/);
assert.match(adminStyleSource, /\.prompt-list-item\.drop-before/);
assert.match(activateSource, /activate_wizard_content_section/);
assert.match(activateSource, /validateSectionDraft/);
assert.match(archiveSource, /Active sections cannot be archived directly/);
assert.match(orderSource, /s\.status <> 'archived'/);
assert.match(orderSource, /const updatedKeys = new Set/);
assert.doesNotMatch(orderSource, /set sort_order[\s\S]*where s\.section_key = r\.section_key[\s\S]*and s\.status = 'active'/);
assert.match(migrationSource, /create or replace function clone_wizard_content_section_draft/);
assert.match(migrationSource, /create or replace function activate_wizard_content_section/);
assert.match(migrationSource, /coalesce\(max\(version\), 0\) \+ 1/);

console.log("Wizard content sections contract test passed");
