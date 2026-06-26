const DEFAULT_DOCS_API = "https://promo-web-builder.vercel.app/api/design-documents";
const DEFAULT_WEBHOOK = "https://kolchohoohu.app.n8n.cloud/webhook/design-md-concept-analyze";

const docsApi = process.env.DESIGN_DOCS_API || DEFAULT_DOCS_API;
const webhookUrl = process.env.N8N_ANALYZE_WEBHOOK_URL || DEFAULT_WEBHOOK;
const limit = Number(process.env.ANALYZE_LIMIT || 0);
const start = Number(process.env.ANALYZE_START || 0);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const docsResponse = await fetch(docsApi);
  if (!docsResponse.ok) {
    throw new Error(`Failed to load docs: ${docsResponse.status} ${await docsResponse.text()}`);
  }

  const payload = await docsResponse.json();
  const documents = (payload.documents || [])
    .filter((doc) => doc.id && doc.markdown)
    .slice(start, limit ? start + limit : undefined);

  console.log(`Loaded ${payload.documents?.length || 0} docs. Analyzing ${documents.length} docs from offset ${start}.`);

  const results = [];
  for (let index = 0; index < documents.length; index += 1) {
    const doc = documents[index];
    const label = `${start + index + 1}/${payload.documents.length} ${doc.brandName}`;
    const startedAt = Date.now();

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: doc.id,
          brandName: doc.brandName,
          sourceName: doc.sourceName,
          rawMarkdown: doc.markdown,
          model: "gpt-4o-mini",
        }),
      });

      const text = await response.text();
      let body = {};
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = { text };
      }

      if (!response.ok) {
        throw new Error(`${response.status}: ${JSON.stringify(body).slice(0, 500)}`);
      }

      const hasClassification = Boolean(body.styleClassificationJson || body.styleClassification || body.designConceptJson?.styleClassification);
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      console.log(`OK ${label} (${elapsed}s)${hasClassification ? " classification" : ""}`);
      results.push({ id: doc.id, brandName: doc.brandName, ok: true, hasClassification });
    } catch (error) {
      console.log(`FAIL ${label}: ${error.message}`);
      results.push({ id: doc.id, brandName: doc.brandName, ok: false, error: error.message });
    }

    await sleep(750);
  }

  const ok = results.filter((item) => item.ok).length;
  const failed = results.length - ok;
  const classified = results.filter((item) => item.hasClassification).length;
  console.log(JSON.stringify({ total: results.length, ok, failed, classified }, null, 2));

  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
