import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import registryStore from "../api/_llm-model-registry-store.js";

const normalized = registryStore.normalizeModelInput({
  provider: "OpenAI",
  modelId: "gpt-example",
  displayName: "GPT Example",
  modality: "text",
  status: "draft",
  defaultTemperature: "0.2",
  defaultMaxTokens: "12000",
  defaultResponseFormat: "json_object",
  supportedImageSizes: "1K, 2K, 2K",
  modelOptions: '{"reasoning":{"effort":"medium"}}',
});
assert.equal(normalized.provider, "openai");
assert.equal(normalized.defaultTemperature, 0.2);
assert.equal(normalized.defaultMaxTokens, 12000);
assert.deepEqual(normalized.supportedImageSizes, ["1K", "2K"]);
assert.equal(normalized.modelOptions.reasoning.effort, "medium");
assert.throws(() => registryStore.normalizeModelInput({
  provider: "unknown",
  modelId: "bad",
  displayName: "Bad",
  modality: "text",
}), /provider/);

const registeredDefaults = new Set(registryStore.DEFAULT_MODELS.map((entry) => `${entry[0]}:${entry[1]}`));
for (const appliedModel of [
  "openai:gpt-4o-mini",
  "openai:gpt-4.1-mini",
  "openai:gpt-image-1",
  "google:gemini-3.1-flash-image",
  "openai:gpt-6.1-sol",
  "openai:gpt-image-2.5-sunburst",
]) {
  assert.ok(registeredDefaults.has(appliedModel), `${appliedModel} must be registered`);
}

const root = new URL("../", import.meta.url);
const [html, app, entry, component, api, migration, registryStoreSource, promptUpdate, promptValidate, promptActivate, promptSnapshot] = await Promise.all([
  readFile(new URL("prototype/index.html", root), "utf8"),
  readFile(new URL("prototype/app.js", root), "utf8"),
  readFile(new URL("admin-app/src/main.js", root), "utf8"),
  readFile(new URL("admin-app/src/components/LlmModelManager.vue", root), "utf8"),
  readFile(new URL("api/llm-models.js", root), "utf8"),
  readFile(new URL("db/migrations/073_llm_model_registry.sql", root), "utf8"),
  readFile(new URL("api/_llm-model-registry-store.js", root), "utf8"),
  readFile(new URL("api/prompt-template.js", root), "utf8"),
  readFile(new URL("api/prompt-template-validate.js", root), "utf8"),
  readFile(new URL("api/prompt-template-activate.js", root), "utf8"),
  readFile(new URL("api/_prompt-execution-snapshot.js", root), "utf8"),
]);
assert.match(html, /selectAdminTab\('llm-models'\)/);
assert.match(html, /<llm-model-manager/);
assert.match(app, /adminApp\.component\("llm-model-manager"/);
assert.match(entry, /PromoAdminLlmModels/);
assert.match(component, /신규 모델 등록/);
assert.match(component, /사용 중인 프롬프트가 있으면 모델을 중지할 수 없습니다/);
assert.match(component, /LLM 업데이트 내역/);
assert.match(component, /기본 Temperature 가이드/);
assert.match(component, /Temperature 설정 가이드/);
assert.match(component, /모델 용도/);
assert.match(component, /연결 프롬프트/);
assert.match(component, /model\.usage\?\.total \|\| 0/);
assert.match(component, /usageDifference/);
assert.match(component, /providerDifference/);
assert.match(registryStoreSource, /order by usage_total desc, model\.provider, lower\(model\.display_name\)/);
assert.match(api, /resolveAdminOwner/);
assert.match(api, /listModelHistories/);
assert.ok(
  api.indexOf('if (req.method === "GET")') < api.indexOf("resolveAdminOwner(req, res)"),
  "read-only registry access must not require an admin mutation session",
);
assert.match(migration, /create table if not exists llm_models/);
assert.match(migration, /create table if not exists llm_model_histories/);
assert.doesNotMatch(migration, /system:prompt-sync/);
assert.doesNotMatch(registryStoreSource, /syncPromptModelsToRegistry/);
assert.equal(registryStore.syncPromptModelsToRegistry, undefined);
assert.equal(typeof registryStore.listModelHistories, "function");
assert.equal(typeof registryStore.requireActiveRegisteredModel, "function");
for (const source of [promptUpdate, promptValidate, promptActivate, promptSnapshot]) {
  assert.match(source, /requireActiveRegisteredModel/);
}

console.log("Admin LLM model registry contract passed");
