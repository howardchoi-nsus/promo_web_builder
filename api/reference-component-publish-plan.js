const { getSql, parseBody } = require("./_item-components-store");
const { resolveAdminOwner } = require("./_promo-admin-auth");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { buildReferenceComponentPublishPlan } = require("./_reference-component-publishing");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "private, no-store");
    requireBuilderFlag("referenceComponentPublishing");
    resolveAdminOwner(req, res);
    const plan = await buildReferenceComponentPublishPlan(getSql(), parseBody(req.body));
    return res.status(200).json({ ok: true, plan });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Reference component publish plan failed",
      code: error.code || "REFERENCE_COMPONENT_PUBLISH_PLAN_FAILED",
      message: error.message,
    });
  }
};
