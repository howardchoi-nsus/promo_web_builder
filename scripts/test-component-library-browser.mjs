import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number(process.env.COMPONENT_LIBRARY_TEST_PORT || 4186);
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
      const response = await fetch(`${origin}/prototype/visual-editor.html`);
      if (response.ok) return;
    } catch {
      // Fixture server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Fixture server did not start within ${timeoutMs}ms.\n${serverOutput}`);
}

const components = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    componentKey: "cmp_11111111111111111111111111111111",
    name: "Brand Logo",
    description: "Header brand mark",
    status: "active",
    libraryPresentation: {
      category: "media",
      iconKey: "logo",
      keywords: ["brand", "header"],
      displayOrder: 10,
    },
    activeVersion: {
      id: "20000000-0000-4000-8000-000000000001",
      version: 1,
      status: "active",
      fieldKind: "image",
      fields: [],
    },
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    componentKey: "cmp_22222222222222222222222222222222",
    name: "Hero Heading",
    description: "Primary heading",
    status: "active",
    libraryPresentation: {
      category: "text",
      iconKey: "heading",
      keywords: ["headline"],
      displayOrder: 20,
    },
    activeVersion: {
      id: "20000000-0000-4000-8000-000000000002",
      version: 1,
      status: "active",
      fieldKind: "text",
      textType: "title",
      fields: [],
    },
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    componentKey: "cmp_33333333333333333333333333333333",
    name: "Unknown Icon CTA",
    description: "Fallback icon case",
    status: "active",
    libraryPresentation: {
      category: "action",
      iconKey: "removed-icon",
      keywords: [],
      displayOrder: 30,
    },
    activeVersion: {
      id: "20000000-0000-4000-8000-000000000003",
      version: 1,
      status: "active",
      fieldKind: "cta",
      fields: [],
    },
  },
];

await waitForServer();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const pageErrors = [];
const consoleErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});

try {
  await page.route("**/api/item-components", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ ok: true, components }),
  }));
  await page.route("**/api/wizard-content-sections?scope=public", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ ok: true, sections: [] }),
  }));

  await page.goto(
    `${origin}/prototype/visual-editor.html?mode=admin-layout&templateId=visual-editor-preview-template`,
    { waitUntil: "networkidle" },
  );
  const componentTab = page.getByRole("tab", { name: "컴포넌트", exact: true });
  if (!await componentTab.count()) {
    throw new Error(`Component tab did not render. Page text:\n${(await page.locator("body").innerText()).slice(0, 2000)}`);
  }
  await componentTab.click();
  await page.getByLabel("컴포넌트 검색").waitFor();

  const cards = page.locator(".component-library-card");
  assert.equal(await cards.count(), 3, "All active Component definitions should render");
  assert.equal(await cards.nth(0).getByText("Brand Logo", { exact: true }).count(), 1);
  assert.equal(await cards.nth(0).locator(".component-library-icon").count(), 1);
  assert.equal(await page.locator(".component-library-panel__categories button").count(), 6);

  await page.getByRole("button", { name: "Media", exact: true }).click();
  assert.equal(await cards.count(), 1, "Category filter should limit the grid");
  assert.equal(await cards.getByText("Brand Logo", { exact: true }).count(), 1);

  await page.getByRole("button", { name: "전체", exact: true }).click();
  await page.getByLabel("컴포넌트 검색").fill("headline");
  assert.equal(await cards.count(), 1, "Keyword metadata should participate in search");
  assert.equal(await cards.getByText("Hero Heading", { exact: true }).count(), 1);

  await page.getByLabel("컴포넌트 검색").fill("");
  const dragPayload = await cards.filter({ hasText: "Brand Logo" }).evaluate((card) => {
    const dataTransfer = new DataTransfer();
    card.dispatchEvent(new DragEvent("dragstart", { bubbles: true, dataTransfer }));
    return {
      custom: dataTransfer.getData("application/x-promo-component-definition"),
      plain: dataTransfer.getData("text/plain"),
    };
  });
  assert.deepEqual(JSON.parse(dragPayload.custom), {
    componentKey: "cmp_11111111111111111111111111111111",
  });
  assert.equal(dragPayload.plain, "cmp_11111111111111111111111111111111");

  await page.getByRole("tab", { name: "페이지 구조", exact: true }).click();
  const firstTreeSection = page.locator(".page-tree__section").first();
  const beforeDropCount = await firstTreeSection.locator(".page-tree__component").count();
  await componentTab.click();
  const dropEvidence = await page.evaluate(() => {
    const card = [...document.querySelectorAll(".component-library-card")]
      .find((node) => node.textContent.includes("Brand Logo"));
    const target = document.querySelector('.preview-stage [data-section-key="heroBanner"]');
    if (!card || !target) throw new Error("Drag source or target was not rendered");
    const dataTransfer = new DataTransfer();
    card.dispatchEvent(new DragEvent("dragstart", { bubbles: true, dataTransfer }));
    const dragOverAllowed = !target.dispatchEvent(new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer }));
    const dropHandled = !target.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }));
    return {
      dragOverAllowed,
      dropHandled,
      sectionKey: target.getAttribute("data-section-key"),
      custom: dataTransfer.getData("application/x-promo-component-definition"),
    };
  });
  await page.waitForTimeout(100);
  await page.getByRole("tab", { name: "페이지 구조", exact: true }).click();
  const droppedNameCount = await firstTreeSection.getByText("Brand Logo", { exact: true }).count();
  assert.equal(droppedNameCount, 1, `Live Preview Drop was not committed: ${JSON.stringify({
    dropEvidence,
    pageErrors,
    consoleErrors,
    status: await page.locator('[role="status"]').allTextContents(),
  })}`);
  assert.equal(
    await firstTreeSection.locator(".page-tree__component").count(),
    beforeDropCount + 1,
    "Dropping a Library card on Live Preview should create one Component instance",
  );
  assert.deepEqual(pageErrors, []);
  assert.deepEqual(consoleErrors, []);
  console.log("Component Library browser test passed");
} finally {
  await browser.close();
  server.kill();
}
