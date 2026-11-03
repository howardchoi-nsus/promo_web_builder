import { timingSafeEqual } from "node:crypto";
import http from "node:http";
import { chromium } from "playwright";
import qualityAttestation from "../api/_promo-page-browser-quality-attestation.js";
import artifactStore from "../api/_promo-page-generation-artifact-store.js";
import { assertPromoPageBrowserQuality } from "./lib/promo-page-browser-quality-gate.mjs";

const { attestationSecret, createBrowserQualityAttestation } = qualityAttestation;
const { normalizePromptMeta } = artifactStore;

const port = Number(process.env.PROMO_PAGE_BROWSER_QUALITY_GATE_PORT || 4178);
const host = String(process.env.PROMO_PAGE_BROWSER_QUALITY_GATE_HOST || "127.0.0.1");
const serviceToken = String(process.env.PROMO_PAGE_BROWSER_QUALITY_GATE_TOKEN || "").trim();
const maxBodyBytes = 900_000;

if (!Number.isInteger(port) || port < 1 || port > 65_535) throw new Error("Invalid browser quality gate port");
if (serviceToken.length < 32) throw new Error("PROMO_PAGE_BROWSER_QUALITY_GATE_TOKEN must contain at least 32 characters");
attestationSecret(process.env);

function authorized(request) {
  const supplied = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  const expectedBuffer = Buffer.from(serviceToken);
  const suppliedBuffer = Buffer.from(supplied);
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) throw Object.assign(new Error("Request body is too large"), { statusCode: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON"), { statusCode: 400 });
  }
}

function send(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(body));
}

const browser = await chromium.launch({ headless: true });
const server = http.createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/validate") {
    response.setHeader("Allow", "POST");
    return send(response, 405, { ok: false, error: "Method not allowed" });
  }
  if (!authorized(request)) return send(response, 401, { ok: false, error: "Browser quality gate authentication required" });
  try {
    const body = await readJson(request);
    const report = await assertPromoPageBrowserQuality(body, { browser, timeoutMs: 10_000 });
    const promptMeta = normalizePromptMeta(body.promptMeta);
    const browserQualityAttestation = createBrowserQualityAttestation({
      artifactId: body.artifactId || body.id,
      title: body.title,
      promptMeta,
      result: report.validated.result,
      requiredVisibleCopy: body.requiredVisibleCopy,
      ctaUrl: body.ctaUrl,
      allowedUrls: body.allowedUrls,
      locale: body.locale,
      market: body.market,
      browserQualityGate: report.qualityGate,
    });
    return send(response, 200, {
      ok: true,
      result: report.validated.result,
      documentLanguage: report.validated.documentLanguage,
      browserQualityGate: report.qualityGate,
      browserQualityAttestation,
    });
  } catch (error) {
    return send(response, Number(error.statusCode || 500), {
      ok: false,
      error: "Generated promo page browser validation failed",
      message: error.message,
      code: error.code,
      details: error.details,
    });
  }
});

async function shutdown() {
  server.close();
  await browser.close();
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
server.listen(port, host, () => {
  process.stdout.write(`Promo page browser quality gate listening on http://${host}:${port}/validate\n`);
});
