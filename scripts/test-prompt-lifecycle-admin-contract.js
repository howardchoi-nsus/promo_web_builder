const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const admin = read("prototype", "app.js");
const html = read("prototype", "index.html");
const store = read("api", "_prompt-template-store.js");
const listRoute = read("api", "prompt-templates.js");
const detailRoute = read("api", "prompt-template.js");
const translationRoute = read("api", "prompt-template-translate.js");
const groupService = read("admin-app", "src", "services", "prompt-template-group-service.mjs");

assert.match(admin, /promptEditorReadOnly\(\)/);
assert.match(admin, /filteredPromptTemplateGroups\(\)/);
assert.match(admin, /filteredPromptTemplateSections\(\)/);
assert.match(admin, /expandedPromptLineageIds/);
assert.match(admin, /expandedPromptWorkflowKeys/);
assert.match(admin, /promptArchivedVisibilityByLineage/);
assert.match(admin, /expandPromptGroupForPromptId/);
assert.match(admin, /togglePromptWorkflow/);
assert.match(admin, /prompt\.status !== "draft"/);
assert.match(admin, /\/api\/prompt-template-draft/);
assert.match(admin, /\/api\/prompt-template-validate/);
assert.match(admin, /\/api\/prompt-template-rollback/);
assert.match(admin, /validated: "검증 완료"/);
assert.match(admin, /promptSupportsImageSize\(prompt = this\.selectedPromptTemplate\)/);
assert.match(admin, /modelOptions\.imageSize = \["1K", "2K", "4K"\]/);
assert.match(admin, /translatePromptBody/);
assert.match(admin, /copyPromptBody/);
assert.match(admin, /\/api\/prompt-template-translate/);
assert.match(html, /새 초안 만들기/);
assert.match(html, /초안 검증/);
assert.match(html, /이 버전으로 롤백/);
assert.match(html, /:disabled="promptEditorReadOnly"/);
assert.match(html, /admin\.prompt\.imageSize/);
assert.match(html, /v-for="workflow in filteredPromptTemplateSections"/);
assert.match(html, /v-for="group in workflow\.promptGroups"/);
assert.match(html, /class="prompt-workflow-header"/);
assert.match(html, /class="prompt-workflow-toggle"/);
assert.match(html, /:aria-expanded="String\(promptWorkflowExpanded\(workflow\)\)"/);
assert.match(html, /promptTypeDescription\(selectedPromptTemplate\.type\)/);
assert.match(html, /class="prompt-body-grid"/);
assert.match(html, /영문 프롬프트 본문 복사/);
assert.match(html, /class="prompt-body-editor prompt-body-translation"/);
assert.match(
  html,
  /<strong>\{\{ selectedPromptEditorTitle \}\}<\/strong>\s*<p>\{\{ promptTypeDescription\(selectedPromptTemplate\.type\) \}\}<\/p>/,
);
assert.match(html, /class="prompt-group-toggle"/);
assert.match(html, /class="prompt-version-item"/);
assert.match(html, /보관 버전/);
assert.match(store, /lineageId: row\.lineage_id/);
assert.match(store, /sourcePromptTemplateId: row\.source_prompt_template_id/);
assert.match(listRoute, /case status when 'active' then 0 when 'validated' then 1/);
assert.match(detailRoute, /PROMPT_BODY_ENGLISH_REQUIRED/);
assert.match(translationRoute, /generatePromptKoreanTranslation/);
assert.match(translationRoute, /PROMPT_TRANSLATION_TOO_LONG/);
assert.match(groupService, /groupPromptTemplates/);
assert.match(groupService, /groupPromptTemplateSections/);
assert.match(groupService, /PROMPT_TYPE_CATALOG/);
assert.match(groupService, /active\s*\|\|\s*group\.validated/);

console.log("Prompt lifecycle Admin contract tests passed");
