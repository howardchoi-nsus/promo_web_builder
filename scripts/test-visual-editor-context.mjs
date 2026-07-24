import assert from "node:assert/strict";
import { createEditorContext } from "../visual-editor/src/editor-context.mjs";

const admin = createEditorContext("admin-layout");
assert.equal(admin.surface, "template-default");
assert.equal(admin.isBuilderWorkspace, true);
assert.equal(admin.capabilities.canSaveTemplateLayout, true);
assert.equal(admin.capabilities.canSavePromoOverrides, false);
assert.equal(admin.capabilities.canRunSectionAi, false);

const promo = createEditorContext("wizard-layout", "create-promo");
assert.equal(promo.surface, "promo-instance");
assert.equal(promo.isBuilderWorkspace, true);
assert.equal(promo.capabilities.canSaveTemplateLayout, false);
assert.equal(promo.capabilities.canSavePromoOverrides, true);
assert.equal(promo.capabilities.canRunSectionAi, true);
assert.equal(promo.capabilities.isEmbedded, true);

const standalone = createEditorContext("editor");
assert.equal(standalone.isBuilderWorkspace, false);
assert.equal(standalone.capabilities.canOpenWebOutput, true);

console.log("Visual Editor context test passed");
