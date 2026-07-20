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

function geminiHeaders() {
  const apiKey = String(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is not configured");
    error.code = "PROVIDER_NOT_CONFIGURED";
    throw error;
  }
  return { "x-goog-api-key": apiKey, "Content-Type": "application/json" };
}

async function requestJson(url, body, headers, signal, timeoutMs) {
  const controller = signal ? null : new AbortController();
  const timeout = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
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
    return { payload, requestId: response.headers.get("x-request-id") || response.headers.get("x-goog-request-id") || "" };
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
  }, openAiHeaders(), signal, Number(process.env.SECTION_LAYOUT_TIMEOUT_MS || 90000));
  const text = responseOutputText(payload);
  if (!text) throw Object.assign(new Error("Layout model returned no structured output"), { code: "EMPTY_LAYOUT_RESULT" });
  return {
    result: JSON.parse(text),
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

async function generateOpenAiSectionImage({ prompt, signal }) {
  const model = process.env.SECTION_IMAGE_MODEL || "gpt-image-1";
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson("https://api.openai.com/v1/images/generations", {
    model,
    prompt,
    size: "1536x1024",
    quality: process.env.SECTION_IMAGE_QUALITY || "medium",
    output_format: "webp",
  }, openAiHeaders(), signal, Number(process.env.SECTION_IMAGE_TIMEOUT_MS || 240000));
  const base64 = payload.data?.[0]?.b64_json;
  if (!base64) throw Object.assign(new Error("Image model returned no image data"), { code: "EMPTY_IMAGE_RESULT" });
  return {
    bytes: Buffer.from(base64, "base64"),
    mimeType: "image/webp",
    width: 1536,
    height: 1024,
    provider: { provider: "openai", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usage || {},
  };
}

async function generateGeminiSectionImage({ prompt, signal }) {
  const model = process.env.SECTION_IMAGE_MODEL || "gemini-3.1-flash-image";
  const imageSize = process.env.SECTION_IMAGE_SIZE || "2K";
  const startedAt = Date.now();
  const { payload, requestId } = await requestJson(
    `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}:generateContent`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE"],
        responseFormat: {
          image: {
            aspectRatio: "16:9",
            imageSize,
          },
        },
      },
    },
    geminiHeaders(),
    signal,
    Number(process.env.SECTION_IMAGE_TIMEOUT_MS || 240000)
  );
  const parts = payload.candidates?.[0]?.content?.parts || [];
  const inlineData = parts.map((part) => part.inlineData || part.inline_data).find((item) => item?.data);
  if (!inlineData?.data) throw Object.assign(new Error("Gemini image model returned no inline image data"), { code: "EMPTY_IMAGE_RESULT" });
  const mimeType = inlineData.mimeType || inlineData.mime_type || "image/png";
  return {
    bytes: Buffer.from(inlineData.data, "base64"),
    mimeType,
    width: imageSize === "4K" ? 4096 : imageSize === "2K" ? 2048 : 1024,
    height: imageSize === "4K" ? 2304 : imageSize === "2K" ? 1152 : 576,
    provider: { provider: "gemini", model, requestId, latencyMs: Date.now() - startedAt },
    usage: payload.usageMetadata || payload.usage || {},
  };
}

async function generateSectionImage(input) {
  const provider = String(process.env.SECTION_IMAGE_PROVIDER || "openai").trim().toLowerCase();
  if (provider === "gemini") return generateGeminiSectionImage(input);
  if (provider === "openai") return generateOpenAiSectionImage(input);
  throw Object.assign(new Error(`Unsupported section image provider: ${provider}`), { code: "UNSUPPORTED_IMAGE_PROVIDER" });
}

module.exports = { generateSectionLayout, generateSectionImage, generateOpenAiSectionImage, generateGeminiSectionImage };
