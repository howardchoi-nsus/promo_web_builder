const {
  getSql,
  fetchSectionRow,
  fetchComponentUsage,
} = require("./_wizard-content-sections-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const sql = getSql();
    let componentId = String(req.query.componentId || "").trim();
    const sectionId = String(req.query.sectionId || req.query.id || "").trim();
    if (!componentId && sectionId) {
      const section = await fetchSectionRow(sql, sectionId);
      componentId = String(section?.component_id || "");
    }
    if (!componentId) return res.status(400).json({ error: "componentId is required" });
    const templates = await fetchComponentUsage(sql, componentId, {
      includeArchived: String(req.query.includeArchived || "").toLowerCase() === "true",
    });
    return res.status(200).json({ ok: true, componentId, templateCount: templates.length, templates });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Section component usage API failed",
      message: error.message,
    });
  }
};
