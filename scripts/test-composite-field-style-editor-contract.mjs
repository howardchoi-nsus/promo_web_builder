import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const appSource = await readFile(new URL("../visual-editor/src/App.vue", import.meta.url), "utf8");
const rendererSource = await readFile(new URL("../visual-editor/src/PromoPageRenderer.vue", import.meta.url), "utf8");
const previewSource = await readFile(new URL("../visual-editor/src/platform/editor-ui/PreviewPanel.vue", import.meta.url), "utf8");
const popoverSource = await readFile(new URL("../visual-editor/src/platform/editor-ui/ComponentInspectorPopover.vue", import.meta.url), "utf8");

assert.match(appSource, /const selectedFieldStyleKey = computed/);
assert.match(appSource, /const selectedTargetStyleKey = computed\(\(\) => selectedFieldStyleKey\.value \|\| selectedStyleKey\.value\)/);
assert.match(appSource, /styleKey: selectedTargetStyleKey\.value/);
assert.match(appSource, /selectedFieldKey\.value = componentFields\(item\)\.some\(\(field\) => field\.fieldKey === fieldKey\) \? fieldKey : ""/);
assert.match(appSource, /selectItem\(section, item, \{ fieldKey: field\?\.fieldKey \|\| "" \}\)/);
assert.match(appSource, /<TextEditorControls[\s\S]*:show-layout-controls="!selectedField"/);
assert.match(appSource, /<TextEditorControls[\s\S]*@patch-style="patchSelectedTextStyle"/);

assert.match(rendererSource, /:data-field-style-key="`\$\{styleKey\(section, item\)\}\.\$\{field\.fieldKey\}`"/);
assert.match(rendererSource, /fieldStyleData\(section, item, field\)/);
assert.match(rendererSource, /fieldKey: field\.fieldKey/);
assert.match(rendererSource, /selectedFieldKey === `\$\{styleKey\(section, item\)\}\.\$\{field\.fieldKey\}`/);
assert.match(rendererSource, /const targetFieldKey = event\?\.fieldKey \? `\$\{key\}\.\$\{event\.fieldKey\}` : ""/);
assert.match(rendererSource, /props\.selectedFieldKey === targetFieldKey/);
assert.match(rendererSource, /event\.target\.closest\("\[data-field-style-key\]"\)/);

assert.match(previewSource, /\[data-field-style-key="\$\{escapedKey\}"\], \[data-style-key="\$\{escapedKey\}"\]/);
assert.match(popoverSource, /\[data-field-style-key="\$\{escapedKey\}"\], \[data-style-key="\$\{escapedKey\}"\]/);

console.log("composite field style editor contract tests passed");
