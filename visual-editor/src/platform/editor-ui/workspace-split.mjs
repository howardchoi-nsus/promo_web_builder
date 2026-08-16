export const WORKSPACE_SPLIT_MIN = 240;
export const WORKSPACE_SPLIT_MAX = 520;
export const WORKSPACE_SPLIT_DEFAULT = 320;

export function clampWorkspaceSplitWidth(value, {
  minimum = WORKSPACE_SPLIT_MIN,
  maximum = WORKSPACE_SPLIT_MAX,
  fallback = WORKSPACE_SPLIT_DEFAULT,
} = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(number)));
}

export function workspaceSplitStorageKey(mode = "editor") {
  return `promo-visual-editor:workspace-split:${String(mode || "editor")}`;
}

export function loadWorkspaceSplitWidth(storage, key, options) {
  try {
    const parsed = JSON.parse(storage?.getItem(key) || "null");
    return clampWorkspaceSplitWidth(parsed?.structureWidthPx, options);
  } catch {
    return clampWorkspaceSplitWidth(undefined, options);
  }
}

export function saveWorkspaceSplitWidth(storage, key, width) {
  try {
    storage?.setItem(key, JSON.stringify({
      structureWidthPx: clampWorkspaceSplitWidth(width),
      updatedAt: new Date().toISOString(),
    }));
    return true;
  } catch {
    return false;
  }
}
