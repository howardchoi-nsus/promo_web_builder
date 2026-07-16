export const SNAPSHOT_VERSION = 1;
export const RENDERER_KEY = "default-promo-renderer";
export const RENDERER_VERSION = 1;
export const SNAPSHOT_STORAGE_KEY = "promoVisualEditor.snapshot.v1";

export const DESIGN_COLOR_TOKENS = Object.freeze([
  { key: "canvas-light", name: "Canvas Light", value: "#f5f7fb", textColor: "#172033" },
  { key: "surface-light", name: "Surface Light", value: "#ffffff", textColor: "#172033" },
  { key: "canvas-dark", name: "Canvas Dark", value: "#0b0f17", textColor: "#f5f7fb" },
  { key: "surface-dark", name: "Surface Dark", value: "#171d29", textColor: "#f5f7fb" },
  { key: "brand-forest", name: "Brand Forest", value: "#123e36", textColor: "#ffffff" },
  { key: "brand-red", name: "Brand Red", value: "#8f1d2c", textColor: "#ffffff" },
]);

export const DEFAULT_DESIGN_SPEC = Object.freeze({
  contractVersion: 1,
  specKey: "default",
  theme: {
    backgroundColor: "#f5f7fb",
    backgroundImage: "",
    backgroundImageName: "",
    textColor: "#172033",
    accentColor: "#156b5b",
    fontFamily: "Inter, Pretendard, sans-serif",
  },
  responsive: {
    contentMaxWidth: 1440,
    contentMinWidth: 1140,
    mobileBreakpoint: 720,
  },
  itemStyles: {},
  sectionStyles: {},
});

export const DEFAULT_LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

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

export function createSnapshot({ template, configRevision, sections, sectionInputs, designSpec = DEFAULT_DESIGN_SPEC }) {
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
    designSpec: cloneJson(designSpec),
    assets: {
      contractVersion: 1,
      items: {},
    },
    createdAt: new Date().toISOString(),
  };
}
