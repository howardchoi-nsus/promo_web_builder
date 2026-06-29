const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const runKey = String(req.query.id || req.query.runKey || "").trim();
  if (!runKey) return res.status(400).send("Missing id");

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return res.status(500).send("DATABASE_URL is not configured");

  const sql = neon(databaseUrl);
  const rows = await sql`
    select
      r.run_key,
      r.promo_title,
      r.selected_md_name,
      r.created_at,
      a.asset_url
    from promo_design_runs r
    join promo_design_assets a on a.run_id = r.id and a.is_primary = true
    where r.run_key = ${runKey}
    limit 1
  `;

  const row = rows[0];
  const title = escapeHtml(row?.promo_title || "Promo UI Design");
  const html = row?.asset_url
    ? renderImagePage({ title, id: runKey, assetUrl: row.asset_url, brand: row.selected_md_name, createdAt: row.created_at })
    : renderNotFound(runKey);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(row?.asset_url ? 200 : 404).send(html);
};

function renderImagePage({ title, id, assetUrl, brand, createdAt }) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body{margin:0;background:#f6f8fc;font-family:Arial,sans-serif;color:#111827}
    .wrap{max-width:1540px;margin:0 auto;padding:24px}
    .bar{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:16px}
    .meta{color:#64748b;font-size:13px}
    .frame{border:1px solid #dfe6f2;background:white;border-radius:8px;overflow:hidden;box-shadow:0 14px 40px rgba(20,35,70,.08)}
    img{display:block;width:100%;height:auto}
  </style>
</head>
<body>
  <main class="wrap">
    <div class="bar">
      <strong>${title}</strong>
      <span class="meta">${escapeHtml(brand || "")} · ${escapeHtml(id)} · ${escapeHtml(String(createdAt || ""))}</span>
    </div>
    <div class="frame"><img src="${escapeAttribute(assetUrl)}" alt="Generated promo UI design"></div>
  </main>
</body>
</html>`;
}

function renderNotFound(id) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>UI design not found</title></head><body style="font-family:Arial,sans-serif;padding:40px"><h1>UI design not found</h1><p>No generated UI design was stored for id: ${escapeHtml(id)}</p></body></html>`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
