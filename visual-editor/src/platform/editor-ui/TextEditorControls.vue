<script setup>
import { computed } from "vue";

const props = defineProps({
  item: { type: Object, default: null },
  itemStyle: { type: Object, default: () => ({}) },
  canUndo: { type: Boolean, default: false },
  canRedo: { type: Boolean, default: false },
  colorTokens: { type: Array, default: () => [] },
  gradientTokens: { type: Array, default: () => [] },
  backgroundColorTokens: { type: Array, default: () => [] },
  textStyleTokens: { type: Array, default: () => [] },
  fontFamilyTokens: { type: Array, default: () => [] },
  fontSizeTokens: { type: Array, default: () => [] },
  fontWeightTokens: { type: Array, default: () => [] },
  lineHeightTokens: { type: Array, default: () => [] },
  letterSpacingTokens: { type: Array, default: () => [] },
});

const emit = defineEmits([
  "undo",
  "redo",
  "patch-style",
  "set-anchor",
  "restore-automatic-position",
  "reset-offset",
  "enable-auto-size",
  "enable-fixed-size",
]);

const available = computed(() => (
  props.item
  && props.item.fieldKind !== "image"
  && !props.item.isLocked
));
const boldActive = computed(() => {
  if (Number(props.itemStyle.fontWeight) >= 700) return true;
  const token = props.fontWeightTokens.find((entry) => entry.key === props.itemStyle.fontWeightToken);
  return Number(token?.number) >= 700;
});
const autoSizeActive = computed(() => (
  props.itemStyle.heightMode === "auto" || props.itemStyle.widthMode === "fit-content"
));
const selectedTextFill = computed(() => {
  if (props.itemStyle.textGradientToken) {
    return props.gradientTokens.find((entry) => entry.key === props.itemStyle.textGradientToken) || null;
  }
  return props.colorTokens.find((entry) => entry.key === props.itemStyle.colorToken) || null;
});
const selectedBackgroundColor = computed(() => (
  props.backgroundColorTokens.find((entry) => entry.key === props.itemStyle.textBackgroundToken) || null
));

function tokenPatch(property, rawProperty, tokenKey, clearTextStyle = true) {
  emit("patch-style", {
    [property]: tokenKey || undefined,
    ...(rawProperty ? { [rawProperty]: undefined } : {}),
    ...(clearTextStyle ? { textStyleToken: undefined } : {}),
  });
}

function applyTextStyle(tokenKey) {
  const token = props.textStyleTokens.find((entry) => entry.key === tokenKey);
  if (!token) {
    emit("patch-style", { textStyleToken: undefined });
    return;
  }
  emit("patch-style", { ...token.patch, textStyleToken: token.key });
}

function toggleBold() {
  if (boldActive.value) {
    const token = props.fontWeightTokens
      .filter((entry) => Number(entry.number) > 0 && Number(entry.number) < 700)
      .sort((a, b) => Math.abs(Number(a.number) - 400) - Math.abs(Number(b.number) - 400))[0];
    emit("patch-style", token
      ? { textStyleToken: undefined, fontWeightToken: token.key, fontWeight: undefined }
      : { textStyleToken: undefined, fontWeightToken: undefined, fontWeight: 400 });
    return;
  }
  const token = props.fontWeightTokens
    .filter((entry) => Number(entry.number) >= 700)
    .sort((a, b) => Math.abs(Number(a.number) - 700) - Math.abs(Number(b.number) - 700))[0];
  emit("patch-style", token
    ? { textStyleToken: undefined, fontWeightToken: token.key, fontWeight: undefined }
    : { textStyleToken: undefined, fontWeightToken: undefined, fontWeight: 700 });
}

function applyTextFill(type, tokenKey) {
  emit("patch-style", type === "gradient"
    ? { textGradientToken: tokenKey, colorToken: undefined, color: undefined }
    : { colorToken: tokenKey || undefined, color: undefined, textGradientToken: undefined });
}

function toggleList(type) {
  emit("patch-style", { listType: props.itemStyle.listType === type ? undefined : type });
}
</script>

<template>
  <section v-if="available" class="text-editor-controls" aria-label="선택한 텍스트 편집">
    <div class="text-editor-toolbar" role="toolbar" aria-label="텍스트 디자인">
      <div class="text-toolbar-group text-history-controls" aria-label="편집 기록">
        <button type="button" :disabled="!canUndo" title="되돌리기" aria-label="되돌리기" @click="emit('undo')">
          <i class="fa-solid fa-arrow-rotate-left" aria-hidden="true"></i>
        </button>
        <button type="button" :disabled="!canRedo" title="복구하기" aria-label="복구하기" @click="emit('redo')">
          <i class="fa-solid fa-arrow-rotate-right" aria-hidden="true"></i>
        </button>
      </div>

      <div class="text-toolbar-group text-token-controls">
        <label class="text-toolbar-select text-toolbar-select--style">
          <span class="visually-hidden">텍스트 스타일</span>
          <select
            :value="itemStyle.textStyleToken || ''"
            aria-label="텍스트 스타일 디자인 토큰"
            title="텍스트 스타일"
            @change="applyTextStyle($event.target.value)"
          >
            <option value="">사용자 지정</option>
            <option v-for="token in textStyleTokens" :key="token.key" :value="token.key">{{ token.label }}</option>
          </select>
        </label>
        <label class="text-toolbar-select">
          <span class="visually-hidden">글꼴</span>
          <select
            :value="itemStyle.fontFamilyToken || ''"
            aria-label="글꼴 디자인 토큰"
            title="글꼴"
            @change="tokenPatch('fontFamilyToken', 'fontFamily', $event.target.value)"
          >
            <option value="">기본 글꼴</option>
            <option v-for="token in fontFamilyTokens" :key="token.key" :value="token.key">{{ token.label }}</option>
          </select>
        </label>
        <label class="text-toolbar-select text-toolbar-select--size">
          <span class="visually-hidden">글자 크기</span>
          <select
            :value="itemStyle.fontSizeToken || ''"
            aria-label="글자 크기 디자인 토큰"
            title="글자 크기"
            @change="tokenPatch('fontSizeToken', 'fontSize', $event.target.value)"
          >
            <option value="">기본 크기</option>
            <option v-for="token in fontSizeTokens" :key="token.key" :value="token.key">{{ token.label }} · {{ token.value }}</option>
          </select>
        </label>
      </div>

      <div class="text-toolbar-group text-mark-controls" aria-label="텍스트 강조">
        <button type="button" :class="{ active: boldActive }" :aria-pressed="boldActive" title="굵게" aria-label="굵게" @click="toggleBold">
          <i class="fa-solid fa-bold" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          :class="{ active: itemStyle.fontStyle === 'italic' }"
          :aria-pressed="itemStyle.fontStyle === 'italic'"
          title="기울임"
          aria-label="기울임"
          @click="emit('patch-style', { textStyleToken: undefined, fontStyle: itemStyle.fontStyle === 'italic' ? undefined : 'italic' })"
        ><i class="fa-solid fa-italic" aria-hidden="true"></i></button>
      </div>

      <div class="text-toolbar-group text-color-controls" aria-label="텍스트 색상">
        <details class="text-color-menu">
          <summary title="폰트 컬러" aria-label="폰트 컬러">
            <i class="fa-solid fa-font" aria-hidden="true"></i>
            <span
              class="text-color-indicator"
              :style="{ background: selectedTextFill?.value || 'currentColor' }"
              aria-hidden="true"
            ></span>
          </summary>
          <div class="text-token-palette" role="group" aria-label="폰트 컬러 디자인 토큰">
            <button type="button" class="text-token-palette__default" :class="{ active: !selectedTextFill }" @click="applyTextFill('color', '')">기본</button>
            <button
              v-for="token in colorTokens"
              :key="`color-${token.key}`"
              type="button"
              class="text-token-swatch"
              :class="{ active: itemStyle.colorToken === token.key && !itemStyle.textGradientToken }"
              :title="token.label"
              :aria-label="`폰트 컬러 ${token.label}`"
              :aria-pressed="itemStyle.colorToken === token.key && !itemStyle.textGradientToken"
              @click="applyTextFill('color', token.key)"
            ><i :style="{ background: token.value }" aria-hidden="true"></i></button>
            <button
              v-for="token in gradientTokens"
              :key="`gradient-${token.key}`"
              type="button"
              class="text-token-swatch text-token-swatch--gradient"
              :class="{ active: itemStyle.textGradientToken === token.key }"
              :title="token.label"
              :aria-label="`폰트 그라데이션 ${token.label}`"
              :aria-pressed="itemStyle.textGradientToken === token.key"
              @click="applyTextFill('gradient', token.key)"
            ><i :style="{ background: token.value }" aria-hidden="true"></i></button>
          </div>
        </details>

        <details class="text-color-menu">
          <summary title="폰트 배경" aria-label="폰트 배경">
            <i class="fa-solid fa-highlighter" aria-hidden="true"></i>
            <span
              class="text-color-indicator"
              :style="{ background: selectedBackgroundColor?.value || 'transparent' }"
              aria-hidden="true"
            ></span>
          </summary>
          <div class="text-token-palette" role="group" aria-label="폰트 배경 시스템 컬러">
            <button type="button" class="text-token-palette__default" :class="{ active: !itemStyle.textBackgroundToken }" @click="tokenPatch('textBackgroundToken', 'textBackground', '', false)">없음</button>
            <button
              v-for="token in backgroundColorTokens"
              :key="`background-${token.key}`"
              type="button"
              class="text-token-swatch"
              :class="{ active: itemStyle.textBackgroundToken === token.key }"
              :title="token.label"
              :aria-label="`폰트 배경 ${token.label}`"
              :aria-pressed="itemStyle.textBackgroundToken === token.key"
              @click="tokenPatch('textBackgroundToken', 'textBackground', token.key, false)"
            ><i :style="{ background: token.value }" aria-hidden="true"></i></button>
          </div>
        </details>
      </div>

      <div class="text-toolbar-group text-list-controls" aria-label="텍스트 목록">
        <button
          type="button"
          :class="{ active: itemStyle.listType === 'bullet' }"
          :aria-pressed="itemStyle.listType === 'bullet'"
          title="불렛 리스트"
          aria-label="불렛 리스트"
          @click="toggleList('bullet')"
        ><i class="fa-solid fa-list-ul" aria-hidden="true"></i></button>
        <button
          type="button"
          :class="{ active: itemStyle.listType === 'number' }"
          :aria-pressed="itemStyle.listType === 'number'"
          title="넘버 리스트"
          aria-label="넘버 리스트"
          @click="toggleList('number')"
        ><i class="fa-solid fa-list-ol" aria-hidden="true"></i></button>
      </div>

      <details class="text-editor-more">
        <summary title="고급 텍스트 설정" aria-label="고급 텍스트 설정"><i class="fa-solid fa-ellipsis" aria-hidden="true"></i></summary>
        <label>
          <span>행간</span>
          <select
            :value="itemStyle.lineHeightToken || ''"
            @change="tokenPatch('lineHeightToken', 'lineHeight', $event.target.value)"
          >
            <option value="">기본</option>
            <option v-for="token in lineHeightTokens" :key="token.key" :value="token.key">{{ token.label }}</option>
          </select>
        </label>
        <label>
          <span>자간</span>
          <select
            :value="itemStyle.letterSpacingToken || ''"
            @change="tokenPatch('letterSpacingToken', 'letterSpacing', $event.target.value)"
          >
            <option value="">기본</option>
            <option v-for="token in letterSpacingTokens" :key="token.key" :value="token.key">{{ token.label }}</option>
          </select>
        </label>
      </details>

      <div class="section-anchor-toolbar" role="group" aria-label="섹션 기준 텍스트 정렬">
      <div role="group" aria-label="가로 정렬">
        <button
          v-for="entry in [
            { key: 'left', label: '좌', icon: 'fa-align-left' },
            { key: 'center', label: '중앙', icon: 'fa-align-center' },
            { key: 'right', label: '우', icon: 'fa-align-right' },
          ]"
          :key="entry.key"
          type="button"
          :class="{ active: itemStyle.positionMode === 'anchored' && itemStyle.horizontalAnchor === entry.key }"
          :aria-pressed="itemStyle.positionMode === 'anchored' && itemStyle.horizontalAnchor === entry.key"
          :aria-label="`섹션 기준 가로 ${entry.label} 정렬`"
          :title="`가로 ${entry.label} 정렬`"
          @click="emit('set-anchor', 'horizontal', entry.key)"
        ><i class="fa-solid" :class="entry.icon" aria-hidden="true"></i></button>
      </div>
      <div role="group" aria-label="세로 정렬">
        <button
          v-for="entry in [
            { key: 'top', label: '상', icon: 'fa-arrow-up' },
            { key: 'middle', label: '중앙', icon: 'fa-arrows-up-down' },
            { key: 'bottom', label: '하', icon: 'fa-arrow-down' },
          ]"
          :key="entry.key"
          type="button"
          :class="{ active: itemStyle.positionMode === 'anchored' && itemStyle.verticalAnchor === entry.key }"
          :aria-pressed="itemStyle.positionMode === 'anchored' && itemStyle.verticalAnchor === entry.key"
          :aria-label="`섹션 기준 세로 ${entry.label} 정렬`"
          :title="`세로 ${entry.label} 정렬`"
          @click="emit('set-anchor', 'vertical', entry.key)"
        ><i class="fa-solid" :class="entry.icon" aria-hidden="true"></i></button>
      </div>
      <button
        type="button"
        :class="{ active: autoSizeActive }"
        :aria-pressed="autoSizeActive"
        title="자동 크기"
        aria-label="자동 크기"
        @click="autoSizeActive ? emit('enable-fixed-size') : emit('enable-auto-size')"
      ><i class="fa-solid fa-up-right-and-down-left-from-center" aria-hidden="true"></i></button>
      <button type="button" title="간격 초기화" aria-label="간격 초기화" @click="emit('reset-offset')"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i></button>
      <button type="button" title="자동 배치" aria-label="자동 배치" @click="emit('restore-automatic-position')"><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i></button>
      </div>
    </div>
  </section>
</template>
