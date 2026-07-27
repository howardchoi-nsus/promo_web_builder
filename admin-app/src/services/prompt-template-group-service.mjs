const STATUS_PRIORITY = Object.freeze({
  active: 0,
  validated: 1,
  draft: 2,
  inactive: 3,
  archived: 4,
});

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
    String(left.type || "").localeCompare(String(right.type || ""))
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
  groupPromptTemplates,
  promptLineageId,
  resolvePromptSelection,
  selectPromptGroupPrimary,
};

export const promptTemplateGroupService = Object.freeze({
  filterPromptGroups,
  findPromptGroup,
  groupPromptTemplates,
  promptLineageId,
  resolvePromptSelection,
  selectPromptGroupPrimary,
});
