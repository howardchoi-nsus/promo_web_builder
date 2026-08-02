const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const storePath = require.resolve(path.join(root, "api", "_wizard-content-sections-store.js"));
const handlerPath = require.resolve(path.join(root, "api", "wizard-content-section-delete.js"));
const fs = require("node:fs");

let currentSection = {
  id: "22222222-2222-4222-8222-222222222222",
  section_key: "sec_created",
  name: "Created Section",
  status: "draft",
  version: 1,
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
    fetchSectionRow: async () => currentSection,
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
  queryResults = [
    [],
    [{ id: "asset-job-1" }],
    [{ id: "design-run-1" }],
    [{ id: "membership-1" }],
    [{ id: "section-v1", version: 1 }, { id: "section-v2", version: 2 }],
  ];
  await handler({ method: "DELETE", body: {}, query: { id: currentSection.id } }, response);
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, {
    ok: true,
    sectionKey: "sec_created",
    deletedVersionCount: 2,
    deletedMembershipCount: 1,
    cancelledDesignRunCount: 1,
    updatedAssetJobCount: 1,
  });
  const membershipDeleteIndex = queryLog.findIndex((query) => /delete from wizard_form_template_sections/.test(query.text));
  const sectionDeleteIndex = queryLog.findIndex((query) => /delete from wizard_content_sections/.test(query.text));
  assert.ok(membershipDeleteIndex >= 0 && membershipDeleteIndex < sectionDeleteIndex);
  assert.ok(queryLog.some((query) => /component_instance_id = null/.test(query.text)));
  assert.ok(queryLog.some((query) => /update promo_section_design_runs/.test(query.text)));

  response = createResponse();
  queryResults = [[{
    id: "template-id",
    template_key: "default",
    name: "Default",
    version: 1,
    status: "draft",
  }]];
  await handler({ method: "DELETE", body: {}, query: { id: currentSection.id } }, response);
  assert.equal(response.statusCode, 409);
  assert.match(response.payload.message, /사용 중인 Section Preset은 삭제할 수 없습니다/);
  assert.equal(response.payload.usage.length, 1);

  currentSection = null;
  response = createResponse();
  await handler({ method: "DELETE", body: {}, query: { id: "missing" } }, response);
  assert.equal(response.statusCode, 404);

  const usageSource = fs.readFileSync(path.join(root, "api", "wizard-content-section-usage.js"), "utf8");
  assert.match(usageSource, /with target_section as/);
  assert.match(usageSource, /membership\.section_key in \(select section_key from target_section\)/);
  assert.match(usageSource, /section\.section_key in \(select section_key from target_section\)/);

  console.log("Wizard content section delete contract test passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
