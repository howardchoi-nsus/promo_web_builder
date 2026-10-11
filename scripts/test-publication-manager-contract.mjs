import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [app, preview, dialog, productionBundle] = await Promise.all([
  read("visual-editor/src/App.vue"),
  read("visual-editor/src/platform/editor-ui/PreviewPanel.vue"),
  read("visual-editor/src/platform/editor-ui/PublicationManagerDialog.vue"),
  read("prototype/visual-editor-assets/visual-editor.js"),
]);

assert.match(preview, /manage-publication/);
assert.match(preview, />게시 관리</);
assert.match(app, /openPublicationManager/);
assert.match(app, /PublicationManagerDialog/);
assert.match(dialog, /\/api\/promo-publications/);
assert.match(dialog, /현재 revision 게시/);
assert.match(dialog, /선택 revision 재게시/);
assert.match(dialog, /게시 중지/);
assert.match(dialog, /promo-publication-preview-token/);
assert.match(dialog, /Nuxt 미리보기/);
assert.match(dialog, /cacheInvalidation/);
assert.match(dialog, /runtimePublicUrlConfigured/);
assert.match(dialog, /게시 중인 항목은 초안 저장으로 상태를 변경할 수 없습니다/);
assert.match(productionBundle, /runtimePublicUrlConfigured/);
assert.match(productionBundle, /게시 중인 항목은 초안 저장으로 상태를 변경할 수 없습니다/);
assert.match(productionBundle, /Nuxt Runtime 공개 URL이 설정되지 않았습니다/);

console.log("Publication manager contract tests passed.");
