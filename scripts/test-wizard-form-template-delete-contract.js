const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const storePath = require.resolve(path.join(root, "api", "_wizard-form-templates-store.js"));
const handlerPath = require.resolve(path.join(root, "api", "wizard-form-template-delete.js"));

let currentTemplate = {
  id: "11111111-1111-4111-8111-111111111111",
  template_key: "tpl_created",
  status: "draft",
  is_default: false,
};
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
    fetchTemplateRow: async () => currentTemplate,
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
  await handler({ method: "DELETE", body: {} }, response);
  assert.equal(response.statusCode, 400);

  response = createResponse();
  queryResults = [[], [{ id: "version-1", version: 1 }, { id: "version-2", version: 2 }]];
  await handler({ method: "DELETE", body: {}, query: { id: currentTemplate.id } }, response);
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, {
    ok: true,
    templateKey: "tpl_created",
    deletedVersionCount: 2,
  });
  assert.match(queryLog.at(-1).text, /delete from wizard_form_templates/);
  assert.match(queryLog.at(-1).text, /not exists/);

  response = createResponse();
  queryResults = [[{ id: "active-version", status: "active", is_default: true }]];
  await handler({ method: "DELETE", body: { id: currentTemplate.id }, query: {} }, response);
  assert.equal(response.statusCode, 409);
  assert.match(response.payload.message, /활성 또는 기본 템플릿은 삭제할 수 없습니다/);

  currentTemplate = null;
  response = createResponse();
  await handler({ method: "DELETE", body: { id: "missing" }, query: {} }, response);
  assert.equal(response.statusCode, 404);

  console.log("Wizard form template delete contract test passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
