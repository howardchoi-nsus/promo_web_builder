module.exports = function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method not allowed");
  if (String(process.env.VERCEL_ENV || "").toLowerCase() !== "preview") {
    return res.status(403).send("Preview environment required");
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  return res.status(200).send(`<!doctype html>
<html lang="ko"><meta charset="utf-8"><title>V3 Migration</title>
<body><main><h1>Promo Service Contract V3 Migration</h1>
<form method="post" action="/api/internal/v3/apply-preview-migration">
<label>Target <select name="target"><option value="preview">Preview</option><option value="production">Production</option></select></label>
<label>Service token <input name="serviceToken" type="password" autocomplete="off" required></label>
<label>Confirmation <input name="confirmation" required></label>
<button type="submit">Apply migration</button>
</form></main></body></html>`);
};
