const { getSql, parseBody, fetchTokenVersion } = require('./_design-token-store');
const { resolveAdminOwner } = require('./_promo-admin-auth');
const seed = require('../data/design-tokens/dark-library.json');

function createHandler({ sqlFactory = getSql, authorize = resolveAdminOwner } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'private, no-store');
    try {
      if (!['GET', 'POST'].includes(req.method)) {
        res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'Method not allowed' });
      }
      authorize(req, res);
      if (req.method === 'POST' && req.headers?.origin) {
        const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
        if (new URL(req.headers.origin).host !== host) return res.status(403).json({ error: '같은 사이트에서만 저장할 수 있습니다.' });
      }
      const { analyzeTokenLibrary, parseTokenCsv, tokenCssProperties, tokenPlannerRole } = await import('../shared/design-token-library.mjs');
      const sql = sqlFactory();
      const sets = await sql`select id::text from promo_design_token_sets where set_key = 'design-system' limit 1`;
      if (!sets.length) return res.status(503).json({ error: '디자인 토큰 DB 업데이트가 필요합니다. migration 082를 적용하세요.' });
      const setId = sets[0].id;
      if (req.method === 'GET') {
        const versions = await sql`select id::text, version, status, change_note, created_at from promo_design_token_set_versions where token_set_id = ${setId}::uuid order by version desc limit 30`;
        const requestedId = String(req.query?.versionId || '');
        if (requestedId && !versions.some(v => v.id === requestedId)) return res.status(404).json({ error: '버전을 찾을 수 없습니다.' });
        const current = versions.find(v => v.status === 'active');
        const selected = requestedId || current?.id;
        const detail = selected ? await fetchTokenVersion(sql, selected) : null;
        const tokens = detail ? detail.values.map(v => v.metadata.libraryToken).filter(Boolean) : seed;
        const analysis = analyzeTokenLibrary(tokens);
        return res.status(200).json({ ok: true, tokenSetId: setId, versionId: selected || null, activeVersionId: current?.id || null, initial: !detail, ...analysis, versions });
      }
      const body = parseBody(req.body);
      const analysis = analyzeTokenLibrary(body.csvText !== undefined ? parseTokenCsv(body.csvText) : body.tokens);
      if (analysis.errors.length) return res.status(422).json({ error: '토큰 검증에 실패했습니다.', ...analysis });
      if (body.dryRun === true) return res.status(200).json({ ok: true, ...analysis });
      if (!Object.hasOwn(body, 'expectedVersionId')) return res.status(400).json({ error: '저장 기준 버전이 필요합니다. 새로고침하세요.' });
      const entries = analysis.tokens.map(t => ({
        ...t, resolvedValue: t.state === 'active' ? analysis.resolved[t.name] : '',
        cssProperties: tokenCssProperties(t),
        semanticRole: tokenPlannerRole(t),
      }));
      const saved = await sql`select publish_single_design_token_library(${setId}::uuid, ${body.expectedVersionId || null}::uuid, ${JSON.stringify(entries)}::jsonb, ${String(body.changeNote || '공통 디자인 토큰 저장')})::text as version_id`;
      return res.status(200).json({ ok: true, versionId: saved[0].version_id, warnings: analysis.warnings });
    } catch (error) {
      const conflict = /version changed/i.test(error.message);
      const migration = error.code === '42883';
      return res.status(conflict ? 409 : migration ? 503 : error.statusCode || 400).json({ error: migration ? '디자인 토큰 DB migration 082가 필요합니다.' : error.message });
    }
  };
}
module.exports = createHandler();
module.exports.createHandler = createHandler;
