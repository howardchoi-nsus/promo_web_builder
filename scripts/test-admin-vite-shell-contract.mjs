import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveAdminShell } from "../admin-app/src/shell-contract.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "prototype", "index.html"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
const viteConfig = fs.readFileSync(path.join(root, "admin-app", "vite.config.js"), "utf8");

const mountTarget = {
  matches: (selector) => selector === "[data-shell-frame]",
};
const shell = resolveAdminShell({
  querySelector: (selector) => selector === "#app" ? mountTarget : null,
});
assert.equal(shell.mountSelector, "#app");
assert.throws(() => resolveAdminShell({ querySelector: () => null }), /mount target/);
assert.match(html, /type="module" src="\/prototype\/admin-assets\/admin-app\.js/);
assert.match(html, /@click="deleteWizardFormTemplate\(group\)"/);
assert.match(html, />삭제<\/button>/);
assert.match(html, /deleteWizardSection\(selectedWizardGroup\)/);
assert.match(html, /rel="stylesheet" href="\/prototype\/admin-assets\/promo-web-builder\.css\?v=admin-vite-v8"/);
assert.doesNotMatch(html, /unpkg\.com\/vue/);
assert.equal(packageJson.scripts["build:admin"], "vite build --config admin-app/vite.config.js");
assert.equal(vercelConfig.outputDirectory, ".");
assert.match(viteConfig, /codeSplitting:\s*false/);
assert.match(viteConfig, /@vitejs\/plugin-vue/);
assert.match(viteConfig, /plugins:\s*\[vue\(\)\]/);

console.log("Admin Vite shell contract test passed");
