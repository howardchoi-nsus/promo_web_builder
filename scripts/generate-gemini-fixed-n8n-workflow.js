const fs = require('fs');

const inputPath = process.argv[2] || 'n8n/promo-ui-design-image-generator.workflow.json';
const outputPath = process.argv[3] || 'n8n/promo-ui-design-image-generator.gemini-fixed.workflow.json';

const workflow = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const storeNode = workflow.nodes.find((node) => node.name === 'Store UI Design Result');

if (!storeNode) {
  throw new Error('Store UI Design Result node not found');
}

storeNode.parameters.jsCode = `const input = $('Parse Validate Image Prompt').item.json;
const response = $json;
const currentItem = $input.item;

const cleanBase64 = (value) => String(value || '')
  .replace(/^data:image\\/[a-zA-Z0-9.+-]+;base64,/, '')
  .replace(/\\s/g, '');

const detectImage = (base64) => {
  const buf = Buffer.from(base64, 'base64');

  if (buf.length < 16) {
    throw new Error(\`Invalid generated image data: decoded image is too small: \${buf.length} bytes\`);
  }

  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const isWebp = buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP';

  if (isPng) return { mimeType: 'image/png', bytes: buf.length };
  if (isJpeg) return { mimeType: 'image/jpeg', bytes: buf.length };
  if (isWebp) return { mimeType: 'image/webp', bytes: buf.length };

  throw new Error(\`Invalid generated image data: decoded data is not PNG/JPEG/WebP. bytes=\${buf.length}\`);
};

const findInlineImage = (value) => {
  if (!value || typeof value !== 'object') return null;

  const directInline = value.inlineData || value.inline_data;
  if (directInline?.data) return directInline;

  const parts = value.candidates?.[0]?.content?.parts || value.parts || value.content?.parts || [];
  const imagePart = parts.find((part) => part.inlineData?.data || part.inline_data?.data);
  if (imagePart) return imagePart.inlineData || imagePart.inline_data;

  return null;
};

const imageUrlFromApi =
  response.data?.[0]?.url ||
  response.output?.[0]?.url ||
  response.imageUrl ||
  response.image_url ||
  response.url ||
  '';

let b64 =
  response.output_image?.data ||
  response.outputImage?.data ||
  response.data?.[0]?.b64_json ||
  response.output?.[0]?.b64_json ||
  response.image?.b64_json ||
  response.b64_json ||
  response.b64Json ||
  response.imageBase64 ||
  response.image_base64 ||
  '';

let mimeType = response.output_image?.mime_type || response.outputImage?.mimeType || response.mimeType || response.mime_type || 'image/png';

if (!b64) {
  const inlineData = findInlineImage(response);
  if (inlineData?.data) {
    b64 = inlineData.data;
    mimeType = inlineData.mimeType || inlineData.mime_type || mimeType;
  }
}

if (!b64 && Array.isArray(response.steps)) {
  const imageBlock = response.steps
    .flatMap((step) => Array.isArray(step.content) ? step.content : [])
    .find((block) => block?.type === 'image' && block.data);
  if (imageBlock?.data) {
    b64 = imageBlock.data;
    mimeType = imageBlock.mime_type || imageBlock.mimeType || mimeType;
  }
}

if (!b64 && currentItem.binary) {
  const binaryEntry = Object.entries(currentItem.binary).find(([, item]) =>
    String(item.mimeType || '').startsWith('image/')
  );

  if (binaryEntry) {
    const [binaryPropertyName, binaryImage] = binaryEntry;
    const binaryBuffer = await this.helpers.getBinaryDataBuffer(0, binaryPropertyName);
    b64 = binaryBuffer.toString('base64');
    mimeType = binaryImage.mimeType || mimeType;
  }
}

let imageBytes = 0;

if (b64) {
  b64 = cleanBase64(b64);
  const detected = detectImage(b64);
  mimeType = detected.mimeType;
  imageBytes = detected.bytes;
}

if (!imageUrlFromApi && !b64) {
  throw new Error('Image generation response must include image url, inlineData, binary image, or base64 image data');
}

const imageDataUrl = b64 ? \`data:\${mimeType};base64,\${b64}\` : '';

const staticData = $getWorkflowStaticData('global');
staticData.designs = staticData.designs || {};
staticData.designs[input.id] = {
  imageUrlFromApi,
  hasEmbeddedImage: Boolean(imageDataUrl),
  imageMimeType: mimeType,
  imageBytes,
  imagePrompt: input.imagePrompt,
  designBrief: input.designBrief,
  layoutMapping: input.layoutMapping,
  mdComplianceMap: input.mdComplianceMap,
  integratedDesignBrief: input.integratedDesignBrief,
  integratedDesignBriefMarkdown: input.integratedDesignBriefMarkdown,
  promptMeta: input.promptMeta,
  payload: input,
  createdAt: new Date().toISOString()
};

const queryPath = 'promo-ui-design-view?id=' + encodeURIComponent(input.id);
const sourceUrl = String(input.n8nWebhookUrl || '').trim();

const buildDesignUrl = (url) => {
  if (!url) return '';

  const replaced = url.replace(/promo-ui-design-generate\\/?(?:\\?.*)?$/, queryPath);
  if (replaced !== url) return replaced;

  try {
    const parsed = new URL(url);
    parsed.pathname = parsed.pathname
      .replace(/\\/$/, '')
      .replace(/promo-ui-design-generate$/, 'promo-ui-design-view');
    parsed.search = '?id=' + encodeURIComponent(input.id);
    return parsed.toString();
  } catch (error) {
    return url.replace(/\\/promo-ui-design-generate\\/?(?:\\?.*)?$/, '/' + queryPath);
  }
};

let designUrl = buildDesignUrl(sourceUrl);

if (!designUrl || /promo-ui-design-generate\\/?(?:\\?.*)?$/.test(designUrl)) {
  const headers = $('Generate Promo UI Design').item.json.headers || {};
  const proto = headers['x-forwarded-proto'] || 'https';
  const host = headers['x-forwarded-host'] || headers.host || '';
  designUrl = host ? proto + '://' + host + '/webhook/' + queryPath : '/webhook/' + queryPath;
}

const resultType = imageUrlFromApi || imageDataUrl ? 'image' : 'view';

return [
  {
    json: {
      ok: true,
      id: input.id,
      resultType,
      designUrl,
      imageUrl: imageUrlFromApi || imageDataUrl || '',
      hasEmbeddedImage: Boolean(imageDataUrl),
      imageMimeType: mimeType,
      imageBytes,
      designBrief: input.designBrief,
      layoutMapping: input.layoutMapping,
      mdComplianceMap: input.mdComplianceMap,
      integratedDesignBrief: input.integratedDesignBrief,
      integratedDesignBriefMarkdown: input.integratedDesignBriefMarkdown,
      promptMeta: input.promptMeta,
      imagePrompt: input.imagePrompt,
      payload: input
    }
  }
];`;

const imageNode = workflow.nodes.find((node) =>
  node.name === 'Generate an image' || node.name === 'Generate UI Design Image'
);

if (imageNode?.parameters) {
  for (const [key, value] of Object.entries(imageNode.parameters)) {
    if (typeof value === 'string') {
      imageNode.parameters[key] = value.replace('=={{$json.imagePrompt}}', '={{$json.imagePrompt}}');
    }
  }
}

const persistNode = workflow.nodes.find((node) => node.name === 'Persist UI Design Asset');
if (persistNode?.parameters?.url) {
  persistNode.parameters.url = "={{$json.assetApiUrl || $json.payload?.assetApiUrl || 'https://promo-web-builder.vercel.app/api/promo-design-assets'}}";
}

let outputJson = JSON.stringify(workflow, null, 2);
outputJson = outputJson.replace(
  /Bearer\s+sk-[A-Za-z0-9_-]{20,}/g,
  'Bearer REPLACE_WITH_OPENAI_API_KEY_OR_USE_CREDENTIAL'
);
outputJson = outputJson.replace(
  /sk-[A-Za-z0-9_-]{20,}/g,
  'REPLACE_WITH_OPENAI_API_KEY_OR_USE_CREDENTIAL'
);

fs.writeFileSync(outputPath, `${outputJson}\n`);
console.log(outputPath);
