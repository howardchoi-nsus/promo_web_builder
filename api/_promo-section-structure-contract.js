const { createHash } = require("node:crypto");

function stableFingerprint(value) {
  const canonical = (input) => Array.isArray(input)
    ? input.map(canonical)
    : input && typeof input === "object"
      ? Object.keys(input).sort().reduce((result, key) => ({ ...result, [key]: canonical(input[key]) }), {})
      : input;
  return createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
}

function normalizeCandidates(candidates) {
  return (Array.isArray(candidates) ? candidates : []).filter((candidate) => (
    candidate && candidate.componentKey && candidate.componentVersionId
  )).map((candidate) => ({
    componentKey: String(candidate.componentKey),
    componentVersionId: String(candidate.componentVersionId),
    name: String(candidate.name || candidate.componentKey).slice(0, 120),
    description: String(candidate.description || "").slice(0, 500),
    fieldKind: String(candidate.fieldKind || "text"),
    maxInstances: Math.max(1, Math.min(6, Number(candidate.maxInstances || 1))),
  }));
}

function candidateScore(candidate, purpose) {
  const text = `${candidate.componentKey} ${candidate.name} ${candidate.description} ${candidate.fieldKind}`.toLowerCase();
  const request = String(purpose || "").toLowerCase();
  let score = 0;
  const groups = [
    [/(title|heading|headline|제목|타이틀)/, /(title|heading|headline)/, 12],
    [/(image|visual|이미지|비주얼|배너)/, /(image|visual|media)/, 10],
    [/(cta|button|action|참여|신청|버튼)/, /(cta|button|action)/, 10],
    [/(benefit|card|feature|혜택|카드|특징)/, /(benefit|card|feature)/, 9],
    [/(text|copy|description|설명|문구|내용)/, /(text|copy|description)/, 7],
  ];
  for (const [requestPattern, candidatePattern, weight] of groups) {
    if (requestPattern.test(request) && candidatePattern.test(text)) score += weight;
  }
  if (candidate.fieldKind === "text") score += 3;
  if (candidate.fieldKind === "cta" && /(참여|신청|버튼|cta|action)/.test(request)) score += 5;
  if (candidate.fieldKind === "image" && /(이미지|비주얼|image|visual)/.test(request)) score += 5;
  return score;
}

function createStructurePlan({ purpose, candidates }) {
  const normalized = normalizeCandidates(candidates);
  if (!normalized.length) {
    const error = new Error("활성 컴포넌트 후보가 없습니다.");
    error.code = "NO_ACTIVE_COMPONENT_CANDIDATES";
    error.statusCode = 422;
    throw error;
  }
  const ranked = normalized.map((candidate, index) => ({ candidate, index, score: candidateScore(candidate, purpose) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const selected = ranked.filter((entry) => entry.score > 0).slice(0, 5);
  const fallback = selected.length ? selected : ranked.slice(0, Math.min(3, ranked.length));
  const wantsMultipleCards = /(3|세 ?개|three).*(혜택|카드|benefit|card)|(혜택|카드|benefit|card).*(3|세 ?개|three)/i.test(purpose);
  return {
    sectionPurpose: String(purpose || "").trim().slice(0, 1200),
    componentSelections: fallback.map(({ candidate }, index) => ({
      componentKey: candidate.componentKey,
      componentVersionId: candidate.componentVersionId,
      instanceCount: wantsMultipleCards && /(card|benefit|feature|카드|혜택)/i.test(`${candidate.componentKey} ${candidate.name}`)
        ? Math.min(3, candidate.maxInstances) : 1,
      role: index === 0 ? "primary" : "supporting",
      name: candidate.name,
    })),
    layout: "auto-stack",
    rationale: "요청사항과 활성 컴포넌트 라이브러리의 역할·필드 유형을 기준으로 조합했습니다.",
  };
}

function validateStructurePlan({ plan, candidates }) {
  const normalized = normalizeCandidates(candidates);
  const byVersion = new Map(normalized.map((candidate) => [candidate.componentVersionId, candidate]));
  const selections = Array.isArray(plan?.componentSelections) ? plan.componentSelections : [];
  if (!selections.length) throw new Error("구성 제안에 컴포넌트가 없습니다.");
  return {
    ...plan,
    componentSelections: selections.map((selection) => {
      const candidate = byVersion.get(String(selection.componentVersionId || ""));
      if (!candidate || candidate.componentKey !== selection.componentKey) {
        const error = new Error("등록되지 않았거나 변경된 컴포넌트가 포함되어 있습니다.");
        error.code = "STRUCTURE_COMPONENT_NOT_ALLOWED";
        error.statusCode = 409;
        throw error;
      }
      return {
        componentKey: candidate.componentKey,
        componentVersionId: candidate.componentVersionId,
        instanceCount: Math.max(1, Math.min(candidate.maxInstances, Number(selection.instanceCount || 1))),
        role: String(selection.role || "supporting"),
        name: candidate.name,
      };
    }),
  };
}

module.exports = { stableFingerprint, normalizeCandidates, createStructurePlan, validateStructurePlan };
