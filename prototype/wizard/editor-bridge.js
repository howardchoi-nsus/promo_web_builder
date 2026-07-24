(function registerEditorBridge(global) {
  function createEditorBridge({
    hostWindow = global,
    getFrame,
    allowedOrigin = hostWindow?.location?.origin,
  } = {}) {
    if (typeof getFrame !== "function") throw new TypeError("getFrame must be a function");
    if (!allowedOrigin) throw new Error("allowedOrigin is required");

    function frameWindow() {
      return getFrame()?.contentWindow || null;
    }

    function post(message) {
      const target = frameWindow();
      if (!target || !message || typeof message !== "object") return false;
      target.postMessage(message, allowedOrigin);
      return true;
    }

    return Object.freeze({
      isTrustedEvent(event) {
        const target = frameWindow();
        return Boolean(target && event?.origin === allowedOrigin && event?.source === target);
      },

      post,

      postSnapshot(snapshot) {
        if (!snapshot) return false;
        return post({
          type: "promo-wizard-layout-snapshot",
          snapshot,
        });
      },
    });
  }

  global.PromoEditorBridge = Object.freeze({ createEditorBridge });
})(globalThis);
