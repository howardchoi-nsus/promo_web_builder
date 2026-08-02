import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};
const sectionId = "22222222-2222-4222-8222-222222222222";
const layoutId = "33333333-3333-4333-8333-333333333333";
let savedBody = null;
let sectionStatus = "draft";

const layoutSnapshot = {
  contractVersion: 1,
  layoutMode: "free",
  sectionStyle: { minHeight: 180, backgroundColor: "#0B0D12" },
  viewports: {
    desktop: {
      items: {
        logo: { positionMode: "free", xPct: 4, yPx: 16, widthPct: 30, heightPx: 48, zIndex: 1 },
        badges: { positionMode: "free", xPct: 66, yPx: 16, widthPct: 30, heightPx: 48, zIndex: 1 },
      },
      visibility: { items: {} },
    },
    mobile: {
      items: {
        logo: { positionMode: "free", xPct: 5, yPx: 12, widthPct: 40, heightPx: 42, zIndex: 1 },
        badges: { positionMode: "free", xPct: 55, yPx: 12, widthPct: 40, heightPx: 42, zIndex: 1 },
      },
      visibility: { items: { badges: false } },
    },
  },
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  if (url.pathname === "/api/wizard-content-section") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      section: { id: sectionId, sectionKey: "header", name: "Header", status: sectionStatus, version: 2 },
      items: [
        { id: "1", itemKey: "logo", name: "Logo", fieldKind: "text", textType: "title", defaultValue: "Logo", isVisibleInWizard: true, isRequired: false },
        { id: "2", itemKey: "badges", name: "Badges", fieldKind: "text", textType: "title", defaultValue: "Badges", isVisibleInWizard: true, isRequired: false },
      ],
    }));
    return;
  }
  if (url.pathname === "/api/design-token-sets") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, tokenSets: [] }));
    return;
  }
  if (url.pathname === "/api/wizard-content-section-layouts") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      layouts: [{
        id: layoutId,
        sectionId,
        layoutKey: "standard-header",
        name: "Standard Header",
        description: "Logo and badges",
        isDefault: true,
        layoutSnapshot: savedBody?.layoutSnapshot || layoutSnapshot,
      }],
    }));
    return;
  }
  if (url.pathname === "/api/wizard-content-section-layout" && request.method === "PATCH") {
    let raw = "";
    for await (const chunk of request) raw += chunk;
    savedBody = JSON.parse(raw);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      layout: {
        id: layoutId,
        sectionId,
        layoutKey: "standard-header",
        name: savedBody.name,
        description: savedBody.description,
        isDefault: true,
        layoutSnapshot: savedBody.layoutSnapshot,
      },
    }));
    return;
  }
  const relative = url.pathname.startsWith("/prototype/")
    ? url.pathname.slice("/prototype/".length)
    : url.pathname.replace(/^\/+/, "");
  const file = path.join(root, "prototype", relative || "visual-editor.html");
  try {
    const data = await fs.readFile(file);
    response.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));

try {
  await page.goto(
    `${origin}/prototype/visual-editor.html?mode=section-preset&sectionId=${sectionId}&layoutKey=standard-header`,
    { waitUntil: "networkidle" },
  );
  await page.locator(".editor-workspace.is-section-preset-workspace").waitFor();
  assert.equal(await page.locator(".rendered-item").count(), 2);
  await page.getByRole("button", { name: "Mobile" }).click();
  await page.locator(".property-panel .component-property-trigger").filter({ hasText: "Badges" }).click();
  const visibility = page.getByRole("switch", { name: "Badges 노출" });
  assert.equal(await visibility.isChecked(), false);
  await visibility.locator("..").click();
  assert.equal(await visibility.isChecked(), true);
  await page.getByRole("button", { name: "Preset 저장", exact: true }).click();
  await page.getByText("Standard Header Layout Preset을 저장했습니다.").waitFor();
  assert(savedBody);
  assert.equal(savedBody.layoutSnapshot.viewports.mobile.visibility.items.badges, true);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Mobile" }).click();
  await page.locator(".property-panel .component-property-trigger").filter({ hasText: "Badges" }).click();
  assert.equal(await page.getByRole("switch", { name: "Badges 노출" }).isChecked(), true);
  sectionStatus = "active";
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.getByRole("button", { name: "Preset 저장", exact: true }).isDisabled(), true);
  assert.deepEqual(pageErrors, []);
  console.log("Section layout preset editor browser test passed");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
