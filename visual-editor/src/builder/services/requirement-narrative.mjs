// Display-only transformation: never asks an LLM to rewrite campaign facts.
function text(value) { return typeof value === 'string' ? value.trim() : ''; }
export function requirementNarrative(overview = {}) {
  const sentences = [];
  const purpose = text(overview.promotionPurpose === '기타' ? overview.promotionPurposeOther : overview.promotionPurpose);
  if (purpose) sentences.push(`프로모션 페이지의 목적은 ${purpose}입니다.`);
  const audience = text(overview.audience);
  if (audience) sentences.push(`대상은 ${audience}입니다.`);
  const offer = text(overview.mainOffer);
  if (offer) sentences.push(`핵심 혜택은 다음과 같습니다: ${offer}`);
  const tone = text(overview.campaignTone);
  if (tone) sentences.push(`${tone} 분위기로 제작합니다.`);
  const titles = (Array.isArray(overview.contentSections) ? overview.contentSections : [])
    .map(section => text(section?.title) || text(section?.label)).filter(Boolean);
  return { paragraphs: sentences, content: titles.length ? `예정된 콘텐츠는 ${titles.join(', ')} 순서로 구성할 예정입니다.` : '' };
}
