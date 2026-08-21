const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const app = read("visual-editor", "src", "App.vue");
const controls = read("visual-editor", "src", "platform", "editor-ui", "EditorPreviewControls.vue");
const textEditorControls = read("visual-editor", "src", "platform", "editor-ui", "TextEditorControls.vue");
const structurePanel = read("visual-editor", "src", "platform", "editor-ui", "StructurePanel.vue");
const pageTree = read("visual-editor", "src", "platform", "editor-ui", "PageTree.vue");
const previewPanel = read("visual-editor", "src", "platform", "editor-ui", "PreviewPanel.vue");
const aiLayoutControls = read("visual-editor", "src", "platform", "editor-ui", "AiLayoutControls.vue");
const componentInspector = read("visual-editor", "src", "platform", "editor-ui", "ComponentInspectorPopover.vue");

assert.match(app, /import PreviewPanel/);
assert.match(app, /<PreviewPanel/);
assert.doesNotMatch(app, /<section class="preview-panel"/);
assert.match(app, /import PromoPageRenderer/);
assert.match(app, /mode === 'output'/);
assert.match(previewPanel, /import EditorPreviewControls/);
assert.match(previewPanel, /<EditorPreviewControls/);
assert.match(previewPanel, /#tokens/);
assert.match(previewPanel, /#host-actions/);
assert.match(previewPanel, /defineExpose\(\{ finishTextEdit, getStageElement, inspectCollisions, scrollToSection, updateSelectionRect \}\)/);
assert.match(previewPanel, /품질 확인/);
assert.match(previewPanel, /겹침 보정/);
assert.match(previewPanel, /inspectLayoutQuality/);
assert.match(app, /@layout-collision-reflow="applyLayoutCollisionReflow"/);
assert.doesNotMatch(previewPanel, /<TextEditorControls/);
assert.match(app, /<TextEditorControls/);
assert.match(textEditorControls, /text-history-controls/);
assert.match(textEditorControls, /emit\('undo'\)/);
assert.match(textEditorControls, /emit\('redo'\)/);
assert.match(controls, /update:guideMode/);
assert.match(controls, /guideMode/);
assert.match(controls, /Normal/);
assert.match(controls, /Selection/);
assert.match(controls, /Outline/);
assert.match(controls, /update:viewport/);
assert.match(controls, /class="viewport-control"/);
assert.match(app, /import StructurePanel/);
assert.match(app, /<StructurePanel/);
assert.doesNotMatch(app, /<aside class="section-rail"/);
assert.match(structurePanel, /<aside class="section-rail structure-panel"/);
assert.match(structurePanel, /import SectionProperties/);
assert.match(structurePanel, /emit\('select-section'/);
assert.match(structurePanel, /emit\('section-ai-action'/);
assert.match(structurePanel, /<PageTree/);
assert.match(pageTree, /role="tree"/);
assert.match(structurePanel, /#section-tools/);
assert.ok(
  pageTree.indexOf('<slot name="section-tools"') < pageTree.indexOf('v-for="item in section.items || []"'),
  "Section tools must render directly below the section header and above its component list",
);
assert.ok(
  pageTree.indexOf('v-for="item in section.items || []"') < pageTree.indexOf('<slot name="section-details"'),
  "Section properties must remain below the component list",
);
assert.match(app, /const expandedSectionKey = ref\(""\)/);
assert.match(app, /function toggleSectionExpansion/);
assert.match(pageTree, /class="page-tree__disclosure"/);
assert.match(pageTree, /fa-chevron-down/);
assert.doesNotMatch(pageTree, /컴포넌트 위로 이동/);
assert.doesNotMatch(pageTree, /컴포넌트 아래로 이동/);
assert.match(app, /import AiLayoutControls/);
assert.match(app, /<AiLayoutControls/);
assert.doesNotMatch(app, /<section v-if="capabilities\.canRunMultiLayoutAi" class="multi-layout-panel"/);
assert.match(aiLayoutControls, /class="multi-layout-panel"/);
assert.match(aiLayoutControls, /emit\('request-suggestion'/);
assert.match(aiLayoutControls, /emit\('apply-suggestion'/);
assert.match(app, /import ComponentInspectorPopover/);
assert.match(app, /<ComponentInspectorPopover/);
assert.doesNotMatch(app, /<aside class="property-panel"/);
assert.doesNotMatch(app, /<PropertyPanel/);
assert.match(componentInspector, /class="component-inspector-popover"/);
assert.match(componentInspector, /role="dialog"/);
assert.match(componentInspector, /event\.key !== "Escape"/);
assert.match(componentInspector, /event\.defaultPrevented/);
assert.match(previewPanel, /"selection-rect-change"/);
assert.match(previewPanel, /data-style-key/);
assert.match(previewPanel, /data-field-style-key/);

console.log("Editor UI component contract test passed");
