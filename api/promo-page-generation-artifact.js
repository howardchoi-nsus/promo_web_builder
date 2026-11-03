const { parseBody } = require("./_prompt-template-store");
const { requirePromptRuntimeService } = require("./_prompt-runtime-auth");
const { validatePromoPageGenerationResult } = require("./_promo-page-generation-contract");
const { verifyBrowserQualityAttestation } = require("./_promo-page-browser-quality-attestation");
const {
  buildPageHtml,
  contentHash,
  createViewToken,
  deleteExpiredArtifacts,
  findArtifact,
  getSql,
  normalizeArtifactKey,
  normalizePromptMeta,
  normalizeTtlSeconds,
  safeJson,
  saveArtifact,
  signingSecret,
  verifyViewToken,
} = require("./_promo-page-generation-artifact-store");

const PAGE_SECURITY_HEADERS = Object.freeze({
  "Cache-Control": "private, no-store",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src 'none'; font-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
});

function setHeaders(res, headers) {
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
}

function createHandler({
  env = process.env,
  now = () => Date.now(),
  resolveSql = getSql,
  requireService = requirePromptRuntimeService,
} = {}) {
  return async function handler(req, res) {
    try {
      if (req.method === "POST") return await store(req, res);
      if (req.method === "GET") return await render(req, res);
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
      setHeaders(res, { "Cache-Control": "private, no-store" });
      return res.status(error.statusCode || 500).json({
        error: "Promo page artifact request failed",
        message: error.message,
        code: error.code,
      });
    }

    async function store(req, res) {
      requireService(req, { env });
      signingSecret(env);
      const body = parseBody(req.body);
      const artifactKey = normalizeArtifactKey(body.id || body.artifactKey);
      const validated = validatePromoPageGenerationResult(body.result || body.generated, {
        requiredVisibleCopy: body.requiredVisibleCopy,
        ctaUrl: body.ctaUrl,
        allowedUrls: body.allowedUrls,
        locale: body.locale,
        market: body.market,
      });
      const promptMeta = normalizePromptMeta(body.promptMeta);
      const browserQualityAttestation = verifyBrowserQualityAttestation(
        body.browserQualityAttestation,
        {
          artifactId: artifactKey,
          title: body.title,
          promptMeta,
          result: validated.result,
          requiredVisibleCopy: body.requiredVisibleCopy,
          ctaUrl: body.ctaUrl,
          allowedUrls: body.allowedUrls,
          locale: body.locale,
          market: body.market,
          browserQualityGate: body.browserQualityGate,
        },
        { env, now: now() },
      );
      const pageHtml = buildPageHtml({
        result: validated.result,
        documentLanguage: validated.documentLanguage,
        title: body.title,
      });
      if (Buffer.byteLength(pageHtml, "utf8") > 900_000) {
        throw Object.assign(new Error("Generated page exceeds the artifact storage limit"), {
          statusCode: 422,
          code: "PROMO_PAGE_ARTIFACT_TOO_LARGE",
        });
      }
      const hash = contentHash(pageHtml);
      const ttlSeconds = normalizeTtlSeconds(body.ttlSeconds);
      const expiresAt = new Date(now() + ttlSeconds * 1000);
      const safePromptMeta = safeJson(promptMeta, 65_536, "promptMeta");
      const qualitySnapshot = safeJson({
        designIntent: validated.result.designIntent,
        layoutSummary: validated.result.layoutSummary,
        mdComplianceMap: validated.result.mdComplianceMap,
        qualityChecks: validated.result.qualityChecks,
        browserQualityGate: body.browserQualityGate,
        browserQualityAttestation,
      }, 262_144, "quality snapshot");
      const sql = resolveSql();
      await deleteExpiredArtifacts(sql);
      const saved = await saveArtifact(sql, {
        artifactKey,
        hash,
        pageHtml,
        promptMeta: safePromptMeta,
        qualitySnapshot,
        expiresAt,
      });
      if (!saved) {
        throw Object.assign(new Error("Artifact id already belongs to different unexpired content"), {
          statusCode: 409,
          code: "PROMO_PAGE_ARTIFACT_KEY_CONFLICT",
        });
      }
      const persisted = {
        artifactKey: saved.artifact_key,
        hash: saved.content_hash,
        expiresAt: saved.expires_at,
      };
      const viewToken = createViewToken(persisted, env);
      setHeaders(res, { "Cache-Control": "private, no-store" });
      return res.status(201).json({
        ok: true,
        id: persisted.artifactKey,
        contentHash: persisted.hash,
        expiresAt: persisted.expiresAt,
        pagePath: `/api/promo-page-generation-artifact?id=${encodeURIComponent(persisted.artifactKey)}&token=${encodeURIComponent(viewToken)}`,
      });
    }

    async function render(req, res) {
      signingSecret(env);
      let artifactKey;
      try {
        artifactKey = normalizeArtifactKey(req.query?.id || req.query?.artifactKey);
      } catch {
        return notFound(res);
      }
      const row = await findArtifact(resolveSql(), artifactKey);
      const tokenValid = row && verifyViewToken(req.query?.token, {
        artifactKey: row.artifact_key,
        hash: row.content_hash,
        expiresAt: row.expires_at,
      }, env);
      if (!tokenValid) return notFound(res);
      setHeaders(res, {
        ...PAGE_SECURITY_HEADERS,
        "Content-Type": "text/html; charset=utf-8",
      });
      return res.status(200).send(row.page_html);
    }
  };
}

function notFound(res) {
  setHeaders(res, PAGE_SECURITY_HEADERS);
  return res.status(404).json({ error: "Promo page artifact not found" });
}

const handler = createHandler();
module.exports = handler;
module.exports.PAGE_SECURITY_HEADERS = PAGE_SECURITY_HEADERS;
module.exports.createHandler = createHandler;
