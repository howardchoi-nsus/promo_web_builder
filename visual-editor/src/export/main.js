import { createApp } from "vue";
import PromoPageRenderer from "../PromoPageRenderer.vue";

const root = document.querySelector("#promo-export-root");
const payload = document.querySelector("#promo-export-snapshot");

if (root && payload) {
  try {
    const snapshot = JSON.parse(payload.textContent || "{}");
    createApp(PromoPageRenderer, {
      content: snapshot.content || {},
      designSpec: snapshot.designSpec || {},
      assets: snapshot.assets || {},
      motionSpec: snapshot.motionSpec || { sections: {}, items: {} },
      editable: false,
      showGuides: false,
      outlineMode: false,
    }).mount(root);
  } catch (error) {
    root.innerHTML = '<p class="promo-export-error" role="alert">프로모션 출력을 표시할 수 없습니다.</p>';
    console.error("Promo export bootstrap failed", error);
  }
}
