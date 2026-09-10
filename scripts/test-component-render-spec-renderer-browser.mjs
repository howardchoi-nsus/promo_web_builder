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
  ".woff2": "font/woff2",
};
const fields = [
  { fieldKey: "fld_image", fieldKind: "image", name: "Product image", isRequired: true },
  { fieldKey: "fld_title", fieldKind: "text", textType: "title", name: "Title", isRequired: true },
  { fieldKey: "fld_cta", fieldKind: "cta", name: "CTA", isRequired: true },
];
const renderSpec = {
  contractVersion: 1,
  root: {
    nodeType: "element",
    tag: "article",
    layout: { display: "grid", columns: 2, gapToken: "--promo-space-4" },
    tokenBindings: { backgroundColor: "--promo-surface", color: "--promo-ink" },
    children: [
      { nodeType: "field", tag: "img", fieldKey: "fld_image" },
      {
        nodeType: "element",
        tag: "div",
        children: [
          { nodeType: "field", tag: "h2", fieldKey: "fld_title" },
          { nodeType: "field", tag: "a", fieldKey: "fld_cta" },
        ],
      },
    ],
  },
  responsive: { mobile: { "root.layout.columns": 1 } },
};
const snapshot = {
  snapshotVersion: 1,
  renderer: { key: "default-promo-renderer", version: 1 },
  content: {
    contractVersion: 1,
    formTemplate: {
      id: "template",
      name: "RenderSpec output",
      designTokens: { values: {
        "--promo-surface": "#f4f1ea",
        "--promo-ink": "#18212a",
        "--promo-space-4": "16px",
      } },
    },
    sectionSnapshot: [{
      sectionKey: "content",
      name: "Content",
      isVisibleInWizard: true,
      items: [{
        itemKey: "card",
        name: "Promotion card",
        fieldKind: "text",
        fields,
        renderSpec,
      }],
    }],
    sectionInputs: { content: { card: { fields: {
      fld_image: { value: "/api/product.png", alt: "Product" },
      fld_title: "September offer",
      fld_cta: { label: "View offer", link: "/offer", target: "_self" },
    } } } },
    sectionOrder: ["content"],
  },
  designSpec: {
    contractVersion: 1,
    theme: {},
    responsive: { mobileBreakpoint: 720, tabletBreakpoint: 1024, contentMaxWidth: 1280 },
    sectionStyles: { content: { minHeight: 500 } },
    itemStyles: { "content.card": { positionMode: "free", xPct: 5, yPx: 20, widthPct: 90 } },
    visibility: { items: {}, fields: {} },
    responsiveLayouts: { mobile: { itemStyles: {}, visibility: { items: {} } } },
  },
  assets: { contractVersion: 1, items: {} },
  motionSpec: { sections: {}, items: {} },
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  if (url.pathname.startsWith("/api/")) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  const relative = url.pathname.startsWith("/prototype/")
    ? url.pathname.slice("/prototype/".length)
    : url.pathname.replace(/^\/+/, "");
  const file = path.join(root, "prototype", relative || "visual-output.html");
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

async function outputPage(width) {
  const page = await browser.newPage({ viewport: { width, height: 700 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript((value) => {
    localStorage.setItem("promoVisualEditor.snapshot.v1", JSON.stringify(value));
  }, snapshot);
  await page.goto(`${origin}/prototype/visual-output.html`, { waitUntil: "domcontentloaded" });
  await page.getByText("September offer", { exact: true }).waitFor();
  assert.deepEqual(errors, []);
  return page;
}

try {
  const desktop = await outputPage(1280);
  const card = desktop.locator(".rendered-item article.render-spec-node");
  assert.equal(await card.count(), 1);
  assert.equal(await card.evaluate((element) => element.style.gridTemplateColumns), "repeat(2, minmax(0px, 1fr))");
  assert.equal(await card.evaluate((element) => getComputedStyle(element).gap), "16px");
  assert.equal(await card.evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(244, 241, 234)");
  assert.equal(await card.locator(":scope > img + div > h2").textContent(), "September offer");
  assert.equal(await card.locator(":scope > img + div > a").getAttribute("href"), "/offer");
  assert.equal(await card.locator("[data-render-path]").count(), 0, "Read-only output must not include editor decorations");
  await desktop.close();

  const mobile = await outputPage(390);
  const mobileCard = mobile.locator(".rendered-item article.render-spec-node");
  assert.equal(await mobileCard.evaluate((element) => element.style.gridTemplateColumns), "repeat(1, minmax(0px, 1fr))");
  assert.equal(await mobile.locator(".promo-renderer").evaluate((element) => element.scrollWidth <= element.clientWidth), true);
  await mobile.close();

  console.log("Shared Component RenderSpec browser output test passed");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
