export const MULTI_LAYOUT_OPERATIONS = Object.freeze([
  "align-left", "align-center", "align-right",
  "align-top", "align-middle", "align-bottom",
  "distribute-horizontal", "distribute-vertical",
  "equal-width", "equal-height", "set-gap",
  "group-stack-horizontal", "group-stack-vertical",
]);

export const MULTI_LAYOUT_GAPS = Object.freeze({
  "space-2": 8,
  "space-3": 12,
  "space-4": 16,
  "space-6": 24,
  "space-8": 32,
});

function round(value) {
  return Math.round(Number(value) * 1000) / 1000;
}

function normalizeGeometry(geometry) {
  if (!Array.isArray(geometry) || geometry.length < 2) throw new Error("2개 이상의 컴포넌트 geometry가 필요합니다.");
  const seen = new Set();
  return geometry.map((entry) => {
    const itemKey = String(entry?.itemKey || "").trim();
    const values = {
      itemKey,
      xPct: Number(entry?.xPct),
      yPx: Number(entry?.yPx),
      widthPct: Number(entry?.widthPct),
      heightPx: Number(entry?.heightPx),
    };
    if (!itemKey || seen.has(itemKey)) throw new Error("중복되거나 비어 있는 컴포넌트 key가 있습니다.");
    if (![values.xPct, values.yPx, values.widthPct, values.heightPx].every(Number.isFinite)) {
      throw new Error(`${itemKey}의 geometry 값이 올바르지 않습니다.`);
    }
    seen.add(itemKey);
    return values;
  });
}

function overlapPairs(geometry) {
  const pairs = new Set();
  geometry.forEach((left, index) => {
    geometry.slice(index + 1).forEach((right) => {
      const horizontal = left.xPct < right.xPct + right.widthPct && left.xPct + left.widthPct > right.xPct;
      const vertical = left.yPx < right.yPx + right.heightPx && left.yPx + left.heightPx > right.yPx;
      if (horizontal && vertical) pairs.add([left.itemKey, right.itemKey].sort().join("|"));
    });
  });
  return pairs;
}

function assertBounds(geometry, canvasHeightPx) {
  geometry.forEach((entry) => {
    if (entry.xPct < -0.001 || entry.yPx < -0.001
      || entry.widthPct < 10 || entry.widthPct > 100
      || entry.heightPx < 80 || entry.heightPx > 900
      || entry.xPct + entry.widthPct > 100.001
      || entry.yPx + entry.heightPx > canvasHeightPx + 0.001) {
      throw new Error(`${entry.itemKey} 결과가 섹션 경계를 벗어납니다.`);
    }
  });
}

function sortByAxis(geometry, axis) {
  return [...geometry].sort((left, right) => (
    axis === "horizontal" ? left.xPct - right.xPct : left.yPx - right.yPx
  ));
}

export function executeMultiLayoutOperation(geometryInput, plan, options = {}) {
  const geometry = normalizeGeometry(geometryInput).map((entry) => ({ ...entry }));
  const operation = String(plan?.operation || "");
  if (!MULTI_LAYOUT_OPERATIONS.includes(operation)) throw new Error("허용되지 않은 레이아웃 명령입니다.");
  const requestedKeys = Array.isArray(plan?.targetItemKeys) ? plan.targetItemKeys.map(String) : [];
  if ([...requestedKeys].sort().join("\n") !== geometry.map((entry) => entry.itemKey).sort().join("\n")) {
    throw new Error("레이아웃 명령의 대상이 현재 선택과 일치하지 않습니다.");
  }
  const canvasWidthPx = Math.max(1, Number(options.canvasWidthPx || 1280));
  const canvasHeightPx = Math.max(80, Number(options.canvasHeightPx || 900));
  const gapToken = plan?.gapToken || "space-4";
  const gapPx = MULTI_LAYOUT_GAPS[gapToken];
  if (gapPx === undefined) throw new Error("허용되지 않은 gap token입니다.");
  const beforeOverlaps = overlapPairs(geometry);
  const left = Math.min(...geometry.map((entry) => entry.xPct));
  const right = Math.max(...geometry.map((entry) => entry.xPct + entry.widthPct));
  const top = Math.min(...geometry.map((entry) => entry.yPx));
  const bottom = Math.max(...geometry.map((entry) => entry.yPx + entry.heightPx));

  if (operation === "align-left") geometry.forEach((entry) => { entry.xPct = left; });
  if (operation === "align-center") {
    const center = (left + right) / 2;
    geometry.forEach((entry) => { entry.xPct = center - entry.widthPct / 2; });
  }
  if (operation === "align-right") geometry.forEach((entry) => { entry.xPct = right - entry.widthPct; });
  if (operation === "align-top") geometry.forEach((entry) => { entry.yPx = top; });
  if (operation === "align-middle") {
    const middle = (top + bottom) / 2;
    geometry.forEach((entry) => { entry.yPx = middle - entry.heightPx / 2; });
  }
  if (operation === "align-bottom") geometry.forEach((entry) => { entry.yPx = bottom - entry.heightPx; });
  if (operation === "equal-width") {
    const width = geometry.reduce((sum, entry) => sum + entry.widthPct, 0) / geometry.length;
    geometry.forEach((entry) => { entry.widthPct = width; });
  }
  if (operation === "equal-height") {
    const height = geometry.reduce((sum, entry) => sum + entry.heightPx, 0) / geometry.length;
    geometry.forEach((entry) => { entry.heightPx = height; });
  }
  if (operation === "distribute-horizontal") {
    const sorted = sortByAxis(geometry, "horizontal");
    const available = right - left - sorted.reduce((sum, entry) => sum + entry.widthPct, 0);
    if (available < 0) throw new Error("가로 균등 배치를 적용할 공간이 부족합니다.");
    const gap = available / (sorted.length - 1);
    let cursor = left;
    sorted.forEach((entry) => { entry.xPct = cursor; cursor += entry.widthPct + gap; });
  }
  if (operation === "distribute-vertical") {
    const sorted = sortByAxis(geometry, "vertical");
    const available = bottom - top - sorted.reduce((sum, entry) => sum + entry.heightPx, 0);
    if (available < 0) throw new Error("세로 균등 배치를 적용할 공간이 부족합니다.");
    const gap = available / (sorted.length - 1);
    let cursor = top;
    sorted.forEach((entry) => { entry.yPx = cursor; cursor += entry.heightPx + gap; });
  }
  if (operation === "set-gap" || operation === "group-stack-horizontal" || operation === "group-stack-vertical") {
    const axis = operation === "group-stack-horizontal"
      ? "horizontal"
      : operation === "group-stack-vertical"
        ? "vertical"
        : plan?.axis;
    if (!["horizontal", "vertical"].includes(axis)) throw new Error("간격 적용 방향이 필요합니다.");
    const sorted = sortByAxis(geometry, axis);
    let cursor = axis === "horizontal" ? left : top;
    sorted.forEach((entry) => {
      if (axis === "horizontal") {
        entry.xPct = cursor;
        cursor += entry.widthPct + (gapPx / canvasWidthPx) * 100;
      } else {
        entry.yPx = cursor;
        cursor += entry.heightPx + gapPx;
      }
    });
  }

  geometry.forEach((entry) => {
    entry.xPct = round(entry.xPct);
    entry.yPx = round(entry.yPx);
    entry.widthPct = round(entry.widthPct);
    entry.heightPx = round(entry.heightPx);
  });
  assertBounds(geometry, canvasHeightPx);
  const afterOverlaps = overlapPairs(geometry);
  const newOverlap = [...afterOverlaps].find((pair) => !beforeOverlaps.has(pair));
  if (newOverlap) throw new Error(`레이아웃 결과에 새 충돌이 발생했습니다: ${newOverlap}`);
  return geometry;
}

export function geometryToItemStylePatches(geometry) {
  return Object.fromEntries(normalizeGeometry(geometry).map((entry) => [
    entry.itemKey,
    {
      positionMode: "free",
      xPct: round(entry.xPct),
      yPx: round(entry.yPx),
      widthPct: round(entry.widthPct),
      heightPx: round(entry.heightPx),
    },
  ]));
}
