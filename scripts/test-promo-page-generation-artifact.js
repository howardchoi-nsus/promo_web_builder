const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const {
  MAX_TTL_SECONDS,
  MIN_TTL_SECONDS,
  buildPageHtml,
  contentHash,
  createViewToken,
  normalizeArtifactKey,
  normalizePromptMeta,
  normalizeTtlSeconds,
  verifyViewToken,
} = require("../api/_promo-page-generation-artifact-store");

const env = { PROMO_PAGE_ARTIFACT_SIGNING_SECRET: "artifact-test-secret-that-is-longer-than-32-characters" };
const fields = {
  artifactKey: "promo-ai-123",
  hash: "a".repeat(64),
  expiresAt: "2026-11-03T00:00:00.000Z",
};
const token = createViewToken(fields, env);
assert.equal(verifyViewToken(token, fields, env), true);
assert.equal(verifyViewToken(`${token}x`, fields, env), false);
assert.equal(verifyViewToken(token, { ...fields, hash: "b".repeat(64) }, env), false);
assert.equal(normalizeArtifactKey("promo-ai-123"), "promo-ai-123");
assert.throws(() => normalizeArtifactKey("../unsafe"), /URL-safe/);
assert.equal(normalizeTtlSeconds(1), MIN_TTL_SECONDS);
assert.equal(normalizeTtlSeconds(Number.MAX_SAFE_INTEGER), MAX_TTL_SECONDS);

const promptMeta = normalizePromptMeta({
  id: "00000000-0000-4000-8000-000000000075",
  type: "promo_page_generation",
  name: "Promo Page Generation",
  version: 3,
  renderedPromptHash: "a".repeat(64),
  variableHash: "b".repeat(64),
  promptLayerSources: [{ key: "body", source: "prompt-version", renderedHash: "c".repeat(64) }],
});
assert.equal(promptMeta.type, "promo_page_generation");
assert.deepEqual(Object.keys(promptMeta).sort(), [
  "id",
  "name",
  "promptLayerSources",
  "renderedPromptHash",
  "type",
  "variableHash",
  "version",
]);
assert.throws(
  () => normalizePromptMeta({ ...promptMeta, renderedPrompt: "full prompt must never be stored" }),
  (error) => error.code === "PROMO_PAGE_ARTIFACT_PROMPT_META_INVALID" && error.statusCode === 422,
);
assert.throws(
  () => normalizePromptMeta({ ...promptMeta, llmRequest: { input: "sensitive" } }),
  (error) => error.code === "PROMO_PAGE_ARTIFACT_PROMPT_META_INVALID" && error.statusCode === 422,
);

const page = buildPageHtml({
  result: { html: '<main class="promo-generated-page"><h1>Sale</h1></main>', css: ".promo-generated-page{}" },
  documentLanguage: "ko",
  title: '<Sale & "Save">',
});
assert.match(page, /^<!doctype html><html lang="ko">/);
assert.match(page, /&lt;Sale &amp; &quot;Save&quot;&gt;/);
assert.doesNotMatch(page, /<title><Sale/);
assert.equal(contentHash(page).length, 64);

const storeSource = readFileSync(require.resolve("../api/_promo-page-generation-artifact-store"), "utf8");
const endpointSource = readFileSync(require.resolve("../api/promo-page-generation-artifact"), "utf8");
assert.match(storeSource, /existing\.content_hash = excluded\.content_hash/);
assert.match(storeSource, /existing\.expires_at <= now\(\)/);
assert.match(endpointSource, /PROMO_PAGE_ARTIFACT_KEY_CONFLICT/);

console.log("Promo page generation artifact contract tests passed.");
