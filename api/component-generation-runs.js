const { getSql, parseBody } = require("./_item-components-store");
const { normalizeRoles, analyzeRun, createInputHash, createIdempotencyKey } = require("./_component-generation-service");

module.exports = async function handler(req, res) {
  let runId = "";
  try {
    const sql = getSql();
    if (req.method === "GET") {
      runId = String(req.query.id || "").trim();
      if (!runId) return res.status(400).json({ error: "id is required" });
      const run = await fetchRun(sql, runId);
      if (!run) return res.status(404).json({ error: "Generation run not found" });
      return res.status(200).json({ ok: true, run });
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed" });
    }
    const body = parseBody(req.body);
    const sourceId = String(body.sourceId || "").trim();
    const componentIntent = String(body.componentIntent || "").trim();
    if (!sourceId || !componentIntent) return res.status(400).json({ error: "sourceId and componentIntent are required" });
    const roles = normalizeRoles(body.allowedSectionRoles);
    const input = { sourceId, componentIntent, roles, targetDesignTokenSetVersionId: String(body.targetDesignTokenSetVersionId || "") };
    const rows = await sql`
      insert into component_generation_runs (source_id, component_intent, allowed_section_roles, target_design_token_set_version_id, input_hash, idempotency_key)
      values (${sourceId}::uuid, ${componentIntent}, ${JSON.stringify(roles)}::jsonb, ${input.targetDesignTokenSetVersionId || null}::uuid, ${createInputHash(input)}, ${String(body.idempotencyKey || "").trim() || createIdempotencyKey(input)})
      returning id::text
    `;
    runId = rows[0].id;
    await analyzeRun(sql, runId);
    return res.status(201).json({ ok: true, run: await fetchRun(sql, runId) });
  } catch (error) {
    const status = Number(error.statusCode || 500);
    return res.status(status).json({ error: error.code || "Component generation failed", message: localizedMessage(error), ...(runId ? { runId } : {}) });
  }
};

async function fetchRun(sql, id) {
  const rows = await sql`
    select r.id::text, r.source_id::text, r.status, r.component_intent, r.allowed_section_roles,
      r.target_design_token_set_version_id::text, r.prompt_template_id::text, r.prompt_snapshot, r.model_snapshot,
      r.attempt_count, r.error_code, r.error_message, r.created_at, r.updated_at, r.completed_at,
      p.id::text as proposal_id, p.component_definition, p.render_spec, p.responsive_spec, p.token_bindings,
      p.accessibility, p.similar_components, p.confidence, p.review_notes, p.validation_result,
      s.width as source_width, s.height as source_height, s.crop_spec, s.mime_type
    from component_generation_runs r
    join component_design_sources s on s.id = r.source_id
    left join lateral (select * from component_generation_proposals where run_id = r.id order by proposal_version desc limit 1) p on true
    where r.id = ${id}::uuid limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id, sourceId: row.source_id, status: row.status, componentIntent: row.component_intent,
    allowedSectionRoles: row.allowed_section_roles || [], targetDesignTokenSetVersionId: row.target_design_token_set_version_id,
    promptTemplateId: row.prompt_template_id, promptSnapshot: row.prompt_snapshot || {}, modelSnapshot: row.model_snapshot || {},
    attemptCount: Number(row.attempt_count || 0), errorCode: row.error_code, errorMessage: row.error_message,
    createdAt: row.created_at, updatedAt: row.updated_at, completedAt: row.completed_at,
    source: { width: Number(row.source_width), height: Number(row.source_height), cropSpec: row.crop_spec || {}, mimeType: row.mime_type, imageUrl: `/api/component-design-source-image?id=${encodeURIComponent(row.source_id)}` },
    proposal: row.proposal_id ? { id: row.proposal_id, componentDefinition: row.component_definition || {}, renderSpec: row.render_spec || {}, responsiveSpec: row.responsive_spec || {}, tokenBindings: row.token_bindings || {}, accessibility: row.accessibility || {}, similarComponents: row.similar_components || [], confidence: row.confidence == null ? null : Number(row.confidence), reviewNotes: row.review_notes || [], validationResult: row.validation_result || {} } : null,
  };
}

function localizedMessage(error) {
  const map = { PROMPT_CONFIGURATION_REQUIRED: "컴포넌트 이미지 분석 프롬프트 설정이 필요합니다.", PROVIDER_NOT_CONFIGURED: "이미지 분석 API 키가 설정되지 않았습니다.", PROVIDER_TIMEOUT: "이미지 분석 시간이 초과되었습니다. 원본 업로드 없이 다시 시도할 수 있습니다." };
  if (Number(error.statusCode) === 409 && /Active component_visual_analyzer prompt template not found/.test(String(error.message))) {
    return "관리자 LLM 설정에서 '컴포넌트 이미지 분석' 프롬프트를 생성·검증·활성화해 주세요.";
  }
  return map[error.code] || String(error.message || "컴포넌트 분석에 실패했습니다.");
}

module.exports.fetchRun = fetchRun;
module.exports.localizedMessage = localizedMessage;
