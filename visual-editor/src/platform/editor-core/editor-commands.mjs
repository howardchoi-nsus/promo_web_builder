export const EditorCommandType = Object.freeze({
  CONTENT_VALUE_SET: "CONTENT_VALUE_SET",
  ITEM_STYLE_PATCH: "ITEM_STYLE_PATCH",
  ITEM_STYLE_REPLACE: "ITEM_STYLE_REPLACE",
  ITEM_STYLE_REMOVE: "ITEM_STYLE_REMOVE",
  SECTION_STYLE_PATCH: "SECTION_STYLE_PATCH",
  SECTION_STYLE_REPLACE: "SECTION_STYLE_REPLACE",
  SECTION_STYLE_REMOVE: "SECTION_STYLE_REMOVE",
  THEME_STYLE_PATCH: "THEME_STYLE_PATCH",
  LAYOUT_REPLACE: "LAYOUT_REPLACE",
});

export function editorCommand(type, payload = {}, meta = {}) {
  return {
    id: String(meta.id || `${type}:${Date.now()}:${Math.random().toString(16).slice(2)}`),
    type,
    payload,
    source: String(meta.source || "ui"),
    label: String(meta.label || type),
    timestamp: Number(meta.timestamp || Date.now()),
  };
}
