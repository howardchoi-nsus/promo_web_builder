const { getSql, fetchTemplates } = require("./_wizard-form-templates-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const templates = await fetchTemplates(getSql(), { activeOnly: true });
    return res.status(200).json({
      ok: true,
      templates: templates.map(({ id, templateKey, name, description, version, isDefault, updatedAt }) => (
        { id, templateKey, name, description, version, isDefault, updatedAt }
      )),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Public Wizard form templates API failed", message: error.message });
  }
};
