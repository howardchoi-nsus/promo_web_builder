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
  let sectionAiRunResponseDelayMs = 0;
  await page.route("**/api/promo-section-design-runs", async (route) => {
    sectionAiRunRequest = route.request().postDataJSON();
    const target = sectionAiRunRequest.targetType === "item" && sectionAiRunRequest.targetItemKey
      ? { type: "item", sectionKey: sectionAiRunRequest.sectionKey, itemKey: sectionAiRunRequest.targetItemKey }
      : { type: "section-background", sectionKey: sectionAiRunRequest.sectionKey };
    latestSectionAiRun = {
      id: `fixture-section-ai-run-${sectionAiRunRequest.sectionKey}`,
      status: "ready",
      requestMode: sectionAiRunRequest.requestMode || "assets",
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
    if (sectionAiRunResponseDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, sectionAiRunResponseDelayMs));
    }
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
      body: JSON.stringify({ ok: true, run: { ...latestSectionAiRun, status: "applying" } }),
    });
  });
  await page.route("**/api/promo-section-design-apply-complete", async (route) => {
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
  await assertPageText(page.locator("#step-title"), "배경 및 버튼 스타일 선택");

  await page.locator('[data-choice-group="background"][data-choice-value="midnight"]').click();
  assert.equal(
    await page.locator('[data-choice-group="background"][data-choice-value="midnight"]').getAttribute("aria-checked"),
    "true",
  );

  await page.locator('[data-choice-group="cta-style"][data-choice-value="round-fill"]').click();
  await page.locator('[data-choice-group="cta-color"][data-choice-value="blue"]').click();

  await page.locator("#next-step").click();
  await assertPageText(page.locator("#step-title"), "프로모션 개요 등록");
  await page.locator('[data-field-key="title"] input').fill("Browser Smoke Promotion");
  await page.locator('[data-field-key="promotionPurpose"] select').selectOption("이벤트");
  await page.locator('[data-field-key="market"] input').fill("KR");
  await page.locator('[data-field-key="audience"] select').selectOption("신규");
  await page.locator('[data-field-key="campaignTone"] select').selectOption("활기찬");

  await page.locator("#next-step").click();
  await assertPageText(page.locator("#step-title"), "프로모션 템플릿 선택");
  await page.locator('.wizard-template-tile[aria-pressed="true"]').waitFor();

  await page.locator("#next-step").click();
  await assertPageText(page.locator("#step-title"), "템플릿 레이아웃");
  const editorFrame = page.frameLocator("iframe.wizard-layout-frame");
  await editorFrame.locator(".editor-workspace.is-create-promo-wizard").waitFor({ timeout: 10_000 });
  assert.equal(await page.locator("iframe.wizard-layout-frame").getAttribute("scrolling"), "no");
  const embeddedDocumentMetrics = await editorFrame.locator("html").evaluate((node) => {
    const styles = getComputedStyle(node);
    return {
      overflowY: styles.overflowY,
      clientHeight: node.clientHeight,
      scrollHeight: node.scrollHeight,
    };
  });
  assert.equal(embeddedDocumentMetrics.overflowY, "hidden");
  assert.ok(
    embeddedDocumentMetrics.scrollHeight <= embeddedDocumentMetrics.clientHeight,
    "Embedded editor document must not create its own scrollbar",
  );
  assert.equal(await editorFrame.locator("header.editor-header.editor-toolbar").count(), 0, "Create Promo must omit the embedded editor header");
  const separateOutputPagePromise = context.waitForEvent("page");
  await editorFrame.getByRole("button", { name: "Web Output", exact: true }).click();
  const separateOutputPage = await separateOutputPagePromise;
  await separateOutputPage.locator(".promo-renderer").waitFor({ timeout: 10_000 });
  assert.match(separateOutputPage.url(), /\/prototype\/visual-output\.html$/);
  await separateOutputPage.close();
  const createPromoWorkspaceStyles = await editorFrame.locator(".editor-workspace.is-create-promo-wizard").evaluate((node) => {
    const styles = getComputedStyle(node);
    return {
      gridTemplateAreas: styles.gridTemplateAreas,
      overflowX: styles.overflowX,
      overflowY: styles.overflowY,
    };
  });
  assert.match(createPromoWorkspaceStyles.gridTemplateAreas, /sections preview content/);
  assert.match(createPromoWorkspaceStyles.overflowX, /^(auto|hidden)$/);
  assert.equal(createPromoWorkspaceStyles.overflowY, "hidden");
  assert.equal(
    await editorFrame.locator(".section-rail").evaluate((node) => getComputedStyle(node).overflowY),
    "hidden",
    "Section rail shell must keep scrolling inside the Section list",
  );
  assert.equal(
    await editorFrame.locator(".property-panel").evaluate((node) => getComputedStyle(node).overflowY),
    "hidden",
    "Property panel shell must keep scrolling inside the property form",
  );
  assert.equal(
    await editorFrame.locator(".section-list").evaluate((node) => getComputedStyle(node).overflowY),
    "auto",
    "Section list must scroll independently",
  );
  assert.equal(
    await editorFrame.locator(".property-form").evaluate((node) => getComputedStyle(node).overflowY),
    "auto",
    "Property form must scroll independently",
  );
  assert.equal(
    await editorFrame.locator(".preview-stage").evaluate((node) => getComputedStyle(node).overflowY),
    "auto",
    "Preview stage must scroll independently",
  );
  const previewScrollMetrics = await editorFrame.locator(".preview-stage").evaluate((node) => {
    const renderer = node.querySelector(".promo-renderer");
    if (renderer) renderer.style.minHeight = "2400px";
    node.querySelectorAll(".rendered-section").forEach((section) => {
      section.style.minHeight = "480px";
    });
    node.scrollTop = node.scrollHeight;
    return {
      clientHeight: node.clientHeight,
      scrollHeight: node.scrollHeight,
      scrollRange: node.scrollHeight - node.clientHeight,
      panelHeight: node.closest(".preview-panel")?.clientHeight || 0,
      workspaceHeight: node.closest(".editor-workspace")?.clientHeight || 0,
      htmlHeight: document.documentElement.clientHeight,
      bodyHeight: document.body.clientHeight,
      shellHeight: document.querySelector(".editor-shell")?.clientHeight || 0,
      shellClass: document.querySelector(".editor-shell")?.className || "",
      shellComputedHeight: getComputedStyle(document.querySelector(".editor-shell")).height,
      shellOverflow: getComputedStyle(document.querySelector(".editor-shell")).overflow,
      embeddedMainHeight: document.querySelector(".editor-embedded-main")?.clientHeight || 0,
      embeddedContentHeight: document.querySelector(".editor-content--embedded")?.clientHeight || 0,
    };
  });
  const previewScrollRange = previewScrollMetrics.scrollRange;
  assert.ok(previewScrollRange > 0, `Fixture Preview must be tall enough to verify Section navigation: ${JSON.stringify(previewScrollMetrics)}`);
  await editorFrame.locator(".section-trigger").filter({ hasText: "Hero Banner" }).click();
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (await editorFrame.locator(".preview-stage").evaluate((node) => node.scrollTop) < previewScrollRange / 2) break;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.ok(
    await editorFrame.locator(".preview-stage").evaluate((node) => node.scrollTop) < previewScrollRange / 2,
    "Selecting a Section must scroll the Preview stage to that Section",
  );
  assert.equal(await editorFrame.locator(".section-properties .section-ai-action").count(), 2, "Layout and background AI actions must live inside Section properties");
  assert.equal(await editorFrame.locator(".section-ai-action:not([disabled])").count(), 0, "Structural image/CTA values must not enable AI generation");
  assert.equal(
    await editorFrame.getByRole("button", { name: "AI 디자인", exact: true }).getAttribute("title"),
    "섹션 콘텐츠를 먼저 등록해 주세요.",
  );
  await editorFrame.getByRole("button", { name: "자동등록" }).click();
  await editorFrame.locator(".auto-register-message").waitFor({ timeout: 10_000 });
  sectionAiRunResponseDelayMs = 300;
  await editorFrame.getByRole("button", { name: "AI 디자인", exact: true }).click();
  await editorFrame.locator('[data-section-key="heroBanner"] .section-ai-state.is-processing').waitFor({ timeout: 2_000 });
  sectionAiRunResponseDelayMs = 0;
  for (let attempt = 0; attempt < 50 && !sectionAiRunRequest; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal(sectionAiRunRequest?.promoRunId, null);
  assert.equal(sectionAiRunRequest?.formTemplateId, "visual-editor-preview-template");
  assert.equal(sectionAiRunRequest?.sectionKey, "heroBanner");
  assert.equal(sectionAiRunRequest?.targetType, "section-background");
  assert.equal(sectionAiRunRequest?.sectionInputs?.title, "Browser Smoke Promotion");
  let backgroundAppliedContent = null;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    backgroundAppliedContent = await page.evaluate(() => JSON.parse(localStorage.getItem("promoPrototype.createPromo.content.v1") || "null"));
    if (backgroundAppliedContent?.sectionDesignRuns?.heroBanner?.status === "applied") break;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal(backgroundAppliedContent?.sectionDesignRuns?.heroBanner?.status, "applied", "Ready Section background must apply automatically");

  sectionAiRunRequest = null;
  await editorFrame.locator(".section-trigger").filter({ hasText: "Feature Content" }).click();
  const imageComponentTrigger = editorFrame.locator(".component-property-trigger").filter({ hasText: "프로모션 이미지" });
  if (await imageComponentTrigger.getAttribute("aria-expanded") !== "true") {
    await imageComponentTrigger.click();
  }
  const itemAiAction = editorFrame.locator(".item-ai-generation-action");
  await itemAiAction.waitFor();
  assert.equal(await itemAiAction.isDisabled(), false, "Allowed image Item AI action should be enabled when the Section has content");
  sectionAiRunResponseDelayMs = 300;
  await itemAiAction.click();
  await editorFrame.locator('[data-section-key="contentFeature"] [data-item-key="image"] .item-ai-state.is-processing').waitFor({ timeout: 2_000 });
  sectionAiRunResponseDelayMs = 0;
  for (let attempt = 0; attempt < 50 && !sectionAiRunRequest; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal(sectionAiRunRequest?.sectionKey, "contentFeature");
  assert.equal(sectionAiRunRequest?.targetType, "item");
  assert.equal(sectionAiRunRequest?.targetItemKey, "image");
  let itemAppliedContent = null;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    itemAppliedContent = await page.evaluate(() => JSON.parse(localStorage.getItem("promoPrototype.createPromo.content.v1") || "null"));
    if (itemAppliedContent?.sectionInputs?.contentFeature?.image?.source === "ai"
      && itemAppliedContent?.sectionDesignRuns?.contentFeature?.status === "applied") break;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  assert.equal(itemAppliedContent?.sectionInputs?.contentFeature?.image?.source, "ai");
  assert.equal(itemAppliedContent?.sectionDesignRuns?.contentFeature?.status, "applied", "Ready Item image must apply automatically");
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
  assert.equal(
    await itemImageFrame.evaluate((node) => getComputedStyle(node).backgroundColor),
    "rgba(0, 0, 0, 0)",
    "Image Frame gaps must remain transparent while resizing",
  );
  const imageResizeModeButtons = editorFrame.locator(".image-resize-mode button");
  assert.equal(await imageResizeModeButtons.count(), 2);
  await imageResizeModeButtons.nth(1).click();
  assert.equal(
    await editorFrame.locator('[data-section-key="contentFeature"] [data-item-key="image"] .image-resize-handle').count(),
    8,
    "Free resize mode must expose corner and edge handles",
  );
  await imageResizeModeButtons.nth(0).click();
  assert.equal(
    await editorFrame.locator('[data-section-key="contentFeature"] [data-item-key="image"] .image-resize-handle').count(),
    4,
    "Ratio-maintained mode must expose corner handles only",
  );
  const textComponent = editorFrame.locator('[data-section-key="contentFeature"] [data-item-key="copy"]');
  await textComponent.click();
  const textPropertyInput = editorFrame.locator(".component-property-content textarea").first();
  await textPropertyInput.fill("");
  const emptyTextField = textComponent.locator(".rendered-empty");
  await emptyTextField.waitFor({ state: "visible" });
  assert.equal(await emptyTextField.textContent(), "상세 내용을 입력하세요");
  await emptyTextField.dispatchEvent("dblclick");
  await page.waitForTimeout(50);
  assert.deepEqual(pageErrors, []);
  const editingTextField = textComponent.locator(".rendered-text, .rendered-empty").first();
  assert.equal(
    await editingTextField.getAttribute("contenteditable"),
    "true",
    await editingTextField.evaluate((node) => node.closest(".rendered-item")?.outerHTML || node.outerHTML),
  );
  assert.equal(await editingTextField.textContent(), "상세 내용을 입력하세요");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(50);
  const emptyTextContent = await page.evaluate(() => JSON.parse(localStorage.getItem("promoPrototype.createPromo.content.v1") || "null"));
  assert.equal(emptyTextContent?.sectionInputs?.contentFeature?.copy, "");
  assert.doesNotMatch(JSON.stringify(emptyTextContent), /Lorem ipsum/);
  assert.equal(
    await textComponent.locator(".component-resize-handle").count(),
    8,
    "Text component containers must expose corner and edge handles",
  );
  const textRightHandle = textComponent.locator(".component-resize-handle--e");
  const textContentNode = textComponent.locator(".rendered-text, .rendered-empty").first();
  const textBoxBefore = await textComponent.boundingBox();
  const textHandleBox = await textRightHandle.boundingBox();
  const textFontSizeBefore = Number.parseFloat(await textContentNode.evaluate((node) => getComputedStyle(node).fontSize));
  assert.ok(textBoxBefore && textHandleBox, "Text component resize geometry must be measurable");
  await page.mouse.move(textHandleBox.x + textHandleBox.width / 2, textHandleBox.y + textHandleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(textHandleBox.x + textHandleBox.width / 2 + 60, textHandleBox.y + textHandleBox.height / 2);
  await page.mouse.up();
  await page.waitForTimeout(50);
  const textBoxAfter = await textComponent.boundingBox();
  const textFontSizeAfter = Number.parseFloat(await textContentNode.evaluate((node) => getComputedStyle(node).fontSize));
  assert.ok(
    textBoxAfter.width > textBoxBefore.width + 30,
    "Dragging a text component edge handle must increase its article width",
  );
  assert.ok(
    textFontSizeAfter > textFontSizeBefore,
    "Dragging a text component edge handle must scale its font size",
  );
  const textBottomHandle = textComponent.locator(".component-resize-handle--s");
  const textBottomHandleBox = await textBottomHandle.boundingBox();
  const sectionNode = editorFrame.locator('[data-section-key="contentFeature"]');
  const sectionBoxBefore = await sectionNode.boundingBox();
  assert.ok(textBottomHandleBox && sectionBoxBefore, "Vertical text resize geometry must be measurable");
  await page.mouse.move(textBottomHandleBox.x + textBottomHandleBox.width / 2, textBottomHandleBox.y + textBottomHandleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(textBottomHandleBox.x + textBottomHandleBox.width / 2, textBottomHandleBox.y + textBottomHandleBox.height / 2 + 60);
  await page.mouse.up();
  await page.waitForTimeout(100);
  const textBoxAfterVerticalResize = await textComponent.boundingBox();
  const textFontSizeAfterVerticalResize = Number.parseFloat(await textContentNode.evaluate((node) => getComputedStyle(node).fontSize));
  const sectionBoxAfter = await sectionNode.boundingBox();
  assert.ok(
    textBoxAfterVerticalResize.height > textBoxAfter.height + 30,
    "Dragging a text component bottom handle must increase its article height",
  );
  assert.ok(
    textFontSizeAfterVerticalResize > textFontSizeAfter,
    "Vertical text component resize must scale its font size",
  );
  assert.ok(
    sectionBoxAfter.height >= sectionBoxBefore.height
      && textBoxAfterVerticalResize.y + textBoxAfterVerticalResize.height <= sectionBoxAfter.y + sectionBoxAfter.height,
    "The Section must expand when a resized component needs more vertical space",
  );
  const textRightHandleAfterExpansion = textComponent.locator(".component-resize-handle--e");
  const textRightHandleAfterExpansionBox = await textRightHandleAfterExpansion.boundingBox();
  assert.ok(textRightHandleAfterExpansionBox, "Text component shrink geometry must be measurable");
  await page.mouse.move(
    textRightHandleAfterExpansionBox.x + textRightHandleAfterExpansionBox.width / 2,
    textRightHandleAfterExpansionBox.y + textRightHandleAfterExpansionBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    textRightHandleAfterExpansionBox.x + textRightHandleAfterExpansionBox.width / 2 - 40,
    textRightHandleAfterExpansionBox.y + textRightHandleAfterExpansionBox.height / 2,
  );
  await page.mouse.up();
  await page.waitForTimeout(50);
  const textBoxAfterShrink = await textComponent.boundingBox();
  const textFontSizeAfterShrink = Number.parseFloat(await textContentNode.evaluate((node) => getComputedStyle(node).fontSize));
  assert.ok(
    textBoxAfterShrink.width < textBoxAfterVerticalResize.width - 20,
    "Shrinking a text component edge must reduce its article width",
  );
  assert.ok(
    textFontSizeAfterShrink < textFontSizeAfterVerticalResize,
    "Shrinking a text component edge must reduce its font size",
  );
  const textRightHandleForMinimumCheck = textComponent.locator(".component-resize-handle--e");
  const textRightHandleForMinimumCheckBox = await textRightHandleForMinimumCheck.boundingBox();
  assert.ok(textRightHandleForMinimumCheckBox, "Minimum-free text resize geometry must be measurable");
  await page.mouse.move(
    textRightHandleForMinimumCheckBox.x + textRightHandleForMinimumCheckBox.width / 2,
    textRightHandleForMinimumCheckBox.y + textRightHandleForMinimumCheckBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    Math.max(1, textRightHandleForMinimumCheckBox.x - 1_000),
    textRightHandleForMinimumCheckBox.y + textRightHandleForMinimumCheckBox.height / 2,
  );
  await page.mouse.up();
  await page.waitForTimeout(50);
  const textBoxAtTechnicalMinimum = await textComponent.boundingBox();
  const textFontSizeAtTechnicalMinimum = Number.parseFloat(await textContentNode.evaluate((node) => getComputedStyle(node).fontSize));
  assert.ok(textBoxAtTechnicalMinimum.width < 5, "Text component width must shrink below the former 80px minimum");
  assert.ok(textFontSizeAtTechnicalMinimum < 10, "Drag resizing must shrink text below the former 10px minimum");
  const resizedTextContent = await page.evaluate(() => JSON.parse(localStorage.getItem("promoPrototype.createPromo.content.v1") || "null"));
  assert.ok(
    resizedTextContent?.templateLayouts?.["default-preview"]?.resolvedLayout?.itemStyles?.["contentFeature.copy"]?.widthPct < 1,
    "A text component width below 1 percent must persist in the layout snapshot",
  );
  assert.ok(
    Math.abs(
      resizedTextContent?.templateLayouts?.["default-preview"]?.resolvedLayout?.itemStyles?.["contentFeature.copy"]?.fontSize
        - textFontSizeAtTechnicalMinimum,
    ) < 0.2,
    "The latest scaled text size must persist in the layout snapshot",
  );
  assert.ok(
    resizedTextContent?.templateLayouts?.["default-preview"]?.resolvedLayout?.itemStyles?.["contentFeature.copy"]?.heightPx > textBoxAfter.height,
    "Text component height must persist in the layout snapshot",
  );
  const fontSizeRange = editorFrame.locator('.design-controls input[type="range"][max="80"]');
  await fontSizeRange.evaluate((node) => {
    node.value = "0";
    node.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(50);
  assert.equal(
    Number.parseFloat(await textContentNode.evaluate((node) => getComputedStyle(node).fontSize)),
    0,
    "Text font size must not be clamped to the former 10px minimum",
  );
  const tinyTextContent = await page.evaluate(() => JSON.parse(localStorage.getItem("promoPrototype.createPromo.content.v1") || "null"));
  assert.equal(
    tinyTextContent?.templateLayouts?.["default-preview"]?.resolvedLayout?.itemStyles?.["contentFeature.copy"]?.fontSize,
    0,
    "A font size below 10px must persist in the layout snapshot",
  );
  const zeroFontRightHandle = textComponent.locator(".component-resize-handle--e");
  const zeroFontRightHandleBox = await zeroFontRightHandle.boundingBox();
  assert.ok(zeroFontRightHandleBox, "Zero-font resize geometry must be measurable");
  await page.mouse.move(
    zeroFontRightHandleBox.x + zeroFontRightHandleBox.width / 2,
    zeroFontRightHandleBox.y + zeroFontRightHandleBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    zeroFontRightHandleBox.x + zeroFontRightHandleBox.width / 2 + 60,
    zeroFontRightHandleBox.y + zeroFontRightHandleBox.height / 2,
  );
  await page.mouse.up();
  let restoredFontSize = 0;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    restoredFontSize = Number.parseFloat(await textContentNode.evaluate((node) => getComputedStyle(node).fontSize));
    if (restoredFontSize > 0) break;
    await page.waitForTimeout(25);
  }
  const zeroExpandedContent = await page.evaluate(() => JSON.parse(localStorage.getItem("promoPrototype.createPromo.content.v1") || "null"));
  const zeroExpandedStyle = zeroExpandedContent?.templateLayouts?.["default-preview"]?.resolvedLayout?.itemStyles?.["contentFeature.copy"];
  assert.ok(
    restoredFontSize > 0,
    `Expanding a zero-font text component must restore a visible font size (received ${restoredFontSize}; style ${JSON.stringify(zeroExpandedStyle)})`,
  );
  await itemImageFrame.click();
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

  const outputPagePromise = context.waitForEvent("page");
  await page.locator("#next-step").click();
  await assertPageText(page.locator("#step-title"), "웹 출력 미리보기");
  const outputPage = await outputPagePromise;
  await outputPage.locator(".promo-renderer").waitFor({ timeout: 10_000 });
  await outputPage.close();
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
