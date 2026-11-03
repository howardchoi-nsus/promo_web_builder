const assert = require("node:assert/strict");
const { createBrowserQualityAttestation } = require("../api/_promo-page-browser-quality-attestation");
const { validatePromoPageGenerationResult } = require("../api/_promo-page-generation-contract");
const { normalizePromptMeta } = require("../api/_promo-page-generation-artifact-store");
const { createHandler } = require("../api/promo-page-generation-artifact");

const now = Date.parse("2026-11-03T00:00:00.000Z");
const env = {
  PROMO_PAGE_ARTIFACT_SIGNING_SECRET: "artifact-signing-test-secret-at-least-32-characters",
  PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET: "browser-attestation-test-secret-at-least-32-characters",
};
const requiredVisibleCopy = ["Sale", "Open offer", "Terms apply"];
const ctaUrl = "/sale";
const generated = {
  designIntent: "Direct offer hierarchy",
  layoutSummary: "Hero followed by legal text",
  mdComplianceMap: {
    layoutPhilosophy: "Editorial",
    visualMood: "Clear",
    spacingRhythm: "Eight point",
    componentStyle: "Solid",
    depthAndEffects: "Flat",
    shapeAndRadius: "Square",
    promoPageImplications: "Direct CTA",
    dosApplied: ["Clear hierarchy"],
    dontsAvoided: ["No media"],
    notColorFontOnlyProof: "The hierarchy uses grouping, spacing, and a separate legal region.",
  },
  html: '<main class="promo-generated-page"><h1>Sale</h1><a href="/sale">Open offer</a><p>Terms apply</p></main>',
  css: ".promo-generated-page{color:#111;background:#fff}.promo-generated-page a:focus-visible{outline:3px solid #000}@media(max-width:420px){.promo-generated-page{padding:20px}}@media(prefers-reduced-motion:reduce){.promo-generated-page{animation:none}}",
  qualityChecks: [
    "CONTENT_FIDELITY: PASS", "RESPONSIVE_1440: PASS", "RESPONSIVE_390: PASS",
    "ACCESSIBILITY: PASS", "CONTRAST: PASS", "OVERFLOW: PASS", "LEGAL_VISIBILITY: PASS",
    "TOKEN_DISCIPLINE: PASS", "TEXT_FIRST_MVP: PASS", "DUPLICATE_COPY: PASS",
  ],
};
const promptMeta = normalizePromptMeta({
  id: "00000000-0000-4000-8000-000000000075",
  type: "promo_page_generation",
  name: "Promo Page Generation",
  version: 3,
  renderedPromptHash: "a".repeat(64),
  variableHash: "b".repeat(64),
  promptLayerSources: [{ key: "body", source: "prompt-version", renderedHash: "c".repeat(64) }],
});
const browserQualityGate = {
  contractVersion: 1,
  state: "passed",
  blockingCount: 0,
  results: {
    desktop: { width: 1440, height: 1000, state: "passed", blockingCount: 0, diagnostics: [], metrics: {} },
    mobile: { width: 390, height: 844, state: "passed", blockingCount: 0, diagnostics: [], metrics: {} },
  },
};
const validated = validatePromoPageGenerationResult(generated, {
  requiredVisibleCopy,
  ctaUrl,
  allowedUrls: [ctaUrl],
  locale: "en-US",
  market: "US",
});
const subject = {
  artifactId: "promo-ai-attested",
  title: "Sale",
  promptMeta,
  result: validated.result,
  requiredVisibleCopy,
  ctaUrl,
  allowedUrls: [ctaUrl],
  locale: "en-US",
  market: "US",
  browserQualityGate,
};
const body = {
  id: subject.artifactId,
  title: subject.title,
  promptMeta,
  result: validated.result,
  requiredVisibleCopy,
  ctaUrl,
  allowedUrls: [ctaUrl],
  locale: "en-US",
  market: "US",
  browserQualityGate,
};

function response() {
  return {
    headers: {},
    statusCode: 0,
    payload: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(value) { this.statusCode = value; return this; },
    json(value) { this.payload = value; return this; },
    send(value) { this.payload = value; return this; },
  };
}

async function main() {
  let sqlCalls = 0;
  const sql = async (strings) => {
    sqlCalls += 1;
    const query = strings.join("?");
    if (/insert into public\.promo_page_generation_artifacts/.test(query)) {
      return [{
        artifact_key: body.id,
        content_hash: "d".repeat(64),
        expires_at: new Date(now + 86_400_000).toISOString(),
      }];
    }
    return [];
  };
  const handler = createHandler({
    env,
    now: () => now,
    resolveSql: () => sql,
    requireService: () => true,
  });

  const forgedResponse = response();
  await handler({ method: "POST", body: { ...body, browserQualityAttestation: "forged" } }, forgedResponse);
  assert.equal(forgedResponse.statusCode, 422);
  assert.equal(sqlCalls, 0);
  assert.match(forgedResponse.payload.code, /^PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_/);

  const browserQualityAttestation = createBrowserQualityAttestation(subject, { env, now });
  const storedResponse = response();
  await handler({ method: "POST", body: { ...body, browserQualityAttestation } }, storedResponse);
  assert.equal(storedResponse.statusCode, 201);
  assert.equal(sqlCalls, 2);
  assert.equal(storedResponse.payload.ok, true);
  assert.match(storedResponse.payload.pagePath, /token=/);

  console.log("Promo page artifact attestation boundary tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
