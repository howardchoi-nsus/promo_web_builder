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

const proposalResult = buildWireframeSections({
  compositionSpec: {
    sections: [{
      sectionKey: "hero",
      sectionRole: "hero",
      visible: true,
      repeat: 1,
      layoutKey: "hero-centered",
      resourceReferences: [],
      components: [{
        itemKey: "title",
        visible: true,
        repeat: 1,
        contentBindings: [{ fieldKey: "text", sourceOverviewPath: "title" }],
        contentItems: [{ repeatIndex: 0, fields: [{ fieldKey: "subtitle", value: "특별한 혜택을 확인하세요." }] }],
      }, {
        itemKey: "visual",
        visible: true,
        repeat: 1,
        contentBindings: [],
        contentItems: [],
      }],
    }, {
      sectionKey: "terms",
      sectionRole: "terms",
      visible: true,
      repeat: 1,
      layoutKey: "terms-default",
      resourceReferences: [{ resourceKey: "common-terms" }],
      components: [{
        itemKey: "legal",
        visible: true,
        repeat: 1,
        contentBindings: [],
        contentItems: [],
      }],
    }],
  },
}, { overview: { title: "겨울 경품 이벤트" } });

assert.deepEqual(proposalResult[0].components[0].contentLines.map((line) => line.text), [
  "겨울 경품 이벤트",
  "특별한 혜택을 확인하세요.",
]);
assert.equal(proposalResult[0].components[1].isImage, true);
assert.equal(proposalResult[0].components[1].contentLines.length, 0);
assert.equal(proposalResult[1].components[0].contentLines[0].text, "CMS에 등록된 고정 콘텐츠가 적용됩니다.");

const hiddenComponentResult = buildWireframeSections({
  content: {
    sectionSnapshot: [{
      sectionKey: "hero-section",
      sectionRole: "hero",
      items: [{ itemKey: "visible-title", sourceItemKey: "title", fieldKind: "text" }, {
        itemKey: "hidden-copy", sourceItemKey: "body", fieldKind: "text",
      }],
    }],
    sectionInputs: { "hero-section": { "visible-title": "노출 제목", "hidden-copy": "숨김 본문" } },
  },
  designSpec: {
    visibility: { items: { "hero-section.hidden-copy": false }, fields: {} },
  },
});
assert.deepEqual(hiddenComponentResult[0].components.map((component) => component.label), ["메인 제목"]);

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

const fidResult = buildWireframeSections({
  content: {
    sectionSnapshot: [{
      sectionKey: "sec_fidpreview1",
      sectionRole: "content",
      items: [{
        itemKey: "fid_01J9W7M3QK6R2T8V",
        fields: [{ fieldKey: "fid_copy123456", fieldKind: "text" }],
      }],
    }],
    sectionInputs: {
      sec_fidpreview1: {
        fid_01J9W7M3QK6R2T8V: { fields: { fid_copy123456: "노출할 실제 문구" } },
      },
    },
  },
});
assert.equal(fidResult[0].technicalLabel, "");
assert.equal(fidResult[0].components[0].technicalLabel, "");
assert.equal(fidResult[0].components[0].contentLines[0].label, "");
assert.equal(fidResult[0].components[0].contentLines[0].text, "노출할 실제 문구");

const complexFidResult = buildWireframeSections({
  content: {
    sectionSnapshot: [{
      sectionKey: "fid.section.hero",
      sourceSectionKey: "fid-section-hero",
      name: "FID: Hero Section",
      items: [{
        itemKey: "fid/hero/title",
        sourceItemKey: "fid-hero-title",
        name: "Field ID (Hero Title)",
        fields: [{
          fieldKey: "fid.hero.title.copy",
          name: "FID: title copy",
          fieldKind: "text",
        }, {
          fieldKey: "fid.hero.internal.value",
          name: "Field ID / internal value",
          fieldKind: "text",
        }],
      }],
    }],
    sectionInputs: {
      "fid.section.hero": {
        "fid/hero/title": { fields: {
          "fid.hero.title.copy": "실제로 노출할 제목",
          "fid.hero.internal.value": "fid_internal_placeholder_value",
        } },
      },
    },
  },
});
assert.equal(complexFidResult[0].label, "콘텐츠 섹션");
assert.equal(complexFidResult[0].technicalLabel, "");
assert.equal(complexFidResult[0].components[0].label, "콘텐츠 항목 1");
assert.equal(complexFidResult[0].components[0].technicalLabel, "");
assert.deepEqual(complexFidResult[0].components[0].contentLines.map((line) => line.text), ["실제로 노출할 제목"]);
assert.ok(complexFidResult[0].components[0].contentLines.every((line) => !/fid/i.test(line.label)));

const confirmationResult = buildWireframeSections({
  compositionSpec: {
    sections: [{
      sectionKey: "notice",
      sectionRole: "notice",
      components: [{
        itemKey: "notice",
        contentBindings: [{
          fieldKey: "text",
          sourceOverviewPath: "additionalInformation[0].value",
        }],
      }],
    }],
  },
}, {
  overview: {
    additionalInformation: [{
      label: "이벤트 기간",
      value: "사용자 확인 필요",
      confirmationRequired: true,
    }],
  },
});
assert.equal(confirmationResult[0].components[0].contentLines.length, 0);
assert.equal(confirmationResult[0].components[0].requiresConfirmation, true);

const confirmedCopyResult = buildWireframeSections({
  compositionSpec: {
    sections: [{
      sectionKey: "notice",
      components: [{
        itemKey: "notice",
        contentBindings: [{ fieldKey: "text", sourceOverviewPath: "notices.0.body" }],
      }],
    }],
  },
}, {
  overview: {
    notices: [{ body: "결제 완료 후 혜택이 지급됩니다.", confirmationRequired: true }],
  },
});
assert.equal(confirmedCopyResult[0].components[0].contentLines[0].text, "결제 완료 후 혜택이 지급됩니다.");
assert.equal(confirmedCopyResult[0].components[0].requiresConfirmation, true);

console.log("wireframe display tests passed");
