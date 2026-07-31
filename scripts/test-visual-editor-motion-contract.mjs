import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createItemMotionBinding,
  createSectionMotionBinding,
  normalizeMotionSpec,
} from "../visual-editor/src/platform/editor-core/motion-spec.mjs";
import { createEditorStore } from "../visual-editor/src/platform/editor-core/create-editor-store.mjs";
import { EditorCommandType, editorCommand } from "../visual-editor/src/platform/editor-core/editor-commands.mjs";

const section = createSectionMotionBinding({
  presetVersionId: "motion-fade-up",
  trigger: "viewport-enter",
  durationToken: "600ms",
  delayToken: "100ms",
  childrenMode: "stagger",
  staggerToken: "160ms",
});
assert.equal(section.className, "motion-fade-up");
assert.equal(section.playMode, "once");
assert.equal(section.staggerToken, "160ms");
assert.deepEqual(createSectionMotionBinding({ presetVersionId: "invented-keyframe" }), {});
assert.deepEqual(createItemMotionBinding({ inherit: true }), { inherit: true });
assert.equal(createItemMotionBinding({ inherit: false, presetVersionId: "motion-scale-in", motionOrder: 1000 }).motionOrder, 99);

const normalized = normalizeMotionSpec({ sections: { hero: section }, items: { "hero.cta": { inherit: true } } });
assert.equal(normalized.contractVersion, 2);
assert.equal(normalized.sections.hero.presetVersionId, "motion-fade-up");
assert.deepEqual(normalized.items["hero.cta"], { inherit: true });

const store = createEditorStore({
  sections: [{ sectionKey: "hero", items: [{ itemKey: "cta" }] }],
  content: { hero: { cta: { label: "Join" } } },
  layout: { motionSpec: normalized },
});
assert.equal(store.execute(editorCommand(EditorCommandType.COMPONENT_INSTANCE_REMOVE, { sectionKey: "hero", itemKey: "cta" })).ok, true);
assert.equal(store.getState().document.layout.motionSpec.items["hero.cta"], undefined);
assert.equal(store.undo().state.document.layout.motionSpec.items["hero.cta"].inherit, true);

const root = path.dirname(fileURLToPath(import.meta.url));
const renderer = fs.readFileSync(path.join(root, "../visual-editor/src/PromoPageRenderer.vue"), "utf8");
const app = fs.readFileSync(path.join(root, "../visual-editor/src/App.vue"), "utf8");
assert.match(renderer, /IntersectionObserver/);
assert.match(renderer, /threshold: 0\.15/);
assert.match(renderer, /styleKey\(section, item\)/);
assert.match(app, /섹션 트랜지션 변경/);
assert.match(app, /컴포넌트 트랜지션 변경/);
assert.match(app, /motionReplayKey/);
console.log("Visual Editor motion contract tests passed.");
