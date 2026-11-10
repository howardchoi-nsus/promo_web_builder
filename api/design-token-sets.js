const {
  getSql, fetchTokenSets, fetchTokenVersion,
  fetchManagedTokenSets, toRuntimeTokenMap,
} = require("./_design-token-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const sql = getSql();
      if (String(req.query.scope || "") === "public") {
        res.setHeader("Cache-Control", "no-store");
        const available = await fetchTokenSets(sql, { activeOnly: true });
        const tokenSets = [available.find(s => s.setKey === 'design-system') || available.find(s => s.isDefault) || available[0]].filter(Boolean);
        const defaultVersionId = (
          tokenSets.find((tokenSet) => tokenSet.isDefault)
          || tokenSets[0]
        )?.versionId || "";
        const publicTokenSets = await Promise.all(tokenSets.map(async (tokenSet) => {
          const version = tokenSet.versionId ? await fetchTokenVersion(sql, tokenSet.versionId) : null;
          return {
            ...tokenSet,
            isDefault: tokenSet.versionId === defaultVersionId,
            values: toRuntimeTokenMap(version?.values || []),
            sourceValues: (version?.values || []).filter(v => !v.metadata?.libraryToken || v.metadata.state === 'active'),
          };
        }));
        publicTokenSets.sort((left, right) => Number(right.isDefault) - Number(left.isDefault));
        return res.status(200).json({ ok: true, tokenSets: publicTokenSets });
      }
      return res.status(200).json({
        ok: true,
        tokenSets: (await fetchManagedTokenSets(sql)).filter(s => s.setKey === 'design-system'),
      });
    }
    if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return res.status(405).json({ error: "Method not allowed" }); }
    return res.status(409).json({ error: '하나의 공통 디자인 토큰 라이브러리만 사용합니다. /api/design-token-library에서 관리하세요.' });

  } catch (error) {
    const conflict = error.code === "23505";
    return res.status(conflict ? 409 : (error.statusCode || 500)).json({ error: conflict ? "Design token set already exists" : "Design token sets API failed", message: error.message });
  }
};
