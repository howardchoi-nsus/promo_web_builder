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
        fields: [
          { fieldKey: "text", name: "Text", fieldKind: "text", textType: "title" },
          { fieldKey: "subtitle", name: "Subtitle", fieldKind: "text", textType: "remark" },
        ],
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
    sectionInputs: {
      sec_coooo123: {
        cmp_opaque123: { fields: {
          text: "겨울 시즌 스페셜 경품 이벤트",
          subtitle: "지금 참여하고 특별한 경품을 만나보세요.",
        } },
        item_opaque456: "이벤트 참여하기",
        item_opaque789: {
          source: "url",
          value: "https://example.com/hero.jpg",
          alt: "눈 내리는 겨울 경품 이미지",
        },
      },
    },
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
assert.deepEqual(contentResult[0].components[0].contentLines.map((line) => line.text), [
  "겨울 시즌 스페셜 경품 이벤트",
  "지금 참여하고 특별한 경품을 만나보세요.",
]);
assert.equal(contentResult[0].components[0].contentLines[1].label, "보조 제목");
assert.equal(contentResult[0].components[1].contentLines[0].text, "이벤트 참여하기");
assert.equal(contentResult[0].components[2].contentLines[0].text, "눈 내리는 겨울 경품 이미지");
assert.ok(!contentResult[0].components[2].contentLines[0].text.includes("https://"));

const longCopy = "긴 약관 문구 ".repeat(40).trim();
const longCopyResult = buildWireframeSections({
  content: {
    sectionSnapshot: [{
      sectionKey: "terms-section",
      sectionRole: "terms",
      items: [{ itemKey: "legal-copy", sourceItemKey: "legal", fieldKind: "text", textType: "multi" }],
    }],
    sectionInputs: { "terms-section": { "legal-copy": longCopy } },
  },
});
assert.equal(longCopyResult[0].components[0].contentLines[0].truncated, true);
assert.ok(longCopyResult[0].components[0].contentLines[0].text.endsWith("…"));
assert.equal(longCopyResult[0].components[0].contentLines[0].fullText, longCopy);

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
