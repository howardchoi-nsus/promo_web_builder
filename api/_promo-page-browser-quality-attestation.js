const { createHash, createHmac, randomBytes, timingSafeEqual } = require("node:crypto");

const ATTESTATION_VERSION = 1;
const DEFAULT_TTL_SECONDS = 60;
const MAX_TTL_SECONDS = 120;
const CLOCK_SKEW_SECONDS = 5;

function fail(code, message, statusCode = 422) {
  throw Object.assign(new Error(message), { code, statusCode });
}

function attestationSecret(env = process.env) {
  const value = String(env.PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET || "").trim();
  if (value.length < 32) {
    fail(
      "PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET_NOT_CONFIGURED",
      "PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET must contain at least 32 characters",
      503,
    );
  }
  return value;
}

function stableJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
}

function normalizeQualityGate(value) {
  const gate = value && typeof value === "object" && !Array.isArray(value) ? value : null;
  if (!gate || Number(gate.contractVersion) !== 1 || gate.state !== "passed" || Number(gate.blockingCount) !== 0) {
    fail("PROMO_PAGE_BROWSER_QUALITY_NOT_PASSED", "Browser quality gate must be passed with zero blocking diagnostics");
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
      fail("PROMO_PAGE_BROWSER_QUALITY_NOT_PASSED", `Browser quality gate ${key} result is not a valid pass`);
    }
  }
  return gate;
}

function normalizedEnvelope(input = {}) {
  const artifactId = String(input.artifactId || input.id || "").trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(artifactId)) {
    fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_INPUT_INVALID", "Attestation requires a URL-safe artifact id");
  }
  const result = input.result && typeof input.result === "object" && !Array.isArray(input.result)
    ? input.result
    : null;
  if (!result) fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_INPUT_INVALID", "Attestation requires a generated result");
  const envelope = {
    artifactId,
    title: String(input.title || ""),
    promptMeta: input.promptMeta && typeof input.promptMeta === "object" && !Array.isArray(input.promptMeta)
      ? input.promptMeta
      : {},
    result,
    requiredVisibleCopy: (Array.isArray(input.requiredVisibleCopy) ? input.requiredVisibleCopy : []).map(String),
    ctaUrl: String(input.ctaUrl || ""),
    allowedUrls: (Array.isArray(input.allowedUrls) ? input.allowedUrls : []).map(String),
    locale: String(input.locale || ""),
    market: String(input.market || ""),
    qualityGate: normalizeQualityGate(input.browserQualityGate || input.qualityGate),
  };
  const json = stableJson(envelope);
  if (Buffer.byteLength(json, "utf8") > 1_200_000) {
    fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_INPUT_INVALID", "Attestation input exceeds the size limit");
  }
  return { envelope, json };
}

function envelopeDigest(input) {
  return createHash("sha256").update(normalizedEnvelope(input).json, "utf8").digest("hex");
}

function signPayload(encodedPayload, env) {
  return createHmac("sha256", attestationSecret(env)).update(encodedPayload, "utf8").digest("base64url");
}

function createBrowserQualityAttestation(input, {
  env = process.env,
  now = Date.now(),
  ttlSeconds = DEFAULT_TTL_SECONDS,
} = {}) {
  const issuedAt = Math.floor(Number(now) / 1000);
  const ttl = Math.min(MAX_TTL_SECONDS, Math.max(1, Math.trunc(Number(ttlSeconds) || DEFAULT_TTL_SECONDS)));
  const payload = {
    version: ATTESTATION_VERSION,
    issuedAt,
    expiresAt: issuedAt + ttl,
    nonce: randomBytes(16).toString("base64url"),
    subjectHash: envelopeDigest(input),
  };
  const encodedPayload = Buffer.from(stableJson(payload), "utf8").toString("base64url");
  return `${encodedPayload}.${signPayload(encodedPayload, env)}`;
}

function parseToken(token) {
  const raw = String(token || "").trim();
  if (!raw || raw.length > 2048) fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_REQUIRED", "A browser quality attestation is required");
  const parts = raw.split(".");
  if (parts.length !== 2 || parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))) {
    fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_INVALID", "Browser quality attestation has an invalid format");
  }
  let payload;
  try {
    payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
  } catch {
    fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_INVALID", "Browser quality attestation payload is invalid");
  }
  const keys = Object.keys(payload || {}).sort();
  if (JSON.stringify(keys) !== JSON.stringify(["expiresAt", "issuedAt", "nonce", "subjectHash", "version"])) {
    fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_INVALID", "Browser quality attestation payload shape is invalid");
  }
  return { encodedPayload: parts[0], signature: parts[1], payload };
}

function verifyBrowserQualityAttestation(token, input, {
  env = process.env,
  now = Date.now(),
} = {}) {
  const parsed = parseToken(token);
  const supplied = Buffer.from(parsed.signature);
  const expected = Buffer.from(signPayload(parsed.encodedPayload, env));
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_INVALID", "Browser quality attestation signature is invalid");
  }
  const version = Number(parsed.payload.version);
  const issuedAt = Number(parsed.payload.issuedAt);
  const expiresAt = Number(parsed.payload.expiresAt);
  const nonce = String(parsed.payload.nonce || "");
  const nowSeconds = Math.floor(Number(now) / 1000);
  if (version !== ATTESTATION_VERSION || !Number.isInteger(issuedAt) || !Number.isInteger(expiresAt)
    || expiresAt <= issuedAt || expiresAt - issuedAt > MAX_TTL_SECONDS
    || !/^[A-Za-z0-9_-]{22}$/.test(nonce)) {
    fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_INVALID", "Browser quality attestation time contract is invalid");
  }
  if (issuedAt > nowSeconds + CLOCK_SKEW_SECONDS) {
    fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_NOT_YET_VALID", "Browser quality attestation was issued in the future");
  }
  if (expiresAt <= nowSeconds) {
    fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_EXPIRED", "Browser quality attestation has expired");
  }
  const digest = envelopeDigest(input);
  const suppliedDigest = Buffer.from(String(parsed.payload.subjectHash || ""));
  const expectedDigest = Buffer.from(digest);
  if (suppliedDigest.length !== expectedDigest.length || !timingSafeEqual(suppliedDigest, expectedDigest)) {
    fail("PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_MISMATCH", "Browser quality attestation does not match the artifact payload");
  }
  return {
    version,
    issuedAt: new Date(issuedAt * 1000).toISOString(),
    expiresAt: new Date(expiresAt * 1000).toISOString(),
    nonce,
    subjectHash: digest,
  };
}

module.exports = {
  ATTESTATION_VERSION,
  CLOCK_SKEW_SECONDS,
  DEFAULT_TTL_SECONDS,
  MAX_TTL_SECONDS,
  attestationSecret,
  createBrowserQualityAttestation,
  envelopeDigest,
  normalizeQualityGate,
  verifyBrowserQualityAttestation,
};
