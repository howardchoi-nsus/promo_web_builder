const STATUS_PRIORITY = Object.freeze({
  active: 0,
  validated: 1,
  draft: 2,
  inactive: 3,
  archived: 4,
});

const PROMPT_WORKFLOW_GROUPS = Object.freeze([
  {
    key: "promotion-overview",
    label: "프로모션 개요",
    description: "사용자의 자연어 요청을 프로모션 기획 정보로 구조화합니다.",
    order: 10,
  },
  {
    key: "template-selection",
    label: "템플릿 선택 및 구성",
    description: "개요에 맞는 템플릿을 추천하고 섹션·컴포넌트 구성을 계획합니다.",
    order: 20,
  },
  {
    key: "section-layout",
    label: "섹션 구성 및 레이아웃",
    description: "섹션의 컴포넌트 구성, 레이아웃과 다중 선택 정렬을 계획합니다.",
    order: 30,
  },
  {
    key: "promotion-image",
    label: "프로모션 이미지",
    description: "섹션 키비주얼과 컴포넌트 필드 이미지를 필요할 때 생성합니다.",
    order: 40,
  },
  {
    key: "design-generator",
    label: "디자인 생성기",
    description: "통합 브리프부터 LO-FI 시안과 최종 디자인까지 생성합니다.",
    order: 50,
  },
  {
    key: "shared-execution",
    label: "독립·공통 실행",
    description: "특정 화면 흐름과 분리되어 독립적으로 호출되는 실행 프롬프트입니다.",
    order: 60,
  },
  {
    key: "other",
    label: "기타",
    description: "아직 관리 그룹이 지정되지 않은 프롬프트입니다.",
    order: 999,
  },
]);

const PROMPT_TYPE_CATALOG = Object.freeze({
  promo_overview_parser: {
    group: "promotion-overview",
    order: 10,
    label: "프로모션 개요 분석",
    description: "간단한 자연어 요청을 제목, 목적, 대상, 톤과 주요 혜택으로 구조화합니다.",
    executionMode: "사용자 요청",
  },
  promo_template_recommender: {
    group: "template-selection",
    order: 10,
    label: "프로모션 템플릿 추천",
    description: "확정된 프로모션 개요에 적합한 활성 템플릿 후보를 추천합니다.",
    executionMode: "사용자 요청",
  },
  promo_template_composer: {
    group: "template-selection",
    order: 20,
    label: "템플릿 구성 계획",
    description: "선택한 템플릿의 섹션과 컴포넌트에 프로모션 콘텐츠를 매핑합니다.",
    executionMode: "사용자 요청",
  },
  section_composition_planner: {
    group: "section-layout",
    order: 10,
    label: "자연어 섹션 구성 계획",
    description: "자연어 요청을 바탕으로 섹션 컴포넌트, 콘텐츠와 디자인 토큰을 제안합니다.",
    executionMode: "선택 실행",
  },
  section_layout_planner: {
    group: "section-layout",
    order: 20,
    label: "섹션 레이아웃 계획",
    description: "섹션 전체의 허용 레이아웃과 스타일 슬롯을 안전한 명령으로 계획합니다.",
    executionMode: "선택 실행",
  },
  multi_component_layout_planner: {
    group: "section-layout",
    order: 30,
    label: "다중 컴포넌트 정렬 계획",
    description: "선택한 여러 컴포넌트의 정렬, 간격과 배치를 안전한 명령으로 제안합니다.",
    executionMode: "선택 실행",
  },
  section_background_image: {
    group: "promotion-image",
    order: 10,
    label: "섹션 키비주얼 생성",
    description: "섹션 콘텐츠와 배경색을 바탕으로 프로모션 키비주얼을 생성합니다.",
    executionMode: "선택 실행",
  },
  component_image: {
    group: "promotion-image",
    order: 20,
    label: "컴포넌트 이미지 생성",
    description: "특정 컴포넌트 이미지 필드의 목적에 맞는 이미지를 생성합니다.",
    executionMode: "선택 실행",
  },
  integrated_brief: {
    group: "design-generator",
    order: 10,
    label: "통합 디자인 브리프",
    description: "프로모션 입력과 선택 문서를 통합해 디자인 생성 기준을 구성합니다.",
    executionMode: "자동 실행",
  },
  lofi_draft: {
    group: "design-generator",
    order: 20,
    label: "LO-FI 시안 생성",
    description: "통합 디자인 브리프를 바탕으로 검토용 저충실도 시안을 생성합니다.",
    executionMode: "자동 실행",
  },
  final_design: {
    group: "design-generator",
    order: 30,
    label: "최종 디자인 생성",
    description: "승인된 LO-FI 시안과 브리프를 바탕으로 최종 디자인을 생성합니다.",
    executionMode: "사용자 요청",
  },
  image_execution: {
    group: "shared-execution",
    order: 10,
    label: "이미지 실행 프롬프트",
    description: "LO-FI·최종 디자인 흐름과 분리된 독립 이미지 생성 요청에 사용합니다.",
    executionMode: "독립 실행",
  },
});

function promptTypeMeta(type) {
  const normalizedType = String(type || "").trim();
  return PROMPT_TYPE_CATALOG[normalizedType] || {
    group: "other",
    order: 999,
    label: normalizedType || "알 수 없음",
    description: "이 프롬프트 유형의 관리 설명이 아직 등록되지 않았습니다.",
    executionMode: "실행 방식 미지정",
  };
}

function promptWorkflowGroupMeta(key) {
  return PROMPT_WORKFLOW_GROUPS.find((group) => group.key === key)
    || PROMPT_WORKFLOW_GROUPS[PROMPT_WORKFLOW_GROUPS.length - 1];
}

function versionNumber(prompt) {
  const value = Number(prompt?.version);
  return Number.isFinite(value) ? value : 0;
}

function updatedTime(prompt) {
  const value = Date.parse(prompt?.updatedAt || "");
  return Number.isFinite(value) ? value : 0;
}

function compareVersions(left, right) {
  return versionNumber(right) - versionNumber(left)
    || updatedTime(right) - updatedTime(left)
    || String(left?.id || "").localeCompare(String(right?.id || ""));
}

function promptLineageId(prompt) {
  const lineageId = String(prompt?.lineageId || "").trim();
  if (lineageId) return lineageId;
  return `legacy:${String(prompt?.type || "unknown")}:${String(prompt?.id || "unknown")}`;
}

function selectPromptGroupPrimary(group) {
  if (!group) return null;
  return group.active
    || group.validated
    || group.draft
    || group.latestInactive
    || group.latestArchived
    || group.versions?.[0]
    || null;
}

function groupPromptTemplates(prompts = []) {
  const groupsByLineage = new Map();
  prompts.filter((prompt) => prompt && typeof prompt === "object").forEach((prompt) => {
    const lineageId = promptLineageId(prompt);
    if (!groupsByLineage.has(lineageId)) {
      groupsByLineage.set(lineageId, { lineageId, versions: [] });
    }
    groupsByLineage.get(lineageId).versions.push(prompt);
  });

  return [...groupsByLineage.values()].map((group) => {
    const versions = [...group.versions].sort(compareVersions);
    const active = versions.find((prompt) => prompt.status === "active") || null;
    const validated = versions.find((prompt) => prompt.status === "validated") || null;
    const draft = versions.find((prompt) => prompt.status === "draft") || null;
    const latestInactive = versions.find((prompt) => prompt.status === "inactive") || null;
    const latestArchived = versions.find((prompt) => prompt.status === "archived") || null;
    const nextGroup = {
      ...group,
      versions,
      active,
      validated,
      draft,
      latestInactive,
      latestArchived,
      archivedCount: versions.filter((prompt) => prompt.status === "archived").length,
      hasCandidate: Boolean(validated || draft),
    };
    const primary = selectPromptGroupPrimary(nextGroup);
    return {
      ...nextGroup,
      primary,
      type: primary?.type || versions[0]?.type || "",
      name: primary?.name || versions[0]?.name || "",
      updatedAt: versions.reduce((latest, prompt) => (
        updatedTime(prompt) > updatedTime(latest) ? prompt : latest
      ), versions[0] || null)?.updatedAt || null,
    };
  }).sort((left, right) => (
    promptWorkflowGroupMeta(promptTypeMeta(left.type).group).order
      - promptWorkflowGroupMeta(promptTypeMeta(right.type).group).order
    || promptTypeMeta(left.type).order - promptTypeMeta(right.type).order
    || String(left.name || "").localeCompare(String(right.name || ""))
    || String(left.lineageId).localeCompare(String(right.lineageId))
  ));
}

function filterPromptGroups(groups = [], type = "") {
  const normalizedType = String(type || "").trim();
  return normalizedType
    ? groups.filter((group) => group.type === normalizedType)
    : groups;
}

function findPromptGroup(groups = [], promptId = "") {
  const normalizedId = String(promptId || "");
  return groups.find((group) => group.versions.some((prompt) => prompt.id === normalizedId)) || null;
}

function groupPromptTemplateSections(groups = []) {
  const sectionsByKey = new Map();
  groups.forEach((group) => {
    const promptMeta = promptTypeMeta(group?.type);
    const workflow = promptWorkflowGroupMeta(promptMeta.group);
    if (!sectionsByKey.has(workflow.key)) {
      sectionsByKey.set(workflow.key, {
        ...workflow,
        promptGroups: [],
      });
    }
    sectionsByKey.get(workflow.key).promptGroups.push(group);
  });
  return [...sectionsByKey.values()]
    .map((section) => ({
      ...section,
      promptGroups: [...section.promptGroups].sort((left, right) => (
        promptTypeMeta(left?.type).order - promptTypeMeta(right?.type).order
        || String(left?.name || "").localeCompare(String(right?.name || ""))
      )),
    }))
    .sort((left, right) => left.order - right.order);
}

function resolvePromptSelection(groups = [], selectedPromptTemplateId = "", preferredType = "image_execution") {
  const selectedGroup = findPromptGroup(groups, selectedPromptTemplateId);
  if (selectedGroup) {
    return selectedGroup.versions.find((prompt) => prompt.id === selectedPromptTemplateId)
      || selectedGroup.primary
      || null;
  }
  const preferredActive = groups.find((group) => (
    group.type === preferredType && group.active
  ))?.active;
  if (preferredActive) return preferredActive;
  const active = groups.find((group) => group.active)?.active;
  if (active) return active;
  return groups[0]?.primary || null;
}

export {
  STATUS_PRIORITY,
  compareVersions,
  filterPromptGroups,
  findPromptGroup,
  groupPromptTemplateSections,
  groupPromptTemplates,
  PROMPT_TYPE_CATALOG,
  PROMPT_WORKFLOW_GROUPS,
  promptLineageId,
  promptTypeMeta,
  promptWorkflowGroupMeta,
  resolvePromptSelection,
  selectPromptGroupPrimary,
};

export const promptTemplateGroupService = Object.freeze({
  filterPromptGroups,
  findPromptGroup,
  groupPromptTemplateSections,
  groupPromptTemplates,
  promptLineageId,
  promptTypeMeta,
  promptWorkflowGroupMeta,
  resolvePromptSelection,
  selectPromptGroupPrimary,
});
