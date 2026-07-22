const wizardContentSectionHandler = require("./wizard-content-section");
const { getSql } = require("./_wizard-content-sections-store");

module.exports = async function handler(req, res) {
  if (req.method === "GET" && !String(req.query.id || "").trim()) {
    const componentId = String(req.query.componentId || "").trim();
    if (!componentId) return res.status(400).json({ error: "componentId or id is required" });
    try {
      const rows = await getSql()`
        select id::text
        from wizard_content_sections
        where component_id = ${componentId}::uuid
        order by case status when 'draft' then 0 when 'active' then 1 when 'inactive' then 2 else 3 end,
          version desc
        limit 1
      `;
      if (!rows.length) return res.status(404).json({ error: "Section component not found" });
      req.query = { ...req.query, id: rows[0].id };
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: "Section component API failed",
        message: error.message,
      });
    }
  }
  return wizardContentSectionHandler(req, res);
};
