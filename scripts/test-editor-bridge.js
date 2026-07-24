const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.resolve(__dirname, "..", "prototype", "wizard", "editor-bridge.js"),
  "utf8",
);
const host = { location: { origin: "https://builder.example" } };
const context = { globalThis: host };
vm.runInNewContext(source, context);

const sent = [];
const frameWindow = { postMessage: (message, origin) => sent.push({ message, origin }) };
let frame = { contentWindow: frameWindow };
const bridge = host.PromoEditorBridge.createEditorBridge({
  hostWindow: host,
  getFrame: () => frame,
});

assert.equal(bridge.isTrustedEvent({ origin: host.location.origin, source: frameWindow }), true);
assert.equal(bridge.isTrustedEvent({ origin: "https://evil.example", source: frameWindow }), false);
assert.equal(bridge.isTrustedEvent({ origin: host.location.origin, source: {} }), false);
assert.equal(bridge.postSnapshot({ id: "snapshot-1" }), true);
assert.equal(sent[0].message.type, "promo-wizard-layout-snapshot");
assert.equal(sent[0].origin, host.location.origin);
frame = null;
assert.equal(bridge.post({ type: "ignored" }), false);

console.log("Editor bridge tests passed");
