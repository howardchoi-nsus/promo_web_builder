import * as VueRuntime from "vue/dist/vue.esm-bundler.js";
import { resolveAdminShell } from "./shell-contract.mjs";
import TemplateLayoutManager from "./components/TemplateLayoutManager.vue";
import { templateLayoutService } from "./services/template-layout-service.mjs";
import DesignTokenManager from "./components/DesignTokenManager.vue";
import { designTokenService } from "./services/design-token-service.mjs";

resolveAdminShell(document);
globalThis.Vue = VueRuntime;
globalThis.PromoAdminTemplateLayout = Object.freeze({
  service: templateLayoutService,
  component: TemplateLayoutManager,
});
globalThis.PromoAdminDesignTokens = Object.freeze({
  service: designTokenService,
  component: DesignTokenManager,
});

await import("../../prototype/app.js");
