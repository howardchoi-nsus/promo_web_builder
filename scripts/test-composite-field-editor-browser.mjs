import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sectionId = "77777777-7777-4777-8777-777777777777";
const layoutSnapshot = {
  contractVersion: 1,
  layoutMode: "free",
  sectionStyle: { minHeight: 420 },
  content: {
    card: {
      fields: {
        image: { source: "url", value: "https://cdn.example.com/card.png", alt: "Card" },
        title: "Composite card title",
        cta: { label: "Learn more", url: "https://example.com", target: "_self" },
      },
    },
  },
  viewports: {
    desktop: { items: { card: { positionMode: "free", xPct: 20, yPx: 40, widthPct: 60, heightPx: 300 } }, visibility: { items: {} } },
    mobile: { items: { card: { positionMode: "free", xPct: 5, yPx: 24, widthPct: 90, heightPx: 320 } }, visibility: { items: {} } },
  },
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  if (url.pathname === "/api/wizard-content-section") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      section: { id: sectionId, sectionKey: "feature", name: "Feature", status: "draft", version: 1 },
      items: [{
        id: "card-item",
        itemKey: "card",
        name: "Promotion Card",
        fieldKind: "text",
        isVisibleInWizard: true,
        fields: [
          { fieldKey: "image", name: "Card Image", fieldKind: "image", image: { aspectRatio: "4:3" } },
          { fieldKey: "title", name: "Card Title", fieldKind: "text", textType: "title" },
          { fieldKey: "cta", name: "Card CTA", fieldKind: "cta" },
        ],
      }],
    }));
    return;
  }
  if (url.pathname === "/api/wizard-content-section-layouts") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, layouts: [{
      id: "layout-card",
      sectionId,
      layoutKey: "card-layout",
      name: "Card Layout",
      isDefault: true,
      layoutSnapshot,
    }] }));
    return;
  }
  if (url.pathname === "/api/design-token-sets") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, tokenSets: [] }));
    return;
  }
  const relative = url.pathname.startsWith("/prototype/")
    ? url.pathname.slice("/prototype/".length)
    : url.pathname.replace(/^\/+/, "");
  const file = path.join(root, "prototype", relative || "visual-editor.html");
  try {
    const data = await fs.readFile(file);
    response.writeHead(200, { "Content-Type": path.extname(file) === ".css" ? "text/css" : path.extname(file) === ".js" ? "text/javascript" : "text/html" });
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
const consoleErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleErrors.push(message.text());
});

try {
  await page.goto(`${origin}/prototype/visual-editor.html?mode=section-preset&sectionId=${sectionId}&layoutKey=card-layout`, { waitUntil: "domcontentloaded" });
  await page.locator(".editor-workspace.is-section-preset-workspace").waitFor();
  const card = page.locator('[data-section-key="feature"] [data-item-key="card"]');
  if (!await card.count()) {
    throw new Error(`Composite card did not render. Page errors: ${JSON.stringify(pageErrors)}\nConsole: ${JSON.stringify(consoleErrors)}\nPreview HTML:\n${(await page.locator(".preview-stage").innerHTML()).slice(0, 5000)}\nPage text:\n${(await page.locator("body").innerText()).slice(0, 3000)}`);
  }
  const image = card.locator('[data-field-style-key="feature.card.image"]');
  const title = card.locator('[data-field-style-key="feature.card.title"]');
  const cta = card.locator('[data-field-style-key="feature.card.cta"]');

  await image.click();
  await page.locator(".component-inspector-popover").getByText("Card Image", { exact: true }).first().waitFor();
  await page.getByLabel("이미지 형태").selectOption("rounded");
  await page.waitForFunction(() => document.querySelector('[data-field-style-key="feature.card.image"] .rendered-component-image-frame')?.style.borderRadius.includes("promo-image-radius"));

  await title.click();
  await page.locator(".component-inspector-popover").getByText("Card Title", { exact: true }).first().waitFor();
  assert.equal(await image.evaluate((node) => node.classList.contains("is-selected-field")), false);
  assert.equal(await title.evaluate((node) => node.classList.contains("is-selected-field")), true);
  await page.getByRole("button", { name: "텍스트 박스 내부 중앙 정렬", exact: true }).click();
  assert.equal(await title.evaluate((node) => getComputedStyle(node).textAlign), "center");

  await cta.click();
  await page.locator(".component-inspector-popover").getByText("Card CTA", { exact: true }).first().waitFor();
  assert.equal(await title.evaluate((node) => node.classList.contains("is-selected-field")), false);
  assert.equal(await cta.evaluate((node) => node.classList.contains("is-selected-field")), true);
  assert.deepEqual(pageErrors, []);
  assert.equal(consoleErrors.some((message) => /ReferenceError|TypeError|Unhandled/i.test(message)), false);
  console.log("Composite field editor browser test passed");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
