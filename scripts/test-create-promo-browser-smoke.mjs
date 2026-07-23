import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number(process.env.CREATE_PROMO_SMOKE_PORT || 4178);
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
  let sectionAiRunRequest = null;
  let latestSectionAiRun = null;
  await page.route("**/api/promo-section-design-runs", async (route) => {
    sectionAiRunRequest = route.request().postDataJSON();
    const target = sectionAiRunRequest.targetType === "item" && sectionAiRunRequest.targetItemKey
      ? { type: "item", sectionKey: sectionAiRunRequest.sectionKey, itemKey: sectionAiRunRequest.targetItemKey }
      : { type: "section-background", sectionKey: sectionAiRunRequest.sectionKey };
    latestSectionAiRun = {
      id: `fixture-section-ai-run-${sectionAiRunRequest.sectionKey}`,
      status: "ready",
      inputHash: "fixture-hash",
      constraintsSnapshot: {
        imageTarget: target,
        imageTargetItemKeys: sectionAiRunRequest.targetItemKey ? [sectionAiRunRequest.targetItemKey] : [],
      },
      layoutResult: {
        layoutVariant: "split-left",
        layoutPatch: { sectionStyles: { [sectionAiRunRequest.sectionKey]: {} }, itemStyles: {} },
        imageRequest: {
          target,
          itemKey: sectionAiRunRequest.targetItemKey || null,
          prompt: "Fixture AI image",
          aspectRatio: "16:9",
          safeArea: "right-copy",
        },
      },
      imageResult: {
        target,
        proxyUrl: `/api/promo-section-design-image?runId=fixture-${sectionAiRunRequest.sectionKey}`,
      },
    };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        reused: true,
        run: latestSectionAiRun,
      }),
    });
  });
  await page.route("**/api/promo-section-design-apply", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, run: { ...latestSectionAiRun, status: "applied" } }),
    });
  });
  await page.route("**/api/promo-section-design-image?*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/svg+xml",
      body: "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='9'><rect width='16' height='9' fill='#156b5b'/></svg>",
    });
  });
  const pageErrors = [];
  const failedRequests = [];
  const requestedPaths = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => requestedPaths.push(new URL(request.url()).pathname));
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText || "failed";
    // Create Promo intentionally replaces the embedded editor iframe when a
    // fresh layout snapshot is rendered. Chromium reports the old frame's
    // in-flight static assets as aborted; network or server failures still fail.
    if (reason === "net::ERR_ABORTED") return;
    failedRequests.push(`${request.method()} ${request.url()}: ${reason}`);
  });

  await page.goto(`${origin}/create-promo.html`, { waitUntil: "networkidle" });
  await assertPageText(page.locator("#step-title"), "배경색 선택");

  await page.locator('[data-choice-group="background"][data-choice-value="midnight"]').click();
  assert.equal(
    await page.locator('[data-choice-group="background"][data-choice-value="midnight"]').getAttribute("aria-checked"),
    "true",
  );

  await page.locator("#next-step").click();
  await assertPageText(page.locator("#step-title"), "CTA 버튼 스타일 선택");
  await page.locator('[data-choice-group="cta-style"][data-choice-value="round-fill"]').click();
  await page.locator('[data-choice-group="cta-color"][data-choice-value="blue"]').click();

  await page.locator("#next-step").click();
  await assertPageText(page.locator("#step-title"), "템플릿 및 콘텐츠 등록");
  await page.locator('[data-field-key="title"] input').fill("Browser Smoke Promotion");
  await page.locator('[data-field-key="promotionPurpose"] select').selectOption("이벤트");
  await page.locator('[data-field-key="market"] input').fill("KR");
  await page.locator('[data-field-key="audience"] select').selectOption("신규");
  await page.locator('[data-field-key="campaignTone"] select').selectOption("활기찬");

  await page.locator(".content-substep-actions .primary-action").click();
  await page.locator('.content-substep[aria-current="step"] strong').waitFor();
  await assertPageText(page.locator('.content-substep[aria-current="step"] strong'), "프로모션 템플릿 선택");
  await page.locator('.wizard-template-tile[aria-pressed="true"]').waitFor();

  await page.locator(".content-substep-actions .primary-action").click();
  await assertPageText(page.locator('.content-substep[aria-current="step"] strong'), "템플릿 레이아웃");
  const editorFrame = page.frameLocator("iframe.wizard-layout-frame");
  await editorFrame.locator(".editor-workspace.is-create-promo-wizard").waitFor({ timeout: 10_000 });
  assert.equal(await editorFrame.locator(".section-ai-actions > .section-ai-action").count(), 2, "Section background AI actions must coexist with Item-target AI actions");
  assert.equal(await editorFrame.locator(".section-ai-action:not([disabled])").count(), 0, "Structural image/CTA values must not enable AI generation");
  assert.equal(await editorFrame.locator(".section-ai-action").first().getAttribute("title"), "섹션 콘텐츠를 먼저 등록해 주세요.");
  await editorFrame.getByRole("button", { name: "자동등록" }).click();
  await editorFrame.locator(".auto-register-message").waitFor({ timeout: 10_000 });
  await editorFrame.locator(".section-ai-action:not([disabled])").first().click();
  for (let attempt = 0; attempt < 50 && !sectionAiRunRequest; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal(sectionAiRunRequest?.promoRunId, null);
  assert.equal(sectionAiRunRequest?.formTemplateId, "visual-editor-preview-template");
  assert.equal(sectionAiRunRequest?.sectionKey, "heroBanner");
  assert.equal(sectionAiRunRequest?.targetType, "section-background");
  assert.equal(sectionAiRunRequest?.sectionInputs?.title, "Browser Smoke Promotion");

  sectionAiRunRequest = null;
  await editorFrame.locator(".section-trigger").filter({ hasText: "Feature Content" }).click();
  await editorFrame.locator(".section-accordion__items button").filter({ hasText: "프로모션 이미지" }).click();
  const itemAiAction = editorFrame.locator(".item-ai-generation-action");
  await itemAiAction.waitFor();
  assert.equal(await itemAiAction.isDisabled(), false, "Allowed image Item AI action should be enabled when the Section has content");
  await itemAiAction.click();
  for (let attempt = 0; attempt < 50 && !sectionAiRunRequest; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal(sectionAiRunRequest?.sectionKey, "contentFeature");
  assert.equal(sectionAiRunRequest?.targetType, "item");
  assert.equal(sectionAiRunRequest?.targetItemKey, "image");
  for (let attempt = 0; attempt < 50 && (await itemAiAction.textContent())?.trim() !== "AI 이미지 적용"; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal((await itemAiAction.textContent())?.trim(), "AI 이미지 적용");
  await itemAiAction.click();
  let itemAppliedContent = null;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    itemAppliedContent = await page.evaluate(() => JSON.parse(localStorage.getItem("promoPrototype.createPromo.content.v1") || "null"));
    if (itemAppliedContent?.sectionInputs?.contentFeature?.image?.source === "ai") break;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal(itemAppliedContent?.sectionInputs?.contentFeature?.image?.source, "ai");
  assert.match(itemAppliedContent?.sectionInputs?.contentFeature?.image?.value || "", /^\/api\/promo-section-design-image\?/);
  await editorFrame.locator(".rendered-image-frame").waitFor({ state: "attached" });
  assert.equal(
    Boolean(itemAppliedContent?.templateLayouts?.["default-preview"]?.resolvedLayout?.sectionStyles?.contentFeature?.backgroundImage),
    false,
    "Item-target AI generation must not create a Section background image",
  );
  const itemImageFrame = editorFrame.locator('[data-section-key="contentFeature"] [data-item-key="image"] .rendered-image-frame');
  await itemImageFrame.waitFor({ state: "attached" });
  assert.notEqual(
    await itemImageFrame.evaluate((node) => getComputedStyle(node).backgroundImage),
    "none",
    "Item-target AI generation must render through the Image Frame background",
  );
  const imageRemoveAction = editorFrame.locator(".image-remove-action");
  await imageRemoveAction.waitFor();
  page.once("dialog", (dialog) => dialog.accept());
  await imageRemoveAction.click();
  for (let attempt = 0; attempt < 100; attempt += 1) {
    itemAppliedContent = await page.evaluate(() => JSON.parse(localStorage.getItem("promoPrototype.createPromo.content.v1") || "null"));
    if (!itemAppliedContent?.sectionInputs?.contentFeature?.image?.value) break;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal(itemAppliedContent?.sectionInputs?.contentFeature?.image?.value, "");
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (await itemImageFrame.evaluate((node) => getComputedStyle(node).backgroundImage) === "none") break;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal(await itemImageFrame.evaluate((node) => getComputedStyle(node).backgroundImage), "none");

  await page.locator(".content-substep-actions .primary-action").click();
  await assertPageText(page.locator("#step-title"), "웹 출력");
  const outputFrame = page.frameLocator("iframe.web-output-frame");
  await outputFrame.locator(".promo-renderer").waitFor({ timeout: 10_000 });
  const snapshot = await page.evaluate(() => JSON.parse(localStorage.getItem("promoVisualEditor.snapshot.v1") || "null"));
  const wizardContent = await page.evaluate(() => JSON.parse(localStorage.getItem("promoPrototype.createPromo.content.v1") || "null"));
  assert.equal(wizardContent?.promo?.title, "Browser Smoke Promotion");
  assert.equal(snapshot?.content?.formTemplate?.templateKey, "default-preview");
  assert.equal(snapshot?.designSpec?.theme?.backgroundColor, "#111827");
  assert.equal(snapshot?.designSpec?.theme?.ctaColor, "#3478f6");
  assert.equal(snapshot?.designSpec?.theme?.ctaShape, "round");
  assert.equal(snapshot?.designSpec?.theme?.ctaVariant, "fill");

  assert.deepEqual(pageErrors, [], `Browser page errors:\n${pageErrors.join("\n")}`);
  assert.deepEqual(failedRequests, [], `Failed browser requests:\n${failedRequests.join("\n")}`);
  [
    "/api/design-documents",
    "/api/promo-generation-worker-settings",
    "/api/promo-generation-runs",
  ].forEach((legacyPath) => {
    assert.equal(requestedPaths.includes(legacyPath), false, `Legacy request should not run: ${legacyPath}`);
  });
  await context.close();
  console.log("Create Promo browser smoke test passed");
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}

async function assertPageText(locator, expected) {
  await locator.waitFor({ timeout: 10_000 });
  assert.equal((await locator.textContent())?.trim(), expected);
}
