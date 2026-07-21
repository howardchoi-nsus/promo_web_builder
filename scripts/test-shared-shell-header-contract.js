const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

const admin = read("prototype", "index.html");
const wizard = read("prototype", "promo-wizard.html");
const wizardScript = read("prototype", "promo-wizard.js");
const editorHtml = read("prototype", "visual-editor.html");
const editorApp = read("visual-editor", "src", "App.vue");
const appShellCss = read("prototype", "app-shell.css");
const legacyShellCss = read("prototype", "shared-shell-header.css");
const sharedScript = read("prototype", "shared-shell.js");

assert.match(appShellCss, /\.shell-header\s*\{/);
assert.match(appShellCss, /\.shell-nav \[aria-current="page"\]/);
assert.match(appShellCss, /@media \(max-width: 680px\)/);
assert.match(legacyShellCss, /@import url\("\.\/app-shell\.css\?v=app-shell-v1"\)/);
assert.match(sharedScript, /promoPrototype\.themeMode/);
assert.match(sharedScript, /data-shell-theme-toggle/);
assert.match(sharedScript, /const NAV_ITEMS/);
assert.match(sharedScript, /function renderNavigation/);

assert.match(admin, /class="topbar shell-header"/);
assert.match(admin, /data-shell-nav/);

assert.match(wizard, /class="shell-header"/);
assert.match(wizard, /data-shell-active="promo-wizard"/);
assert.match(wizard, /id="wizard-shell-status"/);
assert.match(wizardScript, /shellStatus\.textContent = `Step/);

assert.match(editorHtml, /app-shell\.css\?v=app-shell-v1/);
assert.match(editorHtml, /shared-shell\.js/);
assert.match(editorApp, /v-if="!isWizardLayoutMode" class="shell-header editor-shell-header"/);
assert.match(editorApp, /class="editor-header editor-toolbar"/);
assert.match(editorApp, /v-for="item in shellNavItems"/);
assert.match(editorApp, /window\.PromoShell\?\.init\(document\)/);

console.log("Shared shell header contract test passed");
