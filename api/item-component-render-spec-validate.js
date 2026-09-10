const { validateRenderSpec } = require("./_component-render-spec-contract");
const { getSql, parseBody, fetchRenderTokenCatalog } = require("./_item-components-store");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }
    const body = parseBody(req.body);
    const validation = validateRenderSpec(body.renderSpec, {
      fields: Array.isArray(body.fields) ? body.fields : [],
      tokenCatalog: await fetchRenderTokenCatalog(getSql()),
    });
    return res.status(validation.ok ? 200 : 422).json({ ok: validation.ok, validation });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "RenderSpec validation failed", message: error.message });
  }
};
