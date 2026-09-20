<script setup>
import { computed } from "vue";
import PromoPageRenderer from "../PromoPageRenderer.vue";
import { normalizeReadonlyRendererProps } from "./readonly-renderer-contract.mjs";

const props = defineProps({
  snapshot: { type: Object, default: null },
  content: { type: Object, default: null },
  designSpec: { type: Object, default: null },
  assets: { type: Object, default: null },
  motionSpec: { type: Object, default: null },
  viewportOverride: { type: String, default: "" },
});

const rendererProps = computed(() => normalizeReadonlyRendererProps(props));
</script>

<template>
  <PromoPageRenderer
    class="promo-readonly-renderer"
    :content="rendererProps.content"
    :design-spec="rendererProps.designSpec"
    :assets="rendererProps.assets"
    :motion-spec="rendererProps.motionSpec"
    :viewport-override="rendererProps.viewportOverride"
    :editable="false"
    :show-guides="false"
    :outline-mode="false"
  />
</template>
