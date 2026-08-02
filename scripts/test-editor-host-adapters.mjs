import assert from "node:assert/strict";
import { createAdminTemplateAdapter } from "../visual-editor/src/platform/adapters/admin-template-adapter.mjs";
import {
  PromoBuilderMessageType,
  createPromoBuilderAdapter,
} from "../visual-editor/src/platform/adapters/promo-builder-adapter.mjs";
import { createOutputAdapter } from "../visual-editor/src/platform/adapters/output-adapter.mjs";

const fetchCalls = [];
const admin = createAdminTemplateAdapter({
  fetchImpl: async (url, options = {}) => {
    fetchCalls.push({ url, options });
    return { ok: true, status: 200, json: async () => ({ ok: true, layout: { id: "layout-1" } }) };
  },
});
await admin.loadLayout("template A");
await admin.loadDesignTokenSets();
await admin.saveLayout({ templateId: "template-A" });
assert.equal(fetchCalls[0].url, "/api/wizard-form-template-layout?templateId=template%20A");
assert.equal(fetchCalls[1].url, "/api/design-token-sets?scope=public");
assert.equal(fetchCalls[2].options.method, "PATCH");
assert.equal(fetchCalls.length, 3);

const sentMessages = [];
const eventListeners = new Map();
const fakeWindow = {
  location: { origin: "https://builder.example" },
  parent: { postMessage: (message, origin) => sentMessages.push({ message, origin }) },
  addEventListener: (type, listener) => eventListeners.set(type, listener),
  removeEventListener: (type) => eventListeners.delete(type),
};
const promo = createPromoBuilderAdapter({ hostWindow: fakeWindow });
let received = null;
const unsubscribe = promo.connect((message) => { received = message; });
promo.notifyReady();
promo.notifyChange({ snapshotRevision: 3, designSpec: { theme: {} }, sectionInputs: { hero: {} } });
promo.requestSectionAiAction({ sectionKey: "hero", action: "generate", targetType: "section-background" });
assert.equal(sentMessages[0].message.type, PromoBuilderMessageType.READY);
assert.equal(sentMessages[1].message.type, PromoBuilderMessageType.CHANGE);
assert.equal(sentMessages[2].message.type, PromoBuilderMessageType.SECTION_AI_ACTION);
eventListeners.get("message")({ origin: "https://other.example", data: { type: "ignored" } });
assert.equal(received, null);
eventListeners.get("message")({ origin: "https://builder.example", data: { type: PromoBuilderMessageType.SNAPSHOT } });
assert.equal(received.type, PromoBuilderMessageType.SNAPSHOT);
unsubscribe();
assert.equal(eventListeners.has("message"), false);

const memory = new Map();
const opened = [];
const output = createOutputAdapter({
  storage: {
    setItem: (key, value) => memory.set(key, value),
    getItem: (key) => memory.get(key) || null,
  },
  openWindow: (...args) => opened.push(args),
  storageKey: "snapshot",
});
assert.equal(output.save({ id: "snapshot-1" }).ok, true);
assert.equal(output.load().id, "snapshot-1");
output.open();
assert.deepEqual(opened[0], ["/prototype/visual-output.html", "_blank", "noopener"]);

console.log("Editor host adapter tests passed.");
