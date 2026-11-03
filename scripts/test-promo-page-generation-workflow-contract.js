const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const workflowFiles = [
  "n8n/promo-ai-page-generator.workflow.json",
  "n8n/Promo AI Desktop Page Generator.external-prompt.fixed.json",
];

function nodeByName(workflow, name) {
  const node = workflow.nodes.find((item) => item.name === name);
  assert.ok(node, `${name} node is required`);
  return node;
}

const workflows = [];
for (const relativeFile of workflowFiles) {
  const workflow = JSON.parse(fs.readFileSync(path.join(root, relativeFile), "utf8"));
  workflows.push(workflow);
  const normalize = nodeByName(workflow, "Normalize Payload").parameters.jsCode;
  const load = nodeByName(workflow, "Load Page Generation Prompt").parameters;
  const build = nodeByName(workflow, "Build Page Generation Prompt").parameters.jsCode;
  const llm = nodeByName(workflow, "LLM Generate Promo Page").parameters;
  const parse = nodeByName(workflow, "Parse Generated Page JSON").parameters.jsCode;
  const validate = nodeByName(workflow, "Validate Generated Page").parameters;
  const browserGate = nodeByName(workflow, "Browser Quality Gate").parameters;
  const artifact = nodeByName(workflow, "Persist Promo Page Artifact").parameters;
  const response = nodeByName(workflow, "Build Promo Page Response").parameters.jsCode;

  assert.match(normalize, /promptVariables/);
  assert.match(normalize, /PROMO_PAGE_GENERATION_WEBHOOK_TOKEN/);
  assert.match(normalize, /x-promo-generation-token/);
  assert.match(normalize, /tokenMismatch/);
  for (const variable of [
    "brand", "slug", "designConceptSummary", "designPromptContext", "designConceptJson",
    "categories", "colors", "fonts", "promoJson", "designJson", "styleSource",
    "styleSourceLabel", "companyPreset", "hasOverride",
  ]) assert.match(normalize, new RegExp(`\\b${variable}\\b`));
  assert.doesNotMatch(normalize, /body\.model|promptUrl|prompt_url/);
  assert.doesNotMatch(normalize, /requiredPromo[^\n]*template/);
  assert.match(normalize, /requiredVisibleCopy/);
  assert.match(normalize, /allowedUrls/);
  assert.match(normalize, /promo\.ctaUrl must be an approved/);

  assert.equal(load.method, "POST");
  assert.equal(load.url, "={{$env.PROMPT_RENDER_URL}}");
  assert.match(load.jsonBody, /promo_page_generation/);
  assert.match(load.jsonBody, /promptVariables/);
  assert.ok(load.headerParameters.parameters.some((header) => (
    header.name === "Authorization" && header.value.includes("PROMPT_RUNTIME_SERVICE_TOKEN")
  )));

  assert.match(build, /loadedPrompt\.renderedPrompt/);
  assert.match(build, /loadedPrompt\.model/);
  assert.match(build, /loadedPrompt\.provider/);
  assert.match(build, /loadedPrompt\.modelOptions\?\.temperature/);
  assert.match(build, /loadedPrompt\.modelOptions\?\.maxTokens/);
  assert.match(build, /loadedPrompt\.modelOptions\?\.responseFormat/);
  assert.match(build, /store:\s*false/);
  assert.match(build, /input:\s*renderedPrompt/);
  assert.match(build, /text:\s*\{\s*format:\s*\{\s*type:\s*'json_object'/);
  assert.match(build, /max_output_tokens/);
  assert.match(build, /renderedPromptHash/);
  assert.match(build, /variableHash/);
  assert.match(build, /promptLayerSources/);
  assert.doesNotMatch(build, /temperature:\s*0\.38/);
  assert.doesNotMatch(build, /senior brand-faithful|role:\s*'system'/);
  assert.doesNotMatch(build, /input\.model|messages:\s*\[/);
  assert.match(llm.url, /\/v1\/responses$/);
  assert.ok(llm.headerParameters.parameters.some((header) => (
    header.name === "Authorization" && header.value.includes("OPENAI_API_KEY")
  )));

  assert.match(parse, /JSON\.parse/);
  assert.match(parse, /response\.output/);
  assert.match(parse, /output_text/);
  assert.equal(validate.url, "={{$env.PROMO_PAGE_VALIDATOR_URL}}");
  assert.match(validate.jsonBody, /requiredVisibleCopy/);
  assert.match(validate.jsonBody, /ctaUrl/);
  assert.match(validate.jsonBody, /allowedUrls/);
  assert.ok(validate.headerParameters.parameters.some((header) => (
    header.name === "Authorization" && header.value.includes("PROMPT_RUNTIME_SERVICE_TOKEN")
  )));

  assert.equal(browserGate.method, "POST");
  assert.equal(browserGate.url, "={{$env.PROMO_PAGE_BROWSER_QUALITY_GATE_URL}}");
  assert.match(browserGate.jsonBody, /generated:\s*\$json\.result/);
  assert.match(browserGate.jsonBody, /requiredVisibleCopy/);
  assert.match(browserGate.jsonBody, /ctaUrl/);
  assert.match(browserGate.jsonBody, /allowedUrls/);
  assert.match(browserGate.jsonBody, /artifactId/);
  assert.match(browserGate.jsonBody, /title/);
  assert.match(browserGate.jsonBody, /promptMeta/);
  assert.ok(browserGate.headerParameters.parameters.some((header) => (
    header.name === "Authorization" && header.value.includes("PROMO_PAGE_BROWSER_QUALITY_GATE_TOKEN")
  )));

  assert.equal(artifact.method, "POST");
  assert.equal(artifact.url, "={{$env.PROMO_PAGE_ARTIFACT_URL}}");
  for (const field of [
    "id", "result", "requiredVisibleCopy", "ctaUrl", "allowedUrls", "locale", "market", "title", "promptMeta",
    "browserQualityGate", "browserQualityAttestation",
  ]) assert.match(artifact.jsonBody, new RegExp(`\\b${field}\\b`));
  assert.ok(artifact.headerParameters.parameters.some((header) => (
    header.name === "Authorization" && header.value.includes("PROMPT_RUNTIME_SERVICE_TOKEN")
  )));

  assert.match(response, /browserQualityGate\?\.state !== 'passed'/);
  assert.match(response, /PROMO_PAGE_ARTIFACT_URL/);
  assert.match(response, /artifact\.pagePath/);
  assert.match(response, /artifact\.contentHash/);
  assert.match(response, /promptMeta/);
  assert.match(response, /safeInput/);
  assert.doesNotMatch(response, /\$getWorkflowStaticData|fullHtml|lang='ko'|stripDangerous/);

  for (const removed of ["Parse Validate Store Page", "View AI Promo Page", "Read Stored AI Page", "Render AI HTML Page"]) {
    assert.equal(workflow.nodes.some((node) => node.name === removed), false, `${removed} must be removed`);
    assert.equal(Object.hasOwn(workflow.connections, removed), false, `${removed} connection must be removed`);
  }
  assert.doesNotMatch(JSON.stringify(workflow), /\$getWorkflowStaticData|staticData\.pages|promo-ai-page-view/);
  assert.doesNotMatch(JSON.stringify(workflow), /promo-web-builder\.vercel\.app/);

  assert.equal(workflow.connections["LLM Generate Promo Page"].main[0][0].node, "Parse Generated Page JSON");
  assert.equal(workflow.connections["Parse Generated Page JSON"].main[0][0].node, "Validate Generated Page");
  assert.equal(workflow.connections["Validate Generated Page"].main[0][0].node, "Browser Quality Gate");
  assert.equal(workflow.connections["Browser Quality Gate"].main[0][0].node, "Persist Promo Page Artifact");
  assert.equal(workflow.connections["Persist Promo Page Artifact"].main[0][0].node, "Build Promo Page Response");
  assert.equal(workflow.connections["Build Promo Page Response"].main[0][0].node, "Return AI Page URL");
  assert.equal(workflow.versionId, "promo-ai-page-generator-v4-attested-browser-artifacts");
}

function semanticWorkflow(workflow) {
  return {
    nodes: workflow.nodes.map(({ id: _id, ...node }) => node),
    connections: workflow.connections,
    versionId: workflow.versionId,
  };
}
assert.deepEqual(semanticWorkflow(workflows[0]), semanticWorkflow(workflows[1]));

const renderRoute = fs.readFileSync(path.join(root, "api/prompts-render.js"), "utf8");
const legacyRoute = fs.readFileSync(path.join(root, "api/prompts/promo-page-generation.js"), "utf8");
const validationRoute = fs.readFileSync(path.join(root, "api/promo-page-generation-validate.js"), "utf8");
const artifactRoute = fs.readFileSync(path.join(root, "api/promo-page-generation-artifact.js"), "utf8");
for (const route of [renderRoute, legacyRoute, validationRoute]) {
  assert.match(route, /requirePromptRuntimeService\(req/);
  assert.match(route, /private, no-store/);
}
assert.match(artifactRoute, /requireService\(req/);
assert.match(artifactRoute, /private, no-store/);
assert.match(artifactRoute, /verifyBrowserQualityAttestation/);
assert.match(artifactRoute, /browserQualityGate/);

const browserService = fs.readFileSync(
  path.join(root, "scripts/promo-page-browser-quality-gate-service.mjs"),
  "utf8",
);
assert.match(browserService, /PROMO_PAGE_BROWSER_QUALITY_GATE_TOKEN/);
assert.match(browserService, /timingSafeEqual/);
assert.match(browserService, /assertPromoPageBrowserQuality/);
assert.match(browserService, /createBrowserQualityAttestation/);
assert.match(browserService, /attestationSecret\(process\.env\)/);
const attestationSource = fs.readFileSync(
  path.join(root, "api/_promo-page-browser-quality-attestation.js"),
  "utf8",
);
assert.match(attestationSource, /PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET/);
assert.match(attestationSource, /MAX_TTL_SECONDS = 120/);

console.log("Promo page generation managed workflow contract tests passed.");
