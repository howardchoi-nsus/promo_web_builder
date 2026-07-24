const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const admin = read("prototype", "app.js");
const html = read("prototype", "index.html");
const store = read("api", "_prompt-template-store.js");
const listRoute = read("api", "prompt-templates.js");

assert.match(admin, /promptEditorReadOnly\(\)/);
assert.match(admin, /prompt\.status !== "draft"/);
assert.match(admin, /\/api\/prompt-template-draft/);
assert.match(admin, /\/api\/prompt-template-validate/);
assert.match(admin, /\/api\/prompt-template-rollback/);
assert.match(admin, /validated: "검증 완료"/);
assert.match(html, /새 초안 만들기/);
assert.match(html, /초안 검증/);
assert.match(html, /이 버전으로 롤백/);
assert.match(html, /:disabled="promptEditorReadOnly"/);
assert.match(store, /lineageId: row\.lineage_id/);
assert.match(store, /sourcePromptTemplateId: row\.source_prompt_template_id/);
assert.match(listRoute, /case status when 'active' then 0 when 'validated' then 1/);

console.log("Prompt lifecycle Admin contract tests passed");
