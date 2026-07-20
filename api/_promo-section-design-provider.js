const LAYOUT_RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["layoutVariant", "minHeight", "imagePrompt", "rationale"],
  properties: {
    layoutVariant: { type: "string", enum: ["split-left", "split-right", "centered-hero"] },
    minHeight: { type: "integer", minimum: 240, maximum: 900 },
    imagePrompt: { type: "string" },
    rationale: { type: "string" },
  },
};

function openAiHeaders() {
  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured");
    error.code = "PROVIDER_NOT_CONFIGURED";
    throw error;
  }
  return { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
}

async function requestJson(url, body, signal, timeoutMs) {
  const controller = signal ? null : new AbortController();
  const timeout = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: openAiHeaders(),
      body: JSON.stringify(body),
      signal: signal || controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error?.message || `Model provider failed with ${response.status}`);
      error.code = payload.error?.code || `PROVIDER_${response.status}`;
      error.statusCode = response.status;
      throw error;
    }
    return { payload, requestId: response.headers.get("x-request-id") || "" };
  } catch (error) {
    if (error.name === "AbortError") {
      throw Object.assign(new Error(`Model provider timed out after ${timeoutMs}ms`), { code: "PROVIDER_TIMEOUT", statusCode: 504 });
    }
    throw error;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function responseOutputText(payload) {
  if (typeof payload.output_text === "string") return payload.output_text;
  return (payload.output || []).flatMap((item) => item.content || [])
    .find((part) => part.type === "output_text")?.text || "";
}

async function generateSectionLayout({ section, sectionInputs, constraints, signal }) {
  const model = process.env.SECTION_LAYOUT_MODEL || "gpt-4.1-mini";
  const prompt = [
    "Design one responsive promotional web section.",
    "Select only one allowed layout variant and describe one supporting image without embedding any text, CTA, logo, badge, or legal copy in the image.",
    "The image prompt must preserve negative space for DOM copy.",
    `Section: ${section.name || section.sectionKey} (${section.sectionKey})`,
    `Allowed variants: ${(constraints.allowedLayoutVariants || []).join(", ")}`,
    `Locked content keys: ${(constraints.contentLocks || []).join(", ") || "none"}`,
    `Content: ${JSON.stringify(sectionInputs)}`,
  ].join("\n");
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/responses", {
    model,
    store: false,
    input: prompt,
    text: {
      format: {
        type: "json_schema",
        name: "section_layout_result",
        strict: true,
        schema: LAYOUT_RESULT_SCHEMA,
      },
    },
  }, signal, Number(process.env.SECTION_LAYOUT_TIMEOUT_MS || 90000));
  const text = responseOutputText(payload);
  if (!text) throw Object.assign(new Error("Layout model returned no structured output"), { code: "EMPTY_LAYOUT_RESULT" });
  return {
    result: JSON.parse(text),
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

async function generateSectionImage({ prompt, signal }) {
  const model = process.env.SECTION_IMAGE_MODEL || "gpt-image-1";
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/images/generations", {
    model,
    prompt,
    size: "1536x1024",
    quality: process.env.SECTION_IMAGE_QUALITY || "medium",
    output_format: "webp",
  }, signal, Number(process.env.SECTION_IMAGE_TIMEOUT_MS || 240000));
  const base64 = payload.data?.[0]?.b64_json;
  if (!base64) throw Object.assign(new Error("Image model returned no image data"), { code: "EMPTY_IMAGE_RESULT" });
  return {
    bytes: Buffer.from(base64, "base64"),
    mimeType: "image/webp",
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

module.exports = { generateSectionLayout, generateSectionImage };
