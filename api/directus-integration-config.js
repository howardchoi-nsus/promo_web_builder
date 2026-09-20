const { parseBody } = require("./_wizard-form-templates-store");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const { builderFlags, requireBuilderFlag } = require("./_promo-builder-flags");
const {
  getSql, listConfigs, createDraft, validateDraft, activateDraft, suspendConfig, listConnectionChecks,
} = require("./_directus-connection-config-store");

module.exports = async function handler(req, res) {
  try {
    requireBuilderFlag("directusConfigManagement");
    res.setHeader("Cache-Control", "no-store");
    const owner = resolveBuilderOwner(req, res, { issue: true });
    const sql = getSql();
    if (req.method === "GET") {
      const [configs, checks] = await Promise.all([
        listConfigs(sql, owner.ownerSubject),
        listConnectionChecks(sql, owner.ownerSubject),
      ]);
      return res.status(200).json({ ok: true, flags: builderFlags(), configs, checks });
    }
    const body = parseBody(req.body);
    if (req.method === "POST") {
      const config = await createDraft(sql, {
        environment: String(body.environment || "development"),
        config: body.config || {},
        ownerSubject: owner.ownerSubject,
      });
      return res.status(201).json({ ok: true, config });
    }
    if (req.method === "PATCH") {
      const id = String(body.id || "").trim();
      if (!id) return res.status(400).json({ error: "id is required" });
      const action = String(body.action || "validate");
      const config = action === "activate"
        ? await activateDraft(sql, { id, ownerSubject: owner.ownerSubject })
        : action === "suspend"
          ? await suspendConfig(sql, { id, ownerSubject: owner.ownerSubject })
          : await validateDraft(sql, { id, ownerSubject: owner.ownerSubject });
      if (!config) return res.status(404).json({ error: "Directus config draft not found" });
      return res.status(200).json({ ok: true, config });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message, code: error.code || "DIRECTUS_CONFIG_FAILED" });
  }
};
