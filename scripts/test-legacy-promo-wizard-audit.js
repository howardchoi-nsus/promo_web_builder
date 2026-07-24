const assert = require("node:assert/strict");
const { auditLegacyPromoWizard } = require("./legacy-promo-wizard-audit");

const audit = auditLegacyPromoWizard();
assert.equal(audit.status, "retirement_blocked");
assert.ok(audit.runtimeFiles.every((entry) => entry.exists));
assert.ok(audit.entryPoints.some((entry) => entry.path === "index.html"));
assert.ok(audit.blockers.some((message) => message.includes("entry card")));
assert.ok(audit.blockers.some((message) => message.includes("runtime files")));

console.log("Legacy Promo Wizard retirement audit passed");
