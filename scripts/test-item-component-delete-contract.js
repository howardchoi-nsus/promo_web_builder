const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const storePath = require.resolve(path.join(root, "api", "_item-components-store.js"));
const handlerPath = require.resolve(path.join(root, "api", "item-component-delete.js"));

let queryResults = [];
const queryLog = [];
const sql = async (strings, ...values) => {
  queryLog.push({ text: strings.join("?"), values });
  return queryResults.shift() || [];
};

require.cache[storePath] = {
  id: storePath,
  filename: storePath,
  loaded: true,
  exports: {
    getSql: () => sql,
    parseBody: (body) => body || {},
  },
};
delete require.cache[handlerPath];
const handler = require(handlerPath);

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    payload: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

(async () => {
  let response = createResponse();
  await handler({ method: "POST", body: {} }, response);
  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, "DELETE");

  response = createResponse();
  await handler({ method: "DELETE", body: {}, query: {} }, response);
  assert.equal(response.statusCode, 400);

  response = createResponse();
  queryResults = [
    [{ id: "component-id", component_key: "cmp_created", system_seed_code: null, name: "Created", status: "archived" }],
    [],
    [{ id: "job-id" }],
    [{ id: "run-id" }],
    [{ id: "instance-id" }],
    [{ id: "version-1" }, { id: "version-2" }],
    [{ id: "component-id", component_key: "cmp_created" }],
  ];
  await handler({ method: "DELETE", body: {}, query: { componentId: "component-id" } }, response);
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, {
    ok: true,
    componentId: "component-id",
    componentKey: "cmp_created",
    deletedVersionCount: 2,
    deletedInstanceCount: 1,
    cancelledDesignRunCount: 1,
    updatedAssetJobCount: 1,
  });
  const instanceDeleteIndex = queryLog.findIndex((query) => /delete from wizard_content_section_component_instances/.test(query.text));
  const versionDeleteIndex = queryLog.findIndex((query) => /delete from wizard_item_component_versions/.test(query.text));
  const componentDeleteIndex = queryLog.findIndex((query) => /delete from wizard_item_components/.test(query.text));
  assert.ok(instanceDeleteIndex >= 0 && instanceDeleteIndex < versionDeleteIndex);
  assert.ok(versionDeleteIndex < componentDeleteIndex);
  assert.ok(queryLog.some((query) => /component_instance_id = null/.test(query.text)));
  assert.ok(queryLog.some((query) => /COMPONENT_DELETED/.test(query.text)));

  response = createResponse();
  queryResults = [
    [{ id: "component-id", component_key: "cmp_created", system_seed_code: null, name: "Created", status: "active" }],
    [{ id: "section-id", section_key: "section-key", name: "Hero", version: 1, status: "draft", item_key: "title" }],
  ];
  await handler({ method: "DELETE", body: { componentId: "component-id" }, query: {} }, response);
  assert.equal(response.statusCode, 409);
  assert.equal(response.payload.usageCount, 1);
  assert.match(response.payload.message, /사용 중인 컴포넌트는 삭제할 수 없습니다/);

  response = createResponse();
  queryResults = [[{ id: "system-id", component_key: "cmp_system", system_seed_code: "title", name: "Title", status: "active" }]];
  await handler({ method: "DELETE", body: { componentId: "system-id" }, query: {} }, response);
  assert.equal(response.statusCode, 409);
  assert.match(response.payload.message, /시스템 기본 컴포넌트/);

  response = createResponse();
  queryResults = [[]];
  await handler({ method: "DELETE", body: { componentId: "missing" }, query: {} }, response);
  assert.equal(response.statusCode, 404);

  console.log("Item component delete contract test passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
