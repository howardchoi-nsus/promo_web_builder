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
const sharedCss = read("prototype", "shared-shell-header.css");
const sharedScript = read("prototype", "shared-shell.js");

assert.match(sharedCss, /\.shell-header\s*\{/);
assert.match(sharedCss, /\.shell-nav \[aria-current="page"\]/);
assert.match(sharedCss, /@media \(max-width: 680px\)/);
assert.match(sharedScript, /promoPrototype\.themeMode/);
assert.match(sharedScript, /data-shell-theme-toggle/);

assert.match(admin, /class="topbar shell-header"/);
assert.match(admin, /:aria-current="currentView === 'builder' \? 'page' : null"/);
assert.match(admin, /:aria-current="currentView === 'prompts' \? 'page' : null"/);

assert.match(wizard, /class="shell-header"/);
assert.match(wizard, /aria-current="page">Promo Wizard/);
assert.match(wizard, /id="wizard-shell-status"/);
assert.match(wizardScript, /shellStatus\.textContent = `Step/);

assert.match(editorHtml, /shared-shell-header\.css/);
assert.match(editorHtml, /shared-shell\.js/);
assert.match(editorApp, /v-if="!isWizardLayoutMode" class="shell-header editor-shell-header"/);
assert.match(editorApp, /class="editor-header editor-toolbar"/);
assert.match(editorApp, /aria-current="page">Visual Editor/);
assert.match(editorApp, /window\.PromoShell\?\.init\(document\)/);

console.log("Shared shell header contract test passed");
