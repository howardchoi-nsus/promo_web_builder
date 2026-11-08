const BLOCKER_MESSAGES = Object.freeze({
  REFERENCE_NOT_APPROVED: "레퍼런스가 아직 승인되지 않았습니다.",
  COPYRIGHT_REVIEW_REQUIRED: "출처와 사용 범위 검토가 필요합니다.",
  REFERENCE_RESEARCH_ONLY_REQUIRED: "레퍼런스는 연구·분석 용도로만 표시되어야 합니다.",
  REFERENCE_QUALITY_BELOW_THRESHOLD: "품질 점수가 4.0 미만입니다.",
  REFERENCE_LAYOUT_SPEC_REQUIRED: "분석된 Layout Spec이 필요합니다.",
  REFERENCE_DESIGN_SUMMARY_REQUIRED: "디자인 분석 요약이 필요합니다.",
  COMPONENT_NOT_ACTIVE: "컴포넌트가 활성 상태가 아닙니다.",
  ACTIVE_VERSION_REQUIRED: "활성 컴포넌트 버전이 필요합니다.",
  RENDER_SPEC_REQUIRED: "레퍼런스 파생 컴포넌트에는 RenderSpec이 필요합니다.",
  RENDER_SPEC_INVALID: "RenderSpec 서버 검증을 통과해야 합니다.",
  SECTION_INSTANCE_REQUIRED: "활성 Registry Section 연결이 필요합니다.",
  SECTION_ROLE_NOT_ALLOWED: "컴포넌트 배치 정책과 Section 역할이 일치하지 않습니다.",
  LAYOUT_PRESET_REQUIRED: "연결된 Section에 Layout Preset이 필요합니다.",
  COMPOSITION_SHELL_NOT_ACTIVE: "활성 Composition Shell이 없습니다.",
  COMPOSITION_SHELL_ROLE_NOT_ALLOWED: "Composition Shell이 연결된 Section 역할을 허용하지 않습니다.",
});

function objectWithValues(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length);
}

function unique(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function readinessResult(blockerCodes, details = {}) {
  const codes = unique(blockerCodes);
  return {
    ready: codes.length === 0,
    status: codes.length === 0 ? "ready" : "blocked",
    blockerCodes: codes,
    blockers: codes.map((code) => ({ code, message: BLOCKER_MESSAGES[code] || code })),
    ...details,
  };
}

function layoutReferenceReadiness(reference = {}) {
  const blockerCodes = [];
  if (String(reference.status || "") !== "approved") blockerCodes.push("REFERENCE_NOT_APPROVED");
  if (reference.copyrightReviewed !== true && reference.copyright_reviewed !== true) {
    blockerCodes.push("COPYRIGHT_REVIEW_REQUIRED");
  }
  if (reference.researchOnly !== true && reference.research_only !== true) {
    blockerCodes.push("REFERENCE_RESEARCH_ONLY_REQUIRED");
  }
  if (Number(reference.qualityScore ?? reference.quality_score ?? 0) < 4) {
    blockerCodes.push("REFERENCE_QUALITY_BELOW_THRESHOLD");
  }
  if (!objectWithValues(reference.layoutSpec || reference.layout_spec)) {
    blockerCodes.push("REFERENCE_LAYOUT_SPEC_REQUIRED");
  }
  if (!String(reference.designSummary || reference.design_summary || "").trim()) {
    blockerCodes.push("REFERENCE_DESIGN_SUMMARY_REQUIRED");
  }
  return readinessResult(blockerCodes, { kind: "layout-reference" });
}

function componentGenerationReadiness({ component = {}, sections = [], shellAllowedRoles = [], shellActive = true } = {}) {
  const blockerCodes = [];
  const version = component.version || {};
  const referenceDerived = String(component.systemSeedCode || "").startsWith("ref-pattern-")
    || version.capabilities?.referenceDerived === true;
  if (component.status !== "active") blockerCodes.push("COMPONENT_NOT_ACTIVE");
  if (!version.id || version.status !== "active") blockerCodes.push("ACTIVE_VERSION_REQUIRED");
  if (referenceDerived && !version.renderContractVersion) blockerCodes.push("RENDER_SPEC_REQUIRED");
  if (referenceDerived && version.renderContractVersion && version.renderValidation?.ok !== true) {
    blockerCodes.push("RENDER_SPEC_INVALID");
  }

  const connected = sections.filter((section) => (
    section.status === "active"
    && ["registry", "shared"].includes(section.compositionScope)
    && section.isVisibleInWizard
    && section.instanceVisible
    && section.componentVersionStatus === "active"
  ));
  if (!connected.length) blockerCodes.push("SECTION_INSTANCE_REQUIRED");

  const allowedRoles = unique(version.placementPolicy?.allowedSectionRoles || []);
  const roleCompatible = connected.filter((section) => !allowedRoles.length || allowedRoles.includes(section.sectionRole));
  if (connected.length && !roleCompatible.length) blockerCodes.push("SECTION_ROLE_NOT_ALLOWED");
  if (roleCompatible.length && !roleCompatible.some((section) => Number(section.layoutCount || 0) > 0)) {
    blockerCodes.push("LAYOUT_PRESET_REQUIRED");
  }
  if (!shellActive) blockerCodes.push("COMPOSITION_SHELL_NOT_ACTIVE");
  else if (roleCompatible.length && shellAllowedRoles.length
    && !roleCompatible.some((section) => shellAllowedRoles.includes(section.sectionRole))) {
    blockerCodes.push("COMPOSITION_SHELL_ROLE_NOT_ALLOWED");
  }

  return readinessResult(blockerCodes, {
    kind: "component",
    referenceDerived,
    componentId: component.id || "",
    componentVersionId: version.id || "",
    eligibleSectionIds: roleCompatible.map((section) => section.id),
    eligibleSectionRoles: unique(roleCompatible.map((section) => section.sectionRole)),
  });
}

async function fetchComponentGenerationReadiness(sql, componentId) {
  const componentRows = await sql`
    select component.id::text, component.system_seed_code, component.status,
      version.id::text as version_id, version.version, version.status as version_status,
      version.capabilities, version.placement_policy, version.render_contract_version,
      version.render_validation
    from wizard_item_components component
    left join lateral (
      select candidate.* from wizard_item_component_versions candidate
      where candidate.component_id = component.id
      order by (candidate.status = 'active') desc, candidate.version desc
      limit 1
    ) version on true
    where component.id = ${componentId}::uuid
    limit 1
  `;
  const row = componentRows[0];
  if (!row) return null;
  const sectionRows = await sql`
    select section.id::text, section.section_key, section.name,
      section.status, section.composition_scope, section.section_role,
      section.is_visible_in_wizard, instance.is_visible_in_wizard as instance_visible,
      version.status as component_version_status,
      count(distinct layout.id)::integer as layout_count
    from wizard_content_section_component_instances instance
    join wizard_item_component_versions version on version.id = instance.component_version_id
    join wizard_content_sections section on section.id = instance.section_id
    left join wizard_content_section_layouts layout on layout.section_id = section.id
    where version.component_id = ${componentId}::uuid
    group by section.id, section.section_key, section.name, section.status,
      section.composition_scope, section.section_role, section.is_visible_in_wizard,
      instance.is_visible_in_wizard, version.status
    order by section.sort_order, section.section_key
  `;
  let shellRows = [];
  try {
    shellRows = await sql`
      select version.config_json->'allowedSectionRoles' as allowed_roles
      from promo_composition_shell_versions version
      join promo_composition_shells shell on shell.id = version.shell_id
      where version.status = 'active' and shell.status = 'active'
    `;
  } catch (error) {
    if (!/promo_composition_shell/i.test(String(error?.message || ""))) throw error;
  }
  const shellAllowedRoles = unique(shellRows.flatMap((shell) => (
    Array.isArray(shell.allowed_roles) ? shell.allowed_roles.map((role) => String(role || "")) : []
  )));
  return componentGenerationReadiness({
    component: {
      id: row.id,
      systemSeedCode: row.system_seed_code,
      status: row.status,
      version: {
        id: row.version_id,
        version: Number(row.version || 0),
        status: row.version_status,
        capabilities: row.capabilities || {},
        placementPolicy: row.placement_policy || {},
        renderContractVersion: row.render_contract_version == null ? null : Number(row.render_contract_version),
        renderValidation: row.render_validation || null,
      },
    },
    sections: sectionRows.map((section) => ({
      id: section.id,
      sectionKey: section.section_key,
      name: section.name,
      status: section.status,
      compositionScope: section.composition_scope,
      sectionRole: section.section_role,
      isVisibleInWizard: Boolean(section.is_visible_in_wizard),
      instanceVisible: Boolean(section.instance_visible),
      componentVersionStatus: section.component_version_status,
      layoutCount: Number(section.layout_count || 0),
    })),
    shellAllowedRoles,
    shellActive: shellRows.length > 0,
  });
}

module.exports = {
  BLOCKER_MESSAGES,
  componentGenerationReadiness,
  fetchComponentGenerationReadiness,
  layoutReferenceReadiness,
};
