const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

const admin = read("prototype", "index.html");
const wizard = read("prototype", "promo-wizard.html");
const wizardScript = read("prototype", "promo-wizard.js");
const generated = read("prototype", "generated.html");
const generatedScript = read("prototype", "generated.js");
const editorHtml = read("prototype", "visual-editor.html");
const editorApp = read("visual-editor", "src", "App.vue");
const appShellCss = read("prototype", "app-shell.css");
const legacyShellCss = read("prototype", "shared-shell-header.css");
const sharedScript = read("prototype", "shared-shell.js");
const lucideBundle = read("prototype", "vendor", "lucide", "lucide.min.js");
const lucideLicense = read("prototype", "vendor", "lucide", "LICENSE");

assert.match(appShellCss, /\.shell-frame\s*\{/);
assert.match(appShellCss, /\.shell-sidebar\s*\{/);
assert.match(appShellCss, /\.shell-utility-bar\s*\{/);
assert.match(appShellCss, /\.shell-nav--vertical\s*\{/);
assert.match(appShellCss, /\.shell-nav \[aria-current="page"\]/);
assert.match(appShellCss, /@media \(max-width: 1023px\)/);
assert.match(appShellCss, /visibility:\s*hidden/);
assert.match(appShellCss, /\.shell-frame\.is-sidebar-open \.shell-sidebar\s*\{[\s\S]*?visibility:\s*visible/);
assert.match(appShellCss, /pointer-events:\s*none/);
assert.match(appShellCss, /\.shell-frame\.is-sidebar-open \.shell-overlay\s*\{[\s\S]*?visibility:\s*visible/);
assert.match(appShellCss, /\.shell-nav a:focus-visible/);
assert.match(appShellCss, /outline:\s*2px solid var\(--app-focus\)/);
assert.match(appShellCss, /\.shell-frame\.is-sidebar-minimized/);
assert.match(appShellCss, /var\(--app-sidebar-width-min\)/);
assert.match(legacyShellCss, /@import url\("\.\/app-shell\.css\?v=app-shell-v1"\)/);
assert.match(sharedScript, /promoPrototype\.themeMode/);
assert.match(sharedScript, /promoPrototype\.sidebarMode/);
assert.match(sharedScript, /data-shell-theme-toggle/);
assert.match(sharedScript, /data-shell-sidebar-mode/);
assert.match(sharedScript, /matchMedia\("\(max-width: 1023px\)"\)/);
assert.match(sharedScript, /mobileViewport\.addEventListener\?\.\("change", closeDrawerOutsideMobile\)/);
assert.match(sharedScript, /const NAV_ITEMS/);
assert.match(sharedScript, /icon:\s*"layout-dashboard"/);
assert.match(sharedScript, /function renderNavigation/);
assert.match(sharedScript, /function applySidebarMode/);
assert.match(sharedScript, /dataset\.shellSidebarState = mode/);
assert.match(sharedScript, /global\.lucide\?\.createIcons/);
assert.match(sharedScript, /function openSidebar/);
assert.match(sharedScript, /function closeSidebar/);
assert.match(sharedScript, /event\.key === "Escape"/);
assert.match(sharedScript, /shell-drawer-open/);
assert.match(lucideBundle, /lucide/i);
assert.match(lucideLicense, /ISC License/);

assert.match(admin, /class="app-shell shell-frame" data-shell-frame/);
assert.match(admin, /class="shell-sidebar"/);
assert.match(admin, /class="shell-utility-bar"/);
assert.match(admin, /data-shell-nav/);
assert.match(admin, /lucide\.min\.js\?v=1\.8\.0/);
assert.match(admin, /data-shell-sidebar-mode="min"/);
assert.match(admin, /data-shell-sidebar-mode="max"/);

assert.match(wizard, /class="shell-frame" data-shell-frame/);
assert.match(wizard, /class="shell-sidebar"/);
assert.match(wizard, /class="shell-utility-bar"/);
assert.match(wizard, /data-shell-active="promo-wizard"/);
assert.match(wizard, /id="wizard-shell-status"/);
assert.match(wizardScript, /shellStatus\.textContent = `Step/);

assert.match(editorHtml, /app-shell\.css\?v=app-shell-sidebar-v3/);
assert.match(editorHtml, /shared-shell\.js/);
assert.match(editorApp, /v-if="!usesEmbeddedEngineShell" class="shell-sidebar"/);
assert.match(editorApp, /class="shell-utility-bar editor-shell-header"/);
assert.match(editorApp, /class="editor-header editor-toolbar"/);
assert.match(editorApp, /v-for="item in shellNavItems"/);
assert.match(editorApp, /window\.PromoShell\?\.init\(document\)/);

assert.match(generated, /class="generated-shell shell-frame" data-shell-frame/);
assert.match(generated, /data-shell-active="generated"/);
assert.match(generated, /app-shell\.css/);
assert.match(generatedScript, /window\.PromoShell\?\.init\(document\)/);

console.log("Shared shell header contract test passed");
