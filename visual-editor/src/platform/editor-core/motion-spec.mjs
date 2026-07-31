export const MOTION_PRESETS = Object.freeze([
  { key: "none", label: "없음", presetVersionId: "" },
  { key: "fade-in", label: "Fade In", presetVersionId: "motion-fade-in", className: "motion-fade-in" },
  { key: "fade-up", label: "Fade Up", presetVersionId: "motion-fade-up", className: "motion-fade-up" },
  { key: "scale-in", label: "Scale In", presetVersionId: "motion-scale-in", className: "motion-scale-in" },
]);

const PRESET_BY_ID = new Map(MOTION_PRESETS.filter((preset) => preset.presetVersionId).map((preset) => [preset.presetVersionId, preset]));
const DURATION = new Set(["180ms", "360ms", "600ms"]);
const DELAY = new Set(["0ms", "100ms", "240ms"]);
const STAGGER = new Set(["0ms", "60ms", "100ms", "160ms"]);

function normalizeBinding(value = {}, { item = false } = {}) {
  if (item && value.inherit !== false && !value.presetVersionId) return { inherit: true };
  const preset = PRESET_BY_ID.get(String(value.presetVersionId || ""));
  if (!preset) return item ? { inherit: false } : {};
  return {
    ...(item ? { inherit: false } : {}),
    presetVersionId: preset.presetVersionId,
    className: preset.className,
    trigger: ["load", "viewport-enter", "inherit"].includes(value.trigger)
      ? value.trigger : (item ? "inherit" : "viewport-enter"),
    playMode: "once",
    durationToken: DURATION.has(value.durationToken) ? value.durationToken : "360ms",
    easingToken: "ease-out",
    delayToken: DELAY.has(value.delayToken) ? value.delayToken : "0ms",
    ...(item ? { motionOrder: Math.max(0, Math.min(99, Number(value.motionOrder || 0))) } : {
      childrenMode: value.childrenMode === "stagger" ? "stagger" : "together",
      staggerToken: STAGGER.has(value.staggerToken) ? value.staggerToken : "0ms",
    }),
  };
}

export function normalizeMotionSpec(value = {}) {
  return {
    contractVersion: 2,
    sections: Object.fromEntries(Object.entries(value?.sections || {}).map(([key, binding]) => [key, normalizeBinding(binding)])),
    items: Object.fromEntries(Object.entries(value?.items || {}).map(([key, binding]) => [key, normalizeBinding(binding, { item: true })])),
  };
}

export function createSectionMotionBinding(value) {
  return normalizeBinding(value);
}

export function createItemMotionBinding(value) {
  return normalizeBinding(value, { item: true });
}
