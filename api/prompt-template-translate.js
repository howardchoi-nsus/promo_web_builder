const { getSql, parseBody } = require("./_prompt-template-store");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const { generatePromptKoreanTranslation } = require("./_promo-section-design-provider");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "no-store");
    if (!isSameOriginRequest(req)) {
      return res.status(403).json({
        error: "Same-origin Admin request is required",
        code: "PROMPT_TRANSLATION_ORIGIN_REQUIRED",
      });
    }
    const body = parseBody(req.body);
    const text = String(body.text || body.body || "");
    if (!text.trim()) {
      return res.status(200).json({ ok: true, translation: "", provider: null, usage: {} });
    }
    if (text.length > 100000) {
      return res.status(422).json({
        error: "Prompt body is too long to translate",
        code: "PROMPT_TRANSLATION_TOO_LONG",
      });
    }
    const execution = await createPromptExecutionSnapshot(
      req.promptSql || getSql(),
      "admin_prompt_translation",
      { sourcePrompt: text }
    );
    const result = await generatePromptKoreanTranslation({
      text,
      promptConfig: execution.promptConfig,
    });
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    const status = error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 502;
    return res.status(status).json({
      error: "Prompt translation failed",
      message: error.message,
      code: error.code || null,
    });
  }
};

function isSameOriginRequest(req) {
  const originValue = String(req?.headers?.origin || "").trim();
  const host = String(
    req?.headers?.["x-forwarded-host"]
      || req?.headers?.host
      || ""
  ).trim().toLowerCase();
  if (!originValue || !host) return false;
  try {
    return new URL(originValue).host.toLowerCase() === host;
  } catch {
    return false;
  }
}
