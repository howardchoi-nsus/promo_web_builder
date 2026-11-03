import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonicalPath = path.join(root, "n8n/promo-ai-page-generator.workflow.json");
const importPath = path.join(root, "n8n/Promo AI Desktop Page Generator.external-prompt.fixed.json");

const removeNames = new Set([
  "Parse Validate Store Page",
  "View AI Promo Page",
  "Read Stored AI Page",
  "Render AI HTML Page",
  "Browser Quality Gate",
  "Persist Promo Page Artifact",
  "Build Promo Page Response",
]);

const browserQualityNode = {
  parameters: {
    method: "POST",
    url: "={{$env.PROMO_PAGE_BROWSER_QUALITY_GATE_URL}}",
    sendHeaders: true,
    headerParameters: {
      parameters: [
        {
          name: "Authorization",
          value: "={{ 'Bearer ' + $env.PROMO_PAGE_BROWSER_QUALITY_GATE_TOKEN }}",
        },
        { name: "Content-Type", value: "application/json" },
      ],
    },
    sendBody: true,
    contentType: "json",
    specifyBody: "json",
    jsonBody: "={{ JSON.stringify({ artifactId: $('Build Page Generation Prompt').item.json.id, title: $('Build Page Generation Prompt').item.json.promo.title, promptMeta: $('Build Page Generation Prompt').item.json.promptMeta, generated: $json.result, requiredVisibleCopy: $('Build Page Generation Prompt').item.json.requiredVisibleCopy, ctaUrl: $('Build Page Generation Prompt').item.json.promo.ctaUrl, allowedUrls: $('Build Page Generation Prompt').item.json.allowedUrls, locale: $('Build Page Generation Prompt').item.json.promo.locale || '', market: $('Build Page Generation Prompt').item.json.promo.market || '' }) }}",
    options: { timeout: 45000 },
  },
  id: "9118d18d-f68b-4db4-81e4-710000000075",
  name: "Browser Quality Gate",
  type: "n8n-nodes-base.httpRequest",
  typeVersion: 4.2,
  position: [720, -120],
};

const artifactNode = {
  parameters: {
    method: "POST",
    url: "={{$env.PROMO_PAGE_ARTIFACT_URL}}",
    sendHeaders: true,
    headerParameters: {
      parameters: [
        {
          name: "Authorization",
          value: "={{ 'Bearer ' + $env.PROMPT_RUNTIME_SERVICE_TOKEN }}",
        },
        { name: "Content-Type", value: "application/json" },
      ],
    },
    sendBody: true,
    contentType: "json",
    specifyBody: "json",
    jsonBody: "={{ JSON.stringify({ id: $('Build Page Generation Prompt').item.json.id, result: $json.result, requiredVisibleCopy: $('Build Page Generation Prompt').item.json.requiredVisibleCopy, ctaUrl: $('Build Page Generation Prompt').item.json.promo.ctaUrl, allowedUrls: $('Build Page Generation Prompt').item.json.allowedUrls, locale: $('Build Page Generation Prompt').item.json.promo.locale || '', market: $('Build Page Generation Prompt').item.json.promo.market || '', title: $('Build Page Generation Prompt').item.json.promo.title, promptMeta: $('Build Page Generation Prompt').item.json.promptMeta, browserQualityGate: $json.browserQualityGate, browserQualityAttestation: $json.browserQualityAttestation }) }}",
    options: { timeout: 30000 },
  },
  id: "a118d18d-f68b-4db4-81e4-710000000075",
  name: "Persist Promo Page Artifact",
  type: "n8n-nodes-base.httpRequest",
  typeVersion: 4.2,
  position: [960, -120],
};

const responseNode = {
  parameters: {
    jsCode: "const input = $('Build Page Generation Prompt').item.json;\nconst artifact = $json;\nconst browserValidation = $('Browser Quality Gate').item.json;\nif (!artifact.ok || !artifact.pagePath || !artifact.contentHash) throw new Error('Generated page artifact was not persisted');\nif (browserValidation.browserQualityGate?.state !== 'passed' || Number(browserValidation.browserQualityGate?.blockingCount || 0) !== 0) {\n  throw new Error('Generated page browser quality gate is not passed');\n}\nconst artifactEndpoint = String($env.PROMO_PAGE_ARTIFACT_URL || '').trim();\nif (!/^https?:\\/\\//i.test(artifactEndpoint)) throw new Error('PROMO_PAGE_ARTIFACT_URL must be an absolute internal API URL');\nconst pageUrl = new URL(artifact.pagePath, new URL(artifactEndpoint).origin).toString();\nconst { llmRequest, promptVariables, requiredVisibleCopy, allowedUrls, n8nWebhookUrl, ...safeInput } = input;\nreturn [{\n  json: {\n    ok: true,\n    id: artifact.id,\n    pageUrl,\n    pagePath: artifact.pagePath,\n    contentHash: artifact.contentHash,\n    expiresAt: artifact.expiresAt,\n    promptMeta: input.promptMeta,\n    browserQualityGate: browserValidation.browserQualityGate,\n    payload: safeInput\n  }\n}];",
  },
  id: "b118d18d-f68b-4db4-81e4-710000000075",
  name: "Build Promo Page Response",
  type: "n8n-nodes-base.code",
  typeVersion: 2,
  position: [1200, -120],
};

const orderedNames = [
  "Generate AI Promo Page",
  "Normalize Payload",
  "Load Page Generation Prompt",
  "Build Page Generation Prompt",
  "LLM Generate Promo Page",
  "Parse Generated Page JSON",
  "Validate Generated Page",
  "Browser Quality Gate",
  "Persist Promo Page Artifact",
  "Build Promo Page Response",
  "Return AI Page URL",
];

const positions = Object.fromEntries(orderedNames.map((name, index) => [name, [-960 + index * 240, -120]]));

function connection(node) {
  return { main: [[{ node, type: "main", index: 0 }]] };
}

function updateCanonical(workflow) {
  const nodes = workflow.nodes.filter((node) => !removeNames.has(node.name));
  nodes.push(browserQualityNode, artifactNode, responseNode);
  const promptRenderNode = nodes.find((node) => node.name === "Load Page Generation Prompt");
  const structuralValidatorNode = nodes.find((node) => node.name === "Validate Generated Page");
  if (!promptRenderNode || !structuralValidatorNode) throw new Error("Canonical workflow is missing its managed API nodes");
  promptRenderNode.parameters.url = "={{$env.PROMPT_RENDER_URL}}";
  structuralValidatorNode.parameters.url = "={{$env.PROMO_PAGE_VALIDATOR_URL}}";
  for (const node of nodes) {
    if (positions[node.name]) node.position = positions[node.name];
  }
  workflow.nodes = orderedNames.map((name) => nodes.find((node) => node.name === name));
  if (workflow.nodes.some((node) => !node)) throw new Error("Canonical workflow is missing a required node");
  workflow.connections = {
    "Generate AI Promo Page": connection("Normalize Payload"),
    "Normalize Payload": connection("Load Page Generation Prompt"),
    "Load Page Generation Prompt": connection("Build Page Generation Prompt"),
    "Build Page Generation Prompt": connection("LLM Generate Promo Page"),
    "LLM Generate Promo Page": connection("Parse Generated Page JSON"),
    "Parse Generated Page JSON": connection("Validate Generated Page"),
    "Validate Generated Page": connection("Browser Quality Gate"),
    "Browser Quality Gate": connection("Persist Promo Page Artifact"),
    "Persist Promo Page Artifact": connection("Build Promo Page Response"),
    "Build Promo Page Response": connection("Return AI Page URL"),
  };
  workflow.versionId = "promo-ai-page-generator-v4-attested-browser-artifacts";
  workflow.updatedAt = "2026-11-02T00:00:00.000Z";
  return workflow;
}

function synchronizeImportWorkflow(workflow, canonical) {
  const priorIds = new Map(workflow.nodes.map((node) => [node.name, node.id]));
  workflow.nodes = canonical.nodes.map((node) => ({
    ...structuredClone(node),
    id: priorIds.get(node.name) || node.id,
  }));
  workflow.connections = structuredClone(canonical.connections);
  workflow.versionId = canonical.versionId;
  workflow.updatedAt = canonical.updatedAt;
  return workflow;
}

const canonical = updateCanonical(JSON.parse(fs.readFileSync(canonicalPath, "utf8")));
const importWorkflow = synchronizeImportWorkflow(
  JSON.parse(fs.readFileSync(importPath, "utf8")),
  canonical,
);

fs.writeFileSync(canonicalPath, `${JSON.stringify(canonical, null, 2)}\n`);
fs.writeFileSync(importPath, `${JSON.stringify(importWorkflow, null, 2)}\n`);
