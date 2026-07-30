// Compatibility tombstone for the retired single-request Section AI processor.
// The active flow is split across plan and asset jobs. Keeping this route as a
// deterministic 410 prevents old clients from mutating valid runs to `failed`.
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(410).json({
    error: "Section design process API has been retired",
    code: "SECTION_DESIGN_PROCESS_RETIRED",
    replacement: "/api/promo-section-design-plan-process",
  });
};
