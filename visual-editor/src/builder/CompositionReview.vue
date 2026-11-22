<script setup>
import { computed, ref } from "vue";
import {sectionDesignPending} from "../../../shared/page-schema/section-design.mjs";
import TokenUsageReport from "./TokenUsageReport.vue";
import CompositionPreviewCanvas from "./CompositionPreviewCanvas.vue";
import {previewReference} from '../../../shared/layout-token-policy.mjs';

const props = defineProps({
  wireframe: {type:Boolean,default:false},
  desktopFirst:{type:Boolean,default:false},
  snapshot: { type: Object, required: true },
  controlsTarget: { type: String, default: "" },
  documentId:{type:String,default:""},
  documentRevision: { type: Number, required: true },
  busy: { type: Boolean, default: false },
  exportEnabled: { type: Boolean, default: false },
  viewport: { type: String, default: "desktop" },
  qualityGate: { type: Object, default: null },
  generationActivity:{type:Object,default:()=>({})},
  agentRequired:{type:Boolean,default:false},
});
const emit = defineEmits([
  "edit-natural-language", "rollback", "open-editor", "open-output", "export-document", "update:viewport",
  "check-quality",
]);
const previewCanvasRef = ref(null);
const effectsPaused=ref(false);
const previewViewport = computed({
  get: () => props.desktopFirst?"desktop":props.viewport,
  set: (viewport) => emit("update:viewport", viewport),
});

const previewReferenceWidth=computed(()=>props.snapshot.content?.pageSchema?previewReference(props.snapshot.content.pageContext,previewViewport.value)?.width:null);
function selectPreviewViewport(viewport) {
  if(props.desktopFirst&&viewport!=="desktop")return;
  previewViewport.value = viewport;
}

const viewportLabel = computed(() => props.snapshot.content?.pageSchema ? "Desktop · Tablet · Mobile" : "Desktop · Mobile");
const qualityState = computed(() => props.qualityGate?.state || "pending");
const qualityPassed = computed(() => (
  !sectionDesignPending(props.snapshot) &&
  (!(props.agentRequired||props.snapshot.generationMeta?.qualityAgentRequired)||Boolean(props.snapshot.generationMeta?.qualityAgentReview&&props.snapshot.generationMeta.qualityAgentReview.blockingCount===0))
  && qualityState.value === "passed"
  && Number(props.qualityGate?.documentRevision || 0) === Number(props.documentRevision || 0)
  && Number(props.qualityGate?.blockingCount || 0) === 0
));
const outputDisabledReason=computed(()=>props.busy?'디자인·이미지 준비 또는 품질 검사가 진행 중입니다.':qualityPassed.value?'':qualityState.value==='failed'?'자동 보정으로 해결하지 못한 항목이 있어 출력을 보류했습니다. 아래 검사 내역을 안내합니다.':qualityState.value==='passed'?'페이지가 변경되어 최신 Revision을 자동 검사해야 합니다.':'자동 품질 검사 완료 후 새 창 보기와 출력을 사용할 수 있습니다.');
const diagnostics=computed(()=>{
 const values=props.qualityGate?.diagnostics||Object.entries(props.qualityGate?.results||{}).flatMap(([viewport,result])=>(result.diagnostics||[]).map(item=>({...item,viewport})));
 return [...new Map(values.map(item=>[`${item.viewport}:${item.path}:${item.code}`,item])).values()];
});
const qualityLabel = computed(() => {
  if (qualityState.value === "checking") return `${viewportLabel.value} 품질 검사 중`;
  if (qualityPassed.value) {
    const warnings = Number(props.qualityGate?.warningCount || 0);
    return warnings ? `품질 검사 통과 · 경고 ${warnings}건` : "품질 검사 통과";
  }
  if (qualityState.value === "failed") {
    return props.qualityGate?.message || `품질 검사 차단 · ${Number(props.qualityGate?.blockingCount || 0)}건`;
  }
  return `출력 전에 ${viewportLabel.value} 품질 검사가 필요합니다.`;
});

function inspectQualityAcrossViewports(options) {
  return previewCanvasRef.value?.inspectQualityAcrossViewports?.(options);
}

function buildAutoRepairSnapshot(snapshot, result) {
  return previewCanvasRef.value?.buildAutoRepairSnapshot?.(snapshot, result);
}

defineExpose({ buildAutoRepairSnapshot, inspectQualityAcrossViewports });
</script>

<template>
  <section class="ai-builder-result">
    <header class="ai-builder-result__toolbar">
      <div class="ai-builder-actions">
        <div class="ai-builder-preview-viewport" role="group" aria-label="미리보기 화면 크기">
          <button type="button" :aria-pressed="previewViewport === 'desktop'" @click="selectPreviewViewport('desktop')">데스크톱</button>
          <button v-if="snapshot.content?.pageSchema" type="button" :disabled="desktopFirst||busy" :aria-pressed="previewViewport === 'tablet'" @click="selectPreviewViewport('tablet')">태블릿</button>
          <button type="button" :disabled="desktopFirst||busy" :aria-pressed="previewViewport === 'mobile'" @click="selectPreviewViewport('mobile')">모바일</button>
        </div>
        <Teleport :to="controlsTarget || 'body'" :disabled="!controlsTarget">
          <div v-if="!wireframe" class="ai-builder-actions" aria-label="디자인 작업">
        <button v-if="!qualityPassed && qualityState!=='checking'" type="button" class="ai-builder-secondary" :disabled="busy" @click="emit('check-quality')">다시 검사</button>
        <button type="button" class="ai-builder-secondary" :aria-pressed="effectsPaused" @click="effectsPaused=!effectsPaused">{{effectsPaused?'효과 다시 재생':'효과만 일시정지'}}</button>
        <button type="button" class="ai-builder-secondary" @click="emit('rollback')">이전 버전</button>
        <button type="button" class="ai-builder-secondary" @click="emit('edit-natural-language')">채팅으로 수정</button>
        <button type="button" class="ai-builder-primary" :disabled="busy || !qualityPassed" @click="emit('open-editor')">에디터에서 수정</button>

        <button type="button" class="ai-builder-primary" :disabled="busy || !qualityPassed" :title="outputDisabledReason||'검사한 페이지를 새 창에서 확인합니다.'" @click="emit('open-output')">새 창에서 확인</button>
        <button v-if="exportEnabled" type="button" class="ai-builder-primary" :disabled="busy || !qualityPassed" @click="emit('export-document')">HTML 다운로드</button>
        <p v-if="outputDisabledReason" role="status">{{ outputDisabledReason }}</p>
        <p v-if="snapshot.generationMeta?.qualityAgentReview">AI 검토: {{ snapshot.generationMeta.qualityAgentReview.summary }} · {{ snapshot.generationMeta.qualityAgentReview.execution?.model }}</p>
        <ul v-if="diagnostics.length" aria-label="자동 품질 검사 내역">
          <li v-for="(item,index) in diagnostics" :key="index">{{ item.viewport }} · {{ item.path || '페이지' }} · {{ item.message }}</li>
        </ul>
          </div>
        </Teleport>
      </div>
    </header>
    <CompositionPreviewCanvas ref="previewCanvasRef" :snapshot="snapshot" :viewport="previewViewport" :document-id="documentId" :wireframe="wireframe" :live-generation="Boolean(snapshot.content?.pageSchema)" :generation-activity="generationActivity" :effects-paused="effectsPaused" />
  </section>
</template>
