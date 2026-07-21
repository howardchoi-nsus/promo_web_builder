const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const migration = read("db", "migrations", "022_wizard_section_audit_logs.sql");
const api = read("api", "wizard-section-audit-logs.js");
const store = read("api", "_wizard-section-audit-log.js");
const app = read("prototype", "app.js");
const html = read("prototype", "index.html");

assert.match(migration, /create table if not exists wizard_section_audit_logs/);
assert.match(migration, /wizard_form_template_section_audit/);
assert.match(migration, /wizard_content_section_item_audit/);
assert.match(migration, /when old\.sort_order is distinct from new\.sort_order then 'reorder'/);
assert.match(api, /listWizardSectionAudits/);
assert.match(store, /order by created_at desc/);
assert.match(app, /loadWizardSectionAuditLogs/);
assert.match(html, /Section CRUD 로그/);
assert.match(html, /app-shell\.css\?v=app-shell-sidebar-v3/);
assert.match(html, /app\.js/);
assert.doesNotMatch(html, /<summary>공통 Section 원본 관리<\/summary>/);

console.log("Wizard section audit log contract test passed");
