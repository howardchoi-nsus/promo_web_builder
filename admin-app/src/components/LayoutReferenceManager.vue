<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { upload } from "@vercel/blob/client";
import { layoutReferenceService } from "../services/layout-reference-service.mjs";

const emit = defineEmits(["status"]);
const SCORE_FIELDS = [
  ["hierarchy", "시각적 위계"],
  ["composition", "구성 완성도"],
  ["originality", "차별성"],
  ["responsiveness", "반응형 품질"],
  ["reusability", "재사용성"],
];
const STATUS_LABELS = { draft: "초안", review: "검토중", approved: "승인", archived: "보관" };

const references = ref([]);
const histories = ref([]);
const loading = ref(false);
const saving = ref(false);
const analyzing = ref(false);
const uploading = ref(false);
const error = ref("");
const selectedId = ref("");
const search = ref("");
const statusFilter = ref("");
const sectionFilter = ref("");

const blankEditor = () => ({
  title: "",
  sourceSite: "",
  sourceUrl: "",
  previewImageUrl: "",
  status: "draft",
  pageType: "promotion-landing",
  industry: "",
  promotionGoal: "",
  viewport: "responsive",
  visualStylesText: "",
  sectionTypesText: "hero",
  tagsText: "",
  designSummary: "",
  strengths: "",
  risks: "",
  layoutSpecText: JSON.stringify({
    layoutFamily: "",
    primitives: [],
    desktop: {},
    mobile: {},
  }, null, 2),
  qualityScores: {
    hierarchy: 0,
    composition: 0,
    originality: 0,
    responsiveness: 0,
    reusability: 0,
  },
  copyrightReviewed: false,
  capturedAt: "",
  adminNotes: "",
  analysisMeta: {},
  changeNote: "",
});
const editor = reactive(blankEditor());

const selected = computed(() => references.value.find((item) => item.id === selectedId.value) || null);
const allSectionTypes = computed(() => Array.from(new Set(
  references.value.flatMap((item) => item.sectionTypes || []),
)).sort((left, right) => left.localeCompare(right, "ko")));
const filteredReferences = computed(() => {
  const query = search.value.trim().toLowerCase();
  return references.value.filter((item) => {
    if (statusFilter.value && item.status !== statusFilter.value) return false;
    if (sectionFilter.value && !(item.sectionTypes || []).includes(sectionFilter.value)) return false;
    if (!query) return true;
    return [
      item.title, item.sourceSite, item.sourceUrl, item.pageType, item.industry,
      item.promotionGoal, ...(item.visualStyles || []), ...(item.tags || []),
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });
});
const counts = computed(() => ({
  total: references.value.length,
  review: references.value.filter((item) => item.status === "review").length,
  approved: references.value.filter((item) => item.status === "approved").length,
  highQuality: references.value.filter((item) => Number(item.qualityScore || 0) >= 4).length,
  plannerReady: references.value.filter((item) => item.plannerReadiness?.ready).length,
}));
const selectedHistories = computed(() => histories.value.filter((item) => item.layoutReferenceId === selectedId.value));
const averageScore = computed(() => {
  const scores = SCORE_FIELDS.map(([key]) => Number(editor.qualityScores[key] || 0));
  return Math.round((scores.reduce((sum, value) => sum + value, 0) / scores.length) * 100) / 100;
});
const approvalChecklist = computed(() => [
  { label: "출처 URL", passed: Boolean(editor.sourceUrl.trim()) },
  { label: "섹션 유형", passed: splitList(editor.sectionTypesText).length > 0 },
  { label: "디자인 분석", passed: Boolean(editor.designSummary.trim()) },
  { label: "Layout Spec", passed: (() => {
    try { return Object.keys(JSON.parse(editor.layoutSpecText || "{}") || {}).length > 0; } catch { return false; }
  })() },
  { label: "품질점수 4.0 이상", passed: averageScore.value >= 4 },
  { label: "5개 평가항목 입력", passed: SCORE_FIELDS.every(([key]) => Number(editor.qualityScores[key] || 0) > 0) },
  { label: "권리·출처 확인", passed: editor.copyrightReviewed },
]);
const canApprove = computed(() => approvalChecklist.value.every((item) => item.passed));

function splitList(value) {
  return Array.from(new Set(String(value || "").split(",").map((item) => item.trim()).filter(Boolean)));
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

function hostnameFor(value) {
  try { return new URL(String(value || "")).hostname; } catch { return "출처 미확인"; }
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).format(date);
}

function localDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function resetEditor() {
  selectedId.value = "";
  Object.assign(editor, blankEditor());
  error.value = "";
}

function selectReference(reference) {
  selectedId.value = reference.id;
  Object.assign(editor, {
    title: reference.title || "",
    sourceSite: reference.sourceSite || "",
    sourceUrl: reference.sourceUrl || "",
    previewImageUrl: reference.previewImageUrl || "",
    status: reference.status || "draft",
    pageType: reference.pageType || "",
    industry: reference.industry || "",
    promotionGoal: reference.promotionGoal || "",
    viewport: reference.viewport || "responsive",
    visualStylesText: (reference.visualStyles || []).join(", "),
    sectionTypesText: (reference.sectionTypes || []).join(", "),
    tagsText: (reference.tags || []).join(", "),
    designSummary: reference.designSummary || "",
    strengths: reference.strengths || "",
    risks: reference.risks || "",
    layoutSpecText: JSON.stringify(reference.layoutSpec || {}, null, 2),
    qualityScores: Object.fromEntries(SCORE_FIELDS.map(([key]) => [key, Number(reference.qualityScores?.[key] || 0)])),
    copyrightReviewed: Boolean(reference.copyrightReviewed),
    capturedAt: localDateTime(reference.capturedAt),
    adminNotes: "",
    analysisMeta: reference.analysisMeta || {},
    changeNote: "",
  });
  error.value = "";
}

function payload(status = editor.status) {
  let layoutSpec;
  try { layoutSpec = JSON.parse(editor.layoutSpecText || "{}"); } catch {
    throw new Error("Layout Spec을 올바른 JSON 객체로 입력해 주세요.");
  }
  if (!layoutSpec || typeof layoutSpec !== "object" || Array.isArray(layoutSpec)) {
    throw new Error("Layout Spec은 JSON 객체여야 합니다.");
  }
  return {
    title: editor.title.trim(),
    sourceSite: editor.sourceSite.trim(),
    sourceUrl: editor.sourceUrl.trim(),
    previewImageUrl: editor.previewImageUrl.trim(),
    status,
    pageType: editor.pageType.trim(),
    industry: editor.industry.trim(),
    promotionGoal: editor.promotionGoal.trim(),
    viewport: editor.viewport,
    visualStyles: splitList(editor.visualStylesText),
    sectionTypes: splitList(editor.sectionTypesText),
    tags: splitList(editor.tagsText),
    designSummary: editor.designSummary.trim(),
    strengths: editor.strengths.trim(),
    risks: editor.risks.trim(),
    layoutSpec,
    qualityScores: Object.fromEntries(SCORE_FIELDS.map(([key]) => [key, Number(editor.qualityScores[key] || 0)])),
    copyrightReviewed: editor.copyrightReviewed,
    capturedAt: editor.capturedAt ? new Date(editor.capturedAt).toISOString() : null,
    analysisMeta: editor.analysisMeta,
    changeNote: editor.changeNote.trim(),
  };
}

async function uploadReferenceImage(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    error.value = "PNG, JPEG 또는 WebP 이미지를 선택해 주세요.";
    event.target.value = "";
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    error.value = "레퍼런스 이미지는 10MB 이하여야 합니다.";
    event.target.value = "";
    return;
  }
  uploading.value = true;
  error.value = "";
  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120) || "reference-image";
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const blob = await upload(`layout-reference-uploads/${id}-${safeName}`, file, {
      access: "public",
      handleUploadUrl: "/api/layout-reference-image-upload",
    });
    editor.previewImageUrl = blob.url;
    if (!editor.capturedAt) editor.capturedAt = localDateTime(new Date().toISOString());
    emit("status", "레퍼런스 이미지를 업로드했습니다. AI 자동 분석을 실행할 수 있습니다.");
  } catch (uploadError) {
    error.value = uploadError.message || "레퍼런스 이미지 업로드에 실패했습니다.";
  } finally {
    uploading.value = false;
    event.target.value = "";
  }
}

async function analyzeReference() {
  if (!editor.sourceUrl.trim() || !editor.previewImageUrl.trim()) {
    error.value = "AI 분석에는 출처 URL과 공개 HTTPS 미리보기 이미지 URL이 필요합니다.";
    return;
  }
  analyzing.value = true;
  error.value = "";
  try {
    const result = await layoutReferenceService.analyze({
      title: editor.title.trim(),
      sourceSite: editor.sourceSite.trim(),
      sourceUrl: editor.sourceUrl.trim(),
      previewImageUrl: editor.previewImageUrl.trim(),
      pageType: editor.pageType.trim(),
      industry: editor.industry.trim(),
      promotionGoal: editor.promotionGoal.trim(),
      viewport: editor.viewport,
      adminNotes: editor.adminNotes.trim(),
    });
    const analysis = result.analysis || {};
    Object.assign(editor, {
      title: analysis.title || editor.title,
      sourceSite: analysis.sourceSite || editor.sourceSite,
      pageType: analysis.pageType || editor.pageType,
      industry: analysis.industry || editor.industry,
      promotionGoal: analysis.promotionGoal || editor.promotionGoal,
      viewport: analysis.viewport || editor.viewport,
      visualStylesText: (analysis.visualStyles || []).join(", "),
      sectionTypesText: (analysis.sectionTypes || []).join(", "),
      tagsText: (analysis.tags || []).join(", "),
      designSummary: analysis.designSummary || "",
      strengths: analysis.strengths || "",
      risks: [analysis.risks || "", ...(analysis.warnings || []).map((warning) => `- ${warning}`)].filter(Boolean).join("\n"),
      layoutSpecText: JSON.stringify(analysis.layoutSpec || {}, null, 2),
      qualityScores: Object.fromEntries(SCORE_FIELDS.map(([key]) => [key, Number(analysis.qualityScores?.[key] || 0)])),
      analysisMeta: {
        analyzedAt: result.analyzedAt || new Date().toISOString(),
        confidence: Number(analysis.confidence || 0),
        warnings: analysis.warnings || [],
        prompt: result.prompt || {},
        provider: result.provider || {},
        executionDisplay: result.executionDisplay || null,
        usage: result.usage || {},
      },
      status: editor.status === "approved" ? "review" : editor.status,
      changeNote: "AI 레이아웃 레퍼런스 분석 초안 적용",
    });
    emit("status", "AI 분석 초안을 적용했습니다. 내용을 검토한 뒤 저장해 주세요.");
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    analyzing.value = false;
  }
}

async function reload(preferredId = selectedId.value) {
  loading.value = true;
  error.value = "";
  try {
    const result = await layoutReferenceService.list();
    references.value = result.references || [];
    histories.value = result.histories || [];
    const preferred = references.value.find((item) => item.id === preferredId);
    if (preferred) selectReference(preferred);
    else if (references.value.length && !selectedId.value) selectReference(references.value[0]);
    else if (!references.value.length) resetEditor();
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    loading.value = false;
  }
}

async function save(status = editor.status) {
  saving.value = true;
  error.value = "";
  try {
    if (!editor.title.trim() || !editor.sourceUrl.trim()) throw new Error("레퍼런스명과 출처 URL을 입력해 주세요.");
    const isNew = !selected.value;
    const result = isNew
      ? await layoutReferenceService.create(payload("draft"))
      : await layoutReferenceService.update(selected.value.id, payload(status));
    await reload(result.reference.id);
    emit("status", isNew ? "레이아웃 레퍼런스 초안을 등록했습니다." : "레이아웃 레퍼런스를 저장했습니다.");
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    saving.value = false;
  }
}

async function changeStatus(status) {
  if (!selected.value) return;
  if (status === "approved" && !canApprove.value) {
    error.value = "승인 조건을 모두 충족해야 LLM 검색 후보로 사용할 수 있습니다.";
    return;
  }
  editor.status = status;
  if (!editor.changeNote.trim()) editor.changeNote = `${statusLabel(status)} 상태로 변경`;
  await save(status);
}

onMounted(() => reload());
</script>

<template>
  <section class="reference-library" aria-labelledby="reference-library-title">
    <header class="reference-library__header">
      <div>
        <span class="reference-library__eyebrow">Design Research Library</span>
        <h2 id="reference-library-title">레이아웃 레퍼런스</h2>
        <p>우수 웹사이트의 출처와 디자인 원리를 조사해 저장합니다. 승인 자료만 향후 LLM 레이아웃 검색 후보로 사용합니다.</p>
      </div>
      <div class="reference-library__actions">
        <button class="tiny-button" type="button" :disabled="loading" @click="reload()">새로고침</button>
        <button class="tiny-button primary" type="button" @click="resetEditor">신규 레퍼런스</button>
      </div>
    </header>

    <div class="reference-library__notice">
      <strong>Research only</strong>
      <span>원본 코드·카피·이미지를 복제하지 않고, 추상화된 Layout Primitive와 품질 평가만 저장합니다.</span>
    </div>

    <div class="reference-library__summary" aria-label="레이아웃 레퍼런스 현황">
      <div><strong>{{ counts.total }}</strong><span>전체</span></div>
      <div><strong>{{ counts.review }}</strong><span>검토중</span></div>
      <div><strong>{{ counts.approved }}</strong><span>LLM 사용 승인</span></div>
      <div><strong>{{ counts.highQuality }}</strong><span>품질 4.0 이상</span></div>
      <div><strong>{{ counts.plannerReady }}</strong><span>Planner 사용 가능</span></div>
    </div>

    <div v-if="error" class="outline-item danger-state" role="alert">
      <strong>레이아웃 레퍼런스 오류</strong><span>{{ error }}</span>
    </div>

    <div class="reference-library__workspace">
      <aside class="reference-library__list">
        <div class="reference-library__filters">
          <input v-model="search" type="search" aria-label="레이아웃 레퍼런스 검색" placeholder="사이트·스타일·목적 검색" />
          <select v-model="statusFilter" aria-label="레퍼런스 상태 필터">
            <option value="">전체 상태</option>
            <option value="draft">초안</option><option value="review">검토중</option>
            <option value="approved">승인</option><option value="archived">보관</option>
          </select>
          <select v-model="sectionFilter" aria-label="섹션 유형 필터">
            <option value="">전체 섹션</option>
            <option v-for="sectionType in allSectionTypes" :key="sectionType" :value="sectionType">{{ sectionType }}</option>
          </select>
        </div>
        <div class="reference-library__rows" aria-live="polite">
          <button
            v-for="reference in filteredReferences"
            :key="reference.id"
            class="reference-library__row"
            :class="{ selected: selectedId === reference.id }"
            type="button"
            @click="selectReference(reference)"
          >
            <span class="reference-library__thumb" :class="{ empty: !reference.previewImageUrl }">
              <img v-if="reference.previewImageUrl" :src="reference.previewImageUrl" alt="" loading="lazy" referrerpolicy="no-referrer" />
              <span v-else aria-hidden="true">REF</span>
            </span>
            <span class="reference-library__row-copy">
              <strong>{{ reference.title }}</strong>
              <small>{{ reference.sourceSite || hostnameFor(reference.sourceUrl) }}</small>
              <span><em v-for="type in reference.sectionTypes.slice(0, 2)" :key="type">{{ type }}</em></span>
            </span>
            <span class="reference-library__row-meta">
              <b>{{ Number(reference.qualityScore || 0).toFixed(1) }}</b>
              <em :class="`is-${reference.status}`">{{ statusLabel(reference.status) }}</em>
              <em :class="reference.plannerReadiness?.ready ? 'is-ready' : 'is-blocked'">
                {{ reference.plannerReadiness?.ready ? '사용 가능' : '차단' }}
              </em>
            </span>
          </button>
          <p v-if="!loading && !filteredReferences.length" class="reference-library__empty">조건에 맞는 레퍼런스가 없습니다.</p>
        </div>
      </aside>

      <form class="reference-library__editor" @submit.prevent="save()">
        <div class="reference-library__editor-heading">
          <div>
            <strong>{{ selected ? selected.title : '신규 레이아웃 레퍼런스' }}</strong>
            <span>{{ selected ? `최근 수정 ${formatDate(selected.updatedAt)}` : '출처와 분석 결과를 입력해 주세요.' }}</span>
          </div>
          <span v-if="selected" class="reference-library__status" :class="`is-${editor.status}`">{{ statusLabel(editor.status) }}</span>
        </div>

        <fieldset :disabled="saving || analyzing" class="reference-library__fields">
          <section>
            <h3>1. 조사 출처</h3>
            <div class="reference-library__grid">
              <label><span>레퍼런스명 *</span><input v-model="editor.title" type="text" maxlength="200" autocomplete="off" /></label>
              <label><span>사이트명</span><input v-model="editor.sourceSite" type="text" maxlength="160" autocomplete="off" /></label>
              <label class="wide"><span>출처 URL *</span><input v-model="editor.sourceUrl" type="url" placeholder="https://example.com/campaign" autocomplete="off" /></label>
              <label class="wide"><span>미리보기 이미지 URL</span><input v-model="editor.previewImageUrl" type="url" placeholder="HTTPS 이미지 URL" autocomplete="off" /></label>
              <label class="wide reference-library__upload">
                <span>스크린샷 업로드 <small>PNG, JPEG, WebP · 최대 10MB</small></span>
                <input type="file" accept=".png,.jpg,.jpeg,.webp" :disabled="uploading" @change="uploadReferenceImage" />
                <em>{{ uploading ? '업로드 중…' : editor.previewImageUrl ? '업로드 또는 URL 준비됨' : '분석할 화면을 선택해 주세요.' }}</em>
              </label>
              <label class="wide"><span>AI 분석 참고사항</span><textarea v-model="editor.adminNotes" rows="3" placeholder="관찰할 영역, 캠페인 유형 또는 제외할 요소를 입력해 주세요."></textarea></label>
              <label><span>수집 화면</span><select v-model="editor.viewport"><option value="responsive">Desktop + Mobile</option><option value="desktop">Desktop</option><option value="mobile">Mobile</option></select></label>
              <label><span>조사 일시</span><input v-model="editor.capturedAt" type="datetime-local" /></label>
            </div>
            <div class="reference-library__analysis-action">
              <div>
                <strong>스크린샷 AI 분석</strong>
                <span>원본 자산을 복제하지 않고 구성 원리와 Layout Spec 초안만 생성합니다.</span>
              </div>
              <button class="tiny-button primary" type="button" :disabled="analyzing || uploading || !editor.sourceUrl || !editor.previewImageUrl" @click="analyzeReference">
                {{ analyzing ? '분석 중…' : 'AI 자동 분석' }}
              </button>
            </div>
            <div v-if="editor.analysisMeta?.analyzedAt" class="reference-library__analysis-meta">
              <span>최근 분석 {{ formatDate(editor.analysisMeta.analyzedAt) }}</span>
              <span>신뢰도 {{ Math.round(Number(editor.analysisMeta.confidence || 0) * 100) }}%</span>
              <span v-if="editor.analysisMeta.executionDisplay">{{ editor.analysisMeta.executionDisplay.providerLabel }} · {{ editor.analysisMeta.executionDisplay.modelLabel }}</span>
            </div>
          </section>

          <section>
            <h3>2. 검색 분류</h3>
            <div class="reference-library__grid">
              <label><span>페이지 유형</span><input v-model="editor.pageType" type="text" placeholder="promotion-landing" /></label>
              <label><span>산업</span><input v-model="editor.industry" type="text" placeholder="gaming, retail" /></label>
              <label class="wide"><span>전환 목표</span><input v-model="editor.promotionGoal" type="text" placeholder="이벤트 참여, 구매 전환" /></label>
              <label class="wide"><span>섹션 유형 * <small>쉼표로 구분</small></span><input v-model="editor.sectionTypesText" type="text" placeholder="hero, benefits, offer" /></label>
              <label class="wide"><span>시각 스타일 <small>쉼표로 구분</small></span><input v-model="editor.visualStylesText" type="text" placeholder="cinematic, dark, immersive" /></label>
              <label class="wide"><span>검색 태그 <small>쉼표로 구분</small></span><input v-model="editor.tagsText" type="text" placeholder="full-bleed, layered-media, high-contrast" /></label>
            </div>
          </section>

          <section>
            <h3>3. 디자인 원리 분석</h3>
            <label><span>디자인 요약 *</span><textarea v-model="editor.designSummary" rows="4" placeholder="시각적 위계, 섹션 흐름, 이미지·CTA 전략을 설명합니다."></textarea></label>
            <div class="reference-library__grid">
              <label><span>강점</span><textarea v-model="editor.strengths" rows="4" placeholder="재사용할 가치가 있는 디자인 원리"></textarea></label>
              <label><span>위험·제약</span><textarea v-model="editor.risks" rows="4" placeholder="모방 위험, 접근성, 모바일 제약"></textarea></label>
            </div>
            <label><span>추상화 Layout Spec *</span><textarea v-model="editor.layoutSpecText" class="reference-library__code" rows="12" spellcheck="false"></textarea></label>
          </section>

          <section>
            <div class="reference-library__score-heading"><h3>4. 품질 평가</h3><strong>{{ averageScore.toFixed(1) }} / 5.0</strong></div>
            <div class="reference-library__scores">
              <label v-for="([key, label]) in SCORE_FIELDS" :key="key">
                <span>{{ label }}</span>
                <select v-model.number="editor.qualityScores[key]">
                  <option :value="0">미평가</option><option :value="1">1 · 부족</option><option :value="2">2</option>
                  <option :value="3">3 · 보통</option><option :value="4">4 · 우수</option><option :value="5">5 · 탁월</option>
                </select>
              </label>
            </div>
            <label class="reference-library__check">
              <input v-model="editor.copyrightReviewed" type="checkbox" />
              <span><strong>출처와 사용 범위를 확인했습니다.</strong> 원본 코드·카피·이미지를 저장하거나 복제하지 않고 디자인 원리만 연구 목적으로 사용합니다.</span>
            </label>
          </section>

          <section class="reference-library__approval">
            <div>
              <h3>5. LLM 검색 후보 승인</h3>
              <p>모든 조건을 통과한 승인 자료만 생성 워크플로우에서 검색할 수 있습니다.</p>
            </div>
            <ul>
              <li v-for="item in approvalChecklist" :key="item.label" :class="{ passed: item.passed }">
                <span>{{ item.passed ? '✓' : '–' }}</span>{{ item.label }}
              </li>
            </ul>
            <div v-if="selected?.plannerReadiness" class="reference-library__readiness" :class="{ ready: selected.plannerReadiness.ready }">
              <strong>{{ selected.plannerReadiness.ready ? 'Planner 사용 가능' : 'Planner 사용 차단' }}</strong>
              <span v-if="selected.plannerReadiness.ready">현재 저장 상태가 모든 검색 조건을 충족합니다.</span>
              <ul v-else>
                <li v-for="blocker in selected.plannerReadiness.blockers" :key="blocker.code">
                  <code>{{ blocker.code }}</code>{{ blocker.message }}
                </li>
              </ul>
            </div>
          </section>

          <label><span>레퍼런스 변경 사유</span><input v-model="editor.changeNote" type="text" maxlength="1000" placeholder="레퍼런스 등록·수정·승인 사유" /></label>
        </fieldset>

        <div class="reference-library__footer">
          <a v-if="editor.sourceUrl" class="tiny-button" :href="editor.sourceUrl" target="_blank" rel="noopener noreferrer">원본 사이트 열기</a>
          <span class="reference-library__footer-spacer"></span>
          <button v-if="selected && editor.status !== 'archived'" class="tiny-button" type="button" :disabled="saving || analyzing" @click="changeStatus('archived')">보관</button>
          <button v-if="selected && editor.status === 'draft'" class="tiny-button" type="button" :disabled="saving || analyzing" @click="changeStatus('review')">검토 요청</button>
          <button v-if="selected && editor.status !== 'approved' && editor.status !== 'archived'" class="tiny-button primary" type="button" :disabled="saving || analyzing || !canApprove" @click="changeStatus('approved')">LLM 사용 승인</button>
          <button class="tiny-button primary" type="submit" :disabled="saving">{{ saving ? '저장 중…' : selected ? '변경 저장' : '초안 등록' }}</button>
        </div>

        <details v-if="selected" class="reference-library__history">
          <summary>변경 이력 {{ selectedHistories.length }}건</summary>
          <ol>
            <li v-for="history in selectedHistories" :key="history.id">
              <strong>{{ history.action === 'created' ? '등록' : history.action === 'status_changed' ? '상태 변경' : '수정' }}</strong>
              <span>{{ history.previousStatus ? `${statusLabel(history.previousStatus)} → ` : '' }}{{ statusLabel(history.newStatus) }}</span>
              <small>{{ history.changedBy }} · {{ formatDate(history.changedAt) }} · {{ history.changeNote || '사유 없음' }}</small>
            </li>
          </ol>
        </details>
      </form>
    </div>
  </section>
</template>

<style scoped>
.reference-library { display: grid; gap: 16px; color: var(--app-ink); }
.reference-library__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.reference-library__header h2 { margin: 4px 0 6px; }
.reference-library__header p { max-width: 780px; margin: 0; color: var(--app-sub); }
.reference-library__eyebrow { color: var(--app-accent); font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.reference-library__actions, .reference-library__footer { display: flex; align-items: center; gap: 8px; }
.reference-library__notice { display: flex; gap: 10px; padding: 12px 14px; border: 1px solid color-mix(in srgb, #b47800 35%, var(--app-line)); border-radius: 10px; background: color-mix(in srgb, #f2b632 10%, var(--app-surface)); font-size: 12px; }
.reference-library__notice span { color: var(--app-sub); }
.reference-library__summary { display: grid; grid-template-columns: repeat(5, minmax(120px, 1fr)); gap: 10px; }
.reference-library__summary div { display: grid; gap: 2px; padding: 14px; border: 1px solid var(--app-line); border-radius: 10px; background: var(--app-panel-subtle, #f7f7f7); }
.reference-library__summary strong { font-size: 22px; }
.reference-library__summary span { color: var(--app-sub); font-size: 12px; }
.reference-library__workspace { display: grid; grid-template-columns: minmax(300px, 34%) minmax(0, 1fr); gap: 14px; align-items: start; }
.reference-library__list, .reference-library__editor { min-width: 0; padding: 14px; border: 1px solid var(--app-line); border-radius: 10px; background: var(--app-surface); }
.reference-library__list { position: sticky; top: 12px; }
.reference-library__filters { display: grid; grid-template-columns: 1fr 110px 120px; gap: 6px; margin-bottom: 10px; }
.reference-library input, .reference-library select, .reference-library textarea { box-sizing: border-box; width: 100%; min-height: 38px; padding: 8px 10px; border: 1px solid var(--app-line); border-radius: 7px; background: var(--app-surface); color: var(--app-ink); font: inherit; }
.reference-library textarea { resize: vertical; line-height: 1.55; }
.reference-library__rows { display: grid; gap: 7px; max-height: 760px; overflow: auto; }
.reference-library__row { display: grid; grid-template-columns: 62px minmax(0, 1fr) auto; gap: 10px; align-items: center; width: 100%; padding: 9px; border: 1px solid var(--app-line); border-radius: 9px; background: transparent; color: inherit; text-align: left; cursor: pointer; }
.reference-library__row:hover, .reference-library__row.selected { border-color: var(--app-accent); background: color-mix(in srgb, var(--app-accent) 7%, transparent); }
.reference-library__thumb { display: grid; place-items: center; width: 62px; height: 50px; overflow: hidden; border-radius: 6px; background: #151515; color: #888; font-size: 10px; font-weight: 800; letter-spacing: .08em; }
.reference-library__thumb img { width: 100%; height: 100%; object-fit: cover; }
.reference-library__row-copy { display: grid; gap: 4px; min-width: 0; }
.reference-library__row-copy strong, .reference-library__row-copy small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.reference-library__row-copy small { color: var(--app-sub); }
.reference-library__row-copy > span { display: flex; flex-wrap: wrap; gap: 4px; }
.reference-library__row-copy em { padding: 2px 6px; border-radius: 999px; background: var(--app-panel-subtle, #eee); font-size: 10px; font-style: normal; }
.reference-library__row-meta { display: grid; justify-items: end; gap: 5px; }
.reference-library__row-meta b { font-size: 15px; }
.reference-library__row-meta em, .reference-library__status { padding: 3px 7px; border-radius: 999px; font-size: 10px; font-style: normal; font-weight: 800; white-space: nowrap; }
.is-draft { background: #ededed; color: #555; }.is-review { background: #fff0c2; color: #805b00; }.is-approved { background: #ddf7e6; color: #18733a; }.is-archived { background: #e8e8e8; color: #777; }
.is-ready { background: #ddf7e6; color: #18733a; }.is-blocked { background: #ffe6e2; color: #a33a2d; }
.reference-library__readiness { grid-column: 1 / -1; display: grid; gap: 7px; margin-top: 10px; padding: 12px; border: 1px solid #e2aaa2; background: #fff7f5; }
.reference-library__readiness.ready { border-color: #9ed7b2; background: #f2fbf5; }
.reference-library__readiness > span { color: var(--app-sub); font-size: 12px; }
.reference-library__readiness ul { display: grid; gap: 5px; margin: 0; padding: 0; list-style: none; }
.reference-library__readiness li { display: flex; gap: 8px; align-items: baseline; color: var(--app-sub); font-size: 11px; }
.reference-library__readiness code { color: var(--app-ink); font-size: 10px; }
.reference-library__empty { margin: 0; padding: 24px 8px; color: var(--app-sub); font-size: 12px; text-align: center; }
.reference-library__editor { display: grid; gap: 16px; }
.reference-library__editor-heading { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--app-line); }
.reference-library__editor-heading > div { display: grid; gap: 3px; }
.reference-library__editor-heading strong { font-size: 20px; }.reference-library__editor-heading span { color: var(--app-sub); font-size: 12px; }
.reference-library__fields { display: grid; gap: 18px; margin: 0; padding: 0; border: 0; }
.reference-library__fields section { display: grid; gap: 10px; padding-bottom: 18px; border-bottom: 1px solid var(--app-line); }
.reference-library__fields h3 { margin: 0; font-size: 14px; }
.reference-library__fields label { display: grid; gap: 5px; min-width: 0; }
.reference-library__fields label > span { color: var(--app-sub); font-size: 12px; font-weight: 700; }
.reference-library__fields label small { font-weight: 400; }
.reference-library__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.reference-library__grid .wide { grid-column: 1 / -1; }
.reference-library__code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important; font-size: 12px !important; tab-size: 2; }
.reference-library__analysis-action { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px; border: 1px solid color-mix(in srgb, var(--app-accent) 30%, var(--app-line)); border-radius: 8px; background: color-mix(in srgb, var(--app-accent) 5%, transparent); }
.reference-library__analysis-action > div { display: grid; gap: 3px; }.reference-library__analysis-action span { color: var(--app-sub); font-size: 11px; }
.reference-library__analysis-meta { display: flex; flex-wrap: wrap; gap: 5px 12px; color: var(--app-sub); font-size: 11px; }
.reference-library__upload { padding: 11px; border: 1px dashed var(--app-line); border-radius: 8px; }.reference-library__upload em { color: var(--app-sub); font-size: 11px; font-style: normal; }
.reference-library__score-heading { display: flex; justify-content: space-between; align-items: center; }
.reference-library__score-heading strong { color: var(--app-accent); font-size: 20px; }
.reference-library__scores { display: grid; grid-template-columns: repeat(5, minmax(100px, 1fr)); gap: 8px; }
.reference-library__check { grid-template-columns: auto 1fr !important; align-items: start; padding: 12px; border: 1px solid var(--app-line); border-radius: 8px; }
.reference-library__check input { width: 18px; min-height: 18px; margin-top: 2px; }
.reference-library__check span { display: grid; gap: 2px; font-weight: 400 !important; }
.reference-library__check strong { color: var(--app-ink); }
.reference-library__approval { grid-template-columns: minmax(220px, .8fr) 1.2fr; padding: 14px !important; border: 1px solid var(--app-line) !important; border-radius: 9px; background: var(--app-panel-subtle, #f7f7f7); }
.reference-library__approval p { margin: 5px 0 0; color: var(--app-sub); font-size: 12px; }
.reference-library__approval ul { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin: 0; padding: 0; list-style: none; }
.reference-library__approval li { display: flex; gap: 5px; color: var(--app-sub); font-size: 11px; }.reference-library__approval li.passed { color: #18733a; font-weight: 700; }
.reference-library__footer { flex-wrap: wrap; padding-top: 2px; }.reference-library__footer-spacer { flex: 1; }
.reference-library__history { padding-top: 14px; border-top: 1px solid var(--app-line); }
.reference-library__history summary { cursor: pointer; font-size: 12px; font-weight: 800; }
.reference-library__history ol { display: grid; gap: 8px; padding-left: 20px; }
.reference-library__history li { padding: 8px; border: 1px solid var(--app-line); border-radius: 7px; font-size: 12px; }.reference-library__history li span, .reference-library__history li small { display: block; margin-top: 3px; color: var(--app-sub); }
@media (max-width: 1100px) { .reference-library__workspace { grid-template-columns: 1fr; }.reference-library__list { position: static; }.reference-library__rows { max-height: 360px; }.reference-library__scores { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 700px) { .reference-library__header { flex-direction: column; }.reference-library__summary, .reference-library__grid, .reference-library__approval { grid-template-columns: 1fr; }.reference-library__filters { grid-template-columns: 1fr; }.reference-library__scores { grid-template-columns: 1fr 1fr; }.reference-library__approval ul { grid-template-columns: 1fr; } }
</style>
