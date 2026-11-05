const SECTION_LABELS = {
  header: "헤더",
  navigation: "내비게이션",
  nav: "내비게이션",
  hero: "히어로",
  "key-visual": "메인 비주얼",
  intro: "프로모션 소개",
  overview: "프로모션 개요",
  benefit: "주요 혜택",
  benefits: "주요 혜택",
  feature: "주요 특징",
  features: "주요 특징",
  content: "콘텐츠",
  gallery: "이미지 갤러리",
  products: "상품 안내",
  product: "상품 안내",
  steps: "참여 방법",
  process: "진행 방법",
  cta: "참여 유도",
  action: "참여 유도",
  notice: "안내 사항",
  faq: "자주 묻는 질문",
  terms: "유의사항 및 약관",
  legal: "유의사항 및 약관",
  footer: "푸터",
};

const COMPONENT_LABELS = {
  title: "메인 제목",
  heading: "제목",
  headline: "메인 제목",
  "primary-title": "메인 제목",
  subtitle: "보조 제목",
  eyebrow: "상단 안내 문구",
  kicker: "상단 안내 문구",
  description: "설명 문구",
  summary: "요약 문구",
  body: "본문",
  text: "텍스트",
  copy: "본문 문구",
  "supporting-copy": "설명 문구",
  visual: "메인 이미지",
  image: "이미지",
  "hero-image": "메인 이미지",
  "key-visual": "메인 이미지",
  logo: "로고",
  badge: "배지",
  badges: "배지 목록",
  card: "콘텐츠 카드",
  cards: "콘텐츠 카드 목록",
  benefit: "혜택 항목",
  benefits: "혜택 목록",
  steps: "참여 단계",
  notice: "안내 문구",
  disclaimer: "유의사항",
  terms: "약관",
  legal: "약관 및 유의사항",
  faq: "질문과 답변",
  action: "버튼",
  cta: "참여 버튼",
  button: "버튼",
  "primary-action": "주요 참여 버튼",
  "secondary-action": "보조 버튼",
};

const LAYOUT_LABELS = {
  default: "기본 배치",
  centered: "중앙 정렬",
  center: "중앙 정렬",
  "hero-centered": "중앙 정렬",
  "centered-hero": "중앙 정렬",
  "split-left": "좌우 분할 · 왼쪽 중심",
  "split-right": "좌우 분할 · 오른쪽 중심",
  split: "좌우 분할",
  grid: "그리드 배치",
  list: "목록 배치",
  stack: "세로 배치",
  stacked: "세로 배치",
  carousel: "슬라이드 배치",
};

const FIELD_KIND_LABELS = {
  text: "텍스트",
  image: "이미지 영역",
  video: "동영상 영역",
  cta: "버튼",
  link: "링크",
  icon: "아이콘",
  collection: "반복 목록",
};

const TEXT_TYPE_LABELS = {
  title: "제목",
  heading: "제목",
  subtitle: "보조 제목",
  remark: "보조 문구",
  body: "본문",
  multi: "여러 줄 본문",
  label: "라벨",
};

const INTERNAL_KEY_PATTERN = /^(?:sec|item|cmp|component)_[a-z0-9_-]+$/i;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizedKey(value) {
  return String(value || "")
    .replace(/#\d+$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function isInternalKey(value) {
  const key = String(value || "").trim();
  return !key || INTERNAL_KEY_PATTERN.test(key) || UUID_PATTERN.test(key);
}

function readableFallback(value) {
  if (isInternalKey(value)) return "";
  return String(value)
    .replace(/#(\d+)$/, " $1")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveSectionLabel(section) {
  const roleKey = normalizedKey(section?.sectionRole);
  if (SECTION_LABELS[roleKey]) return SECTION_LABELS[roleKey];
  const sourceKey = normalizedKey(section?.sourceSectionKey || section?.sectionKey);
  if (SECTION_LABELS[sourceKey]) return SECTION_LABELS[sourceKey];
  return readableFallback(section?.name)
    || readableFallback(section?.sourceSectionKey)
    || "콘텐츠 섹션";
}

function resolveComponentLabel(item, index) {
  const candidates = [item?.sourceItemKey, item?.componentKey, item?.itemKey];
  for (const candidate of candidates) {
    const label = COMPONENT_LABELS[normalizedKey(candidate)];
    if (label) return label;
  }
  if (normalizedKey(item?.fieldKind) === "cta") return "참여 버튼";
  if (normalizedKey(item?.fieldKind) === "image") return "이미지";
  const textLabel = COMPONENT_LABELS[normalizedKey(item?.textType)];
  if (textLabel) return textLabel;
  return readableFallback(item?.name)
    || readableFallback(item?.sourceItemKey)
    || `콘텐츠 항목 ${index + 1}`;
}

function resolveComponentType(item) {
  const kind = FIELD_KIND_LABELS[normalizedKey(item?.fieldKind)];
  const textType = TEXT_TYPE_LABELS[normalizedKey(item?.textType)];
  if (kind === "텍스트" && textType) return `${kind} · ${textType}`;
  return kind || textType || "콘텐츠 영역";
}

function resolveLayoutLabel(layoutKey) {
  const key = normalizedKey(layoutKey);
  if (LAYOUT_LABELS[key]) return LAYOUT_LABELS[key];
  for (const [pattern, label] of Object.entries(LAYOUT_LABELS)) {
    if (key.includes(pattern)) return label;
  }
  return readableFallback(layoutKey) || "기본 배치";
}

function contentSections(snapshot) {
  const sections = snapshot?.content?.sectionSnapshot;
  if (!Array.isArray(sections) || sections.length === 0) return [];
  return sections.map((section, sectionIndex) => ({
    key: section.sectionKey || `section:${sectionIndex}`,
    order: sectionIndex + 1,
    label: resolveSectionLabel(section),
    technicalLabel: section.sourceSectionKey || section.sectionKey || "",
    roleLabel: SECTION_LABELS[normalizedKey(section.sectionRole)] || "콘텐츠 섹션",
    layoutLabel: resolveLayoutLabel(section.selectedLayoutKey || section.defaultLayoutKey),
    components: (section.items || []).map((item, itemIndex) => ({
      key: item.itemKey || `item:${itemIndex}`,
      order: itemIndex + 1,
      label: resolveComponentLabel(item, itemIndex),
      typeLabel: resolveComponentType(item),
      technicalLabel: item.sourceItemKey || item.itemKey || "",
    })),
  }));
}

function previewSections(snapshot) {
  const sections = snapshot?.preview?.sections;
  if (!Array.isArray(sections)) return [];
  let order = 0;
  return sections.flatMap((section) => Array.from(
    { length: Math.max(1, Number(section.repeat || 1)) },
    (_, sectionIndex) => {
      order += 1;
      let componentOrder = 0;
      const componentKeys = (section.componentKeys || []).flatMap((componentKey) => Array.from(
        { length: Math.max(1, Number(section.componentRepeats?.[componentKey] || 1)) },
        (_, componentIndex) => {
          componentOrder += 1;
          return {
            key: `${componentKey}:${componentIndex}`,
            order: componentOrder,
            label: resolveComponentLabel({ sourceItemKey: componentKey }, componentIndex),
            typeLabel: "콘텐츠 영역",
            technicalLabel: componentKey,
          };
        },
      ));
      return {
        key: `${section.sectionKey}:${sectionIndex}`,
        order,
        label: resolveSectionLabel({ ...section, sourceSectionKey: section.sectionKey }),
        technicalLabel: section.sectionKey,
        roleLabel: SECTION_LABELS[normalizedKey(section.sectionRole)] || "콘텐츠 섹션",
        layoutLabel: resolveLayoutLabel(section.layoutKey),
        components: componentKeys,
      };
    },
  ));
}

export function buildWireframeSections(snapshot) {
  const sections = contentSections(snapshot);
  return sections.length > 0 ? sections : previewSections(snapshot);
}

