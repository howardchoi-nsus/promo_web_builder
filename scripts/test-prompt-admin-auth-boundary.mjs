import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const routes = [
  "prompt-templates.js",
  "prompt-template.js",
  "prompt-template-draft.js",
  "prompt-template-validate.js",
  "prompt-template-activate.js",
  "prompt-template-archive.js",
  "prompt-template-rollback.js",
  "prompt-template-translate.js",
];

for (const route of routes) {
  const source = readFileSync(new URL(`../api/${route}`, import.meta.url), "utf8");
  assert.match(source, /require\("\.\/_promo-admin-auth"\)/, `${route} must import the Admin auth boundary`);
  assert.match(source, /resolveAdminOwner\(req, res\)/, `${route} must require an Admin session`);
  assert.match(source, /private, no-store/, `${route} must disable caching`);
  const authIndex = source.indexOf("resolveAdminOwner(req, res)");
  const databaseIndex = source.indexOf("getSql()", authIndex);
  const bodyIndex = source.indexOf("parseBody(req.body)", authIndex);
  if (databaseIndex >= 0) assert.ok(authIndex < databaseIndex, `${route} must authenticate before DB access`);
  if (bodyIndex >= 0) assert.ok(authIndex < bodyIndex, `${route} must authenticate before body processing`);
}

const variablesRoute = readFileSync(new URL("../api/prompt-variables.js", import.meta.url), "utf8");
assert.doesNotMatch(variablesRoute, /resolveAdminOwner/, "Static prompt variable catalog remains public");

console.log("Prompt Admin authentication boundary contract tests passed.");
