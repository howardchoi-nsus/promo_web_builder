import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number(process.env.COMPONENT_GENERATION_E2E_PORT || 4196);
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
      if ((await fetch(`${origin}/prototype/index.html`)).ok) return;
    } catch { /* Server is starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Fixture server did not start.\n${serverOutput}`);
}

const sourceId = "11111111-1111-4111-8111-111111111111";
const runId = "22222222-2222-4222-8222-222222222222";
const tokenVersionId = "33333333-3333-4333-8333-333333333333";
const sourceImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X2NDWQAAAABJRU5ErkJggg==";

function proposal(id, name, confidence, sourceRegion, fields, children) {
  return {
    id,
    componentDefinition: {
      candidateKey: id,
      name,
      description: `${name} 자동 분석 후보`,
      sourceRegion,
      selected: true,
      fields,
      allowedSectionRoles: ["hero", "benefit", "footer"],
      reviewRequired: false,
      creationMode: "new-component",
      targetComponentId: null,
    },
    renderSpec: {
      contractVersion: 1,
      root: {
        nodeType: "element",
        tag: "article",
        semanticRole: "component",
        layout: { display: "grid", columns: 1 },
        children,
      },
      responsive: { mobile: { "root.layout.columns": 1 } },
      accessibility: {},
    },
    similarComponents: [],
    confidence,
    reviewNotes: [],
    validationResult: {
      ok: true,
      errors: [],
      metrics: { nodeCount: children.length + 1, fieldNodeCount: children.length, maxDepth: 1 },
    },
    appliedAt: null,
  };
}

const proposals = [
  proposal(
    "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    "프로모션 헤더",
    0.96,
    { x: 0, y: 0, width: 1, height: 0.18 },
    [{ fieldKey: "header_title", fieldKind: "text", textType: "title", name: "헤더 제목", defaultValue: "가을 프로모션" }],
    [{ nodeType: "field", tag: "h2", fieldKey: "header_title" }],
  ),
  proposal(
    "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
    "혜택 카드",
    0.91,
    { x: 0.08, y: 0.22, width: 0.84, height: 0.46 },
    [
      { fieldKey: "card_image", fieldKind: "image", name: "카드 이미지" },
      { fieldKey: "card_title", fieldKind: "text", textType: "title", name: "카드 제목", defaultValue: "특별 혜택" },
      { fieldKey: "card_cta", fieldKind: "cta", name: "카드 버튼", defaultValue: "자세히 보기" },
    ],
    [
      { nodeType: "field", tag: "img", fieldKey: "card_image" },
      { nodeType: "field", tag: "h2", fieldKey: "card_title" },
      { nodeType: "field", tag: "a", fieldKey: "card_cta" },
    ],
  ),
  proposal(
    "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3",
    "약관 푸터",
    0.88,
    { x: 0, y: 0.76, width: 1, height: 0.24 },
    [{ fieldKey: "footer_terms", fieldKind: "text", textType: "multi", name: "약관", defaultValue: "유의사항" }],
    [{ nodeType: "field", tag: "p", fieldKey: "footer_terms" }],
  ),
];

function runSnapshot() {
  return {
    id: runId,
    sourceId,
    status: "ready",
    componentIntent: "전체 프로모션 화면을 재사용 가능한 컴포넌트로 분리",
    allowedSectionRoles: ["hero", "benefit", "footer"],
    targetDesignTokenSetVersionId: tokenVersionId,
    source: {
      width: 1440,
      height: 2400,
      cropSpec: { x: 0, y: 0, width: 1, height: 1 },
      mimeType: "image/png",
      imageUrl: sourceImage,
    },
    proposals,
    proposal: proposals[0],
  };
}

let uploadBody = null;
let runBody = null;
let applyBody = null;
let restoredRunCount = 0;
let browser;

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const failedResponses = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("response", (response) => { if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`); });

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const fulfill = (body, status = 200) => route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });

    if (url.pathname === "/api/locale-snapshot") {
      return fulfill({ ok: true, locale: "ko", defaultLocale: "ko", revision: 1, messages: {}, defaultMessages: {} });
    }
    if (url.pathname === "/api/design-token-sets") {
      return fulfill({
        ok: true,
        tokenSets: [{
          id: "token-set",
          versionId: tokenVersionId,
          name: "프로모션 기본 토큰",
          isDefault: true,
          values: { "--promo-surface": "#ffffff", "--promo-ink": "#111111" },
        }],
      });
    }
    if (url.pathname === "/api/component-design-sources" && request.method() === "POST") {
      uploadBody = request.postDataJSON();
      return fulfill({ ok: true, source: { id: sourceId, imageUrl: sourceImage } }, 201);
    }
    if (url.pathname === "/api/component-generation-runs" && request.method() === "POST") {
      runBody = request.postDataJSON();
      return fulfill({ ok: true, run: runSnapshot() }, 201);
    }
    if (url.pathname === "/api/component-generation-runs" && request.method() === "GET") {
      restoredRunCount += 1;
      return fulfill({ ok: true, run: runSnapshot() });
    }
    if (url.pathname === "/api/component-generation-proposals-apply" && request.method() === "POST") {
      applyBody = request.postDataJSON();
      for (const item of proposals) {
        if (applyBody.proposalIds.includes(item.id)) item.appliedAt = "2026-09-14T03:00:00.000Z";
      }
      return fulfill({
        ok: true,
        succeeded: applyBody.proposalIds.length,
        failed: 0,
        results: applyBody.proposalIds.map((proposalId, index) => ({
          proposalId,
          ok: true,
          componentId: `bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb${index + 1}`,
          versionId: `cccccccc-cccc-4ccc-8ccc-ccccccccccc${index + 1}`,
          name: proposals.find((item) => item.id === proposalId)?.componentDefinition.name,
        })),
      }, 201);
    }
    if (url.pathname === "/api/item-component-render-spec-validate") {
      return fulfill({ ok: true, validation: { ok: true, errors: [] } });
    }
    return fulfill({ ok: true, templates: [], sections: [], documents: [], logs: [], settings: [], prompts: [] });
  });

  await page.goto(`${origin}/prototype/index.html?view=admin&tab=component-generation`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "이미지에서 DOM 컴포넌트 생성" }).waitFor();

  await page.locator('input[type="file"][accept*="image/png"]').setInputFiles({
    name: "full-promotion.png",
    mimeType: "image/png",
    buffer: Buffer.from(sourceImage.split(",")[1], "base64"),
  });
  await page.getByText("full-promotion.png", { exact: false }).waitFor();
  await page.getByRole("textbox", { name: "생성 목적" }).fill("전체 프로모션 화면을 재사용 가능한 컴포넌트로 분리");
  await page.getByText("hero", { exact: true }).click();
  await page.getByText("benefit", { exact: true }).click();
  await page.getByText("footer", { exact: true }).click();
  await page.getByRole("button", { name: "분석 시작" }).click();

  await page.getByRole("heading", { name: "3개 컴포넌트 후보" }).waitFor();
  assert.ok(uploadBody.imageDataUrl.startsWith("data:image/png;base64,"));
  assert.ok(uploadBody.analysisImageDataUrl.startsWith("data:image/png;base64,"));
  assert.deepEqual(uploadBody.cropSpec, { x: 0, y: 0, width: 1, height: 1 });
  assert.equal(runBody.sourceId, sourceId);
  assert.equal(runBody.componentIntent, "전체 프로모션 화면을 재사용 가능한 컴포넌트로 분리");
  assert.deepEqual(runBody.allowedSectionRoles, ["hero", "benefit", "footer"]);
  assert.equal(runBody.targetDesignTokenSetVersionId, tokenVersionId);
  assert.equal(await page.locator(".candidate-row").count(), 3);
  assert.equal(await page.locator(".candidate-box").count(), 3);

  await page.locator(".candidate-row").filter({ hasText: "혜택 카드" }).getByRole("button").click();
  await page.getByRole("heading", { name: "혜택 카드", exact: true }).waitFor();
  await page.getByText("3개 필드", { exact: true }).waitFor();
  await page.getByRole("button", { name: "mobile", exact: true }).click();
  assert.equal(await page.locator(".rs-viewport button.active").textContent(), "mobile");

  const applyButton = page.getByRole("button", { name: "선택 후보 컴포넌트 Draft 생성" });
  assert.equal(await applyButton.isDisabled(), true, "Mobile review must gate Draft creation");
  await page.locator(".candidate-row").filter({ hasText: "약관 푸터" }).getByRole("checkbox").uncheck();
  await page.getByText("Mobile 미리보기와 오버플로를 확인했습니다.", { exact: true }).click();
  assert.equal(await applyButton.isEnabled(), true);
  await applyButton.click();

  await page.getByText("Draft 생성 완료", { exact: true }).first().waitFor();
  assert.deepEqual(applyBody.proposalIds, [proposals[0].id, proposals[1].id]);
  assert.equal(await page.getByText("생성됨", { exact: true }).count(), 2);
  assert.equal(proposals[2].appliedAt, null, "Unchecked candidate must not be created");

  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "3개 컴포넌트 후보" }).waitFor();
  assert.ok(restoredRunCount >= 2, "Run must be restored after apply and browser reload");
  assert.equal(await page.getByText("생성됨", { exact: true }).count(), 2);
  assert.equal(await page.evaluate(() => localStorage.getItem("promo-component-generation-active-run")), runId);

  assert.deepEqual(pageErrors, [], `Page errors:\n${pageErrors.join("\n")}`);
  assert.deepEqual(consoleErrors, [], `Console errors:\n${consoleErrors.join("\n")}`);
  assert.deepEqual(failedResponses, [], `Failed responses:\n${failedResponses.join("\n")}`);
  console.log("Component image generation end-to-end browser test passed");
  await context.close();
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}
