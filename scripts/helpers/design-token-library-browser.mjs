import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import { chromium } from 'playwright';
import { analyzeTokenLibrary, exportTokenCsv, parseTokenCsv } from '../../shared/design-token-library.mjs';

const seed = JSON.parse(fs.readFileSync(new URL('../../data/design-tokens/dark-library.json', import.meta.url)));
let stored = seed, versionId = null, saves = 0;
const server = await createServer({ configFile: false, root: process.cwd(), plugins: [vue(), {
  name: 'token-library-test-page',
  resolveId(id) { if (id === '/__token-entry.js') return '\0token-entry'; },
  load(id) { if (id === '\0token-entry') return "import {createApp} from 'vue';import Manager from '/admin-app/src/components/DesignTokenManager.vue';createApp(Manager,{translate:key=>key}).mount('#app');"; },
  configureServer(server) {
    server.middlewares.use('/__token-library-test', (_req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.end('<div id="app"></div><script type="module" src="/__token-entry.js"></script>');
    });
  } }, { name: 'vue-single-runtime', config: () => ({ resolve: { alias: { vue: 'vue/dist/vue.esm-bundler.js' } } }) }], server: { host: '127.0.0.1', port: 0 } });
let browser;
try {
  await server.listen();
  const address = server.httpServer.address();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined) });
  const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
  const pageErrors = []; page.on('pageerror', e => pageErrors.push(e.message));
  await page.route('**/api/design-token-library*', async route => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON(); assert.equal(body.expectedVersionId, versionId);
      const analysis = analyzeTokenLibrary(body.tokens); assert.deepEqual(analysis.errors, []);
      stored = analysis.tokens; versionId = `version-${++saves}`;
      return route.fulfill({ json: { ok: true, versionId, warnings: analysis.warnings } });
    }
    await route.fulfill({ json: { ...analyzeTokenLibrary(stored), initial: !versionId, versionId, activeVersionId: versionId, versions: versionId ? [{ id: versionId, version: saves, status: 'active' }] : [] } });
  });
  await page.goto(`http://127.0.0.1:${address.port}/__token-library-test`);
  await page.getByRole('tab', { name: '전체 (651)', exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: '세트 생성', exact: true }).count(), 0);
  await page.getByRole('tab', { name: 'Measurement (19)', exact: true }).click();
  const unitRow = page.locator('tbody tr').filter({ has: page.locator('code').filter({ hasText: /^--unit-16$/ }) });
  await unitRow.getByRole('textbox', { name: '--unit-16 값', exact: true }).fill('18px');
  await page.getByRole('button', { name: '변경사항 저장', exact: true }).click();
  await page.getByText('공통 디자인 토큰을 저장했습니다.', { exact: false }).waitFor();
  assert.equal(analyzeTokenLibrary(stored).resolved['--spacing-16'], '18px');
  await page.getByRole('tab', { name: 'Spacing (18)', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '전체 CSV 다운로드', exact: true }).click();
  const download = await downloadPromise;
  const exported = parseTokenCsv(fs.readFileSync(await download.path(), 'utf8'));
  assert.equal(exported.length, 651, 'filtered tab must export all categories');
  await page.getByRole('textbox', { name: '새 카테고리 이름', exact: true }).fill('Custom');
  await page.getByRole('button', { name: '카테고리 추가', exact: true }).click();
  const form = page.getByRole('form', { name: '토큰 추가', exact: true });
  await form.getByRole('textbox', { name: '토큰명', exact: true }).fill('--custom-test');
  await form.getByRole('textbox', { name: '값', exact: true }).fill('8px');
  await form.getByRole('button', { name: '목록에 추가', exact: true }).click();
  await page.getByRole('tab', { name: 'Custom (1)', exact: true }).waitFor();
  await page.getByRole('button', { name: '변경사항 저장', exact: true }).click();
  await page.getByText('공통 디자인 토큰을 저장했습니다.', { exact: false }).waitFor();
  assert.equal(stored.length, 652);
  const file = page.getByLabel('전체 CSV 업로드', { exact: true });
  await file.setInputFiles({ name: 'duplicate.csv', mimeType: 'text/csv', buffer: Buffer.from(exportTokenCsv([seed[0], seed[0]])) });
  await page.getByRole('alert').filter({ hasText: '중복' }).waitFor();
  assert.equal(stored.length, 652, 'invalid import must not mutate saved library');
  await file.setInputFiles({ name: 'all-tokens.csv', mimeType: 'text/csv', buffer: Buffer.from(exportTokenCsv(seed)) });
  await page.getByRole('region', { name: 'CSV 가져오기 미리보기', exact: true }).waitFor();
  assert.equal(stored.length, 652, 'preview must not save');
  await page.getByRole('button', { name: '편집 목록에 반영', exact: true }).click();
  await page.getByRole('tab', { name: '전체 (651)', exact: true }).waitFor();
  assert.equal(stored.length, 652, 'applying preview must remain unsaved');
  await page.getByRole('button', { name: '변경사항 저장', exact: true }).click();
  await page.getByText('공통 디자인 토큰을 저장했습니다.', { exact: false }).waitFor();
  assert.equal(stored.length, 651); assert.deepEqual(pageErrors, []);
  await page.screenshot({ path: '/tmp/design-token-library-admin.png', fullPage: true });
  console.log('Browser: singleton UI, category edit/add, reference save, full CSV download from filtered tab, rejected duplicate import, staged replacement and save passed.');
} finally { await browser?.close(); await server.close(); }
