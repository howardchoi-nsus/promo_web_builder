const { requireBuilderFlag } = require('./_promo-builder-flags');
const { getSql, fetchPublicDocument } = require('./_promo-builder-document-store');
const { assertPassedQualityGate } = require('./_promo-quality-gate');
const { staticPageHtml, exportOrigin } = require('./_page-schema-static-export');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method not allowed' });
    }
    requireBuilderFlag('pageSchemaV1');
    const sql = getSql();
    const documentId = String(req.query?.documentId || '');
    const found = await fetchPublicDocument(sql, documentId, { includeSnapshot: true });
    if (!found?.snapshot?.content?.pageSchema) return res.status(404).json({ error: 'Page not found' });
    const revision = Number(found.document.currentDocumentRevision);
    if (Number(req.query?.revision) !== revision) {
      return res.status(409).json({ code: 'DOCUMENT_REVISION_MISMATCH', error: '최신 페이지를 다시 열어 주세요.' });
    }
    assertPassedQualityGate(found.snapshot, revision);
    // Online viewing uses the existing token-protected image endpoint. Only the
    // portable download embeds Blob bytes; doing that here inflates the HTML
    // by ~4/3 and makes otherwise valid multi-image pages exceed the response limit.
    const html = await staticPageHtml(found.snapshot, {
      title: found.document.title || 'Promotion',
      origin: exportOrigin(req),
    });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ code: error.code || 'PAGE_OUTPUT_FAILED', error: error.message });
  }
};

// Persist server-side lifecycle even when the browser disconnects or hides errors.
module.exports=require('./_work-log').withWorkLog('promo-page-output',module.exports);
