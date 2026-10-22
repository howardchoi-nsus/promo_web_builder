import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import catalogModule from "../api/_prompt-variable-catalog.js";

const { buildPromptVariableCatalog } = catalogModule;
const catalog = buildPromptVariableCatalog();
assert.ok(catalog.summary.variableCount > 0);
assert.ok(catalog.summary.promptTypeCount > 0);
assert.equal(catalog.variables.length, catalog.summary.variableCount);
assert.equal(new Set(catalog.variables.map((variable) => variable.key)).size, catalog.variables.length);

const backgroundColor = catalog.variables.find((variable) => variable.key === "backgroundColor");
assert.ok(backgroundColor);
assert.ok(backgroundColor.usages.some((usage) => (
  usage.promptType === "section_background_image" && usage.requirement === "required"
)));
const adminGuidance = catalog.variables.find((variable) => variable.key === "adminGuidance");
assert.ok(adminGuidance?.optionalCount > 0);

const root = new URL("../", import.meta.url);
const [html, app, main, component, service, route] = await Promise.all([
  readFile(new URL("prototype/index.html", root), "utf8"),
  readFile(new URL("prototype/app.js", root), "utf8"),
  readFile(new URL("admin-app/src/main.js", root), "utf8"),
  readFile(new URL("admin-app/src/components/PromptVariableManager.vue", root), "utf8"),
  readFile(new URL("admin-app/src/services/prompt-variable-service.mjs", root), "utf8"),
  readFile(new URL("api/prompt-variables.js", root), "utf8"),
]);
assert.match(html, /selectAdminTab\('prompt-variables'\)/);
assert.match(html, /<prompt-variable-manager/);
assert.match(app, /adminApp\.component\("prompt-variable-manager"/);
assert.match(main, /PromoAdminPromptVariables/);
assert.match(component, /프롬프트 변수 관리/);
assert.match(component, /현재는 읽기 전용입니다/);
assert.match(component, /연결된 프롬프트 유형/);
assert.match(service, /\/api\/prompt-variables/);
assert.match(route, /buildPromptVariableCatalog/);

console.log("Admin prompt variable manager contract passed");
