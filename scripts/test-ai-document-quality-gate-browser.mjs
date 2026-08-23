import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "prototype");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".woff2": "font/woff2",
};
let patchCount = 0;
let persistedQualityGate = null;

const assetTarget = {
  assetRequestId: "quality-gate-image",
  targetType: "component-field-image",
  pageSectionInstanceId: "hero",
  pageComponentInstanceId: "card#1",
  fieldKey: "image",
  required: true,
};
const snapshot = {
  contractVersion: 3,
  documentRevision: 1,
  layoutRevision: 0,
  layoutIdentity: { configRevision: "quality-gate-browser" },
  content: {
    formTemplate: { id: "quality-gate", name: "Quality Gate Browser", templateKey: "quality-gate", designTokens: { values: {} } },
    sectionSnapshot: [{
      sectionKey: "hero",
      name: "Hero",
      items: [{
        itemKey: "card#1",
        name: "Card",
        fieldKind: "component",
        fields: [
          { fieldKey: "image", name: "Image", fieldKind: "image" },
          { fieldKey: "title", name: "Title", fieldKind: "text" },
        ],
      }],
    }],
    sectionInputs: { hero: { "card#1": { fields: { image: null, title: "Quality card" } } } },
    sectionOrder: ["hero"],
  },
  designSpec: {
    contractVersion: 1,
    theme: {},
    itemStyles: { "hero.card#1": { widthPct: 48, positionMode: "free", xPct: 0, yPx: 0 } },
    sectionStyles: { hero: { minHeight: 520 } },
    visibility: { items: {}, fields: {} },
    responsiveLayouts: { mobile: { itemStyles: { "hero.card#1": { widthPct: 100 } }, visibility: { items: {} } } },
  },
  motionSpec: { sections: {}, items: {} },
  assets: {
    contractVersion: 1,
    items: {},
    expected: [assetTarget],
    requests: [{ ...assetTarget, status: "ready" }],
  },
};
const passingSnapshot = JSON.parse(JSON.stringify(snapshot));
passingSnapshot.content.formTemplate.name = "Quality Gate Passing Browser";
passingSnapshot.content.sectionInputs.hero["card#1"].fields.image = {
  value: "/api/quality-gate-image",
  source: "ai",
};
passingSnapshot.designSpec.itemStyles["hero.card#1"].heightPx = 500;
passingSnapshot.designSpec.sectionStyles.hero.minHeight = 680;

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  if (url.pathname === "/api/promo-builder-documents" && request.method === "GET") {
    const documentId = url.searchParams.get("documentId") || "";
    const responseSnapshot = documentId === "quality-gate-passing-document" ? passingSnapshot : snapshot;
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      document: { id: documentId, currentDocumentRevision: 1 },
      snapshot: responseSnapshot,
    }));
    return;
  }
  if (url.pathname === "/api/promo-builder-documents" && request.method === "PATCH") {
    patchCount += 1;
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    persistedQualityGate = body.snapshot?.qualityGate || null;
    const baseSnapshot = body.documentId === "quality-gate-passing-document" ? passingSnapshot : snapshot;
    const responseSnapshot = {
      ...baseSnapshot,
      documentRevision: 2,
      qualityGate: {
        ...persistedQualityGate,
        documentRevision: 2,
      },
    };
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, revision: 2, snapshot: responseSnapshot }));
    return;
  }
  if (url.pathname === "/api/quality-gate-image") {
    response.writeHead(200, { "Content-Type": "image/svg+xml" });
    response.end('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="100%" height="100%" fill="#777"/></svg>');
    return;
  }
  if (url.pathname === "/api/design-token-sets") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, tokenSets: [] }));
    return;
  }
  if (url.pathname === "/api/item-components") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, components: [] }));
    return;
  }
  if (url.pathname === "/api/wizard-content-sections") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, sections: [] }));
    return;
  }
  const relative = url.pathname.startsWith("/prototype/")
    ? url.pathname.slice("/prototype/".length)
    : url.pathname.replace(/^\/+/, "");
  const file = path.join(publicRoot, relative || "visual-editor.html");
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
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
let passingPage = null;
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto(
    `${origin}/prototype/visual-editor.html?mode=ai-document&builderDocumentId=quality-gate-document`,
    { waitUntil: "networkidle" },
  );
  await page.getByText("PREVIEW QUALITY BLOCKED").waitFor();
  const alert = page.locator(".preview-quality-gate.is-failed");
  assert.match(await alert.innerText(), /Desktop [1-9]\d*건/);
  assert.match(await alert.innerText(), /Mobile [1-9]\d*건/);
  assert.equal(await page.getByRole("button", { name: "AI 문서 저장" }).isDisabled(), true);
  assert.equal(await page.getByRole("button", { name: "Web Output" }).isDisabled(), true);
  assert.equal(await page.locator(".vite-error-overlay").count(), 0);
  assert.ok((await page.locator("body").innerText()).trim().length > 0);
  await page.getByRole("button", { name: "다시 검사" }).click();
  await page.getByText("PREVIEW QUALITY BLOCKED").waitFor();
  assert.equal(patchCount, 0);
  assert.deepEqual(errors, []);

  passingPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const passingErrors = [];
  passingPage.on("pageerror", (error) => passingErrors.push(error.message));
  await passingPage.goto(
    `${origin}/prototype/visual-editor.html?mode=ai-document&builderDocumentId=quality-gate-passing-document`,
    { waitUntil: "networkidle" },
  );
  const passingSaveButton = passingPage.getByRole("button", { name: "AI 문서 저장" });
  await passingSaveButton.waitFor();
  await passingPage.waitForTimeout(1000);
  if (await passingSaveButton.isDisabled()) {
    await passingPage.getByRole("button", { name: "Mobile" }).click();
    await passingPage.waitForTimeout(100);
    await passingPage.getByRole("button", { name: "품질 확인" }).click();
    await passingPage.waitForTimeout(100);
    const measurements = await passingPage.locator(".rendered-item[data-style-key]").evaluateAll((nodes) => nodes.map((node) => ({
      styleKey: node.dataset.styleKey,
      clientWidth: node.clientWidth,
      scrollWidth: node.scrollWidth,
      clientHeight: node.clientHeight,
      scrollHeight: node.scrollHeight,
      overflow: getComputedStyle(node).overflow,
      rect: node.getBoundingClientRect().toJSON(),
      canvasRect: node.closest(".rendered-items")?.getBoundingClientRect().toJSON(),
      children: [...node.children].map((child) => ({
        className: child.className,
        clientWidth: child.clientWidth,
        scrollWidth: child.scrollWidth,
        clientHeight: child.clientHeight,
        scrollHeight: child.scrollHeight,
      })),
    })));
    const frameMeasurement = await passingPage.locator(".preview-stage").evaluate((stage) => {
      const renderer = stage.querySelector(".promo-renderer");
      return {
        stageClass: stage.className,
        stageWidth: stage.getBoundingClientRect().width,
        rendererWidth: renderer?.getBoundingClientRect().width,
        rendererComputedWidth: renderer ? getComputedStyle(renderer).width : "",
      };
    });
    throw new Error(`Passing fixture was blocked: ${await passingPage.locator(".collision-actions").innerText()} ${JSON.stringify({ frameMeasurement, measurements })}`);
  }
  await passingSaveButton.click();
  await passingPage.getByText(/AI 프로모션 문서 revision 2 저장 완료/).waitFor();
  assert.equal(await passingPage.locator(".preview-quality-gate.is-failed").count(), 0);
  assert.equal(patchCount, 1);
  assert.equal(persistedQualityGate?.state, "passed");
  assert.equal(persistedQualityGate?.blockingCount, 0);
  assert.ok(persistedQualityGate?.results?.desktop);
  assert.ok(persistedQualityGate?.results?.mobile);
  assert.deepEqual(passingErrors, []);
  await passingPage.close();
  console.log("AI document quality gate browser test passed");
} catch (testError) {
  const bodyText = await page.locator("body").innerText().catch(() => "");
  console.error(bodyText.slice(0, 4000));
  if (passingPage) {
    const passingBodyText = await passingPage.locator("body").innerText().catch(() => "");
    console.error(passingBodyText.slice(0, 4000));
  }
  console.error(JSON.stringify(errors));
  await page.screenshot({ path: "/tmp/ai-document-quality-gate-browser-error.png", fullPage: true }).catch(() => undefined);
  throw testError;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
