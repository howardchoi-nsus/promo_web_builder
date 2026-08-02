const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const componentSource = fs.readFileSync(
  path.join(root, "admin-app/src/components/TemplateLayoutManager.vue"),
  "utf8",
);
const serviceSource = fs.readFileSync(
  path.join(root, "admin-app/src/services/template-layout-service.mjs"),
  "utf8",
);
const adminHtml = fs.readFileSync(path.join(root, "prototype/index.html"), "utf8");
const adminApp = fs.readFileSync(path.join(root, "prototype/app.js"), "utf8");
const adminEntry = fs.readFileSync(path.join(root, "admin-app/src/main.js"), "utf8");

assert.match(serviceSource, /templateLayoutService = Object\.freeze/);
assert.match(serviceSource, /requestTemplateLayout/);
assert.match(componentSource, /name: "TemplateLayoutManager"/);
assert.match(componentSource, /templateLayoutService\.requestLayout/);
assert.match(componentSource, /templateLayoutService\.editorUrl/);
assert.match(componentSource, /requestRevision !== this\.requestRevision/);
assert.match(componentSource, /admin\.templateLayout\.revision/);
assert.match(componentSource, /template-live-preview__frame/);
assert.match(componentSource, /promo-admin-layout-saved/);
assert.match(componentSource, /event\.origin !== globalThis\.location\.origin/);
assert.doesNotMatch(componentSource, /템플릿 기본 레이아웃|레이아웃 편집 열기/);
assert.match(adminHtml, /<template-layout-manager/);
assert.match(adminHtml, /:translate="t"/);
assert.match(adminHtml, /admin-assets\/admin-app\.js/);
assert.match(adminEntry, /import TemplateLayoutManager/);
assert.match(adminEntry, /globalThis\.PromoAdminTemplateLayout = Object\.freeze/);
assert.match(adminApp, /adminApp\.component\("template-layout-manager"/);
assert.equal(
  fs.existsSync(path.join(root, "prototype/admin/template-layout-manager.js")),
  false,
  "legacy TemplateLayoutManager implementation must not remain after the SFC cutover",
);

console.log("Admin TemplateLayoutManager module contract test passed.");
