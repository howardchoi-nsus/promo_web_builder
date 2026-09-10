const { createHash, randomUUID } = require("node:crypto");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const { validateRenderSpec } = require("./_component-render-spec-contract");
const { fetchRenderTokenCatalog, fetchComponents } = require("./_item-components-store");

const SECTION_ROLES = new Set(["header", "hero", "benefit", "content", "cta", "notice", "terms", "legal", "footer"]);
const OUTPUT_CONTRACT = Object.freeze({
  name: "string",
  description: "string",
  confidence: "number 0..1",
  reviewNotes: ["string"],
  fields: [{ fieldKey: "snake_case string", name: "string", fieldKind: "text|image|cta", textType: "title|body|null", isRequired: "boolean", defaultValue: "string|null" }],
  renderSpec: { contractVersion: 1, root: "RenderSpec v1 root node", responsive: "object", accessibility: "object" },
});

function normalizeRoles(value) {
  return [...new Set((Array.isArray(value) ? value : []).map((item) => String(item || "").trim().toLowerCase()).filter((item) => SECTION_ROLES.has(item)))];
}

function slugKey(value, fallback) {
  const key = String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48);
  return key || fallback;
}

function normalizeProposal(value, intent = "") {
  if (!value || typeof value !== "object") throw generationError("INVALID_ANALYSIS_RESULT", "분석 결과가 JSON 객체가 아닙니다.", 502);
  const used = new Set();
  const fields = (Array.isArray(value.fields) ? value.fields : []).slice(0, 20).map((field, index) => {
    const kind = ["text", "image", "cta"].includes(String(field?.fieldKind || "").toLowerCase()) ? String(field.fieldKind).toLowerCase() : "text";
    let fieldKey = slugKey(field?.fieldKey || field?.name, `field_${index + 1}`);
    while (used.has(fieldKey)) fieldKey = `${fieldKey}_${index + 1}`;
    used.add(fieldKey);
    return {
      fieldKey,
      name: String(field?.name || `Field ${index + 1}`).slice(0, 100),
      description: String(field?.description || "").slice(0, 300),
      fieldKind: kind,
      textType: kind === "text" ? (["title", "body", "caption", "eyebrow", "disclaimer"].includes(field?.textType) ? field.textType : "body") : null,
      sortOrder: index * 10,
      isRequired: field?.isRequired === true,
      isLocked: false,
      defaultValue: field?.defaultValue == null ? null : String(field.defaultValue).slice(0, 500),
      editorSchema: {}, capabilities: {}, imagePolicy: kind === "image" ? { allowedSources: ["file", "url"] } : {}, ctaPolicy: {}, styleSlots: [],
    };
  });
  if (!fields.length) throw generationError("EMPTY_COMPONENT_FIELDS", "분석 결과에 콘텐츠 필드가 없습니다.", 502);
  return {
    name: String(value.name || intent || "Generated component").trim().slice(0, 120),
    description: String(value.description || intent || "").trim().slice(0, 500),
    confidence: Math.max(0, Math.min(1, Number(value.confidence) || 0)),
    reviewNotes: (Array.isArray(value.reviewNotes) ? value.reviewNotes : []).map((item) => String(item || "").slice(0, 300)).filter(Boolean).slice(0, 20),
    fields,
    renderSpec: value.renderSpec,
  };
}

function collectTokenBindings(node, output = {}) {
  for (const [property, tokenKey] of Object.entries(node?.tokenBindings || {})) output[`${node.semanticRole || node.fieldKey || node.tag}.${property}`] = tokenKey;
  (node?.children || []).forEach((child) => collectTokenBindings(child, output));
  return output;
}

function componentSimilarity(proposal, component) {
  const leftKinds = new Set(proposal.fields.map((field) => field.fieldKind));
  const rightKinds = new Set((component.fields || []).map((field) => field.fieldKind));
  const intersection = [...leftKinds].filter((kind) => rightKinds.has(kind)).length;
  const union = new Set([...leftKinds, ...rightKinds]).size || 1;
  const kindScore = intersection / union;
  const countScore = 1 - Math.min(1, Math.abs(proposal.fields.length - (component.fields || []).length) / Math.max(proposal.fields.length, (component.fields || []).length, 1));
  return Number((kindScore * 0.7 + countScore * 0.3).toFixed(4));
}

async function findSimilarComponents(sql, proposal) {
  const components = await fetchComponents(sql, { includeArchived: false });
  return components.map((component) => ({
    componentId: component.id, componentKey: component.componentKey, name: component.name,
    versionId: component.versionId, score: componentSimilarity(proposal, component),
  })).filter((item) => item.score >= 0.55).sort((a, b) => b.score - a.score).slice(0, 5);
}

async function readSourceImage(source) {
  const { get } = await import("@vercel/blob");
  const location = source.metadata?.analysisStorageKey || source.storage_key;
  const blob = await get(location, { access: "private", ...(process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {}) });
  if (!blob || blob.statusCode !== 200 || !blob.stream) throw generationError("SOURCE_BINARY_UNAVAILABLE", "분석할 원본 이미지를 읽을 수 없습니다.", 502);
  return Buffer.from(await new Response(blob.stream).arrayBuffer());
}

function responseText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  return (payload?.output || []).flatMap((item) => item.content || []).find((part) => part.type === "output_text")?.text || "";
}

async function requestVisionAnalysis(source, bytes, promptSnapshot) {
  if (!process.env.OPENAI_API_KEY) throw generationError("PROVIDER_NOT_CONFIGURED", "OPENAI_API_KEY가 설정되지 않았습니다.", 409);
  const config = promptSnapshot.promptConfig;
  const timeoutMs = Math.max(10_000, Math.min(180_000, Number(config?.runtimeConfig?.timeoutMs || 90_000)));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        store: false,
        input: [{ role: "user", content: [
          { type: "input_text", text: `${config.renderedPrompt}\nReturn only one JSON object matching the supplied output contract.` },
          { type: "input_image", image_url: `data:${source.mime_type};base64,${bytes.toString("base64")}` },
        ] }],
        text: { format: { type: "json_object" } },
        ...(config.temperature == null ? {} : { temperature: config.temperature }),
        ...(config.maxTokens == null ? {} : { max_output_tokens: config.maxTokens }),
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw generationError("PROVIDER_REQUEST_FAILED", payload?.error?.message || `이미지 분석 공급자 오류(${response.status})`, response.status >= 500 ? 503 : 502);
    const text = responseText(payload);
    if (!text) throw generationError("EMPTY_ANALYSIS_RESULT", "이미지 분석 결과가 비어 있습니다.", 502);
    return { value: JSON.parse(text), provider: { provider: "openai", model: config.model, requestId: response.headers.get("x-request-id") || "", latencyMs: Date.now() - startedAt }, usage: payload.usage || {} };
  } catch (error) {
    if (error.name === "AbortError") throw generationError("PROVIDER_TIMEOUT", "이미지 분석 시간이 초과되었습니다. 다시 시도해 주세요.", 504);
    if (error instanceof SyntaxError) throw generationError("INVALID_ANALYSIS_JSON", "분석 결과 JSON을 읽을 수 없습니다.", 502);
    throw error;
  } finally { clearTimeout(timer); }
}

async function requestVisionAnalysisWithRetry(source, bytes, promptSnapshot) {
  const runtime = promptSnapshot.promptConfig?.runtimeConfig || {};
  const maxAttempts = Math.max(1, Math.min(3, Number(runtime.maxAttempts || 1)));
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return { ...(await requestVisionAnalysis(source, bytes, promptSnapshot)), attemptCount: attempt };
    } catch (error) {
      lastError = error;
      const retryable = error.code === "PROVIDER_TIMEOUT" || Number(error.statusCode) === 429 || Number(error.statusCode) >= 500;
      if (!retryable || attempt === maxAttempts) throw error;
      const base = Math.max(0, Math.min(5000, Number(runtime.retryBaseMs || 500)));
      const ceiling = Math.max(base, Math.min(10_000, Number(runtime.retryMaxMs || 3000)));
      await new Promise((resolve) => setTimeout(resolve, Math.min(ceiling, base * (2 ** (attempt - 1)))));
    }
  }
  throw lastError;
}

async function analyzeRun(sql, runId) {
  const rows = await sql`select r.*, s.storage_key, s.mime_type, s.width, s.height, s.crop_spec, s.metadata, s.status as source_status from component_generation_runs r join component_design_sources s on s.id = r.source_id where r.id = ${runId}::uuid limit 1`;
  const run = rows[0];
  if (!run) throw generationError("RUN_NOT_FOUND", "분석 실행을 찾을 수 없습니다.", 404);
  if (run.source_status !== "ready") throw generationError("SOURCE_NOT_READY", "원본 이미지가 분석 가능한 상태가 아닙니다.", 409);
  await sql`update component_generation_runs set status = 'analyzing', attempt_count = attempt_count + 1, updated_at = now(), error_code = null, error_message = null where id = ${runId}::uuid`;
  try {
    const tokenCatalog = await fetchRenderTokenCatalog(sql);
    const promptSnapshot = await createPromptExecutionSnapshot(sql, "component_visual_analyzer", {
      componentIntent: run.component_intent,
      allowedSectionRolesJson: JSON.stringify(run.allowed_section_roles || []),
      tokenCatalogJson: JSON.stringify(tokenCatalog),
      outputContractJson: JSON.stringify(OUTPUT_CONTRACT),
      sourceWidth: run.width,
      sourceHeight: run.height,
      cropSpecJson: JSON.stringify(run.crop_spec || {}),
    });
    const promptConfig = promptSnapshot.promptConfig;
    const modelSnapshot = { provider: promptConfig.provider, model: promptConfig.model, temperature: promptConfig.temperature, maxTokens: promptConfig.maxTokens, responseFormat: promptConfig.responseFormat, modelOptions: promptConfig.modelOptions, runtimeConfig: promptConfig.runtimeConfig };
    await sql`update component_generation_runs set prompt_template_id = ${promptConfig.promptId}::uuid, prompt_snapshot = ${JSON.stringify(promptConfig)}::jsonb, model_snapshot = ${JSON.stringify(modelSnapshot)}::jsonb, updated_at = now() where id = ${runId}::uuid`;
    const analysisSource = { ...run, mime_type: run.metadata?.analysisMimeType || run.mime_type };
    const analysis = await requestVisionAnalysisWithRetry(analysisSource, await readSourceImage(run), promptSnapshot);
    await sql`update component_generation_runs set attempt_count = ${analysis.attemptCount}, updated_at = now() where id = ${runId}::uuid`;
    await sql`update component_generation_runs set status = 'validating', updated_at = now() where id = ${runId}::uuid`;
    const proposal = normalizeProposal(analysis.value, run.component_intent);
    const validation = validateRenderSpec(proposal.renderSpec, { fields: proposal.fields, tokenCatalog });
    const similar = await findSimilarComponents(sql, proposal);
    const reviewNotes = [...proposal.reviewNotes];
    if (!validation.ok) reviewNotes.push("RenderSpec 검증 오류를 수정해야 합니다.");
    if (similar[0]?.score >= 0.75) reviewNotes.push("기존 컴포넌트와 유사합니다. 새 컴포넌트 또는 새 버전 생성을 선택해 주세요.");
    if (proposal.confidence < 0.8) reviewNotes.push("분석 신뢰도가 낮아 관리자 검토가 필요합니다.");
    const tokenBindings = collectTokenBindings(proposal.renderSpec?.root);
    const definition = { name: proposal.name, description: proposal.description, fields: proposal.fields, allowedSectionRoles: run.allowed_section_roles, provider: analysis.provider, usage: analysis.usage, reviewRequired: !validation.ok || proposal.confidence < 0.8 || (similar[0]?.score || 0) >= 0.75, creationMode: similar[0]?.score >= 0.75 ? "new-version" : "new-component", targetComponentId: similar[0]?.score >= 0.75 ? similar[0].componentId : null };
    const inserted = await sql`
      insert into component_generation_proposals (run_id, component_definition, render_spec, responsive_spec, token_bindings, accessibility, similar_components, confidence, review_notes, validation_result)
      values (${runId}::uuid, ${JSON.stringify(definition)}::jsonb, ${JSON.stringify(validation.normalizedSpec || proposal.renderSpec || {})}::jsonb, ${JSON.stringify(proposal.renderSpec?.responsive || {})}::jsonb, ${JSON.stringify(tokenBindings)}::jsonb, ${JSON.stringify(proposal.renderSpec?.accessibility || {})}::jsonb, ${JSON.stringify(similar)}::jsonb, ${proposal.confidence}, ${JSON.stringify(reviewNotes)}::jsonb, ${JSON.stringify(validation)}::jsonb)
      returning id::text
    `;
    await sql`update component_generation_runs set status = 'ready', completed_at = now(), updated_at = now() where id = ${runId}::uuid`;
    return inserted[0].id;
  } catch (error) {
    await sql`update component_generation_runs set status = 'failed', error_code = ${String(error.code || "ANALYSIS_FAILED")}, error_message = ${String(error.message || "이미지 분석에 실패했습니다.").slice(0, 1000)}, completed_at = now(), updated_at = now() where id = ${runId}::uuid`;
    throw error;
  }
}

function generationError(code, message, statusCode = 400) {
  return Object.assign(new Error(message), { code, statusCode });
}

function createInputHash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function createIdempotencyKey(value) {
  return `${createInputHash(value)}:${randomUUID()}`;
}

module.exports = { OUTPUT_CONTRACT, normalizeRoles, normalizeProposal, collectTokenBindings, componentSimilarity, findSimilarComponents, analyzeRun, generationError, createInputHash, createIdempotencyKey };
