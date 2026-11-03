const assert = require("node:assert/strict");
const {
  MAX_TTL_SECONDS,
  attestationSecret,
  createBrowserQualityAttestation,
  verifyBrowserQualityAttestation,
} = require("../api/_promo-page-browser-quality-attestation");

const env = {
  PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET: "browser-attestation-test-secret-at-least-32-characters",
};
const now = Date.parse("2026-11-02T12:00:00.000Z");
const result = {
  designIntent: "Clear conversion",
  layoutSummary: "Hero and legal footer",
  mdComplianceMap: { proof: "layout" },
  html: '<main class="promo-generated-page"><h1>Sale</h1><a href="/sale">Open</a></main>',
  css: ".promo-generated-page{}",
  qualityChecks: ["PASS"],
};
const browserQualityGate = {
  contractVersion: 1,
  state: "passed",
  blockingCount: 0,
  results: {
    desktop: {
      width: 1440,
      height: 1000,
      state: "passed",
      blockingCount: 0,
      diagnostics: [],
      metrics: { documentWidth: 1440 },
    },
    mobile: {
      width: 390,
      height: 844,
      state: "passed",
      blockingCount: 0,
      diagnostics: [],
      metrics: { documentWidth: 390 },
    },
  },
};
const input = {
  artifactId: "promo-ai-075",
  title: "Autumn Sale",
  promptMeta: {
    id: "00000000-0000-4000-8000-000000000075",
    type: "promo_page_generation",
    version: 1,
  },
  result,
  requiredVisibleCopy: ["Sale", "Open"],
  ctaUrl: "/sale",
  allowedUrls: ["/sale"],
  locale: "en-US",
  market: "US",
  browserQualityGate,
};

const token = createBrowserQualityAttestation(input, { env, now, ttlSeconds: 120 });
const proof = verifyBrowserQualityAttestation(token, input, { env, now: now + 60_000 });
assert.equal(proof.version, 1);
assert.equal(proof.subjectHash.length, 64);
assert.match(proof.nonce, /^[A-Za-z0-9_-]{22}$/);
assert.equal(proof.issuedAt, "2026-11-02T12:00:00.000Z");
const reordered = {
  ...input,
  result: Object.fromEntries(Object.entries(result).reverse()),
  promptMeta: Object.fromEntries(Object.entries(input.promptMeta).reverse()),
  browserQualityGate: {
    ...browserQualityGate,
    results: {
      mobile: browserQualityGate.results.mobile,
      desktop: browserQualityGate.results.desktop,
    },
  },
};
assert.doesNotThrow(() => verifyBrowserQualityAttestation(token, reordered, { env, now: now + 60_000 }));

for (const changed of [
  { ...input, artifactId: "promo-ai-other" },
  { ...input, title: "Different title" },
  { ...input, promptMeta: { ...input.promptMeta, version: 2 } },
  { ...input, result: { ...result, html: `${result.html} ` } },
  { ...input, ctaUrl: "/other" },
  { ...input, requiredVisibleCopy: ["Sale"] },
  { ...input, browserQualityGate: { ...browserQualityGate, results: {
    ...browserQualityGate.results,
    desktop: { ...browserQualityGate.results.desktop, metrics: { documentWidth: 1400 } },
  } } },
]) {
  assert.throws(
    () => verifyBrowserQualityAttestation(token, changed, { env, now: now + 60_000 }),
    (error) => error.code === "PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_MISMATCH",
  );
}

assert.throws(
  () => verifyBrowserQualityAttestation(token, input, { env, now: now + 121_000 }),
  (error) => error.code === "PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_EXPIRED",
);
assert.throws(
  () => verifyBrowserQualityAttestation("", input, { env, now }),
  (error) => error.code === "PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_REQUIRED",
);
const futureToken = createBrowserQualityAttestation(input, { env, now: now + 6_000 });
assert.throws(
  () => verifyBrowserQualityAttestation(futureToken, input, { env, now }),
  (error) => error.code === "PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_NOT_YET_VALID",
);
assert.throws(
  () => verifyBrowserQualityAttestation(token, input, {
    env: { PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET: `${env.PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET}-other` },
    now,
  }),
  (error) => error.code === "PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_INVALID",
);
assert.throws(
  () => createBrowserQualityAttestation({
    ...input,
    browserQualityGate: { ...browserQualityGate, state: "failed", blockingCount: 1 },
  }, { env, now }),
  (error) => error.code === "PROMO_PAGE_BROWSER_QUALITY_NOT_PASSED",
);
assert.throws(
  () => attestationSecret({ PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET: "short" }),
  (error) => error.statusCode === 503,
);
const capped = createBrowserQualityAttestation(input, { env, now, ttlSeconds: MAX_TTL_SECONDS + 999 });
assert.doesNotThrow(() => verifyBrowserQualityAttestation(capped, input, {
  env,
  now: now + MAX_TTL_SECONDS * 1000 - 1,
}));

console.log("Promo page browser quality attestation tests passed.");
