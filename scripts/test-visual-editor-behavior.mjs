import assert from "node:assert/strict";
import {
  normalizeCtaUrl,
  persistSnapshot,
  withoutFreePosition,
} from "../visual-editor/src/editor-utils.mjs";
import { createSectionInputs } from "../visual-editor/src/contracts.js";

assert.equal(normalizeCtaUrl(" https://example.com/promo "), "https://example.com/promo");
assert.equal(normalizeCtaUrl("HTTP://example.com"), "HTTP://example.com");
assert.equal(normalizeCtaUrl("/promotions/welcome"), "/promotions/welcome");
assert.equal(normalizeCtaUrl("./next"), "./next");
assert.equal(normalizeCtaUrl("../previous"), "../previous");
assert.equal(normalizeCtaUrl("#terms"), "#terms");
assert.equal(normalizeCtaUrl("javascript:alert(1)"), "#");
assert.equal(normalizeCtaUrl(" JaVaScRiPt:alert(1) "), "#");
assert.equal(normalizeCtaUrl("java\nscript:alert(1)"), "#");
assert.equal(normalizeCtaUrl("data:text/html,test"), "#");
assert.equal(normalizeCtaUrl("//example.com/path"), "#");
assert.equal(normalizeCtaUrl("example.com/path"), "#");

assert.deepEqual(
  withoutFreePosition({
    positionMode: "free",
    xPct: 32,
    yPx: 140,
    yPct: 20,
    color: "#123456",
  }),
  { color: "#123456" },
);
assert.deepEqual(withoutFreePosition(), {});

const compositeInputs = createSectionInputs([{
  sectionKey: "hero",
  items: [{
    itemKey: "content",
    fields: [
      { fieldKey: "fld_title", fieldKind: "text", defaultValue: "Title" },
      { fieldKey: "fld_body", fieldKind: "text", defaultValue: "Body" },
      { fieldKey: "fld_image", fieldKind: "image", image: { allowedSources: ["ai"] } },
    ],
  }],
}], {});
assert.deepEqual(compositeInputs.hero.content, {
  fields: {
    fld_title: "Title",
    fld_body: "Body",
    fld_image: { source: "ai", value: "", description: "", alt: "" },
  },
});

const stored = new Map();
const successStorage = {
  setItem(key, value) {
    stored.set(key, value);
  },
};
const success = persistSnapshot(successStorage, "snapshot", { snapshotVersion: 1 });
assert.deepEqual(success, { ok: true, code: "saved", message: "" });
assert.deepEqual(JSON.parse(stored.get("snapshot")), { snapshotVersion: 1 });

const quotaError = new Error("quota");
quotaError.name = "QuotaExceededError";
const quotaResult = persistSnapshot({
  setItem() {
    throw quotaError;
  },
}, "snapshot", {});
assert.equal(quotaResult.ok, false);
assert.equal(quotaResult.code, "quota-exceeded");
assert.match(quotaResult.message, /저장 공간/);

const failureResult = persistSnapshot({
  setItem() {
    throw new Error("storage unavailable");
  },
}, "snapshot", {});
assert.equal(failureResult.ok, false);
assert.equal(failureResult.code, "storage-failed");
assert.match(failureResult.message, /저장하지 못했습니다/);

console.log("Visual Editor behavior test passed");
