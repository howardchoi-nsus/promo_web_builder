import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number(process.env.ADMIN_COMPONENT_TEST_PORT || 4182);
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
    } catch { /* server is starting */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Fixture server did not start.\n${serverOutput}`);
}

const template = {
  id: "11111111-1111-4111-8111-111111111111",
  templateKey: "default-v2",
  name: "Default Promotion Template",
  description: "Shared component template",
  status: "draft",
  version: 1,
  isDefault: true,
};
const hero = {
  id: "22222222-2222-4222-8222-222222222222",
  componentId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  sectionKey: "heroBanner",
  name: "Hero Banner",
  description: "Primary promotion headline",
  status: "active",
  version: 1,
  aiDesign: { enabled: true, allowedLayoutVariants: ["split-left"], imageTarget: "section-background", imageTargetItemKeys: [], imageAspectRatio: "16:9" },
};
const content = {
  id: "33333333-3333-4333-8333-333333333333",
  componentId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  sectionKey: "contentCta",
  name: "Content CTA",
  description: "Content and CTA",
  status: "active",
  version: 1,
  aiDesign: { enabled: true, allowedLayoutVariants: ["split-right"], imageTarget: "item", imageTargetItemKeys: ["image"], imageAspectRatio: "16:9" },
};
const membership = {
  id: "44444444-4444-4444-8444-444444444444",
  formTemplateId: template.id,
  componentId: hero.componentId,
  sectionId: hero.id,
  sectionKey: hero.sectionKey,
  sectionName: hero.name,
  sectionDescription: hero.description,
  sectionVersion: 1,
  sectionStatus: "active",
  aiDesign: hero.aiDesign,
  sortOrder: 0,
  isRequired: true,
  isVisible: true,
  userReorderAllowed: true,
  fixedPosition: null,
};
const item = {
  id: "55555555-5555-4555-8555-555555555555",
  sectionId: hero.id,
  itemKey: "title",
  name: "Title",
  fieldKind: "text",
  textType: "title",
  isRequired: true,
  isVisibleInWizard: true,
  userReorderAllowed: true,
  sortOrder: 0,
};

let browser;
let addComponentRequestBody = null;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

  const vuePath = path.resolve("node_modules/vue/dist/vue.global.prod.js");
  await page.route("https://unpkg.com/vue@3/dist/vue.global.prod.js", (route) => route.fulfill({
    status: 200, contentType: "text/javascript", body: fs.readFileSync(vuePath, "utf8"),
  }));
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;
    const fulfill = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (pathname === "/api/locale-snapshot") return fulfill({ ok: true, locale: "ko", defaultLocale: "ko", revision: 1, messages: {}, defaultMessages: {} });
    if (pathname === "/api/wizard-form-templates") return fulfill({ ok: true, templates: [template] });
    if (pathname === "/api/wizard-form-template") return fulfill({ ok: true, template, sections: [membership] });
    if (pathname === "/api/wizard-form-template-sections" && request.method() === "POST") {
      addComponentRequestBody = request.postDataJSON();
      return fulfill({ ok: true, section: { ...membership, id: "66666666-6666-4666-8666-666666666666", componentId: content.componentId } }, 201);
    }
    if (pathname === "/api/wizard-form-template-layout") return fulfill({ ok: true, layout: { id: "layout-id", layoutRevision: 1, layoutSpec: { theme: {}, responsive: {}, itemStyles: {}, sectionStyles: {} }, validationResult: { ok: true, errors: [], warnings: [] } } });
    if (pathname === "/api/wizard-content-sections") return fulfill({ ok: true, sections: [hero, content] });
    if (pathname === "/api/wizard-content-section") return fulfill({ ok: true, section: url.searchParams.get("id") === content.id ? content : hero, items: [item], histories: [] });
    if (pathname === "/api/section-component-usage") return fulfill({ ok: true, componentId: hero.componentId, templateCount: 1, templates: [template] });
    if (pathname === "/api/wizard-section-audit-logs") return fulfill({ ok: true, logs: [] });
    if (pathname === "/api/promo-generation-worker-settings") return fulfill({ ok: true, settings: [] });
    if (pathname === "/api/prompt-templates") return fulfill({ ok: true, templates: [] });
    return fulfill({ ok: true, templates: [], sections: [], documents: [], logs: [], settings: [] });
  });

  await page.goto(`${origin}/prototype/index.html?view=admin&tab=promo-form`, { waitUntil: "networkidle" });
  await page.getByText("컴포넌트 관리", { exact: true }).first().waitFor({ state: "visible" });
  assert.equal(await page.getByText("Hero Banner", { exact: true }).count() > 0, true);
  assert.equal(await page.getByText("사용 중인 템플릿 1개", { exact: true }).count(), 1);

  await page.locator(".template-section-add button").click();
  const componentSelect = page.locator(".template-section-create label").first().locator("select");
  await componentSelect.waitFor({ state: "visible" });
  assert.equal(await componentSelect.locator(`option[value="${content.componentId}"]`).count(), 1);
  assert.equal(await page.locator('.template-section-create input[placeholder*="Section"]').count(), 0);
  assert.equal(await page.locator(".template-section-create input").count(), 0, "Adding a component must not send blank instance overrides");
  await componentSelect.selectOption(content.componentId);
  await page.locator(".template-section-create .action-row button").click();
  await page.waitForFunction(() => !document.querySelector(".template-section-create"));
  assert.deepEqual(addComponentRequestBody, {
    templateId: template.id,
    componentId: content.componentId,
  }, "Component membership creation must preserve the active component defaults");

  await page.locator(".template-section-row .section-expand-button").first().click();
  assert.equal(await page.locator(".template-section-expanded input").count(), 3, "Template membership editor must expose instance switches only");
  assert.equal(await page.locator(".template-section-expanded textarea").count(), 0, "Template membership editor must not edit component definitions");
  assert.deepEqual(pageErrors, [], `Page errors:\n${pageErrors.join("\n")}`);
  assert.deepEqual(consoleErrors, [], `Console errors:\n${consoleErrors.join("\n")}`);

  console.log("Admin section component browser test passed");
  await context.close();
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}
