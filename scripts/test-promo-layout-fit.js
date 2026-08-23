const assert = require("node:assert/strict");
const {
  applyLayoutFitRecommendations,
  evaluateLayoutFit,
  recentLayoutSelectionsFromSnapshot,
  recentLayoutSelectionsFromSnapshots,
  visualLength,
} = require("../api/_promo-layout-fit");

const layouts = [
  {
    layoutKey: "hero-compact",
    isDefault: true,
    selectionMetadata: {
      headlineCapacity: "short", bodyCapacity: "short", widthProfile: "compact",
      contentComplexity: "low", purposeTags: ["short-copy"], selectionWeight: 1,
    },
  },
  {
    layoutKey: "hero-balanced",
    selectionMetadata: {
      headlineCapacity: "medium", bodyCapacity: "medium", widthProfile: "balanced",
      contentComplexity: "medium", purposeTags: ["general", "offer"], selectionWeight: 1,
    },
  },
  {
    layoutKey: "hero-center-wide",
    selectionMetadata: {
      headlineCapacity: "long", bodyCapacity: "medium", widthProfile: "wide",
      contentComplexity: "medium", mobileStrategy: "stack",
      purposeTags: ["long-headline", "brand-intro"], selectionWeight: 1.1,
    },
  },
  {
    layoutKey: "hero-right",
    selectionMetadata: {
      headlineCapacity: "medium", bodyCapacity: "long", widthProfile: "balanced",
      contentComplexity: "high", mobileStrategy: "media-after-copy",
      purposeTags: ["long-copy", "right-cta"], selectionWeight: 1,
    },
  },
];

assert(visualLength("긴 제목") > visualLength("abc"));

const shortFit = evaluateLayoutFit({
  layouts, sectionRole: "hero", defaultLayoutKey: "hero-compact",
  overview: { title: "Sale", leadText: "Today only" },
});
assert.equal(shortFit.recommendedLayoutKey, "hero-compact");

const balancedFit = evaluateLayoutFit({
  layouts, sectionRole: "hero", defaultLayoutKey: "hero-compact",
  overview: {
    title: "Upgrade your everyday experience with our summer offer",
    leadText: "A practical promotion with enough detail for customers.",
    mainOffer: "Save 20%", ctaLabel: "View offer",
  },
});
assert.equal(balancedFit.recommendedLayoutKey, "hero-balanced");

const brandFit = evaluateLayoutFit({
  layouts, sectionRole: "hero", defaultLayoutKey: "hero-compact",
  overview: {
    title: "A new expression of the brand, designed for every extraordinary moment ahead",
    leadText: "Discover the new identity.", campaignTone: "brand introduction",
    mainOffer: "Brand story", ctaLabel: "Discover",
  },
});
assert.equal(brandFit.recommendedLayoutKey, "hero-center-wide");

const longBodyFit = evaluateLayoutFit({
  layouts, sectionRole: "hero", defaultLayoutKey: "hero-compact",
  overview: {
    title: "Member offer",
    leadText: "This extended promotional explanation contains qualification details, benefit conditions, redemption guidance, account requirements, timing, and the information customers need before they choose the highlighted action on this campaign page.",
    mainOffer: "Multiple member benefits with detailed conditions", ctaLabel: "Apply now", audience: "Members",
  },
});
assert.equal(longBodyFit.recommendedLayoutKey, "hero-right");

const candidates = {
  sections: [{
    sectionVersionId: "hero-v1",
    defaultLayoutKey: "hero-compact",
    layoutSelectionLocked: false,
    layoutFit: brandFit,
  }],
};
const repaired = applyLayoutFitRecommendations({
  sections: [{ sectionVersionId: "hero-v1", layoutKey: "hero-compact" }],
  warnings: [],
}, candidates);
assert.equal(repaired.result.sections[0].layoutKey, "hero-center-wide");
assert.equal(repaired.repairs.length, 1);

const locked = applyLayoutFitRecommendations({
  sections: [{ sectionVersionId: "hero-v1", layoutKey: "hero-compact" }],
}, {
  sections: [{ ...candidates.sections[0], layoutSelectionLocked: true }],
});
assert.equal(locked.result.sections[0].layoutKey, "hero-compact");
assert.equal(locked.repairs.length, 0);

const diversifiedLayouts = layouts.slice(0, 3).map((layout) => ({
  ...layout,
  selectionMetadata: { ...layout.selectionMetadata, avoidImmediateRepeat: true },
}));
const firstDiversified = evaluateLayoutFit({
  layouts: diversifiedLayouts,
  sectionRole: "hero",
  defaultLayoutKey: "hero-compact",
  overview: { title: "Sale", leadText: "Today only" },
  recentLayoutKeys: ["hero-compact"],
});
assert.notEqual(firstDiversified.recommendedLayoutKey, "hero-compact");
assert.equal(firstDiversified.repeatAvoided, true);
const secondDiversified = evaluateLayoutFit({
  layouts: diversifiedLayouts,
  sectionRole: "hero",
  defaultLayoutKey: "hero-compact",
  overview: { title: "Sale", leadText: "Today only" },
  recentLayoutKeys: [firstDiversified.recommendedLayoutKey, "hero-compact"],
});
assert.equal(secondDiversified.recommendedLayoutKey, "hero-center-wide");

const repeatBlockedCandidates = {
  sections: [{
    sectionVersionId: "hero-v1",
    defaultLayoutKey: "hero-compact",
    layoutSelectionLocked: false,
    layoutPresets: diversifiedLayouts,
    layoutFit: firstDiversified,
  }],
};
const repeatBlocked = applyLayoutFitRecommendations({
  sections: [{ sectionVersionId: "hero-v1", layoutKey: "hero-compact" }],
  warnings: [],
}, repeatBlockedCandidates);
assert.equal(repeatBlocked.result.sections[0].layoutKey, firstDiversified.recommendedLayoutKey);
assert.equal(repeatBlocked.repairs.length, 1);

assert.deepEqual(recentLayoutSelectionsFromSnapshot({
  compositionMeta: { layoutSelectionHistory: { registryHero: ["hero-center-wide", "hero-compact"] } },
  content: {
    sectionSnapshot: [{ sourceSectionKey: "registryHero", selectedLayoutKey: "hero-right" }],
  },
}), {
  registryHero: ["hero-right", "hero-center-wide", "hero-compact"],
});
assert.deepEqual(recentLayoutSelectionsFromSnapshots([{
  content: { sectionSnapshot: [{ sourceSectionKey: "registryHero", selectedLayoutKey: "hero-right" }] },
}, {
  content: { sectionSnapshot: [{ sourceSectionKey: "registryHero", selectedLayoutKey: "hero-compact" }] },
}]), {
  registryHero: ["hero-right", "hero-compact"],
});
const staleHistoryIgnored = evaluateLayoutFit({
  layouts: diversifiedLayouts,
  sectionRole: "hero",
  defaultLayoutKey: "hero-compact",
  overview: { title: "Sale", leadText: "Today only" },
  recentLayoutKeys: ["retired-layout", "hero-compact"],
});
assert.deepEqual(staleHistoryIgnored.recentLayoutKeys, ["hero-compact"]);

console.log("Promotion layout fit scoring tests passed.");
