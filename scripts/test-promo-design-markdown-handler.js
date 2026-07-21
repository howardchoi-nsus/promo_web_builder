const assert = require("node:assert/strict");
const markdownModule = require("../api/promo-design-markdown");

function responseRecorder() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function handlerFor(rowsByCall, getPrivateBlob) {
  let callIndex = 0;
  return markdownModule.createHandler({
    getDatabaseUrl: () => "postgresql://test",
    createSql: () => async () => rowsByCall[callIndex++] || [],
    getPrivateBlob,
  });
}

async function execute(handler, query = { runKey: "legacy-run", type: "design_prompt_markdown" }) {
  const res = responseRecorder();
  await handler({ method: "GET", query }, res);
  return res;
}

function blobFor(text) {
  return {
    statusCode: 200,
    stream: new Blob([text], { type: "text/markdown" }).stream(),
  };
}

(async () => {
  const storageKey = "data/Design/legacy.md";
  const privateUrl = "https://store.private.blob.vercel-storage.com/legacy.md";
  const locations = [];
  let options = null;
  let res = await execute(handlerFor([[{
    run_key: "legacy-run",
    prompt_group_id: "group-id",
    asset_type: "design_prompt_markdown",
    storage_key: storageKey,
    asset_url: privateUrl,
    metadata: { access: "private" },
  }]], async (location, requestedOptions) => {
    locations.push(location);
    options = requestedOptions;
    return blobFor("# Design Prompt");
  }));

  assert.equal(res.statusCode, 200);
  assert.deepEqual(locations, [storageKey]);
  assert.equal(options.access, "private");
  assert.equal(res.body.markdown, "# Design Prompt");

  const fallbackMarkdown = "# Prompt\n\n## Integrated Design Brief\nIntegrated content\n\n## Layout Mapping\n{}";
  res = await execute(handlerFor([[], [{
    run_key: "legacy-run",
    prompt_group_id: "group-id",
    asset_type: "design_prompt_markdown",
    storage_key: storageKey,
    asset_url: privateUrl,
    metadata: {},
  }]], async () => blobFor(fallbackMarkdown)), {
    runKey: "legacy-run",
    type: "integrated_design_brief_markdown",
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.fallbackAssetType, "design_prompt_markdown");
  assert.equal(res.body.markdown, "Integrated content");

  res = await execute(handlerFor([[{
    run_key: "legacy-run",
    asset_type: "promo_input_markdown",
    storage_key: storageKey,
    asset_url: privateUrl,
    metadata: {},
  }]], async () => { throw new Error(`access denied: ${privateUrl}`); }), {
    runKey: "legacy-run",
    type: "promo_input_markdown",
  });
  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, { error: "Failed to read markdown blob" });
  assert.equal(JSON.stringify(res.body).includes(privateUrl), false);

  console.log("Promo design markdown handler tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
