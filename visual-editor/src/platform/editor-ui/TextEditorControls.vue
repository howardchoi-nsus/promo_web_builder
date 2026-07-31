<script setup>
import { computed } from "vue";

const props = defineProps({
  item: { type: Object, default: null },
  itemStyle: { type: Object, default: () => ({}) },
  colorTokens: { type: Array, default: () => [] },
  fontFamilyTokens: { type: Array, default: () => [] },
  fontSizeTokens: { type: Array, default: () => [] },
  fontWeightTokens: { type: Array, default: () => [] },
  lineHeightTokens: { type: Array, default: () => [] },
  letterSpacingTokens: { type: Array, default: () => [] },
});

const emit = defineEmits([
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

function tokenPatch(property, rawProperty, tokenKey) {
  emit("patch-style", {
    [property]: tokenKey || undefined,
    ...(rawProperty ? { [rawProperty]: undefined } : {}),
  });
}

function toggleBold() {
  if (boldActive.value) {
    emit("patch-style", { fontWeightToken: undefined, fontWeight: 400 });
    return;
  }
  const token = props.fontWeightTokens.find((entry) => Number(entry.number) >= 700);
  emit("patch-style", token
    ? { fontWeightToken: token.key, fontWeight: undefined }
    : { fontWeightToken: undefined, fontWeight: 700 });
}
</script>

<template>
  <section v-if="available" class="text-editor-controls" aria-label="선택한 텍스트 편집">
    <div class="text-editor-controls__identity">
      <strong>{{ item.name || item.itemKey }}</strong>
      <small>Text · {{ item.itemKey }}</small>
    </div>

    <div class="text-editor-toolbar" role="toolbar" aria-label="텍스트 디자인">
      <label>
        <span>글꼴</span>
        <select
          :value="itemStyle.fontFamilyToken || ''"
          aria-label="폰트 패밀리 디자인 토큰"
          @change="tokenPatch('fontFamilyToken', 'fontFamily', $event.target.value)"
        >
          <option value="">기본</option>
          <option v-for="token in fontFamilyTokens" :key="token.key" :value="token.key">{{ token.label }}</option>
        </select>
      </label>
      <label>
        <span>크기</span>
        <select
          :value="itemStyle.fontSizeToken || ''"
          aria-label="폰트 크기 디자인 토큰"
          @change="tokenPatch('fontSizeToken', 'fontSize', $event.target.value)"
        >
          <option value="">기본</option>
          <option v-for="token in fontSizeTokens" :key="token.key" :value="token.key">{{ token.label }}</option>
        </select>
      </label>
      <label>
        <span>굵기</span>
        <select
          :value="itemStyle.fontWeightToken || ''"
          aria-label="폰트 굵기 디자인 토큰"
          @change="tokenPatch('fontWeightToken', 'fontWeight', $event.target.value)"
        >
          <option value="">기본</option>
          <option v-for="token in fontWeightTokens" :key="token.key" :value="token.key">{{ token.label }}</option>
        </select>
      </label>
      <div class="text-mark-controls" aria-label="텍스트 강조">
        <button type="button" :class="{ active: boldActive }" :aria-pressed="boldActive" aria-label="굵게" @click="toggleBold">B</button>
        <button
          type="button"
          :class="{ active: itemStyle.fontStyle === 'italic' }"
          :aria-pressed="itemStyle.fontStyle === 'italic'"
          aria-label="기울임"
          @click="emit('patch-style', { fontStyle: itemStyle.fontStyle === 'italic' ? undefined : 'italic' })"
        ><i>I</i></button>
        <button
          type="button"
          :class="{ active: itemStyle.textDecoration === 'underline' }"
          :aria-pressed="itemStyle.textDecoration === 'underline'"
          aria-label="밑줄"
          @click="emit('patch-style', { textDecoration: itemStyle.textDecoration === 'underline' ? undefined : 'underline' })"
        ><u>U</u></button>
      </div>
      <label>
        <span>색상</span>
        <select
          :value="itemStyle.colorToken || ''"
          aria-label="글자 색상 디자인 토큰"
          @change="tokenPatch('colorToken', 'color', $event.target.value)"
        >
          <option value="">기본</option>
          <option v-for="token in colorTokens" :key="token.key" :value="token.key">{{ token.label }}</option>
        </select>
      </label>
      <details class="text-editor-more">
        <summary>세부</summary>
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
    </div>

    <div class="section-anchor-toolbar" role="toolbar" aria-label="섹션 기준 텍스트 정렬">
      <div role="group" aria-label="가로 정렬">
        <button
          v-for="entry in [{ key: 'left', label: '좌' }, { key: 'center', label: '중앙' }, { key: 'right', label: '우' }]"
          :key="entry.key"
          type="button"
          :class="{ active: itemStyle.positionMode === 'anchored' && itemStyle.horizontalAnchor === entry.key }"
          :aria-pressed="itemStyle.positionMode === 'anchored' && itemStyle.horizontalAnchor === entry.key"
          :aria-label="`섹션 기준 가로 ${entry.label} 정렬`"
          @click="emit('set-anchor', 'horizontal', entry.key)"
        >{{ entry.label }}</button>
      </div>
      <div role="group" aria-label="세로 정렬">
        <button
          v-for="entry in [{ key: 'top', label: '상' }, { key: 'middle', label: '중앙' }, { key: 'bottom', label: '하' }]"
          :key="entry.key"
          type="button"
          :class="{ active: itemStyle.positionMode === 'anchored' && itemStyle.verticalAnchor === entry.key }"
          :aria-pressed="itemStyle.positionMode === 'anchored' && itemStyle.verticalAnchor === entry.key"
          :aria-label="`섹션 기준 세로 ${entry.label} 정렬`"
          @click="emit('set-anchor', 'vertical', entry.key)"
        >{{ entry.label }}</button>
      </div>
      <button
        type="button"
        :class="{ active: autoSizeActive }"
        :aria-pressed="autoSizeActive"
        @click="autoSizeActive ? emit('enable-fixed-size') : emit('enable-auto-size')"
      >자동 크기</button>
      <button type="button" @click="emit('reset-offset')">간격 초기화</button>
      <button type="button" @click="emit('restore-automatic-position')">자동 배치</button>
    </div>
  </section>
</template>
