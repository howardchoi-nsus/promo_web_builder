import * as VueRuntime from "vue/dist/vue.esm-bundler.js";
import { resolveAdminShell } from "./shell-contract.mjs";
import TemplateLayoutManager from "./components/TemplateLayoutManager.vue";
import { templateLayoutService } from "./services/template-layout-service.mjs";
import DesignTokenManager from "./components/DesignTokenManager.vue";
import { designTokenService } from "./services/design-token-service.mjs";
import { promptTemplateGroupService } from "./services/prompt-template-group-service.mjs";
import SectionLayoutPresetManager from "./components/SectionLayoutPresetManager.vue";
import { sectionLayoutPresetService } from "./services/section-layout-preset-service.mjs";
import ComponentGenerationWorkspace from "./components/ComponentGenerationWorkspace.vue";

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
globalThis.PromoAdminPromptGroups = promptTemplateGroupService;
globalThis.PromoAdminSectionLayouts = Object.freeze({
  service: sectionLayoutPresetService,
  component: SectionLayoutPresetManager,
});
globalThis.PromoAdminComponentGeneration = Object.freeze({
  component: ComponentGenerationWorkspace,
});

await import("../../prototype/app.js");
