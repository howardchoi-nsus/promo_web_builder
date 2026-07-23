(function initializePromoShell(global) {
  const STORAGE_KEY = "promoPrototype.themeMode";
  const SIDEBAR_MODE_STORAGE_KEY = "promoPrototype.sidebarMode";
  const NAV_ITEMS = Object.freeze([
    { key: "builder", label: "디자인 생성기", href: "/prototype/index.html", icon: "layout-dashboard" },
    { key: "create-promo", label: "프로모션 빌더", href: "/create-promo.html", icon: "megaphone" },
    { key: "admin", label: "설정", href: "/prototype/index.html?view=admin&tab=promo-form", icon: "settings" },
  ]);

  function translate(key, fallback) {
    if (!key) return fallback;
    const value = global.PromoI18n?.t?.(key);
    return value && value !== key ? value : fallback;
  }

  function activeNavKey(location = global.location) {
    const pathname = String(location?.pathname || "").replace(/\/$/, "");
    const search = new URLSearchParams(String(location?.search || ""));
    if (pathname.endsWith("/create-promo.html") || pathname.endsWith("/create-promo")) return "create-promo";
    if (pathname.endsWith("/promo-wizard.html") || pathname.endsWith("/promo-wizard")) return "promo-wizard";
    if (pathname.endsWith("/visual-editor.html") || pathname.endsWith("/visual-editor")) return "visual-editor";
    if (pathname.endsWith("/generated.html") || pathname.endsWith("/generated")) return "generated";
    if (pathname.endsWith("/prototype/index.html") || pathname.endsWith("/prototype/index") || pathname.endsWith("/prototype")) {
      return search.get("view") === "admin" ? "admin" : "builder";
    }
    return "";
  }

  function renderNavigation(root = document) {
    root.querySelectorAll("[data-shell-nav]").forEach((nav) => {
      const active = nav.dataset.shellActive || activeNavKey();
      nav.replaceChildren(...NAV_ITEMS.map((item) => {
        const itemLabel = translate(item.labelKey, item.label);
        const link = document.createElement("a");
        link.href = item.href;
        link.setAttribute("aria-label", itemLabel);
        link.title = itemLabel;
        link.dataset.shellNavKey = item.key;
        const icon = document.createElement("i");
        icon.dataset.lucide = item.icon;
        icon.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.dataset.shellNavLabel = "";
        label.textContent = itemLabel;
        link.append(icon, label);
        if (item.key === active) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
        return link;
      }));
    });
  }

  function renderIcons() {
    global.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
  }

  function normalizeSidebarMode(value) {
    return value === "min" ? "min" : "max";
  }

  function storedSidebarMode() {
    try {
      return normalizeSidebarMode(global.localStorage.getItem(SIDEBAR_MODE_STORAGE_KEY));
    } catch {
      return "max";
    }
  }

  function applySidebarMode(value, options = {}) {
    const mode = normalizeSidebarMode(value);
    const root = options.root || document;
    root.querySelectorAll("[data-shell-frame]").forEach((frame) => {
      frame.classList.toggle("is-sidebar-minimized", mode === "min");
      frame.dataset.shellSidebarState = mode;
      frame.querySelectorAll("[data-shell-sidebar-mode]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.shellSidebarMode === mode));
      });
    });
    if (options.persist !== false) {
      try {
        global.localStorage.setItem(SIDEBAR_MODE_STORAGE_KEY, mode);
      } catch {
        // localStorage may be unavailable in embedded or privacy-restricted contexts.
      }
    }
    global.dispatchEvent(new CustomEvent("promo-shell-sidebar-mode-change", { detail: { mode } }));
    return mode;
  }

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
      button.setAttribute("aria-label", theme === "dark"
        ? translate("shell.theme.toLight", "라이트모드로 변경")
        : translate("shell.theme.toDark", "다크모드로 변경"));
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

  function findFrame(root = document) {
    return root.querySelector?.("[data-shell-frame]") || document.querySelector("[data-shell-frame]");
  }

  function setSidebarOpen(frame, open, trigger = null) {
    if (!frame) return;
    const shouldOpen = Boolean(open);
    frame.classList.toggle("is-sidebar-open", shouldOpen);
    document.body.classList.toggle("shell-drawer-open", shouldOpen);
    frame.querySelectorAll("[data-shell-menu-toggle]").forEach((button) => {
      button.setAttribute("aria-expanded", String(shouldOpen));
    });
    if (shouldOpen) {
      frame._shellDrawerTrigger = trigger || document.activeElement;
      frame.querySelector("[data-shell-sidebar-close]")?.focus();
    } else if (frame._shellDrawerTrigger instanceof HTMLElement) {
      frame._shellDrawerTrigger.focus();
      frame._shellDrawerTrigger = null;
    }
  }

  function openSidebar(root = document, trigger = null) {
    setSidebarOpen(findFrame(root), true, trigger);
  }

  function closeSidebar(root = document) {
    setSidebarOpen(findFrame(root), false);
  }

  function bindSidebar(root = document) {
    const frame = findFrame(root);
    if (!frame || frame.dataset.shellSidebarBound === "true") return;
    frame.dataset.shellSidebarBound = "true";
    frame.querySelectorAll("[data-shell-menu-toggle]").forEach((button) => {
      button.addEventListener("click", () => openSidebar(frame, button));
    });
    frame.querySelectorAll("[data-shell-sidebar-close], [data-shell-overlay]").forEach((button) => {
      button.addEventListener("click", () => closeSidebar(frame));
    });
    frame.querySelectorAll("[data-shell-sidebar-mode]").forEach((button) => {
      button.addEventListener("click", () => applySidebarMode(button.dataset.shellSidebarMode, { root: document }));
    });
    frame.querySelector("[data-shell-sidebar]")?.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeSidebar(frame);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && frame.classList.contains("is-sidebar-open")) closeSidebar(frame);
    });
    const mobileViewport = window.matchMedia("(max-width: 1023px)");
    const closeDrawerOutsideMobile = (event) => {
      if (!event.matches) closeSidebar(frame);
    };
    mobileViewport.addEventListener?.("change", closeDrawerOutsideMobile);
  }

  function init(root = document) {
    renderNavigation(root);
    bindSidebar(root);
    applySidebarMode(storedSidebarMode(), { persist: false, root });
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
    renderIcons();
  }

  global.PromoShell = {
    init,
    applyTheme,
    getTheme: storedTheme,
    renderNavigation,
    activeNavKey,
    applySidebarMode,
    getSidebarMode: storedSidebarMode,
    openSidebar,
    closeSidebar,
    navItems: NAV_ITEMS,
    storageKey: STORAGE_KEY,
    sidebarModeStorageKey: SIDEBAR_MODE_STORAGE_KEY,
  };
  global.PromoI18n?.subscribe?.(() => {
    renderNavigation(document);
    syncThemeControls(document);
    renderIcons();
  });
  global.PromoI18n?.init?.().catch(() => {});
  applyTheme(storedTheme(), { persist: false, root: document });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init(document), { once: true });
  else init(document);
})(window);
