import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number(process.env.ADMIN_DESIGN_TOKEN_TEST_PORT || 4186);
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["scripts/serve-visual-editor-preview.js"], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(port), USE_FIXTURE: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
server.stdout.on("data", (chunk) => { output += chunk.toString(); });
server.stderr.on("data", (chunk) => { output += chunk.toString(); });

async function waitForServer() {
  for (let count = 0; count < 100; count += 1) {
    try {
      if ((await fetch(`${origin}/prototype/index.html`)).ok) return;
    } catch { /* starting */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(output);
}

const setId = "00000000-0000-4000-8000-000000000010";
const versionId = "00000000-0000-4000-8000-000000000011";
const activeVersionId = "00000000-0000-4000-8000-000000000012";
const templateId = "00000000-0000-4000-8000-000000000020";
const definitions = [
  { tokenKey: "--promo-surface", category: "color", valueType: "color", semanticRole: "surface-color", cssProperty: "background-color", required: true, aiSelectable: true, editable: true },
  { tokenKey: "--promo-text", category: "color", valueType: "color", semanticRole: "text-color", cssProperty: "color", required: true, aiSelectable: true, editable: true },
  { tokenKey: "--promo-accent", category: "color", valueType: "color", semanticRole: "accent-color", cssProperty: "background-color", required: true, aiSelectable: true, editable: true },
];
const values = [
  { ...definitions[0], value: "#F8FAFC", metadata: {} },
  { ...definitions[1], value: "#111827", metadata: {} },
  { ...definitions[2], value: "#6D5DFB", metadata: {} },
];
const tokenSet = {
  id: setId,
  setKey: "rounded-style",
  name: "Rounded Style",
  description: "Rounded promotion style",
  status: "active",
  versionId,
  version: 2,
  versionStatus: "draft",
  activeVersion: { id: activeVersionId, version: 1, status: "active" },
  draftVersion: { id: versionId, version: 2, status: "draft" },
  versions: [
    { id: versionId, version: 2, status: "draft" },
    { id: activeVersionId, version: 1, status: "active" },
  ],
  usage: { templateCount: 0, activeTemplateCount: 0 },
};
let savedTokens = null;
let savedTemplateIds = [];
let browser;

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const fulfill = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (url.pathname === "/api/design-token-sets") return fulfill({ ok: true, tokenSets: [tokenSet] });
    if (url.pathname === "/api/design-token-catalog-import") return fulfill({ ok: true, definitions });
    if (url.pathname === "/api/design-token-set") {
      return fulfill({
        ok: true,
        tokenSet: { ...tokenSet, tokenSetId: setId, id: versionId, status: "draft", values },
        usage: { templates: [], aiRuns: { total: 0, active: 0 } },
        histories: [],
      });
    }
    if (url.pathname === "/api/design-token-set-publish" && request.method() === "POST") {
      const body = request.postDataJSON();
      savedTokens = body.tokens;
      savedTemplateIds = body.templateIds;
      return fulfill({
        ok: true,
        tokenVersion: { ...tokenSet, tokenSetId: setId, id: versionId, status: "active", values: savedTokens },
        templates: [],
      });
    }
    if (url.pathname === "/api/design-token-set-import" && request.method() === "POST") {
      return fulfill({
        ok: true,
        dryRun: true,
        tokenCount: values.length,
        tokens: values.map((item) => (
          item.tokenKey === "--promo-accent" ? { ...item, value: "#123456" } : item
        )),
        errors: [],
      });
    }
    if (url.pathname === "/api/wizard-form-templates") {
      return fulfill({
        ok: true,
        templates: [{
          id: templateId,
          templateKey: "default",
          name: "Default Template",
          version: 1,
          status: "active",
        }],
      });
    }
    if (url.pathname === "/api/locale-snapshot") return fulfill({ ok: true, locale: "ko", defaultLocale: "ko", revision: 1, messages: {}, defaultMessages: {} });
    if (url.pathname === "/api/promo-generation-worker-settings") return fulfill({ ok: true, settings: [] });
    if (url.pathname === "/api/prompt-templates") return fulfill({ ok: true, templates: [] });
    if (url.pathname === "/api/wizard-section-audit-logs") return fulfill({ ok: true, logs: [] });
    return fulfill({ ok: true, templates: [], sections: [], documents: [], logs: [], settings: [] });
  });

  await page.goto(`${origin}/prototype/index.html?view=admin&tab=design-tokens`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "디자인 토큰 관리" }).waitFor();
  await page.getByText("Rounded Style", { exact: true }).first().waitFor();
  const accentInput = page.locator(".design-token-value").filter({ hasText: "--promo-accent" }).locator('input[type="text"]');
  await page.locator('.file-button input[type="file"]').setInputFiles({
    name: "rounded-style.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("token,value\n--promo-accent,#123456", "utf8"),
  });
  await assert.doesNotReject(() => accentInput.waitFor());
  assert.equal(await accentInput.inputValue(), "#123456");
  await accentInput.fill("#FF0000");
  await page.locator(".sticky-actions").getByRole("button", { name: "저장", exact: true }).click();
  await page.waitForFunction(() => document.querySelector(".shell-status")?.textContent?.includes("저장"));

  assert.equal(savedTokens.find((token) => token.tokenKey === "--promo-accent").value, "#FF0000");
  assert.deepEqual(savedTemplateIds, []);

  await accentInput.fill("#00AA00");
  await page.locator(".template-choice").filter({ hasText: "Default Template" }).locator('input[type="checkbox"]').check();
  await page.locator(".sticky-actions").getByRole("button", { name: "저장 및 적용", exact: true }).click();
  await page.waitForFunction(() => document.querySelector(".shell-status")?.textContent?.includes("적용"));
  assert.equal(savedTokens.find((token) => token.tokenKey === "--promo-accent").value, "#00AA00");
  assert.deepEqual(savedTemplateIds, [templateId]);
  assert.equal(await page.locator(".design-token-grid").count(), 1);
  assert.equal(await page.locator(".promo-renderer").count(), 1);
  assert.deepEqual(pageErrors, [], pageErrors.join("\n"));
  assert.deepEqual(consoleErrors, [], consoleErrors.join("\n"));
  console.log("Admin design token browser test passed");
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}
