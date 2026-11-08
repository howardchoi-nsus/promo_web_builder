<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import PromoPageRenderer from "../PromoPageRenderer.vue";

const props = defineProps({
  snapshot: { type: Object, required: true },
  viewport: { type: String, default: "desktop" },
});

const previewStage = ref(null);
const previewCanvas = ref(null);
const rendererRef = ref(null);
const previewScale = ref(1);
const previewHeight = ref(720);
const inspectionViewport = ref("");
let previewObserver = null;
let previewFrame = 0;

const effectiveViewport = computed(() => inspectionViewport.value || props.viewport);
const previewWidth = computed(() => effectiveViewport.value === "mobile" ? 390 : 1280);
const previewShellStyle = computed(() => ({
  width: `${Math.max(1, previewWidth.value * previewScale.value)}px`,
  height: `${Math.max(1, previewHeight.value * previewScale.value)}px`,
}));
const previewCanvasStyle = computed(() => ({
  width: `${previewWidth.value}px`,
  transform: `scale(${previewScale.value})`,
}));

function syncPreviewFrame() {
  if (previewFrame) cancelAnimationFrame(previewFrame);
  previewFrame = requestAnimationFrame(() => {
    previewFrame = 0;
    const availableWidth = Math.max(280, Number(previewStage.value?.clientWidth || previewWidth.value) - 32);
    previewScale.value = Math.min(1, availableWidth / previewWidth.value);
    previewHeight.value = Math.max(480, Number(previewCanvas.value?.scrollHeight || 720));
  });
}

onMounted(() => {
  previewObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(syncPreviewFrame);
  if (previewStage.value) previewObserver?.observe(previewStage.value);
  if (previewCanvas.value) previewObserver?.observe(previewCanvas.value);
  syncPreviewFrame();
});

watch(() => [props.snapshot, effectiveViewport.value], () => nextTick(syncPreviewFrame), { deep: true });

function waitForAnimationFrames(count = 2) {
  if (typeof requestAnimationFrame !== "function") return Promise.resolve();
  return new Promise((resolve) => {
    const next = (remaining) => requestAnimationFrame(() => (
      remaining > 1 ? next(remaining - 1) : resolve()
    ));
    next(count);
  });
}

async function waitForPreviewLayout() {
  await nextTick();
  await waitForAnimationFrames();
  await document.fonts?.ready;
  const images = [...(previewCanvas.value?.querySelectorAll("img") || [])];
  await Promise.all(images.map((image) => image.decode?.().catch(() => undefined)));
  await waitForAnimationFrames();
  syncPreviewFrame();
}

async function inspectQualityAcrossViewports() {
  const results = {};
  try {
    for (const viewport of ["desktop", "mobile"]) {
      inspectionViewport.value = viewport;
      await waitForPreviewLayout();
      results[viewport] = rendererRef.value?.inspectLayoutQuality?.() || {
        viewport,
        count: 0,
        blockingCount: 0,
        warningCount: 0,
        diagnostics: [],
      };
    }
  } finally {
    inspectionViewport.value = "";
    await waitForPreviewLayout();
  }
  const values = Object.values(results);
  return {
    results,
    count: values.reduce((sum, result) => sum + Number(result.count || 0), 0),
    blockingCount: values.reduce((sum, result) => sum + Number(result.blockingCount || 0), 0),
    warningCount: values.reduce((sum, result) => sum + Number(result.warningCount || 0), 0),
    diagnostics: Object.entries(results).flatMap(([viewport, result]) => (
      (result.diagnostics || []).map((diagnostic) => ({ ...diagnostic, viewport }))
    )),
  };
}

function removeStylePrefix(styles = {}, sectionKey) {
  return Object.fromEntries(Object.entries(styles).filter(([key]) => (
    key !== sectionKey && !key.startsWith(`${sectionKey}.`)
  )));
}

function removeOptionalEmptySections(snapshot, diagnostics) {
  const emptyKeys = new Set(diagnostics
    .filter((diagnostic) => diagnostic.code === "EMPTY_VISIBLE_SECTION")
    .map((diagnostic) => String(diagnostic.sectionKey || ""))
    .filter(Boolean));
  if (!emptyKeys.size) return false;
  const sections = snapshot.content?.sectionSnapshot || [];
  const removable = new Set(sections
    .filter((section) => emptyKeys.has(section.sectionKey) && !section.isRequired && !section.fixedPosition)
    .map((section) => section.sectionKey));
  if (!removable.size) return false;
  snapshot.content.sectionSnapshot = sections.filter((section) => !removable.has(section.sectionKey));
  snapshot.content.sectionOrder = (snapshot.content.sectionOrder || []).filter((key) => !removable.has(key));
  snapshot.content.sectionInputs = Object.fromEntries(Object.entries(snapshot.content.sectionInputs || {})
    .filter(([key]) => !removable.has(key)));
  removable.forEach((sectionKey) => {
    snapshot.designSpec.itemStyles = removeStylePrefix(snapshot.designSpec.itemStyles, sectionKey);
    snapshot.designSpec.sectionStyles = removeStylePrefix(snapshot.designSpec.sectionStyles, sectionKey);
    const mobile = snapshot.designSpec.responsiveLayouts?.mobile;
    if (mobile) mobile.itemStyles = removeStylePrefix(mobile.itemStyles, sectionKey);
  });
  return true;
}

function applyBlockingStyleRepairs(snapshot, viewport, result) {
  snapshot.designSpec ||= {};
  snapshot.designSpec.itemStyles ||= {};
  snapshot.designSpec.responsiveLayouts ||= {};
  snapshot.designSpec.responsiveLayouts.mobile ||= {};
  snapshot.designSpec.responsiveLayouts.mobile.itemStyles ||= {};
  const target = viewport === "mobile"
    ? (snapshot.designSpec.responsiveLayouts.mobile.itemStyles ||= {})
    : (snapshot.designSpec.itemStyles ||= {});
  let changed = false;
  (result.diagnostics || []).forEach((diagnostic) => {
    if (!["ITEM_CLIPPED", "ITEM_CONTENT_OVERFLOW"].includes(diagnostic.code) || !diagnostic.styleKey) return;
    const current = { ...(target[diagnostic.styleKey] || {}) };
    current.heightMode = "auto";
    delete current.heightPx;
    if (diagnostic.code === "ITEM_CONTENT_OVERFLOW") {
      current.widthMode = "fill";
      current.widthPct = 100;
      delete current.maxWidthPct;
    }
    if (diagnostic.code === "ITEM_CLIPPED" && current.positionMode !== "flow") {
      current.xPct = 0;
      current.widthPct = Math.min(100, Math.max(10, Number(current.widthPct) || 100));
    }
    target[diagnostic.styleKey] = current;
    changed = true;
  });
  return changed;
}

function promoteBlockingSectionsToFlow(snapshot, diagnostics) {
  const blockingCodes = new Set(["ITEM_COLLISION", "ITEM_CLIPPED", "ITEM_CONTENT_OVERFLOW"]);
  const sectionKeys = new Set((diagnostics || [])
    .filter((diagnostic) => blockingCodes.has(diagnostic.code))
    .map((diagnostic) => String(diagnostic.sectionKey || ""))
    .filter(Boolean));
  let changed = false;
  sectionKeys.forEach((sectionKey) => {
    const section = (snapshot.content?.sectionSnapshot || []).find((entry) => entry.sectionKey === sectionKey);
    if (!section) return;
    const role = `${section.sectionRole || ""} ${section.sectionKey || ""}`;
    const itemCount = Math.max(1, (section.items || []).length);
    const columns = /hero|key-visual|terms|legal/i.test(role) ? 1 : Math.min(3, itemCount);
    snapshot.designSpec.sectionStyles[sectionKey] = {
      ...(snapshot.designSpec.sectionStyles[sectionKey] || {}),
      layoutMode: "flow",
      layoutColumns: columns,
      mobileLayoutColumns: 1,
      layoutGapPx: 24,
      mobileLayoutGapPx: 18,
      layoutPaddingBlockPx: 48,
      mobileLayoutPaddingBlockPx: 32,
      contentAlignment: /hero|key-visual/i.test(role) ? "center" : "stretch",
    };
    (section.items || []).forEach((item) => {
      const styleKey = `${sectionKey}.${item.itemKey}`;
      for (const styles of [
        snapshot.designSpec.itemStyles,
        snapshot.designSpec.responsiveLayouts.mobile.itemStyles,
      ]) {
        const style = { ...(styles[styleKey] || {}) };
        ["xPct", "yPx", "yPct", "heightPx", "offsetX", "offsetY", "horizontalAnchor", "verticalAnchor"]
          .forEach((key) => delete style[key]);
        styles[styleKey] = {
          ...style,
          positionMode: "flow",
          widthMode: item.fieldKind === "cta" ? "fit-content" : "fill",
          heightMode: "auto",
          widthPct: 100,
          ...(/hero|key-visual/i.test(role) ? { textAlign: "center", justifySelf: "center" } : {}),
        };
      }
    });
    changed = true;
  });
  return changed;
}

async function buildAutoRepairSnapshot(sourceSnapshot, qualityResult) {
  const snapshot = JSON.parse(JSON.stringify(sourceSnapshot));
  snapshot.designSpec ||= {};
  snapshot.designSpec.itemStyles ||= {};
  snapshot.designSpec.sectionStyles ||= {};
  snapshot.designSpec.responsiveLayouts ||= {};
  snapshot.designSpec.responsiveLayouts.mobile ||= {};
  snapshot.designSpec.responsiveLayouts.mobile.itemStyles ||= {};
  let changed = removeOptionalEmptySections(snapshot, qualityResult.diagnostics || []);
  try {
    for (const viewport of ["desktop", "mobile"]) {
      inspectionViewport.value = viewport;
      await waitForPreviewLayout();
      const collision = rendererRef.value?.inspectLayoutCollisions?.() || {};
      const target = viewport === "mobile"
        ? (snapshot.designSpec.responsiveLayouts.mobile.itemStyles ||= {})
        : (snapshot.designSpec.itemStyles ||= {});
      Object.entries(collision.itemPatches || {}).forEach(([styleKey, patch]) => {
        target[styleKey] = { ...(target[styleKey] || {}), ...patch };
        changed = true;
      });
      Object.entries(collision.sectionPatches || {}).forEach(([sectionKey, patch]) => {
        const current = snapshot.designSpec.sectionStyles?.[sectionKey] || {};
        snapshot.designSpec.sectionStyles[sectionKey] = {
          ...current,
          minHeight: Math.max(Number(current.minHeight || 0), Number(patch.minHeight || 0)),
        };
        changed = true;
      });
      changed = applyBlockingStyleRepairs(snapshot, viewport, qualityResult.results?.[viewport] || {}) || changed;
    }
    changed = promoteBlockingSectionsToFlow(snapshot, qualityResult.diagnostics || []) || changed;
  } finally {
    inspectionViewport.value = "";
    await waitForPreviewLayout();
  }
  return { snapshot, changed };
}

defineExpose({ buildAutoRepairSnapshot, inspectQualityAcrossViewports });

onBeforeUnmount(() => {
  previewObserver?.disconnect();
  if (previewFrame) cancelAnimationFrame(previewFrame);
});
</script>

<template>
  <div ref="previewStage" class="ai-builder-preview ai-builder-preview-stage" :data-viewport="effectiveViewport">
    <div class="ai-builder-preview-shell" :style="previewShellStyle">
      <div ref="previewCanvas" class="ai-builder-preview-canvas" :style="previewCanvasStyle">
        <PromoPageRenderer
          ref="rendererRef"
          :content="snapshot.content"
          :design-spec="snapshot.designSpec"
          :assets="snapshot.assets"
          :motion-spec="snapshot.motionSpec"
          :editable="false"
          :show-guides="false"
          :viewport-override="effectiveViewport"
        />
      </div>
    </div>
  </div>
</template>
