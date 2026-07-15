const { listWizardSectionAudits } = require("./_wizard-section-audit-log");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const logs = await listWizardSectionAudits(req.query || {});
    return res.status(200).json({ ok: true, logs });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Wizard section audit log API failed", message: error.message });
  }
};
