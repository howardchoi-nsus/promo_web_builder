const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

function read(relativePath) {
  return fs.readFileSync(path.resolve(__dirname, "..", relativePath), "utf8");
}

const compiler = read("api/_promo-registry-composition-compiler.js");
const operations = read("api/_promo-page-composition-operations.js");
const runtime = read("shared/promo-token-runtime.mjs");
const seed = read("db/seeds/005_seed_registry_composition_vertical_slice.sql");

assert.doesNotMatch(compiler, /#[0-9a-f]{3,8}\b/i);
assert.doesNotMatch(compiler, /Inter|Pretendard|sans-serif/i);
assert.doesNotMatch(compiler, /(?:0|\d+)ms|ease-out|linear/);
assert.doesNotMatch(runtime, /#[0-9a-f]{3,8}\b/i);
assert.doesNotMatch(runtime, /rgba?\(/i);
assert.doesNotMatch(operations, /var\(--app-(?:motion-duration|motion-easing),\s*[^)]+\)/);
assert.match(operations, /var\(--app-transition-duration-normal\)/);
assert.doesNotMatch(seed, /"backgroundColor":"#[0-9a-f]{6}"/i);
assert.match(compiler, /REQUIRED_DESIGN_TOKEN_MISSING/);
assert.match(compiler, /backgroundColorToken/);
assert.match(runtime, /tokens\["--app-radius"\]/);

console.log("Contract v3 design-token hardcoding guard passed");
