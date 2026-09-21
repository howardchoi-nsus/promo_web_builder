import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [app, preview, dialog] = await Promise.all([
  read("visual-editor/src/App.vue"),
  read("visual-editor/src/platform/editor-ui/PreviewPanel.vue"),
  read("visual-editor/src/platform/editor-ui/PublicationManagerDialog.vue"),
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

console.log("Publication manager contract tests passed.");
