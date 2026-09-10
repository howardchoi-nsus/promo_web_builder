const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const storePath = require.resolve(path.join(root, "api", "_item-components-store.js"));
const activationPath = require.resolve(path.join(root, "api", "item-component-activate.js"));
const componentHandlerPath = require.resolve(path.join(root, "api", "item-component.js"));
const store = require(storePath);

const migration = fs.readFileSync(path.join(root, "db/migrations/066_component_render_spec_and_generation_foundation.sql"), "utf8");
const componentApi = fs.readFileSync(path.join(root, "api/item-component.js"), "utf8");
const createApi = fs.readFileSync(path.join(root, "api/item-components.js"), "utf8");
const draftApi = fs.readFileSync(path.join(root, "api/item-component-draft.js"), "utf8");
const activationApi = fs.readFileSync(path.join(root, "api/item-component-activate.js"), "utf8");

for (const column of [
  "render_contract_version", "render_tree", "render_responsive", "render_accessibility", "render_validation",
]) assert.match(migration, new RegExp(`add column if not exists ${column}`));
assert.match(migration, /render_contract_version is null[\s\S]*render_tree is null/);
assert.match(migration, /status <> 'active'[\s\S]*render_validation->>'ok' = 'true'/);
assert.match(migration, /create table if not exists component_design_sources/);
assert.match(migration, /create table if not exists component_generation_runs/);
assert.match(migration, /create table if not exists component_generation_proposals/);
assert.match(migration, /mime_type in \('image\/png', 'image\/jpeg', 'image\/webp'\)/);
assert.match(migration, /byte_size > 0 and byte_size <= 10485760/);
assert.match(migration, /unique \(run_id, proposal_version\)/);
assert.match(migration, /component_generation_proposals_apply_pair_chk/);

for (const source of [componentApi, draftApi, activationApi]) {
  assert.match(source, /render_contract_version/);
  assert.match(source, /render_validation/);
}
assert.match(componentApi, /prepareRenderSpecPersistence/);
assert.match(componentApi, /fetchRenderTokenCatalog/);
assert.match(componentApi, /validateVersionFieldKeys/);
assert.match(componentApi, /sql\.transaction\(\[/);
assert.match(createApi, /RenderSpec cannot be supplied during direct component creation/);
assert.match(draftApi, /source\.render_tree/);
assert.match(activationApi, /fetchVersionFields/);
assert.match(activationApi, /select id::text, status,[\s\S]*from wizard_item_component_versions[\s\S]*where id =/);
assert.match(activationApi, /sql\.transaction\(\[/);

const titleFieldKey = "fld_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const fields = [{ fieldKey: titleFieldKey, fieldKind: "text", isRequired: true }];
const tokenCatalog = [{ token_key: "--app-ink", css_property: "color" }];
const renderSpec = {
  contractVersion: 1,
  root: {
    nodeType: "field",
    tag: "h2",
    fieldKey: titleFieldKey,
    tokenBindings: { color: "--app-ink" },
  },
};
const invalidRootSpec = { ...renderSpec, root: { ...renderSpec.root, nodeType: "element" } };
const validElementRootSpec = {
  contractVersion: 1,
  root: {
    nodeType: "element",
    tag: "article",
    children: [renderSpec.root],
  },
};

const persistence = store.prepareRenderSpecPersistence(validElementRootSpec, { fields, tokenCatalog });
assert.equal(persistence.contractVersion, 1);
assert.equal(persistence.validation.ok, true);
assert.equal(persistence.validation.hash.length, 64);
assert.deepEqual(persistence.responsive, {});
assert.deepEqual(persistence.accessibility, {});
assert.deepEqual(store.prepareRenderSpecPersistence(null), {
  contractVersion: null,
  tree: null,
  responsive: null,
  accessibility: null,
  validation: null,
});
assert.throws(
  () => store.prepareRenderSpecPersistence(invalidRootSpec, { fields, tokenCatalog }),
  (error) => error.code === "INVALID_COMPONENT_RENDER_SPEC",
);

const legacy = store.toComponent({
  id: "component-id", component_key: "cmp_key", name: "Legacy", component_status: "active",
  version_id: "version-1", version: 1, version_status: "active", field_kind: "text",
});
assert.equal(Object.prototype.hasOwnProperty.call(legacy, "renderSpec"), false, "Legacy API shape must remain unchanged");

const rendered = store.toComponent({
  id: "component-id", component_key: "cmp_key", name: "Rendered", component_status: "active",
  version_id: "version-2", version: 2, version_status: "draft", field_kind: "text",
  render_contract_version: 1,
  render_tree: persistence.tree,
  render_responsive: persistence.responsive,
  render_accessibility: persistence.accessibility,
  render_validation: persistence.validation,
  active_version_id: "version-1", active_version: 1, active_version_status: "active", active_field_kind: "text",
});
assert.deepEqual(rendered.renderSpec, {
  contractVersion: 1,
  root: persistence.tree,
  responsive: {},
  accessibility: {},
});
assert.equal(rendered.renderValidation.hash, persistence.validation.hash);
assert.equal(Object.prototype.hasOwnProperty.call(rendered.activeVersion, "renderSpec"), false);

function createResponse() {
  return {
    statusCode: 200,
    payload: null,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

async function runActivation(targetSpec) {
  const queryLog = [];
  let transactionCalls = 0;
  const sql = async (strings, ...values) => {
    queryLog.push({ text: strings.join("?"), values });
    if (queryLog.length === 1) return [{
      id: "version-2",
      status: "draft",
      render_contract_version: 1,
      render_tree: targetSpec.root,
      render_responsive: targetSpec.responsive || {},
      render_accessibility: targetSpec.accessibility || {},
      render_validation: {},
    }];
    return [];
  };
  sql.transaction = async (queries) => {
    transactionCalls += 1;
    return Promise.all(queries);
  };
  require.cache[storePath] = {
    id: storePath,
    filename: storePath,
    loaded: true,
    exports: {
      ...store,
      getSql: () => sql,
      fetchVersionFields: async () => new Map([["version-2", fields]]),
      fetchRenderTokenCatalog: async () => tokenCatalog,
      fetchComponent: async () => ({ id: "component-id", versionId: "version-2" }),
    },
  };
  delete require.cache[activationPath];
  const handler = require(activationPath);
  const response = createResponse();
  await handler({
    method: "POST",
    body: { componentId: "component-id", versionId: "version-2" },
  }, response);
  return { response, queryLog, transactionCalls };
}

async function runDraftPatch(targetSpec) {
  const queryLog = [];
  let transactionCalls = 0;
  const sql = async (strings, ...values) => {
    queryLog.push({ text: strings.join("?"), values });
    if (queryLog.length === 1) return [{ id: "version-2", status: "draft", render_contract_version: null }];
    return [];
  };
  sql.transaction = async (queries) => {
    transactionCalls += 1;
    return Promise.all(queries);
  };
  require.cache[storePath] = {
    id: storePath,
    filename: storePath,
    loaded: true,
    exports: {
      ...store,
      getSql: () => sql,
      fetchRenderTokenCatalog: async () => tokenCatalog,
      validateVersionFieldKeys: async () => {},
      buildReplaceVersionFieldsQuery: (query, versionId, nextFields) => query`
        replace fields for ${versionId} using ${JSON.stringify(nextFields)}
      `,
      fetchComponent: async () => ({ id: "component-id", versionId: "version-2" }),
    },
  };
  delete require.cache[componentHandlerPath];
  const handler = require(componentHandlerPath);
  const response = createResponse();
  await handler({
    method: "PATCH",
    query: { componentId: "component-id" },
    body: {
      versionId: "version-2",
      name: "Rendered component",
      fields: [{ ...fields[0], name: "Title", textType: "title" }],
      libraryPresentation: {},
      placementPolicy: {},
      renderSpec: targetSpec,
    },
  }, response);
  return { response, queryLog, transactionCalls };
}

(async () => {
  const validPatch = await runDraftPatch(validElementRootSpec);
  assert.equal(validPatch.response.statusCode, 200);
  assert.equal(validPatch.queryLog.length, 4);
  assert.equal(validPatch.transactionCalls, 1, "Draft writes must share one transaction");
  assert.match(validPatch.queryLog[2].text, /render_tree/);
  assert.match(validPatch.queryLog[2].values.find((value) => typeof value === "string" && value.includes('"hash"')), /"ok":true/);

  const invalidPatch = await runDraftPatch({ contractVersion: 1, root: { nodeType: "element", tag: "iframe" } });
  assert.equal(invalidPatch.response.statusCode, 422);
  assert.equal(invalidPatch.response.payload.validation.ok, false);
  assert.equal(invalidPatch.queryLog.length, 1, "Invalid RenderSpec must be rejected before draft updates");
  assert.equal(invalidPatch.transactionCalls, 0, "Invalid RenderSpec must not start a draft transaction");

  const validActivation = await runActivation(validElementRootSpec);
  assert.equal(validActivation.response.statusCode, 200);
  assert.equal(validActivation.queryLog.length, 3);
  assert.equal(validActivation.transactionCalls, 1, "Version status changes must share one transaction");
  assert.match(validActivation.queryLog[2].text, /render_validation/);
  assert.match(validActivation.queryLog[2].values.find((value) => typeof value === "string" && value.includes('"hash"')), /"ok":true/);

  const invalidActivation = await runActivation({ contractVersion: 1, root: { nodeType: "element", tag: "script" } });
  assert.equal(invalidActivation.response.statusCode, 422);
  assert.equal(invalidActivation.response.payload.validation.ok, false);
  assert.equal(invalidActivation.queryLog.length, 1, "Invalid RenderSpec must be rejected before status updates");
  assert.equal(invalidActivation.transactionCalls, 0, "Invalid RenderSpec must not start an activation transaction");

  console.log("Component RenderSpec persistence and activation contract tests passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
