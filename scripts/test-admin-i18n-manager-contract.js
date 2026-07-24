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
assert.match(html, /<h2>\{\{ t\('entity\.section\.manage'\) \}\}<\/h2>/);
assert.match(html, /t\('entity\.template\.sectionConfig'\)/);
assert.match(html, /t\('entity\.component\.fieldLabel'\)/);
assert.match(html, /프로모션 빌더에서 사용할 섹션 구성과 최초 노출 레이아웃/);
assert.doesNotMatch(html, /섹션 CRUD|보관\(삭제\)|필수 Section|노출할 Section/);
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
