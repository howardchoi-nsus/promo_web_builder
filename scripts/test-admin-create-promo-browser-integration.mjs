import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number(process.env.ADMIN_CREATE_PROMO_TEST_PORT || 4179);
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
      const response = await fetch(`${origin}/create-promo.html`);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Fixture server did not start within ${timeoutMs}ms.\n${serverOutput}`);
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const layoutResponse = await page.request.get(`${origin}/api/wizard-form-template-layout?templateId=visual-editor-preview-template`);
  assert.equal(layoutResponse.ok(), true, "Admin layout fixture should load");
  const current = await layoutResponse.json();
  const adminLayout = {
    ...current.layout.layoutSpec,
    sectionStyles: {
      ...current.layout.layoutSpec.sectionStyles,
      heroBanner: {
        minHeight: 620,
        backgroundColor: "#dbeafe",
        backgroundPosition: "left center",
      },
    },
  };
  const saveResponse = await page.request.patch(`${origin}/api/wizard-form-template-layout`, {
    data: {
      templateId: "visual-editor-preview-template",
      expectedRevision: current.layout.layoutRevision,
      layoutSpec: adminLayout,
    },
  });
  assert.equal(saveResponse.ok(), true, "Admin layout save should succeed");
  assert.equal((await saveResponse.json()).layout.layoutRevision, 2);

  await page.goto(`${origin}/create-promo.html`, { waitUntil: "networkidle" });
  await page.locator('[data-step="2"]').click();
  await page.locator('[data-field-key="title"] input').fill("Admin Layout Integration");
  await page.locator('[data-field-key="promotionPurpose"] select').selectOption("이벤트");
  await page.locator('[data-field-key="market"] input').fill("KR");
  await page.locator('[data-field-key="audience"] select').selectOption("신규");
  await page.locator('[data-field-key="campaignTone"] select').selectOption("활기찬");
  await page.locator("#next-step").click();
  await page.locator('.wizard-template-tile[aria-pressed="true"]').waitFor();
  await page.locator("#next-step").click();

  const editorFrame = page.frameLocator("iframe.wizard-layout-frame");
  await editorFrame.locator(".editor-workspace.is-create-promo-wizard").waitFor({ timeout: 10_000 });
  const outputPagePromise = context.waitForEvent("page");
  await page.locator("#next-step").click();
  const outputPage = await outputPagePromise;
  await outputPage.locator(".promo-renderer").waitFor({ timeout: 10_000 });
  await outputPage.close();

  const snapshot = await page.evaluate(() => JSON.parse(localStorage.getItem("promoVisualEditor.snapshot.v1") || "null"));
  assert.equal(snapshot?.layoutRevision, 2);
  assert.equal(snapshot?.designSpec?.sectionStyles?.heroBanner?.minHeight, 620);
  assert.equal(snapshot?.designSpec?.sectionStyles?.heroBanner?.backgroundColor, "#dbeafe");
  assert.equal(snapshot?.designSpec?.sectionStyles?.heroBanner?.backgroundPosition, "left center");
  assert.deepEqual(pageErrors, [], `Browser page errors:\n${pageErrors.join("\n")}`);

  await context.close();
  console.log("Admin layout to Create Promo browser integration test passed");
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}
