export const OVERVIEW_INSTRUCTION_MAX_CHARACTERS = 4000;
export const REFERENCE_SUMMARY_MAX_CHARACTERS = 3200;
export const REFERENCE_ITEM_MAX_CHARACTERS = 900;

function compactText(value, maxLength = 300) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  if (maxLength <= 1) return normalized.slice(0, maxLength);
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function referenceItemCharacterBudget(itemCount = 1) {
  const count = Math.max(1, Math.min(10, Math.round(Number(itemCount) || 1)));
  return Math.min(
    REFERENCE_ITEM_MAX_CHARACTERS,
    Math.max(240, Math.floor((REFERENCE_SUMMARY_MAX_CHARACTERS - (count - 1)) / count)),
  );
}

export function summarizeReferenceProposal({
  imageName = "",
  viewport = "desktop",
  proposal = null,
  maxCharacters = REFERENCE_ITEM_MAX_CHARACTERS,
} = {}) {
  const component = proposal?.componentDefinition && typeof proposal.componentDefinition === "object"
    ? proposal.componentDefinition
    : {};
  const fields = (Array.isArray(component.fields) ? component.fields : []).slice(0, 12).map((field) => {
    const fieldName = compactText(field?.name || field?.fieldKey || "field", 60);
    const fieldType = [field?.fieldKind, field?.textType].filter(Boolean).join("/");
    const detectedContent = compactText(field?.defaultValue || field?.description || "", 140);
    return `${fieldName}${fieldType ? `(${fieldType})` : ""}${detectedContent ? `: ${detectedContent}` : ""}`;
  });
  const reviewNotes = (Array.isArray(proposal?.reviewNotes) ? proposal.reviewNotes : [])
    .slice(0, 4)
    .map((note) => compactText(note, 140))
    .filter(Boolean);
  const lines = [
    `[이미지: ${compactText(imageName || "붙여넣기 이미지", 100)} / ${viewport === "mobile" ? "Mobile" : "Desktop"}]`,
    component.name ? `화면 요소: ${compactText(component.name, 120)}` : "",
    component.description ? `구성 설명: ${compactText(component.description, 300)}` : "",
    fields.length ? `인식 콘텐츠: ${fields.join(" | ")}` : "",
    reviewNotes.length ? `확인 사항: ${reviewNotes.join(" | ")}` : "",
    proposal?.confidence != null ? `분석 신뢰도: ${Math.round(Number(proposal.confidence) * 100)}%` : "",
  ].filter(Boolean);
  return compactText(lines.join("\n"), Math.max(240, Math.min(REFERENCE_ITEM_MAX_CHARACTERS, Number(maxCharacters) || REFERENCE_ITEM_MAX_CHARACTERS)));
}

export function composeOverviewInstruction(input, referenceSummary = "") {
  const userInstruction = String(input || "").trim();
  const fallbackInstruction = "첨부한 프로모션 이미지를 기준으로 페이지를 구성해 주세요.";
  const baseInstruction = compactText(userInstruction || fallbackInstruction, OVERVIEW_INSTRUCTION_MAX_CHARACTERS);
  const summary = compactText(referenceSummary, REFERENCE_SUMMARY_MAX_CHARACTERS);
  if (!summary) return baseInstruction;

  const separator = "\n\n참고 이미지 분석 결과:\n";
  const available = OVERVIEW_INSTRUCTION_MAX_CHARACTERS - baseInstruction.length - separator.length;
  if (available <= 0) return baseInstruction;
  const boundedSummary = compactText(summary, available);
  return `${baseInstruction}${separator}${boundedSummary}`;
}
