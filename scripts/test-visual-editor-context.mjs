import assert from "node:assert/strict";
import { createEditorContext } from "../visual-editor/src/editor-context.mjs";

const admin = createEditorContext("admin-layout");
assert.equal(admin.surface, "template-default");
assert.equal(admin.engineKey, "promo-live-preview");
assert.equal(admin.title, "템플릿 기본 레이아웃 편집기");
assert.equal(admin.presentation, "modal");
assert.equal(admin.saveTarget, "template-default-layout");
assert.equal(admin.capabilities.canMutate, true);
assert.equal(admin.isBuilderWorkspace, true);
assert.equal(admin.capabilities.canSaveTemplateLayout, true);
assert.equal(admin.capabilities.canSavePromoOverrides, false);
assert.equal(admin.capabilities.canRunSectionAi, false);
assert.equal(admin.capabilities.canRunMultiLayoutAi, true);
assert.equal(admin.capabilities.canOpenWebOutput, true);
assert.equal(admin.capabilities.isEmbedded, true);

const promo = createEditorContext("wizard-layout", "create-promo");
assert.equal(promo.surface, "promo-instance");
assert.equal(promo.engineKey, admin.engineKey);
assert.equal(promo.isBuilderWorkspace, true);
assert.equal(promo.capabilities.canSaveTemplateLayout, false);
assert.equal(promo.capabilities.canSavePromoOverrides, true);
assert.equal(promo.capabilities.canRunSectionAi, true);
assert.equal(promo.capabilities.isEmbedded, true);
assert.equal(promo.presentation, "inline");
assert.equal(promo.saveTargetLabel, "현재 프로모션");

const sectionPreset = createEditorContext("section-preset");
assert.equal(sectionPreset.surface, "section-preset");
assert.equal(sectionPreset.engineKey, admin.engineKey);
assert.equal(sectionPreset.isSectionPreset, true);
assert.equal(sectionPreset.isBuilderWorkspace, true);
assert.equal(sectionPreset.capabilities.canSaveSectionPreset, true);
assert.equal(sectionPreset.capabilities.canSaveTemplateLayout, false);
assert.equal(sectionPreset.capabilities.canManageComponents, false);
assert.equal(sectionPreset.capabilities.isEmbedded, true);
assert.equal(sectionPreset.title, "레이아웃 프리셋 편집기");

const activeSectionPreset = createEditorContext("section-preset", "", { entityStatus: "active" });
assert.equal(activeSectionPreset.readOnly, true);
assert.equal(activeSectionPreset.capabilities.canMutate, false);
assert.equal(activeSectionPreset.capabilities.canSaveSectionPreset, false);

const inactiveAdmin = createEditorContext("admin-layout", "", { entityStatus: "inactive" });
assert.equal(inactiveAdmin.readOnly, true);
assert.equal(inactiveAdmin.capabilities.canManageComponents, false);

const aiDocument = createEditorContext("ai-document", "", { entityStatus: "ready" });
assert.equal(aiDocument.presentation, "full-page");
assert.equal(aiDocument.saveTarget, "ai-document-revision");
assert.equal(aiDocument.capabilities.canSaveAiDocument, true);

const standalone = createEditorContext("editor");
assert.equal(standalone.isBuilderWorkspace, false);
assert.equal(standalone.capabilities.canOpenWebOutput, true);

console.log("Visual Editor context test passed");
