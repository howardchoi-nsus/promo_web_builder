(function initializePromoShell(global) {
  const STORAGE_KEY = "promoPrototype.themeMode";

  function normalizeTheme(value) {
    return value === "dark" ? "dark" : "light";
  }

  function storedTheme() {
    try {
      return normalizeTheme(global.localStorage.getItem(STORAGE_KEY));
    } catch {
      return "light";
    }
  }

  function syncThemeControls(root) {
    const theme = normalizeTheme(document.documentElement.getAttribute("data-theme"));
    root.querySelectorAll("[data-shell-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", theme === "dark" ? "라이트모드로 변경" : "다크모드로 변경");
      const label = button.querySelector("[data-shell-theme-label]");
      if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
    });
  }

  function applyTheme(value, options = {}) {
    const theme = normalizeTheme(value);
    document.documentElement.setAttribute("data-theme", theme);
    if (options.persist !== false) {
      try {
        global.localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // localStorage may be unavailable in embedded or privacy-restricted contexts.
      }
    }
    syncThemeControls(options.root || document);
    global.dispatchEvent(new CustomEvent("promo-shell-theme-change", { detail: { theme } }));
    return theme;
  }

  function init(root = document) {
    applyTheme(storedTheme(), { persist: false, root });
    root.querySelectorAll("[data-shell-theme-toggle]").forEach((button) => {
      if (button.dataset.shellThemeBound === "true") return;
      button.dataset.shellThemeBound = "true";
      button.addEventListener("click", () => {
        const current = normalizeTheme(document.documentElement.getAttribute("data-theme"));
        applyTheme(current === "dark" ? "light" : "dark", { root: document });
      });
    });
    syncThemeControls(root);
  }

  global.PromoShell = { init, applyTheme, getTheme: storedTheme, storageKey: STORAGE_KEY };
  applyTheme(storedTheme(), { persist: false, root: document });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init(document), { once: true });
  else init(document);
})(window);
