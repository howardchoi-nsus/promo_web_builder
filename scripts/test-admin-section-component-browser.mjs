import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number(process.env.ADMIN_COMPONENT_TEST_PORT || 4182);
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["scripts/serve-visual-editor-preview.js"], {
  cwd: process.cwd(), env: { ...process.env, PORT: String(port), USE_FIXTURE: "1" }, stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
server.stdout.on("data", (chunk) => { output += chunk; });
server.stderr.on("data", (chunk) => { output += chunk; });
async function waitForServer() {
  for (let count = 0; count < 100; count += 1) {
    try { if ((await fetch(`${origin}/prototype/index.html`)).ok) return; } catch { /* starting */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(output);
}

const tokenVersionId = "77777777-7777-4777-8777-777777777777";
let template = { id: "11111111-1111-4111-8111-111111111111", templateKey: "default", name: "Default", status: "draft", version: 1, designTokenSetVersionId: tokenVersionId };
const generatedTemplate = { id: "11111111-1111-4111-8111-111111111112", templateKey: "tpl_generated", name: "Generated Template", status: "draft", version: 1, designTokenSetVersionId: tokenVersionId };
const sectionA = { id: "22222222-2222-4222-8222-222222222222", sectionKey: "promotionIntro", name: "Promotion Intro", status: "draft", version: 2, aiDesign: { enabled: true } };
const sectionAActive = { id: "22222222-2222-4222-8222-222222222223", sectionKey: "promotionIntro", name: "Promotion Intro", status: "active", version: 1, aiDesign: { enabled: true } };
const sectionB = { id: "33333333-3333-4333-8333-333333333333", sectionKey: "benefits", name: "Benefits", status: "active", version: 1, aiDesign: { enabled: true } };
const membership = {
  id: "44444444-4444-4444-8444-444444444444",
  formTemplateId: template.id,
  sectionId: sectionA.id,
  sectionKey: sectionA.sectionKey,
  sectionName: sectionA.name,
  sectionVersion: sectionA.version,
  sectionStatus: sectionA.status,
  isVisible: true,
  isRequired: true,
  userReorderAllowed: true,
};
const activeComponentVersionId = "66666666-6666-4666-8666-666666666666";
let sectionItems = [
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    sectionId: sectionA.id,
    componentVersionId: activeComponentVersionId,
    itemKey: "title",
    name: "Title",
    isVisibleInWizard: true,
    isRequired: true,
    userReorderAllowed: true,
    sortOrder: 0,
    fieldKind: "text",
    textType: "title",
    isLocked: false,
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    sectionId: sectionA.id,
    componentVersionId: activeComponentVersionId,
    itemKey: "description",
    name: "Description",
    isVisibleInWizard: true,
    isRequired: false,
    userReorderAllowed: true,
    sortOrder: 10,
    fieldKind: "text",
    textType: "multi",
    isLocked: false,
  },
];
const component = {
  id: "55555555-5555-4555-8555-555555555555",
  componentKey: "cmp_1234567890abcdef1234567890abcdef",
  name: "Hero Title",
  status: "active",
  versionId: "88888888-8888-4888-8888-888888888888",
  version: 2,
  versionStatus: "draft",
  fieldKind: "text",
  textType: "multi",
  activeVersion: {
    id: activeComponentVersionId,
    version: 1,
    status: "active",
    fieldKind: "text",
    textType: "title",
  },
};

let browser;
let activateBody;
let deleteTemplateBody;
let generatedTemplateDeleted = false;
let createdSectionBody;
let componentOrderBody;
let rejectComponentOrder = false;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.route("https://unpkg.com/vue@3/dist/vue.global.prod.js", (route) => route.fulfill({ status: 200, contentType: "text/javascript", body: fs.readFileSync(path.resolve("node_modules/vue/dist/vue.global.prod.js"), "utf8") }));
  await page.route("**/api/**", (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const reply = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (url.pathname === "/api/locale-snapshot") return reply({ ok: true, locale: "ko", defaultLocale: "ko", messages: {}, defaultMessages: {} });
    if (url.pathname === "/api/item-components") return reply({ ok: true, components: [component] });
    if (url.pathname === "/api/design-token-sets") return reply({ ok: true, tokenSets: [{ id: "set", name: "Rounded", versionId: tokenVersionId, version: 1, versionStatus: "active" }] });
    if (url.pathname === "/api/wizard-form-templates") return reply({ ok: true, templates: generatedTemplateDeleted ? [template] : [template, generatedTemplate] });
    if (url.pathname === "/api/wizard-form-template") {
      const selectedTemplate = url.searchParams.get("id") === generatedTemplate.id ? generatedTemplate : template;
      return reply({ ok: true, template: selectedTemplate, sections: selectedTemplate.id === template.id ? [membership] : [] });
    }
    if (url.pathname === "/api/wizard-form-template-delete" && request.method() === "DELETE") {
      deleteTemplateBody = { id: url.searchParams.get("id") };
      generatedTemplateDeleted = true;
      return reply({
        ok: true,
        templateKey: generatedTemplate.templateKey,
        deletedVersionCount: 1,
        cancelledDesignRunCount: 1,
        updatedAssetJobCount: 1,
        deletedMembershipCount: 1,
        deletedOwnedSectionCount: 1,
      });
    }
    if (url.pathname === "/api/wizard-form-template-activate" && request.method() === "POST") {
      activateBody = request.postDataJSON();
      template = { ...template, status: "active" };
      return reply({ ok: true, template, layoutIdentity: { layoutRevision: 1 } });
    }
    if (url.pathname === "/api/wizard-content-sections" && request.method() === "POST") {
      createdSectionBody = request.postDataJSON();
      return reply({
        ok: true,
        section: {
          id: "99999999-9999-4999-8999-999999999999",
          sectionKey: "sec_created",
          name: createdSectionBody.name,
          description: createdSectionBody.description || "",
          status: "draft",
          version: 1,
        },
      }, 201);
    }
    if (url.pathname === "/api/wizard-content-sections") return reply({ ok: true, sections: [sectionA, sectionAActive, sectionB] });
    if (url.pathname === "/api/wizard-content-section-items-order" && request.method() === "POST") {
      componentOrderBody = request.postDataJSON();
      if (rejectComponentOrder) return reply({ error: "Simulated stale order" }, 409);
      const byId = new Map(sectionItems.map((item) => [item.id, item]));
      sectionItems = componentOrderBody.itemIds.map((id, index) => ({
        ...byId.get(id),
        sortOrder: index * 10,
      }));
      return reply({ ok: true, items: sectionItems });
    }
    if (url.pathname === "/api/wizard-content-section") return reply({ ok: true, section: sectionA, items: sectionItems, histories: [] });
    if (url.pathname === "/api/wizard-content-section-usage") return reply({ ok: true, templates: [template] });
    if (url.pathname === "/api/wizard-form-template-layout") return reply({
      ok: true,
      template,
      sections: [{ ...membership, items: sectionItems }],
      layout: {
        id: "layout",
        layoutRevision: 1,
        layoutSpec: { theme: {}, responsive: {}, itemStyles: {}, sectionStyles: {} },
        defaultContent: {},
        validationResult: { ok: true, errors: [] },
      },
      layoutIdentity: { layoutRevision: 1 },
    });
    return reply({ ok: true, templates: [], sections: [], logs: [], settings: [] });
  });

  await page.goto(`${origin}/prototype/index.html?view=admin&tab=components`, { waitUntil: "networkidle" });
  await page.getByText("Hero Title", { exact: true }).first().waitFor({ state: "visible" });
  assert.equal(await page.getByText(`컴포넌트 식별자: ${component.componentKey}`, { exact: true }).count(), 1);
  await page.getByRole("tab", { name: "Section Preset 관리" }).click();
  assert.equal(await page.locator("#section-preset-manager-target .section-library-manager").count(), 1);
  const linkedSectionRow = page.locator("#section-preset-manager-target .prompt-list-item").filter({ hasText: "Promotion Intro" });
  assert.equal(await linkedSectionRow.locator(".status-draft").count(), 1, "Preset list must prefer the editable draft version");
  await linkedSectionRow.click();
  assert.match(
    await page.locator("#section-preset-manager-target .prompt-editor-header").textContent(),
    /v2/,
    "Selecting a Section Preset must open its draft version",
  );
  await page.getByRole("button", { name: "+ 컴포넌트 추가" }).click();
  const activeComponentOption = page.locator(`select option[value="${activeComponentVersionId}"]`);
  assert.equal(await activeComponentOption.count(), 1);
  assert.match(await activeComponentOption.textContent(), /Hero Title.*v1/);
  const sectionComponentRows = page.locator(".section-component-order-row");
  assert.equal(await sectionComponentRows.count(), 2);
  const componentDropTargetBox = await sectionComponentRows.nth(1).boundingBox();
  assert.ok(componentDropTargetBox);
  await sectionComponentRows.nth(0).locator(".section-drag-handle").dragTo(
    sectionComponentRows.nth(1),
    { targetPosition: { x: componentDropTargetBox.width / 2, y: componentDropTargetBox.height - 2 } },
  );
  await page.waitForTimeout(50);
  assert.deepEqual(componentOrderBody, {
    sectionId: sectionA.id,
    itemIds: [
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    ],
  });
  assert.equal(
    await sectionComponentRows.nth(0).locator(".section-component-order-row__content strong").textContent(),
    "Description",
  );
  rejectComponentOrder = true;
  await sectionComponentRows.nth(0).getByRole("button", { name: "Description 아래로 이동" }).click();
  await page.waitForTimeout(50);
  assert.equal(
    await sectionComponentRows.nth(0).locator(".section-component-order-row__content strong").textContent(),
    "Description",
  );
  assert.match(await page.locator(".shell-status").textContent(), /컴포넌트 순서 저장 실패/);
  rejectComponentOrder = false;
  await page.locator(".section-library-add button").click();
  await page.locator(".section-library-create input").nth(1).fill("New Promotion Section");
  await page.locator(".section-library-create input").nth(2).fill("Created in the template section manager");
  await page.locator(".section-library-create .action-row button").click();
  await page.waitForTimeout(50);
  assert.deepEqual(createdSectionBody, {
    sectionKey: "",
    name: "New Promotion Section",
    description: "Created in the template section manager",
    compositionScope: "shared",
  });
  assert.equal(await page.locator(".template-section-composer").count(), 0);

  await page.getByRole("tab", { name: "템플릿·레이아웃 관리" }).click();
  await page.locator(".template-live-preview").waitFor({ state: "visible" });
  assert.equal(await page.getByRole("heading", { name: "Template Section 구성" }).count(), 0);
  assert.equal(await page.getByRole("button", { name: "+ Section Preset 연결" }).count(), 0);
  const livePreviewFrame = page.locator(".template-live-preview__frame");
  assert.equal(await livePreviewFrame.count(), 1);
  assert.match(await livePreviewFrame.getAttribute("src"), /mode=admin-layout/);
  assert.match(await livePreviewFrame.getAttribute("src"), new RegExp(`templateId=${template.id}`));
  const livePreviewEditor = page.frameLocator(".template-live-preview__frame");
  await livePreviewEditor.getByRole("complementary", { name: "페이지 구조와 컴포넌트" }).waitFor({ state: "visible" });
  assert.equal(await livePreviewEditor.getByRole("button", { name: "+ 빈 섹션" }).count(), 1);
  assert.equal(await livePreviewEditor.getByRole("tab", { name: "컴포넌트" }).count(), 1);
  assert.ok(await livePreviewEditor.getByRole("button", { name: /섹션 삭제/ }).count() > 0);
  assert.ok(await livePreviewEditor.getByRole("button", { name: /컴포넌트 삭제/ }).count() > 0);

  const generatedTemplateCard = page.locator(".template-list-card").filter({ hasText: "Generated Template" });
  await generatedTemplateCard.locator(".template-settings-toggle").click();
  await generatedTemplateCard.locator(".template-list-settings").waitFor({ state: "visible" });
  page.once("dialog", (dialog) => dialog.accept());
  await generatedTemplateCard.getByRole("button", { name: "삭제", exact: true }).click();
  await page.waitForTimeout(100);
  assert.deepEqual(deleteTemplateBody, { id: generatedTemplate.id });
  assert.equal(await page.locator(".template-list-card").filter({ hasText: "Generated Template" }).count(), 0);
  assert.match(await page.locator(".shell-status").textContent(), /AI 디자인 작업 1건 취소/);

  const templateCard = page.locator(".template-list-card").first();
  await templateCard.locator(".template-settings-toggle").click();
  await templateCard.locator(".template-list-settings").waitFor({ state: "visible" });
  assert.equal(await templateCard.locator('input[readonly][value="default"]').count(), 1);
  assert.equal(await templateCard.locator(".template-live-preview").count(), 0);
  assert.equal(await page.locator(".template-section-membership-row").count(), 0);

  await templateCard.getByRole("button", { name: "복사본 만들기", exact: true }).click();
  await page.locator(".form-template-duplicate").waitFor({ state: "visible" });
  assert.equal(await page.locator(".form-template-duplicate input").count(), 2);
  assert.equal(await page.locator(".form-template-duplicate input").evaluateAll((inputs) => inputs.some((input) => /key/i.test(input.name || input.placeholder || ""))), false);
  await page.locator(".form-template-duplicate .action-row button").first().click();

  await page.locator(".template-list-global-actions button").click();
  await page.locator(".form-template-create").waitFor({ state: "visible" });
  assert.equal(await page.locator(".form-template-create input").count(), 2);
  assert.equal(await page.locator(".form-template-create input").evaluateAll((inputs) => inputs.some((input) => /key/i.test(input.name || input.placeholder || ""))), false);
  await page.locator(".template-list-global-actions button").click();

  await templateCard.locator(".app-switch__track").click();
  await page.waitForTimeout(50);
  assert.equal(await templateCard.locator(".app-switch__input").isChecked(), true);
  assert.deepEqual(activateBody, {
    id: template.id,
    changeNote: "관리자 페이지에서 템플릿을 활성화했습니다.",
  });
  assert.deepEqual(pageErrors, []);
  console.log("Admin item component and section composition browser test passed");
  await context.close();
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}
