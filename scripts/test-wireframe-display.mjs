import assert from "node:assert/strict";
import { buildWireframeSections } from "../visual-editor/src/builder/services/wireframe-display.mjs";

const contentResult = buildWireframeSections({
  content: {
    sectionSnapshot: [{
      sectionKey: "sec_coooo123",
      sourceSectionKey: "hero",
      name: "Hero",
      sectionRole: "hero",
      selectedLayoutKey: "hero-centered",
      items: [{
        itemKey: "cmp_opaque123",
        sourceItemKey: "title",
        name: "Title",
        fieldKind: "text",
        textType: "title",
      }, {
        itemKey: "item_opaque456",
        sourceItemKey: "primaryAction",
        name: "Primary Action",
        fieldKind: "cta",
      }, {
        itemKey: "item_opaque789",
        fieldKind: "image",
      }],
    }],
  },
  preview: { sections: [{ sectionKey: "ignored-preview" }] },
});

assert.equal(contentResult[0].label, "히어로");
assert.equal(contentResult[0].layoutLabel, "중앙 정렬");
assert.equal(contentResult[0].technicalLabel, "hero");
assert.deepEqual(contentResult[0].components.map((item) => item.label), [
  "메인 제목", "주요 참여 버튼", "이미지",
]);
assert.equal(contentResult[0].components[0].typeLabel, "텍스트 · 제목");
assert.equal(contentResult[0].components[1].typeLabel, "버튼");

const previewResult = buildWireframeSections({
  preview: {
    sections: [{
      sectionKey: "terms",
      sectionRole: "terms",
      layoutKey: "terms-default",
      repeat: 1,
      componentKeys: ["legal"],
      componentRepeats: { legal: 1 },
    }],
  },
});

assert.equal(previewResult[0].label, "유의사항 및 약관");
assert.equal(previewResult[0].components[0].label, "약관 및 유의사항");

const opaqueResult = buildWireframeSections({
  content: {
    sectionSnapshot: [{
      sectionKey: "sec_opaque999",
      sectionRole: "unknown",
      items: [{ itemKey: "item_opaque999" }],
    }],
  },
});

assert.equal(opaqueResult[0].label, "콘텐츠 섹션");
assert.equal(opaqueResult[0].components[0].label, "콘텐츠 항목 1");
assert.ok(!opaqueResult[0].label.includes("sec_"));
assert.ok(!opaqueResult[0].components[0].label.includes("item_"));

console.log("wireframe display tests passed");
