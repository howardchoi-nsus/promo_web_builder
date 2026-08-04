const { getSql, parseBody } = require("./_wizard-form-templates-store");
const {
  fetchResourceVersions,
  createResource,
  createResourceVersion,
  activateResourceVersion,
  createResourceRule,
} = require("./_promo-content-resources-store");

const RESOURCE_TYPES = new Set([
  "terms", "privacy", "legal", "responsible-gaming",
  "footer", "cta", "customer-support",
]);
const SECTION_ROLES = new Set(["footer", "terms", "legal", "responsible-gaming", "cta", "notice"]);

module.exports = async function handler(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store");
    const sql = getSql();
    if (req.method === "GET") {
      const versions = await fetchResourceVersions(sql, {
        resourceId: String(req.query.resourceId || "").trim(),
        includeContent: String(req.query.includeContent || "").toLowerCase() === "true",
      });
      return res.status(200).json({ ok: true, versions });
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = parseBody(req.body);
    const action = String(body.action || "create-resource").trim();
    if (action === "create-resource") {
      const resourceKey = String(body.resourceKey || "").trim();
      const resourceType = String(body.resourceType || "").trim();
      const name = String(body.name || "").trim();
      if (!/^[a-z][a-z0-9-]{1,99}$/.test(resourceKey) || !RESOURCE_TYPES.has(resourceType) || !name) {
        return res.status(400).json({ error: "Valid resourceKey, resourceType and name are required" });
      }
      return res.status(201).json({ ok: true, resource: await createResource(sql, { ...body, resourceKey, resourceType, name }) });
    }
    if (action === "create-version") {
      const resourceId = String(body.resourceId || "").trim();
      const locale = String(body.locale || "").trim();
      if (!resourceId || !locale || !body.content || typeof body.content !== "object" || Array.isArray(body.content)) {
        return res.status(400).json({ error: "resourceId, locale and object content are required" });
      }
      const effectiveFrom = String(body.effectiveFrom || new Date().toISOString());
      return res.status(201).json({
        ok: true,
        version: await createResourceVersion(sql, { ...body, resourceId, locale, effectiveFrom }),
      });
    }
    if (action === "activate-version") {
      const versionId = String(body.versionId || "").trim();
      if (!versionId) return res.status(400).json({ error: "versionId is required" });
      return res.status(200).json({
        ok: true,
        version: await activateResourceVersion(sql, versionId, body.changeNote),
      });
    }
    if (action === "create-rule") {
      const resourceId = String(body.resourceId || "").trim();
      const sectionRole = String(body.sectionRole || "").trim();
      if (!resourceId || !SECTION_ROLES.has(sectionRole)) {
        return res.status(400).json({ error: "resourceId and valid sectionRole are required" });
      }
      const effectiveFrom = String(body.effectiveFrom || new Date().toISOString());
      return res.status(201).json({
        ok: true,
        rule: await createResourceRule(sql, { ...body, resourceId, sectionRole, effectiveFrom }),
      });
    }
    return res.status(400).json({ error: "Unsupported resource action" });
  } catch (error) {
    const status = error.code === "23505" || /overlaps|duplicate/i.test(error.message) ? 409
      : error.code === "22P02" || /invalid|required|must be/i.test(error.message) ? 400
        : /not found/i.test(error.message) ? 404
          : error.statusCode || 500;
    return res.status(status).json({
      error: "Content resources API failed",
      code: error.code || null,
      message: error.message,
    });
  }
};
