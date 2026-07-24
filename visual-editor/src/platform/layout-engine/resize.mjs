import { clampNumber, roundedGeometryValue } from "./geometry.mjs";

function directionIncludes(direction, token) {
  return String(direction || "se").includes(token);
}

export function resizeComponentGeometry({
  geometry,
  deltaX = 0,
  deltaY = 0,
  direction = "se",
  minimumWidth = 1,
  minimumHeight = 1,
  maximumWidth = Number.POSITIVE_INFINITY,
  maximumHeight = 900,
  aspectRatioLocked = false,
  aspectRatio = 1,
  scaleFont = true,
  maximumFontSize = 80,
} = {}) {
  const start = {
    x: Number(geometry?.x) || 0,
    y: Number(geometry?.y) || 0,
    width: Math.max(minimumWidth, Number(geometry?.width) || minimumWidth),
    height: Math.max(minimumHeight, Number(geometry?.height) || minimumHeight),
    fontSize: clampNumber(geometry?.fontSize, 0, maximumFontSize, 18),
  };
  const west = directionIncludes(direction, "w");
  const east = directionIncludes(direction, "e");
  const north = directionIncludes(direction, "n");
  const south = directionIncludes(direction, "s");
  const horizontalActive = west || east;
  const verticalActive = north || south;
  const horizontalDelta = horizontalActive ? (west ? -deltaX : deltaX) : 0;
  const verticalDelta = verticalActive ? (north ? -deltaY : deltaY) : 0;
  let width = horizontalActive
    ? clampNumber(start.width + horizontalDelta, minimumWidth, maximumWidth, start.width)
    : start.width;
  let height = verticalActive
    ? clampNumber(start.height + verticalDelta, minimumHeight, maximumHeight, start.height)
    : start.height;

  if (aspectRatioLocked) {
    const ratio = Number(aspectRatio) > 0 ? Number(aspectRatio) : 1;
    if (verticalActive && (!horizontalActive || Math.abs(deltaY) > Math.abs(deltaX))) {
      width = clampNumber(height * ratio, minimumWidth, maximumWidth, start.width);
      height = clampNumber(width / ratio, minimumHeight, maximumHeight, start.height);
    } else {
      height = clampNumber(width / ratio, minimumHeight, maximumHeight, start.height);
      width = clampNumber(height * ratio, minimumWidth, maximumWidth, start.width);
    }
  }

  const x = west ? start.x + start.width - width : start.x;
  const y = north ? start.y + start.height - height : start.y;
  const widthScale = start.width ? width / start.width : 1;
  const heightScale = start.height ? height / start.height : 1;
  const fontScale = horizontalActive && verticalActive
    ? Math.sqrt(widthScale * heightScale)
    : horizontalActive
      ? widthScale
      : heightScale;
  const expansion = Math.max(
    horizontalActive ? width - start.width : 0,
    verticalActive ? height - start.height : 0,
    0,
  );
  const scaledFontSize = start.fontSize === 0
    ? expansion / 4
    : start.fontSize * fontScale;
  const fontSize = scaleFont
    ? clampNumber(scaledFontSize, 0, maximumFontSize, start.fontSize)
    : start.fontSize;

  return {
    x: roundedGeometryValue(x),
    y: roundedGeometryValue(y),
    width: roundedGeometryValue(width),
    height: roundedGeometryValue(height),
    fontSize: roundedGeometryValue(fontSize),
    widthScale,
    heightScale,
  };
}
