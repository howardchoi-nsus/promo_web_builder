const { buildPromptVariableCatalog } = require("./_prompt-variable-catalog");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    return res.status(200).json({ ok: true, ...buildPromptVariableCatalog() });
  } catch (error) {
    return res.status(500).json({
      error: "Prompt variable catalog failed",
      message: error.message,
      code: "PROMPT_VARIABLE_CATALOG_FAILED",
    });
  }
};
