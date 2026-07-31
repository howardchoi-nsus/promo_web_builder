<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { createPromoTokenRuntimeStyle, normalizePromoTokenValues } from "../../shared/promo-token-runtime.mjs";
import { normalizeCtaUrl } from "./editor-utils.mjs";
import {
  MINIMUM_COMPONENT_HEIGHT_PX,
  MINIMUM_COMPONENT_WIDTH_PCT,
  defaultComponentHeight,
  geometryToLayoutStyle,
  normalizeComponentGeometry,
} from "./platform/layout-engine/geometry.mjs";
import { resizeComponentGeometry } from "./platform/layout-engine/resize.mjs";

const props = defineProps({
  content: { type: Object, required: true },
  designSpec: { type: Object, required: true },
  assets: { type: Object, required: true },
  editable: { type: Boolean, default: false },
  showGuides: { type: Boolean, default: true },
  outlineMode: { type: Boolean, default: false },
  selectedItemKey: { type: String, default: "" },
  selectedItemKeys: { type: Array, default: () => [] },
  sectionDesignRuns: { type: Object, default: () => ({}) },
  motionSpec: { type: Object, default: () => ({ sections: {}, items: {} }) },
  viewportOverride: { type: String, default: "" },
});
const emit = defineEmits(["select-item", "update-item-style", "update-renderer-item-style", "update-item-content", "update-section-style"]);
const SECTION_VERTICAL_PADDING_PX = 20;
const DRAG_ACTIVATION_DISTANCE_PX = 7;
const viewportWidth = ref(typeof globalThis.innerWidth === "number" ? globalThis.innerWidth : 1280);
function updateViewportWidth() {
  viewportWidth.value = globalThis.innerWidth || 1280;
}
onMounted(() => globalThis.addEventListener("resize", updateViewportWidth));
onBeforeUnmount(() => globalThis.removeEventListener("resize", updateViewportWidth));
const mobileLayoutActive = computed(() => (
  props.viewportOverride
    ? props.viewportOverride === "mobile"
    : viewportWidth.value <= Number(props.designSpec?.responsive?.mobileBreakpoint || 720)
));

const orderedSections = computed(() => {
  const definitions = props.content?.sectionSnapshot || [];
  const order = props.content?.sectionOrder || [];
  const positions = new Map(order.map((key, index) => [key, index]));
  return [...definitions].sort((a, b) => (
    (positions.get(a.sectionKey) ?? a.sortOrder ?? 0) - (positions.get(b.sectionKey) ?? b.sortOrder ?? 0)
  ));
});

const managedTokens = computed(() => normalizePromoTokenValues(
  props.content?.formTemplate?.designTokens?.values,
));

const managedTokenStyle = computed(() => createPromoTokenRuntimeStyle(managedTokens.value, {
  background: props.designSpec?.theme?.backgroundColor,
  text: props.designSpec?.theme?.textColor,
  accent: props.designSpec?.theme?.accentColor,
  cta: props.designSpec?.theme?.ctaColor || props.designSpec?.theme?.accentColor,
  ctaTransparent: props.designSpec?.theme?.ctaVariant === "ghost",
  radius: props.designSpec?.theme?.ctaShape === "round" ? "999px" : "2px",
}));

function componentFields(item) {
  const fields = Array.isArray(item?.fields) ? item.fields : [];
  return fields.length ? fields : [item];
}

function itemVisibilityKey(section, item) {
  return `${section.sectionKey}.${item.itemKey}`;
}

function fieldVisibilityKey(section, item, field) {
  return `${itemVisibilityKey(section, item)}.${field.fieldKey}`;
}

function isItemVisible(section, item) {
  if (item?.isRequired || item?.isLocked) return true;
  const key = itemVisibilityKey(section, item);
  const responsive = mobileLayoutActive.value
    ? props.designSpec?.responsiveLayouts?.mobile?.visibility?.items?.[key]
    : undefined;
  return (responsive ?? props.designSpec?.visibility?.items?.[key]) !== false;
}

function isFieldVisible(section, item, field) {
  if (field?.isRequired || field?.isLocked) return true;
  return props.designSpec?.visibility?.fields?.[fieldVisibilityKey(section, item, field)] !== false;
}

function renderedFields(section, item) {
  return componentFields(item).filter((field) => (
    props.editable || isFieldVisible(section, item, field)
  ));
}

function valueFor(section, item, field = null) {
  const value = props.content?.sectionInputs?.[section.sectionKey]?.[item.itemKey];
  if (!field || componentFields(item).length <= 1) return value;
  return value?.fields?.[field.fieldKey];
}

function imageUrl(value) {
  const candidate = String(value?.value || "").trim();
  return /^(https?:\/\/|\/api\/)/i.test(candidate) ? candidate : "";
}

function isConfiguredAiImageItem(section, item) {
  return Array.isArray(section?.aiDesign?.imageTargetItemKeys)
    && section.aiDesign.imageTargetItemKeys.includes(item?.itemKey);
}

function isLegacyAiImageValue(section, item, value) {
  if (isConfiguredAiImageItem(section, item)) return false;
  const candidate = String(value?.value || "").trim();
  return value?.source === "ai" || candidate.startsWith("/api/promo-section-design-image?");
}

function renderedItems(section) {
  return (section.items || []).filter((item) => (
    (props.editable || isItemVisible(section, item))
    && (item.fieldKind !== "image" || !isLegacyAiImageValue(section, item, valueFor(section, item)))
    && (componentFields(item).length <= 1 || renderedFields(section, item).length > 0)
  ));
}

function itemIsEmpty(section, item) {
  return componentFields(item).every((field) => !hasContent(valueFor(section, item, field)));
}

function sectionBackgroundUrl(section) {
  const configured = String(sectionStyle(section).backgroundImage || "").trim();
  const legacyAiImage = (section.items || [])
    .filter((item) => item.fieldKind === "image")
    .map((item) => ({ item, value: valueFor(section, item) }))
    .find(({ item, value }) => isLegacyAiImageValue(section, item, value));
  const candidate = configured || String(legacyAiImage?.value?.value || "").trim();
  return /^(https?:\/\/|\/api\/)/i.test(candidate) ? candidate : "";
}

function ctaUrl(value) {
  return normalizeCtaUrl(value?.link);
}

function hasContent(value) {
  if (value && typeof value === "object") {
    return Boolean(value.value || value.label || value.description);
  }
  return Boolean(String(value || "").trim());
}

function textFieldDescription(item, field = null) {
  const target = field || item;
  return String(
    target?.description
    || target?.editorSchema?.description
    || (!field ? item?.description : "")
    || "내용을 입력하세요",
  ).trim();
}

function styleKey(section, item) {
  return `${section.sectionKey}.${item.itemKey}`;
}

function itemStyle(section, item) {
  const key = styleKey(section, item);
  const base = props.designSpec?.itemStyles?.[key] || {};
  if (!mobileLayoutActive.value) return base;
  return {
    ...base,
    ...(props.designSpec?.responsiveLayouts?.mobile?.itemStyles?.[key] || {}),
  };
}

function sectionStyle(section) {
  return props.designSpec?.sectionStyles?.[section.sectionKey] || {};
}

function motionBinding(targetType, targetKey) {
  const bindings = targetType === "section"
    ? props.motionSpec?.sections
    : props.motionSpec?.items;
  return bindings?.[targetKey] || null;
}

function motionClass(targetType, targetKey) {
  const binding = motionBinding(targetType, targetKey);
  if (!binding?.presetVersionId) return "";
  if (["motion-fade-up", "motion-fade-in", "motion-scale-in"].includes(binding.className)) {
    return binding.className;
  }
  if (String(binding.presetVersionId).includes("fade-up")) return "motion-fade-up";
  if (String(binding.presetVersionId).includes("fade-in")) return "motion-fade-in";
  if (String(binding.presetVersionId).includes("scale-in")) return "motion-scale-in";
  return "motion-fade-in";
}

function motionStyle(targetType, targetKey) {
  const binding = motionBinding(targetType, targetKey);
  if (!binding) return {};
  return {
    "--motion-duration": binding.durationToken || "360ms",
    "--motion-easing": binding.easingToken || "ease-out",
    "--motion-delay": binding.delayToken || "0ms",
  };
}

const AI_PROCESSING_STATUSES = new Set([
  "queued", "analyzing_content", "generating_layout", "validating_layout",
  "generating_assets", "validating_assets", "applying",
]);

function sectionDesignRun(section) {
  return props.sectionDesignRuns?.[section.sectionKey] || null;
}

function aiStatusLabel(status, targetType) {
  const targetLabel = targetType === "item" ? "AI 이미지" : "AI 키비주얼";
  const labels = {
    queued: `${targetLabel} 생성 준비 중`,
    analyzing_content: "콘텐츠 분석 중",
    generating_layout: "레이아웃 생성 중",
    validating_layout: "레이아웃 검증 중",
    generating_assets: `${targetLabel} 생성 중`,
    validating_assets: `${targetLabel} 검증 중`,
    applying: `${targetLabel} 적용 중`,
  };
  return labels[status] || `${targetLabel} 처리 중`;
}

function aiTargetState(section, item = null, field = null) {
  const run = sectionDesignRun(section);
  const target = run?.constraintsSnapshot?.imageTarget;
  const matchesTarget = item
    ? target?.type === "item" && target.itemKey === item.itemKey
      && (!field || !target.fieldKey || target.fieldKey === field.fieldKey)
    : target?.type === "section-background";
  if (!matchesTarget) return null;
  if (AI_PROCESSING_STATUSES.has(run.status)) {
    return { kind: "processing", label: aiStatusLabel(run.status, target.type) };
  }
  if (run.status === "failed") {
    return {
      kind: "failed",
      label: target.type === "item" ? "AI 이미지 생성 실패" : "AI 키비주얼 생성 실패",
      detail: String(run.errorMessage || "").trim(),
    };
  }
  return null;
}

function itemResizeHandles(section, item) {
  const style = itemStyle(section, item);
  if (item.fieldKind === "image" && (style.shape === "circle" || style.aspectRatioLocked !== false)) {
    return ["nw", "ne", "se", "sw"];
  }
  if (item.fieldKind !== "image" && style.heightMode === "auto") return ["e", "w"];
  return ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
}

function clamp(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function normalizedAspectRatio(value, fallback = "1 / 1") {
  const match = String(value || "").trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
  if (!match || Number(match[1]) <= 0 || Number(match[2]) <= 0) return fallback;
  return `${Number(match[1])} / ${Number(match[2])}`;
}

function imageFrameAspectRatio(item, style) {
  if (style.shape === "circle") return "1 / 1";
  return normalizedAspectRatio(style.aspectRatio || item.image?.aspectRatio, "1 / 1");
}

function imageFrameStyle(section, item) {
  const style = itemStyle(section, item);
  const url = imageUrl(valueFor(section, item));
  const shape = ["square", "rounded", "circle"].includes(style.shape) ? style.shape : "square";
  return {
    backgroundImage: url ? `url(${JSON.stringify(url)})` : undefined,
    backgroundSize: ["contain", "cover"].includes(style.imageFit) ? style.imageFit : "contain",
    backgroundPosition: style.imagePosition || "center center",
    backgroundRepeat: "no-repeat",
    borderRadius: shape === "circle" ? "50%" : shape === "rounded" ? "var(--promo-image-radius, 24px)" : "0",
  };
}

function fieldStyle(section, item, field) {
  return props.designSpec?.itemStyles?.[`${styleKey(section, item)}.${field.fieldKey}`] || {};
}

function imageFieldFrameStyle(section, item, field) {
  const style = fieldStyle(section, item, field);
  const url = imageUrl(valueFor(section, item, field));
  const shape = ["square", "rounded", "circle"].includes(style.shape) ? style.shape : "square";
  return {
    backgroundImage: url ? `url(${JSON.stringify(url)})` : undefined,
    backgroundSize: ["contain", "cover"].includes(style.imageFit) ? style.imageFit : "contain",
    backgroundPosition: style.imagePosition || "center center",
    backgroundRepeat: "no-repeat",
    aspectRatio: normalizedAspectRatio(style.aspectRatio || field.image?.aspectRatio, "1 / 1"),
    borderRadius: shape === "circle" ? "50%" : shape === "rounded" ? "var(--promo-image-radius, 24px)" : "0",
  };
}

function imageFieldAccessibility(section, item, field) {
  const style = fieldStyle(section, item, field);
  const value = valueFor(section, item, field);
  if (style.decorative === true) return { ariaHidden: "true", role: undefined, label: undefined };
  return {
    ariaHidden: undefined,
    role: "img",
    label: String(style.accessibleLabel || value?.alt || value?.description || field.name || "Promotion image").trim(),
  };
}

function imageFrameAccessibility(section, item) {
  const style = itemStyle(section, item);
  const value = valueFor(section, item);
  if (style.decorative === true) return { ariaHidden: "true", role: undefined, label: undefined };
  return {
    ariaHidden: undefined,
    role: "img",
    label: String(style.accessibleLabel || value?.alt || value?.description || item.name || "Promotion image").trim(),
  };
}

function estimatedItemHeight(item) {
  return defaultComponentHeight(item);
}

function defaultSectionHeight(section) {
  return Math.max(180, (section.items || []).reduce((height, item) => height + estimatedItemHeight(item), 0) + 52);
}

function defaultItemPosition(section, item) {
  const items = section.items || [];
  const index = Math.max(0, items.findIndex((candidate) => candidate.itemKey === item.itemKey));
  const precedingHeight = items.slice(0, index).reduce((height, candidate) => height + estimatedItemHeight(candidate), 0);
  const sectionHeight = sectionStyle(section).minHeight || defaultSectionHeight(section);
  const canvasHeight = Math.max(50, sectionHeight - SECTION_VERTICAL_PADDING_PX);
  return {
    xPct: 0,
    yPct: canvasHeight ? (precedingHeight / canvasHeight) * 100 : 0,
  };
}

function normalizedFadeMode(style) {
  if (["none", "left", "right", "both"].includes(style.backgroundFadeMode)) return style.backgroundFadeMode;
  if (style.backgroundFadeSafeArea === "left-copy") return "left";
  if (style.backgroundFadeSafeArea === "right-copy") return "right";
  if (style.backgroundFadeSafeArea === "center-copy") return "both";
  return "none";
}

function effectiveSectionBackgroundColor(style) {
  const sectionColor = String(style.backgroundColor || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(sectionColor)) return sectionColor;
  const tokenColor = String(
    managedTokens.value["--promo-bg"]
    || managedTokens.value["--app-bg"]
    || managedTokens.value["--promo-surface"]
    || managedTokens.value["--app-surface"]
    || "",
  ).trim();
  if (/^#[0-9a-f]{6}$/i.test(tokenColor)) return tokenColor;
  const themeColor = String(props.designSpec?.theme?.backgroundColor || "").trim();
  return /^#[0-9a-f]{6}$/i.test(themeColor) ? themeColor : "#f5f7fb";
}

function backgroundFadeGradient(mode, color, strength = "medium", configuredStops = {}) {
  if (!/^#[0-9a-f]{6}$/i.test(String(color || ""))) return "";
  const stops = configuredStops?.[strength] || {
    soft: { solid: 8, clear: 38, edge: 18 },
    medium: { solid: 14, clear: 48, edge: 24 },
    strong: { solid: 22, clear: 62, edge: 32 },
  }[strength] || { solid: 14, clear: 48, edge: 24 };
  if (mode === "left") {
    return `linear-gradient(to right, ${color} 0%, ${color} ${stops.solid}%, transparent ${stops.clear}%)`;
  }
  if (mode === "right") {
    return `linear-gradient(to left, ${color} 0%, ${color} ${stops.solid}%, transparent ${stops.clear}%)`;
  }
  if (mode === "both") {
    return `linear-gradient(to right, ${color} 0%, transparent ${stops.edge}%, transparent ${100 - stops.edge}%, ${color} 100%)`;
  }
  return "";
}

function inlineSectionStyle(section) {
  const style = sectionStyle(section);
  const canvasHeight = style.minHeight || defaultSectionHeight(section);
  const backgroundImage = sectionBackgroundUrl(section);
  const backgroundColor = effectiveSectionBackgroundColor(style);
  const fadeGradient = backgroundImage
    ? backgroundFadeGradient(
      normalizedFadeMode(style),
      backgroundColor,
      style.backgroundFadeStrength,
      style.backgroundFadeStops,
    )
    : "";
  const fitMode = style.backgroundFitMode
    || (style.backgroundSize === "100% auto" ? "width-fill" : style.backgroundSize);
  const backgroundSize = fitMode === "width-fill"
    ? "100% auto"
    : (["contain", "cover"].includes(fitMode) ? fitMode : "cover");
  return {
    height: `${Math.max(50, canvasHeight)}px`,
    backgroundColor,
    backgroundImage: backgroundImage
      ? [fadeGradient, `url(${JSON.stringify(backgroundImage)})`].filter(Boolean).join(", ")
      : undefined,
    backgroundSize: backgroundImage
      ? (fadeGradient ? `100% 100%, ${backgroundSize}` : backgroundSize)
      : undefined,
    backgroundPosition: backgroundImage
      ? (fadeGradient ? `center, ${style.backgroundPosition || "center center"}` : (style.backgroundPosition || "center center"))
      : undefined,
    backgroundRepeat: backgroundImage
      ? (fadeGradient ? `no-repeat, ${style.backgroundRepeat || "no-repeat"}` : (style.backgroundRepeat || "no-repeat"))
      : undefined,
  };
}

function inlineCanvasStyle(section) {
  const height = sectionStyle(section).minHeight || defaultSectionHeight(section);
  return {
    height: `${Math.max(0, height - SECTION_VERTICAL_PADDING_PX)}px`,
  };
}

function inlineItemStyle(section, item) {
  const style = itemStyle(section, item);
  const anchored = style.positionMode === "anchored";
  const position = style.positionMode === "free" ? style : defaultItemPosition(section, item);
  const isImage = item.fieldKind === "image";
  const widthPct = clamp(style.widthPct, MINIMUM_COMPONENT_WIDTH_PCT, 100, 32);
  const autoHeight = !isImage && style.heightMode === "auto";
  const fitContent = !isImage && style.widthMode === "fit-content";
  const heightPx = clamp(
    style.heightPx,
    MINIMUM_COMPONENT_HEIGHT_PX,
    900,
    isImage || autoHeight ? undefined : defaultComponentHeight(item),
  );
  const horizontalAnchor = ["left", "center", "right"].includes(style.horizontalAnchor)
    ? style.horizontalAnchor
    : "center";
  const verticalAnchor = ["top", "middle", "bottom"].includes(style.verticalAnchor)
    ? style.verticalAnchor
    : "middle";
  const anchorLeft = { left: "0%", center: "50%", right: "100%" }[horizontalAnchor];
  const anchorTop = { top: "0%", middle: "50%", bottom: "100%" }[verticalAnchor];
  const anchorTranslateX = { left: "0%", center: "-50%", right: "-100%" }[horizontalAnchor];
  const anchorTranslateY = { top: "0%", middle: "-50%", bottom: "-100%" }[verticalAnchor];
  const result = {
    left: anchored ? anchorLeft : `${position.xPct || 0}%`,
    top: anchored ? anchorTop : (style.yPx !== undefined ? `${style.yPx}px` : `${position.yPct || 0}%`),
    transform: anchored
      ? `translate(${anchorTranslateX}, ${anchorTranslateY}) translate(${Number(style.offsetX) || 0}px, ${Number(style.offsetY) || 0}px)`
      : undefined,
    zIndex: style.zIndex || 2,
    color: style.colorToken ? `var(${style.colorToken})` : style.color,
    "--item-color": style.colorToken ? `var(${style.colorToken})` : style.color,
    fontFamily: style.fontFamilyToken ? `var(${style.fontFamilyToken})` : style.fontFamily,
    fontSize: style.fontSizeToken
      ? `var(${style.fontSizeToken})`
      : (style.fontSize !== undefined ? `${style.fontSize}px` : undefined),
    "--item-font-size": style.fontSizeToken
      ? `var(${style.fontSizeToken})`
      : (style.fontSize !== undefined ? `${style.fontSize}px` : undefined),
    fontWeight: style.fontWeightToken ? `var(${style.fontWeightToken})` : style.fontWeight,
    "--item-font-weight": style.fontWeightToken ? `var(${style.fontWeightToken})` : style.fontWeight,
    lineHeight: style.lineHeightToken ? `var(${style.lineHeightToken})` : style.lineHeight,
    letterSpacing: style.letterSpacingToken ? `var(${style.letterSpacingToken})` : style.letterSpacing,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    textAlign: style.textAlign || (anchored ? horizontalAnchor : undefined),
    width: fitContent ? "fit-content" : style.widthMode === "fill" ? "100%" : `${widthPct}%`,
    maxWidth: fitContent
      ? (style.maxWidthToken ? `var(${style.maxWidthToken})` : `${clamp(style.maxWidthPct, 10, 100, 80)}%`)
      : undefined,
    height: heightPx && (!isImage || style.shape !== "circle") ? `${heightPx}px` : undefined,
    aspectRatio: isImage && (!heightPx || style.shape === "circle")
      ? imageFrameAspectRatio(item, style)
      : undefined,
  };
  return result;
}

function selectRendererItem(section, item, event = null) {
  if (!props.editable) return;
  const additive = Boolean(event?.ctrlKey || event?.metaKey || event?.shiftKey);
  const key = styleKey(section, item);
  if (!additive && (props.selectedItemKey === key || props.selectedItemKeys.includes(key))) return;
  emit("select-item", section, item, {
    additive,
  });
}

function startDrag(event, section, item) {
  if (!props.editable || item.isLocked || event.button !== 0
    || event.ctrlKey || event.metaKey || event.shiftKey
    || event.target.closest(".item-resize-handle")
    || event.currentTarget.classList.contains("is-editing")) return;
  const target = event.currentTarget;
  const container = target.closest(".rendered-items");
  if (!container) return;
  event.preventDefault();
  selectRendererItem(section, item);
  target.setPointerCapture(event.pointerId);

  const startX = event.clientX;
  const startY = event.clientY;
  let rect = null;
  let startLeft = 0;
  let startTop = 0;
  let nextX = 0;
  let nextY = 0;
  let animationFrame = 0;
  let moved = false;

  const move = (moveEvent) => {
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;
    if (!moved) {
      if (Math.hypot(deltaX, deltaY) < DRAG_ACTIVATION_DISTANCE_PX) return;
      rect = container.getBoundingClientRect();
      const itemRect = target.getBoundingClientRect();
      startLeft = itemRect.left - rect.left;
      startTop = itemRect.top - rect.top;
      nextX = startLeft;
      nextY = startTop;
      target.style.transform = "none";
      target.style.left = `${startLeft}px`;
      target.style.top = `${startTop}px`;
      target.classList.add("is-dragging");
      moved = true;
    }
    const horizontalLimit = rect.width - target.offsetWidth;
    const verticalLimit = rect.height - target.offsetHeight;
    const minimumX = Math.min(0, horizontalLimit);
    const maximumX = Math.max(0, horizontalLimit);
    const minimumY = Math.min(0, verticalLimit);
    const maximumY = Math.max(0, verticalLimit);
    nextX = Math.min(maximumX, Math.max(minimumX, startLeft + deltaX));
    nextY = Math.min(maximumY, Math.max(minimumY, startTop + deltaY));
    if (animationFrame) return;
    animationFrame = requestAnimationFrame(() => {
      animationFrame = 0;
      target.style.left = `${nextX}px`;
      target.style.top = `${nextY}px`;
    });
  };
  const end = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (moved && rect) {
      const xPct = rect.width ? (nextX / rect.width) * 100 : 0;
      emit("update-item-style", { positionMode: "free", xPct, yPx: nextY });
    }
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    target.classList.remove("is-dragging");
    if (moved) {
      target.style.removeProperty("transform");
      target.style.removeProperty("left");
      target.style.removeProperty("top");
    }
    target.removeEventListener("pointermove", move);
    target.removeEventListener("pointerup", end);
    target.removeEventListener("pointercancel", end);
  };
  target.addEventListener("pointermove", move);
  target.addEventListener("pointerup", end);
  target.addEventListener("pointercancel", end);
}

function startItemResize(event, section, item, handleDirection = "se") {
  if (!props.editable || item.isLocked || event.button !== 0) return;
  const handle = event.currentTarget;
  const target = handle.closest(".rendered-item");
  const container = target?.closest(".rendered-items");
  if (!target || !container) return;
  event.preventDefault();
  event.stopPropagation();
  selectRendererItem(section, item);
  handle.setPointerCapture(event.pointerId);
  target.classList.add("is-resizing");

  const containerRect = container.getBoundingClientRect();
  const itemRect = target.getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const style = itemStyle(section, item);
  const isImage = item.fieldKind === "image";
  const autoHeight = !isImage && style.heightMode === "auto";
  const anchored = style.positionMode === "anchored";
  const locked = isImage && style.aspectRatioLocked !== false;
  const minimumItemSizePx = MINIMUM_COMPONENT_HEIGHT_PX;
  const horizontalActive = handleDirection.includes("w") || handleDirection.includes("e");
  const verticalActive = handleDirection.includes("n") || handleDirection.includes("s");
  const automaticPosition = defaultItemPosition(section, item);
  const canvasHeight = Math.max(
    50,
    (sectionStyle(section).minHeight || defaultSectionHeight(section)) - SECTION_VERTICAL_PADDING_PX,
  );
  const startGeometry = normalizeComponentGeometry({
    item,
    style,
    canvasWidth: containerRect.width,
    fallbackX: automaticPosition.xPct || 0,
    fallbackY: ((automaticPosition.yPct || 0) / 100) * canvasHeight,
  });
  if (anchored) {
    startGeometry.x = itemRect.left - containerRect.left;
    startGeometry.y = itemRect.top - containerRect.top;
    target.style.transform = "none";
    target.style.left = `${startGeometry.x}px`;
    target.style.top = `${startGeometry.y}px`;
  }
  if ((isImage && style.heightPx === undefined) || autoHeight) startGeometry.height = itemRect.height;
  const ratio = startGeometry.height ? startGeometry.width / startGeometry.height : 1;
  let nextGeometry = { ...startGeometry };
  let animationFrame = 0;

  const move = (moveEvent) => {
    const maxWidth = Math.max(minimumItemSizePx, handleDirection.includes("w")
      ? startGeometry.width + startGeometry.x
      : containerRect.width - startGeometry.x);
    const maxHeight = Math.max(minimumItemSizePx, handleDirection.includes("n")
      ? startGeometry.height + startGeometry.y
      : 1124 - startGeometry.y);
    nextGeometry = resizeComponentGeometry({
      geometry: startGeometry,
      deltaX: moveEvent.clientX - startX,
      deltaY: moveEvent.clientY - startY,
      direction: handleDirection,
      minimumWidth: minimumItemSizePx,
      minimumHeight: minimumItemSizePx,
      maximumWidth: maxWidth,
      maximumHeight: maxHeight,
      aspectRatioLocked: locked || (isImage && style.shape === "circle"),
      aspectRatio: style.shape === "circle" ? 1 : ratio,
      scaleFont: false,
    });
    if (animationFrame) return;
    animationFrame = requestAnimationFrame(() => {
      animationFrame = 0;
      target.style.left = `${nextGeometry.x}px`;
      target.style.top = `${nextGeometry.y}px`;
      if (horizontalActive || locked) target.style.width = `${nextGeometry.width}px`;
      if (verticalActive || locked) target.style.height = `${nextGeometry.height}px`;
      if (isImage) target.style.aspectRatio = "auto";
    });
  };
  const end = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    const requiredSectionHeight = Math.ceil(
      nextGeometry.y + nextGeometry.height + SECTION_VERTICAL_PADDING_PX,
    );
    const currentSectionHeight = sectionStyle(section).minHeight || defaultSectionHeight(section);
    if (requiredSectionHeight > currentSectionHeight) {
      emit("update-section-style", section.sectionKey, {
        minHeight: Math.min(1200, requiredSectionHeight),
      });
    }
    const layoutStyle = geometryToLayoutStyle(nextGeometry, containerRect.width, {
      includeHeight: verticalActive && !locked && !autoHeight && !(isImage && style.shape === "circle"),
      includeFontSize: false,
    });
    if (anchored) {
      delete layoutStyle.positionMode;
      delete layoutStyle.xPct;
      delete layoutStyle.yPx;
    }
    emit("update-renderer-item-style", section, item, {
      ...layoutStyle,
      ...(horizontalActive && !isImage ? { widthMode: "fixed" } : {}),
      ...(!verticalActive && !locked ? { heightPx: style.heightPx } : {}),
      ...(isImage
        ? { aspectRatio: `${Math.max(1, Math.round(nextGeometry.width))}/${Math.max(1, Math.round(nextGeometry.height))}` }
        : {}),
    });
    target.classList.remove("is-resizing");
    target.style.removeProperty("width");
    target.style.removeProperty("height");
    target.style.removeProperty("aspect-ratio");
    target.style.removeProperty("left");
    target.style.removeProperty("top");
    target.style.removeProperty("transform");
    handle.removeEventListener("pointermove", move);
    handle.removeEventListener("pointerup", end);
    handle.removeEventListener("pointercancel", end);
  };
  handle.addEventListener("pointermove", move);
  handle.addEventListener("pointerup", end);
  handle.addEventListener("pointercancel", end);
}

function resizeItemByKeyboard(event, section, item, handleDirection = "se") {
  if (!props.editable || item.isLocked) return;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
  const style = itemStyle(section, item);
  const isImage = item.fieldKind === "image";
  const autoHeight = !isImage && style.heightMode === "auto";
  const anchored = style.positionMode === "anchored";
  const locked = isImage && style.aspectRatioLocked !== false;
  const step = event.shiftKey ? 4 : 1;
  const horizontalActive = handleDirection.includes("w") || handleDirection.includes("e");
  const verticalActive = handleDirection.includes("n") || handleDirection.includes("s");
  const handle = event.currentTarget;
  const container = handle.closest(".rendered-items");
  if (!container) return;
  const containerWidth = Math.max(1, container.getBoundingClientRect().width);
  const horizontalDelta = horizontalActive
    ? event.key === "ArrowRight" ? (containerWidth * step) / 100 : event.key === "ArrowLeft" ? (-containerWidth * step) / 100 : 0
    : 0;
  const verticalDelta = verticalActive
    ? event.key === "ArrowDown" ? step * 4 : event.key === "ArrowUp" ? step * -4 : 0
    : 0;
  if (!horizontalDelta && !verticalDelta) return;
  const automaticPosition = defaultItemPosition(section, item);
  const canvasHeight = Math.max(
    50,
    (sectionStyle(section).minHeight || defaultSectionHeight(section)) - SECTION_VERTICAL_PADDING_PX,
  );
  const geometry = normalizeComponentGeometry({
    item,
    style,
    canvasWidth: containerWidth,
    fallbackX: automaticPosition.xPct || 0,
    fallbackY: ((automaticPosition.yPct || 0) / 100) * canvasHeight,
  });
  const resized = resizeComponentGeometry({
    geometry,
    deltaX: horizontalDelta,
    deltaY: verticalDelta,
    direction: handleDirection,
    minimumWidth: containerWidth * (MINIMUM_COMPONENT_WIDTH_PCT / 100),
    minimumHeight: MINIMUM_COMPONENT_HEIGHT_PX,
    maximumWidth: handleDirection.includes("w")
      ? geometry.width + geometry.x
      : containerWidth - geometry.x,
    maximumHeight: 900,
    aspectRatioLocked: locked || (isImage && style.shape === "circle"),
    aspectRatio: style.shape === "circle" ? 1 : geometry.width / geometry.height,
    scaleFont: false,
  });
  const layoutStyle = geometryToLayoutStyle(resized, containerWidth, {
      includeHeight: verticalActive && !locked && !autoHeight && !(isImage && style.shape === "circle"),
      includeFontSize: false,
    });
  if (anchored) {
    delete layoutStyle.positionMode;
    delete layoutStyle.xPct;
    delete layoutStyle.yPx;
  }
  emit("update-renderer-item-style", section, item, {
    ...layoutStyle,
    ...(horizontalActive && !isImage ? { widthMode: "fixed" } : {}),
    ...(!verticalActive && !locked ? { heightPx: style.heightPx } : {}),
  });
}

function startTextEdit(event, section, item, field = null) {
  if (!props.editable || item.isLocked) return;
  const textNode = event.currentTarget;
  const article = textNode.closest(".rendered-item");
  if (!article) return;
  const textTarget = field || item;
  if (textTarget.fieldKind !== "text" || textTarget.isLocked) return;
  event.preventDefault();
  event.stopPropagation();
  selectRendererItem(section, item);
  const currentValue = valueFor(section, item, field);
  const wasEmpty = !hasContent(currentValue);
  const fieldDescription = textFieldDescription(item, field);

  article.classList.add("is-editing");
  textNode.classList.remove("rendered-empty");
  textNode.classList.add("rendered-text");
  textNode.contentEditable = "true";
  if (wasEmpty) textNode.textContent = fieldDescription;
  textNode.focus();

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(textNode);
  selection.removeAllRanges();
  selection.addRange(range);

  const finish = () => {
    const nextValue = textNode.innerText.replace(/\r\n?/g, "\n").trim();
    const unchangedPlaceholder = wasEmpty && nextValue === fieldDescription;
    if (!unchangedPlaceholder) {
      emit("update-item-content", section, item, nextValue, field);
    } else {
      textNode.classList.remove("rendered-text");
      textNode.classList.add("rendered-empty");
      textNode.textContent = fieldDescription;
    }
    textNode.contentEditable = "false";
    article.classList.remove("is-editing");
    textNode.removeEventListener("blur", finish);
    textNode.removeEventListener("keydown", onKeydown);
  };
  const onKeydown = (keyEvent) => {
    if (keyEvent.key === "Escape") {
      keyEvent.preventDefault();
      textNode.blur();
    }
  };
  textNode.addEventListener("blur", finish);
  textNode.addEventListener("keydown", onKeydown);
}

function startSectionResize(event, section) {
  if (!props.editable || event.button !== 0) return;
  const resizeHandle = event.currentTarget;
  const sectionNode = resizeHandle.closest(".rendered-section");
  if (!sectionNode) return;
  const canvasNode = sectionNode.querySelector(".rendered-items");
  event.preventDefault();
  event.stopPropagation();
  if (section.items?.[0]) emit("select-item", section, section.items[0]);
  resizeHandle.setPointerCapture(event.pointerId);
  sectionNode.classList.add("is-resizing");
  const startY = event.clientY;
  const startHeight = sectionNode.getBoundingClientRect().height;
  const canvasRect = canvasNode?.getBoundingClientRect();
  if (canvasNode && canvasRect) {
    [...canvasNode.querySelectorAll(".rendered-item")].forEach((itemNode) => {
      const item = (section.items || []).find((candidate) => candidate.itemKey === itemNode.dataset.itemKey);
      if (!item) return;
      const itemRect = itemNode.getBoundingClientRect();
      const fixedTop = itemRect.top - canvasRect.top;
      itemNode.style.top = `${fixedTop}px`;
      emit("update-renderer-item-style", section, item, {
        positionMode: "free",
        yPx: fixedTop,
      });
    });
  }
  const verticalPadding = canvasRect
    ? Math.max(0, startHeight - canvasRect.height)
    : SECTION_VERTICAL_PADDING_PX;
  const minimumCanvasHeight = canvasNode
    ? [...canvasNode.querySelectorAll(".rendered-item")].reduce((requiredHeight, itemNode) => {
      const itemRect = itemNode.getBoundingClientRect();
      return Math.max(requiredHeight, itemRect.bottom - canvasRect.top);
    }, 0)
    : 0;
  const minHeight = Math.max(50, Math.ceil(minimumCanvasHeight + verticalPadding));
  const maxHeight = 1200;

  const move = (moveEvent) => {
    const nextHeight = Math.min(maxHeight, Math.max(minHeight, startHeight + moveEvent.clientY - startY));
    emit("update-section-style", section.sectionKey, { minHeight: nextHeight });
  };
  const end = () => {
    sectionNode.classList.remove("is-resizing");
    resizeHandle.removeEventListener("pointermove", move);
    resizeHandle.removeEventListener("pointerup", end);
    resizeHandle.removeEventListener("pointercancel", end);
  };
  resizeHandle.addEventListener("pointermove", move);
  resizeHandle.addEventListener("pointerup", end);
  resizeHandle.addEventListener("pointercancel", end);
}
</script>

<template>
  <div
    class="promo-renderer"
    :class="{
      'is-editor-preview': editable,
      'has-editor-guides': editable && showGuides,
      'is-outline-mode': editable && outlineMode,
    }"
    :style="{
      '--promo-font': designSpec.theme.fontFamily,
      '--promo-width': `${Math.min(1280, Number(designSpec.responsive.contentMaxWidth || 1280))}px`,
      '--promo-min-width': `${designSpec.responsive.contentMinWidth || 0}px`,
      ...managedTokenStyle,
    }"
  >
    <div v-if="editable && showGuides" class="content-width-guide" aria-hidden="true"></div>
    <section
      v-for="section in orderedSections"
      :key="section.sectionKey"
      class="rendered-section"
      :class="[
        `rendered-section--${section.sectionKey}`,
        motionClass('section', section.sectionKey),
        { 'is-outline-section': editable && outlineMode },
      ]"
      :data-section-key="section.sectionKey"
      :style="{ ...inlineSectionStyle(section), ...motionStyle('section', section.sectionKey) }"
      :aria-busy="aiTargetState(section)?.kind === 'processing' ? 'true' : undefined"
    >
      <div
        v-if="editable && aiTargetState(section)"
        class="section-ai-state"
        :class="`is-${aiTargetState(section).kind}`"
        role="status"
        aria-live="polite"
        :title="aiTargetState(section).detail || undefined"
      >
        <i v-if="aiTargetState(section).kind === 'processing'" aria-hidden="true"></i>
        <span>{{ aiTargetState(section).label }}</span>
      </div>
      <div class="rendered-section__inner">
        <div class="rendered-items" :style="inlineCanvasStyle(section)">
          <article
            v-for="item in renderedItems(section)"
            :key="item.itemKey"
            class="rendered-item"
            :class="[
              `rendered-item--${item.fieldKind || 'text'}`,
              motionClass('item', item.itemKey),
              {
                'is-editable': editable && !item.isLocked,
                'is-selected': editable && (
                  selectedItemKey === styleKey(section, item)
                  || selectedItemKeys.includes(styleKey(section, item))
                ),
                'is-hidden-in-output': editable && !isItemVisible(section, item),
                'is-locked': editable && item.isLocked,
                'is-empty': editable && itemIsEmpty(section, item),
                'is-free-positioned': itemStyle(section, item).positionMode !== 'anchored',
                'is-anchored-positioned': itemStyle(section, item).positionMode === 'anchored',
              },
            ]"
            :data-item-key="item.itemKey"
            :data-style-key="styleKey(section, item)"
            :style="{ ...inlineItemStyle(section, item), ...motionStyle('item', item.itemKey) }"
            @click.stop="selectRendererItem(section, item, $event)"
            @pointerdown="startDrag($event, section, item)"
          >
            <span
              v-if="editable && !isItemVisible(section, item)"
              class="output-hidden-badge"
            >비노출</span>
            <span
              v-if="editable && outlineMode"
              class="item-outline-label"
              aria-hidden="true"
            >
              {{ item.name || item.itemKey }}
              <small>{{ item.fieldKind || 'text' }}</small>
              <em v-if="item.isLocked">잠금</em>
              <em v-if="itemIsEmpty(section, item)">비어 있음</em>
            </span>
            <div v-if="componentFields(item).length > 1" class="rendered-component-fields">
              <template v-for="field in renderedFields(section, item)" :key="field.fieldKey">
                <a
                  v-if="field.fieldKind === 'cta'"
                  class="rendered-cta rendered-component-field"
                  :class="{ 'is-hidden-in-output': editable && !isFieldVisible(section, item, field) }"
                  :style="fieldStyle(section, item, field)"
                  :href="ctaUrl(valueFor(section, item, field))"
                  :target="valueFor(section, item, field)?.target || '_self'"
                  :rel="valueFor(section, item, field)?.target === '_blank' ? 'noopener noreferrer' : undefined"
                >{{ valueFor(section, item, field)?.label || field.name }}</a>
                <div
                  v-else-if="field.fieldKind === 'image'"
                  class="rendered-component-field"
                  :class="{ 'is-hidden-in-output': editable && !isFieldVisible(section, item, field) }"
                >
                  <div
                    class="rendered-image-frame rendered-component-image-frame"
                    :style="imageFieldFrameStyle(section, item, field)"
                    :role="imageFieldAccessibility(section, item, field).role"
                    :aria-label="imageFieldAccessibility(section, item, field).label"
                    :aria-hidden="imageFieldAccessibility(section, item, field).ariaHidden"
                    :aria-busy="aiTargetState(section, item, field)?.kind === 'processing' ? 'true' : undefined"
                  >
                    <div v-if="!imageUrl(valueFor(section, item, field))" class="rendered-image__placeholder">
                      <span>{{ field.name }}</span>
                      <small>이미지 준비 중</small>
                    </div>
                  </div>
                  <div v-if="editable && aiTargetState(section, item, field)" class="item-ai-state" :class="`is-${aiTargetState(section, item, field).kind}`" role="status" aria-live="polite">
                    <i v-if="aiTargetState(section, item, field).kind === 'processing'" aria-hidden="true"></i>
                    <span>{{ aiTargetState(section, item, field).label }}</span>
                  </div>
                </div>
                <p
                  v-else-if="hasContent(valueFor(section, item, field))"
                  class="rendered-text rendered-component-field"
                  :class="{
                    'rendered-text--title': field.textType === 'title',
                    'is-hidden-in-output': editable && !isFieldVisible(section, item, field),
                  }"
                  :style="fieldStyle(section, item, field)"
                  :data-field-key="field.fieldKey"
                  @dblclick.stop="startTextEdit($event, section, item, field)"
                >{{ valueFor(section, item, field) }}</p>
                <p
                  v-else
                  class="rendered-empty rendered-component-field"
                  :class="{ 'is-hidden-in-output': editable && !isFieldVisible(section, item, field) }"
                  :data-field-key="field.fieldKey"
                  @dblclick.stop="startTextEdit($event, section, item, field)"
                >{{ textFieldDescription(item, field) }}</p>
              </template>
            </div>

            <template v-else-if="item.fieldKind === 'cta'">
              <a
                class="rendered-cta"
                :href="ctaUrl(valueFor(section, item))"
                :target="valueFor(section, item)?.target || '_self'"
                :rel="valueFor(section, item)?.target === '_blank' ? 'noopener noreferrer' : undefined"
              >
                {{ valueFor(section, item)?.label || item.name }}
              </a>
            </template>

            <template v-else-if="item.fieldKind === 'image'">
              <div
                class="rendered-image-frame"
                :class="`rendered-image-frame--${itemStyle(section, item).shape || 'square'}`"
                :style="imageFrameStyle(section, item)"
                :role="imageFrameAccessibility(section, item).role"
                :aria-label="imageFrameAccessibility(section, item).label"
                :aria-hidden="imageFrameAccessibility(section, item).ariaHidden"
                :aria-busy="aiTargetState(section, item)?.kind === 'processing' ? 'true' : undefined"
              >
                <div v-if="!imageUrl(valueFor(section, item))" class="rendered-image__placeholder">
                  <span>{{ item.name }}</span>
                  <small>{{ valueFor(section, item)?.value || '이미지 준비 중' }}</small>
                </div>
              </div>
              <div
                v-if="editable && aiTargetState(section, item)"
                class="item-ai-state"
                :class="`is-${aiTargetState(section, item).kind}`"
                role="status"
                aria-live="polite"
                :title="aiTargetState(section, item).detail || undefined"
              >
                <i v-if="aiTargetState(section, item).kind === 'processing'" aria-hidden="true"></i>
                <span>{{ aiTargetState(section, item).label }}</span>
              </div>
              <template v-if="editable && showGuides && !item.isLocked && selectedItemKey === styleKey(section, item)">
                <button
                  v-for="handleDirection in itemResizeHandles(section, item)"
                  :key="handleDirection"
                  type="button"
                  class="item-resize-handle image-resize-handle"
                  :class="[`item-resize-handle--${handleDirection}`, `image-resize-handle--${handleDirection}`]"
                  :aria-label="`${item.name} 이미지 ${handleDirection} 방향 크기 조절`"
                  @pointerdown.stop="startItemResize($event, section, item, handleDirection)"
                  @keydown="resizeItemByKeyboard($event, section, item, handleDirection)"
                ></button>
              </template>
            </template>

            <template v-else>
              <p
                v-if="hasContent(valueFor(section, item))"
                class="rendered-text"
                :class="{ 'rendered-text--title': item.textType === 'title' }"
                @dblclick.stop="startTextEdit($event, section, item)"
              >{{ valueFor(section, item) }}</p>
              <p v-else class="rendered-empty" @dblclick.stop="startTextEdit($event, section, item)">{{ textFieldDescription(item) }}</p>
            </template>
            <template
              v-if="editable && showGuides && !item.isLocked
                && item.fieldKind !== 'image'
                && selectedItemKey === styleKey(section, item)"
            >
              <button
                v-for="handleDirection in itemResizeHandles(section, item)"
                :key="handleDirection"
                type="button"
                class="item-resize-handle component-resize-handle"
                :class="[`item-resize-handle--${handleDirection}`, `component-resize-handle--${handleDirection}`]"
                :aria-label="`${item.name} ${handleDirection} 방향 크기 조절`"
                @pointerdown.stop="startItemResize($event, section, item, handleDirection)"
                @keydown="resizeItemByKeyboard($event, section, item, handleDirection)"
              ></button>
            </template>
          </article>
        </div>
      </div>
      <button
        v-if="editable && showGuides"
        class="section-resize-handle"
        type="button"
        :aria-label="`${section.name} 섹션 높이 조절`"
        :title="`${section.name} 섹션 높이 조절`"
        @pointerdown="startSectionResize($event, section)"
      >
      </button>
    </section>
  </div>
</template>
