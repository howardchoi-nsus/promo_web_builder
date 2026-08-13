const { getSql } = require("./_promo-section-design-store");
const { PROMPT_TYPES } = require("./_prompt-template-store");
const { toAiExecutionDisplay } = require("./_ai-execution-display");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "private, no-store");
    const type = String(req.query?.type || "").trim();
    if (!Object.prototype.hasOwnProperty.call(PROMPT_TYPES, type)) {
      return res.status(400).json({ error: "Unsupported prompt type" });
    }
    const sql = getSql();
    const rows = await sql`
      select provider, model
      from prompt_templates
      where type = ${type} and status = 'active'
      limit 1
    `;
    const executionDisplay = toAiExecutionDisplay(rows[0]);
    if (!executionDisplay) {
      return res.status(404).json({ error: "Active prompt execution configuration not found" });
    }
    return res.status(200).json({ ok: true, type, executionDisplay });
  } catch (error) {
    return res.status(500).json({ error: "Prompt execution display lookup failed", message: error.message });
  }
};
