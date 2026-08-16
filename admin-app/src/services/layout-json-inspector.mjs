const VIEWPORTS = ["desktop", "mobile"];

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function issue(code, path, message, level = "error") {
  return { code, path, message, level };
}

export function inspectLayoutSnapshot(snapshot, itemKeys = []) {
  const issues = [];
  const source = isRecord(snapshot) ? snapshot : {};
  const allowedKeys = new Set(itemKeys.map(String));
  if (source.contractVersion !== 1) {
    issues.push(issue("LAYOUT_CONTRACT_UNSUPPORTED", "$.contractVersion", "contractVersion 1만 지원합니다."));
  }
  if (source.layoutMode !== "free") {
    issues.push(issue("LAYOUT_MODE_UNSUPPORTED", "$.layoutMode", "layoutMode는 free여야 합니다."));
  }
  VIEWPORTS.forEach((viewport) => {
    const viewportPath = `$.viewports.${viewport}`;
    const viewportValue = source.viewports?.[viewport];
    if (!isRecord(viewportValue)) {
      issues.push(issue("LAYOUT_VIEWPORT_REQUIRED", viewportPath, `${viewport} viewport가 필요합니다.`));
      return;
    }
    const items = isRecord(viewportValue.items) ? viewportValue.items : {};
    itemKeys.forEach((itemKey) => {
      if (!isRecord(items[itemKey])) {
        issues.push(issue(
          "LAYOUT_GEOMETRY_INCOMPLETE",
          `${viewportPath}.items.${itemKey}`,
          `${itemKey} 컴포넌트의 ${viewport} geometry가 없습니다.`,
          "warning",
        ));
      }
    });
    Object.entries(items).forEach(([itemKey, geometry]) => {
      const basePath = `${viewportPath}.items.${itemKey}`;
      if (allowedKeys.size && !allowedKeys.has(itemKey)) {
        issues.push(issue("LAYOUT_ITEM_KEY_UNKNOWN", basePath, `현재 Section에 없는 itemKey입니다: ${itemKey}`));
      }
      if (!isRecord(geometry)) {
        issues.push(issue("LAYOUT_GEOMETRY_INVALID", basePath, "Geometry는 JSON Object여야 합니다."));
        return;
      }
      [
        ["xPct", 0, 100],
        ["widthPct", 0.01, 100],
        ["yPx", 0, 10000],
        ["heightPx", 1, 10000],
      ].forEach(([property, minimum, maximum]) => {
        if (geometry[property] === undefined) return;
        const value = Number(geometry[property]);
        if (!Number.isFinite(value) || value < minimum || value > maximum) {
          issues.push(issue(
            "LAYOUT_GEOMETRY_OUT_OF_RANGE",
            `${basePath}.${property}`,
            `${property} 값이 허용 범위를 벗어났습니다.`,
          ));
        }
      });
    });
  });
  return issues;
}

export function layoutJsonEnvelope(layout, section, aiSelectable = false) {
  return {
    id: layout?.id || "",
    sectionId: layout?.sectionId || section?.id || "",
    layoutKey: layout?.layoutKey || "",
    name: layout?.name || "",
    description: layout?.description || "",
    isDefault: Boolean(layout?.isDefault),
    aiSelectable: Boolean(aiSelectable),
    selectionMetadata: layout?.selectionMetadata || {},
    layoutSnapshot: layout?.layoutSnapshot || {},
    changeNote: layout?.changeNote || "",
    createdAt: layout?.createdAt || null,
    updatedAt: layout?.updatedAt || null,
  };
}

export function safeJsonFileName(layout) {
  const key = String(layout?.layoutKey || "layout-preset").replace(/[^a-zA-Z0-9_-]+/g, "-");
  return `${key || "layout-preset"}.json`;
}
