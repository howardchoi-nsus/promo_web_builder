import { EditorCommandType } from "./editor-commands.mjs";
import { cloneEditorState, createEditorDocument } from "./editor-state.mjs";

function withoutUndefined(record = {}) {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined));
}

function patchRecord(previous = {}, patch = {}) {
  const next = { ...previous };
  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined) delete next[key];
    else next[key] = value;
  });
  return next;
}

function setNestedContent(content, sectionKey, itemKey, value) {
  return {
    ...content,
    [sectionKey]: {
      ...(content?.[sectionKey] || {}),
      [itemKey]: value,
    },
  };
}

export function reduceEditorCommand(currentState, command) {
  const state = cloneEditorState(currentState);
  const layout = state.document.layout || {};
  const content = state.document.content || {};
  const payload = command?.payload || {};

  switch (command?.type) {
    case EditorCommandType.CONTENT_VALUE_SET:
      if (!payload.sectionKey || !payload.itemKey) return { ok: false, state: currentState, error: "Content target is required." };
      state.document.content = setNestedContent(
        content,
        payload.sectionKey,
        payload.itemKey,
        payload.value,
      );
      break;
    case EditorCommandType.ITEM_STYLE_PATCH: {
      if (!payload.styleKey) return { ok: false, state: currentState, error: "Item style key is required." };
      const previous = layout.itemStyles?.[payload.styleKey] || {};
      state.document.layout = {
        ...layout,
        itemStyles: {
          ...(layout.itemStyles || {}),
          [payload.styleKey]: patchRecord(previous, payload.patch),
        },
      };
      break;
    }
    case EditorCommandType.ITEM_STYLE_REPLACE: {
      if (!payload.styleKey) return { ok: false, state: currentState, error: "Item style key is required." };
      state.document.layout = {
        ...layout,
        itemStyles: {
          ...(layout.itemStyles || {}),
          [payload.styleKey]: withoutUndefined(payload.style || {}),
        },
      };
      break;
    }
    case EditorCommandType.ITEM_STYLE_REMOVE: {
      if (!payload.styleKey) return { ok: false, state: currentState, error: "Item style key is required." };
      const itemStyles = { ...(layout.itemStyles || {}) };
      delete itemStyles[payload.styleKey];
      state.document.layout = { ...layout, itemStyles };
      break;
    }
    case EditorCommandType.SECTION_STYLE_PATCH: {
      if (!payload.sectionKey) return { ok: false, state: currentState, error: "Section key is required." };
      const previous = layout.sectionStyles?.[payload.sectionKey] || {};
      state.document.layout = {
        ...layout,
        sectionStyles: {
          ...(layout.sectionStyles || {}),
          [payload.sectionKey]: patchRecord(previous, payload.patch),
        },
      };
      break;
    }
    case EditorCommandType.SECTION_STYLE_REPLACE: {
      if (!payload.sectionKey) return { ok: false, state: currentState, error: "Section key is required." };
      state.document.layout = {
        ...layout,
        sectionStyles: {
          ...(layout.sectionStyles || {}),
          [payload.sectionKey]: withoutUndefined(payload.style || {}),
        },
      };
      break;
    }
    case EditorCommandType.SECTION_STYLE_REMOVE: {
      if (!payload.sectionKey) return { ok: false, state: currentState, error: "Section key is required." };
      const sectionStyles = { ...(layout.sectionStyles || {}) };
      delete sectionStyles[payload.sectionKey];
      state.document.layout = { ...layout, sectionStyles };
      break;
    }
    case EditorCommandType.THEME_STYLE_PATCH:
      state.document.layout = {
        ...layout,
        theme: withoutUndefined({
          ...(layout.theme || {}),
          ...(payload.patch || {}),
        }),
      };
      break;
    case EditorCommandType.VISIBILITY_SET: {
      const targetType = payload.targetType === "field" ? "fields" : "items";
      if (!payload.targetKey) return { ok: false, state: currentState, error: "Visibility target is required." };
      state.document.layout = {
        ...layout,
        visibility: {
          ...(layout.visibility || {}),
          [targetType]: {
            ...(layout.visibility?.[targetType] || {}),
            [payload.targetKey]: payload.visible !== false,
          },
        },
      };
      break;
    }
    case EditorCommandType.LAYOUT_REPLACE:
      state.document = createEditorDocument({
        ...state.document,
        layout: payload.layout || {},
      });
      break;
    case EditorCommandType.DOCUMENT_PATCH:
      if (!payload.layout || !payload.content) {
        return { ok: false, state: currentState, error: "Document layout and content are required." };
      }
      state.document = createEditorDocument({
        ...state.document,
        layout: payload.layout,
        content: payload.content,
      });
      break;
    default:
      return { ok: false, state: currentState, error: `Unsupported editor command: ${command?.type || "unknown"}` };
  }

  state.revision = Number(currentState.revision || 0) + 1;
  state.lastCommand = command;
  state.dirty = true;
  return { ok: true, state };
}
