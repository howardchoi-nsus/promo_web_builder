const EMPTY_CONTENT = Object.freeze({
  contractVersion: 2,
  formTemplate: Object.freeze({ designTokens: Object.freeze({ values: Object.freeze({}) }) }),
  sectionSnapshot: Object.freeze([]),
  sectionInputs: Object.freeze({}),
  sectionOrder: Object.freeze([]),
  resourceReferences: Object.freeze([]),
});

const EMPTY_DESIGN_SPEC = Object.freeze({
  contractVersion: 1,
  theme: Object.freeze({}),
  responsive: Object.freeze({ contentMaxWidth: 1280, contentMinWidth: 0, mobileBreakpoint: 720 }),
  itemStyles: Object.freeze({}),
  sectionStyles: Object.freeze({}),
  visibility: Object.freeze({ items: Object.freeze({}), fields: Object.freeze({}) }),
  responsiveLayouts: Object.freeze({ mobile: Object.freeze({ itemStyles: Object.freeze({}), visibility: Object.freeze({ items: Object.freeze({}) }) }) }),
});

const EMPTY_ASSETS = Object.freeze({ contractVersion: 1, items: Object.freeze({}) });
const EMPTY_MOTION = Object.freeze({ contractVersion: 2, sections: Object.freeze({}), items: Object.freeze({}) });

function object(value, fallback) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
}

export function normalizeReadonlyRendererProps(candidate = {}) {
  const source = object(candidate, {});
  const snapshot = object(source.snapshot, {});
  return {
    content: object(source.content || snapshot.content, EMPTY_CONTENT),
    designSpec: object(source.designSpec || snapshot.designSpec, EMPTY_DESIGN_SPEC),
    assets: object(source.assets || snapshot.assets, EMPTY_ASSETS),
    motionSpec: object(source.motionSpec || snapshot.motionSpec, EMPTY_MOTION),
    viewportOverride: ["desktop", "tablet", "mobile"].includes(source.viewportOverride)
      ? source.viewportOverride
      : "",
  };
}

export function readonlyRendererDefaults() {
  return normalizeReadonlyRendererProps();
}
