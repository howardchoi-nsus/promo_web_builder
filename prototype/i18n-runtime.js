(function initPromoI18n(global) {
  "use strict";

  const STORAGE_KEY = "promoPrototype.locale.v1";
  const DEFAULT_LOCALE = "ko";
  const subscribers = new Set();
  const baselineCache = new Map();
  const snapshotCache = new Map();
  let initializationPromise = null;
  const state = {
    locale: DEFAULT_LOCALE,
    defaultLocale: DEFAULT_LOCALE,
    baseline: {},
    defaultBaseline: {},
    messages: {},
    defaultMessages: {},
    revision: 0,
    initialized: false,
  };

  function canonicalizeLocale(value) {
    try {
      return Intl.getCanonicalLocales(String(value || "").trim())[0] || DEFAULT_LOCALE;
    } catch (_error) {
      return DEFAULT_LOCALE;
    }
  }

  function localeCandidates(locale) {
    const canonical = canonicalizeLocale(locale);
    const language = canonical.split("-")[0];
    return ["ko", "en"].includes(language) ? [language] : [];
  }

  async function fetchJson(url, options) {
    const response = await global.fetch(url, options);
    if (!response.ok) throw new Error(`i18n request failed (${response.status})`);
    return response.json();
  }

  async function loadBaseline(locale) {
    for (const candidate of localeCandidates(locale)) {
      if (baselineCache.has(candidate)) return baselineCache.get(candidate);
      try {
        const messages = await fetchJson(`/locales/${encodeURIComponent(candidate)}.json`, { cache: "no-cache" });
        baselineCache.set(candidate, messages && typeof messages === "object" ? messages : {});
        return baselineCache.get(candidate);
      } catch (_error) {
        // Try the language-only baseline before falling back to the default locale.
      }
    }
    return {};
  }

  function notify() {
    const snapshot = getState();
    subscribers.forEach((subscriber) => {
      try { subscriber(snapshot); } catch (_error) { /* Subscriber errors must not break rendering. */ }
    });
  }

  function syncDocumentLocale() {
    if (global.document?.documentElement) global.document.documentElement.lang = state.locale;
  }

  function interpolate(value, params) {
    return String(value).replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g, (match, name) => (
      Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match
    ));
  }

  function t(key, params = {}) {
    const value = state.messages[key]
      ?? state.baseline[key]
      ?? state.defaultMessages[key]
      ?? state.defaultBaseline[key]
      ?? key;
    return interpolate(value, params);
  }

  function getState() {
    return Object.freeze({
      locale: state.locale,
      defaultLocale: state.defaultLocale,
      revision: state.revision,
      initialized: state.initialized,
    });
  }

  function getLocale() {
    return state.locale;
  }

  function subscribe(subscriber) {
    if (typeof subscriber !== "function") return function noop() {};
    subscribers.add(subscriber);
    return () => subscribers.delete(subscriber);
  }

  async function reloadSnapshot() {
    const locale = state.locale;
    const cached = snapshotCache.get(locale);
    const headers = cached?.etag ? { "If-None-Match": cached.etag } : {};
    const response = await global.fetch(`/api/locale-snapshot?locale=${encodeURIComponent(locale)}`, {
      cache: "no-cache",
      headers,
    });
    if (response.status === 304 && cached) return cached.payload;
    if (!response.ok) throw new Error(`i18n snapshot failed (${response.status})`);

    const payload = await response.json();
    snapshotCache.set(locale, { etag: response.headers.get("etag") || "", payload });
    if (state.locale !== locale) return payload;

    state.messages = payload.messages && typeof payload.messages === "object" ? payload.messages : {};
    state.defaultLocale = canonicalizeLocale(payload.defaultLocale || DEFAULT_LOCALE);
    state.revision = Number(payload.revision) || 0;
    if (payload.defaultMessages && typeof payload.defaultMessages === "object") {
      state.defaultMessages = payload.defaultMessages;
    }
    if (state.defaultLocale !== locale) {
      state.defaultBaseline = await loadBaseline(state.defaultLocale);
    }
    notify();
    return payload;
  }

  async function applyLocale(locale, persist) {
    state.locale = canonicalizeLocale(locale);
    state.baseline = await loadBaseline(state.locale);
    state.defaultBaseline = state.locale === DEFAULT_LOCALE
      ? state.baseline
      : await loadBaseline(DEFAULT_LOCALE);
    state.messages = {};
    state.defaultMessages = {};
    state.revision = 0;
    if (persist) {
      try { global.localStorage?.setItem(STORAGE_KEY, state.locale); } catch (_error) { /* Storage is optional. */ }
    }
    syncDocumentLocale();
    notify();
  }

  async function setLocale(locale) {
    await applyLocale(locale, true);
    try { await reloadSnapshot(); } catch (_error) { /* Baseline remains available offline. */ }
    return getState();
  }

  function init(options = {}) {
    if (state.initialized) return Promise.resolve(getState());
    if (initializationPromise) return initializationPromise;
    initializationPromise = (async () => {
      let storedLocale = "";
      try { storedLocale = global.localStorage?.getItem(STORAGE_KEY) || ""; } catch (_error) { /* Storage is optional. */ }
      const browserLocale = canonicalizeLocale(global.navigator?.languages?.[0] || global.navigator?.language || DEFAULT_LOCALE).split("-")[0];
      await applyLocale(options.locale || storedLocale || browserLocale, false);
      state.initialized = true;
      notify();
      reloadSnapshot().catch(() => {});
      return getState();
    })();
    return initializationPromise;
  }

  global.PromoI18n = Object.freeze({
    init,
    t,
    setLocale,
    getLocale,
    getState,
    reloadSnapshot,
    subscribe,
  });
})(window);
