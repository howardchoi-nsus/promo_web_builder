<script setup>
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import AiExecutionIndicator from "./AiExecutionIndicator.vue";

// Source: https://lottie.host/2fa87e8f-301c-4e0e-b553-c68da36dd4a3/Xkxf2s4TQI.lottie
const AI_PROCESSING_ANIMATION_URL = "/prototype/assets/ai-processing.lottie";

defineProps({
  stage: { type: String, required: true },
  message: { type: String, default: "" },
  execution: { type: Object, default: null },
});
</script>

<template>
  <section class="ai-composition-progress" role="status" aria-live="polite" aria-busy="true" :data-stage="stage">
    <DotLottieVue
      class="ai-composition-progress__animation"
      :src="AI_PROCESSING_ANIMATION_URL"
      autoplay
      loop
      aria-hidden="true"
    />
    <AiExecutionIndicator :message="message || 'AI가 요청을 수행하고 있습니다.'" :execution="execution" />
  </section>
</template>
