import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mutationRoutes = [
  "item-components.js",
  "item-component.js",
  "item-component-draft.js",
  "item-component-activate.js",
  "item-component-archive.js",
  "item-component-delete.js",
  "item-component-render-spec-validate.js",
  "reference-component-publish-plan.js",
  "reference-component-publish.js",
  "reference-component-publish-options.js",
];

for (const route of mutationRoutes) {
  const source = readFileSync(new URL(`../api/${route}`, import.meta.url), "utf8");
  assert.match(source, /require\("\.\/_promo-admin-auth"\)/, `${route} must import the Admin auth boundary`);
  assert.match(source, /resolveAdminOwner\(req, res\)/, `${route} must require an Admin session`);
  assert.match(source, /private, no-store/, `${route} must disable mutation caching`);
  const authIndex = source.indexOf("resolveAdminOwner(req, res)");
  const databaseIndex = source.indexOf("getSql()", authIndex);
  const bodyIndex = source.indexOf("parseBody(req.body)", authIndex);
  if (databaseIndex >= 0) assert.ok(authIndex < databaseIndex, `${route} must authenticate before DB access`);
  if (bodyIndex >= 0) assert.ok(authIndex < bodyIndex, `${route} must authenticate before body processing`);
}

for (const route of ["item-components.js", "item-component.js"]) {
  const source = readFileSync(new URL(`../api/${route}`, import.meta.url), "utf8");
  assert.ok(
    source.indexOf('if (req.method === "GET")') < source.indexOf("resolveAdminOwner(req, res)"),
    `${route} public GET must remain before the mutation auth boundary`,
  );
}

const usageRoute = readFileSync(new URL("../api/item-component-usage.js", import.meta.url), "utf8");
assert.doesNotMatch(usageRoute, /resolveAdminOwner/, "Read-only component usage remains public");

console.log("Item component Admin authentication boundary contract tests passed.");
