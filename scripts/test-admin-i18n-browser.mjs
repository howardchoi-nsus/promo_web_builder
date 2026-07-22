import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number(process.env.ADMIN_I18N_TEST_PORT || 4181);
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

const locales = [
  { code: "ko", label: "한국어", isDefault: true, enabled: true, snapshotRevision: 2 },
  { code: "en", label: "English", isDefault: false, enabled: true, snapshotRevision: 1 },
];
let draftValue = "저장 수정본";
const activeMessage = {
  id: "00000000-0000-4000-8000-000000000001", locale: "ko", messageKey: "common.action.save",
  namespace: "common", value: "저장", status: "active", version: 1, changedBy: "seed", updatedAt: "2026-07-22T00:00:00.000Z",
};
const draftMessage = {
  ...activeMessage, id: "00000000-0000-4000-8000-000000000002", value: draftValue,
  status: "draft", version: 2, changedBy: "admin", updatedAt: "2026-07-22T01:00:00.000Z",
};

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const failedResponses = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("response", (response) => { if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`); });

  const vuePath = path.resolve("node_modules/vue/dist/vue.global.prod.js");
  await page.route("https://unpkg.com/vue@3/dist/vue.global.prod.js", (route) => route.fulfill({
    status: 200, contentType: "text/javascript", body: fs.readFileSync(vuePath, "utf8"),
  }));
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;
    const fulfill = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (pathname === "/api/locales") return fulfill({ ok: true, locales });
    if (pathname === "/api/locale-snapshot") return fulfill({ ok: true, locale: url.searchParams.get("locale") || "ko", defaultLocale: "ko", revision: 2, messages: { "common.action.save": "저장" }, defaultMessages: {} });
    if (pathname === "/api/locale-messages") return fulfill({ ok: true, locale: "ko", messages: [{ ...activeMessage }, { ...draftMessage, value: draftValue }] });
    if (pathname === "/api/locale-message-history") return fulfill({ ok: true, locale: "ko", messageKey: activeMessage.messageKey, versions: [{ ...draftMessage, value: draftValue }, activeMessage] });
    if (pathname === "/api/locale-message" && request.method() === "POST") {
      draftValue = request.postDataJSON().value;
      return fulfill({ ok: true, message: { ...draftMessage, value: draftValue } });
    }
    if (pathname === "/api/promo-generation-worker-settings") return fulfill({ ok: true, settings: [] });
    if (pathname === "/api/prompt-templates") return fulfill({ ok: true, templates: [] });
    if (pathname === "/api/wizard-form-templates") return fulfill({ ok: true, templates: [] });
    if (pathname === "/api/wizard-section-audit-logs") return fulfill({ ok: true, logs: [] });
    return fulfill({ ok: true, templates: [], sections: [], documents: [], logs: [], settings: [] });
  });

  await page.goto(`${origin}/prototype/index.html?view=admin&tab=i18n`, { waitUntil: "networkidle" });
  await page.locator(".locale-manager").waitFor({ state: "visible" });
  await page.getByText("common.action.save", { exact: true }).click();
  const editor = page.locator(".locale-message-editor textarea");
  await assert.doesNotReject(() => editor.waitFor({ state: "visible" }));
  await editor.fill("저장 브라우저 테스트");
  await page.locator(".locale-message-editor .app-actions button").first().click();
  await page.waitForFunction(() => document.querySelector(".shell-status")?.textContent?.includes("초안"));

  assert.equal(draftValue, "저장 브라우저 테스트");
  await page.locator(".locale-toolbar select").first().selectOption("en");
  await assert.doesNotReject(() => page.locator(".locale-manager-grid > .empty-state").waitFor({ state: "visible" }));
  assert.equal(await page.locator(".locale-message-editor").count(), 0, "Changing locale must clear the previous locale editor selection");
  await page.getByRole("button", { name: "현재 화면에 적용" }).click();
  await page.waitForFunction(() => document.documentElement.lang === "en");
  assert.equal(await page.getByRole("button", { name: "Apply to current screen" }).count(), 1);
  assert.deepEqual(pageErrors, [], `Page errors:\n${pageErrors.join("\n")}`);
  assert.deepEqual(consoleErrors, [], `Console errors:\n${consoleErrors.join("\n")}`);
  assert.deepEqual(failedResponses, [], `Failed responses:\n${failedResponses.join("\n")}`);
  console.log("Admin i18n browser test passed");
  await context.close();
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}
