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
const snapshot = {
  snapshotVersion: 1,
  renderer: { key: "default-promo-renderer", version: 1 },
  content: {
    contractVersion: 1,
    formTemplate: { id: "template", name: "Responsive Header", designTokens: { values: {} } },
    sectionSnapshot: [{
      sectionKey: "header",
      name: "Header",
      isVisibleInWizard: true,
      items: [
        { itemKey: "logo", name: "Logo", fieldKind: "text", textType: "remark", isRequired: true },
        { itemKey: "badges", name: "Badges", fieldKind: "text", textType: "remark", isRequired: false },
      ],
    }],
    sectionInputs: { header: { logo: "LOGO", badges: "BADGES" } },
    sectionOrder: ["header"],
  },
  designSpec: {
    contractVersion: 2,
    theme: {},
    responsive: { mobileBreakpoint: 720 },
    sectionStyles: { header: { minHeight: 100 } },
    itemStyles: {
      "header.logo": { positionMode: "free", xPct: 0, yPx: 10, widthPct: 20, heightPx: 40 },
      "header.badges": { positionMode: "free", xPct: 80, yPx: 10, widthPct: 20, heightPx: 40 },
    },
    visibility: { items: { "header.badges": true }, fields: {} },
    responsiveLayouts: {
      mobile: {
        itemStyles: {
          "header.logo": { positionMode: "free", xPct: 20, yPx: 8, widthPct: 60, heightPx: 36 },
          "header.badges": { positionMode: "free", xPct: 70, yPx: 8, widthPct: 25, heightPx: 30 },
        },
        visibility: { items: { "header.badges": false } },
      },
    },
  },
  assets: { contractVersion: 1, items: {}, requests: [] },
  motionSpec: { sections: {}, items: {} },
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
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
  await page.addInitScript((value) => {
    localStorage.setItem("promoVisualEditor.snapshot.v1", JSON.stringify(value));
  }, snapshot);
  await page.goto(`${origin}/prototype/visual-output.html`, { waitUntil: "networkidle" });
  await page.getByText("LOGO", { exact: true }).waitFor();
  return page;
}

try {
  const desktop = await outputPage(1000);
  assert.equal(
    await desktop.locator('[data-style-key="header.logo"]').evaluate((element) => element.style.left),
    "0%",
  );
  assert.equal(await desktop.getByText("BADGES", { exact: true }).count(), 1);
  await desktop.close();

  const mobile = await outputPage(390);
  assert.equal(
    await mobile.locator('[data-style-key="header.logo"]').evaluate((element) => element.style.left),
    "20%",
  );
  assert.equal(await mobile.getByText("BADGES", { exact: true }).count(), 0);
  await mobile.close();
  console.log("Section layout responsive output browser test passed");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

