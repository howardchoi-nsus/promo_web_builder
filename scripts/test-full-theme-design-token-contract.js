const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const migration = read("db/migrations/038_full_theme_design_tokens.sql");
assert.match(migration, /value_index integer not null default 0/);
assert.match(migration, /value_light text not null default ''/);
assert.match(migration, /value_dark text not null default ''/);
assert.match(migration, /active_theme text not null default 'dark'/);
assert.match(migration, /primary key \(token_set_version_id, token_key, value_index\)/);
assert.match(migration, /'duration', 'easing'/);

const store = read("api/_design-token-store.js");
assert.match(store, /TOKEN_KEY_PATTERN = \/\^--\(\?:promo\|app\)/);
assert.match(store, /transition-duration/);
assert.match(store, /valueIndex/);
assert.match(store, /valueLight/);
assert.match(store, /valueDark/);
assert.match(store, /toRuntimeTokenMap/);

const catalog = read("api/design-token-catalog-import.js");
assert.match(catalog, /categoryLabel/);
assert.match(catalog, /cardinality/);
assert.match(catalog, /cssProperties/);
assert.match(catalog, /normalizeDefinitions/);

const importer = read("api/design-token-set-import.js");
assert.match(importer, /activeTheme \|\| "dark"/);
assert.match(importer, /value_dark/);
assert.match(importer, /registerCatalog/);
assert.match(importer, /value_index/);

const manager = read("admin-app/src/components/DesignTokenManager.vue");
assert.match(manager, /activeTheme: "dark"/);
assert.match(manager, /valueLight/);
assert.match(manager, /valueDark/);
assert.match(manager, /registerCatalog: true/);
assert.match(manager, /"css_properties"/);

const renderer = read("visual-editor/src/promo-renderer.css");
assert.match(renderer, /--promo-transition-duration/);
assert.match(renderer, /--promo-button-height/);
assert.match(renderer, /--promo-hero-bg-image/);
assert.doesNotMatch(renderer, /--app-/);

console.log("full theme design token contract passed");
