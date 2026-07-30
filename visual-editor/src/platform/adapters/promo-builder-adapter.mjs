export const PromoBuilderMessageType = Object.freeze({
  READY: "promo-wizard-layout-ready",
  SNAPSHOT: "promo-wizard-layout-snapshot",
  CHANGE: "promo-wizard-layout-change",
  AUTO_REGISTER_REQUEST: "create-promo-auto-register-request",
  AUTO_REGISTER_RESULT: "create-promo-auto-register-result",
  SECTION_AI_ACTION: "create-promo-section-ai-action",
  REMOVE_IMAGE: "create-promo-remove-image",
});

function clonePayload(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function createPromoBuilderAdapter({
  hostWindow = globalThis.window,
  allowedOrigin = hostWindow?.location?.origin,
} = {}) {
  if (!hostWindow?.parent || !allowedOrigin) throw new Error("Promo Builder host window is unavailable");

  const listeners = new Set();
  const handleMessage = (event) => {
    if (event.origin !== allowedOrigin) return;
    listeners.forEach((listener) => listener(event.data));
  };

  return Object.freeze({
    connect(listener) {
      if (typeof listener !== "function") throw new TypeError("listener must be a function");
      listeners.add(listener);
      if (listeners.size === 1) hostWindow.addEventListener("message", handleMessage);
      return () => {
        listeners.delete(listener);
        if (!listeners.size) hostWindow.removeEventListener("message", handleMessage);
      };
    },

    disconnect() {
      listeners.clear();
      hostWindow.removeEventListener("message", handleMessage);
    },

    notifyReady() {
      hostWindow.parent.postMessage({ type: PromoBuilderMessageType.READY }, allowedOrigin);
    },

    notifyChange({ snapshotRevision, designSpec, sectionInputs }) {
      hostWindow.parent.postMessage({
        type: PromoBuilderMessageType.CHANGE,
        snapshotRevision,
        designSpec: clonePayload(designSpec),
        sectionInputs: clonePayload(sectionInputs),
      }, allowedOrigin);
    },

    requestAutoRegister(sectionInputs) {
      hostWindow.parent.postMessage({
        type: PromoBuilderMessageType.AUTO_REGISTER_REQUEST,
        sectionInputs: clonePayload(sectionInputs),
      }, allowedOrigin);
    },

    requestSectionAiAction({
      sectionKey, action, targetType, targetItemKey, targetFieldKey, imageGuidance, imageSafeArea,
      keyVisualTextMode, keyVisualText,
    }) {
      hostWindow.parent.postMessage({
        type: PromoBuilderMessageType.SECTION_AI_ACTION,
        sectionKey,
        action,
        targetType,
        targetItemKey: String(targetItemKey || "").trim() || null,
        targetFieldKey: String(targetFieldKey || "").trim() || null,
        imageGuidance: String(imageGuidance || "").trim() || null,
        imageSafeArea: String(imageSafeArea || "").trim() || null,
        keyVisualTextMode: String(keyVisualTextMode || "none").trim(),
        keyVisualText: String(keyVisualText || "").trim() || null,
      }, allowedOrigin);
    },

    requestImageRemoval({ sectionKey, itemKey, fieldKey }) {
      hostWindow.parent.postMessage({
        type: PromoBuilderMessageType.REMOVE_IMAGE,
        sectionKey,
        itemKey,
        fieldKey: fieldKey || null,
      }, allowedOrigin);
    },
  });
}
