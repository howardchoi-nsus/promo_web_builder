const fs = require("node:fs");
const path = require("node:path");

const sourcePath = path.join(__dirname, "..", "n8n", "Promo Final Design Worker.image-edit.json");
const outputPath = path.join(__dirname, "..", "n8n", "Promo Final Design Worker.provider-routed.json");
const workflow = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const node = (name) => workflow.nodes.find((item) => item.name === name);

workflow.name = "Promo Final Design Worker provider-routed";
workflow.active = false;

const openAi = node("Generate Final Design Image");
openAi.name = "Generate Final Design with OpenAI";
openAi.position = [1120, 272];

const routeProvider = {
  parameters: {
    conditions: {
      options: { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 2 },
      conditions: [{
        id: "final-provider-google",
        leftValue: "={{ $('Normalize Final Design Payload').item.json.provider }}",
        rightValue: "google",
        operator: { type: "string", operation: "equals" },
      }],
      combinator: "and",
    },
    options: {},
  },
  id: "final-provider-router",
  name: "Route Final Design Provider",
  type: "n8n-nodes-base.if",
  typeVersion: 2.2,
  position: [928, 176],
};

const gemini = {
  parameters: {
    method: "POST",
    url: "={{ 'https://generativelanguage.googleapis.com/v1beta/interactions' }}",
    sendHeaders: true,
    headerParameters: { parameters: [
      { name: "x-goog-api-key", value: "__RETAIN_EXISTING_GEMINI_KEY__" },
      { name: "Content-Type", value: "application/json" },
    ] },
    sendBody: true,
    contentType: "json",
    specifyBody: "json",
    jsonBody: "={{ JSON.stringify({ model: String($json.model || 'gemini-3.1-flash-image').replace(/^models\\//, ''), input: [{ type: 'text', text: String($json.renderedPrompt || '').slice(0, 30000) }, { type: 'image', mime_type: $json.geminiImageMimeType || 'image/png', data: $json.geminiImageBase64 }], response_format: { type: 'image', mime_type: 'image/jpeg', aspect_ratio: $json.modelOptions?.aspectRatio || '2:3', image_size: $json.modelOptions?.imageSize || '2K' } }) }}",
    options: { timeout: 300000 },
  },
  id: "generate-final-gemini",
  name: "Generate Final Design with Gemini",
  type: "n8n-nodes-base.httpRequest",
  typeVersion: 4.2,
  position: [1120, 80],
  retryOnFail: true,
  maxTries: 2,
  waitBetweenTries: 1000,
  onError: "continueRegularOutput",
};

const prepareGeminiInput = {
  parameters: {
    jsCode: `const buffer = await this.helpers.getBinaryDataBuffer(0, 'data');
const normalized = $('Normalize Final Design Payload').item.json;
return [{ json: { ...normalized, geminiImageBase64: buffer.toString('base64'), geminiImageMimeType: $binary.data?.mimeType || 'image/png' } }];`,
  },
  id: "prepare-gemini-final-image",
  name: "Prepare Gemini Image Input",
  type: "n8n-nodes-base.code",
  typeVersion: 2,
  position: [1088, 80],
};

const normalizeResult = {
  parameters: {
    jsCode: `const response = $json || {};
const findImage = (value, seen = new Set()) => {
  if (!value || typeof value !== 'object' || seen.has(value)) return null;
  seen.add(value);
  if (value.inlineData?.data) return { data: value.inlineData.data, mimeType: value.inlineData.mimeType || value.inlineData.mime_type };
  if (value.inline_data?.data) return { data: value.inline_data.data, mimeType: value.inline_data.mime_type || value.inline_data.mimeType };
  if (value.type === 'image' && value.data) return { data: value.data, mimeType: value.mime_type || value.mimeType };
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) {
      for (const item of child) { const found = findImage(item, seen); if (found) return found; }
    } else {
      const found = findImage(child, seen); if (found) return found;
    }
  }
  return null;
};
const direct = response.data?.[0]?.b64_json ? { data: response.data[0].b64_json, mimeType: 'image/png' } : null;
const image = direct || findImage(response) || {};
const apiError = response.error?.message || response.message || response.error || '';
return [{ json: { provider: $('Normalize Final Design Payload').item.json.provider, finalImageBase64: image.data || '', finalImageMimeType: image.mimeType || 'image/png', generationError: image.data ? '' : String(apiError || 'Image generation returned no image') } }];`,
  },
  id: "normalize-final-provider-result",
  name: "Normalize Final Provider Result",
  type: "n8n-nodes-base.code",
  typeVersion: 2,
  position: [1312, 176],
};

gemini.position = [1280, 80];
workflow.nodes.push(routeProvider, prepareGeminiInput, gemini, normalizeResult);

const check = node("Check Final Image Base64");
for (const item of check.parameters.assignments.assignments) {
  if (item.name === "base64Length") item.value = "={{ ($json.finalImageBase64 || '').length }}";
  if (item.name === "hasBase64") item.value = "={{ Boolean($json.finalImageBase64) }}";
  if (item.name === "finalImageBase64") item.value = "={{ $json.finalImageBase64 || '' }}";
  if (item.name === "generationError") item.value = "={{ $json.generationError || ($json.finalImageBase64 ? '' : 'Image generation returned no image') }}";
}
check.position = [1504, 176];
node("Save Final Design Result").position = [1696, 176];

workflow.connections["Download Confirmed LO-FI Image"] = { main: [[{ node: "Route Final Design Provider", type: "main", index: 0 }]] };
workflow.connections["Route Final Design Provider"] = { main: [
  [{ node: "Prepare Gemini Image Input", type: "main", index: 0 }],
  [{ node: "Generate Final Design with OpenAI", type: "main", index: 0 }],
] };
workflow.connections["Prepare Gemini Image Input"] = { main: [[{ node: "Generate Final Design with Gemini", type: "main", index: 0 }]] };
delete workflow.connections["Generate Final Design Image"];
workflow.connections["Generate Final Design with OpenAI"] = { main: [[{ node: "Normalize Final Provider Result", type: "main", index: 0 }]] };
workflow.connections["Generate Final Design with Gemini"] = { main: [[{ node: "Normalize Final Provider Result", type: "main", index: 0 }]] };
workflow.connections["Normalize Final Provider Result"] = { main: [[{ node: "Check Final Image Base64", type: "main", index: 0 }]] };

fs.writeFileSync(outputPath, `${JSON.stringify(workflow, null, 2)}\n`);
console.log(outputPath);
