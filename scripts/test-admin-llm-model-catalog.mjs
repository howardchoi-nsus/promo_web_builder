import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { llmModelCatalogService } from "../admin-app/src/services/llm-model-catalog.mjs";
import promptExecutionSnapshot from "../api/_prompt-execution-snapshot.js";

const textModels = llmModelCatalogService.listModels({ provider: "openai", type: "integrated_brief_v2" });
assert.ok(textModels.some((entry) => entry.model === "gpt-6.1-sol" && entry.recommended));
assert.ok(textModels.every((entry) => entry.modality === "text"));

const openAiImageModels = llmModelCatalogService.listModels({ provider: "openai", type: "final_design_v2" });
assert.ok(openAiImageModels.some((entry) => entry.model === "gpt-image-2.5-sunburst" && entry.recommended));
assert.ok(openAiImageModels.every((entry) => entry.modality === "image"));

const googleImageModels = llmModelCatalogService.listModels({ provider: "google", type: "component_image" });
assert.ok(googleImageModels.some((entry) => entry.model === "gemini-nano-banana-2.1" && entry.recommended));

const textPreset = llmModelCatalogService.presetFor({
  provider: "openai",
  model: "gpt-6.1-sol",
  type: "integrated_brief_v2",
});
assert.equal(textPreset.responseFormat, "json_object");
assert.equal(textPreset.temperature, null);
assert.equal(textPreset.modelOptions.reasoning.effort, "medium");

const imagePreset = llmModelCatalogService.presetFor({
  provider: "openai",
  model: "gpt-image-2.5-sunburst",
  type: "final_design_v2",
});
assert.equal(imagePreset.responseFormat, "image");
assert.equal(imagePreset.modelOptions.quality, "high");
assert.equal(imagePreset.modelOptions.size, "1024x1536");

const geminiPreset = llmModelCatalogService.presetFor({
  provider: "google",
  model: "gemini-3.1-flash-lite-image",
  type: "section_background_image",
});
assert.equal(geminiPreset.imageSize, "1K");
assert.deepEqual(geminiPreset.capabilitySnapshot.supportedImageSizes, ["1K"]);
assert.doesNotThrow(() => promptExecutionSnapshot.validateStageModelConfig("image_execution", {
  provider: "google",
  model: "gemini-nano-banana-2.1",
  responseFormat: "image",
  modelOptions: { imageSize: "2K" },
}));
assert.doesNotThrow(() => promptExecutionSnapshot.validateStageModelConfig("image_execution", {
  provider: "google",
  model: "gemini-3.1-flash-lite-image",
  responseFormat: "image",
  modelOptions: { imageSize: "1K" },
}));

const html = await readFile(new URL("../prototype/index.html", import.meta.url), "utf8");
assert.match(html, /v-model="promptEditor\.modelChoice"/);
assert.match(html, /@change="applyPromptModelPreset"/);
assert.doesNotMatch(html, /직접 입력 · 고급/);

const app = await readFile(new URL("../prototype/app.js", import.meta.url), "utf8");
assert.match(app, /llmRegistryModels/);
assert.match(app, /PromoAdminLlmModels\.service\.list/);
assert.match(app, /LLM 모델 관리에 등록되고 활성화된 모델을 선택해 주세요/);

console.log("Admin LLM model catalog contract passed");
