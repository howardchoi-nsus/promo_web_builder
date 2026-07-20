const assert = require("node:assert/strict");
const {
  normalizeLayoutIdentity,
  sameLayoutIdentity,
  hasLayoutOverrides,
  resolveLayoutCache,
  sameSectionOrder,
  resolveSectionOrderCache,
} = require("../prototype/create-promo-layout-cache.js");

function identity(overrides = {}) {
  return {
    contractVersion: 2,
    templateId: "template-v1",
    templateKey: "default-preview",
    templateVersion: 1,
    layoutId: "layout-v1",
    layoutRevision: 2,
    configRevision: "config-v1",
    rendererKey: "default-promo-renderer",
    rendererVersion: 1,
    ...overrides,
  };
}

const baseLayout = {
  contractVersion: 1,
  theme: { backgroundColor: "#fff", textColor: "#111", accentColor: "#156b5b" },
  responsive: { contentMaxWidth: 1200 },
  sectionStyles: { hero: { minHeight: 420 } },
  itemStyles: { "hero.title": { fontSize: 36 } },
};
const editedLayout = JSON.parse(JSON.stringify(baseLayout));
editedLayout.itemStyles["hero.title"].fontSize = 44;

assert.deepEqual(normalizeLayoutIdentity(identity()), identity());
assert.equal(normalizeLayoutIdentity({ contractVersion: 1 }), null);
assert.equal(sameLayoutIdentity(identity(), identity()), true);
assert.equal(sameLayoutIdentity(identity(), identity({ templateId: "template-v2" })), false);
assert.equal(sameLayoutIdentity(identity(), identity({ templateVersion: 2 })), false);
assert.equal(sameLayoutIdentity(identity(), identity({ layoutRevision: 3 })), false);
assert.equal(sameLayoutIdentity(identity(), identity({ rendererVersion: 2 })), false);

const restored = resolveLayoutCache({
  savedLayout: { layoutIdentity: identity(), resolvedLayout: editedLayout },
  incomingIdentity: identity(),
  defaultLayout: baseLayout,
});
assert.equal(restored.cacheStatus, "restored");
assert.equal(restored.resolvedLayout.itemStyles["hero.title"].fontSize, 44);

const revisionCollision = resolveLayoutCache({
  savedLayout: { layoutIdentity: identity(), resolvedLayout: editedLayout },
  incomingIdentity: identity({ templateId: "template-v2", templateVersion: 2, layoutId: "layout-v2" }),
  defaultLayout: baseLayout,
});
assert.equal(revisionCollision.cacheStatus, "identity_mismatch");
assert.equal(revisionCollision.resolvedLayout.itemStyles["hero.title"].fontSize, 36);

const legacy = resolveLayoutCache({
  savedLayout: { layoutRevision: 2, resolvedLayout: editedLayout },
  incomingIdentity: identity(),
  defaultLayout: baseLayout,
});
assert.equal(legacy.cacheStatus, "legacy_invalidated");
assert.equal(legacy.resolvedLayout.itemStyles["hero.title"].fontSize, 36);

const fresh = resolveLayoutCache({ incomingIdentity: identity(), defaultLayout: baseLayout });
assert.equal(fresh.cacheStatus, "fresh");
assert.equal(hasLayoutOverrides(baseLayout, editedLayout), true);
const appearanceOnly = JSON.parse(JSON.stringify(baseLayout));
appearanceOnly.theme = {
  ...appearanceOnly.theme,
  backgroundColor: "#000",
  textColor: "#fff",
  ctaColor: "#f00",
  ctaShape: "round",
  ctaVariant: "ghost",
};
assert.equal(hasLayoutOverrides(baseLayout, appearanceOnly), false);

const defaultOrder = ["header", "hero", "content", "footer"];
const customOrder = ["header", "content", "hero", "footer"];
assert.equal(sameSectionOrder(defaultOrder, [...defaultOrder]), true);
assert.equal(sameSectionOrder(defaultOrder, customOrder), false);

const restoredOrder = resolveSectionOrderCache({
  savedOrder: { layoutIdentity: identity(), resolvedOrder: customOrder },
  incomingIdentity: identity(),
  defaultOrder,
});
assert.equal(restoredOrder.cacheStatus, "restored");
assert.deepEqual(restoredOrder.resolvedOrder, customOrder);

const mismatchedOrder = resolveSectionOrderCache({
  savedOrder: { layoutIdentity: identity(), resolvedOrder: customOrder },
  incomingIdentity: identity({ templateVersion: 2, layoutRevision: 3 }),
  defaultOrder,
});
assert.equal(mismatchedOrder.cacheStatus, "identity_mismatch");
assert.deepEqual(mismatchedOrder.resolvedOrder, defaultOrder);

const legacyOrder = resolveSectionOrderCache({
  savedOrder: customOrder,
  incomingIdentity: identity(),
  defaultOrder,
});
assert.equal(legacyOrder.cacheStatus, "legacy_invalidated");
assert.deepEqual(legacyOrder.resolvedOrder, defaultOrder);

const changedDefinitions = resolveSectionOrderCache({
  savedOrder: { layoutIdentity: identity(), resolvedOrder: ["hero", "removed", "header"] },
  incomingIdentity: identity(),
  defaultOrder: ["header", "hero", "new-section", "footer"],
});
assert.deepEqual(changedDefinitions.resolvedOrder, ["hero", "header", "new-section", "footer"]);

console.log("Create Promo layout cache test passed");
