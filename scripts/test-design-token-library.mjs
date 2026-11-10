import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { analyzeTokenLibrary, parseTokenCsv, exportTokenCsv } from '../shared/design-token-library.mjs';
const require = createRequire(import.meta.url);
const { createHandler } = require('../api/design-token-library');
const seed = JSON.parse(fs.readFileSync(new URL('../data/design-tokens/dark-library.json', import.meta.url)));
const result = analyzeTokenLibrary(seed);
assert.equal(result.tokens.length, 651);
assert.deepEqual(result.errors, []);
assert.equal(result.warnings.length, 35);
assert.deepEqual(parseTokenCsv(exportTokenCsv(seed)), seed);
const { missingRequiredDesignTokenRoles } = require('../api/_promo-page-composition-contract');
const { toRuntimeTokenMap } = require('../api/_design-token-store');
const runtime = toRuntimeTokenMap(result.tokens.map(t => ({ tokenKey: t.name, value: result.resolved[t.name], valueType: t.type, metadata: { libraryToken: t, state: t.state } })));
assert.deepEqual(missingRequiredDesignTokenRoles(runtime), []);
assert.equal(runtime['--shadow-dark-inner-subtle'], undefined);
assert.equal(runtime['--title-2xl-bold'], undefined);
assert.equal(runtime['--spacing-16'], '16px');
const item = (name, type = 'dimension', value = '16px', reference = '') => ({ category: 'Test', name, type, value, reference });
for (const tokens of [
  [item('--a'), item('--a')],
  [item('--a', 'dimension', '', '--missing')],
  [item('--a', 'dimension', '', '--b'), item('--b', 'dimension', '', '--a')],
  [item('--a', 'dimension', '', '--b'), item('--b', 'color', '#ffffff')],
  [item('--a', 'dimension', '16px', '--b'), item('--b')],
  [item('--a', 'shadow', '미완성')],
  [item('--a', 'color', 'rgba(999,0,0,0.5)')],
  [item('--a', 'fontFamily', 'url(https://example.com)')],
]) assert(analyzeTokenLibrary(tokens).errors.length);
assert.equal(analyzeTokenLibrary([item('--base'), item('--gap', 'dimension', '', '--base')]).resolved['--gap'], '16px');
assert.equal(analyzeTokenLibrary([item('--base', 'dimension', ''), item('--gap', 'dimension', '', '--base')]).tokens[1].state, 'incomplete');
assert.throws(() => parseTokenCsv('카테고리,토큰명\na,b'));
assert.throws(() => parseTokenCsv('"unclosed'));
const multiline = [item('--text', 'fontFamily', 'A,"B"\nC')];
assert.deepEqual(parseTokenCsv(exportTokenCsv(multiline)), multiline);
function response() { return { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(n) { this.statusCode = n; return this; }, json(value) { this.body = value; return this; } }; }
let writes = 0;
const sql = async (parts) => {
  const query = parts.join('');
  if (query.includes('publish_single')) { writes++; return [{ version_id: 'new-version' }]; }
  if (query.includes('set_versions')) return [];
  return [{ id: 'set-id' }];
};
const handler = createHandler({ sqlFactory: () => sql, authorize() {} });
let res = response(); await handler({ method: 'GET', headers: {}, query: {} }, res);
assert.equal(res.body.tokens.length, 651); assert.equal(res.body.initial, true);
res = response(); await handler({ method: 'POST', headers: {}, body: { tokens: seed, dryRun: true } }, res);
assert.equal(res.statusCode, 200); assert.equal(writes, 0);
res = response(); await handler({ method: 'POST', headers: {}, body: { tokens: [item('--a'), item('--a')], expectedVersionId: null } }, res);
assert.equal(res.statusCode, 422); assert.equal(writes, 0);
res = response(); await handler({ method: 'POST', headers: {}, body: { tokens: seed } }, res);
assert.equal(res.statusCode, 400); assert.equal(writes, 0);
res = response(); await handler({ method: 'POST', headers: { origin: 'https://other.test', host: 'app.test' }, body: { tokens: seed, expectedVersionId: null } }, res);
assert.equal(res.statusCode, 403); assert.equal(writes, 0);
res = response(); await handler({ method: 'POST', headers: {}, body: { tokens: seed, expectedVersionId: null } }, res);
assert.equal(res.statusCode, 200); assert.equal(writes, 1);
const deniedHandler = createHandler({ sqlFactory() { throw Error('must not query'); }, authorize() { throw Object.assign(Error('admin required'), { statusCode: 403 }); } });
res = response(); await deniedHandler({ method: 'POST', headers: {} }, res); assert.equal(res.statusCode, 403);
console.log('Design token library: CSV round-trip, graph/type validation, incomplete exclusion, admin/origin protection and publish guards passed.');
