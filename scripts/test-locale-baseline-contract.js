const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const keyPattern = /^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/;
const placeholderPattern = /\{([A-Za-z][A-Za-z0-9]*)\}/g;
const allowedNamespaces = new Set(["common", "entity", "admin", "builder", "shell"]);

function readLocale(locale) {
  return JSON.parse(fs.readFileSync(path.join(root, "locales", `${locale}.json`), "utf8"));
}

function placeholders(value) {
  return [...String(value).matchAll(placeholderPattern)].map((match) => match[1]).sort();
}

const ko = readLocale("ko");
const en = readLocale("en");
const koKeys = Object.keys(ko).sort();
const enKeys = Object.keys(en).sort();

assert.deepEqual(enKeys, koKeys, "ko/en baseline key sets must match");
assert(koKeys.length > 0, "locale baseline must not be empty");

koKeys.forEach((key) => {
  assert.match(key, keyPattern, `invalid locale message key: ${key}`);
  assert(allowedNamespaces.has(key.split(".")[0]), `unsupported namespace: ${key}`);
  [ko[key], en[key]].forEach((value) => {
    assert.equal(typeof value, "string", `${key} must map to a string`);
    assert(value.trim(), `${key} must not be blank`);
    assert.doesNotMatch(value, /<\/?[a-z][^>]*>/i, `${key} must not contain HTML`);
    assert.doesNotMatch(value, /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/, `${key} contains a control character`);
  });
  assert.deepEqual(placeholders(en[key]), placeholders(ko[key]), `${key} placeholder sets must match`);
});

[
  "entity.section.key",
  "entity.item.label",
  "common.action.update",
  "common.action.edit",
  "admin.i18n.title",
].forEach((key) => assert(koKeys.includes(key), `required terminology key is missing: ${key}`));

assert.equal(ko["entity.section.key"], "섹션 식별자");
assert.equal(ko["entity.item.label"], "항목");
assert.equal(ko["common.action.update"], "수정");
assert.equal(ko["common.action.edit"], "편집");

console.log(`Locale baseline contract test passed (${koKeys.length} keys)`);
