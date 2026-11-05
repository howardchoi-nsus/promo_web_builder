import assert from "node:assert/strict";
import {
  OVERVIEW_INSTRUCTION_MAX_CHARACTERS,
  REFERENCE_ITEM_MAX_CHARACTERS,
  composeOverviewInstruction,
  referenceItemCharacterBudget,
  summarizeReferenceProposal,
} from "../visual-editor/src/builder/services/reference-overview-summary.mjs";

const proposal = {
  confidence: 0.91,
  reviewNotes: Array.from({ length: 10 }, (_, index) => `검토 메모 ${index + 1} ${"주의 ".repeat(50)}`),
  componentDefinition: {
    name: "Winter Giveaway Hero",
    description: `겨울 경품 프로모션 화면 ${"설명 ".repeat(200)}`,
    fields: Array.from({ length: 20 }, (_, index) => ({
      name: `필드 ${index + 1}`,
      fieldKind: index % 3 === 0 ? "cta" : "text",
      textType: index % 3 === 0 ? null : "body",
      defaultValue: `인식된 프로모션 문구 ${index + 1} ${"혜택 ".repeat(80)}`,
    })),
    renderSpec: { root: { children: Array.from({ length: 100 }, () => ({ style: "x".repeat(100) })) } },
  },
};

const summary = summarizeReferenceProposal({
  imageName: "winter-giveaway-mobile.png",
  viewport: "mobile",
  proposal,
});
assert.ok(summary.length <= REFERENCE_ITEM_MAX_CHARACTERS);
assert.match(summary, /winter-giveaway-mobile\.png/);
assert.match(summary, /Winter Giveaway Hero/);
assert.match(summary, /인식된 프로모션 문구/);
assert.doesNotMatch(summary, /renderSpec|style/);

const combined = composeOverviewInstruction("겨울 경품 이벤트를 만들어 주세요.", Array(10).fill(summary).join("\n"));
assert.ok(combined.length <= OVERVIEW_INSTRUCTION_MAX_CHARACTERS);
assert.match(combined, /^겨울 경품 이벤트를 만들어 주세요\./);
assert.match(combined, /참고 이미지 분석 결과/);

const tenImageSummary = Array.from({ length: 10 }, (_, index) => summarizeReferenceProposal({
  imageName: `reference-${index + 1}.png`,
  viewport: index % 2 ? "mobile" : "desktop",
  proposal,
  maxCharacters: referenceItemCharacterBudget(10),
})).join("\n");
const tenImageCombined = composeOverviewInstruction("여러 화면을 반영해 주세요.", tenImageSummary);
assert.ok(tenImageCombined.length <= OVERVIEW_INSTRUCTION_MAX_CHARACTERS);
assert.match(tenImageCombined, /reference-1\.png/);
assert.match(tenImageCombined, /reference-10\.png/);

const imageOnly = composeOverviewInstruction("", summary);
assert.match(imageOnly, /^첨부한 프로모션 이미지를 기준으로/);
assert.ok(imageOnly.length <= OVERVIEW_INSTRUCTION_MAX_CHARACTERS);

const longUserInstruction = composeOverviewInstruction("가".repeat(5000), summary);
assert.equal(longUserInstruction.length, OVERVIEW_INSTRUCTION_MAX_CHARACTERS);
assert.doesNotMatch(longUserInstruction, /참고 이미지 분석 결과/);

console.log("reference image overview summary tests passed");
