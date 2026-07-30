const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

const context = {
  globalThis: null,
  requested: [],
};
context.globalThis = context;
context.PromoWizardCore = {
  async fetchJson(url) {
    context.requested.push(url);
    if (url.includes("templates-public")) {
      return { templates: [{ id: "default-id", templateKey: "default", isDefault: true }] };
    }
    return { template: { id: "default-id", templateKey: "default" }, sections: [] };
  },
  resolveActiveTemplate(templates, saved) {
    return templates.find((template) => template.id === saved?.id)
      || templates.find((template) => template.isDefault)
      || null;
  },
};
vm.createContext(context);
vm.runInContext(read("prototype", "wizard", "wizard-flow.js"), context);
vm.runInContext(read("prototype", "wizard", "wizard-template-service.js"), context);

const flow = context.PromoCreateFlow;
assert.equal(flow.STEPS.length, 4);
assert.equal(flow.resolveInitialStep("layout", "overview"), "layout");
assert.equal(flow.resolveInitialStep("invalid", "template"), "template");
assert.equal(flow.resolveInitialStep("", "overview", "0"), "overview");
assert.equal(flow.resolveInitialStep("", "overview", "2"), "template");
assert.equal(flow.resolveInitialStep("", "overview", "3"), "layout");
assert.equal(flow.resolveInitialStep("", "overview", "4"), "output");
assert.equal(flow.previousStep("overview"), "overview");
assert.equal(flow.nextStep("output"), "output");
assert.equal(flow.nextStep("template"), "layout");

(async () => {
  const service = context.PromoWizardTemplateService;
  const templates = await service.listPublicTemplates();
  assert.equal(templates.length, 1);
  assert.equal(service.resolveTemplate(templates, {}).id, "default-id");
  const loaded = await service.loadActiveTemplate({});
  assert.equal(loaded.detail.template.id, "default-id");
  assert.deepEqual(context.requested, [
    "/api/wizard-form-templates-public",
    "/api/wizard-form-templates-public",
    "/api/wizard-form-template-public?id=default-id",
  ]);

  const createHtml = read("prototype", "create-promo.html");
  const wizardHtml = read("prototype", "promo-wizard.html");
  const createJs = read("prototype", "create-promo.js");
  const wizardJs = read("prototype", "promo-wizard.js");
  assert.match(createHtml, /wizard-flow\.js/);
  assert.match(createHtml, /wizard-template-service\.js/);
  assert.match(wizardHtml, /wizard-template-service\.js/);
  assert.match(createJs, /resolveInitialStep/);
  assert.match(createJs, /listPublicTemplates/);
  assert.match(wizardJs, /loadPublicTemplate/);

  console.log("Wizard flow and template service tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
