export const SNAPSHOT_VERSION = 1;
export const RENDERER_KEY = "default-promo-renderer";
export const RENDERER_VERSION = 1;
export const SNAPSHOT_STORAGE_KEY = "promoVisualEditor.snapshot.v1";

export const DEFAULT_DESIGN_SPEC = Object.freeze({
  contractVersion: 1,
  specKey: "default",
  theme: {
    backgroundColor: "#f5f7fb",
    textColor: "#172033",
    accentColor: "#156b5b",
    fontFamily: "Inter, Pretendard, sans-serif",
  },
  responsive: {
    contentMaxWidth: 1120,
    mobileBreakpoint: 720,
  },
});

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createDefaultValue(item) {
  if (item?.fieldKind === "cta") {
    return { label: item.defaultValue || "", link: "", target: "_self" };
  }
  if (item?.fieldKind === "image") {
    return {
      source: item.image?.allowedSources?.[0] || "url",
      value: item.defaultValue || "",
      description: "",
      alt: "",
    };
  }
  return item?.defaultValue || "";
}

export function createSectionInputs(sections, previous = {}) {
  return Object.fromEntries((sections || []).map((section) => [
    section.sectionKey,
    Object.fromEntries((section.items || []).map((item) => [
      item.itemKey,
      previous?.[section.sectionKey]?.[item.itemKey] ?? createDefaultValue(item),
    ])),
  ]));
}

export function createSnapshot({ template, configRevision, sections, sectionInputs }) {
  return {
    snapshotVersion: SNAPSHOT_VERSION,
    renderer: {
      key: RENDERER_KEY,
      version: RENDERER_VERSION,
      buildId: `visual-editor-p1-v${RENDERER_VERSION}`,
    },
    content: {
      contractVersion: 1,
      formTemplate: {
        ...template,
        configRevision,
      },
      sectionSnapshot: cloneJson(sections),
      sectionInputs: cloneJson(sectionInputs),
      sectionOrder: sections.map((section) => section.sectionKey),
    },
    designSpec: cloneJson(DEFAULT_DESIGN_SPEC),
    assets: {
      contractVersion: 1,
      items: {},
    },
    createdAt: new Date().toISOString(),
  };
}
