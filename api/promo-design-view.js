const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

module.exports = async function handler(req, res) {
  try {
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
        a.created_at as committed_at,
        a.asset_url
      from promo_design_runs r
      join promo_design_assets a on a.run_id = r.id and a.asset_type = 'generated_image'
      where r.run_key = ${runKey}
      order by a.is_primary desc, a.created_at desc
      limit 1
    `;

    const row = rows[0];
    const title = escapeHtml(row?.promo_title || "Promo UI Design");
    const imageUrl = `${getOrigin(req)}/api/promo-design-image?id=${encodeURIComponent(runKey)}`;
    const html = row?.asset_url
      ? renderImagePage({ title, id: runKey, imageUrl, brand: row.selected_md_name, createdAt: row.created_at, committedAt: row.committed_at })
      : renderNotFound(runKey);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(row?.asset_url ? 200 : 404).send(html);
  } catch (error) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send(renderError(error));
  }
};

function renderImagePage({ title, id, imageUrl, brand, createdAt, committedAt }) {
  const stamp = formatTimestampStamp(committedAt || createdAt);
  const createdAtLabel = formatKoreaDateTime(createdAt);
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body{margin:0;background:#000;font-family:Arial,sans-serif;color:#f8fafc}
    .wrap{max-width:1540px;margin:0 auto;padding:24px}
    .bar{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:16px}
    .title-row{display:flex;align-items:center;gap:8px;min-width:0}
    .title-row strong{font-size:16px;line-height:1.2}
    .stamp{display:inline-flex;align-items:center;min-height:20px;padding:2px 7px;border:1px solid #2a2a2a;border-radius:999px;background:#111;color:#e5e7eb;font-size:11px;font-weight:700;white-space:nowrap}
    .meta{color:#a3a3a3;font-size:13px}
    .meta a{color:#93c5fd;text-decoration:none}
    img{display:block;width:auto;max-width:100%;height:auto;margin:0 auto;background:#000}
    .image-error{display:none;margin:24px 0;padding:16px;border:1px solid #fecaca;background:#fff1f2;color:#991b1b}
  </style>
</head>
<body>
  <main class="wrap">
    <div class="bar">
      <div class="title-row"><strong>${title}</strong>${stamp ? `<span class="stamp">${escapeHtml(stamp)}</span>` : ""}</div>
      <span class="meta">${escapeHtml(brand || "")} · ${escapeHtml(id)} · ${escapeHtml(createdAtLabel)} · <a href="${escapeAttribute(imageUrl)}" target="_blank" rel="noreferrer">Open image</a></span>
    </div>
    <img src="${escapeAttribute(imageUrl)}" alt="Generated promo UI design" onerror="this.style.display='none';document.querySelector('.image-error').style.display='block';">
    <div class="image-error">Generated image could not be loaded. Check the image asset or Blob access for this design.</div>
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

function formatTimestampStamp(value) {
  if (!value) return "";
  const kstTextMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (kstTextMatch) {
    const [, year, month, day, hour, minute] = kstTextMatch;
    return `${year.slice(-2)}${month}${day}${hour}${minute}`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  const parts = datePartsInKorea(date);
  if (!parts) return String(value).slice(0, 16);
  const pad = (part) => String(part).padStart(2, "0");
  return [
    String(parts.year).slice(-2),
    pad(parts.month),
    pad(parts.day),
    pad(parts.hour),
    pad(parts.minute),
  ].join("");
}

const koreaDateTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function datePartsInKorea(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return koreaDateTimeFormatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});
}

function formatKoreaDateTime(value) {
  if (!value) return "";
  const parts = datePartsInKorea(value);
  if (!parts) return String(value || "");
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

function renderError(error) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>UI design error</title></head><body style="font-family:Arial,sans-serif;padding:40px"><h1>UI design error</h1><p>${escapeHtml(error.message)}</p></body></html>`;
}

function getOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  return host ? `${proto}://${host}` : "";
}
