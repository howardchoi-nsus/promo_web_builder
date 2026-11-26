import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const editor=readFileSync(new URL('../visual-editor/src/builder/PageSchemaDocumentEditor.vue',import.meta.url),'utf8');
const html=readFileSync(new URL('../visual-editor/src/builder/services/page-editor-html.mjs',import.meta.url),'utf8');

assert.match(editor,/HTML 수정/);
assert.match(editor,/HTML 변경 적용/);
assert.match(editor,/applyEditorHtmlSource/);
assert.match(editor,/aria-label="페이지 HTML 소스"/);
assert.match(html,/script,style,iframe,object,embed,form,link,meta,base/);
assert.match(html,/인라인 스타일과 이벤트 속성/);
assert.match(html,/HTML 요소 구조와 data-page-node-id는 변경할 수 없습니다/);
assert.match(html,/승인된 원문은 HTML에서 변경할 수 없습니다/);
assert.match(html,/node\.contentMode==='editorial'/);
console.log('Page editor HTML source contract tests passed.');
