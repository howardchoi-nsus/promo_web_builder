import assert from "node:assert/strict";
import {
  filterPromptGroups,
  findPromptGroup,
  groupPromptTemplates,
  resolvePromptSelection,
} from "../admin-app/src/services/prompt-template-group-service.mjs";

const prompts = [
  {
    id: "background-v15",
    lineageId: "background",
    type: "section_background_image",
    name: "Background draft",
    status: "draft",
    version: 15,
    updatedAt: "2026-07-27T03:00:00.000Z",
  },
  {
    id: "background-v14",
    lineageId: "background",
    type: "section_background_image",
    name: "Background active",
    status: "active",
    version: 14,
    updatedAt: "2026-07-26T03:00:00.000Z",
  },
  {
    id: "background-v13",
    lineageId: "background",
    type: "section_background_image",
    name: "Background old",
    status: "inactive",
    version: 13,
    updatedAt: "2026-07-25T03:00:00.000Z",
  },
  {
    id: "background-v12",
    lineageId: "background",
    type: "section_background_image",
    name: "Background archived",
    status: "archived",
    version: 12,
    updatedAt: "2026-07-24T03:00:00.000Z",
  },
  {
    id: "component-v3",
    lineageId: "component",
    type: "component_image",
    name: "Component validated",
    status: "validated",
    version: 3,
    updatedAt: "2026-07-27T04:00:00.000Z",
  },
  {
    id: "component-v2",
    lineageId: "component",
    type: "component_image",
    name: "Component old",
    status: "inactive",
    version: 2,
    updatedAt: "2026-07-26T04:00:00.000Z",
  },
  {
    id: "other-background-v1",
    lineageId: "other-background",
    type: "section_background_image",
    name: "Other background",
    status: "archived",
    version: 1,
    updatedAt: "2026-07-20T04:00:00.000Z",
  },
  {
    id: "legacy-v1",
    lineageId: null,
    type: "section_layout_planner",
    name: "Legacy",
    status: "inactive",
    version: 1,
    updatedAt: null,
  },
];

const groups = groupPromptTemplates(prompts);
assert.equal(groups.length, 4);

const background = findPromptGroup(groups, "background-v15");
assert.equal(background.primary.id, "background-v14", "active must remain the group primary");
assert.equal(background.draft.id, "background-v15");
assert.equal(background.archivedCount, 1);
assert.deepEqual(background.versions.map((prompt) => prompt.version), [15, 14, 13, 12]);

const component = findPromptGroup(groups, "component-v3");
assert.equal(component.primary.id, "component-v3");
assert.equal(component.active, null);
assert.equal(component.validated.id, "component-v3");

assert.equal(
  filterPromptGroups(groups, "section_background_image").length,
  2,
  "same type with different lineages must remain separate groups",
);
assert.equal(resolvePromptSelection(groups, "background-v15").id, "background-v15");
assert.equal(resolvePromptSelection(groups, "missing", "section_background_image").id, "background-v14");
assert.match(findPromptGroup(groups, "legacy-v1").lineageId, /^legacy:section_layout_planner:legacy-v1$/);

const immutableInput = Object.freeze([...prompts]);
assert.doesNotThrow(() => groupPromptTemplates(immutableInput));
assert.deepEqual(groupPromptTemplates([]), []);

console.log("Prompt template grouping tests passed");
