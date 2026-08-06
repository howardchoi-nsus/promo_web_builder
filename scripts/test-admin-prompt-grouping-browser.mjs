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
];

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
    if (url.pathname === "/api/prompt-template" && request.method() === "GET") {
      const selected = prompts.find((item) => item.id === url.searchParams.get("id"));
      return fulfill({ ok: true, prompt: selected, histories: [] });
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
  await page.getByRole("heading", { name: "LLM 및 프롬프트 관리" }).waitFor();
  await page.locator(".prompt-group").first().waitFor();
  assert.equal(await page.locator(".prompt-group").count(), 2, "versions must collapse into lineage groups");
  assert.equal(await page.locator(".prompt-workflow-group").count(), 1, "related image prompts must share one workflow group");
  await page.getByRole("heading", { name: "프로모션 이미지" }).waitFor();
  await page.getByText("섹션 콘텐츠와 배경색을 바탕으로 프로모션 키비주얼을 생성합니다.", { exact: true }).first().waitFor();
  await page.getByText("선택 실행", { exact: true }).first().waitFor();
  await page.locator(".prompt-body-grid").waitFor();
  assert.equal(await page.locator(".prompt-body-grid textarea").count(), 2);
  assert.equal(await page.locator(".prompt-body-grid textarea").nth(0).getAttribute("lang"), "en");
  assert.equal(await page.locator(".prompt-body-grid textarea").nth(1).getAttribute("lang"), "ko");
  assert.notEqual(await page.locator(".prompt-body-grid textarea").nth(0).getAttribute("readonly"), null);
  await page.locator(".prompt-body-translation").waitFor();
  await page.waitForFunction(() => document.querySelector(".prompt-body-translation")?.value.startsWith("한글 번역"));
  await page.getByRole("button", { name: "영문 프롬프트 본문 복사" }).click();
  assert.equal(
    (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n"),
    (await page.locator(".prompt-body-grid textarea").nth(0).inputValue()).replace(/\r\n/g, "\n"),
  );
  const workflowToggle = page.locator(".prompt-workflow-toggle");
  assert.equal(await workflowToggle.getAttribute("aria-expanded"), "true");
  await workflowToggle.click();
  assert.equal(await page.locator(".prompt-group").first().isVisible(), false, "collapsed workflow must hide its prompts");
  assert.equal(await workflowToggle.getAttribute("aria-expanded"), "false");
  await workflowToggle.click();
  assert.equal(await page.locator(".prompt-group").first().isVisible(), true, "expanded workflow must restore its prompts");

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
  assert.equal(await englishPromptEditor.getAttribute("readonly"), null);
  const originalPromptBody = await englishPromptEditor.inputValue();
  await page.waitForFunction((expected) => (
    document.querySelector(".prompt-body-translation")?.value === `한글 번역\n${expected}`
  ), originalPromptBody);
  await englishPromptEditor.fill(`${originalPromptBody}\n한글 입력`);
  await page.getByText("영문 원문에는 한글을 입력할 수 없습니다.", { exact: true }).waitFor();
  await englishPromptEditor.fill(originalPromptBody);
  assert.equal(await page.getByText("영문 원문에는 한글을 입력할 수 없습니다.", { exact: true }).count(), 0);
  await page.getByRole("button", { name: "초안 검증" }).click();
  await backgroundGroup.getByText("검증 v15", { exact: true }).waitFor();
  assert.equal(await backgroundGroup.getByText("초안 v15", { exact: true }).count(), 0);

  await page.getByRole("button", { name: "활성 프롬프트로 지정" }).click();
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

  assert.deepEqual(pageErrors, [], `Page errors:\n${pageErrors.join("\n")}`);
  assert.deepEqual(consoleErrors, [], `Console errors:\n${consoleErrors.join("\n")}`);
  assert.deepEqual(failedResponses, [], `Failed responses:\n${failedResponses.join("\n")}`);
  console.log("Admin prompt grouping browser test passed");
  await context.close();
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}
