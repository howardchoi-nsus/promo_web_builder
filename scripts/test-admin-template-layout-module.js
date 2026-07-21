const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const moduleSource = fs.readFileSync(path.join(root, "prototype/admin/template-layout-manager.js"), "utf8");
const adminHtml = fs.readFileSync(path.join(root, "prototype/index.html"), "utf8");
const adminApp = fs.readFileSync(path.join(root, "prototype/app.js"), "utf8");

assert.match(moduleSource, /const service = Object\.freeze/);
assert.match(moduleSource, /requestLayout/);
assert.match(moduleSource, /name: "TemplateLayoutManager"/);
assert.match(adminHtml, /<template-layout-manager/);
assert.match(adminHtml, /admin\/template-layout-manager\.js/);
assert.match(adminApp, /adminApp\.component\("template-layout-manager"/);

console.log("Admin TemplateLayoutManager module contract test passed.");
