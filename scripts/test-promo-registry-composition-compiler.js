const assert = require("node:assert/strict");
const { compileRegistryComposition } = require("../api/_promo-registry-composition-compiler");
const { contentHash, fetchPinnedResourceVersions } = require("../api/_promo-content-resources-store");

const resourceContent = { components: { legal: { fields: { content: "공통 약관 본문" } } } };
const resourceReference = {
  resourceId: "resource-1", resourceKey: "common-terms", resourceType: "terms",
  resourceVersionId: "resource-version-1", version: 1, locale: "ko-KR",
  contentHash: contentHash(resourceContent), sectionRole: "terms", required: true,
};
const layoutSnapshot = (content = {}) => ({
  contractVersion: 1,
  layoutMode: "free",
  sectionStyle: { backgroundColorToken: "--app-bg" },
  content,
  viewports: {
    desktop: { items: { title: { xPct: 10, yPx: 40, widthPct: 80, heightPx: 80, zIndex: 1 } }, visibility: { items: {} } },
    mobile: { items: { title: { xPct: 5, yPx: 20, widthPct: 90, heightPx: 70, zIndex: 1 } }, visibility: { items: {} } },
  },
});
const candidates = {
  shell: {
    shellVersionId: "shell-version-1", shellKey: "default", version: 1,
    fallbackTemplateId: "11111111-1111-4111-a111-111111111111", fallbackTemplateVersion: 4,
  },
  candidateFingerprint: "candidate-fingerprint",
  policyFingerprint: "policy-fingerprint",
  resourceFingerprint: "resource-fingerprint",
  tokenSets: [{
    tokenSetVersionId: "token-version-1",
    runtimeValues: {
      "--app-bg": "#fafafa", "--app-surface": "#ffffff", "--app-ink": "#101010",
      "--app-muted": "#555555", "--app-accent": "#ff3300", "--app-radius": "12px",
      "--app-shadow": "0 4px 16px #00000022", "--app-font-body": "Test Sans",
      "--app-font-size-heading": "48px",
    },
    selectableTokens: [
      { tokenKey: "--app-bg", semanticRole: "page-background" },
      { tokenKey: "--app-surface", semanticRole: "surface-color" },
      { tokenKey: "--app-ink", semanticRole: "text-color" },
      { tokenKey: "--app-muted", semanticRole: "muted-color" },
      { tokenKey: "--app-accent", semanticRole: "accent-color" },
      { tokenKey: "--app-radius", semanticRole: "radius" },
      { tokenKey: "--app-shadow", semanticRole: "shadow" },
      { tokenKey: "--app-font-body", semanticRole: "font-family" },
    ],
  }],
  motionPresets: [{
    presetVersionId: "motion-version-1",
    config: { className: "fade-up", durationToken: "--app-motion-duration-normal" },
  }],
  sections: [{
    sectionVersionId: "hero-version-1", sectionKey: "hero", sectionRole: "hero", version: 2,
    name: "Hero", description: "Hero Section", resolvedRequired: true, sortOrder: 10,
    compositionPolicy: {}, fixedPosition: null,
    aiDesign: {
      enabled: true,
      allowSectionBackground: true,
      imageTarget: "section-background",
      imageTargetItemKeys: [],
      imageAspectRatio: "4:3",
    },
    layoutPresets: [{ layoutKey: "hero-centered", layoutSnapshot: layoutSnapshot({ title: { fields: { subtitle: "프리셋 설명" } } }) }],
    components: [{
      componentInstanceId: "hero-title-instance", componentVersionId: "hero-title-version",
      componentKey: "title", itemKey: "title", name: "Title", fieldKind: "text", textType: "title",
      defaultValue: "기본 제목", isRequired: true, isLocked: false, styleSlots: [{ slotKey: "titleColor", semanticRole: "text-color" }],
      collection: { enabled: true, minItems: 1, maxItems: 2, layout: "grid", desktopColumns: 2, mobileColumns: 1, gapPct: 2, gapPx: 16 },
      fields: [
        { fieldKey: "text", name: "Text", fieldKind: "text", textType: "title", defaultValue: "기본 제목", isLocked: false },
        { fieldKey: "subtitle", name: "Subtitle", fieldKind: "text", textType: "remark", defaultValue: "기본 설명", isLocked: false, styleSlots: [{ slotKey: "subtitleColor", semanticRole: "muted-color" }] },
      ],
    }, {
      componentInstanceId: "hero-visual-instance", componentVersionId: "hero-visual-version",
      componentKey: "content-image", itemKey: "visual", name: "Key Visual", fieldKind: "image",
      defaultValue: { source: "url", value: "", alt: "Promotion visual" },
      isRequired: false, isLocked: false,
      instanceConfig: {
        assetRole: "hero-key-visual",
        assetPromptText: "Create one distinctive campaign focal motif inside a bounded Hero media component.",
      },
      fields: [{
        fieldKey: "image", name: "Image", fieldKind: "image", isLocked: false,
        image: { allowedSources: ["ai", "file", "url"], aspectRatio: "16:9" },
      }],
    }],
  }, {
    sectionVersionId: "terms-version-1", sectionKey: "terms", sectionRole: "terms", version: 1,
    name: "Terms", description: "Terms Section", resolvedRequired: true, sortOrder: 90,
    compositionPolicy: { contentLocked: true }, fixedPosition: null,
    aiDesign: { enabled: false }, resourceReferences: [resourceReference],
    layoutPresets: [{ layoutKey: "terms-default", layoutSnapshot: layoutSnapshot() }],
    components: [{
      componentInstanceId: "terms-instance", componentVersionId: "terms-version",
      componentKey: "legal", itemKey: "legal", name: "Legal", fieldKind: "text", textType: "multi",
      defaultValue: "기본 약관", isRequired: true, isLocked: true, lockedValue: "기본 약관", styleSlots: [{ slotKey: "termsColor", semanticRole: "muted-color" }],
      fields: [{ fieldKey: "content", name: "Content", fieldKind: "text", textType: "multi", defaultValue: "기본 약관", isLocked: true }],
    }],
  }],
};
const proposalSnapshot = {
  contractVersion: 3,
  snapshotType: "registry-composition-proposal",
  compositionMeta: {
    overviewFingerprint: "overview-fingerprint", promptTemplateVersionId: "prompt-version", model: "test-model",
  },
  compositionSpec: {
    shellVersionId: "shell-version-1",
    designTokenSetVersionId: "token-version-1",
    resourceReferences: [resourceReference],
    sections: [{
      sectionVersionId: "hero-version-1", visible: true, sortOrder: 10,
      layoutKey: "hero-centered", motionPresetVersionId: "motion-version-1", repeat: 2,
      resourceReferences: [],
      components: [{
        componentInstanceId: "hero-title-instance", visible: true, repeat: 2,
        contentBindings: [{ fieldKey: "text", sourceOverviewPath: "title" }],
      }, {
        componentInstanceId: "hero-visual-instance", visible: true, repeat: 1,
        contentBindings: [],
      }],
    }, {
      sectionVersionId: "terms-version-1", visible: true, sortOrder: 90,
      layoutKey: "terms-default", motionPresetVersionId: "", repeat: 1,
      resourceReferences: [resourceReference],
      components: [{ componentInstanceId: "terms-instance", visible: true, repeat: 1, contentBindings: [] }],
    }],
  },
  validation: { warnings: [] },
};

async function compile(candidateSet = candidates) {
  return compileRegistryComposition({
    sql: null,
    proposalSnapshot,
    candidates: candidateSet,
    overview: { title: "오버뷰 제목" },
    documentId: "document-1",
    proposalId: "proposal-1",
    documentRevision: 7,
    fetchPinnedResources: async () => new Map([[
      resourceReference.resourceVersionId,
      { ...resourceReference, content: resourceContent },
    ]]),
  });
}

(async () => {
  const snapshot = await compile();
  const repeated = await compile();
  assert.equal(snapshot.contractVersion, 3);
  assert.equal(snapshot.documentRevision, 7);
  assert.equal(snapshot.content.sectionSnapshot.length, 3);
  assert.deepEqual(snapshot.content.sectionOrder, repeated.content.sectionOrder);
  assert.deepEqual(snapshot.assets.requests, repeated.assets.requests);
  assert.equal(snapshot.compositionMeta.sourceTemplateId, candidates.shell.fallbackTemplateId);
  assert.equal(snapshot.content.formTemplate.designTokens.values["--app-bg"], "#fafafa");
  assert.deepEqual(snapshot.designSpec.theme, {
    backgroundColorToken: "--app-bg", surfaceColorToken: "--app-surface",
    textColorToken: "--app-ink", accentColorToken: "--app-accent",
    ctaColorToken: "--app-accent", radiusToken: "--app-radius",
    shadowToken: "--app-shadow", fontFamilyToken: "--app-font-body",
  });

  const heroId = snapshot.content.sectionOrder[0];
  const hero = snapshot.content.sectionSnapshot[0];
  const heroItemId = hero.items[0].id;
  assert.equal(hero.items.length, 3);
  assert.equal(hero.items[0].collection.collectionKey, "hero-title-instance");
  assert.equal(hero.items[1].collection.index, 1);
  assert.equal(snapshot.content.sectionInputs[heroId][heroItemId].fields.text, "오버뷰 제목");
  assert.equal(snapshot.content.sectionInputs[heroId][heroItemId].fields.subtitle, "프리셋 설명");
  assert.equal(snapshot.designSpec.itemStyles[`${heroId}.${heroItemId}`].xPct, 10);
  assert.equal(snapshot.designSpec.sectionStyles[heroId].backgroundColorToken, "--app-bg");
  assert.equal(snapshot.designSpec.sectionStyles[heroId].backgroundColor, undefined);
  assert.equal(snapshot.designSpec.itemStyles[`${heroId}.${heroItemId}`].colorToken, "--app-ink");
  assert.equal(snapshot.designSpec.itemStyles[`${heroId}.${heroItemId}`].fontFamilyToken, "--app-font-body");
  assert.equal(snapshot.designSpec.itemStyles[`${heroId}.${heroItemId}.subtitle`].colorToken, "--app-muted");
  assert.equal(snapshot.designSpec.itemStyles[`${heroId}.${hero.items[1].id}`].xPct, 51);
  assert.equal(snapshot.designSpec.responsiveLayouts.mobile.itemStyles[`${heroId}.${heroItemId}`].widthPct, 90);
  assert.equal(snapshot.motionSpec.sections[heroId].className, "fade-up");
  assert.equal(snapshot.assets.requests.length, 2);
  assert.ok(snapshot.assets.requests.every((request) => request.targetType === "section-key-visual"));
  assert.ok(snapshot.assets.requests.every((request) => !request.pageComponentInstanceId));

  const componentTargetCandidates = JSON.parse(JSON.stringify(candidates));
  componentTargetCandidates.sections[0].aiDesign = {
    enabled: true,
    allowSectionBackground: false,
    imageTarget: "item",
    imageTargetItemKeys: ["visual"],
    imageAspectRatio: "4:3",
  };
  const componentTargetSnapshot = await compile(componentTargetCandidates);
  assert.ok(componentTargetSnapshot.assets.requests.every((request) => request.targetType === "component-field-image"));
  assert.equal(componentTargetSnapshot.assets.requests[0].assetRole, "hero-key-visual");
  assert.match(componentTargetSnapshot.assets.requests[0].guidance, /bounded Hero media component/);

  const termsId = snapshot.content.sectionOrder[2];
  const terms = snapshot.content.sectionSnapshot[2];
  const termsItemId = terms.items[0].id;
  assert.equal(snapshot.content.sectionInputs[termsId][termsItemId], "공통 약관 본문");
  assert.equal(terms.items[0].lockedValue, "공통 약관 본문");
  assert.equal(snapshot.provenance[`${termsId}.${termsItemId}.content`].contentHash, resourceReference.contentHash);
  assert.equal(Object.hasOwn(snapshot.content.resourceReferences[0], "content"), false);
  assert.equal(snapshot.designSpec.itemStyles[`${termsId}.${termsItemId}`].colorToken, "--app-muted");

  const missingTokens = JSON.parse(JSON.stringify(candidates));
  delete missingTokens.tokenSets[0].runtimeValues["--app-shadow"];
  missingTokens.tokenSets[0].selectableTokens = missingTokens.tokenSets[0].selectableTokens
    .filter((token) => token.semanticRole !== "shadow");
  await assert.rejects(
    () => compile(missingTokens),
    (error) => error.code === "REQUIRED_DESIGN_TOKEN_MISSING"
      && error.missingTokenRoles.includes("shadow"),
  );

  const stalePinnedToken = JSON.parse(JSON.stringify(candidates));
  stalePinnedToken.tokenSets = [];
  await assert.rejects(
    () => compile(stalePinnedToken),
    (error) => error.code === "TOKEN_SET_VERSION_MISMATCH",
  );

  const validRows = [{
    resource_id: "resource-1", resource_key: "common-terms", resource_type: "terms",
    resource_name: "Common Terms", resource_status: "active",
    resource_version_id: "resource-version-1", locale: "ko-KR", version: 1, status: "active",
    content_json: resourceContent, content_hash: resourceReference.contentHash,
  }];
  const sql = async () => validRows;
  const pinned = await fetchPinnedResourceVersions(sql, [resourceReference]);
  assert.deepEqual(pinned.get("resource-version-1").content, resourceContent);
  await assert.rejects(
    () => fetchPinnedResourceVersions(async () => [{ ...validRows[0], status: "inactive" }], [resourceReference]),
    (error) => error.code === "PINNED_RESOURCE_VERSION_NOT_ACTIVE",
  );
  await assert.rejects(
    () => fetchPinnedResourceVersions(async () => [{ ...validRows[0], content_json: { text: "tampered" } }], [resourceReference]),
    (error) => error.code === "PINNED_RESOURCE_HASH_MISMATCH",
  );
  console.log("Promo Registry Composition Compiler tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
