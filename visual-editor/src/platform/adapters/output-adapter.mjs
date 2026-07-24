import { persistSnapshot } from "../../editor-utils.mjs";

export function createOutputAdapter({
  storage = globalThis.localStorage,
  openWindow = globalThis.window?.open?.bind(globalThis.window),
  storageKey,
  outputUrl = "/prototype/visual-output.html",
} = {}) {
  if (!storageKey) throw new Error("storageKey is required");

  return Object.freeze({
    save(snapshot) {
      return persistSnapshot(storage, storageKey, snapshot);
    },

    load() {
      const stored = storage.getItem(storageKey);
      if (!stored) throw new Error("Visual Editor에서 확정한 Snapshot이 없습니다.");
      return JSON.parse(stored);
    },

    open() {
      if (typeof openWindow !== "function") throw new Error("Web Output 창을 열 수 없습니다.");
      openWindow(outputUrl, "_blank", "noopener");
    },
  });
}
