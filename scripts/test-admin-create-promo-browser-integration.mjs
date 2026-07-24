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

  const adminEditorPage = await context.newPage();
  await adminEditorPage.goto(
    `${origin}/prototype/visual-editor.html?mode=admin-layout&templateId=visual-editor-preview-template`,
    { waitUntil: "networkidle" },
  );
  await adminEditorPage.locator(".editor-workspace.is-builder-workspace.is-admin-layout-workspace").waitFor();
  assert.equal(await adminEditorPage.locator(".editor-shell--embedded").count(), 1);
  assert.equal(await adminEditorPage.locator(".shell-sidebar").count(), 0);
  assert.equal(await adminEditorPage.getByRole("button", { name: "초안 저장" }).count(), 1);
  assert.equal(await adminEditorPage.getByRole("button", { name: "저장 후 활성화" }).count(), 1);
  assert.equal(await adminEditorPage.getByText("AI 다중 정렬", { exact: true }).count(), 1);
  assert.equal(await adminEditorPage.locator(".section-property-accordion").count(), 1);
  assert.equal(await adminEditorPage.locator(".property-panel .section-properties").count(), 0);
  await adminEditorPage.close();

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
  assert.equal(await editorFrame.locator(".editor-workspace.is-builder-workspace").count(), 1);
  assert.equal(await editorFrame.locator(".editor-shell--embedded").count(), 1);
  assert.equal(await editorFrame.locator(".shell-sidebar").count(), 0);
  const sectionTriggers = editorFrame.locator(".section-trigger");
  if (await sectionTriggers.count() > 1) await sectionTriggers.nth(1).click();
  assert.equal(await editorFrame.locator(".section-property-accordion").count(), 1);
  assert.equal(await editorFrame.locator(".property-panel .section-properties").count(), 0);
  const refreshedLayout = {
    ...adminLayout,
    sectionStyles: {
      ...adminLayout.sectionStyles,
      heroBanner: {
        ...adminLayout.sectionStyles.heroBanner,
        minHeight: 700,
        backgroundColor: "#dcfce7",
      },
    },
  };
  const refreshSaveResponse = await page.request.patch(`${origin}/api/wizard-form-template-layout`, {
    data: {
      templateId: "visual-editor-preview-template",
      expectedRevision: 2,
      layoutSpec: refreshedLayout,
    },
  });
  assert.equal(refreshSaveResponse.ok(), true, "A newer Admin layout save should succeed while Create Promo is open");
  assert.equal((await refreshSaveResponse.json()).layout.layoutRevision, 3);

  const currentPublicResponse = await page.request.get(
    `${origin}/api/wizard-form-template-public?id=visual-editor-preview-template`,
  );
  assert.equal(currentPublicResponse.ok(), true);
  const currentPublic = await currentPublicResponse.json();
  const activatedTemplate = {
    ...currentPublic.template,
    id: "visual-editor-preview-template-v2",
    version: 2,
  };
  const addedSection = {
    sectionId: "admin-added-section",
    sectionKey: "adminAddedSection",
    name: "Admin Added Section",
    description: "Section added to the newly activated template version.",
    sortOrder: 15,
    isRequired: false,
    userReorderAllowed: true,
    fixedPosition: null,
    aiDesign: {
      enabled: true,
      allowedLayoutVariants: ["split-left", "split-right", "centered-hero"],
      imageTarget: "section-background",
      imageTargetItemKeys: [],
      imageAspectRatio: "16:9",
    },
    items: [
      {
        id: "admin-added-copy",
        itemKey: "copy",
        name: "Admin Added Copy",
        fieldKind: "text",
        textType: "multi",
        isRequired: false,
        isLocked: false,
        isVisibleInWizard: true,
        defaultValue: "This content came from the newly activated Admin template.",
      },
    ],
  };
  const activatedDetail = {
    ...currentPublic,
    template: activatedTemplate,
    configRevision: "preview-v2-with-admin-section",
    layoutRevision: 3,
    layoutIdentity: {
      ...currentPublic.layoutIdentity,
      templateId: activatedTemplate.id,
      templateVersion: activatedTemplate.version,
      layoutRevision: 3,
      configRevision: "preview-v2-with-admin-section",
    },
    defaultLayout: refreshedLayout,
    sections: [...currentPublic.sections, addedSection],
  };
  await page.route("**/api/wizard-form-templates-public", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, templates: [activatedTemplate] }),
    });
  });
  await page.route("**/api/wizard-form-template-public?*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(activatedDetail),
    });
  });

  await page.locator(".wizard-layout-panel__actions button").first().click();
  try {
    await editorFrame.locator('[data-section-key="heroBanner"]').waitFor({ timeout: 10_000 });
  } catch (error) {
    throw new Error(
      `Refreshed Admin layout did not render heroBanner.\nBrowser errors:\n${pageErrors.join("\n") || "(none)"}`,
      { cause: error },
    );
  }
  await editorFrame.locator('[data-section-key="adminAddedSection"]').waitFor({ timeout: 10_000 });
  let refreshedSectionStyle = null;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    refreshedSectionStyle = await editorFrame.locator('[data-section-key="heroBanner"]').evaluate((node) => {
      const styles = getComputedStyle(node);
      return { height: styles.height, backgroundColor: styles.backgroundColor };
    });
    if (refreshedSectionStyle.height === "700px") break;
    await page.waitForTimeout(50);
  }
  assert.equal(refreshedSectionStyle?.height, "700px", "Step 4 must immediately render the newly saved Admin layout");
  assert.equal(refreshedSectionStyle?.backgroundColor, "rgb(220, 252, 231)");
  assert.equal(
    await editorFrame.locator('[data-section-key="adminAddedSection"]').count(),
    1,
    "Step 4 must immediately render a section from the newly activated Admin template version",
  );

  const outputPagePromise = context.waitForEvent("page");
  await page.locator("#next-step").click();
  const outputPage = await outputPagePromise;
  await outputPage.locator(".promo-renderer").waitFor({ timeout: 10_000 });
  await outputPage.close();

  const snapshot = await page.evaluate(() => JSON.parse(localStorage.getItem("promoVisualEditor.snapshot.v1") || "null"));
  assert.equal(snapshot?.layoutRevision, 3);
  assert.equal(snapshot?.content?.formTemplate?.id, activatedTemplate.id);
  assert.equal(snapshot?.content?.formTemplate?.version, 2);
  assert.ok(snapshot?.content?.sectionSnapshot?.some((section) => section.sectionKey === "adminAddedSection"));
  assert.equal(snapshot?.designSpec?.sectionStyles?.heroBanner?.minHeight, 700);
  assert.equal(snapshot?.designSpec?.sectionStyles?.heroBanner?.backgroundColor, "#dcfce7");
  assert.equal(snapshot?.designSpec?.sectionStyles?.heroBanner?.backgroundPosition, "left center");
  assert.deepEqual(pageErrors, [], `Browser page errors:\n${pageErrors.join("\n")}`);

  await context.close();
  console.log("Admin layout to Create Promo browser integration test passed");
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}
