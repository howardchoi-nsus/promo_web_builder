const { randomUUID } = require("node:crypto");
const { validatePromoPageGenerationResult } = require("./_promo-page-generation-contract");
const {
  forwardPromoPageGeneration,
  generationReadiness,
  requireConsoleAccess,
} = require("./_promo-page-generation-proxy");

const DEFAULT_INPUT = Object.freeze({
  brand: "Promo Web Builder",
  designDirection: "명확한 정보 위계와 넉넉한 여백을 사용하는 텍스트 중심 프로모션",
  title: "가을 멤버 위크",
  market: "KR",
  locale: "ko-KR",
  leadText: "이번 시즌 멤버를 위한 혜택을 한눈에 확인하세요.",
  subline: "기간 내 대상 고객에게만 제공됩니다.",
  ctaLabel: "혜택 확인하기",
  ctaUrl: "/benefits/autumn",
  termsText: "대상 및 기간 등 자세한 조건은 프로모션 유의사항을 확인해 주세요.",
});

const FIELD_LIMITS = Object.freeze({
  brand: 80,
  designDirection: 240,
  title: 120,
  market: 20,
  locale: 20,
  leadText: 300,
  subline: 300,
  ctaLabel: 60,
  ctaUrl: 500,
  termsText: 1_200,
});

const QUALITY_CHECKS = Object.freeze([
  "CONTENT_FIDELITY: PASS",
  "RESPONSIVE_1440: PASS",
  "RESPONSIVE_390: PASS",
  "ACCESSIBILITY: PASS",
  "CONTRAST: PASS",
  "OVERFLOW: PASS",
  "LEGAL_VISIBILITY: PASS",
  "TOKEN_DISCIPLINE: PASS",
  "TEXT_FIRST_MVP: PASS",
  "DUPLICATE_COPY: PASS",
]);

function parseBody(value) {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      throw Object.assign(new Error("Request body must be valid JSON"), {
        statusCode: 400,
        code: "QUALITY_TEST_BODY_INVALID",
      });
    }
  }
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function cleanText(value, fallback, limit, field) {
  const normalized = String(value ?? fallback ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    throw Object.assign(new Error(`${field} is required`), {
      statusCode: 400,
      code: "QUALITY_TEST_INPUT_REQUIRED",
      field,
    });
  }
  if (normalized.length > limit) {
    throw Object.assign(new Error(`${field} is too long`), {
      statusCode: 400,
      code: "QUALITY_TEST_INPUT_TOO_LONG",
      field,
    });
  }
  return normalized;
}

function normalizeInput(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const input = Object.fromEntries(Object.entries(FIELD_LIMITS).map(([field, limit]) => [
    field,
    cleanText(source[field], DEFAULT_INPUT[field], limit, field),
  ]));
  if (!/^(?:https?:\/\/|\/(?!\/)|#[a-z0-9_-]+$)/i.test(input.ctaUrl)) {
    throw Object.assign(new Error("CTA URL must use http(s), a root-relative path, or a fragment"), {
      statusCode: 400,
      code: "QUALITY_TEST_CTA_URL_INVALID",
      field: "ctaUrl",
    });
  }
  return input;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildFixture(input) {
  const html = `<main class="promo-generated-page">
  <section class="promo-hero" aria-labelledby="promo-title">
    <p class="promo-eyebrow">${escapeHtml(input.brand)}</p>
    <h1 id="promo-title">${escapeHtml(input.title)}</h1>
    <p class="promo-lead">${escapeHtml(input.leadText)}</p>
    <p class="promo-subline">${escapeHtml(input.subline)}</p>
    <a class="promo-cta" href="${escapeHtml(input.ctaUrl)}">${escapeHtml(input.ctaLabel)}</a>
  </section>
  <footer class="promo-legal"><p>${escapeHtml(input.termsText)}</p></footer>
</main>`;
  const css = `.promo-generated-page {
  width: 100%;
  min-width: 0;
  min-height: 100vh;
  padding: 88px clamp(28px, 8vw, 132px) 48px;
  color: #17201c;
  background: #f2f6f3;
  font-family: Inter, Arial, sans-serif;
}
.promo-generated-page .promo-hero { max-width: 820px; margin: 0 auto; }
.promo-generated-page .promo-eyebrow { margin: 0 0 22px; color: #176b4d; font-size: 14px; letter-spacing: .08em; text-transform: uppercase; }
.promo-generated-page h1 { max-width: 760px; margin: 0; font-size: clamp(48px, 7vw, 104px); line-height: .98; letter-spacing: -.045em; }
.promo-generated-page .promo-lead { max-width: 680px; margin: 32px 0 0; font-size: clamp(21px, 2.2vw, 30px); line-height: 1.4; }
.promo-generated-page .promo-subline { max-width: 620px; margin: 16px 0 0; color: #44514b; font-size: 17px; line-height: 1.6; }
.promo-generated-page .promo-cta {
  display: inline-flex;
  min-width: 180px;
  min-height: 52px;
  margin-top: 36px;
  padding: 14px 24px;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #176b4d;
  text-decoration: none;
}
.promo-generated-page .promo-cta:focus-visible { outline: 3px solid #b42318; outline-offset: 4px; }
.promo-generated-page .promo-legal { max-width: 820px; margin: 104px auto 0; padding-top: 22px; border-top: 1px solid #89938e; }
.promo-generated-page .promo-legal p { margin: 0; color: #3d4943; font-size: 14px; line-height: 1.7; }
@media (max-width: 420px) {
  .promo-generated-page { min-height: 100vh; padding: 48px 20px 28px; }
  .promo-generated-page h1 { font-size: 50px; line-height: 1.02; }
  .promo-generated-page .promo-lead { margin-top: 24px; font-size: 21px; }
  .promo-generated-page .promo-cta { width: 100%; }
  .promo-generated-page .promo-legal { margin-top: 72px; }
}
@media (prefers-reduced-motion: reduce) {
  .promo-generated-page, .promo-generated-page * { animation-duration: 0s !important; transition-duration: 0s !important; }
}`;
  return {
    designIntent: input.designDirection,
    layoutSummary: "단일 컬럼의 텍스트 중심 히어로와 분리된 유의사항 영역",
    mdComplianceMap: {
      layoutPhilosophy: "콘텐츠 중요도에 따른 단일 컬럼 정보 위계",
      visualMood: "차분하고 명확한 에디토리얼 표현",
      spacingRhythm: "일관된 여백과 섹션 간 구분",
      componentStyle: "이미지 없이 텍스트와 단색 면으로 구성",
      depthAndEffects: "장식 효과 없이 평면적인 정보 전달",
      shapeAndRadius: "명확한 직사각형 CTA",
      promoPageImplications: "핵심 혜택과 CTA, 유의사항을 순서대로 노출",
      dosApplied: ["명확한 제목 위계", "모바일 CTA 전체 폭"],
      dontsAvoided: ["이미지 사용 안 함", "불필요한 모션 사용 안 함"],
      notColorFontOnlyProof: "제목, 설명, CTA, 유의사항을 독립된 구조와 간격으로 그룹화해 색상이나 글꼴만으로 구분하지 않았습니다.",
    },
    html,
    css,
    qualityChecks: [...QUALITY_CHECKS],
  };
}

function buildPreviewDocument(result, language) {
  const safeLanguage = String(language || "ko").replace(/[^a-z0-9-]/gi, "") || "ko";
  return `<!doctype html><html lang="${safeLanguage}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src 'none'; font-src 'none'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"><style>*{box-sizing:border-box}html,body{margin:0;min-width:0}${result.css}</style></head><body>${result.html}</body></html>`;
}

function requiredVisibleCopy(input) {
  return [input.title, input.leadText, input.subline, input.ctaLabel, input.termsText];
}

function buildLivePayload(input, { now = Date.now(), randomId = randomUUID } = {}) {
  return {
    id: `quality-${now}-${String(randomId()).replace(/[^a-z0-9]/gi, "").slice(0, 8)}`,
    md: {
      brand: input.brand,
      slug: "output-quality-test",
      designConcept: {
        summary: input.designDirection,
        promptContext: `Create a text-first promotion page. ${input.designDirection}. Do not use images or external media.`,
        json: {
          brandConcept: input.designDirection,
          layoutPhilosophy: "Clear single-page promotion hierarchy",
          visualMood: "Calm, confident, and precise",
          spacingRhythm: "Generous section spacing with readable line lengths",
          componentStyle: "Text-first solid surfaces",
          depthAndEffects: "Minimal depth without decorative effects",
          shapeAndRadius: "Restrained geometry",
          promoPageImplications: "Preserve every supplied phrase and prioritize the CTA and legal copy",
        },
      },
      summary: { categories: ["promotion"], colors: [], fonts: [] },
    },
    promo: {
      title: input.title,
      market: input.market,
      locale: input.locale,
      leadText: input.leadText,
      subline: input.subline,
      ctaLabel: input.ctaLabel,
      ctaUrl: input.ctaUrl,
      termsText: input.termsText,
    },
    design: {
      direction: input.designDirection,
      contentMode: "text-first",
      imagePolicy: "excluded",
    },
    sourceDesign: {},
    styleSource: "quality-test-console",
    styleSourceLabel: "Output Quality Test",
    hasOverride: false,
    output: {
      format: "desktop_web_page",
      viewport: { width: 1440, minWidth: 1180 },
    },
  };
}

function publicPromptMeta(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return Object.fromEntries(["id", "type", "name", "version", "renderedPromptHash", "variableHash"]
    .filter((key) => source[key] !== undefined)
    .map((key) => [key, source[key]]));
}

function safeUpstreamMessage(body) {
  const raw = body && typeof body === "object"
    ? body.userMessage || body.message || body.error
    : "";
  return String(raw || "생성 워크플로 실행에 실패했습니다.").replace(/\s+/g, " ").trim().slice(0, 500);
}

function validatePagePath(value) {
  const path = String(value || "").trim();
  if (!/^\/api\/promo-page-generation-artifact\?(?=[^#]*\bid=)(?=[^#]*\btoken=)[^#]+$/.test(path)) {
    throw Object.assign(new Error("The generation workflow did not return a signed result path"), {
      statusCode: 502,
      code: "GENERATION_RESULT_PATH_INVALID",
    });
  }
  return path;
}

function requirePassingBrowserQualityGate(value) {
  const gate = value && typeof value === "object" && !Array.isArray(value) ? value : null;
  if (!gate || gate.contractVersion !== 1 || gate.state !== "passed" || Number(gate.blockingCount) !== 0) {
    throw Object.assign(new Error("The browser quality gate did not return a passing result"), {
      statusCode: 502,
      code: "BROWSER_GATE_RESULT_INVALID",
    });
  }
  const expected = {
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
  };
  for (const [key, viewport] of Object.entries(expected)) {
    const result = gate.results?.[key];
    if (!result || result.state !== "passed" || Number(result.blockingCount) !== 0
      || Number(result.width) !== viewport.width || Number(result.height) !== viewport.height
      || !Array.isArray(result.diagnostics) || result.diagnostics.length !== 0) {
      throw Object.assign(new Error(`The ${key} browser quality result is missing or invalid`), {
        statusCode: 502,
        code: "BROWSER_GATE_VIEWPORT_RESULT_INVALID",
      });
    }
  }
  return gate;
}

function createHandler({
  env = process.env,
  fetchImpl = globalThis.fetch,
  now = Date.now,
  randomId = randomUUID,
} = {}) {
  let liveRunning = false;
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "private, no-store");
    try {
      if (req.method === "GET") {
        return res.status(200).json({
          ok: true,
          ...generationReadiness(env),
          sampleAvailable: true,
          defaultInput: DEFAULT_INPUT,
          contractVersion: 1,
        });
      }
      if (req.method !== "POST") {
        res.setHeader("Allow", "GET, POST");
        return res.status(405).json({ error: "Method not allowed" });
      }

      const body = parseBody(req.body);
      const mode = body.mode === "live" ? "live" : "sample";
      const input = normalizeInput(body.input);
      if (mode === "sample") {
        const fixture = buildFixture(input);
        const validated = validatePromoPageGenerationResult(fixture, {
          requiredVisibleCopy: requiredVisibleCopy(input),
          ctaUrl: input.ctaUrl,
          allowedUrls: [input.ctaUrl],
          locale: input.locale,
          market: input.market,
        });
        return res.status(200).json({
          ok: true,
          mode,
          overallState: "partial",
          userMessage: "정적 출력 계약을 통과했습니다. Desktop · Mobile 브라우저 검사는 실제 AI 모드에서 실행됩니다.",
          previewDocument: buildPreviewDocument(validated.result, validated.documentLanguage),
          checks: [
            { key: "contract", label: "정적 출력 계약", state: "passed", detail: "필수 문구, 안전한 HTML·CSS, 링크 구조를 확인했습니다." },
            { key: "desktop", label: "Desktop 1440", state: "not_run", detail: "화면 미리보기만 제공하며 자동 브라우저 검사는 실행하지 않았습니다." },
            { key: "mobile", label: "Mobile 390", state: "not_run", detail: "화면 미리보기만 제공하며 자동 브라우저 검사는 실행하지 않았습니다." },
            { key: "artifact", label: "서명 결과 저장", state: "not_run", detail: "샘플 검사는 결과를 저장하지 않습니다." },
          ],
          qualityChecks: validated.result.qualityChecks,
        });
      }

      requireConsoleAccess(req, { env });
      if (liveRunning) {
        throw Object.assign(new Error("A live quality test is already running on this worker"), {
          statusCode: 429,
          code: "QUALITY_TEST_ALREADY_RUNNING",
        });
      }
      let upstream;
      liveRunning = true;
      try {
        upstream = await forwardPromoPageGeneration(buildLivePayload(input, { now: now(), randomId }), {
          env,
          fetchImpl,
        });
      } finally {
        liveRunning = false;
      }
      if (!upstream.ok || !upstream.body?.ok) {
        return res.status(502).json({
          ok: false,
          code: String(upstream.body?.code || "GENERATION_WORKFLOW_FAILED"),
          stage: "generation",
          userMessage: safeUpstreamMessage(upstream.body),
          retryable: upstream.status >= 500,
        });
      }
      const pagePath = validatePagePath(upstream.body.pagePath);
      const browserQualityGate = requirePassingBrowserQualityGate(upstream.body.browserQualityGate);
      const results = browserQualityGate.results;
      return res.status(200).json({
        ok: true,
        mode,
        overallState: "passed",
        userMessage: "정적 계약, Desktop · Mobile 브라우저 검사와 서명 결과 저장을 모두 통과했습니다.",
        id: String(upstream.body.id || ""),
        pagePath,
        contentHash: String(upstream.body.contentHash || ""),
        expiresAt: upstream.body.expiresAt || null,
        promptMeta: publicPromptMeta(upstream.body.promptMeta),
        checks: [
          { key: "contract", label: "정적 출력 계약", state: "passed", detail: "생성 결과 계약을 통과했습니다." },
          { key: "desktop", label: "Desktop 1440", state: results.desktop.state, detail: `${Number(results.desktop.blockingCount)}개 차단 항목` },
          { key: "mobile", label: "Mobile 390", state: results.mobile.state, detail: `${Number(results.mobile.blockingCount)}개 차단 항목` },
          { key: "artifact", label: "서명 결과 저장", state: "passed", detail: "검증된 결과 URL이 생성되었습니다." },
        ],
        browserQualityGate,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        ok: false,
        code: error.code || "QUALITY_TEST_FAILED",
        stage: error.code?.startsWith("QUALITY_TEST_") ? "request" : "generation",
        userMessage: error.message || "품질 테스트를 완료하지 못했습니다.",
        retryable: Number(error.statusCode || 500) >= 500,
        ...(error.field ? { field: error.field } : {}),
      });
    }
  };
}

const handler = createHandler();
module.exports = handler;
module.exports.DEFAULT_INPUT = DEFAULT_INPUT;
module.exports.buildFixture = buildFixture;
module.exports.buildLivePayload = buildLivePayload;
module.exports.createHandler = createHandler;
module.exports.normalizeInput = normalizeInput;
