const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("prototype/index.html");
const app = read("prototype/app.js");
const components = read("prototype/app-components.css");
const generatedSources = [read("prototype/generated.js")];

assert.match(html, /adminTab === 'i18n'/);
assert.match(html, /admin\.i18n\.title/);
assert.match(html, /locale-manager-grid/);
assert.match(html, /activateSelectedLocaleMessages/);
assert.match(html, /admin\.i18n\.koreanText/);
assert.match(html, /admin\.i18n\.englishText/);
assert.match(app, /loadLocaleMessages/);
assert.match(app, /localeMessagesByLocale/);
assert.match(app, /koValue/);
assert.match(app, /enValue/);
assert.match(app, /saveLocaleMessageDraft/);
assert.match(app, /activateLocaleMessage/);
assert.match(app, /rollbackLocaleMessage/);
assert.match(app, /PromoI18n\?\.reloadSnapshot/);
assert.match(components, /\.app-table/);

for (const source of generatedSources) {
  assert.doesNotMatch(source, /PromoI18n|locale-snapshot|admin\.i18n\./, "generated promo output must remain outside admin i18n");
}

console.log("Admin i18n manager contract test passed");
