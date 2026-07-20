<script setup>
import { computed } from "vue";
import { DEFAULT_LOREM_IPSUM } from "./contracts";
import { normalizeCtaUrl } from "./editor-utils.mjs";

const props = defineProps({
  content: { type: Object, required: true },
  designSpec: { type: Object, required: true },
  assets: { type: Object, required: true },
  editable: { type: Boolean, default: false },
  showGuides: { type: Boolean, default: true },
  selectedItemKey: { type: String, default: "" },
});
const emit = defineEmits(["select-item", "update-item-style", "update-renderer-item-style", "update-item-content", "update-section-style"]);

const orderedSections = computed(() => {
  const definitions = props.content?.sectionSnapshot || [];
  const order = props.content?.sectionOrder || [];
  const positions = new Map(order.map((key, index) => [key, index]));
  return [...definitions].sort((a, b) => (
    (positions.get(a.sectionKey) ?? a.sortOrder ?? 0) - (positions.get(b.sectionKey) ?? b.sortOrder ?? 0)
  ));
});

function valueFor(section, item) {
  return props.content?.sectionInputs?.[section.sectionKey]?.[item.itemKey];
}

function imageUrl(value) {
  const candidate = String(value?.value || "").trim();
  return /^(https?:\/\/|\/api\/)/i.test(candidate) ? candidate : "";
}

function isLegacyAiImageValue(value) {
  const candidate = String(value?.value || "").trim();
  return value?.source === "ai" || candidate.startsWith("/api/promo-section-design-image?");
}

function renderedItems(section) {
  return (section.items || []).filter((item) => (
    item.fieldKind !== "image" || !isLegacyAiImageValue(valueFor(section, item))
  ));
}

function sectionBackgroundUrl(section) {
  const configured = String(sectionStyle(section).backgroundImage || "").trim();
  const legacyAiImage = (section.items || [])
    .filter((item) => item.fieldKind === "image")
    .map((item) => valueFor(section, item))
    .find(isLegacyAiImageValue);
  const candidate = configured || String(legacyAiImage?.value || "").trim();
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

function styleKey(section, item) {
  return `${section.sectionKey}.${item.itemKey}`;
}

function itemStyle(section, item) {
  return props.designSpec?.itemStyles?.[styleKey(section, item)] || {};
}

function sectionStyle(section) {
  return props.designSpec?.sectionStyles?.[section.sectionKey] || {};
}

function estimatedItemHeight(item) {
  if (item.fieldKind === "image") return 250;
  if (item.fieldKind === "cta") return 64;
  return 86;
}

function defaultSectionHeight(section) {
  return Math.max(180, (section.items || []).reduce((height, item) => height + estimatedItemHeight(item), 0) + 52);
}

function defaultItemPosition(section, item) {
  const items = section.items || [];
  const index = Math.max(0, items.findIndex((candidate) => candidate.itemKey === item.itemKey));
  const precedingHeight = items.slice(0, index).reduce((height, candidate) => height + estimatedItemHeight(candidate), 0);
  const sectionHeight = sectionStyle(section).minHeight || defaultSectionHeight(section);
  const canvasHeight = Math.max(50, sectionHeight - 76);
  return {
    xPct: 0,
    yPct: canvasHeight ? (precedingHeight / canvasHeight) * 100 : 0,
  };
}

function inlineSectionStyle(section) {
  const style = sectionStyle(section);
  const canvasHeight = style.minHeight || defaultSectionHeight(section);
  const backgroundImage = sectionBackgroundUrl(section);
  return {
    height: `${Math.max(50, canvasHeight)}px`,
    backgroundImage: backgroundImage ? `url(${JSON.stringify(backgroundImage)})` : undefined,
    backgroundSize: backgroundImage ? (style.backgroundSize || "contain") : undefined,
    backgroundPosition: backgroundImage ? (style.backgroundPosition || "right center") : undefined,
    backgroundRepeat: backgroundImage ? (style.backgroundRepeat || "no-repeat") : undefined,
  };
}

function inlineCanvasStyle(section) {
  const height = sectionStyle(section).minHeight || defaultSectionHeight(section);
  return {
    height: `${Math.max(0, height - 76)}px`,
  };
}

function inlineItemStyle(section, item) {
  const style = itemStyle(section, item);
  const position = style.positionMode === "free" ? style : defaultItemPosition(section, item);
  const result = {
    left: `${position.xPct || 0}%`,
    top: style.yPx !== undefined ? `${style.yPx}px` : `${position.yPct || 0}%`,
    zIndex: style.zIndex || 2,
    color: style.color,
    "--item-color": style.color,
    fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
    "--item-font-size": style.fontSize ? `${style.fontSize}px` : undefined,
    fontWeight: style.fontWeight,
    "--item-font-weight": style.fontWeight,
    textAlign: style.textAlign,
  };
  return result;
}

function selectRendererItem(section, item) {
  if (!props.editable) return;
  emit("select-item", section, item);
}

function startDrag(event, section, item) {
  if (!props.editable || item.isLocked || event.button !== 0 || event.currentTarget.classList.contains("is-editing")) return;
  const target = event.currentTarget;
  const container = target.closest(".rendered-items");
  if (!container) return;
  event.preventDefault();
  selectRendererItem(section, item);
  target.setPointerCapture(event.pointerId);
  target.classList.add("is-dragging");

  const rect = container.getBoundingClientRect();
  const itemRect = target.getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const startLeft = itemRect.left - rect.left;
  const startTop = itemRect.top - rect.top;
  let nextX = startLeft;
  let nextY = startTop;
  let animationFrame = 0;

  const move = (moveEvent) => {
    nextX = Math.min(Math.max(0, rect.width - target.offsetWidth), Math.max(0, startLeft + moveEvent.clientX - startX));
    nextY = Math.min(Math.max(0, rect.height - target.offsetHeight), Math.max(0, startTop + moveEvent.clientY - startY));
    if (animationFrame) return;
    animationFrame = requestAnimationFrame(() => {
      animationFrame = 0;
      target.style.left = `${nextX}px`;
      target.style.top = `${nextY}px`;
    });
  };
  const end = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    const xPct = rect.width ? (nextX / rect.width) * 100 : 0;
    emit("update-item-style", { positionMode: "free", xPct, yPx: nextY });
    target.classList.remove("is-dragging");
    target.removeEventListener("pointermove", move);
    target.removeEventListener("pointerup", end);
    target.removeEventListener("pointercancel", end);
  };
  target.addEventListener("pointermove", move);
  target.addEventListener("pointerup", end);
  target.addEventListener("pointercancel", end);
}

function startTextEdit(event, section, item) {
  if (!props.editable || item.isLocked || item.fieldKind !== "text") return;
  event.preventDefault();
  event.stopPropagation();
  selectRendererItem(section, item);
  const article = event.currentTarget;
  const textNode = article.querySelector(".rendered-text, .rendered-empty");
  if (!textNode) return;

  article.classList.add("is-editing");
  textNode.classList.remove("rendered-empty");
  textNode.classList.add("rendered-text");
  textNode.contentEditable = "true";
  if (!String(valueFor(section, item) || "").trim()) {
    textNode.textContent = DEFAULT_LOREM_IPSUM;
  }
  textNode.focus();

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(textNode);
  selection.removeAllRanges();
  selection.addRange(range);

  const finish = () => {
    const nextValue = textNode.innerText.replace(/\r\n?/g, "\n").trim() || DEFAULT_LOREM_IPSUM;
    emit("update-item-content", section, item, nextValue);
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
  const verticalPadding = canvasRect ? Math.max(0, startHeight - canvasRect.height) : 76;
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
    :class="{ 'is-editor-preview': editable, 'has-editor-guides': editable && showGuides }"
    :style="{
      '--promo-bg': designSpec.theme.backgroundColor,
      '--promo-ink': designSpec.theme.textColor,
      '--promo-accent': designSpec.theme.accentColor,
      '--promo-cta': designSpec.theme.ctaColor || designSpec.theme.accentColor,
      '--promo-cta-bg': designSpec.theme.ctaVariant === 'ghost' ? 'transparent' : (designSpec.theme.ctaColor || designSpec.theme.accentColor),
      '--promo-cta-ink': designSpec.theme.ctaVariant === 'ghost' ? (designSpec.theme.ctaColor || designSpec.theme.accentColor) : '#ffffff',
      '--promo-cta-radius': designSpec.theme.ctaShape === 'round' ? '999px' : '2px',
      '--promo-font': designSpec.theme.fontFamily,
      '--promo-width': `${designSpec.responsive.contentMaxWidth}px`,
      '--promo-min-width': `${designSpec.responsive.contentMinWidth || 0}px`,
    }"
  >
    <div v-if="editable && showGuides" class="content-width-guide" aria-hidden="true"></div>
    <section
      v-for="section in orderedSections"
      :key="section.sectionKey"
      class="rendered-section"
      :class="`rendered-section--${section.sectionKey}`"
      :data-section-key="section.sectionKey"
      :style="inlineSectionStyle(section)"
    >
      <div class="rendered-section__inner">
        <div class="rendered-items" :style="inlineCanvasStyle(section)">
          <article
            v-for="item in renderedItems(section)"
            :key="item.itemKey"
            class="rendered-item"
            :class="[
              `rendered-item--${item.fieldKind || 'text'}`,
              {
                'is-editable': editable && !item.isLocked,
                'is-selected': editable && selectedItemKey === styleKey(section, item),
                'is-free-positioned': true,
              },
            ]"
            :data-item-key="item.itemKey"
            :data-style-key="styleKey(section, item)"
            :style="inlineItemStyle(section, item)"
            @click.stop="selectRendererItem(section, item)"
            @pointerdown="startDrag($event, section, item)"
            @dblclick="startTextEdit($event, section, item)"
          >
            <template v-if="item.fieldKind === 'cta'">
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
              <figure class="rendered-image">
                <img v-if="imageUrl(valueFor(section, item))" :src="imageUrl(valueFor(section, item))" :alt="valueFor(section, item)?.alt || item.name" />
                <div v-else class="rendered-image__placeholder">
                  <span>{{ item.name }}</span>
                  <small>{{ valueFor(section, item)?.value || '이미지 준비 중' }}</small>
                </div>
                <figcaption v-if="item.image?.descriptionEnabled && valueFor(section, item)?.description">{{ valueFor(section, item).description }}</figcaption>
              </figure>
            </template>

            <template v-else>
              <p v-if="hasContent(valueFor(section, item))" class="rendered-text">{{ valueFor(section, item) }}</p>
              <p v-else class="rendered-empty">{{ item.name }}</p>
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
