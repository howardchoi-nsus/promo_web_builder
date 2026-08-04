const { getSql, parseBody } = require("./_wizard-form-templates-store");
const {
  fetchShellVersions,
  fetchShellVersion,
  createShell,
  cloneShellVersion,
  updateShellDraft,
  activateShellVersion,
} = require("./_promo-composition-shells-store");

module.exports = async function handler(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store");
    const sql = getSql();

    if (req.method === "GET") {
      const versionId = String(req.query.versionId || "").trim();
      if (versionId) {
        const version = await fetchShellVersion(sql, versionId);
        return version
          ? res.status(200).json({ ok: true, version })
          : res.status(404).json({ error: "Composition shell version not found" });
      }
      const activeOnly = String(req.query.activeOnly || "").toLowerCase() === "true"
        || String(req.query.scope || "").toLowerCase() === "public";
      const versions = await fetchShellVersions(sql, {
        activeOnly,
        shellKey: String(req.query.shellKey || "").trim(),
      });
      return res.status(200).json({ ok: true, versions });
    }

    const body = parseBody(req.body);
    if (req.method === "POST") {
      const sourceVersionId = String(body.sourceVersionId || "").trim();
      if (sourceVersionId) {
        const version = await cloneShellVersion(sql, sourceVersionId, body.changeNote);
        return res.status(201).json({ ok: true, version });
      }
      const shellKey = String(body.shellKey || "").trim();
      const name = String(body.name || "").trim();
      if (!shellKey || !name) return res.status(400).json({ error: "shellKey and name are required" });
      const version = await createShell(sql, { ...body, shellKey, name });
      return res.status(201).json({ ok: true, version });
    }

    if (req.method === "PATCH") {
      const versionId = String(body.versionId || req.query.versionId || "").trim();
      if (!versionId) return res.status(400).json({ error: "versionId is required" });
      if (body.action === "activate") {
        const version = await activateShellVersion(sql, versionId, body.changeNote);
        return res.status(200).json({ ok: true, version });
      }
      const version = await updateShellDraft(sql, versionId, body);
      return version
        ? res.status(200).json({ ok: true, version })
        : res.status(409).json({ error: "Only draft composition shell versions can be edited" });
    }

    res.setHeader("Allow", "GET, POST, PATCH");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    const status = /not found/i.test(error.message) ? 404
      : error.code === "23505" || /already exists|draft already exists|duplicate key/i.test(error.message) ? 409
        : error.code === "22P02" || /invalid|required|must be/i.test(error.message) ? 400
          : error.statusCode || 500;
    return res.status(status).json({
      error: "Composition shells API failed",
      code: error.code || null,
      message: error.message,
    });
  }
};
