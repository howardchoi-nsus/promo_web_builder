(function initializePromoShell(global) {
  const STORAGE_KEY = "promoPrototype.themeMode";
  const NAV_ITEMS = Object.freeze([
    { key: "builder", label: "프로모션 빌더", href: "/prototype/index.html" },
    { key: "admin", label: "관리자 페이지", href: "/prototype/index.html?view=admin&tab=promo-form" },
    { key: "promo-wizard", label: "Promo Wizard", href: "/promo-wizard.html" },
    { key: "create-promo", label: "Create Promo", href: "/create-promo.html" },
    { key: "visual-editor", label: "Visual Editor", href: "/prototype/visual-editor.html" },
    { key: "generated", label: "생성된 UI", href: "/prototype/generated.html" },
  ]);

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
        const link = document.createElement("a");
        link.href = item.href;
        link.textContent = item.label;
        link.dataset.shellNavKey = item.key;
        if (item.key === active) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
        return link;
      }));
    });
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
    frame.querySelector("[data-shell-sidebar]")?.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeSidebar(frame);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && frame.classList.contains("is-sidebar-open")) closeSidebar(frame);
    });
  }

  function init(root = document) {
    renderNavigation(root);
    bindSidebar(root);
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

  global.PromoShell = {
    init,
    applyTheme,
    getTheme: storedTheme,
    renderNavigation,
    activeNavKey,
    openSidebar,
    closeSidebar,
    navItems: NAV_ITEMS,
    storageKey: STORAGE_KEY,
  };
  applyTheme(storedTheme(), { persist: false, root: document });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init(document), { once: true });
  else init(document);
})(window);
