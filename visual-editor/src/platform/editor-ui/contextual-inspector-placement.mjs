const DEFAULTS = Object.freeze({ width: 360, height: 480, margin: 12, gap: 12, minimumHeight: 160 });

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

export function resolveContextualInspectorPlacement({ anchorRect, viewportRect, popoverRect = {}, options = {} }) {
  if (!anchorRect || !viewportRect) return { placement: "hidden", visibility: "hidden" };

  const margin = options.margin ?? DEFAULTS.margin;
  const gap = options.gap ?? DEFAULTS.gap;
  const viewportWidth = viewportRect.width;
  const viewportHeight = viewportRect.height;
  const width = Math.min(popoverRect.width || DEFAULTS.width, viewportWidth - (margin * 2));
  const maxLeft = viewportWidth - width - margin;
  // Side placements stay aligned with the selected component and scroll their
  // body when necessary. Shifting a tall inspector upward can cover unrelated
  // components and prevent direct selection on the canvas.
  const sideTop = clamp(anchorRect.top, margin, viewportHeight - DEFAULTS.minimumHeight - margin);
  const centeredLeft = clamp(anchorRect.left + ((anchorRect.width || anchorRect.right - anchorRect.left) / 2) - (width / 2), margin, maxLeft);

  if (anchorRect.right + gap + width <= viewportWidth - margin) {
    return { placement: "right", left: anchorRect.right + gap, top: sideTop, width, maxHeight: viewportHeight - sideTop - margin };
  }
  if (anchorRect.left - gap - width >= margin) {
    return { placement: "left", left: anchorRect.left - gap - width, top: sideTop, width, maxHeight: viewportHeight - sideTop - margin };
  }
  const availableBelow = viewportHeight - anchorRect.bottom - gap - margin;
  if (availableBelow >= DEFAULTS.minimumHeight) {
    return { placement: "bottom", left: centeredLeft, top: anchorRect.bottom + gap, width, maxHeight: availableBelow };
  }
  const availableAbove = anchorRect.top - gap - margin;
  if (availableAbove >= DEFAULTS.minimumHeight) {
    return { placement: "top", left: centeredLeft, top: margin, width, maxHeight: availableAbove };
  }
  return {
    placement: "sheet",
    left: margin,
    top: "auto",
    bottom: margin,
    width: viewportWidth - (margin * 2),
    maxHeight: Math.max(DEFAULTS.minimumHeight, viewportHeight - (margin * 2)),
  };
}
