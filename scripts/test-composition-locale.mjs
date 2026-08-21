import assert from "node:assert/strict";
import { resolveCompositionLocale } from "../visual-editor/src/shared/composition/composition-locale.mjs";

assert.equal(resolveCompositionLocale("ko", ["en-US", "ko-KR"], "en-US"), "ko-KR");
assert.equal(resolveCompositionLocale("EN_us", ["ko-KR", "en-US"], "ko-KR"), "en-US");
assert.equal(resolveCompositionLocale("ja", [], "ko-KR"), "ja");
assert.equal(resolveCompositionLocale("", ["en-US", "ko-KR"], "ko"), "ko-KR");
assert.equal(resolveCompositionLocale("fr", ["en-US", "ko-KR"], "en-US"), "en-US");

console.log("Composition locale tests passed.");
