import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number(process.env.ADMIN_PROMPT_GROUPING_TEST_PORT || 4192);
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["scripts/serve-visual-editor-preview.js"], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(port), USE_FIXTURE: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

async function waitForServer(timeoutMs = 10_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (server.exitCode !== null) throw new Error(`Fixture server exited early.\n${serverOutput}`);
    try {
      if ((await fetch(`${origin}/prototype/index.html`)).ok) return;
    } catch { /* Server is starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Fixture server did not start.\n${serverOutput}`);
}

function prompt(overrides) {
  return {
    id: "",
    lineageId: "",
    sourcePromptTemplateId: null,
    type: "section_background_image",
    name: "Section Background Image",
    body: "Section: {{sectionName}}\nContent: {{contentJson}}\nColor: {{backgroundColor}}",
    status: "inactive",
    version: 1,
    requiredVariables: ["sectionName", "contentJson", "backgroundColor"],
    optionalVariables: ["fadeMode", "adminGuidance", "brandPalette", "aspectRatio"],
    provider: "google",
    model: "gemini-3.1-flash-image",
    temperature: 0.2,
    maxTokens: 4096,
    responseFormat: "json_object",
    modelOptions: {},
    updatedAt: "2026-07-27T00:00:00.000Z",
    ...overrides,
  };
}

let prompts = [
  prompt({ id: "bg-v15", lineageId: "bg-lineage", status: "draft", version: 15, updatedAt: "2026-07-27T03:00:00.000Z" }),
  prompt({ id: "bg-v14", lineageId: "bg-lineage", status: "active", version: 14, updatedAt: "2026-07-26T03:00:00.000Z" }),
  prompt({ id: "bg-v13", lineageId: "bg-lineage", status: "inactive", version: 13, updatedAt: "2026-07-25T03:00:00.000Z" }),
  prompt({ id: "bg-v12", lineageId: "bg-lineage", status: "archived", version: 12, updatedAt: "2026-07-24T03:00:00.000Z" }),
  prompt({
    id: "component-v2",
    lineageId: "component-lineage",
    type: "component_image",
    name: "Component Image",
    status: "active",
    version: 2,
  }),
  prompt({
    id: "overview-v2",
    lineageId: "overview-lineage",
    type: "promo_overview_parser",
    name: "Promotion Overview Parser",
    body: "Request: {{naturalLanguage}}\nAllowed: {{allowedValuesJson}}",
    status: "draft",
    version: 2,
    requiredVariables: ["naturalLanguage", "allowedValuesJson"],
    optionalVariables: [
      "generationMode", "currentOverviewJson", "productCatalogJson", "localeAndMarketJson",
    ],
    provider: "openai",
    model: "gpt-4.1-mini",
    modelOptions: {},
  }),
];

let savedPromptPatch = null;
let llmModels = [{
  id: "llm-openai-sol",
  provider: "openai",
  modelId: "gpt-6.1-sol",
  displayName: "GPT-6.1 Sol",
  description: "구조화 작업 기본 모델",
  modality: "text",
  status: "active",
  isRecommended: true,
  isLegacy: false,
  defaultTemperature: null,
  defaultMaxTokens: 24000,
  defaultResponseFormat: "json_object",
  supportedImageSizes: [],
  modelOptions: { reasoning: { effort: "medium" } },
  usage: { total: 1, active: 1 },
}, {
  id: "llm-openai-41-mini", provider: "openai", modelId: "gpt-4.1-mini", displayName: "GPT-4.1 Mini",
  description: "기존 텍스트 모델", modality: "text", status: "active", isRecommended: false, isLegacy: true,
  defaultTemperature: 0.1, defaultMaxTokens: 12000, defaultResponseFormat: "json_object",
  supportedImageSizes: [], modelOptions: {}, usage: { total: 1, active: 1 },
}, {
  id: "llm-gemini-31", provider: "google", modelId: "gemini-3.1-flash-image", displayName: "Nano Banana 2",
  description: "기존 Gemini 이미지 모델", modality: "image", status: "active", isRecommended: false, isLegacy: true,
  defaultTemperature: null, defaultMaxTokens: null, defaultResponseFormat: "image",
  supportedImageSizes: ["1K", "2K", "4K"], modelOptions: { imageSize: "2K" }, usage: { total: 2, active: 2 },
}, {
  id: "llm-gemini-nano", provider: "google", modelId: "gemini-nano-banana-2.1", displayName: "Nano Banana 2.1",
  description: "권장 Gemini 이미지 모델", modality: "image", status: "active", isRecommended: true, isLegacy: false,
  defaultTemperature: null, defaultMaxTokens: null, defaultResponseFormat: "image",
  supportedImageSizes: ["1K", "2K", "4K"], modelOptions: { imageSize: "2K" }, usage: { total: 0, active: 0 },
}];
let llmHistories = [{
  id: "history-openai-sol-1",
  llmModelId: "llm-openai-sol",
  provider: "openai",
  modelId: "gpt-6.1-sol",
  previousStatus: "",
  newStatus: "active",
  snapshot: { defaultResponseFormat: "json_object", defaultMaxTokens: 24000 },
  changeNote: "기존 프롬프트 모델 등록",
  changedBy: "system:prompt-sync",
  changedAt: "2026-10-12T01:00:00.000Z",
}];

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const failedResponses = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
  });

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const fulfill = (body, status = 200) => route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });

    if (url.pathname === "/api/prompt-templates") {
      return fulfill({ ok: true, prompts });
    }
    if (url.pathname === "/api/llm-models" && request.method() === "GET") {
      return fulfill({ ok: true, models: llmModels, histories: llmHistories });
    }
    if (url.pathname === "/api/prompt-variables" && request.method() === "GET") {
      return fulfill({
        ok: true,
        summary: { variableCount: 2, promptTypeCount: 2, requiredUsageCount: 2, optionalUsageCount: 1 },
        variables: [{
          key: "contentJson",
          requiredCount: 2,
          optionalCount: 0,
          promptTypeCount: 2,
          usages: [
            { promptType: "section_background_image", promptName: "Section Key Visual", requirement: "required" },
            { promptType: "component_image", promptName: "Component Field Image", requirement: "required" },
          ],
        }, {
          key: "adminGuidance",
          requiredCount: 0,
          optionalCount: 1,
          promptTypeCount: 1,
          usages: [{ promptType: "component_image", promptName: "Component Field Image", requirement: "optional" }],
        }],
      });
    }
    if (url.pathname === "/api/llm-models" && request.method() === "POST") {
      const payload = request.postDataJSON();
      const model = { ...payload, id: "llm-new-model", usage: { total: 0, active: 0 } };
      llmModels = [...llmModels, model];
      llmHistories = [{
        id: "history-new-model-1",
        llmModelId: model.id,
        provider: model.provider,
        modelId: model.modelId,
        previousStatus: "",
        newStatus: model.status,
        snapshot: model,
        changeNote: model.changeNote,
        changedBy: "admin:test",
        changedAt: new Date().toISOString(),
      }, ...llmHistories];
      return fulfill({ ok: true, model }, 201);
    }
    if (url.pathname === "/api/llm-models" && request.method() === "PATCH") {
      const payload = request.postDataJSON();
      llmModels = llmModels.map((item) => item.id === payload.id ? { ...item, ...payload } : item);
      return fulfill({ ok: true, model: llmModels.find((item) => item.id === payload.id) });
    }
    if (url.pathname === "/api/prompt-template" && request.method() === "GET") {
      const selected = prompts.find((item) => item.id === url.searchParams.get("id"));
      return fulfill({ ok: true, prompt: selected, histories: [] });
    }
    if (url.pathname === "/api/prompt-template" && request.method() === "PATCH") {
      savedPromptPatch = request.postDataJSON();
      prompts = prompts.map((item) => item.id === savedPromptPatch.id
        ? { ...item, ...savedPromptPatch, updatedAt: new Date().toISOString() }
        : item);
      return fulfill({ ok: true, prompt: prompts.find((item) => item.id === savedPromptPatch.id) });
    }
    if (url.pathname === "/api/prompt-template-draft" && request.method() === "POST") {
      const source = prompts.find((item) => item.id === request.postDataJSON().id);
      const version = Math.max(...prompts
        .filter((item) => item.lineageId === source.lineageId)
        .map((item) => item.version)) + 1;
      const draft = {
        ...source,
        id: `${source.lineageId}-v${version}`,
        sourcePromptTemplateId: source.id,
        status: "draft",
        version,
      };
      prompts = [...prompts, draft];
      return fulfill({ ok: true, prompt: draft }, 201);
    }
    if (url.pathname === "/api/prompt-template-translate" && request.method() === "POST") {
      const text = String(request.postDataJSON().text || "");
      return fulfill({ ok: true, translation: `한글 번역\n${text}`, provider: { provider: "openai" } });
    }
    if (url.pathname === "/api/prompt-template-validate" && request.method() === "POST") {
      const id = request.postDataJSON().id;
      prompts = prompts.map((item) => item.id === id ? { ...item, status: "validated" } : item);
      return fulfill({ ok: true, prompt: prompts.find((item) => item.id === id) });
    }
    if (url.pathname === "/api/prompt-template-activate" && request.method() === "POST") {
      const id = request.postDataJSON().id;
      const target = prompts.find((item) => item.id === id);
      prompts = prompts.map((item) => {
        if (item.type !== target.type) return item;
        if (item.id === id) return { ...item, status: "active" };
        return item.status === "active" ? { ...item, status: "inactive" } : item;
      });
      return fulfill({ ok: true, prompt: prompts.find((item) => item.id === id) });
    }
    if (url.pathname === "/api/locale-snapshot") {
      return fulfill({ ok: true, locale: "ko", defaultLocale: "ko", revision: 1, messages: {}, defaultMessages: {} });
    }
    if (url.pathname === "/api/promo-generation-worker-settings") return fulfill({ ok: true, settings: [] });
    if (url.pathname === "/api/wizard-form-templates") return fulfill({ ok: true, templates: [] });
    if (url.pathname === "/api/wizard-section-audit-logs") return fulfill({ ok: true, logs: [] });
    return fulfill({ ok: true, templates: [], sections: [], documents: [], logs: [], settings: [] });
  });

  await page.goto(`${origin}/prototype/index.html?view=admin&tab=llm`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "프롬프트 관리", exact: true }).waitFor();
  await page.locator(".prompt-group").first().waitFor();
  assert.equal(await page.locator(".prompt-group").count(), 3, "versions must collapse into lineage groups");
  assert.equal(await page.locator(".prompt-workflow-group").count(), 2, "prompts must be grouped by workflow");
  await page.getByRole("heading", { name: "프로모션 이미지" }).waitFor();
  await page.getByText("섹션 콘텐츠와 배경색을 바탕으로 프로모션 키비주얼을 생성합니다.", { exact: true }).first().waitFor();
  await page.getByText("선택 실행", { exact: true }).first().waitFor();
  const basicInfoGroup = page.locator("details.prompt-editor-group").filter({ hasText: "기본 정보" }).first();
  assert.notEqual(await basicInfoGroup.getAttribute("open"), null, "basic information must be open initially");
  await basicInfoGroup.locator("summary").click();
  assert.equal(await basicInfoGroup.getAttribute("open"), null, "right editor groups must be collapsible");
  await basicInfoGroup.locator("summary").click();
  await page.locator(".prompt-body-grid").waitFor();
  assert.equal(await page.locator(".prompt-body-grid textarea").count(), 2);
  assert.equal(await page.locator(".prompt-body-grid textarea").nth(0).getAttribute("lang"), "en");
  assert.equal(await page.locator(".prompt-body-grid textarea").nth(1).getAttribute("lang"), "ko");
  await page.waitForFunction(() => (
    document.querySelector(".prompt-body-grid textarea")?.getAttribute("readonly") === null
  ));
  assert.equal(await page.locator(".prompt-body-grid textarea").nth(0).getAttribute("readonly"), null);
  assert.equal(await page.locator(".prompt-editor-header button").filter({ hasText: "새 초안 만들기" }).count(), 0);
  await page.locator(".prompt-body-translation").waitFor();
  await page.waitForFunction(() => document.querySelector(".prompt-body-translation")?.value.startsWith("한글 번역"));
  await page.getByRole("button", { name: "영문 프롬프트 본문 복사" }).click();
  assert.equal(
    (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n"),
    (await page.locator(".prompt-body-grid textarea").nth(0).inputValue()).replace(/\r\n/g, "\n"),
  );
  const imageWorkflow = page.locator(".prompt-workflow-group").filter({ hasText: "프로모션 이미지" });
  const workflowToggle = imageWorkflow.locator(".prompt-workflow-toggle");
  assert.equal(await workflowToggle.getAttribute("aria-expanded"), "true");
  await workflowToggle.click();
  assert.equal(await imageWorkflow.locator(".prompt-group").first().isVisible(), false, "collapsed workflow must hide its prompts");
  assert.equal(await workflowToggle.getAttribute("aria-expanded"), "false");
  await workflowToggle.click();
  assert.equal(await imageWorkflow.locator(".prompt-group").first().isVisible(), true, "expanded workflow must restore its prompts");

  await page.locator('select[aria-label="프롬프트 유형 필터"]').selectOption("section_background_image");
  await page.waitForFunction(() => document.querySelectorAll(".prompt-group").length === 1);
  const backgroundGroup = page.locator(".prompt-group");
  await backgroundGroup.getByText("활성 v14", { exact: true }).waitFor();
  await backgroundGroup.getByText("초안 v15", { exact: true }).waitFor();
  assert.equal(await backgroundGroup.locator(".prompt-version-item").count(), 3, "archived version must be hidden initially");

  await backgroundGroup.getByRole("button", { name: "보관 버전 1개 보기" }).click();
  assert.equal(await backgroundGroup.locator(".prompt-version-item").count(), 4);
  await backgroundGroup.locator(".prompt-version-item").filter({ hasText: "v15" }).click();
  const englishPromptEditor = page.locator(".prompt-body-grid textarea").nth(0);
  await page.waitForFunction(() => (
    document.querySelector(".prompt-body-grid textarea")?.getAttribute("readonly") === null
  ));
  assert.equal(await englishPromptEditor.getAttribute("readonly"), null);
  const originalPromptBody = await englishPromptEditor.inputValue();
  await page.waitForFunction((expected) => (
    document.querySelector(".prompt-body-translation")?.value === `한글 번역\n${expected}`
  ), originalPromptBody);
  const modelSelect = page.getByLabel("모델 선택", { exact: true });
  assert.match(
    (await modelSelect.locator('option[value="gemini-nano-banana-2.1"]').textContent()) || "",
    /용도:\s*이미지 생성·편집/,
  );
  await modelSelect.selectOption("gemini-nano-banana-2.1");
  assert.equal(await modelSelect.inputValue(), "gemini-nano-banana-2.1");
  assert.equal(await page.getByLabel("응답 형식", { exact: true }).inputValue(), "image");
  const providerOptions = page.getByLabel("Provider 상세 옵션(JSON)", { exact: true });
  assert.match(await providerOptions.inputValue(), /gemini-nano-banana-2\.1/);
  await providerOptions.fill('{"imageSize":"2K","customInstruction":"keep-brand-colors"}');
  assert.match(await providerOptions.inputValue(), /keep-brand-colors/);
  await englishPromptEditor.fill(`${originalPromptBody}\n한글 입력`);
  await page.getByText("영문 원문에는 한글을 입력할 수 없습니다.", { exact: true }).waitFor();
  await englishPromptEditor.fill(originalPromptBody);
  assert.equal(await page.getByText("영문 원문에는 한글을 입력할 수 없습니다.", { exact: true }).count(), 0);
  await page.getByRole("button", { name: "변경 저장 및 활성화", exact: true }).click();
  await page.getByText("프롬프트 v15을 생성하고 활성화했습니다.", { exact: true }).waitFor();
  await backgroundGroup.getByText("활성 v15", { exact: true }).waitFor();
  assert.equal(
    await backgroundGroup.locator(".prompt-version-item.selected").getAttribute("aria-current"),
    "true",
    "activated version must remain selected",
  );
  assert.equal(
    await backgroundGroup.locator(".prompt-group-toggle").getAttribute("aria-expanded"),
    "true",
    "selected lineage must remain expanded",
  );

  await page.locator('select[aria-label="프롬프트 유형 필터"]').selectOption("component_image");
  await page.locator(".prompt-version-item").filter({ hasText: "v2" }).click();
  await page.getByRole("button", { name: "변경 저장 및 활성화", exact: true }).click();
  await page.getByText("변경된 내용이 없어 새 버전을 생성하지 않았습니다.", { exact: true }).waitFor();
  assert.equal(prompts.filter((item) => item.lineageId === "component-lineage").length, 1);
  await page.locator("label.field").filter({ hasText: "프롬프트 이름" }).locator("input").fill("Component Image Updated");
  await page.getByRole("button", { name: "변경 저장 및 활성화", exact: true }).click();
  await page.getByText("프롬프트 v3을 생성하고 활성화했습니다.", { exact: true }).waitFor();
  await page.locator(".prompt-group").getByText("활성 v3", { exact: true }).waitFor();
  assert.equal(prompts.find((item) => item.id === "component-lineage-v3")?.name, "Component Image Updated");

  await page.locator('select[aria-label="프롬프트 유형 필터"]').selectOption("promo_overview_parser");
  await page.locator(".prompt-version-item").filter({ hasText: "v2" }).click();
  const harnessGroup = page.locator("details.prompt-editor-group").filter({ hasText: "실행 Harness" }).first();
  await harnessGroup.locator("summary").click();
  assert.notEqual(await harnessGroup.getAttribute("open"), null, "execution harness must open on demand");
  const harnessInput = (label) => page.locator("label.field").filter({ hasText: label }).locator("input");
  assert.equal(await harnessInput("실행 Snapshot 버전").inputValue(), "2");
  assert.equal(await harnessInput("제한 시간(ms)").inputValue(), "90000");
  assert.equal(await harnessInput("최대 시도 횟수").inputValue(), "1");
  assert.equal(await harnessInput("재시도 기본 대기(ms)").inputValue(), "0");
  assert.equal(await harnessInput("재시도 최대 대기(ms)").inputValue(), "0");
  await page.locator(".prompt-editor-header .tiny-button.primary").click();
  await page.getByText("프롬프트 v2을 생성하고 활성화했습니다.", { exact: true }).waitFor();
  assert.equal(savedPromptPatch.modelOptions.executionSnapshotVersion, 2);
  assert.deepEqual(savedPromptPatch.modelOptions.runtimeConfig, {
    timeoutMs: 90000,
    maxAttempts: 1,
    retryBaseMs: 0,
    retryMaxMs: 0,
  });
  assert.deepEqual(savedPromptPatch.modelOptions.harnessConfig, {});
  assert.deepEqual(savedPromptPatch.modelOptions.modelCapabilitySnapshot, {});
  assert.deepEqual(savedPromptPatch.modelOptions.safetyContract, {});

  await page.getByRole("tab", { name: "LLM 모델 관리", exact: true }).click();
  await page.getByRole("heading", { name: "LLM 모델 관리", exact: true }).waitFor();
  await page.getByText("GPT-6.1 Sol", { exact: true }).first().waitFor();
  await page.getByText("LLM 업데이트 내역", { exact: true }).waitFor();
  await page.getByText("기존 프롬프트 모델 등록", { exact: true }).waitFor();
  const textModelRow = page.locator(".llm-registry__row").filter({ hasText: "GPT-6.1 Sol" }).first();
  await textModelRow.getByText(/모델 용도\s*텍스트·JSON/).waitFor();
  await textModelRow.getByText(/연결 프롬프트\s*1개/).waitFor();
  const imageModelRow = page.locator(".llm-registry__row").filter({ hasText: "Nano Banana 2" }).first();
  await imageModelRow.getByText(/모델 용도\s*이미지 생성·편집/).waitFor();
  await imageModelRow.getByText(/연결 프롬프트\s*2개/).waitFor();
  assert.deepEqual(
    await page.locator(".llm-registry__row-main > strong").allTextContents(),
    ["Nano Banana 2", "GPT-4.1 Mini", "GPT-6.1 Sol", "Nano Banana 2.1"],
  );
  const temperatureGuideButton = page.getByRole("button", { name: "기본 Temperature 가이드", exact: true });
  await temperatureGuideButton.click();
  const temperatureGuide = page.getByRole("dialog", { name: "Temperature 설정 가이드", exact: true });
  await temperatureGuide.waitFor();
  await temperatureGuide.getByText("0~0.2", { exact: true }).waitFor();
  await temperatureGuide.getByRole("button", { name: "닫기", exact: true }).click();
  assert.equal(await temperatureGuide.isVisible(), false);
  assert.equal(await page.locator(".llm-registry__row").count(), 4);
  await page.getByRole("button", { name: "신규 모델 등록", exact: true }).click();
  await page.getByLabel("모델 ID", { exact: true }).fill("gpt-test-model");
  await page.getByLabel("표시 이름", { exact: true }).fill("GPT Test Model");
  await page.getByLabel("변경 사유", { exact: true }).fill("브라우저 등록 테스트");
  await page.getByRole("button", { name: "초안 등록", exact: true }).click();
  await page.getByText("LLM 모델 초안을 등록했습니다.", { exact: true }).waitFor();
  await page.getByText("GPT Test Model", { exact: true }).first().waitFor();
  assert.equal(llmModels.length, 5);

  await page.getByRole("tab", { name: "프롬프트 변수 관리", exact: true }).click();
  await page.getByRole("heading", { name: "프롬프트 변수 관리", exact: true }).waitFor();
  await page.getByText("contentJson", { exact: true }).first().waitFor();
  await page.getByText("연결된 프롬프트 유형 2개", { exact: true }).waitFor();
  await page.getByText("필수 2", { exact: true }).waitFor();
  await page.getByText("Section Key Visual", { exact: true }).waitFor();

  assert.deepEqual(pageErrors, [], `Page errors:\n${pageErrors.join("\n")}`);
  assert.deepEqual(consoleErrors, [], `Console errors:\n${consoleErrors.join("\n")}`);
  assert.deepEqual(failedResponses, [], `Failed responses:\n${failedResponses.join("\n")}`);
  console.log("Admin prompt grouping browser test passed");
  await context.close();
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}
