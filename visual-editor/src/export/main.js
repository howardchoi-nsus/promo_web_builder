import { createApp } from "vue";
import PromoReadonlyRenderer from "../runtime/PromoReadonlyRenderer.vue";

const root = document.querySelector("#promo-export-root");
const payload = document.querySelector("#promo-export-snapshot");

if (root && payload) {
  try {
    const snapshot = JSON.parse(payload.textContent || "{}");
    createApp(PromoReadonlyRenderer, { snapshot }).mount(root);
  } catch (error) {
    root.innerHTML = '<p class="promo-export-error" role="alert">프로모션 출력을 표시할 수 없습니다.</p>';
    console.error("Promo export bootstrap failed", error);
  }
}
