import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { resolveSectionPresetLayoutPatch } from "../visual-editor/src/platform/layout-engine/section-preset-resolver.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "prototype");
const migration = await fs.readFile(
  path.join(root, "db/migrations/063_registry_hero_layout_candidate_sync.sql"),
  "utf8",
);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".woff2": "font/woff2",
};

const section = {
  sectionKey: "hero",
  name: "Hero",
  items: [
    { itemKey: "title", sourceItemKey: "title", name: "Title", fieldKind: "text", textType: "title", isRequired: true },
    { itemKey: "description", sourceItemKey: "description", name: "Description", fieldKind: "text", textType: "description", isRequired: true },
    { itemKey: "primaryAction", sourceItemKey: "primaryAction", name: "Primary Action", fieldKind: "cta", isRequired: false },
  ],
};

function layoutSnapshot(layoutKey) {
  const offset = migration.indexOf(`'${layoutKey}'`);
  assert.notEqual(offset, -1, `${layoutKey} migration row must exist`);
  const match = migration.slice(offset, offset + 7000).match(/'(\{"contractVersion":1[^\n]+\})',\s*\n\s*'\{/u);
  assert.ok(match, `${layoutKey} layoutSnapshot must be readable`);
  return JSON.parse(match[1]);
}

function heroSnapshot(layoutKey) {
  const layoutPatch = resolveSectionPresetLayoutPatch(section, {
    layoutKey,
    layoutSnapshot: layoutSnapshot(layoutKey),
  });
  assert.ok(layoutPatch, `${layoutKey} must resolve into a runtime layout patch`);
  return {
    snapshotVersion: 1,
    renderer: { key: "default-promo-renderer", version: 1 },
    content: {
      contractVersion: 1,
      formTemplate: { id: "hero-layout-test", name: layoutKey, designTokens: { values: {} } },
      sectionSnapshot: [{ ...section, selectedLayoutKey: layoutKey }],
      sectionInputs: {
        hero: {
          title: "A DISTINCT HERO LAYOUT",
          description: "Each candidate must retain its own responsive geometry.",
          primaryAction: { label: "View offer", link: "#", target: "_self" },
        },
      },
      sectionOrder: ["hero"],
    },
    designSpec: {
      contractVersion: 2,
      theme: {},
      responsive: { mobileBreakpoint: 720 },
      sectionStyles: layoutPatch.sectionStyles,
      itemStyles: layoutPatch.itemStyles,
      visibility: { items: layoutPatch.visibility.items, fields: {} },
      responsiveLayouts: layoutPatch.responsiveLayouts,
    },
    assets: { contractVersion: 1, items: {}, requests: [] },
    motionSpec: { sections: {}, items: {} },
  };
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const relative = url.pathname.startsWith("/prototype/")
    ? url.pathname.slice("/prototype/".length)
    : url.pathname.replace(/^\/+/, "");
  const file = path.join(publicRoot, relative || "visual-output.html");
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

async function renderedGeometry(layoutKey, width) {
  const page = await browser.newPage({ viewport: { width, height: 760 } });
  await page.addInitScript((snapshot) => {
    localStorage.setItem("promoVisualEditor.snapshot.v1", JSON.stringify(snapshot));
  }, heroSnapshot(layoutKey));
  await page.goto(`${origin}/prototype/visual-output.html`, { waitUntil: "networkidle" });
  await page.getByText("A DISTINCT HERO LAYOUT", { exact: true }).waitFor();
  const result = {};
  for (const itemKey of ["title", "description", "primaryAction"]) {
    result[itemKey] = await page.locator(`[data-style-key="hero.${itemKey}"]`).evaluate((element) => ({
      left: element.style.left,
      width: element.style.width,
      textAlign: element.style.textAlign,
    }));
  }
  await page.close();
  return result;
}

try {
  const desktop = {
    left: await renderedGeometry("hero_left_balanced", 1200),
    center: await renderedGeometry("hero_center_wide", 1200),
    right: await renderedGeometry("hero_right_balanced", 1200),
  };
  assert.deepEqual(desktop.left.title, { left: "8%", width: "58%", textAlign: "" });
  assert.deepEqual(desktop.center.title, { left: "12%", width: "76%", textAlign: "center" });
  assert.deepEqual(desktop.right.title, { left: "42%", width: "50%", textAlign: "right" });
  assert.equal(desktop.left.primaryAction.left, "8%");
  assert.equal(desktop.center.primaryAction.left, "38%");
  assert.equal(desktop.right.primaryAction.left, "68%");
  assert.equal(new Set(Object.values(desktop).map((layout) => JSON.stringify(layout))).size, 3);

  const mobile = {
    left: await renderedGeometry("hero_left_balanced", 390),
    center: await renderedGeometry("hero_center_wide", 390),
    right: await renderedGeometry("hero_right_balanced", 390),
  };
  assert.deepEqual(mobile.left.title, { left: "5%", width: "90%", textAlign: "" });
  assert.deepEqual(mobile.center.title, { left: "5%", width: "90%", textAlign: "center" });
  assert.deepEqual(mobile.right.title, { left: "5%", width: "90%", textAlign: "right" });
  assert.equal(new Set(Object.values(mobile).map((layout) => layout.title.textAlign)).size, 3);

  console.log("Registry Hero layout visual browser test passed");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
