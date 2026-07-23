import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number(process.env.ADMIN_COMPONENT_TEST_PORT || 4182);
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["scripts/serve-visual-editor-preview.js"], {
  cwd: process.cwd(), env: { ...process.env, PORT: String(port), USE_FIXTURE: "1" }, stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
server.stdout.on("data", (chunk) => { output += chunk; });
server.stderr.on("data", (chunk) => { output += chunk; });
async function waitForServer() {
  for (let count = 0; count < 100; count += 1) {
    try { if ((await fetch(`${origin}/prototype/index.html`)).ok) return; } catch { /* starting */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(output);
}

const tokenVersionId = "77777777-7777-4777-8777-777777777777";
const template = { id: "11111111-1111-4111-8111-111111111111", templateKey: "default", name: "Default", status: "draft", version: 1, designTokenSetVersionId: tokenVersionId };
const sectionA = { id: "22222222-2222-4222-8222-222222222222", sectionKey: "promotionIntro", name: "Promotion Intro", status: "draft", version: 2, aiDesign: { enabled: true } };
const sectionB = { id: "33333333-3333-4333-8333-333333333333", sectionKey: "benefits", name: "Benefits", status: "active", version: 1, aiDesign: { enabled: true } };
const membership = { id: "44444444-4444-4444-8444-444444444444", formTemplateId: template.id, sectionId: sectionA.id, sectionKey: sectionA.sectionKey, sectionName: sectionA.name, sectionVersion: 1, isVisible: true, isRequired: true, userReorderAllowed: true };
const activeComponentVersionId = "66666666-6666-4666-8666-666666666666";
const component = {
  id: "55555555-5555-4555-8555-555555555555",
  componentKey: "cmp_1234567890abcdef1234567890abcdef",
  name: "Hero Title",
  status: "active",
  versionId: "88888888-8888-4888-8888-888888888888",
  version: 2,
  versionStatus: "draft",
  fieldKind: "text",
  textType: "multi",
  activeVersion: {
    id: activeComponentVersionId,
    version: 1,
    status: "active",
    fieldKind: "text",
    textType: "title",
  },
};

let browser;
let addBody;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.route("https://unpkg.com/vue@3/dist/vue.global.prod.js", (route) => route.fulfill({ status: 200, contentType: "text/javascript", body: fs.readFileSync(path.resolve("node_modules/vue/dist/vue.global.prod.js"), "utf8") }));
  await page.route("**/api/**", (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const reply = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (url.pathname === "/api/locale-snapshot") return reply({ ok: true, locale: "ko", defaultLocale: "ko", messages: {}, defaultMessages: {} });
    if (url.pathname === "/api/item-components") return reply({ ok: true, components: [component] });
    if (url.pathname === "/api/design-token-sets") return reply({ ok: true, tokenSets: [{ id: "set", name: "Rounded", versionId: tokenVersionId, version: 1, versionStatus: "active" }] });
    if (url.pathname === "/api/wizard-form-templates") return reply({ ok: true, templates: [template] });
    if (url.pathname === "/api/wizard-form-template") return reply({ ok: true, template, sections: [membership] });
    if (url.pathname === "/api/wizard-form-template-sections" && request.method() === "POST") {
      addBody = request.postDataJSON();
      return reply({ ok: true, section: { ...membership, id: "new-membership", sectionId: sectionB.id, sectionKey: sectionB.sectionKey } }, 201);
    }
    if (url.pathname === "/api/wizard-content-sections") return reply({ ok: true, sections: [sectionA, sectionB] });
    if (url.pathname === "/api/wizard-content-section") return reply({ ok: true, section: sectionA, items: [], histories: [] });
    if (url.pathname === "/api/wizard-content-section-usage") return reply({ ok: true, templates: [template] });
    if (url.pathname === "/api/wizard-form-template-layout") return reply({ ok: true, layout: { id: "layout", layoutRevision: 1, layoutSpec: { theme: {}, responsive: {}, itemStyles: {}, sectionStyles: {} }, validationResult: { ok: true, errors: [] } } });
    return reply({ ok: true, templates: [], sections: [], logs: [], settings: [] });
  });

  await page.goto(`${origin}/prototype/index.html?view=admin&tab=components`, { waitUntil: "networkidle" });
  await page.getByText("Hero Title", { exact: true }).first().waitFor({ state: "visible" });
  assert.equal(await page.getByText(`자동 생성 Key: ${component.componentKey}`, { exact: true }).count(), 1);
  await page.getByRole("tab", { name: "템플릿·레이아웃 관리" }).click();
  await page.getByRole("button", { name: "+ 아이템 추가" }).click();
  const activeComponentOption = page.locator(`select option[value="${activeComponentVersionId}"]`);
  assert.equal(await activeComponentOption.count(), 1);
  assert.match(await activeComponentOption.textContent(), /Hero Title.*v1/);
  await page.locator(".template-section-add button").click();
  const select = page.locator(".template-section-create select");
  await select.selectOption(sectionB.id);
  await page.locator(".template-section-create .action-row button").click();
  await page.waitForTimeout(50);
  assert.deepEqual(addBody, { templateId: template.id, sectionId: sectionB.id });
  assert.deepEqual(pageErrors, []);
  console.log("Admin item component and section composition browser test passed");
  await context.close();
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}
