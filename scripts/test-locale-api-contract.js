const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const store = read("api/_locale-message-store.js");
const snapshot = read("api/locale-snapshot.js");
const locales = read("api/locales.js");
const localeDefault = read("api/locale-default.js");
const batchActivate = read("api/locale-messages-activate.js");
const rollback = read("api/locale-message-rollback.js");
const archive = read("api/locale-message-archive.js");

assert.match(store, /Intl\.getCanonicalLocales/);
assert.match(store, /MESSAGE_KEY_PATTERN = \/\^\[a-z\]/);
assert.match(store, /baselineValueFor/);
assert.match(store, /placeholder set must match baseline/);
assert.match(store, /pg_advisory_xact_lock/);
assert.match(store, /status = 'inactive'/);
assert.match(store, /snapshot_revision = snapshot_revision \+ 1/);
assert.match(store, /all ids must reference draft locale messages/);
assert.match(store, /only draft or inactive messages can be archived/);
assert.doesNotMatch(store, /innerHTML\s*=/);

assert.match(snapshot, /ETag/);
assert.match(snapshot, /Cache-Control/);
assert.match(snapshot, /if-none-match/);
assert.match(locales, /GET, POST, PATCH/);
assert.match(localeDefault, /setDefaultLocale/);
assert.match(batchActivate, /activateDrafts/);
assert.match(rollback, /rollbackVersion/);
assert.match(archive, /archiveVersion/);

[
  "api/locales.js",
  "api/locale-default.js",
  "api/locale-messages.js",
  "api/locale-snapshot.js",
  "api/locale-message.js",
  "api/locale-message-activate.js",
  "api/locale-messages-activate.js",
  "api/locale-message-archive.js",
  "api/locale-message-rollback.js",
  "api/locale-message-history.js",
].forEach((file) => assert.match(read(file), /Method not allowed/, `${file} must reject unsupported methods`));

console.log("Locale API contract test passed");
