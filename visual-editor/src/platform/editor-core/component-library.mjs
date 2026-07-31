export const COMPONENT_LIBRARY_CATEGORIES = Object.freeze([
  { key: "layout", label: "Layout" },
  { key: "text", label: "Text" },
  { key: "media", label: "Media" },
  { key: "action", label: "Action" },
  { key: "promo", label: "Promo" },
]);

export const COMPONENT_ICON_KEYS = Object.freeze([
  "component-generic",
  "heading",
  "text",
  "image",
  "button",
  "logo",
  "badge",
  "divider",
  "spacer",
  "layout",
]);

const CATEGORY_KEYS = new Set(COMPONENT_LIBRARY_CATEGORIES.map(({ key }) => key));
const ICON_KEYS = new Set(COMPONENT_ICON_KEYS);

export function resolveComponentLibraryPresentation(component = {}) {
  const source = component.libraryPresentation || {};
  const fieldKind = component.activeVersion?.fieldKind || component.fieldKind || "";
  const categoryFallback = fieldKind === "image"
    ? "media"
    : fieldKind === "cta"
      ? "action"
      : fieldKind === "text"
        ? "text"
        : "promo";
  const iconFallback = fieldKind === "image"
    ? "image"
    : fieldKind === "cta"
      ? "button"
      : component.activeVersion?.textType === "title" || component.textType === "title"
        ? "heading"
        : fieldKind === "text"
          ? "text"
          : "component-generic";
  return {
    category: CATEGORY_KEYS.has(source.category) ? source.category : categoryFallback,
    iconKey: ICON_KEYS.has(source.iconKey) ? source.iconKey : iconFallback,
    keywords: Array.isArray(source.keywords) ? source.keywords.filter(Boolean) : [],
    displayOrder: Number.isFinite(Number(source.displayOrder)) ? Number(source.displayOrder) : 100,
    isFeatured: source.isFeatured === true,
  };
}

export function componentLibrarySearchText(component = {}) {
  const presentation = resolveComponentLibraryPresentation(component);
  return [
    component.name,
    component.componentKey,
    component.description,
    component.activeVersion?.fieldKind,
    presentation.category,
    ...presentation.keywords,
  ].map((value) => String(value || "").toLowerCase()).join(" ");
}
