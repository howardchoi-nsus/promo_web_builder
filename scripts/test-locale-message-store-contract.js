const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const store = require("../api/_locale-message-store");

const root = path.resolve(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "db/migrations/027_locale_messages.sql"), "utf8");
const seed = fs.readFileSync(path.join(root, "scripts/seed-locale-baseline.js"), "utf8");

assert.equal(store.canonicalizeLocale("ko-kr"), "ko-KR");
assert.equal(store.canonicalizeLocale("EN-us"), "en-US");
assert.throws(() => store.canonicalizeLocale("not_a_locale"), /BCP 47/);
assert.equal(store.validateMessageKey("entity.section.selectPrompt"), "entity.section.selectPrompt");
assert.throws(() => store.validateMessageKey("Entity.Section Name"), /lower camelCase/);
assert.deepEqual(store.extractPlaceholders("{count} / {name}"), ["count", "name"]);
assert.equal(store.validateMessageValue("{count}개", { baselineValue: "{count} items" }), "{count}개");
assert.throws(() => store.validateMessageValue("항목", { baselineValue: "{count} items" }), /placeholder set/);
assert.throws(() => store.validateMessageValue("<strong>unsafe</strong>"), /HTML/);

assert.match(migration, /unique \(locale, message_key, version\)/);
assert.match(migration, /where status = 'active'/);
assert.match(migration, /where status = 'draft'/);
assert.match(migration, /on delete restrict/);
assert.match(migration, /snapshot_revision bigint/);
assert.match(migration, /locale_message_audit_logs/);
assert.doesNotMatch(migration, /unique \(locale, message_key\)\s*\)/);
assert.match(seed, /where not exists/);
assert.doesNotMatch(store.toString(), /ensureDefault|seedLocale/);

console.log("Locale message store contract test passed");
