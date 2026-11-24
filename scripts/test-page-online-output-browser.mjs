import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { fixture, context } from './fixtures/page-schema.mjs';

const require = createRequire(import.meta.url);
const auth = require('../api/_promo-builder-auth');
const { snapshotForPage, normalize } = require('../api/_page-schema-service');
const { walk } = require('../shared/page-schema/contract.cjs');
const { staticPageHtml } = require('../api/_page-schema-static-export');
const session = auth.createSessionToken();
const owner = auth.ownerSubjectForSession(session.sessionId);
const documentId = '11111111-1111-4111-8111-111111111111';
const assetId = '22222222-2222-4222-8222-222222222222';
const viewToken = 'T'.repeat(43);
const imageUrl = `/api/promo-page-schema-image?id=${assetId}&token=${viewToken}`;
const pageSchema = fixture('example-split-nested');
const pageContext = structuredClone(context);
walk(pageSchema.root, ({ node }) => {
  if (node.type === 'image') { node.assetId = 'online_image'; node.requestId = null; }
});
pageSchema.mediaRequests = [];
pageContext.assets.online_image = { kind: 'image', url: imageUrl, width: 1, height: 1 };
const snapshot = snapshotForPage(normalize(pageSchema).page, pageContext);
snapshot.generationMeta.review = { state: 'approved' };
snapshot.qualityGate = {
  state: 'passed', documentRevision: 1, blockingCount: 0,
  results: Object.fromEntries(['desktop', 'tablet', 'mobile'].map(view => [view, { blockingCount: 0 }])),
};

// A decodable PNG with trailing fixture bytes reproduces the Base64 response
// budget failure without external media services or changing image resolution.
const imageBytes = Buffer.concat([
  Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64'),
  Buffer.alloc(3.25 * 1024 * 1024),
]);
await assert.rejects(staticPageHtml(snapshot, {
  assetOverrides: { [imageUrl]: `data:image/png;base64,${imageBytes.toString('base64')}` },
}), { code: 'EXPORT_HTML_TOO_LARGE' });

let assetReads = 0;
const storeId = require.resolve('../api/_promo-builder-document-store');
require.cache[storeId] = {
  id: storeId, filename: storeId, loaded: true, exports: {
    getSql: () => async () => { throw Error('Online HTML must not read and embed Blob bytes'); },
    fetchDocument: async (_, id, subject) => id === documentId && subject === owner
      ? { document: { id, currentDocumentRevision: 1, title: 'Online image regression' }, snapshot } : null,
  },
};
const output = require('../api/promo-page-output');
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/promo-page-output') {
      req.query = Object.fromEntries(url.searchParams);
      res.status = code => { res.statusCode = code; return res; };
      res.send = value => res.end(value);
      res.json = value => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); };
      return await output(req, res);
    }
    if (url.pathname === '/api/promo-page-schema-image'
      && url.searchParams.get('id') === assetId && url.searchParams.get('token') === viewToken) {
      assetReads++;
      assert.equal(req.headers.referer, undefined, 'Private view token must not be leaked as a referrer');
      res.setHeader('Content-Type', 'image/png');
      return res.end(imageBytes);
    }
    res.statusCode = 404;
    res.end();
  } catch (error) { res.statusCode = 500; res.end(error.message); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium',
  headless: true, args: ['--no-sandbox'],
});
try {
  const browserContext = await browser.newContext();
  await browserContext.addCookies([{ name: auth.COOKIE_NAME, value: session.token, url: origin }]);
  const page = await browserContext.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [1440, 768, 375]) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(`${origin}/api/promo-page-output?documentId=${documentId}&revision=1`);
    assert.equal(response.status(), 200);
    const html = await response.text();
    assert.ok(Buffer.byteLength(html) < 4 * 1024 * 1024);
    assert.ok(!html.includes('data:image/'));
    assert.equal(await page.locator('script, iframe').count(), 0);
    const image = page.locator('img[data-ps-type="image"]').first();
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(img => img.decode());
    assert.equal(await image.evaluate(img => img.naturalWidth), 1);
    assert.equal(await image.getAttribute('src'), origin + imageUrl);
    assert.equal(await page.locator('h1').count(), 1);
  }
  assert.ok(assetReads > 0, 'The browser must actually request and decode the external image');
  assert.deepEqual(errors, []);
  await browserContext.close();
  console.log('Online output browser: real output handler serves small runtime-free HTML; >4MiB inline equivalent loads/decode via protected image reference at desktop/tablet/mobile without reducing resolution.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
