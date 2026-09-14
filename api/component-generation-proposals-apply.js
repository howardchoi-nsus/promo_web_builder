const createComponent = require("./item-components");
const updateComponent = require("./item-component");
const { getSql, parseBody } = require("./_item-components-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const ids = [...new Set((Array.isArray(parseBody(req.body).proposalIds) ? parseBody(req.body).proposalIds : []).map((id) => String(id || "").trim()).filter(Boolean))].slice(0, 12);
    if (!ids.length) return res.status(400).json({ error: "proposalIds are required" });
    const sql = getSql();
    const results = [];
    for (const proposalId of ids) {
      try {
        const rows = await sql`select id::text, component_definition, render_spec, validation_result, applied_at from component_generation_proposals where id = ${proposalId}::uuid limit 1`;
        const proposal = rows[0];
        if (!proposal) throw Object.assign(new Error("컴포넌트 후보를 찾을 수 없습니다."), { statusCode: 404 });
        if (proposal.applied_at) throw Object.assign(new Error("이미 Draft로 생성된 후보입니다."), { statusCode: 409 });
        if (proposal.validation_result?.ok !== true) throw Object.assign(new Error("RenderSpec 검증을 통과한 후보만 생성할 수 있습니다."), { statusCode: 422 });
        if (proposal.component_definition?.selected === false) throw Object.assign(new Error("선택 해제된 후보입니다."), { statusCode: 409 });
        if (proposal.component_definition?.creationMode === "new-version") throw Object.assign(new Error("기존 컴포넌트 새 버전 후보는 개별 검토 후 생성해 주세요."), { statusCode: 409 });

        const provisionalFields = proposal.component_definition?.fields || [];
        const createFields = provisionalFields.map((field) => {
          const { fieldKey, id, ...rest } = field;
          void fieldKey; void id;
          return { ...rest, textType: rest.fieldKind === "text" ? (rest.textType === "title" ? "title" : "multi") : null };
        });
        const created = await invoke(createComponent, {
          method: "POST",
          body: {
            name: proposal.component_definition.name,
            description: proposal.component_definition.description,
            fieldKind: createFields[0]?.fieldKind,
            textType: createFields[0]?.textType,
            fields: createFields,
            placementPolicy: { allowedSectionRoles: proposal.component_definition.allowedSectionRoles || [] },
            libraryPresentation: { category: "", iconKey: "", keywords: ["ai-generated"], displayOrder: 100, isFeatured: false },
            changeNote: "이미지 분석 후보에서 생성된 컴포넌트 Draft.",
          },
        });
        if (created.status >= 400) throw Object.assign(new Error(created.body.message || created.body.error), { statusCode: created.status });
        const component = created.body.component;
        const keyMap = new Map(provisionalFields.map((field, index) => [field.fieldKey, component.fields?.[index]?.fieldKey]).filter(([, target]) => target));
        const remappedRenderSpec = remapRenderSpecFieldKeys(proposal.render_spec, keyMap);
        const updated = await invoke(updateComponent, {
          method: "PATCH",
          query: { componentId: component.id },
          body: {
            ...component,
            versionId: component.versionId,
            fields: component.fields,
            renderSpec: remappedRenderSpec,
            changeNote: "이미지 분석 RenderSpec을 연결한 컴포넌트 Draft.",
          },
        });
        if (updated.status >= 400) throw Object.assign(new Error(updated.body.message || updated.body.error), { statusCode: updated.status });
        await sql`update component_generation_proposals set applied_component_id = ${component.id}::uuid, applied_version_id = ${component.versionId}::uuid, applied_at = now(), updated_at = now() where id = ${proposalId}::uuid`;
        results.push({ proposalId, ok: true, componentId: component.id, versionId: component.versionId, name: component.name });
      } catch (error) {
        results.push({ proposalId, ok: false, status: error.statusCode || 500, message: error.message });
      }
    }
    const succeeded = results.filter((item) => item.ok).length;
    return res.status(succeeded === results.length ? 201 : succeeded ? 207 : 422).json({ ok: succeeded === results.length, succeeded, failed: results.length - succeeded, results });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Component proposal apply failed", message: error.message });
  }
};

function remapRenderSpecFieldKeys(renderSpec, keyMap) {
  const next = JSON.parse(JSON.stringify(renderSpec || {}));
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.nodeType === "field" && keyMap.has(node.fieldKey)) node.fieldKey = keyMap.get(node.fieldKey);
    (node.children || []).forEach(visit);
  };
  visit(next.root);
  return next;
}

async function invoke(handler, request) {
  const response = { statusCode: 200, body: null, headers: {}, setHeader(name, value) { this.headers[name] = value; }, status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return value; }, send(value) { this.body = value; return value; } };
  await handler({ query: {}, ...request }, response);
  return { status: response.statusCode, body: response.body || {} };
}

module.exports.remapRenderSpecFieldKeys = remapRenderSpecFieldKeys;
