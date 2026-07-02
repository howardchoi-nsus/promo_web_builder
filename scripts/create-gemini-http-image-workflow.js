const fs = require('fs');

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  throw new Error('Usage: node scripts/create-gemini-http-image-workflow.js <input.json> <output.json>');
}

const workflow = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const imageNode = workflow.nodes.find((node) => node.name === 'Generate an image');

if (!imageNode) {
  throw new Error('Generate an image node not found');
}

imageNode.type = 'n8n-nodes-base.httpRequest';
imageNode.typeVersion = 4.2;
delete imageNode.credentials;
imageNode.parameters = {
  method: 'POST',
  url: 'https://generativelanguage.googleapis.com/v1beta/interactions',
  sendHeaders: true,
  headerParameters: {
    parameters: [
      {
        name: 'x-goog-api-key',
        value: 'REPLACE_WITH_GEMINI_API_KEY',
      },
      {
        name: 'Content-Type',
        value: 'application/json',
      },
    ],
  },
  sendBody: true,
  contentType: 'json',
  specifyBody: 'json',
  jsonBody: "={{ JSON.stringify({ model: String($json.imageModel || 'gemini-3.1-flash-image').replace(/^models\\//, ''), input: [{ type: 'text', text: $json.imagePrompt }], response_format: { type: 'image', mime_type: $json.output?.imageMimeType || 'image/png', aspect_ratio: $json.output?.aspectRatio || '2:3', image_size: $json.output?.imageSizeTier || '2K' } }) }}",
  options: {
    timeout: 300000,
  },
};

const normalizeNode = workflow.nodes.find((node) => node.name === 'Normalize Payload');
if (normalizeNode?.parameters?.jsCode) {
  normalizeNode.parameters.jsCode = normalizeNode.parameters.jsCode
    .replace(
      "body.image_model ||\n  'models/gemini-3.1-flash-image-preview'",
      "body.image_model ||\n  'models/gemini-3.1-flash-image'",
    )
    .replace(
      "imageSize: output.imageSize || '1024x1536'",
      "imageSize: output.imageSize || '1024x1536',\n      aspectRatio: output.aspectRatio || output.aspect_ratio || '2:3',\n      imageSizeTier: output.imageSizeTier || output.image_size_tier || '2K',\n      imageMimeType: output.imageMimeType || output.image_mime_type || 'image/png'",
    );
}

let outputJson = JSON.stringify(workflow, null, 2);
outputJson = outputJson.replace(
  /Bearer\s+sk-[A-Za-z0-9_-]{20,}/g,
  'Bearer REPLACE_WITH_OPENAI_API_KEY_OR_USE_CREDENTIAL',
);
outputJson = outputJson.replace(
  /sk-[A-Za-z0-9_-]{20,}/g,
  'REPLACE_WITH_OPENAI_API_KEY_OR_USE_CREDENTIAL',
);
outputJson = outputJson.replace(
  /AIza[0-9A-Za-z_-]{20,}/g,
  'REPLACE_WITH_GEMINI_API_KEY',
);

fs.writeFileSync(outputPath, `${outputJson}\n`);
console.log(outputPath);
