const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  DISABLED_CODE,
  templateLayoutManagementEnabled,
  allowTemplateLayoutWrite,
} = require("../api/_template-layout-management");

assert.equal(templateLayoutManagementEnabled({}), true);
assert.equal(templateLayoutManagementEnabled({ TEMPLATE_LAYOUT_MANAGEMENT_ENABLED: "false" }), false);

const responses = [];
const res = {
  status(status) {
    return { json: (body) => { responses.push({ status, body }); return body; } };
  },
};
assert.equal(allowTemplateLayoutWrite(res, { TEMPLATE_LAYOUT_MANAGEMENT_ENABLED: "false" }), false);
assert.deepEqual(responses[0], {
  status: 409,
  body: {
    error: "Template and page layout management is disabled",
    code: DISABLED_CODE,
    message: "기존 템플릿은 계속 사용할 수 있지만 신규 생성과 변경은 비활성화되어 있습니다.",
  },
});

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const writeEndpoints = [
  "api/wizard-form-templates.js",
  "api/wizard-form-template.js",
  "api/wizard-form-template-activate.js",
  "api/wizard-form-template-deactivate.js",
  "api/wizard-form-template-archive.js",
  "api/wizard-form-template-delete.js",
  "api/wizard-form-template-sections.js",
  "api/wizard-form-template-sections-order.js",
  "api/wizard-form-template-layout.js",
];
writeEndpoints.forEach((file) => {
  assert.match(read(file), /allowTemplateLayoutWrite/);
});

const layoutApi = read("api/wizard-form-template-layout.js");
assert.match(layoutApi, /templateLayoutManagementEnabled\(\)[\s\S]*?fetchLayoutRow/);

const adminHtml = read("prototype/index.html");
const adminApp = read("prototype/app.js");
assert.match(adminHtml, /v-if="templateLayoutManagementEnabled"[\s\S]*?템플릿·레이아웃 관리/);
assert.match(adminApp, /loadAdminCapabilities/);
assert.match(adminApp, /tab === "promo-form" && !this\.templateLayoutManagementEnabled/);

const compiler = read("api/_promo-registry-composition-compiler.js");
assert.match(compiler, /sourceType:\s*"composition-shell"/);
assert.match(compiler, /runtimeTheme/);
assert.match(compiler, /sourceTemplateId:\s*null/);

function responseRecorder() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

(async () => {
  const previous = process.env.TEMPLATE_LAYOUT_MANAGEMENT_ENABLED;
  process.env.TEMPLATE_LAYOUT_MANAGEMENT_ENABLED = "false";
  try {
    const writeRequests = [
      ["../api/wizard-form-templates", { method: "POST", body: {}, query: {} }],
      ["../api/wizard-form-template", { method: "PATCH", body: {}, query: {} }],
      ["../api/wizard-form-template-activate", { method: "POST", body: {}, query: {} }],
      ["../api/wizard-form-template-deactivate", { method: "POST", body: {}, query: {} }],
      ["../api/wizard-form-template-archive", { method: "POST", body: {}, query: {} }],
      ["../api/wizard-form-template-delete", { method: "DELETE", body: {}, query: {} }],
      ["../api/wizard-form-template-sections", { method: "PATCH", body: {}, query: {} }],
      ["../api/wizard-form-template-sections-order", { method: "POST", body: {}, query: {} }],
      ["../api/wizard-form-template-layout", { method: "PATCH", body: {}, query: {} }],
    ];
    for (const [modulePath, req] of writeRequests) {
      const response = responseRecorder();
      await require(modulePath)(req, response);
      assert.equal(response.statusCode, 409, modulePath);
      assert.equal(response.body.code, DISABLED_CODE, modulePath);
    }
  } finally {
    if (previous === undefined) delete process.env.TEMPLATE_LAYOUT_MANAGEMENT_ENABLED;
    else process.env.TEMPLATE_LAYOUT_MANAGEMENT_ENABLED = previous;
  }
  console.log("Template and page layout management deactivation tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
