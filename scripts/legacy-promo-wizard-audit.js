const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const LEGACY_RUNTIME_FILES = [
  "promo-wizard.html",
  "prototype/promo-wizard.html",
  "prototype/promo-wizard.js",
  "prototype/promo-wizard.css",
];
const ENTRY_POINT_FILES = ["index.html", "promo-wizard.html", "prototype/shared-shell.js"];
const REFERENCE_PATTERN = /promo-wizard(?:\.html|\.js|\.css)?/g;

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function countReferences(relativePath) {
  const source = read(relativePath);
  return (source.match(REFERENCE_PATTERN) || []).length;
}

function auditLegacyPromoWizard() {
  const runtimeFiles = LEGACY_RUNTIME_FILES.map((relativePath) => ({
    path: relativePath,
    exists: fs.existsSync(path.join(ROOT, relativePath)),
  }));
  const entryPoints = ENTRY_POINT_FILES
    .filter((relativePath) => fs.existsSync(path.join(ROOT, relativePath)))
    .map((relativePath) => ({ path: relativePath, references: countReferences(relativePath) }))
    .filter((entry) => entry.references > 0);
  const blockers = [];
  if (entryPoints.some((entry) => entry.path === "index.html")) {
    blockers.push("The root prototype index still exposes a Promo Wizard entry card.");
  }
  if (runtimeFiles.some((entry) => entry.exists)) {
    blockers.push("Dedicated Promo Wizard runtime files and storage behavior still exist.");
  }
  return {
    status: blockers.length ? "retirement_blocked" : "retirement_ready",
    runtimeFiles,
    entryPoints,
    blockers,
  };
}

if (require.main === module) {
  process.stdout.write(`${JSON.stringify(auditLegacyPromoWizard(), null, 2)}\n`);
}

module.exports = { auditLegacyPromoWizard };
