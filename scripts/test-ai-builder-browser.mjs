import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "prototype");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};
let proposalPollCount = 0;
let assetPollCount = 0;
let overviewParseCount = 0;
const snapshotWithAssetStatus = (status) => ({
  contractVersion: 3,
  documentRevision: 1,
  content: {
    formTemplate: { name: "Browser AI Promotion", templateKey: "browser-ai", designTokens: { values: {} } },
    sectionSnapshot: [],
    sectionInputs: {},
    sectionOrder: [],
  },
  designSpec: { contractVersion: 1, theme: {}, itemStyles: {}, sectionStyles: {}, visibility: { items: {}, fields: {} } },
  assets: {
    contractVersion: 1,
    items: status === "ready" ? { "asset-hero": { proxyUrl: "/asset-ready.png" } } : {},
    requests: [{
      assetRequestId: "asset-hero",
      pageSectionInstanceId: "hero",
      targetType: "section-key-visual",
      status,
    }],
  },
});

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  if (url.pathname === "/api/promo-builder-capabilities") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, capabilities: { aiMode: true, compositionV3: true, contractVersion: 3 } }));
    return;
  }
  if (url.pathname === "/api/promo-composition-shells") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      versions: [{ id: "shell-browser", config: { isDefault: true, allowedLocales: ["ko-KR"] } }],
    }));
    return;
  }
  if (url.pathname === "/api/promo-builder-session") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, session: { authenticated: false } }));
    return;
  }
  if (url.pathname === "/api/promo-builder-documents" && request.method === "POST") {
    response.writeHead(201, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      document: { id: "document-browser", mode: "ai", status: "draft", currentDocumentRevision: 0 },
    }));
    return;
  }
  if (url.pathname === "/api/promo-builder-events") {
    response.writeHead(202, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }
  if (url.pathname === "/api/prompt-execution-display") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      type: url.searchParams.get("type"),
      executionDisplay: {
        providerIconKey: "openai",
        providerLabel: "OpenAI",
        modelLabel: "gpt-4.1-mini",
      },
    }));
    return;
  }
  if (url.pathname === "/api/promo-overview-parse" && request.method === "POST") {
    overviewParseCount += 1;
    if (overviewParseCount === 1) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      response.writeHead(502, { "Content-Type": "application/json" });
      response.end(JSON.stringify({
        error: "Promotion overview parsing failed",
        message: "Internal error encountered.",
        code: "api_error",
        retryable: true,
        retryPolicy: { maxAttempts: 3, retryBaseMs: 300, retryMaxMs: 300 },
        requestId: "overview-provider-request",
        providerErrorType: "api_error",
        executionDisplay: { providerIconKey: "openai", providerLabel: "OpenAI", modelLabel: "gpt-4.1-mini" },
      }));
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      overview: { title: "여름 신규 고객 충전 이벤트" },
      overviewFingerprint: "browser-test-overview",
    }));
    return;
  }
  if (url.pathname === "/api/promo-page-composition-proposals" && request.method === "POST") {
    response.writeHead(202, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      proposal: { id: "proposal-browser", status: "queued", contractVersion: 3 },
      executionDisplay: { providerIconKey: "openai", providerLabel: "OpenAI", modelLabel: "gpt-4.1-mini" },
    }));
    return;
  }
  if (url.pathname === "/api/promo-page-composition-proposals" && request.method === "GET") {
    proposalPollCount += 1;
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      proposal: {
        id: "proposal-browser",
        status: proposalPollCount > 1 ? "ready" : "processing",
        contractVersion: 3,
        pollAfterMs: 20,
      },
    }));
    return;
  }
  if (url.pathname === "/api/promo-page-composition-apply" && request.method === "POST") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      revision: 1,
      snapshot: snapshotWithAssetStatus("pending"),
      assetJobs: [{ id: "job-hero", assetRequestId: "asset-hero", status: "queued" }],
    }));
    return;
  }
  if (url.pathname === "/api/promo-builder-documents" && request.method === "GET") {
    assetPollCount += 1;
    const status = assetPollCount > 1 ? "ready" : "processing";
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      document: { id: "document-browser", currentDocumentRevision: 1 },
      snapshot: snapshotWithAssetStatus(status),
    }));
    return;
  }
  const relative = url.pathname.startsWith("/prototype/")
    ? url.pathname.slice("/prototype/".length)
    : url.pathname.replace(/^\/+/, "");
  const file = path.join(publicRoot, relative || "create-promo.html");
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
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto(`${origin}/create-promo.html`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "프로모션 제작 방식을 선택하세요" }).waitFor();
  assert.equal(await page.getByRole("button", { name: /AI 모드/ }).isEnabled(), true);
  await page.getByRole("button", { name: /AI 모드/ }).click();
  await page.getByRole("heading", { name: "어떤 프로모션을 만들까요?" }).waitFor();
  assert.equal(await page.locator('link[href*="visual-editor-assets/ai-builder.css"]').count(), 1);
  const cardStyles = await page.locator(".ai-builder-card").evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      padding: styles.padding,
      borderWidth: styles.borderTopWidth,
      borderRadius: styles.borderRadius,
    };
  });
  assert.notEqual(cardStyles.padding, "0px");
  assert.notEqual(cardStyles.borderWidth, "0px");
  assert.notEqual(cardStyles.borderRadius, "0px");
  await page.getByLabel("프로모션 설명").fill("여름 신규 고객 충전 이벤트");
  assert.equal(await page.getByRole("button", { name: "AI 개요 분석" }).isEnabled(), true);
  await page.getByRole("button", { name: "AI 개요 분석" }).click();
  const progress = page.locator('.ai-composition-progress[data-stage="analyzing_overview"]');
  await progress.waitFor();
  await page.getByText("프로모션 개요를 분석하고 있습니다.").waitFor();
  await page.getByText("OpenAI · gpt-4.1-mini").waitFor();
  await page.getByText("AI 응답 오류로 재시도하고 있습니다. (2/3)").waitFor();
  assert.equal(await page.locator(".ai-builder-card").count(), 0);
  assert.equal(await page.locator(".ai-composition-progress__animation").count(), 1);
  const progressStyles = await progress.evaluate((element) => {
    const styles = getComputedStyle(element);
    const message = getComputedStyle(element.querySelector(".ai-execution-indicator__message"));
    return {
      height: element.getBoundingClientRect().height,
      display: styles.display,
      textAlign: styles.textAlign,
      messageAnimation: message.animationName,
    };
  });
  assert.equal(progressStyles.display, "grid");
  assert.equal(progressStyles.textAlign, "center");
  assert.ok(progressStyles.height >= page.viewportSize().height - 100);
  assert.equal(progressStyles.messageAnimation, "ai-execution-pulse");
  await page.getByRole("heading", { name: "AI 분석 결과를 확인하세요" }).waitFor();
  await page.getByRole("button", { name: "AI로 프로모션 생성하기" }).click();
  await page.getByText("프로모션 구조를 구성하고 있습니다.").waitFor();
  await page.getByText("프로모션 구조를 생성하고 있습니다.").waitFor();
  assert.equal(await page.locator(".registry-proposal-review").count(), 0);
  assert.equal(await page.locator(".ai-builder-result").count(), 0);
  await page.waitForTimeout(2500);
  assert.match(page.url(), /create-promo\.html/);
  assert.equal(await page.locator(".ai-builder-result").count(), 0);
  await page.waitForURL(/visual-editor\.html\?mode=ai-document/, { timeout: 10000 });
  assert.doesNotMatch(page.url(), /mode=output/);
  assert.deepEqual(errors, []);
  console.log("AI Builder browser test passed");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
