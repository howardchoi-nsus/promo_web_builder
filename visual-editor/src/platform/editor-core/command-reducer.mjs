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

function insertAt(items, item, index) {
  const next = [...items];
  const targetIndex = Number.isInteger(index)
    ? Math.max(0, Math.min(index, next.length))
    : next.length;
  next.splice(targetIndex, 0, item);
  return next;
}

function reorderedByKeys(items, orderedKeys, keyName) {
  if (!Array.isArray(orderedKeys) || orderedKeys.length !== items.length) return null;
  const byKey = new Map(items.map((item) => [item?.[keyName], item]));
  if (byKey.size !== items.length || orderedKeys.some((key) => !byKey.has(key))) return null;
  if (new Set(orderedKeys).size !== items.length) return null;
  return orderedKeys.map((key) => byKey.get(key));
}

function removeStyleKeys(layout, prefix) {
  const itemStyles = Object.fromEntries(Object.entries(layout.itemStyles || {}).filter(
    ([key]) => key !== prefix && !key.startsWith(`${prefix}.`),
  ));
  const visibility = {
    ...(layout.visibility || {}),
    items: Object.fromEntries(Object.entries(layout.visibility?.items || {}).filter(
      ([key]) => key !== prefix && !key.startsWith(`${prefix}.`),
    )),
    fields: Object.fromEntries(Object.entries(layout.visibility?.fields || {}).filter(
      ([key]) => key !== prefix && !key.startsWith(`${prefix}.`),
    )),
  };
  const motionSpec = layout.motionSpec && typeof layout.motionSpec === "object" ? {
    ...layout.motionSpec,
    sections: Object.fromEntries(Object.entries(layout.motionSpec.sections || {}).filter(([key]) => key !== prefix)),
    items: Object.fromEntries(Object.entries(layout.motionSpec.items || {}).filter(
      ([key]) => key !== prefix && !key.startsWith(`${prefix}.`),
    )),
  } : layout.motionSpec;
  return { ...layout, itemStyles, visibility, ...(motionSpec ? { motionSpec } : {}) };
}

function moveStyleKeys(layout, previousPrefix, nextPrefix) {
  const itemStyles = {};
  Object.entries(layout.itemStyles || {}).forEach(([key, value]) => {
    const nextKey = key === previousPrefix
      ? nextPrefix
      : key.startsWith(`${previousPrefix}.`)
        ? `${nextPrefix}${key.slice(previousPrefix.length)}`
        : key;
    itemStyles[nextKey] = value;
  });
  const moveVisibility = (record = {}) => Object.fromEntries(Object.entries(record).map(([key, value]) => {
    const nextKey = key === previousPrefix
      ? nextPrefix
      : key.startsWith(`${previousPrefix}.`)
        ? `${nextPrefix}${key.slice(previousPrefix.length)}`
        : key;
    return [nextKey, value];
  }));
  const moveMotionItems = (record = {}) => Object.fromEntries(Object.entries(record).map(([key, value]) => {
    const nextKey = key === previousPrefix
      ? nextPrefix
      : key.startsWith(`${previousPrefix}.`)
        ? `${nextPrefix}${key.slice(previousPrefix.length)}`
        : key;
    return [nextKey, value];
  }));
  return {
    ...layout,
    itemStyles,
    visibility: {
      ...(layout.visibility || {}),
      items: moveVisibility(layout.visibility?.items),
      fields: moveVisibility(layout.visibility?.fields),
    },
    ...(layout.motionSpec ? {
      motionSpec: {
        ...layout.motionSpec,
        items: moveMotionItems(layout.motionSpec.items),
      },
    } : {}),
  };
}

export function reduceEditorCommand(currentState, command) {
  const state = cloneEditorState(currentState);
  const layout = state.document.layout || {};
  const content = state.document.content || {};
  const sections = Array.isArray(state.document.sections) ? state.document.sections : [];
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
    case EditorCommandType.RESPONSIVE_ITEM_STYLE_PATCH: {
      if (payload.viewport !== "mobile" || !payload.styleKey) {
        return { ok: false, state: currentState, error: "Responsive mobile item style target is required." };
      }
      const mobile = layout.responsiveLayouts?.mobile || {};
      const previous = mobile.itemStyles?.[payload.styleKey] || {};
      state.document.layout = {
        ...layout,
        responsiveLayouts: {
          ...(layout.responsiveLayouts || {}),
          mobile: {
            ...mobile,
            itemStyles: {
              ...(mobile.itemStyles || {}),
              [payload.styleKey]: patchRecord(previous, payload.patch),
            },
          },
        },
      };
      break;
    }
    case EditorCommandType.RESPONSIVE_ITEM_STYLE_REPLACE: {
      if (payload.viewport !== "mobile" || !payload.styleKey) {
        return { ok: false, state: currentState, error: "Responsive mobile item style target is required." };
      }
      const mobile = layout.responsiveLayouts?.mobile || {};
      state.document.layout = {
        ...layout,
        responsiveLayouts: {
          ...(layout.responsiveLayouts || {}),
          mobile: {
            ...mobile,
            itemStyles: {
              ...(mobile.itemStyles || {}),
              [payload.styleKey]: withoutUndefined(payload.style || {}),
            },
          },
        },
      };
      break;
    }
    case EditorCommandType.RESPONSIVE_ITEM_STYLE_REMOVE: {
      if (payload.viewport !== "mobile" || !payload.styleKey) {
        return { ok: false, state: currentState, error: "Responsive mobile item style target is required." };
      }
      const mobile = layout.responsiveLayouts?.mobile || {};
      const itemStyles = { ...(mobile.itemStyles || {}) };
      delete itemStyles[payload.styleKey];
      state.document.layout = {
        ...layout,
        responsiveLayouts: {
          ...(layout.responsiveLayouts || {}),
          mobile: { ...mobile, itemStyles },
        },
      };
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
    case EditorCommandType.LAYOUT_COLLISION_REFLOW: {
      const itemPatches = payload.itemPatches && typeof payload.itemPatches === "object" ? payload.itemPatches : {};
      const sectionPatches = payload.sectionPatches && typeof payload.sectionPatches === "object" ? payload.sectionPatches : {};
      if (!Object.keys(itemPatches).length) return { ok: false, state: currentState, error: "Collision reflow patches are required." };
      const patchStyles = (styles = {}) => {
        const next = { ...styles };
        Object.entries(itemPatches).forEach(([key, patch]) => {
          next[key] = patchRecord(next[key] || {}, patch);
        });
        return next;
      };
      const nextSectionStyles = { ...(layout.sectionStyles || {}) };
      Object.entries(sectionPatches).forEach(([key, patch]) => {
        nextSectionStyles[key] = patchRecord(nextSectionStyles[key] || {}, patch);
      });
      if (payload.viewport === "mobile") {
        const mobile = layout.responsiveLayouts?.mobile || {};
        state.document.layout = {
          ...layout,
          sectionStyles: nextSectionStyles,
          responsiveLayouts: {
            ...(layout.responsiveLayouts || {}),
            mobile: { ...mobile, itemStyles: patchStyles(mobile.itemStyles) },
          },
        };
      } else {
        state.document.layout = { ...layout, sectionStyles: nextSectionStyles, itemStyles: patchStyles(layout.itemStyles) };
      }
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
    case EditorCommandType.SECTION_INSTANCE_CREATE: {
      const section = payload.section && typeof payload.section === "object"
        ? JSON.parse(JSON.stringify(payload.section))
        : null;
      if (!section?.sectionKey) {
        return { ok: false, state: currentState, error: "Section instance is required." };
      }
      if (sections.some((candidate) => candidate.sectionKey === section.sectionKey)) {
        return { ok: false, state: currentState, error: "Section key must be unique." };
      }
      section.items = Array.isArray(section.items) ? section.items : [];
      state.document.sections = insertAt(sections, section, payload.index);
      state.document.content = {
        ...content,
        [section.sectionKey]: payload.content && typeof payload.content === "object"
          ? JSON.parse(JSON.stringify(payload.content))
          : {},
      };
      if (payload.layoutPatch && typeof payload.layoutPatch === "object") {
        state.document.layout = {
          ...layout,
          sectionStyles: {
            ...(layout.sectionStyles || {}),
            ...(payload.layoutPatch.sectionStyles || {}),
          },
          itemStyles: {
            ...(layout.itemStyles || {}),
            ...(payload.layoutPatch.itemStyles || {}),
          },
          visibility: {
            ...(layout.visibility || {}),
            items: {
              ...(layout.visibility?.items || {}),
              ...(payload.layoutPatch.visibility?.items || {}),
            },
          },
          responsiveLayouts: {
            ...(layout.responsiveLayouts || {}),
            mobile: {
              ...(layout.responsiveLayouts?.mobile || {}),
              ...(payload.layoutPatch.responsiveLayouts?.mobile || {}),
              itemStyles: {
                ...(layout.responsiveLayouts?.mobile?.itemStyles || {}),
                ...(payload.layoutPatch.responsiveLayouts?.mobile?.itemStyles || {}),
              },
              visibility: {
                ...(layout.responsiveLayouts?.mobile?.visibility || {}),
                items: {
                  ...(layout.responsiveLayouts?.mobile?.visibility?.items || {}),
                  ...(payload.layoutPatch.responsiveLayouts?.mobile?.visibility?.items || {}),
                },
              },
            },
          },
        };
      }
      break;
    }
    case EditorCommandType.SECTION_INSTANCE_REMOVE: {
      const section = sections.find((candidate) => candidate.sectionKey === payload.sectionKey);
      if (!section) return { ok: false, state: currentState, error: "Section instance was not found." };
      if (!payload.force && (section.isRequired || section.fixedPosition || section.isLocked)) {
        return { ok: false, state: currentState, error: "Required or fixed sections cannot be removed." };
      }
      state.document.sections = sections.filter((candidate) => candidate.sectionKey !== payload.sectionKey);
      const nextContent = { ...content };
      delete nextContent[payload.sectionKey];
      state.document.content = nextContent;
      const sectionStyles = { ...(layout.sectionStyles || {}) };
      delete sectionStyles[payload.sectionKey];
      const mobileLayout = layout.responsiveLayouts?.mobile || {};
      state.document.layout = {
        ...removeStyleKeys(layout, payload.sectionKey),
        sectionStyles,
        responsiveLayouts: {
          ...(layout.responsiveLayouts || {}),
          mobile: {
            ...mobileLayout,
            itemStyles: Object.fromEntries(Object.entries(mobileLayout.itemStyles || {}).filter(
              ([key]) => !key.startsWith(`${payload.sectionKey}.`),
            )),
            visibility: {
              ...(mobileLayout.visibility || {}),
              items: Object.fromEntries(Object.entries(mobileLayout.visibility?.items || {}).filter(
                ([key]) => !key.startsWith(`${payload.sectionKey}.`),
              )),
            },
          },
        },
      };
      break;
    }
    case EditorCommandType.SECTION_INSTANCE_REORDER: {
      const reordered = reorderedByKeys(sections, payload.sectionKeys, "sectionKey");
      if (!reordered) return { ok: false, state: currentState, error: "Section order is invalid." };
      const fixedTop = reordered.filter((section) => section.fixedPosition === "top");
      const fixedBottom = reordered.filter((section) => section.fixedPosition === "bottom");
      const movable = reordered.filter((section) => !section.fixedPosition);
      state.document.sections = [...fixedTop, ...movable, ...fixedBottom];
      break;
    }
    case EditorCommandType.COMPONENT_INSTANCE_CREATE: {
      const sectionIndex = sections.findIndex((candidate) => candidate.sectionKey === payload.sectionKey);
      const item = payload.item && typeof payload.item === "object"
        ? JSON.parse(JSON.stringify(payload.item))
        : null;
      if (sectionIndex < 0 || !item?.itemKey) {
        return { ok: false, state: currentState, error: "Component target is required." };
      }
      const section = sections[sectionIndex];
      const items = Array.isArray(section.items) ? section.items : [];
      if (items.some((candidate) => candidate.itemKey === item.itemKey)) {
        return { ok: false, state: currentState, error: "Component item key must be unique in a section." };
      }
      const nextSections = [...sections];
      nextSections[sectionIndex] = {
        ...section,
        items: insertAt(items, item, payload.index),
      };
      state.document.sections = nextSections;
      state.document.content = setNestedContent(
        content,
        payload.sectionKey,
        item.itemKey,
        payload.value ?? "",
      );
      if (payload.style && typeof payload.style === "object") {
        const styleKey = `${payload.sectionKey}.${item.itemKey}`;
        state.document.layout = {
          ...layout,
          itemStyles: {
            ...(layout.itemStyles || {}),
            [styleKey]: withoutUndefined(payload.style),
          },
        };
      }
      break;
    }
    case EditorCommandType.COMPONENT_INSTANCE_REMOVE: {
      const sectionIndex = sections.findIndex((candidate) => candidate.sectionKey === payload.sectionKey);
      if (sectionIndex < 0) return { ok: false, state: currentState, error: "Component section was not found." };
      const section = sections[sectionIndex];
      const item = (section.items || []).find((candidate) => candidate.itemKey === payload.itemKey);
      if (!item) return { ok: false, state: currentState, error: "Component instance was not found." };
      if (!payload.force && (item.isRequired || item.isLocked)) {
        return { ok: false, state: currentState, error: "Required or locked components cannot be removed." };
      }
      const nextSections = [...sections];
      nextSections[sectionIndex] = {
        ...section,
        items: (section.items || []).filter((candidate) => candidate.itemKey !== payload.itemKey),
      };
      state.document.sections = nextSections;
      const sectionContent = { ...(content[payload.sectionKey] || {}) };
      delete sectionContent[payload.itemKey];
      state.document.content = { ...content, [payload.sectionKey]: sectionContent };
      state.document.layout = removeStyleKeys(layout, `${payload.sectionKey}.${payload.itemKey}`);
      break;
    }
    case EditorCommandType.COMPONENT_INSTANCE_REORDER: {
      const sectionIndex = sections.findIndex((candidate) => candidate.sectionKey === payload.sectionKey);
      if (sectionIndex < 0) return { ok: false, state: currentState, error: "Component section was not found." };
      const section = sections[sectionIndex];
      const reordered = reorderedByKeys(section.items || [], payload.itemKeys, "itemKey");
      if (!reordered) return { ok: false, state: currentState, error: "Component order is invalid." };
      const nextSections = [...sections];
      nextSections[sectionIndex] = { ...section, items: reordered };
      state.document.sections = nextSections;
      break;
    }
    case EditorCommandType.COMPONENT_INSTANCE_MOVE_SECTION: {
      const sourceIndex = sections.findIndex((candidate) => candidate.sectionKey === payload.sourceSectionKey);
      const targetIndex = sections.findIndex((candidate) => candidate.sectionKey === payload.targetSectionKey);
      if (sourceIndex < 0 || targetIndex < 0) {
        return { ok: false, state: currentState, error: "Component source and target sections are required." };
      }
      const sourceSection = sections[sourceIndex];
      const targetSection = sections[targetIndex];
      const item = (sourceSection.items || []).find((candidate) => candidate.itemKey === payload.itemKey);
      if (!item) return { ok: false, state: currentState, error: "Component instance was not found." };
      if (item.isLocked || item.userReorderAllowed === false) {
        return { ok: false, state: currentState, error: "Locked components cannot be moved." };
      }
      const targetItemKey = String(payload.targetItemKey || item.itemKey);
      if ((targetSection.items || []).some((candidate) => candidate.itemKey === targetItemKey)) {
        return { ok: false, state: currentState, error: "Target section already contains the component item key." };
      }
      const movedItem = { ...item, itemKey: targetItemKey, sectionId: targetSection.sectionId || null };
      const nextSections = [...sections];
      nextSections[sourceIndex] = {
        ...sourceSection,
        items: (sourceSection.items || []).filter((candidate) => candidate.itemKey !== item.itemKey),
      };
      nextSections[targetIndex] = {
        ...targetSection,
        items: insertAt(targetSection.items || [], movedItem, payload.targetIndex),
      };
      state.document.sections = nextSections;
      const sourceContent = { ...(content[payload.sourceSectionKey] || {}) };
      const movedValue = sourceContent[item.itemKey];
      delete sourceContent[item.itemKey];
      state.document.content = {
        ...content,
        [payload.sourceSectionKey]: sourceContent,
        [payload.targetSectionKey]: {
          ...(content[payload.targetSectionKey] || {}),
          [targetItemKey]: movedValue,
        },
      };
      state.document.layout = moveStyleKeys(
        layout,
        `${payload.sourceSectionKey}.${item.itemKey}`,
        `${payload.targetSectionKey}.${targetItemKey}`,
      );
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
        sections: Array.isArray(payload.sections) ? payload.sections : state.document.sections,
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
