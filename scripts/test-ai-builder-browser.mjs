import http from "node:http";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { overviewFingerprint } = require(path.join(root, "api", "_promo-overview-contract.js"));
const publicRoot = path.join(root, "prototype");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};
let proposalPollCount = 0;
let assetPollCount = 0;
let overviewParseCount = 0;
const overviewRequests = [];
let compositionRequest = null;
let applyRequest = null;
let chatStage = "idle";
let confirmedWireframeRevision = null;
let wireframeEditRequest = null;
let builderSessionReady = false;
let builderSessionRequestCount = 0;
let eventAuthFailureCount = 0;
let chatActionSequence = 0;
let editedHeroTitle = "Winter Giveaway";
const requirementsSaveRequests = [];
const chatMessages = [];
const snapshotWithAssetStatus = (status) => ({
  contractVersion: 3,
  documentRevision: 1,
  content: {
    formTemplate: { name: "Browser AI Promotion", templateKey: "browser-ai", designTokens: { values: {} } },
    sectionSnapshot: [{
      sectionKey: "hero",
      sectionRole: "hero",
      selectedLayoutKey: "stacked",
      items: [{ itemKey: "title", sourceItemKey: "title", fieldKind: "text", textType: "title" }],
    }],
    sectionInputs: { hero: { title: editedHeroTitle } },
    sectionOrder: ["hero"],
  },
  designSpec: {
    contractVersion: 1,
    theme: {},
    responsive: { mobileBreakpoint: 720, contentMaxWidth: 1280 },
    itemStyles: { "hero.title": { positionMode: "free", xPct: 5, yPx: 20, widthPct: 90, fontSize: 96 } },
    sectionStyles: { hero: { minHeight: 300 } },
    visibility: { items: {}, fields: {} },
    responsiveLayouts: { mobile: { itemStyles: {}, visibility: { items: {} } } },
  },
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
    response.end(JSON.stringify({ ok: true, capabilities: {
      aiMode: true, compositionV3: true, chatWorkspaceV1: true, contractVersion: 3,
    } }));
    return;
  }
  if (url.pathname === "/api/promo-composition-shells") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      versions: [{ id: "shell-browser", config: { isDefault: true, allowedLocales: ["en-US", "ko-KR"] } }],
    }));
    return;
  }
  if (url.pathname === "/api/promo-builder-session") {
    builderSessionReady = true;
    builderSessionRequestCount += 1;
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
    if (!builderSessionReady) {
      eventAuthFailureCount += 1;
      response.writeHead(401, { "Content-Type": "application/json" });
      response.end(JSON.stringify({
        error: "Builder event failed",
        code: "BUILDER_SESSION_REQUIRED",
        message: "A valid Builder session is required",
      }));
      return;
    }
    response.writeHead(202, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }
  if (url.pathname === "/api/promo-builder-chat-sessions" && request.method === "POST") {
    response.writeHead(201, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      session: {
        id: "session-browser", documentId: "document-browser", stage: chatStage,
        latestRequirementsRevision: chatStage === "idle" ? 0 : 1,
        latestWireframeRevision: confirmedWireframeRevision ? 1 : 0,
        confirmedWireframeRevision,
      },
      messages: chatMessages,
      requirements: null,
      wireframe: null,
    }));
    return;
  }
  if (url.pathname === "/api/promo-builder-chat-sessions" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      sessions: [{
        id: "session-history",
        documentId: "document-history",
        requestId: "request-history",
        title: "지난 겨울 프로모션",
        preview: "겨울 신규 회원 이벤트를 만들어 주세요.",
        stage: "completed",
        updatedAt: "2026-11-05T03:00:00.000Z",
      }],
    }));
    return;
  }
  if (url.pathname === "/api/promo-builder-chat-messages" && request.method === "POST") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const message = {
      ...body.message,
      actions: (body.message.actions || []).map((action) => ({
        ...action, id: `action-${++chatActionSequence}`, status: "proposed", issuedStage: chatStage,
      })),
    };
    chatMessages.push(message);
    response.writeHead(201, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, message }));
    return;
  }
  if (url.pathname === "/api/promo-builder-requirements-revisions" && request.method === "POST") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    requirementsSaveRequests.push(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    chatStage = "requirements_review";
    response.writeHead(201, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, requirements: {
      revision: requirementsSaveRequests.length,
      fingerprint: `requirements-browser-${requirementsSaveRequests.length}`,
    } }));
    return;
  }
  if (url.pathname === "/api/promo-builder-chat-actions" && request.method === "POST") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (body.actionKey === "confirm_requirements") chatStage = "wireframe_review";
    if (body.actionKey === "approve_wireframe") {
      chatStage = "finalizing";
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, action: { id: body.actionId, key: body.actionKey }, stage: chatStage }));
    return;
  }
  if (url.pathname === "/api/promo-builder-wireframes" && request.method === "POST") {
    chatStage = "wireframe_review";
    response.writeHead(201, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, wireframe: {
      revision: 1,
      structureFingerprint: "a".repeat(64),
      status: "draft",
    } }));
    return;
  }
  if (url.pathname === "/api/promo-builder-wireframe-edits" && request.method === "POST") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    wireframeEditRequest = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const contentEdit = wireframeEditRequest.edits.find((edit) => edit.type === "update-content");
    if (contentEdit) editedHeroTitle = contentEdit.valueText;
    const snapshot = snapshotWithAssetStatus("ready");
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      proposal: {
        id: "proposal-browser",
        status: "ready",
        contractVersion: 3,
        autoApplicable: true,
        validation: { ok: true, errors: [], warnings: [] },
        snapshot,
      },
      wireframe: {
        revision: 1,
        requirementsRevision: 2,
        structureFingerprint: "a".repeat(64),
        status: "draft",
      },
      overview: compositionRequest.overview,
    }));
    return;
  }
  if (url.pathname === "/api/promo-builder-wireframes-confirm" && request.method === "POST") {
    confirmedWireframeRevision = 1;
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, wireframe: {
      revision: 1,
      structureFingerprint: "a".repeat(64),
      status: "confirmed",
    } }));
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
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    overviewRequests.push(JSON.parse(Buffer.concat(chunks).toString("utf8")));
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
    const needsPeriod = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      overview: {
        title: "여름 신규 고객 충전 이벤트",
        contentSections: [{
          sectionKey: "benefits",
          sectionType: "benefits",
          title: "주요 혜택",
          description: "혜택을 카드로 안내합니다.",
          presentationHint: "cards",
          items: [{
            itemKey: "welcome-card",
            title: "신규 고객 보너스",
            description: "첫 충전 고객을 위한 혜택",
            eyebrow: "WELCOME",
            badge: "신규",
            value: "100%",
            imageIntent: "여름 분위기의 보너스 카드",
            ctaLabel: "혜택 보기",
            ctaUrl: "",
            confirmationRequired: true,
          }],
          cta: { label: "전체 혜택", url: "", confirmationRequired: true },
          media: { role: "benefit-visual", imageIntent: "여름 혜택 키비주얼", altText: "", mobileImageRequired: true },
          required: true,
        }],
        additionalInformation: [{
          label: "이벤트 기간",
          value: needsPeriod ? "사용자 확인 필요" : "2026년 11월 15일부터 12월 31일까지",
          description: needsPeriod ? "기간 입력 필요" : "확정된 프로모션 운영 기간",
          confirmationRequired: needsPeriod,
        }],
        notices: [],
        legalInformation: [],
      },
      inputLocale: "ko",
      overviewFingerprint: "browser-test-overview",
    }));
    return;
  }
  if (url.pathname === "/api/promo-page-composition-proposals" && request.method === "POST") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    compositionRequest = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const currentFingerprint = overviewFingerprint(compositionRequest.overview);
    if (compositionRequest.overviewFingerprint !== currentFingerprint) {
      response.writeHead(409, { "Content-Type": "application/json" });
      response.end(JSON.stringify({
        error: "Overview changed before composition planning",
        code: "OVERVIEW_FINGERPRINT_MISMATCH",
        overviewFingerprint: currentFingerprint,
      }));
      return;
    }
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
        autoApplicable: true,
        validation: { ok: true, errors: [], warnings: [] },
        pollAfterMs: 20,
        snapshot: snapshotWithAssetStatus("ready"),
      },
    }));
    return;
  }
  if (url.pathname === "/api/promo-page-composition-preview" && request.method === "POST") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      ok: true,
      documentId: "document-browser",
      proposalId: "proposal-browser",
      documentRevision: 0,
      snapshot: snapshotWithAssetStatus("ready"),
      renderFingerprint: "preview-render-browser",
    }));
    return;
  }
  if (url.pathname === "/api/promo-page-composition-apply" && request.method === "POST") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    applyRequest = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    await new Promise((resolve) => setTimeout(resolve, 150));
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
await page.addInitScript(() => {
  localStorage.setItem("promoAiBuilder.chatWorkspace.v1", JSON.stringify({
    documentId: "legacy-document",
    chatSessionId: "legacy-session",
    messages: [{ id: "legacy-message", role: "user", text: "자동 복원되면 안 되는 이전 대화" }],
  }));
});

try {
  await page.goto(`${origin}/create-promo.html`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("header.shell-utility-bar").count(), 0);
  await page.getByRole("heading", { name: "프로모션 제작 방식을 선택하세요" }).waitFor();
  assert.equal(await page.getByRole("button", { name: /AI 모드/ }).isEnabled(), true);
  await page.getByRole("button", { name: /AI 모드/ }).click();
  await page.getByText("프로모션 제작", { exact: true }).waitFor();
  assert.equal(await page.getByText("자동 복원되면 안 되는 이전 대화").count(), 0);
  await page.getByRole("button", { name: "기존 대화 목록 열기" }).click();
  await page.getByRole("dialog", { name: "기존 대화 목록" }).waitFor();
  await page.getByRole("button", { name: /자동 복원되면 안 되는 이전 대화.*이전 로컬 대화/ }).waitFor();
  await page.getByText("이전 로컬 대화").waitFor();
  await page.getByText("지난 겨울 프로모션").waitFor();
  assert.equal(await page.getByRole("button", { name: "새 대화" }).isEnabled(), true);
  await page.getByRole("button", { name: "대화 목록 닫기" }).click();
  assert.equal(await page.locator('link[href*="visual-editor-assets/ai-builder.css"]').count(), 1);
  const workspaceStyles = await page.locator(".ai-chat-workspace").evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      display: styles.display,
      gridColumns: styles.gridTemplateColumns,
    };
  });
  assert.equal(workspaceStyles.display, "grid");
  assert.match(workspaceStyles.gridColumns, /px/);
  const chatInput = page.getByPlaceholder("무엇을 만들고 싶으신가요?");
  await chatInput.fill("여름 신규 고객 충전 이벤트");
  const sendButton = page.getByRole("button", { name: "전송" });
  assert.equal(await sendButton.isEnabled(), true);
  await Promise.all([
    sendButton.click({ force: true }),
    sendButton.click({ force: true }),
  ]);
  await page.getByText("프로모션 개요를 분석하고 있습니다.").waitFor();
  await page.waitForTimeout(750);
  const chatTurnScroll = await page.locator(".ai-chat-messages").evaluate((container) => {
    const target = container.querySelector(".ai-chat-message.is-user.is-turn-anchor");
    const containerRect = container.getBoundingClientRect();
    const targetRect = target?.getBoundingClientRect();
    return {
      targetCount: container.querySelectorAll(".ai-chat-message.is-turn-anchor").length,
      topOffset: targetRect ? targetRect.top - containerRect.top : null,
      containerHeight: containerRect.height,
      scrollBehavior: getComputedStyle(container).scrollBehavior,
      hasTurnSpace: getComputedStyle(container, "::after").minHeight !== "0px",
      turnSpaceHeight: Number.parseFloat(getComputedStyle(container, "::after").height),
    };
  });
  assert.equal(chatTurnScroll.targetCount, 1);
  assert.ok(
    chatTurnScroll.topOffset >= 0 && chatTurnScroll.topOffset < chatTurnScroll.containerHeight * .75,
    `user turn should remain clearly visible during processing: ${JSON.stringify(chatTurnScroll)}`,
  );
  assert.equal(chatTurnScroll.scrollBehavior, "smooth");
  assert.equal(chatTurnScroll.hasTurnSpace, true);
  assert.ok(chatTurnScroll.turnSpaceHeight <= 96, `processing spacer must stay compact: ${JSON.stringify(chatTurnScroll)}`);
  assert.equal(await page.locator(".ai-chat-thinking").count(), 1);
  assert.equal(await page.locator('.ai-chat-message[role="status"][aria-busy="true"]').count(), 1);
  await page.getByText("AI 응답 오류로 재시도하고 있습니다. (2/3)").waitFor();
  if (process.env.CAPTURE_AI_PROGRESS_QA === "1") {
    await page.screenshot({ path: path.join(root, "design-qa-implementation.png"), fullPage: true });
  }
  await page.getByText("요구사항 분석을 완료했습니다.").waitFor();
  await page.getByText("프로모션 진행 기간은 언제부터 언제까지인가요?").waitFor();
  await page.getByRole("button", { name: "AI가 구성하고 미리보기 생성" }).waitFor();
  assert.equal(chatMessages.filter((message) => message.role === "user").length, 1);
  assert.equal(await page.locator(".ai-chat-message.is-user").count(), 1);
  assert.equal(overviewParseCount, 2, "rapid duplicate submit must start only one analysis request with one retry");
  assert.equal(compositionRequest, null, "composition must wait for clarification and user confirmation");
  await chatInput.fill("2026년 11월 15일부터 12월 31일까지 진행해줘");
  await page.getByRole("button", { name: "전송" }).click();
  await page.getByRole("button", { name: "페이지 미리보기 생성" }).waitFor();
  assert.equal(
    await page.locator(".ai-chat-message.is-assistant").filter({ hasText: "프로모션 진행 기간은 언제부터 언제까지인가요?" }).count(),
    1,
    "an answered clarification field must not be asked again",
  );
  const latestOverviewInstruction = overviewRequests.at(-1)?.naturalLanguage || "";
  assert.match(latestOverviewInstruction, /\[최초 프로모션 요청\]/);
  assert.match(latestOverviewInstruction, /여름 신규 고객 충전 이벤트/);
  assert.match(latestOverviewInstruction, /2026년 11월 15일부터 12월 31일까지 진행해줘/);
  assert.equal((latestOverviewInstruction.match(/여름 신규 고객 충전 이벤트/g) || []).length, 1);
  assert.equal(compositionRequest, null, "composition must not start before the user confirms the organized brief");
  await page.getByRole("button", { name: "요청 요약" }).click();
  await page.locator(".ai-requirement-summary__title strong", { hasText: "여름 신규 고객 충전 이벤트" }).waitFor();
  await page.getByText("예정 콘텐츠", { exact: true }).waitFor();
  assert.equal(await page.getByRole("button", { name: "페이지 구성 미리보기" }).count(), 1);
  assert.equal(await page.getByRole("button", { name: "페이지 구성 미리보기" }).isDisabled(), true);
  await page.getByRole("button", { name: "페이지 미리보기 생성" }).click();
  for (let count = 0; count < 50 && !compositionRequest; count += 1) {
    await page.waitForTimeout(20);
  }
  assert.ok(compositionRequest, "composition request should be received");
  assert.equal(compositionRequest.overview.title, "여름 신규 고객 충전 이벤트");
  assert.equal(compositionRequest.overview.contentSections[0].items[0].title, "신규 고객 보너스");
  assert.equal(compositionRequest.locale, "ko-KR");
  assert.equal(compositionRequest.overviewFingerprint, overviewFingerprint(compositionRequest.overview));
  assert.notEqual(compositionRequest.overviewFingerprint, "browser-test-overview");
  await page.getByText("페이지 구성 미리보기 생성을 완료했습니다.").waitFor({ timeout: 10000 });
  assert.equal(applyRequest, null, "final design must wait for page preview approval");
  assert.equal(await page.getByRole("button", { name: "페이지 구성 미리보기" }).isEnabled(), true);
  await page.getByRole("button", { name: "내용·배치 수정" }).click();
  const wireframeTitle = page.locator(".ai-wireframe-copy textarea").first();
  await wireframeTitle.fill("Edited Winter Giveaway");
  await page.getByRole("button", { name: "수정 저장" }).click();
  await page.getByText("페이지 구성의 문구와 배치 수정을 저장했습니다.").waitFor();
  assert.ok(wireframeEditRequest, "wireframe edits should be persisted before approval");
  assert.equal(
    wireframeEditRequest.edits.find((edit) => edit.type === "update-content")?.valueText,
    "Edited Winter Giveaway",
  );
  await page.getByRole("button", { name: "페이지 구성 승인" }).last().click();
  for (let count = 0; count < 250 && !applyRequest; count += 1) await page.waitForTimeout(20);
  assert.ok(applyRequest, `approved page preview should apply the edited design: ${JSON.stringify({
    chatStage,
    confirmedWireframeRevision,
    recentMessages: chatMessages.slice(-4).map((message) => ({ role: message.role, type: message.type, text: message.text })),
  })}`);
  await page.getByText("AI 이미지를 생성하고 있습니다.").waitFor();
  await page.getByText("디자인 미리보기를 완성했습니다.").waitFor({ timeout: 10000 });
  await page.waitForTimeout(350);
  assert.equal(await page.locator(".ai-chat-messages.has-active-turn").count(), 0);
  assert.equal(await page.locator(".ai-chat-thinking").count(), 0);
  const messagePresentation = await page.locator(".ai-chat-messages").evaluate((container) => {
    const user = container.querySelector(".ai-chat-message.is-user");
    const assistant = container.querySelector(".ai-chat-message.is-assistant");
    const userStyles = getComputedStyle(user);
    const assistantStyles = getComputedStyle(assistant);
    return {
      userBackground: userStyles.backgroundColor,
      userRadius: userStyles.borderRadius,
      assistantBackground: assistantStyles.backgroundColor,
      assistantBorderWidth: assistantStyles.borderTopWidth,
      assistantShadow: assistantStyles.boxShadow,
    };
  });
  assert.notEqual(messagePresentation.userBackground, "rgba(0, 0, 0, 0)");
  assert.notEqual(messagePresentation.userRadius, "0px");
  assert.equal(messagePresentation.assistantBackground, "rgba(0, 0, 0, 0)");
  assert.equal(messagePresentation.assistantBorderWidth, "0px");
  assert.equal(messagePresentation.assistantShadow, "none");
  assert.equal(applyRequest.chatSessionId, "session-browser");
  assert.equal(applyRequest.confirmedWireframeRevision, 1);
  assert.equal(applyRequest.structureFingerprint, "a".repeat(64));
  assert.equal(await page.getByRole("button", { name: "디자인 미리보기" }).isEnabled(), true);
  assert.equal(await page.locator(".ai-builder-result").count(), 1);
  assert.equal(await page.getByText("디자인 생성 내부 승인").count(), 0);
  await page.getByText("Edited Winter Giveaway", { exact: true }).waitFor();
  await page.getByRole("button", { name: "모바일" }).click();
  assert.equal(await page.locator(".ai-builder-preview-stage").getAttribute("data-viewport"), "mobile");
  await page.waitForTimeout(250);
  const mobilePreviewWidth = await page.locator(".ai-builder-preview-canvas").evaluate((element) => element.getBoundingClientRect().width);
  assert.ok(mobilePreviewWidth <= 390);
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileActions = await page.locator(".ai-builder-actions").evaluate((element) => {
    const styles = getComputedStyle(element);
    const buttons = [...element.querySelectorAll("button")].map((button) => button.getBoundingClientRect());
    return {
      display: styles.display,
      columnCount: styles.gridTemplateColumns.split(" ").length,
      buttonWidths: buttons.map((button) => button.width),
      buttonHeights: buttons.map((button) => button.height),
    };
  });
  assert.equal(mobileActions.display, "grid");
  assert.equal(mobileActions.columnCount, 2);
  assert.ok(mobileActions.buttonWidths.every((width) => width >= 60));
  assert.ok(mobileActions.buttonHeights.every((height) => height < 90));
  await page.waitForFunction(() => {
    const element = document.querySelector(".rendered-text--title");
    if (!element) return false;
    const size = Number.parseFloat(getComputedStyle(element).fontSize);
    return size >= 32 && size <= 52;
  });
  const mobileTitleFontSize = await page.locator(".rendered-text--title").evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).fontSize)
  ));
  assert.ok(mobileTitleFontSize >= 32 && mobileTitleFontSize <= 52);
  assert.match(page.url(), /create-promo\.html/);
  assert.ok(await page.evaluate(() => localStorage.getItem("promoAiBuilder.chatWorkspace.v1")));
  assert.ok(await page.evaluate(() => sessionStorage.getItem("promoAiBuilder.activeChat.v2")));
  assert.equal(builderSessionRequestCount, 1);
  assert.equal(eventAuthFailureCount, 0);
  assert.deepEqual(errors, []);
  console.log("AI Builder browser test passed");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
