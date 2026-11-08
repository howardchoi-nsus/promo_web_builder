const { createHash } = require("node:crypto");
const { normalizeLayoutSnapshot } = require("./_wizard-content-section-layouts-store");
const { layoutReferenceReadiness } = require("./_reference-component-readiness");

const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;

const PUBLISH_BLOCKER_MESSAGES = Object.freeze({
  COMPONENT_VERSION_NOT_FOUND: "발행할 컴포넌트 버전을 찾을 수 없습니다.",
  COMPONENT_NOT_ACTIVE: "보관된 컴포넌트는 발행할 수 없습니다.",
  COMPONENT_VERSION_STATUS_INVALID: "초안·비활성·활성 버전만 발행할 수 있습니다.",
  RENDER_SPEC_REQUIRED: "검증된 RenderSpec이 필요합니다.",
  RENDER_SPEC_INVALID: "RenderSpec 서버 검증 결과와 해시가 유효해야 합니다.",
  SECTION_NOT_FOUND: "연결할 Section을 찾을 수 없습니다.",
  SECTION_NOT_ACTIVE: "활성 Section만 연결할 수 있습니다.",
  SECTION_SCOPE_NOT_ALLOWED: "Registry 또는 Shared Section만 사용할 수 있습니다.",
  SECTION_NOT_VISIBLE: "Wizard에 노출되는 Section만 사용할 수 있습니다.",
  SECTION_ROLE_NOT_ALLOWED: "컴포넌트 배치 정책이 선택한 Section 역할을 허용하지 않습니다.",
  SECTION_ITEM_KEY_REQUIRED: "Section에서 사용할 itemKey가 필요합니다.",
  SECTION_ITEM_KEY_CONFLICT: "같은 itemKey에 다른 컴포넌트가 이미 연결되어 있습니다.",
  LAYOUT_PRESET_REQUIRED: "Desktop·Mobile Layout Preset이 필요합니다.",
  LAYOUT_PRESET_NOT_FOUND: "선택한 Layout Preset을 찾을 수 없습니다.",
  LAYOUT_ITEM_BINDING_INVALID: "Layout Preset의 itemKey가 컴포넌트 연결과 일치하지 않습니다.",
  RESPONSIVE_LAYOUT_INVALID: "Desktop과 Mobile 배치 정보가 모두 필요합니다.",
  REFERENCE_EVIDENCE_REQUIRED: "레퍼런스 파생 컴포넌트에는 승인된 근거 레퍼런스가 필요합니다.",
  REFERENCE_NOT_FOUND: "선택한 레퍼런스를 찾을 수 없습니다.",
  COMPOSITION_SHELL_NOT_ACTIVE: "활성 Composition Shell이 없습니다.",
  COMPOSITION_SHELL_ROLE_NOT_ALLOWED: "Composition Shell이 선택한 Section 역할을 허용하지 않습니다.",
});

function uniqueStrings(value, limit = 100) {
  return [...new Set((Array.isArray(value) ? value : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean))].slice(0, limit);
}

function normalizePublishInput(value = {}) {
  return {
    componentVersionId: String(value.componentVersionId || "").trim(),
    sectionId: String(value.sectionId || "").trim(),
    layoutPresetIds: uniqueStrings(value.layoutPresetIds),
    referenceIds: uniqueStrings(value.referenceIds),
    itemKey: String(value.itemKey || "").trim(),
  };
}

function validatePublishInput(input) {
  const errors = [];
  for (const key of ["componentVersionId", "sectionId"]) {
    if (!UUID_PATTERN.test(input[key])) errors.push(`${key} must be a UUID`);
  }
  for (const [key, values] of [["layoutPresetIds", input.layoutPresetIds], ["referenceIds", input.referenceIds]]) {
    if (values.some((id) => !UUID_PATTERN.test(id))) errors.push(`${key} must contain UUID values`);
  }
  if (input.itemKey && !/^[a-zA-Z][a-zA-Z0-9_-]{0,79}$/.test(input.itemKey)) {
    errors.push("itemKey must start with a letter and contain only letters, numbers, _ or -");
  }
  return errors;
}

function blocker(code, details = {}) {
  return { code, message: PUBLISH_BLOCKER_MESSAGES[code] || code, ...details };
}

function evaluatePublishPlanData({
  input,
  component = null,
  section = null,
  layouts = [],
  references = [],
  instances = [],
  shellActive = false,
  shellAllowedRoles = [],
  requestedLayoutCount = 0,
  requestedReferenceCount = 0,
} = {}) {
  const blockers = [];
  const add = (code, details) => {
    if (!blockers.some((entry) => entry.code === code)) blockers.push(blocker(code, details));
  };
  const version = component?.version || {};
  const referenceDerived = String(component?.systemSeedCode || "").startsWith("ref-pattern-")
    || version.capabilities?.referenceDerived === true;
  const itemKey = input.itemKey || instances.find((entry) => entry.componentId === component?.id)?.itemKey || "";

  if (!component) add("COMPONENT_VERSION_NOT_FOUND");
  else {
    if (component.status !== "active") add("COMPONENT_NOT_ACTIVE");
    if (!["draft", "inactive", "active"].includes(version.status)) add("COMPONENT_VERSION_STATUS_INVALID");
    if (!version.renderContractVersion || !version.renderTree) add("RENDER_SPEC_REQUIRED");
    if (version.renderContractVersion && (
      version.renderValidation?.ok !== true
      || !/^[a-f0-9]{64}$/.test(String(version.renderValidation?.hash || ""))
    )) add("RENDER_SPEC_INVALID");
  }

  if (!section) add("SECTION_NOT_FOUND");
  else {
    if (section.status !== "active") add("SECTION_NOT_ACTIVE");
    if (!["registry", "shared"].includes(section.compositionScope)) add("SECTION_SCOPE_NOT_ALLOWED");
    if (!section.isVisibleInWizard) add("SECTION_NOT_VISIBLE");
    const allowedRoles = uniqueStrings(version.placementPolicy?.allowedSectionRoles);
    const deniedRoles = uniqueStrings(version.placementPolicy?.deniedSectionRoles);
    if ((allowedRoles.length && !allowedRoles.includes(section.sectionRole)) || deniedRoles.includes(section.sectionRole)) {
      add("SECTION_ROLE_NOT_ALLOWED");
    }
  }

  if (!itemKey) add("SECTION_ITEM_KEY_REQUIRED");
  if (itemKey && instances.some((entry) => entry.itemKey === itemKey && entry.componentId !== component?.id)) {
    add("SECTION_ITEM_KEY_CONFLICT");
  }

  if (!layouts.length) add("LAYOUT_PRESET_REQUIRED");
  if (requestedLayoutCount && layouts.length !== requestedLayoutCount) add("LAYOUT_PRESET_NOT_FOUND");
  for (const layout of layouts) {
    const validation = normalizeLayoutSnapshot(layout.layoutSnapshot || {}, itemKey ? [itemKey] : []);
    if (validation.errors.length) add("LAYOUT_ITEM_BINDING_INVALID", {
      layoutId: layout.id,
      errors: validation.errors,
    });
    const desktop = layout.layoutSnapshot?.viewports?.desktop?.items?.[itemKey];
    const mobile = layout.layoutSnapshot?.viewports?.mobile?.items?.[itemKey];
    if (!desktop || !mobile) add("RESPONSIVE_LAYOUT_INVALID", { layoutId: layout.id });
  }

  if (requestedReferenceCount && references.length !== requestedReferenceCount) add("REFERENCE_NOT_FOUND");
  if (referenceDerived && !references.length) add("REFERENCE_EVIDENCE_REQUIRED");
  for (const reference of references) {
    for (const referenceBlocker of layoutReferenceReadiness(reference).blockers) {
      if (!blockers.some((entry) => entry.code === referenceBlocker.code)) blockers.push(referenceBlocker);
    }
  }

  if (!shellActive) add("COMPOSITION_SHELL_NOT_ACTIVE");
  else if (section && shellAllowedRoles.length && !shellAllowedRoles.includes(section.sectionRole)) {
    add("COMPOSITION_SHELL_ROLE_NOT_ALLOWED");
  }

  return {
    ready: blockers.length === 0,
    status: blockers.length ? "blocked" : "ready",
    blockers,
    blockerCodes: blockers.map((entry) => entry.code),
    referenceDerived,
    resolvedItemKey: itemKey,
    expectedPlannerCandidate: blockers.length === 0,
  };
}

async function buildReferenceComponentPublishPlan(sql, value = {}) {
  const input = normalizePublishInput(value);
  const inputErrors = validatePublishInput(input);
  if (inputErrors.length) {
    const error = new Error(inputErrors.join("; "));
    error.statusCode = 400;
    error.code = "REFERENCE_COMPONENT_PUBLISH_INPUT_INVALID";
    throw error;
  }
  const componentRows = await sql`
    select component.id::text, component.component_key, component.system_seed_code,
      component.name, component.status as component_status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.capabilities, version.placement_policy, version.render_contract_version,
      version.render_tree, version.render_validation
    from wizard_item_component_versions version
    join wizard_item_components component on component.id = version.component_id
    where version.id = ${input.componentVersionId}::uuid
    limit 1
  `;
  const componentRow = componentRows[0] || null;
  const sectionRows = await sql`
    select id::text, section_key, name, status, composition_scope, section_role, is_visible_in_wizard
    from wizard_content_sections where id = ${input.sectionId}::uuid limit 1
  `;
  const layoutRows = input.layoutPresetIds.length
    ? await sql`
      select id::text, section_id::text, layout_key, name, layout_snapshot
      from wizard_content_section_layouts
      where section_id = ${input.sectionId}::uuid and id = any(${input.layoutPresetIds}::uuid[])
      order by is_default desc, created_at
    `
    : await sql`
      select id::text, section_id::text, layout_key, name, layout_snapshot
      from wizard_content_section_layouts
      where section_id = ${input.sectionId}::uuid
      order by is_default desc, created_at
    `;
  const referenceRows = input.referenceIds.length ? await sql`
    select id::text, title, status, copyright_reviewed, research_only,
      quality_score, layout_spec, design_summary
    from promo_layout_references where id = any(${input.referenceIds}::uuid[])
  ` : [];
  const instanceRows = await sql`
    select instance.id::text, instance.item_key, version.component_id::text
    from wizard_content_section_component_instances instance
    join wizard_item_component_versions version on version.id = instance.component_version_id
    where instance.section_id = ${input.sectionId}::uuid
  `;
  let shellRows = [];
  try {
    shellRows = await sql`
      select version.id::text, version.config_json->'allowedSectionRoles' as allowed_roles
      from promo_composition_shell_versions version
      join promo_composition_shells shell on shell.id = version.shell_id
      where version.status = 'active' and shell.status = 'active'
    `;
  } catch (error) {
    if (!/promo_composition_shell/i.test(String(error?.message || ""))) throw error;
  }
  const shellAllowedRoles = uniqueStrings(shellRows.flatMap((row) => (
    Array.isArray(row.allowed_roles) ? row.allowed_roles : []
  )));
  const component = componentRow ? {
    id: componentRow.id,
    componentKey: componentRow.component_key,
    systemSeedCode: componentRow.system_seed_code,
    name: componentRow.name,
    status: componentRow.component_status,
    version: {
      id: componentRow.version_id,
      version: Number(componentRow.version || 0),
      status: componentRow.version_status,
      capabilities: componentRow.capabilities || {},
      placementPolicy: componentRow.placement_policy || {},
      renderContractVersion: componentRow.render_contract_version == null ? null : Number(componentRow.render_contract_version),
      renderTree: componentRow.render_tree || null,
      renderValidation: componentRow.render_validation || null,
    },
  } : null;
  const sectionRow = sectionRows[0] || null;
  const section = sectionRow ? {
    id: sectionRow.id,
    sectionKey: sectionRow.section_key,
    name: sectionRow.name,
    status: sectionRow.status,
    compositionScope: sectionRow.composition_scope,
    sectionRole: sectionRow.section_role,
    isVisibleInWizard: Boolean(sectionRow.is_visible_in_wizard),
  } : null;
  const layouts = layoutRows.map((row) => ({
    id: row.id, sectionId: row.section_id, layoutKey: row.layout_key,
    name: row.name, layoutSnapshot: row.layout_snapshot || {},
  }));
  const references = referenceRows.map((row) => ({
    id: row.id, title: row.title, status: row.status,
    copyrightReviewed: Boolean(row.copyright_reviewed), researchOnly: Boolean(row.research_only),
    qualityScore: Number(row.quality_score || 0), layoutSpec: row.layout_spec || {},
    designSummary: row.design_summary || "",
  }));
  const instances = instanceRows.map((row) => ({
    id: row.id, itemKey: row.item_key, componentId: row.component_id,
  }));
  const readiness = evaluatePublishPlanData({
    input, component, section, layouts, references, instances,
    shellActive: shellRows.length > 0, shellAllowedRoles,
    requestedLayoutCount: input.layoutPresetIds.length,
    requestedReferenceCount: input.referenceIds.length,
  });
  const plan = {
    contractVersion: 1,
    input: { ...input, itemKey: readiness.resolvedItemKey },
    component,
    section,
    layouts: layouts.map(({ layoutSnapshot, ...layout }) => layout),
    references,
    shell: { active: shellRows.length > 0, allowedSectionRoles: shellAllowedRoles },
    readiness,
    changes: readiness.ready ? [
      { action: "activate-component-version", componentVersionId: input.componentVersionId },
      { action: "upsert-section-instance", sectionId: input.sectionId, itemKey: readiness.resolvedItemKey },
      ...references.map((reference) => ({ action: "link-reference", referenceId: reference.id })),
    ] : [],
  };
  plan.fingerprint = createHash("sha256").update(JSON.stringify(plan)).digest("hex");
  return plan;
}

module.exports = {
  PUBLISH_BLOCKER_MESSAGES,
  UUID_PATTERN,
  buildReferenceComponentPublishPlan,
  evaluatePublishPlanData,
  normalizePublishInput,
  validatePublishInput,
};
