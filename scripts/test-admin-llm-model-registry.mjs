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
const [html, app, entry, component, api, migration] = await Promise.all([
  readFile(new URL("prototype/index.html", root), "utf8"),
  readFile(new URL("prototype/app.js", root), "utf8"),
  readFile(new URL("admin-app/src/main.js", root), "utf8"),
  readFile(new URL("admin-app/src/components/LlmModelManager.vue", root), "utf8"),
  readFile(new URL("api/llm-models.js", root), "utf8"),
  readFile(new URL("db/migrations/073_llm_model_registry.sql", root), "utf8"),
]);
assert.match(html, /selectAdminTab\('llm-models'\)/);
assert.match(html, /<llm-model-manager/);
assert.match(app, /adminApp\.component\("llm-model-manager"/);
assert.match(entry, /PromoAdminLlmModels/);
assert.match(component, /신규 모델 등록/);
assert.match(component, /사용 중인 프롬프트가 있으면 모델을 중지할 수 없습니다/);
assert.match(component, /LLM 업데이트 내역/);
assert.match(api, /resolveAdminOwner/);
assert.match(api, /listModelHistories/);
assert.match(migration, /create table if not exists llm_models/);
assert.match(migration, /create table if not exists llm_model_histories/);
assert.match(migration, /from prompt_templates/);
assert.match(migration, /system:prompt-sync/);
assert.equal(typeof registryStore.syncPromptModelsToRegistry, "function");
assert.equal(typeof registryStore.listModelHistories, "function");

console.log("Admin LLM model registry contract passed");
